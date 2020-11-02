<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>报表管理</el-breadcrumb-item>
			<el-breadcrumb-item>账簿档案入库</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="单位名称" prop="customer">
						<el-select v-model="uploadData.customer" placeholder="请选择公司名称" clearable filterable value-key='customerId'>
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="案卷题目" prop="dossierName">
						<el-input v-model="uploadData.dossierName" placeholder="请输入" clearable filterable>
						</el-input>
					</el-form-item>
					<el-form-item label="目录号" prop="catalogNumber">
						<el-input v-model="uploadData.catalogNumber" placeholder="请输入" clearable filterable>
						</el-input>
					</el-form-item>
					<el-form-item label="案卷号" prop="dossierNumber">

						<el-input v-model="uploadData.dossierNumber" placeholder="请输入" clearable filterable>
						</el-input>
					</el-form-item>
					<el-form-item label="所属年度" prop="belongDate">
						<el-date-picker v-model="uploadData.belongDate" type="year" placeholder="请选择" clearable value-format='yyyy'>
						</el-date-picker>
					</el-form-item>
					<el-button type="primary" @click='search()' size="mini">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<h5>档案明细</h5>
			<el-button type='primary' size="mini" :disabled="multiSelection.length <= 0" @click='handleEdit("mul")'>批量入库</el-button>
			<el-button type='danger' size="mini" :disabled="multiSelection.length <= 0" @click='handleDel("mul")'>批量删除</el-button>
			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" stripe border @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="55"></el-table-column>
				<el-table-column align="center" label="序号" type='index' width="50"></el-table-column>
				<el-table-column align="center" label="全宗号" prop="fondsNumber"></el-table-column>
				<el-table-column align="center" label="目录号" prop="catalogNumber"></el-table-column>
				<el-table-column align="center" label="案卷号" prop="dossierNumber"></el-table-column>
				<!-- <el-table-column align="center" label="案卷年度" prop="customerName"></el-table-column> -->
				<el-table-column align="center" label="保管期限" prop="storageLimits"></el-table-column>
				<el-table-column align="center" label="案卷题名" prop="dossierName" width="300"></el-table-column>
				<el-table-column align="center" label="所属年度" prop="belongDate"></el-table-column>
				<el-table-column align="center" label="状态">
					<template slot-scope="scope">
						<span v-show="scope.row.status == 0">无效</span>
						<span v-show="scope.row.status == 1">已接受</span>
						<span v-show="scope.row.status == 2">已入库</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="接受时间" width="200">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.acceptTime,'yyyy-MM-dd hh:mm:ss')}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button size="mini" type='text' @click="handleDel(scope.row)">删除</el-button>
						<el-button size="mini" type='text' @click="handleEdit(scope.row)" v-if='scope.row.status != 2'>入库</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background layout="total,prev, pager, next, jumper" :total="total" :page-size='pageSize'
			 @current-change='handleCurrentChange' :current-page="currentPage">
			</el-pagination>
		</div>

	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				dialogVisible: false,
				uploadData: {},
				total: 0,
				currentPage: 1,
				tableData: [],
				pageSize: 10,
				multiSelection: [],
				customerId:''

			}
		},
		components: {},
		methods: {
			search() {
				this.customerId = this.uploadData.customer.customerId;
				this.dossierNumber = this.uploadData.dossierNumber;
				this.catalogNumber = this.uploadData.catalogNumber;
				this.dossierName = this.uploadData.dossierName;
				this.belongDate = this.uploadData.belongDate;
				this.currentPage = 1;
				this.queryPage()
			},

			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage();
			},
			queryPage() {
				let params = {
					row: this.pageSize,
					page: this.currentPage,
					data: {
						"customerId":this.customerId,
						"dossierNumber": this.dossierNumber,
						"catalogNumber": this.catalogNumber,
						"dossierName": this.dossierName,
						"belongDate": this.belongDate,
						"sing": "AccountBooks"
					}
				};
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/getArchivesStorageInfoPage', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.tableData = res.data.data;
							this.total = res.data.count;
							console.log(this.tableData)
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
			handleSelectionChange(val) {
				this.multiSelection = val;
			},
			handleDel(row) {
				this.$confirm('确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if (row == 'mul') {
						var params = this.multiSelection;
					} else {
						var params = [{
							"archivesStorageId": row.archivesStorageId
						}];
					}
					this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/deleteArchivesStorageInfo', params)
						.then(res => {
							if (res.data.code == 200) {
								this.queryPage();
								this.$message({
									message: res.data.msg,
									type: "success"
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
						message: '已取消删除'
					});
				});
			},
			handleEdit(row) {
				this.$confirm('确认入库?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if (row == 'mul') {
						var params = this.multiSelection;
					} else {
						var params = [{
							"archivesStorageId": row.archivesStorageId
						}];
					}

					this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/SaveArchivesStorageInfo', params)
						.then(res => {
							if (res.data.code == 200) {
								this.queryPage();
								this.$message({
									message: res.data.msg,
									type: "success"
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
						message: '已取消入库'
					});
				});
			}
		},
		computed: {},
		created() {
			// this.queryPage()
		},
		updated() {}
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
			padding: 0px 20px 20px;
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
</style>
