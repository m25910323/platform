<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案管理</el-breadcrumb-item>
			<el-breadcrumb-item>账簿管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :model="uploadData" size="small" ref='formName' inline label-width="90px">
					<el-form-item label="客户名称" prop="customer">
						<el-select v-model="uploadData.customer" placeholder="请选择" clearable filterable value-key='customerId'>
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>
						</el-select>
					</el-form-item>
					
					<el-form-item label="全宗号" prop="fondsNumber">
						<el-input v-model="uploadData.fondsNumber" placeholder="请输入" clearable filterable>
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
					<el-form-item label="案卷题名" prop="dossierName">
						<el-input v-model="uploadData.dossierName" placeholder="请输入" clearable filterable>
						</el-input>
					</el-form-item>
					<el-form-item label="所属账期" prop="belongDate">
						<el-date-picker v-model="uploadData.belongDate" type="year" placeholder="请选择" clearable value-format='yyyy'>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="出入库状态" prop="status">
						<el-select v-model="uploadData.status" placeholder="请选择" clearable filterable>
							<el-option label="全部" value=''></el-option>
							<el-option label="已出库" value='0'></el-option>
							<el-option label="已入库" value='2'></el-option>
						</el-select>
					</el-form-item>
					<el-button type="info" @click='resetForm()' size="small" style="float: right;">  重  置  </el-button>
					<el-button type="primary" @click='search()' size="small" style="float: right;margin-right: 20px;">  查  找  </el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			
			<div style="text-align: center;" class="clearfix">
				
				<p style="display: inline-block;width:200px">{{customerName}}</p>
				
				
				
				<el-button class="el-icon-refresh" type='text' size="mini" @click='refresh()' style='float:right;margin-left: 10px;'>刷新</el-button>
				<el-button class="el-icon-delete" type='text' size="mini" @click='handleDel("mul")' style='float:right' :disabled="multiSelection.length == 0">删除</el-button>
				<el-button class="el-icon-sold-out" type='text' size="mini" @click='handleEnter("mul")' style='float:right' :disabled="multiSelection.length == 0">出库</el-button>
				<el-button class="el-icon-sell" type='text' size="mini" @click='handleEdit("mul")' style='float:right' :disabled="multiSelection.length == 0">入库</el-button>
			</div>
			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" border @selection-change="handleSelectionChange" v-loading='loading'>
				<el-table-column align="center" type="selection" width="55"></el-table-column>
				<el-table-column align="center" label="序号" type='index' width="50"></el-table-column>
				<el-table-column align="center" label="全宗号" prop="fondsNumber"></el-table-column>
				<el-table-column align="center" label="目录号" prop="catalogNumber"></el-table-column>
				<el-table-column align="center" label="案卷号" prop="dossierNumber"></el-table-column>
				<!-- <el-table-column align="center" label="案卷年度" prop="customerName"></el-table-column> -->
				<el-table-column align="center" label="保管期限" prop="storageLimits"></el-table-column>
				<el-table-column align="center" label="案卷题名" prop="dossierName" width="300"></el-table-column>
				<el-table-column align="center" label="所属账期" prop="belongDate"></el-table-column>
				<el-table-column align="center" label="出入库状态">
					<template slot-scope="scope">
						<span v-show="scope.row.status == 0">已出库</span>
						<!-- <span v-show="scope.row.status == 1">已接受</span> -->
						<span v-show="scope.row.status == 2">已入库</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作时间" width="200">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.acceptTime,'yyyy-MM-dd hh:mm:ss')}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button size="mini" type='text' @click="handleDel(scope.row)">删除</el-button>
						<el-button size="mini" type='text' @click="handleEdit(scope.row)" v-if='scope.row.status == 0'>入库</el-button>
						<el-button size="mini" type='text' @click="handleEnter(scope.row)" v-if='scope.row.status != 0'>出库</el-button>
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
				multiSelection: [],
				loading: false,
				dialogVisible: false,
				uploadData: {},
				total: 0,
				currentPage: 1,
				tableData: [],
				pageSize: 10,
				customerId:'',
				customerName:''

			}
		},
		components: {},
		methods: {
			resetForm(){
				this.uploadData = {};
			},
			refresh(){
				
				this.queryPage()
				
			},
			search() {
				this.customerId = this.uploadData.customer.customerId;
				this.dossierNumber = this.uploadData.dossierNumber;
				this.catalogNumber = this.uploadData.catalogNumber;
				this.fondsNumber = this.uploadData.fondsNumber;
				this.dossierName = this.uploadData.dossierName;
				this.belongDate = this.uploadData.belongDate;
				this.status = this.uploadData.status;
				this.currentPage = 1;
				this.queryPage()
			},

			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage();
			},
			queryPage() {
				this.loading = true;
				let params = {
					row: this.pageSize,
					page: this.currentPage,
					data: {
						"customerId":this.customerId,
						"dossierNumber": this.dossierNumber,
						"fondsNumber": this.fondsNumber,
						"catalogNumber": this.catalogNumber,
						"dossierName": this.dossierName,
						"belongDate": this.belongDate,
						"status": this.status,
						"sing": "AccountBooks"
					}
				};
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/getArchivesStorageInfoPage', params)
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
					this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/removeArchivesStorageInfo', params)
						// this.axios.post('/miaoxing/queryPage', params)
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
							"archivesStorageId": row.archivesStorageId,
							"status":0
						}];
					}

					this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/SaveArchivesStorageInfo', params)
						// this.axios.post('/miaoxing/queryPage', params)
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
			},
			handleEnter(row) {
				this.$confirm('确认出库?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if (row == 'mul') {
						var params = this.multiSelection;
					} else {
						var params = [{
							"archivesStorageId": row.archivesStorageId,
							"status":2
						}];
					}
				
					this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/deleteArchivesStorageInfo', params)
						// this.axios.post('/miaoxing/queryPage', params)
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
						message: '已取消出库'
					});
				});
			},
		},
		computed: {},
		created() {
			// this.queryPage();
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

		/deep/ .search_contain {
			background: #fff;
			/* height: 40px; */
			/* padding-left: 20px; */
			padding: 0.3rem 20px 0.08rem;
			margin: 0px 20px 10px;
		
			.info {
				height: 40px;
				line-height: 40px;
			}
		
			a {
				margin-left: 10px;
			}
			
			.el-input{
				width: 180px;
			}
			.el-form-item{
				margin-right: 30px;
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
				text-align: center;
				margin-top: 10px;
			}
		}
	}
</style>
