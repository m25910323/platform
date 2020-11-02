<el-tabs v-model="activeName">
	<el-tab-pane label="自然信息" name="first" :disabled="!canAdd">
		<el-form :inline="true" ref="ruleForm1" :model="customerNatureInfo" class="demo-form-inline" label-width="120px" size="small">
			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">基本信息</p>
			</div>
			<!-- :rules="[$rules.requiredInput]"
						 :rules="[$rules.requiredSelect]" -->
			<el-form-item label="客户名称" prop="customername" :rules="[$rules.requiredInput]">
				<el-input v-model="customerNatureInfo.customername" placeholder="请输入客户名称"></el-input>
			</el-form-item>

			<el-form-item label="企业类型" prop="customertype">
				<!-- <el-form-item label="企业类型" prop="customertype" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfo.customertype" filterable placeholder="请选择企业类型">
					<el-option v-for='item in companyTypeList' :label="item.dicName" :value="item.dicId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="所在区域" prop="arealist">
				<!-- <el-form-item label="所在区域" prop="arealist" :rules="[$rules.requiredSelect]"> -->
				<el-cascader v-model="customerNatureInfo.arealist" :options="cascaderData" :props="optionAreaProps"
				 @active-item-change="handleItemChange"></el-cascader>
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

			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">税务信息</p>
			</div>
			<el-form-item label="合同税务类型" prop="contractType">
				<el-input v-model="customerNatureInfo.contracttype" placeholder="由客户签订的合同决定" readonly></el-input>
			</el-form-item>
			<el-form-item label="申报税务类型" prop="taxdeclarationtype">
				<!-- <el-form-item label="申报税务类型" prop="taxdeclarationtype" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfo.taxdeclarationtype" placeholder="请选择申报税务类型">

					<el-option v-for='item in taxTypeList' :label="item.dicName" :value="item.dicId"></el-option>
				</el-select>
			</el-form-item>
			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">经营信息</p>
			</div>
			<el-form-item label="法人代表" prop="legalperson">
				<!-- <el-form-item label="法人代表" prop="legalperson" :rules="[$rules.requiredInput]"> -->
				<el-input v-model="customerNatureInfo.legalperson" placeholder="请输入法人代表姓名"></el-input>
			</el-form-item>
			<el-form-item label="法人身份证" prop="certificateno">
				<!-- <el-form-item label="法人身份证" prop="certificateno" :rules="[$rules.requiredInput]"> -->
				<el-input v-model="customerNatureInfo.certificateno" placeholder="请输入法人身份证"></el-input>
			</el-form-item>
			<el-form-item label="注册资金(万元)" prop="registermoney">
				<!-- <el-form-item label="注册资金(万元)" prop="registermoney" :rules="[$rules.requiredInput]"> -->
				<el-input v-model="customerNatureInfo.registermoney" placeholder="请输入公司注册资金"></el-input>
			</el-form-item>
			<el-form-item label="实收资本(万元)" prop="realcapital">
				<!-- <el-form-item label="实收资本(万元)" prop="realcapital" :rules="[$rules.requiredInput]"> -->
				<el-input v-model="customerNatureInfo.realcapital" placeholder="请输入公司实收资本"></el-input>
			</el-form-item>
			<el-form-item label="行业" prop="industry">
				<!-- <el-form-item label="行业" prop="industry" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfo.industry" placeholder="请选择">
					<el-option label="建筑工程业" value="1"></el-option>
					<el-option label="租赁和商务服务业" value="2"></el-option>
					<el-option label="交通运输、仓储和邮政业" value="3"></el-option>
					<el-option label="信息传输、软件和信息技术服务业" value="4"></el-option>
					<el-option label="批发和零售业" value="5"></el-option>
					<el-option label="居民服务、修理和其他服务业" value="6"></el-option>
				</el-select>

			</el-form-item>
			<el-form-item label="公司成立日期" prop="bounddate">
				<!-- <el-form-item label="公司成立日期" prop="bounddate" :rules="[$rules.requiredSelect]"> -->
				<el-date-picker v-model="customerNatureInfo.bounddate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
				 placeholder="请选择公司成立日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="组织结构代码证代码" prop="orgstrucodeno" class="longLabel">
				<!-- <el-form-item label="组织结构代码证代码" prop="orgstrucodeno" class="longLabel" :rules="[$rules.requiredInput]"> -->
				<el-input v-model="customerNatureInfo.orgstrucodeno" placeholder="请输入组织结构代码证代码"></el-input>
			</el-form-item>
			<el-form-item label="营业执照注册号" prop="businesslicenseno">
				<!-- <el-form-item label="营业执照注册号" prop="businesslicenseno" :rules="[$rules.requiredInput]"> -->
				<el-input v-model="customerNatureInfo.businesslicenseno" placeholder="请输入营业执照注册号"></el-input>
			</el-form-item>
			<el-form-item label="营业执照是否有有效期" prop="isLicenseHaveTime" class="longLabel">
				<el-select v-model="customerNatureInfo.islicensehavetime" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="营业执照截止日期" prop="licenseenddate" class="longLabel">
				<!-- <el-form-item label="营业执照截止日期" prop="licenseenddate" class="longLabel" :rules="[$rules.requiredSelect]"> -->
				<el-date-picker v-model="customerNatureInfo.licenseenddate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
				 placeholder="请选择营业执照截止日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="是否挂牌上市" prop="islist">
				<!-- <el-form-item label="是否挂牌上市" prop="islist" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfo.islist" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="公司注册地址" prop="registerlocation">
				<!-- <el-form-item label="公司注册地址" prop="registerlocation" :rules="[$rules.requiredInput]"> -->
				<el-input v-model="customerNatureInfo.registerlocation" placeholder="请输入公司注册地址"></el-input>
			</el-form-item>
			<br>
			<el-form-item label="是否有许可经营范围" prop="isscopebusiness" class="longLabel">
				<!-- <el-form-item label="是否有许可经营范围" prop="isscopebusiness" class="longLabel" :rules="[$rules.requiredSelect]"> -->
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
			<el-form-item label="是否代拿银行单据" prop="isreplacetakedoc" class="longLabel">
				<!-- <el-form-item label="是否代拿银行单据" prop="isreplacetakedoc" class="longLabel" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfo.isreplacetakedoc" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="签约日期" prop="signingdate">
				<!-- <el-form-item label="签约日期" prop="signingdate" :rules="[$rules.requiredSelect]"> -->
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
			<el-form-item label="是否零申报" prop="iszerotax">
				<!-- <el-form-item label="是否零申报" prop="iszerotax" :rules="[$rules.requiredSelect]"> -->
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
			<el-form-item label="是否取票" prop="istaketicket">
				<!-- <el-form-item label="是否取票" prop="istaketicket" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfo.istaketicket" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否需要账务初始化" prop="isaccountinitialization" class="longLabel">
				<!-- <el-form-item label="是否需要账务初始化" prop="isaccountinitialization" class="longLabel" :rules="[$rules.requiredSelect]"> -->
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
			<el-form-item label="企业注册日期" prop="registerdate">
				<!-- <el-form-item label="企业注册日期" prop="registerdate" :rules="[$rules.requiredSelect]"> -->
				<el-date-picker v-model="customerNatureInfo.registerdate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
				 placeholder="请选择企业注册日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="税务登记办证日期" prop="taxregisterdate" class='longLabel'>
				<!-- <el-form-item label="税务登记办证日期" prop="taxregisterdate" class='longLabel' :rules="[$rules.requiredSelect]"> -->
				<el-date-picker v-model="customerNatureInfo.taxregisterdate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
				 placeholder="请选择税务登记办证日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="服务状态" prop="servstate">
				<!-- <el-form-item label="服务状态" prop="servstate" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfo.servstate" placeholder="请选择服务状态">
					<el-option v-for="item in statusList" :label="item.dicName" :value="item.dicId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否有工商处罚" prop="isbusinesspunish">
				<!-- <el-form-item label="是否有工商处罚" prop="isbusinesspunish" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfo.isbusinesspunish" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否有经纪人" prop="isbroker">
				<!-- <el-form-item label="是否有经纪人" prop="isbroker" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfo.isbroker" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否是新户" prop="isnewcustomer">
				<!-- <el-form-item label="是否是新户" prop="isnewcustomer" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfo.isnewcustomer" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否是园区" prop="ispark">
				<!-- <el-form-item label="是否是园区" prop="ispark" :rules="[$rules.requiredSelect]"> -->
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
			<el-form-item label="采买方" prop="buyerid">
				<!-- <el-form-item label="采买方" prop="buyerid" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfo.buyerid" placeholder="请选择采买方">
					<el-option v-for="item in buyerList" :label="item.buyername" :value="item.buyerid"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态" prop="state">
				<el-select v-model="customerNatureInfo.state" placeholder="请选择状态">
					<el-option v-for="item in statusOption" :label="item.label" :value="item.value"></el-option>

				</el-select>
			</el-form-item>
			<el-form-item label="是否存在相关客户在其他财务公司代账" prop="isOthersProxy" class="longLabel">
				<el-select v-model="customerNatureInfo.isothersproxy" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
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
				<el-form-item label="注册地址" prop="managerAccountant">
					<el-tag v-for="tag in customerAddress[0]" closable :disable-transitions="false" @close="handleClose(tag)">
						{{tag}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="mini"
					 @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput" v-if='customerAddress[0].length < 1'>新增地址</el-button>

				</el-form-item>
			</div>
			<div>
				<el-form-item label="实际经营地址" prop="hostAccountant">
					<el-tag v-for="tag in customerAddress[1]" closable :disable-transitions="false" @close="handleClose1(tag)">
						{{tag}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible1" v-model="inputValue1" ref="saveTagInput1" size="mini"
					 @keyup.enter.native="handleInputConfirm1" @blur="handleInputConfirm1">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput1" v-if='customerAddress[1].length < 1'>新增地址</el-button>

				</el-form-item>

			</div>
			<div>
				<el-form-item label="取票地址" prop="auditAccountant">
					<el-tag v-for="tag in customerAddress[2]" closable :disable-transitions="false" @close="handleClose2(tag)">
						{{tag}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible2" v-model="inputValue2" ref="saveTagInput2" size="mini"
					 @keyup.enter.native="handleInputConfirm2" @blur="handleInputConfirm2">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput2">新增地址</el-button>
				</el-form-item>

			</div>
			<div>
				<el-form-item label="联系地址" prop="auditAccountant">
					<el-tag v-for="tag in customerAddress[3]" closable :disable-transitions="false" @close="handleClose3(tag)">
						{{tag}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible3" v-model="inputValue3" ref="saveTagInput3" size="mini"
					 @keyup.enter.native="handleInputConfirm3" @blur="handleInputConfirm3">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput3">新增地址</el-button>
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
				<el-select v-model="contact.position" placeholder="请选择状态" value-key="dicId">
					<el-option v-for="item in contactPositionList" :label="item.dicName" :value="item"></el-option>
				</el-select>

			</el-form-item>
			<el-form-item label="级别" prop="hostAccountant">
				<el-select v-model="contact.level" placeholder="请选择状态" value-key="dicId">
					<el-option v-for="item in contactLevelList" :label="item.dicName" :value="item"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="类型" prop="hostAccountant">
				<el-select v-model="contact.type" placeholder="请选择状态" value-key="dicId">
					<el-option v-for="item in contactTypeList" :label="item.dicName" :value="item"></el-option>
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
			<el-table :data="contactPersonInfo" style="width: 100%">
				<el-table-column align="center" label="姓名" prop="contactname" :resizable="false"></el-table-column>
				<el-table-column align="center" label="职务" prop="positionName" :resizable="false">

				</el-table-column>
				<el-table-column align="center" label="级别" prop="levelName" :resizable="false">

				</el-table-column>
				</el-table-column>
				<el-table-column align="center" label="类型" prop="typeName" :resizable="false">

				</el-table-column>
				</el-table-column>
				<el-table-column align="center" label="微信" prop="wechat" :resizable="false"></el-table-column>
				<el-table-column align="center" label="单位" prop="unit" :resizable="false"></el-table-column>
				<el-table-column align="center" label="电话" prop="phone" :resizable="false"></el-table-column>
				<el-table-column align="center" label="地址" prop="address" :resizable="false"></el-table-column>
				<el-table-column align="center" label="邮箱" prop="email" :resizable="false"></el-table-column>
				<el-table-column align="center" label="传真" prop="fax" :resizable="false"></el-table-column>

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
	<el-tab-pane label="涉税信息" name="second" :disabled='canAdd'>
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
			<el-table :data="customerBanks" style="width: 100%" :span-method="objectSpanMethod">
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
			<div>
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
			<div>
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

		</el-form>

	</el-tab-pane>

</el-tabs>
