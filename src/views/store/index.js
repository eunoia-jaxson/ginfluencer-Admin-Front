import {
  Box,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Checkbox,
  Select,
  Input,
} from "@chakra-ui/react";
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

  // 선택된 드롭다운 상태
  const [selectedStoreType, setSelectedStoreType] = useState("");
  const [selectedMemberType, setSelectedMemberType] = useState("");
  const [selectedPaymentType, setSelectedPaymentType] = useState("");
  const [selectedStickerType, setSelectedStickerType] = useState("");
  const [selectedKitType, setSelectedKitType] = useState("");
  const [selectedIndustryType, setSelectedIndustryType] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [title, setTitle] = useState("");

  const navigate = useNavigate();
  const layout = STORE_TABLE_LAYOUT;
  const data = stores;
  const form = "askForm";

  useEffect(() => {
    if (selectedStoreType) {
      if (selectedStoreType === "01") {
        setSelectedMemberType(MEMBER_TYPE[0]?.value);
      } else if (selectedStoreType === "02") {
        setSelectedPaymentType(PAYMENT_TYPE[0]?.value);
      } else if (selectedStoreType === "03") {
        setSelectedStickerType(STICKER_TYPE[0]?.value);
      } else if (selectedStoreType === "04") {
        setSelectedKitType(KIT_TYPE[0]?.value);
      } else if (selectedStoreType === "05") {
        setSelectedIndustryType(INDUSTRY_TYPE[0]?.value);
      }
    }
  }, [selectedStoreType]);

  const handlePaginationNumber = (e) => {
    setCurPages(e.target.innerText - 1);
  };

  const handlePaginationPrev = () => {
    if (curPages > 0) {
      setCurPages(curPages - 1);
    } else {
      alert("첫 페이지 입니다.");
    }
  };

  const handlePaginationNext = () => {
    if (curPages < totalPages - 1) {
      setCurPages(curPages + 1);
    } else {
      alert("마지막 페이지 입니다.");
    }
  };

  const handleToggle = async ({ index, id, enabled }) => {
    if (id === null || id === undefined) {
      id = stores[index].idx;
    }

    try {
      const data = { viewYn: enabled ? "N" : "Y" };
    } catch (error) {
      console.log("에러", error);
    }
  };

  const getTypeValueByCode = (code) => {
    const type = ASK_TYPE.find((item) => item.code === code);
    return type ? type.value : "Undefined";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const clearValue = makeClearValue(value);
    setStores({ ...stores, [name]: clearValue });
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
    if (selectedStores.includes(idx)) {
      setSelectedStores(selectedStores.filter((id) => id !== idx));
    } else {
      setSelectedStores([...selectedStores, idx]);
    }
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
        width="120px"
        ml={4}
        value={
          selectedStoreType
            ? selectedStoreType === "01"
              ? selectedMemberType || options[0]?.value
              : selectedStoreType === "02"
              ? selectedPaymentType || options[0]?.value
              : selectedStoreType === "03"
              ? selectedStickerType || options[0]?.value
              : selectedStoreType === "04"
              ? selectedKitType || options[0]?.value
              : selectedStoreType === "05"
              ? selectedIndustryType || options[0]?.value
              : ""
            : ""
        }
        onChange={(e) => {
          const selectedValue = e.target.value;

          if (selectedStoreType === "01") {
            setSelectedMemberType(selectedValue);
          } else if (selectedStoreType === "02") {
            setSelectedPaymentType(selectedValue);
          } else if (selectedStoreType === "03") {
            setSelectedStickerType(selectedValue);
          } else if (selectedStoreType === "04") {
            setSelectedKitType(selectedValue);
          } else if (selectedStoreType === "05") {
            setSelectedIndustryType(selectedValue);
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

  return (
    <Box id="white-box" flex="1" bg="white" p={4}>
      <Box display="flex" alignItems="center">
        <AdminTitle hasAddButton={null} title="선한영향력가게 관리" form={""} />
        <Select
          placeholder="전체"
          width="120px"
          ml={2}
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
          ml={4}
          width="150px"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <Input
          type="date"
          ml={4}
          width="150px"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <ChakraInput value={title} onChange={handleChange} placeholder={""} />
      </Box>

      <Box>
        <Table
          variant="simple"
          bg="white"
          borderWidth="1px"
          tableLayout="fixed"
        >
          <Thead bg="gray.100" borderTopWidth="2px" borderColor="black">
            <Tr>
              <Th textAlign="center">
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
          {/* <Tbody>
            {data.map((item, index) => (
              <Tr
                key={item.idx}
                borderBottomWidth="1px"
                borderColor="gray.300"
                _hover={{ bg: "gray.50" }}
              >
                <Td textAlign="center" py={1}>
                  <Checkbox
                    isChecked={selectedStores.includes(item.idx)}
                    onChange={() => handleCheckboxChange(item.idx)}
                  />
                </Td>
                {layout.map(({ name }) => {
                  const value = item[name];
                  let tableValue = item[name];

                  if (name === "answerYn") {
                    return (
                      <Td key={name} textAlign="center" py={1}>
                        <Checkbox
                          isChecked={value === "Y"}
                          isDisabled
                          colorScheme="blue"
                        />
                      </Td>
                    );
                  } else if (name === "type") {
                    tableValue = getTypeValueByCode(value);
                  }
                  return (
                    <Td key={name} textAlign="center" py={1}>
                      {tableValue}
                    </Td>
                  );
                })}
              </Tr>
            ))}
          </Tbody> */}
        </Table>
      </Box>

      <PageButtonList
        curPages={curPages}
        totalElements={totalElements}
        pageSize={PAGE_SIZE}
        setCurPages={setCurPages}
        handlePaginationNumber={handlePaginationNumber}
        handlePaginationPrev={handlePaginationPrev}
        handlePaginationNext={handlePaginationNext}
      />
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
      width="250px"
      ml={4}
    />
  );
};

export default StoreList;
