<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>报表管理</el-breadcrumb-item>
			<el-breadcrumb-item>利润表</el-breadcrumb-item>
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
			<h5>利润表</h5>
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
				this.axios.post('/perTaxToolTwo/TProfit/PrintTProfitInfo', params)
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
