<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>客服中心</el-breadcrumb-item>
			<el-breadcrumb-item>收账通知分配</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body clearfix">
			<div>
				<h3>收账通知分配</h3>
				<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;">
					<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="160px">

						<el-form-item label="客户名称" prop="customerName">
							<el-input v-model="uploadData.customerName" placeholder="请输入" clearable>
							</el-input>
						</el-form-item>
						
						<el-form-item label="账期" prop="accountPeriod">
							<el-date-picker v-model="uploadData.accountPeriod" align="right" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="收账通知客服" prop="acceptanceUserId">
							<el-select v-model="uploadData.acceptanceUserId" placeholder="请选择" clearable filterable>
								<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
								<el-option v-for="item in customerServicerList" :label="item.userName" :value='item.configId'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="上月执行人" prop="lastExecutorId">
							<el-select v-model="uploadData.lastExecutorId" placeholder="请选择" clearable filterable>
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
						<el-form-item label="收账方式" prop="collectType">
							<el-select v-model="uploadData.collectType" placeholder="请选择" clearable filterable>
								<el-option label="全部" value=''></el-option>
								<el-option label="取票" value='210'></el-option>
								<el-option label="送票" value='211'></el-option>
								<el-option label="邮寄" value='212'></el-option>
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
						<el-form-item label="是否代理认证" prop="isAgent">
							<el-select v-model="uploadData.isAgent" placeholder="请选择" clearable filterable>
								
								<el-option v-for="item in trueOrFalse" :label="item.label" :value='item.value'></el-option>
							</el-select>
						</el-form-item>
						
						
						<el-form-item label="是否三个月无账零申报" prop="isThreemonthdeclare">
							<el-select v-model="uploadData.isThreemonthdeclare" placeholder="请选择" clearable filterable>
								
								<el-option v-for="item in trueOrFalse" :label="item.label" :value='item.value'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否按季申报" prop="isQuarterlyReport">
							<el-select v-model="uploadData.isQuarterlyReport" placeholder="请选择" clearable filterable>
								
								<el-option v-for="item in trueOrFalse" :label="item.label" :value='item.value'></el-option>
							</el-select>
						</el-form-item>
						
						
						<el-form-item label="收账通知结果" prop="accountNotice">
							<el-select v-model="uploadData.accountNotice" placeholder="请选择" clearable filterable>
								
								<el-option v-for="item in accountNoticeList" :label="item.label" :value='item.value'></el-option>
							</el-select>
						</el-form-item>
						
						
						
						<el-form-item label="收账预约时间" prop="collectionAppointmentTime">
							<el-date-picker v-model="uploadData.collectionAppointmentTime" align="right" type="date" placeholder="请选择" format="yyyy-MM-dd"
							 value-format="yyyy-MM-dd">
							</el-date-picker>
							
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
					<el-table-column align="center" label="收账方式" prop="collectType" :resizable="false"></el-table-column>
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
					
					<!-- <el-table-column align="center" label="欠费客服" prop="period" :resizable="false"></el-table-column> -->

					<el-table-column align="center" label="收账通知客服" prop="nationUserName" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="临时客服" prop="acceptanceUserName" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="上月执行人" prop="lastExecutorName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="是否代理认证" prop="isAgent" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.isAgent == 1">是</span>
							<span v-else>否</span>
						</template>
					</el-table-column>

					<!-- <el-table-column align="center" label="是否零申报" prop="isDeclare" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.isDeclare == 1">是</span>
							<span v-else>否</span>
						</template>
					</el-table-column> -->
					<el-table-column align="center" label="收账通知结果" prop="resultCode" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.resultCode == 1">预约顺丰交票</span>
							<span v-if="scope.row.resultCode == 2">拍照上传</span>
							<span v-if="scope.row.resultCode == 3">送至大厅</span>
							<span v-if="scope.row.resultCode == 4">自行邮寄</span>
							<span v-if="scope.row.resultCode == 5">无账零申报</span>
							<span v-if="scope.row.resultCode == 6">再联系</span>
							<span v-if="scope.row.resultCode == 7">联系不上</span>
							<span v-if="scope.row.resultCode == 8">交接意向</span>
							<span v-if="scope.row.resultCode == 9">注销结束</span>
							<span v-if="scope.row.resultCode == 10">仅有内部代交票</span>
							<span v-if="scope.row.resultCode == 11">工资表代收账</span>
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
				trueOrFalse:[
					{label:'全部',value:''},
					{label:'是',value:1},
					{label:'否',value:0}
				],
				accountNoticeList:[
					{label:'全部',value:''},
					{label:'空白',value:0},
					{label:'预约顺丰交票',value:1},
					{label:'拍照上传',value:2},
					{label:'送至大厅',value:3},
					{label:'自行邮寄',value:4},
					{label:'无账零申报',value:5},
					{label:'再联系',value:6},
					{label:'联系不上',value:7},
					{label:'交接意向',value:8},
					{label:'注销结束',value:9},
					{label:'仅有内部代交票',value:10},
					{label:'工资表代收账',value:11},
				],
				
				status:'',
				declareType : '',
				collectType : '',
				isAgent : '',
				isDeclare : '',
				isThreemonthdeclare :'',
				isQuarterlyReport :'',
				ticketCollection :'',
				accountNotice : '',
				collectionAppointmentTime : '',

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
				this.accountPeriod = this.uploadData.accountPeriod;
				this.acceptanceUserId = this.uploadData.acceptanceUserId;
				this.lastExecutorId = this.uploadData.lastExecutorId;
				this.declareType = this.uploadData.declareType;
				this.collectType = this.uploadData.collectType;
				this.isAgent = this.uploadData.isAgent;
				
				// this.isDeclare = this.uploadData.isDeclare;
				this.isThreemonthdeclare = this.uploadData.isThreemonthdeclare;
				this.isQuarterlyReport = this.uploadData.isQuarterlyReport;
				this.ticketCollection = this.uploadData.ticketCollection;
				
				this.accountNotice = this.uploadData.accountNotice;
				
				this.collectionAppointmentTime = this.uploadData.collectionAppointmentTime;
				
				this.queryListByPage()
			},


			queryListByPage() {
				this.loading = true;


				let param = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						customerName:this.customerName,
						accountPeriod: this.accountPeriod,
						acceptanceUserId: this.acceptanceUserId,
						lastExecutorId: this.lastExecutorId,
						
						declareType : this.declareType,
						collectType : this.collectType,
						isAgent : this.isAgent,
						
						// isDeclare : this.isDeclare,
						isThreemonthdeclare : this.isThreemonthdeclare,
						isQuarterlyReport : this.isQuarterlyReport,
						contractTypeList : this.ticketCollection,
						
						accountNotice : this.accountNotice,
						
						collectionAppointmentTime : this.collectionAppointmentTime,
						noticeType:1
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
					acceptanceUserId: this.form2.configId,
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
							noticeType:1
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
