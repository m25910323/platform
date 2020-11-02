<template>
	<div class="main">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>会计工厂</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/financeCalculateCenter/invoiceUpload' }">凭证管理</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/financeCalculateCenter/qrcodeUpload' }">扫码上传</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/financeCalculateCenter/qrcodeRecord' }">扫码上传记录</el-breadcrumb-item>
			<el-breadcrumb-item>上传详情</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="search_contain">

			<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini">
				<el-form-item label="公司">
					<el-input :value="$route.query.customerName" readonly ></el-input>
				</el-form-item>
				<el-form-item label="账期" prop="accountPeriod">
					<el-input :value="$route.query.accountPeriod" readonly ></el-input>
				</el-form-item>
				<el-form-item label="凭证类型" prop="docType">
					<el-select v-model="uploadData.docType" placeholder="请选择" clearable>
						<el-option v-for="item in documentTypeList" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="发票状态" prop="invoiceState">
					<el-select v-model="uploadData.invoiceState" placeholder="请选择" clearable>
						<el-option v-for="item in invoiceStateList" :label="item.label" :value='item.value'></el-option>
					</el-select>
				</el-form-item>
				<el-button size="mini" type="primary" @click='search'>查询</el-button>

			</el-form>
		</div>
		<div class="main_contain" v-loading='loading'>

			<el-table :data="tableData" style="width: 100%" stripe border>
				<el-table-column label="序号" type="index" width="50" align="center">
					<template scope="scope">
						<span>{{scope.$index + 1}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="凭证类型" prop="docType" :resizable="false">
					<template slot-scope="scope">
						<span v-if="scope.row.docType == 0">收入</span>
						<span v-if="scope.row.docType == 1">费用</span>
						<span v-if="scope.row.docType == 2">成本</span>
						<span v-if="scope.row.docType == 3">其他</span>
						<span v-if="scope.row.docType == 4">未分配</span>
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
				<el-table-column align="center" label="不含税总金额" prop="invoiceAmount" :resizable="false"></el-table-column>
				<el-table-column align="center" label="校验码" prop="invoiceCheckCode" :resizable="false"></el-table-column>
				<el-table-column align="center" label="开票日期" prop="invoiceDate" :resizable="false"></el-table-column>
				<el-table-column align="center" label="发票状态" prop="invoiceState" :resizable="false">
					<template slot-scope="scope">
						<span v-if="scope.row.invoiceState == 1">未处理</span>
						<span v-if="scope.row.invoiceState == 2">上传成功</span>
						<span v-if="scope.row.invoiceState == 3">上传失败</span>
					</template>
				</el-table-column>

			</el-table>
			<el-pagination background @current-change="((val)=>{handleCurrentChange(val)})" :current-page="currentPage"
			 :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>

		</div>



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
				currentPage: 1,
				total: 0,
				pageSize: 10,
				uploadData: {
					document: '',
					customer: ''
				},
				tableData: [],
				invoiceStateList: [
					{
						label: "未处理",
						value: 1
					},
					{
						label: "上传成功",
						value: 2
					},
					{
						label: "上传失败",
						value: 3
					}
				],
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
			}
		},
		components: {},
		methods: {
			search() {
				this.docType = this.uploadData.docType;
				this.invoiceState = this.uploadData.invoiceState;
				this.getQRInvoiceUploadRecord()
			},
			handleCurrentChange(val){
				this.currentPage = val;
				this.getQRInvoiceUploadRecord()
			},

			getQRInvoiceUploadRecord() {
				let params = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						docType: this.docType,
						invoiceState: this.invoiceState,
						recordId: this.$route.query.recordId,
					}
				}
				this.axios.post('/perTaxToolTwo/iocr/identify/getQRInvoiceUploadRecord', params).then(res => {

					if (res.data.code == 200) {
						this.tableData = res.data.data;
						this.total = res.data.count;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取记录失败',
						type: 'error'
					});
				})
			},


		},
		mounted() {},
		computed: {},
		watch: {

			'$route'(to, from) {
				// init data
				if (to.name == 'qrcodeDetail') {
					this.getQRInvoiceUploadRecord();
				}

			}
		},
		created() {
			this.getQRInvoiceUploadRecord();
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


	/deep/ .el-pagination {
		text-align: center;
		margin-top: 20px;
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
