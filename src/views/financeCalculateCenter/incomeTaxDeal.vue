<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>会计工厂</el-breadcrumb-item>
			<el-breadcrumb-item>凭证管理</el-breadcrumb-item>
			<el-breadcrumb-item>待收取实物操作池</el-breadcrumb-item>
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
					<!-- <el-form-item label="是否入库" prop="isHaveEntity">
						<el-select v-model="uploadData.isHaveEntity" placeholder="请选择" filterable clearable>
							<el-option label="是" value="1"></el-option>
							<el-option label="否" value="0"></el-option>
						</el-select>
					
					</el-form-item> -->

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

			<el-button type='primary' size="mini" :disabled="multipleSelection.length == 0" @click='handleMul()'>批量入库</el-button>
			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading' @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="55"></el-table-column>
				<el-table-column align="center" label="序号" prop="step_name">
					<template slot-scope="scope">
						<span>{{scope.$index + 1}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="客户名称" prop="customerName"></el-table-column>
				<el-table-column align="center" label="账期" prop="accountPeriod"></el-table-column>

				<!-- <el-table-column align="center" label="企业所得税征收方式" prop="tax_info_remark1"></el-table-column>

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
				<el-table-column align="center" label="备注(回退原因)" prop="remark"></el-table-column> -->

				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">确认入库</el-button>
						<!-- <el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">同意回退</el-button>
						<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">不同意回退</el-button> -->
					</template>
				</el-table-column>

			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>
		</div>



	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				detail: {},
				loading: false,
				accountPeriod: '',
				customerId: '',
				isHaveEntity:0,
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
				currentPage:1,
				pageSize:10,
				total:0,
				multipleSelection:[]
			}
		},
		components: {},
		methods: {


			search() {
				this.customerId = this.uploadData.customerId;
				this.accountPeriod = this.uploadData.accountPeriod;
				// this.isHaveEntity = this.uploadData.isHaveEntity;
				this.queryPage()
			},

			handleCurrentChange(val){
				this.currentPage = val;
				this.queryPage();
			},

			queryPage() {
				this.loading = true;
				let params = {
					data:{
						accountPeriod: this.accountPeriod,
						customerId: this.customerId,
						isHaveEntity: 0,
					},
					page:this.currentPage,
					row:this.pageSize
					

				};
				this.axios.post('/perTaxToolTwo/iocr/main/getHaveEntityCompanyList', params)
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
				this.$confirm('确认入库?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						customerId: row.customerId,
						customerName: row.customerName,
						accountPeriod: row.accountPeriod,	
						mainId:row.mainId,	
					};
					this.axios.post('/perTaxToolTwo/iocr/main/submitHaveEntity', params)
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
			
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			
			handleMul(){
				this.$confirm('确认批量入库?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = this.multipleSelection;
					this.axios.post('/perTaxToolTwo/iocr/main/submitHaveEntityBatch', params)
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
