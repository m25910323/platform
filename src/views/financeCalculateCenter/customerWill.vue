<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>银行对账确认</div>
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
					<el-form-item label="客户名称:">
						<el-input v-model="formInline.customername" clearable></el-input>
					</el-form-item>
					<el-form-item label="客户意愿:">
						<el-select v-model='formInline.remark1' clearable>
							<el-option v-for='item in optionList' :label="item.label" :value="item.value" :key='item.label'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click='search' size="mini">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="contain_body">
				<el-table :data="banknameList" style="width: 100%" stripe border v-loading='loading'>
					<!-- <el-table-column type="selection" width="50"></el-table-column> -->

					<el-table-column align="center" label="客户名称" prop="customername" :resizable="false"></el-table-column>
					
					<el-table-column align="center" label="客户意愿" prop="remark1" :resizable="false">
						<template slot-scope="scope">
							<span v-show="scope.row.remark1 == 1">有需求</span>
							<span v-show="scope.row.remark1 == 2">没有需求</span>
							<span v-show="scope.row.remark1 == 3">需求不明确</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="联系方式" prop="insurephone" :resizable="false"></el-table-column>
					<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>
					<el-table-column align="center" label="是否新客户" prop="endPeriod" :resizable="false">
						<template slot-scope="scope">
							<span v-show="scope.row.remark2 == 1">是</span>
							<span v-show="scope.row.remark2 != 1">否</span>
						</template>
					</el-table-column>
					<el-table-column align="center" width="200" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">同意不对账</el-button>
							<el-button size="mini" type="text" @click="handleAgree(scope.$index, scope.row)">同意对账</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>
		</div>
		<el-dialog title="同意不对账" :visible.sync="dialogVisible" width="4rem" :before-close="handleClose">
			<el-form ref="form" :model="form" label-width="80px" size="mini">
				<el-form-item label="联系方式">
					<el-select v-model="form.insureType" placeholder="请选择联系方式">
						<el-option label="手机" value="2"></el-option>
						<el-option label="电话" value="1"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="联系号码">
					<el-input v-model="form.insurePhone"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input type='textarea' v-model="form.remark"></el-input>
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
				activeName: "first",
				loading: false,
				formInline: {
					bankname: '',
					insurePhone: ''
				},
				bankname: '',
				customername: '',
				remark:'',
				form: {
					insureType: "2",
					typecode: '',
					remark: ''
				},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],

				dialogVisible: false,
				isCompare: false,

				value: '',
				banknameList: [],
				optionList:[
					{
						label:"有需求",
						value:1
					},
					{
						label:"没有需求",
						value:2
					},
					{
						label:"需求不明确",
						value:3
					},
				]


			}
		},
		components: {},
		methods: {
			getBankList() {
				let param = {
					data: {
						remark1:this.remark1,
						customername:this.customername
					},
					row: 10,
					page: this.currentPage
				};
				this.axios.post('/perTaxToolTwo/dz/dzDealController/queryListCustomer', param).then(res => {
					if (res.data.code == 200) {
						this.total = res.data.count;
						this.banknameList = res.data.data;
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

			search() {
				
				this.remark1 = this.formInline.remark1;
				this.customername = this.formInline.customername;
				this.currentPage = 1;
				this.getBankList()
			},
			add() {
				this.tag = 0;
				this.dialogVisible = true;
			},
			handleCancel(index, row) {
				this.axios.get('/perTaxToolTwo/dz/dzDealController/cancelTask?id=' + row.id).then(res => {
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
			handleEdit(index, row) {
				this.dialogVisible = true;
				this.id = row.id;
			},

			handleAgree(index, row) {
				let param = {
					remark1: 1,
					id: row.id
				};
				this.axios.post('/perTaxToolTwo/dz/dzDealController/updateCustomerState', param).then(res => {
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
						message: '操作失败',
						type: 'error'
					});
				})
			},
			hideDialog() {
				this.dialogVisible = false;
				this.form = {
					insureType: '',
					typecode: '',
					remark:''
				}
			},
			handleClose() {
				this.dialogVisible = false;
				this.form = {
					insureType: '',
					typecode: '',
					remark:''
				}
			},
			handleClick(tab, event) {
				this.isCompare = false;
				console.log(tab, event);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getBankList()
			},
			preview(formName) {},
			compare() {
				let param = {
					insuretype: this.form.insureType,
					remark1: 2,
					id: this.id,
					remark: this.form.remark,
					insurephone: this.form.insurePhone,
				};
				this.axios.post('/perTaxToolTwo/dz/dzDealController/updateCustomerState', param).then(res => {
					if (res.data.code == 200) {
						this.getBankList();
						this.dialogVisible = false;
						this.form = {
							insureType: '',
							typecode: '',
							remark: ''
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
						message: '获取银行列表失败',
						type: 'error'
					});
				})

			},
		},
		created() {
			// this.queryListByPage();
			this.getBankList()
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
