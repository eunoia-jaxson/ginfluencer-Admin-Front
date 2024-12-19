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
        `${process.env.REACT_APP_BASE_URL}/api/admin/popups`,
        {
          headers: {
            Authorization: `${localStorage.getItem("refreshToken")}`,
          },
        }
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
