<template>
	<div class='main clearfix'>
		<el-page-header @back="goBack" content="现金流量表">
		</el-page-header>
		
		<div class='main_contain'>
			<div style="text-align: center;" class="clearfix">
				
				<p style="display: inline-block;width:200px">{{customerName}}</p>
				
				<el-button class="el-icon-download" type='text' size="mini" :disabled="tableData.length <= 0" @click='exportExcel()' style='float:right'>打印</el-button>
				<!-- <el-button class="el-icon-download" type='text' size="mini" :disabled="arr.length <= 0" @click='exportExcel()' style='float:right'>打印</el-button> -->
				<el-button class="el-icon-refresh" type='text' size="mini" @click='refresh()' style='float:right'>刷新</el-button>
			</div>
			
			
			

			
			<el-table :data="arr" style="width: 100%;margin-top: 10px;" border v-loading='loading'>
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
				
				selectNum: new Date().getMonth(),
				percentage: 0,
				uploadData: {},
				customerId: '',
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
				goBack(){
					if(this.$route.query.type == 1){
						this.$router.push({
							path:'/financeCalculateCenter/archivesSearch',
							
						})
					}else{
						this.$router.push({
							path:'/financeCalculateCenter/accountingReports',
							
						})
					}
					
				},
			refresh(){
				this.queryPage()
			},
			
			search() {
				this.customerId = this.$route.query.customerId;
				this.customerName = this.$route.query.customerId;
				this.belongDate = this.$route.query.belongDate;
				this.queryPage()
			},
			queryPage() {
				this.loading = true;
				let params = {
					"customerId": this.customerId,
					"belongDate": this.belongDate
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
						this.loading = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			exportExcel(){
				let params = {
					"customerId": this.customerId,
					"belongDate": this.belongDate
				};
				this.axios.post('/perTaxToolTwo/TCashflow/PrintTCashflowInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible = true;
							// this.detail = res.data.data;
							this.detail = res.data.data.slice(0,4) + 's' + res.data.data.slice(4);
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
		watch: {
			
			'$route'(to, from) {
				// init data
				if (to.name == 'cashStatement1') {
					// this.getInvoiceStatistics();
					this.customerName = this.$route.query.customerName;
					this.customerId = this.$route.query.customerId;
					this.belongDate = this.$route.query.belongDate;
					// this.fyear = this.belongDate.slice(0,4);
					// this.selectNum = parseFloat(this.belongDate.slice(5,7)) - 1;
					this.queryPage();
				}
				
		
			}
			// screenWidth(val) {
			// 	
			// }
		},
		created() {
			// this.queryPage();
			this.customerName = this.$route.query.customerName;
			this.customerId = this.$route.query.customerId;
			this.belongDate = this.$route.query.belongDate;
			// this.fyear = this.belongDate.slice(0,4);
			// this.selectNum = parseFloat(this.belongDate.slice(5,7)) - 1;
			this.queryPage();
		}
	}
</script>

<style lang='less' scoped>
	.main {
		/* background: #fff; */
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		.el-page-header {
			height: 40px;
			line-height: 39px;
			padding-left: 20px;
			background-color: #fff;
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box;
			margin-bottom: 12px;
		}

		/deep/ .el-table td,
		/deep/ .el-table th {
		    padding: 6px 0;
		}
		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 30px;
			background-color: #f9f9f9;
		}

		/deep/ .el-table th {
			background-color: #f9f9f9;
		}

		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #f9f9f9;
		}

		/deep/ .el-table__body tr,
		.el-table__body td {
			padding: 0;
			height: 30px;
			background-color: #fff;
		}

		/deep/ .el-table__body tr.el-table__row--striped {
			background-color: #f9f9f9;
		}

		/deep/ .el-table thead {
			color: #8C8C8C;
		}

		/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
			background-color: #efe9e5;
		}

		/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
			border-bottom-color: #fff;
			background: #f9f9f9;
		}

		.search_contain {
			background: #fff;
			height: 40px;
			/* padding-left: 20px; */
			padding: 0.3rem 20px;
			margin: 0px 20px 10px;

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
			margin: 12px 20px 20px;
			padding: 12px 20px 20px;
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

	

		.Article-nav {
			/* width: 1200px; */
			height: 0.45rem;
			box-sizing: border-box;
			/* background-color: red; */
			/* padding-top: 10px;
			padding-bottom: 10px; */
			margin-left: 20px;
			/* display: flex;
			flex-direction: row;
			position: relative;
			z-index: 1000;
			justify-content: space-around; */
		
			.Article-circle {
				/* display: inline-block; */
				float: left;
				width: 1rem;
				height: 0.45rem;
				margin-right: 0.12rem;
				border: 1px solid #979797;
				background: #fff;
				cursor: pointer;
				box-sizing: border-box;
				color:#8C8C8C;
				
				span:nth-of-type(1){
					width: 50%;
					float:left;
					font-size:0.32rem;
					height:0.45rem;
					line-height:0.45rem;
					text-align: center;
				}
				span:nth-of-type(2){
					width: 50%;
					float:left;
					font-size:0.15rem;
					height:0.22rem;
					line-height:0.25rem;
					/* padding-left:0.12rem */
				}
				span:nth-of-type(3){
					width: 50%;
					float:left;
					font-size:0.15rem;
					height:0.22rem;
					line-height:0.18rem;
					/* padding-left:0.12rem */
				}
			}
		}


	.active-select {
		border-color: #409EFF !important;
		background-color: #409EFF !important;
		color:#fff !important
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
