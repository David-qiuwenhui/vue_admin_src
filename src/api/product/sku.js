import request from "@/utils/request";

// 请求获取sku列表的数据
export const reqSkuList = (page, limit) => {
    return request({
        url: `/admin/product/list/${page}/${limit}`,
        method: "get",
    });
};

// 请求将某一个商品上架
export const reqOnSale = (skuId) => {
    return request({
        url: `/admin/product/onSale/${skuId}`,
        method: "get",
    });
};

// 请求将某一商品下架
export const reqCancelSale = (skuId) => {
    return request({
        url: `/admin/product/cancelSale/${skuId}`,
        method: "get",
    });
};

// 请求获取sku详情数据
export const reqSkuById = (skuId) => {
    return request({
        url: `/admin/product/getSkuById/${skuId}`,
        method: "get",
    });
};
