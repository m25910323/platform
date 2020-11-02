<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>人员角色分配表</div>
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
					<el-form-item label="员工工号:">
						<el-input v-model='formInline.userName' clearable></el-input>
					</el-form-item>
					<el-form-item label="员工姓名:">
						<el-input v-model='formInline.userNickName' clearable></el-input>
					</el-form-item>
					<el-form-item label="角色:">
						<el-select v-model='formInline.roleId' clearable>
							<el-option v-for='item in roleList' :label="item.roleName" :value="item.roleId" :key='item.roleId'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click='search' size="mini">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="contain_body">
				<el-table :data="detail" style="width: 100%" stripe border v-loading='loading'>
					<!-- <el-table-column type="selection" width="50"></el-table-column> -->
					<el-table-column align="center" label="工号" prop="userName" :resizable="false" width="200"></el-table-column>
					<el-table-column align="center" label="员工姓名" prop="userNickName" :resizable="false" width="200"></el-table-column>
					<el-table-column align="center" label="角色" prop="roleId" :resizable="false">
						<template slot-scope="scope">
							<span v-for='(item,index) in scope.row.roleList'>{{item.roleName}}<i v-show='index != scope.row.roleList.length - 1'>,</i></span>
						</template>
					</el-table-column>
					<el-table-column align="center" width="260" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>角色分配（支持统一分配）</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="primary" @click="handleEdit(scope.$index, scope.row)">分配</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- <el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '4')})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination> -->
			</div>
		</div>
		<el-dialog title="" :visible.sync="dialogTableVisible" width="8rem">
			<el-table :data="roleList" row-key='roleId' border stripe @selection-change="handleSelectionChange" ref='multipleTable'>
				<el-table-column align="center" type="selection" width="55"></el-table-column>
				<el-table-column align="center" property="roleName" label="角色"></el-table-column>
				<el-table-column align="center" property="remark" label="备注"></el-table-column>
			</el-table>
			<div class='btn_contain clearfix'>
				<span class='commit' @click='modifyRole'>完成</span>
				<span class='close' @click="hideDialog">关闭</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				loading:false,
				message: "12334456",
				formInline: {
					userName: '',
					userNickName: '',
					roleId: ''
				},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				detail: [],
				roleList: [],
				gridData: [{
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '2016-05-04',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '2016-05-03',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}],
				dialogTableVisible: false,
				userId: ''
			}
		},
		components: {},
		methods: {
			findRoleList() {
				console.log(document.cookie);
				this.axios.get('/perTaxToolTwo/e9z/configUserRole/findRoleList').then(res => {
					if (res.data.code == 200) {
						this.roleList = res.data.data;
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
			findUserRoleList() {
				let params = this.formInline;
				this.axios.post('/perTaxToolTwo/e9z/configUserRole/findUserRoleList', params).then(res => {
					this.loading = false;
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
						message: '获取用户列表失败',
						type: 'error'
					});
				})
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			search() {
				this.loading = true;
				this.findUserRoleList()
			},
			handleEdit(index, row) {
				this.dialogTableVisible = true;
				this.userId = row.userId;
				this.$nextTick(function() {
					if (row) {
						row.roleList.forEach(({
							roleId
						}) => {
							const id = this.roleList.findIndex(item => item.roleId === roleId)
							this.$refs.multipleTable.toggleRowSelection(this.roleList[id], true);
						});
					} else {
						this.$refs.multipleTable.clearSelection();
					}
				})

			},
			hideDialog() {
				this.dialogTableVisible = false;
				this.$refs.multipleTable.clearSelection();
			},
			modifyRole() {
				if(this.multipleSelection.length == 0){
					var params = [{
						"userId":this.userId
					}];
				}else{
					this.multipleSelection.forEach((item, index) => {
						item.userId = this.userId;
					})
					var params = this.multipleSelection;
				}
				
				this.axios.post('/perTaxToolTwo/e9z/configUserRole/saveUserRoleList', params).then(res => {
					this.$refs.multipleTable.clearSelection();
					if (res.data.code == 200) {
						this.dialogTableVisible = false;
						this.findUserRoleList();
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
					this.$refs.multipleTable.clearSelection();
					this.$message({
						message: '保存用户角色失败',
						type: 'error'
					});
				})
			}
		},
		created() {
			this.findRoleList();
			this.findUserRoleList();
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

	.contain_header {
		height: 2rem;
		padding: 0px 30px;
		background: url(../../assets/img/list-bg1.png) no-repeat;
		background-size: cover;
		border-top-left-radius: 0.06rem;
		border-top-right-radius: 0.06rem;

		/deep/ input::-webkit-input-placeholder {
			/* placeholder颜色  */
			color: #fff;
		}
		/deep/ .el-select__caret{
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
