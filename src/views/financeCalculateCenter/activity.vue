<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>合同活动配置</div>
				<el-form :inline="true" :model="formInline1" class="demo-form-inline" size="mini">
					<el-form-item style='width: 250px;'>
						<!-- <el-button @click='search' size="mini">查询</el-button> -->
						<el-button @click='add' size="mini">新增主活动</el-button>
						<el-button @click='addChild' size="mini">新增子活动</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="contain_body">
				<el-table :data="activityList" style="width: 100%" stripe border v-loading='loading1'>
					<el-table-column align="center" label="活动名称" prop="remark" :resizable="false"></el-table-column>
					<el-table-column align="center" label="最低价格" prop="minprice" :resizable="false"></el-table-column>
					<el-table-column align="center" label="最高价格" prop="maxprice" :resizable="false"></el-table-column>
					<el-table-column align="center" label="开始时间" prop="starttime" :resizable="false"></el-table-column>
					<el-table-column align="center" label="结束时间	" prop="endtime" :resizable="false"></el-table-column>
					<el-table-column align="center" label="状态" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.state == 0">无效</span>
							<span v-if="scope.row.state == 1">有效</span>
						</template>
					</el-table-column>
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

		<el-dialog title="新增" :visible.sync="dialogVisible" width="4rem" :before-close="handleClose">
			<el-form ref="form" :model="form" label-width="100px" size="mini">
				<el-form-item label="活动名称" prop="remark" :rules="[$rules.requiredInput]">
					<el-input v-model="form.remark"></el-input>
				</el-form-item>
				<el-form-item label="最低价格" :rules="[$rules.requiredInput]" prop="minprice">
					<el-input v-model="form.minprice"></el-input>
				</el-form-item>
				<el-form-item label="最高价格" :rules="[$rules.requiredInput]" prop="maxprice">
					<el-input v-model="form.maxprice"></el-input>
				</el-form-item>
				<el-form-item label="开始时间" :rules="[$rules.requiredSelect]" prop="starttime">
					<el-date-picker v-model="form.starttime" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择开始时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" :rules="[$rules.requiredSelect]" prop="endtime">
					<el-date-picker v-model="form.endtime" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择结束时间"></el-date-picker>
				</el-form-item>
			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click="commitAdd">确认</span>
				<span class='close' @click="hideDialog">关闭</span>

			</div>

		</el-dialog>


		<el-dialog title="新增" :visible.sync="dialogVisible2" width="4rem" :before-close="handleClose2">
			<el-form ref="form1" :model="form2" label-width="100px" size="mini">
				<el-form-item label="主活动名称" :rules="[$rules.requiredSelect]" prop="taxtypeid">
					<el-select v-model='form2.taxtypeid' clearable size="mini">
						<el-option v-for='item in activityDropList' :label="item.remark" :value="item.activitygroupid" :key='item.activitygroupid'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="子活动名称" :rules="[$rules.requiredInput]" prop="remark">
					<el-input v-model="form2.remark"></el-input>
				</el-form-item>
				<el-form-item label="最低价格" :rules="[$rules.requiredInput]" prop="minprice">
					<el-input v-model="form2.minprice"></el-input>
				</el-form-item>
				<el-form-item label="最高价格" :rules="[$rules.requiredInput]" prop="maxprice">
					<el-input v-model="form2.maxprice"></el-input>
				</el-form-item>
				<el-form-item label="开始时间" :rules="[$rules.requiredSelect]" prop="starttime">
					<el-date-picker v-model="form2.starttime" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd"
					 placeholder="请选择开始时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" :rules="[$rules.requiredSelect]" prop="endtime">
					<el-date-picker v-model="form2.endtime" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择结束时间"></el-date-picker>
				</el-form-item>
			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click="commitAddChild">确认</span>
				<span class='close' @click="hideDialog2">关闭</span>

			</div>

		</el-dialog>
		
		<el-dialog title="修改" :visible.sync="dialogVisible1" width="4rem" :before-close="hideUpdate">
			<el-form ref="form2" :model="form1" label-width="100px" size="mini">
				<el-form-item label="活动名称" prop="remark" :rules="[$rules.requiredInput]">
					<el-input v-model="form1.remark"></el-input>
				</el-form-item>
				<el-form-item label="最低价格" :rules="[$rules.requiredInput]" prop="minprice">
					<el-input v-model="form1.minprice"></el-input>
				</el-form-item>
				<el-form-item label="最高价格" :rules="[$rules.requiredInput]" prop="maxprice">
					<el-input v-model="form1.maxprice"></el-input>
				</el-form-item>
				<el-form-item label="开始时间" :rules="[$rules.requiredSelect]" prop="starttime">
					<el-date-picker v-model="form1.starttime" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择开始时间"></el-date-picker>
				</el-form-item>
				<el-form-item label="结束时间" :rules="[$rules.requiredSelect]" prop="endtime">
					<el-date-picker v-model="form1.endtime" type="datetime" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="请选择结束时间"></el-date-picker>
				</el-form-item>
			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click="commitUpdate">确认</span>
				<span class='close' @click="hideUpdate">关闭</span>
		
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
				form: {},
				form1: {},
				form2: {

				},
				dialogVisible: false,
				dialogVisible1: false,
				dialogVisible2: false,

				activityList: [],
				activityDropList: [],
				total: 0,
				pageSize: 10,
				currentPage: 1

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
				this.axios.post('/perTaxToolTwo/columbusNew/contactActivityGroupConfig/queryListByPage', param).then(res => {
					if (res.data.code == 200) {
						this.activityList = res.data.data;
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


			add() {
				this.dialogVisible = true;
			},
			commitAdd() {
				this.$refs['form'].validate((valid) => {
					if (valid) {
						let param = this.form;
						this.axios.post('/perTaxToolTwo/columbusNew/contactActivityGroupConfig/insert', param).then(res => {
							if (res.data.code == 200) {
								this.queryListByPage();
								this.dialogVisible = false;
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
			
			commitUpdate(){
				this.$refs['form2'].validate((valid) => {
					if (valid) {
						let param = this.form1;
						this.axios.post('/perTaxToolTwo/columbusNew/contactActivityGroupConfig/update', param).then(res => {
							if (res.data.code == 200) {
								this.queryListByPage();
								this.dialogVisible1 = false;
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
			reset() {
				this.form = {};
				this.form1 = {};
				this.form2 = {};
			},


			addChild() {
				this.dialogVisible2 = true;
			},
			commitAddChild() {
				this.$refs['form1'].validate((valid) => {
					if (valid) {
						let param = this.form2;
						this.axios.post('/perTaxToolTwo/columbusNew/contactActivityGroupConfig/insert', param).then(res => {
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
				this.dialogVisible1 = true;
				this.form1 = JSON.parse(JSON.stringify(row));



			},

			handleDel1(index, row) {

				this.$confirm('确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = [
						row.activitygroupid
					]
					this.axios.post('/perTaxToolTwo/columbusNew/contactActivityGroupConfig/delete', param).then(res => {
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
			hideDialog() {
				this.dialogVisible = false;
				this.reset();
			},
			handleClose() {
				this.dialogVisible = false;
				this.reset();
			},
			hideDialog2() {
				this.dialogVisible2 = false;
				this.reset();
			},
			handleClose2() {
				this.dialogVisible2 = false;
				this.reset();
			},
			hideUpdate(){
				this.dialogVisible1 = false;
				this.reset();
			},
			queryActivityDropList() {
				this.axios.get('/perTaxToolTwo/columbusNew/contactActivityGroupConfig/getPidActivity').then(res => {
					if (res.data.code == 200) {
						this.activityDropList = res.data.data;

					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取活动下拉列表失败',
						type: 'error'
					});
				})
			},
		},
		created() {
			this.queryListByPage();
			this.queryActivityDropList();
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

		/deep/ .el-form-item__content {
			width: 250px;
		}

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
