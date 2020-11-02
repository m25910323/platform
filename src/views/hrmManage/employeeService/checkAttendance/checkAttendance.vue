<template>
	<div class="main_contain">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>行政管理</el-breadcrumb-item>
			<el-breadcrumb-item>员工服务</el-breadcrumb-item>

			<el-breadcrumb-item>考勤确认</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body">
			
			<div class='myChart' style='width: 100%;height:500px;margin-bottom:20px;background: #fff;'></div>
			
			
			<h3>考勤确认
				<el-button type="primary" size='mini'  @click='makeSure' style='float: right;margin-top:6px;margin-right: 12px;'>本月考勤确认</el-button>
			</h3>


			<el-table :data="detail" style="width: 100%;" v-loading='loading'>
				<!-- <el-table-column type="selection" width="50"></el-table-column> -->
				
				<el-table-column align="center" label="考勤月份" prop="datetime" :resizable="false"></el-table-column>
				<el-table-column align="center" label="工号" prop="usercode" :resizable="false"></el-table-column>
				<el-table-column align="center" label="姓名" prop="username" :resizable="false"></el-table-column>
				<el-table-column align="center" label="隶属部门" prop="department" :resizable="false"></el-table-column>
				<el-table-column align="center" label="迟到早退次数" prop="monthLateAndLeave" :resizable="false"></el-table-column>
				<el-table-column align="center" label="调休/产假次数" prop="monthTxAndCj" :resizable="false"></el-table-column>
				
				<el-table-column align="center" label="婚假" prop="monthHj" :resizable="false"></el-table-column>
				<el-table-column align="center" label="年假" prop="monthNj" :resizable="false"></el-table-column>
				<el-table-column align="center" label="丧假" prop="monthSj" :resizable="false"></el-table-column>
				<el-table-column align="center" label="事假" prop="monthShi" :resizable="false"></el-table-column>
				<el-table-column align="center" label="病假" prop="monthBj" :resizable="false"></el-table-column>
				<el-table-column align="center" label="旷工" prop="monthKg" :resizable="false"></el-table-column>
				<!-- <el-table-column align="center" label="操作" :resizable="false">
					<template slot-scope="scope">
						<el-button type='text' size="mini" @click='jumpTo'>查看异常考勤</el-button>
					</template>
				</el-table-column> -->

			</el-table>

		</div>
		<el-dialog title="离职申请" :visible.sync="dialogVisible" width="300px">
			<el-form ref="form1" :model="form1" label-width="80px" size="mini">

				<el-form-item label="离职时间">
					<el-date-picker v-model="form1.quitTime" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" placeholder="请选择"></el-date-picker>
				</el-form-item>
				<el-form-item label="离职原因">
					<el-input v-model="form1.quitReson"></el-input>
				</el-form-item>
				

			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideAddDialog" size="mini">取 消</el-button>
				<el-button type="primary" @click="addInduction" size="mini">确 定</el-button>
			</span>
			<!-- <div class='btn_contain clearfix'>
				<span class='commit' @click='addInduction'>完成</span>
				<span class='close' @click="hideAddDialog">关闭</span>
			</div> -->
		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				loading: false,
				formInline: {
					userName: '',
					userNickName: '',
					roleId: ''
				},
				form1: {},
				detail: [],

				dialogVisible: false,

				userId: '',
				monthList:[
					"一月份",
					"二月份",
					"三月份",
					"四月份",
					"五月份",
					"六月份",
					"七月份",
					"八月份",
					"九月份",
					"十月份",
					"十一月份",
					"十二月份",
				]
			}
		},
		components: {},
		methods: {
			jumpTo(){
				this.$router.push({
					path: '/hrmManage/unusual',
				});
			},
			selectAUserChart(){
				let params = {
					
				};
				this.axios.post('/perTaxToolTwo/customCommonController/selectAUserChart', params).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hrEmpQuitOpt/findHrEmpQuitOptPage',params).then(res => {
					if (res.data.code == 200) {
						this.drawLine(res.data.data);
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				
				}).catch(function(err) {
					this.$message({
						message: '获取申请离职列表失败',
						type: 'error'
					});
				})
			},
			makeSure(){
				let params = {
					userType:2
				};
				this.axios.post('/perTaxToolTwo/attendanceConfluenceController/makesureAll', params).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hrEmpQuitOpt/findHrEmpQuitOptPage',params).then(res => {
					if (res.data.code == 200) {
						this.queryList();
						this.$message({
							message: res.data.msg,
							type: 'success'
						});
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				
				}).catch(function(err) {
					this.$message({
						message: '考勤确认失败',
						type: 'error'
					});
				})
			},
			drawLine(lineData) {
				lineData.forEach(item =>{
					item.type = 'line';
					item.smooth = true
				})
				// 引入 ECharts 主模块
				let echarts = require('echarts/lib/echarts');
				// 引入柱状图
				require('echarts/lib/chart/line');
				// 引入提示框和标题组件
				require('echarts/lib/component/tooltip');
				require('echarts/lib/component/title');
				require('echarts/lib/component/legend');
				// 基于准备好的dom，初始化echarts实例
				var myChartDiv = document.getElementsByClassName("myChart")[0];
				// myChartDiv.style.width = document.getElementsByClassName('right_contain')[0].offsetWidth + 'px';
			
				var myChart = echarts.init(myChartDiv);
				let echarts1_option = {
					title:{
						text:'本年假勤申请、考勤异常统计',
						left:'center',
						top:"30px"
					},
					
					tooltip: {
						trigger: 'axis'
					},
					color: ['#5793f3', '#d14a61', '#675bba','#FFA07A'],
					grid: {
						top: 80,
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
						name: '天',
						axisLine: {
							lineStyle: {
								color: '#999',
							}
						},
						axisTick: {
							show: false
						}
					},
					// color: this.color,
					series:lineData,
					// series: [{
					// 	data: this.data1,
					// 	type: 'line',
					// 	itemStyle: {
					// 		normal: {
					// 			color: 'rgb(67,179,219)',
					// 			lineStyle: {
					// 				color: 'rgb(67,179,219)'
					// 			}
					// 		}
					// 	},
					// }]
			
				};
				// 先清空
				myChart.clear();
				// 绘制图表
				myChart.setOption(echarts1_option);
				window.addEventListener("resize", this.resizeHandle(myChart))
			
			},
			queryList() {
				let params = {
					data:{},
					page:1,
					row:1
				};
				this.axios.post('/perTaxToolTwo/attendanceConfluenceController/getUserPageList', params).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hrEmpQuitOpt/findHrEmpQuitOptPage',params).then(res => {
					if (res.data.code == 200) {
						this.detail = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取考勤记录失败',
						type: 'error'
					});
				})
			},
			add() {
				this.dialogVisible = true;
			},

			hideAddDialog() {
				this.dialogVisible = false;
			},
			addInduction() {
				this.form1.modelSign = 'Leave';
				var params = this.form1;

				this.axios.post('/perTaxToolTwo/hrEmpQuitOpt/saveOrUpdateHrEmpQuitOpt', params).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/hrEmpQuitOpt/saveOrUpdateHrEmpQuitOpt', params).then(res => {

					if (res.data.code == 200) {
						this.dialogVisible = false;
						this.queryList();
						this.$message({
							message: res.data.msg,
							type: 'success'
						});
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '新增员工失败',
						type: 'error'
					});
				})
			}
		},
		created() {
			this.selectAUserChart();
			this.queryList();
		}
	}
</script>

<style scoped lang="less">
	.main_contain {
		width: 100%;
		height: 100%;
		// padding: 20px;
		box-sizing: border-box;

		/deep/ .el-breadcrumb {
			height: 40px;
			line-height: 40px;
			background: rgb(234, 244, 255);
			padding-left: 20px;
		}


		.btn_contain {
			text-align: center;
			margin-top: 0.36rem;
		}

		.commit {
			width: 1.5rem;
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
			width: 1.5rem;
			height: 0.4rem;
			line-height: 0.4rem;
			background: #ed878e;
			color: #fff;
			display: inline-block;
			text-align: center;
			border-radius: 4px;
		}
	}

	.contain_header {}

	.contain_body {
		position: relative;
		// padding-top:10px;
		// background: #fff;
		margin: 20px 20px;

		h3 {
			height: 40px;
			background: #fff;
			line-height: 40px;
			padding-left: 20px
		}

	}

	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
	}

	/deep/ .el-table table {
		background-color: rgb(243, 246, 249);
		border-collapse: separate;
		border-spacing: 0px 3px;
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

	.el-dialog .el-form {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap
	}

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

	/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
		border-bottom-color: #fff;
		background: #ebf6fb;
	}
</style>
