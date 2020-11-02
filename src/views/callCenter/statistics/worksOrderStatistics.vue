<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>客服中心</el-breadcrumb-item>
			<el-breadcrumb-item>统计</el-breadcrumb-item>
			<el-breadcrumb-item>工单统计</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="contain_body">
			<div style="background: #fff;height:45px;padding:15px 12px 0px;">
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="100px">
					<el-form-item label="统计月份" prop="month">
						<el-date-picker v-model="uploadData.month" align="right" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="客服姓名" prop="keyword">
						<el-select v-model="uploadData.keyword" placeholder="请选择" clearable filterable>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in customerServicerList" :label="item.userName" :value='item.userId'></el-option>
						</el-select>
					</el-form-item>
					<!-- <el-form-item label="创建时间" prop="createTime">
						
						<el-date-picker v-model="uploadData.createTime" align="right" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item> -->
					<el-form-item label="" prop="workOrderNum">

						<el-button size="mini" type="primary" @click="search()" style='margin-left: 8px;margin-right: 20px;'>搜索</el-button>
					</el-form-item>
				</el-form>

			</div>

			<div>
				<el-radio-group v-model="radio4" size="medium" style="margin: 20px 0px 20px;">
					<el-radio-button label="1">数据总览</el-radio-button>
					<el-radio-button label="2">折线趋势</el-radio-button>
				</el-radio-group>
				<div v-show='radio4 == "1"' class="clearfix">
					<div v-for="(item,index) in cardList" class="card">
						<p class="first">{{item.label}}</p>
						<p class='second'>{{tableList[item.value]}}</p>
					</div>
				</div>
				<div v-show='radio4 == "2"' class='myChart' style="width: 1200px;height: 500px;" ref='chart'></div>
			</div>





		</div>






	</div>
</template>

<script>
	import EditorBar from '@/components/common/edit'
	export default {
		name: "customer",
		data() {
			return {
				radio4:'1',
				detail: [],
				tag: 'add',
				multipleSelection: [],
				loading: false,
				uploadData: {
					month:this.formatTimeToStr(new Date(),'yyyy-MM')
				},
				form: {

				},
				form1: {},
				currentPage: 1,
				pageSize: 13,
				total: 0,
				tableList: [],
				cardList:[
					{label:'工单创建数量',value:'cou'},
					{label:'已解决',value:'resolved'},
					{label:'未解决',value:'unresolved'},
					{label:'受理中',value:'processing'},
					{label:'已关闭',value:'closed'},
					{label:'平级处理时长',value:'processhour'},
					{label:'解决率',value:'resolutionRate'},
					{label:'平级审核时长',value:'approvehour'},
				],
				legend:['工单创建数量','已解决','未解决','受理中','已关闭','平级处理时长','解决率','平级审核时长'],
				xAxis:[],
				customerServicerList:[],
				month:this.formatTimeToStr(new Date(),'yyyy-MM')
			}
		},
		components: {
			EditorBar
		},
		methods: {
			queryListByPage() {
				this.loading = true;
				let param = {
					month : this.month,
					keyword : this.keyword
				};
				this.axios.post('/perTaxToolTwo/callcenter/workOrder/statistical', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.tableList = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			queryList() {
				this.loading = true;
				let params = {
					month : this.month,
					keyword : this.keyword
				}
				this.axios.post('/perTaxToolTwo/callcenter/workOrder/statisticalChart', params).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hrEmpInfo/findHrEmpInfoPage', params).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						// this.detail = res.data.data;
						this.xAxis = res.data.data.date;
						for(let i= 0;i < 8;i++){
							this.detail.push({
								name:this.legend[i],
								type: 'line',
								data:res.data.data["num" + (i+1)]
							})
						}
						this.drawLine1();
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取数据失败',
						type: 'error'
					});
				})
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
				var myChartDiv = document.getElementsByClassName("myChart");
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
						data: this.legend
					},
					xAxis: {
						boundaryGap: false,
						name: '日期',
						type: 'category',
						data: this.xAxis,
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
					series: this.detail
			
				};
				// 先清空
				myChart.clear();
				// 绘制图表
				myChart.setOption(echarts1_option);
				// window.addEventListener("resize", this.resizeHandle(myChart))
			
			},
			
			
			
			search() {
				this.month = this.uploadData.month;
				this.keyword = this.uploadData.keyword;
				this.queryListByPage();
				this.queryList();
			},
			getCustomerServicer() {
				let param = {};
				this.axios.post('/perTaxToolTwo/callcenter/customerServiceConfig/queryList', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.customerServicerList = res.data.data;
			
			
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
			
				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '归还失败',
						type: 'error'
					});
				})
			},
			
			

			

			
			

		},
		watch: {
			
		},
		created() {
			this.queryListByPage();
			this.queryList();
			this.getCustomerServicer()
		}
	}
</script>

<style scoped lang='less'>
	.main_contain {
		width: 100%;
		height: 100%;
		padding: 0px;
		box-sizing: border-box;

		/deep/ .el-breadcrumb {
			height: 40px;
			line-height: 40px;
			background: rgb(234, 244, 255);
			padding-left: 20px;
		}
		.card{
			width: 250px;
			height: 200px;
			margin:0 20px 20px 0;
			float: left;
			background: #fff;
			p.first{
				text-align: center;
				font-size: 15px;
				height: 100px;
				line-height: 150px;
			}
			p.second{
				text-align: center;
				font-size: 30px;
				/* font-weight: bold; */
			}
		}
		.btn_contain {
			text-align: center;
			margin-top: 0.36rem;
		}

		.commit {
			width: 1.2rem;
			height: 0.4rem;
			line-height: 0.4rem;
			background: #43b3db;
			color: #fff;
			display: inline-block;
			text-align: center;
			margin-right: 0.4rem;
			border-radius: 4px;
		}

		.close {
			width: 1.2rem;
			height: 0.4rem;
			line-height: 0.4rem;
			background: #ed878e;
			color: #fff;
			display: inline-block;
			text-align: center;
			border-radius: 4px;
		}

		.contain_body {
			/* padding: 10px 20px; */
			margin: 20px 20px;
			/* background: #fff; */
		}


	}

	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
	}

	/deep/ .el-table table {
		background: rgb(243, 246, 249);
		border-collapse: separate;
		border-spacing: 0px 5px;
	}

	/deep/ .el-table__header tr,
	.el-table__header th {
		padding: 0;
		height: 40px;
	}

	/deep/ .el-table__body tr,
	.el-table__body td {
		padding: 0;
		height: 40px;
	}

	/deep/ .el-table td {
		padding: 6px 0;
	}

	/deep/ .el-table th,
	/deep/ .el-table tr {
		background-color: transparent;
	}

	/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
		background: #ebf6fb;
	}

	.el-dialog .el-form {}

	/deep/ .el-form-item__content {
		width: 180px;
	}

	/deep/ .el-date-editor.el-input {
		width: 180px;
	}

	/deep/ .el-table__body tr,
	.el-table__body td {
		padding: 0;
		height: 40px;
		background-color: #fff;
	}

	/deep/ .el-table__body tr.el-table__row--striped {
		background-color: #ebf6fb;
	}

	/deep/ .el-table thead {
		color: #666;
	}

	/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #fff;
	}
</style>
