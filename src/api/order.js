import service from "@/utils/request";

export function GetOrders() {
  return service.request({
    method: "get",
    url: "/orders/getOrders"
  });
}

export function EditOrder(data) {
  return service.request({
    method: "post",
    url: "/orders/editOrder",
    data
  });
}
export function EditOrderAddress(data) {
  return service.request({
    method: "post",
    url: "/orders/editOrderAddress",
    data
  });
}
export function GetOrderById(id) {
  return service.request({
    method: "post",
    url: "/orders/getOrderById",
    data: {
      oid: id
    }
  });
}
export function RemoveById(id) {
  return service.request({
    method: "post",
    url: "/orders/deleteMyOrder",
    data: {
      oid: id
    }
  });
}