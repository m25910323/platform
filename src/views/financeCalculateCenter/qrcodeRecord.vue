<template>
	<div class="main">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>会计工厂</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/financeCalculateCenter/invoiceUpload' }">凭证管理</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/financeCalculateCenter/qrcodeUpload' }">扫码上传</el-breadcrumb-item>
			<el-breadcrumb-item>扫码上传记录</el-breadcrumb-item>
		</el-breadcrumb>

		<div class="search_contain">

			<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini">
				<el-form-item label="公司">
					<el-select v-model="uploadData.customerId" placeholder="请选择" clearable filterable>

						<el-option v-for="item in custList" :label="item.customerName" :value='item.customerId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="账期" prop="accountPeriod">
					<el-date-picker v-model="uploadData.accountPeriod" type="month" placeholder="请选择" clearable value-format='yyyy-MM'>
					</el-date-picker>
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
				<el-table-column align="center" label="公司名称" prop="customerName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>
				<el-table-column align="center" label="上传票据合计" prop="totalCount" :resizable="false"></el-table-column>
				<el-table-column align="center" label="处理中" prop="dealCount" :resizable="false">
					<template slot-scope="scope">
						<span>{{scope.row.totalCount - scope.row.successCount - scope.row.failCount}}</span>
					
					</template>
				</el-table-column>
				<el-table-column align="center" label="上传成功" prop="successCount" :resizable="false"></el-table-column>
				<el-table-column align="center" label="上传失败" prop="failCount" :resizable="false"></el-table-column>
				<el-table-column align="center" label="上传时间" prop="uploadTime" :resizable="false">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.uploadTime)}}</span>
					
					</template>
				</el-table-column>
				<el-table-column align="center" label="上传人" prop="uploadPersonName" :resizable="false"></el-table-column>

				<el-table-column align="center" label="操作" :resizable="false">
					<template slot-scope="scope">
						<el-button size='mini' type="text" @click='jumpTo(scope.row)'>查看票据</el-button>

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
				currentPage:1,
				total:0,
				pageSize:10,
				uploadData: {
					document: '',
					customer: ''
				},
				tableData: [],
			}
		},
		components: {},
		methods: {
			jumpTo(row) {
				this.$router.push({
					path:'/financeCalculateCenter/qrcodeDetail',
					query:{
						recordId:row.recordId,
						customerName:row.customerName,
						accountPeriod:row.accountPeriod,
					}
				})
			},
			handleCurrentChange(val){
				this.currentPage = val;
				this.getQRUploadRecord()
			},
			search(){
				this.customerId = this.uploadData.customerId;
				this.accountPeriod = this.uploadData.accountPeriod;
				this.getQRUploadRecord()
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
			getQRUploadRecord() {
				let params = {
					"page": 1,
					"row": 10,
					"data": {
						customerId:this.customerId,
						accountPeriod:this.accountPeriod
					}
				}
				this.axios.post('/perTaxToolTwo/iocr/identify/getQRUploadRecord',params).then(res => {

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
				if (to.name == 'qrcodeRecord') {
					this.getQRUploadRecord();
				}

			}
		},
		created() {
			this.getAllCustList();
			this.getQRUploadRecord();
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
