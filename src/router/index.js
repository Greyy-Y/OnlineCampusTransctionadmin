import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

const routes = [
  /**
   * 首页
   */
  {
    path: "/",
    redirect: "login"
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login/index.vue")
  },
  {
    path: "/home",
    name: "Home",
    component: () => import("../views/home.vue"),
    children: [
      {
        path: "/admins",
        name: "Admin",
        component: () => import("../views/admin/index.vue")
      },
      {
        path: "/users",
        name: "User",
        component: () => import("../views/user/index.vue")
      },
      {
        path: "/goods",
        name: "Good",
        component: () => import("../views/goods/list.vue")
      },
      {
        path: "/wanteds",
        name: "Good",
        component: () => import("../views/goods/wantedList.vue")
      },
      {
        path: "/categories",
        name: "Category",
        component: () => import("../views/goods/cate.vue")
      },
      {
        path: "/recommend",
        name: "Recommend",
        component: () => import("../views/goods/recommend.vue")
      },
      {
        path: "/orders",
        name: "Order",
        component: () => import("../views/order/index.vue")
      }
    ]
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
