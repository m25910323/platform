<template>
	<div class="main_contain">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>会计工厂</el-breadcrumb-item>
			<el-breadcrumb-item>凭证管理</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/financeCalculateCenter/invoiceDetail' }">凭证审核</el-breadcrumb-item>
			<el-breadcrumb-item>审核详情</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="left_contain">
			<h1>{{$route.query.customerName}}
				<span style="margin-left: 10px;color:#999;font-size:12px">{{$route.query.accountPeriod}}</span>
				<span style="margin-left: 20px;color:#999;font-size:12px">{{incomeTaxCollectionMethod}}</span>
				<span style="float:right;color:#999;font-size:12px">共{{tableData3.length}}张发票</span>

				<el-button type="primary" size="mini" style="float:right;margin-right:10px" @click='voucherEntry()'>凭证录入</el-button>
				<el-button type="primary" size="mini" style="float:right;margin-right:10px" @click='submitAllInvoice'>批量通过</el-button>
				<el-select size="mini" style="float:right;margin-right:10px" v-model="fvoucherNum" placeholder="请选择" clearable
				 filterable value-key="fvoucherNum" @change="jumpToThis">
					<el-option v-for="item in vchNumList" :label="item.fvoucherNum" :value='item'></el-option>
				</el-select>
			</h1>
			<div class="contain_body">
				<el-tabs type="border-card" @tab-click="handleClick" v-model="activeName" v-loading='loading'>
					<el-tab-pane label="收入" name="0">
						<span slot="label">
							<el-badge :value="incomeCount" :max="99" class="item" v-show="incomeCount > 0">
							  <span>收入</span>
							</el-badge>
							<span v-show="!incomeCount">收入</span>
						</span>
						<div v-for="(table,index) in tableData3" v-show='currentPage - 1 == index' style='position:relative'>


							<el-button type="primary" size="mini" style="position:absolute;top:510px;right:0px;z-index:2000" @click='submitCheck(table.fvoucherid,2)'
							 v-show='!table.fchecked'>审核通过</el-button>
							<el-button type="primary" size="mini" style="position:absolute;top:510px;right:0px;z-index:2000" @click='submitCheck1(table.fvoucherid,2)'
							 v-show='table.fchecked'>反审核</el-button>

							<div style="background-color: #efefef;padding: 20px 50px 20px 20px;position: relative;">
								<div style="width:16px;position: absolute;top: 120px;right: 26px;color: royalblue;">附件{{table.fattachments}}张</div>
								<h2>记账凭证</h2>
								<div class='line'></div>
								<div class='line'></div>
								<h4>{{table.ftransdate.slice(0,10)}} <span style="float: right;">编号：{{table.fnumber}}</span></h4>
								<el-table :data="table.tvoucherentries.slice(index*7,index*7+7)" style="width: 100%" v-for='(item,index) in Math.ceil(table.tvoucherentries.length/7)'
								 v-show="index == pageTag">
									<el-table-column align="center" prop="fexplanation" label="摘要" width="150" show-overflow-tooltip></el-table-column>
									<el-table-column align="center" prop="fnumber" label="会计科目">
										<el-table-column align="center" label="一级科目_明细科目" prop="ffullname" show-overflow-tooltip></el-table-column>
									</el-table-column>
									<!-- <el-table-column align="center" prop="ffullname" label="科目名称" width="150" show-overflow-tooltip></el-table-column> -->
									<el-table-column align="center" label="借方" prop="fdebit">
										<template slot-scope="scope">
											<span>{{scope.row.fdebit?scope.row.fdebit.toFixed(2):null}}</span>
										</template>
									</el-table-column>
									<el-table-column align="center" label="贷方" prop="fcredit">
										<template slot-scope="scope">
											<span>{{scope.row.fcredit?scope.row.fcredit.toFixed(2):null}}</span>
										</template>
									</el-table-column>
								</el-table>
								<el-button type="text" @click='prePage' :disabled='pageTag == 0'>上一张</el-button>
								<el-button type="text" @click='nextPage' :disabled='pageTag >= Math.ceil(table.tvoucherentries.length/7) - 1'>下一张</el-button>
							</div>
						</div>


						<el-pagination background style="margin-top:10px;text-align:center" @current-change="((val)=>{handleCurrentChange(val)})"
						 :current-page="currentPage" :page-size="1" layout="total, prev, pager, next" :total="tableData3.length">
						</el-pagination>
					</el-tab-pane>
					<el-tab-pane label="成本" name="2">
						<span slot="label">
							<el-badge :value="costCount" :max="99" class="item" v-show="costCount > 0">
							  <span>成本</span>
							</el-badge>
							<span v-show="!costCount">成本</span>
						</span>
						<div v-for="(table,index) in tableData3" v-show='currentPage - 1 == index' style='position:relative'>

							<el-button type="primary" size="mini" style="position:absolute;top:510px;right:0px;z-index:2000" @click='submitCheck(table.fvoucherid,2)'
							 v-show='!table.fchecked'>审核通过</el-button>
							<el-button type="primary" size="mini" style="position:absolute;top:510px;right:0px;z-index:2000" @click='submitCheck1(table.fvoucherid,2)'
							 v-show='table.fchecked'>反审核</el-button>
							<el-button type="warning" size="mini" style="position:absolute;top:510px;right:100px;z-index:2000" @click.stop="handleJijia(table)"
							 v-show='tabname == "2" && table.finternalind == "TransferCT"'>计价表</el-button>


							<div style="background-color: #efefef;padding: 20px 50px 20px 20px;position: relative;">
								<div style="width:16px;position: absolute;top: 120px;right: 26px;color: royalblue;">附件{{table.fattachments}}张</div>
								<h2>记账凭证</h2>
								<div class='line'></div>
								<div class='line'></div>
								<h4>{{table.ftransdate.slice(0,10)}} <span style="float: right;">编号：{{table.fnumber}}</span></h4>
								<el-table :data="table.tvoucherentries.slice(index*7,index*7+7)" style="width: 100%" v-for='(item,index) in Math.ceil(table.tvoucherentries.length/7)'
								 v-show="index == pageTag">
									<el-table-column align="center" prop="fexplanation" label="摘要" width="150"></el-table-column>
									<el-table-column align="center" prop="fnumber" label="会计科目">
										<el-table-column align="center" label="一级科目_明细科目" prop="ffullname" show-overflow-tooltip></el-table-column>
									</el-table-column>
									<!-- <el-table-column align="center" prop="ffullname" label="科目名称" width="150" show-overflow-tooltip></el-table-column> -->
									<el-table-column align="center" label="借方" prop="fdebit">
										<template slot-scope="scope">
											<span>{{scope.row.fdebit?scope.row.fdebit.toFixed(2):null}}</span>
										</template>
									</el-table-column>
									<el-table-column align="center" label="贷方" prop="fcredit">
										<template slot-scope="scope">
											<span>{{scope.row.fcredit?scope.row.fcredit.toFixed(2):null}}</span>
										</template>
									</el-table-column>
								</el-table>
								<el-button type="text" @click='prePage' :disabled='pageTag == 0'>上一张</el-button>
								<el-button type="text" @click='nextPage' :disabled='pageTag >= Math.ceil(table.tvoucherentries.length/7) - 1'>下一张</el-button>
							</div>
						</div>


						<el-pagination background style="margin-top:10px;text-align:center" @current-change="((val)=>{handleCurrentChange(val)})"
						 :current-page="currentPage" :page-size="1" layout="total, prev, pager, next" :total="tableData3.length">
						</el-pagination>
					</el-tab-pane>
					<el-tab-pane label="费用" name="1">
						<span slot="label">
							<el-badge :value="feeCount" :max="99" class="item" v-show="feeCount > 0">
							  <span>费用</span>
							</el-badge>
							<span v-show="!feeCount">费用</span>
						</span>
						<div v-for="(table,index) in tableData3" v-show='currentPage - 1 == index' style='position:relative'>

							<el-button type="primary" size="mini" style="position:absolute;top:510px;right:0px;z-index:2000" @click='submitCheck(table.fvoucherid,2)'
							 v-show='!table.fchecked'>审核通过</el-button>
							<el-button type="primary" size="mini" style="position:absolute;top:510px;right:0px;z-index:2000" @click='submitCheck1(table.fvoucherid,2)'
							 v-show='table.fchecked'>反审核</el-button>


							<div style="background-color: #efefef;padding: 20px 50px 20px 20px;position: relative;">
								<div style="width:16px;position: absolute;top: 120px;right: 26px;color: royalblue;">附件{{table.fattachments}}张</div>
								<h2>记账凭证</h2>
								<div class='line'></div>
								<div class='line'></div>
								<h4>{{table.ftransdate.slice(0,10)}} <span style="float: right;">编号：{{table.fnumber}}</span></h4>
								<el-table :data="table.tvoucherentries.slice(index*7,index*7+7)" style="width: 100%" v-for='(item,index) in Math.ceil(table.tvoucherentries.length/7)'
								 v-show="index == pageTag">
									<el-table-column align="center" prop="fexplanation" label="摘要" width="150"></el-table-column>
									<el-table-column align="center" prop="fnumber" label="会计科目">
										<el-table-column align="center" label="一级科目_明细科目" prop="ffullname" show-overflow-tooltip></el-table-column>
									</el-table-column>
									<!-- <el-table-column align="center" prop="ffullname" label="科目名称" width="150" show-overflow-tooltip></el-table-column> -->
									<el-table-column align="center" label="借方" prop="fdebit">
										<template slot-scope="scope">
											<span>{{scope.row.fdebit?scope.row.fdebit.toFixed(2):null}}</span>
										</template>
									</el-table-column>
									<el-table-column align="center" label="贷方" prop="fcredit">
										<template slot-scope="scope">
											<span>{{scope.row.fcredit?scope.row.fcredit.toFixed(2):null}}</span>
										</template>
									</el-table-column>
								</el-table>
								<el-button type="text" @click='prePage' :disabled='pageTag == 0'>上一张</el-button>
								<el-button type="text" @click='nextPage' :disabled='pageTag >= Math.ceil(table.tvoucherentries.length/7) - 1'>下一张</el-button>
							</div>
						</div>


						<el-pagination background style="margin-top:10px;text-align:center" @current-change="((val)=>{handleCurrentChange(val)})"
						 :current-page="currentPage" :page-size="1" layout="total, prev, pager, next" :total="tableData3.length">
						</el-pagination>
					</el-tab-pane>
					<el-tab-pane label="其他票据" name="3">
						<span slot="label">
							<el-badge :value="otherCount" :max="99" class="item" v-show="otherCount > 0">
							  <span>其他票据</span>
							</el-badge>
							<span v-show="!otherCount">其他票据</span>
						</span>
						<div v-for="(table,index) in tableData3" v-show='currentPage - 1 == index' style='position:relative'>


							<el-button type="primary" size="mini" style="position:absolute;top:510px;right:0px;z-index:2000" @click='submitCheck(table.fvoucherid,2)'
							 v-show='!table.fchecked'>审核通过</el-button>
							<el-button type="primary" size="mini" style="position:absolute;top:510px;right:0px;z-index:2000" @click='submitCheck1(table.fvoucherid,2)'
							 v-show='table.fchecked'>反审核</el-button>

							<div style="background-color: #efefef;padding: 20px 50px 20px 20px;position: relative;">
								<div style="width:16px;position: absolute;top: 120px;right: 26px;color: royalblue;">附件{{table.fattachments}}张</div>
								<h2>记账凭证</h2>
								<div class='line'></div>
								<div class='line'></div>
								<h4>{{table.ftransdate.slice(0,10)}} <span style="float: right;">编号：{{table.fnumber}}</span></h4>
								<el-table :data="table.tvoucherentries.slice(index*7,index*7+7)" style="width: 100%" v-for='(item,index) in Math.ceil(table.tvoucherentries.length/7)'
								 v-show="index == pageTag">
									<el-table-column align="center" prop="fexplanation" label="摘要" width="150"></el-table-column>
									<el-table-column align="center" prop="fnumber" label="会计科目">
										<el-table-column align="center" label="一级科目_明细科目" prop="ffullname" show-overflow-tooltip></el-table-column>
									</el-table-column>
									<!-- <el-table-column align="center" prop="ffullname" label="科目名称" width="150" show-overflow-tooltip></el-table-column> -->
									<el-table-column align="center" label="借方" prop="fdebit">
										<template slot-scope="scope">
											<span>{{scope.row.fdebit?scope.row.fdebit.toFixed(2):null}}</span>
										</template>
									</el-table-column>
									<el-table-column align="center" label="贷方" prop="fcredit">
										<template slot-scope="scope">
											<span>{{scope.row.fcredit?scope.row.fcredit.toFixed(2):null}}</span>
										</template>
									</el-table-column>
								</el-table>
								<el-button type="text" @click='prePage' :disabled='pageTag == 0'>上一张</el-button>
								<el-button type="text" @click='nextPage' :disabled='pageTag >= Math.ceil(table.tvoucherentries.length/7) - 1'>下一张</el-button>
							</div>
						</div>


						<el-pagination background style="margin-top:10px;text-align:center" @current-change="((val)=>{handleCurrentChange(val)})"
						 :current-page="currentPage" :page-size="1" layout="total, prev, pager, next" :total="tableData3.length">
						</el-pagination>
					</el-tab-pane>
					<el-tab-pane label="未分配" name="4">
						<span slot="label">
							<el-badge :value="undefinedCount" :max="99" class="item" v-show="undefinedCount > 0">
							  <span>未分配</span>
							</el-badge>
							<span v-show="!undefinedCount">未分配</span>
						</span>
						<div v-for="(table,index) in tableData3" v-show='currentPage - 1 == index' style='position:relative'>



							<el-button type="primary" size="mini" style="position:absolute;top:510px;right:0px;z-index:2000" @click='submitCheck(table.fvoucherid,2)'
							 v-show='!table.fchecked'>审核通过</el-button>
							<el-button type="primary" size="mini" style="position:absolute;top:510px;right:0px;z-index:2000" @click='submitCheck1(table.fvoucherid,2)'
							 v-show='table.fchecked'>反审核</el-button>

							<div style="background-color: #efefef;padding: 20px 50px 20px 20px;position: relative;">
								<div style="width:16px;position: absolute;top: 120px;right: 26px;color: royalblue;">附件{{table.fattachments}}张</div>
								<h2>记账凭证</h2>
								<div class='line'></div>
								<div class='line'></div>
								<h4>{{table.ftransdate.slice(0,10)}} <span style="float: right;">编号：{{table.fnumber}}</span></h4>
								<el-table :data="table.tvoucherentries.slice(index*7,index*7+7)" style="width: 100%" v-for='(item,index) in Math.ceil(table.tvoucherentries.length/7)'
								 v-show="index == pageTag">
									<el-table-column align="center" prop="fexplanation" label="摘要" width="150"></el-table-column>
									<el-table-column align="center" prop="fnumber" label="会计科目">
										<el-table-column align="center" label="一级科目_明细科目" prop="ffullname" show-overflow-tooltip></el-table-column>
									</el-table-column>
									<!-- <el-table-column align="center" prop="ffullname" label="科目名称" width="150" show-overflow-tooltip></el-table-column> -->
									<el-table-column align="center" label="借方" prop="fdebit">
										<template slot-scope="scope">
											<span>{{scope.row.fdebit?scope.row.fdebit.toFixed(2):null}}</span>
										</template>
									</el-table-column>
									<el-table-column align="center" label="贷方" prop="fcredit">
										<template slot-scope="scope">
											<span>{{scope.row.fcredit?scope.row.fcredit.toFixed(2):null}}</span>
										</template>
									</el-table-column>
								</el-table>
								<el-button type="text" @click='prePage' :disabled='pageTag == 0'>上一张</el-button>
								<el-button type="text" @click='nextPage' :disabled='pageTag >= Math.ceil(table.tvoucherentries.length/7) - 1'>下一张</el-button>
							</div>
						</div>


						<el-pagination background style="margin-top:10px;text-align:center" @current-change="((val)=>{handleCurrentChange(val)})"
						 :current-page="currentPage" :page-size="1" layout="total, prev, pager, next" :total="tableData3.length">
						</el-pagination>
					</el-tab-pane>

					<el-tab-pane label="无效票据" name="5">
						<div v-for="(table,index) in tableData3" v-show='currentPage - 1 == index' style='position:relative'>



							<el-button type="primary" size="mini" style="position:absolute;top:510px;right:0px;z-index:2000" @click='submitCheck(table.fvoucherid,2)'
							 v-show='!table.fchecked'>审核通过</el-button>
							<el-button type="primary" size="mini" style="position:absolute;top:510px;right:0px;z-index:2000" @click='submitCheck1(table.fvoucherid,2)'
							 v-show='table.fchecked'>反审核</el-button>

							<div style="background-color: #efefef;padding: 20px 50px 20px 20px;position: relative;">
								<div style="width:16px;position: absolute;top: 120px;right: 26px;color: royalblue;">附件{{table.fattachments}}张</div>
								<h2>记账凭证</h2>
								<div class='line'></div>
								<div class='line'></div>
								<h4>{{table.ftransdate.slice(0,10)}} <span style="float: right;">编号：{{table.fnumber}}</span></h4>
								<el-table :data="table.tvoucherentries.slice(index*7,index*7+7)" style="width: 100%" v-for='(item,index) in Math.ceil(table.tvoucherentries.length/7)'
								 v-show="index == pageTag">
									<el-table-column align="center" prop="fexplanation" label="摘要" width="150"></el-table-column>
									<el-table-column align="center" prop="fnumber" label="会计科目">
										<el-table-column align="center" label="一级科目_明细科目" prop="ffullname" show-overflow-tooltip></el-table-column>
									</el-table-column>
									<!-- <el-table-column align="center" prop="ffullname" label="科目名称" width="150" show-overflow-tooltip></el-table-column> -->
									<el-table-column align="center" label="借方" prop="fdebit">
										<template slot-scope="scope">
											<span>{{scope.row.fdebit?scope.row.fdebit.toFixed(2):null}}</span>
										</template>
									</el-table-column>
									<el-table-column align="center" label="贷方" prop="fcredit">
										<template slot-scope="scope">
											<span>{{scope.row.fcredit?scope.row.fcredit.toFixed(2):null}}</span>
										</template>
									</el-table-column>
								</el-table>
								<el-button type="text" @click='prePage' :disabled='pageTag == 0'>上一张</el-button>
								<el-button type="text" @click='nextPage' :disabled='pageTag >= Math.ceil(table.tvoucherentries.length/7) - 1'>下一张</el-button>
							</div>
						</div>


						<el-pagination background style="margin-top:10px;text-align:center" @current-change="((val)=>{handleCurrentChange(val)})"
						 :current-page="currentPage" :page-size="1" layout="total, prev, pager, next" :total="tableData3.length">
						</el-pagination>
					</el-tab-pane>
				</el-tabs>

			</div>
		</div>

		<div class='right_contain'>
			<h3>关联发票</h3>
			<el-dropdown @command="handleCommand111" size="mini">
				<el-button type="primary" size="mini">
					批量转移<i class="el-icon-arrow-down el-icon--right"></i>
				</el-button>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item command="0" :disabled='multipleSelection111.length == 0'>收入</el-dropdown-item>
					<el-dropdown-item command="2" :disabled='multipleSelection111.length == 0'>成本</el-dropdown-item>
					<el-dropdown-item command="1" :disabled='multipleSelection111.length == 0'>费用</el-dropdown-item>
					<el-dropdown-item command="3" :disabled='multipleSelection111.length == 0'>其他</el-dropdown-item>
					<el-dropdown-item command="4" :disabled='multipleSelection111.length == 0'>未分配</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
			<el-table :data="detailTem" style="width: 100%;margin-top:10px" border v-loading='loading1' @row-click='showDetail' ref='refTable'
			 @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands" @selection-change="handleSelectionChange111">
				<el-table-column type="expand">
					<template slot-scope="props">
						<div class='clearfix'>
							<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
								<h3>发票详情<el-button type="primary" size="mini" class='el-icon-refresh' @click="rotate" style="font-size: 16px;margin-left: 12px;"></el-button>
								</h3>
								<div style="margin-top: 12px;">
									<!-- <el-upload id='upload' action="/perTaxToolTwo/iocr/main/updateSchedule" list-type="picture-card" :on-preview="handlePictureCardPreview"
									 :limit="1" :on-remove="handleRemovePic" :before-remove='beforeRemovePic' :data='picData' :class="{hided:hideUpload}"
									 :on-change="onChange" :file-list="images" :on-success="handleSuccess" style="width:100%;height:600px">
										<i class="el-icon-plus"></i>
									</el-upload>
									<el-dialog :visible.sync="dialogVisiblePic" size="tiny">
										<img width="100%" :src="dialogImageUrl" alt="">
									</el-dialog> -->
									<img :src="images[0].url" alt="" :style="{ transform: 'rotate(' + num*90 + 'deg)', transformOrigin:'50% 50%'}"
									 class="moimg">
									<!-- <div style="width: 100%;height: 40px;">
										<el-button class='el-icon-refresh' @click="rotate" style="font-size: 16px;display: inline-block;width: 40px;height: 40px;"></span>
									</div> -->

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
										<!-- <el-dropdown split-button type='primary' size="mini" style="margin-right: 8px;" @command="handleCommand">
											更换模板
											<el-dropdown-menu slot="dropdown">
												<el-dropdown-item v-for='(item,index) in modelList' :key="index" :command="item">{{item.fieldChName}}</el-dropdown-item>
												
											</el-dropdown-menu>
										</el-dropdown> -->
										<el-button size="mini" type="primary" @click='submitNoModel'>提交为新模板</el-button>
										<el-button size="mini" type="primary" plain @click='revocation'>撤销</el-button>
									</div>
								</div>
							</div>
						</div>


					</template>
				</el-table-column>
				<el-table-column align="center" type="selection" width="55">
				</el-table-column>
				<el-table-column align="center" type="index" :index="indexMethod">
				</el-table-column>
				<el-table-column align="center" label="发票类型" prop="typeName" :resizable="false"></el-table-column>

				<el-table-column align="center" label="发票号" prop="invoiceNum" :resizable="false"></el-table-column>
				<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
				<el-table-column align="center" label="税额" prop="taxAmount" :resizable="false"></el-table-column>
				<!-- <el-table-column align="center" label="上传时间" prop="createTime" :resizable="false">
					<template slot-scope="scope">
						<span>{{scope.row.createTime.slice(0,10)}}</span>
					</template>
				</el-table-column> -->
				<!-- <el-table-column align="center" label="修改时间" prop="updateTime" :resizable="false">
					<template slot-scope="scope">
						<span>{{scope.row.createTime.slice(0,10)}}</span>
					</template>
				</el-table-column> -->
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
				<el-table-column align="center" label="审核人">
					<template slot-scope="scope">
						<span>{{scope.row.approveUser}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="审核时间">
					<template slot-scope="scope">
						<span>{{scope.row.approveTime}}</span>
					</template>
				</el-table-column>

				<el-table-column align="center" label="是否校验客户名称" prop="isCheckCustomerName" :resizable="false" width="120">
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
						<div v-show="tabname != '5'">
							<el-tooltip class="item" effect="dark" :content="scope.row.remark2" placement="top" v-show='scope.row.remark2 != null && scope.row.remark2 != ""'>
								<i class="el-icon-warning"></i>
							</el-tooltip>
							<el-button size="mini" type="text" @click.stop="setCheck(scope.$index, scope.row)">{{scope.row.isCheckCustomerName == 1?"取消校验客户名称":"校验客户名称"}}</el-button>
							<el-button size="mini" type="text" @click.stop="handleDel(scope.$index, scope.row)">设为无效</el-button>
							<el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,1,'issuedSign')">{{scope.row.issuedSign == 0?"设为代开":"取消代开"}}</el-button>
							<!-- <el-button size="mini" type="text" @click.stop="setCertification(scope.$index, scope.row,2,'isCertification')"
							 v-show='scope.row.typeName == "增值税专用发票" && (tabname == "1" || tabname == "2")'>{{scope.row.isCertification == 0?"设为认证":"取消认证"}}</el-button> -->
							<el-button size="mini" type="text" @click.stop="showconnectMain(scope.$index, scope.row)">关联清单</el-button>
							<el-button size="mini" type="text" @click.stop="showconnectMain1(scope.$index, scope.row)" v-show="scope.row.isMaster.length > 0">查看清单</el-button>
							<el-button size="mini" type="text" @click.stop="selectAllQuestions(scope.$index, scope.row)" v-show="tabname == 4">问票</el-button>
							<el-button size="mini" type="text" @click.stop="getAnswer(scope.$index, scope.row)">问票结果</el-button>

							<el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)" v-show='scope.row.fieldResults.length > 0'>比对</el-button>

							<!-- <el-dropdown size='mini' @command="val=>{handleApprove(val,scope.row)}" v-show="scope.row.state == 1" style='margin-left:8px'>
								<el-button class="el-dropdown-link" size='mini' type='text'>
									审核<i class="el-icon-arrow-down el-icon--right"></i>
								</el-button>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="2">通过</el-dropdown-item>
									<el-dropdown-item command="3">不通过</el-dropdown-item>
								</el-dropdown-menu>
							</el-dropdown> -->
							<!-- <el-button size="mini" type="text" @click.stop="getDetail(scope.$index, scope.row)">转移</el-button> -->
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
						<div v-show="tabname == '5'">
							<el-button size="mini" type="text" @click.stop="handleRecover(scope.$index, scope.row)">恢复</el-button>
						</div>

					</template>
				</el-table-column>
			</el-table>
			<el-pagination background @current-change="((val)=>{handleCurrentChange1(val)})" :current-page="currentPage1"
			 :page-size="pageSize1" layout="total, prev, pager, next" :total="detail.length">
			</el-pagination>


		</div>


		<el-dialog title="上传" :visible.sync="dialogVisible" width="400px" class='dialog'>




			<div class='btn_contain clearfix'>
				<span class='commit' @click="hideDialog">确定</span>
			</div>
		</el-dialog>

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
								<div contenteditable="true" v-text="scope.row[item.fieldName]" @blur='handleInput(scope.$index, item.fieldName,$event)' v-show='item.type != 10'></div>
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
								<!-- <div contenteditable="true" v-text="scope.row[item.fieldName]" @blur='handleInput(scope.$index, item.fieldName,$event)'></div> -->
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


	</div>
</template>

<script>
	// import PlanDialog from "../components/common/planDialog.vue"
	export default {
		name: "customer",
		data() {
			return {
				incomeTaxCollectionMethod:'',
				vchNumList: [],
				fvoucherNum: '',
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
				loading: false,
				loading1: false,
				nameData: ['审核通过', '审核未通过', '未审核'],
				formInline1: {
					bankname: '',
					typecode: ''
				},
				detail: [],
				dialogVisible: false,
				dialogVisible1: false,
				dialogVisible2: false,
				dialogVisible3: false,
				dialogVisible4: false,
				dialogVisible5: false,
				dialogVisible6: false,
				servItemList: [],
				itemList: [],
				total: 0,
				pageSize: 10,
				currentPage: 1,
				pageSize1: 10,
				currentPage1: 1,
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
				num: 0,
				incomeCount:0,
				otherCount:0,
				costCount:0,
				feeCount:0,
				undefinedCount :0,

			}
		},
		components: {
			// PlanDialog
		},
		methods: {
			indexMethod(index) {
				return index + 1;
			},
			rotate() {
				this.num++;
			},
			jumpToThis(val) {
				this.activeName = '' + val.type;

				this.tabname = val.type;
				if (val.type != 4) {
					this.getDocumentDetail(val.type, val.tempNumber);
				} else if (this.tabname == '5') {
					this.getDocumentDetail5();
				} else {
					this.getDocumentDetail4();
				}
				this.pageTag = 0;
				console.log(this.tableData3);
				console.log(val.tempNumber);
				// this.fvoucheridErp = this.tableData3[val.tempNumber - 1].fvoucherid;
				this.currentPage = val.tempNumber;
			},
			
			getNotCheckInvoiceByVoucher(){
				let param = {
					customerId: this.$route.query.customerId,
					accountPeriod: this.$route.query.accountPeriod,
				};
				this.axios.post('perTaxToolTwo/iocr/main/getNotCheckInvoiceByVoucher', param).then(res => {
					if (res.data.code == 200) {
						this.incomeCount = res.data.data.income.count;
						this.otherCount = res.data.data.other.count;
						this.costCount = res.data.data.cost.count;
						this.feeCount = res.data.data.fee.count;
						this.undefinedCount = res.data.data.undefined.count;
				
				
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
						if (this.tabname == '4') {
							this.getDocumentDetail4();
						} else if (this.tabname == '5') {
							this.getDocumentDetail5();
						} else {
							this.getDocumentDetail(this.tabname);
							// this.queryListByPage();
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
						if (this.tabname == '4') {
							this.getDocumentDetail4();
						} else if (this.tabname == '5') {
							this.getDocumentDetail5();
						} else {
							this.getDocumentDetail(this.tabname);
							// this.queryListByPage();
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

						// this.$refs.refTable.toggleRowExpansion(row)
						// this.row = JSON.parse(JSON.stringify(row));
						this.tag = 0;
						this.num = 0;
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
				console.log(tab, event);
				this.currentPage = 1;
				this.tabname = tab.name;
				if (tab.name == '4') {
					this.getDocumentDetail4();

				} else if (tab.name == '5') {
					this.getDocumentDetail5();
				} else {
					this.getDocumentDetail(tab.name);
				}


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
				this.$refs.refTable.toggleRowExpansion(row)
				this.row = JSON.parse(JSON.stringify(row));
				this.tag = 0;
				this.num = 0;
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
			getDocumentDetail(val, tag) {
				this.loading = true;
				let param = {
					"customerId": this.customerId,
					"accountPeriod": this.accountPeriod,
					"customerName": this.customerName,
					"type": val
				};
				this.axios.post('/perTaxToolTwo/iocr/main/getDocumentDetail', param).then(res => {
					if (res.data.code == 200) {
						this.loading = false;
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
						if (this.tableData3.length > 0 && tag) {
							this.fvoucheridErp = this.tableData3[tag - 1].fvoucherid;
							this.queryListByPage();
						} else if (this.tableData3.length > 0) {
							this.fvoucheridErp = this.tableData3[0].fvoucherid;
							this.queryListByPage();
						} else {
							this.detail = [];
							this.total = 0;
						}

						// this.total = res.data.count;


					} else {
						this.loading = false;
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
					"isValid": 1
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/getScheduleByAccountantId', param).then(res => {
					if (res.data.code == 200) {
						this.tableData3 = [];
						this.detail = res.data.data;
						this.currentPage1 = 1;
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

			getDocumentDetail5() {
				let param = {
					"accountantId": null,
					"customerId": this.customerId,
					"accountPeriod": this.accountPeriod,
					"isValid": 0
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/getScheduleByAccountantId', param).then(res => {
					if (res.data.code == 200) {
						this.tableData3 = [];
						this.detail = res.data.data;
						this.currentPage1 = 1;
						this.total = res.data.count;


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

			queryDocumentDetail4() {
				let param = {
					"accountantId": 0,
					"customerId": this.customerId,
					"accountPeriod": this.accountPeriod,
					"isValid": 1
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
					"isValid": 1
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/getScheduleByAccountantId', param).then(res => {
					if (res.data.code == 200) {
						this.loading1 = false;
						this.detail = res.data.data;
						this.currentPage1 = 1;
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
				this.pageTag = 0;
				this.fvoucheridErp = this.tableData3[val - 1].fvoucherid;
				this.queryListByPage();
			},
			handleCurrentChange1(val) {
				this.currentPage1 = val;
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
					scheduleIds: [row.scheduleId],
					documentType: parseInt(command)
				};
				this.axios.post('/perTaxToolTwo/iocr/main/changeDocumentType', param).then(res => {
					if (res.data.code == 200) {
						if (this.tabname == '4') {
							this.getDocumentDetail4();
						} else if (this.tabname == '5') {
							this.getDocumentDetail5();
						} else {
							this.queryListByPage();
							// this.queryListByPage();
						};
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
						if (this.tabname == '4') {
							this.getDocumentDetail4();
						} else if (this.tabname == '5') {
							this.getDocumentDetail5();
						} else {
							this.queryListByPage();
							// this.queryListByPage();
						};
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
			handleCommand2(command) {

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
					isValid: 0
				};
				this.axios.post('/perTaxToolTwo/iocr/main/updateScheduleInvalid', param).then(res => {
					if (res.data.code == 200) {
						if (this.tabname == '4') {
							this.getDocumentDetail4();
						} else if (this.tabname == '5') {
							this.getDocumentDetail5();
						} else {
							this.getDocumentDetail(this.tabname);
							// this.queryListByPage();
						};
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

			handleRecover(index, row) {
				let param = {
					scheduleId: row.scheduleId,
					isValid: 1
				};
				this.axios.post('/perTaxToolTwo/iocr/main/updateScheduleInvalid', param).then(res => {
					if (res.data.code == 200) {
						if (this.tabname == '4') {
							this.getDocumentDetail4();
						} else if (this.tabname == '5') {
							this.getDocumentDetail5();
						} else {
							this.queryListByPage();
							// this.queryListByPage();
						};
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
								if (this.tabname == '4') {
									this.getDocumentDetail4();
								} else if (this.tabname == '5') {
									this.getDocumentDetail5();
								} else {
									this.queryListByPage();
									// this.queryListByPage();
								};
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

			submitCheck1(accountantId, state) {

				let param = {
					fVoucherID: accountantId,
					fBrNo: this.customerName,
				}
				this.axios.post('/perTaxToolTwo/e9/tVoucher/updateVoucherUnCheckedByFVoucherID', param).then(res => {
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
						message: '反审核失败',
						type: 'error'
					});
				})



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
							if (this.tabname == '4') {
								this.getDocumentDetail4();
							} else if (this.tabname == '5') {
								this.getDocumentDetail5();
							} else {
								this.queryListByPage();
								// this.queryListByPage();
							};
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
								if (this.tabname == '4') {
									this.getDocumentDetail4();
								} else if (this.tabname == '5') {
									this.getDocumentDetail5();
								} else {
									this.queryListByPage();
									// this.queryListByPage();
								};
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
						if (this.tabname == '4') {
							this.getDocumentDetail4();
						} else if (this.tabname == '5') {
							this.getDocumentDetail5();
						} else {
							this.queryListByPage();
							// this.queryListByPage();
						};
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
						if (this.tabname == '4') {
							this.getDocumentDetail4();
						} else if (this.tabname == '5') {
							this.getDocumentDetail5();
						} else {
							this.queryListByPage();
							// this.queryListByPage();
						};
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

			getVchNumList() {
				let params = {
					customerName: this.customerName,
					accountPeriod: this.accountPeriod,
				};
				this.axios.post('perTaxToolTwo/iocr/main/getVchNumList', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							// this.form[index]['invoice_industry'] = res.data.data;
							this.vchNumList = res.data.data;

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
		computed: {
		    // 计算属性的 getter
		    detailTem: function () {
		      // `this` 指向 vm 实例
		      return this.detail.slice((this.currentPage1 - 1)*10,(this.currentPage1 - 1)*10 + 10)
		    }
		},
		watch: {

			'$route'(to, from) {
				// init data
				if (to.name == 'invoiceApprove') {
					this.customerId = this.$route.query.customerId;
					this.accountPeriod = this.$route.query.accountPeriod;
					this.customerName = this.$route.query.customerName;
					this.activeName = "0";
					this.getDocumentDetail(0);
					// this.queryListByPage();
					this.getModelDetail();
					this.getIncomeTaxCollectionMethod();
				}

			}
		},
		created() {
			this.customerId = this.$route.query.customerId;
			this.accountPeriod = this.$route.query.accountPeriod;
			this.customerName = this.$route.query.customerName;
			this.activeName = "0";
			this.getNotCheckInvoiceByVoucher();
			this.getDocumentDetail(0);
			// this.queryListByPage();
			this.getModelDetail();

			this.getProofTAccounts();
			this.getVchNumList();
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
			// height: 600px;
		}
		
		/deep/ .el-badge__content.is-fixed{
			top: 8px;
			right: 5px;
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
			width: 1200px;
			margin: 10px 20px;
			background: #fff;

			// float: left;
			// height: 100%;
			h1 {
				height: 30px;
				line-height: 30px;
				padding: 12px;
				font-size: 16px;
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
			/deep/.el-table__header th {
				padding: 0;
				height: 30px;
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

			/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
				background: #fff;
			}


			/deep/ .el-table__body tr,
			.el-table__body td {
				padding: 0;
				height: 40px;
				background-color: #fff;
				border-right-color: royalblue;
				border-bottom-color: royalblue
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
