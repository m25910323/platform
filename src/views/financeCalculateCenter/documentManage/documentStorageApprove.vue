<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案管理中心</el-breadcrumb-item>
			<el-breadcrumb-item>资料管理</el-breadcrumb-item>
			<el-breadcrumb-item>资料入库审核</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body clearfix">
			<div>
				<h3>资料入库审核</h3>
				<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;">
					<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="120px">

						<el-form-item label="客户名称：" prop="customerId">
							<el-select v-model="uploadData.customerId" placeholder="请选择" clearable filterable>
						
								<el-option v-for="item in customerList" :label="item.customerName" :value='item.customerId'></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="资料名称：" prop="materialName">
							<el-input v-model="uploadData.materialName" placeholder="请输入" clearable>
							</el-input>
						</el-form-item>
						<el-form-item label="条形码：" prop="barCode">
							<el-input v-model="uploadData.barCode" placeholder="请输入" clearable>
							</el-input>
						</el-form-item>

						<el-form-item label="" prop="dossierName">
							<el-button type="primary" size="mini" @click='search()'>搜索</el-button>
							<!-- <el-button size="mini" type='primary' @click='handleMul' style="">批量审核</el-button> -->
							<el-dropdown  @command="handleCommand" style="display:inline-block;margin-left: 12px;" size='small'>
								<el-button type="primary" :disabled='multipleSelection.length == 0'>
									批量审核<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command='1'>通过</el-dropdown-item>
									<el-dropdown-item command='2'>不通过</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</el-form-item>

					</el-form>
				</div>
				<el-table :data="tableList" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange">
					<el-table-column align="center" type="selection" width="50"></el-table-column>

					<!-- <el-table-column align="center" label="客户编号" prop="userCode" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>

					<!-- <el-table-column align="center" label="编号" prop="position" :resizable="false"></el-table-column> -->

					<el-table-column align="center" label="资料名称" prop="materialName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="条码值" prop="barCode" :resizable="false"></el-table-column>

					<el-table-column align="center" label="库位名称" prop="librarySheet2" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="当前状态" prop="position" :resizable="false"></el-table-column> -->

					<el-table-column align="center" label="账期" prop="period" :resizable="false"></el-table-column>

					<el-table-column align="center" label="凭证号" prop="voucherNo" :resizable="false"></el-table-column>
					<el-table-column align="center" label="金税盘盘号" prop="goldTaxName" :resizable="false">
						<template slot-scope="scope">
							<span>--</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="资料描述" prop="remark1" :resizable="false"></el-table-column>
					<el-table-column align="center" label="录入申请人" prop="creatorName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="申请时间" prop="createTime" :resizable="false"></el-table-column>

					<el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,1)">通过</el-button>
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,2)">不通过</el-button>
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
				customerList:[],
				uploadData: {},
				empInfo: [],
				form2: {},
				form1: {},
				orgId: null,
				multipleSelection: [],
				departList: [],
				loading: false,
				loading1: false,
				formInline: {
					orgName: '',
				},
				userName: '',
				orgName: '',
				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],

				dialogVisible: false,
				dialogVisible1: false,

				
				materialName: '',
				barCode: '',
				customer: {}
			}
		},
		components: {},
		methods: {
			
			search() {
				this.materialName = this.uploadData.materialName;
				this.barCode = this.uploadData.barCode;
				this.customerId = this.uploadData.customerId;
				this.queryListByPage()
			},


			queryListByPage() {
				this.loading = true;


				let param = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						"materialState": "0",
						"moduleIdentification": "MaterialEnter",
						"barCode":this.barCode,
						"materialName":this.materialName,
						"customerId":this.customerId
					}
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/columbusNew/Material/getApplyAndApproveTask', param).then(res => {
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

			handleEdit(index, row, tag) {
				this.$confirm(tag == 1 ? '确定审核通过？' : '确定审核不通过？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					row.approveResult = tag;
					row.moduleIdentification = "MaterialEnter";
					let param = [row];
					// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
					this.axios.post('/perTaxToolTwo/columbusNew/Material/approvalMateriaInfo', param).then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.queryListByPage();
							this.$message({
								message: res.data.msg,
								type: 'success'
							});

						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
						this.loading = false;
						this.$message({
							message: '审核失败',
							type: 'error'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},
			
			handleCommand(command){
				this.$confirm(command == 1 ? '确定审核通过？' : '确定审核不通过？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.multipleSelection.forEach(item =>{
						item.approveResult = command;
						item.moduleIdentification = "MaterialEnter";
					})
					
					let param = this.multipleSelection;
					// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
					this.axios.post('/perTaxToolTwo/columbusNew/Material/approvalMateriaInfo', param).then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.queryListByPage();
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
				
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}
				
					}).catch(function(err) {
						this.loading = false;
						this.$message({
							message: '审核失败',
							type: 'error'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},
			
			
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage();
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			getCustomerList() {
				this.axios.get('/perTaxToolTwo/columbusNew/tCustomerInfo/getTCustomerInfoDropList.do').then(res => {
						if (res.data.code == 200) {
							this.customerList = res.data.data;
			
						} else {
							let type;
							if (res.data.code == 0) {
								type = "warning";
							} else if (res.data.code == 500) {
								type = "error";
							}
							this.$message({
								message: res.data.msg,
								type: type
							});
						}
					})
					.catch(err => {
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},


		},
		created() {
			this.queryListByPage();
			this.getCustomerList();
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

		.htitle {
			margin: 12px 0px 12px 20px;
			padding-left: 8px;
			border-left: 2px solid #409EFF;
			font-size: 14px;
		}

		h3 {
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

	/deep/ .search_contain {


		/deep/ .el-form-item {
			width: 25%;
			margin-right: 0px;
		}

		/deep/ .el-form-item__content {
			width: 180px;
		}
	}

	.el-form {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap
	}

	/* /deep/ .el-form-item {
		width: 20%;
	} */

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
