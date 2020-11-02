<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>服务项目明细配置</div>
				<el-form :inline="true" :model="formInline1" class="demo-form-inline" size="mini">
					<el-form-item>
						<!-- <el-button @click='search' size="mini">查询</el-button> -->
						<el-button @click='addChild' size="mini">新增</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="contain_body">
				<el-table :data="serviceitem" style="width: 100%" stripe border v-loading='loading1'>
					<el-table-column align="center" label="编号" prop="svritemno" :resizable="false"></el-table-column>

					<el-table-column align="center" label="名称" prop="svritemname" :resizable="false"></el-table-column>
					<el-table-column align="center" label="费用类型" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.costtypeid == 193">代账费</span>
							<span v-if="scope.row.costtypeid == 194">工本费</span>
							<span v-if="scope.row.costtypeid == 195">资料费</span>
							<span v-if="scope.row.costtypeid == 196">服务费</span>
							<span v-if="scope.row.costtypeid == 197">认证费</span>
						</template>
					</el-table-column>


					<el-table-column align="center" label="服务单价" prop="unitsprice" :resizable="false" show-overflow-tooltip></el-table-column>
					<el-table-column align="center" label="服务项目" prop="serviceitemname" :resizable="false" show-overflow-tooltip></el-table-column>
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
			<el-form ref="form" :model="form2" label-width="130px" size="mini">
				<el-form-item label="编号" prop="svritemno" :rules="[$rules.requiredInput]">
					<el-input v-model="form2.svritemno"></el-input>

				</el-form-item>

				<el-form-item label="名称" prop="svritemname" :rules="[$rules.requiredInput]">
					<el-input v-model="form2.svritemname"></el-input>
				</el-form-item>
				<el-form-item label="费用类型" prop="costtypeid" :rules="[$rules.requiredSelect]">
					<el-select v-model='form2.costtypeid' clearable size="mini">
						<el-option v-for='item in costtypeList' :label="item.dicName" :value="item.dicId" :key='item.dicId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="服务单价" prop="unitsprice" :rules="[$rules.requiredInput]">
					<el-input v-model="form2.unitsprice"></el-input>
				</el-form-item>
				<el-form-item label="服务项目" prop="serviceitemid" :rules="[$rules.requiredSelect]">
					<el-select v-model='form2.serviceitemid' clearable size="mini">
						<el-option v-for='item in itemList' :label="item.serviceitem" :value="item.serviceitemid" :key='item.serviceitemid'></el-option>
					</el-select>
				</el-form-item>

			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click="commitAddChild">确认</span>
				<span class='close' @click="hideDialog2">关闭</span>

			</div>

		</el-dialog>

		<el-dialog title="编辑" :visible.sync="dialogVisible3" width="4rem" :before-close="handleClose3">
			<el-form ref="form1" :model="form3" label-width="130px" size="mini">
				<el-form-item label="编号" prop="svritemno" :rules="[$rules.requiredInput]">
					<el-input v-model="form3.svritemno"></el-input>

				</el-form-item>

				<el-form-item label="名称" prop="svritemname" :rules="[$rules.requiredInput]">
					<el-input v-model="form3.svritemname"></el-input>
				</el-form-item>
				<el-form-item label="费用类型" prop="costtypeid" :rules="[$rules.requiredSelect]">
					<el-select v-model='form3.costtypeid' clearable size="mini">
						<el-option v-for='item in costtypeList' :label="item.dicName" :value="item.dicId" :key='item.dicId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="服务单价" prop="unitsprice" :rules="[$rules.requiredInput]">
					<el-input v-model="form3.unitsprice"></el-input>
				</el-form-item>
				<el-form-item label="服务项目" prop="serviceitemid" :rules="[$rules.requiredSelect]">
					<el-select v-model='form3.serviceitemid' clearable size="mini">
						<el-option v-for='item in itemList' :label="item.serviceitem" :value="item.serviceitemid" :key='item.serviceitemid'></el-option>
					</el-select>
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
				costtypeList: [{
						dicId: 193,
						dicName: "代帐费",
					},
					{
						dicId: 194,
						dicName: "工本费",
					},
					{
						dicId: 195,
						dicName: "资料费",
					},
					{
						dicId: 196,
						dicName: "服务费",
					},
					{
						dicId: 197,
						dicName: "认证费",
					}
				],
				itemList:[],
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
				this.axios.post('/perTaxToolTwo/columbusNew/contactSvrItem/queryListByPage', param).then(res => {
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
			
			queryItem() {
				let param = {
					data: {
			
					},
					row: 9999,
					page: 1,
				};
				this.axios.post('/perTaxToolTwo/columbusNew/contactSvrItemConfig/queryListByPage', param).then(res => {
					if (res.data.code == 200) {
						this.itemList = res.data.data;
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
						this.axios.post('/perTaxToolTwo/columbusNew/contactSvrItem/insert', param).then(res => {
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
						this.axios.post('/perTaxToolTwo/columbusNew/contactSvrItem/update', param).then(res => {
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
					}else{
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
						row.svritemid
					]
					this.axios.post('/perTaxToolTwo/columbusNew/contactSvrItem/delete', param).then(res => {
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

			querySvrname() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=198')
					.then(res => {
						if (res.data.code == 200) {
							this.svrnameList = res.data.data;
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

			queryItemname() {
				this.axios.get('/perTaxToolTwo/columbusNew/config/getDicData.do?dicParentId=205')
					.then(res => {
						if (res.data.code == 200) {
							this.itemnameList = res.data.data;
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
		},
		created() {
			this.queryListByPage();
			this.queryItem()
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
