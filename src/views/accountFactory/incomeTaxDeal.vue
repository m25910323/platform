<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<!-- <el-breadcrumb-item>统计表</el-breadcrumb-item> -->
			<el-breadcrumb-item>所得税问题处理池</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>

				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="客户名称" prop="value">
						<el-select v-model="uploadData.customerId" placeholder="请选择" filterable clearable>
							<el-option v-for="item in $store.state.cust" :key="item.customerId" :label="item.customerName" :value="item.customerId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="账期" prop="accountPeriod">
						<el-date-picker v-model="uploadData.accountPeriod" type="month" format="yyyy-MM" value-format="yyyy-MM">
						</el-date-picker>

					</el-form-item>
					<el-form-item label="做账会计" prop="user1">
						<el-select v-model="uploadData.user1" placeholder="请选择" filterable clearable>
							<el-option v-for="item in personList" :key="item.userCode" :label="item.userName" :value="item.userCode">
							</el-option>
						</el-select>

					</el-form-item>
					<el-form-item label="审核会计" prop="user2">
						<el-select v-model="uploadData.user2" placeholder="请选择" filterable clearable>
							<el-option v-for="item in personList" :key="item.userCode" :label="item.userName" :value="item.userCode">
							</el-option>
						</el-select>

					</el-form-item>
					<el-form-item label="状态" prop="executeStatus">
						<el-select v-model="uploadData.executeStatus" placeholder="请选择" filterable clearable>
							<el-option v-for="item in executeStatusList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>

					</el-form-item>
					<el-button type="primary" @click='search()' size="mini">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<!-- <h5>余额表</h5> -->
			<!-- <p>单位名称：{{fBrNo}}
				<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='voucherGather_print()' style='float:right;margin-left:10px'>打印</el-button>
				<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='exportExcel()' style='float:right'>导出</el-button>
				<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='exportExcel2()' style='float:right'>导出收付账款</el-button>
			</p> -->


			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading'>
				<el-table-column align="center" label="序号" prop="step_name">
					<template slot-scope="scope">
						<span>{{scope.$index + 1}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="客户名称" prop="tax_info_remark2"></el-table-column>
				<el-table-column align="center" label="账期" prop="account_period"></el-table-column>

				<el-table-column align="center" label="企业所得税征收方式" prop="tax_info_remark1"></el-table-column>

				<el-table-column align="center" label="做账会计" prop="user1"></el-table-column>
				<el-table-column align="center" label="审核会计" prop="user2"></el-table-column>
				<el-table-column align="center" label="状态" prop="execute_status">
					<template slot-scope="scope">
						<span v-show='scope.row.execute_status == 0'>未开始</span>
						<span v-show='scope.row.execute_status == 1'>执行中</span>
						<span v-show='scope.row.execute_status == 2'>已完成</span>
						<span v-show='scope.row.execute_status == 3'>删除</span>
						<span v-show='scope.row.execute_status == 4'>申报依据</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="备注(回退原因)" prop="remark"></el-table-column>

				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
						<!-- <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">同意回退</el-button>
						<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">不同意回退</el-button> -->
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
				<el-form-item label="企业所得税税率">
					<el-select v-model="detail.incomeTaxRate" placeholder="请选择" clearable filterable @change="setCanReturn">
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option v-for="item in rateList" :label="item.taxesRate" :value='item.taxesRate'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="收入">
					<el-input v-model="detail.income" disabled></el-input>
				</el-form-item>
				<el-form-item label="成本">
					<el-input v-model="detail.cost" disabled></el-input>
				</el-form-item>
				<el-form-item label="费用">
					<el-input v-model="detail.fee" disabled></el-input>
				</el-form-item>
				<el-form-item label="利润">
					<el-input v-model="detail.profit" disabled></el-input>
				</el-form-item>
				<el-form-item label="可弥补以前年度亏损">
					<el-input v-model="detail.priorYearLoss" type="number" @change="setCanReturn"></el-input>
				</el-form-item>
				<el-form-item label="实际弥补以前年度亏损">
					<el-input v-model="detail.remedyPriorYearLoss" type="number" @change="setCanReturn"></el-input>
				</el-form-item>

				<el-form-item label="应交企业所得税">
					<el-input v-model="detail.totalIncomeTaxation" disabled></el-input>
				</el-form-item>
				<el-form-item label="已交企业所得税">
					<el-input v-model="detail.paidIncomeTaxation"></el-input>
				</el-form-item>
				<el-form-item label="应补(退)企业所得税">
					<el-input v-model="detail.incomeTaxation" disabled></el-input>
				</el-form-item>

			</el-form>
			<div style="text-align: center;">
				<el-button type="primary" size="mini" @click='calcul'>试算</el-button>
			</div>

			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submit">同意回退</el-button>
				<el-button @click="nosubmit">不同意回退</el-button>
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
				loading: false,
				accountPeriod: '',

				uploadData: {
					accountPeriod: '',
					executeStatus: 1
				},
				customerId: '',
				tableData: [],
				personList: [],
				dialogVisible: false,
				rateList: [],
				verifiedRateList: [],
				executeStatus: 1,
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
				this.user1 = this.uploadData.user1;
				this.user2 = this.uploadData.user2;
				this.executeStatus = this.uploadData.executeStatus;
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
					this.loading = false;
					if (res.data.code == 200) {
						this.personList = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取角色列表失败',
						type: 'error'
					});
				})
			},

			queryPage() {
				this.loading = true;
				let params = {
					accountPeriod: this.accountPeriod,
					executeStatus: this.executeStatus,
					customerId: this.customerId,
					user1: this.user1,
					user2: this.user2

				};
				this.axios.post('perTaxToolTwo/e9z/corpIncomeTax/selectIncomeTaxProblem', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data;

							this.$message({
								message: res.data.msg,
								type: 'success'
							});
						} else {
							this.loading = false;
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
			selectCorpIncomeTax(id) {
				let params = {
					// id: id
					taxInfoId: id
				};
				this.axios.post('/perTaxToolTwo/e9z/corpIncomeTax/selectCorpIncomeTax', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.detail = res.data.data;

							this.$message({
								message: res.data.msg,
								type: 'success'
							});
						} else {
							this.loading = false;
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
				this.is_zero_report = row.is_zero_report;
				this.selectCorpIncomeTax(row.tax_info_id);
				this.getList(row.customer_id)
			},
			updateIncomeTaxProblem(tag) {
				this.$prompt('请输入备注', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({
					value
				}) => {
					let params = {
						type: 1,
						taxationId: this.detail.taxationId,
						taxInfoId: this.detail.taxInfoId,
						stepName: '所得税问题处理',
						nextStepName: tag == 0 ? '凭证审核' : '发票录入',
						backSign: 1,
						customerId: this.detail.customerId,
						accountPeriod: this.detail.accountPeriod,
						id: this.detail.id,
						remark:value
					};
					this.axios.post('/perTaxToolTwo/e9z/taxStep/updateIncomeTaxProblem', params)
						.then(res => {
							if (res.data.code == 200) {
								this.dialogVisible = false;
					
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
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
				
			},
			submit() {
				this.canReturn = false;
				if (this.is_zero_report == 0) {
					this.updateIncomeTaxProblem(0);
				} else if (this.is_zero_report == 1) {
					this.$confirm('该客户此账期为无账零申报，是否有发票上传?', '提示', {
						confirmButtonText: '是',
						cancelButtonText: '否',
						type: 'warning'
					}).then(() => {
						this.updateIncomeTaxProblem(1);
					}).catch(() => {
						this.updateIncomeTaxProblem(0);
					});
				}

			},
			calcul() {
				let params = {
					type: 0,
					taxationId: this.detail.taxationId,
					taxInfoId: this.detail.taxInfoId,
					stepName: '所得税问题处理',
					nextStepName: '税款确认',
					// backSign: 1,
					customerId: this.detail.customerId,
					customerName: this.detail.customerName,
					accountPeriod: this.detail.accountPeriod,
					id: this.detail.id,
					priorYearLoss: this.detail.priorYearLoss,
					remedyPriorYearLoss: this.detail.remedyPriorYearLoss,
					paidIncomeTaxation: this.detail.paidIncomeTaxation,
					incomeTaxRate: this.detail.incomeTaxRate,
					verifiedRate: this.detail.verifiedRate,
					taxCollectWay: this.detail.taxCollectWay == '查账' ? 1 : 2,

				};
				this.axios.post('/perTaxToolTwo/e9z/taxStep/calcIncomeTaxProblem', params)
					.then(res => {
						if (res.data.code == 200) {
							this.detail = res.data.data;
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
			nosubmit() {
				if (this.canReturn) {
					this.detail.stepName = '所得税问题处理';
					this.detail.nextStepName = '税款确认';
					// this.detail.backSign = 1;
					this.detail.type = 0;
					this.detail.taxCollectWay = this.detail.taxCollectWay == '查账' ? 1 : 2;
					let params = this.detail;
					// let params = {
					// 	type: 0,
					// 	taxationId: this.detail.taxationId,
					// 	taxInfoId: this.detail.taxInfoId,
					// 	stepName: '所得税问题处理',
					// 	nextStepName: '税款确认',
					// 	backSign: 1,
					// 	customerId: this.detail.customerId,
					// 	customerName: this.detail.customerName,
					// 	accountPeriod: this.detail.accountPeriod,
					// 	id: this.detail.id,
					// 	priorYearLoss: this.detail.priorYearLoss,
					// 	remedyPriorYearLoss: this.detail.remedyPriorYearLoss,
					// 	incomeTaxRate: this.detail.incomeTaxRate,
					// 	verifiedRate: this.detail.verifiedRate,
					// 	taxCollectWay: this.detail.taxCollectWay == '查账'?1:2,

					// };
					this.axios.post('/perTaxToolTwo/e9z/taxStep/updateIncomeTaxProblem', params)
						.then(res => {
							if (res.data.code == 200) {
								this.dialogVisible = false;

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
				} else {

					this.$message({
						message: "不同意回退需先试算",
						type: "error"
					});

				}
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
			height: 30px;
			line-height: 29px;
			padding-left: 20px;
			/* background-color: #fff; */
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box
		}

		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 40px;
			background-color: #ebf6fb;
		}

		/deep/ .el-table th {
			background-color: #ebf6fb;
		}

		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #ebf6fb;
		}

		/deep/ .el-table__body tr,
		.el-table__body td {
			padding: 0;
			height: 40px;
			background-color: #fff7f1;
		}

		/deep/ .el-table__body tr.el-table__row--striped {
			background-color: #ebf6fb;
		}

		/deep/ .el-table thead {
			color: #343434;
		}

		/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
			background-color: #efe9e5;
		}

		/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
			border-bottom-color: #fff;
			background: #ebf6fb;
		}

		.search_contain {
			background: #fff;
			height: 40px;
			padding-left: 20px;
			padding-top: 12px;
			margin: 10px 20px;

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
			margin: 0 20px 20px;
			padding: 20px 20px 20px;
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
		background-color: rgb(125, 195, 109) !important;
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
