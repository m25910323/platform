<template>
	<div class="main_contain">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>行政管理</el-breadcrumb-item>
			<el-breadcrumb-item>员工服务</el-breadcrumb-item>

			<el-breadcrumb-item>假勤申请</el-breadcrumb-item>
		</el-breadcrumb>


		<div class="contain_body">
			<h3>假勤申请
				<el-button type="primary" size='mini' @click='addTXZX' style='position: absolute;top:40px;right: 12px;z-index: 20;'
				 v-if="activeName == 'forth'">申请</el-button>
				<el-button type="primary" size='mini' @click='add' style='position: absolute;top:40px;right: 12px;z-index: 20;'
				 v-else>申请</el-button>

			</h3>

			<el-tabs v-model="activeName">
				<el-tab-pane name="first">
					<span slot="label">

						<span>请假
							<el-badge :value="total" :max="99" class="item" />
						</span>

					</span>

					<el-table :data="detail" style="width: 100%;" v-loading='loading'>
						<!-- <el-table-column type="selection" width="50"></el-table-column> -->
						<el-table-column align="center" label="类型" prop="holidayTypeName" :resizable="false"></el-table-column>
						<el-table-column align="center" label="原因" prop="holidayReasons" :resizable="false"></el-table-column>
						<el-table-column align="center" label="开始时间" prop="holidayStartTime" :resizable="false"></el-table-column>
						<el-table-column align="center" label="结束时间" prop="holidayEndTime" :resizable="false"></el-table-column>
						<el-table-column align="center" label="工号" prop="ausercode" :resizable="false"></el-table-column>
						<el-table-column align="center" label="姓名" prop="ausername" :resizable="false"></el-table-column>
						<el-table-column align="center" label="审批人" prop="username" :resizable="false"></el-table-column>
						<el-table-column align="center" label="部门" prop="adepartment" :resizable="false"></el-table-column>
						<el-table-column align="center" label="创建时间" prop="createTime" width="120" :resizable="false"></el-table-column>
						<el-table-column align="center" label="审核状态" :resizable="false">
							<template slot-scope="scope">
								<span v-if="scope.row.docStatus == 0">未提交</span>
								<span v-if="scope.row.docStatus == 1">已提交</span>
								<span v-if="scope.row.docStatus == 2">审批中</span>
								<span v-if="scope.row.docStatus == 3">审批通过</span>
								<span v-if="scope.row.docStatus == -1">审批不通过</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="驳回原因" prop="rejectHolidayReasons" :resizable="false"></el-table-column>
						<el-table-column align="center" label="操作" :resizable="false">
							<template slot-scope="scope">
								<el-button v-if="scope.row.docStatus == 0" type="text" @click='applyQJ(scope.row)'>提交</el-button>
								<el-button v-if="scope.row.docStatus == 0" type="text" @click='editQJ(scope.row)'>编辑</el-button>
								<el-button v-if="scope.row.docStatus == 0" type="text" @click='delQJ(scope.row)'>删除</el-button>
								<el-button v-if="scope.row.docStatus == 1" type="text" @click='undoQJ(scope.row)'>撤销</el-button>
							</template>
						</el-table-column>

					</el-table>
					<el-pagination background layout="prev, pager, next" :total="total" :page-size='pageSize' @current-change='handleCurrentChange'
					 :current-page="currentPage">
					</el-pagination>

				</el-tab-pane>
				<el-tab-pane name="second">
					<span slot="label">

						<span>加班
							<el-badge :value="total1" :max="99" class="item" />
						</span>

					</span>
					<el-table :data="detail1" style="width: 100%;" v-loading='loading'>
						<!-- <el-table-column type="selection" width="50"></el-table-column> -->
						<el-table-column align="center" label="加班原因" prop="workOvertimeReasons" :resizable="false"></el-table-column>
						<el-table-column align="center" label="开始时间" prop="workOvertimeStart" :resizable="false"></el-table-column>
						<el-table-column align="center" label="结束时间" prop="workOvertimeEnd" :resizable="false"></el-table-column>
						<el-table-column align="center" label="工号" prop="ausercode" :resizable="false"></el-table-column>
						<el-table-column align="center" label="姓名" prop="ausername" :resizable="false"></el-table-column>
						<el-table-column align="center" label="审批人" prop="username" :resizable="false"></el-table-column>
						<el-table-column align="center" label="部门" prop="adepartment" :resizable="false"></el-table-column>
						<el-table-column align="center" label="创建时间" prop="createTime" width="120" :resizable="false"></el-table-column>
						<el-table-column align="center" label="审核状态" :resizable="false">
							<template slot-scope="scope">
								<span v-if="scope.row.docStatus == 0">未提交</span>
								<span v-if="scope.row.docStatus == 1">已提交</span>
								<span v-if="scope.row.docStatus == 2">审批中</span>
								<span v-if="scope.row.docStatus == 3">审批通过</span>
								<span v-if="scope.row.docStatus == -1">审批不通过</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="驳回原因" prop="rejectWorkOvertimeReasons" :resizable="false"></el-table-column>
						<el-table-column align="center" label="操作" :resizable="false">
							<template slot-scope="scope">
								<el-button v-if="scope.row.docStatus == 0" type="text" @click='applyJB(scope.row)'>提交</el-button>
								<el-button v-if="scope.row.docStatus == 0" type="text" @click='editJB(scope.row)'>编辑</el-button>
								<el-button v-if="scope.row.docStatus == 0" type="text" @click='delJB(scope.row)'>删除</el-button>
								<el-button v-if="scope.row.docStatus == 1" type="text" @click='undoJB(scope.row)'>撤销</el-button>
							</template>
						</el-table-column>

					</el-table>
					<el-pagination background layout="prev, pager, next" :total="total1" :page-size='pageSize1' @current-change='handleCurrentChange1'
					 :current-page="currentPage1">
					</el-pagination>
				</el-tab-pane>
				<el-tab-pane name="third">
					<span slot="label">

						<span>调休
							<el-badge :value="total2" :max="99" class="item" />
						</span>

					</span>
					<el-table :data="detail2" style="width: 100%;" v-loading='loading'>
						<!-- <el-table-column type="selection" width="50"></el-table-column> -->
						<el-table-column align="center" label="调休原因" prop="paidLeaveReasons" :resizable="false"></el-table-column>
						<el-table-column align="center" label="开始时间" prop="paidLeaveStartTime" :resizable="false"></el-table-column>
						<el-table-column align="center" label="结束时间" prop="paidLeaveEndTime" :resizable="false"></el-table-column>
						<el-table-column align="center" label="抵消加班开始日期" prop="workOverTimeDateStart" :resizable="false"></el-table-column>
						<el-table-column align="center" label="抵消加班结束日期" prop="workOverTimeDateEnd" :resizable="false"></el-table-column>
						<el-table-column align="center" label="工号" prop="ausercode" :resizable="false"></el-table-column>
						<el-table-column align="center" label="姓名" prop="ausername" :resizable="false"></el-table-column>
						<el-table-column align="center" label="审批人" prop="username" :resizable="false"></el-table-column>
						<el-table-column align="center" label="部门" prop="adepartment" :resizable="false"></el-table-column>
						<el-table-column align="center" label="创建时间" prop="createTime" width="120" :resizable="false"></el-table-column>
						<el-table-column align="center" label="审核状态" :resizable="false">
							<template slot-scope="scope">
								<span v-if="scope.row.docStatus == 0">未提交</span>
								<span v-if="scope.row.docStatus == 1">已提交</span>
								<span v-if="scope.row.docStatus == 2">审批中</span>
								<span v-if="scope.row.docStatus == 3">审批通过</span>
								<span v-if="scope.row.docStatus == -1">审批不通过</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="驳回原因" prop="rejectPaidLleaveReasons" :resizable="false"></el-table-column>
						<el-table-column align="center" label="操作" :resizable="false">
							<template slot-scope="scope">
								<el-button v-if="scope.row.docStatus == 0" type="text" @click='applyTX(scope.row)'>提交</el-button>
								<!-- <el-button v-if="scope.row.docStatus == 0" type="text" @click='editTX(scope.row)'>编辑</el-button> -->
								<el-button v-if="scope.row.docStatus == 0" type="text" @click='delTX(scope.row)'>删除</el-button>
								<el-button v-if="scope.row.docStatus == 1" type="text" @click='undoTX(scope.row)'>撤销</el-button>
							</template>
						</el-table-column>

					</el-table>
					<el-pagination background layout="prev, pager, next" :total="total2" :page-size='pageSize2' @current-change='handleCurrentChange2'
					 :current-page="currentPage2">
					</el-pagination>

				</el-tab-pane>


				<el-tab-pane name="forth">
					<span slot="label">

						<span>调休折现
							<el-badge :value="total3" :max="99" class="item" />
						</span>

					</span>
					<el-table :data="detail3" style="width: 100%;" v-loading='loading'>
						<!-- <el-table-column type="selection" width="50"></el-table-column> -->
						<el-table-column align="center" label="加班原因" prop="workOvertimeReasons" :resizable="false"></el-table-column>
						<el-table-column align="center" label="开始时间" prop="workOvertimeStart" :resizable="false"></el-table-column>
						<el-table-column align="center" label="结束时间" prop="workOvertimeEnd" :resizable="false"></el-table-column>
						<el-table-column align="center" label="加班时长" prop="totalHours" :resizable="false"></el-table-column>
						<el-table-column align="center" label="审批人工号" prop="userCode" :resizable="false"></el-table-column>
						<el-table-column align="center" label="审批人姓名" prop="userName" :resizable="false"></el-table-column>
						<el-table-column align="center" label="创建时间" prop="createTime" :resizable="false"></el-table-column>
						<el-table-column align="center" label="审批时间" prop="approveTime" :resizable="false"></el-table-column>
						<el-table-column align="center" label="状态" :resizable="false">
							<template slot-scope="scope">
								<span v-if="scope.row.docStatus == -1">审批不通过</span>
								<span v-if="scope.row.docStatus == 0">已提交</span>
								<span v-if="scope.row.docStatus == 1">审批通过</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="操作" :resizable="false">
							<template slot-scope="scope">
								<!-- <el-button type="text" @click='applyTXZX(scope.row)'>提交</el-button> -->
								<el-button type="text" @click='undoTXZX(scope.row)'>撤销</el-button>
							</template>
						</el-table-column>

					</el-table>
					<el-pagination background layout="prev, pager, next" :total="total2" :page-size='pageSize2' @current-change='handleCurrentChange2'
					 :current-page="currentPage2">
					</el-pagination>

				</el-tab-pane>


			</el-tabs>










		</div>
		<el-dialog title="" :visible.sync="dialogVisible" width="500px">
			<el-form ref="form1" :model="form1" label-width="140px" size="mini">
				<el-form-item label="申请类型" v-if='tag == 0'>
					<el-radio-group v-model="form1.type" size="mini" @change='reset'>
						<el-radio-button label="请假"></el-radio-button>
						<el-radio-button label="加班"></el-radio-button>
						<el-radio-button label="调休"></el-radio-button>
					</el-radio-group>
				</el-form-item>
				<!-- 请假 -->
				<el-form-item label="请假单类型" v-if='form1.type == "请假"'>

					<el-select v-model='form1.holidayTypeId' clearable @change='filter'>
						<el-option v-for='item in tableList' :label="item.holidayTypeName" :value="item.holidayTypeId" :key='item.holidayTypeId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类型描述" v-if='form1.type == "请假"'>
					<el-input rows="5" type='textarea' v-model="form1.holidayDescription" disabled></el-input>
				</el-form-item>
				<el-form-item label="开始时间" v-if='form1.type == "请假"'>
					<el-date-picker v-model="form1.holidayStartTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss"
					 placeholder="请选择开始时间" @change="calDate(1)"></el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" v-if='form1.type == "请假"'>
					<el-date-picker v-model="form1.holidayEndTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss"
					 placeholder="请选择结束时间" :disabled="!form1.holidayStartTime" @change="calDate(1)"></el-date-picker>
				</el-form-item>
				<el-form-item label="共计" v-if='form1.type == "请假"'>
					<el-input v-model="form1.totalDays"></el-input>天(半天/4小时为单位，不满四小时按四小时算)
				</el-form-item>
				<el-form-item label="带薪病假剩余天数" v-if='form1.type == "请假" && form1.holidayTypeId == 3'>
					<el-input v-model="form1.days" disabled></el-input>
				</el-form-item>
				<el-form-item label="本次带薪病假天数" v-if='form1.type == "请假" && form1.holidayTypeId == 3'>
					<el-input v-model="form1.sickLeave" type="number" :max="form1.days" min="0"></el-input>
				</el-form-item>

				<el-form-item label="已使用天数" v-if='form1.type == "请假" && form1.holidayTypeId == 8'>
					<el-input v-model="form1.days" disabled></el-input>
				</el-form-item>
				<el-form-item label="剩余天数" v-if='form1.type == "请假" && form1.holidayTypeId == 8'>
					<el-input v-model="form1.remainDays" disabled></el-input>
				</el-form-item>

				<el-form-item label="附件上传" v-if='form1.type == "请假"' id='file3'>
					<el-upload class="upload-demo" ref="upload3" action="/perTaxToolTwo/attendanceapplyholidayController/insert"
					 :on-change="setupload3" :before-remove="beforeRemove" :file-list="fileList3" :limit="1" :auto-upload="false"
					 :data='uploadData3' :on-success='handelSuccess'>
						<el-button slot="trigger" size="small" type="primary">选取文件</el-button>
					</el-upload>
				</el-form-item>
				<el-form-item label="请假原因" v-if='form1.type == "请假"'>
					<el-input rows="3" type='textarea' v-model="form1.holidayReasons"></el-input>
				</el-form-item>

				<!-- 加班 -->
				<el-form-item label="开始时间" v-if='form1.type == "加班"'>
					<el-date-picker v-model="form1.workOvertimeStart" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss"
					 placeholder="请选择开始时间" @change="calDate(2)"></el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" v-if='form1.type == "加班"'>
					<el-date-picker v-model="form1.workOvertimeEnd" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss"
					 placeholder="请选择结束时间" :disabled="!form1.workOvertimeStart" @change="calDate(2)"></el-date-picker>
				</el-form-item>
				<el-form-item label="共计" v-if='form1.type == "加班"'>
					<el-input v-model="form1.totalDays"></el-input>天(半天/4小时为单位，不满四小时不算加班)
				</el-form-item>

				<el-form-item label="加班原因" v-if='form1.type == "加班"'>
					<el-input v-model="form1.workOvertimeReasons"></el-input>
				</el-form-item>

				<!-- 调休 -->
				<el-form-item label="开始时间" v-if='form1.type == "调休"'>
					<el-date-picker v-model="form1.paidLeaveStartTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss"
					 placeholder="请选择开始时间" @change="calDate(3)"></el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" v-if='form1.type == "调休"'>
					<el-date-picker v-model="form1.paidLeaveEndTime" type="datetime" format="yyyy-MM-dd HH:mm" value-format="yyyy-MM-dd HH:mm:ss"
					 placeholder="请选择结束时间" :disabled="!form1.paidLeaveStartTime" @change="calDate(3)"></el-date-picker>
				</el-form-item>
				<el-form-item label="共计" v-if='form1.type == "调休"'>
					<el-input v-model="form1.totalDays"></el-input>天(半天/4小时为单位，不满四小时按四小时算)
				</el-form-item>

				<el-form-item label="调休原因" v-if='form1.type == "调休"'>
					<el-input v-model="form1.paidLeaveReasons"></el-input>
				</el-form-item>
				<el-form-item label="附件" v-if='form1.type == "调休"'>
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove2" :on-change="onChange2" :on-success="handleSuccess"
					 action='#' :on-error="handleError" :auto-upload="false" :before-remove="beforeRemove" multiple :limit="100"
					 :on-exceed="handleExceed" :file-list="fileList2">
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>
				</el-form-item>

			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click='addInduction' v-show='tag == 0'>保存</span>
				<span class='commit' @click='editInduction' v-show='tag == 1'>保存</span>
				<span class='close' @click="hideAddDialog">关闭</span>
			</div>
		</el-dialog>


		<!-- 加班单抵用 -->
		<el-dialog title="" :visible.sync="dialogTableVisible" width="1000px">
			<el-table :data="detail10" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading' @selection-change="handleSelectionChange">>
				<el-table-column align="center" type="selection" width="50"></el-table-column>
				<el-table-column align="center" label="加班原因" prop="workOvertimeReasons" :resizable="false"></el-table-column>
				<el-table-column align="center" label="开始时间" prop="workOvertimeStart" :resizable="false"></el-table-column>
				<el-table-column align="center" label="结束时间" prop="workOvertimeEnd" :resizable="false"></el-table-column>
				<el-table-column align="center" label="工号" prop="ausercode" :resizable="false"></el-table-column>
				<el-table-column align="center" label="姓名" prop="ausername" :resizable="false"></el-table-column>

				<el-table-column align="center" label="部门" prop="adepartment" :resizable="false"></el-table-column>
				<el-table-column align="center" label="创建时间" prop="createTime" width="120" :resizable="false"></el-table-column>
				<el-table-column align="center" label="加班时长" prop="totalHours" :resizable="false"></el-table-column>

			</el-table>
			<el-pagination background layout="prev, pager, next" :total="total10" :page-size='pageSize10' @current-change='handleCurrentChange10'
			 :current-page="currentPage10">
			</el-pagination>

			<div class='btn_contain clearfix'>
				<span class='commit' @click='split'>拆分</span>
				<span class='commit' @click='commit'>提交</span>
				<span class='close' @click="hideDialog">关闭</span>
			</div>
		</el-dialog>


		<!-- 调休折现 -->
		<el-dialog title="" :visible.sync="dialogVisible2" width="1000px">
			<el-table :data="detail4" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading' @selection-change="handleSelectionChange4">>
				<el-table-column align="center" type="selection" width="50"></el-table-column>
				<el-table-column align="center" label="加班原因" prop="workOvertimeReasons" :resizable="false"></el-table-column>
				<el-table-column align="center" label="开始时间" prop="workOvertimeStart" :resizable="false"></el-table-column>
				<el-table-column align="center" label="结束时间" prop="workOvertimeEnd" :resizable="false"></el-table-column>
				<el-table-column align="center" label="工号" prop="ausercode" :resizable="false"></el-table-column>
				<el-table-column align="center" label="姓名" prop="ausername" :resizable="false"></el-table-column>

				<el-table-column align="center" label="部门" prop="adepartment" :resizable="false"></el-table-column>
				<el-table-column align="center" label="创建时间" prop="createTime" width="120" :resizable="false"></el-table-column>
				<el-table-column align="center" label="加班时长" prop="totalHours" :resizable="false"></el-table-column>

			</el-table>
			<el-pagination background layout="prev, pager, next" :total="total4" :page-size='pageSize4' @current-change='handleCurrentChange4'
			 :current-page="currentPage4">
			</el-pagination>

			<div class='btn_contain clearfix'>
				<span class='commit' @click='commitTXZX'>提交</span>
				<span class='close' @click="hideDialog1">关闭</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				range: '1',
				activeName: 'first',
				loading: false,
				formInline: {
					userName: '',
					userNickName: '',
					roleId: ''
				},
				tag: 0,
				typeList: [{
						label: '请假',
						value: 'qj'
					},
					{
						label: '加班',
						value: 'jb'
					},
					{
						label: '调休',
						value: 'tx'
					},
				],
				form1: {
					type: '请假',
					totalDays: 0

				},
				detail: [],
				detail1: [],
				detail2: [],
				detail3: [],
				detail4: [],
				detail10: [],

				dialogVisible: false,
				dialogVisible2: false,
				dialogTableVisible: false,
				type: 'qj',
				userId: '',
				tableList: [],
				fileList3: [],
				uploadData3: {},

				total: 0,
				currentPage: 1,
				pageSize: 10,

				total1: 0,
				currentPage1: 1,
				pageSize1: 10,

				total2: 0,
				currentPage2: 1,
				pageSize2: 10,

				total3: 0,
				currentPage3: 1,
				pageSize3: 10,

				total4: 0,
				currentPage4: 1,
				pageSize4: 10,

				total10: 0,
				currentPage10: 1,
				pageSize10: 10,
				multipleSelection: [],
				multipleSelection1: [],
				paidLeaveId: '',
				fileList2: []
			}
		},
		components: {},
		methods: {
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
			handleSuccess(response) {
				if (response.code == 200) {
					this.fileList2 = [];
					this.$message({
						message: response.msg,
						type: "success"
					});
				} else {
					this.fileList2 = [];
					this.$message({
						message: response.msg || "上传文件失败！",
						type: "error"
					});
				}
			},
			handleError(err) {
				this.fileList2 = [];
				this.$message({
					message: "上传文件失败！",
					type: "error"
				});
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 100 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			queryListByPage() {
				let param = {
					keywords: this.keywords
				};
				this.axios.post('/perTaxToolTwo/attendanceholidaytypeController/getPageList?pageIndex=1&rows=1000', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.tableList = res.data.data.rows;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			queryList() {
				let params = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {

					}
				};
				this.axios.post('/perTaxToolTwo/attendanceapplyholidayController/queryPageList', params).then(res => {
					if (res.data.code == 200) {
						this.total = res.data.count;
						this.detail = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			queryListJB() {
				let params = {
					"page": this.currentPage1,
					"row": this.pageSize1,
					"data": {

					}
				};
				this.axios.post('/perTaxToolTwo/attendanceapplyworkovertimeController/queryPageList', params).then(res => {
					if (res.data.code == 200) {
						this.total1 = res.data.count;
						this.detail1 = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取调休列表失败',
						type: 'error'
					});
				})
			},
			queryListTX() {
				let params = {
					"page": this.currentPage2,
					"row": this.pageSize2,
					"data": {

					}
				};
				this.axios.post('/perTaxToolTwo/attendanceapplypaidleaveController/queryPageList', params).then(res => {
					if (res.data.code == 200) {
						this.total2 = res.data.count;
						this.detail2 = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取加班列表失败',
						type: 'error'
					});
				})
			},
			queryListTXZX() {
				let params = {
					"data": {
						"pageNum": this.currentPage3,
						"pageSize": this.pageSize3
					}
				};
				this.axios.post('/perTaxToolTwo/attendanceApplySalaryWithWorkOvertimeController/get', params).then(res => {
					if (res.data.code == 200) {
						this.total3 = res.data.count;
						this.detail3 = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取加班列表失败',
						type: 'error'
					});
				})
			},
			applyQJ(row) {
				this.axios.get('/perTaxToolTwo/attendanceapplyholidayController/apply/' + row.holidayId).then(res => {
					if (res.data.code == 200) {
						this.queryList()
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取加班列表失败',
						type: 'error'
					});
				})
			},
			applyJB(row) {
				this.axios.get('/perTaxToolTwo/attendanceapplyworkovertimeController/apply/' + row.workOvertimeId).then(res => {
					if (res.data.code == 200) {
						this.queryListJB()
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取加班列表失败',
						type: 'error'
					});
				})
			},
			applyTX(row) {
				this.dialogTableVisible = true;
				this.paidLeaveId = row.paidLeaveId;
				this.currentPage10 = 1;
				this.getTXD();

			},
			applyTXZX(row) {
				let params = [row];
				this.axios.post('/perTaxToolTwo/attendanceApplySalaryWithWorkOvertimeController/apply', params).then(res => {
					if (res.data.code == 200) {
						this.queryListTXZX();
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '调休折现失败',
						type: 'error'
					});
				})
			},
			getTXD() {
				let params = {
					row: this.pageSize10,
					page: this.currentPage10,
					data: {
						paidLeaveId: this.paidLeaveId,
						toUse: "0"
					}

				};
				this.axios.post('/perTaxToolTwo/attendancepaidleavetouseworkovertimeController/getPageList', params).then(res => {
					if (res.data.code == 200) {
						this.detail10 = res.data.data;
						this.total10 = res.data.count;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取加班单失败',
						type: 'error'
					});
				})
			},
			getTXZX() {
				let params = {
					row: this.pageSize4,
					page: this.currentPage4,
					data: {}

				};
				this.axios.post('/perTaxToolTwo/attendancepaidleavetouseworkovertimeController/getPageList', params).then(res => {
					if (res.data.code == 200) {
						this.detail4 = res.data.data;
						this.total4 = res.data.count;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取加班单失败',
						type: 'error'
					});
				})
			},
			split() {
				if (this.multipleSelection.length == 1) {
					let params = this.multipleSelection[0];
					this.axios.post('/perTaxToolTwo/attendanceapplyworkovertimeController/split', params).then(res => {
						if (res.data.code == 200) {
							this.getTXD();
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
						this.$message({
							message: '拆分加班单失败',
							type: 'error'
						});
					})
				} else {
					this.$message({
						message: '请选择抵用加班单',
						type: 'warning'
					});
				}
			},
			commit() {
				if (this.multipleSelection.length > 0) {
					let params = {
						paidLeaveId: this.paidLeaveId,
						usedWorks: this.multipleSelection
					}
					this.axios.post('/perTaxToolTwo/attendanceapplypaidleaveController/apply', params).then(res => {
						if (res.data.code == 200) {
							this.dialogTableVisible = false;
							this.queryListTX()
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
						this.$message({
							message: '获取加班列表失败',
							type: 'error'
						});
					})
				} else {
					this.$message({
						message: '请选择抵用加班单',
						type: 'warning'
					});
				}

			},
			commitTXZX() {
				if (this.multipleSelection1.length > 0) {
					let params = this.multipleSelection1;
					this.axios.post('/perTaxToolTwo/attendanceApplySalaryWithWorkOvertimeController/apply', params).then(res => {
						if (res.data.code == 200) {
							this.dialogVisible2 = false;
							this.queryListTXZX()
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
						this.$message({
							message: '获取加班列表失败',
							type: 'error'
						});
					})
				} else {
					this.$message({
						message: '请选择抵用加班单',
						type: 'warning'
					});
				}

			},
			add() {
				this.tag = 0;
				this.dialogVisible = true;
				this.getSickLeave();
			},

			addTXZX() {
				this.dialogVisible2 = true;
				this.currentPage4 = 1;
				this.getTXZX();
			},

			hideAddDialog() {
				this.dialogVisible = false;
				this.form1 = {
					type: '请假'
				}
			},
			filter(val) {
				this.tableList.forEach((item, index) => {
					if (item.holidayTypeId == this.form1.holidayTypeId) {
						this.form1.holidayDescription = item.holidayDescription
					}
				})
				if (val == 8) {
					this.queryYearHolidayList();
				}
			},
			queryYearHolidayList(val) {
				let params = {
					"row": 1,
					"page": 1,
					"data": {
						"userCode": JSON.parse(sessionStorage.getItem('updateUser')).phone,
					}

				};
				this.axios.post('/perTaxToolTwo/attendanceapplyholidayController/queryYearHolidayList', params)
					.then(res => {
						if (res.data.code == 200) {
							this.$set(this.form1, 'days', res.data.data[0].days);
							this.$set(this.form1, 'remainDays', res.data.data[0].remainDays);
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
			setType() {
				switch (this.type) {
					case 'qj':
						this.queryList()
						break;
					case 'jb':
						this.queryListJB();
						break;
					case 'tx':
						this.queryListTX();
						break;
				}
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryList()
			},
			handleCurrentChange1(val) {
				this.currentPage1 = val;
				this.queryListJB();
			},
			handleCurrentChange2(val) {
				this.currentPage2 = val;
				this.queryListTX();
			},
			handleCurrentChange10(val) {
				this.currentPage10 = val;
				this.getTXD();
			},
			handleCurrentChange4(val) {
				this.currentPage4 = val;
				this.getTXZX();
			},
			hideDialog() {
				this.dialogTableVisible = false;
			},
			hideDialog1() {
				this.dialogVisible2 = false;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleSelectionChange4(val) {
				this.multipleSelection1 = val;
			},
			getSickLeave() {
				this.axios.get('/perTaxToolTwo/attendanceapplyholidayController/getSickLeave').then(res => {
					if (res.data.code == 200) {
						this.$set(this.form1, 'days', res.data.data.sickLeave);
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				})
			},
			addInduction() {
				console.log(this.fileList3);
				switch (this.form1.type) {
					case '请假':
						if (this.form1.holidayTypeId == 3) {
							var params1 = {
								holidayTypeId: this.form1.holidayTypeId,
								holidayStartTime: this.form1.holidayStartTime,
								holidayEndTime: this.form1.holidayEndTime,
								sickLeave: this.form1.sickLeave,
							};
						} else {
							var params1 = {
								holidayTypeId: this.form1.holidayTypeId,
								holidayStartTime: this.form1.holidayStartTime,
								holidayEndTime: this.form1.holidayEndTime
							};
						}


						this.axios.post('/perTaxToolTwo/attendanceapplyholidayController/checkHoliday', params1).then(res => {
							if (res.data.code == 200) {
								if (this.fileList3.length > 0) {
									this.$refs.upload3.submit();
								} else {
									var params = this.form1;

									this.axios.post('/perTaxToolTwo/attendanceapplyholidayController/insert', this.qs.stringify(params), {
										headers: {
											'Content-Type': 'application/x-www-form-urlencoded',
										}
									}).then(res => {
										if (res.data.code == 200) {
											this.dialogVisible = false;
											this.type = 'qj';
											this.queryList();
										} else {
											this.$message({
												message: res.data.msg,
												type: 'error'
											});
										}

									}).catch(function(err) {
										this.$message({
											message: '申请请假失败',
											type: 'error'
										});
									})
								}
							} else {
								this.$message({
									message: res.data.msg,
									type: 'error'
								});
							}

						}).catch(function(err) {
							this.$message({
								message: '申请请假失败',
								type: 'error'
							});
						})


						break;
					case '加班':
						var params1 = {
							workOvertimeEnd: this.form1.workOvertimeEnd,
							workOvertimeStart: this.form1.workOvertimeStart,
						};
						this.axios.post('/perTaxToolTwo/attendanceapplyworkovertimeController/checkSameday', params1).then(res => {
							if (res.data.code == 200) {
								var params = this.form1;
								this.axios.post('/perTaxToolTwo/attendanceapplyworkovertimeController/insert', params).then(res => {
									if (res.data.code == 200) {
										this.dialogVisible = false;
										this.type = 'jb';
										this.queryListJB();
									} else {
										this.$message({
											message: res.data.msg,
											type: 'error'
										});
									}

								}).catch(function(err) {
									this.$message({
										message: '申请加班失败',
										type: 'error'
									});
								})
							} else {
								this.$message({
									message: res.data.msg,
									type: 'error'
								});
							}

						}).catch(function(err) {
							this.$message({
								message: '申请加班失败',
								type: 'error'
							});
						})

						break;
					case '调休':
						var params1 = {
							paidLeaveEndTime: this.form1.paidLeaveEndTime,
							paidLeaveStartTime: this.form1.paidLeaveStartTime,
						};
						this.axios.post('/perTaxToolTwo/attendanceapplypaidleaveController/checkSameday', params1).then(res => {
							if (res.data.code == 200) {
								var params = this.form1;
								var formData = new FormData();
								this.fileList2.forEach(file => {
									formData.append('file', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								for (var x in this.form1) {
									formData.append(x, this.form1[x]);
								}
								this.axios.post('/perTaxToolTwo/attendanceapplypaidleaveController/insert', formData, {
									headers: {
										'Content-Type': 'application/x-www-form-urlencoded'
									}
								}).then(res => {
									if (res.data.code == 200) {
										this.dialogVisible = false;
										this.type = 'tx';
										this.queryListTX();
									} else {
										this.$message({
											message: res.data.msg,
											type: 'error'
										});
									}

								}).catch(function(err) {
									this.$message({
										message: '申请调休失败',
										type: 'error'
									});
								})
							} else {
								this.$message({
									message: res.data.msg,
									type: 'error'
								});
							}

						}).catch(function(err) {
							this.$message({
								message: '获取申请离职列表失败',
								type: 'error'
							});
						})

						break;
				}



			},

			editInduction() {
				switch (this.form1.type) {
					case '请假':
						if (this.fileList3.length > 0) {
							this.$refs.upload3.submit();
						} else {
							var params = this.form1;
							this.axios.post('/perTaxToolTwo/attendanceapplyholidayController/update', params).then(res => {
								if (res.data.code == 200) {
									this.dialogVisible = false;
									this.type = 'qj';
									this.queryList();
								} else {
									this.$message({
										message: res.data.msg,
										type: 'error'
									});
								}

							}).catch(function(err) {
								this.$message({
									message: '申请请假失败',
									type: 'error'
								});
							})
						}

						break;
					case '加班':
						var params = this.form1;
						this.axios.post('/perTaxToolTwo/attendanceapplyworkovertimeController/update', params).then(res => {
							if (res.data.code == 200) {
								this.dialogVisible = false;
								this.type = 'jb';
								this.queryListJB();
							} else {
								this.$message({
									message: res.data.msg,
									type: 'error'
								});
							}

						}).catch(function(err) {
							this.$message({
								message: '申请加班失败',
								type: 'error'
							});
						})
						break;
					case '调休':
						var params = this.form1;
						this.axios.post('/perTaxToolTwo/attendanceapplypaidleaveController/update', params).then(res => {
							if (res.data.code == 200) {
								this.dialogVisible = false;
								this.type = 'tx';
								this.queryListTX();
							} else {
								this.$message({
									message: res.data.msg,
									type: 'error'
								});
							}

						}).catch(function(err) {
							this.$message({
								message: '获取申请离职列表失败',
								type: 'error'
							});
						})
						break;
				}
			},
			setupload3(file, fileList) {
				console.log(fileList);
				this.fileList3 = fileList;
				this.uploadData3 = this.form1;
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			handelSuccess() {
				this.dialogVisible = false;
				this.queryList();
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},


			editQJ(row) {
				this.dialogVisible = true;
				this.form1 = JSON.parse(JSON.stringify(row));
				this.form1.type = '请假';
				this.tag = 1;
			},
			editJB(row) {
				this.dialogVisible = true;
				this.form1 = JSON.parse(JSON.stringify(row));
				this.form1.type = '加班';
				this.tag = 1;
			},
			editTX(row) {
				this.dialogVisible = true;
				this.form1 = JSON.parse(JSON.stringify(row));
				this.form1.type = '调休';
				this.tag = 1;
			},
			delQJ(row) {
				this.$confirm('确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = [{
						holidayId: row.holidayId
					}];
					this.axios.post('/perTaxToolTwo/attendanceapplyholidayController/delete', params).then(res => {
						if (res.data.code == 200) {
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
							message: '删除失败',
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
			delJB(row) {
				this.$confirm('确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = [{
						workOvertimeId: row.workOvertimeId
					}];
					this.axios.post('/perTaxToolTwo/attendanceapplyworkovertimeController/delete', params).then(res => {
						if (res.data.code == 200) {
							this.queryListJB();
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
							message: '删除失败',
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
			delTX(row) {
				this.$confirm('确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = [{
						paidLeaveId: row.paidLeaveId
					}];
					this.axios.post('/perTaxToolTwo/attendanceapplypaidleaveController/delete', params).then(res => {
						if (res.data.code == 200) {
							this.queryListTX();
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
							message: '删除失败',
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

			undoQJ(row) {
				this.$confirm('确认撤销?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {
						holidayId: row.holidayId,
						ausername: row.ausername,
					};
					this.axios.post('/perTaxToolTwo/attendanceapplyholidayController/withdrawalAttendanceApplyHoilday', params).then(
						res => {
							if (res.data.code == 200) {
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
							message: '撤销失败',
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
			undoJB(row) {
				this.$confirm('确认撤销?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {
						workOvertimeId: row.workOvertimeId,
						ausername: row.ausername,
					};
					this.axios.post('/perTaxToolTwo/attendanceapplyworkovertimeController/withdrawalAttendanceApplyWorkOvertime',
						params).then(res => {
						if (res.data.code == 200) {
							this.queryListJB();
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
							message: '撤销失败',
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

			undoTX(row) {
				this.$confirm('确认撤销?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = {
						paidLeaveId: row.paidLeaveId,
						ausername: row.ausername,
					};
					this.axios.post('/perTaxToolTwo/attendanceapplypaidleaveController/withdrawalAttendanceApplyPaidLeave', params).then(
						res => {
							if (res.data.code == 200) {
								this.queryListTX();
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
							message: '撤销失败',
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

			undoTXZX(row) {
				this.$confirm('确认撤销?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					var params = [row];
					this.axios.post('/perTaxToolTwo/attendanceApplySalaryWithWorkOvertimeController/withdraw', params).then(
						res => {
							if (res.data.code == 200) {
								this.queryListTXZX();
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
							message: '撤销失败',
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

			calDate(index) {
				if (this.form1.holidayStartTime && this.form1.holidayEndTime && index == 1) {
					var params = {
						starttime: this.form1.holidayStartTime,
						endtime: this.form1.holidayEndTime,
					};
					this.axios.post('/perTaxToolTwo/attendanceapplyholidayController/calDate', params).then(res => {
						if (res.data.code == 200) {
							this.$set(this.form1, 'totalDays', res.data.data);
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
						this.$message({
							message: '计算失败',
							type: 'error'
						});
					})

				} else if (this.form1.workOvertimeStart && this.form1.workOvertimeEnd && index == 2) {
					var params = {
						starttime: this.form1.workOvertimeStart,
						endtime: this.form1.workOvertimeEnd,
					};
					this.axios.post('/perTaxToolTwo/attendanceapplyworkovertimeController/workovertimeCalDate', params).then(res => {
						if (res.data.code == 200) {
							this.$set(this.form1, 'totalDays', res.data.data);
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
						this.$message({
							message: '计算失败',
							type: 'error'
						});
					})
				} else if (this.form1.paidLeaveStartTime && this.form1.paidLeaveEndTime && index == 3) {
					var params = {
						starttime: this.form1.paidLeaveStartTime,
						endtime: this.form1.paidLeaveEndTime,
					};
					this.axios.post('/perTaxToolTwo/attendanceapplypaidleaveController/paidleaveCalDate', params).then(res => {
						if (res.data.code == 200) {
							this.$set(this.form1, 'totalDays', res.data.data);
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
						this.$message({
							message: '计算失败',
							type: 'error'
						});
					})
				}

			},
			reset() {
				// this.form1.totalDays = ''
				this.$set(this.form1, 'totalDays', 0);
			}
		},
		watch: {

		},

		created() {
			//获取请假单类型
			this.queryListByPage()
			this.queryList();
			this.queryListJB();
			this.queryListTX();

			this.queryListTXZX();
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

		.commit {
			width: 1.5rem;
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
			width: 1.5rem;
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
		position: relative;
		// padding:0px 20px;
		background: #fff;
		margin: 20px 20px;

		h3 {
			height: 40px;
			line-height: 40px;
			padding-left: 20px
		}

	}

	/deep/ .el-tabs__header {
		padding: 0px 20px 0px 40px;
		margin: 0px;
	}

	/deep/ .el-tabs__content {
		padding-top: 10px;
		background: rgb(243, 246, 249);
	}

	/deep/ .el-tabs__nav-wrap::after {
		content: "";
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 0px;
		background-color: #E4E7ED;
		z-index: 1;
	}

	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
	}

	/deep/ .el-table table {
		background-color: rgb(243, 246, 249);
		border-collapse: separate;
		border-spacing: 0px 3px;
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
		background-color: #fff;
	}

	/deep/ .el-table__body tr.el-table__row--striped {
		background-color: #ebf6fb;
	}

	/deep/ .el-table thead {
		color: #343434;
	}

	/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #fff;
	}

	/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
		border-bottom-color: #fff;
		background: #ebf6fb;
	}
</style>
