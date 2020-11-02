<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>离职审批与交接</div>
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
					
					<el-form-item label="姓名:">
						<el-input v-model='formInline.userNickName' clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click='search' size="mini">查询</el-button>
						<el-button @click='add' size="mini">新增</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="contain_body">
				<el-table :data="detail" style="width: 100%" stripe border v-loading='loading'>
					<!-- <el-table-column type="selection" width="50"></el-table-column> -->
					<el-table-column align="center" label="申请人工号" prop="userCode" :resizable="false"></el-table-column>
					<el-table-column align="center" label="申请人姓名" prop="userName" :resizable="false"></el-table-column>

					<el-table-column align="center" label="申请部门" prop="quitRemark1" :resizable="false"></el-table-column>
					<el-table-column align="center" label="离职原因" prop="quitReason" width="200" :resizable="false"></el-table-column>
					<el-table-column align="center" label="离职时间" width="120" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.quitTime,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="申请时间" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.applyTime,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="申请状态" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.quitState == 0">部门负责人审核中</span>
							<span v-if="scope.row.quitState == 1">资料交接中</span>
							<span v-if="scope.row.quitState == 2">IT交接中</span>
							<span v-if="scope.row.quitState == 3">人事交接中</span>
							<span v-if="scope.row.quitState == 4">财务交接中</span>
							<span v-if="scope.row.quitState == 5">离职完成</span>
						</template>
					</el-table-column>
					<el-table-column align="center" width="200" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.quitState == 0">审核</el-button>
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.quitState == 1">资料审批</el-button>
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.quitState == 2">IT审批</el-button>
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.quitState == 3">人事审批</el-button>
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)" v-if="scope.row.quitState == 4">财务审批</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<el-dialog title="审批" :visible.sync="dialogVisible" width="500px" :before-close="hideAddDialog">
			<el-form ref="form1" :model="form1" label-width="160px" size="mini">
				<el-form-item label="所属部门">
					<el-input v-model="form1.orgName" disabled></el-input>
				</el-form-item>
				<el-form-item label="员工名称">
					<el-input v-model="form1.userName" disabled></el-input>
				</el-form-item>
				<el-form-item label="员工选择离职时间">
					<el-date-picker v-model="form1.quitTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
					 placeholder="请选择员工选择离职时间" disabled></el-date-picker>
				</el-form-item>
				<el-form-item label="经理审批人">
					<el-input v-model="form1.deptApproveName" :disabled='form1.secondTaskName || form1.thirdTaskName'></el-input>
				</el-form-item>
				<el-form-item label="经理审批结果">
					<el-select v-model='form1.deptApproveResult' clearable :disabled='form1.secondTaskName || form1.thirdTaskName'>
						<el-option v-for='item in optionList' :label="item.label" :value="item.value" :key='item.label'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="经理建议离职时间">
					<el-date-picker v-model="form1.deptAdviceQuitTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
					 placeholder="请选择经理建议离职时间" :disabled='form1.secondTaskName || form1.thirdTaskName'></el-date-picker>
				</el-form-item>
				<el-form-item label="总监审批人" v-if='form1.secondTaskName'>
					<el-input v-model="form1.dirApproveName" :disabled='form1.thirdTaskName'></el-input>
				</el-form-item>
				<el-form-item label="总监审批结果" v-if='form1.secondTaskName'>
					<el-select v-model='form1.dirApproveResult' clearable :disabled='form1.thirdTaskName'>
						<el-option v-for='item in optionList' :label="item.label" :value="item.value" :key='item.label'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="总监确认离职时间" v-if='form1.secondTaskName'>
					<el-date-picker v-model="form1.dirConfirmQuitTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
					 placeholder="请选择总监确认离职时间" :disabled='form1.thirdTaskName'></el-date-picker>
				</el-form-item>
				<el-form-item label="人事审批人" v-if='form1.thirdTaskName'>
					<el-input v-model="form1.name"></el-input>
				</el-form-item>
				<el-form-item label="人事审批结果" v-if='form1.thirdTaskName'>
					<el-select v-model='form1.psnlApproveResult' clearable>
						<el-option v-for='item in optionList' :label="item.label" :value="item.value" :key='item.label'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="人事确认离职时间" v-if='form1.thirdTaskName'>
					<el-date-picker v-model="form1.psnlConfirmQuitTime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
					 placeholder="请选择人事确认离职时间"></el-date-picker>
				</el-form-item>
			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click='addInduction'>完成</span>
				<span class='close' @click="hideAddDialog">关闭</span>
			</div>
		</el-dialog>

		<el-dialog title="人事交接" :visible.sync="dialogVisible1" width="500px" :before-close="hideAddDialog1">
			<el-form ref="form" :model="form2" label-width="210px" size="mini">
				<el-form-item label="所属部门">
					<el-input v-model="form2.orgName" disabled></el-input>
				</el-form-item>
				<el-form-item label="员工名称">
					<el-input v-model="form2.userName" disabled></el-input>
				</el-form-item>
				<el-form-item label="离职时间">
					<el-date-picker v-model="form2.quitTime" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" disabled></el-date-picker>
				</el-form-item>
				<el-form-item label="是否将erp系统中记录设为无效">
					<el-switch v-model="form2.isCleanErp" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>
				<el-form-item label="是否已经更新公司通讯录">
					<el-switch v-model="form2.isUpdateAddress" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>
				<el-form-item label="是否关闭email权限">
					<el-switch v-model="form2.isCloseEmail" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>
				<el-form-item label="上月迟到早退次数">
					<el-input v-model="form2.lastMonthLateCount"></el-input>
				</el-form-item>
				<el-form-item label="上月事假天数">
					<el-input v-model="form2.lastMonthCompleaveCount"></el-input>
				</el-form-item>
				<el-form-item label="上月旷工天数">
					<el-input v-model="form2.lastMonthAbsentCount"></el-input>
				</el-form-item>
				<el-form-item label="本月迟到早退次数">
					<el-input v-model="form2.thisMonthLateCount"></el-input>
				</el-form-item>
				<el-form-item label="本月事假天数">
					<el-input v-model="form2.thisMonthCompleaveCount"></el-input>
				</el-form-item>
				<el-form-item label="本月旷工天数">
					<el-input v-model="form2.thisMonthAbsentCount"></el-input>
				</el-form-item>
				<el-form-item label="本月有效出勤天数">
					<el-input v-model="form2.thisMonthAttendanceCount"></el-input>
				</el-form-item>
				<el-form-item label="本月基本工资总计">
					<el-input v-model="form2.thisMonthBasicWages"></el-input>
				</el-form-item>
				<el-form-item label="保险缴纳截止日期">
					<el-date-picker v-model="form2.insurancePayDeadline" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择保险缴纳截止日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="个人保险缴纳承担金额">
					<el-input v-model="form2.personalExpense"></el-input>
				</el-form-item>
			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click='save1'>保存</span>
				<span class='commit' @click='addInduction1'>完成</span>
				<span class='close' @click="hideAddDialog1">关闭</span>
			</div>
		</el-dialog>


		<el-dialog title="行政交接" :visible.sync="dialogVisible2" width="500px" :before-close="hideAddDialog2">
			<el-form ref="form" :model="form3" label-width="160px" size="mini">
				<el-form-item label="所属部门">
					<el-input v-model="form3.orgName" disabled></el-input>
				</el-form-item>
				<el-form-item label="员工名称">
					<el-input v-model="form3.userName" disabled></el-input>
				</el-form-item>
				<el-form-item label="离职时间">
					<el-date-picker v-model="form3.quitTime" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" disabled></el-date-picker>
				</el-form-item>
				<el-form-item label="是否拥有手机">
					<el-switch v-model="form3.hasPhone" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>
				<el-form-item label="归还手机人员">
					<el-input v-model="form3.phoneHandoverUsername"></el-input>
				</el-form-item>
				<el-form-item label="是否拥有手机卡">
					<el-switch v-model="form3.hasCard" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>
				<el-form-item label="归还手机卡人员">
					<el-input v-model="form3.cardHandoverUsername"></el-input>
				</el-form-item>
				<el-form-item label="是否归还领用物品">
					<el-switch v-model="form3.handoverItemsStatus" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>
				<el-form-item label="是否归还计算机及其他设备">
					<el-switch v-model="form3.handoverComputerStatus" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>
				<el-form-item label="因物品损坏,遗失,服装折旧扣除工资">
					<el-input v-model="form3.damageDeductionWages"></el-input>
				</el-form-item>

			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click='save2'>保存</span>
				<span class='commit' @click='addInduction2'>完成</span>
				<span class='close' @click="hideAddDialog2">关闭</span>
			</div>
		</el-dialog>

		<el-dialog title="财务交接" :visible.sync="dialogVisible3" width="500px" :before-close="hideAddDialog3">
			<el-form ref="form" :model="form4" label-width="160px" size="mini">
				<el-form-item label="所属部门">
					<el-input v-model="form4.orgName" disabled></el-input>
				</el-form-item>
				<el-form-item label="员工名称">
					<el-input v-model="form4.userName" disabled></el-input>
				</el-form-item>
				<el-form-item label="离职时间">
					<el-date-picker v-model="form4.quitTime" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" disabled></el-date-picker>
				</el-form-item>
				<el-form-item label="是否发放上月基本工资">
					<el-switch v-model="form4.isGrantLastBaseWages" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>
				<el-form-item label="是否发放上月绩效工资">
					<el-switch v-model="form4.isGrantLastAchiWages" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>
				<el-form-item label="是否发放本月基本工资">
					<el-switch v-model="form4.isGrantThisBaseWages" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>
				<el-form-item label="是否发放本月绩效工资">
					<el-switch v-model="form4.isGrantThisAchiWages" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>

				<el-form-item label="未归还借款,暂支,现金预支等金额总计">
					<el-input v-model="form4.unbackWages"></el-input>
				</el-form-item>
				<el-form-item label="应付人民币">
					<el-input v-model="form4.copeWages"></el-input>
				</el-form-item>
				<el-form-item label="应扣人民币">
					<el-input v-model="form4.deductionWages"></el-input>
				</el-form-item>
				<el-form-item label="实发人民币">
					<el-input v-model="form4.actualWages"></el-input>
				</el-form-item>
			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click='save3'>保存</span>
				<span class='commit' @click='addInduction3'>完成</span>
				<span class='close' @click="hideAddDialog3">关闭</span>
			</div>
		</el-dialog>
		
		<el-dialog title="部门交接" :visible.sync="dialogVisible4" width="500px" :before-close="hideAddDialog4">
			<el-form ref="form" :model="form5" label-width="140px" size="mini">
				<el-form-item label="所属部门">
					<el-input v-model="form5.orgName" disabled></el-input>
				</el-form-item>
				<el-form-item label="员工名称">
					<el-input v-model="form5.userName" disabled></el-input>
				</el-form-item>
				<el-form-item label="离职时间">
					<el-date-picker v-model="form5.quitTime" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" disabled></el-date-picker>
				</el-form-item>
				<el-form-item label="工作内容是否交接">
					<el-switch v-model="form5.handoverWorkStatus" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>
				<el-form-item label="是否有相关工作物资">
					<el-switch v-model="form5.hasWorkdata" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>
				<el-form-item label="是否归还">
					<el-switch v-model="form5.handoverWorkdataStatus" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>
				<el-form-item label="是否有相关客户资料">
					<el-switch v-model="form5.hasCustdata" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>
				<el-form-item label="是否交接">
					<el-switch v-model="form5.handoverCustdataStatus" active-text="是" inactive-text="否" :active-value='activeValue' :inactive-value='inactiveValue'>
					</el-switch>
				</el-form-item>
				<el-form-item label="本月绩效工资">
					<el-input v-model="form5.thisMonthAchiWages"></el-input>
				</el-form-item>
				<el-form-item label="上月绩效工资">
					<el-input v-model="form5.lastMonthAchiWages"></el-input>
				</el-form-item>
				<el-form-item label="因工作失误扣除工资">
					<el-input v-model="form5.workDeductionWages"></el-input>
				</el-form-item>
				<el-form-item label="因物资丢失扣除工资">
					<el-input v-model="form5.materialDeductionWages"></el-input>
				</el-form-item>
			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click='save4'>保存</span>
				<span class='commit' @click='addInduction4'>完成</span>
				<span class='close' @click="hideAddDialog4">关闭</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				loading: false,
				message: "12334456",
				userName:'',
				formInline: {
					userName: '',
					userNickName: '',
					roleId: ''
				},
				form: {},
				form1:{},
				form2:{},
				form3:{},
				form4:{},
				form5:{},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				detail: [],
				optionList:[
					{
						label:'同意',
						value:1
					},
					{
						label:'不同意',
						value:0
					}
				],
				roleList: [],
				gridData: [{
					date: '2016-05-02',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '2016-05-04',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '2016-05-01',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}, {
					date: '2016-05-03',
					name: '王小虎',
					address: '上海市普陀区金沙江路 1518 弄'
				}],
				dialogTableVisible: false,
				dialogVisible: false,
				dialogVisible1: false,
				dialogVisible2: false,
				dialogVisible3: false,
				dialogVisible4: false,
				userId: '',
				value: '',
				
				activeValue:1,
				inactiveValue:0
			}
		},
		components: {},
		methods: {
			queryList() {
				this.loading = true;
				let params = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						"userName": this.userName,
						"modelSign":"Leave"
					}
				};
				this.axios.post('/perTaxToolTwo/hrEmpQuitOpt/examineAndApproveTask',params).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						
						this.detail = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取申请离职列表失败',
						type: 'error'
					});
				})
			},
			add() {
				this.dialogVisible = true;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			search() {
				this.userName = this.formInline.userNickName;
				this.queryList();
			},
			handleEdit(index, row) {
				let params = row;
				this.axios.post('/perTaxToolTwo/hrEmpQuitOpt/approvalhrEmpQuitOptInfo',params).then(res => {
					if (res.data.code == 200) {
						this.queryList();
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				
				}).catch(function(err) {
					this.$message({
						message: '审批失败',
						type: 'error'
					});
				})
				// let params = row;
				// this.axios.post('/perTaxToolTwo/hrEmpQuitOpt/TorsionRecord',params).then(res => {
				// 	if (res.data.code == 200) {
				// 		this.dialogVisible = true;
				// 		this.form1 = JSON.parse(JSON.stringify(res.data.data));
				// 		this.form1.quitTime = this.formatTimeToStr(this.form1.quitTime,'yyyy-MM-dd');
				// 	} else {
				// 		this.$message({
				// 			message: res.data.msg,
				// 			type: 'error'
				// 		});
				// 	}
				
				// }).catch(function(err) {
				// 	this.$message({
				// 		message: '获取流程失败',
				// 		type: 'error'
				// 	});
				// })

			},
			handleHr(index, row) {
				this.dialogVisible1 = true;
				this.form2 = JSON.parse(JSON.stringify(row));
				this.form2.quitTime = this.formatTimeToStr(this.form2.quitTime,'yyyy-MM-dd');
			},
			handleAdmin(index, row) {
				this.dialogVisible2 = true;
				this.form3 = JSON.parse(JSON.stringify(row));
				this.form3.quitTime = this.formatTimeToStr(this.form3.quitTime,'yyyy-MM-dd');
			},
			handleFinance(index, row) {
				this.dialogVisible3 = true;
				this.form4 = JSON.parse(JSON.stringify(row));
				this.form4.quitTime = this.formatTimeToStr(this.form4.quitTime,'yyyy-MM-dd');
			},
			handleDepart(index, row) {
				this.dialogVisible4 = true;
				this.form5 = JSON.parse(JSON.stringify(row));
				this.form5.quitTime = this.formatTimeToStr(this.form5.quitTime,'yyyy-MM-dd');
			},
			hideDialog() {
				this.dialogTableVisible = false;
				this.$refs.multipleTable.clearSelection();
			},
			hideAddDialog() {
				this.dialogVisible = false;
				this.form1 = {};
			},
			hideAddDialog1() {
				this.dialogVisible1 = false;
				this.form2 = {};
			},
			hideAddDialog2() {
				this.dialogVisible2 = false;
				this.form3 = {};
			},
			hideAddDialog3() {
				this.dialogVisible3 = false;
				this.form4 = {};
			},
			hideAddDialog4() {
				this.dialogVisible4 = false;
				this.form5 = {};
			},
			addInduction() {
				var params = this.form1;


				this.axios.post('/perTaxToolTwo/hrEmpQuitOpt/approvalhrEmpQuitOptInfo', params).then(res => {
				// this.axios.post('/sl/perTaxToolTwo/hrEmpQuitOpt/approvalhrEmpQuitOptInfo', params).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible = false;
						this.queryList();
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
						message: '审批失败',
						type: 'error'
					});
				})
			},
			// 人事交接
			addInduction1(){
				this.form2.ifHandOver = 0;
				this.form2.tag = 1;
				var params = this.form2;
				
				this.dataAdminPsnlHandover(params);
			},
			save1(){
				this.form2.ifHandOver = 1;
				this.form2.tag = 1;
				var params = this.form2;
				
				this.dataAdminPsnlHandover(params);
			},
			dataAdminPsnlHandover(params){
				this.axios.post('/perTaxToolTwo/hrEmpQuitHandoverAdminPsnl/DataAdminPsnlHandover', params).then(res => {
				// this.axios.post('/sl/perTaxToolTwo/hrEmpQuitHandoverAdminPsnl/DataAdminPsnlHandover', params).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible1 = false;
						this.queryList();
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
						message: '交接失败',
						type: 'error'
					});
				})
			},
			// 行政交接
			addInduction2(){
				this.form3.ifHandOver = 0;
				this.form3.tag = 2;
				var params = this.form3;
				this.dataAdminPsnlHandover1(params)
			},
			save2(){
				this.form3.ifHandOver = 1;
				this.form3.tag = 2;
				var params = this.form3;
				
				this.dataAdminPsnlHandover1(params);
			},
			dataAdminPsnlHandover1(params){
				// this.axios.post('/sl/perTaxToolTwo/hrEmpQuitHandoverAdminPsnl/DataAdminPsnlHandover', params).then(res => {
				this.axios.post('/perTaxToolTwo/hrEmpQuitHandoverAdminPsnl/DataAdminPsnlHandover', params).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible2 = false;
						this.queryList();
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
						message: '交接失败',
						type: 'error'
					});
				})
				
			},
			// 财务交接
			addInduction3(){
				this.form4.ifHandOver = 0;
				this.form4.tag = 3;
				var params = this.form4;
				this.dataDeptFinHandover(params);
				
			},
			save3(){
				this.form4.ifHandOver = 1;
				this.form4.tag = 3;
				var params = this.form4;
				
				this.dataDeptFinHandover(params);
			},
			dataDeptFinHandover(params){
				this.axios.post('/perTaxToolTwo/hrEmpQuitHandoverDeptFin/DataDeptFinHandover', params).then(res => {
				// this.axios.post('/sl/perTaxToolTwo/hrEmpQuitHandoverDeptFin/DataDeptFinHandover', params).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible3 = false;
						this.queryList();
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
						message: '交接失败',
						type: 'error'
					});
				})
			},
			// 部门交接
			addInduction4(){
				this.form5.ifHandOver = 0;
				this.form4.tag = 4;
				var params = this.form5;
				this.dataDeptFinHandover1(params);
			},
			save4(){
				this.form5.ifHandOver = 1;
				this.form4.tag = 4;
				var params = this.form5;
				
				this.dataDeptFinHandover1(params);
			},
			dataDeptFinHandover1(params){
				this.axios.post('/perTaxToolTwo/hrEmpQuitHandoverDeptFin/DataDeptFinHandover', params).then(res => {
				// this.axios.post('/sl/perTaxToolTwo/hrEmpQuitHandoverDeptFin/DataDeptFinHandover', params).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible4 = false;
						this.queryList();
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
						message: '交接失败',
						type: 'error'
					});
				})
			}
		},
		created() {
			this.queryList();
		}
	}
</script>

<style scoped lang="less">
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
			margin-right: 0.2rem;
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
		background: url(../../../../assets/img/list-bg1.png) no-repeat;
		background-size: cover;
		border-top-left-radius: 0.06rem;
		border-top-right-radius: 0.06rem;

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
		padding: 0.2rem 0.2rem;
		background: #fff;

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
</style>
