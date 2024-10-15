import { Routes, Route, useLocation } from "react-router-dom";
import Admin from "./views/admin";
import StoreList from "./views/store";
import StoreForm from "./views/store/store_form";
import NoticeList from "./views/notice";
import NoticeForm from "./views/notice/notice_form";
import AskList from "./views/ask";
import FAQList from "./views/FAQ";
import Post from "./views/post";
import AskForm from "./views/ask/ask_form";
import FAQForm from "./views/FAQ/FAQ_form";
import Header from "./components/common/Header";
import NavBar from "./components/common/NavBar";
import { Flex } from "@chakra-ui/react";

function App() {
  const location = useLocation();

  return (
    <>
      {location.pathname === "/" ? null : <Header />}
      <Flex justify={"space-between"} align={"flex-start"}>
        {location.pathname === "/" ? null : <NavBar />}
        <Routes>
          <Route path="/" element={<Admin />} />
          <Route path="storeList" element={<StoreList />}>
            <Route path="storeForm" element={<StoreForm />} />
          </Route>
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
      </Flex>
    </>
  );
}

export default App;
