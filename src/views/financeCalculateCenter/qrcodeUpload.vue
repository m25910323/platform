<template>
	<div class="main">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>会计工厂</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/financeCalculateCenter/invoiceUpload' }">凭证管理</el-breadcrumb-item>
			<el-breadcrumb-item>扫码上传</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="search_contain">

			<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini">
				<el-form-item label="公司">
					<el-select v-model="uploadData.customer" placeholder="请选择" clearable filterable value-key="customerId">

						<el-option v-for="item in custList" :label="item.customerName" :value='item'></el-option>
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
					</el-select>
				</el-form-item>
				<el-form-item label="账期" prop="accountPeriod">
					<el-date-picker v-model="uploadData.accountPeriod" type="month" placeholder="请选择" clearable value-format='yyyy-MM'>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="凭证类型" prop="document">
					<el-select v-model="uploadData.document" placeholder="请选择" filterable value-key="value">
						<el-option v-for="item in documentTypeList" :label="item.label" :value='item'></el-option>
					</el-select>
				</el-form-item>
				<el-button  type="primary" size="mini" style="float: right;" @click='jumpTo'>扫码上传记录</el-button>
				<el-button  type="primary" size="mini" style="float: right;margin-right: 20px;" @click='openDialog'>手动录入</el-button>

			</el-form>
		</div>
		<div class="main_contain" v-loading='loading'>

			<el-table :data="tableData" style="width: 100%" stripe border>
				<el-table-column label="序号" type="index" width="50" align="center">
					<template scope="scope">
						<span>{{scope.$index + 1}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="公司名称" prop="customerName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>
				<el-table-column align="center" label="凭证类型" prop="documentTypeName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="申报类型" prop="taxDeclarationType" :resizable="false">
					<template slot-scope="scope">
						<span v-if="scope.row.taxDeclarationType == 233">一般纳税人</span>
						<span v-if="scope.row.taxDeclarationType == 232">小规模</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="发票类型" prop="invoiceType" :resizable="false">
					<template slot-scope="scope">
						<span v-if="scope.row.invoiceType == '04'">增值税普通发票</span>
						<span v-if="scope.row.invoiceType == '01'">增值税专用发票</span>
						<span v-if="scope.row.invoiceType == '10'">增值税电子普通发票</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="发票号码" prop="invoiceNum" :resizable="false"></el-table-column>
				<el-table-column align="center" label="发票代码" prop="invoiceCode" :resizable="false"></el-table-column>
				<el-table-column align="center" label="不含税总金额" prop="amount" :resizable="false"></el-table-column>
				<el-table-column align="center" label="校验码" prop="checkCode" :resizable="false"></el-table-column>
				<el-table-column align="center" label="开票日期" prop="invoiceDate" :resizable="false"></el-table-column>
				<el-table-column align="center" label="操作" :resizable="false">
					<template slot-scope="scope">
						<el-button size='mini' type="text" @click='delOne(scope.row,scope.$index)'>删除</el-button>

					</template>
				</el-table-column>

			</el-table>
			<div style="text-align: center;margin-top: 20px;">
				<el-button type="primary" size="medium" style="width: 200px;" @click='submit' :disabled="tableData.length == 0">批量提交</el-button>
			</div>


		</div>
		<el-dialog title="提示" :visible.sync="dialogVisible" width="600px" class='dialog'>

			<p v-for="item in msgList">
				<span>{{item.customerName}}</span>
				<span>{{item.msg}}</span>
			</p>
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="dialogVisible = false">确 定</el-button>
			</span>
		</el-dialog>
		
		<el-dialog title="录入" :visible.sync="dialogVisible1" width="400px" class='dialog'>
			<el-form :inline="true" ref="ruleForm1" :model="detail" class="demo-form-inline" label-width="100px" size="mini">
				<el-form-item label="发票类型" prop="invoiceType">
					<el-select v-model="detail.invoiceType" placeholder="请选择发票类型" filterable>
						<el-option v-for="item in invoiceTypeList" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发票号码" prop="invoiceNum">
					<el-input v-model="detail.invoiceNum"></el-input>
				</el-form-item>
				<el-form-item label="发票代码" prop="invoiceCode">
					<el-input v-model="detail.invoiceCode"></el-input>
				</el-form-item>
				<el-form-item label="不含税总金额" prop="amount">
					<el-input v-model="detail.amount"></el-input>
				</el-form-item>
				<el-form-item label="校验码" prop="checkCode">
					<el-input v-model="detail.checkCode"></el-input>
				</el-form-item>
				<el-form-item label="开票日期" prop="invoiceDate">
					<el-date-picker v-model="detail.invoiceDate" type="date" value-format='yyyyMMdd' format="yyyy-MM-dd">
					</el-date-picker>
				</el-form-item>
			</el-form>
			
			<span slot="footer" class="dialog-footer">
				<el-button type="primary" @click="addTableData">确 定</el-button>
			</span>
		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				custList: [],
				loading: false,
				customerId: '',
				accountPeriod: '',

				uploadData: {
					document: '',
					customer: ''
				},

				type: 1,
				detail:{},
				documentType: '0',
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
					}
				],
				dialogVisible: false,
				dialogVisible1: false,
				userTypeId: null,
				tableData: [],
				msgList: [],
				invoiceTypeList:[
					{label:'增值税普通发票',value:'04'},
					{label:'增值税专用发票',value:'01'},
					{label:'增值税电子普通发票',value:'10'}
				]
			}
		},
		components: {},
		methods: {
			jumpTo(){
				this.$router.push({
					path:'/financeCalculateCenter/qrcodeRecord',
				})
			},
			openDialog(){
				if (!(this.uploadData.customer.customerId && this.uploadData.accountPeriod && this.uploadData.document)) {
					this.$message({
						message: '请选择公司、账期、凭证类型',
						type: 'warning'
					});
				} else{
					this.dialogVisible1 = true;
					this.detail = {};
				}
				
			},
			delOne(row, index) {
				this.tableData.splice(index, 1);
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
			submit() {
				this.loading = true;
				this.axios.post('/perTaxToolTwo/iocr/identify/uploadInvoiceByQRCodeData', this.tableData).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.tableData = [];
						this.msgList = res.data.data;
						this.dialogVisible = true;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '录入失败',
						type: 'error'
					});
				})
			},
			addTableData(){
				this.tableData.push({
					customerId: this.uploadData.customer.customerId,
					customerName: this.uploadData.customer.customerName,
					accountPeriod: this.uploadData.accountPeriod,
					documentType: this.uploadData.document.value,
					documentTypeName: this.uploadData.document.label,
					taxDeclarationType: this.uploadData.taxDeclarationType,
					invoiceType: this.detail.invoiceType,
					invoiceNum: this.detail.invoiceNum,
					invoiceCode: this.detail.invoiceCode,
					amount: this.detail.amount,
					checkCode: this.detail.checkCode,
					invoiceDate: this.detail.invoiceDate,
				})
				this.dialogVisible1 = false;
			}

		},
		mounted() {
			let code = '';
			let lastTime, nextTime;
			let lastCode, nextCode;
			let _this = this;
			window.document.onkeypress = (e) => {
				if (window.event) { // IE
					nextCode = e.keyCode;
				} else if (e.which) { // Netscape/Firefox/Opera
					nextCode = e.which;
				}
				if (nextCode === 13) {
					if (code.length < 3) return; // 手动输入的时间不会让code的长度大于2，所以这里只会对扫码枪有

					console.log(code); // 获取到扫码枪输入的内容，做别的操作
					if (!(this.uploadData.customer.customerId && this.uploadData.accountPeriod && this.uploadData.document)) {
						this.$message({
							message: '请选择公司、账期、凭证类型',
							type: 'warning'
						});
					} else if (code.indexOf('，') != -1) {
						this.$message({
							message: '请切换到英文输入法',
							type: 'warning'
						});
					} else {
						var arr = code.split(',');
						_this.tableData.push({
							customerId: this.uploadData.customer.customerId,
							customerName: this.uploadData.customer.customerName,
							accountPeriod: this.uploadData.accountPeriod,
							documentType: this.uploadData.document.value,
							documentTypeName: this.uploadData.document.label,
							taxDeclarationType: this.uploadData.taxDeclarationType,
							invoiceType: arr[1],
							// 号码, 
							invoiceNum: arr[3],
							// 发票代码  
							invoiceCode: arr[2],
							// 不含税总金额, 
							amount: arr[4],
							// 校 q验码 , 
							checkCode: arr[6],
							// 开票日期, 
							invoiceDate: arr[5],
							// 凭证类型
						})
					}

					code = '';
					lastCode = '';
					lastTime = '';
					return;
				}
				nextTime = new Date().getTime();
				if (!lastTime && !lastCode) {
					code += e.key;
				}

				if (lastCode && lastTime) {
					code += e.key;
				}
				lastCode = nextCode;
				lastTime = nextTime;
			}
		},
		computed: {},
		watch: {
			"uploadData.customer": {
				handler(newValue, oldValue) {
					this.uploadData.taxDeclarationType = newValue.reportTaxType;
				},
				deep: true
			},
			'$route'(to, from) {
				// init data
				if (to.name == 'qrcodeUpload') {}

			}
		},
		created() {

			var updateUser = JSON.parse(sessionStorage.getItem('updateUser'));
			this.userTypeId = updateUser.userTypeId;
			this.getAllCustList();

		}
	}
</script>

<style scoped lang="less">
	.main {
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		/deep/ .el-dropdown-link {
			cursor: pointer;
			color: #409eff;
			font-size: 12px;
			margin-left: 8px;
		}

		/deep/ .el-icon-arrow-down {
			font-size: 12px;
		}

		.el-breadcrumb {
			height: 40px;
			line-height: 39px;
			padding-left: 20px;
			border-top: 1px solid #f2f6fc;
			box-sizing: border-box;
		}

		/deep/ .el-table td,
		/deep/ .el-table th {
			padding: 6px 0;
		}

		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 30px;
			background-color: #f9f9f9;
		}

		/deep/ .el-table th {
			background-color: #f9f9f9;
		}

		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #f9f9f9;
		}

		/deep/ .el-table__body tr,
		.el-table__body td {
			padding: 0;
			height: 30px;
			background-color: #fff;
		}

		/deep/ .el-table__body tr.el-table__row--striped {
			background-color: #f9f9f9;
		}

		/deep/ .el-table thead {
			color: #8c8c8c;
		}

		/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
			background-color: #efe9e5;
		}

		/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
			border-bottom-color: #fff;
			background: #f9f9f9;
		}

		/deep/ .search_contain {
			background: #fff;
			padding: 0.3rem 20px 0.08rem;
			margin: 0px 20px 10px;

			.info {
				height: 40px;
				line-height: 40px;
			}

			a {
				margin-left: 10px;
			}

			.el-input {
				width: 180px;
			}

			.el-form-item {
				margin-right: 30px;
			}
		}

		.main_contain {
			background: #fff;
			margin: 12px 20px 20px;
			padding: 12px 20px 20px;

			h5 {
				height: 40px;
				line-height: 40px;
			}
		}
	}

	/deep/ .el-dialog {
		p {
			height: 24px;
			line-height: 24px;
		}
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
</style>
