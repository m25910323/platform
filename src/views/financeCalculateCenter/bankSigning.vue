<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>银行签约</div>
				<!-- <el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
					<el-form-item label="银行名称:">
						<el-select v-model='formInline.bankid' clearable>
							<el-option v-for='item in banknameList' :label="item.bankname" :value="item.id" :key='item.bankname'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click='search' size="mini">查询</el-button>
						<el-button @click='add' size="mini">新增</el-button>
					</el-form-item>
				</el-form> -->
			</div>
			<div class="contain_body">
				<el-table :data="banknameList" style="width: 100%" stripe border v-loading='loading'>
					<!-- <el-table-column type="selection" width="50"></el-table-column> -->
					<el-table-column align="center" label="appID" prop="appid" :resizable="false"></el-table-column>
					<el-table-column align="center" label="代账公司编号" prop="acctcomno" :resizable="false"></el-table-column>
					<el-table-column align="center" label="代账公司名称" prop="acctcomname" :resizable="false"></el-table-column>

					<el-table-column align="center" label="商户编号" prop="merid" :resizable="false"></el-table-column>
					<el-table-column align="center" label="请求序号" prop="fseqno" :resizable="false"></el-table-column>

					<el-table-column align="center" label="技术编号" prop="techpartnerno" :resizable="false"></el-table-column>

					<el-table-column align="center" width="200" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">签约</el-button>
							<!-- <el-button size="mini" type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>
		</div>

		<el-dialog title="签约" :visible.sync="dialogVisible" width="4rem" :before-close="handleClose">
			<el-form ref="form" :model="form" label-width="140px" size="mini">
				<el-form-item label="核心企业编号">
					<el-input v-model="form.merid" disabled></el-input>
				</el-form-item>
				<el-form-item label="客户名称">
					<el-select v-model="form.customer" placeholder="请选择单位名称" clearable filterable>
						<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
						<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item'></el-option>
						<!-- <el-option v-for="item in cust" :label="item.customerName" :value='item.customerName'></el-option> -->
					</el-select>
				</el-form-item>
				<el-form-item label="统一社会信用代码">
					<el-input v-model="form.uscc"></el-input>
				</el-form-item>
				<el-form-item label="代账公司编号">
					<el-input v-model="form.acctcomno" disabled></el-input>
				</el-form-item>
				<el-form-item label="客户手机号">
					<el-input v-model="form.mobile"></el-input>
				</el-form-item>
				<el-form-item label="账号">
					<el-input v-model="form.accno"></el-input>
				</el-form-item>
				<el-form-item label="户名">
					<el-input v-model="form.accname"></el-input>
				</el-form-item>
				<el-form-item label="交易日期">
					<el-date-picker v-model="form.tranDate" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="交易流水号">
					<el-input v-model="form.transNo"></el-input>
				</el-form-item>
			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click="compare">确认</span>
				<span class='close' @click="hideDialog">关闭</span>

			</div>

		</el-dialog>


	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				tag: 0,
				loading: false,
				formInline: {
					bankname: '',
					typecode: '',
					bankid: ''
				},
				form: {
					bankname: '',
					typecode: ''
				},
				currentPage: 1,
				pageSize: 10,
				total: 0,

				dialogVisible: false,

				banknameList: [],

				bankid: '',


				loading1: false,
				formInline1: {
					bankname: '',
					typecode: ''
				},
				form1: {
					bankname: '',
					typecode: ''
				},

				dialogVisible1: false,

				banknameList1: [],

			}
		},
		components: {},
		methods: {

			getBankList() {
				let param = {

					data: {

					},
					page: this.currentPage,
					row: this.pageSize
				};

				this.axios.post('/perTaxToolTwo/gh/queryagencyinfo', param).then(res => {
					if (res.data.code == 200) {
						this.loading = false;
						this.banknameList = res.data.data;
						this.total = res.data.count;
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

			search() {
				this.loading = true;
				this.bankid = this.formInline.bankid;
				this.currentPage = 1;
				this.getBankList()
			},
			add() {
				this.tag = 0;
				this.dialogVisible = true;
			},

			handleEdit(index, row) {
				this.tag = 1;
				this.dialogVisible = true;
				this.form = JSON.parse(JSON.stringify(row));


			},

			handleDel(index, row) {
				this.axios.get('/perTaxToolTwo/dz/dzDealController/deleteBank?id=' + row.id).then(res => {
					if (res.data.code == 200) {
						this.getBankList();
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
						message: '获取银行列表失败',
						type: 'error'
					});
				})
			},
			hideDialog() {
				this.dialogVisible = false;
			},
			handleClose() {
				this.dialogVisible = false;
			},
			handleCurrentChange(val) {
				this.currentPage = val;
			},
			compare() {
				this.form.cis = this.form.merid;
				this.form.customerId = this.form.customer.customerId;
				this.form.customerName = this.form.customer.customerName;
				let param = this.form;
				
				var url = '/perTaxToolTwo/gh/pagejump?cis=' + this.form.cis + '&customerId=' + this.form.customerId
				 + '&customerName=' + this.form.customerName
				 + '&uscc=' + this.form.uscc
				 + '&acctcomno=' + this.form.acctcomno
				 + '&mobile=' + this.form.mobile
				 + '&accno=' + this.form.accno
				 + '&accname=' + this.form.accname
				 + '&tranDate=' + this.form.tranDate
				 + '&transNo=' + this.form.transNo;
				
				window.location.href = url;
				// var url = '/perTaxToolTwo/gh/pagejump';

// 				this.axios.get(url).then(res => {
// 					if (res.data.code == 200) {
// 						this.$message({
// 							message: res.data.msg,
// 							type: 'success'
// 						});
// 						this.dialogVisible = false;
// 						this.getBankList();
// 					} else {
// 						this.$message({
// 							message: res.data.msg,
// 							type: 'error'
// 						});
// 					}
// 
// 				}).catch(function(err) {
// 					this.$message({
// 						message: '签约失败',
// 						type: 'error'
// 					});
// 				})


			},


			queryListByPage() {
				let param = {
					data: {

					},
					row: 10,
					page: 1
				};
				this.axios.post('/perTaxToolTwo/dz/customerConfig/queryListByPage', param).then(res => {
					if (res.data.code == 200) {
						this.banknameList1 = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取银行列表失败',
						type: 'error'
					});
				})
			},




			handleEdit1(index, row) {
				this.dialogVisible1 = true;
				this.form1 = JSON.parse(JSON.stringify(row));



			},

			handleDel1(index, row) {
				let param = [
					row.id
				]
				this.axios.post('/perTaxToolTwo/dz/customerConfig/delete', param).then(res => {
					if (res.data.code == 200) {
						this.queryListByPage();
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
						message: '获取银行列表失败',
						type: 'error'
					});
				})
			},
			hideDialog1() {
				this.dialogVisible1 = false;
			},
			handleClose1() {
				this.dialogVisible1 = false;
			},
			compare1() {
				let param = this.form1;
				var url = '/perTaxToolTwo/dz/customerConfig/update';

				this.axios.post(url, param).then(res => {
					if (res.data.code == 200) {
						this.$message({
							message: res.data.msg,
							type: 'success'
						});
						this.dialogVisible1 = false;
						this.queryListByPage();
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '修改失败',
						type: 'error'
					});
				})


			},
		},
		created() {
			this.getBankList();
			// this.queryListByPage();
		}
	}
</script>

<style scoped lang="less">
	.main_contain {
		width: 100%;
		height: 100%;
		padding: 20px;
		box-sizing: border-box;

		.left_contain {
			width: 100%;
			float: left;
			height: 100%
		}

		.right_contain {
			width: calc(50% - 10px);
			float: right;
			height: 100%
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
		height: 2rem;
		padding: 0px 30px;
		background: url(../../assets/img/list-bg1.png) no-repeat;
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
		padding: 0.2rem 0.2rem;
		background: #fff;
		height: calc(100% - 2rem);
		overflow-y: auto;
		box-sizing: border-box;
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
</style>
