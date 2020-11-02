<template>
	<div class="main_contain">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>会计工厂</el-breadcrumb-item>
			<el-breadcrumb-item>凭证管理</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/financeCalculateCenter/invoiceUpload' }">发票上传</el-breadcrumb-item>
			<el-breadcrumb-item>查看发票</el-breadcrumb-item>
		</el-breadcrumb>
		<div>
			<div class="contain_body">
				<el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
					<el-tab-pane label="未提交" name='0'>
						<el-table :data="tableDetail" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading' @row-click='showDetail'
						 ref='refTable' @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands">
							<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
							<el-table-column type="expand">
								<template slot-scope="props">
									<div class='clearfix'>
										<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
											<h3>发票详情<el-button type="primary" size="mini" class='el-icon-refresh' @click="rotate1" style="font-size: 16px;margin-left: 12px;"></el-button></h3>
											<div style="margin-top: 12px;">
												
												<!-- <img :src="imageUrl10" alt="" style="width:100%;float: left;"> -->
												<img :src="imageUrl10" alt="" :style="{ transform: 'rotate(' + num1*90 + 'deg)', transformOrigin:'50% 50%'}" class="moimg">

											</div>


										</div>
										<div style='float:right;width: 500px;'>
											<div style='border:1px solid #efefef;box-sizing:border-box;margin:0px 10px;padding:10px 0px'>
												<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
													<el-form-item v-for='(item,index) in form' :label="item.fieldChName">
														<el-input v-model='item.fieldValue' size="mini" v-show='item.type != 3 && item.type != 4 && item.type != 5 && item.type != 6 && item.type != 14 && item.type != 15'></el-input>
														<el-select v-model="item.fieldValue" placeholder="请选择" clearable filterable
														 v-show='item.type == 3'>
															<el-option v-for="item in treeList" :label="item.ffullname" :value='item.ffullname'></el-option>
														</el-select>
														<el-select v-model="item.fieldValue" placeholder="请至少输入两个字符" clearable filterable remote reserve-keyword :remote-method="getTycNameMatchByName2do"
														 v-show='item.type == 5' @change="((val)=>{getTycByName(val, index)})">
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
													<el-button size="mini" type="primary" plain @click='revocation'>撤销</el-button>
												</div>
											</div>
										</div>
									</div>


								</template>
							</el-table-column>
							<el-table-column align="center" label="缩略图" prop='imageUrl'>
								<template slot-scope="scope">
									<img :src="scope.row.imageUrl" :alt="scope.row.imageUrl" style='width:100px;height: 100px;cursor:pointer'
									 @click='showDialog3(scope.row.imageUrl)'>
								</template>
							</el-table-column>
							<el-table-column align="center" label="票据类型" prop='typeName'></el-table-column>
							<el-table-column align="center" label="凭证类型" :filters="[{ text: '收入', value: 0 }, { text: '费用', value: 1 }, { text: '成本', value: 2 }, { text: '其他', value: 3 }, { text: '未分配', value: 4 }]"
							 :filter-method="filterTag1" filter-placement="bottom-end">
								<template slot-scope="scope">
									<span v-if='scope.row.documentType == 0'>收入</span>
									<span v-if='scope.row.documentType == 1'>费用</span>
									<span v-if='scope.row.documentType == 2'>成本</span>
									<span v-if='scope.row.documentType == 3'>其他</span>
									<span v-if='scope.row.documentType == 4'>未分配</span>
								</template>

							</el-table-column>
							<el-table-column align="center" label="置信度" prop='confidenceLevel'></el-table-column>
							<el-table-column align="center" label="创建时间" prop='createTime'></el-table-column>
							<!-- <el-table-column align="center" label="修改时间" prop='fFullName'></el-table-column> -->
							<el-table-column align="center" label="审核状态" :filters="[{ text: '未审核', value: 1 }, { text: '审核通过', value: 2 }, { text: '审核不通过', value: 3 }, { text: '问票中', value: 4 }]"
							 :filter-method="filterTag" filter-placement="bottom-end">
								<template slot-scope="scope">
									<span v-if='scope.row.state == 1'>未审核</span>
									<span v-if='scope.row.state == 2'>审核通过</span>
									<span v-if='scope.row.state == 3'>审核不通过</span>
									<span v-if='scope.row.state == 4'>问票中</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="状态">
								<template slot-scope="scope">
									<span v-if='scope.row.accountantState == 1'>凭证审核</span>
									<span v-if='scope.row.accountantState == 2'>发票审核</span>
									
									<span v-if='scope.row.accountantState == 0'>已上传</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="是否有效">
								<template slot-scope="scope">
									<span v-if='scope.row.isValid == 1'>是</span>
									<span v-else>否</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="来源">
								<template slot-scope="scope">
									<span v-show='scope.row.remark3 == 1'>后台</span>
									<span v-show='scope.row.remark3 == 2'>APP</span>
									<span v-show='scope.row.remark3 == 3'>代开票</span>
									<span v-show='scope.row.remark3 == 4'>自动开票</span>
									<span v-show='scope.row.remark3 == 5'>银行对账</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="上传人">
								<template slot-scope="scope">
									<span>{{scope.row.createPerson != null && !isNaN(scope.row.createPerson) && scope.row.createPerson.length == 11?scope.row.createPerson.slice(0,3) + '****' + scope.row.createPerson.slice(7,11):scope.row.createPerson}}</span>
								</template>
							</el-table-column>
							
							<el-table-column align="center" label="操作" prop="fYtdAmount">
								<template slot-scope="scope">
									<el-tooltip class="item" effect="dark" placement="top" v-show='scope.row.isHaveAmountMsg == 1'>
										<div slot="content" v-html='scope.row.amountMsg'></div>
										<i class="el-icon-warning" style='color: red;'></i>
									</el-tooltip>
									<el-tooltip class="item" effect="dark" :content="scope.row.repeatExplain" placement="top" v-show='scope.row.isRepeat == 1 || scope.row.isRepeat == 2'>
										<i class="el-icon-warning" style='color: red;'></i>
									</el-tooltip>
									<el-button type="text" size="mini" @click.stop='compare(scope.row)' v-show='scope.row.isRepeat == 1 || scope.row.isRepeat == 2'>比对</el-button>
									<el-button type="text" size="mini" @click.stop='showItemDetail(scope.row)' v-show='scope.row.fieldResults.length > 0'>清单</el-button>
									<el-button type="text" size="mini" @click.stop='delLine(scope.row)'>删除</el-button>
								</template>
							</el-table-column>

						</el-table>
						<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
						 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
						</el-pagination>
					</el-tab-pane>
					<el-tab-pane label="已提交" name='1'>
						<el-table :data="tableDetail" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading'  @row-click='showDetail'
						 ref='refTable' @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands">
							<el-table-column type="expand">
								<template slot-scope="props">
									<div class='clearfix'>
										<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
											<h3>发票详情<el-button type="primary" size="mini" class='el-icon-refresh' @click="rotate2" style="font-size: 16px;margin-left: 12px;"></el-button></h3>
											<div style="margin-top: 12px;">
												
												<!-- <img :src="imageUrl10" alt="" style="width:100%;float: left;"> -->
												<img :src="imageUrl10" alt="" :style="{ transform: 'rotate(' + num2*90 + 'deg)', transformOrigin:'50% 50%'}" class="moimg">
							
											</div>
							
							
										</div>
										<div style='float:right;width: 500px;'>
											<div style='border:1px solid #efefef;box-sizing:border-box;margin:0px 10px;padding:10px 0px'>
												<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
													<el-form-item v-for='item in form' :label="item.fieldChName">
														<el-input v-model='item.fieldValue' size="mini"></el-input>
							
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
							<el-table-column align="center" label="缩略图" prop='imageUrl'>
								<template slot-scope="scope">
									<img :src="scope.row.imageUrl" :alt="scope.row.imageUrl" style='width:100px;height: 100px;cursor:pointer'
									 @click='showDialog3(scope.row.imageUrl)'>
								</template>
							</el-table-column>
							<el-table-column align="center" label="票据类型" prop='typeName'></el-table-column>
							<el-table-column align="center" label="凭证类型" :filters="[{ text: '收入', value: 0 }, { text: '费用', value: 1 }, { text: '成本', value: 2 }, { text: '其他', value: 3 }, { text: '未分配', value: 4 }]"
							 :filter-method="filterTag1" filter-placement="bottom-end">
								<template slot-scope="scope">
									<span v-if='scope.row.documentType == 0'>收入</span>
									<span v-if='scope.row.documentType == 1'>费用</span>
									<span v-if='scope.row.documentType == 2'>成本</span>
									<span v-if='scope.row.documentType == 3'>其他</span>
									<span v-if='scope.row.documentType == 4'>未分配</span>
								</template>

							</el-table-column>
							<el-table-column align="center" label="置信度" prop='confidenceLevel'></el-table-column>
							<el-table-column align="center" label="创建时间" prop='createTime'></el-table-column>
							<!-- <el-table-column align="center" label="修改时间" prop='fFullName'></el-table-column> -->
							<el-table-column align="center" label="审核状态" :filters="[{ text: '未审核', value: 1 }, { text: '审核通过', value: 2 }, { text: '审核不通过', value: 3 }, { text: '问票中', value: 4 }]"
							 :filter-method="filterTag" filter-placement="bottom-end">
								<template slot-scope="scope">
									<span v-if='scope.row.state == 1'>未审核</span>
									<span v-if='scope.row.state == 2'>审核通过</span>
									<el-tooltip class="item" effect="dark" :content="scope.row.remark1" placement="top" v-if='scope.row.state == 3'>
										<i class="el-icon-warning"></i>
									</el-tooltip>
									<span v-if='scope.row.state == 3'>审核不通过</span>
									<span v-if='scope.row.state == 4'>问票中</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="状态">
								<template slot-scope="scope">
									<span v-if='scope.row.accountantState == 1'>凭证审核</span>
									<span v-if='scope.row.accountantState == 2'>发票审核</span>
									
									<span v-if='scope.row.accountantState == 0'>已上传</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="是否有效">
								<template slot-scope="scope">
									<span v-if='scope.row.isValid == 1'>是</span>
									<span v-else>否</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="来源">
								<template slot-scope="scope">
									<span v-show='scope.row.remark3 == 1'>后台</span>
									<span v-show='scope.row.remark3 == 2'>APP</span>
									<span v-show='scope.row.remark3 == 3'>代开票</span>
									<span v-show='scope.row.remark3 == 4'>自动开票</span>
									<span v-show='scope.row.remark3 == 5'>银行对账</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="上传人">
								<template slot-scope="scope">
									<span>{{scope.row.createPerson != null && !isNaN(scope.row.createPerson) && scope.row.createPerson.length == 11?scope.row.createPerson.slice(0,3) + '****' + scope.row.createPerson.slice(7,11):scope.row.createPerson}}</span>
								</template>
							</el-table-column>
							
							<el-table-column align="center" label="操作" prop="fYtdAmount">
								<template slot-scope="scope">
									<el-tooltip class="item" effect="dark" :content="scope.row.repeatExplain" placement="top" v-show='scope.row.isRepeat == 1 || scope.row.isRepeat == 2'>
										<i class="el-icon-warning" @click='compare(scope.row)'></i>
									</el-tooltip>
									<el-button type="text" size="mini" @click='compare(scope.row)' v-show='scope.row.isRepeat == 1 || scope.row.isRepeat == 2'>比对</el-button>
									<el-button type="text" size="mini" @click='reUpload(scope.row)' v-show='scope.row.state == 3'>重新上传</el-button>
									<el-button type="text" size="mini" @click.stop='showItemDetail1(scope.row)' v-show='scope.row.fieldResults.length > 0'>清单</el-button>
									<!-- <el-button type="text" size="mini" @click='delLine(scope.row)' v-show='scope.row.state == 3'>删除</el-button> -->
								</template>
							</el-table-column>

						</el-table>
						<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
						 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
						</el-pagination>
					</el-tab-pane>
					<el-tab-pane label="已入账" name='2'>
						<el-table :data="tableDetail" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading'  @row-click='showDetail'
						 ref='refTable' @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands">
							<el-table-column type="expand">
								<template slot-scope="props">
									<div class='clearfix'>
										<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
											<h3>发票详情<el-button type="primary" size="mini" class='el-icon-refresh' @click="rotate3" style="font-size: 16px;margin-left: 12px;"></el-button></h3>
											<div style="margin-top: 12px;">
												
												<!-- <img :src="imageUrl10" alt="" style="width:100%;float: left;"> -->
												<img :src="imageUrl10" alt="" :style="{ transform: 'rotate(' + num3*90 + 'deg)', transformOrigin:'50% 50%'}" class="moimg">
							
											</div>
							
							
										</div>
										<div style='float:right;width: 500px;'>
											<div style='border:1px solid #efefef;box-sizing:border-box;margin:0px 10px;padding:10px 0px'>
												<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
													<el-form-item v-for='item in form' :label="item.fieldChName">
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
							<el-table-column align="center" label="缩略图" prop='imageUrl'>
								<template slot-scope="scope">
									<img :src="scope.row.imageUrl" :alt="scope.row.imageUrl" style='width:100px;height: 100px;cursor:pointer'
									 @click='showDialog3(scope.row.imageUrl)'>
								</template>
							</el-table-column>
							<el-table-column align="center" label="票据类型" prop='typeName'></el-table-column>
							<el-table-column align="center" label="凭证类型" :filters="[{ text: '收入', value: 0 }, { text: '费用', value: 1 }, { text: '成本', value: 2 }, { text: '其他', value: 3 }, { text: '未分配', value: 4 }]"
							 :filter-method="filterTag1" filter-placement="bottom-end">
								<template slot-scope="scope">
									<span v-if='scope.row.documentType == 0'>收入</span>
									<span v-if='scope.row.documentType == 1'>费用</span>
									<span v-if='scope.row.documentType == 2'>成本</span>
									<span v-if='scope.row.documentType == 3'>其他</span>
									<span v-if='scope.row.documentType == 4'>未分配</span>
								</template>
					
							</el-table-column>
							<el-table-column align="center" label="置信度" prop='confidenceLevel'></el-table-column>
							<el-table-column align="center" label="创建时间" prop='createTime'></el-table-column>
							<!-- <el-table-column align="center" label="修改时间" prop='fFullName'></el-table-column> -->
							<el-table-column align="center" label="审核状态" :filters="[{ text: '未审核', value: 1 }, { text: '审核通过', value: 2 }, { text: '审核不通过', value: 3 }, { text: '问票中', value: 4 }]"
							 :filter-method="filterTag" filter-placement="bottom-end">
								<template slot-scope="scope">
									<span v-if='scope.row.state == 1'>未审核</span>
									<span v-if='scope.row.state == 2'>审核通过</span>
									<el-tooltip class="item" effect="dark" :content="scope.row.remark1" placement="top" v-if='scope.row.state == 3'>
										<i class="el-icon-warning"></i>
									</el-tooltip>
									<span v-if='scope.row.state == 3'>审核不通过</span>
									<span v-if='scope.row.state == 4'>问票中</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="状态">
								<template slot-scope="scope">
									<span v-if='scope.row.accountantState == 1'>凭证审核</span>
									<span v-if='scope.row.accountantState == 2'>发票审核</span>
									
									<span v-if='scope.row.accountantState == 0'>已上传</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="是否有效">
								<template slot-scope="scope">
									<span v-if='scope.row.isValid == 1'>是</span>
									<span v-else>否</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="来源">
								<template slot-scope="scope">
									<span v-show='scope.row.remark3 == 1'>后台</span>
									<span v-show='scope.row.remark3 == 2'>APP</span>
									<span v-show='scope.row.remark3 == 3'>代开票</span>
									<span v-show='scope.row.remark3 == 4'>自动开票</span>
									<span v-show='scope.row.remark3 == 5'>银行对账</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="上传人">
								<template slot-scope="scope">
									<span>{{scope.row.createPerson != null && !isNaN(scope.row.createPerson) && scope.row.createPerson.length == 11?scope.row.createPerson.slice(0,3) + '****' + scope.row.createPerson.slice(7,11):scope.row.createPerson}}</span>
								</template>
							</el-table-column>
							
							<el-table-column align="center" label="操作" prop="fYtdAmount">
								<template slot-scope="scope">
									<el-tooltip class="item" effect="dark" :content="scope.row.repeatExplain" placement="top" v-show='scope.row.isRepeat == 1 || scope.row.isRepeat == 2'>
										<i class="el-icon-warning" @click='compare(scope.row)'></i>
									</el-tooltip>
									<el-button type="text" size="mini" @click='compare(scope.row)' v-show='scope.row.isRepeat == 1 || scope.row.isRepeat == 2'>比对</el-button>
									<el-button type="text" size="mini" @click='reUpload(scope.row)' v-show='scope.row.state == 3'>重新上传</el-button>
									<el-button type="text" size="mini" @click.stop='showItemDetail1(scope.row)' v-show='scope.row.fieldResults.length > 0'>清单</el-button>
									<!-- <el-button type="text" size="mini" @click='delLine(scope.row)' v-show='scope.row.state == 3'>删除</el-button> -->
								</template>
							</el-table-column>
					
						</el-table>
						<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
						 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
						</el-pagination>
					</el-tab-pane>
				</el-tabs>

			</div>
		</div>

		<el-dialog title="发票详情" :visible.sync="dialogVisible3" width="800px">
			<img :src="detailImg" :alt="detailImg" style='width:760px'>

		</el-dialog>

		<el-dialog title="上传" :visible.sync="dialogVisible1" width="400px" class='dialog'>

			<el-form :inline="true" ref="ruleForm1" :model="detail1" class="demo-form-inline" label-width="60px" size="mini">

				<el-form-item label="发票" prop="fileList">
					<el-upload ref='upload1' class="upload-demo" :on-remove="handleRemove" :on-change="onChange11" :on-success="handleSuccess11"
					 action='/perTaxToolTwo/iocr/identify/uploadAgain' :on-error="handleError11" :auto-upload="false" :before-remove="beforeRemove"
					 :multiple='false' :limit="1" :on-exceed="handleExceed" :file-list="fileList11" :data='detail1'>
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>
				</el-form-item>

			</el-form>

			<div class='btn_contain clearfix'>
				<el-button type="primary" :loading="loading" @click="commitUpload1">确定</el-button>
				<!-- <span class='commit' @click="commitUpload">确定</span> -->
			</div>
		</el-dialog>

		<el-dialog title="上传" :visible.sync="dialogVisible" width="400px" class='dialog'>

			<el-form :inline="true" ref="ruleForm1" :model="detail" class="demo-form-inline" label-width="60px" size="mini">
				<el-form-item label="公司" prop="item" :rules="[$rules.requiredSelect]">
					<!-- <el-autocomplete class="inline-input" v-model="uploadData.customerName" :fetch-suggestions="querySearch"
						 placeholder="请输入客户名称" @select="handleSelect"></el-autocomplete> -->
					<el-select v-model="detail.item" placeholder="请选择公司名称" clearable filterable value-key='customerId'>
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option> -->
						<el-option v-for="item in ces" :label="item.customerName" :value='item'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="时间" prop="accountPeriod" :rules="[$rules.requiredSelect]">
					<el-date-picker v-model="detail.accountPeriod" type="month" placeholder="选择账期" clearable value-format='yyyy-MM'>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="类型" prop="documentType1">
					<el-select v-model="detail.documentType1" placeholder="请选择发票类型" clearable filterable>
						<el-option v-for="item in documentTypeList" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发票" prop="fileList">
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove" :on-change="onChange1" :on-success="handleSuccess"
					 action='#' :on-error="handleError" :auto-upload="false" :before-remove="beforeRemove" multiple :limit="10"
					 :on-exceed="handleExceed" :file-list="fileList1" :data='detail'>
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>
				</el-form-item>
				<div class='line' v-show='tag > 1'></div>
				<el-form-item label="类型" prop="documentType2" v-show='tag > 1'>
					<el-select v-model="detail.documentType2" placeholder="请选择发票类型" clearable filterable>
						<el-option v-for="item in documentTypeList" :label="item.label" :value='item.value' :disabled='item.value == detail.documentType1'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发票" prop="fileList" v-show='tag > 1'>
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove" :on-change="onChange2" :on-success="handleSuccess"
					 action='#' :on-error="handleError" :auto-upload="false" :before-remove="beforeRemove" multiple :limit="10"
					 :on-exceed="handleExceed" :file-list="fileList2">
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>
				</el-form-item>
				<div class='line' v-show='tag > 2'></div>
				<el-form-item label="类型" prop="documentType3" v-show='tag > 2'>
					<el-select v-model="detail.documentType3" placeholder="请选择发票类型" clearable filterable>
						<el-option v-for="item in documentTypeList" :label="item.label" :value='item.value' :disabled='item.value == detail.documentType1 || item.value == detail.documentType2'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发票" prop="fileList" v-show='tag > 2'>
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove" :on-change="onChange3" :on-success="handleSuccess"
					 action='#' :on-error="handleError" :auto-upload="false" :before-remove="beforeRemove" multiple :limit="10"
					 :on-exceed="handleExceed" :file-list="fileList3">
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>
				</el-form-item>
				<div class='line' v-show='tag > 3'></div>
				<el-form-item label="类型" prop="documentType4" v-show='tag > 3'>
					<el-select v-model="detail.documentType4" placeholder="请选择发票类型" clearable filterable>
						<el-option v-for="item in documentTypeList" :label="item.label" :value='item.value' :disabled='item.value == detail.documentType1 || item.value == detail.documentType2 || item.value == detail.documentType3'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发票" prop="fileList" v-show='tag > 3'>
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove" :on-change="onChange4" :on-success="handleSuccess"
					 action='#' :on-error="handleError" :auto-upload="false" :before-remove="beforeRemove" multiple :limit="10"
					 :on-exceed="handleExceed" :file-list="fileList4">
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>
				</el-form-item>
				<div class='line' v-show='tag > 4'></div>
				<el-form-item label="类型" prop="documentType5" v-show='tag > 4'>
					<el-select v-model="detail.documentType5" placeholder="请选择发票类型" clearable filterable>
						<el-option v-for="item in documentTypeList" :label="item.label" :value='item.value' :disabled='item.value == detail.documentType1 || item.value == detail.documentType2 || item.value == detail.documentType3 || item.value == detail.documentType4'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发票" prop="fileList" v-show='tag > 4'>
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove" :on-change="onChange5" :on-success="handleSuccess"
					 action='#' :on-error="handleError" :auto-upload="false" :before-remove="beforeRemove" multiple :limit="10"
					 :on-exceed="handleExceed" :file-list="fileList5">
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>
				</el-form-item>
				<el-button style='width:360px' @click='addTag' :disabled='tag >= 5'>添加一个发票类型</el-button>


			</el-form>

			<div class='btn_contain clearfix'>
				<el-button type="primary" :loading="loading" @click="commitUpload">确定</el-button>
				<!-- <span class='commit' @click="commitUpload">确定</span> -->
			</div>
		</el-dialog>


		<el-dialog title="对比" :visible.sync="dialogVisible10" width="1200px">
			<div class='clearfix'>
				<div>
					<el-button type="primary" @click="submitRepeat(1)" size='mini' v-show="isRepeat == 1">保留本张发票</el-button>
					<el-button type="primary" @click="submitRepeat(2)" size='mini'>保留重复的发票</el-button>
					<el-button type="primary" @click="submitRepeat(3)" size='mini'>同时保留</el-button>
				</div>
				<div style='float: left;width:560px'>
					<h3 style='height: 30px;line-height: 30px;'>本张发票</h3>
					<img :src="imageUrl1" :alt="imageUrl1" style='width:560px'>
				</div>
				<div style='float: right;width:560px'>
					<h3 style='height: 30px;line-height: 30px;'>重复的发票</h3>
					<img :src="imageUrl2" :alt="imageUrl1" style='width:560px'>
				</div>
			</div>
			
			
			
			
		</el-dialog>
		
		<el-dialog title="货物(劳务)比对" :visible.sync="dialogVisible5" width="100%" class='dialog'>
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
		
		<el-dialog title="货物(劳务)比对" :visible.sync="dialogVisible6" width="100%" class='dialog'>
			<div class='clearfix'>
				<div style='float:left;width:700px'>
					<img :src='rowDetail.imageUrl' width='700px' />
				</div>
				<div style='float:right;width:calc(100% - 712px)'>
					<el-table :data="rowDetail.itemResults" style='margin-top: 10px;'>
						<el-table-column align="center" v-for='(item,index) in rowDetail.fieldResults' :prop="item.fieldName" :label="item.fieldChName"
						 :width="index == 0?'250px':'' ">
							<template slot-scope="scope">
								<div  v-text="scope.row[item.fieldName]"></div>
		
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		
		
		
		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				TyList:[],
				TycNameList:[],
				treeList:[],
				isRepeat:'',
				activeName: '0',
				tableData: [],
				tag: 1,
				tableDetail: [],
				customerId: '',
				accountPeriod: '',
				customerName: '',
				ces: [{
					customerId: 1,
					customerName: "12"
				}],
				mainId: '',
				color: [
					"#ED878E", "#FFAC69", "#99CCFF", "#FFCCCC"
				],
				uploadData: {},
				list: [],
				fileList1: [],
				fileList2: [],
				fileList3: [],
				fileList4: [],
				fileList5: [],
				fileList11: [],
				loading: false,
				nameData: ['审核通过', '审核未通过', '未审核', '问票中'],
				formInline1: {
					bankname: '',
					typecode: ''
				},
				detail: {
					item: {
						customerId: 1,
						customerName: 2
					}

				},
				detail1: {
					scheduleId: '1',
					mainId: '1'
				},
				documentType1: '',
				documentType2: '',
				documentType3: '',
				documentType4: '',
				documentType5: '',
				documentTypeList: [{
						label: "收入",
						value: "0"
					},

					{
						label: "费用",
						value: "1"
					},
					{
						label: "成本",
						value: "2"
					},
					{
						label: "其他",
						value: "3"
					},
					{
						label: "未分配",
						value: "4"
					},
				],
				dialogVisible: false,
				dialogVisible1: false,
				dialogVisible3: false,
				dialogVisible5: false,
				dialogVisible6: false,
				dialogVisible10: false,
				total: 0,
				pageSize: 10,
				currentPage: 1,
				imageUrl1: '',
				imageUrl2: '',
				imageUrl10: '',
				ScheduleId: '',
				repeatScheduleId: '',
				expands: [],
				getRowKeys(row) {
					return row.scheduleId
				},
				
				modelUrl: '',
				form: [],
				scheduleId: "",
				scheduleType: '',
				picData: {
					scheduleType: 1,
					scheduleId: '',
					imageUrl: ''
				},
				images: [],
				hideUpload: false,
				modelList:[],
				rowDetail:{},
				num1:0,
				num2:0,
				num3:0,

			}
		},
		components: {},
		methods: {
			rotate1(){
				this.num1++;
			},
			rotate2(){
				this.num2++;
			},
			rotate3(){
				this.num3++;
			},
			handleClick(tab, event) {
				console.log(tab, event);
				if (tab.name == '0') {
					this.queryListByPage('0');
				} else if (tab.name == '1'){
					this.queryListByPage('2');
				}else {
					this.queryListByPage('1');
				}


			},
			
			handleCurrentChange(val){
				this.currentPage = val;
				if (this.activeName == '0') {
					this.queryListByPage('0');
				} else if (this.activeName == '1'){
					this.queryListByPage('2');
				}else {
					this.queryListByPage('1');
				}
			},

			submitRepeat(val) {
				let params = {
					"scheduleId1": this.ScheduleId,
					"scheduleId2": this.repeatScheduleId,
					"type": val
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/submitRepeatResult', params).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible10 = false;
						this.queryListByPage(this.activeName);
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
						message: '操作失败',
						type: 'error'
					});
				})
			},
			compare(row) {
				this.isRepeat = row.isRepeat;
				this.dialogVisible10 = true;
				this.repeatScheduleId = row.repeatScheduleId;
				this.ScheduleId = row.scheduleId;
				this.imageUrl1 = row.imageUrl;
				this.imageUrl2 = row.repeatUrl;
			},
			reUpload(row) {
				this.dialogVisible1 = true;
				this.detail1.mainId = row.mainId;
				this.detail1.scheduleId = row.scheduleId;
			},
			delLine(row) {
				this.$confirm('确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"scheduleId": row.scheduleId,
						imageState : 0
					};
					// this.axios.post('/perTaxToolTwo/iocr/identify/deleteUploadSchedule', params).then(res => {
					this.axios.post('/perTaxToolTwo/iocr/main/updateByScheduleId', params).then(res => {
						if (res.data.code == 200) {
							this.queryListByPage(this.activeName);
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

			},
			filterTag(value, row) {
				return row.state == value;
			},
			filterTag1(value, row) {
				return row.documentType == value;
			},
			addTag() {
				this.tag++;
			},
			selectPic() {
				this.dialogVisible = true;
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			onChange1(file, fileList) { //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
				let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
				if (existFile) {
					this.$message.error('当前文件已经存在!');
					fileList.pop()
				}
				this.fileList1 = fileList
			},
			onChange2(file, fileList) { //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
				let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
				if (existFile) {
					this.$message.error('当前文件已经存在!');
					fileList.pop()
				}
				this.fileList2 = fileList
			},
			onChange3(file, fileList) { //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
				let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
				if (existFile) {
					this.$message.error('当前文件已经存在!');
					fileList.pop()
				}
				this.fileList3 = fileList
			},
			onChange4(file, fileList) { //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
				let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
				if (existFile) {
					this.$message.error('当前文件已经存在!');
					fileList.pop()
				}
				this.fileList4 = fileList
			},
			onChange5(file, fileList) { //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
				let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
				if (existFile) {
					this.$message.error('当前文件已经存在!');
					fileList.pop()
				}
				this.fileList5 = fileList
			},
			onChange11(file, fileList) { //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
				let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
				if (existFile) {
					this.$message.error('当前文件已经存在!');
					fileList.pop()
				}
				this.fileList11 = fileList
			},
			
			showItemDetail(row){
				this.dialogVisible5 = true;
				this.rowDetail = row;
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
						this.queryListByPage(this.activeName);
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
					"scheduleId": this.rowDetail.scheduleId,
					"listMap": row
				};
				this.axios.post('/perTaxToolTwo/iocr/main/insertInvoiceList', param).then(res => {
					if (res.data.code == 200) {
						this.queryListByPage(this.activeName);
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
								this.queryListByPage(this.activeName);
								this.rowDetail.itemResults.splice(index, 1);
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
			
			showItemDetail1(row){
				this.dialogVisible6 = true;
				this.rowDetail = row;
			},
			
			queryListByPage(val) {
				let params = {
					data:{
						"mainId": this.mainId,
						"accountantState": parseInt(val)
					},
					page:this.currentPage,
					row:this.pageSize
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/getUploadRecordDetailByPage', params).then(res => {
					if (res.data.code == 200) {
						this.tableDetail = res.data.data;
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
						message: '查看失败',
						type: 'error'
					});
				})
			},
			reset() {
				this.detail = {
					item: {
						customerId: 1,
						customerName: 2
					},
					state: 4

				};
				this.fileList1 = [];
				this.fileList2 = [];
				this.fileList3 = [];
				this.fileList4 = [];
				this.fileList5 = [];
			},


			commitUpload() {
				this.$refs['ruleForm1'].validate((valid) => {
					if (valid) {
						this.loading = true;
						var _this = this;
						var formData = new FormData(); //  用FormData存放上传文件
						console.log(1, this.detail.documentType1);
						console.log(2, this.detail.documentType2);
						console.log(3, this.detail.documentType3);
						console.log(4, this.detail.documentType4);
						console.log(5, this.detail.documentType5);
						switch (this.detail.documentType1) {
							case "0":
								this.fileList1.forEach(file => {
									formData.append('file1', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "1":
								this.fileList2.forEach(file => {
									formData.append('file2', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "2":
								this.fileList3.forEach(file => {
									formData.append('file3', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "3":
								this.fileList4.forEach(file => {
									formData.append('file4', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "4":
								this.fileList5.forEach(file => {
									formData.append('file5', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
						}
						switch (this.detail.documentType2) {
							case "0":
								this.fileList1.forEach(file => {
									formData.append('file1', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "1":
								this.fileList2.forEach(file => {
									formData.append('file2', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "2":
								this.fileList3.forEach(file => {
									formData.append('file3', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "3":
								this.fileList4.forEach(file => {
									formData.append('file4', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "4":
								this.fileList5.forEach(file => {
									formData.append('file5', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
						}
						switch (this.detail.documentType3) {
							case "0":
								this.fileList1.forEach(file => {
									formData.append('file1', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "1":
								this.fileList2.forEach(file => {
									formData.append('file2', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "2":
								this.fileList3.forEach(file => {
									formData.append('file3', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "3":
								this.fileList4.forEach(file => {
									formData.append('file4', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "4":
								this.fileList5.forEach(file => {
									formData.append('file5', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
						}
						switch (this.detail.documentType4) {
							case "0":
								this.fileList1.forEach(file => {
									formData.append('file1', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "1":
								this.fileList2.forEach(file => {
									formData.append('file2', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "2":
								this.fileList3.forEach(file => {
									formData.append('file3', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "3":
								this.fileList4.forEach(file => {
									formData.append('file4', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "4":
								this.fileList5.forEach(file => {
									formData.append('file5', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
						}

						switch (this.detail.documentType5) {
							case "0":
								this.fileList1.forEach(file => {
									formData.append('file1', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "1":
								this.fileList2.forEach(file => {
									formData.append('file2', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "2":
								this.fileList3.forEach(file => {
									formData.append('file3', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "3":
								this.fileList4.forEach(file => {
									formData.append('file4', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
							case "4":
								this.fileList5.forEach(file => {
									formData.append('file5', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

								})
								break;
						}


						for (var x in _this.detail) {
							formData.append(x, _this.detail[x]);
						}
						this.axios
							.post("/perTaxToolTwo/iocr/identify/uploadPicture", formData, {
								headers: {
									'Content-Type': 'application/x-www-form-urlencoded'
								}
							}).then(res => { //手动上传貌似无法触发成功或失败的钩子函数，因此这里手动调用 
								if (res.data.code == 200) {
									this.reset();
									this.queryListByPage(this.activeName);
									this.dialogVisible = false;
									this.loading = false;
									this.axios
										.post("/perTaxToolTwo/iocr/identify/iocrImage", res.data.data).then(res => { //手动上传貌似无法触发成功或失败的钩子函数，因此这里手动调用 
											if (res.data.code == 200) {

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
										}).catch(err => {
											this.$message({
												message: "系统繁忙，请稍后重试",
												type: "error"
											});
										})
									this.$message({
										message: res.data.msg,
										type: 'success'
									});
								} else {
									this.loading = false;
									this.fileList1 = [];
									this.fileList2 = [];
									this.fileList3 = [];
									this.fileList4 = [];
									this.fileList5 = [];
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
								this.loading = false;
								this.fileList1 = [];
								this.fileList2 = [];
								this.fileList3 = [];
								this.fileList4 = [];
								this.fileList5 = [];
								this.$message({
									message: "系统繁忙，请稍后重试",
									type: "error"
								});
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},

			commitUpload1() {
				this.$refs.upload1.submit();
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
			handleSuccess11(response) {
				if (response.code == 200) {
					this.fileList11 = [];
					this.$message({
						message: response.msg,
						type: "success"
					});
					this.dialogVisible1 = false;
				} else {
					this.fileList11 = [];
					this.$message({
						message: response.msg || "上传文件失败！",
						type: "error"
					});
				}
			},
			handleError(err) {
				this.fileList1 = [];
				this.fileList2 = [];
				this.fileList3 = [];
				this.fileList4 = [];
				this.fileList5 = [];
				this.$message({
					message: "上传文件失败！",
					type: "error"
				});
			},

			handleError11(err) {
				this.fileList11 = [];
				this.$message({
					message: "上传文件失败！",
					type: "error"
				});
			},



			hideDialog() {
				this.dialogVisible1 = false;
			},

			showDialog3(imageUrl) {
				this.detailImg = imageUrl;
				this.dialogVisible3 = true;
			},
			
			showDetail(row, event, column) {
				this.num1 =0;
				this.num2 =0;
				this.$refs.refTable.toggleRowExpansion(row)
				this.row = JSON.parse(JSON.stringify(row));
				this.modelUrl = row.modelUrl;
				this.imageUrl10 = row.imageUrl;
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
						this.num1 =0;
						this.num2 =0;
						this.modelUrl = row.modelUrl;
						this.imageUrl10 = row.imageUrl;
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
			
			updateSchedule() {
				let param = {
					scheduleType: 2,
					scheduleId: this.scheduleId,
					customerId:this.$route.query.customerId,
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
						this.queryListByPage(this.activeName);
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
						message: '保存失败',
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
						message: '获取模板失败',
						type: 'error'
					});
				})
			},
			handleCommand(command) {
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
				if(query !== ''){
					let params = {
						customerName:query
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
				}else{
					 this.TycNameList = [];
				}
				
			},
			
			getTycByName(val,index){
				let params = {
					customerName:val
				};
				this.axios.post('perTaxToolTwo/api/user/register/getTycByName.do', this.qs.stringify(params))
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							// this.form[index]['invoice_industry'] = res.data.data;
							this.$set(this.form[index + 1],'fieldValue',res.data.data.industry)
							
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
			
			revocation() {
				// this.form =  
				this.showDetail(this.row)
			},
		},
		watch: {
			"detail.item": {
				handler(newValue, oldValue) {
					this.detail.state = 4;
					this.detail.customerId = newValue.customerId;
					this.detail.customerName = newValue.customerName;
				},
				deep: true
			},
			'$route'(to, from) {
				// init data
				if (to.name == 'invoiceResult') {
					this.activeName = '0';
					this.mainId = this.$route.query.mainId;
					this.queryListByPage('0');
				}

			}
		},
		created() {
			this.activeName = '0';
			this.mainId = this.$route.query.mainId;
			this.customerName = this.$route.query.customerName;
			this.queryListByPage('0');
			this.getModelDetail();
			this.getProofTAccounts();
			
			// this.getTycNameMatchByName2do();
		}
	}
</script>

<style scoped lang="less">
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
		.moimg{
			width: 100%;
			height: 600px;
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
	}

	.contain_header {
		height: 0.5rem;
		margin: 10px 20px;
		padding: 10px 30px;
		// background: url(../../assets/img/list-bg1.png) no-repeat;
		background-size: cover;
		background: #fff;
		box-sizing: border-box;

		// 		/deep/ input::-webkit-input-placeholder {
		// 			/* placeholder颜色  */
		// 			color: #fff;
		// 		}
		// 
		// 		/deep/ .el-select__caret {
		// 			color: #fff
		// 		}



		/deep/ .el-input.is-active .el-input__inner,
		/deep/ .el-input__inner:focus {
			// border-color: #fff;
			outline: 0;
		}
	}

	.contain_body {
		padding: 10px 20px;
		margin: 10px 20px;
		background: #fff;

		.card {
			position: relative;
			background: #fff;
			width: calc(50% - 10px);
			height: 300px;
			margin-bottom: 20px;
			position: relative;

			.text_contain {
				position: absolute;
				// width: 100%;

				height: 40px;
				line-height: 40px;
				top: 50px;
				text-align: center;
				right: 0px;

				// color: rgb(61,157,255);
				.text1 {
					background: #fff;
					color: rgb(61, 157, 255);
					display: inline-block;
					width: 80px;
					height: 30px;
					line-height: 30px;
					border-radius: 15px;
					cursor: pointer;
					margin-right: 10px
				}
			}


			.card_first {
				height: 100px;
				background: rgb(61, 157, 255);
				background-size: auto 150px;
				color: #fff;
				box-sizing: border-box;
				border-top-right-radius: 4px;
				border-top-left-radius: 4px;
				padding: 0 12px;

				p {
					width: 50%;
					height: 24px;
					line-height: 24px;
					box-sizing: border-box;
					padding-left: 4px;
				}


				div.p_first {
					// float:none;
					width: 100%;
					font-size: 14px;
					height: 40px;
					line-height: 40px;
					padding-left: 4px;
					border-bottom: 1px solid #fff;
					margin-bottom: 6px;

					span {
						float: right;
						font-size: 12px;
					}
				}

			}

			.charts {
				height: 200px;
			}
		}
	}

	/deep/ .el-pagination {
		text-align: right;
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
		background-color: #fff;
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
		background-color: #fff;
	}

	/deep/ .el-table__body tr.el-table__row--striped {
		background-color: #fff;
	}

	/deep/ .el-table thead {
		color: #343434;
	}

	/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #fff;
	}

	/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
		border-bottom-color: #fff;
		background: #fff;
	}

	/deep/ .el-dialog__body {
		padding: 0 20px 30px;
	}

	.dialog {
		div.line {
			width: 100%;
			height: 1px;
			background: #efefef
		}

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
