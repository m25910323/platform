<template>
	<div class='main clearfix' ref='main'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>凭证管理</el-breadcrumb-item>
			<el-breadcrumb-item>会计分录序时簿</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="单位名称" prop="fBrNo">
						<el-select v-model="uploadData.fBrNo" placeholder="请选择" clearable filterable @change='getProofTVoucher' value-key="customerId">
							<el-option v-for="item in periodCustList" :label="item.customerName" :value='item'></el-option>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option> -->
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
			<h5>合计分录明细</h5>
			<p>
				单位名称：{{customerName}}
				<div v-if="canOperate">
					<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='exportExcel()' style='float:right;margin-left:10px'>导出</el-button>
				</div>
				<div v-if="!canOperate">
					<el-button type='text' size="mini" :disabled="!(temYear1 == fYearStart && temMonth1 == fPeriodStart && temYear1 == year && temMonth1 == month)"
					 @click='handleReserve()' style="float:right;margin-left:10px">反过账</el-button>
					<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='handleEdit()' style="float:right;margin-left:10px">凭证字号整理</el-button>
					<el-button type='text' size="mini" :disabled="multipleSelection.length != 1" @click='LODOP_print_alone()' style='float:right;margin-left:10px'>单张打印</el-button>
					<el-button type='text' size="mini" :disabled="multipleSelection.length <= 1" @click='LODOP_print_checked()' style='float:right;margin-left:10px'>连续打印</el-button>
					<el-button type='text' size="mini" :disabled="tableData.length <= 0" @click='exportExcel()' style='float:right;margin-left:10px'>导出</el-button>
					
					<el-button type='text' size="mini" :disabled="multipleSelection.length <= 0" @click='handleNoApprove()' style='float:right;margin-left:10px'>反审核</el-button>
					<el-button type='text' size="mini" :disabled="multipleSelection.length <= 0" @click='handleApprove()' style='float:right;margin-left:10px'>审核</el-button>
				</div>
				
			</p>


			<el-table :data="tableData" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading'
			 @selection-change="handleSelection">
				<el-table-column align="center" type="selection" width="55" :selectable='checkboxT'></el-table-column>
				<el-table-column align="center" label="日期" prop="fDate_string"></el-table-column>
				<el-table-column align="center" label="会计期间" prop='fPeriod'></el-table-column>
				<el-table-column align="center" label="凭证字号" prop="fNumber_fBrNo"></el-table-column>
				<el-table-column align="center" label="分录号" prop="fEntryID"></el-table-column>
				<el-table-column align="center" label="摘要" prop='fExplanation' width="300"></el-table-column>
				<el-table-column align="center" label="科目代码" prop="fNumber_account">
					<template slot-scope="scope">
						<span v-if='scope.row.fNumber_account'>{{scope.row.fNumber_account}}</span>
						<div v-if='!scope.row.fNumber_account && scope.$index != tableData.length-1' style="width: 100%;height: 100%;background: #F56C6C;">&nbsp;</div>
					</template>
				</el-table-column>
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

				<el-table-column align="center" label="操作" width="140" v-if="!canOperate">
					<template slot-scope="scope">
						<el-button @click='modify(scope.row)' type='text' size="mini" v-show='scope.row.fPosted == 0 && scope.row.fChecked == 0'>修改</el-button>
						<el-button @click='showInvoice(scope.row)' type='text' size="mini" v-show='scope.row.fPosted != 100'>查看关联发票</el-button>
						<el-button @click='deleteOne(scope.row)' type='text' size="mini" v-show='isRole && (scope.row.billSourceType == 0 || scope.row.billSourceType == 2 && (scope.row.fInternalInd == "Wage" || scope.row.fInternalInd == "Tax")) && scope.row.fExplanation && scope.row.fPosted == 0 && scope.row.fChecked == 0'>删除</el-button>
						<el-button @click='handleCopy(scope.row,0)' type='text' size="mini" v-show='scope.row.fPosted != 100'>复制</el-button>
						<el-button @click='handleCopy(scope.row,1)' type='text' size="mini" v-show='scope.row.fPosted != 100'>红冲</el-button>
					</template>
				</el-table-column>

			</el-table>
			<el-pagination background @current-change="((val)=>{handleCurrentChange(val)})" :current-page="currentPage"
			 :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>

		</div>

		<el-dialog width="700px" title="电子发票预览" :visible.sync="dialogVisible">
			<img :src='img' alt="" style="width: 660px;">
		</el-dialog>

		<el-dialog title="凭证字号整理" :visible.sync="dialogVisible_2" width="450px" :before-close="handleClose2">

			<span style="margin-top:20px">单位名称:</span>
			<span style="margin-top:20px;margin-left:5px;">{{customerName}}</span>
			<!-- <el-input size="mini" disabled v-model='customerName'></el-input> -->
			<!-- <el-select v-model="fBrNo1" placeholder="请选择公司名称" clearable filterable @change='getAssetPeriod2' size="mini" style="margin-left:10px;">
				
				<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option>
			</el-select> -->
			<div style="height:10px;">

			</div>
			<span style="margin-top:20px">期间:</span>
			<el-date-picker style="margin-left:10px;" v-model="fYearStart" align="right" type="year" placeholder="选择年" size="mini"
			 format="yyyy" value-format="yyyy">
			</el-date-picker>
			<span class="demonstration" style="margin-left:5px;">年</span>
			<el-input-number size="mini" v-model="fPeriodStart" :min="1" :max="12" label="描述文字" style="height:30px;margin-left:10px;width:140px;"></el-input-number>
			<span class="demonstration" style="margin-left:5px;">期</span>

			<span slot="footer" class="dialog-footer" style="display: flex;justify-content: center;">
				<el-button type="primary" @click="createAssetDiscount">确 定</el-button>
				<el-button type="danger" @click="dialogVisible_2 = false">取 消</el-button>
			</span>
		</el-dialog>

		<el-dialog title="反过账" :visible.sync="dialogVisible_3" width="450px" :before-close="handleClose3">

			<span style="margin-top:20px">单位名称:</span>
			<span style="margin-top:20px;margin-left:5px;">{{customerName}}</span>
			<!-- <el-input size="mini" disabled v-model='customerName'></el-input> -->
			<!-- <el-select v-model="fBrNo1" placeholder="请选择公司名称" clearable filterable @change='getAssetPeriod2' size="mini" style="margin-left:10px;">
				
				<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option>
			</el-select> -->
			<div style="height:10px;">

			</div>
			<span style="margin-top:20px">期间:</span>
			<el-date-picker style="margin-left:10px;" v-model="temYear1" align="right" type="year" placeholder="选择年" size="mini"
			 disabled format="yyyy" value-format="yyyy">
			</el-date-picker>
			<span class="demonstration" style="margin-left:5px;">年</span>
			<el-input-number disabled size="mini" v-model="temMonth1" :min="1" :max="12" label="描述文字" style="height:30px;margin-left:10px;width:140px;"></el-input-number>
			<span class="demonstration" style="margin-left:5px;">期</span>

			<span slot="footer" class="dialog-footer" style="display: flex;justify-content: center;">
				<el-button type="primary" @click="handleReserve1">确 定</el-button>
				<el-button type="danger" @click="dialogVisible_3 = false">取 消</el-button>
			</span>
		</el-dialog>


		<el-dialog width="100%" title="关联发票" :visible.sync="dialogVisible1">
			<el-table :data="detail" style="width: 100%;margin-top:10px" border v-loading='loading1' @row-click='showDetail' ref='refTable'
			 @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands">
				<el-table-column type="expand">
					<template slot-scope="props">
						<div class='clearfix'>
							<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
								<h3>发票详情<el-button type="primary" size="mini" class='el-icon-refresh' @click="rotate" style="font-size: 16px;margin-left: 12px;"></el-button>
								</h3>
								<div style="margin-top: 12px;">

									<img :src="images[0].url" alt="" :style="{ transform: 'rotate(' + num*90 + 'deg)', transformOrigin:'50% 50%'}"
									 class="moimg">


								</div>


							</div>
							<div style='float:right;width: 500px;'>
								<div style='border:1px solid #efefef;box-sizing:border-box;margin:0px 10px;padding:10px 0px'>
									<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
										<el-form-item v-for='(item,index) in form' :label="item.fieldChName">
											<el-input v-model='item.fieldValue' size="mini" disabled></el-input>

										</el-form-item>

										<div></div>
										<!-- <el-button size="mini" type="primary" style='width:100px' @click='updateSchedule'>保存</el-button> -->
									</el-form>
								</div>

							</div>
						</div>


					</template>
				</el-table-column>
				<!-- <el-table-column align="center" type="selection" width="55"> -->
				</el-table-column>
				<el-table-column align="center" label="发票类型" prop="typeName" :resizable="false"></el-table-column>

				<el-table-column align="center" label="发票号" prop="invoiceNum" :resizable="false"></el-table-column>
				<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
				<el-table-column align="center" label="税额" prop="taxAmount" :resizable="false"></el-table-column>


				<el-table-column align="center" label="是否代开" :resizable="false" width="120">
					<template slot-scope="scope">
						<span v-if='scope.row.issuedSign == 1'>是</span>
						<span v-if='scope.row.issuedSign == 0'>否</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="是否认证" :resizable="false" width="120">
					<template slot-scope="scope">
						<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 1'>是</span>
						<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 0'>否</span>
						<span v-if='scope.row.typeName != "增值税专用发票"'>--</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="状态" prop="state" :resizable="false" width="120">
					<template slot-scope="scope">
						<span v-if='scope.row.state == 1'>待审核</span>
						<span v-if='scope.row.state == 2'>审核通过</span>
						<span v-if='scope.row.state == 3'>审核不通过</span>
						<span v-if='scope.row.state == 4'>问票中</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="审核人">
					<template slot-scope="scope">
						<span>{{scope.row.approveUser}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="审核时间">
					<template slot-scope="scope">
						<span>{{scope.row.approveTime}}</span>
					</template>
				</el-table-column>

				<el-table-column align="center" label="是否校验客户名称" prop="isCheckCustomerName" :resizable="false" width="120">
					<template slot-scope="scope">
						<span v-if='scope.row.isCheckCustomerName == 1'>是</span>
						<span v-if='scope.row.isCheckCustomerName == 0'>否</span>
					</template>
				</el-table-column>


			</el-table>
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				canOperate:false,
				temYear: '',
				temMonth: '',
				temYear1: '',
				temMonth1: '',
				periodCustList: [],
				dialogVisible1: false,
				jzyear: '',
				jzmonth: '',
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
					year: '',
					month: '',
					fYearStart: '',
					fPeriodStart: '',
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
				innerVisible1: false,
				dialogVisible: false,
				img: '',

				detail: [],
				getRowKeys(row) {
					return row.scheduleId
				},
				expands: [],
				num: 0,
				modelUrl: '',
				form: [],
				scheduleId: "",
				scheduleType: '',
				picData: {
					scheduleType: 1,
					scheduleId: '',
					imageUrl: ''
				},
				images: [],
				isRole: false,
				currentPage: 1,
				total: 0,
				pageSize: 1,
				multipleSelection: [],

				dialogVisible_2: false,
				dialogVisible_3: false,
			}
		},
		components: {},
		methods: {
			handleSelection(val) {

				this.multipleSelection = val;
			},
			getPeriodCustList() {
				let param = {};
				this.axios.get('/perTaxToolTwo/api/user/getPeriodCustList.do').then(res => {
					if (res.data.code == 200) {
						this.periodCustList = res.data.data;


					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取客户失败',
						type: 'error'
					});
				})
			},
			preview(row) {

				this.dialogVisible = true;
				let params = {
					"scheduleId": row.schedule_id
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
					"fBrNo": val.customerName
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVoucher', this.qs.stringify(params), {
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
							this.temYear = res.data.data.fyear.toString();
							this.temMonth = res.data.data.fperiod;
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

				this.temYear1 = this.temYear;
				this.temMonth1 = this.temMonth;

				this.queryPage();

				// if(this.fPosted == 1 && this.year == this.temYear && this.fYearStart == this.temYear && this.month == this.temMonth && this.fPeriodStart == this.temMonth){
				// 	this.canResrve = true;
				// }else{
				// 	this.canResrve = false;
				// }
			},
			hideDialog() {
				this.innerVisible = false;
				this.makeup = {};
			},
			hideDialog1() {
				this.innerVisible1 = false;
			},
			queryPage() {
				this.loading = true;
				let params = {
					"year": this.year,
					"month": this.month,
					"fChecked": this.fChecked,
					"fPosted": this.fPosted,
					"fNumber_erp": 0,
					// "fBrNo": this.uploadData.fBrNo,
					"fBrNo": this.fBrNo.customerName,
					"fInternalInd": "",
					"fYearStart": this.fYearStart,
					"fPeriodStart": this.fPeriodStart,
					"curPage": this.currentPage,
					"isPrint": 0
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVoucherSum', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data.filter((value, index) => value != null);
							this.total = this.tableData[0] ? this.tableData[0].allPage : 1;
							this.customerName = this.fBrNo.customerName;
							this.tableData.push({
								fExplanation: '合计',
								fDebit_string: this.compute1(this.tableData)[0],
								fCredit_string: this.compute1(this.tableData)[1],
								fPosted: 100
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

			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage()
			},

			modify(row) {
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/voucherModify', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						// id: row.mainId,
						fBrNo: this.fBrNo.customerName,
						fVoucherID: row.fVoucherID,
						year: row.year,
						month: row.month,
						billSourceType: row.billSourceType,
						scroll: this.$refs.main.parentElement.scrollTop
						// accountPeriod: row.accountPeriod,
						// customerName: row.customerName,
					}
				})
			},

			deleteOne(row) {
				console.log(row);
				this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"fVoucherID": row.fVoucherID,

						"fBrNo": row.fBrNo,
					};
					this.axios.post('/perTaxToolTwo/e9/tVoucher/deleteVoucherByFVoucherID', params)
						.then(res => {
							this.loading = false;
							if (res.data.code == 200) {
								this.queryPage();
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
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消'
					});
				});
			},

			handleEdit(row) {
				this.dialogVisible_2 = true;
			},

			handleClose2() {
				this.dialogVisible_2 = false;
			},

			handleReserve(row) {
				this.dialogVisible_3 = true;
			},
			handleClose3() {
				this.dialogVisible_3 = false;
			},

			handleReserve1() {
				let params = {
					"fYear": this.temYear1,
					"fPeriod": this.temMonth1,
					"fBrNo": this.customerName,
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/updateVoucherUnfPostedNew', this.qs.stringify(params))

					.then(res => {
						if (res.data.code == 200) {
							// this.total = res.data.count;
							this.dialogVisible_3 = false;
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


			handleApprove() {
				this.$confirm('确认审核?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					console.log(this.multipleSelection);
					this.multipleSelection.forEach(item => {
						this.$set(item, 'fbrno', item.fBrNo);
						this.$set(item, 'fperiod', item.month);
						this.$set(item, 'fyear', item.year);
						this.$set(item, 'fvoucherid', item.fVoucherID);
					})
					console.log(this.multipleSelection);
					let params = this.multipleSelection;
					this.axios.post('/perTaxToolTwo/e9/tVoucher/updateVoucherfChecked', params)

						.then(res => {
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

			handleNoApprove() {
				this.$confirm('确认审核?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.multipleSelection.forEach(item => {
						this.$set(item, 'fbrno', item.fBrNo);
						this.$set(item, 'fperiod', item.month);
						this.$set(item, 'fyear', item.year);
						this.$set(item, 'fvoucherid', item.fVoucherID);
					})
					let params = this.multipleSelection;

					this.axios.post('/perTaxToolTwo/e9/tVoucher/updateVoucherUnfChecked', params)

						.then(res => {
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


			handleCopy(row, tag) {
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/voucherCopy', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						// id: row.mainId,
						fBrNo: this.fBrNo.customerName,
						fVoucherID: row.fVoucherID,
						year: row.year,
						month: row.month,
						billSourceType: row.billSourceType,
						insert_type: tag,
						scroll: this.$refs.main.parentElement.scrollTop
						// accountPeriod: row.accountPeriod,
						// customerName: row.customerName,
					}
				})
			},



			exportExcel() {
				// this.fBrNo = this.uploadData.fBrNo;
				// this.year = this.uploadData.year;
				// this.month = this.uploadData.month;
				// this.fChecked = this.uploadData.fChecked;
				// this.fPosted = this.uploadData.fPosted;
				// this.fYearStart = this.uploadData.fYearStart;
				// this.fPeriodStart = this.uploadData.fPeriodStart;
				window.location.href = '/perTaxToolTwo/e9/tVoucher/exportSumVoucherList?year=' + this.year + '&month=' + this.month +
					'&fChecked=' + this.fChecked +
					'&fBrNo=' + this.fBrNo.customerName + '&fYearStart=' + this.fYearStart + '&fPeriodStart=' + this.fPeriodStart +
					'&fNumber_erp=0&fPosted=-1&curPage=1&isPrint=0&fInternalInd=null'
			},

			//凭证字号整理
			createAssetDiscount() {
				let params = {
					"fYear": this.fYearStart,
					"fPeriod": this.fPeriodStart,
					"fBrNo": this.customerName,
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/updateFNumberProofTVoucher', this.qs.stringify(params))

					.then(res => {
						if (res.data.code == 200) {
							// this.total = res.data.count;
							this.dialogVisible_2 = false;
							this.queryPage();
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

			showInvoice(row) {
				console.log(row);

				this.getScheduleByAccountantId(row);
			},

			getScheduleByAccountantId(row) {
				let param = {
					"accountantId": row.fVoucherID,
					"customerId": this.fBrNo.customerId,
					"accountPeriod": row.year + '-' + (row.month >= 10 ? row.month : '0' + row.month),
					"isValid": 1
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/getScheduleByAccountantId', param).then(res => {
					if (res.data.code == 200) {
						this.detail = res.data.data;
						if (this.detail.length > 0) {
							this.dialogVisible1 = true;
						} else {
							this.$message({
								message: '暂无关联发票',
								type: 'warning'
							});
						}

						// this.total = res.data.count;


					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取合同列表失败',
						type: 'error'
					});
				})
			},

			showDetail(row, event, column) {
				this.$refs.refTable.toggleRowExpansion(row)
				this.row = JSON.parse(JSON.stringify(row));

				this.num = 0;
				this.modelUrl = row.modelUrl;
				this.form = row.detailResults;
				this.scheduleId = row.scheduleId;
				this.scheduleType = row.type;
				this.picData.scheduleId = row.scheduleId;
				this.picData.imageUrl = row.imageUrl;
				this.picData.mainId = row.mainId;
				this.images = [{
					url: row.imageUrl
				}];
			},

			expandChange(row, expandedRows) {
				var that = this
				if (expandedRows.length) {
					that.expands = []
					if (row) {
						that.expands.push(row.scheduleId);

						// this.$refs.refTable.toggleRowExpansion(row)
						// this.row = JSON.parse(JSON.stringify(row));

						this.num = 0;
						this.modelUrl = row.modelUrl;
						this.form = row.detailResults;
						this.scheduleId = row.scheduleId;
						this.scheduleType = row.type;
						this.picData.scheduleId = row.scheduleId;
						this.picData.imageUrl = row.imageUrl;
						this.picData.mainId = row.mainId;
						this.images = [{
							url: row.imageUrl
						}];
					}
				} else {
					that.expands = []
				}


			},

			rotate() {
				this.num++;
			},

			checkboxT(row, rowIndex) {
				if (rowIndex == this.tableData.length - 1) {
					//if(row.lie =='1'){
					return false; //禁用
				} else {
					return true; //不禁用
				}
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
			},

			/*连续打印选中的凭证*/
			LODOP_print_checked() {
				var checkedItems = this.multipleSelection;

				var LODOP = this.getLodop(document.getElementById('LODOP_OB'), document
					.getElementById('LODOP_EM'));
				/*var LODOP = getCLodop();*/
				if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) return;
				/*	LODOP.PRINT_INITA("49mm", "86mm", "218.8mm", "114.0mm",
					"记账凭证打印");*/
				LODOP.PRINT_INITA(190, 330, 800, 600, "JZPZDY2");

				LODOP.SET_PRINT_STYLE("FontSize", 9);
				//LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4") ; //A4纸张纵向打印1,横向打印为2
				LODOP.SET_PRINT_PAGESIZE(2, "109mm", "228mm", "");

				var rows = this.tableData;
				var fVoucherIDArr = [];
				checkedItems.forEach((item, index) => {
					if (fVoucherIDArr.indexOf(item.fVoucherID) == -1) {
						fVoucherIDArr.push(item.fVoucherID);
					}
				});
				var proofTVoucher = [];
				var pes = [];
				fVoucherIDArr.forEach((item, index) => {
					rows.forEach((item1, index1) => {
						if (item1.fVoucherID == item) {
							if (item == 0) {

							} else {
								pes.push(item1);
							}
						}
					});
					if (pes.length > 0) {
						proofTVoucher.push(pes);
					}
					//		proofTVoucher.push(pes);
					pes = [];
				});
				//proofTVoucher.push(pes);
				this.lodopPrintVouchersTable(proofTVoucher, LODOP);
				LODOP.PREVIEW();
			},

			LODOP_print_alone() {
				var row = this.multipleSelection;


				if (row.length > 1) {
					alert("请选择连续打印");
					return;
				}

				if (row.fVoucherID == 0) {
					return;
				}
				var LODOP = this.getLodop(document.getElementById('LODOP_OB'), document
					.getElementById('LODOP_EM'));
				/*var LODOP = getCLodop();*/
				if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) return;
				/*	LODOP.PRINT_INITA("49mm", "86mm", "218.8mm", "114.0mm",
					"记账凭证打印");*/
				LODOP.PRINT_INITA(190, 330, 800, 600, "JZPZDY1");
				//	LODOP.SET_PRINT_PAPER();
				LODOP.SET_PRINT_STYLE("FontSize", 9);
				// LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4") ; //A4纸张纵向打印1,横向打印为2
				LODOP.SET_PRINT_PAGESIZE(2, "109mm", "228mm", ""); //A4纸张纵向打印1,横向打印为2

				var rows = this.tableData;
				console.log(row);
				console.log(rows);
				var proofTVoucher = [];
				var pes = [];
				for (var i = 0; i < (rows.length - 1); i++) {
					var rowTemp = rows[i];
					if (rowTemp.fVoucherID == row[0].fVoucherID) {
						console.log(row.fVoucherID);
						pes.push(rowTemp);
					}
				}
				proofTVoucher.push(pes);
				console.log(proofTVoucher);
				this.lodopPrintVouchersTable(proofTVoucher, LODOP);
				LODOP.PREVIEW();
			},
			lodopPrintVouchersTable(proofTVouchers, LODOP) {
				var pes = [];
				var fNumber_account; //科目代码
				var strfExplanation, strfFullName, strfDebit, strfCredit, strfDebit1, strfCredit1;
				var total_fd = 0,
					total_fc = 0;
				var fBrNo1, fNumber, year, month, day;
				/*得出总数*/
				var sum = this.LODOP_print_count(proofTVouchers);

				var page = 0;
				console.log(proofTVouchers);
				for (var i = 0; i < proofTVouchers.length; i++) {
					//	fNumber_fBrNo: "记-1"
					var fNumber_fBrNoByevery = proofTVouchers[i][0].fNumber_fBrNo;
					pes = proofTVouchers[i];
					if (i > 0) { /*换一张凭证*/
						total_fd = 0;
						total_fc = 0;
						LODOP.NewPageA();
					}
					/*在每张凭证的底部显示的是所有合计数，不是单个的*/
					for (var j = 0; j < pes.length; j++) {

						var fDebitTemp = '';
						var fCreditTemp = '';
						if (+pes[j].fDebit_string != 0) {
							fDebitTemp = pes[j].fDebit_string.replace(/,/g, '');
						}
						if (+pes[j].fCredit_string != 0) {
							fCreditTemp = pes[j].fCredit_string.replace(/,/g, '');
						}

						strfDebit1 = +fDebitTemp;
						strfCredit1 = +fCreditTemp;
						total_fd += strfDebit1;
						total_fc += strfCredit1;
					}
					for (var j = 0; j < pes.length; j++) {
						if (pes[j].fVoucherID == 0) {
							break;
						}
						if (j >= 6 && j % 6 == 0) {
							//	total_fd =0;
							//	total_fc=0;
							LODOP.NewPageA();
						}
						fBrNo1 = pes[0].fBrNo;
						fNumber = pes[j].fNumber_fBrNo;
						if (typeof(fNumber) == "undefined") fNumber = '';
						year = pes[0].year;
						month = pes[0].month;
						day = pes[0].fDate_string.split("-")[2];
						strfExplanation = pes[j].fExplanation;
						if (strfExplanation == "0") {
							strfExplanation = "";
						}
						fNumber_account = pes[j].fNumber_account;
						strfFullName = pes[j].fFullName;
						if (typeof(fNumber_account) == "undefined") fNumber_account = '';
						if (typeof(strfFullName) == "undefined") strfFullName = '';
						strfFullName = fNumber_account + " " + strfFullName;
						var fDebitTemp = '';
						var fCreditTemp = '';
						if (+pes[j].fDebit_string != 0) {
							fDebitTemp = pes[j].fDebit_string.replace(/,/g, '');
						}
						if (+pes[j].fCredit_string != 0) {
							fCreditTemp = pes[j].fCredit_string.replace(/,/g, '');
						}
						strfDebit1 = +fDebitTemp;
						strfCredit1 = +fCreditTemp;
						strfDebit = this.changeTwoDecimal(strfDebit1);
						strfCredit = this.changeTwoDecimal(strfCredit1);
						//total_fd +=strfDebit1;
						//	total_fc +=strfCredit1;



						if (strfDebit1 == 0) {
							strfDebit = "";
						} else {
							strfDebit = this.formatNum(strfDebit);
						}
						if (strfCredit1 == 0) {
							strfCredit = "";
						} else {
							strfCredit = this.formatNum(strfCredit);
						}
						//如果是-，333，983.22，去除-后面的，
						var fc = strfCredit.indexOf("-,");
						var fd = strfDebit.indexOf("-,");
						if (fc == 0) {
							// 表示strfCredit是以-,开头；
							strfCredit = "-" + strfCredit.substr(2);
						}
						if (fd == 0) {
							// 表示strfDebit是以-,开头；
							strfDebit = "-" + strfDebit.substr(2);
						}


						if ((j % 6) == 0) {
							LODOP.ADD_PRINT_TEXT("34.1mm", "2.1mm", "50.8mm", "8.4mm",
								strfExplanation); // 32
							LODOP.ADD_PRINT_TEXT("34.1mm", "50.6mm", "75.3mm", "8.4mm",
								strfFullName); // 38
							LODOP.ADD_PRINT_TEXT("34.1mm", "137.2mm", "33.4mm", "5.3mm",
								strfDebit); // 51
							LODOP.ADD_PRINT_TEXT("34.1mm", "170.4mm", "33.4mm", "5.3mm",
								strfCredit); // 45
							LODOP.ADD_PRINT_TEXT("13.1mm", "175.4mm", "33.4mm", "5.3mm",
								fNumber);


						}
						if ((j % 6) == 1) {
							LODOP.ADD_PRINT_TEXT("43.1mm", "2.1mm", "50.8mm", "8.4mm",
								strfExplanation); // 33
							LODOP.ADD_PRINT_TEXT("43.1mm", "50.6mm", "75.3mm", "8.4mm",
								strfFullName); // 44
							LODOP.ADD_PRINT_TEXT("43.1mm", "137.2mm", "33.4mm", "5.3mm",
								strfDebit); // 50
							LODOP.ADD_PRINT_TEXT("43.1mm", "170.4mm", "33.4mm", "5.3mm",
								strfCredit); // 56
							LODOP.ADD_PRINT_TEXT("43.1mm", "167.4mm", "33.4mm", "5.3mm",
								fNumber);

						}
						if ((j % 6) == 2) {
							LODOP.ADD_PRINT_TEXT("52.1mm", "2.1mm", "50.8mm", "8.4mm",
								strfExplanation); // 34
							LODOP.ADD_PRINT_TEXT("52.1mm", "50.6mm", "75.3mm", "8.4mm",
								strfFullName); // 43
							LODOP.ADD_PRINT_TEXT("52.1mm", "137.2mm", "33.4mm", "5.3mm",
								strfDebit); // 49
							LODOP.ADD_PRINT_TEXT("52.1mm", "170.4mm", "33.4mm", "5.3mm",
								strfCredit); // 55
							LODOP.ADD_PRINT_TEXT("52.1mm", "167.4mm", "33.4mm", "5.3mm",
								fNumber);
						}
						if ((j % 6) == 3) {
							LODOP.ADD_PRINT_TEXT("61.1mm", "2.1mm", "50.8mm", "8.4mm",
								strfExplanation); // 35
							LODOP.ADD_PRINT_TEXT("61.1mm", "50.6mm", "75.3mm", "8.4mm",
								strfFullName); // 42
							LODOP.ADD_PRINT_TEXT("61.1mm", "137.2mm", "33.4mm", "5.3mm",
								strfDebit); // 48
							LODOP.ADD_PRINT_TEXT("61.1mm", "170.4mm", "33.4mm", "5.3mm",
								strfCredit); // 54
							LODOP.ADD_PRINT_TEXT("61.1mm", "167.4mm", "33.4mm", "5.3mm",
								fNumber);
						}
						if ((j % 6) == 4) {
							LODOP.ADD_PRINT_TEXT("70.1mm", "2.1mm", "50.8mm", "8.4mm",
								strfExplanation); // 36
							LODOP.ADD_PRINT_TEXT("70.1mm", "50.6mm", "75.3mm", "8.4mm",
								strfFullName); // 41
							LODOP.ADD_PRINT_TEXT("70.1mm", "137.2mm", "33.4mm", "5.3mm",
								strfDebit); // 47
							LODOP.ADD_PRINT_TEXT("70.1mm", "170.4mm", "33.4mm", "5.3mm",
								strfCredit); // 53
							LODOP.ADD_PRINT_TEXT("70.1mm", "167.4mm", "33.4mm", "5.3mm",
								fNumber);
						}
						if ((j % 6) == 5) {
							LODOP.ADD_PRINT_TEXT("79.1mm", "2.1mm", "50.8mm", "8.4mm",
								strfExplanation); // 37
							LODOP.ADD_PRINT_TEXT("79.1mm", "50.6mm", "75.3mm", "8.4mm",
								strfFullName); // 40
							LODOP.ADD_PRINT_TEXT("79.1mm", "137.2mm", "33.4mm", "5.3mm",
								strfDebit); // 46
							LODOP.ADD_PRINT_TEXT("79.1mm", "170.4mm", "33.4mm", "5.3mm",
								strfCredit); // 52
							LODOP.ADD_PRINT_TEXT("79.1mm", "167.4mm", "33.4mm", "5.3mm",
								fNumber);
						}

						if (j == pes.length - 1 || (j + 1) % 6 == 0) {
							LODOP.ADD_PRINT_TEXT("1.0mm", "70.1mm", "59.3mm", "9.3mm", "记 账 凭 证");
							LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
							LODOP.SET_PRINT_STYLEA(0, "Bold", 1);

							LODOP.ADD_PRINT_TEXT("13.06mm", "1.1mm", "17mm", "5.6mm", "单位名称:");
							LODOP.ADD_PRINT_TEXT("13.1mm", "17.6mm", "63.5mm", "4.9mm", fBrNo1);
							LODOP.ADD_PRINT_TEXT("13.1mm", "67.8mm", "10.2mm", "2.6mm", year);
							LODOP.ADD_PRINT_TEXT("13.1mm", "85.6mm", "6.2mm", "2.6mm", month);
							LODOP.ADD_PRINT_TEXT("13.1mm", "99.5mm", "10.2mm", "2.6mm", day); // "31" day

							LODOP.ADD_PRINT_TEXT("13.1mm", "175.4mm", "33.4mm", "5.3mm",
								fNumber_fBrNoByevery);
							//	LODOP.ADD_PRINT_TEXT("13.1mm", "115.4mm", "8.4mm", "5.3mm",
							//			fNumber_fBrNoByevery);

							LODOP.ADD_PRINT_TEXT("37.1mm", "199.3mm", "6.9mm", "4.5mm", "0");
							page++;
							LODOP.ADD_PRINT_TEXTA("text10", "5.0mm", "179.2mm", "23.8mm", "4mm", page + "    " + sum);

							var total_fd1, total_fc1;
							total_fd1 = this.changeTwoDecimal(total_fd);
							total_fc1 = this.changeTwoDecimal(total_fc);

							total_fd1 = this.formatNum(total_fd1);
							total_fc1 = this.formatNum(total_fc1);
							var ftc = total_fc1.indexOf("-,");
							var ftd = total_fd1.indexOf("-,");
							if (ftc == 0) {
								// 表示strfCredit是以-,开头；
								total_fc1 = "-" + total_fc1.substr(2);
							}
							if (ftd == 0) {
								// 表示strfDebit是以-,开头；
								total_fd1 = "-" + total_fd1.substr(2);
							}


							if (j == pes.length - 1) {
								var upperMoney = this.changeNumMoneyToChinese(total_fd);
								LODOP.ADD_PRINT_TEXT("84.5mm", "55.6mm", "56.4mm", "5mm", upperMoney);
								LODOP.ADD_PRINT_TEXT("84.8mm", "134.2mm", "28.6mm", "5.1mm", total_fd1); // 合计借方
								LODOP.ADD_PRINT_TEXT("84.8mm", "164.4mm", "29.1mm", "5.1mm", total_fc1); // 合计贷方
								LODOP.ADD_PRINT_TEXT("93.5mm", "63.6mm", "56.4mm", "5mm", "Administrator");
								LODOP.ADD_PRINT_TEXT("93.5mm", "139.4mm", "56.4mm", "5mm", "Administrator");
							}
						}

					} //pes for
				}
			},
			changeNumMoneyToChinese(money) {
				var cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); // 汉字的数字
				var cnIntRadice = new Array("", "拾", "佰", "仟"); // 基本单位
				var cnIntUnits = new Array("", "万", "亿", "兆"); // 对应整数部分扩展单位
				var cnDecUnits = new Array("角", "分", "毫", "厘"); // 对应小数部分单位
				var cnInteger = "整"; // 整数金额时后面跟的字符
				var cnIntLast = "元"; // 整型完以后的单位
				var maxNum = 999999999999999.9999; // 最大处理的数字
				var IntegerNum; // 金额整数部分
				var DecimalNum; // 金额小数部分
				var ChineseStr = ""; // 输出的中文金额字符串
				var parts; // 分离金额后用的数组，预定义
				if (money == "") {
					return "";
				}
				money = parseFloat(money);
				if (money >= maxNum) {
					alert('超出最大处理数字');
					return "";
				}
				if (money == 0) {
					ChineseStr = cnNums[0] + cnIntLast + cnInteger;
					return ChineseStr;
				}
				money = money.toString(); // 转换为字符串
				if (money.indexOf(".") == -1) {
					IntegerNum = money;
					DecimalNum = '';
				} else {
					parts = money.split(".");
					IntegerNum = parts[0];
					DecimalNum = parts[1].substr(0, 4);
				}
				if (parseInt(IntegerNum, 10) > 0) { // 获取整型部分转换
					var zeroCount = 0;
					var IntLen = IntegerNum.length;
					for (var i = 0; i < IntLen; i++) {
						var n = IntegerNum.substr(i, 1);
						var p = IntLen - i - 1;
						var q = p / 4;
						var m = p % 4;
						if (n == "0") {
							zeroCount++;
						} else {
							if (zeroCount > 0) {
								ChineseStr += cnNums[0];
							}
							zeroCount = 0; // 归零
							ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
						}
						if (m == 0 && zeroCount < 4) {
							ChineseStr += cnIntUnits[q];
						}
					}
					ChineseStr += cnIntLast;
					// 整型部分处理完毕
				}
				if (DecimalNum != '') { // 小数部分
					var decLen = DecimalNum.length;
					for (var i = 0; i < decLen; i++) {
						var n = DecimalNum.substr(i, 1);
						if (n != '0') {
							ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
						}
					}
				}
				if (ChineseStr == '') {
					ChineseStr += cnNums[0] + cnIntLast + cnInteger;
				} else if (DecimalNum == '') {
					ChineseStr += cnInteger;
				}
				return ChineseStr;
			},
			needCLodop() {
				try {
					var ua = navigator.userAgent;
					if (ua.match(/Windows\sPhone/i) != null) return true;
					if (ua.match(/iPhone|iPod/i) != null) return true;
					if (ua.match(/Android/i) != null) return true;
					if (ua.match(/Edge\D?\d+/i) != null) return true;

					var verTrident = ua.match(/Trident\D?\d+/i);
					var verIE = ua.match(/MSIE\D?\d+/i);
					var verOPR = ua.match(/OPR\D?\d+/i);
					var verFF = ua.match(/Firefox\D?\d+/i);
					var x64 = ua.match(/x64/i);
					if ((verTrident == null) && (verIE == null) && (x64 !== null))
						return true;
					else
					if (verFF !== null) {
						verFF = verFF[0].match(/\d+/);
						if ((verFF[0] >= 41) || (x64 !== null)) return true;
					} else
					if (verOPR !== null) {
						verOPR = verOPR[0].match(/\d+/);
						if (verOPR[0] >= 32) return true;
					} else
					if ((verTrident == null) && (verIE == null)) {
						var verChrome = ua.match(/Chrome\D?\d+/i);
						if (verChrome !== null) {
							verChrome = verChrome[0].match(/\d+/);
							if (verChrome[0] >= 41) return true;
						};
					};
					return false;
				} catch (err) {
					return true;
				};
			},
			getLodop(oOBJECT, oEMBED) {
				var strHtmInstall =
					"<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
				var strHtmUpdate =
					"<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
				var strHtm64_Install =
					"<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
				var strHtm64_Update =
					"<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
				var strHtmFireFox =
					"<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
				var strHtmChrome = "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
				var strCLodopInstall =
					"<br><font color='#FF00FF'>CLodop云打印服务(localhost本地)未安装启动!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面。</font>";
				var strCLodopUpdate =
					"<br><font color='#FF00FF'>CLodop云打印服务需升级!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>,升级后请刷新页面。</font>";
				var LODOP;
				try {
					var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
					if (this.needCLodop()) {
						try {
							LODOP = getCLodop();
						} catch (err) {};
						if (!LODOP && document.readyState !== "complete") {
							alert("C-Lodop没准备好，请稍后再试！");
							return;
						};
						if (!LODOP) {
							if (isIE) document.write(strCLodopInstall);
							else
								document.body.innerHTML = strCLodopInstall + document.body.innerHTML;
							return;
						} else {

							if (CLODOP.CVERSION < "3.0.2.3") {
								if (isIE) document.write(strCLodopUpdate);
								else
									document.body.innerHTML = strCLodopUpdate + document.body.innerHTML;
							};
							if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED);
							if (oOBJECT && oOBJECT.parentNode) oOBJECT.parentNode.removeChild(oOBJECT);
						};
					} else {
						var is64IE = isIE && (navigator.userAgent.indexOf('x64') >= 0);
						//=====如果页面有Lodop就直接使用，没有则新建:==========
						if (oOBJECT != undefined || oEMBED != undefined) {
							if (isIE) LODOP = oOBJECT;
							else LODOP = oEMBED;
						} else if (CreatedOKLodop7766 == null) {
							LODOP = document.createElement("object");
							LODOP.setAttribute("width", 0);
							LODOP.setAttribute("height", 0);
							LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
							if (isIE) LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
							else LODOP.setAttribute("type", "application/x-print-lodop");
							document.documentElement.appendChild(LODOP);
							CreatedOKLodop7766 = LODOP;
						} else LODOP = CreatedOKLodop7766;
						//=====Lodop插件未安装时提示下载地址:==========
						if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) {
							if (navigator.userAgent.indexOf('Chrome') >= 0)
								document.body.innerHTML = strHtmChrome + document.body.innerHTML;
							if (navigator.userAgent.indexOf('Firefox') >= 0)
								document.body.innerHTML = strHtmFireFox + document.body.innerHTML;
							if (is64IE) document.write(strHtm64_Install);
							else
							if (isIE) document.write(strHtmInstall);
							else
								document.body.innerHTML = strHtmInstall + document.body.innerHTML;
							return LODOP;
						};
					};
					if (LODOP.VERSION < "6.2.2.0") {
						if (!this.needCLodop()) {
							if (is64IE) document.write(strHtm64_Update);
							else
							if (isIE) document.write(strHtmUpdate);
							else
								document.body.innerHTML = strHtmUpdate + document.body.innerHTML;
						};
						return LODOP;
					};
					//===如下空白位置适合调用统一功能(如注册语句、语言选择等):===

					//===========================================================
					return LODOP;
				} catch (err) {
					alert("getLodop出错:" + err);
				};
			},
			/*得出打印总数*/
			LODOP_print_count(proofTVouchers) {
				var sum = 0;
				for (var i = 0; i < proofTVouchers.length; i++) {
					var pes = proofTVouchers[i];
					var n = (pes.length - 1) / 6;
					n = Math.floor(n) + 1;
					sum = sum + n;
				}
				return sum;
			}

		},
		watch: {

			'$route'(to, from) {
				// init data
				if (to.name == 'tvoucherentryQuery') {
					var roleList = JSON.parse(sessionStorage.getItem('updateUser')).roleList;
					roleList.forEach(item => {
						if (item.roleSign == 'e9_mgr') {
							this.isRole = true;
						}
					});
					this.userTypeId = JSON.parse(sessionStorage.getItem('updateUser')).userTypeId;
					if (this.userTypeId == 1) {
						this.isRole = true;
					}
				}
				if (this.$route.query.customerId) {
					this.uploadData.fBrNo = {
						customerName: this.$route.query.customerName,
						customerId: this.$route.query.customerId,
					};
					this.uploadData.fYearStart = this.$route.query.accountPeriod.slice(0, 4);
					this.uploadData.fPeriodStart = parseFloat(this.$route.query.accountPeriod.slice(5, 7));
					this.uploadData.year = this.$route.query.accountPeriod.slice(0, 4);
					this.uploadData.month = parseFloat(this.$route.query.accountPeriod.slice(5, 7));
					this.search();
				}

				if (this.$route.query.hasOwnProperty('scroll')) {
					this.$refs.main.parentElement.scrollTop = this.$route.query.scroll,
						this.search();
				}



			},

		},
		computed: {},
		created() {
			var roleList = JSON.parse(sessionStorage.getItem('updateUser')).roleList;
			roleList.forEach(item => {
				if (item.roleSign == 'e9_mgr') {
					this.isRole = true;
				}
			});
			this.canOperate = roleList.some(function(item, index, array) {
				return item.roleSign == 'e9_cust_svr' || item.roleSign == 'e9_cust_queryall' || item.roleSign == 'e9_cust_rpt';
			})

			this.userTypeId = JSON.parse(sessionStorage.getItem('updateUser')).userTypeId;
			if (this.userTypeId == 1) {
				this.isRole = true;
			}

			if (this.needCLodop()) {
				var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
				var oscript = document.createElement("script");
				oscript.src = "http://localhost:8000/CLodopfuncs.js?priority=1";
				head.insertBefore(oscript, head.firstChild);

				//引用双端口(8000和18000）避免其中某个被占用：
				oscript = document.createElement("script");
				oscript.src = "http://localhost:18000/CLodopfuncs.js?priority=0";
				head.insertBefore(oscript, head.firstChild);
			}

			this.getPeriodCustList();

			if (this.$route.query.customerId) {
				this.uploadData.fBrNo = {
					customerName: this.$route.query.customerName,
					customerId: this.$route.query.customerId,
				};
				this.uploadData.fYearStart = this.$route.query.accountPeriod.slice(0, 4);
				this.uploadData.fPeriodStart = parseFloat(this.$route.query.accountPeriod.slice(5, 7));
				this.uploadData.year = this.$route.query.accountPeriod.slice(0, 4);
				this.uploadData.month = parseFloat(this.$route.query.accountPeriod.slice(5, 7));
				this.search();
			}

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
			/* height: 90px; */
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
