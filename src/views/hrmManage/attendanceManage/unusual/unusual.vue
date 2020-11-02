<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>行政管理</el-breadcrumb-item>
			<el-breadcrumb-item>员工服务</el-breadcrumb-item>

			<el-breadcrumb-item>异常考勤</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body">
			<h3>异常考勤</h3>
			<el-radio-group v-model="holidayDate" size="mini" style='top:40px;right: 20px;position: absolute;z-index: 10;'>
				<el-radio-button label="month">本月内</el-radio-button>
				<el-radio-button label="year">本年内</el-radio-button>
			</el-radio-group>

			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane name="first">
					<span slot="label">

						<span>待处理
							<el-badge :value="total1" :max="99" class="item" />
						</span>

					</span>
					<el-table :data="tableList1" style="width: 100%" v-loading='loading'>
						<!-- <el-table-column type="selection" width="50"></el-table-column> -->

						<el-table-column align="center" label="异常日期" prop="attendanceExDate" :resizable="false"></el-table-column>
						<el-table-column align="center" label="员工ID" prop="attendanceEmployeeId" :resizable="false"></el-table-column>
						<el-table-column align="center" label="员工姓名" prop="attendanceEmployeeName" :resizable="false"></el-table-column>
						<el-table-column align="center" label="隶属部门" prop="attendanceEmployeeDepartment" :resizable="false"></el-table-column>
						<el-table-column align="center" label="异常原因" prop="attendanceExReasons" :resizable="false" width="300"></el-table-column>
						<!-- <el-table-column align="center" label="是否消除" :resizable="false">
							<template slot-scope="scope">
								<span>{{scope.row.attendanceExDel == 0?'否':"是"}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="消除原因" prop="attendanceExDelReasons" :resizable="false"></el-table-column> -->
						<el-table-column align="center" width="240" :resizable="false">
							<template slot="header" slot-scope="scope">
								<span>操作</span>
							</template>
							<template slot-scope="scope">
								<el-button size="mini" type="text" @click="handleLate(scope.$index, scope.row)" v-if='scope.row.attendanceExReasons.indexOf("迟到")>=0 && scope.row.attendanceExConfirm != 1'>确认迟到</el-button>
								<el-button size="mini" type="text" @click="handleApply(scope.$index, scope.row)" v-if='scope.row.cardExceptionId == null'>提出异议（发起申请）</el-button>
								<!-- <el-button size="mini" type="text" @click="handleApply(scope.$index, scope.row)" v-if='scope.row.attendanceExReasons.indexOf("迟到")<0 && !scope.row.cardExceptionId'>发起异常申请</el-button> -->
								<!-- <el-button size="mini" type="text" @click="handleApply(scope.$index, scope.row)" v-if='scope.row.cardExceptionId'>异常申请</el-button> -->
								<el-button size="mini" type="text" v-if='scope.row.attendanceExConfirm == 1'>已经确认迟到，不可操作</el-button>

							</template>
						</el-table-column>
						<!-- <el-table-column align="center" label="审核人" prop="bankname" :resizable="false"></el-table-column> -->

					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange1(val)})"
					 :current-page="currentPage1" :page-size="pageSize" layout="total, prev, pager, next" :total="total1">
					</el-pagination>
				</el-tab-pane>
				<el-tab-pane name="second">
					<span slot="label">

						<span>已提交
							<el-badge :value="total2" :max="99" class="item" />
						</span>

					</span>
					
					<el-table :data="tableList2" style="width: 100%" v-loading='loading'>
						<!-- <el-table-column type="selection" width="50"></el-table-column> -->
					
						<el-table-column align="center" label="异常日期" prop="cardExceptionDate" :resizable="false"></el-table-column>
						<el-table-column align="center" label="员工ID" prop="ausercode" :resizable="false"></el-table-column>
						<el-table-column align="center" label="员工姓名" prop="ausername" :resizable="false"></el-table-column>
						<el-table-column align="center" label="隶属部门" prop="adepartment" :resizable="false"></el-table-column>
						<el-table-column align="center" label="异常原因" prop="cardExceptionReasons" :resizable="false" width="300"></el-table-column>
						<el-table-column align="center" label="是否消除" :resizable="false">
							<template slot-scope="scope">
								<span>{{scope.row.docStatus == 3?'是':"否"}}</span>
							</template>
						</el-table-column> -->
						<el-table-column align="center" label="消除原因" prop="operateReasons" :resizable="false"></el-table-column>
						
						<el-table-column align="center" label="审核人" prop="username" :resizable="false"></el-table-column>
					
					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange2(val)})"
					 :current-page="currentPage2" :page-size="pageSize" layout="total, prev, pager, next" :total="total2">
					</el-pagination>
				</el-tab-pane>
				
				
			</el-tabs>



		</div>
	</div>

</template>

<script>
	import {
		formatTimeToStr
	} from '../../../../utils/date.js'
	export default {
		name: "customer",
		data() {
			return {
				range: '1',
				activeName: 'first',
				index: 1,
				loading: false,
				formInline: {
					bankname: '',
					customername: ''
				},
				bankname: '',
				customername: '',
				form: {},
				currentPage1: 1,
				currentPage2: 1,
				currentPage3: 1,
				currentPage4: 1,
				pageSize: 10,
				total1: 0,
				total3: 0,
				total4: 0,
				total2: 0,
				tableList3: [],
				tableList1: [],
				tableList2: [],
				tableList4: [],
				dialogVisible: false,
				innerVisible: false,
				time: '',
				attendanceEmployeeSignTime: '',
				
				fileList: [],
				holidayDate: 'month',
				tongji: '',
				tongji1: '',
				percentage1: 0,
				percentage2: 0,
				percentage3: 0,
				percentage4: 0,
			}
		},
		components: {},
		methods: {

			queryListByPage() {
				this.loading = true;
				let param = {
					row: this.pageSize,
					page: this.currentPage1,
					data: {
						attendanceEmployeeDepartId: "-1",
						attendanceEmployeeId: "",
						attendanceExDate: this.holidayDate == 'month' ? this.formatTimeToStr(new Date(), "yyyy-MM") : this.formatTimeToStr(
							new Date(),
							"yyyy"),
						attendanceExDel: "",
						attendanceExReasons: "",
						keywords: "",
						docStatus:0
					}
				};
				this.axios.post('/perTaxToolTwo/attendanceemployeerecordexceptionController/getPageList', param)
					.then(res => {
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
			
			queryListByPage1() {
				this.loading = true;
				let param = {
					row: this.pageSize,
					page: this.currentPage2,
					data: {
						attendanceEmployeeDepartId: "-1",
						attendanceEmployeeId: "",
						// attendanceExDate: this.holidayDate == 'month' ? this.formatTimeToStr(new Date(), "yyyy-MM") : this.formatTimeToStr(
						// 	new Date(),
						// 	"yyyy"),
						attendanceExDel: "",
						type:this.holidayDate,
						attendanceExReasons: "",
						keywords: "",
					}
				};
				this.axios.post('/perTaxToolTwo/attendanceapplycardexceptionController/queryPageList', param)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.total2 = res.data.count;
							this.tableList2 = res.data.data;
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
			
// 			queryListByPage1() {
// 				let param = {
// 					data: {
// 						adepartId: "-1",
// 						ausercode: "",
// 						keywords: "",
// 						holidayDate: this.holidayDate
// 					},
// 					page: this.currentPage2,
// 					row: this.pageSize
// 
// 				};
// 				this.axios.post(
// 						'/perTaxToolTwo/attendanceapplycardexceptionController/queryApprovePageList', param)
// 					.then(res => {
// 						this.loading = false;
// 						if (res.data.code == 200) {
// 							this.total1 = res.data.count;
// 							this.tableList1 = res.data.data;
// 						} else {
// 							this.$message({
// 								message: res.data.msg,
// 								type: 'error'
// 							});
// 						}
// 
// 					}).catch(function(err) {
// 						this.$message({
// 							message: '获取列表失败',
// 							type: 'error'
// 						});
// 					})
// 			},
			getBankList() {},

			search() {
				this.loading = true;
				this.bankname = this.formInline.bankname;
				this.customername = this.formInline.customername;
				this.currentPage = 1;
				this.queryListByPage()
			},
			handleCancel(index, row) {},
			handleLate(index, row) {
				this.$confirm('确定' + row.attendanceExDate + '上午迟到?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = {
						attendanceExId: row.attendanceExId,
						cardExceptionDate: ''
					};
					this.axios.post('/perTaxToolTwo/attendanceemployeerecordexceptionController/makeSureEx', param).then(res => {

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
							message: '确认迟到失败',
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
			handleApply(index, row) {
				this.$prompt('异常原因', '填写申请', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputPlaceholder: '异常原因需要详细说明，否则可能审批不能通过',
					inputValue: row.cardExceptionReasons
				}).then(({
					value
				}) => {
					let param = {
						"cardExceptionDate": "",
						"cardExceptionReasons": value,
						"suggestion": "",
						"attendanceExId": row.attendanceExId,
						"cardExceptionDate": row.attendanceExDate
					};
					this.axios.post(
							'/perTaxToolTwo/attendanceapplycardexceptionController/insert', param)
						.then(res => {
							if (res.data.code == 200) {
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
								this.queryListByPage();
								this.queryListByPage1();
							} else {
								this.$message({
									message: res.data.msg,
									type: 'error'
								});
							}

						}).catch(function(err) {
							this.$message({
								message: '提交申请失败',
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
			
			handleClose() {},
			handleClick(tab, event) {},
			handleCurrentChange1(val) {
				this.currentPage1 = val;
				this.queryListByPage()
			},
			handleCurrentChange2(val) {
				this.currentPage2 = val;
				this.queryListByPage1()
			},
			handlePreview(file) {
				console.log(file);
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
					this.axios.post('/perTaxToolTwo/attendanceapplycardexceptionController/apply').then(res => {
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
					this.axios.post('/perTaxToolTwo/attendanceapplycardexceptionController/cancel').then(res => {
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

		},
		
		watch: {
			holidayDate(newValue, oldValue) {
				this.queryListByPage();
				this.queryListByPage1();
			}
		},
		created() {
			this.queryListByPage();
			this.queryListByPage1();
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
				color: #999;
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

	}
</style>
