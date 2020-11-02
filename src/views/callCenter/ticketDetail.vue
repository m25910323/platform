<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>客服中心</el-breadcrumb-item>
			<el-breadcrumb-item>问票通知</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body clearfix">
			<div>
				<h3>问票通知</h3>
				<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;">
					<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="100px">

						<el-form-item label="客户名称" prop="customerName">
							<el-input v-model="uploadData.customerName" placeholder="请输入" clearable>
							</el-input>
						</el-form-item>
						<!-- <el-form-item label="区域" prop="area">
							<el-input v-model="uploadData.area" placeholder="请输入" clearable>
							</el-input>
						</el-form-item> -->
						<el-form-item label="账期" prop="accountPeriod">
							<el-date-picker v-model="uploadData.accountPeriod" align="right" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="客服姓名" prop="ticketUserId"  v-if='isRole3'>
							<el-select v-model="uploadData.ticketUserId" placeholder="请选择" clearable filterable>
								<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
								<el-option v-for="item in customerServicerList" :label="item.userName" :value='item.configId'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="上月执行人" prop="lastExecutorName">
							<el-select v-model="uploadData.lastExecutorName" placeholder="请选择" clearable filterable>
								<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
								<el-option v-for="item in customerServicerList" :label="item.userName" :value='item.userId'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="申报类型" prop="declareType">
							<el-select v-model="uploadData.declareType" placeholder="请选择" clearable filterable>
								<el-option label="全部" value=''></el-option>
								<el-option label="一般纳税人" value='32'></el-option>
								<el-option label="小规模" value='31'></el-option>
							</el-select>
							
						</el-form-item>
						<!-- <el-form-item label="收账方式" prop="dossierName">
							<el-select v-model="uploadData.customer" placeholder="请选择" clearable filterable value-key='customerId'>
								
								<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>
							</el-select>
						</el-form-item> -->
						<el-form-item label="是否分配" prop="status">
							<el-radio-group v-model="uploadData.status">
								<el-radio label="1">是</el-radio>
								<el-radio label="0">否</el-radio>
							</el-radio-group>
						</el-form-item>
						<el-form-item label=" " prop="dossierName">
							<el-button size="mini" type='primary' @click='search'>搜索</el-button>
							<!-- <el-button size="mini" type='primary' @click='handleMul' :disabled="multipleSelection.length == 0">批量归还</el-button> -->
						</el-form-item>
					</el-form>
				</div>

				<el-table :data="tableList" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange">
					<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->

					<!-- <el-table-column align="center" label="客户编号" prop="userCode" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>

					<!-- <el-table-column align="center" label="区域" prop="area" :resizable="false"></el-table-column> -->

					<el-table-column align="center" label="服务状态" prop="serviceStatus" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="收账方式" prop="collectType" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="申报类型" prop="declareType" :resizable="false"></el-table-column>
					<el-table-column align="center" label="合同类型" prop="ticketCollection" :resizable="false"></el-table-column>
					<el-table-column align="center" label="合同开始日期" prop="contractStartTime" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.contractStartTime,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="合同结束日期" prop="contractEndTime" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.contractEndTime,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>
					<!-- <el-table-column align="center" label="欠费月份" prop="oweMonth" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="责任会计" prop="period" :resizable="false"></el-table-column> -->

					<!-- <el-table-column align="center" label="客服姓名" prop="userName" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="上月执行人" prop="lastExecutorName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="问票通知客服" prop="nationUserName" :resizable="false"></el-table-column>

					<!-- el-table-column align="center" label="来源类型" prop="isDeclare" :resizable="false"></el-table-column>
					<el-table-column align="center" label="一级类型" prop="isDeclare" :resizable="false"></el-table-column>
					<el-table-column align="center" label="二级类型" prop="isDeclare" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="问票通知状态" prop="ticketState" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.ticketState == 1">已分配</span>
							<span v-else>未分配</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>
					<el-table-column align="center" label="分配时间" prop="updateTime" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.updateTime,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>

					<el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit1(scope.$index, scope.row,1)">查看</el-button>
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,1)">问票通知</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>

		</div>

		<el-dialog title="通知" :visible.sync="dialogVisible" width="800px">
			<el-table :data="detail" style="width: 100%" @selection-change="handleSelectionChange">
				<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->
			
				<!-- <el-table-column align="center" label="客户编号" prop="userCode" :resizable="false"></el-table-column> -->
				<el-table-column align="center" label="问题" prop="question" :resizable="false"></el-table-column>
			
				<el-table-column align="center" label="答案" prop="answer" :resizable="false"></el-table-column>
			
				
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog">关 闭</el-button>
				<!-- <el-button type="primary" @click="commit">确 定</el-button> -->
			</span>


		</el-dialog>



	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				isRole3:false,
				detail:{},
				uploadData: {},
				customerServicerList: [],

				form2: {},
				form1: {},

				multipleSelection: [],

				loading: false,
				loading1: false,

				userName: '',

				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],

				dialogVisible: false,
				dialogVisible1: false,

			}
		},
		components: {},
		methods: {
			hideDialog() {
				this.dialogVisible = false;
				this.reset();
			},
			hideDialog1() {
				this.dialogVisible1 = false;
				this.reset();
			},
			reset() {
				this.form = {};
				this.form2 = {};
			},






			search() {
				this.customerName = this.uploadData.customerName;
				this.area = this.uploadData.area;
				this.accountPeriod = this.uploadData.accountPeriod;
				this.userName = this.uploadData.userName;
				this.lastExecutorName = this.uploadData.lastExecutorName;
				this.status = this.uploadData.status;
				this.queryListByPage()
			},


			queryListByPage() {
				this.loading = true;


				let param = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						area : this.area,
						accountPeriod : this.accountPeriod,
						userName : this.userName,
						lastExecutorName : this.lastExecutorName,
						status : this.status,
						noticeType:3,
						field3:1
					}
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/callcenter/customerServiceManage/queryListByPage', param).then(res => {
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
			handleEdit(index, row) {
				this.$prompt('请输入备注', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({
					value
				}) => {
					let param = {
						manageId: row.manageId,
						remark4:value,
					};
					this.axios.post('/perTaxToolTwo/callcenter/customerServiceManage/updateNoticeResult', param).then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.dialogVisible = false;
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
							message: '分配失败',
							type: 'error'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
			},
			handleEdit1(index, row) {
				this.dialogVisible = true;
				this.form2 = JSON.parse(JSON.stringify(row));
				this.getTicketAndInvoiceInfo(row);
			},
			getTicketAndInvoiceInfo(row){
				let param = {
					customerId:row.customerId,
					accountPeriod:row.accountPeriod,
				};
				this.axios.post('/perTaxToolTwo/iocr/ticket/getTicketAndInvoiceInfo', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.detail = res.data.data;
				
				
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				
				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取失败',
						type: 'error'
					});
				})
			},

			handleMul() {
				this.$confirm('确定资料已归还？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.multipleSelection.forEach(item => {
						item.moduleIdentification = 'MaterialReturn'
					})
					let param = this.multipleSelection;
					this.axios.post('/perTaxToolTwo/columbusNew/Material/ReturnMaterialInfo', param).then(res => {
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
							message: '归还失败',
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


			commit() {
				let param = [{
					ticketUserId: this.form2.configId,
					manageId: this.form2.manageId
				}];
				this.axios.post('/perTaxToolTwo/callcenter/customerServiceManage/update', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.dialogVisible = false;
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
						message: '分配失败',
						type: 'error'
					});
				})
			},


			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

			getCustomerServicer() {
				let param = {};
				this.axios.post('/perTaxToolTwo/callcenter/customerServiceConfig/queryList', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.customerServicerList = res.data.data;


					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '归还失败',
						type: 'error'
					});
				})
			},


			getCurrentPeriod() {
				
				let params = {
					
				};
				this.axios.post('/perTaxToolTwo/e9z/taxTreatment/getCurrentPeriod', params)
					.then(res => {
						
						if (res.data.code == 200) {
							this.uploadData.accountPeriod = res.data.data;
							this.accountPeriod = res.data.data;
							this.queryListByPage();
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
			// this.queryListByPage();
			this.getCurrentPeriod();
			var roleList = JSON.parse(sessionStorage.getItem('updateUser')).roleList;
			roleList.forEach(item => {
				if(item.roleSign == 'callCenter_admin'){
					this.isRole3 = true;
					this.getCustomerServicer();
				}
			});
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
			background: #fff;
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

	/deep/ .el-form-item {
		width: 20%;
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
