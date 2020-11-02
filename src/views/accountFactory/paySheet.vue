<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>工资表导入</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div class='info'>
				<span>工资表上传 单企业单月导入</span>
				<a href="月度工资表模板.xlsx" download="月度工资表模板">点击下载工资表模板</a>
			</div>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" :rules="rulesf" ref='formName'>
					<el-form-item label="账期" prop="accountPeriod">
						<el-date-picker v-model="uploadData.accountPeriod" type="month" format="yyyy-MM " value-format="yyyy-MM"
						 placeholder="选择账期" clearable>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="公司" prop="customerId">

						<el-select v-model="uploadData.customerId" placeholder="请选择公司名称" clearable filterable>
							<el-option v-for="(item,index) in periodCustList" :label="item.customerName" :value='item.customerId'></el-option>
							<!-- <el-option v-for="(item,index) in $store.state.cust" :key="index" :label="item.customerName" :value='item.customerId'></el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="证件号导入">
						<el-switch v-model="switchvalue"></el-switch>
					</el-form-item>
					<el-button type="primary" @click='selectExcel("formName")' size="mini">选择Excel</el-button>
					<el-button type="primary" @click='continueExcel("formName")' size="mini">沿用上月</el-button>
				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<h5>月度录入表</h5>
			<div>
				<el-form :inline="true" :model="searchData" class="demo-form-inline" size="mini" :rules="ruless" ref='formName1'>
					<el-form-item label="账期" prop="accountPeriod">
						<el-date-picker v-model="searchData.accountPeriod" type="month" format="yyyy-MM " value-format="yyyy-MM"
						 placeholder="选择月" clearable>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="公司" prop="customerId">
						<!-- <el-autocomplete class="inline-input" v-model="customerName" :fetch-suggestions="querySearch"
							 placeholder="请输入客户名称" @select="handleSelect"></el-autocomplete> -->
						<el-select v-model="searchData.customerId" placeholder="请选择公司名称" clearable filterable>
							<el-option v-for="(item,index) in periodCustList" :label="item.customerName" :value='item.customerId'></el-option>
							<!-- <el-option v-for="(item,index) in $store.state.cust" :key="index" :label="item.customerName" :value='item.customerId'></el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="状态" prop="statusVaule">
						<el-select v-model="searchData.statusVaule" placeholder="请选择状态" clearable>
							<el-option label="已提交" value="1"></el-option>
							<el-option label="未提交" value="0"></el-option>
						</el-select>
					</el-form-item>
					<el-button type="primary" @click='search("formName1")' size="mini">搜索</el-button>
					<el-button type="primary" @click='addUser' v-if="calcFlag" size="mini">新增员工</el-button>
					<!-- <el-button type="primary" @click='selectExcel'>重置</el-button> -->
				</el-form>
			</div>
			<el-button type="primary" size='mini' @click='calc' v-if="calcFlag">计算</el-button>
			<el-button class='muldel' type="danger" size='mini' icon="el-icon-delete" :disabled="canDel" @click='showDelDialog'
			 v-if="tableData1.length>0 && calcFlag">批量删除</el-button>
			<el-table class="table1" :data="tableData1" stripe style="width: 100%;margin-top: 20px;" @selection-change="handleSelectionChange">
				<el-table-column type="expand">
					<template slot-scope="props">
						<el-form label-position="left" inline class="demo-table-expand" size="small">
							<el-form-item label="基本养老保险费">
								<span>{{ props.row.pensionInsurance }}</span>
							</el-form-item>
							<el-form-item label="基本医疗保险费">
								<span>{{ props.row.medicalInsurance }}</span>
							</el-form-item>
							<el-form-item label="失业保险费">
								<span>{{ props.row.unemploymentInsurance }}</span>
							</el-form-item>
							<el-form-item label="住房公积金">
								<span>{{ props.row.housingFund }}</span>
							</el-form-item>
							<el-form-item label="本月计子女教育">
								<span>{{ props.row.childEducation }}</span>
							</el-form-item>
							<el-form-item label="本月继续教育">
								<span>{{ props.row.continuingEducation }}</span>
							</el-form-item>
							<el-form-item label="本月住房贷款利息">
								<span>{{ props.row.homeLoan }}</span>
							</el-form-item>
							<el-form-item label="本月住房租金">
								<span>{{ props.row.housingRent }}</span>
							</el-form-item>
							<el-form-item label="本月赡养老人">
								<span>{{ props.row.elderly }}</span>
							</el-form-item>
							<el-form-item label="企业(职业)年金">
								<span>{{ props.row.companyAnnuity }}</span>
							</el-form-item>
							<el-form-item label="商业健康保险">
								<span>{{ props.row.healthInsurance }}</span>
							</el-form-item>
							<el-form-item label="税延养老保险">
								<span>{{ props.row.pension }}</span>
							</el-form-item>
							<el-form-item label="准予扣除的捐赠额">
								<span>{{ props.row.deductedDonation }}</span>
							</el-form-item>


							<el-form-item label="累计子女教育减征额">
								<span>{{ props.row.childEducationDeductionDecrease }}</span>

							</el-form-item>
							<el-form-item label="累计继续教育减征额">
								<span>{{ props.row.continuingEducationDecrease }}</span>

							</el-form-item>
							<el-form-item label="累计住房贷款利息减征额">
								<span>{{ props.row.homeLoanDecrease }}</span>

							</el-form-item>
							<el-form-item label="累计住房租金减征额">
								<span>{{ props.row.housingRentDecrease }}</span>
							</el-form-item>
							<el-form-item label="累计赡养老人减征额">
								<span>{{ props.row.elderlyDecrease }}</span>
							</el-form-item>
							<el-form-item label="累计商业健康保险减征额">
								<span>{{ props.row.healthInsuranceDecrease }}</span>
							</el-form-item>


							<el-form-item label="是否残疾烈属孤老">
								<span>{{ props.row.isSolitary }}</span>
							</el-form-item>
							<el-form-item label="允许扣除的税费">
								<span>{{ props.row.deductedTaxes }}</span>
							</el-form-item>
							<el-form-item label="其他税前扣除项目">
								<span>{{ props.row.preTaxDeduction }}</span>
							</el-form-item>
							<el-form-item label="年终奖">
								<span>{{ props.row.yearAwards }}</span>
							</el-form-item>
							<el-form-item label="减免税额">
								<span>{{ props.row.deductTax }}</span>
							</el-form-item>
						</el-form>
					</template>
				</el-table-column>
				<el-table-column align="center" type="selection" width="55"></el-table-column>
				<el-table-column align="center" label="序号" type='index' width="50"></el-table-column>
				<el-table-column align="center" prop="employeeName" label="姓名" width="120"></el-table-column>
				<el-table-column align="center" prop="cardType" label="证件类型"></el-table-column>
				<el-table-column align="center" prop="cardNum" label="证件号码"></el-table-column>
				<el-table-column align="center" prop="employmentDate" label="任职受雇日期"></el-table-column>
				<el-table-column align="center" prop="projectCode" label="所得项目名称"></el-table-column>
				<el-table-column align="center" prop="incomeAmount" label="收入额"></el-table-column>
				<el-table-column align="center" prop="reportedIncome" label="已申报收入"></el-table-column>
				<el-table-column align="center" prop="taxFreeIncome" label="免税所得"></el-table-column>
				<el-table-column align="center" fixed="right" label="操作" width="100">
					<template slot-scope="scope">
						<el-button type="text" size="small" @click='edit(scope.row)'>
							编辑</el-button>
						<!-- <el-button type="text" size="small" @click='del(scope.row)'>删除</el-button> -->
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background @current-change="((val)=>{handleCurrentChange(val, '1')})" :current-page="currentPage1"
			 :page-size="pageSize1" layout="total, prev, pager, next, jumper" :total="total1">
			</el-pagination>
		</div>

		<div class='main_contain bottomTable'>
			<span class="title">累计工资薪金汇算表【不包括劳务报酬、稿酬及其他非工资薪金，如需查看请点击</span><span @click="goReportForms" class="title reportFrom">报表查看</span><span
			 class="title"> 】</span>
			<div>
				<el-button type="primary" @click='submitAll' v-if="calcFlag" size="mini">提交</el-button>
				<el-button type="primary" @click='exportExcel' v-if="tableData2.length != 0" size="mini">导出</el-button>
			</div>
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
						<el-button @click="handleClick(scope.row)" type="text" size="small" v-show="scope.$index != tableData2.length - 1">
							查看详细</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background @current-change="((val)=>{handleCurrentChange(val, '2')})" :current-page="currentPage2"
			 :page-size="pageSize2" layout="total, prev, pager, next, jumper" :total="total2">
			</el-pagination>
		</div>

		<div v-if="tableData3.length>0" class='main_contain bottomTable' style="margin-bottom:20px">
			<span class="title">年终奖工资表</span>
			<el-table :data="tableData3" style="width: 100%" stripe border>
				<el-table-column align="center" label="序号" type='index' width="50" :resizable="false"></el-table-column>
				<el-table-column align="center" label="姓名" prop="employeeName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="证件号码" prop="cardNum" :resizable="false"></el-table-column>
				<el-table-column align="center" label="任职受雇日期" prop="employmentDate" :resizable="false"></el-table-column>
				<el-table-column align="center" label="收入额" prop="incomeAmount" :resizable="false"></el-table-column>
				<el-table-column align="center" label="应纳税所得额" prop="taxableIncome" :resizable="false"></el-table-column>
				<el-table-column align="center" label="应纳税额" prop="preWithholdTax" :resizable="false"></el-table-column>
				<el-table-column align="center" label="已缴税额" prop="prepaidTax" :resizable="false"></el-table-column>
				<el-table-column align="center" label="应补（退）税额" prop="taxation" :resizable="false"></el-table-column>
			</el-table>
			<el-pagination background @current-change="((val)=>{handleCurrentChange(val, '3')})" :current-page="currentPage3"
			 :page-size="pageSize3" layout="total, prev, pager, next, jumper" :total="total3">
			</el-pagination>
		</div>
		<div v-if="tableData3.length==0" class="tips">
			<p>【提示】因本次选择年终奖筹划中的推荐方案（实际也是合并方案的情况）/合并方案，故此表包含年终奖个税</p>
		</div>

		<el-dialog :title="addFlag?'新增':'编辑'" :visible.sync="dialogVisibleAdd" width="90%" class="dialogAdd">
			<el-form :inline="true" :ref="item" :model="item" class="demo-form-inline" label-width="180px" :rules='rules' size="small">
				<el-form-item label="姓名" prop="employeeName">
					<el-input v-model="item.employeeName" placeholder="请输入姓名"></el-input>
				</el-form-item>
				<el-form-item label="证件类型" prop="cardType">
					<el-select v-model="item.cardType" placeholder="请选择">
						<el-option label="居民身份证" value="居民身份证"></el-option>
						<el-option label="中国护照" value="中国护照"></el-option>
						<el-option label="港澳居民来往内地通行证" value="港澳居民来往内地通行证"></el-option>
						<el-option label="港澳居民居住证" value="港澳居民居住证"></el-option>
						<el-option label="台湾居民来往大陆通行证" value="台湾居民来往大陆通行证"></el-option>
						<el-option label="台湾居民居住证" value="台湾居民居住证"></el-option>
						<el-option label="外国护照" value="外国护照"></el-option>
						<el-option label="外国人永久居留身份证" value="外国人永久居留身份证"></el-option>
						<el-option label="外国人工作许可证（A类）" value="外国人工作许可证（A类）"></el-option>
						<el-option label="外国人工作许可证（B类）" value="外国人工作许可证（B类）"></el-option>
						<el-option label="外国人工作许可证（C类）" value="外国人工作许可证（C类）"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="证件号码" prop="cardNum">
					<el-input v-model="item.cardNum" placeholder="请输入证件号码"></el-input>
				</el-form-item>
				
				<el-form-item label="任职受雇日期" prop="employmentDate">
					<el-date-picker v-model="item.employmentDate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择任职受雇日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="所得项目名称" prop="projectCode">
					<el-select v-model="item.projectCode" placeholder="请选择">
						<el-option label="正常工资薪金" value="正常工资薪金"></el-option>
						<el-option label="一般劳务报酬所得" value="一般劳务报酬所得"></el-option>
						<el-option label="稿酬所得" value="稿酬所得"></el-option>
					</el-select>
					<!-- <el-input v-model="item.projectCode" placeholder="请输入"></el-input> -->
				</el-form-item>
				<el-form-item label="收入额" prop="incomeAmount">
					<el-input v-model="item.incomeAmount" placeholder="请输入收入额"></el-input>
				</el-form-item>
				<el-form-item label="已申报收入" prop="reportedIncome">
					<el-input v-model="item.reportedIncome" placeholder="请输入已申报收入"></el-input>
				</el-form-item>
				<el-form-item label="免税所得" prop="taxFreeIncome">
					<el-input v-model="item.taxFreeIncome" placeholder="请输入免税所得"></el-input>
				</el-form-item>
				<el-form-item label="基本养老保险费" prop="pensionInsurance">
					<el-input v-model="item.pensionInsurance" placeholder="请输入基本养老保险费"></el-input>
				</el-form-item>
				<el-form-item label="基本医疗保险费" prop="medicalInsurance">
					<el-input v-model="item.medicalInsurance" placeholder="请输入基本医疗保险费"></el-input>
				</el-form-item>
				<el-form-item label="失业保险费" prop="unemploymentInsurance">
					<el-input v-model="item.unemploymentInsurance" placeholder="请输入失业保险费"></el-input>
				</el-form-item>
				<el-form-item label="住房公积金" prop="housingFund">
					<el-input v-model="item.housingFund" placeholder="请输入住房公积金"></el-input>
				</el-form-item>
				<el-form-item label="本月计子女教育" prop="childEducation">
					<el-input v-model="item.childEducation" placeholder="请输入本月计子女教育"></el-input>
				</el-form-item>
				<el-form-item label="本月继续教育" prop="continuingEducation">
					<el-input v-model="item.continuingEducation" placeholder="请输入本月继续教育"></el-input>
				</el-form-item>
				<el-form-item label="本月住房贷款利息" prop="homeLoan">
					<el-input v-model="item.homeLoan" placeholder="请输入本月住房贷款利息"></el-input>
				</el-form-item>
				<el-form-item label="本月住房租金" prop="housingRent">
					<el-input v-model="item.housingRent" placeholder="请输入本月住房租金"></el-input>
				</el-form-item>
				<el-form-item label="本月赡养老人" prop="elderly">
					<el-input v-model="item.elderly" placeholder="请输入赡养老人"></el-input>
				</el-form-item>
				<el-form-item label="企业(职业)年金" prop="companyAnnuity">
					<el-input v-model="item.companyAnnuity" placeholder="请输入企业(职业)年金"></el-input>
				</el-form-item>
				<el-form-item label="商业健康保险" prop="healthInsurance">
					<el-input v-model="item.healthInsurance" placeholder="请输入商业健康保险"></el-input>
				</el-form-item>
				<el-form-item label="税延养老保险" prop="pension">
					<el-input v-model="item.pension" placeholder="请输入税延养老保险"></el-input>
				</el-form-item>
				<el-form-item label="准予扣除的捐赠额" prop="deductedDonation">
					<el-input v-model="item.deductedDonation" placeholder="请输入准予扣除的捐赠额"></el-input>
				</el-form-item>

				<el-form-item label="累计子女教育减征额" prop="childEducationDeductionDecrease">
					<el-input v-model="item.childEducationDeductionDecrease" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计继续教育减征额" prop="continuingEducationDecrease">
					<el-input v-model="item.continuingEducationDecrease" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计住房贷款利息减征额" prop="homeLoanDecrease">
					<el-input v-model="item.homeLoanDecrease" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计住房租金减征额" prop="housingRentDecrease">
					<el-input v-model="item.housingRentDecrease" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计赡养老人减征额" prop="elderlyDecrease">
					<el-input v-model="item.elderlyDecrease" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计商业健康保险减征额" prop="healthInsuranceDecrease">
					<el-input v-model="item.healthInsuranceDecrease" placeholder="请输入"></el-input>
				</el-form-item>



				<el-form-item label="是否残疾烈属孤老" prop="isSolitary">
					<el-select v-model="item.isSolitary" placeholder="请选择" clearable>
						<el-option label="是" value="1"></el-option>
						<el-option label="否" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="允许扣除的税费" prop="deductedTaxes">
					<el-input v-model="item.deductedTaxes" placeholder="请输入允许扣除的税费"></el-input>
				</el-form-item>
				<el-form-item label="其他税前扣除项目" prop="preTaxDeduction">
					<el-input v-model="item.preTaxDeduction" placeholder="请输入其他税前扣除项目"></el-input>
				</el-form-item>
				<el-form-item label="财产原值" prop="propertyOrigin" v-if="addFlag">
					<el-input v-model="item.propertyOrigin" placeholder="请输入财产原值"></el-input>
				</el-form-item>
				<el-form-item label="是否雇员" prop="isEmployment" v-if="addFlag">
					<el-select v-model="item.isEmployment" placeholder="请选择" clearable>
						<el-option label="是" value="1"></el-option>
						<el-option label="否" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="年终奖" prop="yearAwards">
					<el-input v-model="item.yearAwards" placeholder="请输入年终奖"></el-input>
				</el-form-item>
				<el-form-item label="减免税额" prop="deductTax">
					<el-input v-model="item.deductTax" placeholder="请输入减免税额"></el-input>
				</el-form-item>
				<el-form-item label="是否为研发人员" prop="rdState">
					<el-select v-model="item.rdState" placeholder="请选择">
						<el-option v-for='items in rdStateList' :label="items.label" :value="items.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="研发项目名称" prop="rdProjName">
					<el-input v-model="item.rdProjName" placeholder="请输入研发项目名称"></el-input>
				</el-form-item>
				<el-form-item label="外籍员工是否按居民身份计算公式" prop="residenceState">
					<el-select v-model="item.residenceState" placeholder="请选择">
						<el-option v-for='items in residenceStateList' :label="items.label" :value="items.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="国家或地区代码" prop="areaCode" v-if="addFlag">
					<el-select v-model="item.areaCode" placeholder="请选择" clearable>
						<el-option label="中国" value="1"></el-option>
						<el-option label="外国" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="电子邮件" prop="email" v-if="addFlag">
					<el-input v-model="item.email" placeholder="请输入电子邮件"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="phone" v-if="addFlag">
					<el-input v-model="item.phone" placeholder="请输入电话"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisibleAdd = false">取 消</el-button>
				<el-button type="primary" v-if="addFlag" @click="continueAdd(item)">继续新增员工基础信息</el-button>
				<el-button type="primary" v-if="addFlag" @click="save(item)">保存员工工资信息</el-button>
				<el-button type="primary" v-if="!addFlag" @click="save(item)">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog title="新增员工基础信息" :visible.sync="dialogVisibleBasicInfo" width="90%" class="dialogAdd">
			<el-form :inline="true" :ref="itemBasicInfo" :model="itemBasicInfo" class="demo-form-inline" label-width="180px"
			 size="small" :rules="rulesBasic">
				<el-form-item label="姓名">
					<el-input v-model="itemBasicInfo.employeeName" placeholder="请输入姓名"></el-input>
				</el-form-item>
				<el-form-item label="证件类型">
					<el-select v-model="itemBasicInfo.cardType" placeholder="请选择" clearable>
						<el-option label="居民身份证" value="居民身份证"></el-option>
						<el-option label="中国护照" value="中国护照"></el-option>
						<el-option label="港澳居民来往内地通行证" value="港澳居民来往内地通行证"></el-option>
						<el-option label="港澳居民居住证" value="港澳居民居住证"></el-option>
						<el-option label="台湾居民来往大陆通行证" value="台湾居民来往大陆通行证"></el-option>
						<el-option label="台湾居民居住证" value="台湾居民居住证"></el-option>
						<el-option label="外国护照" value="外国护照"></el-option>
						<el-option label="外国人永久居留身份证" value="外国人永久居留身份证"></el-option>
						<el-option label="外国人工作许可证（A类）" value="外国人工作许可证（A类）"></el-option>
						<el-option label="外国人工作许可证（B类）" value="外国人工作许可证（B类）"></el-option>
						<el-option label="外国人工作许可证（C类）" value="外国人工作许可证（C类）"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="证件号码">
					<el-input v-model="itemBasicInfo.cardNum" placeholder="请输入证件号码"></el-input>
				</el-form-item>
				<el-form-item label="国籍(地区)">
					<el-input v-model="itemBasicInfo.areaName" placeholder="请输入国籍(地区)"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-select v-model="itemBasicInfo.sex" placeholder="请选择" clearable>
						<el-option label="男" value="1"></el-option>
						<el-option label="女" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="出生日期">
					<el-date-picker v-model="itemBasicInfo.birthDate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择出生日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="人员状态">
					<el-input v-model="itemBasicInfo.employeeStatus" placeholder="请输入人员状态"></el-input>
				</el-form-item>
				<el-form-item label="任职受雇从业类型">
					<el-input v-model="itemBasicInfo.employeeType" placeholder="请输入任职受雇从业类型"></el-input>
				</el-form-item>
				<el-form-item label="手机号码">
					<el-input v-model="itemBasicInfo.phoneNum" placeholder="请输入手机号码"></el-input>
				</el-form-item>
				<el-form-item label="任职受雇从业日期">
					<el-date-picker v-model="itemBasicInfo.employeeDate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择任职受雇从业日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="离职日期">
					<el-date-picker v-model="itemBasicInfo.quitDate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择离职日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="是否残疾">
					<el-select v-model="itemBasicInfo.isDiasbility" placeholder="请选择" clearable>
						<el-option label="是" value="1"></el-option>
						<el-option label="否" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否烈属">
					<el-select v-model="itemBasicInfo.isMartyr" placeholder="请选择" clearable>
						<el-option label="是" value="1"></el-option>
						<el-option label="否" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否孤老">
					<el-select v-model="itemBasicInfo.isLonely" placeholder="请选择" clearable>
						<el-option label="是" value="1"></el-option>
						<el-option label="否" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="残疾证号">
					<el-input v-model="itemBasicInfo.diasbilityNum" placeholder="请输入残疾证号"></el-input>
				</el-form-item>
				<el-form-item label="烈属证号">
					<el-input v-model="itemBasicInfo.martyrNum" placeholder="请输入烈属证号"></el-input>
				</el-form-item>
				<el-form-item label="个人投资额">
					<el-input v-model="itemBasicInfo.individualInvestment" placeholder="请输入个人投资额"></el-input>
				</el-form-item>
				<el-form-item label="个人投资比例(%)">
					<el-input v-model="itemBasicInfo.individualInvestmentRatio" placeholder="请输入个人投资比例(%)"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="itemBasicInfo.remark" placeholder="请输入备注"></el-input>
				</el-form-item>
				<el-form-item label="是否境外人员">
					<el-select v-model="itemBasicInfo.isOverseasPerson" placeholder="请选择" clearable>
						<el-option label="是" value="1"></el-option>
						<el-option label="否" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="中文名">
					<el-input v-model="itemBasicInfo.chineseName" placeholder="请输入中文名"></el-input>
				</el-form-item>
				<el-form-item label="涉税事由">
					<el-input v-model="itemBasicInfo.taxRelatedCauses" placeholder="请输入涉税事由"></el-input>
				</el-form-item>
				<el-form-item label="出生国家(地区)">
					<el-input v-model="itemBasicInfo.birthCountry" placeholder="请输入出生国家(地区)"></el-input>
				</el-form-item>
				<el-form-item label="首次入境时间">
					<el-date-picker v-model="itemBasicInfo.firstEntryCountryDate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择首次入境时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="预计离境时间">
					<el-date-picker v-model="itemBasicInfo.estimateDepartureCountryDate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择预计离境时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="其他证照类型">
					<el-input v-model="itemBasicInfo.otherCardType" placeholder="请输入其他证照类型"></el-input>
				</el-form-item>
				<el-form-item label="其他证照号码">
					<el-input v-model="itemBasicInfo.otherCardNum" placeholder="请输入其他证照号码"></el-input>
				</el-form-item>
				<el-form-item label="户籍所在地（省）">
					<el-input v-model="itemBasicInfo.censusRegisterProvince" placeholder="请输入户籍所在地（省）"></el-input>
				</el-form-item>
				<el-form-item label="户籍所在地（市）">
					<el-input v-model="itemBasicInfo.censusRegisterCity" placeholder="请输入户籍所在地（市）"></el-input>
				</el-form-item>
				<el-form-item label="户籍所在地（区县）">
					<el-input v-model="itemBasicInfo.censusRegisterCounty" placeholder="请输入户籍所在地（区县）"></el-input>
				</el-form-item>
				<el-form-item label="户籍所在地（详细地址）">
					<el-input v-model="itemBasicInfo.censusRegisterDetail" placeholder="请输入户籍所在地（详细地址）"></el-input>
				</el-form-item>
				<el-form-item label="居住地址（省）">
					<el-input v-model="itemBasicInfo.liveAddressProvince" placeholder="请输入居住地址（省）"></el-input>
				</el-form-item>
				<el-form-item label="居住地址（市）">
					<el-input v-model="itemBasicInfo.liveAddressCity" placeholder="请输入居住地址（市）"></el-input>
				</el-form-item>
				<el-form-item label="居住地址（区县）">
					<el-input v-model="itemBasicInfo.liveAddressCounty" placeholder="请输入居住地址（区县）"></el-input>
				</el-form-item>
				<el-form-item label="居住地址（详细地址）">
					<el-input v-model="itemBasicInfo.liveAddressDetail" placeholder="请输入居住地址（详细地址）"></el-input>
				</el-form-item>
				<el-form-item label="联系地址（省）">
					<el-input v-model="itemBasicInfo.contactAddressProvince" placeholder="请输入联系地址（省）"></el-input>
				</el-form-item>
				<el-form-item label="联系地址（市）">
					<el-input v-model="itemBasicInfo.contactAddressCity" placeholder="请输入联系地址（市）"></el-input>
				</el-form-item>
				<el-form-item label="联系地址（区县）">
					<el-input v-model="itemBasicInfo.contactAddressCounty" placeholder="请输入联系地址（区县）"></el-input>
				</el-form-item>
				<el-form-item label="联系地址（详细地址）">
					<el-input v-model="itemBasicInfo.contactAddressDetail" placeholder="请输入联系地址（详细地址）"></el-input>
				</el-form-item>
				<el-form-item label="电子邮箱">
					<el-input v-model="itemBasicInfo.email" placeholder="请输入电子邮箱"></el-input>
				</el-form-item>
				<el-form-item label="学历">
					<el-input v-model="itemBasicInfo.education" placeholder="请输入学历"></el-input>
				</el-form-item>
				<el-form-item label="开户银行">
					<el-input v-model="itemBasicInfo.bankDeposit" placeholder="请输入开户银行"></el-input>
				</el-form-item>
				<el-form-item label="银行账号">
					<el-input v-model="itemBasicInfo.bankAccount" placeholder="请输入银行账号"></el-input>
				</el-form-item>
				<el-form-item label="职务">
					<el-input v-model="itemBasicInfo.post" placeholder="请输入职务"></el-input>
				</el-form-item>
				<el-form-item label="婚姻状况">
					<el-input v-model="itemBasicInfo.civilState" placeholder="请输入婚姻状况"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisibleBasicInfo = false">取 消</el-button>
				<el-button type="primary" @click="basicInfoCommit(itemBasicInfo)">确 定</el-button>
			</span>
		</el-dialog>

		<el-dialog title="月度工资表详细" :visible.sync="dialogVisibleDetail" width="50%" style="margin-top:15vh">
			<!-- <el-tabs v-model="activeName" @tab-click="handleClick"> -->
			<el-tabs v-model="activeName">
				<el-tab-pane :label="item.title" :name="item.name" v-for="(item,index) in tableTabs" :key="index">
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

		<el-dialog title="易点个税年终奖筹划方案" class="dialogCalc" :visible.sync="dialogVisibleCalc" width="60%">
			<span class="title">个税合计：【分开核算】{{calcData.sepTaxation}}【合并核算】{{calcData.comTaxation}}</span><span class="title reportFrom">【推荐核算】</span><span
			 class="title"> {{calcData.suggestTaxation}}</span>
			<!-- <div class="buttons">
				<el-button icon="el-icon-collection" size='mini' @click="saveCalc('1')">保存年终筹划</el-button>
				<el-button icon="el-icon-collection" size='mini' @click="saveCalc('2')">年终筹划默认全是分开核算</el-button>
				<el-button icon="el-icon-collection" size='mini' @click="saveCalc('3')">年终筹划默认全是合并核算</el-button>
				<el-button icon="el-icon-collection" type="primary" size='mini' @click="saveCalc('4')">年终筹划默认全是推荐核算</el-button>
			</div> -->

			<el-table :data="tableTem[index]" style="width: 100%;margin-top:20px" stripe border>
				<el-table-column align="center" label="姓名" prop="employeeName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="收入额" prop="incomeAmount" width="100" :resizable="false"></el-table-column>
				<el-table-column align="center" label="年终奖" prop="yearAwards" width="100" :resizable="false"></el-table-column>
				<el-table-column align="center" label="分开核算个税" prop="sepTaxation" width="120" :resizable="false"></el-table-column>
				<el-table-column align="center" label="合并核算个税" prop="comTaxation" width="120" :resizable="false"></el-table-column>
				<el-table-column align="center" label="推荐方案" width="120" :resizable="false">
					<template slot-scope="scope">
						<span v-if="scope.row.suggestType==1">{{ scope.row.sepTaxation}}</span>
						<span v-if="scope.row.suggestType==2">{{ scope.row.comTaxation}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<el-dropdown @command="handleCommand" style='float: left;line-height: 28px;'>
							<span class="el-dropdown-link">
								操作<i class="el-icon-arrow-down el-icon--right"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="分开核算">全部分开核算</el-dropdown-item>
								<el-dropdown-item command="合并核算">全部合并核算</el-dropdown-item>
								<el-dropdown-item command="推荐核算">全部推荐核算</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
						<el-button size='mini' type='primary' @click="saveCalc()" style='float: right;'>保存年终筹划</el-button>
					</template>
					<template slot-scope="scope">
						<el-radio-group v-model="scope.row.radio" size="small" @change='setIsAll'>
							<el-radio-button label="分开核算"></el-radio-button>
							<el-radio-button label="合并核算"></el-radio-button>
							<el-radio-button label="推荐核算"></el-radio-button>
						</el-radio-group>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background style="margin-top:10px;text-align: right;" @current-change="((val)=>{handleCurrentChange(val, '4')})"
			 :current-page="currentPage4" :page-size="pageSize4" layout="total, prev, pager, next,jumper" :total="total4">
			</el-pagination>
		</el-dialog>

		<el-dialog title="选择Excel" :visible.sync="dialogVisible" width="30%">
			<el-upload class="upload-demo" action="/perTaxToolTwo/api/excel/monthlyUpload.do" :on-preview="handlePreview" ref='upload'
			 :on-remove="handleRemove" :on-change="onChange" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed"
			 :file-list="fileList" :on-success="handleSuccess" :on-error="handleError" :auto-upload="false" :data='uploadData'
			 accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
				<el-button size="small" type="primary" slot="trigger">选择Excel</el-button>

			</el-upload>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancelUpload">取 消</el-button>
				<el-button type="primary" @click="submitUpload">上传</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	// import qs from	'qs'
	export default {
		name: "paySheet",
		data() {
			var validateInt = (rule, value, callback) => {
				var reg = /^[0-9]+(\.\d+)?$/;
				if (value === "") {
					callback();
				} else if (!reg.test(value)) {
					callback(new Error("必须大于等于0"));
				} else {
					callback();
				}
			};
			var validateMax60 = (rule, value, callback) => {

				var reg = /^\d{1,4}$|^72000/;
				if (value === "") {
					callback();
				} else if (value < 0 || value > 72000) {
					callback(new Error("必须大于等于0小于等于72000"));
				} else {
					callback();
				}
			};
			var validateMax48 = (rule, value, callback) => {
				var reg = /^(\d{1,4}|4800)$/;
				if (value === "") {
					callback();
				} else if (value < 0 || value > 4800) {
					callback(new Error("必须大于等于0小于等于4800"));
				} else {
					callback();
				}
			};
			var validateMax10 = (rule, value, callback) => {
				var reg = /^(\d{1,4}|12000)$/;
				if (value === "") {
					callback();
				} else if (value < 0 || value > 12000) {
					callback(new Error("必须大于等于0小于等于12000"));
				} else {
					callback();
				}
			};
			var validateMax15 = (rule, value, callback) => {
				var reg = /^(\d{1,4}|18000)$/;
				if (value === "") {
					callback();
				} else if (value < 0 || value > 18000) {
					callback(new Error("必须大于等于0小于等于18000"));
				} else {
					callback();
				}
			};
			var validateMax800 = (rule, value, callback) => {
				var reg = /^(\d{1,5}|80000)$/;
				if (value === "") {
					callback();
				} else if (value < 0 || value > 80000) {
					callback(new Error("必须大于等于0小于等于80000"));
				} else {
					callback();
				}
			};
			var validateCard = (rule, value, callback) => {
				var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				if (value === "") {
					callback();
				} else if (!reg.test(value)) {
					callback(new Error("身份证输入不合法"));
				} else {
					callback();
				}
			};
			return {
				rdStateList:[
					{label:'是',value:1},
					{label:'否',value:0}
				],
				residenceStateList:[
					{label:'是',value:1},
					{label:'否',value:0}
				],
				loading2: false,
				periodCustList: [],
				dialogVisible: false,
				uploadData: {
					accountPeriod: "",
					customerId: "",
					inputType: "",
					customerName: "",
				},
				switchvalue: false,
				searchData: {
					accountPeriod: "",
					customerId: "",
					customerName: "",
					statusVaule: "0",
				},
				fileList: [],
				tableData1: [],
				currentPage1: 1,
				pageSize1: 10,
				pageNum1: 1,
				total1: 0,
				tableData2: [],
				currentPage2: 1,
				pageSize2: 10,
				pageNum2: 1,
				total2: 0,
				tableData3: [],
				currentPage3: 1,
				pageSize3: 10,
				pageNum3: 1,
				total3: 0,
				tableData4: [],
				currentPage4: 1,
				pageSize4: 10,
				pageNum4: 1,
				total4: 0,
				dialogVisibleDetail: false,
				activeName: "1", //月度工资表详细Tab
				tableTabs: [{
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
				tableDataDetail: [], //月度工资表详细数据
				canDel: true, //批量删除按钮状态
				multipleSelection: [], //多选
				item: {
					employeeName: "",
					cardType: "",
					cardNum: "",
					employmentDate: "",
					projectCode: "",
					incomeAmount: "0",
					reportedIncome: "0",
					taxFreeIncome: "0",
					pensionInsurance: "0",
					medicalInsurance: "0",
					unemploymentInsurance: "0",
					housingFund: "0",
					childEducation: "0",
					continuingEducation: "0",
					homeLoan: "0",
					housingRent: "0",
					elderly: "0",
					companyAnnuity: "0",
					healthInsurance: "0",
					pension: "0",
					deductedDonation: "0",
					isSolitary: "0",
					deductedTaxes: "0",
					preTaxDeduction: "0",
					propertyOrigin: "0",
					isEmployment: "1",
					yearAwards: "0",
					deductTax: "0",
					rdState: 0,
					rdProjName:'',
					areaCode: "1",
					email: "0",
					phone: "0",
					residenceState:0,
					
				},
				dialogVisibleAdd: false,
				rulesf: {
					accountPeriod: [{
						required: true,
						message: '请选择账期',
						trigger: 'blur'
					}],
					customerId: [{
						required: true,
						message: '请选择公司',
						trigger: 'blur'
					}],
				},
				ruless: {
					accountPeriod: [{
						required: true,
						message: '请选择账期',
						trigger: 'blur'
					}],
					customerId: [{
						required: true,
						message: '请选择公司',
						trigger: 'blur'
					}],
					statusVaule: [{
						required: true,
						message: '请选择状态',
						trigger: 'blur'
					}],
				},
				rules: {
					employeeName: [{
						required: true,
						message: "请输入姓名",
						trigger: "blur"
					}],
					cardType: [{
						required: true,
						message: "请选择证件类型",
						trigger: "change"
					}],
					cardNum: [{
						required: true,
						message: "请输入证件号码",
						trigger: "blur"
					}
					// , {
					// 	validator: validateCard,
					// 	trigger: "blur"
					// },
					],
					employmentDate: [{
						type: "string",
						required: true,
						message: "请选择任职受雇日期日期",
						trigger: "change"
					}],
					projectCode: [{
						required: true,
						message: "请输入项目名称",
						trigger: "blur"
					}],
					incomeAmount: [{
							required: true,
							message: "请输入收入额",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],
					reportedIncome: [{
							required: true,
							message: "请输入已申报收入",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],
					taxFreeIncome: [{
							required: true,
							message: "请输入免税所得",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],
					pensionInsurance: [{
							required: true,
							message: "请输入基本养老保险费",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],
					medicalInsurance: [{
							required: true,
							message: "请输入基本医疗保险费",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],
					unemploymentInsurance: [{
							required: true,
							message: "请输入失业保险费",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],
					housingFund: [{
							required: true,
							message: "请输入住房公积金",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],
					childEducation: [{
							required: true,
							message: "请输入本月计子女教育",
							trigger: "blur"
						},
						{
							validator: validateMax60,
							trigger: "blur"
						}
					],
					continuingEducation: [{
							required: true,
							message: "请输入本月继续教育",
							trigger: "blur"
						},
						{
							validator: validateMax48,
							trigger: "blur"
						}
					],
					homeLoan: [{
							required: true,
							message: "请输入住房贷款利息",
							trigger: "blur"
						},
						{
							validator: validateMax10,
							trigger: "blur"
						}
					],
					housingRent: [{
							required: true,
							message: "请输入本月住房租金",
							trigger: "blur"
						},
						{
							validator: validateMax15,
							trigger: "blur"
						}
					],
					elderly: [{
							required: true,
							message: "请输入本月赡养老人",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],
					companyAnnuity: [{
							required: true,
							message: "请输入企业(职业)年金",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],
					healthInsurance: [{
							required: true,
							message: "请输入商业健康保险",
							trigger: "blur"
						},
						{
							validator: validateMax800,
							trigger: "blur"
						}
					],
					pension: [{
							required: true,
							message: "请输入税延养老保险",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],
					deductedDonation: [{
							required: true,
							message: "请输入准予扣除的捐赠额",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],

					childEducationDeductionDecrease: [{
							required: true,
							message: "请输入累计子女教育减征额",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],

					continuingEducationDecrease: [{
							required: true,
							message: "请输入累计继续教育减征额",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],

					homeLoanDecrease: [{
							required: true,
							message: "请输入累计住房贷款利息减征额",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],

					housingRentDecrease: [{
							required: true,
							message: "请输入累计住房租金减征额",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],

					elderlyDecrease: [{
							required: true,
							message: "请输入累计赡养老人减征额",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],

					healthInsuranceDecrease: [{
							required: true,
							message: "请输入累计商业健康保险减征额",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],


					isSolitary: [{
						required: true,
						message: "请选择",
						trigger: "change"
					}],
					rdState: [{
						required: false,
						message: "请选择",
						trigger: "change"
					}],
					rdProjName: [{
						required: false,
						message: "请输入其他税前扣除项目",
						trigger: "blur"
					}],
					deductedTaxes: [{
							required: true,
							message: "请输入允许扣除的税费",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],
					preTaxDeduction: [{
						required: true,
						message: "请输入其他税前扣除项目",
						trigger: "blur"
					}],
					yearAwards: [{
							required: true,
							message: "请输入年终奖",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],
					deductTax: [{
							required: true,
							message: "请输入减免税额",
							trigger: "blur"
						},
						{
							validator: validateInt,
							trigger: "blur"
						}
					],
					areaCode: [{
						required: true,
						message: "请选择国家",
						trigger: "change"
					}],
					email: [{
						required: true,
						message: "请输入电子邮件",
						trigger: "blur"
					}],
					phone: [{
						required: true,
						message: "请输入电话",
						trigger: "blur"
					}]
				},
				rulesBasic: {
					employeeName: [{
						required: true,
						message: "请输入姓名",
						trigger: "blur"
					}],
					cardType: [{
						required: true,
						message: "请选择证件类型",
						trigger: "change"
					}],
					cardNum: [{
						required: true,
						message: "请输入证件号码",
						trigger: "blur"
					}
					// , {
					// 	validator: validateCard,
					// 	trigger: "blur"
					// },
					]
				},
				dialogVisibleCalc: false,
				calcData: {},
				addFlag: false,
				operateId: "",
				customerList: [],
				calcFlag: false,
				tag: 3,
				tableTem: [],
				index: 0,
				dialogVisibleBasicInfo: false,
				itemBasicInfo: {
					personInfoId: '',
					employeeCode: '',
					employeeName: '',
					cardType: '',
					cardNum: '',
					sex: '',
					birthDate: '',
					employeeStatus: '',
					employeeType: '',
					phoneNum: '',
					employeeDate: '',
					quitDate: '',
					isDiasbility: '',
					isMartyr: '',
					isLonely: '',
					diasbilityNum: '',
					martyrNum: '',
					individualInvestment: '',
					individualInvestmentRatio: '',
					remark: '',
					isOverseasPerson: '',
					chineseName: '',
					taxRelatedCauses: '',
					birthCountry: '',
					firstEntryCountryDate: '',
					estimateDepartureCountryDate: '',
					otherCardType: '',
					otherCardNum: '',
					censusRegisterProvince: '',
					censusRegisterCity: '',
					censusRegisterCounty: '',
					censusRegisterDetail: '',
					liveAddressProvince: '',
					liveAddressCity: '',
					liveAddressCounty: '',
					liveAddressDetail: '',
					contactAddressProvince: '',
					contactAddressCity: '',
					contactAddressCounty: '',
					contactAddressDetail: '',
					email: '',
					education: '',
					bankDeposit: '',
					bankAccount: '',
					post: '',
					civilState: '',
				},


				operateIdM: ''
			};
		},
		watch: {
			'$route'(to, from) {
				// init data
				if (to.name == 'paySheet') {
					// this.customerList = this.$store.state.cust;
					// console.log(this.customerList);
					this.$nextTick(() => {

						if (this.$route.query.customerId && this.$route.query.accountPeriod) {
							this.searchData.accountPeriod = this.$route.query.accountPeriod;
							this.searchData.customerId = this.$route.query.customerId;
							this.search("formName1");
						}

					})
				}

			},
			multipleSelection(val) {
				if (val.length == 0) {
					this.canDel = true;
				} else {
					this.canDel = false;
				}
			},
			switchvalue(val) {
				if (val) {
					this.uploadData.inputType = 1;
				} else {
					this.uploadData.inputType = "";
				}
				console.log("this.uploadData.inputType", this.uploadData.inputType);
			}
		},
		components: {},
		methods: {
			getPeriodCustList() {
				let param = {};
				this.axios.get('/perTaxToolTwo/api/user/getPeriodCustList.do').then(res => {
					if (res.data.code == 200) {
						this.periodCustList = res.data.data;


					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取客户失败',
						type: 'error'
					});
				})
			},
			// 1.8 操作表id接口
			getOperatorId() {
				let params = {
					accountPeriod: this.searchData.accountPeriod,
					customerId: this.searchData.customerId,
				};
				this.axios
					.post("/perTaxToolTwo/api/import/queryOptByCust", params)
					.then(res => {
						if (res.data.code == 200) {
							if (res.data.data.length > 0) {
								// this.operateId = res.data.data[0].operateId;

								// this.operateIdM = res.data.data[0].operateId;
							} else {
								this.$message({
									message: '该账期下暂未导入数据',
									type: "warning"
								});
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
			// 1.3 搜索接口(导入员工信息展示)
			getTableData1() {
				let params = {
					row: this.pageSize1,
					page: this.pageNum1,
					data: {
						accountPeriod: this.searchData.accountPeriod,
						customerId: this.searchData.customerId,
						submitStatus: this.searchData.statusVaule
					}
				};
				this.axios
					.post("/perTaxToolTwo/initialMonSal/queryPage", params)
					.then(res => {
						if (res.data.code == 200) {
							this.tableData1 = res.data.data;
							this.total1 = res.data.count;
							this.operateId = res.data.data[0]?res.data.data[0].operateId:null;
							this.operateIdM = res.data.data[0]?res.data.data[0].operateId:null;
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
			// 1.4 搜索接口(计算累计汇算表展示)
			getTableData2() {
				this.loading2 = true;
				let params = {
					row: this.pageSize2,
					page: this.pageNum2,
					data: {
						accountPeriod: this.searchData.accountPeriod,
						customerId: this.searchData.customerId,
						employeeName: "",
						submitStatus: this.searchData.statusVaule
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
						});0
					});
			},
			
			exportExcel(){
				window.location.href = "/perTaxToolTwo/api/excel/exportAcctData?accountPeriod=" + this.searchData.accountPeriod + '&customerId=' + this.searchData.customerId
				+ '&submitStatus=' + this.searchData.statusVaule;
				
				
			},
			// 1.5 搜索接口（选择年终统筹展示）
			getTableData3() {
				let params = {
					row: this.pageSize3,
					page: this.pageNum3,
					data: {
						accountPeriod: this.searchData.accountPeriod,
						customerId: this.searchData.customerId,
						employeeName: "",
						submitStatus: this.searchData.statusVaule
					}
				};
				this.axios
					.post("/perTaxToolTwo/awdsAcct/queryPage", params)
					.then(res => {
						if (res.data.code == 200) {
							this.tableData3 = res.data.data;
							this.total3 = res.data.count;
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
			// 获取月度工资表详细数据  /perTaxToolTwo/monDetail/queryList
			// getMonthDetail(cardNum) {
			// 	let params = {
			// 		cardNum: cardNum,
			// 		operateId: this.operateId
			// 	};
			getMonthDetail(cardNum, operateId) {
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
			// /perTaxToolTwo/monAcct/queryChoosePage
			getTableData4(operateId) {
				this.tableTem = [];
				let params = {
					// row: this.pageSize4,
					row: 99999,
					page: this.pageNum4,
					data: {
						operateId: operateId
					}
				};
				this.axios
					.post("/perTaxToolTwo/monAcct/queryChoosePage", params)
					.then(res => {
						if (res.data.code == 200) {
							this.tableData4 = res.data.data;
							this.calcData = res.data.extraData;
							this.total4 = res.data.count;
							this.tableData4.forEach((item, index) => {
								this.$set(item, "radio", "推荐核算");
								this.$set(item, "chooseType", "3");
								// item.radio='推荐核算'
							});
							for (let i = 0; i < this.tableData4.length; i += 10) {
								this.tableTem.push(this.tableData4.slice(i, i + 10));
							}
							console.log("11", this.tableData4);
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
			handleClick(row) {
				console.log("获取详细数据", row);
				this.dialogVisibleDetail = true;
				// this.getMonthDetail(row.cardNum);
				this.getMonthDetail(row.cardNum, row.operateId);
			},
			search(formName) {

				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.getOperatorId();
						this.pageNum1 = '1';
						this.getTableData1();
						this.pageNum2 = '1';
						this.getTableData2();
						this.pageNum3 = '1';
						this.getTableData3();
						if (this.searchData.statusVaule == 0) {
							this.calcFlag = true;
						} else {
							this.calcFlag = false;
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				})
				// 获取操作表id
			},
			selectExcel(formName) {

				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.dialogVisible = true;
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			// 沿用上月
			continueExcel(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let params = {
							customerId: this.uploadData.customerId,
							accountPeriod: this.uploadData.accountPeriod
						};
						this.axios
							.post("/perTaxToolTwo/initialMonSal/continueExcel", params)
							.then(res => {
								if (res.data.code == 200) {
									this.pageNum1 = '1';
									this.searchData.customerId = this.uploadData.customerId;
									this.searchData.accountPeriod = this.uploadData.accountPeriod;
									// this.getOperatorId();
									this.operateIdM = res.data.data;
									this.operateId = res.data.data;
									this.calcFlag = true;
									this.getTableData1();
									this.pageNum2 = '1';
									this.getTableData2();
									this.pageNum3 = '1';
									this.getTableData3();
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
						console.log('error submit!!');
						return false;
					}
				});
			},
			cancelUpload() {
				this.fileList = [];
				this.dialogVisible = false;
			},
			submitUpload() {
				this.$refs.upload.submit();
			},
			onChange(file, fileList) { //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
				let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
				if (existFile) {
					this.$message.error('当前文件已经存在!');
					fileList.pop()
				}
				this.fileList = fileList
			},
			handleSuccess(response) {
				if (response.code == 200) {
					this.fileList = [];
					this.$message({
						message: response.msg,
						type: "success"
					});
					this.dialogVisible = false;
					this.searchData.accountPeriod = this.uploadData.accountPeriod;
					this.searchData.customerId = this.uploadData.customerId;
					this.searchData.customerName = this.uploadData.customerName;
					this.searchData.statusVaule = "0";
					this.calcFlag = true;
					this.addFlag = true;
					this.getOperatorId();
					this.pageNum1 = '1';
					this.getTableData1();
					this.pageNum2 = '1';
					this.getTableData2();
					this.pageNum3 = '1';
					this.getTableData3();
				} else {
					this.fileList = [];
					this.$message({
						message: response.msg || "上传文件失败！",
						type: "error"
					});
				}
			},
			handleError(err) {
				this.fileList = [];
				this.$message({
					message: "上传文件失败！",
					type: "error"
				});
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			handleExceed(files, fileList) {
				this.$message.warning(
					`当前限制选择 1 个文件，本次选择了 ${
	          files.length
	        } 个文件，共选择了 ${files.length + fileList.length} 个文件`
				);
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${file.name}？`);
			},
			handleCurrentChange(val, type) {
				if (type == "1") {
					this.pageNum1 = val;
					this.getTableData1();
				} else if (type == "2") {
					this.pageNum2 = val;
					this.getTableData2();
				} else if (type == "3") {
					this.pageNum3 = val;
					this.getTableData3();
				} else if (type == "4") {
					this.index = val - 1;
					// this.pageNum4 = val;
					// this.getTableData4();
					// 在此保存计算年终奖
					// this.saveCalc("1");
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			addUser() {
				this.item = {
					employeeName: "",
					cardType: "居民身份证",
					cardNum: "",
					employmentDate: "",
					projectCode: "正常工资薪金",
					incomeAmount: "0",
					reportedIncome: "0",
					taxFreeIncome: "0",
					pensionInsurance: "0",
					medicalInsurance: "0",
					unemploymentInsurance: "0",
					housingFund: "0",
					childEducation: "0",
					continuingEducation: "0",
					homeLoan: "0",
					housingRent: "0",
					elderly: "0",
					companyAnnuity: "0",
					healthInsurance: "0",
					pension: "0",
					deductedDonation: "0",
					isSolitary: "0",
					deductedTaxes: "0",
					preTaxDeduction: "0",
					propertyOrigin: "0",
					isEmployment: "1",
					yearAwards: "0",
					deductTax: "0",
					areaCode: "1",
					email: "0",
					phone: "0"
				};
				this.addFlag = true;
				this.dialogVisibleAdd = true;
				// this.$nextTick(() => {
				// 	this.$refs[this.item].resetFields();
				// });
			},
			edit(row) {
				console.log("row.", row);
				this.item = row;
				this.addFlag = false;
				this.dialogVisibleAdd = true;
				// this.$nextTick(() => {
				// 	this.$refs[this.item].resetFields();
				// });
			},
			del(row) {
				this.$confirm("确定删除此条记录?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					let params = [row];
					console.log("params", params);
					this.axios
						.post("/perTaxToolTwo/initialMonSal/deletemonth", params)
						.then(res => {
							if (res.data.code == 200) {
								this.pageNum1 = '1';
								this.getTableData1();
								this.pageNum2 = '1';
								this.getTableData2();
								this.pageNum3 = '1';
								this.getTableData3();
								this.$message({
									type: "success",
									message: res.data.msg
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
				});
			},
			showDelDialog() {
				this.$confirm("确定删除选中的记录?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					let params = this.multipleSelection;
					console.log("params", params);
					this.axios
						.post("/perTaxToolTwo/initialMonSal/deletemonth", params)
						.then(res => {
							if (res.data.code == 200) {
								this.pageNum1 = '1';
								this.getTableData1();
								this.pageNum2 = '1';
								this.getTableData2();
								this.pageNum3 = '1';
								this.getTableData3();
								this.$message({
									type: "success",
									message: res.data.msg
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
				});
			},
			calc() {
				this.operateId = this.operateIdM;
				this.$confirm("您确定要计算【月度工资表】吗？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					// 先调取计算接口 /perTaxToolTwo/monAcct/CalculatorSingleCompany
					let params = {
						operateId: this.operateId
					};
					this.axios
						.post("/perTaxToolTwo/monAcct/CalculatorSingleCompany", this.qs.stringify(params), {
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						})
						.then(res => {
							if (res.data.code == 200) {
								if (res.data.data.length > 0) {
									this.dialogVisibleCalc = true;
									// 再获取弹出层表格的数据
									this.pageNum4 = '1';
									this.getTableData4(res.data.data[0].operateId);
								} else {
									this.pageNum1 = '1';
									this.getTableData1();
									this.pageNum2 = '1';
									this.getTableData2();
									this.pageNum3 = '1';
									this.getTableData3();
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
				});
			},
			saveCalc() {
				console.log(this.tableData4);
				let params = {};
				let confirmInfo;
				if (this.tag == 0) {
					let paramArr = [];
					this.tableData4.forEach(item => {
						var obj = {};
						obj.operateId = this.operateId;
						obj.monthlyAcctId = item.monthlyAcctId;
						if (item.radio == "分开核算") {
							obj.chooseType = "1";
						} else if (item.radio == "合并核算") {
							obj.chooseType = "2";
						} else if (item.radio == "推荐核算") {
							obj.chooseType = "3";
						}
						paramArr.push(obj);
					});
					params = [paramArr];
					confirmInfo = "您确定要保存年终筹划吗？";
				} else if (this.tag == 1) {
					params.type = "1";
					params.operateId = this.operateId;
					confirmInfo = "您确定要年终筹划全是【分开核算】吗？";
				} else if (this.tag == 2) {
					params.type = "2";
					params.operateId = this.operateId;
					confirmInfo = "您确定要年终筹划全是【合并核算】吗？";
				} else if (this.tag == 3) {
					params.type = "3";
					params.operateId = this.operateId;
					confirmInfo = "您确定要年终筹划全是【推荐核算】吗？";
				}
				console.log("params", params);
				this.$confirm(confirmInfo, "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					// /perTaxToolTwo/monAcct/chooseCalcTypeList
					if (this.tag == 0) {
						this.axios
							.post("/perTaxToolTwo/monAcct/chooseCalcTypeList", params)
							.then(res => {
								if (res.data.code == 200) {
									if (res.data.data.length > 0) {
										this.dialogVisibleCalc = true;
										this.operateId = res.data.data[0].operateId;
										// 再获取弹出层表格的数据
										this.pageNum4 = '1';
										this.getTableData4(res.data.data[0].operateId);
									} else {
										this.dialogVisibleCalc = false;
										this.pageNum1 = '1';
										this.getTableData1();
										this.pageNum2 = '1';
										this.getTableData2();
										this.pageNum3 = '1';
										this.getTableData3();
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
					} else {
						this.axios
							.post("/perTaxToolTwo/monAcct/chooseCalcTypeListAll", this.qs.stringify(params), {
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded'
								}
							})
							.then(res => {
								if (res.data.code == 200) {
									if (res.data.data.length > 0) {
										this.dialogVisibleCalc = true;
										this.operateId = res.data.data[0].operateId;
										// 再获取弹出层表格的数据
										this.pageNum4 = '1';
										this.getTableData4(res.data.data[0].operateId);
									} else {
										this.dialogVisibleCalc = false;
										this.pageNum1 = '1';
										this.getTableData1();
										this.pageNum2 = '1';
										this.getTableData2();
										this.pageNum3 = '1';
										this.getTableData3();
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
					}
				});
			},
			continueAdd(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						this.submit();
						this.dialogVisibleBasicInfo = true;
						this.itemBasicInfo.employeeName = this.item.employeeName;
						this.itemBasicInfo.cardType = this.item.cardType;
						this.itemBasicInfo.cardNum = this.item.cardNum;
						this.itemBasicInfo.email = this.item.email;
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			save(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						this.submit();
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			basicInfoCommit(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						this.submitBasic();
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			submit() {
				let params = this.item;
				if (this.addFlag) {
					params.accountPeriod = this.searchData.accountPeriod;
					params.customerId = this.searchData.customerId;
					params.submitStatus = this.searchData.statusVaule;
					params.monthlyId = "";
					params.operateId = "";
				}
				console.log("params", params);
				this.axios
					.post("/perTaxToolTwo/Employee/addOrEditTaxEmployee", params)
					.then(res => {
						if (res.data.code == 200) {
							this.itemBasicInfo.personInfoId = res.data.data;
							this.dialogVisibleAdd = false;
							// this.currentPage1 = '1';
							// this.pageNum1 = '1';
							this.getTableData1();
							this.pageNum2 = '1';
							this.getTableData2();
							this.pageNum3 = '1';
							this.getTableData3();
							this.$message({
								type: "success",
								message: res.data.msg
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
			submitBasic() {
				let params = this.itemBasicInfo;
				console.log("params", params);
				this.axios
					.post("/perTaxToolTwo/Employee/addOrEditPersonInfo", params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisibleBasicInfo = false;
							this.$message({
								type: "success",
								message: res.data.msg
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
					.catch(function(err) {
						this.dialogVisibleAdd = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			goReportForms() {
				this.$router.push({
					path: '/accountFactory/reportForms',
					query: {
						accountPeriod: this.searchData.accountPeriod,
						customerId: this.searchData.customerId,
					}
				});
			},
			submitAll() {
				let params = {
					operateIdM: this.operateIdM
				};
				this.$confirm("您确定要提交【月度工资表】和【累计汇算表】吗？", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				}).then(() => {
					this.axios
						.post("/perTaxToolTwo/api/user/import/subExcel.do", this.qs.stringify(params), {
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						})
						.then(res => {
							if (res.data.code == 200) {
								this.searchData.statusVaule = "0";
								this.addFlag = false;
								this.pageNum1 = '1';
								this.getTableData1();
								this.pageNum2 = '1';
								this.getTableData2();
								this.pageNum3 = '1';
								this.getTableData3();
								this.$message({
									type: "success",
									message: res.data.msg
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
				});
			},
			setIsAll() {
				this.tag = 0;
				console.log("tag", this.tag)
			},
			handleCommand(command) {
				switch (command) {
					case '分开核算':
						this.tag = 1;
						break;
					case '合并核算':
						this.tag = 2;
						break;
					case '推荐核算':
						this.tag = 3;
						break;
					default:
						break;
				}
				// for(let i = 0; i < this.tableTem.length;i++){
				// 	
				// }
				this.tableData4.forEach((item, index) => {
					item.radio = command;
				})
				for (let i = 0; i < this.tableData4.length; i += 10) {
					this.tableTem.push(this.tableData4.slice(i, i + 10));
				}
				console.log("tagaaaa", this.tag)
			}
		},
		computed: {},
		created() {
			// alert(this.qs.stringify({
			// 		confirmButtonText: "确定",
			// 		cancelButtonText: "取消",
			// 		type: "warning"
			// 	}))
			// this.customerList = this.$store.state.cust;
			// console.log(this.customerList);
			this.getPeriodCustList();
			this.$nextTick(() => {

				if (this.$route.query.customerId && this.$route.query.accountPeriod) {
					this.searchData.accountPeriod = this.$route.query.accountPeriod;
					this.searchData.customerId = this.$route.query.customerId;
					this.search("formName1");
				}

			})
			// this.getNowMonth();
		}
	};
</script>
<style>
	.table1 .demo-table-expand label {
		color: #99a9bf;
		padding-left: 120px;
	}

	.table1 .demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}

	.dialogAdd .el-input,
	.dialogAdd .el-select,
	.dialogAdd .el-date-editor,
	.dialogAdd .el-date-editor.el-input,
	.dialogAdd .el-date-editor.el-input__inner {
		width: 200px;
	}

	.dialogCalc .el-dialog__body {
		padding-top: 0;
	}
</style>

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
			background-color: #fff;
			border-top: 1px solid #f2f6fc;
			box-sizing: border-box;
		}

		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 40px;
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
			color: #343434; // font-size: 16px;
		}

		/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
			background-color: #efe9e5;
		}

		/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
			border-bottom-color: #fff;
			background: #ebf6fb;
		}

		/deep/ .el-table td {
			padding: 6px 0;
		}

		.search_contain {
			background: #fff;
			height: 100px;
			padding-left: 20px;
			margin: 20px;

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
			margin: 0 20px;
			padding: 0px 20px 10px; // height: calc(100% - 190px);

			h5 {
				height: 40px;
				line-height: 40px;
			}

			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
				/* margin-bottom: 10px; */
			}
		}

		.title {
			font-weight: bold;
			line-height: 40px;
		}

		.reportFrom {
			color: red;
			cursor: pointer;
		}

		.bottomTable {
			margin-top: 20px;
		}

		.tips {
			color: #2e78ff;
			font-size: 14px;
			line-height: 40px;
			margin: 0 20px;
		}
	}
</style>
