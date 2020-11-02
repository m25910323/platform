<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>凭证管理</el-breadcrumb-item>
			<el-breadcrumb-item>会计分录查询</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="单位名称" prop="fBrNo">
						<el-select v-model="uploadData.fBrNo" placeholder="请选择公司名称" clearable filterable  @change='getProofTVoucher'>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option>
							<!-- <el-option v-for="item in cust" :label="item.customerName" :value='item.customerName'></el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="会计时间" prop="dossierName">



						<el-date-picker v-model="uploadData.fYearStart" type="year" format="yyyy" value-format="yyyy">
						</el-date-picker>
						<span class="demonstration" style="margin-left:5px;">年</span>
						<el-input-number v-model="uploadData.fPeriodStart" :min="1" :max="12" label="描述文字" style="height:30px;margin-left:10px;width:100px;"></el-input-number>
						<span class="demonstration" style="margin-left:5px;">期至</span>

						<el-date-picker v-model="uploadData.year" type="year" format="yyyy" value-format="yyyy">
						</el-date-picker>年
						<el-input-number v-model="uploadData.month" :min="1" :max="12" label="描述文字" style="height:30px;margin-left:10px;width:100px;"></el-input-number>
						<span class="demonstration" style="margin-left:5px;"></el-date-picker>期</span>
					</el-form-item>

					<el-form-item label="是否审核" prop="fChecked">
						<el-select v-model="uploadData.fChecked" placeholder="请选择" clearable filterable>
							<el-option label="未审核" value='0'></el-option>
							<el-option label="已审核" value='1'></el-option>
							<el-option label="全部" value='-1'></el-option>
						</el-select>

					</el-form-item>

					<el-form-item label="是否过账" prop="fPosted">
						<el-select v-model="uploadData.fPosted" placeholder="请选择" clearable filterable>
							<el-option label="未过账" value='0'></el-option>
							<el-option label="已过账" value='1'></el-option>
							<el-option label="全部" value='-1'></el-option>
						</el-select>
					</el-form-item>

					<el-button type="primary" @click='search()' size="mini">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<h5>会计分录明细</h5>
			<p>
				单位名称：{{customerName}}
				<!-- <el-button type="text" size="mini" style='float:right' @click='showupdateFNumberProofTVoucher'>凭证整理</el-button> -->
			</p>
			<!-- <el-button type='primary' size="mini" :disabled="multiSelection.length <= 0" @click='handleEdit("mul")'>批量入库</el-button> -->

			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="日期" prop="fDate_string"></el-table-column>
				<el-table-column align="center" label="会计期间" prop='fPeriod'></el-table-column>
				<el-table-column align="center" label="凭证字号" prop="fNumber_fBrNo"></el-table-column>
				<el-table-column align="center" label="分录号" prop="fEntryID"></el-table-column>
				<el-table-column align="center" label="摘要" prop='fExplanation' width="300"></el-table-column>
				<el-table-column align="center" label="科目代码" prop="fNumber_account"></el-table-column>
				<el-table-column align="center" label="科目名称" prop="fFullName" width="350"></el-table-column>
				<el-table-column align="center" label="借方(元)" prop='fDebit_string'></el-table-column>
				<el-table-column align="center" label="贷方(元) " prop="fCredit_string"></el-table-column>
				<el-table-column align="center" label="审核结果" prop="fPosted">
					<template slot-scope="scope">
						<span v-if='scope.row.fPosted == 1'>已过账</span>
						<span v-else-if='scope.row.fPosted == 0 && scope.row.fChecked == 1'>已审核未过账</span>
						<span v-else-if='scope.row.fPosted == 100'></span>
						<span v-else>未审核</span>
					</template>
				</el-table-column>
				<!-- <el-table-column align="center" label="数据来源类型 " prop='billSourceType'></el-table-column> -->
				<el-table-column align="center" label="电子发票预览">
					<template slot-scope="scope">
						<el-button @click='preview(scope.row)' type='text' size="mini" v-show='scope.row.schedule_id && scope.$index != tableData.length - 1'>预览</el-button>
					</template>
				</el-table-column>

			</el-table>

		</div>

		<el-dialog width="400px" title="凭证整理" :visible.sync="innerVisible" >
			<div class='dialog_contain clearfix'>
				<p>选择整理的期间</p>
				<el-date-picker v-model="makeup.year" type="year" format="yyyy" value-format="yyyy" size="mini">
				</el-date-picker>年
				<el-date-picker v-model="makeup.month" type="month" format="MM" value-format="MM" size="mini">
				</el-date-picker>期

				<p>凭证整理适用于存在凭证断号，需要系统自动进行凭证号的连续排序的情况。已审核、已过账、 已结账期间的凭证不参与凭证整理。 </p>
				<div class='btn_contain clearfix'>
					<span class='commit' @click="updateFNumberProofTVoucher">确认</span>
					<span class='close' @click="hideDialog">关闭</span>

				</div>
			</div>
		</el-dialog>
		
		<el-dialog width="700px" title="电子发票预览" :visible.sync="dialogVisible">
			<img :src='img' alt="" style="width: 660px;">
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				jzyear:'',
				jzmonth:'',
				fBrNo: '',
				year: '',
				month: '',
				fChecked: '',
				fPosted: '',
				fYearStart: '',
				fPeriodStart: '',
				cust: [{
					customerName: "新财务测试1"
				}],
				makeup: {},
				loading: false,
				value4: [],
				selectNum: new Date().getMonth(),
				percentage: 0,
				uploadData: {
					fBrNo: '',
					fChecked: '-1',
					fPosted: '-1',
					year:'',
					month:'',
					fYearStart:'',
					fPeriodStart:'',
				},
				customerId: 0,
				tableData: [],
				tvoucherCount: '',
				fattachments: '',
				customerName: '',
				moneyList: [{
					label: '人民币',
					value: 1
				}, {
					label: '（综合本位币）',
					value: 2
				}, {
					label: '（所有币别） ',
					value: 3
				}],
				innerVisible: false,
				innerVisible1:false,
				dialogVisible:false,
				img:''
			}
		},
		components: {},
		methods: {
			preview(row){
				this.dialogVisible = true;
				let params = {
					"scheduleId":row.schedule_id
				};
				this.axios.post('/perTaxToolTwo/iocr/main/getInvoice', params)
					.then(res => {
						if (res.data.code == 200) {
							this.img = res.data.data.imageUrl;
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
							this.uploadData.fYearStart = res.data.data.fyear.toString();
							this.uploadData.fPeriodStart = res.data.data.fperiod;
							this.uploadData.year = res.data.data.fyear.toString();
							this.uploadData.month = res.data.data.fperiod;
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
			
			search() {
				this.fBrNo = this.uploadData.fBrNo;
				this.year = this.uploadData.year;
				this.month = this.uploadData.month;
				this.fChecked = this.uploadData.fChecked;
				this.fPosted = this.uploadData.fPosted;
				this.fYearStart = this.uploadData.fYearStart;
				this.fPeriodStart = this.uploadData.fPeriodStart;
				this.queryPage()
			},
			hideDialog() {
				this.innerVisible = false;
				this.makeup = {};
			},
			hideDialog1(){
				this.innerVisible1 = false;
			},
			queryPage() {
				let params = {
					"year": this.year,
					"month": this.month,
					"fChecked": this.fChecked,
					"fPosted": this.fPosted,
					"fNumber_erp": 0,
					// "fBrNo": this.uploadData.fBrNo,
					"fBrNo": this.fBrNo,
					"fInternalInd": "",
					"fYearStart": this.fYearStart,
					"fPeriodStart": this.fPeriodStart,
					"curPage": 1,
					"isPrint": 0
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVoucher_search', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data;
							this.customerName = this.fBrNo;
							this.tableData.push({
								fExplanation: '合计',
								fDebit_string: this.compute1(res.data.data)[0],
								fCredit_string: this.compute1(res.data.data)[1],
								fPosted:100
							})
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
			showupdateFNumberProofTVoucher() {
				this.innerVisible = true;
			},
			updateFNumberProofTVoucher() {
				let params = {
					fYear: parseInt(this.makeup.year),
					fPeriod: parseInt(this.makeup.month),
					fBrNo: this.customerName
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/updateFNumberProofTVoucher', this.qs.stringify(params), {
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.innerVisible = false;
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
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


			/*将数字后面加两个小数，如果为整数，则加.00,如果为.1，则改为.10*/
			changeTwoDecimal(x) {
				var f_x = Math.round(x * 100) / 100;
				var s_x = f_x.toString();
				var pos_decimal = s_x.indexOf('.');
				if (pos_decimal < 0) {
					pos_decimal = s_x.length;
					s_x += '.';
				}
				while (s_x.length <= pos_decimal + 2) {
					s_x += '0';
				}
				return s_x;
			},

			/*格式化数字：给数字加上，*/
			formatNum(s) {
				var n = 2;
				n = n > 0 && n <= 20 ? n : 2;
				s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
				var l = s.split(".")[0].split("").reverse(),
					r = s.split(".")[1];
				var t = "";
				for (var i = 0; i < l.length; i++) {
					t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
				}
				return t.split("").reverse().join("") + "." + r;

			},

			compute1(rows) {
				var total_fDebit = 0,
					tatal_fCredit = 0;
				for (var i = 0; i < rows.length; i++) {
					var fDebitTemp = '';
					var fCreditTemp = '';
					if (+rows[i]['fDebit_string'] != 0) {
						fDebitTemp = rows[i]['fDebit_string'].replace(/,/g, '');
					}
					if (+rows[i]['fCredit_string'] != 0) {
						fCreditTemp = rows[i]['fCredit_string'].replace(/,/g, '');
					}

					total_fDebit += +fDebitTemp;
					tatal_fCredit += +fCreditTemp;
				}
				total_fDebit = this.changeTwoDecimal(total_fDebit);
				tatal_fCredit = this.changeTwoDecimal(tatal_fCredit);
				total_fDebit = this.formatNum(total_fDebit);
				tatal_fCredit = this.formatNum(tatal_fCredit);
				return [total_fDebit, tatal_fCredit]
			}

		},
		computed: {},
		created() {
			// this.queryPage();
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

			/deep/ .el-radio {
				margin-right: 4px;
			}

			/deep/ .el-date-editor--year {
				width: 30px;
			}

			/deep/ .el-date-editor--month {
				width: 30px;
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
</style>
