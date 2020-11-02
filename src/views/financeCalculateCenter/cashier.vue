<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>银行对账</div>
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
					<el-form-item label="客户名称:">
						<el-input v-model='formInline.customername' clearable></el-input>
					</el-form-item>
					<!-- <el-form-item label="账期:">
						<el-date-picker v-model="value" type="month">
						</el-date-picker>
					</el-form-item> -->

					<el-form-item label="银行名称:">
						<el-select v-model='formInline.bankname' clearable>
							<el-option v-for='item in banknameList' :label="item.bankname" :value="item.bankname" :key='item.bankname'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="状态:">
						<el-select v-model='formInline.status' clearable>
							<el-option v-for='item in statusList' :label="item.label" :value="item.value" :key='item.value'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click='search' size="mini">查询</el-button>
						<!-- <el-button @click='add' size="mini">新增</el-button> -->
					</el-form-item>
					<!-- <el-form-item>
					</el-form-item> -->
				</el-form>
			</div>
			<div class="contain_body">
				<el-table :data="tableList" style="width: 100%" stripe border v-loading='loading'>
					<!-- <el-table-column type="selection" width="50"></el-table-column> -->

					<el-table-column align="center" label="客户名称" prop="customername" :resizable="false" width="300px"></el-table-column>
					<el-table-column align="center" label="开始账期" prop="startperiod" :resizable="false"></el-table-column>
					<el-table-column align="center" label="结束账期" prop="endperiod" :resizable="false"></el-table-column>
					<el-table-column align="center" label="银行名称" prop="bankname" :resizable="false"></el-table-column>
					<el-table-column align="center" label="银行账号" prop="bankaccount"  width="240" :resizable="false"></el-table-column>
					<el-table-column align="center" label="客户邮箱" prop="email" width="200" :resizable="false"></el-table-column>
					<el-table-column align="center" label="分配时间" prop="createtime" width="120" :resizable="false"></el-table-column>
					<el-table-column align="center" label="执行人" prop="accountantname" :resizable="false"></el-table-column>
					<el-table-column align="center" label="是否已比对" width="120" :resizable="false">
						<template slot-scope="scope">
							<span>{{scope.row.havecompare ? "是":"否"}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="状态" :resizable="false">
						<template slot-scope="scope">
							
							<el-tooltip class="item" effect="dark" content="邮件未收到或者邮件主题格式不正确" placement="top" v-if='scope.row.status == 1'>
								<span>已开始</span>
							</el-tooltip>
							<!-- <span v-if='scope.row.status == 1'>已开始</span> -->
							<!-- <span v-if='scope.row.status == 2'>邮件已收到</span> -->
							<el-tooltip class="item" effect="dark" content="无法识别对账单文件内容或者e9没有账单" placement="top" v-if='scope.row.status == 2'>
								<span>邮件已收到</span>
							</el-tooltip>
							<span v-if='scope.row.status == 3'>对账中</span>
							<span v-if='scope.row.status == 4'>对账结束</span>
							<span v-if='scope.row.status == 5'>取消</span>
						</template>
					</el-table-column>
					<el-table-column align="center" width="200" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleDownload(scope.$index, scope.row)" v-if='scope.row.remark1'>下载</el-button>
							<!-- <el-button size="mini" type="text" @click="handleUpload(scope.$index, scope.row)" v-if='!scope.row.remark1'>EXCEL上传</el-button> -->
							<el-upload v-if='scope.row.remark1' class="upload-demo" action="/perTaxToolTwo/dz/dzDealController/uploadExcel"
							 :on-preview="handlePreview"  :on-remove="handleRemove"
							 :before-remove="beforeRemove" :limit="1" :on-exceed="handleExceed" :file-list="fileList" :data='uploadData'
							 :show-file-list='false' :on-success='handleSuccess'>
								<el-button type="text" size="mini" @click='handleBefore(scope.row.id)'>EXCEL上传</el-button>
							</el-upload>
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">查看</el-button>
							<el-button size="mini" type="text" @click="handleCancel(scope.$index, scope.row)" v-show='scope.row.status != 5'>取消任务</el-button>
							<el-button size="mini" type="text" @click="handleDel(scope.$index, scope.row)" v-show='scope.row.status == 5'>删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>
		</div>
		<el-dialog title="查看" :visible.sync="dialogVisible" width="8rem" :before-close="handleClose">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-button @click='dzexport' size="mini" type="primary">导出</el-button>
				<el-button @click='sendEmail' size="mini" type="primary">发送给客户</el-button>
				
				<el-tab-pane label="余额调节表" name="first" style='margin-top: 6px;'>
					<!-- <el-table :data="detail" style="width: 100%;max-height: 400px;overflow: auto;" stripe border v-loading='loading'>
						
					<el-table :data="qsywsStr" style="width: 100%;max-height: 400px;overflow: auto;" stripe border v-loading='loading'>
					<el-table :data="qfywfStr" style="width: 100%;max-height: 400px;overflow: auto;" stripe border v-loading='loading'>
					<el-table :data="ysqwsStr" style="width: 100%;max-height: 400px;overflow: auto;" stripe border v-loading='loading'> -->
					<el-table :data="adjustDetail" style="width: 100%;max-height: 300px;overflow: auto;" stripe border v-loading='loading'>

						<el-table-column align="center" label="项目" prop="date" :resizable="false"></el-table-column>
						<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>

					</el-table>
					<h3 v-show='isCompare' style="margin-top: 20px;">对比后数据</h3>
					<el-table :data="compareDetail" style="width: 100%;max-height: 300px;overflow: auto;margin-top: 5px;" stripe
					 border v-loading='loading' v-show='isCompare'>

						<el-table-column align="center" label="项目" prop="date" :resizable="false"></el-table-column>
						<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>

					</el-table>
				</el-tab-pane>

				<el-tab-pane label="银行对账单" name="second">
					<el-table :data="bankList" style="width: 100%;max-height: 400px;overflow: auto;" stripe border v-loading='loading'>
						<!-- <el-table-column type="selection" width="50"></el-table-column> -->

						<el-table-column align="center" label="日期" prop="date" :resizable="false"></el-table-column>
						<el-table-column align="center" label="摘要" prop="abstract" :resizable="false" width="300"></el-table-column>
						<el-table-column align="center" label="借方金额" prop="debtAmount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="贷方金额" prop="creditAmount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="方向" prop="belongTo" :resizable="false">
							<template slot-scope="scope">
								<span>{{scope.row.belongTo == 1 ? "借":"贷"}}</span>
							</template>
						</el-table-column>
						<!-- <el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column> -->

					</el-table>

				</el-tab-pane>

				<el-tab-pane label="企业对账单" name="third">
					<el-form :inline="true" :model="tbDzDetail" class="demo-form-inline" size="mini" v-show="tbDzDetail.status!=4&&tbDzDetail.status!=5"
					 :rules="rules" ref='form'>
						<el-form-item label="期初余额" prop="balance">
							<el-input v-model='tbDzDetail.balance' clearable type="number"></el-input>
						</el-form-item>
						<el-form-item label="期初调节余额" prop="adjustmentbalance">
							<el-input v-model='tbDzDetail.adjustmentbalance' clearable type="number"></el-input>
						</el-form-item>

						<el-form-item>
							<el-button @click='preview("form")' size="mini" type="primary">预览</el-button>
							<el-button @click='refresh' size="mini" type="primary">重新获取数据</el-button>
							<!-- <el-button @click='add' size="mini">新增</el-button> -->
						</el-form-item>
						<!-- <el-form-item>
						</el-form-item> -->
					</el-form>

					<el-form :inline="true" :model="details" class="demo-form-inline" size="mini" v-show="tbDzDetail.status==4||tbDzDetail.status==5">
						<el-form-item label="期初余额" prop="balance">
							<el-input v-model='details.balance' disabled></el-input>
						</el-form-item>
						<el-form-item label="期初调节余额" prop="adjustmentbalance">
							<el-input v-model='details.adjustmentbalance' disabled></el-input>
						</el-form-item>
					</el-form>



					<el-table :data="e9List" style="width: 100%;max-height: 400px;overflow: auto;" stripe border v-loading='loading'>

						<el-table-column align="center" label="日期" prop="date" :resizable="false" width="120"></el-table-column>
						<el-table-column align="center" label="摘要" prop="abstract" :resizable="false" width="300"></el-table-column>
						<el-table-column align="center" label="借方金额" prop="debtAmount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="贷方金额" prop="creditAmount" :resizable="false"></el-table-column>
						<el-table-column align="center" label="方向" prop="belongTo" :resizable="false">
							<template slot-scope="scope">
								<span>{{scope.row.belongTo == 1 ? "借":"贷"}}</span>
							</template>
						</el-table-column>

						<el-table-column align="center" :resizable="false">
							<template slot="header" slot-scope="scope">
								<span>操作</span>
							</template>
							<template slot-scope="scope">
								<el-button v-if='scope.row.isignore == 0' size="mini" type="text" @click='ignore(scope.$index, scope.row)'>忽略</el-button>
								<el-button v-else size="mini" type="text" @click='resume(scope.$index, scope.row)'>恢复</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
			</el-tabs>
			<div class='btn_contain clearfix'>
				<span class='commit' @click="compare" v-show='isCompare'>确认对比</span>
				<span class='close' @click="hideDialog">关闭</span>

			</div>
			<el-dialog width="70%" title="预览对比" :visible.sync="innerVisible" append-to-body>
				<el-table :data="adjustDetail" style="width: 48%;max-height: 400px;overflow: auto;display: inline-block;" stripe
				 border v-loading='loading'>

					<el-table-column align="center" label="项目" prop="date" :resizable="false"></el-table-column>
					<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
					<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>

				</el-table>

				<el-table :data="compareDetail" style="width: 48%;max-height: 400px;overflow: auto;display: inline-block;margin-left: 4%;"
				 stripe border v-loading='loading'>

					<el-table-column align="center" label="项目" prop="date" :resizable="false"></el-table-column>
					<el-table-column align="center" label="金额" prop="amount" :resizable="false"></el-table-column>
					<el-table-column align="center" label="备注" prop="remark" :resizable="false"></el-table-column>

				</el-table>
				<div class='btn_contain clearfix' style="text-align: center;margin-top: 0.36rem;">
					<span class='close' @click="compare" style="width: 2.4rem;height: 0.4rem;line-height: 0.4rem;background: #43b3db;color: #fff;
					display: inline-block;text-align: center;border-radius: 4px;">确认对比</span>
				</div>
			</el-dialog>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				activeName: "first",
				loading: false,
				formInline: {
					bankname: '',
					customername: '',
					status: ''
				},
				bankname: '',
				customername: '',
				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],

				dialogVisible: false,
				innerVisible: false,
				isCompare: false,

				value: '',
				banknameList: [],
				detail: [],
				tempdetail: [],

				adjustMap: {},
				adjustDetail: [],
				compareDetail: [],
				compareMap: {},
				e9List: [],
				uploadData: {},
				bankList: [],
				details: {},
				tbDzDetail: {
					id: "",
					status: '',
					balance: "", //期初余额
					adjustmentbalance: "",
					// remark1:'',
					// remark2:''
				},

				rules: {
					balance: [{
						required: true,
						message: '请输入期初余额',
						trigger: 'blur'
					}],
					adjustmentbalance: [{
						required: true,
						message: '请输入期初调节余额',
						trigger: 'blur'
					}],
				},

				statusList: [{
						label: '已开始',
						value: 1,
					},
					{
						label: '邮件已收到',
						value: 2,
					},
					{
						label: '对账中',
						value: 3,
					},
					{
						label: '对账结束',
						value: 4,
					},
					{
						label: '取消',
						value: 5,
					},
				],
				fileList: [],
				qsywsStr: [],
				qfywfStr: [],
				ysqwsStr: [],
				yfqwfStr: [],
				itemArray: [{
						name: "银行对账单余额",
						value: 'beforeBankBalance'
					},
					{
						name: "加：企业已收,银行尚未入账金额",
						value: 'qsyws'
					},
					{
						name: "减：企业已付,银行尚未入账金额",
						value: 'qfywf'
					},
					{
						name: "调整后银行对账单余额",
						value: 'afterBankBalance'
					},
					{
						name: "企业银行存款日记账余额",
						value: 'beforeCompanyBalance'
					},
					{
						name: "加：银行已收,企业尚未入账金额",
						value: 'ysqws'
					},
					{
						name: "减：银行已付,企业尚未入账金额",
						value: 'yfqwf'
					},
					{
						name: "调整后企业银行存款日记账余额",
						value: 'afterCompanyBalance'
					}
				]
			}
		},
		components: {},
		methods: {
			handleBefore(id) {
				this.uploadData.id = id;
			},
			handleSuccess(response, file, fileList) {
				this.fileList = [];
				this.$message({
					message: response.msg,
					type: 'success'
				});
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			handleExceed(files, fileList) {
				this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			queryListByPage() {
				let param = {
					"page": this.currentPage,
					"row": this.pageSize,
					data: {
						bankname: this.bankname,
						customername: this.customername,
						status: this.status,
					}
				};
				this.axios.post('/perTaxToolTwo/dz/dzDealController/queryListByPage', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.total = res.data.count;
						this.tableList = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			
			queryListByPage1() {
				let param = {
					status: this.$route.query.state,
					date: this.$route.query.date,
				};
				this.axios.post('/perTaxToolTwo/dz/dzDealController/queryListByPage', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						// this.total = res.data.count;
						this.tableList = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
			
				}).catch(function(err) {
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},

			getBankList() {
				let param = {
					id: ""
				};
				this.axios.post('/perTaxToolTwo/dz/dzDealController/getBankList', param).then(res => {
					if (res.data.code == 200) {
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
				this.loading = true;
				this.bankname = this.formInline.bankname;
				this.customername = this.formInline.customername;
				this.status = this.formInline.status;
				this.currentPage = 1;
				this.queryListByPage()
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
			handleDel(index, row) {
				this.$confirm('确认删除任务?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.axios.get('/perTaxToolTwo/dz/dzDealController/deleteTbDzDetail?id=' + row.id).then(res => {
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
			handleEdit(index, row) {
				this.dialogVisible = true;
				this.tbDzDetail.id = row.id;
				this.tbDzDetail.status = row.status;
				this.detail = [];
				this.axios.get('/perTaxToolTwo/dz/dzDealController/getShowInfo?id=' + row.id).then(res => {
					if (res.data.code == 200) {
						this.bankList = res.data.data.bankList;
						this.e9List = res.data.data.e9List;
						this.adjustMap = res.data.data.adjustMap;
						this.adjustDetail = res.data.data.adjustDetail;
						this.tbDzDetail.balance = this.e9List[0] ? res.data.data.e9List[0].balance : '';

						this.details = res.data.data.details;
						// this.tbDzDetail.remark1 = res.data.data.adjustMap.beforeBankBalance;
						// this.tbDzDetail.remark2 = res.data.data.adjustMap.afterBankBalance;
						for (let i = 0; i < this.itemArray.length; i++) {
							this.detail.push({
								date: this.itemArray[i].name,
								amount: this.adjustMap[this.itemArray[i]["value"]],
								remark: ""
							})
						}
						console.log(this.detail)

						this.adjustDetail.unshift(this.detail[1]);
						this.adjustDetail.unshift(this.detail[0]);

						var index1 = this.adjustDetail.findIndex((value, index, array) => value.type == 1);
						var index2 = this.adjustDetail.findIndex((value, index, array) => value.type == 2);
						var index3 = this.adjustDetail.findIndex((value, index, array) => value.type == 3);
						var index4 = this.adjustDetail.findIndex((value, index, array) => value.type == 4);

						if (index2 > -1) {
							this.adjustDetail.splice(index2, 0, this.detail[2]);
						} else if (index3 > -1) {
							this.adjustDetail.splice(index3, 0, this.detail[2]);
						} else if (index4 > -1) {
							this.adjustDetail.splice(index4, 0, this.detail[2]);
						} else {
							this.adjustDetail.push(this.detail[2]);
						}
						var index1 = this.adjustDetail.findIndex((value, index, array) => value.type == 1);
						var index2 = this.adjustDetail.findIndex((value, index, array) => value.type == 2);
						var index3 = this.adjustDetail.findIndex((value, index, array) => value.type == 3);
						var index4 = this.adjustDetail.findIndex((value, index, array) => value.type == 4);
						if (index3 > -1) {
							this.adjustDetail.splice(index3, 0, this.detail[5]);
							this.adjustDetail.splice(index3, 0, this.detail[4]);
							this.adjustDetail.splice(index3, 0, this.detail[3]);
						} else if (index4 > -1) {
							this.adjustDetail.splice(index4, 0, this.detail[5]);
							this.adjustDetail.splice(index4, 0, this.detail[4]);
							this.adjustDetail.splice(index4, 0, this.detail[3]);
						} else {
							this.adjustDetail.push(this.detail[3]);
							this.adjustDetail.push(this.detail[4]);
							this.adjustDetail.push(this.detail[5]);
						}
						var index1 = this.adjustDetail.findIndex((value, index, array) => value.type == 1);
						var index2 = this.adjustDetail.findIndex((value, index, array) => value.type == 2);
						var index3 = this.adjustDetail.findIndex((value, index, array) => value.type == 3);
						var index4 = this.adjustDetail.findIndex((value, index, array) => value.type == 4);

						if (index4 > -1) {
							this.adjustDetail.splice(index4, 0, this.detail[6]);
						} else {
							this.adjustDetail.push(this.detail[6]);

						}
						// for (let i = 0; i < this.adjustDetail.length; i++) {
						// 	if (this.adjustDetail[i].type == 2) {
						// 		this.adjustDetail.splice(i, 0, this.detail[2]);
						// 		break;
						// 	}
						// }
						// for (let i = 0; i < this.adjustDetail.length; i++) {
						// 	if (this.adjustDetail[i].type == 3) {
						// 		
						// 		this.adjustDetail.splice(i, 0, this.detail[5]);
						// 		this.adjustDetail.splice(i, 0, this.detail[4]);
						// 		this.adjustDetail.splice(i, 0, this.detail[3]);
						// 		// this.adjustDetail.splice(i,0,this.detail[3]);
						// 		break;
						// 	};
						// }
						// for (let i = 0; i < this.adjustDetail.length; i++) {
						// 	if (this.adjustDetail[i].type == 4) {
						// 		this.adjustDetail.splice(i, 0, this.detail[6]);
						// 		break;
						// 	};
						// }

						this.adjustDetail.push(this.detail[7]);

					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取详情失败',
						type: 'error'
					});
				})

			},

			handleDownload(index, row) {
				// var arr = row.remark1.split(',');
				// arr.forEach(item =>{
				// 	window.location.href = '/perTaxToolTwo/dz/dzDealController/downloadPDF?filename=' + item;
				// })
				window.location.href = '/perTaxToolTwo/dz/dzDealController/downloadPDF?filename=' + row.remark1;
				// 				this.axios.get('/perTaxToolTwo/dz/dzDealController/downloadPDF?filename=' + row.remark1).then(res => {
				// 					if (res.data.code == 200) {
				// 						this.$message({
				// 							message: res.data.msg,
				// 							type: 'success'
				// 						});
				// 					} else {
				// 						this.$message({
				// 							message: res.data.msg,
				// 							type: 'error'
				// 						});
				// 					}
				// 
				// 				}).catch(function(err) {
				// 					this.$message({
				// 						message: '请求失败',
				// 						type: 'error'
				// 					});
				// 				})
			},


			hideDialog() {
				this.activeName = 'first';
				this.isCompare = false;
				this.dialogVisible = false;
			},
			handleClose() {
				this.activeName = 'first';
				this.isCompare = false;
				this.dialogVisible = false;
			},
			handleClick(tab, event) {
				this.isCompare = false;
				console.log(tab, event);
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage()
			},
			dzexport(){
				window.location.href = '/perTaxToolTwo/dz/dzDealController/export?id=' + this.tbDzDetail.id;
			},
			sendEmail(){
				this.axios.get('/perTaxToolTwo/dz/dzDealController/downloadAndSendEmail?id=' + this.tbDzDetail.id).then(res => {
					if (res.data.code == 200) {
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
						message: '发送',
						type: 'error'
					});
				})
				
			},
			preview(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.tempdetail = [];
						let param = {
							"e9List": this.e9List,
							"bankList": this.bankList,
							"tbDzDetail": this.tbDzDetail
						};
						this.axios.post('/perTaxToolTwo/dz/dzDealController/previewCompareE9', param).then(res => {
							if (res.data.code == 200) {
								// this.innerVisible = true;
								this.compareMap = res.data.data.adjustMap;
								this.compareDetail = res.data.data.adjustDetail;

								for (let i = 0; i < this.itemArray.length; i++) {
									this.tempdetail.push({
										date: this.itemArray[i].name,
										amount: this.compareMap[this.itemArray[i]["value"]],
										remark: ""
									})
								}

								this.compareDetail.unshift(this.tempdetail[1]);
								this.compareDetail.unshift(this.tempdetail[0]);

								var index1 = this.compareDetail.findIndex((value, index, array) => value.type == 1);
								var index2 = this.compareDetail.findIndex((value, index, array) => value.type == 2);
								var index3 = this.compareDetail.findIndex((value, index, array) => value.type == 3);
								var index4 = this.compareDetail.findIndex((value, index, array) => value.type == 4);

								if (index2 > -1) {
									this.compareDetail.splice(index2, 0, this.tempdetail[2]);
								} else if (index3 > -1) {
									this.compareDetail.splice(index3, 0, this.tempdetail[2]);
								} else if (index4 > -1) {
									this.compareDetail.splice(index4, 0, this.tempdetail[2]);
								} else {
									this.compareDetail.push(this.tempdetail[2]);
								}
								var index1 = this.compareDetail.findIndex((value, index, array) => value.type == 1);
								var index2 = this.compareDetail.findIndex((value, index, array) => value.type == 2);
								var index3 = this.compareDetail.findIndex((value, index, array) => value.type == 3);
								var index4 = this.compareDetail.findIndex((value, index, array) => value.type == 4);
								if (index3 > -1) {
									this.compareDetail.splice(index3, 0, this.tempdetail[5]);
									this.compareDetail.splice(index3, 0, this.tempdetail[4]);
									this.compareDetail.splice(index3, 0, this.tempdetail[3]);
								} else if (index4 > -1) {
									this.compareDetail.splice(index4, 0, this.tempdetail[5]);
									this.compareDetail.splice(index4, 0, this.tempdetail[4]);
									this.compareDetail.splice(index4, 0, this.tempdetail[3]);
								} else {
									this.compareDetail.push(this.tempdetail[3]);
									this.compareDetail.push(this.tempdetail[4]);
									this.compareDetail.push(this.tempdetail[5]);
								}
								var index1 = this.compareDetail.findIndex((value, index, array) => value.type == 1);
								var index2 = this.compareDetail.findIndex((value, index, array) => value.type == 2);
								var index3 = this.compareDetail.findIndex((value, index, array) => value.type == 3);
								var index4 = this.compareDetail.findIndex((value, index, array) => value.type == 4);

								if (index4 > -1) {
									this.compareDetail.splice(index4, 0, this.tempdetail[6]);
								} else {
									this.compareDetail.push(this.tempdetail[6]);

								}



								// 								this.compareDetail.unshift(this.tempdetail[1]);
								// 								this.compareDetail.unshift(this.tempdetail[0]);
								// 
								// 								for (let i = 0; i < this.compareDetail.length; i++) {
								// 									if (this.compareDetail[i].type == 2) {
								// 										this.compareDetail.splice(i, 0, this.tempdetail[2]);
								// 										break;
								// 									}
								// 								}
								// 								for (let i = 0; i < this.compareDetail.length; i++) {
								// 									if (this.compareDetail[i].type == 3) {
								// 										this.compareDetail.splice(i, 0, this.tempdetail[6]);
								// 										this.compareDetail.splice(i, 0, this.tempdetail[5]);
								// 										this.compareDetail.splice(i, 0, this.tempdetail[4]);
								// 										// this.adjustDetail.splice(i,0,this.detail[3]);
								// 										break;
								// 									};
								// 								}
								// 								for (let i = 0; i < this.compareDetail.length; i++) {
								// 									if (this.compareDetail[i].type == 4) {
								// 										this.compareDetail.splice(i, 0, this.tempdetail[3]);
								// 										break;
								// 									};
								// 								}

								this.compareDetail.push(this.tempdetail[7]);

								this.activeName = "first";
								this.isCompare = true;
							} else {
								this.$message({
									message: res.data.msg,
									type: 'error'
								});
							}

						}).catch(function(err) {
							this.$message({
								message: '预览失败',
								type: 'error'
							});
						})
					} else {
						console.log('error submit!!');
						return false;
					}
				});

			},
			compare() {
				let param = {
					"e9List": this.e9List,
					"bankList": this.bankList,
					"tbDzDetail": this.tbDzDetail
				};
				this.axios.post('/perTaxToolTwo/dz/dzDealController/artificialCompareE9', param).then(res => {
					if (res.data.code == 200) {
						this.$message({
							message: res.data.msg,
							type: 'success'
						});
						this.isCompare = false;
						this.innerVisible = false;
						this.dialogVisible = false;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '对比失败',
						type: 'error'
					});
				})
			},
			refresh() {
				let param = {
					id: this.tbDzDetail.id
				};
				this.axios.post('/perTaxToolTwo/dz/dzDealController/getE9List', param).then(res => {
					if (res.data.code == 200) {
						this.e9List = res.data.data;
						this.tbDzDetail.balance = res.data.data[0] ? parseFloat(res.data.data[0].balance) + parseFloat(res.data.data[0].creditAmount) - parseFloat(res.data.data[0].debtAmount) : '';
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '对比失败',
						type: 'error'
					});
				})
			},

			ignore(index, row) {
				row.isignore = 1;
			},
			resume(index, row) {
				row.isignore = 0;
			}
		},
		watch: {
		
			'$route'(to, from) {
				// init data
				if(this.$route.query){
					this.formInline.status = this.$route.query.status;
					this.search();
				}else{
					this.queryListByPage();
				}
				
				this.getBankList()
		
			}
		},
		created() {
			if(this.$route.query){
				this.formInline.status = this.$route.query.status;
				this.search();
			}else{
				this.queryListByPage();
			}
			
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
			width: 2.4rem;
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
			width: 2.4rem;
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

	/deep/ .el-dialog {
		.el-table:before {
			background-color: transparent;
		}
	}
</style>
