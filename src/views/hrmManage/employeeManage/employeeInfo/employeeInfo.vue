<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>员工信息</div>
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
					<el-form-item label="入职日期:" id='range'>
						<el-date-picker value-format='yyyy-MM-dd' v-model="formInline.value" type="daterange" range-separator="至"
						 start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="姓名:">
						<el-input v-model='formInline.userName' clearable></el-input>
					</el-form-item>
					<el-form-item label="部门:">
						<el-select v-model='formInline.orgId' clearable>
							<el-option v-for='item in departList' :label="item.orgName" :value="item.orgId" :key='item.orgId'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click='search' size="mini" style="margin-right: 10px;">查询</el-button>
						<el-button @click='exportExcel' size="mini">导出</el-button>
					</el-form-item>
					<!-- <el-form-item>
					</el-form-item> -->
				</el-form>
			</div>
			<div class="contain_body">
				<el-table :data="detail" style="width: 100%" stripe border v-loading='loading'>
					<!-- <el-table-column type="selection" width="50"></el-table-column> -->

					<el-table-column align="center" label="姓名" prop="userName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="工号" prop="userCode" :resizable="false"></el-table-column>
					<el-table-column align="center" label="部门名称" prop="orgName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="联系方式" prop="mobileNo" :resizable="false"></el-table-column>
					<el-table-column align="center" label="入职登记时间" prop="entryDate" width="120" :resizable="false">
						<template slot-scope="scope">
							<span>{{formatTimeToStr(new Date(scope.row.entryDate),'yyyy-MM-dd')}}</span>

						</template>
					</el-table-column>
					<el-table-column align="center" label="入职协议" :resizable="false">
						<template slot-scope="scope">
							<span>{{scope.row.entryUrl?1:0}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="岗前协议" :resizable="false">
						<template slot-scope="scope">
							<span>{{scope.row.preJobUrl?1:0}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="合同协议" :resizable="false">
						<template slot-scope="scope">
							<span>{{scope.row.contractUrl?1:0}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="保密协议" :resizable="false">
						<template slot-scope="scope">
							<span>{{scope.row.secrecyUrl?1:0}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="备注" prop="remark" :resizable="false" width="200"></el-table-column>
					<!-- <el-table-column align="center" label="操作人" prop="creator" :resizable="false"></el-table-column>
					<el-table-column align="center" label="操作时间" prop="createTime" width="120" :resizable="false"> -->
					<!-- <template slot-scope="scope">
							<span>{{formatTimeToStr(new Date(scope.row.createTime),'yyyy-MM-dd')}}</span>
							
						</template>
					</el-table-column> -->
					<el-table-column align="center" width="200" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">修改信息</el-button>
							<el-button size="mini" type="text" @click="handleChange(scope.$index, scope.row)">调岗升职</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '4')})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>
		</div>
		<el-dialog :title="tag == 0?'编辑':'编辑'" :visible.sync="dialogVisible" width="1020px" :before-close="hideAddDialog">
			<el-form :inline="true" ref="ruleForm2" :model="customerTaxInfo" class="demo-form-inline" label-width="120px" size="small">
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">员工信息</p>
				</div>
				<el-form-item label="姓名" prop="userName" :rules="[$rules.requiredInput]">
					<el-input v-model="customerTaxInfo.userName" placeholder="请输入姓名"></el-input>
				</el-form-item>
				<el-form-item label="英文名" prop="enName" :rules="[$rules.requiredInput]">
					<el-input v-model="customerTaxInfo.enName" placeholder="请输入英文名"></el-input>
				</el-form-item>
				<el-form-item label="公司" prop="companyId" :rules="[$rules.requiredSelect]">
					<el-select v-model="customerTaxInfo.companyId" placeholder="请选择公司">
						<el-option v-for="item in companyList" :label="item.orgName" :value="item.orgId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="部门" prop="localtaxcode">
					<el-select v-model="customerTaxInfo.orgId" placeholder="请选择公司" @change="filter">
						<el-option v-for="item in departList" :label="item.orgName" :value="item.orgId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="职位" prop="positionId">
					<el-select v-model="customerTaxInfo.positionId" placeholder="请选择职位">
						<el-option v-for="item in positionList" :label="item.posnName" :value="item.posnId"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="入职日期" prop="entryDate" :rules="[$rules.requiredSelect]">
					<el-date-picker v-model="customerTaxInfo.entryDate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择入职日期"></el-date-picker>

				</el-form-item>
				<el-form-item label="开户银行" prop="bankInfo" :rules="[$rules.requiredInput]">
					<!-- <el-input v-model="customerTaxInfo.bankInfo" placeholder="请输入开户银行"></el-input> -->
					<el-select v-model="customerTaxInfo.bankInfo" placeholder="请选择开户银行" filterable>
						<el-option v-for="item in bankList" :label="item.dicName" :value="item.dicName"></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="银行卡号" prop="bankCardNo">
					<el-input v-model="customerTaxInfo.bankCardNo" placeholder="请输入银行卡号"></el-input>
				</el-form-item>
				<el-form-item label="在职状态" prop="isOnWork" :rules="[$rules.requiredSelect]">
					<el-select v-model="customerTaxInfo.isOnWork" placeholder="请选择在职状态">
						<el-option v-for="item in isOnWorkList" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="离职日期" prop="leaveDate">
					<el-date-picker v-model="customerTaxInfo.leaveDate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择入职日期"></el-date-picker>

				</el-form-item>
				<el-form-item label="是否在职" prop="userStatus" :rules="[$rules.requiredSelect]">
					<el-select v-model="customerTaxInfo.userStatus" placeholder="请选择">
						<el-option v-for="item in trueOrFalse" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">基本资料</p>
				</div>
				<el-form-item label="性别" prop="sex" :rules="[$rules.requiredSelect]">
					<el-select v-model="customerTaxInfo.sex" placeholder="请选择">
						<el-option label="男" value="1"></el-option>
						<el-option label="女" value="0"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="籍贯" prop="nativePlace">
					<el-input v-model="customerTaxInfo.nativePlace" placeholder="请输入籍贯"></el-input>
				</el-form-item>
				<el-form-item label="出生日期" prop="birthday">
					<el-date-picker v-model="customerTaxInfo.birthday" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择出生日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="婚姻状况" prop="civilState">
					<el-select v-model="customerTaxInfo.civilState" placeholder="请选择">
						<el-option label="已婚" value="1"></el-option>
						<el-option label="未婚" value="0"></el-option>
						<el-option label="离异" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="身份证号" prop="idCardNo" :rules="[$rules.requiredSelect]">
					<el-input v-model="customerTaxInfo.idCardNo" placeholder="请输入身份证号"></el-input>
				</el-form-item>

				<el-form-item label="星座" prop="constellation">
					<el-select v-model="customerTaxInfo.constellation" placeholder="请选择">
						<el-option v-for="item in constellationList" :label="item.label" :value="item.value"></el-option>

					</el-select>
				</el-form-item>
				<el-form-item label="户籍地址" prop="registerAddress">
					<el-input v-model="customerTaxInfo.registerAddress" placeholder="请输入籍贯"></el-input>
				</el-form-item>


				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">联系方式</p>
				</div>
				<el-form-item label="手机号码" prop="mobileNo" :rules="[$rules.requiredSelect]">
					<el-input v-model="customerTaxInfo.mobileNo" placeholder="请输入手机号码"></el-input>
				</el-form-item>
				<el-form-item label="电子邮箱" prop="email" :rules="[$rules.requiredSelect]">
					<el-input v-model="customerTaxInfo.email" placeholder="请输入电子邮箱"></el-input>
				</el-form-item>
				<el-form-item label="分机号" prop="extensionNo">
					<el-input v-model="customerTaxInfo.extensionNo" placeholder="请输入分机号"></el-input>
				</el-form-item>
				<el-form-item label="居住地址" prop="address">
					<el-input v-model="customerTaxInfo.address" placeholder="请输入居住地址"></el-input>
				</el-form-item>
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">教育信息</p>
				</div>
				<!-- <el-form-item label="学历" prop="education">
					<el-input v-model="customerTaxInfo.education" placeholder="请输入学历"></el-input>
				</el-form-item> -->
				
				<el-form-item label="本科专业" prop="specialty">
					<el-input v-model="customerTaxInfo.specialty" placeholder="请输入专业"></el-input>
				</el-form-item>
				<el-form-item label="本科毕业日期" prop="graduateDate">
					<el-date-picker v-model="customerTaxInfo.graduateDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
					 placeholder="请选择毕业日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="本科学校" prop="college">
					<el-input v-model="customerTaxInfo.college" placeholder="请输入毕业学校"></el-input>
				</el-form-item>
				
				<el-form-item label="硕士专业" prop="masterSpecialty">
					<el-input v-model="customerTaxInfo.masterSpecialty" placeholder="请输入专业"></el-input>
				</el-form-item>
				<el-form-item label="硕士毕业日期" prop="masterGraduateDate">
					<el-date-picker v-model="customerTaxInfo.masterGraduateDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
					 placeholder="请选择毕业日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="硕士学校" prop="masterCollege">
					<el-input v-model="customerTaxInfo.masterCollege" placeholder="请输入毕业学校"></el-input>
				</el-form-item>
				
				<el-form-item label="博士专业" prop="phdSpecialty">
					<el-input v-model="customerTaxInfo.phdSpecialty" placeholder="请输入专业"></el-input>
				</el-form-item>
				<el-form-item label="博士毕业日期" prop="phdGraduateDate">
					<el-date-picker v-model="customerTaxInfo.phdGraduateDate" type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
					 placeholder="请选择毕业日期"></el-date-picker>
				</el-form-item>
				<el-form-item label="博士学校" prop="phdCollege">
					<el-input v-model="customerTaxInfo.phdCollege" placeholder="请输入毕业学校"></el-input>
				</el-form-item>

				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">参保信息</p>
				</div>
				<el-form-item label="参保状态" prop="insuredStatus">
					<el-select v-model="customerTaxInfo.insuredStatus" placeholder="请选择">
						<el-option v-for="item in insuredStatusList" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="社保卡号" prop="insureNo">
					<el-input v-model="customerTaxInfo.insureNo" placeholder="请输入社保卡号"></el-input>

				</el-form-item>
				<el-form-item label="社保金额" prop="insureAmount">
					<el-input v-model="customerTaxInfo.insureAmount" placeholder="请输入社保金额"></el-input>
				
				</el-form-item>
				<el-form-item label="公积金金额" prop="fundAmount">
					<el-input v-model="customerTaxInfo.fundAmount" placeholder="请输入公积金金额"></el-input>
				
				</el-form-item>
				<el-form-item label="预估参保时间" prop="estimateStartTime">
					<el-date-picker v-model="customerTaxInfo.estimateStartTime" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择参保时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="实际参保时间" prop="actualStartTime">
					<el-date-picker v-model="customerTaxInfo.actualStartTime" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择实际参保时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="预估停保时间" prop="estimateStopTime">
					<el-date-picker v-model="customerTaxInfo.estimateStopTime" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择预估停保时间"></el-date-picker>

				</el-form-item>
				<el-form-item label="实际停保时间" prop="actualStopTime">
					<el-date-picker v-model="customerTaxInfo.actualStopTime" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择实际停保时间"></el-date-picker>

				</el-form-item>

				<el-form-item label="缴纳公积金状态" prop="fundsStatus">
					<el-select v-model="customerTaxInfo.fundsStatus" placeholder="请选择">
						<el-option v-for="item in fundsStatusList" :label="item.label" :value="item.value"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="开始缴纳时间" prop="fundsStartTime">
					<el-date-picker v-model="customerTaxInfo.fundsStartTime" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择开始缴纳时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="停止缴纳时间" prop="fundsStopTime">
					<el-date-picker v-model="customerTaxInfo.fundsStopTime" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择停止缴纳时间"></el-date-picker>

				</el-form-item>
				<el-form-item label="公积金卡号" prop="fundsNo">
					<el-input v-model="customerTaxInfo.fundsNo" placeholder="请输入公积金卡号"></el-input>

				</el-form-item>

				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">紧急联系信息</p>
				</div>
				<el-form-item label="紧急联系人" prop="urgentContactor">
					<el-input v-model="customerTaxInfo.urgentContactor" placeholder="请输入紧急联系人"></el-input>

				</el-form-item>

				<el-form-item label="和本人关系" prop="urgentRelation">
					<el-input v-model="customerTaxInfo.urgentRelation" placeholder="请输入和本人关系"></el-input>

				</el-form-item>
				<el-form-item label="联系电话" prop="urgentPhone">
					<el-input v-model="customerTaxInfo.urgentPhone" placeholder="请输入联系电话"></el-input>

				</el-form-item>
				<el-form-item label="联系地址" prop="urgentAddress">
					<el-input v-model="customerTaxInfo.urgentAddress" placeholder="请输入联系地址"></el-input>

				</el-form-item>
				<div class="tabtitle">
					<p class="lineicon"></p>
					<p class="linetext">其他</p>
				</div>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="customerTaxInfo.remark" placeholder="请输入备注"></el-input>
				</el-form-item>

			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click='addInduction'>完成</span>
				<span class='close' @click="hideAddDialog">关闭</span>
			</div>
		</el-dialog>


		<el-dialog title="协议登记" :visible.sync="dialogTableVisible" width="600px" :before-close="hideDialog">
			<el-form :inline="true" ref="ruleForm3" :model="protocol" class="demo-form-inline" label-width="120px" size="small">

				<div>
					<el-form-item label="所属部门" prop="orgName">
						<el-input v-model="protocol.orgName" disabled></el-input>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="员工名称" prop="userName">
						<el-input v-model="protocol.userName" disabled></el-input>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="是否交接完成" prop="entryStatus">
						<!-- <el-tooltip :content="protocol.value5" placement="top"> -->
						<el-switch v-model="entryStatus" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0">
						</el-switch>
						<!-- </el-tooltip> -->
					</el-form-item>
				</div>
				<div>
					<el-form-item label="入职协议" prop="remark" id='file1'>
						<el-upload :disabled='canUpload' class="upload-demo" ref="upload1" action="/perTaxToolTwo/hrEmpEntryInfo/headImgUpload"
						 :on-change="setupload1" :before-remove="beforeRemove" :file-list="fileList1" :limit="1" :auto-upload="false"
						 :data='uploadData1' :on-success='handelSuccess'>
							<el-button slot="trigger" size="mini" type="primary" :disabled='canUpload'>选取文件</el-button>
						</el-upload>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="岗前协议" prop="remark" id='file2'>
						<el-upload :disabled='canUpload' class="upload-demo" ref="upload2" action="/perTaxToolTwo/hrEmpEntryInfo/headImgUpload"
						 :on-change="setupload2" :before-remove="beforeRemove" :file-list="fileList2" :limit="1" :auto-upload="false"
						 :data='uploadData2' :on-success='handelSuccess'>
							<el-button slot="trigger" size="small" type="primary" :disabled='canUpload'>选取文件</el-button>
						</el-upload>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="合同协议" prop="remark" id='file3'>
						<el-upload :disabled='canUpload' class="upload-demo" ref="upload3" action="/perTaxToolTwo/hrEmpEntryInfo/headImgUpload"
						 :on-change="setupload3" :before-remove="beforeRemove" :file-list="fileList3" :limit="1" :auto-upload="false"
						 :data='uploadData3' :on-success='handelSuccess'>
							<el-button slot="trigger" size="small" type="primary" :disabled='canUpload'>选取文件</el-button>
						</el-upload>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="保密协议" prop="remark" id='file4'>
						<el-upload :disabled='canUpload' class="upload-demo" ref="upload4" action="/perTaxToolTwo/hrEmpEntryInfo/headImgUpload"
						 :on-change="setupload4" :before-remove="beforeRemove" :file-list="fileList4" :limit="1" :auto-upload="false"
						 :data='uploadData4' :on-success='handelSuccess'>
							<el-button slot="trigger" size="small" type="primary" :disabled='canUpload'>选取文件</el-button>
						</el-upload>
					</el-form-item>
				</div>

			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click='commit'>完成</span>
				<span class='close' @click="hideDialog">关闭</span>
			</div>
		</el-dialog>


		<el-dialog title="调岗升职" :visible.sync="dialogTableVisible1" width="600px" :before-close="hideDialog1">
			<el-form :inline="true" ref="ruleForm3" :model="trans" class="demo-form-inline" label-width="120px" size="small">
				<div>
					<el-form-item label="员工名称" prop="userName">
						<el-input v-model="trans.userName" disabled></el-input>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="所属部门" prop="orgName">
						<el-input v-model="trans.orgName" disabled></el-input>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="所属职位" prop="orgName">
						<el-input v-model="trans.orgName" disabled></el-input>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="调岗类型" prop="entryStatus">
						<el-select v-model="trans.transType" placeholder="请选择">
							<el-option v-for="item in transTypeList" :label="item.label" :value="item.value"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="调岗部门" prop="entryStatus">
						<el-select v-model="trans.orgId" placeholder="请选择"  @change="filter1">
							<el-option v-for="item in departList" :label="item.orgName" :value="item.orgId"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="调岗职位" prop="entryStatus">
						<el-select v-model="trans.posnId" placeholder="请选择">
							<el-option v-for="item in positionList" :label="item.posnName" :value="item.posnId"></el-option>
						</el-select>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="是否立即生效" prop="entryStatus">
						<!-- <el-tooltip :content="protocol.value5" placement="top"> -->
						<el-switch v-model="recordStatus" active-color="#13ce66" inactive-color="#ff4949" active-value="1" inactive-value="0">
						</el-switch>
						<!-- </el-tooltip> -->
					</el-form-item>
				</div>
				<div>
					<el-form-item label="生效时间" prop="remark" id='file4'>
						<el-date-picker v-model="trans.effectTime" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
						 placeholder="请选择生效时间" :disabled="recordStatus == 1"></el-date-picker>
					</el-form-item>
				</div>

			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click='commitChange'>完成</span>
				<span class='close' @click="hideDialog1">关闭</span>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				transTypeList:[
					{
						label:'转岗',
						value:1
					},
					{
						label:'晋升',
						value:2
					},
					{
						label:'降职',
						value:3
					},
				],
				customerTaxInfo: {
					checkGroupId: "-1"
				},
				loading: false,
				canUpload: false,
				uploadData1: {
					userId: "",
					entryStatus: "",
					entryUrl: 1
				},
				uploadData2: {
					userId: "",
					entryStatus: "",
					preJobUrl: 1
				},
				uploadData3: {
					userId: "",
					entryStatus: "",
					contractUrl: 1
				},
				uploadData4: {
					userId: "",
					entryStatus: "",
					secrecyUrl: 1
				},
				recordStatus:'',
				entryStatus: "0",
				message: "12334456",
				formInline: {
					userName: '',
					value: '',
					orgId: ''
				},
				tag: 0,
				protocol: {
					entryStatus: "0"
				},
				trans:{
					
				},
				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				detail: [{}],
				roleList: [],
				dialogTableVisible: false,
				dialogTableVisible1: false,
				dialogVisible: false,
				userId: '',
				value: '',
				fileList1: [],
				fileList2: [],
				fileList3: [],
				fileList4: [],
				trueOrFalse: [{
						label: "否",
						value: 0
					},
					{
						label: "是",
						value: 1
					}
				],
				isOnWorkList: [{
						label: "正常在岗",
						value: 1
					},
					{
						label: "试用期",
						value: 2
					},
					{
						label: "实习生",
						value: 3
					},
					{
						label: "代缴社保",
						value: 4
					},
					{
						label: "停止代缴",
						value: 5
					},
				],
				fundsStatusList: [{
						label: "缴纳",
						value: 1
					},
					{
						label: "不缴纳",
						value: 0
					},
					{
						label: "待确认",
						value: 2
					},
					{
						label: "待停止",
						value: 3
					},
				],
				insuredStatusList: [{
						label: "待参保",
						value: 1
					},
					{
						label: "正常参保",
						value: 2
					},
					{
						label: "正常停保",
						value: 3
					},
					{
						label: "申请参保中",
						value: 4
					},
					{
						label: "申请停保中",
						value: 5
					},
					{
						label: "不参保",
						value: 6
					},
					{
						label: "待停保",
						value: 7
					},
				],
				constellationList: [{
						label: '水瓶座（1.20~2.18）',
						value: '水瓶座'
					},
					{
						label: '双鱼座（2.19~3.20）',
						value: '双鱼座'
					},
					{
						label: '白羊座（3.21~4.19）',
						value: '白羊座'
					},
					{
						label: '金牛座（4.20~5.20）',
						value: '金牛座'
					},
					{
						label: '双子座（5.21~6.21）',
						value: '双子座'
					},
					{
						label: '巨蟹座（6.22~7.22）',
						value: '巨蟹座'
					},
					{
						label: '狮子座（7.23~8.22）',
						value: '狮子座'
					},
					{
						label: '处女座（8.23~9.22）',
						value: '处女座'
					},
					{
						label: '天秤座（9.23~10.23）',
						value: '天秤座'
					},
					{
						label: '天蝎座（10.24~11.21）',
						value: '天蝎座'
					},
					{
						label: '射手座（11.22~12.21）',
						value: '射手座'
					},
					{
						label: '摩羯座（12.22~1.19）',
						value: '摩羯座'
					},
				],
				bankInfoList: [],
				companyList: [],
				departList: [],
				bankList: [],

				entryDateStart: '',
				entryDateEnd: '',
				userName: '',
				orgId: '',
				positionList: []
			}
		},
		components: {},
		methods: {
			getComany() {
				let params = {
					"orgType": 1
				}
				this.axios.post('/perTaxToolTwo/hr/org/findOrgList', params).then(res => {
				// this.axios.post('/sl/perTaxToolTwo/hr/org/findOrgList', params).then(res => {
					if (res.data.code == 200) {
						this.companyList = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取公司列表失败',
						type: 'error'
					});
				})
			},
			getDepart() {
				let params = {
					"orgType": 2
				}
				this.axios.post('/perTaxToolTwo/hr/org/findOrgList', params).then(res => {
				// this.axios.post('/sl/perTaxToolTwo/hr/org/findOrgList', params).then(res => {
					if (res.data.code == 200) {
						this.departList = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取公司列表失败',
						type: 'error'
					});
				})
			},
			getBank() {
				let params = {
					"dicName": "开户行信息"
					// "accountNo":''
				}
				this.axios.post('/perTaxToolTwo/e9z/configDictionary/findDictionayListByDicAndAccountNo', params).then(res => {
				// this.axios.post('/sl/perTaxToolTwo/e9z/configDictionary/findDictionayListByDicAndAccountNo', params).then(res => {
					if (res.data.code == 200) {
						this.bankList = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取公司列表失败',
						type: 'error'
					});
				})
			},
			queryList() {
				let params = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						"entryDateStart": this.entryDateStart,
						"entryDateEnd": this.entryDateEnd,
						"userName": this.userName,
						"orgId": this.orgId,
						"type": 1,
					}
				}
				this.axios.post('/perTaxToolTwo/hrEmpInfo/findHrEmpInfoPage', params).then(res => {
				// this.axios.post('/sl/perTaxToolTwo/hrEmpInfo/findHrEmpInfoPage', params).then(res => {
					this.loading = false;
					if (res.data.code == 200) {

						this.total = res.data.count;
						this.detail = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取角色列表失败',
						type: 'error'
					});
				})
			},
			add() {
				this.dialogVisible = true;
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			search() {
				// console.log(this.formInline.value)
				this.loading = true;
				this.entryDateStart = this.formInline.value ? this.formInline.value[0] : '';
				this.entryDateEnd = this.formInline.value ? this.formInline.value[1] : '';
				this.userName = this.formInline.userName;
				this.orgId = this.formInline.orgId;
				this.queryList()
			},
			exportExcel(){
				window.location.href = '/perTaxToolTwo/hrEmpInfo/exportEmployeeInfo';
			},
			handleEdit(index, row) {
				this.dialogVisible = true;
				this.customerTaxInfo = row;
				
				this.filter();
			},
			handleChange(index, row) {
				this.dialogTableVisible1 = true;
				this.trans = row;
			},

			handleUpload(index, row) {
				this.protocol = row;
				this.entryStatus = '0';
				console.log(this.protocol);
				this.dialogTableVisible = true;
			},
			setupload1() {
				this.uploadData1 = {
					userId: this.protocol.userId,
					entryStatus: this.entryStatus,
					entryUrl: 1
				};
			},
			setupload2() {
				this.uploadData2 = {
					userId: this.protocol.userId,
					entryStatus: this.entryStatus,
					preJobUrl: 1
				};
			},
			setupload3() {
				this.uploadData3 = {
					userId: this.protocol.userId,
					entryStatus: this.entryStatus,
					contractUrl: 1
				};
			},

			setupload4() {
				this.uploadData4 = {
					userId: this.protocol.userId,
					entryStatus: this.entryStatus,
					secrecyUrl: 1
				};
			},
			commit() {
				if (this.entryStatus == '0') {




					console.log(this.uploadData1);
					console.log(this.uploadData2);
					console.log(this.uploadData3);
					console.log(this.uploadData4);
					this.$refs.upload1.submit();
					this.$refs.upload2.submit();
					this.$refs.upload3.submit();
					this.$refs.upload4.submit();


				} else {
					let params = {
						userId: this.protocol.userId,
						entryStatus: this.entryStatus,
					}
					this.axios.post('/perTaxToolTwo/end/hrEmpEntryInfo/headImgUpload', params).then(res => {
					// this.axios.post('/sl/perTaxToolTwo/end/hrEmpEntryInfo/headImgUpload', params).then(res => {
						if (res.data.code == 200) {
							this.dialogTableVisible = false;
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
							message: '上传协议失败',
							type: 'error'
						});
					})
				}

			},
			
			commitChange(){
				this.trans.recordStatus = this.recordStatus;
				let params = this.trans;
				this.axios.post('/perTaxToolTwo/hrEmpTransferRecord/SaveHrEmpTransferRecord', params).then(res => {
				// this.axios.post('/sl/perTaxToolTwo/hrEmpTransferRecord/SaveHrEmpTransferRecord', params).then(res => {
					if (res.data.code == 200) {
						this.dialogTableVisible1 = false;
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
						message: '调岗升职失败',
						type: 'error'
					});
				})
			},
			hideDialog1() {
				this.dialogTableVisible1 = false;

			},
			hideDialog() {
				this.dialogTableVisible = false;
				this.fileList1 = [];
				this.fileList2 = [];
				this.fileList3 = [];
				this.fileList4 = [];
				this.canUpload = false;
				this.uploadData1 = {
					userId: "",
					entryStatus: "",
					entryUrl: 1
				};
				this.uploadData2 = {
					userId: "",
					entryStatus: "",
					preJobUrl: 1
				};
				this.uploadData3 = {
					userId: "",
					entryStatus: "",
					contractUrl: 1
				};
				this.uploadData4 = {
					userId: "",
					entryStatus: "",
					secrecyUrl: 1
				};
				this.entryStatus = "0";
			},
			hideAddDialog() {
				this.dialogVisible = false;
				this.customerTaxInfo = {
					checkGroupId: "-1"
				}
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryList()
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			handelSuccess() {
				this.dialogTableVisible = false;
				this.queryList();
			},
			filter(orgId) {
				var params = {
					orgId: this.customerTaxInfo.orgId
				};
				this.axios.post('/perTaxToolTwo/HrPositionInfo/selectHrPositionInfo', params).then(res => {
				// this.axios.post('/sl/perTaxToolTwo/HrPositionInfo/selectHrPositionInfo', params).then(res => {
					if (res.data.code == 200) {
						this.positionList = res.data.data;
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
						message: '获取职位失败',
						type: 'error'
					});
				})
			},
			filter1() {
				var params = {
					orgId: this.trans.orgId
				};
				this.axios.post('/perTaxToolTwo/HrPositionInfo/selectHrPositionInfo', params).then(res => {
				// this.axios.post('/sl/perTaxToolTwo/HrPositionInfo/selectHrPositionInfo', params).then(res => {
					if (res.data.code == 200) {
						this.positionList = res.data.data;
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
						message: '获取职位失败',
						type: 'error'
					});
				})
			},
			addInduction() {
				var params = this.customerTaxInfo;
				this.axios.post('/perTaxToolTwo/hrEmpInfo/saveOrUpdateEmpInfo', params).then(res => {
				// this.axios.post('/sl/perTaxToolTwo/hrEmpInfo/saveOrUpdateEmpInfo', params).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible = false;
						this.customerTaxInfo = {
							checkGroupId: "-1"
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
						message: '新增员工失败',
						type: 'error'
					});
				})
			}
		},
		watch: {
			"entryStatus": {
				handler(val, oldVal) {
					switch (val) {
						case "0":
							this.canUpload = false;
							break;
						case "1":
							this.canUpload = true;
							break;
					}
				},
				deep: true

			},

		},
		created() {
			this.getComany();
			this.getDepart();
			this.getBank();
			this.queryList();
		}
	}
</script>

<style scoped lang="less">
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
		background: url(../../../../assets/img/list-bg1.png) no-repeat;
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

		/deep/ .el-date-editor.el-input__inner {
			width: 210px;
		}

		/deep/ #range .el-form-item__content {
			width: 210px
		}
	}

	.contain_body {
		padding: 0.2rem 0.2rem;
		background: #fff;

	}

	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
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
		background-color: #ebf6fb;
	}

	/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
		background: #ebf6fb;
	}

	/deep/ .el-dialog {

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

		ul.el-upload-list {
			background: #fff;
			padding-left: 0.24rem;
			padding-right: 0.24rem;
			padding-top: 0rem;
			height: 0.24rem;
			overflow-y: auto;
			margin-top: 0rem;
			display: inline-block;
			vertical-align: middle;

			:first-child {
				margin-top: 0px
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

	/deep/ .el-form-item__content {
		width: 180px;
	}

	/deep/ #file1 .el-form-item__content,
	/deep/ #file2 .el-form-item__content,
	/deep/ #file3 .el-form-item__content,
	/deep/ #file4 .el-form-item__content {
		width: 400px;
	}

	/deep/ .el-date-editor.el-input {
		width: 190px;
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
</style>
