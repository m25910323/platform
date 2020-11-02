<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>账簿管理</el-breadcrumb-item>
			<el-breadcrumb-item>科目余额表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="单位名称" prop="dossierName">
						<el-select v-model="uploadData.fBrNo" placeholder="请选择公司名称" filterable @change='getProofTAccounts'>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option>

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
						 change-on-select></el-cascader>
						<span class="demonstration" style="margin-left:5px;"></span>
						<span class="demonstration" style="margin-left:5px;">至</span>

						<el-cascader v-model="uploadData.fNumberEnd" placeholder="试试搜索" :options="treeList3" filterable :props="props1"
						 change-on-select></el-cascader>
					</el-form-item>
					<el-form-item label="科目级别" prop="fLevel">
						<el-select v-model="uploadData.fLevel" placeholder="请选择科目级别" clearable filterable>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in 6" :label="item" :value='item'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" prop="dossierName">
						<el-checkbox v-model="uploadData.flagUnPosted" :true-label='truelabel' :false-label='falselabel'>包括未过账凭证</el-checkbox>
					</el-form-item>
					<el-form-item label="" prop="dossierName">
						<el-checkbox v-model="uploadData.flagUnTrans" :true-label='truelabel' :false-label='falselabel'>包括没有发生业务的科目（无期初余额、本年累计）</el-checkbox>
					</el-form-item>
					<el-form-item label="" prop="dossierName">
						<el-checkbox v-model="uploadData.flagWithoutResult" :true-label='truelabel' :false-label='falselabel'>包括期末余额为0</el-checkbox>
					</el-form-item>
					<el-button type="primary" @click='search()' size="mini">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<h5>余额表</h5>
			<p>单位名称：{{fBrNo}}
				<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='voucherGather_print()' style='float:right;margin-left:10px'>打印</el-button>
				<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='exportExcel()' style='float:right'>导出</el-button>
				<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='exportExcel2()' style='float:right'>导出收付账款</el-button>
				<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='jumpto()' style='float:right'>查看明细分类账</el-button>
			</p>


			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading' @row-dblclick="jumptothis" height="calc(100% - 100px)">
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="科目代码" prop="account_fNumber"></el-table-column>
				<el-table-column align="center" label="科目名称" prop='account_fName'>
					<template slot-scope="scope">
						<span v-html='scope.row.account_fName'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="期初余额借方" prop="fbeginBalanceDebit_string"></el-table-column>
				<el-table-column align="center" label="期初余额贷方" prop="fbeginBalanceCredit_string"></el-table-column>
				<el-table-column align="center" label="本期发生借方" prop="fdebit_string"></el-table-column>
				<el-table-column align="center" label="本期发生贷方" prop="fcredit_string"></el-table-column>
				<el-table-column align="center" label="本年累计借方" prop="fytdDebit_string"></el-table-column>
				<el-table-column align="center" label="本年累计贷方" prop="fytdCredit_string"></el-table-column>
				<el-table-column align="center" label="期末余额借方" prop="fendBalanceDebit_string"></el-table-column>
				<el-table-column align="center" label="期末余额贷方" prop="fendBalanceCredit_string"></el-table-column>

			</el-table>
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
				flagUnPosted: '',
				flagUnTrans: '',
				flagWithoutResult: '',
				loading: false,
				value4: this.formatTimeToStr(new Date(), 'yyyy-MM'),
				selectNum: new Date().getMonth(),
				percentage: 0,
				uploadData: {
					fBrNo: '',
					fYearStart: '',
					fPeriodStart: '',
					fYearEnd: '',
					fPeriodEnd: '',
					fNumberStart: '',
					fNumberEnd: '',
					fLevel: 1,
					flagUnPosted: 2,
					flagUnTrans: 2,
					flagWithoutResult: 1,
				},
				customerId: 0,
				tableData: [],
				truelabel: 1,
				falselabel: 2,
				tree3: [],
				treeList3: [],
				props1: {
					value: 'fnumber',
					label: 'full',
					children: 'children'
				},
			}
		},
		components: {},
		methods: {
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
				this.flagUnPosted = this.uploadData.flagUnPosted;
				this.flagUnTrans = this.uploadData.flagUnTrans;
				this.flagWithoutResult = this.uploadData.flagWithoutResult;
				this.queryPage()
			},

			queryPage() {
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
					flagUnTrans: this.flagUnTrans,
					flagWithoutResult: this.flagWithoutResult
				};
				this.axios.post('/perTaxToolTwo/e9/tBalance/getBalancesList', this.qs.stringify(params), {
						// this.axios.post('/miaoxing/queryPage', params)
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data;
							// this.tableData.push({
							// 	fnumber: '',
							// 	ffullname: '合计',
							// 	fBeginDebitBalance: res.data.data.allFBeginDebitBalance,
							// 	fBeginCreditBalance: res.data.data.allFBeginCreditBalance,
							// 	fdebit: res.data.data.allfdebit,
							// 	fcredit: res.data.data.allfcredit,
							// 	fytddebit: res.data.data.allfytddebit,
							// 	fytdcredit: res.data.data.allfytdcredit,
							// 	fendDebitBalance: res.data.data.allFendDebitBalance,
							// 	fendCreditBalance: res.data.data.allFendCreditBalance
							// })
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
				window.location.href = '/perTaxToolTwo/e9/tBalance/exportBalanceList?fBrNo=' + this.fBrNo + '&fYearStart=' + this.fYearStart +
					'&fPeriodStart=' + this.fPeriodStart + '&fYearEnd=' + this.fYearEnd + '&fPeriodEnd=' + this.fPeriodEnd +
					'&fLevel=' + this.fLevel +
					'&flagUnPosted=' + this.flagUnPosted + '&flagWithoutFinal=' + this.flagWithoutResult + '&flagUnTrans=' + this.flagUnTrans +
					'&fNumberStart=' + this.fNumberStart + '&fNumberEnd=' + this.fNumberEnd


			},
			exportExcel2() {
				window.location.href = '/perTaxToolTwo/e9/tBalance/exportBalanceList2?fBrNo=' + this.fBrNo + '&fYearStart=' + this.fYearStart +
					'&fPeriodStart=' + this.fPeriodStart + '&fYearEnd=' + this.fYearEnd + '&fPeriodEnd=' + this.fPeriodEnd +
					'&fLevel=' + this.fLevel +
					'&flagUnPosted=' + this.flagUnPosted + '&flagWithoutFinal=' + this.flagWithoutResult + '&flagUnTrans=' + this.flagUnTrans +
					'&fNumberStart=' + this.fNumberStart + '&fNumberEnd=' + this.fNumberEnd


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
				var var_head =
					"<table  cellspacing='0'  border='1'  style='border-collapse:collapse;border-color: Black;border-bottom-color:Black;border-right-color:Black;font-family:'宋体';font-size: 9pt;'>";
				var_head += "<thead>" +
					"<tr ><td scope='col'  style='width: 100px;'   rowspan='2'  align='center'>科目代码</td>" +
					"<td scope='col' style='width: 190px;' rowspan='2'  align='center'>科目名称</td>" +
					"<td scope='col'  style='width: 190px;' colspan='2'  align='center'>期初余额</td>" +
					"<td scope='col'  style='width: 190px;' colspan='2'  align='center'>本期发生</td>" +
					"<td scope='col'  style='width: 190px;' colspan='2'  align='center'>本年累计</td>" +
					"<td scope='col'  style='width: 190px;' colspan='2'  align='center'>期末余额</td></tr><tr >" +

					"<td scope='col'  style='width: 95px;'  align='center'>借方</td>" +
					"<td scope='col'  style='width: 95px;'  align='center'>贷方</td>" +
					"<td scope='col'   style='width: 95px;'  align='center'>借方</td>" +
					"<td scope='col' style='width: 95px;'  align='center'>贷方</td>" +
					"<td scope='col' style='width: 95px;'  align='center'>借方</td>" +
					"<td scope='col'  style='width: 95px;'  align='center'>贷方</td>" +
					"<td scope='col' style='width: 95px;'  align='center'>借方</td>" +
					"<td scope='col'  style='width: 95px;'  align='center'>贷方</td>" +
					"</tr></thead><tbody>";

				var var_foot = "</tbody><tfoot></tfoot></table>";

				var rows = this.tableData;
				for (var i = 0; i < rows.length; i++) {

					var row = rows[i];
					var account_fNumber = this.string_isNull(row.account_fNumber);
					var account_fName = this.string_isNull(row.account_fName);
					var fBeginBalanceDebit_string = this.string_isNull(row.fbeginBalanceDebit_string);
					var fBeginBalanceCredit_string = this.string_isNull(row.fbeginBalanceCredit_string);
					var fDebit_string = this.string_isNull(row.fdebit_string);
					var fCredit_string = this.string_isNull(row.fcredit_string);
					var fYtdDebit_string = this.string_isNull(row.fytdDebit_string);
					var fYtdCredit_string = this.string_isNull(row.fytdCredit_string);
					var fEndBalanceDebit_string = this.string_isNull(row.fendBalanceDebit_string);
					var fEndBalanceCredit_string = this.string_isNull(row.fendBalanceCredit_string);

					var_body += "<tr >";
					var_body += "<td style='width:100px;' align='left'>" + account_fNumber + "</td>";
					var_body += "<td style='width:190px;' align='left'>" + account_fName + "</td>";
					var_body += "<td style='width:95px;' align='right'>" + fBeginBalanceDebit_string + "</td>";
					var_body += "<td style='width:95px;' align='right'>" + fBeginBalanceCredit_string + "</td>";
					var_body += "<td style='width:95px;' align='right'>" + fDebit_string + "</td>";
					var_body += "<td style='width:95px;' align='right'>" + fCredit_string + "</td>";
					var_body += "<td style='width:95px;' align='right'>" + fYtdDebit_string + "</td>";
					var_body += "<td style='width:95px;' align='right'>" + fYtdCredit_string + "</td>";
					var_body += "<td style='width:95px;' align='right'>" + fEndBalanceDebit_string + "</td>";
					var_body += "<td style='width:95px;' align='right'>" + fEndBalanceCredit_string + "</td>";
					var_body += "</tr>";

				}
				var LODOP = this.getLodop(document.getElementById('LODOP_OB'), document
					.getElementById('LODOP_EM'));
				/*var LODOP = getCLodop();*/
				if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) return;
				//LODOP.PRINT_INITA("科目余额表打印");
				LODOP.PRINT_INITA(5, 0, 800, 600, "KMYEBDY"); // 科目余额表打印
				LODOP.SET_PRINT_STYLE("FontSize", 10);
				LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");

				LODOP.ADD_PRINT_TEXT(10, 422, 175, 30, "科目余额表");
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
				// var printDate=getCurrentDate()	;
				// LODOP.ADD_PRINT_TEXT(40, 410, 175, 20,"打印日期："+ printDate);
				//LODOP.SET_PRINT_STYLEA(0,"ItemType",1);
				var fYearStart = this.fYearStart;
				var fPeriodStart = this.fPeriodStart;
				var fYearEnd = this.fYearEnd;
				var fPeriodEnd = this.fPeriodEnd;
				var ss;
				if (fYearEnd == fYearStart) {
					ss = "期间:" + fYearStart + "年第" + fPeriodStart + "期 至 " + "第" + fPeriodEnd + "期";
					if (fPeriodStart == fPeriodEnd) {
						ss = "期间:" + fYearStart + "年第" + fPeriodStart + "期 ";
					}

				} else {
					ss = "期间:" + fYearStart + "年第" + fPeriodStart + "期 至 " + fYearEnd + "年第" + fPeriodEnd + "期";

				}
				LODOP.ADD_PRINT_TEXT(40, 25, 250, 20, ss);
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				//var fBrNo = $("#vouchers_CustomerName_combobox").combobox('getText');
				LODOP.ADD_PRINT_TEXT(60, 25, 400, 20, "单位名称：" + this.fBrNo);
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				LODOP.ADD_PRINT_TEXT(60, 900, 100, 20, "币种：人民币");
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);

				var_table = var_head + var_body + var_foot;
				LODOP.ADD_PRINT_TABLE(80, 25, 960, 550, var_table);

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
				var myDate = getLastDay(year, month);

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
			//获取科目
			getProofTAccounts(val,tag) {
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
				if(tag == 1){
					this.search()
				}else{
					this.getProofTVoucher(val)
				}
				
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
			jumpto(){
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/subsidiaryAccountse9', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						// id: row.mainId,
						fBrNo : this.fBrNo,
						fYearStart : this.fYearStart,
						fPeriodStart : this.fPeriodStart,
						fYearEnd : this.fYearEnd,
						fPeriodEnd : this.fPeriodEnd,
						fNumberStart : this.fNumberStart,
						fNumberEnd : this.fNumberEnd,
						fLevel : this.fLevel,
						flagUnPosted : this.flagUnPosted,
						flagUnTrans : this.flagUnTrans,
						flagWithoutResult : this.flagWithoutResult
					}
				})
			},
			jumptothis(row, column, event){
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/subsidiaryAccountse9', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						// id: row.mainId,
						fBrNo : this.fBrNo,
						fYearStart : this.fYearStart,
						fPeriodStart : this.fPeriodStart,
						fYearEnd : this.fYearEnd,
						fPeriodEnd : this.fPeriodEnd,
						fNumberStart : row.account_fNumber,
						fNumberEnd : row.account_fNumber,
						fLevel : this.fLevel,
						flagUnPosted : this.flagUnPosted,
						flagUnTrans : this.flagUnTrans,
						flagWithoutResult : this.flagWithoutResult
					}
				})
			}
		},
		computed: {},
		created() {
			// this.queryPage();
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
			if(this.$route.query.customerName){
				this.uploadData.fBrNo = this.$route.query.customerName;
				this.uploadData.fYearStart = this.$route.query.accountPeriod.slice(0,4);
				this.uploadData.fPeriodStart = this.$route.query.accountPeriod.slice(5,7);
				this.uploadData.fYearEnd = this.$route.query.accountPeriod.slice(0,4);
				this.uploadData.fPeriodEnd = this.$route.query.accountPeriod.slice(5,7);
				this.getProofTAccounts(this.$route.query.customerName,1)
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
			height: 30px;
			line-height: 29px;
			padding-left: 20px;
			/* background-color: #fff; */
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box
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
			height: 90px;
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
			padding: 0px 20px 20px;
			height: calc(100% - 200px);

			h5 {
				height: 40px;
				line-height: 40px;
			}

			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}
		}
	}

	.Article {
		/*  background: red;
    opacity: 0.2; */
		margin: 0;
		position: relative;
		/* padding-top: 53px; */

		.Article-title {
			width: 850px;
			height: 20px;
			margin: 0 auto;
			box-sizing: border-box;
			box-sizing: content-box;

			.Article-title-nav {
				width: calc(100% / 12);
				height: 38px;
				display: inline-block;
				font-size: 12px;
				text-align: center;
				line-height: 38px;
				font-family: Microsoft YaHei;
				font-weight: 400;
				color: #999;
			}
		}

		.Article-nav {
			width: 850px;
			height: 18px;
			margin: 0 auto;
			box-sizing: border-box;
			box-sizing: content-box;
			/* background-color: red; */
			padding-top: 10px;
			padding-bottom: 10px;
			display: flex;
			flex-direction: row;
			position: relative;
			z-index: 1000;
			position: absolute;
			left: calc(50% - 425px);
			justify-content: space-around;

			.Article-circle {
				display: inline-block;
				width: 8px;
				height: 8px;
				border: 1px solid rgb(125, 195, 109);
				background: #fff;
				border-radius: 50%;
				margin: 0 20px;
			}
		}

		.line {
			width: 850px;
			height: 1px;
			background-color: #DCDCDC;
			position: absolute;
			left: 50%;
			top: 34px;
			transform: translate(-50%, -50%);
			z-index: 1;

			.line-chiled {
				height: 1px;
				background: rgb(125, 195, 109);
			}
		}

		.Article-nav div:nth-of-type(2) {
			margin-left: 20px;
		}

		.Article-nav div:nth-of-type(3) {
			margin-left: 20px;
		}

		.Article-nav div:nth-of-type(4) {
			margin-left: 20px;
		}

		.Article-nav div:nth-of-type(5) {
			margin-left: 20px;
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
