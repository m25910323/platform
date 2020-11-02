<template>
	<div class='main clearfix'>
		<el-page-header @back="goBack" content="信息记录">
		</el-page-header>



		<div class='main_contain'>
			<div style="text-align: center;" class="clearfix">

				<p style="display: inline-block;width:200px">{{customerName}}</p>

				<!-- <el-button class="el-icon-download" type='text' size="mini" :disabled="tableData.length <= 0" @click='exportExcel()' style='float:right'>打印</el-button> -->
				
				<el-button class="el-icon-refresh" type='text' size="mini" @click='refresh()' style='float:right'>刷新</el-button>
				<el-button type='text' size="mini" @click='add()' style='float:right;margin-right: 10px;'>新增</el-button>
			</div>



			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="客户名称" prop="title">
					<template slot-scope="scope">
						<span v-html='$route.query.customerName'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="账期" prop="accountPeriod"></el-table-column>
				<el-table-column align="center" label="记录人工号" prop="userCode"></el-table-column>
				<el-table-column align="center" label="记录人姓名" prop="userName"></el-table-column>
				<el-table-column align="center" label="记录时间" prop="recordTime">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.recordTime)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="记录内容" prop="recordContent"></el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button type="text" @click='handleDel(scope.row)'>删除</el-button>
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


				loading: false,


				uploadData: {},
				customerId: '',
				accountPeriod: '',
				tableData: [],
				customerName: '',
				total: 0,
				pageSize: 10,
				currentPage: 1


			}
		},
		components: {},
		methods: {
			goBack() {

				this.$router.push({
					path: '/financeCalculateCenter/invoiceDetail',

				})

			},
			handleDel(row) {
				this.$confirm('确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"id": row.id,
						'userCode':row.userCode,

					};
					this.axios.post('/perTaxToolTwo/e9z/businessCustNote/delete', params)
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
							this.loading = false;
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
			add() {
				this.$prompt('请输入记录内容', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',

				}).then(({
					value
				}) => {
					let params = {
						"recordContent": value,
						"customerId": this.customerId,
						"accountPeriod": this.accountPeriod,


					};
					this.axios.post('/perTaxToolTwo/e9z/businessCustNote/create', params)
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
							this.loading = false;
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
			refresh() {
				this.queryPage()
			},

			search() {
				this.customerId = this.$route.query.customerId;
				this.accountPeriod = this.$route.query.accountPeriod;
				this.queryPage()
			},

			queryPage() {
				this.loading = true;
				let params = {

					"data": {
						"customerId": this.customerId,
						// "accountPeriod": this.accountPeriod,
						"accountPeriod": '',
					},
					"page": this.currentPage,
					"row": this.pageSize,


				};
				this.axios.post('/perTaxToolTwo/e9z/businessCustNote/get', params)
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
						this.loading = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},

		},
		computed: {},
		watch: {

			'$route'(to, from) {
				// init data
				if (to.name == 'noteRecord') {
					// this.getInvoiceStatistics();
					this.customerName = this.$route.query.customerName;
					this.customerId = this.$route.query.customerId;
					this.accountPeriod = this.$route.query.accountPeriod;
					// this.fyear = this.belongDate.slice(0,4);
					// this.selectNum = parseFloat(this.belongDate.slice(5,7)) - 1;
					this.queryPage();
				}


			}
			// screenWidth(val) {
			// 	
			// }
		},
		created() {
			// this.queryPage();
			this.customerName = this.$route.query.customerName;
			this.customerId = this.$route.query.customerId;
			this.accountPeriod = this.$route.query.accountPeriod;
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

		.el-page-header {
			height: 40px;
			line-height: 39px;
			padding-left: 20px;
			background-color: #fff;
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box;
			margin-bottom: 12px;
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
