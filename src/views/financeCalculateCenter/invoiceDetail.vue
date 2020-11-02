<template>
	<div class="main_contain">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>会计工厂</el-breadcrumb-item>
			<el-breadcrumb-item>凭证管理</el-breadcrumb-item>

			<el-breadcrumb-item>凭证审核</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>凭证审核</div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini">
					<el-form-item label="公司">
						<!-- <el-autocomplete class="inline-input" v-model="uploadData.customerName" :fetch-suggestions="querySearch"
							 placeholder="请输入客户名称" @select="handleSelect"></el-autocomplete> -->
						<el-select v-model="uploadData.customerId" placeholder="请选择公司名称" clearable filterable>
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="账期" prop="accountPeriod">
						<el-date-picker v-model="uploadData.accountPeriod" type="month" placeholder="选择账期" clearable value-format='yyyy-MM'>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="凭证状态"  prop="voucherState">
						<!-- <el-autocomplete class="inline-input" v-model="uploadData.customerName" :fetch-suggestions="querySearch"
							 placeholder="请输入客户名称" @select="handleSelect"></el-autocomplete> -->
						<el-select v-model="uploadData.voucherState" placeholder="请选择" clearable filterable>
							<el-option label="未结账" value='2'></el-option>
							<el-option label="已结账" value='3'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="初审状态"  prop="firstCheckState">
						<!-- <el-autocomplete class="inline-input" v-model="uploadData.customerName" :fetch-suggestions="querySearch"
							 placeholder="请输入客户名称" @select="handleSelect"></el-autocomplete> -->
						<el-select v-model="uploadData.firstCheckState" placeholder="请选择" clearable filterable>
							<el-option label="未初审" value='0'></el-option>
							<el-option label="已初审" value='1'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="" prop="isMax">
						<el-checkbox v-model="uploadData.isMax" :true-label='trueLabel' :false-label="falseLabel">是否最后一期</el-checkbox>

					</el-form-item>
					<el-button @click='search' size="mini">查询</el-button>
				</el-form>
				<el-button @click='handleJZ' round size='small' style="position: absolute;top: 100px;right: 20px;">结账</el-button>
			</div>
			<div class="contain_body">
				<el-button type='primary' size="mini" :disabled="tableData.detail <= 0" @click='exportExcel()' style="margin-bottom: 10px;">导出</el-button>
				<el-table :data="detail" style="width: 100%" stripe border v-loading='loading1'>
					<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>
					<el-table-column align="center" label="审核会计" prop="checkAccountant"></el-table-column>
					<el-table-column align="center" label="做账会计" prop="doAccountant"></el-table-column>
					<el-table-column align="center" label="凭证">
						<el-table-column align="center" label="凭证数量" prop="accountantAllCount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="已审核凭证" prop="accountantCheckCount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="未审核凭证" prop="accountantUncheckCount" :resizable="false"></el-table-column>
					</el-table-column>
					<el-table-column align="center" label="发票">
						<el-table-column align="center" label="未审核" prop="unchecked" :resizable="false"></el-table-column>
						<el-table-column align="center" label="审核通过" prop="approved" :resizable="false"></el-table-column>
						<el-table-column align="center" label="审核不通过" prop="unapproved" :resizable="false"></el-table-column>
						<el-table-column align="center" label="问票中" prop="ticketCount" :resizable="false"></el-table-column>
						
						<el-table-column align="center" label="发票未入账-问票" prop="notInAccountAndQuestionCount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="发票未入账-非问票" prop="notInAccountAndNotQuestionCount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="发票已入账" prop="inAccountCount" :resizable="false"></el-table-column>
					</el-table-column>

					<!-- <el-table-column align="center" label="状态"  :resizable="false">
						<template slot-scope="scope">
							<span v-show="scope.row.accountantTransferedCtStatus == 1 && scope.row.accountantIsCurrentPeriod == 1 && scope.row.accountantUncheckCount == 0 && scope.row.unDistributionCount == 0 && scope.row.unchecked == 0">未结账</span>
							<span v-show='scope.row.accountantReverseStatus == 1'>已结账</span>
							
							
							
						</template>
					</el-table-column> -->

					<el-table-column align="center" label="凭证状态"  :resizable="false">
						<template slot-scope="scope">
							
							<span v-show='scope.row.voucherState == 3'>已结账</span>
							<span v-show='scope.row.voucherState == 2'>未结账</span>
							
						</template>
					</el-table-column>
					<el-table-column align="center" label="初审状态"  :resizable="false">
						<template slot-scope="scope">
							
							<span v-show='scope.row.firstCheckState == 0'>未初审</span>
							<span v-show='scope.row.firstCheckState == 1'>已初审</span>
							
						</template>
					</el-table-column>
					<el-table-column align="center" label="发票提交时间" prop="lastSubmitTime">
						<template slot-scope="scope">
							<span>{{scope.row.lastSubmitTime?formatTimeToStr(scope.row.lastSubmitTime,'yyyy-MM-dd'):'--'}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" :resizable="false" width="200">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
							<el-button size="mini" type="text" @click="handlePass(scope.$index, scope.row)" v-show='scope.row.firstCheckState == 0'>初审通过</el-button>
							<el-button size="mini" type="text" @click="showJzDialog(scope.$index, scope.row)" v-show='scope.row.accountantTransferedCtStatus == 1 && scope.row.accountantIsCurrentPeriod == 1 && scope.row.accountantUncheckCount == 0 && scope.row.unDistributionCount == 0 && scope.row.unchecked == 0 && scope.row.firstCheckState == 1'>结账</el-button>
							<el-button size="mini" type="text" @click="handleJZcost(scope.$index, scope.row)" v-show="scope.row.accountantIsCurrentPeriod == 1 && scope.row.accountantNeedTransCtStatus == 1">结转成本</el-button>
							<!-- <el-button size="mini" type="text" @click="handleJZcost(scope.$index, scope.row)">结转成本</el-button> -->
							<el-button size="mini" type="text" @click="handleReverse(scope.$index, scope.row)" v-show="scope.row.accountantReverseStatus == 1">反结账</el-button>
							<el-button size="mini" type="text" @click="handleJump(scope.$index, scope.row)">查看会计分录序时簿</el-button>
							<el-button size="mini" type="text" @click="handleRecord(scope.$index, scope.row)">信息记录</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>
		</div>


		<el-dialog title="结账预览" :visible.sync="dialogVisible1" width="1200px" class='dialog' :show-close='false'
		 :close-on-press-escape='false' :close-on-click-modal='false'>
			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="凭证字号" prop='fNumber_fBrNo'></el-table-column>
				<el-table-column align="center" label="会计期间" prop='fPeriod'></el-table-column>
				<el-table-column align="center" label="分录号" prop='fEntryID'></el-table-column>
				<el-table-column align="center" label="摘要" prop='fExplanation' width="250"></el-table-column>
				<el-table-column align="center" label="科目代码" prop='fNumber_account'></el-table-column>
				<el-table-column align="center" label="科目名称" prop='fFullName' width="250"></el-table-column>
				<el-table-column align="center" label="借方(元)" prop='fDebit_string'></el-table-column>
				<el-table-column align="center" label="贷方(元)" prop='fCredit_string'></el-table-column>
				<el-table-column align="center" label="备注" prop='fRowNumber'></el-table-column>
				<!-- <el-table-column align="center" label="本年累计数" prop="fYtdAmount">
					<template slot-scope="scope">
						<span v-html='scope.row.fYtdAmount'></span>
					</template>
				</el-table-column> -->

			</el-table>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog" v-loading='loading10'>终止结账</el-button>
				<el-button type="primary" @click="continueJZ" v-loading='loading11'>继续结账</el-button>
			</span>
			<!-- <div class='btn_contain clearfix'>
				<span class='close' @click="hideDialog" style='margin-right:10px;'>终止结账</span>
				<span class='commit' @click="continueJZ">继续结账</span>
			</div> -->
		</el-dialog>

		<el-dialog title="结账" :visible.sync="dialogVisible2" width="400px" class='dialog' :before-close="handleClose">
			<el-form :inline="true" ref="ruleForm1" :model="formInline" class="demo-form-inline" label-width="60px" size="mini">
				<el-form-item label="公司" prop="item" :rules="[$rules.requiredSelect]" class='uploadItem'>
					<!-- <el-autocomplete class="inline-input" v-model="uploadData.customerName" :fetch-suggestions="querySearch"
						 placeholder="请输入客户名称" @select="handleSelect"></el-autocomplete> -->
					<el-select v-model="formInline.item" placeholder="请选择公司名称" filterable value-key='customerId' @change="getProofTVoucher">
						<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>
						<!-- <el-option v-for="item in ces" :label="item.customerName" :value='item'></el-option> -->
					</el-select>
				</el-form-item>
				<el-form-item label="账期" prop="accountPeriod">
					<el-date-picker v-model="formInline.accountPeriod" type="month" value-format='yyyy-MM' format="yyyy-MM" disabled>
					</el-date-picker>
				</el-form-item>

			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="showJzDialog(1,formInline,1)">结账</el-button>
				<!-- <el-button type="primary" @click="continueJZ" v-loading='loading11'>继续结账</el-button> -->
			</span>
			<!-- <div class='btn_contain clearfix'>
				<span class='close' @click="hideDialog" style='margin-right:10px;'>终止结账</span>
				<span class='commit' @click="continueJZ">继续结账</span>
			</div> -->
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				trueLabel: 1,
				falseLabel: 0,
				detail: [],
				color: [
					"#409EFF", "#67C23A", "#E6A23C", "#F56C6C"
				],
				uploadData: {
					isMax: 1
				},
				list: [{}, {}],
				fileList: [],
				loading: false,
				loading1: false,
				nameData: ['审核通过', '审核未通过', '未审核'],
				formInline: {},
				dialogVisible: false,
				servItemList: [],
				itemList: [],
				total: 0,
				pageSize: 10,
				currentPage: 1,
				trueOrFalse: [{
						label: "是",
						value: 1,
					},
					{
						label: "否",
						value: 0,
					}
				],
				iscomeorgov: [],
				contractTypeList: [],
				contractTaxTypeList: [],
				customerList: [],
				taxmethodList: [],
				customertypeList: [],
				employList: [],
				dialogVisible1: false,
				dialogVisible2: false,
				tableData: [],
				jzfYear: '',
				jzfPeriod: '',
				jzfBrNo: '',
				loading10: false,
				loading11: false,
				isMax: 1,
				voucherState:'',
				firstCheckState:'',
				custList:[],
				uuid:''


			}
		},
		components: {},
		methods: {
			getProofTVoucher(val) {
				let params = {
					"fBrNo": val.customerName
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVoucher', this.qs.stringify(params), {
						// this.axios.post('/miaoxing/queryPage', params)
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					.then(res => {
						if (res.data.code == 200) {
							this.$set(this.formInline, 'accountPeriod', res.data.data.ftransdate_temp.slice(0, 4) + '-' + res.data.data.ftransdate_temp
								.slice(5, 7));
							// this.detail.accountPeriod = res.data.data.ftransdate_temp.slice(0,4) + '-' + res.data.data.ftransdate_temp.slice(5,7);
							console.log(this.detail.accountPeriod)
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
			showJzDialog(index, row, tag) {
				if (tag != 1) {
					this.jzfYear = row.accountPeriod.slice(0, 4);
					this.jzfPeriod = parseFloat(row.accountPeriod.slice(5, 7));
					this.jzfBrNo = row.customerName;
					this.$confirm('<p>确认结账？</p><p>' + row.accountPeriod.slice(0, 4) + '年' + row.accountPeriod.slice(5, 7) + '期</p>',
						'结账', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							dangerouslyUseHTMLString: true
							// type: 'warning'
						}).then(() => {
						this.dialogVisible1 = true;
						this.loading = true;
						let params = {
							"fYear": row.accountPeriod.slice(0, 4),
							"fPeriod": parseFloat(row.accountPeriod.slice(5, 7)),
							"fBrNo": row.customerName
						};
						this.axios.post('/perTaxToolTwo/e9/tVoucherCheckout/autoCheckoutAndCounter', this.qs.stringify(params))
							// this.axios.post('/miaoxing/queryPage', params)
							.then(res => {
								if (res.data.code == 200) {
									this.uuid = res.data.data;
									let params = {
										"uuid":res.data.data,
										"fYear": row.accountPeriod.slice(0, 4),
										"fPeriod": parseFloat(row.accountPeriod.slice(5, 7)),
										// "fBrNo": this.uploadData.fBrNo,
										"fBrNo": row.customerName,
									};
									this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVoucherForCheck', this.qs.stringify(params))
										// this.axios.post('/miaoxing/queryPage', params)
										.then(res => {
											this.loading = false;
											if (res.data.code == 200) {

												this.tableData = res.data.data;
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
											this.loading = false;
											this.$message({
												message: "系统繁忙，请稍后重试",
												type: "error"
											});
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
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消结账'
						});
					});
				} else {
					this.jzfYear = row.accountPeriod.slice(0, 4);
					this.jzfPeriod = parseFloat(row.accountPeriod.slice(5, 7));
					this.jzfBrNo = row.item.customerName;
					this.$confirm('<p>确认结账？</p><p>' + row.accountPeriod.slice(0, 4) + '年' + row.accountPeriod.slice(5, 7) + '期</p>',
						'结账', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							dangerouslyUseHTMLString: true
							// type: 'warning'
						}).then(() => {
						this.dialogVisible1 = true;
						this.dialogVisible2 = false;
						this.loading = true;
						let params = {
							"fYear": row.accountPeriod.slice(0, 4),
							"fPeriod": parseFloat(row.accountPeriod.slice(5, 7)),
							"fBrNo": row.item.customerName
						};
						this.axios.post('/perTaxToolTwo/e9/tVoucherCheckout/autoCheckoutForNoVoucher', this.qs.stringify(params))
							// this.axios.post('/miaoxing/queryPage', params)
							.then(res => {
								if (res.data.code == 200) {
									this.uuid = res.data.data;
									let params = {
										'uuid':res.data.data,
										"fYear": row.accountPeriod.slice(0, 4),
										"fPeriod": parseFloat(row.accountPeriod.slice(5, 7)),
										// "fBrNo": this.uploadData.fBrNo,
										"fBrNo": row.item.customerName,
									};
									this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVoucherForCheck', this.qs.stringify(params))
										// this.axios.post('/miaoxing/queryPage', params)
										.then(res => {
											this.loading = false;
											if (res.data.code == 200) {

												this.tableData = res.data.data;
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
											this.loading = false;
											this.$message({
												message: "系统繁忙，请稍后重试",
												type: "error"
											});
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
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消结账'
						});
					});
				}

				// this.fBrNo = this.uploadData.fBrNo;
				// this.innerVisible1 = true;
			},
			
			exportExcel() {
				let params = {
					isMax: this.isMax,
					voucherState: this.voucherState,
					customerId: this.customerId?this.customerId:'',
					accountPeriod: this.accountPeriod?this.accountPeriod:'',
					firstCheckState: this.firstCheckState
				
				};
				this.axios.post('/perTaxToolTwo/iocr/main/exportExcel', this.qs.stringify(params), {
						responseType: 'blob',
					})
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
				
							let link = document.createElement("a");
							link.href = window.URL.createObjectURL(new Blob([res.data]));
							link.target = "_blank";
							link.download = "凭证审核列表.xls";
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
				// window.location.href = '/perTaxToolTwo/iocr/main/exportExcel?customerId=' + this.customerId?this.customerId:'' + '&accountPeriod=' + this.accountPeriod?this.accountPeriod:'' +
				// 	'&isMax=' + this.isMax + '&voucherState=' + this.voucherState + '&firstCheckState=' + this.firstCheckState;
			
			
			},
			search() {
				this.customerId = this.uploadData.customerId;
				this.accountPeriod = this.uploadData.accountPeriod;
				this.isMax = this.uploadData.isMax;
				this.voucherState = this.uploadData.voucherState;
				this.firstCheckState = this.uploadData.firstCheckState;
				this.queryListByPage();
			},

			queryListByPage() {
				this.loading1 = true;
				let param = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						"customerId": this.customerId,
						"accountPeriod": this.accountPeriod,
						"isMax": this.isMax,
						"voucherState": this.voucherState,
						"firstCheckState": this.firstCheckState,
						// "document_type": 1,
						// "state": 1
					}
				};
				this.axios.post('/perTaxToolTwo/iocr/main/selectApproveAll', param).then(res => {
					this.loading1 = false;
					if (res.data.code == 200) {
						this.detail = res.data.data;
						this.total = res.data.count;

					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading1 = false;
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleSelectionChange1(val) {
				this.multipleSelection1 = val;
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage();
			},


			reset() {
				this.form2 = {};
			},
			
			handleClose(){
				this.formInline = {};
				this.dialogVisible2 = false;
			},

			addChild() {
				this.dialogVisible2 = true;
			},

			handleDetail(index, row) {
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/invoiceApprove', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						// id: row.mainId,
						customerId: row.customerId,
						accountPeriod: row.accountPeriod,
						customerName: row.customerName,
					}
				})
			},

			handleReverse(index, row) {
				this.$confirm('确定反结账?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = {
						"fBrNo": row.customerName,

					};
					this.axios.post('/perTaxToolTwo/e9/tVoucherCheckout/createReverseVoucherCheckout', this.qs.stringify(param)).then(
						res => {
							if (res.data.code == 200) {
								this.queryListByPage();
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
							message: '反结账',
							type: 'error'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},
			
			handleJump(index, row){
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/tvoucherentryQuery', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						// id: row.mainId,
						customerId: row.customerId,
						accountPeriod: row.accountPeriod,
						customerName: row.customerName,
					}
				})
			},
			
			handleRecord(index, row){
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/noteRecord', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						// id: row.mainId,
						customerId: row.customerId,
						accountPeriod: row.accountPeriod,
						customerName: row.customerName,
					}
				})
			},
			
			handlePass(index, row) {
				this.$confirm('确定初审通过?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = {
						"mainId": row.mainId,
						firstCheckState:1,

					};
					this.axios.post('/perTaxToolTwo/app/iocr/main/submitUpload', this.qs.stringify(param)).then(
						res => {
							if (res.data.code == 200) {
								this.queryListByPage();
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
							message: '设置失败',
							type: 'error'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},

			handleJZcost(index, row) {
				this.$confirm('确定结转成本?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = {
						"fBrNo": row.customerName,
						"year": row.accountPeriod.slice(0, 4),
						"mon": row.accountPeriod.slice(5, 7),

					};
					this.axios.post('/perTaxToolTwo/e9/acct/transferCost', this.qs.stringify(param)).then(res => {
						if (res.data.code == 200) {
							this.queryListByPage();
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
							message: '反结账',
							type: 'error'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},

			handleJZ() {
				this.formInline = {};
				this.dialogVisible2 = true;
				
			},


			hideDialog() {
				this.loading10 = true;
				let param = {
					"uuid": this.uuid,
					"fBrNo": this.jzfBrNo
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucherCheckout/terminateVoucherCheckout', this.qs.stringify(param)).then(res => {
					this.loading10 = false;
					if (res.data.code == 200) {
						this.dialogVisible1 = false;
						this.queryListByPage();
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
					this.loading10 = false;
					this.$message({
						message: '终止结账失败',
						type: 'error'
					});
				})
			},
			continueJZ() {
				this.loading11 = true;
				let param = {
					"fYear": this.jzfYear,
					"fPeriod": this.jzfPeriod,
					"fBrNo": this.jzfBrNo,
					"uuid":this.uuid,
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucherCheckout/autoCheckoutContinue', this.qs.stringify(param)).then(res => {
					this.loading11 = false;
					if (res.data.code == 200) {
						this.dialogVisible1 = false;
						this.queryListByPage();
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
					this.loading11 = false;
					this.$message({
						message: '获取合同列表失败',
						type: 'error'
					});
				})
			},
			getAssignmentCustomer(){
				let params = {
					"stepName": 1
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
		watch: {
			'$route'(to, from) {
				// init data
				if (to.name == 'invoiceDetail') {
					this.queryListByPage();
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
			this.queryListByPage();
			// var updateUser = JSON.parse(sessionStorage.getItem('updateUser'));
			// var userTypeId = updateUser.userTypeId;
			
			// if(userTypeId == 1){
			// 	this.custList = JSON.parse(sessionStorage.getItem('updateCust'));
			// }else{
			// 	this.getAssignmentCustomer();
			// }
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

		.left_contain {
			// width: 100%;
			height: 100%;
			position: relative;
			// padding:0px 20px;
			background: #fff;
			margin: 20px 20px;
			box-sizing: border-box;
		}

		.right_contain {
			height: 100%;
			float: right;
			width: 500px;
			background: #fff;
			padding: 0 12px;
			box-sizing: border-box;

			h3 {
				color: #409EFF;
				height: 40px;
				line-height: 40px;
			}

			/deep/ .el-form-item__content {
				width: 135px
			}

			/deep/ .el-date-editor.el-input {
				width: 100px
			}
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

	.contain_header {
		height: 2rem;
		padding: 0px 30px;
		background: url(../../assets/img/list-bg1.png) no-repeat;
		background-size: cover;
		border-top-left-radius: 0.06rem;
		border-top-right-radius: 0.06rem;
		position: relative;

		/deep/ input::-webkit-input-placeholder {
			/* placeholder颜色  */
			color: #fff;
		}

		/deep/ .el-select__caret {
			color: #fff
		}

		.title {
			font-size: 0.24rem;
			height: 1rem;
			line-height: 1.24rem;
			color: #fff;
		}

		/deep/ .el-button {
			color: #43b3db;
		}

		/deep/ .el-range-input {
			color: #fff;
			background: transparent
		}

		/deep/ .el-range-separator {
			color: #fff;
		}

		/deep/ .el-range__icon {
			color: #fff;
		}

		/deep/ .el-form-item--mini .el-form-item__label {
			color: #fff;
		}

		/deep/ .el-form {
			margin-top: 0.1rem
		}

		/deep/ .el-input__inner {
			background: transparent;
			color: #fff;
			border: 1px solid #fff;
		}

		/deep/ .el-input__inner:hover {
			border-color: #fff;
		}

		/deep/ .el-input.is-active .el-input__inner,
		/deep/ .el-input__inner:focus {
			border-color: #fff;
			outline: 0;
		}
	}

	.contain_body {
		position: relative;
		// padding:0px 20px;
		background: #fff;
		margin: 20px 20px;

		.el-tabs {
			height: 100%;
		}

	}

	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
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

	/deep/ .el-table th {
		background-color: #ebf6fb;
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

	/deep/ .el-checkbox {
		color: #fff;
	}

	/deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
		color: #fff;
	}
</style>
