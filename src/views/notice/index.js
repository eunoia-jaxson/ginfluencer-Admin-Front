import { Box, Table, Thead, Tr, Th, Tbody, Td, Switch } from '@chakra-ui/react';
import NoticeForm from './notice_form';
import AdminTitle from '../../components/common/AdminTitle';
import { useMatch, useNavigate } from 'react-router-dom';
import { NOTICE_TABLE_LAYOUT, PAGE_SIZE } from '../../constants/admin';
import { useState, useEffect } from 'react';
import PageButtonList from '../../components/common/PageButtonList';
import axios from 'axios';

const NoticeList = () => {
  const [notices, setNotices] = useState([]);
  const [curPages, setCurPages] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const match = useMatch('/noticeList/noticeForm');
  const navigate = useNavigate();
  const layout = NOTICE_TABLE_LAYOUT;
  const form = 'noticeForm';

  const handlePaginationNumber = (e) => {
    setCurPages(e.target.innerText - 1);
  };

  const handlePaginationPrev = () => {
    if (curPages > 0) {
      setCurPages(curPages - 1);
    } else {
      alert('첫 페이지 입니다.');
    }
  };

  const handlePaginationNext = () => {
    if (curPages < totalPages - 1) {
      setCurPages(curPages + 1);
    } else {
      alert('마지막 페이지 입니다.');
    }
  };

  async function fetchData() {
    try {
      const result = await axios.get(
        process.env.REACT_APP_API_URL + 'admin/announcements'
      );

      setNotices(result.data);
      setTotalElements(result.data.length);
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

  const handleToggle = async (index, id, enabled) => {
    if (id === null || id === undefined) {
      id = notices[index].id;
    }

    try {
      const data = { ...notices[index], isOpened: enabled };
      await axios.patch(
        `${process.env.REACT_APP_API_URL}admin/announcements/${id}`,
        data,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      fetchData();
    } catch (error) {
      console.log('에러', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Box id="white-box" flex="1" bg="white" p={4}>
      <AdminTitle hasAddButton={!match} title="공지사항" form={form} />
      {match ? (
        <Box id="notice-form">
          <NoticeForm />
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
              {notices.map((item, index) => (
                <Tr
                  key={item.id}
                  borderBottomWidth="1px"
                  borderColor="gray.300"
                  _hover={{ bg: 'gray.50' }}
                >
                  {layout.map(({ name }) => {
                    const value = item[name];
                    let tableValue = item[name];

                    if (name === 'isOpened') {
                      return (
                        <Td key={name} textAlign="center" py={1}>
                          <Switch
                            isChecked={item.isOpened}
                            onChange={() =>
                              handleToggle(index, item.id, !item.isOpened)
                            }
                          />
                        </Td>
                      );
                    } else if (name === 'category') {
                      tableValue = value;
                    } else if (name === 'createdDate') {
                      tableValue = value.slice(0, 10);
                    } else if (name === 'id') {
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

export default NoticeList;
