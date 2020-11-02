<template>
	<div class='main clearfix cashier'>
		<div class='search_contain'>
			<el-tag type="danger" effect="dark">收银条件：合同处于【已审核】，且最近一次收银状态不是【未入账】</el-tag>
			<div style="margin-top:20px">
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini" ref='form'>
					<el-form-item label="客户名称:" prop="customerId" :rules="$rules.customerId">
						<el-select v-model="formInline.customerId" placeholder="请选择客户名称" clearable filterable>
							<el-option v-for="item in customerList" :label="item.customerName" :value='item.customerId'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click='search("form")' type="primary" size="mini">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class='main_contain' v-loading="loading" v-if="JSON.stringify(customerContract) != '{}'">

			<div class="contractContent">
				<el-button type="primary" size="mini" icon="el-icon-plus" class="operateBtn" v-if="operateBtnFlag">收银</el-button>
				<h5>合同内容</h5>
				<el-row>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">客户名称</div>
							<div class="value">{{customerContract.customerName}}</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">客户经理</div>
							<div class="value">{{customerContract.customerManager}}</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">合同编号</div>
							<div class="value">{{customerContract.contractCode}}</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">合同状态</div>
							<div class="value">
								<el-tag size="mini" v-if="customerContract.state==2" type="success" effect="dark">已审核</el-tag>
								<el-tag size="mini" v-if="customerContract.state==1" type="danger" effect="dark">未审核</el-tag>
							</div>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">签约日期</div>
							<div class="value">{{customerContract.signDate}}</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">合同生效日期</div>
							<div class="value">{{customerContract.effectiveDate}}</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">合同截止日期</div>
							<div class="value">{{customerContract.closingDate}}</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">合同审核人</div>
							<div class="value">{{customerContract.auditor}}</div>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">是否代开票</div>
							<div class="value">{{customerContract.isProxyInvoice==0?'否':'是'}}</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">是否取票</div>
							<div class="value">{{customerContract.isTakeTicket==0?'否':'是'}}</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">是否零申报</div>
							<div class="value">{{customerContract.isZeroTax==0?'否':'是'}}</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">是否代理认证</div>
							<div class="value">{{customerContract.isProxyAuthentication==0?'否':'是'}}</div>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">甲方授权人</div>
							<div class="value">{{customerContract.firstParty}}</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">甲方违约金(元)</div>
							<div class="value">{{customerContract.firstPartyPenalty}}</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">乙方违约金(元)</div>
							<div class="value">{{customerContract.secondPartyPenalty}}</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">合同单价(元)</div>
							<div class="value">{{customerContract.unitPrice}}</div>
						</div>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">结算方式</div>
							<div class="value">{{customerContract.payTypeName}}</div>
						</div>
					</el-col>
					<el-col :span="6">
						<div class="grid-content">
							<div class="label">首次付款(元)</div>
							<div class="value">{{customerContract.firstPayment}}</div>
						</div>
					</el-col>
					<el-col :span="12">
						<div class="grid-content">
							<div class="label row2label">合同备注</div>
							<div class="value row2value" v-if="customerContract.remark.length<=50">{{customerContract.remark}}</div>
							<el-tooltip v-if="customerContract.remark.length>50" class="item" effect="dark" :content="customerContract.remark" placement="bottom">
								<div class="value row2value ellipsis">{{customerContract.remark}}</div>
							</el-tooltip>

						</div>
					</el-col>
				</el-row>
			</div>

			<div class="serviceDetailContent">
				<h5>合同包含的服务项目</h5>
				<el-table :data="serviceDetailList" style="width: 100%;margin-top: 20px;" stripe border v-loading="loading">
					<el-table-column align="center" label="序号" type='index' width="80"></el-table-column>
					<el-table-column align="center" label="服务名称" prop="serviceName"></el-table-column>
					<el-table-column align="center" label="服务类型" prop="serviceType"></el-table-column>
					<el-table-column align="center" label="项目类型" prop="projectType"></el-table-column>
					<el-table-column align="center" label="服务单价(元)" prop="servicePrice"></el-table-column>
				</el-table>
			</div>

			<div class="payRecordContent">
				<h5>该客户以往收银记录</h5>
				<el-table :data="payRecordList" style="width: 100%;margin-top: 20px;" stripe border v-loading="loading">
					<el-table-column align="center" label="序号" type='index' width="80"></el-table-column>
					<el-table-column align="center" label="收银单号" prop="crNumber"></el-table-column>
					<el-table-column align="center" label="应收金额(元)" prop="amount"></el-table-column>
					<el-table-column align="center" label="赠送金额(元)">
						<template slot-scope="scope">
							<span>{{scope.row.presentAmount?scope.row.presentAmount:0}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="实收金额(元)" prop="realPayAmount"></el-table-column>
					<el-table-column align="center" label="作废金额(元)">
						<template slot-scope="scope">
							<span>{{scope.row.abandonedAmount?scope.row.abandonedAmount:0}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="支付方式" prop="payWayName"></el-table-column>
					<el-table-column align="center" label="服务周期" prop="cycleName"></el-table-column>
					<el-table-column align="center" label="收银员" prop="payee"></el-table-column>
					<el-table-column align="center" label="收银时间" prop="payTime"></el-table-column>
					<el-table-column align="center" label="收银状态">
						<template slot-scope="scope">
							<el-tag size="mini" v-if="scope.row.state==0" type="danger" effect="dark">未入账</el-tag>
							<el-tag size="mini" v-if="scope.row.state==1" type="success" effect="dark">已入账</el-tag>
						</template>
					</el-table-column>
					<el-table-column align="center" label="是否对账">
						<template slot-scope="scope">
							<el-tag size="mini" v-if="scope.row.isReconciled==0" type="danger" effect="dark">否</el-tag>
							<el-tag size="mini" v-if="scope.row.isReconciled==1" type="success" effect="dark">是</el-tag>
						</template>
					</el-table-column>
				</el-table>
			</div>

			<!--
			<el-pagination background layout="total,prev, pager, next, jumper" :total="total" :page-size="pageSize" @current-change='handleCurrentChange' :current-page="currentPage">
			</el-pagination>-->
			<!--弹出框-->
			<!--<el-dialog class="dialog" :title="addFlag?'添加部门':'编辑部门'" :close-on-click-modal="false" :visible.sync="dialogVisible" width="4rem" style="min-width:250px" @close='hideDialog("ruleForm")'>
				<el-form :model="form" size="mini" label-width="50px" :rules="rules" ref="ruleForm">
					<el-form-item label="名称" prop="orgName">
						<el-input v-model="form.orgName" placeholder="请输入部门名称"></el-input>
					</el-form-item>
					<el-form-item label="描述" prop="remark">
						<el-input type="textarea" v-model="form.remark" maxlength="200" rows="4" placeholder="请输入部门具体描述信息，200字以内"></el-input>
					</el-form-item>
				</el-form>
				<div class='btn_contain clearfix'>
					<span class='commit' @click='commitDialog("ruleForm")'>完成</span>
					<span class='close' @click='hideDialog("ruleForm")'>关闭</span>
				</div>
			</el-dialog>-->
		</div>

	</div>
</template>

<script>
	export default {
		name: "dept",
		data() {
			return {
				formInline: {
					customerId: ''
				},
				row: {},
				loading: false,

				customerList: [],
				customerId: '',
				
				customerContract: {},
				serviceDetailList: [],
				payRecordList: [],
				operateBtnFlag: false,
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
			search(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						this.customerId = this.formInline.customerId;
						this.operateBtnFlag = true;
						this.getTableData()
					} else {
						console.log('error submit!!');
						return false;
					}
				})

			},
			getTableData() {
				this.loading = true;
				let params = {
					customerId: this.customerId
				};
				this.axios.get('/test/pay/getPayPageInfo.do', {
						params: params
					})
					.then(res => {
						this.loading = false;
						if(res.data.code == 200) {
							this.customerContract = res.data.data.customerContract;
							this.serviceDetailList = res.data.data.serviceDetailList;
							this.payRecordList = res.data.data.payRecordList;
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

		},
		computed: {},
		created() {
			this.getCustomerList();
		},
	}
</script>
<style type="text/css">
	.el-tooltip__popper {
		width: 200px;
	}
</style>
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
		}
		.main_contain {
			/*background: #fff;*/
			margin: 0 20px;
			/*height: calc(100% - 190px);*/
			.contractContent,
			.serviceDetailContent,
			.payRecordContent {
				background: #fff;
				margin-top: 20px;
				padding: 20px;
			}
			.payRecordContent {
				margin-bottom: 20px;
			}
			.contractContent {
				padding: 0px 20px;
				padding-bottom: 20px;
				.operateBtn {
					margin-top: 20px;
				}
				h5 {
					height: 40px;
					line-height: 40px;
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
				
				/*.el-col:nth-child(2n),
			.el-col:nth-child(3n),
			.el-col:nth-child(4n),
			{
				border-left: 0;
			}*/
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
				cursor: pointer;
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
				cursor: pointer;
			}
			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}
		}
	}
</style>