import axios from 'axios';
// import requestAPI from './requestAPI';
// import postAPI from './postAPI';
// import authAPI from './authAPI';
// import businessesAPI from './businessesAPI';
// import signupAPI from './signupAPI';
// import communityAPI from './communityAPI';
// import mypageAPI from './mypageAPI';
// import updateAPI from './updateAPI';
// import donationAPI from './donationAPI';

import noticeAPI from './admin/noticeAPI';
// import storeAPI from './admin/storeAPI';
// import askAPI from './admin/askAPI';
// import faqAPI from './admin/faqAPI';
// import adminAuthAPI from './admin/adminAuthAPI';
// import adminPostAPI from './admin/adminPostAPI';

// import TokenService from './tokenService';

axios.defaults.withCredentials = true;

export const setAuthHeaders = () => ({
  headers: {
    Access_Token: '1234',
    Web: 'Y',
  },
  withCredentials: true,
});

export const setMultipartHeaders = () => ({
  headers: {
    Access_Token: '1234566',
    Web: 'Y',
    'Content-Type': 'multipart/form-data',
  },
});

// export const setAuthAndMutlpartHeaders = () => ({
//   headers: {
//     Access_Token: TokenService.getAccessToken(),
//     'Content-Type': 'multipart/form-data',
//     Web: 'Y',
//   },
// });

export const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Web: 'Y',
  },
  withCredentials: true,
});

// export const AuthAPI = authAPI(API);
// export const RequestAPI = requestAPI(API);
// export const PostAPI = postAPI(API);
// export const BusinessesAPI = businessesAPI(API);
// export const SignupAPI = signupAPI(API);
// export const CommunityAPI = communityAPI(API);
// export const MyPageAPI = mypageAPI(API);
// export const UpdateAPI = updateAPI(API);
// export const DonationAPI = donationAPI(API);

// Admin
// export const StoreAPI = storeAPI(API);
export const NoticeAPI = noticeAPI(API);
// export const AskAPI = askAPI(API);
// export const FaqAPI = faqAPI(API);
// export const AdminAuthAPI = adminAuthAPI(API);
// export const AdminPostAPI = adminPostAPI(API);
