<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>系统管理</el-breadcrumb-item>
			<el-breadcrumb-item>人资配置</el-breadcrumb-item>
			<el-breadcrumb-item>短信配置</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- <div class='search_contain'>
			<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini" :rules="rules" ref='formName'>
				

				<el-form-item label="部门">
					<el-select v-model="formInline.orgName" placeholder="请选择部门名称" clearable filterable @change='filter'>
						<el-option v-for="item in departList" :label="item.orgName" :value='item.orgName'></el-option>
					</el-select>
				</el-form-item>
				<el-button type="primary" @click='exportExcel' size="mini" style='margin-right: 12px;'>导出上月统计表</el-button>
				<el-form-item>
					<el-upload class="upload-demo" action="/perTaxToolTwo/attendanceemployeerecordController/uploadRecordFile" :on-preview="handlePreview"
					 :on-remove="handleRemove" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList">
						<el-button type="primary" size="mini">考勤记录上传</el-button>
					</el-upload>
				</el-form-item>

			</el-form>
		</div> -->
		<div class="contain_body">
			<div style="background: #fff;height:45px;padding:15px 12px 0px;">


				短信模板


				<el-button type="primary" @click='delMul' size="mini" style='float: right;margin:0px 12px;' :disabled="multipleSelection.length == 0">删除</el-button>
				<el-button type="primary" @click='add' size="mini" style='float: right;margin:0px 12px;'>新增</el-button>
			</div>
			<el-table :data="tableList" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="50"></el-table-column>

				<!-- <el-table-column align="center" label="日期" prop="datetime" :resizable="false"></el-table-column> -->
				<el-table-column align="center" label="短信内容" prop="content" :resizable="false"></el-table-column>
				<el-table-column align="center" label="入职时间" prop="entryYear" :resizable="false">
					<template slot-scope="scope">
						<span>{{scope.row.entryYear}}年</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="自动发送" prop="auto" :resizable="false">
					<template slot-scope="scope">
						<span v-if='scope.row.auto == 1'>是</span>
						<span v-if='scope.row.auto == 0'>否</span>
					</template>
				</el-table-column>
				<el-table-column align="center" :resizable="false" width="100">
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
		<el-dialog title="新增短信模板" :visible.sync="dialogVisible" width="4rem" :before-close="handleClose">
			<el-form ref="form" :model="form1" label-width="100px" size="mini">

				<el-form-item label="短信内容">
					<el-input type="textarea" :autosize="{ minRows: 5, maxRows: 6}" placeholder="请输入内容" v-model="form1.content">
					</el-input>
				</el-form-item>
				<el-form-item label="入职时间">
					<el-input v-model="form1.entryYear"></el-input>
				</el-form-item>
				<el-form-item label="自动发送">
					<el-radio-group v-model="form1.auto">
						<el-radio v-for="item in trueOrFalse" :label="item.value" :value="item.value">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog">取 消</el-button>
				<el-button type="primary" @click="commitAdd">确 定</el-button>
			</span>
			<!-- <div class='btn_contain clearfix'>
				<span class='commit' @click="commitAddChild">确认</span>
				<span class='close' @click="hideDialog">关闭</span>
		
			</div> -->

		</el-dialog>

		<el-dialog title="编辑短信模板" :visible.sync="dialogVisible1" width="4rem" :before-close="handleClose">
			<el-form ref="form" :model="form2" label-width="100px" size="mini">

				<el-form-item label="短信内容">
					<el-input type="textarea" :autosize="{ minRows: 5, maxRows: 6}" placeholder="请输入内容" v-model="form2.content">
					</el-input>
				</el-form-item>
				<el-form-item label="入职时间">
					<el-input v-model="form2.entryYear"></el-input>
				</el-form-item>
				<el-form-item label="自动发送">
					<el-radio-group v-model="form2.auto">
						<el-radio v-for="item in trueOrFalse" :label="item.value" :value="item.value">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog1">取 消</el-button>
				<el-button type="primary" @click="commitAdd1">确 定</el-button>
			</span>
			<!-- <div class='btn_contain clearfix'>
				<span class='commit' @click="commitAddChild">确认</span>
				<span class='close' @click="hideDialog">关闭</span>
		
			</div> -->

		</el-dialog>
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
				dialogVisible1: false,
				form1: {},
				form2: {},
				visible2: false,
				trueOrFalse: [{
						label: "否",
						value: 0
					},
					{
						label: "是",
						value: 1
					}
				]

			}
		},
		components: {},
		methods: {
			queryListByPage() {
				this.loading = true;
				let param = {
					row: this.pageSize,
					page: this.currentPage,
					data: {}

				};
				this.axios.post('/perTaxToolTwo/attendanceMessageConfigController/queryListByPage', param).then(res => {
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
			commitAdd() {
				let param = this.form1;
				this.axios.post('/perTaxToolTwo/attendanceMessageConfigController/insert', param).then(res => {
					this.loading = false;
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
					this.loading = false;
					this.$message({
						message: '新增失败',
						type: 'error'
					});
				})
			},
			
			commitAdd1() {
				let param = this.form2;
				this.axios.post('/perTaxToolTwo/attendanceMessageConfigController/update', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.dialogVisible1 = false;
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
						message: '修改失败',
						type: 'error'
					});
				})
			},
			
			handleEdit(index, row) {
				this.dialogVisible1 = true;
				this.form2 = JSON.parse(JSON.stringify(row));
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

			add() {
				this.dialogVisible = true;
			},
			handleDel(index, row) {
				this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = [{
						"id": row.id
					}];
					this.axios.post('/perTaxToolTwo/attendanceMessageConfigController/delete', param).then(res => {
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
			delMul() {
				this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = this.multipleSelection;
					this.axios.post('/perTaxToolTwo/attendanceMessageConfigController/delete', param).then(res => {
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
			hideDialog() {
				this.dialogVisible = false;
				this.form1 = {};
			},
			hideDialog1() {
				this.dialogVisible1 = false;
				this.form2 = {};
			}
		},
		created() {
			// this.getDepartment();
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
