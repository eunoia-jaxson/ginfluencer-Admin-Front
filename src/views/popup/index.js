import { Box, Table, Thead, Tr, Th, Tbody, Td } from "@chakra-ui/react";
import PopupForm from "./popup_form";
import AdminTitle from "../../components/common/AdminTitle";
import { useNavigate, useMatch } from "react-router-dom";
import { POPUP_TABLE_LAYOUT, PAGE_SIZE } from "../../constants/admin";
import { useState, useEffect } from "react";
import PageButtonList from "../../components/common/PageButtonList";

const PopupList = () => {
  const [popups, setPopups] = useState([]);
  const [curPages, setCurPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const match = useMatch("/post?type=popup/popupForm");
  const navigate = useNavigate();
  const layout = POPUP_TABLE_LAYOUT;
  const data = popups;
  const form = "/post?type=popup/popupForm";

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
      id = popups[index].idx;
    }

    try {
      const data = { viewYn: enabled ? "N" : "Y" };
    } catch (error) {
      console.log("에러", error);
    }
  };

  return (
    <Box id="white-box" flex="1" bg="white" p={4}>
      <AdminTitle hasAddButton={!match} title="팝업 띄우기" form={form} />
      {match ? (
        <Box id="popup-form">
          <PopupForm />
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
              {popups.map((item, index) => (
                <Tr
                  key={item.idx}
                  borderBottomWidth="1px"
                  borderColor="gray.300"
                  _hover={{ bg: "gray.50" }}
                >
                  {layout.map(({ name }) => {
                    const value = item[name];
                    let tableValue = item[name];

                    if (name === "regDt") {
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
                          onClick={() => navigate(`/popupForm?idx=${item.idx}`)}
                        >
                          {totalElements - (curPages * PAGE_SIZE + index)}
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
                        onClick={() => navigate(`/popupForm?idx=${item.idx}`)}
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
    </Box>
  );
};

export default PopupList;
