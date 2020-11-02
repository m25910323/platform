<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>人资系统</el-breadcrumb-item>
			<el-breadcrumb-item>员工管理</el-breadcrumb-item>
			<el-breadcrumb-item>入职薪酬统计表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>

				<el-form inline="true" :model="uploadData" class="demo-form-inline" size="small" ref='formName'>
					<!-- <el-form-item label="客户名称" prop="customerId">
						<el-select v-model="uploadData.customerId" placeholder="请选择" filterable clearable>
							<el-option v-for="item in $store.state.cust" :key="item.customerId" :label="item.customerName" :value="item.customerId">
							</el-option>
						</el-select>
					</el-form-item> -->
					<!-- <el-form-item label="账期" prop="accountPeriod">
						<el-date-picker v-model="uploadData.accountPeriod" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM">
						</el-date-picker>

					</el-form-item> -->

					<el-form-item label="姓名" prop="name">
						<el-input v-model="uploadData.name">
						</el-input>
					
					</el-form-item>

					<el-button type="primary" @click='search()' size="small">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<div style="text-align: center;" class="clearfix">

				<el-button class="el-icon-refresh" type='text' size="mini" @click='refresh()' style='float:right'>刷新</el-button>
				<el-button class="el-icon-delete" type='text' size="mini" @click='handleDel("mul")' style='float:right;margin-right: 10px;' :disabled="multipleSelection.length == 0">批量删除</el-button>
				<el-button class="el-icon-delete" type='text' size="mini" @click='handleAdd()' style='float:right;margin-right: 10px;'>新增</el-button>
			</div>



			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" border v-loading='loading' @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="55"></el-table-column>
				<el-table-column align="center" label="岗位" prop="position"></el-table-column>
				<el-table-column align="center" label="姓名" prop="name"></el-table-column>

				<el-table-column align="center" label="毕业学校" prop="school"></el-table-column>

				<el-table-column align="center" label="本科批次" prop="undergraduateBatch"></el-table-column>
				<el-table-column align="center" label="入职时间" prop="entryTime">
					<template slot-scope="scope">
						<span>{{scope.row.entryTime?formatTimeToStr(scope.row.entryTime,'yyyy-MM-dd'):'--'}}</span>

					</template>
				</el-table-column>
				
				<el-table-column align="center" label="入职去向" prop="entryDirection"></el-table-column>
				<el-table-column align="center" label="试用期" prop="tryPeriod"></el-table-column>
				<el-table-column align="center" label="转正期" prop="coversionPeriod"></el-table-column>
				<!-- <el-table-column align="center" label="创建人" prop="createUserName"></el-table-column>
				<el-table-column align="center" label="创建时间" prop="createTime"></el-table-column> -->
				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="handleEdit(scope.row)">编辑</el-button>
						<el-button size="mini" type="text" @click="handleDel(scope.row)">删除</el-button>
					</template>
				</el-table-column>

			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>
		</div>

		<el-dialog title="新增" :visible.sync="dialogVisible" width="800px">
			<el-form ref="form" :model="detail" label-width="160px" size="mini" inline="true">
				<el-form-item label="姓名">
					<el-select v-model="detail.name" placeholder="请选择" clearable filterable @change="setDetail" value-key="userName">
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option v-for="item in personList" :label="item.userName" :value='item'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="岗位">
					<el-input v-model="detail.position" disabled></el-input>
				</el-form-item>
				<el-form-item label="毕业学校">
					<el-input v-model="detail.school" disabled></el-input>
				</el-form-item>
				<el-form-item label="本科批次">
					<el-input :value="detail.undergraduateBatch" disabled></el-input>
				</el-form-item>
				
				
				<el-form-item label="入职时间">
					<el-input v-model="detail.entryTime" disabled></el-input>
				</el-form-item>
				
				<el-form-item label="入职去向">
					<el-input v-model="detail.entryDirection" disabled></el-input>
				</el-form-item>
				<el-form-item label="试用期">
					<el-input v-model="detail.tryPeriod"></el-input>
				</el-form-item>
				<el-form-item label="转正期">
					<el-input v-model="detail.coversionPeriod"></el-input>
				</el-form-item>
				
			</el-form>
		
		
			<span slot="footer" class="dialog-footer">
				<el-button @click='cancelAdd'>取消</el-button>
				<el-button type="primary" @click='commitAdd'>确定</el-button>
				<!-- <el-button type="primary" @click="submit">同意回退</el-button>
				<el-button @click="nosubmit">不同意回退</el-button> -->
			</span>
		
		</el-dialog>

		<el-dialog title="编辑" :visible.sync="dialogVisible1" width="800px">
			<el-form ref="form" :model="detail1" label-width="160px" size="mini" inline="true">
				<el-form-item label="姓名">
					<el-input v-model="detail1.name" disabled></el-input>
				</el-form-item>
				<el-form-item label="岗位">
					<el-input v-model="detail1.position" disabled></el-input>
				</el-form-item>
				<el-form-item label="毕业学校">
					<el-input v-model="detail1.school" disabled></el-input>
				</el-form-item>
				<el-form-item label="本科批次">
					<el-input :value="detail1.undergraduateBatch" disabled></el-input>
				</el-form-item>
				
				
				<el-form-item label="入职时间">
					<el-input v-model="detail1.entryTime" disabled></el-input>
				</el-form-item>
				
				<el-form-item label="入职去向">
					<el-input v-model="detail1.entryDirection" disabled></el-input>
				</el-form-item>
				<el-form-item label="试用期">
					<el-input v-model="detail1.tryPeriod" type="number"></el-input>
				</el-form-item>
				<el-form-item label="转正期">
					<el-input v-model="detail1.coversionPeriod" type="number"></el-input>
				</el-form-item>
				
			</el-form>
		
		
			<span slot="footer" class="dialog-footer">
				<el-button @click='cancelModify'>取消</el-button>
				<el-button type="primary" @click='commitModify'>确定</el-button>
				<!-- <el-button type="primary" @click="submit">同意回退</el-button>
				<el-button @click="nosubmit">不同意回退</el-button> -->
			</span>
		
		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				loading: false,
				accountPeriod: '',

				uploadData: {
					accountPeriod: '',
				},
				customerId: '',
				tableData: [],
				dialogVisible: false,
				dialogVisible1: false,
				multipleSelection:[],
				detail:{},
				detail1:{},
				personList:[],
				pageSize:10,
				currentPage:1,
				total:0
			}
		},
		components: {},
		methods: {
			resetForm() {
				this.uploadData = {};
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			refresh() {
				this.queryPage()
			},

			search() {
				this.name = this.uploadData.name;
				// this.accountPeriod = this.uploadData.accountPeriod;
				this.queryPage()
			},
			handleCurrentChange(val){
				this.currentPage = val;
				this.queryPage()
			},
			handleAdd(){
				this.dialogVisible = true;
			},
			cancelAdd(){
				this.dialogVisible = false;
			},
			
			cancelModify(){
				this.dialogVisible1 = false;
			},

			handleDel(row) {
				this.$confirm('确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if(row === 'mul'){
						var params = this.multipleSelection;
					}else{
						var params = [row];
					}
					this.axios.post('/perTaxToolTwo/entrySalaryCount/deleteEntrySalaryCount', params)
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
						message: '已取消删除'
					});
				});
			},
			
			handleEdit(row){
				this.dialogVisible1 = true;
				this.detail1 = JSON.parse(JSON.stringify(row));
			},

			queryPage() {
				this.loading = true;
				let params = {
					"row": this.pageSize,
					"page": this.currentPage,
					"data": {
						// "customerId": this.customerId,
						// "accountPeriod": this.accountPeriod,
						"name": this.name,
					}

				};
				this.axios.post('/perTaxToolTwo/entrySalaryCount/getEntrySalaryCount', params)
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
			
			commitAdd(){
				let params = this.detail;
				this.axios.post('/perTaxToolTwo/entrySalaryCount/addEntrySalaryCount', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.queryPage();
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
			},
			
			
			commitModify(){
				let params = this.detail1;
				this.axios.post('/perTaxToolTwo/entrySalaryCount/updateEntrySalaryCount', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.queryPage();
							this.dialogVisible1 = false;
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
			setDetail(val){
				this.$set(this.detail,'name',val.userName);
				this.$set(this.detail,'position',val.positionName);
				this.$set(this.detail,'entryDirection',val.orgName);
				this.$set(this.detail,'school',val.college);
				this.$set(this.detail,'undergraduateBatch',val.education);
				this.$set(this.detail,'entryTime',val.entryDate);
			}

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
