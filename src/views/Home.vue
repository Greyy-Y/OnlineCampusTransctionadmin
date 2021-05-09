<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span style="color:#feffde">校园网上交易后台管理系统</span>
      </div>
      <el-button
        type="info"
        @click="logout"
        style="background-color:#52734d; color:#feffde"
        >退出</el-button
      >
    </el-header>
    <!-- 页面体 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'" class="nav-bar">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#91c788"
          text-color="#5b8a72"
          active-text-color="#feffde"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 一级菜单  -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.tname }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/' + subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/' + subItem.path)"
            >
              <!-- 图标 -->
              <i class="el-icon-menu"></i>
              <!-- 文本 -->
              <span>{{ subItem.tname }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主体内容 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [
        {
          id: 1,
          tname: "用户管理",
          children: [
            {
              id: 101,
              tname: "管理员列表",
              path: "admins"
            },
            {
              id: 102,
              tname: "用户列表",
              path: "users"
            }
          ]
        },
        {
          id: 2,
          tname: "商品管理",
          children: [
            {
              id: 201,
              tname: "商品列表",
              path: "goods"
            },
            {
              id: 202,
              tname: "求购商品列表",
              path: "wanteds"
            },
            {
              id: 203,
              tname: "商品目录",
              path: "categories"
            },
            {
              id: 204,
              tname: "推荐列表",
              path: "recommend"
            }
          ]
        },
        {
          id: 3,
          tname: "订单管理",
          children: [
            {
              id: 301,
              tname: "订单列表",
              path: "orders"
            }
          ]
        }
      ],
      iconsObj: {
        1: "el-icon-user-solid",
        2: "el-icon-s-goods",
        3: "el-icon-s-order"
      },
      // 是否折叠
      isCollapse: false,
      // 激活链接地址
      activePath: ""
    };
  },
  created() {
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //  点击按钮使菜单折叠与展开
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    // 保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    }
  }
};
</script>

<style lang="scss" scoped>
.home-container {
  height: 100vh;
  overflow: hidden;
}
.el-header {
  background: #91c788;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  div {
    display: flex;
    align-items: center;
    span {
      margin-left: 20px;
    }
  }
  img {
    width: 40px;
    height: 40px;
    margin-left: 20px;
  }
}
.el-aside {
  background: #91c788;
  transition: width ease-in-out 0.3s;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background: #fffff9;
}
.toggle-button {
  background: #ddffbc;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
i {
  color: #5b8a72;
}
</style>
