<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>固定资产管理</el-breadcrumb-item>
			<el-breadcrumb-item>固定资产折旧明细表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' style="position:relative;">
					<el-form-item label="资产账簿:" prop="dossierName">
						<el-input value="主账簿" disabled></el-input>
					</el-form-item>
					<el-form-item label="单位名称" prop="dossierName">
						<el-select v-model="uploadData.fBrNo" placeholder="请选择公司名称" clearable filterable @change='getProofTVoucher'>
							<el-option v-for="item in periodCustList" :label="item.customerName" :value='item.customerName'></el-option>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="会计时间:" prop="dossierName">
						<el-date-picker v-model="uploadData.fYear" align="right" type="year" placeholder="选择年" value-format="yyyy" format="yyyy">
						</el-date-picker>
						<span class="demonstration" style="margin-left:5px;">年</span>
						<el-input-number v-model="uploadData.fPeriod" :min="1" :max="12" label="描述文字" style="height:30px;margin-left:10px;width:100px;"></el-input-number>
						<span class="demonstration" style="margin-left:5px;">期</span>


					</el-form-item>
					<div></div>
					<el-form-item label="" prop="dossierName">
						<el-checkbox v-model="uploadData.flagfdepr" :true-label='truelabel' :false-label='falselabel'>包含本期折旧为零的固定资产</el-checkbox>
					</el-form-item>
					<el-form-item label="" prop="dossierName">
						<el-checkbox v-model="uploadData.flagfcleaned" :true-label='truelabel' :false-label='falselabel'>包含本期之前已清理的固定资产</el-checkbox>
					</el-form-item>
					<el-button type="primary" @click='search()' style="margin-left:10px;" size="mini">搜索</el-button>
					<el-button type="text" @click='voucherGather_print()' :disabled="tableData.length <= 0" style="margin-left:10px;" size="mini">打印</el-button>
				</el-form>

			</div>
		</div>
		<div class='main_contain'>
			<div class="clearfix">
				<el-button type="text" size="mini" style="float:right" @click="exportExcel()" :disabled="tableData.length == 0">
				  导出
				</el-button>
			</div>
			<el-table :data="tableData" stripe border v-loading='loading' style="margin-top: 10px;">
				
				<el-table-column align="center" label="类别" prop='fGroupName'></el-table-column>
				<el-table-column align="center" label="资产编码" prop="fAssetNumber"></el-table-column>
				<el-table-column align="center" label="资产名称" prop='fAssetName'></el-table-column>
				<el-table-column align="center" label="使用寿命" prop="fLifePeriods_string"></el-table-column>
				<el-table-column align="center" label="已使用寿命" prop="fDeprPeriods_string"></el-table-column>
				<el-table-column align="center" label="月折旧率" prop="fDeprRate_string"></el-table-column>
				<el-table-column align="center" label="期初原值" prop="fOrgValP_string"></el-table-column>
				<el-table-column align="center" label="期初累计折旧" prop="fAccumDeprP_string"></el-table-column>
				<el-table-column align="center" label="期初净值" prop="fNetValueP_string"></el-table-column>
				<el-table-column align="center" label="期初减值准备" prop="fDecPreP_string"></el-table-column>
				
				<el-table-column align="center" label="期初净额" prop='fNetAmountP_string'></el-table-column>
				<el-table-column align="center" label="原值增加" prop="fOrgValInc_string"></el-table-column>
				<el-table-column align="center" label="原币减少" prop='fOrgValDec_string'></el-table-column>
				<el-table-column align="center" label="折旧调增" prop="fAccumDeprInc_string"></el-table-column>
				<el-table-column align="center" label="折旧调减" prop="fAccumDeprDec_string"></el-table-column>
				<el-table-column align="center" label="减值准备调增" prop="fDecPreInc_string"></el-table-column>
				<el-table-column align="center" label="减值准备调减" prop="fDecPreDec_string"></el-table-column>
				<el-table-column align="center" label="本期折旧额" prop="fDeprShould_string"></el-table-column>
				<el-table-column align="center" label="本年折旧额" prop="fYtdDeprAmount_string"></el-table-column>
				<el-table-column align="center" label="本年实际计提折旧额" prop="fYtdDeprShould_string"></el-table-column>
				
				<el-table-column align="center" label="期末原值" prop="fYtdOrgVal_string"></el-table-column>
				<el-table-column align="center" label="期末累计折旧" prop="fYtdDepr_string"></el-table-column>
				<el-table-column align="center" label="期末净值" prop="fYtdNetValue_string"></el-table-column>
				<el-table-column align="center" label="期末减值准备" prop="fYtdDecPre_string"></el-table-column>
				<el-table-column align="center" label="期末净额" prop="fYtdNetAmount"></el-table-column>
				
			</el-table>
			<el-dialog title="卡片详情" :visible.sync="dialogVisible" width="600px">
				<div>
					<div>
						<div class="card_head">
							<span style="padding:6px;">名称:</span>{{detail.fAssetName}}
						</div>
					</div>
					<div class="card_charts clearfix">
						<p v-for="item in itemList">
							<span>{{item.label}}</span>
							<span>{{detail[item.key]}}</span>
						</p>
					</div>
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button type="primary" @click="dialogVisible = false" size="mini">确 定</el-button>
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
				periodCustList:[],
				fYear: "",
				fPeriod: "",
				fBrNo: "",
				flagfdepr: "",
				flagfcleaned: "",
				truelabel: 1,
				falselabel: 0,
				dialogVisible: false,
				loading: false,
				uploadData: {
					// fBrNo: '新财务测试1'
					flagfdepr:0,
					flagfcleaned:0,
				},
				customerId: 0,
				tableData: [],
				customerName: '',
				list: [],
				pageSize: 10,
				currentPage: 1,
				total: 0,
				detail: {},
				itemList: [{
						label: "类别",
						key: "fGroupName"
					},
					{
						label: "资产编码",
						key: "fAssetNumber"
					},
					{
						label: "使用寿命",
						key: "fLifePeriods_string"
					},
					{
						label: "已使用寿命",
						key: "fDeprPeriods_string"
					},
					{
						label: "月折旧率",
						key: "fDeprRate_string"
					},
					{
						label: "期初原值",
						key: "fOrgValP_string"
					},
					{
						label: "期初累计折旧",
						key: "fAccumDeprP_string"
					},
					{
						label: "期初净值",
						key: "fNetValueP_string"
					},
					{
						label: "期初减值准备",
						key: "fDecPreP_string"
					},
					{
						label: "期初净额",
						key: "fNetAmountP_string"
					},
					{
						label: "原值增加",
						key: "fOrgValInc_string"
					},
					{
						label: "原币减少",
						key: "fOrgValDec_string"
					},
					{
						label: "折旧调增",
						key: "fAccumDeprInc_string"
					},
					{
						label: "折旧调减",
						key: "fAccumDeprDec_string"
					},
					{
						label: "减值准备调增",
						key: "fDecPreInc_string"
					},
					{
						label: "减值准备调减",
						key: "fDecPreDec_string"
					},
					{
						label: "本期折旧额",
						key: "fDeprShould_string"
					},
					{
						label: "本年折旧额",
						key: "fYtdDeprAmount_string"
					},
					{
						label: "本年实际计提折旧额",
						key: "fYtdDeprShould_string"
					},
					{
						label: "期末原值",
						key: "fYtdOrgVal_string"
					},
					{
						label: "期末累计折旧",
						key: "fYtdDepr_string"
					},
					{
						label: "期末净值",
						key: "fYtdNetValue_string"
					},
					{
						label: "期末减值准备",
						key: "fYtdDecPre_string"
					},
					{
						label: "期末净额",
						key: "fYtdNetAmount"
					},

				]
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
			search() {
				this.fYear = this.uploadData.fYear;
				this.fPeriod = this.uploadData.fPeriod;
				this.fBrNo = this.uploadData.fBrNo;
				this.flagfdepr = this.uploadData.flagfdepr;
				this.flagfcleaned = this.uploadData.flagfcleaned;
				// this.customerId = this.uploadData.customer.customerId;
				// this.customerName = this.uploadData.customer.customerName;
				this.queryPage()
			},
			showDetail(item) {
				this.dialogVisible = true;
				this.detail = item;
			},
			exportExcel(){
				window.location.href = '/perTaxToolTwo/e9/tfabalance/exportCardDiscountBalance?fBrNo=' + this.fBrNo + '&fYear=' + this.fYear + '&fPeriod=' + this.fPeriod + '&flagfdepr=' +  this.flagfdepr + '&flagfcleaned=' + this.flagfcleaned;
			},
			queryPage() {
				let params = {
					"fYear": this.fYear,
					"fPeriod": this.fPeriod,
					"fBrNo": this.fBrNo,
					"flagfdepr": this.flagfdepr,
					"flagfcleaned": this.flagfcleaned,
				};
				this.axios.post('/perTaxToolTwo/e9/tfabalance/getAssetBalances', params)
					.then(res => {
						if (res.data.code == 200) {
							this.tableData = res.data.data;
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
					" style='border-collapse:collapse;border-color: Black;border-right-color: Black; font-size: 8pt; font-family: '宋体';' >";
				var_head += "<thead>" +
					"<tr ><td scope='col'  style='width: 60px;'   align='center'>类别</td>" +
					"<td scope='col' style='width: 30px;'   align='center'>资产编码</td>" +
					"<td scope='col'  style='width: 100px;'   align='center'>资产名称</td>" +
					"<td scope='col'  style='width: 40px;'   align='center'>使用寿命</td>" +
					"<td scope='col'   style='width: 40px;'   align='center'>已使用寿命</td>" +
					"<td scope='col'   style='width: 70px;'   align='center'>月折旧率</td>" +
					"<td scope='col'   style='width: 70px;'   align='center'>期初原值</td>" +
					"<td scope='col'   style='width: 70px;'   align='center'>期初累计折旧</td>" +
					"<td scope='col'   style='width: 70px;'   align='center'>期初净值</td>" +
					"<td scope='col'   style='width: 70px;'   align='center'>期初减值准备</td>" + ////
					"<td scope='col'   style='width: 70px;'   align='center'>期初净额</td>" + ////
					"<td scope='col'   style='width: 70px;'   align='center'>原值增加</td>" +
					"<td scope='col'   style='width: 70px;'   align='center'>原值减少</td>" +
					"<td scope='col'   style='width: 70px;'   align='center'>折旧调增</td>" + ////
					"<td scope='col'   style='width: 70px;'   align='center'>折旧调减</td>" + ////
					"<td scope='col'   style='width: 70px;'   align='center'>减值准备调增</td>" + ////
					"<td scope='col'   style='width: 70px;'   align='center'>减值准备调减</td>" + ////
					"<td scope='col'   style='width: 70px;'   align='center'>本期折旧额</td>" +
					"<td scope='col'   style='width: 70px;'   align='center'>本年折旧额</td>" +
					"<td scope='col'   style='width: 70px;'   align='center'>本年实际计提折旧额</td>" + ////
					"<td scope='col'   style='width: 70px;'   align='center'>期末原值</td>" +
					"<td scope='col'   style='width: 70px;'   align='center'>期末累计折旧</td>" +
					"<td scope='col'   style='width: 70px;'   align='center'>期末净值</td>" +
					"<td scope='col'   style='width: 70px;'   align='center'>期末减值准备</td>" + ////
					"<td scope='col'   style='width: 70px;'   align='center'>期末净额</td>" + ////
					"</tr></thead><tbody>";
				var var_foot = "</tbody></table>";
				var rows = this.tableData;
				for (var i = 0; i < rows.length; i++) {
					var row = rows[i];
					var fGroupName = this.string_isNull(row.fGroupName);
					var fAssetNumber = this.string_isNull(row.fAssetNumber);
					var fAssetName = this.string_isNull(row.fAssetName);
					var fLifePeriods_string = this.string_isNull(row.fLifePeriods_string);
					var fDeprPeriods_string = this.string_isNull(row.fDeprPeriods_string);
					var fDeprRate_string = this.string_isNull(row.fDeprRate_string);


					var_body += "<tr >";
					var_body += "<td style='width:60px;' align='left'>" + fGroupName + "</td>";
					var_body += "<td style='width:30px;' align='left'>" + fAssetNumber + "</td>";
					var_body += "<td style='width:100px;' align='left'>" + fAssetName + "</td>";
					var_body += "<td style='width:40px;' align='right'>" + fLifePeriods_string + "</td>";
					var_body += "<td style='width:40px;' align='right'>" + fDeprPeriods_string + "</td>";

					var_body += "<td style='width:70px;' align='right'>" + fDeprRate_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fOrgValP_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fAccumDeprP_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fNetValueP_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fDecPreP_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fNetAmountP_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fOrgValInc_string + "</td>";

					var_body += "<td style='width:70px;' align='right'>" + row.fOrgValDec_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fAccumDeprInc_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fAccumDeprDec_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fDecPreInc_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fDecPreDec_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fDeprShould_string + "</td>";

					var_body += "<td style='width:70px;' align='right'>" + row.fYtdDeprAmount_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fYtdDeprShould_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fYtdOrgVal_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fYtdDepr_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fYtdNetValue_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fYtdDecPre_string + "</td>";
					var_body += "<td style='width:70px;' align='right'>" + row.fYtdNetAmount + "</td>";
					var_body += "</tr>";
				}
				var_table = var_head + var_body + var_foot;

				var LODOP = this.getLodop(document.getElementById('LODOP_OB'), document
					.getElementById('LODOP_EM'));

				if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) return;
				LODOP.PRINT_INIT("GDZCZJMXBDY"); // 固定资产折旧明细表打印

				LODOP.SET_PRINT_STYLE("FontSize", 9);
				LODOP.SET_PRINT_PAGESIZE(2, 0, 0, "A4");

				LODOP.ADD_PRINT_TEXT(30, 350, 300, 30, "固定资产折旧明细表");
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
				LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
				LODOP.ADD_PRINT_TEXT(60, 380, 400, 20, "资产账簿：主账簿");
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);

				LODOP.ADD_PRINT_HTM(20, 970, 100, 20, "页号: " +
					"<font  format='##'><span tdata='pageNO'>##</span><span tdata='pageCount'>/##</span></font>");
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1); //循环上一命令（页码）
				// var fBrNo = $("#vouchers_CustomerName_combobox").combobox('getText');
				LODOP.ADD_PRINT_TEXT(60, 20, 400, 25, "单位名称：" + this.fBrNo);
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				var fYear = this.fYear;
				var fPeriod = this.fPeriod;
				LODOP.ADD_PRINT_TEXT(60, 950, 150, 25, "会计期间：" + fYear + "年" + fPeriod + "期");
				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				LODOP.ADD_PRINT_TABLE(85, 20, 1040, 550, var_table);

				var printDate = this.getCurrentDate();
				/*	 LODOP.ADD_PRINT_TEXT(645, 40, 200, 25, "操作员：Administrator");
				     LODOP.SET_PRINT_STYLEA(0,"ItemType",1);*/

				//LODOP.ADD_PRINT_TEXT(40, 950, 150, 25, "打印日期："+printDate);
				// LODOP.SET_PRINT_STYLEA(0,"ItemType",1);


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
		
		.demo-table-expand label {
		    width: 90px;
		    color: #99a9bf;
		  }
		  .demo-table-expand .el-form-item {
		    margin-right: 0;
		    margin-bottom: 0;
		    width: 50%;
		  }

		.main_contain {
			background: #fff;
			margin: 0 20px;
			padding: 20px 20px;
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
		height: 340px;
		padding-top: 10px;

		p {
			width: 50%;
			float: left
		}

		p span {
			height: 30px;
			line-height: 30px;
		}

		p span:nth-of-type(2n) {
			float: left;
			width: 40%;
			/* text-align: right; */
			padding-right: 20px;
			box-sizing: border-box
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
