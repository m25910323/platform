<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>年终汇算</el-breadcrumb-item>
			<el-breadcrumb-item>汇算结果审核</el-breadcrumb-item>
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
						<el-date-picker v-model="uploadData.accountPeriod" type="date" placeholder="请选择" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item>
					
					<el-button type="info" @click='resetForm()' size="small" style="float: right;">  重  置  </el-button>
					<el-button type="primary" @click='search()' size="small" style="float: right;margin-right: 20px;">  查  找  </el-button>
					

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
				<el-table-column align="center" label="做账会计" prop="doAccountant"></el-table-column>
				<el-table-column align="center" label="审核会计" prop="checkAccountant"></el-table-column>
				
				
				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>查看</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="jumpToZcfzb(scope.$index, scope.row)">资产负债表</el-button>
						<el-button size="mini" type="text" @click="jumpToLrb(scope.$index, scope.row)">利润表</el-button>
						<el-button size="mini" type="text" @click="jumpToKmyeb(scope.$index, scope.row)">科目余额表</el-button>
						<el-button size="mini" type="text" @click="jumpToHsb(scope.$index, scope.row)">汇算表</el-button>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="mini" disabled v-if='scope.row.source == "汇算账务处理" && !scope.row.erpChargeSign'>调账费用未收取，不能审核</el-button>
						<el-button type="text" size="mini" @click='handleApprove(scope.row,1)' v-else>审批通过</el-button>
						<!-- <el-button type="text" size="mini" disabled v-else>调账费用未收取，不能审核</el-button> -->
						<!-- <span >调账费用未收取，不能审核</span> -->
					</template>
				</el-table-column>
			
			</el-table>
			
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>


			<!-- <p style="text-align: right;margin-top: 20px;"><span style="margin-right: 20px;">凭证数：{{tvoucherCount}}</span> <span>附件数：{{fattachments}}</span></p> -->
		</div>




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
					accountPeriod:''
				},
				customerId: '',
				accountPeriod: '',
				tableData: [],

				customerName: '',
				dialogVisible: false,
				
				
			}
		},
		components: {},
		methods: {
			jumpToZcfzb(index,row){
				
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/balanceStatementE9', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						
						accountPeriod: row.accountPeriod,
						customerName: row.customerName,
					}
				})
			},
			jumpToLrb(index,row){
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/profitStatementE9', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						
						accountPeriod: row.accountPeriod,
						customerName: row.customerName,
					}
				})
			},
			jumpToKmyeb(index,row){
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/balanceE9', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						
						accountPeriod: row.accountPeriod,
						customerName: row.customerName,
					}
				})
			},
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
			resetForm(){
				this.uploadData = {};
			},
			hideDialog() {
				this.dialogVisible = false;
				this.detail = {}
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
						"workFlowStepName":'汇算结果审核',
						"workFlowExecuteStatus":1,

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

			handleApprove(row, tag) {
				// if (tag == 1) {
					var title = "确认审批通过？"
				// } else {
				// 	var title = "确认审批不通过？"
				// }
				this.$confirm(title, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = row;
					params.stepName = "汇算结果审核";
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
			}


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
