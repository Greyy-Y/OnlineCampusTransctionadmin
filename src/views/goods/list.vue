<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card style="margin-top:20px">
      <!-- table表格区域 -->
      <el-table :data="goodslist" border stripe height="660">
        <el-table-column label="商品图片" width="120px">
          <template slot-scope="scope">
            <el-image
              style="width: 110px; height: 110px"
              :src="baseUrl + scope.row.pic[0]"
            >
            </el-image>
          </template>
        </el-table-column>
        <el-table-column
          label="商品名称"
          fixed="left"
          prop="name"
          width="180px"
        ></el-table-column>
        <el-table-column
          label="商品价格(￥)"
          prop="price"
          width="105px"
        ></el-table-column>
        <el-table-column
          label="商品原价(￥)"
          prop="originPrice"
          width="105px"
        ></el-table-column>
        <el-table-column
          label="新旧程度/成"
          prop="new"
          width="100px"
        ></el-table-column>
        <el-table-column
          label="商品数量"
          prop="count"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="商品描述"
          prop="desc"
          width="300px"
        ></el-table-column>
        <el-table-column label="更新时间" prop="updatedAt" width="120px">
          <template scope="scope">
            {{ scope.row.updatedAt }}
          </template>
        </el-table-column>
        <el-table-column
          label="审核状态"
          prop="state"
          width="180px"
          fixed="right"
        >
          <template slot-scope="scope">
            <div v-if="scope.row.state === 1">
              <span style="color:#ff8585;font-weight:bold">未审核</span>

              <el-button
                type="primary"
                size="mini"
                icon="el-icon-check"
                circle
                @click="changeState(scope.row._id, 2)"
                style="margin-left:20px"
              ></el-button>
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-close"
                circle
                @click="changeState(scope.row._id, 0)"
              ></el-button>
            </div>
            <div style="font-size:1.1rem" v-else>
              <!-- <span style="color:#ff8585;font-weight:bold">已审核</span> -->
              <div v-if="scope.row.state === 0">
                <span style="color:#be0000">不合格</span>
              </div>
              <div v-else-if="scope.row.state === 2">
                <span style="color:#9ede73">合格</span>
              </div>
            </div>
          </template>
        </el-table-column>

        <el-table-column fixed="right" label="操作" width="200px">
          <template slot-scope="scope">
            <div
              style="display:flex;justify-content;align-items:center;flex-direction:column"
            >
              <!-- 上下架按钮 -->
              <div style="margin-bottom:20px;display:flex">
                <div
                  class=""
                  v-if="scope.row.state === 2"
                  style="margin-right:10px"
                >
                  <el-button
                    type="warning"
                    size="mini"
                    @click="changeDisplay(scope.row._id, false)"
                    v-if="scope.row.display"
                    >下架</el-button
                  >
                  <el-button
                    type="primary"
                    size="mini"
                    @click="changeDisplay(scope.row._id, true)"
                    v-else
                    >上架</el-button
                  >
                </div>
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  size="mini"
                  @click="removeById(scope.row._id)"
                  >删除</el-button
                >
              </div>

              <div class="" v-if="scope.row.display" style="display:flex">
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="设为推荐商品"
                  placement="top"
                >
                  <el-button
                    size="small"
                    icon="el-icon-star-on"
                    circle
                    @click="setRecommend(scope.row._id, 0)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip
                  class="item"
                  effect="dark"
                  content="设为精选商品"
                  placement="top"
                >
                  <el-button
                    size="small"
                    style=";margin-left:20px"
                    circle
                    icon="el-icon-medal"
                    @click="setRecommend(scope.row._id, 1)"
                  ></el-button>
                </el-tooltip>
              </div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <!-- <el-pagination
				style="margin-top:20px"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum"
				:page-sizes="[10, 15, 20, 30]"
				:page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
				background
			>
			</el-pagination> -->
    </el-card>

    <!-- 移入推荐列表的对话框 -->
  </div>
</template>

<script>
import {
  GetGoods,
  RemoveById,
  ChangeDisplay,
  ChangeState
} from "../../api/goods";
import { Add } from "../../api/recommend";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      goodslist: [],
      total: 0,
      cover: "",
      // 控制移入推荐对话框的显示隐藏
      addreDialogVisible: false,
      // 推荐
      addreForm: {
        r_type: 1,
        goods: "",
        r_type_name: "人气产品"
      },
      // 移入推荐表单的验证规则对象
      addreFormRules: {
        r_type: [{ required: true, message: "请选择推荐类型", trigger: "blur" }]
      },
      baseUrl: "http://localhost:3000/"
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 获取商品列表
    async getGoodsList() {
      const res = await GetGoods();
      if (res.status !== 200) {
        return this.$message.error("获取商品列表失败");
      }

      this.goodslist = res.data.data;
      console.log(this.goodslist);
      this.goodslist.forEach(element => {
        element.updatedAt = this.dayjs(element.updatedAt).format("YYYY-MM-DD");
        return element;
      });
      this.goodslist = this.goodslist.reverse();
      this.total = res.data.total;
    },
    async changeDisplay(id, isDisplay) {
      const res = await ChangeDisplay({ id, isDisplay });
      if (res.data.status !== 200) {
        return this.$message.error(res.data.message);
      }
      this.$message.success(res.data.message);
      this.getGoodsList();
    },
    async changeState(id, val) {
      if (val === 0) {
        const confirmResult = await this.$confirm(
          "确定商品不合格？, 是否继续?",
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
          return this.$message.info("已取消操作");
        }
        const res = await ChangeState(id, val);
        if (res.data.status !== 200) {
          return this.$message.error(res.data.message);
        }
        this.$message.success(res.data.message);
        this.getGoodsList();
      } else {
        const confirmResult = await this.$confirm(
          "确定商品合格？, 是否继续?",
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
          return this.$message.info("已取消操作");
        }
        const res = await ChangeState(id, val);
        if (res.data.status !== 200) {
          return this.$message.error(res.data.message);
        }
        this.$message.success(res.data.message);
        this.getGoodsList();
      }
    },
    //删除商品
    async removeById(id) {
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
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
      const res = await RemoveById(id);
      if (res.data.status !== 200) {
        return this.$message.error(res.data.message);
      }
      this.$message.success(res.data.message);
      this.getGoodsList();
    },
    async setRecommend(id, val) {
      let data = {
        good: id,
        type: val
      };
      const res = await Add(data);
      if (res.data.status !== 200) {
        return this.$message.error(res.data.message);
      }
      this.$message.success(res.data.message);
      this.getGoodsList();
    },
    // 监听 pagesize 改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getGoodsList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getGoodsList();
    }
  }
};
</script>

<style lang="scss" scoped></style>
