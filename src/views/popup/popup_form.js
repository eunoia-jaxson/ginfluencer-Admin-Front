import { useEffect, useRef, useState } from "react";
import {
  Box,
  Flex,
  Button,
  Text,
  Checkbox,
  Input,
  Textarea,
  Spinner,
  Link,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import ImageResize from "quill-image-resize";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useLocation } from "react-router-dom";
import RatioSimpleInlineList2 from "../../components/common/RatioSimpleInlineList2";
import { VIEW_TYPE } from "../../constants/admin";
import { makeClearValue } from "../../utils/safe";
import HoverButton from "../../components/common/HoverButton";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [popup, setPopup] = useState({});
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [isContentUpdated, setIsContentUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const quillElement = useRef(null);
  const quillInstance = useRef(null);

  const queryParams = new URLSearchParams(location.search);
  const idx = +queryParams.get("idx");

  const mimeToExtension = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "application/pdf": ".pdf",
  };

  const getExtensionFromMime = (mimeType) => {
    return mimeToExtension[mimeType] || "";
  };

  //   useEffect(() => {
  //     async function fetchData() {
  //       setIsLoading(true);
  //       if (idx) {
  //         try {
  //           const result = await popupAPI.getpopup({ id: idx });
  //           setPopup({
  //             idx: result.idx,
  //             contents: result.contents,
  //             title: result.title,
  //             regDt: result.regDt.split(" ")[0],
  //             viewYn: result.viewYn || "Y",
  //           });
  //         } catch (error) {
  //           console.error("Failed to fetch notice:", error);
  //         }
  //       }
  //       setIsLoading(false);
  //     }
  //     fetchData();
  //   }, [idx]); // Only depend on `idx` for fetching data

  const handleFileChange = async (event) => {
    const MAX_FILE_SIZE = 30 * 1024 * 1024;

    const newFiles = Array.from(event.target.files).map((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} 파일 크기는 30MB를 초과할 수 없습니다.`);
        return null;
      }

      return {
        id: null,
        oriName: file.name,
        realName: file.name,
        state: "new",
        type: "local",
        file,
      };
    });

    const validFiles = newFiles.filter((file) => file !== null);
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
  };

  const handleDeleteFileChange = (index) => {
    const fileToDelete = files[index];

    if (fileToDelete.type === "server") {
      setDeletedFiles((prev) => [...prev, fileToDelete.idx]);
    }

    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    const clearValue = makeClearValue(value);
    setPopup({ ...popup, [name]: clearValue });
  };

  const handleCreate = async () => {
    const userConfirmed = window.confirm("popup를 등록하시겠나요?");

    // if (userConfirmed) {
    //   try {
    //     const { popupIdx } = await popupAPI.createpopup({ data: popup });
    //     return popupIdx;
    //   } catch (error) {
    //     console.log('등록에러', error);
    //     return 'error';
    //   }
    // }
  };

  const handleUpdate = async () => {
    const userConfirmed = window.confirm("popup를 수정하시겠나요?");

    // if (userConfirmed) {
    //   try {
    //     if (!idx) return;
    //     const result = await popupAPI.updatepopup({ id: idx, data: popup });
    //     console.log('수정완료', result);
    //     return 'success';
    //   } catch (error) {
    //     return 'error';
    //   }
    // }
  };

  const handleDelete = async () => {
    const userConfirmed = window.confirm(
      "popup를 삭제하시겠나요? 삭제한 글은 복구되지 않습니다."
    );

    // if (userConfirmed) {
    //   try {
    //     const result = await popupAPI.deletepopup({ id: idx });
    //     navigate('/admin/popupList');
    //     navigate(0);
    //   } catch (error) {
    //     alert('오류가 발생했습니다.');
    //   }
    // }
  };

  const handleDeleteFile = async () => {
    // try {
    //   const data = { idxs: [...deletedFiles] };
    //   const deleteResult = await popupAPI.deleteFilepopup({ data });
    // } catch (error) {
    //   console.log('에러', error);
    //   alert('오류가 발생했습니다.');
    // }
  };

  const handleAddFile = async (result) => {
    const formData = new FormData();
    let hasAddedFile = false;
    let latestIdx = result;

    files.forEach((file) => {
      if (file.state === "new" && file.type === "local") {
        formData.append("files", file.file);
        hasAddedFile = true;
      }
    });

    if (!hasAddedFile) return "success";

    // try {
    //   const addResult = await popupAPI.addFilepopup({
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
    const byteString = atob(base64.split(",")[1]);
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

    formData.append("file", file, fileName);

    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    // try {
    //   const result = await popupAPI.uploadpopupImage({ data: formData });
    //   return result.message;
    // } catch (error) {
    //   console.log('에러', error);
    //   alert('오류가 발생했습니다.');
    // }
  };

  const changeContents = async () => {
    let contents = quillInstance.current.root.innerHTML;
    const parser = new DOMParser();
    const doc = parser.parseFromString(contents, "text/html");
    const images = doc.querySelectorAll("img");

    const uploadImageAndChangeURL = Array.from(images).map(async (image) => {
      try {
        const base64url = image.src;

        if (base64url.startsWith("data:image")) {
          const blobUrl = base64ToBlob(base64url);
          const downloadUrl = await uploadImageToServer(blobUrl);
          // image.src = downloadUrl;
        }
      } catch (error) {
        console.error("Error processing image:", error);
      }
    });

    await Promise.all(uploadImageAndChangeURL);

    const updatedContents = doc.body.innerHTML;
    setPopup((prevpopup) => ({ ...prevpopup, contents: updatedContents }));
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

          await handleAddFile(result);

          setIsLoading(false);
          navigate(0);
          if (!idx) {
            navigate("/post?type=popup");
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
    if (
      !popup.title ||
      !popup.viewYn ||
      !quillInstance.current.root.innerHTML
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    await changeContents();
  };

  return (
    <Box>
      {isLoading && <Spinner />}
      <PopupForm
        data={popup}
        files={files}
        quillElement={quillElement}
        quillInstance={quillInstance}
        onChange={onChange}
        onFileChange={handleFileChange}
        onDeleteFileChange={handleDeleteFileChange}
        onDelete={handleDelete}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

const PopupForm = ({
  data,
  files,
  quillElement,
  quillInstance,
  onChange,
  onFileChange,
  onDeleteFileChange,
  onDelete,
  onSubmit,
  onCancel,
}) => {
  const { title, contents, type, viewYn } = data;

  return (
    <Box
      as="form"
      p="8"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="md"
      maxW="2xl"
      mx="auto"
      bg="white"
    >
      <Table width="100%">
        <Thead>
          <Tr>
            <Th>제목</Th>
            <Td>
              <ChakraInput
                type="text"
                name="title"
                value={data.title}
                onChange={onChange}
                borderColor="gray.300"
                focusBorderColor="blue.300"
              />
            </Td>
          </Tr>
        </Thead>

        <Tbody>
          <Tr>
            <Th>본문 내용</Th>
            <Td>
              <Textarea
                name="contents"
                value={data.contents}
                onChange={onChange}
                rows={4}
                borderColor="gray.300"
                focusBorderColor="blue.300"
              />
            </Td>
          </Tr>

          <Tr>
            <Th>공지사항 인덱스</Th>
            <Td>
              <NumberInput
                name="noticeIdx"
                value={data.noticeIdx}
                onChange={(valueString) => {
                  onChange({
                    target: {
                      name: "noticeIdx",
                      value: valueString,
                    },
                  });
                }}
                min={0}
                max={100}
                borderColor="gray.300"
                focusBorderColor="blue.300"
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Td>
          </Tr>

          <Tr>
            <Th>이미지</Th>
            <Td>
              <HoverButton
                title="파일 선택"
                w="24"
                h="8 md:h-10"
                textSize="xs md:text-sm"
                data={null}
                onPass={null}
              />
              {data.oriName && (
                <Box mt="2">
                  <Link
                    href={`file/notice/popup/${data.realName}`}
                    download={data.oriName}
                    style={{ textDecoration: "underline" }}
                  >
                    {data.oriName}
                  </Link>
                </Box>
              )}
            </Td>
          </Tr>

          <Tr>
            <Td colSpan={2}>
              <Flex alignItems="center">
                <Th>팝업 표시 여부</Th>
                <Checkbox
                  isChecked={data.viewYn === "Y"}
                  onChange={() =>
                    onChange({
                      target: {
                        name: "viewYn",
                        value: data.viewYn === "Y" ? "N" : "Y",
                      },
                    })
                  }
                  ml="4"
                />
              </Flex>
            </Td>
          </Tr>
        </Tbody>
      </Table>

      <Button
        type="submit"
        colorScheme="blue"
        w="full"
        mt="4"
        isLoading={false}
      >
        생성하기
      </Button>
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
      _placeholder={{ color: "gray.400" }}
      focusBorderColor="indigo.600"
      fontSize="sm"
      placeholder={placeholder}
    />
  );
};
export default Index;
