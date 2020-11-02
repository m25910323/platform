<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案管理中心</el-breadcrumb-item>
			<el-breadcrumb-item>资料管理</el-breadcrumb-item>
			<el-breadcrumb-item>非资料部资料持有查询</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body clearfix">
			<div>
				<h3>非资料部资料持有查询</h3>
				<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;"  class='clearfix'>
					<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="120px">
						<el-form-item label="持有人部门" prop="dossierName">
							<el-select v-model="uploadData.customer" placeholder="请选择公司名称" clearable filterable value-key='customerId'>
								<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
								<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="持有人姓名" prop="dossierName">
							<el-select v-model="uploadData.customer" placeholder="请选择公司名称" clearable filterable value-key='customerId'>
								<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
								<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="持有人工号" prop="dossierName">
							<el-select v-model="uploadData.customer" placeholder="请选择公司名称" clearable filterable value-key='customerId'>
								<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
								<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="资料状态" prop="dossierName">
							<el-select v-model="uploadData.customer" placeholder="请选择公司名称" clearable filterable value-key='customerId'>
								<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
								<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>
							</el-select>
						</el-form-item>
						
						
					</el-form>
					<el-button size="small" type='primary' @click='search' style="float: right;">查询</el-button>
					<el-button size="small" type='primary' @click='search' style="float: right;margin-right: 12px;">导出</el-button>
				</div>
				<el-table :data="tableList" style="width: 100%;margin-top: 12px;" v-loading='loading' @selection-change="handleSelectionChange">
					<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->
					<el-table-column type="expand">
						<template slot-scope="props">
							<p>
								<label>年</label><span>{{ props.row.remark }}</span>
							</p>
							<p>
								<label>月</label><span>{{ props.row.remark }}</span>
							</p>
							<p>
								<label>资料备注</label><span>{{ props.row.remark }}</span>
							</p>
							<p>
								<label>提供人</label><span>{{ props.row.remark }}</span>
							</p>
							<p>
								<label>接收人</label><span>{{ props.row.remark }}</span>
							</p>
							<p>
								<label>操作时间</label><span>{{ props.row.remark }}</span>
							</p>
							<p>
								<label>操作人</label><span>{{ props.row.remark }}</span>
							</p>
							<p>
								<label>操作人工号</label><span>{{ props.row.remark }}</span>
							</p>
							<p>
								<label>当前状态</label><span>{{ props.row.remark }}</span>
							</p>
						</template>
					</el-table-column>
					<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="客户状态" prop="customerStatu" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="条形码" prop="barCode" :resizable="false"></el-table-column>
					<el-table-column align="center" label="资料编号" prop="materialNo" :resizable="false"></el-table-column>
				
					<el-table-column align="center" label="资料名称" prop="materialName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="资料类型" prop="materialCategoryName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="存放类型" prop="materialCategoryName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="数量" prop="materialMount" :resizable="false"></el-table-column>
					<el-table-column align="center" label="库位号" prop="librarySheet1" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="剩余容量" prop="librarySheet2" :resizable="false"></el-table-column> -->
					<!-- <el-table-column align="center" label="提供人" prop="supplyUserName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="接收人" prop="accountNo" :resizable="false"></el-table-column> -->
					<!-- <el-table-column align="center" label="资料备注" prop="remark" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="资料状态" prop="materialState" :resizable="false">
						<template slot-scope="scope">
							<span v-if='scope.row.materialState == 0'>保存资料到明细库</span>
							<span v-if='scope.row.materialState == 1'>待审核</span>
							<span v-if='scope.row.materialState == 2'>审批同意</span>
							<span v-if='scope.row.materialState == 3'>审批拒绝 </span>
							<span v-if='scope.row.materialState == 4'>领用</span>
							<span v-if='scope.row.materialState == 5'>归还</span>
							<span v-if='scope.row.materialState == 6'>已出库</span>
							<span v-if='scope.row.materialState == 7'>转交</span>
							<span v-if='scope.row.materialState == 8'>已经删除</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="是否复印件" prop="isHaveCopies" :resizable="false">
						<template slot-scope="scope">
							<span v-if='scope.row.isHaveCopies'>√</span>
							<span v-else>×</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="是否需归还" prop="isReturn" :resizable="false">
						<template slot-scope="scope">
							<span v-if='scope.row.isReturn'>√</span>
							<span v-else>×</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="是否有效" prop="isState" :resizable="false">
						<template slot-scope="scope">
							<span v-if='scope.row.isState'>√</span>
							<span v-else>×</span>
						</template>
					</el-table-column>
				
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>

		</div>
		
	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				uploadData:{},
				loading: false,
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: []

			}
		},
		components: {},
		methods: {
			search() {
				this.searchuserName = this.userName;
			},
			
			
			queryListByPage() {
				this.loading = true;
			
			
				let param = {
					"row": 10,
					"page": 1,
					"data": {
						// "materialStatu": 1
					}
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/columbusNew/Material/getMaterialsPage', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.tableList = res.data.data;
						this.total = res.data.count;
			
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
			
				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			exportExcel() {
				if (this.starttime && this.endtime) {
					window.location.href = "/perTaxToolTwo/attendanceConfluenceController/downloadAllAttendanceException?starttime=" +
						this.starttime + "&endtime=" + this.endtime;
				} else {
					this.$message({
						message: '请选择日期',
						type: 'warning'
					});
				}

			},
			
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage();
			},
			
		},
		created() {
			this.queryListByPage();
		}

	}
</script>

<style scoped lang='less'>
	.main_contain {
		width: 100%;
		height: 100%;
		padding: 0px;
		box-sizing: border-box;

		/deep/ .el-breadcrumb {
			height: 40px;
			line-height: 40px;
			background: rgb(234, 244, 255);
			padding-left: 20px;
		}

		.btn_contain {
			text-align: center;
			margin-top: 0.36rem;
		}

		.commit {
			width: 2.4rem;
			height: 0.4rem;
			line-height: 0.4rem;
			background: #43b3db;
			color: #fff;
			display: inline-block;
			text-align: center;
			margin-right: 0.4rem;
			border-radius: 4px;
		}

		.close {
			width: 2.4rem;
			height: 0.4rem;
			line-height: 0.4rem;
			background: #ed878e;
			color: #fff;
			display: inline-block;
			text-align: center;
			border-radius: 4px;
		}


	}

	.contain_body {
		/* padding: 10px 20px; */
		margin: 20px 20px;
		height: 100%;
		background: #fff;
		h3{
			height: 40px;
			line-height: 40px;
			font-size: 16px;
			padding-left: 20px;
		}
	}



	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
	}

	/deep/ .el-table table {
		background: rgb(243, 246, 249);
		border-collapse: separate;
		border-spacing: 0px 5px;
	}

	/deep/ .el-table__header tr,
	.el-table__header th {
		padding: 0;
		height: 40px;
	}

	/deep/ .el-table__body tr,
	.el-table__body td {
		padding: 0;
		height: 40px;
	}

	/deep/ .el-table td {
		padding: 6px 0;
	}

	/deep/ .el-table th,
	/deep/ .el-table tr {
		background-color: transparent;
	}

	/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
		background: #ebf6fb;
	}

	.el-dialog .el-form {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap
	}
	
	/deep/ .el-form {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap
	}
	/deep/ .el-form-item {
		width: 25%;
		margin-right: 0px;
	}

	/deep/ .el-form-item__content {
		width: 180px;
	}

	/deep/ .el-date-editor.el-input {
		width: 180px;
	}

	/deep/ .el-table__body tr,
	.el-table__body td {
		padding: 0;
		height: 40px;
		background-color: #fff;
	}

	/deep/ .el-table__body tr.el-table__row--striped {
		background-color: #ebf6fb;
	}

	/deep/ .el-table thead {
		color: #666;
	}

	/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #fff;
	}

	/deep/ .custom-tree-node {
		width: 100%
	}
</style>
