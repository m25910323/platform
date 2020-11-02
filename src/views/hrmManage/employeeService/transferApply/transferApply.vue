<template>
	<div class="main_contain">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>行政管理</el-breadcrumb-item>
			<el-breadcrumb-item>员工服务</el-breadcrumb-item>

			<el-breadcrumb-item>转岗申请</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body">
			<h3>转岗申请
				<el-button type="primary" size='mini' icon="el-icon-circle-plus-outline" @click='add' style='float: right;margin-top:6px;margin-right: 12px;'>申请</el-button>
			</h3>


			<el-table :data="detail" style="width: 100%;" v-loading='loading'>
				<!-- <el-table-column type="selection" width="50"></el-table-column> -->
				<el-table-column align="center" label="工号" prop="auserCode" :resizable="false"></el-table-column>
				<el-table-column align="center" label="姓名" prop="auserName" :resizable="false"></el-table-column>

				<el-table-column align="center" label="部门" prop="adepartment" :resizable="false"></el-table-column>
				<el-table-column align="center" label="转岗原因" prop="reassignmentReasons" width="200" :resizable="false"></el-table-column>
				<el-table-column align="center" label="转岗部门" prop="applyDepartmentName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="转岗职位" prop="applyPositionName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="申请时间" prop="applyTime" :resizable="false"></el-table-column>
				<el-table-column align="center" label="申请状态" :resizable="false">
					<template slot-scope="scope">
						<span v-if="scope.row.docStatus == 0">已提交</span>
						<span v-if="scope.row.docStatus == 1">审批中</span>
						<span v-if="scope.row.docStatus == 2">审批通过</span>
						<span v-if="scope.row.docStatus == -1">审批不通过</span>
					</template>
				</el-table-column>

			</el-table>

		</div>
		<el-dialog title="转岗申请" :visible.sync="dialogVisible" width="300px">
			<el-form ref="form1" :model="form1" label-width="80px" size="mini">

				<el-form-item label="转岗部门">
					<el-select v-model="form1.applyDepartment" placeholder="请选择" filterable @change="getPosition">
						<el-option v-for="item in departList" :label="item.orgName" :value='item.orgId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="转岗职位">
					<el-select v-model="form1.applyPosition" placeholder="请选择" filterable>
						<el-option v-for="item in positionList" :label="item.posnName" :value='item.posnId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="转岗原因">
					<el-input v-model="form1.reassignmentReasons"></el-input>
				</el-form-item>


			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideAddDialog" size="mini">取 消</el-button>
				<el-button type="primary" @click="addInduction" size="mini">确 定</el-button>
			</span>
			<!-- <div class='btn_contain clearfix'>
				<span class='commit' @click='addInduction'>完成</span>
				<span class='close' @click="hideAddDialog">关闭</span>
			</div> -->
		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				loading: false,
				formInline: {
					userName: '',
					userNickName: '',
					roleId: ''
				},
				form1: {},
				detail: [],

				dialogVisible: false,

				userId: '',
				departList: [],
				positionList: [],
				currentPage:1,
				pageSize:10,
			}
		},
		components: {},
		methods: {
			queryList() {
				let params = {
					"data": {
						"pageNum": this.currentPage,
						"pageSize": this.pageSize,
						"isApprove": 0
					}
				};
				this.axios.post('/perTaxToolTwo/attendanceApplicationForReassignmentController/get', params).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hrEmpQuitOpt/findHrEmpQuitOptPage',params).then(res => {
					if (res.data.code == 200) {
						this.detail = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取申请离职列表失败',
						type: 'error'
					});
				})
			},
			add() {
				this.dialogVisible = true;
			},

			hideAddDialog() {
				this.dialogVisible = false;
			},
			addInduction() {
				this.form1.modelSign = 'Leave';
				var params = this.form1;

				this.axios.post('/perTaxToolTwo/attendanceApplicationForReassignmentController/apply', params).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hrEmpQuitOpt/saveOrUpdateHrEmpQuitOpt', params).then(res => {

					if (res.data.code == 200) {
						this.dialogVisible = false;
						this.queryList();
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
						message: '新增员工失败',
						type: 'error'
					});
				})
			},
			getDepartment() {
				// let param = {};
				let params = {
					"orgType": 2
				}
				this.axios.post('/perTaxToolTwo/hr/org/findOrgList', params).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hr/org/findOrgList', params).then(res => {
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
						message: '获取部门失败',
						type: 'error'
					});
				})
			},
			getPosition(val) {
				// let param = {};
				let params = {
					"orgId": val
				}
				this.axios.post('/perTaxToolTwo/hr/org/findPosnList', params).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hr/org/findOrgList', params).then(res => {
					if (res.data.code == 200) {
						this.positionList = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取职位失败',
						type: 'error'
					});
				})
			},
		},
		created() {
			this.queryList();
			this.getDepartment();
		}
	}
</script>

<style scoped lang="less">
	.main_contain {
		width: 100%;
		height: 100%;
		// padding: 20px;
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
			width: 1.5rem;
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
			width: 1.5rem;
			height: 0.4rem;
			line-height: 0.4rem;
			background: #ed878e;
			color: #fff;
			display: inline-block;
			text-align: center;
			border-radius: 4px;
		}
	}

	.contain_header {}

	.contain_body {
		position: relative;
		// padding-top:10px;
		background: #fff;
		margin: 20px 20px;

		h3 {
			height: 40px;
			line-height: 40px;
			padding-left: 20px
		}

	}

	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
	}

	/deep/ .el-table table {
		background-color: rgb(243, 246, 249);
		border-collapse: separate;
		border-spacing: 0px 3px;
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

	/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
		border-bottom-color: #fff;
		background: #ebf6fb;
	}
</style>
