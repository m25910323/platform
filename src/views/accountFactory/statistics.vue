<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>完成情况统计</div>
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini" :rules="rules" ref='form'>
					<el-form-item label="员工姓名:">
						<el-select v-model='formInline.customId' filterable>
							<el-option label="全部" value="" v-if='$store.state.user.isJzcollectAdmin == 1'>全部</el-option>
							<el-option v-for='item in userList' :label="item.userNickName" :value="item.userName" v-if='$store.state.user.isJzcollectAdmin == 1 || ($store.state.user.isJzcollectAdmin != 1 && item.userName == $store.state.user.phone)'></el-option>
							<!-- <el-option :label="item.userNickName" :value="item.userName" v-if='$store.state.user.isJzcollectAdmin != 1'></el-option> -->
							
							
						</el-select>
						<!-- <el-autocomplete class="inline-input" v-model="formInline.customerName" :fetch-suggestions="querySearch"
								 placeholder="请输入客户名称" @select="handleSelect"></el-autocomplete> -->
					</el-form-item>
					<el-form-item label="账期:" prop="period">
						<el-date-picker v-model="formInline.period" type="month" placeholder="选择月" clearable value-format='yyyy-MM'>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="会计步骤:">
						<el-select v-model='formInline.stepName'>
							<el-option label="全部" value=""></el-option>
							<el-option v-for='item in stepList' :label="item" :value="item"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click='search("form")' size="mini">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="contain_body clearfix" ref='contain_body'>
				<div v-show='detail.length > 0' id='myChart' class='left' style="width: 500px;height: 100%;" ref='chart'></div>
				<div v-show='detail.length <= 0' class='left' style="width: 500px;height: 500px;text-align: center;line-height: 500px; border: 1px solid #efefef;box-sizing: border-box;margin-right: 20px;">
					暂无图表
				</div>
				<div class='right' style="width: calc(100% - 520px);height: 100%;">
					<el-table :data="detail" style="width: 100%" stripe border show-summary>
						<el-table-column align="center" label="工号" prop="executeUserId" :resizable="false"></el-table-column>
						<el-table-column align="center" label="姓名" prop="executeUserName" :resizable="false"></el-table-column>
						<el-table-column align="center" label="账期" prop="period" :resizable="false"></el-table-column>
						<el-table-column align="center" label="会计步骤" prop="stepName" :resizable="false"></el-table-column>
						<el-table-column align="center" label="完成情况" :resizable="false">
							<el-table-column align="center" prop="total" label="合计">
							</el-table-column>
							<el-table-column align="center" prop="completed" label="已完成">
							</el-table-column>
							<el-table-column align="center" prop="incomplete" label="未完成">
							</el-table-column>
						</el-table-column>
					</el-table>
					<!-- <el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '4')})"
							 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
							</el-pagination> -->
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: "router1",
		data() {
			return {
				cust: "",
				formInline: {
					customId: "",
					period: "",
					stepName: "",
					customerName: "",
				},
				stepList: ["发票录入", "税款审核", "税款确认", "申报"],
				detail: [],
				currentPage: 1,
				pageSize: 10,
				total: 0,
				completed: [],
				con: [],
				incomplete: [],
				nameList: [],
				userList: [],
				rules: {
					period: [{
						required: true,
						message: "请选择账期",
						trigger: "change"
					}]
				},
				myChart: ''
			};
		},
		components: {},
		methods: {
			// querySearch(queryString, cb) {
			// 	var cust = this.$store.state.cust;
			// 	cust.forEach((item, index) => {
			// 		item.value = item.customerName;
			// 	})
			// 	var results = queryString ? cust.filter(this.createFilter(queryString)) : cust;
			// 	// 调用 callback 返回建议列表的数据
			// 	cb(results);
			// },
			// createFilter(queryString) {
			// 	return (cust) => {
			// 		return (cust.customerName.indexOf(queryString) === 0);
			// 	};
			// },
			// handleSelect(custom) {
			// this.formInline.customId = this.$store.state.cust.find(item =>
			// 	item.value === custom.value
			// ).customerId;
			// console.log(this.$store.state.cust.find(item =>
			// 	item.value === custom.value
			// ).customerId)
			// },
			search(formName) {
				this.$refs[formName].validate(valid => {
					if (valid) {
						this.completed = [];
						this.incomplete = [];
						this.con = [];
						this.nameList = [];
						this.formInline.executeUserId = this.$store.state.user.operatorId;
						let params = this.formInline;
						this.axios
							.post(
								"/perTaxToolTwo/e9z/historyQuery/selectPageList",
								this.qs.stringify(params), {
									headers: {
										"Content-Type": "application/x-www-form-urlencoded"
									}
								}
							)
							.then(res => {
								if (res.data.code == 200) {
									this.detail = res.data.data;
									this.detail.forEach((item, index) => {
										this.completed.push(item.completed);
										this.incomplete.push(item.incomplete);
										this.con.push(item.incomplete + item.completed);
										this.nameList.push(item.executeUserName + "(" + item.stepName + ")");
									});
									this.drawLine();
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
							.catch(function(err) {
								this.$message({
									message: "系统繁忙，请稍后重试",
									type: "error"
								});
							});
					} else {
						console.log("error submit!!");
						return false;
					}
				});
			},
			findUserRoleList() {
				let params = {};
				this.axios
					.post("/perTaxToolTwo/e9z/configUserRole/findUserRoleList", params)
					.then(res => {
						if (res.data.code == 200) {
							this.userList = res.data.data;
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
					.catch(function(err) {
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			drawLine() {

				// 引入 ECharts 主模块
				var echarts = require('echarts/lib/echarts');
				// 引入柱状图
				require('echarts/lib/chart/bar');
				// 引入提示框和标题组件
				require('echarts/lib/component/tooltip');
				require('echarts/lib/component/title');

				// 基于准备好的dom，初始化echarts实例
				this.myChart = echarts.init(document.getElementById("myChart"));
				this.echarts1_option = {
					color: ["#ed878e", "#ffb980", "#43b3db"],
					title: {
						// text: '世界人口总量',
						// subtext: '数据来自网络'
					},
					tooltip: {
						// trigger: 'axis',
						// axisPointer: {
						// 	type: 'shadow'
						// }
					},
					legend: {
						data: ["合计", "已完成", "未完成"]
					},
					grid: {
						top: "40",
						right: "80",
						bottom: "40",
						left: "0",
						containLabel :true
					},
					xAxis: {
						name: "完成情况",
						type: "value",
						boundaryGap: [0, 0.01],
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
						name: "员工姓名",
						type: "category",
						data: this.nameList,
						axisLine: {
							lineStyle: {
								color: "#b3b3b3"
							}
						}
					},
					series: [{
							name: "合计",
							type: "bar",
							data: this.con,
							barMaxWidth: 20,
							// label:{
							// 	formatter:
							// }
						},
						{
							name: "已完成",
							type: "bar",
							data: this.completed,
							barMaxWidth: 20
						},
						{
							name: "未完成",
							type: "bar",
							data: this.incomplete,
							barMaxWidth: 20
						}
					]
				};
				// 绘制图表
				this.myChart.setOption(this.echarts1_option);
				window.addEventListener("resize", this.resizeHandle)
			},
			resizeHandle() {
				this.$refs.chart.style.height = "calc(" + this.$refs.contain_body.offsetHeight + "px - 0.4rem)";
				this.myChart.resize()
			}
		},
		mounted() {
			// this.cust = this.$store.state.cust
			this.$refs.chart.style.height = "calc(" + this.$refs.contain_body.offsetHeight + "px - 0.4rem)";
			this.findUserRoleList();
		},
		destroyed() {
			window.removeEventListener("resize", this.resizeHandle)
		}
	};
</script>

<style scoped lang="less">
	.main_contain {
		width: 100%;
		height: 100%;
		padding: 20px;
		box-sizing: border-box;

		.left_contain {
			height: 100%;
		}
	}

	.contain_header {
		height: 2rem;
		padding: 0px 30px;
		background: url(../../assets/img/list-bg1.png) no-repeat;
		background-size: cover;
		border-top-left-radius: 0.06rem;
		border-top-right-radius: 0.06rem;

		.title {
			font-size: 0.24rem;
			height: 1rem;
			line-height: 1.24rem;
			color: #fff;
		}

		/deep/ .el-form-item--mini .el-form-item__label {
			color: #fff;
		}

		/deep/ .el-form {
			margin-top: 0.1rem;
		}
	}

	.contain_body {
		height: calc(100% - 2rem);
		box-sizing: border-box;
		padding: 0.2rem 0.2rem;
		background: #fff;

		.contain_body_div {
			align-items: center;
			display: flex;
			position: relative;

			i {
				background: pink;
				display: inline-block;
				width: 0.4rem;
				height: 0.4rem;
				border-radius: 0.2rem;
			}

			.circle {
				display: inline-block;
				width: 0.1rem;
				height: 0.1rem;
				border-radius: 0.05rem;
				background-color: #c9c9c9;
				margin-right: 0.06rem;
			}
		}

		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 40px;
		}

		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #ebf6fb;
		}

		/deep/ .el-table th {
			background-color: #ebf6fb;
		}

		/deep/ .el-table td {
			padding: 6px 0;
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
	}

	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.1rem;
	}
</style>
