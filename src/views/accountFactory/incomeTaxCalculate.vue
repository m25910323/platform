<template>
	<div class='form clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>个税计算</el-breadcrumb-item>
		</el-breadcrumb>
		<el-tag type="danger" effect="dark">
			若在一个自然年度内，中途换工作，那么在新企业的每月工资个税将会以在新企业在职月数进行计算，或者直接编辑在新企业的累计数据
		</el-tag>
		<div class='formlist clearfix'>
			<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="demo-ruleForm" size="small">
				<el-form-item label="当前月份" prop="month">
					<el-date-picker v-model="ruleForm.month" value-format="M" type="month" placeholder="选择月">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="税前工资" prop="gross_salary">
					<el-input v-model="ruleForm.gross_salary" type='number'></el-input>
				</el-form-item>
				<el-form-item label="五险一金" prop="insurance">
					<el-input v-model="ruleForm.insurance" type='number'></el-input>
				</el-form-item>
				<el-form-item label="专项附加扣除" prop="deduct">
					<el-input v-model="ruleForm.deduct" type='number'></el-input>
				</el-form-item>
				<el-form-item label="减除费用（起征点）">
					<el-input :value='ruleForm.decrease' disabled></el-input>
				</el-form-item>
				<el-form-item label="年终奖" prop="bonus">
					<el-input v-model="ruleForm.bonus"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" :loading="isloading" @click="submitForm('ruleForm')">计算</el-button>
					<el-button @click="resetForm('ruleForm')">重置</el-button>
				</el-form-item>
			</el-form>
			<el-form :model="ruleForm" label-width="130px" class="demo-ruleForm" size="small">
				<el-form-item label="累计收入" prop="name">
					<el-input v-model="totalSalary" disabled></el-input>
				</el-form-item>
				<el-form-item label="累计五险一金" prop="name">
					<el-input v-model="totalInsurance" disabled></el-input>
				</el-form-item>
				<el-form-item label="累计专项附加扣除" prop="name">
					<el-input v-model="totalDeduct" disabled></el-input>
				</el-form-item>
				<el-form-item label="累计减除费用" prop="name">
					<el-input v-model="totalDecrease" disabled></el-input>
				</el-form-item>
			</el-form>
			<el-form :model="ruleForm" label-width="160px" class="demo-ruleForm" size="small">
				<el-form-item label="应纳税所得额" prop="name">
					<el-input v-model="calResult.taxableIncome" disabled></el-input>
				</el-form-item>
				<el-form-item label="累计应纳税额" prop="name">
					<el-input v-model="calResult.payableTax" disabled></el-input>
				</el-form-item>
				<el-form-item label="税率" prop="name">
					<el-input v-model="calResult.rate" disabled></el-input>
				</el-form-item>
				<el-form-item label="累计已缴税额" prop="name">
					<el-input v-model="calResult.withholdTax" disabled></el-input>
				</el-form-item>
				<el-form-item label="速算扣除数" prop="name">
					<el-input v-model="calResult.quickDeduction" disabled></el-input>
				</el-form-item>
				<el-form-item label="当月个税（应补税额）" prop="name" v-if='isShow'>
					<el-input v-model="calResult.taxation" disabled></el-input>
				</el-form-item>
				<el-form-item label="税后工资" prop="name" v-if='isShow'>
					<el-input v-model="calResult.afterTaxIncome" disabled></el-input>
				</el-form-item>
				<el-form-item label="【分开核算】当月个税" prop="name" v-if='!isShow'>
					<el-input v-model="calResult.sepTaxation" disabled :class='calResult.sepTaxation < calResult.comTaxation?"red":""'></el-input>
				</el-form-item>
				<el-form-item label="【分开核算】税后工资" prop="name" v-if='!isShow'>
					<el-input v-model="calResult.sepAfterTaxIncome" disabled :class='calResult.sepAfterTaxIncome > calResult.comAfterTaxIncome?"red":""'></el-input>
				</el-form-item>
				<el-form-item label="【合并核算】当月个税" prop="name" v-if='!isShow'>
					<el-input v-model="calResult.comTaxation" disabled :class='calResult.sepTaxation > calResult.comTaxation?"red":""'></el-input>
				</el-form-item>
				<el-form-item label="【合并核算】税后工资" prop="name" v-if='!isShow'>
					<el-input v-model="calResult.comAfterTaxIncome" disabled :class='calResult.sepAfterTaxIncome < calResult.comAfterTaxIncome?"red":""'></el-input>
				</el-form-item>
				<el-form-item  v-if='!isShow'>
					<span style="color: #f56c6c;">【提示】 年终奖筹划方案有效期：2019年1月1号--2021年12月31号</span>
				</el-form-item>
				
			</el-form>
		</div>
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
				ruleForm: {
					gross_salary: '',
					insurance: '',
					month: '',
					deduct: '',
					decrease: 5000,
					bonus: ''
				},
				rules: {
					month: [{
						required: true,
						message: '请选择月份',
						trigger: 'blur'
					}, ],
					gross_salary: [{
						required: true,
						message: '请输入税前工资',
						trigger: 'blur'
					}],
					insurance: [{
						required: true,
						message: '请输入五险一金',
						trigger: 'blur'
					}],
					deduct: [{
						required: true,
						message: '请输入专项附加扣除',
						trigger: 'blur'
					}],
					bonus: [{
						required: false,
						message: '请输入奖金',
						trigger: 'blur'
					}]
				},
				calResult: [],
				isShow: true,
				isloading: false
			}
		},
		components: {},
		methods: {
			submitForm(formName) {
				if (this.ruleForm.bonus) {
					this.isShow = false
				} else {
					this.isShow = true
				}
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.isloading = true;
						let params = {
							"currtMon": this.ruleForm.month,
							"incomeAmount": this.ruleForm.gross_salary,
							"sumIncomeAmount": this.totalSalary,
							"insurance": this.ruleForm.insurance,
							"sumInsurance": this.totalInsurance,
							"addDeduct": this.ruleForm.deduct,
							"sumAddDeduct": this.totalDeduct,
							"deductFee": this.ruleForm.decrease,
							"sumDeductFee": this.totalDecrease,
							"yearAwards": this.ruleForm.bonus
						};
						this.axios.post('/perTaxToolTwo/monAcct/perTaxCalculator', params)
							.then(res => {
								if (res.data.code == 200) {
									this.isloading = false;
									console.log(res.data.data);
									this.calResult = res.data.data;
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
								this.isloading = false;
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
			resetForm(formName) {
				this.$refs[formName].resetFields();
			}
		},
		computed: {
			totalSalary() {
				return this.ruleForm.gross_salary ? this.ruleForm.gross_salary * this.ruleForm.month + '.00' : "";
			},
			totalInsurance() {
				return this.ruleForm.insurance ? this.ruleForm.insurance * this.ruleForm.month + '.00' : "";
			},
			totalDeduct() {
				return this.ruleForm.deduct ? this.ruleForm.deduct * this.ruleForm.month + '.00' : "";
			},
			totalDecrease() {
				return this.ruleForm.decrease ? this.ruleForm.decrease * this.ruleForm.month + '.00' : "";
			}
		},
		created() {}
	}
</script>

<style lang='less' scoped>
	.form {
		background-color: #e9ebf5;
		height: 100%;
		/* padding: 20px 0px 0px 20px; */
		box-sizing: border-box;
		.el-breadcrumb {
			height: 30px;
			line-height: 29px;
			padding-left: 20px;
			background-color: #fff;
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box
		}
		.el-tag {
			margin: 20px 0 0 20px;
		}
	}
	.formlist {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		padding-top: 20px;
		margin: 20px;
		background: #fff;
	}
	.demo-ruleForm {
		/* width: 460px; */
		width: 4.6rem;
		float: left;
		/deep/ .el-date-editor {
			width: 100%
		}
	}
	.el-form-item {
		/* margin-bottom: 18px; */
		margin-bottom: 0.18rem;
	}
	/deep/ .el-input.is-disabled.red .el-input__inner {
		color: #F56C6C
	}
</style>
