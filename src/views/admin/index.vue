<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card class="wrapper">
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <!-- <el-col :span="9">
					<el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getAdmin">
						<el-button slot="append" icon="el-icon-search" @click="getAdmin"></el-button>
					</el-input>
				</el-col> -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加管理员</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户列表区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="昵称" prop="nickName"></el-table-column>
        <el-table-column label="真实姓名" prop="realName"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="状态" prop="state">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.state"
              @change="userStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row._id)"
            ></el-button>
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
    <!-- 添加用户的对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      center
      @close="addDialogClosed"
    >
      <!-- 内容主体区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="addForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="70px"
      >
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email" disabled></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="editForm.nickName"></el-input>
        </el-form-item>
        <el-form-item label="真实名称" prop="realName">
          <el-input v-model="editForm.realName"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetAdmin,
  GetAdminById,
  UpdateAdmin,
  DeleteAdmin,
  Register,
  UpdateState
} from "../../api/admin";
export default {
  data() {
    // 验证邮箱规则
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };

    return {
      queryInfo: {
        query: "",
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 5
      },
      userList: [],
      total: 0,
      // 控制添加对话框的显示隐藏
      addDialogVisible: false,
      // 添加用户的表单数据
      addForm: {
        email: "",
        password: "",
        nickName: ""
      },
      // 添加表单的验证规则对象
      addFormRules: {
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "密码长度在6-15个字符之间",
            trigger: "blur"
          }
        ],
        nickName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "用户名长度在2-15个字符之间",
            trigger: "blur"
          }
        ],
        realName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "用户名长度在2-15个字符之间",
            trigger: "blur"
          }
        ]
      },
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      // 查询到的用户信息对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        nickName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "用户名长度在2-15个字符之间",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getAdmin();
  },
  methods: {
    // 获取管理员用户信息
    async getAdmin() {
      const res = await GetAdmin();
      console.log(res);
      if (res.status !== 200) {
        return this.$message.error("获取管理员列表失败");
      }
      // console.log(res)
      this.userList = res.data.data;
      this.total = res.data.total;
    },
    // 监听 pagesize 改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getAdmin();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getAdmin();
    },
    // 监听switch 开关状态的改变
    async userStateChanged(userinfo) {
      let data = {
        aid: userinfo._id,
        state: userinfo.state
      };
      const res = await UpdateState(data);
      console.log(userinfo);
      if (res.data.status !== 200) {
        userinfo.state = !userinfo.state;
        return this.$message.error("更新用户状态失败！");
      }
      this.$message.success("更新用户状态成功！");
    },
    // 监听添加用户对话框的关闭事件
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    // 点击按钮添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) return;
        // 可以发起添加用户的网络请求
        console.log(this.addForm);
        const res = await Register(this.addForm);
        if (res.data.status === 200) {
          this.$message.success(res.data.message);
        } else {
          this.$message.error(res.data.message);
        }

        // 隐藏添加用户的对话框
        this.addDialogVisible = false;
        // 重新获取用户列表数据
        this.getAdmin();
      });
    },
    // 展示用户编辑的对话框
    async showEditDialog(id) {
      const res = await GetAdminById(id);

      if (res.data.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }

      this.editForm = res.data.admin[0];
      this.editDialogVisible = true;
    },
    // 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户信息并提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;
        // 发起修改用户信息的数据请求
        let data = {
          aid: this.editForm._id,
          nickName: this.editForm.nickName,
          realName: this.editForm.realName
        };
        const res = await UpdateAdmin(data);
        if (res.data.status !== 200) {
          return this.$message.error("更新用户信息失败！");
        }
        this.$message.success(res.data.message);
        this.editDialogVisible = false;
        this.getAdmin();
      });
    },
    // 根据用户id删除对应的用户信息
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
      const res = await DeleteAdmin({ aid: id });
      if (res.data.status !== 200) {
        return this.$message.error(res.data.message);
      }
      this.$message.success(res.data.message);
      this.getAdmin();
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  margin-top: 20px;
}
</style>
