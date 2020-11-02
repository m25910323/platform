<template>
	<div class='main clearfix'>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
					<el-form-item label="客户名称:">
						<el-select v-model="formInline.customerId" placeholder="请选择客户名称" clearable filterable>
							<el-option v-for="item in customerList" :label="item.customerName" :value='item.customerId'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="收银单号:">
						<el-input v-model='formInline.crNumber' placeholder="请输入收银单号" clearable></el-input>
					</el-form-item>
					<el-form-item label="收银时间:">
						<el-date-picker v-model="formInline.payTime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button @click='search' type="primary" size="mini">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<el-table :data="tableData" style="width: 100%;" stripe border v-loading="loading">
				<el-table-column align="center" label="序号" type='index' width="80"></el-table-column>
				<el-table-column align="center" label="客户名称" prop="customerName"></el-table-column>
				<el-table-column align="center" label="收银单号" prop="crNumber"></el-table-column>
				<el-table-column align="center" label="应收金额(元)" prop="amount"></el-table-column>
				<el-table-column align="center" label="实收金额(元)" prop="realPayAmount"></el-table-column>
				<el-table-column align="center" label="收银员" prop="payee"></el-table-column>
				<el-table-column align="center" label="收银时间" sortable prop="payTime"></el-table-column>
				<el-table-column align="center" label="收银状态" sortable prop="state">
					<template slot-scope="scope">
						<el-tag size="mini" v-if="scope.row.state==0" type="danger" effect="dark">未入账</el-tag>
						<el-tag size="mini" v-if="scope.row.state==1" type="success" effect="dark">已入账</el-tag>
					</template>
				</el-table-column>
				<el-table-column align="center" label="是否对账" sortable prop="isReconciled">
					<template slot-scope="scope">
						<el-tag size="mini" v-if="scope.row.isReconciled==0" type="danger" effect="dark">否</el-tag>
						<el-tag size="mini" v-if="scope.row.isReconciled==1" type="success" effect="dark">是</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="190">
					<template slot-scope="scope">
						<el-button v-if="scope.row.isReconciled==0" size="mini" type='danger' icon="el-icon-edit" @click="handleEdit(scope.row)">已对账</el-button>
						<el-button size="mini" type='primary' icon="el-icon-search" @click="showDetail(scope.row)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background layout="total,prev, pager, next, jumper" :total="total" :page-size="pageSize" @current-change='handleCurrentChange' :current-page="currentPage">
			</el-pagination>
			<!--弹出框-->
			<el-dialog class="dialog" title="收银详细" :close-on-click-modal="false" :visible.sync="dialogVisible" width="70%" style="min-width:800px">
				<div class="detailContent">
					<el-row>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">合同单号</div>
								<div class="value">{{dataDetail.contractCode}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">收银单号</div>
								<div class="value">{{dataDetail.crNumber}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">客户名称</div>
								<div class="value">{{dataDetail.customerName}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">客户经理</div>
								<div class="value">{{dataDetail.customerManager}}</div>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">应收金额(元)</div>
								<div class="value">{{dataDetail.amount}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">赠送金额(元)</div>
								<div class="value">{{dataDetail.presentAmount}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">实收金额(元)</div>
								<div class="value">{{dataDetail.realPayAmount}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">收银状态</div>
								<div class="value">
									<el-tag size="mini" v-if="dataDetail.state==2" type="success" effect="dark">已入账</el-tag>
									<el-tag size="mini" v-if="dataDetail.state==1" type="danger" effect="dark">未入账</el-tag>
								</div>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">周期</div>
								<div class="value">{{dataDetail.cycleName}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">支付方式</div>
								<div class="value">{{dataDetail.payWayName}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">收银员</div>
								<div class="value">{{dataDetail.payee}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">收银时间</div>
								<div class="value">{{dataDetail.payTime}}</div>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">应收款开始日</div>
								<div class="value">{{dataDetail.startDate}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">应收款截止日</div>
								<div class="value">{{dataDetail.endDate}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">入账人</div>
								<div class="value">{{dataDetail.admissionPerson}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">入账时间</div>
								<div class="value">{{dataDetail.admissionTime}}</div>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">收款方</div>
								<div class="value">{{dataDetail.payeeName}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">开户行</div>
								<div class="value">{{dataDetail.openAccountBankName}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">开户行账号</div>
								<div class="value">{{dataDetail.openAccountBankNo}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">是否对账</div>
								<div class="value">
									<el-tag size="mini" v-if="dataDetail.isReconciled==1" type="success" effect="dark">是</el-tag>
									<el-tag size="mini" v-if="dataDetail.isReconciled==0" type="danger" effect="dark">否</el-tag>
								</div>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">作废时间</div>
								<div class="value">{{dataDetail.obsoleteTime}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">作废操作人</div>
								<div class="value">{{dataDetail.obsolete}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">作废金额(元)</div>
								<div class="value">{{dataDetail.abandonedAmount}}</div>
							</div>
						</el-col>
						<el-col :span="6">
							<div class="grid-content">
								<div class="label">作废原因</div>
								<div class="value">{{dataDetail.reasonInvalidation}}</div>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="12">
							<div class="grid-content">
								<div class="label row2label">作废时间</div>
								<div class="value row2value">{{dataDetail.obsoleteTime}}</div>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="grid-content">
								<div class="label row2label">作废操作人</div>
								<div class="value row2value">{{dataDetail.obsolete}}</div>
							</div>
						</el-col>
					</el-row>
				</div>
			</el-dialog>
		</div>

	</div>
</template>

<script>
	export default {
		name: "dept",
		data() {
			return {
				formInline: {
					customerId: '',
					crNumber: '',
					payTime: '',
					payTimeStart: '',
					payTimeEnd: '',
				},
				total: 0,
				currentPage: 1,
				tableData: [],
				pageSize: 10,
				dialogVisible: false,
				orgsList: [],
				form: {
					usercode: '',
					name: '',
					getInDate: '',
					birth: '',
					phone: '',
					email: '',
					orgId: '',
					sex: '男',
					address: '',
					state: 1
				},
				rules: {
					usercode: [{
						required: true,
						message: '请输入用户名',
						trigger: 'blur'
					}, ],
					name: [{
						required: true,
						message: '请输入员工姓名',
						trigger: 'blur'
					}],
				},
				row: {},
				addFlag: false,
				loading: false,
				customerList: [],
				dataDetail: {}, //详细数据
			}
		},
		components: {},
		methods: {
			getCustomerList() {
				this.axios.get('/test/customerInfo/getCustomers.do')
					.then(res => {
						if(res.data.code == 200) {
							this.customerList = res.data.data;
						} else {
							let type;
							if(res.data.code == 0) {
								type = "warning";
							} else if(res.data.code == 500) {
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

				if(this.formInline.payTime != '') {
					this.formInline.payTimeStart = this.formInline.payTime[0];
					this.formInline.payTimeEnd = this.formInline.payTime[1];
				}
				console.log('formInline', this.formInline)
				this.getTableData();
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getTableData();
			},
			getTableData() {
				this.loading = true;
				let params = {
					...this.formInline,
					currentPage: this.currentPage,
					pageCount: this.pageSize,
				};
				console.log('params', params)
				this.axios.get('/test/payRecordNew/list.do', {
						params: params
					})
					.then(res => {
						this.loading = false;
						if(res.data.code == 200) {
							this.tableData = res.data.data;
							this.total = res.data.count;
							console.log(this.tableData)
						} else {
							let type;
							if(res.data.code == 0) {
								type = "warning";
							} else if(res.data.code == 500) {
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
			getorgsList() {
				this.axios.get('/test/orgs/getOrgs.do')
					.then(res => {
						if(res.data.code == 200) {
							this.orgsList = res.data.data;
						} else {
							let type;
							if(res.data.code == 0) {
								type = "warning";
							} else if(res.data.code == 500) {
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
			showDetail(row) {
				let params = {
					payId: row.payId
				}
				this.getDetail(params)
				this.dialogVisible = true;
			},
			getDetail(params) {
				this.axios.get('/test/payRecordNew/listInfo.do', {
						params: params
					})
					.then(res => {
						if(res.data.code == 200) {
							this.dataDetail = res.data.data;
						} else {
							let type;
							if(res.data.code == 0) {
								type = "warning";
							} else if(res.data.code == 500) {
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
		created() {
			this.getCustomerList();
			this.getTableData();
		},
	}
</script>

<style lang='less' scoped>
	.main {
		/* background: #fff; */
		width: 100%;
		/*height: 100%;*/
		box-sizing: border-box;
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
			padding-left: 20px;
			padding-top: 20px;
			margin: 20px;
			.info {
				height: 40px;
				line-height: 40px;
			}
			a {
				margin-left: 10px;
			}
			/deep/ .el-date-editor.el-input,
			.el-date-editor.el-input__inner {
				width: 250px;
			}
		}
		.main_contain {
			background: #fff;
			margin: 0 20px;
			padding: 20px;
			height: calc(100% - 190px);
			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}
			/deep/ .el-date-editor.el-input,
			.el-date-editor.el-input__inner,
			.el-input--mini,
			.el-select {
				width: 200px;
			}
			/deep/ .el-form-item--mini.el-form-item,
			.el-form-item--small.el-form-item {
				width: 48%
			}
			.el-row {
				min-width: 800px;
				border-bottom: 1px solid #ebeef5;
				border-left: 1px solid #ebeef5;
			}
			.el-row:first-of-type {
				border-top: 1px solid #ebeef5;
			}
			.el-col {
				min-width: 200px;
			}
			.grid-content {
				height: 36px;
				line-height: 36px;
				background: #fff;
				display: flex;
				align-items: center;
				.label {
					width: 30%;
					text-align: center;
					min-width: 80px;
					background: #ebf6fb;
					height: 36px;
					border-right: 1px solid #ebeef5;
				}
				.value {
					width: 70%;
					text-align: center;
					min-width: 120px;
					background: #fff7f1;
					height: 36px;
					border-right: 1px solid #ebeef5;
				}
				.row2label {
					width: 15%;
					text-align: center;
					min-width: 80px;
					background: #ebf6fb;
					height: 36px;
					border-right: 1px solid #ebeef5;
				}
				.row2value {
					width: 85%;
					text-align: center;
					min-width: 120px;
					background: #fff7f1;
					height: 36px;
					border-right: 1px solid #ebeef5;
				}
				.ellipsis {
					width: 81%;
					padding: 0 2%;
					overflow: hidden;
					/*超出部分隐藏*/
					text-overflow: ellipsis;
					/* 超出部分显示省略号 */
					white-space: nowrap;
					/*规定段落中的文本不进行换行 */
				}
			}
		}
	}
</style>