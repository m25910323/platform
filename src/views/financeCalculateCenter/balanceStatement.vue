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
						<el-select v-model="uploadData.customer" placeholder="请选择公司名称" clearable filterable value-key='customerId'>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>
						</el-select>
					</el-form-item>

					<el-button type="primary" @click='search()' size="mini">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain clearfix'>
			<h5>资产负债表</h5>
			<p>单位名称：{{customerName}}</p>
			<el-button type='text' size="mini" :disabled="arr.length <= 0" @click='exportExcel()' style='float:right'>打印</el-button>
			<div style="float:left;margin-top: 12px;position: relative;z-index: 200;">
				<el-date-picker v-model="value4" type="month" placeholder="选择日期" size="mini" @change="setMonth" value-format="yyyy-MM"
				 format="yyyy-MM">
				</el-date-picker>
			</div>

			<div style="width:1200px;height:40px;" class="Article">
				<div class="Article-title">
					<div class="Article-title-nav" v-for='(item,index) in 12'>{{index+1}}月</div>
				</div>
				<div class="line">
					<div class='line-chiled' :style="'width:calc('+this.percentage+'% + ' + 850/24 + 'px)'"></div>
				</div>
				<div class="Article-nav">
					<div class="Article-circle" v-for='(item,index) in 12' :class="selectNum==index?'active-select':''" @click="selectNumChange(index)"></div>
				</div>

			</div>
			<el-table :data="arr" style="width: calc(50% - 6px);margin-top: 10px;float: left;" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="" label="资产" prop="title">
					<template slot-scope="scope">
						<span v-html='scope.row.title'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="行次" prop='index1' width="50"></el-table-column>
				<el-table-column align="center" label="年初数" prop="valueM"></el-table-column>
				<el-table-column align="center" label="期末数" prop="valueY"></el-table-column>

			</el-table>
			<el-table :data="arr1" style="width: calc(50% - 6px);margin-top: 10px;float: right;" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="" label="负债和所有者权益" prop="title">
					<template slot-scope="scope">
						<span v-html='scope.row.title'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="行次" prop='index1' width="50"></el-table-column>
				<el-table-column align="center" label="年初数" prop="valueM"></el-table-column>
				<el-table-column align="center" label="期末数" prop="valueY"></el-table-column>

			</el-table>
		</div>
		
		<el-dialog title="详情" :visible.sync="dialogVisible" width="1400px">
			<div>
				<embed width="1260" height="600" :src="detail"></embed>
			</div>
		
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				dialogVisible:false,
				detail:'',
				loading: false,
				value4: this.formatTimeToStr(new Date(), 'yyyy-MM'),
				selectNum: new Date().getMonth(),
				percentage: 0,
				uploadData: {},
				customerId: 0,
				tableData: [],
				tableData1: [],
				ar1r: [],
				arr: [],
				customerName:'',
				list: [{
						title: "流动资产:",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;货币资金",
						valueM: "monetaryfundbefore",
						valueY: "monetaryfundend",
						index: 1
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;短期投资",
						valueM: "shortterminvestmentsbefore",
						valueY: "shortterminvestmentsend",
						index: 2
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;应收票据",
						valueM: "notesreceivablebefore",
						valueY: "notesreceivableend",
						index: 3
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;应收股利",
						valueM: "dividendreceivablebefore",
						valueY: "dividendreceivableend",
						index: 4
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;应收利息",
						valueM: "receivableaccrualbefore",
						valueY: "receivableaccrualend",
						index: 5
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;应收账款",
						valueM: "receivablesbefore",
						valueY: "receivablesend",
						index: 6
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其他应收款",
						valueM: "otherreceivablesbefore",
						valueY: "otherreceivablesend",
						index: 7
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;预付账款",
						valueM: "prepaidreceivablebefore",
						valueY: "prepaidreceivableend",
						index: 8
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;应收补贴款",
						valueM: "butiekuanreceivablebefore",
						valueY: "butiekuanreceivableend",
						index: 9
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存货",
						valueM: "inventorybefore",
						valueY: "inventoryend",
						index: 10
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;待摊费用",
						valueM: "prepaideexpensesbefore",
						valueY: "prepaideexpensesend",
						index: 11
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一年内到期的长期债权投资",
						valueM: "ylongtermdebtinvestmentsbefore",
						valueY: "ylongtermdebtinvestmentsend",
						index: 21
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其他流动资产",
						valueM: "otherliquidassetsbefore",
						valueY: "otherliquidassetsend",
						index: 24
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;流动资产合计",
						valueM: "floatingassetstotalbefore",
						valueY: "floatingassetstotalend",
						index: 31
					},
					{
						title: "长期投资:",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长期股权投资",
						valueM: "longtermeequityinvestmentbefore",
						valueY: "longtermeequityinvestmentend",
						index: 32
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长期债权投资",
						valueM: "longtermdebtinvestmentsbefore",
						valueY: "longtermdebtinvestmentsend",
						index: 34
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长期投资合计",
						valueM: "longterminvestmenttotalsbefore",
						valueY: "longterminvestmenttotalsend",
						index: 38
					},
					{
						title: "固定资产:",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;固定资产原价",
						valueM: "originalvaluefixedassetsbefore",
						valueY: "originalvaluefixedassetsend",
						index: 39
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;减：累计折旧",
						valueM: "accumulateddepreciationbefore",
						valueY: "accumulateddepreciationend",
						index: 40
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;固定资产净值",
						valueM: "netvalueffixedassetsbefore",
						valueY: "netvalueffixedassetsend",
						index: 41
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;减：固定资产减值准备",
						valueM: "fixedassetsdepreciationbefore",
						valueY: "fixedassetsdepreciationend",
						index: 42
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;固定资产净额",
						valueM: "fixednetaassetsbefore",
						valueY: "fixednetaassetsend",
						index: 43
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;工程物资",
						valueM: "engineeringmaterialsbefore",
						valueY: "engineeringmaterialsend",
						index: 44
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;在建工程",
						valueM: "constructionprogressbefore",
						valueY: "constructionprogressend",
						index: 45
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;固定资产清理",
						valueM: "fixedassetscleaningbefore",
						valueY: "fixedassetscleaningend",
						index: 45
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;固定资产合计",
						valueM: "fixedassetstotalbefore",
						valueY: "fixedassetstotalend",
						index: 50
					},
					{
						title: "无形资产及其他资产:",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;无形资产",
						valueM: "intangibleassetsbefore",
						valueY: "intangibleassetsend",
						index: 51
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长期待摊费用",
						valueM: "longtermdeferredexpensesbefore",
						valueY: "longtermdeferredexpensesend",
						index: 52
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其他长期资产",
						valueM: "otherlongtermassetsbefore",
						valueY: "otherlongtermassetsend",
						index: 53
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;无形资产及其他资产合计",
						valueM: "otherassetstotalbefore",
						valueY: "otherassetstotalend",
						index: 60
					},
					{
						title: "",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "递延税项:",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;递延税款借项",
						valueM: "deferredtaxdebitsbefore",
						valueY: "deferredtaxdebitsend",
						index: 61
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;资产总计",
						valueM: "assetsamountedbefore",
						valueY: "assetsamountedend",
						index: 67
					}

				],
				list1: [{
						title: "流动负债:",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;短期借款",
						valueM: "shorttermborrowingsbefore",
						valueY: "shorttermborrowingsend",
						index: 68
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;应付票据",
						valueM: "notespayablebefore",
						valueY: "notespayableend",
						index: 69
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;应付账款",
						valueM: "accountspayablebefore",
						valueY: "accountspayableend",
						index: 70
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;预收账款",
						valueM: "advancereceivablebefore",
						valueY: "advancereceivableend",
						index: 71
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;应付工资",
						valueM: "dealwithsalarybefore",
						valueY: "dealwithsalaryend",
						index: 72
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;应付福利费",
						valueM: "dealwithwelfarefundsbefore",
						valueY: "dealwithwelfarefundsend",
						index: 73
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;应付股利",
						valueM: "dividendspayablebefore",
						valueY: "dividendspayableend",
						index: 74
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;应交税金",
						valueM: "taxesbefore",
						valueY: "taxesend",
						index: 75
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其他应交款",
						valueM: "othermakemoneybefore",
						valueY: "othermakemoneyend",
						index: 80
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其他应付款",
						valueM: "otherpayablesbefore",
						valueY: "otherpayablesend",
						index: 81
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;预提费用",
						valueM: "accruedexpensesbefore",
						valueY: "accruedexpensesend",
						index: 82
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;预计负债",
						valueM: "estimateddebtsbefore",
						valueY: "estimateddebtsend",
						index: 83
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一年内到期的长期负债",
						valueM: "longtermliabilitiesbefore",
						valueY: "longtermliabilitiesend",
						index: 86
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其他流动负债",
						valueM: "otherliabilitiesbefore",
						valueY: "otherliabilitiesend",
						index: 90
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;流动负债合计",
						valueM: "currentliabilitiestotalbefore",
						valueY: "currentliabilitiestotalend",
						index: 100
					},
					{
						title: "",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "长期负债:",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长期借款",
						valueM: "longtermloansbefore",
						valueY: "longtermloansend",
						index: 101
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;应付债券",
						valueM: "bondspayablebefore",
						valueY: "bondspayableend",
						index: 102
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长期应付款",
						valueM: "longtermaccountspayablebefore",
						valueY: "longtermaccountspayableend",
						index: 103
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;专项应付款",
						valueM: "specialaccountspayablesbefore",
						valueY: "specialaccountspayablesend",
						index: 106
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其他长期负债",
						valueM: "otherlongtermliabilitiesbefore",
						valueY: "otherlongtermliabilitiesend",
						index: 108
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长期负债合计",
						valueM: "longtermliabilitiestotalbefore",
						valueY: "longtermliabilitiestotalend",
						index: 110
					},
					{
						title: "递延税项:",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;递延税款贷项",
						valueM: "deferredtaxloanitembefore",
						valueY: "deferredtaxloanitemend",
						index: 111
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;负债合计",
						valueM: "liabilitiestotalbefore",
						valueY: "liabilitiestotalend",
						index: 114
					},
					{
						title: "",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "股东权益（或股东权益）:",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;实收资本（或股本）",
						valueM: "paidincapitalbefore",
						valueY: "paidincapitalend",
						index: 115
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;减：已归还投资",
						valueM: "alreadyreturnedinvestmentbefore",
						valueY: "alreadyreturnedinvestmentend",
						index: 116
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;实收资本（或股本）净额",
						valueM: "paidincapitalnetbefore",
						valueY: "paidincapitalnetend",
						index: 117
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;资本公积",
						valueM: "capitalreservebefore",
						valueY: "capitalreserveend",
						index: 118
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;盈余公积",
						valueM: "surplusreservebefore",
						valueY: "surplusreserveend",
						index: 119
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其中：法定公益金",
						valueM: "statutorywelfarefundbefore",
						valueY: "statutorywelfarefundend",
						index: 120
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;未分配利润",
						valueM: "undistributedprofitbefore",
						valueY: "undistributedprofitend",
						index: 121
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;所有者权益（股东权益）合计",
						valueM: "ownersequitybefore",
						valueY: "ownersequityend",
						index: 122
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;负债和所有者权益（或股东权益）总计",
						valueM: "liabilitiesownersequitybefore",
						valueY: "liabilitiesownersequityend",
						index: 135
					},
				]

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
				this.customerId = this.uploadData.customer.customerId;
				this.customerName = this.uploadData.customer.customerName;
				this.queryPage()
			},

			queryPage() {
				this.loading = true;
				let params = {
					"customerId": this.customerId,
					"belongDate": this.value4
				};
				this.axios.post('/perTaxToolTwo/TBalancesheet/getTBalancesheetInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data[0];
							this.arr = [];
							this.arr1 = [];
							this.list.forEach((item, i) => {
								this.arr.push({
									title: item.title,
									valueM: this.tableData[item.valueM],
									valueY: this.tableData[item.valueY],
									index1: item.index,
								})
							})
							this.list1.forEach((item, i) => {
								this.arr1.push({
									title: item.title,
									valueM: this.tableData[item.valueM],
									valueY: this.tableData[item.valueY],
									index1: item.index,
								})
							})
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
						} else {
							this.loading = false;
							this.arr = [];
							this.arr1 = [];
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
			exportExcel(){
				let params = {
					"customerId": this.customerId,
					"belongDate": this.value4
				};
				this.axios.post('/perTaxToolTwo/TBalancesheet/PrintTBalancesheetInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible = true;
							this.detail = res.data.data;
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
		computed: {},
		created() {
			// this.queryPage();
			this.percentage = this.selectNum * (100 / 12);
		},
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
