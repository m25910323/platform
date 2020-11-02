<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>年终汇算</el-breadcrumb-item>
			<el-breadcrumb-item>定价及建议审批</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small" ref='formName'>
					<el-form-item label="客户名称" prop="customerId">
						<el-select v-model="uploadData.customerId" placeholder="请选择" filterable clearable>
							<el-option v-for="item in $store.state.cust" :key="item.customerId" :label="item.customerName" :value="item.customerId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="账期" prop="accountPeriod">
						<el-date-picker v-model="uploadData.accountPeriod" type="date" placeholder="请选择" size="mini" value-format="yyyy-MM-dd"
						 format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="审批状态" prop="auditingStatus">
						<el-select v-model="uploadData.auditingStatus" placeholder="请选择" filterable clearable>
							<el-option label="全部" value=""></el-option>
							<el-option label="审批中" value="1"></el-option>
							<el-option label="结束" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审批结果" prop="auditingResult">
						<el-select v-model="uploadData.auditingResult" placeholder="请选择" filterable clearable>
							<el-option label="全部" value=""></el-option>
							<el-option label="同意" value="1"></el-option>
							<el-option label="不同意" value="2"></el-option>
						</el-select>
					</el-form-item>
					<el-button type="info" @click='resetForm()' size="small" style="float: right;"> 重 置 </el-button>
					<el-button type="primary" @click='search()' size="small" style="float: right;margin-right: 20px;"> 查 找 </el-button>


				</el-form>
			</div>
		</div>

		<div class='main_contain'>
			<!-- <p>{{customerName}}</p> -->
			<div style="text-align: center;" class="clearfix">

				<el-button class="el-icon-refresh" type='text' size="mini" @click='refresh()' style='float:right'>刷新</el-button>
			</div>

			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="客户名称" prop="customerName"></el-table-column>
				<el-table-column align="center" label="账期" prop="accountPeriod"></el-table-column>
				<el-table-column align="center" label="审批状态" prop="auditingStatus">
					<template slot-scope="scope">
						<span v-if="scope.row.auditingStatus == 1">审批中</span>
						<span v-if="scope.row.auditingStatus == 2">结束</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="审批结果" prop="auditingResult">
					<template slot-scope="scope">
						<span v-if="scope.row.auditingResult == 1">同意</span>
						<span v-if="scope.row.auditingResult == 2">不同意</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="申请人" prop="applicantName"></el-table-column>
				<el-table-column align="center" label="申请时间" prop="applyTime"></el-table-column>
				<el-table-column align="center" label="审批人" prop="approvalName"></el-table-column>
				<el-table-column align="center" label="审批时间" prop="approvalTime"></el-table-column>
				<el-table-column align="center" label="备注" prop="remark"></el-table-column>
				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" v-if="scope.row.auditingStatus == 2" @click="handleDetail(scope.$index, scope.row)">详情</el-button>
						<el-button size="mini" type="text" v-if="scope.row.auditingStatus == 1" @click="handleApprove(scope.$index, scope.row)">审批</el-button>
					</template>
				</el-table-column>


			</el-table>

			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>


			<!-- <p style="text-align: right;margin-top: 20px;"><span style="margin-right: 20px;">凭证数：{{tvoucherCount}}</span> <span>附件数：{{fattachments}}</span></p> -->
		</div>

		<el-dialog width="400px" title="审批" :visible.sync="dialogVisible">
			<el-form ref="form" :model="form1" label-width="140px" size="mini" label-position="left">
		
				<!-- <el-form-item label="定价">
					<el-input v-model="form1.priceSet" placeholder="请输入" disabled></el-input>
		
				</el-form-item> -->
				<el-form-item label="修改类型">
					<el-input v-model="form1.updateTypeName" disabled></el-input>
				</el-form-item>
				<el-form-item label="原值">
					<el-input v-model="form1.originalContent" disabled></el-input>
				</el-form-item>
				<el-form-item label="修改值">
					<el-input v-model="form1.updateContent" disabled></el-input>
				</el-form-item>
				<el-form-item label="申请人">
					<el-input v-model="form1.applicantName" disabled></el-input>
				</el-form-item>
				<el-form-item label="申请时间">
					<el-input v-model="form1.applyTime" disabled></el-input>
		
				</el-form-item>
				
				<el-form-item label="审批结果">
					<el-select v-model="form1.auditingResult" placeholder="请选择">
						<el-option v-for="item in auditingResultList" :label="item.label" :value="item.value"></el-option>
						<!-- <el-option label="不同意" value="2"></el-option> -->
					</el-select>
						
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" rows="5" v-model="form1.remark" placeholder="请输入">
					
					</el-input>
						
				</el-form-item>
		
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="commit">确 定</el-button>
			</span>
		
		</el-dialog>
		
		
		<el-dialog width="400px" title="详情" :visible.sync="dialogVisible1">
			<el-form ref="form" :model="form2" label-width="140px" size="mini" label-position="left">
		
				<!-- <el-form-item label="定价">
					<el-input v-model="form1.priceSet" placeholder="请输入" disabled></el-input>
		
				</el-form-item> -->
				<el-form-item label="修改类型">
					<el-input v-model="form2.updateTypeName" disabled></el-input>
				</el-form-item>
				<el-form-item label="原值">
					<el-input v-model="form2.originalContent" disabled></el-input>
				</el-form-item>
				<el-form-item label="修改值">
					<el-input v-model="form2.updateContent" disabled></el-input>
				</el-form-item>
				<el-form-item label="申请人">
					<el-input v-model="form2.applicantName" disabled></el-input>
				</el-form-item>
				<el-form-item label="申请时间">
					<el-input v-model="form2.applyTime" disabled></el-input>
		
				</el-form-item>
				
				<el-form-item label="审批结果">
					<el-select v-model="form2.auditingResult" placeholder="请选择" disabled>
						<el-option v-for="item in auditingResultList" :label="item.label" :value="item.value"></el-option>
						<!-- <el-option label="同意" value="1"></el-option>
						<el-option label="不同意" value="2"></el-option> -->
					</el-select>
						
				</el-form-item>
				<el-form-item label="备注">
					<el-input type="textarea" rows="5" v-model="form2.remark" placeholder="请输入" disabled>
					
					</el-input>
						
				</el-form-item>
		
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="cancel">确 定</el-button>
			</span>
		
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				pageSize: 10,
				currentPage: 1,
				total: 0,
				detail: {},
				loading: false,

				form1:{},
				form2:{},

				uploadData: {
					customerId: '',
					accountPeriod: '',
					auditingStatus:'',
					auditingResult:'',
				},
				auditingResultList:[
					{label:'同意',value:1},
					{label:'不同意',value:2},
				],
				customerId: '',
				accountPeriod: '',
				auditingStatus:'',
				auditingResult:'',
				tableData: [],

				customerName: '',
				dialogVisible: false,
				dialogVisible1: false,

			}
		},
		components: {},
		methods: {
			resetForm() {
				this.uploadData = {};
			},
			hideDialog() {
				this.dialogVisible = false;
				this.detail = {}
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage();
			},

			refresh() {
				this.queryPage()
			},

			search() {
				this.customerId = this.uploadData.customerId;
				this.accountPeriod = this.uploadData.accountPeriod;
				this.auditingStatus = this.uploadData.auditingStatus;
				this.auditingResult = this.uploadData.auditingResult;
				this.queryPage()
			},

			queryPage() {
				this.loading = true; 
				let params = {
					"row": this.pageSize,
					"page": this.currentPage,
					"data": {
						"customerId": this.customerId,
						"accountPeriod": this.accountPeriod,
						"updateType": "",
						"auditingStatus": this.auditingStatus,
						"auditingResult": this.auditingResult

					}
				};
				this.axios.post('/perTaxToolTwo/e9z/e9zAuditingRecord/getAuditingQueryList', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data;
							this.total = res.data.count;
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
			cancel(){
				this.dialogVisible = false;
				this.dialogVisible1 = false;
			},
			
			handleApprove(index, row) {
				this.dialogVisible = true;
				this.form1 = JSON.parse(JSON.stringify(row));
				var tem = ["",'费用','建议'];
				var tem1 = ['',1,2];
				this.$set(this.form1,'updateTypeName',tem[row.updateType]);
				this.$set(this.form1,'auditingResult',tem1[row.auditingResult])
			},
			handleDetail(index, row) {
				this.dialogVisible1 = true;
				this.form2 = JSON.parse(JSON.stringify(row));
				var tem = ["",'费用','建议'];
				var tem1 = ['',1,2];
				this.$set(this.form2,'updateTypeName',tem[row.updateType]);
				this.$set(this.form2,'auditingResult',tem1[row.auditingResult])
			},

			commit(index, row) {
				
				
					let params = this.form1;
					this.axios.post('perTaxToolTwo/e9z/e9zAuditingRecord/updateAuditingRecord', params)
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							if (res.data.code == 200) {
								this.dialogVisible = false;
								this.queryPage();
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
				
			}


		},
		computed: {},
		created() {
			this.queryPage();
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

		/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
			background-color: #efe9e5;
		}

		/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
			border-bottom-color: #fff;
			background: #f9f9f9;
		}

		.search_contain {
			background: #fff;
			height: 40px;
			/* padding-left: 20px; */
			padding: 0.3rem 20px;
			margin: 0px 20px 10px;

			.info {
				height: 40px;
				line-height: 40px;
			}

			a {
				margin-left: 10px;
			}
		}

		.main_contain {
			background: #fff;
			margin: 12px 20px 20px;
			padding: 12px 20px 20px;
			/* height: calc(100% - 190px); */

			h5 {
				height: 40px;
				line-height: 40px;
				color: #409EFF
			}

			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}
		}
	}


	.Article-nav {
		/* width: 1200px; */
		height: 0.45rem;
		box-sizing: border-box;
		/* background-color: red; */
		/* padding-top: 10px;
			padding-bottom: 10px; */
		margin-left: 20px;
		/* display: flex;
			flex-direction: row;
			position: relative;
			z-index: 1000;
			justify-content: space-around; */

		.Article-circle {
			/* display: inline-block; */
			float: left;
			width: 1rem;
			height: 0.45rem;
			margin-right: 0.12rem;
			border: 1px solid #979797;
			background: #fff;
			cursor: pointer;
			box-sizing: border-box;
			color: #8C8C8C;

			span:nth-of-type(1) {
				width: 50%;
				float: left;
				font-size: 0.32rem;
				height: 0.45rem;
				line-height: 0.45rem;
				text-align: center;
			}

			span:nth-of-type(2) {
				width: 50%;
				float: left;
				font-size: 0.15rem;
				height: 0.22rem;
				line-height: 0.25rem;
				/* padding-left:0.12rem */
			}

			span:nth-of-type(3) {
				width: 50%;
				float: left;
				font-size: 0.15rem;
				height: 0.22rem;
				line-height: 0.18rem;
				/* padding-left:0.12rem */
			}
		}
	}


	.active-select {
		border-color: #409EFF !important;
		background-color: #409EFF !important;
		color: #fff !important
	}

	.next {
		width: 207px;
		height: 56px;
		background: rgba(36, 214, 137, 1);
		border: 3px solid rgba(36, 214, 137, 1);
		font-size: 16px;
		font-family: Microsoft YaHei;
		text-align: center;
		line-height: 56px;
		font-weight: bold;
		color: #fff;
	}

	.last {
		width: 207px;
		height: 56px;
		background: red;
		border: 3px solid red;
		font-size: 16px;
		font-family: Microsoft YaHei;
		text-align: center;
		line-height: 56px;
		font-weight: bold;
		color: #fff;
	}
</style>
