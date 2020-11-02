<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>报表管理</el-breadcrumb-item>
			<el-breadcrumb-item>资产负债表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
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

					<el-button type="primary" @click='search()' size="mini">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain clearfix'>
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
				<el-table-column align="center" label="年初数" prop="fYearBeforeLeft1"></el-table-column>
				<el-table-column align="center" label="期末数" prop="fYearEndLeft1"></el-table-column>
				<el-table-column align="" label="负债和所有者权益" prop="fLiabilitiesAndOwnersEquity">
					<template slot-scope="scope">
						<span v-html='scope.row.fLiabilitiesAndOwnersEquity'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="行次" prop='fRowNumberRight' width="50"></el-table-column>
				<el-table-column align="center" label="年初数" prop="fYearBeforeRight1"></el-table-column>
				<el-table-column align="center" label="期末数" prop="fYearEndRight1"></el-table-column>

			</el-table>

		</div>


	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
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
				},
				customerId: 0,
				tableData: [],
				tableData1: [],
				ar1r: [],
				arr: [],
				customerName: '',
				list: [],
				list1: [],
				customerType: null

			}
		},
		components: {},
		methods: {


			search() {
				this.fBrNo = this.uploadData.fBrNo;
				this.fYear = this.uploadData.fYear;
				this.fPeriod = this.uploadData.fPeriod;
				this.queryPage()
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
							this.tableData.forEach(item => {
								item.fYearBeforeLeft1 = item.fYearBeforeLeft?item.fYearBeforeLeft.replace(/,/g,""):null;
								item.fYearEndLeft1 = item.fYearEndLeft?item.fYearEndLeft.replace(/,/g,""):null;
								item.fYearBeforeRight1 = item.fYearBeforeRight?item.fYearBeforeRight.replace(/,/g,""):null;
								item.fYearEndRight1 = item.fYearEndRight?item.fYearEndRight.replace(/,/g,""):null;
							})
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
			getProofTVoucher(val, tag) {
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
							if (tag == 1) {
								this.customerType = res.data.data.customerType;
								this.search()
							} else {
								this.uploadData.fYear = res.data.data.fyear.toString();
								this.uploadData.fPeriod = res.data.data.fperiod;
								this.customerType = res.data.data.customerType;
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
			getAllCustList() {
				let params = {
					"fBrNo": val
				};
				this.axios.get('/perTaxToolTwo/api/user/getAllCustList.do')
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
		},
		computed: {},
		watch: {

			'$route'(to, from) {
				// init data
				if (to.name == 'balanceStatementE9') {
					var roleList = JSON.parse(sessionStorage.getItem('updateUser')).roleList;
					if (roleList.some((value, index) => value.roleSign == 'e9_cust_queryall')) {
						this.getAllCustList()
					} else {
						this.custList = this.$store.state.cust
					}
					if (this.$route.query.customerName) {
						this.uploadData.fBrNo = this.$route.query.customerName;
						this.uploadData.fYear = this.$route.query.accountPeriod.slice(0, 4);
						this.uploadData.fPeriod = this.$route.query.accountPeriod.slice(5, 7);
						this.getProofTVoucher(this.$route.query.customerName, 1)
					}
				}

			}
		},
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
			};
			var roleList = JSON.parse(sessionStorage.getItem('updateUser')).roleList;
			if (roleList.some((value, index) => value.roleSign == 'e9_cust_queryall')) {
				this.getAllCustList()
			} else {
				this.custList = this.$store.state.cust
			}
			if (this.$route.query.customerName) {
				this.uploadData.fBrNo = this.$route.query.customerName;
				this.uploadData.fYear = this.$route.query.accountPeriod.slice(0, 4);
				this.uploadData.fPeriod = this.$route.query.accountPeriod.slice(5, 7);
				this.getProofTVoucher(this.$route.query.customerName, 1)
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
			height: 40px;
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
