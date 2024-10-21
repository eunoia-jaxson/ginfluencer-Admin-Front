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
  Input,
  Button,
  Link,
  Spinner,
  useToast,
} from '@chakra-ui/react';
import HoverButton from '../../components/common/HoverButton';
// import { AskAPI } from '../../../../api';
import { useNavigate, useLocation } from 'react-router-dom';
import { makeClearValue } from '../../utils/safe';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const toast = useToast();

  const [ask, setAsk] = useState({});
  const [files, setFiles] = useState([]); // local에 선택된 파일들 정보저장
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [isContentUpdated, setIsContentUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  const quillElement = useRef(null);
  const quillInstance = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const idx = +queryParams.get('idx');

  const mimeToExtension = {
    'image/jpeg': '.jpg',
    'image/png': '.png',
    'image/gif': '.gif',
    'application/pdf': '.pdf',
  };

  const getExtensionFromMime = (mimeType) => {
    return mimeToExtension[mimeType] || '';
  };

  // useEffect(() => {
  //   async function fetchData() {
  //     setIsLoading(true);
  //     if (idx) {
  //       try {
  //         const result = await AskAPI.getAsk({ id: idx });
  //         const serverFiles = await result.askFile.map((file) => ({
  //           ...file,
  //           state: "stable",
  //           type: "server",
  //         }));
  //         setAsk(result);
  //         setFiles(serverFiles);
  //       } catch (error) {
  //         console.error("Failed to fetch ASK:", error);
  //       }
  //     }
  //     setIsLoading(false);
  //   }
  //   fetchData();
  // }, [location.search]);

  const handleFileChange = async (event) => {
    const MAX_FILE_SIZE = 30 * 1024 * 1024; // 10MB in bytes

    const newFiles = Array.from(event.target.files).map((file) => {
      if (file.size > MAX_FILE_SIZE) {
        toast({
          title: `${file.name} 파일 크기는 30MB를 초과할 수 없습니다.`,
          status: 'error',
          isClosable: true,
        });
        return null;
      }

      return {
        id: null,
        oriName: file.name,
        realName: file.name,
        state: 'new',
        type: 'local',
        file,
      };
    });

    const validFiles = newFiles.filter((file) => file !== null);
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleDeleteFileChange = (index) => {
    const fileToDelete = files[index];

    if (fileToDelete.type === 'server') {
      setDeletedFiles((prev) => [...prev, fileToDelete.idx]);
    }

    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const clearValue = makeClearValue(value);
    setAsk({ ...ask, [name]: clearValue });
  };

  const handleCreate = async () => {
    const userConfirmed = window.confirm('1:1문의를 등록하시겠나요?');

    // if (userConfirmed) {
    //   try {
    //     await AskAPI.createAsk({ data: ask });
    //     toast({
    //       title: "1:1 문의가 등록되었습니다.",
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
    //   }
    // }
  };

  const handleUpdate = async () => {
    const userConfirmed = window.confirm('1:1문의를 수정하시겠나요?');

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

    // if (userConfirmed) {
    //   try {
    //     await AskAPI.deleteAsk({ id: idx });
    //     navigate("/admin/ASKList");
    //     navigate(0);
    //   } catch (error) {
    //     toast({
    //       title: "오류가 발생했습니다.",
    //       status: "error",
    //       isClosable: true,
    //     });
    //   }
    // }
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

  const handleDeleteFile = async () => {
    try {
      const data = { idxs: [...deletedFiles] };
      // await AskAPI.deleteFileAsk({ data });
    } catch (error) {
      console.log('에러', error);
      toast({
        title: '파일 삭제 중 오류가 발생했습니다.',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleAddFile = async () => {
    const formData = new FormData();
    let hasAddedFile = false;

    files.forEach((file) => {
      if (file.state === 'new' && file.type === 'local') {
        formData.append('files', file.file);
        hasAddedFile = true;
      }
    });

    if (!hasAddedFile) return 'success';

    // try {
    //   await AskAPI.addFileAsk({ id: idx, data: formData });
    //   return "success";
    // } catch (error) {
    //   console.log("에러", error);
    //   return "error";
    // }
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
      console.log(`${pair[0]}: ${pair[1]}`);
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
          // image.src = downloadUrl;
        }
      } catch (error) {
        console.error('Error processing image:', error);
      }
    });

    await Promise.all(uploadImageAndChangeURL);

    const updatedContents = doc.body.innerHTML;
    setAsk((prev) => ({ ...prev, answer: updatedContents, answerYn: 'Y' }));
    setIsContentUpdated(true);
  };

  useEffect(() => {
    if (isContentUpdated) {
      const submitData = async () => {
        setIsLoading(true);
        try {
          let result;
          if (!idx) {
            result = await handleCreate();
          } else {
            result = await handleUpdate();
          }

          // if (result === "error") {
          //   setIsLoading(false);
          //   alert("오류가 발생했습니다.");
          //   return;
          // }

          await handleAddFile();

          if (deletedFiles.length > 0) {
            await handleDeleteFile();
          }

          setIsLoading(false);
          navigate(0);
          if (!idx) {
            navigate('/admin/askList');
          }
        } catch (error) {
          console.log(error);
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
      <AskForm
        data={ask}
        files={files}
        quillElement={quillElement}
        quillInstance={quillInstance}
        onChange={handleChange}
        onFileChange={handleFileChange}
        onDeleteFileChange={handleDeleteFileChange}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
        onCancle={handleCancle}
      />
    </Box>
  );
};

const AskForm = ({
  data,
  onChange,
  onFileChange,
  onDeleteFileChange,
  onDelete,
  files,
  quillElement,
  quillInstance,
  onSubmit,
  onCancle,
}) => {
  const {
    answer,
    answerDt,
    answerYn,
    contents,
    notiEmail,
    notiYn,
    regDt,
    secretYn,
    title,
    type,
    fileName,
    filePath,
  } = data;

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
            <Td>{askType[type - 1]}</Td>
            <Th>수신 이메일</Th>
            <Td>{notiEmail}</Td>
            <Th>이메일 수신여부</Th>
            <Td>{notiYn}</Td>
          </Tr>
          <Tr>
            <Th>제목</Th>
            <Td colSpan={3}>
              <Box p={2}>{title}</Box>
            </Td>
            <Th>비밀글 여부</Th>
            <Td>{secretYn}</Td>
          </Tr>
          <Tr>
            <Th>첨부파일</Th>
            <Td colSpan={3}>
              <Link
                href={`/file/ask/${filePath}`}
                download={fileName}
                textDecoration="underline"
              >
                {fileName}
              </Link>
            </Td>
            <Th>등록일</Th>
            <Td>{regDt}</Td>
          </Tr>
          <Tr>
            <Th>내용</Th>
            <Td colSpan={5}>
              <Box p={2} whiteSpace="pre-wrap">
                {contents}
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
            <Td>{answerDt}</Td>
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
          <Tr>
            <Th>파일</Th>
            <Td>
              <Box position="relative" display="inline-block">
                <Input
                  type="file"
                  id="fileUpload"
                  position="absolute"
                  inset="0"
                  width="full"
                  height="full"
                  opacity="0"
                  cursor="pointer"
                  onChange={onFileChange}
                  multiple
                />
                <HoverButton
                  title="파일첨부"
                  w="24"
                  h="8 md:h-10"
                  textSize="xs md:text-sm"
                  data={null}
                  onPass={null}
                />
              </Box>
              <Box mt={2}>
                {files.map((file, index) => (
                  <Flex
                    key={index}
                    align="center"
                    fontSize="sm"
                    color="gray.700"
                  >
                    <Link
                      href={`file/notice/${file.realName}`}
                      download={file.oriName || file.name}
                      textDecoration="underline"
                    >
                      {file.oriName || file.name}
                    </Link>
                    <Button
                      variant="link"
                      color="red.500"
                      ml={2}
                      onClick={() => onDeleteFileChange(index)}
                    >
                      삭제
                    </Button>
                  </Flex>
                ))}
              </Box>
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
