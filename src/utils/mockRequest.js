// 二次封装axios
import axios from "axios";
// 引入进度条
import nprogress from "nprogress";
// 引入进度条样式
import "nprogress/nprogress.css";

// 利用axios对象的方法create 创建一个axios实例
// request是经过配置的axios
const mockRequests = axios.create({
    /****** 配置对象 ******/
    // 基础路径 发送请求的时候 路径当中会出现api
    baseURL: "/mock",
    // 代表请求超时的时间5s
    timeout: 5000,
});

/****** 请求拦截器 ******/
// 在发送请求之前 请求拦截器可以检测到 可以在请求发送出去之前做处理
mockRequests.interceptors.request.use((config) => {
    // config配置对象 对象里的header属性很重要
    // 进度条启动
    nprogress.start();
    return config;
});

/****** 响应拦截器 ******/
mockRequests.interceptors.response.use(
    (res) => {
        // 响应成功的回调函数 服务器响应数据回来之后 响应拦截器可以检测到 可以做处理
        // 进度条结束
        nprogress.done();
        return res.data;
    },
    (error) => {
        // 响应失败的回调函数
        console.log("mockRequest error");
        console.log(error.message);
        return Promise.reject(new Error("faile"));
    }
);

export default mockRequests;

// import axios from "axios";
// import { MessageBox, Message } from "element-ui";
// import store from "@/store";
// import { getToken } from "@/utils/auth";

// // create an axios instance
// const service = axios.create({
//     baseURL: process.env.VUE_APP_MOCK_API, // url = base url + request url
//     // withCredentials: true, // send cookies when cross-domain requests
//     timeout: 5000, // request timeout
// });

// // 请求拦截器 携带token字段  request interceptor
// service.interceptors.request.use(
//     (config) => {
//         // do something before request is sent

//         if (store.getters.token) {
//             // let each request carry token
//             // ['X-Token'] is a custom headers key
//             // please modify it according to the actual situation
//             config.headers["token"] = getToken();
//         }
//         return config;
//     },
//     (error) => {
//         // do something with request error
//         console.log(error); // for debug
//         return Promise.reject(error);
//     }
// );

// // 响应拦截器  response interceptor
// service.interceptors.response.use(
//     /**
//      * If you want to get http information such as headers or status
//      * Please return  response => response
//      */

//     /**
//      * Determine the request status by custom code
//      * Here is just an example
//      * You can also judge the status by HTTP Status Code
//      */
//     (response) => {
//         const res = response.data;

//         // if the custom code is not 20000, it is judged as an error.
//         if (res.code !== 20000 && res.code !== 200) {
//             Message({
//                 message: res.message || "Error",
//                 type: "error",
//                 duration: 5 * 1000,
//             });

//             // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//             if (
//                 res.code === 50008 ||
//                 res.code === 50012 ||
//                 res.code === 50014
//             ) {
//                 // to re-login
//                 MessageBox.confirm(
//                     "You have been logged out, you can cancel to stay on this page, or log in again",
//                     "Confirm logout",
//                     {
//                         confirmButtonText: "Re-Login",
//                         cancelButtonText: "Cancel",
//                         type: "warning",
//                     }
//                 ).then(() => {
//                     store.dispatch("user/resetToken").then(() => {
//                         location.reload();
//                     });
//                 });
//             }
//             return Promise.reject(new Error(res.message || "Error"));
//         } else {
//             return res;
//         }
//     },
//     (error) => {
//         console.log("err" + error); // for debug
//         Message({
//             message: error.message,
//             type: "error",
//             duration: 5 * 1000,
//         });
//         return Promise.reject(error);
//     }
// );

// export default service;
