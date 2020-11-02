<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案管理</el-breadcrumb-item>
			<el-breadcrumb-item>档案统计</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini"  ref='formName'>
					<el-form-item label="单位名称">
					
						<el-select v-model="uploadData.customer" placeholder="请选择" clearable filterable value-key='customerId'>
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="年度" prop="belongDate">
						<el-date-picker v-model="uploadData.belongDate" type="year" placeholder="请选择" clearable value-format='yyyy'>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="档案类型" prop="categoryrId">
						<el-select v-model="uploadData.categoryrId" placeholder="请选择" clearable filterable>
							<el-option v-for="item in typeList" :label="item.categoryrName" :value='item.categoryrId'></el-option>
						</el-select>
					</el-form-item>
					

					<el-button type="primary" @click='selectExcel()' size="mini">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<div class='card_contain'>
				<div class='card' v-for="item in titleList">
					<h4 :style="{'background':item.color}">{{item.title}}</h4>
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
				dialogVisible: false,
				uploadData: {
				},
				titleList: [{
						title: "各月归档文件数量",
						color: 'rgb(125,195,109)'
					},
					{
						title: "档案查阅次数",
						color: 'rgb(255,172,105)'
					},
					{
						title: "归档文件分类统计",
						color: 'rgb(237,135,142)'
					},
					{
						title: "存档文件保存期统计",
						color: 'rgb(67,179,219)'
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
				monthList: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
				total: 0,
				currentPage: 1,
				cardList: [],
				pageSize: 10,
				employeeList: [],
				typeList: [],
				postData:{
					categoryrId:'',
					belongDate:''
				}
			}
		},
		components: {},
		methods: {
			
			
			selectExcel(formName) {
				this.uploadData.customerId = this.uploadData.customer.customerId;
				this.postData = JSON.parse(JSON.stringify(this.uploadData));
				//统计各月归档文件数量
				this.getStatisArchivesCount();
				//统计各月档案借阅次数
				this.getStatisArchivesBorrowCount();
				//归档文件分类统计
				this.getStatisDifferntArchivesCategory();
				//存档文件保存期统计
				this.getStatisArchivesStorageDate();
			},



			getStatisArchivesCount() {
				this.data1 = [];
				let params = this.postData;
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/StatisArchivesCount', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.chart1 = res.data.data;
							this.chart1.forEach(item => {
								this.data1.push(item.storageCount)
							})

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
			getStatisArchivesBorrowCount() {
				this.data2 = [];
				let params = this.postData;
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/StatisArchivesBorrowCount', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.chart2 = res.data.data;
							this.chart2.forEach(item => {
								this.data2.push(item.borrowArchivesCount)
							})

							this.drawLine2()
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
				let params = this.postData;
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
				let params = this.postData;
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/StatisDifferntArchivesCategory', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.chart4 = res.data.data;
							this.chart4.forEach(item => {
								this.data4.push({
									name: item.categoryName,
									value: item.categoryCount
								})
							
								this.nameData4.push(item.categoryName)
							})
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
					color: ['#666'],
					grid: {
						top: 50,
						left: 30,
						right: 60,
						bottom: 10,
						containLabel: true
					},
					legend: {
						data: ['数量']
					},
					xAxis: {
						boundaryGap: false,
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
						name: '数量/件',
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
						data: this.data1,
						type: 'line',
						itemStyle: {
							normal: {
								color: 'rgb(67,179,219)',
								lineStyle: {
									color: 'rgb(67,179,219)'
								}
							}
						},
					}]

				};
				// 先清空
				myChart.clear();
				// 绘制图表
				myChart.setOption(echarts1_option);
				// window.addEventListener("resize", this.resizeHandle(myChart))

			},
			drawLine2() {
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

				var myChart = echarts.init(myChartDiv[1]);
				let echarts1_option = {
					tooltip: {
						trigger: 'axis'
					},
					color: ['#666'],
					grid: {
						top: 50,
						left: 30,
						right: 60,
						bottom: 10,
						containLabel: true
					},
					legend: {
						data: ['次数']
					},
					xAxis: {
						boundaryGap: false,
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
						name: '单位/次',
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
						data: this.data2,
						type: 'line',
						itemStyle: {
							normal: {
								color: 'rgb(67,179,219)',
								lineStyle: {
									color: 'rgb(67,179,219)'
								}
							}
						},
					}]

				};
				// 先清空
				myChart.clear();
				// 绘制图表
				myChart.setOption(echarts1_option);
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

				var myChart = echarts.init(myChartDiv[2]);
				
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
						data: this.nameData3
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
									show: true,
									formatter:"{b}: {c}({d}%)"
								},
								//隐藏标示线
								labelLine: {
									show: true
								}
							}
						},
						
						data: this.data3
						//  data: []
					}],
				}

				// 先清空
				myChart.clear();
				// 绘制图表
				myChart.setOption(echarts1_option);
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
						data: this.nameData4
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
									show: true,
									formatter:"{b}: {c}({d}%)"
								},
								//隐藏标示线
								labelLine: {
									show: true
								}
							}
						},
						data: this.data4
						//  data: []
					}],
				}
			
				// 先清空
				myChart.clear();
				// 绘制图表
				myChart.setOption(echarts1_option);
				// window.addEventListener("resize", this.resizeHandle(myChart))
			
			},

			getArchivesCategoryInfoList() {
				let params = {
					"categoryrId": null
				}
				this.axios.post('/perTaxToolTwo/ArchivesCategoryInfo/getArchivesCategoryInfoList', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.typeList = res.data.data;
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
			//统计各月归档文件数量
			this.getStatisArchivesCount();
			//统计各月档案借阅次数
			this.getStatisArchivesBorrowCount();
			//归档文件分类统计
			this.getStatisDifferntArchivesCategory();
			//存档文件保存期统计
			this.getStatisArchivesStorageDate();
			
			this.getArchivesCategoryInfoList()

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
			}

			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}

			.card_contain {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				flex-wrap: wrap
			}

			.card {
				width: calc(50% - 6px);
				height: 300px;
				/* float: left; */
				background-color: #fff;
				margin-bottom: 12px;

				h4 {
					height: 40px;
					line-height: 40px;
					background-color: rgb(125, 195, 109);
					color: #fff;
					text-indent: 12px;
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
