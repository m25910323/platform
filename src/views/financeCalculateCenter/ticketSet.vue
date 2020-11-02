<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>问票配置</div>
				<el-form :inline="true" :model="formInline1" class="demo-form-inline" size="mini" id='cont'>
					<el-form-item label="问票名称:">
						<el-input size="mini" v-model='formInline1.ticketChName' clearable></el-input>
					</el-form-item>
					<el-form-item label="字段级别:">
						<el-select v-model='formInline1.fieldLevel'>
							<el-option v-for='item in fieldLevelList' :label="item.label" :value="item.value" :key='item.value'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click='search' size="mini">查询</el-button>
						<el-button @click='add' size="mini">新增类别</el-button>
						<el-button @click='addQuestion' size="mini">新增题目</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="contain_body">
				<el-table :data="banknameList1" style="width: 100%" stripe border v-show='fieldLevel == 1'>

					<el-table-column align="center" label="类别名称" prop="ticketChName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="字段级别" prop="fieldLevel" :resizable="false">
						<template slot-scope="scope">
							<span v-show='scope.row.fieldLevel == 1'>类别</span>
							<span v-show='scope.row.fieldLevel == 2'>题目</span>
							<span v-show='scope.row.fieldLevel == 3'>答案</span>
						</template>
					</el-table-column>
					<!-- <el-table-column align="center" label="排序" prop="sort" :resizable="false"></el-table-column> -->
					<el-table-column align="center" width="200" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit1(scope.$index, scope.row)">编辑</el-button>
							<el-button size="mini" type="text" @click="handleDel1(scope.$index, scope.row,0)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total" v-show='fieldLevel == 1'>
				</el-pagination>


				<el-table :data="banknameList" style="width: 100%" stripe border v-show='fieldLevel == 2'>

					<el-table-column align="center" label="题目名称" prop="ticketChName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="类别" prop="typeName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="字段级别" prop="fieldLevel" :resizable="false">
						<template slot-scope="scope">
							<span v-show='scope.row.fieldLevel == 2'>题目</span>
							<span v-show='scope.row.fieldLevel == 3'>答案</span>
						</template>
					</el-table-column>
					<!-- <el-table-column align="center" label="排序" prop="sort" :resizable="false"></el-table-column> -->
					<el-table-column align="center" width="200" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
							<el-button size="mini" type="text" @click="handleDel1(scope.$index, scope.row,1)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange1(val)})"
				 :current-page="currentPage1" :page-size="pageSize1" layout="total, prev, pager, next" :total="total1" v-show='fieldLevel == 2'>
				</el-pagination>

			</div>
		</div>
		<el-dialog title="新增题目" :visible.sync="dialogVisible" width="4rem" :before-close="handleClose">
			<el-form ref="form" :model="form" label-width="100px" size="mini">
				<el-form-item label="类型" prop="questionType" :rules="[$rules.requiredSelect]">
					<el-select v-model='form.questionType' clearable>
						<el-option v-for='item in pidList' :label="item.ticketChName" :value="item.ticketConfigId" :key='item.ticketChName'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="题目名称" prop="question" :rules="[$rules.requiredInput]">
					<el-input v-model="form.question"></el-input>
				</el-form-item>
				<el-form-item label="答案" prop="answers">
					<el-tag :key="tag" v-for="tag in dynamicTags" closable :disable-transitions="false" @close="handleCloseTag(tag)">
						{{tag}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" size="small"
					 @keyup.enter.native="handleInputConfirm" @blur="handleInputConfirm">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput" type="primary">新增答案</el-button>
				</el-form-item>

			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click="compare">确认</span>
				<span class='close' @click="hideDialog">关闭</span>

			</div>

		</el-dialog>
		<el-dialog title="修改题目" :visible.sync="dialogVisible1" width="4rem" :before-close="handleClose1">
			<el-form ref="form1" :model="form1" label-width="100px" size="mini">
				<el-form-item label="类型" prop="pid" :rules="[$rules.requiredSelect]">
					<el-select v-model='form1.pid' clearable>
						<el-option v-for='item in pidList' :label="item.ticketChName" :value="item.ticketConfigId" :key='item.ticketChName'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="题目名称" prop="ticketChName" :rules="[$rules.requiredInput]">
					<el-input v-model="form1.ticketChName"></el-input>
				</el-form-item>
				<el-form-item label="答案" prop="answers">
					<el-tag :key="tag" v-for="tag in dynamicTags1" closable :disable-transitions="false" @close="handleCloseTag1(tag)">
						{{tag.ticketChName}}
					</el-tag>
					<el-input class="input-new-tag" v-if="inputVisible1" v-model="inputValue1" ref="saveTagInput1" size="small"
					 @keyup.enter.native="handleInputConfirm1" @blur="handleInputConfirm1">
					</el-input>
					<el-button v-else class="button-new-tag" size="small" @click="showInput1" type="primary">新增答案</el-button>
				</el-form-item>
				<!-- <el-form-item label="排序" prop="sort" :rules="[$rules.requiredInput]">
					<el-input v-model="form1.sort"></el-input>
				</el-form-item> -->
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
				pidList: [],
				formInline1: {
					fieldLevel: 1
				},
				dynamicTags: [],
				inputVisible: false,
				inputValue: '',
				dynamicTags1: [],
				inputVisible1: false,
				inputValue1: '',
				form: {},
				form1: {},
				dialogVisible: false,
				dialogVisible1: false,
				ticketChName: '',
				fieldLevel: 1,
				currentPage: 1,
				pageSize: 10,
				total: 0,
				currentPage1: 1,
				pageSize1: 10,
				total1: 0,
				banknameList1: [],
				banknameList: [],
				fieldLevelList: [{
						label: '类别',
						value: 1
					},
					{
						label: '题目',
						value: 2
					}
				]

			}
		},
		components: {},
		methods: {
			handleCloseTag(tag) {
				this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
			},

			showInput() {
				this.inputVisible = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput.$refs.input.focus();
				});
			},

			handleInputConfirm() {
				let inputValue = this.inputValue;
				if (inputValue) {
					this.dynamicTags.push(inputValue);
				}
				this.inputVisible = false;
				this.inputValue = '';
			},
			
			handleCloseTag1(tag) {
				this.dynamicTags1.splice(this.dynamicTags1.indexOf(tag), 1);
			},
			
			showInput1() {
				this.inputVisible1 = true;
				this.$nextTick(_ => {
					this.$refs.saveTagInput1.$refs.input.focus();
				});
			},
			
			handleInputConfirm1() {
				let inputValue1 = this.inputValue1;
				if (inputValue1) {
					this.dynamicTags1.push({ticketChName:inputValue1});
				}
				this.inputVisible1 = false;
				this.inputValue1 = '';
			},
			
			search() {
				this.ticketChName = this.formInline1.ticketChName;
				this.fieldLevel = this.formInline1.fieldLevel;
				this.queryListByPage(1)
			},
			queryListByPage(currentPage) {
				let param = {
					data: {
						ticketChName: this.ticketChName,
						fieldLevel: this.fieldLevel
					},
					row: this.pageSize,
					page: currentPage
				};
				this.axios.post('/perTaxToolTwo/iocr/ticketConfig/queryListByPage', param).then(res => {
					if (res.data.code == 200) {
						this.banknameList1 = res.data.data;
						this.banknameList = res.data.data;
						this.total1 = res.data.count;
						this.total = res.data.count;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取问票列表失败',
						type: 'error'
					});
				})
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage(this.currentPage);
			},
			handleCurrentChange1(val) {
				this.currentPage1 = val;
				this.queryListByPage(this.currentPage1);
			},
			add() {
				// this.dialogVisible = true;
				this.$prompt('请输入类别名称', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({
					value
				}) => {
					let param = {
						questionTypeName: value,
						type: 1,
					};
					this.axios.post('/perTaxToolTwo/iocr/ticketConfig/insert', param).then(res => {
						if (res.data.code == 200) {
							this.formInline1.fieldLevel = 1;
							this.fieldLevel = 1;
							this.queryListByPage(1);
							this.$message({
								type: 'success',
								message: res.data.msg,
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

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消新增'
					});
				});


			},

			addQuestion() {
				this.dialogVisible = true;
				this.selectAllPid();
			},
			handleEdit(index, row) {
				this.dynamicTags1  = [];
				this.dialogVisible1 = true;
				this.form1 = JSON.parse(JSON.stringify(row));
				this.selectAllPid();
				
				this.queryAnswer(row.ticketConfigId);
				this.modifyId = row.ticketConfigId
			
			},
			queryAnswer(ticketConfigId){
				let param = {
					pid: ticketConfigId,
				};
				this.axios.post('/perTaxToolTwo/iocr/ticketConfig/queryList', param).then(res => {
					if (res.data.code == 200) {
						this.dynamicTags1 = res.data.data;
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
			},
			handleEdit1(index, row) {
				// this.dialogVisible1 = true;
				// this.form1 = JSON.parse(JSON.stringify(row));

				this.$prompt('请输入类别名称', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					inputValue: row.ticketChName
				}).then(({
					value
				}) => {
					let param = {
						ticketChName: value,
						ticketConfigId: row.ticketConfigId,
					};
					this.axios.post('/perTaxToolTwo/iocr/ticketConfig/update', param).then(res => {
						if (res.data.code == 200) {
							this.queryListByPage(1)
							this.$message({
								type: 'success',
								message: res.data.msg,
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

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '取消新增'
					});
				});

			},
			handleDel(index, row) {

			},
			handleDel1(index, row, tag) {
				if (tag == 0) {
					var title = '确认删除此类别及该类别下所有问题和答案?';
				} else {
					var title = '确认删除此问题及该问题下所有答案?';
				}
				this.$confirm(title, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = {
						ticketConfigId: row.ticketConfigId
					}
					this.axios.post('/perTaxToolTwo/iocr/ticketConfig/deleteType', param).then(res => {
						if (res.data.code == 200) {
							this.queryListByPage(1);
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
							message: '删除问票失败',
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
				this.form = {};
			},
			handleClose() {
				this.dialogVisible = false;
				this.form = {};
			},
			hideDialog1() {
				this.dialogVisible1 = false;
				this.form1 = {};
			},
			handleClose1() {
				this.dialogVisible1 = false;
				this.form1 = {};
			},
			compare() {
				this.$refs['form'].validate((valid) => {
					if (valid) {
						let param = {
							type: 2,
							questionType: this.form.questionType,
							question: this.form.question,
							answers: this.dynamicTags
						}
						var url = '/perTaxToolTwo/iocr/ticketConfig/insert';

						this.axios.post(url, param).then(res => {
							if (res.data.code == 200) {
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
								this.dialogVisible = false;
								this.formInline1.fieldLevel = 2;
								this.fieldLevel = 2;
								this.queryListByPage(1);
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
			compare1() {
				this.$refs['form1'].validate((valid) => {
					if (valid) {
						// let param = this.form1;
						let param = {
							questionId:this.modifyId,
							"type":this.form1.pid,
							"questionContent":this.form1.ticketChName,
							"answers":this.dynamicTags1
						};
						var url = '/perTaxToolTwo/iocr/ticketConfig/updateQuestion';

						this.axios.post(url, param).then(res => {
							if (res.data.code == 200) {
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
								this.dialogVisible1 = false;
								this.queryListByPage(this.currentPage1);
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
			selectAllPid() {
				let params = {};
				this.axios.post('/perTaxToolTwo/iocr/ticketConfig/selectAllPid', params).then(res => {
					if (res.data.code == 200) {
						this.pidList = res.data.data;

					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取大类失败',
						type: 'error'
					});
				})
			}
		},
		created() {
			this.queryListByPage(1);
			//查询所有大类
			// this.selectAllPid();
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

		/deep/ .el-form-item:last-of-type .el-form-item__content {
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


	.el-tag {
		margin-right: 10px;
		margin-bottom: 6px;
		width: 180px;
	}

	.button-new-tag {
		// margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}

	.input-new-tag {
		width: 90px;
		// margin-left: 10px;
		vertical-align: bottom;
	}
</style>
