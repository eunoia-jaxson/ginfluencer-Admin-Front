import { Box, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";
import PopupForm from "./popup_form";
import AdminTitle from "../../components/common/AdminTitle";
import { useNavigate, useMatch, useLocation } from "react-router-dom";
import { POPUP_TABLE_LAYOUT, PAGE_SIZE } from "../../constants/admin";
import { useState, useEffect, useRef } from "react";
import PageButtonList from "../../components/common/PageButtonList";
import axios from "axios";

const PopupList = () => {
  const [curPages, setCurPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const match = useMatch("/post?type=popup/popupForm");
  const location = useLocation();
  const navigate = useNavigate();
  const layout = POPUP_TABLE_LAYOUT;
  const form = "/post?type=popup/popupForm";

  const [popupList, setPopupList] = useState([]);
  // const [selectedPopup, setSelectedPopup] = useState({
  //   id: 0,
  //   content: "",
  //   title: "",
  //   startDate: "",
  //   endDate: "",
  //   isVisible: true,
  // });
  const [selectedPopup, setSelectedPopup] = useState(null);
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");

  // Fetch popups function
  const fetchPopups = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/all/popups/visible` //공개된 팝업만
      );
      if (response.status === 200) {
        console.log("Fetched popups:", response.data);
        setPopupList(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch popups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPopups(); // Fetch popups on component mount
  }, []);

  const fetchPopupById = async (id) => {
    if (!id) return;
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/admin/popups/${id}`
      );
      if (response.status === 200) {
        setSelectedPopup(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch popup:", error);
    }
  };

  const handleSave = async () => {
    try {
      const url = selectedPopup.id
        ? `${process.env.REACT_APP_BASE_URL}/api/admin/popups/${selectedPopup.id}`
        : `${process.env.REACT_APP_BASE_URL}/api/admin/popups`;
      const method = selectedPopup.id ? "patch" : "post";

      await axios[method](url, selectedPopup);
      alert("팝업이 성공적으로 저장되었습니다.");
      fetchPopups();
      navigate("/post?type=popup"); // 리스트로 돌아가기
    } catch (error) {
      console.error("Error saving popup:", error);
    }
  };

  useEffect(() => {
    if (id) {
      fetchPopupById(id);
    } else {
      setSelectedPopup(null); // 새로운 폼을 위한 초기화
    }
  }, [id]);

  useEffect(() => {
    console.log("Updated popupList:", popupList);
  }, [popupList]);

  useEffect(() => {
    const fetchSelectedPopup = async () => {
      if (id) {
        setIsLoading(true);
        try {
          const result = await axios.get(
            `${process.env.REACT_APP_BASE_URL}/api/admin/popups/${id}`
          );
          console.log("Fetched selected popup data:", result.data);
          setSelectedPopup({
            id: result.id,
            content: result.content,
            title: result.title,
            startDate: result.startDate.split("T")[0],
            endDate: result.endDate.split("T")[0],
            isVisible: result.isVisible,
          });
          setFiles(
            result.popUpFiles.map((file) => ({
              id: file.id,
              oriName: file.originalFileName,
              realName: file.filePath.split("/").pop(),
              state: "server",
              type: "server",
              filePath: file.filePath,
            }))
          );
        } catch (error) {
          console.error("Failed to fetch popup:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSelectedPopup();
  }, [id]);

  const handleFileChange = (event) => {
    const newFiles = Array.from(event.target.files).map((file) => ({
      id: null,
      oriName: file.name,
      realName: file.name,
      state: "new",
      type: "local",
      file,
    }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const handleDeleteFileChange = (index) => {
    const fileToDelete = files[index];
    if (fileToDelete.type === "server") {
      setDeletedFiles((prev) => [...prev, fileToDelete.id]);
    }
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setSelectedPopup({ ...selectedPopup, [name]: value });
  };

  const handleVisibilityChange = () => {
    setSelectedPopup((prev) => ({ ...prev, isVisible: !prev.isVisible }));
  };

  const handleSubmit = async () => {
    console.log("Selected Popup Data:", selectedPopup); // Add this line to inspect the data before submission
    if (
      !selectedPopup.title ||
      typeof selectedPopup.isVisible !== "boolean" ||
      !selectedPopup.content
    ) {
      alert("모든 필수 항목을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      if (!id) {
        await axios.post(
          `${process.env.REACT_APP_BASE_URL}/api/admin/popups`,
          selectedPopup
        );
        alert("팝업이 성공적으로 등록되었습니다.");
        fetchPopups(); // Reload the popup list after submitting
      } else {
        await axios.patch(
          `${process.env.REACT_APP_BASE_URL}/api/admin/popups/${id}`,
          selectedPopup
        );
        alert("팝업이 성공적으로 수정되었습니다.");
      }
      navigate("/post?type=popup");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box id="white-box" flex="1" bg="white" p={4}>
      <AdminTitle hasAddButton={!match} title="팝업 띄우기" form={form} />
      {id ? (
        <PopupForm
          popupdata={selectedPopup}
          onSave={() => {
            fetchPopups();
            navigate("/post?type=popup"); // 저장 후 목록으로 이동
          }}
        />
      ) : (
        <Box>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <Table variant="simple" bg="white" borderWidth="1px">
              <Thead bg="gray.100" borderTopWidth="2px" borderColor="black">
                <Tr>
                  <Th
                    width="20%"
                    px={4}
                    py={2.5}
                    textAlign="center"
                    fontSize="sm"
                    fontWeight="semibold"
                    whiteSpace="nowrap"
                    color="gray.600"
                  >
                    제목
                  </Th>
                  <Th
                    width="20%"
                    px={4}
                    py={2.5}
                    textAlign="center"
                    fontSize="sm"
                    fontWeight="semibold"
                    whiteSpace="nowrap"
                    color="gray.600"
                  >
                    내용
                  </Th>
                  <Th
                    width="10%"
                    px={4}
                    py={2.5}
                    textAlign="center"
                    fontSize="sm"
                    fontWeight="semibold"
                    whiteSpace="nowrap"
                    color="gray.600"
                  >
                    공개여부
                  </Th>
                  <Th
                    width="15%"
                    px={4}
                    py={2.5}
                    textAlign="center"
                    fontSize="sm"
                    fontWeight="semibold"
                    whiteSpace="nowrap"
                    color="gray.600"
                  >
                    시작일
                  </Th>
                  <Th
                    width="15%"
                    px={4}
                    py={2.5}
                    textAlign="center"
                    fontSize="sm"
                    fontWeight="semibold"
                    whiteSpace="nowrap"
                    color="gray.600"
                  >
                    종료일
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {popupList.map((item, index) => (
                  <Tr
                    key={item.id}
                    borderBottomWidth="1px"
                    borderColor="gray.300"
                    _hover={{ bg: "gray.50" }}
                  >
                    <Td
                      textAlign="center"
                      p={2}
                      fontSize="sm"
                      color="gray.700"
                      cursor="pointer"
                      onClick={() => navigate(`${form}&id=${item.id}`)}
                    >
                      {item.title}
                    </Td>
                    <Td
                      textAlign="center"
                      p={2}
                      fontSize="sm"
                      color="gray.700"
                      cursor="pointer"
                      onClick={() => navigate(`${form}&id=${item.id}`)}
                    >
                      {item.content || "내용 없음"}
                    </Td>
                    <Td
                      textAlign="center"
                      p={2}
                      fontSize="sm"
                      color="gray.700"
                      cursor="pointer"
                      onClick={() => navigate(`${form}&id=${item.id}`)}
                    >
                      {item.isVisible ? "공개" : "비공개"}
                    </Td>
                    <Td
                      textAlign="center"
                      p={2}
                      fontSize="sm"
                      color="gray.700"
                      cursor="pointer"
                      onClick={() => navigate(`${form}&id=${item.id}`)}
                    >
                      {item.startDate.split("T")[0]}
                    </Td>
                    <Td
                      textAlign="center"
                      p={2}
                      fontSize="sm"
                      color="gray.700"
                      cursor="pointer"
                      onClick={() => navigate(`${form}&id=${item.id}`)}
                    >
                      {item.endDate.split("T")[0]}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
          <PageButtonList />
        </Box>
      )}
    </Box>
  );
};

export default PopupList;
