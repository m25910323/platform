<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>税款确认</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="客户名称" prop="customerName">
						<el-select v-model="uploadData.customerName" placeholder="请选择" clearable filterable>
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option>
							<!-- <el-option v-for="item in custList" :label="item.customerName" :value='item.customerName'></el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="账期" prop="accountPeriod">

						<el-date-picker v-model="uploadData.accountPeriod" align="right" type="month" placeholder="请选择" format="yyyy-MM"
						 value-format="yyyy-MM">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="状态" prop="resultStatus">
						<el-select v-model="uploadData.resultStatus" placeholder="请选择" clearable filterable>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in resultStatusList" :label="item.label" :value='item.value'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="月税状态" prop="incomeTaxResultStatus">
						<el-select v-model="uploadData.incomeTaxResultStatus" placeholder="请选择">
							<el-option  label="全部" value=''></el-option>
							<el-option  label="未确认" value='0'></el-option>
							<el-option  label="同意" value='1'></el-option>
							<el-option  label="不同意" value='2'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所得税状态" prop="corpIncomeTaxResultStatus">
						<el-select v-model="uploadData.corpIncomeTaxResultStatus" placeholder="请选择">
							<el-option  label="全部" value=''></el-option>
							<el-option  label="未确认" value='0'></el-option>
							<el-option  label="同意" value='1'></el-option>
							<el-option  label="不同意" value='2'></el-option>
						</el-select>
					</el-form-item>

					<el-button type="primary" @click='search()' size="mini">搜索</el-button>

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
				<el-table-column align="center" label="客户名称" prop='taxInfoRemark2' width="200"></el-table-column>
				<el-table-column align="center" label="账期" prop="accountPeriod"></el-table-column>
				<el-table-column align="center" label="纳税申报类型" prop='taxInfoRemark5'>
					<template slot-scope="scope">
						<span v-show='scope.row.taxInfoRemark5 == 232'>小规模纳税人</span>
						<span v-show='scope.row.taxInfoRemark5 == 233'>一般纳税人</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="申报周期" prop="declaration_cycle">
					<template slot-scope="scope">
						<span v-show='scope.row.declaration_cycle == 0'>月报</span>
						<span v-show='scope.row.declaration_cycle == 1'>季报</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="企业所得税征收方式" prop="taxInfoRemark1">
					<template slot-scope="scope">
						<span>{{scope.row.taxInfoRemark1?scope.row.taxInfoRemark1:'--'}}</span>
						
					</template>
				</el-table-column>
				<el-table-column align="center" label="审核会计" prop="checkAccountant"></el-table-column>
				<el-table-column align="center" label="做账会计" prop="doAccountant"></el-table-column>
				<el-table-column align="center" label="税款" prop="taxAmount"></el-table-column>
				<el-table-column align="center" label="税款明细">
					<template slot-scope="scope">
						<el-button type='primary' size="mini" @click='showDetail(scope.row)'>查看</el-button>
					</template>
				</el-table-column>
				<el-table-column align="center" label="月税确认">
					<template slot-scope="scope">
						<span v-show='scope.row.incomeTaxResultStatus == 0'>未确认</span>
						<span v-show='scope.row.incomeTaxResultStatus == 1'>同意</span>
						<span v-show='scope.row.incomeTaxResultStatus == 2'>不同意</span>
						<span v-show='scope.row.incomeTaxResultStatus == null'>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="应交所得税" prop="incomeTaxation"></el-table-column>
				<el-table-column align="center" label="所得税明细">
					<template slot-scope="scope">
						<el-button type='primary' size="mini" @click='showDetail1(scope.row)' :disabled='scope.row.accountPeriod.slice(5,7)%3 != 0'>查看</el-button>
					</template>
				</el-table-column>
				<el-table-column align="center" label="所得税确认">
					<template slot-scope="scope">
						<span v-show='scope.row.corpIncomeTaxResultStatus == 0'>未确认</span>
						<span v-show='scope.row.corpIncomeTaxResultStatus == 1'>同意</span>
						<span v-show='scope.row.corpIncomeTaxResultStatus == 2'>不同意</span>
						<span v-show='scope.row.corpIncomeTaxResultStatus == null'>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="提交时间" prop="endTime">
					<template slot-scope="scope">
						<span>{{scope.row.endTime?formatTimeToStr(scope.row.endTime,'yyyy-MM-dd'):'--'}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="提交状态" prop="executeStatus">
					<template slot-scope="scope">
						<span v-show='scope.row.executeStatus == 0'>未开始</span>
						<span v-show='scope.row.executeStatus == 1'>执行中</span>
						<span v-show='scope.row.executeStatus == 2'>已完成</span>
						<span v-show='scope.row.executeStatus == 3'>回退</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="提交人" prop="executeUserName"></el-table-column>
				<!-- <el-table-column align="" label="负债和所有者权益" prop="fLiabilitiesAndOwnersEquity">
					<template slot-scope="scope">
						<span v-html='scope.row.fLiabilitiesAndOwnersEquity'></span>
					</template>
				</el-table-column> -->
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button type='text' size="mini" @click='commit(scope.row,1)' v-show='scope.row.executeStatus != 2 && scope.row.executeStatus != 3'>月税-同意</el-button>
						<el-button type='text' size="mini" @click='commit(scope.row,2)' v-show='scope.row.executeStatus != 2 && scope.row.executeStatus != 3'>月税-不同意</el-button>
						<el-button type='text' size="mini" @click='commit1(scope.row,1)' v-show='scope.row.executeStatus != 2 && scope.row.executeStatus != 3 && scope.row.accountPeriod.slice(5,7)%3 == 0 && scope.row.corpIncomeTaxResultStatus == 0'>所得税-同意</el-button>
						<el-button type='text' size="mini" @click='commit1(scope.row,2)' v-show='scope.row.executeStatus != 2 && scope.row.executeStatus != 3 && scope.row.accountPeriod.slice(5,7)%3 == 0 && scope.row.corpIncomeTaxResultStatus == 0'>所得税-不同意</el-button>
					</template>
				</el-table-column>
				<el-table-column align="center" label="备注" prop="remark"></el-table-column>

			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>

		</div>

		<el-dialog :title="title" :visible.sync="dialogVisible" width="1000px" class='dialog'>
			<div>
				<div class="card_charts clearfix">
					<p>
						<span>收入 - 总收入</span>
						<span :title="detail.allIncome">{{detail.allIncome.toFixed(2)}}</span>
					</p>
					<p>
						<span>申报周期</span>
						<span :title="detail.declarationCycle">{{detail.declarationCycle.toFixed(2)}}</span>
					</p>
					<p v-if="taxInfoRemark5 == 232 && declarationCycle == 1">
						<span>季报数据第一月收入</span>
						<span :title="detail.allIncomeOne">{{detail.allIncomeOne.toFixed(2)}}</span>
					</p>
					<p v-if="taxInfoRemark5 == 232 && declarationCycle == 1&&accountPeriod1.slice(5,7)%3 != 1">
						<span>季报数据第二月收入</span>
						<span :title="detail.allIncomeTwo">{{detail.allIncomeTwo.toFixed(2)}}</span>
					</p>
					<p v-if="taxInfoRemark5 == 232 && declarationCycle == 1&&accountPeriod1.slice(5,7)%3 == 0">
						<span>季报数据第三月收入</span>
						<span :title="detail.allIncomeThree">{{detail.allIncomeThree.toFixed(2)}}</span>
					</p>
					<!-- <p>
						<span>预交增值税</span>
						<span :title="detail.vatPrepare">{{detail.vatPrepare}}</span>
					</p> -->
					<!-- <p>
						<span>本期留底预交增值税</span>
						<span :title="detail.businessTaxTaxation">{{detail.businessTaxTaxation}}</span>
					</p> -->
					<p v-if="taxInfoRemark5 == 233">
						<span>本期留底</span>
						<span :title="detail.currentPeriodKeep">{{detail.currentPeriodKeep.toFixed(2)}}</span>
					</p>
					<p v-if="taxInfoRemark5 == 233">
						<span>上期留底</span>
						<span :title="detail.counterfoil">{{detail.counterfoil.toFixed(2)}}</span>
					</p>
					<!-- <p>
						<span>一般项目加计抵减：本期实际抵减额</span>
						<span :title="detail.currentRealityDeductibleAmount">{{detail.currentRealityDeductibleAmount}}</span>
					</p> -->
					<p>
						<span>减免增值税</span>
						<span :title="detail.abatementVat">{{detail.abatementVat.toFixed(2)}}</span>
					</p>
					<p>
						<span>销项税</span>
						<span :title="detail.allOutputTax">{{detail.allOutputTax.toFixed(2)}}</span>
					</p>
					<!-- <p>
						<span>进项税</span>
						<span :title="detail.allInputTax">{{detail.allInputTax}}</span>
					</p> -->
					<p v-if="taxInfoRemark5 == 233">
						<span>一般纳税人进项税转出</span>
						<span :title="detail.changeoverinputVat">{{detail.changeoverinputVat.toFixed(2)}}</span>
					</p>
					<p>
						<span>消费税</span>
						<span :title="detail.allConsumptionTaxation">{{detail.allConsumptionTaxation.toFixed(2)}}</span>
					</p>
					<!-- <p>
						<span>营业税</span>
						<span :title="detail.allBusinessTaxTaxation">{{detail.allBusinessTaxTaxation}}</span>
					</p> -->
					<p>
						<span>文化事业建设费</span>
						<span :title="detail.education">{{detail.education.toFixed(2)}}</span>
					</p>
					<p v-if="taxInfoRemark5 == 233">
						<span>本期进项税</span>
						<span :title="detail.allInputTax">{{detail.allInputTax.toFixed(2)}}</span>
					</p>
					<p>
						<span>国税-增值税</span>
						<span :title="detail.allTaxAmount">{{detail.allTaxAmount.toFixed(2)}}</span>
					</p>
					<!-- <p>
						<span>国税-即征即退增值税</span>
						<span :title="detail.jzVat">{{detail.jzVat}}</span>
					</p> -->
					<p>
						<span>地税-城建税</span>
						<span :title="detail.allUrbanTaxation">{{detail.allUrbanTaxation.toFixed(2)}}</span>
					</p>
					<p>
						<span>地税-教育附加税</span>
						<span :title="detail.allEsTaxation">{{detail.allEsTaxation.toFixed(2)}}</span>
					</p>
					<p>
						<span>地税-地方教育附加税</span>
						<span :title="detail.allAleTaxation">{{detail.allAleTaxation.toFixed(2)}}</span>
					</p>
					<p>
						<span>地税-印花税</span>
						<span :title="detail.allStampDutyTaxation">{{detail.allStampDutyTaxation.toFixed(1)}}</span>
					</p>
					<p>
						<span>个税-个人所得税</span>
						<span :title="detail.wages">{{detail.wages.toFixed(2)}}</span>
					</p>
					<p>
						<span>合计</span>
						<span :title="detail.allTotal">{{detail.allTotal.toFixed(2)}}</span>
					</p>
				</div>
			</div>

		</el-dialog>
		
		
		<el-dialog :title="title1" :visible.sync="dialogVisible1" width="1000px" class='dialog'>
			<div>
				<div class="card_charts clearfix">
					<p>
						<span>收入 - 主营业务收入</span>
						<span :title="detail1.income">{{detail1.income.toFixed(2)}}</span>
					</p>
					<p>
						<span>收入合计</span>
						<span :title="detail1.incomeSum">{{detail1.incomeSum.toFixed(2)}}</span>
					</p>
					<p>
						<span>成本</span>
						<span :title="detail1.cost">{{detail1.cost.toFixed(2)}}</span>
					</p>
					<p>
						<span>费用</span>
						<span :title="detail1.fee">{{detail1.fee.toFixed(2)}}</span>
					</p>
					<p>
						<span>利润</span>
						<span :title="detail1.profit">{{detail1.profit.toFixed(2)}}</span>
					</p>
					
					
					<p>
						<span>可弥补以前年度亏损额</span>
						<span :title="detail1.priorYearLoss">{{detail1.priorYearLoss.toFixed(2)}}</span>
					</p>
					<p>
						<span>实际弥补以前年度亏损额</span>
						<span :title="detail1.remedyPriorYearLoss">{{detail1.remedyPriorYearLoss.toFixed(2)}}</span>
					</p>
					<p>
						<span>核定征收率</span>
						<span :title="detail1.verifiedRate">{{detail1.verifiedRate}}</span>
					</p>
					<p>
						<span>应纳税所得额</span>
						<span :title="detail1.taxableIncome">{{detail1.taxableIncome.toFixed(2)}}</span>
					</p>
					<p>
						<span>所得税税率</span>
						<span :title="detail1.incomeTaxRate">{{detail1.incomeTaxRate}}</span>
					</p>
					<p>
						<span>合计应交所得税</span>
						<span :title="detail1.totalIncomeTaxation">{{detail1.totalIncomeTaxation.toFixed(2)}}</span>
					</p>
					<p>
						<span>已交所得税</span>
						<span :title="detail1.paidIncomeTaxation">{{detail1.paidIncomeTaxation.toFixed(2)}}</span>
					</p>
					<p>
						<span>应交所得税</span>
						<span :title="detail1.incomeTaxation">{{detail1.incomeTaxation.toFixed(2)}}</span>
					</p>
					<p>
						<span>累计预缴所得税</span>
						<span :title="detail1.prepayIncomeTaxation">{{detail1.prepayIncomeTaxation.toFixed(2)}}</span>
					</p>
					<p>
						<span>未提供成本发票金额</span>
						<span :title="detail1.costInvAmt">{{detail1.costInvAmt.toFixed(2)}}</span>
					</p>
					<p>
						<span>未提供费用发票金额</span>
						<span :title="detail1.feeInvAmt">{{detail1.feeInvAmt.toFixed(2)}}</span>
					</p>
					<!-- <p>
						<span>汇算调整后累计利润</span>
						<span :title="detail1.settlementProfit">{{detail1.settlementProfit.toFixed(2)}}</span>
					</p>
					<p>
						<span>汇算后需补缴企业所得税税款</span>
						<span :title="detail1.addIncomeTaxation">{{detail1.addIncomeTaxation.toFixed(2)}}</span>
					</p> -->
					
				</div>
			</div>
		
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				title:'',
				title1:'',
				fBrNo: '',
				fYear: '',
				fPeriod: '',
				loading: false,
				value4: this.formatTimeToStr(new Date(), 'yyyy-MM'),
				selectNum: new Date().getMonth(),
				percentage: 0,
				uploadData: {
					fBrNo: '',
					accountPeriod :''
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
				resultStatus: null,
				customerName: "",
				accountPeriod: "",
				incomeTaxResultStatus:'',
				corpIncomeTaxResultStatus:'',
				dialogVisible: false,
				dialogVisible1: false,
				detail: {
					allIncome:0,
					declarationCycle:0,
					allIncomeOne:0,
					allIncomeTwo:0,
					allIncomeThree:0,
					currentPeriodKeep:0,
					counterfoil:0,
					abatementVat:0,
					allOutputTax:0,
					changeoverinputVat:0,
					allConsumptionTaxation:0,
					education:0,
					allInputTax:0,
					allTaxAmount:0,
					allUrbanTaxation:0,
					allEsTaxation:0,
					allAleTaxation:0,
					allStampDutyTaxation:0,
					wages:0,
					allTotal:0,
					
				},
				detail1:{
					income:0,
					incomeSum:0,
					cost:0,
					fee:0,
					profit:0,
					priorYearLoss:0,
					remedyPriorYearLoss:0,
					verifiedRate:0,
					taxableIncome:0,
					incomeTaxRate:0,
					totalIncomeTaxation:0,
					paidIncomeTaxation:0,
					incomeTaxation:0,
					prepayIncomeTaxation:0,
					costInvAmt:0,
					feeInvAmt:0,
					settlementProfit:0,
					addIncomeTaxation:0,
				},
				custList: [],
				taxInfoRemark5: '',
				declarationCycle: '',
				accountPeriod1: ''
			}
		},
		components: {},
		methods: {
			resetDetail(){
				this.detail= {
					allIncome:0,
					declarationCycle:0,
					allIncomeOne:0,
					allIncomeTwo:0,
					allIncomeThree:0,
					currentPeriodKeep:0,
					counterfoil:0,
					abatementVat:0,
					allOutputTax:0,
					changeoverinputVat:0,
					allConsumptionTaxation:0,
					education:0,
					allInputTax:0,
					allTaxAmount:0,
					allUrbanTaxation:0,
					allEsTaxation:0,
					allAleTaxation:0,
					allStampDutyTaxation:0,
					wages:0,
					allTotal:0,
					
				}
			},
			resetDetail1(){
				this.detail1= {
					income:0,
					incomeSum:0,
					cost:0,
					fee:0,
					profit:0,
					priorYearLoss:0,
					remedyPriorYearLoss:0,
					verifiedRate:0,
					taxableIncome:0,
					incomeTaxRate:0,
					totalIncomeTaxation:0,
					paidIncomeTaxation:0,
					incomeTaxation:0,
					prepayIncomeTaxation:0,
					costInvAmt:0,
					feeInvAmt:0,
					settlementProfit:0,
					addIncomeTaxation:0,
				}
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage();
			},
			setMonth() {
				// alert(this.value4.substring(this.value4.length-2));
				this.selectNum = this.value4.substring(this.value4.length - 2) - 1;
				this.percentage = this.selectNum * (100 / 12);
				this.queryPage()
			},
			selectNumChange(index) {
				this.selectNum = index;
				this.percentage = index * (100 / 12);
				console.log('width:calc(' + this.percentage + '% + ' + 850 / 24 + 'px)');
				this.value4 = this.value4.substring(0, 5) + (index + 1)
				this.queryPage()
			},
			search() {
				this.resultStatus = this.uploadData.resultStatus;
				this.customerName = this.uploadData.customerName;
				this.accountPeriod = this.uploadData.accountPeriod;
				this.corpIncomeTaxResultStatus = this.uploadData.corpIncomeTaxResultStatus;
				this.incomeTaxResultStatus = this.uploadData.incomeTaxResultStatus;
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
					page: this.currentPage,
					row: this.pageSize,
					data: {
						// "fBrNo": this.fBrNo,
						// "fPeriod": this.fPeriod,
						"stepName": "税款确认",
						resultStatus: this.resultStatus,
						customerName: this.customerName,
						accountPeriod: this.accountPeriod,
						incomeTaxResultStatus: this.incomeTaxResultStatus,
						corpIncomeTaxResultStatus: this.corpIncomeTaxResultStatus
					}

				};
				this.axios.post('/perTaxToolTwo/e9z/taxStep/getInfoByStepName', params)
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
			exportExcel() {
				window.location.href = '/perTaxToolTwo/e9/sheet/exportBalanceSheet?fBrNo=' + this.fBrNo + '&fYear=' + this.fYear +
					'&fPeriod=' + this.fPeriod + '&customerType=1';


			},

			commit(row, type) {
				if (type == 1) {
					var title = "确认月税-同意？";
				} else {
					var title = "确认月税-不同意";
				}
				this.$prompt('请输入备注', title, {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({
					value
				}) => {
					let params = {
						"resultStatus": type,
						"taxationId": row.taxationId,
						"taxInfoId": row.taxInfoId,
						"id": row.incomeTaxRecord,
						'remark': value
					};
					this.axios.post('/perTaxToolTwo/e9z/e9zBusinessIncomeTaxRecord/updateErpOperateInfoOfTaxRecord', params)
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							this.loading = false;
							if (res.data.code == 200) {
								this.queryPage();

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
						message: '取消输入'
					});
				});


			},
			
			commit1(row, type) {
				if (type == 1) {
					var title = "确认所得税-同意？";
				} else {
					var title = "确认所得税-不同意";
				}
				this.$prompt('请输入备注', title, {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({
					value
				}) => {
					let params = {
						"resultStatus": type,
						"source": 2,
						"accountPeriod": row.accountPeriod,
						"customerName": row.taxInfoRemark2,
						"customerId": row.customerId,
						'remark': value,
						'id':row.corpIncomeTaxRecordId,
					};
					this.axios.post('/perTaxToolTwo/import/confirmCorpIncomeTax', params)
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							
							if (res.data.code == 200) {
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
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});
			
			
			},

			showDetail(row) {
				this.taxInfoRemark5 = row.taxInfoRemark5;
				this.declarationCycle = row.declaration_cycle;
				this.accountPeriod1 = row.accountPeriod;
				this.dialogVisible = true;
				this.resetDetail();
				this.title = row.taxInfoRemark2 + '税款明细';
				let params = {
					id: row.incomeTaxRecord,
					accountPeriod: row.accountPeriod
					// id:1
				};
				this.axios.post('/perTaxToolTwo/e9z/e9zBusinessIncomeTaxRecord/getIncomeTaxRecordById', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.detail = res.data.data;
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
			
			
			showDetail1(row){
				if(row.taxInfoId){
				// if(row.corpIncomeTaxRecordId){
					this.dialogVisible1 = true;
					this.resetDetail1();
					this.title1 = row.taxInfoRemark2 + '所得税明细';
					let params = {
						// id: row.corpIncomeTaxRecordId,
						taxInfoId:row.taxInfoId,
					};
					this.axios.post('/perTaxToolTwo/e9z/corpIncomeTax/selectCorpIncomeTax', params)
					// this.axios.post('/perTaxToolTwo/import/findCorpIncomeTaxById', params)
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							this.loading = false;
							if (res.data.code == 200) {
								this.detail1 = res.data.data;
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
				}else{
					this.$message({
						message: "暂无所得税明细",
						type: "warning"
					});
				}
				
			},


			//====判断是否需要安装CLodop云打印服务器:====



			/*获取当前的年、月*/

			/*获取本期的年、月*/

			/*获取每个月的最后一天*/

			getProofTVoucher(val) {
				let params = {
					"fBrNo": val
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVoucher', this.qs.stringify(params), {
						// this.axios.post('/miaoxing/queryPage', params)
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					.then(res => {
						if (res.data.code == 200) {
							this.voucherInfo = res.data.data;
							this.uploadData.fYear = res.data.data.fyear.toString();
							this.uploadData.fPeriod = res.data.data.fperiod;
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
			getAssignmentCustomer() {
				let params = {
					"stepName": 3
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
			}
		},
		computed: {},
		watch: {

			'$route'(to, from) {
				// init data
				if (to.name == 'taxConfirm') {
					this.queryPage();
					// var updateUser = JSON.parse(sessionStorage.getItem('updateUser'));
					// var userTypeId = updateUser.userTypeId;
					// if(userTypeId == 1){
					// 	this.custList = JSON.parse(sessionStorage.getItem('updateCust'));
					// }else{
					// 	this.getAssignmentCustomer();
					// }
				}

			}
		},
		created() {
			this.getCurrentPeriod()
			// this.queryPage();
			// var updateUser = JSON.parse(sessionStorage.getItem('updateUser'));
			// var userTypeId = updateUser.userTypeId;

			// if(userTypeId == 1){
			// 	this.custList = JSON.parse(sessionStorage.getItem('updateCust'));
			// }else{
			// 	this.getAssignmentCustomer();
			// }
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
			height: 40px;
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
