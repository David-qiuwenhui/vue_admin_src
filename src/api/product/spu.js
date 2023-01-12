import request from "@/utils/request";

// 获取Spu列表数据的接口
export const reqSpuList = (page, limit, category3Id) => {
    return request({
        url: `/admin/product/${page}/${limit}`,
        method: "get",
        params: { category3Id },
    });
};

// 获取Spu信息
export const reqSpuInfo = (spuId) => {
    return request({
        url: `/admin/product/getSpuById/${spuId}`,
        method: "get",
    });
};

// 获取品牌信息
export const reqTrademarkList = () => {
    return request({
        url: "/admin/product/baseTrademark/getTrademarkList",
        method: "get",
    });
};

// 获取SPU图标的接口
export const reqSpuImageList = (spuId) => {
    return request({
        url: `/admin/product/spuImageList/${spuId}`,
        method: "get",
    });
};

// 获取单个Spu编辑页面的销售属性
export const reqBaseSaleAttrList = () => {
    return request({
        url: "/admin/product/baseSaleAttrList",
        method: "get",
    });
};

// 请求添加或修改spu信息
export const reqAddOrUpdateAttr = (spuInfo) => {
    // 通过spuInfo.id判断当前是添加还是修改spu信息
    if (spuInfo.id) {
        return request({
            url: "/admin/product/updateSpuInfo",
            method: "post",
            data: spuInfo,
        });
    } else {
        return request({
            url: "/admin/product/saveSpuInfo",
            method: "post",
            data: spuInfo,
        });
    }
};

// 请求删除spu
export const reqDeleteSpu = (spuId) => {
    return request({
        url: `/admin/product/deleteSpu/${spuId}`,
        method: "delete",
    });
};

// 请求获取Spu图片的数据 添加sku的界面
export const reqSpuImageListSku = (spuId) => {
    return request({
        url: `/admin/product/spuImageList/${spuId}`,
        method: "get",
    });
};

// 请求获取Spu销售属性的数据
export const reqSpuSaleAttrList = (spuId) => {
    return request({
        url: `/admin/product/spuSaleAttrList/${spuId}`,
        method: "get",
    });
};

// 请求获取平台属性的数据
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => {
    return request({
        url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
        method: "get",
    });
};

// 请求添加sku数据
export const reqAddSku = (skuInfo) => {
    return request({
        url: "/admin/product/saveSkuInfo",
        method: "post",
        data: skuInfo,
    });
};

// 请求获取sku列表数据
export const reqSkuList = (spuId) => {
    return request({
        url: `/admin/product/findBySpuId/${spuId}`,
        method: "get",
    });
};
