<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>客服中心</el-breadcrumb-item>
			<el-breadcrumb-item>信息查询</el-breadcrumb-item>
		</el-breadcrumb>
		
		<div class="contain_body clearfix">
			<el-row>
				<el-col :span="24">
					<el-tabs type="border-card" @tab-click="handleClick" v-model="activeName">
						<el-tab-pane label="客户信息" name="0">
							
							<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;" class='clearfix'>
								<el-form :inline="true" :model="uploadData1" class="demo-form-inline" size="mini" ref='formName' label-width="100px">
									
									<el-form-item label="客户名称：" prop="customerId">
										<el-select v-model="uploadData1.customerId" placeholder="请选择" clearable filterable>
											<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
											<!-- <el-option v-for="item in customerList" :label="item.customerName" :value='item.customerId'></el-option> -->
										</el-select>
									</el-form-item>
									<el-form-item label=" " >
										<el-button size="small" type='primary' @click='search1'>查询</el-button>
									</el-form-item>
									
								</el-form>
								
								
								
							</div>
							<el-row>
								<el-col :span="24">
									<el-tabs v-model="activeNameXG">
										<el-tab-pane label="自然信息" name="first">
											<el-form :inline="true" ref="ruleForm2" :model="customerNatureInfoXG" class="demo-form-inline" label-width="120px"
											 size="small">
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">基本信息</p>
												</div>
												<el-form-item label="客户名称" prop="customername">
													<el-input v-model="customerNatureInfoXG.customername" readonly></el-input>
												</el-form-item>
												<!-- <el-form-item label="贵宾卡号" prop="vipcardno">
													<el-input v-model="customerNatureInfoXG.vipcardno" readonly></el-input>
												</el-form-item> -->
												<el-form-item label="客户经理" prop="customermanagerid">
													<el-select v-model="customerNatureInfoXG.customermanagerid" readonly>
														<el-option v-for="item in employList" :label="item.userName" :value="item.userId"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="客户来源" prop="customerInfoSource">
													<el-select v-model="customerNatureInfoXG.customerinfosource" readonly>
														<el-option v-for="item in customerInfoSourceList" :label="item.dicName" :value="item.dicId"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="转介绍公司" prop="sourcename">
													<el-select v-model="customerNatureInfoXG.sourcename" readonly>
														<el-option v-for="item in customerList" :label="item.customerName" :value="item.customerName"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="关联合同公司" prop="relatecontractcustomername">
													<el-input v-model="customerNatureInfoXG.relatecontractcustomername" readonly></el-input>
												</el-form-item>
												<el-form-item label="企业类型" prop="customertypename">
													<el-input v-model="customerNatureInfoXG.customertypename" readonly></el-input>
												</el-form-item>
												<el-form-item label="所在区域" prop="area">
													<el-input v-model="customerNatureInfoXG.area" readonly></el-input>
												</el-form-item>
												
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">税务信息</p>
												</div>
												<el-form-item label="合同税务类型" prop="contractType">
													<el-input v-model="customerNatureInfoXG.contracttype" placeholder="由客户签订的合同决定"  readonly></el-input>
												</el-form-item>
												<el-form-item label="申报税务类型" prop="taxdeclarationtypename">
													<el-input v-model="customerNatureInfoXG.taxdeclarationtypename" readonly></el-input>
												</el-form-item>
												
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">经营信息</p>
												</div>
												<el-form-item label="法人代表" prop="legalperson">
													<el-input v-model="customerNatureInfoXG.legalperson" readonly></el-input>
												</el-form-item>
												<el-form-item label="法人身份证" prop="certificateno">
													<el-input v-model="customerNatureInfoXG.certificateno" readonly></el-input>
												</el-form-item>
												<el-form-item label="注册资金(万元)" prop="registermoney">
													<el-input v-model="customerNatureInfoXG.registermoney" readonly></el-input>
												</el-form-item>
												<el-form-item label="实收资本(万元)" prop="realcapital">
													<el-input v-model="customerNatureInfoXG.realcapital" readonly></el-input>
												</el-form-item>
												<el-form-item label="行业" prop="industry">
													<el-input v-model="customerNatureInfoXG.industry" readonly></el-input>
												</el-form-item>
												<el-form-item label="公司成立日期" prop="bounddate">
													<el-date-picker v-model="customerNatureInfoXG.bounddate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"  readonly
													 ></el-date-picker>
												</el-form-item>
												<el-form-item label="组织结构代码证代码" prop="orgstrucodeno" class="longLabel">
													<el-input v-model="customerNatureInfoXG.orgstrucodeno" readonly></el-input>
												</el-form-item>
												<el-form-item label="营业执照注册号" prop="businesslicenseno">
													<el-input v-model="customerNatureInfoXG.businesslicenseno" readonly></el-input>
												</el-form-item>
												<el-form-item label="营业执照是否有有效期" prop="isLicenseHaveTime" class="longLabel">
													<el-select v-model="customerNatureInfoXG.islicensehavetime" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="营业执照截止日期" prop="licenseenddate" class="longLabel">
													<el-date-picker v-model="customerNatureInfoXG.licenseenddate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" readonly
													 ></el-date-picker>
												</el-form-item>
												<el-form-item label="是否挂牌上市" prop="islist">
													<el-select v-model="customerNatureInfoXG.islist" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="公司注册地址" prop="registerlocation">
													<el-input v-model="customerNatureInfoXG.registerlocation" readonly></el-input>
												</el-form-item>
												<br>
												<el-form-item label="是否有许可经营范围" prop="isscopebusiness" class="longLabel">
													<el-select v-model="customerNatureInfoXG.isscopebusiness" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="经营许可范围" prop="scopeBussProject" class="textareaWidth">
													<el-input type="textarea" :rows="2" v-model="customerNatureInfoXG.scopebussproject" readonly></el-input>
												</el-form-item><br>
												<el-form-item label="企业经营范围" prop="businessScope" class="textareaWidth">
													<el-input type="textarea" :rows="2" v-model="customerNatureInfoXG.businessscope" readonly></el-input>
												</el-form-item>
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">合作信息</p>
												</div>
												<el-form-item label="是否使用我司地址" prop="isUseOurDeptLocation" class="longLabel">
													<el-select v-model="customerNatureInfoXG.isuseourdeptlocation" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												
												<el-form-item label="是否代拿银行单据" prop="isreplacetakedoc" class="longLabel">
													<el-select v-model="customerNatureInfoXG.isreplacetakedoc" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="签约日期" prop="signingdate">
													<el-date-picker v-model="customerNatureInfoXG.signingdate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"  readonly
													 ></el-date-picker>
												</el-form-item>
												<el-form-item label="是否认缴" prop="isSubscribe">
													<el-select v-model="customerNatureInfoXG.issubscribe" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="认缴年限" prop="subscribeYears">
													<el-input v-model="customerNatureInfoXG.subscribeyears" readonly></el-input>
												</el-form-item>
												<el-form-item label="是否有关联公司" prop="isHaveRelateCustomer">
													<el-select v-model="customerNatureInfoXG.ishaverelatecustomer" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
											
												<el-form-item label="是否合并所得税" prop="isMergeIncomeTax">
													<el-select v-model="customerNatureInfoXG.ismergeincometax" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="合并所得税至" prop="mergeIncomeTax">
													<el-input v-model="customerNatureInfoXG.mergeincometax" readonly></el-input>
												</el-form-item>
											
												<el-form-item label="是否零申报" prop="iszerotax">
													<el-select v-model="customerNatureInfoXG.iszerotax" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="是否购买发票" prop="isBuyTicket">
													<el-select v-model="customerNatureInfoXG.isbuyticket" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="是否购票资质认证" prop="isBuyInv" class="longLabel">
													<el-select v-model="customerNatureInfoXG.isbuyinv" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="是否为中高端客户" prop="isHighEndCustomer" class="longLabel">
													<el-select v-model="customerNatureInfoXG.ishighendcustomer" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="是否取票" prop="istaketicket">
													<el-select v-model="customerNatureInfoXG.istaketicket" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="是否需要账务初始化" prop="isaccountinitialization" class="longLabel">
													<el-select v-model="customerNatureInfoXG.isaccountinitialization" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="备注" prop="remark" class="textareaWidth">
													<el-input type="textarea" :rows="2" v-model="customerNatureInfoXG.remark" readonly></el-input>
												</el-form-item>
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">会计信息</p>
												</div>
												<el-form-item label="会计主管" prop="managerAccountant">
													<el-select v-model="customerNatureInfoXG.managerAccountantId" readonly>
														<el-option v-for="item in employList" :label="item.userName" :value="item.userId"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="主办会计" prop="hostAccountant">
													<el-select v-model="customerNatureInfoXG.hostAccountantId" readonly>
														<el-option v-for="item in employList" :label="item.userName" :value="item.userId"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="审核会计" prop="auditAccountant">
													<el-select v-model="customerNatureInfoXG.auditAccountantId" readonly>
														<el-option v-for="item in employList" :label="item.userName" :value="item.userId"></el-option>
													</el-select>
												</el-form-item>
											
											
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">其他</p>
												</div>
												<el-form-item label="企业注册日期" prop="registerdate">
													<el-date-picker v-model="customerNatureInfoXG.registerdate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" readonly
													 ></el-date-picker>
												</el-form-item>
												<el-form-item label="税务登记办证日期" prop="taxregisterdate" class='longLabel'>
													<el-date-picker v-model="customerNatureInfoXG.taxregisterdate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" readonly
													 ></el-date-picker>
												</el-form-item>
												<el-form-item label="服务状态" prop="servstate">
													<el-select v-model="customerNatureInfoXG.servstate" readonly>
														<el-option v-for="item in statusList" :label="item.dicName" :value="item.dicId"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="是否有工商处罚" prop="isbusinesspunish">
													<el-select v-model="customerNatureInfoXG.isbusinesspunish" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="是否有经纪人" prop="isbroker">
													<el-select v-model="customerNatureInfoXG.isbroker" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="是否是新户" prop="isnewcustomer">
													<el-select v-model="customerNatureInfoXG.isnewcustomer" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="是否是园区" prop="ispark">
													<el-select v-model="customerNatureInfoXG.ispark" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="园区" prop="parkId">
													<el-select v-model="customerNatureInfoXG.parkid" readonly>
														<el-option v-for="item in parkList" :label="item.parkname" :value="item.parknameconfigid"></el-option>
													</el-select>
												</el-form-item>
											
												<el-form-item label="主营内容" prop="mainMarketContent">
													<el-select v-model="customerNatureInfoXG.mainmarketcontent" readonly>
														<el-option v-for="item in mainmarketList" :label="item.dicName" :value="item.dicId"></el-option>
													</el-select>
												</el-form-item>
											
												<el-form-item label="企业特殊类型" prop="specialType">
													<el-select v-model="customerNatureInfoXG.specialtype" readonly>
														<el-option v-for="item in specialtypeList" :label="item.dicName" :value="item.dicId"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="挂牌上市类型" prop="listType">
													<el-select v-model="customerNatureInfoXG.listtype" readonly>
														<el-option v-for="item in listtypeList" :label="item.dicName" :value="item.dicId"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="采买方" prop="buyerid">
													<el-select v-model="customerNatureInfoXG.buyerid" readonly>
														<el-option v-for="item in buyerList" :label="item.buyername" :value="item.buyerid"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="状态" prop="state">
													<el-select v-model="customerNatureInfoXG.state" placeholder="请选择状态" readonly>
														<el-option v-for="item in statusOption" :label="item.label" :value="item.value"></el-option>
														<!-- <el-option label="无效" value="0"></el-option>
														<el-option label="有效" value="1"></el-option> -->
													</el-select>
												</el-form-item>
												<el-form-item label="是否存在相关客户在其他财务公司代账" prop="isOthersProxy" class="longLabel">
													<el-select v-model="customerNatureInfoXG.isothersproxy" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="相关客户名称" prop="othersName">
													<el-input v-model="customerNatureInfoXG.othersname" readonly></el-input>
												</el-form-item>
												<el-form-item label="财务公司名称" prop="financeName">
													<el-input v-model="customerNatureInfoXG.financename" readonly></el-input>
												</el-form-item>
												<el-form-item label="帐套代码" prop="accountSetCode" class="textareaWidth">
													<el-input type="textarea" :rows="2" v-model="customerNatureInfoXG.accountsetcode" readonly></el-input>
												</el-form-item>
												<el-form-item label="来源说明" prop="infoSourceExplain" class="textareaWidth">
													<el-input type="textarea" :rows="2" v-model="customerNatureInfoXG.infosourceexplain" readonly></el-input>
												</el-form-item>
											
											
											
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">地址信息</p>
												</div>
												<div style="width: 100%;">
													
											
													<el-form-item label="注册地址" prop="managerAccountant">
														<el-tag v-for="tag in customerAddressXG[0]" :disable-transitions="false">
															{{tag.content?tag.content:''}}
														</el-tag>
														
														
											
													</el-form-item>
												</div>
												<div style="width: 100%;">
													
											
													<el-form-item label="实际经营地址" prop="hostAccountant">
														<el-tag v-for="tag in customerAddressXG[1]" :disable-transitions="false">
															{{tag.content?tag.content:''}}
														</el-tag>
														
														
											
													</el-form-item>
												</div>
												<div style="width: 100%;">
													
											
													<el-form-item label="取票地址" prop="auditAccountant">
														<el-tag v-for="tag in customerAddressXG[2]"  :disable-transitions="false">
															{{tag.content?tag.content:''}}
														</el-tag>
														
														
													</el-form-item>
												</div>
												<div style="width: 100%;">
													
											
													<el-form-item label="联系地址" prop="auditAccountant">
														<el-tag v-for="tag in customerAddressXG[3]"  :disable-transitions="false">
															{{tag.content?tag.content:''}}
														</el-tag>
														
														
														
													</el-form-item>
												</div>
											
											
											
											
											
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">联系人信息</p>
												</div>
												<el-table :data="contactPersonInfoXG" style="width: 100%" stripe border>
													<el-table-column align="center" label="姓名" prop="contactname" :resizable="false"></el-table-column>
													<el-table-column align="center" label="职务" prop="positionName" :resizable="false">
														<template slot-scope="scope">
															<div>{{scope.row.positionName}}</div>
														</template>
													</el-table-column>
													<el-table-column align="center" label="级别" prop="levelName" :resizable="false">
														<template slot-scope="scope">
																<div>{{scope.row.levelName}}</div>
															</template>
														</el-table-column>
													</el-table-column>
													<el-table-column align="center" label="类型" prop="typeName" :resizable="false">
														<template slot-scope="scope">
																<div>{{scope.row.typeName}}</div>
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
													<!-- <el-table-column align="center" :resizable="false">
														<template slot="header" slot-scope="scope">
															<span>操作</span>
														</template>
														<template slot-scope="scope">
															<el-button size="mini" type="text" @click="delContactPersonXG(scope.row,scope.$index)">删除</el-button>
														</template>
													</el-table-column> -->
											
												</el-table>
											
											</el-form>
										</el-tab-pane>
										<el-tab-pane label="涉税信息" name="second">
											<el-form :inline="true" ref="ruleForm2" :model="customerTaxInfoXG" class="demo-form-inline" label-width="120px" size="small">
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">基本信息</p>
												</div>
												<el-form-item label="电子税务局纳税识别号" prop="taxcode" class="longLabel">
													<el-input v-model="customerTaxInfoXG.taxcode" readonly></el-input>
												</el-form-item>
												<el-form-item label="从业人数" prop="engageNumber">
													<el-input v-model="customerTaxInfoXG.engagenumber" readonly></el-input>
												</el-form-item>
												<el-form-item label="所得税税率" prop="incometaxrate">
													<el-input v-model="customerTaxInfoXG.incometaxrate" readonly></el-input>
												</el-form-item>
												<el-form-item label="地税管理码" prop="localtaxcode">
													<el-input v-model="customerTaxInfoXG.localtaxcode" readonly></el-input>
												</el-form-item>
												<el-form-item label="办税服务厅纳税识别号" prop="newtaxpayerid" class="longLabel">
													<el-input v-model="customerTaxInfoXG.newtaxpayerid" readonly></el-input>
												</el-form-item>
												<el-form-item label="所得税征收方式" prop="collectionMethod">
													<el-select v-model="customerTaxInfoXG.collectionmethod" readonly>
														<el-option v-for="item in collectionmethodList" :label="item.dicName" :value="item.dicId"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="地税软密码" prop="newtaxpayerid">
													<el-input v-model="customerTaxInfoXG.localtaxpassword" readonly></el-input>
												</el-form-item>
											
												<el-form-item label="增资信息" prop="adddatainfo">
													<el-input v-model="customerTaxInfoXG.adddatainfo" readonly></el-input>
												</el-form-item>
												<el-form-item label="核定征收率(%)" prop="checkRate">
													<el-input v-model="customerTaxInfoXG.checkrate" readonly></el-input>
												</el-form-item>
												<el-form-item label="是否有代理认证服务" prop="isproxyauthentication" class="longLabel">
													<el-select v-model="customerTaxInfoXG.isproxyauthentication" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="主机共享地址" prop="hostShareUrl">
													<!-- <el-input v-model="customerTaxInfo.sharehostingaddressid" placeholder="请输入主机共享地址"></el-input> -->
													<el-select v-model="customerTaxInfoXG.sharehostingaddressid" readonly>
														<el-option v-for="item in shareHostingAddressList" :label="item.transactaddress" :value="item.sharehostingaddressid"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="做账/报税客户分类" prop="isOnlyTax" class="longLabel">
													<!-- <el-input v-model="customerTaxInfo.sharehostingaddressid" placeholder="请输入主机共享地址"></el-input> -->
													<el-input v-model="customerTaxInfoXG.isonlytax" readonly>
														
													</el-input>
												</el-form-item>
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">涉税事项信息</p>
												</div>
												<el-form-item label="是否缴纳注册资金印花税" prop="isPaySignTax" class="longLabel">
													<el-select v-model="customerTaxInfoXG.ispaysigntax" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
											
												<el-form-item label="是否进出口企业" prop="isImportExport">
													<el-select v-model="customerTaxInfoXG.isimportexport" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="是否简易征收" prop="isEasyTax">
													<el-select v-model="customerTaxInfoXG.iseasytax" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="是否增资" prop="isIncreaseCapital">
													<el-select v-model="customerTaxInfoXG.isincreasecapital" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="是否防伪税控" prop="isAntiTax">
													<el-select v-model="customerTaxInfoXG.isantitax" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="防伪税控类型" prop="antiTaxType">
													<el-select v-model="customerTaxInfoXG.antitaxtype" readonly>
														<el-option v-for="item in antitaxtypeList" :label="item.dicName" :value="item.dicId"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="防伪税控所属区域" prop="transactregionid" class="longLabel">
													<el-select v-model="customerTaxInfoXG.transactregionid" readonly>
														<el-option v-for="item in antitaxtypeList" :label="item.dicName" :value="item.dicId"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="税务管理类型" prop="taxmanagertype">
													<el-select v-model="customerTaxInfoXG.taxmanagertype" readonly>
														<el-option v-for="item in taxmanagertypeList" :label="item.dicName" :value="item.dicId"></el-option>
													</el-select>
												</el-form-item>
											
												<el-form-item label="辅导期开始时间" prop="coachDate">
													<el-date-picker v-model="customerTaxInfoXG.coachdatestart" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" readonly
													 ></el-date-picker>
												</el-form-item>
												<el-form-item label="辅导期截止时间" prop="coachDate">
													<el-date-picker v-model="customerTaxInfoXG.coachdateend" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" readonly
													 ></el-date-picker>
												</el-form-item>
											
												<el-form-item label="土地使用税缴纳时间1" prop="coachDate" class='longLabel'>
													<el-date-picker v-model="customerTaxInfoXG.paylandtime1" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" readonly
													 ></el-date-picker>
												</el-form-item>
												<el-form-item label="土地使用税缴纳时间2" prop="coachDate" class='longLabel'>
													<el-date-picker v-model="customerTaxInfoXG.paylandtime2" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" readonly
													 ></el-date-picker>
												</el-form-item>
											
												<el-form-item label="房产税缴纳时间1" prop="coachDate">
													<el-date-picker v-model="customerTaxInfoXG.payhousetime1" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" readonly
													 ></el-date-picker>
												</el-form-item>
												<el-form-item label="房产税缴纳时间2" prop="coachDate">
													<el-date-picker v-model="customerTaxInfoXG.payhousetime2" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd" readonly
													 ></el-date-picker>
												</el-form-item>
											
												<el-form-item label="备注" prop="remark" class="textareaWidth">
													<el-input type="textarea" :rows="2" v-model="customerTaxInfoXG.remark" readonly></el-input>
												</el-form-item>
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">社保信息</p>
												</div>
												<el-form-item label="是否申报社保" prop="isDeclareSocial">
													<el-select v-model="customerTaxInfoXG.isdeclaresocial" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="社保证号" prop="socialNo">
													<el-input v-model="customerTaxInfoXG.socialno" readonly></el-input>
												</el-form-item>
												<el-form-item label="社保证密码" prop="socialPwd">
													<el-input v-model="customerTaxInfoXG.socialpwd" readonly></el-input>
												</el-form-item>
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">税务缴纳信息</p>
												</div>
												<el-form-item label="是否缴纳土地使用税" prop="isPayLandTax" class="longLabel">
													<el-select v-model="customerTaxInfoXG.ispaylandtax" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="是否缴纳房产税" prop="ispayhousetax">
													<el-select v-model="customerTaxInfoXG.ispayhousetax" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">保税周期</p>
												</div>
												<el-form-item label="国地税保税周期" prop="stateTaxCycle">
													<el-select v-model="customerTaxInfoXG.taxcycle" readonly>
														<el-option v-for="item in periodList" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
											
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">申报信息</p>
												</div>
												<el-form-item label="是否网上申报" prop="isonlinedeclare">
													<el-select v-model="customerTaxInfoXG.isonlinedeclare" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="是否代开发票" prop="isproxyinvoice">
													<el-select v-model="customerTaxInfoXG.isproxyinvoice" readonly>
														<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
													</el-select>
												</el-form-item>
											
												<el-form-item label="网上申报密码" prop="taxpassword">
													<el-input v-model="customerTaxInfoXG.taxpassword" readonly></el-input>
												</el-form-item>
												<el-form-item label="应税面积" prop="taxarea">
													<el-input v-model="customerTaxInfoXG.taxarea" readonly></el-input>
												</el-form-item>
												<el-form-item label="单位税额" prop="unittax">
													<el-input v-model="customerTaxInfoXG.unittax" readonly></el-input>
												</el-form-item>
												<el-form-item label="房产原值" prop="houseoriginalval">
													<el-input v-model="customerTaxInfoXG.houseoriginalval" readonly></el-input>
												</el-form-item>
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">银行信息</p>
												</div>
												
												<el-table :data="customerBanksXG" style="width: 100%" stripe border>
													<el-table-column align="center" label="银行类型" prop="typename" :resizable="false"></el-table-column>
													<el-table-column align="center" label="银行名称" prop="bankname" :resizable="false"></el-table-column>
													<el-table-column align="center" label="账户" prop="bankaccount" :resizable="false"></el-table-column>
													<el-table-column align="center" label="电话" prop="telephone" :resizable="false"></el-table-column>
													<el-table-column align="center" label="地址" prop="address" :resizable="false"></el-table-column>
													
												</el-table>
											
												<div class="tabtitle">
													<p class="lineicon"></p>
													<p class="linetext">专管员信息</p>
												</div>
												<el-form-item label="姓名" prop="name">
													<el-input v-model="specialMemberXG.specialname" readonly></el-input>
												</el-form-item>
												<el-form-item label="性别" prop="sex">
													<el-select v-model="specialMemberXG.sex" readonly>
														<el-option label="男" value="1"></el-option>
														<el-option label="女" value="0"></el-option>
													</el-select>
												</el-form-item>
												<el-form-item label="办公室地址" prop="address">
													<el-input v-model="specialMemberXG.address" readonly></el-input>
												</el-form-item>
												<el-form-item label="办公室编号" prop="no">
													<el-input v-model="specialMemberXG.serialnumber" readonly></el-input>
												</el-form-item>
												
												<div style="width: 100%;">
													<el-form-item label="电话" prop="phone">
														<el-tag v-show='specialMemberXG.phone' :key="tag" v-for="tag in specialMemberXG.phone.split(',')"  :disable-transitions="false">
															{{tag}}
														</el-tag>
														
													</el-form-item>
												</div>
												<div style="width: 100%;">
													<el-form-item label="邮箱" prop="email">
														<el-tag v-show='specialMemberXG.email' :key="tag" v-for="tag in specialMemberXG.email.split(',')" :disable-transitions="false">
															{{tag}}
														</el-tag>
														
														
													</el-form-item>
												</div>
											
											</el-form>
											
											
											
											
											
										</el-tab-pane>
										<el-tab-pane label="关联公司" name="third">
											
											<el-table :data="relateCompanyList" style="width: 100%">
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
								</el-col>
								
							</el-row>
							
					
					
					
					
						</el-tab-pane>
						<el-tab-pane label="合同信息" name="2">
							<div>
								<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;" class='clearfix'>
									<el-form :inline="true" :model="uploadData2" class="demo-form-inline" size="mini" ref='formName' label-width="100px">
										
										<el-form-item label="客户名称：" prop="customerId">
											<el-select v-model="uploadData2.customerId" placeholder="请选择" clearable filterable>
												<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
												<!-- <el-option v-for="item in customerList" :label="item.customerName" :value='item.customerId'></el-option> -->
											</el-select>
										</el-form-item>
										<el-form-item label=" " >
											<el-button size="small" type='primary' @click='search2'>查询</el-button>
										</el-form-item>
										
									</el-form>
									
									
									
								</div>
								
								<el-form :inline="true" ref="ruleForm1" :model="detail" class="demo-form-inline" label-width="120px" size="mini">
									<div class="tabtitle">
										<p class="lineicon"></p>
										<p class="linetext">基本信息</p>
									</div>
									<div></div>
									
									<el-form-item label="合同单号" prop="contractCode">
										<el-input v-model="detail.contractcode" readonly></el-input>
									</el-form-item>
									<el-form-item label="客户名称" prop="customername">
										<el-input v-model="detail.customername" readonly></el-input>
									</el-form-item>
									<el-form-item label="签约日期" prop="signDate">
										<el-date-picker v-model="detail.signdate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" readonly></el-date-picker>
								
									</el-form-item>
									<el-form-item label="生效日期" prop="arealist">
										<el-date-picker v-model="detail.effectivedate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" readonly></el-date-picker>
								
									</el-form-item>
									<el-form-item label="合同终止日期" prop="arealist">
										<el-date-picker v-model="detail.contenddate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" readonly></el-date-picker>
								
									</el-form-item>
									<el-form-item label="合同开始日期" prop="arealist">
										<el-date-picker v-model="detail.contstartdate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" readonly></el-date-picker>
								
									</el-form-item>
									<el-form-item label="甲方授权代表" prop="arealist">
										<el-input v-model="detail.ownerrepresent" readonly></el-input>
								
									</el-form-item>
									<el-form-item label="截止日期" prop="arealist">
										<el-date-picker v-model="detail.closingdate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" readonly></el-date-picker>
								
									</el-form-item>
									<el-form-item label="作废时间" prop="arealist">
										<el-date-picker v-model="detail.canceltime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" readonly></el-date-picker>
								
									</el-form-item>
									<el-form-item label="缴费截止日期" prop="arealist">
										<el-date-picker v-model="detail.payenddate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" readonly></el-date-picker>
								
									</el-form-item>
									<el-form-item label="合同类型" prop="contracttypename">
										<el-input v-model="detail.contracttypename" readonly></el-input>
										
									</el-form-item>
									<el-form-item label="客户类型" prop="customertypename">
										<el-input v-model="detail.customertypename" readonly></el-input>
										
								
									</el-form-item>
									
									<el-form-item label="合同税务类型" prop="contracttaxtypeName">
										<el-input v-model="detail.contracttaxtypeName" readonly></el-input>
										
									</el-form-item>
									<el-form-item label="是否取票" prop="customertype">
										<el-select v-model="detail.istaketicket" filterable readonly>
											<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
								
									<el-form-item label="是否零申报" prop="arealist">
										<el-select v-model="detail.iszerotax" filterable readonly>
											<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="是否代理认证" prop="sourcename">
										<el-select v-model="detail.isproxyauthentication" readonly>
											<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="是否代开发票" prop="relateContractCustomer">
										<el-select v-model="detail.isproxyinvoice" readonly>
											<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="是否财务顾问合同" prop="relateContractCustomer" class='longLabel'>
										<el-select v-model="detail.isfinadvcontract" readonly>
											<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="甲方经手人" prop="relateContractCustomer">
										<el-input v-model="detail.firstparty" readonly></el-input>
								
									</el-form-item>
									<el-form-item label="甲方违约金(元)" prop="arealist">
										<el-input v-model="detail.firstpartypenalty" readonly></el-input>
									</el-form-item>
									<el-form-item label="乙方违约金(元)" prop="arealist">
										<el-input v-model="detail.secondpartypenalty" readonly></el-input>
									</el-form-item>
									<el-form-item label="合同单价(元)" prop="arealist">
										<el-input v-model="detail.unitprice" readonly></el-input>
								
									</el-form-item>
									<el-form-item label="结算方式" prop="arealist">
										<el-input v-model="detail.paytypename" readonly></el-input>
										
									</el-form-item>
									<el-form-item label="首付款金额" prop="arealist">
										<el-input v-model="detail.firstpayment" readonly></el-input>
									</el-form-item>
									<el-form-item label="登记人" prop="arealist">
										<el-input v-model="detail.registerperson" readonly></el-input>
									</el-form-item>
									<el-form-item label="登记日期" prop="arealist">
										<el-date-picker v-model="detail.registertime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" readonly></el-date-picker>
									</el-form-item>
									<el-form-item label="状态" prop="statename">
										<el-input v-model="detail.statename" readonly></el-input>
									</el-form-item>
									<el-form-item label="是否购买发票" prop="customertype">
										<el-select v-model="detail.isbuyticket" filterable readonly>
											<el-option v-for='item in trueOrFalse' :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="审核人" prop="arealist">
										<el-input v-model="detail.auditor" readonly></el-input>
								
									</el-form-item>
									<el-form-item label="审核时间" prop="arealist">
										<el-date-picker v-model="detail.audittime" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" readonly></el-date-picker>
								
									</el-form-item>
									<el-form-item label="不通过原因" prop="arealist">
										<el-input v-model="detail.nopassreason" readonly></el-input>
									</el-form-item>
								
									<el-form-item label="帐户" prop="arealist">
										<el-input v-model="detail.accountNo" readonly></el-input>
									</el-form-item>
									
									<el-form-item label="作废人识别号" prop="state">
										<el-input v-model="detail.disannulid" readonly></el-input>
									</el-form-item>
									<el-form-item label="签单组" prop="customertype">
										<el-select v-model="detail.signbillgroupid" filterable readonly>
											<el-option v-for='item in employList' :label="item.userName" :value="item.userId"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="电话组" prop="arealist">
										<el-select v-model="detail.telgroupid" filterable readonly>
											<el-option v-for='item in employList' :label="item.userName" :value="item.userId"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="是否第一份合同" prop="arealist">
								
										<el-select v-model="detail.isfirstcontract" filterable readonly>
											<el-option v-for='item in trueOrFalse' :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="未完成首付款" prop="arealist">
										<el-input v-model="detail.unfinishedfirstpayment" readonly></el-input>
								
									</el-form-item>
								
									<el-form-item label="是否银行对账" prop="arealist">
								
										<el-select v-model="detail.isbankreconciliation" filterable readonly>
											<el-option v-for='item in trueOrFalse' :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
									
									<el-form-item label="来访还是上门拜访" prop="arealist" class='longLabel'>
										<el-select v-model="detail.iscomeorgovist" filterable readonly>
											<el-option v-for='item in iscomeorgov' :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
									<el-form-item label="约见类型是否审核" prop="arealist" class='longLabel'>
										<el-select v-model="detail.isappointtypeaduit" filterable readonly>
											<el-option v-for='item in trueOrFalse' :label="item.label" :value="item.value"></el-option>
										</el-select>
									</el-form-item>
									
									<el-form-item label="收入发票单价" prop="state">
										<el-input v-model="detail.incomeinvoiceprice" readonly></el-input>
									</el-form-item>
									<el-form-item label="票据移交方式" prop="customertype">
										<el-select v-model="detail.taxmethod" filterable readonly>
											<el-option v-for='item in taxmethodList' :label="item.dicName" :value="item.dicId"></el-option>
										</el-select>
									</el-form-item>
								
								
									<el-form-item label="备注" prop="arealist">
										<el-input v-model="detail.remark" readonly></el-input>
									</el-form-item>
								
								
									<div class="tabtitle">
										<p class="lineicon"></p>
										<p class="linetext">合同服务项目</p>
									</div>
								
									<el-table :data="contractServiceProjectList" style="width: 100%" stripe border>
										<el-table-column align="center" label="合同服务项目名称" prop="serviceitem" :resizable="false"></el-table-column>
										<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>
									</el-table>
								
									<div class="tabtitle">
										<p class="lineicon"></p>
										<p class="linetext">合同服务项目明细</p>
									</div>
								
									<el-table :data="contractDetailList" style="width: 100%" stripe border>
										<el-table-column align="center" label="编号" prop="svritemno" :resizable="false"></el-table-column>
										<el-table-column align="center" label="服务名称" prop="svritemname" :resizable="false"></el-table-column>
										<el-table-column align="center" label="费用类型" prop="costtypename" :resizable="false"></el-table-column>
										<el-table-column align="center" label="服务单价(元)" prop="unitsprice" :resizable="false"></el-table-column>
								
									</el-table>
								
								
								</el-form>
								
								
							</div>
					
					
					
						</el-tab-pane>
					
					
						<!-- <el-tab-pane label="资料信息" name="3">
							<div>
								<div style="width: 100%;background: #fff;padding: 10px 20px 0px;box-sizing: border-box;" class='clearfix'>
									<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName' label-width="100px">
										
										<el-form-item label="客户名称：" prop="customer">
											<el-select v-model="uploadData.customer" placeholder="请选择" clearable filterable value-key="customerId">
										
												<el-option v-for="item in customerList" :label="item.customerName" :value='item'></el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="资料名称" prop="materialName">
											<el-input v-model="uploadData.materialName" clearable></el-input>
										</el-form-item>
										<el-form-item label="资料类型" prop="dossierName">
											<el-select v-model="uploadData.type" clearable filterable value-key='dictionaryId'>
																	
												<el-option v-for="item in typeList" :label="item.dateName" :value='item'></el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="资料状态" prop="dossierName">
											<el-select v-model="uploadData.materialState" clearable filterable>
												<el-option v-for="item in stateList" :label="item.label" :value='item.value'></el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="条形码" prop="barCode">
											<el-input v-model="uploadData.barCode" clearable></el-input>
										</el-form-item>
										
										
										
										
							
									</el-form>
									<el-button size="small" type='primary' @click='search3' style="float: right;">查询</el-button>
									
								</div>
								<el-table :data="tableList" style="width: 100%" v-loading='loading'>
									
								
									
									<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>
								
								
									<el-table-column align="center" label="资料名称" prop="materialName" :resizable="false"></el-table-column>
									<el-table-column align="center" label="条码值" prop="barCode" :resizable="false"></el-table-column>
									
									<el-table-column align="center" label="库位名称" prop="librarySheet2" :resizable="false"></el-table-column>
									
									
									<el-table-column align="center" label="账期" prop="period" :resizable="false"></el-table-column>
									<el-table-column align="center" label="资料状态" prop="materialState" :resizable="false">
										<template slot-scope="scope">
											<span v-if='scope.row.materialState == 0'>保存资料到明细库</span>
											<span v-if='scope.row.materialState == 1'>待审核</span>
											<span v-if='scope.row.materialState == 2'>审批同意</span>
											<span v-if='scope.row.materialState == 3'>审批拒绝 </span>
											<span v-if='scope.row.materialState == 4'>领用</span>
											<span v-if='scope.row.materialState == 5'>归还</span>
											<span v-if='scope.row.materialState == 6'>已出库</span>
											<span v-if='scope.row.materialState == 7'>转交</span>
											<span v-if='scope.row.materialState == 8'>已经删除</span>
										</template>
									</el-table-column>
									<el-table-column align="center" label="凭证号" prop="voucherNo" :resizable="false"></el-table-column>
									<el-table-column align="center" label="金税盘盘号" prop="userName" :resizable="false"></el-table-column>
									<el-table-column align="center" label="资料描述" prop="remark1" :resizable="false"></el-table-column>
								
									
								</el-table>
								
								<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
								 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
								</el-pagination>
							</div>
					
					
					
						</el-tab-pane> -->
					
					
					</el-tabs>
					
				</el-col>
					
			</el-row>
			
		</div>
		
	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				customerId:"",
				customerId1:"",
				customerList:[],
				typeList: [],
				materialParentCategoryList:[],
				uploadData: {},
				uploadData1: {},
				uploadData2: {},


				multipleSelection: [],

				loading: false,


				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],
				detail: {},
				contractDetailList:[],
				contractServiceProjectList:[],
				activitygroupconfigList:[],

				dialogVisible: false,
				trueOrFalse:[
					{label:'全部',value:''},
					{label:'是',value:1},
					{label:'否',value:0}
				],
				
				activeNameXG: "first",//当前选中的tab页
				customerNatureInfoXG:{},
				customerTaxInfoXG:{},
				specialMemberXG:{
					phone: '',
					email: ''
				},
				customerBanksXG:[],//银行信息表格
				customerAddressXG: [
					[],
					[],
					[],
					[]
				],//银行地址
				customerAddressTem: [],
				
				contactPersonInfoXG: [],//联系人信息表格
				relateCompanyList: [],
			}
		},
		components: {},
		methods: {
			hideDialog() {
				this.dialogVisible = false;
				this.reset();
			},
			
			search1() {
				this.customerId1 = this.uploadData1.customerId;
				this.queryListByPage1()
			},
			
			search2() {
				this.customerId = this.uploadData2.customerId;
				this.queryListByPage2()
			},

			search3() {
				this.customerName = this.uploadData.customerName;
				this.area = this.uploadData.area;
				this.accountPeriod = this.uploadData.accountPeriod;
				this.userName = this.uploadData.userName;
				this.lastExecutorName = this.uploadData.lastExecutorName;
				this.queryListByPage()
			},


			

			handleEdit(index, row) {
				this.dialogVisible = true;
				this.form2 = JSON.parse(JSON.stringify(row))
			},

			


			


			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage()
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			
			queryListByPage1() {
				this.loading = true;
				let params = {
					customerid: this.customerId1
				}
				this.axios.get('/perTaxToolTwo/columbusNew/tCustomerInfo/getTCustomerInfoDetail.do?customerid=' + this.customerId1)
					.then(res => {
						if (res.data.code == 200) {
							this.customerNatureInfoXG = res.data.data.tCustomerInfo;
							this.customerTaxInfoXG = res.data.data.tCustomerTax || {};
							
							
							this.specialMemberXG = res.data.data.tSpecialMember[0] ? res.data.data.tSpecialMember[0] : {
								phone: '',
								email: ''
							};
							if(this.specialMemberXG.email == null){
								this.specialMemberXG.email = '';
							}
							if(this.specialMemberXG.phone == null){
								this.specialMemberXG.phone = '';
							}
							
							
							this.customerBanksXG = res.data.data.tCustomerBanks;
							this.customerAddressTem = res.data.data.tAddressInfo;
							// 地址格式化
							if (this.customerAddressTem[0]) {
								this.$set(this.customerAddressXG, 0, [this.customerAddressTem[0]]);
							
							} else {
								this.$set(this.customerAddressXG, 0, []);
							}
							if (this.customerAddressTem[1]) {
								this.$set(this.customerAddressXG, 1, [this.customerAddressTem[1]]);
							
							} else {
								this.$set(this.customerAddressXG, 1, []);
							}
							// this.customerAddress[0] = [this.customerAddressTem[0]?this.customerAddressTem[0]:[]];
							// this.customerAddress[1] = [this.customerAddressTem[1]?this.customerAddressTem[1]:[]];
							this.customerAddressTem.forEach((item, index) => {
								if (item.contacttype == 82) {
									this.customerAddressXG[2].push(item)
								}
								if (item.contacttype == 80) {
									this.customerAddressXG[3].push(item)
								}
							})
							console.log(this.customerAddressXG[0]);
							console.log(this.customerAddressXG[1]);
							console.log(this.customerAddressXG[2]);
							console.log(this.customerAddressXG[3]);
							this.contactPersonInfoXG = res.data.data.tContactInfo;
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
			
			
			queryListByPage2() {
				this.loading = true;
			
			
				let param = {
					"customerid": this.customerId,
					"state": 2,
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/columbusNew/contract/getContractByCustomerId', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						if(res.data.data){
							this.detail = res.data.data.customerContract;
							let contractDetailList = res.data.data.contractDetailList;
							contractDetailList.forEach(item => {
								this.contractDetailList.push(item.tsvrItem);
							})
							let contractServiceProjectList = res.data.data.contractServiceProjectList;
							contractServiceProjectList.forEach(item => {
								this.contractServiceProjectList.push(item.tcontSvrItemconfig);
							})
							this.activitygroupconfigList = res.data.data.activitygroupconfigList;
						}else{
							this.$message({
								message: '暂无合同信息',
								type: 'warning'
							});
						}
						
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
			
			queryListByPage() {
				this.loading = true;
			
			
				let param = {
					"row": 10,
					"page": 1,
					"data": {
						// "materialStatu": 1
					}
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/columbusNew/Material/getMaterialsPage', param).then(res => {
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
			
			getMaterialCategoryInfo() {
				let param = {
					"materialParentCategoryId":"",
				};
				// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
				this.axios.post('/perTaxToolTwo/columbusNew/MaterialCategory/getMaterialCategoryInfo', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.materialParentCategoryList = res.data.data;
			
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
			
			getMaterialParentType() {
				let params = {};
				this.axios.post('/perTaxToolTwo/columbusNew/MaterialConfig/getMaterialParentType', params).then(res => {
					if (res.data.code == 200) {
						this.typeList = res.data.data;
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
			
				}).catch(function(err) {
					this.$message({
						message: '获取存放资料类型失败',
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







		},
		created() {
			//资料信息
			// this.queryListByPage();
			this.getCustomerList();
			this.getMaterialCategoryInfo();
			this.getMaterialParentType();
		}

	}
</script>

<style scoped lang='less'>
	.main_contain {
		width: 100%;
		height: 100%;
		padding: 0px;
		box-sizing: border-box;
		/deep/ .longLabel .el-form-item__label {
			line-height: 16px;
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

	.el-dialog .el-form {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
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
