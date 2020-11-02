<template>
	<div class='main clearfix'>
		<el-page-header @back="goBack" content="利润表">
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
				
				selectNum: new Date().getMonth(),
				percentage: 0,
				uploadData: {},
				customerId: '',
				tableData: [],
				arr: [],
				customerName:'',
				list: [{
						title: "一、主营业务收入",
						valueM: "fmbusinessincome",
						valueY: "fybusinessincome",
						index: 1
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;减：主营业务成本",
						valueM: "fmbusinesscost",
						valueY: "fybusinesscost",
						index: 4
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;主营业务税金及附加",
						valueM: "fmmainbusinesstaxextra",
						valueY: "fymainbusinesstaxextra",
						index: 5
					},
					{
						title: "二、主营业务利润（亏损以“-”填列）",
						valueM: "fmmainbusinessprofit",
						valueY: "fymainbusinessprofit",
						index: 10
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;加：其他业务利润（亏损以“-”填列）",
						valueM: "fmotherbusinessprofit",
						valueY: "fyotherbusinessprofit",
						index: 11
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;减：营业费用",
						valueM: "fmoperatingexpenses",
						valueY: "fyoperatingexpenses",
						index: 14
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;管理费用",
						valueM: "fmmanagementfees",
						valueY: "fymanagementfees",
						index: 15
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;财务费用",
						valueM: "fmfinancialexpenses",
						valueY: "fyfinancialexpenses",
						index: 16
					},
					{
						title: "三、营业利润（亏损以“-”填列）",
						valueM: "fmoperatingprofit",
						valueY: "fyoperatingprofit",
						index: 18
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;加：投资收益（亏损以“-”填列）",
						valueM: "fminvestmentincome",
						valueY: "fyinvestmentincome",
						index: 19
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;补贴收入",
						valueM: "fmsubsidiesincome",
						valueY: "fysubsidiesincome",
						index: 22
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;营业外收入",
						valueM: "fmnonoperatingrevenue",
						valueY: "fynonoperatingrevenue",
						index: 23
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;减：营业外支出",
						valueM: "fmnonoperatingexpenditures",
						valueY: "fynonoperatingexpenditures",
						index: 25
					},
					{
						title: "四、 利润总额",
						valueM: "fmprofittotal",
						valueY: "fyprofittotal",
						index: 27
					},
					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;减：所得税",
						valueM: "fmincometax",
						valueY: "fyincometax",
						index: 28
					},
					{
						title: "五、净利润（亏损以“-”填列）",
						valueM: "fmnetprofit",
						valueY: "fynetprofit",
						index: 30
					},
					{
						title: "",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "补充资料：",
						valueM: "",
						valueY: "",
						index: ''
					},

					{
						title: "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;项 目",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "1、出售、处置部门或被投资单位所得利益",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "2、自然灾害发生的损失",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "3、会计政策变更增加（或减少）利润总额",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "4、会计估计变更增加（或减少）利润总额",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "5、债务重组损失",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "6、其他",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "项目二（限重点企业填写）",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "1、存货购进成本",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "2、其他计入成本",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "3、应发工资总额",
						valueM: "",
						valueY: "",
						index: ''
					},
					{
						title: "4、水电费",
						valueM: "",
						valueY: "",
						index: ''
					}

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
				this.axios.post('/perTaxToolTwo/TProfit/getTProfitInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data[0];

							this.arr = [];
							this.list.forEach((item, i) => {
								this.arr.push({
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
				this.axios.post('/perTaxToolTwo/TProfit/PrintTProfitInfo', params)
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
				if (to.name == 'profitStatement1') {
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
