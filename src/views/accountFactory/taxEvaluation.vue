<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>税种鉴定</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="contain_body">
			<div style="background: #fff;height:45px;padding:15px 12px 0px;">
				<!-- <el-input placeholder="搜索" v-model="keywords" prefix-icon="el-icon-search" style='width: 200px;' size="mini"
				 clearable>



				</el-input> -->
				<el-select v-model="uploadData.customerId" placeholder="请选择客户" size="mini" clearable filterable>
					<el-option v-for="item in $store.state.cust" :key="item.customerId" :label="item.customerName" :value="item.customerId">
					</el-option>
				</el-select>
				
				
				<el-button size="mini" type="primary" @click="search()" style='margin-left: 8px;margin-right: 20px;'>搜索</el-button>
				<el-button type="danger" size='mini' icon="el-icon-delete" :disabled="canEidt" @click='deleteMulti' style='margin-bottom: 0.2rem;float: right;'>批量删除</el-button>
				<el-button type="primary" size='mini' icon="el-icon-circle-plus-outline" @click='add' style='margin-bottom: 0.2rem;float: right;margin-right: 12px;'>新增</el-button>
				
			</div>

			<!-- <el-input v-model="keywords" size='mini' style='width: 120px;'></el-input> -->

			<el-table :data="tableList" v-loading='loading' @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="50"></el-table-column>

				<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="税种鉴定" prop="taxIdentification" :resizable="false"></el-table-column>
				<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>
				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						
						
						<el-button size="mini" type="text" @click.stop="handleDel(scope.$index, scope.row)">删除</el-button>
						
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>


		</div>


		<el-dialog width="400px" :title="tag == 'edit'?'编辑':'新增'" :visible.sync="dialogVisible" :before-close="handleClose">
			<el-form ref="form" :model="form" label-width="70px" size="mini" label-position="left">
				<el-form-item label="客户名称">
					<el-select v-model="form.customerId" placeholder="请选择" clearable filterable  :disabled="tag=='add'?false:true">
						<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
						
					</el-select>
					
					<!-- <span>*请填写信息！</span> -->
				</el-form-item>
				<el-form-item label="税种鉴定">
					<el-input v-model="form.taxIdentification" :disabled="tag=='add'?false:true" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="form.remark" type='textarea' placeholder="请输入"></el-input>
				</el-form-item>
				

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
				uploadData: {
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
				pageSize: 10,
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
					page:this.currentPage,
					row:this.pageSize,
					data:{
						keywords: this.keywords
					}
					
				};
				this.axios.post('/perTaxToolTwo/e9zConfigTaxIdentificationController/queryListByPage', param).then(res => {
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
						var url = '/perTaxToolTwo/e9zConfigTaxIdentificationController/insert';
						break;
					case 'edit':
						var url = '/perTaxToolTwo/e9zConfigTaxIdentificationController/update'
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
						message: '操作失败',
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
				this.customerId = this.uploadData.customerId;
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
					let param = [row.id];
					this.axios.post('/perTaxToolTwo/e9zConfigTaxIdentificationController/delete', param).then(res => {
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

			handleCurrentChange(val) {
				this.currentPage = val;
			},

			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			deleteMulti() {
				this.$confirm('确定批量删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = [];
					this.multipleSelection.forEach(item => {
						param.push(item.id);
					})
					// let param = this.multipleSelection;
					this.axios.post('/perTaxToolTwo/e9zConfigTaxIdentificationController/delete', param).then(res => {
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
