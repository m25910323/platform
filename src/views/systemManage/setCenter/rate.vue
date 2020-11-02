<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<span class='title'>税率配置</span>
				<el-button class='right' @click='addRate' size="mini">新增税率</el-button>
			</div>
			<div class="contain_body">
				<!-- <el-button class='muldel' type="danger" size='mini' icon="el-icon-delete" :disabled="canDel" @click='deleteMulti' style='margin-bottom: 0.2rem;'>批量删除</el-button> -->
				<!-- <el-table :data="rateList" style="width: 100%" stripe border ref="table" @selection-change="deleteMultiRow"> -->
				<el-table :data="rateList" style="width: 100%" stripe border ref="table">
					<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
					<el-table-column align="center" label="税率显示名称" prop="ratesShowName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="税率" :resizable="false">
						<template slot-scope="scope">
							<div v-text='scope.row.taxesRate'></div>
							<!-- <div contenteditable='true' v-text='scope.row.taxesRate' @blur="setLine($event,scope.row,'taxesRate')"></div> -->
						</template>
					</el-table-column>
					<!-- <el-table-column align="center" label="操作" :resizable="false">
						<template slot-scope="scope">
							<el-button @click="deleteRow(scope.row)" type="text" size="small">
								删除
							</el-button>
						</template>
					</el-table-column> -->
				</el-table>
			</div>
		</div>
		<div class="right_contain">
			<div class="contain_header">
				<el-input placeholder="搜索发票" prefix-icon="el-icon-search" v-model='filter' v-on:keyup.enter.native="submit" size="mini"></el-input>
				<span class='title'>发票税率关联配置</span>
			</div>
			<div class="contain_body">
				<el-button class='muldel' type="primary" size='mini' icon="el-icon-edit" :disabled="canEidt" @click='modifyMulti' style='margin-bottom: 0.2rem;'>批量编辑</el-button>
				<el-table :data="invoiceList" style="width: 100%" stripe border  @selection-change="modifyMultiRow">
					<el-table-column align="center" type="selection" width="55"></el-table-column>
					<el-table-column align="center" label="发票名称" prop="invoiceName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="发票分类" prop="invoiceCategory" :resizable="false"></el-table-column>
					<el-table-column align="center" label="发票类型" prop="invoiceType" :resizable="false"></el-table-column>
					<el-table-column align="center" label="区域代码" prop="area" :resizable="false"></el-table-column>
					<el-table-column align="center" label="计税方式" :resizable="false">
						<template slot-scope="scope">
							<!-- <span>{{scope.row.taxCalcType == 1?'一般计税':'简易征收计税'}}</span> -->
							<span>{{taxCalcType[scope.row.taxCalcType]}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作" prop="roleId" :resizable="false">
						<template slot-scope="scope">
							<el-button type='text' size="mini" @click='showDialog(scope.row)'>
								编辑</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background layout="prev, pager, next" :total="total" :page-size=pageSize @current-change='handleCurrentChange'
				 :current-page="currentPage">
				</el-pagination>
			</div>
		</div>
		<el-dialog title="新增税率" :visible.sync="dialogVisible" width="4rem" style="min-width:250px">
			<el-form :model="form" size="mini" label-width="120px" :rules='rules' ref="ruleForm">
				<el-form-item label="税费标题" prop="taxesName">
					<!-- <el-input v-model="form.taxesTitle"></el-input> -->
					<el-select v-model="form.tem" placeholder="请选择" @change='setTaxesTitle' value-key="taxesName">
						<el-option v-for="item in taxesList" :key="item.value" :label="item.taxesTitle" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="税率显示名称" prop="ratesShowName">
					<el-input v-model="form.ratesShowName"></el-input>
				</el-form-item>
				<el-form-item label="税率" prop="taxesRate">
					<el-input v-model="form.taxesRate"></el-input>
				</el-form-item>
			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click="commitDialog('ruleForm')">完成</span>
				<span class='close' @click="hideDialog('ruleForm')">关闭</span>
			</div>
		</el-dialog>
		<el-dialog title="" :visible.sync="dialogTableVisible" width="8rem">
			<el-tabs v-model="activeName" type="card" @tab-click="handleClick">
				<el-tab-pane v-for='(item,index) in dicNameList' :label="item.dicName" :name="item.dicValue">
					<el-table :data="rateList" row-key='ratesId' border stripe @selection-change="((val)=>{handleSelectionChange(val,index)})"
					 ref='multipleTable'>
						<el-table-column align="center" type="selection" width="55"></el-table-column>
						<el-table-column align="center" property="ratesShowName" label="税率显示名称"></el-table-column>
						<el-table-column align="center" property="taxesRate" label="税率"></el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
				<el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
				<el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
				<el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane> -->
			</el-tabs>
			<!-- <el-select v-model='tmplType' clearable>
				<el-option v-for='item in dicNameList' :label="item.dicName" :value="item.dicValue"></el-option>
			</el-select> -->

			<div class='btn_contain clearfix'>
				<span class='commit' @click='modifyRate'>完成</span>
				<span class='close' @click="hideDialog1">关闭</span>
			</div>
		</el-dialog>
		
		<!-- 批量修改 -->
		<el-dialog title="" :visible.sync="dialogMulTableVisible" width="8rem">
			<el-tabs v-model="activeName1" type="card" @tab-click="handleClick">
				<el-tab-pane v-for='(item,index) in dicNameList' :label="item.dicName" :name="item.dicValue">
					<el-table :data="rateList" row-key='ratesId' border stripe @selection-change="((val)=>{handleSelectionChange1(val,index)})"
					 ref='multipleTable1'>
						<el-table-column align="center" type="selection" width="55"></el-table-column>
						<el-table-column align="center" property="ratesShowName" label="税率显示名称"></el-table-column>
						<el-table-column align="center" property="taxesRate" label="税率"></el-table-column>
					</el-table>
				</el-tab-pane>
				<!-- <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
				<el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
				<el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
				<el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane> -->
			</el-tabs>
			<!-- <el-select v-model='tmplType' clearable>
				<el-option v-for='item in dicNameList' :label="item.dicName" :value="item.dicValue"></el-option>
			</el-select> -->
		
			<div class='btn_contain clearfix'>
				<span class='commit' @click='modifyRate2'>完成</span>
				<span class='close' @click="hideDialog2">关闭</span>
			</div>
		</el-dialog>
		
	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			var validatePass2 = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入税率'));
				} else if (/^(0\.\d+|0|1)$/.test(value) == false) {
					callback(new Error('税率在0-1之间!'));
				} else {
					callback();
				}
			};
			return {
				activeName: 'first',
				activeName1: 'first',
				tmplType: '',
				message: "12334456",
				rateList: [],
				multipleSelection: [],
				multipleSelection1:[],
				multipleSelection2:[],
				queryName: '',
				dialogVisible: false,
				dialogTableVisible: false,
				dialogMulTableVisible: false,
				form: {
					ratesShowName: '',
					taxesName: '',
					taxesTitle: '',
					taxesRate: '',
					tem: ''
				},
				filter: '',
				invoiceList: [],
				total: 0,
				currentPage: 1,
				pageSize: 10,
				url: '',
				invoiceId: '',
				rules: {
					taxesName: [{
						required: true,
						message: '请选择税费标题',
						trigger: 'change'
					}],
					taxesRate: [{
						validator: validatePass2,
						trigger: 'blur',
						required: true,
					}],
					ratesShowName: [{
						required: true,
						message: '请输入税率显示名称',
						trigger: 'blur'
					}],
				},
				taxesList: [],
				canDel:true,
				canEidt:true,
				multiRow:[],
				invoiceIdList:[],
				taxCalcType:[
					'','一般计税','简易征收计税','免税计税','2020减负征收','销售一般货物（9%）'
				]
			}
		},
		components: {},
		methods: {
			queryDicName() {
				this.axios.post('/perTaxToolTwo/e9z/configDictionary/findDictionayList?dicName=税务类型').then(res => {
						if (res.data.code == 200) {
							this.dicNameList = res.data.data;
							this.activeName = this.dicNameList[0].dicValue;
							this.activeName1 = this.dicNameList[0].dicValue;
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
			queryRate() {
				let params = {};
				this.axios.post('/perTaxToolTwo/e9z/configTaxes/selectTaxesWithRate', params)
					.then(res => {
						if (res.data.code == 200) {
							this.rateList = res.data.data;
							// this.total = 
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
			addRate() {
				this.dialogVisible = true;
				this.queryTaxesList();
			},
			setTaxesTitle(value) {
				console.log(value);
				this.form.taxesTitle = value.taxesTitle;
				this.form.taxesName = value.taxesName;
			},
			deleteMultiRow(val){
				this.multiRow = val;
			},
			deleteMulti(){
				this.$confirm('确定批量删除选中的税率?', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = this.multiRow;
					this.axios.post('/perTaxToolTwo/e9z/configTaxesRates/deleteTaxesRateList', params)
						.then(res => {
							if (res.data.code == 200) {
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
								this.queryRate();
								// this.total = 
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
			deleteRow(row) {
				this.$confirm('确定删除此条税率?', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = [{
						"ratesId": row.ratesId
					}];
					this.axios.post('/perTaxToolTwo/e9z/configTaxesRates/deleteTaxesRateList', params)
						.then(res => {
							if (res.data.code == 200) {
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
								this.queryRate();
								// this.total = 
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
			queryTaxesList() {
				let params = {};
				this.axios.post('/perTaxToolTwo/e9z/configTaxes/selectAllTaxesTitle', params)
					.then(res => {
						if (res.data.code == 200) {
							this.taxesList = res.data.data;
							// this.total = 
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
			hideDialog(formName) {
				this.$refs[formName].resetFields();
				this.dialogVisible = false;
				this.form = {
					taxesName: '',
					taxesTitle: '',
					taxesRate: '',
					ratesShowName: '',
					tem: ''
				}
			},
			commitDialog(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let params = this.form;
						this.axios.post('/perTaxToolTwo/e9z/configTaxes/insertOrUpdateTaxesAndRate', params)
							.then(res => {
								this.dialogVisible = false;
								this.form = {
									taxesName: '',
									taxesTitle: '',
									taxesRate: '',
									ratesShowName: '',
									tem: ''
								}
								if (res.data.code == 200) {
									this.queryRate();
									this.$message({
										message: res.data.msg,
										type: 'success'
									});
									// this.total = 
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
							}).catch(function(err) {
								this.dialogVisible = false;
								this.form = {
									taxesName: '',
									taxesTitle: '',
									taxesRate: '',
									ratesShowName: '',
									tem: ''
								}
								this.$message({
									message: "系统繁忙，请稍后重试",
									type: "error"
								});
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			setLine(event, row, name) {
				if (event.target.innerText != row.taxesRate) {
					let params = {
						"ratesId": row.ratesId,
						"taxesId": row.taxesId,
						"taxesRate": event.target.innerText,
					};
					this.axios.post('/perTaxToolTwo/e9z/configTaxesRates/insertOrUpdateTaxesRate', params)
						.then(res => {
							if (res.data.code == 200) {
								this.queryRate();
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
								// this.total = 
							} else {
								this.queryRate();
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
						}).catch(function(err) {
							this.queryRate();
							this.$message({
								message: "系统繁忙，请稍后重试",
								type: "error"
							});
						})
				}
			},
			submit() {
				this.queryName = this.filter;
				this.queryInvoice()
			},
			queryInvoice() {
				if (this.queryName != '') {
					this.url = '/perTaxToolTwo/e9z/invoiceInfo/findInvoiceInfoList?currentPage=' + this.currentPage + '&pageCount=' +
						this.pageSize + '&queryName=' + this.queryName;
				} else {
					this.url = '/perTaxToolTwo/e9z/invoiceInfo/findInvoiceInfoList?currentPage=' + this.currentPage + '&pageCount=' +
						this.pageSize;
				}
				this.axios.post(this.url)
					.then(res => {
						if (res.data.code == 200) {
							this.total = res.data.data.total;
							this.invoiceList = res.data.data.list;
							// this.$message({
							// 	message: res.data.msg,
							// 	type: 'success'
							// });
							// this.total = 
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
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryInvoice()
			},
			showDialog(row) {
				this.invoiceId = row.invoiceId;
				this.dialogTableVisible = true;
				this.$nextTick(function() {
					this.$refs.multipleTable.forEach((item, index) => {
						item.clearSelection();
						let params = {
							"invoiceId": row.invoiceId,
							"taxesTaxType": this.dicNameList[index].dicValue
						};
						this.axios.post('/perTaxToolTwo/e9z/configInvoiceTaxes/selectWithInvoiceTaxesRate', params).then(res => {
								if (res.data.code == 200) {
									var ownList = res.data.data;
									if (ownList) {
										ownList.forEach(({
											ratesId
										}) => {
											const id = this.rateList.findIndex(item => item.ratesId === ratesId)
											item.toggleRowSelection(this.rateList[id], true);
										});
									} else {
										item.clearSelection();
									}
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
					})
				})
			},
			handleClick(tab, event) {
				console.log(tab, event);
			},
			hideDialog1() {
				this.$refs.multipleTable.forEach((item, index) => {
					item.clearSelection();
				})
				this.dialogTableVisible = false;
			},
			hideDialog2() {
				this.$refs.multipleTable1.forEach((item, index) => {
					item.clearSelection();
				})
				this.dialogMulTableVisible = false;
			},
			handleSelectionChange(val, index) {
				this.multipleSelection[index] = val;
			},
			handleSelectionChange1(val, index) {
				this.multipleSelection2[index] = val;
			},
			modifyMulti(){
				this.dialogMulTableVisible = true;
			},
			modifyMultiRow(val){
				this.multipleSelection1 = val;
			},
			
			modifyRate() {
				console.log(this.multipleSelection);
				this.multipleSelection.forEach((item, index) => {
					var url = '/perTaxToolTwo/e9z/configInvoiceTaxes/insertAndDelInvoiceTaxesAndInvoiceRates';
					var param = {
						invoiceTaxesRateList:item,
						taxesTaxType:this.dicNameList[index].dicValue,
						invoiceIdList:[this.invoiceId],
					} 
					this.axios.post(url, param).then(res => {
						this.$refs.multipleTable[index].clearSelection();
						if (res.data.code == 200) {
							this.dialogTableVisible = false;
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
						} else {
							this.dialogTableVisible = false;
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
					}).catch(function(err) {
						this.$refs.multipleTable[index].clearSelection();
						this.dialogTableVisible = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					})
				})
				
			},
			modifyRate2() {
				console.log(this.multipleSelection1);
				console.log(this.multipleSelection2);
				this.invoiceIdList= [];
				this.multipleSelection1.forEach((item, index) => {
					this.invoiceIdList.push(item.invoiceId);
				})
				this.multipleSelection2.forEach((item, index) => {
					var url = '/perTaxToolTwo/e9z/configInvoiceTaxes/insertAndDelInvoiceTaxesAndInvoiceRates';
					var param = {
						invoiceTaxesRateList:item,
						taxesTaxType:this.dicNameList[index].dicValue,
						invoiceIdList:this.invoiceIdList
					} 
					this.axios.post(url, param).then(res => {
						this.$refs.multipleTable1[index].clearSelection();
						if (res.data.code == 200) {
							this.dialogMulTableVisible = false;
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
						} else {
							this.dialogMulTableVisible = false;
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
					}).catch(function(err) {
						this.$refs.multipleTable1[index].clearSelection();
						this.dialogMulTableVisible = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					})
				})
				
			}
		},
		watch: {
			multiRow(newValue, oldValue) {
				if(newValue.length == 0){
					this.canDel = true;
				}else{
					this.canDel = false;
				}
			},
			multipleSelection1(newValue, oldValue) {
				if(newValue.length == 0){
					this.canEidt = true;
				}else{
					this.canEidt = false;
				}
			}
		},
		created() {
			this.queryRate();
			this.queryDicName()
		}
	}
</script>

<style scoped lang="less">
	.main_contain {
		height: 100%;
		padding: 20px;
		box-sizing: border-box;
	}

	.left_contain {
		width: calc(50% - 10px);
		/* background: pink; */
		float: left;
		height: 100%;

		.contain_header {
			height: 2rem; // line-height: 2rem;
			padding: 0px 30px;
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			background: url(../../../assets/img/list-bg1.png) no-repeat;
			background-size: cover;
			align-items: center;

			span.title {
				font-size: 0.28rem;
				color: #fff
			}

			/deep/ .el-button {
				color: #43b3db
			}
		}

		.contain_body {
			padding: 0.2rem 0.2rem;
			background: #fff
		}
	}

	.right_contain {
		width: calc(50% - 10px);
		height: 100%;
		float: right;

		/deep/ .el-input {
			width: 2rem;
			height: 28px;
			display: block;
			top: 1rem;
		}

		/deep/ .el-input__inner {
			height: 28px;
		}

		/deep/ .el-input__icon {
			line-height: 28px;
		}

		.contain_header {
			height: 2rem; // line-height: 2rem;
			padding: 0px 30px; // display: flex;
			flex-direction: row;
			justify-content: space-between;
			background: url(../../../assets/img/list-bg2.png) no-repeat;
			background-size: cover;
			align-items: center;

			span.title {
				font-size: 0.28rem;
				color: #fff
			}

			/deep/ .el-button {
				color: #43b3db
			}
		}

		.contain_body {
			padding: 0.2rem 0.2rem;
			background: #fff
		}
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

	/deep/ .el-pagination {
		text-align: right;
		margin-top: 10px;
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
		width: 1.8rem;
		min-width: 1.8rem;
	}

	/deep/ .el-date-editor.el-input {
		width: 1.8rem;
		min-width: 1.8rem;
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

	/deep/ .el-dialog {
		min-width: 250px;
	}
</style>
