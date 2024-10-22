import {
  Flex,
  Box,
  Table,
  Thead,
  Tr,
  Th,
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
import { useNavigate } from "react-router-dom";
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

const StoreList = () => {
  const [stores, setStores] = useState([]);
  const [curPages, setCurPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [selectedStores, setSelectedStores] = useState([]);

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
  const layout = STORE_TABLE_LAYOUT;
  const data = stores;

  const theme = useTheme();

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

  const handleSelectAll = (isChecked) => {
    if (isChecked) {
      const allIds = stores.map((store) => store.idx);
      setSelectedStores(allIds);
    } else {
      setSelectedStores([]);
    }
  };

  const handleCheckboxChange = (idx) => {
    setSelectedStores((prevSelected) =>
      prevSelected.includes(idx)
        ? prevSelected.filter((id) => id !== idx)
        : [...prevSelected, idx]
    );
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
    <Box id="white-box" flex="1" bg="white" p={4} width="100%" maxWidth="100%">
      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap"
        justifyContent="space-between"
        gap={4}
      >
        <Box flex="1">
          <AdminTitle
            hasAddButton={null}
            title="선한영향력가게 관리"
            form={""}
          />
        </Box>
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
      </Box>

      <Box mt={4} width="100%">
        <Table
          variant="simple"
          bg="white"
          borderWidth="1px"
          tableLayout="fixed"
          width="100%"
        >
          <Thead bg="gray.100" borderTopWidth="2px" borderColor="black">
            <Tr>
              <Th textAlign="center" width="50px">
                {" "}
                <Checkbox
                  isChecked={
                    selectedStores.length === stores.length &&
                    stores.length >= 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </Th>
              {layout.map(({ name, value, width }) => (
                <Th
                  key={name}
                  width={width || "auto"}
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
        </Table>
      </Box>

      <PageButtonList
        onPaginationPrev={handlePaginationPrev}
        onPaginationNext={handlePaginationNext}
        curPages={curPages}
        setCurPages={setCurPages}
        totalPages={totalPages}
        onPaginationNumber={handlePaginationNumber}
      />
      <Flex py={4} gap={4}>
        <Button bg={theme.colors.main} color="white">
          선택항목 엑셀받기
        </Button>
        <Button bg={theme.colors.main} color="white">
          검색항목 엑셀받기
        </Button>
      </Flex>
    </Box>
  );
};

export default StoreList;
