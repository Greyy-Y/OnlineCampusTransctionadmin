<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>客户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card style="margin-top:20px">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <!-- <el-col :span="9">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col> -->
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="clientList" stripe border class="margin-top">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="nickName"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>

        <el-table-column label="地址" prop="address">
          <template slot-scope="scope">
            <div v-for="(address, index) in scope.row.address" :key="index">
              {{ index + 1 }}&nbsp;: &nbsp;&nbsp; {{ address.detailAdd }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="注册时间">
          <template slot-scope="scope">
            {{ scope.row.createdTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row._id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <!-- <el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum"
				:page-sizes="[1, 2, 5, 10]"
				:page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
			>
			</el-pagination> -->
    </el-card>
  </div>
</template>

<script>
import { GetUsers, DeleteUserById } from "../../api/user";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5
      },
      clientList: [],
      total: 0
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const res = await GetUsers();
      if (res.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      // console.log(res)
      this.clientList = res.data.data;
      console.log(this.clientList);
      this.clientList.forEach(element => {
        element.createdTime = this.dayjs(element.createdTime).format(
          "YYYY-MM-DD"
        );
        return element;
      });
      this.total = res.data.total;
    },
    // 监听 pagesize 改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 根据用户id删除对应的客户信息
    async removeUserById(id) {
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);

      // 如果用户确认删除，则返回字符串confirm
      // 如果用户取消删除，则返回字符串cancel
      if (confirmResult !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const res = await DeleteUserById({ uid: id });
      this.$message.success(res.data.message);
      this.getUserList();
    }
  }
};
</script>

<style lang="scss" scoped>
.margin-top {
  margin-top: 20px;
}
</style>
