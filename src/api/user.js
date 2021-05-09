import service from "@/utils/request";

export function GetUsers(data) {
  return service.request({
    method: "get",
    url: "/users/getUsers",
    data
  });
}

export function DeleteUserById(data) {
  return service.request({
    method: "post",
    url: "/users/deleteUserById",
    data: {
      uid: data.uid
    }
  });
}
