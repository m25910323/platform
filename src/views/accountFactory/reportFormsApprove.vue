<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<!-- <el-breadcrumb-item>统计表</el-breadcrumb-item> -->
			<el-breadcrumb-item>报表审核</el-breadcrumb-item>
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
				<!-- <el-table-column align="center" label="备注(回退原因)" prop="remark"></el-table-column> -->
				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>查看</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="jumpToZcfzb(scope.$index, scope.row)">资产负债表</el-button>
						<el-button size="mini" type="text" @click="jumpToLrb(scope.$index, scope.row)">利润表</el-button>
						<el-button size="mini" type="text" @click="jumpToKmyeb(scope.$index, scope.row)">科目余额表</el-button>
						<el-button size="mini" type="text" @click="jumpToHsb(scope.$index, scope.row)" v-show='scope.row.tax_info_remark1 == "查账"'>汇算表</el-button>
					</template>
				</el-table-column>
				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="handlePass(scope.$index, scope.row)">通过</el-button>
						<el-button size="mini" type="text" @click="handleNoPass(scope.$index, scope.row)">不通过</el-button>
					</template>
				</el-table-column>

			</el-table>
		</div>
		
		

	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				detail:{},
				loading: false,
				accountPeriod: '',
				
				uploadData: {
					accountPeriod:'',
					executeStatus:1
				},
				customerId: '',
				tableData: [],
				personList:[],
				dialogVisible:false,
				rateList:[],
				verifiedRateList:[],
				executeStatus:1,
				executeStatusList:[
					{label:'未开始',value:0},
					{label:'执行中',value:1},
					{label:'已完成',value:2},
					{label:'删除',value:3},
					{label:'申报依据',value:4},
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
					customerId : this.customerId,
					user1 : this.user1,
					user2 : this.user2
					
				};
				this.axios.post('/perTaxToolTwo/e9z/corpIncomeTax/selectReportApprove', params)
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
			
			
			
			handlePass(index,row){
				this.$confirm('确定通过?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						type : 1,
						taxationId:row.taxation_id,
						taxInfoId:row.tax_info_id,
						stepName : '报表审核',
						nextStepName:'利润通知',
						// backSign:1,
						customerId:row.customer_id,
						accountPeriod:row.account_period
						
					};
					this.axios.post('/perTaxToolTwo/e9z/taxStep/updateReportApprove', params)
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
			handleNoPass(index,row){
				
				this.$prompt('备注', '确认不通过？', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					
				}).then(({ value }) => {
					let params = {
						type : 0,
						taxationId:row.taxation_id,
						taxInfoId:row.tax_info_id,
						stepName : '报表审核',
						nextStepName:'凭证审核',
						backSign:1,
						customerId:row.customer_id,
						accountPeriod:row.account_period,
						remark:value
						
					};
					this.axios.post('/perTaxToolTwo/e9z/taxStep/updateReportApprove', params)
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							this.loading = false;
							if (res.data.code == 200) {
								this.queryPage();
										
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
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});       
				});
				
				
				
				
			},
			
			jumpToZcfzb(index,row){
				
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/balanceStatementE9', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						
						accountPeriod: row.account_period,
						customerName: row.tax_info_remark2,
					}
				})
			},
			jumpToLrb(index,row){
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/profitStatementE9', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						
						accountPeriod: row.account_period,
						customerName: row.tax_info_remark2,
					}
				})
			},
			jumpToKmyeb(index,row){
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/balanceE9', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						
						accountPeriod: row.account_period,
						customerName: row.tax_info_remark2,
					}
				})
			},
			jumpToHsb(index,row){
				this.$router.push({ //核心语句
					path: '/accountFactory/finalSettlement', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						customerId: row.customer_id,
						accountPeriod: row.account_period,
						customerName: row.tax_info_remark2,
					}
				})
			},
			
		},
		computed: {},
		created() {
			this.queryPage();
			this.queryPersonList();
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
			height:40px;
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
	
	/deep/ .el-select{
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
