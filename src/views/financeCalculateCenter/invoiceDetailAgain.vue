<template>
	<div class="main_contain">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>会计工厂</el-breadcrumb-item>
			<el-breadcrumb-item>凭证管理</el-breadcrumb-item>

			<el-breadcrumb-item>发票审核</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>发票审核</div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini">
					<el-form-item label="公司">
						<!-- <el-autocomplete class="inline-input" v-model="uploadData.customerName" :fetch-suggestions="querySearch"
							 placeholder="请输入客户名称" @select="handleSelect"></el-autocomplete> -->
						<el-select v-model="uploadData.customerId" placeholder="请选择公司名称" clearable filterable>
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="账期" prop="accountPeriod">
						<el-date-picker v-model="uploadData.accountPeriod" type="month" placeholder="选择账期" clearable value-format='yyyy-MM'>
						</el-date-picker>
					</el-form-item>
					<!-- <el-form-item label="发票审核人" prop="checkPerson">
						<el-input v-model="uploadData.checkPerson" placeholder="请选择" clearable filterable></el-input>
					</el-form-item> -->
					<!-- <el-form-item label="" prop="accountPeriod">
						<el-checkbox v-model="uploadData.isMax" :true-label='trueLabel' :false-label="falseLabel">是否最后一期</el-checkbox>

					</el-form-item> -->
					<el-button @click='search' size="mini">查询</el-button>
				</el-form>
				<!-- <el-button @click='handleJZ' round size='small' style="position: absolute;top: 100px;right: 20px;">结账</el-button> -->
			</div>
			<div class="contain_body">
				<el-table :data="detail" style="width: 100%" stripe border v-loading='loading'>
					<el-table-column align="center" label="客户名称" prop="customerName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="账期" prop="accountPeriod" :resizable="false"></el-table-column>
					<el-table-column align="center" label="申报税务类型" prop="taxDeclarationType" :resizable="false">
						<template slot-scope="scope">
							<span v-show="scope.row.taxDeclarationType == '232'">小规模</span>
							<span v-show="scope.row.taxDeclarationType == '233'">一般纳税人</span>
							
						</template>
					</el-table-column>
					<el-table-column align="center" label="发票审核人" prop="checkPerson" :resizable="false">
						<template slot-scope="scope">
							<span>{{scope.row.checkPerson?scope.row.checkPerson:'--'}}</span>
							
						</template>
					</el-table-column>
					<!-- <el-table-column align="center" label="凭证">
						<el-table-column align="center" label="凭证数量" prop="accountantAllCount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="已审核凭证" prop="accountantCheckCount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="未审核凭证" prop="accountantUncheckCount" :resizable="false"></el-table-column>
					</el-table-column> -->
					<el-table-column align="center" label="未审核" prop="unchecked" :resizable="false"></el-table-column>
					<el-table-column align="center" label="审核通过" prop="approved" :resizable="false"></el-table-column>
					<el-table-column align="center" label="审核不通过" prop="unapproved" :resizable="false"></el-table-column>
					<el-table-column align="center" label="问票中" prop="ticketCount" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="发票">
						<el-table-column align="center" label="未审核" prop="unchecked" :resizable="false"></el-table-column>
						<el-table-column align="center" label="审核通过" prop="approved" :resizable="false"></el-table-column>
						<el-table-column align="center" label="审核不通过" prop="unapproved" :resizable="false"></el-table-column>
						<el-table-column align="center" label="问票中" prop="ticketCount" :resizable="false"></el-table-column>
					</el-table-column> -->




					<el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleDetail(scope.$index, scope.row)">查看</el-button>
							
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>
		</div>


		

		


	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				
				
				detail: [],
				
				uploadData: {
					
				},
				
				loading: false,
				dialogVisible: false,
				total: 0,
				pageSize: 10,
				currentPage: 1,


			}
		},
		components: {},
		methods: {
			search() {
				this.customerId = this.uploadData.customerId;
				this.accountPeriod = this.uploadData.accountPeriod;
				this.queryListByPage();
			},

			queryListByPage() {
				this.loading = true;
				let param = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						"customerId": this.customerId,
						"accountPeriod": this.accountPeriod,
						// "isMax": this.isMax
						// "document_type": 1,
						// "state": 1
					}
				};
				this.axios.post('perTaxToolTwo/iocr/main/getCheckList', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.detail = res.data.data;
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
			
			
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage();
			},


			


			

			handleDetail(index, row) {
				this.$router.push({ //核心语句
					path: '/financeCalculateCenter/invoiceApproveAgain', //跳转的路径
					query: { //路由传参时push和query搭配使用 ，作用时传递参数
						mainId: row.mainId,
						customerId: row.customerId,
						accountPeriod: row.accountPeriod,
						customerName: row.customerName,
					}
				})
			},

			

			

			


			
			

		},
		watch: {
			'$route'(to, from) {
				// init data
				if (to.name == 'invoiceDetailAgain') {
					this.queryListByPage();
				}

			}
		},
		created() {
			this.queryListByPage();

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

		.left_contain {
			// width: 100%;
			height: 100%;
			position: relative;
			// padding:0px 20px;
			background: #fff;
			margin: 20px 20px;
			box-sizing: border-box;
		}

		.right_contain {
			height: 100%;
			float: right;
			width: 500px;
			background: #fff;
			padding: 0 12px;
			box-sizing: border-box;

			h3 {
				color: #409EFF;
				height: 40px;
				line-height: 40px;
			}

			/deep/ .el-form-item__content {
				width: 135px
			}

			/deep/ .el-date-editor.el-input {
				width: 100px
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
		position: relative;

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

		.el-tabs {
			height: 100%;
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

	/deep/ .el-checkbox {
		color: #fff;
	}

	/deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
		color: #fff;
	}
</style>
