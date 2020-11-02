<template>
	<div class="main_contain">
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="单位名称" prop="fBrNo" :rules="[$rules.requiredSelect]">
						<el-select v-model="uploadData.fBrNo" placeholder="请选择单位名称" clearable filterable @change='search'>
							<el-option v-for="item in periodCustList" :label="item.customerName" :value='item.customerName'></el-option>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option> -->

						</el-select>
					</el-form-item>
					<el-form-item label="业务日期" prop="dossierName">
						<el-date-picker v-model="uploadData.fYear" type="date" placeholder="请选择" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
						</el-date-picker>


					</el-form-item>
					<el-form-item label="日期" prop="dossierName">
						<el-date-picker v-model="uploadData.fYear" type="date" placeholder="请选择" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
						</el-date-picker>


					</el-form-item>
					<!-- <el-button type="primary" @click='query()' size="mini">查询</el-button> -->
				</el-form>
			</div>
		</div>
		<div class="contain_body">
			<el-table :data="detail" style="width:calc(100% - 40px);margin-top:20px;margin-bottom: 20px;" border v-loading='loading1'
			 @row-click='showDetail' ref='refTable' @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands"
			 @selection-change="handleSelectionChange">
				<el-table-column type="expand">
					<template slot-scope="props">
						<div class='clearfix'>
							<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
								<h3>发票详情</h3>
								<div style="margin-top: 12px;">

									<img :src="images[0].url" alt="" class="moimg">
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
				<el-table-column align="center" type="selection" width="55">
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

				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<!-- <el-tooltip class="item" effect="dark" :content="scope.row.remark2" placement="top" v-show='scope.row.remark2 != null && scope.row.remark2 != ""'>
							<i class="el-icon-warning"></i>
						</el-tooltip> -->

						<el-button size="mini" type="text" @click.stop="showconnectMain1(scope.$index, scope.row)" v-show="scope.row.isMaster.length > 0">查看清单</el-button>

					</template>
				</el-table-column>
			</el-table>
			<div style="background-color: #fff;padding: 20px 50px 20px 20px;position: relative;">
				<h2>记账凭证</h2>
				<div class='line'></div>
				<div class='line'></div>
				<!-- <span>{{disName}}</span> -->

				<h4>

					<span style="float: right;">凭证字号：记- <el-input v-model="voucherInfo.fnumber" size="mini" style="width:50px"></el-input></span><span style="float: right;margin-right: 20px;">序列号：{{voucherInfo.fserialnum}}</span><span
					 style="float: right;margin-right: 20px;">{{uploadData.fYear.slice(0,4)}}年{{uploadData.fYear.slice(5,7)}}期</span><span style="float: right;margin-right: 20px;">{{fBrNo}}</span>
				</h4>
				<el-table :data="tableListNew" style="width: 100%" show-summary :summary-method="getSummaries">
					<el-table-column align="center" label="摘要" width="450">
						<template slot-scope="scope">
							<div style="min-height: 20px;" contenteditable="true" v-text="scope.row.fexplanation" @blur='handleInput(scope.row,scope.$index, "fexplanation",$event)'></div>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="faccount" label="会计科目">
						<el-table-column align="center" label="一级科目_明细科目" prop="faccount" show-overflow-tooltip width="450">
							<template slot-scope="scope">
								
								<el-select size="mini" v-model="scope.row.faccount" :disabled="!tableList[0].fexplanation"
								  clearable filterable @change="((val,index)=>{handleSelect(val,scope.$index,scope.row)})">
									<el-option  v-show='item.fdetail == 1' v-for="item in fNameList" :label="item.fnumber + '-' + item.ffullname" :value="item.fnumber + '-' + item.ffullname"></el-option>
								</el-select>
								<!-- <div style="min-height: 20px;" v-text="scope.row.faccount" @click="((index)=>{showDialog1(scope.row,scope.$index)})">
								</div> -->

							</template>
						</el-table-column>
					</el-table-column>

					<el-table-column align="center" label="借方" prop="famount_string1">
						<template slot-scope="scope">
							<div style="min-height: 20px;" :contenteditable="scope.row.famount_string2 == '' && scope.row.faccount != ''" v-text="scope.row.famount_string1"
							 @blur='handleInput(scope.row,scope.$index, "famount_string1",$event,"number")' @keydown.enter="cancelenter($event,scope.row,scope.$index, 'famount_string1')"></div>
						</template>
					</el-table-column>
					<el-table-column align="center" label="贷方" prop="famount_string2">
						<template slot-scope="scope">
							<div style="min-height: 20px;" :contenteditable="scope.row.famount_string1 == '' && scope.row.faccount != ''" v-text="scope.row.famount_string2"
							 @blur='handleInput(scope.row,scope.$index, "famount_string2",$event,"number")' @keydown.enter="cancelenter($event,scope.row,scope.$index, 'famount_string2')"></div>
						</template>
					</el-table-column>
					<el-table-column align="center" label=" " width="140">
						<template slot-scope="scope">
							<el-button type="text" size="mini" @click='deleteOneline(scope.row,scope.$index)'>清空</el-button>
							<el-button type="text" size="mini" v-show='scope.$index == 0' @click='showDialog1(scope.row,scope.$index)'>查看科目</el-button>
						</template>
					</el-table-column>

				</el-table>
				<el-pagination background @current-change="((val)=>{handleCurrentChange1(val)})" :current-page="tableIndex+1"
				 :page-size="1" layout=" prev, pager, next" :total="tableTotal" style="text-align: center;">
				</el-pagination>
				<div class='btn_contain clearfix'>
					<span class='commit' @click="saveProofTVouchers">填写下一张</span>
					<span class='close' @click="createProofTVouchers">提交</span>
				</div>
			</div>


		</div>

		<el-dialog title="查看" :visible.sync="dialogVisible1" width="1000px" class='dialog'>
			<div v-for='(item,index) in temList'>
				<el-button type="primary" size="mini" style="margin-bottom: 10px;" @click='deleteOnePage(index)' v-show='current == index'>删除本张</el-button>
				<el-button type="primary" size="mini" style="margin-bottom: 10px;margin-left: 10px;" @click='deleteAll(index)'
				 v-show='current == index'>删除全部</el-button>
				<el-table :data="item" style="width: 100%" stripe border v-show='current == index'>
					<el-table-column align="center" label="摘要" width="350">
						<template slot-scope="scope">
							<div v-text="scope.row.fexplanation"></div>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="faccount" label="会计科目">
						<el-table-column align="center" label="一级科目_明细科目" prop="faccount" show-overflow-tooltip width="350">

						</el-table-column>
					</el-table-column>
					<el-table-column align="center" label="借方" prop="famount_string1">

					</el-table-column>
					<el-table-column align="center" label="贷方" prop="famount_string2">

					</el-table-column>
					<el-table-column align="center" label=" ">
						<template slot-scope="scope">
							<el-button type="text" size="mini" @click='deleteOneline(scope.row,scope.$index,index)'>清空</el-button>
						</template>
					</el-table-column>
				</el-table>

			</div>
			<el-pagination background @current-change="((val)=>{handleCurrentChange(val)})" :current-page="currentPage"
			 :page-size="1" layout="total, prev, pager, next" :total="temList.length">
			</el-pagination>
		</el-dialog>

		<el-dialog width="600px" title="会计科目" :visible.sync="innerVisible" append-to-body :show-close='false' :close-on-press-escape='false' :close-on-click-modal='false'>
			<el-button size="small" @click='showAddDialog' style="margin-bottom: 4px;">新增</el-button>
			<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
				<el-tab-pane label="1、资产" name="1">
					<el-input placeholder="输入关键字进行过滤" v-model="filterText1" size="mini">
					</el-input>
					<el-tree v-loading='loading' :data="treeList" :props="props" show-checkbox node-key="fnumber" :check-strictly="true"
					 ref="tree1" :render-content="renderContent" @check-change="orgCheckChange" :filter-node-method="filterNode">
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="2、负债" name="2">
					<el-input placeholder="输入关键字进行过滤" v-model="filterText2" size="mini">
					</el-input>
					<el-tree v-loading='loading' :data="treeList" :props="props" show-checkbox node-key="fnumber" :check-strictly="true"
					 ref='tree2' :render-content="renderContent" @check-change="orgCheckChange" :filter-node-method="filterNode">
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="3、权益" name="3">
					<el-input placeholder="输入关键字进行过滤" v-model="filterText3" size="mini">
					</el-input>
					<el-tree v-loading='loading' :data="treeList" :props="props" show-checkbox node-key="fnumber" :check-strictly="true"
					 ref='tree3' :render-content="renderContent" @check-change="orgCheckChange" :filter-node-method="filterNode">
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="4、成本" name="4">
					<el-input placeholder="输入关键字进行过滤" v-model="filterText4" size="mini">
					</el-input>
					<el-tree v-loading='loading' :data="treeList" :props="props" show-checkbox node-key="fnumber" :check-strictly="true"
					 ref='tree4' :render-content="renderContent" @check-change="orgCheckChange" :filter-node-method="filterNode">
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="5、损益" name="5">
					<el-input placeholder="输入关键字进行过滤" v-model="filterText5" size="mini">
					</el-input>
					<el-tree v-loading='loading' :data="treeList" :props="props" show-checkbox node-key="fnumber" :check-strictly="true"
					 ref='tree5' :render-content="renderContent" @check-change="orgCheckChange" :filter-node-method="filterNode">
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
	export default {
		name: "customer",
		data() {
			return {
				periodCustList:[],
				tableIndex: 0,
				tableTotal: 1,
				// currentTable:1,
				multipleSelection: [],
				modelUrl: '',
				scheduleId: "",
				scheduleType: '',
				picData: {
					scheduleType: 1,
					scheduleId: '',
					imageUrl: ''
				},

				images: [],
				form: {},
				detail: [],
				getRowKeys(row) {
					return row.scheduleId
				},
				expands: [],
				filterText: '',
				loading: false,
				currentPage: 1,
				dialogVisible1: false,
				fBrNo: "",
				// fBrNo: "滴滴出行科技有限公司",
				arr: [],
				fNameList: [],
				voucherInfo: {},
				totaltxt: '',
				disName:'',
				tableList: [{
						findex: 0,
						fexplanation: '',
						faccount: '',
						famount_string1: '',
						famount_string2: '',
					},
					{
						findex: 1,
						fexplanation: '',
						faccount: '',
						famount_string1: '',
						famount_string2: '',
					},
					{
						findex: 2,
						fexplanation: '',
						faccount: '',
						famount_string1: '',
						famount_string2: '',
					},
					{
						findex: 3,
						fexplanation: '',
						faccount: '',
						famount_string1: '',
						famount_string2: '',
					},
					{
						findex: 4,
						fexplanation: '',
						faccount: '',
						famount_string1: '',
						famount_string2: '',
					},
					{
						findex: 5,
						fexplanation: '',
						faccount: '',
						famount_string1: '',
						famount_string2: '',
					},
				],
				uploadData: {
					fYear: '',
					fBrNo: ''
				},
				uploadData1: {
					fBrNo: ''
				},
				loading1: false,
				temList: [],
				current: 0,
				fdebittotal_stringList: [],
				fcredittotal_stringList: [],

				innerVisible: false,
				tree: [],
				treeList: [],
				activeName2: "1",
				props: {
					label: 'full',
					children: 'children'
				},
				tag: 1,
				index: 0,
				selectOrg: {
					orgsid: []
				},
				sum2:0,
				sum3:0,
				filterText1: '',
				filterText2: '',
				filterText3: '',
				filterText4: '',
				filterText5: '',
				multiSelection: [],
				innerVisible1: false,
				innerVisible2: false,
				form2: {
					fearnaccountid:'0'
				},
				form3: {
					fearnaccountid:'0'
				},
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
				dxhz:''

			}
		},
		components: {
			// PlanDialog
		},
		methods: {
			deleteOneline(row, rowindex, index) {
				this.$set(this.tableList[row.findex], 'fexplanation', '');
				this.$set(this.tableList[row.findex], 'faccount', '');
				this.$set(this.tableList[row.findex], 'famount_string1', '');
				this.$set(this.tableList[row.findex], 'famount_string2', '');
				row.fexplanation = '';
				row.faccount = '';
				row.famount_string1 = '';
				row.famount_string2 = '';
			},
			deleteOnePage(index) {
				this.temList.splice(index, 1)
			},
			deleteAll() {
				this.temList = [];
			},
			filterNode(value, data) {
				if (!value) return true;
				return data.full.indexOf(value) !== -1;
			},
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
					// check-change 
					// 节点选中状态发生变化时的回调   
					// 共三个参数，依次为：传递给 data 属性的数组中该节点所对应的对象、节点本身是否被选中、节点的子树中是否有被选中的节点
					orgCheckChange(data, checked, indeterminate) {
						console.log(data, '数据')
						console.log(checked, '选中状态')
						console.log(indeterminate, '子树中选中状态')
						// 获取当前选择的id在数组中的索引
						const indexs = this.selectOrg.orgsid.indexOf(data.fnumber)
						// 如果不存在数组中，并且数组中已经有一个id并且checked为true的时候，代表不能再次选择。
						if (indexs < 0 && this.selectOrg.orgsid.length === 1 && checked) {
							console.log('only one')
							this.$message({
								message: '只能选择一个！',
								type: 'error',
								showClose: true
							})
							// 设置已选择的节点为false 很重要
							this.$refs['tree' + this.tag].setChecked(data, false)
						} else if (this.selectOrg.orgsid.length === 0 && checked) {
							// 发现数组为空 并且是已选择
							// 防止数组有值，首先清空，再push
							this.selectOrg.orgsid = []
							this.selectOrg.orgsid.push(data.fnumber)
						} else if (
							indexs >= 0 &&
							this.selectOrg.orgsid.length === 1 &&
							!checked
						) {
							// 再次直接进行赋值为空操作
							this.selectOrg.orgsid = []
						}
					},
					showDialog1(row,index) {
						if(this.fBrNo){
							this.index = row.findex;
							this.innerVisible = true;
							this.activeName2 = "1";
							this.tag = 1;
							this.getProofTAccounts("1")
						}
						
					},

					handleClick(tab, event) {
						this.tag = tab.name;
						this.getProofTAccounts(tab.name)
					},

					commit() {
						this.$set(this.tableList[this.index], 'faccount', this.$refs['tree' + this.tag].getCheckedNodes()[0].fnumber +
								'-' + this.$refs['tree' + this.tag].getCheckedNodes()[0].fname)
						this.$set(this.tableList[this.index], 'faccountFull', this.$refs['tree' + this.tag].getCheckedNodes()[0].fnumber +
							'-' + this.$refs['tree' + this.tag].getCheckedNodes()[0].fname)

						this.selectOrg.orgsid = [];
						this.$refs.tree1.setCheckedKeys([]);
						this.$refs.tree2.setCheckedKeys([]);
						this.$refs.tree3.setCheckedKeys([]);
						this.$refs.tree4.setCheckedKeys([]);
						this.$refs.tree5.setCheckedKeys([]);
						this.innerVisible = false;
					},

					close() {

						this.selectOrg.orgsid = [];
						this.$refs.tree1.setCheckedKeys([]);
						this.$refs.tree2.setCheckedKeys([]);
						this.$refs.tree3.setCheckedKeys([]);
						this.$refs.tree4.setCheckedKeys([]);
						this.$refs.tree5.setCheckedKeys([]);
						this.innerVisible = false;
						this.getProofTAccount_fName_All();
					},

					getProofTAccounts(index) {
						this.loading = true;
						let params = {
							"id": index,
							"fBrNo": this.uploadData.fBrNo,
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

					handleCurrentChange(val) {
						this.current = val - 1;
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
						this.innerVisible1 = false;
					},
					hideDialog2() {
						this.innerVisible2 = false;
					},
					search(val) {
						this.fBrNo = this.uploadData.fBrNo;
						this.getProofTVoucher();
						this.getProofTAccount_fName_All();
					},
					saveProofTVouchers() {
						this.tableIndex++;
						this.tableTotal++;
						this.tableList = this.tableList.concat([{
								findex: (this.tableTotal - 1) * 6,
								fexplanation: '',
								faccount: '',
								famount_string1: '',
								famount_string2: '',
							},
							{
								findex: (this.tableTotal - 1) * 6 + 1,
								fexplanation: '',
								faccount: '',
								famount_string1: '',
								famount_string2: '',
							},
							{
								findex: (this.tableTotal - 1) * 6 + 2,
								fexplanation: '',
								faccount: '',
								famount_string1: '',
								famount_string2: '',
							},
							{
								findex: (this.tableTotal - 1) * 6 + 3,
								fexplanation: '',
								faccount: '',
								famount_string1: '',
								famount_string2: '',
							},
							{
								findex: (this.tableTotal - 1) * 6 + 4,
								fexplanation: '',
								faccount: '',
								famount_string1: '',
								famount_string2: '',
							},
							{
								findex: (this.tableTotal - 1) * 6 + 5,
								fexplanation: '',
								faccount: '',
								famount_string1: '',
								famount_string2: '',
							},
						]);
					},
					handleSelectionChange(val) {
						this.multipleSelection = val;
					},
					createProofTVouchers() {
						// this.saveProofTVouchers();
						if (!this.tableList[0].fexplanation || !this.tableList[0].faccount) {
							this.$message({
								message: "第一行无摘要或无科目",
								type: "error"
							});
						} else {

							var scheduleId = '';
							this.multipleSelection.forEach(item => {
								scheduleId += item.scheduleId + ',';
							})
							scheduleId = scheduleId.substring(0, scheduleId.length - 1); 

							var tvoucherentry = [];
							// console.log(this.fdebittotal_stringList);
							this.fdebittotal_string = 0;
							this.fcredittotal_string = 0;
							this.fdebittotal_stringList.forEach(item => {
								this.fdebittotal_string += parseFloat(item);
							})
							// console.log(this.fdebittotal_string);

							this.fcredittotal_stringList.forEach(item => {
								this.fcredittotal_string += parseFloat(item);
							})
							// console.log(this.fcredittotal_string);
							// console.log('temList', this.temList);


							this.tableList.forEach(items => {
								
									if (items.famount_string1) {
										tvoucherentry.push({
											"fexplanation": items.fexplanation,
											"faccount": items.faccount,
											"fdc": 1,
											"famount_string": items.famount_string1.replace(/,/g, ''),
										})
									} else if (items.famount_string2) {
										tvoucherentry.push({
											"fexplanation": items.fexplanation,
											"faccount": items.faccount,
											"fdc": 0,
											"famount_string": items.famount_string2.replace(/,/g, ''),
										})
									}

							})

							if (this.sum2 == this.sum3 && tvoucherentry.length > 0) {
								let params = {
									"fbrno": this.fBrNo,
									"fdebittotal_string": this.sum2.replace(/,/g, ''),
									"fcredittotal_string": this.sum3.replace(/,/g, ''),
									"fexplanation": this.tableList[0].fexplanation,
									"fentrycount": tvoucherentry.length,
									"tvoucherentries": tvoucherentry,
									"fdate_temp": this.uploadData.fYear,
									"ftransdate_temp": this.uploadData.fYear,
									"fnumber": this.voucherInfo.fnumber,
									"fserialnum": this.voucherInfo.fserialnum,
									"scheduleId": scheduleId
								};
								this.axios.post('/perTaxToolTwo/e9/tVoucher/createProofTVouchers', params)
									.then(res => {
										if (res.data.code == 200) {
											this.reset();
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
						this.tableTotal = 1;
						this.tableIndex = 0;
						this.temList = [];
						this.fdebittotal_stringList = [];
						this.fcredittotal_stringList = [];
						this.tableList = [{
								findex: 0,
								fexplanation: '',
								faccount: '',
								famount_string1: '',
								famount_string2: '',
							},
							{
								findex: 1,
								fexplanation: '',
								faccount: '',
								famount_string1: '',
								famount_string2: '',
							},
							{
								findex: 2,
								fexplanation: '',
								faccount: '',
								famount_string1: '',
								famount_string2: '',
							},
							{
								findex: 3,
								fexplanation: '',
								faccount: '',
								famount_string1: '',
								famount_string2: '',
							},
							{
								findex: 4,
								fexplanation: '',
								faccount: '',
								famount_string1: '',
								famount_string2: '',
							},
							{
								findex: 5,
								fexplanation: '',
								faccount: '',
								famount_string1: '',
								famount_string2: '',
							},
						];
						this.getProofTVoucher();
						this.getDocumentDetail4();
					},
					handleInput(row, index, label, event, tag) {
						if (tag != 'number') {
							this.$set(this.tableList[row.findex], label, event.currentTarget.innerText);
						} else {

							if(event.currentTarget.innerText == '='){
								if(label == 'famount_string1' && parseFloat(this.sum2.replace(/,/g, '')) > parseFloat(this.sum3.replace(/,/g, '')) || label == 'famount_string2' && parseFloat(this.sum3.replace(/,/g, '')) > parseFloat(this.sum2.replace(/,/g, ''))){
									this.$set(this.tableList[row.findex], label, '');
									event.currentTarget.innerText = '';
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
								this.$message({
									message: "请正确填写数字",
									type: 'error'
								});

							} else if (event.currentTarget.innerText == '' || parseFloat(event.currentTarget.innerText == 0)) {
								this.$set(this.tableList[row.findex], label, '')
							} else {
								this.$set(this.tableList[row.findex], label, this.formatNum(this.changeTwoDecimal(event.currentTarget.innerText
									.replace(
										/,/g, ''))));
							}
						}



					},

					cancelenter(event,row, index, label) {
						event.currentTarget.blur()
					},
					handleSelect(val, index,row) {
						this.$set(this.tableList[row.findex],'faccount',val)
					},

					handleSelect1(val, index) {
						alert(1)
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
									this.uploadData.fYear = this.voucherInfo.ftransdate_temp;
									this.disName = this.fBrNo;
									this.getDocumentDetail4();
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



					showAddDialog() {
						this.innerVisible1 = true;
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
									// this.getProofTAccount_fName_All();

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

					updateProofTVoucherEntrys() {
						let params = {
							"fBrNo": this.fBrNo,
							"fNumber": this.form2.fnumber,
						};
						this.axios.post('/perTaxToolTwo/e9/tvoucherentry/updateProofTVoucherEntrys', params)
							.then(res => {
								if (res.data.code == 200) {} else {
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

					getDocumentDetail4() {
						this.loading1 = true;
						let param = {
							"accountantId": 0,
							"customerName": this.uploadData.fBrNo,
							"accountPeriod": this.uploadData.fYear.slice(0, 7),
							// "customerName": '南京亿顺弘信息技术有限公司',
							// "accountPeriod": '2019-10',
							"isValid": 1
						};
						this.axios.post('/perTaxToolTwo/iocr/identify/getScheduleByAccountantId', param).then(res => {
							if (res.data.code == 200) {
								this.loading1 = false;
								this.detail = res.data.data;


							} else {
								this.loading1 = false;
								this.$message({
									message: res.data.msg,
									type: 'error'
								});
							}

						}).catch(function(err) {
							this.loading1 = false;
							this.$message({
								message: '获取列表失败',
								type: 'error'
							});
						})
					},
					
					getPeriodCustList(){
						let param = {
						};
						this.axios.get('/perTaxToolTwo/api/user/getPeriodCustList.do').then(res => {
							if (res.data.code == 200) {
								this.periodCustList = res.data.data;
						
						
							} else {
								this.$message({
									message: res.data.msg,
									type: 'error'
								});
							}
						
						}).catch(function(err) {
							this.$message({
								message: '获取客户失败',
								type: 'error'
							});
						})
					},

					modify(data) {
						this.innerVisible2 = true;
						this.form3 = JSON.parse(JSON.stringify(data))
					},

					showDetail(row, event, column) {
						this.$refs.refTable.toggleRowExpansion(row)
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
						this.hideUpload = this.images.length >= 1;
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
								const values = this.tableList.map(item => item[column.property]?item[column.property].replace(/,/g, ''):'');
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
								console.log(sums[index]);
								sums[index] = this.formatNum(sums[index]);
								console.log(sums[index]);
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
						// console.log(sums)
						return sums;
					}



			},
			computed: {
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
				// 		if (item.famount_string1) {
				// 			total += parseFloat(item.famount_string1.replace(/,/g, ''))
				// 		}

				// 	})
				// 	return this.formatNum(this.changeTwoDecimal(total))
				// },
				famount_string2Total: function() {
					let total = 0;
					this.tableList.forEach(function(item) {
						if (item.famount_string2) {
							total += parseFloat(item.famount_string2.replace(/,/g, ''))
						} else {

						}

					})
					return this.formatNum(this.changeTwoDecimal(total))
				},



			},
			watch: {
				"uploadData.fYear": {
					handler(val, oldVal) {
						if (val && this.uploadData.fBrNo) {
							this.getDocumentDetail4();
							let params = {
								year: val.slice(0, 4),
								month: val.slice(5, 7),
								fBrNo: this.fBrNo
							};
							this.axios.post('/perTaxToolTwo/e9/tVoucher/getPeriod', this.qs.stringify(params), {
									headers: {
										"Content-Type": "application/x-www-form-urlencoded"
									}
								})
								.then(res => {
									if (res.data.code == 200) {
										this.voucherInfo.fnumber = res.data.data.fNumber_fBrNo;

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
					deep: true
				},
				famount_string1Total(val) {
					let params = {
						"cou": val.replace(/,/g, '')
					};
					this.axios.post('/perTaxToolTwo/e9/tVoucher/proofTVouchers_convert', this.qs.stringify(params), {
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
			},
			created() {
				this.getPeriodCustList();
			}
		}
</script>

<style scoped lang="less">
	.moimg {
		width: 100%;
		height: 600px;
	}
	/deep/ .el-table__footer-wrapper{
		margin-top: 0px;
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
			width: 120px;
			height: 40px;
			line-height: 40px;
			background: #43b3db;
			color: #fff;
			display: inline-block;
			text-align: center;
			margin-right: 40px;
			border-radius: 4px;
		}

		.close {
			width: 120px;
			height: 40px;
			line-height: 40px;
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
		.el-tabs {
			height: 100%;
		}

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
			height: 30px;
			line-height: 30px;
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
		background-color: #fff;
		// background-color: #efefef
	}

	/deep/ .el-table th {
		background-color: #fff;
		// background-color: #efefef;
	}

	/deep/.el-table thead.is-group th {
		background-color: #fff // background-color: #efefef;
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
		// background-color: #fff7f1;
		background-color: #fff;
	}

	/deep/ .el-table__body tr.el-table__row--striped {
		background-color: #ebf6fb;
	}

	/deep/ .el-table thead {
		color: #343434;
	}

	/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
		// background-color: #efe9e5;
		background-color: #fff;
	}

	/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
		border-bottom-color: #fff;
		background: #ebf6fb;
	}

	/deep/ .el-tabs__header {
		margin: 0px;
	}

	/deep/ .el-dialog__body {
		padding: 0 20px 30px;
	}

	[contenteditable]:focus {
		outline: none;
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
		width: 120px;
		height: 40px;
		line-height: 40px;
		background: #43b3db;
		color: #fff;
		display: inline-block;
		text-align: center;
		margin-right: 40px;
		border-radius: 4px;
		cursor: pointer
	}

	.close {
		width: 120px;
		height: 40px;
		line-height: 40px;
		background: #ed878e;
		color: #fff;
		display: inline-block;
		text-align: center;
		border-radius: 4px;
		cursor: pointer
	}

	/deep/ .el-tree {
		height: 300px;
		overflow-y: scroll;
	}
</style>
