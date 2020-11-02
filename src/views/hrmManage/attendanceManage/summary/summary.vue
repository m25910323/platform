<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>行政管理中心</el-breadcrumb-item>
			<el-breadcrumb-item>人资系统</el-breadcrumb-item>
			<el-breadcrumb-item>假勤管理</el-breadcrumb-item>
			<el-breadcrumb-item>考勤汇总</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- <div class='search_contain'>
			<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini" :rules="rules" ref='formName'>
				

				<el-form-item label="部门">
					<el-select v-model="formInline.orgName" placeholder="请选择部门名称" clearable filterable @change='filter'>
						<el-option v-for="item in departList" :label="item.orgName" :value='item.orgName'></el-option>
					</el-select>
				</el-form-item>
				<el-button type="primary" @click='exportExcel' size="mini" style='margin-right: 12px;'>导出上月统计表</el-button>
				<el-form-item>
					<el-upload class="upload-demo" action="/perTaxToolTwo/attendanceemployeerecordController/uploadRecordFile" :on-preview="handlePreview"
					 :on-remove="handleRemove" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList">
						<el-button type="primary" size="mini">考勤记录上传</el-button>
					</el-upload>
				</el-form-item>

			</el-form>
		</div> -->
		<div class="contain_body">
			<div style="background: #fff;height:45px;padding:15px 12px 0px;">
				<el-input placeholder="搜索" v-model="formInline.keywords" prefix-icon="el-icon-search" style='width: 200px;' size="mini"
				 clearable>



				</el-input>
				<el-button size="mini" type="text" @click="search()" style='margin-left: 8px;margin-right: 20px;'>搜索</el-button>
				<el-button v-popover:popover4 size="mini" style='margin-right: 20px;'>筛选</el-button>
				<el-popover ref="popover4" placement="bottom" width="280" trigger="click" v-model='visible'>
					<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini" :rules="rules" ref='formName'
					 label-width="80px">

						<!-- <el-form-item label="按月查询">
							<el-radio v-model="formInline.isMonth" label="1">是</el-radio>
							<el-radio v-model="formInline.isMonth" label="0">否</el-radio>
							

						</el-form-item> -->
						<!-- <el-form-item label="异常日期">
							<el-date-picker v-model="formInline.dateTimeStart" type="date" placeholder="请选择" format="yyyy-MM-dd"
							 value-format="yyyy-MM-dd">
							</el-date-picker>

						</el-form-item> -->
						<!-- <el-form-item label=" ">
							<el-date-picker v-model="formInline.dateTimeEnd" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd">
							</el-date-picker>

						</el-form-item> -->
						<el-form-item label="异常月份">
							<el-date-picker v-model="formInline.date" type="month" placeholder="请选择" format="yyyy-MM"
							 value-format="yyyy-MM">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="部门">
							<el-select v-model="formInline.deptname" placeholder="请选择部门名称" clearable filterable>
								<el-option v-for="item in departList" :label="item.orgName" :value='item.orgName' v-if="item.parentOrgId"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label=" ">
							<el-button type="primary" @click="onSubmit" size="medium" style='width: 140px;'>确定</el-button>
						</el-form-item>

					</el-form>
				</el-popover>

				<el-button v-popover:popover5 size="mini">批量处理</el-button>
				<el-popover ref="popover5" placement="bottom" width="280" trigger="click" v-model='visible2'>

					<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini" :rules="rules" ref='formName'
					 label-width="80px">


						<el-form-item label="异常类型">
							<el-input value="迟到早退" disabled></el-input>

						</el-form-item>
						<el-form-item label="次数">
							<el-input value="0" disabled></el-input>

						</el-form-item>

						<el-form-item label=" ">
							<el-button type="primary" @click="mulEdit" size="medium" style='width: 140px;'>确定</el-button>
						</el-form-item>

					</el-form>




				</el-popover>






				<el-upload class="upload-demo" action="/perTaxToolTwo/attendanceConfluenceController/uploadFile" :on-preview="handlePreview"
				 style='float: right;' :on-remove="handleRemove" :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed"
				 :file-list="fileList">
					<el-button type="primary" size="mini">考勤记录上传</el-button>
				</el-upload>
				<el-button type="primary" @click='exportExcel' size="mini" style='float: right;margin:0px 12px;'>下载考勤汇总</el-button>
				<!-- <el-date-picker v-model="endtime" type="date" placeholder="请选择2" format="yyyy-MM-dd" value-format="yyyy-MM-dd" size="mini"
				 style='float: right;'>
				</el-date-picker>
				<span style='float: right;width: 20px;height:30px;line-height:28px;text-align: center;'>-</span>
				<el-date-picker v-model="starttime" type="date" placeholder="请选择1" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
				 size="mini" style='float: right;'> -->
				<el-date-picker v-model="attendanceExDate" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM"
				 size="mini" style='float: right;'>
				</el-date-picker>
			</div>
			<el-table :data="tableList" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="50"></el-table-column>

				<el-table-column align="center" label="日期" prop="datetime" :resizable="false"></el-table-column>
				<el-table-column align="center" label="工号" prop="usercode" :resizable="false"></el-table-column>
				<el-table-column align="center" label="姓名" prop="username" :resizable="false"></el-table-column>
				<el-table-column align="center" label="隶属部门" prop="department" :resizable="false"></el-table-column>
				<!-- <el-table-column align="center" label="迟到早退次数" prop="monthLateAndLeave" :resizable="false"></el-table-column>
				<el-table-column align="center" label="调休/产假次数" prop="monthTxAndCj" :resizable="false"></el-table-column> -->
				<el-table-column align="center" label="迟到" prop="monthLateNumber" :resizable="false"></el-table-column>
				<el-table-column align="center" label="早退" prop="monthLeaveNumber" :resizable="false"></el-table-column>
				
				<el-table-column align="center" label="调休" prop="monthApplyPaidLeaveNumber" :resizable="false"></el-table-column>
				<el-table-column align="center" label="产假" prop="monthMaternityDays" :resizable="false"></el-table-column>
				<el-table-column align="center" label="产检假" prop="monthMaternityLeaveNumber" :resizable="false"></el-table-column>
				<el-table-column align="center" label="陪产假" prop="monthPaternityDays" :resizable="false"></el-table-column>
				<el-table-column align="center" label="哺乳假" prop="monthNursingLeaveNumber" :resizable="false"></el-table-column>
				
				<el-table-column align="center" label="婚假" prop="monthHj" :resizable="false"></el-table-column>
				<el-table-column align="center" label="年假" prop="monthNj" :resizable="false"></el-table-column>
				<el-table-column align="center" label="丧假" prop="monthSj" :resizable="false"></el-table-column>
				<el-table-column align="center" label="事假" prop="monthShi" :resizable="false"></el-table-column>
				<el-table-column align="center" label="病假" prop="monthBj" :resizable="false"></el-table-column>
				<!-- <el-table-column align="center" label="旷工" prop="monthKg" :resizable="false"></el-table-column> -->
				<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>
				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>
		</div>
		<el-dialog width="400px" title="编辑异常次数" :visible.sync="dialogVisible">
			<el-form ref="form" :model="form" label-width="140px" size="mini">
				<el-form-item label="部门">
					<el-input v-model="form.department" disabled></el-input>
				</el-form-item>
				<el-form-item label="姓名">
					<el-input v-model="form.username" disabled></el-input>
				</el-form-item>
				<el-form-item label="日期">
					<el-input v-model="form.datetime" disabled></el-input>
				</el-form-item>
				<el-form-item label="本日迟到早退次数">
					<el-input v-model="form.monthLateAndLeave"></el-input>
				</el-form-item>
				<el-form-item label="本日调休/产假次数">
					<el-input v-model="form.monthTxAndCj"></el-input>
				</el-form-item>
				<el-form-item label="本日婚假次数">
					<el-input v-model="form.monthHj"></el-input>
				</el-form-item>
				<el-form-item label="本日年假次数">
					<el-input v-model="form.monthNj"></el-input>
				</el-form-item>
				<el-form-item label="本日丧假次数">
					<el-input v-model="form.monthSj"></el-input>
				</el-form-item>
				<el-form-item label="本日事假次数">
					<el-input v-model="form.monthShi"></el-input>
				</el-form-item>
				<el-form-item label="本日病假次数">
					<el-input v-model="form.monthBj"></el-input>
				</el-form-item>
				<el-form-item label="本日旷工次数">
					<el-input v-model="form.monthKg"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="form.remark"></el-input>
				</el-form-item>
			</el-form>
			<div class='btn_contain clearfix' style="text-align: center;margin-top: 0.36rem;">
				<span class='close' @click="compare" style="width: 2.4rem;height: 0.4rem;line-height: 0.4rem;background: #43b3db;color: #fff;
				display: inline-block;text-align: center;border-radius: 4px;">确认</span>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				multipleSelection: [],
				starttime: '',
				endtime: '',
				attendanceExDate:'',
				keywords: '',
				departList: [],
				loading: false,
				formInline: {
					orgName: '',
				},
				orgName: '',
				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],

				dialogVisible: false,
				visible:false,
				visible2:false,

			}
		},
		components: {},
		methods: {
			search() {
				this.keywords = this.formInline.keywords;
				this.deptname = "";
				// this.dateTimeStart = "";
				// this.dateTimeEnd = "";
				this.date = "";
				this.queryListByPage();
			},
			onSubmit() {
				this.keywords = "";
				this.deptname = this.formInline.deptname;
				this.date = this.formInline.date;
				// this.dateTimeStart = this.formInline.dateTimeStart;
				// this.dateTimeEnd = this.formInline.dateTimeEnd;
				// this.isMonth = this.formInline.isMonth;
				this.visible = false;
				this.queryListByPage();
			},
			getDepartment() {
				let param = {
				};
				this.axios.post('/perTaxToolTwo/attendance/customLoginController/getDepartment').then(res => {
					if (res.data.code == 200) {
						this.departList = res.data.data;
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
			queryListByPage() {
				this.loading = true;
				let param = {
					row: this.pageSize,
					page: this.currentPage,
					data: {
						"keywords": this.keywords,
						"deptname": this.deptname,
						"date": this.date,
						// "dateTimeStart": this.dateTimeStart,
						// "dateTimeEnd": this.dateTimeEnd,
						// "isMonth":this.isMonth
					}

				};
				this.axios.post('/perTaxToolTwo/attendanceConfluenceController/getPageList', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.total = res.data.count;
						this.tableList = res.data.data;
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
			exportExcel() {
				// if (this.starttime && this.endtime) {
					
					// window.location.href = "/perTaxToolTwo/attendanceConfluenceController/downloadAllAttendanceException?starttime=" +
					// 	this.starttime + "&endtime=" + this.endtime;
				if (this.attendanceExDate) {
					window.location.href = "/perTaxToolTwo/attendanceemployeerecordexceptionController/downloadAllAttendanceException?attendanceExDate=" +
						this.attendanceExDate;
				} else {
					this.$message({
						message: '请选择日期',
						type: 'warning'
					});
				}

			},
			handleEdit(index, row) {
				this.dialogVisible = true;
				this.form = JSON.parse(JSON.stringify(row));
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			compare() {
				let param = [this.form];
				this.axios.post('/perTaxToolTwo/attendanceConfluenceController/update', param).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible = false;
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
						message: '修改失败',
						type: 'error'
					});
				})
			},
			mulEdit() {
				this.visible2 = false;
				this.multipleSelection.forEach(item => {
					item.monthLateAndLeave = 0
				});
				let param = this.multipleSelection;
				this.axios.post('/perTaxToolTwo/attendanceConfluenceController/update', param).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible = false;
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
						message: '修改失败',
						type: 'error'
					});
				})
			},
			filter() {
				this.orgName = this.formInline.orgName;
				this.currentPage = 1;
				this.queryListByPage()
			},
		},
		created() {
			this.getDepartment();
			this.queryListByPage();
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
		/* background: #fff; */
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
		color: #666;
	}

	/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #fff;
	}
</style>
