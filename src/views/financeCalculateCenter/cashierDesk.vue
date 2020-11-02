<template>
	<div class="main_contain">
		<div class="left_contain clearfix">
			<div class="contain_header">
				<!-- <div class='title'>银行对账</div> -->
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
					<el-form-item label="客户名称:">
						<el-select v-model='formInline.customerId' clearable>
							<el-option v-for='item in customerList' :label="item.customerName" :value="item.customerId" :key='item.customerId'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="">
						<el-checkbox v-model="isGetAssociated" :true-label='truelabel' :false-label="falselabel">是否带出关联公司</el-checkbox>
					</el-form-item>
					<el-form-item>
						<el-button @click='search' size="mini" type="primary">搜索</el-button>
						<el-button @click='cashier' size="mini" type="success">收银</el-button>
					</el-form-item>
					<div></div>
					<el-form-item label="关联公司">
						<el-tag v-for='item in branchList' style='cursor: pointer;' @click='setCustom(item)'>{{item.branchName}}</el-tag>
						<el-tag v-if='branchList.length == 0'>无关联公司</el-tag>
					</el-form-item>


				</el-form>
			</div>
			<div class="contain_header fr">
				<div class='title'>账户信息</div>
				<el-table :data="accountList" style="width: 100%" stripe border>
					<!-- <el-table-column type="selection" width="50"></el-table-column> -->

					<el-table-column align="center" label="账户名称" prop="accountName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="可用余额" prop="availableAmount" :resizable="false"></el-table-column>

					<el-table-column align="center" width="250" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">

							<el-button size="mini" type="warning" @click="handleEdit(scope.$index, scope.row)">充值</el-button>
							<el-button size="mini" type="danger" @click="handleCancel(scope.$index, scope.row)">划拨</el-button>
							<el-button size="mini" type="primary" @click="handleCancel(scope.$index, scope.row)">退费</el-button>
						</template>
					</el-table-column>
				</el-table>
			</div>
		</div>
		<div id='form'>
			<el-tabs v-model="activeName" @tab-click="handleClick" type="card">
				<el-tab-pane label="代理记账" name="first">
					<div class='title'>合同内容</div>
					<el-form :inline="true" :model="formDetail" class="demo-form-inline" size="mini" label-width="110px">
						<el-form-item label="客户名称">
							<el-input v-model='formDetail.customername' disabled></el-input>
						</el-form-item>
						<el-form-item label="客户经理">
							<el-input v-model='formDetail.customermanager' disabled></el-input>
						</el-form-item>
						<el-form-item label="合同编号">
							<el-input v-model='formDetail.contractcode' disabled></el-input>
						</el-form-item>
						<el-form-item label="合同状态">
							<el-select v-model='formDetail.state' disabled>
								<el-option label="待审核" :value="isfalse"></el-option>
								<el-option label="审核中" :value="istrue"></el-option>
								<el-option label="已审核" :value="istwo"></el-option>
								<el-option label="作废" :value="isthree"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="签约日期">
							<el-input v-model='formDetail.signdate' disabled></el-input>
						</el-form-item>
						<el-form-item label="合同生效日期">
							<el-input v-model='formDetail.effectivedate' disabled></el-input>
						</el-form-item>

						<el-form-item label="合同截止日期">
							<el-input v-model='formDetail.contenddate' disabled></el-input>
						</el-form-item>
						<el-form-item label="合同审核人">
							<el-input v-model='formDetail.auditor' disabled></el-input>
						</el-form-item>
						<el-form-item label="是否待开票">
							<el-select v-model='formDetail.isproxyinvoice' disabled>
								<el-option label="是" :value="istrue"></el-option>
								<el-option label="否" :value="isfalse"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否取票">
							<el-select v-model='formDetail.istaketicket' disabled>
								<el-option label="是" :value="istrue"></el-option>
								<el-option label="否" :value="isfalse"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否零申报">
							<el-select v-model='formDetail.iszerotax' disabled>
								<el-option label="是" :value="istrue"></el-option>
								<el-option label="否" :value="isfalse"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否代理认证">
							<el-select v-model='formDetail.isproxyauthentication' disabled>
								<el-option label="是" :value="istrue"></el-option>
								<el-option label="否" :value="isfalse"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="甲方授权人">
							<el-input v-model='formDetail.ownerrepresent' disabled></el-input>
						</el-form-item>
						<el-form-item label="甲方违约金(元)">
							<el-input v-model='formDetail.firstpartypenalty' disabled></el-input>
						</el-form-item>
						<el-form-item label="乙方违约金(元)">
							<el-input v-model='formDetail.secondpartypenalty' disabled></el-input>
						</el-form-item>
						<el-form-item label="合同单价(元)">
							<el-input v-model='formDetail.unitprice' disabled></el-input>
						</el-form-item>
						<el-form-item label="结算方式">
							<el-input v-model='formDetail.paytype' disabled></el-input>
						</el-form-item>
						<el-form-item label="首次付款(元)">
							<el-input v-model='formDetail.firstpayment' disabled></el-input>
						</el-form-item>

						<el-form-item label="登记时间">
							<el-input v-model='formDetail.registertime' disabled></el-input>
						</el-form-item>
						<el-form-item label="登记人">
							<el-input v-model='formDetail.registerperson' disabled></el-input>
						</el-form-item>
						<el-form-item label="区域">
							<el-input v-model='formDetail.areaname' disabled></el-input>
						</el-form-item>
						<el-form-item label="签单组">
							<el-input v-model='formDetail.signbillgroupid' disabled></el-input>
						</el-form-item>
						<el-form-item label="电话组">
							<el-input v-model='formDetail.telgroupid' disabled></el-input>
						</el-form-item>
						<el-form-item label="是否财务合同">
							<el-select v-model='formDetail.isfinadvcontract' disabled>
								<el-option label="是" :value="istrue"></el-option>
								<el-option label="否" :value="isfalse"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="备注">
							<el-input v-model='formDetail.remark' disabled></el-input>
						</el-form-item>
					</el-form>


					<div class='title' style="border-top: 1px solid #eee;line-height: 0.4rem;height: 0.4rem;">合同包含的服务项目</div>
					<div style="padding: 0 20px 20px;">
						<el-table :data="result[index]" style="width: 100%;max-height: 400px;overflow: auto;" stripe border v-for='(item,index) in result.length'
						 v-show='index == currentPage10 - 1'>
							<el-table-column type="index" width="50" align="center"></el-table-column>
							<el-table-column align="center" label="服务项目编号" prop="svrItemNo" :resizable="false"></el-table-column>
							<el-table-column align="center" label="服务项目名称" prop="svrItemName" :resizable="false" width="300"></el-table-column>
							<el-table-column align="center" label="单价" prop="servicePrice" :resizable="false"></el-table-column>
							<el-table-column align="center" label="服务类型" prop="svrItemCateName" :resizable="false"></el-table-column>
							<el-table-column align="center" label="费用类型" prop="costTypeName" :resizable="false"></el-table-column>
							<el-table-column align="center" label="服务开始时间" :resizable="false">
								<template slot-scope="scope">
									<span>{{formatTimeToStr(scope.row.serverStart,'yyyy-MM-dd')}}</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="服务结束时间" :resizable="false">
								<template slot-scope="scope">
									<span>{{formatTimeToStr(scope.row.serverEnd,'yyyy-MM-dd')}}</span>
								</template>
							</el-table-column>
						</el-table>
						<el-pagination background layout="total,prev, pager, next, jumper" :total="total10" :page-size=4 @current-change='handleCurrentChange10'
						 :current-page="currentPage10">
						</el-pagination>
					</div>


				</el-tab-pane>

				<el-tab-pane label="交办事项" name="second" disabled>
					<div class='title'>合同内容</div>
					<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini" label-width="110px">
						<el-form-item label="客户名称">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
						<el-form-item label="客户经理">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
						<el-form-item label="协议受理号">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
						<el-form-item label="协议状态">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
						<el-form-item label="登记时间">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
						<el-form-item label="合同生效日期">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>

						<el-form-item label="登记人">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
						<el-form-item label="甲方授权代表">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
						<el-form-item label="客户代表">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
						<el-form-item label="签约日期">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
						<el-form-item label="生效日期">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
						<el-form-item label="作废日期">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>

						<el-form-item label="甲方违约金">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
						<el-form-item label="乙方违约金">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
						<el-form-item label="首付款">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
						<el-form-item label="备注">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
						<el-form-item label="生效日期">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
						<el-form-item label="作废日期">
							<el-input v-model='formInline.userName' disabled></el-input>
						</el-form-item>
					</el-form>


					<div class='title'>合同包含的服务项目</div>
					<el-table :data="bankList" style="width: 100%;max-height: 400px;overflow: auto;" stripe border v-loading='loading'>
						<el-table-column align="center" label="序号" prop="customername" :resizable="false"></el-table-column>
						<el-table-column align="center" label="服务项目编号" prop="date" :resizable="false"></el-table-column>
						<el-table-column align="center" label="服务项目名称" prop="abstract" :resizable="false" width="300"></el-table-column>
						<el-table-column align="center" label="单价" prop="debtAmount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="服务类型" prop="creditAmount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="费用类型" prop="belongTo" :resizable="false">

						</el-table-column>

					</el-table>

				</el-tab-pane>

				<el-tab-pane label="外勤" name="third" disabled>

				</el-tab-pane>
			</el-tabs>
		</div>

		<div style="background: #fff;" class="clearfix">
			<div class='title' style="line-height: 0.4rem;height: 0.4rem;">往来收银记录</div>
			<el-form :inline="true" :model="formInline2" class="demo-form-inline" size="mini" label-width="100px">
				<el-form-item label="收银状态:">
					<el-select v-model='formInline2.state' clearable size="mini">
						<el-option v-for='item in typeList' :label="item.label" :value="item.value" :key='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="起始时间:">
					<el-date-picker v-model="formInline2.cashStart" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="截止时间:">
					<el-date-picker v-model="formInline2.cashEnd" type="date" placeholder="选择日期" value-format="yyyy-MM-dd">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="收银员:">
					<el-select v-model='formInline2.cashierId' clearable size="mini">
						<el-option v-for='item in typeList' :label="item.label" :value="item.value" :key='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="实际收银:">
					<el-input v-model='formInline2.amountLowerLimit' style='width: 80px;margin-right: 6px;'></el-input>
					<span>-</span>
					<el-input v-model='formInline2.amountUpperLimit' style='width: 80px;margin-left: 6px;'></el-input>

				</el-form-item>
				<el-form-item>
					<el-button @click='searchRecord' size="mini" type="primary">查询</el-button>
				</el-form-item>
			</el-form>
		</div>
		<div style="padding: 10px 20px;background: #fff;" class="clearfix">
			<el-table :data="record" style="width: 100%;" stripe border>
				<el-table-column align="center" type="index" width="50"></el-table-column>
				<el-table-column align="center" label="收银单号" prop="invoicesNo" :resizable="false" width="300"></el-table-column>
				<el-table-column align="center" label="应收金额(元)" prop="totalAmount" :resizable="false"></el-table-column>

				<!-- <el-table-column align="center" label="赠送金额(元)" prop="startperiod" :resizable="false"></el-table-column>
			
				<el-table-column align="center" label="积分兑换" prop="customername" :resizable="false"></el-table-column>
				<el-table-column align="center" label="实收金额(元)" prop="startperiod" :resizable="false"></el-table-column>
				<el-table-column align="center" label="作废金额(元)" prop="startperiod" :resizable="false"></el-table-column>
			
				<el-table-column align="center" label="支付方式" prop="customername" :resizable="false"></el-table-column>
				<el-table-column align="center" label="服务周期" prop="startperiod" :resizable="false"></el-table-column> -->
				<el-table-column align="center" label="收银员" prop="cashierId" :resizable="false"></el-table-column>
				<el-table-column align="center" label="收银时间" prop="cashDate" :resizable="false">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.cashDate)}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="收银状态" prop="state" :resizable="false">
					<template slot-scope="scope">
						<span v-show="scope.row.state == 0">收银</span>
						<span v-show="scope.row.state == 1">待审核</span>
						<span v-show="scope.row.state == 2">待入账</span>
						<span v-show="scope.row.state == 3">已入账</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="是否对账" :resizable="false">
					<template slot-scope="scope">
						<span>{{scope.row.isCheckAccount?"是":"否"}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>扣费记录</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click="handleKFrecord(scope.$index, scope.row)">查看</el-button>
					</template>
				</el-table-column>
				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>缴费记录</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="primary" @click="handleJFrecord(scope.$index, scope.row)">查看</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>
		</div>
		<el-dialog title="扣费记录详情" :visible.sync="dialogTableVisible" width="800px" :before-close="hideDialog">
			<el-table :data="fkrecord" style="width: 100%;" stripe border>
				<el-table-column align="center" type="index" width="50"></el-table-column>
				<el-table-column align="center" label="服务项目编号" prop="svrItemNo" :resizable="false"></el-table-column>
				<el-table-column align="center" label="服务项目名称" prop="svrItemName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="金额" prop="costAmount" :resizable="false"></el-table-column>
				<el-table-column align="center" label="服务开始时间" :resizable="false">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.svrStart,'yyyy-MM-dd')}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="服务结束时间" :resizable="false">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.svrEnd,'yyyy-MM-dd')}}</span>
					</template>
				</el-table-column>

			</el-table>
			<div class='btn_contain clearfix'>
				<span class='close' @click="hideDialog">关闭</span>
			</div>
		</el-dialog>

		<el-dialog title="缴费记录详情" :visible.sync="dialogVisible" width="800px" :before-close="handleClose">
			<el-table :data="jfrecord" style="width: 100%;" stripe border>
				<el-table-column align="center" type="index" width="50"></el-table-column>
				<el-table-column align="center" label="缴费方式" prop="payMethodName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="缴费金额" prop="amount" :resizable="false"></el-table-column>


			</el-table>
			<div class='btn_contain clearfix'>
				<span class='close' @click="handleClose">关闭</span>
			</div>
		</el-dialog>

		<el-dialog title="收银" :visible.sync="dialogVisible1" width="1000px" :before-close="handleClose1" id='dialog'>
			<div class="clearfix dialog_main">
				<div class='dialog_left'>
					<div class='first'>
						<h3>代理记账收银</h3>
						<el-form :inline="true" :model="cashierDetail" class="demo-form-inline" size="mini" label-width="134px">
							<el-form-item label="服务周期：">
								<el-select v-model='month' clearable size="mini" @change="setMonth">
									<el-option v-for='item in monthList' :label="item.label" :value="item.value" :key='item.value'></el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="应收款开始日：">
								<span>{{cashierDetail.start}}</span>
							</el-form-item>
							<el-form-item label="应收款结束日：">
								<span>{{cashierDetail.end}}</span>
							</el-form-item>
							<el-form-item label="合同单价(元)：">
								<span>{{cashierDetail.unitPrice}}</span>
							</el-form-item>
							<el-form-item label="应收金额(元)：">
								<span>{{cashierDetail.amount}}</span>
							</el-form-item>
							<el-form-item label="扣除账户金额(元)：">
								<span>{{cashierDetail.accountAmount}}</span>
							</el-form-item>
							<el-form-item label="实际应收金额(元)：">
								<span>{{cashierDetail.actualAmount}}</span>
							</el-form-item>

						</el-form>
					</div>
					<div class='second'>
						<h3>交办事项</h3>
						<el-form :inline="true" :model="assignedItem" class="demo-form-inline" size="mini" label-width="134px">

							<el-form-item label="应收金额(元)：">
								<span>{{assignedItem.amount?assignedItem.amount:0}}</span>

							</el-form-item>
							<el-form-item label="扣除账户金额(元)：">
								<span>{{assignedItem.accountAmount?assignedItem.accountAmount:0}}</span>

							</el-form-item>
						</el-form>
					</div>
					<div class='third'>
						<h3>赠送</h3>
						<el-form :inline="true" :model="formInline2" class="demo-form-inline" size="mini" label-width="110px">
							<el-form-item label="赠送金(元)：">
								<el-input v-model='freeamount' clearable size="mini"></el-input>
							</el-form-item>
							<el-form-item label="可用余额(元)：">
								<span>{{tCustomerAccountGiving.availableAmount}}</span>

							</el-form-item>
							<div style="width: 100%;"></div>
							<el-form-item label="赠送原因：">
								<el-input type="textarea" v-model='formInline2.limit' :row='3' resize="none" style='width: 500px;'>

								</el-input>
							</el-form-item>
						</el-form>
					</div>
					<div class='forth'>
						<el-form :model="formInline2" class="demo-form-inline" size="mini" label-width="110px">
							<el-form-item label="收银备注：">
								<el-input v-model='formInline2.limit' style='width: 500px;'>

								</el-input>
							</el-form-item>
						</el-form>



					</div>

				</div>
				<div class='dialog_right'>
					<div class="right_first">
						<el-form :inline="true" :model="formCash" class="demo-form-inline" size="mini" label-width="80px">
							<el-form-item label="支付方式">
								<el-select v-model='formCash.label' clearable size="mini" value-key="dicId">
									<el-option v-for='item in payList' :label="item.dicName" :value="item" :key='item.dicId'></el-option>
								</el-select>
							</el-form-item>

							<el-form-item label="金额(元)">
								<el-input v-model='formCash.amount' clearable size="mini"></el-input>
							</el-form-item>
							<el-form-item>
								<el-button size="mini" type="success" style='width: 200px;' @click='addcash'>添加</el-button>
							</el-form-item>
						</el-form>
					</div>
					<div class="right_second">
						<div class="second_one">
							<h3>收银小计</h3>
							<div v-for='(item,index) in cashList' style="margin-bottom: 4px;">
								<label>{{item.label}}：</label><span>{{item.amount}}</span>
								<el-button type="warning" size="mini" @click='delCash(index)'> 删除</el-button>
							</div>

						</div>
						<div class="second_two">
							<div>
								<label for="">总收金额（元）：</label><span>{{cashierDetail.amount + (assignedItem.amount?assignedItem.amount:0)}}</span>
							</div>
							<div>
								<label for="">账户余额使用（元）：</label><span>{{cashierDetail.accountAmount + (assignedItem.accountAmount?assignedItem.accountAmount:0)}}</span>
							</div>
							<div>
								<label for="">赠送余额（元）：</label><span>{{freeamount}}</span>
							</div>
							<div>
								<label for="">总实收金额（元）：</label><span>{{realAmount}}</span>
							</div>

							<el-button type="danger" size="mini" style='width:200px' @click='submitPay'>确定收银</el-button>
						</div>
					</div>

				</div>
			</div>

			<!-- <div class='btn_contain clearfix'>
				<span class='close' @click="handleClose">关闭</span>
			</div> -->
		</el-dialog>

		<el-dialog title="账户充值" :visible.sync="dialogVisible111" width="400px">
			<el-form :inline="true" :model="account" class="demo-form-inline" size="mini" label-width="80px">
				<!-- <el-form-item label="账户">
					<el-select v-model='account.accountId' clearable size="mini">
						<el-option v-for='item in AccountList' :label="item.accountName" :value="item.id" :key='item.id'></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="付款方式">
					<el-select v-model='account.payMethod' clearable size="mini">
						<el-option v-for='item in payList' :label="item.dicName" :value="item.dicId" :key='item.dicId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="金额(元)">
					<el-input v-model='account.amount' clearable size="mini"></el-input>
				</el-form-item>
			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click="handleCommit">确定</span>
			</div>
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				AccountList: [],
				istrue: 1,
				isfalse: 0,
				istwo: 2,
				isthree: 3,
				customerList: [],
				isGetAssociated: 1,
				truelabel: 1,
				falselabel: 0,
				branchList: [],
				formDetail: {},
				formTable: [],
				record: [],
				accountList: [],
				dialogTableVisible: false,
				fkrecord: [],
				jfrecord: [],
				cashierDetail: {},
				tCustomerAccountGiving: {},
				cashList: [],
				activeName: "first",
				formInline2: {

				},
				formCash: {},
				contractChargeEventId: '',
				payList: [],
				assignedItem: {},
				freeamount: 0,
				realAmount: 0,
				month: 1,
				account: {},
				tCustomerAccountSub: [],
				monthList: [{
						label: '一个月',
						value: 1
					},
					{
						label: '两个月',
						value: 2
					},
					{
						label: '三个月',
						value: 3
					},
					{
						label: '四个月',
						value: 4
					},
					{
						label: '五个月',
						value: 5
					},
					{
						label: '六个月',
						value: 6
					},
					{
						label: '七个月',
						value: 7
					},
					{
						label: '八个月',
						value: 8
					},
					{
						label: '九个月',
						value: 9
					},
					{
						label: '十个月',
						value: 10
					},
					{
						label: '十一个月',
						value: 11
					},
					{
						label: '一年',
						value: 12
					},
					{
						label: '一年半',
						value: 18
					},
					{
						label: '两年',
						value: 24
					},
				],
				typeList: [{
						label: '收银',
						value: 0
					},
					{
						label: '待审核',
						value: 1
					},
					{
						label: '待入账',
						value: 2
					},
					{
						label: '已入账',
						value: 3
					},
				],
				loading: false,
				formInline: {
					bankname: '',
					customername: ''
				},
				bankname: '',
				customername: '',
				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				currentPage10: 1,
				pageSize: 10,
				total10: 0,
				tableList: [],

				dialogVisible: false,
				dialogVisible1: false,
				dialogVisible111: false,
				innerVisible: false,
				isCompare: false,

				value: '',
				banknameList: [],
				detail: [],
				tempdetail: [],


				bankList: [],
				details: {},
				result: [],
				rules: {
					balance: [{
						required: true,
						message: '请输入期初余额',
						trigger: 'blur'
					}],
					adjustmentbalance: [{
						required: true,
						message: '请输入期初调节余额',
						trigger: 'blur'
					}],
				},
			}
		},
		components: {},
		methods: {
			setCustom(item) {
				this.formInline.customerId = item.relateCustomerId;
				this.search()
			},


			search() {
				this.loading = true;
				let params = {
					"customerId": this.formInline.customerId,
					"isGetAssociated": this.isGetAssociated
				};
				this.axios.post('/perTaxToolTwo/columbusNew/cashier/getChargeInfo.do', params).then(res => {
					if (res.data.code == 200) {
						this.accountList = res.data.data.accountList;
						this.branchList = res.data.data.branchList;
						this.result = [];
						this.formDetail = res.data.data.contractEntity.customerContract ? res.data.data.contractEntity.customerContract :
							{};
						this.formTable = res.data.data.contractEntity.contractDetailList ? res.data.data.contractEntity.contractDetailList :
							{};

						this.total10 = this.formTable.length;
						for (var i = 0; i < this.total10; i += 4) {
							this.result.push(this.formTable.slice(i, i + 4));
						}


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
						message: '获取银行列表失败',
						type: 'error'
					});
				})
				this.searchRecord()
			},

			searchRecord() {
				this.loading = true;
				let params = {
					"customerId": this.formInline.customerId,
					"currentPage": this.currentPage,
					"pageCount": this.pageSize,
					"state": this.formInline2.state,
					"cashierId": this.formInline2.cashierId,
					"cashStart": this.formInline2.cashStart,
					"cashEnd": this.formInline2.cashEnd,
					"amountUpperLimit": this.formInline2.amountUpperLimit,
					"amountLowerLimit": this.formInline2.amountLowerLimit,
				};
				this.axios.post('/perTaxToolTwo/columbusNew/cashier/getSubmitPayRecord.do', params).then(res => {
					if (res.data.code == 200) {
						this.record = res.data.data;
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
					this.$message({
						message: '获取银行列表失败',
						type: 'error'
					});
				})
			},

			handleKFrecord(index, row) {
				let params = {
					"accountPriId": row.accountPriId
				};
				this.axios.post('/perTaxToolTwo/columbusNew/cashier/getDeductionRecord.do', params).then(res => {
					if (res.data.code == 200) {
						this.dialogTableVisible = true;
						this.fkrecord = res.data.data;
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
						message: '获取扣费记录失败',
						type: 'error'
					});
				})
			},

			handleJFrecord(index, row) {
				let params = {
					"accountPriId": row.accountPriId
				};
				this.axios.post('/perTaxToolTwo/columbusNew/cashier/getPaymentRecord.do', params).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible = true;
						this.jfrecord = res.data.data;
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
						message: '获取缴费记录失败',
						type: 'error'
					});
				})
			},

			cashier() {
				this.dialogVisible1 = true;
				let params = {
					"customerId": this.formInline.customerId,
				};
				this.axios.post('/perTaxToolTwo/columbusNew/cashier/getChargeAmountInfo.do', params).then(res => {
					if (res.data.code == 200) {
						this.cashierDetail = res.data.data.bookkeepingAgency;
						this.tCustomerAccountGiving = res.data.data.tCustomerAccountGiving;
						this.contractChargeEventId = res.data.data.bookkeepingAgency.contractChargeEventId;
						this.assignedItem = res.data.data.assignedItem;
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
						message: '获取缴费记录失败',
						type: 'error'
					});
				})
			},



			addcash() {
				this.cashList.push({
					label: this.formCash.label.dicName,
					amount: this.formCash.amount,
					payMethod: this.formCash.label.dicId,
				});
			},
			delCash(index) {
				this.cashList.splice(index, 1);
			},
			handleCancel(index, row) {},
			handleEdit(index, row) {
				this.dialogVisible111 = true;
				this.account.accountId = row.id;
				this.getPaymentRecord()
			},

			getPaymentRecord() {
				let params = {
					"customerId": this.formInline.customerId,
				};
				this.axios.post('/perTaxToolTwo/columbusNew/account/getAccountBalance.do', params).then(res => {
					if (res.data.code == 200) {
						this.AccountList = res.data.data;
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
						message: '获取账户失败',
						type: 'error'
					});
				})
			},

			hideDialog() {
				this.dialogTableVisible = false;
			},
			handleClose() {
				this.dialogVisible = false;
			},
			handleClose1() {
				this.dialogVisible1 = false;
			},
			handleClick(tab, event) {
				this.isCompare = false;
				console.log(tab, event);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.searchRecord()
			},
			handleCurrentChange10(val) {
				this.currentPage10 = val;
			},
			setMonth() {
				let params = {
					"contractChargeEventId": this.contractChargeEventId,
					"month": this.month
				};
				this.axios.post('/perTaxToolTwo/columbusNew/cashier/getChargeAmountBySvr.do', params).then(res => {
					if (res.data.code == 200) {
						this.cashierDetail = res.data.data;
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
						message: '获取缴费记录失败',
						type: 'error'
					});
				})
			},
			handleCommit() {
				let params = {
					"accountId": this.account.accountId,
					"amount": this.account.amount,
					"payMethod": this.account.payMethod,
					"customerId": this.formInline.customerId,
				};
				this.axios.post('/perTaxToolTwo/columbusNew/account/saveIncreaseAmount.do', params).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible111 = false;
						this.search();
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
						message: '获取缴费记录失败',
						type: 'error'
					});
				})
			},
			submitPay() {
				this.tCustomerAccountSub = [];
				this.cashList.forEach(item => {
					this.tCustomerAccountSub.push({
						payMethod: item.payMethod,
						amount: item.amount
					})
				});
				let params = {
					"tCustomerAccountSub": this.tCustomerAccountSub,
					"bookkeepingAgency": {
						"contractChargeEventId": this.contractChargeEventId,
						"startTime": this.cashierDetail.start,
						"endTime": this.cashierDetail.end,
						"serverMonth": this.month,
						"accountAmountContract": this.cashierDetail.accountAmount,
						"receivedAmountContract": this.cashierDetail.amount
					},

					"givingAmount": this.freeamount,
					"remark": "",
					"customerId": this.formInline.customerId,
					"totalAmount": this.cashierDetail.amount + this.assignedItem.amount
				};
				this.axios.post('/perTaxToolTwo/columbusNew/cashier/submitPay.do', params).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible1 = false;
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
						message: '获取缴费记录失败',
						type: 'error'
					});
				})
			},
			getCustomerList() {
				this.axios.get('/perTaxToolTwo/columbusNew/tCustomerInfo/getTCustomerInfoDropList.do').then(res => {
						if (res.data.code == 200) {
							this.customerList = res.data.data;

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
			getPay() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=182')
					.then(res => {
						if (res.data.code == 200) {
							this.payList = res.data.data;
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
		watch: {
			cashList(val, oldVal) { //普通的watch监听
				this.realAmount = 0;
				val.forEach(item => {
					this.realAmount += parseInt(item.amount);
				})
			},
		},
		created() {
			this.getCustomerList();
			this.getPay()
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

	.left_contain {
		position: relative;
		width: 100%;
		height: 2.2rem;
	}

	#form {
		background: #fff;
		margin-top: 12px;
		margin-bottom: 12px;
		position: relative;
		width: 100%;
		height: 600px;

		/deep/ .el-tabs__nav {
			width: calc(50% - 6px);
			background: #fff;
		}

		/deep/ .el-tabs {
			position: absolute;
			top: -60px;
			width: 100%;
		}

		/deep/ .el-tabs__item {
			height: 60px;
			line-height: 60px;
			text-align: center;
			width: calc(100% / 3);
		}
	}

	.contain_header.fr {
		float: right;
		position: relative;
		// top: 0px;
		// right: 0px;
		padding: 0rem 0.3rem;
		height: 2.2rem;
	}

	.contain_header {
		width: calc(50% - 6px);
		height: 1.5rem;
		// float: left;
		position: absolute;
		top: 0px;
		left: 0px;
		padding: 0rem 0rem 0rem 0.3rem;

		background: #fff;
		box-sizing: border-box;
		// background：: url(../../assets/img/list-bg1.png) no-repeat;
		// background-size: cover;
		border-top-left-radius: 0.06rem;
		border-top-right-radius: 0.06rem;

		/deep/ .el-form-item__content {
			width: auto;
		}

		/deep/ input::-webkit-input-placeholder {
			/* placeholder颜色  */
			color: #606266;
		}

		/deep/ .el-select__caret {
			color: #DCDFE6
		}

		/deep/.el-form--inline .el-form-item {
			margin-right: 0.3rem
		}

		.title {
			font-size: 0.14rem;
			height: 0.3rem;
			line-height: 0.3rem;
			color: #409EFF;
		}


		/deep/ .el-range-input {
			color: #DCDFE6;
			background: transparent
		}

		/deep/ .el-range-separator {
			color: #606266;
		}

		/deep/ .el-range__icon {
			color: #606266;
		}

		/deep/ .el-form-item--mini .el-form-item__label {
			color: #606266;
		}

		/deep/ .el-form {
			margin-top: 0.3rem
		}

		/deep/ .el-input__inner {
			background: transparent;
			color: #606266;
			border: 1px solid #DCDFE6;
		}

		/deep/ .el-input__inner:hover {
			border-color: #DCDFE6;
		}

		/deep/ .el-input.is-active .el-input__inner,
		/deep/ .el-input__inner:focus {
			border-color: #DCDFE6;
			outline: 0;
		}
	}

	.title {
		padding-left: 12px;
		font-size: 0.14rem;
		height: 0.3rem;
		line-height: 0.3rem;
		color: #67C23A;
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
		// background-color: #ebf6fb;
	}

	/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
		// background: #ebf6fb;
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
		// background-color: #fff7f1;
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

	/deep/ .el-dialog__body {
		padding: 0 20px 30px;
	}

	/deep/ .el-dialog {
		.el-table:before {
			background-color: transparent;
		}
	}

	/deep/ #dialog .el-dialog__body {
		padding: 0px;
	}

	.dialog_main {
		padding-top: 10px;
		background: #e9ebf5;

		/deep/ label {
			color: #999
		}

		h3 {
			color: #409EFF;
			height: 40px;
			line-height: 40px;
			padding: 0 10px;
		}

		.dialog_left {
			width: 760px;
			float: left;

			div {
				background: #fff;
			}

			div.first {
				border-bottom: 1px solid #DCDFE6
			}

			.second {
				margin-bottom: 10px;
			}

			.forth {
				margin-top: 10px;
				padding-top: 12px;
				height: 40px;
				line-height: 58px;
			}

			/deep/ .el-form-item__content {
				width: 100px;
			}
		}

		.dialog_right {
			width: 230px;
			height: 100%;
			float: right;

			.right_first {
				padding-top: 12px;
				padding-left: 15px;
				margin-bottom: 10px;
				text-align: center;

				/deep/ .el-form-item--mini {
					margin-bottom: 10px;
				}
			}

			.right_second {
				.second_one {
					padding-bottom: 20px;

					div {
						padding-left: 20px;

						.el-button {
							margin-left: 12px
						}
					}
				}

				.second_two {
					padding-top: 12px;
					padding-bottom: 105px;
					border-top: 1px solid #efe9e5;

					div {
						padding-left: 20px;
						height: 30px
					}

					.el-button {
						margin-left: 15px
					}
				}
			}

			div {
				background: #fff;

			}

			/deep/ .el-form-item__content {
				width: 100px;
			}
		}
	}
</style>
