<template>

	<div class="main_contain">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>销售中心</el-breadcrumb-item>
			<el-breadcrumb-item>客户管理</el-breadcrumb-item>

			<el-breadcrumb-item>客户档案</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="contain_body">
			<h3>客户档案
				<el-select v-model='searchList.customerId' filterable @change='search' clearable>
					<el-option v-for='item in customerList' :label="item.customerName" :value="item.customerId"></el-option>
				</el-select>
				<el-button type="primary" size='mini' @click='add' style='position: absolute;top:40px;right: 12px;z-index: 20;'>新增</el-button>
			</h3>

			<el-table :data="tableList" style="width: 100%">
				<el-table-column align="center" label="序号" :resizable="false">
					<template slot-scope="scope">
						<span>{{scope.$index + 1}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="客户名称" prop="customername" :resizable="false"></el-table-column>
				<el-table-column align="center" label="纳税人识别号" prop="taxcode" :resizable="false"></el-table-column>
				<el-table-column align="center" label="法人代表" prop="legalperson" :resizable="false"></el-table-column>
				<el-table-column align="center" label="服务状态" prop="servstateName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="创建时间" prop="createtime" :resizable="false">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(new Date(scope.row.createtime), "yyyy-MM-dd")}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" width="260" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="showDialog(scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background layout="prev, pager, next" :total="total" :page-size=pageSize @current-change='handleCurrentChange'
			 :current-page="currentPage">
			</el-pagination>












		</div>
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>客户档案</div>
				<el-form :inline="true" :model="searchList" class="demo-form-inline" :rules="rules" ref='form' size="mini">
					<el-form-item label="客户名称:" prop="customerId">
						<el-select v-model='searchList.customerId' filterable @change='selectGet' clearable>
							<el-option v-for='item in customerList' :label="item.customerName" :value="item.customerId"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="服务状态:" prop="status">
						<el-select v-model='searchList.servstate' @change='selectGet' clearable>
							<el-option v-for='item in statusList' :label="item.dicName" :value="item.dicId"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click='search("form")'>查询</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<el-dialog :title="tag == 0 ? '审核会计配置（新增）' : '审核会计配置（修改）'" :visible.sync="dialogVisible" width="1020px" class='dialog'
		 :close-on-click-modal='false'>
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="自然信息" name="first" :disabled="!canShow && !canEdit">
					<el-form :inline="true" ref="ruleForm1" :model="customerNatureInfo" class="demo-form-inline" label-width="120px"
					 size="small">
						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">基本信息</p>
						</div>
						<el-form-item label="客户名称" prop="customername" :rules="[$rules.requiredInput]">
							<el-input v-model="customerNatureInfo.customername" placeholder="请输入客户名称"></el-input>
						</el-form-item>
						<el-form-item label="贵宾卡号" prop="vipcardno" :rules="[$rules.requiredInput]">
							<el-input v-model="customerNatureInfo.vipcardno" placeholder="请输入贵宾卡号"></el-input>
						</el-form-item>
						<el-form-item label="客户经理" prop="customermanagerid">
							<el-select v-model="customerNatureInfo.customermanagerid" placeholder="请选择客户经理">
								<el-option v-for="item in employList" :label="item.userName" :value="item.userId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="客户来源" prop="customerInfoSource">
							<el-select v-model="customerNatureInfo.customerinfosource" placeholder="请选择客户来源">
								<el-option v-for="item in customerInfoSourceList" :label="item.dicName" :value="item.dicId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="转介绍公司" prop="sourcename">
							<el-select v-model="customerNatureInfo.sourcename" placeholder="请选择转介绍公司">
								<el-option v-for="item in customerList" :label="item.customerName" :value="item.customerName"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="关联合同公司" prop="relateContractCustomer">
							<el-select v-model="customerNatureInfo.relatecontractcustomerid" placeholder="请选择关联合同公司">
								<el-option v-for="item in invoiceCompanyList" :label="item.companyName" :value="item.invoiceCompanyId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="企业类型" prop="customertype" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerNatureInfo.customertype" filterable placeholder="请选择企业类型">
								<!-- <el-option v-for='item in $store.state.cust' :label="item.customerName" :value="item.customerId"></el-option> -->
								<el-option v-for='item in companyTypeList' :label="item.dicName" :value="item.dicId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="所在区域" prop="arealist" :rules="[$rules.requiredSelect]">
							<el-cascader v-model="customerNatureInfo.arealist" :options="cascaderData" :props="optionAreaProps"
							 @active-item-change="handleItemChange"></el-cascader>
						</el-form-item>
						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">税务信息</p>
						</div>
						<el-form-item label="合同税务类型" prop="contractType">
							<el-input v-model="customerNatureInfo.contracttype" placeholder="由客户签订的合同决定" readonly></el-input>
						</el-form-item>
						<el-form-item label="申报税务类型" prop="taxdeclarationtype" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerNatureInfo.taxdeclarationtype" placeholder="请选择申报税务类型">

								<el-option v-for='item in taxTypeList' :label="item.dicName" :value="item.dicId"></el-option>
							</el-select>
						</el-form-item>
						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">经营信息</p>
						</div>
						<el-form-item label="法人代表" prop="legalperson" :rules="[$rules.requiredInput]">
							<el-input v-model="customerNatureInfo.legalperson" placeholder="请输入法人代表姓名"></el-input>
						</el-form-item>
						<el-form-item label="法人身份证" prop="certificateno" :rules="[$rules.requiredInput]">
							<el-input v-model="customerNatureInfo.certificateno" placeholder="请输入法人身份证"></el-input>
						</el-form-item>
						<el-form-item label="注册资金(万元)" prop="registermoney" :rules="[$rules.requiredInput]">
							<el-input v-model="customerNatureInfo.registermoney" placeholder="请输入公司注册资金"></el-input>
						</el-form-item>
						<el-form-item label="实收资本(万元)" prop="realcapital" :rules="[$rules.requiredInput]">
							<el-input v-model="customerNatureInfo.realcapital" placeholder="请输入公司实收资本"></el-input>
						</el-form-item>
						<el-form-item label="行业" prop="industry" :rules="[$rules.requiredInput]">
							<el-input v-model="customerNatureInfo.industry" placeholder="请输入公司行业"></el-input>
						</el-form-item>
						<el-form-item label="公司成立日期" prop="bounddate" :rules="[$rules.requiredSelect]">
							<el-date-picker v-model="customerNatureInfo.bounddate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
							 placeholder="请选择公司成立日期"></el-date-picker>
						</el-form-item>
						<el-form-item label="组织结构代码证代码" prop="orgstrucodeno" class="longLabel" :rules="[$rules.requiredInput]">
							<el-input v-model="customerNatureInfo.orgstrucodeno" placeholder="请输入组织结构代码证代码"></el-input>
						</el-form-item>
						<el-form-item label="营业执照注册号" prop="businesslicenseno" :rules="[$rules.requiredInput]">
							<el-input v-model="customerNatureInfo.businesslicenseno" placeholder="请输入营业执照注册号"></el-input>
						</el-form-item>
						<el-form-item label="营业执照是否有有效期" prop="isLicenseHaveTime" class="longLabel">
							<el-select v-model="customerNatureInfo.islicensehavetime" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="营业执照截止日期" prop="licenseenddate" class="longLabel" :rules="[$rules.requiredSelect]">
							<el-date-picker v-model="customerNatureInfo.licenseenddate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
							 placeholder="请选择营业执照截止日期"></el-date-picker>
						</el-form-item>
						<el-form-item label="是否挂牌上市" prop="islist" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerNatureInfo.islist" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="公司注册地址" prop="registerlocation" :rules="[$rules.requiredInput]">
							<el-input v-model="customerNatureInfo.registerlocation" placeholder="请输入公司注册地址"></el-input>
						</el-form-item>
						<br>
						<el-form-item label="是否有许可经营范围" prop="isscopebusiness" class="longLabel" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerNatureInfo.isscopebusiness" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="经营许可范围" prop="scopeBussProject" class="textareaWidth">
							<el-input type="textarea" :rows="2" placeholder="请输入经营许可范围" v-model="customerNatureInfo.scopebussproject"></el-input>
						</el-form-item><br>
						<el-form-item label="企业经营范围" prop="businessScope" class="textareaWidth">
							<el-input type="textarea" :rows="2" placeholder="请输入企业经营范围" v-model="customerNatureInfo.businessscope"></el-input>
						</el-form-item>
						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">合作信息</p>
						</div>
						<el-form-item label="是否使用我司地址" prop="isUseOurDeptLocation" class="longLabel">
							<el-select v-model="customerNatureInfo.isuseourdeptlocation" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否存在相关客户在其他财务公司代账" prop="isOthersProxy" class="longLabel">
							<el-select v-model="customerNatureInfo.isothersproxy" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否代拿银行单据" prop="isreplacetakedoc" class="longLabel" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerNatureInfo.isreplacetakedoc" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="签约日期" prop="signingdate" :rules="[$rules.requiredSelect]">
							<el-date-picker v-model="customerNatureInfo.signingdate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
							 placeholder="请选择签约日期"></el-date-picker>
						</el-form-item>
						<el-form-item label="是否认缴" prop="isSubscribe">
							<el-select v-model="customerNatureInfo.issubscribe" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="认缴年限" prop="subscribeYears">
							<el-input v-model="customerNatureInfo.subscribeyears" placeholder="请输入认缴年限"></el-input>
						</el-form-item>
						<el-form-item label="是否有关联公司" prop="isHaveRelateCustomer">
							<el-select v-model="customerNatureInfo.ishaverelatecustomer" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="是否合并所得税" prop="isMergeIncomeTax">
							<el-select v-model="customerNatureInfo.ismergeincometax	" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="合并所得税至" prop="mergeIncomeTax">
							<el-input v-model="customerNatureInfo.mergeincometax" placeholder="请输入合并所得税内容"></el-input>
						</el-form-item>

						<el-form-item label="是否零申报" prop="iszerotax" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerNatureInfo.iszerotax" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否购买发票" prop="isBuyTicket">
							<el-select v-model="customerNatureInfo.isbuyticket" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否购票资质认证" prop="isBuyInv" class="longLabel">
							<el-select v-model="customerNatureInfo.isbuyinv" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否为中高端客户" prop="isHighEndCustomer" class="longLabel">
							<el-select v-model="customerNatureInfo.ishighendcustomer" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否取票" prop="istaketicket" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerNatureInfo.istaketicket" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否需要账务初始化" prop="isaccountinitialization" class="longLabel" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerNatureInfo.isaccountinitialization" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="备注" prop="remark" class="textareaWidth">
							<el-input type="textarea" :rows="2" placeholder="请输入备注" v-model="customerNatureInfo.remark"></el-input>
						</el-form-item>
						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">会计信息</p>
						</div>
						<el-form-item label="会计主管" prop="managerAccountant">
							<el-select v-model="customerNatureInfo.managerAccountantId" placeholder="请选择会计主管">
								<el-option v-for="item in employList" :label="item.userName" :value="item.userId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="主办会计" prop="hostAccountant">
							<el-select v-model="customerNatureInfo.hostAccountantId" placeholder="请选择主办会计">
								<el-option v-for="item in employList" :label="item.userName" :value="item.userId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="审核会计" prop="auditAccountant">
							<el-select v-model="customerNatureInfo.auditAccountantId" placeholder="请选择审核会计">
								<el-option v-for="item in employList" :label="item.userName" :value="item.userId"></el-option>
							</el-select>
						</el-form-item>


						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">其他</p>
						</div>
						<el-form-item label="企业注册日期" prop="registerdate" :rules="[$rules.requiredSelect]">
							<el-date-picker v-model="customerNatureInfo.registerdate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
							 placeholder="请选择企业注册日期"></el-date-picker>
						</el-form-item>
						<el-form-item label="税务登记办证日期" prop="taxregisterdate" class='longLabel' :rules="[$rules.requiredSelect]">
							<el-date-picker v-model="customerNatureInfo.taxregisterdate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
							 placeholder="请选择税务登记办证日期"></el-date-picker>
						</el-form-item>
						<el-form-item label="服务状态" prop="servstate" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerNatureInfo.servstate" placeholder="请选择服务状态">
								<el-option v-for="item in statusList" :label="item.dicName" :value="item.dicId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否有工商处罚" prop="isbusinesspunish" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerNatureInfo.isbusinesspunish" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否有经纪人" prop="isbroker" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerNatureInfo.isbroker" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否是新户" prop="isnewcustomer" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerNatureInfo.isnewcustomer" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否是园区" prop="ispark" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerNatureInfo.ispark" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="园区" prop="parkId">
							<el-select v-model="customerNatureInfo.parkid" placeholder="请选择园区">
								<el-option v-for="item in parkList" :label="item.parkname" :value="item.parknameconfigid"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="主营内容" prop="mainMarketContent">
							<el-select v-model="customerNatureInfo.mainmarketcontent" placeholder="请选择主营内容">
								<el-option v-for="item in mainmarketList" :label="item.dicName" :value="item.dicId"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="企业特殊类型" prop="specialType">
							<el-select v-model="customerNatureInfo.specialtype" placeholder="请选择企业特殊类型">
								<el-option v-for="item in specialtypeList" :label="item.dicName" :value="item.dicId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="挂牌上市类型" prop="listType">
							<el-select v-model="customerNatureInfo.listtype" placeholder="请选择挂牌上市类型">
								<el-option v-for="item in listtypeList" :label="item.dicName" :value="item.dicId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="采买方" prop="buyerid" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerNatureInfo.buyerid" placeholder="请选择采买方">
								<el-option v-for="item in buyerList" :label="item.buyername" :value="item.buyerid"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="状态" prop="state">
							<el-select v-model="customerNatureInfo.state" placeholder="请选择状态">
								<el-option v-for="item in statusOption" :label="item.label" :value="item.value"></el-option>
								<!-- <el-option label="无效" value="0"></el-option>
								<el-option label="有效" value="1"></el-option> -->
							</el-select>
						</el-form-item>
						<el-form-item label="相关客户名称" prop="othersName">
							<el-input v-model="customerNatureInfo.othersname" placeholder="请输入相关客户名称"></el-input>
						</el-form-item>
						<el-form-item label="财务公司名称" prop="financeName">
							<el-input v-model="customerNatureInfo.financename" placeholder="请输入财务公司名称"></el-input>
						</el-form-item>
						<el-form-item label="帐套代码" prop="accountSetCode" class="textareaWidth">
							<el-input type="textarea" :rows="2" placeholder="请输入帐套代码" v-model="customerNatureInfo.accountsetcode"></el-input>
						</el-form-item>
						<el-form-item label="来源说明" prop="infoSourceExplain" class="textareaWidth">
							<el-input type="textarea" :rows="2" placeholder="请输入来源说明" v-model="customerNatureInfo.infosourceexplain"></el-input>
						</el-form-item>



						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">地址信息</p>
						</div>
						<div>
							<el-form-item label="注册地址" prop="managerAccountant" v-if='tag == 0'>
								<el-tag v-for="tag in customerAddress[0]" closable :disable-transitions="false" @close="handleClose(tag)">
									{{tag}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini"
								 @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput" v-if='customerAddress[0].length < 1'>新增地址</el-button>

							</el-form-item>

							<el-form-item label="注册地址" prop="managerAccountant" v-if='tag == 1'>
								<el-tag v-for="tag in customerAddress[0]" closable :disable-transitions="false" @close="handleClose5(tag)">
									{{tag.content?tag.content:''}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible5" v-model="inputValue5" ref="saveTagInput5" size="mini"
								 @keyup.enter.native="handleInputConfirm5" @blur="handleInputConfirm5">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput5" v-if='customerAddress[0].length < 1'>新增地址</el-button>

							</el-form-item>
						</div>
						<div>
							<el-form-item label="实际经营地址" prop="hostAccountant" v-if='tag == 0'>
								<el-tag v-for="tag in customerAddress[1]" closable :disable-transitions="false" @close="handleClose1(tag)">
									{{tag}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible1" v-model="inputValue1" ref="saveTagInput1" size="mini"
								 @keyup.enter.native="handleInputConfirm1" @blur="handleInputConfirm1">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput1" v-if='customerAddress[1].length < 1'>新增地址</el-button>

							</el-form-item>

							<el-form-item label="实际经营地址" prop="hostAccountant" v-if='tag == 1'>
								<el-tag v-for="tag in customerAddress[1]" closable :disable-transitions="false" @close="handleClose6(tag)">
									{{tag.content?tag.content:''}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible6" v-model="inputValue6" ref="saveTagInput6" size="mini"
								 @keyup.enter.native="handleInputConfirm6" @blur="handleInputConfirm6">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput6" v-if='customerAddress[1].length < 1'>新增地址</el-button>

							</el-form-item>
						</div>
						<div>
							<el-form-item label="取票地址" prop="auditAccountant" v-if='tag == 0'>
								<el-tag v-for="tag in customerAddress[2]" closable :disable-transitions="false" @close="handleClose2(tag)">
									{{tag}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible2" v-model="inputValue2" ref="saveTagInput2" size="mini"
								 @keyup.enter.native="handleInputConfirm2" @blur="handleInputConfirm2">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput2">新增地址</el-button>
							</el-form-item>

							<el-form-item label="取票地址" prop="auditAccountant" v-if='tag == 1'>
								<el-tag v-for="tag in customerAddress[2]" closable :disable-transitions="false" @close="handleClose9(tag)">
									{{tag.content?tag.content:''}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible9" v-model="inputValue9" ref="saveTagInput9" size="mini"
								 @keyup.enter.native="handleInputConfirm9" @blur="handleInputConfirm9">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput9">新增地址</el-button>
							</el-form-item>
						</div>
						<div>
							<el-form-item label="联系地址" prop="auditAccountant" v-if='tag == 0'>
								<el-tag v-for="tag in customerAddress[3]" closable :disable-transitions="false" @close="handleClose3(tag)">
									{{tag}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible3" v-model="inputValue3" ref="saveTagInput3" size="mini"
								 @keyup.enter.native="handleInputConfirm3" @blur="handleInputConfirm3">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput3">新增地址</el-button>
								<!-- <el-tag v-for="item in customerAddress" v-if="item.contacttypename == '联系地址'">{{item.content}}</el-tag> -->
							</el-form-item>

							<el-form-item label="联系地址" prop="auditAccountant" v-if='tag == 1'>
								<el-tag v-for="tag in customerAddress[3]" closable :disable-transitions="false" @close="handleClose11(tag)">
									{{tag.content?tag.content:''}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible11" v-model="inputValue11" ref="saveTagInput11" size="mini"
								 @keyup.enter.native="handleInputConfirm11" @blur="handleInputConfirm11">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput11">新增地址</el-button>
								<!-- <el-tag v-for="item in customerAddress" v-if="item.contacttypename == '联系地址'">{{item.content}}</el-tag> -->
							</el-form-item>
						</div>





						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">联系人信息</p>
						</div>
						<el-form-item label="姓名" prop="hostAccountant">
							<el-input v-model="contact.name" placeholder="请输入姓名"></el-input>
						</el-form-item>
						<el-form-item label="职务" prop="position">
							<el-select v-model="contact.position" placeholder="请选择状态">
								<el-option v-for="item in contactPositionList" :label="item.dicName" :value="item.dicId"></el-option>
								<!-- <el-option label="无效" value="0"></el-option>
								<el-option label="有效" value="1"></el-option> -->
							</el-select>

						</el-form-item>
						<el-form-item label="级别" prop="hostAccountant">
							<el-select v-model="contact.level" placeholder="请选择状态">
								<el-option v-for="item in contactLevelList" :label="item.dicName" :value="item.dicId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="类型" prop="hostAccountant">
							<el-select v-model="contact.type" placeholder="请选择状态">
								<el-option v-for="item in contactTypeList" :label="item.dicName" :value="item.dicId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="微信" prop="hostAccountant">
							<el-input v-model="contact.weixin" placeholder="请输入微信"></el-input>
						</el-form-item>
						<el-form-item label="单位" prop="hostAccountant">
							<el-input v-model="contact.companyName" placeholder="请输入单位"></el-input>
						</el-form-item>
						<div>
							<el-form-item label="电话" prop="hostAccountant">
								<el-tag :key="tag" v-for="tag in contact.workphone" closable :disable-transitions="false" @close="handleClose4(tag)">
									{{tag}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible4" v-model="inputValue4" ref="saveTagInput4" size="mini"
								 @keyup.enter.native="handleInputConfirm4" @blur="handleInputConfirm4">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput4">新增电话</el-button>
							</el-form-item>
						</div>
						<div>
							<el-form-item label="传真" prop="hostAccountant">
								<el-tag :key="tag" v-for="tag in contact.chuanzhenphone" closable :disable-transitions="false" @close="handleClose7(tag)">
									{{tag}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible7" v-model="inputValue7" ref="saveTagInput7" size="mini"
								 @keyup.enter.native="handleInputConfirm7" @blur="handleInputConfirm7">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput7">新增电话</el-button>
							</el-form-item>
						</div>
						<div>
							<el-form-item label="地址" prop="hostAccountant">
								<el-tag :key="tag" v-for="tag in contact.workaddress" closable :disable-transitions="false" @close="handleClose8(tag)">
									{{tag}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible8" v-model="inputValue8" ref="saveTagInput8" size="mini"
								 @keyup.enter.native="handleInputConfirm8" @blur="handleInputConfirm8">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput8">新增地址</el-button>
							</el-form-item>
						</div>

						<div>
							<el-form-item label="邮箱" prop="hostAccountant">
								<el-tag :key="tag" v-for="tag in contact.workmail" closable :disable-transitions="false" @close="handleClose10(tag)">
									{{tag}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible10" v-model="inputValue10" ref="saveTagInput10" size="mini"
								 @keyup.enter.native="handleInputConfirm10" @blur="handleInputConfirm10">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput10">新增邮箱</el-button>
							</el-form-item>
						</div>


						<el-form-item prop="hostAccountant">
							<el-button type="primary" size="mini" @click='addContactPerson'>添加</el-button>
						</el-form-item>
						<el-table :data="contactPersonInfo" style="width: 100%" stripe border>
							<el-table-column align="center" label="姓名" prop="contactname" :resizable="false"></el-table-column>
							<el-table-column align="center" label="职务" prop="position" :resizable="false">
								<template slot-scope="scope">
									<div contenteditable="true">{{scope.row.position}}</div>
								</template>
							</el-table-column>
							<el-table-column align="center" label="级别" prop="level" :resizable="false">
								<template slot-scope="scope">
									<div contenteditable="true">{{scope.row.level}}</div>
								</template>
							</el-table-column>
							</el-table-column>
							<el-table-column align="center" label="类型" prop="type" :resizable="false">
								<template slot-scope="scope">
									<div contenteditable="true">{{scope.row.type}}</div>
								</template>
							</el-table-column>
							</el-table-column>
							<el-table-column align="center" label="微信" prop="wechat" :resizable="false"></el-table-column>
							<el-table-column align="center" label="单位" prop="unit" :resizable="false"></el-table-column>
							<el-table-column align="center" label="电话" prop="phone" :resizable="false"></el-table-column>
							<el-table-column align="center" label="地址" prop="address" :resizable="false"></el-table-column>
							<el-table-column align="center" label="邮箱" prop="email" :resizable="false"></el-table-column>
							<el-table-column align="center" label="传真" prop="fax" :resizable="false"></el-table-column>
							<!-- <el-table-column align="center" label="qq" prop="qq" :resizable="false"></el-table-column> -->
							<el-table-column align="center" :resizable="false">
								<template slot="header" slot-scope="scope">
									<span>操作</span>
								</template>
								<template slot-scope="scope">
									<el-button size="mini" type="text" @click="delContactPerson(scope.row,scope.$index)">删除</el-button>
								</template>
							</el-table-column>

						</el-table>

					</el-form>
				</el-tab-pane>
				<el-tab-pane label="涉税信息" name="second" :disabled='canShow'>
					<el-form :inline="true" ref="ruleForm2" :model="customerTaxInfo" class="demo-form-inline" label-width="120px" size="small">
						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">基本信息</p>
						</div>
						<el-form-item label="电子税务局纳税识别号" prop="taxcode" :rules="[$rules.requiredInput]" class="longLabel">
							<el-input v-model="customerTaxInfo.taxcode" placeholder="请输入纳税人识别号"></el-input>
						</el-form-item>
						<el-form-item label="从业人数" prop="engageNumber">
							<el-input v-model="customerTaxInfo.engagenumber" placeholder="请输入从业人数"></el-input>
						</el-form-item>
						<el-form-item label="所得税税率" prop="incometaxrate">
							<el-input v-model="customerTaxInfo.incometaxrate" placeholder="请输入所得税税率"></el-input>
						</el-form-item>
						<el-form-item label="地税管理码" prop="localtaxcode">
							<el-input v-model="customerTaxInfo.localtaxcode" placeholder="请输入所得税税率"></el-input>
						</el-form-item>
						<el-form-item label="办税服务厅纳税识别号" prop="newtaxpayerid" :rules="[$rules.requiredInput]" class="longLabel">
							<el-input v-model="customerTaxInfo.newtaxpayerid" placeholder="请输入办税服务厅纳税识别号"></el-input>
						</el-form-item>
						<el-form-item label="所得税征收方式" prop="collectionMethod">
							<el-select v-model="customerTaxInfo.collectionmethod" placeholder="请选择所得税征方式">
								<el-option v-for="item in collectionmethodList" :label="item.dicName" :value="item.dicId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="地税软密码" prop="newtaxpayerid">
							<el-input v-model="customerTaxInfo.localtaxpassword" placeholder="请输入地税软密码"></el-input>
						</el-form-item>

						<el-form-item label="增资信息" prop="adddatainfo">
							<el-input v-model="customerTaxInfo.adddatainfo" placeholder="请输入增资信息"></el-input>
						</el-form-item>
						<el-form-item label="核定征收率(%)" prop="checkRate">
							<el-input v-model="customerTaxInfo.checkrate" placeholder="请输入核定征收率"></el-input>
						</el-form-item>
						<el-form-item label="是否有代理认证服务" prop="isproxyauthentication" class="longLabel">
							<el-select v-model="customerTaxInfo.isproxyauthentication" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="主机共享地址" prop="hostShareUrl">
							<!-- <el-input v-model="customerTaxInfo.sharehostingaddressid" placeholder="请输入主机共享地址"></el-input> -->
							<el-select v-model="customerTaxInfo.sharehostingaddressid" placeholder="请选择">
								<el-option v-for="item in shareHostingAddressList" :label="item.transactaddress" :value="item.sharehostingaddressid"></el-option>
							</el-select>
						</el-form-item>
						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">涉税事项信息</p>
						</div>
						<el-form-item label="是否缴纳注册资金印花税" prop="isPaySignTax" class="longLabel">
							<el-select v-model="customerTaxInfo.ispaysigntax" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="是否进出口企业" prop="isImportExport">
							<el-select v-model="customerTaxInfo.isimportexport" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否简易征收" prop="isEasyTax">
							<el-select v-model="customerTaxInfo.iseasytax" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否增资" prop="isIncreaseCapital">
							<el-select v-model="customerTaxInfo.isincreasecapital" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否防伪税控" prop="isAntiTax">
							<el-select v-model="customerTaxInfo.isantitax" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="防伪税控类型" prop="antiTaxType">
							<el-select v-model="customerTaxInfo.antitaxtype" placeholder="请选择防伪税控类型">
								<el-option v-for="item in antitaxtypeList" :label="item.dicName" :value="item.dicId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="防伪税控所属区域" prop="transactregionid" class="longLabel">
							<el-select v-model="customerTaxInfo.transactregionid" placeholder="请选择防伪税控所属区域">
								<el-option v-for="item in antitaxtypeList" :label="item.dicName" :value="item.dicId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="税务管理类型" prop="taxmanagertype" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerTaxInfo.taxmanagertype" placeholder="请选择税务管理类型">
								<el-option v-for="item in taxmanagertypeList" :label="item.dicName" :value="item.dicId"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="辅导期开始时间" prop="coachDate">
							<el-date-picker v-model="customerTaxInfo.coachdatestart" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
							 placeholder="开始日期"></el-date-picker>
						</el-form-item>
						<el-form-item label="辅导期截止时间" prop="coachDate">
							<el-date-picker v-model="customerTaxInfo.coachdateend" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
							 placeholder="结束日期"></el-date-picker>
						</el-form-item>

						<el-form-item label="土地使用税缴纳时间1" prop="coachDate" class='longLabel'>
							<el-date-picker v-model="customerTaxInfo.paylandtime1" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
							 placeholder="请选择"></el-date-picker>
						</el-form-item>
						<el-form-item label="土地使用税缴纳时间2" prop="coachDate" class='longLabel'>
							<el-date-picker v-model="customerTaxInfo.paylandtime2" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
							 placeholder="请选择"></el-date-picker>
						</el-form-item>

						<el-form-item label="房产税缴纳时间1" prop="coachDate">
							<el-date-picker v-model="customerTaxInfo.payhousetime1" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
							 placeholder="请选择"></el-date-picker>
						</el-form-item>
						<el-form-item label="房产税缴纳时间2" prop="coachDate">
							<el-date-picker v-model="customerTaxInfo.payhousetime2" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
							 placeholder="请选择"></el-date-picker>
						</el-form-item>

						<el-form-item label="备注" prop="remark" class="textareaWidth">
							<el-input type="textarea" :rows="2" placeholder="请输入备注" v-model="customerTaxInfo.remark"></el-input>
						</el-form-item>
						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">社保信息</p>
						</div>
						<el-form-item label="是否申报社保" prop="isDeclareSocial">
							<el-select v-model="customerTaxInfo.isdeclaresocial" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="社保证号" prop="socialNo">
							<el-input v-model="customerTaxInfo.socialno" placeholder="请输入社保证号"></el-input>
						</el-form-item>
						<el-form-item label="社保证密码" prop="socialPwd">
							<el-input v-model="customerTaxInfo.socialpwd" placeholder="请输入密码"></el-input>
						</el-form-item>
						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">税务缴纳信息</p>
						</div>
						<el-form-item label="是否缴纳土地使用税" prop="isPayLandTax" class="longLabel">
							<el-select v-model="customerTaxInfo.ispaylandtax" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否缴纳房产税" prop="ispayhousetax">
							<el-select v-model="customerTaxInfo.ispayhousetax" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">保税周期</p>
						</div>
						<el-form-item label="国地税保税周期" prop="stateTaxCycle">
							<el-select v-model="customerTaxInfo.taxcycle" placeholder="请选择国地税保税周期">
								<el-option v-for="item in periodList" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>

						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">申报信息</p>
						</div>
						<el-form-item label="是否网上申报" prop="isonlinedeclare" :rules="[$rules.requiredSelect]">
							<el-select v-model="customerTaxInfo.isonlinedeclare" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否代开发票" prop="isproxyinvoice">
							<el-select v-model="customerTaxInfo.isproxyinvoice" placeholder="请选择">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>

						<el-form-item label="网上申报密码" prop="taxpassword" :rules="[$rules.requiredInput]">
							<el-input v-model="customerTaxInfo.taxpassword" placeholder="请输入网上申报密码"></el-input>
						</el-form-item>
						<el-form-item label="应税面积" prop="taxarea">
							<el-input v-model="customerTaxInfo.taxarea" placeholder="请输入应税面积"></el-input>
						</el-form-item>
						<el-form-item label="单位税额" prop="unittax">
							<el-input v-model="customerTaxInfo.unittax" placeholder="请输入单位税额"></el-input>
						</el-form-item>
						<el-form-item label="房产原值" prop="houseoriginalval">
							<el-input v-model="customerTaxInfo.houseoriginalval" placeholder="请输入房产原值"></el-input>
						</el-form-item>
						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">银行信息</p>
						</div>
						<el-form-item label="银行类型" prop="type">
							<el-select v-model="bankInfo.type" placeholder="请选择">
								<el-option v-for="item in bankTypeList" :label="item.label" :value="item.type"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="银行名称" prop="bankname">
							<el-input v-model="bankInfo.bankname" placeholder="请输入银行名称" size="mini"></el-input>
						</el-form-item>
						<el-form-item label="银行账户" prop="bankaccount">
							<el-input v-model="bankInfo.bankaccount" placeholder="请输入银行账户" size="mini"></el-input>
						</el-form-item>
						<el-form-item label="银行电话" prop="telephone">
							<el-input v-model="bankInfo.telephone" placeholder="请输入银行电话" size="mini"></el-input>
						</el-form-item>
						<el-form-item label="银行地址" prop="address">
							<el-input v-model="bankInfo.address" placeholder="请输入银行地址" size="mini"></el-input>
						</el-form-item>
						<el-form-item label="" prop="address">
							<el-button type="primary" @click='addBank' size="mini">添加</el-button>
						</el-form-item>
						<el-table :data="customerBanks" style="width: 100%" stripe border :span-method="objectSpanMethod">
							<el-table-column align="center" label="银行类型" prop="typename" :resizable="false"></el-table-column>
							<el-table-column align="center" label="银行名称" prop="bankname" :resizable="false"></el-table-column>
							<el-table-column align="center" label="账户" prop="bankaccount" :resizable="false"></el-table-column>
							<el-table-column align="center" label="电话" prop="telephone" :resizable="false"></el-table-column>
							<el-table-column align="center" label="地址" prop="address" :resizable="false"></el-table-column>
							<el-table-column align="center" :resizable="false">
								<template slot="header" slot-scope="scope">
									<span>操作</span>
								</template>
								<template slot-scope="scope">
									<el-button size="mini" type="text" @click="delBank(scope.row,scope.$index)">删除</el-button>
								</template>
							</el-table-column>
						</el-table>

						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">专管员信息</p>
						</div>
						<el-form-item label="姓名" prop="name">
							<el-input v-model="specialMember.specialname" placeholder="请输入姓名"></el-input>
						</el-form-item>
						<el-form-item label="性别" prop="sex">
							<el-select v-model="specialMember.sex" placeholder="请选择">
								<el-option label="男" value="1"></el-option>
								<el-option label="女" value="0"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="办公室地址" prop="address">
							<el-input v-model="specialMember.address" placeholder="请输入办公室地址"></el-input>
						</el-form-item>
						<el-form-item label="办公室编号" prop="no">
							<el-input v-model="specialMember.serialnumber" placeholder="请输入办公室编号"></el-input>
						</el-form-item>
						<div v-if='tag == 0'>
							<el-form-item label="电话" prop="houseoriginalval">
								<el-tag :key="tag" v-for="tag in specialMember.phone" closable :disable-transitions="false" @close="handleClose12(tag)">
									{{tag}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible12" v-model="inputValue12" ref="saveTagInput12" size="mini"
								 @keyup.enter.native="handleInputConfirm12" @blur="handleInputConfirm12">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput12">新增电话</el-button>
							</el-form-item>

						</div>
						<div v-if='tag == 0'>
							<el-form-item label="邮箱" prop="houseoriginalval">
								<el-tag :key="tag" v-for="tag in specialMember.email" closable :disable-transitions="false" @close="handleClose13(tag)">
									{{tag}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible13" v-model="inputValue13" ref="saveTagInput13" size="mini"
								 @keyup.enter.native="handleInputConfirm13" @blur="handleInputConfirm13">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput13">新增邮箱</el-button>
							</el-form-item>
						</div>
						<div v-if='tag == 1'>
							<el-form-item label="电话" prop="houseoriginalval">
								<el-tag :key="tag" v-for="tag in specialMember.phone.split(',')" closable :disable-transitions="false" @close="handleClose12(tag)">
									{{tag}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible12" v-model="inputValue12" ref="saveTagInput12" size="mini"
								 @keyup.enter.native="handleInputConfirm12" @blur="handleInputConfirm12">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput12">新增电话</el-button>
							</el-form-item>
						</div>
						<div v-if='tag == 1'>
							<el-form-item label="邮箱" prop="houseoriginalval">
								<el-tag :key="tag" v-for="tag in specialMember.email.split(',')" closable :disable-transitions="false" @close="handleClose13(tag)">
									{{tag}}
								</el-tag>
								<el-input class="input-new-tag" v-if="inputVisible13" v-model="inputValue13" ref="saveTagInput13" size="mini"
								 @keyup.enter.native="handleInputConfirm13" @blur="handleInputConfirm13">
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput13">新增邮箱</el-button>
							</el-form-item>
						</div>

					</el-form>





				</el-tab-pane>
				<el-tab-pane label="关联公司" name="third" :disabled='canShow' v-if='tag == 1'>
					<el-form :inline="true" ref="ruleForm3" :model="relateCompany" class="demo-form-inline" label-width="120px" size="small">
						<div class="tabtitle">
							<p class="lineicon"></p>
							<p class="linetext">基本信息</p>
						</div>
						<el-form-item label="关联公司类型" prop="collectionMethod">
							<el-select v-model="relateCompany.relatetype" placeholder="请选择关联公司类型">
								<el-option v-for="item in relatetypeList" :label="item.dicName" :value="item.dicId"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="关联公司名称" prop="collectionMethod">
							<el-select v-model="relateCompany.branch" placeholder="请选择关联公司名称" value-key="customerId">
								<el-option v-for="item in customerList" :label="item.customerName" :value="item"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否是根公司" prop="isheadcompany">
							<el-select v-model="relateCompany.isheadcompany" placeholder="请选择是否是根公司">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="是否关联贵宾卡" prop="isrelatecard">
							<el-select v-model="relateCompany.isrelatecard" placeholder="请选择是否关联贵宾卡">
								<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="关联公司负责人" prop="superintendent">
							<el-input v-model="relateCompany.superintendent" placeholder="请输入关联公司负责人"></el-input>
						</el-form-item>
						<el-form-item label="注册号" prop="registerno">
							<el-input v-model="relateCompany.registerno" placeholder="请输入注册号"></el-input>
						</el-form-item>
						<el-form-item label="登记机关" prop="registrationagency">
							<el-input v-model="relateCompany.registrationagency" placeholder="请输入登记机关"></el-input>
						</el-form-item>
						<el-form-item label="备注" prop="remark">
							<el-input type="textarea" :rows="2" placeholder="请输入备注" v-model="relateCompany.remark"></el-input>
						</el-form-item>
						<el-form-item label="" prop="collectionMethod">
							<el-button type="primary" @click='addRelateCompany' size="mini">添加</el-button>
						</el-form-item>
					</el-form>
					<el-table :data="relateCompanyList" style="width: 100%" stripe border>
						<el-table-column align="center" label="关联公司类型" prop="relatetype" :resizable="false"></el-table-column>
						<el-table-column align="center" label="关联公司名称" prop="branchname" :resizable="false"></el-table-column>
						<el-table-column align="center" label="是否是根公司" prop="isheadcompany" :resizable="false"></el-table-column>
						<el-table-column align="center" label="是否关联贵宾卡" prop="isrelatecard" :resizable="false"></el-table-column>
						<el-table-column align="center" label="关联公司负责人" prop="superintendent" :resizable="false"></el-table-column>
						<el-table-column align="center" label="注册号" prop="registerno" :resizable="false"></el-table-column>
						<el-table-column align="center" label="登记机关" prop="registrationagency" :resizable="false"></el-table-column>
						<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>
						<el-table-column align="center" label="操作" :resizable="false">
							<template slot-scope="scope">
								<el-button size="mini" type="text" @click="delRelate(scope.row,scope.$index)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>

				</el-tab-pane>
			</el-tabs>

			<div class='btn_contain clearfix'>
				<span class='commit' @click='commitDialog()' v-show='activeName == "first"'>完成</span>
				<span class='commit' @click='commitDialog1()' v-show='activeName == "second"'>完成</span>
				<span class='commit' @click='commitDialog2()' v-show='activeName == "third"'>完成</span>
				<span class='close' @click="hideDialog">关闭</span>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	export default {
		name: "router1",
		data() {
			return {
				total: 1,
				pageSize: 10,
				currentPage: 1,
				activeName: "first",
				searchList: {
					servstate: "",
					customerId: '',
				},
				canEdit: false,
				tag: 0, //0 新增  1 修改
				customerList: [],
				trueOrFalse: [{
						label: "否",
						value: 0
					},
					{
						label: "是",
						value: 1
					}
				],
				statusOption: [{
						label: "无效",
						value: 0
					},
					{
						label: "有效",
						value: 1
					}
				],
				periodList: [{
						label: "月",
						value: 158
					},
					{
						label: "季",
						value: 159
					}
				],
				canShow: true,
				item: {},
				statusList: [],
				dialogVisible: false,

				info: {},
				addCustomerid: '',
				rules: {
					customerId: [{
						required: false,
						message: '请选择客户',
						trigger: 'change'
					}]
				},

				tableList: [],
				contact: {
					workaddress: [],
					workmail: [],
					workphone: [],
					familyaddress: [],
					familyphone: [],
					personalmail: [],
					chuanzhenphone: [],
					telephone: [],

				},
				contactList: [],
				//自然信息
				customerNatureInfo: {},
				//涉税信息
				customerTaxInfo: {
					taxcode: ''
				},

				customerBanks: [],
				customerAddress: [
					[],
					[],
					[],
					[]
				],
				customerAddressTem: [],
				contactPerson: [],
				contactPersonInfo: [],
				specialMemberInfo: [],
				specialMember: {
					phone: [],
					email: []
				},
				customerManagerList: [],
				customerInfoSourceNameList: [],
				optionsArea: [],
				optionAreaProps: {
					value: 'regionCode',
					label: 'regionName',
					children: 'child'
				},
				multipleSelection: [],
				canEidt: true,

				companyTypeList: [],
				taxTypeList: [],
				mainmarketList: [],
				specialtypeList: [],
				listtypeList: [],
				customerInfoSourceList: [],
				cascaderData: [],
				buyerList: [],
				parkList: [],
				addressList: [],
				invoiceCompanyList: [],
				contactTypeList: [],
				contactPositionList: [],
				contactLevelList: [],
				collectionmethodList: [],
				antitaxtypeList: [],
				taxmanagertypeList: [],
				shareHostingAddressList: [],


				label: ["name", "job", "level", "workphone", "telephone", "workaddress", "weixin"],

				kuaijiList: [],

				bankDeleteList: [],

				relateCompanyList: [],
				relateCompany: {},

				inputVisible: false,
				inputValue: '',
				inputVisible1: false,
				inputValue1: '',
				inputVisible2: false,
				inputValue2: '',
				inputVisible3: false,
				inputValue3: '',

				inputVisible4: false,
				inputValue4: '',
				inputVisible5: false,
				inputValue5: '',
				inputVisible6: false,
				inputValue6: '',
				inputVisible7: false,
				inputValue7: '',
				inputVisible8: false,
				inputValue8: '',
				inputVisible9: false,
				inputValue9: '',
				inputVisible10: false,
				inputValue10: '',
				inputVisible11: false,
				inputValue11: '',
				inputVisible12: false,
				inputValue12: '',
				inputVisible13: false,
				inputValue13: '',

				workphone: [],
				telephone: [],
				familyphone: [],
				chuanzhenphone: [],
				workaddress: [],
				familyaddress: [],
				workmail: [],
				personalmail: [],
				bankInfo: {},
				relatetypeList: [],
				bankTypeList: [{
						label: '基本开户行',
						type: 77
					},
					{
						label: '一般开户行',
						type: 78
					},
					{
						label: '涉税银行',
						type: 79
					}

				],

				//审核会计
				shenheList: [],
				//主管会计
				zhuguanList: [],
				//主管会计
				zhubanList: [],

				employList: [],


				upCustomerid: '',
				deleteContactPersonInfo: [],
				deleteAddress: [],
				deleteList: []
			}
		},
		watch: {
			multipleSelection(newValue, oldValue) {
				if (newValue.length == 0) {
					this.canEidt = true;
				} else {
					this.canEidt = false;
				}
			}
		},
		methods: {
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getCustomers()
			},
			handleClick(tab, event) {
				console.log(tab, event);
			},
			handleClose(tag) {
				this.customerAddress[0].splice(this.customerAddress[0].indexOf(tag), 1);
			},
			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				let inputValue = this.inputValue;
				// this.customerAddress[0] = [];
				if (inputValue) {
					this.customerAddress[0].push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
			},

			handleClose1(tag) {
				this.customerAddress[1].splice(this.customerAddress[1].indexOf(tag), 1);
			},
			showInput1() {
				this.inputVisible1 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput1.$refs.input.focus();
				});
			},

			handleInputConfirm1() {
				let inputValue = this.inputValue1;
				// this.customerAddress[0] = [];
				if (inputValue) {
					this.customerAddress[1].push(inputValue);
				}
				this.inputVisible1 = false;
				this.inputValue1 = '';
			},

			handleClose2(tag) {
				this.customerAddress[2].splice(this.customerAddress[2].indexOf(tag), 1);
			},
			showInput2() {
				this.inputVisible2 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput2.$refs.input.focus();
				});
			},

			handleInputConfirm2() {
				let inputValue = this.inputValue2;
				// this.customerAddress[0] = [];
				if (inputValue) {
					this.customerAddress[2].push(inputValue);
				}
				this.inputVisible2 = false;
				this.inputValue2 = '';
			},

			handleClose3(tag) {
				this.customerAddress[3].splice(this.customerAddress[3].indexOf(tag), 1);
			},
			showInput3() {
				this.inputVisible3 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput3.$refs.input.focus();
				});
			},

			handleInputConfirm3() {
				let inputValue = this.inputValue3;
				// this.customerAddress[0] = [];
				if (inputValue) {
					this.customerAddress[3].push(inputValue);
				}
				this.inputVisible3 = false;
				this.inputValue3 = '';
			},
			//工作电话
			handleClose4(tag) {
				this.contact.workphone.splice(this.contact.workphone.indexOf(tag), 1);
			},
			showInput4() {
				this.inputVisible4 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput4.$refs.input.focus();
				});
			},

			handleInputConfirm4() {
				let inputValue = this.inputValue4;
				if (inputValue) {
					this.contact.workphone.push(inputValue);
				}
				this.inputVisible4 = false;
				this.inputValue4 = '';
			},

			//修改注册地址
			handleClose5(tag) {
				// this.customerAddress[0].length = 0;
				this.$set(this.customerAddress, 0, []);
				if (tag.addressid) {
					this.deleteAddress.push(tag.addressid)
				}

			},
			showInput5() {
				this.inputVisible5 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput5.$refs.input.focus();
				});
			},

			handleInputConfirm5() {
				let inputValue = this.inputValue5;
				if (inputValue) {
					this.customerAddress[0].push({
						content: inputValue
					});
				}
				this.inputVisible5 = false;
				this.inputValue5 = '';
			},

			//修改经营地址
			handleClose6(tag) {
				// this.customerAddress[1].length = 0;
				this.$set(this.customerAddress, 1, []);
				if (addressid) {
					this.deleteAddress.push(tag.addressid)
				}
				// this.customerAddress[1].content.splice(this.customerAddress[1].content.indexOf(tag), 1);
			},
			showInput6() {
				this.inputVisible6 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput6.$refs.input.focus();
				});
			},

			handleInputConfirm6() {
				let inputValue = this.inputValue6;
				if (inputValue) {
					this.customerAddress[1].push({
						content: inputValue
					});
				}
				this.inputVisible6 = false;
				this.inputValue6 = '';
			},

			//修改取票地址
			handleClose9(tag) {
				// this.customerAddress[2].splice(this.customerAddress[2].indexOf(tag), 1);
				this.customerAddress[2].forEach((item, index) => {
					if (item.addressid == tag.addressid) {
						this.customerAddress[2].splice(index, 1);
					}
				})
				if (tag.addressid) {
					this.deleteAddress.push(tag.addressid)
				}
			},
			showInput9() {
				this.inputVisible9 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput9.$refs.input.focus();
				});
			},

			handleInputConfirm9() {
				let inputValue = this.inputValue9;
				if (inputValue) {
					this.customerAddress[2].push({
						content: inputValue
					});
				}
				this.inputVisible9 = false;
				this.inputValue9 = '';
			},
			//修改联系地址
			handleClose11(tag) {
				this.customerAddress[3].forEach((item, index) => {
					if (item.addressid == tag.addressid) {
						this.customerAddress[3].splice(index, 1);
					}
				})
				if (tag.addressid) {
					this.deleteAddress.push(tag.addressid)
				}
				// this.customerAddress[3].splice(this.customerAddress[3].indexOf(tag), 1);
			},
			showInput11() {
				this.inputVisible11 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput11.$refs.input.focus();
				});
			},

			handleInputConfirm11() {
				let inputValue = this.inputValue11;
				if (inputValue) {
					this.customerAddress[3].push({
						content: inputValue
					});
				}
				this.inputVisible11 = false;
				this.inputValue11 = '';
			},

			//传真电话
			handleClose7(tag) {
				this.contact.chuanzhenphone.splice(this.contact.chuanzhenphone.indexOf(tag), 1);
			},
			showInput7() {
				this.inputVisible7 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput7.$refs.input.focus();
				});
			},

			handleInputConfirm7() {
				let inputValue = this.inputValue7;
				if (inputValue) {
					this.contact.chuanzhenphone.push(inputValue);
				}
				this.inputVisible7 = false;
				this.inputValue7 = '';
			},

			//工作地址
			handleClose8(tag) {
				this.contact.workaddress.splice(this.contact.workaddress.indexOf(tag), 1);
			},
			showInput8() {
				this.inputVisible8 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput8.$refs.input.focus();
				});
			},

			handleInputConfirm8() {
				let inputValue = this.inputValue8;
				if (inputValue) {
					this.contact.workaddress.push(inputValue);
				}
				this.inputVisible8 = false;
				this.inputValue8 = '';
			},


			//工作邮箱
			handleClose10(tag) {
				this.contact.workmail.splice(this.contact.workmail.indexOf(tag), 1);
			},
			showInput10() {
				this.inputVisible10 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput10.$refs.input.focus();
				});
			},

			handleInputConfirm10() {
				let inputValue = this.inputValue10;
				if (inputValue) {
					this.contact.workmail.push(inputValue);
				}
				this.inputVisible10 = false;
				this.inputValue10 = '';
			},



			//专管员电话
			handleClose12(tag) {
				// this.specialMember.phone.splice(this.specialMember.phone.indexOf(tag), 1);
				var str = this.specialMember.phone.split(',');
				this.specialMember.phone = str.filter(function(item) {

					return item != tag

				});
				this.specialMember.phone = this.specialMember.phone.join('')

			},
			showInput12() {
				this.inputVisible12 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput12.$refs.input.focus();
				});
			},

			handleInputConfirm12() {
				let inputValue = this.inputValue12;
				if (inputValue) {
					this.specialMember.phone = this.specialMember.phone + ',' + inputValue;
				}
				this.inputVisible12 = false;
				this.inputValue12 = '';
			},

			//专管员邮箱
			handleClose13(tag) {
				// this.specialMember.email.splice(this.specialMember.email.indexOf(tag), 1);
				var str = this.specialMember.email.split(',');
				this.specialMember.email = str.filter(function(item) {

					return item != tag

				});
				this.specialMember.email = this.specialMember.email.join('')
			},
			showInput13() {
				this.inputVisible13 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput13.$refs.input.focus();
				});
			},

			handleInputConfirm13() {
				let inputValue = this.inputValue13;
				if (inputValue) {
					this.specialMember.email = this.specialMember.email + ',' + inputValue;
					// this.specialMember.email.push(inputValue);
				}
				this.inputVisible13 = false;
				this.inputValue13 = '';
			},

			exchange(arr) {
				var sum = '';
				for (var i = 0; i <= arr.length - 1; i++) {
					//a.将 数组中的 元素 加入 字符串
					sum += arr[i];

					//a.将 数组中的 元素 加入 字符串
					if (i < arr.length - 1) {
						sum += ',';
					}
				}
				return sum
			},
			addContactPerson() {
				// contactPersonInfo
				var arr = {
					contactname: this.contact.name,
					address: this.exchange(this.contact.workaddress),
					position: this.contact.position,
					level: this.contact.level,
					phone: this.exchange(this.contact.workphone),
					fax: this.exchange(this.contact.chuanzhenphone),
					wechat: this.contact.weixin,
					email: this.exchange(this.contact.workmail),
					unit: this.contact.companyName,
					type: this.contact.type,
				};
				this.contactPersonInfo.push(arr);
				console.log(this.contactPersonInfo)
			},
			delContactPerson(row, index) {
				this.contactPersonInfo.splice(index, 1);
				if (this.tag == 1 && row.contactid) {
					this.deleteContactPersonInfo.push(row.contactid);
				}
			},
			delBank(row, index) {
				this.customerBanks.splice(index, 1);
				this.bankDeleteList.push(row.id);
			},
			delRelate(row, index) {
				this.relateCompanyList.splice(index, 1);
				if (this.tag == 1 && row.branchid) {
					this.deleteList.push(row.branchid);
				}
			},
			addBank() {
				// customerBanks
				this.customerBanks.push({
					"bankname": this.bankInfo.bankname,
					"type": this.bankInfo.type,
					"typename": this.bankInfo.type == 77 ? '基本开户行' : (this.bankInfo.type == 78 ? '一般开户行' : '涉税银行'),
					"bankaccount": this.bankInfo.bankaccount,
					"address": this.bankInfo.address,
					"telephone": this.bankInfo.telephone,
				})
			},

			addRelateCompany() {
				this.relateCompanyList.push({
					"branchname": this.relateCompany.branch.customerName,
					"superintendent": this.relateCompany.superintendent,
					"registerno": this.relateCompany.registerno,
					"registrationagency": this.relateCompany.registrationagency,
					"relatetype": this.relateCompany.relatetype,
					"isrelatecard": this.relateCompany.isrelatecard,
					"relatecustomerid": this.relateCompany.branch.customerId,
					"isheadcompany": this.relateCompany.isheadcompany,
					"remark": this.relateCompany.remark,
					"state": 1
				})
			},
			getServestate() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=' + 22).then(res => {
						if (res.data.code == 200) {
							this.statusList = res.data.data;

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

			getCustomers() {

				let params = {
					currentPage: this.currentPage,
					pageCount: this.pageSize,
					customerid: this.searchList.customerId,
					servstate: this.searchList.servstate
				};
				this.axios.post('/perTaxToolTwo/columbusNew/tCustomerInfo/getTCustomerInfoList.do', params).then(res => {
						if (res.data.code == 200) {
							this.tableList = res.data.data;
							this.total = res.data.count;
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
			search(formName) {
				// this.$refs[formName].validate((valid) => {
				// 	if (valid) {
						this.getCustomers();
				// 	} else {
				// 		console.log('error submit!!');
				// 		return false;
				// 	}
				// })
			},

			reset() {
				this.customerNatureInfo = {};
				this.customerTaxInfo = {
					taxcode: ''
				};
				this.contactList = [];
				this.specialMember = {
					phone: '',
					email: ''
				};
				this.customerBanks = [];
				this.customerAddressTem = [];
				this.customerAddress = [
					[],
					[],
					[],
					[]
				];
				this.contactPersonInfo = [];
				this.relateCompanyList = [];
			},
			add() {
				this.tag = 0;
				this.dialogVisible = true;
				this.reset()
			},

			showDialog(row) {
				this.tag = 1;
				this.canShow = false;
				this.canEdit = true;
				this.dialogVisible = true;
				this.upCustomerid = row.customerid;
				let params = {
					customerid: row.customerId
				}
				this.axios.get('/perTaxToolTwo/columbusNew/tCustomerInfo/getTCustomerInfoDetail.do?customerid=' + row.customerid)
					.then(res => {
						if (res.data.code == 200) {
							this.customerNatureInfo = res.data.data.tCustomerInfo;
							this.customerTaxInfo = res.data.data.tCustomerTax || {};
							this.contactList = res.data.data.tContactInfo;

							this.specialMember = res.data.data.tSpecialMember[0] ? res.data.data.tSpecialMember[0] : {
								phone: '',
								email: ''
							};
							this.customerBanks = res.data.data.tCustomerBanks;
							this.customerAddressTem = res.data.data.tAddressInfo;
							// 地址格式化
							if (this.customerAddressTem[0]) {
								this.$set(this.customerAddress, 0, [this.customerAddressTem[0]]);

							} else {
								this.$set(this.customerAddress, 0, []);
							}
							if (this.customerAddressTem[1]) {
								this.$set(this.customerAddress, 1, [this.customerAddressTem[1]]);

							} else {
								this.$set(this.customerAddress, 1, []);
							}
							// this.customerAddress[0] = [this.customerAddressTem[0]?this.customerAddressTem[0]:[]];
							// this.customerAddress[1] = [this.customerAddressTem[1]?this.customerAddressTem[1]:[]];
							this.customerAddressTem.forEach((item, index) => {
								if (item.contacttype == 82) {
									this.customerAddress[2].push(item)
								}
								if (item.contacttype == 80) {
									this.customerAddress[3].push(item)
								}
							})
							console.log(this.customerAddress[0]);
							console.log(this.customerAddress[1]);
							console.log(this.customerAddress[2]);
							console.log(this.customerAddress[3]);
							this.contactPersonInfo = res.data.data.tContactInfo;
							this.relateCompanyList = res.data.data.tCustomerBranch;
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
			commitDialog() {
				let formName = 'ruleForm1';
				console.log(this.customerAddress);

				if (this.tag == 0) {
					var address = [];
					address.push({
						"contacttype": 81,
						"content": this.customerAddress[0][0]
					});
					address.push({
						"contacttype": 83,
						"content": this.customerAddress[1][0]
					});
					this.customerAddress[2].forEach((item, index) => {
						address.push({
							"contacttype": 82,
							"content": item
						});
					})
					this.customerAddress[3].forEach((item, index) => {
						address.push({
							"contacttype": 80,
							"content": item
						});
					})
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let params = {
								tCustomerInfo: this.customerNatureInfo,
								contactPersonInfo: this.contactPersonInfo,
								addressInfo: address,
							};
							this.axios.post('/perTaxToolTwo/columbusNew/tCustomerInfo/saveTCustomerInfo.do', params)
								.then(res => {
									if (res.data.code == 200) {
										this.canShow = false;
										this.activeName = 'second';
										this.addCustomerid = res.data.data;
										this.getCustomers();
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
							console.log('error submit!!');
							return false;
						}
					});

				} else if (this.tag == 1) {
					var address = [];
					address.push({
						"contacttype": 81,
						"content": this.customerAddress[0][0].content,
						"addressId": this.customerAddress[0][0].addressid,
					});
					address.push({
						"contacttype": 83,
						"content": this.customerAddress[1][0].content,
						"addressId": this.customerAddress[1][0].addressid,
					});
					this.customerAddress[2].forEach((item, index) => {
						address.push({
							"contacttype": 82,
							"content": item.content,
							"addressId": item.addressid,
						});
					})
					this.customerAddress[3].forEach((item, index) => {
						address.push({
							"contacttype": 80,
							"content": item.content,
							"addressId": item.addressid,
						});
					})
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let params = {
								tCustomerInfo: this.customerNatureInfo,
								contactPersonInfo: this.contactPersonInfo,
								addressInfo: address,
								deleteContactPersonInfo: this.deleteContactPersonInfo,
								deleteAddress: this.deleteAddress,
								// tCustomerTax: this.customerTaxInfo,
								// tCustomerBank: this.customerBanks,
								// specialMemberInfo: this.specialMemberInfo,
								// tCustomerBranches: this.relateCompanyList
							};
							this.axios.post('/perTaxToolTwo/columbusNew/tCustomerInfo/updateTCustomerInfo.do', params)
								.then(res => {
									if (res.data.code == 200) {
										this.canShow = false;
										this.activeName = 'second';
										this.addCustomerid = res.data.data;
										this.getCustomers();
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
							console.log('error submit!!');
							return false;
						}
					});
				}

			},

			commitDialog1() {
				let formName = 'ruleForm2';
				if (this.tag == 0) {
					this.specialMemberInfo = {
						"specialname": this.specialMember.specialname,

						"sex": this.specialMember.sex,

						"serialnumber": this.specialMember.serialnumber,

						"address": this.specialMember.address,
						"phone": this.exchange(this.specialMember.phone),
						"email": this.exchange(this.specialMember.email),
					}
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let params = {
								customerid: this.addCustomerid,
								tCustomerTax: this.customerTaxInfo,
								tCustomerBank: this.customerBanks,
								specialMemberInfo: this.specialMemberInfo,
								// tCustomerBranches: this.relateCompanyList
							};
							this.axios.post('/perTaxToolTwo/columbusNew/tCustomerInfo/saveTCustomerTax.do', params)
								.then(res => {
									if (res.data.code == 200) {
										this.canShow = true;
										this.activeName = 'first';
										this.addCustomerid = '';
										this.dialogVisible = false;
										this.getCustomers();
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
							console.log('error submit!!');
							return false;
						}
					});
				} else if (this.tag == 1) {
					this.specialMemberInfo = {
						"specialname": this.specialMember.specialname,

						"sex": this.specialMember.sex,

						"serialnumber": this.specialMember.serialnumber,

						"address": this.specialMember.address,
						"phone": this.specialMember.phone,
						"email": this.specialMember.email,
						specialid: this.specialMember.specialid,
					}
					this.$refs[formName].validate((valid) => {
						if (valid) {
							let params = {
								customerid: this.upCustomerid,
								tCustomerTax: this.customerTaxInfo,
								tCustomerBank: this.customerBanks,
								specialMemberInfo: this.specialMemberInfo,
								bankDeleteList: this.bankDeleteList
							};
							this.axios.post('/perTaxToolTwo/columbusNew/tCustomerInfo/updateTCustomerTax.do', params)
								.then(res => {
									if (res.data.code == 200) {
										this.canShow = true;
										this.activeName = 'first';
										this.upCustomerid = '';
										this.dialogVisible = false;
										this.getCustomers();
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
							console.log('error submit!!');
							return false;
						}
					});
				}

			},
			commitDialog2() {
				let params = {
					customerid: this.upCustomerid,
					branchInfo: this.relateCompanyList,
					deleteList: this.deleteList

				}
				this.axios.post('/perTaxToolTwo/columbusNew/tCustomerInfo/updateBranch.do', params)
					.then(res => {
						if (res.data.code == 200) {
							this.canShow = true;
							this.activeName = 'first';
							this.upCustomerid = '';
							this.dialogVisible = false;
							this.getCustomers();
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
			hideDialog() {
				this.dialogVisible = false;
				this.reset();
			},
			selectGet(vId) {

			},

			handleItemChange(val) {
				// this.getProvince(val);
			},


			objectSpanMethod({
				row,
				column,
				rowIndex,
				columnIndex
			}) {
				if (columnIndex === 0) {
					if (rowIndex == 2) {
						return {
							rowspan: this.customerBanks.length - rowIndex,
							colspan: 1
						};
					} else if (rowIndex < 2) {
						return {
							rowspan: 1,
							colspan: 1
						};
					} else {
						return {
							rowspan: 0,
							colspan: 0
						};
					}
				}
			},

			getCompanyType() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=5')
					.then(res => {
						if (res.data.code == 200) {
							this.companyTypeList = res.data.data;
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
			getTaxType() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=3')
					.then(res => {
						if (res.data.code == 200) {
							this.taxTypeList = res.data.data;
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
			getMainmarketList() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=6')
					.then(res => {
						if (res.data.code == 200) {
							this.mainmarketList = res.data.data;
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
			getSpecialtypeList() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=8')
					.then(res => {
						if (res.data.code == 200) {
							this.specialtypeList = res.data.data;
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
			getListtypeList() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=10')
					.then(res => {
						if (res.data.code == 200) {
							this.listtypeList = res.data.data;
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
			getCustomerInfoSourceList() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=23')
					.then(res => {
						if (res.data.code == 200) {
							this.customerInfoSourceList = res.data.data;
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
			getBuyer() {
				let param = {
					buyername: "",
					state: 1
				};
				this.axios.post('/perTaxToolTwo/columbusNew/customerConfig/getBuyer.do', param)
					.then(res => {
						if (res.data.code == 200) {
							this.buyerList = res.data.data;
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
			getContactTypeList() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=19')
					.then(res => {
						if (res.data.code == 200) {
							this.contactTypeList = res.data.data;
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
			getContactPositionList() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=175')
					.then(res => {
						if (res.data.code == 200) {
							this.contactPositionList = res.data.data;
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
			getContactLevelList() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=20')
					.then(res => {
						if (res.data.code == 200) {
							this.contactLevelList = res.data.data;
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
			getPark() {
				let param = {
					parkname: "",
					state: 1
				};
				this.axios.post('/perTaxToolTwo/columbusNew/customerConfig/getParkNameConfig.do', param)
					.then(res => {
						if (res.data.code == 200) {
							this.parkList = res.data.data;
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

			getInvoiceCompany() {
				let param = {
					companyName: "",
					state: 1
				};
				this.axios.post('/perTaxToolTwo/columbusNew/customerConfig/getInvoiceCompany.do', param)
					.then(res => {
						if (res.data.code == 200) {
							this.invoiceCompanyList = res.data.data;
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

			getAddress() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=15')
					.then(res => {
						if (res.data.code == 200) {
							this.addressList = res.data.data;
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

			getProvince(val) {

				let idArea;
				let sizeArea;
				if (!val) {
					idArea = 0;
					sizeArea = 0;
				} else if (val.length === 1) {
					idArea = val[0];
					sizeArea = val.length; // 3:一级 4:二级 6:三级
				} else if (val.length === 2) {
					idArea = val[1];
					sizeArea = val.length; // 3:一级 4:二级 6:三级
				}
				this.axios.get('/perTaxToolTwo/columbusNew/config/getRegion.do')
					// this.axios.get('/perTaxToolTwo/columbusNew/config/getRegion.do?parentRegionCode=' + idArea)
					.then(res => {
						if (res.data.code == 200) {
							this.cascaderData = res.data.data;
							// let Items = res.data.data;
							// if (sizeArea === 0) { // 初始化 加载一级 省
							// 	this.cascaderData = Items.map((value, i) => {
							// 		return {
							// 			regionCode: value.regionCode,
							// 			regionName: value.regionName,
							// 			cities: []
							// 		}
							// 	})
							// } else if (sizeArea === 1) { // 点击一级 加载二级 市
							// 	this.cascaderData.map((value, i) => {
							// 		if (value.regionCode === val[0]) {
							// 			if (!value.cities.length) {
							// 				value.cities = Items.map((value, i) => {
							// 					return {
							// 						regionCode: value.regionCode,
							// 						regionName: value.regionName,
							// 						cities: []
							// 					}
							// 				})
							// 			}
							// 		}
							// 	})
							// } else if (sizeArea === 2) { // 点击二级 加载三级 区
							// 	this.cascaderData.map((value, i) => {
							// 		if (value.regionCode === val[0]) {
							// 			value.cities.map((value, i) => {
							// 				if (value.regionCode === val[1]) {
							// 					if (!value.cities.length) {
							// 						value.cities = Items.map((value, i) => {
							// 							return {
							// 								regionCode: value.regionCode,
							// 								regionName: value.regionName
							// 							}
							// 						})
							// 					}
							// 				}
							// 			})
							// 		}
							// 	})
							// }
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



			getCollectionmethodList() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=12')
					.then(res => {
						if (res.data.code == 200) {
							this.collectionmethodList = res.data.data;
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
			getAntitaxtypeList() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=18')
					.then(res => {
						if (res.data.code == 200) {
							this.antitaxtypeList = res.data.data;
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
			getTaxmanagertypeList() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=13')
					.then(res => {
						if (res.data.code == 200) {
							this.taxmanagertypeList = res.data.data;
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
			getShareHostingAddress() {
				let param = {
					state: 1
				};
				this.axios.post('/perTaxToolTwo/columbusNew/customerConfig/getShareHostingAddress.do', param)
					.then(res => {
						if (res.data.code == 200) {
							this.shareHostingAddressList = res.data.data;
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
			getRelatetype() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=160')
					.then(res => {
						if (res.data.code == 200) {
							this.relatetypeList = res.data.data;
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
			//会计主管
			findUserListByRole1() {},
			//主办会计
			findUserListByRole2() {},
			//审核会计
			findUserListByRole3() {},
			//客户经理
			findUserListByRole4() {},
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
						message: '获取人员失败',
						type: 'error'
					});
				})
			}
		},
		components: {},
		created() {
			this.getCustomerList();
			this.getServestate();
			this.getCustomers();


			//获取企业类型
			this.getCompanyType();
			//获取申报税务类型
			this.getTaxType();
			//获取主营内容
			this.getMainmarketList();
			//获取企业特殊类型
			this.getSpecialtypeList();
			//获取挂牌上市类型
			this.getListtypeList();
			//获取客户来源
			this.getCustomerInfoSourceList();
			//获取采买方
			this.getBuyer();
			//获取园区
			this.getPark();
			//获取关联合同公司
			this.getInvoiceCompany();
			//获取地址
			this.getAddress();
			//获取省分
			this.getProvince();
			//获取联系人类型
			this.getContactTypeList();
			//获取联系人职务
			this.getContactPositionList()
			//获取联系人级别
			this.getContactLevelList()

			this.getCollectionmethodList();
			//获取防伪税控类型
			this.getAntitaxtypeList();
			//获取税务管理类型
			this.getTaxmanagertypeList();
			//获取主机共享地址
			this.getShareHostingAddress();

			//获取关联公司类型
			this.getRelatetype();
			// //获取会计
			// this.findUserListByRole1();
			// this.findUserListByRole2();
			// this.findUserListByRole3();
			// //获取客户经理
			// this.findUserListByRole4();
			this.getemployList()

		}
	}
</script>

<style scoped lang="less">
	.main_contain {
		width: 100%;
		height: 100%;
		// padding: 20px;
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

	.contain_header {
		height: 2rem;
		padding: 0px 30px;
		background: url(../../../assets/img/list-bg1.png) no-repeat;
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
		position: relative;
		// padding:0px 20px;
		background: #fff;
		margin: 20px 20px;

		h3 {
			height: 40px;
			line-height: 40px;
			padding-left: 20px
		}

	}

	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
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

	.card_btn {
		text-align: center;
		margin-top: 0.36rem;
	}

	.pass {
		width: 2.4rem;
		height: 0.4rem;
		line-height: 0.4rem;
		background: #43b3db;
		color: #fff;
		display: inline-block;
		text-align: center;
		margin-top: 0.26rem;
		border-radius: 4px;
		cursor: pointer;
	}

	.redo {
		width: 2.4rem;
		height: 0.4rem;
		line-height: 0.4rem;
		background: #ed878e;
		color: #fff;
		display: inline-block;
		text-align: center;
		border-radius: 4px;
		cursor: pointer;
	}

	.searchButton {
		background: #ffb980;
		color: #fff;
		border-radius: 0.05rem;
		cursor: pointer;
		padding: 0.07rem 0.35rem;
		margin-left: 0.2rem
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




	/deep/ .el-table table {
		background-color: rgb(243, 246, 249);
		border-collapse: separate;
		border-spacing: 0px 3px;
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


	/deep/ .el-date-editor.el-input {
		width: 190px;
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
		color: #343434;
	}

	/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #fff;
	}
</style>
