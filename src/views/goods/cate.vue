<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品目录</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card style="margin-top:20px">
      <!-- 添加分类区域 -->
      <div class="form-container">
        <el-form
          :inline="true"
          ref="firCateFormRef"
          :model="firCateForm"
          :rules="firCateformRules"
        >
          <el-form-item label="添加一级目录" prop="name">
            <el-input
              v-model="firCateForm.name"
              placeholder="添加一级目录"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addFirCate">添加</el-button>
            <el-button @click="resetFirCateForm">重置</el-button>
          </el-form-item>
        </el-form>
        <el-form
          :inline="true"
          ref="secCateFormRef"
          :model="secCateForm"
          :rules="secCateformRules"
        >
          <el-form-item
            label="添加二级目录"
            prop="subName"
            style="margin-left:40px"
          >
            <el-cascader
              v-model="cateName"
              :options="catelist"
              @change="handleChange"
              :props="props"
              placeholder="请选择一级目录"
            ></el-cascader>
          </el-form-item>
          <el-form-item label=""
            ><el-input
              v-model="secCateForm.subName"
              placeholder="添加二级目录"
            ></el-input
          ></el-form-item>
          <el-form-item>
            <el-button type="primary" @click="addSecCate()">添加</el-button>
            <el-button @click="resetSecCateForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>

      <!-- 表格 -->
      <el-table
        :data="catelist"
        stripe
        border
        style="width: 90%;margin:0 auto;"
        height="560"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column label="一级目录" prop="name" width="120">
          <template slot-scope="scope">
            <div class="">{{ scope.row.name }}</div>
          </template>
        </el-table-column>
        <el-table-column label="二级目录" prop="name">
          <template slot-scope="scope">
            <div
              v-for="(sub, index) in scope.row.subCate"
              :key="index"
              class="sub-cate"
            >
              <div class="subname">
                {{ sub.subName }}
              </div>
              <div class="pic">
                <el-image
                  style="width: 110px; height: 110px"
                  :src="baseUrl + sub.pic"
                >
                </el-image>
              </div>
              <div class="opt-btn">
                <el-button
                  type="primary"
                  size="mini"
                  icon="el-icon-edit"
                  circle
                  style="margin-left:20px"
                  @click="editSecCateById(scope.row.name, sub._id)"
                ></el-button>
                <el-button
                  type="warning"
                  size="mini"
                  icon="el-icon-close"
                  circle
                  @click="removeSecCateByID(scope.row.name, sub._id)"
                ></el-button>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <!-- <el-button type="primary" size="small" @click="editFirCateById(scope.row._id)" style="margin-left:20px"
							>修改</el-button
						> -->
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              size="small"
              @click="removeCateById(scope.row._id)"
              style="margin-left:40px"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 修改分类 -->
      <el-dialog title="修改二级目录" :visible.sync="dialogFormVisible">
        <el-form :model="secCateForm">
          <el-form-item label="二级目录名" label-width="200px">
            <el-input
              v-model="secCateForm.subName"
              autocomplete="off"
              style="width:300px"
            ></el-input>
          </el-form-item>
          <el-form-item label="目录封面" label-width="200px">
            <el-upload
              action="http://localhost:3000/upload"
              list-type="picture-card"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :limit="parseInt(1)"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog :visible.sync="dialogVisible">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <!-- ！！！！！！！！！！！！！！！！！！！！！未实现为实现未实现 -->
          <el-button type="primary" @click="handleEditSubmit()"
            >确 定</el-button
          >
        </div>
      </el-dialog>

      <!-- 分页 -->
      <!-- <el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum"
				:page-sizes="[3, 5, 10, 15]"
				:page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
				style="margin-left:50px"
			>
			</el-pagination> -->
    </el-card>
  </div>
</template>

<script>
import {
  GetCate,
  AddFirstCate,
  AddSecCate,
  EditSubCate,
  RemoveFirCate,
  RemoveSecCate
} from "../../api/category";
export default {
  data() {
    return {
      queryInfo: {
        // 当前页数
        pagenum: 1,
        // 当前每页显示多少条数据
        pagesize: 10
      },
      catelist: [],
      cateName: [],
      total: 0,
      // 添加分类的表单数据
      firCateForm: {
        name: ""
      },
      firCateName: "",
      secCateName: "",
      subCateId: "",
      secCateForm: {
        subName: "",
        pic: ""
      },

      // 添加表单验证规则
      firCateformRules: {
        name: [
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ]
      },
      secCateformRules: {
        subName: [
          { min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
        ]
      },
      props: { value: "name", label: "name" },
      dialogFormVisible: false,
      dialogVisible: false,
      dialogImageUrl: "",
      baseUrl: "http://localhost:3000/"
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const res = await GetCate();
      if (res.status !== 200) {
        return this.$message.error("获取目录列表失败");
      }
      this.catelist = res.data;
      this.cateName = this.catelist.map(v => {
        return v.name;
      });
      this.total = res.data.total;
    },

    handleChange(e) {
      this.firCateName = e;
    },
    // 监听 pagesize 改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getCateList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getCateList();
    },
    // 根据id删除对应分类信息
    async removeCateById(id) {
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该目录(包括该目录下的所有子目录), 是否继续?",
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
      const res = await RemoveFirCate(id);
      if (res.data.status !== 200) {
        return this.$message.error(res.data.message);
      }
      this.$message.success(res.data.message);
      this.getCateList();
    },

    editSecCateById(name, id) {
      (this.subCateId = id), (this.firCateName = name);
      this.dialogFormVisible = true;
    },

    async removeSecCateByID(name, id) {
      const confirmResult = await this.$confirm(
        "此操作将永久删除该目录, 是否继续?",
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
      let data = {
        name: name,
        id: id
      };
      const res = await RemoveSecCate(data);
      if (res.data.status !== 200) {
        return this.$message.error(res.data.message);
      }
      this.$message.success(res.data.message);
      this.getCateList();
    },
    // 提交修改二级分类表单
    async handleEditSubmit() {
      let data = {
        subId: this.subCateId,
        name: this.firCateName,
        subName: this.secCateForm.subName,
        pic: this.secCateForm.pic
      };
      console.log(data);

      const res = await EditSubCate(data);
      if (res.data.status !== 200) {
        return this.$message.error(res.data.message);
      }
      this.$message.success(res.data.message);
      this.getCateList();
      this.dialogFormVisible = false;
    },
    // 点击按钮添加分类
    async addFirCate() {
      this.$refs.firCateFormRef.validate(async valid => {
        if (!valid) return;
        if (this.firCateForm.name === "")
          return this.$message.error("请输入目录名称！");
        // 可以发起添加用户的网络请求
        const res = await AddFirstCate(this.firCateForm);
        console.log(res);
        if (res.data.status === 400) {
          // 重置表单
          this.resetFirCateForm();
          this.$message.error(res.data.message);
        } else if (res.data.status === 401) {
          // 重置表单
          this.resetFirCateForm();
          return this.$message.error(res.data.message);
        }
        this.$message.success(res.data.message);
        // 重置表单
        this.resetFirCateForm();
        // 重新获取分类列表数据
        this.getCateList();
      });
    },
    async addSecCate() {
      this.$refs.secCateFormRef.validate(async valid => {
        if (!valid) return;
        if (this.firCateName === "")
          return this.$message.error("请先选择一级目录名称！");
        if (this.secCateForm.subName === "")
          return this.$message.error("请输入目录名称！");
        // 可以发起添加用户的网络请求
        let data = {
          name: this.firCateName,
          subCate: [
            { subName: this.secCateForm.subName, pic: this.secCateForm.pic }
          ]
        };
        const res = await AddSecCate(data);
        console.log(res);
        if (res.data.status === 400) {
          // 重置表单
          this.resetSecCateForm();
          this.$message.error(res.data.message);
        } else if (res.data.status === 401) {
          // 重置表单
          this.resetSecCateForm();
          return this.$message.error(res.data.message);
        }
        this.$message.success(res.data.message);
        // 重置表单
        this.resetSecCateForm();
        // 重新获取分类列表数据
        this.getCateList();
      });
    },
    // 重置表单
    resetFirCateForm() {
      this.$refs.firCateFormRef.resetFields();
    },
    resetSecCateForm() {
      this.$refs.secCateFormRef.resetFields();
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    //图片上传成功
    handleSuccess(file) {
      console.log(file);
      this.secCateForm.pic = file.imgsPath[0].url;
      console.log(this.secCateForm);
    }
  }
};
</script>

<style lang="scss" scoped>
.sub-cate {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d3d3d3;
  font-size: 0.8rem;
  .subname {
    width: 120px;
    padding-left: 20px;
  }
  .pic {
    width: 180px;
  }
}
.form-container {
  display: flex;
}
.choose-fir {
}
</style>
