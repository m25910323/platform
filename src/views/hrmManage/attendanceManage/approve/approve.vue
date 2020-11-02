<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>行政管理</el-breadcrumb-item>
			<el-breadcrumb-item>假勤管理</el-breadcrumb-item>

			<el-breadcrumb-item>假勤审批</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body">
			<h3>假勤审批</h3>
			<el-radio-group v-model="holidayDate" size="mini" style='top:40px;right: 20px;position: absolute;z-index: 10;'>
				<el-radio-button :label="monthRange">本月内</el-radio-button>
				<el-radio-button :label="yearRange">本年内</el-radio-button>
			</el-radio-group>
			<el-date-picker v-model="holidayDate" type="month" placeholder="选择日期" size="mini" value-format="yyyy-MM" format="yyyy-MM"
			 style='top:40px;right: 170px;position: absolute;z-index: 10;'>
			</el-date-picker>

			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane name="first">
					<span slot="label">

						<span>请假审批
							<el-badge :value="total1" :max="99" class="item" />
						</span>

					</span>
					<el-button type="primary" size='mini' @click='passQJ' style='margin-bottom:10px;margin-left:20px;'>批量审批</el-button>
					<el-table :data="tableList1" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange">
						<el-table-column align="center" type="selection" width="50"></el-table-column>
						<el-table-column align="center" label="请假原因" prop="holidayReasons" :resizable="false"></el-table-column>
						<el-table-column align="center" label="请假类别" prop="holidayTypeName" :resizable="false"></el-table-column>
						<el-table-column align="center" label="开始时间" prop="holidayStartTime" :resizable="false"></el-table-column>
						<el-table-column align="center" label="结束时间" prop="holidayEndTime" :resizable="false"></el-table-column>
						<el-table-column align="center" label="天数" prop="totalDays" :resizable="false"></el-table-column>
						<el-table-column align="center" label="带薪病假天数" prop="sickLeave" :resizable="false"></el-table-column>
						<el-table-column align="center" label="附件" prop="filePath" :resizable="false">
							<template slot-scope="scope">
								<!-- <el-tag @click='downLoad(scope.row)'>{{scope.row.filePath}}</el-tag> -->
								<el-button size="mini" type="text" @click="downLoad(scope.row)" v-show="scope.row.filePath">查看</el-button>
							</template>
						</el-table-column>
						<el-table-column align="center" label="申请人工号" prop="ausercode" :resizable="false"></el-table-column>
						<el-table-column align="center" label="申请人姓名" prop="ausername" :resizable="false"></el-table-column>
						<!-- <el-table-column align="center" label="上班签到" prop="startperiod" :resizable="false"></el-table-column>
						<el-table-column align="center" label="下班签到" prop="endperiod" :resizable="false"></el-table-column> -->
						<el-table-column align="center" label="所属部门" prop="adepartment" :resizable="false"></el-table-column>
						<el-table-column align="center" label="创建时间" prop="createTime" :resizable="false"></el-table-column>
						<el-table-column align="center" :resizable="false">
							<template slot="header" slot-scope="scope">
								<span>操作</span>
							</template>
							<template slot-scope="scope">
								<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">通过</el-button>
								<el-button size="mini" type="text" @click="handleCancel(scope.$index, scope.row)">驳回</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange1(val)})"
					 :current-page="currentPage1" :page-size="pageSize" layout="total, prev, pager, next" :total="total1">
					</el-pagination>
				</el-tab-pane>
				<el-tab-pane name="second">
					<span slot="label">

						<span>加班审批
							<el-badge :value="total2" :max="99" class="item" />
						</span>

					</span>
					<el-button type="primary" size='mini' @click='passJB' style='margin-bottom: 10px;margin-left:20px;'>批量审批</el-button>
					<el-table :data="tableList2" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange2">
						<el-table-column align="center" type="selection" width="50"></el-table-column>

						<el-table-column align="center" label="加班原因" prop="workOvertimeReasons" :resizable="false"></el-table-column>
						<el-table-column align="center" label="开始时间" prop="workOvertimeStart" :resizable="false"></el-table-column>
						<el-table-column align="center" label="结束时间" prop="workOvertimeEnd" :resizable="false"></el-table-column>
						<el-table-column align="center" label="天数" prop="totalDays" :resizable="false"></el-table-column>
						<el-table-column align="center" label="申请人工号" prop="ausercode" :resizable="false"></el-table-column>
						<el-table-column align="center" label="申请人姓名" prop="ausername" :resizable="false"></el-table-column>
						<!-- <el-table-column align="center" label="上班签到" prop="startperiod" :resizable="false"></el-table-column>
						<el-table-column align="center" label="下班签到" prop="endperiod" :resizable="false"></el-table-column> -->
						<el-table-column align="center" label="所属部门" prop="adepartment" :resizable="false"></el-table-column>
						<el-table-column align="center" label="创建时间" prop="createTime" :resizable="false"></el-table-column>
						<el-table-column align="center" :resizable="false">
							<template slot="header" slot-scope="scope">
								<span>操作</span>
							</template>
							<template slot-scope="scope">
								<el-button size="mini" type="text" @click="handleJBPass(scope.$index, scope.row)">通过</el-button>
								<el-button size="mini" type="text" @click="handleJBNoPass(scope.$index, scope.row)">驳回</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange2(val)})"
					 :current-page="currentPage2" :page-size="pageSize" layout="total, prev, pager, next" :total="total2">
					</el-pagination>
				</el-tab-pane>
				<el-tab-pane name="third">
					<span slot="label">

						<span>调休审批
							<el-badge :value="total3" :max="99" class="item" />
						</span>

					</span>
					<el-button type="primary" size='mini' @click='passTX' style='margin-bottom: 10px;margin-left:20px;'>批量审批</el-button>
					<el-table :data="tableList3" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange3">
						<el-table-column align="center" type="selection" width="50"></el-table-column>

						<el-table-column align="center" label="调休原因" prop="paidLeaveReasons" :resizable="false"></el-table-column>
						<el-table-column align="center" label="开始时间" prop="paidLeaveStartTime" :resizable="false"></el-table-column>
						<el-table-column align="center" label="结束时间" prop="paidLeaveEndTime" :resizable="false"></el-table-column>
						<el-table-column align="center" label="天数" prop="totalDays" :resizable="false"></el-table-column>
						<el-table-column align="center" label="申请人工号" prop="ausercode" :resizable="false"></el-table-column>
						<el-table-column align="center" label="申请人姓名" prop="ausername" :resizable="false"></el-table-column>
						<!-- <el-table-column align="center" label="上班签到" prop="startperiod" :resizable="false"></el-table-column>
						<el-table-column align="center" label="下班签到" prop="endperiod" :resizable="false"></el-table-column> -->
						<el-table-column align="center" label="所属部门" prop="adepartment" :resizable="false"></el-table-column>
						<el-table-column align="center" label="创建时间" prop="createTime" :resizable="false"></el-table-column>
						<el-table-column align="center" :resizable="false">
							<template slot="header" slot-scope="scope">
								<span>操作</span>
							</template>
							<template slot-scope="scope">
								<el-button size="mini" type="text" @click="handlePass(scope.$index, scope.row)">通过</el-button>
								<el-button size="mini" type="text" @click="handleNoPass(scope.$index, scope.row)">驳回</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange3(val)})"
					 :current-page="currentPage3" :page-size="pageSize" layout="total, prev, pager, next" :total="total3">
					</el-pagination>
				</el-tab-pane>

				<el-tab-pane name="forth">
					<span slot="label">

						<span>考勤审批
							<el-badge :value="total4" :max="99" class="item" />
						</span>

					</span>
					<el-button type="primary" size='mini' @click='passKQ' style='margin-bottom:10px;margin-left:20px;'>批量审批</el-button>
					<el-table :data="tableList4" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange4">
						<el-table-column align="center" type="selection" width="50"></el-table-column>
						<el-table-column align="center" label="异常原因" prop="cardExceptionReasons" :resizable="false"></el-table-column>
						<el-table-column align="center" label="异常日期" prop="cardExceptionDate" :resizable="false"></el-table-column>
						<el-table-column align="center" label="申请人工号" prop="ausercode" :resizable="false"></el-table-column>
						<el-table-column align="center" label="申请人姓名" prop="ausername" :resizable="false"></el-table-column>
						<el-table-column align="center" label="所属部门" prop="adepartment" :resizable="false"></el-table-column>

						<el-table-column align="center" label="创建时间" prop="createTime" :resizable="false"></el-table-column>
						<el-table-column align="center" width="240" :resizable="false">
							<template slot="header" slot-scope="scope">
								<span>操作</span>
							</template>
							<template slot-scope="scope">
								<el-button size="mini" type="text" @click="handle(scope.$index, scope.row)">通过</el-button>
								<el-button size="mini" type="text" @click="handleNopass(scope.$index, scope.row)">不通过</el-button>

							</template>
						</el-table-column>
					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange4(val)})"
					 :current-page="currentPage4" :page-size="pageSize" layout="total, prev, pager, next" :total="total4">
					</el-pagination>
				</el-tab-pane>

				<el-tab-pane name="fifth">
					<span slot="label">

						<span>调休折现审批
							<el-badge :value="total5" :max="99" class="item" />
						</span>

					</span>
					<!-- <el-button type="primary" size='mini' @click='passTXZX' style='margin-bottom:10px;margin-left:20px;'>批量审批</el-button> -->

					<el-table :data="tableList5" style="width: 100%;" v-loading='loading'>
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
								<el-button size="mini" type="text" @click="handleTXZX(scope.$index, scope.row)">通过</el-button>
								<el-button size="mini" type="text" @click="handleNopassTXZX(scope.$index, scope.row)">不通过</el-button>

							</template>
						</el-table-column>

					</el-table>
					<el-pagination background layout="prev, pager, next" :total="total5" :page-size='pageSize' @current-change='handleCurrentChange5'
					 :current-page="currentPage5">
					</el-pagination>
				</el-tab-pane>
			</el-tabs>



		</div>
	</div>

</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				range: '1',
				activeName: 'first',
				index: 1,
				loading: false,
				formInline1: {
					departId: '-1',
				},
				formInline2: {
					departId: '-1',
				},
				formInline3: {
					departId: '-1',
				},
				bankname: '',
				customername: '',
				form: {},
				currentPage1: 1,
				currentPage2: 1,
				currentPage3: 1,
				currentPage4: 1,
				currentPage5: 1,
				pageSize: 10,
				total3: 0,
				total1: 0,
				total2: 0,
				total4: 0,
				total5: 0,
				tableList1: [],
				tableList2: [],
				tableList3: [],
				tableList4: [],
				tableList5: [],
				dialogVisible: false,
				innerVisible: false,
				departList: [],
				humanList: [],
				// holidayDate: 'month',
				monthRange: this.formatTimeToStr(new Date(), "yyyy-MM"),
				yearRange: this.formatTimeToStr(new Date(), "yyyy"),
				holidayDate: this.formatTimeToStr(new Date(), "yyyy-MM"),
				tongji: '',

				percentage1: 0,
				percentage2: 0,
				percentage3: 0,
				percentage4: 0,
				percentage5: 0,
				percentage6: 0,
				multipleSelection: [],
				multipleSelection2: [],
				multipleSelection3: [],
				multipleSelection5: [],
			}
		},
		components: {},
		methods: {

			downLoad(row) {
				window.open(row.filePath);
			},
			//入参：本年或者本月holidayDate
			queryListByPage1() {
				this.loading = true;
				let param = {
					row: this.pageSize,
					page: this.currentPage1,
					data: {
						"keywords": "",
						"adepartId": "-1",
						"ausercode": "",
						holidayDate: this.holidayDate
					}

				};
				this.axios.post('/perTaxToolTwo/attendanceapplyholidayController/queryApprovePageList', param)
					.then(
						res => {
							this.loading = false;
							if (res.data.code == 200) {
								this.total1 = res.data.count;
								this.tableList1 = res.data.data;
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

			queryListByPage2() {
				this.loading = true;
				let param = {
					row: this.pageSize,
					page: this.currentPage2,
					data: {
						"keywords": "",
						"adepartId": "-1",
						"ausercode": "",
						holidayDate: this.holidayDate
					}

				};
				this.axios.post('/perTaxToolTwo/attendanceapplyworkovertimeController/queryApprovePageList',
					param).then(
					res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.total2 = res.data.count;
							this.tableList2 = res.data.data;
						} else {
							this.$message({
								message: res.data.msg,
								type: 'success'
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

			queryListByPage3() {
				this.loading = true;
				let param = {
					row: this.pageSize,
					page: this.currentPage3,
					data: {
						"keywords": "",
						"adepartId": "-1",
						"ausercode": "",
						holidayDate: this.holidayDate
					}

				};
				this.axios.post('/perTaxToolTwo/attendanceapplypaidleaveController/queryApprovePageList',
					param).then(
					res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.total3 = res.data.count;
							this.tableList3 = res.data.data;
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

			queryListByPage4() {
				let param = {
					data: {
						adepartId: "-1",
						ausercode: "",
						keywords: "",
						type: this.holidayDate,
					},
					row: this.pageSize,
					page: this.currentPage4,

				};
				this.axios.post(
						'/perTaxToolTwo/attendanceapplycardexceptionController/queryApprovePageList', param)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.total4 = res.data.count;
							this.tableList4 = res.data.data;
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
			
			queryListByPage5() {
				let params = {
					"data": {
						"pageNum": this.currentPage5,
						"pageSize": this.pageSize
					}
				};
				this.axios.post('/perTaxToolTwo/attendanceApplySalaryWithWorkOvertimeController/get', params).then(res => {
					if (res.data.code == 200) {
						this.total5 = res.data.count;
						this.tableList5 = res.data.data;
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

			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleSelectionChange2(val) {
				this.multipleSelection2 = val;
			},
			handleSelectionChange3(val) {
				this.multipleSelection3 = val;
			},
			handleSelectionChange4(val) {
				this.multipleSelection4 = val;
			},
			handleSelectionChange5(val) {
				this.multipleSelection5 = val;
			},
			passQJ() {
				let param = this.multipleSelection;
				this.axios.post('/perTaxToolTwo/attendanceapplyholidayController/approveByAll', param).then(
					res => {
						if (res.data.code == 200) {
							this.queryListByPage1();
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
						message: '驳回失败',
						type: 'error'
					});
				})
			},
			passJB() {
				let param = this.multipleSelection2;
				this.axios.post('/perTaxToolTwo/attendanceapplyworkovertimeController/approveByAll', param).then(
					res => {
						if (res.data.code == 200) {
							this.queryListByPage2();
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
						message: '驳回失败',
						type: 'error'
					});
				})
			},
			passTX() {
				let param = this.multipleSelection3;
				this.axios.post('/perTaxToolTwo/attendanceapplypaidleaveController/approveByAll', param).then(
					res => {
						if (res.data.code == 200) {
							this.queryListByPage3();
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
						message: '驳回失败',
						type: 'error'
					});
				})
			},
			passKQ() {

				this.$prompt('请输入审核意见', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({
					value
				}) => {
					this.multipleSelection4.forEach(item => {
						item.suggestion = value;
					})
					var param = this.multipleSelection4;
					this.axios.post('/perTaxToolTwo/attendanceapplycardexceptionController/approveByAll', param).then(
						res => {
							if (res.data.code == 200) {
								this.queryListByPage4();
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
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});


			},
			handleCancel(index, row) {
				this.$prompt('请输入驳回原因', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({
					value
				}) => {
					let param = {
						holidayId: row.holidayId,
						rejectHolidayReasons: val
					};
					this.axios.post('/perTaxToolTwo/attendanceapplyholidayController/cancel', param).then(
						res => {
							if (res.data.code == 200) {
								this.queryListByPage1();
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
							message: '驳回失败',
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
			handleEdit(index, row) {
				let param = {
					holidayId: row.holidayId
				};
				this.axios.post('/perTaxToolTwo/attendanceapplyholidayController/approve', param).then(
					res => {
						if (res.data.code == 200) {
							this.queryListByPage1();
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
						message: '驳回失败',
						type: 'error'
					});
				})
			},
			handleJBPass(index, row) {
				let param = {
					workOvertimeId: row.workOvertimeId
				};
				this.axios.post('/perTaxToolTwo/attendanceapplyworkovertimeController/approve', param).then(
					res => {
						if (res.data.code == 200) {
							this.queryListByPage2();
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
						message: '驳回失败',
						type: 'error'
					});
				})
			},
			handleJBNoPass(index, row) {
				this.$prompt('请输入驳回原因', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({
					value
				}) => {
					let param = {
						workOvertimeId: row.workOvertimeId,
						rejectWorkOvertimeReasons: value
					};
					this.axios.post('/perTaxToolTwo/attendanceapplyworkovertimeController/cancel', param).then(
						res => {
							if (res.data.code == 200) {
								this.queryListByPage2();
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
							message: '驳回失败',
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
			handlePass(index, row) {
				let param = {
					paidLeaveId: row.paidLeaveId,
					suggestion: ""
				};
				this.axios.post('/perTaxToolTwo/attendanceapplypaidleaveController/approve', param).then(
					res => {
						if (res.data.code == 200) {
							this.queryListByPage3();
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
						message: '驳回失败',
						type: 'error'
					});
				})
			},
			handleNoPass(index, row) {
				this.$prompt('请输入驳回原因', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({
					value
				}) => {
					let param = {
						suggestion: "",
						deloyId: row.deloyId,
						rejectPaidLleaveReasons: value
					};
					this.axios.post('/perTaxToolTwo/attendanceapplycardexceptionController/cancel', param).then(
						res => {
							if (res.data.code == 200) {
								this.queryListByPage3();
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
							message: '驳回失败',
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
			handle(index, row) {
				this.$prompt('请输入审核意见', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({
					value
				}) => {
					let params = {
						cardExceptionId: row.cardExceptionId,
						suggestion: value
					};
					this.axios.post('/perTaxToolTwo/attendanceapplycardexceptionController/approve', params).then(res => {
						if (res.data.code == 200) {
							this.queryListByPage4();
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
							message: '审核失败',
							type: 'error'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});

			},
			handleNopass(index, row) {
				this.$prompt('请输入审核意见', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({
					value
				}) => {
					let params = {
						cardExceptionId: row.cardExceptionId,
						suggestion: value,
						deloyId: row.deloyId
					};
					this.axios.post('/perTaxToolTwo/attendanceapplycardexceptionController/cancel', params).then(res => {
						if (res.data.code == 200) {
							this.queryListByPage4();
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
							message: '审核失败',
							type: 'error'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消输入'
					});
				});

			},
			
			handleTXZX(index,row){
				
					let params = [{
						id: row.id,
						workOvertimeId: row.workOvertimeId,
						docStatus:1
					}];
					this.axios.post('/perTaxToolTwo/attendanceApplySalaryWithWorkOvertimeController/approve', params).then(res => {
						if (res.data.code == 200) {
							this.queryListByPage5();
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
							message: '审核失败',
							type: 'error'
						});
					})
				
			},
			handleNopassTXZX(index,row){
				
					this.$prompt('请输入驳回理由', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'
					}).then(({
						value
					}) => {
						let params = [{
							id: row.id,
							workOvertimeId: row.workOvertimeId,
							docStatus:-1,
							rejectApplySalaryReasons:value
						}];
						this.axios.post('/perTaxToolTwo/attendanceApplySalaryWithWorkOvertimeController/approve', params).then(res => {
							if (res.data.code == 200) {
								this.queryListByPage5();
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
								message: '审核失败',
								type: 'error'
							});
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '取消输入'
						});
					});
					
				
			},

			handleClick(tab, event) {},
			handleCurrentChange1(val) {
				this.currentPage1 = val;
				this.queryListByPage1();
			},
			handleCurrentChange2(val) {
				this.currentPage2 = val;
				this.queryListByPage2();
			},
			handleCurrentChange3(val) {
				this.currentPage3 = val;
				this.queryListByPage3();
			},
			handleCurrentChange4(val) {
				this.currentPage4 = val;
				this.queryListByPage4();
			},
			handleCurrentChange5(val) {
				this.currentPage5 = val;
				this.queryListByPage5();
			},


		},
		watch: {
			holidayDate(newValue, oldValue) {
				if (newValue) {
					this.queryListByPage1();
					this.queryListByPage2();
					this.queryListByPage3();
					this.queryListByPage4();

					this.queryListByPage5();
				} else {
					this.holidayDate = this.formatTimeToStr(new Date(), "yyyy-MM")
				}

			}
		},
		created() {
			this.queryListByPage1();
			this.queryListByPage2();
			this.queryListByPage3();
			this.queryListByPage4();

			this.queryListByPage5();
			// this.getDepartment();
		}
	}
</script>

<style scoped lang="less">
	p.warning {
		color: #E6A23C;
	}

	p.success {
		color: #67C23A;
	}

	p.normal {
		color: #409EFF;
	}

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

		.contain_header {
			display: flex;
			flex-direction: row;
			justify-content: space-between;

			>div {
				width: 30%;
				background: #fff;
				height: 110px;
				padding: 0 20px;

				p {
					height: 40px;
					line-height: 40px;
					font-size: 14px;
				}

				div {
					height: 30px;
					line-height: 30px;
					font-size: 14px;
				}

			}

			.label1 {
				width: 60px;
				float: left;
			}

			.label2 {
				width: 80px;
				float: left;
				margin-left: 20px;
				color: #409EFF;
				cursor: pointer;
			}

			.label3 {
				float: left;
				width: 60px;
				text-align: center;
				margin-left: 5px;
				color: #999;
			}

			/deep/ .el-progress {
				width: calc(100% - 230px);
				float: left;
				padding-top: 9px;
				box-sizing: border-box;
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

	}
</style>
