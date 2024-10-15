import { useEffect, useRef, useState } from "react";
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
} from "@chakra-ui/react";
import { Quill } from "react-quill";
import ImageResize from "quill-image-resize";
import "react-quill/dist/quill.snow.css";
import { useNavigate, useLocation } from "react-router-dom";
// import { NoticeAPI } from "../../../../api";
import RatioSimpleInlineList2 from "../../components/common/RatioSimpleInlineList2";
import SelectSimpleCustom2 from "../../components/common/SelectSimpleCustom2";
import { NOTICE_TYPE, VIEW_TYPE } from "../../constants/admin";
import { makeClearValue } from "../../utils/safe";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [notice, setNotice] = useState({
    title: "",
    type: "",
    viewYn: "Y",
  });
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

  // useEffect(() => {
  //   async function fetchData() {
  //     setIsLoading(true);
  //     if (idx) {
  //       try {
  //         const result = await NoticeAPI.getNotice({ id: idx });
  //         const serverFiles = result.noticeFile.map((file) => ({
  //           ...file,
  //           state: "stable",
  //           type: "server",
  //         }));

  //         setNotice({
  //           idx: result.idx,
  //           contents: result.contents,
  //           title: result.title,
  //           type: result.type,
  //           viewYn: result.viewYn ? result.viewYn : "Y",
  //         });
  //         setFiles(serverFiles);
  //       } catch (error) {
  //         console.error("Failed to fetch notice:", error);
  //       }
  //     }
  //     setIsLoading(false);
  //   }
  //   fetchData();
  // }, [location.search]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const clearValue = makeClearValue(value);
    setNotice({ ...notice, [name]: clearValue });
  };

  const handleCreate = async () => {
    const userConfirmed = window.confirm("공지사항을 등록하시겠나요?");
    // if (userConfirmed) {
    //   try {
    //     const { noticeIdx } = await NoticeAPI.createNotice({ data: notice });
    //     return noticeIdx;
    //   } catch (error) {
    //     console.log("등록 에러", error);
    //     return "error";
    //   }
    // }
  };

  const handleUpdate = async () => {
    const userConfirmed = window.confirm("공지사항을 수정하시겠나요?");
    // if (userConfirmed) {
    //   try {
    //     if (!idx) return;
    //     const result = await NoticeAPI.updateNotice({ id: idx, data: notice });
    //     return "success";
    //   } catch (error) {
    //     return "error";
    //   }
    // }
  };

  const handleDelete = async () => {
    const userConfirmed = window.confirm("공지사항을 삭제하시겠나요?");
    // if (userConfirmed) {
    //   try {
    //     await NoticeAPI.deleteNotice({ id: idx });
    //     navigate("/admin/noticeList");
    //     navigate(0);
    //   } catch (error) {
    //     alert("오류가 발생했습니다.");
    //   }
    // }
  };

  const handleCancle = () => {
    const userConfirmed = window.confirm(
      "작성을 취소하시겠나요? 작성 중인 글은 저장되지 않습니다."
    );

    if (userConfirmed) {
      try {
        navigate("/NoticeList");
      } catch (error) {
        alert("오류가 발생했습니다.");
      }
    }
  };

  const handleDeleteFile = async () => {
    // try {
    //   const data = { idxs: [...deletedFiles] };
    //   const deleteResult = await NoticeAPI.deleteFileNotice({ data });
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
    //   await NoticeAPI.addFileNotice({
    //     id: idx ? idx : latestIdx,
    //     data: formData,
    //   });
    //   return "success";
    // } catch (error) {
    //   console.log("파일 추가 에러", error);
    //   return "error";
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
    //   const result = await NoticeAPI.uploadNoticeImage({ data: formData });
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
    setNotice((prevNotice) => ({ ...prevNotice, contents: updatedContents }));
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
            navigate("/admin/noticeList");
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
      !notice.title ||
      !notice.type ||
      !notice.viewYn ||
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
      <NoticeForm
        data={notice}
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

const NoticeForm = ({
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
  const { title, contents, type, viewYn } = data;

  const modules = {
    toolbar: [
      [{ font: [] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["image"],
      [{ align: [] }, { color: [] }, { background: [] }],
      ["clean"],
    ],
    ImageResize: {
      parchment: {
        image: {
          attributes: ["width", "height", "align"],
        },
      },
    },
  };

  Quill.register("modules/ImageResize", ImageResize);

  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    quillInstance.current = new Quill(quillElement.current, {
      theme: "snow",
      placeholder: "내용을 작성해주세요.",
      modules: modules,
    });
    setInitialLoad(false);
  }, []);

  useEffect(() => {
    if (!initialLoad && quillInstance.current && contents) {
      const quill = quillInstance.current;
      const range = quill.getSelection();

      if (range) {
        quill.setSelection(range);
      }
    }
  }, [contents, initialLoad]);

  useEffect(() => {
    try {
      if (contents) {
        const quill = quillInstance.current;
        const delta = quill.clipboard.convert(contents);
        quill.setContents(delta, "silent");
      }
    } catch (error) {
      console.log("quill 초기화", error);
    }
  }, []);

  return (
    <Box overflowX="auto" h="full">
      <Table
        variant="simple"
        width="full"
        borderTopWidth="2px"
        borderStyle="solid"
      >
        <colgroup>
          <col width="20%" />
          <col width="30%" />
          <col width="20%" />
          <col width="30%" />
        </colgroup>
        <Tbody>
          <Tr>
            <Th>
              구분<span style={{ color: "red" }}> *</span>
            </Th>
            <Td>
              <SelectSimpleCustom2
                defaultValue={type}
                options={NOTICE_TYPE}
                handleChange={onChange}
              />
            </Td>
            <Th>
              게재 여부<span style={{ color: "red" }}> *</span>
            </Th>
            <Td>
              <RatioSimpleInlineList2
                name={"viewYn"}
                defaultValue={viewYn}
                options={VIEW_TYPE}
                handleChange={onChange}
              />
            </Td>
          </Tr>
          <Tr>
            <Th>
              제목<span style={{ color: "red" }}> *</span>
            </Th>
            <Td colSpan={4}>
              <ChakraInput value={title} onChange={onChange} placeholder={""} />
            </Td>
          </Tr>
          <Tr>
            <Th>
              내용<span style={{ color: "red" }}> *</span>
            </Th>
            <Td colSpan={4}>
              <div
                id="quill-element"
                ref={quillElement}
                style={{ height: "300px" }}
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
                />
                <HoverButton
                  title={"파일첨부"}
                  w={"24"}
                  h={"8 md:h-10"}
                  textSize={"xs md:text-sm"}
                  data={null}
                  onPass={null}
                />
              </Box>
              <Box mt={2}>
                {files.map((file, index) => (
                  <Flex
                    key={index}
                    alignItems="center"
                    fontSize="sm"
                    color="gray.700"
                  >
                    <a
                      href={"file/notice/" + file.realName}
                      download={file.oriName || file.name}
                      className="hover:underline"
                    >
                      {file.oriName || file.name}
                    </a>
                    <Button
                      onClick={() => onDeleteFileChange(index)}
                      pl={2}
                      color="red.500"
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
        <Button opacity={0}>선택항목 엑셀받기</Button>
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
      _placeholder={{ color: "gray.400" }}
      focusBorderColor="indigo.600"
      fontSize="sm"
      placeholder={placeholder}
    />
  );
};

const HoverButton = ({ title, w, h, textSize, data, onPass }) => {
  const handleValidation = async () => {
    // Implementation for button action can go here
  };

  return (
    <Button
      onClick={handleValidation}
      width={w}
      height={h}
      bg="white"
      border="1px solid"
      borderColor="skyblue"
      color="black"
      _hover={{ bg: "skyblue", color: "white" }}
      transition="background-color 0.3s"
    >
      <Text fontSize={textSize} fontWeight="medium">
        {title}
      </Text>
    </Button>
  );
};

export default Index;
