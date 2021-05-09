<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card style="margin-top:20px">
      <!-- 订单列表数据 -->
      <el-table :data="orderlist" height="590" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="_id"></el-table-column>
        <el-table-column
          label="订单价格(￥)"
          prop="totalPrice"
          width="120px"
        ></el-table-column>
        <el-table-column label="是否付款" prop="payStatus" width="180px">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.payStatus === 1"
              >已付款</el-tag
            >
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单状态" prop="state" width="180px">
          <template slot-scope="scope">
            <el-tag
              type="danger"
              v-if="scope.row.state === 0 || scope.row.state === 1"
              >未发货</el-tag
            >
            <el-tag v-else-if="scope.row.state === 2">已发货</el-tag>
            <el-tag v-else-if="scope.row.state === 3">已确认收货</el-tag>
            <el-tag v-else type="success">已完成</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="下单时间" prop="orderTime">
          <template slot-scope="scope">
            {{ scope.row.orderTime }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <el-tooltip
              content="修改订单状态"
              effect="dark"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                circle
                size="mini"
                @click="showEditDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              content="修改地址"
              effect="dark"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-location"
                circle
                size="mini"
                @click="showAddressDialog(scope.row._id)"
              ></el-button>
            </el-tooltip>

            <el-tooltip
              class="item"
              effect="dark"
              content="结束订单"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="success"
                icon="el-icon-check"
                circle
                size="mini"
                :disabled="scope.row.state !== 4"
                @click="removeOrderById(scope.row._id)"
              ></el-button>
            </el-tooltip>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              circle
              @click="removeOrderById(scope.row._id)"
            ></el-button>
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
			>
			</el-pagination> -->
    </el-card>

    <!-- 修改订单信息的对话框 -->
    <el-dialog
      title="修改订单信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        :rules="editFormRules"
        label-width="80px"
      >
        <el-form-item label="支付状态">
          <el-radio-group v-model="editForm.payStatus" prop="payStatus">
            <el-radio :label="0" border>未付款</el-radio>
            <el-radio :label="1" border>已付款</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="订单状态">
          <el-radio-group v-model="editForm.state" prop="state">
            <el-radio :label="1" border>未发货</el-radio>
            <el-radio :label="2" border>已发货</el-radio>
            <el-radio :label="4" border>已完成</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editOrderInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改订单地址的对话框 -->
    <el-dialog
      title="修改订单地址"
      :visible.sync="addressDialogVisible"
      width="500px"
    >
      <el-form
        ref="addressFormRef"
        :model="addressForm"
        :rules="addressFormRules"
      >
        <el-form-item label="收货人" :label-width="formLabelWidth">
          <el-input
            v-model="addressForm.receiver"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="收货地址" :label-width="formLabelWidth">
          <el-input
            v-model="addressForm.detailAdd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="电话号码" :label-width="formLabelWidth">
          <el-input v-model="addressForm.phone" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addressDialogVisible = flase">取 消</el-button>
        <el-button type="primary" @click="editOrderAddress">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  GetOrders,
  EditOrder,
  EditOrderAddress,
  GetOrderById,
  RemoveById
} from "../../api/order";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      orderlist: [],
      total: 0,
      activeIndex: "0",
      formLabelWidth: "80px",
      // 控制修改对话框的显示与隐藏
      editDialogVisible: false,
      addressDialogVisible: false,
      // 查询到的d订单信息对象
      editForm: {},
      addressForm: {
        receiver: "",
        detailAdd: "",
        phone: "",
        oid: ""
      },
      // 修改表单的验证规则对象
      editFormRules: {
        payStatus: [
          { required: true, message: "请选择支付状态", trigger: "blur" }
        ],
        state: [{ required: true, message: "请选择订单状态", trigger: "blur" }]
      },
      addressFormRules: {
        address: [
          { required: true, message: "请输入订单地址", trigger: "blur" }
        ],
        phone: [
          {
            required: true,
            message: "请输入订单地址",
            trigger: "blur",
            type: Number
          }
        ]
      }
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
   
   
    // 获取订单列表
    async getOrderList() {
      const res = await GetOrders();
      if (res.status !== 200) {
        return this.$message.error("获取订单列表失败");
      }
      this.orderlist = res.data.data;
      this.orderlist.forEach(element => {
        element.orderTime = this.dayjs(element.orderTime).format(
          "YYYY-MM-DD HH:ss"
        );
        return element;
      });
      this.orderlist = this.orderlist.reverse();
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
    // 展示订单编辑的对话框
    async showEditDialog(oid) {
      const res = await GetOrderById(oid);
      if (res.data.status !== 200) {
        return this.$message.error("查询订单信息失败！");
      }
      this.editForm = res.data.order[0];
      this.editDialogVisible = true;
    },

    async showAddressDialog(oid) {
      console.log(oid);
      const res = await GetOrderById(oid);

      if (res.data.status !== 200) {
        return this.$message.error("查询订单信息失败！");
      }
      console.log(res);
      this.addressForm = res.data.order[0].address[0];
      this.addressForm.oid = res.data.order[0]._id;
      this.addressDialogVisible = true;
    },

    // 监听修改对话框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields();
    },
    // 修改订单信息并提交
    editOrderInfo() {
      this.$refs.editFormRef.validate(async valid => {
        if (!valid) return;

        // 发起修改订单信息的数据请求
        let data = {
          id: this.editForm._id,
          payStatus: this.editForm.payStatus,
          state: this.editForm.state
        };

        const res = await EditOrder(data);

        if (res.data.status !== 200) {
          return this.$message.error("更新订单信息失败！");
        }
        // console.log(res)
        this.editDialogVisible = false;
        this.getOrderList();
        this.$message.success(res.data.message);
      });
    },
    // 修改订单信息并提交
    editOrderAddress() {
      this.$refs.addressFormRef.validate(async valid => {
        if (!valid) return;
        console.log(this.addressForm);
        // let data = {
        // 	_id:
        // }
        // 发起修改订单信息的数据请求
        const res = await EditOrderAddress(this.addressForm);

        if (res.data.status !== 200) {
          return this.$message.error("更新订单地址失败！");
        }
        // console.log(res)
        this.addressDialogVisible = false;
        this.getOrderList();
        this.$message.success(res.data.message);
      });
    },
    // 根据id删除订单
    async removeOrderById(id) {
      // 弹框询问用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该订单, 是否继续?",
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

      const res = await RemoveById(id)
      console.log(res)
      if (res.data.status !== 200) {
        return this.$message.error(res.data.message);
      }
      this.$message.success(res.data.message);
      this.getOrderList();
    }
  }
};
</script>

<style lang="scss" scoped>
.el-tabs {
  margin-top: 20px;
}
</style>
