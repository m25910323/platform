<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>历史查询</el-breadcrumb-item>
			<el-breadcrumb-item>历史账务税款</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="客户名称" prop="customerId">
						<el-select v-model="uploadData.customerId" placeholder="请选择" clearable filterable>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="所属期起" prop="accountPeriodStart">
						<el-date-picker :editable='false' :clearable="false" v-model="uploadData.accountPeriodStart" type="month" placeholder="选择年" format="yyyy-MM" value-format="yyyy-MM">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="所属期止" prop="accountPeriodEnd">
						<el-date-picker :editable='false' :clearable="false" v-model="uploadData.accountPeriodEnd" type="month" placeholder="选择年" format="yyyy-MM" value-format="yyyy-MM">
						</el-date-picker>
					</el-form-item>
					

					<el-button type="primary" @click='search()' size="mini">查询</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain clearfix'>

			<el-button type="primary" style="float: right;margin-right: 20px;margin-top: 12px;" @click='exportExcel' :disabled="tableData.length == 0" size="mini">导出</el-button>

			<el-table :data="tableData" style="" stripe border v-loading='loading' style="margin-top: 20px;">
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="序号" width="50">
					<template slot-scope="scope">
						<span>{{scope.$index + 1}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="客户名称" prop='customerName'></el-table-column>
				<el-table-column align="center" label="收入" prop="allIncome">
					<template slot-scope="scope">
						<span>{{format(scope.row.allIncome)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="期间" prop="duringPeriod" width="140"></el-table-column>
				
				<el-table-column align="center" label="增值税" prop='allTaxAmount'>
					<template slot-scope="scope">
						<span>{{format(scope.row.allTaxAmount)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="消费税" prop="allConsumptionTaxation">
					<template slot-scope="scope">
						<span>{{format(scope.row.allConsumptionTaxation)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="城市维护建设税" prop="allUrbanTaxation">
					<template slot-scope="scope">
						<span>{{format(scope.row.allUrbanTaxation)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="教育费附加" prop="allEsTaxation">
					<template slot-scope="scope">
						<span>{{format(scope.row.allEsTaxation)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="地方教育费附加" prop="allAleTaxation">
					<template slot-scope="scope">
						<span>{{format(scope.row.allAleTaxation)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="印花税" prop="allStampDutyTaxation">
					<template slot-scope="scope">
						<span>{{format(scope.row.allStampDutyTaxation)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="文化事业建设费" prop="education">
					<template slot-scope="scope">
						<span>{{format(scope.row.education)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="企业所得税" prop="incomeTaxation">
					<template slot-scope="scope">
						<span>{{format(scope.row.incomeTaxation)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="个人所得税" prop="wages">
					<template slot-scope="scope">
						<span>{{format(scope.row.wages)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="税款合计" prop="total">
					<template slot-scope="scope">
						<span>{{format(scope.row.total)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click='showDetail(scope.row)'>查看详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background @current-change="((val)=>{handleCurrentChange(val)})" :current-page="currentPage"
			 :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>
		</div>
		
		<el-dialog title="详情" :visible.sync="dialogVisible" width="100%" class='dialog'>
			
				<el-table :data="detail" show-summary  :summary-method="getSummaries1">
					<el-table-column align="center" label="账期" prop='accountPeriod'></el-table-column>
					<el-table-column align="center" label="客户名称" prop='customerName'></el-table-column>
					<el-table-column align="center" label="收入" prop="allIncome">
						<template slot-scope="scope">
							<span>{{format(scope.row.allIncome)}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="期间" prop="duringPeriod" width="140"></el-table-column>
					
					<el-table-column align="center" label="增值税" prop='allTaxAmount'>
						<template slot-scope="scope">
							<span>{{format(scope.row.allTaxAmount)}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="消费税" prop="allConsumptionTaxation">
						<template slot-scope="scope">
							<span>{{format(scope.row.allConsumptionTaxation)}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="城市维护建设税" prop="allUrbanTaxation">
						<template slot-scope="scope">
							<span>{{format(scope.row.allUrbanTaxation)}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="教育费附加" prop="allEsTaxation">
						<template slot-scope="scope">
							<span>{{format(scope.row.allEsTaxation)}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="地方教育费附加" prop="allAleTaxation">
						<template slot-scope="scope">
							<span>{{format(scope.row.allAleTaxation)}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="印花税" prop="allStampDutyTaxation">
						<template slot-scope="scope">
							<span>{{format(scope.row.allStampDutyTaxation)}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="文化事业建设费" prop="education">
						<template slot-scope="scope">
							<span>{{format(scope.row.education)}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="企业所得税" prop="incomeTaxation">
						<template slot-scope="scope">
							<span>{{format(scope.row.incomeTaxation)}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="税款合计" prop="total">
						<template slot-scope="scope">
							<span>{{format(scope.row.total)}}</span>
						</template>
					</el-table-column>
		
				</el-table>
				<!-- <div class='btn_contain clearfix'>
					<span class='commit' @click="commitFP">确定</span>
				</div> -->
		
		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				dialogVisible:false,
				detail:[],
				accountPeriodStart: this.formatTimeToStr(new Date(),'yyyy-MM'),
				accountPeriodEnd: this.formatTimeToStr(new Date(),'yyyy-MM'),
				
				loading: false,
				uploadData: {
					accountPeriodStart: this.formatTimeToStr(new Date(),'yyyy-MM'),
					accountPeriodEnd: this.formatTimeToStr(new Date(),'yyyy-MM'),
				},
				customerId: '',
				tableData: [],
				currentPage:1,
				total:0,
				pageSize:10

			}
		},
		components: {},
		methods: {
			format(data){
				if(data == '--'){
					return data;
				}else{
					return parseFloat(data).toFixed(2);
				}
			},
			getSummaries1(param) {
				const { columns, data } = param;
				const sums = [];
				columns.forEach((column, index) => {
					if (index === 0) {
						sums[index] = '合计';
						return;
					}
					if (index !== 0 && index !== 1 && index !== 3) {
						const values = data.map(item => Number(item[column.property]).toFixed(2));
						if (!values.every(value => isNaN(value))) {
							sums[index] = values.reduce((prev, curr) => {
								const value = Number(curr);
								if (!isNaN(value)) {
									return parseFloat(prev) + parseFloat(curr);
								} else {
									return parseFloat(prev);
								}
							}, 0);
							sums[index] = sums[index].toFixed(2)
						} else {
							sums[index] = '--';
						}
					}
					
				});
			
				return sums;
			},

			search() {
				this.customerId = this.uploadData.customerId;
				this.accountPeriodStart = this.uploadData.accountPeriodStart;
				this.accountPeriodEnd = this.uploadData.accountPeriodEnd;
				this.queryPage()
			},

			queryPage() {
				this.loading = true;
				let params = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						"accountPeriodStart": this.accountPeriodStart,
						"accountPeriodEnd": this.accountPeriodEnd,
						"customerId": this.customerId
					}
				};
				this.axios.post('/perTaxToolTwo/e9z/e9zBusinessIncomeTaxRecord/getHistoricalAccountingTax', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data;
							this.total = res.data.count;
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
			showDetail(row){
				this.dialogVisible = true;
				this.getHistoricalAccountingTaxDetail(row)
			},
			exportExcel(){
				window.location.href = '/perTaxToolTwo/e9z/e9zBusinessIncomeTaxRecord/exportHistoricalAccountingTax?accountPeriodStart=' + this.accountPeriodStart + '&accountPeriodEnd=' + this.accountPeriodEnd + '&customerId=' + (this.customerId?this.customerId:'');
			},
			getHistoricalAccountingTaxDetail(row){
				let params = {
					
						"accountPeriodStart": row.accountPeriodStart,
						"accountPeriodEnd": row.accountPeriodEnd,
						"customerId": row.customerId
					
				};
				this.axios.post('perTaxToolTwo/e9z/e9zBusinessIncomeTaxRecord/getHistoricalAccountingTaxDetail', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.detail = res.data.data;
							// this.total = res.data.count;
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
			handleCurrentChange(val){
				this.currentPage = val;
				this.queryPage()
			},
			common_getPeriod(fYearStart, fPeriodStart, fYearEnd, fPeriodEnd) {
				var ss = "";
				if (fYearEnd == fYearStart) {
					ss = "期间  " + fYearStart + "年第" + fPeriodStart + "期至" + "第" + fPeriodEnd + "期";
					if (fPeriodStart == fPeriodEnd) {
						ss = "期间:" + fYearStart + "年第" + fPeriodStart + "期 ";
					}
				} else {
					ss = "期间  " + fYearStart + "年第" + fPeriodStart + "期至" + fYearEnd + "年第" + fPeriodEnd + "期";

				}
				return ss;
			},
			string_isNull(str) {
				if (str == null) {
					str = "&nbsp&nbsp&nbsp&nbsp";
				}
				return str;
			},


			//====判断是否需要安装CLodop云打印服务器:====


			getStrLength(str) {
				var cArr = str.match(/[^\x00-\xff]/ig);
				return str.length + (cArr == null ? 0 : cArr.length);
			},
			/*获取当前的年、月*/
			getCurrentDate() {
				var myDate = new Date();
				var printfFullYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
				var printfMonth = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
				var printfDate = myDate.getDate(); //获取当前日(1-31)
				var printDate = printfFullYear + "-" + printfMonth + "-" + printfDate;
				return printDate;
			},
			/*获取本期的年、月*/
			getCurrentPeriodDate(year, month) {
				var myDate = this.getLastDay(year, month);

				var printDate = year + "年" + month + "月" + myDate + "日";
				return printDate;
			},
			/*获取每个月的最后一天*/
			getLastDay(year, month) {
				var new_year = year; //取当前的年份
				var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
				if (month > 12) //如果当前大于12月，则年份转到下一年
				{
					new_month -= 12; //月份减
					new_year++; //年份增
				}
				var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
				return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期
			},

		},
		computed: {},
		watch: {

			'$route'(to, from) {
				// init data
				if (to.name == 'balanceStatementE9') {

				}

			}
		},
		created() {
			this.queryPage();


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
