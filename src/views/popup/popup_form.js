import { useEffect, useState } from "react";
import {
  Box,
  Spinner,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Textarea,
  Button,
  Checkbox,
} from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [popup, setPopup] = useState({
    title: "",
    content: "",
    isVisible: false,
    startDate: "",
    endDate: "",
  });
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [isContentUpdated, setIsContentUpdated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  const mimeToExtension = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "application/pdf": ".pdf",
  };

  const getExtensionFromMime = (mimeType) => {
    return mimeToExtension[mimeType] || "";
  };

  useEffect(() => {
    async function fetchPopupData() {
      setIsLoading(true);
      if (id) {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/admin/popups/${id}`,
            {
              headers: {
                Authorization: `${localStorage.getItem("refreshToken")}`,
              },
            }
          );

          if (response.data.file !== null) {
            const serverFiles = response.data.file.map((file) => ({
              ...file,
              oriName: file.originalFileName,
              realName: file.originalFileName,
              state: "stable",
              type: "server",
            }));
            setFiles(serverFiles);
          }
          setPopup({
            id: response.data.id,
            content: response.data.content,
            isVisible: response.data.isVisible,
            startDate: response.data.startDate,
            endDate: response.data.endDate,
            file: response.data.file,
          });
        } catch (error) {
          console.error("Error fetching popup data:", error);
        }
      }
      setIsLoading(false);
    }
    fetchPopupData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setPopup((prev) => ({ ...prev, [name]: fieldValue }));
  };

  const handleFileChange = async (event) => {
    const MAX_FILE_SIZE = 30 * 1024 * 1024;

    const newFiles = Array.from(event.target.files).map((file) => {
      if (file.size > MAX_FILE_SIZE) {
        alert(`${file.name} 파일 크기는 30MB를 초과할 수 없습니다.`);
        return null;
      }

      const formData = new FormData();
      formData.append("file", file);

      return {
        oriName: file.name,
        realName: file.name,
        state: "new",
        type: "local",
        file: formData,
      };
    });

    const validFiles = newFiles.filter((file) => file !== null);
    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    setPopup({
      ...popup,
      file: validFiles.map((file) => file.file),
    });
  };

  const handleDeleteFileChange = (index) => {
    const fileToDelete = files[index];

    if (fileToDelete.type === "server") {
      setDeletedFiles((prev) => [...prev, fileToDelete.id]);
    }

    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setPopup((prevPopup) => {
      return {
        ...prevPopup,
        file: prevPopup.announcementFiles.filter((_, i) => i !== index),
      };
    });
  };

  const handleCreate = async (e) => {
    const userConfirmed = window.confirm("팝업을 등록하시겠나요?");
    if (userConfirmed) {
      try {
        const fileList = await Promise.all(
          files.map(async (file) => {
            const fileResponse = await axios.post(
              `${process.env.REACT_APP_BASE_URL}/api/all/file`,
              file.file,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );

            return fileResponse.data;
          })
        );

        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/admin/popups`,
          { ...popup, file: fileList },
          {
            headers: {
              Authorization: `${localStorage.getItem("refreshToken")}`,
            },
          }
        );
        navigate("/post?type=popup");
      } catch (error) {
        console.log("등록 에러", error);
        return "error";
      }
    }
  };

  const handleUpdate = async (e) => {
    const userConfirmed = window.confirm("팝업을 수정하시겠나요?");
    if (userConfirmed) {
      try {
        if (!id) return;
        const fileList = await Promise.all(
          files
            .filter((file) => file.type === "local")
            .map(async (file) => {
              const fileResponse = await axios.post(
                `${process.env.REACT_APP_BASE_URL}/api/all/file`,
                file.file,
                {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                }
              );

              return fileResponse.data;
            })
        );

        await axios.patch(
          `${process.env.REACT_APP_BASE_URL}/api/admin/popups/${id}`,
          {
            ...popup,
            file: [...popup.file, ...fileList],
          },
          {
            headers: {
              Authorization: `${localStorage.getItem("refreshToken")}`,
            },
          }
        );
        navigate("/post?type=popup");
      } catch (error) {
        console.log("등록 에러", error);
        return "error";
      }
    }
  };

  const handleDelete = async () => {
    const userConfirmed = window.confirm("팝업을 삭제하시겠나요?");
    if (userConfirmed) {
      try {
        await axios.delete(
          `${process.env.REACT_APP_BASE_URL}/api/admin/popups/${id}`,
          {
            headers: {
              Authorization: `${localStorage.getItem("refreshToken")}`,
            },
          }
        );
        navigate("/post?type=popup");
        navigate(0);
      } catch (error) {
        alert("오류가 발생했습니다.");
      }
    }
  };

  const handleCancel = () => {
    const userConfirmed = window.confirm(
      "작성을 취소하시겠나요? 작성 중인 글은 저장되지 않습니다."
    );

    if (userConfirmed) {
      try {
        navigate("/post?type=popup");
      } catch (error) {
        alert("오류가 발생했습니다.");
      }
    }
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

          if (result === "error") {
            setIsLoading(false);
            alert("오류가 발생했습니다.");
            return;
          }

          await handleAddFile(result);

          setIsLoading(false);
          navigate(0);
          if (!id) {
            navigate("/noticeList");
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
      !popup.isVisible ||
      !popup.startDate ||
      !popup.endDate
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }
    if (id) {
      await handleUpdate(); // 팝업 업데이트를 처리
    } else {
      await handleCreate(); // 팝업 생성을 처리
    }
  };

  return (
    <Box>
      {isLoading && <Spinner />}
      <PopupForm
        data={popup}
        files={files}
        onChange={handleChange}
        onFileChange={handleFileChange}
        onDeleteFile={handleDeleteFileChange}
        onDelete={handleDelete}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

const PopupForm = ({
  data,
  files,
  onFileChange,
  onDeleteFile,
  onDelete,
  onCancel,
  onChange,
  onSubmit,
}) => {
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
      <Table>
        <Tbody>
          <Tr>
            <Th>제목</Th>
            <Td>
              <Input
                name="title"
                value={data.title}
                onChange={onChange}
                placeholder="제목을 입력하세요"
              />
            </Td>
          </Tr>
          <Tr>
            <Th>내용</Th>
            <Td>
              <Textarea
                name="content"
                value={data.content}
                onChange={onChange}
                placeholder="내용을 입력하세요"
              />
            </Td>
          </Tr>
          <Tr>
            <Th>공개 여부</Th>
            <Td>
              <Checkbox
                name="isVisible"
                isChecked={data.isVisible}
                onChange={onChange}
              >
                공개
              </Checkbox>
            </Td>
          </Tr>
          <Tr>
            <Th>시작 날짜</Th>
            <Td>
              <Input
                type="datetime-local"
                name="startDate"
                value={data.startDate}
                onChange={onChange}
              />
            </Td>
          </Tr>
          <Tr>
            <Th>종료 날짜</Th>
            <Td>
              <Input
                type="datetime-local"
                name="endDate"
                value={data.endDate}
                onChange={onChange}
              />
            </Td>
          </Tr>
          <Tr>
            <Th>파일</Th>
            <Td>
              <Input type="file" multiple onChange={onFileChange} />
              {files.map((file, index) => (
                <Box key={index}>
                  <span>{file.oriName}</span>
                  <Button onClick={() => onDeleteFile(index)}>삭제</Button>
                </Box>
              ))}
            </Td>
          </Tr>
        </Tbody>
      </Table>
      <Button mt="4" onClick={onSubmit}>
        제출
      </Button>
    </Box>
  );
};

export default Index;
