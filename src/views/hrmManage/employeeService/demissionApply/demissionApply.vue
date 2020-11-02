<template>
	<div class="main_contain">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>行政管理</el-breadcrumb-item>
			<el-breadcrumb-item>员工服务</el-breadcrumb-item>

			<el-breadcrumb-item>离职申请</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body">
			<h3>离职申请
				<el-button type="primary" size='mini' icon="el-icon-circle-plus-outline" @click='add' style='float: right;margin-top:6px;margin-right: 12px;'>申请</el-button>
			</h3>


			<el-table :data="detail" style="width: 100%;" v-loading='loading'>
				<!-- <el-table-column type="selection" width="50"></el-table-column> -->
				<el-table-column align="center" label="工号" prop="userCode" :resizable="false"></el-table-column>
				<el-table-column align="center" label="姓名" prop="userName" :resizable="false"></el-table-column>

				<el-table-column align="center" label="部门" prop="orgName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="离职原因" prop="quitReason" width="200" :resizable="false"></el-table-column>
				<el-table-column align="center" label="离职时间" prop="quitTime" width="120" :resizable="false"></el-table-column>
				<el-table-column align="center" label="申请时间" prop="applyTime" :resizable="false"></el-table-column>
				<el-table-column align="center" label="申请状态" :resizable="false">
					<template slot-scope="scope">
						<span v-if="scope.row.quitState == 0">部门负责人审核中</span>
						<span v-if="scope.row.quitState == 1">资料交接中</span>
						<span v-if="scope.row.quitState == 2">IT交接中</span>
						<span v-if="scope.row.quitState == 3">人事交接中</span>
						<span v-if="scope.row.quitState == 4">财务交接中</span>
						<span v-if="scope.row.quitState == 5">离职完成</span>
					</template>
				</el-table-column>

			</el-table>

		</div>
		<el-dialog title="离职申请" :visible.sync="dialogVisible" width="400px">
			<el-form ref="form1" :model="form1" label-width="80px" size="mini">

				<el-form-item label="离职时间">
					<el-date-picker v-model="form1.quitTime" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" placeholder="请选择"></el-date-picker>
				</el-form-item>
				<el-form-item label="离职原因">
					<el-input v-model="form1.quitReason"></el-input>
				</el-form-item>
				

			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideAddDialog" size="mini">取 消</el-button>
				<el-button type="primary" @click="addInduction" size="mini">确 定</el-button>
			</span>
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
			}
		},
		components: {},
		methods: {
			queryList() {
				let params = {};
				this.axios.post('/perTaxToolTwo/hrEmpQuitOpt/findHrEmpQuitOptPage', params).then(res => {
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

				this.axios.post('/perTaxToolTwo/hrEmpQuitOpt/saveOrUpdateHrEmpQuitOpt', params).then(res => {
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
			}
		},
		created() {
			this.queryList();
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
