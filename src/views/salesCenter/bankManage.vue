<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>银行管理</div>
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini" label-width="86px"
				 ref='form'>
					<el-form-item label="客户名称" prop="customerId">
						<el-select v-model="formInline.customerId" placeholder="请选择" clearable filterable>
							
							
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
						</el-select>
						
						<!-- <el-input v-model='formInline.tmplName'></el-input> -->
					</el-form-item>

					<el-form-item>
						<el-button @click='search("form")' size="mini">查询</el-button>
					</el-form-item>
					<el-form-item style="float: right;">
						<el-button @click='add("form")' size="mini">新增</el-button>
					</el-form-item>
					<!-- <el-form-item>
						<el-button @click='openAccount("form")' size="mini">开户</el-button>
					</el-form-item> -->
					<!-- <el-form-item>
						<el-button @click='exportExcel' size="mini">导出模板</el-button>
					</el-form-item> -->
					<!-- <el-form-item>
						<el-button @click='importExcel' size="mini">导入Excel</el-button>
					</el-form-item> -->
				</el-form>
			</div>
			<div class="contain_body">
				<!-- <el-button class='muldel' type="danger" size='mini' icon="el-icon-delete" :disabled="canEidt" @click='deleteMulti' style='margin-bottom: 0.2rem;'>批量删除</el-button> -->
				<!-- <el-button class='muldel' type="primary" size='mini' icon="el-icon-add" @click='add' style='margin-bottom: 0.2rem;'>新增</el-button> -->
				<el-table :data="tableList" style="width: 100%" stripe border @selection-change="handleSelectionChange" v-loading='loading'>
					<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->
					<!-- <el-table-column align="center" label="代账公司编号" prop="acctcomno" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="公司名称" prop="accname" :resizable="false"></el-table-column>
					<el-table-column align="center" label="开户银行" prop="bankName" :resizable="false"></el-table-column>
					<!-- <el-table-column align="center" label="appID" prop="appId" :resizable="false"></el-table-column> -->
					
					<el-table-column align="center" label="银行账号" prop="accno" :resizable="false"></el-table-column>
					<el-table-column align="center" label="法人姓名" prop="frName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="法人手机号" prop="mobile" :resizable="false"></el-table-column>
					
					<!-- <el-table-column align="center" label="技术编号" prop="techpartnerno" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="签约开始时间" prop="field1" :resizable="false">
						<template slot-scope="scope">
							<span>{{scope.row.field1?scope.row.field1:'--'}}</span>
							
						</template>
					</el-table-column>
					<el-table-column align="center" label="签约结束时间" prop="field2" :resizable="false">
						<template slot-scope="scope">
							<span>{{scope.row.field2?scope.row.field2:'--'}}</span>
							
						</template>
					</el-table-column>
					<el-table-column align="center" width="260" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="openAccount(scope.row)" v-show="!scope.row.accno">开户</el-button>
							<el-button size="mini" type="text" @click="handleEdit(scope.row)">修改</el-button>
							<el-button size="mini" type="text" @click="pagejump(scope.row)">签约</el-button>
							
							<el-button size="mini" type="text" @click="isSign(scope.row)">查询签约</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background layout="prev, pager, next" :total="total" :page-size=pageSize @current-change='handleCurrentChange'
				 :current-page="currentPage">
				</el-pagination>
				<!-- <el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '4')})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination> -->
			</div>
		</div>
		<el-dialog title="新增" :visible.sync="dialogAddVisible" width="4rem">
			<el-form :model="form1" size="mini" label-width="100px" ref="ruleForm2">
				<el-form-item label="客户名称" prop="customerId" :rules="[$rules.requiredSelect]">
					<el-select v-model="form1.customerId" placeholder="请选择" filterable @change="queryCustomer">
						
						<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="银行名称" prop="bankName" style="margin-bottom: 4px;">
					<el-select v-model="form1.bankName" placeholder="请选择" filterable>
						<el-option label="中国工商银行" value='中国工商银行'></el-option>
						<!-- <el-option v-for="item in dropList" :label="item.configName" :value='item.iocrInvoiceConfigId'></el-option> -->
					</el-select>
					<div style="color: #999;font-size: 12px;height: 16px;line-height: 16px;">若无选项中银行账号，后期可进行开户</div>
				</el-form-item>
				<el-form-item label="银行账号" prop="accno" v-show='form1.bankName == "中国工商银行"'>
					<el-input v-model="form1.accno" type="number" clearable></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile" :rules="[$rules.requiredInput]">
					<el-input v-model="form1.mobile" type="number"></el-input>
				</el-form-item>
				<el-form-item label="纳税人识别号" prop="uscc" :rules="[$rules.requiredInput]">
					<el-input v-model="form1.uscc"></el-input>
				</el-form-item>
				<el-form-item label="申报类型" prop="taxType" :rules="[$rules.requiredSelect]">
					<el-select v-model="form1.taxType" placeholder="请选择" filterable>
						<el-option label="一般纳税人" value='一般纳税人'></el-option>
						<el-option label="小规模" value='小规模'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="企业类型" prop="entType" :rules="[$rules.requiredSelect]">
					<el-select v-model="form1.entType" placeholder="请选择" filterable>
						
						<el-option v-for="item in dropList" :label="item.label" :value='item.label'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="法人姓名" prop="frName" :rules="[$rules.requiredInput]">
					<el-input v-model="form1.frName"></el-input>
				</el-form-item>
			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click='commit("ruleForm2")'>完成</span>
				<span class='close' @click='hide("ruleForm2")'>关闭</span>
			</div>
		</el-dialog>
		<el-dialog title="编辑" :visible.sync="dialogVisible" width="4rem">
			<el-form :model="form" size="mini" label-width="100px" :rules="rules" ref="ruleForm1">
				<el-form-item label="客户名称" prop="customerId">
					<el-select v-model="form.customerId" placeholder="请选择" filterable disabled>
						
						<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="银行名称" prop="bankName">
					<el-select v-model="form.bankName" placeholder="请选择" filterable>
						<el-option label="中国工商银行" value='中国工商银行'></el-option>
						<!-- <el-option v-for="item in dropList" :label="item.configName" :value='item.iocrInvoiceConfigId'></el-option> -->
					</el-select>
				</el-form-item>
				<el-form-item label="银行账号" prop="accno">
					<el-input v-model="form.accno" type="number"></el-input>
				</el-form-item>
				<el-form-item label="手机号" prop="mobile">
					<el-input v-model="form.mobile" type="number"></el-input>
				</el-form-item>
				<el-form-item label="纳税人识别号" prop="uscc" :rules="[$rules.requiredInput]">
					<el-input v-model="form.uscc"></el-input>
				</el-form-item>
				<el-form-item label="申报类型" prop="taxType" :rules="[$rules.requiredSelect]">
					<el-select v-model="form.taxType" placeholder="请选择" filterable>
						<el-option label="一般纳税人" value='一般纳税人'></el-option>
						<el-option label="小规模" value='小规模'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="企业类型" prop="entType" :rules="[$rules.requiredSelect]">
					<el-select v-model="form.entType" placeholder="请选择" filterable>
						
						<el-option v-for="item in dropList" :label="item.label" :value='item.label'></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="法人姓名" prop="frName" :rules="[$rules.requiredInput]">
					<el-input v-model="form.frName"></el-input>
				</el-form-item>
				
			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click='commitEditDialog("ruleForm1")'>完成</span>
				<span class='close' @click='hideEditDialog("ruleForm1")'>关闭</span>
			</div>
		</el-dialog>
		
		
	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			
			var validatePass2 = (rule, value, callback) => {
				var y = String(value).indexOf(".") + 1;//获取小数点的位置
				var count = String(value).length - y;//获取小数点后的个数
				if (value === '') {
					callback(new Error('请输入税率'));
				} else if (/^(0\.\d+|0|1)$/.test(value) == false) {
					callback(new Error('税率在0-1之间!'));
				} else if( count > 6 ){
					callback(new Error('小数位最多六位'));
				}else {
					callback();
				}
			};
			return {
				loading: false,
				total:0,
				currentPage:1,
				pageSize:10,
				message: "12334456",
				customerId: '',
				tableList: [],
				dialogAddVisible: false,
				dialogVisible: false,
				dialogFileVisible:false,
				fileList:[],
				formInline: {
					customerId: ""
				},
				form: {
					bankName:''
				},
				form1: {
					bankName:'中国工商银行'
				},
				canEidt:true,
				tag: 0,
				row: {},
				editRow: {},
				multipleSelection: [],
				rules: {
					customerName: [{
						required: true,
						message: '请输入名称',
						trigger: 'blur'
					}],
					rate: [{
						validator: validatePass2,
						trigger: 'blur',
						required: true,
					}],
					// rate: [{
					// 	required: true,
					// 	message: '请输入数值',
					// 	trigger: 'blur'
					// }],
				},
				filrules: {
					iocrInvoiceConfigId: [{
						required: true,
						message: '请选择',
						trigger: 'change'
					}]
				},
				dropList:[
					{label:'合资'},
					{label:'独资'},
					{label:'国有'},
					{label:'私营'},
					{label:'全民所有制'},
					{label:'集体所有制'},
					{label:'股份制'},
					{label:'有限责任制'},
					{label:'工厂'},
				]
			}
		},
		components: {},
		methods: {
			//开户
			openAccount(row){
				
				var url = '/perTaxToolTwo/gh/openAccount?'
				 + 'frName='  + row.frName
				 // + 'cis=' + row.cis 
				 // + '&customerId=' + row.customerId
				 // + '&customerName=' + row.customerName
				 + '&uscc=' + row.uscc
				 // + '&acctcomno=' + row.acctcomno
				 // + '&mobile=' + row.mobile
				 // + '&accno=' + row.accno
				 + '&accname=' + row.accname
				 // + '&tranDate=' + row.tranDate
				 // + '&transNo=' + row.transNo;
				
				window.location.href = url;
			},
			//签约
			pagejump(row){
				
				// window.location.href = '/perTaxToolTwo/gh/ ';
				var url = '/perTaxToolTwo/gh/pagejump?cis=' + row.cis + '&customerId=' + row.customerId
				 + '&customerName=' + row.customerName
				 + '&uscc=' + row.uscc
				 + '&acctcomno=' + row.acctcomno
				 + '&mobile=' + row.mobile
				 + '&accno=' + row.accno
				 + '&accname=' + row.accname
				 + '&tranDate=' + row.tranDate
				 + '&transNo=' + row.transNo;
				
				window.location.href = url;
				// this.$alert('https://99cj.e9bq.com/perTaxToolTwo/import/pagejump?cis=' + row.cis + '&customerId=' + row.customerId
				//  + '&customerName=' + row.customerName
				//  + '&uscc=' + row.uscc
				//  + '&acctcomno=' + row.acctcomno
				//  + '&mobile=' + row.mobile
				//  + '&accno=' + row.accno
				//  + '&accname=' + row.accname
				//  + '&tranDate=' + row.tranDate
				//  + '&transNo=' + row.transNo, '提示', {
				//           confirmButtonText: '确定',
				//           callback: action => {
				//             this.$message({
				//               type: 'info',
				//               message: '已关闭'
				//             });
				//           }
				//         });
				
			},
			//是否签约
			isSign(row){
				let params = {
					cis:row.cis,
					acctcomno:row.acctcomno,
					uscc:row.uscc,
					id:row.id
				};
				this.axios.post('/perTaxToolTwo/gh/queryagreement', params)
					.then(res => {
						if (res.data.code == 200) {
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
					})
					.catch(err => {
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			
			search(formName) {
				
				this.customerId = this.formInline.customerId;
				this.getBankList()
					

			},
			add(formName) {
				this.dialogAddVisible = true;
			
			},
			// getIocrInvoiceConfig(tag){
			// 	let params = {
			// 		"page": this.currentPage,
			// 		"row": this.pageSize,
			// 		"data": {
			// 			"configParentId": tag
			// 		}
			// 	};
			// 	this.axios.post('/perTaxToolTwo/iocr/main/getIocrInvoiceConfig', params)
			// 		.then(res => {
			// 			this.loading = false;
			// 			if (res.data.code == 200) {
			// 				if(tag == 0){
			// 					this.dropList = res.data.data;
			// 				}else{
			// 					this.tableList = res.data.data;
			// 					this.total = res.data.count;
			// 				}
							
							
			// 				// this.total = 
			// 			} else {
			// 				let type;
			// 				if (res.data.code == 0) {
			// 					type = "warning";
			// 				} else if (res.data.code == 500) {
			// 					type = "error";
			// 				}
			// 				this.$message({
			// 					message: res.data.msg,
			// 					type: type
			// 				});
			// 			}
			// 		})
			// 		.catch(err => {
			// 			this.loading = false;
			// 			this.$message({
			// 				message: "系统繁忙，请稍后重试",
			// 				type: "error"
			// 			});
			// 		});
			// },
			
			
			
			
			/*获取字典列表*/
			getBankList() {
				this.loading = true;
				let param = {
			
					data: {
						customerId:this.customerId,
						remark2:''
					},
					page: this.currentPage,
					row: this.pageSize
				};
			
				this.axios.post('/perTaxToolTwo/gh/queryagreementListPage', param).then(res => {
					if (res.data.code == 200) {
						this.loading = false;
						this.tableList = res.data.data;
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
			
			queryCustomer(val){
				let param = {
							
					customerId: val
				};
							
				this.axios.post('/perTaxToolTwo/columbusNew/tCustomerInfo/queryCustomer', param).then(res => {
					if (res.data.code == 200) {
						this.$set(this.form1,'taxType',res.data.data.taxdeclarationtypename);
						this.$set(this.form1,'frName',res.data.data.legalperson);
						this.$set(this.form1,'uscc',res.data.data.businesslicenseno);
						// this.form1.entType = res.data.data.customertypename;
						// this.form1.frName = res.data.data.legalperson;
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

			/*
			* 新增子条目
			* params
			* {
				"dicParentId": 0,
				"dicName": "test1",
				"dicValue": 1,
				"dicLevel": 2,
				"dicSort": 8,
				"state": 1,
				"parentLevel": 0
			}
			* 
			* */

			hideDialog(formName) {
				this.$refs[formName].resetFields();
				this.dialogTableVisible = false
			},
			hideEditDialog(formName) {
				this.$refs[formName].resetFields();
				this.dialogVisible = false
			},
			showDialog(row) {

				this.$confirm('确定删除?', '删除', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = [row.iocrInvoiceConfigId];
					this.axios.post('/perTaxToolTwo/iocr/main/deleteIocrInvoiceConfig', params)
						.then(res => {
							if (res.data.code == 200) {
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
								this.getList();
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
			hide(){
				this.dialogAddVisible = false;
			},
			commit(formName){
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let params = {
							customerId:this.form1.customerId,
							bankName:this.form1.bankName,
							accno:this.form1.accno,
							mobile:this.form1.mobile,
							taxType:this.form1.taxType,
							entType:this.form1.entType,
							frName:this.form1.frName,
							uscc:this.form1.uscc,
						};
						this.axios.post('/perTaxToolTwo/gh/insert', params)
							.then(res => {
								if (res.data.code == 200) {
									this.getBankList();
									this.dialogAddVisible = false;
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
							})
							.catch(err => {
								this.$message({
									message: "系统繁忙，请稍后重试",
									type: "error"
								});
							});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			commitEditDialog(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						let params = {
							customerId:this.form.customerId,
							bankName:this.form.bankName,
							accno:this.form.accno,
							mobile:this.form.mobile,
							taxType:this.form.taxType,
							entType:this.form.entType,
							frName:this.form.frName,
							id:this.form.id,
							uscc:this.form.uscc,
						};
						this.axios.post('/perTaxToolTwo/gh/update', params)
							.then(res => {
								if (res.data.code == 200) {
									this.getBankList();
									this.dialogVisible = false;
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
							})
							.catch(err => {
								this.$message({
									message: "系统繁忙，请稍后重试",
									type: "error"
								});
							});
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			handleEdit(row) {
				this.dialogVisible = true;
				this.form = JSON.parse(JSON.stringify(row));
			},
			commitEdit() {
				this.dialogVisible = true
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			deleteMulti() {
				if (this.multipleSelection.length > 0) {
					this.$confirm('确定删除?', '删除', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						var params = [];
						this.multipleSelection.forEach((item) => {
							params.push(item.rateId)
						})
						// let params = this.multipleSelection;
						this.axios.post('/perTaxToolTwo/iocr/main/deleteIocrInvoiceConfig', params)
							.then(res => {
								if (res.data.code == 200) {
									this.getList();
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
				}else{
					this.$message({
						message: '请至少选择一条数据',
						type: 'error'
					});
				}
			},
			
			handleCurrentChange(val){
				this.currentPage = val;
				this.getBankList();
			}
		},
		watch: {
			multipleSelection(newValue, oldValue) {
				if(newValue.length == 0){
					this.canEidt = true;
				}else{
					this.canEidt = false;
				}
			}
		},
		created() {
			// this.loading = true;
			this.getBankList();
			// this.getList()
		},
		
	}
</script>
<style>
	.addDictionary .el-dialog {
		min-width: 250px;
	}
</style>

<style scoped lang="less">
	.main_contain {
		width: 100%;
		height: 100%;
		padding: 20px;
		box-sizing: border-box;

		.left_contain {
			height: 100%
		}
	}

	.contain_header {
		height: 2rem;
		padding: 0px 30px;
		background: url(../../assets/img/list-bg1.png) no-repeat;
		background-size: cover;
		border-top-left-radius: 0.06rem;
		border-top-right-radius: 0.06rem;

		.title {
			font-size: 0.24rem;
			height: 1rem;
			line-height: 1.24rem;
			color: #fff;
		}

		/deep/ .el-form-item--mini .el-form-item__label {
			color: #fff;
		}

		/deep/ .el-form {
			margin-top: 0.1rem
		}

		/deep/ .el-button {
			color: #43b3db;
		}
	}

	.contain_body {
		padding: 0.2rem 0.2rem;
		background: #fff
	}

	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
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
	
	.el-dialog {
		.el-select{
			width: 180px;
		}
	}

	// /deep/ .el-form-item__content {
	// 	width: 180px;
	// }

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
</style>
