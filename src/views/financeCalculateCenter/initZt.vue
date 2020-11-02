<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>会计工厂</el-breadcrumb-item>
			<el-breadcrumb-item>系统初始化</el-breadcrumb-item>
			<el-breadcrumb-item>未建帐套查询</el-breadcrumb-item>
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
					
					<el-button type="primary" @click='search()' size="mini">搜索</el-button>
		
				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<!-- <h5>余额表</h5> -->
			<!-- <p>单位名称：{{fBrNo}}
				<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='voucherGather_print()' style='float:right;margin-left:10px'>打印</el-button>
				<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='exportExcel()' style='float:right'>导出</el-button>
				<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='exportExcel2()' style='float:right'>导出收付账款</el-button>
			</p> -->


			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="客户名称" prop="customerName"></el-table-column>
				<el-table-column align="center" label="操作" prop="executeStatus">
					<template slot-scope="scope">
						<el-button type='text' size="mini" @click='createOne(scope.row)'>新建</el-button>
					</template>
				</el-table-column>
				
				

			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>
		</div>

		<el-dialog title='新建' :visible.sync="dialogVisible" width="400px" class='dialog'>
			<el-form :inline="true" ref="ruleForm1" :model="detail" class="demo-form-inline" label-width="100px" size="mini">
				
				<el-form-item label="账套名称" prop="customerName">
			
					<el-input v-model="detail.customerName" disabled></el-input>
				</el-form-item>
				<el-form-item label="账套号" prop="customerNum">
					<el-input v-model="detail.customerNum" disabled></el-input>
				</el-form-item>
				
				
				<el-form-item label="账套类型" prop="accountSetCodeType">
					<el-select v-model="detail.accountSetCodeType" placeholder="请选择" disabled>
						
						
						<el-option v-for='item in accountSetCodeTypeList' :label="item.label" :value='item.value' ></el-option>
					</el-select>
				</el-form-item>
				
			</el-form>
			<div class='btn_contain clearfix'>
				<el-button type="primary" @click="commitUpload" v-loading='loading1'>确定</el-button>
				<!-- <span class='commit' @click="commitUpload">确定</span> -->
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				accountSetCodeTypeList:[
					{label:'一般性企业单位',value:1},
					{label:'民办非企业单位',value:2}
				],
				dialogVisible:false,
				loading: false,
				loading1: false,
				accountPeriod: this.formatTimeToStr(new Date(), 'yyyy-MM'),
				
				uploadData: {
					customerId:'',
					accountPeriod:this.formatTimeToStr(new Date(), 'yyyy-MM'),
				},
				customerId:'',
				tableData: [],
				currentPage:1,
				total:0,
				pageSize:10,
				detail:{}
				
			}
		},
		components: {},
		methods: {
			commitUpload(){
				this.loading1 = true;
				let params = {
					customerid:this.detail.customerId,
					customername:this.detail.customerName,
				};
				this.axios.post('/perTaxToolTwo/columbusNew/tCustomerInfo/createAccountSetCode.do', params)
					.then(res => {
						
						if (res.data.code == 200) {
							this.dialogVisible = false;
							this.loading1 = false;
							this.queryPage()
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
			
			search() {
				
				this.customerId = this.uploadData.customerId;
				this.queryPage()
			},
			
			createOne(row) {
				
				let params = {
					customerid:row.customerId
				};
				this.axios.post('/perTaxToolTwo/columbusNew/tCustomerInfo/getAccountSetCodeInfo.do', params)
					.then(res => {
						
						if (res.data.code == 200) {
							this.dialogVisible = true;
							this.detail = res.data.data;
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
			
			queryPage() {
				this.loading = true;
				let params = {
					data:{
						customerid: this.customerId,
					},
					page:this.currentPage,
					row:this.pageSize
				};
				this.axios.post('/perTaxToolTwo/columbusNew/tCustomerInfo/getNoAccountSetCodeCustomerInfo.do', params)
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
			handleCurrentChange(val){
				this.currentPage = val;
				this.queryPage();
			},
			exportExcel(row,tag) {
				if(tag == 1){
					window.location.href = '/perTaxToolTwo/e9z/assignment/exportTjb?accountPeriod=' + this.accountPeriod + '&filename=' + row.step_name + '&finish=1'
				}else if(tag == 2){
					window.location.href = '/perTaxToolTwo/e9z/assignment/exportTjb?accountPeriod=' + this.accountPeriod + '&filename=' + row.step_name + '&finish=2'
				}else{
					window.location.href = '/perTaxToolTwo/e9z/assignment/exportTjb?accountPeriod=' + this.accountPeriod + '&filename=' + row.step_name
				}
				


			},
			
			
		
			
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
			height: 30px;
			line-height: 29px;
			padding-left: 20px;
			/* background-color: #fff; */
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box
		}
		
		.btn_contain {
			text-align: center;
			margin-top: 0.36rem;
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
			height:40px;
			padding-left: 20px;
			padding-top: 12px;
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
	
	/deep/ .el-form-item__content {
		width: 180px;
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
