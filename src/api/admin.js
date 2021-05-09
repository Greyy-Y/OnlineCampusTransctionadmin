import service from "@/utils/request";

export function Register(data) {
  return service.request({
    method: "post",
    url: "/admins/add",
    data
  });
}
export function Login(data) {
  return service.request({
    method: "post",
    url: "/admins/login",
    data
  });
}

export function GetAdmin() {
  return service.request({
    method: "get",
    url: "/admins/getAdmins"
  });
}

export function GetAdminById(data) {
  return service.request({
    method: "post",
    url: "/admins/getAdminsById",
    data: {
      aid: data
    }
  });
}

export function UpdateAdmin(data) {
  return service.request({
    method: "post",
    url: "/admins/updateAdmin",
    data: {
      aid: data.aid,
      nickName: data.nickName,
      realName: data.realName
    }
  });
}
export function UpdateState(data) {
  return service.request({
    method: "post",
    url: "/admins/updateState",
    data: {
      state: data.state,
      aid: data.aid
    }
  });
}

export function DeleteAdmin(data) {
  return service.request({
    method: "post",
    url: "/admins/deleteAdmin",
    data: {
      aid: data.aid
    }
  });
}
