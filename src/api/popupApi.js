import axios from "axios";

// 전체 팝업 내역 불러오기
export const fetchAllPopups = async () => {
  try {
    const response = await axios.get(
      `${process.env.BASE_URL}/api/admin/popups`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `X-API-Key`, // API Key를 Authorization 헤더에 추가
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching popups:", error);
    throw error; // 오류를 호출자에게 전달
  }
};

// 팝업 1개 불러오기
export const fetchPopupById = async (id) => {
  const response = await axios.get(`/api/admin/popups/${id}`);
  return response.data;
};

// 팝업 생성
export const createPopup = async (popupData) => {
  const response = await axios.post("/api/admin/popups", popupData);
  return response.data;
};

// 팝업 수정
export const updatePopup = async (id, popupData) => {
  const response = await axios.patch(`/api/admin/popups/${id}`, popupData);
  return response.data;
};

// 공개된 팝업 보이기
export const fetchVisiblePopups = async () => {
  const response = await axios.get("/api/all/popups/visible");
  return response.data;
};
