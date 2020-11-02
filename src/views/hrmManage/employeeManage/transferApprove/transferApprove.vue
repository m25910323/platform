<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>转岗审批</div>
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">

					<el-form-item label="姓名:">
						<el-input v-model='formInline.userNickName' clearable></el-input>
					</el-form-item>

					<el-form-item>
						<el-button @click='search' size="mini">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="contain_body">
				<el-table :data="detail" style="width: 100%" stripe border v-loading='loading'>
					<!-- <el-table-column type="selection" width="50"></el-table-column> -->
					<el-table-column align="center" label="申请人工号" prop="auserCode" :resizable="false"></el-table-column>
					<el-table-column align="center" label="申请人姓名" prop="auserName" :resizable="false"></el-table-column>

					<el-table-column align="center" label="申请人部门" prop="adepartment" :resizable="false"></el-table-column>
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
					<el-table-column align="center" label="一级审批人" prop="userName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="二级审批人" prop="userNameNext" :resizable="false"></el-table-column>
					<el-table-column align="center" label="审批时间" prop="approveTime" :resizable="false"></el-table-column>
					<el-table-column align="center" label="驳回理由" prop="rejectReassignmenReasons" :resizable="false"></el-table-column>
					<el-table-column align="center" label="生效时间" prop="effectTime" :resizable="false"></el-table-column>
					<el-table-column align="center" width="200" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handlePass(scope.$index, scope.row)">通过</el-button>
							<el-button size="mini" type="text" @click="handleNopass(scope.$index, scope.row)">不通过</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- <el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '4')})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination> -->
			</div>
		</div>

	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				loading: false,
				message: "12334456",
				userName: '',
				orgId: '',
				formInline: {
					userName: '',
					userNickName: '',
					roleId: ''
				},
				form: {},
				form1: {},

				currentPage: 1,
				pageSize: 10,
				total: 0,
				detail: [],
				optionList: [{
						label: '同意',
						value: 1
					},
					{
						label: '不同意',
						value: 0
					}
				],
				roleList: [],

				dialogVisible: false,
				userId: '',
				value: '',

				activeValue: 1,
				inactiveValue: 0
			}
		},
		components: {},
		methods: {
			queryList() {
				this.loading = true;
				let params = {
					"data": {
						"pageNum": this.currentPage,
						"pageSize": this.pageSize,
						"isApprove": 1
					}
				};
				this.axios.post('/perTaxToolTwo/attendanceApplicationForReassignmentController/get', params).then(res => {
					this.loading = false;
					// this.axios.post('/sl/perTaxToolTwo/hrEmpQuitOpt/examineAndApproveTask',params).then(res => {
					if (res.data.code == 200) {

						this.detail = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取申请离职列表失败',
						type: 'error'
					});
				})
			},


			search() {
				this.userName = this.formInline.userNickName;
				this.queryList();
			},
			handlePass(index, row) {
				let params = row;
				params.docStatus = 2;
				this.axios.post('/perTaxToolTwo/attendanceApplicationForReassignmentController/approve', params).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hrEmpQuitOpt/examineAndApproveTask',params).then(res => {
					if (res.data.code == 200) {
						this.queryList()
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '审批失败',
						type: 'error'
					});
				})

				// this.userId = row.userId;


			},

			handleNopass(index, row) {
				
				this.$prompt('请输入驳回理由', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({
					value
				}) => {
					let params = row;
					params.docStatus = -1;
					params.rejectReassignmenReasons = value;
					this.axios.post('/perTaxToolTwo/attendanceApplicationForReassignmentController/approve', params).then(res => {
						// this.axios.post('/sl/perTaxToolTwo/hrEmpQuitOpt/examineAndApproveTask',params).then(res => {
						if (res.data.code == 200) {
							this.queryList()
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}
					
					}).catch(function(err) {
						this.$message({
							message: '审批失败',
							type: 'error'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});


			},




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
		padding: 20px;
		box-sizing: border-box;

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
			margin-right: 0.2rem;
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
	}

	.contain_header {
		height: 2rem;
		padding: 0px 30px;
		background: url(../../../../assets/img/list-bg1.png) no-repeat;
		background-size: cover;
		border-top-left-radius: 0.06rem;
		border-top-right-radius: 0.06rem;

		/deep/ input::-webkit-input-placeholder {
			/* placeholder颜色  */
			color: #fff;
		}

		/deep/ .el-select__caret {
			color: #fff
		}

		.title {
			font-size: 0.24rem;
			height: 1rem;
			line-height: 1.24rem;
			color: #fff;
		}

		/deep/ .el-button {
			color: #43b3db;
		}

		/deep/ .el-range-input {
			color: #fff;
			background: transparent
		}

		/deep/ .el-range-separator {
			color: #fff;
		}

		/deep/ .el-range__icon {
			color: #fff;
		}

		/deep/ .el-form-item--mini .el-form-item__label {
			color: #fff;
		}

		/deep/ .el-form {
			margin-top: 0.1rem
		}

		/deep/ .el-input__inner {
			background: transparent;
			color: #fff;
			border: 1px solid #fff;
		}

		/deep/ .el-input__inner:hover {
			border-color: #fff;
		}

		/deep/ .el-input.is-active .el-input__inner,
		/deep/ .el-input__inner:focus {
			border-color: #fff;
			outline: 0;
		}
	}

	.contain_body {
		padding: 0.2rem 0.2rem;
		background: #fff;

	}

	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
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

	/deep/ .el-table th {
		background-color: #ebf6fb;
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
</style>
