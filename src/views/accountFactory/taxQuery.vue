<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>税款审核查询</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="客户名称" prop="customerName">
						<el-select v-model="uploadData.customerName" placeholder="请选择" clearable filterable>
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option>
							<!-- <el-option v-for="item in custList" :label="item.customerName" :value='item.customerName'></el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="账期" prop="accountPeriod">

						<el-date-picker v-model="uploadData.accountPeriod" align="right" type="month" placeholder="请选择" format="yyyy-MM"
						 value-format="yyyy-MM">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="状态" prop="resultStatus">
						<el-select v-model="uploadData.executeStatus" placeholder="请选择" filterable>

							<el-option v-for="item in resultStatusList" :label="item.label" :value='item.value'></el-option>
						</el-select>
					</el-form-item>

					<el-button type="primary" @click='search()' size="mini">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain clearfix'>
			<!-- <h5>资产负债表</h5> -->
			<p>
				<!-- <el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='voucherGather_print()' style='float:right'>打印</el-button> -->
				<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='exportExcel()'>导出</el-button>
			</p>

			<el-table :data="tableData" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<!-- <el-table-column align="" label="资产">
					<template slot-scope="scope">
						<span v-html='scope.row.fAsset'></span>
					</template>
				</el-table-column> -->
				<el-table-column align="center" label="客户名称" prop='taxInfoRemark2' width="200"></el-table-column>
				<el-table-column align="center" label="账期" prop="accountPeriod"></el-table-column>
				<el-table-column align="center" label="审核会计" prop="checkAccountant"></el-table-column>
				<el-table-column align="center" label="做账会计" prop="doAccountant"></el-table-column>
				<el-table-column align="center" label="税款审核状态" prop="allTotal">
					<template slot-scope="scope">
						<span v-show='scope.row.executeStatus == 0'>未开始</span>
						<span v-show='scope.row.executeStatus == 1'>执行中</span>
						<span v-show='scope.row.executeStatus == 2'>已完成</span>
						<span v-show='scope.row.executeStatus == 3'>回退</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="发票提交时间" prop="lastSubmitTime">
					<template slot-scope="scope">
						<span>{{scope.row.lastSubmitTime?formatTimeToStr(scope.row.lastSubmitTime,'yyyy-MM-dd'):'--'}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="审核时间" prop="endTime">
					<template slot-scope="scope">
						<span>{{scope.row.endTime?formatTimeToStr(scope.row.endTime,'yyyy-MM-dd'):'--'}}</span>
					</template>
				</el-table-column>

				<el-table-column align="center" label="审核人" prop="executeUserName"></el-table-column>
				<!-- <el-table-column align="" label="负债和所有者权益" prop="fLiabilitiesAndOwnersEquity">
					<template slot-scope="scope">
						<span v-html='scope.row.fLiabilitiesAndOwnersEquity'></span>
					</template>
				</el-table-column> -->
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button type='text' size="mini" @click='commit(scope.row,1)' v-show='scope.row.executeStatus == 1'>审核</el-button>
					</template>
				</el-table-column>


			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>

		</div>




	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				fBrNo: '',
				fYear: '',
				fPeriod: '',
				loading: false,
				value4: this.formatTimeToStr(new Date(), 'yyyy-MM'),
				selectNum: new Date().getMonth(),
				percentage: 0,
				uploadData: {
					executeStatus: 1,
				},
				tableData: [],
				customerName: '',
				currentPage: 1,
				pageSize: 10,
				total: 0,
				executeStatus: 1,
				resultStatusList: [
					// {label:'全部',value:6},
					{
						label: '执行中',
						value: 1
					},
					{
						label: '已完成',
						value: 2
					},

				],
				resultStatus: null,
				customerName: "",
				accountPeriod: "",
				dialogVisible: false,
				detail: {},
				custList: []
			}
		},
		components: {},
		methods: {
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage();
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
				this.executeStatus = this.uploadData.executeStatus;
				this.customerName = this.uploadData.customerName;
				this.accountPeriod = this.uploadData.accountPeriod;
				this.queryPage()
			},

			queryPage() {
				this.loading = true;
				let params = {
					page: this.currentPage,
					row: this.pageSize,
					data: {
						// "fBrNo": this.fBrNo,
						// "fPeriod": this.fPeriod,
						"stepName": "税款审核",
						executeStatus: this.executeStatus,
						customerName: this.customerName,
						accountPeriod: this.accountPeriod
					}

				};
				this.axios.post('/perTaxToolTwo/e9z/taxStep/getInfoByStepName', params)
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
			exportExcel() {
				let params = {
					"stepName": "税款审核",
					executeStatus: this.executeStatus,
					customerName: this.customerName?this.customerName:'',
					accountPeriod: this.accountPeriod?this.accountPeriod:''

				};
				this.axios.post('/perTaxToolTwo/e9z/taxStep/exportExcel', this.qs.stringify(params), {
						responseType: 'blob',
					})
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {

							let link = document.createElement("a");
							link.href = window.URL.createObjectURL(new Blob([res.data]));
							link.target = "_blank";
							link.download = "税款审核列表.xls";
							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);
						
					})
					.catch(err => {
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
				// window.location.href = '/perTaxToolTwo/e9z/taxStep/exportExcel?customerName=' + this.customerName ? this.customerName :
				// 	'' + '&accountPeriod=' + this.accountPeriod ? this.accountPeriod : '' +
				// 	'&executeStatus=' + this.executeStatus + '&stepName=税款审核';


			},

			commit(row, type) {
				this.$router.push({ //核心语句
					path: '/accountFactory/invoice_t', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						customerId: row.customerId,
						accountPeriod: row.accountPeriod,
					}
				})
			},

			showDetail(row) {
				this.dialogVisible = true;
				let params = {
					id: row.incomeTaxRecord,
					accountPeriod: row.accountPeriod
					// id:1
				};
				this.axios.post('/perTaxToolTwo/e9z/e9zBusinessIncomeTaxRecord/getIncomeTaxRecordById', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.detail = res.data.data;
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


			//====判断是否需要安装CLodop云打印服务器:====



			/*获取当前的年、月*/

			/*获取本期的年、月*/

			/*获取每个月的最后一天*/

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
							this.voucherInfo = res.data.data;
							this.uploadData.fYear = res.data.data.fyear.toString();
							this.uploadData.fPeriod = res.data.data.fperiod;
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
			getAssignmentCustomer() {
				let params = {
					"stepName": 2
				};
				this.axios.post('/perTaxToolTwo/e9z/assignment/getAssignmentCustomer', params)
					.then(res => {
						if (res.data.code == 200) {
							this.custList = res.data.data;
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
			}
		},
		computed: {},
		watch: {

			'$route'(to, from) {
				// init data
				if (to.name == 'taxConfirm') {
					this.queryPage();
					// var updateUser = JSON.parse(sessionStorage.getItem('updateUser'));
					// var userTypeId = updateUser.userTypeId;
					// if(userTypeId == 1){
					// 	this.custList = JSON.parse(sessionStorage.getItem('updateCust'));
					// }else{
					// 	this.getAssignmentCustomer();
					// }
				}

			}
		},
		created() {
			this.queryPage();
			// var updateUser = JSON.parse(sessionStorage.getItem('updateUser'));
			// var userTypeId = updateUser.userTypeId;
			// if(userTypeId == 1){
			// 	this.custList = JSON.parse(sessionStorage.getItem('updateCust'));
			// }else{
			// 	this.getAssignmentCustomer();
			// }
			// this.showDetail();
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

		.card_charts {
			/* height: 350px; */
			padding-top: 10px;

			p {
				width: calc(50% - 5px);
				float: left;
				height: 24px;
				color: #333;
				margin-bottom: 4px;
				background: rgb(243, 246, 249);
			}

			p:nth-of-type(2n) {
				float: right;
			}

			p:nth-of-type(2n+1) {
				float: left;
			}

			p span {
				height: 24px;
				line-height: 24px;
			}

			p span:nth-of-type(2n) {
				float: left;
				width: 40%;
				/* text-align: right; */
				padding-right: 20px;
				box-sizing: border-box;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}

			p span:nth-of-type(2n+1) {
				float: left;
				width: 60%;
				text-indent: 20px
			}
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
			padding: 20px 20px 20px;
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
</style>
