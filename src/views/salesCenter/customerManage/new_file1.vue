<el-tabs v-model="activeNameXG">
	<el-tab-pane label="自然信息" name="first">
		<el-form :inline="true" ref="ruleForm5" :model="customerNatureInfoXG" class="demo-form-inline" label-width="120px"
		 size="small">
			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">基本信息</p>
			</div>
			<!-- :rules="[$rules.requiredInput]"
						 :rules="[$rules.requiredSelect]" -->
			<el-form-item label="客户名称" prop="customername" :rules="[$rules.requiredInput]">
				<el-input v-model="customerNatureInfoXG.customername" placeholder="请输入客户名称"></el-input>
			</el-form-item>
			<el-form-item label="企业类型" prop="customertype">
				<!-- <el-form-item label="企业类型" prop="customertype" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfoXG.customertype" filterable placeholder="请选择企业类型">
					<el-option v-for='item in companyTypeList' :label="item.dicName" :value="item.dicId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="所在区域" prop="arealist">
				<!-- <el-form-item label="所在区域" prop="arealist" :rules="[$rules.requiredSelect]"> -->
				<el-cascader v-model="customerNatureInfoXG.arealist" :options="cascaderData" :props="optionAreaProps"
				 @active-item-change="handleItemChange"></el-cascader>
			</el-form-item>
			
			<el-form-item label="客户经理" prop="customermanagerid">
				<el-select v-model="customerNatureInfoXG.customermanagerid" placeholder="请选择客户经理">
					<el-option v-for="item in employList" :label="item.userName" :value="item.userId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="客户来源" prop="customerInfoSource">
				<el-select v-model="customerNatureInfoXG.customerinfosource" placeholder="请选择客户来源">
					<el-option v-for="item in customerInfoSourceList" :label="item.dicName" :value="item.dicId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="转介绍公司" prop="sourcename">
				<el-select v-model="customerNatureInfoXG.sourcename" placeholder="请选择转介绍公司">
					<el-option v-for="item in customerList" :label="item.customerName" :value="item.customerName"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="关联合同公司" prop="relateContractCustomer">
				<el-select v-model="customerNatureInfoXG.relatecontractcustomerid" placeholder="请选择关联合同公司">
					<el-option v-for="item in invoiceCompanyList" :label="item.companyName" :value="item.invoiceCompanyId"></el-option>
				</el-select>
			</el-form-item>
			
			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">税务信息</p>
			</div>
			<el-form-item label="合同税务类型" prop="contractType">
				<el-input v-model="customerNatureInfoXG.contracttype" placeholder="由客户签订的合同决定" readonly></el-input>
			</el-form-item>
			<el-form-item label="申报税务类型" prop="taxdeclarationtype">
				<!-- <el-form-item label="申报税务类型" prop="taxdeclarationtype" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfoXG.taxdeclarationtype" placeholder="请选择申报税务类型">
			
					<el-option v-for='item in taxTypeList' :label="item.dicName" :value="item.dicId"></el-option>
				</el-select>
			</el-form-item>
			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">经营信息</p>
			</div>
			<el-form-item label="法人代表" prop="legalperson">
				<!-- <el-form-item label="法人代表" prop="legalperson" :rules="[$rules.requiredInput]"> -->
				<el-input v-model="customerNatureInfoXG.legalperson" placeholder="请输入法人代表姓名"></el-input>
			</el-form-item>
			<el-form-item label="法人身份证" prop="certificateno">
				<!-- <el-form-item label="法人身份证" prop="certificateno" :rules="[$rules.requiredInput]"> -->
				<el-input v-model="customerNatureInfoXG.certificateno" placeholder="请输入法人身份证"></el-input>
			</el-form-item>
			<el-form-item label="注册资金(万元)" prop="registermoney">
				<!-- <el-form-item label="注册资金(万元)" prop="registermoney" :rules="[$rules.requiredInput]"> -->
				<el-input v-model="customerNatureInfoXG.registermoney" placeholder="请输入公司注册资金"></el-input>
			</el-form-item>
			<el-form-item label="实收资本(万元)" prop="realcapital">
				<!-- <el-form-item label="实收资本(万元)" prop="realcapital" :rules="[$rules.requiredInput]"> -->
				<el-input v-model="customerNatureInfoXG.realcapital" placeholder="请输入公司实收资本"></el-input>
			</el-form-item>
			<el-form-item label="行业" prop="industry">
				<!-- <el-form-item label="行业" prop="industry" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfoXG.industry" placeholder="请选择">
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
				<el-date-picker v-model="customerNatureInfoXG.bounddate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
				 placeholder="请选择公司成立日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="组织结构代码证代码" prop="orgstrucodeno" class="longLabel">
				<!-- <el-form-item label="组织结构代码证代码" prop="orgstrucodeno" class="longLabel" :rules="[$rules.requiredInput]"> -->
				<el-input v-model="customerNatureInfoXG.orgstrucodeno" placeholder="请输入组织结构代码证代码"></el-input>
			</el-form-item>
			<el-form-item label="营业执照注册号" prop="businesslicenseno">
				<!-- <el-form-item label="营业执照注册号" prop="businesslicenseno" :rules="[$rules.requiredInput]"> -->
				<el-input v-model="customerNatureInfoXG.businesslicenseno" placeholder="请输入营业执照注册号"></el-input>
			</el-form-item>
			<el-form-item label="营业执照是否有有效期" prop="isLicenseHaveTime" class="longLabel">
				<el-select v-model="customerNatureInfoXG.islicensehavetime" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="营业执照截止日期" prop="licenseenddate" class="longLabel">
				<!-- <el-form-item label="营业执照截止日期" prop="licenseenddate" class="longLabel" :rules="[$rules.requiredSelect]"> -->
				<el-date-picker v-model="customerNatureInfoXG.licenseenddate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
				 placeholder="请选择营业执照截止日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="是否挂牌上市" prop="islist">
				<!-- <el-form-item label="是否挂牌上市" prop="islist" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfoXG.islist" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="公司注册地址" prop="registerlocation">
				<!-- <el-form-item label="公司注册地址" prop="registerlocation" :rules="[$rules.requiredInput]"> -->
				<el-input v-model="customerNatureInfoXG.registerlocation" placeholder="请输入公司注册地址"></el-input>
			</el-form-item>
			<br>
			<el-form-item label="是否有许可经营范围" prop="isscopebusiness" class="longLabel">
				<!-- <el-form-item label="是否有许可经营范围" prop="isscopebusiness" class="longLabel" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfoXG.isscopebusiness" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="经营许可范围" prop="scopeBussProject" class="textareaWidth">
				<el-input type="textarea" :rows="2" placeholder="请输入经营许可范围" v-model="customerNatureInfoXG.scopebussproject"></el-input>
			</el-form-item><br>
			<el-form-item label="企业经营范围" prop="businessScope" class="textareaWidth">
				<el-input type="textarea" :rows="2" placeholder="请输入企业经营范围" v-model="customerNatureInfoXG.businessscope"></el-input>
			</el-form-item>
			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">合作信息</p>
			</div>
			<el-form-item label="是否使用我司地址" prop="isUseOurDeptLocation" class="longLabel">
				<el-select v-model="customerNatureInfoXG.isuseourdeptlocation" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否代拿银行单据" prop="isreplacetakedoc" class="longLabel">
				<!-- <el-form-item label="是否代拿银行单据" prop="isreplacetakedoc" class="longLabel" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfoXG.isreplacetakedoc" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="签约日期" prop="signingdate">
				<!-- <el-form-item label="签约日期" prop="signingdate" :rules="[$rules.requiredSelect]"> -->
				<el-date-picker v-model="customerNatureInfoXG.signingdate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
				 placeholder="请选择签约日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="是否认缴" prop="isSubscribe">
				<el-select v-model="customerNatureInfoXG.issubscribe" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="认缴年限" prop="subscribeYears">
				<el-input v-model="customerNatureInfoXG.subscribeyears" placeholder="请输入认缴年限"></el-input>
			</el-form-item>
			<el-form-item label="是否有关联公司" prop="isHaveRelateCustomer">
				<el-select v-model="customerNatureInfoXG.ishaverelatecustomer" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="是否合并所得税" prop="isMergeIncomeTax">
				<el-select v-model="customerNatureInfoXG.ismergeincometax	" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="合并所得税至" prop="mergeIncomeTax">
				<el-input v-model="customerNatureInfoXG.mergeincometax" placeholder="请输入合并所得税内容"></el-input>
			</el-form-item>
			<el-form-item label="是否零申报" prop="iszerotax">
				<!-- <el-form-item label="是否零申报" prop="iszerotax" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfoXG.iszerotax" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否购买发票" prop="isBuyTicket">
				<el-select v-model="customerNatureInfoXG.isbuyticket" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否购票资质认证" prop="isBuyInv" class="longLabel">
				<el-select v-model="customerNatureInfoXG.isbuyinv" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否为中高端客户" prop="isHighEndCustomer" class="longLabel">
				<el-select v-model="customerNatureInfoXG.ishighendcustomer" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否取票" prop="istaketicket">
				<!-- <el-form-item label="是否取票" prop="istaketicket" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfoXG.istaketicket" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否需要账务初始化" prop="isaccountinitialization" class="longLabel">
				<!-- <el-form-item label="是否需要账务初始化" prop="isaccountinitialization" class="longLabel" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfoXG.isaccountinitialization" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="备注" prop="remark" class="textareaWidth">
				<el-input type="textarea" :rows="2" placeholder="请输入备注" v-model="customerNatureInfoXG.remark"></el-input>
			</el-form-item>
			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">会计信息</p>
			</div>
			<el-form-item label="会计主管" prop="managerAccountant">
				<el-select v-model="customerNatureInfoXG.managerAccountantId" placeholder="请选择会计主管">
					<el-option v-for="item in employList" :label="item.userName" :value="item.userId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="主办会计" prop="hostAccountant">
				<el-select v-model="customerNatureInfoXG.hostAccountantId" placeholder="请选择主办会计">
					<el-option v-for="item in employList" :label="item.userName" :value="item.userId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="审核会计" prop="auditAccountant">
				<el-select v-model="customerNatureInfoXG.auditAccountantId" placeholder="请选择审核会计">
					<el-option v-for="item in employList" :label="item.userName" :value="item.userId"></el-option>
				</el-select>
			</el-form-item>


			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">其他</p>
			</div>
			<el-form-item label="企业注册日期" prop="registerdate">
				<!-- <el-form-item label="企业注册日期" prop="registerdate" :rules="[$rules.requiredSelect]"> -->
				<el-date-picker v-model="customerNatureInfoXG.registerdate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
				 placeholder="请选择企业注册日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="税务登记办证日期" prop="taxregisterdate" class='longLabel'>
				<!-- <el-form-item label="税务登记办证日期" prop="taxregisterdate" class='longLabel' :rules="[$rules.requiredSelect]"> -->
				<el-date-picker v-model="customerNatureInfoXG.taxregisterdate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
				 placeholder="请选择税务登记办证日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="服务状态" prop="servstate">
				<!-- <el-form-item label="服务状态" prop="servstate" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfoXG.servstate" placeholder="请选择服务状态">
					<el-option v-for="item in statusList" :label="item.dicName" :value="item.dicId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否有工商处罚" prop="isbusinesspunish">
				<!-- <el-form-item label="是否有工商处罚" prop="isbusinesspunish" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfoXG.isbusinesspunish" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否有经纪人" prop="isbroker">
				<!-- <el-form-item label="是否有经纪人" prop="isbroker" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfoXG.isbroker" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否是新户" prop="isnewcustomer">
				<!-- <el-form-item label="是否是新户" prop="isnewcustomer" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfoXG.isnewcustomer" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否是园区" prop="ispark">
				<!-- <el-form-item label="是否是园区" prop="ispark" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfoXG.ispark" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="园区" prop="parkId">
				<el-select v-model="customerNatureInfoXG.parkid" placeholder="请选择园区">
					<el-option v-for="item in parkList" :label="item.parkname" :value="item.parknameconfigid"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="主营内容" prop="mainMarketContent">
				<el-select v-model="customerNatureInfoXG.mainmarketcontent" placeholder="请选择主营内容">
					<el-option v-for="item in mainmarketList" :label="item.dicName" :value="item.dicId"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="企业特殊类型" prop="specialType">
				<el-select v-model="customerNatureInfoXG.specialtype" placeholder="请选择企业特殊类型">
					<el-option v-for="item in specialtypeList" :label="item.dicName" :value="item.dicId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="挂牌上市类型" prop="listType">
				<el-select v-model="customerNatureInfoXG.listtype" placeholder="请选择挂牌上市类型">
					<el-option v-for="item in listtypeList" :label="item.dicName" :value="item.dicId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="采买方" prop="buyerid">
				<!-- <el-form-item label="采买方" prop="buyerid" :rules="[$rules.requiredSelect]"> -->
				<el-select v-model="customerNatureInfoXG.buyerid" placeholder="请选择采买方">
					<el-option v-for="item in buyerList" :label="item.buyername" :value="item.buyerid"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="状态" prop="state">
				<el-select v-model="customerNatureInfoXG.state" placeholder="请选择状态">
					<el-option v-for="item in statusOption" :label="item.label" :value="item.value"></el-option>
					
				</el-select>
			</el-form-item>
			<el-form-item label="是否存在相关客户在其他财务公司代账" prop="isOthersProxy" class="longLabel">
				<el-select v-model="customerNatureInfoXG.isothersproxy" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="相关客户名称" prop="othersName">
				<el-input v-model="customerNatureInfoXG.othersname" placeholder="请输入相关客户名称"></el-input>
			</el-form-item>
			<el-form-item label="财务公司名称" prop="financeName">
				<el-input v-model="customerNatureInfoXG.financename" placeholder="请输入财务公司名称"></el-input>
			</el-form-item>
			<el-form-item label="帐套代码" prop="accountSetCode" class="textareaWidth">
				<el-input type="textarea" :rows="2" placeholder="请输入帐套代码" v-model="customerNatureInfoXG.accountsetcode"></el-input>
			</el-form-item>
			<el-form-item label="来源说明" prop="infoSourceExplain" class="textareaWidth">
				<el-input type="textarea" :rows="2" placeholder="请输入来源说明" v-model="customerNatureInfoXG.infosourceexplain"></el-input>
			</el-form-item>



			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">地址信息</p>
			</div>
			<div>


				<el-form-item label="注册地址" prop="managerAccountant">
					<el-tag v-for="tag in customerAddressXG[0]" closable :disable-transitions="false" @close="handleClose5(tag)">
						{{tag.content?tag.content:''}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible5" v-model="inputValue5" ref="saveTagInput5" size="mini"
					 @keyup.enter.native="handleInputConfirm5" @blur="handleInputConfirm5">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput5" v-if='customerAddressXG[0].length < 1'>新增地址</el-button>

				</el-form-item>
			</div>
			<div>


				<el-form-item label="实际经营地址" prop="hostAccountant">
					<el-tag v-for="tag in customerAddressXG[1]" closable :disable-transitions="false" @close="handleClose6(tag)">
						{{tag.content?tag.content:''}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible6" v-model="inputValue6" ref="saveTagInput6" size="mini"
					 @keyup.enter.native="handleInputConfirm6" @blur="handleInputConfirm6">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput6" v-if='customerAddressXG[1].length < 1'>新增地址</el-button>

				</el-form-item>
			</div>
			<div>


				<el-form-item label="取票地址" prop="auditAccountant">
					<el-tag v-for="tag in customerAddressXG[2]" closable :disable-transitions="false" @close="handleClose9(tag)">
						{{tag.content?tag.content:''}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible9" v-model="inputValue9" ref="saveTagInput9" size="mini"
					 @keyup.enter.native="handleInputConfirm9" @blur="handleInputConfirm9">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput9">新增地址</el-button>
				</el-form-item>
			</div>
			<div>


				<el-form-item label="联系地址" prop="auditAccountant">
					<el-tag v-for="tag in customerAddressXG[3]" closable :disable-transitions="false" @close="handleClose11(tag)">
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
				<el-input v-model="contactXG.name" placeholder="请输入姓名"></el-input>
			</el-form-item>
			<el-form-item label="职务" prop="position">
				<el-select v-model="contactXG.position" placeholder="请选择状态" value-key="dicId">
					<el-option v-for="item in contactPositionList" :label="item.dicName" :value="item"></el-option>
					<!-- <el-option label="无效" value="0"></el-option>
								<el-option label="有效" value="1"></el-option> -->
				</el-select>

			</el-form-item>
			<el-form-item label="级别" prop="hostAccountant">
				<el-select v-model="contactXG.level" placeholder="请选择状态" value-key="dicId">
					<el-option v-for="item in contactLevelList" :label="item.dicName" :value="item"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="类型" prop="hostAccountant">
				<el-select v-model="contactXG.type" placeholder="请选择状态" value-key="dicId">
					<el-option v-for="item in contactTypeList" :label="item.dicName" :value="item"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="微信" prop="hostAccountant">
				<el-input v-model="contactXG.weixin" placeholder="请输入微信"></el-input>
			</el-form-item>
			<el-form-item label="单位" prop="hostAccountant">
				<el-input v-model="contactXG.companyName" placeholder="请输入单位"></el-input>
			</el-form-item>
			<div>
				<el-form-item label="电话" prop="hostAccountant">
					<el-tag :key="tag" v-for="tag in contactXG.workphone" closable :disable-transitions="false" @close="handleClose14(tag)">
						{{tag}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible14" v-model="inputValue14" ref="saveTagInput14" size="mini"
					 @keyup.enter.native="handleInputConfirm14" @blur="handleInputConfirm14">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput14">新增电话</el-button>
				</el-form-item>
			</div>
			<div>
				<el-form-item label="传真" prop="hostAccountant">
					<el-tag :key="tag" v-for="tag in contactXG.chuanzhenphone" closable :disable-transitions="false" @close="handleClose17(tag)">
						{{tag}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible17" v-model="inputValue17" ref="saveTagInput17" size="mini"
					 @keyup.enter.native="handleInputConfirm17" @blur="handleInputConfirm17">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput17">新增电话</el-button>
				</el-form-item>
			</div>
			<div>
				<el-form-item label="地址" prop="hostAccountant">
					<el-tag :key="tag" v-for="tag in contactXG.workaddress" closable :disable-transitions="false" @close="handleClose18(tag)">
						{{tag}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible18" v-model="inputValue18" ref="saveTagInput18" size="mini"
					 @keyup.enter.native="handleInputConfirm18" @blur="handleInputConfirm18">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput18">新增地址</el-button>
				</el-form-item>
			</div>

			<div>
				<el-form-item label="邮箱" prop="hostAccountant">
					<el-tag :key="tag" v-for="tag in contactXG.workmail" closable :disable-transitions="false" @close="handleClose100(tag)">
						{{tag}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible100" v-model="inputValue100" ref="saveTagInput100" size="mini"
					 @keyup.enter.native="handleInputConfirm100" @blur="handleInputConfirm100">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput100">新增邮箱</el-button>
				</el-form-item>
			</div>


			<el-form-item prop="hostAccountant">
				<el-button type="primary" size="mini" @click='addContactPersonXG'>添加</el-button>
			</el-form-item>
			<el-table :data="contactPersonInfoXG" style="width: 100%">
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
				
				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="delContactPersonXG(scope.row,scope.$index)">删除</el-button>
					</template>
				</el-table-column>

			</el-table>

		</el-form>
	</el-tab-pane>
	<el-tab-pane label="涉税信息" name="second">
		<el-form :inline="true" ref="ruleForm4" :model="customerTaxInfoXG" class="demo-form-inline" label-width="120px" size="small">
			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">基本信息</p>
			</div>
			<el-form-item label="电子税务局纳税识别号" prop="taxcode" :rules="[$rules.requiredInput]" class="longLabel">
				<el-input v-model="customerTaxInfoXG.taxcode" placeholder="请输入纳税人识别号"></el-input>
			</el-form-item>
			<el-form-item label="从业人数" prop="engageNumber">
				<el-input v-model="customerTaxInfoXG.engagenumber" placeholder="请输入从业人数"></el-input>
			</el-form-item>
			<el-form-item label="所得税税率" prop="incometaxrate">
				<el-input v-model="customerTaxInfoXG.incometaxrate" placeholder="请输入所得税税率"></el-input>
			</el-form-item>
			<el-form-item label="地税管理码" prop="localtaxcode">
				<el-input v-model="customerTaxInfoXG.localtaxcode" placeholder="请输入所得税税率"></el-input>
			</el-form-item>
			<el-form-item label="办税服务厅纳税识别号" prop="newtaxpayerid" :rules="[$rules.requiredInput]" class="longLabel">
				<el-input v-model="customerTaxInfoXG.newtaxpayerid" placeholder="请输入办税服务厅纳税识别号"></el-input>
			</el-form-item>
			<el-form-item label="所得税征收方式" prop="collectionMethod">
				<el-select v-model="customerTaxInfoXG.collectionmethod" placeholder="请选择所得税征方式">
					<el-option v-for="item in collectionmethodList" :label="item.dicName" :value="item.dicId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="地税软密码" prop="newtaxpayerid">
				<el-input v-model="customerTaxInfoXG.localtaxpassword" placeholder="请输入地税软密码"></el-input>
			</el-form-item>

			<el-form-item label="增资信息" prop="adddatainfo">
				<el-input v-model="customerTaxInfoXG.adddatainfo" placeholder="请输入增资信息"></el-input>
			</el-form-item>
			<el-form-item label="核定征收率(%)" prop="checkRate">
				<el-input v-model="customerTaxInfoXG.checkrate" placeholder="请输入核定征收率"></el-input>
			</el-form-item>
			<el-form-item label="是否有代理认证服务" prop="isproxyauthentication" class="longLabel">
				<el-select v-model="customerTaxInfoXG.isproxyauthentication" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="主机共享地址" prop="hostShareUrl">
				<!-- <el-input v-model="customerTaxInfo.sharehostingaddressid" placeholder="请输入主机共享地址"></el-input> -->
				<el-select v-model="customerTaxInfoXG.sharehostingaddressid" placeholder="请选择">
					<el-option v-for="item in shareHostingAddressList" :label="item.transactaddress" :value="item.sharehostingaddressid"></el-option>
				</el-select>
			</el-form-item>
			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">涉税事项信息</p>
			</div>
			<el-form-item label="是否缴纳注册资金印花税" prop="isPaySignTax" class="longLabel">
				<el-select v-model="customerTaxInfoXG.ispaysigntax" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="是否进出口企业" prop="isImportExport">
				<el-select v-model="customerTaxInfoXG.isimportexport" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否简易征收" prop="isEasyTax">
				<el-select v-model="customerTaxInfoXG.iseasytax" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否增资" prop="isIncreaseCapital">
				<el-select v-model="customerTaxInfoXG.isincreasecapital" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否防伪税控" prop="isAntiTax">
				<el-select v-model="customerTaxInfoXG.isantitax" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="防伪税控类型" prop="antiTaxType">
				<el-select v-model="customerTaxInfoXG.antitaxtype" placeholder="请选择防伪税控类型">
					<el-option v-for="item in antitaxtypeList" :label="item.dicName" :value="item.dicId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="防伪税控所属区域" prop="transactregionid" class="longLabel">
				<el-select v-model="customerTaxInfoXG.transactregionid" placeholder="请选择防伪税控所属区域">
					<el-option v-for="item in antitaxtypeList" :label="item.dicName" :value="item.dicId"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="税务管理类型" prop="taxmanagertype" :rules="[$rules.requiredSelect]">
				<el-select v-model="customerTaxInfoXG.taxmanagertype" placeholder="请选择税务管理类型">
					<el-option v-for="item in taxmanagertypeList" :label="item.dicName" :value="item.dicId"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="辅导期开始时间" prop="coachDate">
				<el-date-picker v-model="customerTaxInfoXG.coachdatestart" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
				 placeholder="开始日期"></el-date-picker>
			</el-form-item>
			<el-form-item label="辅导期截止时间" prop="coachDate">
				<el-date-picker v-model="customerTaxInfoXG.coachdateend" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
				 placeholder="结束日期"></el-date-picker>
			</el-form-item>

			<el-form-item label="土地使用税缴纳时间1" prop="coachDate" class='longLabel'>
				<el-date-picker v-model="customerTaxInfoXG.paylandtime1" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
				 placeholder="请选择"></el-date-picker>
			</el-form-item>
			<el-form-item label="土地使用税缴纳时间2" prop="coachDate" class='longLabel'>
				<el-date-picker v-model="customerTaxInfoXG.paylandtime2" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
				 placeholder="请选择"></el-date-picker>
			</el-form-item>

			<el-form-item label="房产税缴纳时间1" prop="coachDate">
				<el-date-picker v-model="customerTaxInfoXG.payhousetime1" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
				 placeholder="请选择"></el-date-picker>
			</el-form-item>
			<el-form-item label="房产税缴纳时间2" prop="coachDate">
				<el-date-picker v-model="customerTaxInfoXG.payhousetime2" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
				 placeholder="请选择"></el-date-picker>
			</el-form-item>

			<el-form-item label="备注" prop="remark" class="textareaWidth">
				<el-input type="textarea" :rows="2" placeholder="请输入备注" v-model="customerTaxInfoXG.remark"></el-input>
			</el-form-item>
			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">社保信息</p>
			</div>
			<el-form-item label="是否申报社保" prop="isDeclareSocial">
				<el-select v-model="customerTaxInfoXG.isdeclaresocial" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="社保证号" prop="socialNo">
				<el-input v-model="customerTaxInfoXG.socialno" placeholder="请输入社保证号"></el-input>
			</el-form-item>
			<el-form-item label="社保证密码" prop="socialPwd">
				<el-input v-model="customerTaxInfoXG.socialpwd" placeholder="请输入密码"></el-input>
			</el-form-item>
			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">税务缴纳信息</p>
			</div>
			<el-form-item label="是否缴纳土地使用税" prop="isPayLandTax" class="longLabel">
				<el-select v-model="customerTaxInfoXG.ispaylandtax" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否缴纳房产税" prop="ispayhousetax">
				<el-select v-model="customerTaxInfoXG.ispayhousetax" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">保税周期</p>
			</div>
			<el-form-item label="国地税保税周期" prop="stateTaxCycle">
				<el-select v-model="customerTaxInfoXG.taxcycle" placeholder="请选择国地税保税周期">
					<el-option v-for="item in periodList" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>

			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">申报信息</p>
			</div>
			<el-form-item label="是否网上申报" prop="isonlinedeclare" :rules="[$rules.requiredSelect]">
				<el-select v-model="customerTaxInfoXG.isonlinedeclare" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="是否代开发票" prop="isproxyinvoice">
				<el-select v-model="customerTaxInfoXG.isproxyinvoice" placeholder="请选择">
					<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>

			<el-form-item label="网上申报密码" prop="taxpassword" :rules="[$rules.requiredInput]">
				<el-input v-model="customerTaxInfoXG.taxpassword" placeholder="请输入网上申报密码"></el-input>
			</el-form-item>
			<el-form-item label="应税面积" prop="taxarea">
				<el-input v-model="customerTaxInfoXG.taxarea" placeholder="请输入应税面积"></el-input>
			</el-form-item>
			<el-form-item label="单位税额" prop="unittax">
				<el-input v-model="customerTaxInfoXG.unittax" placeholder="请输入单位税额"></el-input>
			</el-form-item>
			<el-form-item label="房产原值" prop="houseoriginalval">
				<el-input v-model="customerTaxInfoXG.houseoriginalval" placeholder="请输入房产原值"></el-input>
			</el-form-item>
			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">银行信息</p>
			</div>
			<el-form-item label="银行类型" prop="type">
				<el-select v-model="bankInfoXG.type" placeholder="请选择">
					<el-option v-for="item in bankTypeList" :label="item.label" :value="item.type"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="银行名称" prop="bankname">
				<el-input v-model="bankInfoXG.bankname" placeholder="请输入银行名称" size="mini"></el-input>
			</el-form-item>
			<el-form-item label="银行账户" prop="bankaccount">
				<el-input v-model="bankInfoXG.bankaccount" placeholder="请输入银行账户" size="mini"></el-input>
			</el-form-item>
			<el-form-item label="银行电话" prop="telephone">
				<el-input v-model="bankInfoXG.telephone" placeholder="请输入银行电话" size="mini"></el-input>
			</el-form-item>
			<el-form-item label="银行地址" prop="address">
				<el-input v-model="bankInfoXG.address" placeholder="请输入银行地址" size="mini"></el-input>
			</el-form-item>
			<el-form-item label="" prop="address">
				<el-button type="primary" @click='addBankXG' size="mini">添加</el-button>
			</el-form-item>
			<el-table :data="customerBanksXG" style="width: 100%" :span-method="objectSpanMethod">
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
						<el-button size="mini" type="text" @click="delBankXG(scope.row,scope.$index)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>

			<div class="tabtitle">
				<p class="lineicon"></p>
				<p class="linetext">专管员信息</p>
			</div>
			<el-form-item label="姓名" prop="name">
				<el-input v-model="specialMemberXG.specialname" placeholder="请输入姓名"></el-input>
			</el-form-item>
			<el-form-item label="性别" prop="sex">
				<el-select v-model="specialMemberXG.sex" placeholder="请选择">
					<el-option label="男" value="1"></el-option>
					<el-option label="女" value="0"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="办公室地址" prop="address">
				<el-input v-model="specialMemberXG.address" placeholder="请输入办公室地址"></el-input>
			</el-form-item>
			<el-form-item label="办公室编号" prop="no">
				<el-input v-model="specialMemberXG.serialnumber" placeholder="请输入办公室编号"></el-input>
			</el-form-item>

			<div>
				<el-form-item label="电话" prop="houseoriginalval">
					<el-tag v-show='specialMemberXG.phone' :key="tag" v-for="tag in specialMemberXG.phone.split(',')" closable
					 :disable-transitions="false" @close="handleClose122(tag)">
						{{tag}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible122" v-model="inputValue122" ref="saveTagInput122" size="mini"
					 @keyup.enter.native="handleInputConfirm122" @blur="handleInputConfirm122">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput122">新增电话</el-button>
				</el-form-item>
			</div>
			<div>
				<el-form-item label="邮箱" prop="houseoriginalval">
					<el-tag v-show='specialMemberXG.email' :key="tag" v-for="tag in specialMemberXG.email.split(',')" closable
					 :disable-transitions="false" @close="handleClose133(tag)">
						{{tag}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible133" v-model="inputValue133" ref="saveTagInput133" size="mini"
					 @keyup.enter.native="handleInputConfirm133" @blur="handleInputConfirm133">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput133">新增邮箱</el-button>
				</el-form-item>
			</div>

		</el-form>





	</el-tab-pane>
	<el-tab-pane label="关联公司" name="third">
		<el-form :inline="true" ref="ruleForm6" :model="relateCompany" class="demo-form-inline" label-width="120px" size="small">
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
