<template>
	<div class="main_contain">

		<div class="contain_body">
			<div style="background-color: #efefef;padding: 20px 50px 20px 20px;position: relative;">
				<!-- <div style="width:16px;position: absolute;top: 120px;right: 26px;color: royalblue;">附件1张</div> -->
				<h2>记账凭证</h2>
				<div class='line'></div>
				<div class='line'></div>
				<div style="width: 800px;float: left;">
					<span>{{fBrNo}}</span>
					<span>{{detail.fPeriod}}</span>
				</div>

				<h4>

					<span style="float: right;">凭证字号：记-{{voucherInfo.fnumber}}</span><span style="float: right;margin-right: 20px;">序列号：{{voucherInfo.fserialnum}}</span>
				</h4>
				<div>
					<label for="">业务日期：</label>
					<el-date-picker v-model="fdate_temp" type="date" placeholder="请选择" value-format="yyyy-MM-dd" format="yyyy-MM-dd" @change="getPeriod">
					</el-date-picker>
					
				</div>
				<el-table :data="tableListNew" style="width: 100%" show-summary :summary-method="getSummaries">
					<el-table-column align="center" label="摘要" width="450">
						<template slot-scope="scope">
							<div style="min-height: 20px;" v-text="scope.row.fExplanation"></div>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="faccount" label="会计科目">
						<el-table-column align="center" label="一级科目_明细科目" prop="fNumber_account" show-overflow-tooltip width="450">
							<template slot-scope="scope">
								<div style="min-height: 20px;" v-text="scope.row.fFullName"></div>


								<!-- <div v-show="scope.$index == tableList.length - 1">{{totaltxt}}</div> -->

							</template>
						</el-table-column>
					</el-table-column>
					<!-- <el-table-column align="center" prop="ffullname" label="科目名称" width="150" show-overflow-tooltip></el-table-column> -->
					<el-table-column align="center" label="借方" prop="fDebit_string">
						<template slot-scope="scope">
							<div style="min-height: 20px;" v-text="scope.row.fDebit_string"></div>
							<!-- <div v-show="scope.$index == tableList.length - 1">{{famount_string1Total}}</div> -->
						</template>
					</el-table-column>
					<el-table-column align="center" label="贷方" prop="fCredit_string">
						<template slot-scope="scope">
							<div style="min-height: 20px;" v-text="scope.row.fCredit_string"></div>


						</template>
					</el-table-column>

				</el-table>
				<el-pagination background @current-change="((val)=>{handleCurrentChange1(val)})" :current-page="tableIndex+1"
				 :page-size="1" layout=" prev, pager, next" :total="tableTotal" style="text-align: center;">
				</el-pagination>
				<div class='btn_contain clearfix'>
					<span class='close' @click="createProofTVouchers">提交</span>
				</div>
			</div>


		</div>


	</div>
</template>

<script>
	// import PlanDialog from "../components/common/planDialog.vue"
	export default {
		name: "customer",
		data() {
			return {
				
				fdate_temp:'',
				tableIndex: 0,
				// tableTotal: 1,
				tableList: [],
				detail: {},
				fBrNo: "",
				fVoucherID: '',
				voucherInfo: {},
				totaltxt: '',
				tableList: [],
				
				temList: [],
				
				year: '',
				month: '',
				sum2: 0,
				sum3: 0,


			}
		},
		components: {
			// PlanDialog
		},
		methods: {





			getProofTVouchers() {
				let params = {
					"fBrNo": this.fBrNo,
					"fVoucherID": this.fVoucherID,
					"insert_type": this.insert_type
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVouchers_fVoucherID', this.qs.stringify(params))
					.then(res => {
						if (res.data.code == 200) {
							this.tableList = res.data.data;
							this.tableList.forEach((item, index) => {
								item.findex = index;
								if (item.fDebit_string) {
									item.fDebit_string = this.formatNum(item.fDebit_string);
								}
								if (item.fCredit_string) {
									item.fCredit_string = this.formatNum(item.fCredit_string);
								}

							});
							if (this.tableList.length > 0) {
								this.detail = this.tableList[0]
							}
							
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

			handleCurrentChange1(val) {
				this.tableIndex = val - 1;
			},



			createProofTVouchers() {
				// this.saveProofTVouchers();




				var tvoucherentry = [];
				
				
				this.tableList.forEach(items => {

					if (items.fDebit_string) {
						tvoucherentry.push({
							"fexplanation": items.fExplanation,
							"faccount": items.fNumber_account,
							"fdc": 1,
							"famount_string": items.fDebit_string.replace(/,/g, ''),
						})
					} else if (items.fCredit_string) {
						tvoucherentry.push({
							"fexplanation": items.fExplanation,
							"faccount": items.fNumber_account,
							"fdc": 0,
							"famount_string": items.fCredit_string.replace(/,/g, ''),
						})
					}

				})


				let params = {
					"fbrno": this.fBrNo,
					"fdebittotal_string": this.sum2.replace(/,/g, ''),
					"fcredittotal_string": this.sum3.replace(/,/g, ''),
					"fexplanation": this.tableList[0].fExplanation,
					"fentrycount": tvoucherentry.length,
					"tvoucherentries": tvoucherentry,
					"fdate_temp": this.fdate_temp,
					"ftransdate_temp": this.fdate_temp,
					"fnumber": this.voucherInfo.fnumber,
					"fserialnum": this.voucherInfo.fserialnum,
					"scheduleId": ''
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/createProofTVouchers', params)
					.then(res => {
						if (res.data.code == 200) {
							this.$router.push({ //核心语句
								path: '/financeCalculateCenter/tvoucherentryQuery', //跳转的路径
								query: { //路由传参时push和query搭配使用 ，作用时传递参数
									// id: row.mainId,
									
									// accountPeriod: row.accountPeriod,
									// customerName: row.customerName,
									scroll:this.$route.query.scroll
								}
							})
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
			getPeriod(){
				let params = {
					year: this.fdate_temp.slice(0,4),
					month: parseFloat(this.fdate_temp.slice(5,7)),
					// year: this.voucherInfo.temYear,
					// month: this.voucherInfo.temMonth,
					fBrNo: this.fBrNo
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/getPeriod', this.qs.stringify(params), {
						// this.axios.post('/miaoxing/queryPage', params)
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					.then(res => {
						if (res.data.code == 200) {
							this.$set(this.voucherInfo,'fnumber',res.data.data.fNumber_fBrNo);
				
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
			
			//所有会计科目

			getProofTVoucher() {
				let params = {
					"fBrNo": this.fBrNo
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVoucher', this.qs.stringify(params), {
						// this.axios.post('/miaoxing/queryPage', params)
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					.then(res => {
						if (res.data.code == 200) {
							this.$set(this.voucherInfo,'fserialnum',res.data.data.fserialnum);
							this.fdate_temp = res.data.data.ftransdate_temp;
							// this.$set(this.fdate_temp,'temYear',res.data.data.fyear);
							// this.$set(this.fdate_temp,'temMonth',res.data.data.fperiod);
							// this.voucherInfo.fserialnum = res.data.data.fserialnum;
							console.log(this.fdate_temp);
							this.getPeriod();
							// this.uploadData.fYear = this.voucherInfo.ftransdate_temp;

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

			getSummaries(param) {
				const {
					columns,
					data
				} = param;
				const sums = [];
				let vm = this;
				columns.forEach((column, index) => {
					if (index === 0) {
						sums[index] = '合计';
						return;
					}

					if (index === 1) {
						sums[index] = this.dxhz;
						return;
					}

					if (index === 2 || index === 3) {
						console.log(this.tableList);
						console.log(column.property);
						const values = this.tableList.map(item => item[column.property] ? item[column.property].replace(/,/g, '') : '');
						// const values = this.tableList.map(item => item[column.property].replace(/,/g, ''));
						console.log(values);
						var a = 0;
						values.forEach(item => {
							var n = Number(item);
							if (!isNaN(n)) {
								console.log(n);
								a = parseFloat(a) + parseFloat(n);
								console.log('a', a);
								a = parseFloat(a).toFixed(2);
								console.log('a1', a);
								console.log('--', a)
							} else {
								a = parseFloat(a).toFixed(2);
								console.log('**', a)
							}

						})
						sums[index] = a;


						// sums[index] = values.reduce((prev, curr) => {
						// 	var n = Number(curr)
						// 	console.log(prev,typeof(prev));
						// 	if (!isNaN(n)) { //数字
						// 		return prev + n;
						// 	}else{
						// 		return prev;
						// 	}  


						// }, 0);
						sums[index] = this.formatNum(sums[index]);
						this.sum2 = sums[2];
						this.sum3 = sums[3];
						if (index === 2) {
							let params = {
								"cou": sums[2].replace(/,/g, '')
							};
							this.axios.post('/perTaxToolTwo/e9/tVoucher/proofTVouchers_convert', this.qs.stringify(params), {
									// this.axios.post('/miaoxing/queryPage', params)
									headers: {
										"Content-Type": "application/x-www-form-urlencoded"
									}
								})
								.then(res => {
									if (res.data.code == 200) {
										this.dxhz = res.data.data;
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
						}
						return;
					}

				});
				console.log(sums)
				return sums;
			}
		},
		computed: {
			
			tableTotal: function() {
				return Math.ceil(this.tableList.length / 6)
			},
			tableListNew: function() {
				console.log(this.tableList);
				var arr = [];
				arr = this.tableList.filter((data, index) => {
					return Math.floor(index / 6) == this.tableIndex
				})
				console.log(arr)
				return arr;
			},

			
		},
		watch: {
			'$route'(to, from) {
				// init data
				if (to.name == 'voucherCopy') {
					this.fBrNo = this.$route.query.fBrNo;
					this.fVoucherID = this.$route.query.fVoucherID;
					this.insert_type = this.$route.query.insert_type;
					this.year = this.$route.query.year;
					this.month = this.$route.query.month;
					this.getProofTVoucher();
					this.getProofTVouchers();

				}

			},

		},
		created() {
			this.fBrNo = this.$route.query.fBrNo;
			this.fVoucherID = this.$route.query.fVoucherID;
			this.insert_type = this.$route.query.insert_type;
			this.year = this.$route.query.year;
			this.month = this.$route.query.month;
			this.getProofTVoucher();
			this.getProofTVouchers();
		}
	}
</script>

<style scoped lang="less">
	.moimg {
		width: 100%;
		height: 600px;
	}

	/deep/ .el-table__footer-wrapper {
		margin-top: 0px;
	}

	/deep/ .el-tree {
		height: 300px;
		overflow-y: scroll;
	}

	/deep/ .el-tree-node>.el-tree-node__children {
		overflow: unset;
	}

	.search_contain {
		background: #fff;
		height: 40px;
		padding-left: 20px;
		padding-top: 12px;
		margin-bottom: 20px;

		.info {
			height: 40px;
			line-height: 40px;
		}

		a {
			margin-left: 10px;
		}
	}

	.main_contain {
		width: 100%;
		height: 100%;
		padding: 20px;
		box-sizing: border-box;

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
	}



	.contain_body {
		padding: 0rem;
		height: 100%;
		box-sizing: border-box;

		// background: #fff;
		// .el-tabs {
		// 	height: 100%;
		// }

		h2 {
			font-size: 24px;
			color: royalblue;
			text-align: center;
			height: 40px;
			line-height: 40px;

			span {
				float: right;
				font-size: 12px;
				color: #999;
				font-style: italic
			}
		}

		h4 {
			font-size: 14px;
			font-style: italic;
			color: royalblue;
			text-align: center;
			height: 20px;
			line-height: 20px;
			margin-bottom: 4px;
		}

		.line {
			height: 1px;
			background: royalblue;
			width: 200px;
			// margin-bottom: 4px;
			margin: 4px auto;
		}
	}

	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
	}

	/deep/ .el-table {
		border-color: royalblue
	}

	/deep/ .el-table:before,
	/deep/ .el-table:after {
		background-color: royalblue
	}

	/deep/ .el-table__header {
		border-right-color: royalblue;
	}

	/deep/ .el-table__header tr,
	/deep/ .el-table__header th {
		padding: 0;
		height: 40px;
		color: royalblue;
		border-right-color: royalblue;
		border-bottom-color: royalblue
	}

	/deep/ .el-table__body tr,
	.el-table__body td {
		padding: 0;
		height: 40px;
	}

	/deep/ .el-table td {
		padding: 6px 0;
		border-right-color: royalblue;
		border-bottom-color: royalblue;
		background-color: #efefef
	}

	/deep/ .el-table th {
		background-color: #efefef;
	}

	/deep/.el-table thead.is-group th {
		background-color: #efefef;
	}

	/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {

		background: #fff;
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

	/deep/ .el-dialog__body {
		padding: 0 20px 30px;
	}

	.dialog {

		.title {
			height: 0.4rem;
			line-height: 0.4rem;
			font-size: 0.16rem;
			color: #333;
		}

		.tabtitle {
			display: flex;
			align-items: center;
			height: 35px;
			width: 100%;
		}

		.lineicon {
			width: 5px;
			background: #409EFF;
			height: 16px;
			margin-right: 10px;
		}

		.line {
			display: flex;
			flex-wrap: nowrap;
			flex-direction: row;
			justify-content: space-between;
			height: 0.4rem;
			align-content: center;
			align-items: center;
			margin-bottom: 20px;
		}

		ul {
			background: #f8f8f8;
			padding-left: 0.24rem;
			padding-right: 0.24rem;
			padding-top: 0.2rem;
			height: 3.5rem;
			overflow-y: auto;
			margin-top: 0.1rem;

			li {
				height: 0.24rem;
				font-size: 0.12rem;
			}
		}

		.mark {
			color: #ed878e;
		}

		/deep/ .el-dialog__body {
			padding-top: 0;
		}

		/deep/ .el-tabs__content {
			height: 550px;
			overflow: auto;
		}

		/deep/ .el-select,
		/deep/ .el-input,
		/deep/ .el-date-editor {
			width: 190px;
		}

		/deep/ .el-range-editor {
			width: 240px;
		}

		/*/deep/ .el-input__inner {
			height: 18px;
			line-height: 18px;
		}*/
		/deep/ .el-input__icon {
			height: 100%;
			width: 25px;
			text-align: center;
			line-height: 18px;
		}

		/deep/ .longLabel .el-form-item__label {
			line-height: 16px;
		}

		/deep/ .textareaWidth .el-textarea {
			width: 830px
		}

		/*滚动条样式*/
		::-webkit-scrollbar {
			width: 0.04rem;
			height: 0.04rem;
		}

		::-webkit-scrollbar-thumb {
			border-radius: 0.10rem;
			-webkit-box-shadow: inset 0 0 0.05rem rgba(0, 0, 0, 0.2);
			background: rgba(0, 0, 0, 0.2);
		}

		::-webkit-scrollbar-track {
			-webkit-box-shadow: inset 0 0 0.05rem rgba(0, 0, 0, 0.2);
			border-radius: 0;
			background: rgba(0, 0, 0, 0.1);
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
		cursor: pointer
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
		cursor: pointer
	}
</style>
