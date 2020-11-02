<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>账簿管理</el-breadcrumb-item>
			<el-breadcrumb-item>固定资产折旧表</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="资产账簿" prop="dossierName">
						<el-input value="主账簿" disabled>
						</el-input>
					</el-form-item>
					<el-form-item label="会计时间" prop="dossierName">
						<el-date-picker v-model="uploadData.value6" type="date" end-placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
					<el-checkbox v-model="checked">包含本期折旧为零的固定资产</el-checkbox>
					<el-checkbox v-model="checked">包含本期之前已清理的固定资产</el-checkbox>

					<el-button type="primary" @click='search()' size="mini">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<div class='chart_contain'>
					<div v-for='item in list' class='card'>
						<div class='card_first'>
							<div class="p_first">
								<!-- {{item.customerName}} -->
								电视机
								<el-checkbox :label="item" :key="item.id" style='float: right;'>{{ }}</el-checkbox>
							</div>




						</div>


						<div class="charts">
							<p>
								<span>类别</span>
								<span>1</span>
							</p>
							<p>
								<span>资产编码</span>
								<span>11</span>
							</p>
							<p>
								<span>资产名称</span>
								<span>12</span>
							</p>
							<p>
								<span>使用寿命</span>
								<span>1</span>
							</p>
							<p>
								<span>已使用寿命</span>
								<span>1</span>
							</p>
							<p>
								<span>月折旧率</span>
								<span>1</span>
							</p>
							<p>
								<span>期初原值</span>
								<span>1</span>
							</p>
							<p>
								<span>期初累计折旧</span>
								<span>1</span>
							</p>
							<p>
								<span>期初净值</span>
								<span>1</span>
							</p>
						</div>
						<div class='text_contain' @click='showDetail'>
							...
						</div>

					</div>



			</div>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>
		</div>

		<el-dialog width="800px" title="卡片详情" :visible.sync="innerVisible" append-to-body>
			<div class='dialog_contain clearfix'>
				<h2>资产名称：</h2>
				<ul>
					<li v-for='item in labelList'>
						<label for="">{{item.label}}</label><span></span>
					</li>
				</ul>
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
				checked: true,
				value4: this.formatTimeToStr(new Date(), 'yyyy-MM'),
				selectNum: new Date().getMonth(),
				percentage: 0,
				uploadData: {},
				customerId: 0,
				tableData: [],
				arr: [],
				customerName: '',
				list: [{}, {}],
				pageSize: 10,
				currentPage: 1,
				total: 0,
				innerVisible: false,
				labelList: [{
						label: "类别"
					},
					{
						label: "资产编码"
					},
					{
						label: "资产名称"
					},
					{
						label: "使用寿命"
					},
					{
						label: "已使用寿命"
					},
					{
						label: "月折旧率"
					},
					{
						label: "期初原值"
					},
					{
						label: "期初累计折旧"
					},
					{
						label: "期初净值"
					},

					{
						label: "期初减值准备"
					},
					{
						label: "原值增加"
					},
					{
						label: "原币减少"
					},
					{
						label: "折旧调增"
					},
					{
						label: "折旧调减"
					},
					{
						label: "减值准备调增 "
					},
					{
						label: "减值准备调减 "
					},
					{
						label: "本期折旧额"
					},
					{
						label: "本年折旧额"
					},

					{
						label: "本年实际计提折旧额"
					},
					{
						label: "期末原值"
					},
					{
						label: "期末累计折旧"
					},
					{
						label: "期末净值 "
					},
					{
						label: "期末减值准备 "
					},
					{
						label: "期末净额"
					},

				]
			}
		},
		components: {},
		methods: {
			showDetail() {
				this.innerVisible = true;
			},
			search() {
				this.customerId = this.uploadData.customer.customerId;
				this.customerName = this.uploadData.customer.customerName;
				this.queryPage()
			},

			queryPage() {
				let params = {
					"customerId": this.customerId,
					"beglonDate": this.value4
				};
				this.arr = [];
				this.axios.post('/sl/perTaxToolTwo/TBalance/generalLedger', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.tableData = res.data.data;
							for (let i = 0; i < this.tableData.length * 3; i++) {


								this.arr.push({
									fnumber: this.tableData[i].fnumber,
									ffullname: this.tableData[i].ffullname,
									fyear: this.tableData[i].fyear,
									fperiod: this.tableData[i].fperiod,
									title: "期初余额",
									fdebit: this.tableData[i].fBeginDebitBalance,
									fcredit: this.tableData[i].fBeginCreditBalance,
									direction: this.tableData[i].fbeginDirection,
									balance: this.tableData[i].fbegBalance
								});
								this.arr.push({
									fnumber: this.tableData[i].fnumber,
									ffullname: this.tableData[i].ffullname,
									fyear: this.tableData[i].fyear,
									fperiod: this.tableData[i].fperiod,
									title: "本期合计",
									fdebit: this.tableData[i].fdebit,
									fcredit: this.tableData[i].fcredit,
									direction: this.tableData[i].fmdirection,
									balance: this.tableData[i].fmyBalance
								});
								this.arr.push({
									fnumber: this.tableData[i].fnumber,
									ffullname: this.tableData[i].ffullname,
									fyear: this.tableData[i].fyear,
									fperiod: this.tableData[i].fperiod,
									title: "本年累计",
									fdebit: this.tableData[i].fytddebit,
									fcredit: this.tableData[i].fytdcredit,
									direction: this.tableData[i].fyendDirection,
									balance: this.tableData[i].fmyBalance
								})
							}
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
			}
		},
		computed: {},
		created() {
			this.queryPage();
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

	.dialog_contain {

		li {
			width: 50%;
			float: left;

			label {
				width: 50%;
			}

			span {
				width: 50%;
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
