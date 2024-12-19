import { useEffect, useState, useRef } from 'react';
import { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize';
import 'react-quill/dist/quill.snow.css';
import {
  Box,
  Flex,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Link,
  Spinner,
  useToast,
  Checkbox,
} from '@chakra-ui/react';
// import { AskAPI } from '../../../../api';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [ask, setAsk] = useState({});
  const [answer, setAnswer] = useState('');
  const [isContentUpdated, setIsContentUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const quillElement = useRef(null);
  const quillInstance = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const id = +queryParams.get('idx');

  const mimeToExtension = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
  };

  const getExtensionFromMime = (mimeType) => {
    return mimeToExtension[mimeType] || '';
  };

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      if (id) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/admin/inquiries/${id}`,
            {
              headers: {
                Authorization: `${localStorage.getItem('refreshToken')}`,
              },
            }
          );

          setAsk({
            id: response.data.id,
            content: response.data.content,
            title: response.data.title,
            category: response.data.category,
            isSecret: response.data.isSecret,
            image: response.data.image,
            email: response.data.email,
            emailChecked: response.data.emailChecked,
            answer: response.data.answer,
            createdDate: response.data.createdDate,
          });
        } catch (error) {
          console.error('Failed to fetch notice:', error);
        }
      }
      setIsLoading(false);
    }
    fetchData();
  }, [location.search]);

  const handleCreate = async () => {
    const userConfirmed = window.confirm(
      '답변을 등록하시겠나요? 등록된 답변은 수정할 수 없습니다.'
    );

    if (userConfirmed) {
      try {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/admin/inquiries/${id}/reply`,
          { answer: answer },
          {
            headers: {
              Authorization: `${localStorage.getItem('refreshToken')}`,
            },
          }
        );
        navigate('/askList');
      } catch (error) {
        alert('등록 에러', error);
        return 'error';
      }
    }
  };

  const handleUpdate = async () => {
    // const userConfirmed = window.confirm('1:1문의를 수정하시겠나요?');
    // if (userConfirmed) {
    //   try {
    //     await AskAPI.updateAsk({ id: idx, data: ask });
    //     toast({
    //       title: "1:1 문의가 수정되었습니다.",
    //       status: "success",
    //       isClosable: true,
    //     });
    //     return "success";
    //   } catch (error) {
    //     toast({
    //       title: "오류가 발생했습니다.",
    //       status: "error",
    //       isClosable: true,
    //     });
    //     return "error";
    //   }
    // }
  };

  const handleDelete = async () => {
    const userConfirmed = window.confirm(
      '1:1문의를 삭제하시겠나요? 삭제한 글은 복구되지 않습니다.'
    );

    if (userConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/admin/inquiries/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem('refreshToken')}`,
            },
          }
        );
        navigate('/askList');
        navigate(0);
      } catch (error) {
        alert('오류가 발생했습니다.');
      }
    }
  };

  const handleCancle = () => {
    const userConfirmed = window.confirm(
      '작성을 취소하시겠나요? 작성 중인 글은 저장되지 않습니다.'
    );

    if (userConfirmed) {
      try {
        navigate('/askList');
      } catch (error) {
        alert('오류가 발생했습니다.');
      }
    }
  };

  const base64ToBlob = (base64) => {
    const byteString = atob(base64.split(',')[1]);
    const mimeType = base64.match(/data:(.*?);base64/)[1];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeType });
  };

  const uploadImageToServer = async (blobUrl) => {
    const formData = new FormData();
    const file = blobUrl;
    const extension = getExtensionFromMime(file.type);
    const fileName = `editor_embeded${extension}`;

    formData.append('file', file, fileName);

    for (let pair of formData.entries()) {
      alert(`${pair[0]}: ${pair[1]}`);
    }
  };

  const changeContents = async () => {
    let answer = quillInstance.current.root.innerHTML;

    const parser = new DOMParser();
    const doc = parser.parseFromString(answer, 'text/html');
    const images = doc.querySelectorAll('img');

    const uploadImageAndChangeURL = Array.from(images).map(async (image) => {
      try {
        const base64url = image.src;

        if (base64url.startsWith('data:image')) {
          const blobUrl = base64ToBlob(base64url);
          const downloadUrl = await uploadImageToServer(blobUrl);
          image.src = downloadUrl;
        }
      } catch (error) {
        console.error('Error processing image:', error);
      }
    });

    await Promise.all(uploadImageAndChangeURL);

    const updatedContents = doc.body.innerHTML;
    setAnswer(updatedContents);
    setIsContentUpdated(true);
  };

  useEffect(() => {
    if (isContentUpdated) {
      const submitData = async () => {
        setIsLoading(true);
        try {
          let result;
          if (ask.answer === null) {
            result = await handleCreate();
          } else {
            result = await handleUpdate();
          }

          if (result === 'error') {
            setIsLoading(false);
            alert('오류가 발생했습니다.');
            return;
          }

          setIsLoading(false);
          navigate(0);
          if (!id) {
            navigate('/askList');
          }
        } catch (error) {
          alert(error);
          setIsLoading(false);
        }
      };
      submitData();
    }
  }, [isContentUpdated]);

  const handleSubmit = async () => {
    if (!quillInstance.current.root.innerHTML) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    await changeContents();
  };

  return (
    <Box>
      {isLoading && <Spinner />}
      {!isLoading && (
        <AskForm
          data={ask}
          quillElement={quillElement}
          quillInstance={quillInstance}
          onDelete={handleDelete}
          onSubmit={handleSubmit}
          onCancle={handleCancle}
        />
      )}
    </Box>
  );
};

const AskForm = ({
  data,
  onDelete,
  quillElement,
  quillInstance,
  onSubmit,
  onCancle,
}) => {
  const {
    answer,
    content,
    email,
    emailChecked,
    createdDate,
    isSecret,
    title,
    category,
    image,
  } = data;
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const today = `${year}-${month >= 10 ? month : '0' + month}-${
    day >= 10 ? day : '0' + day
  }`;

  const askType = ['회원정보', '선한가게신청', '후원', '기타', '학생'];

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [
        { list: 'ordered' },
        { list: 'bullet' },
        { indent: '-1' },
        { indent: '+1' },
      ],
      ['image'],
      [{ align: [] }, { color: [] }, { background: [] }],
      ['clean'],
    ],
    ImageResize: {
      parchment: {
        image: {
          attributes: ['width', 'height', 'align'],
        },
      },
    },
  };

  Quill.register('modules/ImageResize', ImageResize);

  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    quillInstance.current = new Quill(quillElement.current, {
      theme: 'snow',
      placeholder: '내용을 작성해주세요.',
      modules: modules,
    });
    setInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!initialLoad && quillInstance.current && answer) {
      const quill = quillInstance.current;
      const range = quill.getSelection();

      if (range) {
        quill.setSelection(range);
      }
    }
  }, [answer, initialLoad]);

  useEffect(() => {
    try {
      if (answer) {
        const quill = quillInstance.current;
        const formattedAnswer = answer.replace(/\n/g, '<br>');
        const delta = quill.clipboard.convert(formattedAnswer);
        quill.setContents(delta, 'silent');
      }
    } catch (error) {
      console.error('Quill 초기화 실패', error);
    }
  }, [answer]);

  return (
    <Box overflowX="auto">
      <Table variant="simple" w="full" borderTop="2px solid">
        <colgroup>
          <col width="15%" />
          <col width="20%" />
          <col width="15%" />
          <col width="25%" />
          <col width="15%" />
          <col width="10%" />
        </colgroup>
        <Tbody>
          <Tr>
            <Th>문의구분</Th>
            <Td>{askType.find((type) => type === category)}</Td>
            <Th>수신 이메일</Th>
            <Td>{email}</Td>
            <Th>이메일 수신여부</Th>
            <Td>
              <Checkbox isChecked={emailChecked} readOnly colorScheme="blue" />
            </Td>
          </Tr>
          <Tr>
            <Th>제목</Th>
            <Td colSpan={3}>
              <Box p={2}>{title}</Box>
            </Td>
            <Th>비밀글 여부</Th>
            <Td>
              <Checkbox isChecked={isSecret} readOnly colorScheme="blue" />
            </Td>
          </Tr>
          <Tr>
            <Th>첨부파일</Th>
            <Td colSpan={3}>
              {image && <img src={`${image}`} alt="attachment" />}
            </Td>
            <Th>등록일</Th>
            <Td>{createdDate?.slice(0, 10)}</Td>
          </Tr>
          <Tr>
            <Th>내용</Th>
            <Td colSpan={5}>
              <Box p={2} whiteSpace="pre-wrap">
                {content}
              </Box>
            </Td>
          </Tr>
        </Tbody>
      </Table>

      <Table variant="simple" w="full" borderTop="2px solid" mt={4}>
        <colgroup>
          <col width="15%" />
          <col width="85%" />
        </colgroup>
        <Tbody>
          <Tr>
            <Th>답변일</Th>
            <Td>{today}</Td>
          </Tr>
          <Tr>
            <Th>답변</Th>
            <Td>
              <Box
                id="quill-element"
                ref={quillElement}
                style={{ height: '200px' }}
              />
            </Td>
          </Tr>
        </Tbody>
      </Table>

      <Flex justify="space-between" py={4}>
        <Button opacity="0">선택항목 엑셀받기</Button>
        <Flex gap={2}>
          <Button
            onClick={onSubmit}
            px={12}
            py={2}
            borderRadius="none"
            bg="main"
            color="white"
          >
            저장
          </Button>
          <Button
            onClick={onCancle}
            px={12}
            py={2}
            borderRadius="none"
            bg="gray.500"
            color="white"
          >
            취소
          </Button>
        </Flex>
        <Button
          onClick={onDelete}
          px={12}
          py={2}
          borderRadius="none"
          bg="gray.500"
          color="white"
        >
          삭제
        </Button>
      </Flex>
    </Box>
  );
};

export default Index;
