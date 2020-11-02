<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>客服中心</el-breadcrumb-item>
			<el-breadcrumb-item>税款通知</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body clearfix">
			<div>
				<h3>税款通知</h3>
				<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;">
					<el-form inline :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="100px">

						<el-form-item label="客户名称" prop="customerName">
							<el-input v-model="uploadData.customerName" placeholder="请输入" clearable>
							</el-input>
						</el-form-item>

						<el-form-item label="账期" prop="accountPeriod">
							<el-date-picker v-model="uploadData.accountPeriod" align="right" type="month" placeholder="请选择" format="yyyy-MM"
							 value-format="yyyy-MM">
							</el-date-picker>
						</el-form-item>

						<el-form-item label="税款客服" prop="incomeTaxUserId" v-if='isRole3'>
							<el-select v-model="uploadData.incomeTaxUserId" placeholder="请选择" clearable filterable>
								<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
								<el-option v-for="item in customerServicerList" :label="item.userName" :value='item.configId'></el-option>
							</el-select>

						</el-form-item>
						<el-form-item label="申报类型" prop="declareType">
							<el-select v-model="uploadData.declareType" placeholder="请选择" clearable filterable>
								<el-option label="全部" value=''></el-option>
								<el-option label="一般纳税人" value='32'></el-option>
								<el-option label="小规模" value='31'></el-option>
							</el-select>

						</el-form-item>
						<el-form-item label="税款通知结果" prop="noticeResult">
							<el-select v-model="uploadData.noticeResult" placeholder="请选择" clearable filterable>

								<el-option v-for="item in accountNoticeList" :label="item.label" :value='item.value'></el-option>
							</el-select>
						</el-form-item>


						<el-form-item label=" " prop="dossierName">
							<el-button size="mini" type='primary' @click='search'>搜索</el-button>
							<el-button size="mini" type='primary' @click='exportExcel' :disabled="tableList.length == 0">导出</el-button>
						</el-form-item>
					</el-form>
				</div>

				<el-table :data="tableList" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange">
					<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->

					<!-- <el-table-column align="center" label="客户编号" prop="userCode" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>


					<el-table-column align="center" label="服务状态" prop="serviceStatus" :resizable="false"></el-table-column>
					<el-table-column align="center" label="收账方式" prop="collectType" :resizable="false"></el-table-column>
					<el-table-column align="center" label="申报类型" prop="declareType" :resizable="false"></el-table-column>
					<el-table-column align="center" label="合同类型" prop="ticketCollection" :resizable="false"></el-table-column>



					<el-table-column align="center" label="税款金额" prop="nationaTax" :resizable="false"></el-table-column>

					<el-table-column align="center" label="审核会计" prop="auditAccounting" :resizable="false"></el-table-column>
					<el-table-column align="center" label="做账会计" prop="accounting" :resizable="false"></el-table-column>
					<el-table-column align="center" label="税款客服" prop="nationUserName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="税款通知结果" prop="noticeResult" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.noticeResult == 1">税款确认</span>
							<span v-if="scope.row.noticeResult == 2">主管核对所得税</span>
							<span v-if="scope.row.noticeResult == 5">主管核对月税</span>
							<span v-if="scope.row.noticeResult == 3">再次送票</span>
							<span v-if="scope.row.noticeResult == 4">再联系</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="APP状态" prop="accountNotice" :resizable="false">
						<!-- <template slot-scope="scope">
							
							<span v-if="scope.row.executeStatus == 1">未完成</span>
							<span v-if="scope.row.executeStatus == 2">已完成</span>
							<span v-if="scope.row.executeStatus == 3">回退</span>
							
						</template> -->
					</el-table-column>
					<el-table-column align="center" label="月税确认" prop="incomeTaxResultStatus" :resizable="false">
						<template slot-scope="scope">
							<span v-show='scope.row.incomeTaxResultStatus === "0"'>未确认</span>
							<span v-show='scope.row.incomeTaxResultStatus === "1"'>同意</span>
							<span v-show='scope.row.incomeTaxResultStatus === "2"'>不同意</span>
							<span v-show='scope.row.incomeTaxResultStatus === null || scope.row.incomeTaxResultStatus === ""'>--</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="所得税确认" prop="corpIncomeTaxResultStatus" :resizable="false">
						<template slot-scope="scope">
							<span v-show='scope.row.corpIncomeTaxResultStatus === "0"'>未确认</span>
							<span v-show='scope.row.corpIncomeTaxResultStatus === "1"'>同意</span>
							<span v-show='scope.row.corpIncomeTaxResultStatus === "2"'>不同意</span>
							<span v-show='scope.row.corpIncomeTaxResultStatus === null || scope.row.corpIncomeTaxResultStatus === ""'>--</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="汇算确认" prop="yearIncResultStatus" :resizable="false">
						<template slot-scope="scope">
							<span v-show='scope.row.yearIncResultStatus === "0"'>未确认</span>
							<span v-show='scope.row.yearIncResultStatus === "1"'>同意</span>
							<span v-show='scope.row.yearIncResultStatus === "2"'>不同意</span>
							<span v-show='scope.row.yearIncResultStatus === null || scope.row.yearIncResultStatus === ""'>--</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="终止状态" prop="terminateState" :resizable="false">
						<template slot-scope="scope">

							<span v-if='scope.row.terminateState == 2'>终止</span>
							<span v-else>--</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="备注" prop="nationRemark" :resizable="false"></el-table-column>
					<el-table-column align="center" label="客户联系备注" prop="remark" :resizable="false"></el-table-column>
					<el-table-column align="center" label="分配时间" prop="updateTime" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.updateTime,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>

					<el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleStop(scope.$index, scope.row)" :disabled='!(scope.row.isTerminateState == 0 && scope.row.terminateState != 2)'>终止</el-button>
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,1)">税款通知</el-button>
							<el-button size="mini" type="text" @click="jumpTothis2(scope.row,1)">税款查询</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>

		</div>

		<el-dialog title="税款通知" :visible.sync="dialogVisible" width="1000px" :before-close="closeChangeMachie"
		 :modal-append-to-body="false">


			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">税款详情</p>
			</div>
			<div class="card_charts clearfix">
				<p>
					<span>总收入</span>
					<span :title="detail.allIncome">{{detail.allIncome.toFixed(2)}}</span>
				</p>
				<p>
					<span>申报周期</span>
					<span :title="detail.declarationCycle">{{detail.declarationCycle}}</span>
				</p>
				<p v-if="declareType == '小规模' && declarationCycle == 1">
					<span>季报数据第一月收入</span>
					<span :title="detail.allIncomeOne">{{detail.allIncomeOne.toFixed(2)}}</span>
				</p>
				<p v-if="declareType == '小规模' && declarationCycle == 1&&accountPeriod1.slice(5,7)%3 != 1">
					<span>季报数据第二月收入</span>
					<span :title="detail.allIncomeTwo">{{detail.allIncomeTwo.toFixed(2)}}</span>
				</p>
				<p v-if="declareType == '小规模' && declarationCycle == 1&&accountPeriod1.slice(5,7)%3 == 0">
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
				<p v-if="declareType == '一般纳税人'">
					<span>本期留底</span>
					<span :title="detail.currentPeriodKeep">{{detail.currentPeriodKeep.toFixed(2)}}</span>
				</p>
				<p v-if="declareType == '一般纳税人'">
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
				<p v-if="declareType == '一般纳税人'">
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
				<p v-if="declareType == '一般纳税人'">
					<span>本期进项税</span>
					<span :title="detail.allInputTax">{{detail.allInputTax.toFixed(2)}}</span>
				</p>
				<p>
					<span>增值税</span>
					<span :title="detail.allTaxAmount">{{detail.allTaxAmount.toFixed(2)}}</span>
				</p>
				<!-- <p>
						<span>国税-即征即退增值税</span>
						<span :title="detail.jzVat">{{detail.jzVat}}</span>
					</p> -->
				<p>
					<span>城建税</span>
					<span :title="detail.allUrbanTaxation">{{detail.allUrbanTaxation.toFixed(2)}}</span>
				</p>
				<p>
					<span>教育附加税</span>
					<span :title="detail.allEsTaxation">{{detail.allEsTaxation.toFixed(2)}}</span>
				</p>
				<p>
					<span>地方教育附加税</span>
					<span :title="detail.allAleTaxation">{{detail.allAleTaxation.toFixed(2)}}</span>
				</p>
				<p>
					<span>印花税</span>
					<span :title="detail.allStampDutyTaxation">{{detail.allStampDutyTaxation.toFixed(2)}}</span>
				</p>
				<p>
					<span>个人所得税</span>
					<span :title="detail.wages">{{detail.wages.toFixed(2)}}</span>
				</p>
				<p>
					<span>合计</span>
					<span :title="detail.allTotal">{{detail.allTotal.toFixed(2)}}</span>
				</p>
			</div>

			<div class="tabtitle" v-show="accountPeriod1.slice(5,7)%3 == 0">
				<p class="lineicon"></p>
				<p class="linetext">所得税详情</p>
			</div>
			<el-form ref="form" :model="detail1" label-width="160px" size="mini" inline v-show="accountPeriod1.slice(5,7)%3 == 0">
				<el-form-item label="暂估的成本金额" v-show="accountPeriod1.slice(5,7) != 12">
					<el-input v-model="costInvAmt" type="number" :disabled="!canCal" @change="setHasChecked" min="0"></el-input>
				</el-form-item>
				<el-form-item label="暂估的费用金额" v-show="accountPeriod1.slice(5,7) != 12">
					<el-input v-model="feeInvAmt" type="number" :disabled="!canCal" @change="setHasChecked" min="0"></el-input>
				</el-form-item>
				<el-form-item label="" v-show="accountPeriod1.slice(5,7) != 12">
					<el-button type="primary" size="mini" @click='calcu' v-show='canCal && detail1.taxCollectWay!="核定"'>计算</el-button>
					<el-button type="primary" size="mini" @click='refresh'>刷新</el-button>
				</el-form-item>
				<!-- <el-button type="primary" size="mini" @click='calcu' v-show='canCal' >计算</el-button> -->

				<el-divider></el-divider>

				<!-- <el-form-item label="客户名称">
						<el-input v-model="detail1.customerName" disabled></el-input>
					</el-form-item>
					 -->
				<el-form-item label="所得税状态">
					<el-input :value="detail1.state == 0?'执行中':'已完成'" disabled></el-input>
				</el-form-item>
				<el-form-item label="操作人名称">
					<el-input v-model="detail1.incTaxReamrk3" disabled></el-input>
				</el-form-item>
				<el-form-item label="当前结账账期">
					<el-input v-model="currentPeriod" disabled></el-input>
				</el-form-item>
				<el-form-item label="核定征收率">
					<el-select v-model="detail1.verifiedRate" placeholder="请选择" clearable filterable disabled>

						<el-option v-for="item in verifiedRateList" :label="item.rate" :value='item.rate'></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="征收方式">
					<el-input :value="detail1.taxCollectWay" disabled></el-input>

				</el-form-item>
				<el-form-item label="企业所得税税率">
					<el-input v-model="detail1.incomeTaxRate" disabled></el-input>

				</el-form-item>
				<el-form-item label="可弥补以前年度亏损">
					<el-input v-model="detail1.priorYearLoss" disabled></el-input>
				</el-form-item>
				<el-form-item label="实际弥补以前年度亏损">
					<el-input v-model="detail1.remedyPriorYearLoss" disabled></el-input>
				</el-form-item>

				<el-form-item label="收入">
					<el-input v-model="detail1.income" disabled></el-input>
				</el-form-item>
				<el-form-item label="成本">
					<el-input v-model="detail1.cost" disabled></el-input>
				</el-form-item>
				<el-form-item label="费用">
					<el-input v-model="detail1.fee" disabled></el-input>
				</el-form-item>
				<el-form-item label="利润">
					<el-input v-model="detail1.profit" disabled></el-input>
				</el-form-item>
				<el-form-item label="原始收入">
					<el-input v-model="detail1.originalIncome" disabled></el-input>
				</el-form-item>
				<el-form-item label="原始成本">
					<el-input v-model="detail1.originalCost" disabled></el-input>
				</el-form-item>
				<el-form-item label="原始费用">
					<el-input v-model="detail1.originalFee" disabled></el-input>
				</el-form-item>
				<el-form-item label="原始利润">
					<el-input v-model="detail1.originalProfit" disabled></el-input>
				</el-form-item>
				<el-form-item label="应纳税所得额">
					<el-input v-model="detail1.taxableIncome" disabled></el-input>
				</el-form-item>



				<el-form-item label="应交企业所得税">
					<el-input v-model="detail1.totalIncomeTaxation" disabled></el-input>
				</el-form-item>
				<el-form-item label="已交企业所得税">
					<el-input v-model="detail1.paidIncomeTaxation" disabled></el-input>
				</el-form-item>
				<el-form-item label="应补(退)企业所得税">
					<el-input v-model="detail1.incomeTaxation" disabled></el-input>
				</el-form-item>

				<el-form-item label="暂估的成本金额">
					<el-input v-model="detail1.costInvAmtShow" type="number" disabled></el-input>
				</el-form-item>
				<el-form-item label="暂估的费用金额">
					<el-input v-model="detail1.feeInvAmtShow" type="number" disabled></el-input>
				</el-form-item>

			</el-form>
			<div style="text-align: center;">
				<el-button type="primary" @click="submit" style="margin:0 auto" v-show="canCal && detail1.taxCollectWay!='核定' && accountPeriod1.slice(5,7) != 12"
				 :disabled='hasChecked || detail1.state == 0'>确认计算</el-button>
			</div>

			<div style="width: 100%;height: 20px;"></div>

			<div class="tabtitle" v-show="accountPeriod1.slice(5,7)%3 == 0 && accountPeriod1.slice(5,7) != 12">
				<p class="lineicon"></p>
				<p class="linetext">暂估历史记录</p>
			</div>
			<div style="width: 100%;" v-show="accountPeriod1.slice(5,7)%3 == 0 && accountPeriod1.slice(5,7) != 12">
				<el-table :data="ZGhistory" style="width: 100%" v-loading='loading1'>
					<el-table-column align="center" label="未提供成本发票金额" prop="costInvAmt" :resizable="false"></el-table-column>
					<el-table-column align="center" label="未提供费用发票金额" prop="feeInvAmt" :resizable="false"></el-table-column>
					<el-table-column align="center" label="收入" prop="income" :resizable="false"></el-table-column>
					<el-table-column align="center" label="成本" prop="cost" :resizable="false"></el-table-column>
					<el-table-column align="center" label="费用" prop="fee" :resizable="false"></el-table-column>
					<el-table-column align="center" label="利润" prop="profit" :resizable="false"></el-table-column>

					<el-table-column align="center" label="原始利润" prop="originalProfit" :resizable="false"></el-table-column>
					<el-table-column align="center" label="原始费用" prop="originalFee" :resizable="false"></el-table-column>
					<el-table-column align="center" label="原始成本" prop="originalCost" :resizable="false"></el-table-column>


					<el-table-column align="center" label="原始收入" prop="originalIncome" :resizable="false"></el-table-column>
					<el-table-column align="center" label="创建人" prop="createUserName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="创建时间" prop="createTime" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.createTime,'yyyy-MM-dd')}}</span>

						</template>
					</el-table-column>


				</el-table>
			</div>
			
			
			<div class="tabtitle" v-show="form3.yearIncId">
				<p class="lineicon"></p>
				<p class="linetext">汇算详情</p>
			</div>
			<div class="card_charts clearfix" v-show="form3.yearIncId">
				<p>
					<span>核定征收率</span>
					<span :title="detail2.verifiedRate">{{detail2.verifiedRate.toFixed(2)}}</span>
				</p>
				<p>
					<span>汇算后企业所得税率</span>
					<span :title="detail2.liquidationIncomeTaxRate">{{detail2.liquidationIncomeTaxRate.toFixed(2)}}</span>
				</p>
				<p>
					<span>本年收入</span>
					<span :title="detail2.income">{{detail2.income.toFixed(2)}}</span>
				</p>
				<p>
					<span>本年成本</span>
					<span :title="detail2.cost">{{detail2.cost.toFixed(2)}}</span>
				</p>
				<p>
					<span>本年费用</span>
					<span :title="detail2.fee">{{detail2.fee.toFixed(2)}}</span>
				</p>
				<p>
					<span>本年利润</span>
					<span :title="detail2.profit">{{detail2.profit.toFixed(2)}}</span>
				</p>
				<p>
					<span>本季度利润</span>
					<span :title="detail2.qtrProfit">{{detail2.qtrProfit.toFixed(2)}}</span>
				</p>
				<p>
					<span>预支成本</span>
					<span :title="detail2.advCostAmt">{{detail2.advCostAmt.toFixed(2)}}</span>
				</p>
				<p>
					<span>预支费用</span>
					<span :title="detail2.advFeeAmt">{{detail2.advFeeAmt.toFixed(2)}}</span>
				</p>
				<p>
					<span>需调整数合计</span>
					<span :title="detail2.totalSubjectsNeedAdjust">{{detail2.totalSubjectsNeedAdjust.toFixed(2)}}</span>
				</p>
				<p>
					<span>汇算后利润总额</span>
					<span :title="detail2.liquidationProfit">{{detail2.liquidationProfit.toFixed(2)}}</span>
				</p>
				<p>
					<span>可弥补以前年度亏损</span>
					<span :title="detail2.priorYearLoss">{{detail2.priorYearLoss.toFixed(2)}}</span>
				</p>
				<p>
					<span>实际弥补以前年度亏损</span>
					<span :title="detail2.remedyPriorYearLoss">{{detail2.remedyPriorYearLoss.toFixed(2)}}</span>
				</p>
				<p>
					<span>预缴企业所得税</span>
					<span :title="detail2.prepayIncomeTax">{{detail2.prepayIncomeTax.toFixed(2)}}</span>
				</p>
				<p>
					<span>本年度企业所得税税额合计</span>
					<span :title="detail2.totalIncomeTax">{{detail2.totalIncomeTax.toFixed(2)}}</span>
				</p>
				<p>
					<span>本季度需缴纳税款</span>
					<span :title="detail2.periodPayIncomeTax">{{detail2.periodPayIncomeTax.toFixed(2)}}</span>
				</p>
				<p>
					<span>汇算后需补缴纳企业所得税税款</span>
					<span :title="detail2.liquidationPayIncomeTax">{{detail2.liquidationPayIncomeTax.toFixed(2)}}</span>
				</p>
				
			</div>


			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">基本信息</p>
			</div>
			<div style="width: 100%;"></div>
			<el-form inline ref="ruleForm5" :model="form3" class="demo-form-inline" label-width="120px" size="mini">
				<el-form-item label="客户名称">
					<el-input v-model="form3.customerName" disabled></el-input>
				</el-form-item>
				<el-form-item label="税务类型">
					<el-input v-model="formdeclareType" disabled></el-input>
				</el-form-item>
				<!-- <el-form-item label="收账时间">
						<el-input v-model="form3.declareType" disabled></el-input>
					</el-form-item> -->
				<el-form-item label="审核会计">
					<el-input v-model="form3.auditAccounting" disabled></el-input>
				</el-form-item>
				<el-form-item label="APP状态">
					<el-input v-model="form3.accountNotice" disabled></el-input>
					<!-- <el-select v-model="form3.accountNotice" placeholder="请选择" filterable disabled>
							
							<el-option v-for="item in executeStatusList" :label="item.label" :value='item.value'></el-option>
						</el-select> -->
				</el-form-item>
				<el-form-item label="APP备注">
					<el-input v-model="form3.nationRemark" disabled></el-input>
				</el-form-item>
				<el-form-item label="通知结果" prop="noticeResult">
					<el-select v-model="form3.noticeResult" placeholder="请选择" filterable>
						<el-option v-for="item in accountNoticeList1" :label="item.label" :value='item.value' :disabled="accountPeriod1.slice(5,7)%3 != 0 && item.value == 2"></el-option>
						<!-- <el-option v-for="item in accountNoticeList1" :label="item.label" :value='item.value' :disabled="!form3.corpIncomeTaxRecordId && (item.value == 1 || item.value == 2)"></el-option> -->
					</el-select>
				</el-form-item>


				<el-form-item label="是否同意申报文化事业建设费" v-show="form3.isTaxIdentification == 1" class="longLabel">
					<el-select v-model="form3.isCultural" placeholder="请选择" filterable>
						<el-option v-for="item in trueOrFalse" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="预约时间">
					<el-date-picker v-model="form3.appointment" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>
				</el-form-item>
				<div style="width: 100%"></div>
				<el-form-item label="备注">
					<el-input style='width: 800px;' type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入" v-model="form3.remark">
					</el-input>
				</el-form-item>
			</el-form>
			<div style="width: 100%"></div>
			<el-form-item label="联系记录">
				<el-input style='width: 800px;' type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入" v-model="form3.remark">
				</el-input>
			</el-form-item>

			<div style="width: 100%;height: 20px;"></div>

			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">联系人信息</p>
			</div>
			<div style="width: 100%;">
				<el-table :data="contactPersonInfo" style="width: 100%" v-loading='loading1' @selection-change="handleSelectionChange">
					<el-table-column align="center" type="selection" width="55"></el-table-column>
					<el-table-column align="center" label="姓名" prop="contactname" :resizable="false"></el-table-column>
					<el-table-column align="center" label="职务" prop="positionName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="级别" prop="levelName" :resizable="false"></el-table-column>


					<el-table-column align="center" label="电话" prop="phone" :resizable="false">
						<template slot-scope="scope">
							<span v-for="(item,index) in scope.row.phone.split(',')">
								<el-button type="text" size="mini" @click='jumpToCall(item)'>{{item}}</el-button>
								<span v-show="index < scope.row.phone.split(',').length - 1">,</span>
							</span>

						</template>
					</el-table-column>
					<el-table-column align="center" label="邮箱" prop="email" :resizable="false"></el-table-column>
					<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>


				</el-table>
			</div>

			<div style="width: 100%;height: 20px;"></div>

			</el-form>



			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog">取 消</el-button>
				<el-button type="primary" @click="commit">确 定</el-button>
			</span>


		</el-dialog>

		<el-dialog title="税款通知" :visible.sync="dialogVisible2" width="1000px" :before-close="closeChangeMachie"
		 :modal-append-to-body="false">


			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">税款详情</p>
			</div>
			<div class="card_charts clearfix">
				<p>
					<span>总收入</span>
					<span :title="detail.allIncome">{{detail.allIncome.toFixed(2)}}</span>
				</p>
				<p>
					<span>申报周期</span>
					<span :title="detail.declarationCycle">{{detail.declarationCycle}}</span>
				</p>
				<p v-if="declareType == '小规模' && declarationCycle == 1">
					<span>季报数据第一月收入</span>
					<span :title="detail.allIncomeOne">{{detail.allIncomeOne.toFixed(2)}}</span>
				</p>
				<p v-if="declareType == '小规模' && declarationCycle == 1&&accountPeriod1.slice(5,7)%3 != 1">
					<span>季报数据第二月收入</span>
					<span :title="detail.allIncomeTwo">{{detail.allIncomeTwo.toFixed(2)}}</span>
				</p>
				<p v-if="declareType == '小规模' && declarationCycle == 1&&accountPeriod1.slice(5,7)%3 == 0">
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
				<p v-if="declareType == '一般纳税人'">
					<span>本期留底</span>
					<span :title="detail.currentPeriodKeep">{{detail.currentPeriodKeep.toFixed(2)}}</span>
				</p>
				<p v-if="declareType == '一般纳税人'">
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
				<p v-if="declareType == '一般纳税人'">
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
				<p v-if="declareType == '一般纳税人'">
					<span>本期进项税</span>
					<span :title="detail.allInputTax">{{detail.allInputTax.toFixed(2)}}</span>
				</p>
				<p>
					<span>增值税</span>
					<span :title="detail.allTaxAmount">{{detail.allTaxAmount.toFixed(2)}}</span>
				</p>
				<!-- <p>
						<span>国税-即征即退增值税</span>
						<span :title="detail.jzVat">{{detail.jzVat}}</span>
					</p> -->
				<p>
					<span>城建税</span>
					<span :title="detail.allUrbanTaxation">{{detail.allUrbanTaxation.toFixed(2)}}</span>
				</p>
				<p>
					<span>教育附加税</span>
					<span :title="detail.allEsTaxation">{{detail.allEsTaxation.toFixed(2)}}</span>
				</p>
				<p>
					<span>地方教育附加税</span>
					<span :title="detail.allAleTaxation">{{detail.allAleTaxation.toFixed(2)}}</span>
				</p>
				<p>
					<span>印花税</span>
					<span :title="detail.allStampDutyTaxation">{{detail.allStampDutyTaxation.toFixed(2)}}</span>
				</p>
				<p>
					<span>个人所得税</span>
					<span :title="detail.wages">{{detail.wages.toFixed(2)}}</span>
				</p>
				<p>
					<span>合计</span>
					<span :title="detail.allTotal">{{detail.allTotal.toFixed(2)}}</span>
				</p>
			</div>

			<div class="tabtitle" v-show="accountPeriod1.slice(5,7)%3 == 0">
				<p class="lineicon"></p>
				<p class="linetext">所得税详情</p>
			</div>

			<el-form ref="form" :model="detail1" label-width="160px" size="mini" inline v-show="accountPeriod1.slice(5,7)%3 == 0">
				<el-form-item label="暂估的成本金额" v-show="accountPeriod1.slice(5,7) != 12">
					<el-input v-model="costInvAmt" type="number" :disabled="!canCal" @change="setHasChecked" min="0"></el-input>
				</el-form-item>
				<el-form-item label="暂估的费用金额" v-show="accountPeriod1.slice(5,7) != 12">
					<el-input v-model="feeInvAmt" type="number" :disabled="!canCal" @change="setHasChecked" min="0"></el-input>
				</el-form-item>
				<el-form-item label="" v-show="accountPeriod1.slice(5,7) != 12">
					<el-button type="primary" size="mini" @click='calcu' v-show='canCal && detail1.taxCollectWay!="核定"'>计算</el-button>
					<el-button type="primary" size="mini" @click='refresh'>刷新</el-button>
				</el-form-item>


				<el-divider v-show='accountPeriod1.slice(5,7) != 12'></el-divider>

				<!-- <el-form-item label="客户名称">
						<el-input v-model="detail1.customerName" disabled></el-input>
					</el-form-item>
					<el-form-item label="账期">
						<el-input v-model="detail1.accountPeriod" disabled></el-input>
					</el-form-item> -->
				<el-form-item label="所得税状态">
					<el-input :value="detail1.state == 0?'执行中':'已完成'" disabled></el-input>
				</el-form-item>
				<el-form-item label="操作人名称">
					<el-input v-model="detail1.incTaxReamrk3" disabled></el-input>
				</el-form-item>
				<el-form-item label="当前结账账期">
					<el-input v-model="currentPeriod" disabled></el-input>
				</el-form-item>
				<el-form-item label="核定征收率">
					<el-select v-model="detail1.verifiedRate" placeholder="请选择" clearable filterable disabled>
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option v-for="item in verifiedRateList" :label="item.rate" :value='item.rate'></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="征收方式">
					<el-input :value="detail1.taxCollectWay" disabled></el-input>
					<!-- <el-select v-model="detail.taxCollectWay" placeholder="请选择" clearable filterable>
							
							<el-option label="查账征收" value='1'></el-option>
							<el-option label="核定征收" value='2'></el-option>
						</el-select> -->
				</el-form-item>
				<el-form-item label="企业所得税税率">
					<el-input v-model="detail1.incomeTaxRate" disabled></el-input>
					<!-- <el-select v-model="detail.incomeTaxRate" placeholder="请选择" clearable filterable>
							
							<el-option v-for="item in rateList" :label="item.taxesRate" :value='item.taxesRate'></el-option>
						</el-select> -->
				</el-form-item>
				<el-form-item label="可弥补以前年度亏损">
					<el-input v-model="detail1.priorYearLoss" disabled></el-input>
				</el-form-item>
				<el-form-item label="实际弥补以前年度亏损">
					<el-input v-model="detail1.remedyPriorYearLoss" disabled></el-input>
				</el-form-item>

				<el-form-item label="收入">
					<el-input v-model="detail1.income" disabled></el-input>
				</el-form-item>
				<el-form-item label="成本">
					<el-input v-model="detail1.cost" disabled></el-input>
				</el-form-item>
				<el-form-item label="费用">
					<el-input v-model="detail1.fee" disabled></el-input>
				</el-form-item>
				<el-form-item label="利润">
					<el-input v-model="detail1.profit" disabled></el-input>
				</el-form-item>
				<el-form-item label="原始收入">
					<el-input v-model="detail1.originalIncome" disabled></el-input>
				</el-form-item>
				<el-form-item label="原始成本">
					<el-input v-model="detail1.originalCost" disabled></el-input>
				</el-form-item>
				<el-form-item label="原始费用">
					<el-input v-model="detail1.originalFee" disabled></el-input>
				</el-form-item>
				<el-form-item label="原始利润">
					<el-input v-model="detail1.originalProfit" disabled></el-input>
				</el-form-item>
				<el-form-item label="应纳税所得额">
					<el-input v-model="detail1.taxableIncome" disabled></el-input>
				</el-form-item>



				<el-form-item label="应交企业所得税">
					<el-input v-model="detail1.totalIncomeTaxation" disabled></el-input>
				</el-form-item>
				<el-form-item label="已交企业所得税">
					<el-input v-model="detail1.paidIncomeTaxation" disabled></el-input>
				</el-form-item>
				<el-form-item label="应补(退)企业所得税">
					<el-input v-model="detail1.incomeTaxation" disabled></el-input>
				</el-form-item>

				<el-form-item label="暂估的成本金额">
					<el-input v-model="detail1.costInvAmtShow" type="number" disabled></el-input>
				</el-form-item>
				<el-form-item label="暂估的费用金额">
					<el-input v-model="detail1.feeInvAmtShow" type="number" disabled></el-input>
				</el-form-item>
			</el-form>
			
			
			<div style="text-align: center;">
				<el-button type="primary" @click="submit" style="margin:0 auto" v-show="canCal && detail1.taxCollectWay!='核定' && accountPeriod1.slice(5,7) != 12"
				 :disabled='hasChecked || detail1.state == 0'>确认计算</el-button>
			</div>

			<div style="width: 100%;height: 20px;"></div>

			<div class="tabtitle" v-show="accountPeriod1.slice(5,7)%3 == 0 && accountPeriod1.slice(5,7) != 12">
				<p class="lineicon"></p>
				<p class="linetext">暂估历史记录</p>
			</div>
			<div style="width: 100%;" v-show="accountPeriod1.slice(5,7)%3 == 0 && accountPeriod1.slice(5,7) != 12">
				<el-table :data="ZGhistory" style="width: 100%" v-loading='loading1'>
					<el-table-column align="center" label="未提供成本发票金额" prop="costInvAmt" :resizable="false"></el-table-column>
					<el-table-column align="center" label="未提供费用发票金额" prop="feeInvAmt" :resizable="false"></el-table-column>
					<el-table-column align="center" label="收入" prop="income" :resizable="false"></el-table-column>
					<el-table-column align="center" label="成本" prop="cost" :resizable="false"></el-table-column>
					<el-table-column align="center" label="费用" prop="fee" :resizable="false"></el-table-column>
					<el-table-column align="center" label="利润" prop="profit" :resizable="false"></el-table-column>

					<el-table-column align="center" label="原始利润" prop="originalProfit" :resizable="false"></el-table-column>
					<el-table-column align="center" label="原始费用" prop="originalFee" :resizable="false"></el-table-column>
					<el-table-column align="center" label="原始成本" prop="originalCost" :resizable="false"></el-table-column>


					<el-table-column align="center" label="原始收入" prop="originalIncome" :resizable="false"></el-table-column>
					<el-table-column align="center" label="创建人" prop="createUserName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="创建时间" prop="createTime" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.createTime,'yyyy-MM-dd')}}</span>

						</template>
					</el-table-column>


				</el-table>
			</div>


			<div class="tabtitle" v-show="form3.yearIncId">
				<p class="lineicon"></p>
				<p class="linetext">汇算详情</p>
			</div>
			<div class="card_charts clearfix" v-show="form3.yearIncId">
				<p>
					<span>核定征收率</span>
					<span :title="detail2.verifiedRate">{{detail2.verifiedRate.toFixed(2)}}</span>
				</p>
				<p>
					<span>汇算后企业所得税率</span>
					<span :title="detail2.liquidationIncomeTaxRate">{{detail2.liquidationIncomeTaxRate.toFixed(2)}}</span>
				</p>
				<p>
					<span>本年收入</span>
					<span :title="detail2.income">{{detail2.income.toFixed(2)}}</span>
				</p>
				<p>
					<span>本年成本</span>
					<span :title="detail2.cost">{{detail2.cost.toFixed(2)}}</span>
				</p>
				<p>
					<span>本年费用</span>
					<span :title="detail2.fee">{{detail2.fee.toFixed(2)}}</span>
				</p>
				<p>
					<span>本年利润</span>
					<span :title="detail2.profit">{{detail2.profit.toFixed(2)}}</span>
				</p>
				<p>
					<span>本季度利润</span>
					<span :title="detail2.qtrProfit">{{detail2.qtrProfit.toFixed(2)}}</span>
				</p>
				<p>
					<span>预支成本</span>
					<span :title="detail2.advCostAmt">{{detail2.advCostAmt.toFixed(2)}}</span>
				</p>
				<p>
					<span>预支费用</span>
					<span :title="detail2.advFeeAmt">{{detail2.advFeeAmt.toFixed(2)}}</span>
				</p>
				<p>
					<span>需调整数合计</span>
					<span :title="detail2.totalSubjectsNeedAdjust">{{detail2.totalSubjectsNeedAdjust.toFixed(2)}}</span>
				</p>
				<p>
					<span>汇算后利润总额</span>
					<span :title="detail2.liquidationProfit">{{detail2.liquidationProfit.toFixed(2)}}</span>
				</p>
				<p>
					<span>可弥补以前年度亏损</span>
					<span :title="detail2.priorYearLoss">{{detail2.priorYearLoss.toFixed(2)}}</span>
				</p>
				<p>
					<span>实际弥补以前年度亏损</span>
					<span :title="detail2.remedyPriorYearLoss">{{detail2.remedyPriorYearLoss.toFixed(2)}}</span>
				</p>
				<p>
					<span>预缴企业所得税</span>
					<span :title="detail2.prepayIncomeTax">{{detail2.prepayIncomeTax.toFixed(2)}}</span>
				</p>
				<p>
					<span>本年度企业所得税税额合计</span>
					<span :title="detail2.totalIncomeTax">{{detail2.totalIncomeTax.toFixed(2)}}</span>
				</p>
				<p>
					<span>本季度需缴纳税款</span>
					<span :title="detail2.periodPayIncomeTax">{{detail2.periodPayIncomeTax.toFixed(2)}}</span>
				</p>
				<p>
					<span>汇算后需补缴纳企业所得税税款</span>
					<span :title="detail2.liquidationPayIncomeTax">{{detail2.liquidationPayIncomeTax.toFixed(2)}}</span>
				</p>
				
			</div>

			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">基本信息</p>
			</div>
			<div style="width: 100%;"></div>
			<el-form inline ref="ruleForm5" :model="form3" class="demo-form-inline" label-width="120px" size="mini">
				<el-form-item label="客户名称">
					<el-input v-model="form3.customerName" disabled></el-input>
				</el-form-item>
				<el-form-item label="税务类型">
					<el-input v-model="formdeclareType" disabled></el-input>
				</el-form-item>
				<!-- <el-form-item label="收账时间">
						<el-input v-model="form3.declareType" disabled></el-input>
					</el-form-item> -->
				<el-form-item label="审核会计">
					<el-input v-model="form3.auditAccounting" disabled></el-input>
				</el-form-item>
				<el-form-item label="APP状态">
					<el-input v-model="form3.accountNotice" disabled></el-input>
					<!-- <el-select v-model="form3.accountNotice" placeholder="请选择" filterable disabled>
							
							<el-option v-for="item in executeStatusList" :label="item.label" :value='item.value'></el-option>
						</el-select> -->
				</el-form-item>
				<el-form-item label="APP备注">
					<el-input v-model="form3.nationRemark" disabled></el-input>
				</el-form-item>
				<el-form-item label="通知结果" prop="noticeResult">
					<el-select v-model="form3.noticeResult" placeholder="请选择" filterable>
						<!-- <el-option v-for="item in accountNoticeList1" :label="item.label" :value='item.value' :disabled="!form3.corpIncomeTaxRecordId && (item.value == 1 || item.value == 2)"></el-option> -->
						<el-option v-for="item in accountNoticeList1" :label="item.label" :value='item.value' :disabled="accountPeriod1.slice(5,7)%3 != 0 && item.value == 2"></el-option>
					</el-select>
				</el-form-item>


				<el-form-item label="是否同意申报文化事业建设费" v-show="form3.isTaxIdentification == 1" class="longLabel">
					<el-select v-model="form3.isCultural" placeholder="请选择" filterable disabled>
						<el-option v-for="item in trueOrFalse" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="预约时间">
					<el-date-picker v-model="form3.appointment" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>
				</el-form-item>
				<div style="width: 100%"></div>
				<el-form-item label="备注">
					<el-input style='width: 800px;' type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入" v-model="form3.remark">
					</el-input>
				</el-form-item>
			</el-form>
			<div style="width: 100%;"></div>
			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">联系记录</p>
			</div>
			<div style="width: 100%;">
				<el-table :data="remarkList" style="width: 100%" v-loading='loading1'>

					<el-table-column align="center" label="联系人" prop="contactName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="电话" prop="contactPhone" :resizable="false"></el-table-column>
					<el-table-column align="center" label="创建人" prop="createUser" :resizable="false"></el-table-column>

					<el-table-column align="center" label="创建时间" prop="createTime" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.createTime,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>

				</el-table>
			</div>
			<div style="width: 100%;height: 20px;"></div>

			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">联系人信息</p>
			</div>
			<div style="width: 100%;">
				<el-table :data="contactPersonInfo" style="width: 100%" v-loading='loading1' @selection-change="handleSelectionChange">
					<el-table-column align="center" type="selection" width="55"></el-table-column>
					<el-table-column align="center" label="姓名" prop="contactname" :resizable="false"></el-table-column>
					<el-table-column align="center" label="职务" prop="positionName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="级别" prop="levelName" :resizable="false"></el-table-column>


					<el-table-column align="center" label="电话" prop="phone" :resizable="false">
						<template slot-scope="scope">
							<span v-for="(item,index) in scope.row.phone.split(',')">
								<el-button type="text" size="mini" @click='jumpToCall(item)'>{{item}}</el-button>
								<span v-show="index < scope.row.phone.split(',').length - 1">,</span>
							</span>

						</template>
					</el-table-column>
					<el-table-column align="center" label="邮箱" prop="email" :resizable="false"></el-table-column>
					<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>


				</el-table>
			</div>

			<div style="width: 100%;height: 20px;"></div>




			</el-form>



			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog1">取 消</el-button>
				<el-button type="primary" @click="commit">确 定</el-button>
			</span>


		</el-dialog>



	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				ZGhistory: {},
				hasChecked: false,
				isRole3: false,
				currentPeriod: '',
				detail: {
					allIncome: 0,
					declarationCycle: 0,
					allIncomeOne: 0,
					allIncomeTwo: 0,
					allIncomeThree: 0,
					currentPeriodKeep: 0,
					counterfoil: 0,
					abatementVat: 0,
					allOutputTax: 0,
					changeoverinputVat: 0,
					allConsumptionTaxation: 0,
					education: 0,
					allInputTax: 0,
					allTaxAmount: 0,
					allUrbanTaxation: 0,
					allEsTaxation: 0,
					allAleTaxation: 0,
					allStampDutyTaxation: 0,
					wages: 0,
					allTotal: 0,

				},
				detail1: {
					income: 0,
					incomeSum: 0,
					cost: 0,
					fee: 0,
					profit: 0,
					priorYearLoss: 0,
					remedyPriorYearLoss: 0,
					verifiedRate: 0,
					taxableIncome: 0,
					incomeTaxRate: 0,
					totalIncomeTaxation: 0,
					paidIncomeTaxation: 0,
					incomeTaxation: 0,
					prepayIncomeTaxation: 0,
					costInvAmt: 0,
					feeInvAmt: 0,
					settlementProfit: 0,
					addIncomeTaxation: 0,
					costInvAmtShow: 0,
					feeInvAmtShow: 0,
					originalIncome: 0,
					originalCost: 0,
					originalFee: 0,
					originalProfit: 0,


				},
				detail2:{
					verifiedRate:0,
					liquidationIncomeTaxRate:0,
					income:0,
					cost:0,
					fee:0,
					profit:0,
					qtrProfit:0,
					advCostAmt:0,
					advFeeAmt:0,
					totalSubjectsNeedAdjust:0,
					liquidationProfit:0,
					priorYearLoss:0,
					remedyPriorYearLoss:0,
					prepayIncomeTax:0,
					totalIncomeTax:0,
					periodPayIncomeTax:0,
					liquidationPayIncomeTax:0,
					
				},
				uploadData: {},
				customerServicerList: [],
				form3: {},
				form2: {},
				form1: {},
				costInvAmt: 0,
				feeInvAmt: 0,
				multipleSelection: [],

				loading: false,
				loading1: false,

				userName: '',
				temtaxInfoId: '',
				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],

				dialogVisible: false,
				dialogVisible1: false,
				trueOrFalse: [{
						label: '是',
						value: 1
					},
					{
						label: '否',
						value: 0
					}
				],
				accountNoticeList: [{
						label: '全部',
						value: ''
					},
					{
						label: '空白',
						value: 0
					},
					{
						label: '税款确认',
						value: 1
					},

					{
						label: '主管核对所得税',
						value: 2
					},
					{
						label: '主管核对月税',
						value: 5
					},
					{
						label: '再次送票',
						value: 3
					},
					{
						label: '再联系',
						value: 4
					}
				],
				accountNoticeList1: [{
						label: '税款确认',
						value: 1
					},
					{
						label: '主管核对所得税',
						value: 2
					},
					{
						label: '主管核对月税',
						value: 5
					},
					{
						label: '再次送票',
						value: 3
					},
					{
						label: '再联系',
						value: 4
					}
				],
				canCal: false,
				verifiedRateList: [],
				contactPersonInfo: [],
				dialogVisible2: false,
				declareType: '',
				formdeclareType: '',
				declarationCycle: '',
				accountPeriod1: '',
				remarkList: [],
				executeStatusList: [{
						label: '已完成',
						value: "2"
					},
					{
						label: '未完成',
						value: "1"
					},
					{
						label: '回退',
						value: "3"
					}
				]
			}
		},
		components: {},
		methods: {
			resetDetail() {
				this.detail1 = {
					income: 0,
					incomeSum: 0,
					cost: 0,
					fee: 0,
					profit: 0,
					priorYearLoss: 0,
					remedyPriorYearLoss: 0,
					verifiedRate: 0,
					taxableIncome: 0,
					incomeTaxRate: 0,
					totalIncomeTaxation: 0,
					paidIncomeTaxation: 0,
					incomeTaxation: 0,
					prepayIncomeTaxation: 0,
					costInvAmt: 0,
					feeInvAmt: 0,
					settlementProfit: 0,
					addIncomeTaxation: 0,
					costInvAmtShow: 0,
					feeInvAmtShow: 0

				}
			},
			jumpToCall(item) {
				this.$router.push({
					path: '/callCenter/workbench',
					query: {
						phoneNumber: item
					}
				})
			},
			jumpTothis2(row) {
				this.$router.push({ //核心语句
					path: '/accountFactory/invoice_t', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						customerId: row.customerId,
						accountPeriod: row.accountPeriod,
						index: 1
					}
				})
			},
			setHasChecked() {
				this.hasChecked = false;
			},
			getList(customerId, tag) {
				let params = {
					"page": 1,
					"row": 999,
					"data": {
						"customerId": customerId
					}
				};
				this.axios.post('/perTaxToolTwo/e9z/incomeTaxLevyRate/selectPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.verifiedRateList = res.data.data;
							// this.total = 
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

			getCurrentPeriod(customerId) {
				let params = {

					"customerId": customerId
				};
				this.axios.post('/perTaxToolTwo/e9/acct/getCurrentPeriod', params)
					.then(res => {
						if (res.data.code == 200) {
							this.currentPeriod = res.data.data.fyear + '-' + res.data.data.fperiod;
							// this.total = 
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
			nosubmit() {
				this.detail1 = {};


			},


			submit() {
				let params = {

					costInvAmt: this.costInvAmt,
					feeInvAmt: this.feeInvAmt,

					customerId: this.detail1.customerId,
					accountPeriod: this.detail1.accountPeriod,
					id: this.detail1.id,

					"resultStatus": 2,
					"source": 2,
					"customerName": this.detail1.customerName,
					remark: '',
					taxNotice: 1,
					originalIncome: this.detail1.income,
					originalFee: this.detail1.fee,
					originalCost: this.detail1.cost,
					originalProfit: this.detail1.profit,
					taxInfoId: this.temtaxInfoId,

					cost: this.detail1.cost,
					fee: this.detail1.fee,
					income: this.detail1.income,
					profit: this.detail1.profit,

					// priorYearLoss:this.detail.priorYearLoss,
					// remedyPriorYearLoss:this.detail.remedyPriorYearLoss,
					// incomeTaxRate:this.detail.incomeTaxRate,
					// taxCollectWay:this.detail.taxCollectWay,
				};
				this.axios.post('/perTaxToolTwo/import/confirmCorpIncomeTax', params)
					.then(res => {
						if (res.data.code == 200) {
							this.hasChecked = true;
							// this.form3.incomeTaxRecord = res.data.data.id;
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

			hideDialog() {
				this.dialogVisible = false;
				this.hasChecked = false;
				this.costInvAmt = 0;
				this.feeInvAmt = 0;
				this.reset();
				this.queryListByPage();
			},
			hideDialog1() {
				this.dialogVisible2 = false;
				this.hasChecked = false;
				this.costInvAmt = 0;
				this.feeInvAmt = 0;
				this.reset();
				this.queryListByPage();
			},
			reset() {
				this.form = {};
				this.form2 = {};
			},

			closeChangeMachie() {

				this.hasChecked = false;
				this.dialogVisible = false;
				this.dialogVisible2 = false;
				this.reset();
			},

			exportExcel() {
				let params = {
					declareType: this.declareType,
					incomeTaxUserId: this.incomeTaxUserId?this.incomeTaxUserId:'',
					customerName: this.customerName?this.customerName:'',
					accountPeriod: this.accountPeriod?this.accountPeriod:'',
					noticeResult: this.noticeResult
				
				};
				this.axios.post('/perTaxToolTwo/callcenter/customerServiceManage/exportExcel', this.qs.stringify(params), {
						responseType: 'blob',
					})
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
				
							let link = document.createElement("a");
							link.href = window.URL.createObjectURL(new Blob([res.data]));
							link.target = "_blank";
							link.download = "税款通知列表.xls";
							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
						
					})
					.catch(err => {
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
				// window.location.href = '/perTaxToolTwo/callcenter/customerServiceManage/exportExcel?customerName=' + this.customerName?this.customerName:'' + '&accountPeriod=' + this.accountPeriod?this.accountPeriod:'' +
				// 	'&incomeTaxUserId=' + this.incomeTaxUserId + '&declareType=' + this.declareType + '&noticeResult=' + this.noticeResult;


			},


			search() {
				this.customerName = this.uploadData.customerName;
				this.accountPeriod = this.uploadData.accountPeriod;
				this.incomeTaxUserId = this.uploadData.incomeTaxUserId ? this.uploadData.incomeTaxUserId : '';
				this.declareType = this.uploadData.declareType;
				this.noticeResult = this.uploadData.noticeResult;
				this.queryListByPage()
			},


			queryListByPage() {
				this.loading = true;


				let param = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						customerName: this.customerName,
						accountPeriod: this.accountPeriod,
						incomeTaxUserId: this.incomeTaxUserId,
						declareType: this.declareType,
						noticeResult: this.noticeResult,
						noticeType: 2,
						field2: 1
					}
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/callcenter/customerServiceManage/queryListByPage', param).then(res => {
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

			handleEdit(index, row) {
				// this.dialogVisible = true;
				// this.form3 = JSON.parse(JSON.stringify(row));
				this.temAccountPeriod = row.accountPeriod;
				this.costInvAmt = 0;
				this.feeInvAmt = 0;
				this.getAccountNotice(row);
				this.showDetail(row);
				this.getList(row.customerId);
				this.getCurrentPeriod(row.customerId);
				if(row.yearIncId){
					this.findYearCorpIncomeTaxById(row)
				}else{
					this.detail2 = {
						verifiedRate:0,
						liquidationIncomeTaxRate:0,
						income:0,
						cost:0,
						fee:0,
						profit:0,
						qtrProfit:0,
						advCostAmt:0,
						advFeeAmt:0,
						totalSubjectsNeedAdjust:0,
						liquidationProfit:0,
						priorYearLoss:0,
						remedyPriorYearLoss:0,
						prepayIncomeTax:0,
						totalIncomeTax:0,
						periodPayIncomeTax:0,
						liquidationPayIncomeTax:0,
						
					}
					
				}
			},
			
			findYearCorpIncomeTaxById(row){
				let params = {
					id: row.yearIncId,
				};
				this.axios.post('/perTaxToolTwo/import/findYearCorpIncomeTaxById', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.detail2 = res.data.data;
							this.detail2.yearIncId = row.yearIncId;
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

			handleStop(index, row) {
				this.$confirm('确认终止?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = {
						customerId: row.customerId,
						manageId: row.manageId,
						taxationId: row.taxationId,
						taxInfoId: row.taxInfoId,
						stepName: '税款确认',
						remark: '无效客户，终止税款通知',
					};
					this.axios.post('/perTaxToolTwo/callcenter/accountNotice/submitTerminate', param).then(res => {
						this.loading1 = false;
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
						this.loading1 = false;
						this.$message({
							message: '操作失败',
							type: 'error'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},

			getAccountNotice(row) {
				let param = {
					manageId: row.manageId
				};
				this.axios.post('/perTaxToolTwo/callcenter/taxNotice/getAccountNotice', param).then(res => {
					this.loading1 = false;
					if (res.data.code == 200) {
						if (res.data.data) {
							if (res.data.data.taxNoticeId) {
								this.dialogVisible2 = true;
								this.form3 = JSON.parse(JSON.stringify(res.data.data));
								this.form3.yearIncId = row.yearIncId;
								this.form3.nationUserName = row.nationUserName;
								this.form3.accountNotice = row.accountNotice;
								this.form3.nationRemark = row.nationRemark;
								this.form3.isTaxIdentification = row.isTaxIdentification;
								this.form3.auditAccounting = row.auditAccounting;

								this.form3.taxationId = row.taxationId;
								this.form3.taxInfoId = row.taxInfoId;
								this.form3.incomeTaxRecord = row.incomeTaxRecord;
								this.form3.corpIncomeTaxRecordId = row.corpIncomeTaxRecordId;

								this.form3.manageId = row.manageId;
								this.remarkList = this.form3.noticeRemarkList;
								this.getContactList(row);
							}
						} else {
							this.dialogVisible = true;
							this.form3 = JSON.parse(JSON.stringify(row));
							this.remarkList = this.form3.noticeRemarkList;
							this.getContactList(row);
						}



					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading1 = false;
					this.$message({
						message: '获取联系人失败',
						type: 'error'
					});
				})
			},

			updateErpOperateInfoOfTaxRecord(type, value) {
				if (value == '再次送票') {
					var params = {
						"resultStatus": type,
						"taxationId": this.form3.taxationId,
						"taxInfoId": this.form3.taxInfoId,
						"id": this.form3.incomeTaxRecord,
						'remark': this.form3.remark ? this.form3.remark + '-' + value : value,
						'againTicket': 1
					};
				} else {
					var params = {
						"resultStatus": type,
						"taxationId": this.form3.taxationId,
						"taxInfoId": this.form3.taxInfoId,
						"id": this.form3.incomeTaxRecord,
						'remark': value
					};
				}

				this.axios.post('/perTaxToolTwo/e9z/e9zBusinessIncomeTaxRecord/updateErpOperateInfoOfTaxRecord', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							if (type == 1) {
								if (this.accountPeriod1.slice(5, 7) % 3 == 0) {
									this.confirmCorpIncomeTax(1, '税款确认');
								}

							}
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


			confirmCorpIncomeTax(type, value) {
				this.findCorpIncomeTaxList(type, value)


			},

			commit() {
				if (this.multipleSelection.length > 1) {
					this.$message({
						message: '只能选择一位联系人',
						type: 'error'
					});
				} else if (this.multipleSelection.length == 0) {
					this.$message({
						message: '请选择一位联系人',
						type: 'error'
					});
				} else if (!this.detail1.corpIncomeTaxRecordId) {
					this.saveOrUpdateTaxNotice();
				}
				// else if(!this.hasChecked && this.form3.corpIncomeTaxRecordId){
				// 	this.$message({
				// 		message: '请先确认计算',
				// 		type: 'error'
				// 	});
				// }
				else {
					// accountNoticeList1:[
					// 	{label:'税款确认',value:1},
					// 	{label:'主管核对所得税',value:2},
					// 	{label:'主管核对月税',value:5},
					// 	{label:'再次送票',value:3},
					// 	{label:'再联系',value:4}
					// ],
					console.log(this.hasChecked);
					console.log(this.form3.id);
					if (!this.hasChecked && this.detail1.corpIncomeTaxRecordId) {
						this.$confirm('未确认计算，是否确定提交？', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						}).then(() => {
							this.saveOrUpdateTaxNotice();
						}).catch(() => {
							this.$message({
								type: 'info',
								message: '已取消'
							});
						});
					} else {
						this.saveOrUpdateTaxNotice();
					}





				}

			},

			saveOrUpdateTaxNotice() {
				this.form3.serviceManageId = this.form3.manageId;
				this.form3.contactName = this.multipleSelection[0].contactname;
				this.form3.contactPhone = this.multipleSelection[0].phone;
				this.form3.taxType = 2;
				console.log(this.form3);
				let param1 = this.form3;
				this.axios.post('/perTaxToolTwo/callcenter/taxNotice/saveOrUpdateTaxNotice', param1).then(res => {

					if (res.data.code == 200) {
						this.dialogVisible = false;
						this.dialogVisible2 = false;
						this.hasChecked = false;
						// if(this.form3.noticeResult != 4){
						// 	this.continue(this.form3);
						// }

						if (this.form3.noticeResult == 1) {
							//税款确认 调月税同意和所得税同意
							// this.confirmCorpIncomeTax(1,'税款确认');
							this.updateErpOperateInfoOfTaxRecord(1, '税款确认');
							if(this.detail2.yearIncId){
								this.confirmYearCorpIncomeTax(1)
							}
							
						}
						if (this.form3.noticeResult == 2 && this.form3.corpIncomeTaxRecordId) {
							//主管核对所得税调所得税不同意（备注填主管核对所得税）
							if(this.detail2.yearIncId){
								this.confirmYearCorpIncomeTax(2)
							}else{
								this.confirmCorpIncomeTax(2, '主管核对所得税');
							}
							
						}
						if (this.form3.noticeResult == 5) {
							//主管核对月税调月税不同意（备注填主管核对月税）
							this.updateErpOperateInfoOfTaxRecord(2, '主管核对月税')
						}

						if (this.form3.noticeResult == 3) {
							//再次送票调月税不同意（备注填再次送票）
							this.updateErpOperateInfoOfTaxRecord(2, '再次送票')
						}
						this.queryListByPage();

						this.$message({
							message: res.data.msg,
							type: 'success'
						});


					} else {
						this.hasChecked = false;
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.hasChecked = false;
					this.$message({
						message: '操作失败',
						type: 'error'
					});
				})
			},
			
			
			confirmYearCorpIncomeTax(val){
				let param1 = this.detail2;
				param1.resultStatus = val;
				param1.id = this.detail2.yearIncId;
				param1.source = 2;
				param1.customerId = this.form3.customerId;
				param1.accountPeriod = this.form3.accountPeriod;
				param1.customerName = this.form3.customerName;
				this.axios.post('/perTaxToolTwo/import/confirmYearCorpIncomeTax', param1).then(res => {
				
					if (res.data.code == 200) {
				
				
						// this.$message({
						// 	message: res.data.msg,
						// 	type: 'success'
						// });
				
				
					} else {
				
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				})
			},

			findCorpIncomeTaxList(type, value) {
				let param = {
					taxInfoId: this.form3.taxInfoId,
					state: 1
				};
				this.axios.post('/perTaxToolTwo/import/findCorpIncomeTaxList', param).then(res => {

					if (res.data.code == 200) {
						console.log(this.form3);
						if (res.data.data.length > 0) {
							this.form3.corpIncomeTaxRecordId = res.data.data[res.data.data.length - 1].id;
							console.log(this.form3);
							if (this.form3.corpIncomeTaxRecordId) {
								let params = {
									"resultStatus": type,
									"source": 2,
									"accountPeriod": this.form3.accountPeriod,
									"customerName": this.form3.customerName,
									"customerId": this.form3.customerId,
									'remark': value,
									'id': this.form3.corpIncomeTaxRecordId,
								};
								this.axios.post('/perTaxToolTwo/import/confirmCorpIncomeTax', params)
									// this.axios.post('/miaoxing/queryPage', params)
									.then(res => {

										if (res.data.code == 200) {
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
							} else {
								this.$message({
									message: "系统繁忙，请稍后重试",
									type: "error"
								});
							}
						} else {
							this.$message({
								message: '请稍后重试',
								type: 'warning'
							});
						}



					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '操作失败',
						type: 'error'
					});
				})
			},

			commit1() {
				if (this.multipleSelection.length > 1) {
					this.$message({
						message: '只能选择一位联系人',
						type: 'error'
					});
				} else if (this.multipleSelection.length == 0) {
					this.$message({
						message: '请选择一位联系人',
						type: 'error'
					});
				} else {
					let param = {
						taxNoticeId: this.form3.taxNoticeId,
						remark: this.form3.remark,
						contactName: this.multipleSelection[0].contactname,
						customerPhone: this.multipleSelection[0].phone
					};
					this.axios.post('/perTaxToolTwo/callcenter/accountNotice/saveAccountNoticeRemark', param).then(res => {

						if (res.data.code == 200) {
							this.dialogVisible1 = false;
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
							message: '操作失败',
							type: 'error'
						});
					})
				}


			},


			calcu() {
				if (this.costInvAmt < 0 || this.feeInvAmt < 0) {
					this.$message({
						message: '暂估值不能小于0',
						type: 'error'
					});
				} else {
					let params = {

						costInvAmt: this.costInvAmt - this.detail1.costInvAmtShow,
						feeInvAmt: this.feeInvAmt - this.detail1.feeInvAmtShow,
						
						// costInvAmt: this.costInvAmt,
						// feeInvAmt: this.feeInvAmt,
						// costInvAmtShow:this.detail1.costInvAmtShow,
						// feeInvAmtShow:this.detail1.feeInvAmtShow,
						customerId: this.detail1.customerId,
						accountPeriod: this.detail1.accountPeriod,
						id: this.detail1.id,

						"resultStatus": 2,
						"source": 2,
						"customerName": this.detail1.customerName,

						// priorYearLoss:this.detail.priorYearLoss,
						// remedyPriorYearLoss:this.detail.remedyPriorYearLoss,
						// incomeTaxRate:this.detail.incomeTaxRate,
						// taxCollectWay:this.detail.taxCollectWay,


					};
					this.axios.post('/perTaxToolTwo/import/calcCorpIncomeTaxRecord', params)
						.then(res => {
							if (res.data.code == 200) {
								this.detail1 = res.data.data;
								this.detail1.customerId = res.data.data.customerId;
								this.detail1.accountPeriod = res.data.data.accountPeriod;
								this.detail1.customerName = res.data.data.customerName;
								this.detail1.corpIncomeTaxRecordId = res.data.data.id;
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

			refresh() {
				if (this.temtaxInfoId) {
					this.resetDetail();
					let params = {
						// id: row.corpIncomeTaxRecordId,
						taxInfoId: this.temtaxInfoId,
					};
					this.axios.post('/perTaxToolTwo/e9z/corpIncomeTax/selectEstimationCorpIncomeTax', params)
						.then(res => {
							this.loading = false;
							if (res.data.code == 200) {
								if (res.data.data) {
									this.detail1 = res.data.data;
									if (this.detail1.id) {
										this.detail1.corpIncomeTaxRecordId = this.detail1.id;
										this.canCal = true;
									} else {
										this.canCal = false;
									}
									// this.$message({
									// 	message: res.data.msg,
									// 	type: 'success'
									// });
								} else {
									this.canCal = false;
								}

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

			showDetail(row) {
				this.formdeclareType = row.declareType;
				this.declarationCycle = row.isQuarterlyReport;
				this.accountPeriod1 = row.accountPeriod;
				this.temtaxInfoId = row.taxInfoId;
				let params = {
					id: row.incomeTaxRecord,
					accountPeriod: row.accountPeriod
					// id:1
				};
				this.axios.post('/perTaxToolTwo/e9z/e9zBusinessIncomeTaxRecord/getIncomeTaxRecordById', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.detail = res.data.data;
							// this.$message({
							// 	message: res.data.msg,
							// 	type: 'success'
							// });
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

				//查询所得税详情taxInfoId
				if (row.taxInfoId) {
					this.resetDetail();
					let params = {
						// id: row.corpIncomeTaxRecordId,
						taxInfoId: row.taxInfoId,
					};
					this.axios.post('/perTaxToolTwo/e9z/corpIncomeTax/selectEstimationCorpIncomeTax', params)
						.then(res => {
							this.loading = false;
							if (res.data.code == 200) {
								if (res.data.data) {
									this.detail1 = res.data.data;
									if (this.detail1.id) {
										this.detail1.corpIncomeTaxRecordId = this.detail1.id;
										this.canCal = true;
									} else {
										this.canCal = false;
									}
									// this.$message({
									// 	message: res.data.msg,
									// 	type: 'success'
									// });
								} else {
									this.canCal = false;
								}

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


					let params1 = {
						taxInfoId: row.taxInfoId,

					};
					this.axios.post('/perTaxToolTwo/import/findEstimationCorpIncomeTaxList', params1)
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							if (res.data.code == 200) {
								this.ZGhistory = res.data.data;

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
				} else {
					// this.canCal = false;
					this.detail1 = {

						income: 0,
						incomeSum: 0,
						cost: 0,
						fee: 0,
						profit: 0,
						priorYearLoss: 0,
						remedyPriorYearLoss: 0,
						verifiedRate: 0,
						taxableIncome: 0,
						incomeTaxRate: 0,
						totalIncomeTaxation: 0,
						paidIncomeTaxation: 0,
						incomeTaxation: 0,
						prepayIncomeTaxation: 0,
						costInvAmt: 0,
						feeInvAmt: 0,
						settlementProfit: 0,
						addIncomeTaxation: 0,
						costInvAmtShow: 0,
						feeInvAmtShow: 0
					};
				}


			},



			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

			getCustomerServicer() {
				let param = {};
				this.axios.post('/perTaxToolTwo/callcenter/customerServiceConfig/queryList', param).then(res => {

					if (res.data.code == 200) {
						this.customerServicerList = res.data.data;


					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取失败',
						type: 'error'
					});
				})
			},
			getContactList(row) {
				this.loading1 = true;
				let param = {
					manageId: row.manageId
				};
				this.axios.post('/perTaxToolTwo/callcenter/accountNotice/getContactList', param).then(res => {
					this.loading1 = false;
					if (res.data.code == 200) {
						this.contactPersonInfo = res.data.data;
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
					this.loading1 = false;
					this.$message({
						message: '获取联系人失败',
						type: 'error'
					});
				})
			},






		},
		created() {
			this.queryListByPage();
			var roleList = JSON.parse(sessionStorage.getItem('updateUser')).roleList;
			roleList.forEach(item => {
				if (item.roleSign == 'callCenter_admin') {
					this.isRole3 = true;
					this.getCustomerServicer();
				}
			});
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
			background: #fff;
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
		justify-content: flex-start;
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

	.tabtitle {
		display: flex;
		align-items: center;
		height: 35px;
	}

	.lineicon {
		width: 5px;
		background: #409EFF;
		height: 16px;
		margin-right: 10px;
	}

	.line {
		display: flex;
		flex-wrap: nowrap;
		flex-direction: row;
		justify-content: space-between;
		height: 0.4rem;
		align-content: center;
		align-items: center;
		margin-bottom: 20px;
	}

	/deep/ .longLabel .el-form-item__label {
		line-height: 16px;
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
</style>
