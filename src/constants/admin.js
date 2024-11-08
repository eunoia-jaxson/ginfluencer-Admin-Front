export const PAGE_SIZE = 10;

export const ADMIN_NAVIGATE_LIST = [
  { title: "공지사항", url: "/noticeList" },
  { title: "1:1 문의", url: "/askList" },
  { title: "FAQ", url: "/FAQList" },
];

export const STORE_TABLE_LAYOUT = [
  { name: "checkbox", value: "", width: "w-1/12" },
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

export const POPUP_TABLE_LAYOUT = [
  { name: "idx", value: "No.", width: "w-1/12" },
  { name: "title", value: "제목", width: "" },
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

export const NOTICE_TYPE = [
  { id: 0, code: "00", value: "선택" },
  { id: 1, code: "01", value: "공지" },
  { id: 2, code: "02", value: "뉴스" },
];

export const VIEW_TYPE = [
  { id: 1, code: "Y", value: "공개" },
  { id: 2, code: "N", value: "비공개" },
];

export const STORE_TYPE = [
  { id: 1, code: "01", value: "회원" },
  { id: 2, code: "02", value: "입금" },
  { id: 3, code: "03", value: "스티커" },
  { id: 4, code: "04", value: "키트" },
  { id: 5, code: "05", value: "업종" },
];

export const MEMBER_TYPE = [
  { id: 0, value: "선택" },
  { id: 1, value: "정회원" },
  { id: 2, value: "준회원" },
];

export const PAYMENT_TYPE = [
  { id: 0, value: "선택" },
  { id: 1, value: "입금" },
  { id: 2, value: "미입금" },
];

export const STICKER_TYPE = [
  { id: 0, value: "선택" },
  { id: 1, value: "완료" },
  { id: 2, value: "대기" },
];

export const KIT_TYPE = [
  { id: 0, value: "선택" },
  { id: 1, value: "완료" },
  { id: 2, value: "대기" },
];

export const INDUSTRY_TYPE = [
  { id: 0, value: "선택" },
  { id: 1, value: "식음료" },
  { id: 2, value: "교육" },
  { id: 3, value: "생활(서비스)" },
  { id: 4, value: "기타" },
];

export const MembershipLevel = {
  REGULAR_MEMBER: "REGULAR_MEMBER",
  ASSOCIATE_MEMBER: "ASSOCIATE_MEMBER",
};

export const Category = {
  FOOD: {
    description: "식음료",
    subCategories: {
      KOREAN: "한식",
      CHINESE: "중식",
      JAPANESE: "일식",
      WESTERN: "양식",
      GENERAL: "일반음식",
      FAST_FOOD: "패스트푸드",
      COFFEE_SHOP: "커피전문점",
      BAKERY: "제과점",
      ENTERTAINMENT_BAR: "유흥주점",
      DANRAN_BAR: "단란주점",
      BEER_HALL: "맥주홀",
    },
  },
  EDUCATION: {
    description: "교육",
    subCategories: {
      WORKSHOP: "체험(공방)",
      VOCATIONAL_ACADEMY: "직업전문학원",
      STUDY_CAFE: "스터디카페",
      SPORTS: "운동",
    },
  },
  SERVICE: {
    description: "생활(서비스)",
    subCategories: {
      OPTICS: "안경",
      BEAUTY: "미용",
      FLOWERS: "꽃",
      ACCOMMODATION_TRAVEL: "숙박/여행",
      MACHINERY: "기계",
      MEDICAL: "의료",
      STUDIO: "스튜디오",
    },
  },
  OTHER: {
    description: "기타",
    subCategories: {
      SUPERMARKET: "슈퍼마켓",
      BUTCHERY: "정육점",
      FOOD_SUPPLIES: "식품잡화",
      CONVENIENCE_STORE: "편의점",
    },
  },
};

export const ProvideTarget1 = {
  CHILD_ONLY: "CHILD_ONLY",
  WITH_ONE: "WITH_ONE",
  WITH_TWO: "WITH_TWO",
  OTHER: "OTHER",
};

export const ProvideTarget2 = {
  UNDERPRIVILEGED_CHILD: "UNDERPRIVILEGED_CHILD",
  FIREFIGHTER: "FIREFIGHTER",
  OTHER: "OTHER",
};

export const SnsType = {
  INSTA: "INSTA",
  KAKAO: "KAKAO",
  YOUTUBE: "YOUTUBE",
  TWITTER: "TWITTER",
  BAND: "BAND",
  NBLOG: "NBLOG",
  ETC: "ETC",
};
