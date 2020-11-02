<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>年终汇算</el-breadcrumb-item>
			<el-breadcrumb-item>收入差异对比</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>

				<el-form inline :model="uploadData" class="demo-form-inline" size="small" ref='formName'>
					<el-form-item label="客户名称" prop="customerId">
						<el-select v-model="uploadData.customerId" placeholder="请选择" filterable clearable>
							<el-option v-for="item in $store.state.cust" :key="item.customerId" :label="item.customerName" :value="item.customerId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="账期" prop="accountPeriod">
						<el-date-picker v-model="uploadData.accountPeriod" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM">
						</el-date-picker>

					</el-form-item>


					<!-- <el-form-item label="差异类型" prop="workFlowExecuteStatus">
						<el-select v-model="uploadData.workFlowExecuteStatus" placeholder="请选择" filterable clearable>
							<el-option v-for="item in executeStatusList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>

					</el-form-item> -->
					<el-button type="primary" @click='search()' size="small">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<div style="text-align: center;" class="clearfix">

				<el-button class="el-icon-refresh" type='text' size="mini" @click='refresh()' style='float:right'>刷新</el-button>
			</div>



			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" border v-loading='loading'>

				<el-table-column align="center" label="客户名称" prop="customerName"></el-table-column>
				<el-table-column align="center" label="账期" prop="accountPeriod"></el-table-column>

				<el-table-column align="center" label="差异金额" prop="differencesTotal"></el-table-column>

				<el-table-column align="center" label="已处理金额" prop="difExpenseTotal_string"></el-table-column>

				<el-table-column align="center" label="记录时间" prop="createTime">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.createTime,'yyyy-MM-dd')}}</span>

					</template>
				</el-table-column>
				<el-table-column align="center" label="记录人" prop="createName"></el-table-column>


				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="handlePass(scope.$index, scope.row, 1)">处理详情</el-button>
					</template>
				</el-table-column>



			</el-table>
		</div>
		<el-dialog title="详情" :visible.sync="dialogVisible" width="840px">
			<el-button type="primary" size="mini" style="margin-bottom: 10px;" @click='showInner'>登记</el-button>
			<el-table :data="detailTable" style="width: 100%;margin-top: 10px;" border v-loading='loading'>
				<el-table-column align="center" type="index" width="50"></el-table-column>
				<el-table-column align="center" label="差异类型" prop="differencesType">
					<template slot-scope="scope">
						<span v-show="scope.row.differencesType == 0">永久</span>
						<span v-show="scope.row.differencesType == 1">本年</span>
						<span v-show="scope.row.differencesType == 2">当季</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="差异原因" prop="reason"></el-table-column>

				<el-table-column align="center" label="差异金额" prop="differencesExpenses"></el-table-column>

				<el-table-column align="center" label="备注" prop="remark"></el-table-column>

			</el-table>
			<el-dialog title="详情" :visible.sync="dialogVisible1" width="400px" append-to-body>
				<el-form ref="form" :model="detail" label-width="100px" size="mini" inline>

					<el-form-item label="差异类型">
						<!-- <el-input v-model="detail.differencesType"></el-input> -->
						<el-select v-model="detail.differencesType" placeholder="请选择" @change="getConfigReasonsForIncomeDifferences">
							<el-option v-for="item in differencesTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="差异原因">
						<!-- <el-input v-model="detail.differencesReason"></el-input> -->
						<el-select v-model="detail.differencesReason" placeholder="请选择">
							<el-option v-for="item in differencesReasonList" :key="item.id" :label="item.reason" :value="item.id"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="差异金额">
						<el-input v-model="detail.differencesExpenses"></el-input>
					</el-form-item>
					<el-form-item label="备注">
						<el-input type="textarea" v-model="detail.remark" rows="7"></el-input>

					</el-form-item>
				</el-form>

				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="commitAdd">确定</el-button>
				</div>


			</el-dialog>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false">确定</el-button>
			</div>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				differencesTypeList:[
					{label:'永久',value:0},
					{label:'本年',value:1},
					{label:'当季',value:2},
				],
				differencesReasonList:[],
				pageSize:10,
				currentPage:1,
				detailTable: [],
				detail: {},
				loading: false,
				accountPeriod: '',

				uploadData: {
					accountPeriod: '',
				},
				customerId: '',
				tableData: [],
				dialogVisible: false,
				dialogVisible1: false,

				workFlowExecuteStatus: 1,
				executeStatusList: [{
						label: '未开始',
						value: 0
					},
					{
						label: '执行中',
						value: 1
					},
					{
						label: '已完成',
						value: 2
					},
					{
						label: '删除',
						value: 3
					},
					{
						label: '申报依据',
						value: 4
					},
				]
			}
		},
		components: {},
		methods: {
			showInner(){
				this.dialogVisible1 = true;
			},
			
			resetForm() {
				this.uploadData = {};
			},
			refresh() {
				this.queryPage()
			},



			search() {
				this.customerId = this.uploadData.customerId;
				this.accountPeriod = this.uploadData.accountPeriod;
				this.queryPage()
			},



			queryPage() {
				this.loading = true;
				let params = {
					"row": this.pageSize,
					"page": this.currentPage,
					"data": {
						"customerId": this.customerId,
						"accountPeriod": this.accountPeriod,

					}

				};
				this.axios.post('/perTaxToolTwo/e9/e9zDifferencesRecord/getDifferencesRecordQueryList', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data;
							this.total = res.data.count;
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
						} else {
							this.loading = false;
							this.tableData = [];
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
						this.tableData = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},

			commitAdd() {
				let params = this.detail;
				this.axios.post('/perTaxToolTwo/e9/e9zHandleRecord/insertHandleRecord', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible1 = false;
							this.handlePass(1, this.detail);
							// this.$set(this.detail,'customerName',row.customerName);
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
			
			getConfigReasonsForIncomeDifferences(val){
				let params = {
					type:val
				};
				
				
				this.axios.post('/perTaxToolTwo/e9z/configReasonsForIncomeDifferences/get', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.differencesReasonList = res.data.data;
							
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

			handlePass(index, row) {
				this.$set(this.detail,'customerId',row.customerId);
				this.$set(this.detail,'accountPeriod',row.accountPeriod);
				let params = row;


				this.axios.post('/perTaxToolTwo/e9/e9zHandleRecord/getHandleRecordByCustomerId', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible = true;
							this.detailTable = res.data.data;
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
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
		computed: {},
		created() {
			this.queryPage();
		}
	}
</script>

<style lang='less' scoped>
	.main {
		/* background: #fff; */
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		.el-breadcrumb {
			height: 40px;
			line-height: 39px;
			padding-left: 20px;
			/* background-color: #fff; */
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box
		}

		/deep/ .el-table td,
		/deep/ .el-table th {
			padding: 6px 0;
		}

		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 30px;
			background-color: #f9f9f9;
		}

		/deep/ .el-table th {
			background-color: #f9f9f9;
		}

		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #f9f9f9;
		}

		/deep/ .el-table__body tr,
		.el-table__body td {
			padding: 0;
			height: 30px;
			background-color: #fff;
		}

		/deep/ .el-table__body tr.el-table__row--striped {
			background-color: #f9f9f9;
		}

		/deep/ .el-table thead {
			color: #8C8C8C;
		}

		/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
			background-color: #efe9e5;
		}

		/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
			border-bottom-color: #fff;
			background: #f9f9f9;
		}

		.search_contain {
			background: #fff;
			height: 40px;
			/* padding-left: 20px; */
			padding: 0.3rem 20px;
			margin: 0px 20px 10px;

			.info {
				height: 40px;
				line-height: 40px;
			}

			a {
				margin-left: 10px;
			}
		}

		.main_contain {
			background: #fff;
			margin: 12px 20px 20px;
			padding: 12px 20px 20px;
			/* height: calc(100% - 190px); */

			h5 {
				height: 40px;
				line-height: 40px;
			}

			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}
		}
	}

	/deep/ .el-select {
		width: 180px;
	}

	.active-select {
		border-color: #409EFF !important;
		background-color: #409EFF !important;
		color: #fff !important
	}

	.next {
		width: 207px;
		height: 56px;
		background: rgba(36, 214, 137, 1);
		border: 3px solid rgba(36, 214, 137, 1);
		font-size: 16px;
		font-family: Microsoft YaHei;
		text-align: center;
		line-height: 56px;
		font-weight: bold;
		color: #fff;
	}

	.last {
		width: 207px;
		height: 56px;
		background: red;
		border: 3px solid red;
		font-size: 16px;
		font-family: Microsoft YaHei;
		text-align: center;
		line-height: 56px;
		font-weight: bold;
		color: #fff;
	}
</style>
