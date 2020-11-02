<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>行政管理</el-breadcrumb-item>
			<el-breadcrumb-item>组织架构</el-breadcrumb-item>
			<el-breadcrumb-item>组织架构管理</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body clearfix">
			<div style="float: left;width: 250px;background: #fff;min-height: 100%;">
				<h3 style="60px;line-height: 60px;margin: 0px 12px 20px;border-bottom: 1px solid #efefef;">组织架构</h3>
				<el-tree :data="data4" :props="defaultProps" node-key="id" default-expand-all :expand-on-click-node="false" style='margin: 0px 10px;'
				 @node-click='nodeClick'  v-loading='loading1'>

					<span class="custom-tree-node" slot-scope="{ node, data }">


						<span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;">
							<span>
								<span>{{node.label}}</span>
							</span>
							<span>
								<i class='el-icon-circle-plus-outline' style="font-size: 12px;margin-right:4px" @click.stop="() => append(data)">
								</i>
								<i class='el-icon-edit' style="font-size: 12px;margin-right:4px" @click.stop="() => editOrg(data)"> </i>
							</span>
						</span>


					</span>
				</el-tree>
			</div>
			<div style="float: right;width: calc(100% - 270px);">
				<div style="width: 100%;background: #fff;height: 50px;padding: 10px 20px 0px;box-sizing: border-box;">
					<!-- <span class='el-icon-circle-plus-outline' style="display: inline-block;width: 80px;height: 40px;line-height: 40px;text-align: center;">  新增</span>
					<span @click='miltiDel' class='el-icon-delete' style="display: inline-block;width: 80px;height: 40px;line-height: 40px;text-align: center;">  删除</span>
					<span class='el-icon-search' style="display: inline-block;width: 80px;height: 40px;line-height: 40px;text-align: center;">  查询</span>
					<span class='el-icon-news' style="display: inline-block;width: 80px;height: 40px;line-height: 40px;text-align: center;">  筛选</span> -->
					<el-input v-model='userName' size="mini" style='width: 180px;margin-right: 10px;' placeholder="请输入姓名"></el-input>
					<el-button size="mini" type='text' @click='search'>搜索</el-button>
				</div>
				<el-table :data="tableList" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange">

					<el-table-column align="center" label="工号" prop="userCode" :resizable="false"></el-table-column>
					<el-table-column align="center" label="姓名" prop="userName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="隶属部门" prop="orgName" :resizable="false"></el-table-column>

					<el-table-column align="center" label="职务" prop="position" :resizable="false"></el-table-column>

					<el-table-column align="center" label="入职时间" prop="entryDate" :resizable="false"></el-table-column>
					<el-table-column align="center" label="状态" prop="entryDate" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
						</template>
					</el-table-column> -->
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>

		</div>
		<el-dialog title="编辑" :visible.sync="dialogVisible" width="4rem" :before-close="handleClose">
			<el-form ref="form" :model="form2" label-width="100px" size="mini">

				<el-form-item label="部门名称">
					<el-input v-model="form2.departmentName"></el-input>
				</el-form-item>
				<el-form-item label="部门领导">
					<el-select v-model='form2.userId' clearable size="mini">
						<el-option v-for='item in empInfo' :label="item.userName" :value="item.userId" :key='item.userId'></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog">取 消</el-button>
				<el-button type="primary" @click="commitAddChild">确 定</el-button>
			</span>
			<!-- <div class='btn_contain clearfix'>
				<span class='commit' @click="commitAddChild">确认</span>
				<span class='close' @click="hideDialog">关闭</span>

			</div> -->

		</el-dialog>

		<el-dialog title="新增部门" :visible.sync="dialogVisible1" width="4rem" :before-close="handleClose1">
			<el-form ref="form" :model="form1" label-width="100px" size="mini">

				<el-form-item label="部门名称">
					<el-input v-model="form1.orgName"></el-input>
				</el-form-item>
				<el-form-item label="上级部门">
					<el-input v-model="form1.departmentName" disabled></el-input>
				</el-form-item>
				<el-form-item label="部门领导">
					<el-select v-model='form1.orgLeaderId' clearable size="mini">
						<el-option v-for='item in empInfo' :label="item.userName" :value="item.userId" :key='item.userId'></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog1">取 消</el-button>
				<el-button type="primary" @click="commitAdd">确 定</el-button>
			</span>
			<!-- <div class='btn_contain clearfix'>
				<span class='commit' @click="commitAdd">确认</span>
				<span class='close' @click="hideDialog1">关闭</span>

			</div> -->

		</el-dialog>
	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				empInfo: [],
				form2: {},
				form1: {},
				orgId: null,
				multipleSelection: [],
				starttime: '',
				endtime: '',
				keywords: '',
				departList: [],
				loading: false,
				loading1: false,
				formInline: {
					orgName: '',
				},
				userName: '',
				orgName: '',
				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],

				dialogVisible: false,
				dialogVisible1: false,

				defaultProps: {
					children: 'child',
					label: 'departmentName'
				},
				data4: [],

			}
		},
		components: {},
		methods: {
			hideDialog() {
				this.dialogVisible = false;
				this.reset();
			},
			hideDialog1() {
				this.dialogVisible1 = false;
				this.reset();
			},
			reset() {
				this.form = {};
				this.form2 = {};
			},
			append(item) {
				this.dialogVisible1 = true;
				this.form1 = JSON.parse(JSON.stringify(item))
			},
			editOrg(item) {
				this.dialogVisible = true;
				this.form2 = JSON.parse(JSON.stringify(item))
			},
			commitAdd() {
				this.form1.parentOrgId = this.form1.departmentId
				let param = this.form1;
				
				this.axios.post('/perTaxToolTwo/hr/org/saveOrg', param).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hr/org/saveOrg', param).then(res => {
					if (res.data.code == 200) {
						this.queryListByPage();
						this.dialogVisible1 = false;
						this.reset();
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
						message: '新增失败',
						type: 'error'
					});
				})
			},
			commitAddChild() {
				this.form2.orgName = this.form2.departmentName;
				this.form2.orgLeaderId = this.form2.userId;
				this.form2.orgId = this.form2.departmentId;
				let param = this.form2;
				// this.axios.post('/sl/perTaxToolTwo/hr/org/saveOrg', param).then(res => {
				this.axios.post('/perTaxToolTwo/hr/org/saveOrg', param).then(res => {
					if (res.data.code == 200) {
						this.queryListByPage();
						this.dialogVisible = false;
						this.reset();
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


			search() {
				this.searchuserName = this.userName;
				this.getHrEmpInfo1();
			},
			onSubmit() {
				this.keywords = "";
				this.deptname = this.formInline.deptname;
				this.dateTimeStart = this.formInline.dateTimeStart;
				this.dateTimeEnd = this.formInline.dateTimeEnd;
				this.queryListByPage();
			},
			queryListByPage() {
				this.loading1 = true;
				this.result = [];
				this.resultDetail = [];


				let param = {

					"parentOrgId": "0"
				};
				this.axios.post('/perTaxToolTwo/org/getAllOrgInfo', param).then(res => {
					this.loading1 = false;
					if (res.data.code == 200) {
						this.data4 = res.data.data.level.child;

					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading1 = false;
					this.$message({
						message: '获取部门列表失败',
						type: 'error'
					});
				})
			},
			exportExcel() {
				if (this.starttime && this.endtime) {
					window.location.href = "/perTaxToolTwo/attendanceConfluenceController/downloadAllAttendanceException?starttime=" +
						this.starttime + "&endtime=" + this.endtime;
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
				this.getHrEmpInfo(this.orgId)
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},


			nodeClick(data) {
				this.currentPage = 1;
				this.orgId = data.departmentId;
				this.getHrEmpInfo(data);


			},
			getHrEmpInfo(data) {
				if (data) {
					var param = {
						data: {
							orgId: data.departmentId
						},
						page: this.currentPage,
						row: this.pageSize
					}
				} else {
					var param = {
						data: {
							orgId: null
						},
						page: this.currentPage,
						row: this.pageSize
					}
				}
				this.loading = true;
				this.axios.post('/perTaxToolTwo/hrEmpInfo/getHrEmpInfo', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.tableList = res.data.data;
						this.total = res.data.count;
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
						message: '查询失败',
						type: 'error'
					});
				})
			},

			getHrEmpInfo1() {

				var param = {
					data: {
						orgId: this.orgId,
						userName: this.searchuserName
					},
					page: this.currentPage,
					row: this.pageSize
				}

				this.loading = true;
				this.axios.post('/perTaxToolTwo/hrEmpInfo/getHrEmpInfo', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.tableList = res.data.data;
						this.total = res.data.count;
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
						message: '查询失败',
						type: 'error'
					});
				})
			},

			queryEmploy() {
				let params = {
					"type": 1
				}
				this.axios.post('/perTaxToolTwo/hrEmpInfo/findHrEmpInfo', params).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hrEmpInfo/findHrEmpInfo', params).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hrEmpInfo/findHrEmpInfoPage', params).then(res => {
					if (res.data.code == 200) {

						this.empInfo = res.data.data;
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

		},
		created() {
			this.queryListByPage();
			this.getHrEmpInfo();
			this.queryEmploy();
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
		height: 100%
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

	/deep/ .custom-tree-node {
		width: 100%
	}
</style>
