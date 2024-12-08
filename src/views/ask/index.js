import { Box, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";
import AskForm from "./ask_form";
import AdminTitle from "../../components/common/AdminTitle";
import { useMatch, useNavigate } from "react-router-dom";
import { ASK_TABLE_LAYOUT, PAGE_SIZE, ASK_TYPE } from "../../constants/admin";
import { useState, useEffect } from "react";
import PageButtonList from "../../components/common/PageButtonList";
import { Checkbox } from "@chakra-ui/react";
import axios from "axios";

const AskList = () => {
  const [asks, setAsks] = useState([]);
  const [curPages, setCurPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const match = useMatch("/askList/askForm");
  const navigate = useNavigate();
  const layout = ASK_TABLE_LAYOUT;
  const data = asks;
  const form = "askForm";

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
      id = asks[index].idx;
    }

    try {
      const data = { viewYn: enabled ? "N" : "Y" };
      // const result = await NoticeAPI.updateNotice({ id, data });
    } catch (error) {
      console.log("에러", error);
    }
  };

  const getTypeValueByCode = (code) => {
    const type = ASK_TYPE.find((item) => item.code === code);
    return type ? type.value : "Undefined";
  };

  async function fetchData() {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/api/admin/inquiries`
      );

      setAsks(result.data);
      setTotalElements(result.data.length);
      // console.log(result.data);
      // setNotices(result['data']);
      // setTotalPages(result['page']['totalPages']);
      // setTotalElements(result['page']['totalElements']);

      // if (result['data'].length > 0) {
      //   // setLatestIdx((prevState) => ({
      //   //   ...prevState,
      //   //   notice: result['data'][0].idx,
      //   // }));
      // }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box id="white-box" flex="1" bg="white" p={4}>
      <AdminTitle hasAddButton={null} title="1:1 문의" form={""} />
      {match ? (
        <Box id="ask-form">
          <AskForm />
        </Box>
      ) : (
        <Box>
          <Table variant="simple" bg="white" borderWidth="1px">
            <Thead bg="gray.100" borderTopWidth="2px" borderColor="black">
              <Tr>
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
              {data.map((item, index) => (
                <Tr
                  key={item.id}
                  borderBottomWidth="1px"
                  borderColor="gray.300"
                  _hover={{ bg: "gray.50" }}
                >
                  {layout.map(({ name }) => {
                    const value = item[name];
                    let tableValue = item[name];

                    if (name === "answer") {
                      return (
                        <Td key={name} textAlign="center" py={1}>
                          <Checkbox
                            isChecked={value !== null}
                            isDisabled
                            colorScheme="blue"
                          />
                        </Td>
                      );
                    } else if (name === "type") {
                      tableValue = getTypeValueByCode(value);
                    } else if (name === "createdDate") {
                      tableValue = value;
                    } else if (name === "id") {
                      return (
                        <Td
                          key={name}
                          textAlign="center"
                          p={2}
                          fontSize="sm"
                          color="gray.700"
                          cursor="pointer"
                          onClick={() => navigate(`${form}?idx=${item.id}`)}
                        >
                          {totalElements - (curPages * 10 + index)}
                        </Td>
                      );
                    }

                    return (
                      <Td
                        key={name}
                        textAlign="center"
                        p={2}
                        fontSize="sm"
                        color="gray.700"
                        cursor="pointer"
                        onClick={() => navigate(`${form}?idx=${item.id}`)}
                      >
                        {tableValue}
                      </Td>
                    );
                  })}
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
      <Box p={4} />
    </Box>
  );
};

export default AskList;
