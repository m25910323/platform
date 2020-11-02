<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>凭证管理</el-breadcrumb-item>
			<el-breadcrumb-item>查看凭证</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="单位名称" prop="dossierName">
						<el-select v-model="uploadData.customer" placeholder="请选择公司名称" clearable filterable value-key='customerId'>
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>
						</el-select>
					</el-form-item>

					<el-button type="primary" @click='search()' size="mini">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<h5>明细账</h5>
			<p>单位名称：{{customerName}}</p>
			<!-- <el-button type='primary' size="mini" :disabled="multiSelection.length <= 0" @click='handleEdit("mul")'>批量入库</el-button> -->
			<div style="float:left;margin-top: 12px;position: relative;z-index: 20;">
				<el-date-picker v-model="value4" type="month" placeholder="选择日期" size="mini" @change="setMonth" value-format="yyyy-MM"
				 format="yyyy-MM">
				</el-date-picker>
			</div>

			<div style="width:1200px;height:40px;" class="Article">
				<div class="Article-title">
					<div class="Article-title-nav" v-for='(item,index) in 12'>{{index+1}}月</div>
				</div>
				<div class="line">
					<div class='line-chiled' :style="'width:calc('+this.percentage+'% + ' + 850/24 + 'px)'"></div>
				</div>
				<div class="Article-nav">
					<div class="Article-circle" v-for='(item,index) in 12' :class="selectNum==index?'active-select':''" @click="selectNumChange(index)"></div>
				</div>

			</div>
			<el-table :data="arr" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading' :span-method="arraySpanMethod">
				<el-table-column align="center" type="selection" width="55"></el-table-column>

				<el-table-column align="" label="摘要" prop="showInfo">
					<template slot-scope="scope">
						<span v-html="scope.row.showInfo"></span>
					</template>
				</el-table-column>
				<el-table-column align="" label="科目" width="400">
					<template slot-scope="scope">
						<el-button type='text' size="mini" v-show='scope.row.creditAmount == "详情" && scope.row.fattachments != 0' style='float: right;'
						 @click='showDetail(scope.row)'>查看详情</el-button>
						<span v-html="scope.row.faccountName"></span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="借方金额" prop="debitAmount"></el-table-column>
				<el-table-column align="center" label="贷方金额">
					<template slot-scope="scope">
						<span v-html="scope.row.creditAmount"></span>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>
			<!-- <p style="text-align: right;margin-top: 20px;"><span style="margin-right: 20px;">凭证数：{{tvoucherCount}}</span> <span>附件数：{{fattachments}}</span></p> -->
		</div>

		<el-dialog title="详情" :visible.sync="dialogVisible" width="1400px" :before-close="handleClose">
			<div>
				<embed width="1260" height="600" :src="detail.pdfUrl"></embed>
				<!-- <a :href='detail[0].pdfUrl'>11111111111</a> -->
				<img v-for='item in detail.scheduleUrl' :src='item' style='width:1260px' />
			</div>

		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				dialogVisible: false,
				loading: false,
				value4: this.formatTimeToStr(new Date(), 'yyyy-MM'),
				selectNum: new Date().getMonth(),
				percentage: 0,
				uploadData: {},
				customerId: 0,
				tableData: [],
				arr: [],
				customerName: '',
				indexList: [0],
				mark: 0,
				detail: '',
				currentPage: 1,
				pageSize: 5,
				total: 0
			}
		},
		components: {},
		methods: {
			arraySpanMethod({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (row.tag === 0) {
					if (columnIndex === 1) {
						return [1, 3];
					} else if (columnIndex === 1) {
						return [0, 0];
					}
				}

				if (columnIndex === 0) {
					if (this.indexList.indexOf(rowIndex) >= 0) {
						return {
							rowspan: this.indexList[this.indexList.indexOf(rowIndex) + 1] - this.indexList[this.indexList.indexOf(rowIndex)],
							colspan: 1
						};
					} else {
						return {
							rowspan: 0,
							colspan: 0
						};
					}
				}

			},
			setMonth() {
				// alert(this.value4.substring(this.value4.length-2));
				this.selectNum = this.value4.substring(this.value4.length - 2) - 1;
				this.percentage = this.selectNum * (100 / 12);
				this.queryPage()
			},
			selectNumChange(index) {
				this.selectNum = index;
				this.percentage = index * (100 / 12);
				console.log('width:calc(' + this.percentage + '% + ' + 850 / 24 + 'px)');
				this.value4 = this.value4.substring(0, 5) + (index + 1)
				this.queryPage()
			},
			search() {
				this.customerId = this.uploadData.customer.customerId;
				this.customerName = this.uploadData.customer.customerName;
				this.queryPage()
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage()
			},
			queryPage() {
				this.arr = [];
				this.indexList = [0];
				this.loading = true;
				let params = {
					data: {
						"customerId": this.customerId,
						"belongDate": this.value4
					},
					page: this.currentPage,
					row: 5
				};
				this.axios.post('/perTaxToolTwo/TVoucher/getTVoucherInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.mark = 0;
							this.total =  res.data.count;
							this.tableData = res.data.data;
							this.tableData.forEach((item, index) => {
								this.mark += item.tvoucherentries.length + 1;
								this.indexList.push(this.mark);
								for (let i = 0; i < item.tvoucherentries.length + 1; i++) {
									if (i == 0) {
										this.arr.push({
											tag: 0,
											showInfo: '日期：' + item.fdate + '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;凭证字号：记-' + item.fnumber +
												'&nbsp;&nbsp;&nbsp;&nbsp;附单据：' + item.fattachments + '张',
											creditAmount: '详情',
											postData: item,
											fattachments: item.fattachments
										})
									} else {
										this.arr.push({
											showInfo: item.tvoucherentries[i - 1].fexplanation,
											faccountName: item.tvoucherentries[i - 1].fnumber + "_" + item.tvoucherentries[i - 1].ffullname,
											debitAmount: item.tvoucherentries[i - 1].ffullNameBorrowAmount,
											creditAmount: item.tvoucherentries[i - 1].ffullNameLoanAmount
										})
									}

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
			showDetail(row) {
				let params = [row.postData];
				this.axios.post('/perTaxToolTwo/TVoucher/getDetailsTVoucherInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible = true;
							this.detail = res.data.data[0];
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
			}
		},
		computed: {},
		created() {
			// this.queryPage();
			this.percentage = this.selectNum * (100 / 12);
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
