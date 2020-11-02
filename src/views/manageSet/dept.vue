<template>
	<div class='main clearfix'>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
					<el-form-item label="部门:">
						<el-input v-model='formInline.orgName' placeholder="请输入部门名称" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click='search' type="primary" size="mini">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<el-button type="primary" size="mini" icon="el-icon-plus" class="addBtn" @click="addData">新增</el-button>
			<el-table :data="tableData" style="width: 100%" stripe border v-loading="loading">
				<el-table-column align="center" label="序号" type='index' width="80"></el-table-column>
				<el-table-column align="center" label="部门" prop="orgName"></el-table-column>
				<el-table-column align="center" label="描述" prop="remark"></el-table-column>
				<el-table-column align="center" label="创建时间" sortable prop="createTime"></el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button size="mini" type='primary' icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background layout="total,prev, pager, next, jumper" :total="total" :page-size="pageSize" @current-change='handleCurrentChange' :current-page="currentPage">
			</el-pagination>
			<!--弹出框-->
			<el-dialog class="dialog" :title="addFlag?'添加部门':'编辑部门'" :close-on-click-modal="false" :visible.sync="dialogVisible" width="4rem" style="min-width:250px" @close='hideDialog("ruleForm")'>
				<el-form :model="form" size="mini" label-width="50px" :rules="rules" ref="ruleForm">
					<el-form-item label="名称" prop="orgName">
						<el-input v-model="form.orgName" placeholder="请输入部门名称"></el-input>
					</el-form-item>
					<el-form-item label="描述" prop="remark">
						<el-input type="textarea" v-model="form.remark" maxlength="200" rows="4" placeholder="请输入部门具体描述信息，200字以内"></el-input>
					</el-form-item>
				</el-form>
				<div class='btn_contain clearfix'>
					<span class='commit' @click='commitDialog("ruleForm")'>完成</span>
					<span class='close' @click='hideDialog("ruleForm")'>关闭</span>
				</div>
			</el-dialog>
		</div>

	</div>
</template>

<script>
	export default {
		name: "dept",
		data() {
			return {
				formInline: {
					orgName: ''
				},
				total: 0,
				currentPage: 1,
				tableData: [],
				pageSize: 10,
				dialogVisible: false,
				form: {
					orgName: '',
					remark: '',
				},
				rules: {
					orgName: [{
						required: true,
						message: '请输入部门名称',
						trigger: 'blur'
					}, ],
					remark: [{
						required: true,
						message: '请输入部门具体描述信息',
						trigger: 'blur'
					}],
				},
				row:{},
				addFlag:false,
				loading:false,
			}
		},
		components: {},
		methods: {
			search() {
				this.getTableData();
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getTableData();
			},
			getTableData() {
				this.loading=true;
				let params = {
					orgName: this.formInline.orgName,
					currentPage: this.currentPage,
					pageCount: this.pageSize,
				};
				this.axios.get('/test/org/list.do', {
						params: params
					})
					.then(res => {
						this.loading=false;
						if(res.data.code == 200) {
							this.tableData = res.data.data;
							this.total = res.data.count;
							console.log(this.tableData)
						} else {
							let type;
							if(res.data.code == 0) {
								type = "warning";
							} else if(res.data.code == 500) {
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
			handleEdit(row) {
				this.addFlag = false;
				console.log(111,row)
				this.form.orgName=row.orgName;
				this.form.remark=row.remark;
				this.row=row;
				this.dialogVisible = true;
			},
			addData() {
				this.addFlag = true;
				this.dialogVisible = true;
				console.log(this.form)
			},
			commitDialog(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						console.log('addFlag',this.addFlag);
						let params={
							orgId:'',
							orgName:this.form.orgName,
							remark:this.form.remark,
						}
						if(!this.addFlag){
							//编辑
							params.orgId=this.row.orgId;
						}
						this.commitData(params);
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			hideDialog(formName) {
				this.$refs[formName].resetFields();
				this.form = {
					orgName:'',
					remark:'',
				};
				this.dialogVisible = false
			},
			commitData(params){
				this.axios.post('/test/org/saveOrg.do', params)
					.then(res => {
						if(res.data.code == 200) {
							this.$message({
				                message: res.data.msg,
				                type: "success"
				            });
				            this.hideDialog("ruleForm");
				            this.getTableData();
						} else {
							let type;
							if(res.data.code == 0) {
								type = "warning";
							} else if(res.data.code == 500) {
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
			}
		},
		computed: {},
		created() {
			this.getTableData();
		},
	}
</script>

<style lang='less' scoped>
	.main {
		/* background: #fff; */
		width: 100%;
		height: 100%;
		box-sizing: border-box;
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
			padding-left: 20px;
			padding-top: 20px;
			margin: 20px;
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
			margin: 0 20px;
			padding: 0px 20px;
			height: calc(100% - 190px);
			.addBtn {
				margin: 20px 0;
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
				cursor: pointer;
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
				cursor: pointer;
			}
			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}
		}
	}
</style>