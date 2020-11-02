<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>年终汇算</el-breadcrumb-item>
			<el-breadcrumb-item>汇算票据跟踪</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>

				<el-form inline :model="uploadData" class="demo-form-inline" size="small" ref='formName'>
					<el-form-item label="客户名称" prop="customerId">
						<el-select v-model="uploadData.customerId" placeholder="请选择" filterable clearable>
							<el-option v-for="item in $store.state.cust" :key="item.customerId" :label="item.customerName" :value="item.customerId">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="账期" prop="accountPeriod">
						<el-date-picker v-model="uploadData.accountPeriod" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM">
						</el-date-picker>

					</el-form-item>


					<el-form-item label="执行状态" prop="workFlowExecuteStatus">
						<el-select v-model="uploadData.workFlowExecuteStatus" placeholder="请选择" filterable clearable>
							<el-option v-for="item in executeStatusList" :key="item.value" :label="item.label" :value="item.value">
							</el-option>
						</el-select>

					</el-form-item>
					<el-button type="primary" @click='search()' size="small">搜索</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<div style="text-align: center;" class="clearfix">

				<el-button class="el-icon-refresh" type='text' size="mini" @click='refresh()' style='float:right'>刷新</el-button>
			</div>



			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" border v-loading='loading'>

				<el-table-column align="center" label="客户名称" prop="customerName"></el-table-column>
				<el-table-column align="center" label="账期" prop="accountPeriod"></el-table-column>

				<el-table-column align="center" label="开始时间" prop="startTime">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.startTime,'yyyy-MM-dd') }}</span>

					</template>
				</el-table-column>

				<el-table-column align="center" label="提醒客户发票提供时间" prop="timeRemindCustomerProvideInvoice"></el-table-column>

				<el-table-column align="center" label="收费状态" prop="erpChargeSign">
					<template slot-scope="scope">
						<span v-show='scope.row.erpChargeSign == 0'>未收费</span>
						<span v-show='scope.row.erpChargeSign == 1'>已收费</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="执行状态" prop="workFlowExecuteStatus">
					<template slot-scope="scope">
						<span v-show='scope.row.workFlowExecuteStatus == 0'>未开始</span>
						<span v-show='scope.row.workFlowExecuteStatus == 1'>执行中</span>
						<span v-show='scope.row.workFlowExecuteStatus == 2'>已完成</span>
						<span v-show='scope.row.workFlowExecuteStatus == 3'>删除</span>
						<span v-show='scope.row.workFlowExecuteStatus == 4'>申报依据</span>
					</template>
				</el-table-column>


				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" v-show="scope.row.erpChargeSign == 0" @click="handlePass(scope.$index, scope.row, 1)">收费</el-button>
						<el-button size="mini" type="text" @click="handleEntry(scope.$index, scope.row)">入账</el-button>
						<el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">查看票据</el-button>
					</template>
				</el-table-column>

				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>上传</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="primary" v-show="scope.row.workFlowExecuteStatus == 1" @click="handleEdit(scope.$index, scope.row)">上传汇算票据</el-button>


					</template>
				</el-table-column>

			</el-table>
		</div>

		<el-dialog title="上传" :visible.sync="dialogVisible" width="500px" class='dialog'>

			<el-form inline ref="ruleForm1" :model="detail" class="demo-form-inline" label-width="120px" size="mini">
				<el-form-item label="客户名称" prop="customerName">
					<el-input v-model="detail.customerName" disabled></el-input>
				</el-form-item>
				<el-form-item label="汇算账期" prop="settlementPeriod">
					<el-input v-model="detail.settlementPeriod" disabled></el-input>

				</el-form-item>

				<el-form-item label="凭证类型" prop="documentType" :rules="[$rules.requiredSelect]">
					<el-select v-model="detail.documentType" placeholder="请选择" filterable>
						<el-option v-for="item in documentTypeList" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="汇算发票类型" prop="settlementType" :rules="[$rules.requiredSelect]">
					<el-select v-model="detail.settlementType" placeholder="请选择" filterable>
						<el-option label="实物发票" value='1'></el-option>
						<el-option label="账务调整" value='2'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发票" prop="fileList" class='uploadItem'>
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove1" :on-change="onChange1" action='#'
					 :auto-upload="false" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList1">
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>

				</el-form-item>
				<div style="width: 100%;"></div>
				<el-form-item label="发票说明" prop="fileList" class='uploadItem' v-if="detail.settlementType == '1'">
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove2" :on-change="onChange2" action='#'
					 :auto-upload="false" :before-remove="beforeRemove" multiple :limit="1" :file-list="fileList2">
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>

				</el-form-item>


				<el-form-item label="账务调整凭证号" prop="adjustAccountantNo" v-if="detail.settlementType == '2'">
					<el-input v-model="detail.adjustAccountantNo"></el-input>
				</el-form-item>
				<el-form-item label="账务调整账期" prop="adjustAccountantNo" v-if="detail.settlementType == '2'">
					<el-date-picker v-model="detail.adjustAccountantNo" type="month" value-format='yyyy-MM' format="yyyy-MM">
					</el-date-picker>

				</el-form-item>
				<el-form-item label="账务调整发票号" prop="adjustInvoiceNumber" v-if="detail.settlementType == '2'">
					<el-input v-model="detail.adjustInvoiceNumber"></el-input>
				</el-form-item>
				<el-form-item label="账务调整金额" prop="adjustInvoiceAmount" v-if="detail.settlementType == '2'">
					<el-input v-model="detail.adjustInvoiceAmount"></el-input>

				</el-form-item>




			</el-form>

			<span slot="footer" class="dialog-footer">


				<!-- <el-button @click="nosubmit">取消</el-button> -->
				<el-button type="primary" @click="commitUpload">确定</el-button>
			</span>
		</el-dialog>


		<el-dialog title="入账" :visible.sync="dialogVisible1" width="400px">
			<p style="line-height: 20px;">
				<i class="el-icon-warning" style="color: #e6a23c;font-size: 20px;margin-right: 8px;"></i><label style="height: 20px;display: inline-block;line-height: 20px;">确认入账？</label>
			</p>
			<p style="margin-top: 20px;">
				<label for="" style="margin-right: 20px;">入账账期</label>
				<el-date-picker v-model="ruzhangaccountPeriod" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM"
				 size="mini">
				</el-date-picker>
			</p>

			<span slot="footer" class="dialog-footer">


				<el-button @click="nosubmit">取消</el-button>
				<el-button type="primary" @click="commitEntry">确定</el-button>
			</span>


		</el-dialog>



	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				dialogVisible1: false,
				ruzhangaccountPeriod: '',
				dialogVisible: false,
				detail: {},
				form3: {},
				fileList2: [],
				fileList1: [],
				loading: false,
				accountPeriod: '',

				uploadData: {
					accountPeriod: '',
					workFlowExecuteStatus: 1
				},
				customerId: '',
				tableData: [],

				workFlowExecuteStatus: 1,
				executeStatusList: [{
						label: '未开始',
						value: 0
					},
					{
						label: '执行中',
						value: 1
					},
					{
						label: '已完成',
						value: 2
					},
					{
						label: '删除',
						value: 3
					},
					{
						label: '申报依据',
						value: 4
					},
				],
				documentTypeList: [

					{
						label: "费用",
						value: "1"
					},
					{
						label: "成本",
						value: "2"
					}
				],
			}
		},
		components: {},
		methods: {
			nosubmit() {
				this.dialogVisible1 = false;
			},
			resetForm() {
				this.uploadData = {};
			},

			refresh() {
				this.queryPage()
			},
			handleRemove1(file, fileList) {
				console.log(file, fileList);
				this.fileList1 = fileList;
			},
			onChange1(file, fileList) { //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
				let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
				if (existFile) {
					this.$message.error('当前文件已经存在!');
					fileList.pop()
				}
				this.fileList1 = fileList
			},
			handleRemove2(file, fileList) {
				console.log(file, fileList);
				this.fileList2 = fileList;
			},
			onChange2(file, fileList) { //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
				let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
				if (existFile) {
					this.$message.error('当前文件已经存在!');
					fileList.pop()
				}
				this.fileList2 = fileList
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			commitUpload() {
				if (this.detail.settlementType == '1' && this.fileList2.length == 0) {
					this.$message({
						message: '请选择发票说明',
						type: 'error'
					});
				} else if (this.fileList1.length == 0) {
					this.$message({
						message: '请选择发票',
						type: 'error'
					});
				} else {
					this.$refs['ruleForm1'].validate((valid) => {
						if (valid) {
							var _this = this;
							var formData = new FormData(); //  用FormData存放上传文件

							if (this.detail.settlementType == 1) {

								this.fileList2.forEach(file => {
									formData.append('explain', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
							}



							formData.append('invoicePicture', _this.fileList1[0].raw, _this.fileList1[0].raw.name);
							// formData.append('settlementPeriod', _this.detail.accountPeriod);

							console.log(formData);
							for (var x in _this.detail) {
								formData.append(x, _this.detail[x]);
							}
							this.axios
								.post("/perTaxToolTwo/iocr/identify/uploadSettlementPicture", formData, {
									headers: {
										'Content-Type': 'application/x-www-form-urlencoded'
									}
								}).then(res => { //手动上传貌似无法触发成功或失败的钩子函数，因此这里手动调用 
									if (res.data.code == 200) {
										this.reset();

										this.dialogVisible = false;
										this.queryPage();

										this.$message({
											message: res.data.msg,
											type: 'success'
										});
									} else {
										this.fileList1 = [];
										this.fileList2 = [];
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
								}).catch(err => {
									this.fileList1 = [];
									this.fileList2 = [];
									this.$message({
										message: "系统繁忙，请稍后重试",
										type: "error"
									});
								})
						} else {
							console.log('error submit!!');
							return false;
						}
					})
				}


			},

			commitEntry() {
				let params = {
					"accountPeriod": this.ruzhangaccountPeriod,
					"customerId": this.form3.customerId,
					"taxDeclarationType": this.form3.taxesTaxType,
					"customerName": this.form3.customerName,
					"settlementPeriod": this.form3.accountPeriod,
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/settlementEnterAcct', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible1 = false;
							this.queryPage();
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
			reset() {
				this.detail.documentType = '';
				this.fileList1 = [];
				this.fileList2 = [];
			},

			search() {
				this.customerId = this.uploadData.customerId;
				this.accountPeriod = this.uploadData.accountPeriod;

				this.workFlowExecuteStatus = this.uploadData.workFlowExecuteStatus;
				this.queryPage()
			},



			queryPage() {
				this.loading = true;
				let params = {
					"row": this.pageSize,
					"page": this.currentPage,
					"data": {
						"customerId": this.customerId,
						"accountPeriod": this.accountPeriod,
						"workFlowStepName": '汇算票据跟踪',
						"workFlowExecuteStatus": this.workFlowExecuteStatus,

					}

				};
				this.axios.post('/perTaxToolTwo/e9z/businessAdjustmentExpensesInfo/getByCondition', params)
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
							this.tableData = [];
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
						this.tableData = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},


			handleDetail(index,row){
				this.$router.push({ //核心语句
					path: '/accountFactory/settleResult', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						// id: row.mainId,
						accountPeriod: row.accountPeriod,
						// state: row.state
						// accountPeriod: row.accountPeriod,
						customerId: row.customerId,
						customerName: row.customerName
					}
				})
			},


			handlePass(index, row, tag) {
				this.$confirm('是否确认该客户已收取年度汇算调账费用？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						id: row.adjustmentExpensesInfoId,
						erpChargeSign: 1,


					};
					this.axios.post('/perTaxToolTwo/e9z/businessAdjustmentExpensesInfo/update', params)
						.then(res => {
							this.loading = false;
							if (res.data.code == 200) {
								this.queryPage();
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
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});

			},


			handleEdit(index, row) {
				this.dialogVisible = true;
				this.detail = JSON.parse(JSON.stringify(row));
				this.$set(this.detail, 'settlementPeriod', row.accountPeriod)
			},

			getProofTVoucher(val) {
				let params = {
					"fBrNo": val.customerName,
					acctNo: JSON.parse(sessionStorage.getItem('updateUser')).accountNo
				};
				// this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVoucher', this.qs.stringify(params), {
				this.axios.post('/perTaxToolTwo/import/e9/tVoucher/getProofTVoucher', this.qs.stringify(params), {
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					.then(res => {
						if (res.data.code == 200) {
							var currentPeriod = new Date(res.data.data.currentPeriod.replace(/-/g, "/"));
							var fPeriod = new Date(res.data.data.fyear + '/' + res.data.data.fperiod);
							if (currentPeriod.getTime() <= fPeriod.getTime()) {
								this.ruzhangaccountPeriod = res.data.data.fyear + '-' + (res.data.data.fperiod < 10 ? '0' + Number(res.data.data
									.fperiod) : res.data.data.fperiod);

							} else {
								this.ruzhangaccountPeriod = res.data.data.currentPeriod;
							}
							// this.$set(this.detail, 'accountPeriod', res.data.data.ftransdate_temp.slice(0, 4) + '-' + res.data.data.ftransdate_temp
							// 	.slice(5, 7));
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

			handleEntry(index, row) {
				this.dialogVisible1 = true;
				this.form3 = JSON.parse(JSON.stringify(row));
				this.getProofTVoucher(row)
				// this.$confirm('确认入账？', '提示', {
				// 	confirmButtonText: '确定',
				// 	cancelButtonText: '取消',
				// 	type: 'warning'
				// }).then(() => {
				// 	let params = row;
				// 	// {
				// 	// 	"accountPeriod":"2020-05",
				// 	// 	"customerId":"jz17951",
				// 	// 	"taxDeclarationType":"233",
				// 	// 	"customerName":"南京尊音科技有限公司",
				// 	// 	"settlementPeriod":"2019-12"
				// 	// }
				// 	this.axios.post('/perTaxToolTwo/iocr/identify/settlementEnterAcct', params)
				// 		.then(res => {
				// 			this.loading = false;
				// 			if (res.data.code == 200) {
				// 				this.queryPage();
				// 				this.$message({
				// 					message: res.data.msg,
				// 					type: 'success'
				// 				});
				// 			} else {
				// 				let type;
				// 				if (res.data.code == 0) {
				// 					type = "warning";
				// 				} else if (res.data.code == 500) {
				// 					type = "error";
				// 				}
				// 				this.$message({
				// 					message: res.data.msg,
				// 					type: type
				// 				});
				// 			}
				// 		})
				// 		.catch(err => {
				// 			this.$message({
				// 				message: "系统繁忙，请稍后重试",
				// 				type: "error"
				// 			});
				// 		});
				// }).catch(() => {
				// 	this.$message({
				// 		type: 'info',
				// 		message: '已取消删除'
				// 	});
				// });
			}






		},
		computed: {},
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
			height: 40px;
			line-height: 39px;
			padding-left: 20px;
			/* background-color: #fff; */
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box
		}

		/deep/ .el-form-item.uploadItem {
			position: relative;
		}

		/deep/ .el-table td,
		/deep/ .el-table th {
			padding: 6px 0;
		}

		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 30px;
			background-color: #f9f9f9;
		}

		/deep/ .el-table th {
			background-color: #f9f9f9;
		}

		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #f9f9f9;
		}

		/deep/ .el-table__body tr,
		.el-table__body td {
			padding: 0;
			height: 30px;
			background-color: #fff;
		}

		/deep/ .el-table__body tr.el-table__row--striped {
			background-color: #f9f9f9;
		}

		/deep/ .el-table thead {
			color: #8C8C8C;
		}

		/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
			background-color: #efe9e5;
		}

		/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
			border-bottom-color: #fff;
			background: #f9f9f9;
		}

		.search_contain {
			background: #fff;
			height: 40px;
			/* padding-left: 20px; */
			padding: 0.3rem 20px;
			margin: 0px 20px 10px;

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
			margin: 12px 20px 20px;
			padding: 12px 20px 20px;
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

	/deep/ .el-select {
		width: 180px;
	}

	.active-select {
		border-color: #409EFF !important;
		background-color: #409EFF !important;
		color: #fff !important
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
