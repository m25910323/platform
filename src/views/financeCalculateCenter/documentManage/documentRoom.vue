<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案管理中心</el-breadcrumb-item>
			<el-breadcrumb-item>资料管理</el-breadcrumb-item>
			<el-breadcrumb-item>库位号管理</el-breadcrumb-item>
			<el-breadcrumb-item>资料室</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body clearfix">

			<el-select v-model="uploadData.materialRoomId" placeholder="请选择" clearable filterable @change="selectMaterialCabinet">
				<el-option v-for="item in materialRoomList" :label="item.materialRoomName" :value='item.materialRoomId'></el-option>
			</el-select>

			<div class='clearfix'>
				<div v-for="item in materialCabinetList" class="materialCabinet" @click="showDialog(item)">
					<span>
						{{item.materialCabinetName}}
					</span>
				</div>
			</div>



		</div>
		<el-dialog :title="detail.materialCabinetName" :visible.sync="dialogVisible" width="1000px">
			<el-button type="primary" size="mini" @click='mulEdit'>批量录入</el-button>
			<el-button type="primary" size="mini" @click='mulClear'>批量清空</el-button>
			<div style="border: 1px solid #D3D3D3;margin-top: 12px;">
				<div class="clearfix">
					<div v-for='item in tableList[0].length' class='gridHead' :style="{ width: 'calc(100% / ' + tableList[0].length + ')'}">{{item}}</div>
				</div>
				<el-checkbox-group v-model="checkList">
					<div v-for='items in tableList' class="clearfix">

						<div v-for='item in items' :class="['grid','gridBg' + item.numberState]" :style="{ width: 'calc(100% / ' + tableList[0].length + ')'}">

							<el-checkbox :label="item.materialCabinetDetailId" v-show='item.numberState == 2 || item.numberState == 1' style="position: absolute;left:10px;top:10px">
							</el-checkbox>
							<p style="margin-top: 10px;">{{item.gridNo}}</p>
							<p>{{item.saveMaterialTypeName}}</p>
							<p v-show='item.numberState != 1'>容量{{item.usedNumber}}/{{item.number}}</p>
							<!-- <el-button type="text" size="mini" v-show='item.numberState == 2' @click='handleEdit(item)'>编辑</el-button> -->
							<el-button type="text" size="mini" v-show='item.numberState == 2' @click='clearGridBatch(item)'>清空</el-button>
							<el-button type="text" size="mini" v-show='item.numberState == 1' @click='handleEdit(item)'>录入</el-button>
						</div>


					</div>
				</el-checkbox-group>
			</div>
			<!-- <el-table :data="tableList" style="width: 100%;margin-top: 12px;" v-loading='loading' @selection-change="handleSelectionChange">
				
				<el-table-column align="center" v-for='item in tableList[0].length' :label="item" :prop="item" :resizable="false">
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					</template>
				</el-table-column>
				
			</el-table> -->
			<!-- <span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog">取 消</el-button>
				<el-button type="primary" @click="commitAddChild">确 定</el-button>
			</span> -->
			<!-- <div class='btn_contain clearfix'>
					<span class='commit' @click="commitAddChild">确认</span>
					<span class='close' @click="hideDialog">关闭</span>
		
				</div> -->

		</el-dialog>

		<el-dialog title="库位号录入" :visible.sync="dialogVisible2" width="4rem" :before-close="handleClose">
			<el-form ref="form" :model="form2" label-width="100px" size="mini">

				<el-form-item label="格子号">
					<el-input v-model="form2.gridNo" disabled></el-input>
				</el-form-item>
				<el-form-item label="存放资料类型">
					<el-select v-model='form2.saveMaterialType' clearable size="mini" @change="setArea" value-key="saveMaterialTypeId">
						<el-option v-for='item in saveMaterialTypeList' :label="item.saveMaterialTypeName" :value="item" :key='item.saveMaterialTypeId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="地区" v-show='isArea'>
					<el-cascader v-model="form2.region" :options="cascaderData" :props="optionAreaProps"></el-cascader>
				</el-form-item>
				<el-form-item label="每格容量">
					<el-input v-model="form2.number"></el-input>

				</el-form-item>
				<el-form-item label="库位容量">
					<el-input v-model="form2.storageLocationNumber"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog">取 消</el-button>
				<el-button type="primary" @click="commitAddChild">确 定</el-button>
			</span>


		</el-dialog>

		<el-dialog title="库位号录入" :visible.sync="dialogVisible3" width="4rem" :before-close="handleClose">
			<el-form ref="form" :model="form3" label-width="100px" size="mini">
				<el-form-item label="存放资料类型">
					<el-select v-model='form3.saveMaterialType' clearable size="mini" @change="setArea" value-key="saveMaterialTypeId">
						<el-option v-for='item in saveMaterialTypeList' :label="item.saveMaterialTypeName" :value="item" :key='item.saveMaterialTypeId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="地区" v-show='isArea'>
					<el-cascader v-model="form3.region" :options="cascaderData" :props="optionAreaProps"></el-cascader>
				</el-form-item>
				<el-form-item label="每格容量">
					<el-input v-model="form3.number"></el-input>

				</el-form-item>
				<el-form-item label="库位容量">
					<el-input v-model="form3.storageLocationNumber"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog1">取 消</el-button>
				<el-button type="primary" @click="commitAddChild1">确 定</el-button>
			</span>


		</el-dialog>


	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				checkList: [],
				cascaderData: [], //行政区字典表
				optionAreaProps: {
					value: 'regionName',
					label: 'regionName',
					children: 'child'
				}, //行政区规则
				isArea: '',
				saveMaterialTypeList: [],
				detail: {},
				materialCabinetList: [],
				materialRoomList: [],
				storageLocationModelList: [],
				uploadData: {},
				empInfo: [],
				form2: {},
				form3: {},
				orgId: null,
				multipleSelection: [],
				starttime: '',
				endtime: '',
				keywords: '',
				departList: [],
				loading: false,
				loading1: false,
				formInline: {
					orgName: '',
				},
				userName: '',
				orgName: '',
				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [
					[]
				],

				dialogVisible: false,
				dialogVisible3: false,
				dialogVisible2: false,

				defaultProps: {
					children: 'child',
					label: 'departmentName'
				},
				materialCabinetId: '',

			}
		},
		components: {},
		methods: {
			mulEdit() {
				this.dialogVisible3 = true;

				console.log(this.checkList);

			},
			setArea(val) {
				if (val.type == 1) {
					this.isArea = true;
				} else {
					this.isArea = false;
				}

			},
			showDialog(row) {
				this.dialogVisible = true;
				this.detail = JSON.parse(JSON.stringify(row));

				this.materialCabinetId = row.materialCabinetId;
				this.queryTable();
			},

			queryTable() {
				let params = {
					materialCabinetId: this.materialCabinetId
				};
				this.axios.post('/perTaxToolTwo/columbusNew/storageLocation/getGridDetailListByCabinetId', params).then(res => {
					if (res.data.code == 200) {
						this.tableList = res.data.data;
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
						message: '获取柜子失败',
						type: 'error'
					});
				})
			},
			hideDialog() {
				this.dialogVisible2 = false;
				this.reset();
			},
			hideDialog1() {
				this.dialogVisible3 = false;
				this.reset();
			},
			handleClose() {
				this.dialogVisible2 = false;
				this.reset();
			},

			reset() {
				this.form3 = {};
				this.form2 = {};
			},

			commitAddChild1() {
				if (this.form3.region) {
					this.form3.regionModel = this.form3.region.join('-');
				}
				this.form3.materialCabinetDetailIdList = this.checkList;
				this.form3.saveMaterialTypeId = this.form3.saveMaterialType.saveMaterialTypeId;
				let param = this.form3;
				// this.axios.post('/sl/perTaxToolTwo/hr/org/saveOrg', param).then(res => {
				this.axios.post('/perTaxToolTwo/columbusNew/storageLocation/setGridPropertyBatch', param).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible3 = false;
						this.checkList = [];
						this.queryTable();
						this.reset();
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
						message: '修改失败',
						type: 'error'
					});
				})
			},




			commitAddChild() {
				if (this.form2.region) {
					this.form2.regionModel = this.form2.region.join('-');
				}

				this.form2.saveMaterialTypeId = this.form2.saveMaterialType.saveMaterialTypeId;
				let param = this.form2;
				// this.axios.post('/sl/perTaxToolTwo/hr/org/saveOrg', param).then(res => {
				this.axios.post('/perTaxToolTwo/columbusNew/storageLocation/setGridProperty', param).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible2 = false;
						this.queryTable();
						this.reset();
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
						message: '修改失败',
						type: 'error'
					});
				})
			},


			selectMaterialCabinet(val) {
				if (val) {
					let params = {
						materialRoomId: val
					};
					this.axios.post('/perTaxToolTwo/columbusNew/storageLocation/selectMaterialCabinet', params).then(res => {
						if (res.data.code == 200) {
							this.materialCabinetList = res.data.data;
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
							message: '获取柜子失败',
							type: 'error'
						});
					})
				}
			},



			getMaterialRoom(data) {
				let params = {};
				this.axios.post('/perTaxToolTwo/columbusNew/storageLocation/selectMaterialRoom', params).then(res => {
					if (res.data.code == 200) {
						this.materialRoomList = res.data.data;
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
						message: '获取资料室失败',
						type: 'error'
					});
				})
			},
			handleEdit(item) {
				this.dialogVisible2 = true;
				this.form2 = JSON.parse(JSON.stringify(item));
			},
			clearGridBatch(row) {
				this.$confirm('确定清空?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = [row.materialCabinetDetailId];
					this.axios.post('/perTaxToolTwo/columbusNew/storageLocation/clearGridBatch', param)
						.then(res => {
							if (res.data.code == 200) {
								this.queryTable();
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
							this.$message({
								message: "系统繁忙，请稍后重试",
								type: "error"
							});
						});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},
			
			mulClear(){
				this.$confirm('确定清空?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = this.checkList;
					this.axios.post('/perTaxToolTwo/columbusNew/storageLocation/clearGridBatch', param)
						.then(res => {
							if (res.data.code == 200) {
								this.queryTable();
								this.checkList = [];
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
							this.$message({
								message: "系统繁忙，请稍后重试",
								type: "error"
							});
						});
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},

			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage();
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
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
			getProvince(val) {

				let idArea;
				let sizeArea;
				if (!val) {
					idArea = 0;
					sizeArea = 0;
				} else if (val.length === 1) {
					idArea = val[0];
					sizeArea = val.length; // 3:一级 4:二级 6:三级
				} else if (val.length === 2) {
					idArea = val[1];
					sizeArea = val.length; // 3:一级 4:二级 6:三级
				}
				this.axios.get('/perTaxToolTwo/columbusNew/config/getRegion.do')
					// this.axios.get('/perTaxToolTwo/columbusNew/config/getRegion.do?parentRegionCode=' + idArea)
					.then(res => {
						if (res.data.code == 200) {
							this.cascaderData = res.data.data;

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
			},

		},
		created() {
			// this.queryListByPage();
			this.getMaterialRoom();
			this.getSaveMaterialType();
			this.getProvince()
		}

	}
</script>

<style scoped lang='less'>
	.main_contain {
		width: 100%;
		height: 100%;
		padding: 0px;
		box-sizing: border-box;

		.materialCabinet {
			width: 200px;
			height: 250px;
			float: left;
			background: url(../../../assets/img/guizi.png) no-repeat;
			background-size: contain;
			position: relative;

			span {
				position: absolute;
				height: 30px;
				line-height: 30px;
				width: 100%;
				text-align: center;
				top: 200px;
			}
		}

		.materialCabinet:hover {
			background: url(../../../assets/img/guizi1.png) no-repeat;
			background-size: contain;
		}

		.el-checkbox-group {
			font-size: inherit;
		}

		/deep/ .el-checkbox {
			.el-checkbox__label {
				opacity: 0;
			}
		}

		.grid {
			width: 150px;
			height: 100px;
			float: left;
			text-align: center;
			border-right: 1px solid #D3D3D3;
			border-bottom: 1px solid #D3D3D3;
			box-sizing: border-box;
			position: relative;
		}

		.gridBg4 {
			background: #98FB98;
		}

		.gridBg3 {
			background: #FFC0CB;
		}

		.gridBg1 {
			background: #F5F5F5;
		}

		.gridHead {
			width: 150px;
			height: 40px;
			line-height: 40px;
			float: left;
			text-align: center;
			border-right: 1px solid #D3D3D3;
			border-bottom: 1px solid #D3D3D3;
			box-sizing: border-box;
		}

		/deep/ .el-dialog__body {
			padding: 0px 20px 30px;

		}

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
		height: 100%;
		background: #fff;

		h3 {
			height: 40px;
			line-height: 40px;
			font-size: 16px;
			padding-left: 20px;
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

	.el-dialog .el-form {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap
	}

	/deep/ .search_contain {


		/deep/ .el-form-item {
			width: 25%;
			margin-right: 0px;
		}

		/deep/ .el-form-item__content {
			width: 180px;
		}
	}

	.el-form {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
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

	/deep/ .custom-tree-node {
		width: 100%
	}
</style>
