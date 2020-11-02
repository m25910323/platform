<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>账簿管理</el-breadcrumb-item>
			<el-breadcrumb-item>余额表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="单位名称" prop="dossierName">
						<el-select v-model="uploadData.customer" placeholder="请选择公司名称" clearable filterable value-key='customerId'>
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>
						</el-select>
					</el-form-item>

					<el-button type="primary" @click='search()' size="mini">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<h5>余额表</h5>
			<p>单位名称：{{customerName}}</p>
			<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='exportExcel()' style='float:right'>打印</el-button>
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
			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="科目代码" prop="fnumber"></el-table-column>
				<el-table-column align="" label="科目名称" prop='ffullname'>
					<template slot-scope="scope">
						<span v-html='scope.row.ffullname'></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="期初余额借方" prop="fbeginDebitBalance"></el-table-column>
				<el-table-column align="center" label="期初余额贷方" prop="fbeginCreditBalance"></el-table-column>
				<el-table-column align="center" label="本期发生借方" prop="fdebit"></el-table-column>
				<el-table-column align="center" label="本期发生贷方" prop="fcredit"></el-table-column>
				<el-table-column align="center" label="本年累计借方" prop="fytddebit"></el-table-column>
				<el-table-column align="center" label="本年累计贷方" prop="fytdcredit"></el-table-column>
				<el-table-column align="center" label="期末余额借方" prop="fendDebitBalance"></el-table-column>
				<el-table-column align="center" label="期末余额贷方" prop="fendCreditBalance"></el-table-column>

			</el-table>
		</div>
		
		<el-dialog title="详情" :visible.sync="dialogVisible" width="1300px">
			<div>
				<embed width="1260" height="600" :src="pdfUrl"></embed>
			</div>
			
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				loading: false,
				value4: this.formatTimeToStr(new Date(), 'yyyy-MM'),
				selectNum: new Date().getMonth(),
				percentage: 0,
				uploadData: {},
				customerId: 0,
				tableData: [],
				customerName:'',
				resData:{},
				dialogVisible:false,
				pdfUrl:''

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
				this.axios.post('/perTaxToolTwo/TBalance/getBalanceInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.resData = res.data.data;
							this.tableData = res.data.data.balanceList;
							this.tableData.push({
								fnumber:'',
								ffullname:'合计',
								fBeginDebitBalance:res.data.data.allFBeginDebitBalance,
								fBeginCreditBalance:res.data.data.allFBeginCreditBalance,
								fdebit:res.data.data.allfdebit,
								fcredit:res.data.data.allfcredit,
								fytddebit:res.data.data.allfytddebit,
								fytdcredit:res.data.data.allfytdcredit,
								fendDebitBalance:res.data.data.allFendDebitBalance,
								fendCreditBalance:res.data.data.allFendCreditBalance
							})
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
						} else {
							this.loading = false;
							this.tableData = [];
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
						this.tableData = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			exportExcel(){
				this.resData.customerId = this.customerId;
				this.resData.customerName = this.customerName;
				this.resData.belongDate = this.value4;
				let params = this.resData;
				this.axios.post('/perTaxToolTwo/TBalanceVo/PrintTBalanceInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						
						if (res.data.code == 200) {
							this.dialogVisible = true;
							this.pdfUrl = res.data.data.balancePdfUrl;
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
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
