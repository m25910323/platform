<template>
	<div class="main_contain">

		<div class="contain_body">
			
			<el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
				<el-tab-pane label="未分配发票" name="0">
					<el-table :data="detailData1.slice((currentPage - 1)*10,(currentPage - 1)*10 + 10)" style="width:calc(100% - 40px);margin:20px" border v-loading='loading1' @row-click='showDetail' ref='multipleTable'
					 @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands" @selection-change="handleSelectionChange">
						<el-table-column type="expand">
							<template slot-scope="props">
								<div class='clearfix'>
									<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
										<h3>发票详情</h3>
										<div style="margin-top: 12px;">
											
											<img :src="images[0].url" alt=""  class="moimg">
											<!-- <div style="width: 100%;height: 40px;">
												<span class='el-icon-refresh' @click="rotate" style="font-size: 16px;display: inline-block;width: 40px;height: 40px;"></span>
											</div> -->
					
										</div>
					
					
									</div>
									<div style='float:right;width: 500px;'>
										<div style='border:1px solid #efefef;box-sizing:border-box;margin:0px 10px;padding:10px 0px'>
											<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
												<el-form-item v-for='(item,index) in form' :label="item.fieldChName">
													<el-input v-model='item.fieldValue' size="mini" disabled></el-input>
													
												</el-form-item>
					
												<div></div>
												
											</el-form>
										</div>
										<!-- <div style='border:1px solid #efefef;box-sizing:border-box;margin:10px 10px'>
					
											<div style="margin-top: 4px;">
												<img :src="modelUrl" alt="" style="width:100%;vertical-align: bottom;margin-right: 20px;">
												
											</div>
											
										</div> -->
									</div>
								</div>
					
					
							</template>
						</el-table-column>
						<el-table-column align="center" type="selection" width="55"  :reserve-selection="true" v-show='$route.query.billSourceType != 2' >
						</el-table-column>
						<el-table-column align="center" label="发票类型" prop="typeName" :resizable="false"></el-table-column>
						
						<el-table-column align="center" label="发票号" prop="invoiceNum" :resizable="false"></el-table-column>
						<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="税额" prop="taxAmount" :resizable="false"></el-table-column>
						
						
						<el-table-column align="center" label="是否代开" :resizable="false" width="120">
							<template slot-scope="scope">
								<span v-if='scope.row.issuedSign == 1'>是</span>
								<span v-if='scope.row.issuedSign == 0'>否</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="是否认证" :resizable="false" width="120">
							<template slot-scope="scope">
								<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 1'>是</span>
								<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 0'>否</span>
								<span v-if='scope.row.typeName != "增值税专用发票"'>--</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="状态" prop="state" :resizable="false" width="120">
							<template slot-scope="scope">
								<span v-if='scope.row.state == 1'>待审核</span>
								<span v-if='scope.row.state == 2'>审核通过</span>
								<span v-if='scope.row.state == 3'>审核不通过</span>
								<span v-if='scope.row.state == 4'>问票中</span>
							</template>
						</el-table-column>
					
						<!-- <el-table-column align="center" :resizable="false">
							<template slot="header" slot-scope="scope">
								<span>操作</span>
							</template>
							<template slot-scope="scope">
								
								
								<el-button size="mini" type="text" @click.stop="showconnectMain1(scope.$index, scope.row)" v-show="scope.row.isMaster.length > 0">查看清单</el-button>
								
							</template>
						</el-table-column> -->
					</el-table>
					<el-pagination background @current-change="((val)=>{handleCurrentChange(val)})" :current-page="currentPage"
					 :page-size="pageSize" layout="total, prev, pager, next" :total="detailData1.length">
					</el-pagination>
			
			
			
				</el-tab-pane>
				<el-tab-pane label="关联发票" name="2">
					<el-table :data="detailData.slice((currentPage2 - 1)*10,(currentPage2 - 1)*10 + 10)" style="width:calc(100% - 40px);margin:20px" border v-loading='loading1' @row-click='showDetail' ref='refTable'
					 @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands">
						<el-table-column type="expand">
							<template slot-scope="props">
								<div class='clearfix'>
									<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
										<h3>发票详情</h3>
										<div style="margin-top: 12px;">
											
											<img :src="images[0].url" alt=""  class="moimg">
											<!-- <div style="width: 100%;height: 40px;">
												<span class='el-icon-refresh' @click="rotate" style="font-size: 16px;display: inline-block;width: 40px;height: 40px;"></span>
											</div> -->
					
										</div>
					
					
									</div>
									<div style='float:right;width: 500px;'>
										<div style='border:1px solid #efefef;box-sizing:border-box;margin:0px 10px;padding:10px 0px'>
											<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
												<el-form-item v-for='(item,index) in form' :label="item.fieldChName">
													<el-input v-model='item.fieldValue' size="mini" disabled></el-input>
													
												</el-form-item>
					
												<div></div>
												
											</el-form>
										</div>
										<!-- <div style='border:1px solid #efefef;box-sizing:border-box;margin:10px 10px'>
					
											<div style="margin-top: 4px;">
												<img :src="modelUrl" alt="" style="width:100%;vertical-align: bottom;margin-right: 20px;">
												
											</div>
											
										</div> -->
									</div>
								</div>
					
					
							</template>
						</el-table-column>
						<!-- <el-table-column align="center" type="selection" width="55"> -->
						</el-table-column>
						<el-table-column align="center" label="发票类型" prop="typeName" :resizable="false"></el-table-column>
						
						<el-table-column align="center" label="发票号" prop="invoiceNum" :resizable="false"></el-table-column>
						<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="税额" prop="taxAmount" :resizable="false"></el-table-column>
						
						
						<el-table-column align="center" label="是否代开" :resizable="false" width="120">
							<template slot-scope="scope">
								<span v-if='scope.row.issuedSign == 1'>是</span>
								<span v-if='scope.row.issuedSign == 0'>否</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="是否认证" :resizable="false" width="120">
							<template slot-scope="scope">
								<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 1'>是</span>
								<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 0'>否</span>
								<span v-if='scope.row.typeName != "增值税专用发票"'>--</span>
							</template>
						</el-table-column>
						<el-table-column align="center" label="状态" prop="state" :resizable="false" width="120">
							<template slot-scope="scope">
								<span v-if='scope.row.state == 1'>待审核</span>
								<span v-if='scope.row.state == 2'>审核通过</span>
								<span v-if='scope.row.state == 3'>审核不通过</span>
								<span v-if='scope.row.state == 4'>问票中</span>
							</template>
						</el-table-column>
					
						<!-- <el-table-column align="center" :resizable="false">
							<template slot="header" slot-scope="scope">
								<span>操作</span>
							</template>
							<template slot-scope="scope">
								
								
								<el-button size="mini" type="text" @click.stop="showconnectMain1(scope.$index, scope.row)" v-show="scope.row.isMaster.length > 0">查看清单</el-button>
								
							</template>
						</el-table-column> -->
					</el-table>
					<el-pagination background @current-change="((val)=>{handleCurrentChange2(val)})" :current-page="currentPage2"
					 :page-size="pageSize2" layout="total, prev, pager, next" :total="detailData.length">
					</el-pagination>
			
			
				</el-tab-pane>
			
			</el-tabs>
			
			

			<div style="background-color: #efefef;padding: 20px 50px 20px 20px;position: relative;">
				<!-- <div style="width:16px;position: absolute;top: 120px;right: 26px;color: royalblue;">附件1张</div> -->
				<h2>记账凭证</h2>
				<div class='line'></div>
				<div class='line'></div>
				<div style="width: 800px;float: left;">
					<span>{{fBrNo}}</span>
					<span>{{detail.fPeriod}}</span>
				</div>

				<h4>

					<span style="float: right;">凭证字号：记-{{detail.fNumber_fBrNo}}</span><span style="float: right;margin-right: 20px;">序列号：{{detail.fSerialNum}}</span>
				</h4>
				<el-table :data="tableListNew" style="width: 100%" show-summary :summary-method="getSummaries">
					<el-table-column align="center" label="摘要" width="450">
						<template slot-scope="scope">
							<div style="min-height: 20px;" contenteditable="true" v-text="scope.row.fExplanation" @blur='handleInput(scope.row,scope.$index, "fExplanation",$event)'></div>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="faccount" label="会计科目">
						<el-table-column align="center" label="一级科目_明细科目" prop="fNumber_account" show-overflow-tooltip width="450">
							<template slot-scope="scope">
								<el-select size="mini" v-model="scope.row.fNumber_account" :disabled="!tableList[0].fExplanation"
								 :clearable='accountNumber > 1' filterable @change="((val,index,row)=>{handleSelect(val,scope.$index,scope.row)})">
									<el-option  v-show='item.fdetail == 1' v-for="item in fNameList" :label="item.fnumber + '-' + item.ffullname" :value="item.fnumber"></el-option>
								</el-select>
								<!-- <div v-show="scope.$index == tableList.length - 1">{{totaltxt}}</div> -->

							</template>
						</el-table-column>
					</el-table-column>
					<!-- <el-table-column align="center" prop="ffullname" label="科目名称" width="150" show-overflow-tooltip></el-table-column> -->
					<el-table-column align="center" label="借方" prop="fDebit_string">
						<template slot-scope="scope">
							<div style="min-height: 20px;" :contenteditable="(scope.row.fCredit_string === null || scope.row.fCredit_string == '') && scope.row.fNumber_account != ''" v-text="scope.row.fDebit_string"
							 @blur='handleInput(scope.row,scope.$index, "fDebit_string",$event,"number")' @keydown.enter="cancelenter($event,scope.row,scope.$index, 'fDebit_string')"></div>
							<!-- <div v-show="scope.$index == tableList.length - 1">{{famount_string1Total}}</div> -->
						</template>
					</el-table-column>
					<el-table-column align="center" label="贷方" prop="fCredit_string">
						<template slot-scope="scope">
							<div style="min-height: 20px;" :contenteditable="(scope.row.fDebit_string === null || scope.row.fDebit_string == '') && scope.row.fNumber_account != ''" v-text="scope.row.fCredit_string"
							 @blur='handleInput(scope.row,scope.$index, "fCredit_string",$event,"number")' @keydown.enter="cancelenter($event,scope.row,scope.$index, 'fCredit_string')"></div>
							<!-- <div v-show="scope.$index == tableList.length - 1">{{famount_string2Total}}</div> -->
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作">
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click='getfName(scope.row,scope.$index)' v-if='scope.$index == 0'>查看科目</el-button>
							<el-button size="mini" type="text" @click='addOneLine(scope.row,scope.$index)'>新增一行</el-button>
							<el-button size="mini" type="text" @click='deleteOneLine(scope.row,scope.$index)'>清空</el-button>
						</template>
					</el-table-column>

				</el-table>
				<el-pagination background @current-change="((val)=>{handleCurrentChange1(val)})" :current-page="tableIndex+1"
				 :page-size="1" layout=" prev, pager, next" :total="tableTotal" style="text-align: center;">
				</el-pagination>
				<div class='btn_contain clearfix'>
					<!-- <span class='commit' @click="showDialog">查看已填写记账凭证</span>
					<span class='commit' @click="saveProofTVouchers">保存并填写下一张</span> -->
					<span class='close' @click="createProofTVouchers" v-show="mtype != 1">提交</span>
				</div>
			</div>


		</div>

		<el-dialog width="600px" title="会计科目" :visible.sync="innerVisible" append-to-body>
			<el-button size="small" @click='showAddDialog' style="margin-bottom: 4px;">新增</el-button>
			<el-tabs v-model="activeName2" type="card" @tab-click="handleClick1">
				<el-tab-pane label="1、资产" name="1">
					<el-input placeholder="输入关键字进行过滤" v-model="filterText1" size="mini">
					</el-input>
					<el-tree v-loading='loading' :data="treeList" :props="props" node-key="fnumber"
					 ref="tree1" :render-content="renderContent" :filter-node-method="filterNode">
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="2、负债" name="2">
					<el-input placeholder="输入关键字进行过滤" v-model="filterText2" size="mini">
					</el-input>
					<el-tree v-loading='loading' :data="treeList" :props="props" node-key="fnumber"
					 ref='tree2' :render-content="renderContent" :filter-node-method="filterNode">
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="3、权益" name="3">
					<el-input placeholder="输入关键字进行过滤" v-model="filterText3" size="mini">
					</el-input>
					<el-tree v-loading='loading' :data="treeList" :props="props" node-key="fnumber"
					 ref='tree3' :render-content="renderContent" :filter-node-method="filterNode">
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="4、成本" name="4">
					<el-input placeholder="输入关键字进行过滤" v-model="filterText4" size="mini">
					</el-input>
					<el-tree v-loading='loading' :data="treeList" :props="props" node-key="fnumber"
					 ref='tree4' :render-content="renderContent" :filter-node-method="filterNode">
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="5、损益" name="5">
					<el-input placeholder="输入关键字进行过滤" v-model="filterText5" size="mini">
					</el-input>
					<el-tree v-loading='loading' :data="treeList" :props="props" node-key="fnumber"
					 ref='tree5' :render-content="renderContent" :filter-node-method="filterNode">
					</el-tree>
				</el-tab-pane>
			</el-tabs>
			<div class='btn_contain clearfix'>
				<!-- <span class='commit' @click="commit">确认</span> -->
				<span class='close' @click="close">关闭</span>
		
			</div>
		</el-dialog>
		
		<el-dialog width="400px" title="会计科目" :visible.sync="innerVisible1" append-to-body>
			<el-form ref="form" :model="form2" label-width="100px" size="mini">
		
				<el-form-item label="科目代码" prop="fnumber" :rules="[$rules.requiredInput]">
					<el-input v-model="form2.fnumber" @change="getProofTAccount_fGroupID"></el-input>
				</el-form-item>
				<el-form-item label="科目名称" prop="fname" :rules="[$rules.requiredInput]">
					<el-input v-model="form2.fname"></el-input>
				</el-form-item>
				<el-form-item label="科目类别">
					<el-select v-model='form2.fgroupid' size="mini">
						<el-option v-for='item in fGroupList' :label="item.fGroupName" :value="item.fGroupID" :key='item.fGroupID'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="余额方向">
					<el-select v-model='form2.fdc' size="mini">
						<el-option v-for='item in fDCList' :label="item.fDCName" :value="item.fDC" :key='item.fDC'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="损益所属科目">
					<el-select v-model='form2.fearnaccountid' size="mini">
						<el-option label="空" value="0"></el-option>
						<el-option label="非限定性净资产_非限定性收入转入" value="1062"></el-option>
						<el-option label="非限定性净资产_非限定性费用转入" value="1063"></el-option>
						<el-option label="限定性净资产_限定性收入转入" value="1065"></el-option>
						<el-option label="限定性净资产_限定性费用转入" value="1066"></el-option>
					</el-select>
				</el-form-item>
		
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog">取 消</el-button>
				<el-button type="primary" @click="commitAddChild">确 定</el-button>
			</span>
		</el-dialog>
		
		<el-dialog width="400px" title="会计科目" :visible.sync="innerVisible2" append-to-body>
			<el-form ref="form1" :model="form3" label-width="100px" size="mini">
		
				<el-form-item label="科目代码" prop="fnumber">
					<el-input v-model="form3.fnumber" disabled></el-input>
				</el-form-item>
				<el-form-item label="科目名称" prop="fname" :rules="[$rules.requiredInput]">
					<el-input v-model="form3.fname"></el-input>
				</el-form-item>
				<el-form-item label="科目类别">
					<el-select v-model='form3.fgroupid' size="mini">
						<el-option v-for='item in fGroupList' :label="item.fGroupName" :value="item.fGroupID" :key='item.fGroupID'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="余额方向">
					<el-select v-model='form3.fdc' size="mini">
						<el-option v-for='item in fDCList' :label="item.fDCName" :value="item.fDC" :key='item.fDC'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="损益所属科目">
					<el-select v-model='form3.fearnaccountid' size="mini">
						<el-option label="空" value="0"></el-option>
						<el-option label="非限定性净资产_非限定性收入转入" value="1062"></el-option>
						<el-option label="非限定性净资产_非限定性费用转入" value="1063"></el-option>
						<el-option label="限定性净资产_限定性收入转入" value="1065"></el-option>
						<el-option label="限定性净资产_限定性费用转入" value="1066"></el-option>
					</el-select>
				</el-form-item>
		
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog2">取 消</el-button>
				<el-button type="primary" @click="commitModifyChild">确 定</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
	// import PlanDialog from "../components/common/planDialog.vue"
	export default {
		name: "customer",
		data() {
			return {
				mtype:0,
				innerVisible:false,
				activeName2: "1",
				props: {
					label: 'full',
					children: 'children'
				},
				filterText1: '',
				filterText2: '',
				filterText3: '',
				filterText4: '',
				filterText5: '',
				treeList:[],
				innerVisible1:false,
				innerVisible2:false,
				form2:{
					fearnaccountid:'0'
				},
				form3:{
					fearnaccountid:'0'
				},
				tag:1,
				fGroupList: [{
						fGroupID: 101,
						fGroupName: '流动资产'
					},
					{
						fGroupID: 102,
						fGroupName: '非流动资产'
					},
					{
						fGroupID: 201,
						fGroupName: '流动负债'
					},
					{
						fGroupID: 300,
						fGroupName: '所有者权益'
					},
					{
						fGroupID: 400,
						fGroupName: '成本'
					},
					{
						fGroupID: 501,
						fGroupName: '营业收入'
					},
					{
						fGroupID: 502,
						fGroupName: '营业成本及税金'
					},
					{
						fGroupID: 503,
						fGroupName: '期间费用'
					},
					{
						fGroupID: 504,
						fGroupName: '其他收益'
					},
					{
						fGroupID: 505,
						fGroupName: '其他损失'
					},
					{
						fGroupID: 506,
						fGroupName: '以前年度损益调整'
					},
					{
						fGroupID: 507,
						fGroupName: '所得税'
					},
					{
						fGroupID: 601,
						fGroupName: '表外科目'
					},
					{
						fGroupID: 700,
						fGroupName: '共同'
					},
				],
				fDCList: [{
						fDCName: '借方',
						fDC: 1
					},
					{
						fDCName: '贷方',
						fDC: -1
					}
				],
				
				tableIndex: 0,
				// tableTotal: 1,
				isShow:false,
				tableList: [],
				detail: {},
				currentPage: 1,
				currentPage2: 1,
				pageSize: 10,
				pageSize2: 10,
				dialogVisible1: false,
				fBrNo: "",
				fVoucherID: '',
				arr: [],
				fNameList: [],
				voucherInfo: {},
				totaltxt: '',
				tableList: [],
				uploadData: {
					fYear: '',
					fBrNo: ''
				},
				uploadData1: {
					fBrNo: ''
				},
				loading: false,
				loading1: false,
				temList: [],
				current: 0,
				fdebittotal_stringList: [],
				fcredittotal_stringList: [],
				year:'',
				month:'',
				multipleSelection:[],
				detailData:[],
				detailData1:[],
				getRowKeys(row) {
					return row.scheduleId
				},
				expands:[],
				modelUrl:'',
				scheduleId: "",
				scheduleType: '',
				picData: {
					scheduleType: 1,
					scheduleId: '',
					imageUrl: ''
				},
				sum2:0,
				sum3:0,
				
				images:[],
				
				activeName: "0",

			}
		},
		components: {
			// PlanDialog
		},
		methods: {
			renderContent(h, {
				node,
				data,
				store
			}) {
				return ( <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 8px;" >
						<span>
						<span style="" title={data.full}> {data.full}</span> </span><span>
						<el-button style="font-size: 12px;" type="text" on-click = {() => this.modify(data)}>修改</el-button>
						<el-button style="font-size: 12px;" type = "text" on-click = {() => this.remove(node, data)}>删除</el-button> </span> </span>);
			},
			filterNode(value, data) {
				if (!value) return true;
				return data.full.indexOf(value) !== -1;
			},
			addOneLine(row,index){
				this.tableList.splice(row.findex+1, 0, {
						fExplanation: '',
						fNumber_account: '',
						fDebit_string: '',
						fCredit_string: '',
					});
				this.tableList.forEach((item,index) => {
					item.findex = index;
				});
			},
			deleteOneLine(row,index){
				if(row.findex == 0){
					this.$set(this.tableList[row.findex],'fNumber_account','');
					this.$set(this.tableList[row.findex],'fDebit_string','');
					this.$set(this.tableList[row.findex],'fCredit_string','');
				}else{
					this.$set(this.tableList[row.findex],'fExplanation','');
					this.$set(this.tableList[row.findex],'fNumber_account','');
					this.$set(this.tableList[row.findex],'fDebit_string','');
					this.$set(this.tableList[row.findex],'fCredit_string','');
					
				}
				
			},
			
			
			showAddDialog() {
				this.innerVisible1 = true;
			},
			handleClick1(tab, event) {
				console.log(tab.name);
				this.tag = tab.name;
				this.getProofTAccounts(tab.name)
			},
			close() {
			
				this.innerVisible = false;
			},
			hideDialog() {
				this.innerVisible1 = false;
			},
			hideDialog2() {
				this.innerVisible2 = false;
			},
			modify(data) {
				this.innerVisible2 = true;
				this.form3 = JSON.parse(JSON.stringify(data))
			},
			remove(node, data) {
				this.$confirm('确认删除此科目?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"fbrno": data.fbrno,
						"faccountid": data.faccountid,
					};
					this.axios.post('/perTaxToolTwo/e9/taccount/removeProofAccount', params)
						.then(res => {
							if (res.data.code == 200) {
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
								this.getProofTAccounts(this.tag);
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
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			
			},
			
			commitModifyChild() {
				this.$refs['form1'].validate((valid) => {
					if (valid) {
						let params = {
							"fgroupid": this.form3.fgroupid,
							"fdc": this.form3.fdc,
							"fnumber": this.form3.fnumber,
							"fname": this.form3.fname,
							"fbrno": this.fBrNo,
							"customerType": "0",
							"fearnaccountid": this.form3.fearnaccountid
						};
						this.axios.post('/perTaxToolTwo/e9/taccount/updateProofAccount', params)
							.then(res => {
								if (res.data.code == 200) {
									this.innerVisible2 = false;
									this.getProofTAccounts(this.tag);
			
			
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
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			
			commitAddChild() {
				this.$refs['form'].validate((valid) => {
					if (valid) {
						if (this.form2.fnumber.split(".").length == 1) {
							this.$message({
								message: "不能保存一级科目",
								type: "error"
							});
						} else {
							this.isUsedFAccountID()
						}
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			
			isUsedFAccountID() {
				let params = {
					"fBrNo": this.fBrNo,
					"fNumber": this.form2.fnumber,
				};
				this.axios.post('/perTaxToolTwo/e9/tvoucherentry/isUsedFAccountID', params)
					.then(res => {
						if (res.data.code == 200) {
			
							if (res.data.data == 1) {
								// this.$message({
								// 	type: 'warning',
								// 	message: '上级科目是明细科目，并已有业务发生，不能新建'
								// });
								this.$confirm('上级科目是明细科目，并已有业务发生，不能直接新建子科目!是否将上级科目业务转到新建立的科目上?', '提示', {
									confirmButtonText: '确定',
									cancelButtonText: '取消',
									type: 'warning'
								}).then(() => {
									this.createProofAccounts(2);
									// this.updateProofTVoucherEntrys();
								}).catch(() => {
									this.$message({
										type: 'info',
										message: '已取消'
									});
								});
							} else if (res.data.data == 0) {
								this.createProofAccounts(1);
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
			
			createProofAccounts(tag) {
				let params = {
					"fgroupid": this.form2.fgroupid,
					"fdc": this.form2.fdc,
					"fnumber": this.form2.fnumber,
					"fname": this.form2.fname,
					"fbrno": this.fBrNo,
					"customerType": "0",
					"fearnaccountid":this.form2.fearnaccountid
				};
				this.axios.post('/perTaxToolTwo/e9/taccount/createProofAccounts', params)
					.then(res => {
						if (res.data.code == 200) {
							this.innerVisible1 = false;
							if(tag == 2){
								this.updateProofTVoucherEntrys();
							}
							this.getProofTAccounts(this.tag);
							this.getProofTAccount_fName_All();
			
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
			
			getProofTAccount_fGroupID(val) {
				let params = {
					"fBrNo": this.fBrNo,
					"fNumber": val,
				};
				this.axios.post('/perTaxToolTwo/e9/taccount/getProofTAccount_fGroupID', params)
					.then(res => {
						if (res.data.code == 200) {
							if (res.data.data == undefined) {
								this.$message({
									message: '科目代码不合法，请重新填写',
									type: 'error'
								});
							} else {
								this.$set(this.form2, 'fgroupid', res.data.data.fgroupid);
								this.$set(this.form2, 'fdc', res.data.data.fdc);
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
			
			getProofTVouchers() {
				let params = {
					"fBrNo": this.fBrNo,
					"fVoucherID": this.fVoucherID,
					"insert_type": 0
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVouchers_fVoucherID', this.qs.stringify(params))
					.then(res => {
						if (res.data.code == 200) {
							this.tableList = res.data.data;
							this.tableList.forEach((item, index) => {
								item.findex = index;
								if(item.fDebit_string){
									item.fDebit_string = this.formatNum(item.fDebit_string);
								}
								if(item.fCredit_string){
									item.fCredit_string = this.formatNum(item.fCredit_string);
								}
								
							});
							if (this.tableList.length > 0) {
								this.detail = this.tableList[0]
							}
							// this.tableList.push({
							// 	"fExplanation": '合计'
							// });
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
			// closeitemResults(){
			// 	this.dialogVisible3 = false;
			// },
			handleCurrentChange(val) {
				this.currentPage = val;
			},
			handleCurrentChange2(val) {
				this.currentPage2= val;
			},
			
			handleCurrentChange1(val) {
				this.tableIndex = val - 1;
			},
			showDialog() {
				if (this.temList.length > 0) {
					this.dialogVisible1 = true;
				} else {
					this.$message({
						message: '暂无已填写凭证',
						type: 'warning'
					});
				}

			},
			hideDialog() {
				this.dialogVisible1 = false;
			},

			createProofTVouchers() {
				var arr = this.tableList.filter(item => item.fNumber_account == '' && (item.fDebit_string || item.fCredit_string));
				var temArr = [];
				if(arr.length > 0){
					arr.forEach(item => {
						temArr.push(item.findex + 1);
					})
					var  string = temArr.join(',');
					this.$message({
						message: '请确认第' + string + '条,如无科目请清空借贷方',
						type: 'error'
					});
				}else if(!this.tableList[0].fExplanation){
					this.$message({
						message: '第一行无摘要',
						type: 'error'
					});
				}else{
					
					
					var scheduleId = '';
					this.multipleSelection.forEach(item => {
						scheduleId += item.scheduleId + ',';
					})
					this.detailData.forEach(item => {
						scheduleId += item.scheduleId + ',';
					})
					scheduleId = scheduleId.substring(0, scheduleId.length - 1);  
					
					var tvoucherentry = [];
					console.log(this.fdebittotal_stringList);
					this.fdebittotal_string = 0;
					this.fcredittotal_string = 0;
					
					this.tableList.forEach(items => {
						if (items.fDebit_string && items.fNumber_account) {
							tvoucherentry.push({
								"fexplanation": items.fExplanation,
								"faccount": items.fNumber_account,
								"fdc": 1,
								"famount_string": items.fDebit_string.replace(/,/g, ''),
								"fentryerp":items.fEntryID
							})
						} else if (items.fCredit_string && items.fNumber_account) {
							tvoucherentry.push({
								"fexplanation": items.fExplanation,
								"faccount": items.fNumber_account,
								"fdc": 0,
								"famount_string": items.fCredit_string.replace(/,/g, ''),
								"fentryerp":items.fEntryID
							})
						}
					
					})
					if (this.sum2 == this.sum3 && tvoucherentry.length > 0) {
						let params = {
							"fbrno": this.fBrNo,
							"fvoucherid":this.fVoucherID,
							"fdebittotal_string": this.sum2.replace(/,/g, ''),
							"fcredittotal_string": this.sum3.replace(/,/g, ''),
							"fexplanation": this.detail.fExplanation,
							"fentrycount": tvoucherentry.length,
							"tvoucherentries": tvoucherentry,
							"fdate_temp": this.detail.fDate_string,
							"ftransdate_temp": this.detail.fDate_string,
							"fnumber": this.detail.fNumber_fBrNo,
							"fserialnum": this.detail.fSerialNum,
							scheduleId:scheduleId
						};
						this.axios.post('/perTaxToolTwo/e9/tVoucher/updateProofTVoucher', params)
							.then(res => {
								if (res.data.code == 200) {
									this.$router.push({ //核心语句
										path: '/financeCalculateCenter/tvoucherentryQuery', //跳转的路径
										query: { //路由传参时push和query搭配使用 ，作用时传递参数
											// id: row.mainId,
											
											// accountPeriod: row.accountPeriod,
											// customerName: row.customerName,
											scroll:this.$route.query.scroll,
											isfresh:1
										}
									})
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
						} else {
										// this.temList = [];
							this.$message({
								message: "提交数据为空或者借贷不平衡，无法保存",
								type: "error"
							});
						}
					}
				
			},
			reset() {
				this.arr = [];
				this.voucherInfo = {};
				this.totaltxt = '';
				this.temList = [];
				this.fdebittotal_stringList = [];
				this.fcredittotal_stringList = [];
				this.tableList = [];
				// this.uploadData = {
				// 	fYear: ''
				// };
				this.getProofTVoucher();
			},
			handleInput(row, index, label, event, tag) {
				if (tag != 'number') {
					this.$set(this.tableList[row.findex], label, event.currentTarget.innerText);
					// this.tableList[row.findex][label] = event.currentTarget.innerText
				} else {
					if(event.currentTarget.innerText == '='){
						if(label == 'fDebit_string' && parseFloat(this.sum2.replace(/,/g, '')) > parseFloat(this.sum3.replace(/,/g, '')) || label == 'fCredit_string' && parseFloat(this.sum3.replace(/,/g, '')) > parseFloat(this.sum2.replace(/,/g, ''))){
							this.$set(this.tableList[row.findex], label, '');
							event.currentTarget.innerText = '';
							// console.log(5,this.tableList);
							this.$message({
								message: "无法平衡",
								type: 'error'
							});
						}else{
							this.$set(this.tableList[row.findex], label, this.formatNum(this.changeTwoDecimal(Math.abs(this.sum2.replace(/,/g, '') - this.sum3.replace(/,/g, '')))))
						}
						
					}else if (isNaN(Number(event.currentTarget.innerText.replace(/,/g, '')))) {
						this.$set(this.tableList[row.findex], label, '');
						event.currentTarget.innerText = '';
						// console.log(5,this.tableList);
						this.$message({
							message: "请正确填写数字",
									type: 'error'
						});

					} else if (event.currentTarget.innerText == '' || parseFloat(event.currentTarget.innerText == 0)) {
						this.$set(this.tableList[row.findex], label, '')
					} else {
						console.log(this.tableList);
						console.log(row.findex);
						console.log(label);
						this.$set(this.tableList[row.findex], label, this.formatNum(this.changeTwoDecimal(event.currentTarget.innerText
							.replace(
								/,/g, ''))));
					}
					// if(label == 'famount_string1')
					// this.$set(this.tableList[index], label, this.formatNum(this.changeTwoDecimal(event.currentTarget.innerText.replace(
					// 	/,/g, ''))));
					// this.tableList[index][label] = this.formatNum(this.changeTwoDecimal(event.currentTarget.innerText.replace(/,/g, '')));
				}



			},
			
			cancelenter(event,row, index, label) {
				// if(event.currentTarget.innerText == '='){
				// 	console.log(Math.abs(this.sum2.replace(/,/g, '') - this.sum3.replace(/,/g, '')));
				// 	console.log(this.changeTwoDecimal(Math.abs(this.sum2.replace(/,/g, '') - this.sum3.replace(/,/g, ''))));
				// 	console.log(typeof(this.formatNum(this.changeTwoDecimal(Math.abs(this.sum2.replace(/,/g, '') - this.sum3.replace(/,/g, ''))))));
				// 	this.$set(this.tableList[row.findex], label, this.formatNum(this.changeTwoDecimal(Math.abs(this.sum2.replace(/,/g, '') - this.sum3.replace(/,/g, '')))))
				// }
				console.log(this.tableList);
				event.currentTarget.blur()
			},
			handleSelect(val, index,row) {
				// this.$set(this.tableList[index],'fNumber_account',val);
				this.$set(this.tableList[row.findex],'fNumber_account',val);
				// this.tableList[index]['faccount'] = val;
			},

			/*将数字后面加两个小数，如果为整数，则加.00,如果为.1，则改为.10*/
			changeTwoDecimal(x) {
				var f_x = Math.round(x * 100) / 100;
				var s_x = f_x.toString();
				var pos_decimal = s_x.indexOf('.');
				if (pos_decimal < 0) {
					pos_decimal = s_x.length;
					s_x += '.';
				}
				while (s_x.length <= pos_decimal + 2) {
					s_x += '0';
				}
				return s_x;
			},

			/*格式化数字：给数字加上，*/
			formatNum(s) {
				var n = 2;
				n = n > 0 && n <= 20 ? n : 2;
				s = parseFloat((s + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
				var l = s.split(".")[0].split("").reverse(),
					r = s.split(".")[1];
				var t = "";
				for (var i = 0; i < l.length; i++) {
					t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? "," : "");
				}
				return t.split("").reverse().join("") + "." + r;

			},
			//所有会计科目
			getProofTAccount_fName_All() {
				let params = {
					"fBrNo": this.fBrNo
				};
				this.axios.post('/perTaxToolTwo/e9/taccount/getProofTAccount_fName_All', this.qs.stringify(params), {
						// this.axios.post('/miaoxing/queryPage', params)
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					.then(res => {
						if (res.data.code == 200) {
							this.fNameList = res.data.data;


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
			getProofTVoucher() {
				let params = {
					"fBrNo": this.fBrNo
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVoucher', this.qs.stringify(params), {
						// this.axios.post('/miaoxing/queryPage', params)
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					.then(res => {
						if (res.data.code == 200) {
							this.voucherInfo = res.data.data;
							// this.uploadData.fYear = this.voucherInfo.ftransdate_temp;

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
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			getScheduleByAccountantId(){
				let param = {
					"accountantId": this.fVoucherID,
					"customerName": this.fBrNo,
					"accountPeriod": this.year + '-' + (this.month>=10?this.month:'0' + this.month),
					"isValid": 1
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/getScheduleByAccountantId', param).then(res => {
					if (res.data.code == 200) {
						this.detailData = res.data.data;
						// if(this.detailData.length > 0){
						// 	this.isShow = true;
						// }else{
						// 	this.isShow = false;
						// 	this.getScheduleByAccountantId1()
						// }
						
					
				
				
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
			
			getScheduleByAccountantId1(){
				let param = {
					"accountantId": 0,
					"customerName": this.fBrNo,
					"accountPeriod": this.year + '-' + (this.month>=10?this.month:'0' + this.month),
					"isValid": 1
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/getScheduleByAccountantId', param).then(res => {
					if (res.data.code == 200) {
						this.detailData1 = res.data.data;
						
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				
				}).catch(function(err) {
					this.$message({
						message: '获取失败',
						type: 'error'
					});
				})
			},
			
			getfName(row,index){
				this.innerVisible = true;
				this.activeName2 = "1";
				this.getProofTAccounts("1")
			},
			
			getProofTAccounts(index) {
				this.loading = true;
				let params = {
					"id": index,
					"fBrNo": this.fBrNo,
					// "fBrNo": "滴滴出行科技有限公司"
				};
				this.axios.post('/perTaxToolTwo/e9/taccount/getProofTAccounts', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tree = res.data.data;
							this.treeList = [];
			
							this.tree.forEach((item, index) => {
								item.full = item.fnumber + '-' + item.fname
								// if (item.fparentid == 0) {
								// 	this.treeList.push(item);
			
								// }
							});
							this.generateTree(this.tree);
							// this.treeList = JSON.parse(JSON.stringify(this.treeList));
							// console.log(this.treeList)
							// this.treeList.forEach((item, index) => {
							// 	item.children = [];
							// 	this.tree.forEach((item2, index2) => {
							// 		if (item2.fparentid == item.frootid) {
							// 			item.children.push(item2);
			
							// 		}
							// 	})
							// });
			
			
							console.log(this.treeList)
			
						} else {
							this.loading = false;
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
			
			getChildren(data) {
				return function(item) {
					const arr = []
					data.forEach((value) => {
						if (value.fparentid == item.faccountid) {
							arr.push(value);
						}
					});
					return arr;
				}
			},
			
			generateTree(data) {
				this.treeList = [];
				data.map((item) => {
					const list = this.getChildren(data)(item);
					if (list.length > 0) {
						item['children'] = list;
					}
					if (item.fparentid == 0) {
						this.treeList.push(item);
					}
			
			
				})
				return this.treeList;
			},
			
			showDetail(row, event, column) {
				this.$refs.refTable.toggleRowExpansion(row);
				this.$refs.multipleTable.toggleRowExpansion(row);
				this.row = JSON.parse(JSON.stringify(row));
				this.tag = 0;
				this.modelUrl = row.modelUrl;
				this.form = row.detailResults;
				this.scheduleId = row.scheduleId;
				this.scheduleType = row.type;
				this.picData.scheduleId = row.scheduleId;
				this.picData.imageUrl = row.imageUrl;
				this.picData.mainId = row.mainId;
				this.images = [{
					url: row.imageUrl
				}];
			},
			expandChange(row, expandedRows) {
				var that = this
				if (expandedRows.length) {
					that.expands = []
					if (row) {
						that.expands.push(row.scheduleId);
			
						// this.$refs.refTable.toggleRowExpansion(row)
						// this.row = JSON.parse(JSON.stringify(row));
						
						this.modelUrl = row.modelUrl;
						this.form = row.detailResults;
						this.scheduleId = row.scheduleId;
						this.scheduleType = row.type;
						this.picData.scheduleId = row.scheduleId;
						this.picData.imageUrl = row.imageUrl;
						this.picData.mainId = row.mainId;
						this.images = [{
							url: row.imageUrl
						}];
					}
				} else {
					that.expands = []
				}
			
			
			},
			
			handleClick(tab, event) {
			
			},
			
			getSummaries(param) {
				const {
					columns,
					data
				} = param;
				const sums = [];
				let vm = this;
				columns.forEach((column, index) => {
					if (index === 0) {
						sums[index] = '合计';
						return;
					}
					
					if (index === 1) {
						sums[index] = this.dxhz;
						return;
					}
					
					if (index === 2 || index === 3) {
						console.log(this.tableList);
						console.log(column.property);
						const values = this.tableList.map(item => item[column.property]?item[column.property].replace(/,/g, ''):'');
						// const values = this.tableList.map(item => item[column.property].replace(/,/g, ''));
						console.log(values);
						var a = 0;
						values.forEach(item => {
							var n = Number(item);
							if(!isNaN(n)){
								console.log(n);
								a = parseFloat(a) + parseFloat(n);
								console.log('a',a);
								a = parseFloat(a).toFixed(2);
								console.log('a1',a);
								console.log('--',a)
							}else{
								a = parseFloat(a).toFixed(2);
								console.log('**',a)
							}
							
						})
						sums[index] = a;
						
						
						// sums[index] = values.reduce((prev, curr) => {
						// 	var n = Number(curr)
						// 	console.log(prev,typeof(prev));
						// 	if (!isNaN(n)) { //数字
						// 		return prev + n;
						// 	}else{
						// 		return prev;
						// 	}  
							
							
						// }, 0);
						sums[index] = this.formatNum(sums[index]);
						this.sum2 = sums[2];
						this.sum3 = sums[3];
						if(index === 2){
							let params = {
								"cou": sums[2].replace(/,/g, '')
							};
							this.axios.post('/perTaxToolTwo/e9/tVoucher/proofTVouchers_convert', this.qs.stringify(params), {
									// this.axios.post('/miaoxing/queryPage', params)
									headers: {
										"Content-Type": "application/x-www-form-urlencoded"
									}
								})
								.then(res => {
									if (res.data.code == 200) {
										this.dxhz = res.data.data;
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
						return;
					}
					
				});
				console.log(sums)
				return sums;
			}
		},
		computed: {
			accountNumber:function(){
				var num = 0;
				this.tableList.forEach((data, index) => {
					if(data.fNumber_account){
						num++
					}
				})
				return num;
			},
			tableTotal:function(){
				return Math.ceil(this.tableList.length/6)
			},
			tableListNew: function() {
				console.log(this.tableList);
				var arr = [];
				arr = this.tableList.filter((data, index) => {
					return Math.floor(index / 6) == this.tableIndex
				})
				console.log(arr)
				return arr;
			},
			// famount_string1Total: function() {
			// 	let total = 0;
			// 	this.tableList.forEach(function(item) {
			// 		if (item.fDebit_string) {
			// 			total += parseFloat(item.fDebit_string.replace(/,/g, ''))
			// 		}

			// 	})
			// 	return this.formatNum(this.changeTwoDecimal(total))
			// },
			famount_string2Total: function() {
				let total = 0;
				this.tableList.forEach(function(item) {
					if (item.fCredit_string) {
						total += parseFloat(item.fCredit_string.replace(/,/g, ''))
					} else {

					}

				})
				return this.formatNum(this.changeTwoDecimal(total))
			}
		},
		watch: {
			'$route'(to, from) {
				// init data
				if (to.name == 'voucherModify') {
					this.multipleSelection = [];
					this.fBrNo = this.$route.query.fBrNo;
					this.fVoucherID = this.$route.query.fVoucherID;
					this.year = this.$route.query.year;
					this.month = this.$route.query.month;
					this.getScheduleByAccountantId();
					this.getScheduleByAccountantId1();
					this.getProofTVouchers();
					this.getProofTAccount_fName_All();
					this.$nextTick( () => {
							this.$refs.multipleTable.clearSelection();
					})
				}

			},
			filterText1(val) {
				this.$refs['tree' + this.tag].filter(val);
			},
			filterText2(val) {
				this.$refs['tree' + this.tag].filter(val);
			},
			filterText3(val) {
				this.$refs['tree' + this.tag].filter(val);
			},
			filterText4(val) {
				this.$refs['tree' + this.tag].filter(val);
			},
			filterText5(val) {
				this.$refs['tree' + this.tag].filter(val);
			},
			// "uploadData.fYear": {
			// 	handler(val, oldVal) {
			// 		let params = {
			// 			year: val.slice(0, 4),
			// 			month: val.slice(5, 7),
			// 			fBrNo: this.fBrNo
			// 		};
			// 		this.axios.post('/perTaxToolTwo/e9/tVoucher/getPeriod', this.qs.stringify(params), {
							
			// 				headers: {
			// 					"Content-Type": "application/x-www-form-urlencoded"
			// 				}
			// 			})
			// 			.then(res => {
			// 				if (res.data.code == 200) {
			// 					this.voucherInfo.fnumber = res.data.data.fNumber_fBrNo;

			// 				} else {
			// 					let type;
			// 					if (res.data.code == 0) {
			// 						type = "warning";
			// 					} else if (res.data.code == 500) {
			// 						type = "error";
			// 					}
			// 					this.$message({
			// 						message: res.data.msg,
			// 						type: type
			// 					});
			// 				}
			// 			})
			// 			.catch(err => {
			// 				this.$message({
			// 					message: "系统繁忙，请稍后重试",
			// 					type: "error"
			// 				});
			// 			});
			// 	},
			// 	deep: true
			// },
			famount_string1Total(val) {
				let params = {
					"cou": val.replace(/,/g, '')
				};
				this.axios.post('/perTaxToolTwo/e9/tVoucher/proofTVouchers_convert', this.qs.stringify(params), {
						// this.axios.post('/miaoxing/queryPage', params)
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					.then(res => {
						if (res.data.code == 200) {
							this.totaltxt = res.data.data;

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
		created() {
			this.fBrNo = this.$route.query.fBrNo;
			this.fVoucherID = this.$route.query.fVoucherID;
			this.year = this.$route.query.year;
			this.month = this.$route.query.month;
			this.mtype = this.$route.query.type;
			this.getScheduleByAccountantId();
			this.getScheduleByAccountantId1();
			this.getProofTVouchers();
			this.getProofTAccount_fName_All()
		}
	}
</script>

<style scoped lang="less">
	.moimg{
		width: 100%;
		height: 600px;
	}
	/deep/ .el-table__footer-wrapper{
		margin-top: 0px;
	}
	
	/deep/ .el-tree {
		height: 300px;
		overflow-y: scroll;
	}
	/deep/ .el-tree-node>.el-tree-node__children {
	    overflow: unset;
	}
	
	.search_contain {
		background: #fff;
		height: 40px;
		padding-left: 20px;
		padding-top: 12px;
		margin-bottom: 20px;

		.info {
			height: 40px;
			line-height: 40px;
		}

		a {
			margin-left: 10px;
		}
	}

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



	.contain_body {
		padding: 0rem;
		height: 100%;
		box-sizing: border-box;

		// background: #fff;
		// .el-tabs {
		// 	height: 100%;
		// }

		h2 {
			font-size: 24px;
			color: royalblue;
			text-align: center;
			height: 40px;
			line-height: 40px;

			span {
				float: right;
				font-size: 12px;
				color: #999;
				font-style: italic
			}
		}

		h4 {
			font-size: 14px;
			font-style: italic;
			color: royalblue;
			text-align: center;
			height: 20px;
			line-height: 20px;
			margin-bottom: 4px;
		}

		.line {
			height: 1px;
			background: royalblue;
			width: 200px;
			// margin-bottom: 4px;
			margin: 4px auto;
		}
	}

	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
	}

	/deep/ .el-table {
		border-color: royalblue
	}

	/deep/ .el-table:before,
	/deep/ .el-table:after {
		background-color: royalblue
	}

	/deep/ .el-table__header {
		border-right-color: royalblue;
	}

	/deep/ .el-table__header tr,
	/deep/ .el-table__header th {
		padding: 0;
		height: 40px;
		color: royalblue;
		border-right-color: royalblue;
		border-bottom-color: royalblue
	}

	/deep/ .el-table__body tr,
	.el-table__body td {
		padding: 0;
		height: 40px;
	}

	/deep/ .el-table td {
		padding: 6px 0;
		border-right-color: royalblue;
		border-bottom-color: royalblue;
		background-color: #efefef
	}

	/deep/ .el-table th {
		background-color: #efefef;
	}

	/deep/.el-table thead.is-group th {
		background-color: #efefef;
	}

	/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {

		background: #fff;
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
		cursor: pointer
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
		cursor: pointer
	}
</style>
