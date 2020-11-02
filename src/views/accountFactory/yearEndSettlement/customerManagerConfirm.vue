<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>年终汇算</el-breadcrumb-item>
			<el-breadcrumb-item>客户经理确认</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small" ref='formName'>
					<el-form-item label="客户名称" prop="customerId">
						<el-select v-model="uploadData.customerId" placeholder="请选择" filterable clearable>
							<el-option v-for="item in $store.state.cust" :key="item.customerId" :label="item.customerName" :value="item.customerId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="账期" prop="accountPeriod">
						<el-date-picker v-model="uploadData.accountPeriod" type="month" placeholder="请选择" value-format="yyyy-MM"
						 format="yyyy-MM">
						</el-date-picker>
					</el-form-item>

					<el-button type="info" @click='resetForm()' size="small" style="float: right;"> 重 置 </el-button>
					<el-button type="primary" @click='search()' size="small" style="float: right;margin-right: 20px;"> 查 找 </el-button>


				</el-form>
			</div>
		</div>

		<div class='main_contain'>
			<!-- <p>{{customerName}}</p> -->
			<div style="text-align: center;" class="clearfix">

				<el-button class="el-icon-refresh" type='text' size="mini" @click='refresh()' style='float:right'>刷新</el-button>
			</div>


			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="客户名称" prop="customerName"></el-table-column>
				<el-table-column align="center" label="账期" prop="accountPeriod"></el-table-column>
				<el-table-column align="center" label="是否中高端" prop="isSeniorCustomer">
					<template slot-scope="scope">
						<span v-if="scope.row.isSeniorCustomer == 1">是</span>
						<span v-else>否</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="二部客户经理" prop="accountManager"></el-table-column>
				<el-table-column align="center" label="收入" prop="income"></el-table-column>
				<el-table-column align="center" label="利润" prop="profit"></el-table-column>
				<el-table-column align="center" label="定价" prop="priceSet"></el-table-column>
				<el-table-column align="center" label="确认价格" prop="priceConfirmed"></el-table-column>
				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>查看</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="jumpToHsb(scope.$index, scope.row)">汇算表</el-button>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click='handleApprove(scope.row,1)' v-if='!scope.row.priceSet'>审核人定价</el-button>
						<el-button type="text" size="mini" @click='handleApprove(scope.row,2)' v-show='scope.row.priceSet'>客户经理确认</el-button>
						<el-button type="text" size="mini" @click='handleApprove1(scope.row,4)' v-show='scope.row.priceSet && scope.row.priceConfirmed'>流转</el-button>
					</template>
				</el-table-column>

			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>


			<!-- <p style="text-align: right;margin-top: 20px;"><span style="margin-right: 20px;">凭证数：{{tvoucherCount}}</span> <span>附件数：{{fattachments}}</span></p> -->
		</div>


		<el-dialog width="400px" title="审核人定价" :visible.sync="dialogVisible">
			<el-form ref="form" :model="form" label-width="100px" size="mini" label-position="left">

				<el-form-item label="定价">
					<el-input v-model="form.priceReviewerSet" placeholder="请输入">

					</el-input>

				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="commit1">确 定</el-button>
			</span>

		</el-dialog>


		<el-dialog width="400px" title="客户经理确认" :visible.sync="dialogVisible1">
			<el-form ref="form" :model="form1" label-width="140px" size="mini" label-position="left">

				<el-form-item label="定价">
					<el-input v-model="form1.priceSet" placeholder="请输入" disabled></el-input>

				</el-form-item>
				<el-form-item label="确认价格">
					<el-input v-model="form1.priceAccountManagerConfirmed" placeholder="请输入">

					</el-input>

				</el-form-item>
				<el-form-item label="票据提供提醒时间">
					<el-date-picker v-model="form1.timeRemindCustomerProvideInvoice" type="date" placeholder="请选择" size="mini"
					 value-format="yyyy-MM-dd" format="yyyy-MM-dd">
					</el-date-picker>

				</el-form-item>
				<el-form-item label="预支成本">
					<el-input v-model="form1.advCostAmtEdit" placeholder="请输入">

					</el-input>

				</el-form-item>
				<el-form-item label="预支费用">
					<el-input v-model="form1.advFeeAmtEdit" placeholder="请输入">

					</el-input>

				</el-form-item>
				<el-form-item label="建议信息">
					<el-input type="textarea" rows="10" v-model="form1.recommendInfo" placeholder="请输入" disabled>

					</el-input>

				</el-form-item>

			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="calcYearIncomeTax">试 算</el-button>
				<el-button @click="cancel1">取 消</el-button>
				<el-button type="primary" @click="commit">确 定</el-button>
			</span>

		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				pageSize: 10,
				currentPage: 1,
				total: 0,
				detail: {},
				loading: false,



				uploadData: {
					customerId: '',
					accountPeriod: ''
				},
				customerId: '',
				accountPeriod: '',
				tableData: [],

				customerName: '',
				dialogVisible: false,
				dialogVisible1: false,
				form: {},
				form1: {},


			}
		},
		components: {},
		methods: {
			jumpToHsb(index,row){
				this.$router.push({ //核心语句
					path: '/accountFactory/finalSettlement', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						customerId: row.customerId,
						accountPeriod: row.accountPeriod,
						customerName: row.customerName,
					}
				})
			},
			resetForm() {
				this.uploadData = {};
			},
			cancel() {
				this.dialogVisible = false;
				this.form = {}
			},
			cancel1() {
				this.dialogVisible1 = false;
				this.form1 = {}
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage();
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
						"workFlowStepName": '客户经理确认',
						"workFlowExecuteStatus": 1,

					}
				};
				this.axios.post('/perTaxToolTwo/e9z/businessAdjustmentExpensesInfo/getByCondition', params)
					// this.axios.post('/miaoxing/queryPage', params)
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

			getRecommendAdjustmentExpensesByProfitAndIncome(row) {
				let params = {
					"income": row.income,
					"profit": row.profit,
				};
				this.axios.post('/perTaxToolTwo/e9z/businessAdjustmentExpensesInfo/getRecommendAdjustmentExpensesByProfitAndIncome',
						params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.$set(this.form, 'priceReviewerSet', res.data.data)
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
			
			commit1(){
				this.updatebusinessAdjustmentExpensesInfo();
			},

			commit() {
				this.businessAdjustmentExpensesInfoUpdate();
				this.updateYearIncomeTax();
				this.dialogVisible1 = false;
			},
			
			updatebusinessAdjustmentExpensesInfo(){
				let params = {
					id: this.form.adjustmentExpensesInfoId,
					priceReviewerSet: this.form.priceReviewerSet
				};
				this.axios.post('/perTaxToolTwo/e9z/businessAdjustmentExpensesInfo/update', params)
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
			
			businessAdjustmentExpensesInfoUpdate(){
				let params = {
					id: this.form1.adjustmentExpensesInfoId,
					priceAccountManagerConfirmed: this.form1.priceAccountManagerConfirmed,
					timeRemindCustomerProvideInvoice: this.form1.timeRemindCustomerProvideInvoice,
					recommendInfo: this.form1.recommendInfo,
				};
				this.axios.post('/perTaxToolTwo/e9z/businessAdjustmentExpensesInfo/update', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible1 = false;
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
			updateYearIncomeTax(){
				let params = {
					"yearTax":this.form1,
					"sign":1
				};
				this.axios.post('/perTaxToolTwo/import/updateYearIncomeTax', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible1 = false;
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

			handleApprove(row, tag) {
				if (tag == 1) {
					this.dialogVisible = true;
					this.form = JSON.parse(JSON.stringify(row));
					if(!row.priceSet){
						this.getRecommendAdjustmentExpensesByProfitAndIncome(row)
					}else{
						this.$set(this.form, 'priceReviewerSet', row.priceSet)
					}
					
				} else if (tag == 2) {
					this.dialogVisible1 = true;
					this.temYear = row.accountPeriod.slice(0,4);
					// this.form1= JSON.parse(JSON.stringify(row));
					// this.$set(this.form1, 'id', row.yearCorpIncomeTaxRecordId);
					//2.2
					this.findYearCorpIncomeTaxById(row);
					
					// this.form1 = JSON.parse(JSON.stringify(row));
				}

			},


			findYearCorpIncomeTaxById(row) {
				let params = {
					"id": row.yearCorpIncomeTaxRecordId

				};
				this.axios.post('/perTaxToolTwo/import/findYearCorpIncomeTaxById', params)
					.then(res => {
						if (res.data.code == 200) {
							this.form1 = res.data.data;
							this.$set(this.form1, 'adjustmentExpensesInfoId', row.adjustmentExpensesInfoId);
							// this.$set(this.form1, 'priceSet', row.priceSet);
							// this.$set(this.form1, 'priceAccountManagerConfirmed', row.priceSet);
							// this.$set(this.form1, 'timeRemindCustomerProvideInvoice', row.timeRemindCustomerProvideInvoice);
							this.$set(this.form1, 'advCostAmt', res.data.data.advCostAmt);
							this.$set(this.form1, 'advCostAmtEdit', res.data.data.advCostAmt);
							this.$set(this.form1, 'advFeeAmt', res.data.data.advFeeAmt);
							this.$set(this.form1, 'advFeeAmtEdit', res.data.data.advFeeAmt);
							//1.1
							this.getbusinessAdjustmentExpensesInfo(row);

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
			
			getbusinessAdjustmentExpensesInfo(row){
				let params = {
					"id": row.adjustmentExpensesInfoId
				
				};
				this.axios.post('/perTaxToolTwo/e9z/businessAdjustmentExpensesInfo/get', params)
					.then(res => {
						if (res.data.code == 200) {
							// this.form1 = res.data.data;
							this.$set(this.form1, 'priceSet', res.data.data.priceReviewerSet);
							this.$set(this.form1, 'priceAccountManagerConfirmed', res.data.data.priceAccountManagerConfirmed);
							this.$set(this.form1, 'timeRemindCustomerProvideInvoice', res.data.data.timeRemindCustomerProvideInvoice);
							this.$set(this.form1, 'recommendInfo', res.data.data.recommendInfo);
							// this.$set(this.form1, 'advCostAmtEdit', row.advCostAmt);
							// this.$set(this.form1, 'advFeeAmtEdit', row.advFeeAmt);
				
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

			calcYearIncomeTax() {
				let params = {
					"yearTax": this.form1
				};
				this.axios.post('/perTaxToolTwo/import/calcYearIncomeTax', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							// thhis.dialogVisible1 = false;
							this.$set(this.form1, "recommendInfo", "[" + JSON.parse(sessionStorage.getItem('updateUser')).nickName + "][" + this.formatTimeToStr(new Date(),'yyyy-MM-dd hh:mm:ss') + "]" + ":客户尚有成本支出" + res.data.data.yearTax.advCostAmt +
								"元，费用支出" + res.data.data.yearTax.advFeeAmt + "元，需提供票据入账。重新核算后" + this.temYear + "年度汇算后需缴纳企业所得税" + res.data.data.yearTax.liquidationPayIncomeTax +
								"元（全年），要求票据在" + this.form1.timeRemindCustomerProvideInvoice + "前提供，账务整理费用" + this.form1.priceAccountManagerConfirmed + "元。本季度调整后利润总额:" + res.data.data.yearTax.qtrProfit +
								"。企业所得税金额:" + res.data.data.yearTax.totalIncomeTax + "。汇算后利润总额:" + res.data.data.yearTax.liquidationProfit + "。")
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

			handleApprove1(row, tag) {
				// if (tag == 1) {
				var title = "确认流转？"
				// } else {
				// 	var title = "确认审批不通过？"
				// }
				this.$confirm(title, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = row;
					params.stepName = "客户经理确认";
					params.nextStepName = "客户经理联系";
					this.axios.post('/perTaxToolTwo/e9z/taxStep/submitYrRpt', params)
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
				color: #409EFF
			}

			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}
		}
	}


	.Article-nav {
		/* width: 1200px; */
		height: 0.45rem;
		box-sizing: border-box;
		/* background-color: red; */
		/* padding-top: 10px;
			padding-bottom: 10px; */
		margin-left: 20px;
		/* display: flex;
			flex-direction: row;
			position: relative;
			z-index: 1000;
			justify-content: space-around; */

		.Article-circle {
			/* display: inline-block; */
			float: left;
			width: 1rem;
			height: 0.45rem;
			margin-right: 0.12rem;
			border: 1px solid #979797;
			background: #fff;
			cursor: pointer;
			box-sizing: border-box;
			color: #8C8C8C;

			span:nth-of-type(1) {
				width: 50%;
				float: left;
				font-size: 0.32rem;
				height: 0.45rem;
				line-height: 0.45rem;
				text-align: center;
			}

			span:nth-of-type(2) {
				width: 50%;
				float: left;
				font-size: 0.15rem;
				height: 0.22rem;
				line-height: 0.25rem;
				/* padding-left:0.12rem */
			}

			span:nth-of-type(3) {
				width: 50%;
				float: left;
				font-size: 0.15rem;
				height: 0.22rem;
				line-height: 0.18rem;
				/* padding-left:0.12rem */
			}
		}
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
