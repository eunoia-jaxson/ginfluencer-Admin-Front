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
  const [isLoading, setIsLoading] = useState(false);

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  useEffect(() => {
    if (id) {
      fetchPopupData(id);
    }
  }, [id]);

  const fetchPopupData = async (id) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/admin/popups/${id}`
      );
      setPopup(response.data);
      setFiles(response.data.popUpFiles || []);
    } catch (error) {
      console.error("Error fetching popup data:", error);
      alert("데이터를 불러오는 데 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;
    setPopup((prev) => ({ ...prev, [name]: fieldValue }));
  };

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).map((file) => ({
      id: null,
      oriName: file.name,
      file,
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDeleteFile = (index) => {
    const fileToDelete = files[index];
    if (fileToDelete.id) {
      setDeletedFiles((prev) => [...prev, fileToDelete.id]);
    }
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("title", popup.title);
    formData.append("content", popup.content);
    formData.append("isVisible", popup.isVisible);
    formData.append("startDate", popup.startDate);
    formData.append("endDate", popup.endDate);

    files.forEach((file) => {
      if (file.file) {
        formData.append("files", file.file);
      }
    });

    if (deletedFiles.length > 0) {
      formData.append("deletedFiles", JSON.stringify(deletedFiles));
    }

    try {
      const url = id
        ? `${process.env.REACT_APP_BASE_URL}/api/admin/popups/${id}`
        : `${process.env.REACT_APP_BASE_URL}/api/admin/popups`;

      const method = id ? "patch" : "post";

      const response = await axios({
        method,
        url,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200) {
        alert(`팝업이 ${id ? "수정" : "생성"}되었습니다.`);
        navigate("/post?type=popup");
      }
    } catch (error) {
      console.error("Error submitting popup:", error);
      alert("작업에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <Box>
      {isLoading && <Spinner />}
      <PopupForm
        data={popup}
        files={files}
        onInputChange={handleInputChange}
        onFileChange={handleFileChange}
        onDeleteFile={handleDeleteFile}
        onSubmit={handleSubmit}
      />
    </Box>
  );
};

const PopupForm = ({
  data,
  files,
  onInputChange,
  onFileChange,
  onDeleteFile,
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
                onChange={onInputChange}
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
