// 获取二次封装的axios请求函数
import request from "@/utils/request";
// 获取一级分类数据接口
export const reqCategory1List = () => {
  return request({
    url: "/admin/product/getCategory1",
    method: "get",
  });
};
// 获取二级分类数据接口
export const reqCategory2List = (category1Id) => {
  return request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: "get",
  });
};
// 获取三级分类数据接口
export const reqCategory3List = (category2Id) => {
  return request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: "get",
  });
};

// 获取平台属性数据接口
export const reqAttrList = (category1Id, category2Id, category3Id) => {
  return request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: "get",
  });
};

export const reqAddOrUpdateAttr = (data) => {
  return request({
    url: "/admin/product/saveAttrInfo",
    method: "post",
    data: data,
  });
};

/** data
{
    "attrName": "string",
    "attrValueList": [
      {
        "attrId": 0,
        "valueName": "string"
      }
    ],
    "categoryId": 0,
    "categoryLevel": 0,
}
*/
