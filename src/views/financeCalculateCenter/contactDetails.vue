<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>账簿</el-breadcrumb-item>
			<el-breadcrumb-item>往来明细核对</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :model="uploadData" size="small" ref='formName' inline label-width="100px">
					<el-form-item label="公司名称" prop="customerId">
						<el-select v-model="uploadData.customerId" placeholder="请选择" clearable filterable>
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="账期:" prop="accountPeriod">
						<el-date-picker v-model="uploadData.accountPeriod" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM">
						</el-date-picker>

					</el-form-item>


					<el-button type="info" @click='resetForm()' size="small" style="float: right;"> 重 置 </el-button>
					<el-button type="primary" @click='search()' size="small" style="float: right;margin-right: 20px;"> 查 找 </el-button>


				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane label="待修改" name="2">
					<el-table :data="tableData" style="width: 100%;" border v-loading='loading'>

						<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>
						<el-table-column align="center" label="单位名称" prop='customerName' :resizable="false"></el-table-column>
						<el-table-column align="center" label="是否中高端" prop="isSenior" :resizable="false">
							<template slot-scope="scope">
								<span v-if="scope.row.isSenior == 1">是</span>
								<span v-else>否</span>
							</template>
						</el-table-column>


						<el-table-column align="center" label="操作" :resizable="false">
							<template slot-scope="scope">
								<el-button type="text" size="mini" @click='handleDetail(scope.row)'>修改</el-button>
							</template>
						</el-table-column>
						<!-- <el-table-column align="center" label="状态" prop="fendCreditBalance" :resizable="false"></el-table-column> -->

					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '4')})"
					 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
					</el-pagination>
				</el-tab-pane>
				<el-tab-pane label="待审核" name="3">
					<el-table :data="tableData" style="width: 100%;" border v-loading='loading'>

						<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>
						<el-table-column align="center" label="单位名称" prop='customerName' :resizable="false"></el-table-column>
						<el-table-column align="center" label="是否中高端" prop="isSenior" :resizable="false">
							<template slot-scope="scope">
								<span v-if="scope.row.isSenior == 1">是</span>
								<span v-else>否</span>
							</template>
						</el-table-column>


						<el-table-column align="center" label="操作" :resizable="false">
							<template slot-scope="scope">
								<el-button type="text" size="mini" @click='handleDetail(scope.row)'>查看详情</el-button>
							</template>
						</el-table-column>
						<!-- <el-table-column align="center" label="状态" prop="fendCreditBalance" :resizable="false"></el-table-column> -->

					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '4')})"
					 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
					</el-pagination>
				</el-tab-pane>
				<el-tab-pane label="审核通过" name="4">
					<el-table :data="tableData" style="width: 100%;" border v-loading='loading'>

						<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>
						<el-table-column align="center" label="单位名称" prop='customerName' :resizable="false"></el-table-column>
						<el-table-column align="center" label="是否中高端" prop="isSenior" :resizable="false">
							<template slot-scope="scope">
								<span v-if="scope.row.isSenior == 1">是</span>
								<span v-else>否</span>
							</template>
						</el-table-column>


						<el-table-column align="center" label="操作" :resizable="false">
							<template slot-scope="scope">
								<el-button type="text" size="mini" @click='handleDetail(scope.row)'>查看详情</el-button>
							</template>
						</el-table-column>
						<!-- <el-table-column align="center" label="状态" prop="fendCreditBalance" :resizable="false"></el-table-column> -->

					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '4')})"
					 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
					</el-pagination>
				</el-tab-pane>
				<el-tab-pane label="未核对" name="1">
					<el-table :data="tableData" style="width: 100%;" border v-loading='loading'>

						<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>
						<el-table-column align="center" label="单位名称" prop='customerName' :resizable="false"></el-table-column>
						<el-table-column align="center" label="是否中高端" prop="isSenior" :resizable="false">
							<template slot-scope="scope">
								<span v-if="scope.row.isSenior == 1">是</span>
								<span v-else>否</span>
							</template>
						</el-table-column>
						<!-- <el-table-column align="center" label="确认人" prop='confirmUserName' :resizable="false"></el-table-column>
						<el-table-column align="center" label="确认人账号" prop="confirmUserCode" :resizable="false"></el-table-column> -->
						<el-table-column align="center" label="下发时间" prop="createTime" :resizable="false"></el-table-column>

						<el-table-column align="center" label="确认截止日期" prop="confirmEndDate" :resizable="false"></el-table-column>

					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '4')})"
					 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
					</el-pagination>
				</el-tab-pane>
				<el-tab-pane label="已确认" name="5">
					<el-table :data="tableData" style="width: 100%;" border v-loading='loading'>

						<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>
						<el-table-column align="center" label="单位名称" prop='customerName' :resizable="false"></el-table-column>
						<el-table-column align="center" label="是否中高端" prop="isSenior" :resizable="false">
							<template slot-scope="scope">
								<span v-if="scope.row.isSenior == 1">是</span>
								<span v-else>否</span>
							</template>
						</el-table-column>
						<!-- <el-table-column align="center" label="联系人" prop='userGroupName' :resizable="false"></el-table-column>
						<el-table-column align="center" label="手机号" prop="userGroupDescribe" :resizable="false"></el-table-column> -->
						<el-table-column align="center" label="确认人" prop="confirmUserName" :resizable="false"></el-table-column>

						<el-table-column align="center" label="确认人账号" prop="confirmUserCode" :resizable="false"></el-table-column>
						<el-table-column align="center" label="确认时间" prop="updateTime" :resizable="false"></el-table-column>
					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '4')})"
					 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
					</el-pagination>
				</el-tab-pane>
			</el-tabs>


		</div>



		<!-- 待审核 -->
		<el-dialog width="1200px" title="详情" :visible.sync="dialogVisible">
			<el-form :model="detailInfo" size="small" ref='formName' label-width="100px" inline>
				<el-form-item label="账期" prop="accountPeriod">


					<el-input v-model="detailInfo.accountPeriod" disabled>
					</el-input>
				</el-form-item>
				<!-- <div style="width: 100%;"></div> -->
				<el-form-item label="客户名称" prop="customerName">
					<el-input v-model="detailInfo.customerName" disabled>
					</el-input>
				</el-form-item>
				<el-form-item label="是否中高端" prop="isSenior">
					<el-input :value="detailInfo.isSenior == 1?'是':'否'" disabled>
					</el-input>

				</el-form-item>
			</el-form>
			<el-divider style='margin: 0px;'></el-divider>
			<h3 style="height: 40px;line-height: 40px;" v-if="detailInfo.approveResult != 0">审核结果</h3>
			<el-form :model="detailInfo" size="small" ref='formName' label-width="100px" v-if="detailInfo.approveResult != 0">
				<el-form-item label="审核人：" prop="dealConfirmReamrk1">
					<span>{{detailInfo.dealConfirmReamrk1}}</span>
				</el-form-item>
				<el-form-item label="审核结果：" prop="approveResult">
					<span v-if='detailInfo.approveResult == 1'>通过</span>
					<span v-if='detailInfo.approveResult == 2'>驳回</span>
					<span v-if='detailInfo.approveResult == 0'>未审批</span>
				</el-form-item>
				<el-form-item label="原因备注：" prop="approveRemark" v-if="detailInfo.approveResult == 2">
					<span>{{detailInfo.approveRemark}}</span>
				</el-form-item>
			</el-form>
			<el-collapse accordion>
				<el-collapse-item v-for="(item,index) in detail">
					<template slot="title">
						{{list[index]}} {{item.length}}项
					</template>
					<div v-for="items in item">

						<div>
							<span>当前科目代码：{{items[0]?items[0].acctNum + '-' + items[0].acctName:'--'}}</span>
							<!-- <el-button type="primary" size="mini" style="float: right;" @click='getDealProblemInfo(0,items)' v-show="items.length > 0">展开历史问题项</el-button> -->
							<el-button type="primary" size="mini" style="float: right;" @click='setTemAccountPeriod(0,items)' v-show="items.length > 0">展开历史问题项</el-button>
						</div>
						<el-table :data="items" style="width: 100%;margin: 10px 0px;" border v-loading='loading'>

							<el-table-column align="center" label="账期" prop="probAccountPeriod" :resizable="false"></el-table-column>
							<el-table-column align="center" label="凭证字号" prop='dealProbReamrk4' :resizable="false"></el-table-column>
							<el-table-column align="center" label="摘要" prop="dealProbReamrk2" :resizable="false"></el-table-column>
							<el-table-column align="center" label="对方科目" prop='dealProbReamrk3' :resizable="false"></el-table-column>
							<el-table-column align="center" label="借方金额" prop="fdebit_string" :resizable="false"></el-table-column>
							<el-table-column align="center" label="贷方金额" prop="fcredit_string" :resizable="false"></el-table-column>

							<el-table-column align="center" label="正确发生额" prop="correctData" :resizable="false"></el-table-column>
							<el-table-column align="center" label="问题描述" prop="probRemark" :resizable="false"></el-table-column>
							<el-table-column align="center" label="账目调整" prop="state" :resizable="false">
								<template slot-scope="scope">

									<span v-show="scope.row.state == 0">无效</span>
									<!-- <span v-show="scope.row.state == 1">未修改</span> -->
									<!-- <span v-show="scope.row.state == 2">原凭证已修改正确</span> -->
									<span v-show="scope.row.state == 3">原凭证已删除</span>
									<i class="el-icon-close" v-show="scope.row.state == 4 || scope.row.state == 1" style="color: #F56C6C;font-weight: bold;"></i>
									<i class="el-icon-check" v-show="scope.row.state == 5 || scope.row.state == 2" style="color: #67C23A;font-weight: bold;"></i>
									<!-- <span v-show="scope.row.state == 4">修改后金额不一致</span>
									<span v-show="scope.row.state == 5">修改后金额一致</span> -->
								</template>
							</el-table-column>
							<el-table-column align="center" label="是否备注" prop="dealProbReamrk1" :resizable="false">
								<template slot-scope="scope">
									<span v-if="scope.row.dealProbReamrk1">是</span>
									<span v-else>否</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="操作" prop="confirmEndDate" :resizable="false" width="300">
								<template slot-scope="scope">

									<el-button type="text" size="mini" @click='getTVoucherListById(scope.row,1)' :disabled="scope.row.relationSum == 0" >查看关联凭证</el-button>
									<el-button type="text" size="mini" v-show="activeName == '2'" @click='addCopy(scope.row)' :disabled="scope.row.state == 3 || scope.row.state == 2 || scope.row.dealProbReamrk5 ==1">红冲</el-button>
									<el-button type="text" size="mini" v-show="activeName == '2'" @click='addRelation(scope.row)' :disabled="scope.row.state == 3 || scope.row.state == 2">关联凭证</el-button>
									<el-button type="text" size="mini" v-show="activeName == '2'" @click='addRemark(scope.row)'>修改备注</el-button>
									<el-button type="text" size="mini" v-show="activeName == '3' || activeName == '4'" @click='getRemark(scope.row)'>查看备注</el-button>
								</template>
							</el-table-column>
						</el-table>
						<el-divider></el-divider>
					</div>

				</el-collapse-item>

			</el-collapse>

			<h3 style="margin-top: 10px;">操作历史</h3>
			<el-table :data="historyList" style="width: 100%;margin: 10px 0px;" border v-loading='loading'>

				<el-table-column align="center" label="操作" prop="operation" :resizable="false"></el-table-column>
				<el-table-column align="center" label="时间" prop='createTime' :resizable="false"></el-table-column>
				<el-table-column align="center" label="操作方" prop="remark1" :resizable="false"></el-table-column>

			</el-table>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false" v-show="activeName == '2'">取消</el-button>
				<el-button type="primary" @click="commit()" v-show="activeName == '2'">提交</el-button>

				<el-button @click="approve()" v-show="activeName == '3'">审核不通过</el-button>
				<el-button type="primary" @click="approve(1)" v-show="activeName == '3'">审核通过</el-button>
			</span>

			<el-dialog width="1200" title="历史问题项" :visible.sync="dialogVisible1" append-to-body>
				<label for="">账期</label>
				<el-date-picker v-model="temaccountPeriod" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM"
				 size="small" style="margin-left: 10px;" @change="getDealProblemInfo(0)">
				</el-date-picker>
				<el-table :data="detailTable" style="width: 100%;margin: 10px 0px;" border stripe v-loading='loading'>

					
					<el-table-column align="center" label="提交账期" prop="accountPeriod" :resizable="false"></el-table-column>
					<el-table-column align="center" label="账期" prop="probAccountPeriod" :resizable="false"></el-table-column>
					<el-table-column align="center" label="凭证字号" prop='dealProbReamrk4' :resizable="false"></el-table-column>
					<el-table-column align="center" label="摘要" prop="dealProbReamrk2" :resizable="false"></el-table-column>
					<el-table-column align="center" label="对方科目" prop='dealProbReamrk3' :resizable="false"></el-table-column>
					<el-table-column align="center" label="借方金额" prop="fdebit_string" :resizable="false"></el-table-column>
					<el-table-column align="center" label="贷方金额" prop="fcredit_string" :resizable="false"></el-table-column>

					<el-table-column align="center" label="正确发生额" prop="correctData" :resizable="false"></el-table-column>
					<el-table-column align="center" label="问题描述" prop="probRemark" :resizable="false"></el-table-column>
					
					

				</el-table>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="dialogVisible1 = false">关闭</el-button>
				</div>
			</el-dialog>

			<el-dialog width="1000" title="已关联凭证" :visible.sync="dialogVisible2" append-to-body>
				<el-table :data="voucherList" style="width: 100%;margin: 10px 0px;" border v-loading='loading'>

					<el-table-column align="center" label="会计期间" prop="fDate_string" :resizable="false"></el-table-column>
					<el-table-column align="center" label="凭证字号" prop='fNumber_fBrNo' :resizable="false"></el-table-column>
					<el-table-column align="center" label="摘要" prop="fExplanation" :resizable="false"></el-table-column>
					<el-table-column align="center" label="科目代码" prop='fnumberAccount' :resizable="false"></el-table-column>
					<el-table-column align="center" label="科目名称" prop='fFullName' :resizable="false"></el-table-column>
					<el-table-column align="center" label="借方" prop="fDebit" :resizable="false"></el-table-column>
					<el-table-column align="center" label="贷方" prop="fCredit" :resizable="false"></el-table-column>

					<el-table-column align="center" label="是否审核" prop="fChecked" :resizable="false"></el-table-column>
					<el-table-column align="center" label="是否过账" prop="fPosted" :resizable="false"></el-table-column>

				</el-table>
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="dialogVisible2 = false">关闭</el-button>
				</div>
			</el-dialog>


			<el-dialog width="1200" title="关联凭证" :visible.sync="dialogVisible3" append-to-body>
				<div style="margin-bottom: 10px;">
					<label for="">单位名称：</label>
					<span>{{detailInfo.customerName}}</span>
				</div>
				<div style="margin-bottom: 10px;">
					<label for="">当前科目代码：</label>
					<span>{{modifyData.acctNum + '-' + modifyData.dealProbReamrk2}}</span>
				</div>
				<div style="margin-bottom: 10px;">
					<label for="">账期：</label>
					<el-date-picker v-model="reaccountPeriod" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM" disabled
					 size="small" style="margin-left: 10px;"></el-date-picker>
				</div>
				
				
				<h3>凭证列表</h3>
				<el-table :data="voucherList1" style="width: 100%;margin: 10px 0px;" border stripe v-loading='loading'
				 @selection-change="handleSelectionChange1">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column align="center" label="会计期间" prop="fDate_string" :resizable="false"></el-table-column>
					<el-table-column align="center" label="凭证字号" prop='fNumber_fBrNo' :resizable="false"></el-table-column>
					<el-table-column align="center" label="摘要" prop="fExplanation" :resizable="false"></el-table-column>
					<el-table-column align="center" label="科目代码" prop='fnumberAccount' :resizable="false"></el-table-column>
					<el-table-column align="center" label="科目名称" prop='fFullName' :resizable="false"></el-table-column>
					<el-table-column align="center" label="借方" prop="fDebit" :resizable="false"></el-table-column>
					<el-table-column align="center" label="贷方" prop="fCredit" :resizable="false"></el-table-column>

					<el-table-column align="center" label="是否审核" prop="fChecked" :resizable="false"></el-table-column>
					<el-table-column align="center" label="是否过账" prop="fPosted" :resizable="false"></el-table-column>

				</el-table>

				<h3>已关联凭证</h3>
				<el-table :data="voucherList" style="width: 100%;margin: 10px 0px;" border stripe v-loading='loading' ref='multipleTable'
				 @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column align="center" label="会计期间" prop="fDate_string" :resizable="false"></el-table-column>
					<el-table-column align="center" label="凭证字号" prop='fNumber_fBrNo' :resizable="false"></el-table-column>
					<el-table-column align="center" label="摘要" prop="fExplanation" :resizable="false"></el-table-column>
					<el-table-column align="center" label="科目代码" prop='fnumberAccount' :resizable="false"></el-table-column>
					<el-table-column align="center" label="科目名称" prop='fFullName' :resizable="false"></el-table-column>
					<el-table-column align="center" label="借方" prop="fDebit" :resizable="false"></el-table-column>
					<el-table-column align="center" label="贷方" prop="fCredit" :resizable="false"></el-table-column>

					<el-table-column align="center" label="是否审核" prop="fChecked" :resizable="false"></el-table-column>
					<el-table-column align="center" label="是否过账" prop="fPosted" :resizable="false"></el-table-column>

				</el-table>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogVisible3 = false">关闭</el-button>
					<el-button type="primary" @click="commitRelate">确定关联</el-button>
				</div>
			</el-dialog>

		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				remark: '',
				detailTable: [],
				voucherList: [],
				voucherList1: [],
				historyList: [],
				detailInfo: {},
				activeName: '2',
				state: '2',
				userId: '',
				isJzcollectAdmin: '',
				loading: false,

				universityName: '',
				departmentId: '',

				uploadData: {},

				tableData: [],
				detail: {},

				total: 0,
				pageSize: 10,
				currentPage: 1,

				universityList: [],
				departList: [],
				multiSelection: [],
				dialogVisible: false,
				dialogVisible1: false,
				dialogVisible2: false,
				dialogVisible3: false,
				multipleSelection: [],
				multipleSelection1: [],
				form: {},
				form1: {
					depart: []
				},
				positionList: [],
				list: ['应收账款问题', '其他应收账款问题', '预付账款问题', '预收账款问题', '应付账款问题', '其他应付账款问题'],
				voucherInfo: {},
				temList: [],
				fdate_temp: '',
				temaccountPeriod: '',
				nowPeriod: '',
				reaccountPeriod: '',
				modifyData:{}
			}
		},
		components: {},
		methods: {
			handleClick(tab, event) {
				console.log(tab, event);
				this.state = tab.name;
				this.queryPage()
			},
			resetForm() {
				this.uploadData = {}
			},
			hideDialog() {
				this.dialogVisible = false
			},
			hideDialog1() {
				this.dialogVisible1 = false
			},
			search() {
				this.accountPeriod = this.uploadData.accountPeriod;
				this.customerId = this.uploadData.customerId;
				this.queryPage();
			},



			refresh() {
				this.queryPage()
			},


			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage()
			},


			handleDetail(row) {
				this.detailInfo = JSON.parse(JSON.stringify(row));
				
				let param = {
					"dealConfirmId": this.detailInfo.dealConfirmId,
					"state": 6,
					"customerId": this.detailInfo.customerId,
					"customerName": this.detailInfo.customerName,
					"flag": "开始处理",
				};
				this.updateDealConfirmRcrd(param);
				this.getHistoryList(row);
				let params = {
					dealConfirmId: row.dealConfirmId,
					// dealConfirmId: row.dealConfirmId,
					customerName: row.customerName,
				}
				this.axios.post('/perTaxToolTwo/import/e9z/getDealProblemInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.dialogVisible = true;
							this.detail = res.data.data;
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
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
			setTemAccountPeriod(tag, row){
				this.row = row;
				// this.temaccountPeriod = this.detailInfo.accountPeriod;
				this.nowPeriod = this.detailInfo.accountPeriod;
				this.getDealProblemInfo(tag, row)
			},

			getDealProblemInfo(tag, row) {
				if (tag == 1) {
					var params = {
						dealConfirmId: row.dealConfirmId,
						// dealConfirmId: row.dealConfirmId,
						customerName: this.detailInfo.customerName
					}
				} else {
					var params = {
						"customerName": this.detailInfo.customerName,
						"accountPeriod": this.temaccountPeriod,
						"nowPeriod": this.nowPeriod,
						"dealConfirmReamrk1": this.row[0].acctNum,
						"customerId": this.detailInfo.customerId,
					}
				}

				this.axios.post('/perTaxToolTwo/import/e9z/getDealProblemInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							if (tag == 1) {
								this.detail = res.data.data;
							} else {
								this.dialogVisible1 = true;
								this.nowPeriod = '';
								this.detailTable = res.data.data;
							}

							this.$message({
								message: res.data.msg,
								type: 'success'
							});
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
						this.loading = false;
						this.detailTable = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},

			getHistoryList(row) {
				let params = {
					dealConfirmId: row.dealConfirmId,
				}
				this.axios.post('/perTaxToolTwo/import/e9z/getOperationHistory', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.historyList = res.data.data;

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
						this.loading = false;
						this.historyList = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},

			getTVoucherListById(row, tag) {
				if (tag) {
					this.dialogVisible2 = true;
				} else {
					this.dialogVisible3 = true;
				}

				let params = {
					"fBrNo": this.detailInfo.customerName,
					"fNumber": row.acctNum,
					"probVchId": row.probVchErpId,
					// "fNumber": '1502.11',
					// "probVchId": 1
				}
				this.axios.post('/perTaxToolTwo/e9/entryRelation/getTVoucherListById', this.qs.stringify(params))
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.voucherList = res.data.data;
							this.$nextTick(() => {
								if (!tag) {
									this.voucherList.forEach(row => {
										this.$refs.multipleTable.toggleRowSelection(row, true)

									})
								}
							})

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
						this.loading = false;
						this.voucherList = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},

			getTVoucherList(row) {
				if(row){
					var params = {
						"fBrNo": this.detailInfo.customerName,
						"accountPeriod": this.reaccountPeriod,
						"fNumber": row.acctNum,
						"probVchId": row.probVchErpId,
					}
				}else{
					var params = {
						"fBrNo": this.detailInfo.customerName,
						"accountPeriod": this.reaccountPeriod,
						"fNumber": this.modifyData.acctNum,
						"probVchId": this.modifyData.probVchErpId,
					}
				}
				
				this.axios.post('/perTaxToolTwo/e9/entryRelation/getTVoucherList', this.qs.stringify(params))
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.voucherList1 = res.data.data;

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
						this.loading = false;
						this.voucherList1 = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},

			commitRelate() {
				let params = {
					fBrNo: this.detailInfo.customerName,
					amountMoney: this.modifyData.probEntryAmt_String,
					amountFor: this.modifyData.correctData,
					fvoucheriderp: this.modifyData.probVchErpId,
					accountPeriod: this.detailInfo.accountPeriod,
					dealproblemid: this.modifyData.dealProblemId,
					fNumber: this.modifyData.acctNum,
					dealProbReamrk4: this.modifyData.dealProbReamrk1,
					dealConfirmId: this.modifyData.dealConfirmId,
					customerId: this.detailInfo.customerId,
					faccountid: this.modifyData.acctId,
					fvoucherList: this.multipleSelection.concat(this.multipleSelection1),
					fDC: this.modifyData.probEntryDc,


				};
				this.axios.post('/perTaxToolTwo/e9/entryRelation/confirmRelation', params)

					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.dialogVisible3 = false;
							this.queryPage();
							this.getHistoryList(this.modifyData);
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
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

			commitCopy(fvoucherid) {
				let params = {
					fBrNo: this.detailInfo.customerName,
					amountMoney: this.modifyData.probEntryAmt,
					amountFor: this.modifyData.correctData,
					fvoucheriderp: this.modifyData.probVchErpId,
					// accountPeriod: this.detailInfo.accountPeriod,
					accountPeriod: this.detailInfo.accountPeriod,
					dealproblemid: this.modifyData.dealProblemId,
					fNumber: this.modifyData.acctNum,
					// fNumber: '1502.11',
					dealProbReamrk4: this.modifyData.dealProbReamrk4,
					dealConfirmId: this.modifyData.dealConfirmId,
					customerId: this.detailInfo.customerId,
					fDC: this.modifyData.probEntryDc,
					fvoucherid:fvoucherid

				};
				this.axios.post('/perTaxToolTwo/e9/entryRelation/insertEntryRelation', this.qs.stringify(params))

					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.dialogVisible = false;
							this.queryPage();
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
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
						this.loading = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},

			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleSelectionChange1(val) {
				this.multipleSelection1 = val;
			},
			getRemark(row) {
				this.$alert(row.dealProbReamrk1, '备注', {
					confirmButtonText: '确定',
					callback: action => {

					}
				});
			},

			addRemark(row) {
				this.remark = row.dealProbReamrk1;
				this.$prompt('请输入备注', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValue: this.remark
				}).then(({
					value
				}) => {
					let params = {
						"dealProblemId": row.dealProblemId,
						"dealProbReamrk1": value,
						"dealConfirmId": this.detailInfo.dealConfirmId,
						"flag": '修改凭证号' + row.dealProbReamrk4 + '对应科目备注'
					};
					this.axios.post('/perTaxToolTwo/import/e9z/saveDealProblem', params)
						.then(res => {
							if (res.data.code == 200) {
								this.getDealProblemInfo(1, row);
								this.getHistoryList(row);
								this.$message({
									message: res.data.msg,
									type: 'success'
								});

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

				}).catch(() => {
					// this.$message({
					// 	type: 'info',
					// 	message: '取消'
					// });
				});
			},


			addRelation(row) {
				this.modifyData = JSON.parse(JSON.stringify(row));
				
				this.getProofTVoucher(this.detailInfo.customerName,row);
				this.getTVoucherListById(row);
				// this.getTVoucherList(row);
			},
			
			getProofTVoucher(val,row) {
				let params = {
					"fBrNo": val
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVoucher', this.qs.stringify(params), {
						// this.axios.post('/miaoxing/queryPage', params)
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					.then(res => {
						if (res.data.code == 200) {
							
							this.reaccountPeriod = res.data.data.fyear.toString() + "-" + (res.data.data.fperiod < 10? '0' + res.data.data.fperiod : res.data.data.fperiod);
							this.getTVoucherList(row);
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

			addCopy(row) {
				this.modifyData = JSON.parse(JSON.stringify(row));
				this.queryProofTVoucher(row);


			},

			getProofTVouchers(row) {
				let params = {
					"fBrNo": this.detailInfo.customerName,
					"fVoucherID": row.probVchId,
					"insert_type": 1
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVouchers_fVoucherID', this.qs.stringify(params))
					.then(res => {
						if (res.data.code == 200) {
							this.temList = res.data.data;
							this.createProofTVouchers();

							this.$message({
								message: res.data.msg,
								type: 'success'
							});

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

			createProofTVouchers() {
				// this.saveProofTVouchers();




				var tvoucherentry = [];
				var fdebittotal_string = 0;
				var fcredittotal_string = 0;

				this.temList.forEach(items => {

					if (items.fDebit_string) {
						tvoucherentry.push({
							"fexplanation": items.fExplanation,
							"faccount": items.fNumber_account,
							"fdc": 1,
							"famount_string": items.fDebit_string.replace(/,/g, ''),
						})
						fdebittotal_string += parseFloat(items.fDebit_string);
					} else if (items.fCredit_string) {
						tvoucherentry.push({
							"fexplanation": items.fExplanation,
							"faccount": items.fNumber_account,
							"fdc": 0,
							"famount_string": items.fCredit_string.replace(/,/g, ''),
						})
						fcredittotal_string += parseFloat(items.fCredit_string);
					}

				})


				let params = {
					"fbrno": this.detailInfo.customerName,
					"fdebittotal_string": fdebittotal_string,
					"fcredittotal_string": fcredittotal_string,
					"fexplanation": this.temList[0].fExplanation,
					"fentrycount": tvoucherentry.length,
					"tvoucherentries": tvoucherentry,
					"fdate_temp": this.fdate_temp,
					"ftransdate_temp": this.fdate_temp,
					"fnumber": this.voucherInfo.fnumber,
					"fserialnum": this.voucherInfo.fserialnum,
					"scheduleId": ''
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/createProofTVouchers', params)
					.then(res => {
						if (res.data.code == 200) {
							this.commitCopy(res.data.data.fvoucherid);

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


			queryPage() {
				this.loading = true;
				let params = {
					page: this.currentPage,
					row: this.pageSize,
					data: {
						// "customerId":'jz17951',
						// "accountPeriod": '2019-11',
						"customerId": this.customerId,
						"accountPeriod": this.accountPeriod,
						"state": this.state,
						"authorizeState": 1 // 默认传1

					}

				};
				this.axios.post('/perTaxToolTwo/e9z/findDealConfirmPageList', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data;
							this.total = res.data.count;
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
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
						this.loading = false;
						this.tableData = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			commit() {
				let params = {
					dealConfirmId: this.detailInfo.dealConfirmId,
					customerName: this.detailInfo.customerName,
					customerId: this.detailInfo.customerId,
					submitRemark: '修改备注'
				}
				this.axios.post('/perTaxToolTwo/import/e9z/isDealProblemInfoSubmit', params)

					.then(res => {
						if (res.data.code == 200) {
							if (res.data.data == 2) {
								this.$confirm(res.data.msg, '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(() => {
									var params = {
										"dealConfirmId": this.detailInfo.dealConfirmId,
										"state": 3,
										"submitResult": 2,
										"submitRemark": "修改备注",
										"customerId": this.detailInfo.customerId,
										"customerName": this.detailInfo.customerName,
									}
									this.updateDealConfirmRcrd(params);
								}).catch(() => {
									this.$message({
										type: 'info',
										message: '已取消'
									});
								});
							} else if (res.data.data == 1) {
								this.$alert(res.data.msg, '提示', {
									confirmButtonText: '确定',
									callback: action => {

									}
								});
							}else{
								this.dialogVisible = false;
								this.queryPage();
								this.$message({
									type: 'success',
									message: '提交成功'
								});
							}
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

			approve(tag) {
				if (tag) {
					let params = {
						dealConfirmId: this.detailInfo.dealConfirmId,
						state: 4,
						approveResult: 1,
						flag: '审核通过',

					}
					this.updateDealConfirmRcrd(params)
				} else {
					this.$prompt('请输入不通过原因', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消'

					}).then(({
						value
					}) => {
						let params = {
							dealConfirmId: this.detailInfo.dealConfirmId,
							state: 2,
							approveResult: 2,
							approveRemark: value,
							flag: '审核不通过',
						}
						this.updateDealConfirmRcrd(params)
					}).catch(() => {
						// this.$message({
						// 	type: 'info',
						// 	message: '取消'
						// });
					});
				}


			},


			updateDealConfirmRcrd(params) {
				this.axios.post('/perTaxToolTwo/import/e9z/updateDealConfirmRcrd', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible = false;
							this.queryPage();
							this.$message({
								message: res.data.msg,
								type: "success"
							});
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

			getPeriod(row) {
				let params = {
					year: this.fdate_temp.slice(0, 4),
					month: parseFloat(this.fdate_temp.slice(5, 7)),
					// year: this.voucherInfo.temYear,
					// month: this.voucherInfo.temMonth,
					fBrNo: this.detailInfo.customerName
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/getPeriod', this.qs.stringify(params), {
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					.then(res => {
						if (res.data.code == 200) {
							this.$set(this.voucherInfo, 'fnumber', res.data.data.fNumber_fBrNo);
							this.getProofTVouchers(row);
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

			//所有会计科目

			queryProofTVoucher(row) {
				let params = {
					"fBrNo": this.detailInfo.customerName
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVoucher', this.qs.stringify(params), {

						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					.then(res => {
						if (res.data.code == 200) {
							this.$set(this.voucherInfo, 'fserialnum', res.data.data.fserialnum);
							this.fdate_temp = res.data.data.ftransdate_temp;

							this.getPeriod(row);

							this.$message({
								message: res.data.msg,
								type: 'success'
							});
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
			queryInfo(val) {
				this.queryDepartment(val);

				//查询职务
				this.queryListAllApp(val);
			},
			queryDepartment(val) {
				let params = {
					universityInfoId: val

				};
				this.axios.post('/campusGang/department/queryList', params)
					.then(res => {
						if (res.data.code == 200) {
							this.departList = res.data.data;

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
			queryListAllApp(val) {
				let params = {
					universityInfoId: val

				};
				this.axios.post('/campusGang/app/positionInfo/queryListAllApp', params)
					.then(res => {
						if (res.data.code == 200) {
							this.positionList = res.data.data;

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

			'$route'(to, from) {
				// init data
				if (to.name == 'contactDetails') {
					this.queryPage();
				}

			},

			temaccountPeriod(val) { 
				this.getDealProblemInfo(0,items)
			},
		},
		computed: {},
		created() {
			this.queryPage();
			// this.queryUniversityInfo();
			// this.isJzcollectAdmin = JSON.parse(sessionStorage.getItem('updateUser')).isJzcollectAdmin;
			// this.userId = sessionStorage.getItem('userId');

		}
	}
</script>

<style lang='less' scoped>
	.main {
		/* background: #fff; */
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		.el-tag+.el-tag {
			margin-left: 10px;
		}

		.button-new-tag {
			margin-left: 10px;
			height: 32px;
			line-height: 30px;
			padding-top: 0;
			padding-bottom: 0;
		}

		.input-new-tag {
			width: 90px;
			margin-left: 10px;
			vertical-align: bottom;
		}

		.el-breadcrumb {
			height: 40px;
			line-height: 39px;
			padding-left: 20px;
			/* background-color: #fff; */
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box
		}

		/deep/ .el-table td,
		/deep/ .el-table th {
			padding: 6px 0;
		}

		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 30px;
			background-color: #f9f9f9;
		}

		/deep/ .el-table th {
			background-color: #f9f9f9;
		}

		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #f9f9f9;
		}

		/deep/ .el-table__body tr,
		.el-table__body td {
			padding: 0;
			height: 30px;
			background-color: #fff;
		}

		/deep/ .el-table__body tr.el-table__row--striped {
			background-color: #f9f9f9;
		}

		/deep/ .el-table thead {
			color: #8C8C8C;
		}

		/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
			background-color: #efe9e5;
		}

		/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
			border-bottom-color: #fff;
			background: #f9f9f9;
		}

		/deep/ .search_contain {
			background: #fff;
			/* height: 40px; */
			/* padding-left: 20px; */
			padding: 0.3rem 20px 0.08rem;
			margin: 0px 20px 10px;

			.info {
				height: 40px;
				line-height: 40px;
			}

			a {
				margin-left: 10px;
			}

			.el-input {
				width: 180px;
			}

			.el-form-item {
				margin-right: 30px;
			}

		}

		.main_contain {
			background: #fff;
			margin: 12px 20px 20px;
			padding: 12px 20px 20px;
			/* height: calc(100% - 190px); */

			h5 {
				height: 40px;
				line-height: 40px;
			}

			/deep/ .el-pagination {
				text-align: center;
				margin-top: 10px;
			}
		}
	}


	.active-select {
		background-color: rgb(125, 195, 109) !important;
	}

	.next {
		width: 207px;
		height: 56px;
		background: rgba(36, 214, 137, 1);
		border: 3px solid rgba(36, 214, 137, 1);
		font-size: 16px;
		font-family: Microsoft YaHei;
		text-align: center;
		line-height: 56px;
		font-weight: bold;
		color: #fff;
	}

	.last {
		width: 207px;
		height: 56px;
		background: red;
		border: 3px solid red;
		font-size: 16px;
		font-family: Microsoft YaHei;
		text-align: center;
		line-height: 56px;
		font-weight: bold;
		color: #fff;
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

	/deep/ .el-dialog {
		thead .el-table-column--selection .cell {
			display: none;
		}



		.mark {
			color: #ed878e;
		}

		/deep/ .el-dialog__body {
			padding-top: 0;
			padding-bottom: 0px;
		}

		/deep/ .el-tabs__content {
			height: 550px;
			overflow: auto;
		}

		/deep/ .el-select,
		/deep/ .el-input,
		/deep/ .el-date-editor {
			width: 260px;
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
</style>
