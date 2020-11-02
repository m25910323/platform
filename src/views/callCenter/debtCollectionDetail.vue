<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>客服中心</el-breadcrumb-item>
			<el-breadcrumb-item>收账通知</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="contain_body clearfix">
			<div>
				<h3>收账通知</h3>
				<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;">
					<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="160px">

						<el-form-item label="客户名称" prop="customerName">
							<el-input v-model="uploadData.customerName" placeholder="请输入" clearable>
							</el-input>
						</el-form-item>

						<el-form-item label="账期" prop="accountPeriod">
							<el-date-picker v-model="uploadData.accountPeriod" align="right" type="month" placeholder="请选择" format="yyyy-MM"
							 value-format="yyyy-MM">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="收账通知客服" prop="acceptanceUserId" v-if='isRole3'>
							<el-select v-model="uploadData.acceptanceUserId" placeholder="请选择" clearable filterable>

								<el-option v-for="item in customerServicerList" :label="item.userName" :value='item.configId'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="上月执行人" prop="lastExecutorId">
							<el-select v-model="uploadData.lastExecutorId" placeholder="请选择" clearable filterable>
								<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
								<el-option v-for="item in customerServicerList" :label="item.userName" :value='item.userId'></el-option>
							</el-select>
						</el-form-item>



						<el-form-item label="申报类型" prop="declareType">
							<el-select v-model="uploadData.declareType" placeholder="请选择" clearable filterable>
								<el-option label="全部" value=''></el-option>
								<el-option label="一般纳税人" value='25'></el-option>
								<el-option label="小规模" value='24'></el-option>
							</el-select>

						</el-form-item>
						<el-form-item label="收账方式" prop="collectType">
							<el-select v-model="uploadData.collectType" placeholder="请选择" clearable filterable>
								<el-option label="全部" value=''></el-option>
								<el-option label="取票" value='210'></el-option>
								<el-option label="送票" value='211'></el-option>
								<el-option label="邮寄" value='212'></el-option>
							</el-select>

						</el-form-item>
						<el-form-item label="是否代理认证" prop="isAgent">
							<el-select v-model="uploadData.isAgent" placeholder="请选择" clearable filterable>

								<el-option v-for="item in trueOrFalse" :label="item.label" :value='item.value'></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="是否三个月无账零申报" prop="isThreemonthdeclare">
							<el-select v-model="uploadData.isThreemonthdeclare" placeholder="请选择" clearable filterable>

								<el-option v-for="item in trueOrFalse" :label="item.label" :value='item.value'></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否按季申报" prop="isQuarterlyReport">
							<el-select v-model="uploadData.isQuarterlyReport" placeholder="请选择" clearable filterable>

								<el-option v-for="item in trueOrFalse" :label="item.label" :value='item.value'></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="收账通知结果" prop="resultCode">
							<el-select v-model="uploadData.resultCode" placeholder="请选择" clearable filterable>

								<el-option v-for="item in accountNoticeList" :label="item.label" :value='item.value'></el-option>
							</el-select>
						</el-form-item>


						<el-form-item label="收账预约时间" prop="collectionAppointmentTime">
							<el-date-picker v-model="uploadData.collectionAppointmentTime" align="right" type="date" placeholder="请选择"
							 format="yyyy-MM-dd" value-format="yyyy-MM-dd">
							</el-date-picker>

						</el-form-item>

						<el-form-item label="APP状态" prop="accountNotice">
							<el-select v-model="uploadData.accountNotice" placeholder="请选择" clearable filterable>

								<el-option label="已预约交票" value='已预约交票'></el-option>
								<el-option label="未提交" value='未提交'></el-option>
								<el-option label="已取消预约" value='已取消预约'></el-option>
								<el-option label="发票上传已确认" value='发票上传已确认'></el-option>
								<!-- <el-option v-for="item in accountNoticeList" :label="item.label" :value='item.value'></el-option> -->
							</el-select>
						</el-form-item>

						<el-form-item label=" " prop="dossierName">
							<el-button size="mini" type='primary' @click='search'>搜索</el-button>
							<!-- <el-button size="mini" type='primary' @click='handleMul' :disabled="multipleSelection.length == 0">批量归还</el-button> -->
						</el-form-item>
					</el-form>
				</div>

				<el-table :data="tableList" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange">
					<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->

					<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>

					<el-table-column align="center" label="服务状态" prop="serviceStatus" :resizable="false"></el-table-column>
					<el-table-column align="center" label="收账方式" prop="collectType" :resizable="false"></el-table-column>
					<el-table-column align="center" label="申报类型" prop="declareType" :resizable="false"></el-table-column>
					<el-table-column align="center" label="合同类型" prop="ticketCollection" :resizable="false"></el-table-column>
					<el-table-column align="center" label="合同开始日期" prop="contractStartTime" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.contractStartTime,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="合同结束日期" prop="contractEndTime" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.contractEndTime,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>
					<!-- <el-table-column align="center" label="欠费月份" prop="oweMonth" :resizable="false"></el-table-column> -->

					<!-- <el-table-column align="center" label="欠费客服" prop="period" :resizable="false"></el-table-column> -->

					<el-table-column align="center" label="收账通知客服" prop="nationUserName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="上月执行人" prop="lastExecutorName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="是否代理认证" prop="isAgent" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.isAgent == 1">是</span>
							<span v-else>否</span>
						</template>
					</el-table-column>

					<!-- <el-table-column align="center" label="是否零申报" prop="isDeclare" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.isDeclare == 1">是</span>
							<span v-else>否</span>
						</template>
					</el-table-column> -->
					<el-table-column align="center" label="收账通知结果" prop="resultCode" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.resultCode == 1">预约顺丰交票</span>
							<span v-if="scope.row.resultCode == 2">拍照上传</span>
							<span v-if="scope.row.resultCode == 3">送至大厅</span>
							<span v-if="scope.row.resultCode == 4">自行邮寄</span>
							<span v-if="scope.row.resultCode == 5">无账零申报</span>
							<span v-if="scope.row.resultCode == 6">再联系</span>
							<span v-if="scope.row.resultCode == 7">联系不上</span>
							<span v-if="scope.row.resultCode == 8">交接意向</span>
							<span v-if="scope.row.resultCode == 9">注销结束</span>
							<span v-if="scope.row.resultCode == 10">仅有内部代交票</span>
							<span v-if="scope.row.resultCode == 11">工资表代收账</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="客户联系备注" prop="remark2" :resizable="false"></el-table-column>
					<el-table-column align="center" label="APP状态" prop="accountNotice" :resizable="false"></el-table-column>
					<el-table-column align="center" label="分配时间" prop="updateTime" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(scope.row.updateTime,'yyyy-MM-dd')}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="终止状态" prop="terminateState" :resizable="false">
						<template slot-scope="scope">

							<span v-if='scope.row.terminateState == 2'>终止</span>
							<span v-else>--</span>
						</template>
					</el-table-column>
					<el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" :disabled='!(scope.row.isTerminateState == 0 && scope.row.terminateState != 2)'
							 @click="handleStop(scope.$index, scope.row)">终止</el-button>
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,1)">联系通知</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>

		</div>


		<el-dialog title="收账通知(编辑)" :visible.sync="dialogVisible1" width="1200px" :modal-append-to-body="false">

			<el-form :inline="true" ref="ruleForm5" :model="form3" class="demo-form-inline" label-width="120px" size="small">
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">基本信息</p>
				</div>
				<div style="width: 100%;"></div>
				<el-form-item label="客户名称">
					<el-input v-model="form3.customerName" disabled></el-input>
				</el-form-item>
				<el-form-item label="申报类型">
					<el-input v-model="form3.declareType" disabled></el-input>
				</el-form-item>
				<!-- <el-form-item label="APP状态">
					<el-input v-model="form3.accountNotice" disabled></el-input>
				</el-form-item> -->

				<el-form-item label="收账通知结果" prop="resultCode" :rules="[$rules.requiredSelect]">
					<el-select v-model="form3.resultCode" placeholder="请选择" filterable>

						<el-option v-for="item in accountNoticeList1" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<!-- 一般纳税人 -->
				<el-form-item label="抄税清单" v-show="form3.declareType == '一般纳税人'">
					<el-select v-model="form3.ybTaxCollectionList" placeholder="请选择" clearable filterable @change="clearresultCode">
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="认证清单" v-show="form3.declareType == '一般纳税人'">
					<el-select v-model="form3.ybCertificationList" placeholder="请选择" clearable filterable @change="clearresultCode">
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>

					</el-select>
				</el-form-item>
				<!-- <el-form-item label="是否代理认证客户" v-show="form3.declareType == '一般纳税人'" class="longLabel">
					<el-select v-model="form3.isAgent" placeholder="请选择" clearable filterable @change="clearresultCode" disabled>
						<el-option v-for="item in trueOrFalse1" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="进项发票" v-show="form3.declareType == '一般纳税人'">
					<el-select v-model="form3.isInvoiceReceipts" placeholder="请选择" clearable filterable @change="clearresultCode">
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="销项发票" v-show="form3.declareType == '一般纳税人'">
					<el-select v-model="form3.ybSalesInvoice" placeholder="请选择" clearable filterable @change="clearresultCode">
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<!-- 小规模 -->
				<el-form-item label="收入发票" v-show="form3.declareType == '小规模'">
					<el-select v-model="form3.isRevenueBill" placeholder="请选择" clearable filterable @change="clearresultCode">
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="费用发票" v-show="form3.declareType == '小规模'">
					<el-select v-model="form3.isCostBill" placeholder="请选择" clearable filterable @change="clearresultCode">
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<!-- 通用 -->
				<el-form-item label="工资表">
					<el-select v-model="form3.isPayroll" placeholder="请选择" clearable filterable @change="clearresultCode">
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="银行单据">
					<el-select v-model="form3.isBankReceipt" placeholder="请选择" clearable filterable @change="clearresultCode">
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否申报社保">
					<el-select v-model="form3.isSocialSecurity" placeholder="请选择" clearable filterable disabled>
						<el-option v-for="item in trueOrFalse1" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="预约时间">
					<el-date-picker v-model="form3.appointment" type="date" placeholder="请选择" format="yyyy-MM-dd" value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>
				</el-form-item>
				<div style="width: 100%;"></div>
				<el-form-item label="备注">
					<el-input style='width: 600px;' type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入" v-model="form3.remark">
					</el-input>
				</el-form-item>
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
						<el-table-column align="center" label="APP状态" prop="remark2" :resizable="false"></el-table-column>
						<el-table-column align="center" label="收账通知结果" prop="remark1" :resizable="false"></el-table-column>
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
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">关联公司</p>
				</div>
				<div style="width: 100%;">
					<el-table :data="relateCompany" style="width: 100%" v-loading='loading1'>
						<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->

						<!-- <el-table-column align="center" label="客户编号" prop="userCode" :resizable="false"></el-table-column> -->
						<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>

						<el-table-column align="center" label="区域" prop="area" :resizable="false"></el-table-column>

						<el-table-column align="center" label="服务状态" prop="serviceStatus" :resizable="false"></el-table-column>
						<el-table-column align="center" label="收账方式" prop="collectType" :resizable="false"></el-table-column>
						<el-table-column align="center" label="申报类型" prop="declareType" :resizable="false"></el-table-column>
						<el-table-column align="center" label="合同开始日期" prop="contractStartTime" :resizable="false">
							<template slot-scope="scope">
								<span>{{formatTimeToStr(scope.row.contractStartTime,'yyyy-MM-dd')}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="合同结束日期" prop="contractEndTime" :resizable="false">
							<template slot-scope="scope">
								<span>{{formatTimeToStr(scope.row.contractEndTime,'yyyy-MM-dd')}}</span>
							</template>
						</el-table-column>
						<!-- <el-table-column align="center" label="欠费月份" prop="oweMonth" :resizable="false"></el-table-column> -->
						<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>
						<!-- <el-table-column align="center" label="欠费客服" prop="period" :resizable="false"></el-table-column> -->

						<el-table-column align="center" label="收账通知客服" prop="acceptanceUserName" :resizable="false"></el-table-column>
						<el-table-column align="center" label="上月执行人" prop="lastExecutorName" :resizable="false"></el-table-column>
						<el-table-column align="center" label="是否代理认证" prop="isAgent" :resizable="false">
							<template slot-scope="scope">
								<span v-if="scope.row.isAgent == 1">是</span>
								<span v-else>否</span>
							</template>
						</el-table-column>

						<el-table-column align="center" label="是否零申报" prop="isDeclare" :resizable="false">
							<template slot-scope="scope">
								<span v-if="scope.row.isDeclare == 1">是</span>
								<span v-else>否</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="收账通知状态" prop="acceptanceState" :resizable="false">
							<template slot-scope="scope">
								<span v-if="scope.row.acceptanceState == 1">已分配</span>
								<span v-else>未分配</span>
							</template>
						</el-table-column>

						<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>
						<el-table-column align="center" label="分配时间" prop="remark1" :resizable="false"></el-table-column>

						<!-- <el-table-column align="center" :resizable="false">
							<template slot="header" slot-scope="scope">
								<span>操作</span>
							</template>
							<template slot-scope="scope">
								<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,1)">联系通知</el-button>
							</template>
						</el-table-column> -->
					</el-table>
				</div>
				<div style="width: 100%;height: 20px;"></div>
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">发票来源统计</p>
				</div>
				<div style="width: 100%;"></div>
				<el-form-item label="本月我司代开票">
					<el-input v-model="form3.dkp" disabled>
					</el-input>
				</el-form-item>
				<el-form-item label="本月我司代理记账费发票" class="longLabel">
					<el-input v-model="form3.dljz" disabled>
					</el-input>
				</el-form-item>
				<el-form-item label="其他内部待收票">
					<el-input v-model="form3.qt" disabled>
					</el-input>
				</el-form-item>

				<div style="width: 100%;"></div>
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">发票列表</p>
				</div>
				<div style="width: 100%;">
					<el-table :data="invoiceList" style="width: 100%" v-loading='loading3'>
						<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->

						<!-- <el-table-column align="center" label="客户编号" prop="userCode" :resizable="false"></el-table-column> -->
						<el-table-column align="center" label="发票号码" prop="invoiceNum" :resizable="false"></el-table-column>

						<el-table-column align="center" label="代码" prop="invoiceCode" :resizable="false"></el-table-column>

						<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="税额" prop="taxAmount" :resizable="false"></el-table-column>

						<el-table-column align="center" label="日期" prop="date" :resizable="false">
							<!-- <template slot-scope="scope">
								<span>{{formatTimeToStr(scope.row.date,'yyyy-MM-dd')}}</span>
							</template> -->
						</el-table-column>

					</el-table>

				</div>


			</el-form>



			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog1">取 消</el-button>
				<el-button type="primary" @click="commit">确 定</el-button>
			</span>


		</el-dialog>

		<el-dialog title="收账通知(编辑)" :visible.sync="dialogVisible2" width="1200px" :modal-append-to-body="false">

			<el-form :inline="true" ref="ruleForm6" :model="form3" class="demo-form-inline" label-width="120px" size="small">
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">基本信息</p>
				</div>
				<div style="width: 100%;"></div>
				<el-form-item label="客户名称">
					<el-input v-model="form3.customerName" disabled></el-input>
				</el-form-item>
				<el-form-item label="申报类型">
					<el-input v-model="form3.declareType" disabled></el-input>
				</el-form-item>
				<el-form-item label="收账通知结果" prop="resultCode">
					<el-select v-model="form3.resultCode" placeholder="请选择" filterable disabled>

						<el-option v-for="item in accountNoticeList1" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<!-- 一般纳税人 -->
				<el-form-item label="抄税清单" v-show="form3.declareType == '一般纳税人'">
					<el-select v-model="form3.ybTaxCollectionList" placeholder="请选择" clearable filterable disabled>
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="认证清单" v-show="form3.declareType == '一般纳税人'">
					<el-select v-model="form3.ybCertificationList" placeholder="请选择" clearable filterable disabled>
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>

					</el-select>
				</el-form-item>
				<!-- <el-form-item label="是否代理认证客户" v-show="form3.declareType == '一般纳税人'" class="longLabel">
					<el-select v-model="form3.isAgent" placeholder="请选择" clearable filterable disabled>
						<el-option v-for="item in trueOrFalse1" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="进项发票" v-show="form3.declareType == '一般纳税人'">
					<el-select v-model="form3.isInvoiceReceipts" placeholder="请选择" clearable filterable disabled>
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="销项发票" v-show="form3.declareType == '一般纳税人'">
					<el-select v-model="form3.ybSalesInvoice" placeholder="请选择" clearable filterable disabled>
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<!-- 小规模 -->
				<el-form-item label="收入发票" v-show="form3.declareType == '小规模'">
					<el-select v-model="form3.isRevenueBill" placeholder="请选择" clearable filterable disabled>
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="费用发票" v-show="form3.declareType == '小规模'">
					<el-select v-model="form3.isCostBill" placeholder="请选择" clearable filterable disabled>
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<!-- 通用 -->
				<el-form-item label="工资表">
					<el-select v-model="form3.isPayroll" placeholder="请选择" clearable filterable disabled>
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="银行单据">
					<el-select v-model="form3.isBankReceipt" placeholder="请选择" clearable filterable disabled>
						<el-option v-for="item in haveOrNohave" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否申报社保">
					<el-select v-model="form3.isSocialSecurity" placeholder="请选择" clearable filterable disabled>
						<el-option v-for="item in trueOrFalse1" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="预约时间">
					<el-date-picker v-model="form3.appointment" type="date" placeholder="请选择" format="yyyy-MM-dd" disabled
					 value-format="yyyy-MM-dd HH:mm:ss">
					</el-date-picker>
				</el-form-item>

				<el-form-item label="备注">
					<el-input style='width: 800px;' type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入" v-model="form3.remark">
					</el-input>
				</el-form-item>
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
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">关联公司</p>
				</div>
				<div style="width: 100%;">
					<el-table :data="relateCompany" style="width: 100%" v-loading='loading1'>
						<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->

						<!-- <el-table-column align="center" label="客户编号" prop="userCode" :resizable="false"></el-table-column> -->
						<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>

						<el-table-column align="center" label="区域" prop="area" :resizable="false"></el-table-column>

						<el-table-column align="center" label="服务状态" prop="serviceStatus" :resizable="false"></el-table-column>
						<el-table-column align="center" label="收账方式" prop="collectType" :resizable="false"></el-table-column>
						<el-table-column align="center" label="申报类型" prop="declareType" :resizable="false"></el-table-column>
						<el-table-column align="center" label="合同开始日期" prop="contractStartTime" :resizable="false">
							<template slot-scope="scope">
								<span>{{formatTimeToStr(scope.row.contractStartTime,'yyyy-MM-dd')}}</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="合同结束日期" prop="contractEndTime" :resizable="false">
							<template slot-scope="scope">
								<span>{{formatTimeToStr(scope.row.contractEndTime,'yyyy-MM-dd')}}</span>
							</template>
						</el-table-column>
						<!-- <el-table-column align="center" label="欠费月份" prop="oweMonth" :resizable="false"></el-table-column> -->
						<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>
						<!-- <el-table-column align="center" label="欠费客服" prop="period" :resizable="false"></el-table-column> -->

						<el-table-column align="center" label="收账通知客服" prop="acceptanceUserName" :resizable="false"></el-table-column>
						<el-table-column align="center" label="上月执行人" prop="lastExecutorName" :resizable="false"></el-table-column>
						<el-table-column align="center" label="是否代理认证" prop="isAgent" :resizable="false">
							<template slot-scope="scope">
								<span v-if="scope.row.isAgent == 1">是</span>
								<span v-else>否</span>
							</template>
						</el-table-column>

						<el-table-column align="center" label="是否零申报" prop="isDeclare" :resizable="false">
							<template slot-scope="scope">
								<span v-if="scope.row.isDeclare == 1">是</span>
								<span v-else>否</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="收账通知状态" prop="acceptanceState" :resizable="false">
							<template slot-scope="scope">
								<span v-if="scope.row.acceptanceState == 1">已分配</span>
								<span v-else>未分配</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>
						<el-table-column align="center" label="分配时间" prop="remark1" :resizable="false"></el-table-column>

						<!-- <el-table-column align="center" :resizable="false">
							<template slot="header" slot-scope="scope">
								<span>操作</span>
							</template>
							<template slot-scope="scope">
								<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row,1)">联系通知</el-button>
							</template>
						</el-table-column> -->
					</el-table>

				</div>

				<div style="width: 100%;height: 20px;"></div>
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">发票来源统计</p>
				</div>
				<div style="width: 100%;"></div>
				<el-form-item label="本月我司代开票">
					<el-input v-model="form3.dkp" disabled>
					</el-input>
				</el-form-item>
				<el-form-item label="本月我司代理记账费发票" class="longLabel">
					<el-input v-model="form3.dljz" disabled>
					</el-input>
				</el-form-item>
				<el-form-item label="其他内部待收票">
					<el-input v-model="form3.qt" disabled>
					</el-input>
				</el-form-item>

				<div style="width: 100%;"></div>
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">发票列表</p>
				</div>
				<div style="width: 100%;">
					<el-table :data="invoiceList" style="width: 100%" v-loading='loading3'>
						<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->

						<!-- <el-table-column align="center" label="客户编号" prop="userCode" :resizable="false"></el-table-column> -->
						<el-table-column align="center" label="发票号码" prop="invoiceNum" :resizable="false"></el-table-column>

						<el-table-column align="center" label="代码" prop="invoiceCode" :resizable="false"></el-table-column>

						<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="税额" prop="taxAmount" :resizable="false"></el-table-column>

						<el-table-column align="center" label="日期" prop="date" :resizable="false">
							<!-- <template slot-scope="scope">
								<span>{{formatTimeToStr(scope.row.date,'yyyy-MM-dd')}}</span>
							</template> -->
						</el-table-column>

					</el-table>

				</div>


			</el-form>



			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog2">取 消</el-button>
				<el-button type="primary" @click="commit2">确 定</el-button>
			</span>


		</el-dialog>



	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				isRole3: false,
				uploadData: {
					accountPeriod: ''
				},
				customerServicerList: [],

				form2: {},
				form3: {
					ybTaxCollectionList: '',
					ybCertificationList: '',
					isAgent: '',
					isInvoiceReceipts: '',
					ybSalesInvoice: '',
					isPayroll: '',
					isBankReceipt: '',
					isRevenueBill: '',
					isCostBill: '',
				},
				form1: {},

				multipleSelection: [],

				loading: false,
				loading1: false,
				loading2: false,
				loading3: false,

				userName: '',

				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],

				dialogVisible: false,
				dialogVisible1: false,
				dialogVisible2: false,
				trueOrFalse: [{
						label: '全部',
						value: ''
					},
					{
						label: '是',
						value: 1
					},
					{
						label: '否',
						value: 0
					}
				],
				trueOrFalse1: [{
						label: '是',
						value: 1
					},
					{
						label: '否',
						value: 0
					}
				],
				haveOrNohave: [
					// {label:'全部',value:''},
					{
						label: '有',
						value: 1
					},
					{
						label: '无',
						value: 0
					}
				],
				accountNoticeList: [{
						label: '全部',
						value: ''
					},
					{
						label: '空白',
						value: 0
					},
					{
						label: '预约顺丰交票',
						value: 1
					},
					{
						label: '拍照上传',
						value: 2
					},
					{
						label: '送至大厅',
						value: 3
					},
					{
						label: '自行邮寄',
						value: 4
					},
					{
						label: '无账零申报',
						value: 5
					},
					{
						label: '再联系',
						value: 6
					},
					{
						label: '联系不上',
						value: 7
					},
					{
						label: '交接意向',
						value: 8
					},
					{
						label: '注销结束',
						value: 9
					},
					{
						label: '仅有内部代交票',
						value: 10
					},
					{
						label: '工资表代收账',
						value: 11
					},
				],
				// accountNoticeList1:[
				// 	{label:'预约顺丰交票',value:1},
				// 	{label:'拍照上传',value:2},
				// 	{label:'送至大厅',value:3},
				// 	{label:'自行邮寄',value:4},
				// 	{label:'无账零申报',value:5},
				// 	{label:'再联系',value:6},
				// 	{label:'联系不上',value:7},
				// 	{label:'交接意向',value:8},
				// 	{label:'注销结束',value:9},
				// 	{label:'仅有内部代交票',value:10},
				// 	{label:'工资表代收账',value:11},
				// ],
				status: '',
				declareType: '',
				collectType: '',
				isAgent: '',

				isDeclare: '',
				isThreemonthdeclare: '',
				isQuarterlyReport: '',


				accountNotice: '',
				resultCode: '',
				collectionAppointmentTime: '',


				contactPersonInfo: [],
				relateCompany: [],
				remarkList: [],
				invoiceList: [],
				total1: 0,
				currentPage1: 1,
				pageSize1: 10,
			}
		},
		components: {},
		methods: {
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
			hideDialog1() {
				this.dialogVisible1 = false;
				this.reset();
			},
			hideDialog2() {
				this.dialogVisible2 = false;
				this.reset();
			},
			reset() {
				this.form = {};
				this.form2 = {};
				this.form3 = {};
			},






			search() {
				this.customerName = this.uploadData.customerName;
				this.accountPeriod = this.uploadData.accountPeriod;
				this.acceptanceUserId = this.uploadData.acceptanceUserId ? this.uploadData.acceptanceUserId : '';
				this.lastExecutorId = this.uploadData.lastExecutorId;
				this.declareType = this.uploadData.declareType;
				this.collectType = this.uploadData.collectType;
				this.isAgent = this.uploadData.isAgent;

				// this.isDeclare = this.uploadData.isDeclare;
				this.isThreemonthdeclare = this.uploadData.isThreemonthdeclare;
				this.isQuarterlyReport = this.uploadData.isQuarterlyReport;


				this.accountNotice = this.uploadData.accountNotice;
				this.resultCode = this.uploadData.resultCode;

				this.collectionAppointmentTime = this.uploadData.collectionAppointmentTime;

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
						acceptanceUserId: this.acceptanceUserId,
						lastExecutorId: this.lastExecutorId,

						declareType: this.declareType,
						collectType: this.collectType,
						isAgent: this.isAgent,

						// isDeclare : this.isDeclare,
						isThreemonthdeclare: this.isThreemonthdeclare,
						isQuarterlyReport: this.isQuarterlyReport,


						accountNotice: this.accountNotice,
						resultCode: this.resultCode,
						collectionAppointmentTime: this.collectionAppointmentTime,

						noticeType: 1,
						field1: 1
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

				// this.manageId = row.manageId;
				this.getAccountNotice(row);

			},

			handleStop(index, row) {
				this.$confirm('确认终止?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = {
						customerId: row.customerId,
						manageId: row.manageId,
						taxationId: row.taxationId,
						taxInfoId: row.taxInfoId,
						stepName: '收账通知',
						remark: '无效客户，终止收账通知',
					};
					this.axios.post('/perTaxToolTwo/callcenter/accountNotice/submitTerminate', param).then(res => {
						this.loading1 = false;
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
						this.loading1 = false;
						this.$message({
							message: '操作失败',
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

			getAccountNotice(row) {
				let param = {
					manageId: row.manageId
				};
				this.axios.post('/perTaxToolTwo/callcenter/accountNotice/getAccountNotice', param).then(res => {
					this.loading1 = false;
					if (res.data.code == 200) {
						if (res.data.data) {
							if (res.data.data.accountNoticeId) {
								this.dialogVisible1 = true;
								this.form3 = JSON.parse(JSON.stringify(res.data.data));
								this.form3.manageId = this.form3.serviceManageId;
								this.form3.declareType = row.declareType;
								this.remarkList = this.form3.noticeRemarkList;
								this.getContactList(row);
								this.getRelationCustomer(row);
								this.statisticsIocr(row);
								this.selectIocrPageList(row);
							}
						} else {
							this.dialogVisible1 = true;
							this.form3 = JSON.parse(JSON.stringify(row));
							this.remarkList = this.form3.noticeRemarkList;
							this.getContactList(row);
							this.getRelationCustomer(row);
							this.statisticsIocr(row);
							this.selectIocrPageList(row);
						}



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




			getRelationCustomer(row) {
				this.loading2 = true;
				let param = {
					manageId: row.manageId
				};
				this.axios.post('/perTaxToolTwo/callcenter/accountNotice/getRelationCustomer', param).then(res => {
					this.loading2 = false;
					if (res.data.code == 200) {
						this.relateCompany = res.data.data;
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
					this.loading2 = false;
					this.$message({
						message: '获取关联公司失败',
						type: 'error'
					});
				})
			},

			clearresultCode() {
				this.form3.resultCode = '';
			},

			statisticsIocr(row) {
				let param = {
					manageId: row.manageId
				};
				this.axios.post('/perTaxToolTwo/callcenter/accountNotice/statisticsIocr', param).then(res => {
					if (res.data.code == 200) {
						this.form3.dkp = res.data.data.dkp;
						this.form3.dljz = res.data.data.dljz;
						this.form3.qt = res.data.data.qt;
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
						message: '获取关联公司失败',
						type: 'error'
					});
				})
			},
			selectIocrPageList(row) {
				this.loading3 = true;
				let param = {
					row: this.pageSize1,
					page: this.currentPage1,
					data: {
						manageId: row.manageId
					}

				};
				this.axios.post('/perTaxToolTwo/callcenter/accountNotice/selectIocrPageList', param).then(res => {
					this.loading3 = false;
					if (res.data.code == 200) {
						this.invoiceList = res.data.data;
						this.total = res.data.count;
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
					this.loading3 = false;
					this.$message({
						message: '获取关联公司失败',
						type: 'error'
					});
				})
			},

			handleMul() {
				this.$confirm('确定资料已归还？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.multipleSelection.forEach(item => {
						item.moduleIdentification = 'MaterialReturn'
					})
					let param = this.multipleSelection;
					this.axios.post('/perTaxToolTwo/columbusNew/Material/ReturnMaterialInfo', param).then(res => {

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
							message: '归还失败',
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


			commit() {
				this.$refs['ruleForm5'].validate((valid) => {
					if (valid) {
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
							if (this.form3.resultCode == 5) {
								let params = {
									"list": [{
										"customerId": this.form3.customerId,
										"assignTime": this.form3.accountPeriod,
									}]
								};
								this.axios.post('/perTaxToolTwo/import/autoCheckout', params).then(res => {
									if (res.data.code == 200) {
										this.$message({
											message: res.data.data[0].msg,
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
										message: '操作失败',
										type: 'error'
									});
								})

								let params1 = {
									"customerId": this.form3.customerId,
									"customerName": this.form3.customerName,
									"accountPeriod": this.form3.accountPeriod,
									"state": 1, // 申请状态：1 – 申请；2 – 取消
									"resource": 2 // 来源：1 - 客户；2 - 客服
								};
								this.axios.post('/perTaxToolTwo/import/zeroApply', params1).then(res => {
									

								}).catch(function(err) {
									this.$message({
										message: '操作失败',
										type: 'error'
									});
								})
							};
							this.form3.serviceManageId = this.form3.manageId;
							this.form3.contactName = this.multipleSelection[0].contactname;
							this.form3.contactPhone = this.multipleSelection[0].phone;
							let param = this.form3;
							this.axios.post('/perTaxToolTwo/callcenter/accountNotice/saveOrUpdateAccountNotice', param).then(res => {
								this.loading = false;
								if (res.data.code == 200) {
									this.dialogVisible1 = false;
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
									message: '操作失败',
									type: 'error'
								});
							})
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				})








			},

			commit2() {
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
					if (this.form3.resultCode == 5) {
						let params = {
							"list": [{
								"customerId": this.form3.customerId,
								"assignTime": this.form3.accountPeriod,
							}]
						};
						this.axios.post('/perTaxToolTwo/import/autoCheckout', params).then(res => {
							if (res.data.code == 200) {
								this.$message({
									message: res.data.data[0].msg,
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
								message: '操作失败',
								type: 'error'
							});
						})
					};

					// let param = {
					// 	accountNoticeId:this.form3.accountNoticeId,
					// 	remark:this.form3.remark,
					// 	contactName:this.multipleSelection[0].remark1,
					// 	contactPhone:this.multipleSelection[0].customerPhone
					// };
					this.form3.serviceManageId = this.form3.manageId;
					this.form3.contactName = this.multipleSelection[0].contactname;
					this.form3.contactPhone = this.multipleSelection[0].phone;
					this.form3.accountNoticeId = this.form3.accountNoticeId;
					let param = this.form3;
					this.axios.post('/perTaxToolTwo/callcenter/accountNotice/saveOrUpdateAccountNotice', param).then(res => {

						if (res.data.code == 200) {
							this.dialogVisible2 = false;
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
							message: '操作失败',
							type: 'error'
						});
					})
				}



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
						message: '查询失败',
						type: 'error'
					});
				})
			},

			getCurrentPeriod() {

				let params = {

				};
				this.axios.post('/perTaxToolTwo/e9z/taxTreatment/getCurrentPeriod', params)
					.then(res => {

						if (res.data.code == 200) {
							this.uploadData.accountPeriod = res.data.data;
							this.accountPeriod = res.data.data;
							this.queryListByPage();
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





		},
		computed: {

			accountNoticeList1: function() {
				if (this.form3.declareType == '一般纳税人') {
					if (this.form3.ybTaxCollectionList === 0 &&
						this.form3.ybCertificationList === 0 &&
						// this.form3.poolId === 0 && 
						this.form3.isInvoiceReceipts === 0 &&
						this.form3.ybSalesInvoice === 0 &&
						this.form3.isPayroll === 0 &&
						this.form3.isBankReceipt === 0
					) {
						return [{
							label: '无账零申报',
							value: 5
						}]
					} else if (this.form3.ybTaxCollectionList === '' ||
						this.form3.ybCertificationList === '' ||
						// this.form3.poolId === '' || 
						this.form3.isInvoiceReceipts === '' ||
						this.form3.ybSalesInvoice === '' ||
						this.form3.isPayroll === '' ||
						this.form3.isBankReceipt === '') {
						return [{
								label: '再联系',
								value: 6
							},
							{
								label: '联系不上',
								value: 7
							},
							{
								label: '交接意向',
								value: 8
							},
							{
								label: '注销结束',
								value: 9
							}
						]
					} else if (this.form3.isPayroll === 1 &&
						!(this.form3.ybTaxCollectionList == undefined &&
							this.form3.ybCertificationList == undefined &&
							// this.form3.poolId == undefined && 
							this.form3.isInvoiceReceipts == undefined &&
							this.form3.ybSalesInvoice == undefined &&
							this.form3.isBankReceipt == undefined)) {
						return [{
								label: '预约顺丰交票',
								value: 1
							},
							{
								label: '拍照上传',
								value: 2
							},
							{
								label: '送至大厅',
								value: 3
							},
							{
								label: '自行邮寄',
								value: 4
							},
							{
								label: '仅有内部代交票',
								value: 10
							},
							{
								label: '工资表代收账',
								value: 11
							},
						]
					} else if (this.form3.isPayroll === 0 &&
						!(this.form3.ybTaxCollectionList == undefined &&
							this.form3.ybCertificationList == undefined &&
							// this.form3.poolId == undefined && 
							this.form3.isInvoiceReceipts == undefined &&
							this.form3.ybSalesInvoice == undefined &&
							this.form3.isBankReceipt == undefined)) {
						return [{
								label: '预约顺丰交票',
								value: 1
							},
							{
								label: '拍照上传',
								value: 2
							},
							{
								label: '送至大厅',
								value: 3
							},
							{
								label: '自行邮寄',
								value: 4
							},
							{
								label: '仅有内部代交票',
								value: 10
							}
						]
					} else {
						return [{
								label: '再联系',
								value: 6
							},
							{
								label: '联系不上',
								value: 7
							},
							{
								label: '交接意向',
								value: 8
							},
							{
								label: '注销结束',
								value: 9
							}
						]
					}
				} else {
					if (this.form3.isRevenueBill === 0 &&
						this.form3.isCostBill === 0 &&
						this.form3.isPayroll === 0 &&
						this.form3.isBankReceipt === 0
					) {
						return [{
							label: '无账零申报',
							value: 5
						}]
					} else if (this.form3.isRevenueBill === '' ||
						this.form3.isCostBill === '' ||
						this.form3.isPayroll === '' ||
						this.form3.isBankReceipt === '') {
						return [{
								label: '再联系',
								value: 6
							},
							{
								label: '联系不上',
								value: 7
							},
							{
								label: '交接意向',
								value: 8
							},
							{
								label: '注销结束',
								value: 9
							}
						]
					} else if (this.form3.isRevenueBill == undefined ||
						this.form3.isCostBill == undefined ||
						this.form3.isPayroll == undefined ||
						this.form3.isBankReceipt == undefined) {
						return [{
								label: '再联系',
								value: 6
							},
							{
								label: '联系不上',
								value: 7
							},
							{
								label: '交接意向',
								value: 8
							},
							{
								label: '注销结束',
								value: 9
							}
						]
					} else if (this.form3.isPayroll === 1 &&
						!(this.form3.isRevenueBill == undefined &&
							this.form3.isCostBill == undefined &&
							this.form3.isBankReceipt == undefined)) {
						console.log(this.form3.isRevenueBill);
						console.log(this.form3.isCostBill);
						console.log(this.form3.isBankReceipt);
						return [{
								label: '预约顺丰交票',
								value: 1
							},
							{
								label: '拍照上传',
								value: 2
							},
							{
								label: '送至大厅',
								value: 3
							},
							{
								label: '自行邮寄',
								value: 4
							},
							{
								label: '仅有内部代交票',
								value: 10
							},
							{
								label: '工资表代收账',
								value: 11
							},
						]
					} else if (this.form3.isPayroll === 0 &&
						!(this.form3.isRevenueBill == undefined &&
							this.form3.isCostBill == undefined &&
							this.form3.isBankReceipt == undefined
						)) {
						return [{
								label: '预约顺丰交票',
								value: 1
							},
							{
								label: '拍照上传',
								value: 2
							},
							{
								label: '送至大厅',
								value: 3
							},
							{
								label: '自行邮寄',
								value: 4
							},
							{
								label: '仅有内部代交票',
								value: 10
							}
						]
					} else {
						return [{
								label: '再联系',
								value: 6
							},
							{
								label: '联系不上',
								value: 7
							},
							{
								label: '交接意向',
								value: 8
							},
							{
								label: '注销结束',
								value: 9
							}
						]
					}
				}

			}
		},
		created() {
			// this.queryListByPage();
			this.getCurrentPeriod();
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
</style>
