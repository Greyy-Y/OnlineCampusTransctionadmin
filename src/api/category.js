import service from "@/utils/request";

export function GetCate() {
  return service.request({
    method: "get",
    url: "/categories"
  });
}

export function AddFirstCate(data) {
  return service.request({
    method: "post",
    url: "/categories/addFirCate",
    data
  });
}

export function AddSecCate(data) {
  return service.request({
    method: "post",
    url: "/categories/addSubCate",
    data
  });
}
export function EditSubCate(data) {
  return service.request({
    method: "post",
    url: "/categories/editSubCate",
    data
  });
}
export function RemoveFirCate(data) {
  return service.request({
    method: "post",
    url: "/categories/removeFirCate",
    data: {
      id: data
    }
  });
}

export function RemoveSecCate(data) {
  return service.request({
    method: "post",
    url: "/categories/removeSecCate",
    data
  });
}
