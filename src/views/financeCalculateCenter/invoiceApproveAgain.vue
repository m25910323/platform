<template>
	<div class="main_contain">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>会计工厂</el-breadcrumb-item>
			<el-breadcrumb-item>凭证管理</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/financeCalculateCenter/invoiceDetailAgain' }">发票审核</el-breadcrumb-item>
			<el-breadcrumb-item>审核详情</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="left_contain">
			<h1>{{$route.query.customerName}}
				<span style="margin-left: 10px;color:#999;font-size:12px">{{$route.query.accountPeriod}}</span>
				<span style="margin-left: 20px;color:#999;font-size:12px">{{incomeTaxCollectionMethod}}</span>
					



			</h1>
			<div class="contain_body">
				<div class="clearfix">
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="170px" class="demo-ruleForm" size="small"
					 style="width:360px;float: left;">
						<el-form-item label="收入金额" prop="incomeAmount" v-if='ruleForm.taxDeclarationType != "233"'>

							<el-input v-model="ruleForm.incomeAmount" disabled></el-input>
						</el-form-item>
						<el-form-item label="不含税收入" prop="incomeNotTaxAmount" v-if='ruleForm.taxDeclarationType != "233"'>
							<el-input v-model="ruleForm.incomeNotTaxAmount" disabled></el-input>
						</el-form-item>
						<el-form-item label="销项发票专票金额" prop="outputSpecialAmount" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm.outputSpecialAmount" disabled></el-input>
						</el-form-item>
						<el-form-item label="销项发票专票税额" prop="outputSpecialTax" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm.outputSpecialTax" disabled></el-input>
						</el-form-item>
						<el-form-item label="销项发票普票金额" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input :value='ruleForm.outputNormalAmount' disabled></el-input>
						</el-form-item>
						<el-form-item label="销项发票普票税额" prop="outputNormalTax" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm.outputNormalTax" disabled></el-input>
						</el-form-item>
						<el-form-item label="进项发票专票金额" prop="inputSpecialAmount" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm.inputSpecialAmount" disabled></el-input>
						</el-form-item>
						<el-form-item label="进项发票专票税额" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input :value='ruleForm.inputSpecialTax' disabled></el-input>
						</el-form-item>
						<el-form-item label="进项发票专票数量" prop="inputSpecialNumber" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm.inputSpecialNumber" disabled></el-input>
						</el-form-item>
						<el-form-item label="旅客运输不含税金额" prop="transportNoTaxAmount" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm.transportNoTaxAmount" disabled></el-input>
						</el-form-item>
						<el-form-item label="旅客运输税额" prop="transportTaxAmount" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm.transportTaxAmount" disabled></el-input>
						</el-form-item>
					</el-form>
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="12px" class="demo-ruleForm" size="small"
					 style="width:200px;float: left;">
						<el-form-item label="-" prop="incomeAmount" v-if='ruleForm.taxDeclarationType != "233"'>

							<el-input v-model="ruleForm1.incomeAmount"></el-input>
						</el-form-item>
						<el-form-item label="-" prop="incomeNotTaxAmount" v-if='ruleForm.taxDeclarationType != "233"'>
							<el-input v-model="ruleForm1.incomeNotTaxAmount"></el-input>
						</el-form-item>
						<el-form-item label="-" prop="outputSpecialAmount" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm1.outputSpecialAmount"></el-input>
						</el-form-item>
						<el-form-item label="-" prop="outputSpecialTax" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm1.outputSpecialTax"></el-input>
						</el-form-item>
						<el-form-item label="-" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model='ruleForm1.outputNormalAmount'></el-input>
						</el-form-item>
						<el-form-item label="-" prop="outputNormalTax" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm1.outputNormalTax"></el-input>
						</el-form-item>
						<el-form-item label="-" prop="inputSpecialAmount" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm1.inputSpecialAmount"></el-input>
						</el-form-item>
						<el-form-item label="-" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model='ruleForm1.inputSpecialTax'></el-input>
						</el-form-item>
						<el-form-item label="-" prop="inputSpecialNumber" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm1.inputSpecialNumber"></el-input>
						</el-form-item>
						
						<el-form-item label="-" prop="transportNoTaxAmount" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm1.transportNoTaxAmount"></el-input>
						</el-form-item>
						<el-form-item label="-" prop="transportTaxAmount" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm1.transportTaxAmount"></el-input>
						</el-form-item>
					</el-form>
					<el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="12px" class="demo-ruleForm" size="small"
					 style="width:338px;float: left;">
						<el-form-item label="=" prop="incomeAmount" v-if='ruleForm.taxDeclarationType != "233"'>

							<el-input v-model="ruleForm.incomeAmount - ruleForm1.incomeAmount" disabled></el-input>
						</el-form-item>
						<el-form-item label="=" prop="incomeNotTaxAmount" v-if='ruleForm.taxDeclarationType != "233"'>
							<el-input v-model="ruleForm.incomeNotTaxAmount - ruleForm1.incomeNotTaxAmount" disabled></el-input>
						</el-form-item>
						<el-form-item label="=" prop="outputSpecialAmount" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm.outputSpecialAmount - ruleForm1.outputSpecialAmount" disabled></el-input>
						</el-form-item>
						<el-form-item label="=" prop="outputSpecialTax" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm.outputSpecialTax - ruleForm1.outputSpecialTax" disabled></el-input>
						</el-form-item>
						<el-form-item label="=" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input :value='ruleForm.outputNormalAmount - ruleForm1.outputNormalAmount' disabled></el-input>
						</el-form-item>
						<el-form-item label="=" prop="outputNormalTax" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm.outputNormalTax - ruleForm1.outputNormalTax" disabled></el-input>
						</el-form-item>
						<el-form-item label="=" prop="inputSpecialAmount" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm.inputSpecialAmount - ruleForm1.inputSpecialAmount" disabled></el-input>
						</el-form-item>
						<el-form-item label="=" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input :value='ruleForm.inputSpecialTax - ruleForm1.inputSpecialTax' disabled></el-input>
						</el-form-item>
						<el-form-item label="=" prop="inputSpecialNumber" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm.inputSpecialNumber - ruleForm1.inputSpecialNumber" disabled></el-input>
						</el-form-item>
						
						<el-form-item label="=" prop="transportNoTaxAmount" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm.transportNoTaxAmount - ruleForm1.transportNoTaxAmount" disabled></el-input>
						</el-form-item>
						<el-form-item label="=" prop="transportTaxAmount" v-if='ruleForm.taxDeclarationType == "233"'>
							<el-input v-model="ruleForm.transportTaxAmount - ruleForm1.transportTaxAmount" disabled></el-input>
						</el-form-item>
					</el-form>
				</div>





				<!-- <el-table :data="detailList" style='margin-top: 10px;' @selection-change="handleSelectionChange">
					<el-table-column align="center" type="selection" width="55"></el-table-column>
					<el-table-column align="center" prop="typeName" label="发票名称"></el-table-column>
					<el-table-column align="center" prop="amount" label="金额"></el-table-column>
					<el-table-column align="center" prop="createTime" label="上传时间">
						<template slot-scope="scope">
							<span>{{scope.row.createTime.slice(0,10)}}</span>
						</template>
					</el-table-column>
					
				
				</el-table> -->
				<label>进项税额转出：</label>
				<el-input size="mini" type="number" placeholder="请输入进项税额转出" v-model='inputSpecialAmount' style="width: 200px;margin-right: 10px;"></el-input>
				<el-button type="primary" size='mini' @click='checkNameForTransport' style="margin-bottom: 10px;" v-show='ruleForm.taxDeclarationType == "233" && otherCostSpecialList.length>0'>校验旅客运输票</el-button>
				<el-button type="primary" size='mini' @click='openCommit' style="margin-bottom: 10px;" :disabled="canSubmit" v-show='ruleForm.taxDeclarationType == "233" && otherCostSpecialList.length>0'>提交</el-button>
				<el-button type="primary" size='mini' @click='openCommit' style="margin-bottom: 10px;" v-show='ruleForm.taxDeclarationType == "233" && otherCostSpecialList.length==0 && isCanSubmit || ruleForm.taxDeclarationType == "232" && isCanSubmit'>提交</el-button>
				<el-button type="primary" size='mini' @click='zeroCommit' style="margin-bottom: 10px;" v-show='!isCanSubmit'>零申报</el-button>
				<el-button type="primary" size='mini' @click='refresh' style="float: right;">刷新</el-button>
				<el-button @click='selectPic("formName")' size="mini" type='primary' style='float:right'><i
					 class="el-icon-upload"></i>上传</el-button>
				<el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
					<el-tab-pane label="相关" name="0">
						<el-collapse v-model="activeName1" accordion>
							<el-collapse-item name="zero">
								<template slot="title">
								      销项票<span style="color: #F56C6C;">（{{relatedincome.length}}张）</span>
								</template>
								<div class=''>

									<el-table :data="relatedincome.slice((currentPage1 - 1)*10,(currentPage1 - 1)*10 + 10)" style="width: 100%;margin-top:10px" border v-loading='loading1' @row-click='showDetail'
									 ref='refTable' @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands"
									 @selection-change="handleSelectionChange111">
										<el-table-column type="expand">
											<template slot-scope="props">
												<div class='clearfix'>
													<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
														<h3>发票详情<el-button type="primary" size="mini" class='el-icon-refresh' @click="rotate1" style="font-size: 16px;margin-left: 12px;"></el-button>
														</h3>
														<div style="margin-top: 12px;">
															<!-- <el-upload id='upload' action="/perTaxToolTwo/iocr/main/updateSchedule" list-type="picture-card"
															 :on-preview="handlePictureCardPreview" :limit="1" :on-remove="handleRemovePic" :before-remove='beforeRemovePic'
															 :data='picData' :class="{hided:hideUpload}" :on-change="onChange" :file-list="images" :on-success="handleSuccess"
															 style="width:100%;height:600px">
																<i class="el-icon-plus"></i>
															</el-upload>
															<el-dialog :visible.sync="dialogVisiblePic" size="tiny">
																<img width="100%" :src="dialogImageUrl" alt="">
															</el-dialog> -->
															<img :src="images[0].url" alt="" :style="{ transform: 'rotate(' + num1*90 + 'deg)', transformOrigin:'50% 50%'}"
															 class="moimg">


														</div>


													</div>
													<div style='float:right;width: 500px;'>
														<div style='border:1px solid #efefef;box-sizing:border-box;margin:0px 10px;padding:10px 0px'>
															<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
																<el-form-item v-for='(item,index) in form' :label="item.fieldChName">
																	<el-input v-model='item.fieldValue' size="mini" v-show='item.type != 3 && item.type != 4 && item.type != 5 && item.type != 6 && item.type != 14 && item.type != 15'></el-input>
																	<el-select v-model="item.fieldValue" placeholder="请选择" clearable filterable v-show='item.type == 3'>
																		<el-option v-for="item in treeList" :label="item.ffullname" :value='item.ffullname'></el-option>
																	</el-select>
																	<el-select v-model="item.fieldValue" placeholder="请至少输入两个字符" clearable filterable remote reserve-keyword
																	 :remote-method="getTycNameMatchByName2do" v-show='item.type == 5' @change="((val)=>{getTycByName(val, index)})">
																		<el-option v-for="item in TycNameList" :label="item" :value='item' :key="item"></el-option>
																	</el-select>
																	<el-date-picker v-model="item.fieldValue" type="month" format="yyyy-MM" value-format="yyyy-MM" v-show='item.type == 4'>
																	</el-date-picker>
																	<el-input v-model='item.fieldValue' size="mini" v-show='item.type == 6' disabled></el-input>
																	<el-input value='无票收入 无票' size="mini" v-show='item.type == 15' disabled></el-input>
																	<el-select v-model="item.fieldValue" clearable v-show='item.type == 14'>
																		<el-option label="一般计税" value='一般计税'></el-option>
																		<el-option label="免税计税" value='免税计税'></el-option>
																	</el-select>
																</el-form-item>

																<div></div>
																<el-button size="mini" type="primary" style='width:100px' @click='updateSchedule'>保存</el-button>
															</el-form>
														</div>
														<div style='border:1px solid #efefef;box-sizing:border-box;margin:10px 10px'>

															<div style="margin-top: 4px;">
																<img :src="modelUrl" alt="" style="width:100%;vertical-align: bottom;margin-right: 20px;">
																<!-- <el-button size="mini" type="primary">重新识别</el-button> -->
															</div>
															<div style='text-align: center;padding-bottom:12px'>
																<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
																	<el-form-item label="更换模板">
																		<el-select v-model="detail.documentType000" placeholder="请选择模板" clearable filterable @change='handleCommand'
																		 value-key='billId'>
																			<el-option v-for="item in modelList" :label="item.fieldChName" :value='item'></el-option>
																		</el-select>

																	</el-form-item>

																</el-form>

																<el-button size="mini" type="primary" @click='submitNoModel'>提交为新模板</el-button>
																<el-button size="mini" type="primary" plain @click='revocation'>撤销</el-button>
															</div>
														</div>
													</div>
												</div>


											</template>
										</el-table-column>
										<!-- <el-table-column align="center" type="selection" width="55"> -->
										<!-- </el-table-column> -->
										<el-table-column align="center" type="index" :index="indexMethod">
										</el-table-column>
										<el-table-column align="center" label="发票类型" prop="typeName" :resizable="false"></el-table-column>
										<el-table-column align="center" label="发票号" prop="invoiceNum" :resizable="false"></el-table-column>
										<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
										<el-table-column align="center" label="上传时间" prop="createTime" :resizable="false">
											<template slot-scope="scope">
												<span>{{scope.row.createTime.slice(0,10)}}</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="修改时间" prop="updateTime" :resizable="false">
											<template slot-scope="scope">
												<span>{{scope.row.updateTime?scope.row.updateTime.slice(0,10):'--'}}</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否入账" prop="accountantState" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.accountantState == 1'>是</span>
												<span v-else>否</span>
											</template>
										</el-table-column>

										<el-table-column align="center" label="是否代开" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.issuedSign == 1'>是</span>
												<span v-if='scope.row.issuedSign == 0'>否</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否认证" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 1'>是</span>
												<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 0'>否</span>
												<span v-if='scope.row.typeName != "增值税专用发票"'>--</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="凭证类型" prop="documentType" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.documentType == 0'>收入</span>
												<span v-if='scope.row.documentType == 1'>费用</span>
												<span v-if='scope.row.documentType == 2'>成本</span>
												<span v-if='scope.row.documentType == 3'>其他</span>
												<span v-if='scope.row.documentType == 4'>未分配</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="状态" prop="state" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.state == 1'>待审核</span>
												<span v-if='scope.row.state == 2'>审核通过</span>
												<span v-if='scope.row.state == 3'>审核不通过</span>
												<span v-if='scope.row.state == 4'>问票中</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="上传人">
											<template slot-scope="scope">
												<span>{{scope.row.createPerson != null && !isNaN(scope.row.createPerson) && scope.row.createPerson.length == 11?scope.row.createPerson.slice(0,3) + '****' + scope.row.createPerson.slice(7,11):scope.row.createPerson}}</span>
											</template>
										</el-table-column>

										<el-table-column align="center" label="是否校验客户名称" prop="isCheckCustomerName" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.isCheckCustomerName == 1'>是</span>
												<span v-if='scope.row.isCheckCustomerName == 0'>否</span>
											</template>
										</el-table-column>
										<el-table-column align="center" :resizable="false" width="400">
											<template slot="header" slot-scope="scope">
												<span>操作</span>
											</template>
											<template slot-scope="scope">
												<div v-show='scope.row.accountantState != 1'>
													<el-tooltip class="item" effect="dark" :content="scope.row.remark2" placement="top" v-show='scope.row.remark2 != null && scope.row.remark2 != ""'>
														<i class="el-icon-warning"></i>
													</el-tooltip>
													<el-button size="mini" type="text" @click.stop="setCheck(scope.$index, scope.row)">{{scope.row.isCheckCustomerName == 1?"取消校验客户名称":"校验客户名称"}}</el-button>
													<el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,1,'issuedSign')">{{scope.row.issuedSign == 0?"设为代开":"取消代开"}}</el-button>
													<!-- <el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,2,'isCertification')"
													 v-show='scope.row.typeName == "增值税专用发票"'>{{scope.row.isCertification == 0?"设为认证":"取消认证"}}</el-button> -->
													
													
													<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>
													
													<el-dropdown size='mini' @command="val=>{handleApprove(val,scope.row)}" v-show="scope.row.accountantState == 2"
													 style='margin-left:8px'>
														<el-button class="el-dropdown-link" size='mini' type='text'>
															审核<i class="el-icon-arrow-down el-icon--right"></i>
														</el-button>
														<el-dropdown-menu slot="dropdown">
															<el-dropdown-item command="2">通过</el-dropdown-item>
															<el-dropdown-item command="3">不通过</el-dropdown-item>
														</el-dropdown-menu>
													</el-dropdown>
													<el-dropdown size='mini' @command="val=>{handleCommand1(val,scope.row)}" style='margin-left:8px'>
														<el-button class="el-dropdown-link" size='mini' type='text'>
															编辑类型<i class="el-icon-arrow-down el-icon--right"></i>
														</el-button>
														<el-dropdown-menu slot="dropdown">
															<el-dropdown-item command="0">收入</el-dropdown-item>
															<el-dropdown-item command="2">成本</el-dropdown-item>
															<el-dropdown-item command="1">费用</el-dropdown-item>
															<el-dropdown-item command="3">其他</el-dropdown-item>
															<!-- <el-dropdown-item command="4">未分配</el-dropdown-item> -->
														</el-dropdown-menu>
													</el-dropdown>
												</div>
												<div v-show='scope.row.accountantState == 1'>
													<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>
												</div>
											</template>
										</el-table-column>
									</el-table>
									<el-pagination background @current-change="((val)=>{handleCurrentChange1(val)})" :current-page="currentPage1"
									 :page-size="pageSize1" layout="total, prev, pager, next" :total="relatedincome.length">
									</el-pagination>


								</div>
							</el-collapse-item>
							<el-collapse-item name="one">
								<template slot="title">
								      进项票<span style="color: #F56C6C;">（{{relatedcostSpecial.length}}张）</span>
								</template>
								<div class=''>

									
									<el-table :data="relatedcostSpecial.slice((currentPage2 - 1)*10,(currentPage2 - 1)*10 + 10)" style="width: 100%;margin-top:10px" border v-loading='loading1'
									 @row-click='showDetail' ref='refTable' @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands"
									 @selection-change="handleSelectionChange111">
										<el-table-column type="expand">
											<template slot-scope="props">
												<div class='clearfix'>
													<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
														<h3>发票详情<el-button type="primary" size="mini" class='el-icon-refresh2' @click="rotate" style="font-size: 16px;margin-left: 12px;"></el-button>
														</h3>
														<div style="margin-top: 12px;">
															
															<img :src="images[0].url" alt="" :style="{ transform: 'rotate(' + num2*90 + 'deg)', transformOrigin:'50% 50%'}"
															 class="moimg">


														</div>


													</div>
													<div style='float:right;width: 500px;'>
														<div style='border:1px solid #efefef;box-sizing:border-box;margin:0px 10px;padding:10px 0px'>
															<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
																<el-form-item v-for='(item,index) in form' :label="item.fieldChName">
																	<el-input v-model='item.fieldValue' size="mini" v-show='item.type != 3 && item.type != 4 && item.type != 5 && item.type != 6 && item.type != 14 && item.type != 15'></el-input>
																	<el-select v-model="item.fieldValue" placeholder="请选择" clearable filterable v-show='item.type == 3'>
																		<el-option v-for="item in treeList" :label="item.ffullname" :value='item.ffullname'></el-option>
																	</el-select>
																	<el-select v-model="item.fieldValue" placeholder="请至少输入两个字符" clearable filterable remote reserve-keyword
																	 :remote-method="getTycNameMatchByName2do" v-show='item.type == 5' @change="((val)=>{getTycByName(val, index)})">
																		<el-option v-for="item in TycNameList" :label="item" :value='item' :key="item"></el-option>
																	</el-select>
																	<el-date-picker v-model="item.fieldValue" type="month" format="yyyy-MM" value-format="yyyy-MM" v-show='item.type == 4'>
																	</el-date-picker>
																	<el-input v-model='item.fieldValue' size="mini" v-show='item.type == 6' disabled></el-input>
																	<el-input value='无票收入 无票' size="mini" v-show='item.type == 15' disabled></el-input>
																	<el-select v-model="item.fieldValue" clearable v-show='item.type == 14'>
																		<el-option label="一般计税" value='一般计税'></el-option>
																		<el-option label="免税计税" value='免税计税'></el-option>
																	</el-select>
																</el-form-item>

																<div></div>
																<el-button size="mini" type="primary" style='width:100px' @click='updateSchedule'>保存</el-button>
															</el-form>
														</div>
														<div style='border:1px solid #efefef;box-sizing:border-box;margin:10px 10px'>



															<div style="margin-top: 4px;">
																<img :src="modelUrl" alt="" style="width:100%;vertical-align: bottom;margin-right: 20px;">
																<!-- <el-button size="mini" type="primary">重新识别</el-button> -->
															</div>
															<div style='text-align: center;padding-bottom:12px'>
																<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
																	<el-form-item label="更换模板">
																		<el-select v-model="detail.documentType000" placeholder="请选择模板" clearable filterable @change='handleCommand'
																		 value-key='billId'>
																			<el-option v-for="item in modelList" :label="item.fieldChName" :value='item'></el-option>
																		</el-select>

																	</el-form-item>

																</el-form>

																<el-button size="mini" type="primary" @click='submitNoModel'>提交为新模板</el-button>
																<el-button size="mini" type="primary" plain @click='revocation'>撤销</el-button>
															</div>
														</div>
													</div>
												</div>


											</template>
										</el-table-column>
										<!-- <el-table-column align="center" type="selection" width="55"> -->
										<el-table-column align="center" type="index" :index="indexMethod">
										</el-table-column>
										<!-- </el-table-column> -->
										<el-table-column align="center" label="发票类型" prop="typeName" :resizable="false"></el-table-column>
										<el-table-column align="center" label="发票号" prop="invoiceNum" :resizable="false"></el-table-column>
										<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
										<el-table-column align="center" label="上传时间" prop="createTime" :resizable="false">
											<template slot-scope="scope">
												<span>{{scope.row.createTime.slice(0,10)}}</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="修改时间" prop="updateTime" :resizable="false">
											<template slot-scope="scope">
												<span>{{scope.row.updateTime?scope.row.updateTime.slice(0,10):'--'}}</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否入账" prop="accountantState" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.accountantState == 1'>是</span>
												<span v-else>否</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否代开" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.issuedSign == 1'>是</span>
												<span v-if='scope.row.issuedSign == 0'>否</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否认证" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 1'>是</span>
												<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 0'>否</span>
												<span v-if='scope.row.typeName != "增值税专用发票"'>--</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="凭证类型" prop="documentType" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.documentType == 0'>收入</span>
												<span v-if='scope.row.documentType == 1'>费用</span>
												<span v-if='scope.row.documentType == 2'>成本</span>
												<span v-if='scope.row.documentType == 3'>其他</span>
												<span v-if='scope.row.documentType == 4'>未分配</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="状态" prop="state" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.state == 1'>待审核</span>
												<span v-if='scope.row.state == 2'>审核通过</span>
												<span v-if='scope.row.state == 3'>审核不通过</span>
												<span v-if='scope.row.state == 4'>问票中</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="上传人">
											<template slot-scope="scope">
												<span>{{scope.row.createPerson != null && !isNaN(scope.row.createPerson) && scope.row.createPerson.length == 11?scope.row.createPerson.slice(0,3) + '****' + scope.row.createPerson.slice(7,11):scope.row.createPerson}}</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否校验客户名称" prop="isCheckCustomerName" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.isCheckCustomerName == 1'>是</span>
												<span v-if='scope.row.isCheckCustomerName == 0'>否</span>
											</template>
										</el-table-column>
										<el-table-column align="center" :resizable="false" width="400">
											<template slot="header" slot-scope="scope">
												<span>操作</span>
											</template>
											<template slot-scope="scope">
												<div v-show='scope.row.accountantState != 1'>
													<el-tooltip class="item" effect="dark" :content="scope.row.remark2" placement="top" v-show='scope.row.remark2 != null && scope.row.remark2 != ""'>
														<i class="el-icon-warning"></i>
													</el-tooltip>
													<el-button size="mini" type="text" @click.stop="setCheck(scope.$index, scope.row)">{{scope.row.isCheckCustomerName == 1?"取消校验客户名称":"校验客户名称"}}</el-button>
													<el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,1,'issuedSign')">{{scope.row.issuedSign == 0?"设为代开":"取消代开"}}</el-button>
													<!-- <el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,2,'isCertification')"
													 v-show='scope.row.typeName == "增值税专用发票"'>{{scope.row.isCertification == 0?"设为认证":"取消认证"}}</el-button> -->
													<el-button size="mini" type="text" @click.stop="setCertification1(scope.$index, scope.row,2,'isCertification')"
													 v-show='scope.row.typeName == "增值税专用发票" && scope.row.accountantState != 1'>{{scope.row.isCertification == 0?"设为认证":"取消认证"}}</el-button>
													<!-- <el-button size="mini" type="text" @click.stop="showconnectMain(scope.$index, scope.row)">关联清单</el-button>
													<el-button size="mini" type="text" @click.stop="showconnectMain1(scope.$index, scope.row)" v-show="scope.row.isMaster.length > 0">查看清单</el-button>
													<el-button size="mini" type="text" @click.stop="selectAllQuestions(scope.$index, scope.row)" v-show="scope.row.state == 1">问票</el-button>
													<el-button size="mini" type="text" @click.stop="getAnswer(scope.$index, scope.row)">问票结果</el-button> -->
													
													<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>
													
													<el-dropdown size='mini' @command="val=>{handleApprove(val,scope.row)}" v-show="scope.row.accountantState == 2"
													 style='margin-left:8px'>
														<el-button class="el-dropdown-link" size='mini' type='text'>
															审核<i class="el-icon-arrow-down el-icon--right"></i>
														</el-button>
														<el-dropdown-menu slot="dropdown">
															<el-dropdown-item command="2">通过</el-dropdown-item>
															<el-dropdown-item command="3">不通过</el-dropdown-item>
														</el-dropdown-menu>
													</el-dropdown>
													
													<el-dropdown size='mini' @command="val=>{handleCommand1(val,scope.row)}" style='margin-left:8px'>
														<el-button class="el-dropdown-link" size='mini' type='text'>
															编辑类型<i class="el-icon-arrow-down el-icon--right"></i>
														</el-button>
														<el-dropdown-menu slot="dropdown">
															<el-dropdown-item command="0">收入</el-dropdown-item>
															<el-dropdown-item command="2">成本</el-dropdown-item>
															<el-dropdown-item command="1">费用</el-dropdown-item>
															<el-dropdown-item command="3">其他</el-dropdown-item>
														</el-dropdown-menu>
													</el-dropdown>
												</div>
												
												<div v-show='scope.row.accountantState == 1'>
													<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>
												</div>
											</template>
										</el-table-column>
									</el-table>
									<el-pagination background @current-change="((val)=>{handleCurrentChange2(val)})" :current-page="currentPage2"
									 :page-size="pageSize2" layout="total, prev, pager, next" :total="relatedcostSpecial.length">
									</el-pagination>


								</div>
							</el-collapse-item>
							
							<el-collapse-item name="five">
								<template slot="title">
								      认证票据-非本期<span style="color: #F56C6C;">（{{certificationPreviousList.length}}张）</span>
								</template>
								<div class=''>
							
									
									<el-table :data="certificationPreviousList.slice((currentPage7 - 1)*10,(currentPage7 - 1)*10 + 10)" style="width: 100%;margin-top:10px" border v-loading='loading1'
									 @row-click='showDetail' ref='refTable' @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands"
									 @selection-change="handleSelectionChange111">
										<el-table-column type="expand">
											<template slot-scope="props">
												<div class='clearfix'>
													<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
														<h3>发票详情<el-button type="primary" size="mini" class='el-icon-refresh2' @click="rotate" style="font-size: 16px;margin-left: 12px;"></el-button>
														</h3>
														<div style="margin-top: 12px;">
															
															<img :src="images[0].url" alt="" :style="{ transform: 'rotate(' + num2*90 + 'deg)', transformOrigin:'50% 50%'}"
															 class="moimg">
							
							
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
														<div style='border:1px solid #efefef;box-sizing:border-box;margin:10px 10px'>
							
							
							
															<div style="margin-top: 4px;">
																<img :src="modelUrl" alt="" style="width:100%;vertical-align: bottom;margin-right: 20px;">
																<!-- <el-button size="mini" type="primary">重新识别</el-button> -->
															</div>
															
														</div>
													</div>
												</div>
							
							
											</template>
										</el-table-column>
										<!-- <el-table-column align="center" type="selection" width="55"> -->
										<el-table-column align="center" type="index" :index="indexMethod">
										</el-table-column>
										<!-- </el-table-column> -->
										<el-table-column align="center" label="发票类型" prop="typeName" :resizable="false"></el-table-column>
										<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>
										<el-table-column align="center" label="发票号" prop="invoiceNum" :resizable="false"></el-table-column>
										<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
										<el-table-column align="center" label="上传时间" prop="createTime" :resizable="false">
											<template slot-scope="scope">
												<span>{{scope.row.createTime.slice(0,10)}}</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="修改时间" prop="updateTime" :resizable="false">
											<template slot-scope="scope">
												<span>{{scope.row.updateTime?scope.row.updateTime.slice(0,10):'--'}}</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否入账" prop="accountantState" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.accountantState == 1'>是</span>
												<span v-else>否</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否代开" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.issuedSign == 1'>是</span>
												<span v-if='scope.row.issuedSign == 0'>否</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否认证" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 1'>是</span>
												<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 0'>否</span>
												<span v-if='scope.row.typeName != "增值税专用发票"'>--</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="凭证类型" prop="documentType" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.documentType == 0'>收入</span>
												<span v-if='scope.row.documentType == 1'>费用</span>
												<span v-if='scope.row.documentType == 2'>成本</span>
												<span v-if='scope.row.documentType == 3'>其他</span>
												<span v-if='scope.row.documentType == 4'>未分配</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="状态" prop="state" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.state == 1'>待审核</span>
												<span v-if='scope.row.state == 2'>审核通过</span>
												<span v-if='scope.row.state == 3'>审核不通过</span>
												<span v-if='scope.row.state == 4'>问票中</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="上传人">
											<template slot-scope="scope">
												<span>{{scope.row.createPerson != null && !isNaN(scope.row.createPerson) && scope.row.createPerson.length == 11?scope.row.createPerson.slice(0,3) + '****' + scope.row.createPerson.slice(7,11):scope.row.createPerson}}</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否校验客户名称" prop="isCheckCustomerName" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.isCheckCustomerName == 1'>是</span>
												<span v-if='scope.row.isCheckCustomerName == 0'>否</span>
											</template>
										</el-table-column>
										<el-table-column align="center" :resizable="false" width="400">
											<template slot="header" slot-scope="scope">
												<span>操作</span>
											</template>
											<template slot-scope="scope">
												<div v-show='scope.row.accountantState != 1'>
													<!-- <el-tooltip class="item" effect="dark" :content="scope.row.remark2" placement="top" v-show='scope.row.remark2 != null && scope.row.remark2 != ""'>
														<i class="el-icon-warning"></i>
													</el-tooltip> -->
													<!-- <el-button size="mini" type="text" @click.stop="setCheck(scope.$index, scope.row)">{{scope.row.isCheckCustomerName == 1?"取消校验客户名称":"校验客户名称"}}</el-button>
													<el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,1,'issuedSign')">{{scope.row.issuedSign == 0?"设为代开":"取消代开"}}</el-button> -->
													<!-- <el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,2,'isCertification')"
													 v-show='scope.row.typeName == "增值税专用发票"'>{{scope.row.isCertification == 0?"设为认证":"取消认证"}}</el-button> -->
													<!-- <el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,2,'isCertification')"
													 v-show='scope.row.typeName == "增值税专用发票" && scope.row.accountantState != 1'>{{scope.row.isCertification == 0?"设为认证":"取消认证"}}</el-button> -->
													<!-- <el-button size="mini" type="text" @click.stop="showconnectMain(scope.$index, scope.row)">关联清单</el-button>
													<el-button size="mini" type="text" @click.stop="showconnectMain1(scope.$index, scope.row)" v-show="scope.row.isMaster.length > 0">查看清单</el-button>
													<el-button size="mini" type="text" @click.stop="selectAllQuestions(scope.$index, scope.row)" v-show="scope.row.state == 1">问票</el-button>
													<el-button size="mini" type="text" @click.stop="getAnswer(scope.$index, scope.row)">问票结果</el-button> -->
													
													<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>
													
												</div>
												
												<div v-show='scope.row.accountantState == 1'>
													<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>
												</div>
											</template>
										</el-table-column>
									</el-table>
									<el-pagination background @current-change="((val)=>{handleCurrentChange7(val)})" :current-page="currentPage7"
									 :page-size="pageSize7" layout="total, prev, pager, next" :total="certificationPreviousList.length">
									</el-pagination>
							
							
								</div>
							</el-collapse-item>
							
							<el-collapse-item name="two">
								<template slot="title">
								      其他销项票<span style="color: #F56C6C;">（{{otherIncomeList.length}}张）</span>
								</template>
								<div class=''>
							
									
									<el-table :data="otherIncomeList.slice((currentPage3 - 1)*10,(currentPage3 - 1)*10 + 10)" style="width: 100%;margin-top:10px" border v-loading='loading1' @row-click='showDetail'
									 ref='refTable' @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands"
									 @selection-change="handleSelectionChange111">
										<el-table-column type="expand">
											<template slot-scope="props">
												<div class='clearfix'>
													<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
														<h3>发票详情<el-button type="primary" size="mini" class='el-icon-refresh' @click="rotate1" style="font-size: 16px;margin-left: 12px;"></el-button>
														</h3>
														<div style="margin-top: 12px;">
															
															<img :src="images[0].url" alt="" :style="{ transform: 'rotate(' + num1*90 + 'deg)', transformOrigin:'50% 50%'}"
															 class="moimg">
							
							
														</div>
							
							
													</div>
													<div style='float:right;width: 500px;'>
														<div style='border:1px solid #efefef;box-sizing:border-box;margin:0px 10px;padding:10px 0px'>
															<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
																<el-form-item v-for='(item,index) in form' :label="item.fieldChName">
																	<el-input v-model='item.fieldValue' size="mini" v-show='item.type != 3 && item.type != 4 && item.type != 5 && item.type != 6 && item.type != 14 && item.type != 15'></el-input>
																	<el-select v-model="item.fieldValue" placeholder="请选择" clearable filterable v-show='item.type == 3'>
																		<el-option v-for="item in treeList" :label="item.ffullname" :value='item.ffullname'></el-option>
																	</el-select>
																	<el-select v-model="item.fieldValue" placeholder="请至少输入两个字符" clearable filterable remote reserve-keyword
																	 :remote-method="getTycNameMatchByName2do" v-show='item.type == 5' @change="((val)=>{getTycByName(val, index)})">
																		<el-option v-for="item in TycNameList" :label="item" :value='item' :key="item"></el-option>
																	</el-select>
																	<el-date-picker v-model="item.fieldValue" type="month" format="yyyy-MM" value-format="yyyy-MM" v-show='item.type == 4'>
																	</el-date-picker>
																	<el-input v-model='item.fieldValue' size="mini" v-show='item.type == 6' disabled></el-input>
																	<el-input value='无票收入 无票' size="mini" v-show='item.type == 15' disabled></el-input>
																	<el-select v-model="item.fieldValue" clearable v-show='item.type == 14'>
																		<el-option label="一般计税" value='一般计税'></el-option>
																		<el-option label="免税计税" value='免税计税'></el-option>
																	</el-select>
																</el-form-item>
							
																<div></div>
																<el-button size="mini" type="primary" style='width:100px' @click='updateSchedule'>保存</el-button>
															</el-form>
														</div>
														<div style='border:1px solid #efefef;box-sizing:border-box;margin:10px 10px'>
							
															<div style="margin-top: 4px;">
																<img :src="modelUrl" alt="" style="width:100%;vertical-align: bottom;margin-right: 20px;">
																
															</div>
															<div style='text-align: center;padding-bottom:12px'>
																<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
																	<el-form-item label="更换模板">
																		<el-select v-model="detail.documentType000" placeholder="请选择模板" clearable filterable @change='handleCommand'
																		 value-key='billId'>
																			<el-option v-for="item in modelList" :label="item.fieldChName" :value='item'></el-option>
																		</el-select>
							
																	</el-form-item>
							
																</el-form>
							
																<el-button size="mini" type="primary" @click='submitNoModel'>提交为新模板</el-button>
																<el-button size="mini" type="primary" plain @click='revocation'>撤销</el-button>
															</div>
														</div>
													</div>
												</div>
							
							
											</template>
										</el-table-column>
										
										<el-table-column align="center" type="index" :index="indexMethod">
										</el-table-column>
										<el-table-column align="center" label="发票类型" prop="typeName" :resizable="false"></el-table-column>
										<el-table-column align="center" label="发票号" prop="invoiceNum" :resizable="false"></el-table-column>
										<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
										<el-table-column align="center" label="上传时间" prop="createTime" :resizable="false">
											<template slot-scope="scope">
												<span>{{scope.row.createTime.slice(0,10)}}</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="修改时间" prop="updateTime" :resizable="false">
											<template slot-scope="scope">
												<span>{{scope.row.updateTime?scope.row.updateTime.slice(0,10):'--'}}</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否入账" prop="accountantState" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.accountantState == 1'>是</span>
												<span v-else>否</span>
											</template>
										</el-table-column>
							
										<el-table-column align="center" label="是否代开" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.issuedSign == 1'>是</span>
												<span v-if='scope.row.issuedSign == 0'>否</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否认证" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 1'>是</span>
												<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 0'>否</span>
												<span v-if='scope.row.typeName != "增值税专用发票"'>--</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="凭证类型" prop="documentType" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.documentType == 0'>收入</span>
												<span v-if='scope.row.documentType == 1'>费用</span>
												<span v-if='scope.row.documentType == 2'>成本</span>
												<span v-if='scope.row.documentType == 3'>其他</span>
												<span v-if='scope.row.documentType == 4'>未分配</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="状态" prop="state" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.state == 1'>待审核</span>
												<span v-if='scope.row.state == 2'>审核通过</span>
												<span v-if='scope.row.state == 3'>审核不通过</span>
												<span v-if='scope.row.state == 4'>问票中</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="上传人">
											<template slot-scope="scope">
												<span>{{scope.row.createPerson != null && !isNaN(scope.row.createPerson) && scope.row.createPerson.length == 11?scope.row.createPerson.slice(0,3) + '****' + scope.row.createPerson.slice(7,11):scope.row.createPerson}}</span>
											</template>
										</el-table-column>
							
										<el-table-column align="center" label="是否校验客户名称" prop="isCheckCustomerName" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.isCheckCustomerName == 1'>是</span>
												<span v-if='scope.row.isCheckCustomerName == 0'>否</span>
											</template>
										</el-table-column>
										<el-table-column align="center" :resizable="false" width="400">
											<template slot="header" slot-scope="scope">
												<span>操作</span>
											</template>
											<template slot-scope="scope">
												<div v-show='scope.row.accountantState != 1'>
													<el-tooltip class="item" effect="dark" :content="scope.row.remark2" placement="top" v-show='scope.row.remark2 != null && scope.row.remark2 != ""'>
														<i class="el-icon-warning"></i>
													</el-tooltip>
													<el-button size="mini" type="text" @click.stop="setCheck(scope.$index, scope.row)">{{scope.row.isCheckCustomerName == 1?"取消校验客户名称":"校验客户名称"}}</el-button>
													<el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,1,'issuedSign')">{{scope.row.issuedSign == 0?"设为代开":"取消代开"}}</el-button>
													
													
													
													<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>
													
													<el-dropdown size='mini' @command="val=>{handleApprove(val,scope.row)}" v-show="scope.row.accountantState == 2"
													 style='margin-left:8px'>
														<el-button class="el-dropdown-link" size='mini' type='text'>
															审核<i class="el-icon-arrow-down el-icon--right"></i>
														</el-button>
														<el-dropdown-menu slot="dropdown">
															<el-dropdown-item command="2">通过</el-dropdown-item>
															<el-dropdown-item command="3">不通过</el-dropdown-item>
														</el-dropdown-menu>
													</el-dropdown>
													<el-dropdown size='mini' @command="val=>{handleCommand1(val,scope.row)}" style='margin-left:8px'>
														<el-button class="el-dropdown-link" size='mini' type='text'>
															编辑类型<i class="el-icon-arrow-down el-icon--right"></i>
														</el-button>
														<el-dropdown-menu slot="dropdown">
															<el-dropdown-item command="0">收入</el-dropdown-item>
															<el-dropdown-item command="2">成本</el-dropdown-item>
															<el-dropdown-item command="1">费用</el-dropdown-item>
															<el-dropdown-item command="3">其他</el-dropdown-item>
															<el-dropdown-item command="4">未分配</el-dropdown-item>
														</el-dropdown-menu>
													</el-dropdown>
												</div>
												<div v-show='scope.row.accountantState == 1'>
													<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>
												</div>
											</template>
										</el-table-column>
									</el-table>
									<el-pagination background @current-change="((val)=>{handleCurrentChange3(val)})" :current-page="currentPage3"
									 :page-size="pageSize3" layout="total, prev, pager, next" :total="otherIncomeList.length">
									</el-pagination>
							
							
								</div>
							</el-collapse-item>
							<el-collapse-item name="three">
								<template slot="title">
								      其他进项票<span style="color: #F56C6C;">（{{otherCostSpecialList.length}}张）</span>
								</template>
								<div class=''>
							
									
									<el-table :data="otherCostSpecialList.slice((currentPage4 - 1)*10,(currentPage4 - 1)*10 + 10)" style="width: 100%;margin-top:10px" border v-loading='loading1'
									 @row-click='showDetail' ref='refTable' @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands"
									 @selection-change="handleSelectionChange111">
										<el-table-column type="expand">
											<template slot-scope="props">
												<div class='clearfix'>
													<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
														<h3>发票详情<el-button type="primary" size="mini" class='el-icon-refresh2' @click="rotate" style="font-size: 16px;margin-left: 12px;"></el-button>
														</h3>
														<div style="margin-top: 12px;">
															
															<img :src="images[0].url" alt="" :style="{ transform: 'rotate(' + num2*90 + 'deg)', transformOrigin:'50% 50%'}"
															 class="moimg">
							
							
														</div>
							
							
													</div>
													<div style='float:right;width: 500px;'>
														<div style='border:1px solid #efefef;box-sizing:border-box;margin:0px 10px;padding:10px 0px'>
															<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
																<el-form-item v-for='(item,index) in form' :label="item.fieldChName">
																	<el-input v-model='item.fieldValue' size="mini" v-show='item.type != 3 && item.type != 4 && item.type != 5 && item.type != 6 && item.type != 14 && item.type != 15'></el-input>
																	<el-select v-model="item.fieldValue" placeholder="请选择" clearable filterable v-show='item.type == 3'>
																		<el-option v-for="item in treeList" :label="item.ffullname" :value='item.ffullname'></el-option>
																	</el-select>
																	<el-select v-model="item.fieldValue" placeholder="请至少输入两个字符" clearable filterable remote reserve-keyword
																	 :remote-method="getTycNameMatchByName2do" v-show='item.type == 5' @change="((val)=>{getTycByName(val, index)})">
																		<el-option v-for="item in TycNameList" :label="item" :value='item' :key="item"></el-option>
																	</el-select>
																	<el-date-picker v-model="item.fieldValue" type="month" format="yyyy-MM" value-format="yyyy-MM" v-show='item.type == 4'>
																	</el-date-picker>
																	<el-input v-model='item.fieldValue' size="mini" v-show='item.type == 6' disabled></el-input>
																	<el-input value='无票收入 无票' size="mini" v-show='item.type == 15' disabled></el-input>
																	<el-select v-model="item.fieldValue" clearable v-show='item.type == 14'>
																		<el-option label="一般计税" value='一般计税'></el-option>
																		<el-option label="免税计税" value='免税计税'></el-option>
																	</el-select>
																</el-form-item>
							
																<div></div>
																<el-button size="mini" type="primary" style='width:100px' @click='updateSchedule'>保存</el-button>
															</el-form>
														</div>
														<div style='border:1px solid #efefef;box-sizing:border-box;margin:10px 10px'>
							
							
							
															<div style="margin-top: 4px;">
																<img :src="modelUrl" alt="" style="width:100%;vertical-align: bottom;margin-right: 20px;">
																
															</div>
															<div style='text-align: center;padding-bottom:12px'>
																<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
																	<el-form-item label="更换模板">
																		<el-select v-model="detail.documentType000" placeholder="请选择模板" clearable filterable @change='handleCommand'
																		 value-key='billId'>
																			<el-option v-for="item in modelList" :label="item.fieldChName" :value='item'></el-option>
																		</el-select>
							
																	</el-form-item>
							
																</el-form>
							
																<el-button size="mini" type="primary" @click='submitNoModel'>提交为新模板</el-button>
																<el-button size="mini" type="primary" plain @click='revocation'>撤销</el-button>
															</div>
														</div>
													</div>
												</div>
							
							
											</template>
										</el-table-column>
										
										<el-table-column align="center" type="index" :index="indexMethod">
										</el-table-column>
										
										<el-table-column align="center" label="发票类型" prop="typeName" :resizable="false"></el-table-column>
										<el-table-column align="center" label="发票号" prop="invoiceNum" :resizable="false"></el-table-column>
										<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
										<el-table-column align="center" label="上传时间" prop="createTime" :resizable="false">
											<template slot-scope="scope">
												<span>{{scope.row.createTime.slice(0,10)}}</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="修改时间" prop="updateTime" :resizable="false">
											<template slot-scope="scope">
												<span>{{scope.row.updateTime?scope.row.updateTime.slice(0,10):'--'}}</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否入账" prop="accountantState" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.accountantState == 1'>是</span>
												<span v-else>否</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否代开" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.issuedSign == 1'>是</span>
												<span v-if='scope.row.issuedSign == 0'>否</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否认证" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 1'>是</span>
												<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 0'>否</span>
												<span v-if='scope.row.typeName != "增值税专用发票"'>--</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="凭证类型" prop="documentType" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.documentType == 0'>收入</span>
												<span v-if='scope.row.documentType == 1'>费用</span>
												<span v-if='scope.row.documentType == 2'>成本</span>
												<span v-if='scope.row.documentType == 3'>其他</span>
												<span v-if='scope.row.documentType == 4'>未分配</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="状态" prop="state" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.state == 1'>待审核</span>
												<span v-if='scope.row.state == 2'>审核通过</span>
												<span v-if='scope.row.state == 3'>审核不通过</span>
												<span v-if='scope.row.state == 4'>问票中</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="上传人">
											<template slot-scope="scope">
												<span>{{scope.row.createPerson != null && !isNaN(scope.row.createPerson) && scope.row.createPerson.length == 11?scope.row.createPerson.slice(0,3) + '****' + scope.row.createPerson.slice(7,11):scope.row.createPerson}}</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否校验客户名称" prop="isCheckCustomerName" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.isCheckCustomerName == 1'>是</span>
												<span v-if='scope.row.isCheckCustomerName == 0'>否</span>
											</template>
										</el-table-column>
										<el-table-column align="center" :resizable="false" width="400">
											<template slot="header" slot-scope="scope">
												<span>操作</span>
											</template>
											<template slot-scope="scope">
												<div v-show='scope.row.accountantState != 1'>
													<el-tooltip class="item" effect="dark" :content="scope.row.remark2" placement="top" v-show='scope.row.remark2 != null && scope.row.remark2 != ""'>
														<i class="el-icon-warning"></i>
													</el-tooltip>
													<el-button size="mini" type="text" @click.stop="setCheck(scope.$index, scope.row)">{{scope.row.isCheckCustomerName == 1?"取消校验客户名称":"校验客户名称"}}</el-button>
													<el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,1,'issuedSign')">{{scope.row.issuedSign == 0?"设为代开":"取消代开"}}</el-button>
													
													<!-- <el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,2,'isCertification')"
													 v-show='scope.row.typeName == "增值税专用发票"'>{{scope.row.isCertification == 0?"设为认证":"取消认证"}}</el-button> -->
													
													
													<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>
													
													<el-dropdown size='mini' @command="val=>{handleApprove(val,scope.row)}" v-show="scope.row.accountantState == 2"
													 style='margin-left:8px'>
														<el-button class="el-dropdown-link" size='mini' type='text'>
															审核<i class="el-icon-arrow-down el-icon--right"></i>
														</el-button>
														<el-dropdown-menu slot="dropdown">
															<el-dropdown-item command="2">通过</el-dropdown-item>
															<el-dropdown-item command="3">不通过</el-dropdown-item>
														</el-dropdown-menu>
													</el-dropdown>
													
													<el-dropdown size='mini' @command="val=>{handleCommand1(val,scope.row)}" style='margin-left:8px'>
														<el-button class="el-dropdown-link" size='mini' type='text'>
															编辑类型<i class="el-icon-arrow-down el-icon--right"></i>
														</el-button>
														<el-dropdown-menu slot="dropdown">
															<el-dropdown-item command="0">收入</el-dropdown-item>
															<el-dropdown-item command="2">成本</el-dropdown-item>
															<el-dropdown-item command="1">费用</el-dropdown-item>
															<el-dropdown-item command="3">其他</el-dropdown-item>
														</el-dropdown-menu>
													</el-dropdown>
												</div>
												
												<div v-show='scope.row.accountantState == 1'>
													<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>
												</div>
											</template>
										</el-table-column>
									</el-table>
									<el-pagination background @current-change="((val)=>{handleCurrentChange4(val)})" :current-page="currentPage4"
									 :page-size="pageSize4" layout="total, prev, pager, next" :total="otherCostSpecialList.length">
									</el-pagination>
							
							
								</div>
							</el-collapse-item>
							
							<!-- <el-collapse-item name="four">
								<template slot="title">
								      旅客运输票<span style="color: #F56C6C;">（{{transportInvoiceList.length}}张）</span>
								</template>
								<div class=''>
							
									<el-table :data="transportInvoiceList.slice((currentPage10 - 1)*10,(currentPage10 - 1)*10 + 10)" style="width: 100%;margin-top:10px" border v-loading='loading1' @row-click='showDetail'
									 ref='refTable' @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands"
									 @selection-change="handleSelectionChange111">
										<el-table-column type="expand">
											<template slot-scope="props">
												<div class='clearfix'>
													<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
														<h3>发票详情<el-button type="primary" size="mini" class='el-icon-refresh' @click="rotate1" style="font-size: 16px;margin-left: 12px;"></el-button>
														</h3>
														<div style="margin-top: 12px;">
															
															<img :src="images[0].url" alt="" :style="{ transform: 'rotate(' + num1*90 + 'deg)', transformOrigin:'50% 50%'}"
															 class="moimg">
							
							
														</div>
							
							
													</div>
													<div style='float:right;width: 500px;'>
														<div style='border:1px solid #efefef;box-sizing:border-box;margin:0px 10px;padding:10px 0px'>
															<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
																<el-form-item v-for='(item,index) in form' :label="item.fieldChName">
																	<el-input v-model='item.fieldValue' size="mini" v-show='item.type != 3 && item.type != 4 && item.type != 5 && item.type != 6'></el-input>
																	<el-select v-model="item.fieldValue" placeholder="请选择" clearable filterable v-show='item.type == 3'>
																		<el-option v-for="item in treeList" :label="item.ffullname" :value='item.ffullname'></el-option>
																	</el-select>
																	<el-select v-model="item.fieldValue" placeholder="请至少输入两个字符" clearable filterable remote reserve-keyword
																	 :remote-method="getTycNameMatchByName2do" v-show='item.type == 5' @change="((val)=>{getTycByName(val, index)})">
																		<el-option v-for="item in TycNameList" :label="item" :value='item' :key="item"></el-option>
																	</el-select>
																	<el-date-picker v-model="item.fieldValue" type="month" format="yyyy-MM" value-format="yyyy-MM" v-show='item.type == 4'>
																	</el-date-picker>
																	<el-input v-model='item.fieldValue' size="mini" v-show='item.type == 6' disabled></el-input>
																</el-form-item>
							
																<div></div>
																<el-button size="mini" type="primary" style='width:100px' @click='updateSchedule'>保存</el-button>
															</el-form>
														</div>
														<div style='border:1px solid #efefef;box-sizing:border-box;margin:10px 10px'>
							
															<div style="margin-top: 4px;">
																<img :src="modelUrl" alt="" style="width:100%;vertical-align: bottom;margin-right: 20px;">
																
															</div>
															<div style='text-align: center;padding-bottom:12px'>
																<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
																	<el-form-item label="更换模板">
																		<el-select v-model="detail.documentType000" placeholder="请选择模板" clearable filterable @change='handleCommand'
																		 value-key='billId'>
																			<el-option v-for="item in modelList" :label="item.fieldChName" :value='item'></el-option>
																		</el-select>
							
																	</el-form-item>
							
																</el-form>
							
																<el-button size="mini" type="primary" @click='submitNoModel'>提交为新模板</el-button>
																<el-button size="mini" type="primary" plain @click='revocation'>撤销</el-button>
															</div>
														</div>
													</div>
												</div>
							
							
											</template>
										</el-table-column>
										
										
										<el-table-column align="center" type="index" :index="indexMethod">
										</el-table-column>
										<el-table-column align="center" label="发票类型" prop="typeName" :resizable="false"></el-table-column>
										<el-table-column align="center" label="发票号" prop="invoiceNum" :resizable="false"></el-table-column>
										<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
										<el-table-column align="center" label="上传时间" prop="createTime" :resizable="false">
											<template slot-scope="scope">
												<span>{{scope.row.createTime.slice(0,10)}}</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="修改时间" prop="updateTime" :resizable="false">
											<template slot-scope="scope">
												<span>{{scope.row.updateTime.slice(0,10)}}</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否入账" prop="accountantState" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.accountantState == 1'>是</span>
												<span v-else>否</span>
											</template>
										</el-table-column>
							
										<el-table-column align="center" label="是否代开" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.issuedSign == 1'>是</span>
												<span v-if='scope.row.issuedSign == 0'>否</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="是否认证" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 1'>是</span>
												<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 0'>否</span>
												<span v-if='scope.row.typeName != "增值税专用发票"'>--</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="凭证类型" prop="documentType" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.documentType == 0'>收入</span>
												<span v-if='scope.row.documentType == 1'>费用</span>
												<span v-if='scope.row.documentType == 2'>成本</span>
												<span v-if='scope.row.documentType == 3'>其他</span>
												<span v-if='scope.row.documentType == 4'>未分配</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="状态" prop="state" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.state == 1'>待审核</span>
												<span v-if='scope.row.state == 2'>审核通过</span>
												<span v-if='scope.row.state == 3'>审核不通过</span>
												<span v-if='scope.row.state == 4'>问票中</span>
											</template>
										</el-table-column>
										<el-table-column align="center" label="上传人">
											<template slot-scope="scope">
												<span>{{scope.row.createPerson != null && !isNaN(scope.row.createPerson) && scope.row.createPerson.length == 11?scope.row.createPerson.slice(0,3) + '****' + scope.row.createPerson.slice(7,11):scope.row.createPerson}}</span>
											</template>
										</el-table-column>
							
										<el-table-column align="center" label="是否校验客户名称" prop="isCheckCustomerName" :resizable="false">
											<template slot-scope="scope">
												<span v-if='scope.row.isCheckCustomerName == 1'>是</span>
												<span v-if='scope.row.isCheckCustomerName == 0'>否</span>
											</template>
										</el-table-column>
										<el-table-column align="center" :resizable="false" width="400">
											<template slot="header" slot-scope="scope">
												<span>操作</span>
											</template>
											<template slot-scope="scope">
												<div v-show='scope.row.accountantState != 1'>
													<el-tooltip class="item" effect="dark" :content="scope.row.remark2" placement="top" v-show='scope.row.remark2 != null && scope.row.remark2 != ""'>
														<i class="el-icon-warning"></i>
													</el-tooltip>
													<el-button size="mini" type="text" @click.stop="setCheck(scope.$index, scope.row)">{{scope.row.isCheckCustomerName == 1?"取消校验客户名称":"校验客户名称"}}</el-button>
													<el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,1,'issuedSign')">{{scope.row.issuedSign == 0?"设为代开":"取消代开"}}</el-button>
													
													
													
													<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>
													
													<el-dropdown size='mini' @command="val=>{handleApprove(val,scope.row)}" v-show="scope.row.accountantState == 2"
													 style='margin-left:8px'>
														<el-button class="el-dropdown-link" size='mini' type='text'>
															审核<i class="el-icon-arrow-down el-icon--right"></i>
														</el-button>
														<el-dropdown-menu slot="dropdown">
															<el-dropdown-item command="2">通过</el-dropdown-item>
															<el-dropdown-item command="3">不通过</el-dropdown-item>
														</el-dropdown-menu>
													</el-dropdown>
													<el-dropdown size='mini' @command="val=>{handleCommand1(val,scope.row)}" style='margin-left:8px'>
														<el-button class="el-dropdown-link" size='mini' type='text'>
															编辑类型<i class="el-icon-arrow-down el-icon--right"></i>
														</el-button>
														<el-dropdown-menu slot="dropdown">
															<el-dropdown-item command="0">收入</el-dropdown-item>
															<el-dropdown-item command="2">成本</el-dropdown-item>
															<el-dropdown-item command="1">费用</el-dropdown-item>
															<el-dropdown-item command="3">其他</el-dropdown-item>
															
														</el-dropdown-menu>
													</el-dropdown>
													<el-button size="mini" type="text" @click.stop="handleUnrelate(scope.$index, scope.row,0)">转至不相关</el-button>
												</div>
												<div v-show='scope.row.accountantState == 1'>
													<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>
												</div>
											</template>
										</el-table-column>
									</el-table>
									<el-pagination background @current-change="((val)=>{handleCurrentChange10(val)})" :current-page="currentPage10"
									 :page-size="pageSize10" layout="total, prev, pager, next" :total="transportInvoiceList.length">
									</el-pagination>
							
							
								</div>
							</el-collapse-item> -->

						</el-collapse>




					</el-tab-pane>
					<el-tab-pane label="非相关" name="2">
						<div class=''>

							
							<el-table :data="unrelated.slice((currentPage - 1)*10,(currentPage - 1)*10 + 10)" style="width: 100%;margin-top:10px" border v-loading='loading1' @row-click='showDetail'
							 ref='refTable' @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands" @selection-change="handleSelectionChange111">
								<el-table-column type="expand">
									<template slot-scope="props">
										<div class='clearfix'>
											<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
												<h3>发票详情<el-button type="primary" size="mini" class='el-icon-refresh' @click="rotate3" style="font-size: 16px;margin-left: 12px;"></el-button>
												</h3>
												<div style="margin-top: 12px;">
													
													<img :src="images[0].url" alt="" :style="{ transform: 'rotate(' + num3*90 + 'deg)', transformOrigin:'50% 50%'}"
													 class="moimg">
													
													


												</div>


											</div>
											<div style='float:right;width: 500px;'>
												<div style='border:1px solid #efefef;box-sizing:border-box;margin:0px 10px;padding:10px 0px'>
													<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
														<el-form-item v-for='(item,index) in form' :label="item.fieldChName">
															<el-input v-model='item.fieldValue' size="mini" v-show='item.type != 3 && item.type != 4 && item.type != 5 && item.type != 6 && item.type != 14 && item.type != 15'></el-input>
															<el-select v-model="item.fieldValue" placeholder="请选择" clearable filterable v-show='item.type == 3'>
																<el-option v-for="item in treeList" :label="item.ffullname" :value='item.ffullname'></el-option>
															</el-select>
															<el-select v-model="item.fieldValue" placeholder="请至少输入两个字符" clearable filterable remote reserve-keyword
															 :remote-method="getTycNameMatchByName2do" v-show='item.type == 5' @change="((val)=>{getTycByName(val, index)})">
																<el-option v-for="item in TycNameList" :label="item" :value='item' :key="item"></el-option>
															</el-select>
															<el-date-picker v-model="item.fieldValue" type="month" format="yyyy-MM" value-format="yyyy-MM" v-show='item.type == 4'>
															</el-date-picker>
															<el-input v-model='item.fieldValue' size="mini" v-show='item.type == 6' disabled></el-input>
															<el-input value='无票收入 无票' size="mini" v-show='item.type == 15' disabled></el-input>
															<el-select v-model="item.fieldValue" clearable v-show='item.type == 14'>
																<el-option label="一般计税" value='一般计税'></el-option>
																<el-option label="免税计税" value='免税计税'></el-option>
															</el-select>
														</el-form-item>

														<div></div>
														<el-button size="mini" type="primary" style='width:100px' @click='updateSchedule'>保存</el-button>
													</el-form>
												</div>
												<div style='border:1px solid #efefef;box-sizing:border-box;margin:10px 10px'>

													<div style="margin-top: 4px;">
														<img :src="modelUrl" alt="" style="width:100%;vertical-align: bottom;margin-right: 20px;">
														<!-- <el-button size="mini" type="primary">重新识别</el-button> -->
													</div>
													<div style='text-align: center;padding-bottom:12px'>
														<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
															<el-form-item label="更换模板">
																<el-select v-model="detail.documentType000" placeholder="请选择模板" clearable filterable @change='handleCommand'
																 value-key='billId'>
																	<el-option v-for="item in modelList" :label="item.fieldChName" :value='item'></el-option>
																</el-select>

															</el-form-item>

														</el-form>
														
														<el-button size="mini" type="primary" @click='submitNoModel'>提交为新模板</el-button>
														<el-button size="mini" type="primary" plain @click='revocation'>撤销</el-button>
													</div>
												</div>
											</div>
										</div>


									</template>
								</el-table-column>
								<!-- <el-table-column align="center" type="selection" width="55"> -->
								<!-- </el-table-column> -->
								<el-table-column align="center" type="index" :index="indexMethod">
								</el-table-column>
								<el-table-column align="center" label="发票类型" prop="typeName" :resizable="false"></el-table-column>
								<el-table-column align="center" label="发票号" prop="invoiceNum" :resizable="false"></el-table-column>
								<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
								<el-table-column align="center" label="上传时间" prop="createTime" :resizable="false">
									<template slot-scope="scope">
										<span>{{scope.row.createTime.slice(0,10)}}</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="修改时间" prop="updateTime" :resizable="false">
									<template slot-scope="scope">
										<span>{{scope.row.updateTime?scope.row.updateTime.slice(0,10):'--'}}</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="是否入账" prop="accountantState" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.accountantState == 1'>是</span>
										<span v-else>否</span>
									</template>
								</el-table-column>
								<!-- <el-table-column align="center" label="上传人" prop="effectivedate" :resizable="false"></el-table-column> -->
								<el-table-column align="center" label="是否代开" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.issuedSign == 1'>是</span>
										<span v-if='scope.row.issuedSign == 0'>否</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="是否认证" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 1'>是</span>
										<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 0'>否</span>
										<span v-if='scope.row.typeName != "增值税专用发票"'>--</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="凭证类型" prop="documentType" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.documentType == 0'>收入</span>
										<span v-if='scope.row.documentType == 1'>费用</span>
										<span v-if='scope.row.documentType == 2'>成本</span>
										<span v-if='scope.row.documentType == 3'>其他</span>
										<span v-if='scope.row.documentType == 4'>未分配</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="状态" prop="state" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.state == 1'>待审核</span>
										<span v-if='scope.row.state == 2'>审核通过</span>
										<span v-if='scope.row.state == 3'>审核不通过</span>
										<span v-if='scope.row.state == 4'>问票中</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="上传人">
									<template slot-scope="scope">
										<span>{{scope.row.createPerson != null && !isNaN(scope.row.createPerson) && scope.row.createPerson.length == 11?scope.row.createPerson.slice(0,3) + '****' + scope.row.createPerson.slice(7,11):scope.row.createPerson}}</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="是否校验客户名称" prop="isCheckCustomerName" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.isCheckCustomerName == 1'>是</span>
										<span v-if='scope.row.isCheckCustomerName == 0'>否</span>
									</template>
								</el-table-column>

								<el-table-column align="center" :resizable="false" width="400">
									<template slot="header" slot-scope="scope">
										<span>操作</span>
									</template>
									<template slot-scope="scope">
										
										<div v-show='scope.row.accountantState != 1'>
											<el-tooltip class="item" effect="dark" :content="scope.row.remark2" placement="top" v-show='scope.row.remark2 != null && scope.row.remark2 != ""'>
												<i class="el-icon-warning"></i>
											</el-tooltip>
											<el-button size="mini" type="text" @click.stop="setCheck(scope.$index, scope.row)">{{scope.row.isCheckCustomerName == 1?"取消校验客户名称":"校验客户名称"}}</el-button>
											<el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,1,'issuedSign')"
											 v-show='scope.row.typeName == "增值税专用发票" || scope.row.typeName == "增值税普通发票"'>{{scope.row.issuedSign == 0?"设为代开":"取消代开"}}</el-button>
											<!-- <el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,2,'isCertification')"
											 v-show='scope.row.typeName == "增值税专用发票"'>{{scope.row.isCertification == 0?"设为认证":"取消认证"}}</el-button> -->
											<!-- <el-button size="mini" type="text" @click.stop="showconnectMain(scope.$index, scope.row)">关联清单</el-button>
											<el-button size="mini" type="text" @click.stop="showconnectMain1(scope.$index, scope.row)" v-show="scope.row.isMaster.length > 0">查看清单</el-button>
											<el-button size="mini" type="text" @click.stop="selectAllQuestions(scope.$index, scope.row)" v-show="scope.row.state == 1">问票</el-button>
											<el-button size="mini" type="text" @click.stop="getAnswer(scope.$index, scope.row)">问票结果</el-button> -->
											
											<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>
											
											<el-dropdown size='mini' @command="val=>{handleApprove(val,scope.row)}" v-show="scope.row.accountantState == 2"
											 style='margin-left:8px'>
												<el-button class="el-dropdown-link" size='mini' type='text'>
													审核<i class="el-icon-arrow-down el-icon--right"></i>
												</el-button>
												<el-dropdown-menu slot="dropdown">
													<el-dropdown-item command="2">通过</el-dropdown-item>
													<el-dropdown-item command="3">不通过</el-dropdown-item>
												</el-dropdown-menu>
											</el-dropdown>
											
											<el-dropdown size='mini' @command="val=>{handleCommand1(val,scope.row)}" style='margin-left:8px'>
												<el-button class="el-dropdown-link" size='mini' type='text'>
													编辑类型<i class="el-icon-arrow-down el-icon--right"></i>
												</el-button>
												<el-dropdown-menu slot="dropdown">
													<el-dropdown-item command="0">收入</el-dropdown-item>
													<el-dropdown-item command="2">成本</el-dropdown-item>
													<el-dropdown-item command="1">费用</el-dropdown-item>
													<el-dropdown-item command="3">其他</el-dropdown-item>
													<!-- <el-dropdown-item command="4">未分配</el-dropdown-item> -->
												</el-dropdown-menu>
											</el-dropdown>
											<el-button size="mini" type="text" @click.stop="handleUnrelate(scope.$index, scope.row,1)" v-show='scope.row.remark4 == 0'>转至相关</el-button>
										</div>
										<div v-show='scope.row.accountantState == 1'>
											<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>
										</div>
									</template>
								</el-table-column>
							</el-table>
							
							<el-pagination background @current-change="((val)=>{handleCurrentChange(val)})" :current-page="currentPage"
							 :page-size="pageSize" layout="total, prev, pager, next" :total="unrelated.length">
							</el-pagination>



						</div>



					</el-tab-pane>


					<el-tab-pane label="未通过" name="3">
						<div class=''>
							<el-table :data="notPassCheckList.slice((currentPage5 - 1)*10,(currentPage5 - 1)*10 + 10)" style="width: 100%;margin-top:10px" border v-loading='loading1' @row-click='showDetail'
							 ref='refTable' @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands" @selection-change="handleSelectionChange111">
								<el-table-column type="expand">
									<template slot-scope="props">
										<div class='clearfix'>
											<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
												<h3>发票详情<el-button type="primary" size="mini" class='el-icon-refresh' @click="rotate4" style="font-size: 16px;margin-left: 12px;"></el-button>
												</h3>
												<div style="margin-top: 12px;">
													
													<img :src="images[0].url" alt="" :style="{ transform: 'rotate(' + num4*90 + 'deg)', transformOrigin:'50% 50%'}"
													 class="moimg">
													


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
												<div style='border:1px solid #efefef;box-sizing:border-box;margin:10px 10px'>

													<div style="margin-top: 4px;">
														<img :src="modelUrl" alt="" style="width:100%;vertical-align: bottom;margin-right: 20px;">
														<!-- <el-button size="mini" type="primary">重新识别</el-button> -->
													</div>

												</div>
											</div>
										</div>


									</template>
								</el-table-column>
								<!-- <el-table-column align="center" type="selection" width="55"> -->
								<!-- </el-table-column> -->
								<el-table-column align="center" type="index" :index="indexMethod">
								</el-table-column>
								<el-table-column align="center" label="发票类型" prop="typeName" :resizable="false"></el-table-column>
								<el-table-column align="center" label="发票号" prop="invoiceNum" :resizable="false"></el-table-column>
								<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
								<el-table-column align="center" label="上传时间" prop="createTime" :resizable="false">
									<template slot-scope="scope">
										<span>{{scope.row.createTime.slice(0,10)}}</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="修改时间" prop="updateTime" :resizable="false">
									<template slot-scope="scope">
										<span>{{scope.row.updateTime?scope.row.updateTime.slice(0,10):'--'}}</span>
									</template>
								</el-table-column>
								<!-- <el-table-column align="center" label="上传人" prop="effectivedate" :resizable="false"></el-table-column> -->
								<el-table-column align="center" label="是否代开" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.issuedSign == 1'>是</span>
										<span v-if='scope.row.issuedSign == 0'>否</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="是否认证" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 1'>是</span>
										<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 0'>否</span>
										<span v-if='scope.row.typeName != "增值税专用发票"'>--</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="凭证类型" prop="documentType" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.documentType == 0'>收入</span>
										<span v-if='scope.row.documentType == 1'>费用</span>
										<span v-if='scope.row.documentType == 2'>成本</span>
										<span v-if='scope.row.documentType == 3'>其他</span>
										<span v-if='scope.row.documentType == 4'>未分配</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="状态" prop="state" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.state == 1'>待审核</span>
										<span v-if='scope.row.state == 2'>审核通过</span>
										<span v-if='scope.row.state == 3'>审核不通过</span>
										<span v-if='scope.row.state == 4'>问票中</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="不通过原因" prop="remark1" :resizable="false">
									<template slot-scope="scope">
										<span>{{scope.row.remark1}}</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="上传人">
									<template slot-scope="scope">
										<span>{{scope.row.createPerson != null && !isNaN(scope.row.createPerson) && scope.row.createPerson.length == 11?scope.row.createPerson.slice(0,3) + '****' + scope.row.createPerson.slice(7,11):scope.row.createPerson}}</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="是否校验客户名称" prop="isCheckCustomerName" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.isCheckCustomerName == 1'>是</span>
										<span v-if='scope.row.isCheckCustomerName == 0'>否</span>
									</template>
								</el-table-column>
								<el-table-column align="center" :resizable="false" width="400">
									<template slot="header" slot-scope="scope">
										<span>操作</span>
									</template>
									<template slot-scope="scope">
										<!-- <el-tooltip class="item" effect="dark" :content="scope.row.remark2" placement="top" v-show='scope.row.remark2 != null && scope.row.remark2 != ""'>
											<i class="el-icon-warning"></i>
										</el-tooltip> -->

										<!-- <el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,1,'issuedSign')" v-show='scope.row.typeName == "增值税专用发票" || scope.row.typeName == "增值税普通发票"'>{{scope.row.issuedSign == 0?"设为代开":"取消代开"}}</el-button> -->
										<!-- <el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,2,'isCertification')"
										 v-show='scope.row.typeName == "增值税专用发票"'>{{scope.row.isCertification == 0?"设为认证":"取消认证"}}</el-button> -->
										<!-- <el-button size="mini" type="text" @click.stop="showconnectMain(scope.$index, scope.row)">关联清单</el-button>
										<el-button size="mini" type="text" @click.stop="showconnectMain1(scope.$index, scope.row)" v-show="scope.row.isMaster.length > 0">查看清单</el-button>
										<el-button size="mini" type="text" @click.stop="selectAllQuestions(scope.$index, scope.row)" v-show="scope.row.state == 1">问票</el-button>
										<el-button size="mini" type="text" @click.stop="getAnswer(scope.$index, scope.row)">问票结果</el-button> -->

										<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>

									</template>
								</el-table-column>
							</el-table>
							<el-pagination background @current-change="((val)=>{handleCurrentChange5(val)})" :current-page="currentPage5"
							 :page-size="pageSize5" layout="total, prev, pager, next" :total="notPassCheckList.length">
							</el-pagination>


						</div>



					</el-tab-pane>

					<el-tab-pane label="未认证" name="4">
						<div class=''>
							<el-table :data="noCertificationList.slice((currentPage6 - 1)*10,(currentPage6 - 1)*10 + 10)" style="width: 100%;margin-top:10px" border v-loading='loading1' @row-click='showDetail'
							 ref='refTable' @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands" @selection-change="handleSelectionChange111">
								<el-table-column type="expand">
									<template slot-scope="props">
										<div class='clearfix'>
											<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
												<h3>发票详情<el-button type="primary" size="mini" class='el-icon-refresh' @click="rotate4" style="font-size: 16px;margin-left: 12px;"></el-button>
												</h3>
												<div style="margin-top: 12px;">
													
													<img :src="images[0].url" alt="" :style="{ transform: 'rotate(' + num4*90 + 'deg)', transformOrigin:'50% 50%'}"
													 class="moimg">
													
					
					
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
												<div style='border:1px solid #efefef;box-sizing:border-box;margin:10px 10px'>
					
													<div style="margin-top: 4px;">
														<img :src="modelUrl" alt="" style="width:100%;vertical-align: bottom;margin-right: 20px;">
														<!-- <el-button size="mini" type="primary">重新识别</el-button> -->
													</div>
					
												</div>
											</div>
										</div>
					
					
									</template>
								</el-table-column>
								<!-- <el-table-column align="center" type="selection" width="55"> -->
								<!-- </el-table-column> -->
								<el-table-column align="center" type="index" :index="indexMethod">
								</el-table-column>
								<el-table-column align="center" label="发票类型" prop="typeName" :resizable="false"></el-table-column>
								<el-table-column align="center" label="发票号" prop="invoiceNum" :resizable="false"></el-table-column>
								<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
								<el-table-column align="center" label="上传时间" prop="createTime" :resizable="false">
									<template slot-scope="scope">
										<span>{{scope.row.createTime.slice(0,10)}}</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="修改时间" prop="updateTime" :resizable="false">
									<template slot-scope="scope">
										<span>{{scope.row.updateTime?scope.row.updateTime.slice(0,10):'--'}}</span>
									</template>
								</el-table-column>
								<!-- <el-table-column align="center" label="上传人" prop="effectivedate" :resizable="false"></el-table-column> -->
								<el-table-column align="center" label="是否代开" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.issuedSign == 1'>是</span>
										<span v-if='scope.row.issuedSign == 0'>否</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="是否认证" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 1'>是</span>
										<span v-if='scope.row.typeName == "增值税专用发票" && scope.row.isCertification == 0'>否</span>
										<span v-if='scope.row.typeName != "增值税专用发票"'>--</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="凭证类型" prop="documentType" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.documentType == 0'>收入</span>
										<span v-if='scope.row.documentType == 1'>费用</span>
										<span v-if='scope.row.documentType == 2'>成本</span>
										<span v-if='scope.row.documentType == 3'>其他</span>
										<span v-if='scope.row.documentType == 4'>未分配</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="状态" prop="state" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.state == 1'>待审核</span>
										<span v-if='scope.row.state == 2'>审核通过</span>
										<span v-if='scope.row.state == 3'>审核不通过</span>
										<span v-if='scope.row.state == 4'>问票中</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="不通过原因" prop="remark1" :resizable="false">
									<template slot-scope="scope">
										<span>{{scope.row.remark1}}</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="上传人">
									<template slot-scope="scope">
										<span>{{scope.row.createPerson != null && !isNaN(scope.row.createPerson) && scope.row.createPerson.length == 11?scope.row.createPerson.slice(0,3) + '****' + scope.row.createPerson.slice(7,11):scope.row.createPerson}}</span>
									</template>
								</el-table-column>
								<el-table-column align="center" label="是否校验客户名称" prop="isCheckCustomerName" :resizable="false">
									<template slot-scope="scope">
										<span v-if='scope.row.isCheckCustomerName == 1'>是</span>
										<span v-if='scope.row.isCheckCustomerName == 0'>否</span>
									</template>
								</el-table-column>
								<el-table-column align="center" :resizable="false" width="400">
									<template slot="header" slot-scope="scope">
										<span>操作</span>
									</template>
									<template slot-scope="scope">
										<!-- <el-tooltip class="item" effect="dark" :content="scope.row.remark2" placement="top" v-show='scope.row.remark2 != null && scope.row.remark2 != ""'>
											<i class="el-icon-warning"></i>
										</el-tooltip> -->
					
										<!-- <el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,1,'issuedSign')" v-show='scope.row.typeName == "增值税专用发票" || scope.row.typeName == "增值税普通发票"'>{{scope.row.issuedSign == 0?"设为代开":"取消代开"}}</el-button> -->
										<el-button size="mini" type="text" @click.stop="setCertification1(scope.$index, scope.row,2,'isCertification')"
										 >{{scope.row.isCertification == 0?"设为认证":"取消认证"}}</el-button>
										<!-- <el-button size="mini" type="text" @click.stop="showconnectMain(scope.$index, scope.row)">关联清单</el-button>
										<el-button size="mini" type="text" @click.stop="showconnectMain1(scope.$index, scope.row)" v-show="scope.row.isMaster.length > 0">查看清单</el-button>
										<el-button size="mini" type="text" @click.stop="selectAllQuestions(scope.$index, scope.row)" v-show="scope.row.state == 1">问票</el-button>
										<el-button size="mini" type="text" @click.stop="getAnswer(scope.$index, scope.row)">问票结果</el-button> -->
					
										<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>
					
									</template>
								</el-table-column>
							</el-table>
							<el-pagination background @current-change="((val)=>{handleCurrentChange6(val)})" :current-page="currentPage6"
							 :page-size="pageSize6" layout="total, prev, pager, next" :total="noCertificationList.length">
							</el-pagination>
					
					
						</div>
					
					
					
					</el-tab-pane>
				</el-tabs>

			</div>
		</div>






		<el-dialog title="问票" :visible.sync="dialogVisible1" width="700px" class='dialog'>
			<el-collapse v-model="activeNames" @change="handleChange">
				<el-collapse-item v-for='(item,index) in ticketTableList' :title="item.typeName" :name="index">
					<div>
						<el-checkbox-group v-model="checkList">
							<div v-for='li in item.questions'>
								<el-checkbox :label="li.questionId" :key='li.questionId'>{{li.questionName}}</el-checkbox>
							</div>

						</el-checkbox-group>
					</div>
				</el-collapse-item>

			</el-collapse>



			<div class='btn_contain clearfix'>
				<span class='commit' @click="commitTicket">确定</span>
			</div>
		</el-dialog>
		<el-dialog title="问票结果" :visible.sync="dialogVisible2" width="600px" class='dialog'>
			<div style='padding: 10px;'>
				<el-table :data="gridData">
					<el-table-column prop="questionContent" label="问题" align="center"></el-table-column>
					<el-table-column prop="answerContent" label="答案" align="center"></el-table-column>
					<el-table-column prop="ticketUser" label="问票人" align="center"></el-table-column>
				</el-table>
			</div>

		</el-dialog>

		<el-dialog title="货物(劳务)比对" :visible.sync="dialogVisible3" width="100%" class='dialog'>
			<div class='clearfix'>
				<div style='float:left;width:700px'>
					<img :src='rowDetail.imageUrl' width='700px' />
				</div>
				<div style='float:right;width:calc(100% - 712px)'>
					<el-button type='primary' size='mini' @click='addLine'>新增</el-button>
					<el-table :data="rowDetail.itemResults" style='margin-top: 10px;'>
						<el-table-column align="center" v-for='(item,index) in rowDetail.fieldResults' :prop="item.fieldName" :label="item.fieldChName"
						 :width="index == 0?'250px':'' ">
							<template slot-scope="scope">
								<div v-show='item.type != 10' contenteditable="true" v-text="scope.row[item.fieldName]" @blur='handleInput(scope.$index, item.fieldName,$event)'></div>
								<el-select size="mini" v-model="scope.row[item.fieldName]" placeholder="请选择" clearable filterable  @change="((val,index)=>{handleSelect(val,scope.$index)})"
								 v-show='item.type == 10'>
									<el-option label="印花税" value='印花税'></el-option>
									<el-option label="增值税" value='增值税'></el-option>
									<el-option label="城市维护建设税" value='城市维护建设税'></el-option>
									<el-option label="教育费附加" value='教育费附加'></el-option>
									<el-option label="地方教育费附加" value='地方教育费附加'></el-option>
									<el-option label="个人所得税" value='个人所得税'></el-option>
									<el-option label="企业所得税" value='企业所得税'></el-option>
									<el-option label="其他税项" value='其他税项'></el-option>
									<el-option label="社保" value='社保'></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column align="center" label="操作" width='120px'>
							<template slot-scope="scope">

								<el-button size="mini" type="text" v-show='!scope.row.resultIdList' @click.stop="handleAdd(scope.$index, scope.row)">确定新增</el-button>
								<el-button size="mini" type="text" v-show='scope.row.resultIdList' @click.stop="handleModify(scope.$index, scope.row)">确定修改</el-button>
								<el-button size="mini" type="text" @click.stop="handleDelete(scope.$index, scope.row)">删除</el-button>

							</template>
						</el-table-column>


					</el-table>
				</div>
			</div>



		</el-dialog>


		<el-dialog title="个别计价法列表" :visible.sync="dialogVisible4" width="1000px" class='dialog'>
			<div>
				<el-table :data="results" style='margin-top: 10px;'>
					<el-table-column align="center" prop="goodsName" label="品名"></el-table-column>
					<el-table-column align="center" prop="specification" label="规格"></el-table-column>
					<el-table-column align="center" prop="fmeasureunit" label="单位"></el-table-column>
					<el-table-column align="center" prop="fquantity" label="销售数量"></el-table-column>
					<el-table-column align="center" prop="funitprice" label="进货单价"></el-table-column>
					<el-table-column align="center" prop="famount" label="成本金额"></el-table-column>

				</el-table>
			</div>

		</el-dialog>

		<el-dialog title="未分配发票" :visible.sync="dialogVisible5" width="1000px" class='dialog'>
			<div>
				<el-table :data="itemresult" style='margin-top: 10px;' @selection-change="handleSelectionChange">
					<el-table-column align="center" type="selection" width="55"></el-table-column>
					<el-table-column align="center" prop="typeName" label="发票名称"></el-table-column>
					<el-table-column align="center" prop="amount" label="金额"></el-table-column>
					<el-table-column align="center" prop="createTime" label="上传时间">
						<template slot-scope="scope">
							<span>{{scope.row.createTime.slice(0,10)}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="state" label="状态">
						<template slot-scope="scope">
							<span v-if='scope.row.state == 1'>待审核</span>
							<span v-if='scope.row.state == 2'>审核通过</span>
							<span v-if='scope.row.state == 3'>审核不通过</span>
							<span v-if='scope.row.state == 4'>问票中</span>
						</template>
					</el-table-column>

				</el-table>
				<div class='btn_contain clearfix'>
					<span class='commit' @click="commitFP">确定</span>
				</div>
			</div>

		</el-dialog>

		<el-dialog title="查看清单" :visible.sync="dialogVisible6" width="100%" class='dialog'>

			<div class='clearfix'>
				<div v-for='(items,index) in itemresult1' class='clearfix' v-show='index == currentQD - 1'>
					<div>
						<el-button type="text" @click='prePageQD' :disabled='currentQD == 1'>上一张</el-button>
						<el-button type="text" @click='nextPageQD' :disabled='currentQD > itemresult1.length - 1'>下一张</el-button>
					</div>
					<div style='float:left;width:700px'>
						<img :src='items.imageUrl' width='700px' />
					</div>
					<div style='float:right;width:calc(100% - 712px)'>
						<el-button type="primary" size='mini' @click='cancelConnectMain(items,index)'>取消关联</el-button>
						<el-table :data="items.itemResults" style='margin-top: 10px;'>
							<el-table-column align="center" v-for='(item,index) in items.fieldResults' :prop="item.fieldName" :label="item.fieldChName"
							 :width="index == 0?'250px':'' ">
								<template slot-scope="scope">
									<!-- <div contenteditable="true" v-text="scope.row[item.fieldName]" @blur='handleInput(scope.$index, item.fieldName,$event)'></div> -->
									<div v-text="scope.row[item.fieldName]"></div>
								</template>
							</el-table-column>

						</el-table>
					</div>

				</div>



			</div>
			<div class='btn_contain clearfix'>
				<span class='commit' @click="closeFP">确定</span>
			</div>



		</el-dialog>

		<el-dialog title="上传" :visible.sync="dialogVisible100" width="400px" class='dialog'>
		
			<el-form :inline="true" ref="ruleForm1" :model="detail" class="demo-form-inline" label-width="100px" size="mini">
				<el-form-item label="公司" prop="item" class='uploadItem'>
					<!-- <el-autocomplete class="inline-input" v-model="uploadData.customerName" :fetch-suggestions="querySearch"
						 placeholder="请输入客户名称" @select="handleSelect"></el-autocomplete> -->
					<el-input v-model="$route.query.customerName" disabled>
						
						
					</el-input>
					
				</el-form-item>
				<el-form-item label="账期" prop="accountPeriod">
					<el-input v-model="$route.query.accountPeriod" disabled>
					</el-input>
				</el-form-item>
				
				
				
				<el-form-item label="发票" prop="fileList" class='uploadItem'>
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove1" :on-change="onChange1" :on-success="handleSuccess"
					 action='#' :on-error="handleError" :auto-upload="false" :before-remove="beforeRemove" multiple :limit="20"
					 :on-exceed="handleExceed" :file-list="fileList" :data='postData'>
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>
					<span style='position: absolute;left: 100px;top: 0px;color:red'>{{fileList.length}}张</span>
				</el-form-item>
				
			</el-form>
		
			<div class='btn_contain clearfix'>
				<el-button type="primary" @click="commitUpload">确定</el-button>
				<!-- <span class='commit' @click="commitUpload">确定</span> -->
			</div>
		</el-dialog>
	</div>
</template>

<script>
	// import PlanDialog from "../components/common/planDialog.vue"
	export default {
		name: "customer",
		data() {
			return {
				incomeTaxCollectionMethod:'',
				isCanSubmit:false,
				fileList:[],
				postData:{},
				
				canSubmit:true,
				inputSpecialAmount:0,
				ruleForm: {},
				ruleForm1: {
					incomeAmount: 0,
					incomeNotTaxAmount: 0,
					outputSpecialAmount: 0,
					outputSpecialTax: 0,
					outputNormalAmount: 0,
					outputNormalTax: 0,
					inputSpecialAmount: 0,
					inputSpecialTax: 0,
					inputSpecialNumber: 0,
					transportTaxAmount: 0,
					transportNoTaxAmount: 0,
				},
				ruleForm2: {},
				unrelated: [],
				notPassCheckList: [],
				noCertificationList: [],
				certificationPreviousList: [],
				relatedincome: [],
				relatedcostSpecial: [],
				otherCostSpecialList:[],
				otherIncomeList:[],
				transportInvoiceList:[],
				detailList: [],
				TyList: [],
				TycNameList: [],
				currentQD: 1,
				results: [],
				tabname: '0',
				rowDetail: [],
				gridData: [],
				checkList: [],
				temscheduleId: '',
				activeName: "0",
				activeName1: "",
				activeNames: [0],
				ticketTableList: [],
				pageTag: 0,
				images: [],
				hideUpload: false,
				modelUrl: '',
				picData: {
					scheduleType: 1,
					scheduleId: '',
					imageUrl: ''
				},
				fvoucheridErp: '',
				customerId: '',
				accountPeriod: '',
				customerName: '',
				tableData3: [],
				dialogVisiblePic: false,
				dialogImageUrl: '',
				tag: 0,
				accountantId: '',
				scheduleId: "",
				scheduleType: '',
				modelList: [],
				form: [],
				serviceitem: [],
				color: [
					"#409EFF", "#67C23A", "#E6A23C", "#F56C6C"
				],
				uploadData: {},
				list: [{}, {}],
				fileList: [],
				loading1: false,
				nameData: ['审核通过', '审核未通过', '未审核'],
				formInline1: {
					bankname: '',
					typecode: ''
				},
				detail: {},
				dialogVisible: false,
				dialogVisible1: false,
				dialogVisible2: false,
				dialogVisible3: false,
				dialogVisible4: false,
				dialogVisible5: false,
				dialogVisible6: false,
				dialogVisible100:false,
				servItemList: [],
				itemList: [],
				total: 0,
				pageSize: 10,
				currentPage: 1,
				
				pageSize1: 10,
				currentPage1: 1,
				
				pageSize2: 10,
				currentPage2: 1,
				
				pageSize3: 10,
				currentPage3: 1,
				
				pageSize4: 10,
				currentPage4: 1,
				
				pageSize5: 10,
				currentPage5: 1,
				
				pageSize6: 10,
				currentPage6: 1,
				
				pageSize7: 10,
				currentPage7: 1,
				
				pageSize10: 10,
				currentPage10: 1,
				
				trueOrFalse: [{
						label: "是",
						value: 1,
					},
					{
						label: "否",
						value: 0,
					}
				],
				iscomeorgov: [],
				contractTypeList: [],
				contractTaxTypeList: [],
				customerList: [],
				taxmethodList: [],
				customertypeList: [],
				employList: [],
				expands: [],
				getRowKeys(row) {
					return row.scheduleId
				},
				itemresult: [],
				itemresult1: [],
				multipleSelection: [],
				multipleSelection111: [],
				treeList: [],
				num1: 0,
				num2: 0,
				num3: 0,
				num4: 0,

			}
		},
		components: {
			// PlanDialog
		},
		methods: {
			indexMethod(index) {
				return index + 1;
			},
			rotate1() {
				this.num1++;
			},
			rotate2() {
				this.num2++;
			},
			rotate3() {
				this.num3++;
			},
			rotate4() {
				this.num4++;
			},
			
			selectPic() {
				this.dialogVisible100 = true;
			},
			handleRemove1(file, fileList) {
				console.log(file, fileList);
				this.fileList = fileList;
			},
			onChange1(file, fileList) { //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
				let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
				if (existFile) {
					this.$message.error('当前文件已经存在!');
					fileList.pop()
				}
				this.fileList = fileList
			},
			handleSuccess(response) {
				if (response.code == 200) {
					this.fileList = [];
					this.$message({
						message: response.msg,
						type: "success"
					});
					this.dialogVisible = false;
				} else {
					this.fileList = [];
					this.$message({
						message: response.msg || "上传文件失败！",
						type: "error"
					});
				}
			},
			handleError(err) {
				this.fileList = [];
				this.$message({
					message: "上传文件失败！",
					type: "error"
				});
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 200 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			commitUpload() {
				if (this.fileList.length == 0) {
					this.$message({
						message: '请选择发票',
						type: 'error'
					});
				} else {
					
					var _this = this;
					var formData = new FormData(); //  用FormData存放上传文件
					
							this.fileList.forEach(file => {
								formData.append('file', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 
	
							})
							
					
					console.log(formData);
					for (var x in _this.postData) {
						formData.append(x, _this.postData[x]);
					}
					this.axios
						.post("/perTaxToolTwo/iocr/identify/uploadPictureAtInvoiceCheck", formData, {
							headers: {
								'Content-Type': 'application/x-www-form-urlencoded'
							}
						}).then(res => { //手动上传貌似无法触发成功或失败的钩子函数，因此这里手动调用 
							if (res.data.code == 200) {
								this.reset();
	
								this.dialogVisible100 = false;
								this.queryList();
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
							} else {
								
								this.fileList = [];
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
						}).catch(err => {
							
							this.fileList = [];
							this.$message({
								message: "系统繁忙，请稍后重试",
								type: "error"
							});
						})
						
				}
			
			
			},
			
			reset() {
				this.fileList = [];
			},
			
			
			zeroCommit(){
				let params = {
				  "list": [{
				   "customerId": this.$route.query.customerId,
				   "assignTime": this.$route.query.accountPeriod,
				  }]
				};
				this.axios.post('/perTaxToolTwo/import/autoCheckout', params).then(res => {
					if(res.data.code == 200){
						this.queryList();
						this.$message({
							message: res.data.msg,
							type: 'success'
						});
					}
				
				}).catch(function(err) {
					this.$message({
						message: '操作失败',
						type: 'error'
					});
				})
			},
			
			checkNameForTransport(){
				let params = this.otherCostSpecialList;
				this.axios.post('/perTaxToolTwo/iocr/main/checkNameForTransport', params).then(res => {
					if (res.data.code == 200) {
						this.canSubmit = false;
						this.$message({
							message: res.data.msg,
							type: 'success'
						});
					} else {
						this.canSubmit = true;
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				
				}).catch(function(err) {
					this.$message({
						message: '校验失败',
						type: 'error'
					});
				})
			},
			openCommit() {
				this.$confirm('确定提交审核?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = [{
						"mainId": this.$route.query.mainId,
						"remark3": 1,
						customerId: this.$route.query.customerId,
						accountPeriod: this.$route.query.accountPeriod,
						// inputSpecialAmount:this.ruleForm.inputSpecialAmount - this.ruleForm1.inputSpecialAmount
						inputSpecialAmount:this.inputSpecialAmount
					}];
					this.axios.post('/perTaxToolTwo/iocr/identify/submitUpload', params).then(res => {
						if (res.data.code == 200) {
							// this.queryList();
							// this.tableList = res.data.data.contractServiceProjectList;
							// this.$message({
							// 	message: res.data.msg,
							// 	type: 'success'
							// });
							this.$router.push({ //核心语句
								path: '/financeCalculateCenter/invoiceDetailAgain', //跳转的路径
								query: { //路由传参时push和query搭配使用 ，作用时传递参数
									// id: row.mainId,

								}
							})
						} else {
							this.$message({
								message: res.data.msg,
								type: 'error'
							});
						}

					}).catch(function(err) {
						this.$message({
							message: '提交失败',
							type: 'error'
						});
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消提交审核'
					});
				});
			},

			queryList() {
				let param = {
					mainId: this.$route.query.mainId,

				};
				this.axios.post('/perTaxToolTwo/iocr/main/getCheckListDetail2', param).then(res => {
					if (res.data.code == 200) {
						this.ruleForm = res.data.data;
						this.relatedincome = res.data.data.related.income ? res.data.data.related.income : [];
						this.relatedcostSpecial = res.data.data.related.costSpecial ? res.data.data.related.costSpecial : [];
						this.otherCostSpecialList = res.data.data.related.otherCostSpecialList ? res.data.data.related.otherCostSpecialList : [];
						this.otherIncomeList = res.data.data.related.otherIncomeList ? res.data.data.related.otherIncomeList : [];
						this.unrelated = res.data.data.uncorrelated;
						this.notPassCheckList = res.data.data.notPassCheckList;
						this.noCertificationList = res.data.data.noCertificationList;
						this.certificationPreviousList = res.data.data.certificationPreviousList;
						this.transportInvoiceList = res.data.data.related.transportInvoiceList ? res.data.data.related.transportInvoiceList : [];
						this.isCanSubmit = res.data.data.isCanSubmit;
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
						message: '设置失败',
						type: 'error'
					});
				})
			},
			
			setCertification1(index, row, type, val) {
				let param = {
					"identificationType": row.isCertification == 0 ? 1 : 2,
					scheduleId: row.scheduleId,
					mainId: this.$route.query.mainId,
				};
				this.axios.post('/perTaxToolTwo/iocr/main/Identification', param).then(res => {
					if (res.data.code == 200) {
						this.queryList();
			
			
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
						message: '设置失败',
						type: 'error'
					});
				})
			},
			
			setCertification(index, row, type, val) {
				let param = {
					// "accountantId": 0,
					"type": type,
					"value": row[val] == 0 ? 1 : 0,
					customerName: this.$route.query.customerName,
					list: [row.scheduleId]
				};
				this.axios.post('/perTaxToolTwo/iocr/main/updateSign', param).then(res => {
					if (res.data.code == 200) {
						this.queryList();


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
						message: '设置失败',
						type: 'error'
					});
				})
			},

			setCheck(index, row) {
				let param = {
					// "accountantId": 0,
					"scheduleId": row.scheduleId,
					"isCheckCustomerName": row.isCheckCustomerName == 0 ? 1 : 0
				};
				this.axios.post('/perTaxToolTwo/iocr/main/updateByScheduleId', param).then(res => {
					if (res.data.code == 200) {
						this.queryList();


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
						message: '设置失败',
						type: 'error'
					});
				})
			},
			closeFP() {
				this.dialogVisible6 = false;
			},
			commitFP() {
				let param = {
					// "accountantId": 0,
					"masterInvoice": this.masterInvoice,
					"schedules": this.multipleSelection,
				};
				this.axios.post('/perTaxToolTwo//iocr/main/connectMain', param).then(res => {
					this.multipleSelection = [];
					this.dialogVisible5 = false;
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
					this.multipleSelection = [];
					this.dialogVisible5 = false;
					this.$message({
						message: '关联清单失败',
						type: 'error'
					});
				})
			},
			showconnectMain(index, row) {
				this.dialogVisible5 = true;
				this.masterInvoice = row.scheduleId;
				this.queryDocumentDetail4()
			},
			showconnectMain1(index, row) {
				this.dialogVisible6 = true;
				// this.itemresult1 = row.isMaster;
				this.masterInvoice = row.scheduleId;
				let param = row.isMaster;
				this.axios.post('/perTaxToolTwo/iocr/main/getInvoiceHwqd', param).then(res => {

					if (res.data.code == 200) {
						this.itemresult1 = res.data.data;
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
						message: '关联清单失败',
						type: 'error'
					});
				})
			},

			expandChange(row, expandedRows) {
				var that = this
				if (expandedRows.length) {
					that.expands = []
					if (row) {
						that.expands.push(row.scheduleId);
						this.num1 = 0;
						this.num2 = 0;
						this.num3 = 0;
						this.num4 = 0;
						// this.$refs.refTable.toggleRowExpansion(row)
						// this.row = JSON.parse(JSON.stringify(row));
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
					}
				} else {
					that.expands = []
				}


			},
			handleClick(tab, event) {

			},
			handleChange(val) {
				console.log(val);
			},
			prePage() {
				this.pageTag--;
			},
			nextPage() {
				this.pageTag++;
			},
			prePageQD() {
				this.currentQD--;
			},
			nextPageQD() {
				this.currentQD++;
			},
			cancelConnectMain(row, index) {
				let param = {
					"scheduleId": row.scheduleId,
					masterInvoice: this.masterInvoice
				};
				this.axios.post('/perTaxToolTwo/iocr/main/cancelConnectMain', param).then(res => {
					if (res.data.code == 200) {
						this.itemresult1.splice(index, 1);
						this.currentQD--;


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
			beforeRemovePic(file, fileList) {
				this.$confirm('确认移除此图片?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.images = [];
					this.hideUpload = this.images.length >= 1;
				}).catch(() => {

					return false;

				});
				return false;

			},
			handleRemovePic(file, fileList) {
				this.hideUpload = fileList.length >= 1;


			},
			onChange(file, fileList) {
				this.hideUpload = fileList.length >= 1;
			},
			handleSuccess(response, file, fileList) {
				console.log(response);
				this.form = response.data.detailResults;
			},
			handlePictureCardPreview(file) {
				this.dialogImageUrl = file.url;
				this.dialogVisiblePic = true;
			},
			showDetail(row, event, column) {
				this.num1 = 0;
				this.num2 = 0;
				this.num3 = 0;
				this.num4 = 0;
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
			getDocumentDetail(val) {
				let param = {
					"customerId": this.customerId,
					"accountPeriod": this.accountPeriod,
					"customerName": this.customerName,
					"type": val
				};
				this.axios.post('/perTaxToolTwo/iocr/main/getDocumentDetail', param).then(res => {
					if (res.data.code == 200) {
						this.tableData3 = res.data.data;
						this.tableData3.forEach(item => {
							var length = item.tvoucherentries.length;
							for (let j = 0; j < 6 - length % 6; j++) {
								item.tvoucherentries.push({
									fcredit: "",
									fdebit: "",
									fentryerp: 1,
									fentryid: 1,
									fexplanation: "",
									ffullname: "",
									fnumber: ""
								})
							}
							var length1 = item.tvoucherentries.length;
							for (let i = 0; i < length1 / 6; i++) {
								item.tvoucherentries.splice(6 + 7 * i, 0, {
									fcredit: item.fcredittotal,
									fdebit: item.fdebittotal,
									fentryerp: 1,
									fentryid: 1,
									fexplanation: "总计",
									ffullname: "",
									fnumber: ""
								});

							}
							item.tvoucherentries[item.tvoucherentries.length - 1] = {
								fcredit: item.fcredittotal,
								fdebit: item.fdebittotal,
								fentryerp: 1,
								fentryid: 1,
								fexplanation: "总计",
								ffullname: "",
								fnumber: ""
							}
						})
						console.log(this.tableData3);
						if (this.tableData3.length > 0) {
							this.fvoucheridErp = this.tableData3[0].fvoucherid;
							this.queryListByPage();
						} else {
							this.detail = [];
							this.total = 0;
						}

						// this.total = res.data.count;


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
			getDocumentDetail4() {
				let param = {
					"accountantId": 0,
					"customerId": this.customerId,
					"accountPeriod": this.accountPeriod,
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/getScheduleByAccountantId', param).then(res => {
					if (res.data.code == 200) {
						this.tableData3 = [];
						this.detail = res.data.data;
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
			queryDocumentDetail4() {
				let param = {
					"accountantId": 0,
					"customerId": this.customerId,
					"accountPeriod": this.accountPeriod,
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/getScheduleByAccountantId', param).then(res => {
					if (res.data.code == 200) {
						this.itemresult = res.data.data;


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
			queryListByPage() {
				this.loading1 = true;
				let param = {
					"accountantId": this.fvoucheridErp,
					"customerId": this.customerId,
					"accountPeriod": this.accountPeriod,
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/getScheduleByAccountantId', param).then(res => {
					if (res.data.code == 200) {
						this.loading1 = false;
						this.detail = res.data.data;
						this.total = res.data.count;


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
						message: '获取合同列表失败',
						type: 'error'
					});
				})
			},
			handleSelectionChange(val) {
				this.multipleSelection = [];
				val.forEach(item => {
					this.multipleSelection.push(item.scheduleId)
				})
				// this.multipleSelection = val;
			},
			handleSelectionChange111(val) {
				this.multipleSelection111 = [];
				val.forEach(item => {
					this.multipleSelection111.push(item.scheduleId)
				})
				// this.multipleSelection = val;
			},
			handleCurrentChange(val) {
				this.currentPage = val;
			},
			handleCurrentChange1(val) {
				this.currentPage1 = val;
			},
			handleCurrentChange2(val) {
				this.currentPage2 = val;
			},
			handleCurrentChange3(val) {
				this.currentPage3 = val;
			},
			handleCurrentChange4(val) {
				this.currentPage4 = val;
			},
			handleCurrentChange5(val) {
				this.currentPage5 = val;
			},
			handleCurrentChange6(val) {
				this.currentPage6 = val;
			},
			handleCurrentChange7(val) {
				this.currentPage7 = val;
			},
			handleCurrentChange10(val) {
				this.currentPage10 = val;
			},

			handleCommand(command) {
				this.tag = 1;
				let param = {
					billId: command.billId
				};
				this.axios.get('/perTaxToolTwo/iocr/main/getModelDetail?billId=' + command.billId).then(res => {
					if (res.data.code == 200) {
						this.form = res.data.data.child;
						this.modelUrl = res.data.data.parent.modelUrl;
						this.scheduleType = res.data.data.parent.billId;
						// this.$message({
						// 	message: res.data.msg,
						// 	type: 'success'
						// });
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

			handleCommand1(command, row) {
				let param = {
					scheduleId: row.scheduleId,
					documentType: parseInt(command)
				};
				this.axios.post('/perTaxToolTwo/iocr/main/updateDocumentType', param).then(res => {
					if (res.data.code == 200) {
						this.queryList();
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
						message: '转移失败',
						type: 'error'
					});
				})
			},
			handleCommand111(command) {
				let param = {
					scheduleIds: this.multipleSelection111,
					documentType: parseInt(command)
				};
				this.axios.post('/perTaxToolTwo/iocr/main/changeDocumentType', param).then(res => {
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
						message: '转移失败',
						type: 'error'
					});
				})
			},
			handleUnrelate(index,row,tag) {
				let param = {
					"scheduleId":row.scheduleId,
					"remark4":tag
				};
				this.axios.post('/perTaxToolTwo/iocr/main/updateByScheduleId', param).then(res => {
					if (res.data.code == 200) {
						this.queryList();
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
			reset() {
				this.form2 = {};
			},

			handleJijia(table) {
				let param = {
					// scheduleId: row.scheduleId,
					"fbrno": table.fbrno,
					"fyear": table.fyear,
					"fperiod": table.fperiod
				};
				this.axios.post('/perTaxToolTwo/e9/acct/findSeptTransTbList', param).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible4 = true;
						this.results = res.data.data;
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
			handleDel(index, row) {
				let param = {
					scheduleId: row.scheduleId,
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/deleteUploadSchedule', param).then(res => {
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
						message: '查看失败',
						type: 'error'
					});
				})

			},
			handleDelete(index, row) {
				if (!row.resultIdList) {
					this.rowDetail.itemResults.splice(index, 1)
				} else {
					this.$confirm('确定删除?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let param = row.resultIdList;
						this.axios.post('/perTaxToolTwo/iocr/main/deleteInvoiceList', param).then(res => {
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
								message: '删除失败',
								type: 'error'
							});
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '已取消删除'
						});
					});
				}



			},


			submitCheck(accountantId, state) {
				let title = state == 2 ? '确认审核通过？' : '确认审核不通过？';
				this.$confirm(title, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = {
						accountantId: accountantId,
						state: state,
						customerName: this.customerName,
						customerId: this.customerId,
						accountPeriod: this.accountPeriod
					}
					this.axios.post('/perTaxToolTwo/iocr/identify/submitAccountant', param).then(res => {
						if (res.data.code == 200) {
							this.getDocumentDetail(this.tabname);
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

			submitNoModel() {

				let param = {
					scheduleId: this.scheduleId,
					state: 1
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/submitNoModel', param).then(res => {
					if (res.data.code == 200) {
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
						message: '提交失败',
						type: 'error'
					});
				})




			},

			revocation() {
				// this.form =  
				this.showDetail(this.row)
			},

			commitTicket() {
				console.log(this.checkList);
				let param = {
					scheduleId: this.temscheduleId,
					questionIds: this.checkList
				};
				this.axios.post('/perTaxToolTwo/iocr/ticket/insert', param).then(res => {
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
						message: '审核失败',
						type: 'error'
					});
				})
			},
			hideDialog() {
				this.dialogVisible = false;
			},

			handleApprove(val, row) {
				if (val == '2') {
					let param = {
						scheduleId: row.scheduleId,
						state: 2,
						customerName: this.customerName,
						accountPeriod: this.accountPeriod,
						accountantId: row.accountantId
					};
					this.axios.post('/perTaxToolTwo/iocr/identify/submitCheck', param).then(res => {
						if (res.data.code == 200) {
							this.queryList();
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
							message: '提交失败',
							type: 'error'
						});
					})
				} else if (val == '3') {
					this.$prompt('请输入不通过原因', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
					}).then(({
						value
					}) => {
						let param = {
							scheduleId: row.scheduleId,
							state: 3,
							reason: value,
							customerName: this.customerName,
							accountPeriod: this.accountPeriod,
							accountantId: row.accountantId
						};
						this.axios.post('/perTaxToolTwo/iocr/identify/submitCheck', param).then(res => {
							if (res.data.code == 200) {
								this.queryList();
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
								message: '提交失败',
								type: 'error'
							});
						})
					}).catch(() => {
						this.$message({
							type: 'info',
							message: '取消审核'
						});
					});
				}

			},
			selectAllQuestions(index, row) {
				this.temscheduleId = row.scheduleId;
				this.axios.get('/perTaxToolTwo/iocr/ticketConfig/selectAllQuestions').then(res => {
					if (res.data.code == 200) {
						this.dialogVisible1 = true;
						this.ticketTableList = res.data.data;
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
			},
			getDetail(index, row) {
				this.dialogVisible3 = true;
				this.scheduleId = row.scheduleId;
				this.rowDetail = row;
			},
			getAnswer(index, row) {
				// this.temscheduleId = row.scheduleId;
				let param = {
					scheduleId: row.scheduleId
				}
				this.axios.post('/perTaxToolTwo/iocr/ticket/getAnswer', param).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible2 = true;
						this.gridData = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取问票结果失败',
						type: 'error'
					});
				})
			},
			updateSchedule() {
				let param = {
					scheduleType: 2,
					scheduleId: this.scheduleId,
					customerId: this.customerId,
					// iocrUpdateStr:,
					type: this.scheduleType,
					iocrResultStr: JSON.stringify(this.form),
				};
				this.axios.post('/perTaxToolTwo/iocr/main/updateSchedule', this.qs.stringify(param), {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					}
				}).then(res => {
					if (res.data.code == 200) {
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
			},
			getModelDetail() {
				let param = {};
				this.axios.post('/perTaxToolTwo/iocr/main/updateModel', param).then(res => {
					if (res.data.code == 200) {
						this.modelList = res.data.data;

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
			},
			getSelectAllPid() {
				let param = {};
				this.axios.get('/perTaxToolTwo/iocr/ticket/selectAllPid').then(res => {
					if (res.data.code == 200) {
						this.ticketList = res.data.data;

					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取问票列表失败',
						type: 'error'
					});
				})
			},
			addLine() {
				this.rowDetail.itemResults.push({})
			},
			handleInput(index, label, event) {
				this.rowDetail.itemResults[index][label] = event.currentTarget.innerText;

			},
			handleSelect(val, index) {
				this.rowDetail.itemResults[index]['TaxKind'] = val;
			},
			handleModify(index, row) {
				let param = row;
				this.axios.post('/perTaxToolTwo/iocr/main/updateInvoiceList', param).then(res => {
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
						message: '修改失败',
						type: 'error'
					});
				})
			},
			handleAdd(index, row) {
				let param = {
					"scheduleId": this.scheduleId,
					"listMap": row
				};
				this.axios.post('/perTaxToolTwo/iocr/main/insertInvoiceList', param).then(res => {
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
						message: '新增失败',
						type: 'error'
					});
				})
			},
			voucherEntry() {
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/voucherEntry', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						// id: row.mainId,

						// accountPeriod: row.accountPeriod,
						// customerName: row.customerName,
					}
				})
			},

			submitAllInvoice() {
				let param = {
					"customerName": this.$route.query.customerName,
					"accountPeriod": this.$route.query.accountPeriod,
					"customerId": this.$route.query.customerId
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/submitAllInvoice', param).then(res => {
					if (res.data.code == 200) {
						this.activeName = "0";
						this.getDocumentDetail(0);
						// this.queryListByPage();
						this.getModelDetail();
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
			},

			getProofTAccounts(index) {
				let params = {
					"id": '0',
					"fBrNo": this.customerName
				};
				this.axios.post('/perTaxToolTwo/e9/taccount/getProofTAccounts', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.treeList = res.data.data;



							console.log(this.treeList)

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

			getTycNameMatchByName2do(query) {
				if (query !== '') {
					let params = {
						customerName: query
					};
					this.axios.post('perTaxToolTwo/api/user/register/getTycNameMatchByName2.do', this.qs.stringify(params))
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							if (res.data.code == 200) {
								this.TycNameList = res.data.data;


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
					this.TycNameList = [];
				}

			},

			getTycByName(val, index) {
				let params = {
					customerName: val
				};
				this.axios.post('perTaxToolTwo/api/user/register/getTycByName.do', this.qs.stringify(params))
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							// this.form[index]['invoice_industry'] = res.data.data;
							console.log(this.form, index);
							this.$set(this.form[index + 1], 'fieldValue', res.data.data.industry)

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
			
			refresh(){
				this.queryList();
			},
			
			getIncomeTaxCollectionMethod(){
				let params = {
					customerName: this.customerName
				};
				this.axios.post('/perTaxToolTwo/e9z/e9zBusinessIncomeTaxRecord/getIncomeTaxCollectionMethod', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.incomeTaxCollectionMethod = res.data.data.taxInfoRemark1;
				
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
				if (to.name == 'invoiceApproveAgain') {
					this.customerId = this.$route.query.customerId;
					this.accountPeriod = this.$route.query.accountPeriod;
					this.customerName = this.$route.query.customerName;
					this.activeName = "0";
					this.postData = {
						mainId:this.$route.query.mainId,
						customerId:this.$route.query.customerId,
						accountPeriod : this.$route.query.accountPeriod
					},
					this.queryList();
					// this.getDocumentDetail(0);
					// this.queryListByPage();
					this.getModelDetail();
					this.getProofTAccounts();
					this.getIncomeTaxCollectionMethod();
				}

			}
		},
		created() {
			this.customerId = this.$route.query.customerId;
			this.accountPeriod = this.$route.query.accountPeriod;
			this.customerName = this.$route.query.customerName;
			this.activeName = "0";
			this.postData = {
				mainId:this.$route.query.mainId,
				customerId:this.$route.query.customerId,
				accountPeriod : this.$route.query.accountPeriod
			},
			this.queryList();
			// this.getDocumentDetail(0);
			// this.queryListByPage();
			this.getModelDetail();

			this.getProofTAccounts();
			// this.getSelectAllPid();
			
			this.getIncomeTaxCollectionMethod();
		}
	}
</script>

<style scoped lang="less">
	.main_contain {
		width: 100%;
		height: 100%;
		// padding: 20px;
		box-sizing: border-box;

		.moimg {
			width: 100%;
			height: 600px;
		}

		/deep/ .el-breadcrumb {
			height: 40px;
			line-height: 40px;
			background: rgb(234, 244, 255);
			padding-left: 20px;
		}

		/deep/ .el-upload-list--picture-card {
			.el-upload-list__item {
				width: 100%;
				height: 600px;
			}
		}

		.btn_contain {
			text-align: center;
			margin-top: 0.36rem;
		}

		.left_contain {
			// width: 1200px;
			margin: 10px 20px;
			padding: 0 20px;
			background: #fff;

			// float: left;
			// height: 100%;
			h1 {
				height: 30px;
				line-height: 30px;
				padding: 12px;
				font-size: 16px;
			}

		}

		.right_contain {
			// height: 100%;
			// float: right;
			// width: 100%;
			margin: 0 20px 20px;
			background: #fff;
			padding: 0 12px 20px;
			box-sizing: border-box;
			margin-top: 12px;

			/deep/ .hided .el-upload--picture-card {
				display: none;
			}

			#upload {
				width: 150px;
				float: left;
			}

			h3 {
				color: #409EFF;
				height: 40px;
				line-height: 40px;
			}

			/deep/ .el-form-item__content {
				width: 195px
			}

			/deep/ .el-date-editor.el-input {
				width: 100px
			}


			/deep/ .el-popover {
				height: 300px;

				/deep/ .el-table__header tr,
				.el-table__header th {
					padding: 0;
					height: 40px;
					// color: royalblue
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
			}
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
		padding: 0rem;
		// height: 100%;
		box-sizing: border-box;


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

	/deep/ .el-table__header tr,
	.el-table__header th {
		padding: 0;
		height: 40px;
		// color: royalblue
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
