<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>系统初始化</el-breadcrumb-item>
			<el-breadcrumb-item>初始化</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='form'>
					<el-form-item label="公司名称" prop="dossierName">
						<el-select v-model="uploadData.fBrNo" placeholder="请选择公司名称" clearable filterable>
							<!-- <el-option v-for="item in custList" :label="item.FAcctName" :value='item.FAcctName'></el-option> -->
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerName'></el-option>
						</el-select>
					</el-form-item>

					<el-button type="primary" @click='search()' size="mini">搜索</el-button>
					<el-button type="danger" @click='stopInit()' size="mini">结束初始化</el-button>
					<el-button type="danger" @click='reverseInit()' size="mini">反初始化</el-button>
				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<div style="margin-bottom: 12px;">
				<h2>会计期间初始化</h2>
				<div class="form_contain">
					<h3>总账会计期间</h3>
					<el-form :inline="true" :model="uploadData1" class="demo-form-inline" size="mini" ref='formName' style='padding-left: 30px;'>
						<el-form-item label="会计期间数" prop="dossierName">
							<el-input value='12' disabled>
							</el-input>
						</el-form-item>
						<el-form-item label="启用会计年度" prop="GLStartYear" :rules="[$rules.requiredSelect]">
							<el-date-picker v-model="uploadData1.GLStartYear" type="year" placeholder="选择日期" size="mini" format="yyyy" value-format="yyyy"
							 :disabled="canSave">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="启用会计期间" prop="GLStartPeriod" :rules="[$rules.requiredSelect]">
							<el-date-picker v-model="uploadData1.GLStartPeriod" type="month" placeholder="选择日期" size="mini" format="M" value-format="M"
							 :disabled="canSave">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="当前会计年度" prop="GLCurrentYear" :rules="[$rules.requiredSelect]">
							<el-date-picker v-model="uploadData1.GLCurrentYear" type="year" placeholder="选择日期" size="mini" format="yyyy" value-format="yyyy"
							 :disabled="canSave">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="当前会计期间" prop="GLCurrentPeriod" :rules="[$rules.requiredSelect]">
							<el-date-picker v-model="uploadData1.GLCurrentPeriod" type="month" placeholder="选择日期" size="mini" format="M" value-format="M"
							 :disabled="canSave">
							</el-date-picker>
						</el-form-item>
					</el-form>
				</div>
				<div class="form_contain">
					<h3>固定资产会计期间</h3>
					<el-form :inline="true" :model="uploadData2" class="demo-form-inline" size="mini" ref='formName1' style='padding-left: 30px;'>
						<el-form-item label="会计期间数" prop="dossierName">
							<el-input value='12' disabled>
							</el-input>
						</el-form-item>
						<el-form-item label="启用会计年度" prop="FAStartYear" :rules="[$rules.requiredSelect]">
							<el-date-picker v-model="uploadData2.FAStartYear" type="year" placeholder="选择日期" size="mini" format="yyyy" value-format="yyyy"
							 :disabled="canSave">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="启用会计期间" prop="FAStartPeriod" :rules="[$rules.requiredSelect]">
							<el-date-picker v-model="uploadData2.FAStartPeriod" type="month" placeholder="选择日期" size="mini" format="M" value-format="M"
							 :disabled="canSave">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="当前会计年度" prop="FACurrentYear" :rules="[$rules.requiredSelect]">
							<el-date-picker v-model="uploadData2.FACurrentYear" type="year" placeholder="选择日期" size="mini" format="yyyy" value-format="yyyy"
							 :disabled="canSave">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="当前会计期间" prop="FACurrentPeriod" :rules="[$rules.requiredSelect]">
							<el-date-picker v-model="uploadData2.FACurrentPeriod" type="month" placeholder="选择日期" size="mini" format="M" value-format="M"
							 :disabled="canSave">
							</el-date-picker>
						</el-form-item>
					</el-form>
				</div>
				<div style="text-align: center;background-color: #fff;padding-bottom: 20px;">
					<el-button type="primary" size="mini" style='margin: 0 auto;' :disabled="canSave" @click='saveOrUpdateSystemProfilePeriod'>保存</el-button>
				</div>
			</div>

			<div>
				<h2>系统参数初始化</h2>
				<div class="form_contain">
					<h3>总账</h3>
					<el-form :inline="true" :model="uploadData3" class="demo-form-inline" size="mini" ref='formName2' style='padding-left: 30px;'>
						<el-form-item label="本年利润科目" prop="dossierName">
							<el-input placeholder="请输入内容" v-model="EarnAccount" class="input-with-select" :disabled="canSave1">

								<el-button slot="append" icon="el-icon-search" @click='showDialog(1)' :disabled="canSave1"></el-button>
							</el-input>
						</el-form-item>
						<el-form-item label="利润分配科目" prop="dossierName">
							<el-input placeholder="请输入内容" v-model="EarnAssignAccount" class="input-with-select" :disabled="canSave1">

								<el-button slot="append" icon="el-icon-search" @click='showDialog(2)' :disabled="canSave1"></el-button>
							</el-input>
						</el-form-item>
						<el-form-item label="注意:结账要求损益类科目余额为零" prop="dossierName">

						</el-form-item>

					</el-form>
				</div>
				<div class="form_contain">
					<h3>会计期间</h3>
					<el-form :inline="true" :model="uploadData4" class="demo-form-inline" size="mini" ref='formName3' style='padding-left: 30px;'>
						<el-form-item label="会计期间数" prop="dossierName">
							<el-input value='12' disabled>
							</el-input>
						</el-form-item>
						<el-form-item label="启用会计年度" prop="GLStartYearSystem">
							<el-date-picker v-model="GLStartYearSystem" type="year" placeholder="选择日期" size="mini" format="yyyy"
							 value-format="yyyy" disabled>
							</el-date-picker>
						</el-form-item>
						<el-form-item label="启用会计期间" prop="GLStartPeriodSystem">
							<el-date-picker v-model="GLStartPeriodSystem" type="month" placeholder="选择日期" size="mini" format="M"
							 value-format="M" disabled>
							</el-date-picker>
						</el-form-item>
						<el-form-item label="当前会计年度" prop="GLCurrentYearSystem">
							<el-date-picker v-model="GLCurrentYearSystem" type="year" placeholder="选择日期" size="mini" format="yyyy"
							 value-format="yyyy" disabled>
							</el-date-picker>
						</el-form-item>
						<el-form-item label="当前会计期间" prop="GLCurrentPeriodSystem">
							<el-date-picker v-model="GLCurrentPeriodSystem" type="month" placeholder="选择日期" size="mini" format="M"
							 value-format="M" disabled>
							</el-date-picker>
						</el-form-item>
					</el-form>
				</div>
				<div style="text-align: center;background-color: #fff;padding-bottom: 20px;">
					<el-button type="primary" size="mini" style='margin: 0 auto;' :disabled="canSave1" @click='saveOrUpdateSystemProfilePeriod1'>保存</el-button>
				</div>
			</div>

		</div>
		<el-dialog width="800px" title="会计科目" :visible.sync="innerVisible" append-to-body>
			<el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
				<el-tab-pane label="1、资产" name="1">
					<el-tree :data="treeList" :props="props" show-checkbox node-key="fnumber" ref="tree1">
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="2、负债" name="2">
					<el-tree :data="treeList" :props="props" show-checkbox node-key="fnumber" ref='tree2'>
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="3、权益" name="3">
					<el-tree :data="treeList" :props="props" show-checkbox node-key="fnumber" ref='tree3'>
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="4、成本" name="4">
					<el-tree :data="treeList" :props="props" show-checkbox node-key="fnumber" ref='tree4'>
					</el-tree>
				</el-tab-pane>
				<el-tab-pane label="5、损益" name="5">
					<el-tree :data="treeList" :props="props" show-checkbox node-key="fnumber" ref='tree5'>
					</el-tree>
				</el-tab-pane>
			</el-tabs>
			<div class='btn_contain clearfix'>
				<span class='commit' @click="commit">确认</span>
				<span class='close' @click="close">关闭</span>

			</div>
		</el-dialog>

	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				isvalid:false,
				isvalid1:false,
				fBrNo:'',
				props: {
					label: 'full',
					children: 'children'
				},

				GLStartYear: '',
				GLStartPeriod: '',
				GLCurrentYear: '',
				GLCurrentPeriod: '',
				FAStartYear: '',
				FAStartPeriod: '',
				FACurrentYear: '',
				FACurrentPeriod: '',

				GLStartYearSystem: '',
				GLStartPeriodSystem: '',
				GLCurrentYearSystem: '',
				GLCurrentPeriodSystem: '',
				EarnAccount: '',
				EarnAssignAccount: '',

				canSave: true,
				canSave1: true,
				canStop: true,

				loading: false,
				detail: {},
				tree: [],
				// value4: this.formatTimeToStr(new Date(), 'yyyy'),


				input5: '',
				uploadData: {
					// fBrNo:'新财务测试1'
				},
				uploadData1: {},
				uploadData2: {},
				uploadData3: {},
				uploadData4: {},
				innerVisible: false,
				activeName2: "1",
				customerId: 0,
				tableData: [],
				customerName: '',
				moneyList: [{
					label: '人民币',
					value: 1
				}, {
					label: '（综合本位币）',
					value: 2
				}, {
					label: '（所有币别） ',
					value: 3
				}],

				treeList: [],
				tag: 1,
				index: '',
				custList:[]
			}
		},
		components: {},
		methods: {
			systemProfilePeriodInit() {
				let params = {
					"fBrNo": this.fBrNo
				};
				this.axios.post('/perTaxToolTwo/e9/tSystemProfile/systemProfilePeriodInit', this.qs.stringify(params), {
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.detail = res.data.data;
							if (this.detail.length > 1) {
								this.canSave = true;
							} else {
								this.canSave = false;
							}

							this.detail.forEach((item, index) => {
								if (item.fcategory == "GL" && item.fkey == "StartYear") {
									this.$set(this.uploadData1,'GLStartYear',item.fvalue);
									// this.uploadData1.GLStartYear = item.fvalue;
								}
								if (item.fcategory == "GL" && item.fkey == "StartPeriod") {
									this.$set(this.uploadData1,'GLStartPeriod',item.fvalue);
									// this.uploadData1.GLStartPeriod = item.fvalue;
								}
								if (item.fcategory == "GL" && item.fkey == "CurrentYear") {
									this.$set(this.uploadData1,'GLCurrentYear',item.fvalue);
									// this.uploadData1.GLCurrentYear = item.fvalue;
								}
								if (item.fcategory == "GL" && item.fkey == "CurrentPeriod") {
									this.$set(this.uploadData1,'GLCurrentPeriod',item.fvalue);
									// this.uploadData1.GLCurrentPeriod = item.fvalue;
								}
								if (item.fcategory == "FA" && item.fkey == "StartYear") {
									this.$set(this.uploadData2,'FAStartYear',item.fvalue);
									// this.uploadData2.FAStartYear = item.fvalue;
								}
								if (item.fcategory == "FA" && item.fkey == "StartPeriod") {
									this.$set(this.uploadData2,'FAStartPeriod',item.fvalue);
									// this.uploadData2.FAStartPeriod = item.fvalue;
								}
								if (item.fcategory == "FA" && item.fkey == "CurrentYear") {
									this.$set(this.uploadData2,'FACurrentYear',item.fvalue);
									// this.uploadData2.FACurrentYear = item.fvalue;
								}
								if (item.fcategory == "FA" && item.fkey == "CurrentPeriod") {
									this.$set(this.uploadData2,'FACurrentPeriod',item.fvalue);
									// this.uploadData2.FACurrentPeriod = item.fvalue;
								}
							})


						} else {
							this.loading = false;
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
			systemProfileInit() {
				let params = {
					"fBrNo": this.fBrNo
				};
				this.axios.post('/perTaxToolTwo/e9/tSystemProfile/systemProfileInit', this.qs.stringify(params), {
						headers: {
							"Content-Type": "application/x-www-form-urlencoded"
						}
					})
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.detail1 = res.data.data;
							if (this.detail1.length == 6) {
								this.canSave1 = true;
							} else {
								this.canSave1 = false;
							}

							this.detail1.forEach((item, index) => {
								if (item.fkey == "StartYear") {
									this.GLStartYearSystem = item.fvalue;
								}
								if (item.fkey == "StartPeriod") {
									this.GLStartPeriodSystem = item.fvalue;
								}
								if (item.fkey == "CurrentYear") {
									this.GLCurrentYearSystem = item.fvalue;
								}
								if (item.fkey == "CurrentPeriod") {
									this.GLCurrentPeriodSystem = item.fvalue;
								}
								if (item.fkey == "EarnAccount") {
									this.EarnAccount = item.fvalue;
								}
								if (item.fkey == "EarnAssignAccount") {
									this.EarnAssignAccount = item.fvalue;
								}
							})


						} else {
							this.loading = false;
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

			saveOrUpdateSystemProfilePeriod() {
				this.$refs['formName'].validate((valid) => {
					if (valid) {
						this.isvalid = true;
						
					} else {
						console.log('error submit!!');
						this.isvalid1 = false;
						return false;
					}
				});
				
				this.$refs['formName1'].validate((valid) => {
					if (valid) {
						this.isvalid1 = true;
						
					} else {
						console.log('error submit!!');
						this.isvalid1 = false;
						return false;
					}
				});
				
				if(this.isvalid && this.isvalid1){
					let params = [{
							"fcategory": "GL",
							"fkey": "StartYear",
							"fvalue": this.uploadData1.GLStartYear,
							"fbrno": this.fBrNo
						},
						{
							"fcategory": "GL",
							"fkey": "StartPeriod",
							"fvalue": this.uploadData1.GLStartPeriod,
							"fbrno": this.fBrNo
						},
						{
							"fcategory": "GL",
							"fkey": "CurrentYear",
							"fvalue": this.uploadData1.GLCurrentYear,
							"fbrno": this.fBrNo
						},
						{
							"fcategory": "GL",
							"fkey": "CurrentPeriod",
							"fvalue": this.uploadData1.GLCurrentPeriod,
							"fbrno": this.fBrNo
						},
						{
							"fcategory": "FA",
							"fkey": "StartYear",
							"fvalue": this.uploadData2.FAStartYear,
							"fbrno": this.fBrNo
						},
						{
							"fcategory": "FA",
							"fkey": "StartPeriod",
							"fvalue": this.uploadData2.FAStartPeriod,
							"fbrno": this.fBrNo
						},
						{
							"fcategory": "FA",
							"fkey": "CurrentYear",
							"fvalue": this.uploadData2.FACurrentYear,
							"fbrno": this.fBrNo
						},
						{
							"fcategory": "FA",
							"fkey": "CurrentPeriod",
							"fvalue": this.uploadData2.FACurrentPeriod,
							"fbrno": this.fBrNo
						}
					];
					this.axios.post('/perTaxToolTwo/e9/tSystemProfile/saveOrUpdateSystemProfilePeriod', params)
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							if (res.data.code == 200) {
								this.isvalid = false;
								this.isvalid1 = false;
								this.systemProfilePeriodInit();
								this.systemProfileInit();
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
					
					
					
					
							} else {
								this.loading = false;
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
				}
				
			},

			saveOrUpdateSystemProfilePeriod1() {
				let params = [{
						"fcategory": "GL",
						"fkey": "EarnAccount",
						"fvalue": this.EarnAccount,
						"fbrno": this.fBrNo
					},
					{
						"fcategory": "GL",
						"fkey": "EarnAssignAccount",
						"fvalue": this.EarnAssignAccount,
						"fbrno": this.fBrNo
					},

				];
				this.axios.post('/perTaxToolTwo/e9/tSystemProfile/saveOrUpdateSystemProfilePeriod', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.systemProfilePeriodInit();
							this.systemProfileInit();
							this.$message({
								message: res.data.msg,
								type: 'success'
							});




						} else {
							this.loading = false;
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
			stopInit() {
				this.$confirm('确定结束初始化?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = [{
						"fcategory": "GL",
						"fkey": "InitClosed",
						"fvalue": 1,
						"fbrno": this.fBrNo
					}];
					this.axios.post('/perTaxToolTwo/e9/tSystemProfile/saveOrUpdateSystemProfilePeriod', params)
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							if (res.data.code == 200) {
								this.systemProfilePeriodInit();
								this.systemProfileInit();
								this.$message({
									message: res.data.msg,
									type: 'success'
								});




							} else {
								this.loading = false;
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
						message: '已取消'
					});
				});

			},
			reverseInit() {
				this.$confirm('确定反初始化??', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = [{
						"fcategory": "GL",
						"fkey": "InitClosed",
						"fvalue": 0,
						"fbrno": this.fBrNo
					}];
					this.axios.post('/perTaxToolTwo/e9/tSystemProfile/saveOrUpdateSystemProfilePeriod', params)
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							if (res.data.code == 200) {
								this.systemProfilePeriodInit();
								this.systemProfileInit();
								this.$message({
									message: res.data.msg,
									type: 'success'
								});




							} else {
								this.loading = false;
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
						message: '已取消'
					});
				});


			},

			showDialog(index) {
				this.index = index;
				this.innerVisible = true;
				this.activeName2 = "1";
				this.getProofTAccounts("1")
			},
			handleClick(tab, event) {
				console.log(tab.name);
				this.tag = tab.name;
				this.getProofTAccounts(tab.name)
			},
			search() {
				this.fBrNo = this.uploadData.fBrNo;
				this.systemProfilePeriodInit();
				this.systemProfileInit();
			},

			getProofTAccounts(index) {
				let params = {
					"id": index,
					"fBrNo": this.fBrNo
				};
				this.axios.post('/perTaxToolTwo/e9/taccount/getProofTAccounts', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tree = res.data.data;
							this.treeList = [];
							this.tree.forEach((item, index) => {
								item.full = item.fnumber + '-' + item.ffullname
								if (item.fparentid == 0) {
									this.treeList.push(item);

								}
							})
							this.treeList = JSON.parse(JSON.stringify(this.treeList));
							console.log(this.treeList)
							this.treeList.forEach((item, index) => {
								item.children = [];
								this.tree.forEach((item2, index2) => {
									if (item2.fparentid == item.frootid) {
										item.children.push(item2);

									}
								})
							})

							console.log(this.treeList)

						} else {
							this.loading = false;
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
			handleNodeClick(data) {
				console.log(data);
			},
			commit() {
				console.log(this.$refs['tree' + this.tag].getCheckedNodes());
				if (this.index == 1) {
					this.EarnAccount = this.$refs['tree' + this.tag].getCheckedNodes()[0].fnumber;
				} else {
					this.EarnAssignAccount = this.$refs['tree' + this.tag].getCheckedNodes()[0].fnumber;
				}

				this.innerVisible = false
			},
			close() {
				this.innerVisible = false
			},
			getAD_E9Accounts_Customer() {
				let params = {
				};
				this.axios.get('/perTaxToolTwo/e9/DBOperatorAD_E9Account/getAD_E9Accounts_Customer')
					.then(res => {
						if (res.data.code == 200) {
							this.custList = res.data.data;
							
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
		computed: {},
		created() {
			// this.systemProfilePeriodInit();
			// this.systemProfileInit();
			this.getAD_E9Accounts_Customer()
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
			/* background: #fff; */
			/* margin: 0 20px; */
			padding: 0px 20px;
			height: calc(100% - 190px);

			.form_contain {
				background: #fff;
				/* margin-bottom: 12px */
			}

			h2 {
				width: 200px;
				text-align: center;
				background: #fff;
				height: 40px;
				line-height: 40px;
				color: #409EFF;
				font-size: 18px;
				font-weight: normal
			}

			h3 {
				width: 200px;
				/* text-align: center; */
				padding-left: 20px;
				height: 40px;
				line-height: 40px;
				color: rgb(125, 195, 109);
				font-size: 14px;
				font-weight: normal
			}

			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}
		}

	}

	.active-select {
		background-color: rgb(125, 195, 109) !important;
	}

	.next {
		width: 207px;
		height: 56px;
		background: rgba(36, 214, 137, 1);
		border: 3px solid rgba(36, 214, 137, 1);
		font-size: 16px;
		font-family: Microsoft YaHei;
		text-align: center;
		line-height: 56px;
		font-weight: bold;
		color: #fff;
	}

	.last {
		width: 207px;
		height: 56px;
		background: red;
		border: 3px solid red;
		font-size: 16px;
		font-family: Microsoft YaHei;
		text-align: center;
		line-height: 56px;
		font-weight: bold;
		color: #fff;
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

	/deep/ .el-dialog__body .el-tabs__content {
		height: 500px;
		overflow: auto;
	}
</style>
