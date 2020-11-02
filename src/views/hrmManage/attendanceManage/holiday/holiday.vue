<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>行政管理</el-breadcrumb-item>
			<el-breadcrumb-item>假勤管理</el-breadcrumb-item>

			<el-breadcrumb-item>假期管理</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini" ref='formName'>
				<el-form-item label="员工姓名">
					<el-input v-model="formInline.ausername" placeholder="请输入" clearable>
					</el-input>
				</el-form-item>

				<el-form-item label="部门">
					<el-select v-model="formInline.adepartId" placeholder="请选择部门名称" clearable filterable>
						<el-option v-for="item in departList" :label="item.orgName" :value='item.orgId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="月份">
					<el-date-picker v-model="formInline.months" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM"
					 :clearable="false">
					</el-date-picker>
				</el-form-item>
				<el-button size="mini" type="primary" @click='search'>查询</el-button>

			</el-form>
		</div>

		<div class="contain_body">
			<h3>假期管理</h3>
			<!-- <el-radio-group v-model="holidayDate" size="mini" style='top:40px;right: 20px;position: absolute;z-index: 10;'>
				<el-radio-button label="month">本月内</el-radio-button>
				<el-radio-button label="year">本年内</el-radio-button>
			</el-radio-group> -->
			<el-checkbox v-model="isYear" style='top:40px;right: 20px;position: absolute;z-index: 10;'>本年内</el-checkbox>


			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane name="first">
					<span slot="label">

						<span>请假
							<el-badge :value="total1" :max="99" class="item" />
						</span>

					</span>
					<div>
						<div class='myChart' style='width: 700px;height:800px;float: left;background: #fff;'></div>
						<div style='width: calc(100% - 720px);float: right;'>
							<el-table :data="tableList1" style="width: 100%;" v-loading='loading'>
								<!-- <el-table-column type="selection" width="50"></el-table-column> -->

								<el-table-column align="center" label="部门" prop="adepartment" :resizable="false"></el-table-column>
								<el-table-column align="center" label="类型" prop="holidayTypeName" :resizable="false"></el-table-column>
								<el-table-column align="center" label="请假日期" prop="holidayMonths" :resizable="false"></el-table-column>
								<el-table-column align="center" label="人数" :resizable="false">
									<template slot-scope="scope">
										<el-button size="mini" type="text" @click="handlePerson(scope.$index, scope.row)">{{scope.row.count}}</el-button>
									</template>
								</el-table-column>

							</el-table>
							<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange1(val)})"
							 :current-page="currentPage1" :page-size="pageSize" layout="total, prev, pager, next" :total="total1">
							</el-pagination>
						</div>

					</div>


				</el-tab-pane>
				<el-tab-pane name="second">
					<span slot="label">

						<span>加班
							<el-badge :value="total2" :max="99" class="item" />
						</span>

					</span>
					<div>
						<div class='myChart' style='width: 700px;height:800px;float: left;background: #fff;'></div>
						<div style='width: calc(100% - 720px);float: right;'>
							<el-table :data="tableList2" style="width: 100%" v-loading='loading'>
								<!-- <el-table-column type="selection" width="50"></el-table-column> -->

								<el-table-column align="center" label="申请人工号" prop="ausercode" :resizable="false"></el-table-column>
								<el-table-column align="center" label="申请人姓名" prop="ausername" :resizable="false"></el-table-column>
								<el-table-column align="center" label="所属部门" prop="adepartment" :resizable="false"></el-table-column>
								<el-table-column align="center" label="隶属上司" prop="username" :resizable="false"></el-table-column>
								<el-table-column align="center" label="累计加班天数" :resizable="false">
									<template slot-scope="scope">
										<el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">{{scope.row.adddays}}</el-button>
									</template>
								</el-table-column>
								<el-table-column align="center" label="已销假天数" :resizable="false">
									<template slot-scope="scope">
										<el-button size="mini" type="text" @click="handleReduce(scope.$index, scope.row)">{{scope.row.reducedays}}</el-button>
									</template>
								</el-table-column>
								<el-table-column align="center" label="剩余天数" prop="surplusdays" :resizable="false"></el-table-column>
							</el-table>
							<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange2(val)})"
							 :current-page="currentPage2" :page-size="pageSize" layout="total, prev, pager, next" :total="total2">
							</el-pagination>
						</div>
					</div>
				</el-tab-pane>
				<el-tab-pane name="third">
					<span slot="label">

						<span>调休
							<el-badge :value="total3" :max="99" class="item" />
						</span>

					</span>
					<div>
						<div class='myChart' style='width: 700px;height:800px;float: left;background: #fff;'></div>
						<div style='width: calc(100% - 720px);float: right;'>
							<el-table :data="tableList3" style="width: 100%" v-loading='loading'>
								<!-- <el-table-column type="selection" width="50"></el-table-column> -->

								<el-table-column align="center" label="申请人工号" prop="ausercode" :resizable="false"></el-table-column>
								<el-table-column align="center" label="申请人姓名" prop="ausername" :resizable="false"></el-table-column>
								<el-table-column align="center" label="所属部门" prop="adepartment" :resizable="false"></el-table-column>
								<el-table-column align="center" label="隶属上司" prop="username" :resizable="false"></el-table-column>
								<el-table-column align="center" label="调休天数" :resizable="false">
									<template slot-scope="scope">
										<el-button size="mini" type="text" @click="handleTiaoxiu(scope.$index, scope.row)">{{scope.row.totalDays}}</el-button>
									</template>
								</el-table-column>
								<el-table-column align="center" label="剩余天数" prop="surplusdays" :resizable="false">

								</el-table-column>
							</el-table>
							<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange3(val)})"
							 :current-page="currentPage3" :page-size="pageSize" layout="total, prev, pager, next" :total="total3">
							</el-pagination>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>



		</div>

		<el-dialog title="加班单详情列表" :visible.sync="dialogVisible">
			<el-table :data="detail">
				<el-table-column prop="workOvertimeReasons" label="加班原因" width="150"></el-table-column>
				<el-table-column prop="workOvertimeStart" label="开始时间" width="140"></el-table-column>
				<el-table-column prop="workOvertimeEnd" label="结束时间" width="140"></el-table-column>
				<el-table-column prop="ausercode" label="申请人工号"></el-table-column>
				<el-table-column prop="ausername" label="申请人姓名"></el-table-column>
				<el-table-column prop="adepartment" label="所属部门"></el-table-column>
				<el-table-column prop="createTime" label="创建时间" width="140"></el-table-column>
				<el-table-column label="是否抵用">
					<template slot-scope="scope">
						<span>{{scope.row.paidLeaveId?"是":"否"}}</span>

					</template>
				</el-table-column>
			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange4(val)})"
			 :current-page="currentPage4" :page-size="pageSize" layout="total, prev, pager, next" :total="total4">
			</el-pagination>
		</el-dialog>
		<el-dialog title="请假人员详情列表" :visible.sync="innerVisible">
			<el-table :data="personDetail">
				<el-table-column prop="ausercode" label="申请人工号"></el-table-column>
				<el-table-column prop="ausername" label="申请人姓名"></el-table-column>
				<el-table-column prop="adepartment" label="所属部门"></el-table-column>
				<el-table-column prop="username" label="所属领导"></el-table-column>
				<el-table-column prop="holidayTypeName" label="请假类型"></el-table-column>
				<el-table-column prop="holidayMonths" label="请假时间" width="140"></el-table-column>
				<el-table-column prop="hours" label="请假时长"></el-table-column>
			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange5(val)})"
			 :current-page="currentPage5" :page-size="pageSize" layout="total, prev, pager, next" :total="total5">
			</el-pagination>
		</el-dialog>

		<el-dialog title="调休详情" :visible.sync="innerVisible1">
			<el-table :data="tiaoxiuDetail">
				<el-table-column prop="paidLeaveReasons" label="调休原因"></el-table-column>
				<el-table-column prop="paidLeaveStartTime" label="开始时间"></el-table-column>
				<el-table-column prop="paidLeaveEndTime" label="结束时间"></el-table-column>
				<el-table-column prop="ausercode" label="申请人工号"></el-table-column>
				<el-table-column prop="ausername" label="申请人姓名"></el-table-column>
				<el-table-column prop="adepartment" label="所属部门" width="140"></el-table-column>
				<el-table-column prop="createTime" label="创建时间"></el-table-column>
			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange6(val)})"
			 :current-page="currentPage6" :page-size="pageSize" layout="total, prev, pager, next" :total="total6">
			</el-pagination>
		</el-dialog>
	</div>

</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				adepartId: '-1',
				departList: [],
				isYear: false,
				range: '1',
				activeName: 'first',
				index: 1,
				holidayList: [],
				personDetail: [],
				tiaoxiuDetail: [],
				detail: {},
				loading: false,
				formInline: {
					bankname: '',
					customername: '',
					months: this.formatTimeToStr(new Date(), "yyyy-MM")
				},
				months: this.formatTimeToStr(new Date(), "yyyy-MM"),
				bankname: '',
				customername: '',
				form: {
					holidayTypeName: '',
					holidayDate: this.formatTimeToStr(new Date(), "yyyy-MM")
				},
				holidayDate: 'month',
				currentPage1: 1,
				currentPage2: 1,
				currentPage3: 1,
				currentPage4: 1,
				currentPage5: 1,
				currentPage6: 1,

				jbTag: 'adddays',
				pageSize: 10,
				total1: 0,
				total2: 0,
				total3: 0,
				total4: 0,
				total5: 0,
				total6: 0,
				tableList1: [],
				tableList2: [],
				tableList3: [],
				dialogVisible: false,
				innerVisible: false,
				innerVisible1: false,


				jbausercode: '',
				txadepartId: '',
				txausercode: '',




			}
		},
		components: {},
		methods: {
			search() {
				this.ausername = this.formInline.ausername;
				this.months = this.formInline.months;
				this.adepartId = this.formInline.adepartId;
				this.queryListByPage1();
				this.queryListByPage2();
				this.queryListByPage3();
				this.queryChart('holiday');
				this.queryChart('worktime');
				this.queryChart('paidleave');
			},
			queryChart(type) {
				let param = {
					date: this.isYear ? 'year' : 'month',
					type: type

				};
				this.axios.post('/perTaxToolTwo/customCommonController/countYearAndMonthByApply', param).then(
					res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.drawLine(res.data.data, type);
						} else {

							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
					this.$message({
						message: '获取图表数据失败',
						type: 'error'
					});
				})
			},

			drawLine(data, type) {
				var arr = [];

				data.forEach(item => {
					arr.push({

						name: item.org_name,
						type: 'bar',
						stack: '总量',
						barMaxWidth: 10,
						label: {
							normal: {
								show: false,
								position: 'insideRight'
							}
						},
						data: item.data

					})

				});
				var index = 0;
				var htype = '';
				if (type == 'holiday') {
					index = 0;
					htype = '请假';
				} else if (type == 'worktime') {
					index = 1;
					htype = '加班';
				} else {
					index = 2;
					htype = '调休';
				}
				// 引入 ECharts 主模块
				var echarts = require('echarts/lib/echarts');
				// 引入柱状图
				require('echarts/lib/chart/bar');
				// 引入提示框和标题组件
				require('echarts/lib/component/tooltip');
				require('echarts/lib/component/legend');
				require('echarts/lib/component/title');

				// 基于准备好的dom，初始化echarts实例
				this.myChart = echarts.init(document.getElementsByClassName("myChart")[index]);
				this.echarts1_option = {
					// color: ["#ed878e", "#ffb980", "#43b3db"],
					title: {
						text: '本' + (this.isYear ? '年' : '月') + '员工' + htype + '天数',
						left: "center",
						top: "20px"
					},
					// tooltip: {
					// 	trigger: 'axis',
					// 	axisPointer: { // 坐标轴指示器，坐标轴触发有效
					// 		type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					// 	}
					// },
					legend: {
						// type: 'scroll',
						orient: 'horizontal',
						data: data[0].department,
						top: 'bottom',
						left: 'center'
					},
					grid: {
						top: "80",
						right: "20",
						bottom: "120",
						left: "20",
						containLabel: true
					},
					xAxis: {
						// name: "时间",
						type: "category",
						// boundaryGap: [0, 0.01],
						data: data[0].day,
						axisLabel: {
							rotate: 60
						},
						axisLine: {
							lineStyle: {
								color: "#b3b3b3"
							}
						},
						splitLine: {
							lineStyle: {
								color: "#eaeaea"
							}
						}
					},
					yAxis: {
						name: "天数",
						type: "value",

						axisLine: {
							lineStyle: {
								color: "#b3b3b3"
							}
						}
					},
					series: arr
				};
				// 绘制图表
				this.myChart.setOption(this.echarts1_option);
				console.log(this.echarts1_option)
				// window.addEventListener("resize", this.resizeHandle)
			},

			queryListByPage1() {
				this.loading = true;
				let param = {
					row: this.pageSize,
					page: this.currentPage1,
					data: {
						"adepartId": "-1",
						"holidayTypeName": this.form.holidayTypeName,
						"holidayMonths": this.isYear ? this.formatTimeToStr(
							new Date(), "yyyy") : this.months,
					}

				};
				this.axios.post('/perTaxToolTwo/attendanceapplyholidayController/getTJPageList', param).then(
					res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.total1 = res.data.count;
							this.tableList1 = res.data.data;
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},

			queryListByPage2() {
				this.loading = true;
				let param = {
					row: this.pageSize,
					page: this.currentPage2,
					data: {
						"keywords": "",
						"adepartId": this.adepartId,
						"ausername": this.ausername,
						"holidayMonths": this.isYear ? this.formatTimeToStr(
							new Date(), "yyyy") : this.months,
					}


				};
				this.axios.post('/perTaxToolTwo/attendanceapplyworkovertimeController/getTJPageList', param).then(
					res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.total2 = res.data.count;
							this.tableList2 = res.data.data;
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},

			queryListByPage3() {
				this.loading = true;
				let param = {
					row: this.pageSize,
					page: this.currentPage3,
					data: {
						"adepartId": this.adepartId,
						"ausername": this.ausername,
						"holidayMonths": this.isYear ? this.formatTimeToStr(
							new Date(), "yyyy") : this.months,
					}


				};
				this.axios.post('/perTaxToolTwo/attendanceapplypaidleaveController/getTJPageListNew', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.total3 = res.data.count;
						this.tableList3 = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},

			getJbDetail() {
				let param = {
					row: this.pageSize,
					page: this.currentPage4,
					data: {
						"ausercode": this.jbausercode,
						"days": "adddays"
					}

				};
				this.axios.post('/perTaxToolTwo/attendanceapplyworkovertimeController/queryDaysPageList', param)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.total4 = res.data.count;
							this.detail = res.data.data;
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
			getJbRDetail() {
				let param = {
					row: this.pageSize,
					page: this.currentPage4,
					data: {
						"ausercode": this.jbausercode,
						"days": "reducedays"
					}

				};
				this.axios.post('/perTaxToolTwo/attendanceapplyworkovertimeController/queryDaysPageList', param)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.total4 = res.data.count;
							this.detail = res.data.data;
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
			handleDetail(index, row) {
				this.jbTag = "adddays";
				this.dialogVisible = true;
				this.jbausercode = row.ausercode;
				this.getJbDetail()
			},
			handleReduce(index, row) {
				this.jbTag = "reducedays";
				this.dialogVisible = true;
				this.jbausercode = row.ausercode;
				this.getJbRDetail()

			},
			getQjDetail() {
				let param = {
					row: this.pageSize,
					page: this.currentPage5,
					data: {
						"adepartId": this.qjadepartId,
						"holidayTypeId": this.qjholidayTypeId,
						"holidayMonths": this.qjholidayMonths
					}

				};
				this.axios.post('/perTaxToolTwo/attendanceapplyholidayController/queryTJPageList', param)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.total5 = res.data.count;
							this.personDetail = res.data.data;
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
			handlePerson(index, row) {
				this.innerVisible = true;
				this.currentPage5 = 1;
				this.qjadepartId = row.adepartId;
				this.qjholidayTypeId = row.holidayTypeId;
				this.qjholidayMonths = row.holidayMonths;
				this.getQjDetail();

			},
			getTxDetail() {
				let param = {
					row: this.pageSize,
					page: this.currentPage6,
					data: {
						"holidayDate": this.isYear ? this.formatTimeToStr(
							new Date(), "yyyy") : this.months,
						"ausercode": this.txausercode,
						"docStatus": 3,
					}

				};
				this.axios.post('/perTaxToolTwo/attendanceapplypaidleaveController/queryDaysPageListPaidLeave', param)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.total6 = res.data.count;
							this.tiaoxiuDetail = res.data.data;
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
			handleTiaoxiu(index, row) {
				this.innerVisible1 = true;
				this.currentPage6 = 1;
				this.txadepartId = row.adepartId;
				this.txausercode = row.ausercode;
				this.getTxDetail()

			},
			hideDialog() {},
			handleClose() {},
			handleClick(tab, event) {},
			handleCurrentChange1(val) {
				this.currentPage1 = val;
				this.queryListByPage1();
			},
			handleCurrentChange2(val) {
				this.currentPage2 = val;
				this.queryListByPage2();
			},
			handleCurrentChange3(val) {
				this.currentPage3 = val;
				this.queryListByPage3();
			},
			handleCurrentChange4(val) {
				this.currentPage4 = val;
				switch (this.jbTag) {
					case 'adddays':
						this.getJbDetail()
						break;
					case 'reducedays':
						this.getJbRDetail()
						break;
				}
			},
			handleCurrentChange5(val) {
				this.currentPage5 = val;
				this.getQjDetail()
			},
			handleCurrentChange6(val) {
				this.currentPage6 = val;
				this.getTxDetail()
			},
			getDepartment() {
				let param = {
				};
				this.axios.post('/perTaxToolTwo/attendance/customLoginController/getDepartment').then(res => {
					if (res.data.code == 200) {
						this.departList = res.data.data;
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

		},
		watch: {
			isYear(newValue, oldValue) {
				this.queryListByPage1();
				this.queryChart('holiday');
				this.queryListByPage2();
				this.queryChart('worktime');
				this.queryListByPage3();
				this.queryChart('paidleave');
			}
		},
		created() {
			this.getDepartment();
			//请假
			this.queryListByPage1();
			this.queryChart('holiday');

			//加班
			this.queryListByPage2();
			this.queryChart('worktime');
			//调休
			this.queryListByPage3();
			this.queryChart('paidleave');
			//请假类型
			// this.queryHolidayType();
		}
	}
</script>

<style scoped lang="less">
	p.warning {
		color: #E6A23C;
	}

	p.success {
		color: #67C23A;
	}

	p.normal {
		color: #409EFF;
	}

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
			width: 2.4rem;
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
			width: 2.4rem;
			height: 0.4rem;
			line-height: 0.4rem;
			background: #ed878e;
			color: #fff;
			display: inline-block;
			text-align: center;
			border-radius: 4px;
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


		.contain_body {
			position: relative;
			// padding:0px 20px;
			background: #fff;
			margin: 20px 20px;

			h3 {
				height: 40px;
				line-height: 40px;
				padding-left: 20px
			}
		}

		/deep/ .el-tabs__header {
			padding: 0px 20px 0px 40px;
			margin: 0px;
		}

		/deep/ .el-tabs__content {
			padding-top: 10px;
			background: rgb(243, 246, 249);
		}

		/deep/ .el-tabs__nav-wrap::after {
			content: "";
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 0px;
			background-color: #E4E7ED;
			z-index: 1;
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
			color: #343434;
		}

		/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
			background-color: #fff;
		}

	}
</style>
