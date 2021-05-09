import axios from "axios";
// import { showLoading, hideLoading } from "./loading";

// 创建axios 实例 赋值给变量service
// Api地址 http://localhost:3000/
const BASEURL = "http://localhost:3000";
const service = axios.create({
  baseURL: BASEURL,
  timeout: 10000
});
service.interceptors.request.use(
  function(request) {
    // 对请求数据做点什么
    // showLoading();
    return request;
  },
  function(error) {
    // 对响应错误做点什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器;
service.interceptors.response.use(
  function(response) {
    // 对响应数据做点什么

    // hideLoading();
    return response;
  },
  function(error) {
    // 对响应错误做点什么

    // hideLoading();
    return Promise.reject(error);
  }
);

export default service;
