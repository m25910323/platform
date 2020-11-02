<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案管理中心</el-breadcrumb-item>
			<el-breadcrumb-item>资料管理</el-breadcrumb-item>
			<el-breadcrumb-item>资料入库</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body clearfix">
			<div>
				<h3>资料入库</h3>


				<div class='htitle'>操作信息</div>
				<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;">
					<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="100px">
						<el-form-item label="登记时间：" prop="dossierName">
							<span>{{formatTimeToStr(new Date(),'yyyy-MM-dd')}}</span>
						</el-form-item>
						<el-form-item label="登记人工号：" prop="dossierName">
							<span>{{$store.state.user.phone}}</span>
						</el-form-item>
						<el-form-item label="登记人姓名：" prop="dossierName">
							<span>{{$store.state.user.nickName}}</span>
						</el-form-item>
						<!-- <el-form-item label="" prop="dossierName">
							<el-dropdown size="small" style="float: right;margin-right: 12px;" @command="handleCommand">
								<el-button type="primary" size="small">
									添加<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item v-for='item in typeList' :command="item">{{item.dateName}}</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown>
						</el-form-item> -->

					</el-form>

				</div>


				<!-- <el-button size="small" type='primary' @click='showAddDialog' style="float: right;margin-right: 12px;">添加</el-button> -->


				<div style="height: 10px;background: rgb(243,246,249);"></div>
				<div class='htitle'>录入信息</div>
				<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;">
					<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="100px">
						<el-form-item label="客户名称：" prop="customer">
							<el-select v-model="uploadData.customer" placeholder="请选择" clearable filterable value-key="customerId">

								<el-option v-for="item in customerList" :label="item.customerName" :value='item'></el-option>
							</el-select>
						</el-form-item>
						
						<el-form-item label="资料类型：" prop="type">
							<el-select v-model="uploadData.type" placeholder="请选择" clearable filterable value-key='dictionaryId' @change='handleCommand'>
						
								<el-option v-for="item in typeList" :label="item.dateName" :value='item'></el-option>
							</el-select>
						</el-form-item>
						
						<el-form-item label="选择资料：" prop="materialName">
							<el-input v-model="uploadData.materialName" placeholder="请输入" clearable @focus="showDialog">
							</el-input>
						</el-form-item>

						<el-form-item label="账期：" prop="period" v-show="command.isHaveAccountPeriod">
							<el-date-picker v-model="uploadData.period" type="month" placeholder="选择日期" size="mini" value-format="yyyy-MM"
							 format="yyyy-MM">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="总册数：" prop="voucherVolume" v-show="command.isHaveNumber">
							<el-input v-model="uploadData.voucherVolume" placeholder="请输入" clearable>
							</el-input>
						</el-form-item>
						<el-form-item label="发票类型：" prop="ticketType" v-show="command.isHaveInvoiceType">
							<el-select v-model="uploadData.ticketType" placeholder="请选择" clearable filterable>

								<el-option v-for="item in ticketTypeList" :label="item.label" :value='item.label'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="发票版本：" prop="ticketVersion" v-show="command.isHaveInvoiceVersion">
							<el-select v-model="uploadData.ticketVersion" placeholder="请选择" clearable filterable>

								<el-option v-for="item in versionList" :label="item.label" :value='item.label'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="发票联次：" prop="ticketUnion" v-show="command.isHaveInvoiceSheet">
							<el-select v-model="uploadData.ticketUnion" placeholder="请选择" clearable filterable>

								<el-option v-for="item in unionList" :label="item.label" :value='item.label'></el-option>
							</el-select>
						</el-form-item>
						<!-- <el-form-item label="金税盘：" prop="dossierName" v-show="command.isHaveInvoiceSheet">
							<el-select v-model="uploadData.customer" placeholder="请选择" clearable filterable value-key='customerId'>

								<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>
							</el-select>
						</el-form-item> -->
						<el-form-item label="" prop="dossierName">
							<el-button type="primary" size="mini" @click='createTable'>确定</el-button>
							<!-- <el-button size="mini" type='primary' @click='search' style="">保存</el-button> -->
						</el-form-item>
					</el-form>
				</div>

				<el-table :data="tableList" style="width: 100%;margin-top: 12px;" v-loading='loading' @selection-change="handleSelectionChange" v-show="uploadData.type">
					<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->
					<el-table-column v-for="item in fieldList" align="center" :label="item.chinaName" :prop="item.englishCode" :resizable="false">
						<template slot-scope="scope">
							<div v-text="scope.row[item.englishCode]" :contenteditable="item.isCanEditEntry == 1?true:false" @blur="handleInput(scope.$index, item.englishCode,$event)">
							</div>
						</template>
					</el-table-column>

					<el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">录入</el-button>
							<el-button size="mini" type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- <el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination> -->
			</div>

		</div>
		
		<el-dialog title="选择资料" :visible.sync="dialogVisible" width="100%">
		<!-- <el-dialog title="选择资料" :visible.sync="dialogVisible" width="1000px" :before-close="handleClose"> -->
			<div class='clearfix'>
				<el-tree accordion :data="treeList" :props="defaultProps" @node-click="handleNodeClick" style='width: 200px;float: left;margin-right: 10px;'></el-tree>
				<div style="width: calc(100% - 210px);float: right;">
					<el-table :data="result" stripe border @selection-change="((val)=>{handleSelectionChange(val)})" v-loading="loading" :row-key="getRowKeys">
						<el-table-column align="center" type="selection" width="55" :reserve-selection="true"></el-table-column>
						<el-table-column align="center" label="序号" prop="materialName"></el-table-column>
						<el-table-column align="center" label="资料名称" prop="materialName"></el-table-column>
						<el-table-column align="center" label="是否唯一" prop="isOnlyOne">
							<template slot-scope="scope">
								<span v-if='scope.row.isOnlyOne == 1'>是</span>
								<span v-if='scope.row.isOnlyOne == 0'>否</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="是否需要扫描件" prop="isNeedScan">
							<template slot-scope="scope">
								<span v-if='scope.row.isNeedScan == 1'>是</span>
								<span v-if='scope.row.isNeedScan == 0'>否</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="是否需要条形码" prop="isHaveBarCode">
							<template slot-scope="scope">
								<span v-if='scope.row.isHaveBarCode == 1'>是</span>
								<span v-if='scope.row.isHaveBarCode == 0'>否</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="是否需要复印件" prop="isHaveCopies">
							<template slot-scope="scope">
								<span v-if='scope.row.isHaveCopies == 1'>是</span>
								<span v-if='scope.row.isHaveCopies == 0'>否</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="是否是重要资料" prop="isImportant">
							<template slot-scope="scope">
								<span v-if='scope.row.isImportant == 1'>是</span>
								<span v-if='scope.row.isImportant == 0'>否</span>
							</template>
						</el-table-column>
					
						<el-table-column align="center" label="是否可归还客户" prop="isReturn">
							<template slot-scope="scope">
								<span v-if='scope.row.isReturn == 1'>是</span>
								<span v-if='scope.row.isReturn == 0'>否</span>
							</template>
						</el-table-column>
						
					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange1(val)})"
					 :current-page="currentPage1" :page-size="pageSize1" layout="total, prev, pager, next" :total="total1" v-show='total1 > 0'>
					</el-pagination>
				</div>
		
			</div>
		
		
			<div class='btn_contain clearfix'>
				<span class='close' @click="handleCommit">确定</span>
		
			</div>
		
		</el-dialog>
		
	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				customerList:[],
				typeList: [],
				fieldList: [],
				materialParentCategoryList: [],
				saveMaterialTypeList: [],
				uploadData: {
					period : '',
					voucherVolume : '',
					ticketType : '',
					ticketVersion : '',
					ticketUnion : '',
				},
				empInfo: [],
				form2: {
					isHaveCopies: 1,
					isReturn: 1,
					isState: 1,
				},
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
				command: {},
				trueOrFalse: [{
						label: "否",
						value: 0
					},
					{
						label: "是",
						value: 1
					}
				],
				versionList:[
					{label:'千元版',value:1},
					{label:'万元版',value:2},
					{label:'十万元版',value:3},
					{label:'百万元版',value:4},
					{label:'千万元版',value:5},
					{label:'亿元版',value:6},
				],
				unionList:[
					{label:'2联',value:2},
					{label:'3联',value:3},
					{label:'4联',value:5},
					{label:'5联',value:6},
				],
				ticketTypeList:[
					{label:'增值税专用发票',value:2},
					{label:'增值税普通发票',value:3},
					{label:'增值税电子普通发票',value:5},
					{label:'增值税电子专用发票',value:6},
					{label:'通用机打发票',value:6},
				],
				
				tree: [],
				defaultProps: {
					children: 'children',
					label: 'materiaCategoryName',
					value:'materialCategoryId'
				},
				result:[],
				multiSelection:[],
				currentPage1:1,
				pageSize1:10,
				total1:0,
				treeList:[],
				materialCategoryId:''

			}
		},
		components: {},
		methods: {
			handleCommit() {
				this.dialogVisible = false;
				this.uploadData.materialName = this.multiSelection[0].materialName;
				this.uploadData.materialId = this.multiSelection[0].materialId;
				console.log(this.multiSelection)
			},
			getRowKeys(row) {
				return row.materialId
			},
			handleNodeClick(data) {
				this.materialCategoryId = data.materialCategoryId;
				this.currentPage1 = 1;
				this.queryDetail();
			
			},
			handleSelectionChange(val, index) {
				this.multiSelection = val;
				console.log(this.multiSelection);
			},
			handleCurrentChange1(val) {
				// if (this.multiSelection.length > 0) {
				// 	this.archivesStorageIds.push(this.multiSelection);
				// }
			
				this.currentPage1 = val;
				this.queryDetail();
			},
			
			generateTree(data) {
				this.treeList = [];
				data.map((item) => {
					const list = this.getChildren(data)(item);
					if (list.length > 0) {
						item['children'] = list;
					}
					if (item.materialParentCategoryId == 0) {
						this.treeList.push(item);
					}
			
			
				})
				return this.treeList;
			},
			getChildren(data) {
				return function(item) {
					const arr = []
					data.forEach((value) => {
						if (value.materialParentCategoryId == item.materialCategoryId) {
							arr.push(value);
						}
					});
					return arr;
				}
			},
			queryDetail() {
				this.loading = true;
				let params = {
					data:{
						"materialCategoryId": this.materialCategoryId
					},
					page:this.currentPage1,
					row:this.pageSize1
					
			
				}
				this.axios.post('/perTaxToolTwo/columbusNew/MaterialConfig/getMaterialConfig', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.result = res.data.data;

							this.total1 = res.data.count;
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
						this.loading = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			
			handleCommand(command) {
				this.tableList = [];
				this.command = command;
				this.uploadData.period = '';
				this.uploadData.voucherVolume = '';
				this.uploadData.ticketType = '';
				this.uploadData.ticketVersion = '';
				this.uploadData.ticketUnion = '';
				this.getMaterialFields(command);
			},
			
			showDialog(){
				this.dialogVisible = true;
			},
			
			createTable() {
				let param = {

					"dictionaryId": this.command.dictionaryId,
					"period": this.uploadData.period,
					"ticketVersion": this.uploadData.ticketVersion,
					"ticketUnion": this.uploadData.ticketUnion,
					"ticketType": this.uploadData.ticketType,
					"voucherVolume": this.uploadData.voucherVolume,
					"materialName": this.command.dateName,
					"customerName": this.uploadData.customer.customerName,
					"customerId": this.uploadData.customer.customerId,

				};
				this.axios.post('/perTaxToolTwo/columbusNew/MaterialConfig/getMaterialEntryData', param).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hr/org/saveOrg', param).then(res => {
					if (res.data.code == 200) {
						res.data.data.forEach(item => {
							this.tableList.push(item);
						})

						this.total = res.data.count;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '创建失败',
						type: 'error'
					});
				})
			},
			hideDialog() {
				this.dialogVisible = false;
				this.reset();
			},
			
			reset() {
				this.form = {};
				this.form2 = {};
			},
			

			
			handleEdit(index, row) {
				// this.form2.customerId = this.form2.customer.customerId;
				// this.form2.customerName = this.form2.customer.customerName;
				// this.form2.accpetDeptId = this.form2.accpetDept.accpetDeptId;
				// this.form2.supplyDeptId = this.form2.supplyDept.supplyDeptId;

				// this.form2.customerId = 123;
				// this.form2.customerName = '123';
				row.dictionaryId = this.command.dictionaryId;
				row.moduleIdentification = "MaterialEnter";
				let param = [row];
				this.axios.post('/perTaxToolTwo/columbusNew/Material/ObtainMaterial', param).then(res => {
					if (res.data.code == 200) {
						
						this.tableList.splice(index,1);
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
						message: '录入失败',
						type: 'error'
					});
				})
			},


			search() {
				this.materialName = this.uploadData.materialName;
				this.barCode = this.uploadData.barCode;
				this.customerId = this.uploadData.customer.customerId;
				this.customerName = this.uploadData.customer.customerName;
				this.queryListByPage()
			},


			queryListByPage() {
				this.loading = true;


				let param = {
					"row": 10,
					"page": 1,
					"data": {
						// "materialStatu": 1
					}
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/columbusNew/Material/getMaterialsPage', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.tableList = res.data.data;
						this.total = res.data.count;

					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			

			handleDel(index, row) {
				this.tableList.splice(index, 1);

			},
			handleCurrentChange(val) {
				this.currentPage = val;
			},
			


			nodeClick(data) {
				this.currentPage = 1;


			},

			handleInput(index, label, event) {
				if (event.currentTarget.innerText == '') {
					this.$set(this.tableList[index], label, '')
				} else {
					this.$set(this.tableList[index], label, event.currentTarget.innerText);
				}



			},



			

			getMaterialCategoryInfo() {
				let param = {
					// "materialParentCategoryId": "",
					"remark1":"1"
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/columbusNew/MaterialCategory/getMaterialCategoryInfo', param).then(res => {
					
					if (res.data.code == 200) {
						this.materialParentCategoryList = res.data.data;
						this.generateTree(this.materialParentCategoryList)
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
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

			getMaterialParentType() {
				let params = {};
				this.axios.post('/perTaxToolTwo/columbusNew/MaterialConfig/getMaterialParentType', params).then(res => {
					if (res.data.code == 200) {
						this.typeList = res.data.data;
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
			getMaterialFields(command) {
				let params = {
					dictionaryId: command.dictionaryId
				};
				this.axios.post('/perTaxToolTwo/columbusNew/MaterialConfig/getMaterialFields', params).then(res => {
					if (res.data.code == 200) {
						this.fieldList = res.data.data;
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
						message: '获取字段失败',
						type: 'error'
					});
				})
			},
			getCustomerList() {
				this.axios.get('/perTaxToolTwo/columbusNew/tCustomerInfo/getTCustomerInfoDropList.do').then(res => {
						if (res.data.code == 200) {
							this.customerList = res.data.data;
			
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
			this.getMaterialCategoryInfo();
			// this.getSaveMaterialType();
			this.getMaterialParentType();
			this.getCustomerList();
			// http://192.168.1.159:8085/perTaxToolTwo/columbusNew/MaterialConfig/getMaterialParentType
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

		.htitle {
			margin: 12px 0px 12px 20px;
			padding-left: 8px;
			border-left: 2px solid #409EFF;
			font-size: 14px;
		}

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
