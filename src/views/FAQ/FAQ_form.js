import { useEffect, useRef, useState } from 'react';
import {
  Box,
  Flex,
  Button,
  Input,
  Spinner,
  Table,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Link,
} from '@chakra-ui/react';
import { Quill } from 'react-quill';
import ImageResize from 'quill-image-resize';
import 'react-quill/dist/quill.snow.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { makeClearValue } from '../../utils/safe';
import axios from 'axios';
import RatioSimpleInlineList2 from '../../components/common/RatioSimpleInlineList2';
import { VIEW_TYPE } from '../../constants/admin';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [faq, setFaq] = useState({
    title: '',
    isOpened: true,
  });
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [isContentUpdated, setIsContentUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
            `${process.env.REACT_APP_BASE_URL}/api/admin/faqs/${id}`,
            {
              headers: {
                Authorization: `${localStorage.getItem('refreshToken')}`,
              },
            }
          );

          if (response.data.faqFiles !== null) {
            const serverFiles = response.data.faqFiles.map((file) => ({
              ...file,
              oriName: file.originalFileName,
              realName: file.originalFileName,
              state: 'stable',
              type: 'server',
            }));
            setFiles(serverFiles);
          }

          setFaq({
            id: response.data.id,
            content: response.data.content,
            title: response.data.title,
            faqFiles: response.data.faqFiles,
            isOpened: response.data.isOpened,
          });
        } catch (error) {
          console.error('Failed to fetch notice:', error);
        }
      }
      setIsLoading(false);
    }
    fetchData();
  }, [id]);

  const handleFileChange = async (event) => {
    const MAX_FILE_SIZE = 30 * 1024 * 1024;

    const newFiles = Array.from(event.target.files).map((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} 파일 크기는 30MB를 초과할 수 없습니다.`);
        return null;
      }

      const formData = new FormData();
      formData.append('file', file);

      return {
        oriName: file.name,
        realName: file.name,
        state: 'new',
        type: 'local',
        file: formData,
      };
    });

    const validFiles = newFiles.filter((file) => file !== null);
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    setFaq({
      ...faq,
      faqFiles: validFiles.map((file) => file.file),
    });
  };

  const handleDeleteFileChange = (index) => {
    const fileToDelete = files[index];

    if (fileToDelete.type === 'server') {
      setDeletedFiles((prev) => [...prev, fileToDelete.id]);
    }

    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setFaq((prevFaq) => {
      return {
        ...prevFaq,
        faqFiles: prevFaq.faqFiles.filter((_, i) => i !== index),
      };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const clearValue = makeClearValue(value);
    setFaq({ ...faq, [name]: clearValue });
  };

  const handleCreate = async () => {
    const userConfirmed = window.confirm('FAQ를 등록하시겠나요?');
    if (userConfirmed) {
      try {
        const fileList = await Promise.all(
          files.map(async (file) => {
            const fileResponse = await axios.post(
              `${process.env.REACT_APP_BASE_URL}/api/all/file`,
              file.file,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              }
            );

            return fileResponse.data;
          })
        );

        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/admin/faqs`,
          {
            ...faq,
            faqFiles: fileList,
          },
          {
            headers: {
              Authorization: `${localStorage.getItem('refreshToken')}`,
            },
          }
        );
        navigate('/FAQList');
      } catch (error) {
        alert('등록 에러', error);
        return 'error';
      }
    }
  };

  const handleUpdate = async () => {
    const userConfirmed = window.confirm('FAQ를 수정하시겠나요?');
    if (userConfirmed) {
      try {
        if (!id) return;
        const fileList = await Promise.all(
          files
            .filter((file) => file.type === 'local')
            .map(async (file) => {
              const fileResponse = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/all/file`,
                file.file,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                }
              );

              return fileResponse.data;
            })
        );

        await axios.patch(
          `${process.env.REACT_APP_BASE_URL}/api/admin/faqs/${id}`,
          {
            ...faq,
            faqFiles: [...faq.faqFiles, ...fileList],
          },
          {
            headers: {
              Authorization: `${localStorage.getItem('refreshToken')}`,
            },
          }
        );
        navigate('/FAQList');
      } catch (error) {
        alert('수정 에러', error);
        return 'error';
      }
    }
  };

  const handleDelete = async () => {
    const userConfirmed = window.confirm(
      'FAQ를 삭제하시겠나요? 삭제한 글은 복구되지 않습니다.'
    );

    if (userConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/admin/faqs/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem('refreshToken')}`,
            },
          }
        );
        navigate('/FAQList');
        navigate(0);
      } catch (error) {
        alert('오류가 발생했습니다.');
      }
    }
  };

  const handleDeleteFile = async () => {
    // try {
    //   const data = { idxs: [...deletedFiles] };
    //   const deleteResult = await FaqAPI.deleteFileFaq({ data });
    // } catch (error) {
    //   console.log('에러', error);
    //   alert('오류가 발생했습니다.');
    // }
  };

  const handleCancle = () => {
    const userConfirmed = window.confirm(
      '작성을 취소하시겠나요? 작성 중인 글은 저장되지 않습니다.'
    );

    if (userConfirmed) {
      try {
        navigate('/FAQList');
      } catch (error) {
        alert('오류가 발생했습니다.');
      }
    }
  };

  const handleAddFile = async (result) => {
    const formData = new FormData();
    let hasAddedFile = false;
    let latestIdx = result;

    files.forEach((file) => {
      if (file.state === 'new' && file.type === 'local') {
        formData.append('files', file.file);
        hasAddedFile = true;
      }
    });

    if (!hasAddedFile) return 'success';

    // try {
    //   const addResult = await FaqAPI.addFileFaq({
    //     id: idx ? idx : latestIdx,
    //     data: formData,
    //   });

    //   return 'success';
    // } catch (error) {
    //   console.log('에러', error);
    //   return 'error'; // 오류 발생
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
      alert(`${pair[0]}: ${pair[1]}`);
    }

    // try {
    //   const result = await FaqAPI.uploadFaqImage({ data: formData });
    //   return result.message;
    // } catch (error) {
    //   console.log('에러', error);
    //   alert('오류가 발생했습니다.');
    // }
  };

  const changeContent = async () => {
    let content = quillInstance.current.root.innerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
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
    setFaq((prevFaq) => ({ ...prevFaq, content: updatedContents }));
    setIsContentUpdated(true);
  };

  useEffect(() => {
    if (isContentUpdated) {
      const submitData = async () => {
        setIsLoading(true);
        try {
          let result;
          if (!id) {
            result = await handleCreate();
          } else {
            result = await handleUpdate();
          }

          if (result === 'error') {
            setIsLoading(false);
            alert('오류가 발생했습니다.');
            return;
          }

          await handleAddFile(result);

          setIsLoading(false);
          navigate(0);
          if (!id) {
            navigate('/FAQList');
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
    if (!faq.title || !quillInstance.current.root.innerHTML) {
      alert('모든 필수 항목을 입력해주세요.');
      return;
    }

    await changeContent();
  };

  return (
    <Box>
      {isLoading && <Spinner />}
      {!isLoading && (
        <FAQForm
          data={faq}
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
      )}
    </Box>
  );
};

const FAQForm = ({
  data,
  files,
  quillElement,
  quillInstance,
  onChange,
  onFileChange,
  onDeleteFileChange,
  onDelete,
  onSubmit,
  onCancle,
}) => {
  const { title, content, isOpened } = data;
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const today = `${year}-${month >= 10 ? month : '0' + month}-${
    day >= 10 ? day : '0' + day
  }`;

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
    if (!initialLoad && quillInstance.current && content) {
      const quill = quillInstance.current;
      const range = quill.getSelection();

      if (range) {
        quill.setSelection(range);
      }
    }
  }, [content, initialLoad]);

  useEffect(() => {
    try {
      if (content) {
        const quill = quillInstance.current;
        const delta = quill.clipboard.convert(content);
        quill.setContents(delta, 'silent');
      }
    } catch (error) {
      alert('quill 초기화', error);
    }
  }, []);

  return (
    <Box overflowX="auto" h="full">
      <Table variant="simple" w="full" borderTop="2px solid">
        <colgroup>
          <col width="20%" />
          <col width="30%" />
          <col width="20%" />
          <col width="30%" />
        </colgroup>
        <Tbody>
          <Tr>
            <Th>등록일</Th>
            <Td>{today}</Td>
            <Th>
              게재 여부<span style={{ color: 'red' }}> *</span>
            </Th>
            <Td>
              <RatioSimpleInlineList2
                name={'isOpened'}
                defaultValue={isOpened}
                options={VIEW_TYPE}
                handleChange={onChange}
              />
            </Td>
          </Tr>
          <Tr>
            <Th>
              제목{' '}
              <Text as="span" color="red.400">
                {' '}
                *
              </Text>
            </Th>
            <Td colSpan={4}>
              <ChakraInput
                value={title}
                onChange={onChange}
                placeholder="제목을 입력하세요"
              />
            </Td>
          </Tr>
          <Tr>
            <Th>
              내용{' '}
              <Text as="span" color="red.400">
                {' '}
                *
              </Text>
            </Th>
            <Td colSpan={4}>
              <div
                id="quill-element"
                ref={quillElement}
                style={{ height: '300px' }}
              />
            </Td>
          </Tr>
          <Tr>
            <Th>파일</Th>
            <Td colSpan={4}>
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
                  zIndex={1}
                />
                <Button
                  w={'24'}
                  h={'8 md:h-10'}
                  fontSize={'xs md:text-sm'}
                  zIndex={0}
                >
                  파일첨부
                </Button>
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
                      onClick={() => onDeleteFileChange(index)}
                      variant="link"
                      color="red.500"
                      ml={2}
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

const ChakraInput = ({ value, placeholder, onChange }) => {
  return (
    <Input
      type="text"
      name="title"
      id="title"
      value={value}
      onChange={onChange}
      borderColor="gray.200"
      textColor="gray.900"
      shadow="sm"
      ring={1}
      ringColor="gray.300"
      _placeholder={{ color: 'gray.400' }}
      focusBorderColor="indigo.600"
      fontSize="sm"
      placeholder={placeholder}
    />
  );
};

export default Index;
