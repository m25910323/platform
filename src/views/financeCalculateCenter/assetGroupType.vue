<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>固定资产管理</el-breadcrumb-item>
			<el-breadcrumb-item>固定资产类别</el-breadcrumb-item>
		</el-breadcrumb>

		<div class='main_contain'>

			<el-select v-model="uploadData.fBrNo" placeholder="请选择公司名称" clearable filterable @change='setfBrNo' size="mini">
				<!-- <el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option> -->
				<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option>
			</el-select>
			<el-button type="primary" size="mini" @click="handleAdd" style="float: right;">新增</el-button>
			<el-table :data="detail" style="width: 100%;margin-top: 12px;" stripe border>
				<el-table-column align="center" label="固定资产类别编号" prop="fnumber" :resizable="false"></el-table-column>
				<el-table-column align="center" label="固定资产类别名称" prop="fname" :resizable="false"></el-table-column>
				<el-table-column align="center" :resizable="false">
					<template slot="header" slot-scope="scope">
						<span>操作</span>
					</template>
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click.stop="handleEdit(scope.$index, scope.row)">编辑</el-button>
						<el-button size="mini" type="text" @click.stop="handleDel(scope.$index, scope.row)">删除</el-button>

					</template>
				</el-table-column>


			</el-table>
			<!-- <el-pagination background layout="total,prev, pager, next, jumper" :total="total" :page-size=10 @current-change='handleCurrentChange'
			 :current-page="currentPage">
			</el-pagination> -->
		</div>

		<el-dialog title="新增" :visible.sync="dialogVisible" width="4rem" style="min-width:250px">
			<el-form :model="form" size="mini" label-width="100px" ref="ruleForm">
				<el-form-item label="公司名称" prop="dicName">
					<el-input v-model="form.fbrno" disabled></el-input>
				</el-form-item>
				<el-form-item label="名称" prop="fname" :rules="[$rules.requiredInput]">
					<el-input v-model="form.fname"></el-input>
				</el-form-item>
				<el-form-item label="数值" prop="fnumber" :rules="[$rules.requiredInput]">
					<el-input type='number' v-model="form.fnumber"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog('ruleForm')">关 闭</el-button>
				<el-button type="primary" @click="commitDialog('ruleForm')">确 定</el-button>
			</span>
		</el-dialog>
		
		<el-dialog title="修改" :visible.sync="dialogVisible1" width="4rem" style="min-width:250px">
			<el-form :model="form1" size="mini" label-width="100px" ref="ruleForm1">
				<el-form-item label="公司名称" prop="dicName">
					<el-input v-model="form1.fbrno" disabled></el-input>
				</el-form-item>
				<el-form-item label="名称" prop="fname" :rules="[$rules.requiredInput]">
					<el-input v-model="form1.fname"></el-input>
				</el-form-item>
				<el-form-item label="数值" prop="fnumber" :rules="[$rules.requiredInput]">
					<el-input type='number' v-model="form1.fnumber"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog1('ruleForm1')">关 闭</el-button>
				<el-button type="primary" @click="commitDialog1('ruleForm1')">确 定</el-button>
			</span>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				fBrNo: '',
				detail: [],
				dialogVisible: false,
				dialogVisible1: false,
				uploadData: {},
				total: 0,
				currentPage: 1,
				pageSize: 10,
				form: {},
				form1: {},
			}
		},
		components: {},
		methods: {
			handleCurrentChange(val) {
				this.currentPage = val;
				// this.queryPage(this.accountPeriod, this.customerId);
			},
			setfBrNo(val) {
				if (val) {
					this.fBrNo = val;
					this.getAssetGroups()
				}

			},
			getAssetGroups() {
				let params = {
					"fBrNo": this.fBrNo
				}
				this.axios.post('/perTaxToolTwo/e9/tfagroup/getAssetGroups', this.qs.stringify(params))
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.detail = res.data.data;
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
			reset() {
				this.form.fname = '';
				this.form.fnumber = '';
				this.form1 = {};
			},
			handleAdd() {
				if (this.fBrNo) {
					this.dialogVisible = true;
					this.form.fbrno = this.fBrNo;
				} else {
					this.$message({
						message: '请选择公司名称',
						type: 'warning'
					});
				}

			},
			handleEdit(index, row) {
				this.form1 = JSON.parse(JSON.stringify(row));
				this.dialogVisible1 = true;
			},
			handleDel(index, row) {
				this.$confirm('确认删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"fbrno": row.fbrno,
						"fnumber": row.fnumber,
					}
					this.axios.post('/perTaxToolTwo/e9/tfagroup/deleteAssetGroup', params)
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							if (res.data.code == 200) {
								this.getAssetGroups();
								this.$message({
									type: 'success',
									message: res.data.msg
								});
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
					
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			commitDialog(formName) {
				this.$refs['ruleForm'].validate((valid) => {
					if (valid) {
						let formData = this.form;
						this.axios
							.post("/perTaxToolTwo/e9/tfagroup/saveAssetGroup", formData)
							.then(res => { //手动上传貌似无法触发成功或失败的钩子函数，因此这里手动调用 
								if (res.data.code == 200) {
									this.reset();
									this.getAssetGroups();
									this.dialogVisible = false;

									this.$message({
										message: res.data.msg,
										type: 'success'
									});
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
							}).catch(err => {

								this.$message({
									message: "系统繁忙，请稍后重试",
									type: "error"
								});
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			
			commitDialog1(formName) {
				this.$refs['ruleForm1'].validate((valid) => {
					if (valid) {
						let formData = this.form1;
						this.axios
							.post("/perTaxToolTwo/e9/tfagroup/updateAssetGroup", formData)
							.then(res => { //手动上传貌似无法触发成功或失败的钩子函数，因此这里手动调用 
								if (res.data.code == 200) {
									this.reset();
									this.getAssetGroups();
									this.dialogVisible1 = false;
			
									this.$message({
										message: res.data.msg,
										type: 'success'
									});
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
							}).catch(err => {
			
								this.$message({
									message: "系统繁忙，请稍后重试",
									type: "error"
								});
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				})
			},
			
			hideDialog() {
				this.reset();
				this.dialogVisible = false;
			},
			hideDialog1() {
				this.reset();
				this.dialogVisible1 = false;
			},


		},
		computed: {},
		watch: {

		},
		created() {
			//档案类别
			// this.getAssetGroups()


		}
	}
</script>

<style lang='less' scoped>
	.main {
		/* background: #fff; */
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		.el-breadcrumb {
			height: 30px;
			line-height: 29px;
			padding-left: 20px;
			/* background-color: #fff; */
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box
		}

		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 40px;
			background-color: #ebf6fb;
		}

		/deep/ .el-table th {
			background-color: #ebf6fb;
		}

		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #ebf6fb;
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

		.search_contain {
			background: #fff;
			height: 40px;
			padding-left: 20px;
			padding-top: 12px;
			margin: 10px 20px;

			.info {
				height: 40px;
				line-height: 40px;
			}

			a {
				margin-left: 10px;
			}
		}

		.main_contain {
			background: #fff;
			margin: 0 20px 20px;
			padding: 20px 20px;
			/* height: calc(100% - 190px); */

			h5 {
				height: 40px;
				line-height: 40px;
			}

			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}

			.card_contain {
				display: flex;
				flex-direction: row;
				justify-content: space-between;
				flex-wrap: wrap
			}

			.card {
				width: calc(50% - 6px);
				height: 260px;
				/* float: left; */
				background-color: #fff;
				margin-bottom: 12px;

				h4 {
					height: 40px;
					line-height: 40px;
					background-color: rgb(125, 195, 109);
					color: #fff;
					text-indent: 12px;
				}

				label {
					color: #999;
				}

				ul {
					padding: 10px 0px;
				}

				li {
					height: 30px;
					/* line-height:30px; */
					padding-left: 20px;

					span:nth-of-type(2n) {
						height: 24px;
						line-height: 30px;
						display: inline-block;
						width: 120px;
						float: left;
						border-bottom: 1px solid rgb(167, 167, 167);
						text-indent: 12px;
						color: #333
					}

					span:nth-of-type(2n+1) {
						height: 30px;
						line-height: 30px;
						color: rgb(167, 167, 167);
						display: inline-block;
						width: 80px;
						float: left;
						text-align: justify;
						margin-right: 12px;
					}

					span:nth-of-type(2n+1):after {
						content: "";
						display: inline-block;
						width: 100%;
					}
				}
			}
		}
	}
</style>
