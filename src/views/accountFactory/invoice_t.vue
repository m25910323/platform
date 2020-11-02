<template>
	<div class="main_contain" v-loading="loadingInsertReport" element-loading-text="报表生成中，请稍等...">
		<div class="left_contain">
			<div class='search_contain'>
				<el-form :inline="true" :model="searchList" class="demo-form-inline" size="mini" :rules="rulesSearch" ref='formSearch'>
					<el-form-item label="客户名称:" prop="value">
						<el-select v-model="searchList.value" @change="selectGet" placeholder="请选择" filterable :disabled="$route.query.index == 1">
							<!-- <el-option v-for="item in custList" :key="item.customerId" :label="item.customerName" :value="item.customerId">
							</el-option> -->
							<el-option v-for="item in searchList.options" :key="item.customerId" :label="item.customerName" :value="item.customerId">
							</el-option>

						</el-select>
					</el-form-item>
					<el-form-item label="账期:" prop="nowDate">
						<el-date-picker v-model="searchList.nowDate" type="month" placeholder="选择账期" clearable value-format='yyyy-MM'
						 :disabled="$route.query.index == 1">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="发票类型:">
						<el-select v-model="searchList.invoiceType" placeholder="请选择" clearable>
							<el-option v-for="item in invoiceTypeSelect" :key="item.invoiceType" :label="item.invoiceType" :value="item.invoiceType">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="发票名称:">
						<el-select v-model="searchList.invoiceName" placeholder="请选择" clearable>
							<el-option v-for="item in invoiceNameSelect" :key="item.invoiceListId" :label="item.invoiceName" :value="item.invoiceListId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item style="margin-bottom:0">
						<div class="searchButton" @click="search('formSearch')" style="margin-bottom:0.1rem;margin-right:0.1rem">查询</div>
					</el-form-item>
					<el-form-item style="margin-bottom:0">
						<div class="addInvioceButton" v-if="!issubmit" style="margin-right:0.1rem;margin-bottom:0.1rem" @click="deleteMoreInvoice()">批量删除</div>
					</el-form-item>
					<el-form-item style="margin-bottom:0">
						<div class="deleteButton" v-if="!issubmit && isRole" style="margin-right:0.1rem;margin-bottom:0.1rem" @click="submitStep('formSearch')">审批</div>
					</el-form-item>
					<el-form-item style="margin-bottom:0">
						<div class="deleteButton" v-if="!issubmit" style="margin-right:0.1rem;margin-bottom:0.1rem" @click="submitStep1('formSearch')">保存税款数据</div>
					</el-form-item>
					<el-form-item style="margin-bottom:0">
						<div class="deleteButton" v-if="!issubmit" style="margin-right:0.1rem;margin-bottom:0.1rem" @click="submitStep2('formSearch')">手动入税</div>
					</el-form-item>
					<el-form-item style="margin-bottom:0">
						<div class="importButton2" style="margin-right:0.1rem;margin-bottom:0.1rem" @click="insertReport('formSearch')"
						 v-show="!$route.query.index">生成报表</div>
					</el-form-item>
				</el-form>
			</div>
			<div class="invoice_oListModule">
				<div class="cardBox" v-loading="loadingCard">
					<div class="eachCard" v-if="showsum">
						<div class="topContent tophj hjColor">
							<p class="comName">{{customerName}}</p>
							<p class="dateName">{{accountPeriod}}</p>
							<p class="title">工资</p>
						</div>
						<div class="dataContent topData">
							<p class="number">税金：{{gsskhj}}元</p>
							<p style="text-align: center;">

								<el-button type="text" size="mini" @click='setgsskhj' :disabled="$route.query.index == 1">无工资</el-button>
							</p>
							<div class="refreshButton" @click="statPerTaxation()" v-show="!$route.query.index">刷新</div>
							<div class="importButton" @click="goImport()" v-show="!$route.query.index">导入</div>
						</div>
					</div>
					<div v-if="tmplList.length>0&&isexpandTmpl" class="eachCard addBtn" @click="changeStatus()">
						<img src="../../assets/img/small.png" style="width:100%;height:100%" alt="">
					</div>
					<div v-if="tmplList.length>0&&!isexpandTmpl" class="eachCard addBtn" @click="changeStatus()">
						<img src="../../assets/img/expand.png" style="width:100%;height:100%" alt="">
					</div>
					<div class="eachCard" v-for="(item,index) in tmplList" :key="index" v-if="isexpandTmpl">
						<!-- <div class="circle"> -->
						<img v-if="!issubmit&&!item.isdelete&&item.invoiceId" @click="selectDelete(item)" src="../../assets/img/noselect.png"
						 class="circle" alt="">
						<img v-if="!issubmit&&item.isdelete&&item.invoiceId" @click="selectDelete(item)" src="../../assets/img/select.png"
						 class="circle" alt="">
						<!-- </div> -->
						<!-- <i v-if="item.isdelete&&item.invoiceId" @click="selectDelete(item)" class="el-icon-success" style="cursor:pointer;position: absolute;right: -0.1rem;top:-0.1rem;font-size: 0.26rem;color: #409EFF;"></i> -->
						<!-- :class="{ 'class-a': isA, 'class-b': isB}" -->
						<div class="topContent color1" :class="{ 'color1': item.invoiceId, 'color2': item.tmplId==10, 'color3': item.tmplId==9, 'color4': item.tmplId==8, 'color5': item.tmplId==7, 'color6': item.tmplId==6, 'color7': item.tmplId==5, 'color8': item.tmplId==4, 'color9': item.tmplId==3, 'color10': item.tmplId==1}">
							<div class="line1">
								<p v-if="item.tmplId" class="bigTitle">{{item.tmplName}}</p>
								<p v-if="item.invoiceId" class="bigTitle">{{item.invoiceCategory}} {{item.invoiceType}}</p>
								<!-- <p v-if="item.invoiceId" class="bigTitle" style="margin-left:0.15rem;">{{item.invoiceType}}</p> -->
								<p class="smallTitle" @click="showDetail(item)">详情</p>
								<p v-if="!issubmit&&item.invoiceId" class="smallTitle" @click="deleteInvoice(item)">删除</p>
							</div>
							<div v-if="item.invoiceId" class="line2" style="position:absolute;top:0.6rem">
								<p>{{item.invoiceName}}</p>
							</div>
							<div v-if="item.temType" class="line2" style="position:absolute;top:0.6rem">
								<p>{{item.temType}}</p>
							</div>
						</div>
						<div class="dataContent">
							<div v-if="child.columnShow==1" class="lineData" v-for="(child,ind) in item.e9zConfigInvoiceColumnList" :key="ind">
								<p>{{child.columnTitle}}</p>
								<p v-if="child.columnTitle=='发票项目类型'&&(child.columnValue=='1'||child.columnValue=='一般')">一般</p>
								<p v-if="child.columnTitle=='发票项目类型'&&(child.columnValue=='2'||child.columnValue=='即征即退')">即征即退</p>
								<p v-if="child.columnTitle=='应税类型'&&(child.columnValue=='1'||child.columnValue=='应税货物')">应税货物</p>
								<p v-if="child.columnTitle=='应税类型'&&(child.columnValue=='2'||child.columnValue=='应税劳务')">应税劳务</p>
								<p v-if="child.columnTitle=='应税类型'&&(child.columnValue=='3'||child.columnValue=='应税服务')">应税服务</p>
								<p v-if="child.columnTitle!='发票项目类型'&&child.columnTitle!='应税类型'" v-show="!child.isEdit" @dblclick="editPanel(item,child)">{{child.columnValue?fomatFloat(child.columnValue,2):fomatFloat(child.defaultValue,2)}}</p>
								<!-- <el-input v-show="item.columnEdit==1" v-model="item.columnValue"></el-input> -->
								<el-input v-show="child.isEdit" v-model="child.columnValue" @blur="unfocusedPanel(item,child)"></el-input>
								<!-- <span class="error">{{child.errInfo}}</span> -->
								<!-- <p :contenteditable='child.columnEdit==1'  @blur="setData($event,child,item)" v-if="child.columnTitle!='发票项目类型'&&child.columnTitle!='应税类型'">{{child.columnValue?fomatFloat(child.columnValue,2):fomatFloat(child.defaultValue,2)}}</p> -->
							</div>
						</div>
						<div class="footerContent" @click="showDetail(item)">
							<img src="../../assets/img/btn-detail.png" alt="">
						</div>
					</div>
					<div class="eachCard" v-for="(item,index) in invoiceRecordList" :key="index" v-if="!item.ishideTemp">
						<img v-if="!issubmit&&!item.isdelete&&item.invoiceId" @click="selectDelete(item)" src="../../assets/img/noselect.png"
						 class="circle" alt="">
						<img v-if="!issubmit&&item.isdelete&&item.invoiceId" @click="selectDelete(item)" src="../../assets/img/select.png"
						 class="circle" alt="">

						<div class="topContent color1" :class="{ 'color1': item.invoiceId, 'color2': item.tmplId==10, 'color3': item.tmplId==9, 'color4': item.tmplId==8, 'color5': item.tmplId==7, 'color6': item.tmplId==6, 'color7': item.tmplId==5, 'color8': item.tmplId==4, 'color9': item.tmplId==3, 'color10': item.tmplId==1}">
							<div class="line1">
								<p v-if="item.tmplId" class="bigTitle">{{item.tmplName}}</p>
								<p v-if="item.invoiceId" class="bigTitle">{{item.invoiceCategory}} {{item.invoiceType}}</p>
								<p class="smallTitle" @click="showDetail(item)">详情</p>
								<p v-if="!issubmit&&item.invoiceId" class="smallTitle" @click="deleteInvoice(item)">删除</p>
							</div>
							<div v-if="item.invoiceId" class="line2" style="position:absolute;top:0.6rem">
								<p>{{item.invoiceName}}</p>
							</div>
							<div v-if="item.temType" class="line2" style="position:absolute;top:0.6rem">
								<p>{{item.temType}}</p>
							</div>
						</div>
						<div class="dataContent">
							<div v-if="child.columnShow==1" class="lineData" v-for="(child,ind) in item.e9zConfigInvoiceColumnList" :key="ind">
								<p>{{child.columnTitle}}</p>
								<p v-if="child.columnTitle=='发票项目类型'&&(child.columnValue=='1'||child.columnValue=='一般')">一般</p>
								<p v-if="child.columnTitle=='发票项目类型'&&(child.columnValue=='2'||child.columnValue=='即征即退')">即征即退</p>
								<p v-if="child.columnTitle=='应税类型'&&(child.columnValue=='1'||child.columnValue=='应税货物')">应税货物</p>
								<p v-if="child.columnTitle=='应税类型'&&(child.columnValue=='2'||child.columnValue=='应税劳务')">应税劳务</p>
								<p v-if="child.columnTitle=='应税类型'&&(child.columnValue=='3'||child.columnValue=='应税服务')">应税服务</p>
								<p v-if="child.columnTitle!='发票项目类型'&&child.columnTitle!='应税类型'" v-show="!child.isEdit" @dblclick="editPanel(item,child)">{{child.columnValue?fomatFloat(child.columnValue,2):fomatFloat(child.defaultValue,2)}}</p>
								<el-input v-show="child.isEdit" v-model="child.columnValue" @blur="unfocusedPanel(item,child)"></el-input>
							</div>
						</div>
						<div class="footerContent" @click="showDetail(item)">
							<img src="../../assets/img/btn-detail.png" alt="">
						</div>
					</div>
					<div v-if="addbtnflag" class="eachCard addBtn" @click="addDialog()">
						<img src="../../assets/img/list-add.png" style="width:100%;height:100%" alt="">
					</div>
				</div>
				<!-- 新增弹窗 -->
				<el-dialog class="smallDialog" :close-on-click-modal="false" :visible.sync="addDialogVisible">
					<el-form ref="form" :rules="rules" :model="form" label-width="110px">
						<el-form-item label="票面张数：" prop="name">
							<el-input v-model="form.name"></el-input>
						</el-form-item>
						<el-form-item label="票面金额：" prop="amount">
							<el-input v-model="form.amount"></el-input>
						</el-form-item>
						<el-form-item label="计税方法：" prop="taxCalcMethod">
							<el-select v-model="form.taxCalcMethod" placeholder="请选择" @change="changeTaxMethod">
								<el-option v-for="item in taxCalcMethodOptions" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="发票类型：" prop="invoiceType">
							<el-select v-model="form.invoiceType" placeholder="请选择" @change="changeInvoiceType">
								<el-option v-for="item in invoiceTypeOptions" :key="item.typeString" :label="item.typeString" :value="item.typeString">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="发票名称：" prop="invoiceName">
							<el-select v-model="form.invoiceName" placeholder="请选择">
								<el-option v-for="item in invoiceNameOptions" :key="item.value" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
					</el-form>
					<div class="nextStep" @click="nextStep('form')">下一步</div>
					<div class="cancel" @click="addDialogVisible = false">取消</div>
				</el-dialog>
				<!-- 下一步弹窗 -->
				<el-dialog class="smallNextDialog" :close-on-click-modal="false" :visible.sync="nextStepDialogVisible">
					<div class="dialogTitle">
						<p class="dialogSmallTitle">{{form.invoiceType}}</p>
						<p class="dialogSmallTitle" style="margin-top:0.15rem">{{invoiceName}}</p>
					</div>
					<el-form ref="form2" :model="form2">
						<el-form-item v-if="item.columnShow == 1&&item.columnEdit==1" :label="item.columnTitle" v-for="(item,index) in nextStepList"
						 :key="index">
							<el-input v-if="item.columnTitle=='发票张数'" v-model="form.name"></el-input>
							<el-input v-if="item.columnTitle=='票面金额'" v-model="form.amount"></el-input>
							<el-input v-if="item.columnTitle!='票面金额'&&item.columnTitle!='发票张数'&&item.columnEditRule!='2'" v-model="item.defaultValue"></el-input>
							<!-- <p style="float:right" v-if="item.columnEdit==0">{{item.defaultValue}}</p> -->
							<el-select v-if="item.columnEditRule=='2'" v-model="item.defaultValue" placeholder="请选择" style="float: right;">
								<el-option v-for="child in mianshuiList" :label="child.freeCodeName" :value="child.freeCodeValue">
								</el-option>
							</el-select>
							<span class="error">{{item.errInfo}}</span>
						</el-form-item>

						<el-form-item class="rightSelect" v-if="item.e9zConfigInvoiceTaxesRateList.length>0" :label="item.taxesTitle"
						 v-for="(item,indexs) in nextStepSelectList">
							<el-select v-model="item.taxesValue" placeholder="请选择" @change="((val)=>{changeZengzhi(val, item.taxesTitle,this.nextStepRes)})">
								<el-option v-for="child in item.e9zConfigInvoiceTaxesRateList" :label="child.taxesRate" :value="child.taxesRate">
								</el-option>
							</el-select>
							<span class="error">{{item.errInfo}}</span>
						</el-form-item>
					</el-form>
					<div class="nextStep" @click="save()">保存</div>
					<div class="cancel" @click="nextStepDialogVisible = false">取消</div>
				</el-dialog>
				<!-- 详情弹窗 -->
				<el-dialog class="detailDialog" width="40%" :close-on-click-modal="false" :visible.sync="detailDialogVisible"
				 @close="closeDetail()">
					<div class="detailHeader">
						<div class="costumer">
							<p class="label">客户名称：</p>
							<p class="value">{{userobj.customerName}}</p>
							<p class="pages" v-if="detailData.pages">{{detailData.pages}}张</p>
						</div>
						<div class="invoice" v-if="detailData.taxCalcTypeName">
							<div class="left">
								<p class="label">计税方法：</p>
								<p class="value">{{detailData.taxCalcTypeName}}</p>
							</div>
						</div>
						<div class="invoice" v-if="detailData.invoiceCategory">
							<div class="left">
								<p class="label">发票类型：</p>
								<p class="value">{{detailData.invoiceCategory}}</p>
								<p class="pages">{{detailData.invoiceType}}</p>
							</div>
							<div class="right">
								<p class="label">发票名称：</p>
								<p class="value">{{detailData.invoiceName}}</p>
							</div>
						</div>
						<div class="invoice" v-if="detailData.tmplName">
							<div class="left">
								<p class="label">模板名称：</p>
								<p class="value">{{detailData.tmplName}}</p>
								<p v-if="detailData.temType" class="pages">{{detailData.temType}}</p>
							</div>
						</div>
						<div class="date">
							<div class="left">
								<p class="label">账期：</p>
								<p class="value">{{searchList.nowDate}}</p>
							</div>
							<div class="right">
								<p class="label">申报纳税种类：</p>
								<p class="value">{{sbnszl}}</p>
							</div>
						</div>
					</div>
					<div class="taxRate" v-if="!detailData.tmplId">
						<div class="valueBox" v-if="!issubmit&&item.e9zConfigInvoiceTaxesRateList.length>0" v-for="(item,index) in detailData.e9zConfigInvoiceTaxesList"
						 :key="index">
							<p class="label">{{item.taxesTitle}}</p>
							<el-select style="margin-left:0.1rem" v-model="item.taxesValue" placeholder="请选择">
								<el-option v-for="child in item.e9zConfigInvoiceTaxesRateList" :label="child.taxesRate" :value="child.taxesRate"></el-option>
							</el-select>
						</div>
						<div class="valueBox" v-if="issubmit&&item.e9zConfigInvoiceTaxesRateList.length>0" v-for="(item,index) in detailData.e9zConfigInvoiceTaxesList"
						 :key="index">
							<p class="label">{{item.taxesTitle}}</p>
							<p style="margin-left:0.1rem">{{item.taxesValue}}</p>
						</div>
					</div>
					<div class="content">
						<div :class="[item.columnTitle == '海关进口增值税专用缴款书' || item.columnTitle == '农产品收购发票或者销售发票' || item.columnTitle == '其它' || item.columnTitle == '本期用于购建不动产的扣税凭证' || item.columnTitle == '本期用于抵扣的旅客运输服务扣税凭证税额'?'valueBox1':'valueBox']" v-for="(item,index) in detailData.invoiceColumnList" :key="index" v-show="item.columnShow != 2">
							<p class="label" v-if="item.columnTitle != '进项税额转出'">{{item.columnTitle}}</p>
							<el-button type="text" size="mini" class="label" v-if="item.columnTitle == '进项税额转出'" @click='showDialog'>{{item.columnTitle}}</el-button>

							<p class="value" v-show="item.columnEdit==0">{{item.columnValue}}</p>
							<el-input v-show="item.columnEdit==1" v-model="item.columnValue"></el-input>
							<span class="error">{{item.errInfo}}</span>

						</div>
					</div>
					<div class="detailFooter">
						<div class="nextStep" v-if="!issubmit" @click="edit()">提交</div>
						<div class="cancel" v-if="!issubmit" @click="closeDetail()">关闭</div>
						<div class="cancel" v-if="issubmit" @click="detailDialogVisible = false;">关闭</div>
					</div>
				</el-dialog>
			</div>
		</div>
		<div class="right_contain">
			<div class="charts" v-show="canShow">
				<p class="chartsTitle">{{(reportTaxType == 233?'一般纳税人':'小规模纳税人') + '-' + (declarationCycle == 0?'按月申报':'按季申报')}}</p>


			</div>
			<div class="charts">
				<p class="chartsTitle">收入合计</p>
				<div v-show="nameData.length>0" id="myChart" style="width:100%;height:170px;" ref="chart"></div>
				<!-- <div v-if="tableData.length<=0" style="width:100%;height:2rem;text-align:center;line-height:1.6rem">暂无图表</div> -->
			</div>
			<div class="chartsTable" :style="{marginTop:nameData.length>0?'0':'0.2rem'}">
				<el-table :data="tableData" show-summary :summary-method="getSummariesCharts" border style="width: 90%;margin-left:5%">
					<el-table-column label="税种" width="50" align="center" :resizable="false">
						<template slot-scope="scope">
							<div class="tableSquare" :style="{background:scope.row.color}"></div>
						</template>
					</el-table-column>
					<el-table-column label="票面金额" prop="invoice_amt" align="right" header-align="center" :resizable="false">
						<template slot-scope="scope">
							<span>{{ fomatFloat(scope.row.invoice_amt,2) }}</span>
						</template>
					</el-table-column>
					<el-table-column label="收入不含税" prop="ex_tax_income" align="right" header-align="center" :resizable="false">
						<template slot-scope="scope">
							<span>{{ fomatFloat(scope.row.ex_tax_income,2) }}</span>
						</template>
					</el-table-column>
					<el-table-column label="销项税额" prop="sale_vat_taxation" align="right" header-align="center" :resizable="false">
						<template slot-scope="scope">
							<span>{{ fomatFloat(scope.row.sale_vat_taxation,2) }}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<div class="charts">
				<p class="chartsTitle">抵扣合计</p>
			</div>
			<div class="chartsTable" style="margin-top:0.20rem">
				<el-table :data="tableDeductData" :show-header="false" border style="width: 90%;margin-left:5%">
					<el-table-column prop="name" align="left" header-align="center" :resizable="false">
					</el-table-column>
					<el-table-column prop="value" align="center" header-align="center" :resizable="false">
						<template slot-scope="scope">
							<span>{{ fomatFloat(scope.row.value,2) }}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<div class="charts">
				<p class="chartsTitle">应纳税额合计</p>
			</div>
			<div class="chartsTable" style="margin-top:0.20rem;margin-bottom: 0.20rem;">
				<el-table :data="tableTaxData" show-summary :summary-method="getSummaries" border style="width: 90%;margin-left:5%">
					<el-table-column label="税种" prop="name" align="center" header-align="center" :resizable="false">
					</el-table-column>
					<el-table-column label="税率" width="49" prop="rate" align="center" header-align="center" :resizable="false">
						<template slot-scope="scope">
							<span>{{ fomatFloat(scope.row.rate,2) }}</span>
						</template>
					</el-table-column>
					<el-table-column label="应缴" width="70" prop="payable" align="center" header-align="center" :resizable="false">
						<template slot-scope="scope">
							<span>{{ fomatFloat(scope.row.payable,2) }}</span>
						</template>
					</el-table-column>
					<el-table-column label="已交" width="55" prop="paid" align="center" header-align="center" :resizable="false">
						<template slot-scope="scope">
							<span>{{ fomatFloat(scope.row.paid,2) }}</span>
						</template>
					</el-table-column>
					<el-table-column label="应补交" width="70" prop="taxation" align="center" header-align="center" :resizable="false">
						<template slot-scope="scope">
							<span>{{ fomatFloat(scope.row.taxation,2) }}</span>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<el-dialog title="详情" :visible.sync="dialogVisibleTable" width="100%" class='dialog'>

			<el-table :data="detailTable" show-summary :summary-method="getSummaries1">
				<el-table-column align="center" label="账期" prop='accountPeriod'></el-table-column>
				<el-table-column align="center" label="客户名称" prop='customerName'></el-table-column>
				<el-table-column align="center" label="收入" prop="allIncome">
					<template slot-scope="scope">
						<span>{{format(scope.row.allIncome)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="期间" prop="duringPeriod" width="140"></el-table-column>

				<el-table-column align="center" label="增值税" prop='allTaxAmount'>
					<template slot-scope="scope">
						<span>{{format(scope.row.allTaxAmount)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="消费税" prop="allConsumptionTaxation">
					<template slot-scope="scope">
						<span>{{format(scope.row.allConsumptionTaxation)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="城市维护建设税" prop="allUrbanTaxation">
					<template slot-scope="scope">
						<span>{{format(scope.row.allUrbanTaxation)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="教育费附加" prop="allEsTaxation">
					<template slot-scope="scope">
						<span>{{format(scope.row.allEsTaxation)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="地方教育费附加" prop="allAleTaxation">
					<template slot-scope="scope">
						<span>{{format(scope.row.allAleTaxation)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="印花税" prop="allStampDutyTaxation">
					<template slot-scope="scope">
						<span>{{format(scope.row.allStampDutyTaxation)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="文化事业建设费" prop="education">
					<template slot-scope="scope">
						<span>{{format(scope.row.education)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="企业所得税" prop="incomeTaxation">
					<template slot-scope="scope">
						<span>{{format(scope.row.incomeTaxation)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="税款合计" prop="total">
					<template slot-scope="scope">
						<span>{{format(scope.row.total)}}</span>
					</template>
				</el-table-column>

			</el-table>
			<!-- <div class='btn_contain clearfix'>
					<span class='commit' @click="commitFP">确定</span>
				</div> -->

		</el-dialog>

		<el-dialog title="进项税额转出" :visible.sync="dialogVisible" width="500px" class="detailDialog" :close-on-click-modal="false" >
			<div class="clearfix" style="margin-bottom: 10px;" v-for="(item,index) in detailData.invoiceColumnList" :key="index" v-show="item.columnShow == 2">
				<p class="label" style="float: left;height: 30px;line-height: 30px;">{{item.columnTitle}}</p>
				<p class="value" style="float: right;" v-show="item.columnEdit==0">{{item.columnValue}}</p>
				<el-input v-show="item.columnEdit==1" v-model="item.columnValue" size="mini"></el-input>
				<span class="error">{{item.errInfo}}</span>

			</div>

			<span slot="footer" class="dialog-footer">
			    <el-button @click="dialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="commitCalc">确 定</el-button>
			  </span>

		</el-dialog>
	</div>
</template>

<script>
	import axios from "axios";
	// import searchModule from "../components/invoice_t/searchModule.vue";
	// import listModule from "../components/invoice_t/listModule.vue";
	export default {
		name: "router1",
		data() {
			var validatePass = (rule, value, callback) => {
				var reg = /^([0]|[1-9][0-9]*)$/;
				if (value === "") {
					callback();
				} else if (!reg.test(value)) {
					callback(new Error("只可输入整数和0"));
				} else {
					callback();
				}
			};
			var validatePrice = (rule, value, callback) => {
				var reg = /^(-)?\d{1,14}(\.\d{1,2})?$/;
				if (value === "") {
					callback();
				} else if (!reg.test(value)) {
					callback(new Error("整数最多14位，小数最多2位"));
				} else {
					callback();
				}
			};
			return {
				isRole: false,
				declarationCycle: '',
				reportTaxType: '',
				canShow: false,
				message: "12334456",
				echarts1_option: {},
				tableData: [],
				invoiceList: [],
				invoicePanelList: [],
				taxesList: [],
				nameData: [],
				seriesData: [],
				color: [
					"#ec6969",
					"#f39f72",
					"#c181b6",
					"#7baddc",
					"#ece674",
					"#8fc879",
					"#8e8ec5",
					"#ccc"
				],
				tableDeductData: [],
				tableTaxData: [],
				taxationId: "",
				taxInfoId: "",
				loadingCard: false,
				gsskhj: "",
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
					invoiceName: "",
					invoiceType: ""
				},
				customerId: "",
				accountPeriod: "",
				customerName: "",
				searchinvoiceName: "",
				searchinvoiceType: "",
				invoiceTypeSelect: [],
				invoiceNameSelect: [],
				form: {
					name: "",
					pages: "",
					amount: "",
					taxCalcMethod: 1, //计税方法
					invoiceType: "", //发票类型
					invoiceName: "" //发票名称
				},
				invoiceName: "",
				rules: {
					name: [{
						validator: validatePass,
						trigger: "blur"
					}],
					amount: [{
						validator: validatePrice,
						trigger: "blur"
					}],
					taxCalcMethod: [{
						required: true,
						message: "请选择计税方法",
						trigger: "change"
					}],
					invoiceType: [{
						required: true,
						message: "请选择发票类型",
						trigger: "change"
					}],
					invoiceName: [{
						required: true,
						message: "请选择发票名称",
						trigger: "change"
					}]
				},
				form2: {
					name: "",
					invoiceType: ""
				},
				rules2: {
					invoiceType: [{
						required: true,
						message: "请选择发票类型",
						trigger: "blur"
					}]
				},
				addDialogVisible: false,
				nextStepDialogVisible: false,
				detailDialogVisible: false,
				taxCalcMethodOptions: [], //计税方法选择框
				invoiceTypeOptions: [], //发票类型选择框
				invoiceNameOptions: [], //发票名称选择框
				allSelectList: [],
				nextStepList: [],
				nextStepSelectList: [],
				nextStepRes: {},
				detailData: {},
				zengzhiTaxList: [],
				yinhuaTaxList: [],
				chengjianTaxList: [],
				userobj: {},
				sbnszl: "", //申报纳税类型
				fscj: "",
				ysfwdkcb: "",
				addbtnflag: false,
				issubmit: true, //是否提交审批
				showsum: false, //显示合计值
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
				myChart: '',
				sums: '',
				loadingInsertReport: false,
				tmplList: [],
				invoiceRecordList: [],
				authorizedLevyRate: '',
				isexpandTmpl: false,
				sums: '',
				custList: [],
				dialogVisible: false,
				dialogVisibleTable: false,
				detailTable: [],


				mianshuiList: []
			};
		},
		components: {
			// searchModule,
			// listModule
		},
		mounted() {
			this.searchList.options = this.$store.state.cust;
			// this.searchList.options = this.custList;
			this.findInvoiceType();
			// this.$refs.chart.style.height = "140px";
		},
		destroyed() {
			window.removeEventListener("resize", this.resizeHandle)
		},
		watch: {

			'$route'(to, from) {
				// init data
				if (to.name == 'invoice_t') {
					this.getmianshuiList();
					var roleList = JSON.parse(sessionStorage.getItem('updateUser')).roleList;
					if (roleList.some((value, index) => value.roleSign == 'adt_acctg' || value.roleSign == 'tax_mgr')) {
						this.isRole = true;
					} else {
						this.isRole = false;
					}
					this.$nextTick(() => {

						if (this.$route.query.customerId && this.$route.query.accountPeriod) {
							this.searchList.nowDate = this.$route.query.accountPeriod;
							this.searchList.value = this.$route.query.customerId;
							this.selectGet(this.$route.query.customerId);
							this.search('formSearch');
						}

					})
				}

			},
			// screenWidth(val) {
			// 	
			// }
		},
		created() {
			// var updateUser = JSON.parse(sessionStorage.getItem('updateUser'));
			// var userTypeId = updateUser.userTypeId;

			// if(userTypeId == 1){
			// 	this.custList = JSON.parse(sessionStorage.getItem('updateCust'));
			// }else{
			// 	this.getAssignmentCustomer();
			// }
			this.getmianshuiList();
			var roleList = JSON.parse(sessionStorage.getItem('updateUser')).roleList;
			if (roleList.some((value, index) => value.roleSign == 'adt_acctg' || value.roleSign == 'tax_mgr')) {
				this.isRole = true;
			} else {
				this.isRole = false;
			}
			this.$nextTick(() => {

				if (this.$route.query.customerId && this.$route.query.accountPeriod) {
					this.searchList.nowDate = this.$route.query.accountPeriod;
					this.searchList.value = this.$route.query.customerId;
					this.selectGet(this.$route.query.customerId);
					this.search('formSearch');
				}

			})

		},
		methods: {
			showDialog() {
				this.dialogVisible = true;
			},
			commitCalc(){
				var tem = 0;
				this.detailData.invoiceColumnList.forEach((item, index) => {
					if (item.columnShow == 2) {
						tem += parseFloat(this.fomatFloat(parseFloat(item.columnValue),2));
					}
				});
				this.detailData.invoiceColumnList.forEach((item, index) => {
					if (item.columnTitle == "进项税额转出") {
						item.columnValue = tem.toFixed(2);
					}
				});
				this.dialogVisible = false;
			},
			getmianshuiList() {
				let params = {
					state:null
				};
				this.axios.post('/perTaxToolTwo/e9z/configTaxFree/getValidTaxFreeList',this.qs.stringify(params))
					.then(res => {
						if (res.data.code == 200) {
							this.mianshuiList = res.data.data;
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
			format(data) {
				if (data == '--') {
					return data;
				} else {
					return parseFloat(data).toFixed(2);
				}
			},

			getSummaries1(param) {
				const {
					columns,
					data
				} = param;
				const sums = [];
				columns.forEach((column, index) => {
					if (index === 0) {
						sums[index] = '合计';
						return;
					}
					if (index !== 0 && index !== 1 && index !== 3) {
						const values = data.map(item => Number(item[column.property]).toFixed(2));
						if (!values.every(value => isNaN(value))) {
							sums[index] = values.reduce((prev, curr) => {
								const value = Number(curr);
								if (!isNaN(value)) {
									return parseFloat(prev) + parseFloat(curr);
								} else {
									return parseFloat(prev);
								}
							}, 0);
							sums[index] = sums[index].toFixed(2)
						} else {
							sums[index] = '--';
						}
					}

				});

				return sums;
			},

			getAssignmentCustomer() {
				let params = {
					"stepName": 2
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
			},
			// 改变模板状态
			changeStatus() {
				this.isexpandTmpl = !this.isexpandTmpl
			},
			// 删除
			deleteInvoice(item) {
				console.log(item);
				item.e9zConfigInvoiceColumnList.forEach(v => {
					if (v.columnName == "id") {
						item.id = v.columnValue;
					}
				});
				let obj = {
					id: item.id,
					invoiceTaxableType: item.invoiceTaxableType,
					taxesTaxType: this.userobj.reportTaxType,
					invoiceName: item.invoiceName
				};
				let params = [];
				params = [obj];
				this.$confirm("是否确定删除发票?", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					})
					.then(() => {
						this.deleteMethod(params);
					})
			},
			deleteMoreInvoice() {
				let deleteArr = [];
				this.invoiceRecordList.forEach(item => {
					item.e9zConfigInvoiceColumnList.forEach(v => {
						if (v.columnName == "id") {
							item.id = v.columnValue;
						}
					});
					if (item.isdelete) {
						var obj = {};
						obj.id = item.id;
						obj.invoiceTaxableType = item.invoiceTaxableType;
						obj.taxesTaxType = this.userobj.reportTaxType;
						obj.invoiceName = item.invoiceName;
						deleteArr.push(obj);
					}
				});
				console.log("delete", deleteArr);
				let params = deleteArr;
				if (deleteArr.length == 0) {
					this.$message({
						type: "warning",
						message: "请至少选中一条数据后再删除!"
					});
				} else {
					this.$confirm("是否确定删除发票?", "提示", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning"
						})
						.then(() => {
							this.deleteMethod(params);
						})
				}
			},
			deleteMethod(params) {
				axios
					.post("/perTaxToolTwo/e9zCalculate/deleteInvoice", params)
					.then(res => {
						console.log("删除发票接口", res);
						if (res.data.code == 200) {
							this.$message({
								type: "success",
								message: "删除成功!"
							});
							this.getInvoiceLeaveShowList(true);
							this.getShowSumIncome();
							this.getShowSumDeduct();
							this.getShowSumTaxPayable();
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
			// 查询发票类型
			findInvoiceType() {
				axios
					.post(
						"/perTaxToolTwo/e9z/invoiceInfo/findInvoiceTypeByAreaAndState"
					)
					.then(res => {
						console.log("发票类型接口", res);
						if (res.data.code == 200) {
							this.invoiceTypeSelect = res.data.data;
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
			// 查询发票名称
			findInvoiceName() {
				let params = {
					taxesTaxType: this.userobj.reportTaxType
				};
				console.log("发票名称", params);
				axios
					.post("/perTaxToolTwo/e9z/invoiceListInfo/findInvoiceName", params)
					.then(res => {
						console.log("发票名称接口", res);
						if (res.data.code == 200) {
							this.invoiceNameSelect = res.data.data;
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
			selectDelete(item) {
				this.$set(item, "isdelete", !item.isdelete);
			},
			setData(event, child, item) {
				console.log("item,,,", child);
				if (
					event.target.innerText != child.columnValue ||
					event.target.innerText != child.defaultValue
				) {
					var reg = /^(-)?\d{1,10}(\.\d{1,2})?$/;
					if (!reg.test(Number(event.target.innerText))) {
						this.$message({
							message: "请输入数字，小数点后最多两位",
							type: "warning"
						});
						return;
					}
					// 修改
					//   item.invoiceColumnList = [];
					// item.taxColumnList = [];
					// item.e9zConfigInvoiceColumnList.forEach(v => {
					//   this.$set(v, "errInfo", "");
					//   if (v.columnTitle == "发票张数") {
					//     item.pages = parseInt(v.columnValue);
					//   }
					//   if (v.columnShow == 1) {
					//     v.columnValue = v.columnValue ? this.fomatFloat(v.columnValue, 2) : this.fomatFloat(v.defaultValue, 2);
					//     item.invoiceColumnList.push(v);
					//   }
					//   if (v.columnTitle.indexOf("税率") > -1) {
					//     v.columnValue = parseFloat(v.columnValue)
					//     item.taxColumnList.push(v);
					//   }
					// });
					this.detailData = item;
					console.log(this.detailData);
					this.edit();
				}
			},
			changeZengzhi(rate, type, item) {
				console.log("type", type);
				console.log("rate,,", rate);
				console.log("item", item);
				console.log("this.userobj", this.userobj);
				if (type.indexOf("增值") > -1) {
					if (item.invoiceTaxableType == 3) {
						this.selectBusinessCreditsLeaveTableList(rate);
					}
					let params = {};
					if (this.userobj.reportTaxType == 233) {
						let redInvType;
						if (item.invoiceName == "即征即退") {
							redInvType = 2;
						} else {
							redInvType = 1;
						}
						params = {
							taxInfoId: this.taxInfoId,
							taxationId: this.taxationId,
							redInvType: redInvType,
							redRate: rate
						};
					}
					if (this.userobj.reportTaxType == 232) {
						params = {
							taxInfoId: this.taxInfoId,
							taxationId: this.taxationId,
							invoiceTaxableType: item.invoiceTaxableType
						};
					}
					this.selectBusinessReduceLeaveTableList(params);
				}
			},
			// 负数留抵表
			selectBusinessReduceLeaveTableList(params) {
				axios
					.post(
						"/perTaxToolTwo/e9z/e9zBusinessReduceLeaveTable/selectBusinessReduceLeaveTableList",
						params
					)
					.then(res => {
						if (res.data.code == 200) {
							if (res.data.hasOwnProperty("data")) {
								if (res.data.data.length > 0) {
									this.fscj = res.data.data[0].redLocalLeaveD;
									console.log("this.fscj", this.fscj);
									if (this.fscj != '' || this.fscj != 0) {
										this.fscj = '-' + this.fscj;
									}
									console.log('this.fscj.toString()', this.fscj.toString());
									this.nextStepList.forEach(item => {
										if (item.columnTitle == "负数冲减") {
											this.$set(item, "columnValue", this.fscj.toString());
											this.$set(item, "defaultValue", this.fscj.toString());
										}
									});
								}
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
			// 应税服务可抵扣
			selectBusinessCreditsLeaveTableList(rate) {
				let params = {
					taxInfoId: this.taxInfoId,
					taxationId: this.taxationId,
					crdRate: rate
				};
				axios
					.post(
						"/perTaxToolTwo/e9z/E9zBusinessCreditsLeaveTable/selectBusinessCreditsLeaveTableList",
						params
					)
					.then(res => {
						if (res.data.code == 200) {
							if (res.data.hasOwnProperty("data")) {
								if (res.data.data.length > 0) {
									this.ysfwdkcb = res.data.data[0].crdLocalLeaveD;
									console.log("this.ysfwdkcb", this.ysfwdkcb);
									this.nextStepList.forEach(item => {
										// if (item.columnTitle == "负数冲减") {
										//   this.$set(item, "columnValue", this.fscj);
										//   this.$set(item, "defaultValue", this.fscj);
										// } else
										if (item.columnTitle == "本期实际扣除金额") {
											this.$set(item, "columnValue", this.ysfwdkcb.toString());
											this.$set(item, "defaultValue", this.ysfwdkcb.toString());
										}
									});
								}
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
			selectGet(vId) {
				this.userobj = {};
				// this.userobj = this.custList.find(item => {
				this.userobj = this.$store.state.cust.find(item => {
					//这里的selectList就是上面遍历的数据源
					return item.customerId === vId; //筛选出匹配数据
				});
				// this.userobj = this.searchList.options.find(item => {
				//   //这里的selectList就是上面遍历的数据源
				//   return item.customerId === vId; //筛选出匹配数据
				// });
				console.log("当前选择的用户信息", this.userobj); //

				this.findInvoiceName();
			},
			getNowMonth() {
				var date = new Date();
				var year = date.getFullYear();
				var month = date.getMonth() + 1;
				month = month < 10 ? "0" + month : month;
				this.searchList.nowDate = year.toString() + "-" + month.toString();
				this.accountPeriod = year.toString() + "-" + month.toString();
			},

			insertReport(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						console.log("this.searchList", this.searchList);

						if (this.taxationId == "" || this.taxInfoId == "") {
							this.$message({
								message: "无数据时不支持生成报表操作",
								type: "warning"
							});
							return;
						}
						// if (this.invoicePanelList.length == 0) {
						// 	this.$message({
						// 		message: "当前暂无发票数据，不支持生成报表！",
						// 		type: "warning"
						// 	});
						// 	return;
						// }
						if (this.issubmit) {
							this.$message({
								message: "当前正在审批中，不支持生成报表！",
								type: "warning"
							});
							return;
						}
						let url;
						if (this.userobj.reportTaxType == 233) {
							url = "/perTaxToolTwo/e9zCalculate/insertReport";
						} else if (this.userobj.reportTaxType == 232) {
							url = "/perTaxToolTwo/e9zCalculate/insertXgmReport";
						}
						this.loadingInsertReport = true;
						let params = {
							taxationId: this.taxationId,
							taxInfoId: this.taxInfoId,
							taxesTaxType: this.userobj.reportTaxType,
							customerId: this.customerId
						};
						axios
							.post(url, params)
							.then(res => {
								if (res.data.code == 200) {
									this.loadingInsertReport = false;
									this.$message({
										message: "生成报表成功",
										type: "success"
									});
								} else {
									this.loadingInsertReport = false;
									this.$message({
										message: res.data.msg,
										type: "error"
									});
								}
							})
							.catch(err => {
								this.loadingInsertReport = false;
								console.log("生成报表失败");
							});
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			search(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						console.log("this.userobj", this.userobj);
						this.showsum = false;
						this.accountPeriod = this.searchList.nowDate;
						this.customerId = this.searchList.value;
						this.customerName = this.userobj.customerName;
						this.searchinvoiceName = this.searchList.invoiceName;
						this.searchinvoiceType = this.searchList.invoiceType;
						this.statusVaule = this.searchList.statusVaule;
						this.taxationId = "";
						this.taxInfoId = "";
						this.gsskhj = '';
						this.isexpandTmpl = false;
						console.log("this.searchList", this.searchList);
						this.showsum = true;
						this.statPerTaxation();
						let params = {
							accountPeriod: this.accountPeriod, //账期
							customerId: this.customerId, //客户Id
							stepName: "税款审核" //步骤名称
						};
						axios
							.post("/perTaxToolTwo/e9zCalculate/getTaxInfo", params)
							.then(res => {
								console.log("获取收账信息Id和税款信息id", res);
								if (res.data.code == 200) {
									// 在这里获取收账税款id
									if (res.data.hasOwnProperty("data")) {
										this.taxationId = res.data.data.taxation_id;
										this.taxInfoId = res.data.data.tax_info_id;
										this.isSubmitMethod();
										// this.getRateByCustomerId();
										this.getInvoiceLeaveShowList(true);
										this.getShowSumIncome();
										this.getShowSumDeduct();
										this.getShowSumTaxPayable();
										this.canShow = true;
										this.reportTaxType = this.userobj.reportTaxType;
										this.declarationCycle = res.data.data.declaration_cycle;
									} else {
										this.$message({
											message: "该账期未启动税款流！",
											type: "warning"
										});
										this.addbtnflag = false;
										this.invoicePanelList = [];
										this.tmplList = [];
										this.invoiceRecordList = [];
										this.tableData = [];
										this.tableDeductData = [];
										this.tableTaxData = [];
										this.nameData = [];
										this.seriesData = [];
										this.drawLine();
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
						console.log("error submit!!");
						return false;
					}
				});
			},
			// 根据客户id查询核定征收率
			getRateByCustomerId() {
				axios
					.get("/perTaxToolTwo/e9z/authorizedLevyRate/getRateByCustomerId?customerId=" + this.customerId + '&invoiceId=' +
						this.form.invoiceName)
					.then(res => {
						if (res.data.code == 200) {
							this.authorizedLevyRate = res.data.data ? res.data.data : '0';
							this.findInvoiceProperty();
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
			// 判断当前发票数据是否审批
			isSubmitMethod() {
				let params = {
					accountPeriod: this.accountPeriod, //账期
					customerId: this.customerId, //客户Id
					stepName: "税款审核" //步骤名称
				};
				axios
					.post("/perTaxToolTwo/e9z/taxStep/getStateByStepName", params)
					.then(res => {
						if (res.data.code == 200) {
							if (res.data.data == "1") {
								// 未提交
								this.addbtnflag = true;
								this.issubmit = false;
							} else if (res.data.data == "2") {
								//已提交
								this.addbtnflag = false;
								this.issubmit = true;
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
			// 查询个税税款合计
			statPerTaxation() {
				let params = {
					customerId: this.customerId,
					accountPeriod: this.accountPeriod
				};
				axios
					.post("/perTaxToolTwo/api/import/statPerTaxation", params)
					.then(res => {
						console.log("查询个税税款合计", res);
						if (res.data.code == 200) {
							console.log("res.data.data", res.data.data);
							if (res.data.hasOwnProperty("data")) {
								this.gsskhj = res.data.data;
							} else {
								this.$message({
									message: "未上传工资表",
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
			//获取列表数据
			getInvoiceLeaveShowList(loadingFlag) {
				this.loadingCard = loadingFlag;
				let invoiceType = "",
					invoiceCategory = "";
				if (this.searchinvoiceType) {
					invoiceCategory = this.searchinvoiceType.split(" ")[0];
					invoiceType = this.searchinvoiceType.split(" ")[1];
				}
				let params = {
					taxationId: this.taxationId,
					taxInfoId: this.taxInfoId,
					taxesTaxType: this.userobj.reportTaxType,
					invoiceListId: this.searchinvoiceName,
					invoiceCategory: invoiceCategory,
					invoiceType: invoiceType
				};
				axios
					.post("/perTaxToolTwo/e9zCalculate/invoiceLeaveShow", params)
					.then(res => {
						this.loadingCard = false;
						if (res.data.code == 200) {
							let obj = res.data.data[0];
							let arr = [];
							for (var i in obj) {
								if (obj[i].length > 0) {
									arr.push(obj[i]);
								}
							}
							this.invoicePanelList = this.flatten(arr);

							let arr1 = [];
							let arr2 = [];
							let arr3 = [];
							this.invoicePanelList.forEach(item => {
								item.arrValue = [];
								this.$set(item, "isdelete", false);
								this.$set(item, "ishideTemp", false);
								item.e9zConfigInvoiceColumnList.forEach(v => {
									this.$set(v, "isEdit", false);
									this.$set(item, "errInfo", "");

									// 模板，如果每个值都是0，则不展示 除了防伪税控，增值税，进项税
									if (item.tmplId) {
										if (v.columnShow == 1) {
											this.$set(v, "showValue", v.columnValue ? parseFloat(v.columnValue) : parseFloat(v.defaultValue));
											if (item.tmplId == 8) {
												if (v.columnTitle != '税率') {
													item.arrValue.push(v.showValue)
												}
											} else if (item.tmplId == 10) {
												if (v.columnTitle != '税率') {
													item.arrValue.push(v.showValue)
												}
											} else if (item.tmplId == 5) {
												if (v.columnTitle != '是否是辅导期') {
													item.arrValue.push(v.showValue)
												}
											} else {
												item.arrValue.push(v.showValue)
											}
										}
									}
								});
								// 判断数组的所有元素全都相等
								if (item.tmplId != 1 && item.tmplId != 5 && item.tmplId != 6 && item.tmplId != 10) {
									this.$set(item, "ishideTemp", new Set(item.arrValue).size === 1);
									console.log('----------------------------');
									console.log(item.tmplName);
									console.log(item.arrValue);
									console.log(new Set(item.arrValue));
									console.log('----------------------------');
								}
								// 模板 一般纳税人 区分是一般还是即征即退
								if (this.userobj.reportTaxType == 233) {
									if (item.tmplId) {
										item.e9zConfigInvoiceColumnList.forEach(v => {
											if (v.columnTitle == '发票项目类型') {
												if (v.columnValue) {
													item.temType = v.columnValue == '1' ? '一般' : '即征即退'
												} else {
													item.temType = v.defaultValue == '1' ? '一般' : '即征即退'
												}

											}
											if (item.tmplId == 3) {
												if (v.columnValue) {
													item.temType = v.columnValue;
												} else {
													// item.temType = v.defaultValue
													item.temType = ''
												}
											}
										});
									}
								}

								// 模板 小规模纳税人 区分应税类型
								if (this.userobj.reportTaxType == 232) {
									if (item.tmplId) {
										item.e9zConfigInvoiceColumnList.forEach(v => {
											if (v.columnTitle == '应税类型') {
												if (v.columnValue) {
													if (v.columnValue == '1') {
														item.temType = '应税货物'
													} else if (v.columnValue == '2') {
														item.temType = '应税劳务'
													} else if (v.columnValue == '3') {
														item.temType = '应税服务'
													}
												} else {
													if (v.defaultValue == '1') {
														item.temType = '应税货物'
													} else if (v.defaultValue == '2') {
														item.temType = '应税劳务'
													} else if (v.defaultValue == '3') {
														item.temType = '应税服务'
													}
												}
											}
										});
									}
								}
							});

							console.log("this.invoicePanelList", this.invoicePanelList);
							this.tmplList = [];
							this.invoiceRecordList = [];
							this.invoicePanelList.forEach(item => {
								if (item.tmplId && !item.ishideTemp) {
									this.tmplList.push(item)
								} else {
									this.invoiceRecordList.push(item)
								}
							})
						} else {
							this.loadingCard = false;
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
						console.log('err', err)
						this.loadingCard = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			//获取右侧统计数据--收入合计
			getShowSumIncome() {
				axios
					.get(
						"/perTaxToolTwo/e9zCalculate/showSumIncome?taxationId=" +
						this.taxationId
					)
					.then(res => {
						console.log("获取收入合计数据", res);
						if (res.data.code == 200) {
							let nameArr = [];
							let valueArr = [];
							this.seriesData = [];
							this.nameData = [];
							res.data.data.forEach((item, index) => {
								if (item.vat_rate == "simple") {
									item.vat_rate = "简易征收";
								} else if (item.vat_rate == "immeduate") {
									item.vat_rate = "即征即退";
								}
								if (item.hasOwnProperty("ex_tax_income")) {
									valueArr.push(item);
								} else {
									nameArr.push(item);
								}
							});
							// nameArr.forEach((item, index) => {
							//   this.nameData.push(item.vat_rate);
							// });
							valueArr.forEach((item, index) => {
								item.color = this.color[index];
								if (typeof item.vat_rate == "number") {
									item.ratename = this.accMul(item.vat_rate, 100) + "%增值税";
								} else {
									item.ratename = item.vat_rate;
								}

								var obj = {};
								obj.name = item.ratename;
								obj.value = item.invoice_amt > 0 ? item.invoice_amt : 0;
								this.nameData.push(item.ratename);
								this.seriesData.push(obj);
							});
							this.tableData = valueArr;
							console.log("this.seriesData.length", this.seriesData.length);
							console.log("this.nameData", this.nameData);
							console.log("this.seriesData", this.seriesData);
							console.log("this.tableData", this.tableData);
							this.drawLine();
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

			// js精确小数乘法
			accMul(arg1, arg2) {
				var m = 0,
					s1 = arg1.toString(),
					s2 = arg2.toString();
				try {
					m += s1.split(".")[1].length;
				} catch (e) {}
				try {
					m += s2.split(".")[1].length;
				} catch (e) {}
				return (
					Number(s1.replace(".", "")) *
					Number(s2.replace(".", "")) /
					Math.pow(10, m)
				);
			},
			// 获取右侧统计数据--抵扣合计
			getShowSumDeduct() {
				this.tableDeductData = [];
				axios
					.get(
						"/perTaxToolTwo/e9zCalculate/showSumDeduct?taxationId=" +
						this.taxationId
					)
					.then(res => {
						// console.log("获取抵扣合计数据", res);
						if (res.data.code == 200) {
							for (var key in res.data.data) {
								var obj = {};
								switch (key) {
									case "input_local_real":
										obj.name = "本期实际抵扣税额";
										break;
									case "con_local_used":
										obj.name = "本期动用减征额";
										break;
									case "input_local_recover":
										obj.name = "免、抵、退应退税额";
										break;
									case "input_local_leave":
										obj.name = "本期留抵税额";
										break;
									case "input_local_out":
										obj.name = "进项税额转出";
										break;
									case "input_pre_leave":
										obj.name = "上期留抵税额";
										break;
									case "input_local":
										obj.name = "本期进项税额";
										break;
								}
								obj.value = res.data.data[key];
								this.tableDeductData.push(obj);
							}
							//   console.log("this.tableDeductData", this.tableDeductData);
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
			// 获取右侧统计数据--应纳税额合计
			getShowSumTaxPayable() {
				axios
					.get(
						"/perTaxToolTwo/e9zCalculate/showSumTaxPayable?taxationId=" +
						this.taxationId
					)
					.then(res => {
						// console.log("获取应纳税额合计数据", res);
						if (res.data.code == 200) {
							this.tableTaxData = res.data.data;
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
			getSummaries(param) {
				const {
					columns,
					data
				} = param;
				const sums = [];
				columns.forEach((column, index) => {
					if (index === 0) {
						sums[index] = "合计";
						return;
					}
					const values = data.map(item => Number(item[column.property]));
					if (!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) {
								return prev + curr;
							} else {
								return prev;
							}
						}, 0);
						sums[index] = this.fomatFloat(sums[index], 2);
					} else {
						sums[index] = "--";
					}
				});
				// 税率没有合计
				sums[1] = "--";
				this.sums = sums[sums.length - 1];
				return sums;
			},
			getSummariesCharts(param) {
				const {
					columns,
					data
				} = param;
				const sums = [];
				columns.forEach((column, index) => {
					if (index === 0) {
						sums[index] = "合计";
						return;
					}
					const values = data.map(item => Number(item[column.property]));
					if (!values.every(value => isNaN(value))) {
						sums[index] = values.reduce((prev, curr) => {
							const value = Number(curr);
							if (!isNaN(value)) {
								return prev + curr;
							} else {
								return prev;
							}
						}, 0);
						sums[index] = this.fomatFloat(sums[index], 2);
					} else {
						sums[index] = "--";
					}
				});
				// this.sums = sums;
				return sums;
			},
			// 二维数组转一位数组
			flatten(arr) {
				return [].concat(
					...arr.map(x => (Array.isArray(x) ? this.flatten(x) : x))
				);
			},
			drawLine() {
				// 引入 ECharts 主模块
				var echarts = require('echarts/lib/echarts');
				// 引入柱状图
				require('echarts/lib/chart/pie');
				// 引入提示框和标题组件
				require('echarts/lib/component/tooltip');
				require('echarts/lib/component/title');
				require('echarts/lib/component/legend');
				console.log('dra888', this.nameData)
				// 基于准备好的dom，初始化echarts实例
				var myChartDiv = document.getElementById("myChart");
				// console.log('width',document.getElementsByClassName('right_contain')[0].offsetWidth)
				myChartDiv.style.width = document.getElementsByClassName('right_contain')[0].offsetWidth + 'px';
				this.myChart = echarts.init(myChartDiv);
				this.echarts1_option = {
					tooltip: {
						trigger: "item",
						formatter: "{a} <br/>{b}({d}%)"
					},
					legend: {
						orient: "vertical",
						// left: this.nameData.length<=3?'40%':'', //图例距离左的距离
						right: this.nameData.length > 4 ? '10%' : '30%', //图例距离右的距离
						top: "14%",
						padding: [0, 0, 30, 30],
						y: 'center', //图例上下居中
						// x: "center", //图例水平居中
						// 图标大小,宽和高
						itemWidth: 10,
						itemHeight: 10,
						itemGap: 20,
						textStyle: {
							fontSize: 12,
							color: "#666"
						},
						icon: "circle",
						// data: []
						data: this.nameData
					},
					color: this.color,
					series: [{
						name: "",
						type: "pie",
						radius: "100%", //图的大小
						// 环形大小
						radius: ["30%", "50%"],
						center: ["18%", "40%"], //图的位置，距离左跟上的位置
						itemStyle: {
							normal: {
								//隐藏标示文字
								label: {
									show: false
								},
								//隐藏标示线
								labelLine: {
									show: false
								}
							}
						},
						data: this.seriesData
						//  data: []
					}]

				};
				// 先清空
				this.myChart.clear();
				// 绘制图表
				this.myChart.setOption(this.echarts1_option);
				window.addEventListener("resize", this.resizeHandle)

			},
			resizeHandle() {
				this.$refs.chart.style.width = document.getElementsByClassName('right_contain')[0].offsetWidth + 'px';
				this.$refs.chart.style.height = "170px";
				this.myChart.resize()
			},
			goImport() {
				this.$router.push({
					path: "/accountFactory/paySheet",
					query: {
						customerId: this.customerId,
						accountPeriod: this.accountPeriod
					}
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
			//获取计税方法
			getTaxCalcMethod() {
				axios
					.post(
						"/perTaxToolTwo/e9z/configDictionary/findDictionayList?dicName=计税方法"
					)
					.then(res => {
						console.log("获取计税方法", res);
						if (res.data.code == 200) {
							this.taxCalcMethodOptions = res.data.data;
							// // 小规模，计税方法只展示一般计税
							// if (this.userobj.reportTaxType == 232) {
							//   this.taxCalcMethodOptions = [
							//     {
							//       dicId: 5,
							//       dicLevel: 2,
							//       dicName: "一般计税",
							//       dicValue: 1,
							//       operateDate: "2019-05-29 08:49:37",
							//       operateUserId: "0",
							//       operateUserName: null,
							//       parentLevel: null,
							//       remark: null,
							//       state: 1
							//     }
							//   ];
							// }
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
			// 更改计税方法时触发
			changeTaxMethod() {
				console.log(1111);
				this.invoiceTypeOptions = [];
				this.form.invoiceType = "";
				this.invoiceNameOptions = [];
				this.form.invoiceName = "";
				this.getInvoiceTypeAndName();
			},
			// 获取发票类型和发票名称
			getInvoiceTypeAndName() {
				let params = {
					taxCalcType: this.form.taxCalcMethod,
					taxesTaxType: this.userobj.reportTaxType,
					tmplShowType: 0
				};
				axios
					.post("/perTaxToolTwo/e9z/invoiceInfo/findInvoiceFormula", params)
					.then(res => {
						console.log("获取发票类型和发票名称", res);
						if (res.data.code == 200) {
							this.allSelectList = res.data.data;
							res.data.data.forEach((item, index) => {
								// type是发票
								if (item.type == "invoice") {
									this.invoiceTypeOptions = item.list;
								}
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
			// 更改发票类型时触发
			changeInvoiceType() {
				console.log("1110", this.allSelectList);
				this.invoiceNameOptions = [];
				this.form.invoiceName = "";
				this.invoiceList = [];
				this.allSelectList.forEach((item, index) => {
					// type是发票
					if (item.type == "invoice") {
						item.list.forEach((v, index) => {
							if (v.typeString == this.form.invoiceType) {
								v.invoiceList.forEach((i, index) => {
									var obj = {};
									obj.label = i.invoiceName;
									obj.value = i.invoiceId;
									this.invoiceNameOptions.push(obj);
									this.invoiceList.push(i);
								});
							}
						});
					}
				});
				console.log("this.invoiceNameOptions", this.invoiceNameOptions);
				console.log("invoiceList", this.invoiceList);
			},
			// changeInvoiceId(val){
			// 	this.temInvoiceId = val;
			// },
			// 新增弹窗1
			addDialog() {
				this.getTaxCalcMethod();
				this.form = {
					name: "",
					amount: "",
					taxCalcMethod: 1, //计税方法
					invoiceType: "", //发票类型
					invoiceName: "" //发票名称
				};
				//  this.taxCalcMethodOptions= []; //计税方法选择框
				this.invoiceTypeOptions = []; //发票类型选择框
				this.invoiceNameOptions = []; //发票名称选择框
				this.changeTaxMethod();
				this.$nextTick(() => {
					this.$refs["form"].resetFields();
				});
				this.addDialogVisible = true;
			},
			// 点击下一步,获取字段列
			nextStep(formName) {
				console.log("this.form.price", this.form);
				console.log("this.invoiceNameOptions", this.invoiceNameOptions);
				this.invoiceName = this.invoiceNameOptions
					.map(v => {
						if (v.value == this.form.invoiceName) {
							return v.label;
						}
					})
					.join("");
				this.$refs[formName].validate(valid => {
					if (valid) {
						// 先判断能否新增
						// let params = {
						//   taxInfoId: this.taxInfoId,
						//   taxationId: this.taxationId,
						//   invoiceId: this.form.invoiceName
						// };
						axios
							.post(
								"/perTaxToolTwo/e9z/invoiceInfo/checkInvoiceUnique?taxInfoId=" + this.taxInfoId + '&taxationId=' + this.taxationId +
								'&invoiceId=' + this.form.invoiceName)
							.then(res => {
								console.log("能否新增", res);
								if (res.data.code == 200) {
									if (res.data.data == 1) {
										this.getRateByCustomerId();
										// this.findInvoiceProperty();
									} else if (res.data.data == 2) {
										this.$message({
											message: res.data.msg,
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

					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			findInvoiceProperty() {
				let params = {
					invoiceId: this.form.invoiceName,
					taxesTaxType: this.userobj.reportTaxType
				};
				axios
					.post(
						"/perTaxToolTwo/e9z/invoiceInfo/findInvoiceProperty",
						params
					)
					.then(res => {
						console.log("获取下一步字段列", res);
						if (res.data.code == 200) {
							this.nextStepRes = res.data.data;
							this.nextStepList = [];
							this.nextStepSelectList = [];
							res.data.data.e9zConfigInvoiceColumnList.forEach(
								(item, index) => {
									// if (item.columnShow == 1) {
									this.$set(item, "errInfo", "");
									// if (item.columnEdit == 1) {
									this.nextStepList.push(item);
									// }
									// }
								}
							);
							this.nextStepList.forEach(item => {
								if (item.columnTitle == "印花税核定征收率") {
									this.$set(item, "columnValue", this.authorizedLevyRate.toString());
									this.$set(item, "defaultValue", this.authorizedLevyRate.toString());
								}
							});
							// e9zConfigInvoiceTaxesList
							if (res.data.data.e9zConfigInvoiceTaxesList) {
								res.data.data.e9zConfigInvoiceTaxesList.forEach(
									(item, index) => {
										this.$set(item, "errInfo", "");
										this.nextStepSelectList.push(item);
									}
								);
								this.nextStepSelectList.forEach(v => {
									if (v.e9zConfigInvoiceTaxesRateList.length > 0) {
										v.taxesValue =
											v.e9zConfigInvoiceTaxesRateList[0].taxesRate;
									}
									if (v.taxesTitle == "增值税") {
										this.changeZengzhi(
											v.taxesValue,
											"增值税",
											this.nextStepRes
										);
									}
								});
							}

							this.addDialogVisible = false;
							this.nextStepDialogVisible = true;
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
			// 编辑
			edit() {
				console.log(11, this.detailData.e9zConfigInvoiceColumnList);
				// 校验
				var intreg = /^([0]|[1-9][0-9]*)$/;
				var float2reg = /^(-)?\d{1,14}(\.\d{1,2})?$/;
				var posfloat2reg = /^\d{1,14}(\.\d{1,2})?$/;
				this.detailData.invoiceColumnList.forEach((item, index) => {
					if (
						item.columnTitle != "发票项目类型" &&
						item.columnTitle != "应税类型" &&
						item.columnTitle != "是否是辅导期"
					) {
						if (item.columnTitle == "发票张数") {
							if (item.columnValue == "") {
								this.$set(item, "errInfo", "请填入发票张数");
							} else if (!intreg.test(item.columnValue)) {
								this.$set(item, "errInfo", "只可输入整数");
							} else {
								this.$set(item, "errInfo", "");
							}
						} else {
							if (item.columnEdit == 1) {
								if (item.columnRequire == 1) {
									if (item.columnValue === null || item.columnValue === "") {
										this.$set(item, "errInfo", "必填项不可为空");
									} else if (item.columnEditRule == 1) {
										if (item.columnTitle == '负数冲减') {
											var reg = /^((-\d{1,14}(\.\d{1,2})?)|0|0.00|0.0)$/;
											if (!reg.test(item.columnValue)) {
												this.$set(item, "errInfo", "只能填负数，小数最多2位");
											} else {
												this.$set(item, "errInfo", "");
											}
										} else {
											if (!float2reg.test(item.columnValue)) {
												this.$set(item, "errInfo", "整数最多14位，小数最多2位");
											} else {
												this.$set(item, "errInfo", "");
											}
										}

									} else if (
										item.columnEditRule == 0 ||
										item.columnEditRule == null
									) {
										if (!posfloat2reg.test(item.columnValue)) {
											this.$set(item, "errInfo", "正数，整数最多14位，小数最多2位");
										} else {
											this.$set(item, "errInfo", "");
										}
									} else {
										this.$set(item, "errInfo", "");
									}
								} else {
									if (item.columnValue != null) {
										if (item.columnEditRule == 1) {
											if (item.columnTitle == '负数冲减') {
												var reg = /^((-\d{1,14}(\.\d{1,2})?)|0|0.00|0.0)$/;
												if (!reg.test(item.defaultValue)) {
													this.$set(item, "errInfo", "只能填负数，小数最多2位");
												} else {
													this.$set(item, "errInfo", "");
												}
											} else {
												if (!float2reg.test(item.columnValue)) {
													this.$set(item, "errInfo", "整数最多14位，小数最多2位");
												} else {
													this.$set(item, "errInfo", "");
												}
											}

										} else if (
											item.columnEditRule == 0 ||
											item.columnEditRule == null
										) {
											if (!posfloat2reg.test(item.columnValue)) {
												this.$set(
													item,
													"errInfo",
													"正数，整数最多14位，小数最多2位"
												);
											} else {
												this.$set(item, "errInfo", "");
											}
										} else {
											this.$set(item, "errInfo", "");
										}
									}
								}
							}
						}
					}
				});
				let zengzhiValue, yinhuaValue, chengjianValue, xiaofeiValue;
				zengzhiValue = 0;
				yinhuaValue = 0;
				chengjianValue = 0;
				xiaofeiValue = 0;
				if (this.detailData.e9zConfigInvoiceTaxesList) {
					console.log(
						"item.e9zConfigInvoiceTaxesList",
						this.detailData.e9zConfigInvoiceTaxesList
					);
					// 获取选中的税率

					this.detailData.e9zConfigInvoiceTaxesList.forEach(item => {
						if (item.taxesTitle == "增值税") {
							zengzhiValue = item.taxesValue;
						} else if (item.taxesTitle == "印花税") {
							yinhuaValue = item.taxesValue;
						} else if (item.taxesTitle == "城市维护建设税") {
							chengjianValue = item.taxesValue;
						} else if (item.taxesTitle == "消费税") {
							xiaofeiValue = item.taxesValue;
						}
					});
				}

				let flag = false;
				this.detailData.invoiceColumnList.forEach((item, index) => {
					if (item.errInfo != "") {
						flag = true;
					}
				});
				console.log(flag);
				if (!flag) {
					let invoiceColumns = [];
					var columnValue1 = '';
					var columnValue3 = '';
					var columnValue4 = '';
					var columnValue13 = '';
					var columnValue14 = '';
					var columnValue23 = '';
					var columnValue24 = '';
					var columnValue33 = '';
					var columnValue34 = '';
					var columnValue43 = '';
					var columnValue44 = '';
					var columnValue5 = '';
					var columnValue7 = '';
					var columnValue8 = '';
					var columnValue17 = '';
					var columnValue18 = '';
					var columnValue27 = '';
					var columnValue28 = '';
					var columnValue9 = '';
					var columnValue11 = '';
					var columnValue12 = '';
					var columnValue21 = '';
					var columnValue22 = '';
					var columnValue31 = '';
					var columnValue32 = '';
					var columnValue41 = '';
					var columnValue42 = '';
					this.detailData.e9zConfigInvoiceColumnList.forEach((item, index) => {
						var obj = {};



						obj.columnId = item.columnId;
						if (item.columnName == "tax_info_id") {
							obj.columnValue = this.taxInfoId;
							invoiceColumns.push(obj);
						} else if (item.columnName == "taxation_id") {
							obj.columnValue = this.taxationId;
							invoiceColumns.push(obj);
						} else if (item.columnTitle == "发票项目类型") {
							item.columnValue = item.columnValue ? item.columnValue : item.defaultValue;
							if (item.columnValue == "一般" || item.columnValue == "1") {
								obj.columnValue = "1";
							} else if (item.columnValue == "即征即退" || item.columnValue == "2") {
								obj.columnValue = "2";
							} else {
								obj.columnValue = '';
							}
							console.log('发票项目类型', obj.columnValue)


							// if (item.defaultValue) {
							//   obj.columnValue = item.defaultValue;
							// } else {
							//   if (item.columnValue == "一般" || item.columnValue == "1") {
							//     obj.columnValue = "1";
							//   } else if (
							//     item.columnValue == "即征即退" ||
							//     item.columnValue == "2"
							//   ) {
							//     obj.columnValue = "2";
							//   } else {
							//     obj.columnValue = "";
							//   }
							// }
							invoiceColumns.push(obj);
						} else if (item.columnTitle == "应税类型") {
							item.columnValue = item.columnValue ? item.columnValue : item.defaultValue;
							if (item.columnValue == "应税货物" || item.columnValue == "1") {
								obj.columnValue = "1";
							} else if (item.columnValue == "应税劳务" || item.columnValue == "2") {
								obj.columnValue = "2";
							} else if (item.columnValue == "应税服务" || item.columnValue == "3") {
								obj.columnValue = "3";
							} else {
								obj.columnValue = '';
							}
							console.log('应税类型', obj.columnValue)

							// if (item.defaultValue) {
							//   obj.columnValue = item.defaultValue;
							// } else {
							//   if (item.columnValue == "应税货物" || item.columnValue == "1") {
							//     obj.columnValue = "1";
							//   } else if (
							//     item.columnValue == "应税劳务" ||
							//     item.columnValue == "2"
							//   ) {
							//     obj.columnValue = "2";
							//   } else if (
							//     item.columnValue == "应税服务" ||
							//     item.columnValue == "3"
							//   ) {
							//     obj.columnValue = "3";
							//   } else {
							//     obj.columnValue = "";
							//   }
							// }
							invoiceColumns.push(obj);
						} else if (item.columnTitle == "是否是辅导期") {
							item.columnValue = item.columnValue ? item.columnValue : item.defaultValue;
							if (item.columnValue == "是" || item.columnValue == "1") {
								obj.columnValue = "1";
							} else if (item.columnValue == "否" || item.columnValue == "2") {
								obj.columnValue = "2";
							} else {
								obj.columnValue = item.defaultValue;
							}
							console.log('是否是辅导期', obj.columnValue)
							// if (item.defaultValue) {
							//   obj.columnValue = item.defaultValue;
							// } else {
							//   if (item.columnValue == "是" || item.columnValue == "1") {
							//     obj.columnValue = "1";
							//   } else if (item.columnValue == "否" || item.columnValue == "2") {
							//     obj.columnValue = "2";
							//   } else {
							//     obj.columnValue = "";
							//   }
							// }
							invoiceColumns.push(obj);
						} else if (item.columnTitle == "增值税税率") {
							obj.columnValue = zengzhiValue;
							invoiceColumns.push(obj);
						} else if (item.columnTitle == "印花税税率") {
							obj.columnValue = yinhuaValue;
							invoiceColumns.push(obj);
						} else if (item.columnTitle == "城建税税率") {
							obj.columnValue = chengjianValue;
							invoiceColumns.push(obj);
						} else if (item.columnTitle == "消费税税率") {
							obj.columnValue = xiaofeiValue;
							invoiceColumns.push(obj);
						} else if (item.columnTitle == "发票税额" || item.columnTitle == "本期用于抵扣的旅客运输服务扣税凭证税额" ||
							item.columnTitle == "发票金额" || item.columnTitle == "本期用于抵扣的旅客运输服务扣税凭证金额" ||
							item.columnTitle == "发票张数" || item.columnTitle == "本期用于抵扣的旅客运输服务扣税凭证张数" ||
							
							item.columnTitle == "农产品收购发票或者销售发票" || item.columnTitle == "海关进口增值税专用缴款书" ||
							item.columnTitle == "代扣代缴税收缴款凭证" || item.columnTitle == "加计扣除农产品进项税额" ||
							item.columnTitle == "海关进口增值税专用缴款书金额" || item.columnTitle == "农产品收购发票或者销售发票金额" ||
							item.columnTitle == "海关进口增值税专用缴款书张数" || item.columnTitle == "农产品收购发票或者销售发票张数" ||
							item.columnTitle == "代扣代缴税收缴款凭证张数") {
							obj.columnTitle = item.columnTitle;
							obj.columnTemValue = item.columnTemValue;
							obj.columnValue = item.columnValue ?
								item.columnValue :
								item.defaultValue;

						} else {
							obj.columnValue = item.columnValue ?
								item.columnValue :
								item.defaultValue;
						}
						invoiceColumns.push(obj);
					});
					console.log("当前客户的申报类型", this.userobj.reportTaxType);
					// // 1：一般纳税人，2：小规模
					var newobj = {};

					invoiceColumns.forEach(item => {
						if (item.columnTitle == "发票税额") {
							columnValue1 = item.columnValue;
						}
						if (item.columnTitle == "本期用于抵扣的旅客运输服务扣税凭证税额") {
							columnValue3 = item.columnValue;
							columnValue4 = item.columnTemValue;
						}
						if (item.columnTitle == "海关进口增值税专用缴款书") {
							columnValue13 = item.columnValue;
							columnValue14 = item.columnTemValue;
						}
						if (item.columnTitle == "农产品收购发票或者销售发票") {
							columnValue23 = item.columnValue;
							columnValue24 = item.columnTemValue;
						}
						if (item.columnTitle == "代扣代缴税收缴款凭证") {
							columnValue33 = item.columnValue;
							columnValue34 = item.columnTemValue;
						}
						if (item.columnTitle == "加计扣除农产品进项税额") {
							columnValue43 = item.columnValue;
							columnValue44 = item.columnTemValue;
						}

						if (item.columnTitle == "发票金额") {
							columnValue5 = item.columnValue;
						}
						if (item.columnTitle == "本期用于抵扣的旅客运输服务扣税凭证金额") {
							columnValue7 = item.columnValue;
							columnValue8 = item.columnTemValue;
						}
						if (item.columnTitle == "海关进口增值税专用缴款书金额") {
							columnValue17 = item.columnValue;
							columnValue18 = item.columnTemValue;
						}
						if (item.columnTitle == "农产品收购发票或者销售发票金额") {
							columnValue27 = item.columnValue;
							columnValue28 = item.columnTemValue;
						}

						if (item.columnTitle == "发票张数") {
							columnValue9 = item.columnValue;
						}
						if (item.columnTitle == "本期用于抵扣的旅客运输服务扣税凭证张数") {
							columnValue11 = item.columnValue;
							columnValue12 = item.columnTemValue;
						}
						if (item.columnTitle == "海关进口增值税专用缴款书张数") {
							columnValue21 = item.columnValue;
							columnValue22 = item.columnTemValue;
						}
						if (item.columnTitle == "农产品收购发票或者销售发票张数") {
							columnValue31 = item.columnValue;
							columnValue32 = item.columnTemValue;
						}
						if (item.columnTitle == "代扣代缴税收缴款凭证张数") {
							columnValue41 = item.columnValue;
							columnValue42 = item.columnTemValue;
						}

					})
					invoiceColumns.forEach(item => {
						if (item.columnTitle == "发票税额") {
							item.columnValue = parseFloat(columnValue1) + parseFloat(columnValue3) - parseFloat(columnValue4) + parseFloat(
								columnValue13) - parseFloat(columnValue14) + parseFloat(columnValue23) - parseFloat(columnValue24) +
							parseFloat(columnValue33) - parseFloat(columnValue34) + parseFloat(columnValue43) - parseFloat(columnValue44);
						}

						if (item.columnTitle == "发票金额") {
							item.columnValue = parseFloat(columnValue5) + parseFloat(columnValue7) - parseFloat(columnValue8) + parseFloat(
								columnValue17) - parseFloat(columnValue18) + parseFloat(columnValue27) - parseFloat(columnValue28);
						}

						if (item.columnTitle == "发票张数") {
							console.log('columnValue9',columnValue9);
							console.log('columnValue11',columnValue11);
							console.log('columnValue12',columnValue12);
							console.log('columnValue21',columnValue21);
							console.log('columnValue22',columnValue22);
							console.log('columnValue31',columnValue31);
							console.log('columnValue32',columnValue32);
							console.log('columnValue41',columnValue41);
							console.log('columnValue42',columnValue42);
							item.columnValue = parseFloat(columnValue9) + parseFloat(columnValue11) - parseFloat(columnValue12) +
								parseFloat(columnValue21) - parseFloat(columnValue22) + parseFloat(columnValue31) - parseFloat(columnValue32) +
							parseFloat(columnValue41) - parseFloat(columnValue42)
						}

					})

					invoiceColumns = invoiceColumns.reduce(function(item, next) {
						newobj[next.columnId] ? '' : newobj[next.columnId] = true && item.push(next);
						return item;
					}, []);

					let declarationType;
					if (this.userobj.reportTaxType == 233) {
						declarationType = 2;
					} else if (this.userobj.reportTaxType == 232) {
						declarationType = 1;
					}

					let params = {
						invoiceId: this.detailData.invoiceId, //发票Id (如果是发票配置表)
						invoiceTmplId: this.detailData.tmplId, //模板id （如果是模板配置表）
						invoiceTaxableType: this.detailData.invoiceTaxableType, //应税类型：1 - 应税货物；2 - 应税劳务；3 - 应税服务
						invoiceName: this.detailData.invoiceName, //发票名称 this.detailData.invoiceName
						invoiceListId: this.detailData.invoiceListId, //发票信息Id
						invoiceCategory: this.detailData.invoiceCategory, //发票分类：防伪税控；税务局代开；有票收入；无票收入
						invoiceType: this.detailData.invoiceType, //发票类型：（防伪税控/代开-）专票；（防伪税控/代开-）普票；（有票收入-）形式发票；（有票收入-）通用机打；（无票收入-）无票
						area: this.detailData.area, //适用区域代码：All-通用
						invoiceTaxManageType: this.detailData.invoiceTaxManageType, //税务管理类型
						taxCalcType: this.detailData.taxCalcType, //计税方法：1 - 一般计税；2 - 简易征收计税
						reducePriority: this.detailData.reducePriority, //抵扣优先级
						tmplShowType: this.detailData.tmplShowType, //下拉框（0-发票 1-其他模板）
						taxesTaxType: this.userobj.reportTaxType, //税务类型：0：通用；232：小规模；233：一般纳税人
						type: this.detailData.type, //对应列/税费下拉框 1-列 2-税费
						declarationType: declarationType, //1：小规模，2一般纳税人
						e9zConfigInvoiceColumnList: invoiceColumns,
						taxationId: this.taxationId
					};
					// 修改模板时新增3个字段
					let invoiceTaxableType = "",
						taxCalcType = "",
						taxesTaxType = "";

					if (this.detailData.tmplId) {
						console.log(
							"this.detailData.e9zConfigInvoiceColumnList",
							this.detailData.e9zConfigInvoiceColumnList
						);
						this.detailData.e9zConfigInvoiceColumnList.forEach(item => {
							if (item.columnTitle == "应税类型") {
								if (item.columnValue == "应税货物" || item.columnValue == "1") {
									params.invoiceTaxableType = "1";
								} else if (
									item.columnValue == "应税劳务" ||
									item.columnValue == "2"
								) {
									params.invoiceTaxableType = "2";
								} else if (
									item.columnValue == "应税服务" ||
									item.columnValue == "3"
								) {
									params.invoiceTaxableType = "3";
								}
							}
							if (item.columnTitle == "发票项目类型") {
								if (item.columnValue == "一般" || item.columnValue == "1") {
									params.taxCalcType = "1";
								} else if (
									item.columnValue == "即征即退" ||
									item.columnValue == "2"
								) {
									params.taxCalcType = "2";
								}
							}
						});
					}

					console.log("params", params);
					axios
						.post("/perTaxToolTwo/e9zCalculate/invoiceCalculate", params)
						.then(res => {
							console.log("修改数据", res);
							if (res.data.code == 200) {
								this.$message({
									message: "修改成功",
									type: "success"
								});
								this.detailDialogVisible = false;
								this.getInvoiceLeaveShowList(true);
								this.getShowSumIncome();
								this.getShowSumDeduct();
								this.getShowSumTaxPayable();
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
			closeDetail() {
				this.detailDialogVisible = false;
				this.getInvoiceLeaveShowList(false);
			},
			// 保存提交数据
			save() {
				console.log("nextStepList", this.nextStepList);
				// 校验
				var intreg = /^([0]|[1-9][0-9]*)$/;
				var float2reg = /^(-)?\d{1,14}(\.\d{1,2})?$/;
				var posfloat2reg = /^\d{1,14}(\.\d{1,2})?$/;
				this.nextStepList.forEach((item, index) => {
					if (item.columnTitle == "发票张数") {
						if (this.form.name == "") {
							this.$set(item, "errInfo", "请填入发票张数");
						} else if (!intreg.test(this.form.name)) {
							this.$set(item, "errInfo", "只可输入整数");
						} else {
							this.$set(item, "errInfo", "");
						}
					} else if (item.columnTitle == "票面金额") {
						if (this.form.amount == "") {
							this.$set(item, "errInfo", "请填入票面金额");
						} else if (!float2reg.test(this.form.amount)) {
							this.$set(item, "errInfo", "整数最多14位，小数最多2位");
						} else {
							this.$set(item, "errInfo", "");
						}
					} else {
						// console.log(item.columnShow, item.columnEdit, item.columnRequire);
						if (item.columnEdit == 1) {
							if (item.columnRequire == 1) {
								if (item.defaultValue === null || item.defaultValue === "") {
									console.log('空', item)
									this.$set(item, "errInfo", "必填项不可为空");
								} else if (item.columnEditRule == 1) {
									if (item.columnTitle == '负数冲减') {
										var reg = /^((-\d{1,14}(\.\d{1,2})?)|0|0.00|0.0)$/;
										if (!reg.test(item.defaultValue)) {
											this.$set(item, "errInfo", "只能填负数，小数最多2位");
										} else {
											this.$set(item, "errInfo", "");
										}
									} else {
										if (!float2reg.test(item.defaultValue)) {
											this.$set(item, "errInfo", "整数最多14位，小数最多2位");
										} else {
											this.$set(item, "errInfo", "");
										}
									}
								} else if (
									item.columnEditRule == 0 ||
									item.columnEditRule == null
								) {
									if (!posfloat2reg.test(item.defaultValue)) {
										this.$set(item, "errInfo", "正数，整数最多14位，小数最多2位");
									} else {
										this.$set(item, "errInfo", "");
									}
								} else {
									this.$set(item, "errInfo", "");
								}

							} else {
								if (item.defaultValue != null) {
									if (item.columnEditRule == 1) {
										if (item.columnTitle == '负数冲减') {
											var reg = /^((-\d{1,14}(\.\d{1,2})?)|0|0.00|0.0)$/;
											if (!reg.test(item.defaultValue)) {
												this.$set(item, "errInfo", "只能填负数，小数最多2位");
											} else {
												this.$set(item, "errInfo", "");
											}
										} else {
											if (!float2reg.test(item.defaultValue)) {
												this.$set(item, "errInfo", "整数最多14位，小数最多2位");
											} else {
												this.$set(item, "errInfo", "");
											}
										}
									} else if (
										item.columnEditRule == 0 ||
										item.columnEditRule == null
									) {
										if (!posfloat2reg.test(item.defaultValue)) {
											this.$set(
												item,
												"errInfo",
												"正数，整数最多14位，小数最多2位"
											);
										} else {
											this.$set(item, "errInfo", "");
										}
									} else {
										this.$set(item, "errInfo", "");
									}
								}
							}
						}
					}
				});
				console.log("this.nextStepSelectList", this.nextStepSelectList);
				if (this.nextStepSelectList.length > 0) {
					this.nextStepSelectList.forEach((item, index) => {
						if (item.e9zConfigInvoiceTaxesRateList.length > 0) {
							if (item.taxesTitle == "增值税") {
								console.log(222, item.taxesValue);
								if (item.taxesValue == undefined) {
									this.$set(item, "errInfo", "请选择增值税");
								} else {
									this.$set(item, "errInfo", "");
								}
							}
							if (item.taxesTitle == "印花税") {
								if (item.taxesValue == undefined) {
									this.$set(item, "errInfo", "请选择印花税");
								} else {
									this.$set(item, "errInfo", "");
								}
							}
							if (item.taxesTitle == "城市维护建设税") {
								if (item.taxesValue == undefined) {
									this.$set(item, "errInfo", "请选择城市维护建设税");
								} else {
									this.$set(item, "errInfo", "");
								}
							}
							if (item.taxesTitle == "消费税") {
								if (item.taxesValue == undefined) {
									this.$set(item, "errInfo", "请选择消费税");
								} else {
									this.$set(item, "errInfo", "");
								}
							}
							console.log(111, item.taxesValue);
						}
					});
				}
				let flag = false;
				this.nextStepList.forEach((item, index) => {
					if (item.errInfo != "") {
						flag = true;
					}
				});
				if (this.nextStepSelectList.length > 0) {
					this.nextStepSelectList.forEach((item, index) => {
						if (item.errInfo != "") {
							flag = true;
						}
					});
				}
				console.log("flag", flag);
				if (!flag) {
					let invoiceColumns = [];
					let zengzhiValue, yinhuaValue, chengjianValue, xiaofeiValue;
					zengzhiValue = 0;
					yinhuaValue = 0;
					chengjianValue = 0;
					xiaofeiValue = 0;
					this.nextStepSelectList.forEach((item, index) => {
						if (item.taxesTitle == "增值税") {
							// if (item.taxesValue != undefined) {
							zengzhiValue = item.taxesValue;
							// }
						}
						if (item.taxesTitle == "印花税") {
							// if (item.taxesValue != undefined) {
							yinhuaValue = item.taxesValue;
							// }
						}
						if (item.taxesTitle == "城市维护建设税") {
							// if (item.taxesValue != undefined) {
							chengjianValue = item.taxesValue;
							// }
						}
						if (item.taxesTitle == "消费税") {
							// if (item.taxesValue != undefined) {
							xiaofeiValue = item.taxesValue;
							// }
						}
					});
					console.log(
						"选中的税率",
						zengzhiValue,
						yinhuaValue,
						chengjianValue,
						xiaofeiValue
					);
					this.nextStepList.forEach((item, index) => {
						var obj = {};
						obj.columnId = item.columnId;
						if (item.columnTitle == "发票张数") {
							obj.columnValue = this.form.name;
							invoiceColumns.push(obj);
						} else if (item.columnTitle == "票面金额") {
							obj.columnValue = this.form.amount;
							invoiceColumns.push(obj);
						} else if (item.columnTitle == "发票类型") {
							if (this.invoiceName == "即征即退") {
								obj.columnValue = "2";
								invoiceColumns.push(obj);
							}
						} else if (item.columnName == "tax_info_id") {
							obj.columnValue = this.taxInfoId;
							invoiceColumns.push(obj);
						} else if (item.columnName == "taxation_id") {
							obj.columnValue = this.taxationId;
							invoiceColumns.push(obj);
						} else if (item.columnTitle == "增值税税率") {
							obj.columnValue = zengzhiValue;
							invoiceColumns.push(obj);
						} else if (item.columnTitle == "印花税税率") {
							obj.columnValue = yinhuaValue;
							invoiceColumns.push(obj);
						} else if (item.columnTitle == "城建税税率") {
							obj.columnValue = chengjianValue;
							invoiceColumns.push(obj);
						} else if (item.columnTitle == "消费税税率") {
							obj.columnValue = xiaofeiValue;
							invoiceColumns.push(obj);
						}
						// else if (item.columnTitle == "印花税核定征收率") {
						// 	obj.columnValue = this.authorizedLevyRate ? this.authorizedLevyRate : '0';
						// 	invoiceColumns.push(obj);
						// } 
						else if (item.columnTitle == "发票项目类型") {
							obj.columnValue = this.nextStepRes.invoiceName == '即征即退' ? '2' : '1';
							invoiceColumns.push(obj);
						} else if (item.columnTitle == "应税类型") {
							obj.columnValue = this.nextStepRes.invoiceTaxableType;
							invoiceColumns.push(obj);
						} else {
							obj.columnValue = item.defaultValue;
							// if (item.columnShow == 1 && item.columnEdit == 1) {
							invoiceColumns.push(obj);
							// }
						}
					});
					var newobj = {};
					invoiceColumns = invoiceColumns.reduce(function(item, next) {
						newobj[next.columnId] ? '' : newobj[next.columnId] = true && item.push(next);
						return item;
					}, []);

					console.log("当前客户的申报类型", this.userobj.reportTaxType);
					// // 1：一般纳税人，2：小规模

					let declarationType;
					if (this.userobj.reportTaxType == 233) {
						declarationType = 2;
					} else if (this.userobj.reportTaxType == 232) {
						declarationType = 1;
					}
					let params = {
						invoiceId: this.nextStepRes.invoiceId, //发票Id (如果是发票配置表)
						invoiceTmplId: this.detailData.tmplId, //模板id （如果是模板配置表）
						invoiceTaxableType: this.nextStepRes.invoiceTaxableType, //应税类型：1 - 应税货物；2 - 应税劳务；3 - 应税服务
						invoiceName: this.nextStepRes.invoiceName, //发票名称
						invoiceListId: this.nextStepRes.invoiceListId, //发票信息Id
						invoiceCategory: this.nextStepRes.invoiceCategory, //发票分类：防伪税控；税务局代开；有票收入；无票收入
						invoiceType: this.nextStepRes.invoiceType, //发票类型：（防伪税控/代开-）专票；（防伪税控/代开-）普票；（有票收入-）形式发票；（有票收入-）通用机打；（无票收入-）无票
						area: this.nextStepRes.area, //适用区域代码：All-通用
						invoiceTaxManageType: this.nextStepRes.invoiceTaxManageType, //税务管理类型
						taxCalcType: this.nextStepRes.taxCalcType, //计税方法：1 - 一般计税；2 - 简易征收计税
						reducePriority: this.nextStepRes.reducePriority, //抵扣优先级
						tmplShowType: this.nextStepRes.tmplShowType, //下拉框（0-发票 1-其他模板）
						taxesTaxType: this.userobj.reportTaxType, //税务类型：0：通用；232：小规模；233：一般纳税人
						type: this.nextStepRes.type, //对应列/税费下拉框 1-列 2-税费
						declarationType: declarationType, //申报类型 1：小规模，2一般纳税人
						e9zConfigInvoiceColumnList: invoiceColumns,
						taxationId: this.taxationId
					};
					console.log("params", params);
					axios
						.post("/perTaxToolTwo/e9zCalculate/invoiceCalculate", params)
						.then(res => {
							console.log("插入数据", res);
							if (res.data.code == 200) {
								this.$message({
									message: "添加成功",
									type: "success"
								});

								this.nextStepDialogVisible = false;
								this.searchList.invoiceName = '';
								this.searchList.invoiceType = '';
								this.searchinvoiceType = '';
								this.searchinvoiceName = '';
								this.getInvoiceLeaveShowList(true);
								this.getShowSumIncome();
								this.getShowSumDeduct();
								this.getShowSumTaxPayable();
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

			setgsskhj() {
				this.gsskhj = 0;
			},
			// 流程步骤提交
			submitStep(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						console.log("this.searchList", this.searchList);
						if (this.taxationId == "" || this.taxInfoId == "") {
							this.$message({
								message: "无数据时不支持审批",
								type: "warning"
							});
							return;
						}
						// if (this.invoicePanelList.length == 0) {
						// 	this.$message({
						// 		message: "当前暂无发票数据，不支持审批",
						// 		type: "warning"
						// 	});
						// 	return;
						// }
						// this.gsskhj=0;
						console.log("this.gsskhj", this.gsskhj);
						if (this.gsskhj === "") {
							console.log("11122");
							this.$message({
								message: "未上传工资表，不支持审批",
								type: "warning"
							});
							return;
						}
						console.log(111);
						this.$confirm("审批前需要先生成报表，是否同时生成报表?", "提示", {
								confirmButtonText: "是",
								cancelButtonText: "否",
								type: "warning"
							})
							.then(() => {
								this.insertReport("formSearch");
								let sums, nextStepName;

								console.log("sums", this.sums);
								sums = Number(this.sums[3]) + Number(this.gsskhj);
								console.log("111sums", sums);
								if (sums > 200000) {
									nextStepName = "大额审核";
								} else {
									nextStepName = "税款审核";
								}
								let params = {
									taxationId: this.taxationId,
									taxInfoId: this.taxInfoId,
									// stepName: "做账",
									// nextStepName: nextStepName,
									stepName: "税款审核",
									nextStepName: '税款确认',
									// sumData: this.gsskhj,
									sumData: this.sums,
									customerName: this.customerName,
									accountPeriod: this.accountPeriod,
									customerId: this.customerId,
									perTax: this.gsskhj,
								};
								console.log("params", params);
								axios
									.post("/perTaxToolTwo/e9z/taxStep/submit", params)
									.then(res => {
										console.log("流程步骤提交", res);
										if (res.data.code == 200) {
											this.$message({
												message: "审批成功",
												type: "success"
											});
											this.getInvoiceLeaveShowList(true);
											// 隐藏新增按钮,数据不可修改
											this.issubmit = true;
											this.addbtnflag = false;
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
							})
							.catch(() => {});
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},

			submitStep1(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						console.log("this.searchList", this.searchList);
						if (this.taxationId == "" || this.taxInfoId == "") {
							this.$message({
								message: "无数据时不支持审批",
								type: "warning"
							});
							return;
						}
						// if (this.invoicePanelList.length == 0) {
						// 	this.$message({
						// 		message: "当前暂无发票数据，不支持审批",
						// 		type: "warning"
						// 	});
						// 	return;
						// }
						// this.gsskhj=0;
						console.log("this.gsskhj", this.gsskhj);
						if (this.gsskhj === "") {
							console.log("11122");
							this.$message({
								message: "未上传工资表，不支持审批",
								type: "warning"
							});
							return;
						}
						console.log(111);

						// this.insertReport("formSearch");
						let sums, nextStepName;

						console.log("sums", this.sums);
						sums = Number(this.sums[3]) + Number(this.gsskhj);
						console.log("111sums", sums);
						if (sums > 200000) {
							nextStepName = "大额审核";
						} else {
							nextStepName = "税款审核";
						}
						let params = {
							taxationId: this.taxationId,
							taxInfoId: this.taxInfoId,
							// stepName: "做账",
							// nextStepName: nextStepName,
							stepName: "税款审核",
							nextStepName: '税款确认',
							sumData: this.sums,
							customerName: this.customerName,
							accountPeriod: this.accountPeriod,
							customerId: this.customerId,
							perTax: this.gsskhj,
						};
						console.log("params", params);
						axios
							.post("/perTaxToolTwo/e9z/e9zBusinessIncomeTaxRecord/createIncTaxRecord", params)
							.then(res => {
								console.log("流程步骤提交", res);
								if (res.data.code == 200) {
									this.$message({
										message: "保存成功",
										type: "success"
									});
									this.getInvoiceLeaveShowList(true);
									this.getHistoricalAccountingTaxDetail();
									this.dialogVisibleTable = true;
									// 隐藏新增按钮,数据不可修改
									// this.issubmit = true;
									// this.addbtnflag = false;
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
						console.log("error submit!!");
						return false;
					}
				});
			},
			getHistoricalAccountingTaxDetail() {
				let params = {

					"accountPeriodStart": this.accountPeriod,
					"accountPeriodEnd": this.accountPeriod,
					"customerId": this.customerId

				};
				this.axios.post('perTaxToolTwo/e9z/e9zBusinessIncomeTaxRecord/getHistoricalAccountingTaxDetail', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.detailTable = res.data.data;
							// this.total = res.data.count;
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

			submitStep2(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						console.log("this.searchList", this.searchList);
						let params = {
							customerName: this.customerName,
							accountPeriod: this.accountPeriod,
							customerId: this.customerId,
							taxesTaxType: this.userobj.reportTaxType,
						};
						console.log("params", params);
						axios
							.post("/perTaxToolTwo/e9/acct/invEnterTax", params)
							.then(res => {
								console.log("流程步骤提交", res);
								if (res.data.code == 200) {
									this.$message({
										message: "保存成功",
										type: "success"
									});
									this.getInvoiceLeaveShowList(true);
									// 隐藏新增按钮,数据不可修改
									// this.issubmit = true;
									// this.addbtnflag = false;
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
						console.log("error submit!!");
						return false;
					}
				});
			},

			// 打开详情弹窗
			showDetail(item) {
				console.log("当前客户的申报类型", this.userobj.reportTaxType);
				// // 1：一般纳税人，2：小规模
				if (this.userobj.reportTaxType == 233) {
					this.sbnszl = "一般纳税人";
				} else if (this.userobj.reportTaxType == 232) {
					this.sbnszl = "小规模纳税人";
				}
				if (item.taxCalcType == 1) {
					this.$set(item, "taxCalcTypeName", '一般计税');
				} else if (item.taxCalcType == 2) {
					this.$set(item, "taxCalcTypeName", '简易征收计税');
				} else if (item.taxCalcType == 3) {
					this.$set(item, "taxCalcTypeName", '免税计税');
				}

				this.detailDialogVisible = true;

				item.invoiceColumnList = [];
				item.taxColumnList = [];
				let zengzhiValue, yinhuaValue, chengjianValue, xiaofeiValue;
				item.e9zConfigInvoiceColumnList.forEach(v => {
					this.$set(v, "isEdit", false);
					this.$set(v, "errInfo", "");
					if (v.columnTitle == "发票张数") {
						item.pages = parseInt(v.columnValue);
					}
					if (v.columnTitle == "发票项目类型") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						if (v.columnValue == "1" || v.columnValue == "一般") {
							v.columnValue = "一般";
						} else if (v.columnValue == "2" || v.columnValue == "即征即退") {
							v.columnValue = "即征即退";
						} else {
							v.columnValue = "";
						}
						console.log('应税类型', v.columnValue)
					}
					if (v.columnTitle == "应税类型") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						if (v.columnValue == "1" || v.columnValue == "应税货物") {
							v.columnValue = "应税货物";
						} else if (v.columnValue == "2" || v.columnValue == "应税劳务") {
							v.columnValue = "应税劳务";
						} else if (v.columnValue == "3" || v.columnValue == "应税服务") {
							v.columnValue = "应税服务";
						} else {
							v.columnValue = "";
						}
						console.log('应税类型', v.columnValue)
					}
					if (v.columnTitle == "是否是辅导期") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						if (v.columnValue == "1" || v.columnValue == "是") {
							v.columnValue = "是";
						} else if (v.columnValue == "2" || v.columnValue == "否") {
							v.columnValue = "否";
						} else {
							v.columnValue = "";
						}
						console.log('是否是辅导期', v.columnValue)
					}
					if (v.columnTitle == "发票税额") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						v.columnTemValue = v.columnValue ? v.columnValue : v.defaultValue;
						console.log('是否是发票税额', v.columnValue)
					}
					if (v.columnTitle == "本期用于抵扣的旅客运输服务扣税凭证税额") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						v.columnTemValue = v.columnValue ? v.columnValue : v.defaultValue;
						console.log('是否是本期用于抵扣的旅客运输服务扣税凭证', v.columnValue)
					}
					if (v.columnTitle == "发票金额") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						v.columnTemValue = v.columnValue ? v.columnValue : v.defaultValue;
						console.log('是否是发票金额', v.columnValue)
					}
					if (v.columnTitle == "本期用于抵扣的旅客运输服务扣税凭证金额") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						v.columnTemValue = v.columnValue ? v.columnValue : v.defaultValue;
						console.log('是否是本期用于抵扣的旅客运输服务扣税凭证金额', v.columnValue)
					}
					if (v.columnTitle == "发票张数") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						v.columnTemValue = v.columnValue ? v.columnValue : v.defaultValue;
						console.log('是否是发票张数', v.columnValue)
					}
					if (v.columnTitle == "本期用于抵扣的旅客运输服务扣税凭证张数") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						v.columnTemValue = v.columnValue ? v.columnValue : v.defaultValue;
						console.log('是否是本期用于抵扣的旅客运输服务扣税凭证张数', v.columnValue)
					}
					
					
					if (v.columnTitle == "海关进口增值税专用缴款书") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						v.columnTemValue = v.columnValue ? v.columnValue : v.defaultValue;
					}
					if (v.columnTitle == "农产品收购发票或者销售发票") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						v.columnTemValue = v.columnValue ? v.columnValue : v.defaultValue;
						console.log('是否是本期用于抵扣的旅客运输服务扣税凭证', v.columnValue)
					}
					if (v.columnTitle == "代扣代缴税收缴款凭证") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						v.columnTemValue = v.columnValue ? v.columnValue : v.defaultValue;
					}
					if (v.columnTitle == "加计扣除农产品进项税额") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						v.columnTemValue = v.columnValue ? v.columnValue : v.defaultValue;
					}
					if (v.columnTitle == "海关进口增值税专用缴款书金额") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						v.columnTemValue = v.columnValue ? v.columnValue : v.defaultValue;
					}
					if (v.columnTitle == "农产品收购发票或者销售发票金额") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						v.columnTemValue = v.columnValue ? v.columnValue : v.defaultValue;
					}
					
					if (v.columnTitle == "海关进口增值税专用缴款书张数") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						v.columnTemValue = v.columnValue ? v.columnValue : v.defaultValue;
					}if (v.columnTitle == "农产品收购发票或者销售发票张数") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						v.columnTemValue = v.columnValue ? v.columnValue : v.defaultValue;
					}if (v.columnTitle == "代扣代缴税收缴款凭证张数") {
						v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
						v.columnTemValue = v.columnValue ? v.columnValue : v.defaultValue;
					}
					
					if (v.columnShow == 1) {
						if (v.columnTitle != "是否是辅导期" || v.columnTitle != "应税类型" || v.columnTitle != "发票项目类型") {
							v.columnValue = v.columnValue ?
								this.fomatFloat(v.columnValue, 2) :
								this.fomatFloat(v.defaultValue, 2);
						} else if (v.columnTitle == "应补退印花税") {
							v.columnValue = v.columnValue ?
								this.fomatFloat(v.columnValue, 1) :
								this.fomatFloat(v.defaultValue, 1);
						}
						item.invoiceColumnList.push(v);
					}
					if (v.columnShow == 2) {

						v.columnValue = v.columnValue ?
							this.fomatFloat(v.columnValue, 2) :
							this.fomatFloat(v.defaultValue, 2);

						item.invoiceColumnList.push(v);
					}

					if (v.columnTitle == "增值税税率") {
						zengzhiValue = parseFloat(v.columnValue);
					} else if (v.columnTitle == "印花税税率") {
						yinhuaValue = parseFloat(v.columnValue);
					} else if (v.columnTitle == "城建税税率") {
						chengjianValue = parseFloat(v.columnValue);
					} else if (v.columnTitle == "消费税税率") {
						xiaofeiValue = parseFloat(v.columnValue);
					}
				});
				if (item.invoiceId) {
					item.e9zConfigInvoiceTaxesList.forEach(v => {
						this.$set(v, "errInfo", "");
						if (v.taxesTitle == "增值税") {
							this.$set(v, "taxesValue", zengzhiValue);
						} else if (v.taxesTitle == "印花税") {
							this.$set(v, "taxesValue", yinhuaValue);
						} else if (v.taxesTitle == "城市维护建设税") {
							this.$set(v, "taxesValue", chengjianValue);
						} else if (v.taxesTitle == "消费税") {
							this.$set(v, "taxesValue", xiaofeiValue);
						}
					});
					console.log(
						"item.e9zConfigInvoiceTaxesList",
						item.e9zConfigInvoiceTaxesList
					);

				}
				console.log(
					"item.invoiceColumnList",
					item.invoiceColumnList
				);

				this.detailData = item;
				console.log("item,", item);
			},
			editPanel(item, child) {
				console.log("item,,,", item);
				console.log("child,,,", child);
				if (child.columnTitle.indexOf("税率") > -1) {
					if (item.invoiceId) {
						this.showDetail(item);
					}
				} else {
					child.columnValue = child.columnValue ?
						this.fomatFloat(child.columnValue, 2) :
						this.fomatFloat(child.defaultValue, 2);
					item.e9zConfigInvoiceColumnList.forEach(v => {
						if (child.columnId == v.columnId) {
							if (v.columnEdit == 1) {
								console.log("可编辑");
								this.$set(v, "isEdit", true);
							}
						} else {
							this.$set(v, "isEdit", false);
						}
					});
				}
			},
			unfocusedPanel(item, child) {
				console.log("item,,,", item);
				console.log("child,,,", child);
				this.$set(child, "errInfo", "");
				// 校验
				var intreg = /^([0]|[1-9][0-9]*)$/;
				var float2reg = /^(-)?\d{1,14}(\.\d{1,2})?$/;
				var posfloat2reg = /^\d{1,14}(\.\d{1,2})?$/;
				if (
					child.columnTitle != "发票项目类型" &&
					child.columnTitle != "应税类型" &&
					child.columnTitle != "是否是辅导期"
				) {
					if (child.columnTitle == "发票张数") {
						if (child.columnValue == "") {
							this.$set(child, "errInfo", "请填入发票张数");
							this.$message({
								message: "请填入发票张数",
								type: "warning"
							});
						} else if (!intreg.test(child.columnValue)) {
							this.$set(child, "errInfo", "只可输入整数");
							this.$message({
								message: "该列只可输入整数",
								type: "warning"
							});
						} else {
							this.$set(child, "errInfo", "");
						}
					} else {
						if (child.columnRequire == 1) {
							if (child.columnValue === null || child.columnValue === "") {
								this.$set(child, "errInfo", "必填项不可为空");
								this.$message({
									message: "该列必填，不可为空",
									type: "warning"
								});
							} else if (child.columnEditRule == 1) {
								if (child.columnTitle == '负数冲减') {
									var reg = /^((-\d{1,14}(\.\d{1,2})?)|0|0.00|0.0)$/;
									if (!reg.test(child.columnValue)) {
										this.$set(child, "errInfo", "只能填负数，小数最多2位");
										this.$message({
											message: "只能填负数，小数最多2位",
											type: "warning"
										});
									} else {
										this.$set(child, "errInfo", "");
									}
								} else {
									if (!float2reg.test(child.columnValue)) {
										this.$set(child, "errInfo", "整数最多14位，小数最多2位");
										this.$message({
											message: "该列整数最多14位，小数最多2位",
											type: "warning"
										});
									} else {
										this.$set(child, "errInfo", "");
									}
								}

							} else if (
								child.columnEditRule == 0 ||
								child.columnEditRule == null
							) {
								if (!posfloat2reg.test(child.columnValue)) {
									this.$set(child, "errInfo", "正数，整数最多14位，小数最多2位");
									this.$message({
										message: "该列为正数，整数最多14位，小数最多2位",
										type: "warning"
									});
								} else {
									this.$set(child, "errInfo", "");
								}
							} else {
								this.$set(child, "errInfo", "");
							}
						} else {
							if (child.columnValue != null) {
								if (child.columnEditRule == 1) {
									if (child.columnTitle == '负数冲减') {
										var reg = /^((-\d{1,14}(\.\d{1,2})?)|0|0.00|0.0)$/;
										if (!reg.test(child.columnValue)) {
											this.$set(child, "errInfo", "只能填负数，小数最多2位");
											this.$message({
												message: "只能填负数，小数最多2位",
												type: "warning"
											});
										} else {
											this.$set(child, "errInfo", "");
										}
									} else {
										if (!float2reg.test(child.columnValue)) {
											this.$set(child, "errInfo", "整数最多14位，小数最多2位");
											this.$message({
												message: "该列整数最多14位，小数最多2位",
												type: "warning"
											});
										} else {
											this.$set(child, "errInfo", "");
										}
									}

								} else if (
									child.columnEditRule == 0 ||
									child.columnEditRule == null
								) {
									if (!posfloat2reg.test(child.columnValue)) {
										this.$set(
											child,
											"errInfo",
											"正数，整数最多14位，小数最多2位"
										);
										this.$message({
											message: "该列为正数，整数最多14位，小数最多2位",
											type: "warning"
										});
									} else {
										this.$set(child, "errInfo", "");
									}
								} else {
									this.$set(child, "errInfo", "");
								}
							}
						}
					}
				}

				let flag = false;
				if (child.errInfo != "") {
					flag = true;
				}
				console.log(flag);
				if (!flag) {
					item.e9zConfigInvoiceColumnList.forEach(v => {
						if (child.columnId == v.columnId) {
							this.$set(v, "isEdit", false);
						}
					});
					item.invoiceColumnList = [];
					item.taxColumnList = [];
					let zengzhiValue, yinhuaValue, chengjianValue, xiaofeiValue;
					item.e9zConfigInvoiceColumnList.forEach(v => {
						this.$set(v, "isEdit", false);
						this.$set(v, "errInfo", "");
						if (v.columnTitle == "发票张数") {
							item.pages = parseInt(v.columnValue);
						}
						if (v.columnTitle == "发票项目类型") {
							v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
							if (v.columnValue == "1" || v.columnValue == "一般") {
								v.columnValue = "一般";
							} else if (v.columnValue == "2" || v.columnValue == "即征即退") {
								v.columnValue = "即征即退";
							} else {
								v.columnValue = "";
							}
						}
						if (v.columnTitle == "应税类型") {
							v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
							if (v.columnValue == "1" || v.columnValue == "应税货物") {
								v.columnValue = "应税货物";
							} else if (v.columnValue == "2" || v.columnValue == "应税劳务") {
								v.columnValue = "应税劳务";
							} else if (v.columnValue == "3" || v.columnValue == "应税服务") {
								v.columnValue = "应税服务";
							} else {
								v.columnValue = "";
							}
						}
						if (v.columnTitle == "是否是辅导期") {
							v.columnValue = v.columnValue ? v.columnValue : v.defaultValue;
							if (v.columnValue == "1" || v.columnValue == "是") {
								v.columnValue = "是";
							} else if (v.columnValue == "2" || v.columnValue == "否") {
								v.columnValue = "否";
							} else {
								v.columnValue = "";
							}
						}
						// if (v.columnShow == 1) {
						//   v.columnValue = v.columnValue
						//     ? this.fomatFloat(v.columnValue, 2)
						//     : this.fomatFloat(v.defaultValue, 2);
						//   item.invoiceColumnList.push(v);
						// }
						if (v.columnTitle == "增值税税率") {
							zengzhiValue = parseFloat(v.columnValue);
						} else if (v.columnTitle == "印花税税率") {
							yinhuaValue = parseFloat(v.columnValue);
						} else if (v.columnTitle == "城建税税率") {
							chengjianValue = parseFloat(v.columnValue);
						} else if (v.columnTitle == "消费税税率") {
							xiaofeiValue = parseFloat(v.columnValue);
						}
					});
					if (item.invoiceId) {
						item.e9zConfigInvoiceTaxesList.forEach(v => {
							this.$set(v, "errInfo", "");
							if (v.taxesTitle == "增值税") {
								this.$set(v, "taxesValue", zengzhiValue);
							} else if (v.taxesTitle == "印花税") {
								this.$set(v, "taxesValue", yinhuaValue);
							} else if (v.taxesTitle == "城市维护建设税") {
								this.$set(v, "taxesValue", chengjianValue);
							} else if (v.taxesTitle == "消费税") {
								this.$set(v, "taxesValue", xiaofeiValue);
							}
						});
						console.log(
							"item.e9zConfigInvoiceTaxesList",
							item.e9zConfigInvoiceTaxesList
						);
					}
					this.detailData = item;
					this.edit();
				}
			},
			changeValue(item) {
				this.detailData.e9zConfigInvoiceColumnList.forEach(v => {
					if (item.columnId == v.columnId) {
						this.$set(v, "isEdit", true);
					} else {
						this.$set(v, "isEdit", false);
					}
				});
				//
			},
			unfocused(item) {
				this.detailData.e9zConfigInvoiceColumnList.forEach(v => {
					if (item.columnId == v.columnId) {
						this.$set(v, "isEdit", false);
					}
				});
			}
		}
	};
</script>
<style>
	/* .search_contain .el-select,
.search_contain .el-input__inner {
  height: 36px;
} */
	.search_contain .el-date-editor.el-input,
	.el-date-editor.el-input__inner {
		width: 1.6rem;
		min-width: 115px;
	}

	.search_contain .el-date-editor.el-input,
	.el-date-editor.el-input__inner {
		width: 1.6rem;
		min-width: 115px;
	}

	.chartsTable .el-table th>.cell {
		font-size: 0.14rem;
		color: #333;
	}

	.chartsTable .el-table td div {
		font-size: 0.12rem;
		color: #666;
	}

	.chartsTable .el-table td,
	.el-table th {
		padding: 0.04rem 0;
	}

	.smallDialog .el-dialog,
	.smallNextDialog .el-dialog {
		width: 3.6rem;
		min-width: 360px;
	}

	.smallDialog .el-form-item__content {
		margin-left: 110px;
	}

	.detailDialog .el-dialog {
		width: 5.6rem;
	}

	.detailDialog .el-dialog__body {
		padding: 0.3rem 0.45rem;
	}

	.detailDialog .el-input {
		width: 0.9rem;
		float: right;
		font-size: 0.12rem;
	}

	.detailDialog .el-input__inner {
		padding: 0 0.05rem;
		height: 0.3rem;
		line-height: 0.3rem;
	}

	.detailDialog .el-input__icon {
		line-height: 0.3rem;
	}

	.smallDialog .el-form-item__label {
		width: 1rem;
		font-size: 14px;
		padding: 0 0.12rem 0 0;
	}

	.smallNextDialog .el-form-item__content {
		line-height: 0.3rem;
	}

	.smallNextDialog .el-input__icon {
		line-height: 0.3rem;
	}

	.smallNextDialog .el-dialog__body {
		padding: 0.5rem 0.15rem;
	}

	.smallNextDialog .el-input,
	.dataContent .el-input {
		width: 0.9rem;
		float: right;
		font-size: 0.12rem;
	}

	.rightSelect .el-input__suffix,
	.taxRate .el-input__suffix {
		right: -3px;
	}

	.smallNextDialog .el-form-item {
		margin-bottom: 0.11rem;
	}

	.smallNextDialog .el-form-item__label {
		font-size: 0.12rem;
		padding: 0 0.05rem 0 0;
		line-height: 0.3rem;
	}

	.smallNextDialog .el-input__inner,
	.dataContent .el-input__inner {
		padding: 0 0.05rem;
		height: 0.25rem;
		line-height: 0.25rem;
	}

	.el-date-editor.el-input,
	.el-date-editor.el-input__inner {
		width: 1.2rem;
		min-width: 115px;
	}

	.rightSelect .el-select {
		float: right;
	}
</style>

<style lang="less" scoped>
	.main_contain {
		height: calc(100% - 0.4rem);
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 0.2rem;
	}

	.left_contain {
		height: 100%;
		flex: 3;
		min-width: 8rem;
		margin-right: 0.2rem;
	}

	.right_contain {
		// height: 100%;
		flex: 1;
		border-radius: 0.05rem;
		background: #fff;
		overflow-y: auto;
		overflow-x: hidden;
		min-width: 320px;
	}

	.chartsTitle {
		padding: 0.2rem 0.2rem 0 0.2rem;
		font-size: 0.18rem;
		color: #4fb8dd;
	}

	// .chartsTable {
	//   margin-top: -0.36rem;
	// }
	.tableSquare {
		width: 0.09rem;
		height: 0.09rem;
		border-radius: 50%;
		margin: 0 auto;
	}

	div.search_contain {
		/* width: 1180rem; */
		/* height: 78rem; */
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		/* justify-content: space-between; */
		border-top-left-radius: 0.05rem;
		border-top-right-radius: 0.05rem;
		background: #fff;
		padding: 0.2rem 0.2rem;
	}

	.labelTitle {
		color: #999;
		font-size: 0.14rem;
	}

	.importButton2 {
		background: #43b3db;
		color: #fff;
		border-radius: 0.05rem;
		cursor: pointer;
		padding: 0rem 0.35rem;
	}

	.searchButton {
		background: #ffb980;
		color: #fff;
		border-radius: 0.05rem;
		cursor: pointer;
		padding: 0rem 0.35rem;
		// margin-left: 0.2rem
	}

	.deleteButton {
		background: #ed878e;
		color: #fff;
		border-radius: 0.05rem;
		cursor: pointer;
		padding: 0rem 0.35rem;
	}

	.addInvioceButton {
		background: #7dc36d;
		color: #fff;
		border-radius: 0.05rem;
		cursor: pointer;
		padding: 0rem 0.35rem;
	}

	.invoice_oListModule {
		/* width: 1180rem; */
	}

	.cardBox {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: flex-start;
		margin-bottom: 0.2rem;
	}

	.eachCard {
		width: 24.25%;
		height: 2.7rem;
		border-radius: 0.05rem;
		margin-top: 0.2rem;
		background: #fff;
		margin-right: 1%;
		position: relative;
		// overflow-y: hidden;
	}

	.eachCard:nth-child(4n) {
		margin-right: 0;
	}

	.topContent {
		height: 0.9rem;
	}

	.color1 {
		background: #43b3db;
	}

	.color2 {
		background: #7dc36d;
	}

	.color3 {
		background: #ffac69;
	}

	.color4 {
		background: #ed878e;
	}

	.color5 {
		background: #e6a08a;
	}

	.color6 {
		background: #d19ae9;
	}

	.color7 {
		background: #7baddc;
	}

	.color8 {
		background: #8fc879;
	}

	.color9 {
		background: #8e8ec5;
	}

	.color10 {
		background: #ec6969;
	}

	.color11 {
		background: #f39f72;
	}

	.hjColor {
		background: #ffb980;
	}

	.line {
		height: 2px;
		width: 100%;
		background-color: #e5e5e5;
	}

	.line1 {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.15rem 0.2rem;
	}

	.line1 p {
		color: #fff;
	}

	.bigTitle {
		font-size: 0.18rem;
		flex: 0.8;
	}

	.smallTitle {
		font-size: 0.12rem;
		cursor: pointer;
	}

	.line2 {
		display: flex;
		padding: 0rem 0.2rem;
		/* align-items: flex-end; */
		/* justify-content: space-between;*/
	}

	.line2 p {
		font-size: 0.14rem;
		color: #fff;
	}

	.dataContent {
		height: 1.5rem;
		overflow-y: hidden;
		padding: 0.15rem 0.2rem;
		padding-bottom: 0;
	}

	.lineData {
		height: 0.2rem;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.05rem 0;
		color: #666;
		font-size: 0.12rem;
		position: relative;
	}

	.footerContent {
		position: absolute;
		bottom: 0.03rem;
		left: 50%;
		cursor: pointer;
	}

	.addBtn {
		cursor: pointer;
	}

	.nextStep {
		color: #fff;
		background: #43b3db;
		text-align: center;
		border-radius: 0.05rem;
		padding: 0.12rem 0;
		cursor: pointer;
		margin-top: 0.25rem;
	}

	.cancel {
		margin-top: 0.3rem;
		color: #fff;
		background: #ed878e;
		text-align: center;
		border-radius: 0.05rem;
		padding: 0.12rem 0;
		cursor: pointer;
	}

	.dialogTitle {
		position: absolute;
		top: 0.2rem;
	}

	.dialogBigTitle {
		font-size: 0.18rem;
		color: #43b3db;
	}

	.dialogTitleLine2 {
		display: flex;
		align-items: center;
		margin-top: 0.08rem;
	}

	.dialogSmallTitle {
		color: #ed878e;
	}

	.error {
		position: absolute;
		bottom: -0.03rem;
		left: 0;
		line-height: 0rem;
	}

	.error1 {
		bottom: -0.08rem;
	}

	.costumer,
	.invoice,
	.left,
	.right,
	.date {
		display: flex;
		align-items: center;
	}

	.invoice,
	.date {
		justify-content: space-between;
	}

	.costumer,
	.invoice {
		margin-bottom: 0.15rem;
	}

	.costumer .label,
	.costumer .pages,
	.invoice .left .label,
	.invoice .right .label,
	.date .left .label,
	.date .right .label,
	.taxRate .valueBox .label {
		color: #999;
	}

	.costumer .value {
		color: black;
	}

	.costumer .pages {
		margin-left: 0.25rem;
	}

	.invoice .left .pages {
		color: #57bbdf;
		margin-left: 0.1rem;
	}

	.date {
		padding-bottom: 0.2rem;
		border-bottom: 0.02rem solid #e5e5e5;
	}

	.taxRate {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 0.2rem;
	}

	.taxRate .valueBox {
		display: flex;
		align-items: center;
		width: 50%;
		padding: 0 0 0.15rem 0;
	}

	.content {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		justify-content: space-between;
		margin-top: 0.14rem;
	}

	.content .valueBox {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 47%;
		padding: 0.07rem 0;
		position: relative;
	}

	.content .valueBox:nth-child(2n) {
		margin-right: 0;
	}

	.content .valueBox .label,
	.content .valueBox .value {
		font-size: 0.12rem;
	}
	
	.content .valueBox1 {
		width: 47%;
		padding: 0.07rem 0;
		margin-right: 50%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
	
	
	.content .valueBox1 .label,
	.content .valueBox1 .value {
		font-size: 0.12rem;
	}

	.detailFooter {
		display: flex;
		align-items: center;
		justify-content: space-around;
	}

	.detailFooter .nextStep {
		width: 1.8rem;
		margin-top: 0.3rem;
	}

	.detailFooter .cancel {
		width: 1.8rem;
	}

	.noData {
		text-align: center;
		margin-top: 20%;
		color: #909399;
		font-size: 0.14rem;
	}

	.refreshButton {
		background: #43b3db;
		color: #fff;
		border-radius: 0.05rem;
		cursor: pointer;
		padding: 0.07rem 0.35rem;
		position: absolute;
		bottom: 0.5rem;
		width: calc(100% - 1.5rem);
		text-align: center;
		margin-left: 0.2rem;
	}

	.importButton {
		background: #ffb980;
		color: #fff;
		border-radius: 0.05rem;
		cursor: pointer;
		padding: 0.07rem 0.35rem;
		margin-left: 0.2rem;
		position: absolute;
		bottom: 0rem;
		width: calc(100% - 1.5rem);
		text-align: center;
	}

	.deleteButton {
		background: #ed878e;
		color: #fff;
		border-radius: 0.05rem;
		cursor: pointer;
		padding: 0rem 0.35rem;
	}

	.tophj .comName {
		font-size: 0.14rem;
		color: #fff;
		margin-left: 0.2rem;
		padding-top: 0.14rem;
	}

	.tophj .dateName {
		font-size: 0.12rem;
		color: #fff;
		margin-left: 0.2rem;
		margin-top: 0rem;
	}

	.tophj .title {
		font-size: 0.16rem;
		color: #fff;
		margin-top: 0.06rem;
		margin-left: 0.2rem;
	}

	.topData {
		position: relative;
	}

	.topData .number {
		font-size: 0.18rem;
		text-align: center;
		color: #43b3db;
	}

	.circle {
		position: absolute;
		width: 0.2rem;
		height: 0.2rem;
		right: 0.04rem;
		top: 0.04rem;
		cursor: pointer;
	}

	/deep/ .el-popover {
		.label {
			text-align: left;
			display: block;
		}

		/deep/ .el-input {
			width: .9rem;
			float: right;
			font-size: .12rem;
		}

	}
</style>
