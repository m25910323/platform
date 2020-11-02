<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>系统管理</el-breadcrumb-item>
			<el-breadcrumb-item>人资配置</el-breadcrumb-item>

			<el-breadcrumb-item>审批配置</el-breadcrumb-item>
		</el-breadcrumb>
		<div>
			<div class="contain_body">
				<div style="background: #fff;height:45px;padding:15px 12px 0px;">
					<el-select v-model="formInline.departId" placeholder="请选择部门" size="mini" @change='filter' clearable>
						<el-option v-for="item in departList" :key="item.orgId" :label="item.orgName" :value="item.orgId">
						</el-option>
					</el-select>
					<el-button type="danger" size='mini' icon="el-icon-delete" :disabled="canEidt" @click='deleteMulti' style='margin-bottom: 0.2rem;float: right;'>批量删除</el-button>
					<el-button type="primary" size='mini' icon="el-icon-circle-plus-outline" @click='add' style='margin-bottom: 0.2rem;float: right;margin-right: 12px;'>新增</el-button>

				</div>
				<el-table :data="tableList" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange">
					<el-table-column align="center" type="selection" width="50"></el-table-column>
					<el-table-column align="center" label="部门名称" prop="department" :resizable="false"></el-table-column>
					<el-table-column align="center" label="1级审批人工号" prop="departFirstId" :resizable="false"></el-table-column>
					<el-table-column align="center" label="1级审批人姓名" prop="departFirstName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="2级审批人工号" prop="departSecondId" :resizable="false"></el-table-column>
					<el-table-column align="center" label="2级审批人姓名" prop="departSecondName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="3级审批人工号" prop="departThirdId" :resizable="false"></el-table-column>
					<el-table-column align="center" label="3级审批人姓名" prop="departThirdName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="4级审批人工号" prop="departForthId" :resizable="false"></el-table-column>
					<el-table-column align="center" label="4级审批人姓名" prop="departForthName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="扣款依据" prop="departReduceAmount" :resizable="false"></el-table-column>
					<el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button size="mini" type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>


			</div>
		</div>


		<el-dialog width="20%" title="审批配置" :visible.sync="dialogVisible">
			<el-form ref="form" :model="form" label-width="100px" size="mini" label-position="right">
				<el-form-item label="部门" prop="depart" :rules="[$rules.requiredSelect]">
					<el-select v-model="form.depart" placeholder="请选择部门" size="mini" value-key='orgId'>
						<el-option v-for="item in departList" :label="item.orgName" :value="item">
						</el-option>
					</el-select>

				</el-form-item>
				<el-form-item label="1级审批人" prop="departFirst" :rules="[$rules.requiredSelect]">
					<el-select v-model="form.departFirst" placeholder="请选择" size="mini" value-key='userId' filterable>
						<el-option v-for="item in humanList1" :label="item.userName" :value="item" :key='item.userId'>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="2级审批人">
					<el-select v-model="form.departSecond" placeholder="请选择" size="mini" value-key='userId' filterable :disabled="!form.departFirst" clearable>
						<el-option v-for="item in humanList2" :label="item.userName" :value="item" :key='item.userId'>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="3级审批人">
					<el-select v-model="form.departThird" placeholder="请选择" size="mini" value-key='userId' filterable :disabled="!form.departSecond" clearable>
						<el-option v-for="item in humanList3" :label="item.userName" :value="item" :key='item.userId'>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="4级审批人">
					<el-select v-model="form.departForth" placeholder="请选择" size="mini" value-key='userId' filterable :disabled="!form.departThird" clearable>
						<el-option v-for="item in humanList4" :label="item.userName" :value="item" :key='item.userId'>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="部门扣款依据">
					<el-input v-model="form.departReduceAmount" type="textarea">
					</el-input>
				</el-form-item>
			</el-form>
			<div class='btn_contain clearfix' style="text-align: center;margin-top: 0.36rem;">
				<span class='commit' @click="commit">保存提交</span>
				<span class='close' @click="cancel">取消</span>
			</div>
		</el-dialog>
		
		
		<el-dialog width="20%" title="审批配置修改" :visible.sync="dialogVisible1">
			<el-form ref="form1" :model="form1" label-width="100px" size="mini" label-position="right">
				<el-form-item label="部门" prop="depart">
					<el-input v-model="form1.department" disabled>
					</el-input>
		
				</el-form-item>
				<el-form-item label="1级审批人" prop="departFirst" :rules="[$rules.requiredSelect]">
					<el-select v-model="form1.departFirst" placeholder="请选择" size="mini" value-key='userCode' filterable>
						<el-option v-for="item in humanList1" :label="item.userName" :value="item" :key='item.userId'>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="2级审批人" prop="departSecond">
					<el-select v-model="form1.departSecond" placeholder="请选择" size="mini" value-key='userCode' filterable clearable>
						<el-option v-for="item in humanList2" :label="item.userName" :value="item" :key='item.userId'>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="3级审批人" prop="departSecond">
					<el-select v-model="form1.departThird" placeholder="请选择" size="mini" value-key='userCode' filterable clearable>
						<el-option v-for="item in humanList3" :label="item.userName" :value="item" :key='item.userId'>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="4级审批人" prop="departForth">
					<el-select v-model="form1.departForth" placeholder="请选择" size="mini" value-key='userCode' filterable clearable>
						<el-option v-for="item in humanList4" :label="item.userName" :value="item" :key='item.userId'>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="部门扣款依据">
					<el-input v-model="form1.departReduceAmount" type="textarea">
					</el-input>
				</el-form-item>
			</el-form>
			<div class='btn_contain clearfix' style="text-align: center;margin-top: 0.36rem;">
				<span class='commit' @click="commit1">保存提交</span>
				<span class='close' @click="cancel1">取消</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				tag: 'add',
				departList: [],
				humanList1: [],
				humanList2: [],
				humanList3: [],
				humanList4: [],
				loading: false,
				canEidt: true,
				formInline: {
					departId: ''
				},
				form: {
					depart: '',
					department: '',
					departId: "",
					departFirst: "",
					departFirstId: "",
					departFirstName: "",
					departSecond: "",
					departSecondId: "",
					departSecondName: "",
					departThird: "",
					departThirdId: "",
					departThirdName: "",
					departForth: "",
					departForthId: "",
					departForthName: "",
					departReduceAmount: ""
				},
				form1: {
					departFirst: "",
					departSecond: "",
					departThird: "",
					departForth: "",
				},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],

				dialogVisible: false,
				dialogVisible1: false,
				multipleSelection: []
			}
		},
		components: {},
		methods: {
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
			getUsersByDepartId() {
				let param = {
					data:{
						type:1
						
					},
					page:1,
					row:99999
				};
				this.axios.post('/perTaxToolTwo/hrEmpInfo/findHrEmpInfoPage', param).then(res => {
					if (res.data.code == 200) {
						this.humanList1 = res.data.data;
						this.humanList2 = res.data.data;
						this.humanList3 = res.data.data;
						this.humanList4 = res.data.data;
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
					"row": this.pageSize,
					"page": this.currentPage,
					"data": {
						"departId": this.formInline.departId
					}

				};
				this.axios.post('/perTaxToolTwo/attendanceapplyapprovepersonconfigController/getPageList',
					param).then(res => {
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
					this.loading = true;
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},

			add() {
				this.tag = 'add';
				this.dialogVisible = true;
			},

			handleCancel(index, row) {},
			handleEdit(index, row) {
				this.form1 = JSON.parse(JSON.stringify(row));
				this.$set(this.form1,'departFirst',{});
				this.$set(this.form1,'departSecond',{});
				this.$set(this.form1,'departThird',{});
				this.$set(this.form1,'departForth',{});
				
				this.$set(this.form1.departFirst,'userCode',this.form1.departFirstId);
				this.$set(this.form1.departFirst,'userName',this.form1.departFirstName);
				
				this.$set(this.form1.departSecond,'userCode',this.form1.departSecondId);
				this.$set(this.form1.departSecond,'userName',this.form1.departSecondName);
				
				this.$set(this.form1.departThird,'userCode',this.form1.departThirdId);
				this.$set(this.form1.departThird,'userName',this.form1.departThirdName);
				
				this.$set(this.form1.departForth,'userCode',this.form1.departForthId);
				this.$set(this.form1.departForth,'userName',this.form1.departForthName);
				console.log(this.form1);
				this.dialogVisible1 = true;
			},
			handleDel(index, row) {
				this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = [{
						"configId": row.configId
					}];
					this.axios.post('/perTaxToolTwo/attendanceapplyapprovepersonconfigController/delete', param).then(res => {
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
						this.$message({
							message: '删除失败',
							type: 'error'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			commit() {
				this.$refs["form"].validate((valid) => {
					if (valid) {
						this.form.department = this.form.depart.orgName;
						this.form.departFirstName = this.form.departFirst.userName;
						this.form.departSecondName = this.form.departSecond.userName;
						this.form.departThirdName = this.form.departThird.userName;
						this.form.departForthName = this.form.departForth.userName;
						this.form.departId = this.form.depart.orgId;
						this.form.departFirstId = this.form.departFirst.userCode;
						this.form.departSecondId = this.form.departSecond.userCode;
						this.form.departThirdId = this.form.departThird.userCode;
						this.form.departForthId = this.form.departForth.userCode;
						let param = this.form;
						this.axios.post('/perTaxToolTwo/attendanceapplyapprovepersonconfigController/insert', param).then(res => {
							this.loading = false;
							if (res.data.code == 200) {
								this.dialogVisible = false;
								this.resetForm();
								this.queryListByPage()
							} else {
								this.$message({
									message: res.data.msg,
									type: 'error'
								});
							}
						
						}).catch(function(err) {
							this.$message({
								message: '新增失败',
								type: 'error'
							});
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				})
				
			},
			
			commit1() {
				this.$refs["form1"].validate((valid) => {
					if (valid) {
						
						this.form1.departFirstName = this.form1.departFirst.userName;
						this.form1.departSecondName = this.form1.departSecond.userName?this.form1.departSecond.userName:'';
						this.form1.departThirdName = this.form1.departThird.userName?this.form1.departThird.userName:'';
						this.form1.departForthName = this.form1.departForth.userName?this.form1.departForth.userName:'';
						
						this.form1.departFirstId = this.form1.departFirst.userCode;
						this.form1.departSecondId = this.form1.departSecond.userCode?this.form1.departSecond.userCode:'';
						this.form1.departThirdId = this.form1.departThird.userCode?this.form1.departThird.userCode:'';
						this.form1.departForthId = this.form1.departForth.userCode?this.form1.departForth.userCode:'';
						let param = this.form1;
						this.axios.post('/perTaxToolTwo/attendanceapplyapprovepersonconfigController/update', param).then(res => {
							this.loading = false;
							if (res.data.code == 200) {
								this.dialogVisible1 = false;
								this.resetForm();
								this.queryListByPage()
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
					} else {
						console.log('error submit!!');
						return false;
					}
				})
				
			},
			cancel() {
				this.resetForm();
				this.dialogVisible = false;
			},
			cancel1() {
				this.resetForm();
				this.dialogVisible1 = false;
			},
			resetForm() {
				this.form = {
					depart: '',
					department: '',
					departId: "",
					departFirst: "",
					departFirstId: "",
					departFirstName: "",
					departSecond: "",
					departSecondId: "",
					departSecondName: "",
					departThird: "",
					departThirdId: "",
					departThirdName: "",
					departForth: "",
					departForthId: "",
					departForthName: "",
					departReduceAmount: ""
				}
				this.form1 = {
				}
			},
			handleClick(tab, event) {},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage()
			},
			deleteMulti() {
				this.$confirm('确定批量删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = this.multipleSelection;
					this.axios.post('/perTaxToolTwo/attendanceapplyapprovepersonconfigController/delete', param).then(res => {
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
						this.$message({
							message: '批量删除失败',
							type: 'error'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			filter() {
				this.queryListByPage()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

		},
		watch: {
			multipleSelection(newName, oldName) { //newName是改变后的值，oldName是初始的值
				if (newName.length > 0) {
					this.canEidt = false;
				} else {
					this.canEidt = true;
				}
			}
		},
		created() {
			this.getDepartment();
			//获取审核人
			this.getUsersByDepartId();
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
			width: 1.2rem;
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
			width: 1.2rem;
			height: 0.4rem;
			line-height: 0.4rem;
			background: #ed878e;
			color: #fff;
			display: inline-block;
			text-align: center;
			border-radius: 4px;
		}

		.contain_body {
			/* padding: 10px 20px; */
			margin: 20px 20px;
			/* background: #fff; */
		}


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
