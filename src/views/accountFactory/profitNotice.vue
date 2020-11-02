<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<!-- <el-breadcrumb-item>统计表</el-breadcrumb-item> -->
			<el-breadcrumb-item>利润通知</el-breadcrumb-item>
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

				<el-table-column align="center" label="企业所得税征收方式" prop="tax_info_remark1">
					<template slot-scope="scope">
						<span>{{scope.row.tax_info_remark1?scope.row.tax_info_remark1:'--'}}</span>

					</template>
				</el-table-column>

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

				<el-table-column align="center" label="终止状态" prop="serviceStatus" :resizable="false">
					<template slot-scope="scope">

						<span v-if='scope.row.serviceStatus == 2'>终止</span>
						<span v-else>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="备注" prop="remark"></el-table-column>

				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="handleStop(scope.$index, scope.row)" :disabled='!(scope.row.isTerminateState == 0 && scope.row.serviceStatus != 2)'>终止</el-button>
						<el-button size="mini" type="text" @click="handleModify(scope.$index, scope.row)">修改所得税</el-button>
						<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)" :disabled="!scope.row.id">详情</el-button>
						<!-- <el-button size="mini" type="text" @click="handleCal(scope.$index, scope.row)">预览计算</el-button> -->
						<el-button size="mini" type="text" @click="handleAgree(scope.$index, scope.row)">同意</el-button>
						<el-button size="mini" type="text" @click="handleNoAgree(scope.$index, scope.row)">不同意</el-button>
					</template>
				</el-table-column>

			</el-table>
		</div>

		<el-dialog title="详情" :visible.sync="dialogVisible" width="800px">
			<el-form ref="form" :model="detail" label-width="160px" size="mini" inline="true">
				<el-form-item label="暂估的成本金额">
					<el-input v-model="detail.costInvAmt" type="number" min="0"></el-input>
				</el-form-item>
				<el-form-item label="暂估的费用金额">
					<el-input v-model="detail.feeInvAmt" type="number" min="0"></el-input>
				</el-form-item>

				<el-button type="primary" size="mini" @click='calcu'>计算</el-button>

				<el-divider></el-divider>

				<el-form-item label="客户名称">
					<el-input v-model="detail.customerName" disabled></el-input>
				</el-form-item>
				<el-form-item label="账期">
					<el-input v-model="detail.accountPeriod" disabled></el-input>
				</el-form-item>

				<el-form-item label="核定征收率">
					<el-select v-model="detail.verifiedRate" placeholder="请选择" clearable filterable disabled>
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option v-for="item in verifiedRateList" :label="item.rate" :value='item.rate'></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="征收方式">
					<el-input :value="detail.taxCollectWay" disabled></el-input>
					<!-- <el-select v-model="detail.taxCollectWay" placeholder="请选择" clearable filterable>
						
						<el-option label="查账征收" value='1'></el-option>
						<el-option label="核定征收" value='2'></el-option>
					</el-select> -->
				</el-form-item>
				<el-form-item label="企业所得税税率">
					<el-input v-model="detail.incomeTaxRate" disabled></el-input>
					<!-- <el-select v-model="detail.incomeTaxRate" placeholder="请选择" clearable filterable>
						
						<el-option v-for="item in rateList" :label="item.taxesRate" :value='item.taxesRate'></el-option>
					</el-select> -->
				</el-form-item>
				<el-form-item label="可弥补以前年度亏损">
					<el-input v-model="detail.priorYearLoss" disabled></el-input>
				</el-form-item>
				<el-form-item label="实际弥补以前年度亏损">
					<el-input v-model="detail.remedyPriorYearLoss" disabled></el-input>
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


				<el-form-item label="应交企业所得税">
					<el-input v-model="detail.totalIncomeTaxation" disabled></el-input>
				</el-form-item>
				<el-form-item label="已交企业所得税">
					<el-input v-model="detail.paidIncomeTaxation" disabled></el-input>
				</el-form-item>
				<el-form-item label="应补(退)企业所得税">
					<el-input v-model="detail.incomeTaxation" disabled></el-input>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="nosubmit">取消</el-button>
				<el-button type="primary" @click="submit">确认计算</el-button>
			</span>

		</el-dialog>

		<el-dialog title="修改" :visible.sync="dialogVisible1" width="400px">
			<el-form ref="form1" :model="detail1" label-width="160px" size="mini" inline="true">
				<el-form-item label="客户名称">
					<el-input v-model="detail1.customerName" disabled></el-input>
				</el-form-item>
				<el-form-item label="账期">
					<el-input v-model="detail1.accountPeriod" disabled></el-input>
				</el-form-item>

				<el-form-item label="核定征收率">
					<el-select v-model="detail1.verifiedRate" placeholder="请选择" clearable filterable>
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option v-for="item in verifiedRateList" :label="item.rate" :value='item.rate'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="企业所得税税率">
					<el-input v-model="detail1.incomeTaxRate"></el-input>
					<!-- <el-select v-model="detail.incomeTaxRate" placeholder="请选择" clearable filterable>
						
						<el-option v-for="item in rateList" :label="item.taxesRate" :value='item.taxesRate'></el-option>
					</el-select> -->
				</el-form-item>
				<el-form-item label="可弥补以前年度亏损">
					<el-input v-model="detail1.priorYearLoss"></el-input>
				</el-form-item>
				<el-form-item label="实际弥补以前年度亏损">
					<el-input v-model="detail1.remedyPriorYearLoss"></el-input>
				</el-form-item>
				<el-form-item label="已交企业所得税">
					<el-input v-model="detail1.paidIncomeTaxation"></el-input>
				</el-form-item>

			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="nosubmit1">取消</el-button>
				<el-button type="primary" @click="submit1">确认</el-button>
			</span>

		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				detail: {},
				detail1: {},
				loading: false,
				accountPeriod: '',
				temtaxInfoId: '',
				uploadData: {
					accountPeriod: '',
					executeStatus: 1
				},
				customerId: '',
				tableData: [],
				personList: [],
				dialogVisible: false,
				dialogVisible1: false,
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
				this.axios.post('/perTaxToolTwo/e9z/corpIncomeTax/selectProfitsToInform', params)
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
			selectCorpIncomeTax(id, tag) {
				let params = {
					// id: id
					taxInfoId: id,
				};
				this.axios.post('/perTaxToolTwo/e9z/corpIncomeTax/selectCorpIncomeTax', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							if (tag == 1) {
								this.detail1 = res.data.data;
							} else {
								this.detail = res.data.data;
							}


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
				this.temtaxInfoId = row.tax_info_id;
				// this.selectCorpIncomeTax(row.id);
				this.selectCorpIncomeTax(row.tax_info_id);
				this.getList(row.customer_id)
			},

			handleModify(index, row) {
				this.dialogVisible1 = true;
				// this.selectCorpIncomeTax(row.id,1);
				this.selectCorpIncomeTax(row.tax_info_id, 1);
				this.getList(row.customer_id, 1)
			},

			handleStop(index, row) {
				this.$confirm('确认终止?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = {
						customerId: row.customer_id,
						taxationId: row.taxation_id,
						taxInfoId: row.tax_info_id,
						stepName: '利润通知',
						remark: '无效客户，终止利润通知',
					};
					this.axios.post('/perTaxToolTwo/e9z/corpIncomeTax/submitTerminate', param).then(res => {
						this.loading1 = false;
						if (res.data.code == 200) {
							this.queryPage();
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
						this.loading1 = false;
						this.$message({
							message: '操作失败',
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

			handleAgree(index, row) {
				this.$confirm('确定同意?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						type: 1,
						taxationId: row.taxation_id,
						taxInfoId: row.tax_info_id,
						stepName: '利润通知',
						nextStepName: '税款确认',
						// backSign:1,
						customerId: row.customer_id,
						accountPeriod: row.account_period

					};
					this.axios.post('/perTaxToolTwo/e9z/taxStep/updateProfitsToInform', params)
						.then(res => {
							if (res.data.code == 200) {
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
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},

			handleNoAgree(index, row) {

				this.$prompt('备注', '确认不同意？', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',

				}).then(({
					value
				}) => {
					let params = {
						type: 0,
						taxationId: row.taxation_id,
						taxInfoId: row.tax_info_id,
						stepName: '利润通知',
						nextStepName: '报表审核',
						backSign: 1,
						customerId: row.customer_id,
						accountPeriod: row.account_period,
						remark: value
					};
					this.axios.post('/perTaxToolTwo/e9z/taxStep/updateProfitsToInform', params)
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							if (res.data.code == 200) {
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
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});


			},

			calcu() {
				if(this.detail.costInvAmt < 0 || this.detail.feeInvAmt< 0){
					this.$message({
						message: '暂估值不能小于0',
						type: 'error'
					});
				}else{
					let params = {
					
						costInvAmt: this.detail.costInvAmt,
						feeInvAmt: this.detail.feeInvAmt,
					
						customerId: this.detail.customerId,
						accountPeriod: this.detail.accountPeriod,
						id: this.detail.id,
					
						"resultStatus": 2,
						"source": 2,
						"customerName": this.detail.customerName,
					
						// priorYearLoss:this.detail.priorYearLoss,
						// remedyPriorYearLoss:this.detail.remedyPriorYearLoss,
						// incomeTaxRate:this.detail.incomeTaxRate,
						// taxCollectWay:this.detail.taxCollectWay,
					
					
					};
					this.axios.post('/perTaxToolTwo/import/calcCorpIncomeTaxRecord', params)
						.then(res => {
							if (res.data.code == 200) {
								this.detail = res.data.data;
								this.detail.customerId = res.data.data.customerId;
								this.detail.accountPeriod = res.data.data.accountPeriod;
								this.detail.customerName = res.data.data.customerName;
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
				}
				
					
				
			},

			submit() {
				let params = {

					costInvAmt: this.detail.costInvAmt,
					feeInvAmt: this.detail.feeInvAmt,

					customerId: this.detail.customerId,
					accountPeriod: this.detail.accountPeriod,
					id: this.detail.id,

					"resultStatus": 2,
					"source": 2,
					"customerName": this.detail.customerName,

					remark: '',
					taxNotice: 1,
					originalIncome: this.detail.income,
					originalFee: this.detail.fee,
					originalCost: this.detail.cost,
					originalProfit: this.detail.profit,
					taxInfoId: this.temtaxInfoId,

					cost: this.detail.cost,
					fee: this.detail.fee,
					income: this.detail.income,
					profit: this.detail.profit,

					// priorYearLoss:this.detail.priorYearLoss,
					// remedyPriorYearLoss:this.detail.remedyPriorYearLoss,
					// incomeTaxRate:this.detail.incomeTaxRate,
					// taxCollectWay:this.detail.taxCollectWay,
				};
				this.axios.post('/perTaxToolTwo/import/confirmCorpIncomeTax', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible = false;
							this.queryPage()

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

			submit1() {
				let params = {

					id: this.detail1.id,
					priorYearLoss: this.detail1.priorYearLoss,
					remedyPriorYearLoss: this.detail1.remedyPriorYearLoss,
					incomeTaxRate: this.detail1.incomeTaxRate,
					verifiedRate: this.detail1.verifiedRate,
					paidIncomeTaxation: this.detail1.paidIncomeTaxation,
				};
				this.axios.post('/perTaxToolTwo/e9z/corpIncomeTax/updateCorpIncomeTax', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible1 = false;
							this.queryPage()

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
				this.dialogVisible = false;
				this.detail = {};


			},
			nosubmit1() {
				this.dialogVisible1 = false;
				this.detail1 = {};


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

			getList(customerId, tag) {
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
