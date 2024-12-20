import { Box, Flex } from '@chakra-ui/react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Admin from './views/admin';
import StoreList from './views/store';
import StoreForm from './views/store/store_form';
import NoticeList from './views/notice';
import NoticeForm from './views/notice/notice_form';
import AskList from './views/ask';
import FAQList from './views/FAQ';
import Post from './views/post';
import AskForm from './views/ask/ask_form';
import FAQForm from './views/FAQ/FAQ_form';
import Header from './components/common/Header';
import NavBar from './components/common/NavBar';
import { useEffect } from 'react';

function App() {
  const location = useLocation();

  useEffect(() => {
    const authToken = localStorage.getItem('refreshToken');
    if (!authToken && location.pathname !== '/') {
      alert('로그인이 필요합니다.');
      window.location.href = '/';
    } else if (authToken && location.pathname === '/') {
      window.location.href = '/storeList';
    }
  }, [location.pathname]);

  return (
    <>
      {location.pathname === '/' ? null : <Header />}
      <Flex justify={'flex-start'} align={'flex-start'}>
        {location.pathname === '/' ? null : <NavBar />}
        <Box
          flex="1"
          bg="white"
          maxW="1500px"
          w="full"
          mx="auto"
          pb="10px"
          overflow="scroll"
          h="100vh"
        >
          <Routes>
            <Route path="/" element={<Admin />} />
            <Route path="storeList" element={<StoreList />} />
            <Route path="storeList/storeForm" element={<StoreForm />} />
            <Route path="noticeList" element={<NoticeList />}>
              <Route path="noticeForm" element={<NoticeForm />} />
            </Route>
            <Route path="askList" element={<AskList />}>
              <Route path="askForm" element={<AskForm />} />
            </Route>
            <Route path="FAQList" element={<FAQList />}>
              <Route path="FAQForm" element={<FAQForm />} />
            </Route>
            <Route path="post" element={<Post />} />
          </Routes>
        </Box>
      </Flex>
    </>
  );
}

export default App;
