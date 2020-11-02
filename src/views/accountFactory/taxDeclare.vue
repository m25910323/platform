<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>纳税申报</el-breadcrumb-item>
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
						 value-format="yyyy-MM" :clearable="false">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="申报状态" prop="executeStatus">
						<el-select v-model="uploadData.executeStatus" placeholder="请选择" filterable>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in resultStatusList" :label="item.label" :value='item.value'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态" prop="taxInfoRemark3">
						<el-select v-model="uploadData.taxInfoRemark3" placeholder="请选择" filterable>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in resultStatusList1" :label="item.label" :value='item.value'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否中高端" prop="taxInfoRemark6">
						<el-select v-model="uploadData.taxInfoRemark6" placeholder="请选择">
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option label="全部" value=''></el-option>
							<el-option label="是" value='1'></el-option>
							<el-option label="否" value='0'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="税务类型" prop="taxInfoRemark5">
						<el-select v-model="uploadData.taxInfoRemark5" placeholder="请选择" filterable>
							<el-option label="全部" value=''></el-option>
							<el-option label="一般纳税人" value='233'></el-option>
							<el-option label="小规模纳税人" value='232'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="国税" prop="taxReportStatus">
						<el-select v-model="uploadData.taxReportStatus" placeholder="请选择" filterable>
							<el-option label="全部" value=''></el-option>
							<el-option label="未申报" value='0'></el-option>
							<el-option label="已申报" value='1'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="个税" prop="perTaxReportStatus">
						<el-select v-model="uploadData.perTaxReportStatus" placeholder="请选择" filterable>
							<el-option label="全部" value=''></el-option>
							<el-option label="未申报" value='0'></el-option>
							<el-option label="已申报" value='1'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所得税" prop="corpTaxReportStatus">
						<el-select v-model="uploadData.corpTaxReportStatus" placeholder="请选择" filterable>
							<el-option label="全部" value=''></el-option>
							<el-option label="未申报" value='0'></el-option>
							<el-option label="已申报" value='1'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="行政区" prop="taxInfoRemark7">
						<el-select v-model="uploadData.taxInfoRemark7" placeholder="请选择" filterable>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option label="全部" value=''></el-option>
							<el-option v-for="item in areaList" :label="item.taxInfoRemark7" :value='item.taxInfoRemark7'></el-option>
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

			<el-table :data="tableData"  stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<!-- <el-table-column align="" label="资产">
					<template slot-scope="scope">
						<span v-html='scope.row.fAsset'></span>
					</template>
				</el-table-column> -->
				<el-table-column align="center" label="客户名称" prop='taxInfoRemark2' width="200"></el-table-column>
				<el-table-column align="center" label="账期" prop="accountPeriod"></el-table-column>
				<el-table-column align="center" label="行政区" prop="taxInfoRemark7"></el-table-column>
				<el-table-column align="center" label="是否零申报" prop="isZeroReport">
					<template slot-scope="scope">
						<span v-if='scope.row.isZeroReport == 1'>是</span>
						<span v-else>否</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="企业所得税征收方式" prop="taxInfoRemark1">
					<template slot-scope="scope">
						<span>{{scope.row.taxInfoRemark1?scope.row.taxInfoRemark1:'--'}}</span>
						
					</template>
				</el-table-column>
				<el-table-column align="center" label="审核会计" prop="checkAccountant"></el-table-column>
				<el-table-column align="center" label="做账会计" prop="doAccountant"></el-table-column>
				<el-table-column align="center" label="所得税" v-if='accountPeriod.slice(5,7)%3 == 0 || accountPeriod == ""'>
					<el-table-column align="center" label="应交所得税" prop="incomeTaxation"></el-table-column>
					<el-table-column align="center" label="申报状态" prop="corpTaxReportStatus">
						<template slot-scope="scope">
							<span v-if='scope.row.corpTaxReportStatus == 1'>已申报</span>
							<span v-else>未申报</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="申报时间" prop="corpTaxReportTime">
						<template slot-scope="scope">
							<span>{{scope.row.corpTaxReportTime?formatTimeToStr(scope.row.corpTaxReportTime,'yyyy-MM-dd'):'--'}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="申报人" prop="corpTaxUserName">
						<template slot-scope="scope">
							<span>{{scope.row.corpTaxUserName?scope.row.corpTaxUserName:'--'}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作">
						<template slot-scope="scope">
							<el-button v-if='scope.row.corpTaxReportStatus == 1' type="text" disabled size="mini">--</el-button>
							<el-button v-if='scope.row.corpTaxReportStatus != 1 && isRole3 && scope.row.accountPeriod.slice(5,7)%3 == 0 && scope.row.taxInfoRemark3 == 1' type="text" size="mini" @click='declare(3,1,scope.row)'>申报成功</el-button>
							<el-button v-if='scope.row.corpTaxReportStatus != 1 && isRole3 && scope.row.accountPeriod.slice(5,7)%3 == 0 && scope.row.taxInfoRemark3 == 1' type="text" size="mini" @click='declare(3,2,scope.row)'>回退</el-button>
							<el-button v-if='scope.row.corpTaxReportStatus != 1 && isRole3 && scope.row.accountPeriod.slice(5,7)%3 == 0 && scope.row.taxInfoRemark3 == 1' type="text" size="mini" @click='declare(3,3,scope.row)'>无需申报</el-button>
							<el-button v-if='scope.row.corpTaxReportStatus != 0 && isRole3 && scope.row.accountPeriod.slice(5,7)%3 == 0 && scope.row.taxInfoRemark3 == 1' type="text" size="mini" @click='declare(3,4,scope.row)'>重新申报</el-button>
						</template>
					</el-table-column>
					<el-table-column align="center" label="所得税明细">
						<template slot-scope="scope">
							<el-button type='primary' size="mini" @click='showDetail1(scope.row)' :disabled='scope.row.accountPeriod.slice(5,7)%3 != 0'>查看</el-button>
						</template>
					</el-table-column>
					<el-table-column align="center" label="备注" prop="corpTaxRemark"></el-table-column>
				</el-table-column>
				
				
				<el-table-column align="center" label="国税">
					<el-table-column align="center" label="税款" prop="nationaTax"></el-table-column>
					<el-table-column align="center" label="申报状态" prop="taxReportStatus">
						<template slot-scope="scope">
							<span v-if='scope.row.taxReportStatus == 1'>已申报</span>
							<span v-else>未申报</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="申报时间" prop="taxReportTime">
						<template slot-scope="scope">
							<span>{{scope.row.taxReportTime?formatTimeToStr(scope.row.taxReportTime,'yyyy-MM-dd'):'--'}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="申报人" prop="taxReportUserName">
						<template slot-scope="scope">
							<span>{{scope.row.taxReportUserName?scope.row.taxReportUserName:'--'}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作">
						<template slot-scope="scope">
							<el-button type='text' size="mini" @click='showDetail(scope.row)'>详细税款</el-button>
							<el-button type='text' size="mini" @click='jumpTothis2(scope.row)' v-if='scope.row.executeStatus == 1 || scope.row.executeStatus == 2'>税款查询</el-button>
							<el-button v-if='scope.row.taxReportStatus == 1' type="text" disabled size="mini">--</el-button>
							<el-button v-if='scope.row.taxReportStatus != 1 && scope.row.nation == 1 && scope.row.taxInfoRemark3 == 1' type="text" size="mini" @click='declare(1,1,scope.row)'>申报成功</el-button>
							<el-button v-if='scope.row.taxReportStatus != 1 && scope.row.nation == 1 && scope.row.taxInfoRemark3 == 1' type="text" size="mini" @click='declare(1,2,scope.row)'>回退</el-button>
							<el-button v-if='scope.row.taxReportStatus != 1 && scope.row.nation == 1 && scope.row.taxInfoRemark3 == 1' type="text" size="mini" @click='declare(1,3,scope.row)'>无需申报</el-button>
							<el-button v-if='scope.row.taxReportStatus != 0 && scope.row.nation == 1 && scope.row.taxInfoRemark3 == 1' type="text" size="mini" @click='declare(1,4,scope.row)'>重新申报</el-button>
						</template>
					</el-table-column>
					<el-table-column align="center" label="申报表" prop="fYearEndLeft">
						<template slot-scope="scope">
							<el-button type='primary' size="mini" @click='jumpTothis(scope.row)'>查看</el-button>
						</template>
					</el-table-column>
					<el-table-column align="center" label="备注" prop="taxReportRemark"></el-table-column>
				</el-table-column>
				<el-table-column align="center" label="个税">
					<el-table-column align="center" label="税款" prop="wages"></el-table-column>
					<el-table-column align="center" label="申报状态" prop="perTaxReportStatus">
						<template slot-scope="scope">
							<span v-if='scope.row.perTaxReportStatus == 1'>已申报</span>
							<span v-else>未申报</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="申报时间" prop="perTaxReportTime">
						<template slot-scope="scope">
							<span>{{scope.row.perTaxReportTime?formatTimeToStr(scope.row.perTaxReportTime,'yyyy-MM-dd'):'--'}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="申报人" prop="perTaxReportUserName">
						<template slot-scope="scope">
							<span>{{scope.row.perTaxReportUserName?scope.row.perTaxReportUserName:'--'}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作">
						<template slot-scope="scope">
							<el-button v-if='scope.row.perTaxReportStatus == 1' type="text" disabled size="mini">--</el-button>
							<el-button v-if='scope.row.perTaxReportStatus != 1 && scope.row.person == 1 && scope.row.taxInfoRemark3 == 1' type="text" size="mini" @click='declare(2,1,scope.row)'>申报成功</el-button>
							<el-button v-if='scope.row.perTaxReportStatus != 1 && scope.row.person == 1 && scope.row.taxInfoRemark3 == 1' type="text" size="mini" @click='declare(2,2,scope.row)'>回退</el-button>
							<el-button v-if='scope.row.perTaxReportStatus != 1 && scope.row.person == 1 && scope.row.taxInfoRemark3 == 1' type="text" size="mini" @click='declare(2,3,scope.row)'>无需申报</el-button>
							<el-button v-if='scope.row.perTaxReportStatus != 0 && scope.row.person == 1 && scope.row.taxInfoRemark3 == 1' type="text" size="mini" @click='declare(2,4,scope.row)'>重新申报</el-button>
						</template>
					</el-table-column>
					<el-table-column align="center" label="申报表" prop="fYearEndLeft">
						<template slot-scope="scope">
							<el-button type='primary' size="mini" @click='jumpTothis1(scope.row)'>查看</el-button>
						</template>
					</el-table-column>
					<el-table-column align="center" label="备注" prop="perTaxReportRemark"></el-table-column>
				</el-table-column>
				<el-table-column align="center" label="申报状态" prop="executeStatus">
					<template slot-scope="scope">
						<span v-if='scope.row.executeStatus == 2'>已完成</span>
						<span v-if='scope.row.executeStatus == 1'>未完成</span>
						<span v-if='scope.row.executeStatus == 3'>回退</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="终止状态" prop="taxInfoRemark3">
					<template slot-scope="scope">
						<span v-if='scope.row.taxInfoRemark3 == 2'>终止</span>
						<span v-if='scope.row.taxInfoRemark3 == 1'>正常</span>
						<!-- <el-button type='text' size="mini" v-if='scope.row.taxInfoRemark3 == 0'>重做</el-button> -->
					</template>
				</el-table-column>
				<el-table-column align="center" label="税款详情" prop="fYearBeforeRight">
					<template slot-scope="scope">
						
						<el-button type='primary' size="mini" @click='submitTerminate(scope.row)' :disabled='!(scope.row.isTerminateState == 0 && scope.row.terminateState != 2)'>终止</el-button>
					</template>
				</el-table-column>

			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>

		</div>

		<el-dialog :title='title' :visible.sync="dialogVisible" width="1000px" class='dialog'>
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
					<p v-if="taxInfoRemark5 == 232 && declarationCycle == 1" >
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
			<el-button size="mini" type="text" @click='jumpToZcfzb()'>资产负债表</el-button>
			<el-button size="mini" type="text" @click='jumpToLrb()'>利润表</el-button>
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
		
		
		<el-dialog title="回退" :visible.sync="dialogVisible2" width="400px">
			<el-form ref="form" :model="detail2" label-width="100px" size="mini" inline="true">
				<el-form-item label="回退原因">
					<el-select v-model="detail2.value" placeholder="请选择">
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option label="税款重新计算" value='税款重新计算'></el-option>
						<el-option label="重新上传发票" value='重新上传发票'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="备注">
					
					<el-input v-model="detail2.value1" placeholder="请输入" type="textarea" :row='3'></el-input>
				</el-form-item>
			</el-form>
		
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible2 == false" size="mini">取消</el-button>
				<el-button type="primary" @click="commitReturn" size="mini">确定</el-button>
			</span>
		
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				temRow :'',
				temOperate :'',
				temType:'',
				isRole3:false,
				temaccountPeriod:'',
				temcustomerName:'',
				areaList:[],
				title:'',
				fBrNo: '',
				fYear: '',
				fPeriod: '',
				loading: false,
				value4: this.formatTimeToStr(new Date(), 'yyyy-MM'),
				selectNum: new Date().getMonth(),
				percentage: 0,
				uploadData: {
					executeStatus: 5,
					taxReportStatus: '',
					perTaxReportStatus: '',
					corpTaxReportStatus: '',
					taxInfoRemark5: '',
					taxInfoRemark7:'',
					accountPeriod :''
				},
				tableData: [],
				customerName: '',
				currentPage: 1,
				pageSize: 10,
				total: 0,
				resultStatusList: [
					{
						label: '全部',
						value: 5
					},{
						label: '已完成',
						value: 4
					},
					{
						label: '未完成',
						value: 1
					},
					{
						label: '回退',
						value: 3
					}

				],
				resultStatusList1: [
					{
						label: '全部',
						value: ''
					},{
						label: '正常',
						value: 1
					},
					{
						label: '终止',
						value: 2
					}
				
				],
				executeStatus: 5,
				taxReportStatus: '',
				perTaxReportStatus: '',
				corpTaxReportStatus: '',
				taxInfoRemark5: '',
				taxInfoRemark7: '',
				customerName: "",
				accountPeriod: '',
				dialogVisible:false,
				dialogVisible1:false,
				dialogVisible2:false,
				title1:'',
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
				detail:{
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
				detail2:{},
				custList:[],
				taxInfoRemark3:'',
				taxInfoRemark55:'',
				declarationCycle:'',
				accountPeriod1:''
			}
		},
		components: {},
		methods: {
			getAreaList(){
				let params = {
				};
				this.axios.post('/perTaxToolTwo/e9zCalculate/groupByRemark7', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.areaList = res.data.data;
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
			commitReturn(){
				if(this.detail2.value && this.detail2.value1){
					var taxRemark = this.detail2.value + '-' + this.detail2.value1
				}else if(this.detail2.value){
					var taxRemark = this.detail2.value
				}else if(this.detail2.value1){
					var taxRemark = this.detail2.value1
				}else{
					var taxRemark = ''
				}
				let params = {
					taxRemark:taxRemark,
					"operate": this.temOperate,
					"type": this.temType,
					"taxationId": this.temRow.taxationId,
					"taxInfoId": this.temRow.taxInfoId,
					"taxReportRecordId": this.temRow.taxReportRecordId,
					"customerId":this.temRow.customerId,
					"accountPeriod":this.temRow.accountPeriod,
				};
				this.axios.post('/perTaxToolTwo/e9z/taxStep/updateTaxOperate', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.dialogVisible2 = false;
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
			},
			declare(type, operate,row) {
				if (operate == 1) {
					var title = "确认申报成功？";
				} else if(operate == 2){
					var title = "确认回退？";
				}else if(operate == 3){
					var title = "确认无需申报？";
				}else{
					var title = "确认重新申报？";
				}
				if(operate == 2){
					if(type == 1 || type == 2){
						this.dialogVisible2 = true;
						this.temRow = row;
						this.temOperate = operate;
						this.temType = type;
					}else{
						this.$prompt('备注', '确认回退？', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							
						}).then(({ value }) => {
							let params = {
								taxRemark:value,
								"operate": operate,
								"type": type,
								"taxationId": row.taxationId,
								"taxInfoId": row.taxInfoId,
								"taxReportRecordId": row.taxReportRecordId,
								customerId:row.customerId,
								accountPeriod:row.accountPeriod,
							};
							this.axios.post('/perTaxToolTwo/e9z/taxStep/updateTaxOperate', params)
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
								message: '已取消'
							});       
						});
					}
					
				}else{
					this.$confirm(title, '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let params = {
							"operate": operate,
							"type": type,
							"taxationId": row.taxationId,
							"taxInfoId": row.taxInfoId,
							"taxReportRecordId": row.taxReportRecordId,
							customerId:row.customerId,
							accountPeriod:row.accountPeriod,
						};
						this.axios.post('/perTaxToolTwo/e9z/taxStep/updateTaxOperate', params)
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
							message: '已取消'
						});
					});
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
				this.executeStatus = this.uploadData.executeStatus;
				this.customerName = this.uploadData.customerName;
				this.accountPeriod = this.uploadData.accountPeriod;
				this.taxReportStatus = this.uploadData.taxReportStatus;
				this.perTaxReportStatus = this.uploadData.perTaxReportStatus;
				this.corpTaxReportStatus = this.uploadData.corpTaxReportStatus;
				this.taxInfoRemark3 = this.uploadData.taxInfoRemark3;
				this.taxInfoRemark55 = this.uploadData.taxInfoRemark5;
				this.taxInfoRemark7 = this.uploadData.taxInfoRemark7;
				this.taxInfoRemark6 = this.uploadData.taxInfoRemark6;
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
						"stepName": "申报",
						executeStatus : this.executeStatus,
						customerName : this.customerName,
						accountPeriod  : this.accountPeriod,
						perTaxReportStatus: this.perTaxReportStatus,
						taxReportStatus: this.taxReportStatus,
						corpTaxReportStatus: this.corpTaxReportStatus,
						taxInfoRemark5:this.taxInfoRemark55,
						taxInfoRemark7:this.taxInfoRemark7,
						taxInfoRemark3:this.taxInfoRemark3,
						taxInfoRemark6:this.taxInfoRemark6,
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
			jumpToZcfzb(){
				
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/balanceStatementE9', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						
						accountPeriod: this.temaccountPeriod,
						customerName: this.temcustomerName,
					}
				})
			},
			jumpToLrb(){
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/profitStatementE9', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						
						accountPeriod: this.temaccountPeriod,
						customerName: this.temcustomerName,
					}
				})
			},
			
			showDetail1(row){
				// if(row.corpIncomeTaxRecordId){
				if(row.taxInfoId){
					this.dialogVisible1 = true;
					this.title1 = row.taxInfoRemark2 + '所得税明细';
					this.temaccountPeriod = row.accountPeriod;
					this.temcustomerName = row.taxInfoRemark2;
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

			showDetail(row){
				this.taxInfoRemark5 = row.taxInfoRemark5;
				this.declarationCycle = row.declaration_cycle;
				this.accountPeriod1 = row.accountPeriod;
				this.dialogVisible = true;
				this.title = row.taxInfoRemark2 + '税款明细';
				let params = {
					id:row.incomeTaxRecord,
					accountPeriod:row.accountPeriod
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
			
			
			jumpTothis(row){
				this.$router.push({ //核心语句
					path: '/accountFactory/showReport', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						customerId: row.customerId,
						accountPeriod: row.accountPeriod,
						reportTaxType:parseInt(row.taxInfoRemark5)
					}
				})
			},
			jumpTothis1(row){
				this.$router.push({ //核心语句
					path: '/accountFactory/reportForms', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						customerId: row.customerId,
						accountPeriod: row.accountPeriod,
						reportTaxType:parseInt(row.taxInfoRemark5)
					}
				})
			},
			jumpTothis2(row){
				this.$router.push({ //核心语句
					path: '/accountFactory/invoice_t', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						customerId: row.customerId,
						accountPeriod: row.accountPeriod,
						index:1
					}
				})
			},
			
			
			submitTerminate(row){
				this.$confirm('确认终止？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"taxationId": row.taxationId,
						"taxInfoId": row.taxInfoId,
						// id:1
					};
					this.axios.post('/perTaxToolTwo/e9z/taxStep/submitTerminate', params)
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
			getAssignmentCustomer(){
				let params = {
					"stepName": 4
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
					var roleList = JSON.parse(sessionStorage.getItem('updateUser')).roleList;
					roleList.forEach(item => {
						if(item.roleSign == 'income_tax_dclr'){
							this.isRole3 = true;
						}
					});
					this.userTypeId = JSON.parse(sessionStorage.getItem('updateUser')).userTypeId;
					if(this.userTypeId == 1){
						this.isRole3 = true;
					}
					this.getAreaList();
					this.getCurrentPeriod();
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
		},
		created() {
			var roleList = JSON.parse(sessionStorage.getItem('updateUser')).roleList;
			roleList.forEach(item => {
				if(item.roleSign == 'income_tax_dclr'){
					this.isRole3 = true;
				}
			});
			this.userTypeId = JSON.parse(sessionStorage.getItem('updateUser')).userTypeId;
			if(this.userTypeId == 1){
				this.isRole3 = true;
			}
			this.getAreaList();
			this.getCurrentPeriod();
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
				background: rgb(243,246,249);
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
				text-overflow:ellipsis;
				white-space: nowrap;
			}
		
			p span:nth-of-type(2n+1) {
				float: left;
				width: 60%;
				text-indent: 20px
			}
		}
		
		/deep/ .el-dialog__body{
			padding: 0 20px 30px;
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
