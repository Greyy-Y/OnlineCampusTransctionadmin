<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>推荐列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card style="margin-top:20px">
      <!-- 搜索与添加区域 -->
      <!-- table表格区域 -->
      <!-- 推荐 -->
      <el-table :data="recommendlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="推荐商品" prop="type" width="120">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.type === 0">精品推荐</el-tag>
            <el-tag type="success" v-else-if="scope.row.type === 1"
              >精选商品</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="商品名称"
          prop="good.name"
          width=""
        ></el-table-column>
        <el-table-column
          label="商品描述"
          prop="good.desc"
          width=""
        ></el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <!-- 移出推荐列表按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="移出该推荐列表"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="danger"
                desc
                icon="el-icon-star-off"
                circle
                size="mini"
                cricle
                @click="removeById(scope.row._id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
        <!-- 精选 -->
      </el-table>
      <el-table :data="featuredlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="精选商品" prop="type" width="120">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.type === 0">精品推荐</el-tag>
            <el-tag type="success" v-else-if="scope.row.type === 1"
              >精选商品</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="商品名称"
          prop="good.name"
          width=""
        ></el-table-column>
        <el-table-column
          label="商品描述"
          prop="good.desc"
          width=""
        ></el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <!-- 移出推荐列表按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="移出该精选列表"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-medal"
                circle
                size="mini"
                cricle
                @click="removeById(scope.row._id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <!-- <el-pagination
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				:current-page="queryInfo.pagenum"
				:page-sizes="[10, 15, 20, 25]"
				:page-size="queryInfo.pagesize"
				layout="total, sizes, prev, pager, next, jumper"
				:total="total"
				style="margin-top:20px;"
			>
			</el-pagination> -->
    </el-card>
  </div>
</template>

<script>
import { GetRecommend, GetFeatured, RemoveById } from "../../api/recommend";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      recommendlist: [],
      featuredlist: [],
      total: 0
    };
  },
  created() {
    this.getRecommendList();
    this.getFeaturedList();
  },
  methods: {
    // 获取推荐列表
    async getRecommendList() {
      const res = await GetRecommend();
      if (res.status !== 200) {
        return this.$message.error("获取推荐列表失败");
      }
      // console.log(res)
      this.recommendlist = res.data.data;
      console.log(this.recommendlist);
      this.total = res.data.total;
    },
    async getFeaturedList() {
      const res = await GetFeatured();
      if (res.status !== 200) {
        return this.$message.error("获取精选列表失败");
      }
      // console.log(res)
      this.featuredlist = res.data.data;
    },
    // 监听 pagesize 改变事件
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize;
      this.getRecommendList();
    },
    // 监听页码值改变的事件
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage;
      this.getRecommendList();
    },
    // 将该商品移除推荐列表
    async removeById(id) {
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将该商品移除推荐列表, 是否继续?",
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
        gid: id
      };
      const res = await RemoveById(data);
      if (res.data.status !== 200) {
        return this.$message.error(res.data.message);
      }
      this.$message.success(res.data.message);
      this.getRecommendList();
      this.getFeaturedList();
    }
  }
};
</script>

<style lang="scss" scoped></style>
