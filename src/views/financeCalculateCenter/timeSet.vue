<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>中高端客户时间配置</div>
				<el-form :inline="true" :model="formInline1" class="demo-form-inline" size="mini">
					
				</el-form>
			</div>
			<div class="contain_body">
				<el-table :data="banknameList1" style="width: 100%" stripe border v-loading='loading1'>
					<el-table-column align="center" label="客户类型" prop="customerType" :resizable="false">
						<template slot-scope="scope">
							<span>{{scope.row.customerType == 1?'中高端客户':'普通客户'}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="最大间隔月份" prop="maxMonth" :resizable="false"></el-table-column>
					<el-table-column align="center" label="最大间隔次数" prop="maxNum" :resizable="false"></el-table-column>
					<el-table-column align="center" width="200" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit1(scope.$index, scope.row)">编辑</el-button>
							<el-button size="mini" type="text" @click="handleDel1(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- <el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination> -->
			</div>
		</div>
		<el-dialog title="查看" :visible.sync="dialogVisible1" width="4rem" :before-close="handleClose1">
			<el-form ref="form" :model="form1" label-width="100px" size="mini">
				
				<el-form-item label="最大间隔月份">
					<el-input v-model="form1.maxMonth"></el-input>
				</el-form-item>
				<el-form-item label="最大间隔次数">
					<el-input v-model="form1.maxNum"></el-input>
				</el-form-item>
			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click="compare1">确认</span>
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
			
			queryListByPage() {
				let param = {
					data:{
						
					},
					row:10,
					page:1
				};
				this.axios.post('/perTaxToolTwo/dz/customerConfig/queryListByPage',param).then(res => {
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
				this.axios.post('/perTaxToolTwo/dz/customerConfig/delete',param).then(res => {
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
				var url= '/perTaxToolTwo/dz/customerConfig/update';
				
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
			this.queryListByPage()
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
