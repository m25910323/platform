<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>合同价格配置</div>
				<el-form :inline="true" :model="formInline1" class="demo-form-inline" size="mini">
					<el-form-item>
						<!-- <el-button @click='search' size="mini">查询</el-button> -->
						<el-button @click='addChild' size="mini">新增</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="contain_body">
				<el-table :data="serviceitem" style="width: 100%" stripe border v-loading='loading1'>
					<el-table-column align="center" label="合同名称" prop="contractname" :resizable="false"></el-table-column>
					<el-table-column align="center" label="合同税务类型" prop="taxtypeid" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.taxtypeid == 232">小规模</span>
							<span v-if="scope.row.taxtypeid == 233">一般纳税人</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="年付单价" prop="price" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="未勾选服务打印是否体现	" prop="isdisplay" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.isdisplay == 0">否</span>
							<span v-if="scope.row.isdisplay == 1">是</span>
						</template>
					</el-table-column> -->

					<el-table-column align="center" label="签约开始时间" prop="starttime" :resizable="false" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" label="签约结束时间" prop="endtime" :resizable="false"></el-table-column>
					<el-table-column align="center" label="季付单价" prop="pricejf" :resizable="false" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" label="半年付单价" prop="pricebnf" :resizable="false"></el-table-column>
					<el-table-column align="center" label="当月已签单数下限" prop="minnumber" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="未勾选服务打印是否体现	" prop="isdisplay" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.isdisplay == 0">否</span>
							<span v-if="scope.row.isdisplay == 1">是</span>
						</template>
					</el-table-column> -->
					
					<!-- <el-table-column align="center" label="签约开始时间" prop="starttime" :resizable="false" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" label="签约结束时间" prop="endtime" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="当月已签单数上限" prop="maxnumber" :resizable="false" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" label="当月允许低价单数" prop="lownumber" :resizable="false"></el-table-column>
					<el-table-column align="center" label="低价下限" prop="minprice" :resizable="false" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" label="低价上限" prop="maxprice" :resizable="false"></el-table-column>
					<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>
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
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>
		</div>


		<el-dialog title="新增" :visible.sync="dialogVisible2" width="4rem" :before-close="handleClose2">
			<el-form ref="form" :model="form2" label-width="140px" size="mini">
				<el-form-item label="合同名称" prop="contractname" :rules="[$rules.requiredInput]">
					<el-input v-model="form2.contractname"></el-input>

				</el-form-item>
				<el-form-item label="合同税务类型" prop="taxtypeid" :rules="[$rules.requiredSelect]">
					<el-select v-model='form2.taxtypeid' clearable size="mini">
						<el-option v-for='item in taxtypeList' :label="item.dicName" :value="item.dicId" :key='item.dicId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="年付单价" prop="price" :rules="[$rules.requiredInput]">
					<el-input v-model="form2.price"></el-input>
				</el-form-item>
				<el-form-item label="签约开始时间" prop="starttime" :rules="[$rules.requiredSelect]">
					<el-date-picker v-model="form2.starttime" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
					 placeholder="请选择开始时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="签约结束时间" prop="endtime" :rules="[$rules.requiredSelect]">
					<el-date-picker v-model="form2.endtime" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择开始时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="季付单价" prop="pricejf" :rules="[$rules.requiredInput]">
					<el-input v-model="form2.pricejf"></el-input>
				</el-form-item>
				<el-form-item label="半年付单价" prop="pricebnf" :rules="[$rules.requiredInput]">
					<el-input v-model="form2.pricebnf"></el-input>
				</el-form-item>
				<el-form-item label="当月已签单数下限" prop="minnumber" :rules="[$rules.requiredInput]">
					<el-input v-model="form2.minnumber"></el-input>
				</el-form-item>
				
				<el-form-item label="当月已签单数上限" prop="maxnumber" :rules="[$rules.requiredInput]">
					<el-input v-model="form2.maxnumber"></el-input>
				</el-form-item>
				<el-form-item label="当月允许低价单数" prop="lownumber" :rules="[$rules.requiredInput]">
					<el-input v-model="form2.lownumber"></el-input>
				</el-form-item>
				<el-form-item label="低价下限" prop="minprice" :rules="[$rules.requiredInput]">
					<el-input v-model="form2.minprice"></el-input>
				</el-form-item>
				<el-form-item label="低价上限" prop="maxprice" :rules="[$rules.requiredInput]">
					<el-input v-model="form2.maxprice"></el-input>
				</el-form-item>
				<el-form-item label="备注">
					<el-input v-model="form2.remark"></el-input>
				</el-form-item>


			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click="commitAddChild">确认</span>
				<span class='close' @click="hideDialog2">关闭</span>

			</div>

		</el-dialog>

		<el-dialog title="编辑" :visible.sync="dialogVisible3" width="4rem" :before-close="handleClose3">
			<el-form ref="form1" :model="form3" label-width="140px" size="mini">
				<el-form-item label="合同名称" prop="contractname" :rules="[$rules.requiredInput]">
					<el-input v-model="form3.contractname"></el-input>
				</el-form-item>
				<el-form-item label="合同税务类型" prop="taxtypeid" :rules="[$rules.requiredSelect]">
					<el-select v-model='form3.taxtypeid' clearable size="mini">
						<el-option v-for='item in taxtypeList' :label="item.dicName" :value="item.dicId" :key='item.dicId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="年付单价" prop="price" :rules="[$rules.requiredInput]">
					<el-input v-model="form3.price"></el-input>
				</el-form-item>
				<el-form-item label="签约开始时间" prop="starttime" :rules="[$rules.requiredSelect]">
					<el-date-picker v-model="form3.starttime" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
					 placeholder="请选择开始时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="签约结束时间" prop="endtime" :rules="[$rules.requiredSelect]">
					<el-date-picker v-model="form3.endtime" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择开始时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="季付单价" prop="pricejf" :rules="[$rules.requiredInput]">
					<el-input v-model="form3.pricejf"></el-input>
				</el-form-item>
				<el-form-item label="半年付单价" prop="pricebnf" :rules="[$rules.requiredInput]">
					<el-input v-model="form3.pricebnf"></el-input>
				</el-form-item>
				<el-form-item label="当月已签单数下限" prop="minnumber" :rules="[$rules.requiredInput]">
					<el-input v-model="form3.minnumber"></el-input>
				</el-form-item>
				
				<el-form-item label="当月已签单数上限" prop="maxnumber" :rules="[$rules.requiredInput]">
					<el-input v-model="form3.maxnumber"></el-input>
				</el-form-item>
				<el-form-item label="当月允许低价单数" prop="lownumber" :rules="[$rules.requiredInput]">
					<el-input v-model="form3.lownumber"></el-input>
				</el-form-item>
				<el-form-item label="低价下限" prop="minprice" :rules="[$rules.requiredInput]">
					<el-input v-model="form3.minprice"></el-input>
				</el-form-item>
				<el-form-item label="低价上限" prop="maxprice" :rules="[$rules.requiredInput]">
					<el-input v-model="form3.maxprice"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="form3.remark"></el-input>
				</el-form-item>


			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click="commitModify">确认</span>
				<span class='close' @click="hideDialog3">关闭</span>

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

				form2: {

				},
				form3: {

				},
				dialogVisible2: false,
				dialogVisible3: false,
				serviceitem: [],
				svrnameList: [],
				itemnameList: [],
				total: 0,
				pageSize: 10,
				currentPage: 1,
				taxtypeList: [{
						dicId: 232,
						dicName: "小规模纳税人",
					},
					{
						dicId: 233,
						dicName: "一般纳税人",
					}
				],
				trueOrFalse: [{
						label: "是",
						value: 1,
					},
					{
						label: "否",
						value: 0,
					}
				]

			}
		},
		components: {},
		methods: {

			queryListByPage() {
				let param = {
					data: {

					},
					row: this.pageSize,
					page: this.currentPage,
				};
				this.axios.post('/perTaxToolTwo/columbusNew/contactPrice/queryListByPage', param).then(res => {
					if (res.data.code == 200) {
						this.serviceitem = res.data.data;
						this.total = res.data.count;
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

			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage();
			},


			reset() {
				this.form2 = {};
				this.form3 = {};
			},


			addChild() {
				this.dialogVisible2 = true;
			},
			commitAddChild() {
				this.$refs['form'].validate((valid) => {
					if (valid) {
						let param = this.form2;
						this.axios.post('/perTaxToolTwo/columbusNew/contactPrice/insert', param).then(res => {
							if (res.data.code == 200) {
								this.queryListByPage();
								this.dialogVisible2 = false;
								this.reset();
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
								message: '新增失败',
								type: 'error'
							});
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				})

			},

			handleEdit1(index, row) {
				this.dialogVisible3 = true;
				this.form3 = JSON.parse(JSON.stringify(row));



			},

			commitModify() {
				this.$refs['form1'].validate((valid) => {
					if (valid) {
						let param = this.form3;
						this.axios.post('/perTaxToolTwo/columbusNew/contactPrice/update', param).then(res => {
							if (res.data.code == 200) {
								this.queryListByPage();
								this.reset();
								this.dialogVisible3 = false;

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
								message: '修改失败',
								type: 'error'
							});
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				})

			},


			handleDel1(index, row) {

				this.$confirm('确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = [
						row.contractconfigid
					]
					this.axios.post('/perTaxToolTwo/columbusNew/contactPrice/delete', param).then(res => {
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

			hideDialog2() {
				this.dialogVisible2 = false;
				this.reset();
			},
			handleClose2() {
				this.dialogVisible2 = false;
				this.reset();
			},

			hideDialog3() {
				this.dialogVisible3 = false;
				this.reset();
			},
			handleClose3() {
				this.dialogVisible3 = false;
				this.reset();
			},


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
