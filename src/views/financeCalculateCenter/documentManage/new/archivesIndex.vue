<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案管理</el-breadcrumb-item>
			<el-breadcrumb-item>档案首页</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<label for="">选择年度</label>
			<el-input-number v-model="belongYear" @change="handleChange" :min="1970" size="mini"></el-input-number>
		</div>
		<!-- <div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>

					<el-form-item label="年度" prop="belongYear">
						<el-date-picker v-model="uploadData.belongYear" type="year" placeholder="请选择" clearable value-format='yyyy'>
						</el-date-picker>
					</el-form-item>
					<el-button type="primary" @click='selectExcel()' size="mini">搜索</el-button>

				</el-form>
			</div>
		</div> -->
		<div class='main_contain'>
			<div class='card_contain'>
				<div class='card' v-for="item in titleList">
					<h4>{{item.title}}</h4>
					<div class='charts'>

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
				belongYear:new Date().getFullYear(),
				uploadData: {},
				titleList: [{
						title: "私营企业交易金额增长情况",
						color: '#B47CFF'
					},
					{
						title: "私营企业户数增长情况",
						color: '#85D48B'
					},
					{
						title: "各类消费价格增长情况",
						color: 'rgb(237,135,142)'
					},
					{
						title: "各主要产业交易情况",
						color: 'rgb(67,179,219)'
					},

				],
				monthList: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				
				postData: {
					belongYear: ''
				}
			}
		},
		components: {},
		methods: {	
			handleChange(){
				this.getStatisticsByYear()
			},

		

			getStatisticsByYear() {
				let params = {
					belongYear: this.belongYear.toString()
				};
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/getStatisticsByYear', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.statisticsBusinessTransactionGrowth = res.data.data.statisticsBusinessTransactionGrowth;
							this.statisticsEnterprisesNumber = res.data.data.statisticsEnterprisesNumber;

							this.statisticsConsumption = res.data.data.statisticsConsumption;
							this.statisticsMajorIndustriesTrade = res.data.data.statisticsMajorIndustriesTrade;
							this.drawLine1();
							this.drawLine2();
							this.drawLine3();
							this.drawLine4();
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
				require('echarts/lib/chart/line');
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
						trigger: 'axis'
					},

					color: ['#B47CFF'],
					grid: {
						top: 40,
						left: 30,
						right: 60,
						bottom: 10,
						containLabel: true
					},
					legend: {
						data: ['交易金额']
					},
					xAxis: {
						boundaryGap: false,
						name: '',
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
						name: '',
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
						name:'交易金额',
						data: this.statisticsBusinessTransactionGrowth.data,
						type: 'line',
						smooth: true,
						itemStyle: {
							normal: {
								color: '#B47CFF',
								lineStyle: {
									color: '#B47CFF'
								}
							}
						},
						areaStyle: {
							normal: {
								color: new echarts.graphic.LinearGradient(0, 0, 0, 0.9, [{
									offset: 0,
									color: '#B47CFF'
								}, {
									offset: 1,
									color: '#fff'
								}])
							}
						}
					}]

				};
				// 先清空
				myChart.clear();
				// 绘制图表
				myChart.setOption(echarts1_option);
				window.addEventListener("resize", () => { myChart.resize();});
				// window.addEventListener("resize", this.resizeHandle(myChart))

			},
			drawLine2() {
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

				var myChart = echarts.init(myChartDiv[1]);
				let echarts1_option = {
					tooltip: {
						trigger: 'axis'
					},
					color: ['#666'],
					grid: {
						top: 40,
						left: 30,
						right: 60,
						bottom: 10,
						containLabel: true
					},
					legend: {
						data: ['私营企业']
					},
					xAxis: {
						boundaryGap: true,
						name: '',
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
						name: '',
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
						name:'私营企业',
						data: this.statisticsEnterprisesNumber.data,
						type: 'bar',
						barWidth:10,
						itemStyle: {
							normal: {
								color: '#85D48B',
								lineStyle: {
									color: '#85D48B'
								}
							}
						},
					}]

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
						right: 60,
						bottom: 10,
						containLabel: true
					},
					legend: {
						data: ['交易金额','交易频率']
					},
					xAxis: {
						boundaryGap: true,
						name: '',
						type: 'category',
						data: this.statisticsConsumption.xAxis,
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
						name: '',
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
						name:'交易金额',
						data: this.statisticsConsumption.data[0].data,
						type: 'bar',
						barWidth:10,
						itemStyle: {
							normal: {
								color: '#409EFF',
								
							}
						},
					},
					{
						name:'交易频率',
						data: this.statisticsConsumption.data[1].data,
						type: 'bar',
						barWidth:10,
						itemStyle: {
							normal: {
								color: '#85D48B'
							}
						},
					}]
			
				};
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

				var myChart = echarts.init(myChartDiv[3]);

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
						// data: []
						data: this.statisticsMajorIndustriesTrade.industry
					},
					color: ['#43B3DB', '#FFAC69', '#7DC36D', '#ED878E'],
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
						data: this.statisticsMajorIndustriesTrade.data
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

			


		},
		computed: {},
		created() {

			this.getStatisticsByYear()

		}
	}
</script>

<style lang='less' scoped>
	.main {
		/* background: #fff; */
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		position: relative;

		.el-breadcrumb {
			height: 40px;
			line-height: 39px;
			padding-left: 20px;
			/* background-color: #fff; */
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box
		}


		.search_contain {
			position: absolute;
			top: 6px;
			right: 40px;
			width: 300px;
			text-align: right;
			height: 40px;
			

			.info {
				height: 40px;
				line-height: 40px;
			}

			a {
				margin-left: 10px;
			}
			label{
				margin-right: 12px;
				color: #8C8C8C;
			}
		}

		.main_contain {
			background: #fff;
			margin: 0 20px;
			padding: 30px 25px;
			/* height: calc(100% - 190px); */

			h5 {
				height: 40px;
				line-height: 40px;
			}

			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}

			.card_contain {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				flex-wrap: wrap;
				background: #fff
			}

			.card {
				width: calc(50% - 8px);
				height: 300px;
				/* float: left; */
				background-color: #fff;
				margin-bottom: 24px;
				border: 1px solid #979797;

				h4 {
					height: 36px;
					line-height: 36px;
					color: #8C8C8C;
					text-indent: 10px;
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
