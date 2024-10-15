import { Box, Table, Thead, Tr, Th, Tbody, Td, Switch } from "@chakra-ui/react";
import FAQForm from "./FAQ_form";
import AdminTitle from "../../components/common/AdminTitle";
import { useMatch, useNavigate } from "react-router-dom";
import { FAQ_TABLE_LAYOUT, PAGE_SIZE } from "../../constants/admin";
import { useState, useEffect } from "react";
import PageButtonList from "../../components/common/PageButtonList";

const FAQList = () => {
  const [faqs, setFaqs] = useState([]);
  const [curPages, setCurPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const match = useMatch("/FAQList/FAQForm");
  const navigate = useNavigate();
  const layout = FAQ_TABLE_LAYOUT;
  const data = faqs;
  const form = "faqForm";

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
      id = faqs[index].idx;
    }

    try {
      const data = { viewYn: enabled ? "N" : "Y" };
      // const result = await NoticeAPI.updateNotice({ id, data });
    } catch (error) {
      console.log("에러", error);
    }
  };

  // useEffect(() => {
  //   async function fetchData(curPages, pageSize) {
  //     try {
  //       const result = await NoticeAPI.getNotices({
  //         params: { curPages, pageSize },
  //       });

  //       setNotices(result["data"]);
  //       setTotalPages(result["page"]["totalPages"]);
  //       setTotalElements(result["page"]["totalElements"]);

  //       if (result["data"].length > 0) {
  //         setLatestIdx((prevState) => ({
  //           ...prevState,
  //           notice: result["data"][0].idx,
  //         }));
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   }

  //   fetchData(curPages, PAGE_SIZE);
  // }, [curPages]);

  return (
    <Box id="white-box" flex="1" bg="white" p={4} h="full">
      <AdminTitle hasAddButton={!match} title="FAQ" form={form} />
      {match ? (
        <Box id="faq-form">
          <FAQForm />
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
              {data &&
                data.map((item, index) => (
                  <Tr
                    key={item.idx}
                    borderBottomWidth="1px"
                    borderColor="gray.300"
                    _hover={{ bg: "gray.50" }}
                  >
                    {layout.map(({ name }) => {
                      const value = item[name];
                      let tableValue = item[name];

                      if (name === "viewYn") {
                        return (
                          <Td key={name} textAlign="center" py={1}>
                            <Switch
                              id={item.idx}
                              onChange={() => handleToggle()}
                              value={item.viewYn}
                            />
                          </Td>
                        );
                      } else if (name === "regDt") {
                        tableValue = value.split(" ")[0];
                      } else if (name === "idx") {
                        return (
                          <Td
                            key={name}
                            textAlign="center"
                            p={2}
                            fontSize="sm"
                            color="gray.700"
                            cursor="pointer"
                            onClick={() => navigate(`${form}?idx=${item.idx}`)}
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
                          onClick={() => navigate(`${form}?idx=${item.idx}`)}
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

export default FAQList;
