<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>统计表</el-breadcrumb-item>
			<el-breadcrumb-item>一级统计表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					
					<el-form-item label="账期" prop="accountPeriod">
						<el-date-picker v-model="uploadData.accountPeriod" type="month" format="yyyy-MM" value-format="yyyy-MM">
						</el-date-picker>
					
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


			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading' show-summary>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="环节" prop="step_name"></el-table-column>
				<el-table-column align="center" label="未完成" prop='unfinish'>
					<template slot-scope="scope">
						<el-button type="text" size="mini" :disabled="!scope.row.unfinish" @click="showDetail(scope.row,1)">{{scope.row.unfinish}}</el-button>
					</template>
				</el-table-column>
				<el-table-column align="center" label="已完成" prop="finish">
					<template slot-scope="scope">
						<el-button type="text" size="mini" :disabled="!scope.row.finish" @click="showDetail(scope.row,2)">{{scope.row.finish}}</el-button>
						
					</template>
				</el-table-column>
				<el-table-column align="center" label="合计" prop="cou">
					<template slot-scope="scope">
						<el-button type="text" size="mini" :disabled="!scope.row.cou" @click="showDetail(scope.row,'')">{{scope.row.cou}}</el-button>
						
					</template>
				</el-table-column>
				

			</el-table>
		</div>
		
		<el-dialog title="查看" :visible.sync="dialogVisible" width="1200px">
			<el-button type="primary" size="mini" @click='exportExcel'>导出</el-button>
			<el-table :data="detail.slice((currentPage - 1)*10,(currentPage - 1)*10 + 10)" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="账期" prop="account_period"  v-if="row.step_name != '凭证待入库'"></el-table-column>
				<el-table-column align="center" label="客户名称" prop='customer_name' v-if="row.step_name != '凭证待入库'"></el-table-column>
				<el-table-column align="center" label="申报税务类型" prop="tax_type" v-if="row.step_name != '凭证待入库'"></el-table-column>
				<el-table-column align="center" label="申报周期" prop="declaration_cycle" v-if="row.step_name != '凭证待入库'"></el-table-column>
				//税款审核 发票审核 
				<el-table-column align="center" label="发票审核人" prop="user_name" v-if="row.step_name == '税款审核' || row.step_name == '发票审核'"></el-table-column>
				<el-table-column align="center" label="凭证审核人" prop="approve_user" v-if="row.step_name == '税款审核' || row.step_name == '发票审核'"></el-table-column>
				<el-table-column align="center" label="流入时间" prop="assign_time" v-if="row.step_name == '税款审核' || row.step_name == '发票审核'">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.assign_time,'yyyy-MM-dd')}}</span>
						
					</template>
				</el-table-column>
				//税款确认 收账通知
				<el-table-column align="center" label="客服分配人" prop="sztz_user" v-if="row.step_name == '税款确认' || row.step_name == '收账通知'"></el-table-column>
				<el-table-column align="center" label="提交状态" prop='execute_status' v-if="row.step_name == '税款确认' || row.step_name == '收账通知'"></el-table-column>
				<el-table-column align="center" label="提交人" prop="execute_user_name" v-if="row.step_name == '税款确认' || row.step_name == '收账通知'"></el-table-column>
				<el-table-column align="center" label="提交时间" prop="assign_time" v-if="row.step_name == '税款确认' || row.step_name == '收账通知'">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.assign_time,'yyyy-MM-dd')}}</span>
						
					</template>
				</el-table-column>
				<el-table-column align="center" label="流入时间" prop="assign_time" v-if="row.step_name == '税款确认' || row.step_name == '收账通知'">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.assign_time,'yyyy-MM-dd')}}</span>
						
					</template>
				</el-table-column>
				<el-table-column align="center" label="备注" prop='remark' v-if="row.step_name == '税款确认' || row.step_name == '收账通知'"></el-table-column>
				//发票上传
				<el-table-column align="center" label="发票张数" prop="cou" v-if="row.step_name == '发票上传'"></el-table-column>
				<el-table-column align="center" label="发票审核人" prop="user_name" v-if="row.step_name == '发票上传'"></el-table-column>
				<el-table-column align="center" label="最后一次提交人" prop='last_submit_user_name' v-if="row.step_name == '发票上传'"></el-table-column>
				<el-table-column align="center" label="最后一次提交时间" prop="last_submit_time" v-if="row.step_name == '发票上传'">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.last_submit_time,'yyyy-MM-dd')}}</span>
						
					</template>
				</el-table-column>
				<el-table-column align="center" label="APP确认状态" prop='appState' v-if="row.step_name == '发票上传'"></el-table-column>
				//凭证审核
				<el-table-column align="center" label="发票审核人" prop="user_name" v-if="row.step_name == '凭证审核'"></el-table-column>
				<el-table-column align="center" label="凭证审核人" prop="approve_user" v-if="row.step_name == '凭证审核'"></el-table-column>
				<el-table-column align="center" label="初审状态" prop="first_check_state" v-if="row.step_name == '凭证审核'"></el-table-column>
				<el-table-column align="center" label="流入时间" prop="assign_time" v-if="row.step_name == '凭证审核'">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.assign_time,'yyyy-MM-dd')}}</span>
						
					</template>
				</el-table-column>
				
				//所得税问题处理 报表审核 利润通知
				<el-table-column align="center" label="审核会计" prop="user_name" v-if="row.step_name == '所得税问题处理' || row.step_name == '报表审核' || row.step_name == '利润通知'"></el-table-column>
				
				<el-table-column align="center" label="流入时间" prop="assign_time" v-if="row.step_name == '所得税问题处理' || row.step_name == '报表审核' || row.step_name == '利润通知'">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.assign_time,'yyyy-MM-dd')}}</span>
						
					</template>
				</el-table-column>
				
				//纳税申报
				<el-table-column align="center" label="国税申报分配人" prop="guo_user" v-if="row.step_name == '纳税申报'"></el-table-column>
				<el-table-column align="center" label="国税申报状态" prop='guo_state' v-if="row.step_name == '纳税申报'"></el-table-column>
				<el-table-column align="center" label="国税申报人" prop="tax_report_user_name" v-if="row.step_name == '纳税申报'"></el-table-column>
				<el-table-column align="center" label="国税申报时间" prop="tax_report_time" v-if="row.step_name == '纳税申报'">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.tax_report_time,'yyyy-MM-dd')}}</span>
						
					</template>
				</el-table-column>
				<el-table-column align="center" label="国税申报备注" prop="tax_report_remark" v-if="row.step_name == '纳税申报'"></el-table-column>
				
				
				<el-table-column align="center" label="个税申报分配人" prop="ge_user" v-if="row.step_name == '纳税申报'"></el-table-column>
				<el-table-column align="center" label="个税申报状态" prop='ge_state' v-if="row.step_name == '纳税申报'"></el-table-column>
				<el-table-column align="center" label="个税申报人" prop="per_tax_report_user_name" v-if="row.step_name == '纳税申报'"></el-table-column>
				<el-table-column align="center" label="个税申报时间" prop="per_tax_report_time" v-if="row.step_name == '纳税申报'">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.per_tax_report_time,'yyyy-MM-dd')}}</span>
						
					</template>
				</el-table-column>
				<el-table-column align="center" label="个税申报备注" prop="per_tax_report_remark" v-if="row.step_name == '纳税申报'"></el-table-column>
				
				<el-table-column align="center" label="所得税申报分配人" prop="sds_user" v-if="row.step_name == '纳税申报'"></el-table-column>
				<el-table-column align="center" label="所得税申报状态" prop='sds_state' v-if="row.step_name == '纳税申报'"></el-table-column>
				<el-table-column align="center" label="所得税申报人" prop="corp_tax_user_name" v-if="row.step_name == '纳税申报'"></el-table-column>
				<el-table-column align="center" label="所得税申报时间" prop="corp_tax_report_time" v-if="row.step_name == '纳税申报'">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.corp_tax_report_time,'yyyy-MM-dd')}}</span>
						
					</template>
				</el-table-column>
				<el-table-column align="center" label="所得税申报备注" prop="corp_tax_remark" v-if="row.step_name == '纳税申报'"></el-table-column>
				<el-table-column align="center" label="流入时间" prop="assign_time" v-if="row.step_name == '纳税申报'">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.assign_time,'yyyy-MM-dd')}}</span>
						
					</template>
				</el-table-column>
				
				
				<el-table-column align="center" label="账期" prop="accountPeriod" v-if="row.step_name == '凭证待入库'"></el-table-column>
				<el-table-column align="center" label="客户名称" prop='customerName' v-if="row.step_name == '凭证待入库'"></el-table-column>
				<el-table-column align="center" label="是否入库" prop="assign_time" v-if="row.step_name == '凭证待入库'">
					<template slot-scope="scope">
						<span v-show='scope.row.isHaveEntity == 0'>未入库</span>
						<span v-show='scope.row.isHaveEntity == 1'>已入库</span>
						<span v-show='scope.row.isHaveEntity == 2'>无需入库</span>
						<span v-show='scope.row.isHaveEntity == 3'>待入库</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" prop="assign_time">
					<template slot-scope="scope">
						<!-- <el-button type="text" size="mini" v-show="scope.row.isHaveEntity == 0 || scope.row.isHaveEntity == 3" @click='handleEdit(scope.row)'>确认入库</el-button> -->
						<el-button type="text" size="mini" v-show="scope.row.isHaveEntity == 0 || scope.row.isHaveEntity == 3" @click='updateEntity(scope.row,1)'>确认入库</el-button>
						<el-button type="text" size="mini" v-show="scope.row.isHaveEntity == 0 || scope.row.isHaveEntity == 3" @click='updateEntity(scope.row,2)'>无需入库</el-button>
						<el-button type="text" size="mini" v-show="scope.row.isHaveEntity == 1 || scope.row.isHaveEntity == 2" @click='updateEntity(scope.row,0)'>撤销</el-button>
					</template>
				</el-table-column>
				
				
			</el-table>
			<el-pagination background style="margin-top:10px;text-align: center;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="detail.length">
			</el-pagination>
		
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false" type="primary">关闭</el-button>
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
				accountPeriod: this.formatTimeToStr(new Date(), 'yyyy-MM'),
				
				uploadData: {
					accountPeriod:this.formatTimeToStr(new Date(), 'yyyy-MM'),
				},
				customerId: 0,
				tableData: [],
				dialogVisible: false,
				detail: [],
				currentPage:1,
				total:0,
				pageSize:10,
				row:{}
				
			}
		},
		components: {},
		methods: {
			handleCurrentChange(val) {
				this.currentPage = val;
			},
			
			search() {
				this.accountPeriod = this.uploadData.accountPeriod;
				
				this.queryPage()
			},
			
			getCurrentPeriod() {
				
				let params = {
					
				};
				this.axios.post('/perTaxToolTwo/e9z/taxTreatment/getCurrentPeriod', params)
					.then(res => {
						
						if (res.data.code == 200) {
							this.uploadData.accountPeriod = res.data.data;
							this.accountPeriod = res.data.data;
							this.queryPage();
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
					accountPeriod: this.accountPeriod,
					
				};
				this.axios.post('/perTaxToolTwo/e9z/assignment/countTjb', params)
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
			showDetail(row, tag) {
				this.dialogVisible = true;
				if(row){
					this.row = row;
					this.tag = tag;
				}
				let params = {
					"stepName": this.row.step_name,
					"accountPeriod": this.accountPeriod,
					"finish": this.tag,
				};
				this.axios.post('/perTaxToolTwo/e9z/assignment/getStatisticalTableDetail', params)
					.then(res => {
						if (res.data.code == 200) {
							this.detail = res.data.data;
			
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
			handleEdit(row){
				let params = {
					customerId: row.customerId,
					customerName: row.customerName,
					accountPeriod: row.accountPeriod,	
					mainId:row.mainId,	
				};
				this.axios.post('/perTaxToolTwo/iocr/main/submitHaveEntity', params)
					.then(res => {
						if (res.data.code == 200) {
							this.showDetail();
				
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
			updateEntity(row,type){
				let params = {
					"mainId": row.mainId,
					"isHaveEntity": type
				};
				this.axios.post('/perTaxToolTwo/iocr/main/updateEntity', params)
					.then(res => {
						if (res.data.code == 200) {
							this.showDetail();
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
			exportExcel(row,tag) {
				if(this.tag == 1){
					window.location.href = '/perTaxToolTwo/e9z/assignment/exportTjb?accountPeriod=' + this.accountPeriod + '&filename=' + this.row.step_name + '&finish=1'
				}else if(this.tag == 2){
					window.location.href = '/perTaxToolTwo/e9z/assignment/exportTjb?accountPeriod=' + this.accountPeriod + '&filename=' + this.row.step_name + '&finish=2'
				}else{
					window.location.href = '/perTaxToolTwo/e9z/assignment/exportTjb?accountPeriod=' + this.accountPeriod + '&filename=' + this.row.step_name
				}
				


			},
			
			
		
			
		},
		computed: {},
		created() {
			this.getCurrentPeriod();
			// this.queryPage();
			
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

	.Article {
		/*  background: red;
    opacity: 0.2; */
		margin: 0;
		position: relative;
		/* padding-top: 53px; */

		.Article-title {
			width: 850px;
			height: 20px;
			margin: 0 auto;
			box-sizing: border-box;
			box-sizing: content-box;

			.Article-title-nav {
				width: calc(100% / 12);
				height: 38px;
				display: inline-block;
				font-size: 12px;
				text-align: center;
				line-height: 38px;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: #999;
			}
		}

		.Article-nav {
			width: 850px;
			height: 18px;
			margin: 0 auto;
			box-sizing: border-box;
			box-sizing: content-box;
			/* background-color: red; */
			padding-top: 10px;
			padding-bottom: 10px;
			display: flex;
			flex-direction: row;
			position: relative;
			z-index: 1000;
			position: absolute;
			left: calc(50% - 425px);
			justify-content: space-around;

			.Article-circle {
				display: inline-block;
				width: 8px;
				height: 8px;
				border: 1px solid rgb(125, 195, 109);
				background: #fff;
				border-radius: 50%;
				margin: 0 20px;
			}
		}

		.line {
			width: 850px;
			height: 1px;
			background-color: #DCDCDC;
			position: absolute;
			left: 50%;
			top: 34px;
			transform: translate(-50%, -50%);
			z-index: 1;

			.line-chiled {
				height: 1px;
				background: rgb(125, 195, 109);
			}
		}

		.Article-nav div:nth-of-type(2) {
			margin-left: 20px;
		}

		.Article-nav div:nth-of-type(3) {
			margin-left: 20px;
		}

		.Article-nav div:nth-of-type(4) {
			margin-left: 20px;
		}

		.Article-nav div:nth-of-type(5) {
			margin-left: 20px;
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
