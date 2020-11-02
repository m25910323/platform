<template>
	<div class="showReport">
		<div class='search'>
			<!-- <div class="title">报表查看</div> -->
			<div class='search_contain'>
				<el-form :inline="true" :model="searchList" class="demo-form-inline" size="mini" :rules="rulesSearch" ref='formSearch'>
					<el-form-item label="公司:" prop="value">
						<el-select v-model="searchList.value" @change="selectGet" placeholder="请选择" filterable>
							<el-option v-for="item in $store.state.cust" :key="item.customerId" :label="item.customerName" :value="item.customerId">
							</el-option>
							<!-- <el-option v-for="item in searchList.options" :key="item.customerId" :label="item.customerName" :value="item.customerId">
                        </el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="账期:" prop="nowDate">
						<el-date-picker v-model="searchList.nowDate" type="month" placeholder="选择账期" clearable value-format='yyyy-MM'>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="报表类型:" v-if="userobj.reportTaxType==233">
						<el-select v-model="searchList.statusVaule" placeholder="请选择">
							<el-option label="一般纳税人主表" value="一般纳税人主表"></el-option>
							<el-option label="一般纳税人附表一" value="一般纳税人附表一"></el-option>
							<el-option label="一般纳税人附表二" value="一般纳税人附表二"></el-option>
							<el-option label="一般纳税人附表三" value="一般纳税人附表三"></el-option>
							<el-option label="一般纳税人附表四" value="一般纳税人附表四"></el-option>
							<el-option label="增值税减免税申报明细表" value="增值税减免税申报明细表"></el-option>
							<el-option label="城市维护建设税、教育费附加、地方教育附加申报表" value="城市维护建设税、教育费附加、地方教育附加申报表"></el-option>
							<el-option label="印花税申报表" value="印花税申报表"></el-option>
							<el-option label="文建税申报表" value="文建税申报表"></el-option>
							
						</el-select>
					</el-form-item>
					<el-form-item label="报表类型:" v-if="userobj.reportTaxType==232">
						<el-select v-model="searchList.statusVaule" placeholder="请选择">
							<el-option label="小规模纳税人主表" value="小规模纳税人主表"></el-option>
							<el-option label="小规模纳税人附列资料" value="小规模纳税人附列资料"></el-option>
							<el-option label="增值税减免税申报明细表" value="增值税减免税申报明细表"></el-option>
							<el-option label="城市维护建设税、教育费附加、地方教育附加申报表" value="城市维护建设税、教育费附加、地方教育附加申报表"></el-option>
							<el-option label="印花税申报表" value="印花税申报表"></el-option>
							<el-option label="文建税申报表" value="文建税申报表"></el-option>
							
						</el-select>
					</el-form-item>
					<el-form-item style="margin-bottom:0">
						<el-button type="primary" @click="search('formSearch')" style="margin-left:20px" size="mini">查询</el-button>
					</el-form-item>
					<el-form-item style="margin-bottom:0">
						<el-button @click="outputFile('formSearch')" size="mini">一键导出</el-button>

					</el-form-item>
					<el-form-item style="margin-bottom:0">
						<el-button @click="downLoad('formSearch')" size="mini">下载报表模板</el-button>

					</el-form-item>

				</el-form>
			</div>
		</div>
		<div class="titleBox" v-if="showFlag&&statusVaule=='一般纳税人主表'">
			<div class="title">
				<p class="line1">增 值 税 纳 税 申 报 表</p>
				<p class="line2">（一般纳税人适用）</p>
				<p class="line3">根据国家税收法律法规及增值税相关规定制定本表。纳税人不论有无销售额，均应按税务机关核定的纳税期限填写本表，并向当地税务机关申报。</p>
			</div>
			<div class="Infobox">
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small">
					<div class="line1">
						<el-form-item label="税款所属时间：" class="leftWidth3">
							<el-date-picker style="width:280px" v-model="uploadData.shuikuanDate" type="daterange" range-separator="至" format="yyyy-MM-dd " value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"> clearable>
							</el-date-picker>
						</el-form-item>
						<el-form-item class="tianbiaoDate" label="填表日期：" style="margin-left: -2.5rem;">
							<el-date-picker v-model="uploadData.tianbiaoDate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" placeholder="选择日期" clearable>
							</el-date-picker>
						</el-form-item>
						<el-form-item label="金额单位：">
							<p>元至角分</p>
						</el-form-item>
					</div>
					<div class="line2">
						<el-form-item label="纳税人识别号：" class="leftWidth3">
							<el-input v-model="uploadData.taxerNumber"></el-input>
						</el-form-item>
						<el-form-item label="所属行业：">
							<el-input v-model="uploadData.trade"></el-input>
						</el-form-item>
					</div>
					<div class="line3">
						<el-form-item label="纳税人名称：" class="leftWidth3">
							<div class="inlineInput input1">
								<el-input v-model="uploadData.taxerName"></el-input>
								<span style="width:1.6rem">（公章）</span>
							</div>
						</el-form-item>
						<el-form-item label="法定代表人姓名：" style="margin-left: -1.3rem;">
							<div class="input2">
								<el-input v-model="uploadData.legalName"></el-input>
							</div>
						</el-form-item>
						<el-form-item label="注册地址：">
							<div class="input3">
								<el-input v-model="uploadData.registerAddress"></el-input>
							</div>
						</el-form-item>
						<el-form-item label="生产经营地址：">
							<div class="input4">
								<el-input v-model="uploadData.runAddress"></el-input>
							</div>
						</el-form-item>
					</div>
					<div class="line4">
						<el-form-item label="开户银行及账号：" class="leftWidth3">
							<el-input v-model="uploadData.bank"></el-input>
						</el-form-item>
						<el-form-item label="登记注册类型：">
							<el-input v-model="uploadData.registerType"></el-input>
						</el-form-item>
						<el-form-item label="电话号码：">
							<el-input v-model="uploadData.phone"></el-input>
						</el-form-item>
					</div>
				</el-form>
			</div>
		</div>
		<div class="titleBox" v-if="showFlag">
			<div class="title" v-if="statusVaule=='一般纳税人附表一'">
				<p class="line1">增值税纳税申报表附列资料（一）</p>
				<p class="line2">（本期销售情况明细）</p>
			</div>
			<div class="title" v-if="statusVaule=='一般纳税人附表二'">
				<p class="line1">增值税纳税申报表附列资料（二）</p>
				<p class="line2">（本期进项税额明细）</p>
			</div>
			<div class="title" v-if="statusVaule=='一般纳税人附表三'">
				<p class="line1">增值税纳税申报表附列资料（三）</p>
				<p class="line2">（服务、不动产和无形资产扣除项目明细）</p>
			</div>
			<div class="title" v-if="statusVaule=='一般纳税人附表四'">
				<p class="line1">增值税纳税申报表附列资料（四）</p>
				<p class="line2">（税额抵减情况表）</p>
			</div>
			<div class="title" v-if="statusVaule=='印花税申报表'">
				<p class="line1">印花税纳税申报（报告）表</p>
			</div>
			<div class="title" v-if="statusVaule=='文建税申报表'">
				<p class="line1">文化事业建设费申报表</p>
			</div>
			<div class="title" v-if="statusVaule=='增值税减免税申报明细表'">
				<p class="line1">增值税减免税申报明细表</p>
			</div>
			<div class="title" v-if="statusVaule=='小规模纳税人主表'">
				<p class="line1">增值税纳税申报表</p>
				<p class="line2">（小规模纳税人适用）</p>
			</div>
			<div class="title" v-if="statusVaule=='城市维护建设税、教育费附加、地方教育附加申报表'">
				<p class="line1">城市维护建设税、教育费附加、地方教育附加申报表</p>
			</div>
			<div class="title" v-if="statusVaule=='小规模纳税人附列资料'">
				<p class="line1">增值税纳税申报表（小规模纳税人适用）附列资料</p>
			</div>
			
			<div class="Infobox" v-if="statusVaule=='一般纳税人附表一'||statusVaule=='一般纳税人附表二'||statusVaule=='一般纳税人附表三'||statusVaule=='一般纳税人附表四'">
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small">
					<div class="line1">
						<el-form-item label="税款所属时间：" class="leftWidth">
							<el-date-picker style="width:280px" v-model="uploadData.shuikuanDate" type="daterange" range-separator="至" format="yyyy-MM-dd " value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"> clearable>
							</el-date-picker>
						</el-form-item>
					</div>
					<div class="line3">
						<el-form-item label="纳税人名称：" class="leftWidth">
							<div class="inlineInput">
								<el-input v-model="uploadData.taxerName"></el-input>
								<span style="width:1.6rem">（公章）</span>
							</div>
						</el-form-item>
						<el-form-item label="金额单位：">
							<p>元至角分</p>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<div class="Infobox" v-if="statusVaule=='城市维护建设税、教育费附加、地方教育附加申报表'">
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small">
					<div class="line1">
						<el-form-item label="税款所属期限：" class="leftWidth2">
							<el-date-picker style="width:280px" v-model="uploadData.shuikuanDate" type="daterange" range-separator="至" format="yyyy-MM-dd " value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"> clearable>
							</el-date-picker>
						</el-form-item>
					</div>
					<div class="line2">
						<el-form-item label="纳税人识别号（统一社会信用代码）：" class="leftWidth2">
							<el-input v-model="uploadData.taxerNumber"></el-input>
						</el-form-item>
					</div>
					<div class="line3">
						<el-form-item label="纳税人名称：" class="leftWidth2">
							<div class="inlineInput">
								<el-input v-model="uploadData.taxerName"></el-input>
								<span style="width:1.6rem">（公章）</span>
							</div>
						</el-form-item>
						<el-form-item label="金额单位：">
							<p>元至角分</p>
						</el-form-item>
					</div>
					<div class="line4" style="height:auto">
						<div class="leftBox">
							<div class="left">
								<p>本期是否适用增值税小规模纳税人减征政策</p>
								<p>(减免性质代码_城市维护建设税:07049901,</p>
								<p>减免性质代码_教育费附加:61049901,减免性质代码_地方教育附加:99049901)</p>
							</div>
							<div class="right">
								<p contenteditable @blur="blurTop('isReduce',$event)">{{uploadData.isReduce}}</p>
							</div>
						</div>
						<div class="rightBox">
							<div class="left">
								<p>减征比例_城市维护建设税（%）</p>
								<p>减征比例_教育费附加（%）</p>
								<p>减征比例_地方教育附加（%）</p>
							</div>
							<div class="right" style="line-height:0.18rem">
								<p contenteditable @blur="blurTop('chengshiRate',$event)">{{uploadData.chengshiRate}}</p>
								<p contenteditable @blur="blurTop('jiaoyuRate',$event)">{{uploadData.jiaoyuRate}}</p>
								<p contenteditable @blur="blurTop('difangRate',$event)">{{uploadData.difangRate}}</p>
							</div>
						</div>
					</div>
				</el-form>
			</div>
			<div class="Infobox" v-if="statusVaule=='小规模纳税人主表'">
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small">
					<div class="line1">
						<el-form-item label="纳税人识别号：" class="leftWidth">
							<el-input v-model="uploadData.taxerNumber"></el-input>
						</el-form-item>
					</div>
					<div class="line2">
						<el-form-item label="纳税人名称：" class="leftWidth">
							<div class="inlineInput">
								<el-input v-model="uploadData.taxerName"></el-input>
								<span style="width:1.6rem">（公章）</span>
							</div>
						</el-form-item>
						<el-form-item label="金额单位：">
							<p>元至角分</p>
						</el-form-item>
					</div>
					<div class="line3">
						<el-form-item label="税款所属时间：" class="leftWidth">
							<el-date-picker style="width:280px" v-model="uploadData.shuikuanDate" type="daterange" range-separator="至" format="yyyy-MM-dd" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"> clearable>
							</el-date-picker>
						</el-form-item>
						<el-form-item class="tianbiaoDate" label="填表日期：">
							<el-date-picker v-model="uploadData.tianbiaoDate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" placeholder="选择日期" clearable>
							</el-date-picker>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<div class="InfoBox4" v-if="statusVaule=='小规模纳税人附列资料'">
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small">
					<div class="Infobox4line1">
						<el-form-item label="税款所属期限：" class="leftWidth">
							<el-date-picker style="width:280px" v-model="uploadData.shuikuanDate" type="daterange" range-separator="至" format="yyyy-MM-dd " value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"> clearable>
							</el-date-picker>
						</el-form-item>
						<el-form-item class="tianbiaoDate" label="填表日期：">
							<el-date-picker v-model="uploadData.tianbiaoDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日期" clearable>
							</el-date-picker>
						</el-form-item>
					</div>
					<div class="Infobox4line2">
						<el-form-item label="纳税人名称：" class="leftWidth">
							<div class="inlineInput">
								<el-input v-model="uploadData.taxerName"></el-input>
								<span style="width:1.6rem">（公章）</span>
							</div>
						</el-form-item>
					</div>
				</el-form>
			</div>
			<div class="Infobox" v-if="statusVaule=='文建税申报表'">
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small">
					<div class="line1">
						<el-form-item label="税款所属期限：" class="leftWidth2">
							<el-date-picker style="width:280px" v-model="uploadData.shuikuanDate" type="daterange" range-separator="至" format="yyyy-MM-dd " value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"> clearable>
							</el-date-picker>
						</el-form-item>
					</div>
					<div class="line2">
						<el-form-item label="纳税人识别号（统一社会信用代码）：" class="leftWidth2">
							<el-input v-model="uploadData.taxerNumber"></el-input>
						</el-form-item>
					</div>
					<div class="line3">
						<el-form-item label="纳税人名称：" class="leftWidth2">
							<div class="inlineInput">
								<el-input v-model="uploadData.taxerName"></el-input>
								<span style="width:1.6rem">（公章）</span>
							</div>
						</el-form-item>
						<el-form-item label="金额单位：">
							<p>元至角分</p>
						</el-form-item>
					</div>
					<div class="line2">
						<el-form-item label="减征比例：" class="leftWidth2">
							<el-input v-model="thisData.jzbl.columnValue" @change="setcolumnValue"></el-input>
						</el-form-item>
					</div>
					
				</el-form>
			</div>
			
			<div class="Infobox" v-if="statusVaule=='印花税申报表'">
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small">
					<div class="line1">
						<el-form-item label="税款所属期限：" class="leftWidth2">
							<el-date-picker style="width:280px" v-model="uploadData.shuikuanDate" type="daterange" range-separator="至" format="yyyy-MM-dd " value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"> clearable>
							</el-date-picker>
						</el-form-item>
					</div>
					<div class="line2">
						<el-form-item label="纳税人识别号（统一社会信用代码）：" class="leftWidth2">
							<el-input v-model="uploadData.taxerNumber"></el-input>
						</el-form-item>
					</div>
					<div class="line3">
						<el-form-item label="纳税人名称：" class="leftWidth2">
							<div class="inlineInput">
								<el-input v-model="uploadData.taxerName"></el-input>
								<span style="width:1.6rem">（公章）</span>
							</div>
						</el-form-item>
						<el-form-item label="金额单位：">
							<p>元至角分</p>
						</el-form-item>
					</div>
					<div class="line4" style="height:auto">
						<div class="leftBox">
							<div class="left">
								<p>本期是否适用增值税小规模纳税人减征政策</p>
								<p>(减免性质代码:09049901)</p>
							</div>
							<div class="right">
								<p contenteditable='false'>是</p>
							</div>
						</div>
						<div class="rightBox">
							<div class="left">
								<p>减征比例（%）</p>
							</div>
							<div class="right" style="line-height:0.18rem">
								<p>50</p>
								<!-- <p contenteditable @blur="blurTop('chengshiRate',$event)">{{uploadData.chengshiRate}}</p>
								<p contenteditable @blur="blurTop('jiaoyuRate',$event)">{{uploadData.jiaoyuRate}}</p>
								<p contenteditable @blur="blurTop('difangRate',$event)">{{uploadData.difangRate}}</p> -->
							</div>
						</div>
					</div>
					<!-- <div class="line4">
						<el-form-item label="本期是否适用增值税小规模纳税人减征政策(减免性质代码：09049901)" class="leftWidth2">
							<el-input value="是" disabled></el-input>
						</el-form-item>
					</div>
					<div class="line4">
						<el-form-item label="减征比例(%) " class="leftWidth2">
							<el-input value="50%" disabled></el-input>
						</el-form-item>
					</div> -->
				</el-form>
			</div>
			
			<div class="Infobox" v-if="statusVaule=='增值税减免税申报明细表'">
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="small">
					<div class="line1">
						<el-form-item label="税款所属期限：" class="leftWidth2">
							<el-date-picker style="width:280px" v-model="uploadData.shuikuanDate" type="daterange" range-separator="至" format="yyyy-MM-dd " value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期"> clearable>
							</el-date-picker>
						</el-form-item>
					</div>
					<div class="line2">
						<el-form-item label="纳税人识别号（统一社会信用代码）：" class="leftWidth2">
							<el-input v-model="uploadData.taxerNumber"></el-input>
						</el-form-item>
					</div>
					<div class="line3">
						<el-form-item label="纳税人名称：" class="leftWidth2">
							<div class="inlineInput">
								<el-input v-model="uploadData.taxerName"></el-input>
								<span style="width:1.6rem">（公章）</span>
							</div>
						</el-form-item>
						<el-form-item label="金额单位：">
							<p>元至角分</p>
						</el-form-item>
					</div>
					
				</el-form>
			</div>
		</div>
		<div class="content" v-if="showFlag">
			<!-- <el-button type="primary" icon="el-icon-success" size="small" @click='exportExcel'>一键导出</el-button> -->
			<div class="tableBox" v-show="statusVaule=='一般纳税人主表'">
				<table border="1 " width="100% " v-if="thisData.ajynsjcybjseybby" id="table1">
					<tr>
						<td rowspan="2" colspan="2" class="center">项目</td>
						<td rowspan="2" class="center" style="width:1.4rem">栏次</td>
						<td colspan="2" class="pad3 center">一般项目</td>
						<td colspan="2" class="center">即征即退项目</td>
					</tr>
					<tr>
						<td class="pad3 center">本月数</td>
						<td class="pad3 center">本年累计</td>
						<td class="pad3 center">本月数</td>
						<td class="pad3 center">本年累计</td>
					</tr>
					<tr>
						<td rowspan="10" class="shuli">销售额</td>
						<td class="pad3">（一）按适用税率计税销售额</td>
						<td class="pad3 center">1</td>
						<td class="pad3 center" :contenteditable="thisData.asysljsxseybby.columnEdit==1" @blur="unfocus('table1','yb','by','asysljsxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','by','asysljsxse',$event)})" v-text="thisData.asysljsxseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.asysljsxseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','asysljsxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','asysljsxse',$event)})" v-text="thisData.asysljsxseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.asysljsxsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','asysljsxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','by','asysljsxse',$event)})" v-text="thisData.asysljsxsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.asysljsxsejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','asysljsxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','asysljsxse',$event)})" v-text="thisData.asysljsxsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">其中：应税货物销售额</td>
						<td class="pad3 center">2</td>
						<td class="pad3 center" :contenteditable="thisData.yshwxseybby.columnEdit==1" @blur="unfocus('table1','yb','by','yshwxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','by','yshwxse',$event)})" v-text="thisData.yshwxseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.yshwxseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','yshwxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','yshwxse',$event)})" v-text="thisData.yshwxseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.yshwxsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','yshwxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','by','yshwxse',$event)})" v-text="thisData.yshwxsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.yshwxsejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','yshwxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','yshwxse',$event)})" v-text="thisData.yshwxsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3 padL">应税劳务销售额</td>
						<td class="pad3 center">3</td>
						<td class="pad3 center" :contenteditable="thisData.yslwxseybby.columnEdit==1" @blur="unfocus('table1','yb','by','yslwxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','by','yslwxse',$event)})" v-text="thisData.yslwxseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.yslwxseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','yslwxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','yslwxse',$event)})" v-text="thisData.yslwxseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.yslwxsejzby.columnEdit==1" @blur="unfocus('table1','jz','yb','yslwxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','yb','yslwxse',$event)})" v-text="thisData.yslwxsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.yslwxsejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','yslwxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','yslwxse',$event)})" v-text="thisData.yslwxsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3 padL">纳税检查调整的销售额</td>
						<td class="pad3 center">4</td>
						<td class="pad3 center" :contenteditable="thisData.nsjcdzxseybby.columnEdit==1" @blur="unfocus('table1','yb','by','nsjcdzxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','by','nsjcdzxse',$event)})" v-text="thisData.nsjcdzxseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.nsjcdzxseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','nsjcdzxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','nsjcdzxse',$event)})" v-text="thisData.nsjcdzxseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.nsjcdzxsejzby.columnEdit==1" @blur="unfocus('table1','jz','yb','nsjcdzxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','yb','nsjcdzxse',$event)})" v-text="thisData.nsjcdzxsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.nsjcdzxsejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','nsjcdzxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','nsjcdzxse',$event)})" v-text="thisData.nsjcdzxsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">（二）按简易办法计税销售额</td>
						<td class="pad3 center">5</td>
						<td class="pad3 center" :contenteditable="thisData.ajyfsjsxseybby.columnEdit==1" @blur="unfocus('table1','yb','by','ajyfsjsxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','by','ajyfsjsxse',$event)})" v-text="thisData.ajyfsjsxseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.ajyfsjsxseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','ajyfsjsxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','ajyfsjsxse',$event)})" v-text="thisData.ajyfsjsxseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.ajyfsjsxsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','ajyfsjsxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','by','ajyfsjsxse',$event)})" v-text="thisData.ajyfsjsxsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.ajyfsjsxsejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','ajyfsjsxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','ajyfsjsxse',$event)})" v-text="thisData.ajyfsjsxsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">其中：纳税检查调整的销售额</td>
						<td class="pad3 center">6</td>
						<td class="pad3 center" :contenteditable="thisData.nsjctzxseybby.columnEdit==1" @blur="unfocus('table1','yb','by','nsjctzxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','by','nsjctzxse',$event)})" v-text="thisData.nsjctzxseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.nsjctzxseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','nsjctzxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','nsjctzxse',$event)})" v-text="thisData.nsjctzxseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.nsjctzxsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','nsjctzxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','by','nsjctzxse',$event)})" v-text="thisData.nsjctzxsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.nsjctzxsejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','nsjctzxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','nsjctzxse',$event)})" v-text="thisData.nsjctzxsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">（三）免、抵、退办法出口销售额</td>
						<td class="pad3 center">7</td>
						<td class="pad3 center" :contenteditable="thisData.mdtbfckxseybby.columnEdit==1" @blur="unfocus('table1','yb','by','mdtbfckxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','by','mdtbfckxse',$event)})" v-text="thisData.mdtbfckxseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.mdtbfckxseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','mdtbfckxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','mdtbfckxse',$event)})" v-text="thisData.mdtbfckxseybbnlj.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3">（四）免税销售额</td>
						<td class="pad3 center">8</td>
						<td class="pad3 center" :contenteditable="thisData.msxseybby.columnEdit==1" @blur="unfocus('table1','yb','by','msxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','by','msxse',$event)})" v-text="thisData.msxseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.msxseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','msxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','msxse',$event)})" v-text="thisData.msxseybbnlj.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3">其中：免税货物销售额</td>
						<td class="pad3 center">9</td>
						<td class="pad3 center" :contenteditable="thisData.mshwxseybby.columnEdit==1" @blur="unfocus('table1','yb','by','mshwxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','by','mshwxse',$event)})" v-text="thisData.mshwxseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.mshwxseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','mshwxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','mshwxse',$event)})" v-text="thisData.mshwxseybbnlj.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3 padL">免税劳务销售额</td>
						<td class="pad3 center">10</td>
						<td class="pad3 center" :contenteditable="thisData.mslwxseybby.columnEdit==1" @blur="unfocus('table1','yb','by','mslwxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','by','mslwxse',$event)})" v-text="thisData.mslwxseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.mslwxseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','mslwxse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','mslwxse',$event)})" v-text="thisData.mslwxseybbnlj.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td rowspan="14" class="shuli">税款计算</td>
						<td class="pad3">销项税额</td>
						<td class="pad3 center">11</td>
						<td class="pad3 center" :contenteditable="thisData.xxseybby.columnEdit==1" @blur="unfocus('table1','yb','by','xxse',$event,'sjdkse')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','xxse',$event,'sjdkse')})" v-text="thisData.xxseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.xxseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','xxse',$event,'sjdkse')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','xxse',$event,'sjdkse')})" v-text="thisData.xxseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.xxsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','xxse',$event,'sjdkse')" @keydown.enter="(($event)=>{unfocus('table1','jz','by','xxse',$event,'sjdkse')})" v-text="thisData.xxsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.xxsejzbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','xxse',$event,'sjdkse')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','xxse',$event,'sjdkse')})" v-text="thisData.xxsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">进项税额</td>
						<td class="pad3 center">12</td>
						<td class="pad3 center" :contenteditable="thisData.jxseybby.columnEdit==1" @blur="unfocus('table1','yb','by','jxse',$event,'ydksehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','jxse',$event,'ydksehj')})" v-text="thisData.jxseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.jxseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','jxse',$event,'ydksehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','jxse',$event,'ydksehj')})" v-text="thisData.jxseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.jxsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','jxse',$event,'ydksehj')" @keydown.enter="(($event)=>{unfocus('table1','jz','by','jxse',$event,'ydksehj')})" v-text="thisData.jxsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.jxsejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','jxse',$event,'ydksehj')" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','jxse',$event,'ydksehj')})" v-text="thisData.jxsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">上期留抵税额</td>
						<td class="pad3 center">13</td>
						<td class="pad3 center" :contenteditable="thisData.sqldseybby.columnEdit==1" @blur="unfocus('table1','yb','by','sqldse',$event,'ydksehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','sqldse',$event,'ydksehj')})" v-text="thisData.sqldseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.sqldseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','sqldse',$event,'ydksehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','sqldse',$event,'ydksehj')})" v-text="thisData.sqldseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.sqldsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','sqldse',$event,'ydksehj')" @keydown.enter="(($event)=>{unfocus('table1','jz','by','sqldse',$event,'ydksehj')})" v-text="thisData.sqldsejzby.columnValue"></td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3">进项税额转出</td>
						<td class="pad3 center">14</td>
						<td class="pad3 center" :contenteditable="thisData.jxsezcybby.columnEdit==1" @blur="unfocus('table1','yb','by','jxsezc',$event,'ydksehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','jxsezc',$event,'ydksehj')})" v-text="thisData.jxsezcybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.jxsezcybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','jxsezc',$event,'ydksehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','jxsezc',$event,'ydksehj')})" v-text="thisData.jxsezcybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.jxsezcjzby.columnEdit==1" @blur="unfocus('table1','jz','by','jxsezc',$event,'ydksehj')" @keydown.enter="(($event)=>{unfocus('table1','jz','by','jxsezc',$event,'ydksehj')})" v-text="thisData.jxsezcjzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.jxsezcjzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','jxsezc',$event,'ydksehj')" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','jxsezc',$event,'ydksehj')})" v-text="thisData.jxsezcjzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">免、抵、退应退税额</td>
						<td class="pad3 center">15</td>
						<td class="pad3 center" :contenteditable="thisData.mdtytseybby.columnEdit==1" @blur="unfocus('table1','yb','by','mdtytse',$event,'ydksehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','mdtytse',$event,'ydksehj')})" v-text="thisData.mdtytseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.mdtytseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','mdtytse',$event,'ydksehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','mdtytse',$event,'ydksehj')})" v-text="thisData.mdtytseybbnlj.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3">按适用税率计算的纳税检查应补缴税额</td>
						<td class="pad3 center">16</td>
						<td class="pad3 center" :contenteditable="thisData.asysljsnsjcybjseybby.columnEdit==1" @blur="unfocus('table1','yb','by','asysljsnsjcybjse',$event,'ydksehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','asysljsnsjcybjse',$event,'ydksehj')})" v-text="thisData.asysljsnsjcybjseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.asysljsnsjcybjseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','asysljsnsjcybjse',$event,'ydksehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','asysljsnsjcybjse',$event,'ydksehj')})" v-text="thisData.asysljsnsjcybjseybbnlj.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3">应抵扣税额合计</td>
						<td class="pad3 center">17=12+13-14-15+16</td>
						<td class="pad3 center" :contenteditable="thisData.ydksehjybby.columnEdit==1" @blur="unfocus('table1','yb','by','ydksehj',$event,'sjdkse')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','ydksehj',$event,'sjdkse')})" v-text="thisData.ydksehjybby.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center" :contenteditable="thisData.ydksehjjzby.columnEdit==1" @blur="unfocus('table1','yb','lj','ydksehj',$event,'sjdkse')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','ydksehj',$event,'sjdkse')})" v-text="thisData.ydksehjjzby.columnValue"></td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3">实际抵扣税额</td>
						<td class="pad3 center">18（如17
							<11，则为17，否则为11）</td>
								<td class="pad3 center" :contenteditable="thisData.sjdkseybby.columnEdit==1" @blur="unfocus('table1','yb','by','sjdkse',$event,'sjdkse')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','sjdkse',$event,'sjdkse')})" v-text="thisData.sjdkseybby.columnValue"></td>
								<td class="pad3 center" :contenteditable="thisData.sjdkseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','sjdkse',$event,'sjdkse')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','sjdkse',$event,'sjdkse')})" v-text="thisData.sjdkseybbnlj.columnValue"></td>
								<td class="pad3 center" :contenteditable="thisData.sjdksejzby.columnEdit==1" @blur="unfocus('table1','jz','by','sjdkse',$event,'sjdkse')" @keydown.enter="(($event)=>{unfocus('table1','jz','by','sjdkse',$event,'sjdkse')})" v-text="thisData.sjdksejzby.columnValue"></td>
								<td class="pad3 center" :contenteditable="thisData.sjdksejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','sjdkse',$event,'sjdkse')" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','sjdkse',$event,'sjdkse')})" v-text="thisData.sjdksejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">应纳税额</td>
						<td class="pad3 center">19=if(（11-18）>0,(11-18-附表4G16),(11-18))</td>
						<td class="pad3 center" :contenteditable="thisData.ynseybby.columnEdit==1" @blur="unfocus('table1','yb','by','ynse',$event,'ynsehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','ynse',$event,'ynsehj')})" v-text="thisData.ynseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.ynseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','ynse',$event,'ynsehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','ynse',$event,'ynsehj')})" v-text="thisData.ynseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.ynsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','ynse',$event,'ynsehj')" @keydown.enter="(($event)=>{unfocus('table1','jz','by','ynse',$event,'ynsehj')})" v-text="thisData.ynsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.ynsejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','ynse',$event,'ynsehj')" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','ynse',$event,'ynsehj')})" v-text="thisData.ynsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">期末留抵税额</td>
						<td class="pad3 center">20=17-18</td>
						<td class="pad3 center" :contenteditable="thisData.qmldseybby.columnEdit==1" @blur="unfocus('table1','yb','by','qmldse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','by','qmldse',$event)})" v-text="thisData.qmldseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.qmldseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','qmldse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','qmldse',$event)})" v-text="thisData.qmldseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.qmldsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','qmldse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','by','qmldse',$event)})" v-text="thisData.qmldsejzby.columnValue"></td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3">简易计税办法计算的应纳税额</td>
						<td class="pad3 center">21</td>
						<td class="pad3 center" :contenteditable="thisData.jyjsynseybby.columnEdit==1" @blur="unfocus('table1','yb','by','jyjsynse',$event,'ynsehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','jyjsynse',$event,'ynsehj')})" v-text="thisData.jyjsynseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.jyjsynseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','jyjsynse',$event,'ynsehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','jyjsynse',$event,'ynsehj')})" v-text="thisData.jyjsynseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.jyjsynsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','jyjsynse',$event,'ynsehj')" @keydown.enter="(($event)=>{unfocus('table1','jz','by','jyjsynse',$event,'ynsehj')})" v-text="thisData.jyjsynsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.jyjsynsejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','jyjsynse',$event,'ynsehj')" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','jyjsynse',$event,'ynsehj')})" v-text="thisData.jyjsynsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">按简易计税办法计算的纳税检查应补缴税额</td>
						<td class="pad3 center">22</td>
						<td class="pad3 center" :contenteditable="thisData.ajynsjcybjseybby.columnEdit==1" @blur="unfocus('table1','yb','by','ajynsjcybjse',$event,'qmmjcbse')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','ajynsjcybjse',$event,'qmmjcbse')})" v-text="thisData.ajynsjcybjseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.ajynsjcybjseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','ajynsjcybjse',$event,'qmmjcbse')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','ajynsjcybjse',$event,'qmmjcbse')})" v-text="thisData.ajynsjcybjseybbnlj.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3">应纳税额减征额</td>
						<td class="pad3 center">23</td>
						<td class="pad3 center" :contenteditable="thisData.ynsejzeybby.columnEdit==1" @blur="unfocus('table1','yb','by','ynsejze',$event,'ynsehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','ynsejze',$event,'ynsehj')})" v-text="thisData.ynsejzeybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.ynsejzeybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','ynsejze',$event,'ynsehj')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','ynsejze',$event,'ynsehj')})" v-text="thisData.ynsejzeybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.ynsejzejzby.columnEdit==1" @blur="unfocus('table1','jz','by','ynsejze',$event,'ynsehj')" @keydown.enter="(($event)=>{unfocus('table1','jz','by','ynsejze',$event,'ynsehj')})" v-text="thisData.ynsejzejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.ynsejzejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','ynsejze',$event,'ynsehj')" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','ynsejze',$event,'ynsehj')})" v-text="thisData.ynsejzejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">应纳税额合计</td>
						<td class="pad3 center">24=19+21-23</td>
						<td class="pad3 center" :contenteditable="thisData.ynsehjybby.columnEdit==1" @blur="unfocus('table1','yb','by','ynsehj',$event,'qmwjse')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','ynsehj',$event,'qmwjse')})" v-text="thisData.ynsehjybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.ynsehjybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','ynsehj',$event,'qmwjse')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','ynsehj',$event,'qmwjse')})" v-text="thisData.ynsehjybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.ynsehjjzby.columnEdit==1" @blur="unfocus('table1','jz','by','ynsehj',$event,'qmwjse')" @keydown.enter="(($event)=>{unfocus('table1','jz','by','ynsehj',$event,'qmwjse')})" v-text="thisData.ynsehjjzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.ynsehjjzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','ynsehj',$event,'qmwjse')" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','ynsehj',$event,'qmwjse')})" v-text="thisData.ynsehjjzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td rowspan="14" class="shuli">税款缴纳</td>
						<td class="pad3">期初未缴税额（多缴为负数）</td>
						<td class="pad3 center">25</td>
						<td class="pad3 center" :contenteditable="thisData.qcmjseybby.columnEdit==1" @blur="unfocus('table1','yb','by','qcmjse',$event,'qmwjse')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','qcmjse',$event,'qmwjse')})" v-text="thisData.qcmjseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.qcmjseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','qcmjse',$event,'qmwjse')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','qcmjse',$event,'qmwjse')})" v-text="thisData.qcmjseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.qcmjsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','qcmjse',$event,'qmwjse')" @keydown.enter="(($event)=>{unfocus('table1','jz','by','qcmjse',$event,'qmwjse')})" v-text="thisData.qcmjsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.qcmjsejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','qcmjse',$event,'qmwjse')" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','qcmjse',$event,'qmwjse')})" v-text="thisData.qcmjsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">实收出口开具专用缴款书退税额</td>
						<td class="pad3 center">26</td>
						<td class="pad3 center" :contenteditable="thisData.ssckkjzyjkstkeybby.columnEdit==1" @blur="unfocus('table1','yb','by','ssckkjzyjkstke',$event,'qmwjse')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','ssckkjzyjkstke',$event,'qmwjse')})" v-text="thisData.ssckkjzyjkstkeybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.ssckkjzyjkstkeybbnlj.columnEdit==1" @blur="unfocus('table1','yb','by','ssckkjzyjkstke',$event,'qmwjse')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','ssckkjzyjkstke',$event,'qmwjse')})" v-text="thisData.ssckkjzyjkstkeybbnlj.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3">本期已缴税额</td>
						<td class="pad3 center">27=28+29+30+31</td>
						<td class="pad3 center" :contenteditable="thisData.bqyjseybby.columnEdit==1" @blur="unfocus('table1','yb','by','bqyjse',$event,'qmwjse')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','bqyjse',$event,'qmwjse')})" v-text="thisData.bqyjseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.bqyjseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','bqyjse',$event,'qmwjse')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','bqyjse',$event,'qmwjse')})" v-text="thisData.bqyjseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.bqyjsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','bqyjse',$event,'qmwjse')" @keydown.enter="(($event)=>{unfocus('table1','jz','by','bqyjse',$event,'qmwjse')})" v-text="thisData.bqyjsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.bqyjsejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','bqyjse',$event,'qmwjse')" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','bqyjse',$event,'qmwjse')})" v-text="thisData.bqyjsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">①分次预缴税额</td>
						<td class="pad3 center">28</td>
						<td class="pad3 center" :contenteditable="thisData.cyjseybby.columnEdit==1" @blur="unfocus('table1','yb','by','cyjse',$event,'bqyjse')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','cyjse',$event,'bqyjse')})" v-text="thisData.cyjseybby.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center" :contenteditable="thisData.cyjsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','cyjse',$event,'bqyjse')" @keydown.enter="(($event)=>{unfocus('table1','jz','by','cyjse',$event,'bqyjse')})" v-text="thisData.cyjsejzby.columnValue"></td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3">②出口开具专用缴款书预缴税额</td>
						<td class="pad3 center">29</td>
						<td class="pad3 center" :contenteditable="thisData.ckkjzyjksyjseybby.columnEdit==1" @blur="unfocus('table1','yb','by','ckkjzyjksyjse',$event,'bqyjse')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','ckkjzyjksyjse',$event,'bqyjse')})" v-text="thisData.ckkjzyjksyjseybby.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center">——</td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3">③本期缴纳上期应纳税额</td>
						<td class="pad3 center">30</td>
						<td class="pad3 center" :contenteditable="thisData.jqjnsqynseybby.columnEdit==1" @blur="unfocus('table1','yb','by','jqjnsqynse',$event,'bqyjse')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','jqjnsqynse',$event,'bqyjse')})" v-text="thisData.jqjnsqynseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.jqjnsqynseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','jqjnsqynse',$event,'bqyjse')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','jqjnsqynse',$event,'bqyjse')})" v-text="thisData.jqjnsqynseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.jqjnsqynsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','jqjnsqynse',$event,'bqyjse')" @keydown.enter="(($event)=>{unfocus('table1','jz','by','jqjnsqynse',$event,'bqyjse')})" v-text="thisData.jqjnsqynsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.jqjnsqynsejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','jqjnsqynse',$event,'bqyjse')" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','jqjnsqynse',$event,'bqyjse')})" v-text="thisData.jqjnsqynsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">④本期缴纳欠缴税额</td>
						<td class="pad3 center">31</td>
						<td class="pad3 center" :contenteditable="thisData.bqjnqjseybby.columnEdit==1" @blur="unfocus('table1','yb','by','bqjnqjse',$event,'bqyjse')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','bqjnqjse',$event,'bqyjse')})" v-text="thisData.bqjnqjseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.bqjnqjseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','bqjnqjse',$event,'bqyjse')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','bqjnqjse',$event,'bqyjse')})" v-text="thisData.bqjnqjseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.bqjnqjsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','bqjnqjse',$event,'bqyjse')" @keydown.enter="(($event)=>{unfocus('table1','jz','by','bqjnqjse',$event,'bqyjse')})" v-text="thisData.bqjnqjsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.bqjnqjsejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','bqjnqjse',$event,'bqyjse')" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','bqjnqjse',$event,'bqyjse')})" v-text="thisData.bqjnqjsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">期末未缴税额（多缴为负数）</td>
						<td class="pad3 center">32=24+25+26-27</td>
						<td class="pad3 center" :contenteditable="thisData.qmwjseybby.columnEdit==1" @blur="unfocus('table1','yb','by','qmwjse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','by','qmwjse',$event)})" v-text="thisData.qmwjseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.qmwjseybbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','qmwjse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','qmwjse',$event)})" v-text="thisData.qmwjseybbnlj.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.qmwjsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','qmwjse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','by','qmwjse',$event)})" v-text="thisData.qmwjsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.qmwjsejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','qmwjse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','qmwjse',$event)})" v-text="thisData.qmwjsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">其中：欠缴税额（≥0）</td>
						<td class="pad3 center">33=25+26-27</td>
						<td class="pad3 center" :contenteditable="thisData.qzqjseybby.columnEdit==1" @blur="unfocus('table1','yb','by','qzqjse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','by','qzqjse',$event)})" v-text="thisData.qzqjseybby.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center" :contenteditable="thisData.qzqjsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','qzqjse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','by','qzqjse',$event)})" v-text="thisData.qzqjsejzby.columnValue"></td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3">本期应补(退)税额</td>
						<td class="pad3 center">34＝24-28-29</td>
						<td class="pad3 center" :contenteditable="thisData.bqybtseybby.columnEdit==1" @blur="unfocus('table1','yb','by','bqybtse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','by','bqybtse',$event)})" v-text="thisData.bqybtseybby.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center" :contenteditable="thisData.bqybtsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','bqybtse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','by','bqybtse',$event)})" v-text="thisData.bqybtsejzby.columnValue"></td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3">即征即退实际退税额</td>
						<td class="pad3 center">35</td>
						<td class="pad3 center">——</td>
						<td class="pad3 center">——</td>
						<td class="pad3 center" :contenteditable="thisData.jzjtsjtsejzby.columnEdit==1" @blur="unfocus('table1','jz','by','jzjtsjtse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','by','jzjtsjtse',$event)})" v-text="thisData.jzjtsjtsejzby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.jzjtsjtsejzbnlj.columnEdit==1" @blur="unfocus('table1','jz','lj','jzjtsjtse',$event)" @keydown.enter="(($event)=>{unfocus('table1','jz','lj','jzjtsjtse',$event)})" v-text="thisData.jzjtsjtsejzbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="pad3">期初未缴查补税额</td>
						<td class="pad3 center">36</td>
						<td class="pad3 center" :contenteditable="thisData.qcmjcbseybby.columnEdit==1" @blur="unfocus('table1','yb','by','qcmjcbse',$event,'qmmjcbse')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','qcmjcbse',$event,'qmmjcbse')})" v-text="thisData.qcmjcbseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.qcmjcbseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','qcmjcbse',$event,'qmmjcbse')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','qcmjcbse',$event,'qmmjcbse')})" v-text="thisData.qcmjcbseybbnlj.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3">本期入库查补税额</td>
						<td class="pad3 center">37</td>
						<td class="pad3 center" :contenteditable="thisData.bqrkcbseybby.columnEdit==1" @blur="unfocus('table1','yb','by','bqrkcbse',$event,'qmmjcbse')" @keydown.enter="(($event)=>{unfocus('table1','yb','by','bqrkcbse',$event,'qmmjcbse')})" v-text="thisData.bqrkcbseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.bqrkcbseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','bqrkcbse',$event,'qmmjcbse')" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','bqrkcbse',$event,'qmmjcbse')})" v-text="thisData.bqrkcbseybbnlj.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center">——</td>
					</tr>
					<tr>
						<td class="pad3">期末未缴查补税额</td>
						<td class="pad3 center">38=16+22+36-37</td>
						<td class="pad3 center" :contenteditable="thisData.qmmjcbseybby.columnEdit==1" @blur="unfocus('table1','yb','by','qmmjcbse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','by','qmmjcbse',$event)})" v-text="thisData.qmmjcbseybby.columnValue"></td>
						<td class="pad3 center" :contenteditable="thisData.qmmjcbseybbnlj.columnEdit==1" @blur="unfocus('table1','yb','lj','qmmjcbse',$event)" @keydown.enter="(($event)=>{unfocus('table1','yb','lj','qmmjcbse',$event)})" v-text="thisData.qmmjcbseybbnlj.columnValue"></td>
						<td class="pad3 center">——</td>
						<td class="pad3 center">——</td>
					</tr>
				</table>
				<div class="signBox" v-if="thisData.ajynsjcybjseybby">
					<div class="signtitle">授权声明</div>
					<div class="contentBox">
						<div>如果你已委托代理人申报，请填写下列资料：</div>
						<div>为代理一切税务事宜，现授权</div>
						<div style="margin-left:0">（地址）<span style="margin-left:0.8rem">为本纳税人的代理申报人，任何与本</span></div>
						<div>申报表有关的往来文件，都可寄予此人。</div><br>
						<div style="float:right;margin-right:20%">授权人签字：</div>
					</div>
					<div class="signtitle" style="padding-top: 13px;height: calc(1.4rem - 13px);">申报人声明</div>
					<div class="contentBox" style="padding-top: 0.45rem;height: calc(1.4rem - 0.45rem);border-right:1px solid gray">
						<div>本纳税申报表是根据国家税收法律法规及相关规定填报的，我确定它是真实的、可靠的、完整的。</div>
						<br>
						<div style="float:right;margin-right:20%">授权人签字：</div>
					</div>
				</div>
				<el-form :inline="true" class="demo-form-inline" size="small">
					<div class="bottomline1">
						<el-form-item label="主管税务机关：">
							<!-- <el-input v-model="officeName"></el-input> -->
						</el-form-item>
						<el-form-item label="接收人：">
							<!-- <el-input v-model="receiveName"></el-input> -->
						</el-form-item>
						<el-form-item label="接受日期：">
							<!-- <el-input v-model="receiveDate"></el-input> -->
						</el-form-item>
					</div>
				</el-form>
			</div>
			<div v-show="statusVaule=='一般纳税人附表一'">
				<table border="1 " width="100% " v-if="thisData.bfz13hwjjgxlxplwybjszzsfpxse" id="table2">
					<tr>
						<td colspan="4" rowspan="3" class="center">项目及栏次</td>
						<td colspan="2" class="center">开具增值税专用发票 </td>
						<td colspan="2" class="center">开具其他发票 </td>
						<td colspan="2" class="center">未开具发票</td>
						<td colspan="2" class="center">纳税检查调整</td>
						<td colspan="3" class="center">合计</td>
						<td rowspan="2" class="center" style="width:1rem">服务、不动产和无形资产扣除项目本期实际扣除金额</td>
						<td colspan="2" class="center">扣除后</td>
					</tr>
					<tr>
						<td class="center">销售额 </td>
						<td class="center">销项(应纳)税额 </td>
						<td class="center">销售额 </td>
						<td class="center">销项(应纳)税额 </td>
						<td class="center">销售额 </td>
						<td class="center">销项(应纳)税额 </td>
						<td class="center">销售额 </td>
						<td class="center">销项(应纳)税额 </td>
						<td class="center">销售额 </td>
						<td class="center">销项(应纳)税额 </td>
						<td class="center">价税合计</td>
						<td class="center">含税(免税)销售额</td>
						<td class="center">销项(应纳)税额 </td>
					</tr>
					<tr>
						<td class="center">1</td>
						<td class="center">2</td>
						<td class="center">3</td>
						<td class="center">4</td>
						<td class="center">5</td>
						<td class="center">6</td>
						<td class="center">7</td>
						<td class="center">8</td>
						<td class="center">9=1+3+5+7</td>
						<td class="center">10=2+4+6+8</td>
						<td class="center">11=9+10</td>
						<td class="center">12</td>
						<td class="center">13=11-12</td>
						<td class="center" style="width:1rem">14=13÷(100%+税率或征收率)×税率或征收率</td>
					</tr>
					<tr>
						<td rowspan="7" class="center shuli">一、一般计税方法计税</td>
						<td rowspan="5" class="center shuli" style="width:0.5rem">全部征税项目</td>
						<td class="center">13%税率的货物及加工修理修配劳务</td>
						<td class="center">1</td>
						<td class="center" :contenteditable="thisData.bfz13hwjjgxlxplwybjszzsfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz13hwjjgxlxplwybjszzsfpxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13hwjjgxlxplwybjszzsfpxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')})" v-text="this.thisData.bfz13hwjjgxlxplwybjszzsfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13hwjjgxlxplwybjszzsfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz13hwjjgxlxplwybjszzsfpxxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13hwjjgxlxplwybjszzsfpxxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')})" v-text="this.thisData.bfz13hwjjgxlxplwybjszzsfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13hwjjgxlxplwybjskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz13hwjjgxlxplwybjskjqtfpxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13hwjjgxlxplwybjskjqtfpxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')})" v-text="this.thisData.bfz13hwjjgxlxplwybjskjqtfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13hwjjgxlxplwybjskjqtfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz13hwjjgxlxplwybjskjqtfpxxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13hwjjgxlxplwybjskjqtfpxxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')})" v-text="this.thisData.bfz13hwjjgxlxplwybjskjqtfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13hwjjgxlxplwybjswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz13hwjjgxlxplwybjswkjfpxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13hwjjgxlxplwybjswkjfpxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')})" v-text="this.thisData.bfz13hwjjgxlxplwybjswkjfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13hwjjgxlxplwybjswkjfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz13hwjjgxlxplwybjswkjfpxxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13hwjjgxlxplwybjswkjfpxxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')})" v-text="this.thisData.bfz13hwjjgxlxplwybjswkjfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13hwjjgxlxplwybjsnsjctzxse.columnEdit==1" @blur="unfocus('table2','','','bfz13hwjjgxlxplwybjsnsjctzxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13hwjjgxlxplwybjsnsjctzxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')})" v-text="this.thisData.bfz13hwjjgxlxplwybjsnsjctzxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13hwjjgxlxplwybjsnsjctzxxse.columnEdit==1" @blur="unfocus('table2','','','bfz13hwjjgxlxplwybjsnsjctzxxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13hwjjgxlxplwybjsnsjctzxxse',$event,'hjxse','bfz13hwjjgxlxplwybjs')})" v-text="this.thisData.bfz13hwjjgxlxplwybjsnsjctzxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13hwjjgxlxplwybjshjxse.columnEdit==1" @blur="unfocus('table2','','','bfz13hwjjgxlxplwybjshjxse',$event,'','bfz13hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13hwjjgxlxplwybjshjxse',$event,'','bfz13hwjjgxlxplwybjs')})" v-text="this.thisData.bfz13hwjjgxlxplwybjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13hwjjgxlxplwybjshjxxse.columnEdit==1" @blur="unfocus('table2','','','bfz13hwjjgxlxplwybjshjxxse',$event,'','bfz13hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13hwjjgxlxplwybjshjxxse',$event,'','bfz13hwjjgxlxplwybjs')})" v-text="this.thisData.bfz13hwjjgxlxplwybjshjxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td class="center">13%税率的服务、不动产和无形资产</td>
						<td class="center">2</td>
						<td class="center" :contenteditable="thisData.bfz13fwbdchwxzcybjszzsfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz13fwbdchwxzcybjszzsfpxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13fwbdchwxzcybjszzsfpxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)})" v-text="thisData.bfz13fwbdchwxzcybjszzsfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13fwbdchwxzcybjszzsfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz13fwbdchwxzcybjszzsfpxxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13fwbdchwxzcybjszzsfpxxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)})" v-text="thisData.bfz13fwbdchwxzcybjszzsfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13fwbdchwxzcybjskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz13fwbdchwxzcybjskjqtfpxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13fwbdchwxzcybjskjqtfpxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)})" v-text="thisData.bfz13fwbdchwxzcybjskjqtfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13fwbdchwxzcybjskjqtfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz13fwbdchwxzcybjskjqtfpxxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13fwbdchwxzcybjskjqtfpxxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)})" v-text="thisData.bfz13fwbdchwxzcybjskjqtfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13fwbdchwxzcybjswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz13fwbdchwxzcybjswkjfpxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13fwbdchwxzcybjswkjfpxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)})" v-text="thisData.bfz13fwbdchwxzcybjswkjfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13fwbdchwxzcybjswkjfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz13fwbdchwxzcybjswkjfpxxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13fwbdchwxzcybjswkjfpxxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)})" v-text="thisData.bfz13fwbdchwxzcybjswkjfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13fwbdchwxzcybjsnsjctzxse.columnEdit==1" @blur="unfocus('table2','','','bfz13fwbdchwxzcybjsnsjctzxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13fwbdchwxzcybjsnsjctzxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)})" v-text="thisData.bfz13fwbdchwxzcybjsnsjctzxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13fwbdchwxzcybjsnsjctzxxse.columnEdit==1" @blur="unfocus('table2','','','bfz13fwbdchwxzcybjsnsjctzxxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13fwbdchwxzcybjsnsjctzxxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)})" v-text="thisData.bfz13fwbdchwxzcybjsnsjctzxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13fwbdchwxzcybjshjxse.columnEdit==1" @blur="unfocus('table2','','','bfz13fwbdchwxzcybjshjxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13fwbdchwxzcybjshjxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)})" v-text="thisData.bfz13fwbdchwxzcybjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13fwbdchwxzcybjshjxxse.columnEdit==1" @blur="unfocus('table2','','','bfz13fwbdchwxzcybjshjxxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13fwbdchwxzcybjshjxxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)})" v-text="thisData.bfz13fwbdchwxzcybjshjxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13fwbdchwxzcybjshjjshj.columnEdit==1" @blur="unfocus('table2','','','bfz13fwbdchwxzcybjshjjshj',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13fwbdchwxzcybjshjjshj',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)})" v-text="thisData.bfz13fwbdchwxzcybjshjjshj.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje.columnEdit==1" @blur="unfocus('table2','','','bfz13fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)})" v-text="thisData.bfz13fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13fwbdchwxzcybjskchhsxse.columnEdit==1" @blur="unfocus('table2','','','bfz13fwbdchwxzcybjskchhsxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13fwbdchwxzcybjskchhsxse',$event,'hjxse','bfz13fwbdchwxzcybjs',0.13)})" v-text="thisData.bfz13fwbdchwxzcybjskchhsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13fwbdchwxzcybjskchhsxxse.columnEdit==1" @blur="unfocus('table2','','','bfz13fwbdchwxzcybjskchhsxxse',$event,'','bfz13fwbdchwxzcybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz13fwbdchwxzcybjskchhsxxse',$event,'','bfz13fwbdchwxzcybjs')})" v-text="thisData.bfz13fwbdchwxzcybjskchhsxxse.columnValue"></td>
					</tr>
					<tr>
						<td class="center">9%税率的货物及加工修理修配劳务</td>
						<td class="center">3</td>
						<td class="center" :contenteditable="thisData.bfz9hwjjgxlxplwybjszzsfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz9hwjjgxlxplwybjszzsfpxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9hwjjgxlxplwybjszzsfpxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')})" v-text="thisData.bfz9hwjjgxlxplwybjszzsfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9hwjjgxlxplwybjszzsfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz9hwjjgxlxplwybjszzsfpxxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9hwjjgxlxplwybjszzsfpxxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')})" v-text="thisData.bfz9hwjjgxlxplwybjszzsfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9hwjjgxlxplwybjskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz9hwjjgxlxplwybjskjqtfpxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9hwjjgxlxplwybjskjqtfpxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')})" v-text="thisData.bfz9hwjjgxlxplwybjskjqtfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9hwjjgxlxplwybjskjqtfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz9hwjjgxlxplwybjskjqtfpxxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9hwjjgxlxplwybjskjqtfpxxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')})" v-text="thisData.bfz9hwjjgxlxplwybjskjqtfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9hwjjgxlxplwybjswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz9hwjjgxlxplwybjswkjfpxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9hwjjgxlxplwybjswkjfpxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')})" v-text="thisData.bfz9hwjjgxlxplwybjswkjfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9hwjjgxlxplwybjswkjfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz9hwjjgxlxplwybjswkjfpxxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9hwjjgxlxplwybjswkjfpxxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')})" v-text="thisData.bfz9hwjjgxlxplwybjswkjfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9hwjjgxlxplwybjsnsjctzxse.columnEdit==1" @blur="unfocus('table2','','','bfz9hwjjgxlxplwybjsnsjctzxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9hwjjgxlxplwybjsnsjctzxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')})" v-text="thisData.bfz9hwjjgxlxplwybjsnsjctzxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9hwjjgxlxplwybjsnsjctzxxse.columnEdit==1" @blur="unfocus('table2','','','bfz9hwjjgxlxplwybjsnsjctzxxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9hwjjgxlxplwybjsnsjctzxxse',$event,'hjxse','bfz9hwjjgxlxplwybjs')})" v-text="thisData.bfz9hwjjgxlxplwybjsnsjctzxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9hwjjgxlxplwybjshjxse.columnEdit==1" @blur="unfocus('table2','','','bfz9hwjjgxlxplwybjshjxse',$event,'','bfz9hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9hwjjgxlxplwybjshjxse',$event,'','bfz9hwjjgxlxplwybjs')})" v-text="thisData.bfz9hwjjgxlxplwybjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9hwjjgxlxplwybjshjxxse.columnEdit==1" @blur="unfocus('table2','','','bfz9hwjjgxlxplwybjshjxxse',$event,'','bfz9hwjjgxlxplwybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9hwjjgxlxplwybjshjxxse',$event,'','bfz9hwjjgxlxplwybjs')})" v-text="thisData.bfz9hwjjgxlxplwybjshjxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td class="center">9%税率的服务、不动产和无形资产</td>
						<td class="center">4</td>
						<td class="center" :contenteditable="thisData.bfz9fwbdchwxzcybjszzsfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz9fwbdchwxzcybjszzsfpxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9fwbdchwxzcybjszzsfpxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)})" v-text="thisData.bfz9fwbdchwxzcybjszzsfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9fwbdchwxzcybjszzsfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz9fwbdchwxzcybjszzsfpxxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9fwbdchwxzcybjszzsfpxxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)})" v-text="thisData.bfz9fwbdchwxzcybjszzsfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9fwbdchwxzcybjskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz9fwbdchwxzcybjskjqtfpxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9fwbdchwxzcybjskjqtfpxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)})" v-text="thisData.bfz9fwbdchwxzcybjskjqtfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9fwbdchwxzcybjskjqtfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz9fwbdchwxzcybjskjqtfpxxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9fwbdchwxzcybjskjqtfpxxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)})" v-text="thisData.bfz9fwbdchwxzcybjskjqtfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9fwbdchwxzcybjswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz9fwbdchwxzcybjswkjfpxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9fwbdchwxzcybjswkjfpxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)})" v-text="thisData.bfz9fwbdchwxzcybjswkjfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9fwbdchwxzcybjswkjfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz9fwbdchwxzcybjswkjfpxxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9fwbdchwxzcybjswkjfpxxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)})" v-text="thisData.bfz9fwbdchwxzcybjswkjfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9fwbdchwxzcybjsnsjctzxse.columnEdit==1" @blur="unfocus('table2','','','bfz9fwbdchwxzcybjsnsjctzxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9fwbdchwxzcybjsnsjctzxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)})" v-text="thisData.bfz9fwbdchwxzcybjsnsjctzxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9fwbdchwxzcybjsnsjctzxxse.columnEdit==1" @blur="unfocus('table2','','','bfz9fwbdchwxzcybjsnsjctzxxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9fwbdchwxzcybjsnsjctzxxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)})" v-text="thisData.bfz9fwbdchwxzcybjsnsjctzxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9fwbdchwxzcybjshjxse.columnEdit==1" @blur="unfocus('table2','','','bfz9fwbdchwxzcybjshjxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9fwbdchwxzcybjshjxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)})" v-text="thisData.bfz9fwbdchwxzcybjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9fwbdchwxzcybjshjxxse.columnEdit==1" @blur="unfocus('table2','','','bfz9fwbdchwxzcybjshjxxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9fwbdchwxzcybjshjxxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)})" v-text="thisData.bfz9fwbdchwxzcybjshjxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9fwbdchwxzcybjshjjshj.columnEdit==1" @blur="unfocus('table2','','','bfz9fwbdchwxzcybjshjjshj',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9fwbdchwxzcybjshjjshj',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)})" v-text="thisData.bfz9fwbdchwxzcybjshjjshj.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje.columnEdit==1" @blur="unfocus('table2','','','bfz9fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)})" v-text="thisData.bfz9fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9fwbdchwxzcybjskchhsxse.columnEdit==1" @blur="unfocus('table2','','','bfz9fwbdchwxzcybjskchhsxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9fwbdchwxzcybjskchhsxse',$event,'hjxse','bfz9fwbdchwxzcybjs',0.09)})" v-text="thisData.bfz9fwbdchwxzcybjskchhsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9fwbdchwxzcybjskchhsxxse.columnEdit==1" @blur="unfocus('table2','','','bfz9fwbdchwxzcybjskchhsxxse',$event,'','bfz9fwbdchwxzcybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz9fwbdchwxzcybjskchhsxxse',$event,'','bfz9fwbdchwxzcybjs')})" v-text="thisData.bfz9fwbdchwxzcybjskchhsxxse.columnValue"></td>
					</tr>
					<tr>
						<td class="center">6%税率</td>
						<td class="center">5</td>
						<td class="center" :contenteditable="thisData.bfz6slybjszzsxse.columnEdit==1" @blur="unfocus('table2','','','bfz6slybjszzsxse',$event,'hjxse','bfz6slybjs',0.06)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6slybjszzsxse',$event,'hjxse','bfz6slybjs',0.06)})" v-text="thisData.bfz6slybjszzsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6slybjszzsxxse.columnEdit==1" @blur="unfocus('table2','','','bfz6slybjszzsxxse',$event,'hjxse','bfz6slybjs',0.06)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6slybjszzsxxse',$event,'hjxse','bfz6slybjs',0.06)})" v-text="thisData.bfz6slybjszzsxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6slybjskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz6slybjskjqtfpxse',$event,'hjxse','bfz6slybjs',0.06)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6slybjskjqtfpxse',$event,'hjxse','bfz6slybjs',0.06)})" v-text="thisData.bfz6slybjskjqtfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6slybjskjqtfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz6slybjskjqtfpxxse',$event,'hjxse','bfz6slybjs',0.06)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6slybjskjqtfpxxse',$event,'hjxse','bfz6slybjs',0.06)})" v-text="thisData.bfz6slybjskjqtfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6slybjswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz6slybjswkjfpxse',$event,'hjxse','bfz6slybjs',0.06)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6slybjswkjfpxse',$event,'hjxse','bfz6slybjs',0.06)})" v-text="thisData.bfz6slybjswkjfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6slybjswkjfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz6slybjswkjfpxxse',$event,'hjxse','bfz6slybjs',0.06)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6slybjswkjfpxxse',$event,'hjxse','bfz6slybjs',0.06)})" v-text="thisData.bfz6slybjswkjfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6slybjsnsjctzxse.columnEdit==1" @blur="unfocus('table2','','','bfz6slybjsnsjctzxse',$event,'hjxse','bfz6slybjs',0.06)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6slybjsnsjctzxse',$event,'hjxse','bfz6slybjs',0.06)})" v-text="thisData.bfz6slybjsnsjctzxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6slybjsnsjctzxxse.columnEdit==1" @blur="unfocus('table2','','','bfz6slybjsnsjctzxxse',$event,'hjxse','bfz6slybjs',0.06)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6slybjsnsjctzxxse',$event,'hjxse','bfz6slybjs',0.06)})" v-text="thisData.bfz6slybjsnsjctzxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6slybjshjxse.columnEdit==1" @blur="unfocus('table2','','','bfz6slybjshjxse',$event,'hjxse','bfz6slybjs',0.06)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6slybjshjxse',$event,'hjxse','bfz6slybjs',0.06)})" v-text="thisData.bfz6slybjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6slybjshjxxse.columnEdit==1" @blur="unfocus('table2','','','bfz6slybjshjxxse',$event,'hjxse','bfz6slybjs',0.06)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6slybjshjxxse',$event,'hjxse','bfz6slybjs',0.06)})" v-text="thisData.bfz6slybjshjxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6slybjshjjshj.columnEdit==1" @blur="unfocus('table2','','','bfz6slybjshjjshj',$event,'hjxse','bfz6slybjs',0.06)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6slybjshjjshj',$event,'hjxse','bfz6slybjs',0.06)})" v-text="thisData.bfz6slybjshjjshj.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6slybjsfubdchwxzckcxmbqsjkcje.columnEdit==1" @blur="unfocus('table2','','','bfz6slybjsfubdchwxzckcxmbqsjkcje',$event,'hjxse','bfz6slybjs',0.06)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6slybjsfubdchwxzckcxmbqsjkcje',$event,'hjxse','bfz6slybjs',0.06)})" v-text="thisData.bfz6slybjsfubdchwxzckcxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6slybjskchhsxse.columnEdit==1" @blur="unfocus('table2','','','bfz6slybjskchhsxse',$event,'hjxse','bfz6slybjs',0.06)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6slybjskchhsxse',$event,'hjxse','bfz6slybjs',0.06)})" v-text="thisData.bfz6slybjskchhsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6slybjskchhsxxse.columnEdit==1" @blur="unfocus('table2','','','bfz6slybjskchhsxxse',$event,'','bfz6slybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6slybjskchhsxxse',$event,'','bfz6slybjs')})" v-text="thisData.bfz6slybjskchhsxxse.columnValue"></td>
					</tr>
					<tr>
						<td rowspan="2" class="center">其中：即征即退项目</td>
						<td class="center">即征即退货物及加工修理修配劳务</td>
						<td class="center">6</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.jzjthwjjgxlybhjxse.columnEdit==1" @blur="unfocus('table2','','','jzjthwjjgxlybhjxse',$event,'','')" @keydown.enter="(($event)=>{unfocus('table2','','','jzjthwjjgxlybhjxse',$event,'','')})" v-text="thisData.jzjthwjjgxlybhjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjthwjjgxlybhjxxse.columnEdit==1" @blur="unfocus('table2','','','jzjthwjjgxlybhjxxse',$event,'','')" @keydown.enter="(($event)=>{unfocus('table2','','','jzjthwjjgxlybhjxxse',$event,'','')})" v-text="thisData.jzjthwjjgxlybhjxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td class="center">即征即退服务、不动产和无形资产</td>
						<td class="center">7</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.jzjtfwbdchwxzcybjshjxse.columnEdit==1" @blur="unfocus('table2','','','jzjtfwbdchwxzcybjshjxse',$event,'hjxse','jzjtfwbdchwxzcybjs',0)" @keydown.enter="(($event)=>{unfocus('table2','','','jzjtfwbdchwxzcybjshjxse',$event,'hjxse','jzjtfwbdchwxzcybjs',0)})" v-text="thisData.jzjtfwbdchwxzcybjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjtfwbdchwxzcybjshjxxse.columnEdit==1" @blur="unfocus('table2','','','jzjtfwbdchwxzcybjshjxxse',$event,'hjxse','jzjtfwbdchwxzcybjs',0)" @keydown.enter="(($event)=>{unfocus('table2','','','jzjtfwbdchwxzcybjshjxxse',$event,'hjxse','jzjtfwbdchwxzcybjs',0)})" v-text="thisData.jzjtfwbdchwxzcybjshjxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjtfwbdchwxzcybjshjjshj.columnEdit==1" @blur="unfocus('table2','','','jzjtfwbdchwxzcybjshjjshj',$event,'hjxse','jzjtfwbdchwxzcybjs',0)" @keydown.enter="(($event)=>{unfocus('table2','','','jzjtfwbdchwxzcybjshjjshj',$event,'hjxse','jzjtfwbdchwxzcybjs',0)})" v-text="thisData.jzjtfwbdchwxzcybjshjjshj.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjtfwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje.columnEdit==1" @blur="unfocus('table2','','','jzjtfwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','jzjtfwbdchwxzcybjs',0)" @keydown.enter="(($event)=>{unfocus('table2','','','jzjtfwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','jzjtfwbdchwxzcybjs',0)})" v-text="thisData.jzjtfwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjtfwbdchwxzcybjskchhsxse.columnEdit==1" @blur="unfocus('table2','','','jzjtfwbdchwxzcybjskchhsxse',$event,'','jzjtfwbdchwxzcybjs',0)" @keydown.enter="(($event)=>{unfocus('table2','','','jzjtfwbdchwxzcybjskchhsxse',$event,'','jzjtfwbdchwxzcybjs',0)})" v-text="thisData.jzjtfwbdchwxzcybjskchhsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjtfwbdchwxzcybjskchhsxxse.columnEdit==1" @blur="unfocus('table2','','','jzjtfwbdchwxzcybjskchhsxxse',$event,'','jzjtfwbdchwxzcybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','jzjtfwbdchwxzcybjskchhsxxse',$event,'','jzjtfwbdchwxzcybjs')})" v-text="thisData.jzjtfwbdchwxzcybjskchhsxxse.columnValue"></td>
					</tr>
					<tr>
						<td rowspan="11" class="center">二、简易计税方法计税</td>
						<td rowspan="9" class="center">全部征税项目</td>
						<td class="center">6%征收率</td>
						<td class="center">8</td>
						<td class="center" :contenteditable="thisData.bfz6zsljyjszzsxse.columnEdit==1" @blur="unfocus('table2','','','bfz6zsljyjszzsxse',$event,'hjxse','bfz6zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6zsljyjszzsxse',$event,'hjxse','bfz6zsljyjs')})" v-text="thisData.bfz6zsljyjszzsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6zsljyjszzsxxse.columnEdit==1" @blur="unfocus('table2','','','bfz6zsljyjszzsxxse',$event,'hjxse','bfz6zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6zsljyjszzsxxse',$event,'hjxse','bfz6zsljyjs')})" v-text="thisData.bfz6zsljyjszzsxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6zsljyjjskqtfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz6zsljyjjskqtfpxse',$event,'hjxse','bfz6zsljyjjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6zsljyjjskqtfpxse',$event,'hjxse','bfz6zsljyjjs')})" v-text="thisData.bfz6zsljyjjskqtfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6zsljyjjskqtfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz6zsljyjjskqtfpxxse',$event,'hjxse','bfz6zsljyjjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6zsljyjjskqtfpxxse',$event,'hjxse','bfz6zsljyjjs')})" v-text="thisData.bfz6zsljyjjskqtfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6zsljyjswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz6zsljyjswkjfpxse',$event,'hjxse','bfz6zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6zsljyjswkjfpxse',$event,'hjxse','bfz6zsljyjs')})" v-text="thisData.bfz6zsljyjswkjfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6zsljyjswkjfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz6zsljyjswkjfpxxse',$event,'hjxse','bfz6zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6zsljyjswkjfpxxse',$event,'hjxse','bfz6zsljyjs')})" v-text="thisData.bfz6zsljyjswkjfpxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.bfz6zsljyjshjxse.columnEdit==1" @blur="unfocus('table2','','','bfz6zsljyjshjxse',$event,'','bfz6zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6zsljyjshjxse',$event,'','bfz6zsljyjs')})" v-text="thisData.bfz6zsljyjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6zsljyjshjxxse.columnEdit==1" @blur="unfocus('table2','','','bfz6zsljyjshjxxse',$event,'','bfz6zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz6zsljyjshjxxse',$event,'','bfz6zsljyjs')})" v-text="thisData.bfz6zsljyjshjxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td class="center">5%征收率的货物及加工修理修配劳务</td>
						<td class="center">9a</td>
						<td class="center" :contenteditable="thisData.bfz5zsljyjszzsxse.columnEdit==1" @blur="unfocus('table2','','','bfz5zsljyjszzsxse',$event,'hjxse','bfz5zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5zsljyjszzsxse',$event,'hjxse','bfz5zsljyjs')})" v-text="thisData.bfz5zsljyjszzsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5zsljyjszzsxxse.columnEdit==1" @blur="unfocus('table2','','','bfz5zsljyjszzsxxse',$event,'hjxse','bfz5zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5zsljyjszzsxxse',$event,'hjxse','bfz5zsljyjs')})" v-text="thisData.bfz5zsljyjszzsxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5zsljyjskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz5zsljyjskjqtfpxse',$event,'hjxse','bfz5zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5zsljyjskjqtfpxse',$event,'hjxse','bfz5zsljyjs')})" v-text="thisData.bfz5zsljyjskjqtfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5zsljyjskjqtfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz5zsljyjskjqtfpxxse',$event,'hjxse','bfz5zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5zsljyjskjqtfpxxse',$event,'hjxse','bfz5zsljyjs')})" v-text="thisData.bfz5zsljyjskjqtfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5zsljyjswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz5zsljyjswkjfpxse',$event,'hjxse','bfz5zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5zsljyjswkjfpxse',$event,'hjxse','bfz5zsljyjs')})" v-text="thisData.bfz5zsljyjswkjfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5zsljyjswkjfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz5zsljyjswkjfpxxse',$event,'hjxse','bfz5zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5zsljyjswkjfpxxse',$event,'hjxse','bfz5zsljyjs')})" v-text="thisData.bfz5zsljyjswkjfpxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.bfz5zsljyjshjxse.columnEdit==1" @blur="unfocus('table2','','','bfz5zsljyjshjxse',$event,'','bfz5zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5zsljyjshjxse',$event,'','bfz5zsljyjs')})" v-text="thisData.bfz5zsljyjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5zsljyjshjxxse.columnEdit==1" @blur="unfocus('table2','','','bfz5zsljyjshjxxse',$event,'','bfz5zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5zsljyjshjxxse',$event,'','bfz5zsljyjs')})" v-text="thisData.bfz5zsljyjshjxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td class="center">5%征收率的服务、不动产和无形资产</td>
						<td class="center">9b</td>
						<td class="center" :contenteditable="thisData.bfz5fwbdchwxzcybjszzsfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz5fwbdchwxzcybjszzsfpxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5fwbdchwxzcybjszzsfpxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)})" v-text="thisData.bfz5fwbdchwxzcybjszzsfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5fwbdchwxzcybjszzsfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz5fwbdchwxzcybjszzsfpxxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5fwbdchwxzcybjszzsfpxxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)})" v-text="thisData.bfz5fwbdchwxzcybjszzsfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5fwbdchwxzcybjskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz5fwbdchwxzcybjskjqtfpxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5fwbdchwxzcybjskjqtfpxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)})" v-text="thisData.bfz5fwbdchwxzcybjskjqtfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5fwbdchwxzcybjskjqtfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz5fwbdchwxzcybjskjqtfpxxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5fwbdchwxzcybjskjqtfpxxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)})" v-text="thisData.bfz5fwbdchwxzcybjskjqtfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5fwbdchwxzcybjswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz5fwbdchwxzcybjswkjfpxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5fwbdchwxzcybjswkjfpxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)})" v-text="thisData.bfz5fwbdchwxzcybjswkjfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5fwbdchwxzcybjswkjfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz5fwbdchwxzcybjswkjfpxxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5fwbdchwxzcybjswkjfpxxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)})" v-text="thisData.bfz5fwbdchwxzcybjswkjfpxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.bfz5fwbdchwxzcybjshjxse.columnEdit==1" @blur="unfocus('table2','','','bfz5fwbdchwxzcybjshjxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5fwbdchwxzcybjshjxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)})" v-text="thisData.bfz5fwbdchwxzcybjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5fwbdchwxzcybjshjxxse.columnEdit==1" @blur="unfocus('table2','','','bfz5fwbdchwxzcybjshjxxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5fwbdchwxzcybjshjxxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)})" v-text="thisData.bfz5fwbdchwxzcybjshjxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5fwbdchwxzcybjshjjshj.columnEdit==1" @blur="unfocus('table2','','','bfz5fwbdchwxzcybjshjjshj',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5fwbdchwxzcybjshjjshj',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)})" v-text="thisData.bfz5fwbdchwxzcybjshjjshj.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje.columnEdit==1" @blur="unfocus('table2','','','bfz5fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)})" v-text="thisData.bfz5fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5fwbdchwxzcybjskchhsxse.columnEdit==1" @blur="unfocus('table2','','','bfz5fwbdchwxzcybjskchhsxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5fwbdchwxzcybjskchhsxse',$event,'hjxse','bfz5fwbdchwxzcybjs',0.05)})" v-text="thisData.bfz5fwbdchwxzcybjskchhsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5fwbdchwxzcybjskchhsxxse.columnEdit==1" @blur="unfocus('table2','','','bfz5fwbdchwxzcybjskchhsxxse',$event,'','bfz5fwbdchwxzcybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz5fwbdchwxzcybjskchhsxxse',$event,'','bfz5fwbdchwxzcybjs')})" v-text="thisData.bfz5fwbdchwxzcybjskchhsxxse.columnValue"></td>
					</tr>
					<tr>
						<td class="center">4%征收率</td>
						<td class="center">10</td>
						<td class="center" :contenteditable="thisData.bfz4zsljyjszzsxse.columnEdit==1" @blur="unfocus('table2','','','bfz4zsljyjszzsxse',$event,'hjxse','bfz4zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz4zsljyjszzsxse',$event,'hjxse','bfz4zsljyjs')})" v-text="thisData.bfz4zsljyjszzsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz4zsljyjszzsxxse.columnEdit==1" @blur="unfocus('table2','','','bfz4zsljyjszzsxxse',$event,'hjxse','bfz4zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz4zsljyjszzsxxse',$event,'hjxse','bfz4zsljyjs')})" v-text="thisData.bfz4zsljyjszzsxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz4zsljyjskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz4zsljyjskjqtfpxse',$event,'hjxse','bfz4zsljyjjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz4zsljyjskjqtfpxse',$event,'hjxse','bfz4zsljyjjs')})" v-text="thisData.bfz4zsljyjskjqtfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz4zsljyjskjqtfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz4zsljyjskjqtfpxxse',$event,'hjxse','bfz4zsljyjjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz4zsljyjskjqtfpxxse',$event,'hjxse','bfz4zsljyjjs')})" v-text="thisData.bfz4zsljyjskjqtfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz4zsljyjswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz4zsljyjswkjfpxse',$event,'hjxse','bfz4zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz4zsljyjswkjfpxse',$event,'hjxse','bfz4zsljyjs')})" v-text="thisData.bfz4zsljyjswkjfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz4zsljyjswkjfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz4zsljyjswkjfpxxse',$event,'hjxse','bfz4zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz4zsljyjswkjfpxxse',$event,'hjxse','bfz4zsljyjs')})" v-text="thisData.bfz4zsljyjswkjfpxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.bfz4zsljyjshjxse.columnEdit==1" @blur="unfocus('table2','','','bfz4zsljyjshjxse',$event,'','bfz4zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz4zsljyjshjxse',$event,'','bfz4zsljyjs')})" v-text="thisData.bfz4zsljyjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz4zsljyjshjxxse.columnEdit==1" @blur="unfocus('table2','','','bfz4zsljyjshjxxse',$event,'','bfz4zsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz4zsljyjshjxxse',$event,'','bfz4zsljyjs')})" v-text="thisData.bfz4zsljyjshjxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td class="center">3%征收率的货物及加工修理修配劳务</td>
						<td class="center">11</td>
						<td class="center" :contenteditable="thisData.bfz3hwjjgxljyjszzsxse.columnEdit==1" @blur="unfocus('table2','','','bfz3hwjjgxljyjszzsxse',$event,'hjxse','bfz3hwjjgxljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3hwjjgxljyjszzsxse',$event,'hjxse','bfz3hwjjgxljyjs')})" v-text="thisData.bfz3hwjjgxljyjszzsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3hwjjgxljyjszzsxxse.columnEdit==1" @blur="unfocus('table2','','','bfz3hwjjgxljyjszzsxxse',$event,'hjxse','bfz3hwjjgxljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3hwjjgxljyjszzsxxse',$event,'hjxse','bfz3hwjjgxljyjs')})" v-text="thisData.bfz3hwjjgxljyjszzsxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3hwjjgxljyjskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz3hwjjgxljyjskjqtfpxse',$event,'hjxse','bfz3hwjjgxljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3hwjjgxljyjskjqtfpxse',$event,'hjxse','bfz3hwjjgxljyjs')})" v-text="thisData.bfz3hwjjgxljyjskjqtfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3hwjjgxljyjskjqtfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz3hwjjgxljyjskjqtfpxxse',$event,'hjxse','bfz3hwjjgxljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3hwjjgxljyjskjqtfpxxse',$event,'hjxse','bfz3hwjjgxljyjs')})" v-text="thisData.bfz3hwjjgxljyjskjqtfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3hwjjgxljyjswjjfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz3hwjjgxljyjswjjfpxse',$event,'hjxse','bfz3hwjjgxljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3hwjjgxljyjswjjfpxse',$event,'hjxse','bfz3hwjjgxljyjs')})" v-text="thisData.bfz3hwjjgxljyjswjjfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3hwjjgxljyjswjjfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz3hwjjgxljyjswjjfpxxse',$event,'hjxse','bfz3hwjjgxljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3hwjjgxljyjswjjfpxxse',$event,'hjxse','bfz3hwjjgxljyjs')})" v-text="thisData.bfz3hwjjgxljyjswjjfpxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.bfz3hwjjgxljyjshjxse.columnEdit==1" @blur="unfocus('table2','','','bfz3hwjjgxljyjshjxse',$event,'','bfz3hwjjgxljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3hwjjgxljyjshjxse',$event,'','bfz3hwjjgxljyjs')})" v-text="thisData.bfz3hwjjgxljyjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3hwjjgxljyjshjxxse.columnEdit==1" @blur="unfocus('table2','','','bfz3hwjjgxljyjshjxxse',$event,'','bfz3hwjjgxljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3hwjjgxljyjshjxxse',$event,'','bfz3hwjjgxljyjs')})" v-text="thisData.bfz3hwjjgxljyjshjxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td class="center">3%征收率的服务、不动产和无形资产</td>
						<td class="center">12</td>
						<td class="center" :contenteditable="thisData.bfz3fwbdchwxzcybjszzsfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz3fwbdchwxzcybjszzsfpxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3fwbdchwxzcybjszzsfpxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)})" v-text="thisData.bfz3fwbdchwxzcybjszzsfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3fwbdchwxzcybjszzsfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz3fwbdchwxzcybjszzsfpxxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3fwbdchwxzcybjszzsfpxxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)})" v-text="thisData.bfz3fwbdchwxzcybjszzsfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3fwbdchwxzcybjskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz3fwbdchwxzcybjskjqtfpxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3fwbdchwxzcybjskjqtfpxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)})" v-text="thisData.bfz3fwbdchwxzcybjskjqtfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3fwbdchwxzcybjskjqtfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz3fwbdchwxzcybjskjqtfpxxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3fwbdchwxzcybjskjqtfpxxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)})" v-text="thisData.bfz3fwbdchwxzcybjskjqtfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3fwbdchwxzcybjswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','bfz3fwbdchwxzcybjswkjfpxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3fwbdchwxzcybjswkjfpxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)})" v-text="thisData.bfz3fwbdchwxzcybjswkjfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3fwbdchwxzcybjswkjfpxxse.columnEdit==1" @blur="unfocus('table2','','','bfz3fwbdchwxzcybjswkjfpxxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3fwbdchwxzcybjswkjfpxxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)})" v-text="thisData.bfz3fwbdchwxzcybjswkjfpxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.bfz3fwbdchwxzcybjshjxse.columnEdit==1" @blur="unfocus('table2','','','bfz3fwbdchwxzcybjshjxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3fwbdchwxzcybjshjxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)})" v-text="thisData.bfz3fwbdchwxzcybjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3fwbdchwxzcybjshjxxse.columnEdit==1" @blur="unfocus('table2','','','bfz3fwbdchwxzcybjshjxxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3fwbdchwxzcybjshjxxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)})" v-text="thisData.bfz3fwbdchwxzcybjshjxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3fwbdchwxzcybjshjjshj.columnEdit==1" @blur="unfocus('table2','','','bfz3fwbdchwxzcybjshjjshj',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3fwbdchwxzcybjshjjshj',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)})" v-text="thisData.bfz3fwbdchwxzcybjshjjshj.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje.columnEdit==1" @blur="unfocus('table2','','','bfz3fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)})" v-text="thisData.bfz3fwbdchwxzcybjsfwbdchwxzckcxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3fwbdchwxzcybjskchhsxse.columnEdit==1" @blur="unfocus('table2','','','bfz3fwbdchwxzcybjskchhsxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3fwbdchwxzcybjskchhsxse',$event,'hjxse','bfz3fwbdchwxzcybjs',0.03)})" v-text="thisData.bfz3fwbdchwxzcybjskchhsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3fwbdchwxzcybjskchhsxxse.columnEdit==1" @blur="unfocus('table2','','','bfz3fwbdchwxzcybjskchhsxxse',$event,'','bfz3fwbdchwxzcybjs')" @keydown.enter="(($event)=>{unfocus('table2','','','bfz3fwbdchwxzcybjskchhsxxse',$event,'','bfz3fwbdchwxzcybjs')})" v-text="thisData.bfz3fwbdchwxzcybjskchhsxxse.columnValue"></td>
					</tr>
					<tr>
						<td class="center">预征率<span contenteditable @blur="unfocus('table2','','','yll13azsljyjssl',$event,'hjxse','yll13azsljyjs',arate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13azsljyjssl',$event,'hjxse','yll13azsljyjs',arate)})">{{arate}} </span>%</td>
						<td class="center">13a</td>
						<td class="center" :contenteditable="thisData.yll13azsljyjsskzzsxse.columnEdit==1" @blur="unfocus('table2','','','yll13azsljyjsskzzsxse',$event,'hjxse','yll13azsljyjs',arate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13azsljyjsskzzsxse',$event,'hjxse','yll13azsljyjs',arate)})" v-text="thisData.yll13azsljyjsskzzsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13azsljyjsskzzsxxse.columnEdit==1" @blur="unfocus('table2','','','yll13azsljyjsskzzsxxse',$event,'hjxse','yll13azsljyjs',arate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13azsljyjsskzzsxxse',$event,'hjxse','yll13azsljyjs',arate)})" v-text="thisData.yll13azsljyjsskzzsxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13azsljyjskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','yll13azsljyjskjqtfpxse',$event,'hjxse','yll13azsljyjs',arate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13azsljyjskjqtfpxse',$event,'hjxse','yll13azsljyjs',arate)})" v-text="thisData.yll13azsljyjskjqtfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13azsljyjskjqtfpxxse.columnEdit==1" @blur="unfocus('table2','','','yll13azsljyjskjqtfpxxse',$event,'hjxse','yll13azsljyjs',arate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13azsljyjskjqtfpxxse',$event,'hjxse','yll13azsljyjs',arate)})" v-text="thisData.yll13azsljyjskjqtfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13azsljyjswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','yll13azsljyjswkjfpxse',$event,'hjxse','yll13azsljyjs',arate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13azsljyjswkjfpxse',$event,'hjxse','yll13azsljyjs',arate)})" v-text="thisData.yll13azsljyjswkjfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13azsljyjswkjfpxxse.columnEdit==1" @blur="unfocus('table2','','','yll13azsljyjswkjfpxxse',$event,'hjxse','yll13azsljyjs',arate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13azsljyjswkjfpxxse',$event,'hjxse','yll13azsljyjs',arate)})" v-text="thisData.yll13azsljyjswkjfpxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.yll13azsljyjshjxse.columnEdit==1" @blur="unfocus('table2','','','yll13azsljyjshjxse',$event,'hjxse','yll13azsljyjs',arate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13azsljyjshjxse',$event,'hjxse','yll13azsljyjs',arate)})" v-text="thisData.yll13azsljyjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13azsljyjshjxxse.columnEdit==1" @blur="unfocus('table2','','','yll13azsljyjshjxxse',$event,'hjxse','yll13azsljyjs',arate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13azsljyjshjxxse',$event,'hjxse','yll13azsljyjs',arate)})" v-text="thisData.yll13azsljyjshjxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13azsljyjshjjshj.columnEdit==1" @blur="unfocus('table2','','','yll13azsljyjshjjshj',$event,'hjxse','yll13azsljyjs',arate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13azsljyjshjjshj',$event,'hjxse','yll13azsljyjs',arate)})" v-text="thisData.yll13azsljyjshjjshj.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13azsljyjsfwbdchwxzckcxmbqsjkcje.columnEdit==1" @blur="unfocus('table2','','','yll13azsljyjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','yll13azsljyjs',arate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13azsljyjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','yll13azsljyjs',arate)})" v-text="thisData.yll13azsljyjsfwbdchwxzckcxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13azsljyjskchhsxse.columnEdit==1" @blur="unfocus('table2','','','yll13azsljyjskchhsxse',$event,'hjxse','yll13azsljyjs',arate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13azsljyjskchhsxse',$event,'hjxse','yll13azsljyjs',arate)})" v-text="thisData.yll13azsljyjskchhsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13azsljyjskchxxse.columnEdit==1" @blur="unfocus('table2','','','yll13azsljyjskchxxse',$event,'','yll13azsljyjs',arate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13azsljyjskchxxse',$event,'','yll13azsljyjs',arate)})" v-text="thisData.yll13azsljyjskchxxse.columnValue"></td>
					</tr>
					<tr>
						<td class="center">预征率<span contenteditable @blur="unfocus('table2','','','yll13bzsljyjssl',$event,'hjxse','yll13bzsljyjs',brate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13bzsljyjssl',$event,'hjxse','yll13bzsljyjs',brate)})">{{brate}}</span>%</td>
						<td class="center">13b</td>
						<td class="center" :contenteditable="thisData.yll13bzsljyjsskzzsxse.columnEdit==1" @blur="unfocus('table2','','','yll13bzsljyjsskzzsxse',$event,'hjxse','yll13bzsljyjs',brate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13bzsljyjsskzzsxse',$event,'hjxse','yll13bzsljyjs',brate)})" v-text="thisData.yll13bzsljyjsskzzsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13bzsljyjsskzzsxxse.columnEdit==1" @blur="unfocus('table2','','','yll13bzsljyjsskzzsxxse',$event,'hjxse','yll13bzsljyjs',brate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13bzsljyjsskzzsxxse',$event,'hjxse','yll13bzsljyjs',brate)})" v-text="thisData.yll13bzsljyjsskzzsxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13bzsljyjskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','yll13bzsljyjskjqtfpxse',$event,'hjxse','yll13bzsljyjs',brate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13bzsljyjskjqtfpxse',$event,'hjxse','yll13bzsljyjs',brate)})" v-text="thisData.yll13bzsljyjskjqtfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13bzsljyjskjqtfpxxse.columnEdit==1" @blur="unfocus('table2','','','yll13bzsljyjskjqtfpxxse',$event,'hjxse','yll13bzsljyjs',brate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13bzsljyjskjqtfpxxse',$event,'hjxse','yll13bzsljyjs',brate)})" v-text="thisData.yll13bzsljyjskjqtfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13bzsljyjswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','yll13bzsljyjswkjfpxse',$event,'hjxse','yll13bzsljyjs',brate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13bzsljyjswkjfpxse',$event,'hjxse','yll13bzsljyjs',brate)})" v-text="thisData.yll13bzsljyjswkjfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13bzsljyjswkjfpxxse.columnEdit==1" @blur="unfocus('table2','','','yll13bzsljyjswkjfpxxse',$event,'hjxse','yll13bzsljyjs',brate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13bzsljyjswkjfpxxse',$event,'hjxse','yll13bzsljyjs',brate)})" v-text="thisData.yll13bzsljyjswkjfpxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.yll13bzsljyjshjxse.columnEdit==1" @blur="unfocus('table2','','','yll13bzsljyjshjxse',$event,'hjxse','yll13bzsljyjs',brate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13bzsljyjshjxse',$event,'hjxse','yll13bzsljyjs',brate)})" v-text="thisData.yll13bzsljyjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13bzsljyjshjxxse.columnEdit==1" @blur="unfocus('table2','','','yll13bzsljyjshjxxse',$event,'hjxse','yll13bzsljyjs',brate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13bzsljyjshjxxse',$event,'hjxse','yll13bzsljyjs',brate)})" v-text="thisData.yll13bzsljyjshjxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13bzsljyjshjjshj.columnEdit==1" @blur="unfocus('table2','','','yll13bzsljyjshjjshj',$event,'hjxse','yll13bzsljyjs',brate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13bzsljyjshjjshj',$event,'hjxse','yll13bzsljyjs',brate)})" v-text="thisData.yll13bzsljyjshjjshj.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13bzsljyjsfwbdchwxzckcxmbqsjkcje.columnEdit==1" @blur="unfocus('table2','','','yll13bzsljyjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','yll13bzsljyjs',brate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13bzsljyjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','yll13bzsljyjs',brate)})" v-text="thisData.yll13bzsljyjsfwbdchwxzckcxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13bzsljyjskchhsxse.columnEdit==1" @blur="unfocus('table2','','','yll13bzsljyjskchhsxse',$event,'hjxse','yll13bzsljyjs',brate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13bzsljyjskchhsxse',$event,'hjxse','yll13bzsljyjs',brate)})" v-text="thisData.yll13bzsljyjskchhsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13bzsljyjskchxxse.columnEdit==1" @blur="unfocus('table2','','','yll13bzsljyjskchxxse',$event,'','yll13bzsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','yll13bzsljyjskchxxse',$event,'','yll13bzsljyjs')})" v-text="thisData.yll13bzsljyjskchxxse.columnValue"></td>
					</tr>
					<tr>
						<td class="center">预征率<span contenteditable @blur="unfocus('table2','','','yll13czsljyjssl',$event,'hjxse','yll13czsljyjs',crate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13czsljyjssl',$event,'hjxse','yll13czsljyjs',crate)})">{{crate}}</span>%</td>
						<td class="center">13c</td>
						<td class="center" :contenteditable="thisData.yll13czsljyjsskzzsxse.columnEdit==1" @blur="unfocus('table2','','','yll13czsljyjsskzzsxse',$event,'hjxse','yll13czsljyjs',crate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13czsljyjsskzzsxse',$event,'hjxse','yll13czsljyjs',crate)})" v-text="thisData.yll13czsljyjsskzzsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13czsljyjsskzzsxxse.columnEdit==1" @blur="unfocus('table2','','','yll13czsljyjsskzzsxxse',$event,'hjxse','yll13czsljyjs',crate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13czsljyjsskzzsxxse',$event,'hjxse','yll13czsljyjs',crate)})" v-text="thisData.yll13czsljyjsskzzsxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13czsljyjskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','yll13czsljyjskjqtfpxse',$event,'hjxse','yll13czsljyjs',crate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13czsljyjskjqtfpxse',$event,'hjxse','yll13czsljyjs',crate)})" v-text="thisData.yll13czsljyjskjqtfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13czsljyjskjqtfpxxse.columnEdit==1" @blur="unfocus('table2','','','yll13czsljyjskjqtfpxxse',$event,'hjxse','yll13czsljyjs',crate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13czsljyjskjqtfpxxse',$event,'hjxse','yll13czsljyjs',crate)})" v-text="thisData.yll13czsljyjskjqtfpxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13czsljyjswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','yll13czsljyjswkjfpxse',$event,'hjxse','yll13czsljyjs',crate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13czsljyjswkjfpxse',$event,'hjxse','yll13czsljyjs',crate)})" v-text="thisData.yll13czsljyjswkjfpxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13czsljyjswkjfpxxse.columnEdit==1" @blur="unfocus('table2','','','yll13czsljyjswkjfpxxse',$event,'hjxse','yll13czsljyjs',crate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13czsljyjswkjfpxxse',$event,'hjxse','yll13czsljyjs',crate)})" v-text="thisData.yll13czsljyjswkjfpxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.yll13czsljyjshjxse.columnEdit==1" @blur="unfocus('table2','','','yll13czsljyjshjxse',$event,'hjxse','yll13czsljyjs',crate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13czsljyjshjxse',$event,'hjxse','yll13czsljyjs',crate)})" v-text="thisData.yll13czsljyjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13czsljyjshjxxse.columnEdit==1" @blur="unfocus('table2','','','yll13czsljyjshjxxse',$event,'hjxse','yll13czsljyjs',crate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13czsljyjshjxxse',$event,'hjxse','yll13czsljyjs',crate)})" v-text="thisData.yll13czsljyjshjxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13czsljyjshjjshj.columnEdit==1" @blur="unfocus('table2','','','yll13czsljyjshjjshj',$event,'hjxse','yll13czsljyjs',crate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13czsljyjshjjshj',$event,'hjxse','yll13czsljyjs',crate)})" v-text="thisData.yll13czsljyjshjjshj.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13czsljyjsfwbdchwxzckcxmbqsjkcje.columnEdit==1" @blur="unfocus('table2','','','yll13czsljyjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','yll13czsljyjs',crate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13czsljyjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','yll13czsljyjs',crate)})" v-text="thisData.yll13czsljyjsfwbdchwxzckcxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13czsljyjskchhsxse.columnEdit==1" @blur="unfocus('table2','','','yll13czsljyjskchhsxse',$event,'hjxse','yll13czsljyjs',crate)" @keydown.enter="(($event)=>{unfocus('table2','','','yll13czsljyjskchhsxse',$event,'hjxse','yll13czsljyjs',crate)})" v-text="thisData.yll13czsljyjskchhsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.yll13czsljyjskchxxse.columnEdit==1" @blur="unfocus('table2','','','yll13czsljyjskchxxse',$event,'','yll13czsljyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','yll13czsljyjskchxxse',$event,'','yll13czsljyjs')})" v-text="thisData.yll13czsljyjskchxxse.columnValue"></td>
					</tr>
					<tr>
						<td rowspan="2" class="center">其中：即征即退项目</td>
						<td class="center">即征即退货物及加工修理修配劳务</td>
						<td class="center">14</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.jzjthwjgjyjshjxse.columnEdit==1" @blur="unfocus('table2','','','jzjthwjgjyjshjxse',$event,'','')" @keydown.enter="(($event)=>{unfocus('table2','','','jzjthwjgjyjshjxse',$event,'','')})" v-text="thisData.jzjthwjgjyjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjthwjgjyjshjxxse.columnEdit==1" @blur="unfocus('table2','','','jzjthwjgjyjshjxxse',$event,'','')" @keydown.enter="(($event)=>{unfocus('table2','','','jzjthwjgjyjshjxxse',$event,'','')})" v-text="thisData.jzjthwjgjyjshjxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td class="center">即征即退服务、不动产和无形资产</td>
						<td class="center">15</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.jzjtfwbdchwxzcjyjshjxse.columnEdit==1" @blur="unfocus('table2','','','jzjtfwbdchwxzcjyjshjxse',$event,'hjxse','jzjtfwbdchwxzcjyjs',0)" @keydown.enter="(($event)=>{unfocus('table2','','','jzjtfwbdchwxzcjyjshjxse',$event,'hjxse','jzjtfwbdchwxzcjyjs',0)})" v-text="thisData.jzjtfwbdchwxzcjyjshjxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjtfwbdchwxzcjyjshjxxse.columnEdit==1" @blur="unfocus('table2','','','jzjtfwbdchwxzcjyjshjxxse',$event,'hjxse','jzjtfwbdchwxzcjyjs',0)" @keydown.enter="(($event)=>{unfocus('table2','','','jzjtfwbdchwxzcjyjshjxxse',$event,'hjxse','jzjtfwbdchwxzcjyjs',0)})" v-text="thisData.jzjtfwbdchwxzcjyjshjxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjtfwbdchwxzcjyjshjjshj.columnEdit==1" @blur="unfocus('table2','','','jzjtfwbdchwxzcjyjshjjshj',$event,'hjxse','jzjtfwbdchwxzcybjs',0)" @keydown.enter="(($event)=>{unfocus('table2','','','jzjtfwbdchwxzcjyjshjjshj',$event,'hjxse','jzjtfwbdchwxzcybjs',0)})" v-text="thisData.jzjtfwbdchwxzcjyjshjjshj.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjtfwbdchwxzcjyjsfwbdchwxzckcxmbqsjkcje.columnEdit==1" @blur="unfocus('table2','','','jzjtfwbdchwxzcjyjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','jzjtfwbdchwxzcjyjs',0)" @keydown.enter="(($event)=>{unfocus('table2','','','jzjtfwbdchwxzcjyjsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','jzjtfwbdchwxzcjyjs',0)})" v-text="thisData.jzjtfwbdchwxzcjyjsfwbdchwxzckcxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjtfwbdchwxzcjyjskchhsxse.columnEdit==1" @blur="unfocus('table2','','','jzjtfwbdchwxzcjyjskchhsxse',$event,'','jzjtfwbdchwxzcjyjs',0)" @keydown.enter="(($event)=>{unfocus('table2','','','jzjtfwbdchwxzcjyjskchhsxse',$event,'','jzjtfwbdchwxzcjyjs',0)})" v-text="thisData.jzjtfwbdchwxzcjyjskchhsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjtfwbdchwxzcjyjskchhsxxse.columnEdit==1" @blur="unfocus('table2','','','jzjtfwbdchwxzcjyjskchhsxxse',$event,'','jzjtfwbdchwxzcjyjs')" @keydown.enter="(($event)=>{unfocus('table2','','','jzjtfwbdchwxzcjyjskchhsxxse',$event,'','jzjtfwbdchwxzcjyjs')})" v-text="thisData.jzjtfwbdchwxzcjyjskchhsxxse.columnValue"></td>
					</tr>
					<tr>
						<td rowspan="2" class="center">三、免抵退税</td>
						<td colspan="2" class="center">货物及加工修理修配劳务</td>
						<td class="center">16</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.hwjjgxllwmdtskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','hwjjgxllwmdtskjqtfpxse',$event,'hjxse','hwjjgxllwmdts')" @keydown.enter="(($event)=>{unfocus('table2','','','hwjjgxllwmdtskjqtfpxse',$event,'hjxse','hwjjgxllwmdts')})" v-text="thisData.hwjjgxllwmdtskjqtfpxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.hwjjgxllwmdtswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','hwjjgxllwmdtswkjfpxse',$event,'hjxse','hwjjgxllwmdts')" @keydown.enter="(($event)=>{unfocus('table2','','','hwjjgxllwmdtswkjfpxse',$event,'hjxse','hwjjgxllwmdts')})" v-text="thisData.hwjjgxllwmdtswkjfpxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.hwjjgxllwmdtshjxse.columnEdit==1" @blur="unfocus('table2','','','hwjjgxllwmdtshjxse',$event,'hjxse','hwjjgxllwmdts')" @keydown.enter="(($event)=>{unfocus('table2','','','hwjjgxllwmdtshjxse',$event,'hjxse','hwjjgxllwmdts')})" v-text="thisData.hwjjgxllwmdtshjxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td colspan="2" class="center">服务、不动产和无形资产</td>
						<td class="center">17</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.fwbdchwxzcmdtskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','fwbdchwxzcmdtskjqtfpxse',$event,'hjxse','fwbdchwxzcmdts')" @keydown.enter="(($event)=>{unfocus('table2','','','fwbdchwxzcmdtskjqtfpxse',$event,'hjxse','fwbdchwxzcmdts')})" v-text="thisData.fwbdchwxzcmdtskjqtfpxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.fwbdchwxzcmdtswkjqtfpxxse.columnEdit==1" @blur="unfocus('table2','','','fwbdchwxzcmdtswkjqtfpxxse',$event,'hjxse','fwbdchwxzcmdts')" @keydown.enter="(($event)=>{unfocus('table2','','','fwbdchwxzcmdtswkjqtfpxxse',$event,'hjxse','fwbdchwxzcmdts')})" v-text="thisData.fwbdchwxzcmdtswkjqtfpxxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.fwbdchwxzcmdtshjxse.columnEdit==1" @blur="unfocus('table2','','','fwbdchwxzcmdtshjxse',$event,'hjxse','fwbdchwxzcmdts')" @keydown.enter="(($event)=>{unfocus('table2','','','fwbdchwxzcmdtshjxse',$event,'hjxse','fwbdchwxzcmdts')})" v-text="thisData.fwbdchwxzcmdtshjxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.fwbdchwxzcmdtshjjshj.columnEdit==1" @blur="unfocus('table2','','','fwbdchwxzcmdtshjjshj',$event,'hjxse','fwbdchwxzcmdts')" @keydown.enter="(($event)=>{unfocus('table2','','','fwbdchwxzcmdtshjjshj',$event,'hjxse','fwbdchwxzcmdts')})" v-text="thisData.fwbdchwxzcmdtshjjshj.columnValue"></td>
						<td class="center" :contenteditable="thisData.fwbdchwxzcmdtsfwbdchwxzckcxmbqsjkcje.columnEdit==1" @blur="unfocus('table2','','','fwbdchwxzcmdtsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','fwbdchwxzcmdts')" @keydown.enter="(($event)=>{unfocus('table2','','','fwbdchwxzcmdtsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','fwbdchwxzcmdts')})" v-text="thisData.fwbdchwxzcmdtsfwbdchwxzckcxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.fwbdchwxzcmdtskchhsxse.columnEdit==1" @blur="unfocus('table2','','','fwbdchwxzcmdtskchhsxse',$event,'','fwbdchwxzcmdts')" @keydown.enter="(($event)=>{unfocus('table2','','','fwbdchwxzcmdtskchhsxse',$event,'','fwbdchwxzcmdts')})" v-text="thisData.fwbdchwxzcmdtskchhsxse.columnValue"></td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td rowspan="2" class="center">四、免税</td>
						<td colspan="2" class="center">货物及加工修理修配劳务</td>
						<td class="center">18</td>
						<td class="center" :contenteditable="thisData.hwjjgxllwmsskzzsxse.columnEdit==1" @blur="unfocus('table2','','','hwjjgxllwmsskzzsxse',$event,'hjxse','hwjjgxllwmssk')" @keydown.enter="(($event)=>{unfocus('table2','','','hwjjgxllwmsskzzsxse',$event,'hjxse','hwjjgxllwmssk')})" v-text="thisData.hwjjgxllwmsskzzsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.hwjjgxllwmsskzzsxxse.columnEdit==1" @blur="unfocus('table2','','','hwjjgxllwmsskzzsxxse',$event,'hjxse','hwjjgxllwmssk')" @keydown.enter="(($event)=>{unfocus('table2','','','hwjjgxllwmsskzzsxxse',$event,'hjxse','hwjjgxllwmssk')})" v-text="thisData.hwjjgxllwmsskzzsxxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.hwjjgxllwmskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','hwjjgxllwmskjqtfpxse',$event,'hjxse','hwjjgxllwmssk')" @keydown.enter="(($event)=>{unfocus('table2','','','hwjjgxllwmskjqtfpxse',$event,'hjxse','hwjjgxllwmssk')})" v-text="thisData.hwjjgxllwmskjqtfpxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.hwjjgxllwmswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','hwjjgxllwmswkjfpxse',$event,'hjxse','hwjjgxllwmssk')" @keydown.enter="(($event)=>{unfocus('table2','','','hwjjgxllwmswkjfpxse',$event,'hjxse','hwjjgxllwmssk')})" v-text="thisData.hwjjgxllwmswkjfpxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.hwjjgxllwmshjxse.columnEdit==1" @blur="unfocus('table2','','','hwjjgxllwmshjxse',$event,'hjxse','hwjjgxllwmssk')" @keydown.enter="(($event)=>{unfocus('table2','','','hwjjgxllwmshjxse',$event,'hjxse','hwjjgxllwmssk')})" v-text="thisData.hwjjgxllwmshjxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td colspan="2" class="center">服务、不动产和无形资产</td>
						<td class="center">19</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.fwbdchwxzcmskjqtfpxse.columnEdit==1" @blur="unfocus('table2','','','fwbdchwxzcmskjqtfpxse',$event,'hjxse','fwbdchwxzcms')" @keydown.enter="(($event)=>{unfocus('table2','','','fwbdchwxzcmskjqtfpxse',$event,'hjxse','fwbdchwxzcms')})" v-text="thisData.fwbdchwxzcmskjqtfpxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.fwbdchwxzcmswkjfpxse.columnEdit==1" @blur="unfocus('table2','','','fwbdchwxzcmswkjfpxse',$event,'hjxse','fwbdchwxzcms')" @keydown.enter="(($event)=>{unfocus('table2','','','fwbdchwxzcmswkjfpxse',$event,'hjxse','fwbdchwxzcms')})" v-text="thisData.fwbdchwxzcmswkjfpxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.fwbdchwxzcmshjxse.columnEdit==1" @blur="unfocus('table2','','','fwbdchwxzcmshjxse',$event,'hjxse','fwbdchwxzcms')" @keydown.enter="(($event)=>{unfocus('table2','','','fwbdchwxzcmshjxse',$event,'hjxse','fwbdchwxzcms')})" v-text="thisData.fwbdchwxzcmshjxse.columnValue"></td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.fwbdchwxzcmshjjshj.columnEdit==1" @blur="unfocus('table2','','','fwbdchwxzcmshjjshj',$event,'hjxse','fwbdchwxzcms')" @keydown.enter="(($event)=>{unfocus('table2','','','fwbdchwxzcmshjjshj',$event,'hjxse','fwbdchwxzcms')})" v-text="thisData.fwbdchwxzcmshjjshj.columnValue"></td>
						<td class="center" :contenteditable="thisData.fwbdchwxzcmsfwbdchwxzckcxmbqsjkcje.columnEdit==1" @blur="unfocus('table2','','','fwbdchwxzcmsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','fwbdchwxzcms')" @keydown.enter="(($event)=>{unfocus('table2','','','fwbdchwxzcmsfwbdchwxzckcxmbqsjkcje',$event,'hjxse','fwbdchwxzcms')})" v-text="thisData.fwbdchwxzcmsfwbdchwxzckcxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.fwbdchwxzcmskchhsxse.columnEdit==1" @blur="unfocus('table2','','','fwbdchwxzcmskchhsxse',$event,'','fwbdchwxzcms')" @keydown.enter="(($event)=>{unfocus('table2','','','fwbdchwxzcmskchhsxse',$event,'','fwbdchwxzcms')})" v-text="thisData.fwbdchwxzcmskchhsxse.columnValue"></td>
						<td class="center">——</td>
					</tr>
				</table>
			</div>
			<div v-show="statusVaule=='一般纳税人附表二'">
				<table border="1 " width="100% " v-if="thisData.azsfgdbyxdkfs">
					<tr>
						<td colspan="5" class="center" style="font-weight: bold;padding: 0.05rem;">一、申报抵扣的进项税额</td>
					</tr>
					<tr>
						<td class="">项目</td>
						<td class="center" style="width:1.4rem">栏次</td>
						<td class="center">份数</td>
						<td class="center">金额</td>
						<td class="center">税额</td>
					</tr>
					<tr>
						<td>（一）认证相符的增值税专用发票</td>
						<td class="center">1=2+3</td>
						<td class="center" :contenteditable="thisData.rzxfzzszyfpsbdkfs.columnEdit==1" @blur="unfocus('table3','fs','','rzxfzzszyfpsbdkfs',$event,'dqsbdkjxsehj','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','rzxfzzszyfpsbdkfs',$event,'dqsbdkjxsehj','')})" v-text="thisData.rzxfzzszyfpsbdkfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.rzxfzzszyfpsbdkje.columnEdit==1" @blur="unfocus('table3','je','','rzxfzzszyfpsbdkje',$event,'dqsbdkjxsehj','')" @keydown.enter="(($event)=>{unfocus('table3','je','','rzxfzzszyfpsbdkje',$event,'dqsbdkjxsehj','')})" v-text="thisData.rzxfzzszyfpsbdkje.columnValue"></td>
						<td class="center" :contenteditable="thisData.rzxfzzszyfpsbdkse.columnEdit==1" @blur="unfocus('table3','se','','rzxfzzszyfpsbdkse',$event,'dqsbdkjxsehj','')" @keydown.enter="(($event)=>{unfocus('table3','se','','rzxfzzszyfpsbdkse',$event,'dqsbdkjxsehj','')})" v-text="thisData.rzxfzzszyfpsbdkse.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">其中：本期认证相符且本期申报抵扣</td>
						<td class="center">2</td>
						<td class="center" :contenteditable="thisData.bqrzxfqbqsbdkfs.columnEdit==1" @blur="unfocus('table3','fs','','bqrzxfqbqsbdkfs',$event,'rzxfzzszyfpsbdk','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','bqrzxfqbqsbdkfs',$event,'rzxfzzszyfpsbdk','')})" v-text="thisData.bqrzxfqbqsbdkfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqrzxfqbqsbdkje.columnEdit==1" @blur="unfocus('table3','je','','bqrzxfqbqsbdkje',$event,'rzxfzzszyfpsbdk','')" @keydown.enter="(($event)=>{unfocus('table3','je','','bqrzxfqbqsbdkje',$event,'rzxfzzszyfpsbdk','')})" v-text="thisData.bqrzxfqbqsbdkje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqrzxfqbqsbdkse.columnEdit==1" @blur="unfocus('table3','se','','bqrzxfqbqsbdkse',$event,'rzxfzzszyfpsbdk','')" @keydown.enter="(($event)=>{unfocus('table3','se','','bqrzxfqbqsbdkse',$event,'rzxfzzszyfpsbdk','')})" v-text="thisData.bqrzxfqbqsbdkse.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">前期认证相符且本期申报抵扣</td>
						<td class="center">3</td>
						<td class="center" :contenteditable="thisData.qqrzxfqbqsbdkfs.columnEdit==1" @blur="unfocus('table3','fs','','qqrzxfqbqsbdkfs',$event,'rzxfzzszyfpsbdk','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','qqrzxfqbqsbdkfs',$event,'rzxfzzszyfpsbdk','')})" v-text="thisData.qqrzxfqbqsbdkfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.qqrzxfqbqsbdkje.columnEdit==1" @blur="unfocus('table3','je','','qqrzxfqbqsbdkje',$event,'rzxfzzszyfpsbdk','')" @keydown.enter="(($event)=>{unfocus('table3','je','','qqrzxfqbqsbdkje',$event,'rzxfzzszyfpsbdk','')})" v-text="thisData.qqrzxfqbqsbdkje.columnValue"></td>
						<td class="center" :contenteditable="thisData.qqrzxfqbqsbdkse.columnEdit==1" @blur="unfocus('table3','se','','qqrzxfqbqsbdkse',$event,'rzxfzzszyfpsbdk','')" @keydown.enter="(($event)=>{unfocus('table3','se','','qqrzxfqbqsbdkse',$event,'rzxfzzszyfpsbdk','')})" v-text="thisData.qqrzxfqbqsbdkse.columnValue"></td>
					</tr>
					<tr>
						<td>（二）其他扣税凭证</td>
						<td class="center">4=5+6+7+8a+8b</td>
						<td class="center" :contenteditable="thisData.qtkspzfs.columnEdit==1" @blur="unfocus('table3','fs','','qtkspzfs',$event,'dqsbdkjxsehj','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','qtkspzfs',$event,'dqsbdkjxsehj','')})" v-text="thisData.qtkspzfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.qtkspzje.columnEdit==1" @blur="unfocus('table3','je','','qtkspzje',$event,'dqsbdkjxsehj','')" @keydown.enter="(($event)=>{unfocus('table3','je','','qtkspzje',$event,'dqsbdkjxsehj','')})" v-text="thisData.qtkspzje.columnValue"></td>
						<td class="center" :contenteditable="thisData.qtkspzse.columnEdit==1" @blur="unfocus('table3','se','','qtkspzse',$event,'dqsbdkjxsehj','')" @keydown.enter="(($event)=>{unfocus('table3','se','','qtkspzse',$event,'dqsbdkjxsehj','')})" v-text="thisData.qtkspzse.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">其中：海关进口增值税专用缴款书</td>
						<td class="center">5</td>
						<td class="center" :contenteditable="thisData.hgjkzzszyjksfs.columnEdit==1" @blur="unfocus('table3','fs','','hgjkzzszyjksfs',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','hgjkzzszyjksfs',$event,'qtkspz','')})" v-text="thisData.hgjkzzszyjksfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.hgjkzzszyjksje.columnEdit==1" @blur="unfocus('table3','je','','hgjkzzszyjksje',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table3','je','','hgjkzzszyjksje',$event,'qtkspz','')})" v-text="thisData.hgjkzzszyjksje.columnValue"></td>
						<td class="center" :contenteditable="thisData.hgjkzzszyjksse.columnEdit==1" @blur="unfocus('table3','se','','hgjkzzszyjksse',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table3','se','','hgjkzzszyjksse',$event,'qtkspz','')})" v-text="thisData.hgjkzzszyjksse.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">农产品收购发票或者销售发票</td>
						<td class="center">6</td>
						<td class="center" :contenteditable="thisData.ncpsgfphzxsfpfs.columnEdit==1" @blur="unfocus('table3','fs','','ncpsgfphzxsfpfs',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','ncpsgfphzxsfpfs',$event,'qtkspz','')})" v-text="thisData.ncpsgfphzxsfpfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.ncpsgfphzxsfpje.columnEdit==1" @blur="unfocus('table3','je','','ncpsgfphzxsfpje',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table3','je','','ncpsgfphzxsfpje',$event,'qtkspz','')})" v-text="thisData.ncpsgfphzxsfpje.columnValue"></td>
						<td class="center" :contenteditable="thisData.ncpsgfphzxsfpsbdkse.columnEdit==1" @blur="unfocus('table3','se','','ncpsgfphzxsfpsbdkse',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table3','se','','ncpsgfphzxsfpsbdkse',$event,'qtkspz','')})" v-text="thisData.ncpsgfphzxsfpsbdkse.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">代扣代缴税收缴款凭证</td>
						<td class="center">7</td>
						<td class="center" :contenteditable="thisData.dkdjssjkpzfs.columnEdit==1" @blur="unfocus('table3','fs','','dkdjssjkpzfs',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','dkdjssjkpzfs',$event,'qtkspz','')})" v-text="thisData.dkdjssjkpzfs.columnValue"></td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.dkdjssjkpzse.columnEdit==1" @blur="unfocus('table3','se','','dkdjssjkpzse',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table3','se','','dkdjssjkpzse',$event,'qtkspz','')})" v-text="thisData.dkdjssjkpzse.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">加计扣除农产品进项税额</td>
						<td class="center">8a</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.jjkcncpjxsese.columnEdit==1" @blur="unfocus('table3','se','','jjkcncpjxsese',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table3','se','','jjkcncpjxsese',$event,'qtkspz','')})" v-text="thisData.jjkcncpjxsese.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">其他</td>
						<td class="center">8b</td>
						<td class="center" :contenteditable="thisData.sbdkdjxseqtkspzqtfs.columnEdit==1" @blur="unfocus('table3','fs','','sbdkdjxseqtkspzqtfs',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','sbdkdjxseqtkspzqtfs',$event,'qtkspz','')})" v-text="thisData.sbdkdjxseqtkspzqtfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.sbdkdjxseqtkspzqtje.columnEdit==1" @blur="unfocus('table3','je','','sbdkdjxseqtkspzqtje',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table3','je','','sbdkdjxseqtkspzqtje',$event,'qtkspz','')})" v-text="thisData.sbdkdjxseqtkspzqtje.columnValue"></td>
						<td class="center" :contenteditable="thisData.sbdkdjxseqtkspzqtse.columnEdit==1" @blur="unfocus('table3','se','','sbdkdjxseqtkspzqtse',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table3','se','','sbdkdjxseqtkspzqtse',$event,'qtkspz','')})" v-text="thisData.sbdkdjxseqtkspzqtse.columnValue"></td>
					</tr>
					<tr>
						<td>（三）本期用于购建不动产的扣税凭证</td>
						<td class="center">9</td>
						<td class="center" :contenteditable="thisData.bqgjbdckspzfs.columnEdit==1" @blur="unfocus('table3','fs','','bqgjbdckspzfs',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','bqgjbdckspzfs',$event,'','')})" v-text="thisData.bqgjbdckspzfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqgjbdckspzje.columnEdit==1" @blur="unfocus('table3','je','','bqgjbdckspzje',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','je','','bqgjbdckspzje',$event,'','')})" v-text="thisData.bqgjbdckspzje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqgjbdckspzse.columnEdit==1" @blur="unfocus('table3','se','','bqgjbdckspzse',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','se','','bqgjbdckspzse',$event,'','')})" v-text="thisData.bqgjbdckspzse.columnValue"></td>
					</tr>
					<tr>
						<td>（四）本期用于抵扣的旅客运输服务扣税凭证</td>
						<td class="center">10</td>
						<td class="center" :contenteditable="thisData.bqyydkdlkysfwkspzfs.columnEdit==1" @blur="unfocus('table3','fs','','bqyydkdlkysfwkspzfs',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','bqyydkdlkysfwkspzfs',$event,'','')})" v-text="thisData.bqyydkdlkysfwkspzfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqyydkdlkysfwkspzje.columnEdit==1" @blur="unfocus('table3','je','','bqyydkdlkysfwkspzje',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','je','','bqyydkdlkysfwkspzje',$event,'','')})" v-text="thisData.bqyydkdlkysfwkspzje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqyydkdlkysfwkspzse.columnEdit==1" @blur="unfocus('table3','se','','bqyydkdlkysfwkspzse',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','se','','bqyydkdlkysfwkspzse',$event,'','')})" v-text="thisData.bqyydkdlkysfwkspzse.columnValue"></td>
					</tr>
					<tr>
						<td>（五）外贸企业进项税额抵扣证明</td>
						<td class="center">11</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.wmqyjxsdkzmse.columnEdit==1" @blur="unfocus('table3','se','','wmqyjxsdkzmse',$event,'dqsbdkjxsehj','')" @keydown.enter="(($event)=>{unfocus('table3','se','','wmqyjxsdkzmse',$event,'dqsbdkjxsehj','')})" v-text="thisData.wmqyjxsdkzmse.columnValue"></td>
					</tr>
					<tr>
						<td>当期申报抵扣进项税额合计</td>
						<td class="center">12=1+4+11</td>
						<td class="center" :contenteditable="thisData.dqsbdkjxsehjfs.columnEdit==1" @blur="unfocus('table3','fs','','dqsbdkjxsehjfs',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','dqsbdkjxsehjfs',$event,'','')})" v-text="thisData.dqsbdkjxsehjfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.dqsbdkjxsehjje.columnEdit==1" @blur="unfocus('table3','je','','dqsbdkjxsehjje',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','je','','dqsbdkjxsehjje',$event,'','')})" v-text="thisData.dqsbdkjxsehjje.columnValue"></td>
						<td class="center" :contenteditable="thisData.dqsbdkjxsehjse.columnEdit==1" @blur="unfocus('table3','se','','dqsbdkjxsehjse',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','se','','dqsbdkjxsehjse',$event,'','')})" v-text="thisData.dqsbdkjxsehjse.columnValue"></td>
					</tr>
					<tr>
						<td colspan="5" class="center" style="font-weight: bold;padding: 0.05rem;">二、进项税额转出额</td>
					</tr>
					<tr>
						<td class="">项目</td>
						<td class="center">栏次</td>
						<td colspan="3" class="center">税额</td>
					</tr>
					<tr>
						<td>本期进项税额转出额</td>
						<td class="center">13=14至23之和</td>
						<td colspan="3" class="center" :contenteditable="thisData.bqjxszcese.columnEdit==1" @blur="unfocus('table3','se','','bqjxszcese',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','se','','bqjxszcese',$event,'','')})" v-text="thisData.bqjxszcese.columnValue"></td>
					</tr>
					<tr>
						<td>其中：免税项目用</td>
						<td class="center">14</td>
						<td colspan="3" class="center" :contenteditable="thisData.msxmyse.columnEdit==1" @blur="unfocus('table3','se','','msxmyse',$event,'bqjxszce','')" @keydown.enter="(($event)=>{unfocus('table3','se','','msxmyse',$event,'bqjxszce','')})" v-text="thisData.msxmyse.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">集体福利、个人消费</td>
						<td class="center">15</td>
						<td colspan="3" class="center" :contenteditable="thisData.jtflgrxfse.columnEdit==1" @blur="unfocus('table3','se','','jtflgrxfse',$event,'bqjxszce','')" @keydown.enter="(($event)=>{unfocus('table3','se','','jtflgrxfse',$event,'bqjxszce','')})" v-text="thisData.jtflgrxfse.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">非正常损失</td>
						<td class="center">16</td>
						<td colspan="3" class="center" :contenteditable="thisData.fzcssse.columnEdit==1" @blur="unfocus('table3','se','','fzcssse',$event,'bqjxszce','')" @keydown.enter="(($event)=>{unfocus('table3','se','','fzcssse',$event,'bqjxszce','')})" v-text="thisData.fzcssse.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">简易计税方法征税项目用</td>
						<td class="center">17</td>
						<td colspan="3" class="center" :contenteditable="thisData.jyjsbfzsxmyse.columnEdit==1" @blur="unfocus('table3','se','','jyjsbfzsxmyse',$event,'bqjxszce','')" @keydown.enter="(($event)=>{unfocus('table3','se','','jyjsbfzsxmyse',$event,'bqjxszce','')})" v-text="thisData.jyjsbfzsxmyse.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">免抵退税办法不得抵扣的进项税额</td>
						<td class="center">18</td>
						<td colspan="3" class="center" :contenteditable="thisData.mdtsbfbddkdjxsese.columnEdit==1" @blur="unfocus('table3','se','','mdtsbfbddkdjxsese',$event,'bqjxszce','')" @keydown.enter="(($event)=>{unfocus('table3','se','','mdtsbfbddkdjxsese',$event,'bqjxszce','')})" v-text="thisData.mdtsbfbddkdjxsese.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">纳税检查调减进项税额</td>
						<td class="center">19</td>
						<td colspan="3" class="center" :contenteditable="thisData.nsjctjjxsese.columnEdit==1" @blur="unfocus('table3','se','','nsjctjjxsese',$event,'bqjxszce','')" @keydown.enter="(($event)=>{unfocus('table3','se','','nsjctjjxsese',$event,'bqjxszce','')})" v-text="thisData.nsjctjjxsese.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">红字专用发票信息表注明的进项税额</td>
						<td class="center">20</td>
						<td colspan="3" class="center" :contenteditable="thisData.hzzyfptzdzmdjxsese.columnEdit==1" @blur="unfocus('table3','se','','hzzyfptzdzmdjxsese',$event,'bqjxszce','')" @keydown.enter="(($event)=>{unfocus('table3','se','','hzzyfptzdzmdjxsese',$event,'bqjxszce','')})" v-text="thisData.hzzyfptzdzmdjxsese.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">上期留抵税额抵减欠税</td>
						<td class="center">21</td>
						<td colspan="3" class="center" :contenteditable="thisData.sqldsedjqsse.columnEdit==1" @blur="unfocus('table3','se','','sqldsedjqsse',$event,'bqjxszce','')" @keydown.enter="(($event)=>{unfocus('table3','se','','sqldsedjqsse',$event,'bqjxszce','')})" v-text="thisData.sqldsedjqsse.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">上期留抵税额退税</td>
						<td class="center">22</td>
						<td colspan="3" class="center" :contenteditable="thisData.sqldsetsse.columnEdit==1" @blur="unfocus('table3','se','','sqldsetsse',$event,'bqjxszce','')" @keydown.enter="(($event)=>{unfocus('table3','se','','sqldsetsse',$event,'bqjxszce','')})" v-text="thisData.sqldsetsse.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">其他应作进项税额转出的情形</td>
						<td class="center">23</td>
						<td colspan="3" class="center" :contenteditable="thisData.qtyzjxsezcdqxse.columnEdit==1" @blur="unfocus('table3','se','','qtyzjxsezcdqxse',$event,'bqjxszce','')" @keydown.enter="(($event)=>{unfocus('table3','se','','qtyzjxsezcdqxse',$event,'bqjxszce','')})" v-text="thisData.qtyzjxsezcdqxse.columnValue"></td>
					</tr>
					<tr>
						<td colspan="5" class="center" style="font-weight: bold;padding: 0.05rem;">三、待抵扣进项税额</td>
					</tr>
					<tr>
						<td class="">项目</td>
						<td class="center">栏次</td>
						<td class="center">份数</td>
						<td class="center">金额</td>
						<td class="center">税额</td>
					</tr>
					<tr>
						<td class="">（一）认证相符的增值税专用发票</td>
						<td class="center">24</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td class=" padL">期初已认证相符但未申报抵扣</td>
						<td class="center">25</td>
						<td class="center" :contenteditable="thisData.qcyrzxfqbqwsbdkfs.columnEdit==1" @blur="unfocus('table3','fs','','qcyrzxfqbqwsbdkfs',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','qcyrzxfqbqwsbdkfs',$event,'','')})" v-text="thisData.qcyrzxfqbqwsbdkfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.qcyrzxfqbqwsbdkje.columnEdit==1" @blur="unfocus('table3','je','','qcyrzxfqbqwsbdkje',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','je','','qcyrzxfqbqwsbdkje',$event,'','')})" v-text="thisData.qcyrzxfqbqwsbdkje.columnValue"></td>
						<td class="center" :contenteditable="thisData.qcyrzxfqbqwsbdkse.columnEdit==1" @blur="unfocus('table3','se','','qcyrzxfqbqwsbdkse',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','se','','qcyrzxfqbqwsbdkse',$event,'','')})" v-text="thisData.qcyrzxfqbqwsbdkse.columnValue"></td>
					</tr>
					<tr>
						<td class=" padL">本期认证相符且本期未申报抵扣</td>
						<td class="center">26</td>
						<td class="center" :contenteditable="thisData.bqrzxfqbqwsbdkfs.columnEdit==1" @blur="unfocus('table3','fs','','bqrzxfqbqwsbdkfs',$event,'bqrzxfdskzzszyfp','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','bqrzxfqbqwsbdkfs',$event,'','')})" v-text="thisData.bqrzxfqbqwsbdkfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqrzxfqbqwsbdkje.columnEdit==1" @blur="unfocus('table3','je','','bqrzxfqbqwsbdkje',$event,'bqrzxfdskzzszyfp','')" @keydown.enter="(($event)=>{unfocus('table3','je','','bqrzxfqbqwsbdkje',$event,'','')})" v-text="thisData.bqrzxfqbqwsbdkje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqrzxfqbqwsbdkse.columnEdit==1" @blur="unfocus('table3','se','','bqrzxfqbqwsbdkse',$event,'bqrzxfdskzzszyfp','')" @keydown.enter="(($event)=>{unfocus('table3','se','','bqrzxfqbqwsbdkse',$event,'','')})" v-text="thisData.bqrzxfqbqwsbdkse.columnValue"></td>
					</tr>
					<tr>
						<td class=" padL">期末已认证相符但未申报抵扣</td>
						<td class="center">27</td>
						<td class="center" :contenteditable="thisData.qmyrzxfdwsbdkfs.columnEdit==1" @blur="unfocus('table3','fs','','qmyrzxfdwsbdkfs',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','qmyrzxfdwsbdkfs',$event,'','')})" v-text="thisData.qmyrzxfdwsbdkfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.qmyrzxfdwsbdkje.columnEdit==1" @blur="unfocus('table3','je','','qmyrzxfdwsbdkje',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','je','','qmyrzxfdwsbdkje',$event,'','')})" v-text="thisData.qmyrzxfdwsbdkje.columnValue"></td>
						<td class="center" :contenteditable="thisData.qmyrzxfdwsbdkse.columnEdit==1" @blur="unfocus('table3','se','','qmyrzxfdwsbdkse',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','se','','qmyrzxfdwsbdkse',$event,'','')})" v-text="thisData.qmyrzxfdwsbdkse.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">其中：按照税法规定不允许抵扣</td>
						<td class="center">28</td>
						<td class="center" :contenteditable="thisData.azsfgdbyxdkfs.columnEdit==1" @blur="unfocus('table3','fs','','azsfgdbyxdkfs',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','azsfgdbyxdkfs',$event,'','')})" v-text="thisData.azsfgdbyxdkfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.azsfgdbyxdkje.columnEdit==1" @blur="unfocus('table3','je','','azsfgdbyxdkje',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','je','','azsfgdbyxdkje',$event,'','')})" v-text="thisData.azsfgdbyxdkje.columnValue"></td>
						<td class="center" :contenteditable="thisData.azsfgdbyxdkse.columnEdit==1" @blur="unfocus('table3','se','','azsfgdbyxdkse',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','se','','azsfgdbyxdkse',$event,'','')})" v-text="thisData.azsfgdbyxdkse.columnValue"></td>
					</tr>
					<tr>
						<td>（二）其他扣税凭证</td>
						<td class="center">29=30至33之和</td>
						<td class="center" :contenteditable="thisData.qtkspzddkjxsefs.columnEdit==1" @blur="unfocus('table3','fs','','qtkspzddkjxsefs',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','qtkspzddkjxsefs',$event,'','')})" v-text="thisData.qtkspzddkjxsefs.columnValue"></td>
						<td class="center" :contenteditable="thisData.qtkspzddkjxseje.columnEdit==1" @blur="unfocus('table3','je','','qtkspzddkjxseje',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','je','','qtkspzddkjxseje',$event,'','')})" v-text="thisData.qtkspzddkjxseje.columnValue"></td>
						<td class="center" :contenteditable="thisData.qtkspzddkjxsese.columnEdit==1" @blur="unfocus('table3','se','','qtkspzddkjxsese',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','se','','qtkspzddkjxsese',$event,'','')})" v-text="thisData.qtkspzddkjxsese.columnValue"></td>
					</tr>
					<tr>
						<td>其中：海关进口增值税专用缴款书</td>
						<td class="center">30</td>
						<td class="center" :contenteditable="thisData.hgjkzzszyxsfpfs.columnEdit==1" @blur="unfocus('table3','fs','','hgjkzzszyxsfpfs',$event,'qtkspzddkjxse','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','hgjkzzszyxsfpfs',$event,'qtkspzddkjxse','')})" v-text="thisData.hgjkzzszyxsfpfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.hgjkzzszyxsfpje.columnEdit==1" @blur="unfocus('table3','je','','hgjkzzszyxsfpje',$event,'qtkspzddkjxse','')" @keydown.enter="(($event)=>{unfocus('table3','je','','hgjkzzszyxsfpje',$event,'qtkspzddkjxse','')})" v-text="thisData.hgjkzzszyxsfpje.columnValue"></td>
						<td class="center" :contenteditable="thisData.hgjkzzszyxsfpse.columnEdit==1" @blur="unfocus('table3','se','','hgjkzzszyxsfpse',$event,'qtkspzddkjxse','')" @keydown.enter="(($event)=>{unfocus('table3','se','','hgjkzzszyxsfpse',$event,'qtkspzddkjxse','')})" v-text="thisData.hgjkzzszyxsfpse.columnValue"></td>
					</tr>
					<tr>
						<td>农产品收购发票或者销售发票</td>
						<td class="center">31</td>
						<td class="center" :contenteditable="thisData.ncpsgfphzxsfpddkfs.columnEdit==1" @blur="unfocus('table3','fs','','ncpsgfphzxsfpddkfs',$event,'qtkspzddkjxse','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','ncpsgfphzxsfpddkfs',$event,'qtkspzddkjxse','')})" v-text="thisData.ncpsgfphzxsfpddkfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.ncpsgfphzxsfpddkje.columnEdit==1" @blur="unfocus('table3','je','','ncpsgfphzxsfpddkje',$event,'qtkspzddkjxse','')" @keydown.enter="(($event)=>{unfocus('table3','je','','ncpsgfphzxsfpddkje',$event,'qtkspzddkjxse','')})" v-text="thisData.ncpsgfphzxsfpddkje.columnValue"></td>
						<td class="center" :contenteditable="thisData.ncpsgfphzxsfpse.columnEdit==1" @blur="unfocus('table3','se','','ncpsgfphzxsfpse',$event,'qtkspzddkjxse','')" @keydown.enter="(($event)=>{unfocus('table3','se','','ncpsgfphzxsfpse',$event,'qtkspzddkjxse','')})" v-text="thisData.ncpsgfphzxsfpse.columnValue"></td>
					</tr>
					<tr>
						<td>代扣代缴税收缴款凭证</td>
						<td class="center">32</td>
						<td class="center" :contenteditable="thisData.ddkdkdjskpzfs.columnEdit==1" @blur="unfocus('table3','fs','','ddkdkdjskpzfs',$event,'qtkspzddkjxse','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','ddkdkdjskpzfs',$event,'qtkspzddkjxse','')})" v-text="thisData.ddkdkdjskpzfs.columnValue"></td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.ddkdkdjskpzse.columnEdit==1" @blur="unfocus('table3','se','','ddkdkdjskpzse',$event,'qtkspzddkjxse','')" @keydown.enter="(($event)=>{unfocus('table3','se','','ddkdkdjskpzse',$event,'qtkspzddkjxse','')})" v-text="thisData.ddkdkdjskpzse.columnValue"></td>
					</tr>
					<tr>
						<td>其他</td>
						<td class="center">33</td>
						<td class="center" :contenteditable="thisData.ddkjxseqtkkpzqtfs.columnEdit==1" @blur="unfocus('table3','fs','','ddkjxseqtkkpzqtfs',$event,'qtkspzddkjxse','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','ddkjxseqtkkpzqtfs',$event,'qtkspzddkjxse','')})" v-text="thisData.ddkjxseqtkkpzqtfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.ddkjxseqtkkpzqtje.columnEdit==1" @blur="unfocus('table3','je','','ddkjxseqtkkpzqtje',$event,'qtkspzddkjxse','')" @keydown.enter="(($event)=>{unfocus('table3','je','','ddkjxseqtkkpzqtje',$event,'qtkspzddkjxse','')})" v-text="thisData.ddkjxseqtkkpzqtje.columnValue"></td>
						<td class="center" :contenteditable="thisData.ddkjxseqtkkpzqtse.columnEdit==1" @blur="unfocus('table3','se','','ddkjxseqtkkpzqtse',$event,'qtkspzddkjxse','')" @keydown.enter="(($event)=>{unfocus('table3','se','','ddkjxseqtkkpzqtse',$event,'qtkspzddkjxse','')})" v-text="thisData.ddkjxseqtkkpzqtse.columnValue"></td>
					</tr>
					<tr>
						<td class=""></td>
						<td class="center">34</td>
						<td class="center"></td>
						<td class="center"></td>
						<td class="center"></td>
					</tr>
					<tr>
						<td colspan="5" class="center" style="font-weight: bold;padding: 0.05rem;">四、其他</td>
					</tr>
					<tr>
						<td class="">项目</td>
						<td class="center">栏次</td>
						<td class="center">份数</td>
						<td class="center">金额</td>
						<td class="center">税额</td>
					</tr>
					<tr>
						<td>本期认证相符的增值税专用发票</td>
						<td class="center">35=1+26</td>
						<td class="center" :contenteditable="thisData.bqrzxfdskzzszyfpfs.columnEdit==1" @blur="unfocus('table3','fs','','bqrzxfdskzzszyfpfs',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','fs','','bqrzxfdskzzszyfpfs',$event,'','')})" v-text="thisData.bqrzxfdskzzszyfpfs.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqrzxfdskzzszyfpje.columnEdit==1" @blur="unfocus('table3','je','','bqrzxfdskzzszyfpje',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','je','','bqrzxfdskzzszyfpje',$event,'','')})" v-text="thisData.bqrzxfdskzzszyfpje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqrzxfdskzzszyfpse.columnEdit==1" @blur="unfocus('table3','se','','bqrzxfdskzzszyfpse',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','se','','bqrzxfdskzzszyfpse',$event,'','')})" v-text="thisData.bqrzxfdskzzszyfpse.columnValue"></td>
					</tr>
					<tr>
						<td>代扣代缴税额</td>
						<td class="center">36</td>
						<td class="center">——</td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.dkdjsese.columnEdit==1" @blur="unfocus('table3','se','','dkdjsese',$event,'','')" @keydown.enter="(($event)=>{unfocus('table3','se','','dkdjsese',$event,'','')})" v-text="thisData.dkdjsese.columnValue"></td>
					</tr>
				</table>
			</div>
			<div v-show="statusVaule=='一般纳税人附表三'">
				<table border="1 " width="100% " v-if="thisData.bfz13sldxmhje">
					<tr>
						<td colspan="2" rowspan="3" class="center">项目及栏次</td>
						<td rowspan="2" class="center">本期服务、不动产和无形资产价税合计额（免税销售额） </td>
						<td colspan="5" class="center">服务、不动产和无形资产扣除项目</td>
					</tr>
					<tr>
						<td class="center">期初余额</td>
						<td class="center">本期发生额</td>
						<td class="center">本期应扣除金额</td>
						<td class="center">本期实际扣除金额</td>
						<td class="center">期末余额</td>
					</tr>
					<tr>
						<td class="center">1</td>
						<td class="center">2</td>
						<td class="center">3</td>
						<td class="center">4=2+3</td>
						<td class="center">5(5≤1且5≤4)</td>
						<td class="center">6=4-5</td>
					</tr>
					<tr>
						<td class="center">13%税率的项目</td>
						<td class="center">1</td>
						<td class="center" :contenteditable="thisData.bfz13sldxmhje.columnEdit==1" @blur="unfocus('table7','','','bfz13sldxmhje',$event,'','bfz13sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz13sldxmhje',$event,'','bfz13sldxm')})" v-text="thisData.bfz13sldxmhje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13sldxmqcye.columnEdit==1" @blur="unfocus('table7','','','bfz13sldxmqcye',$event,'calchj','bfz13sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz13sldxmqcye',$event,'calchj','bfz13sldxm')})" v-text="thisData.bfz13sldxmqcye.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13sldxmbqfse.columnEdit==1" @blur="unfocus('table7','','','bfz13sldxmbqfse',$event,'calchj','bfz13sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz13sldxmbqfse',$event,'calchj','bfz13sldxm')})" v-text="thisData.bfz13sldxmbqfse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13sldxmbqykcje.columnEdit==1" @blur="unfocus('table7','','','bfz13sldxmbqykcje',$event,'calchj','bfz13sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz13sldxmbqykcje',$event,'calchj','bfz13sldxm')})" v-text="thisData.bfz13sldxmbqykcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13sldxmbqsjkcje.columnEdit==1" @blur="unfocus('table7','','','bfz13sldxmbqsjkcje',$event,'calchj','bfz13sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz13sldxmbqsjkcje',$event,'calchj','bfz13sldxm')})" v-text="thisData.bfz13sldxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz13sldxmqmye.columnEdit==1" @blur="unfocus('table7','','','bfz13sldxmqmye',$event,'','bfz13sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz13sldxmqmye',$event,'','bfz13sldxm')})" v-text="thisData.bfz13sldxmqmye.columnValue"></td>
					</tr>
					<tr>
						<td class="center">9%税率的项目</td>
						<td class="center">2</td>
						<td class="center" :contenteditable="thisData.bfz9sldxmhje.columnEdit==1" @blur="unfocus('table7','','','bfz9sldxmhje',$event,'','bfz9sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz9sldxmhje',$event,'','bfz9sldxm')})" v-text="thisData.bfz9sldxmhje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9sldxmqcye.columnEdit==1" @blur="unfocus('table7','','','bfz9sldxmqcye',$event,'calchj','bfz9sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz9sldxmqcye',$event,'calchj','bfz9sldxm')})" v-text="thisData.bfz9sldxmqcye.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9sldxmbqfse.columnEdit==1" @blur="unfocus('table7','','','bfz9sldxmbqfse',$event,'calchj','bfz9sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz9sldxmbqfse',$event,'calchj','bfz9sldxm')})" v-text="thisData.bfz9sldxmbqfse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9sldxmbqykcje.columnEdit==1" @blur="unfocus('table7','','','bfz9sldxmbqykcje',$event,'calchj','bfz9sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz9sldxmbqykcje',$event,'calchj','bfz9sldxm')})" v-text="thisData.bfz9sldxmbqykcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9sldxmbqsjkcje.columnEdit==1" @blur="unfocus('table7','','','bfz9sldxmbqsjkcje',$event,'calchj','bfz9sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz9sldxmbqsjkcje',$event,'calchj','bfz9sldxm')})" v-text="thisData.bfz9sldxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz9sldxmqmye.columnEdit==1" @blur="unfocus('table7','','','bfz9sldxmqmye',$event,'','bfz9sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz9sldxmqmye',$event,'','bfz9sldxm')})" v-text="thisData.bfz9sldxmqmye.columnValue"></td>
					</tr>
					<tr>
						<td class="center">6%税率的项目（不含金融商品转让）</td>
						<td class="center">3</td>
						<td class="center" :contenteditable="thisData.bfz6sldxmhje.columnEdit==1" @blur="unfocus('table7','','','bfz6sldxmhje',$event,'','bfz6sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz6sldxmhje',$event,'','bfz6sldxm')})" v-text="thisData.bfz6sldxmhje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6sldxmqcye.columnEdit==1" @blur="unfocus('table7','','','bfz6sldxmqcye',$event,'calchj','bfz6sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz6sldxmqcye',$event,'calchj','bfz6sldxm')})" v-text="thisData.bfz6sldxmqcye.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6sldxmbqfse.columnEdit==1" @blur="unfocus('table7','','','bfz6sldxmbqfse',$event,'calchj','bfz6sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz6sldxmbqfse',$event,'calchj','bfz6sldxm')})" v-text="thisData.bfz6sldxmbqfse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6sldxmbqykcje.columnEdit==1" @blur="unfocus('table7','','','bfz6sldxmbqykcje',$event,'calchj','bfz6sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz6sldxmbqykcje',$event,'calchj','bfz6sldxm')})" v-text="thisData.bfz6sldxmbqykcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6sldxmbqsjkcje.columnEdit==1" @blur="unfocus('table7','','','bfz6sldxmbqsjkcje',$event,'calchj','bfz6sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz6sldxmbqsjkcje',$event,'calchj','bfz6sldxm')})" v-text="thisData.bfz6sldxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6sldxmqmye.columnEdit==1" @blur="unfocus('table7','','','bfz6sldxmqmye',$event,'','bfz6sldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz6sldxmqmye',$event,'','bfz6sldxm')})" v-text="thisData.bfz6sldxmqmye.columnValue"></td>
					</tr>
					<tr>
						<td class="center">6%税率的金融商品转让项目</td>
						<td class="center">4</td>
						<td class="center" :contenteditable="thisData.bfz6sldjrspzrxmhje.columnEdit==1" @blur="unfocus('table7','','','bfz6sldjrspzrxmhje',$event,'','bfz6sldjrspzrxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz6sldjrspzrxmhje',$event,'','bfz6sldjrspzrxm')})" v-text="thisData.bfz6sldjrspzrxmhje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6sldjrspzrxmqcye.columnEdit==1" @blur="unfocus('table7','','','bfz6sldjrspzrxmqcye',$event,'calchj','bfz6sldjrspzrxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz6sldjrspzrxmqcye',$event,'calchj','bfz6sldjrspzrxm')})" v-text="thisData.bfz6sldjrspzrxmqcye.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6sldjrspzrxmbqfse.columnEdit==1" @blur="unfocus('table7','','','bfz6sldjrspzrxmbqfse',$event,'calchj','bfz6sldjrspzrxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz6sldjrspzrxmbqfse',$event,'calchj','bfz6sldjrspzrxm')})" v-text="thisData.bfz6sldjrspzrxmbqfse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6sldjrspzrxmbqykcje.columnEdit==1" @blur="unfocus('table7','','','bfz6sldjrspzrxmbqykcje',$event,'calchj','bfz6sldjrspzrxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz6sldjrspzrxmbqykcje',$event,'calchj','bfz6sldjrspzrxm')})" v-text="thisData.bfz6sldjrspzrxmbqykcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6sldjrspzrxmbqsjkcje.columnEdit==1" @blur="unfocus('table7','','','bfz6sldjrspzrxmbqsjkcje',$event,'calchj','bfz6sldjrspzrxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz6sldjrspzrxmbqsjkcje',$event,'calchj','bfz6sldjrspzrxm')})" v-text="thisData.bfz6sldjrspzrxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz6sldjrspzrxmqmye.columnEdit==1" @blur="unfocus('table7','','','bfz6sldjrspzrxmqmye',$event,'','bfz6sldjrspzrxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz6sldjrspzrxmqmye',$event,'','bfz6sldjrspzrxm')})" v-text="thisData.bfz6sldjrspzrxmqmye.columnValue"></td>
					</tr>
					<tr>
						<td class="center">5%征收率的项目</td>
						<td class="center">5</td>
						<td class="center" :contenteditable="thisData.bfz5zsldxmhje.columnEdit==1" @blur="unfocus('table7','','','bfz5zsldxmhje',$event,'','bfz5zsldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz5zsldxmhje',$event,'','bfz5zsldxm')})" v-text="thisData.bfz5zsldxmhje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5zsldxmqcye.columnEdit==1" @blur="unfocus('table7','','','bfz5zsldxmqcye',$event,'calchj','bfz5zsldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz5zsldxmqcye',$event,'calchj','bfz5zsldxm')})" v-text="thisData.bfz5zsldxmqcye.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5zsldxmbqfse.columnEdit==1" @blur="unfocus('table7','','','bfz5zsldxmbqfse',$event,'calchj','bfz5zsldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz5zsldxmbqfse',$event,'calchj','bfz5zsldxm')})" v-text="thisData.bfz5zsldxmbqfse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5zsldxmbqykcje.columnEdit==1" @blur="unfocus('table7','','','bfz5zsldxmbqykcje',$event,'calchj','bfz5zsldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz5zsldxmbqykcje',$event,'calchj','bfz5zsldxm')})" v-text="thisData.bfz5zsldxmbqykcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5zsldxmbqsjkcje.columnEdit==1" @blur="unfocus('table7','','','bfz5zsldxmbqsjkcje',$event,'calchj','bfz5zsldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz5zsldxmbqsjkcje',$event,'calchj','bfz5zsldxm')})" v-text="thisData.bfz5zsldxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz5zsldxmqmye.columnEdit==1" @blur="unfocus('table7','','','bfz5zsldxmqmye',$event,'','bfz5zsldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz5zsldxmqmye',$event,'','bfz5zsldxm')})" v-text="thisData.bfz5zsldxmqmye.columnValue"></td>
					</tr>
					<tr>
						<td class="center">3%征收率的项目</td>
						<td class="center">6</td>
						<td class="center" :contenteditable="thisData.bfz3zsldxmhje.columnEdit==1" @blur="unfocus('table7','','','bfz3zsldxmhje',$event,'','bfz3zsldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz3zsldxmhje',$event,'','bfz3zsldxm')})" v-text="thisData.bfz3zsldxmhje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3zsldxmqcye.columnEdit==1" @blur="unfocus('table7','','','bfz3zsldxmqcye',$event,'calchj','bfz3zsldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz3zsldxmqcye',$event,'calchj','bfz3zsldxm')})" v-text="thisData.bfz3zsldxmqcye.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3zsldxmbqfse.columnEdit==1" @blur="unfocus('table7','','','bfz3zsldxmbqfse',$event,'calchj','bfz3zsldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz3zsldxmbqfse',$event,'calchj','bfz3zsldxm')})" v-text="thisData.bfz3zsldxmbqfse.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3zsldxmbqykcje.columnEdit==1" @blur="unfocus('table7','','','bfz3zsldxmbqykcje',$event,'calchj','bfz3zsldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz3zsldxmbqykcje',$event,'calchj','bfz3zsldxm')})" v-text="thisData.bfz3zsldxmbqykcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3zsldxmbqsjkcje.columnEdit==1" @blur="unfocus('table7','','','bfz3zsldxmbqsjkcje',$event,'calchj','bfz3zsldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz3zsldxmbqsjkcje',$event,'calchj','bfz3zsldxm')})" v-text="thisData.bfz3zsldxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.bfz3zsldxmqmye.columnEdit==1" @blur="unfocus('table7','','','bfz3zsldxmqmye',$event,'','bfz3zsldxm')" @keydown.enter="(($event)=>{unfocus('table7','','','bfz3zsldxmqmye',$event,'','bfz3zsldxm')})" v-text="thisData.bfz3zsldxmqmye.columnValue"></td>
					</tr>
					<tr>
						<td class="center">免抵退税的项目</td>
						<td class="center">7</td>
						<td class="center" :contenteditable="thisData.mdtsdxmhje.columnEdit==1" @blur="unfocus('table7','','','mdtsdxmhje',$event,'','mdtsdxm')" @keydown.enter="(($event)=>{unfocus('table7','','','mdtsdxmhje',$event,'','mdtsdxm')})" v-text="thisData.mdtsdxmhje.columnValue"></td>
						<td class="center" :contenteditable="thisData.mdtsdxmqcye.columnEdit==1" @blur="unfocus('table7','','','mdtsdxmqcye',$event,'calchj','mdtsdxm')" @keydown.enter="(($event)=>{unfocus('table7','','','mdtsdxmqcye',$event,'calchj','mdtsdxm')})" v-text="thisData.mdtsdxmqcye.columnValue"></td>
						<td class="center" :contenteditable="thisData.mdtsdxmbqfse.columnEdit==1" @blur="unfocus('table7','','','mdtsdxmbqfse',$event,'calchj','mdtsdxm')" @keydown.enter="(($event)=>{unfocus('table7','','','mdtsdxmbqfse',$event,'calchj','mdtsdxm')})" v-text="thisData.mdtsdxmbqfse.columnValue"></td>
						<td class="center" :contenteditable="thisData.mdtsdxmbqykcje.columnEdit==1" @blur="unfocus('table7','','','mdtsdxmbqykcje',$event,'calchj','mdtsdxm')" @keydown.enter="(($event)=>{unfocus('table7','','','mdtsdxmbqykcje',$event,'calchj','mdtsdxm')})" v-text="thisData.mdtsdxmbqykcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.mdtsdxmbqsjkcje.columnEdit==1" @blur="unfocus('table7','','','mdtsdxmbqsjkcje',$event,'calchj','mdtsdxm')" @keydown.enter="(($event)=>{unfocus('table7','','','mdtsdxmbqsjkcje',$event,'calchj','mdtsdxm')})" v-text="thisData.mdtsdxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.mdtsdxmqmye.columnEdit==1" @blur="unfocus('table7','','','mdtsdxmqmye',$event,'','mdtsdxm')" @keydown.enter="(($event)=>{unfocus('table7','','','mdtsdxmqmye',$event,'','mdtsdxm')})" v-text="thisData.mdtsdxmqmye.columnValue"></td>
					</tr>
					<tr>
						<td class="center">免税的项目</td>
						<td class="center">8</td>
						<td class="center" :contenteditable="thisData.msdxmhje.columnEdit==1" @blur="unfocus('table7','','','msdxmhje',$event,'','msdxm')" @keydown.enter="(($event)=>{unfocus('table7','','','msdxmhje',$event,'','msdxm')})" v-text="thisData.msdxmhje.columnValue"></td>
						<td class="center" :contenteditable="thisData.msdxmqcye.columnEdit==1" @blur="unfocus('table7','','','msdxmqcye',$event,'calchj','msdxm')" @keydown.enter="(($event)=>{unfocus('table7','','','msdxmqcye',$event,'calchj','msdxm')})" v-text="thisData.msdxmqcye.columnValue"></td>
						<td class="center" :contenteditable="thisData.msdxmbqfse.columnEdit==1" @blur="unfocus('table7','','','msdxmbqfse',$event,'calchj','msdxm')" @keydown.enter="(($event)=>{unfocus('table7','','','msdxmbqfse',$event,'calchj','msdxm')})" v-text="thisData.msdxmbqfse.columnValue"></td>
						<td class="center" :contenteditable="thisData.msdxmbqykcje.columnEdit==1" @blur="unfocus('table7','','','msdxmbqykcje',$event,'calchj','msdxm')" @keydown.enter="(($event)=>{unfocus('table7','','','msdxmbqykcje',$event,'calchj','msdxm')})" v-text="thisData.msdxmbqykcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.msdxmbqsjkcje.columnEdit==1" @blur="unfocus('table7','','','msdxmbqsjkcje',$event,'calchj','msdxm')" @keydown.enter="(($event)=>{unfocus('table7','','','msdxmbqsjkcje',$event,'calchj','msdxm')})" v-text="thisData.msdxmbqsjkcje.columnValue"></td>
						<td class="center" :contenteditable="thisData.msdxmqmye.columnEdit==1" @blur="unfocus('table7','','','msdxmqmye',$event,'','mdtsdxm')" @keydown.enter="(($event)=>{unfocus('table7','','','msdxmqmye',$event,'','mdtsdxm')})" v-text="thisData.msdxmqmye.columnValue"></td>
					</tr>
				</table>
			</div>
			<div v-show="statusVaule=='一般纳税人附表四'">
				<table border="1 " width="100% " v-if="thisData.zzsskxtzysbfjjswhfqcye">
					<tr>
						<td colspan="8" class="center" style="font-weight: bold;padding: 0.05rem;">一、税额抵减情况</td>
					</tr>
					<tr>
						<td rowspan="2" class="center">序号</td>
						<td rowspan="2" class="center">抵减项目</td>
						<td class="center">期初余额</td>
						<td class="center">本期发生额</td>
						<td colspan="2" class="center">本期应抵减税额</td>
						<td class="center">本期实际抵减税额</td>
						<td class="center">期末余额</td>
					</tr>
					<tr>
						<td class="center">1</td>
						<td class="center">2</td>
						<td colspan="2" class="center">3=1+2</td>
						<td class="center">4≤3</td>
						<td class="center">5=3-4</td>
					</tr>
					<tr>
						<td class="center">1</td>
						<td class="">增值税税控系统专用设备费及技术维护费</td>
						<td class="center" :contenteditable="thisData.zzsskxtzysbfjjswhfqcye.columnEdit==1" @blur="unfocus('table8','','1','zzsskxtzysbfjjswhfqcye',$event,'calchj','zzsskxtzysbfjjswhf')" @keydown.enter="(($event)=>{unfocus('table8','','1','zzsskxtzysbfjjswhfqcye',$event,'calchj','zzsskxtzysbfjjswhf')})" v-text="thisData.zzsskxtzysbfjjswhfqcye.columnValue"></td>
						<td class="center" :contenteditable="thisData.zzsskxtzysbfjjswhfbqfse.columnEdit==1" @blur="unfocus('table8','','1','zzsskxtzysbfjjswhfbqfse',$event,'calchj','zzsskxtzysbfjjswhf')" @keydown.enter="(($event)=>{unfocus('table8','','1','zzsskxtzysbfjjswhfbqfse',$event,'calchj','zzsskxtzysbfjjswhf')})" v-text="thisData.zzsskxtzysbfjjswhfbqfse.columnValue"></td>
						<td colspan="2" class="center" :contenteditable="thisData.zzsskxtzysbfjjswhfbqydjse.columnEdit==1" @blur="unfocus('table8','','1','zzsskxtzysbfjjswhfbqydjse',$event,'calchj','zzsskxtzysbfjjswhf')" @keydown.enter="(($event)=>{unfocus('table8','','1','zzsskxtzysbfjjswhfbqydjse',$event,'calchj','zzsskxtzysbfjjswhf')})" v-text="thisData.zzsskxtzysbfjjswhfbqydjse.columnValue"></td>
						<td class="center" :contenteditable="thisData.zzsskxtzysbfjjswhfbqsjdjse.columnEdit==1" @blur="unfocus('table8','','1','zzsskxtzysbfjjswhfbqsjdjse',$event,'calchj','zzsskxtzysbfjjswhf')" @keydown.enter="(($event)=>{unfocus('table8','','1','zzsskxtzysbfjjswhfbqsjdjse',$event,'calchj','zzsskxtzysbfjjswhf')})" v-text="thisData.zzsskxtzysbfjjswhfbqsjdjse.columnValue"></td>
						<td class="center" :contenteditable="thisData.zzsskxtzysbfjjswhfqmye.columnEdit==1" @blur="unfocus('table8','','1','zzsskxtzysbfjjswhfqmye',$event,'','zzsskxtzysbfjjswhf')" @keydown.enter="(($event)=>{unfocus('table8','','1','zzsskxtzysbfjjswhfqmye',$event,'','zzsskxtzysbfjjswhf')})" v-text="thisData.zzsskxtzysbfjjswhfqmye.columnValue"></td>
					</tr>
					<tr>
						<td class="center">2</td>
						<td class="">分支机构预征缴纳税款</td>
						<td class="center" :contenteditable="thisData.fzjgyzsjnskqcye.columnEdit==1" @blur="unfocus('table8','','1','fzjgyzsjnskqcye',$event,'calchj','fzjgyzsjnsk')" @keydown.enter="(($event)=>{unfocus('table8','','1','fzjgyzsjnskqcye',$event,'calchj','fzjgyzsjnsk')})" v-text="thisData.fzjgyzsjnskqcye.columnValue"></td>
						<td class="center" :contenteditable="thisData.fzjgyzsjnskbqfse.columnEdit==1" @blur="unfocus('table8','','1','fzjgyzsjnskbqfse',$event,'calchj','fzjgyzsjnsk')" @keydown.enter="(($event)=>{unfocus('table8','','1','fzjgyzsjnskbqfse',$event,'calchj','fzjgyzsjnsk')})" v-text="thisData.fzjgyzsjnskbqfse.columnValue"></td>
						<td colspan="2" class="center" :contenteditable="thisData.fzjgyzsjnskbqydjse.columnEdit==1" @blur="unfocus('table8','','1','fzjgyzsjnskbqydjse',$event,'calchj','fzjgyzsjnsk')" @keydown.enter="(($event)=>{unfocus('table8','','1','fzjgyzsjnskbqydjse',$event,'calchj','fzjgyzsjnsk')})" v-text="thisData.fzjgyzsjnskbqydjse.columnValue"></td>
						<td class="center" :contenteditable="thisData.fzjgyzsjnskbqsjdjse.columnEdit==1" @blur="unfocus('table8','','1','fzjgyzsjnskbqsjdjse',$event,'calchj','fzjgyzsjnsk')" @keydown.enter="(($event)=>{unfocus('table8','','1','fzjgyzsjnskbqsjdjse',$event,'calchj','fzjgyzsjnsk')})" v-text="thisData.fzjgyzsjnskbqsjdjse.columnValue"></td>
						<td class="center" :contenteditable="thisData.fzjgyzsjnskqmye.columnEdit==1" @blur="unfocus('table8','','1','fzjgyzsjnskqmye',$event,'calchj','fzjgyzsjnsk')" @keydown.enter="(($event)=>{unfocus('table8','','1','fzjgyzsjnskqmye',$event,'calchj','fzjgyzsjnsk')})" v-text="thisData.fzjgyzsjnskqmye.columnValue"></td>
					</tr>
					<tr>
						<td class="center">3</td>
						<td class="">建筑服务预征缴纳税款</td>
						<td class="center" :contenteditable="thisData.jzfwyzjnskqcye.columnEdit==1" @blur="unfocus('table8','','1','jzfwyzjnskqcye',$event,'calchj','jzfwyzjnsk')" @keydown.enter="(($event)=>{unfocus('table8','','1','jzfwyzjnskqcye',$event,'calchj','jzfwyzjnsk')})" v-text="thisData.jzfwyzjnskqcye.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzfwyzjnskbqfse.columnEdit==1" @blur="unfocus('table8','','1','jzfwyzjnskbqfse',$event,'calchj','jzfwyzjnsk')" @keydown.enter="(($event)=>{unfocus('table8','','1','jzfwyzjnskbqfse',$event,'calchj','jzfwyzjnsk')})" v-text="thisData.jzfwyzjnskbqfse.columnValue"></td>
						<td colspan="2" class="center" :contenteditable="thisData.jzfwyzjnskbqydjse.columnEdit==1" @blur="unfocus('table8','','1','jzfwyzjnskbqydjse',$event,'calchj','jzfwyzjnsk')" @keydown.enter="(($event)=>{unfocus('table8','','1','jzfwyzjnskbqydjse',$event,'calchj','jzfwyzjnsk')})" v-text="thisData.jzfwyzjnskbqydjse.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzfwyzjnskbqsjdjse.columnEdit==1" @blur="unfocus('table8','','1','jzfwyzjnskbqsjdjse',$event,'calchj','jzfwyzjnsk')" @keydown.enter="(($event)=>{unfocus('table8','','1','jzfwyzjnskbqsjdjse',$event,'calchj','jzfwyzjnsk')})" v-text="thisData.jzfwyzjnskbqsjdjse.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzfwyzjnskqmye.columnEdit==1" @blur="unfocus('table8','','1','jzfwyzjnskqmye',$event,'calchj','jzfwyzjnsk')" @keydown.enter="(($event)=>{unfocus('table8','','1','jzfwyzjnskqmye',$event,'calchj','jzfwyzjnsk')})" v-text="thisData.jzfwyzjnskqmye.columnValue"></td>
					</tr>
					<tr>
						<td class="center">4</td>
						<td class="">销售不动产预征缴纳税款</td>
						<td class="center"></td>
						<td class="center"></td>
						<td colspan="2" class="center"></td>
						<td class="center"></td>
						<td class="center"></td>
					</tr>
					<tr>
						<td class="center">5</td>
						<td class="">出租不动产预征缴纳税款</td>
						<td class="center"></td>
						<td class="center"></td>
						<td colspan="2" class="center"></td>
						<td class="center"></td>
						<td class="center"></td>
					</tr>
					<tr>
						<td colspan="8" class="center" style="font-weight: bold;padding: 0.05rem;">二、加计抵减情况</td>
					</tr>
					<tr>
						<td rowspan="2" class="center">序号</td>
						<td rowspan="2" class="center">抵减项目</td>
						<td class="center">期初余额</td>
						<td class="center">本期发生额</td>
						<td class="center">本期调减额</td>
						<td class="center">本期可抵减额</td>
						<td class="center">本期实际抵减税额</td>
						<td class="center">期末余额</td>
					</tr>
					<tr>
						<td class="center">1</td>
						<td class="center">2</td>
						<td class="center">3</td>
						<td class="center">4=1+2-3</td>
						<td class="center">5</td>
						<td class="center">6=4-5</td>
					</tr>
					<tr>
						<td class="center">6</td>
						<td class="">一般项目加计抵减额计算</td>
						<td class="center" :contenteditable="thisData.ybxmjjdjejsqcye.columnEdit==1" @blur="unfocus('table8','','2','ybxmjjdjejsqcye',$event,'calchj','ybxmjjdjejs')" @keydown.enter="(($event)=>{unfocus('table8','','2','ybxmjjdjejsqcye',$event,'calchj','ybxmjjdjejs')})" v-text="thisData.ybxmjjdjejsqcye.columnValue"></td>
						<td class="center" :contenteditable="thisData.ybxmjjdjejsbqfse.columnEdit==1" @blur="unfocus('table8','','2','ybxmjjdjejsbqfse',$event,'calchj','ybxmjjdjejs')" @keydown.enter="(($event)=>{unfocus('table8','','2','ybxmjjdjejsbqfse',$event,'calchj','ybxmjjdjejs')})" v-text="thisData.ybxmjjdjejsbqfse.columnValue"></td>
						<td class="center" :contenteditable="thisData.ybxmjjdjejsbqtje.columnEdit==1" @blur="unfocus('table8','','2','ybxmjjdjejsbqtje',$event,'calchj','ybxmjjdjejs')" @keydown.enter="(($event)=>{unfocus('table8','','2','ybxmjjdjejsbqtje',$event,'calchj','ybxmjjdjejs')})" v-text="thisData.ybxmjjdjejsbqtje.columnValue"></td>
						<td class="center" :contenteditable="thisData.ybxmjjdjejsbqkdje.columnEdit==1" @blur="unfocus('table8','','2','ybxmjjdjejsbqkdje',$event,'calchj','ybxmjjdjejs')" @keydown.enter="(($event)=>{unfocus('table8','','2','ybxmjjdjejsbqkdje',$event,'calchj','ybxmjjdjejs')})" v-text="thisData.ybxmjjdjejsbqkdje.columnValue"></td>
						<td class="center" :contenteditable="thisData.ybxmjjdjejsbqsjdje.columnEdit==1" @blur="unfocus('table8','','2','ybxmjjdjejsbqsjdje',$event,'calchj','ybxmjjdjejs')" @keydown.enter="(($event)=>{unfocus('table8','','2','ybxmjjdjejsbqsjdje',$event,'calchj','ybxmjjdjejs')})" v-text="thisData.ybxmjjdjejsbqsjdje.columnValue"></td>
						<td class="center" :contenteditable="thisData.ybxmjjdjejsqmye.columnEdit==1" @blur="unfocus('table8','','2','ybxmjjdjejsqmye',$event,'','ybxmjjdjejs')" @keydown.enter="(($event)=>{unfocus('table8','','2','ybxmjjdjejsqmye',$event,'','ybxmjjdjejs')})" v-text="thisData.ybxmjjdjejsqmye.columnValue"></td>
					</tr>
					<tr>
						<td class="center">7</td>
						<td class="">即征即退项目加计抵减额计算</td>
						<td class="center" :contenteditable="thisData.jzjtxmjjdjejsqcye.columnEdit==1" @blur="unfocus('table8','','2','jzjtxmjjdjejsqcye',$event,'calchj','jzjtxmjjdjejs')" @keydown.enter="(($event)=>{unfocus('table8','','2','jzjtxmjjdjejsqcye',$event,'calchj','jzjtxmjjdjejs')})" v-text="thisData.jzjtxmjjdjejsqcye.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjtxmjjdjejsbqfse.columnEdit==1" @blur="unfocus('table8','','2','jzjtxmjjdjejsbqfse',$event,'calchj','jzjtxmjjdjejs')" @keydown.enter="(($event)=>{unfocus('table8','','2','jzjtxmjjdjejsbqfse',$event,'calchj','jzjtxmjjdjejs')})" v-text="thisData.jzjtxmjjdjejsbqfse.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjtxmjjdjejsbqtje.columnEdit==1" @blur="unfocus('table8','','2','jzjtxmjjdjejsbqtje',$event,'calchj','jzjtxmjjdjejs')" @keydown.enter="(($event)=>{unfocus('table8','','2','jzjtxmjjdjejsbqtje',$event,'calchj','jzjtxmjjdjejs')})" v-text="thisData.jzjtxmjjdjejsbqtje.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjtxmjjdjejsbqkdje.columnEdit==1" @blur="unfocus('table8','','2','jzjtxmjjdjejsbqkdje',$event,'calchj','jzjtxmjjdjejs')" @keydown.enter="(($event)=>{unfocus('table8','','2','jzjtxmjjdjejsbqkdje',$event,'calchj','jzjtxmjjdjejs')})" v-text="thisData.jzjtxmjjdjejsbqkdje.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjtxmjjdjejsbqsjdje.columnEdit==1" @blur="unfocus('table8','','2','jzjtxmjjdjejsbqsjdje',$event,'calchj','jzjtxmjjdjejs')" @keydown.enter="(($event)=>{unfocus('table8','','2','jzjtxmjjdjejsbqsjdje',$event,'calchj','jzjtxmjjdjejs')})" v-text="thisData.jzjtxmjjdjejsbqsjdje.columnValue"></td>
						<td class="center" :contenteditable="thisData.jzjtxmjjdjejsqmye.columnEdit==1" @blur="unfocus('table8','','2','jzjtxmjjdjejsqmye',$event,'calchj','jzjtxmjjdjejs')" @keydown.enter="(($event)=>{unfocus('table8','','2','jzjtxmjjdjejsqmye',$event,'calchj','jzjtxmjjdjejs')})" v-text="thisData.jzjtxmjjdjejsqmye.columnValue"></td>
					</tr>
					<tr>
						<td class="center">8</td>
						<td class="">合计</td>
						<td class="center" v-text="total1"></td>
						<td class="center" v-text="total2"></td>
						<td class="center" v-text="total3"></td>
						<td class="center" v-text="total4"></td>
						<td class="center" v-text="total5"></td>
						<td class="center" v-text="total6"></td>
					</tr>
				</table>
			</div>
			<div v-show="statusVaule=='小规模纳税人主表'">
				<table border="1 " width="100% " v-if="thisData.yzzzsbhshwlwbqs">
					<tr>
						<td class="center" rowspan="16"> 一、计税依据</td>
						<td class="center" rowspan="2"> 项目</td>
						<td class="center" rowspan="2"> 栏次</td>
						<td class="center" colspan="2"> 本期数</td>
						<td class="center" colspan="2"> 本年累计</td>
					</tr>
					<tr>
						<td class="center">货物及劳务</td>
						<td class="center">服务、不动产和无形资产</td>
						<td class="center">货物及劳务</td>
						<td class="center">服务、不动产和无形资产</td>
					</tr>
					<tr>
						<td class="">（一）应征增值税不含税销售额</td>
						<td class="center">1</td>
						<td class="center" :contenteditable="thisData.yzzzsbhshwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','yzzzsbhshwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','yzzzsbhshwlw',$event,'','')})" v-text="thisData.yzzzsbhshwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.yzzzsbhsfwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','yzzzsbhsfwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','yzzzsbhsfwbdc',$event,'','')})" v-text="thisData.yzzzsbhsfwbdcbqs.columnValue">1882605.33</td>
						<td class="center" :contenteditable="thisData.yzzzsbhshwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','yzzzsbhshwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','yzzzsbhshwlw',$event,'','')})" v-text="thisData.yzzzsbhshwlwbnlj.columnValue"></td>
						<td class="center" :contenteditable="thisData.yzzzsbhsfwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','yzzzsbhsfwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','yzzzsbhsfwbdc',$event,'','')})" v-text="thisData.yzzzsbhsfwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">税务机关代开的增值税专用发票不含税销售额</td>
						<td class="center">2</td>
						<td class="center" :contenteditable="thisData.dkzzsfpbhshwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','dkzzsfpbhshwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','dkzzsfpbhshwlw',$event,'','')})" v-text="thisData.dkzzsfpbhshwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.dkzzsfpbhsfwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','dkzzsfpbhsfwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','dkzzsfpbhsfwbdc',$event,'','')})" v-text="thisData.dkzzsfpbhsfwbdcbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.dkzzsfpbhshwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','dkzzsfpbhshwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','dkzzsfpbhshwlw',$event,'','')})" v-text="thisData.dkzzsfpbhshwlwbnlj.columnValue"></td>
						<td class="center" :contenteditable="thisData.dkzzsfpbhsfwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','dkzzsfpbhsfwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','dkzzsfpbhsfwbdc',$event,'','')})" v-text="thisData.dkzzsfpbhsfwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">税控器具开具的普通发票不含税销售额</td>
						<td class="center">3</td>
						<td class="center" :contenteditable="thisData.skqjfpbhshwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','skqjfpbhshwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','skqjfpbhshwlw',$event,'','')})" v-text="thisData.skqjfpbhshwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.skqjfpbhsfwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','skqjfpbhsfwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','skqjfpbhsfwbdc',$event,'','')})" v-text="thisData.skqjfpbhsfwbdcbqs.columnValue">1882605.33</td>
						<td class="center" :contenteditable="thisData.skqjfpbhshwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','skqjfpbhshwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','skqjfpbhshwlw',$event,'','')})" v-text="thisData.skqjfpbhshwlwbnlj.columnValue"></td>
						<td class="center" :contenteditable="thisData.skqjfpbhsfwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','skqjfpbhsfwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','skqjfpbhsfwbdc',$event,'','')})" v-text="thisData.skqjfpbhsfwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="">（二）销售、出租不动产不含税销售额</td>
						<td class="center">4</td>
						<td class="center" :contenteditable="thisData.xsczbdcbhsxsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','xsczbdcbhsxsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','xsczbdcbhsxsehwlw',$event,'','')})" v-text="thisData.xsczbdcbhsxsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.xsczbdcbhsxsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','xsczbdcbhsxsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','xsczbdcbhsxsefwbdc',$event,'','')})" v-text="thisData.xsczbdcbhsxsefwbdcbqs.columnValue"></td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.xsczbdcbhsxsefwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','xsczbdcbhsxsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','xsczbdcbhsxsefwbdc',$event,'','')})" v-text="thisData.xsczbdcbhsxsefwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">税务机关代开的增值税专用发票不含税销售额</td>
						<td class="center">5</td>
						<td class="center" :contenteditable="thisData.bdcdkzzsfpbhsxsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','bdcdkzzsfpbhsxsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','bdcdkzzsfpbhsxsehwlw',$event,'','')})" v-text="thisData.bdcdkzzsfpbhsxsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.bdcdkzzsfpbhsxsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','bdcdkzzsfpbhsxsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','bdcdkzzsfpbhsxsefwbdc',$event,'','')})" v-text="thisData.bdcdkzzsfpbhsxsefwbdcbqs.columnValue"></td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.bdcdkzzsfpbhsxsefwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','bdcdkzzsfpbhsxsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','bdcdkzzsfpbhsxsefwbdc',$event,'','')})" v-text="thisData.bdcdkzzsfpbhsxsefwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">税控器具开具的普通发票不含税销售额</td>
						<td class="center">6</td>
						<td class="center" :contenteditable="thisData.bdcskqjfpbhsxsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','bdcskqjfpbhsxsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','bdcskqjfpbhsxsehwlw',$event,'','')})" v-text="thisData.bdcskqjfpbhsxsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.bdcskqjfpbhsxsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','bdcskqjfpbhsxsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','bdcskqjfpbhsxsefwbdc',$event,'','')})" v-text="thisData.bdcskqjfpbhsxsefwbdcbqs.columnValue"></td>
						<td class="center">——</td>
						<td class="center" :contenteditable="thisData.bdcskqjfpbhsxsefwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','bdcskqjfpbhsxsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','bdcskqjfpbhsxsefwbdc',$event,'','')})" v-text="thisData.bdcskqjfpbhsxsefwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="">（三）销售使用过的固定资产不含税销售额</td>
						<td class="center">7(7≥8)</td>
						<td class="center" :contenteditable="thisData.xssygdgdzcbhsxsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','xssygdgdzcbhsxsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','xssygdgdzcbhsxsehwlw',$event,'','')})" v-text="thisData.xssygdgdzcbhsxsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.xssygdgdzcbhsxsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','xssygdgdzcbhsxsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','xssygdgdzcbhsxsefwbdc',$event,'','')})" v-text="thisData.xssygdgdzcbhsxsefwbdcbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.xssygdgdzcbhsxsehwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','xssygdgdzcbhsxsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','xssygdgdzcbhsxsehwlw',$event,'','')})" v-text="thisData.xssygdgdzcbhsxsehwlwbnlj.columnValue"></td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td class="">其中：税控器具开具的普通发票不含税销售额</td>
						<td class="center">8</td>
						<td class="center" :contenteditable="thisData.gdzcskqjfpbhsxsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','gdzcskqjfpbhsxsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','gdzcskqjfpbhsxsehwlw',$event,'','')})" v-text="thisData.gdzcskqjfpbhsxsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.gdzcskqjfpbhsxsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','gdzcskqjfpbhsxsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','gdzcskqjfpbhsxsefwbdc',$event,'','')})" v-text="thisData.gdzcskqjfpbhsxsefwbdcbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.gdzcskqjfpbhsxsehwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','gdzcskqjfpbhsxsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','gdzcskqjfpbhsxsehwlw',$event,'','')})" v-text="thisData.gdzcskqjfpbhsxsehwlwbnlj.columnValue"></td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td class="">（四）免税销售额</td>
						<td class="center">9=10+11+12</td>
						<td class="center" :contenteditable="thisData.msxsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','msxsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','msxsehwlw',$event,'','')})" v-text="thisData.msxsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.msxsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','msxsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','msxsefwbdc',$event,'','')})" v-text="thisData.msxsefwbdcbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.msxsehwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','msxsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','msxsehwlw',$event,'','')})" v-text="thisData.msxsehwlwbnlj.columnValue"></td>
						<td class="center" :contenteditable="thisData.msxsefwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','msxsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','msxsefwbdc',$event,'','')})" v-text="thisData.msxsefwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="">其中：小微企业免税销售额</td>
						<td class="center">10</td>
						<td class="center" :contenteditable="thisData.xwqymsxsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','xwqymsxsehwlw',$event,'msxse','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','xwqymsxsehwlw',$event,'msxse','')})" v-text="thisData.xwqymsxsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.xwqymsxsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','xwqymsxsefwbdc',$event,'msxse','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','xwqymsxsefwbdc',$event,'msxse','')})" v-text="thisData.xwqymsxsefwbdcbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.xwqymsxsehwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','xwqymsxsehwlw',$event,'msxse','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','xwqymsxsehwlw',$event,'msxse','')})" v-text="thisData.xwqymsxsehwlwbnlj.columnValue"></td>
						<td class="center" :contenteditable="thisData.xwqymsxsefwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','xwqymsxsefwbdc',$event,'msxse','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','xwqymsxsefwbdc',$event,'msxse','')})" v-text="thisData.xwqymsxsefwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">未达起征点销售额</td>
						<td class="center">11</td>
						<td class="center" :contenteditable="thisData.wdqzdxsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','wdqzdxsehwlw',$event,'msxse','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','wdqzdxsehwlw',$event,'msxse','')})" v-text="thisData.wdqzdxsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.wdqzdxsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','wdqzdxsefwbdc',$event,'msxse','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','wdqzdxsefwbdc',$event,'msxse','')})" v-text="thisData.wdqzdxsefwbdcbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.wdqzdxsehwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','wdqzdxsehwlw',$event,'msxse','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','wdqzdxsehwlw',$event,'msxse','')})" v-text="thisData.wdqzdxsehwlwbnlj.columnValue"></td>
						<td class="center" :contenteditable="thisData.wdqzdxsefwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','wdqzdxsefwbdc',$event,'msxse','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','wdqzdxsefwbdc',$event,'msxse','')})" v-text="thisData.wdqzdxsefwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">其他免税销售额</td>
						<td class="center">12</td>
						<td class="center" :contenteditable="thisData.qtmsxsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','qtmsxsehwlw',$event,'msxse','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','qtmsxsehwlw',$event,'msxse','')})" v-text="thisData.qtmsxsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.qtmsxsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','qtmsxsefwbdc',$event,'msxse','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','qtmsxsefwbdc',$event,'msxse','')})" v-text="thisData.qtmsxsefwbdcbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.qtmsxsehwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','qtmsxsehwlw',$event,'msxse','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','qtmsxsehwlw',$event,'msxse','')})" v-text="thisData.qtmsxsehwlwbnlj.columnValue"></td>
						<td class="center" :contenteditable="thisData.qtmsxsefwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','qtmsxsefwbdc',$event,'msxse','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','qtmsxsefwbdc',$event,'msxse','')})" v-text="thisData.qtmsxsefwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="">（五）出口免税销售额</td>
						<td class="center">13(13≥14)</td>
						<td class="center" :contenteditable="thisData.ckmsxsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','ckmsxsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','ckmsxsehwlw',$event,'','')})" v-text="thisData.ckmsxsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.ckmsxsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','ckmsxsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','ckmsxsefwbdc',$event,'','')})" v-text="thisData.ckmsxsefwbdcbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.ckmsxsehwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','ckmsxsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','ckmsxsehwlw',$event,'','')})" v-text="thisData.ckmsxsehwlwbnlj.columnValue"></td>
						<td class="center" :contenteditable="thisData.ckmsxsefwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','ckmsxsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','ckmsxsefwbdc',$event,'','')})" v-text="thisData.ckmsxsefwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class=""> 其中：税控器具开具的普通发票销售额</td>
						<td class="center">14</td>
						<td class="center" :contenteditable="thisData.ckmsskqjfphwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','ckmsskqjfphwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','ckmsskqjfphwlw',$event,'','')})" v-text="thisData.ckmsskqjfphwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.ckmsskqjfpfwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','ckmsskqjfpfwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','ckmsskqjfpfwbdc',$event,'','')})" v-text="thisData.ckmsskqjfpfwbdcbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.ckmsskqjfphwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','ckmsskqjfphwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','ckmsskqjfphwlw',$event,'','')})" v-text="thisData.ckmsskqjfphwlwbnlj.columnValue"></td>
						<td class="center" :contenteditable="thisData.ckmsskqjfpfwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','ckmsskqjfpfwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','ckmsskqjfpfwbdc',$event,'','')})" v-text="thisData.ckmsskqjfpfwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="center" rowspan="8"> 二、税款计算</td>
						<td class=""> 本期应纳税额</td>
						<td class="center"> 15</td>
						<td class="center" :contenteditable="thisData.bqynsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','bqynsehwlw',$event,'ynse','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','bqynsehwlw',$event,'ynse','')})" v-text="thisData.bqynsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqynsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','bqynsefwbdc',$event,'ynse','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','bqynsefwbdc',$event,'ynse','')})" v-text="thisData.bqynsefwbdcbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqynsehwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','bqynsehwlw',$event,'ynse','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','bqynsehwlw',$event,'ynse','')})" v-text="thisData.bqynsehwlwbnlj.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqynsefwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','bqynsefwbdc',$event,'ynse','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','bqynsefwbdc',$event,'ynse','')})" v-text="thisData.bqynsefwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="">本期应纳税额减征额</td>
						<td class="center"> 16</td>
						<td class="center" :contenteditable="thisData.bqynsejzehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','bqynsejzehwlw',$event,'ynse','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','bqynsejzehwlw',$event,'ynse','')})" v-text="thisData.bqynsejzehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqynsejzefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','bqynsejzefwbdc',$event,'ynse','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','bqynsejzefwbdc',$event,'ynse','')})" v-text="thisData.bqynsejzefwbdcbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqynsejzehwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','bqynsejzehwlw',$event,'ynse','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','bqynsejzehwlw',$event,'ynse','')})" v-text="thisData.bqynsejzehwlwbnlj.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqynsejzefwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','bqynsejzefwbdc',$event,'ynse','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','bqynsejzefwbdc',$event,'ynse','')})" v-text="thisData.bqynsejzefwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="">本期免税额</td>
						<td class="center"> 17</td>
						<td class="center" :contenteditable="thisData.bqmsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','bqmsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','bqmsehwlw',$event,'','')})" v-text="thisData.bqmsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqmsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','bqmsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','bqmsefwbdc',$event,'','')})" v-text="thisData.bqmsefwbdcbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqmsehwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','bqmsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','bqmsehwlw',$event,'','')})" v-text="thisData.bqmsehwlwbnlj.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqmsefwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','bqmsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','bqmsefwbdc',$event,'','')})" v-text="thisData.bqmsefwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="">其中：小微企业免税额</td>
						<td class="center">18</td>
						<td class="center" :contenteditable="thisData.xwqymsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','xwqymsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','xwqymsehwlw',$event,'','')})" v-text="thisData.xwqymsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.xwqymsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','xwqymsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','xwqymsefwbdc',$event,'','')})" v-text="thisData.xwqymsefwbdcbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.xwqymsehwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','xwqymsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','xwqymsehwlw',$event,'','')})" v-text="thisData.xwqymsehwlwbnlj.columnValue"></td>
						<td class="center" :contenteditable="thisData.xwqymsefwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','xwqymsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','xwqymsefwbdc',$event,'','')})" v-text="thisData.xwqymsefwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">未达起征点免税额</td>
						<td class="center">19</td>
						<td class="center" :contenteditable="thisData.wdqzdmsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','wdqzdmsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','wdqzdmsehwlw',$event,'','')})" v-text="thisData.wdqzdmsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.wdqzdmsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','wdqzdmsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','wdqzdmsefwbdc',$event,'','')})" v-text="thisData.wdqzdmsefwbdcbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.wdqzdmsehwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','wdqzdmsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','wdqzdmsehwlw',$event,'','')})" v-text="thisData.wdqzdmsehwlwbnlj.columnValue"></td>
						<td class="center" :contenteditable="thisData.wdqzdmsefwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','wdqzdmsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','wdqzdmsefwbdc',$event,'','')})" v-text="thisData.wdqzdmsefwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="">应纳税额合计</td>
						<td class="center">20=15-16</td>
						<td class="center" :contenteditable="thisData.ynsehjhwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','ynsehjhwlw',$event,'ynse','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','ynsehjhwlw',$event,'ynse','')})" v-text="thisData.ynsehjhwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.ynsehjfwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','ynsehjfwbdc',$event,'ynse','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','ynsehjfwbdc',$event,'ynse','')})" v-text="thisData.ynsehjfwbdcbqs.columnValue">56478.16</td>
						<td class="center" :contenteditable="thisData.ynsehjhwlwbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','ynsehjhwlw',$event,'ynse','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','ynsehjhwlw',$event,'ynse','')})" v-text="thisData.ynsehjhwlwbnlj.columnValue"></td>
						<td class="center" :contenteditable="thisData.ynsehjfwbdcbnlj.columnEdit==1" @blur="unfocus('table5','','bnlj','ynsehjfwbdc',$event,'ynse','')" @keydown.enter="(($event)=>{unfocus('table5','','bnlj','ynsehjfwbdc',$event,'ynse','')})" v-text="thisData.ynsehjfwbdcbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="">本期预缴税额</td>
						<td class="center">21</td>
						<td class="center" :contenteditable="thisData.bqyjsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','bqs','bqyjsehwlw',$event,'ynse','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','bqyjsehwlw',$event,'ynse','')})" v-text="thisData.bqyjsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqyjsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','bqs','bqyjsefwbdc',$event,'ynse','')" @keydown.enter="(($event)=>{unfocus('table5','','bqs','bqyjsefwbdc',$event,'ynse','')})" v-text="thisData.bqyjsefwbdcbqs.columnValue">56478.16</td>
						<td class="center">——</td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td class="">本期应补（退）税额</td>
						<td class="center">22=20-21</td>
						<td class="center" :contenteditable="thisData.bqybtsehwlwbqs.columnEdit==1" @blur="unfocus('table5','','','bqybtsehwlw',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','','bqybtsehwlw',$event,'','')})" v-text="thisData.bqybtsehwlwbqs.columnValue"></td>
						<td class="center" :contenteditable="thisData.bqybtsefwbdcbqs.columnEdit==1" @blur="unfocus('table5','','','bqybtsefwbdc',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','','bqybtsefwbdc',$event,'','')})" v-text="thisData.bqybtsefwbdcbqs.columnValue">0</td>
						<td class="center">——</td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td class="center" colspan="1">纳税人或代理人声明：</td>
						<td class="center" colspan="1">如纳税人填报，由纳税人填写以下各栏：</td>
						<td class="center" colspan="5" :contenteditable="thisData.remark.columnEdit==1" @blur="unfocus('table5','','','remark',$event,'','')" @keydown.enter="(($event)=>{unfocus('table5','','','remark',$event,'','')})" v-text="thisData.remark.columnValue"></td>
					</tr>
					<tr>
						<td class="center" colspan="2" rowspan="5">本纳税申报表是根据国家税收法律法规及相关规定填报的，我确定它是真实的、可靠的、完整的。</td>
						<td class="center" colspan="2">办税人员：</td>
						<td class="center" colspan="3">财务负责人：</td>
					</tr>
					<tr>
						<td class="center" colspan="2">法定代表人：</td>
						<td class="center" colspan="3">联系电话：</td>
					</tr>
					<tr>
						<td class="center" colspan="5">如委托代理人填报，由代理人填写以下各栏：</td>
					</tr>
					<tr>
						<td class="center" colspan="2">代理人名称（公章）：</td>
						<td class="center" colspan="3">经办人：</td>
					</tr>
					<tr>
						<td class="center" colspan="5">联系电话：</td>
					</tr>
				</table>
			</div>
			<div v-show="statusVaule=='小规模纳税人附列资料'">
				<table border="1 " width="100% " v-if="thisData.kce3qcye">
					<tr>
						<td colspan="4" class="center" style="font-weight: bold;padding: 0.05rem;">应税行为（3%征收率）扣除额计算</td>
					</tr>
					<tr>
						<td class="center">期初余额</td>
						<td class="center">本期余额</td>
						<td class="center">本期扣除额</td>
						<td class="center">期末余额</td>
					</tr>
					<tr>
						<td class="center">1</td>
						<td class="center">2</td>
						<td class="center"> 3（3≤1＋2之和，且3≤5）</td>
						<td class="center">4＝1＋2－3</td>
					</tr>
					<tr>
						<td class="center" :contenteditable="thisData.kce3qcye.columnEdit==1" @blur="unfocus('table6','','','kce3qcye',$event,'calchj','')" @keydown.enter="(($event)=>{unfocus('table6','','','kce3qcye',$event,'calchj','')})" v-text="thisData.kce3qcye.columnValue"></td>
						<td class="center" :contenteditable="thisData.kce3bqfse.columnEdit==1" @blur="unfocus('table6','','','kce3bqfse',$event,'calchj','')" @keydown.enter="(($event)=>{unfocus('table6','','','kce3bqfse',$event,'calchj','')})" v-text="thisData.kce3bqfse.columnValue"></td>
						<td class="center" :contenteditable="thisData.kce3bqkce.columnEdit==1" @blur="unfocus('table6','','','kce3bqkce',$event,'calchj','')" @keydown.enter="(($event)=>{unfocus('table6','','','kce3bqkce',$event,'calchj','')})" v-text="thisData.kce3bqkce.columnValue"></td>
						<td class="center" :contenteditable="thisData.kce3qmye.columnEdit==1" @blur="unfocus('table6','','','kce3qmye',$event,'','')" @keydown.enter="(($event)=>{unfocus('table6','','','kce3qmye',$event,'','')})" v-text="thisData.kce3qmye.columnValue"></td>
					</tr>
					<tr>
						<td colspan="4" class="center" style="font-weight: bold;padding: 0.05rem;"> 应税行为（3%征收率）计税销售额计算</td>
					</tr>
					<tr>
						<td class="center"> 全部含税收入（适用3%征收率）</td>
						<td class="center">本期扣除额</td>
						<td class="center">含税销售额</td>
						<td class="center">不含税销售额</td>
					</tr>
					<tr>
						<td class="center">5</td>
						<td class="center">6=3</td>
						<td class="center">7=5-6</td>
						<td class="center">8=7/1.03</td>
					</tr>
					<tr>
						<td class="center" :contenteditable="thisData.xse3qbhssr.columnEdit==1" @blur="unfocus('table6','','','xse3qbhssr',$event,'calchj','')" @keydown.enter="(($event)=>{unfocus('table6','','','xse3qbhssr',$event,'calchj','')})" v-text="thisData.xse3qbhssr.columnValue"></td>
						<td class="center" :contenteditable="thisData.xse3bqkce.columnEdit==1" @blur="unfocus('table6','','','xse3bqkce',$event,'calchj','')" @keydown.enter="(($event)=>{unfocus('table6','','','xse3bqkce',$event,'calchj','')})" v-text="thisData.xse3bqkce.columnValue"></td>
						<td class="center" :contenteditable="thisData.xse3hsxse.columnEdit==1" @blur="unfocus('table6','','','xse3hsxse',$event,'calchj','')" @keydown.enter="(($event)=>{unfocus('table6','','','xse3hsxse',$event,'calchj','')})" v-text="thisData.xse3hsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.xse3bhsxse.columnEdit==1" @blur="unfocus('table6','','','xse3bhsxse',$event,'','')" @keydown.enter="(($event)=>{unfocus('table6','','','xse3bhsxse',$event,'','')})" v-text="thisData.xse3bhsxse.columnValue"></td>
					</tr>
					<tr>
						<td colspan="4" class="center" style="font-weight: bold;padding: 0.05rem;"> 应税行为（5%征收率）扣除额计算</td>
					</tr>
					<tr>
						<td class="center">期初余额</td>
						<td class="center">本期余额</td>
						<td class="center">本期扣除额</td>
						<td class="center">期末余额</td>
					</tr>
					<tr>
						<td class="center">9</td>
						<td class="center">10</td>
						<td class="center"> 11（11≤9＋10之和，且11≤13）</td>
						<td class="center">12＝9＋10－11</td>
					</tr>
					<tr>
						<td class="center" :contenteditable="thisData.kce5qcye.columnEdit==1" @blur="unfocus('table6','','','kce5qcye',$event,'calchj5','')" @keydown.enter="(($event)=>{unfocus('table6','','','kce5qcye',$event,'calchj5','')})" v-text="thisData.kce5qcye.columnValue"></td>
						<td class="center" :contenteditable="thisData.kce5bqfse.columnEdit==1" @blur="unfocus('table6','','','kce5bqfse',$event,'calchj5','')" @keydown.enter="(($event)=>{unfocus('table6','','','kce5bqfse',$event,'calchj5','')})" v-text="thisData.kce5bqfse.columnValue"></td>
						<td class="center" :contenteditable="thisData.kce5bqkce.columnEdit==1" @blur="unfocus('table6','','','kce5bqkce',$event,'calchj5','')" @keydown.enter="(($event)=>{unfocus('table6','','','kce5bqkce',$event,'calchj5','')})" v-text="thisData.kce5bqkce.columnValue"></td>
						<td class="center" :contenteditable="thisData.kce5qmye.columnEdit==1" @blur="unfocus('table6','','','kce5qmye',$event,'','')" @keydown.enter="(($event)=>{unfocus('table6','','','kce5qmye',$event,'','')})" v-text="thisData.kce5qmye.columnValue"></td>
					</tr>
					<tr>
						<td colspan="4" class="center" style="font-weight: bold;padding: 0.05rem;"> 应税行为（5%征收率）计税销售额计算</td>
					</tr>
					<tr>
						<td class="center"> 全部含税收入（适用5%征收率）</td>
						<td class="center">本期扣除额</td>
						<td class="center">含税销售额</td>
						<td class="center">不含税销售额</td>
					</tr>
					<tr>
						<td class="center">13</td>
						<td class="center">14=11</td>
						<td class="center">15=13-14</td>
						<td class="center">16=15/1.05</td>
					</tr>
					<tr>
						<td class="center" :contenteditable="thisData.xse5qbhssr.columnEdit==1" @blur="unfocus('table6','','','xse5qbhssr',$event,'calchj5','')" @keydown.enter="(($event)=>{unfocus('table6','','','xse5qbhssr',$event,'calchj5','')})" v-text="thisData.xse5qbhssr.columnValue"></td>
						<td class="center" :contenteditable="thisData.xse5bqkce.columnEdit==1" @blur="unfocus('table6','','','xse5bqkce',$event,'calchj5','')" @keydown.enter="(($event)=>{unfocus('table6','','','xse5bqkce',$event,'calchj5','')})" v-text="thisData.xse5bqkce.columnValue"></td>
						<td class="center" :contenteditable="thisData.xse5hsxse.columnEdit==1" @blur="unfocus('table6','','','xse5hsxse',$event,'calchj5','')" @keydown.enter="(($event)=>{unfocus('table6','','','xse5hsxse',$event,'calchj5','')})" v-text="thisData.xse5hsxse.columnValue"></td>
						<td class="center" :contenteditable="thisData.xse5bhsxse.columnEdit==1" @blur="unfocus('table6','','','xse5bhsxse',$event,'','')" @keydown.enter="(($event)=>{unfocus('table6','','','xse5bhsxse',$event,'','')})" v-text="thisData.xse5bhsxse.columnValue"></td>
					</tr>
				</table>
			</div>
			<div v-if="statusVaule=='城市维护建设税、教育费附加、地方教育附加申报表'">
				<table border="1 " width="100% ">
					<tr>
						<td class="center" rowspan="4">征收项目</td>
						<td class="center" rowspan="4">征收品目</td>
						<td class="center" colspan="5">计税（费）依据</td>
						<td class="center" rowspan="3">税率（征收率）</td>
						<td class="center" rowspan="3">本期应纳税（费）额</td>
						<td class="center" colspan="2" rowspan="2">本期减免税（费）额</td>
						<td class="center" rowspan="3">增值税小规模纳税人减征额</td>
						<td class="center" rowspan="3">本期已缴税（费）额</td>
						<td class="center" rowspan="3">本期应补（退）税（费）额</td>
					</tr>
					<tr>
						<td class="center" colspan="2">增值税</td>
						<td class="center" rowspan="2">消费税</td>
						<td class="center" rowspan="2">营业税</td>
						<td class="center" rowspan="2">合计</td>
					</tr>
					<tr>
						<td class="center">一般增值税</td>
						<td class="center">免抵税额</td>
						<td class="center">减免性质代码</td>
						<td class="center">减免额</td>
					</tr>
					<tr>
						<td class="center">1</td>
						<td class="center">2</td>
						<td class="center">3</td>
						<td class="center">4</td>
						<td class="center">5=1+2+3+4</td>
						<td class="center">6</td>
						<td class="center">7=5x6</td>
						<td class="center">8</td>
						<td class="center">9</td>
						<td class="center">10</td>
						<td class="center">11</td>
						<td class="center">12=7-9-10-11</td>
					</tr>
					<tr v-for="(item,index) in thisData" :key="index">
						<td class="center">{{item.xm}}</td>
						<td class="center" v-if="item.xm!='合计'">{{item.pm}}</td>
						<td class="center" v-if="item.xm=='合计'"></td>
						<td class="center" v-if="item.xm!='合计'" :contenteditable="item.jsybzzeje.columnEdit==1" @blur="unfocus('table4','','','jsybzzeje',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table4','','','jsybzzeje',$event,'jshjje','','',index)})" v-text="item.jsybzzeje.columnValue"></td>
						<td class="center" v-if="item.xm=='合计'"></td>
						<td class="center" v-if="item.xm!='合计'" :contenteditable="item.jsmdseje.columnEdit==1" @blur="unfocus('table4','','','jsmdseje',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table4','','','jsmdseje',$event,'jshjje','','',index)})" v-text="item.jsmdseje.columnValue"></td>
						<td class="center" v-if="item.xm=='合计'"></td>
						<td class="center" v-if="item.xm!='合计'" :contenteditable="item.jsxfsje.columnEdit==1" @blur="unfocus('table4','','','jsxfsje',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table4','','','jsxfsje',$event,'jshjje','','',index)})" v-text="item.jsxfsje.columnValue"></td>
						<td class="center" v-if="item.xm=='合计'"></td>
						<td class="center" v-if="item.xm!='合计'" :contenteditable="item.jsyysje.columnEdit==1" @blur="unfocus('table4','','','jsyysje',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table4','','','jsyysje',$event,'jshjje','','',index)})" v-text="item.jsyysje.columnValue"></td>
						<td class="center" v-if="item.xm=='合计'"></td>
						<td class="center" v-if="item.xm!='合计'" :contenteditable="item.jshjje.columnEdit==1" @blur="unfocus('table4','','','jshjje',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table4','','','jshjje',$event,'jshjje','','',index)})" v-text="item.jshjje.columnValue"></td>
						<td class="center" v-if="item.xm=='合计'"></td>
						<td class="center" v-if="item.xm!='合计'">{{item.rate}}</td>
						<td class="center" v-if="item.xm=='合计'">——</td>
						<td class="center" :contenteditable="item.xm=='合计'?false:item.ynseje.columnEdit==1" @blur="unfocus('table4','','','ynseje',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table4','','','ynseje',$event,'jshjje','','',index)})">{{item.ynseje.columnValue}}</td>
						<td class="center" :contenteditable="item.xm=='合计'?false:item.jmxzdm.columnEdit==1" @blur="unfocus('table4','','','jmxzdm',$event,'','','',index)" @keydown.enter="(($event)=>{unfocus('table4','','','jmxzdm',$event,'','','',index)})" v-if="item.xm!='合计'">{{item.jmxzdm.columnValue}}</td>
						<td class="center" v-if="item.xm=='合计'">——</td>
						<td class="center" :contenteditable="item.xm=='合计'?false:item.jmseje.columnEdit==1" @blur="unfocus('table4','','','jmseje',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table4','','','jmseje',$event,'jshjje','','',index)})">{{item.jmseje.columnValue}}</td>
						<td class="center" :contenteditable="item.xm=='合计'?false:item.xgmjze.columnEdit==1" @blur="unfocus('table4','','','xgmjze',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table4','','','xgmjze',$event,'jshjje','','',index)})">{{item.xgmjze.columnValue}}</td>
						<td class="center" :contenteditable="item.xm=='合计'?false:item.yjseje.columnEdit==1" @blur="unfocus('table4','','','yjseje',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table4','','','yjseje',$event,'jshjje','','',index)})">{{item.yjseje.columnValue}}</td>
						<td class="center" :contenteditable="item.xm=='合计'?false:item.ybtseje.columnEdit==1" @blur="unfocus('table4','','','ybtseje',$event,'','','',index)" @keydown.enter="(($event)=>{unfocus('table4','','','ybtseje',$event,'','','',index)})">{{item.ybtseje.columnValue}}</td>
					</tr>
					<tr>
						<td class="center" colspan="2">计税依据修改原因</td>
						<td class="center" colspan="12"></td>
					</tr>
					<tr>
						<td class="center" colspan="14">以下由纳税人填写：</td>
					</tr>
					<tr>
						<td class="center" colspan="2">谨声明</td>
						<td class="center" colspan="12">本纳税申报表是根据国家税收法律法规及相关规定填报的，是真实的、可靠的、完整的。</td>
					</tr>
					<tr>
						<td class="center" colspan="2">经办人:</td>
						<td class="center"></td>
						<td class="center" colspan="6">经办人身份证号码: </td>
						<td class="center" colspan="5"></td>
					</tr>
					<tr>
						<td class="center" colspan="2">代理机构:</td>
						<td class="center"></td>
						<td class="center" colspan="6">代理机构统一社会信用代码: </td>
						<td class="center" colspan="5"></td>
					</tr>
				</table>
			</div>
			<div v-if="statusVaule=='文建税申报表'">
				<table border="1 " width="100% ">
					
					<tr>
						<td class="center" colspan="2">项目</td>
						<td class="center" style="width:1.4rem">栏次</td>
						<td class="center">本月（期）数</td>
						<td class="center">本年累计</td>
					</tr>
					<tr>
						<td rowspan="2">计费收入</td>
						<td class="">应征收入</td>
						<td class="center">1</td>
						<td class="center" :contenteditable="thisData.jfsryzsrbys.columnEdit==1" @blur="unfocus('table10','je','1','jfsryzsrbys',$event,'bys','')" @keydown.enter="(($event)=>{unfocus('table10','je','','jfsryzsrbys',$event,'dqsbdkjxsehj','')})" v-text="thisData.jfsryzsrbys.columnValue"></td>
						<td class="center" :contenteditable="thisData.jfsryzsrbnlj.columnEdit==1" @blur="unfocus('table10','se','1','jfsryzsrbnlj',$event,'bnlj','')" @keydown.enter="(($event)=>{unfocus('table10','se','','jfsryzsrbnlj',$event,'dqsbdkjxsehj','')})" v-text="thisData.jfsryzsrbnlj.columnValue"></td>
					</tr>
					<tr>
						<td>免征收入</td>
						<td class="center">2</td>
						
						<td class="center" :contenteditable="thisData.jfsrmzsrbys.columnEdit==1" @blur="unfocus('table10','je','2','jfsrmzsrbys',$event,'rzxfzzszyfpsbdk','')" @keydown.enter="(($event)=>{unfocus('table10','je','','jfsrmzsrbys',$event,'rzxfzzszyfpsbdk','')})" v-text="thisData.jfsrmzsrbys.columnValue"></td>
						<td class="center" :contenteditable="thisData.jfsrmzsrbnlj.columnEdit==1" @blur="unfocus('table10','se','2','jfsrmzsrbnlj',$event,'rzxfzzszyfpsbdk','')" @keydown.enter="(($event)=>{unfocus('table10','se','','jfsrmzsrbnlj',$event,'rzxfzzszyfpsbdk','')})" v-text="thisData.jfsrmzsrbnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="" rowspan="8">费额计算</td>
						<td class="">减除项目期初金额</td>
						<td class="center">3</td>
						
						<td class="center" :contenteditable="thisData.fejsjcxmqcjebys.columnEdit==1" @blur="unfocus('table10','je','3','fejsjcxmqcjebys',$event,'rzxfzzszyfpsbdk','')" @keydown.enter="(($event)=>{unfocus('table10','je','','fejsjcxmqcjebys',$event,'rzxfzzszyfpsbdk','')})" v-text="thisData.fejsjcxmqcjebys.columnValue"></td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td>减除项目本期发生额</td>
						<td class="center">4</td>
						<td class="center" :contenteditable="thisData.fejsjcxmbqfsebys.columnEdit==1" @blur="unfocus('table10','je','4','fejsjcxmbqfsebys',$event,'dqsbdkjxsehj','')" @keydown.enter="(($event)=>{unfocus('table10','je','','fejsjcxmbqfsebys',$event,'dqsbdkjxsehj','')})" v-text="thisData.fejsjcxmbqfsebys.columnValue"></td>
						<td class="center" :contenteditable="thisData.fejsjcxmbqfsebnlj.columnEdit==1" @blur="unfocus('table10','se','4','fejsjcxmbqfsebnlj',$event,'dqsbdkjxsehj','')" @keydown.enter="(($event)=>{unfocus('table10','se','','fejsjcxmbqfsebnlj',$event,'dqsbdkjxsehj','')})" v-text="thisData.fejsjcxmbqfsebnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="">本期减除额 - 应征收入减除额</td>
						<td class="center">5</td>
						
						<td class="center" :contenteditable="thisData.fejsbqjceyzsrjcebys.columnEdit==1" @blur="unfocus('table10','je','5','fejsbqjceyzsrjcebys',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table10','je','','fejsbqjceyzsrjcebys',$event,'qtkspz','')})" v-text="thisData.fejsbqjceyzsrjcebys.columnValue"></td>
						<td class="center" :contenteditable="thisData.fejsbqjceyzsrjcebnlj.columnEdit==1" @blur="unfocus('table10','se','5','fejsbqjceyzsrjcebnlj',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table10','se','','fejsbqjceyzsrjcebnlj',$event,'qtkspz','')})" v-text="thisData.fejsbqjceyzsrjcebnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="">本期减除额 - 免征收入减除额</td>
						<td class="center">6</td>
						
						<td class="center" :contenteditable="thisData.fejsbqjcemzsrjcebys.columnEdit==1" @blur="unfocus('table10','je','6','fejsbqjcemzsrjcebys',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table10','je','','fejsbqjcemzsrjcebys',$event,'qtkspz','')})" v-text="thisData.fejsbqjcemzsrjcebys.columnValue"></td>
						<td class="center" :contenteditable="thisData.fejsbqjcemzsrjcebnlj.columnEdit==1" @blur="unfocus('table10','se','6','fejsbqjcemzsrjcebnlj',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table10','se','','fejsbqjcemzsrjcebnlj',$event,'qtkspz','')})" v-text="thisData.fejsbqjcemzsrjcebnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="">减除项目期末余额</td>
						<td class="center">7=3+4-5-6</td>
						<td class="center" :contenteditable="thisData.fejsjcxmqmyebys.columnEdit==1" @blur="unfocus('table10','fs','7','fejsjcxmqmyebys',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table10','fs','','fejsjcxmqmyebys',$event,'qtkspz','')})" v-text="thisData.fejsjcxmqmyebys.columnValue"></td>
						
						<td class="center" :contenteditable="thisData.fejsjcxmqmyebnlj.columnEdit==1" @blur="unfocus('table10','se','7','fejsjcxmqmyebnlj',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table10','se','','fejsjcxmqmyebnlj',$event,'qtkspz','')})" v-text="thisData.fejsjcxmqmyebnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="">计费销售额 </td>
						<td class="center">8=1-5</td>
						
						<td class="center" :contenteditable="thisData.fejsjfxsebys.columnEdit==1" @blur="unfocus('table10','se','8','fejsjfxsebys',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table10','se','','fejsjfxsebys',$event,'qtkspz','')})" v-text="thisData.fejsjfxsebys.columnValue"></td>
						<td class="center" :contenteditable="thisData.fejsjfxsebnlj.columnEdit==1" @blur="unfocus('table10','se','8','fejsjfxsebnlj',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table10','se','','fejsjfxsebnlj',$event,'qtkspz','')})" v-text="thisData.fejsjfxsebnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="">费率</td>
						<td class="center">9</td>
						
						<td class="center" :contenteditable="thisData.fejsflbys.columnEdit==1" @blur="unfocus('table10','je','9','fejsflbys',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table10','je','','fejsflbys',$event,'qtkspz','')})" v-text="thisData.fejsflbys.columnValue"></td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td class="">应缴费额</td>
						<td class="center">10=8*9</td>
						
						<td class="center" :contenteditable="thisData.fejsyjfebys.columnEdit==1" @blur="unfocus('table10','je','10','fejsyjfebys',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table10','je','','fejsyjfebys',$event,'qtkspz','')})" v-text="thisData.fejsyjfebys.columnValue"></td>
						<td class="center" :contenteditable="thisData.fejsyjfebnlj.columnEdit==1" @blur="unfocus('table10','se','10','fejsyjfebnlj',$event,'qtkspz','')" @keydown.enter="(($event)=>{unfocus('table10','se','','fejsyjfebnlj',$event,'qtkspz','')})" v-text="thisData.fejsyjfebnlj.columnValue"></td>
					</tr>
					
					<tr>
						<td rowspan="9">费额缴纳</td>
						<td class="">期初未缴费额（多缴为负）</td>
						<td class="center">11</td>
						
						<td class="center" :contenteditable="thisData.fejnqcwjfebys.columnEdit==1" @blur="unfocus('table10','je','11','fejnqcwjfebys',$event,'','')" @keydown.enter="(($event)=>{unfocus('table10','je','','fejnqcwjfebys',$event,'','')})" v-text="thisData.fejnqcwjfebys.columnValue"></td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td>本期已缴费额</td>
						<td class="center">12=13+14+15</td>
						
						
						<td class="center" :contenteditable="thisData.fejnbqyjfebys.columnEdit==1" @blur="unfocus('table10','se','12','fejnbqyjfebys',$event,'dqsbdkjxsehj','')" @keydown.enter="(($event)=>{unfocus('table10','se','','fejnbqyjfebys',$event,'dqsbdkjxsehj','')})" v-text="thisData.fejnbqyjfebys.columnValue"></td>
						<td class="center" :contenteditable="thisData.fejnbqyjfebnlj.columnEdit==1" @blur="unfocus('table10','se','12','fejnbqyjfebnlj',$event,'dqsbdkjxsehj','')" @keydown.enter="(($event)=>{unfocus('table10','se','','fejnbqyjfebnlj',$event,'dqsbdkjxsehj','')})" v-text="thisData.fejnbqyjfebnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">其中：本期预缴费额</td>
						<td class="center">13</td>
						
						<td class="center" :contenteditable="thisData.fejnqzbqyjfebys.columnEdit==1" @blur="unfocus('table10','je','13','fejnqzbqyjfebys',$event,'','')" @keydown.enter="(($event)=>{unfocus('table10','je','','fejnqzbqyjfebys',$event,'','')})" v-text="thisData.fejnqzbqyjfebys.columnValue"></td>
						<td class="center" :contenteditable="thisData.fejnqzbqyjfebnlj.columnEdit==1" @blur="unfocus('table10','se','13','fejnqzbqyjfebnlj',$event,'','')" @keydown.enter="(($event)=>{unfocus('table10','se','','fejnqzbqyjfebnlj',$event,'','')})" v-text="thisData.fejnqzbqyjfebnlj.columnValue"></td>
					</tr>
					<tr>
						<td>本期缴纳上期费额</td>
						<td class="center">14</td>
						
						<td class="center" :contenteditable="thisData.fejnbqjnsqfebys.columnEdit==1" @blur="unfocus('table10','je','14','fejnbqjnsqfebys',$event,'','')" @keydown.enter="(($event)=>{unfocus('table10','je','','fejnbqjnsqfebys',$event,'','')})" v-text="thisData.fejnbqjnsqfebys.columnValue"></td>
						<td class="center" :contenteditable="thisData.fejnbqjnsqfebnlj.columnEdit==1" @blur="unfocus('table10','se','14','fejnbqjnsqfebnlj',$event,'','')" @keydown.enter="(($event)=>{unfocus('table10','se','','fejnbqjnsqfebnlj',$event,'','')})" v-text="thisData.fejnbqjnsqfebnlj.columnValue"></td>
					</tr>
					<tr>
						<td>本期缴纳欠费额</td>
						<td class="center">15</td>
						
						<td class="center" :contenteditable="thisData.fejnbqjnqfebys.columnEdit==1" @blur="unfocus('table10','je','15','fejnbqjnqfebys',$event,'','')" @keydown.enter="(($event)=>{unfocus('table10','je','','fejnbqjnqfebys',$event,'','')})" v-text="thisData.fejnbqjnqfebys.columnValue"></td>
						<td class="center" :contenteditable="thisData.fejnbqjnqfebnlj.columnEdit==1" @blur="unfocus('table10','se','15','fejnbqjnqfebnlj',$event,'','')" @keydown.enter="(($event)=>{unfocus('table10','se','','fejnbqjnqfebnlj',$event,'','')})" v-text="thisData.fejnbqjnqfebnlj.columnValue"></td>
					</tr>
					<tr>
						<td>期末未缴费额（多缴为负）</td>
						<td class="center">16=10+11-12</td>
						
						<td class="center" :contenteditable="thisData.fejnqmwjfebys.columnEdit==1" @blur="unfocus('table10','je','16','fejnqmwjfebys',$event,'','')" @keydown.enter="(($event)=>{unfocus('table10','je','','fejnqmwjfebys',$event,'','')})" v-text="thisData.fejnqmwjfebys.columnValue"></td>
						<td class="center" :contenteditable="thisData.fejnqmwjfebnlj.columnEdit==1" @blur="unfocus('table10','se','16','fejnqmwjfebnlj',$event,'','')" @keydown.enter="(($event)=>{unfocus('table10','se','','fejnqmwjfebnlj',$event,'','')})" v-text="thisData.fejnqmwjfebnlj.columnValue"></td>
					</tr>
					<tr>
						<td class="padL">其中：欠缴费额（>=0）</td>
						<td class="center">17=11-14-15</td>
						
						<td class="center" :contenteditable="thisData.fejnqzqjfebys.columnEdit==1" @blur="unfocus('table10','je','17','fejnqzqjfebys',$event,'','')" @keydown.enter="(($event)=>{unfocus('table10','je','','fejnqzqjfebys',$event,'','')})" v-text="thisData.fejnqzqjfebys.columnValue"></td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td>本期应补（退）费额</td>
						<td class="center">18=10×（1-减征比例）-13</td>
						
						<td class="center" :contenteditable="thisData.fejnbqybtfebys.columnEdit==1" @blur="unfocus('table10','je','18','fejnbqybtfebys',$event,'','')" @keydown.enter="(($event)=>{unfocus('table10','je','','fejnbqybtfebys',$event,'','')})" v-text="thisData.fejnbqybtfebys.columnValue"></td>
						<td class="center">——</td>
					</tr>
					<tr>
						<td>本期检查已补缴费额</td>
						<td class="center">19</td>
						
						<td class="center" :contenteditable="thisData.fejnbqjcybjfebys.columnEdit==1" @blur="unfocus('table10','je','19','fejnbqjcybjfebys',$event,'','')" @keydown.enter="(($event)=>{unfocus('table10','je','','fejnbqjcybjfebys',$event,'','')})" v-text="thisData.fejnbqjcybjfebys.columnValue"></td>
						<td class="center" :contenteditable="thisData.fejnbqjcybjfebnlj.columnEdit==1" @blur="unfocus('table10','se','19','fejnbqjcybjfebnlj',$event,'','')" @keydown.enter="(($event)=>{unfocus('table10','se','','fejnbqjcybjfebnlj',$event,'','')})" v-text="thisData.fejnbqjcybjfebnlj.columnValue"></td>
					</tr>
					
				</table>
			</div>
			<div v-if="statusVaule=='印花税申报表'">
				<table border="1 " width="100% ">
					<tr>
						<td class="center" rowspan="3">应税凭证</td>
						<td class="center" rowspan="2">计税金额或件数</td>
						<td class="center" colspan="2">核定征收</td>
						<td class="center" rowspan="2">适用税率</td>
						<td class="center" rowspan="2">本期应纳税额</td>
						<td class="center" rowspan="2">本期已缴税额</td>
						<td class="center" colspan="2">本期减免税额</td>
						<td class="center" rowspan="2">增值税小规模纳税人减征额</td>
						<td class="center" rowspan="2">本期应补（退）税额</td>
					</tr>
					<tr>
						<td class="center" >核定依据</td>
						<td class="center" >核定比例</td>
						<td class="center" >减免性质代码</td>
						<td class="center" >减免税额</td>
					</tr>
					
					<tr>
						<td class="center">1</td>
						<td class="center">2</td>
						<td class="center">3</td>
						<td class="center">4</td>
						<td class="center">5=1×4+2×3×4 </td>
						<td class="center">6</td>
						<td class="center">7</td>
						<td class="center">8</td>
						<td class="center">9</td>
						<td class="center">10=5-6-8-9</td>
					</tr>
					<tr v-for="(item,index) in thisData" :key="index">
						<td class="center">{{item.yspz}}</td>
						<td class="center" v-if="item.yspz!='合计'" contenteditable="true" @blur="unfocus('table11','','','jsjehjs',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','jsjehjs',$event,'jshjje','','',index)})" v-text="item.jsjehjs"></td>
						<td class="center" v-if="item.yspz=='合计'">——</td>
						<td class="center" v-if="item.yspz!='合计'" contenteditable="true" @blur="unfocus('table11','','','hdzshdyj',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','hdzshdyj',$event,'jshjje','','',index)})" v-text="item.hdzshdyj"></td>
						<td class="center" v-if="item.yspz=='合计'">——</td>
						<td class="center" v-if="item.yspz!='合计'" contenteditable="true" @blur="unfocus('table11','','','hdzshdbl',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','hdzshdbl',$event,'jshjje','','',index)})" v-text="item.hdzshdbl"></td>
						<td class="center" v-if="item.yspz=='合计'">——</td>
						<td class="center" v-if="item.yspz!='合计'" contenteditable="true" @blur="unfocus('table11','','','sysl',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','sysl',$event,'jshjje','','',index)})" v-text="item.sysl"></td>
						<td class="center" v-if="item.yspz=='合计'">——</td>
						<td class="center">{{item.bqynse.toFixed(2)}}</td>
						
						<td class="center" contenteditable="true" @blur="unfocus('table11','','','bqyjse',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','bqyjse',$event,'jshjje','','',index)})" v-text="item.bqyjse"></td>
						
						<td class="center" v-if="item.yspz!='合计'">{{item.bqjmsejmxzdm}}</td>
						<td class="center" v-if="item.yspz=='合计'">——</td>
						
						
						<td class="center" contenteditable="true" @blur="unfocus('table11','','','bqjmsejmse',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','bqjmsejmse',$event,'jshjje','','',index)})">{{item.bqjmsejmse}}</td>
						<td class="center" contenteditable="true" @blur="unfocus('table11','','','zzsxgmnsrjze',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','zzsxgmnsrjze',$event,'jshjje','','',index)})">{{item.zzsxgmnsrjze}}</td>
						<td class="center" contenteditable="true" @blur="unfocus('table11','','','bqybtse',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','bqybtse',$event,'jshjje','','',index)})">{{item.bqybtse.toFixed(1)}}</td>
						
					</tr>
					<!-- <tr>
						<td class="center" colspan="2">计税依据修改原因</td>
						<td class="center" colspan="12"></td>
					</tr> -->
					<tr>
						<td class="center" colspan="14">以下由纳税人填写：</td>
					</tr>
					<tr>
						<td class="center" colspan="2">谨声明</td>
						<td class="center" colspan="12">本纳税申报表是根据国家税收法律法规及相关规定填报的，是真实的、可靠的、完整的。</td>
					</tr>
					<tr>
						<td class="center" colspan="2">经办人:</td>
						<td class="center"></td>
						<td class="center" colspan="6">经办人身份证号码: </td>
						<td class="center" colspan="5"></td>
					</tr>
					<tr>
						<td class="center" colspan="2">代理机构:</td>
						<td class="center"></td>
						<td class="center" colspan="6">代理机构统一社会信用代码: </td>
						<td class="center" colspan="5"></td>
					</tr>
				</table>
			</div>
			
			<div v-if="statusVaule=='增值税减免税申报明细表'">
				<table border="1 " width="100% ">
					<tr>
						<td class="center" colspan="7">一、减税项目</td>
						
						
					</tr>
					<tr>
						<td class="center" rowspan="2" style="width:400px">减税性质代码及名称</td>
						<td class="center" rowspan="2">栏次</td>
						<td class="center">期初余额</td>
						<td class="center">本期发生额</td>
						<td class="center">本期应抵减税额</td>
						<td class="center">本期实际抵减税额</td>
						<td class="center">期末余额</td>
						
					</tr>
					<tr>
						<td class="center" >1</td>
						<td class="center" >2</td>
						<td class="center" >3=1+2</td>
						<td class="center" >4<=3</td>
						<td class="center" >5=3-4</td>
					</tr>
					
					<tr>
						<td class="center">合计</td>
						<td class="center">1</td>
						<td class="center" v-text="thisData[1].qcyehzmzzzsxmxse"></td>
						<td class="center" v-text="thisData[1].bqfsehzmsxsekcxmbqsjkcje"></td>
						<td class="center" v-text="thisData[1].bqydjsehzkchmsxse"></td>
						<td class="center" v-text="thisData[1].bqsjdjsehzmsxsedydjxse"></td>
						<td class="center" v-text="thisData[1].qmyehzmse"></td>
					</tr>
					<tr v-for="(item,index) in thisData" v-if='item.projectType == 1'>
						<td class="center">
							<el-select v-model="item.codeName" size="mini" style="width: 380px" @change="(val)=>changeSelect(val,'codeName',index)">
								<el-option v-for="item in jianshuiList" :label="item.freeCodeName" :value="item.freeCodeName"></el-option>
								
							</el-select>
						</td>
						<td class="center">{{index + 2}}</td>
						<td class="center" contenteditable="true" @blur="unfocus('table111','','1','qcyehzmzzzsxmxse',$event,'','','',index)" @keydown.enter="(($event)=>{unfocus('table111','','','qcyehzmzzzsxmxse',$event,'','','',index)})" v-text="item.qcyehzmzzzsxmxse"></td>
						<td class="center" contenteditable="true" @blur="unfocus('table111','','2','bqfsehzmsxsekcxmbqsjkcje',$event,'','','',index)" @keydown.enter="(($event)=>{unfocus('table111','','','bqfsehzmsxsekcxmbqsjkcje',$event,'','','',index)})" v-text="item.bqfsehzmsxsekcxmbqsjkcje"></td>
						<td class="center" contenteditable="false" @blur="unfocus('table111','','','bqydjsehzkchmsxse',$event,'','','',index)" @keydown.enter="(($event)=>{unfocus('table111','','','bqydjsehzkchmsxse',$event,'','','',index)})" v-text="item.bqydjsehzkchmsxse"></td>
						<td class="center" contenteditable="true" @blur="unfocus('table111','','4','bqsjdjsehzmsxsedydjxse',$event,'','','',index)" @keydown.enter="(($event)=>{unfocus('table111','','','bqsjdjsehzmsxsedydjxse',$event,'','','',index)})" v-text="item.bqsjdjsehzmsxsedydjxse"></td>
						<td class="center" contenteditable="false" @blur="unfocus('table111','','','qmyehzmse',$event,'','','',index)" @keydown.enter="(($event)=>{unfocus('table111','','','qmyehzmse',$event,'','','',index)})" v-text="item.qmyehzmse"></td>
						<!-- <td class="center">{{item.qcyehzmzzzsxmxse.columnValue}}</td>
						<td class="center">{{item.bqfsehzmsxsekcxmbqsjkcje.columnValue}}</td>
						<td class="center">{{item.bqydjsehzkchmsxse.columnValue}}</td>
						<td class="center">{{item.bqsjdjsehzmsxsedydjxse.columnValue}}</td>
						<td class="center">{{item.qmyehzmse.columnValue}}</td> -->
					</tr>
					<tr>
						<td class="center" colspan="7">二、免税项目</td>
						
						
					</tr>
					<tr>
						<td class="center" rowspan="2">免税性质代码及名称</td>
						<td class="center" rowspan="2">栏次</td>
						<td class="center">免征增值税项目销售额</td>
						<td class="center">免税销售额扣除项目本期实际扣除金额</td>
						<td class="center">扣除后免税销售额</td>
						<td class="center">免税销售额对应的进项税额</td>
						<td class="center">免税额</td>
						
					</tr>
					<tr>
						<td class="center" >1</td>
						<td class="center" >2</td>
						<td class="center" >3=1-2</td>
						<td class="center" >4</td>
						<td class="center" >5</td>
					</tr>
					<tr>
						<td class="center">合计</td>
						<td class="center">1</td>
						<td class="center">{{thisData[0].qcyehzmzzzsxmxse}}</td>
						<td class="center">{{thisData[0].bqfsehzmsxsekcxmbqsjkcje}}</td>
						<td class="center">{{thisData[0].bqydjsehzkchmsxse}}</td>
						<td class="center">{{thisData[0].bqsjdjsehzmsxsedydjxse}}</td>
						<td class="center">{{thisData[0].qmyehzmse}}</td>
					</tr>
					<tr v-for="(item,index) in thisData" v-if='item.projectType == 2'>
						<td class="center">
							<el-select v-model="item.codeName" size="mini" style="width: 380px" @change="(val)=>changeSelect(val,'codeName',index)">
								<el-option v-for="item in mianshuiList" :label="item.freeCodeName" :value="item.freeCodeName"></el-option>
								
							</el-select>
						</td>
						<td class="center">{{index + 2}}</td>
						<td class="center" contenteditable="true" @blur="unfocus('table112','','1','qcyehzmzzzsxmxse',$event,'','','',index)" @keydown.enter="(($event)=>{unfocus('table112','','','qcyehzmzzzsxmxse',$event,'','','',index)})" v-text="item.qcyehzmzzzsxmxse"></td>
						<td class="center" contenteditable="true" @blur="unfocus('table112','','2','bqfsehzmsxsekcxmbqsjkcje',$event,'','','',index)" @keydown.enter="(($event)=>{unfocus('table112','','','bqfsehzmsxsekcxmbqsjkcje',$event,'','','',index)})" v-text="item.bqfsehzmsxsekcxmbqsjkcje"></td>
						<td class="center" contenteditable="false" @blur="unfocus('table112','','','bqydjsehzkchmsxse',$event,'','','',index)" @keydown.enter="(($event)=>{unfocus('table112','','','bqydjsehzkchmsxse',$event,'','','',index)})" v-text="item.bqydjsehzkchmsxse"></td>
						<td class="center" contenteditable="true" @blur="unfocus('table112','','','bqsjdjsehzmsxsedydjxse',$event,'','','',index)" @keydown.enter="(($event)=>{unfocus('table112','','','bqsjdjsehzmsxsedydjxse',$event,'','','',index)})" v-text="item.bqsjdjsehzmsxsedydjxse"></td>
						<td class="center" contenteditable="true" @blur="unfocus('table112','','','qmyehzmse',$event,'','','',index)" @keydown.enter="(($event)=>{unfocus('table112','','','qmyehzmse',$event,'','','',index)})" v-text="item.qmyehzmse"></td>
					</tr>
					<!-- <tr v-for="(item,index) in thisData" :key="index">
						<td class="center">{{item.yspz}}</td>
						<td class="center" v-if="item.yspz!='合计'" contenteditable="true" @blur="unfocus('table11','','','jsjehjs',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','jsjehjs',$event,'jshjje','','',index)})" v-text="item.jsjehjs"></td>
						<td class="center" v-if="item.yspz=='合计'">——</td>
						<td class="center" v-if="item.yspz!='合计'" contenteditable="true" @blur="unfocus('table11','','','hdzshdyj',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','hdzshdyj',$event,'jshjje','','',index)})" v-text="item.hdzshdyj"></td>
						<td class="center" v-if="item.yspz=='合计'">——</td>
						<td class="center" v-if="item.yspz!='合计'" contenteditable="true" @blur="unfocus('table11','','','hdzshdbl',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','hdzshdbl',$event,'jshjje','','',index)})" v-text="item.hdzshdbl"></td>
						<td class="center" v-if="item.yspz=='合计'">——</td>
						<td class="center" v-if="item.yspz!='合计'" contenteditable="true" @blur="unfocus('table11','','','sysl',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','sysl',$event,'jshjje','','',index)})" v-text="item.sysl"></td>
						<td class="center" v-if="item.yspz=='合计'">——</td>
						<td class="center"  v-text="item.bqynse"></td>
						
						<td class="center" contenteditable="true" @blur="unfocus('table11','','','bqyjse',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','bqyjse',$event,'jshjje','','',index)})" v-text="item.bqyjse"></td>
						
						<td class="center" v-if="item.yspz!='合计'">{{item.bqjmsejmxzdm}}</td>
						<td class="center" v-if="item.yspz=='合计'">——</td>
						
						
						<td class="center" contenteditable="true" @blur="unfocus('table11','','','bqjmsejmse',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','bqjmsejmse',$event,'jshjje','','',index)})">{{item.bqjmsejmse}}</td>
						<td class="center" contenteditable="true" @blur="unfocus('table11','','','zzsxgmnsrjze',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','zzsxgmnsrjze',$event,'jshjje','','',index)})">{{item.zzsxgmnsrjze}}</td>
						<td class="center" contenteditable="true" @blur="unfocus('table11','','','bqybtse',$event,'jshjje','','',index)" @keydown.enter="(($event)=>{unfocus('table11','','','bqybtse',$event,'jshjje','','',index)})">{{item.bqybtse}}</td>
						
					</tr> -->
					
					
				</table>
			</div>
			
			
		</div>
	</div>
</template>

<script>
	// import FileSaver from 'file-saver'
	// import XLSX from 'xlsx'
	export default {
		name: "showReport",
		data() {
			return {
				mianshuiList:[],
				jianshuiList:[],
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
					statusVaule: "一般纳税人主表"
				},
				accountPeriod: "",
				customerId: "",
				statusVaule: "一般纳税人主表",
				uploadData: {
					shuikuanDate: "",
					tianbiaoDate: "",
					taxerNumber: "",
					trade: "",
					taxerName: "",
					legalName: "",
					registerAddress: "",
					runAddress: "",
					bank: "",
					registerType: "",
					phone: "",
					isReduce: "否",
					chengshiRate: "0",
					jiaoyuRate: "0",
					difangRate: "0"
				},
				lastData: {},
				thisData: {},
				officeName: "",
				receiveName: "",
				receiveDate: "",
				arate: "",
				brate: "",
				crate: "",
				DataObj: {},
				total1: "",
				total2: "",
				total3: "",
				total4: "",
				total5: "",
				total6: "",
				taxationid: "",
				taxinfoid: "",
				userobj: {
					reportTaxType: 233
				},
				showFlag: false,
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
				}
			};
		},
		watch: {
			'$route'(to, from) {
				// init data
				if (to.name == 'showReport') {
					if(this.$route.query.customerId && this.$route.query.accountPeriod){
						this.selectGet(this.$route.query.customerId);
						this.searchList.nowDate = this.$route.query.accountPeriod;
						// this.searchList.nowDate = this.$route.query.accountPeriod;
						// this.searchList.value = this.$route.query.customerId;
						// this.userobj.reportTaxType = this.$route.query.reportTaxType;
						// if(this.userobj.reportTaxType == 233) {
						// 	this.searchList.statusVaule = "一般纳税人主表";
						// 	this.statusVaule = "一般纳税人主表";
						// }
						// if(this.userobj.reportTaxType == 232) {
						// 	this.searchList.statusVaule = "小规模纳税人主表";
						// 	this.statusVaule = "小规模纳税人主表";
						// }
						this.$nextTick(function(){
							this.search('formSearch');
						})
						
					}
					
				}
					
			}
		},
		computed: {},
		mounted() {
			// this.searchList.options = this.$store.state.cust;
			// this.searchList.options = [{
			//     customerId: "jz3779",
			//     customerName: "九洲APP测试专用",
			//     reportTaxPeriod: null,
			//     reportTaxType: 232,
			//     taxPayerId: "11111111111111111111",
			// }, {
			//     customerId: "jz3774",
			//     customerName: "44",
			//     reportTaxPeriod: null,
			//     reportTaxType: 233,
			//     taxPayerId: "2222222222",
			// }]

			// this.getNowMonth();
			// this.getInfoId();
			// this.taxinfoid = '1';
			// this.getTableData(this.statusVaule);
		},
		methods: {
			changeSelect(val,dataName,index){
				this.$set(this.thisData[index],dataName,val);
				this.submitEdit(index);
			},
			getmianshuiList(state){
				let params = {
					state:state
				};
				this.axios.post('/perTaxToolTwo/e9z/configTaxFree/getValidTaxFreeList',this.qs.stringify(params))
					.then(res => {
						if (res.data.code == 200) {
							if(state == 1){
								this.mianshuiList = res.data.data;
							}else{
								this.jianshuiList = res.data.data;
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
			listen(event) {
				if(event.keyCode === 13) {
					// this.send() // 发送文本
					console.log("tijiaole ");
					event.preventDefault(); // 阻止浏览器默认换行操作
					return false;
				}
			},

			blurTop(name, e) {
				if(name == "isReduce") {
					this.uploadData.isReduce = e.target.innerText;
				} else if(name == "chengshiRate") {
					this.uploadData.chengshiRate = e.target.innerText;
				} else if(name == "jiaoyuRate") {
					this.uploadData.jiaoyuRate = e.target.innerText;
				} else if(name == "difangRate") {
					this.uploadData.difangRate = e.target.innerText;
				}
				console.log("this.uploadData", this.uploadData);
			},
			selectGet(vId) {
				this.userobj = {};
				var cust = JSON.parse(sessionStorage.getItem('updateCust'));
				// var cust = JSON.parse(JSON.stringify(this.$store.state.cust));
				this.userobj = cust.find(item => {
					//这里的selectList就是上面遍历的数据源
					return item.customerId === vId; //筛选出匹配数据
				});
				// this.userobj = this.searchList.options.find(item => {
				//   //这里的selectList就是上面遍历的数据源
				//   return item.customerId === vId; //筛选出匹配数据
				// });
				console.log("this.userobj", this.userobj);
				this.searchList.value = this.userobj.customerId;
				this.customerId = this.userobj.customerId;
				this.uploadData.taxerNumber = this.userobj.taxPayerId;
				console.log("当前选择的用户信息", this.userobj); //
				if(this.userobj.reportTaxType == 233) {
					this.searchList.statusVaule = "一般纳税人主表";
					this.statusVaule = "一般纳税人主表";
				}
				if(this.userobj.reportTaxType == 232) {
					this.searchList.statusVaule = "小规模纳税人主表";
					this.statusVaule = "小规模纳税人主表";
				}
				// this.getInfoId();
				// this.getTableData(this.statusVaule);
			},
			getInfoId() {
				let params = {
					accountPeriod: this.accountPeriod, //账期
					customerId: this.customerId, //客户Id
					// stepName: "税款审核" //步骤名称
					stepName: "发票录入" //步骤名称
				};
				// this.taxationid, tax_info_id;
				this.axios
					.post("/perTaxToolTwo/e9zCalculate/getTaxInfo", params)
					.then(res => {
						console.log("获取收账信息Id和税款信息id", res);
						if(res.data.code == 200) {
							if(res.data.hasOwnProperty("data")) {
								// 在这里获取收账税款id
								this.taxationid = res.data.data.taxation_id;
								this.taxinfoid = res.data.data.tax_info_id;
								this.showFlag = true;
								if(res.data.data.declaration_cycle == 1){
									
									var lastDay = new Date(
										this.accountPeriod.split("-")[0],
										this.accountPeriod.split("-")[1],
										0
									);
									var year = lastDay.getFullYear();
									var month = lastDay.getMonth() + 1;
									if(month>=1 && month <=3){
										var startDay = year + "-" + '01' + "-01";
										var endDay = year + "-" + '03' + "-" + '31';
									}else if(month>=4 && month <=6){
										var startDay = year + "-" + '04' + "-01";
										var endDay = year + "-" + '06' + "-" + '30';
									}else if(month>=7 && month <=9){
										var startDay = year + "-" + '07' + "-01";
										var endDay = year + "-" + '09' + "-" + '30';
									}else if(month>=10 && month <=12){
										var startDay = year + "-" + '10' + "-01";
										var endDay = year + "-" + '12' + "-" + '31';
									}
									
									// var day = lastDay.getDate();
									// day = day < 10 ? "0" + day : day;
									
									this.uploadData.shuikuanDate = [startDay, endDay];
								}else{
									var lastDay = new Date(
										this.accountPeriod.split("-")[0],
										this.accountPeriod.split("-")[1],
										0
									);
									var year = lastDay.getFullYear();
									var month = lastDay.getMonth() + 1;
									month = month < 10 ? "0" + month : month;
									var day = lastDay.getDate();
									day = day < 10 ? "0" + day : day;
									var startDay = year + "-" + month + "-01";
									var endDay = year + "-" + month + "-" + day;
									this.uploadData.shuikuanDate = [startDay, endDay];
								}
								
								this.getTableData(this.statusVaule);
							} else {
								this.$message({
									message: "暂无报表数据，请重新选择搜索条件！",
									type: "warning"
								});
								this.showFlag = false;
							}
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
			downLoad(formName) {
				this.$refs[formName].validate(valid => {
					if(valid) {
						if(this.userobj.reportTaxType == 233) {
							window.location.href = '《增值税纳税申报表模板（一般纳税人适用）》.xls'
						} else if(this.userobj.reportTaxType == 232) {
							window.location.href = '《增值税纳税申报表模板（小规模纳税人适用）》.xls'
						}
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			outputFile(formName) {
				this.$refs[formName].validate(valid => {
					if(valid) {
						console.log("this.searchList", this.searchList);
						if(this.taxinfoid == "") {
							this.$message({
								message: "无数据时不支持导出报表操作",
								type: "warning"
							});
							return;
						}
						console.log("uploadData", this.uploadData);
						let params = {};
						let url = "";
						console.log("this.taxinfoid", this.taxinfoid);
						if(this.userobj.reportTaxType == 233) {
							// 判断表格是否都有数据
							this.axios
								.post(
									"/perTaxToolTwo/e9zReportSb/checkYbExport?taxInfoId=" +
									this.taxinfoid
								)
								.then(res => {
									if(res.data.code == 200) {
										//   一般纳税人
										params = {
											taxInfoId: this.taxinfoid,
											taxStartdate: this.uploadData.shuikuanDate ?
												this.uploadData.shuikuanDate[0] :
												"",
											taxEnddate: this.uploadData.shuikuanDate ?
												this.uploadData.shuikuanDate[1] :
												"",
											inputdate: this.uploadData.tianbiaoDate,
											taxPayerId: this.userobj.taxPayerId,
											trade: this.uploadData.trade,
											taxname: this.uploadData.taxerName,
											legalname: this.uploadData.legalName,
											registerAddress: this.uploadData.registerAddress,
											runAddress: this.uploadData.runAddress,
											bank: this.uploadData.bank,
											registerType: this.uploadData.registerType,
											phone: this.uploadData.phone,
											isReduce: this.uploadData.isReduce,
											chengshiRate: this.uploadData.chengshiRate,
											jiaoyuRate: this.uploadData.jiaoyuRate,
											difangRate: this.uploadData.difangRate
										};
										url = "/perTaxToolTwo/e9zReportSb/export";
										window.location.href =
											url +
											"?taxInfoId=" +
											params.taxInfoId +
											"&taxStartdate=" +
											params.taxStartdate +
											"&taxEnddate=" +
											params.taxEnddate +
											"&inputdate=" +
											params.inputdate +
											"&taxPayerId=" +
											params.taxPayerId +
											"&trade=" +
											params.trade +
											"&taxname=" +
											params.taxname +
											"&legalname=" +
											params.legalname +
											"&registerAddress=" +
											params.registerAddress +
											"&runAddress=" +
											params.runAddress +
											"&bank=" +
											params.bank +
											"&registerType=" +
											params.registerType +
											"&phone=" +
											params.phone +
											"&isReduce=" +
											params.isReduce +
											"&chengshiRate=" +
											params.chengshiRate +
											"&jiaoyuRate=" +
											params.jiaoyuRate +
											"&difangRate=" +
											params.difangRate;
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
								});
						} else if(this.userobj.reportTaxType == 232) {
							// 判断表格是否都有数据
							this.axios
								.post(
									"/perTaxToolTwo/e9zReportSb/checkXgmExport?taxInfoId=" +
									this.taxinfoid
								)
								.then(res => {
									if(res.data.code == 200) {
										params = {
											taxInfoId: this.taxinfoid,
											taxStartdate: this.uploadData.shuikuanDate ?
												this.uploadData.shuikuanDate[0] :
												"",
											taxEnddate: this.uploadData.shuikuanDate ?
												this.uploadData.shuikuanDate[1] :
												"",
											inputdate: this.uploadData.tianbiaoDate,
											taxPayerId: this.userobj.taxPayerId,
											taxname: this.uploadData.taxerName,
											isReduce: this.uploadData.isReduce,
											chengshiRate: this.uploadData.chengshiRate,
											jiaoyuRate: this.uploadData.jiaoyuRate,
											difangRate: this.uploadData.difangRate
										};
										url = "/perTaxToolTwo/e9zReportSb/xgmexport";
										console.log("params", params);
										window.location.href =
											url +
											"?taxInfoId=" +
											params.taxInfoId +
											"&taxStartdate=" +
											params.taxStartdate +
											"&taxEnddate=" +
											params.taxEnddate +
											"&inputdate=" +
											params.inputdate +
											"&taxPayerId=" +
											params.taxPayerId +
											"&taxname=" +
											params.taxname +
											"&isReduce=" +
											params.isReduce +
											"&chengshiRate=" +
											params.chengshiRate +
											"&jiaoyuRate=" +
											params.jiaoyuRate +
											"&difangRate=" +
											params.difangRate;
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
								});
						}
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
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
				if(month >= 1 && month <= 9) {
					month = "0" + month;
				}
				if(strDate >= 0 && strDate <= 9) {
					strDate = "0" + strDate;
				}
				var currentdate = year + seperator1 + month + seperator1 + strDate;
				return currentdate;
			},
			// 获取表格数据
			getTableData(statusVaule) {
				let params = {};
				let url;
				if(statusVaule == "一般纳税人主表") {
					url =
						"/perTaxToolTwo/e9zReportSb/showReportSb1?taxInfoId=" +
						this.taxinfoid;
				} else if(statusVaule == "一般纳税人附表一") {
					url =
						"/perTaxToolTwo/e9zReportSb/showReportSb2?taxInfoId=" +
						this.taxinfoid;
				} else if(statusVaule == "一般纳税人附表二") {
					url =
						"/perTaxToolTwo/e9zReportSb/showReportSb3?taxInfoId=" +
						this.taxinfoid;
				} else if(statusVaule == "一般纳税人附表三") {
					url =
						"/perTaxToolTwo/e9zReportSb/showReportSb4?taxInfoId=" +
						this.taxinfoid;
				} else if(statusVaule == "一般纳税人附表四") {
					url =
						"/perTaxToolTwo/e9zReportSb/showReportSb5?taxInfoId=" +
						this.taxinfoid;
				} else if(statusVaule == "小规模纳税人主表") {
					url =
						"/perTaxToolTwo/e9zReportSb/showReportXgmSb1?taxInfoId=" +
						this.taxinfoid;
				} else if(
					statusVaule == "城市维护建设税、教育费附加、地方教育附加申报表"
				) {
					url =
						"/perTaxToolTwo/e9zReportSb/showReport50002?taxInfoId=" +
						this.taxinfoid;
				} else if(statusVaule == "小规模纳税人附列资料") {
					url =
						"/perTaxToolTwo/e9zReportSb/showReportXgmSb2?taxInfoId=" +
						this.taxinfoid;
				} else if(statusVaule == "印花税申报表") {
					url =
						"/perTaxToolTwo/e9zReportSb/showReport50003?taxInfoId=" +
						this.taxinfoid;
				} else if(statusVaule == "文建税申报表") {
					url =
						"/perTaxToolTwo/e9zReportSb/showReport50004?taxInfoId=" +
						this.taxinfoid;
				} else if(statusVaule == "增值税减免税申报明细表") {
					url =
						"/perTaxToolTwo/e9zReportSb/showReport50005?taxInfoId=" +
						this.taxinfoid;
				}
				this.axios
					.post(url, params)
					.then(res => {
						console.log("获取表格数据", res);
						this.loading = false;
						if(res.data.code == 200) {
							if(res.data.hasOwnProperty("data")) {
								this.showFlag = true;
								if(
									statusVaule == "一般纳税人主表" ||
									statusVaule == "小规模纳税人主表"
								) {
									this.lastData = res.data.data.lastData;
									this.thisData = res.data.data.thisData;
									for(let key in this.thisData) {
										if(
											typeof this.thisData[key].columnValue == "number" &&
											key != "id" &&
											this.thisData[key].columnValue != 0
										) {
											this.thisData[key].columnValue = this.fomatFloat(
												this.thisData[key].columnValue,
												2
											);
										}
									}
									for(let key in this.lastData) {
										if(
											typeof this.lastData[key] == "number" &&
											key != "id" &&
											this.lastData[key] != 0
										) {
											this.lastData[key] = this.fomatFloat(this.lastData[key], 2);
										}
									}
									console.log("this.thisData", this.thisData);
								} else if(statusVaule == "一般纳税人附表一") {
									this.thisData = res.data.data;
									for(let key in this.thisData) {
										if(
											typeof this.thisData[key].columnValue == "number" &&
											key != "id" &&
											this.thisData[key].columnValue != 0
										) {
											this.thisData[key].columnValue = this.fomatFloat(
												this.thisData[key].columnValue,
												2
											);
										}
									}
									this.arate =
										this.thisData.yll13azsljyjssl.columnValue == 0 ?
										"" :
										Math.round(this.thisData.yll13azsljyjssl.columnValue * 100);
									this.brate =
										this.thisData.yll13bzsljyjssl.columnValue == 0 ?
										"" :
										Math.round(this.thisData.yll13bzsljyjssl.columnValue * 100);
									this.crate =
										this.thisData.yll13czsljyjssl.columnValue == 0 ?
										"" :
										Math.round(this.thisData.yll13czsljyjssl.columnValue * 100);
									console.log("this.arate", this.arate);
									console.log("this.thisData", this.thisData);
								} else if(
									statusVaule == "城市维护建设税、教育费附加、地方教育附加申报表"
								) {
									let data = res.data.data;
									this.DataObj = data;
									let arr = [];
									for(let key in data) {
										var obj = {};
										obj.xm = key.split(" ")[0];
										obj.pm = key.split(" ")[1];
										obj.rate = Number(key.split(" ")[2]).toFixed(2);
										obj.id = data[key].id;
										obj.projName = data[key];
										obj.typeName = data[key];
										obj.sl = data[key].sl;
										obj.jsybzzeje = data[key].jsybzzeje;
										obj.jsmdseje = data[key].jsmdseje;
										obj.jsxfsje = data[key].jsxfsje;
										obj.jsyysje = data[key].jsyysje;
										obj.jshjje = data[key].jshjje;
										obj.ynseje = data[key].ynseje;
										obj.ynseje.columnValue = Number(obj.ynseje.columnValue).toFixed(
											2
										);
										obj.jmxzdm = data[key].jmxzdm;
										obj.jmseje = data[key].jmseje;
										obj.xgmjze = data[key].xgmjze;
										obj.yjseje = data[key].yjseje;
										obj.ybtseje = data[key].ybtseje;
										arr.push(obj);
									}
									console.log("arr", arr);
									this.thisData = [];
									arr.forEach(item => {
										if(item.xm == "地方教育附加") {
											for(let key in item) {
												if(typeof item[key] == "object") {
													console.log(
														"item[key].columnValue",
														item[key].columnValue
													);
													if(
														typeof item[key].columnValue == "number" &&
														key != "id" &&
														key != "projName" &&
														key != "typeName" &&
														key != "sl" &&
														item[key].columnValue != 0
													) {
														item[key].columnValue = this.fomatFloat(
															item[key].columnValue,
															2
														);
													}
												}
											}
											this.thisData[0] = item;
										} else if(item.xm == "教育费附加") {
											for(let key in item) {
												if(typeof item[key] == "object") {
													console.log(
														"item[key].columnValue",
														item[key].columnValue
													);
													if(
														typeof item[key].columnValue == "number" &&
														key != "id" &&
														key != "projName" &&
														key != "typeName" &&
														key != "sl" &&
														item[key].columnValue != 0
													) {
														item[key].columnValue = this.fomatFloat(
															item[key].columnValue,
															2
														);
													}
												}
											}
											this.thisData[1] = item;
										} else if(item.xm == "城市维护建设税") {
											for(let key in item) {
												if(typeof item[key] == "object") {
													console.log(
														"item[key].columnValue",
														item[key].columnValue
													);
													if(
														typeof item[key].columnValue == "number" &&
														key != "id" &&
														key != "projName" &&
														key != "typeName" &&
														key != "sl" &&
														item[key].columnValue != 0
													) {
														item[key].columnValue = this.fomatFloat(
															item[key].columnValue,
															2
														);
													}
												}
											}
											this.thisData[2] = item;
										} else if(item.xm == "合计") {
											for(let key in item) {
												if(typeof item[key] == "object") {
													console.log(
														"item[key].columnValue",
														item[key].columnValue
													);
													if(
														typeof item[key].columnValue == "number" &&
														key != "id" &&
														key != "projName" &&
														key != "typeName" &&
														key != "sl" &&
														item[key].columnValue != 0
													) {
														item[key].columnValue = this.fomatFloat(
															item[key].columnValue,
															2
														);
													}
												}
											}
											this.thisData[3] = item;
										}
									});
									console.log("111this.thisData", this.thisData);
								} else if(
									statusVaule == "增值税减免税申报明细表"
								) {
									let data = res.data.data;
									this.DataObj = data;
									let arr = [];
									for(let key in data) {
										
										arr.push(data[key]);
									}
									
									console.log("arr", arr);
									this.thisData = [];
									arr.forEach(item => {
										
											for(let key in item) {
												if(typeof item[key] == "object") {
													console.log(
														"item[key].columnValue",
														item[key].columnValue
													);
													if(
														typeof item[key].columnValue == "number" &&
														key != "id" &&
														key != "projName" &&
														key != "typeName" &&
														key != "sl" &&
														item[key].columnValue != 0
													) {
														item[key] = this.fomatFloat(
															item[key].columnValue,
															2
														);
													}else{
														item[key] = item[key].columnValue;
													}
												}
											}
											this.thisData.push(item);
									});
									console.log("111this.thisData", this.thisData);
								} else if(statusVaule == "一般纳税人附表四") {
									this.thisData = res.data.data;
									for(let key in this.thisData) {
										if(
											typeof this.thisData[key].columnValue == "number" &&
											key != "id" &&
											this.thisData[key].columnValue != 0
										) {
											this.thisData[key].columnValue = this.fomatFloat(
												this.thisData[key].columnValue,
												2
											);
										}
									}
									if(JSON.stringify(this.thisData) != "{}") {
										this.total1 =
											Number(this.thisData["ybxmjjdjejsqcye"].columnValue) +
											Number(this.thisData["jzjtxmjjdjejsqcye"].columnValue);
										console.log(
											"this.arate",
											this.thisData["ybxmjjdjejsqcye"].columnValue,
											this.thisData["jzjtxmjjdjejsqcye"].columnValue,
											this.total1
										);
										this.total2 =
											Number(this.thisData["ybxmjjdjejsbqfse"].columnValue) +
											Number(this.thisData["jzjtxmjjdjejsbqfse"].columnValue);
										this.total3 =
											Number(this.thisData["ybxmjjdjejsbqtje"].columnValue) +
											Number(this.thisData["jzjtxmjjdjejsbqtje"].columnValue);
										this.total4 =
											Number(this.thisData["ybxmjjdjejsbqkdje"].columnValue) +
											Number(this.thisData["jzjtxmjjdjejsbqkdje"].columnValue);
										this.total5 =
											Number(this.thisData["ybxmjjdjejsbqsjdje"].columnValue) +
											Number(this.thisData["jzjtxmjjdjejsbqsjdje"].columnValue);
										this.total6 =
											Number(this.thisData["ybxmjjdjejsqmye"].columnValue) +
											Number(this.thisData["jzjtxmjjdjejsqmye"].columnValue);
									}
								} else if(
									statusVaule == "印花税申报表"
								) {
									this.thisData = res.data.data;
									
									console.log("111this.thisData", this.thisData);
								} else {
									this.thisData = res.data.data;
									for(let key in this.thisData) {
										if(
											typeof this.thisData[key].columnValue == "number" &&
											key != "id" &&
											this.thisData[key].columnValue != 0
										) {
											this.thisData[key].columnValue = this.fomatFloat(
												this.thisData[key].columnValue,
												2
											);
										}
									}
								}
							} else {
								this.$message({
									message: "暂无报表数据，请重新选择搜索条件！",
									type: "warning"
								});
								this.showFlag = false;
							}

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
			// 四舍五入
			fomatFloat(x, pos) {
				// console.log('xxx',x)
				if(x) {
					if(x.toString().indexOf(".") > -1) {
						var f = parseFloat(x);
						if(isNaN(f)) {
							return false;
						}
						f = Math.round(x * Math.pow(10, pos)) / Math.pow(10, pos); // pow 幂
						var s = f.toString();
						var rs = s.indexOf(".");
						if(rs < 0) {
							rs = s.length;
							s += ".";
						}
						while(s.length <= rs + pos) {
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
				tableType,
				projectType,
				type,
				dataName,
				e,
				calc,
				preName,
				rate,
				index
			) {
				if(e.keyCode === 13) {
					// this.send() // 发送文本
					console.log("tijiaole ");
					e.preventDefault(); // 阻止浏览器默认换行操作
				}
				var reg = /^(-)?\d{1,14}(\.\d{1,2})?$/;
				if(dataName == 'remark'){
					
				}else if(!reg.test(Number(e.target.innerText))) {
					this.$message({
						message: "请输入数字，整数最多14位，小数最多2位",
						type: "warning"
					});
					return;
				}
				if(tableType == "table1") {
					let keyName, leijiName;
					// 本月
					if(type == "by") {
						if(projectType == "yb") {
							// 一般项目
							keyName = dataName + "ybby";
							leijiName = dataName + "ybbnlj";
						} else if(projectType == "jz") {
							// 即征即收项目
							keyName = dataName + "jzby";
							leijiName = dataName + "jzbnlj";
						}
						if(
							Number(e.target.innerText) != this.thisData[keyName].columnValue
						) {
							this.thisData[keyName].columnValue = Number(e.target.innerText);
							if(this.thisData[leijiName]) {
								this.thisData[leijiName].columnValue =
									Number(e.target.innerText) + Number(this.lastData[leijiName]);
							}
							// 参与计算的行
							if(calc == "ydksehj") {
								// 应抵扣税额合计 本月一般项目，本月即征即收项目 17=12+13-14-15+16
								this.thisData.ydksehjybby.columnValue =
									Number(this.thisData.jxseybby.columnValue) +
									Number(this.thisData.sqldseybby.columnValue) -
									Number(this.thisData.jxsezcybby.columnValue) -
									Number(this.thisData.mdtytseybby.columnValue) +
									Number(this.thisData.asysljsnsjcybjseybby.columnValue);
								this.thisData.ydksehjjzby.columnValue =
									Number(this.thisData.jxsejzby.columnValue) +
									Number(this.thisData.sqldsejzby.columnValue) -
									Number(this.thisData.jxsezcjzby.columnValue);
								// 期末未缴查补税额 本月一般项目 38=16+22+36-37
								this.thisData.qmmjcbseybby.columnValue =
									Number(this.thisData.asysljsnsjcybjseybby.columnValue) +
									Number(this.thisData.ajynsjcybjseybby.columnValue) +
									Number(this.thisData.qcmjcbseybby.columnValue) -
									Number(this.thisData.bqrkcbseybby.columnValue);
							} else if(calc == "sjdkse") {
								// 实际抵扣税额 本月一般项目，本月即征即收项目 18=（如17<11，则为17，否则为11）
								this.thisData.sjdkseybby.columnValue =
									this.thisData.ydksehjybby.columnValue <
									this.thisData.xxseybby.columnValue ?
									Number(this.thisData.ydksehjybby.columnValue) :
									Number(this.thisData.xxseybby.columnValue);
								this.thisData.sjdksejzby.columnValue =
									this.thisData.ydksehjjzby.columnValue <
									this.thisData.xxsejzby.columnValue ?
									Number(this.thisData.ydksehjjzby.columnValue) :
									Number(this.thisData.xxsejzby.columnValue);
								// 应纳税额 本月一般项目，本月即征即收项目 19=if(（11-18）>0,(11-18-附表4G16),(11-18))
								this.thisData.ynseybby.columnValue =
									this.thisData.xxseybby.columnValue >
									this.thisData.sjdkseybby.columnValue ?
									Number(this.thisData.xxseybby.columnValue) -
									Number(this.thisData.sjdkseybby.columnValue) -
									Number(this.thisData.ybxmjjdjejsbqsjdje.columnValue) :
									Number(this.thisData.xxseybby.columnValue) -
									Number(this.thisData.sjdkseybby.columnValue);
								this.thisData.ynsejzby.columnValue =
									this.thisData.xxsejzby.columnValue >
									this.thisData.sjdksejzby.columnValue ?
									Number(this.thisData.xxsejzby.columnValue) -
									Number(this.thisData.sjdksejzby.columnValue) -
									Number(this.thisData.jzjtxmjjdjejsbqsjdje.columnValue) :
									Number(this.thisData.xxsejzby.columnValue) -
									Number(this.thisData.sjdksejzby.columnValue);
								// 期末留抵税额 本月一般项目，本月即征即收项目 10=17-18
								this.thisData.qmldseybby.columnValue =
									Number(this.thisData.ydksehjybby.columnValue) -
									Number(this.thisData.sjdkseybby.columnValue);
								this.thisData.qmldsejzby.columnValue =
									Number(this.thisData.ydksehjjzby.columnValue) -
									Number(this.thisData.sjdksejzby.columnValue);
							} else if(calc == "ynsehj") {
								// 应纳税额合计 本月一般项目，本月即征即收项目 24=19+21-23
								this.thisData.ynsehjybby.columnValue =
									Number(this.thisData.ynseybby.columnValue) +
									Number(this.thisData.jyjsynseybby.columnValue) -
									Number(this.thisData.ynsejzeybby.columnValue);
								this.thisData.ynsehjjzby.columnValue =
									Number(this.thisData.ynsejzby.columnValue) +
									Number(this.thisData.jyjsynsejzby.columnValue) -
									Number(this.thisData.ynsejzejzby.columnValue);
							} else if(calc == "bqyjse") {
								// 本期已缴税额 本月一般项目，本月即征即收项目 27=28+29+30+31
								this.thisData.bqyjseybby.columnValue =
									Number(this.thisData.cyjseybby.columnValue) +
									Number(this.thisData.ckkjzyjksyjseybby.columnValue) +
									Number(this.thisData.jqjnsqynseybby.columnValue) +
									Number(this.thisData.bqjnqjseybby.columnValue);
								this.thisData.bqyjsejzby.columnValue =
									Number(this.thisData.cyjsejzby.columnValue) +
									Number(this.thisData.jqjnsqynsejzby.columnValue) +
									Number(this.thisData.bqjnqjsejzby.columnValue);
								// 本期应补(退)税额 本月一般项目，本月即征即收项目 34＝24-28-29
								this.thisData.bqybtseybby.columnValue =
									Number(this.thisData.ynsehjybby.columnValue) -
									Number(this.thisData.cyjseybby.columnValue) -
									Number(this.thisData.ckkjzyjksyjseybby.columnValue);
								this.thisData.bqybtsejzby.columnValue =
									Number(this.thisData.ynsehjjzby.columnValue) -
									Number(this.thisData.cyjsejzby.columnValue);
							} else if(calc == "qmwjse") {
								// 期末未缴税额（多缴为负数）本月一般项目，本月即征即收项目 32=24+25+26-27
								this.thisData.qmwjseybby.columnValue =
									Number(this.thisData.ynsehjybby.columnValue) +
									Number(this.thisData.qcmjseybby.columnValue) +
									Number(this.thisData.ssckkjzyjkstkeybby.columnValue) -
									Number(this.thisData.bqyjseybby.columnValue);
								this.thisData.qmwjsejzby.columnValue =
									Number(this.thisData.ynsehjjzby.columnValue) +
									Number(this.thisData.qcmjsejzby.columnValue) -
									Number(this.thisData.bqyjsejzby.columnValue);
								// 其中：欠缴税额（≥0）本月一般项目，本月即征即收项目 33=25+26-27
								this.thisData.qzqjseybby.columnValue =
									Number(this.thisData.qcmjseybby.columnValue) +
									Number(this.thisData.ssckkjzyjkstkeybby.columnValue) -
									Number(this.thisData.bqyjseybby.columnValue);
								this.thisData.qzqjsejzby.columnValue =
									Number(this.thisData.qcmjsejzby.columnValue) -
									Number(this.thisData.bqyjsejzby.columnValue);
							} else if(calc == "qmmjcbse") {
								// 期末未缴查补税额 本月一般项目 38=16+22+36-37
								this.thisData.qmmjcbseybby.columnValue =
									Number(this.thisData.asysljsnsjcybjseybby.columnValue) +
									Number(this.thisData.ajynsjcybjseybby.columnValue) +
									Number(this.thisData.qcmjcbseybby.columnValue) -
									Number(this.thisData.bqrkcbseybby.columnValue);
							}
							console.log(111333, this.thisData);
							this.submitEdit();
						}
					} else if(type == "lj") {
						// 累计
						if(projectType == "yb") {
							// 一般项目
							keyName = dataName + "ybbnlj";
						} else if(projectType == "jz") {
							// 即征即收项目
							keyName = dataName + "jzbnlj";
						}
						if(
							Number(e.target.innerText) != this.thisData[keyName].columnValue
						) {
							this.thisData[keyName].columnValue = Number(e.target.innerText);
							console.log(111, this.thisData);
							this.submitEdit();
						}
					}
				} else if(tableType == "table2") {
					console.log("dataName", dataName);
					if(Number(e.target.innerText) != this.thisData[dataName].columnValue) {
						if(
							dataName == "yll13azsljyjssl" ||
							dataName == "yll13bzsljyjssl" ||
							dataName == "yll13czsljyjssl"
						) {
							this.thisData[dataName].columnValue =
								Number(e.target.innerText) / 100;
						} else {
							this.thisData[dataName].columnValue = Number(e.target.innerText);
						}
						// 参与计算
						if(calc == "hjxse") {
							//合计销售额 9=1+3+5+7
							let key1, key3, key5;
							if(
								preName == "yll13azsljyjs" ||
								preName == "yll13bzsljyjs" ||
								preName == "yll13czsljyjs"
							) {
								key1 = preName + "skzzsxse";
							} else if(
								preName == "bfz13hwjjgxlxplwybjs" ||
								preName == "bfz13fwbdchwxzcybjs" ||
								preName == "bfz9hwjjgxlxplwybjs" ||
								preName == "bfz9fwbdchwxzcybjs" ||
								preName == "bfz5fwbdchwxzcybjs" ||
								preName == "bfz3fwbdchwxzcybjs"
							) {
								key1 = preName + "zzsfpxse";
							} else if(preName == "bfz6zsljyjjs") {
								key1 = "bfz6zsljyjszzsxse";
							} else {
								key1 = preName + "zzsxse";
							}
							console.log("key1", key1);
							if(this.thisData[key1]) {
								console.log("123", Number(this.thisData[key1].columnValue));
							}

							if(preName == "bfz6zsljyjs" || preName == "bfz6zsljyjjs") {
								key3 = "bfz6zsljyjjskqtfpxse";
							} else {
								key3 = preName + "kjqtfpxse";
							}
							if(preName == "fwbdchwxzcmdts") {
								key5 = preName + "wkjqtfpxxse";
							} else if(preName == "bfz6zsljyjjs") {
								key5 = "bfz6zsljyjswkjfpxse";
							} else {
								key5 = preName + "wkjfpxse";
							}
							let key7 = preName + "nsjctzxse";
							if(preName == "bfz6zsljyjjs") {
								key7 = "bfz6zsljyjsnsjctzxse";
							}
							let key9 = preName + "hjxse";
							if(preName == "bfz6zsljyjjs") {
								key9 = "bfz6zsljyjshjxse";
							}
							console.log(111, this.thisData.bfz6zsljyjjskqtfpxse.columnValue);
							console.log("key3", key3);
							if(this.thisData[key3]) {
								console.log("121", this.thisData[key3].columnValue);
							}

							let value1, value3, value5, value7;
							value1 = this.thisData[key1] ?
								Number(this.thisData[key1].columnValue) :
								0;
							value3 = this.thisData[key3] ?
								Number(this.thisData[key3].columnValue) :
								0;
							value5 = this.thisData[key5] ?
								Number(this.thisData[key5].columnValue) :
								0;
							value7 = this.thisData[key7] ?
								Number(this.thisData[key7].columnValue) :
								0;
							if(
								dataName.indexOf("hjxse") == -1 ||
								dataName.indexOf("hjxxse") == -1
							) {
								this.thisData[key9].columnValue =
									value1 + value3 + value5 + value7;
							}
							console.log("key9", this.thisData[key9].columnValue);
							// 销项(应纳)税额 10=2+4+6+8
							let key2, key4, key6;
							if(
								preName == "yll13azsljyjs" ||
								preName == "yll13bzsljyjs" ||
								preName == "yll13czsljyjs"
							) {
								key2 = preName + "skzzsxxse";
							} else if(
								preName == "bfz13hwjjgxlxplwybjs" ||
								preName == "bfz13fwbdchwxzcybjs" ||
								preName == "bfz9hwjjgxlxplwybjs" ||
								preName == "bfz9fwbdchwxzcybjs" ||
								preName == "bfz5fwbdchwxzcybjs" ||
								preName == "bfz3fwbdchwxzcybjs"
							) {
								key2 = preName + "zzsfpxxse";
							} else if(preName == "bfz6zsljyjjs") {
								key2 = "bfz6zsljyjszzsxxse";
							} else {
								key2 = preName + "zzsxxse";
							}
							if(preName == "bfz6zsljyjs" || preName == "bfz6zsljyjjs") {
								key4 = "bfz6zsljyjjskqtfpxxse";
							} else {
								key4 = preName + "kjqtfpxxse";
							}
							if(preName == "bfz3hwjjgxljyjs") {
								key6 = preName + "wjjfpxxse";
							} else if(preName == "bfz6zsljyjjs") {
								key6 = "bfz6zsljyjswkjfpxxse";
							} else {
								key6 = preName + "wkjfpxxse";
							}
							let key8 = preName + "nsjctzxxse";
							if(preName == "bfz6zsljyjjs") {
								key8 = "bfz6zsljyjsnsjctzxxse";
							}
							let key10 = preName + "hjxxse";
							if(preName == "bfz6zsljyjjs") {
								key10 = "bfz6zsljyjshjxxse";
							}
							let value2, value4, value6, value8;
							value2 = this.thisData[key2] ?
								Number(this.thisData[key2].columnValue) :
								0;
							value4 = this.thisData[key4] ?
								Number(this.thisData[key4].columnValue) :
								0;
							value6 = this.thisData[key6] ?
								Number(this.thisData[key6].columnValue) :
								0;
							value8 = this.thisData[key8] ?
								Number(this.thisData[key8].columnValue) :
								0;
							if(
								dataName.indexOf("hjxxse") == -1 ||
								dataName.indexOf("hjxse") == -1
							) {
								if(this.thisData[key10]) {
									this.thisData[key10].columnValue =
										value2 + value4 + value6 + value8;
								}
							}
							if(this.thisData[key10]) {
								console.log("key10", this.thisData[key10].columnValue);
							}

							// 价税合计 11=9+10  扣除后含税(免税)销售额 13=11-12
							let key11 = preName + "hjjshj";
							if(preName == "bfz6zsljyjjs") {
								key11 = "bfz6zsljyjshjjshj";
							}
							let key12;
							if(preName == "bfz6slybjs") {
								key12 = preName + "fubdchwxzckcxmbqsjkcje";
							} else if(preName == "bfz6zsljyjjs") {
								key12 = "bfz6zsljyjsfwbdchwxzckcxmbqsjkcje";
							} else {
								key12 = preName + "fwbdchwxzckcxmbqsjkcje";
							}
							let key13 = preName + "kchhsxse";
							if(preName == "bfz6zsljyjjs") {
								key13 = "bfz6zsljyjskchhsxse";
							}
							let key14;
							if(
								preName == "yll13azsljyjs" ||
								preName == "yll13bzsljyjs" ||
								preName == "yll13czsljyjs"
							) {
								key14 = preName + "kchxxse";
							} else if(preName == "bfz6zsljyjjs") {
								key12 = "bfz6zsljyjskchhsxxse";
							} else {
								key14 = preName + "kchhsxxse";
							}
							let value9, value10, value11, value12, value13;
							value9 = this.thisData[key9] ?
								Number(this.thisData[key9].columnValue) :
								0;
							value10 = this.thisData[key10] ?
								Number(this.thisData[key10].columnValue) :
								0;

							console.log("dataName", dataName);
							if(dataName.indexOf("hjjshj") == -1) {
								if(this.thisData[key11]) {
									this.thisData[key11].columnValue = value9 + value10;
								}
							}
							value11 = this.thisData[key11] ?
								Number(this.thisData[key11].columnValue) :
								0;
							value12 = this.thisData[key12] ?
								Number(this.thisData[key12].columnValue) :
								0;
							console.log("value11", value11);
							console.log("value12", value12);
							if(dataName.indexOf("kchhsxse") == -1) {
								console.log(11122);
								if(this.thisData[key13]) {
									this.thisData[key13].columnValue = value11 - value12;
								}
							}
							if(
								preName == "yll13azsljyjs" ||
								preName == "yll13bzsljyjs" ||
								preName == "yll13czsljyjs"
							) {
								// console.log("rate1111", rate);
								rate = parseFloat(rate / 100).toFixed(2);
							}
							console.log("rate", rate);
							if(this.thisData[key13]) {
								console.log("key13", this.thisData[key13].columnValue);
							}

							if(this.thisData[key13]) {
								if(this.thisData[key14]) {
									this.thisData[key14].columnValue = parseFloat(
										this.thisData[key13].columnValue / (1 + rate) * rate
									).toFixed(2);
								}
							}
						}
						this.submitEdit();
					}
				} else if(tableType == "table3") {
					if(Number(e.target.innerText) != this.thisData[dataName].columnValue) {
						this.thisData[dataName].columnValue = Number(e.target.innerText);
						console.log("当前值", this.thisData[dataName].columnValue);
						// 参与计算
						// 1=2+3
						if(calc == "rzxfzzszyfpsbdk") {
							let key1, key2, key3;
							key1 = "rzxfzzszyfpsbdk" + projectType;
							key2 = "bqrzxfqbqsbdk" + projectType;
							key3 = "qqrzxfqbqsbdk" + projectType;
							this.thisData[key1].columnValue =
								Number(this.thisData[key2].columnValue) +
								Number(this.thisData[key3].columnValue);
							console.log("key", key1);
							console.log("valu1", this.thisData[key1].columnValue);
						} else if(calc == "qtkspz") {
							// 4=5+6+7+8a+8b
							let key4, key5, key6, key7, key8a, key8b;
							key4 = "qtkspz" + projectType;
							key5 = "hgjkzzszyjks" + projectType;
							key6 = "ncpsgfphzxsfp" + projectType;
							if(projectType == "se") {
								key6 = "ncpsgfphzxsfpsbdkse";
							}
							key7 = "dkdjssjkpz" + projectType;
							key8a = "jjkcncpjxse" + projectType;
							key8b = "sbdkdjxseqtkspzqt" + projectType;
							let value7 = 0,
								value8a = 0;
							console.log("key5", key5);
							if(this.thisData[key7]) {
								value7 = Number(this.thisData[key7].columnValue);
							}
							if(this.thisData[key8a]) {
								value8a = this.thisData[key8a].columnValue;
							}
							this.thisData[key4].columnValue =
								Number(this.thisData[key5].columnValue) +
								Number(this.thisData[key6].columnValue) +
								value7 +
								value8a +
								Number(this.thisData[key8b].columnValue);
						} else if(calc == "dqsbdkjxsehj") {
							// 12=1+4+11
							let key1, key4, key11, key12;
							key1 = "rzxfzzszyfpsbdk" + projectType;
							key4 = "qtkspz" + projectType;
							key11 = "wmqyjxsdkzm" + projectType;
							key12 = "dqsbdkjxsehj" + projectType;
							let value11 = 0;
							if(this.thisData[key11]) {
								value11 = Number(this.thisData[key11].columnValue);
							}
							this.thisData[key12].columnValue =
								Number(this.thisData[key1].columnValue) +
								Number(this.thisData[key4].columnValue) +
								value11;
						} else if(calc == "bqjxszce") {
							// 13=14+15+16+17+18+19+20+21+22+23
							let key13,
								key14,
								key15,
								key16,
								key17,
								key18,
								key19,
								key20,
								key21,
								key22,
								key23;
							key13 = "bqjxszce" + projectType;
							key14 = "msxmy" + projectType;
							key15 = "jtflgrxf" + projectType;
							key16 = "fzcss" + projectType;
							key17 = "jyjsbfzsxmy" + projectType;
							key18 = "mdtsbfbddkdjxse" + projectType;
							key19 = "nsjctjjxse" + projectType;
							key20 = "hzzyfptzdzmdjxse" + projectType;
							key21 = "sqldsedjqs" + projectType;
							key22 = "sqldsets" + projectType;
							key23 = "qtyzjxsezcdqx" + projectType;
							this.thisData[key13].columnValue =
								Number(this.thisData[key14].columnValue) +
								Number(this.thisData[key15].columnValue) +
								Number(this.thisData[key16].columnValue) +
								Number(this.thisData[key17].columnValue) +
								Number(this.thisData[key18].columnValue) +
								Number(this.thisData[key19].columnValue) +
								Number(this.thisData[key20].columnValue) +
								Number(this.thisData[key21].columnValue) +
								Number(this.thisData[key22].columnValue) +
								Number(this.thisData[key23].columnValue);
						} else if(calc == "qtkspzddkjxse") {
							// 29=30+31+32+33
							let key29, key30, key31, key32, key33;
							key29 = "qtkspzddkjxse" + projectType;
							key30 = "hgjkzzszyxsfp" + projectType;
							key31 = "ncpsgfphzxsfpddk" + projectType;
							if(projectType == "se") {
								key31 = "ncpsgfphzxsfpse";
							}
							key32 = "ddkdkdjskpz" + projectType;
							key33 = "ddkjxseqtkkpzqt" + projectType;
							let value32 = 0;
							if(this.thisData[key32]) {
								value32 = Number(this.thisData[key32].columnValue);
							}
							console.log("key", key29);
							console.log("key", key30);
							console.log("key", key31);
							console.log("key", key32);
							console.log("key", key33);
							this.thisData[key29].columnValue =
								Number(this.thisData[key30].columnValue) +
								Number(this.thisData[key31].columnValue) +
								value32 +
								Number(this.thisData[key33].columnValue);
						} else if(calc == "bqrzxfdskzzszyfp") {
							// 29=30+31+32+33
							// 35=1+26
							let key29, key30, key31, key32, key33;
							let key35, key1, key26;
							key35 = "bqrzxfdskzzszyfp" + projectType;
							key1 = "rzxfzzszyfpsbdk" + projectType;
							key26 = "bqrzxfqbqwsbdk" + projectType;
							
							this.thisData[key35].columnValue =
								Number(this.thisData[key1].columnValue) +
								Number(this.thisData[key26].columnValue);
						}
						this.submitEdit();
					}
				} else if(tableType == "table4") {
					// 'table4','','',item.jsybzzeje,$event,'jshjje','',index
					if(
						Number(e.target.innerText) !=
						this.thisData[index][dataName].columnValue
					) {
						console.log("dataName", dataName);
						console.log("this.thisData[index]", index);
						console.log("当前值", this.thisData[index][dataName].columnValue);
						console.log("e.target.innerText", e.target.innerText);
						this.thisData[index][dataName].columnValue = Number(
							e.target.innerText
						);
						// 参与计算
						// 5=1+2+3+4
						if(calc == "jshjje") {
							console.log(
								"this.thisData[index]['jshjje'].columnValue",
								this.thisData[index]["jshjje"].columnValue
							);
							console.log(
								"1",
								Number(this.thisData[index]["jsybzzeje"].columnValue),
								Number(this.thisData[index]["jsmdseje"].columnValue),
								Number(this.thisData[index]["xgmjze"].columnValue),
								Number(this.thisData[index]["yjseje"].columnValue)
							);
							this.thisData[index]["jshjje"].columnValue = (
								Number(this.thisData[index]["jsybzzeje"].columnValue) +
								Number(this.thisData[index]["jsmdseje"].columnValue) +
								Number(this.thisData[index]["jsxfsje"].columnValue) +
								Number(this.thisData[index]["jsyysje"].columnValue)
							).toFixed(2);
							let rate;
							if(index == 3) {
								rate = 0;
							} else {
								rate = this.thisData[index]["rate"];
							}
							this.thisData[index]["ynseje"].columnValue = parseFloat(
								(
									Number(this.thisData[index]["jshjje"].columnValue) * rate
								).toFixed(2)
							);
							this.thisData[index]["ybtseje"].columnValue = (
								Number(this.thisData[index]["ynseje"].columnValue) -
								Number(this.thisData[index]["jmseje"].columnValue) -
								Number(this.thisData[index]["xgmjze"].columnValue) -
								Number(this.thisData[index]["yjseje"].columnValue)
							).toFixed(2);
						}
						console.log("111113333");
						this.thisData[3]["ynseje"].columnValue = (
							Number(this.thisData[0]["ynseje"].columnValue) +
							Number(this.thisData[1]["ynseje"].columnValue) +
							Number(this.thisData[2]["ynseje"].columnValue)
						).toFixed(2);
						this.thisData[3]["jmseje"].columnValue = (
							Number(this.thisData[0]["jmseje"].columnValue) +
							Number(this.thisData[1]["jmseje"].columnValue) +
							Number(this.thisData[2]["jmseje"].columnValue)
						).toFixed(2);
						this.thisData[3]["xgmjze"].columnValue = (
							Number(this.thisData[0]["xgmjze"].columnValue) +
							Number(this.thisData[1]["xgmjze"].columnValue) +
							Number(this.thisData[2]["xgmjze"].columnValue)
						).toFixed(2);
						this.thisData[3]["yjseje"].columnValue = (
							Number(this.thisData[0]["yjseje"].columnValue) +
							Number(this.thisData[1]["yjseje"].columnValue) +
							Number(this.thisData[2]["yjseje"].columnValue)
						).toFixed(2);
						this.thisData[3]["ybtseje"].columnValue = (
							Number(this.thisData[0]["ybtseje"].columnValue) +
							Number(this.thisData[1]["ybtseje"].columnValue) +
							Number(this.thisData[2]["ybtseje"].columnValue)
						).toFixed(2);
						this.submitEdit();
					}
				} else if(tableType == "table5") {
					// 'table5','','hwlwbqs','yzzzsbhsh',$event,'',''
					// if(type=='bqs'){
					let keyName = dataName + type;
					let leijiName = dataName + "bnlj";
					if(e.target.innerText != this.thisData[keyName].columnValue && dataName == 'remark'){
						this.thisData[keyName].columnValue = e.target.innerText;
						this.submitEdit();
					}else if(Number(e.target.innerText) != this.thisData[keyName].columnValue && dataName != 'remark') {
						this.thisData[keyName].columnValue = Number(e.target.innerText);
						if(type == "bqs") {
							console.log("this.thisData[leijiName]", leijiName);
							if(this.thisData[leijiName]) {
								this.thisData[leijiName].columnValue =
									Number(e.target.innerText) + Number(this.lastData[leijiName]);
							}
						}
						// 参与计算的行
						if(calc == "msxse") {
							// 免税销售额  9=10+11+12
							this.thisData.msxsehwlwbqs.columnValue =
								Number(this.thisData.xwqymsxsehwlwbqs.columnValue) +
								Number(this.thisData.wdqzdxsehwlwbqs.columnValue) +
								Number(this.thisData.qtmsxsehwlwbqs.columnValue);
							this.thisData.msxsefwbdcbqs.columnValue =
								Number(this.thisData.xwqymsxsefwbdcbqs.columnValue) +
								Number(this.thisData.wdqzdxsefwbdcbqs.columnValue) +
								Number(this.thisData.qtmsxsefwbdcbqs.columnValue);
							this.thisData.msxsehwlwbnlj.columnValue =
								Number(this.thisData.msxsehwlwbqs.columnValue) +
								Number(this.lastData.msxsehwlwbnlj);
							this.thisData.msxsefwbdcbnlj.columnValue =
								Number(this.thisData.msxsefwbdcbqs.columnValue) +
								Number(this.lastData.msxsefwbdcbnlj);
						} else if(calc == "ynse") {
							//   应纳税额合计  20=15-16
							//    本期应补（退）税额 22=20-21
							if(dataName != "ynsehjhwlw" && dataName != "ynsehjfwbdc") {
								this.thisData.ynsehjhwlwbqs.columnValue =
									Number(this.thisData.bqynsehwlwbqs.columnValue) -
									Number(this.thisData.bqynsejzehwlwbqs.columnValue);
								this.thisData.ynsehjfwbdcbqs.columnValue =
									Number(this.thisData.bqynsefwbdcbqs.columnValue) -
									Number(this.thisData.bqynsejzefwbdcbqs.columnValue);
								this.thisData.ynsehjhwlwbnlj.columnValue =
									Number(this.thisData.ynsehjhwlwbqs.columnValue) +
									Number(this.lastData.ynsehjhwlwbnlj);
								this.thisData.ynsehjfwbdcbnlj.columnValue =
									Number(this.thisData.ynsehjfwbdcbqs.columnValue) +
									Number(this.lastData.ynsehjfwbdcbnlj);
							}
							this.thisData.bqybtsehwlwbqs.columnValue =
								Number(this.thisData.ynsehjhwlwbqs.columnValue) -
								Number(this.thisData.bqyjsehwlwbqs.columnValue);
							this.thisData.bqybtsefwbdcbqs.columnValue = 
							Number(this.thisData.ynsehjfwbdcbqs.columnValue) -
								Number(this.thisData.bqyjsefwbdcbqs.columnValue);
						}
						this.submitEdit();
					}
					// }
				} else if(tableType == "table6") {
					//   'table6','','','xse3bqkce',$event,'',''
					if(Number(e.target.innerText) != this.thisData[dataName].columnValue) {
						this.thisData[dataName].columnValue = Number(e.target.innerText);
						// 4=1+2-3  6=3  7=5-6  8=7/1.03
						if(calc == "calchj") {
							this.thisData.kce3qmye.columnValue =
								Number(this.thisData.kce3qcye.columnValue) +
								Number(this.thisData.kce3bqfse.columnValue) -
								Number(this.thisData.kce3bqkce.columnValue);
							if(dataName != "xse3bqkce") {
								this.thisData.xse3bqkce.columnValue = Number(
									this.thisData.kce3bqkce.columnValue
								);
							}
							if(dataName != "xse3hsxse") {
								this.thisData.xse3hsxse.columnValue =
									Number(this.thisData.xse3qbhssr.columnValue) -
									Number(this.thisData.xse3bqkce.columnValue);
							}
							this.thisData.xse3bhsxse.columnValue = parseFloat(
								(Number(this.thisData.xse3hsxse.columnValue) / 1.03).toFixed(2)
							);
						} else if(calc == "calchj5") {
							this.thisData.kce5qmye.columnValue =
								Number(this.thisData.kce5qcye.columnValue) +
								Number(this.thisData.kce5bqfse.columnValue) +
								Number(this.thisData.kce5bqkce.columnValue);
							if(dataName != "xse5bqkce") {
								this.thisData.xse5bqkce.columnValue = Number(
									this.thisData.kce5bqkce.columnValue
								);
							}
							if(dataName != "xse5hsxse") {
								this.thisData.xse5hsxse.columnValue =
									Number(this.thisData.xse5qbhssr.columnValue) -
									Number(this.thisData.xse5bqkce.columnValue);
							}
							this.thisData.xse5bhsxse.columnValue = parseFloat(
								(Number(this.thisData.xse5hsxse.columnValue) / 1.05).toFixed(2)
							);
						}
						this.submitEdit();
					}
				} else if(tableType == "table7") {
					//   'table7','','','bfz13sldxmhje',$event,'calchj','bfz13sldxm'
					if(Number(e.target.innerText) != this.thisData[dataName].columnValue) {
						this.thisData[dataName].columnValue = Number(e.target.innerText);
						//  参与计算 4=2+3 	6=4-5
						if(calc == "calchj") {
							let key2 = preName + "qcye";
							let key3 = preName + "bqfse";
							let key4 = preName + "bqykcje";
							let key5 = preName + "bqsjkcje";
							let key6 = preName + "qmye";
							if(dataName != key4) {
								this.thisData[key4].columnValue =
									Number(this.thisData[key2].columnValue) +
									Number(this.thisData[key3].columnValue);
							}
							this.thisData[key6].columnValue =
								Number(this.thisData[key4].columnValue) -
								Number(this.thisData[key5].columnValue);
						}
						this.submitEdit();
					}
				} else if(tableType == "table8") {
					//   'table8','','','zzsskxtzysbfjjswhfqcye',$event,'calchj','zzsskxtzysbfjjswhf'
					if(Number(e.target.innerText) != this.thisData[dataName].columnValue) {
						this.thisData[dataName].columnValue = Number(e.target.innerText);
						if(type == "1") {
							//  参与计算 3=1+2 	5=3-4
							if(calc == "calchj") {
								let key1 = preName + "qcye";
								let key2 = preName + "bqfse";
								let key3 = preName + "bqydjse";
								let key4 = preName + "bqsjdjse";
								let key5 = preName + "qmye";
								if(dataName != key3) {
									this.thisData[key3].columnValue =
										Number(this.thisData[key1].columnValue) +
										Number(this.thisData[key2].columnValue);
								}
								this.thisData[key5].columnValue =
									Number(this.thisData[key3].columnValue) -
									Number(this.thisData[key4].columnValue);
							}
						} else if(type == "2") {
							//  参与计算 4=1+2-3 	6=4-5
							if(calc == "calchj") {
								let key1 = preName + "qcye";
								let key2 = preName + "bqfse";
								let key3 = preName + "bqtje";
								let key4 = preName + "bqkdje";
								let key5 = preName + "bqsjdje";
								let key6 = preName + "qmye";
								if(dataName != key4) {
									this.thisData[key4].columnValue =
										Number(this.thisData[key1].columnValue) +
										Number(this.thisData[key2].columnValue) -
										Number(this.thisData[key3].columnValue);
								}
								this.thisData[key6].columnValue =
									Number(this.thisData[key4].columnValue) -
									Number(this.thisData[key5].columnValue);
							}
						}
						this.total1 =
							Number(this.thisData["ybxmjjdjejsqcye"].columnValue) +
							Number(this.thisData["jzjtxmjjdjejsqcye"].columnValue);
						this.total2 =
							Number(this.thisData["ybxmjjdjejsbqfse"].columnValue) +
							Number(this.thisData["jzjtxmjjdjejsbqfse"].columnValue);
						this.total3 =
							Number(this.thisData["ybxmjjdjejsbqtje"].columnValue) +
							Number(this.thisData["jzjtxmjjdjejsbqtje"].columnValue);
						this.total4 =
							Number(this.thisData["ybxmjjdjejsbqkdje"].columnValue) +
							Number(this.thisData["jzjtxmjjdjejsbqkdje"].columnValue);
						this.total5 =
							Number(this.thisData["ybxmjjdjejsbqsjdje"].columnValue) +
							Number(this.thisData["jzjtxmjjdjejsbqsjdje"].columnValue);
						this.total6 =
							Number(this.thisData["ybxmjjdjejsqmye"].columnValue) +
							Number(this.thisData["jzjtxmjjdjejsqmye"].columnValue);
						this.submitEdit();
					}
				}else if(tableType == "table10"){
					if(Number(e.target.innerText) != this.thisData[dataName].columnValue) {
						this.thisData[dataName].columnValue = Number(e.target.innerText);
						var key1 = "jfsryzsrbys";
						var key2 = "jfsrmzsrbys";
						var key3 = "fejsjcxmqcjebys";
						var key4 = "fejsjcxmbqfsebys";
						var key5 = 'fejsbqjceyzsrjcebys';
						var key6 = "fejsbqjcemzsrjcebys";
						var key7 = "fejsjcxmqmyebys";
						var key8 = "fejsjfxsebys";
						var key9 = "fejsflbys";
						var key10 = "fejsyjfebys";
						var key11 = "fejnqcwjfebys";
						var key12 = "fejnbqyjfebys";
						var key13 = "fejnqzbqyjfebys";
						var key14 = "fejnbqjnsqfebys";
						var key15 = "fejnbqjnqfebys";
						var key16 = "fejnqmwjfebys";
						var key17 = "fejnqzqjfebys";
						var key18 = "fejnbqybtfebys";
						var key19 = "fejnbqjcybjfebys";
						
						var key31 = "jfsryzsrbnlj";
						var key32 = "jfsrmzsrbnlj";
						var key33 = "fejsjcxmqcjebnlj";
						var key34 = "fejsjcxmbqfsebnlj";
						var key35 = 'fejsbqjceyzsrjcebnlj';
						var key36 = "fejsbqjcemzsrjcebnlj";
						var key37 = "fejsjcxmqmyebnlj";
						var key38 = "fejsjfxsebnlj";
						var key39 = "fejsflbnlj";
						var key310 = "fejsyjfebnlj";
						var key311 = "fejnqcwjfebnlj";
						var key312 = "fejnbqyjfebnlj";
						var key313 = "fejnqzbqyjfebnlj";
						var key314 = "fejnbqjnsqfebnlj";
						var key315 = "fejnbqjnqfebnlj";
						var key316 = "fejnqmwjfebnlj";
						var key317 = "fejnqzqjfebnlj";
						var key318 = "fejnbqybtfebnlj";
						var key319 = "fejnbqjcybjfebnlj";
						if(type == "1") {
							//  参与计算 8=1-5  10=（1-5）*9 16=(1-5）*9+11-12 18=10×（1-减征比例）-13

							if(calc == "bys") {
								this.thisData[key8].columnValue =
									Number(this.thisData[key1].columnValue) -
									Number(this.thisData[key5].columnValue);
								this.thisData[key10].columnValue =
									Number(this.thisData[key8].columnValue) *
									Number(this.thisData[key9].columnValue);
								this.thisData[key16].columnValue =
									Number(this.thisData[key10].columnValue) +
									Number(this.thisData[key11].columnValue) - 
									Number(this.thisData[key12].columnValue);
								this.thisData[key18].columnValue =
									Number(this.thisData[key10].columnValue) * (1 - this.thisData.jzbl.columnValue) - 
									Number(this.thisData[key13].columnValue);
							}else if(calc == "bnlj"){
								this.thisData[key38].columnValue =
									Number(this.thisData[key31].columnValue) -
									Number(this.thisData[key35].columnValue);
								this.thisData[key310].columnValue =
									Number(this.thisData[key38].columnValue) *
									Number(this.thisData[key39].columnValue);
								this.thisData[key316].columnValue =
									Number(this.thisData[key310].columnValue) +
									Number(this.thisData[key311].columnValue) - 
									Number(this.thisData[key312].columnValue);
							}
						} else if(type == "3") {
							//  参与计算 7=3+4-5-6
							if(calc == "bys") {
								this.thisData[key7].columnValue =
									Number(this.thisData[key3].columnValue) +
									Number(this.thisData[key4].columnValue) - 
									Number(this.thisData[key5].columnValue) - 
									Number(this.thisData[key6].columnValue);
							}else if(calc == "bnlj"){
								this.thisData[key37].columnValue =
									Number(this.thisData[key33].columnValue) +
									Number(this.thisData[key34].columnValue) - 
									Number(this.thisData[key35].columnValue) - 
									Number(this.thisData[key36].columnValue);
							}
						} else if(type == "4") {
							//  参与计算 7=3+4-5-6
							if(calc == "bys") {
								this.thisData[key7].columnValue =
									Number(this.thisData[key3].columnValue) +
									Number(this.thisData[key4].columnValue) - 
									Number(this.thisData[key5].columnValue) - 
									Number(this.thisData[key6].columnValue);
							}else if(calc == "bnlj"){
								this.thisData[key37].columnValue =
									Number(this.thisData[key33].columnValue) +
									Number(this.thisData[key34].columnValue) - 
									Number(this.thisData[key35].columnValue) - 
									Number(this.thisData[key36].columnValue);
							}
						} else if(type == "5") {
							//  参与计算 7=3+4-5-6
							if(calc == "bys") {
								this.thisData[key7].columnValue =
									Number(this.thisData[key3].columnValue) +
									Number(this.thisData[key4].columnValue) - 
									Number(this.thisData[key5].columnValue) - 
									Number(this.thisData[key6].columnValue);
								this.thisData[key8].columnValue =
									Number(this.thisData[key1].columnValue) -
									Number(this.thisData[key5].columnValue);
								this.thisData[key10].columnValue =
									Number(this.thisData[key8].columnValue) *
									Number(this.thisData[key9].columnValue);
								this.thisData[key16].columnValue =
									Number(this.thisData[key10].columnValue) +
									Number(this.thisData[key11].columnValue) - 
									Number(this.thisData[key12].columnValue);
								this.thisData[key18].columnValue =
									Number(this.thisData[key10].columnValue) * (1 - this.thisData.jzbl.columnValue) -
									Number(this.thisData[key13].columnValue);
							}else if(calc == "bnlj"){
								this.thisData[key37].columnValue =
									Number(this.thisData[key33].columnValue) +
									Number(this.thisData[key34].columnValue) - 
									Number(this.thisData[key35].columnValue) - 
									Number(this.thisData[key36].columnValue);
								this.thisData[key38].columnValue =
									Number(this.thisData[key31].columnValue) -
									Number(this.thisData[key35].columnValue);
								this.thisData[key310].columnValue =
									Number(this.thisData[key38].columnValue) *
									Number(this.thisData[key39].columnValue);
								this.thisData[key316].columnValue =
									Number(this.thisData[key310].columnValue) +
									Number(this.thisData[key311].columnValue) - 
									Number(this.thisData[key312].columnValue);
							}
						}else if(type == "6") {
							//  参与计算 7=3+4-5-6
							if(calc == "bys") {
								this.thisData[key7].columnValue =
									Number(this.thisData[key3].columnValue) +
									Number(this.thisData[key4].columnValue) - 
									Number(this.thisData[key5].columnValue) - 
									Number(this.thisData[key6].columnValue);
							}else if(calc == "bnlj"){
								this.thisData[key37].columnValue =
									Number(this.thisData[key33].columnValue) +
									Number(this.thisData[key34].columnValue) - 
									Number(this.thisData[key35].columnValue) - 
									Number(this.thisData[key36].columnValue);
							}
						}else if(type == "9") {
							//  参与计算 10=8*9
							if(calc == "bys") {
								this.thisData[key10].columnValue =
									Number(this.thisData[key8].columnValue) *
									Number(this.thisData[key9].columnValue);
								this.thisData[key16].columnValue =
									Number(this.thisData[key10].columnValue) +
									Number(this.thisData[key11].columnValue) - 
									Number(this.thisData[key12].columnValue);
								this.thisData[key18].columnValue =
									Number(this.thisData[key10].columnValue) * (1 - this.thisData.jzbl.columnValue) - 
									Number(this.thisData[key13].columnValue);
							}else if(calc == "bnlj"){
								
							}
						}else if(type == "11") {
							//  参与计算 16=10+11-12 17=11-14-15
							if(calc == "bys") {
								
								this.thisData[key16].columnValue =
									Number(this.thisData[key10].columnValue) +
									Number(this.thisData[key11].columnValue) -
									Number(this.thisData[key12].columnValue);
								this.thisData[key17].columnValue =
									Number(this.thisData[key11].columnValue) -
									Number(this.thisData[key14].columnValue) -
									Number(this.thisData[key15].columnValue);
							}else if(calc == "bnlj"){
								
								this.thisData[key316].columnValue =
									Number(this.thisData[key310].columnValue) +
									Number(this.thisData[key311].columnValue) -
									Number(this.thisData[key312].columnValue);
							}
						}else if(type == "13") {
							//  参与计算 18=10×（1-减征比例）-13  12=13+14+15
							if(calc == "bys") {
								
								this.thisData[key12].columnValue =
									Number(this.thisData[key13].columnValue) +
									Number(this.thisData[key14].columnValue) -
									Number(this.thisData[key15].columnValue);
								this.thisData[key18].columnValue =
									Number(this.thisData[key10].columnValue) * (1 - this.thisData.jzbl.columnValue) - 
									Number(this.thisData[key13].columnValue);
							}else if(calc == "bnlj"){
								
								this.thisData[key312].columnValue =
									Number(this.thisData[key313].columnValue) +
									Number(this.thisData[key314].columnValue) -
									Number(this.thisData[key315].columnValue);
							}
						}else if(type == "14") {
							//  参与计算 17=11-14-15  12=13+14+15
							if(calc == "bys") {
								
								this.thisData[key12].columnValue =
									Number(this.thisData[key13].columnValue) +
									Number(this.thisData[key14].columnValue) -
									Number(this.thisData[key15].columnValue);
								this.thisData[key17].columnValue =
									Number(this.thisData[key11].columnValue) - 
									Number(this.thisData[key14].columnValue) - 
									Number(this.thisData[key15].columnValue);
							}else if(calc == "bnlj"){
								
								this.thisData[key312].columnValue =
									Number(this.thisData[key313].columnValue) +
									Number(this.thisData[key314].columnValue) -
									Number(this.thisData[key315].columnValue);
							}
						}else if(type == "15") {
							//  参与计算 17=11-14-15  12=13+14+15
							if(calc == "bys") {
								
								this.thisData[key12].columnValue =
									Number(this.thisData[key13].columnValue) +
									Number(this.thisData[key14].columnValue) -
									Number(this.thisData[key15].columnValue);
								this.thisData[key17].columnValue =
									Number(this.thisData[key11].columnValue) - 
									Number(this.thisData[key14].columnValue) - 
									Number(this.thisData[key15].columnValue);
							}else if(calc == "bnlj"){
								
								this.thisData[key312].columnValue =
									Number(this.thisData[key313].columnValue) +
									Number(this.thisData[key314].columnValue) -
									Number(this.thisData[key315].columnValue);
							}
						}
						
						this.submitEdit();
					}
				}else if(tableType == "table11"){
					//5=1×4+2×3×4
					if(Number(e.target.innerText) != this.thisData[index][dataName]) {
						this.$set(this.thisData[index],dataName,Number(e.target.innerText));
						// this.thisData[index][dataName] = Number(e.target.innerText);
						if(dataName == 'jsjehjs' || dataName == 'hdzshdyj' || dataName == 'hdzshdbl' || dataName == 'sysl'){
							this.$set(this.thisData[index],'bqynse',Number(this.thisData[index]['jsjehjs']) * Number(this.thisData[index]['sysl'])
							+ Number(this.thisData[index]['hdzshdyj']) * Number(this.thisData[index]['hdzshdbl']) * Number(this.thisData[index]['sysl']));
							
							this.$set(this.thisData[index],'bqybtse',Number(this.thisData[index]['bqynse']) - Number(this.thisData[index]['bqyjse'])
							- Number(this.thisData[index]['bqjmsejmse']) - Number(this.thisData[index]['zzsxgmnsrjze']));
						}
						
						
						if(dataName == 'bqyjse' || dataName == 'bqjmsejmse' || dataName == 'zzsxgmnsrjze'){
							this.$set(this.thisData[index],'bqybtse',Number(this.thisData[index]['bqynse']) - Number(this.thisData[index]['bqyjse'])
							- Number(this.thisData[index]['bqjmsejmse']) - Number(this.thisData[index]['zzsxgmnsrjze']));
						}
						
						
						
						this.submitEdit();
					}
				}else if(tableType == "table111"){
					//5=1×4+2×3×4
					if(Number(e.target.innerText) != this.thisData[index][dataName]) {
						this.$set(this.thisData[index],dataName,Number(e.target.innerText));
						var key1 = 'qcyehzmzzzsxmxse';
						var key2 = 'bqfsehzmsxsekcxmbqsjkcje';
						var key3 = 'bqydjsehzkchmsxse';
						var key4 = 'bqsjdjsehzmsxsedydjxse';
						var key5 = 'qmyehzmse';
						if(type == "1") {
							
							//  参与计算 3=1+2  5=（1+2）-4 
							
							this.thisData[index][key5] =
								Number(this.thisData[index][key1]) +
								Number(this.thisData[index][key2]) -
								Number(this.thisData[index][key4]);
							this.thisData[index][key3] =
								Number(this.thisData[index][key1]) +
								Number(this.thisData[index][key2]);
								
							
						}else if(type == "2") {
							
							//  参与计算 3=1+2  5=（1+2）-4 
							
							this.thisData[index][key5] =
								Number(this.thisData[index][key1]) +
								Number(this.thisData[index][key2]) -
								Number(this.thisData[index][key4]);
							this.thisData[index][key3] =
								Number(this.thisData[index][key1]) +
								Number(this.thisData[index][key2]);
								
							
						}else if(type == "4") {
							
							//  参与计算 3=1+2  5=（1+2）-4 
							
							this.thisData[index][key5] =
								Number(this.thisData[index][key1]) +
								Number(this.thisData[index][key2]) -
								Number(this.thisData[index][key4]);
								
								
							
						}
						
						
						this.submitEdit(index);
					}
				}else if(tableType == "table112"){
					//5=1×4+2×3×4
					if(Number(e.target.innerText) != this.thisData[index][dataName]) {
						this.$set(this.thisData[index],dataName,Number(e.target.innerText));
						var key1 = 'qcyehzmzzzsxmxse';
						var key2 = 'bqfsehzmsxsekcxmbqsjkcje';
						var key3 = 'bqydjsehzkchmsxse';
						var key4 = 'bqsjdjsehzmsxsedydjxse';
						var key5 = 'qmyehzmse';
						if(type == "1") {
							
							//  参与计算 3=1-2  
							this.thisData[index][key3] =
								Number(this.thisData[index][key1]) -
								Number(this.thisData[index][key2]);
								
							
						}else if(type == "2") {
							
							//  参与计算 3=1-2  
							
							this.thisData[index][key3] =
								Number(this.thisData[index][key1]) -
								Number(this.thisData[index][key2]);
								
							
						}
						
						
						this.submitEdit(index);
					}
				}
			},
			setcolumnValue(val){
				// alert(val);
				this.thisData['fejnbqybtfebys'].columnValue =
					Number(this.thisData['fejsyjfebys'].columnValue) * (1 - val) - 
					Number(this.thisData['fejnqzbqyjfebys'].columnValue);
			},
			// 提交修改
			submitEdit(tag) {
				let param;
				if(
					this.statusVaule == "城市维护建设税、教育费附加、地方教育附加申报表"
				) {
					param = [];
					this.thisData.forEach(item => {
						var obj1 = {};
						for(let key in item) {
							obj1[key] = item[key].columnValue;
						}
						param.push(obj1);
					});
				}else if(
					this.statusVaule == "印花税申报表"
				) {
					param = this.thisData;
				} else if(
					this.statusVaule == "增值税减免税申报明细表"
				) {
					param = this.thisData[tag];
				} else {
					param = {};
					for(let key in this.thisData) {
						param[key] = this.thisData[key].columnValue;
					}
				}
				console.log("www", param);
				let url;
				if(this.statusVaule == "一般纳税人主表") {
					url = "/perTaxToolTwo/e9zReportSb/updateReportSb1";
				} else if(this.statusVaule == "一般纳税人附表一") {
					url = "/perTaxToolTwo/e9zReportSb/updateReportSb2";
				} else if(this.statusVaule == "一般纳税人附表二") {
					url = "/perTaxToolTwo/e9zReportSb/updateReportSb3";
				} else if(this.statusVaule == "一般纳税人附表三") {
					url = "/perTaxToolTwo/e9zReportSb/updateReportSb4";
				} else if(this.statusVaule == "一般纳税人附表四") {
					url = "/perTaxToolTwo/e9zReportSb/updateReportSb5";
				} else if(this.statusVaule == "小规模纳税人主表") {
					url = "/perTaxToolTwo/e9zReportSb/updateReportXgmSb1";
				} else if(this.statusVaule == "小规模纳税人附列资料") {
					url = "/perTaxToolTwo/e9zReportSb/updateReportXgmSb2";
				} else if(this.statusVaule == "城市维护建设税、教育费附加、地方教育附加申报表") {
					url = "/perTaxToolTwo/e9zReportSb/updateReport50002";
				}else if(this.statusVaule == "文建税申报表"){
					url = "/perTaxToolTwo/e9zReportSb/updateReport50004";
				}else if(this.statusVaule == "印花税申报表"){
					url = "/perTaxToolTwo/e9zReportSb/updateReport50003";
				}else if(this.statusVaule == "增值税减免税申报明细表"){
					url = "/perTaxToolTwo/e9zReportSb/updateReport50005";
				}
				this.axios
					.post(url, param)
					.then(res => {
						console.log("修改数据", res);
						if(res.data.code == 200) {
							this.getTableData(this.statusVaule);
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
			search(formName) {
				this.$refs[formName].validate(valid => {
					if(valid) {
						this.accountPeriod = this.searchList.nowDate;
						this.customerId = this.searchList.value;
						this.statusVaule = this.searchList.statusVaule;
						this.taxationId = "";
						this.taxinfoid = "";
						// 填入纳税人识别号，所属时间，填表日期
						this.uploadData.taxerName = this.userobj.customerName;
						// var lastDay = new Date(
						// 	this.accountPeriod.split("-")[0],
						// 	this.accountPeriod.split("-")[1],
						// 	0
						// );
						// var year = lastDay.getFullYear();
						// var month = lastDay.getMonth() + 1;
						// month = month < 10 ? "0" + month : month;
						// var day = lastDay.getDate();
						// day = day < 10 ? "0" + day : day;
						// var startDay = year + "-" + month + "-01";
						// var endDay = year + "-" + month + "-" + day;
						// this.uploadData.shuikuanDate = [startDay, endDay];
						this.uploadData.tianbiaoDate = this.getNowFormatDate();
						console.log("111", this.uploadData);

						this.getInfoId();
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			}
			// clear() {
			//   this.searchList.statusVaule = "一般纳税人主表";
			//   this.searchList.nowDate = "";
			// }
		},
		created() {
			this.getmianshuiList(1);
			this.getmianshuiList(2);
			if(this.$route.query.customerId && this.$route.query.accountPeriod){
				this.selectGet(this.$route.query.customerId);
				this.searchList.nowDate = this.$route.query.accountPeriod;
				// this.searchList.value = this.$route.query.customerId;
				// this.userobj.reportTaxType = this.$route.query.reportTaxType;
				// if(this.userobj.reportTaxType == 233) {
				// 	this.searchList.statusVaule = "一般纳税人主表";
				// 	this.statusVaule = "一般纳税人主表";
				// }
				// if(this.userobj.reportTaxType == 232) {
				// 	this.searchList.statusVaule = "小规模纳税人主表";
				// 	this.statusVaule = "小规模纳税人主表";
				// }
				this.$nextTick(function(){
					this.search('formSearch');
				})
				
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
</style>