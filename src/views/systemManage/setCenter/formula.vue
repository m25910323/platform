<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
					<el-form-item label="省份选择:">
						<el-select v-model="division" @change='getArea'>
							<el-option v-for='item in divisionList' :label="item.divisionName" :value="item.divisionName"></el-option>

						</el-select>
					</el-form-item>
					<el-form-item label="城市选择:">
						<el-select v-model='temArea' value-key='divisionCode'>
							<el-option v-for='item in areaList' :label="item.divisionName" :value="item" :key='item.divisionCode'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" size="mini" @click='setArea'>确认城市</el-button>
					</el-form-item>
				</el-form>
				<div class='info clearfix'>
					<span class='large'>公式配备</span>
					<!-- <span class='mini'>查看已配备公式>></span> -->
					<el-button type="primary" @click='downLoad' size="mini">下载资料</el-button>
				</div>
			</div>
			<div class="contain_body">
				<el-form :inline="true" :model="formInline" class="demo-form-inline" label-position='left' :rules="rules" ref="ruleForm"
				 size="mini" v-show='!isEdit'>
					<el-form-item label="纳税人类型:" class='short' prop="taxesTaxType">
						<el-select clearable v-model="formInline.taxesTaxType">
							<el-option v-for='item in dicNameList' :label="item.dicName" :value="item.dicValue"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="公式类型:" prop="tmplShowType">
						<el-select v-model="formInline.tmplShowType" @change='resetSelect'>
							<el-option label="发票" value="0"></el-option>
							<el-option label="其他模板" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="计税方法:" prop="taxCalcType" v-show='formInline.tmplShowType=="0"' class='long'>
						<el-select clearable v-model="formInline.taxCalcType">
							<el-option v-for='item in taxCalcTypeList' :label="item.dicName" :value="item.dicValue"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发票类型:" prop="invoiceType" v-show='formInline.tmplShowType=="0"'>
						<el-select clearable v-model="formInline.invoiceType" @change='getInvoiceName' value-key='typeString' filterable>
							<el-option v-for='item in invoiceTypeList[0].list' :label="item.typeString" :value="item"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发票名称:" prop="invoiceName" v-show='formInline.tmplShowType=="0"'>
						<el-select clearable v-model="formInline.invoiceName" @change='getE9zConfigInvoice' value-key='invoiceId' filterable>
							<el-option v-for='item in invoiceNameList' :label="item.invoiceName" :value="item"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="相关列类型:" prop="e9z" v-show='formInline.tmplShowType=="0"' class='long'>
						<el-select clearable v-model="formInline.e9z" @change='setFormula' value-key='columnId'>
							<el-option v-for='item in e9zConcat' :label="item.columnTitle" :value="item"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="模板名称:" prop="tmplName" v-show='formInline.tmplShowType=="1"'>
						<el-select clearable v-model="formInline.tmplName" @change='getColumnTitle' value-key='tmplId'>
							<el-option v-for='item in templateTypeList[0].list' :label="item.tmplName" :value="item"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="相关列类型:" prop="columnTitle" v-show='formInline.tmplShowType=="1"'>
						<el-select clearable v-model="formInline.columnTitle" @change='setFormula' value-key='tag'>
							<el-option v-for='item in e9zConfigInvoiceColumn' :label="item.columnTitle" :value="item"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="原计算公式" class='line'>
						<el-input v-model='formInline.originformula' disabled></el-input>
					</el-form-item>
					<el-form-item label="计算公式" class='line'>
						<el-input v-model='formInline.formula' ref='inp' disabled></el-input>
						<el-button type='warning' :disabled='canCommit' @click='resetFormula'>清空</el-button>
					</el-form-item>
					<el-form-item style='margin-bottom: 0.10rem;' v-if="formInline.e9z && formInline.tmplShowType == '0' || formInline.columnTitle && formInline.tmplShowType == '1'">
						<div>
							<el-button style='margin-left: 0rem;margin-right: 0.10rem;' type='mini' v-for='item in cal' @click='createFormula(item.dicName)'>{{item.dicName}}</el-button>
						</div>

					</el-form-item>

					<el-form-item v-if="formInline.e9z && formInline.tmplShowType == '0' || formInline.columnTitle && formInline.tmplShowType == '1'">
						<div>
							<el-button style='margin-left: 0rem;margin-right: 0.10rem;' type='mini' v-for='item in formulaTitleList' @click='createFormula(item.columnTitle)'>{{item.columnTitle}}</el-button>

						</div>

					</el-form-item>
				</el-form>
				<!-- 修改 -->
				<el-form :inline="true" :model="formInline1" class="demo-form-inline" label-position='left' size="mini" v-show='isEdit' ref="ruleForm1">
					<el-form-item label="纳税人类型:" class='short' prop="taxesTaxType">
						<el-input disabled v-model='formInline1.taxesTaxType'></el-input>
					</el-form-item>
					<el-form-item label="公式类型:" prop="tmplShowType">
						<el-input disabled v-model='formInline1.tmplShowTitle'></el-input>

					</el-form-item>
					<el-form-item label="计税方法:" prop="taxCalcType" v-show='formInline1.tmplShowType==0' class='long'>
						<el-input disabled v-model='formInline1.taxCalcType'></el-input>
					</el-form-item>
					<el-form-item label="发票类型:" prop="invoiceType" v-show='formInline1.tmplShowType==0'>
						<el-input disabled v-model='formInline1.invoiceType'></el-input>

					</el-form-item>
					<el-form-item label="发票名称:" prop="invoiceName" v-show='formInline1.tmplShowType==0'>
						<el-input disabled v-model='formInline1.invoiceName'></el-input>
					</el-form-item>
					<el-form-item label="相关列类型:" prop="e9z" v-show='formInline1.tmplShowType==0' class='long'>
						<el-input disabled v-model='formInline1.columnTitle'></el-input>
					</el-form-item>
					<el-form-item label="模板名称:" prop="tmplName" v-show='formInline1.tmplShowType==1'>
						<el-input disabled v-model='formInline1.tmplName'></el-input>
					</el-form-item>
					<el-form-item label="相关列类型:" prop="columnTitle" v-show='formInline1.tmplShowType==1'>
						<el-input disabled v-model='formInline1.columnTitle'></el-input>

					</el-form-item>
					<el-form-item label="原计算公式" class='line'>
						<el-input v-model='formInline1.originformula' ref='inp' disabled></el-input>
					</el-form-item>
					<el-form-item label="计算公式" class='line'>
						<el-input v-model='formInline1.formula' ref='inp' disabled></el-input>
						<el-button type='warning' :disabled='canCommit' @click='resetFormula1'>清空</el-button>
					</el-form-item>
					<el-form-item style='margin-bottom: 0.10rem;' v-if="formInline.e9z && formInline.tmplShowType == '0' || formInline.columnTitle && formInline.tmplShowType == '1'">
						<div>
							<el-button style='margin-left: 0rem;margin-right: 0.10rem;' type='mini' v-for='item in cal' @click='createFormula(item.dicName)'>{{item.dicName}}</el-button>
						</div>

					</el-form-item>

					<el-form-item v-if="formInline.e9z && formInline.tmplShowType == '0' || formInline.columnTitle && formInline.tmplShowType == '1'">
						<div>
							<el-button style='margin-left: 0rem;margin-right: 0.10rem;' type='mini' v-for='item in formulaTitleList' @click='createFormula(item.columnTitle)'>{{item.columnTitle}}</el-button>

						</div>

					</el-form-item>

					<el-form-item style='margin-bottom: 0.10rem;' v-if="isEdit && formInline1.formulaId">
						<div>
							<el-button style='margin-left: 0rem;margin-right: 0.10rem;' type='mini' v-for='item in cal' @click='createFormula1(item.dicName)'>{{item.dicName}}</el-button>
						</div>

					</el-form-item>
					<el-form-item v-if="isEdit && formInline1.formulaId">
						<div>
							<el-button style='margin-left: 0rem;margin-right: 0.10rem;' type='mini' v-for='item in formulaTitleList1' @click='createFormula1(item.columnTitle)'>{{item.columnTitle}}</el-button>

						</div>

					</el-form-item>

				</el-form>

				<!-- <div v-if='showCommitBtn'> -->
				<div v-show="formInline.e9z && formInline.tmplShowType == '0'">
					<p>我们将根据您输入的 <span>'发票类型' '税种类型'</span> 还有 <span>'税种公式'</span> ，及时的做出相应的计算公式反馈。</p>

					<p>公式：{{formInline.formula}}</p>
				</div>
				<div v-show="isEdit && formInline1.tmplShowType == 0 && formInline1.formulaId">
					<p>我们将根据您输入的 <span>'发票类型' '税种类型'</span> 还有 <span>'税种公式'</span> ，及时的做出相应的计算公式反馈。</p>

					<p>公式：{{formInline1.formula}}</p>
				</div>
				<div v-show="formInline.columnTitle && formInline.tmplShowType == '1'">
					<p>我们将根据您输入的 <span>'模板名称' </span> 还有 <span>'相关列类型'</span> ，及时的做出相应的计算公式反馈。</p>
					<p>公式：{{formInline.formula}}</p>
				</div>
				<div v-show="isEdit && formInline1.tmplShowType == 1 && formInline1.formulaId">
					<p>我们将根据您输入的 <span>'模板名称' </span> 还有 <span>'相关列类型'</span> ，及时的做出相应的计算公式反馈。</p>
					<p>公式：{{formInline1.formula}}</p>
				</div>
				<el-button v-show="formInline.e9z || formInline.columnTitle" type="danger" class='confirm' @click='judgeRegExp("ruleForm")'>确认并添加</el-button>
				<div class='btn_contain' style="text-align: center;">
					<el-button v-show="isEdit" type="danger" class='confirm' style='display: inline-block;margin-right: 0.2rem;'
					 @click='cancelModify'>取消修改</el-button>
					<el-button v-show="isEdit" type="primary" class='confirm' style='display: inline-block;' @click='judgeRegExp1("ruleForm1")'>确认并修改</el-button>
				</div>
			</div>
		</div>
		<div class="right_contain">
			<div class="contain_header">
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
					<!-- <el-form-item label="省份选择:">
						<el-select clearable v-model="formInline.province">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="城市选择:">
						<el-select clearable v-model="formInline.area">
							<el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option>
						</el-select>
					</el-form-item> -->
					<el-form-item label="纳税人类型:">
						<el-select clearable v-model="searchTaxesTaxType">
							<el-option v-for='item in dicNameList' :label="item.dicName" :value="item.dicValue"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="公式类型:">
						<el-select clearable v-model="searchTmplShowType" @change='resetFilter'>
							<el-option label="发票" value="0"></el-option>
							<el-option label="其他模板" value="1"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="计税方法:" v-if="searchTmplShowType == '0'">
						<el-select clearable v-model="searchTaxCalcType">
							<el-option v-for='item in taxCalcTypeListRight' :label="item.dicName" :value="item.dicValue"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发票类型:" v-if="searchTmplShowType == '0'">
						<el-select clearable v-model="searchInvoiceType">
							<el-option v-for='item in invoiceTypeSearchList' :label="item.invoiceType" :value="item.invoiceType"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发票名称:" v-if="searchTmplShowType == '0'">
						<el-select clearable v-model="searchInvoiceName" @change='getE9zConfigInvoice'>
							<el-option v-for='item in invoiceNameSearchList' :label="item.invoiceName" :value="item.invoiceName"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="模板名称:" v-if="searchTmplShowType == '1'">
						<el-select clearable v-model="searchTmplName" @change='getColumnTitle' value-key='tmplId'>
							<el-option v-for='item in templateListSearchList' :label="item.tmplName" :value="item"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="相关列类型:" v-if="searchTmplShowType == '0'">
						<el-input v-model="searchColumnTitle">
						</el-input>
					</el-form-item>
					<el-form-item label="相关列类型:" v-if="searchTmplShowType == '1'">
						<el-input v-model="searchColumnTitle">
						</el-input>
					</el-form-item>
				</el-form>
				<el-button type="primary" @click="filterFormula" size="medium">立即<br />查询</el-button>
			</div>
			<div class="contain_body">
				<h3>税种公式<span>{{areaName}}</span></h3>
				<!-- <ul>
					<li v-for="(item,index) in formulaList" @click='clickFormula(item,index)' :class="{active : active == index}" >
						<span class='formula span1' :title="item.tmpl_name">{{item.tmpl_name}}</span>
						<span class='formula span1' :title="item.invoice_name + item.invoice_category + item.invoice_type">{{item.invoice_name}}
							{{item.invoice_category}} {{item.invoice_type}}</span>

						<span class='formula span2' :title='item.column_title'>{{item.column_title}}</span>
						<span class='formula span3' :title='item.formula'>{{item.formula}}</span>
					</li>
				</ul> -->

				<el-table :data="formulaList" style="width: calc(100% - 0.4rem);margin: 0px 0.2rem;box-sizing: border-box;" stripe
				 border ref="table" highlight-current-row @row-click='clickFormula' :row-class-name="tableRowClassName">
					<el-table-column align="center" label="发票/模板名称" prop="show_name" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="税率" :resizable="false">
						<template slot-scope="scope">
							<span>{{item.invoice_name?item.invoice_name:''}}{{item.invoice_category}} {{item.invoice_type}}</span>
						</template>
					</el-table-column> -->
					<el-table-column align="center" label="相关列类型" prop="column_title" :resizable="false"></el-table-column>
					<el-table-column align="center" label="公式" :resizable="false">
						<template slot-scope="scope">
							<el-popover trigger="hover" placement="top" width="200">
								<p>{{ scope.row.formula }}</p>
								<div slot="reference" class="name-wrapper">
									<el-tag size="medium">{{ scope.row.formula }}</el-tag>
								</div>
							</el-popover>
						</template>
					</el-table-column>
					<!-- <el-table-column align="center" label="操作" :resizable="false">
						<template slot-scope="scope">
							<el-button @click="deleteRow(scope.row)" type="text" size="small">
								删除
							</el-button>
						</template>
					</el-table-column> -->
				</el-table>


				<el-pagination background layout="prev, pager, next" :total="total" :page-size=15 @current-change='handleCurrentChange'
				 :current-page="currentPage">
				</el-pagination>
			</div>

		</div>
	</div>
</template>

<script>
	// import searchModule from "../components/customer/searchModule.vue"
	// import listModule from "../components/customer/listModule.vue"
	export default {
		name: "router1",
		data() {
			return {
				division: '江苏省',
				temArea: {
					city: "1",
					committee: "0",
					country: "0",
					divId: 15980,
					divisionCode: "320100000000",
					divisionName: "南京市",
					parentName: "江苏省",
					province: "32",
					street: "0"
				},
				area: "320100000000",
				areaName: '南京市',
				divisionList: [],
				areaList: [],
				formInline: {
					taxesTaxType: '',
					taxCalcType: '',
					tmplShowType: "0",
					invoiceType: "",
					invoiceName: '',
					e9z: "",
					formula: "",
					originformula:'',
					tmplName: '',
					columnTitle: '',
				},
				formInline1: {
					taxesTaxType: '',
					taxCalcType: '',
					tmplShowType: '',
					tmplShowTitle: '',
					invoiceType: "",
					invoiceName: '',
					formula: "",
					originformula:'',
					columnTitle: '',
				},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				showCommitBtn: false,
				// canInput: true,
				canCommit: false,

				active: -1,
				dicNameList: [],
				taxCalcTypeList: [],
				taxCalcTypeListRight: [],
				invoiceTypeList: [{
					list: "",
				}],
				invoiceNameList: [],
				e9zConfigInvoiceColumnList: [],
				e9zConfigInvoiceTaxesList: [],
				e9zConcat: [],
				formulaList: [],
				templateTypeList: [{
					list: "",
				}, {
					list: "",
				}],
				e9zConfigInvoiceColumn: [],
				formulaTitleList: [],
				formulaTitleList1: [],
				searchTaxesTaxType: '',
				searchInvoiceType: '',
				searchTmplShowType: '',
				searchTaxCalcType: '',
				searchInvoiceName: '',
				searchTmplName: '',
				searchColumnTitle: '',

				invoiceTypeSearchList: [],
				invoiceNameSearchList: [],
				templateListSearchList: [],
				formulaExcelList: [],
				rules: {
					taxesTaxType: [{
						required: true,
						message: '请选择纳税人类型',
						trigger: 'change'
					}],
					tmplShowType: [{
						required: true,
						message: '请选择公式类型',
						trigger: 'change'
					}],
					taxCalcType: [{
						required: true,
						message: '请选择计税方法',
						trigger: 'change'
					}],
					invoiceType: [{
						required: true,
						message: '请选择发票类型',
						trigger: 'change'
					}],
					invoiceName: [{
						required: true,
						message: '请选择发票名称',
						trigger: 'change'
					}],
					e9z: [{
						required: true,
						message: '请选择税种及相关列类型',
						trigger: 'change'
					}],
					tmplName: [{
						required: true,
						message: '请选择模板名称',
						trigger: 'change'
					}],
					columnTitle: [{
						required: true,
						message: '请选择相关列类型',
						trigger: 'change'
					}],
				},
				isEdit: false,
				cal: ["+", "-", "*", "/", "(", ")", ",", "if", "<", ">", "="]

			}
		},
		components: {
			// searchModule,
			// listModule
		},
		methods: {
			/*
			 * 获取省份
			 * {params}
			 * 无	
			 * */
			queryDivision() {
				this.axios.post('/perTaxToolTwo/e9z/configDivision/selectDivision')
					.then(res => {
						if (res.data.code == 200) {
							this.divisionList = res.data.data;
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
						this.$message({
							message: '获取省份失败',
							type: 'error'
						});
					})
			},
			/*
			 * 获取城市
			 * {params}
			 * 无
			 * */
			getArea() {
				this.temArea = {};
				let params = {
					"parentName": this.division
				};
				this.axios.post('/perTaxToolTwo/e9z/configDivision/selectArea', params)
					.then(res => {
						if (res.data.code == 200) {
							this.areaList = res.data.data;
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
						this.$message({
							message: '获取省份失败',
							type: 'error'
						});
					})
			},
			getAreaDefault() {
				let params = {
					"parentName": this.division
				};
				this.axios.post('/perTaxToolTwo/e9z/configDivision/selectArea', params)
					.then(res => {
						if (res.data.code == 200) {
							this.areaList = res.data.data;
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
						this.$message({
							message: '获取省份失败',
							type: 'error'
						});
					})
			},
			setArea() {
				console.log(this.temArea);
				this.area = this.temArea.divisionCode;
				this.areaName = this.temArea.divisionName;

				this.queryFormulaList();
				this.queryInvoiceType();
				this.queryInvoiceName();
				this.queryTemplateList();
				this.resetSelect();
				this.resetFilter()
			},
			/*
			 * 获取纳税人类型下拉列表
			 * {params}
			 * 无
			 * 一般纳税，小规模纳税
			 * */
			queryDicName() {
				this.axios.post('/perTaxToolTwo/e9z/configDictionary/findDictionayList?dicName=税务类型').then(res => {
					this.dicNameList = res.data.data;
				}).catch(function(err) {
					this.$message({
						message: '获取纳税人类型失败',
						type: 'error'
					});
				})
			},

			/*
			 * 获取计税方法下拉列表
			 * {params}
			 * 无
			 * 一般计税，简易计税
			 * */
			queryRate() {
				this.axios.post('/perTaxToolTwo/e9z/configDictionary/findDictionayList?dicName=计税方法').then(res => {
					this.taxCalcTypeListRight = res.data.data;
				}).catch(function(err) {
					this.$message({
						message: '获取计税方法失败',
						type: 'error'
					});
				})
			},
			queryRateMethods(taxesTaxType) {
				this.resetSelect();
				this.axios.post('/perTaxToolTwo/e9z/configDictionary/findInvoiceTaxCalcType?dicName=计税方法').then(res => {
					this.taxCalcTypeList = res.data.data;
				}).catch(function(err) {
					this.$message({
						message: '获取计税方法失败',
						type: 'error'
					});
				})
			},
			/*
			 * 获取公式字符下拉列表
			 * {params}
			 * 无
			 * +-*等
			 * */
			queryCalSymbol() {
				this.axios.post('/perTaxToolTwo/e9z/configDictionary/findDictionayList?dicName=公式字符').then(res => {
					this.cal = res.data.data;
				}).catch(function(err) {
					this.$message({
						message: '获取公式字符失败',
						type: 'error'
					});
				})
			},

			/*
			 * 根据发票类型获取发票名称
			 * */
			getInvoiceName(value) {
				this.formInline.invoiceName = "";
				this.invoiceNameList = value.invoiceList;
			},
			/*
			 * 根据发票名称获取税种及相关列类型
			 * */
			getE9zConfigInvoice(value) {
				this.e9zConfigInvoiceColumnList = value.e9zConfigInvoiceColumnList;
				// this.e9zConfigInvoiceTaxesList = value.e9zConfigInvoiceTaxesList;
				// this.e9zConcat = this.e9zConfigInvoiceColumnList.concat(this.e9zConfigInvoiceTaxesList);
				this.e9zConcat = this.e9zConfigInvoiceColumnList;
				this.e9zConcat.forEach((item, index) => {
					item.tag = index;
				})
			},
			/*
			 * 根据模板名称获取相关列类型
			 * */
			getColumnTitle(value) {
				this.e9zConfigInvoiceColumn = value.e9zConfigInvoiceColumnList;
				this.e9zConfigInvoiceColumn.forEach((item, index) => {
					item.tag = index;
				})
			},

			/*
			 * 根据税种及相关列获取已有的计算公式
			 * */
			setFormula(value) {
				console.log(value)
				this.formInline.originformula = value.formula ? value.formula : '';
				this.formInline.formula = value.formula ? value.formula : '';
			},
			/*
			 * 获取右侧税种公式列表
			 * */
			queryFormulaList() {
				var _this = this;
				let params = {
					taxesTaxType: this.searchTaxesTaxType,
					taxCalcType: this.searchTaxCalcType,
					tmplShowType: this.searchTmplShowType,
					invoiceType: this.searchInvoiceType,
					invoiceName: this.searchInvoiceName,
					invoiceTmplId: this.searchTmplName.tmplId,
					columnTitle: this.searchColumnTitle,
					area: this.area
				};
				this.axios.post('/perTaxToolTwo/e9z/configInvoiceFormula/selectFormulaList?currentPage=' + this.currentPage +
						'&pageCount=' + this.pageSize, params)
					.then(res => {
						if (res.data.code == 200) {
							this.formulaList = res.data.data.list;
							this.length = this.formulaList.length;
							this.total = res.data.data.total;
							for (let i = 0; i < _this.pageSize - _this.length; i++) {
								_this.formulaList.push({});
							}
							console.log(this.formulaList)
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
						this.$message({
							message: '获取税种公式列表失败',
							type: 'error'
						});
					})
			},
			/*
			 * 点击公式字符和中文字符生成公式
			 * 
			 * */
			createFormula(value) {
				this.formInline.formula += value;
			},
			createFormula1(value) {
				this.formInline1.formula += value;
			},
			/*
			 * 判断公式合法性并创建公式
			 * 
			 * */
			judgeRegExp(formName) {
				if (this.regExpUtil.formulaRegExp(this.formInline.formula).type == 'success') {
					this.$message({
						message: this.regExpUtil.formulaRegExp(this.formInline.formula).msg,
						type: 'success'
					});
					if (this.formInline.tmplShowType == '0') {
						var params = {
							// invoiceTaxesId: this.formInline.e9z.columnId || this.formInline.e9z.invoiceTaxesId,
							invoiceTaxesId: this.formInline.e9z.columnId,
							formulaId: this.formInline.e9z.formulaId,
							taxesTaxType: this.formInline.taxesTaxType,
							formula: this.formInline.formula,
							// type: this.formInline.e9z.columnId ? 2 : 1,
							// taxesTitle: this.formInline.e9z.taxesTitle,
						};
					} else {
						var params = {
							invoiceTaxesId: this.formInline.columnTitle.columnId,
							formulaId: this.formInline.columnTitle.formulaId,
							taxesTaxType: this.formInline.taxesTaxType,
							formula: this.formInline.formula,
							// type: 2
						};
					}

					this.axios.post('/perTaxToolTwo/e9z/configInvoiceFormula/updateInvoiceFormulaById', params).then(res => {
						if (res.data.code == 200) {
							this.$message({
								message: '公式添加成功',
								type: 'success'
							});
							this.resetSelect();
							this.formInline.tmplShowType = '0';
							this.queryFormulaList();
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
						this.$message({
							message: '公式添加失败',
							type: 'error'
						});
					})
					// this.showCommitBtn = true;
				} else {
					this.$message.error(this.regExpUtil.formulaRegExp(this.formInline.formula));
					// this.showCommitBtn = false;
				}
			},

			judgeRegExp1(formName) {
				if (this.regExpUtil.formulaRegExp(this.formInline1.formula).type == 'success') {
					this.$message({
						message: this.regExpUtil.formulaRegExp(this.formInline1.formula).msg,
						type: 'success'
					});
					var params = {
						formulaId: this.formInline1.formulaId,
						formula: this.formInline1.formula,
					};

					this.axios.post('/perTaxToolTwo/e9z/configInvoiceFormula/updateInvoiceFormulaById', params).then(res => {
						if (res.data.code == 200) {
							this.$message({
								message: '公式修改成功',
								type: 'success'
							});
							this.resetSelect1();
							this.queryFormulaList();
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
						this.$message({
							message: '公式添加失败',
							type: 'error'
						});
					})
					// this.showCommitBtn = true;
				} else {
					this.$message.error(this.regExpUtil.formulaRegExp(this.formInline.formula));
					// this.showCommitBtn = false;
				}
			},
			/*
			 * 清空公式按钮
			 * 
			 * */
			resetFormula() {
				this.formInline.formula = "";
			},
			resetFormula1() {
				this.formInline1.formula = "";
			},
			resetSelect(val) {
				this.formInline.taxCalcType = '';
				this.formInline.invoiceType = '';
				this.formInline.invoiceName = '';
				this.formInline.e9z = '';
				this.formInline.tmplName = '';
				this.formInline.columnTitle = '';
				this.formInline.formula = '';
			},
			resetSelect1(val) {
				this.formInline1.taxesTaxType = '';
				this.formInline1.tmplShowTitle = '';
				this.formInline1.tmplShowType = '';
				this.formInline1.taxCalcType = '';
				this.formInline1.invoiceType = '';

				this.formInline1.invoiceName = '';
				this.formInline1.columnTitle = '';
				this.formInline1.tmplName = '';
				this.formInline1.formula = '';
				this.formInline1.formulaId = '';
			},

			resetFilter(val) {
				this.searchTaxCalcType = '';
				this.searchInvoiceType = '';
				this.searchInvoiceName = '';
				this.searchTmplName = '';
				this.searchColumnTitle = '';
			},


			/*
			 * 查询右侧发票类型下拉列表
			 * {params}
			 * 无
			 * */
			queryInvoiceType() {
				let params = {
					"area": this.area
				};
				this.axios.post('/perTaxToolTwo/e9z/invoiceInfo/findInvoiceTypeByAreaAndState', params).then(res => {
					this.invoiceTypeSearchList = res.data.data;
				}).catch(function(err) {
					this.$message({
						message: '获取发票类型失败',
						type: 'error'
					});
				})
			},
			/*
			 * 查询右侧发票名称下拉列表
			 * {params}
			 * 无
			 * */
			queryInvoiceName() {
				let params = {
					"area": this.area
				};
				this.axios.post('/perTaxToolTwo/e9z/invoiceListInfo/findInvoiceName', params).then(res => {
					this.invoiceNameSearchList = res.data.data;
				}).catch(function(err) {
					this.$message({
						message: '获取发票名称失败',
						type: 'error'
					});
				})
			},
			/*
			 * 查询右侧模板名称下拉列表
			 * {params}
			 * 无
			 * */
			queryTemplateList() {
				let params = {
					"area": this.area
				};
				this.axios.post('/perTaxToolTwo/e9z/configTemplate/findTemplateList', params).then(res => {
					this.templateListSearchList = res.data.data;
				}).catch(function(err) {
					this.$message({
						message: '获取模板名称失败',
						type: 'error'
					});
				})
			},
			/*
			 * 公式过滤
			 * {params}
			 * 无
			 * */
			filterFormula() {
				this.queryFormulaList();
			},
			/*
			 * 公式过滤
			 * {params}
			 * 无
			 * */
			downLoad() {
				var _this = this;
				let params = {
					taxesTaxType: "",
					taxCalcType: "",
					tmplShowType: "",
					invoiceType: "",
					invoiceName: "",
					invoiceTmplId: "",
					columnTitle: "",
					area: this.area
				};
				this.axios.post('/perTaxToolTwo/e9z/configInvoiceFormula/selectFormulaList?currentPage=1' +
						'&pageCount=100000', params)
					.then(res => {
						if (res.data.code == 200) {
							this.formulaExcelList = res.data.data.list;
							var sheet = this.xlsx.utils.json_to_sheet(this.formulaExcelList);
							this.openDownloadDialog(this.sheet2blob(sheet), '税种公式.xlsx');
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
						this.$message({
							message: '获取税种公式列表失败',
							type: 'error'
						});
					})

			},
			sheet2blob(sheet, sheetName) {
				sheetName = sheetName || 'sheet1';
				var workbook = {
					SheetNames: [sheetName],
					Sheets: {}
				};
				workbook.Sheets[sheetName] = sheet;
				// 生成excel的配置项
				var wopts = {
					bookType: 'xlsx', // 要生成的文件类型
					bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
					type: 'binary'
				};
				var wbout = this.xlsx.write(workbook, wopts);
				var blob = new Blob([s2ab(wbout)], {
					type: "application/octet-stream"
				});
				// 字符串转ArrayBuffer
				function s2ab(s) {
					var buf = new ArrayBuffer(s.length);
					var view = new Uint8Array(buf);
					for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
					return buf;
				}
				return blob;
			},
			openDownloadDialog(url, saveName) {
				if (typeof url == 'object' && url instanceof Blob) {
					url = URL.createObjectURL(url); // 创建blob地址
				}
				var aLink = document.createElement('a');
				aLink.href = url;
				aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
				var event;
				if (window.MouseEvent) event = new MouseEvent('click');
				else {
					event = document.createEvent('MouseEvents');
					event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				}
				aLink.dispatchEvent(event);
			},

			/*
			 * 分页事件
			 * {params}
			 * 无
			 * */
			handleCurrentChange(val) {
				this.active = -1;
				this.currentPage = val;
				this.queryFormulaList();
				console.log(`当前页: ${val}`);
			},
			tableRowClassName({row,rowIndex}) {
				row.index = rowIndex;
			},
			clickFormula(row) {
				this.active = row.index;
				if (row.formula_id) {
					this.isEdit = true;
					this.formInline1.taxesTaxType = row.taxes_tax_type == 233 ? "一般纳税人" : "小规模纳税人";
					this.formInline1.tmplShowTitle = row.tmpl_show_type == 0 ? "发票" : '其他模板';
					this.formInline1.tmplShowType = row.tmpl_show_type;
					switch (row.tax_calc_type){
						case 1:
							this.formInline1.taxCalcType = '一般计税';
							break;
						case 2:
							this.formInline1.taxCalcType = '简易征收计税';
							break;
						case 3:
							this.formInline1.taxCalcType = '免税计税';
							break;
						default:
							break;
					}
					// this.formInline1.taxCalcType = row.tax_calc_type == 1 ? '一般计税' : '简易征收计税';
					this.formInline1.invoiceType = row.typeString;

					this.formInline1.invoiceName = row.invoice_name;
					this.formInline1.columnTitle = row.column_title;
					this.formInline1.tmplName = row.tmpl_name;
					this.formInline1.formula = row.formula;
					this.formInline1.originformula = row.formula;
					this.formInline1.formulaId = row.formula_id;

					this.resetSelect();
					this.queryFormulaTitleList(row);
				}

			},
			queryFormulaTitleList(item) {
				let params = {
					"taxesTaxType": item.taxes_tax_type,
					"tmplShowType": item.tmpl_show_type,
					"area": this.area
				};
				this.axios.post('/perTaxToolTwo/e9z/configColumn/findFormulaTitleList', params).then(res => {
					this.formulaTitleList1 = res.data.data;
				}).catch(function(err) {
					this.$message({
						message: '获取公式标题失败',
						type: 'error'
					});
				})
			},
			cancelModify() {
				this.isEdit = false;
				this.resetSelect1()
			}
		},
		watch: {
			"formInline.taxesTaxType": {
				handler(val, oldVal) {
					let params = {
						"taxesTaxType": val,
						"tmplShowType": this.formInline.tmplShowType,
						"area": this.area
					};
					this.axios.post('/perTaxToolTwo/e9z/configColumn/findFormulaTitleList', params).then(res => {
						this.formulaTitleList = res.data.data;
					}).catch(function(err) {
						this.$message({
							message: '获取公式标题失败',
							type: 'error'
						});
					})
					
					if(this.formInline.taxCalcType){
						let params = {
							"taxCalcType": this.formInline.taxCalcType,
							"taxesTaxType": this.formInline.taxesTaxType,
							"tmplShowType": this.formInline.tmplShowType,
							"area": this.area
						};
						this.axios.post('/perTaxToolTwo/e9z/invoiceInfo/findInvoiceFormula', params).then(res => {
							this.invoiceTypeList = res.data.data;
							this.invoiceNameList = this.invoiceTypeList[0].list.find((arg) => {
								return arg.typeString == this.formInline.invoiceType.typeString
							}).invoiceList;
							console.log('发票名称', this.invoiceNameList)
						}).catch(function(err) {
							this.$message({
								message: '获取发票/模板公式失败',
								type: 'error'
							});
						})
					}
				},
				deep: true

			},
			"formInline.taxCalcType": {
				handler(val, oldVal) {
					let params = {
						"taxCalcType": this.formInline.taxCalcType,
						"taxesTaxType": this.formInline.taxesTaxType,
						"tmplShowType": this.formInline.tmplShowType,
						"area": this.area
					};
					this.axios.post('/perTaxToolTwo/e9z/invoiceInfo/findInvoiceFormula', params).then(res => {
						this.invoiceTypeList = res.data.data;
						this.invoiceNameList = this.invoiceTypeList[0].list.find((arg) => {
							return arg.typeString == this.formInline.invoiceType.typeString
						}).invoiceList;
						console.log('发票名称', this.invoiceNameList)
					}).catch(function(err) {
						this.$message({
							message: '获取发票/模板公式失败',
							type: 'error'
						});
					})
				},
				deep: true



			},
			"formInline.tmplShowType": {
				handler(val, oldVal) {
					let params = {
						"taxesTaxType": this.formInline.taxesTaxType,
						"tmplShowType": this.formInline.tmplShowType,
						"area": this.area
					};
					this.axios.post('/perTaxToolTwo/e9z/configColumn/findFormulaTitleList', params).then(res => {
						this.formulaTitleList = res.data.data;
					}).catch(function(err) {
						this.$message({
							message: '获取模板名称失败',
							type: 'error'
						});
					})
					if (val == 1) {
						let params = {
							"taxesTaxType": this.formInline.taxesTaxType,
							"tmplShowType": this.formInline.tmplShowType,
							"area": this.area
						};
						this.axios.post('/perTaxToolTwo/e9z/invoiceInfo/findInvoiceFormula', params).then(res => {
							this.templateTypeList = res.data.data;
						}).catch(function(err) {
							this.$message({
								message: '获取发票/模板公式失败',
								type: 'error'
							});
						})
					}
				},
				deep: true
			},
			// 'formInline.invoiceType':{
			// 	this.invoiceNameList = value.invoiceList;
			// }
		},
		computed: {},
		created() {
			this.queryDicName();
			this.queryRate();
			this.queryRateMethods();
			this.queryFormulaList();
			this.queryCalSymbol();
			this.queryInvoiceType();
			this.queryInvoiceName();
			this.queryTemplateList();
			this.queryDivision();
			this.getAreaDefault()
		}
	}
</script>

<style lang='less' scoped>
	@button: #4cb6dc;
	@button_orange: #ffbb84;
	@blue: #4bb6dc;
	@orange: #ffb980;
	@pcolor: #999;
	@scolor: #ed878e;

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


	.blue {
		color: @blue
	}

	.main_contain {
		padding: 0.2rem;
		width: calc(100% - 0.4rem);
		height: calc(100% - 0.4rem);



		/deep/ input::-webkit-input-placeholder {
			/* placeholder颜色  */
			color: #fff;
		}


	}

	.left_contain {
		width: calc(50% - 0.15rem);
		background: #fff;
		border-radius: 0.06rem;
		float: left;
		min-height: 100%;

		.contain_header {
			height: 2rem;
			box-sizing: border-box;
			padding: 0.2rem 0.2rem;
			background: url(../../../assets/img/list-bg1.png) no-repeat;
			background-size: cover;
			border-top-left-radius: 0.06rem;
			border-top-right-radius: 0.06rem;
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			/deep/ .el-select__caret {
				color: #fff;
				// line-height: 0.4rem;
			}

			/deep/ .el-button {
				background: #fff;
				color: @button;
				// width: 1.3rem;
				// height: 0.40rem;
				// line-height: 0;
				border-color: #fff
			}

			/deep/ .el-input {
				font-size: 0.14rem
			}

			/deep/ .el-form-item__label {
				color: #fff
			}

			/deep/ .el-form {
				width: 100%;
				display: flex;
				flex-direction: row;
				justify-content: space-between;

				.el-form-item {
					margin-right: 0rem
				}
			}

			/deep/ .info {
				width: 100%;
				/* margin-top: 0.20rem; */

				/deep/ .el-button {
					float: right;
					background: #fff;
					color: @button;
					// width: 1.3rem;
					// height: 0.4rem;
					border-color: #fff
				}

				.large {
					font-size: 0.3rem;
					color: #fff
				}

				.mini {
					font-size: 0.16rem;
					color: #fff;
					margin-left: 0.20rem;
				}
			}

			/deep/ .el-input__inner {
				border: 0.01rem solid #fff;
				background: transparent;
				color: #fff;
				width: 1.8rem;
				// line-height: 0.4rem;
				// height: 0.4rem;
			}
		}

		.contain_body {
			padding: 0.2rem 0.2rem 0rem;
			height: calc(100% - 2rem);
			box-sizing: border-box;
			/* overflow-y: scroll; */
		}

		/deep/ .el-form {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			flex-wrap: wrap;

			/deep/ .el-form-item {
				margin-right: 0rem;

				label {
					// width: 1rem;
					font-size: 0.14rem;
					padding: 0 0.12rem 0 0;
				}

				.el-form-item__content {}

			}

			/deep/ .el-form-item.long {
				label {
					// width: 1.4rem;
				}

			}

			/deep/ .el-form-item.line {
				width: 100%;

				.el-form-item__content {
					width: calc(100% - 1rem);

					.el-input {
						width: calc(100% - 1.4rem);

						.el-input__inner {
							width: 100%;
						}

					}

					.el-button {
						width: 1.2rem;
						margin-left: 0.2rem;
						background-color: @orange;
						border-color: @orange;
					}
				}
			}
		}

		/deep/ .el-input__inner {
			width: 150px;
		}

		p {
			color: @pcolor;
			font-size: 0.14rem;
			line-height: 0.30rem;

			span {
				color: @scolor;
			}
		}

		.el-button.confirm {
			display: block;
			margin: 0.4rem auto;
			width: 2.8rem;
			height: 0.7rem;
			font-size: 0.18rem;
		}
	}

	.right_contain {
		width: calc(50% - 0.15rem);
		min-height: 100%;
		float: right;
		background: #fff;
		border-radius: 0.06rem;

		.contain_header {
			height: 2rem;
			box-sizing: border-box;
			padding: 0.2rem 0.2rem;
			display: flex;
			flex-direction: row;
			align-items: center;
			background: url(../../../assets/img/list-bg2.png) no-repeat;
			background-size: cover;
			border-top-left-radius: 0.06rem;
			border-top-right-radius: 0.06rem;

			/deep/ .el-select__caret {
				color: #fff;
				// line-height: 0.4rem;
			}

			/deep/ .el-input__inner {
				border: 0.01rem solid #fff;
				// line-height: 0.4rem;
				// height: 0.4rem;
			}

			/deep/ .el-button {
				background: #fff;
				color: @button_orange;
				width: 1.05rem;
				height: 1.20rem;
				margin-left: 0.30rem;
				border-color: #fff;
				font-size: 0.18rem;
				letter-spacing: 0.05rem;
				line-height: 2;
			}
		}

		/deep/ .el-form-item__label {
			color: #fff;
			font-size: 0.14rem
		}

		/deep/ .el-form {
			width: calc(100% - 1.35rem);
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			flex-wrap: wrap;
			// align-content: space-between;
			height: 100%;
			align-items: center;
			.el-form-item {
				margin-right: 0rem
			}
		}

		/deep/.el-form-item {
			/* width: 25%; */
			margin-bottom: 0rem;
		}

		/deep/ .info {
			width: 100%;
			margin-top: 0.20rem;

			/deep/ .el-button {
				float: right;
				background: #fff;
				color: @button;
				width: 1.30rem;
				height: 0.40rem;
				border-color: #fff
			}

			.large {
				font-size: 0.30rem;
				color: #fff
			}

			.mini {
				font-size: 0.16rem;
				color: #fff;
				margin-left: 0.20rem;
			}
		}

		/deep/ .el-input__inner {
			border: 0.01rem solid #fff;
			background: transparent;
			color: #fff;
			width: 150px
		}
	}

	/deep/ .el-tag {
		width: 100%;
		display: inherit;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.contain_body {
		h3 {
			/* margin-top: 0.24rem; */
			height: 0.60rem;
			line-height: 0.60rem;
			font-size: 0.18rem;
			color: #333;
			padding-left: 0.30rem;

			span {
				font-size: 0.14rem;
				color: #ccc;
				margin-left: 0.18rem;
				font-weight: normal;
			}
		}

		li {
			font-size: 14px;
			height: 0.28rem;
			line-height: 0.28rem;
			color: #454545;
			padding-left: 0.30rem;
			cursor: pointer;

			span.span1 {

				width: 1.60rem;
			}

			span.span2 {

				width: 1.60rem;
			}

			span.span3 {
				max-width: calc(100% - 3.90rem);
			}

			.formula {
				float: left;
				/* max-width: calc(100% - 140rem); */
				overflow: hidden;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
		}

		li:hover {
			background: #f9f9f9;
		}

		li.active {
			background: #f2f2f2;
		}

		span.blue {
			float: left;
			font-size: 0.14rem;
			margin-left: 0.10rem;
		}

		/deep/ .el-pagination {
			text-align: right;
			margin-top: 0.10rem;
		}

		/deep/ .el-pagination {
			text-align: right;
			margin-top: 0.10rem;
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

		/deep/ .el-table th {
			background-color: #ebf6fb;
		}

		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #ebf6fb;
		}

		.el-dialog .el-form {
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			flex-wrap: wrap
		}

		/deep/ .el-date-editor.el-input {
			width: 180px;
		}

		/deep/ .el-table__body tr,
		.el-table__body td {
			padding: 0;
			height: 40px;
			background-color: #fff7f1;
		}

		/deep/.el-table__body tr.current-row>td {
			background-color: #efe9e5;
		}

		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped.current-row td {
			background: #efe9e5;
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
	}
</style>
