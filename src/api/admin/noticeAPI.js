export const NoticeAPI = (API) => ({
  getNotices: ({ params }) =>
    API.get('admin/announcements', {
      params: { page: params.curPages, size: params.pageSize },
      headers: {
        Access_Token: '1111111',
        Web: 'Y',
      },
    }).then((response) => {
      const result = response.data;
      const data = result['_embedded']['adminAllNoticeResourceList'];
      const page = result['page'];
      const links = result['_links'];
      return { data, page, links };
    }),

  getNotice: ({ id }) =>
    API.get(`admin/notice/${id}`, {
      headers: {
        Access_Token: '1111111',
        Web: 'Y',
      },
    }).then((response) => response.data),

  updateNotice: ({ id, data }) =>
    API.patch(`admin/notice/update/${id}`, data, {
      headers: {
        Access_Token: '1111111',
        Web: 'Y',
      },
    }).then((response) => response.data),

  createNotice: ({ data }) =>
    API.post('admin/notice/', data, {
      headers: {
        Access_Token: '1111111',
        Web: 'Y',
      },
    }).then((response) => {
      return response.data;
    }),

  deleteNotice: ({ id }) =>
    API.delete(`admin/notice/delete/${id}`, {
      headers: {
        Access_Token: '1111111',
        Web: 'Y',
      },
    }).then((response) => {
      console.log(response, '??');
      return response.data;
    }),

  uploadNoticeImage: ({ data }) =>
    API.post(`admin/notice/upload`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Access_Token: '1111111',
        Web: 'Y',
      },
    }).then((response) => response.data),

  addFileNotice: ({ id, data }) =>
    API.post(`admin/notice/update/addfile/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Access_Token: '1111111',
        Web: 'Y',
      },
    }).then((response) => response.data),

  deleteFileNotice: ({ data }) =>
    API.delete(`admin/notice/update/delfile`, {
      data: data,
      headers: {
        Access_Token: '1111111',
        Web: 'Y',
      },
    }).then((response) => response.data),
});
