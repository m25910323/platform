<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>报表管理</el-breadcrumb-item>
			<el-breadcrumb-item>现金流量调节表C</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="单位名称" prop="dossierName">
						<el-select v-model="uploadData.fBrNo" placeholder="请选择公司名称" clearable filterable @change='getProofTVoucher'>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option>
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
		<div class='main_contain'>
			<h5>现金流量调节表C</h5>
			
			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="" label="调整项目" prop="fAsset">
					<template slot-scope="scope">
						<span v-html='scope.row.fAsset'></span>
					</template>
					
				</el-table-column>
				<el-table-column align="center" label="调整金额" prop="fAmountLeft"></el-table-column>

			</el-table>
		</div>


	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				fBrNo:'',
				fYear:'',
				fPeriod:'',
				loading: false,
				value4: this.formatTimeToStr(new Date(), 'yyyy-MM'),
				selectNum: new Date().getMonth(),
				percentage: 0,
				dialogVisible: false,
				uploadData: {
					fBrNo:'',
				},
				customerId: 0,
				tableData: [],
				arr: [],
				customerName:'',
				list: [],
				customerType:null

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
				this.axios.post('/perTaxToolTwo/e9/sheet/getCashFlowRegulationC', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
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
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
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
							this.voucherInfo = res.data.data;
							this.uploadData.fYear = res.data.data.fyear.toString();
							this.uploadData.fPeriod = res.data.data.fperiod;
							this.customerType = res.data.data.customerType;
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
