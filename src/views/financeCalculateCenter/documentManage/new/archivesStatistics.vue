<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案管理</el-breadcrumb-item>
			<el-breadcrumb-item>档案统计</el-breadcrumb-item>
		</el-breadcrumb>

		<div class='main_contain'>
			<div class='card_contain clearfix'>
				<div class='card'>
					<h4>档案类别占比</h4>
					<div class='charts'>

					</div>
				</div>
				<div class='card'>
					<h4>档案保存期占比</h4>
					<div class='charts'>

					</div>
				</div>
				<div class='cardshort cardshort1'>
					<!-- <span>745</span> -->
					<span>{{inbound}}</span>
					<h4>本月档案入库</h4>

				</div>
				<div class='cardshort cardshort2'>
					<!-- <span>520</span> -->
					<span>{{outbound}}</span>
					<h4>本月档案出库</h4>
				</div>
				<div class='cardlong'>
					<h4>档案借阅统计</h4>
					<div class='charts'>

					</div>
					<div style="position: absolute;top: 40px;right: 0px;width: 300px;height: 40px;text-align: center;">
						<label for="" style="font-size: 14px;margin-right: 10px;">选择年度</label>
						<el-input-number v-model="num" @change="handleChange" :min="1970" size="small"></el-input-number>
					</div>
				</div>
			</div>

		</div>

	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				num: new Date().getFullYear(),
				dialogVisible: false,
				uploadData: {},
				titleList: [

					{
						title: "档案类别占比",
						color: 'rgb(237,135,142)'
					},
					{
						title: "档案保存期占比",
						color: 'rgb(67,179,219)'
					},
					{
						title: "档案借阅统计",
						color: 'rgb(125,195,109)'
					},

				],
				chart1: [],
				chart2: [],
				chart3: [],
				chart4: [],
				data1: [],
				data2: [],
				data3: [],
				data4: [],
				inbound: '',
				outbound: '',
				monthList: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				total: 0,
				currentPage: 1,
				cardList: [],
				pageSize: 10,
				employeeList: [],
				typeList: [],
				postData: {
					categoryrId: '',
					belongDate: ''
				},
				temdata: {
					re1: '0-5年',
					re2: '5-10年',
					re3: '10-20年',
					re4: '20-30年',
					re5: '永久',
				},
				temname: [
					'0-5年', '5-10年', '10-20年', '20-30年', '永久'
				]
			}
		},
		components: {},
		methods: {


			handleChange() {
				this.statisticsByYear()
			},



			statisticsByYear() {
				this.data1 = [];
				let params = {
					"year": this.num
				};
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/statisticsByYear', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.chart1.borrow = res.data.data.borrow;
							this.chart1.retur = res.data.data.retur;
							// this.chart1.forEach(item => {
							// 	this.data1.push(item.storageCount)
							// })

							this.drawLine1()
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

			getStatisDifferntArchivesCategory() {
				this.data3 = [];
				this.nameData3 = [];
				let params = {
					"customer": ""
				};
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/StatisDifferntArchivesCategory', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.chart3 = res.data.data;
							this.chart3.forEach(item => {
								this.data3.push({
									name: item.categoryName,
									value: item.categoryCount
								})

								this.nameData3.push(item.categoryName)
							})

							this.drawLine3()
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
			getStatisArchivesStorageDate() {
				this.data4 = [];
				this.nameData4 = [];
				let params = {
					"accountNo": ""
				};
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/StatisArchivesStorageDate', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							console.log(res.data.data);
							this.chart4 = res.data.data;
							// this.chart4.forEach(item => {
							// 	this.data4.push({
							// 		name: item.categoryName,
							// 		value: item.categoryCount
							// 	})
							for (let x in this.chart4) {
								this.data4.push({
									name: this.temdata[x],
									value: this.chart4[x]
								})
							}

							// 	this.nameData4.push(item.categoryName)
							// })

							this.drawLine4()
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
			statisticsInboundAndOutbound() {

				let params = {
					"archivesStorageId": ""
				};
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/statisticsInboundAndOutbound', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.inbound = res.data.data.inNumber;
							this.outbound = res.data.data.outNumber;
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
			drawLine1() {
				// 引入 ECharts 主模块
				let echarts = require('echarts/lib/echarts');
				// 引入柱状图
				require('echarts/lib/chart/bar');
				// 引入提示框和标题组件
				require('echarts/lib/component/tooltip');
				require('echarts/lib/component/title');
				require('echarts/lib/component/legend');
				// 基于准备好的dom，初始化echarts实例
				var myChartDiv = document.getElementsByClassName("charts");
				// myChartDiv.style.width = document.getElementsByClassName('right_contain')[0].offsetWidth + 'px';

				var myChart = echarts.init(myChartDiv[2]);
				let echarts1_option = {
					tooltip: {
						trigger: 'axis'
					},
					color: ['#666'],
					grid: {
						top: 40,
						left: 30,
						right: 300,
						bottom: 10,
						containLabel: true
					},
					legend: {
						data: ['档案借阅', '档案归还'],
						orient: 'vertical',
						right: 100,
						top: 100
					},
					xAxis: {
						boundaryGap: true,
						name: '月份',
						type: 'category',
						data: this.monthList,
						axisLine: {
							lineStyle: {
								color: '#999',
							}
						},
						axisTick: {
							show: false
						}
					},
					yAxis: {
						type: 'value',
						// name: '数量/件',
						axisLine: {
							lineStyle: {
								color: '#999',
							}
						},
						axisTick: {
							show: false
						}
					},
					color: this.color,
					series: [{
							data: this.chart1.borrow,
							// data: [220, 182, 191, 234, 290, 330, 310, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220],
							name: '档案借阅',
							type: 'bar',
							barWidth: 10,
							itemStyle: {
								normal: {
									color: 'rgb(64,158,255)',

								}
							},
						},
						{
							// data: [120, 382, 291, 134, 190, 430, 210, 123, 442, 321, 90, 149, 210, 122, 133, 334, 198, 123, 125, 220],
							data: this.chart1.retur,
							name: '档案归还',
							type: 'bar',
							barWidth: 10,
							itemStyle: {
								normal: {
									color: 'rgb(133,212,139)',
									lineStyle: {
										color: 'rgb(133,212,139)'
									}
								}
							},
						}
					]

				};
				// 先清空
				myChart.clear();
				// 绘制图表
				myChart.setOption(echarts1_option);
				window.addEventListener("resize", () => { myChart.resize();});
				// window.addEventListener("resize", this.resizeHandle(myChart))

			},


			drawLine3() {
				// 引入 ECharts 主模块
				var echarts = require('echarts/lib/echarts');
				// 引入柱状图
				require('echarts/lib/chart/pie');
				// 引入提示框和标题组件
				require('echarts/lib/component/tooltip');
				require('echarts/lib/component/title');
				require('echarts/lib/component/legend');
				// 基于准备好的dom，初始化echarts实例
				var myChartDiv = document.getElementsByClassName("charts");
				// myChartDiv.style.width = document.getElementsByClassName('right_contain')[0].offsetWidth + 'px';

				var myChart = echarts.init(myChartDiv[0]);

				let echarts1_option = {
					tooltip: {
						trigger: "item",
						formatter: "{b}: {c} ({d}%)"
					},
					legend: {
						orient: "vertical",
						// left: this.nameData.length<=3?'40%':'', //图例距离左的距离
						right: '40px', //图例距离右的距离
						top: "30px",
						padding: [0, 0, 30, 30],
						y: 'center', //图例上下居中
						// x: "center", //图例水平居中
						// 图标大小,宽和高
						itemWidth: 10,
						itemHeight: 10,
						itemGap: 20,
						textStyle: {
							fontSize: 12,
							color: "#666"
						},
						icon: "circle",
						// data: ["记账凭证","总账","明细账","资产负债","现金流量","利润"]
						data: this.nameData3
						
					},
					color: ['#FF9E00', '#B47CFF', '#409EFF', '#85D48B'],
					series: [{
						name: "",
						type: "pie",
						radius: "100%", //图的大小
						// 环形大小
						radius: ["45%", "65%"],
						center: ["34%", "50%"], //图的位置，距离左跟上的位置
						itemStyle: {
							normal: {
								//隐藏标示文字
								label: {
									show: false,
									formatter: "{b}: {c}({d}%)"
								},
								//隐藏标示线
								labelLine: {
									show: false,
								}
							}
						},

						data: this.data3,
						// data: [{
						// 		value: 335,
						// 		name: '记账凭证'
						// 	},
						// 	{
						// 		value: 310,
						// 		name: '总账'
						// 	},
						// 	{
						// 		value: 234,
						// 		name: '明细账'
						// 	},
						// 	{
						// 		value: 135,
						// 		name: '资产负债'
						// 	},
						// 	{
						// 		value: 548,
						// 		name: '现金流量'
						// 	},
						// 	{
						// 		value: 548,
						// 		name: '利润'
						// 	}
						// ]
						//  data: []
					}],
				}

				// 先清空
				myChart.clear();
				// 绘制图表
				myChart.setOption(echarts1_option);
				window.addEventListener("resize", () => { myChart.resize();});
				// window.addEventListener("resize", this.resizeHandle(myChart))

			},

			drawLine4() {
				// 引入 ECharts 主模块
				var echarts = require('echarts/lib/echarts');
				// 引入柱状图
				require('echarts/lib/chart/pie');
				// 引入提示框和标题组件
				require('echarts/lib/component/tooltip');
				require('echarts/lib/component/title');
				require('echarts/lib/component/legend');
				// 基于准备好的dom，初始化echarts实例
				var myChartDiv = document.getElementsByClassName("charts");
				// myChartDiv.style.width = document.getElementsByClassName('right_contain')[0].offsetWidth + 'px';

				var myChart = echarts.init(myChartDiv[1]);

				let echarts1_option = {
					tooltip: {
						trigger: "item",
						formatter: "{b}: {c} ({d}%)"
					},
					legend: {
						orient: "vertical",
						// left: this.nameData.length<=3?'40%':'', //图例距离左的距离
						right: '40px', //图例距离右的距离
						top: "30px",
						padding: [0, 0, 30, 30],
						y: 'center', //图例上下居中
						// x: "center", //图例水平居中
						// 图标大小,宽和高
						itemWidth: 10,
						itemHeight: 10,
						itemGap: 20,
						textStyle: {
							fontSize: 12,
							color: "#666"
						},
						icon: "circle",
						data: this.temname
						// data: ['0-5年', '5-10年', '10-20年', '20-30年', '永久']

					},
					color: ['#FF9E00', '#B47CFF', '#409EFF', '#85D48B'],
					series: [{
						name: "",
						type: "pie",
						radius: "100%", //图的大小
						// 环形大小
						radius: ["45%", "65%"],
						center: ["34%", "50%"], //图的位置，距离左跟上的位置
						itemStyle: {
							normal: {
								//隐藏标示文字
								label: {
									show: false,
									formatter: "{b}: {c}({d}%)"
								},
								//隐藏标示线
								labelLine: {
									show: false
								}
							}
						},
						data: this.data4,
						// data: [{
						// 		value: 335,
						// 		name: '0-5年'
						// 	},
						// 	{
						// 		value: 310,
						// 		name: '5-10年'
						// 	},
						// 	{
						// 		value: 234,
						// 		name: '10-20年'
						// 	},
						// 	{
						// 		value: 135,
						// 		name: '20-30年'
						// 	},
						// 	{
						// 		value: 1548,
						// 		name: '永久'
						// 	}
						// ]
					}],
				}

				// 先清空
				myChart.clear();
				// 绘制图表
				myChart.setOption(echarts1_option);
				window.addEventListener("resize", () => { myChart.resize();});
				// window.addEventListener("resize", this.resizeHandle(myChart))

			},




		},
		computed: {},
		created() {
			//统计各月归档文件数量
			// this.getStatisArchivesCount();

			//归档文件分类统计
			this.getStatisDifferntArchivesCategory();
			//存档文件保存期统计
			this.getStatisArchivesStorageDate();

			//档案借阅统计
			this.statisticsByYear();

			//统计本月入库，出库情况
			this.statisticsInboundAndOutbound()

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
			}

			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}

			.card_contain {
				/* display: flex;
				flex-direction: row;
				justify-content: space-between;
				flex-wrap: wrap */
				background-color: #fff;
				padding: 0.2rem;
			}

			.cardshort {
				width: 2.65rem;
				height: 1.65rem;
				float: left;
				background-color: #fff;
				margin-bottom: 0.3rem;
				border: 1px solid #979797;
				box-sizing: border-box;

				h4,
				span {
					display: inline-block;
					font-size: 20px;
					height: 40px;
					line-height: 40px;
					color: #8C8C8C;
					width: 1.5rem;
					text-align: center;
				}

				span {
					margin-top: 40px;
				}

			}

			.cardshort1 {
				background: url(../../../../assets/img/out.png) no-repeat 1.7rem;
			}

			.cardshort2 {
				background: url(../../../../assets/img/in.png) no-repeat 1.7rem;
			}

			.cardlong {
				position: relative;
				width: 100%;
				height: 3.6rem;
				float: left;
				background-color: #fff;
				border: 1px solid #979797;
				box-sizing: border-box;

				h4 {
					height: 40px;
					line-height: 40px;
					color: #8C8C8C;
					text-indent: 12px;
				}

				.charts {
					height: calc(100% - 40px);
				}
			}

			.card {
				width: calc((100% - 2.65rem - 0.4rem) / 2);
				height: 3.6rem;
				float: left;
				margin-right: 0.2rem;
				background-color: #fff;
				margin-bottom: 12px;
				border: 1px solid #979797;
				box-sizing: border-box;

				h4 {
					height: 40px;
					line-height: 40px;
					color: #8C8C8C;
					text-indent: 12px;
					font-size: 0.14rem;
					font-weight: normal;
				}

				.charts {
					height: calc(100% - 40px);
				}

				label {
					color: #999;
				}

				ul {
					padding: 10px 0px;
				}

				li {
					height: 30px;
					/* line-height:30px; */
					padding-left: 20px;

					span:nth-of-type(2n) {
						height: 24px;
						line-height: 30px;
						display: inline-block;
						width: 120px;
						float: left;
						border-bottom: 1px solid rgb(167, 167, 167);
						text-indent: 12px;
						color: #333
					}

					span:nth-of-type(2n+1) {
						height: 30px;
						line-height: 30px;
						color: rgb(167, 167, 167);
						display: inline-block;
						width: 80px;
						float: left;
						text-align: justify;
						margin-right: 12px;
					}

					span:nth-of-type(2n+1):after {
						content: "";
						display: inline-block;
						width: 100%;
					}
				}
			}
		}
	}
</style>
