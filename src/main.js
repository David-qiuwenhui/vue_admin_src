import Vue from "vue";

import "normalize.css/normalize.css"; // A modern alternative to CSS resets

// 引入element-ui和css样式
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import locale from "element-ui/lib/locale/lang/en"; // lang i18n

import "@/styles/index.scss"; // global css

import App from "./App";
import store from "./store";
import router from "./router";

import "@/icons"; // icon
import "@/permission"; // permission control
import "@/mock/mockServer.js";
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === "production") {
//     const { mockXHR } = require("./mock");
//     mockXHR();
// }

// set ElementUI lang to EN
Vue.use(ElementUI, { locale });
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;
// 引入API请求接口
// 任意组件可以使用API相关的接口
import API from "@/api/apiExport";
Vue.prototype.$API = API;
// 引入注册三级联动菜单组件（全局）
import CategorySelect from "@/components/CategorySelect/CategorySelect";
Vue.component(CategorySelect.name, CategorySelect);
// 引入二次封装按钮组件（全局）
import HintButton from "@/components/HintButton/HintButton";
Vue.component(HintButton.name, HintButton);

new Vue({
    el: "#app",
    router,
    store,
    render: (h) => h(App),
});
