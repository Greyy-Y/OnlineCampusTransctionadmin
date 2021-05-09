import service from "@/utils/request";

export function GetRecommend() {
  return service.request({
    method: "get",
    url: "/recommend/getRecommend"
  });
}
export function GetFeatured() {
  return service.request({
    method: "get",
    url: "/recommend/getFeatured"
  });
}

export function RemoveById(data) {
  return service.request({
    method: "post",
    url: "/recommend/removeById",
    data
  });
}

export function Add(data) {
  return service.request({
    method: "post",
    url: "/recommend/add",
    data
  });
}
