<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>首页</el-breadcrumb-item>
			<el-breadcrumb-item>会计工厂</el-breadcrumb-item>
			<el-breadcrumb-item>固定资产管理</el-breadcrumb-item>
			<el-breadcrumb-item>卡片管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<h3>卡片管理</h3>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' style="position:relative;">
					<el-form-item label="单位名称" prop="fBrNo">
						<el-select v-model="uploadData.fBrNo" placeholder="请选择" clearable filterable @change='getAssetPeriod'>
							<el-option v-for="item in periodCustList" :label="item.customerName" :value='item.customerName'></el-option>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option> -->
						</el-select>
					</el-form-item>

					<el-form-item label="会计时间:" prop="dossierName">
						<el-date-picker v-model="uploadData.fYear" align="right" type="year" placeholder="选择年" format="yyyy" value-format="yyyy">
						</el-date-picker>
						<span class="demonstration" style="margin-left:5px;">年</span>
						<el-input-number v-model="uploadData.fPeriod" :min="1" :max="12" label="描述文字" style="height:30px;margin-left:10px;width:100px;"></el-input-number>
						<span class="demonstration" style="margin-left:5px;">期</span>


					</el-form-item>

					<el-form-item label="" prop="dossierName">
						<el-checkbox name="type" v-model="uploadData.fChecked" true-label='1' false-label='-1'>选中账期</el-checkbox>
						<el-button type="primary" @click='search()' style="margin-left:10px;" size="mini">查询</el-button>
						<el-button type="primary" @click='getExcelTemplate()' size="mini" :disabled="!fBrNo">下载模板</el-button>
						<el-upload style="display: inline-block;margin-left: 10px;" ref='upload' class="upload-demo" :on-remove="handleRemove"
						 :on-success="handleSuccess" action='/perTaxToolTwo/e9/tfacard/tfacardFileUpload' :on-error="handleError"
						 :before-remove="beforeRemove" :on-exceed="handleExceed" :file-list="fileList" accept=".xls" :data='postData'
						 :show-file-list="false">
							<el-button size="mini" type="primary" :disabled="!fBrNo">导入</el-button>
						</el-upload>
					</el-form-item>



					<el-button type="primary" @click='voucherGather_print()' size="mini" :disabled="list.length <= 0" style="float: right;margin-right: 10px;">打印</el-button>
					<el-button type="primary" @click='import_but()' size="mini" style="float: right;margin-right: 10px;">计提折旧</el-button>
					<el-button type="primary" @click='showAddDialog()' size="mini" style="float: right;margin-right: 10px;">新增</el-button>
					<!-- <el-button type="primary" @click='cardClear()' size="mini" style="float: right">卡片清理</el-button> -->
				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<div class='chart_contain' v-loading='loading'>
				<div v-for='(item,index) in list' class='card'>
					<div class='card_first'>
						<div class="p_first">
							{{item.fassetname}}
							<i class="el-icon-delete" style='float: right;margin-top: 12px;' @click='delCard(item)'></i>
							<i class="el-icon-refresh" style='float: right;margin-top: 12px;margin-right: 10px;' @click='refresh(item)'></i>
							<!-- <el-button type="text" @click='delCard(item)' style='float: right;color: #fff;'>删除</el-button> -->
							<!-- <el-checkbox v-model="tem[index]" style='float: right;'> </el-checkbox> -->
						</div>




					</div>


					<div class="charts">
						<p>
							<span>流水号</span>
							<span>{{item.falterid}}</span>
						</p>
						<p>
							<span>年度</span>
							<span>{{item.fYear}}</span>
						</p>
						<p>
							<span>期间</span>
							<span>{{item.fPeriod}}</span>
						</p>
						<p>
							<span>入账日期活变动日期</span>
							<span>{{item.fVoucherDate_string}}</span>
						</p>
						<p>
							<span>摘要</span>
							<span>{{item.fExplanation}}</span>
						</p>
						<p>
							<span>编码</span>
							<span>{{item.fassetnumber}}</span>
						</p>
						<p>
							<span>类别</span>
							<span :title="item.fGroupName">{{item.fGroupName}}</span>
						</p>
						<p>
							<span>变动方式</span>
							<span>{{item.fAlterModeName }}</span>
						</p>
					</div>
					<div class='text_contain'>
						<span class="el-icon-more" style="cursor:pointer;" @click="showDetail(item)"></span>
					</div>

				</div>
			</div>
			<!-- <el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination> -->
			<el-dialog title="卡片详情" :visible.sync="dialogVisible" width="600px" :before-close="handleClose">
				<div>
					<div>
						<div class="card_head">
							<!-- {{item.customerName}} -->
							<span style="padding:6px;">{{detail.fassetname}}</span>
						</div>




					</div>


					<div class="card_charts clearfix">
						<p v-for="item in itemList">
							<span>{{item.label}}</span>
							<span :title="detail[item.key]">{{detail[item.key]}}</span>
						</p>

					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="dialogVisible = false" size="mini">确 定</el-button>
				</span>
			</el-dialog>


			<el-dialog title="计提折旧" :visible.sync="dialogVisible_2" width="450px" :before-close="handleClose2">

				<span style="margin-top:20px">单位名称:</span>
				<el-select v-model="fBrNo1" placeholder="请选择公司名称" clearable filterable @change='getAssetPeriod2' size="mini" style="margin-left:10px;">
					<el-option v-for="item in periodCustList" :label="item.customerName" :value='item.customerName'></el-option>
					<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option> -->
				</el-select>
				<div style="height:10px;">

				</div>
				<span style="margin-top:20px">折旧期间:</span>
				<el-date-picker style="margin-left:10px;" v-model="discountfYear" align="right" type="year" placeholder="选择年" size="mini"
				 format="yyyy" value-format="yyyy" disabled>
				</el-date-picker>
				<span class="demonstration" style="margin-left:5px;">年</span>
				<el-input-number size="mini" disabled v-model="discountfPeriod" :min="1" :max="12" label="描述文字" style="height:30px;margin-left:10px;width:140px;"></el-input-number>
				<span class="demonstration" style="margin-left:5px;">期</span>
				<div style="margin-top:20px">为了合理分摊固定资产在使用中的损耗，应当在期末时按一定的方法对固定资产进行计提折旧。本指南将自动计算本期各固定资产应提的折旧额，并编制记账凭证吗，将折旧额按比例分配到各个费用科目中。</div>
				<span slot="footer" class="dialog-footer" style="display: flex;justify-content: center;">
					<el-button type="primary" @click="createAssetDiscount">确 定</el-button>
					<el-button type="danger" @click="dialogVisible_2 = false">取 消</el-button>
				</span>
			</el-dialog>

			<el-dialog title="新增卡片" :visible.sync="dialogVisible1" width="1020px" class='dialog'>

				<el-form :inline="true" ref="ruleForm1" :model="cardInfo" class="demo-form-inline" label-width="120px" size="small">
					<div class="tabtitle">
						<p class="lineicon"></p>
						<p class="linetext">基本信息</p>
					</div>
					<el-form-item label="单位名称" prop="fBrNo" :rules="[$rules.requiredSelect]">
						<el-select v-model="cardInfo.fBrNo" placeholder="请选择单位名称" clearable filterable @change='getAssetPeriod1'>
							<el-option v-for="item in periodCustList" :label="item.customerName" :value='item.customerName'></el-option>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="资产账簿" prop="customername">
						<el-input value="主账簿" disabled></el-input>
					</el-form-item>
					<el-form-item label="资产类别" prop="fGroupName" :rules="[$rules.requiredSelect]">
						<el-select v-model="cardInfo.fGroupName" placeholder="请选择资产类别">
							<el-option v-for="item in fGroupNameList" :label="item.fname" :value="item.fname"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="资产编码" prop="fassetnumber">
						<el-input v-model="cardInfo.fassetnumber" disabled></el-input>
					</el-form-item>
					<el-form-item label="资产名称" prop="fassetname" :rules="[$rules.requiredInput]">
						<el-input v-model="cardInfo.fassetname" placeholder="请输入资产名称"></el-input>
					</el-form-item>
					<el-form-item label="数量" prop="fNum_string" :rules="[$rules.requiredInput]">
						<el-input v-model="cardInfo.fNum_string" placeholder="请输入数量"></el-input>
					</el-form-item>
					<el-form-item label="入账日期" prop="fVoucherDate_string" :rules="[$rules.requiredSelect]">
						<el-date-picker v-model="cardInfo.fVoucherDate_string" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
						 placeholder="请选择入账日期" @change="getAssetCardsForAdd"></el-date-picker>
					</el-form-item>
					<el-form-item label="经济用途" prop="fEconomyUsefName" :rules="[$rules.requiredSelect]">
						<el-select v-model="cardInfo.fEconomyUsefName" placeholder="请选择经济用途">
							<el-option label="经营用" value="经营用"></el-option>
							<el-option label="非经营用" value="非经营用"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="使用状况" prop="fStatusName" :rules="[$rules.requiredSelect]">
						<el-cascader v-model="cardInfo.fStatusName" placeholder="试试搜索" :options="treeList" filterable :props="props"
						 :show-all-levels="false"></el-cascader>
					</el-form-item>
					<el-form-item label="变动方式" prop="fAlterModeName" :rules="[$rules.requiredSelect]">
						<el-cascader v-model="cardInfo.fAlterModeName" placeholder="试试搜索" :options="treeList1" filterable :props="props"
						 :show-all-levels="false"></el-cascader>
					</el-form-item>
					<el-form-item label="是否生成凭证" prop="flagVoucher" :rules="[$rules.requiredSelect]">
						<el-select v-model="cardInfo.flagVoucher" placeholder="请选择">
							<el-option v-for="item in trueOrFalse1" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>

					<div class="tabtitle">
						<p class="lineicon"></p>
						<p class="linetext">部门、原值与折旧</p>
					</div>
					<el-form-item label="固定资产科目" prop="fAssetfNumber" :rules="[$rules.requiredInput]">
						<el-cascader v-model="cardInfo.fAssetfNumber" placeholder="试试搜索" :options="treeList3" filterable :props="props1"
						 :show-all-levels="false" change-on-select></el-cascader>
					</el-form-item>
					<el-form-item label="原币金额" prop="fOrgVal_string" :rules="[$rules.requiredInput]">
						<el-input v-model="cardInfo.fOrgVal_string" placeholder="请输入原币金额"></el-input>
					</el-form-item>
					<el-form-item label="累计折旧科目" prop="fDeprfNumber" :rules="[$rules.requiredSelect]">
						<el-cascader v-model="cardInfo.fDeprfNumber" placeholder="试试搜索" :options="treeList3" filterable :props="props1"
						 :show-all-levels="false" change-on-select></el-cascader>
					</el-form-item>
					<el-form-item label="预计使用期间数" prop="fLifePeriods_string" :rules="[$rules.requiredInput]">
						<el-input v-model="cardInfo.fLifePeriods_string" placeholder="请输入预计使用期间数"></el-input>
					</el-form-item>
					<el-form-item label="开始使用日期" prop="fBeginUseDate_string" :rules="[$rules.requiredSelect]">
						<el-date-picker v-model="cardInfo.fBeginUseDate_string" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
						 placeholder="请选择开始使用日期"></el-date-picker>
					</el-form-item>
					<el-form-item label="已使用期间数" prop="fPeriodsUsed_string" :rules="[$rules.requiredSelect]">
						<el-input v-model="cardInfo.fPeriodsUsed_string" placeholder="请输入已使用期间数"></el-input>
					</el-form-item>
					<el-form-item label="累计折旧" prop="fAccumDepr_string" :rules="[$rules.requiredInput]">
						<el-input v-model="cardInfo.fAccumDepr_string" placeholder="请输入累计折旧"></el-input>
					</el-form-item>
					<el-form-item label="付款科目" prop="fNetValuefNumber" :rules="[$rules.requiredSelect]">
						<el-cascader v-model="cardInfo.fNetValuefNumber" placeholder="试试搜索" :options="treeList3" filterable :props="props1"
						 :show-all-levels="false" change-on-select></el-cascader>
					</el-form-item>
					<el-form-item label="净值">
						<el-input :value="parseFloat(cardInfo.fOrgVal_string?cardInfo.fOrgVal_string:0) - parseFloat(cardInfo.fAccumDepr_string?cardInfo.fAccumDepr_string:0)"
						 disabled></el-input>
					</el-form-item>
					<el-form-item label="预计净残值" prop="fResidueVal_string" :rules="[$rules.requiredInput]">
						<el-input v-model="cardInfo.fResidueVal_string" placeholder="请输入预计净残值"></el-input>
					</el-form-item>
					<el-form-item label="减值准备" prop="fAMiuValueRead_string" :rules="[$rules.requiredInput]">
						<el-input v-model="cardInfo.fAMiuValueRead_string" placeholder="请输入减值准备"></el-input>
					</el-form-item>
					<el-form-item label="净额">
						<el-input :value="parseFloat(cardInfo.fOrgVal_string?cardInfo.fOrgVal_string:0) - parseFloat(cardInfo.fAccumDepr_string?cardInfo.fAccumDepr_string:0) - parseFloat(cardInfo.fAMiuValueRead_string?cardInfo.fAMiuValueRead_string:0)"
						 disabled></el-input>
					</el-form-item>
					<br>
					<el-form-item label="使用部门" prop="fDptName" :rules="[$rules.requiredSelect]">
						<el-select v-model="cardInfo.fDptName" placeholder="请选择">
							<el-option v-for="item in departList" :label="item.fname" :value="item.fname"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="折旧费用科目" prop="fBalExpensefNumber" :rules="[$rules.requiredSelect]">
						<el-cascader v-model="cardInfo.fBalExpensefNumber" placeholder="试试搜索" :options="treeList3" filterable :props="props1"
						 :show-all-levels="false" change-on-select></el-cascader>
					</el-form-item><br>
					<el-form-item label="折旧方法" prop="fDeprMethodName" :rules="[$rules.requiredSelect]">
						<el-select v-model="cardInfo.fDeprMethodName" placeholder="请选择经济用途">
							<el-option label="平均年限法 " value="平均年限法 "></el-option>
							<el-option label="工作量法" value="工作量法"></el-option>
							<el-option label="年数总和法" value="年数总和法"></el-option>
							<el-option label="双倍余额递减法" value="双倍余额递减法"></el-option>
						</el-select>
					</el-form-item>
					<div class="tabtitle">
						<p class="lineicon"></p>
						<p class="linetext">选择卡片</p>
					</div>

					<el-table :data="cardList" style="width: 100%" stripe border>
						<el-table-column align="center" label="流水号" prop="contactname" :resizable="false"></el-table-column>
						<el-table-column align="center" label="年度" prop="contactname" :resizable="false"></el-table-column>
						<el-table-column align="center" label="期间" prop="position" :resizable="false"></el-table-column>
						<el-table-column align="center" label="名称" prop="level" :resizable="false"></el-table-column>
						<el-table-column align="center" label="入账日期或变动日期" prop="type" :resizable="false"></el-table-column>
						<el-table-column align="center" label="摘要" prop="wechat" :resizable="false"></el-table-column>
						<el-table-column align="center" label="编码" prop="unit" :resizable="false"></el-table-column>
						<el-table-column align="center" label="类别" prop="phone" :resizable="false"></el-table-column>
						<el-table-column align="center" label="变动方式" prop="address" :resizable="false"></el-table-column>
						<el-table-column align="center" label="使用状态" prop="email" :resizable="false"></el-table-column>
						<!-- 	<el-table-column align="center" label="部门" prop="fax" :resizable="false"></el-table-column>
						<el-table-column align="center" label="数量" prop="qq" :resizable="false"></el-table-column> -->


					</el-table>

				</el-form>

				<div class='btn_contain clearfix'>
					<span class='commit' @click='commitDialog()'>完成</span>
					<span class='close' @click="hideDialog">关闭</span>
				</div>
			</el-dialog>
			
			
			
			<el-dialog title="资产清理" :visible.sync="dialogVisible2" width="400px" class='dialog'>
			
				<el-form ref="ruleForm2" :model="clearInfo" class="demo-form-inline" label-width="120px" size="small">
					
					<el-form-item label="单位名称" prop="fbrno">
						<el-input v-model="clearInfo.fbrno" disabled></el-input>
					</el-form-item>
					<el-form-item label="固定资产" prop="fassetname">
						<el-input v-model="clearInfo.fassetname" disabled></el-input>
					</el-form-item>
					
					
					
					<!-- this.uploadData.fYear = res.data.data.fyear.toString();;
					this.uploadData.fPeriod -->
					<el-form-item label="清理日期" prop="fDate_string">
						<el-date-picker v-model="clearInfo.fDate_string" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
						 placeholder="请选择" @change="getAssetCardsForAdd"></el-date-picker>
					</el-form-item>
					<el-form-item label="清理数量" prop="fNumCleared_string">
						<el-input v-model="clearInfo.fNumCleared_string"></el-input>
					</el-form-item>
					
					<el-form-item label="变动方式" prop="fAlterModeName">
						<el-cascader v-model="clearInfo.fAlterModeName" placeholder="试试搜索" :options="treeList1" filterable :props="props"
						 :show-all-levels="false" change-on-select></el-cascader>
					</el-form-item>
					<el-form-item label="摘要" prop="fExplanation">
						<el-input v-model="clearInfo.fExplanation"></el-input>
					</el-form-item>
			
					
					<el-form-item label="清理科目" prop="fNetValuefNumber">
						<el-cascader v-model="clearInfo.fNetValuefNumber" placeholder="试试搜索" :options="treeList3" filterable :props="props1"
						 :show-all-levels="false" change-on-select></el-cascader>
					</el-form-item>
					
					
				</el-form>
				<span slot="footer" class="dialog-footer">
					<el-button @click="hideDialog2">取 消</el-button>
					<el-button type="primary" @click="commitClear">确 定</el-button>
				</span>
				
			</el-dialog>

		</div>


	</div>
</template>

<script>
	export default {
		name: "fixedCard",
		data() {
			return {
				clearInfo:{},
				postData: {},
				fileList: [],
				periodCustList: [],
				fYear: "",
				fPeriod: "",
				fChecked: "-1",
				fBrNo: "",
				fBrNo1: "",
				tem: [],
				cardList: [],
				//资产类别
				fGroupNameList: [],
				//使用状况
				assetStatusList: [],
				tree: [],
				treeList: [],
				//变动方式
				tree1: [],
				treeList1: [],
				//科目
				tree3: [],
				treeList3: [],
				departList: [],
				props: {
					value: 'fname',
					label: 'full',
					children: 'children'
				},
				props1: {
					value: 'fnumber',
					label: 'full',
					children: 'children'
				},
				trueOrFalse: [{
						label: "否",
						value: 0
					},
					{
						label: "是",
						value: 1
					}
				],
				trueOrFalse1: [{
						label: "否",
						value: 1
					},
					{
						label: "是",
						value: 0
					}
				],
				cardInfo: {
					flagVoucher: 1
				},
				discountfYear: '',
				discountfPeriod: '',
				num: '',
				num1: '',
				dialogVisible: false,
				dialogVisible1: false,
				dialogVisible_2: false,
				dialogVisible2: false,
				loading: false,
				value4: this.formatTimeToStr(new Date(), 'yyyy-MM'),
				selectNum: new Date().getMonth(),
				percentage: 0,
				uploadData: {
					fYear: "",
					fPeriod: "0",
					fChecked: "-1",
					fBrNo: "",
				},
				customerId: 0,
				tableData: [],
				arr: [],
				customerName: '',
				list: [],
				pageSize: 10,
				currentPage: 1,
				total: 0,
				detail: {},
				itemList: [{
						label: "流水号",
						key: "falterid"
					},
					{
						label: "年度",
						key: "fYear"
					},
					{
						label: "期间",
						key: "fPeriod"
					},
					{
						label: "年度",
						key: "fYear"
					},
					{
						label: "入账日期或变动日期",
						key: "fVoucherDate_string"
					},
					{
						label: "摘要",
						key: "fExplanation"
					},
					{
						label: "编码",
						key: "fassetnumber"
					},
					{
						label: "类别",
						key: "fGroupName"
					},
					{
						label: "变动方式",
						key: "fAlterModeName"
					},
					{
						label: "使用状态",
						key: "fStatusName"
					},
					{
						label: "部门",
						key: "fDptName"
					},
					{
						label: "数量",
						key: "fnum_string"
					},
					{
						label: "原币原值",
						key: "fOrgVal_string"
					},
					{
						label: "预计净残值",
						key: "fResidueVal_string"
					},
					{
						label: "预计使用期间数",
						key: "fLifePeriods_string"
					},
					{
						label: "已使用期间数",
						key: "fPeriodsUsed_string"
					},
					{
						label: "剩余寿命",
						key: "fPeriodsNoUsed_string"
					},
					{
						label: "减值准备",
						key: "fAMiuValueRead_string"
					},
					{
						label: "折旧方法",
						key: "fDeprMethodName"
					},
					{
						label: "购进累计折旧",
						key: "fAccumDeprBuy_string"
					},
					{
						label: "累计折旧调整",
						key: "fAccumDepr_string"
					},
					{
						label: "折旧费用项目",
						key: "fBalExpensefName"
					},
					{
						label: "经济用途",
						key: "fEconomyUsefName"
					},
					{
						label: "开始使用日期",
						key: "fBeginUseDate_string"
					},
					{
						label: "固定资产科目",
						key: "fAssetfName"
					},
					{
						label: "累计折旧科目",
						key: "fDeprfName"
					},
					{
						label: "客户名称",
						key: "fbrno"
					},
					{
						label: "付款科目",
						key: "fNetValuefName"
					},
					{
						label: "固定资产科目代码",
						key: "fAssetfNumber"
					},
					{
						label: "累计折旧科目代码",
						key: "fDeprfNumber"
					},
					{
						label: "折旧费用科目代码",
						key: "fBalExpensefNumber"
					},
				]
			}
		},
		components: {},
		methods: {
			hideDialog2(){
				this.dialogVisible2 = false;
			},
			handleExceed(files, fileList) {
				fileList[0].name = files[0].name
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
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
				this.fileList = fileList;
			},
			handleSuccess(response, file, fileList) {
				if (response.code == 200) {
					this.systemProfileIsSave();
					this.queryPage();
					this.$message({
						message: response.msg,
						type: "success"
					});
				} else if (response.code == 0) {
					this.$message({
						message: response.msg,
						type: "warning"
					});
				} else {
					this.$message({
						message: response.msg,
						type: "error"
					});
				}


			},
			getExcelTemplate() {
				window.location.href = '/perTaxToolTwo/e9/tfacard/getExcelTemplate?fBrNo=' + this.fBrNo;
			},
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
			handleClose() {
				this.dialogVisible = false;
			},
			handleClose2() {
				this.dialogVisible_2 = false;
			},
			hideDialog() {
				this.dialogVisible1 = false;
			},
			showAddDialog() {
				this.dialogVisible1 = true;
			},
			refresh(row){
				this.dialogVisible2 = true;
				this.clearInfo = JSON.parse(JSON.stringify(row));
				this.$set(this.clearInfo,'fNumCleared_string','1.00');
				this.$set(this.clearInfo,'fNetValuefNumber','');
				this.$set(this.clearInfo,'fAlterModeName','');
				this.getAssetAlterModes(row.fbrno);
				this.getProofTAccounts(row.fbrno, 0);
				this.getAssetPeriod3(row.fbrno)
			},
			commitClear(){
				let params = {
					"fname": this.clearInfo.fassetname,
					"fnumcleared_string": this.clearInfo.fNumCleared_string,
					"falteridold": this.clearInfo.falterid,
					"fdate_string": this.clearInfo.fDate_string,
					"fbrno": this.clearInfo.fbrno,
					"fexplanation": this.clearInfo.fExplanation,
					"fassetid": this.clearInfo.fAssetID,
					"fnetvaluefnumber": this.clearInfo.fNetValuefNumber[this.clearInfo.fNetValuefNumber.length - 1],
					"faltermodename": this.clearInfo.fAlterModeName[this.clearInfo.fAlterModeName.length - 1],
					
				};
				this.axios.post('/perTaxToolTwo/e9/tfacard/createAssetClear', params)
					.then(res => {
						if (res.data.code == 200) {
							this.queryPage();
							this.dialogVisible2 = false;
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
			delCard(item) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"fYear": item.fyear,
						"fPeriod": item.fperiod,
						"fBrNo": this.fBrNo,
						"fAlterID": item.falterid
					};
					this.axios.post('/perTaxToolTwo/e9/tfacard/removeAsset', params)
						.then(res => {
							if (res.data.code == 200) {
								this.cardInfo.fassetnumber = res.data.data;
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
						message: '已取消删除'
					});
				});
			},


			setfassetnumber(val) {
				// this.cardInfo.fassetnumber = val.fnumber;
				// this.cardInfo.fGroupName = val.fname;
				let params = {
					"fBrNo": val,

				};
				this.axios.post('/perTaxToolTwo/e9/tfacard/getAssetCardfAssetNumber', this.qs.stringify(params))
					.then(res => {
						if (res.data.code == 200) {
							this.cardInfo.fassetnumber = res.data.data;
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
			commitDialog() {
				this.$refs["ruleForm1"].validate((valid) => {
					if (valid) {
						if(this.cardInfo.fLifePeriods_string <= 0 || this.cardInfo.fLifePeriods_string <= this.cardInfo.fPeriodsUsed_string){
							this.$message({
								message: '预计使用期间数应大于0，且要大于已使用期间数',
								type: 'error'
							});
						}
						let params = {
							"fDptName": this.cardInfo.fDptName, //使用部门
							"fGroupName": this.cardInfo.fGroupName, //资产类别
							"fEconomyUsefName": this.cardInfo.fEconomyUsefName, //经济用途
							"fStatusName": this.cardInfo.fStatusName[this.cardInfo.fStatusName.length - 1], //使用状况
							"fAlterModeName": this.cardInfo.fAlterModeName[this.cardInfo.fAlterModeName.length - 1], //变动方式
							"fDeprMethodName": this.cardInfo.fDeprMethodName, //折旧方法
							"fassetnumber": this.cardInfo.fassetnumber, //资产编码
							"fassetname": this.cardInfo.fassetname, //资产名称
							"fNum_string": this.cardInfo.fNum_string, //数量
							"fAssetfNumber": this.cardInfo.fAssetfNumber[this.cardInfo.fAssetfNumber.length - 1], //固定资产科目
							"fDeprfNumber": this.cardInfo.fDeprfNumber[this.cardInfo.fDeprfNumber.length - 1], //累计折旧科目
							"fNetValuefNumber": this.cardInfo.fNetValuefNumber[this.cardInfo.fNetValuefNumber.length - 1], //付款科目
							"fBalExpensefNumber": this.cardInfo.fBalExpensefNumber[this.cardInfo.fBalExpensefNumber.length - 1], //折旧费用科目
							"fbrno": this.cardInfo.fBrNo,
							"fOrgVal_string": this.cardInfo.fOrgVal_string, //原币金额
							"fAccumDepr_string": this.cardInfo.fAccumDepr_string, //累计折旧
							"fResidueVal_string": this.cardInfo.fResidueVal_string, //预计净残值
							"fAMiuValueRead_string": this.cardInfo.fAMiuValueRead_string, //减值准备
							"fBeginUseDate_string": this.cardInfo.fBeginUseDate_string, //开始使用日期
							"fVoucherDate_string": this.cardInfo.fVoucherDate_string, //入账日期
							"fLifePeriods_string": this.cardInfo.fLifePeriods_string, //预计使用期间数
							"fPeriodsUsed_string": this.cardInfo.fPeriodsUsed_string, //已使用期间数
							"flagVoucher": this.cardInfo.flagVoucher, //判断是否在当前的固定资产时生成凭证，默认不勾选：1；勾选：0
							"paramStr": "undefined@"
						};
						this.axios.post('/perTaxToolTwo/e9/tfacard/createAsset', params)
							.then(res => {
								if (res.data.code == 200) {
									this.queryPage();
									this.dialogVisible1 = false;
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
						console.log('error submit!!');
						return false;
					}
				});
			},
			import_but() {
				this.dialogVisible_2 = true;
			},
			//计提折旧
			createAssetDiscount() {
				let params = {
					"fYear": this.discountfYear,
					"fPeriod": this.discountfPeriod,
					"fBrNo": this.fBrNo1,
				};
				this.axios.post('/perTaxToolTwo/e9/tfacard/createAssetDiscount', params)

					.then(res => {
						if (res.data.code == 200) {
							// this.total = res.data.count;
							this.dialogVisible_2 = false;
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
			search() {
				if (this.uploadData.fChecked == '1') {
					this.fYear = this.uploadData.fYear;
					this.fPeriod = this.uploadData.fPeriod;
					this.fChecked = '-1';
					this.fBrNo = this.uploadData.fBrNo;
				} else {
					this.fYear = '0';
					this.fPeriod = '0';
					this.fChecked = '-1';
					this.fBrNo = this.uploadData.fBrNo;
				}
				this.postData = {
					fBrNo: this.fBrNo
				};
				this.queryPage()
			},
			showDetail(item) {
				this.dialogVisible = true;
				this.detail = item;
			},
			queryPage() {
				this.loading = true;
				let params = {
					"fYear": this.fYear,
					"fPeriod": this.fPeriod,
					"fChecked": this.fChecked,
					"fBrNo": this.fBrNo,
					// "fBrNo": "南京尊音科技有限公司",
				};
				this.axios.post('/perTaxToolTwo/e9/tfacard/getAssetCards', params)

					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.list = res.data.data;
							// this.total = res.data.count;
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
			//获取资产类别
			getGroupNameList(val) {
				this.fGroupNameList = [];
				let params = {
					"fBrNo": val,
				};
				this.axios.post('/perTaxToolTwo/e9/tfagroup/getAssetGroups', this.qs.stringify(params))

					.then(res => {
						if (res.data.code == 200) {
							var tem = res.data.data;
							// this.fGroupNameList = res.data.data;
							this.fGroupNameList = tem.filter(item => item.fid != 0);
							console.log(tem);
							console.log(this.fGroupNameList);
							// this.total = res.data.count;
							// this.$message({
							// 	message: res.data.msg,
							// 	type: 'success'
							// });
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
			//获取使用状况
			getAssetStatuss(val) {

				let params = {
					"fBrNo": val,
				};
				this.axios.post('/perTaxToolTwo/e9/tfastatus/getAssetStatuss', this.qs.stringify(params))

					.then(res => {
						if (res.data.code == 200) {
							var tem = res.data.data;
							this.tree = tem.filter(item => item.fid != 0);
							this.treeList = [];
							this.tree.forEach((item, index) => {
								item.full = item.fnumber + '-' + item.fname
								if (item.fparentid == 0) {
									this.treeList.push(item);

								}
							})
							this.treeList = JSON.parse(JSON.stringify(this.treeList))
							console.log(this.treeList)
							this.treeList.forEach((item, index) => {
								item.children = [];
								this.tree.forEach((item2, index2) => {
									if (item2.fparentid == item.fid) {
										item.children.push(item2);

									}
								})
							})
							// this.$message({
							// 	message: res.data.msg,
							// 	type: 'success'
							// });
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
			//获取变动方式
			getAssetAlterModes(val) {
				let params = {
					"fBrNo": val,
				};
				this.axios.post('/perTaxToolTwo/e9/tfaaltermode/getAssetAlterModes', this.qs.stringify(params))

					.then(res => {
						if (res.data.code == 200) {
							var tem = res.data.data;
							this.tree1 = tem.filter(item => item.fid != 0);
							// this.tree1 = res.data.data;
							this.treeList1 = [];
							this.tree1.forEach((item, index) => {
								item.full = item.fnumber + '-' + item.fname
								if (item.fparentid == 0) {
									this.treeList1.push(item);

								}
							})
							this.treeList1 = JSON.parse(JSON.stringify(this.treeList1))
							console.log(this.treeList1)
							this.treeList1.forEach((item, index) => {
								item.children = [];
								this.tree1.forEach((item2, index2) => {
									if (item2.fparentid - 1 == index) {
										item.children.push(item2);

									}
								})
							})
							// this.$message({
							// 	message: res.data.msg,
							// 	type: 'success'
							// });
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
			//获取部门
			getDepartments(val) {
				let params = {
					"fBrNo": val,
				};
				this.axios.post('/perTaxToolTwo/e9/TDepartment/getDepartments', this.qs.stringify(params))

					.then(res => {
						if (res.data.code == 200) {
							this.departList = res.data.data;

							// this.$message({
							// 	message: res.data.msg,
							// 	type: 'success'
							// });
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
			//获取科目
			getProofTAccounts(val, index) {
				let params = {
					"id": index,
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
								// if (item.fparentid == 0) {
								// 	this.treeList3.push(item);

								// }

							})
							this.generateTree(this.tree3);
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
			},
			generateTree(data) {
				this.treeList3 = [];
				data.map((item) => {
					const list = this.getChildren(data)(item);
					if (list.length > 0) {
						item['children'] = list;
					}
					if (item.fparentid == 0) {
						this.treeList3.push(item);
					}


				})
				return this.treeList3;
			},
			getChildren(data) {
				return function(item) {
					const arr = []
					data.forEach((value) => {
						if (value.fparentid == item.faccountid) {
							arr.push(value);
						}
					});
					return arr;
				}
			},


			//获取卡片list
			getAssetCardsForAdd(val) {
				let params = {
					fYear: val.slice(0, 4),
					fPeriod: val.slice(5, 7),
					fChecked: -1,
					fBrNo: this.cardInfo.fBrNo,
				};
				this.axios.post('/perTaxToolTwo/e9/tfacard/getAssetCardsForAdd', this.qs.stringify(params))

					.then(res => {
						if (res.data.code == 200) {
							this.cardList = res.data.data;

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
			getAssetPeriod1(val) {
				if (val) {
					this.setfassetnumber(val);
					this.getGroupNameList(val);
					this.getAssetStatuss(val);
					//获取变动方式
					this.getAssetAlterModes(val);
					//获取部门
					this.getDepartments(val);
					//获取卡片list
					// this.getAssetCardsForAdd();
					//获取科目
					this.getProofTAccounts(val, 0);
				}


			},
			//获取账期
			getAssetPeriod(val) {

				let params = {
					"fBrNo": val,
				};
				this.axios.post('/perTaxToolTwo/e9/tSystemProfile/getAssetPeriod', this.qs.stringify(params))

					.then(res => {
						if (res.data.code == 200) {
							this.uploadData.fYear = res.data.data.fyear.toString();;
							this.uploadData.fPeriod = res.data.data.fperiod;
							// this.$message({
							// 	message: res.data.msg,
							// 	type: 'success'
							// });
						} else {
							// this.loading = false;
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


			getAssetPeriod2(val) {
				let params = {
					"fBrNo": val,
				};
				this.axios.post('/perTaxToolTwo/e9/tSystemProfile/getAssetPeriod', this.qs.stringify(params))

					.then(res => {
						if (res.data.code == 200) {
							this.discountfYear = res.data.data.fyear.toString();
							this.discountfPeriod = res.data.data.fperiod;
							// this.$message({
							// 	message: res.data.msg,
							// 	type: 'success'
							// });
						} else {
							// this.loading = false;
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
			
			getAssetPeriod3(val) {
				let params = {
					"fBrNo": val,
				};
				this.axios.post('/perTaxToolTwo/e9/tSystemProfile/getAssetPeriod', this.qs.stringify(params))
			
					.then(res => {
						if (res.data.code == 200) {
							// this.$set(this.clearInfo,'fDate_string',res.data.data.fyear.toString() + '-' + (res.data.data.fperiod<10?('0'+res.data.data.fperiod):res.data.data.fperiod))
							this.$set(this.clearInfo,'fDate_string', res.data.data.fbeginUseDate_string)
						} else {
							// this.loading = false;
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
				var var_table = "";
				var var_body = "";
				var var_head = "<table  cellspacing='0'  border='1' " +
					" style='border-collapse:collapse;border-color: Black;border-right-color: Black; font-size: 10pt; font-family: '宋体';' >";
				var_head += "<thead>" +
					"<tr ><th scope='col'  style='width: 80px;'>流水号</th>" +
					"<th scope='col' style='width: 60px;'>年度</th>" +
					"<th scope='col'  style='width: 60px;'>期间</th>" +
					"<th scope='col'  style='width: 150px;'>入账日期或<br>变动日期</th>" +
					"<th scope='col'   style='width: 200px;'>摘要</th>" +
					"<th scope='col' style='width: 60px;'>编码</th>" +
					"<th scope='col' style='width: 200px;'>名称</th>" +
					"<th scope='col' style='width: 50px;'>型号</th>" +
					"<th scope='col' style='width: 120px;' >类别</th></tr></thead><tbody>";
				var var_foot = "</tbody></table>";
				var rows = this.tableData;
				for (var i = 0; i < rows.length; i++) {
					var row = rows[i];
					var fAlterID = this.string_isNull(row.fAssetID);
					var fYear = this.string_isNull(row.fyear);
					var fPeriod = this.string_isNull(row.fPeriod);
					var fVoucherDate_string = this.string_isNull(row.fvoucherDate_string);
					var fExplanation = this.string_isNull(row.fexplanation);
					var fAssetNumber = this.string_isNull(row.fassetnumber);
					var fAssetName = this.string_isNull(row.fassetname);
					var fGroupName = this.string_isNull(row.fgroupName);
					var length_fAssetName = this.getStrLength(fAssetName);
					var_body += "<tr >";
					var_body += "<td style='width:80px;'  align='center'>" + fAlterID + "</td>";
					var_body += "<td style='width:60px;'  align='center'>" + fYear + "</td>";
					var_body += "<td style='width:60px;'  align='center'>" + fPeriod + "</td>";
					var_body += "<td style='width:150px;' align='center'>" + fVoucherDate_string + "</td>";
					var_body += "<td style='width:200px;' align='left'>" + fExplanation + "</td>";
					var_body += "<td style='width:60px;'  align='center'>" + fAssetNumber + "</td>";
					if (length_fAssetName > 32) {
						var_body += "<td style='width:200px;font-size: 7pt;' align='left'>" + fAssetName + "</td>";

					} else {
						var_body += "<td style='width:200px;' align='left'>" + fAssetName + "</td>";
					}
					var_body += "<td style='width:50px;' align='left'>" + "  " + "</td>";
					var_body += "<td style='width:120px;'  align='left'>" + fGroupName + "</td>";
					var_body += "</tr>";
				}
				var_table = var_head + var_body + var_foot;
				var LODOP = this.getLodop(document.getElementById('LODOP_OB'), document
					.getElementById('LODOP_EM'));
				/*var LODOP = getCLodop();*/
				if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) return;
				LODOP.PRINT_INIT("KPBDY"); // 卡片表打印
				LODOP.SET_PRINT_STYLE("FontSize", 10);
				LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");

				LODOP.ADD_PRINT_TEXT(20, 422, 175, 30, "卡片表");
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
				LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
				//	 var fBrNo = $("#vouchers_CustomerName_combobox").combobox('getText');
				LODOP.ADD_PRINT_TEXT(50, 50, 500, 25, "单位名称：" + this.fBrNo);
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				var ss = "资产账簿： 主账簿";

				LODOP.ADD_PRINT_TEXT(50, 800, 250, 25, ss);
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				LODOP.ADD_PRINT_TABLE(75, 50, 1050, 570, var_table);

				LODOP.PREVIEW();
			},
			//====判断是否需要安装CLodop云打印服务器:====
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

		},
		computed: {},
		created() {
			//获取账期
			// this.getAssetPeriod();
			//获取资产类别
			// this.getGroupNameList();
			//获取使用状况
			// this.getAssetStatuss();
			//获取变动方式
			// this.getAssetAlterModes();
			//获取部门
			// this.getDepartments();
			//获取卡片list
			// this.getAssetCardsForAdd();
			//获取科目
			// this.getProofTAccounts(0);
			this.getPeriodCustList();
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

		/deep/ .el-breadcrumb {
			height: 40px;
			line-height: 40px;
			background: rgb(234, 244, 255);
			padding-left: 20px;
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
			height: 100px;
			padding-left: 20px;
			/* padding-top: 12px; */
			margin: 10px 20px;

			h3 {
				line-height: 40px;
				height: 40px;
				margin-bottom: 5px;
			}

			.info {
				height: 40px;
				line-height: 40px;
			}

			a {
				margin-left: 10px;
			}
		}

		.main_contain {
			/* background: #fff; */
			margin: 0 20px;
			padding: 0px 0px;
			height: calc(100% - 190px);

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

	.chart_contain {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-start;
		flex-direction: row;

	}

	.card_head {
		width: 100%;
		font-size: 20px;
		color: #409eff;
		text-align: center;
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

	.card {
		background: #fff;
		width: 250px;
		height: 250px;
		margin-right: 20px;
		margin-bottom: 20px;
		position: relative;

		.text_contain {
			position: absolute;
			width: 100%;
			height: 40px;
			line-height: 40px;
			bottom: 0;
			text-align: center;
			color: limegreen;

			.text1 {
				cursor: pointer;
				margin-right: 10px
			}
		}


		.card_first {




			div.p_first {

				height: 40px;
				background: rgb(125, 195, 109);
				background-size: auto 150px;
				color: #fff;
				box-sizing: border-box;
				border-top-right-radius: 4px;
				border-top-left-radius: 4px;
				padding: 0 12px;

				font-size: 14px;
				line-height: 40px;
				/* border-bottom: 1px solid #fff; */
				/* text-align: center; */
				padding-left: 20px;

			}

			span {
				cursor: pointer;
				margin-right: 12px;
				margin-top: 4px;
			}

		}

		.charts {
			height: 200px;
			padding-top: 10px;

			p span {
				height: 20px;
				line-height: 20px;
			}

			p span:nth-of-type(2n) {
				float: left;
				width: 40%;
				text-align: right;
				padding-right: 20px;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			p span:nth-of-type(2n+1) {
				float: left;
				width: 60%;
				text-indent: 20px;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
		}

	}

	/deep/ .dialog {

		.title {
			height: 0.4rem;
			line-height: 0.4rem;
			font-size: 0.16rem;
			color: #333;
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

		ul {
			background: #f8f8f8;
			padding-left: 0.24rem;
			padding-right: 0.24rem;
			padding-top: 0.2rem;
			height: 3.5rem;
			overflow-y: auto;
			margin-top: 0.1rem;

			li {
				height: 0.24rem;
				font-size: 0.12rem;
			}
		}

		.mark {
			color: #ed878e;
		}

		/deep/ .el-dialog__body {
			padding-top: 0;
		}

		/deep/ .el-tabs__content {
			height: 550px;
			overflow: auto;
		}

		/deep/ .el-select,
		/deep/ .el-input,
		/deep/ .el-date-editor {
			width: 190px;
		}

		/deep/ .el-range-editor {
			width: 240px;
		}

		/*/deep/ .el-input__inner {
			height: 18px;
			line-height: 18px;
		}*/
		/deep/ .el-input__icon {
			height: 100%;
			width: 25px;
			text-align: center;
			line-height: 18px;
		}

		/deep/ .longLabel .el-form-item__label {
			line-height: 16px;
		}

		/deep/ .textareaWidth .el-textarea {
			width: 830px
		}

		/*滚动条样式*/
		::-webkit-scrollbar {
			width: 0.04rem;
			height: 0.04rem;
		}

		::-webkit-scrollbar-thumb {
			border-radius: 0.10rem;
			-webkit-box-shadow: inset 0 0 0.05rem rgba(0, 0, 0, 0.2);
			background: rgba(0, 0, 0, 0.2);
		}

		::-webkit-scrollbar-track {
			-webkit-box-shadow: inset 0 0 0.05rem rgba(0, 0, 0, 0.2);
			border-radius: 0;
			background: rgba(0, 0, 0, 0.1);
		}
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
</style>
