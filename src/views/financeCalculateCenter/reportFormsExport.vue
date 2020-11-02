<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>报表</el-breadcrumb-item>
			<el-breadcrumb-item>报表导出</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small" ref='formName'>
					<el-form-item label="报表类型">
						<el-select v-model="uploadData.type" placeholder="请选择" @change="clear">
							<el-option label="资产负债表" value="资产负债表"></el-option>
							<el-option label="利润表" value="利润表"></el-option>
							<el-option label="总分类账" value="总分类账"></el-option>
							<el-option label="明细分类账" value="明细分类账"></el-option>
						</el-select>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class='form_contain' v-if="uploadData.type">
			<div v-if="uploadData.type == '资产负债表'">
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small" ref='formName'>
					<el-form-item label="单位名称" prop="dossierName">
						<el-select v-model="uploadData.fBrNo" placeholder="请选择公司名称" clearable filterable @change='getProofTVoucher'>
							<el-option v-for="item in custList" :label="item.customerName" :value='item.customerName'></el-option>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="会计期间" prop="dossierName">

						<el-date-picker v-model="uploadData.fYear" align="right" type="year" placeholder="选择年" format="yyyy" value-format="yyyy">
						</el-date-picker>
						<span class="demonstration" style="margin-left:5px;">年</span>
						<el-input-number v-model="uploadData.fPeriod" :min="1" :max="12" label="描述文字" style="height:30px;margin-left:10px;width:100px;"></el-input-number>
						<span class="demonstration" style="margin-left:5px;">期</span>
					</el-form-item>

					<el-button type="info" @click='resetForm()' size="small" style="float: right;"> 重 置 </el-button>
					<el-button type="primary" @click='search1()' size="small" style="float: right;margin-right: 20px;"> 查 找
					</el-button>


				</el-form>
			</div>
			<div v-if="uploadData.type == '利润表'">
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small" ref='formName'>
					<el-form-item label="单位名称" prop="dossierName">
						<el-select v-model="uploadData.fBrNo" placeholder="请选择公司名称" clearable filterable @change='getProofTVoucher'>
							<el-option v-for="item in custList" :label="item.customerName" :value='item.customerName'></el-option>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="会计期间" prop="dossierName">

						<el-date-picker v-model="uploadData.fYear" align="right" type="year" placeholder="选择年" format="yyyy" value-format="yyyy">
						</el-date-picker>
						<span class="demonstration" style="margin-left:5px;">年</span>
						<el-input-number v-model="uploadData.fPeriod" :min="1" :max="12" label="描述文字" style="height:30px;margin-left:10px;width:100px;"></el-input-number>
						<span class="demonstration" style="margin-left:5px;">期</span>
					</el-form-item>

					<el-button type="info" @click='resetForm()' size="small" style="float: right;"> 重 置 </el-button>
					<el-button type="primary" @click='search2()' size="small" style="float: right;margin-right: 20px;"> 查 找
					</el-button>


				</el-form>
			</div>
			<div v-if="uploadData.type == '总分类账'">
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small" ref='formName'>
					<el-form-item label="单位名称" prop="fBrNo">
						<el-select v-model="uploadData.fBrNo" placeholder="请选择公司名称" clearable filterable @change='getProofTAccounts'>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in custList" :label="item.customerName" :value='item.customerName'></el-option>

						</el-select>
					</el-form-item>
					<el-form-item label="会计期间" prop="fYearStart">
						<el-date-picker v-model="uploadData.fYearStart" type="year" format="yyyy" value-format="yyyy">
						</el-date-picker>
						<span class="demonstration" style="margin-left:5px;">年</span>
						<el-input-number v-model="uploadData.fPeriodStart" :min="1" :max="12" label="描述文字" style="height:30px;margin-left:10px;width:100px;"></el-input-number>
						<span class="demonstration" style="margin-left:5px;">期至</span>

						<el-date-picker v-model="uploadData.fYearEnd" type="year" format="yyyy" value-format="yyyy">
						</el-date-picker>年
						<el-input-number v-model="uploadData.fPeriodEnd" :min="1" :max="12" label="描述文字" style="height:30px;margin-left:10px;width:100px;"></el-input-number>
						<span class="demonstration" style="margin-left:5px;"></el-date-picker>期</span>
					</el-form-item>

					<el-form-item label="科目代码" prop="fNumberStart">
						<el-cascader v-model="uploadData.fNumberStart" placeholder="试试搜索" :options="treeList3" filterable :props="props1"
						 :show-all-levels="false" change-on-select></el-cascader>
						<span class="demonstration" style="margin-left:5px;"></span>
						<span class="demonstration" style="margin-left:5px;">至</span>

						<el-cascader v-model="uploadData.fNumberEnd" placeholder="试试搜索" :options="treeList3" filterable :props="props1"
						 :show-all-levels="false" change-on-select></el-cascader>
					</el-form-item>

					<el-form-item label="科目级别" prop="fLevel">
						<el-select v-model="uploadData.fLevel" placeholder="请选择科目级别" clearable filterable>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in 6" :label="item" :value='item'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" prop="flagAmount">
						<el-checkbox v-model="uploadData.flagAmount" :true-label='truelabel' :false-label='falselabel'>无发生额不显示</el-checkbox>
					</el-form-item>
					<el-form-item label="" prop="flagZero">
						<el-checkbox v-model="uploadData.flagZero" :true-label='truelabel' :false-label='falselabel'>余额为0且无发生额不显示</el-checkbox>
					</el-form-item>
					<el-form-item label="" prop="flagUnPosted">
						<el-checkbox v-model="uploadData.flagUnPosted" :true-label='truelabel' :false-label='falselabel'>包括未过账凭证</el-checkbox>
					</el-form-item>
					<el-form-item label="" prop="flagUnTrans">
						<el-checkbox v-model="uploadData.flagUnTrans" :true-label='truelabel' :false-label='falselabel'>余额为0包括没有发生业务的科目（无期初余额、本年累计）</el-checkbox>
					</el-form-item>

					<el-button type="info" @click='resetForm()' size="small" style="float: right;"> 重 置 </el-button>
					<el-button type="primary" @click='search3()' size="small" style="float: right;margin-right: 20px;"> 查 找
					</el-button>


				</el-form>
			</div>
			<div v-if="uploadData.type == '明细分类账'">
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small" ref='formName'>
					<el-form-item label="单位名称" prop="dossierName">
						<el-select v-model="uploadData.fBrNo" placeholder="请选择公司名称" clearable filterable @change='getProofTAccounts'>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in custList" :label="item.customerName" :value='item.customerName'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="会计时间" prop="dossierName">
						<el-date-picker v-model="uploadData.fYearStart" type="year" format="yyyy" value-format="yyyy">
						</el-date-picker>
						<span class="demonstration" style="margin-left:5px;">年</span>
						<el-input-number v-model="uploadData.fPeriodStart" :min="1" :max="12" label="描述文字" style="height:30px;margin-left:10px;width:100px;"></el-input-number>
						<span class="demonstration" style="margin-left:5px;">期至</span>

						<el-date-picker v-model="uploadData.fYearEnd" type="year" format="yyyy" value-format="yyyy">
						</el-date-picker>年
						<el-input-number v-model="uploadData.fPeriodEnd" :min="1" :max="12" label="描述文字" style="height:30px;margin-left:10px;width:100px;"></el-input-number>
						<span class="demonstration" style="margin-left:5px;"></el-date-picker>期</span>
					</el-form-item>

					<el-form-item label="科目代码" prop="dossierName">
						<el-cascader v-model="uploadData.fNumberStart" placeholder="试试搜索" :options="treeList3" filterable :props="props1"
						 :show-all-levels="false" change-on-select></el-cascader>
						<span class="demonstration" style="margin-left:5px;"></span>
						<span class="demonstration" style="margin-left:5px;">至</span>

						<el-cascader v-model="uploadData.fNumberEnd" placeholder="试试搜索" :options="treeList3" filterable :props="props1"
						 :show-all-levels="false" change-on-select></el-cascader>
					</el-form-item>

					<el-form-item label="科目级别" prop="fLevel">
						<el-select v-model="uploadData.fLevel" placeholder="请选择科目级别" clearable filterable>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in 6" :label="item" :value='item'></el-option>
						</el-select>
					</el-form-item>

					<el-form-item label="" prop="dossierName">
						<el-checkbox v-model="uploadData.flagAmount" :true-label='truelabel' :false-label='falselabel'>无发生额不显示</el-checkbox>
					</el-form-item>
					<el-form-item label="" prop="dossierName">
						<el-checkbox v-model="uploadData.flagZero" :true-label='truelabel' :false-label='falselabel'>余额为0且无发生额不显示</el-checkbox>
					</el-form-item>
					<el-form-item label="" prop="dossierName">
						<el-checkbox v-model="uploadData.flagUnPosted" :true-label='truelabel' :false-label='falselabel'>包括未过账凭证</el-checkbox>
					</el-form-item>
					<el-form-item label="" prop="dossierName">
						<el-checkbox v-model="uploadData.flagUnTrans1" :true-label='truelabel1' :false-label='falselabel1'>包括没有发生业务的科目(无期初余额、本年累计)</el-checkbox>
					</el-form-item>

					<el-button type="info" @click='resetForm()' size="small" style="float: right;"> 重 置 </el-button>
					<el-button type="primary" @click='search4()' size="small" style="float: right;margin-right: 20px;"> 查 找
					</el-button>


				</el-form>
			</div>
		</div>

		<div class='main_contain clearfix' v-if="uploadData.type == '资产负债表'">
			<h5>资产负债表</h5>
			<p>单位名称：{{fBrNo}}
				<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='voucherGather_print()' style='float:right'>打印</el-button>
				<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='exportExcel()' style='float:right;margin-right: 10px;'>导出</el-button>
			</p>

			<el-table :data="tableData" style="" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="" label="资产">
					<template slot-scope="scope">
						<span v-html='scope.row.fAsset'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="行次" prop='fRowNumberLeft' width="50"></el-table-column>
				<el-table-column align="center" label="年初数" prop="fYearBeforeLeft"></el-table-column>
				<el-table-column align="center" label="期末数" prop="fYearEndLeft"></el-table-column>
				<el-table-column align="" label="负债和所有者权益" prop="fLiabilitiesAndOwnersEquity">
					<template slot-scope="scope">
						<span v-html='scope.row.fLiabilitiesAndOwnersEquity'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="行次" prop='fRowNumberRight' width="50"></el-table-column>
				<el-table-column align="center" label="年初数" prop="fYearBeforeRight"></el-table-column>
				<el-table-column align="center" label="期末数" prop="fYearEndRight"></el-table-column>

			</el-table>

		</div>

		<div class='main_contain' v-if="uploadData.type == '利润表'">
			<h5>利润表</h5>
			<p>单位名称：{{fBrNo}}
				<el-button type='text' size="mini" :disabled="tableData1.length <= 0" @click='voucherGather_print1()' style='float:right'>打印</el-button>
				<el-button type='text' size="mini" :disabled="tableData1.length <= 0" @click='exportExcel2()' style='float:right;margin-right: 12px;'>导出</el-button>
			</p>

			<el-table :data="tableData1" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading' v-if='customerType == 1'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="" label="项目">
					<template slot-scope="scope">
						<span v-html='scope.row.fProjectName'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="行次" prop='fRowNumber' width="50"></el-table-column>
				<el-table-column align="center" label="本月累计数" prop="fAmount">
					<template slot-scope="scope">
						<span v-html='scope.row.fAmount'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="本年累计数" prop="fYtdAmount">
					<template slot-scope="scope">
						<span v-html='scope.row.fYtdAmount'></span>
					</template>
				</el-table-column>

			</el-table>

			<el-table :data="tableData1" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading' v-if='customerType == 2'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="" label="项">
					<template slot-scope="scope">
						<span v-html='scope.row.rowName'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="行次" prop='rowNum' width="50"></el-table-column>
				<el-table-column align="center" label="本月非限定性" prop="monthUnrest">
					<template slot-scope="scope">
						<span v-html='scope.row.monthUnrest'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="本月限定性" prop="monthRest">
					<template slot-scope="scope">
						<span v-html='scope.row.monthRest'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="本月合计" prop="monthTotal">
					<template slot-scope="scope">
						<span v-html='scope.row.monthTotal'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="本年非限定性" prop="yearUnrest">
					<template slot-scope="scope">
						<span v-html='scope.row.yearUnrest'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="本年限定性" prop="yearRest">
					<template slot-scope="scope">
						<span v-html='scope.row.yearRest'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="本年合计" prop="yearTotal">
					<template slot-scope="scope">
						<span v-html='scope.row.yearTotal'></span>
					</template>
				</el-table-column>

			</el-table>


		</div>

		<div class='main_contain' v-if="uploadData.type == '总分类账'">
			<h5>总账</h5>
			<p>单位名称：{{fBrNo}}
				<el-button type='text' size="mini" :disabled="tableData3.length <= 0" @click='voucherGather_print3()' style='float:right'>打印</el-button>
				<el-button type='text' size="mini" :disabled="tableData3.length <= 0" @click='exportExcel3()' style='float:right;margin-right: 12px;'>导出</el-button>
			</p>

			<el-table :data="tableData3" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="科目代码" prop="account_fNumber"></el-table-column>
				<el-table-column align="center" label="科目名称" prop='account_fName'></el-table-column>
				<el-table-column align="center" label="年份" prop="fyear"></el-table-column>
				<el-table-column align="center" label="期间" prop="fperiod"></el-table-column>
				<el-table-column align="center" label="摘要" prop="fexplanation"></el-table-column>
				<el-table-column align="center" label="借方" prop="fdebit_string"></el-table-column>
				<el-table-column align="center" label="贷方" prop="fcredit_string"></el-table-column>
				<el-table-column align="center" label="借贷方向" prop="fdirection"></el-table-column>
				<el-table-column align="center" label="余额" prop="fbalance"></el-table-column>
			</el-table>
			<!-- <p style="text-align: right;margin-top: 20px;"><span style="margin-right: 20px;">凭证数：{{tvoucherCount}}</span> <span>附件数：{{fattachments}}</span></p> -->
		</div>


		<div class='main_contain' v-if="uploadData.type == '明细分类账'">
			<h5>明细账</h5>
			<p style="height: 30px;">单位名称：{{fBrNo}}
				<el-button type='text' size="mini" :disabled="tableData4.length <= 0" @click='subsidiaryLedger_printSelect()' style='float:right'>批量打印</el-button>
				<el-button type='text' size="mini" :disabled="tableData4.length <= 0" @click='subsidiaryLedger_printAlone()' style='float:right;margin-right: 12px;'>打印</el-button>
				<el-button type='text' size="mini" :disabled="tableData4.length <= 0" @click='exportExcel4()' style='float:right;margin-right: 12px;'>导出</el-button>
			</p>
			<p>当前科目：{{tableData4[0]?tableData4[0].account_fNumber + '--' + tableData4[0].account_fName:''}}
				<!-- <el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='voucherGather_print()' style='float:right'>打印</el-button> -->
				<el-button type='text' size="mini" @click='next()' style='float:right'>下一个</el-button>
				<el-button type='text' size="mini" @click='pre()' style='float:right;margin-right: 10px;'>上一个</el-button>

			</p>

			<el-table :data="tableData4" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->

				<el-table-column align="center" label="日期" prop='fdate_string'></el-table-column>
				<el-table-column align="center" label="凭证字号" prop='fnumber_string'></el-table-column>
				<el-table-column align="center" label="摘要" prop="fexplanation"></el-table-column>
				<el-table-column align="center" label="对方科目" prop="faccount_string" width="400"></el-table-column>
				<el-table-column align="center" label="借方金额" prop="fdebit_string"></el-table-column>
				<el-table-column align="center" label="贷方金额" prop="fcredit_string"></el-table-column>
				<el-table-column align="center" label="借贷方向" prop="fdirection"></el-table-column>
				<el-table-column align="center" label="余额" prop="fbalance"></el-table-column>
			</el-table>
			<!-- <p style="text-align: right;margin-top: 20px;"><span style="margin-right: 20px;">凭证数：{{tvoucherCount}}</span> <span>附件数：{{fattachments}}</span></p> -->
		</div>


	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				fBrNo: '',
				fYearStart: '',
				fPeriodStart: '',
				fYearEnd: '',
				fPeriodEnd: '',
				fNumberStart: '',
				fNumberEnd: '',
				fLevel: '',
				flagAmount: '',
				flagZero: '',
				flagUnPosted: '',
				flagUnTrans: '',
				custList: [],
				fBrNo: '',
				fYear: '',
				fPeriod: '',
				loading: false,
				value4: this.formatTimeToStr(new Date(), 'yyyy-MM'),
				selectNum: new Date().getMonth(),
				percentage: 0,
				uploadData: {
					fBrNo: '',
					type: "资产负债表",

					fYearStart: '',
					fPeriodStart: '',
					fYearEnd: '',
					fPeriodEnd: '',
					fNumberStart: '',
					fNumberEnd: '',
					fLevel: 1,
					flagZero: 0,
					flagUnPosted: 0,
					flagAmount: 0,
					flagUnTrans: 0,


					fBrNo: '',
					fYearStart: '',
					fPeriodStart: '',
					fYearEnd: '',
					fPeriodEnd: '',
					fNumberStart: '',
					fNumberEnd: '',
					fLevel: 1,
					flagAmount: 0,
					flagZero: 0,
					flagUnPosted: 0,
					flagUnTrans1: 2,

				},
				customerId: 0,
				tableData: [],
				tableData1: [],
				tableData3: [],
				tableData4: [],

				arr: [],
				customerName: '',
				tree3: [],
				treeList3: [],
				props1: {
					value: 'fnumber',
					label: 'full',
					children: 'children'
				},
				customerType: null,
				truelabel: 1,
				falselabel: 0,
				truelabel1: 1,
				falselabel1: 2,
			}
		},
		components: {},
		methods: {
			clear() {
				this.tableData = [];
				this.tableData1 = [];
				this.tableData3 = [];
			},

			search1() {
				this.fBrNo = this.uploadData.fBrNo;
				this.fYear = this.uploadData.fYear;
				this.fPeriod = this.uploadData.fPeriod;
				this.queryPage()
			},

			search2() {
				this.fBrNo = this.uploadData.fBrNo;
				this.fYear = this.uploadData.fYear;
				this.fPeriod = this.uploadData.fPeriod;
				this.queryPage2()
			},

			search3() {
				this.fBrNo = this.uploadData.fBrNo;
				this.fYearStart = this.uploadData.fYearStart;
				this.fPeriodStart = this.uploadData.fPeriodStart;
				this.fYearEnd = this.uploadData.fYearEnd;
				this.fPeriodEnd = this.uploadData.fPeriodEnd;
				this.fNumberStart = this.uploadData.fNumberStart.length > 0 ? this.uploadData.fNumberStart[this.uploadData.fNumberStart
					.length - 1] : '';
				this.fNumberEnd = this.uploadData.fNumberEnd.length > 0 ? this.uploadData.fNumberEnd[this.uploadData.fNumberEnd.length -
					1] : '';
				this.fLevel = this.uploadData.fLevel;
				this.flagZero = this.uploadData.flagZero;
				this.flagUnPosted = this.uploadData.flagUnPosted;
				this.flagAmount = this.uploadData.flagAmount;
				this.flagUnTrans = this.uploadData.flagUnTrans;
				this.queryPage3()
			},

			search4() {
				this.fBrNo = this.uploadData.fBrNo;
				this.fYearStart = this.uploadData.fYearStart;
				this.fPeriodStart = this.uploadData.fPeriodStart;
				this.fYearEnd = this.uploadData.fYearEnd;
				this.fPeriodEnd = this.uploadData.fPeriodEnd;
				this.fNumberStart = this.uploadData.fNumberStart.length > 0 ? this.uploadData.fNumberStart[this.uploadData.fNumberStart
					.length - 1] : '';
				this.fNumberEnd = this.uploadData.fNumberEnd.length > 0 ? this.uploadData.fNumberEnd[this.uploadData.fNumberEnd.length -
					1] : '';
				this.fLevel = this.uploadData.fLevel;
				this.flagAmount = this.uploadData.flagAmount;
				this.flagZero = this.uploadData.flagZero;
				this.flagUnPosted = this.uploadData.flagUnPosted;
				this.flagUnTrans1 = this.uploadData.flagUnTrans1;

				this.queryPage4()
			},

			queryPage() {
				this.loading = true;
				let params = {
					"fBrNo": this.fBrNo,
					"fYear": this.fYear,
					"fPeriod": this.fPeriod,
					"customerType": this.customerType
				};
				this.axios.post('/perTaxToolTwo/e9/sheet/getBalanceSheets', params)
					// this.axios.post('/miaoxing/queryPage', params)
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

			queryPage2() {
				this.loading = true;
				let params = {
					"fBrNo": this.fBrNo,
					"fYear": this.fYear,
					"fPeriod": this.fPeriod,
					"customerType": this.customerType
				};
				if (this.customerType == 1) {
					var url = '/perTaxToolTwo/e9/sheet/getProfitAndLosses';
				} else {
					var url = '/perTaxToolTwo/e9/sheet/getProfitAndLossesMF';
				}
				this.axios.post(url, params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData1 = res.data.data;

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

			queryPage3() {
				this.loading = true;
				let params = {
					fBrNo: this.fBrNo,
					fYearStart: this.fYearStart,
					fPeriodStart: this.fPeriodStart,
					fYearEnd: this.fYearEnd,
					fPeriodEnd: this.fPeriodEnd,
					fNumberStart: this.fNumberStart,
					fNumberEnd: this.fNumberEnd,
					fLevel: this.fLevel,
					flagZero: this.flagZero,
					flagUnPosted: this.flagUnPosted,
					flagAmount: this.flagAmount,
					flagUnTrans: this.flagUnTrans,
				};
				this.arr = [];
				this.axios.post('/perTaxToolTwo/e9/tBalance/getGeneralLedgerList', this.qs.stringify(params), {
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData3 = res.data.data;

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

			queryPage4() {
				this.loading = true;
				let params = {
					fBrNo: this.fBrNo,
					fYearStart: this.fYearStart,
					fPeriodStart: this.fPeriodStart,
					fYearEnd: this.fYearEnd,
					fPeriodEnd: this.fPeriodEnd,
					fNumberStart: this.fNumberStart,
					fNumberEnd: this.fNumberEnd,
					fLevel: this.fLevel,
					flagUnPosted: this.flagUnPosted,
					flagZero: this.flagZero,
				};
				this.axios.post('/perTaxToolTwo/e9/tBalance/getSubsidiaryLedger', this.qs.stringify(params), {
						// this.axios.post('/miaoxing/queryPage', params)
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData4 = res.data.data;

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
					'&fPeriod=' + this.fPeriod + '&customerType=' + this.customerType;


			},
			exportExcel2() {
				window.location.href = '/perTaxToolTwo/e9/sheet/exportProfitAndLoss?fBrNo=' + this.fBrNo + '&fYear=' + this.fYear +
					'&fPeriod=' + this.fPeriod + '&customerType=' + this.customerType;


			},
			exportExcel3() {
				window.location.href = '/perTaxToolTwo/e9/tBalance/exportGenaralLedgerList?fBrNo=' + this.fBrNo + '&fYearStart=' +
					this.fYearStart + '&fPeriodStart=' + this.fPeriodStart + '&fYearEnd=' + this.fYearEnd + '&fPeriodEnd=' + this.fPeriodEnd +
					'&fLevel=' + this.fLevel +
					'&flagZero=' + this.flagZero + '&flagUnPosted=' + this.flagUnPosted + '&flagAmount=' + this.flagAmount +
					'&flagUnTrans=' + this.flagUnTrans + '&fNumberStart=' + this.fNumberStart + '&fNumberEnd=' + this.fNumberEnd


			},
			exportExcel4() {
				window.location.href = '/perTaxToolTwo/e9/tBalance/exportSubsidiaryLedgerList?fBrNo=' + this.fBrNo + '&fYearStart=' +
					this.fYearStart + '&fPeriodStart=' + this.fPeriodStart + '&fYearEnd=' + this.fYearEnd + '&fPeriodEnd=' + this.fPeriodEnd +
					'&fLevel=' + this.fLevel +
					'&flagUnposted=' + this.flagUnPosted + '&flagUnTrans=' + this.flagUnTrans + '&fNumberStart=' + this.fNumberStart +
					'&fNumberEnd=' + this.fNumberEnd


			},
			pre() {
				this.loading = true;
				let params = {
					fBrNo: this.fBrNo,
					fNumber: this.tableData4[0].account_fNumber,
					fYearStart: this.fYearStart,
					fPeriodStart: this.fPeriodStart,
					fYearEnd: this.fYearEnd,
					fPeriodEnd: this.fPeriodEnd,
					fLevel: this.fLevel,
					flagUnPosted: this.flagUnPosted,
					flagUnTrans: this.flagUnTrans,
				};
				this.axios.post('/perTaxToolTwo/e9/tBalance/getSubsidiaryLedgerPre', this.qs.stringify(params))

					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData4 = res.data.data;

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
			next() {
				this.loading = true;
				let params = {
					fBrNo: this.fBrNo,
					fNumber: this.tableData4[0].account_fNumber,
					fYearStart: this.fYearStart,
					fPeriodStart: this.fPeriodStart,
					fYearEnd: this.fYearEnd,
					fPeriodEnd: this.fPeriodEnd,
					fLevel: this.fLevel,
					flagUnPosted: this.flagUnPosted,
					flagUnTrans: this.flagUnTrans,
				};
				this.axios.post('/perTaxToolTwo/e9/tBalance/getSubsidiaryLedgerNext', this.qs.stringify(params))

					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData4 = res.data.data;

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
			common_getPeriod(fYearStart, fPeriodStart, fYearEnd, fPeriodEnd) {
				var ss = "";
				if (fYearEnd == fYearStart) {
					ss = "期间  " + fYearStart + "年第" + fPeriodStart + "期至" + "第" + fPeriodEnd + "期";
					if (fPeriodStart == fPeriodEnd) {
						ss = "期间:" + fYearStart + "年第" + fPeriodStart + "期 ";
					}
				} else {
					ss = "期间  " + fYearStart + "年第" + fPeriodStart + "期至" + fYearEnd + "年第" + fPeriodEnd + "期";

				}
				return ss;
			},
			string_isNull(str) {
				if (str == null) {
					str = "&nbsp&nbsp&nbsp&nbsp";
				}
				return str;
			},
			voucherGather_print() {
				var LODOP = this.getLodop(document.getElementById('LODOP_OB'), document
					.getElementById('LODOP_EM'));
				if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) return;
				//LODOP.PRINT_INITA("资产负债表打印");
				LODOP.PRINT_INITA(5, 0, 800, 600, "ZCFZBDY"); // 资产负债表打印
				LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");

				LODOP.ADD_PRINT_TEXT(40, 300, 175, 30, "资产负债表");
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
				LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
				LODOP.SET_PRINT_STYLE("FontSize", 9);
				//var fBrNo = $("#vouchers_CustomerName_combobox").combobox('getText');
				LODOP.ADD_PRINT_TEXT(90, 60, 400, 20, "编制单位：" + this.fBrNo);
				LODOP.ADD_PRINT_TEXT(70, 660, 70, 20, "第1页");
				LODOP.ADD_PRINT_TEXT(90, 650, 70, 20, "单位：元");
				//var printDate=getCurrentDate()	;
				var fYear = this.fYear;
				var fPeriod = this.fPeriod;
				var printDate = this.getCurrentPeriodDate(fYear, fPeriod);
				LODOP.ADD_PRINT_TEXT(70, 330, 175, 20, printDate);
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				this.balanceSheet_lodopCommon(LODOP);
				LODOP.SET_PRINT_STYLE("FontSize", 8);
				LODOP.ADD_PRINT_TEXT(1030, 60, 100, 20, "单位负责人：");
				LODOP.SET_PRINT_STYLE("FontSize", 8);
				LODOP.ADD_PRINT_TEXT(1030, 240, 450, 20, "财务负责人：");
				LODOP.SET_PRINT_STYLE("FontSize", 8);
				LODOP.ADD_PRINT_TEXT(1030, 440, 450, 20, "复核：");
				LODOP.SET_PRINT_STYLE("FontSize", 8);
				LODOP.ADD_PRINT_TEXT(1030, 640, 450, 20, "制表：");
				LODOP.PREVIEW();
			},
			balanceSheet_lodopCommon(LODOP) {
				var var_table = "";
				var var_body = "";
				var var_head = "<table  cellspacing='0'  border='1' " +
					" style='border-collapse:collapse;border-color: Black;border-bottom-color: Black;border-right-color: Black; font-size: 9pt; font-family: '宋体';' >";
				var_head += "<thead><tr >" +
					"<td scope='col'  style='width:150px;' align='center'  height='23' valign='middle'>资       产</td>" +
					"<td scope='col'   style='width:25px;' align='center'   style='font-size: 8pt;'  height='23' valign='middle'>行次</td>" +
					"<td scope='col'  style='width:75px;'  align='center'  height='23' valign='middle'>年初数</td>" +
					"<td scope='col'  style='width:75px;'  align='center'  height='23' valign='middle'>期末数</td>" +
					"<td scope='col'  style='width:150px;'  align='center' height='23' valign='middle'>负债和所有者权益</td>" +
					"<td scope='col'  style='width:40px;' align='center'   style='font-size: 8pt;'  height='20' valign='middle'>行次</td>" +
					"<td scope='col'  style='width:75px;' align='center'  height='23' valign='middle'>年初数</td>" +
					"<td scope='col'  style='width:75px;' align='center'  height='23' valign='middle'>期末数</td></tr></thead><tbody>";
				var var_foot = "</tbody><tfoot></tfoot></table>";
				var rows = this.tableData;
				for (var i = 0; i < rows.length; i++) {
					var row = rows[i];
					var fAsset = this.string_isNull(row.fAsset);
					var fRowNumberLeft = this.string_isNull(row.fRowNumberLeft);
					var fYearBeforeLeft = this.string_isNull(row.fYearBeforeLeft);
					var fYearEndLeft = this.string_isNull(row.fYearEndLeft);
					var fLiabilitiesAndOwnersEquity = this.string_isNull(row.fLiabilitiesAndOwnersEquity);
					var fRowNumberRight = this.string_isNull(row.fRowNumberRight);
					var fYearBeforeRight = this.string_isNull(row.fYearBeforeRight);
					var fYearEndRight = this.string_isNull(row.fYearEndRight);

					var_body += "<tr >";
					if (fRowNumberLeft == "21" || fRowNumberLeft == "60" || fRowNumberLeft == "42") {
						var_body += "<td style='width:150px;' align='left'   style='font-size: 7pt;'  height='20' valign='middle'>" +
							fAsset + "</td>";
					} else {
						var_body += "<td style='width:150px;' align='left'  height='20' valign='middle'>" + fAsset + "</td>";
					}

					var_body += "<td style='width:25px;' align='center'   style='font-size: 8pt;'  height='20' valign='middle'>" +
						fRowNumberLeft + "</td>";
					var_body += "<td style='width:75px;' align='center'  height='20' valign='middle'>" + fYearBeforeLeft + "</td>";
					if (fYearEndLeft.length > 10) {
						var_body += "<td style='width:75px;' align='center'  height='20' valign='middle'   style='font-size: 8pt;' >" +
							fYearEndLeft + "</td>";
					} else {
						var_body += "<td style='width:75px;' align='center'  height='20' valign='middle'>" + fYearEndLeft + "</td>";
					}


					if (fRowNumberRight == "135") {
						var_body += "<td style='width:150px;' align='left'   style='font-size: 5pt;'  height='20' valign='middle'>" +
							fLiabilitiesAndOwnersEquity + "</td>";

					} else if (fRowNumberRight == "117" || fRowNumberRight == "122" || fRowNumberRight == "86") {
						var_body += "<td style='width:150px;' align='left'   style='font-size: 7pt;'  height='20' valign='middle'>" +
							fLiabilitiesAndOwnersEquity + "</td>";
					} else {
						var_body += "<td style='width:150px;' align='left'  height='20' valign='middle'>" + fLiabilitiesAndOwnersEquity +
							"</td>";
					}

					var_body += "<td style='width:25px;' align='center'   style='font-size: 8pt;'  height='20' valign='middle'>" +
						fRowNumberRight + "</td>";
					var_body += "<td style='width:75px;' align='center'  height='20' valign='middle'>" + fYearBeforeRight + "</td>";
					if (fYearEndRight.length > 10) {
						var_body += "<td style='width:75px;' align='center'   style='font-size: 8pt;'  height='20' valign='middle'>" +
							fYearEndRight + "</td>";
					} else {
						var_body += "<td style='width:75px;' align='center'  height='20' valign='middle'>" + fYearEndRight + "</td>";
					}


					var_body += "</tr>";
				}
				var_table = var_head + var_body + var_foot;
				LODOP.SET_PRINT_STYLE("FontSize", 9);
				LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
				LODOP.ADD_PRINT_TABLE(110, 60, 650, 897, var_table);
			},
			//====判断是否需要安装CLodop云打印服务器:====

			voucherGather_print1() {
				var LODOP = this.getLodop(document.getElementById('LODOP_OB'), document
					.getElementById('LODOP_EM'));
				if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) return;
				//LODOP.PRINT_INITA("利润表打印");
				LODOP.PRINT_INITA(5, 0, 800, 600, "LRBDY"); //利润表打印
				LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
				LODOP.SET_PRINT_STYLE("FontSize", 11);

				LODOP.ADD_PRINT_TEXT(40, 300, 175, 30, "利  润  表");
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
				LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
				LODOP.ADD_PRINT_TEXT(90, 60, 450, 20, "编制单位：" + this.fBrNo);
				// LODOP.ADD_PRINT_TEXT(70, 85, 300, 20, fBrNo);
				var fYear = this.fYear;
				var fPeriod = this.fPeriod;
				var printDate = this.getCurrentPeriodDate(fYear, fPeriod);
				LODOP.ADD_PRINT_TEXT(70, 310, 175, 20, printDate);
				LODOP.ADD_PRINT_TEXT(70, 640, 70, 20, "第1页");
				LODOP.ADD_PRINT_TEXT(90, 620, 70, 20, "单位：元");
				// if ("2" == customerType) {
				// 	this.profitAndLoss_lodopCommonMF(LODOP);
				// } else {
				this.profitAndLoss_lodopCommon(LODOP);
				// }
				LODOP.SET_PRINT_STYLE("FontSize", 9);
				LODOP.ADD_PRINT_TEXT(990, 60, 100, 20, "单位负责人：");
				LODOP.SET_PRINT_STYLE("FontSize", 9);
				LODOP.ADD_PRINT_TEXT(990, 240, 450, 20, "财务负责人：");
				LODOP.SET_PRINT_STYLE("FontSize", 9);
				LODOP.ADD_PRINT_TEXT(990, 440, 450, 20, "复核：");
				LODOP.SET_PRINT_STYLE("FontSize", 9);
				LODOP.ADD_PRINT_TEXT(990, 640, 450, 20, "制表：");
				LODOP.SET_PRINT_STYLE("FontSize", 9);
				LODOP.PREVIEW();
			},

			profitAndLoss_lodopCommon(LODOP) {
				var var_table = "";
				var var_body = "";
				var var_head =
					"<table  border='1'  style='border-collapse:collapse;border-color: Black;border-bottom-color: Black;border-right-color: Black; font-size: 13pt; font-family: '宋体';'>";
				var_head += "<thead><tr ><td   style='width: 300px;' align='center'   height='28' valign='middle'>项      目</td>" +
					"<td  style='width: 50px;'  align='center'   height='28' valign='middle'>行次</td>" +
					"<td   style='width: 140px;'  align='center'   height='28' valign='middle'>本月累计数</td>" +
					"<td   style='width: 140px;'  align='center'   height='28' valign='middle'>本年累计数</td></tr></thead><tbody>";

				var var_foot = "</tbody></table>";
				var rows = this.tableData1;
				for (var i = 0; i < rows.length; i++) {
					var row = rows[i];
					var fProjectName = this.string_isNull(row.fProjectName);
					var fRowNumber = this.string_isNull(row.fRowNumber);
					var fAmount = this.string_isNull(row.fAmount);
					var fYtdAmount = this.string_isNull(row.fYtdAmount);

					var_body += "<tr >";
					if (row.fRowNumber == "11") {
						var_body += "<td style='width:300px;' align='left'   height='25' valign='middle'  style='font-size: 10pt;'>" +
							fProjectName + "</td>";
					} else if (fProjectName.length > 18) {
						var_body += "<td style='width:300px;' align='left'   height='25' valign='middle'  style='font-size: 11pt;'>" +
							fProjectName + "</td>";
					} else if (fProjectName.length > 15) {
						var_body += "<td style='width:300px;' align='left'   height='25' valign='middle'  style='font-size: 12pt;'>" +
							fProjectName + "</td>";
					} else {
						var_body += "<td style='width:300px;' align='left'   height='25' valign='middle'>" + fProjectName + "</td>";
					}
					var_body += "<td style='width:50px;' align='center'  height='25' valign='middle'>" + fRowNumber + "</td>";
					var_body += "<td style='width:140px;' align='center'  height='25' valign='middle'>" + fAmount + "</td>";
					var_body += "<td style='width:140px;' align='center'  height='25' valign='middle'>" + fYtdAmount + "</td>";
					var_body += "</tr>";
				}
				var_table = var_head + var_body + var_foot;

				LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
				LODOP.ADD_PRINT_TABLE(110, 60, 650, 870, var_table);
			},


			voucherGather_print3() {

				var LODOP = this.getLodop(document.getElementById('LODOP_OB'), document
					.getElementById('LODOP_EM'));

				if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) return;
				//LODOP.PRINT_INITA("总分类账打印");
				LODOP.PRINT_INITA(5, 0, 800, 600, "ZFLZDY"); // 总分类账打印

				LODOP.SET_PRINT_STYLE("FontSize", 10);
				LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");

				LODOP.ADD_PRINT_TEXT(30, 452, 175, 30, "总 分 类 账");
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

				LODOP.ADD_PRINT_HTM(60, 800, 200, 25, "页号 " +
					"<font  format='##'><span tdata='pageNO'>##</span><span tdata='pageCount'>/##</span></font>");
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 10);
				LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1); //循环上一命令（页码）
				var fYearStart = this.fYearStart;
				var fPeriodStart = this.fPeriodStart;
				var fYearEnd = this.fYearEnd;
				var fPeriodEnd = this.fPeriodEnd;
				var ss;
				if (fYearEnd == fYearStart) {
					ss = "期间  " + fYearStart + "年第" + fPeriodStart + "期至" + "第" + fPeriodEnd + "期";
					if (fPeriodStart == fPeriodEnd) {
						ss = "期间:" + fYearStart + "年第" + fPeriodStart + "期 ";
					}
				} else {
					ss = "期间  " + fYearStart + "年第" + fPeriodStart + "期至" + fYearEnd + "年第" + fPeriodEnd + "期";

				}
				var printDate = this.getCurrentDate();

				//border-color: Black;
				var var_table = "";
				var var_body = "";
				var var_head =
					"<table  cellspacing='0'  border='1'  style='border-collapse:collapse;border-color: Black;border-right-color: Black; font-size: 9pt;font-family:'宋体';' >";
				var_head += "<thead>" +
					"<tr ><td scope='col'  style='width: 40px;' align='center'>月</td>" +
					"<td scope='col'  style='width: 40px;'  align='center'>日</td>" +
					"<td scope='col' style='width: 200px;'  align='center'>科 目 名 称</td>" +
					"<td scope='col'  style='width: 300px;'  align='center'>摘            要</td>" +
					"<td scope='col'   style='width: 100px;'  align='center'>借    方</td>" +
					"<td scope='col' style='width: 100px;'  align='center'>贷    方</td>" +
					"<td scope='col' style='width: 40px;'  align='center'>方向</td>" +
					"<td scope='col' style='width: 100px;' align='center'>余      额</td></tr></thead><tbody>";
				var var_foot = "</tbody></table>";
				var rows = this.tableData3;
				var count = 0;
				for (var i = 0; i < rows.length; i++) {
					var account_fNumber = this.string_isNull(this.tableData3[i].account_fNumber);
					var account_fName = this.string_isNull(this.tableData3[i].account_fName);

					var fExplanation = this.string_isNull(this.tableData3[i].fexplanation);
					var fDebit_string = this.string_isNull(this.tableData3[i].fdebit_string);
					var fCredit_string = this.string_isNull(this.tableData3[i].fcredit_string);
					var fDirection = this.string_isNull(this.tableData3[i].fdirection);
					var fBalance = this.string_isNull(this.tableData3[i].fbalance);
					var fYear = +this.string_isNull(this.tableData3[i].fyear);
					var fPeriod1 = "";
					var date = "";
					if (fExplanation == "期初余额" || fExplanation == "本期合计") {
						fPeriod1 = +this.string_isNull(this.tableData3[i].fperiod);
						date = this.getLastDay(fYear, fPeriod1);
					}

					var_body += "<tr >";
					var_body += "<td style='width:40px;' align='center'>" + fPeriod1 + "</td>";
					var_body += "<td style='width:40px;' align='center'>" + date + "</td>";
					var_body += "<td style='width:200px;' align='left'>" + account_fName + "</td>";
					var_body += "<td style='width:300px;' align='left'>" + fExplanation + "</td>";
					var_body += "<td style='width:100px;' align='right'>" + fDebit_string + "</td>";
					var_body += "<td style='width:100px;' align='right'>" + fCredit_string + "</td>";
					var_body += "<td style='width:40px;' align='center'>" + fDirection + "</td>";
					var_body += "<td style='width:100px;' align='right'>" + fBalance + "</td>";
					var_body += "</tr>";

					count++;

					if (count > 29 && i < (rows.length - 1)) {
						LODOP.ADD_PRINT_TEXT(60, 60, 200, 25, "币种  人民币");
						LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
						LODOP.ADD_PRINT_TEXT(40, 800, 250, 20, ss);
						LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
						LODOP.ADD_PRINT_TEXT(655, 60, 500, 25, "核算单位（Unit）  " + this.fBrNo);
						LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
						// LODOP.ADD_PRINT_TEXT(655, 750, 200, 25,"打印日期   "+ printDate);
						//	 LODOP.SET_PRINT_STYLEA(0,"Bold",1);
						var_table = var_head + var_body + var_foot;
						LODOP.ADD_PRINT_TABLE(85, 60, 960, 570, var_table);
						LODOP.NewPageA();
						count = 0;
						var_body = "";
						continue;
					}
					if (i == (rows.length - 1)) {
						if (count < 30) {
							for (var s = count; s < 30; s++) {
								var_body += "<tr >";
								var_body += "<td style='width:40px;' align='center'>" + " &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:40px;' align='center'>" + " &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:200px;' align='left'>" + " &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:300px;' align='left'>" + " &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:100px;' align='right'>" + " &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:100px;' align='right'>" + " &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:40px;' align='center'>" + " &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:100px;' align='right'>" + " &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "</tr>";
							}
						}
						LODOP.ADD_PRINT_TEXT(60, 60, 200, 25, "币种  人民币");
						LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
						LODOP.ADD_PRINT_TEXT(40, 800, 250, 20, ss);
						LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
						LODOP.ADD_PRINT_TEXT(655, 60, 500, 25, "核算单位  " + this.fBrNo);
						LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
						// LODOP.ADD_PRINT_TEXT(655, 750, 200, 25,"打印日期   "+ printDate);
						// LODOP.SET_PRINT_STYLEA(0,"Bold",1);
						var_table = var_head + var_body + var_foot;
						LODOP.ADD_PRINT_TABLE(85, 60, 960, 550, var_table);
						count = 0;
						var_body = "";

					}
				}
				LODOP.PREVIEW();
			},

			subsidiaryLedger_printAlone() {
				var printDate = this.getCurrentDate();
				/* 条件：会计期间 */
				var fYearStart = this.fYearStart;
				var fPeriodStart = this.fPeriodStart;
				var fYearEnd = this.fYearEnd;
				var fPeriodEnd = this.fPeriodEnd;
				var ss = this.common_getPeriod(fYearStart, fPeriodStart, fYearEnd, fPeriodEnd);
				var rows = this.tableData4;
				var count = 0;
				var var_table = "";
				var var_body = "";
				var var_head =
					"<table  cellspacing='0'  border='1'  style='border-collapse:collapse;border-color:Black;border-right-color:Black;font-family:'宋体';' >";
				var_head += "<thead>" +
					"<tr ><td scope='col'  style='width: 40px;font-size: 9pt;'  align='center'>月<br>M</td>" +
					"<td scope='col' style='width: 40px;font-size: 9pt;'  align='center'>日<br>D</td>" +
					"<td scope='col'  style='width: 80px;font-size: 9pt;'  align='center'>凭证号<br>Voucher</td>" +
					"<td scope='col'  style='width: 200px;font-size: 9pt;'  align='center'>摘                            要<br>Explanation</td>" +
					"<td scope='col'   style='width: 200px;font-size: 9pt;'  align='center'>对方科目<br>Corresoonding Accounts</td>" +
					"<td scope='col' style='width: 100px;font-size: 9pt;'  align='center'>借方<br>Debit</td>" +
					"<td scope='col' style='width: 100px;font-size: 9pt;'  align='center'>贷方<br>Credit</td>" +
					"<td scope='col' style='width: 40px;font-size: 9pt;'  align='center'>借贷方向</td>" +
					"<td scope='col' style='width: 100px;font-size: 9pt;'   align='center'>余额<br>Balance</td></tr></thead><tbody>";
				var var_foot = "</tbody></table>";

				var LODOP = this.getLodop(document.getElementById('LODOP_OB'), document
					.getElementById('LODOP_EM'));
				/* var LODOP = getCLodop(); */
				if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined"))
					return;
				// LODOP.PRINT_INITA("明细分类账打印");
				LODOP.PRINT_INITA(5, 0, 800, 600, "MXFLZDY"); // 明细分类账打印

				LODOP.SET_PRINT_STYLE("FontSize", 11);
				LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");
				LODOP.ADD_PRINT_TEXTA("text01", 20, 452, 175, 30, "明  细  账");
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
				LODOP.ADD_PRINT_TEXTA("text02", 65, 60, 100, 20, "币种：人民币");
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				var subsidiaryLedger_accountfName = rows[0].account_fName;
				LODOP.ADD_PRINT_TEXTA("text06", 85, 60, 600, 20, "科目：" +
					subsidiaryLedger_accountfName);
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				LODOP.ADD_PRINT_TEXTA("text07", 85, 750, 300, 20, ss);
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				// LODOP.ADD_PRINT_TEXTA("text07", 85, 60, 400, 20, "客户名称："+fBrNo);
				LODOP.ADD_PRINT_TEXTA("text08", 660, 60, 800, 25, "核算单位（Unit）" + this.fBrNo);
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);

				var row = 0;
				var page = 0;
				var sum = 1;
				for (var i = 0; i < rows.length; i++) {
					row++;
					if (row % 25 == 0) {
						sum++;
						row = 0;
						continue;
					}
				}
				row = 0;
				for (var i = 0; i < rows.length; i++) {
					var balance = rows[i];
					var fNumber_string = this.string_isNull(balance.fnumber_string);
					var fExplanation = this.string_isNull(balance.fexplanation);
					var fAccount_string = this.string_isNull(balance.faccount_string);
					var fDebit_string = this.string_isNull(balance.fdebit_string);
					var fCredit_string = this.string_isNull(balance.fcredit_string);
					var fDirection = this.string_isNull(balance.fdirection);
					var fBalance = this.string_isNull(balance.fbalance);
					var fYear = +this.string_isNull(balance.fyear);
					var fPeriod = +this.string_isNull(balance.fperiod);
					var date = this.getLastDay(fYear, fPeriod);
					var length_fAccount_string = this.getStrLength(fAccount_string); // fNumber_string.length
					var length_fExplanation = this.getStrLength(fExplanation);
					var_body += "<tr >";
					var_body += "<td style='width:40px;font-size: 9pt;' align='center'>" +
						fPeriod + "</td>";
					var_body += "<td style='width:40px;font-size: 9pt;' align='center'>" +
						date + "</td>";
					var_body += "<td style='width:80px;font-size: 9pt;' align='left'>" +
						fNumber_string + "</td>";

					if (length_fExplanation > 40) {
						var_body += "<td style='width:200px;font-size: 6pt;'  align='left'>" +
							fExplanation + "</td>";
					} else if (length_fExplanation > 30) {
						var_body += "<td style='width:200px;font-size: 7pt;'  align='left'>" +
							fExplanation + "</td>";
					} else {
						var_body += "<td style='width:200px;font-size: 9pt;'  align='left'>" +
							fExplanation + "</td>";
					}
					if (length_fAccount_string > 47) {
						var_body += "<td style='width:200px;font-size: 5pt;' align='left'>" +
							fAccount_string + "</td>";
					} else if (length_fAccount_string > 40) {
						var_body += "<td style='width:200px;font-size: 6pt;' align='left'>" +
							fAccount_string + "</td>";
					} else if (length_fAccount_string > 30) {
						var_body += "<td style='width:200px;font-size: 7pt;' align='left'>" +
							fAccount_string + "</td>";
					} else {
						var_body += "<td style='width:200px;font-size: 9pt;' align='left'>" +
							fAccount_string + "</td>";
					}

					var_body += "<td style='width:100px;font-size: 9pt;' align='right'>" +
						fDebit_string + "</td>";
					var_body += "<td style='width:100px;font-size: 9pt;' align='right'>" +
						fCredit_string + "</td>";
					var_body += "<td style='width:40px;font-size: 9pt;' align='center'>" +
						fDirection + "</td>";
					var_body += "<td style='width:100px;font-size: 9pt;' align='right'>" +
						fBalance + "</td>";
					var_body += "</tr>";

					row++;

					if (row % 26 == 0 || row == 1) {
						page++;

						LODOP.ADD_PRINT_TEXTA("text09", 65, 750, 300, 20, "页号: ");

						LODOP.SET_PRINT_STYLEA(0, "ItemType", 2);
						LODOP.ADD_PRINT_TEXTA("text09", 65, 800, 300, 20, "/");

						LODOP.SET_PRINT_STYLEA(0, "ItemType", 3);

					}
					if (fExplanation == "期间合计") {
						if (row < 27) {
							for (var s = row + 1; s < 27; s++) {
								var_body += "<tr >";
								var_body += "<td style='width:40px;font-size: 9pt;' align='center'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:40px;font-size: 9pt;' align='center'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:80px;font-size: 9pt;' align='center'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:200px;font-size: 9pt;' align='center'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:200px;font-size: 9pt;' align='center'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:100px;font-size: 9pt;' align='right'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:100px;font-size: 9pt;' align='right'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:40px;font-size: 9pt;' align='center'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:100px;font-size: 9pt;' align='right'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "</tr>";
							}
						}
					}

				}
				var_table = var_head + var_body + var_foot;
				LODOP.ADD_PRINT_TABLE(105, 60, 990, 530, var_table);
				LODOP.PREVIEW();

			},


			subsidiaryLedger_printSelect() {
				/* 条件：科目代码 */
				var fNumberStart = this.fNumberStart;
				var fNumberEnd = this.fNumberEnd;
				/* 条件：科目级别 */
				var fLevel = this.fLevel;
				var n1 = [],
					n2 = [];
				n1 = fNumberStart.split(".");
				var n1Start = n1[0];
				n2 = fNumberEnd.split(".");
				var n2End = n2[0];
				/* 科目代码开始的大于结束的，返回null */
				if (fNumberEnd.length != 0) {
					if (n1Start > n2End) {
						alert("结束科目比开始科目大，请重新选择科目");
						return;
					}
				}
				if (n1.length > fLevel) {
					alert("科目代码是明细级别的，但是科目级别没有改变，请选择科目级别");
					return;
				}
				this.generalSubsidiaryListPrint();

			},

			generalSubsidiaryListPrint() {
				let params = {
					fBrNo: this.fBrNo,
					fYearStart: this.fYearStart,
					fPeriodStart: this.fPeriodStart,
					fYearEnd: this.fYearEnd,
					fPeriodEnd: this.fPeriodEnd,
					fNumberStart: this.fNumberStart,
					fNumberEnd: this.fNumberEnd,
					fLevel: this.fLevel,
					flagUnPosted: this.flagUnPosted,
					flagZero: this.flagZero,
					flagUnTrans: this.flagUnTrans,
					flagAmount: this.flagAmount
				};
				this.axios.post('/perTaxToolTwo/e9/tBalance/generalSubsidiaryListPrint', this.qs.stringify(params))
					.then(res => {
						if (res.data.code == 200) {
							if (res.data.data.length == 0 || res.data.data == null) {
								this.$message({
									message: '没有此类数据',
									type: 'warning'
								});
							} else {

								this.subsidiaryLedger_print(res.data.data)
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
			},

			subsidiaryLedger_print(ret) {
				console.log(ret);
				// var result = [];
				// for(var i=0;i<ret.length;i+=4){
				//     result.push(ret.slice(i,i+4));
				// }
				var var_table = "";
				var var_body = "";
				var var_head =
					"<table  cellspacing='0'  border='1'  style='border-collapse:collapse;border-color:Black;border-right-color:Black;font-family:'宋体';' >";
				var_head += "<thead>" +
					"<tr ><td scope='col'  style='width: 100px;font-size: 9pt;'  align='center'>科目</td>" +
					"<td scope='col' style='width: 40px;font-size: 9pt;'  align='center'>月<br>M</td>" +
					"<td scope='col' style='width: 40px;font-size: 9pt;'  align='center'>日<br>D</td>" +
					"<td scope='col'  style='width: 80px;font-size: 9pt;'  align='center'>凭证号<br>Voucher</td>" +
					"<td scope='col'  style='width: 200px;font-size: 9pt;'  align='center'>摘                            要<br>Explanation</td>" +
					"<td scope='col'   style='width: 200px;font-size: 9pt;'  align='center'>对方科目<br>Corresoonding Accounts</td>" +
					"<td scope='col' style='width: 100px;font-size: 9pt;'  align='center'>借方<br>Debit</td>" +
					"<td scope='col' style='width: 100px;font-size: 9pt;'  align='center'>贷方<br>Credit</td>" +
					"<td scope='col' style='width: 40px;font-size: 9pt;'  align='center'>借贷方向</td>" +
					"<td scope='col' style='width: 100px;font-size: 9pt;'   align='center'>余额<br>Balance</td></tr></thead><tbody>";
				var var_foot = "</tbody></table>";

				var LODOP = this.getLodop(document.getElementById('LODOP_OB'), document
					.getElementById('LODOP_EM'));
				/* var LODOP = getCLodop(); */
				if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined"))
					return;
				LODOP.PRINT_INITA(5, 0, 800, 600, "mmflzdy");

				LODOP.SET_PRINT_STYLE("FontSize", 11);
				LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");
				LODOP.ADD_PRINT_TEXTA("text01", 20, 452, 175, 30, "明  细  账");
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 20);

				LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
				var printDate = this.getCurrentDate();
				/* 条件：会计期间 */
				var fYearStart = this.fYearStart;
				var fPeriodStart = this.fPeriodStart;
				var fYearEnd = this.fYearEnd;
				var fPeriodEnd = this.fPeriodEnd;
				var ss = this.common_getPeriod(fYearStart, fPeriodStart, fYearEnd, fPeriodEnd);
				var row = -1;
				var page = 0;
				var sum = 0;
				for (var i = 0; i < ret.length; i++) {
					var balance = ret[i];
					var fExplanation = balance.fexplanation;
					row++
					if (row > 25) {
						sum++;
						row = -1;
						continue;
					}
					if (fExplanation == "期间合计") {
						sum++;
						row = -1;
						continue;
					}
				}
				for (var j = 0; j < ret.length; j++) {
					var balance = ret[j];
					var fNumber_string = this.string_isNull(balance.fnumber_string);
					var fExplanation = this.string_isNull(balance.fexplanation);
					var fAccount_string = this.string_isNull(balance.faccount_string);
					var fDebit_string = this.string_isNull(balance.fdebit_string);
					var fCredit_string = this.string_isNull(balance.fcredit_string);
					var fDirection = this.string_isNull(balance.fdirection);
					var fBalance = this.string_isNull(balance.fbalance);
					var fYear = +this.string_isNull(balance.fyear);
					var fPeriod = +this.string_isNull(balance.fperiod);
					var date = this.getLastDay(fYear, fPeriod);
					var length_fAccount_string = this.getStrLength(fAccount_string); // fNumber_string.length
					var length_fExplanation = this.getStrLength(fExplanation);
					var_body += "<tr >";
					var_body += "<td style='width:100px;font-size: 9pt;' align='center'>" +
						balance.account_fName + "</td>";
					var_body += "<td style='width:40px;font-size: 9pt;' align='center'>" +
						fPeriod + "</td>";
					var_body += "<td style='width:40px;font-size: 9pt;' align='center'>" +
						date + "</td>";
					var_body += "<td style='width:80px;font-size: 9pt;' align='left'>" +
						fNumber_string + "</td>";

					if (length_fExplanation > 40) {
						var_body += "<td style='width:200px;font-size: 6pt;'  align='left'>" +
							fExplanation + "</td>";
					} else if (length_fExplanation > 30) {
						var_body += "<td style='width:200px;font-size: 7pt;'  align='left'>" +
							fExplanation + "</td>";
					} else {
						var_body += "<td style='width:200px;font-size: 9pt;'  align='left'>" +
							fExplanation + "</td>";
					}
					if (length_fAccount_string > 47) {
						var_body += "<td style='width:200px;font-size: 5pt;' align='left'>" +
							fAccount_string + "</td>";
					} else if (length_fAccount_string > 40) {
						var_body += "<td style='width:200px;font-size: 6pt;' align='left'>" +
							fAccount_string + "</td>";
					} else if (length_fAccount_string > 30) {
						var_body += "<td style='width:200px;font-size: 7pt;' align='left'>" +
							fAccount_string + "</td>";
					} else {
						var_body += "<td style='width:200px;font-size: 9pt;' align='left'>" +
							fAccount_string + "</td>";
					}

					var_body += "<td style='width:100px;font-size: 9pt;' align='right'>" +
						fDebit_string + "</td>";
					var_body += "<td style='width:100px;font-size: 9pt;' align='right'>" +
						fCredit_string + "</td>";
					var_body += "<td style='width:40px;font-size: 9pt;' align='center'>" +
						fDirection + "</td>";
					var_body += "<td style='width:100px;font-size: 9pt;' align='right'>" +
						fBalance + "</td>";
					var_body += "</tr>";

					// var_table = var_head + var_body + var_foot;
					// subsidiaryLedger_accountfName = balance.account_fName;

					row++;
					if (row > 25) {
						var_table = var_head + var_body + var_foot;
						var subsidiaryLedger_accountfName = balance.account_fName;

						LODOP.ADD_PRINT_TEXTA("text02", 40, 60, 100, 25, "币种：人民币");
						LODOP.ADD_PRINT_TEXTA("text03", 65, 60, 600, 20, "科目：" +
							subsidiaryLedger_accountfName);
						LODOP.ADD_PRINT_TEXTA("text04", 60, 750, 300, 20, ss);
						// LODOP.ADD_PRINT_HTM(40,750,300,20,"页号: "+"<font FontSize=5
						// format='#'><span tdata='pageNO'>###</span><span
						// tdata='pageCount'>###</span></font>");
						page++;
						LODOP.ADD_PRINT_TEXTA("text10", 40, 750, 300, 20, "页号: " + page +
							"/" + sum);
						LODOP.ADD_PRINT_TABLE(85, 60, 990, 550, var_table);
						LODOP.ADD_PRINT_TEXTA("text05", 635, 60, 900, 25, "核算单位（Unit）" +
							this.fBrNo);
						LODOP.SET_PRINT_MODE("CUSTOM_TASK_NAME", "明细分类账打印" + i); // 为每个打印单独设置任务名
						// LODOP.PREVIEW();
						// LODOP.PRINT();
						// LODOP.ADD_PRINT_TEXT(635, 60, 600, 25, "核算单位（Unit）"+fBrNo );
						// LODOP.ADD_PRINT_TEXT(635, 850, 200, 25,"打印日期："+ printDate);
						if (j < (ret.length - 1)) {
							LODOP.NewPageA();
						}
						row = -1;
						var_body = "";

						continue;

					}
					if (fExplanation == "期间合计") {
						if (row < 27) {
							for (var s = row + 1; s < 27; s++) {
								var_body += "<tr >";
								var_body += "<td style='width:40px;font-size: 9pt;' align='center'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:40px;font-size: 9pt;' align='center'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:80px;font-size: 9pt;' align='center'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:200px;font-size: 9pt;' align='center'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:200px;font-size: 9pt;' align='center'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:100px;font-size: 9pt;' align='right'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:100px;font-size: 9pt;' align='right'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:40px;font-size: 9pt;' align='center'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "<td style='width:100px;font-size: 9pt;' align='right'>" +
									" &nbsp&nbsp&nbsp&nbsp   " + "</td>";
								var_body += "</tr>";
							}
						}
						var_table = var_head + var_body + var_foot;
						var subsidiaryLedger_accountfName = balance.account_fName;
						// LODOP.ADD_PRINT_TEXT(65, 60, 300, 20, "科目：" +
						// subsidiaryLedger_accountfName);
						// LODOP.ADD_PRINT_TEXT(60, 750, 300, 20, ss);
						// LODOP.ADD_PRINT_TEXTA("text02",
						// LODOP.PRINT_INITA("明细分类账打印");

						LODOP.ADD_PRINT_TEXTA("text02", 40, 60, 100, 25, "币种：人民币");
						// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
						LODOP.ADD_PRINT_TEXTA("text06", 65, 60, 600, 20, "科目：" +
							subsidiaryLedger_accountfName);
						LODOP.ADD_PRINT_TEXTA("text07", 60, 750, 300, 20, ss);
						// LODOP.ADD_PRINT_HTM(40,750,300,20,"页号: "+"<font FontSize=5
						// format='#'><span tdata='pageNO'>###</span><span
						// tdata='pageCount'>/###</span></font>");
						page++;
						LODOP.ADD_PRINT_TEXTA("text09", 40, 750, 300, 20, "页号: " + page +
							"/" + sum);
						LODOP.ADD_PRINT_TABLE(85, 60, 990, 550, var_table);
						// LODOP.ADD_PRINT_TEXT(635, 60, 600, 25,"核算单位（Unit）"+ fBrNo );
						LODOP.ADD_PRINT_TEXTA("text08", 635, 60, 900, 25, "核算单位（Unit）" +
							this.fBrNo);
						// LODOP.ADD_PRINT_TEXT(635, 850, 200, 25,"打印日期："+ printDate);
						LODOP.SET_PRINT_MODE("CUSTOM_TASK_NAME", "明细分类账打印" + i); // 为每个打印单独设置任务名
						// LODOP.PREVIEW();

						// LODOP.PRINT();

						if (j < (ret.length - 1)) {
							LODOP.NewPageA();
						}
						row = -1;
						var_body = "";
						continue;
					}



				}
				// LODOP.PRINT();
				LODOP.PREVIEW();

			},

			needCLodop() {
				try {
					var ua = navigator.userAgent;
					if (ua.match(/Windows\sPhone/i) != null) return true;
					if (ua.match(/iPhone|iPod/i) != null) return true;
					if (ua.match(/Android/i) != null) return true;
					if (ua.match(/Edge\D?\d+/i) != null) return true;

					var verTrident = ua.match(/Trident\D?\d+/i);
					var verIE = ua.match(/MSIE\D?\d+/i);
					var verOPR = ua.match(/OPR\D?\d+/i);
					var verFF = ua.match(/Firefox\D?\d+/i);
					var x64 = ua.match(/x64/i);
					if ((verTrident == null) && (verIE == null) && (x64 !== null))
						return true;
					else
					if (verFF !== null) {
						verFF = verFF[0].match(/\d+/);
						if ((verFF[0] >= 41) || (x64 !== null)) return true;
					} else
					if (verOPR !== null) {
						verOPR = verOPR[0].match(/\d+/);
						if (verOPR[0] >= 32) return true;
					} else
					if ((verTrident == null) && (verIE == null)) {
						var verChrome = ua.match(/Chrome\D?\d+/i);
						if (verChrome !== null) {
							verChrome = verChrome[0].match(/\d+/);
							if (verChrome[0] >= 41) return true;
						};
					};
					return false;
				} catch (err) {
					return true;
				};
			},
			getLodop(oOBJECT, oEMBED) {
				var strHtmInstall =
					"<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
				var strHtmUpdate =
					"<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
				var strHtm64_Install =
					"<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
				var strHtm64_Update =
					"<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
				var strHtmFireFox =
					"<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
				var strHtmChrome = "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
				var strCLodopInstall =
					"<br><font color='#FF00FF'>CLodop云打印服务(localhost本地)未安装启动!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面。</font>";
				var strCLodopUpdate =
					"<br><font color='#FF00FF'>CLodop云打印服务需升级!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>,升级后请刷新页面。</font>";
				var LODOP;
				try {
					var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
					if (this.needCLodop()) {
						try {
							LODOP = getCLodop();
						} catch (err) {};
						if (!LODOP && document.readyState !== "complete") {
							alert("C-Lodop没准备好，请稍后再试！");
							return;
						};
						if (!LODOP) {
							if (isIE) document.write(strCLodopInstall);
							else
								document.body.innerHTML = strCLodopInstall + document.body.innerHTML;
							return;
						} else {

							if (CLODOP.CVERSION < "3.0.2.3") {
								if (isIE) document.write(strCLodopUpdate);
								else
									document.body.innerHTML = strCLodopUpdate + document.body.innerHTML;
							};
							if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED);
							if (oOBJECT && oOBJECT.parentNode) oOBJECT.parentNode.removeChild(oOBJECT);
						};
					} else {
						var is64IE = isIE && (navigator.userAgent.indexOf('x64') >= 0);
						//=====如果页面有Lodop就直接使用，没有则新建:==========
						if (oOBJECT != undefined || oEMBED != undefined) {
							if (isIE) LODOP = oOBJECT;
							else LODOP = oEMBED;
						} else if (CreatedOKLodop7766 == null) {
							LODOP = document.createElement("object");
							LODOP.setAttribute("width", 0);
							LODOP.setAttribute("height", 0);
							LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
							if (isIE) LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
							else LODOP.setAttribute("type", "application/x-print-lodop");
							document.documentElement.appendChild(LODOP);
							CreatedOKLodop7766 = LODOP;
						} else LODOP = CreatedOKLodop7766;
						//=====Lodop插件未安装时提示下载地址:==========
						if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) {
							if (navigator.userAgent.indexOf('Chrome') >= 0)
								document.body.innerHTML = strHtmChrome + document.body.innerHTML;
							if (navigator.userAgent.indexOf('Firefox') >= 0)
								document.body.innerHTML = strHtmFireFox + document.body.innerHTML;
							if (is64IE) document.write(strHtm64_Install);
							else
							if (isIE) document.write(strHtmInstall);
							else
								document.body.innerHTML = strHtmInstall + document.body.innerHTML;
							return LODOP;
						};
					};
					if (LODOP.VERSION < "6.2.2.0") {
						if (!this.needCLodop()) {
							if (is64IE) document.write(strHtm64_Update);
							else
							if (isIE) document.write(strHtmUpdate);
							else
								document.body.innerHTML = strHtmUpdate + document.body.innerHTML;
						};
						return LODOP;
					};
					//===如下空白位置适合调用统一功能(如注册语句、语言选择等):===

					//===========================================================
					return LODOP;
				} catch (err) {
					alert("getLodop出错:" + err);
				};
			},
			getStrLength(str) {
				var cArr = str.match(/[^\x00-\xff]/ig);
				return str.length + (cArr == null ? 0 : cArr.length);
			},
			/*获取当前的年、月*/
			getCurrentDate() {
				var myDate = new Date();
				var printfFullYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
				var printfMonth = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
				var printfDate = myDate.getDate(); //获取当前日(1-31)
				var printDate = printfFullYear + "-" + printfMonth + "-" + printfDate;
				return printDate;
			},
			/*获取本期的年、月*/
			getCurrentPeriodDate(year, month) {
				var myDate = this.getLastDay(year, month);

				var printDate = year + "年" + month + "月" + myDate + "日";
				return printDate;
			},
			/*获取每个月的最后一天*/
			getLastDay(year, month) {
				var new_year = year; //取当前的年份
				var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
				if (month > 12) //如果当前大于12月，则年份转到下一年
				{
					new_month -= 12; //月份减
					new_year++; //年份增
				}
				var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
				return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期
			},
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


							this.uploadData.fYear = res.data.data.fyear.toString();
							this.uploadData.fPeriod = res.data.data.fperiod;
							this.customerType = res.data.data.customerType;

							this.uploadData.fYearStart = res.data.data.fyear.toString();
							this.uploadData.fPeriodStart = res.data.data.fperiod;
							this.uploadData.fYearEnd = res.data.data.fyear.toString();
							this.uploadData.fPeriodEnd = res.data.data.fperiod;
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

			getProofTAccounts(val) {
				let params = {
					"id": 0,
					"fBrNo": val,
				};
				this.axios.post('/perTaxToolTwo/e9/taccount/getProofTAccounts', params)

					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tree3 = res.data.data;
							this.treeList3 = [];
							this.tree3.forEach((item, index) => {
								item.full = item.fnumber + '-' + item.ffullname
								if (item.fparentid == 0) {
									this.treeList3.push(item);

								}
							})
							this.treeList3 = JSON.parse(JSON.stringify(this.treeList3));
							console.log(this.treeList)
							this.treeList3.forEach((item, index) => {
								item.children = [];
								this.tree3.forEach((item2, index2) => {
									if (item2.fparentid == item.frootid) {
										item.children.push(item2);

									}
								})
							})

							console.log(this.treeList3)

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
				this.getProofTVoucher(val)
			},
			getAllCustList() {
				let params = {

				};
				this.axios.post('/perTaxToolTwo/e9/acct/findE9AcctList', params)
					.then(res => {
						if (res.data.code == 200) {
							this.custList = res.data.data;

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
		},
		computed: {},
		created() {
			this.getAllCustList();
			if (this.needCLodop()) {
				var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
				var oscript = document.createElement("script");
				oscript.src = "http://localhost:8000/CLodopfuncs.js?priority=1";
				head.insertBefore(oscript, head.firstChild);

				//引用双端口(8000和18000）避免其中某个被占用：
				oscript = document.createElement("script");
				oscript.src = "http://localhost:18000/CLodopfuncs.js?priority=0";
				head.insertBefore(oscript, head.firstChild);
			}
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

		.form_contain {
			background: #fff;
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
