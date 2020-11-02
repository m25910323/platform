<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>客服中心</el-breadcrumb-item>
			<el-breadcrumb-item>工单管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="contain_body">
			<div style="background: #fff;height:90px;padding:15px 12px 0px;">
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="100px">
					<el-form-item label="客户名称" prop="customerName">
						<el-input v-model="uploadData.customerName" clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="呼叫人" prop="contactName">
						<el-input v-model="uploadData.contactName" clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="呼叫人号码" prop="contactPhone">
						
						<el-input v-model="uploadData.contactPhone" clearable>
						</el-input>
					</el-form-item>
					<el-form-item label="工单编号" prop="workOrderNum">
						<el-input v-model="uploadData.workOrderNum" clearable>
						</el-input>
					</el-form-item>
					<!-- <el-form-item label="创建时间" prop="createTime">
						
						<el-date-picker v-model="uploadData.createTime" align="right" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item> -->
					<el-form-item label="" prop="workOrderNum">
						<el-button type="primary" size='mini' icon="el-icon-circle-plus-outline" @click='add' style='margin-bottom: 0.2rem;float: right;margin-right: 12px;'>新增</el-button>
						<el-button size="mini" type="primary" @click="search()" style='margin-left: 8px;margin-right: 20px;float: right;'>搜索</el-button>
					</el-form-item>
				</el-form>
				
				<!-- <el-button type="danger" size='mini' icon="el-icon-delete" :disabled="canEidt" @click='deleteMulti' style='margin-bottom: 0.2rem;float: right;'>批量删除</el-button> -->
				<!-- <el-button type="primary" size='mini' icon="el-icon-circle-plus-outline" @click='add' style='margin-bottom: 0.2rem;float: right;margin-right: 12px;'>新增</el-button>
				<el-button size="mini" type="primary" @click="search()" style='margin-left: 8px;margin-right: 20px;float: right;'>搜索</el-button> -->
			</div>

			<!-- <el-input v-model="keywords" size='mini' style='width: 120px;'></el-input> -->

			<el-table :data="tableList" v-loading='loading' @selection-change="handleSelectionChange">
				<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->

				<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="呼叫人" prop="contactName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="呼叫人号码" prop="contactPhone" :resizable="false"></el-table-column>
				<el-table-column align="center" label="工单类型" prop="workOrderType" :resizable="false"></el-table-column>
				<el-table-column align="center" label="工单编号" prop="workOrderNum" :resizable="false"></el-table-column>
				<el-table-column align="center" label="工单描述" prop="describes" :resizable="false"></el-table-column>
				<el-table-column align="center" label="创建人" prop="createUserName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="审批人" prop="approveUserName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="受理人" prop="acceptUserName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="工单状态" prop="statuss" :resizable="false">
					<template slot-scope="scope">
						<span v-show='scope.row.statuss == 1'>审核中</span>
						<span v-show='scope.row.statuss == 2'>处理中</span>
						<span v-show='scope.row.statuss == 3'>审核不通过</span>
						<span v-show='scope.row.statuss == 4'>关闭</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="创建时间" prop="createTime" :resizable="false"></el-table-column>
				<!-- <el-table-column align="center" prop="holidayArchivesBool" :resizable="false" width="120">
					<template slot="header" slot-scope="scope">
						<span>是否档案管理</span>
					</template>
					<template slot-scope="scope">
						<span>{{scope.row.holidayArchivesBool == 1?'是':'否'}}</span>
					</template>
				</el-table-column> -->
				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>


		</div>


		<el-dialog width="400px" :title="tag == 'edit'?'编辑':'新增'" :visible.sync="dialogVisible" :before-close="handleClose">
			<el-form ref="form" :model="form" label-width="100px" size="mini" label-position="right">
				<el-form-item label="客户名称">
					<el-input v-model="form.customerName" placeholder="请输入"></el-input>
					<!-- <span>*请填写信息！</span> -->
				</el-form-item>
				<el-form-item label="呼叫人">
					<el-input v-model="form.contactName" :disabled="tag=='add'?false:true" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="呼叫人号码">
					<el-input v-model="form.contactPhone" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="工单类型">
					<el-input v-model="form.workOrderType" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="工单描述">
					<el-input v-model="form.describes" :disabled="tag=='add'?false:true" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="审批人">
					<el-select v-model="form.approveUserId" placeholder="请选择" clearable filterable>
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option v-for="item in detail" :label="item.userName" :value='item.userCode'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="受理人">
					<el-select v-model="form.acceptUserId" placeholder="请选择" clearable filterable>
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option v-for="item in detail" :label="item.userName" :value='item.userCode'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="处理时效">
					<el-input v-model="form.processHour" :disabled="tag=='add'?false:true" placeholder="请输入"></el-input>
				</el-form-item>
				
				<el-form-item label="工单备注">
					<el-input v-model="form.workOrderRemark" type='textarea' placeholder="请输入"></el-input>
				</el-form-item>

			</el-form>
			<div class='btn_contain clearfix' style="text-align: center;margin-top: 0.36rem;">
				<span class='commit' @click="commit">提交</span>
				<span class='close' @click="cancel">取消</span>
			</div>
		</el-dialog>
		
		
		<el-dialog width="400px" title="详情" :visible.sync="dialogVisible1">
			<el-form ref="form" :model="form1" label-width="120px" size="mini" label-position="right">
				<el-form-item label="客户名称">
					<el-input v-model="form1.customerName" disabled></el-input>
					<!-- <span>*请填写信息！</span> -->
				</el-form-item>
				<el-form-item label="呼叫人">
					<el-input v-model="form1.contactName" disabled></el-input>
				</el-form-item>
				<el-form-item label="呼叫人号码">
					<el-input v-model="form1.contactPhone" disabled></el-input>
				</el-form-item>
				<el-form-item label="工单编号">
					<el-input v-model="form1.workOrderNum" disabled></el-input>
				</el-form-item>
				<el-form-item label="工单类型">
					<el-input v-model="form1.workOrderType" disabled></el-input>
				</el-form-item>
				<el-form-item label="工单描述">
					<el-input v-model="form1.describes" disabled></el-input>
				</el-form-item>
				<el-form-item label="创建人">
					<el-input v-model="form1.createUserName" disabled></el-input>
				</el-form-item>
				<el-form-item label="审批人">
					<el-input v-model="form1.approveUserName" disabled></el-input>
				</el-form-item>
				<el-form-item label="受理人">
					<el-input v-model="form1.acceptUserName" disabled></el-input>
				</el-form-item>
				<el-form-item label="工单状态">
					<el-input v-model="form1.statuss" disabled></el-input>
				</el-form-item>
				<el-form-item label="创建时间">
					<el-input v-model="form1.createTime" disabled></el-input>
				</el-form-item>
				<el-form-item label="处理时效">
					<el-input v-model="form1.processHour" disabled></el-input>
				</el-form-item>
				<el-form-item label="处理时间">
					<el-input v-model="form1.processTime" disabled></el-input>
				</el-form-item>
				<el-form-item label="处理结果">
					<el-input v-model="form1.processResult" disabled></el-input>
				</el-form-item>
				<el-form-item label="处理描述">
					<el-input v-model="form1.processDesc" disabled></el-input>
				</el-form-item>
				<el-form-item label="关联工单">
					<el-input v-model="form1.associatedOrder" disabled></el-input>
				</el-form-item>
				<el-form-item label="审核不通过原因">
					<el-input v-model="form1.reason" disabled></el-input>
				</el-form-item>
				<el-form-item label="工单备注">
					<el-input v-model="form1.workOrderRemark"  disabled type='textarea' placeholder="请输入"></el-input>
				</el-form-item>
		
			</el-form>
			<!-- <div class='btn_contain clearfix' style="text-align: center;margin-top: 0.36rem;">
				<span class='commit' @click="commit">提交</span>
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
				detail:[],
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
					
				},
				form1:{},
				currentPage: 1,
				pageSize: 13,
				total: 0,
				tableList: [],

				dialogVisible: false,
				dialogVisible1: false,
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
				this.loading = true;
				let param = {
					page:this.currentPage,
					row:this.pageSize,
					data:{
						customerName : this.customerName,
						contactName : this.contactName,
						contactPhone : this.contactPhone,
						workOrderNum : this.workOrderNum,
						createTime : this.createTime,
					}
				};
				this.axios.post('/perTaxToolTwo/callcenter/workOrder/queryListByPage',param).then(res => {
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
			add() {
				this.tag = 'add';
				this.dialogVisible = true;
			},

			commit() {
				switch (this.tag) {
					case 'add':
						var url = '/perTaxToolTwo/callcenter/workOrder/insert';
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
						message: '提交失败',
						type: 'error'
					});
				})
			},
			cancel() {
				this.resetForm();
				this.dialogVisible = false;
				this.dialogVisible1 = false;
			},
			resetForm() {
				this.form = {

				};
				this.form1 = {
				
				}
			},
			search() {
				this.customerName = this.uploadData.customerName;
				this.contactName = this.uploadData.contactName;
				this.contactPhone = this.uploadData.contactPhone;
				this.workOrderNum = this.uploadData.workOrderNum;
				this.createTime = this.uploadData.createTime;
				this.queryListByPage()
			},
			handleClose() {

				this.resetForm();
				this.dialogVisible = false;
			},
			handleCancel(index, row) {},
			handleEdit(index, row) {
				this.tag = 'edit';
				this.dialogVisible1 = true;
				this.form1 = JSON.parse(JSON.stringify(row));
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

			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage()
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
			this.queryList()
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
