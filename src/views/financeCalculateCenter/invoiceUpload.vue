<template>
	<div class="main_contain">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>会计工厂</el-breadcrumb-item>
			<el-breadcrumb-item>凭证管理</el-breadcrumb-item>
			<el-breadcrumb-item>发票上传</el-breadcrumb-item>
		</el-breadcrumb>
		<div>
			<div class="contain_header">
				<div class='title'><span v-show='userTypeId != 3' style="margin-right: 12px;">当前账期：{{currentPeriod}}</span>
					<span v-show='userTypeId != 3'>共计：<el-button type="text" size="mini" @click='search(0)'>{{allCount}}</el-button></span>
					<span v-show='userTypeId != 3' style="margin-left: 10px;">已提交：<el-button type="text" size="mini" @click='search(2)'>{{committedStatistics}}</el-button></span>
					<span v-show='userTypeId != 3' style="margin-left: 10px;">未提交：<el-button type="text" size="mini" @click='search(1)'>{{uncommittedStatistics}}</el-button></span></div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini">
					<el-form-item label="公司">
						<el-select v-model="uploadData.customerId" placeholder="请选择" clearable filterable @change='search1'>

							<el-option v-for="item in custList" :label="item.customerName" :value='item.customerId'></el-option>
							<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="账期" prop="accountPeriod">
						<el-date-picker v-model="uploadData.accountPeriod" type="month" placeholder="请选择" clearable value-format='yyyy-MM'
						 @change='search1'>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="状态" prop="type">
						<el-select v-model="uploadData.type" placeholder="请选择" filterable @change='search1'>
							<el-option v-for="item in stateList" :label="item.label" :value='item.value'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="仅有内部代交票" prop="remark4">
						<el-select v-model="uploadData.remark4" placeholder="请选择" filterable @change='search1'>
							<el-option label="请选择" value=''></el-option>
							<el-option label="已无其他票" value='已无其他票'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="确认状态" prop="remark6">
						<el-select v-model="uploadData.remark6" placeholder="请选择" filterable @change='search1'>
							<el-option label="全部" value=''></el-option>
							<el-option label="未确认" value='0'></el-option>
							<el-option label="app已确认" value='1'></el-option>
							<el-option label="app超时确认" value='2'></el-option>
							<el-option label="收账待处理" value='3'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="是否中高端" prop="isHighCustomer">
						<el-select v-model="uploadData.isHighCustomer" placeholder="请选择" filterable @change='search1'>
							<el-option label="全部" value=''></el-option>
							<el-option label="否" value='0'></el-option>
							<el-option label="是" value='1'></el-option>
						</el-select>
					</el-form-item>

					<div class="clearfix"> 
						<el-button @click='selectPic("formName")' size="small" round type='primary' style='font-size:14px;float:right'><i
							 class="el-icon-upload"></i>拍照上传</el-button>
						<el-button @click='jumpToQrcode("formName")' size="small" round type='primary' style='font-size:14px;float:right;margin-right: 12px;'><i
							 class="el-icon-upload"></i>扫码上传</el-button>
					</div>

				</el-form>
			</div>
			<div class="contain_body" v-loading='loading1'>
				<div class='chart_contain'>
					<div v-for='item in list' class='card'>
						<div class='mask1' v-show='item.state == 4 && item.remark1'>
							<div class='man'>{{'票据正在识别中，请稍后... 预计完成时间' + item.remark1}}</div>
							<div class='person' :style="'left: calc(50% - 270px' + ' + ' + item.remark3 + 'px);'"></div>
							<div class='bg'></div>
							<div class='bar' :style="'width:'+ item.remark3 +'px;transition:width 1s'"></div>
						</div>
						<div class='mask2' v-show='item.state == 5'>
							<div class='man'>等待识别中...</div>
							<div class='person' style="left: calc(50% - 270px)"></div>
							<div class='bg'></div>
							<!-- <div class='bar' :style="'width:'+ item.remark3 +'px;transition:width 1s'"></div> -->
						</div>
						<div class='card_first'>
							<div class="p_first">
								{{item.customerName}}<span v-if="item.isNssb  == 1">(纳税申报合同)</span>
								<span v-show="item.remark6 == 1">app确认状态：app已确认</span>
								<span v-show="item.remark6 == 2">app确认状态：app超时确认</span>
								<span v-show="item.isWait == 1">等待无账零申报</span>
								<span>时间：{{item.accountPeriod}}</span>
								<span>{{item.remark4}}</span>
							</div>
							<p>发票数：{{item.totalCount}}张</p>
							<p>提交人：{{item.createUser.length == 11 && !isNaN(item.createUser)?item.createUser.slice(0,3) + '****' + item.createUser.slice(7,11):item.createUser}}</p>
							<div class='text_contain'>
								<span class='text1' @click="voucherGather_print(item)">打印回执单</span>
								<span class='text1' @click="openCommit(item)" v-show='item.uncommitted != 0 || (item.remark3 == "0" && item.totalCount != 0)' :disabled="item.isWait == 1">提交审核</span>
								<span class='text1' @click="openDetail(item)">查看</span>
								<span class='text1' @click="openDel(item)" v-show="item.uncommitted != 0">删除</span>
							</div>


						</div>

						<div>
							<div class="charts1">

							</div>
							<div class="charts">

							</div>

						</div>



					</div>
				</div>
				<el-pagination background @current-change="((val)=>{handleCurrentChange(val)})" :current-page="currentPage"
				 :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>
		</div>


		<el-dialog title="上传" :visible.sync="dialogVisible" width="400px" class='dialog'>

			<el-form :inline="true" ref="ruleForm1" :model="detail" class="demo-form-inline" label-width="100px" size="mini">
				<el-form-item label="公司" prop="item" :rules="[$rules.requiredSelect]" class='uploadItem'>
					<!-- <el-autocomplete class="inline-input" v-model="uploadData.customerName" :fetch-suggestions="querySearch"
						 placeholder="请输入客户名称" @select="handleSelect"></el-autocomplete> -->
					<el-select v-model="detail.item" placeholder="请选择公司名称" filterable value-key='customerId' @change="getProofTVoucher">
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option> -->
						<el-option v-for="item in custList" :label="item.customerName" :value='item'></el-option>
					</el-select>
					<span style='position: absolute;left: 200px;top: 0px;color:red;width:80px'>共{{fileListTotal}}张</span>
				</el-form-item>
				<el-form-item label="时间" prop="accountPeriod">
					<el-date-picker v-model="detail.accountPeriod" type="month" value-format='yyyy-MM' format="yyyy-MM" :disabled='canChoose'
					 :picker-options="pickerOptions">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="申报周期" prop="declarationCycle">
					<el-input v-model="detail.declarationCycle" disabled></el-input>
				</el-form-item>
				<el-form-item label="发票审核人" prop="approveName">

					<el-input v-model="detail.approveName" disabled></el-input>
				</el-form-item>

				<el-form-item label="发票类型" prop="interface">
					<el-select v-model="detail.interface" placeholder="请选择发票类型" filterable value-key="interfaceId">
						<el-option v-for="item in interfaceList" :label="item.interfaceNameCh" :value='item'></el-option>
					</el-select>
				</el-form-item>

				<el-form-item label="类型" prop="documentType1">
					<el-select v-model="detail.documentType1" placeholder="请选择" filterable>
						<el-option v-for="item in documentTypeList" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发票" prop="fileList" class='uploadItem'>
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove1" :on-change="onChange1" :on-success="handleSuccess"
					 action='#' :on-error="handleError" :auto-upload="false" :before-remove="beforeRemove" multiple :limit="100"
					 :on-exceed="handleExceed" :file-list="fileList1" :data='detail'>
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>
					<span style='position: absolute;left: 100px;top: 0px;color:red'>{{fileList1.length}}张</span>
				</el-form-item>
				<div class='line' v-show='tag > 1'>
					<span style='position: absolute;right: 0px;top: 10px;' class='el-icon-close' v-show='tag == 2' @click="tagreduce"></span>
				</div>
				<el-form-item label="类型" prop="documentType2" v-show='tag > 1'>
					<el-select v-model="detail.documentType2" placeholder="请选择" clearable filterable>
						<el-option v-for="item in documentTypeList" :label="item.label" :value='item.value' :disabled='item.value == detail.documentType1'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发票" prop="fileList" v-show='tag > 1' class='uploadItem'>
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove2" :on-change="onChange2" :on-success="handleSuccess"
					 action='#' :on-error="handleError" :auto-upload="false" :before-remove="beforeRemove" multiple :limit="100"
					 :on-exceed="handleExceed" :file-list="fileList2">
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>
					<span style='position: absolute;left: 100px;top: 0px;color:red'>{{fileList2.length}}张</span>
				</el-form-item>
				<div class='line' v-show='tag > 2'>
					<span style='position: absolute;right: 0px;top: 10px;' class='el-icon-close' v-show='tag == 3' @click="tagreduce"></span>
				</div>
				<el-form-item label="类型" prop="documentType3" v-show='tag > 2'>
					<el-select v-model="detail.documentType3" placeholder="请选择" clearable filterable>
						<el-option v-for="item in documentTypeList" :label="item.label" :value='item.value' :disabled='item.value == detail.documentType1 || item.value == detail.documentType2'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发票" prop="fileList" v-show='tag > 2' class='uploadItem'>
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove3" :on-change="onChange3" :on-success="handleSuccess"
					 action='#' :on-error="handleError" :auto-upload="false" :before-remove="beforeRemove" multiple :limit="100"
					 :on-exceed="handleExceed" :file-list="fileList3">
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>
					<span style='position: absolute;left: 100px;top: 0px;color:red'>{{fileList3.length}}张</span>
				</el-form-item>
				<div class='line' v-show='tag > 3'>
					<span style='position: absolute;right: 0px;top: 10px;' class='el-icon-close' v-show='tag == 4' @click="tagreduce"></span>
				</div>
				<el-form-item label="类型" prop="documentType4" v-show='tag > 3'>
					<el-select v-model="detail.documentType4" placeholder="请选择" clearable filterable>
						<el-option v-for="item in documentTypeList" :label="item.label" :value='item.value' :disabled='item.value == detail.documentType1 || item.value == detail.documentType2 || item.value == detail.documentType3'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发票" prop="fileList" v-show='tag > 3' class='uploadItem'>
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove4" :on-change="onChange4" :on-success="handleSuccess"
					 action='#' :on-error="handleError" :auto-upload="false" :before-remove="beforeRemove" multiple :limit="100"
					 :on-exceed="handleExceed" :file-list="fileList4">
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>
					<span style='position: absolute;left: 100px;top: 0px;color:red'>{{fileList4.length}}张</span>
				</el-form-item>
				<div class='line' v-show='tag > 4'>
					<span style='position: absolute;right: 0px;top: 10px;' class='el-icon-close' v-show='tag == 5' @click="tagreduce"></span>
				</div>
				<el-form-item label="类型" prop="documentType5" v-show='tag > 4'>
					<el-select v-model="detail.documentType5" placeholder="请选择" clearable filterable>
						<el-option v-for="item in documentTypeList" :label="item.label" :value='item.value' :disabled='item.value == detail.documentType1 || item.value == detail.documentType2 || item.value == detail.documentType3 || item.value == detail.documentType4'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发票" prop="fileList" v-show='tag > 4' class='uploadItem'>
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove5" :on-change="onChange5" :on-success="handleSuccess"
					 action='#' :on-error="handleError" :auto-upload="false" :before-remove="beforeRemove" multiple :limit="100"
					 :on-exceed="handleExceed" :file-list="fileList5">
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>
					<span style='position: absolute;left: 100px;top: 0px;color:red'>{{fileList5.length}}张</span>
				</el-form-item>

				<div class='line' v-show='tag > 5'>
					<span style='position: absolute;right: 0px;top: 10px;' class='el-icon-close' v-show='tag == 6' @click="tagreduce"></span>
				</div>
				<el-form-item label="类型" prop="documentType6" v-show='tag > 5'>
					<el-select v-model="detail.documentType6" placeholder="请选择" clearable filterable>
						<el-option v-for="item in documentTypeList" :label="item.label" :value='item.value' :disabled='item.value == detail.documentType1 || item.value == detail.documentType2 || item.value == detail.documentType3 || item.value == detail.documentType4 || item.value == detail.documentType5'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发票" prop="fileList" v-show='tag > 5' class='uploadItem'>
					<el-upload ref='upload' class="upload-demo" :on-remove="handleRemove6" :on-change="onChange6" :on-success="handleSuccess"
					 action='#' :on-error="handleError" :auto-upload="false" :before-remove="beforeRemove" multiple :limit="100"
					 :on-exceed="handleExceed" :file-list="fileList6">
						<el-button size="mini" type="primary">本地文件</el-button>
					</el-upload>
					<span style='position: absolute;left: 100px;top: 0px;color:red'>{{fileList6.length}}张</span>
				</el-form-item>

				<el-button style='width:360px' @click='addTag' :disabled='tag >= 6'>添加一个发票类型</el-button>


			</el-form>

			<div class='btn_contain clearfix'>
				<el-button type="primary" :loading="loading" @click="commitUpload">确定</el-button>
				<!-- <span class='commit' @click="commitUpload">确定</span> -->
			</div>
		</el-dialog>

		<el-dialog title="查看" :visible.sync="dialogVisible1" width="800px" class='dialog'>

			<el-table :data="tableDetail" style="width: 100%" stripe border>
				<el-table-column align="center" label="图片名称" :resizable="false">
					<template slot-scope="scope">
						<span>{{scope.row.imageUrl.split('/').pop()}}</span>
					</template>

				</el-table-column>
				<el-table-column align="center" label="票据类型" prop="typeName" :resizable="false">
				</el-table-column>
				<el-table-column align="center" label="状态" :resizable="false">
					<template slot-scope="scope">
						<span v-if='scope.row.state == 1'>未审核</span>
						<span v-if='scope.row.state == 2'>审核通过</span>
						<span v-if='scope.row.state == 3'>审核不通过</span>
						<span v-if='scope.row.state == 4'>问票中</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="置信度" prop="confidenceLevel" :resizable="false"></el-table-column>

				<el-table-column align="center" label="创建时间" prop="createTime" :resizable="false"></el-table-column>


			</el-table>

			<div class='btn_contain clearfix'>
				<span class='commit' @click="hideDialog">确定</span>
			</div>
		</el-dialog>

		<el-dialog title="提示" :visible.sync="dialogVisibleEntity" width="400px" :before-close="handleClose">
			<p style="height: 30px;">确定提交审核?</p>
			<div>
				<el-checkbox v-model="isHaveEntity">是否有实物</el-checkbox>
			</div>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisibleEntity = false" size="small">取 消</el-button>
				<el-button type="primary" @click="openCommit1" size="small">确 定</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				pageNum: 1,
				isHaveEntity: false,
				canChoose: false,
				custList: [],
				allCount: 0,
				uncommittedStatistics: 0,
				committedStatistics: 0,
				loading1: false,
				loading2: true,
				tag: 1,
				tableDetail: [],
				customerId: '',
				accountPeriod: '',
				ces: [{
					customerId: 1,
					customerName: "12"
				}],
				mainId: '',
				color: [
					"#ED878E", "#FFAC69", "#99CCFF", "#FFCCCC"
				],
				uploadData: {
					type: 1,
					remark4: '',
					remark6: '',
					isHighCustomer: ''
				},
				list: [],

				type: 1,
				fileList1: [],
				fileList2: [],
				fileList3: [],
				fileList4: [],
				fileList5: [],
				fileList6: [],
				loading: false,
				nameData: ['收入', '成本', '费用', '其他', '未分配'],
				formInline1: {
					bankname: '',
					typecode: ''
				},
				detail: {
					item: {
						// customerId: 1,
						// customerName: 2
					},
					documentType1: '0',
					interface: {
						interfaceId: 1,
							interfaceNameCh: "未知",
							interfaceName: "other",
							interfaceModelId: 0,
							interfaceAddress: "",
							interfacePath: null,
							interfaceRemark1: "1",
							interfaceRemark2: null,
							interfaceRemark3: null,
					}
				},
				documentType1: '0',
				documentType2: '',
				documentType3: '',
				documentType4: '',
				documentType5: '',
				documentType6: '',
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
					{
						label: "无需识别",
						value: "5"
					},
				],
				dialogVisible: false,
				dialogVisible1: false,
				total: 0,
				pageSize: 10,
				currentPage: 1,
				num: 40,
				timer: [],
				// screenWidth: document.body.clientWidth
				stateList: [{
						label: "全部",
						value: null
					}, {
						label: "未提交",
						value: 1
					},

					{
						label: "已提交",
						value: 2
					},

				],
				startTime: '',
				endTime: '',
				pickerOptions: {
					disabledDate: time => {
						return (
							time < this.startTime ||
							time > this.endTime
						)
					}
				},
				currentPeriod: '',
				userTypeId: null,
				interfaceList: [],
				dialogVisibleEntity: false
			}
		},
		components: {},
		methods: {
			getCurrentPeriod() {

				let params = {

				};
				this.axios.post('/perTaxToolTwo/e9z/taxTreatment/getCurrentPeriod', params)
					.then(res => {

						if (res.data.code == 200) {
							this.currentPeriod = res.data.data;
							this.$set(this.uploadData, 'accountPeriod', res.data.data);
							this.accountPeriod = res.data.data;
							this.queryListByPage();
							this.getInvoiceStatistics(res.data.data);

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
			tagreduce() {
				if (this.tag == 6) {
					this.detail.documentType6 = '';
					this.fileList6 = [];
				} else if (this.tag == 5) {
					this.detail.documentType5 = '';
					this.fileList5 = [];
				} else if (this.tag == 4) {
					this.detail.documentType4 = '';
					this.fileList4 = [];
				} else if (this.tag == 3) {
					this.detail.documentType3 = '';
					this.fileList3 = [];
				} else if (this.tag == 2) {
					this.detail.documentType2 = '';
					this.fileList2 = [];
				}
				this.tag--;
			},
			queryDeclarationCycle(val) {
				let params = {
					"customerId": val.customerId
				};
				this.axios.post('/perTaxToolTwo/e9z/assignment/queryDeclarationCycle', params)
					.then(res => {
						if (res.data.code == 200) {
							if (res.data.data.declarationCycle == 1) {
								this.$set(this.detail, 'declarationCycle', '季报');
							} else if (res.data.data.declarationCycle == 0) {
								this.$set(this.detail, 'declarationCycle', '月报');
							} else {
								this.$set(this.detail, 'declarationCycle', '');
							}
							if (res.data.data.userName) {
								this.$set(this.detail, 'approveName', res.data.data.userName);
							} else {
								this.$set(this.detail, 'approveName', '');
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
			getProofTVoucher(val) {
				this.queryDeclarationCycle(val);
				let params = {
					"fBrNo": val.customerName,
					acctNo: JSON.parse(sessionStorage.getItem('updateUser')).accountNo
				};
				// this.axios.post('/perTaxToolTwo/e9/tVoucher/getProofTVoucher', this.qs.stringify(params), {
				this.axios.post('/perTaxToolTwo/import/e9/tVoucher/getProofTVoucher', this.qs.stringify(params), {
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					.then(res => {
						if (res.data.code == 200) {
							var currentPeriod = new Date(res.data.data.currentPeriod.replace(/-/g, "/"));
							var fPeriod = new Date(res.data.data.fyear + '/' + res.data.data.fperiod);
							if (currentPeriod.getTime() <= fPeriod.getTime()) {
								this.$set(this.detail, 'accountPeriod', res.data.data.fyear + '-' + (res.data.data.fperiod < 10 ? '0' + Number(
									res.data.data.fperiod) : res.data.data.fperiod));
								this.canChoose = true;
							} else {
								this.$set(this.detail, 'accountPeriod', res.data.data.currentPeriod);
								this.canChoose = false;
								this.startTime = fPeriod;
								this.endTime = currentPeriod;
								console.log(this.startTime);
								console.log(this.endTime);
							}
							// this.$set(this.detail, 'accountPeriod', res.data.data.ftransdate_temp.slice(0, 4) + '-' + res.data.data.ftransdate_temp
							// 	.slice(5, 7));
							// this.detail.accountPeriod = res.data.data.ftransdate_temp.slice(0,4) + '-' + res.data.data.ftransdate_temp.slice(5,7);
							console.log(this.detail.accountPeriod)
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
			addTag() {
				this.tag++;
			},
			search(mark) {
				if (mark === 0) {
					this.customerId = null;
					// this.accountPeriod = null;
					this.accountPeriod = this.currentPeriod;
					this.type = null;
					this.remark4 = "";
					this.remark6 = "";
					this.isHighCustomer = "";

				} else if (mark === 1) {
					this.customerId = null;
					// this.accountPeriod = null;
					this.accountPeriod = this.currentPeriod;
					this.type = 1;
					this.remark4 = "";
					this.remark6 = "";
					this.isHighCustomer = "";
				} else if (mark === 2) {
					this.customerId = null;
					// this.accountPeriod = null;
					this.accountPeriod = this.currentPeriod;
					this.type = 2;
					this.remark4 = "";
					this.remark6 = "";
					this.isHighCustomer = "";
				}

				this.queryListByPage();
			},
			search1() {

				this.customerId = this.uploadData.customerId;
				this.accountPeriod = this.uploadData.accountPeriod;
				this.type = this.uploadData.type;
				this.remark4 = this.uploadData.remark4;
				this.remark6 = this.uploadData.remark6;
				this.isHighCustomer = this.uploadData.isHighCustomer;

				this.queryListByPage();
			},
			selectPic() {
				this.dialogVisible = true;
			},
			jumpToQrcode() {
				this.$router.push({
					path:'/financeCalculateCenter/qrcodeUpload',
				});
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			handleRemove1(file, fileList) {
				console.log(file, fileList);
				this.fileList1 = fileList;
			},
			handleRemove2(file, fileList) {
				console.log(file, fileList);
				this.fileList2 = fileList;
			},
			handleRemove3(file, fileList) {
				console.log(file, fileList);
				this.fileList3 = fileList;
			},
			handleRemove4(file, fileList) {
				console.log(file, fileList);
				this.fileList4 = fileList;
			},
			handleRemove5(file, fileList) {
				console.log(file, fileList);
				this.fileList5 = fileList;
			},
			handleRemove6(file, fileList) {
				console.log(file, fileList);
				this.fileList6 = fileList;
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 100 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
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
			onChange6(file, fileList) { //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
				let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
				if (existFile) {
					this.$message.error('当前文件已经存在!');
					fileList.pop()
				}
				this.fileList6 = fileList
			},
			queryListByPage() {
				var _this = this;
				this.loading1 = true;
				let param = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						"customerId": this.customerId,
						"accountPeriod": this.accountPeriod,
						"type": this.type,
						"remark4": this.remark4,
						"remark6": this.remark6,
						"isHighCustomer": this.isHighCustomer,
						// "state": 1
					}
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/getUploadRecord', param).then(res => {
					this.loading1 = false;
					if (res.data.code == 200) {
						this.list = res.data.data;
						this.total = res.data.count;
						this.list.forEach((item, index) => {
							if (item.state == 4 && item.remark1) {
								var endTime = new Date(item.remark1); // 结束时间
								var startTime = new Date(); // 开始时间
								this.timer[index] = setInterval(function() {
									var now = new Date();
									if (now > endTime) {
										item.remark3 = 450;
										_this.timer.forEach(item1 => {
											clearInterval(item1)
										})

										// _this.queryListByPage();
									} else {
										item.remark3 += 450 / Math.floor((endTime - startTime) / 1000);
									}

								}, 1000);
							}


						})

						this.$nextTick(() => {
							this.drawLine();
							this.drawLine1();
						})

					} else {
						this.loading1 = false;
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
			handleCurrentChange(val) {
				this.timer.forEach(item1 => {
					clearInterval(item1)
				})
				this.currentPage = val;
				this.queryListByPage();
			},
			openDel(row) {
				this.mainId = row.mainId;
				this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"mainId": this.mainId,
						"customerName": row.customerName
					};
					this.axios.post('/perTaxToolTwo/iocr/identify/deleteUpload', params).then(res => {
						if (res.data.code == 200) {
							this.queryListByPage();
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
			openCommit(row) {
				this.dialogVisibleEntity = true;
				this.temData = row;

			},
			openCommit1(row) {
				let params = {
					"mainId": this.temData.mainId,
					mainid: this.temData.mainId,
					customerId: this.temData.customerId,
					customerName: this.temData.customerName,
					accountPeriod: this.temData.accountPeriod,
					isHaveEntity: this.isHaveEntity ? 3 : 0,

				};
				this.axios.post('/perTaxToolTwo/iocr/main/submitToCheck', params).then(res => {
					if (res.data.code == 200) {
						this.dialogVisibleEntity = false;
						this.queryListByPage();
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
						message: '提交失败',
						type: 'error'
					});
				})


			},


			// openCommit(row) {
			// 	this.mainId = row.mainId;
			// 	this.$confirm('确定提交审核?', '提示', {
			// 		confirmButtonText: '确定',
			// 		cancelButtonText: '取消',
			// 		type: 'warning'
			// 	}).then(() => {
			// 		let params = {
			// 			"mainId": this.mainId,
			// 			mainid: this.mainId,
			// 			customerId: row.customerId,
			// 			accountPeriod: row.accountPeriod,
			// 		};
			// 		this.axios.post('/perTaxToolTwo/iocr/main/submitToCheck', params).then(res => {
			// 			if (res.data.code == 200) {
			// 				this.queryListByPage();
			// 				// this.tableList = res.data.data.contractServiceProjectList;
			// 				this.$message({
			// 					message: res.data.msg,
			// 					type: 'success'
			// 				});
			// 			} else {
			// 				this.$message({
			// 					message: res.data.msg,
			// 					type: 'error'
			// 				});
			// 			}

			// 		}).catch(function(err) {
			// 			this.$message({
			// 				message: '提交失败',
			// 				type: 'error'
			// 			});
			// 		})
			// 	}).catch(() => {
			// 		this.$message({
			// 			type: 'info',
			// 			message: '已取消提交审核'
			// 		});
			// 	});
			// },
			openDetail(row) {
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/invoiceResult', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						// id: row.mainId,
						mainId: row.mainId,
						// state: row.state
						// accountPeriod: row.accountPeriod,
						customerId: row.customerId,
						customerName: row.customerName,
					}
				})
				// 				this.mainId = row.mainId;
				// 				this.dialogVisible1 = true;
				// 				let params = {
				// 					"mainId": this.mainId
				// 				};
				// 				this.axios.post('/perTaxToolTwo/iocr/identify/getUploadRecordDetail', params).then(res => {
				// 					if (res.data.code == 200) {
				// 						this.tableDetail = res.data.data;
				// 						// this.tableList = res.data.data.contractServiceProjectList;
				// 						this.$message({
				// 							message: res.data.msg,
				// 							type: 'success'
				// 						});
				// 					} else {
				// 						this.$message({
				// 							message: res.data.msg,
				// 							type: 'error'
				// 						});
				// 					}
				// 
				// 				}).catch(function(err) {
				// 					this.$message({
				// 						message: '查看失败',
				// 						type: 'error'
				// 					});
				// 				})
			},

			reset() {
				this.detail.state = 4;
				this.detail.documentType1 = '';
				this.detail.documentType2 = '';
				this.detail.documentType3 = '';
				this.detail.documentType4 = '';
				this.detail.documentType5 = '';
				this.detail.documentType6 = '';
				this.fileList1 = [];
				this.fileList2 = [];
				this.fileList3 = [];
				this.fileList4 = [];
				this.fileList5 = [];
				this.fileList6 = [];
			},


			commitUpload() {
				if (!this.detail.item.customerId) {
					this.$message({
						message: '请正确填写',
						type: 'error'
					});
				} else if (this.fileListTotal == 0) {
					this.$message({
						message: '请选择发票',
						type: 'error'
					});
				} else if (this.fileListTotal > 100) {
					this.$message({
						message: '单次上传不能超过100张',
						type: 'error'
					});
				} else {
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
									this.fileList1.forEach(file => {
										formData.append('file2', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "2":
									this.fileList1.forEach(file => {
										formData.append('file3', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "3":
									this.fileList1.forEach(file => {
										formData.append('file4', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "4":
									this.fileList1.forEach(file => {
										formData.append('file5', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "5":
									this.fileList1.forEach(file => {
										formData.append('file6', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
							}
							switch (this.detail.documentType2) {
								case "0":
									this.fileList2.forEach(file => {
										formData.append('file1', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "1":
									this.fileList2.forEach(file => {
										formData.append('file2', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "2":
									this.fileList2.forEach(file => {
										formData.append('file3', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "3":
									this.fileList2.forEach(file => {
										formData.append('file4', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "4":
									this.fileList2.forEach(file => {
										formData.append('file5', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "5":
									this.fileList2.forEach(file => {
										formData.append('file6', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
							}
							switch (this.detail.documentType3) {
								case "0":
									this.fileList3.forEach(file => {
										formData.append('file1', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "1":
									this.fileList3.forEach(file => {
										formData.append('file2', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "2":
									this.fileList3.forEach(file => {
										formData.append('file3', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "3":
									this.fileList3.forEach(file => {
										formData.append('file4', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "4":
									this.fileList3.forEach(file => {
										formData.append('file5', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "5":
									this.fileList3.forEach(file => {
										formData.append('file6', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
							}
							switch (this.detail.documentType4) {
								case "0":
									this.fileList4.forEach(file => {
										formData.append('file1', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "1":
									this.fileList4.forEach(file => {
										formData.append('file2', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "2":
									this.fileList4.forEach(file => {
										formData.append('file3', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "3":
									this.fileList4.forEach(file => {
										formData.append('file4', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "4":
									this.fileList4.forEach(file => {
										formData.append('file5', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "5":
									this.fileList4.forEach(file => {
										formData.append('file6', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
							}

							switch (this.detail.documentType5) {
								case "0":
									this.fileList5.forEach(file => {
										formData.append('file1', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "1":
									this.fileList5.forEach(file => {
										formData.append('file2', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "2":
									this.fileList5.forEach(file => {
										formData.append('file3', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "3":
									this.fileList5.forEach(file => {
										formData.append('file4', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "4":
									this.fileList5.forEach(file => {
										formData.append('file5', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "5":
									this.fileList5.forEach(file => {
										formData.append('file6', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
							}
							switch (this.detail.documentType6) {
								case "0":
									this.fileList6.forEach(file => {
										formData.append('file1', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "1":
									this.fileList6.forEach(file => {
										formData.append('file2', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "2":
									this.fileList6.forEach(file => {
										formData.append('file3', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "3":
									this.fileList6.forEach(file => {
										formData.append('file4', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "4":
									this.fileList6.forEach(file => {
										formData.append('file5', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;
								case "5":
									this.fileList6.forEach(file => {
										formData.append('file6', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 

									})
									break;

							}
							console.log(formData);
							for (var x in _this.detail) {
								if (x == 'interface') {
									formData.append('interfaceId', _this.detail[x].interfaceId);
									formData.append('interfaceName', _this.detail[x].interfaceName);
									formData.append('interfaceModelId', _this.detail[x].interfaceModelId);
									formData.append('interfaceAddress', _this.detail[x].interfaceAddress);
								} else {
									formData.append(x, _this.detail[x]);
								}

							}
							this.axios
								.post("/perTaxToolTwo/iocr/identify/uploadPicture", formData, {
									headers: {
										'Content-Type': 'application/x-www-form-urlencoded'
									}
								}).then(res => { //手动上传貌似无法触发成功或失败的钩子函数，因此这里手动调用 
									if (res.data.code == 200) {
										this.reset();

										this.dialogVisible = false;
										this.loading = false;
										this.queryListByPage();
										// this.axios
										// 	.post("/perTaxToolTwo/iocr/identify/iocrImage", res.data.data).then(res => { //手动上传貌似无法触发成功或失败的钩子函数，因此这里手动调用 
										// 		if (res.data.code == 200) {
										// 			this.queryListByPage();
										// 		} else {

										// 			let type;
										// 			if (res.data.code == 0) {
										// 				type = "warning";
										// 			} else if (res.data.code == 500) {
										// 				type = "error";
										// 			}
										// 			this.$message({
										// 				message: res.data.msg,
										// 				type: type
										// 			});
										// 		}
										// 	}).catch(err => {
										// 		this.$message({
										// 			message: "系统繁忙，请稍后重试",
										// 			type: "error"
										// 		});
										// 	})
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
										this.fileList6 = [];
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
									this.fileList6 = [];
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
				}


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



			hideDialog() {
				this.dialogVisible1 = false;
			},


			drawLine() {
				// 引入 ECharts 主模块
				var echarts = require('echarts/lib/echarts');
				// 引入柱状图
				require('echarts/lib/chart/pie');
				// 引入提示框和标题组件
				require('echarts/lib/component/tooltip');
				require('echarts/lib/component/title');
				require('echarts/lib/component/legend');
				console.log('dra888', this.nameData)
				// 基于准备好的dom，初始化echarts实例
				var myChartDiv = document.getElementsByClassName("charts");
				// myChartDiv.style.width = document.getElementsByClassName('right_contain')[0].offsetWidth + 'px';
				for (let i = 0; i < myChartDiv.length; i++) {
					var myChart = echarts.init(myChartDiv[i]);
					var data = [{
							name: "收入",
							value: this.list[i].incomeCount
						},
						{
							name: "成本",
							value: this.list[i].costCount
						},
						{
							name: "费用",
							value: this.list[i].feeCount
						},
						{
							name: "其他",
							value: this.list[i].otherCount
						},
						{
							name: "未分配",
							value: this.list[i].undefinedCount
						},
					];
					this.echarts1_option = {
						tooltip: {
							trigger: "item",
							formatter: "{b}:{c}({d}%)"
						},
						legend: {
							orient: "vertical",
							right: '40px', //图例距离右的距离
							top: "20px",
							padding: [0, 0, 30, 30],
							y: 'center', //图例上下居中
							// x: "center", //图例水平居中
							// 图标大小,宽和高
							itemWidth: 10,
							itemHeight: 10,
							itemGap: 20,
							textStyle: {
								fontSize: 12,
								color: "#666"
							},
							icon: "circle",
							// data: []
							data: this.nameData
						},
						color: this.color,
						series: [{
							name: "",
							type: "pie",
							radius: "100%", //图的大小
							// 环形大小
							radius: ["45%", "65%"],
							center: ["30%", "50%"], //图的位置，距离左跟上的位置
							itemStyle: {
								normal: {
									//隐藏标示文字
									label: {
										show: false
									},
									//隐藏标示线
									labelLine: {
										show: false
									}
								}
							},
							data: data
							//  data: []
						}]

					};
					// 先清空
					myChart.clear();
					// 绘制图表
					myChart.setOption(this.echarts1_option);
					window.addEventListener("resize", this.resizeHandle(myChart))

				}


			},

			drawLine1() {
				// 引入 ECharts 主模块
				var echarts = require('echarts/lib/echarts');
				// 引入柱状图
				require('echarts/lib/chart/bar');
				// 引入提示框和标题组件
				require('echarts/lib/component/tooltip');
				require('echarts/lib/component/title');
				require('echarts/lib/component/legend');
				console.log('dra888', this.nameData)
				// 基于准备好的dom，初始化echarts实例
				var myChartDiv = document.getElementsByClassName("charts1");
				// myChartDiv.style.width = document.getElementsByClassName('right_contain')[0].offsetWidth + 'px';
				for (let i = 0; i < myChartDiv.length; i++) {
					var myChart = echarts.init(myChartDiv[i]);
					var data = [
						this.list[i].unchecked,
						this.list[i].approved,
						this.list[i].unapproved,
						this.list[i].ticketCount,
					];
					this.echarts1_option = {
						tooltip: {
							trigger: "item",
							formatter: "{b}:{c}"
						},
						grid: {
							left: '10%',
							top: "30px",
							bottom: "30px",
							containLabel: true
						},
						yAxis: [{
							type: 'category',
							data: ['未审核', '审核通过', '审核不通过', '问票中'],
							axisTick: {
								alignWithLabel: true
							},
							axisLine: {
								show: false,
							},
							axisTick: {
								show: false,
							},
						}],
						xAxis: [{
							type: 'value',
							axisLine: {
								show: false,
							},
							axisTick: {
								show: false,
							},
							axisLabel: {
								show: false,
							},
							splitLine: {
								show: false,
							},

						}],
						series: [{
							name: "",
							type: "bar",
							barWidth: "8px",
							itemStyle: {
								normal: {
									//隐藏标示文字
									label: {
										show: false
									},
									//隐藏标示线
									labelLine: {
										show: false
									},
									color: function(params) {
										var colorList = ['#3D9DFF', '#71E63A', '#F25929', '#FFF340'];
										return colorList[params.dataIndex]
									}
								}
							},
							data: data
							//  data: []
						}]

					};
					// 先清空
					myChart.clear();
					// 绘制图表
					myChart.setOption(this.echarts1_option);
					window.addEventListener("resize", this.resizeHandle(myChart, myChartDiv))

				}


			},

			resizeHandle(chart, myChartDiv) {
				// alert(1);
				// myChartDiv.style.width = document.getElementsByClassName('charts1')[0].offsetWidth + 'px';
				// myChartDiv.style.height = "170px";
				chart.resize()
			},

			getInvoiceStatistics(data) {
				let param = {
					customerId: null,
					accountPeriod: data
				};
				this.axios.post('/perTaxToolTwo/iocr/main/getInvoiceStatistics', param).then(res => {

					if (res.data.code == 200) {
						this.allCount = res.data.data.allCount;
						this.committedStatistics = res.data.data.committedStatistics;
						this.uncommittedStatistics = res.data.data.uncommittedStatistics;

					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取统计值失败',
						type: 'error'
					});
				})
			},

			getAllCustList() {

				this.axios.get('/perTaxToolTwo/api/user/getAllCustList.do').then(res => {

					if (res.data.code == 200) {
						this.custList = res.data.data;

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
			getInterface() {
				let param = {};
				this.axios.post('/perTaxToolTwo/iocr/identify/getInterface', param).then(res => {

					if (res.data.code == 200) {
						this.interfaceList = res.data.data;

					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取类型失败',
						type: 'error'
					});
				})
			},

			common_getPeriod(fYearStart, fPeriodStart, fYearEnd, fPeriodEnd) {
				var ss = "";
				if (fYearEnd == fYearStart) {
					ss = "期间  " + fYearStart + "年第" + fPeriodStart + "期至" + "第" + fPeriodEnd + "期";
					if (fPeriodStart == fPeriodEnd) {
						ss = "期间:" + fYearStart + "年第" + fPeriodStart + "期 ";
					}
				} else {
					ss = "期间  " + fYearStart + "年第" + fPeriodStart + "期至" + fYearEnd + "年第" + fPeriodEnd + "期";

				}
				return ss;
			},
			string_isNull(str) {
				if (str == null) {
					str = "&nbsp&nbsp&nbsp&nbsp";
				}
				return str;
			},
			voucherGather_print(item) {
				var LODOP = this.getLodop(document.getElementById('LODOP_OB'), document
					.getElementById('LODOP_EM'));
				if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) return;
				//LODOP.PRINT_INITA("资产负债表打印");
				LODOP.PRINT_INITA(5, 0, 800, 600, "ZCFZBDY"); // 资产负债表打印
				LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
				LODOP.ADD_PRINT_TEXT(40, 300, 280, 30, "南京九洲会计咨询有限公司原始凭证收取回执");

				LODOP.SET_PRINT_STYLEA(0, "FontSize", 15);
				LODOP.SET_PRINT_STYLEA(0, "Bold", 1);
				//var fBrNo = $("#vouchers_CustomerName_combobox").combobox('getText');
				LODOP.SET_PRINT_STYLE("FontSize", 15);
				LODOP.SET_PRINT_STYLE("Bold", 0);
				// LODOP.ADD_PRINT_TEXT(90, 60, 400, 20, "公司名称：" + 1);
				// LODOP.ADD_PRINT_TEXT(130, 60, 400, 20, "账期：" + 2);
				LODOP.ADD_PRINT_TEXT(110, 60, 400, 20, "公司名称：" + item.customerName);
				LODOP.ADD_PRINT_TEXT(130, 60, 400, 20, "账期：" + item.accountPeriod);
				//var printDate=getCurrentDate()	;

				LODOP.SET_PRINT_STYLEA(0, "ItemType", 1);
				this.balanceSheet_lodopCommon(LODOP, item);
				LODOP.SET_PRINT_STYLE("FontSize", 14);
				LODOP.ADD_PRINT_TEXT(700, 60, 300, 100, "说明：本次为初步分类结果，具体以账务处理结果为准，特此说明！");
				LODOP.SET_PRINT_STYLE("FontSize", 14);
				LODOP.ADD_PRINT_TEXT(800, 60, 450, 20, "打单人：" + JSON.parse(sessionStorage.getItem('updateUser')).phone);
				LODOP.SET_PRINT_STYLE("FontSize", 14);
				LODOP.ADD_PRINT_TEXT(830, 60, 450, 20, "提供人：");
				LODOP.SET_PRINT_STYLE("FontSize", 14);
				LODOP.ADD_PRINT_TEXT(860, 60, 450, 20, "提供时间：" + this.formatTimeToStr(new Date(), 'yyyy-MM-dd'));

				LODOP.PREVIEW();
			},
			balanceSheet_lodopCommon(LODOP, item) {
				var var_table = "";
				var var_body = "";
				var var_head = "<table  cellspacing='0'  border='1' " +
					" style='border-collapse:collapse;border-color: Black;border-bottom-color: Black;border-right-color: Black; font-size: 14pt; font-family: '宋体';' >";
				var_head += "<thead><tr >" +
					"<td scope='col'  style='width:150px;' align='center'  height='30' valign='middle'>序   号</td>" +
					"<td scope='col'  style='width:150px;' align='center'  height='30' valign='middle'>分   类</td>" +
					"<td scope='col'  style='width:150px;' align='center'  height='30' valign='middle'>张   数</td>";

				var var_foot = "</tbody><tfoot></tfoot></table>";

				var_body += "<tr >";

				var_body += "<td style='width:150px;' align='center' style='font-size: 14pt;'  height='30' valign='middle'>1</td>";
				var_body += "<td style='width:150px;' align='center'  height='30' valign='middle'>原始凭证</td>";
				var_body += "<td style='width:150px;' align='center'  height='30' valign='middle'>" + item.totalCount + "</td>";



				var_body += "</tr>";
				var_table = var_head + var_body + var_foot;
				LODOP.SET_PRINT_STYLE("FontSize", 14);
				LODOP.SET_PRINT_PAGESIZE(1, 0, 0, "A4");
				LODOP.ADD_PRINT_TABLE(170, 60, 650, 897, var_table);
			},
			//====判断是否需要安装CLodop云打印服务器:====
			needCLodop() {
				try {
					var ua = navigator.userAgent;
					if (ua.match(/Windows\sPhone/i) != null) return true;
					if (ua.match(/iPhone|iPod/i) != null) return true;
					if (ua.match(/Android/i) != null) return true;
					if (ua.match(/Edge\D?\d+/i) != null) return true;

					var verTrident = ua.match(/Trident\D?\d+/i);
					var verIE = ua.match(/MSIE\D?\d+/i);
					var verOPR = ua.match(/OPR\D?\d+/i);
					var verFF = ua.match(/Firefox\D?\d+/i);
					var x64 = ua.match(/x64/i);
					if ((verTrident == null) && (verIE == null) && (x64 !== null))
						return true;
					else
					if (verFF !== null) {
						verFF = verFF[0].match(/\d+/);
						if ((verFF[0] >= 41) || (x64 !== null)) return true;
					} else
					if (verOPR !== null) {
						verOPR = verOPR[0].match(/\d+/);
						if (verOPR[0] >= 32) return true;
					} else
					if ((verTrident == null) && (verIE == null)) {
						var verChrome = ua.match(/Chrome\D?\d+/i);
						if (verChrome !== null) {
							verChrome = verChrome[0].match(/\d+/);
							if (verChrome[0] >= 41) return true;
						};
					};
					return false;
				} catch (err) {
					return true;
				};
			},
			getLodop(oOBJECT, oEMBED) {
				var strHtmInstall =
					"<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop32.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
				var strHtmUpdate =
					"<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop32.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
				var strHtm64_Install =
					"<br><font color='#FF00FF'>打印控件未安装!点击这里<a href='install_lodop64.exe' target='_self'>执行安装</a>,安装后请刷新页面或重新进入。</font>";
				var strHtm64_Update =
					"<br><font color='#FF00FF'>打印控件需要升级!点击这里<a href='install_lodop64.exe' target='_self'>执行升级</a>,升级后请重新进入。</font>";
				var strHtmFireFox =
					"<br><br><font color='#FF00FF'>（注意：如曾安装过Lodop旧版附件npActiveXPLugin,请在【工具】->【附加组件】->【扩展】中先卸它）</font>";
				var strHtmChrome = "<br><br><font color='#FF00FF'>(如果此前正常，仅因浏览器升级或重安装而出问题，需重新执行以上安装）</font>";
				var strCLodopInstall =
					"<br><font color='#FF00FF'>CLodop云打印服务(localhost本地)未安装启动!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行安装</a>,安装后请刷新页面。</font>";
				var strCLodopUpdate =
					"<br><font color='#FF00FF'>CLodop云打印服务需升级!点击这里<a href='CLodop_Setup_for_Win32NT.exe' target='_self'>执行升级</a>,升级后请刷新页面。</font>";
				var LODOP;
				try {
					var isIE = (navigator.userAgent.indexOf('MSIE') >= 0) || (navigator.userAgent.indexOf('Trident') >= 0);
					if (this.needCLodop()) {
						try {
							LODOP = getCLodop();
						} catch (err) {};
						if (!LODOP && document.readyState !== "complete") {
							alert("C-Lodop没准备好，请稍后再试！");
							return;
						};
						if (!LODOP) {
							if (isIE) document.write(strCLodopInstall);
							else
								document.body.innerHTML = strCLodopInstall + document.body.innerHTML;
							return;
						} else {

							if (CLODOP.CVERSION < "3.0.2.3") {
								if (isIE) document.write(strCLodopUpdate);
								else
									document.body.innerHTML = strCLodopUpdate + document.body.innerHTML;
							};
							if (oEMBED && oEMBED.parentNode) oEMBED.parentNode.removeChild(oEMBED);
							if (oOBJECT && oOBJECT.parentNode) oOBJECT.parentNode.removeChild(oOBJECT);
						};
					} else {
						var is64IE = isIE && (navigator.userAgent.indexOf('x64') >= 0);
						//=====如果页面有Lodop就直接使用，没有则新建:==========
						if (oOBJECT != undefined || oEMBED != undefined) {
							if (isIE) LODOP = oOBJECT;
							else LODOP = oEMBED;
						} else if (CreatedOKLodop7766 == null) {
							LODOP = document.createElement("object");
							LODOP.setAttribute("width", 0);
							LODOP.setAttribute("height", 0);
							LODOP.setAttribute("style", "position:absolute;left:0px;top:-100px;width:0px;height:0px;");
							if (isIE) LODOP.setAttribute("classid", "clsid:2105C259-1E0C-4534-8141-A753534CB4CA");
							else LODOP.setAttribute("type", "application/x-print-lodop");
							document.documentElement.appendChild(LODOP);
							CreatedOKLodop7766 = LODOP;
						} else LODOP = CreatedOKLodop7766;
						//=====Lodop插件未安装时提示下载地址:==========
						if ((LODOP == null) || (typeof(LODOP.VERSION) == "undefined")) {
							if (navigator.userAgent.indexOf('Chrome') >= 0)
								document.body.innerHTML = strHtmChrome + document.body.innerHTML;
							if (navigator.userAgent.indexOf('Firefox') >= 0)
								document.body.innerHTML = strHtmFireFox + document.body.innerHTML;
							if (is64IE) document.write(strHtm64_Install);
							else
							if (isIE) document.write(strHtmInstall);
							else
								document.body.innerHTML = strHtmInstall + document.body.innerHTML;
							return LODOP;
						};
					};
					if (LODOP.VERSION < "6.2.2.0") {
						if (!this.needCLodop()) {
							if (is64IE) document.write(strHtm64_Update);
							else
							if (isIE) document.write(strHtmUpdate);
							else
								document.body.innerHTML = strHtmUpdate + document.body.innerHTML;
						};
						return LODOP;
					};
					//===如下空白位置适合调用统一功能(如注册语句、语言选择等):===

					//===========================================================
					return LODOP;
				} catch (err) {
					alert("getLodop出错:" + err);
				};
			},
			getStrLength(str) {
				var cArr = str.match(/[^\x00-\xff]/ig);
				return str.length + (cArr == null ? 0 : cArr.length);
			},
			/*获取当前的年、月*/
			getCurrentDate() {
				var myDate = new Date();
				var printfFullYear = myDate.getFullYear(); //获取完整的年份(4位,1970-????)
				var printfMonth = myDate.getMonth(); //获取当前月份(0-11,0代表1月)
				var printfDate = myDate.getDate(); //获取当前日(1-31)
				var printDate = printfFullYear + "-" + printfMonth + "-" + printfDate;
				return printDate;
			},
			/*获取本期的年、月*/
			getCurrentPeriodDate(year, month) {
				var myDate = this.getLastDay(year, month);

				var printDate = year + "年" + month + "月" + myDate + "日";
				return printDate;
			},
			/*获取每个月的最后一天*/
			getLastDay(year, month) {
				var new_year = year; //取当前的年份
				var new_month = month++; //取下一个月的第一天，方便计算（最后一天不固定）
				if (month > 12) //如果当前大于12月，则年份转到下一年
				{
					new_month -= 12; //月份减
					new_year++; //年份增
				}
				var new_date = new Date(new_year, new_month, 1); //取当年当月中的第一天
				return (new Date(new_date.getTime() - 1000 * 60 * 60 * 24)).getDate(); //获取当月最后一天日期
			},

		},
		// mounted() {
		// 	const that = this
		// 	window.onresize = () => {
		// 		return (() => {
		// 			window.screenWidth = document.body.clientWidth
		// 			that.screenWidth = window.screenWidth
		// 		})()
		// 	}
		// },
		computed: {
			fileListTotal: function() {

				return this.fileList1.length + this.fileList2.length + this.fileList3.length + this.fileList4.length + this.fileList5
					.length + this.fileList6.length;
			}
		},
		watch: {
			"detail.item": {
				handler(newValue, oldValue) {
					this.detail.state = 4;
					this.detail.customerId = newValue.customerId;
					this.detail.customerName = newValue.customerName;
					this.detail.taxDeclarationType = newValue.reportTaxType;
				},
				deep: true
			},
			'$route'(to, from) {
				// init data
				if (to.name == 'invoiceUpload') {
					// this.getInvoiceStatistics();
					this.getCurrentPeriod();
					// this.queryListByPage();
				}
				if (from.name == 'invoiceUpload') {
					this.timer.forEach(item1 => {
						clearInterval(item1)
					})
				}

			}
			// screenWidth(val) {
			// 	
			// }
		},
		created() {

			if (this.needCLodop()) {
				var head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;
				var oscript = document.createElement("script");
				oscript.src = "http://localhost:8000/CLodopfuncs.js?priority=1";
				head.insertBefore(oscript, head.firstChild);

				//引用双端口(8000和18000）避免其中某个被占用：
				oscript = document.createElement("script");
				oscript.src = "http://localhost:18000/CLodopfuncs.js?priority=0";
				head.insertBefore(oscript, head.firstChild);
			};

			var updateUser = JSON.parse(sessionStorage.getItem('updateUser'));
			this.userTypeId = updateUser.userTypeId;
			this.getAllCustList();
			// this.getInvoiceStatistics();
			// this.queryListByPage();
			this.getCurrentPeriod();
			this.getInterface()

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
		// height: 1rem;
		margin: 10px 20px;
		padding: 0px 30px 20px;
		// background: url(../../assets/img/list-bg1.png) no-repeat;
		background-size: cover;
		background: #fff;
		border-top-left-radius: 0.06rem;
		border-top-right-radius: 0.06rem;

		// 		/deep/ input::-webkit-input-placeholder {
		// 			/* placeholder颜色  */
		// 			color: #fff;
		// 		}
		// 
		// 		/deep/ .el-select__caret {
		// 			color: #fff
		// 		}

		.title {
			font-size: 0.14rem;
			height: 0.5rem;
			line-height: 0.5rem;
			// color: #fff;
		}


		/deep/ .el-input.is-active .el-input__inner,
		/deep/ .el-input__inner:focus {
			// border-color: #fff;
			outline: 0;
		}
	}

	.contain_body {
		// padding: 0.2rem 0rem;
		margin: 0px 20px;

		// background: #fff;
		.chart_contain {
			display: flex;
			flex-wrap: wrap;
			justify-content: space-between;
			flex-direction: row;

		}

		.card {
			position: relative;
			background: #fff;
			width: calc(50% - 10px);
			height: 300px;
			margin-bottom: 20px;
			position: relative;

			.mask1 {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0px;
				left: 0px;
				z-index: 20;
				background: rgba(255, 255, 255, .5);

				.man {
					font-family: "Snickles";
					top: 180px;
					position: absolute;
					width: 100%;
					text-align: center;
					color: #409EFF
				}

				div.person {
					background: url(../../assets/img/j1.gif) no-repeat center center;
					width: 40px;
					height: 60px;
					background-size: contain;
					position: absolute;
					top: 96px;
					left: calc(50% - 270px);
					transition: left 1s;
				}

				// div.person{
				// 	background: url(../../assets/img/j2.gif) no-repeat center center;
				// 	width: 50px;
				// 	height: 60px;
				// 	background-size: contain;
				// 	position: absolute;
				// 	top: 100px;
				// 	left: calc(50% - 270px);
				// 	transition:left 1s;
				// }

				div.bar {
					background: url(../../assets/img/bar.png) no-repeat;
					width: 0px;
					height: 16px;
					border-radius: 10px;
					position: absolute;
					top: 150px;
					left: calc(50% - 250px);
				}

				div.bg {
					background: #fff;
					border: 2px solid rgb(84, 94, 102);
					width: 500px;
					height: 16px;
					border-radius: 10px;
					position: absolute;
					top: 150px;
					left: calc(50% - 250px);
					box-sizing: border-box
				}
			}

			.mask2 {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0px;
				left: 0px;
				z-index: 20;
				background: rgba(255, 255, 255, .5);

				.man {
					font-family: "Snickles";
					top: 180px;
					position: absolute;
					width: 100%;
					text-align: center;
					color: #409EFF
				}

				div.person {
					background: url(../../assets/img/j.gif) no-repeat;
					width: 43px;
					height: 56px;
					position: absolute;
					top: 90px;
					left: calc(50% - 270px);
					transition: left 1s;
				}


				div.bg {
					background: #fff;
					border: 2px solid rgb(84, 94, 102);
					width: 500px;
					height: 16px;
					border-radius: 10px;
					position: absolute;
					top: 150px;
					left: calc(50% - 250px);
					box-sizing: border-box
				}
			}

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
						margin-left: 12px;
					}
				}

			}

			.charts {
				width: calc(50%);
				height: 200px;
				float: left;
			}

			.charts1 {
				width: calc(50%);
				height: 200px;
				float: left;
			}

			/deep/ .el-loading-spinner .circular {
				width: 42px;
				height: 42px;
				animation: loading-rotate 2s linear infinite;
				display: none;
			}

			/deep/ .el-loading-spinner {
				background: url(../../assets/img/timg.gif) no-repeat center center;
				background-size: 48px 48px;
				width: 100%;
				height: 100%;
				position: relative;
				top: 0px;
				left: 0px;
				margin-top: 0px;

				.el-loading-text {
					padding-top: 190px;
				}
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

	/deep/ .el-form-item.uploadItem {
		position: relative;
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

	/deep/ #entry {
		.el-dialog__body {
			padding: 0 20px 0px;
		}
	}


	.dialog {
		div.line {
			width: 100%;
			height: 1px;
			background: #efefef;
			position: relative;
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
