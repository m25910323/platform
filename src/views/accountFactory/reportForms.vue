<template>
	<div class="reportForms">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>报表查看</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search'>
			<!-- <div class="title">报表查看</div> -->
			<div class='search_contain'>
				<el-form :inline="true" :model="searchList" class="demo-form-inline" size="mini" :rules="rulesSearch" ref='formSearch'>
					<el-form-item label="公司:" prop="value">
						<el-select v-model="searchList.value" @change="selectGet" placeholder="请选择" filterable>
							<el-option v-for="item in $store.state.cust" :key="item.customerId" :label="item.customerName" :value="item.customerId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="账期:" prop="nowDate">
						<el-date-picker v-model="searchList.nowDate" type="month" placeholder="选择账期" clearable value-format='yyyy-MM'>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="状态:">
						<el-select v-model="searchList.statusVaule" placeholder="请选择" size="mini">
							<el-option v-for="item in searchList.status" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item style="margin-bottom:0">
						<el-button type="primary" @click="search('formSearch')" style="margin-left:20px" size="mini">查看</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<!-- <div class="content">
			<el-table v-loading="loading" :data="tableList" style="width: 100%" stripe>
				
				
				<el-table-column align="center" prop="employeeCode" label="表名">
				</el-table-column>
				
				<el-table-column align="center" prop="sex" label="是否有数据下载">
					<template slot-scope="scope">
						<span v-if="scope.row.sex==0">女</span>
						<span v-if="scope.row.sex==1">男</span>
					</template>
				</el-table-column>
				
			</el-table>
		</div> -->
		<div class="content">
			<el-button type="primary" icon="el-icon-success" size="small" @click='exportTable' :disabled="!customerId || !accountPeriod || !statusVaule">一键导出</el-button>
			<!-- <el-button type="primary" icon="el-icon-success" size="small" @click='exportExcel' :disabled="!customerId || !accountPeriod || !statusVaule">一键导出</el-button> -->
			<div class="tableBox">
				<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
					<el-tab-pane :label="item.title" :name="item.name" v-for="(item,index) in tableTabs" :key="index">
						<el-table v-loading="loading" :data="item.tableData" style="width: 100%" stripe>
							<el-table-column align="center" type="expand" v-show='item.name==5 || item.name==6'>
								<template slot-scope="props">
									<el-form label-position="left" inline class="demo-table-expand">
										<!-- <el-form-item label="本期基本养老保险费">
											<span>{{ props.row.pensionInsurance }}</span>
										</el-form-item> -->

										<el-form-item v-if="item.name==1" label="是否残疾">
											<span v-if="props.row.isDiasbility==0">否</span>
											<span v-if="props.row.isDiasbility==1">是</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="是否烈属">
											<span v-if="props.row.isMartyr==0">否</span>
											<span v-if="props.row.isMartyr==1">是</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="是否孤老">
											<span v-if="props.row.isLonely==0">否</span>
											<span v-if="props.row.isLonely==1">是</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="残疾证号">
											<span>{{ props.row.diasbilityNum }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="烈属证号">
											<span>{{ props.row.martyrNum }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="个人投资额">
											<span>{{ props.row.individualInvestment }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="个人投资比例(%)">
											<span>{{ props.row.individualInvestmentRatio }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="备注">
											<span>{{ props.row.remark }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="是否境外人员">
											<span v-if="props.row.isOverseasPerson==0">否</span>
											<span v-if="props.row.isOverseasPerson==1">是</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="中文名">
											<span>{{ props.row.chineseName }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="涉税事由">
											<span>{{ props.row.taxRelatedCauses }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="出生国家(地区)">
											<span>{{ props.row.birthCountry }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="首次入境时间">
											<span v-if="props.row.firstEntryCountryDate">{{formatTime(props.row.firstEntryCountryDate,'Y-M-D')}}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="预计离境时间">
											<span v-if="props.row.estimateDepartureCountryDate">{{formatTime(props.row.estimateDepartureCountryDate,'Y-M-D')}}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="其他证照类型">
											<span>{{ props.row.otherCardType }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="其他证照号码">
											<span>{{ props.row.otherCardNum }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="户籍所在地（省）">
											<span>{{ props.row.censusRegisterProvince }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="户籍所在地（市）">
											<span>{{ props.row.censusRegisterCity }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="户籍所在地（区县）">
											<span>{{ props.row.censusRegisterCounty }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="户籍所在地（详细地址）">
											<span>{{ props.row.censusRegisterDetail }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="居住地址（省）">
											<span>{{ props.row.liveAddressProvince }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="居住地址（市）">
											<span>{{ props.row.liveAddressCity }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="居住地址（区县）">
											<span>{{ props.row.liveAddressCounty }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="居住地址（详细地址）">
											<span>{{ props.row.liveAddressDetail }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="联系地址（省）">
											<span>{{ props.row.contactAddressProvince }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="联系地址（市）">
											<span>{{ props.row.contactAddressCity }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="联系地址（区县）">
											<span>{{ props.row.contactAddressCounty }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="联系地址（详细地址）">
											<span>{{ props.row.contactAddressDetail }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="电子邮箱">
											<span>{{ props.row.email }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="学历">
											<span>{{ props.row.education }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="开户银行">
											<span>{{ props.row.bankDeposit }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="银行账号">
											<span>{{ props.row.bankAccount }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==1" label="职务">
											<span>{{ props.row.post }}</span>
										</el-form-item>

										<el-form-item v-if="item.name==2" label="累计子女教育">
											<span>{{ props.row.sumChildEducation }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==2" label="累计继续教育">
											<span>{{ props.row.sumContinuingEducation }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==2" label="累计住房贷款利息">
											<span>{{ props.row.sumHomeLoan }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==2" label="累计住房租金">
											<span>{{ props.row.sumHousingRent }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==2" label="累计赡养老人">
											<span>{{ props.row.sumElderly }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==2" label="企业(职业)年金">
											<span>{{ props.row.companyAnnuity }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==2" label="商业健康保险">
											<span>{{ props.row.healthInsurance }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==2" label="税延养老保险">
											<span>{{ props.row.pension }}</span>
										</el-form-item>
										<el-form-item v-if="item.name==2" label="其他">
											<span>{{ props.row.otherFee }}</span>
										</el-form-item>

										<!-- <el-table-column v-if="item.name==2||item.name==5" prop="healthInsurance" label="商业健康保险" width="110">
										</el-table-column>
										<el-table-column v-if="item.name==2||item.name==5" prop="pension" label="税延养老保险" width="110">
										</el-table-column> -->

									</el-form>
								</template>
							</el-table-column>
							<el-table-column align="center" label="序号" type="index" width="50">
							</el-table-column>
							<el-table-column align="center" prop="employeeCode" label="工号">
							</el-table-column>
							<el-table-column align="center" prop="employeeName" label="姓名">
							</el-table-column>
							<el-table-column align="center" prop="cardType" label="证照类型" width="100">
							</el-table-column>
							<el-table-column align="center" prop="cardNum" label="证照号码" width="180">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==1" prop="areaName" label="国籍(地区)" width="90">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==1" prop="sex" label="性别">
								<template slot-scope="scope">
									<span v-if="scope.row.sex==0">女</span>
									<span v-if="scope.row.sex==1">男</span>
								</template>
							</el-table-column>
							<el-table-column align="center" v-if="item.name==1" label="出生日期" width="100">
								<template slot-scope="scope">
									<span v-if="scope.row.birthDate">{{formatTime(scope.row.birthDate,'Y-M-D')}}</span>
								</template>
							</el-table-column>
							<el-table-column align="center" v-if="item.name==1" prop="employeeStatus" label="人员状态">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==1" prop="employeeType" label="任职受雇从业类型" width="140">

							</el-table-column>
							<el-table-column align="center" v-if="item.name==1" prop="phoneNum" label="手机号码">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==1" label="任职受雇从业日期" width="140">
								<template slot-scope="scope">
									<span v-if="scope.row.employeeDate">{{formatTime(scope.row.employeeDate,'Y-M-D')}}</span>
								</template>
							</el-table-column>
							<el-table-column align="center" v-if="item.name==1" label="离职日期" width="100">
								<template slot-scope="scope">
									<span v-if="scope.row.quitDate">{{formatTime(scope.row.quitDate,'Y-M-D')}}</span>
								</template>
							</el-table-column>

							<el-table-column align="center" v-if="item.name==5||item.name==6" prop="projectCode" label="所得项目">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==2||item.name==4||item.name==5" :prop="item.name==2?'monIncomeAmount':'incomeAmount'" label="本期收入">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==2||item.name==4||item.name==5" :prop="item.name==2?'monTaxFreeIncome':'taxFreeIncome'" label="本期免税收入" width="110">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==2" prop="monPensionInsurance" label="基本养老保险费" width="120">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==2" prop="monMedicalInsurance" label="基本医疗保险费" width="120">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==2" prop="monUnemploymentInsurance" label="失业保险费" width="100">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==2" prop="monHousingFund" label="住房公积金" width="100">
							</el-table-column>

							<el-table-column align="center" v-if="item.name==5" prop="healthInsurance" label="商业健康保险" width="110">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==5" prop="pension" label="税延养老保险" width="110">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==3" prop="incomeAmount" label="全年一次性奖金额">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==6||item.name==7" prop="incomeAmount" label="收入">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==3||item.name==6||item.name==7" prop="taxFreeIncome" label="免税收入">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==4||item.name==7" prop="otherFee" label="其他">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==3" prop="otherIncome" label="其他">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==6||item.name==7" prop="actualDonation" label="实际捐赠额">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==6||item.name==7" prop="donationType" label="捐赠方式">
							</el-table-column>
							<el-table-column align="center" v-if="item.name!=1 && item.name!=2" prop="deductedDonation" label="准予扣除的捐赠额" width="140">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==5" prop="otherFee" label="其他">
							</el-table-column>
							<el-table-column align="center" v-if="item.name!=1 && item.name!=2" prop="deductTax" label="减免税额">
							</el-table-column>
							<el-table-column align="center" v-if="item.name==4||item.name==5" prop="taxation" label="税款">
							</el-table-column>
							<el-table-column align="center" v-if="item.name!=1" prop="remark" label="备注">
							</el-table-column>
						</el-table>
						<el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next, jumper" :total="total">
						</el-pagination>
					</el-tab-pane>
				</el-tabs>
			</div>
		</div>
		
		<div class='content'>
			<span class="title">累计工资薪金汇算表【不包括劳务报酬、稿酬及其他非工资薪金】</span>
			<el-table :data="tableData2" style="width: 100%;margin-top: 20px;" stripe v-loading='loading2'>
				<el-table-column align="center" label="序号" type='index' width="50" :resizable="false"></el-table-column>
				<el-table-column align="center" label="姓名" prop="employeeName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="证件号码" prop="cardNum" :resizable="false"></el-table-column>
				<el-table-column align="center" label="任职受雇日期" prop="employmentDate" width="120" :resizable="false"></el-table-column>
				<el-table-column align="center" label="收入额" prop="incomeAmount" width="80" :resizable="false"></el-table-column>
				<el-table-column align="center" label="年终奖" prop="yearAwards" width="90" :resizable="false"></el-table-column>
				<el-table-column align="center" label="五险一金" prop="insurance" width="90" :resizable="false"></el-table-column>
				<el-table-column align="center" label="专项附加扣除" prop="specialDeduction" width="120" :resizable="false"></el-table-column>
				<el-table-column align="center" label="其他扣除项" prop="otherDeduction" width="110" :resizable="false"></el-table-column>
				<el-table-column align="center" label="应纳税所得额" prop="taxableIncome" width="120" :resizable="false"></el-table-column>
				<el-table-column align="center" label="应纳税额" prop="payableTax" width="90" :resizable="false"></el-table-column>
				<el-table-column align="center" label="已缴税额" prop="withholdTax" width="90" :resizable="false"></el-table-column>
				<el-table-column align="center" label="应补（退）税额" prop="taxation" width="130" :resizable="false"></el-table-column>
				<el-table-column align="center" label="操作" :resizable="false">
					<template slot-scope="scope">
						<el-button @click="handleClick2(scope.row)" type="text" size="small" v-show="scope.$index != tableData2.length - 1">
							查看详细</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background @current-change="((val)=>{handleCurrentChange2(val, '2')})" :current-page="currentPage2"
			 :page-size="pageSize2" layout="total, prev, pager, next, jumper" :total="total2">
			</el-pagination>
		</div>
		
		<el-dialog title="月度工资表详细" :visible.sync="dialogVisibleDetail" width="50%" style="margin-top:15vh">
			<!-- <el-tabs v-model="activeName" @tab-click="handleClick"> -->
			<el-tabs v-model="activeName1">
				<el-tab-pane :label="item.title" :name="item.name" v-for="(item,index) in tableTabs1" :key="index">
					<el-table :data="tableDataDetail" border style="width: 100%">
						<el-table-column align="center" label="月份" prop="accountPeriod"></el-table-column>
						<el-table-column align="center" v-if="item.name==1" label="本月收入" prop="monIncome"></el-table-column>
						<el-table-column align="center" v-if="item.name==2" label="累计收入" prop="sumIncome"></el-table-column>
						<el-table-column align="center" v-if="item.name==2" label="费用扣除标准" prop="sumDeductStandard"></el-table-column>
						<el-table-column align="center" label="五险一金" v-if="item.name==1||item.name==2" :prop="item.name==1?'monInsurance':'sumInsurance'"></el-table-column>
						<el-table-column align="center" label="专项附加扣除" v-if="item.name==1||item.name==2" :prop="item.name==1?'monAddDeduct':'sumAddDeduct'"></el-table-column>
						<el-table-column align="center" label="其他扣除项" v-if="item.name==1||item.name==2" :prop="item.name==1?'monOthDeduct':'sumOthDeduct'"></el-table-column>
						<el-table-column align="center" v-if="item.name==3" label="预交应纳税所得" prop="calTaxableIncome"></el-table-column>
						<el-table-column align="center" v-if="item.name==3" label="税率" prop="calRate"></el-table-column>
						<el-table-column align="center" v-if="item.name==3" label="速算扣除数" prop="calQuickDeduction"></el-table-column>
						<el-table-column align="center" v-if="item.name==3" label="应纳税额" prop="calPayableTax"></el-table-column>
						<el-table-column align="center" v-if="item.name==3" label="已缴税额" prop="calWithholdTax"></el-table-column>
						<el-table-column align="center" v-if="item.name==3" label="应补（退）税额" prop="calTaxation"></el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
		</el-dialog>
		
		<el-dialog title="导出" :visible.sync="dialogVisible" width="8rem">
			<el-table :data="tableList" style="width: 100%" stripe border v-loading='loading1'>
				<el-table-column align="center" label="表名" prop="table" :resizable="false"></el-table-column>
				
				<el-table-column align="center" label="是否有数据下载" :resizable="false">
					<template slot-scope="scope">
						
						<span v-if='scope.row.isData != 1'>无</span>
						<el-button type='text' size='mini' v-else @click='exportExcel1(scope.row)'>下载</el-button>
					</template>
				</el-table-column>
				
			</el-table>
			
		</el-dialog>

	</div>
</template>

<script>
	import axios from "axios";
	export default {
		name: "searchModule",
		data() {
			return {
				dialogVisible:false,
				tableList:[],
				searchList: {
					options: [{
							value: "选项1",
							label: "黄金糕"
						},
						{
							value: "选项2",
							label: "双皮奶"
						}
					],
					value: "",
					nowDate: "",
					status: [{
							value: "1",
							label: "已提交"
						},
						{
							value: "0",
							label: "未提交"
						}
					],
					statusVaule: "1"
				},
				accountPeriod: "",
				customerId: "",
				statusVaule: "1",
				activeName: "1",
				tableTabs: [{
						title: "人员信息",
						name: "1",
						tableData: []
					},
					{
						title: "正常工资薪资所得",
						name: "2",
						tableData: []
					},
					{
						title: "全年一次性奖金",
						name: "3",
						tableData: []
					},
					{
						title: "稿酬所得",
						name: "4",
						tableData: []
					},
					{
						title: "劳务报酬所得",
						name: "5",
						tableData: []
					},
					{
						title: "偶然所得",
						name: "6",
						tableData: []
					},
					{
						title: "非居民正常工资薪资所得",
						name: "7",
						tableData: []
					}
				],
				currentPage: 1,
				pageNum: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				loading1: false,
				rulesSearch: {
					value: [{
						required: true,
						message: "请选择客户",
						trigger: "change"
					}],
					nowDate: [{
						required: true,
						message: "请选择账期",
						trigger: "change"
					}]
				},
				
				tableData2:[],
				pageSize2:10,
				total2:0,
				currentPage2:1,
				dialogVisibleDetail:false,
				tableDataDetail:[],
				tableTabs1: [{
						title: "本月数据",
						name: "1"
					},
					{
						title: "累计情况",
						name: "2"
					},
					{
						title: "税款计算",
						name: "3"
					}
				], //月度工资表详细Tab
				activeName1: "1",
				loading2:false,
			};
		},
		created() {
			if(this.$route.query.customerId && this.$route.query.accountPeriod){
				this.searchList.nowDate = this.$route.query.accountPeriod;
				this.searchList.value = this.$route.query.customerId;
				this.searchList.statusVaule = "1";
				this.$nextTick(function(){
					this.search('formSearch');
				})
				
			}
		},
		watch: {
			'$route'(to, from) {
				// init data
				if (to.name == 'reportForms') {
					if(this.$route.query.customerId && this.$route.query.accountPeriod){
						this.searchList.nowDate = this.$route.query.accountPeriod;
						this.searchList.value = this.$route.query.customerId;
						this.searchList.statusVaule = "1";
						this.$nextTick(function(){
							this.search('formSearch');
						})
						
					}
					
				}
					
			}
		},
		methods: {
			/** 
			 * 时间戳转化为年 月 日 时 分 秒 
			 * number: 传入时间戳 
			 * format：返回格式，支持自定义，但参数必须与formateArr里保持一致 
			 */
			formatTime(number, format) {

				var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
				var returnArr = [];

				var date = new Date(number);
				returnArr.push(date.getFullYear());
				returnArr.push(this.formatNumber(date.getMonth() + 1));
				returnArr.push(this.formatNumber(date.getDate()));

				returnArr.push(this.formatNumber(date.getHours()));
				returnArr.push(this.formatNumber(date.getMinutes()));
				returnArr.push(this.formatNumber(date.getSeconds()));

				for(var i in returnArr) {
					format = format.replace(formateArr[i], returnArr[i]);
				}
				return format;
			},

			//数据转化  
			formatNumber(n) {
				n = n.toString()
				return n[1] ? n : '0' + n
			},
			getNowMonth() {
				var date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				month = month < 10 ? "0" + month : month;
				this.searchList.nowDate = year.toString() + "-" + month.toString();
				this.accountPeriod = year.toString() + "-" + month.toString();
			},
			// 获取表格数据
			getTableData(name) {
				console.log("tab.name", name);
				let type;
				if(name == "1") {
					type = 6;
				} else if(name == "2") {
					type = 5;
				} else if(name == "3") {
					type = 4;
				} else if(name == "4") {
					type = 1;
				} else if(name == "5") {
					type = 2;
				} else if(name == "6") {
					type = 3;
				} else if(name == "7") {
					type = 0;
				}
				this.loading = true;
				let params = {
					data: {
						customerId: this.customerId,
						accountPeriod: this.accountPeriod,
						submitStatus: this.statusVaule,
						type: type
					},
					page: this.pageNum,
					row: this.pageSize
				};
				let url;
				url = "/perTaxToolTwo/api/excel/queryPage.do";
				axios
					.post(url, params)
					.then(res => {
						console.log("获取表格数据", res);
						setTimeout(() => {
							this.loading = false;
						}, 800);
						if(res.data.code == 200) {
							this.tableTabs.forEach(item => {
								if(name == item.name) {
									item.tableData = res.data.data;
									this.total = res.data.count;
								}
							});
						} else {
							let type;
							if(res.data.code == 0) {
								type = "warning";
							} else if(res.data.code == 500) {
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
			
			handleCurrentChange2(val){
				this.currentPage2 = val;
				this.getTableData2()
			},
			getTableData2() {
				this.loading2 = true;
				let params = {
					row: this.pageSize2,
					page: this.currentPage2,
					data: {
						accountPeriod: this.accountPeriod,
						customerId: this.customerId,
						employeeName: "",
						submitStatus: this.statusVaule
					}
				};
				this.axios
					.post("/perTaxToolTwo/monAcct/queryPage", params)
					.then(res => {
						this.loading2 = false;
						if (res.data.code == 200) {
							this.tableData2 = res.data.data;
							this.total2 = res.data.count;
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
						this.loading2 = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			
			handleClick2(row) {
				console.log("获取详细数据", row);
				this.dialogVisibleDetail = true;
				this.getMonthDetail(row.cardNum,row.operateId);
			},
			
			// 获取月度工资表详细数据  /perTaxToolTwo/monDetail/queryList
			getMonthDetail(cardNum,operateId) {
				let params = {
					cardNum: cardNum,
					operateId: operateId
				};
				this.axios
					.post("/perTaxToolTwo/monDetail/queryList", params)
					.then(res => {
						if (res.data.code == 200) {
							this.tableDataDetail = res.data.data;
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
			
			handleClick(tab, event) {
				console.log("tab.name", this.accountPeriod);
				this.pageNum = 1;
				this.getTableData(tab.name);
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getTableData(this.activeName);
			},
			handleCurrentChange(val) {
				this.pageNum = val;
				this.getTableData(this.activeName);
			},
			search(formName) {
				this.$refs[formName].validate(valid => {
					if(valid) {
						this.accountPeriod = this.searchList.nowDate;
						this.customerId = this.searchList.value;
						this.statusVaule = this.searchList.statusVaule;
						this.pageNum = 1;
						this.currentPage2 = 1;
						this.getTableData(this.activeName);
						this.getTableData2();
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			clear() {
				this.searchList.statusVaule = "1";
				this.searchList.nowDate = "";
			},
			exportExcel() {
				window.location.href =
					"/perTaxToolTwo/api/excel/exportExcel.do?customerId=" +
					this.customerId +
					"&accountPeriod=" +
					this.accountPeriod +
					"&submitStatus=" +
					this.statusVaule;
			},
			exportExcel1(row) {
				window.location.href =
					"/perTaxToolTwo/api/excel/exportExcel.do?customerId=" +
					this.customerId +
					"&accountPeriod=" +
					this.accountPeriod +
					"&submitStatus=" +
					this.statusVaule + 
					"&table=" +
					row.table
					;
			},
			exportTable(){
				this.dialogVisible = true;
				this.loading1 = true;
				let params = {
					customerId: this.customerId,
					accountPeriod: this.accountPeriod,
					submitStatus: this.statusVaule,
				};
				let url;
				url = "/perTaxToolTwo/api/excel/queryReportList.do";
				axios
					.post(url, params)
					.then(res => {
						console.log("获取表格数据", res);
						this.loading1 = false;
						if(res.data.code == 200) {
							this.tableList = res.data.data;
						} else {
							this.loading1 = false;
							let type;
							if(res.data.code == 0) {
								type = "warning";
							} else if(res.data.code == 500) {
								type = "error";
							}
							this.$message({
								message: res.data.msg,
								type: type
							});
						}
					})
					.catch(err => {
						this.loading1 = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			}
		}
	};
</script>

<style scoped lang="less">
	.reportForms {
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		.el-breadcrumb {
			height: 30px;
			line-height: 29px;
			padding-left: 20px;
			background-color: #fff;
			border-top: 1px solid #f2f6fc;
			box-sizing: border-box;
		}
		/deep/ .el-pagination {
			text-align: right;
			margin-top: 10px;
		}
		/deep/ .el-table th {
			background-color: #ebf6fb;
			height: 40px;
		}
		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #ebf6fb;
		}
		/deep/ .demo-table-expand {
			font-size: 0;
		}
		/deep/ .demo-table-expand label {
			color: #99a9bf;
			// padding-left: 120px;
		}
		/deep/ .demo-table-expand .el-form-item {
			margin-right: 0;
			margin-bottom: 0;
			width: 50%;
		}
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
		// font-size: 16px;
	}
	
	/deep/ .el-tabs__header {
		margin: 0px;
	}
	
	// /deep/ .el-table__body tr:hover{
	// 	background-color: #efe9e5;
	// }
	/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #efe9e5;
	}
	
	/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
		border-bottom-color: #fff;
		background: #ebf6fb;
	}
	
	.search {
		background: #fff;
		padding: 20px 20px;
		margin: 20px;
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
		padding: 20px 20px;
		margin: 20px;
	}
	
	.tableBox {
		margin-top: 15px;
	}
</style>