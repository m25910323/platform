<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>客服中心</el-breadcrumb-item>
			<el-breadcrumb-item>问票通知分配</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body clearfix">
			<div>
				<h3>问票通知分配</h3>
				<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;">
					<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="100px">

						<el-form-item label="客户名称" prop="customerName">
							<el-input v-model="uploadData.customerName" placeholder="请输入" clearable>
							</el-input>
						</el-form-item>
						
						<el-form-item label="账期" prop="accountPeriod">
							<el-date-picker v-model="uploadData.accountPeriod" align="right" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="问票通知客服" prop="userName">
							<el-select v-model="uploadData.userName" placeholder="请选择" clearable filterable>
								<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
								<el-option v-for="item in customerServicerList" :label="item.userName" :value='item.configId'></el-option>
							</el-select>
						</el-form-item>
						
						<el-form-item label="申报类型" prop="declareType">
							<el-select v-model="uploadData.declareType" placeholder="请选择" clearable filterable>
								<el-option label="全部" value=''></el-option>
								<el-option label="一般纳税人" value='32'></el-option>
								<el-option label="小规模" value='31'></el-option>
							</el-select>
							
						</el-form-item>
						<el-form-item label="合同类型" prop="ticketCollection">
							<el-select v-model="uploadData.ticketCollection" multiple collapse-tags placeholder="请选择" clearable filterable>
													
								<el-option label="纳税申报合同" value='29'></el-option>
								<el-option label="代理记账合同" value='26'></el-option>
								<el-option label="中端代理记账合同" value='27'></el-option>
								<el-option label="高端代理记账合同" value='28'></el-option>
								<el-option label="免费合同" value='30'></el-option>
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
					<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>
					
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
					
					<el-table-column align="center" label="上月执行人" prop="lastExecutorName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="问票通知客服" prop="nationUserName" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="临时客服" prop="ticketUserName" :resizable="false"></el-table-column> -->
					<!-- el-table-column align="center" label="来源类型" prop="isDeclare" :resizable="false"></el-table-column>
					<el-table-column align="center" label="一级类型" prop="isDeclare" :resizable="false"></el-table-column>
					<el-table-column align="center" label="二级类型" prop="isDeclare" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="状态" prop="status" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.status == 1">已分配</span>
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
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,1)">分配</el-button>
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,2)">临时分配</el-button>
							<el-button size="mini" type="text" @click="handleReturn(scope.$index, scope.row,1)">还原分配</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>

		</div>

		<el-dialog title="分配" :visible.sync="dialogVisible" width="400px">
			<el-form ref="form" :model="form2" label-width="100px" size="mini">

				<el-form-item label="客服姓名">
					<el-select v-model="form2.configId" placeholder="请选择" clearable filterable>
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option v-for="item in customerServicerList" :label="item.userName" :value='item.configId'></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog">取 消</el-button>
				<el-button type="primary" @click="commit">确 定</el-button>
			</span>


		</el-dialog>



	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				tag:0,
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
				this.ticketCollection = this.uploadData.ticketCollection;
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
						contractTypeList : this.ticketCollection,
						noticeType:3
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

			handleEdit(index, row,tag) {
				this.dialogVisible = true;
				//tag :1 分配 2 临时分配
				this.tag = tag;
				this.form2 = JSON.parse(JSON.stringify(row))
			},

			


			commit() {
				let param = [{
					ticketUserId: this.form2.configId,
					manageId: this.form2.manageId
				}];
				
				
				if(this.tag == 1){
					var url = '/perTaxToolTwo/callcenter/customerServiceManage/update';
					
				}else{
					var url = '/perTaxToolTwo/callCenter/customerServiceManage/temporary';
				}
				
				this.axios.post(url, param).then(res => {
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
			
			
			handleReturn(index,row){
				this.$confirm('确定还原分配？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					
					let param = [
						{
							manageId:row.manageId,
							noticeType:3
						}
					];
					this.axios.post('/perTaxToolTwo/callCenter/customerServiceManage/back', param).then(res => {
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
						this.$message({
							message: '还原失败',
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







		},
		created() {
			this.queryListByPage();
			this.getCustomerServicer()
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
