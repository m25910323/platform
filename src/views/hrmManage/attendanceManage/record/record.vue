<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>行政管理中心</el-breadcrumb-item>
			<el-breadcrumb-item>人资系统</el-breadcrumb-item>
			<el-breadcrumb-item>考勤记录</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="contain_body">
			<div style="background: #fff;height:45px;padding:15px 12px 0px;">
				
				
				<el-button v-popover:popover4 size="mini" style='margin-right: 20px;'>筛选</el-button>
				<el-popover ref="popover4" placement="bottom" width="280" trigger="click" v-model='visible'>
					<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini" :rules="rules" ref='formName'
					 label-width="80px">

						
						<el-form-item label="起始日期">
							<el-date-picker v-model="formInline.attendanceEmployeeSignTime" type="date" placeholder="请选择" format="yyyy-MM-dd"
							 value-format="yyyy-MM-dd">
							</el-date-picker>

						</el-form-item>
						<el-form-item label="截止日期">
							<el-date-picker v-model="formInline.attendanceEmployeeSignEndTime" type="date" placeholder="请选择" format="yyyy-MM-dd"
							 value-format="yyyy-MM-dd">
							</el-date-picker>
						
						</el-form-item>
						
						<el-form-item label="部门">
							<el-select v-model="formInline.attendanceEmployeeDepartId" placeholder="请选择部门名称" clearable filterable>
								<el-option v-for="item in departList" :label="item.orgName" :value='item.orgId' v-if="item.parentOrgId"></el-option>
							</el-select>
						</el-form-item>
						
						<el-form-item label="姓名">
							<el-input v-model="formInline.keywords" placeholder="请输入" clearable>
							</el-input>
						</el-form-item>

						<el-form-item label=" ">
							<el-button type="primary" @click="onSubmit" size="medium" style='width: 140px;'>确定</el-button>
						</el-form-item>

					</el-form>
				</el-popover>
				<el-button type="primary" @click='exportExcel' size="mini" style='float: right;margin:0px 12px;'>重新读取考勤机记录</el-button>
				<el-date-picker v-model="endtime" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini"
				 style='float: right;'>
				</el-date-picker>
				<span style='float: right;width: 20px;height:30px;line-height:28px;text-align: center;'>-</span>
				<el-date-picker v-model="starttime" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
				 size="mini" style='float: right;'>
				</el-date-picker>
			</div>
			<el-table :data="tableList" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange">
				<el-table-column align="center" label="工号" prop="attendanceEmployeeId" :resizable="false"></el-table-column>
				<el-table-column align="center" label="姓名" prop="attendanceEmployeeName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="隶属部门" prop="attendanceEmployeeDepartment" :resizable="false"></el-table-column>
				<el-table-column align="center" label="打卡时间" prop="attendanceEmployeeSignTime" :resizable="false"></el-table-column>
			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>
		</div>
		
	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				multipleSelection: [],
				starttime: '',
				endtime: '',
				keywords: '',
				departList: [],
				loading: false,
				formInline: {
					orgName: '',
				},
				orgName: '',
				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],
				dialogVisible: false,
				visible:false,
				visible2:false,

			}
		},
		components: {},
		methods: {
			onSubmit() {
				this.attendanceEmployeeSignTime = this.formInline.attendanceEmployeeSignTime;
				this.attendanceEmployeeSignEndTime = this.formInline.attendanceEmployeeSignEndTime;
				this.attendanceEmployeeDepartId = this.formInline.attendanceEmployeeDepartId;
				this.keywords = this.formInline.keywords;
				this.visible = false;
				this.queryListByPage();
			},
			getDepartment() {
				let param = {
				};
				this.axios.post('/perTaxToolTwo/attendance/customLoginController/getDepartment').then(res => {
					if (res.data.code == 200) {
						this.departList = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			queryListByPage() {
				this.loading = true;
				let param = {
					row: this.pageSize,
					page: this.currentPage,
					data: {
						"attendanceEmployeeSignTime": this.attendanceEmployeeSignTime,
						"attendanceEmployeeSignEndTime": this.attendanceEmployeeSignEndTime,
						"attendanceEmployeeDepartId": this.attendanceEmployeeDepartId,
						"keywords": this.keywords,
					}

				};
				this.axios.post('/perTaxToolTwo/attendanceemployeerecordController/getPageList', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.total = res.data.count;
						this.tableList = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			exportExcel() {
				if (this.starttime) {
					let param = {
							"attendanceEmployeeSignTime": this.starttime,
							"attendanceEmployeeSignEndTime": this.endtime,
					};
					this.axios.post('/perTaxToolTwo/attendanceemployeerecordController/getKqRecord', param).then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.queryListByPage();
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
						this.loading = false;
						this.$message({
							message: '获取列表失败',
							type: 'error'
						});
					})
				} else {
					this.$message({
						message: '请选择日期',
						type: 'warning'
					});
				}

			},
			handleEdit(index, row) {
				this.dialogVisible = true;
				this.form = JSON.parse(JSON.stringify(row));
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			compare() {
				let param = [this.form];
				this.axios.post('/perTaxToolTwo/attendanceConfluenceController/update', param).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible = false;
						this.queryListByPage();
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
					this.$message({
						message: '修改失败',
						type: 'error'
					});
				})
			},
			mulEdit() {
				this.visible2 = false;
				this.multipleSelection.forEach(item => {
					item.monthLateAndLeave = 0
				});
				let param = this.multipleSelection;
				this.axios.post('/perTaxToolTwo/attendanceConfluenceController/update', param).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible = false;
						this.queryListByPage();
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
					this.$message({
						message: '修改失败',
						type: 'error'
					});
				})
			},
			filter() {
				this.orgName = this.formInline.orgName;
				this.currentPage = 1;
				this.queryListByPage()
			},
		},
		created() {
			this.getDepartment();
			this.queryListByPage();
		}

	}
</script>

<style scoped lang='less'>
	.main_contain {
		width: 100%;
		height: 100%;
		padding: 0px;
		box-sizing: border-box;

		/deep/ .el-breadcrumb {
			height: 40px;
			line-height: 40px;
			background: rgb(234, 244, 255);
			padding-left: 20px;
		}

		.btn_contain {
			text-align: center;
			margin-top: 0.36rem;
		}

		.commit {
			width: 2.4rem;
			height: 0.4rem;
			line-height: 0.4rem;
			background: #43b3db;
			color: #fff;
			display: inline-block;
			text-align: center;
			margin-right: 0.4rem;
			border-radius: 4px;
		}

		.close {
			width: 2.4rem;
			height: 0.4rem;
			line-height: 0.4rem;
			background: #ed878e;
			color: #fff;
			display: inline-block;
			text-align: center;
			border-radius: 4px;
		}


	}

	.contain_body {
		/* padding: 10px 20px; */
		margin: 20px 20px;
		/* background: #fff; */
	}



	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
	}

	/deep/ .el-table table {
		background: rgb(243, 246, 249);
		border-collapse: separate;
		border-spacing: 0px 5px;
	}

	/deep/ .el-table__header tr,
	.el-table__header th {
		padding: 0;
		height: 40px;
	}

	/deep/ .el-table__body tr,
	.el-table__body td {
		padding: 0;
		height: 40px;
	}

	/deep/ .el-table td {
		padding: 6px 0;
	}

	/deep/ .el-table th,
	/deep/ .el-table tr {
		background-color: transparent;
	}

	/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
		background: #ebf6fb;
	}

	.el-dialog .el-form {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap
	}

	/deep/ .el-form-item__content {
		width: 180px;
	}

	/deep/ .el-date-editor.el-input {
		width: 180px;
	}

	/deep/ .el-table__body tr,
	.el-table__body td {
		padding: 0;
		height: 40px;
		background-color: #fff;
	}

	/deep/ .el-table__body tr.el-table__row--striped {
		background-color: #ebf6fb;
	}

	/deep/ .el-table thead {
		color: #666;
	}

	/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #fff;
	}
</style>
