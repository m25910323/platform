<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>报表管理</el-breadcrumb-item>
			<el-breadcrumb-item>现金流量表</el-breadcrumb-item>
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
		<div class='main_contain'>
			<h5>现金流量表</h5>
			<p>单位名称：{{customerName}}</p>
			<el-button type='text' size="mini" :disabled="arr.length <= 0" @click='exportExcel()' style='float:right'>打印</el-button>
			<div style="float:left;margin-top: 12px;position: relative;z-index: 20;">
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
			<el-table :data="arr" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="" label="项目" prop="title">
					<template slot-scope="scope">
						<span v-html='scope.row.title'></span>
					</template>
					
				</el-table-column>
				<el-table-column align="center" label="行次" prop='index1' width="50"></el-table-column>
				<el-table-column align="center" label="金额" prop="valueY"></el-table-column>

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
				arr: [],
				customerName:'',
				list: [{
						title: "一、经营活动产生的现金流量：",
						valueM: "fmbusinessincome",
						valueY: "fmprojectname1",
						index: ''
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销售商品、提供劳务收到的现金",
						valueM: "fmbusinesscost",
						valueY: "fmcashreceivedfromsalesofgoodsandservices",
						index: 1
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收到的税费返还",
						valueM: "fmmainbusinesstaxextra",
						valueY: "fmtaxesreturn",
						index: 3
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收到的其他与经营活动有关的现金",
						valueM: "fmmainbusinessprofit",
						valueY: "fmcashreceivedfromotherbusinessactivities",
						index: 8
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现金流入小计",
						valueM: "fmotherbusinessprofit",
						valueY: "fmcashflowintotal",
						index: 9
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;购买商品接受劳务支付的现金",
						valueM: "fmoperatingexpenses",
						valueY: "fmcashtobuygoodsreceived",
						index: 10
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;支付给职工以及为职工支付的现金",

						valueM: "fmmanagementfees",
						valueY: "fmcashpaidtoemployees",
						index: 12
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;支付的各项税费",

						valueM: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;fmfinancialexpenses",
						valueY: "fmtaxespaid",
						index: 13
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;支付的其他与经营活动有关的现金",

						valueM: "fmoperatingprofit",
						valueY: "fmothercashpaymentsrelatingtooperatingactivities",
						index: 18
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现金流出小计",

						valueM: "fminvestmentincome",
						valueY: "fmcashflowouttotal",
						index: 20
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;经营活动产生的现金流量净额",

						valueM: "fmsubsidiesincome",
						valueY: "fmcashnetflowtotal",
						index: 21
					},
					{
						title: "二、投资活动产生的现金流量：",

						valueM: "fmnonoperatingrevenue",
						valueY: "fmprojectname2",
						index: ''
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收回投资所收到的现金",

						valueM: "fmnonoperatingexpenditures",
						valueY: "fmcashreceivedfrominvestment",
						index: 22
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取得投资收益所取得的现金",

						valueM: "fmprofittotal",
						valueY: "fmcashobtainedfrominvestmentincome",
						index: 23
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;处置固定资产、无形资产和其他长期资产所收回的现金净额",

						valueM: "fmincometax",
						valueY: "fmnetcashfromdisposaloffixedasset",
						index: 25
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收到的其他与投资活动有关的现金",

						valueM: "fmnetprofit",
						valueY: "fmcashreceivedfromotherinvestment",
						index: 28
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现金流入小计",

						valueM: "",
						valueY: "fmcashflowin2",
						index: 29
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;购建固定资产、无形资产和其他长期资产所支付的现金",

						valueM: "",
						valueY: "fmcashpaidbythepurchaseoffixedassets",
						index: 30
					},

					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;投资所支付的现金",

						valueM: "",
						valueY: "fmccashpaidbyinvestment",
						index: 31
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;支付的其他与投资活动有关的现金",

						valueM: "",
						valueY: "fmothercashpaymentsrelatingtoinvestmentactivities",
						index: 35
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现金流出小计",

						valueM: "",
						valueY: "fmcashflowout2",
						index: 36
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;投资活动产生的现金流量净额",

						valueM: "",
						valueY: "fmnetcashflowfrominvestmentactivities",
						index: 37
					},
					{
						title: "三、筹资活动产生的现金流量：",

						valueM: "",
						valueY: "fmprojectname3",
						index: ''
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;吸收投资所收到的现金",

						valueM: "",
						valueY: "fmcashreceivedbyinvestment",
						index: 38
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;取得借款所收到的现金",

						valueM: "",
						valueY: "fmcashobtainedfromborrow",
						index: 40
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;收到的其他与筹资活动有关的现金",

						valueM: "",
						valueY: "fmcashreceivedfromotherfinancingactivities",
						index: 43
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现金流入小计",

						valueM: "",
						valueY: "fmcashflowin3",
						index: 44
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;偿还债务所支付的现金",

						valueM: "",
						valueY: "fmcashpaidfordebtrepayment",
						index: 45
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;分配股利、利润和偿付利息所支付的现金",

						valueM: "",
						valueY: "fmcashpaidfordividendsprofitsandinterest",
						index: 46
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;支付的其他与筹资活动有关的现金",

						valueM: "",
						valueY: "fmcashpaidforotherfinancingactivities",
						index: 52
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现金流出小计",
						valueM: "",
						valueY: "fmcashflowout3",
						index: 53
					},

					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;筹资活动产生的现金流量净额",

						valueM: "",
						valueY: "fmnetcashflowfromfinancingactivities",
						index: 54
					},
					{
						title: "四、汇率变动对现金的影响：",

						valueM: "",
						valueY: "fmprojectname4",
						index: 55
					},
					{
						title: "五、现金及现金等价物净增加额：",

						valueM: "",
						valueY: "fmprojectname5",
						index: 56
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;补充资料",

						valueM: "",
						valueY: "fmadditionalinfo",
						index: '行次'
					},
					{
						title: "1、将净利润调节为经营活动现金流量：",

						valueM: "",
						valueY: "fmprojectname11",
						index: ''
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;净利润",

						valueM: "",
						valueY: "fmnetprofit",
						index: 57
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;加：计提的资产减值准备",

						valueM: "",
						valueY: "fmprovisionforimpairmentofassets",
						index: 58
					},


					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;固定资产折旧",
						valueM: "",
						valueY: "fmassetfixeddepreciation",
						index: 59
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;无形资产摊销",
						valueM: "",
						valueY: "fmamortizationofintangibleassets",
						index: 60
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;长期待摊费用摊销",
						valueM: "",
						valueY: "fmamortizationoflongtermunamortizedexpenses",
						index: 61
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;待摊费用减少（减 增加）",
						valueM: "",
						valueY: "fmprepaideexpenses",
						index: 64
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;预提费用增加（减 减少）",
						valueM: "",
						valueY: "fmaccruedexpenses",
						index: 65
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;处置固定资产、无形资产和其他长期资产的损失（减 收益）",
						valueM: "",
						valueY: "fmprofitlossaboutdisposeasset",
						index: 66
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;固定资产报废损失",
						valueM: "",
						valueY: "fmlossonretirementoffixedassets",
						index: 67
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;财务费用",
						valueM: "",
						valueY: "fmfinancialexpenses",
						index: 68
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;投资损失（减：收益）",
						valueM: "",
						valueY: "fmintervestloss",
						index: 69
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;递延税款贷项（减：借项）",
						valueM: "",
						valueY: "fmdeferredtaxcredit",
						index: 70
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;存货的减少（减：增加）",
						valueM: "",
						valueY: "fminventory",
						index: 71
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;经营性应收项目的减少（减：增加）",
						valueM: "",
						valueY: "fmdecreaseofoperatingaccountsreceivable",
						index: 72
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;经营性应付项目的增加（减：减少）",
						valueM: "",
						valueY: "fmincreaseofoperatingaccountspayable",
						index: 73
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;其他",
						valueM: "",
						valueY: "fmother",
						index: 74
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;经营活动产生的现金流量净额",
						valueM: "",
						valueY: "fmnetcashofoperatingaccounts",
						index: 75
					},
					{
						title: "2、不涉及现金收支的投资和筹资活动：",
						valueM: "",
						valueY: "fmprojectname22",
						index: ''
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;债务转为资本",
						valueM: "",
						valueY: "fmdebttocapital",
						index: 76
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一年内到期的可转换公司债券",
						valueM: "",
						valueY: "fmconvertiblebondwithinoneyear",
						index: 77
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;融资租入固定资产",
						valueM: "",
						valueY: "fmfixedassetsunderfinancinglease",
						index: 78
					},
					{
						title: "3、现金及现金等价物净增加情况",
						valueM: "",
						valueY: "fmprojectname33",
						index: ''
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现金的期末余额",
						valueM: "",
						valueY: "fmcashend",
						index: 79
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;减：现金的期初余额",
						valueM: "",
						valueY: "fmcashbefore",
						index: 80
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;加：现金等价物的期未余额",
						valueM: "",
						valueY: "fmcashequivalentsend",
						index: 81
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;减：现金等价物的期初余额",
						valueM: "",
						valueY: "fmcashequivalentsbefore",
						index: 82
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;现金及现金等价物净增加额",
						valueM: "",
						valueY: "fmnetcash",
						index: 83
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
				this.axios.post('/perTaxToolTwo/TCashflow/getTCashflowInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data[0];

							this.arr = [];
							this.list.forEach((item, i) => {
								this.arr.push({
									title: item.title,
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
				this.axios.post('/perTaxToolTwo/TCashflow/PrintTCashflowInfo', params)
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
