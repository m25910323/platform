<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案管理中心</el-breadcrumb-item>
			<el-breadcrumb-item>资料管理</el-breadcrumb-item>
			<el-breadcrumb-item>资料查找</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body clearfix">
			<div>
				<h3>资料查找</h3>
				<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;" class='clearfix'>
					<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="100px">
						
						<el-form-item label="客户名称：" prop="customer">
							<el-select v-model="uploadData.customer" placeholder="请选择" clearable filterable value-key="customerId">
						
								<el-option v-for="item in customerList" :label="item.customerName" :value='item'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="资料名称" prop="materialName">
							<el-input v-model="uploadData.materialName" placeholder="请输入" clearable></el-input>
						</el-form-item>
						<el-form-item label="资料类型" prop="dossierName">
							<el-select v-model="uploadData.type" placeholder="请选择" clearable filterable value-key='dictionaryId'>
													
								<el-option v-for="item in typeList" :label="item.dateName" :value='item'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="资料状态" prop="dossierName">
							<el-select v-model="uploadData.materialState" placeholder="请选择" clearable filterable>
								<el-option v-for="item in stateList" :label="item.label" :value='item.value'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="条形码" prop="barCode">
							<el-input v-model="uploadData.barCode" placeholder="请输入" clearable></el-input>
						</el-form-item>
						<!-- <el-form-item label="接收人工号" prop="dossierName">
							<el-input v-model="uploadData.customer" placeholder="请输入" clearable></el-input>
						</el-form-item> -->
						<!-- <el-form-item label="是否复印件" prop="isHaveCopies">
							<el-radio-group v-model="uploadData.isHaveCopies">
								<el-radio label="1">是</el-radio>
								<el-radio label="0">否</el-radio>
							</el-radio-group>
						</el-form-item> -->
						<!-- <el-form-item label="是否需归还" prop="isReturn">
							<el-radio-group v-model="uploadData.isReturn">
								<el-radio label="1">是</el-radio>
								<el-radio label="0">否</el-radio>
							</el-radio-group>
						</el-form-item> -->
						<!-- <el-form-item label="库位号" prop="dossierName">
							<el-input v-model="uploadData.customer" placeholder="请输入" clearable></el-input>
						</el-form-item>
						<el-form-item label="年" prop="dossierName">
							<el-date-picker v-model="uploadData.fYear" align="right" type="year" placeholder="选择年" format="yyyy"
							 value-format="yyyy">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="月" prop="dossierName">
							<el-input-number v-model="uploadData.fPeriod" :min="1" :max="12" label="描述文字" style="height:30px;margin-left:10px;width:100px;"></el-input-number>
						</el-form-item> -->

					</el-form>
					<el-button size="small" type='primary' @click='search' style="float: right;">查询</el-button>
					<el-button size="small" type='primary' @click='search' style="float: right;margin-right: 12px;">导出</el-button>
				</div>
				<el-table :data="tableList" style="width: 100%" v-loading='loading'>
					<el-table-column align="center" type="selection" width="50"></el-table-column>
				
					<!-- <el-table-column align="center" label="客户编号" prop="userCode" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>
				
				
					<el-table-column align="center" label="资料名称" prop="materialName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="条码值" prop="barCode" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="数量" prop="userName" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="库位名称" prop="librarySheet2" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="当前状态" prop="position" :resizable="false"></el-table-column> -->
					<!-- <el-table-column align="center" label="当前持有人" prop="entryDate" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="账期" prop="period" :resizable="false"></el-table-column>
					<el-table-column align="center" label="资料状态" prop="materialState" :resizable="false">
						<template slot-scope="scope">
							<span v-if='scope.row.materialState == 0'>保存资料到明细库</span>
							<span v-if='scope.row.materialState == 1'>待审核</span>
							<span v-if='scope.row.materialState == 2'>审批同意</span>
							<span v-if='scope.row.materialState == 3'>审批拒绝 </span>
							<span v-if='scope.row.materialState == 4'>领用</span>
							<span v-if='scope.row.materialState == 5'>归还</span>
							<span v-if='scope.row.materialState == 6'>已出库</span>
							<span v-if='scope.row.materialState == 7'>转交</span>
							<span v-if='scope.row.materialState == 8'>已经删除</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="凭证号" prop="voucherNo" :resizable="false"></el-table-column>
					<el-table-column align="center" label="金税盘盘号" prop="userName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="资料描述" prop="remark1" :resizable="false"></el-table-column>
				
					<!-- <el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">查看明细</el-button>
						</template>
					</el-table-column> -->
				</el-table>
				
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>

		</div>
		


	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				customerList:[],
				typeList: [],
				materialParentCategoryList:[],
				uploadData: {},
				empInfo: [],
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

				
				stateList: [
					{label:'保存资料到明细库',value:0},
					{label:'录入待审核',value:1},
					{label:'录入审批同意',value:2},
					{label:'录入审批拒绝',value:3},
					{label:'领用待审核',value:4},
					{label:'领用审批同意',value:5},
					{label:'领用审批拒绝',value:6},
					{label:'已归还',value:7},
					{label:'已出库',value:8},
					{label:'转交',value:9},
					{label:'内部转交',value:10},
					{label:'已经删除',value:11},
				],
				

			}
		},
		components: {},
		methods: {
			
			
			


			search() {
				// this.searchuserName = this.userName;
				this.queryListByPage();
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
			
			getMaterialCategoryInfo() {
				let param = {
					"materialParentCategoryId":"",
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/columbusNew/MaterialCategory/getMaterialCategoryInfo', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.materialParentCategoryList = res.data.data;
			
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

			handleEdit(index, row) {
				this.dialogVisible = true;
				this.form = JSON.parse(JSON.stringify(row));
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage();
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
			this.queryListByPage();
			this.getCustomerList();
			this.getMaterialCategoryInfo();
			this.getMaterialParentType();
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

	/deep/ .el-form {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap
	}

	/deep/ .el-form-item {
		width: 25%;
		margin-right: 0px;
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


	/deep/ .el-table__expanded-cell p {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
		height: 30px;
		line-height: 30px;
		float:left;
		label {
			width: 90px;
			color: #99a9bf;
			margin-left: 60px;
			height: 30px;
			line-height: 30px;
		}
	}
</style>
