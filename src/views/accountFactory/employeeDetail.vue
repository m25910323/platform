<template>
	<div class='main clearfix'>
		<div>
			<el-page-header @back="goBack" content="企业员工信息详情">
			</el-page-header>
		</div>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" class="demo-form-inline" size="small">
					<el-form-item label="姓名">
						<el-input placeholder="请输入姓名" v-model="input" clearable></el-input>
					</el-form-item>
					<el-button type="primary" icon="el-icon-search" @click='setName' size="small">搜索</el-button>
				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<el-button class='muldel' type="danger" size='mini' icon="el-icon-delete" :disabled="canDel" @click='showDelDialog'>批量删除</el-button>
			<el-table :data="employeeList" stripe style="width: 100%" @selection-change="handleSelectionChange">>
				<el-table-column align="center" type="expand">
					<template slot-scope="props">
							<el-form label-position="left" inline class="demo-table-expand">
								<el-form-item label="本期基本养老保险费">
									<span>{{ props.row.pensionInsurance }}</span>
								</el-form-item>
								<el-form-item label="本期基本医疗保险费">
									<span>{{ props.row.medicalInsurance }}</span>
								</el-form-item>
								<el-form-item label="本期失业保险费">
									<span>{{ props.row.unemploymentInsurance }}</span>
								</el-form-item>
								<el-form-item label="本期住房公积金">
									<span>{{ props.row.housingFund }}</span>
								</el-form-item>
								<el-form-item label="本期企业(职业)年金">
									<span>{{ props.row.companyAnnuity }}</span>
								</el-form-item>
								<el-form-item label="本期商业健康保险费">
									<span>{{ props.row.healthInsurance }}</span>
								</el-form-item>
								<el-form-item label="本期税延养老保险费">
									<span>{{ props.row.pension }}</span>
								</el-form-item>
								<el-form-item label="本期其他扣除(其他)">
									<span>{{ props.row.preTaxDeduction }}</span>
								</el-form-item>
								<el-form-item label="累计收入额">
									<span>{{ props.row.incomeAmountTotal }}</span>
								</el-form-item>
								<el-form-item label="累计减除费用">
									<span>{{ props.row.deductFeeTotal }}</span>
								</el-form-item>
								<el-form-item label="累计专项扣除">
									<span>{{ props.row.refDeductSumTotal }}</span>
								</el-form-item>
								<el-form-item label="累计子女教育支出扣除">
									<span>{{ props.row.childEducationTotal }}</span>
								</el-form-item>
								<el-form-item label="累计赡养老人支出扣除">
									<span>{{ props.row.elderlyTotal }}</span>
								</el-form-item>
								<el-form-item label="累计继续教育支出扣除">
									<span>{{ props.row.continuingEducationTotal }}</span>
								</el-form-item>
								<el-form-item label="累计住房贷款利息支出扣除">
									<span>{{ props.row.homeLoanTotal }}</span>
								</el-form-item>
								<el-form-item label="累计住房租金支出扣除">
									<span>{{ props.row.housingRentTotal }}</span>
								</el-form-item>
								<el-form-item label="累计其他扣除">
									<span>{{ props.row.preTaxDeductionTotal }}</span>
								</el-form-item>
								<el-form-item label="累计准予扣除的捐赠">
									<span>{{ props.row.deductedDonationTotal }}</span>
								</el-form-item>
								<el-form-item label="累计应纳税所得额">
									<span>{{ props.row.taxableIncomeTotal }}</span>
								</el-form-item>
								<el-form-item label="税率%">
									<span>{{ props.row.rateTotal }}</span>
								</el-form-item>
								<el-form-item label="累计应纳税额">
									<span>{{ props.row.payableTaxTotal }}</span>
								</el-form-item>
								<el-form-item label="累计减免税额">
									<span>{{ props.row.deductTaxTotal }}</span>
								</el-form-item>
								<el-form-item label="累计应扣缴税额">
									<span>{{ props.row.preWithholdTaxTotal }}</span>
								</el-form-item>
								<el-form-item label="累计已预缴税额">
									<span>{{ props.row.sumWithholdTaxTotal }}</span>
								</el-form-item>
								<el-form-item label="累计应补(退)税额">
									<span>{{ props.row.taxationTotal }}</span>
								</el-form-item>
							</el-form>
</template>
				</el-table-column>
				<el-table-column align="center" type="selection" width="55">
				</el-table-column>
				<el-table-column align="center" prop="employeeName" label="姓名" width="120">
				</el-table-column>
				<el-table-column align="center" prop="cardType" label="证件类型">
				</el-table-column>
				<!-- <el-table-column align="center" prop="cardNum" label="证件号码">
				</el-table-column> -->
				<el-table-column label="证件号码">
<template scope="scope">
	<!-- <el-input v-show="scope.row.tedit" size="small" v-model="scope.row.cardNum"></el-input> -->
	<div contenteditable="true" @blur="editSingle($event,scope.row)" v-text='scope.row.cardNum'></div>
</template>
				</el-table-column>
				<el-table-column align="center" prop="taxPeriodBegin" label="税款所属期起">
				</el-table-column>
				<el-table-column align="center" prop="taxPeriodEnd" label="税款所属期止">
				</el-table-column>
				<el-table-column align="center" prop="projectCode" label="所得项目">
				</el-table-column>
				<el-table-column align="center" prop="incomeAmount" label="本期收入">
				</el-table-column>
				<el-table-column align="center" prop="taxFreeIncome" label="本期免税收入">
				</el-table-column>
				<el-table-column align="center" fixed="right" label="操作" width="100">
<template slot-scope="scope">
	<!-- <el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button> -->
	<el-button type="text" size="small" @click='edit(scope.row)'>编辑</el-button>
	<el-button type="text" size="small" @click='del(scope.row)'>删除</el-button>
</template>
				</el-table-column>
			</el-table>
			<el-pagination background layout="total,prev, pager, next, jumper" :total="total" :page-size=10 @current-change='handleCurrentChange'
			 :current-page="currentPage">
			</el-pagination>
		</div>
		<el-dialog title="编辑" :visible.sync="dialogVisible" width="90%" :before-close="handleClose">
			<el-form :inline="true" :model="item" class="demo-form-inline" label-width="180px" :rules='rules' ref="ruleForm"
			 size="small">
				<el-form-item label="工号" prop="employeeCode">
					<el-input v-model="item.employeeCode" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="employeeName">
					<el-input v-model="item.employeeName" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="证件类型" prop="cardType">
					<!-- <el-input v-model="item.cardType" placeholder="请输入"></el-input> -->
					<el-select v-model="item.cardType" placeholder="请选择证件类型">
						<el-option v-for="item in cardTypeList" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="证件号码" prop="cardNum">
					<el-input type='number' v-model="item.cardNum" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="税款所属期起" prop="taxPeriodBegin">
					<!-- <el-input v-model="item.taxPeriodBegin" placeholder="请输入"></el-input> -->
					<el-date-picker v-model="item.taxPeriodBegin" type="date" placeholder="选择日期" value-format='yyyy-MM-dd'>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="税款所属期止" prop="taxPeriodEnd">
					<!-- <el-input v-model="item.taxPeriodEnd" placeholder="请输入"></el-input> -->
					<el-date-picker v-model="item.taxPeriodEnd" type="date" placeholder="选择日期" value-format='yyyy-MM-dd'>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="所得项目" prop="projectCode">
					<el-select v-model="item.projectCode" placeholder="请选择所得项目">
						<el-option v-for="item in projectList" :label="item.label" :value='item.value'></el-option>
					</el-select>
					<!-- <el-input v-model="item.projectCode" placeholder="请输入"></el-input> -->
				</el-form-item>
				<el-form-item label="本期收入" prop="incomeAmount">
					<el-input type='number' v-model="item.incomeAmount" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="本期免税收入" prop="taxFreeIncome">
					<el-input type='number' v-model="item.taxFreeIncome" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="本期基本养老保险费" prop="pensionInsurance">
					<el-input type='number' v-model="item.pensionInsurance" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="本期基本医疗保险费" prop="medicalInsurance">
					<el-input type='number' v-model="item.medicalInsurance" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="本期失业保险费" prop="unemploymentInsurance">
					<el-input type='number' v-model="item.unemploymentInsurance" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="本期住房公积金" prop="housingFund">
					<el-input type='number' v-model="item.housingFund" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="本期企业(职业)年金" prop="companyAnnuity">
					<el-input type='number' v-model="item.companyAnnuity" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="本期商业健康保险费" prop="healthInsurance">
					<el-input type='number' v-model="item.healthInsurance" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="本期税延养老保险费" prop="pension">
					<el-input type='number' v-model="item.pension" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="本期其他扣除(其他)" prop="preTaxDeduction">
					<el-input type='number' v-model="item.preTaxDeduction" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计收入额" prop="incomeAmountTotal">
					<el-input type='number' v-model="item.incomeAmountTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计减除费用" prop="deductFeeTotal">
					<el-input type='number' v-model="item.deductFeeTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计专项扣除" prop="refDeductSumTotal">
					<el-input type='number' v-model="item.refDeductSumTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计子女教育支出扣除" prop="childEducationTotal">
					<el-input type='number' v-model="item.childEducationTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计赡养老人支出扣除" prop="elderlyTotal">
					<el-input v-model="item.elderlyTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计继续教育支出扣除" prop="continuingEducationTotal">
					<el-input type='number' v-model="item.continuingEducationTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计住房贷款利息支出扣除" prop="homeLoanTotal">
					<el-input type='number' v-model="item.homeLoanTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计住房租金支出扣除" prop="housingRentTotal">
					<el-input type='number' v-model="item.housingRentTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计其他扣除" prop="preTaxDeductionTotal">
					<el-input type='number' v-model="item.preTaxDeductionTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计准予扣除的捐赠" prop="deductedDonationTotal">
					<el-input type='number' v-model="item.deductedDonationTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计应纳税所得额" prop="taxableIncomeTotal">
					<el-input type='number' v-model="item.taxableIncomeTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="税率%" prop="rateTotal">
					<el-input type='number' v-model="item.rateTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计应纳税额" prop="payableTaxTotal">
					<el-input type='number' v-model="item.payableTaxTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计减免税额" prop="deductTaxTotal">
					<el-input type='number' v-model="item.deductTaxTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计应扣缴税额" prop="preWithholdTaxTotal">
					<el-input type='number' v-model="item.preWithholdTaxTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计已预缴税额" prop="sumWithholdTaxTotal">
					<el-input type='number' v-model="item.sumWithholdTaxTotal" placeholder="请输入"></el-input>
				</el-form-item>
				<el-form-item label="累计应补(退)税额" prop="taxationTotal">
					<el-input type='number' v-model="item.taxationTotal" placeholder="请输入"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="editCommit('ruleForm')">确 定</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
	// import {
	// 	setCookie
	// } from './../utils/cookie.js'
	// import {
	// 	getCookie
	// // } from './../utils/cookie.js'
	// import axios from './../utils/http.js'
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				tedit: false,
				employeeList: [],
				currentPage: 1,
				total: 0,
				formInline: {
				},
				input: '',
				name: '',
				canDel: true,
				multipleSelection: [],
				item: {},
				dialogVisible: false,
				rules: {
					// employeeCode: [{
					// 	required: true,
					// 	message: '请输入工号',
					// 	trigger: 'blur'
					// }],
					employeeName: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}],
					cardType: [{
						required: true,
						message: '请选择证照类型',
						trigger: 'change'
					}],
					projectCode: [{
						required: true,
						message: '请选择所得项目',
						trigger: 'change'
					}],
					cardNum: [{
						required: true,
						message: '请输入证照号码',
						trigger: 'blur'
					}],
					incomeAmount: [{
						required: true,
						message: '请输入本期收入',
						trigger: 'blur'
					}]
				},
				cardTypeList: [{
						label: "居民身份证",
						value: '居民身份证'
					},
					{
						label: "中国护照",
						value: '中国护照'
					},
					{
						label: "港澳居民来往内地通行证",
						value: '港澳居民来往内地通行证'
					},
					{
						label: "港澳居民居住证",
						value: '港澳居民居住证'
					},
					{
						label: "台湾居民来往大陆通行证",
						value: '台湾居民来往大陆通行证'
					},
					{
						label: "台湾居民居住证",
						value: '台湾居民居住证'
					},
					{
						label: "外国护照",
						value: '外国护照'
					},
					{
						label: "外国人永久居留身份证",
						value: '外国人永久居留身份证'
					},
					{
						label: "外国人工作许可证（A类）",
						value: '外国人工作许可证（A类）'
					},
					{
						label: "外国人工作许可证（B类）",
						value: '外国人工作许可证（B类）'
					},
					{
						label: "外国人工作许可证（C类）",
						value: '外国人工作许可证（C类）'
					},
				],
				projectList: [{
						label: "正常工资薪金",
						value: '正常工资薪金'
					},
					{
						label: "一般劳务报酬所得",
						value: '一般劳务报酬所得'
					},
					{
						label: "稿酬所得",
						value: '稿酬所得'
					},
				]
			}
		},
		components: {},
		methods: {
			queryEmployeePage() {
				let params = {
					"page": this.currentPage,
					"row": 10,
					"data": {
						"employeeName": this.name,
						"operateId": this.$route.query.operateId
					}
				};
				// this.axios.post('/miaoxing/queryEmployeePage', params)
				this.axios.post('/perTaxToolTwo/initialMonCom/queryEmployeePage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.employeeList = res.data.data;
							this.length = this.employeeList.length;
							this.total = res.data.count;
							// for (let i = 0; i < this.pageSize - this.length; i++) {
							// 	this.tableData.push({});
							// }
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
			edit(row) {
				this.item = JSON.parse(JSON.stringify(row));
				this.dialogVisible = true;
			},
			editCommit(formName) {
				console.log('item222', this.item);
				this.$refs[formName].validate((valid) => {
					if (valid) {
						console.log('item', this.item);
						let params = this.item;
						this.axios.post('/perTaxToolTwo/initialMonCom/saveCompanyEmployee', params)
							.then(res => {
								this.dialogVisible = false;
								if (res.data.code == 200) {
									this.currentPage = 1;
									this.queryEmployeePage();
									this.$message({
										type: 'success',
										message: '编辑成功!'
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
								this.dialogVisible = false;
								this.$message({
									message: "系统繁忙，请稍后重试",
									type: "error"
								});
							});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			del(row) {
				this.$confirm('确定删除此条记录?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = [row];
					this.axios.post('/perTaxToolTwo/initialMonSal/deleteCompanyEmployee', params)
						.then(res => {
							if (res.data.code == 200) {
								this.currentPage = 1;
								this.queryEmployeePage();
								this.$message({
									type: 'success',
									message: '删除成功!'
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
						message: '已取消删除'
					});
				});
			},
			showDelDialog() {
				this.$confirm('确定删除选中的记录?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = this.multipleSelection;
					this.axios.post('/perTaxToolTwo/initialMonSal/deleteCompanyEmployee', params)
						.then(res => {
							if (res.data.code == 200) {
								this.currentPage = 1;
								this.queryEmployeePage();
								this.$message({
									type: 'success',
									message: '删除成功!'
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
						message: '已取消删除'
					});
				});
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryEmployeePage()
			},
			setName() {
				this.currentPage = 1;
				this.name = this.input;
				this.queryEmployeePage()
			},
			goBack() {
				this.$router.push({
					name: "initialSheet"
				})
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			setEdit(index) {
				this.employeeList[index].tedit = true;
				console.log(this.employeeList)
			},
			editSingle(event, row) {
				row.cardNum = event.target.innerText;
				let params = row;
				this.axios.post('/perTaxToolTwo/initialMonCom/saveCompanyEmployee', params)
					.then(res => {
						if (res.data.code == 200) {
							this.queryEmployeePage();
							// this.$message({
							// 	type: 'success',
							// 	message: '编辑成功!'
							// });
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
		watch: {
			multipleSelection(val) {
				if (val.length == 0) {
					this.canDel = true
				} else {
					this.canDel = false
				}
			}
		},
		created() {
			this.queryEmployeePage();
		}
	}
</script>

<style lang='less' scoped>
	.main {
		/* background: #fff; */
		width: 100%;
		height: 100%;
		box-sizing: border-box;
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
		.el-page-header {
			height: 40px;
			line-height: 40px;
			background-color: #fff;
			margin-bottom: 20px;
			padding-left: 20px;
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box;
		}
		.search_contain {
			background: #fff;
			height: 100px;
			box-sizing: border-box;
			padding-left: 20px;
			margin-left: 20px;
			margin-right: 20px;
			padding-top: 30px;
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
			margin-top: 20px;
			padding: 20px;
			margin-left: 20px;
			margin-right: 20px;
			height: calc(100% - 240px);
			overflow-y: scroll;
			h5 {
				height: 40px;
				line-height: 40px;
			}
			.el-button.muldel {
				/* float: right */
				margin-bottom: 10px;
			}
			/deep/ .demo-table-expand {
				font-size: 0;
			}
			/deep/ .demo-table-expand label {
				color: #99a9bf;
				padding-left: 120px;
			}
			/deep/ .demo-table-expand .el-form-item {
				margin-right: 0;
				margin-bottom: 0;
				width: 50%;
			}
		}
		/deep/ .el-pagination {
			text-align: right;
			margin-top: 10px;
		}
	}
	/*滚动条样式*/
	::-webkit-scrollbar {
		width: 4px;
		/*height: 4px;*/
	}
	::-webkit-scrollbar-thumb {
		border-radius: 10px;
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		background: rgba(0, 0, 0, 0.2);
	}
	::-webkit-scrollbar-track {
		-webkit-box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
		border-radius: 0;
		background: rgba(0, 0, 0, 0.1);
	}
</style>
