<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>客服中心</el-breadcrumb-item>
			<el-breadcrumb-item>客服分配</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body clearfix">
			<div>
				<h3>客服分配</h3>
				<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;">
					<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="100px">

						<el-form-item label="客户名称" prop="customerName">
							<el-input v-model="uploadData.customerName" placeholder="请输入" clearable>
							</el-input>
						</el-form-item>

						<el-form-item label="账期" prop="accountPeriod">
							<el-date-picker v-model="uploadData.accountPeriod" align="right" type="month" placeholder="请选择" format="yyyy-MM"
							 value-format="yyyy-MM">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="客服姓名" prop="configId">
							<el-select v-model="uploadData.configId" placeholder="请选择" clearable filterable>
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
						<el-form-item label="是否分配" prop="status">
							<el-radio-group v-model="uploadData.status">
								<el-radio label="1">是</el-radio>
								<el-radio label="0">否</el-radio>
							</el-radio-group>
						</el-form-item>
						<!-- <el-form-item label=" " prop="dossierName"> -->
						<div style="height: 30px;">
							<el-button size="mini" type='primary' @click='search'>搜索</el-button>
							<el-button size="mini" type='primary' @click='exportExcel'>导出</el-button>
							<el-button size="mini" type='primary' @click='importExcel'>导入</el-button>
							
						</div>
							
							<!-- <el-button size="mini" type='primary' @click='handleMul' :disabled="multipleSelection.length == 0">批量归还</el-button> -->
						<!-- </el-form-item> -->
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
					<el-table-column align="center" label="合同类型" prop="ticketCollection" :resizable="false"></el-table-column>
					<el-table-column align="center" label="客服姓名" prop="userName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="上月执行人" prop="lastExecutorName" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="是否代理认证" prop="isAgent" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.isAgent == 1">是</span>
							<span v-else>否</span>
						</template>
					</el-table-column> -->

					<!-- <el-table-column align="center" label="是否零申报" prop="isDeclare" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.isDeclare == 1">是</span>
							<span v-else>否</span>
						</template>
					</el-table-column> -->
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
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,1)">分配/变更</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>

		</div>

		<el-dialog title="分配" :visible.sync="dialogVisible" width="600px">
			<el-form ref="form" :model="form2" label-width="100px" size="mini">

				<el-form-item label="客服姓名">
					<el-select v-model="form2.configId" placeholder="请选择" clearable filterable>
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option v-for="item in customerServicerList" :label="item.userName" :value='item.configId'></el-option>
					</el-select>
				</el-form-item>
				
			</el-form>
			<el-table :data="relateCompany" style="width: 100%">
				<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->
			
				<!-- <el-table-column align="center" label="客户编号" prop="userCode" :resizable="false"></el-table-column> -->
				<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="分配客服" prop="userName" :resizable="false"></el-table-column>
				
			
				<el-table-column align="center" label="收账通知客服" prop="acceptanceUserName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="税款通知客服" prop="incomeTaxUserName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="问票通知客服" prop="ticketUserName" :resizable="false"></el-table-column>
				
			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog">取 消</el-button>
				<el-button type="primary" @click="commit">确 定</el-button>
			</span>


		</el-dialog>
		
		
		<el-dialog title="上传" :visible.sync="dialogVisible1" width="400px" class='dialog'>
		
			<el-form :inline="true" ref="ruleForm1" :model="detail" class="demo-form-inline" label-width="100px" size="mini">
				<el-form-item label="文件" prop="fileList" class='uploadItem'>
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove" :on-change="onChange" :on-success="handleSuccess"
					 action='#' :on-error="handleError" :auto-upload="false" :before-remove="beforeRemove" :limit="1"
					 :on-exceed="handleExceed" :file-list="fileList" :data='detail'>
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>
				</el-form-item>
				
		
			</el-form>
		
			<div class='btn_contain clearfix'>
				<el-button type="primary" :loading="loading1" @click="commitUpload">确定</el-button>
				<!-- <span class='commit' @click="commitUpload">确定</span> -->
			</div>
		</el-dialog>


	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				relateCompany:[],
				fileList:[],
				detail:{
					type:1
				},
				uploadData: {
					accountPeriod:this.formatTimeToStr(new Date(),"yyyy-MM")
				},
				accountPeriod:this.formatTimeToStr(new Date(),"yyyy-MM"),
				customerServicerList: [],
				taxmethodList: [],
				methodList: [],

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

			}
		},
		components: {},
		methods: {
			handleRemove(file, fileList) {
				console.log(file, fileList);
				this.fileList = fileList;
			},
			onChange(file, fileList) { //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
				let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
				if (existFile) {
					this.$message.error('当前文件已经存在!');
					fileList.pop()
				}
				this.fileList = fileList
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			handleSuccess(response) {
				if (response.code == 200) {
					this.fileList = [];
					this.$message({
						message: response.msg,
						type: "success"
					});
					this.dialogVisible1 = false;
				} else {
					this.fileList = [];
					this.$message({
						message: response.msg || "上传文件失败！",
						type: "error"
					});
				}
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			handleError(err) {
				this.fileList = [];
				this.$message({
					message: "上传文件失败！",
					type: "error"
				});
			},
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
			
			commitUpload() {
				if (this.fileList.length == 0) {
					this.$message({
						message: '请选择文件',
						type: 'error'
					});
				} else {
					
							this.loading1 = true;
							var _this = this;
							var formData = new FormData(); //  用FormData存放上传文件
							
							this.fileList.forEach(file => {
								formData.append('file', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 
	
							})
								
							for (var x in _this.detail) {
								formData.append(x, _this.detail[x]);
							}
							this.axios
								.post("/perTaxToolTwo/callcenter/customerServiceManage/importCustomerService", formData, {
									headers: {
										'Content-Type': 'application/x-www-form-urlencoded'
									}
								}).then(res => { //手动上传貌似无法触发成功或失败的钩子函数，因此这里手动调用 
									if (res.data.code == 200) {
										this.fileList = [];
										this.dialogVisible1 = false;
										this.loading1 = false;
										this.$message({
											message: res.data.msg,
											type: 'success'
										});
									} else {
										this.loading1 = false;
										this.fileList = [];
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
								}).catch(err => {
									this.loading1 = false;
									this.fileList = [];
									this.$message({
										message: "系统繁忙，请稍后重试",
										type: "error"
									});
								})
				}
			
			
			},

			exportExcel(){
				window.location.href = '/perTaxToolTwo/callcenter/customerServiceManage/downloadCustomerService';
			},
			importExcel(){
				this.dialogVisible1 = true;
			},


			search() {
				this.customerName = this.uploadData.customerName;
				
				this.accountPeriod = this.uploadData.accountPeriod;
				this.configId = this.uploadData.configId;
				this.lastExecutorId = this.uploadData.lastExecutorId;
				this.declareType = this.uploadData.declareType;
				this.collectType = this.uploadData.collectType;
				this.ticketCollection = this.uploadData.ticketCollection;
				this.status = this.uploadData.status;
				this.queryListByPage()
			},


			queryListByPage() {
				this.loading = true;


				let param = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						customerName: this.customerName,
						accountPeriod: this.accountPeriod,
						configId: this.configId,
						lastExecutorId: this.lastExecutorId,
						declareType : this.declareType,
						collectType : this.collectType,
						status: this.status,
						contractTypeList: this.ticketCollection,
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
				this.dialogVisible = true;
				this.form2 = JSON.parse(JSON.stringify(row));
				this.getRelationCustomer(row)
			},

			getRelationCustomer(row){
				let param = {
					manageId: row.manageId
				};
				this.axios.post('/perTaxToolTwo/callcenter/accountNotice/getRelationCustomer', param).then(res => {
					if (res.data.code == 200) {
						this.relateCompany = res.data.data;
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
						message: '获取关联公司失败',
						type: 'error'
					});
				})
			},


			commit() {
				let param = [{
					configId: this.form2.configId,
					manageId: this.form2.manageId
				}];
				this.axios.post('/perTaxToolTwo/callcenter/customerServiceManage/update', param).then(res => {
					
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
					
					if (res.data.code == 200) {
						this.customerServicerList = res.data.data;


					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取失败',
						type: 'error'
					});
				})
			},


			getTaxmethodList() {
				let param = {
					pid: 209
				};
				this.axios.post('/perTaxToolTwo/api/dic/getDicByPid', param).then(res => {
					if (res.data.code == 200) {
						this.taxmethodList = res.data.data;

					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取票据移交方式失败',
						type: 'error'
					});
				})
			},

			getMethodList() {
				let param = {
					pid: 3
				};
				this.axios.post('/perTaxToolTwo/api/dic/getDicByPid', param).then(res => {
					if (res.data.code == 200) {
						this.methodList = res.data.data;

					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取票据移交方式失败',
						type: 'error'
					});
				})
			},


		},
		created() {
			this.queryListByPage();
			this.getCustomerServicer();
			// this.getTaxmethodList();
			// this.getMethodList();
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
