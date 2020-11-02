<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>合同审核</div>
				<el-form :inline="true" :model="formInline1" class="demo-form-inline" size="mini">
					<el-form-item>
						<!-- <el-button @click='search' size="mini">查询</el-button> -->
					</el-form-item>
				</el-form>
			</div>
			<div class="contain_body">
				<el-table :data="serviceitem" style="width: 100%" stripe border v-loading='loading1'>
					<el-table-column align="center" label="客户名称" prop="customername" :resizable="false"></el-table-column>
					<el-table-column align="center" label="合同编号" prop="contractcode" :resizable="false"></el-table-column>
					<el-table-column align="center" label="合同单价" prop="unitprice" :resizable="false"></el-table-column>
					<el-table-column align="center" label="生效日期" prop="effectivedate" :resizable="false"></el-table-column>
					<el-table-column align="center" label="签约日期" prop="signdate" :resizable="false"></el-table-column>
					<el-table-column align="center" label="当前状态" prop="state" :resizable="false">
						<template slot-scope="scope">
							<span v-if='scope.row.state == 0'>待审核</span>
							<span v-if='scope.row.state == 1'>审核中</span>
							<span v-if='scope.row.state == 2'>已审核</span>
							<span v-if='scope.row.state == 3'>作废</span>
						</template>
					</el-table-column>
					
					<el-table-column align="center" width="200" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleDetail1(scope.$index, scope.row)">查看</el-button>
							<el-button size="mini" type="text" @click="handlePass(scope.$index, scope.row)" v-if='scope.row.islowprice'>通过</el-button>
							<!-- <el-button size="mini" type="text" @click="handleNopass(scope.$index, scope.row)" v-if='scope.row.islowprice'>不通过</el-button> -->
							<el-button size="mini" type="text" @click="handleNopass(scope.$index, scope.row)">终止</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>
		</div>


		<el-dialog title="详情" :visible.sync="dialogVisible1" width="1020px" class='dialog'>

			<el-form :inline="true" ref="ruleForm1" :model="detail" class="demo-form-inline" label-width="120px" size="mini">
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">基本信息</p>
				</div>
				<div></div>
				<!-- <el-form-item label="是否低价合同" prop="customermanagerid">
					<el-select v-model="detail.islowprice" placeholder="请选择是否低价合同" disabled>
						<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="合同单号" prop="contractCode">
					<el-input v-model="detail.contractcode" disabled></el-input>
				</el-form-item>
				<el-form-item label="客户名称" prop="customername">
					<el-input v-model="detail.customername" disabled></el-input>
				</el-form-item>
				<el-form-item label="签约日期" prop="signDate">
					<el-date-picker v-model="detail.signdate" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled></el-date-picker>

				</el-form-item>
				<el-form-item label="生效日期" prop="arealist">
					<el-date-picker v-model="detail.effectivedate" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
					 disabled></el-date-picker>

				</el-form-item>
				<el-form-item label="合同终止日期" prop="arealist">
					<el-date-picker v-model="detail.contenddate" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
					 disabled></el-date-picker>

				</el-form-item>
				<el-form-item label="合同开始日期" prop="arealist">
					<el-date-picker v-model="detail.contstartdate" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
					 disabled></el-date-picker>

				</el-form-item>
				<el-form-item label="甲方授权代表" prop="arealist">
					<el-input v-model="detail.ownerrepresent" disabled></el-input>

				</el-form-item>
				<el-form-item label="截止日期" prop="arealist">
					<el-date-picker v-model="detail.closingdate" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
					 disabled></el-date-picker>

				</el-form-item>
				<el-form-item label="作废时间" prop="arealist">
					<el-date-picker v-model="detail.canceltime" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled></el-date-picker>

				</el-form-item>
				<el-form-item label="缴费截止日期" prop="arealist">
					<el-date-picker v-model="detail.payenddate" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled></el-date-picker>

				</el-form-item>
				<el-form-item label="合同类型" prop="customerInfoSource">
					<el-input v-model="detail.contracttype" disabled></el-input>
					<!-- <el-select v-model="detail.contractType" placeholder="请选择客户来源">
						<el-option v-for="item in customerInfoSourceList" :label="item.dicName" :value="item.dicId"></el-option>
					</el-select> -->
				</el-form-item>
				<el-form-item label="客户类型" prop="customerInfoSource">
					<el-select v-model="detail.customertype" disabled>
						<el-option v-for="item in customertypeList" :label="item.label" :value="item.label"></el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="申报税务类型" prop="relateContractCustomer">
					<el-input v-model="detail.taxdeclarationtype" placeholder="请输入客户名称" disabled></el-input>
					
				</el-form-item> -->
				<el-form-item label="合同税务类型" prop="sourcename">
					<!-- <el-input v-model="detail.contracttaxtype" placeholder="请输入客户名称" disabled></el-input> -->
					<el-select v-model="detail.contracttaxtype" disabled>
						<el-option v-for="item in contractTaxTypeList" :label="item.dicName" :value="item.dicId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否取票" prop="customertype">
					<el-select v-model="detail.istaketicket" filterable disabled>
						<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="是否零申报" prop="arealist">
					<el-select v-model="detail.iszerotax" filterable disabled>
						<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否代理认证" prop="sourcename">
					<el-select v-model="detail.isproxyauthentication" disabled>
						<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否代开发票" prop="relateContractCustomer">
					<el-select v-model="detail.isproxyinvoice" disabled>
						<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否财务顾问合同" prop="relateContractCustomer" class='longLabel'>
					<el-select v-model="detail.isfinadvcontract" disabled>
						<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="甲方经手人" prop="relateContractCustomer">
					<el-input v-model="detail.firstparty" disabled></el-input>

				</el-form-item>
				<el-form-item label="甲方违约金(元)" prop="arealist">
					<el-input v-model="detail.firstpartypenalty" disabled></el-input>
				</el-form-item>
				<el-form-item label="乙方违约金(元)" prop="arealist">
					<el-input v-model="detail.secondpartypenalty" disabled></el-input>
				</el-form-item>
				<el-form-item label="合同单价(元)" prop="arealist">
					<el-input v-model="detail.unitprice" disabled></el-input>

				</el-form-item>
				<el-form-item label="结算方式" prop="arealist">
					<el-select v-model="detail.paytype" disabled>
						<el-option v-for="item in paytypeList" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="首付款金额" prop="arealist">
					<el-input v-model="detail.firstpayment" disabled></el-input>
				</el-form-item>
				
				<el-form-item label="登记人" prop="arealist">
					<el-input v-model="detail.registerperson" disabled></el-input>
				</el-form-item>
				<el-form-item label="登记日期" prop="arealist">
					<el-date-picker v-model="detail.registertime" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
					 disabled></el-date-picker>
				</el-form-item>
				<el-form-item label="状态" prop="state">
					<el-input v-model="detail.state" disabled></el-input>
				</el-form-item>
				<el-form-item label="是否购买发票" prop="customertype">
					<el-select v-model="detail.isbuyticket" filterable disabled>
						<el-option v-for='item in trueOrFalse' :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="审核人" prop="arealist">
					<el-input v-model="detail.auditor" disabled></el-input>

				</el-form-item>
				<el-form-item label="审核时间" prop="arealist">
					<el-date-picker v-model="detail.audittime" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled></el-date-picker>

				</el-form-item>
				<el-form-item label="不通过原因" prop="arealist">
					<el-input v-model="detail.nopassreason" disabled></el-input>
				</el-form-item>

				<el-form-item label="帐户" prop="arealist">
					<el-input v-model="detail.accountNo" disabled></el-input>
				</el-form-item>
				<!-- <el-form-item label="合同图片路径" prop="arealist">
					<el-input v-model="detail.picurl" disabled></el-input>

				</el-form-item> -->
				<el-form-item label="作废人识别号" prop="state">
					<el-input v-model="detail.disannulid" disabled></el-input>
				</el-form-item>
				<el-form-item label="签单组" prop="customertype">
					<el-select v-model="detail.signbillgroupid" filterable disabled>
						<el-option v-for='item in employList' :label="item.userName" :value="item.userId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="电话组" prop="arealist">
					<el-select v-model="detail.telgroupid" filterable disabled>
						<el-option v-for='item in employList' :label="item.userName" :value="item.userId"></el-option>
					</el-select>

				</el-form-item>
				<el-form-item label="是否第一份合同" prop="arealist">

					<el-select v-model="detail.isfirstcontract" filterable disabled>
						<el-option v-for='item in trueOrFalse' :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="未完成首付款" prop="arealist">
					<el-input v-model="detail.unfinishedfirstpayment" disabled></el-input>

				</el-form-item>

				<el-form-item label="是否银行对账" prop="arealist">

					<el-select v-model="detail.isbankreconciliation" filterable disabled>
						<el-option v-for='item in trueOrFalse' :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="是否结转合同" prop="arealist">
					<el-select v-model="detail.iscarryOvercontract" filterable placeholder="请选择企业类型" disabled>
						<el-option v-for='item in trueOrFalse' :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否参加参加十周年活动" prop="state" class='longLabel'>
					<el-select v-model="detail.isyearactivity" filterable placeholder="请选择企业类型" disabled>
						<el-option v-for='item in trueOrFalse' :label="item.label" :value="item.value"></el-option>
					</el-select>

				</el-form-item>
				<el-form-item label="呼叫中心电话组" prop="customertype">
					<el-input v-model="detail.callgroupid" placeholder="请输入贵宾卡号" disabled></el-input>

				</el-form-item>
				<el-form-item label="三个月服务合同是否已赠送结束" prop="arealist" class='longLabel'>
					<el-select v-model="detail.isgift" filterable placeholder="请选择企业类型" disabled>
						<el-option v-for='item in trueOrFalse' :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="赠送时间" prop="arealist">
					<el-date-picker v-model="detail.giftdate" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled
					 placeholder="请选择赠送时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="三个月服务合同是否已顺延" prop="arealist" class='longLabel'>
					<el-select v-model="detail.ispostpone" filterable placeholder="请选择企业类型" disabled>
						<el-option v-for='item in trueOrFalse' :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="顺延月数" prop="arealist">
					<el-input v-model="detail.postponemonths" placeholder="请输入贵宾卡号" disabled></el-input>
				</el-form-item>
				<el-form-item label="活动编号" prop="arealist">
					<el-input v-model="detail.activitynewid" placeholder="请输入贵宾卡号" disabled></el-input>
				</el-form-item>
				<el-form-item label="财税分析开始时间" prop="state" class='longLabel'>
					<el-date-picker v-model="detail.csfxstart" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" disabled
					 placeholder="请选择结束时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="财税分析结束时间" prop="customertype" class='longLabel'>
					<el-date-picker v-model="detail.csfxend" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择结束时间"
					 disabled></el-date-picker>

				</el-form-item> -->
				<el-form-item label="来访还是上门拜访" prop="arealist" class='longLabel'>
					
					<el-select v-model="detail.iscomeorgovist" filterable disabled>
						<el-option v-for='item in iscomeorgov' :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="约见类型是否审核" prop="arealist" class='longLabel'>
					<el-select v-model="detail.isappointtypeaduit" filterable disabled>
						<el-option v-for='item in trueOrFalse' :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<!-- <el-form-item label="是否参加3个月赠送活动" prop="arealist" class='longLabel'>
					<el-select v-model="detail.isinthractive" filterable placeholder="请选择企业类型" disabled>
						<el-option v-for='item in trueOrFalse' :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="是否参加千家团购活动" prop="arealist" class='longLabel'>
					<el-select v-model="detail.isgroupactivity" filterable placeholder="请选择企业类型" disabled>
						<el-option v-for='item in trueOrFalse' :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="是否是代开票合同" prop="arealist" class='longLabel'>
					<el-select v-model="detail.invoiceactivityid" filterable placeholder="请选择企业类型" disabled>
						<el-option v-for='item in trueOrFalse' :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item> -->
				<el-form-item label="收入发票单价" prop="state">
					<el-input v-model="detail.incomeinvoiceprice" disabled></el-input>
				</el-form-item>
				<el-form-item label="票据移交方式" prop="customertype">
					<el-select v-model="detail.taxmethod" filterable disabled>
						<el-option v-for='item in taxmethodList' :label="item.dicName" :value="item.dicId"></el-option>
					</el-select>
					
				</el-form-item>


				<el-form-item label="备注" prop="arealist">
					<el-input v-model="detail.remark" disabled></el-input>
				</el-form-item>


				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">合同服务项目</p>
				</div>

				<el-table :data="tableList" style="width: 100%" stripe border>
					<el-table-column align="center" label="编号" prop="svritemno" :resizable="false"></el-table-column>
					<el-table-column align="center" label="服务名称" prop="svritemname" :resizable="false"></el-table-column>
					<el-table-column align="center" label="费用类型" prop="costtypeid" :resizable="false"></el-table-column>
					<el-table-column align="center" label="服务单价(元)" prop="unitsprice" :resizable="false"></el-table-column>

				</el-table>
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">合同服务项目明细</p>
				</div>
				
				<el-table :data="servItemList1" style="width: 100%" stripe border>
					<el-table-column align="center" label="合同服务项目名称" prop="serviceitem" :resizable="false"></el-table-column>
					<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>
				
				
				</el-table>
				
				
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">活动配置</p>
				</div>
				
				<el-table :data="activitygroupconfigList1" style="width: 100%" stripe border>
					<el-table-column align="center" label="活动名称" prop="remark" :resizable="false"></el-table-column>
					<el-table-column align="center" label="最低价格" prop="minprice" :resizable="false"></el-table-column>
					<el-table-column align="center" label="最高价格" prop="maxprice" :resizable="false"></el-table-column>
					<el-table-column align="center" label="开始时间" prop="starttime" :resizable="false"></el-table-column>
					<el-table-column align="center" label="结束时间" prop="endtime" :resizable="false"></el-table-column>
				</el-table>
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">合同文件</p>
				
				</div>
				
				<el-tag style='cursor: pointer;' @click='downloadpic'>{{detail.picurl}}</el-tag>
			</el-form>

			<div class='btn_contain clearfix'>
				<span class='close' @click="hideDialog">关闭</span>
			</div>
		</el-dialog>

		<!-- 新增 -->


	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				loading1: false,
				formInline1: {
					bankname: '',
					typecode: ''
				},
				form1: {

				},
				form2: {

				},
				form3: {

				},
				serveList: [],
				detail: {},
				dialogVisible1: false,
				dialogVisible2: false,
				dialogVisible3: false,
				innerVisible: false,
				innerVisible1: false,
				serviceitem: [],
				svrnameList: [],
				itemnameList: [],
				tableList: [],
				tableList1: [],
				servItemList: [],
				itemList: [],
				total: 0,
				pageSize: 10,
				currentPage: 1,
				costtypeList: [{
						dicId: 193,
						dicName: "代帐费",
					},
					{
						dicId: 194,
						dicName: "工本费",
					},
					{
						dicId: 195,
						dicName: "资料费",
					},
					{
						dicId: 196,
						dicName: "服务费",
					},
					{
						dicId: 197,
						dicName: "认证费",
					}
				],
				paytypeList: [{
						label: "月",
						value: 1,
					},
					{
						label: "季",
						value: 3,
					},
					{
						label: "半年",
						value: 6,
					},
					{
						label: "一年",
						value: 12,
					},
					{
						label: "两年",
						value: 24,
					},
					{
						label: "三年",
						value: 36,
					},
				],
				trueOrFalse: [{
						label: "是",
						value: 1,
					},
					{
						label: "否",
						value: 0,
					}
				],
				iscomeorgov: [{
						label: "来访",
						value: 1,
					},
					{
						label: "拜访",
						value: 0,
					}
				],
				contractTypeList: [{
						label: '代理记账服务合同'
					},
					{
						label: '代理记账服务合同（免费）'
					},
					{
						label: '会计高端服务合同'
					},
					{
						label: '会计中端服务合同'
					},
					{
						label: '免费合同'
					},
					{
						label: '纳税申报服务合同'
					},
					{
						label: '政府采购合同'
					},
				],
				contractTaxTypeList: [{
						label: '代理记账服务合同'
					},
					{
						label: '代理记账服务合同（免费）'
					},
					{
						label: '会计高端服务合同'
					},
					{
						label: '会计中端服务合同'
					},
					{
						label: '免费合同'
					},
					{
						label: '纳税申报服务合同'
					},
					{
						label: '政府采购合同'
					},
				],
				customerList: [],
				taxmethodList: [],
				customertypeList: [{
						label: '中高端客户'
					},
					{
						label: '普通客户'
					},
				],
				employList: []


			}
		},
		components: {},
		methods: {
			downloadpic() {
				window.location.href = '/perTaxToolTwo/columbusNew/contract/downloadFile.do?filePath=' + this.detail.picurl;
				
			
			},

			queryListByPage() {
				let param = {
					data: {

					},
					row: this.pageSize,
					page: this.currentPage,
				};
				this.axios.post('/perTaxToolTwo/columbusNew/contract/list.do', param).then(res => {
					if (res.data.code == 200) {
						this.serviceitem = res.data.data;
						this.total = res.data.count;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取合同列表失败',
						type: 'error'
					});
				})
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleSelectionChange1(val) {
				this.multipleSelection1 = val;
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage();
			},


			reset() {
				this.form2 = {};
			},


			addChild() {
				this.dialogVisible2 = true;
			},

			handleDetail1(index, row) {
				this.dialogVisible1 = true;
				this.tableList = [];
				this.servItemList1 = [];
				this.axios.get('/perTaxToolTwo/columbusNew/contract/getContractEntity.do?contractId=' + row.contractid).then(res => {
					if (res.data.code == 200) {
						this.detail = res.data.data.customerContract;
						res.data.data.contractServiceProjectList.forEach(item => {
							this.servItemList1.push(item.tcontSvrItemconfig)
						});
						res.data.data.contractDetailList.forEach(item => {
							this.tableList.push(item.tsvrItem)
						});
						this.activitygroupconfigList1 = res.data.data.activitygroupconfigList;
						// this.tableList = res.data.data.contractServiceProjectList;
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
						message: '查看失败',
						type: 'error'
					});
				})

			},



			handlePass(index, row) {

				this.$confirm('确认审核通过?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = {
						contractid: row.contractid,
						type: 2
					}
					this.axios.post('/perTaxToolTwo/columbusNew/contract/approve', param).then(res => {
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
							message: '审核失败',
							type: 'error'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消审核'
					});
				});


			},

			handleNopass(index, row) {
				this.$prompt('请输入不通过原因', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消'
				}).then(({
					value
				}) => {
					let param = {
						contractid: row.contractid,
						type: 2,
						nopassreason:value
					};
					this.axios.post('/perTaxToolTwo/columbusNew/contract/cancel', param).then(res => {
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
// 			handleStop(index, row) {
// 				this.$confirm('确认终止合同?', '提示', {
// 					confirmButtonText: '确定',
// 					cancelButtonText: '取消',
// 					type: 'warning'
// 				}).then(() => {
// 					let param = {
// 						"contractid": row.contractid,
// 						"state": 3
// 					};
// 					this.axios.post('/perTaxToolTwo/columbusNew/contract/updateContractStateForSingle.do', param).then(res => {
// 						if (res.data.code == 200) {
// 							this.queryListByPage();
// 							this.$message({
// 								message: res.data.msg,
// 								type: 'success'
// 							});
// 						} else {
// 							this.$message({
// 								message: res.data.msg,
// 								type: 'error'
// 							});
// 						}
// 
// 					}).catch(function(err) {
// 						this.$message({
// 							message: '终止失败',
// 							type: 'error'
// 						});
// 					})
// 				}).catch(() => {
// 					this.$message({
// 						type: 'info',
// 						message: '已取消'
// 					});
// 				});
// 			},
			hideDialog() {
				this.dialogVisible1 = false;
			},

			hideDialog2() {
				this.dialogVisible2 = false;
				this.reset();
			},
			handleClose2() {
				this.dialogVisible2 = false;
				this.reset();
			},

			hideDialog3() {
				this.dialogVisible3 = false;
				this.reset();
			},
			handleClose3() {
				this.dialogVisible3 = false;
				this.reset();
			},
			
			getCustomerList() {
				this.axios.get('/perTaxToolTwo/columbusNew/contract/getCustomerNameAndIdList.do').then(res => {
					if (res.data.code == 200) {
						this.customerList = res.data.data;
			
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
			
				}).catch(function(err) {
					this.$message({
						message: '获取客户列表失败',
						type: 'error'
					});
				})
			},
			getContractTypeList() {
				let param = {
					pid: 2
				};
				this.axios.post('/perTaxToolTwo/api/dic/getDicByPid', param).then(res => {
					if (res.data.code == 200) {
						this.contractTypeList = res.data.data;
			
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
			
				}).catch(function(err) {
					this.$message({
						message: '获取合同类型失败',
						type: 'error'
					});
				})
			},
			getContractTaxTypeList() {
				let param = {
					pid: 1
				};
				this.axios.post('/perTaxToolTwo/api/dic/getDicByPid', param).then(res => {
					if (res.data.code == 200) {
						this.contractTaxTypeList = res.data.data;
			
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
			
				}).catch(function(err) {
					this.$message({
						message: '获取合同税务类型失败',
						type: 'error'
					});
				})
			},
			getTaxmethodList() {
				let param = {
					pid: 209
				};
				this.axios.post('/perTaxToolTwo/api/dic/getDicByPid', param).then(res => {
					if (res.data.code == 200) {
						this.taxmethodList = res.data.data;
			
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
			
				}).catch(function(err) {
					this.$message({
						message: '获取票据移交方式失败',
						type: 'error'
					});
				})
			},
			getemployList() {
				let param = {
			
				};
				this.axios.post('/perTaxToolTwo/hrEmpInfo/findHrEmpInfo', param).then(res => {
					if (res.data.code == 200) {
						this.employList = res.data.data;
			
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
			
				}).catch(function(err) {
					this.$message({
						message: '获取票据移交方式失败',
						type: 'error'
					});
				})
			}

		},
		created() {
			this.queryListByPage();
			// 获取员工列表
			this.getemployList();
			// 获取客户列表
			this.getCustomerList();
			// 获取合同类型
			this.getContractTypeList();
			// 获取合同税务类型
			this.getContractTaxTypeList();
			// 获取票据移交方式
			this.getTaxmethodList();
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
			margin-right: 0.4rem;
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
		background: url(../../assets/img/list-bg1.png) no-repeat;
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

	/deep/ .el-dialog__body {
		padding: 0 20px 30px;
	}

	.dialog {

		.title {
			height: 0.4rem;
			line-height: 0.4rem;
			font-size: 0.16rem;
			color: #333;
		}

		.tabtitle {
			display: flex;
			align-items: center;
			height: 35px;
			width: 100%;
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

		ul {
			background: #f8f8f8;
			padding-left: 0.24rem;
			padding-right: 0.24rem;
			padding-top: 0.2rem;
			height: 3.5rem;
			overflow-y: auto;
			margin-top: 0.1rem;

			li {
				height: 0.24rem;
				font-size: 0.12rem;
			}
		}

		.mark {
			color: #ed878e;
		}

		/deep/ .el-dialog__body {
			padding-top: 0;
		}

		/deep/ .el-tabs__content {
			height: 550px;
			overflow: auto;
		}

		/deep/ .el-select,
		/deep/ .el-input,
		/deep/ .el-date-editor {
			width: 190px;
		}

		/deep/ .el-range-editor {
			width: 240px;
		}

		/*/deep/ .el-input__inner {
			height: 18px;
			line-height: 18px;
		}*/
		/deep/ .el-input__icon {
			height: 100%;
			width: 25px;
			text-align: center;
			line-height: 18px;
		}

		/deep/ .longLabel .el-form-item__label {
			line-height: 16px;
		}

		/deep/ .textareaWidth .el-textarea {
			width: 830px
		}

		/*滚动条样式*/
		::-webkit-scrollbar {
			width: 0.04rem;
			height: 0.04rem;
		}

		::-webkit-scrollbar-thumb {
			border-radius: 0.10rem;
			-webkit-box-shadow: inset 0 0 0.05rem rgba(0, 0, 0, 0.2);
			background: rgba(0, 0, 0, 0.2);
		}

		::-webkit-scrollbar-track {
			-webkit-box-shadow: inset 0 0 0.05rem rgba(0, 0, 0, 0.2);
			border-radius: 0;
			background: rgba(0, 0, 0, 0.1);
		}
	}
	.btn_contain {
		text-align: center;
		margin-top: 0.36rem;
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
</style>
