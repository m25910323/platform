<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>会计分配</el-breadcrumb-item>
			<el-breadcrumb-item>审核分配</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="客户名称" prop="customerId">
						<el-select v-model="uploadData.customerId" placeholder="请选择" clearable filterable>
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
							<!-- <el-option v-for="item in custList" :label="item.customerName" :value='item.customerName'></el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="账期" prop="remark1">
					
						<el-date-picker v-model="uploadData.remark1" align="right" type="month" placeholder="请选择" format="yyyy-MM"
						 value-format="yyyy-MM">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="是否中高端" prop="taxInfoRemark6">
						<el-select v-model="uploadData.taxInfoRemark6" placeholder="请选择">
							
							<el-option v-for="item in trueOrFalse" :label="item.label" :value='item.value'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="税务申报类型" prop="taxInfoRemark5">
						<el-select v-model="uploadData.taxInfoRemark5" placeholder="请选择">
							<el-option label="全部" value=''></el-option>
							<el-option label="一般纳税人" value='233'></el-option>
							<el-option label="小规模" value='232'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="申报周期" prop="declarationCycle">
						<el-select v-model="uploadData.declarationCycle" placeholder="请选择">
							<el-option label="全部" value=''></el-option>
							<el-option label="月报" value='0'></el-option>
							<el-option label="季报" value='1'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否零申报" prop="isZeroReport">
						<el-select v-model="uploadData.isZeroReport" placeholder="请选择" clearable filterable>
							
							<el-option v-for="item in trueOrFalse" :label="item.label" :value='item.value'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="审核会计" prop="userCode">
						<el-select v-model="uploadData.userCode" placeholder="请选择" clearable filterable>
							
							<el-option v-for="item in personList" :label="item.userName" :value='item.userCode'></el-option>
						</el-select>
					</el-form-item>
					

					<el-button type="primary" @click='search()' size="mini">搜索</el-button>
					
					<el-upload
					  style='display: inline-block;margin-left: 10px;float: right;margin-right: 20px;'
					  class="upload-demo"
					  action="/perTaxToolTwo/e9z/assignment/uploadExcel"
					  :on-preview="handlePreview"
					  :on-remove="handleRemove"
					  :on-success="handleSuccess"
					  :limit="1"
					  :on-exceed="handleExceed"
					  :file-list="fileList"
					  :data='postData'>
					  <el-button size="mini" type="primary">导入</el-button>
					</el-upload>
					<el-button type="primary" @click='exportExcel()' size="mini" style="margin-left: 10px;float: right;">导出</el-button>
					<el-date-picker v-model="accountPeriod" align="right" type="month" placeholder="请选择" format="yyyy-MM" size="mini"  style="margin-left: 10px;float: right;"
					 value-format="yyyy-MM">
					</el-date-picker>
					<el-button type="text" @click='downloadExcel()' size="mini" style="margin-left: 10px;float: right;">下载模板</el-button>
				</el-form>
			</div>
		</div>
		<div class='main_contain clearfix'>
			<!-- <h5>资产负债表</h5>
			<p>单位名称：{{fBrNo}}
				<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='voucherGather_print()' style='float:right'>打印</el-button>
				<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='exportExcel()' style='float:right'>导出</el-button>
			</p> -->

			<el-table :data="tableData" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<!-- <el-table-column align="" label="资产">
					<template slot-scope="scope">
						<span v-html='scope.row.fAsset'></span>
					</template>
				</el-table-column> -->
				<el-table-column align="center" label="客户名称" prop='customer_name' width="200"></el-table-column>
				<el-table-column align="center" label="账期" prop="account_period"></el-table-column>
				<el-table-column align="center" label="是否中高端" prop="tax_info_remark6">
					<template slot-scope="scope">

						<span v-if='scope.row.tax_info_remark6 == 1'>是</span>
						<span v-else>否</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="税务申报类型" prop="tax_info_remark5">
					<template slot-scope="scope">
						<span v-show='scope.row.tax_info_remark5 == 232'>小规模纳税人</span>
						<span v-show='scope.row.tax_info_remark5 == 233'>一般纳税人</span>
					</template>
				</el-table-column>

				<el-table-column align="center" label="申报周期" prop="declaration_cycle">
					<template slot-scope="scope">
						<span>{{scope.row.declaration_cycle == 0?'月报':'季报'}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="是否零申报" prop="is_zero_report">
					<template slot-scope="scope">
						<span v-if='scope.row.is_zero_report == 1'>是</span>
						<span v-else>否</span>
					</template>
				</el-table-column>

				<el-table-column align="center" label="审核会计" prop="step2"></el-table-column>

				<!-- <el-table-column align="" label="负债和所有者权益" prop="fLiabilitiesAndOwnersEquity">
					<template slot-scope="scope">
						<span v-html='scope.row.fLiabilitiesAndOwnersEquity'></span>
					</template>
				</el-table-column> -->
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button type='text' size="mini" @click='commit(scope.row,1)'>分配凭证审核</el-button>
					</template>
				</el-table-column>


			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>

		</div>
		<el-dialog title="分配" :visible.sync="dialogVisible" width="400px">
			<el-form ref="form" :model="form1" label-width="100px" size="mini">

				<el-form-item label="客户名称">
					<el-input v-model="form1.customer_name" disabled></el-input>
				</el-form-item>
				<el-form-item label="账期">
					<el-input v-model="form1.account_period" disabled></el-input>
				</el-form-item>
				<el-form-item label="分配会计">
					<el-select v-model="form1.userId" placeholder="请选择" clearable filterable>
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option v-for="item in personList" :label="item.userName" :value='item.userId'></el-option>
					</el-select>
				</el-form-item>
			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog">取 消</el-button>
				<el-button type="primary" @click="compare1">确 定</el-button>
			</span>

		</el-dialog>



	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				postData:{
					stepName:2
				},
				fileList: [],
				personList: [],
				form1: {},
				fBrNo: '',
				fYear: '',
				fPeriod: '',
				loading: false,
				value4: this.formatTimeToStr(new Date(), 'yyyy-MM'),
				selectNum: new Date().getMonth(),
				percentage: 0,
				uploadData: {
					fBrNo: '',
					taxInfoRemark5:'',
					taxInfoRemark6:'',
					declarationCycle:'',
					isZeroReport:''
				},
				tableData: [],
				customerName: '',
				currentPage: 1,
				pageSize: 10,
				total: 0,
				resultStatusList: [{
						label: 'app-已确认-同意',
						value: 1
					},
					{
						label: 'app-已确认-不同意',
						value: 2
					},
					{
						label: 'erp-已确认-同意',
						value: 3
					},
					{
						label: 'erp-已确认-不同意',
						value: 4
					},
					{
						label: '未确认-不区分来源',
						value: 5
					},
				],
				
				trueOrFalse:[
					{label:'全部',value:''},
					{label:'是',value:1},
					{label:'否',value:0},
				],
				resultStatus: null,
				customerName: "",
				
				dialogVisible: false,
				detail: {},
				custList: [],
				
				accountPeriod:'',
				customerId : '',
				remark1 : '',
				taxInfoRemark5 : '',
				taxInfoRemark6 : '',
				declarationCycle : '',
				isZeroReport : '',
				userCode:''
			}
		},
		components: {},
		methods: {
			handleRemove(file, fileList) {
			        console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			handleSuccess(response) {
				if (response.code == 200) {
					this.fileList = [];
					this.$message({
						message: response.msg,
						type: "success"
					});
				} else {
					this.fileList = [];
					this.$message({
						message: response.msg || "上传文件失败！",
						type: "error"
					});
				}
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage();
			},


			search() {
				// this.resultStatus = this.uploadData.resultStatus;
				this.customerId = this.uploadData.customerId;
				this.remark1 = this.uploadData.remark1;
				this.taxInfoRemark5 = this.uploadData.taxInfoRemark5;
				this.taxInfoRemark6 = this.uploadData.taxInfoRemark6;
				this.declarationCycle = this.uploadData.declarationCycle;
				this.isZeroReport = this.uploadData.isZeroReport;
				this.userCode = this.uploadData.userCode;
				this.queryPage()
			},

			queryPage() {
				this.loading = true;
				let params = {
					page: this.currentPage,
					row: this.pageSize,
					data: {
						"customerId": this.customerId,
						remark1 : this.remark1,
						taxInfoRemark5 : this.taxInfoRemark5,
						taxInfoRemark6 : this.taxInfoRemark6,
						declarationCycle : this.declarationCycle,
						isZeroReport : this.isZeroReport,
						keyword : this.uploadData.userCode,
						stepName:2
					}

				};
				this.axios.post('/perTaxToolTwo/e9z/assignment/queryListByPage', params)
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


			commit(row, type) {
				this.dialogVisible = true;
				this.form1 = JSON.parse(JSON.stringify(row));

			},

			hideDialog(){
				this.dialogVisible = false;
			},


			getAssignmentCustomer() {
				let params = {
					"stepName": 2
				};
				this.axios.post('/perTaxToolTwo/e9z/assignment/getAssignmentCustomer', params)
					.then(res => {
						if (res.data.code == 200) {
							this.custList = res.data.data;
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
			queryPersonList() {
				let params = {
					"page": 1,
					"row": 999,
					"data": {
						type: 1
					}
				}
				this.axios.post('/perTaxToolTwo/hrEmpInfo/findHrEmpInfoPage', params).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hrEmpInfo/findHrEmpInfoPage', params).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.personList = res.data.data;
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

			compare1(row) {
				let params = {
					"list": [{
						customerId:this.form1.customer_id,
						customerName:this.form1.customer_name,
					}],
					"userId": this.form1.userId,
					accountPeriod:this.form1.account_period,
					"stepName": 2,
				};
				this.axios.post('/perTaxToolTwo/e9z/assignment/updateAll', params)
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
			},
			
			downloadExcel(){
				window.location.href = '审核会计.xls'; 
			},
			exportExcel(){
				window.location.href = '/perTaxToolTwo/e9z/assignment/exportExcel?stepName=2&accountPeriod=' + this.accountPeriod; 
			}

		},
		computed: {},
		watch: {

			'$route'(to, from) {
				// init data
				if (to.name == 'allotApprove') {
					this.queryPage();
					this.queryPersonList();
				}

			}
		},
		created() {
			this.queryPage();
			this.queryPersonList();
			
		}
	}
</script>

<style lang='less' scoped>
	.main {
		/* background: #fff; */
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		
		/deep/ .el-upload-list--text{
			float: right;
			
		}
		.el-breadcrumb {
			height: 30px;
			line-height: 29px;
			padding-left: 20px;
			/* background-color: #fff; */
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box
		}

		.card_charts {
			/* height: 350px; */
			padding-top: 10px;

			p {
				width: calc(50% - 5px);
				float: left;
				height: 24px;
				color: #333;
				margin-bottom: 4px;
				background: rgb(243, 246, 249);
			}

			p:nth-of-type(2n) {
				float: right;
			}

			p:nth-of-type(2n+1) {
				float: left;
			}

			p span {
				height: 24px;
				line-height: 24px;
			}

			p span:nth-of-type(2n) {
				float: left;
				width: 40%;
				/* text-align: right; */
				padding-right: 20px;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			p span:nth-of-type(2n+1) {
				float: left;
				width: 60%;
				text-indent: 20px
			}
		}

		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 40px;
			background-color: #ebf6fb;
		}

		/deep/ .el-table th {
			background-color: #ebf6fb;
		}

		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #ebf6fb;
		}

		/deep/ .el-table__body tr,
		.el-table__body td {
			padding: 0;
			height: 40px;
			background-color: #fff7f1;
		}

		/deep/ .el-table__body tr.el-table__row--striped {
			background-color: #ebf6fb;
		}

		/deep/ .el-table thead {
			color: #343434;
		}

		/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
			background-color: #efe9e5;
		}

		/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
			border-bottom-color: #fff;
			background: #ebf6fb;
		}

		.search_contain {
			background: #fff;
			/* height: 40px; */
			/* padding-left: 20px; */
			padding: 12px 20px;
			margin: 10px 20px;

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
			margin: 0 20px 20px;
			padding: 20px 20px 20px;
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


	.active-select {
		background-color: rgb(125, 195, 109) !important;
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
