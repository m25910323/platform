<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>系统管理</el-breadcrumb-item>
			<el-breadcrumb-item>人资配置</el-breadcrumb-item>

			<el-breadcrumb-item>单据类型</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="contain_body">
			<div style="background: #fff;height:45px;padding:15px 12px 0px;">
				<el-input placeholder="搜索" v-model="keywords" prefix-icon="el-icon-search" style='width: 200px;' size="mini"
				 clearable>



				</el-input>
				<el-button size="mini" type="text" @click="search()" style='margin-left: 8px;margin-right: 20px;'>搜索</el-button>
				<el-button type="danger" size='mini' icon="el-icon-delete" :disabled="canEidt" @click='deleteMulti' style='margin-bottom: 0.2rem;float: right;'>批量删除</el-button>
				<el-button type="primary" size='mini' icon="el-icon-circle-plus-outline" @click='add' style='margin-bottom: 0.2rem;float: right;margin-right: 12px;'>新增</el-button>
				
			</div>

			<!-- <el-input v-model="keywords" size='mini' style='width: 120px;'></el-input> -->

			<el-table :data="tableList" v-loading='loading' @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="50"></el-table-column>

				<el-table-column align="" label="类型名称" prop="holidayTypeName" :resizable="false" width="140"></el-table-column>
				<el-table-column align="" label="天数" prop="holidayDays" :resizable="false" width="80"></el-table-column>
				<el-table-column align="" label="类型描述" prop="holidayDescription" :resizable="false"></el-table-column>
				<el-table-column align="center" prop="holidayArchivesBool" :resizable="false" width="120">
					<template slot="header" slot-scope="scope">
						<span>是否档案管理</span>
					</template>
					<template slot-scope="scope">
						<span>{{scope.row.holidayArchivesBool == 1?'是':'否'}}</span>
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
			<!-- <el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination> -->


		</div>


		<el-dialog width="50%" :title="tag == 'edit'?'编辑请假单类型':'新增请假单类型'" :visible.sync="dialogVisible" :before-close="handleClose">
			<el-form ref="form" :model="form" label-width="70px" size="mini" label-position="left">
				<el-form-item label="类型名称">
					<el-input v-model="form.holidayTypeName" :disabled="tag=='add'?false:true" placeholder="*请填写信息！"></el-input>
					<!-- <span>*请填写信息！</span> -->
				</el-form-item>
				<el-form-item label="天数">
					<el-input v-model="form.holidayDays" :disabled="tag=='add'?false:true" placeholder="*请假类型的默认天数"></el-input>
				</el-form-item>
				<el-form-item label="类型说明">
					<el-input v-model="form.holidayDescription" type='textarea' placeholder="*请假单的类型描述说明"></el-input>
				</el-form-item>
				<el-checkbox name="type" v-model="form.holidayArchivesBool" :true-label='selected' :false-label='unselected'>是否档案管理</el-checkbox>
				<!-- <el-form-item label="档案模板" style='width: 100%;'> -->
				<!-- <el-input v-model="form.holidayArchivesTemplate" type='textarea'></el-input> -->

				<!-- </el-form-item> -->
				<editor-bar v-model="form.holidayArchivesTemplate" :content="form.holidayArchivesTemplate" @on-change="change"
				 v-show='form.holidayArchivesBool'></editor-bar>

			</el-form>
			<div class='btn_contain clearfix' style="text-align: center;margin-top: 0.36rem;">
				<span class='commit' @click="commit">保存提交</span>
				<span class='close' @click="cancel">取消</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import EditorBar from '@/components/common/edit'
	export default {
		name: "customer",
		data() {
			return {
				selected: 1,
				unselected: 0,
				keywords: '',
				tag: 'add',
				value1: '',
				value2: '',
				multipleSelection: [],
				loading: false,
				formInline: {
					bankname: '',
					customername: ''
				},
				bankname: '',
				customername: '',
				form: {
					holidayTypeName: '',
					holidayArchivesBool: '',
					holidayDays: '',
					holidayDescription: '',
					holidayArchivesTemplate: '',
					holidayTypeId: ''
				},
				currentPage: 1,
				pageSize: 13,
				total: 0,
				tableList: [],

				dialogVisible: false,
				canEidt: true,
				model: {
					content: ''
				}
			}
		},
		components: {
			EditorBar
		},
		methods: {
			queryListByPage() {
				let param = {
					keywords: this.keywords
				};
				this.axios.post('/perTaxToolTwo/attendanceholidaytypeController/getPageList?pageIndex=' + this.currentPage +
					'&rows=' + this.pageSize, param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.total = res.data.data.total;
						this.tableList = res.data.data.rows;
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

			add() {
				this.tag = 'add';
				this.dialogVisible = true;
			},

			commit() {
				switch (this.tag) {
					case 'add':
						var url = '/perTaxToolTwo/attendanceholidaytypeController/insert';
						break;
					case 'edit':
						var url = '/perTaxToolTwo/attendanceholidaytypeController/update'
						break;
				}
				let param = this.form;
				this.axios.post(url, param).then(res => {

					if (res.data.code == 200) {
						this.resetForm();
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
						message: '批量删除失败',
						type: 'error'
					});
				})
			},
			cancel() {
				this.resetForm();
				this.dialogVisible = false;
			},
			resetForm() {
				this.form = {
					holidayTypeName: '',
					holidayArchivesBool: '',
					holidayDays: '',
					holidayDescription: '',
					holidayArchivesTemplate: '',
					holidayTypeId: ""
				}
			},
			search() {
				this.queryListByPage()
			},
			handleClose() {

				this.resetForm();
				this.dialogVisible = false;
			},
			handleCancel(index, row) {},
			handleEdit(index, row) {
				this.tag = 'edit';
				this.dialogVisible = true;
				this.form = row;
			},
			handleDel(index, row) {
				this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = [{
						"holidayTypeId": row.holidayTypeId
					}];
					this.axios.post('/perTaxToolTwo/attendanceholidaytypeController/delete', param).then(res => {
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

			handleCurrentChange(val) {},

			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			deleteMulti() {
				this.$confirm('确定批量删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = this.multipleSelection;
					this.axios.post('/perTaxToolTwo/attendanceholidaytypeController/delete', param).then(res => {
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
			change(val) {
				this.form.holidayArchivesTemplate = val;
			}
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

	.el-dialog .el-form {}

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
