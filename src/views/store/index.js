import axios from "axios";
import axiosInstance from "../../api/axiosInstance";
import {
  Flex,
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
  Checkbox,
  Select,
  Input,
  InputGroup,
  InputRightElement,
  FormControl,
  IconButton,
  Button,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { useTheme } from "@chakra-ui/react";
import AdminTitle from "../../components/common/AdminTitle";
import { useMatch, useNavigate } from "react-router-dom";
import { STORE_TABLE_LAYOUT, PAGE_SIZE, ASK_TYPE } from "../../constants/admin";
import { useState, useEffect } from "react";
import { makeClearValue } from "../../utils/safe";
import PageButtonList from "../../components/common/PageButtonList";
import {
  STORE_TYPE,
  MEMBER_TYPE,
  PAYMENT_TYPE,
  STICKER_TYPE,
  KIT_TYPE,
  INDUSTRY_TYPE,
} from "../../constants/admin";
import StoreForm from "./store_form";

const StoreList = () => {
  const [selectAll, setSelectAll] = useState(false);
  const [checkedItems, setCheckedItems] = useState([]);
  const [stores, setStores] = useState([]);
  const [curPages, setCurPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedStore, setSelectedStore] = useState(null);

  const [selectedStoreType, setSelectedStoreType] = useState("");
  const [selectedMemberType, setSelectedMemberType] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [selectedStickerType, setSelectedStickerType] = useState("");
  const [selectedKitType, setSelectedKitType] = useState("");
  const [selectedIndustryType, setSelectedIndustryType] = useState("");

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();
  const match = useMatch("/storeList/storeForm");
  const layout = STORE_TABLE_LAYOUT;
  const data = stores;
  const form = "storeForm";

  const theme = useTheme();

  // 데이터 불러오기 API 함수
  const fetchAllStores = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/admin/stores/get/all`,
        {
          headers: {
            Authorization: `${localStorage.getItem("refreshToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log("response:", response.data);
      if (Array.isArray(response.data)) {
        setStores(
          response.data.map((store) => ({
            ...store,
            stickerSend: store.stickerSend || false,
            kitSend: store.kitSend || false,
            seeAvailable: store.seeAvailable || false,
          }))
        );
        setTotalElements(response.data.length);
        setTotalPages(Math.ceil(response.data.length / PAGE_SIZE));
      } else {
        console.error("Expected an array, but got:", response.data);
      }
    } catch (error) {
      console.error("Error fetching stores:", error);
    }
  };

  // 특정 가게 불러오기 API 함수
  const fetchStoreById = async (no) => {
    try {
      const response = await axiosInstance.get(`/api/admin/stores/get/${no}`, {
        headers: {
          Authorization: `${localStorage.getItem("refreshToken")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching store:", error);
    }
  };

  const handleClick = async (no) => {
    try {
      const storeData = await fetchStoreById(no);
      if (storeData) {
        setSelectedStore(storeData);
      }
    } catch (error) {
      console.error("Error fetching store::", error);
    }
  };

  useEffect(() => {
    fetchAllStores();
  }, []);

  // 가게 등록 API 함수
  const createStore = async (storeData) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/api/login/signup`,
        storeData
      );
      return response.data;
    } catch (error) {
      console.error("Error creating store:", error);
    }
  };

  // 가게 업데이트 API 함수
  const updateStore = async (no, updatedData) => {
    try {
      await axios.put(
        `${process.env.REACT_APP_BASE_URL}/api/admin/stores/update/${no}`,
        updatedData,
        {
          headers: {
            Authorization: `${localStorage.getItem("refreshToken")}`,
            "Content-Type": "application/json",
            Accept: "application/json",
            "Access-Control-Allow-Origin": "http://localhost:3000", // 로컬 개발 환경에 맞게 설정
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
      fetchAllStores(); // 업데이트 후 목록을 갱신
    } catch (error) {
      console.error("Error updating store:", error);
    }
  };

  // 가게 삭제 API 함수
  const deleteStore = async (no) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_BASE_URL}/api/admin/stores/delete/${no}`
      );
      fetchAllStores(); // 삭제 후 목록을 갱신
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };

  // 컴포넌트가 마운트될 때 모든 가게 데이터 가져오기
  useEffect(() => {
    fetchAllStores();
  }, []);

  useEffect(() => {
    if (selectedStoreType) {
      switch (selectedStoreType) {
        case "01":
          setSelectedMemberType(MEMBER_TYPE[0]?.value);
          break;
        case "02":
          setSelectedPaymentType(PAYMENT_TYPE[0]?.value);
          break;
        case "03":
          setSelectedStickerType(STICKER_TYPE[0]?.value);
          break;
        case "04":
          setSelectedKitType(KIT_TYPE[0]?.value);
          break;
        case "05":
          setSelectedIndustryType(INDUSTRY_TYPE[0]?.value);
          break;
        default:
          break;
      }
    }
  }, [selectedStoreType]);

  const handlePaginationNumber = (e) => {
    setCurPages(e.target.innerText - 1);
  };

  const handlePaginationPrev = () => {
    if (curPages > 0) setCurPages(curPages - 1);
    else alert("첫 페이지 입니다.");
  };

  const handlePaginationNext = () => {
    if (curPages < totalPages - 1) setCurPages(curPages + 1);
    else alert("마지막 페이지 입니다.");
  };

  const handleChange = (e) => {
    const { value } = e.target;
    const clearValue = makeClearValue(value);
    setKeyword(clearValue);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("검색어:", keyword);
  };

  // 모든 항목의 체크박스 상태를 변경
  const handleSelectAllChange = (e) => {
    setSelectAll(e.target.checked);
    if (e.target.checked) {
      setCheckedItems(stores.map((item) => item.no)); // 모든 항목 선택
    } else {
      setCheckedItems([]); // 모든 항목 해제
    }
  };

  // 개별 체크박스를 변경
  const handleCheckboxChange = (no) => {
    setCheckedItems((prevState) => {
      if (prevState.includes(no)) {
        return prevState.filter((item) => item !== no); // 체크 해제
      } else {
        return [...prevState, no]; // 체크
      }
    });
  };

  const handleStoreTypeChange = (event) => {
    setSelectedStoreType(event.target.value);
  };

  const renderNextSelect = () => {
    let options = [];

    switch (selectedStoreType) {
      case "01":
        options = MEMBER_TYPE;
        break;
      case "02":
        options = PAYMENT_TYPE;
        break;
      case "03":
        options = STICKER_TYPE;
        break;
      case "04":
        options = KIT_TYPE;
        break;
      case "05":
        options = INDUSTRY_TYPE;
        break;
      default:
        options = [];
    }

    return (
      <Select
        placeholder="전체"
        width="200px"
        value={
          selectedStoreType === "01"
            ? selectedMemberType
            : selectedStoreType === "02"
            ? selectedPaymentType
            : selectedStoreType === "03"
            ? selectedStickerType
            : selectedStoreType === "04"
            ? selectedKitType
            : selectedIndustryType
        }
        onChange={(e) => {
          const selectedValue = e.target.value;

          switch (selectedStoreType) {
            case "01":
              setSelectedMemberType(selectedValue);
              break;
            case "02":
              setSelectedPaymentType(selectedValue);
              break;
            case "03":
              setSelectedStickerType(selectedValue);
              break;
            case "04":
              setSelectedKitType(selectedValue);
              break;
            case "05":
              setSelectedIndustryType(selectedValue);
              break;
            default:
              break;
          }
        }}
      >
        {options.map((type) => (
          <option key={type.id} value={type.value}>
            {type.value}
          </option>
        ))}
      </Select>
    );
  };

  const SearchBar = ({ onSubmit }) => {
    const [keyword, setKeyword] = useState("");

    const handleSubmit = (event) => {
      event.preventDefault();
      onSubmit(keyword);
    };

    return (
      <FormControl as="form" id="search" onSubmit={onSubmit}>
        <InputGroup
          shadow="sm"
          borderWidth="1px"
          borderRadius="md"
          borderColor="gray.300"
          w="72"
        >
          <Input
            id="keyword"
            name="keyword"
            type="text"
            placeholder=""
            value={keyword}
            className="block w-full"
            py={1.5}
            pl={4}
            pr={12}
            color="gray.900"
            fontSize="sm"
            ring={1}
            ringColor="gray.200"
            _placeholder={{ color: "gray.400" }}
            _focus={{ ring: 2, ringColor: "indigo.600" }}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <InputRightElement>
            <IconButton
              aria-label="Search"
              icon={<SearchIcon />}
              size="sm"
              onClick={onSubmit}
              variant="ghost"
              colorScheme="blue"
              cursor="pointer"
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
    );
  };

  return (
    <Box id="white-box" flex="1" bg="white" p={4}>
      <AdminTitle
        hasAddButton={false}
        title="선한영향력가게 관리"
        form={form}
      />
      {selectedStore ? (
        <Box id="store-form">
          <StoreForm
            storeData={selectedStore}
            onCancel={() => setSelectedStore(null)}
          />
        </Box>
      ) : (
        <Box>
          <Box display="flex" alignItems="center" flex="2" gap={4} width="100%">
            <Select
              placeholder="전체"
              width="200px"
              value={selectedStoreType}
              onChange={handleStoreTypeChange}
            >
              {STORE_TYPE.map((type) => (
                <option key={type.id} value={type.code}>
                  {type.value}
                </option>
              ))}
            </Select>

            {renderNextSelect()}

            <Input
              type="date"
              width="250px"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              type="date"
              width="250px"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <SearchBar onSubmit={handleSubmit} onChange={handleChange} />
          </Box>
          <Table variant="simple" bg="white" borderWidth="1px" mt={4}>
            <Thead bg="gray.100" borderTopWidth="2px" borderColor="black">
              <Tr>
                <Th
                  width="w-1/12"
                  px={4}
                  py={2.5}
                  textAlign="center"
                  fontSize="sm"
                  fontWeight="semibold"
                  whiteSpace="nowrap"
                  color="gray.600"
                >
                  <Checkbox
                    isChecked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                </Th>
                {layout.map(({ name, value, width }) => (
                  <Th
                    key={name}
                    width={width}
                    px={4}
                    py={2.5}
                    textAlign="center"
                    fontSize="sm"
                    fontWeight="semibold"
                    whiteSpace="nowrap"
                    color="gray.600"
                  >
                    {value}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {stores.map((item, no) => (
                <Tr
                  key={item.no}
                  borderBottomWidth="1px"
                  borderColor="gray.300"
                  _hover={{ bg: "gray.50" }}
                >
                  <Td textAlign="center" p={2} fontSize="sm" color="gray.700">
                    <Checkbox
                      isChecked={checkedItems.includes(item.no)}
                      onChange={() => handleCheckboxChange(item.no)}
                    />
                  </Td>
                  <Td
                    textAlign="center"
                    p={2}
                    fontSize="sm"
                    color="gray.700"
                    cursor="pointer"
                    onClick={() => navigate(`${form}?idx=${item.no}`)}
                    width="w-1/12" // No 컬럼 너비
                  >
                    {item.no}
                  </Td>
                  <Td
                    textAlign="center"
                    p={2}
                    fontSize="sm"
                    color="gray.700"
                    cursor="pointer"
                    onClick={() => navigate(`${form}?idx=${item.no}`)}
                    width="w-2/12" // 회원구분 컬럼 너비
                  >
                    {item.level}
                  </Td>
                  <Td
                    p={2}
                    fontSize="sm"
                    color="gray.700"
                    cursor="pointer"
                    onClick={() => navigate(`${form}?idx=${item.no}`)}
                    width="w-3/12" // 가게명 컬럼 너비
                  >
                    {item.storeTitle}
                  </Td>
                  <Td
                    textAlign="center"
                    p={2}
                    fontSize="sm"
                    color="gray.700"
                    cursor="pointer"
                    onClick={() => navigate(`${form}?idx=${item.no}`)}
                    width="w-2/12" // 스티커발송 컬럼 너비
                  >
                    <Checkbox isChecked={item.stickerSend} isReadOnly />
                  </Td>
                  <Td
                    textAlign="center"
                    p={2}
                    fontSize="sm"
                    color="gray.700"
                    cursor="pointer"
                    onClick={() => navigate(`${form}?idx=${item.no}`)}
                    width="w-2/12" // 키트발송 컬럼 너비
                  >
                    <Checkbox isChecked={item.kitSend} isReadOnly />
                  </Td>
                  <Td
                    textAlign="center"
                    p={2}
                    fontSize="sm"
                    color="gray.700"
                    cursor="pointer"
                    onClick={() => navigate(`${form}?idx=${item.no}`)}
                    width="w-2/12" // 노출여부 컬럼 너비
                  >
                    <Checkbox isChecked={item.seeAvailable} isReadOnly />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <PageButtonList
            onPaginationPrev={handlePaginationPrev}
            onPaginationNext={handlePaginationNext}
            curPages={curPages}
            setCurPages={setCurPages}
            totalPages={totalPages}
            onPaginationNumber={handlePaginationNumber}
          />
        </Box>
      )}
    </Box>
  );
};

export default StoreList;
