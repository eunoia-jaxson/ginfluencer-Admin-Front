export const PAGE_SIZE = 10;

export const ADMIN_NAVIGATE_LIST = [
  { title: "공지사항", url: "/noticeList" },
  { title: "1:1 문의", url: "/askList" },
  { title: "FAQ", url: "/FAQList" },
];

export const STORE_TABLE_LAYOUT = [
  { name: "idx", value: "No.", width: "w-1/12" },
  { name: "regularYn", value: "회원구분", width: "w-1/12" },
  { name: "name", value: "가게명", width: "w-4/12" },
  { name: "reg_Dt", value: "신청일자", width: "w-1/12" },
  { name: "creditYn", value: "입금확인", width: "w-1/12" },
  { name: "stickerYn", value: "스티커발송", width: "w-1/12" },
  { name: "kitYn", value: "키트발송", width: "w-1/12" },
  { name: "viewYn", value: "노출여부", width: "w-1/12" },
];

export const NOTICE_TABLE_LAYOUT = [
  { name: "idx", value: "No.", width: "w-1/12" },
  { name: "type", value: "구분", width: "w-1/12" },
  { name: "title", value: "제목", width: "" },
  { name: "regDt", value: "작성일", width: "w-[10%]" },
  { name: "viewYn", value: "노출 여부", width: "w-1/12" },
];

export const ASK_TABLE_LAYOUT = [
  { name: "idx", value: "No.", width: "w-1/12" },
  { name: "type", value: "분류", width: "w-2/12" },
  { name: "title", value: "제목", width: "" },
  { name: "answerYn", value: "답변상태", width: "w-1/12" },
  { name: "regDt", value: "작성일", width: "w-[10%]" },
  // { name: 'secretYn', value: '답변하기', width: 'w-1/12' },
];

export const FAQ_TABLE_LAYOUT = [
  { name: "idx", value: "No.", width: "w-1/12" },
  { name: "title", value: "제목", width: "" },
  { name: "regDt", value: "작성일", width: "w-[10%]" },
  { name: "viewYn", value: "노출 여부", width: "w-1/12" },
];

export const POST_CATEGORY = [
  { title: "팝업 띄우기", url: "/post?type=popup" },
  { title: "기부금 설정", url: "/post?type=donation" },
];

export const ASK_TYPE = [
  { id: 0, code: "00", value: "선택" },
  { id: 1, code: "01", value: "회원정보" },
  { id: 2, code: "02", value: "선한가게신청" },
  { id: 3, code: "03", value: "후원" },
  { id: 4, code: "04", value: "기타" },
  { id: 5, code: "05", value: "학생" },
];