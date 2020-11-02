<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>固定资产管理</el-breadcrumb-item>
			<el-breadcrumb-item>卡片凭证管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
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
					<el-form-item>
						<el-button type="primary" @click='search()' style="margin-left:10px;" size="mini">搜索</el-button>

					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click='import_but()' size="mini">固定资产期末结账</el-button>
						
					</el-form-item>

				</el-form>
			</div>
		</div>
		<div class="search_content">
			<div class="header_bottom">
				<span style="color: #409EFF;position:relative;top:10px;font-size:14px;">卡片凭证明细</span>
			</div>
			<el-table :data="tableData" border style="width: 98%" v-loading='loading1'>
				<!-- <el-table-column header-align='center' type="selection" width="55">
				</el-table-column> -->
				<el-table-column header-align='center' prop="fNumber_fBrNo" label="凭证字号" min-width="100">
				</el-table-column>
				<el-table-column header-align='center' prop="fDate_string" label="日期" width="100">
				</el-table-column>
				<el-table-column header-align='center' prop="fPeriod" label="会计期间" width="75">
				</el-table-column>
				<el-table-column header-align='center' prop="address" label="所属卡片名" min-width="100">
				</el-table-column>
				<el-table-column header-align='center' prop="fEntryID" label="分录号" width="70">
				</el-table-column>
				<el-table-column header-align='center' prop="fExplanation" label="摘要" min-width="200">
				</el-table-column>
				<el-table-column header-align='center' prop="fNumber_account" label="科目代码" min-width="100">
				</el-table-column>
				<el-table-column header-align='center' prop="fFullName" label="科目名称" min-width="200">
				</el-table-column>
				<el-table-column header-align='center' prop="fAmountFor_string" label="原币金额(元)" min-width="100">
				</el-table-column>
				<el-table-column header-align='center' prop="fDebit_string" label="借方(元)" min-width="100">
				</el-table-column>
				<el-table-column header-align='center' prop="fCredit_string" label="贷方(元)" min-width="100">
				</el-table-column>
				<el-table-column header-align='center' prop="fBrNo" label="公司名称" min-width="100">
				</el-table-column>
				<el-table-column header-align='center' prop="address" label="审核结果" min-width="120">
					<template slot-scope="scope">

					</template>
				</el-table-column>
				<el-table-column header-align='center' prop="address" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="mini" v-show="scope.row.fPosted==0 && scope.row.year == fYear && scope.row.month == fPeriod">修改</el-button>
						<el-button type="text" size="mini" v-show="scope.row.fPosted==0 && scope.row.fChecked == 0 && scope.row.year == fYear && scope.row.month == fPeriod">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div class="page">
				<el-pagination style="text-align:right;" background layout="prev, pager, next" :total="total" @current-change="handleCurrentChange"
				 :page-size="10">
				</el-pagination>
			</div>
		</div>
		<el-dialog title="期末结账" :visible.sync="dialogVisible" width="450px">
			<span>结账的目的是肯定本期的工作成果，结转折就费用，进入下一个工作期间。在一个会计期间结束，完成折旧计提和生成凭证工作后，必须经过结账过程才能进入下一个工作期间。</span>
			<div style="margin-top:20px;margin-bottom:20px;">在结账之前，应先检查本期发生的各种变动与实际情况是否吻合、是否已经完成计提折旧工作，凭证字:</div>
			<span style="margin-top:20px">单位名称:</span>
			<el-select v-model="fBrNo1" placeholder="请选择公司名称" clearable filterable @change='getAssetPeriod2' size="mini" style="margin-left:10px;">
				<el-option v-for="item in periodCustList" :label="item.customerName" :value='item.customerName'></el-option>
				<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option> -->
			</el-select>
			<div style="height:10px;">
				
			</div>
			<span style="margin-top:20px">当前账期:</span>
			<el-date-picker size='mini' style="margin-top:10px;margin-left:10px;" v-model="checkoutfYear" align="right" type="year" placeholder="选择年"
			 format="yyyy" value-format="yyyy" disabled>
			</el-date-picker>
			<span class="demonstration" style="margin-left:5px;">年</span>
			<el-input-number size='mini' disabled v-model="checkoutfPeriod" :min="1" :max="12" label="描述文字" style="height:34px;margin-left:10px;"></el-input-number>
			<span class="demonstration" style="margin-left:5px;">期</span>
			<!-- <div style="margin-top:20px">请选择动作:<el-checkbox v-model="checked" style="margin-left:10px;">结账 (C)</el-checkbox> -->
			<!-- </div> -->
			<span slot="footer" class="dialog-footer" style="display: flex;justify-content: center;">
				<el-button type="primary" @click="createAssetCheckout">结 账</el-button>
				<el-button type="danger" @click="createReverseAssetCheckout">反结账</el-button>
			</span>
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "fixedCardDetail",
		data() {
			return {
				periodCustList:[],
				fBrNo1: '',
				fBrNo: '',
				fYear: '',
				fPeriod: '',
				checked: true,
				checkoutfYear: '',
				checkoutfPeriod: '',
				options: [],
				dialogVisible: false,
				loading: false,
				loading1: false,
				uploadData: {
					time: ''
				},
				customerId: 0,
				tableData: [],
				arr: [],
				customerName: '',
				pageSize: 10,
				currentPage: 1,
				total: 0
			}
		},
		components: {},
		methods: {
			getPeriodCustList(){
				let param = {
				};
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
			import_but() {
				this.fBrNo1 = '';
				this.checkoutfYear = '';
				this.checkoutfPeriod = '';
				this.dialogVisible = true;
			},
			//结账
			createAssetCheckout() {
				let params = {
					"fYear": this.checkoutfYear,
					"fPeriod": this.checkoutfPeriod,
					"fBrNo": this.fBrNo1
				};
				this.axios.post('/perTaxToolTwo/e9/tfacard/createAssetCheckout', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible = false;
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
			
			createReverseAssetCheckout() {
				let params = {
					"fBrNo": this.fBrNo1
				};
				this.axios.post('/perTaxToolTwo/e9/tfacard/createReverseAssetCheckout', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible = false;
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
				this.fBrNo = this.uploadData.fBrNo;
				this.fYear = this.uploadData.fYear;
				this.fPeriod = this.uploadData.fPeriod;
				this.queryPage()
			},

			queryPage() {
				this.loading1 = true;
				let params = {
					"year": this.fYear,
					"month": this.fPeriod,
					"fChecked": -1,
					"fPosted": -1,
					"fNumber_erp": 0,
					"fBrNo": this.fBrNo,
					"fInternalInd": "FA",
					"isPrint": 1
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVoucher_search', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading1 = false;
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
						this.loading1 = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			handleSizeChange() {

			},
			handleCurrentChange() {

			},
			//获取账期
			getAssetPeriod(val) {
				let params = {
					"fBrNo":val,
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
							this.checkoutfYear = res.data.data.fyear.toString();;
							this.checkoutfPeriod = res.data.data.fperiod;
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
					var fAlterID = this.string_isNull(row.falterid);
					var fYear = this.string_isNull(row.fYear);
					var fPeriod = this.string_isNull(row.fPeriod);
					var fVoucherDate_string = this.string_isNull(row.fVoucherDate_string);
					var fExplanation = this.string_isNull(row.fExplanation);
					var fAssetNumber = this.string_isNull(row.fassetnumber);
					var fAssetName = this.string_isNull(row.fassetname);
					var fGroupName = this.string_isNull(row.fGroupName);
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
							// this.voucherInfo = res.data.data;
							this.uploadData.fYear = res.data.data.fyear.toString();
							this.uploadData.fPeriod = res.data.data.fperiod;
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
		
			
		},
		created() {
			// this.queryPage();
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

		.search_content {
			background: #fff;
			padding-left: 20px;
			padding-top: 12px;
			margin: 10px 20px;

			.header_bottom {
				width: 100%;
				height: 50px;
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
				cursor: pointer
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

	.demonstration {
		margin-left: 5px;
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
			box-sizing: border-box
		}

		p span:nth-of-type(2n+1) {
			float: left;
			width: 60%;
			text-indent: 20px
		}
	}

	.page {
		padding: 10px;
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
				text-align: center;

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
				box-sizing: border-box
			}

			p span:nth-of-type(2n+1) {
				float: left;
				width: 60%;
				text-indent: 20px
			}
		}
	}
</style>
