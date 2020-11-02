<template>
	<div class="main_contain">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>会计工厂</el-breadcrumb-item>
			<el-breadcrumb-item>凭证管理</el-breadcrumb-item>

			<el-breadcrumb-item>发票回执打印</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>发票回执打印</div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini">
					<el-form-item label="公司">
						<!-- <el-autocomplete class="inline-input" v-model="uploadData.customerName" :fetch-suggestions="querySearch"
							 placeholder="请输入客户名称" @select="handleSelect"></el-autocomplete> -->
						<el-select v-model="uploadData.customerId" placeholder="请选择公司名称" clearable filterable>
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="账期" prop="accountPeriod">
						<el-date-picker v-model="uploadData.accountPeriod" type="month" placeholder="选择账期" value-format='yyyy-MM'>
						</el-date-picker>
					</el-form-item>

					<el-button @click='search' size="mini">查询</el-button>
				</el-form>
			</div>
			<div class="contain_body">
				<el-table :data="detail" style="width: 100%" stripe border v-loading='loading1'>
					<el-table-column align="center" label="客户名称" prop="taxInfoRemark2" :resizable="false"></el-table-column>
					<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>
					<el-table-column align="center" label="收入" prop="incomeCount" :resizable="false"></el-table-column>
					<el-table-column align="center" label="费用" prop="feeCount" :resizable="false"></el-table-column>
					<el-table-column align="center" label="成本" prop="costCount" :resizable="false"></el-table-column>
					<el-table-column align="center" label="其他" prop="otherCount" :resizable="false"></el-table-column>
					<el-table-column align="center" label="未分配" prop="undefinedCount" :resizable="false"></el-table-column>
					<el-table-column align="center" label="合计" prop="totalCount" :resizable="false"></el-table-column>

					<el-table-column align="center" label="发票张数" prop="taxInfoRemark10">
						<template slot-scope="scope">
							<div contenteditable v-text="scope.row.taxInfoRemark10" @blur='handleInput(scope.row,scope.$index, "taxInfoRemark10",$event)'
							 @keydown.enter="cancelenter($event,scope.row,scope.$index, 'taxInfoRemark10')"></div>

						</template>
					</el-table-column>


					<el-table-column align="center" :resizable="false" width="200">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="voucherGather_print(scope.row)">打印</el-button>

						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>
		</div>







	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				trueLabel: 1,
				falseLabel: 0,
				detail: [],
				color: [
					"#409EFF", "#67C23A", "#E6A23C", "#F56C6C"
				],
				uploadData: {
					accountPeriod: '',
				},
				accountPeriod: '',
				list: [{}, {}],
				fileList: [],
				loading: false,
				loading1: false,
				nameData: ['审核通过', '审核未通过', '未审核'],
				formInline: {},
				dialogVisible: false,
				servItemList: [],
				itemList: [],
				total: 0,
				pageSize: 10,
				currentPage: 1,
				trueOrFalse: [{
						label: "是",
						value: 1,
					},
					{
						label: "否",
						value: 0,
					}
				],
				iscomeorgov: [],
				contractTypeList: [],
				contractTaxTypeList: [],
				customerList: [],
				taxmethodList: [],
				customertypeList: [],
				employList: [],
				dialogVisible1: false,
				dialogVisible2: false,
				tableData: [],
				jzfYear: '',
				jzfPeriod: '',
				jzfBrNo: '',
				loading10: false,
				loading11: false,
				isMax: 1,
				voucherState: '',
				firstCheckState: '',
				custList: []


			}
		},
		components: {},
		methods: {


			search() {
				this.customerId = this.uploadData.customerId;
				this.accountPeriod = this.uploadData.accountPeriod;

				this.queryListByPage();
			},

			queryListByPage() {
				this.loading1 = true;
				let param = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						"customerId": this.customerId,
						"accountPeriod": this.accountPeriod,

					}
				};
				this.axios.post('/perTaxToolTwo/e9z/taxStep/getTaxInfoListByPage', param).then(res => {
					this.loading1 = false;
					if (res.data.code == 200) {
						this.detail = res.data.data;
						this.total = res.data.count;

					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading1 = false;
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleSelectionChange1(val) {
				this.multipleSelection1 = val;
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage();
			},


			reset() {
				this.form2 = {};
			},

			handleClose() {
				this.formInline = {};
				this.dialogVisible2 = false;
			},

			addChild() {
				this.dialogVisible2 = true;
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
			voucherGather_print(item) {
				var LODOP = this.getLodop(document.getElementById('LODOP_OB'), document
					.getElementById('LODOP_EM'));
				if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) return;
				//LODOP.PRINT_INITA("资产负债表打印");
				LODOP.PRINT_INITA(5, 0, 800, 600, "ZCFZBDY"); // 资产负债表打印
				LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
				LODOP.ADD_PRINT_TEXT(40, 300, 280, 30, "南京九洲会计咨询有限公司原始凭证收取回执");

				LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
				LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
				//var fBrNo = $("#vouchers_CustomerName_combobox").combobox('getText');
				LODOP.SET_PRINT_STYLE("FontSize", 15);
				LODOP.SET_PRINT_STYLE("Bold", 0);
				// LODOP.ADD_PRINT_TEXT(90, 60, 400, 20, "公司名称：" + 1);
				// LODOP.ADD_PRINT_TEXT(130, 60, 400, 20, "账期：" + 2);
				LODOP.ADD_PRINT_TEXT(110, 60, 400, 20, "公司名称：" + item.taxInfoRemark2);
				LODOP.ADD_PRINT_TEXT(130, 60, 400, 20, "账期：" + item.accountPeriod);
				//var printDate=getCurrentDate()	;

				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				this.balanceSheet_lodopCommon(LODOP, item);
				LODOP.SET_PRINT_STYLE("FontSize", 14);
				LODOP.ADD_PRINT_TEXT(700, 60, 300, 100, "说明：本次为初步分类结果，具体以账务处理结果为准，特此说明！");
				LODOP.SET_PRINT_STYLE("FontSize", 14);
				LODOP.ADD_PRINT_TEXT(800, 60, 450, 20, "打单人：" + JSON.parse(sessionStorage.getItem('updateUser')).phone);
				LODOP.SET_PRINT_STYLE("FontSize", 14);
				LODOP.ADD_PRINT_TEXT(830, 60, 450, 20, "提供人：");
				LODOP.SET_PRINT_STYLE("FontSize", 14);
				LODOP.ADD_PRINT_TEXT(860, 60, 450, 20, "提供时间：" + this.formatTimeToStr(new Date(), 'yyyy-MM-dd'));

				LODOP.PREVIEW();
			},
			balanceSheet_lodopCommon(LODOP, item) {
				var var_table = "";
				var var_body = "";
				var var_head = "<table  cellspacing='0'  border='1' " +
					" style='border-collapse:collapse;border-color: Black;border-bottom-color: Black;border-right-color: Black; font-size: 14pt; font-family: '宋体';' >";
				var_head += "<thead><tr >" +
					"<td scope='col'  style='width:150px;' align='center'  height='30' valign='middle'>序   号</td>" +
					"<td scope='col'  style='width:150px;' align='center'  height='30' valign='middle'>分   类</td>" +
					"<td scope='col'  style='width:150px;' align='center'  height='30' valign='middle'>张   数</td>";

				var var_foot = "</tbody><tfoot></tfoot></table>";
				if(item.taxInfoRemark10 && item.taxInfoRemark10 != '--'){
					var taxInfoRemark10 = item.taxInfoRemark10;
				}else if(item.taxInfoRemark10 && item.taxInfoRemark10 == '--' && item.totalCount != '0'){
					var taxInfoRemark10 = item.totalCount;
				}else{
					var taxInfoRemark10 = '--';
				}
				

				var_body += "<tr >";

				var_body += "<td style='width:150px;' align='center' style='font-size: 14pt;'  height='30' valign='middle'>1</td>";
				var_body += "<td style='width:150px;' align='center'  height='30' valign='middle'>原始凭证</td>";
				var_body += "<td style='width:150px;' align='center'  height='30' valign='middle'>" + taxInfoRemark10 +
					"</td>";



				var_body += "</tr>";
				var_table = var_head + var_body + var_foot;
				LODOP.SET_PRINT_STYLE("FontSize", 14);
				LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
				LODOP.ADD_PRINT_TABLE(170, 60, 650, 897, var_table);
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
			handleInput(row, index, label, event, tag) {
				if (isNaN(Number(event.currentTarget.innerText))) {
					this.$set(this.detail[index], label, '--');
					event.currentTarget.innerText = '--';
					// console.log(5,this.tableList);
					this.$message({
						message: "请正确填写数字",
						type: 'error'
					});

				} else {
					
					if(event.currentTarget.innerText != row.taxInfoRemark10){
						this.$set(this.detail[index], label, event.currentTarget.innerText);
						this.updateE9zBusinessTaxInfo(row)
					}
				}



			},
			updateE9zBusinessTaxInfo(row) {
				let params = {
					"taxInfoId": row.taxInfoId,
					"taxInfoRemark10": row.taxInfoRemark10,
				};
				this.axios.post('/perTaxToolTwo/e9z/taxStep/updateE9zBusinessTaxInfo', params)
					.then(res => {

						if (res.data.code == 200) {
							this.queryListByPage();
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
			getCurrentPeriod() {

				let params = {

				};
				this.axios.post('/perTaxToolTwo/e9z/taxTreatment/getCurrentPeriod', params)
					.then(res => {

						if (res.data.code == 200) {
							this.uploadData.accountPeriod = res.data.data;
							this.accountPeriod = res.data.data;
							this.queryListByPage();
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
		watch: {
			'$route'(to, from) {
				// init data
				if (to.name == 'invoiceDetail') {
					this.queryListByPage();
					// var updateUser = JSON.parse(sessionStorage.getItem('updateUser'));
					// var userTypeId = updateUser.userTypeId;
					// if(userTypeId == 1){
					// 	this.custList = JSON.parse(sessionStorage.getItem('updateCust'));
					// }else{
					// 	this.getAssignmentCustomer();
					// }
				}

			}
		},
		created() {
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

			this.getCurrentPeriod();

			// var updateUser = JSON.parse(sessionStorage.getItem('updateUser'));
			// var userTypeId = updateUser.userTypeId;

			// if(userTypeId == 1){
			// 	this.custList = JSON.parse(sessionStorage.getItem('updateCust'));
			// }else{
			// 	this.getAssignmentCustomer();
			// }
		}
	}
</script>

<style scoped lang="less">
	.main_contain {
		width: 100%;
		height: 100%;
		// padding: 20px;
		box-sizing: border-box;

		/deep/ .el-breadcrumb {
			height: 40px;
			line-height: 40px;
			background: rgb(234, 244, 255);
			padding-left: 20px;
		}


		.btn_contain {
			text-align: center;
			margin-top: 0.36rem;
		}

		.left_contain {
			// width: 100%;
			height: 100%;
			position: relative;
			// padding:0px 20px;
			background: #fff;
			margin: 20px 20px;
			box-sizing: border-box;
		}

		.right_contain {
			height: 100%;
			float: right;
			width: 500px;
			background: #fff;
			padding: 0 12px;
			box-sizing: border-box;

			h3 {
				color: #409EFF;
				height: 40px;
				line-height: 40px;
			}

			/deep/ .el-form-item__content {
				width: 135px
			}

			/deep/ .el-date-editor.el-input {
				width: 100px
			}
		}

		.commit {
			width: 1.2rem;
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
			width: 1.2rem;
			height: 0.4rem;
			line-height: 0.4rem;
			background: #ed878e;
			color: #fff;
			display: inline-block;
			text-align: center;
			border-radius: 4px;
		}
	}

	.contain_header {
		height: 2rem;
		padding: 0px 30px;
		background: url(../../assets/img/list-bg1.png) no-repeat;
		background-size: cover;
		border-top-left-radius: 0.06rem;
		border-top-right-radius: 0.06rem;
		position: relative;

		/deep/ input::-webkit-input-placeholder {
			/* placeholder颜色  */
			color: #fff;
		}

		/deep/ .el-select__caret {
			color: #fff
		}

		.title {
			font-size: 0.24rem;
			height: 1rem;
			line-height: 1.24rem;
			color: #fff;
		}

		/deep/ .el-button {
			color: #43b3db;
		}

		/deep/ .el-range-input {
			color: #fff;
			background: transparent
		}

		/deep/ .el-range-separator {
			color: #fff;
		}

		/deep/ .el-range__icon {
			color: #fff;
		}

		/deep/ .el-form-item--mini .el-form-item__label {
			color: #fff;
		}

		/deep/ .el-form {
			margin-top: 0.1rem
		}

		/deep/ .el-input__inner {
			background: transparent;
			color: #fff;
			border: 1px solid #fff;
		}

		/deep/ .el-input__inner:hover {
			border-color: #fff;
		}

		/deep/ .el-input.is-active .el-input__inner,
		/deep/ .el-input__inner:focus {
			border-color: #fff;
			outline: 0;
		}
	}

	.contain_body {
		position: relative;
		// padding:0px 20px;
		background: #fff;
		margin: 20px 20px;

		.el-tabs {
			height: 100%;
		}

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

	/deep/ .el-form-item__content {
		width: 180px;
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

	/deep/ .el-dialog__body {
		padding: 0 20px 30px;
	}

	.dialog {

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
			width: 100%;
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

	.close {
		width: 1.2rem;
		height: 0.4rem;
		line-height: 0.4rem;
		background: #ed878e;
		color: #fff;
		display: inline-block;
		text-align: center;
		border-radius: 4px;
	}

	/deep/ .el-checkbox {
		color: #fff;
	}

	/deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
		color: #fff;
	}
</style>
