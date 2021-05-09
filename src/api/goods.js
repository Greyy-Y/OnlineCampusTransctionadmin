import service from "@/utils/request";

export function GetGoods() {
  return service.request({
    method: "get",
    url: "/goods/getGoods"
  });
}

export function RemoveById(gid) {
  return service.request({
    method: "post",
    url: "/goods/removeById",
    data: {
      gid
    }
  });
}

export function ChangeDisplay(gid, isDisplay) {
  return service.request({
    method: "post",
    url: "/goods/changeDisplay",
    data: {
      gid,
      isDisplay
    }
  });
}

export function ChangeState(gid, val) {
  return service.request({
    method: "post",
    url: "/goods/changeState",
    data: {
      gid,
      val
    }
  });
}
