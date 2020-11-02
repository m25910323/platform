<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>系统管理</el-breadcrumb-item>
			<el-breadcrumb-item>人资配置</el-breadcrumb-item>

			<el-breadcrumb-item>盘库配置</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="contain_body">
			<div style="background: #fff;height:45px;padding:15px 12px 0px;">
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="100px">
					<el-form-item label="库位号种类" prop="dossierName">
						<el-select v-model="uploadData.saveMaterialTypeId" placeholder="请选择" clearable filterable>
												
							<el-option v-for="item in saveMaterialTypeList" :label="item.saveMaterialTypeName" :value='item.saveMaterialTypeId'></el-option>
						</el-select>
					</el-form-item>
					<el-button size="mini" type="text" @click="search()" style='margin-left: 8px;margin-right: 20px;'>搜索</el-button>
					<el-button type="primary" size='mini' icon="el-icon-circle-plus-outline" @click='add' style='margin-bottom: 0.2rem;float: right;margin-right: 12px;'>新增</el-button>
				</el-form>
				<!--  -->
				<!-- <el-button type="danger" size='mini' icon="el-icon-delete" :disabled="canEidt" @click='deleteMulti' style='margin-bottom: 0.2rem;float: right;'>批量删除</el-button> -->
				

			</div>

			<!-- <el-input v-model="keywords" size='mini' style='width: 120px;'></el-input> -->

			<el-table :data="tableList" v-loading='loading' @selection-change="handleSelectionChange">
				<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->

				<!-- <el-table-column align="center" label="盘库任务" prop="holidayTypeName" :resizable="false"></el-table-column> -->
				<el-table-column align="center" label="库位号种类" prop="saveMaterialTypeName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="盘点开始时间" prop="checkStartTime" :resizable="false"></el-table-column>
				<el-table-column align="center" label="盘点结束时间" prop="checkEndTime" :resizable="false"></el-table-column>
				<el-table-column align="center" label="盘点人" prop="checkPersonName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="状态" prop="holidayArchivesBool" :resizable="false">

					<template slot-scope="scope">
						<span v-show='scope.row.state == 0'>未启动</span>
						<span v-show='scope.row.state == 1'>已启动</span>
						<span v-show='scope.row.state == 2'>已完成</span>
						<span v-show='scope.row.state == 3'>超时</span>
					</template>
				</el-table-column>
				
				<el-table-column align="center" label="创建人" prop="createPersonName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="创建时间" prop="createTime" :resizable="false"></el-table-column>
				
				<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>
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


		<el-dialog width="400px" :title="tag == 'edit'?'编辑':'新增'" :visible.sync="dialogVisible" :before-close="handleClose">
			<el-form ref="form" :model="form" label-width="100px" size="mini" label-position="left">
				<el-form-item label="存放类型">
					<el-select v-model="form.saveMaterialTypeId" placeholder="请选择" clearable filterable>
						<el-option v-for="item in saveMaterialTypeList" :label="item.saveMaterialTypeName" :value='item.saveMaterialTypeId'></el-option>
					</el-select>
					<!-- <span>*请填写信息！</span> -->
				</el-form-item>
				<el-form-item label="盘点开始时间	">
					<el-date-picker v-model="form.checkStartTime" align="right" type="date" placeholder="请选择" format="yyyy-MM-dd"
					 value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="盘点结束时间	">
					<el-date-picker v-model="form.checkEndTime" align="right" type="date" placeholder="请选择" format="yyyy-MM-dd"
					 value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="盘点人">
					<el-select v-model="form.checkPersonList" multiple placeholder="请选择">
						<el-option v-for="item in detail" :key="item.userCode" :label="item.userName" :value="item.userCode">
						</el-option>
					</el-select>
					
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="form.remark" placeholder="请输入"></el-input>
					<!-- <span>*请填写信息！</span> -->
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="commit">确 定</el-button>
			</span>
			<!-- <div class='btn_contain clearfix' style="text-align: center;margin-top: 0.36rem;">
				<span class='commit' @click="commit">保存提交</span>
				<span class='close' @click="cancel">取消</span>
			</div> -->
		</el-dialog>
	</div>
</template>

<script>
	import EditorBar from '@/components/common/edit'
	export default {
		name: "customer",
		data() {
			return {
				detail:{},
				uploadData:{},
				saveMaterialTypeId:null,
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
				},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],

				dialogVisible: false,
				canEidt: true,
				model: {
					content: ''
				},
				saveMaterialTypeList:[],
				options: [{
				          value: '选项1',
				          label: '黄金糕'
				        }, {
				          value: '选项2',
				          label: '双皮奶'
				        }, {
				          value: '选项3',
				          label: '蚵仔煎'
				        }, {
				          value: '选项4',
				          label: '龙须面'
				        }, {
				          value: '选项5',
				          label: '北京烤鸭'
				        }],
			}
		},
		components: {
			EditorBar
		},
		methods: {
			queryListByPage() {
				let param = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						"saveMaterialTypeId": this.saveMaterialTypeId?this.saveMaterialTypeId:null,
						// "state": null
					}
				};
				this.axios.post('/perTaxToolTwo/columbusNew/CheckMaterial/getCheckConfigListByPage', param).then(res => {
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
						var url = '/perTaxToolTwo/columbusNew/CheckMaterial/insertCheckConfig';
						break;
					case 'edit':
						var url = '/perTaxToolTwo/columbusNew/CheckMaterial/upDateCheckConfig'
						break;
				}
				this.form.checkPerson = this.form.checkPersonList.join(',');
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
				}
			},
			search() {
				this.saveMaterialTypeId = this.uploadData.saveMaterialTypeId;
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
				this.form = JSON.parse(JSON.stringify(row));
			},
			handleDel(index, row) {
				this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = {
						"checkConfigId": row.checkConfigId
					};
					this.axios.post('/perTaxToolTwo/columbusNew/CheckMaterial/deleteCheckConfig', param).then(res => {
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
			
			getSaveMaterialType() {
				let params = {};
				this.axios.post('/perTaxToolTwo/columbusNew/storageLocation/selectSaveMaterialType', params).then(res => {
					if (res.data.code == 200) {
						this.saveMaterialTypeList = res.data.data;
					} else {
						let type;
						if (res.data.code == 0) {
							type = "warning";
						} else if (res.data.code == 500) {
							type = "error";
						}
						this.$message({
							message: res.data.msg,
							type: type
						});
					}
			
				}).catch(function(err) {
					this.$message({
						message: '获取存放资料类型失败',
						type: 'error'
					});
				})
			},
			queryList() {
				let params = {
					"page": 1,
					"row": 999,
					"data": {
						type:0
					}
				}
				this.axios.post('/perTaxToolTwo/hrEmpInfo/findHrEmpInfoPage', params).then(res => {
				// this.axios.post('/sl/perTaxToolTwo/hrEmpInfo/findHrEmpInfoPage', params).then(res => {
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
						message: '获取角色列表失败',
						type: 'error'
					});
				})
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
			this.queryListByPage();
			this.getSaveMaterialType();
			this.queryList();
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
