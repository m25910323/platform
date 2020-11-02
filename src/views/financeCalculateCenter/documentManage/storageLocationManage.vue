<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案管理中心</el-breadcrumb-item>
			<el-breadcrumb-item>资料管理</el-breadcrumb-item>
			<el-breadcrumb-item>库位号管理</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body clearfix">
			<div>
				<h3>库位号管理</h3>
				<div class="search_contain clearfix" style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;">
					<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="120px">
						<el-form-item label="资料室" prop="materialRoomId">
							<el-select v-model="uploadData.materialRoomId" placeholder="请选择" clearable filterable>
								<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
								<el-option v-for="item in materialRoomList" :label="item.materialRoomName" :value='item.materialRoomId'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="柜子名称" prop="materialCabinetId">
							<el-select v-model="uploadData.materialCabinetId" placeholder="请选择" clearable filterable>
								<el-option v-for="item in materialCabinetList" :label="item.materialCabinetName" :value='item.materialCabinetId'></el-option>
							</el-select>
						</el-form-item>
						<!-- <el-form-item label="格子号" prop="dossierName">
							<el-select v-model="uploadData.customer" placeholder="请选择公司名称" clearable filterable value-key='customerId'>
								<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>
							</el-select>
						</el-form-item> -->
						<el-form-item label="库位号类型" prop="type">
							<el-select v-model="uploadData.type" placeholder="请选择" clearable filterable>
								<el-option label="未编辑" value='0'></el-option>
								<el-option label="行政区编号" value='1'></el-option>
								<el-option label="资料库编号" value='2'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="存放资料类型" prop="saveMaterialTypeId">
							<el-select v-model="uploadData.saveMaterialTypeId" placeholder="请选择" clearable filterable>
								<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
								<el-option v-for="item in saveMaterialTypeList" :label="item.saveMaterialTypeName" :value='saveMaterialTypeId'></el-option>
							</el-select>
						</el-form-item>
						
						<!-- <el-form-item label="是否占用" prop="dossierName">
							<el-radio-group v-model="uploadData.customer">
								<el-radio label="1">是</el-radio>
								<el-radio label="0">否</el-radio>
							</el-radio-group>
						</el-form-item> -->
						

					</el-form>
					<!-- <el-button size="small" type='primary' @click='search' style="float: right">录入</el-button> -->
					<!-- <el-button size="small" type='primary' @click='search' style="float: right;margin-left: 12px;">批量清空</el-button> -->
					<el-button size="small" type='primary' @click='gotoroom' style="float: right;margin-left: 12px;">资料室</el-button>
					<el-button size="small" type='primary' @click='search' style="float: right;">查询</el-button>

				</div>
				<el-table :data="tableList" style="width: 100%;margin-top: 12px;" v-loading='loading' @selection-change="handleSelectionChange">
					<el-table-column align="center" type="selection" width="50"></el-table-column>

					<el-table-column align="center" label="资料室" prop="materialRoomName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="柜子名称" prop="materialCabinetName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="格子号" prop="gridNo" :resizable="false"></el-table-column>
					<el-table-column align="center" label="库位号类型" prop="type" :resizable="false">
						<template slot-scope="scope">
							<span v-show="scope.row.type == 0">未编辑</span>
							<span v-show="scope.row.type == 1">行政区编号</span>
							<span v-show="scope.row.type == 2">资料库编号</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="库位号名称" prop="storageLocationName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="是否占用" prop="isUse" :resizable="false">
						<template slot-scope="scope">
							<span v-show="scope.row.isUse == 0">未占用</span>
							<span v-show="scope.row.isUse == 1">占用</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="存放资料类型" prop="saveMaterialTypeName" :resizable="false"></el-table-column>

					<el-table-column align="center" label="容量" prop="size" :resizable="false"></el-table-column>
					<el-table-column align="center" label="已用容量" prop="usedSize" :resizable="false"></el-table-column>
					<el-table-column align="center" label="未使用容量" prop="remainSize" :resizable="false"></el-table-column>


					<el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleAllot(scope.$index, scope.row)">分配</el-button>
							<!-- <el-button size="mini" type="text" @click="clearGridBatch(scope.$index, scope.row)">清空</el-button> -->
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>

		</div>
		
		<el-dialog title="分配" :visible.sync="dialogVisible1" width="4rem">
			<el-form ref="form" :model="form2" label-width="100px" size="mini">
		
				<el-form-item label="客户名称">
					<el-select v-model="uploadData.customerId" placeholder="请选择" clearable filterable>
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
					</el-select>
				</el-form-item>
				
				<!-- <el-form-item label="库位号种类">
					<el-select v-model='form2.saveMaterialTypeId' clearable size="mini" @change="setArea" value-key="saveMaterialTypeId">
						<el-option v-for='item in saveMaterialTypeList' :label="item.saveMaterialTypeName" :value="item"
						 :key='item.saveMaterialTypeId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="分配类型">
					<el-select v-model='form2.regionModel' clearable size="mini">
						<el-option v-for='item in saveMaterialTypeList' :label="item.saveMaterialTypeName" :value="item.saveMaterialTypeId"
						 :key='item.saveMaterialTypeId'></el-option>
					</el-select>
				</el-form-item> -->
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog">取 消</el-button>
				<el-button type="primary" @click="commitAddChild1">确 定</el-button>
			</span>
			
		
		</el-dialog>
		
		<!-- <el-dialog title="库位号编辑" :visible.sync="dialogVisible" width="4rem" :before-close="handleClose">
			<el-form ref="form" :model="form2" label-width="100px" size="mini">

				<el-form-item label="格子号">
					<el-input v-model="form2.gridNo"></el-input>
				</el-form-item>
				
				<el-form-item label="存放资料类型">
					<el-select v-model='form2.saveMaterialTypeId' clearable size="mini" @change="setArea" value-key="saveMaterialTypeId">
						<el-option v-for='item in saveMaterialTypeList' :label="item.saveMaterialTypeName" :value="item"
						 :key='item.saveMaterialTypeId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="地区" v-show='isArea'>
					<el-select v-model='form2.regionModel' clearable size="mini">
						<el-option v-for='item in saveMaterialTypeList' :label="item.saveMaterialTypeName" :value="item.saveMaterialTypeId"
						 :key='item.saveMaterialTypeId'></el-option>
					</el-select>
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
			

		</el-dialog> -->

	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				editsaveMaterialTypeId:'',
				storageLocationId:'',
				
				saveMaterialTypeList: [],
				storageLocationModelList: [],
				materialRoomList:[],
				materialCabinetList:[],
				uploadData: {},
				form2: {},
				form1: {},
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
				tableList: [],

				dialogVisible: false,
				dialogVisible1: false,

				defaultProps: {
					children: 'child',
					label: 'departmentName'
				},
				data4: [],
				type: null,
				saveMaterialTypeId: null,
				materialCabinetId: null,
				materialRoomId: null,
				isArea:false

			}
		},
		components: {},
		methods: {
			setArea(val){
				if(val.type == 1){
					this.isArea = true;
				}else{
					this.isArea = false;
				}
				
			},
			hideDialog() {
				// this.dialogVisible = false;
				this.dialogVisible1 = false;
				this.reset();
			},
			
			handleClose() {
				this.reset();
			},
			
			reset() {
				this.form = {};
				this.form2 = {};
			},
			
			
			
			commitAddChild() {
				
				let param = this.form2;
				// this.axios.post('/sl/perTaxToolTwo/hr/org/saveOrg', param).then(res => {
				this.axios.post('/perTaxToolTwo/columbusNew/storageLocation/setGridProperty', param).then(res => {
					if (res.data.code == 200) {
						this.queryListByPage();
						this.dialogVisible = false;
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
			
			
			commitAddChild1() {
				
				let param = 
					{   
					    "type":2,
					    // "customerId":this.form2.customerId,
						"customerId":'a7d9568644694777820e324c06664058',
					    "storageLocationId":this.storageLocationId,
						"saveMaterialTypeId":this.editsaveMaterialTypeId,
					}
				// this.axios.post('/sl/perTaxToolTwo/hr/org/saveOrg', param).then(res => {
				this.axios.post('/perTaxToolTwo/columbusNew/storageLocation/allotStorageLocation', param).then(res => {
					if (res.data.code == 200) {
						this.queryListByPage();
						this.dialogVisible1 = false;
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
						message: '分配失败',
						type: 'error'
					});
				})
			},


			search() {
				this.type = this.uploadData.type?this.uploadData.type:null;
				this.saveMaterialTypeId = this.uploadData.saveMaterialTypeId?this.uploadData.saveMaterialTypeId:null;
				this.materialCabinetId = this.uploadData.materialCabinetId?this.uploadData.materialCabinetId:null;
				this.materialRoomId = this.uploadData.materialRoomId?this.uploadData.materialRoomId:null;
				this.queryListByPage();
			},
			
			gotoroom() {
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/documentRoom', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						// id: row.mainId,
						// accountPeriod: row.accountPeriod,
						// customerName: row.customerName,
					}
				})
			},
			queryListByPage() {
				this.loading = true;

				let param = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						type:this.type,
						saveMaterialTypeId:this.saveMaterialTypeId,
						materialCabinetId:this.materialCabinetId,
						materialRoomId:this.materialRoomId,
					}
				};
				this.axios.post('/perTaxToolTwo/columbusNew/storageLocation/getStorageLocationByPage', param)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableList = res.data.data;
							this.total = res.data.count;
						} else {
							this.loading = false;
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
			
			handleEdit(index, row) {
				this.dialogVisible = true;
				this.form2 = JSON.parse(JSON.stringify(row));
			},
			
			handleAllot(index, row){
				this.dialogVisible1 = true;
				this.storageLocationId = row.storageLocationId;
				this.editsaveMaterialTypeId = row.saveMaterialTypeId;
				// this.form2 = JSON.parse(JSON.stringify(row));
			},
			
			clearGridBatch(index, row) {
				this.$confirm('确定清空?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = [row.materialCabinetDetailId];
					this.axios.post('/perTaxToolTwo/columbusNew/storageLocation/clearGridBatch', param)
						.then(res => {
							if (res.data.code == 200) {
								this.queryListByPage();
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
							} else {
								this.loading = false;
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


			
			
			getMaterialCabinet(data) {
				let params = {};
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

			// getStorageLocationModel() {
			// 	let params = {};
			// 	this.axios.post('/perTaxToolTwo/columbusNew/storageLocation/selectStorageLocationModel', params).then(res => {
			// 		if (res.data.code == 200) {
			// 			this.storageLocationModelList = res.data.data;
			// 		} else {
			// 			let type;
			// 			if (res.data.code == 0) {
			// 				type = "warning";
			// 			} else if (res.data.code == 500) {
			// 				type = "error";
			// 			}
			// 			this.$message({
			// 				message: res.data.msg,
			// 				type: type
			// 			});
			// 		}

			// 	}).catch(function(err) {
			// 		this.$message({
			// 			message: '获取库位模板失败',
			// 			type: 'error'
			// 		});
			// 	})
			// },

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

		},
		created() {
			this.queryListByPage();
			this.getSaveMaterialType();
			// this.getStorageLocationModel();
			this.getMaterialRoom();
			this.getMaterialCabinet();
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
	
	/* /deep/ .el-form-item {
		width: 20%;
	} */

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
