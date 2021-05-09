import service from "@/utils/request";

export function GetWanteds() {
  return service.request({
    method: "get",
    url: "/wanteds/getWanteds"
  });
}

export function DelWanteds(wid) {
  return service.request({
    method: "post",
    url: "/wanteds/delete",
    data: {
      wid
    }
  });
}

export function ChangeDisplay(wid, isDisplay) {
  return service.request({
    method: "post",
    url: "/wanteds/changeDisplay",
    data: {
      wid,
      isDisplay
    }
  });
}

export function ChangeState(wid, val) {
  return service.request({
    method: "post",
    url: "/wanteds/changeState",
    data: {
      wid,
      val
    }
  });
}
