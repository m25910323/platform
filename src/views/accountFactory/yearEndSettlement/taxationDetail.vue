<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>年终汇算</el-breadcrumb-item>
			<el-breadcrumb-item>年度汇算税款通知明细</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body clearfix">
			<div>
				<h3>年度汇算税款通知</h3>
				<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;">
					<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="100px">

						<el-form-item label="客户名称" prop="customerName">
							<el-input v-model="uploadData.customerName" placeholder="请输入" clearable>
							</el-input>
						</el-form-item>

						<el-form-item label="账期" prop="accountPeriod">
							<el-date-picker v-model="uploadData.accountPeriod" align="right" type="month" placeholder="请选择" format="yyyy-MM"
							 value-format="yyyy-MM">
							</el-date-picker>
						</el-form-item>



						<el-form-item label="税款通知结果" prop="noticeResult">
							<el-select v-model="uploadData.noticeResult" placeholder="请选择" clearable filterable>

								<el-option v-for="item in accountNoticeList" :label="item.label" :value='item.value'></el-option>
							</el-select>
						</el-form-item>


						<el-form-item label=" " prop="dossierName">
							<el-button size="mini" type='primary' @click='search'>搜索</el-button>
							<el-button size="mini" type='primary' @click='exportExcel' :disabled="tableList.length == 0">导出</el-button>
						</el-form-item>
					</el-form>
				</div>

				<el-table :data="tableList" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange">
					<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->

					<!-- <el-table-column align="center" label="客户编号" prop="userCode" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>


					<el-table-column align="center" label="服务状态" prop="serviceStatus" :resizable="false"></el-table-column>
					<el-table-column align="center" label="收账方式" prop="collectType" :resizable="false"></el-table-column>
					<el-table-column align="center" label="申报类型" prop="declareType" :resizable="false"></el-table-column>
					<el-table-column align="center" label="合同类型" prop="ticketCollection" :resizable="false"></el-table-column>
					<el-table-column align="center" label="审核会计" prop="auditAccounting" :resizable="false"></el-table-column>
					<el-table-column align="center" label="做账会计" prop="accounting" :resizable="false"></el-table-column>
					<el-table-column align="center" label="税款客服" prop="nationUserName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="税款通知结果" prop="noticeResult" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.noticeResult == 1">税款确认</span>
							<span v-if="scope.row.noticeResult == 2">主管核对</span>
							<span v-if="scope.row.noticeResult == 4">再联系</span>
						</template>
					</el-table-column>


					<el-table-column align="center" label="备注" prop="nationRemark" :resizable="false"></el-table-column>
					<el-table-column align="center" label="客户联系备注" prop="remark" :resizable="false"></el-table-column>
					<el-table-column align="center" label="分配时间" prop="updateTime" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.updateTime,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>

					<el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">

							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,1)">税款通知</el-button>

						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>

		</div>

		<el-dialog title="税款通知" :visible.sync="dialogVisible" width="1000px" :before-close="closeChangeMachie"
		 :modal-append-to-body="false">

			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">汇算详情</p>
			</div>
			<el-form ref="form" :model="detail" label-width="210px" size="mini" inline="true">

				<!-- <el-form-item label="客户名称">
					<el-input v-model="detail.customerName" disabled></el-input>
				</el-form-item>
				<el-form-item label="账期">
					<el-input v-model="detail.accountPeriod" disabled></el-input>
				</el-form-item>
				<el-form-item label="征收方式">
					<el-input :value="detail.taxCollectWay" disabled></el-input>
				</el-form-item> -->
				<el-form-item label="核定征收率">
					<el-input v-model="detail.verifiedRate" disabled></el-input>
				</el-form-item>
				<el-form-item label="汇算后企业所得税率">
					<el-input v-model="detail.liquidationIncomeTaxRate" disabled></el-input>
				</el-form-item>
				<el-form-item label="本年收入">
					<el-input v-model="detail.income" disabled></el-input>
				</el-form-item>
				<el-form-item label="本年成本">
					<el-input v-model="detail.cost" disabled></el-input>
				</el-form-item>
				<el-form-item label="本年费用">
					<el-input v-model="detail.fee" disabled></el-input>
				</el-form-item>
				<el-form-item label="本年利润">
					<el-input v-model="detail.profit" disabled></el-input>
				</el-form-item>
				<el-form-item label="本季度利润">
					<el-input v-model="detail.qtrProfit" disabled></el-input>
				</el-form-item>
				<el-form-item label="预支成本">
					<el-input v-model="detail.advCostAmt" disabled></el-input>
				</el-form-item>
				<el-form-item label="预支费用">
					<el-input v-model="detail.advFeeAmt" disabled></el-input>
				</el-form-item>

				<el-form-item label="需调整数合计">
					<el-input v-model="detail.totalSubjectsNeedAdjust" disabled></el-input>
				</el-form-item>
				<el-form-item label="汇算后利润总额">
					<el-input v-model="detail.liquidationProfit" disabled></el-input>
				</el-form-item>

				<el-form-item label="可弥补以前年度亏损">
					<el-input v-model="detail.priorYearLoss" disabled></el-input>
				</el-form-item>
				<el-form-item label="实际弥补以前年度亏损">
					<el-input v-model="detail.remedyPriorYearLoss" disabled></el-input>
				</el-form-item>


				<el-form-item label="预缴企业所得税">
					<el-input v-model="detail.prepayIncomeTax" disabled></el-input>
				</el-form-item>
				<el-form-item label="本年度企业所得税税额合计">
					<el-input v-model="detail.totalIncomeTax" disabled></el-input>
				</el-form-item>
				<el-form-item label="本季度需缴纳税款">
					<el-input v-model="detail.periodPayIncomeTax" disabled></el-input>
				</el-form-item>
				<el-form-item label="汇算后需补缴纳企业所得税税款">
					<el-input v-model="detail.liquidationPayIncomeTax" disabled></el-input>
				</el-form-item>

			</el-form>



			<div style="width: 100%;height: 20px;"></div>





			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">基本信息</p>
			</div>
			<div style="width: 100%;"></div>
			<el-form :inline="true" ref="ruleForm5" :model="form3" class="demo-form-inline" label-width="120px" size="mini">
				<el-form-item label="客户名称">
					<el-input v-model="form3.customerName" disabled></el-input>
				</el-form-item>
				<el-form-item label="税务类型">
					<el-input v-model="formdeclareType" disabled></el-input>
				</el-form-item>
				<!-- <el-form-item label="收账时间">
						<el-input v-model="form3.declareType" disabled></el-input>
					</el-form-item> -->
				<el-form-item label="审核会计">
					<el-input v-model="form3.auditAccounting" disabled></el-input>
				</el-form-item>
				<el-form-item label="APP状态">
					<el-input v-model="form3.accountNotice" disabled></el-input>
					<!-- <el-select v-model="form3.accountNotice" placeholder="请选择" filterable disabled>
							
							<el-option v-for="item in executeStatusList" :label="item.label" :value='item.value'></el-option>
						</el-select> -->
				</el-form-item>
				<el-form-item label="APP备注">
					<el-input v-model="form3.nationRemark" disabled></el-input>
				</el-form-item>
				<el-form-item label="通知结果" prop="noticeResult">
					<el-select v-model="form3.noticeResult" placeholder="请选择" filterable>
						<el-option v-for="item in accountNoticeList1" :label="item.label" :value='item.value' :disabled="accountPeriod1.slice(5,7)%3 != 0 && item.value == 2"></el-option>
						<!-- <el-option v-for="item in accountNoticeList1" :label="item.label" :value='item.value' :disabled="!form3.corpIncomeTaxRecordId && (item.value == 1 || item.value == 2)"></el-option> -->
					</el-select>
				</el-form-item>


				<el-form-item label="是否同意申报文化事业建设费" v-show="form3.isTaxIdentification == 1" class="longLabel">
					<el-select v-model="form3.isCultural" placeholder="请选择" filterable>
						<el-option v-for="item in trueOrFalse" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="预约时间">
					<el-date-picker v-model="form3.appointment" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>
				</el-form-item>
				<div style="width: 100%"></div>
				<el-form-item label="备注">
					<el-input style='width: 800px;' type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入" v-model="form3.remark">
					</el-input>
				</el-form-item>
			</el-form>

			<div style="width: 100%;"></div>
			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">联系记录</p>
			</div>
			<div style="width: 100%;">
				<el-table :data="remarkList" style="width: 100%" v-loading='loading1'>

					<el-table-column align="center" label="联系人" prop="contactName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="电话" prop="contactPhone" :resizable="false"></el-table-column>
					<el-table-column align="center" label="创建人" prop="createUser" :resizable="false"></el-table-column>

					<el-table-column align="center" label="创建时间" prop="createTime" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.createTime,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>

				</el-table>
			</div>
			<div style="width: 100%;height: 20px;"></div>

			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">联系人信息</p>
			</div>
			<div style="width: 100%;">
				<el-table :data="contactPersonInfo" style="width: 100%" v-loading='loading1' @selection-change="handleSelectionChange">
					<el-table-column align="center" type="selection" width="55"></el-table-column>
					<el-table-column align="center" label="姓名" prop="contactname" :resizable="false"></el-table-column>
					<el-table-column align="center" label="职务" prop="positionName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="级别" prop="levelName" :resizable="false"></el-table-column>


					<el-table-column align="center" label="电话" prop="phone" :resizable="false">
						<template slot-scope="scope">
							<span v-for="(item,index) in scope.row.phone.split(',')">
								<el-button type="text" size="mini" @click='jumpToCall(item)'>{{item}}</el-button>
								<span v-show="index < scope.row.phone.split(',').length - 1">,</span>
							</span>

						</template>
					</el-table-column>
					<el-table-column align="center" label="邮箱" prop="email" :resizable="false"></el-table-column>
					<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>


				</el-table>
			</div>

			<div style="width: 100%;height: 20px;"></div>

			</el-form>



			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog">取 消</el-button>
				<el-button type="primary" @click="commit">确 定</el-button>
			</span>


		</el-dialog>



	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				ZGhistory: {},
				hasChecked: false,
				isRole3: false,
				currentPeriod: '',
				detail: {
					allIncome: 0,
					declarationCycle: 0,
					allIncomeOne: 0,
					allIncomeTwo: 0,
					allIncomeThree: 0,
					currentPeriodKeep: 0,
					counterfoil: 0,
					abatementVat: 0,
					allOutputTax: 0,
					changeoverinputVat: 0,
					allConsumptionTaxation: 0,
					education: 0,
					allInputTax: 0,
					allTaxAmount: 0,
					allUrbanTaxation: 0,
					allEsTaxation: 0,
					allAleTaxation: 0,
					allStampDutyTaxation: 0,
					wages: 0,
					allTotal: 0,

				},
				detail1: {
					income: 0,
					incomeSum: 0,
					cost: 0,
					fee: 0,
					profit: 0,
					priorYearLoss: 0,
					remedyPriorYearLoss: 0,
					verifiedRate: 0,
					taxableIncome: 0,
					incomeTaxRate: 0,
					totalIncomeTaxation: 0,
					paidIncomeTaxation: 0,
					incomeTaxation: 0,
					prepayIncomeTaxation: 0,
					costInvAmt: 0,
					feeInvAmt: 0,
					settlementProfit: 0,
					addIncomeTaxation: 0,
					costInvAmtShow: 0,
					feeInvAmtShow: 0,
					originalIncome: 0,
					originalCost: 0,
					originalFee: 0,
					originalProfit: 0,


				},
				uploadData: {},
				customerServicerList: [],
				form3: {},
				form2: {},
				form1: {},
				costInvAmt: 0,
				feeInvAmt: 0,
				multipleSelection: [],

				loading: false,
				loading1: false,

				userName: '',
				temtaxInfoId: '',
				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],

				dialogVisible: false,
				dialogVisible1: false,
				trueOrFalse: [{
						label: '是',
						value: 1
					},
					{
						label: '否',
						value: 0
					}
				],
				accountNoticeList: [{
						label: '全部',
						value: ''
					},
					{
						label: '税款确认',
						value: 1
					},

					{
						label: '主管核对',
						value: 2
					},
					{
						label: '再联系',
						value: 4
					}
				],
				accountNoticeList1: [{
						label: '税款确认',
						value: 1
					},
					{
						label: '主管核对',
						value: 2
					},

					{
						label: '再联系',
						value: 4
					}
				],
				canCal: false,
				verifiedRateList: [],
				contactPersonInfo: [],
				dialogVisible2: false,
				declareType: '',
				formdeclareType: '',
				declarationCycle: '',
				accountPeriod1: '',
				remarkList: [],
				executeStatusList: [{
						label: '已完成',
						value: "2"
					},
					{
						label: '未完成',
						value: "1"
					},
					{
						label: '回退',
						value: "3"
					}
				]
			}
		},
		components: {},
		methods: {
			resetDetail() {
				this.detail1 = {
					income: 0,
					incomeSum: 0,
					cost: 0,
					fee: 0,
					profit: 0,
					priorYearLoss: 0,
					remedyPriorYearLoss: 0,
					verifiedRate: 0,
					taxableIncome: 0,
					incomeTaxRate: 0,
					totalIncomeTaxation: 0,
					paidIncomeTaxation: 0,
					incomeTaxation: 0,
					prepayIncomeTaxation: 0,
					costInvAmt: 0,
					feeInvAmt: 0,
					settlementProfit: 0,
					addIncomeTaxation: 0,
					costInvAmtShow: 0,
					feeInvAmtShow: 0

				}
			},
			jumpToCall(item) {
				this.$router.push({
					path: '/callCenter/workbench',
					query: {
						phoneNumber: item
					}
				})
			},


			hideDialog() {
				this.dialogVisible = false;
				this.reset();

			},

			reset() {
				this.form = {};
				this.form2 = {};
			},

			closeChangeMachie() {

				this.dialogVisible = false;
				this.reset();
			},

			exportExcel() {
				let params = {
					declareType: this.declareType,
					incomeTaxUserId: this.incomeTaxUserId ? this.incomeTaxUserId : '',
					customerName: this.customerName ? this.customerName : '',
					accountPeriod: this.accountPeriod ? this.accountPeriod : '',
					noticeResult: this.noticeResult

				};
				this.axios.post('/perTaxToolTwo/callcenter/customerServiceManage/exportExcel', this.qs.stringify(params), {
						responseType: 'blob',
					})
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {

						let link = document.createElement("a");
						link.href = window.URL.createObjectURL(new Blob([res.data]));
						link.target = "_blank";
						link.download = "税款通知列表.xls";
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



			},


			search() {
				this.customerName = this.uploadData.customerName;
				this.accountPeriod = this.uploadData.accountPeriod;
				this.incomeTaxUserId = this.uploadData.incomeTaxUserId ? this.uploadData.incomeTaxUserId : '';
				this.declareType = this.uploadData.declareType;
				this.noticeResult = this.uploadData.noticeResult;
				this.queryListByPage()
			},


			queryListByPage() {
				this.loading = true;


				let param = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						customerName: this.customerName,
						accountPeriod: this.accountPeriod,
						incomeTaxUserId: this.incomeTaxUserId,
						declareType: this.declareType,
						noticeResult: this.noticeResult,
						noticeType: 4,
						field4: 1
					}
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/callcenter/customerServiceManage/queryListByPage', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.tableList = res.data.data;
						this.total = res.data.count;

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

			handleEdit(index, row) {
				// this.dialogVisible = true;
				// this.form3 = JSON.parse(JSON.stringify(row));
				this.getAccountNotice(row);
				this.showDetail(row);
			},



			getAccountNotice(row) {

				this.dialogVisible = true;
				this.form3 = JSON.parse(JSON.stringify(row));
				this.remarkList = this.form3.noticeRemarkList;
				this.getContactList(row);

			},






			commit() {
				if (this.multipleSelection.length > 1) {
					this.$message({
						message: '只能选择一位联系人',
						type: 'error'
					});
				} else if (this.multipleSelection.length == 0) {
					this.$message({
						message: '请选择一位联系人',
						type: 'error'
					});
				} else {

					this.saveOrUpdateTaxNotice();


				}

			},
			
			confirmYearCorpIncomeTax(val){
				let param1 = this.form3;
				param1.resultStatus = val;
				param1.id = this.form3.yearIncId;
				param1.source = 2;
				this.axios.post('/perTaxToolTwo/import/confirmYearCorpIncomeTax', param1).then(res => {
				
					if (res.data.code == 200) {
				
				
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
				})
			},

			saveOrUpdateTaxNotice() {
				this.form3.serviceManageId = this.form3.manageId;
				this.form3.contactName = this.multipleSelection[0].contactname;
				this.form3.contactPhone = this.multipleSelection[0].phone;
				this.form3.taxType = 1;
				console.log(this.form3);
				let param1 = this.form3;
				this.axios.post('/perTaxToolTwo/callcenter/taxNotice/saveOrUpdateTaxNotice', param1).then(res => {

					if (res.data.code == 200) {
						this.dialogVisible = false;


						if (this.form3.noticeResult == 1 && this.form3.yearIncId) {

							this.confirmYearCorpIncomeTax(1)

						}
						if (this.form3.noticeResult == 2 && this.form3.yearIncId) {
							this.confirmYearCorpIncomeTax(2)

						}



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
				})
			},



			showDetail(row) {
				let params = {
					id: row.yearIncId,
				};
				this.axios.post('/perTaxToolTwo/import/findYearCorpIncomeTaxById', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.detail = res.data.data;

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



			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},

			getCustomerServicer() {
				let param = {};
				this.axios.post('/perTaxToolTwo/callcenter/customerServiceConfig/queryList', param).then(res => {

					if (res.data.code == 200) {
						this.customerServicerList = res.data.data;


					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取失败',
						type: 'error'
					});
				})
			},
			getContactList(row) {
				this.loading1 = true;
				let param = {
					manageId: row.manageId
				};
				this.axios.post('/perTaxToolTwo/callcenter/accountNotice/getContactList', param).then(res => {
					this.loading1 = false;
					if (res.data.code == 200) {
						this.contactPersonInfo = res.data.data;
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
					this.loading1 = false;
					this.$message({
						message: '获取联系人失败',
						type: 'error'
					});
				})
			},






		},
		created() {
			this.queryListByPage();
			var roleList = JSON.parse(sessionStorage.getItem('updateUser')).roleList;
			roleList.forEach(item => {
				if (item.roleSign == 'callCenter_admin') {
					this.isRole3 = true;
					this.getCustomerServicer();
				}
			});
		}

	}
</script>

<style scoped lang='less'>
	.main_contain {
		width: 100%;
		height: 100%;
		padding: 0px;
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


	}

	.contain_body {
		/* padding: 10px 20px; */
		margin: 20px 20px;
		height: 100%;
		background: #fff;

		.htitle {
			margin: 12px 0px 12px 20px;
			padding-left: 8px;
			border-left: 2px solid #409EFF;
			font-size: 14px;
		}

		h3 {
			height: 40px;
			line-height: 40px;
			font-size: 16px;
			padding-left: 20px;
			background: #fff;
		}
	}



	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
	}

	/deep/ .el-table table {
		background: rgb(243, 246, 249);
		border-collapse: separate;
		border-spacing: 0px 5px;
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
		justify-content: flex-start;
		flex-wrap: wrap
	}

	/deep/ .search_contain {


		/deep/ .el-form-item {
			width: 25%;
			margin-right: 0px;
		}

		/deep/ .el-form-item__content {
			width: 180px;
		}
	}

	.el-form {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		flex-wrap: wrap
	}

	/* /deep/ .el-form-item {
		width: 20%;
	} */

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
		color: #666;
	}

	/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #fff;
	}

	/deep/ .custom-tree-node {
		width: 100%
	}

	.tabtitle {
		display: flex;
		align-items: center;
		height: 35px;
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

	/deep/ .longLabel .el-form-item__label {
		line-height: 16px;
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
</style>
