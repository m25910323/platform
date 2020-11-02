<template>
	<div class="showReport">
		<div class='search'>
			<!-- <div class="title">报表查看</div> -->
			<div class='search_contain'>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" :rules="rulesSearch" ref='formSearch'>
					<el-form-item label="客户名称:" prop="customer">
						<el-select v-model="uploadData.customer" placeholder="请选择" filterable value-key="customerId">
							<el-option v-for="item in $store.state.cust" :key="item.customerId" :label="item.customerName" :value="item">
							</el-option>
							<!-- <el-option v-for="item in searchList.options" :key="item.customerId" :label="item.customerName" :value="item.customerId">
                        </el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="账期:" prop="calculatingYear">
						<el-date-picker v-model="uploadData.calculatingYear" type="month" placeholder="请选择" clearable value-format='yyyy-MM'
						 format="yyyy-MM">
						</el-date-picker>
					</el-form-item>

					<el-form-item style="margin-bottom:0">
						<el-button type="primary" @click="search('formSearch')" style="margin-left:20px" size="mini">查询</el-button>

					</el-form-item>
					<!-- <el-form-item style="margin-bottom:0">
						<el-button @click="outputFile('formSearch')" size="mini">一键导出</el-button>

					</el-form-item> -->
					<!-- <el-form-item style="margin-bottom:0">
						<el-button @click="downLoad('formSearch')" size="mini">下载报表模板</el-button>

					</el-form-item> -->

				</el-form>
			</div>
		</div>
		<el-tabs v-model="activeName" type="card">
			<el-tab-pane label="审核中" name="2" :disabled="!thisData.customerName">
				<div class="titleBox">
					<el-button type="primary" size="small" @click='handleApprove' :disabled="!thisData.customerName" style="margin-right: 20px;float: right;">审核</el-button>
					<div class="title">
						<p class="line1">汇 算 清 缴 查 询</p>
						<!-- <p class="line2">（一般纳税人适用）</p> -->
						<!-- <p class="line3">根据国家税收法律法规及增值税相关规定制定本表。纳税人不论有无销售额，均应按税务机关核定的纳税期限填写本表，并向当地税务机关申报。</p> -->
					</div>
					<div class="Infobox">
						<el-form :inline="true" :model="thisData" class="demo-form-inline" size="small">

							<div class="line3">
								<el-form-item label="客户名称：" class="leftWidth">
									<div class="inlineInput">
										<el-input v-model="thisData.customerName" disabled></el-input>
									</div>
								</el-form-item>
								<el-form-item label="所得税征收方式：">
									<div class="inlineInput">
										<el-input v-model="thisData.incomeTaxCollectionMethod" disabled></el-input>
									</div>
								</el-form-item>
							</div>
							<div class="line3">
								<el-form-item label="会计负责人：" class="leftWidth">
									<div class="inlineInput">
										<el-input v-model="thisData.accountant" disabled></el-input>
									</div>
								</el-form-item>
								<el-form-item label="月月汇算记录：">
									<div class="inlineInput">
										<el-input v-model="thisData.calculatingYear" disabled></el-input>
									</div>
								</el-form-item>
							</div>
						</el-form>
					</div>

				</div>
				<div class="content">
					<!-- <el-button type="primary" icon="el-icon-success" size="small" @click='exportExcel'>一键导出</el-button> -->
					<div class="tableBox">
						<table border="1" width="100%" id="table1">
							<tr>
								<td colspan="2" class="center">利润表数据</td>
								<td colspan="5" class="center">调整项目</td>
								<td colspan="2" class="center">汇算情况</td>
								<td colspan="2" class="center">参考项</td>
							</tr>
							<tr>
								<td class="center">项目</td>
								<td class="center">金额</td>
								<td class="center">科目</td>
								<td class="center">账务数据</td>
								<td class="center">调整数据</td>
								<td class="center">可补充金额</td>
								<td class="center">转下一年度</td>
								<td class="center">项目</td>
								<td class="center">金额</td>
								<td class="center">科目</td>
								<td class="center">金额</td>
							</tr>
							<tr>
								<td class="center">本月主营业务收入</td>
								<td class="pad3 center" v-text="thisData.monthRevenue"></td>
								<td class="center">成本--其他</td>
								<td class="pad3 center" v-text="thisData.otherCostData"></td>
								<td class="pad3 center" v-text="thisData.otherCostNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData.otherCostAddBills"></td>
								<td class="pad3 center" v-text="thisData.otherCostMoveNextYear"></td>
								<td class="pad3 center">汇算后利润总额</td>
								<td class="pad3 center" v-text="thisData.liquidationProfit"></td>
								<td class="pad3 center">办公费</td>
								<td class="pad3 center" v-text="thisData.administrativeAccountData"></td>
							</tr>
							<tr>
								<td class="center">本月主营业务成本</td>
								<td class="center" v-text="thisData.monthOperatingCosts"></td>
								<td class="center">营业费用--其他</td>
								<td class="pad3 center" v-text="thisData.operatingOtherData"></td>
								<td class="pad3 center" v-text="thisData.operatingOtherNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData.operatingOtherAddBills"></td>
								<td class="pad3 center" v-text="thisData.operatingOtherMoveNextYear"></td>
								<td class="pad3 center">可弥补以前年度亏损额</td>
								<td class="pad3 center" contenteditable="true" @blur="unfocus('remedyLoss',$event)" @keydown.enter="(($event)=>{unfocus('remedyLoss',$event)})"
								 v-text="thisData.remedyLoss"></td>
								<td class="pad3 center">电话费</td>
								<td class="pad3 center" v-text="thisData.telephoneAccountData"></td>
							</tr>
							<tr>
								<td class="center">主营业务收入</td>
								<td class="center" v-text="thisData.totalRevenue"></td>
								<td class="center">营业费用--业务招待费</td>
								<td class="pad3 center" v-text="thisData.operatingEntertainsAccountData"></td>
								<td class="pad3 center" v-text="thisData.operatingEntertainsNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData.operatingEntertainsAddBills"></td>
								<td class="pad3 center" v-text="thisData.operatingEntertainsMoveNextYear"></td>
								<td class="pad3 center">实际弥补以前年度亏损额</td>
								<td class="pad3 center" v-text="thisData.actuallyRemedyLoss"></td>
								<td class="pad3 center">交通费</td>
								<td class="pad3 center" v-text="thisData.carAccountData"></td>
							</tr>
							<tr>
								<td class="center">主营业务成本</td>
								<td class="center" v-text="thisData.totalCost"></td>
								<td class="center">管理费用--其他</td>
								<td class="pad3 center" v-text="thisData.administrativeOtherData"></td>
								<td class="pad3 center" v-text="thisData.administrativeOtherNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData.administrativeOtherAddBills"></td>
								<td class="pad3 center" v-text="thisData.administrativeOtherMoveNextYear"></td>
								<td class="pad3 center">汇算后企业所得税率</td>
								<td class="pad3 center" v-text="thisData.liquidationIncomeTaxRate"></td>
								<td class="pad3 center">差旅费</td>
								<td class="pad3 center" v-text="thisData.travelAccountData"></td>
							</tr>
							<tr>
								<td class="center">其他业务收入</td>
								<td class="center" v-text="thisData.otherRevenue"></td>
								<td class="center">管理费用--业务招待费</td>
								<td class="pad3 center" v-text="thisData.entertainsAccountData"></td>
								<td class="pad3 center" v-text="thisData.entertainsNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData.entertainsAddBills"></td>
								<td class="pad3 center" v-text="thisData.entertainsMoveNextYear"></td>
								<td class="pad3 center">企业所得税率人工修改</td>
								<td class="pad3 center" contenteditable="true" @blur="unfocus('alterIncomeTaxRate',$event)" @keydown.enter="(($event)=>{unfocus('alterIncomeTaxRate',$event)})"
								 v-text="thisData.alterIncomeTaxRate"></td>
								<td class="pad3 center">折旧费</td>
								<td class="pad3 center" v-text="thisData.depreciationAccountData"></td>
							</tr>
							<tr>
								<td class="center">其他业务支出</td>
								<td class="center" v-text="thisData.otherExpenses"></td>
								<td class="center">管理费用--广告费</td>
								<td class="pad3 center" v-text="thisData.advertisingAccountData"></td>
								<td class="pad3 center" v-text="thisData.advertisingNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData.advertisingAddBills"></td>
								<td class="pad3 center" v-text="thisData.advertisingMoveNextYear"></td>
								<td class="pad3 center">预缴企业所得税</td>
								<td class="pad3 center" contenteditable="true" @blur="unfocus('prepayIncomeTax',$event)" @keydown.enter="(($event)=>{unfocus('prepayIncomeTax',$event)})"
								 v-text="thisData.prepayIncomeTax"></td>
								<td class="pad3 center">基金</td>
								<td class="pad3 center" v-text="thisData.fundAccountData"></td>
							</tr>
							<tr>
								<td class="center">投资收益</td>
								<td class="center" v-text="thisData.investmentIncome"></td>
								<td class="center">管理费用--佣金</td>
								<td class="pad3 center" v-text="thisData.commissionAccountData"></td>
								<td class="pad3 center" v-text="thisData.commissionNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData.commissionAddBills"></td>
								<td class="pad3 center" v-text="thisData.commissionMoveNextYear"></td>
								<td class="pad3 center">本年度企业所得税税额合计</td>
								<td class="pad3 center" v-text="thisData.totalIncomeTax"></td>

								<td class="pad3 center">租赁费</td>
								<td class="pad3 center" v-text="thisData.premiumAccountData"></td>
							</tr>
							<tr>
								<td class="center">补贴收入</td>
								<td class="center" v-text="thisData.subsidiesIncome"></td>
								<td class="center">管理费用--培训费</td>
								<td class="pad3 center" v-text="thisData.trainAccountData"></td>
								<td class="pad3 center" v-text="thisData.trainAccountNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData.trainAccountAddBills"></td>
								<td class="pad3 center" v-text="thisData.trainAccountMoveNextYear"></td>
								<td class="pad3 center">本季度需缴纳税款</td>
								<td class="pad3 center" v-text="thisData.periodPayIncomeTax"></td>
								<td class="pad3 center">印花税</td>
								<td class="pad3 center" v-text="thisData.stampTaxAccountData"></td>
							</tr>
							<tr>
								<td class="center">营业外收入</td>
								<td class="center" v-text="thisData.businessOutIncome"></td>
								<td class="center">管理费用--个人所得税</td>
								<td class="pad3 center" v-text="thisData.incomeTaxAccountData"></td>
								<td class="pad3 center" v-text="thisData.incomeTaxNeedBills"></td>
								<td class="pad3 center" v-text="thisData.incomeTaxAddBills"></td>
								<td class="pad3 center" v-text="thisData.incomeTaxMoveNextYear"></td>
								<td class="pad3 center">汇算后需补缴纳企业所得税税款</td>
								<td class="pad3 center" v-text="thisData.liquidationPayIncomeTax"></td>
								<td class="pad3 center">车船税</td>
								<td class="pad3 center" v-text="thisData.vvtaxAccountData"></td>
							</tr>
							<tr>
								<td class="center">主营业务税金及附加</td>
								<td class="center" v-text="thisData.salesTax"></td>
								<td class="center">管理费用--商业保险</td>
								<td class="pad3 center" v-text="thisData.insuranceAccountData"></td>
								<td class="pad3 center" v-text="thisData.insuranceNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData.insuranceAddBills"></td>
								<td class="pad3 center" v-text="thisData.insuranceMoveNextYear"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">运费</td>
								<td class="center" v-text="thisData.transportationAccountData"></td>
							</tr>
							<tr>
								<td class="center">营业费用</td>
								<td class="center" v-text="thisData.operatingExpenses"></td>
								<td class="center">工资</td>
								<td class="pad3 center" v-text="thisData.wageAccountData"></td>
								<td class="pad3 center" v-text="thisData.wageNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData.wageAddBills"></td>
								<td class="pad3 center" v-text="thisData.wagesMoveNextYear"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">劳务费</td>
								<td class="center" v-text="thisData.serviceAccountData"></td>
							</tr>
							<tr>
								<td class="center">管理费用</td>
								<td class="center" v-text="thisData.administrativeExpenses"></td>
								<td class="center">福利费</td>
								<td class="pad3 center" v-text="thisData.welfareFeeAccountData"></td>
								<td class="pad3 center" v-text="thisData.welfareFeeNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData.welfareFeeAddBills"></td>
								<td class="pad3 center" v-text="thisData.welfareFeeMoveNextYear"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center">公积金</td>
								<td class="center" v-text="thisData.accumulationFundAccountData"></td>
							</tr>
							<tr>
								<td class="center">财务费用</td>
								<td class="center" v-text="thisData.financeExpenses"></td>
								<td class="center">营业外支出-罚款</td>
								<td class="pad3 center" v-text="thisData.forfeitAccountData"></td>
								<td class="pad3 center" v-text="thisData.forfeitNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData.forfeitAddBills"></td>
								<td class="pad3 center" v-text="thisData.forfeitMoveNextYear"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center">车辆费</td>
								<td class="center" v-text="thisData.vehicleAccountData"></td>
							</tr>
							<tr>
								<td class="center">营业外支出</td>
								<td class="center" v-text="thisData.businessOutExpenditure"></td>
								<td class="center">营业外支出-捐赠</td>
								<td class="pad3 center" v-text="thisData.contributionAccountData"></td>
								<td class="pad3 center" v-text="thisData.contributionNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData.contributionAddBills"></td>
								<td class="pad3 center" v-text="thisData.contributionMoveNextYear"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center">文化事业建设费</td>
								<td class="center" v-text="thisData.constructionFeeAccountData"></td>
							</tr>
							<tr>
								<td class="center">累计费用支出</td>
								<td class="center" v-text="thisData.totalExpenses"></td>
								<td class="center">其他需调整数据</td>
								<td class="pad3 center" v-text="thisData.otherAdjustmentData"></td>
								<td class="pad3 center" v-text="thisData.otherAdjustmentNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData.otherAdjustmentAddBills"></td>
								<td class="pad3 center" v-text="thisData.otherAdjustmentMoveNextYear"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center">劳保费</td>
								<td class="center" v-text="thisData.laborInsuranceAccountData"></td>
							</tr>
							<tr>
								<td class="center">本期利润总额</td>
								<td class="center" v-text="thisData.periodTotalProfit"></td>
								<td class="center">研发费用加计扣除</td>
								<td class="pad3 center" v-text="thisData.rdexpenseAccountData"></td>
								<td class="pad3 center" v-text="thisData.rdexpenseAccountNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData.rdexpenseAccountAddBills"></td>
								<td class="pad3 center" v-text="thisData.rdexpenseAccountMoveNextYear"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center">服装费</td>
								<td class="center" v-text="thisData.clothingFeeAccountData"></td>
							</tr>
							<tr>
								<td class="center">累计利润总额</td>
								<td class="center" v-text="thisData.totalProfit"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">城镇土地使用费税</td>
								<td class="center" v-text="thisData.landTaxAccountData"></td>
							</tr>
							<tr>
								<td class="center">账面利润总额（需核对的数据）</td>
								<td class="center" v-text="thisData.bookTotalProfit"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">房产税</td>
								<td class="center" v-text="thisData.buildingTaxesAccountData"></td>
							</tr>
							<tr>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">培训费</td>
								<td class="center" v-text="thisData.trainData"></td>
							</tr>
							<tr>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">信息费</td>
								<td class="center" v-text="thisData.informationAccountData"></td>
							</tr>
							<tr>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">会务费</td>
								<td class="center" v-text="thisData.conferenceAccountData"></td>
							</tr>
							<tr>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center">合计</td>
								<td class="center"></td>
								<td class="center" v-text="thisData.totalSubjectsNeedAdjust"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">社保</td>
								<td class="center" v-text="thisData.socialSecurityAccountData"></td>
							</tr>


						</table>

					</div>

				</div>
			</el-tab-pane>
			<el-tab-pane label="已审核" name="1" :disabled="!thisData1.customerName">
				<div class="titleBox">

					<div class="title">
						<p class="line1">汇 算 清 缴 查 询</p>
						<!-- <p class="line2">（一般纳税人适用）</p> -->
						<!-- <p class="line3">根据国家税收法律法规及增值税相关规定制定本表。纳税人不论有无销售额，均应按税务机关核定的纳税期限填写本表，并向当地税务机关申报。</p> -->
					</div>
					<div class="Infobox">
						<el-form :inline="true" :model="thisData1" class="demo-form-inline" size="small">

							<div class="line3">
								<el-form-item label="客户名称：" class="leftWidth">
									<div class="inlineInput">
										<el-input v-model="thisData1.customerName" disabled></el-input>
									</div>
								</el-form-item>
								<el-form-item label="所得税征收方式：">
									<div class="inlineInput">
										<el-input v-model="thisData1.incomeTaxCollectionMethod" disabled></el-input>
									</div>
								</el-form-item>
							</div>
							<div class="line3">
								<el-form-item label="会计负责人：" class="leftWidth">
									<div class="inlineInput">
										<el-input v-model="thisData1.accountant" disabled></el-input>
									</div>
								</el-form-item>
								<el-form-item label="月月汇算记录：">
									<div class="inlineInput">
										<el-input v-model="thisData1.calculatingYear" disabled></el-input>
									</div>
								</el-form-item>
							</div>
						</el-form>
					</div>

				</div>
				<div class="content">
					<!-- <el-button type="primary" icon="el-icon-success" size="small" @click='exportExcel'>一键导出</el-button> -->
					<div class="tableBox">
						<table border="1" width="100%" id="table1">
							<tr>
								<td colspan="2" class="center">利润表数据</td>
								<td colspan="5" class="center">调整项目</td>
								<td colspan="2" class="center">汇算情况</td>
								<td colspan="2" class="center">参考项</td>
							</tr>
							<tr>
								<td class="center">项目</td>
								<td class="center">金额</td>
								<td class="center">科目</td>
								<td class="center">账务数据</td>
								<td class="center">调整数据</td>
								<td class="center">可补充金额</td>
								<td class="center">转下一年度</td>
								<td class="center">项目</td>
								<td class="center">金额</td>
								<td class="center">科目</td>
								<td class="center">金额</td>
							</tr>
							<tr>
								<td class="center">本月主营业务收入</td>
								<td class="pad3 center" v-text="thisData1.monthRevenue"></td>
								<td class="center">成本--其他</td>
								<td class="pad3 center" v-text="thisData1.otherCostData"></td>
								<td class="pad3 center" v-text="thisData1.otherCostNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData1.otherCostAddBills"></td>
								<td class="pad3 center" v-text="thisData1.otherCostMoveNextYear"></td>
								<td class="pad3 center">汇算后利润总额</td>
								<td class="pad3 center" v-text="thisData1.liquidationProfit"></td>
								<td class="pad3 center">办公费</td>
								<td class="pad3 center" v-text="thisData1.administrativeAccountData"></td>
							</tr>
							<tr>
								<td class="center">本月主营业务成本</td>
								<td class="center" v-text="thisData1.monthOperatingCosts"></td>
								<td class="center">营业费用--其他</td>
								<td class="pad3 center" v-text="thisData1.operatingOtherData"></td>
								<td class="pad3 center" v-text="thisData1.operatingOtherNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData1.operatingOtherAddBills"></td>
								<td class="pad3 center" v-text="thisData1.operatingOtherMoveNextYear"></td>
								<td class="pad3 center">可弥补以前年度亏损额</td>
								<td class="pad3 center" v-text="thisData1.remedyLoss"></td>
								<td class="pad3 center">电话费</td>
								<td class="pad3 center" v-text="thisData1.telephoneAccountData"></td>
							</tr>
							<tr>
								<td class="center">主营业务收入</td>
								<td class="center" v-text="thisData1.totalRevenue"></td>
								<td class="center">营业费用--业务招待费</td>
								<td class="pad3 center" v-text="thisData1.operatingEntertainsAccountData"></td>
								<td class="pad3 center" v-text="thisData1.operatingEntertainsNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData1.operatingEntertainsAddBills"></td>
								<td class="pad3 center" v-text="thisData1.operatingEntertainsMoveNextYear"></td>
								<td class="pad3 center">实际弥补以前年度亏损额</td>
								<td class="pad3 center" v-text="thisData1.actuallyRemedyLoss"></td>
								<td class="pad3 center">交通费</td>
								<td class="pad3 center" v-text="thisData1.carAccountData"></td>
							</tr>
							<tr>
								<td class="center">主营业务成本</td>
								<td class="center" v-text="thisData1.totalCost"></td>
								<td class="center">管理费用--其他</td>
								<td class="pad3 center" v-text="thisData1.administrativeOtherData"></td>
								<td class="pad3 center" v-text="thisData1.administrativeOtherNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData1.administrativeOtherAddBills"></td>
								<td class="pad3 center" v-text="thisData1.administrativeOtherMoveNextYear"></td>
								<td class="pad3 center">汇算后企业所得税率</td>
								<td class="pad3 center" v-text="thisData1.liquidationIncomeTaxRate"></td>
								<td class="pad3 center">差旅费</td>
								<td class="pad3 center" v-text="thisData1.travelAccountData"></td>
							</tr>
							<tr>
								<td class="center">其他业务收入</td>
								<td class="center" v-text="thisData1.otherRevenue"></td>
								<td class="center">管理费用--业务招待费</td>
								<td class="pad3 center" v-text="thisData1.entertainsAccountData"></td>
								<td class="pad3 center" v-text="thisData1.entertainsNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData1.entertainsAddBills"></td>
								<td class="pad3 center" v-text="thisData1.entertainsMoveNextYear"></td>
								<td class="pad3 center">企业所得税率人工修改</td>
								<td class="pad3 center" v-text="thisData1.alterIncomeTaxRate"></td>
								<td class="pad3 center">折旧费</td>
								<td class="pad3 center" v-text="thisData1.depreciationAccountData"></td>
							</tr>
							<tr>
								<td class="center">其他业务支出</td>
								<td class="center" v-text="thisData1.otherExpenses"></td>
								<td class="center">管理费用--广告费</td>
								<td class="pad3 center" v-text="thisData1.advertisingAccountData"></td>
								<td class="pad3 center" v-text="thisData1.advertisingNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData1.advertisingAddBills"></td>
								<td class="pad3 center" v-text="thisData1.advertisingMoveNextYear"></td>
								<td class="pad3 center">预缴企业所得税</td>
								<td class="pad3 center" v-text="thisData1.prepayIncomeTax"></td>
								<td class="pad3 center">基金</td>
								<td class="pad3 center" v-text="thisData1.fundAccountData"></td>
							</tr>
							<tr>
								<td class="center">投资收益</td>
								<td class="center" v-text="thisData1.investmentIncome"></td>
								<td class="center">管理费用--佣金</td>
								<td class="pad3 center" v-text="thisData1.commissionAccountData"></td>
								<td class="pad3 center" v-text="thisData1.commissionNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData1.commissionAddBills"></td>
								<td class="pad3 center" v-text="thisData1.commissionMoveNextYear"></td>
								<td class="pad3 center">本年度企业所得税税额合计</td>
								<td class="pad3 center" v-text="thisData1.totalIncomeTax"></td>

								<td class="pad3 center">租赁费</td>
								<td class="pad3 center" v-text="thisData1.premiumAccountData"></td>
							</tr>
							<tr>
								<td class="center">补贴收入</td>
								<td class="center" v-text="thisData1.subsidiesIncome"></td>
								<td class="center">管理费用--培训费</td>
								<td class="pad3 center" v-text="thisData1.trainAccountData"></td>
								<td class="pad3 center" v-text="thisData1.trainAccountNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData1.trainAccountAddBills"></td>
								<td class="pad3 center" v-text="thisData1.trainAccountMoveNextYear"></td>
								<td class="pad3 center">本季度需缴纳税款</td>
								<td class="pad3 center" v-text="thisData1.periodPayIncomeTax"></td>
								<td class="pad3 center">印花税</td>
								<td class="pad3 center" v-text="thisData1.stampTaxAccountData"></td>
							</tr>
							<tr>
								<td class="center">营业外收入</td>
								<td class="center" v-text="thisData1.businessOutIncome"></td>
								<td class="center">管理费用--个人所得税</td>
								<td class="pad3 center" v-text="thisData1.incomeTaxAccountData"></td>
								<td class="pad3 center" v-text="thisData1.incomeTaxNeedBills"></td>
								<td class="pad3 center" v-text="thisData1.incomeTaxAddBills"></td>
								<td class="pad3 center" v-text="thisData1.incomeTaxMoveNextYear"></td>
								<td class="pad3 center">汇算后需补缴纳企业所得税税款</td>
								<td class="pad3 center" v-text="thisData1.liquidationPayIncomeTax"></td>
								<td class="pad3 center">车船税</td>
								<td class="pad3 center" v-text="thisData1.vvtaxAccountData"></td>
							</tr>
							<tr>
								<td class="center">主营业务税金及附加</td>
								<td class="center" v-text="thisData1.salesTax"></td>
								<td class="center">管理费用--商业保险</td>
								<td class="pad3 center" v-text="thisData1.insuranceAccountData"></td>
								<td class="pad3 center" v-text="thisData1.insuranceNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData1.insuranceAddBills"></td>
								<td class="pad3 center" v-text="thisData1.insuranceMoveNextYear"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">运费</td>
								<td class="center" v-text="thisData1.transportationAccountData"></td>
							</tr>
							<tr>
								<td class="center">营业费用</td>
								<td class="center" v-text="thisData1.operatingExpenses"></td>
								<td class="center">工资</td>
								<td class="pad3 center" v-text="thisData1.wageAccountData"></td>
								<td class="pad3 center" v-text="thisData1.wageNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData1.wageAddBills"></td>
								<td class="pad3 center" v-text="thisData1.wagesMoveNextYear"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">劳务费</td>
								<td class="center" v-text="thisData1.serviceAccountData"></td>
							</tr>
							<tr>
								<td class="center">管理费用</td>
								<td class="center" v-text="thisData1.administrativeExpenses"></td>
								<td class="center">福利费</td>
								<td class="pad3 center" v-text="thisData1.welfareFeeAccountData"></td>
								<td class="pad3 center" v-text="thisData1.welfareFeeNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData1.welfareFeeAddBills"></td>
								<td class="pad3 center" v-text="thisData1.welfareFeeMoveNextYear"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center">公积金</td>
								<td class="center" v-text="thisData1.accumulationFundAccountData"></td>
							</tr>
							<tr>
								<td class="center">财务费用</td>
								<td class="center" v-text="thisData1.financeExpenses"></td>
								<td class="center">营业外支出-罚款</td>
								<td class="pad3 center" v-text="thisData1.forfeitAccountData"></td>
								<td class="pad3 center" v-text="thisData1.forfeitNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData1.forfeitAddBills"></td>
								<td class="pad3 center" v-text="thisData1.forfeitMoveNextYear"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center">车辆费</td>
								<td class="center" v-text="thisData1.vehicleAccountData"></td>
							</tr>
							<tr>
								<td class="center">营业外支出</td>
								<td class="center" v-text="thisData1.businessOutExpenditure"></td>
								<td class="center">营业外支出-捐赠</td>
								<td class="pad3 center" v-text="thisData1.contributionAccountData"></td>
								<td class="pad3 center" v-text="thisData1.contributionNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData1.contributionAddBills"></td>
								<td class="pad3 center" v-text="thisData1.contributionMoveNextYear"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center">文化事业建设费</td>
								<td class="center" v-text="thisData1.constructionFeeAccountData"></td>
							</tr>
							<tr>
								<td class="center">累计费用支出</td>
								<td class="center" v-text="thisData1.totalExpenses"></td>
								<td class="center">其他需调整数据</td>
								<td class="pad3 center" v-text="thisData1.otherAdjustmentData"></td>
								<td class="pad3 center" v-text="thisData1.otherAdjustmentNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData1.otherAdjustmentAddBills"></td>
								<td class="pad3 center" v-text="thisData1.otherAdjustmentMoveNextYear"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center">劳保费</td>
								<td class="center" v-text="thisData1.laborInsuranceAccountData"></td>
							</tr>
							<tr>
								<td class="center">本期利润总额</td>
								<td class="center" v-text="thisData1.periodTotalProfit"></td>
								<td class="center">研发费用加计扣除</td>
								<td class="pad3 center" v-text="thisData1.rdexpenseAccountData"></td>
								<td class="pad3 center" v-text="thisData1.rdexpenseAccountNeedAdjust"></td>
								<td class="pad3 center" v-text="thisData1.rdexpenseAccountAddBills"></td>
								<td class="pad3 center" v-text="thisData1.rdexpenseAccountMoveNextYear"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center"></td>
								<td class="pad3 center">服装费</td>
								<td class="center" v-text="thisData1.clothingFeeAccountData"></td>
							</tr>
							<tr>
								<td class="center">累计利润总额</td>
								<td class="center" v-text="thisData1.totalProfit"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">城镇土地使用费税</td>
								<td class="center" v-text="thisData1.landTaxAccountData"></td>
							</tr>
							<tr>
								<td class="center">账面利润总额（需核对的数据）</td>
								<td class="center" v-text="thisData1.bookTotalProfit"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">房产税</td>
								<td class="center" v-text="thisData1.buildingTaxesAccountData"></td>
							</tr>
							<tr>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">培训费</td>
								<td class="center" v-text="thisData1.trainData"></td>
							</tr>
							<tr>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">信息费</td>
								<td class="center" v-text="thisData1.informationAccountData"></td>
							</tr>
							<tr>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">会务费</td>
								<td class="center" v-text="thisData1.conferenceAccountData"></td>
							</tr>
							<tr>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center">合计</td>
								<td class="center"></td>
								<td class="center" v-text="thisData1.totalSubjectsNeedAdjust"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="center"></td>
								<td class="pad3 center">社保</td>
								<td class="center" v-text="thisData1.socialSecurityAccountData"></td>
							</tr>


						</table>

					</div>

				</div>
			</el-tab-pane>

		</el-tabs>


	</div>
</template>

<script>
	// import FileSaver from 'file-saver'
	// import XLSX from 'xlsx'
	export default {
		name: "showReport",
		data() {
			return {

				accountPeriod: "",
				customerId: "",
				customerName: "",
				calculatingYear: '',
				uploadData: {
					customer: {
						customerId: '',
						customerName: '',
					}
				},
				thisData: {},
				thisData1: {},
				// activeName:'2'
			};
		},
		// watch: {
		// 	'$route'(to, from) {
		// 		// init data
		// 		if (to.name == 'showReport') {
		// 			if (this.$route.query.customerId && this.$route.query.accountPeriod) {

		// 				this.$nextTick(function() {
		// 					this.search('formSearch');
		// 				})

		// 			}

		// 		}

		// 	}
		// },
		computed: {},
		mounted() {

		},
		methods: {

			downLoad(formName) {},
			outputFile(formName) {},
			getNowMonth() {
				var date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				month = month < 10 ? "0" + month : month;
				this.searchList.nowDate = year.toString() + "-" + month.toString();
				this.accountPeriod = year.toString() + "-" + month.toString();
			},
			getNowFormatDate() {
				var date = new Date();
				var seperator1 = "-";
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				var strDate = date.getDate();
				if (month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if (strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				var currentdate = year + seperator1 + month + seperator1 + strDate;
				return currentdate;
			},
			// 获取表格数据
			getTableData(state) {
				let params = {
					// customerId:this.uploadData.customerId,
					// calculatingYear :this.uploadData.calculatingYear,

					customerId: this.customerId,
					customerName: this.customerName,
					calculatingYear: this.calculatingYear,
					state: state
				};
				let url = "/perTaxToolTwo/import/e9z/getReportLiquidation";

				this.axios
					.post(url, params)
					.then(res => {
						console.log("获取表格数据", res);
						this.loading = false;
						if (res.data.code == 200) {
							if (state == 1 && res.data.data) {
								this.thisData1 = res.data.data;
							} else if (state == 2 && res.data.data) {
								this.thisData = res.data.data;

							} else {
								this.thisData = {};
								this.thisData1 = {};
							}

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
			// 四舍五入
			fomatFloat(x, pos) {
				// console.log('xxx',x)
				if (x) {
					if (x.toString().indexOf(".") > -1) {
						var f = parseFloat(x);
						if (isNaN(f)) {
							return false;
						}
						f = Math.round(x * Math.pow(10, pos)) / Math.pow(10, pos); // pow 幂
						var s = f.toString();
						var rs = s.indexOf(".");
						if (rs < 0) {
							rs = s.length;
							s += ".";
						}
						while (s.length <= rs + pos) {
							s += "0";
						}
						return s;
					} else {
						return x;
					}
				} else {
					return x;
				}
			},
			// (表格一，一般/即征即收，本月/累计，当前字段名，event,参与计算)
			// (表格二，合计对应名称，当前字段名，event,参与计算)
			//('table10','se','1','jfsryzsrbnlj',$event,'bnlj','')
			unfocus(
				dataName,
				e
			) {
				if (e.keyCode === 13) {
					// this.send() // 发送文本
					console.log("tijiaole ");
					e.preventDefault(); // 阻止浏览器默认换行操作
				}
				var reg = /^(-)?\d{1,14}(\.\d{1,2})?$/;
				if (!reg.test(Number(e.target.innerText))) {
					this.$message({
						message: "请输入数字，整数最多14位，小数最多2位",
						type: "warning"
					});
					return;
				} else {
					this.$set(this.thisData, dataName, Number(e.target.innerText))
				}

				this.submitEdit();
			},

			// 提交修改
			submitEdit() {
				let param = this.thisData;
				let url = "/perTaxToolTwo/import/e9z/updateReportLiquidation";

				this.axios
					.post(url, param)
					.then(res => {
						console.log("修改数据", res);
						if (res.data.code == 200) {
							this.getTableData(1);
							this.getTableData(2);
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
			search(formName) {
				this.customerId = this.uploadData.customer.customerId;
				this.customerName = this.uploadData.customer.customerName;
				this.calculatingYear = this.uploadData.calculatingYear;
				//已审核数据
				this.getTableData(1);
				//审核中数据
				this.getTableData(2);
			},
			handleApprove() {
				let param = this.thisData;
				let url = "/perTaxToolTwo/import/e9z/approveReportLiquidation";

				this.axios
					.post(url, param)
					.then(res => {
						console.log("修改数据", res);
						if (res.data.code == 200) {
							this.getTableData(1);
							this.getTableData(2);
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
		watch: {

			'$route'(to, from) {
				// init data
				if (to.name == 'finalSettlement') {
					this.$nextTick(function() {
						if (this.$route.query.customerId && this.$route.query.accountPeriod) {

							this.$set(this.uploadData, 'customer', {
								customerName:this.$route.query.customerName,
								customerId:this.$route.query.customerId,
							});
							this.uploadData.calculatingYear = this.$route.query.accountPeriod;
							this.search('formSearch');

						}
					})
				}

			}
		},
		created() {
			this.$nextTick(function() {
				if (this.$route.query.customerId && this.$route.query.accountPeriod) {


					this.$set(this.uploadData, 'customer', {
						customerName:this.$route.query.customerName,
						customerId:this.$route.query.customerId,
					});
					// this.$set(this.uploadData.customer, 'customerName', this.$route.query.customerName);
					this.uploadData.calculatingYear = this.$route.query.accountPeriod;
					this.search('formSearch');
				}
			})



		},
		computed: {
			// 计算属性的 getter
			activeName: function() {
				// `this` 指向 vm 实例
				if (this.thisData.customerName) {
					return '2'
				} else if (this.thisData1.customerName) {
					return '1'
				} else {
					return '2'
				}
			}

		}

	};
</script>
<style>
	.line3 .input1 .el-input {
		width: 200px;
	}

	.line3 .input1 .el-input__inner {
		width: 200px;
	}

	.line3 .input2 .el-input {
		width: 100px;
	}

	.line3 .input3 .el-input {
		width: 150px;
	}

	.line3 .input4 .el-input {
		width: 150px;
	}

	.tianbiaoDate .el-date-editor {
		width: 200px;
	}

	.leftWidth .el-form-item__label {
		width: 120px;
		text-align: left;
	}

	.leftWidth2 .el-form-item__label {
		width: 260px;
		text-align: left;
	}

	.leftWidth3 .el-form-item__label {
		width: 130px;
		text-align: left;
	}
</style>

<style scoped lang="less">
	.showReport {
		padding: 20px;
	}

	.search {
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		background: #fff;
		padding: 20px 20px;
	}

	.title {
		font-size: 16px;
		margin-bottom: 15px;
	}

	div.search_contain {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
	}

	.labelTitle {
		color: #999;
		font-size: 14px;
	}

	.importButton {
		background: #43b3db;
		color: #fff;
		border-radius: 5px;
		cursor: pointer;
		padding: 7px 35px;
	}

	.searchButton {
		background: #ffb980;
		color: #fff;
		border-radius: 5px;
		cursor: pointer;
		padding: 7px 35px;
	}

	.row2,
	.row3,
	.searchButton,
	.importButton {
		margin-left: 20px;
	}

	.content {
		background: #fff;
		padding: 10px 20px; // margin-top: 20px;
	}

	.titleBox {
		background: #fff;
		margin-top: 10px;
	}

	.title .line1 {
		text-align: center;
		padding: 10px 0;
		font-weight: bold;
	}

	.title .line2 {
		text-align: center;
		font-weight: bold;
	}

	.title .line3 {
		text-align: center;
		padding: 5px 0;
		font-size: 0.12rem;
	}

	.Infobox .line1,
	.Infobox .line2,
	.Infobox .line3,
	.Infobox .line4 {
		height: 40px;
		padding: 0 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.Infobox4line1,
	.Infobox4line2 {
		height: 40px;
		padding: 0 20px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.inlineInput {
		display: flex;
		align-items: center;
	}

	td {
		//
		font-size: 0.14rem;
	}

	.center {
		text-align: center;
	}

	.pad3 {
		padding: 0.03rem 0;
	}

	.padL {
		padding-left: 0.4rem;
	}

	.shuli {
		margin: 0 auto;
		width: 16px;
		padding: 0 5px;
		line-height: 24px;
	}

	.signBox {
		display: flex;
		height: 1.4rem; // align-items: center;
	}

	.signBox .signtitle {
		width: 16px;
		height: calc(1.4rem - 20px);
		padding: 0 15px;
		//   line-height: 24px;
		/* margin: 0 10px; */
		border-left: 1px gray solid;
		border-bottom: 1px gray solid;
		border-right: 1px gray solid;
		font-size: 0.14rem;
		padding-top: 20px;
	}

	.signBox .contentBox {
		width: calc(50% - 16px);
		/* margin: 10px; */
		padding: 0px 5px;
		border-bottom: 1px gray solid;
		height: calc(1.4rem - 0px);
		//   padding-top: 15px;
	}

	.signBox .contentBox div {
		font-size: 0.14rem;
		margin-left: 20px;
	}

	.bottomline1 {
		margin-top: 10px;
		display: flex;
		justify-content: space-between;
	}

	.line4 .leftBox,
	.line4 .rightBox {
		display: flex;
		align-items: center;
	}

	.line4 .left {
		text-align: right;
		font-size: 0.14rem;
	}

	.line4 .right {
		font-size: 0.14rem;
		margin-left: 0.3rem;
	}

	/deep/ .el-tabs {
		background: #fff;
		margin-top: 20px;
	}
</style>
