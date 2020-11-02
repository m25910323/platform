<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>系统管理</el-breadcrumb-item>
			<el-breadcrumb-item>档案类别</el-breadcrumb-item>
		</el-breadcrumb>

		<div class='main_contain'>
			<!-- <p>{{customerName}}</p> -->
			<div style="text-align: center;" class="clearfix">

				<el-button class="el-icon-delete" type='text' size="mini" @click='handleDelete("mul")' style='float:right' :disabled="multipleSelection.length <= 0">删除</el-button>

				<el-button class="el-icon-refresh" type='text' size="mini" @click='refresh()' style='float:right;margin-right: 12px;'>刷新</el-button>
				
				<el-button class="el-icon-plus" type='text' size="mini" @click='add()' style='float:right'>新增</el-button>
			</div>


			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" border v-loading='loading' @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="55"></el-table-column>
				<el-table-column align="center" label="类别" prop="parentName"></el-table-column>
				<el-table-column align="center" label="类别编号" prop="categoryrNumber"></el-table-column>

				<el-table-column align="center" label="类别名称" prop="categoryrName"></el-table-column>
				<el-table-column align="center" label="保管年限" prop="storageLimit"></el-table-column>
				<el-table-column align="center" label="备注" prop="remark1"></el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click='handleModify(scope.row)'>编辑</el-button>
						<el-button type="text" size="mini" @click='handleDelete(scope.row)'>删除</el-button>
					</template>
				</el-table-column>


			</el-table>



			<!-- <p style="text-align: right;margin-top: 20px;"><span style="margin-right: 20px;">凭证数：{{tvoucherCount}}</span> <span>附件数：{{fattachments}}</span></p> -->
		</div>

		<el-dialog title="新增" :visible.sync="dialogVisible" width="320px" :before-close="hideDialog" :modal-append-to-body="false">
			<el-form ref="form" :model="detail" label-width="80px" size="mini" inline="true">
				<el-form-item label="类别">
					<el-select v-model="detail.parentId" placeholder="请选择" filterable>

						<el-option v-for="item in categoryType" :label="item.categoryrName" :value='item.categoryrId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类别编号">
					<el-input v-model="detail.categoryrNumber"></el-input>
				</el-form-item>
				<el-form-item label="类别名称">
					<el-input v-model="detail.categoryrName"></el-input>
				</el-form-item>


				<el-form-item label="保管年限">
					
					<el-select v-model="detail.storageLimit" placeholder="请选择" filterable>
					
						<el-option label="5年" value='5年'></el-option>
						<el-option label="10年" value='10年'></el-option>
						<el-option label="15年" value='15年'></el-option>
						<el-option label="永久" value='永久'></el-option>
						<el-option label="其他" value='其他'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="detail.remark1"></el-input>

				</el-form-item>



			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog">取 消</el-button>
				<el-button type="primary" @click="commitAdd">确 定</el-button>
			</span>


		</el-dialog>

		<el-dialog title="编辑" :visible.sync="dialogVisible1" width="320px" :before-close="hideDialog1" :modal-append-to-body="false">
			<el-form ref="form" :model="detail1" label-width="80px" size="mini" inline="true">
				<el-form-item label="类别">
					<el-select v-model="detail1.parentId" placeholder="请选择" filterable>
		
						<el-option v-for="item in categoryType" :label="item.categoryrName" :value='item.categoryrId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类别编号">
					<el-input v-model="detail1.categoryrNumber"></el-input>
				</el-form-item>
				<el-form-item label="类别名称">
					<el-input v-model="detail1.categoryrName"></el-input>
				</el-form-item>
		
		
				<el-form-item label="保管年限">
					
					<el-select v-model="detail1.storageLimit" placeholder="请选择" filterable>
					
						<el-option label="5年" value='5年'></el-option>
						<el-option label="10年" value='10年'></el-option>
						<el-option label="15年" value='15年'></el-option>
						<el-option label="永久" value='永久'></el-option>
						<el-option label="其他" value='其他'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" v-model="detail1.remark1"></el-input>
		
				</el-form-item>
		
		
		
			</el-form>
		
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog1">取 消</el-button>
				<el-button type="primary" @click="commitModify">确 定</el-button>
			</span>
		
		
		</el-dialog>
		
	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {

				loading: false,
				uploadData: {

				},
				tableData: [],
				detail: {},
				detail1: {},
				dialogVisible: false,
				dialogVisible1: false,
				pdfUrl: '',
				multipleSelection: [],
				categoryType:[]
			}
		},
		components: {},
		methods: {
			hideDialog() {
				this.detail = {};
				this.dialogVisible = false;

			},
			hideDialog1() {
				this.detail1 = {};
				this.dialogVisible1 = false;

			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

			refresh() {

				this.queryPage();
			},

			// row == 'mul'  批量
			// row != 'mul'  单条
			handleDelete(row) {
				this.$confirm('确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					if (row == 'mul') {
						var params = this.multipleSelection;
					} else {
						var params = [{
							"categoryrId": row.categoryrId
						}];
					}
					this.axios.post('/perTaxToolTwo/ArchivesCategoryInfo/deleteArchivesCategoryInfo', params)
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							if (res.data.code == 200) {
								this.queryPage();
								this.$message({
									message: res.data.msg,
									type: "success"
								});
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
						})
						.catch(err => {
							this.$message({
								message: "系统繁忙，请稍后重试",
								type: "error"
							});
						});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},


			queryPage() {
				this.loading = true;
				let params = {
					categoryrId: null
				};
				this.axios.post('/perTaxToolTwo/ArchivesCategoryInfo/getArchivesCategoryInfoList', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data;

							this.$message({
								message: res.data.msg,
								type: 'success'
							});
						} else {
							this.loading = false;
							this.tableData = [];
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
					})
					.catch(err => {
						this.tableData = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},

			add() {
				this.dialogVisible = true;
			},
			handleModify(row) {
				this.dialogVisible1 = true;
				this.detail1 = JSON.parse(JSON.stringify(row))
			},
			commitAdd() {
				let params = {
					parentId: this.detail.parentId,
					categoryrNumber: this.detail.categoryrNumber,
					categoryrName: this.detail.categoryrName,
					storageLimit: this.detail.storageLimit,
					remark1: this.detail.remark1,
				};
				this.axios.post('/perTaxToolTwo/ArchivesCategoryInfo/addArchivesCategoryInfo', params)
					.then(res => {
						if (res.data.code == 200) {
							this.queryPage();
							this.dialogVisible = false;
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
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
					})
					.catch(err => {
						this.tableData = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			
			commitModify() {
				let params = {
					categoryrId:this.detail1.categoryrId,
					parentId: this.detail1.parentId,
					categoryrNumber: this.detail1.categoryrNumber,
					categoryrName: this.detail1.categoryrName,
					storageLimit: this.detail1.storageLimit,
					remark1: this.detail1.remark1,
				};
				this.axios.post('/perTaxToolTwo/ArchivesCategoryInfo/updateArchivesCategoryInfo', params)
					.then(res => {
						if (res.data.code == 200) {
							this.queryPage();
							this.dialogVisible1 = false;
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
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
					})
					.catch(err => {
						this.tableData = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			
			getArchivesParentCategoryInfo(){
				let params = {
					"categoryrId":""
				};
				this.axios.post('/perTaxToolTwo/ArchivesCategoryInfo/getArchivesParentCategoryInfo', params)
					.then(res => {
						if (res.data.code == 200) {
							this.categoryType = res.data.data;
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
					})
					.catch(err => {
						this.tableData = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
				
			}
		},
		computed: {},
		created() {
			this.queryPage();
			this.getArchivesParentCategoryInfo()
		}
	}
</script>

<style lang='less' scoped>
	.main {
		/* background: #fff; */
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		.el-breadcrumb {
			height: 40px;
			line-height: 39px;
			padding-left: 20px;
			/* background-color: #fff; */
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box
		}

		/deep/ .el-table td,
		/deep/ .el-table th {
			padding: 6px 0;
		}

		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 30px;
			background-color: #f9f9f9;
		}

		/deep/ .el-table th {
			background-color: #f9f9f9;
		}

		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #f9f9f9;
		}

		/deep/ .el-table__body tr,
		.el-table__body td {
			padding: 0;
			height: 30px;
			background-color: #fff;
		}

		/deep/ .el-table__body tr.el-table__row--striped {
			background-color: #f9f9f9;
		}

		/deep/ .el-table thead {
			color: #8C8C8C;
		}





		.main_contain {
			background: #fff;
			margin: 0px 20px 20px;
			padding: 12px 20px 20px;
			/* height: calc(100% - 190px); */

		}

		/deep/ .el-dialog {
			/deep/ .el-form-item__content {
				width: 180px;
			}

			/deep/ .el-date-editor.el-input {
				width: 180px;
			}
		}
	}
</style>
