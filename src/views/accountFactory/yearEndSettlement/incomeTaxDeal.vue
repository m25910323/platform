<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>年终汇算</el-breadcrumb-item>
			<el-breadcrumb-item>年度企业所得税问题处理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>

				<el-form inline="true" :model="uploadData" class="demo-form-inline" size="small" ref='formName'>
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
					<el-form-item label="做账会计" prop="doAccountant">
						<el-select v-model="uploadData.doAccountant" placeholder="请选择" filterable clearable>
							<el-option v-for="item in personList" :key="item.userCode" :label="item.userName" :value="item.userCode">
							</el-option>
						</el-select>

					</el-form-item>
					<el-form-item label="审核会计" prop="checkAccountant">
						<el-select v-model="uploadData.checkAccountant" placeholder="请选择" filterable clearable>
							<el-option v-for="item in personList" :key="item.userCode" :label="item.userName" :value="item.userCode">
							</el-option>
						</el-select>

					</el-form-item>
					<el-form-item label="执行状态" prop="workFlowExecuteStatus">
						<el-select v-model="uploadData.workFlowExecuteStatus" placeholder="请选择" filterable clearable>
							<el-option v-for="item in executeStatusList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>

					</el-form-item>
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

				<el-table-column align="center" label="企业所得税征收方式" prop="taxCollectWay"></el-table-column>

				<el-table-column align="center" label="做账会计" prop="doAccountant"></el-table-column>
				<el-table-column align="center" label="审核会计" prop="checkAccountant"></el-table-column>
				<el-table-column align="center" label="执行状态" prop="workFlowExecuteStatus">
					<template slot-scope="scope">
						<span v-show='scope.row.workFlowExecuteStatus == 0'>未开始</span>
						<span v-show='scope.row.workFlowExecuteStatus == 1'>执行中</span>
						<span v-show='scope.row.workFlowExecuteStatus == 2'>已完成</span>
						<span v-show='scope.row.workFlowExecuteStatus == 3'>删除</span>
						<span v-show='scope.row.workFlowExecuteStatus == 4'>申报依据</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="回退原因" prop="reasonForRollback"></el-table-column>

				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)" v-show="scope.row.workFlowExecuteStatus == 1">详情</el-button>
						<!-- <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">同意回退</el-button> -->
						<el-button size="mini" type="text" @click="handlePass(scope.$index, scope.row)" v-show="scope.row.workFlowExecuteStatus == 1">流转</el-button>
					</template>
				</el-table-column>

			</el-table>
		</div>

		<el-dialog title="详情" :visible.sync="dialogVisible" width="800px" :before-close="closeChangeMachie">
			<el-form ref="form" :model="detail" label-width="160px" size="mini" inline="true">

				<el-form-item label="客户名称">
					<el-input v-model="detail.customerName" disabled></el-input>
				</el-form-item>
				<el-form-item label="账期">
					<el-input v-model="detail.accountPeriod" disabled></el-input>
				</el-form-item>
				<el-form-item label="征收方式">
					<el-input :value="detail.taxCollectWay" disabled></el-input>
				</el-form-item>
				<el-form-item label="核定征收率">
					<el-select v-model="detail.verifiedRate" placeholder="请选择" clearable filterable @change="setCanReturn">
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option v-for="item in verifiedRateList" :label="item.rate" :value='item.rate'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="汇算后企业所得税率">
					<el-select v-model="detail.liquidationIncomeTaxRate" placeholder="请选择" clearable filterable @change="setCanReturn">
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option v-for="item in rateList" :label="item.taxesRate" :value='item.taxesRate'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="本年收入">
					<el-input v-model="detail.income" disabled></el-input>
				</el-form-item>
				<el-form-item label="本年成本">
					<el-input v-model="detail.cost" disabled></el-input>
				</el-form-item>
				<el-form-item label="本年费用">
					<el-input v-model="detail.fee" disabled></el-input>
				</el-form-item>
				<el-form-item label="本年利润">
					<el-input v-model="detail.profit" disabled></el-input>
				</el-form-item>
				<el-form-item label="本季度利润">
					<el-input v-model="detail.qtrProfit" disabled></el-input>
				</el-form-item>
				<el-form-item label="预支成本">
					<el-input v-model="detail.advCostAmt" disabled></el-input>
				</el-form-item>
				<el-form-item label="预支费用">
					<el-input v-model="detail.advFeeAmt" disabled></el-input>
				</el-form-item>

				<el-form-item label="需调整数合计">
					<el-input v-model="detail.totalSubjectsNeedAdjust" disabled></el-input>
				</el-form-item>
				<el-form-item label="汇算后利润总额">
					<el-input v-model="detail.liquidationProfit" disabled></el-input>
				</el-form-item>

				<el-form-item label="可弥补以前年度亏损">
					<el-input v-model="detail.priorYearLoss" type="number" @change="setCanReturn"></el-input>
				</el-form-item>
				<el-form-item label="实际弥补以前年度亏损">
					<el-input v-model="detail.remedyPriorYearLoss" type="number" @change="setCanReturn"></el-input>
				</el-form-item>


				<el-form-item label="预缴企业所得税">
					<el-input v-model="detail.prepayIncomeTax" disabled></el-input>
				</el-form-item>
				<el-form-item label="本年度企业所得税税额合计">
					<el-input v-model="detail.totalIncomeTax" disabled></el-input>
				</el-form-item>
				<el-form-item label="本季度需缴纳税款">
					<el-input v-model="detail.periodPayIncomeTax" disabled></el-input>
				</el-form-item>
				<el-form-item label="汇算后需补缴纳企业所得税税款">
					<el-input v-model="detail.liquidationPayIncomeTax" disabled></el-input>
				</el-form-item>

			</el-form>


			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click='calcul'>试算</el-button>
				<el-button type="primary" @click='updateYearIncomeTax'>保存</el-button>
				<!-- <el-button type="primary" @click="submit">同意回退</el-button>
				<el-button @click="nosubmit">不同意回退</el-button> -->
			</span>

		</el-dialog>

		<el-dialog title="详情" :visible.sync="dialogVisible1" width="400px" :before-close="closeChangeMachie">
			<el-form ref="form" :model="detail1" label-width="80px" size="mini">

				<el-form-item label="是否回退">
					<el-select v-model="detail1.isPageSelect" placeholder="请选择" clearable filterable>
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option label="问题已解决" value='0'></el-option>
						<el-option label="账务问题回退" value='1'></el-option>
						<el-option label="不同意税款" value='2'></el-option>
					</el-select>
				</el-form-item>


				<el-form-item label="原因/备注">
					<el-input type="textarea" v-model="detail1.remark" rows="4"></el-input>
				</el-form-item>

			</el-form>


			<span slot="footer" class="dialog-footer">


				<el-button @click="nosubmit">取消</el-button>
				<el-button type="primary" @click="submit">确定</el-button>
			</span>

		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				canReturn: false,
				detail: {},
				detail1: {},
				loading: false,
				accountPeriod: '',

				uploadData: {
					accountPeriod: '',
					workFlowExecuteStatus: 1
				},
				customerId: '',
				tableData: [],
				personList: [],
				dialogVisible: false,
				dialogVisible1: false,
				rateList: [],
				verifiedRateList: [],
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
			resetForm() {
				this.uploadData = {};
			},
			refresh(){
				this.queryPage()
			},
			closeChangeMachie() {
				this.canReturn = false;
				this.dialogVisible = false;
			},
			setCanReturn() {
				this.canReturn = false;
			},

			search() {
				this.customerId = this.uploadData.customerId;
				this.accountPeriod = this.uploadData.accountPeriod;
				this.doAccountant = this.uploadData.doAccountant;
				this.checkAccountant = this.uploadData.checkAccountant;
				this.workFlowExecuteStatus = this.uploadData.workFlowExecuteStatus;
				this.queryPage()
			},

			queryPersonList() {
				let params = {
					"page": 1,
					"row": 999,
					"data": {
						type: 1
					}
				}
				this.axios.post('/perTaxToolTwo/hrEmpInfo/findHrEmpInfoPage', params).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hrEmpInfo/findHrEmpInfoPage', params).then(res => {
					
					if (res.data.code == 200) {
						this.personList = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					
					this.$message({
						message: '获取角色列表失败',
						type: 'error'
					});
				})
			},

			queryPage() {
				this.loading = true;
				let params = {
					"row": this.pageSize,
					"page": this.currentPage,
					"data": {
						"customerId": this.customerId,
						"accountPeriod": this.accountPeriod,
						"workFlowStepName": '年度企业所得税问题处理',
						"workFlowExecuteStatus": this.workFlowExecuteStatus,

					}

				};
				this.axios.post('/perTaxToolTwo/e9z/businessAdjustmentExpensesInfo/getByCondition', params)
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

			findYearCorpIncomeTaxById(row) {
				let params = {
					"id": row.yearCorpIncomeTaxRecordId

				};
				this.axios.post('/perTaxToolTwo/import/findYearCorpIncomeTaxById', params)
					.then(res => {
						if (res.data.code == 200) {
							this.detail = res.data.data;
							this.$set(this.detail, 'customerName', row.customerName);
							this.$set(this.detail, 'accountPeriod', row.accountPeriod);
							this.$set(this.detail, 'taxCollectWay', row.taxCollectWay);
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
			handleEdit(index, row) {
				this.dialogVisible = true;
				// this.is_zero_report = row.is_zero_report;
				this.findYearCorpIncomeTaxById(row);
				this.getList(row.customerId)
			},
			handlePass(index, row) {
				this.dialogVisible1 = true;
				// this.is_zero_report = row.is_zero_report;
				this.postData = JSON.parse(JSON.stringify(row));
			},
			
			submit() {
				let params = this.postData;
				params.remark = this.detail1.remark;
				params.isPageSelect = this.detail1.isPageSelect;
				params.stepName = "年度企业所得税问题处理";
				this.axios.post('/perTaxToolTwo/e9z/taxStep/submitYrRpt', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible1 = false;
							this.queryPage();
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
			calcul() {
				let params = {
					"yearTax": this.detail
					// type: 0,
					// taxationId: this.detail.taxationId,
					// taxInfoId: this.detail.taxInfoId,
					// stepName: '所得税问题处理',
					// nextStepName: '税款确认',
					// // backSign: 1,
					// customerId: this.detail.customerId,
					// customerName: this.detail.customerName,
					// accountPeriod: this.detail.accountPeriod,
					// id: this.detail.id,
					// priorYearLoss: this.detail.priorYearLoss,
					// remedyPriorYearLoss: this.detail.remedyPriorYearLoss,
					// incomeTaxRate: this.detail.incomeTaxRate,
					// verifiedRate: this.detail.verifiedRate,
					// taxCollectWay: this.detail.taxCollectWay == '查账' ? 1 : 2,

				};
				this.axios.post('/perTaxToolTwo/import/calcYearIncomeTax', params)
					.then(res => {
						if (res.data.code == 200) {
							this.detail = res.data.data.yearTax;
							this.canReturn = true;
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
			updateYearIncomeTax() {
				let params = {
					"yearTax": this.detail,
					"sign":1
				};
				this.axios.post('/perTaxToolTwo/import/updateYearIncomeTax', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible = false;
							this.queryPage();
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
			nosubmit() {

				this.dialogVisible1 = false;

			},

			queryRate() {
				let params = {
					"taxesName": "income_tax_rate"
				};
				this.axios.post('/perTaxToolTwo/e9z/configTaxes/selectTaxesWithRate', params)
					.then(res => {
						if (res.data.code == 200) {
							this.rateList = res.data.data;
							// this.total = 
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

			getList(customerId) {
				let params = {
					"page": 1,
					"row": 999,
					"data": {
						"customerId": customerId
					}
				};
				this.axios.post('/perTaxToolTwo/e9z/incomeTaxLevyRate/selectPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.verifiedRateList = res.data.data;
							// this.total = 
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
			this.queryPersonList();
			this.queryRate()
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
