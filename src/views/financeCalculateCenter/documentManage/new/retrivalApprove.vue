<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>系统管理</el-breadcrumb-item>
			<el-breadcrumb-item>档案权限审批</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :model="uploadData" size="small" ref='formName' inline label-width="100px">
					<el-form-item label="用户名" prop="phone">
						<el-input v-model="uploadData.phone" placeholder="请输入" clearable filterable>
						</el-input>
					</el-form-item>



					<el-button type="primary" @click='search()' size="small" style="float: right;margin-right: 20px;"> 查 找 </el-button>

					<!-- <el-button type="primary" @click='add()' size="mini">新增</el-button> -->
				</el-form>
			</div>
		</div>
		<div class='main_contain'>

			<el-table :data="tableData" style="width: 100%;" border v-loading='loading10'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="用户名" prop="phone" :resizable="false"></el-table-column>
				<el-table-column align="center" label="联系人" prop='contactName' :resizable="false"></el-table-column>
				<el-table-column align="center" label="申请原因" prop="applyReason" :resizable="false"></el-table-column>
				<el-table-column align="center" label="申请状态" prop="applyStatus" :resizable="false">
					<template slot-scope="scope">
						<span v-show="scope.row.applyStatus == 1" style="color: #E6A23C;">审批中</span>
						<span v-show="scope.row.applyStatus == 2" style="color: #67C23A;">审批通过</span>
						<span v-show="scope.row.applyStatus == 3" style="color: #F56C6C;">审批不通过</span>
					</template>
				</el-table-column>



				<el-table-column align="center" label="申请时间" :resizable="false">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.createTime,'yyyy-MM-dd')}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" :resizable="false">
					<template slot-scope="scope">
						<el-button type="text" size="mini" v-show="scope.row.applyStatus == 1" @click='agree(scope.row)'>同意</el-button>
						<el-button type="text" size="mini" v-show="scope.row.applyStatus == 1" @click='noagree(scope.row)'>不同意</el-button>
						
						<el-button type="text" size="mini" v-show="scope.row.applyStatus == 2" @click='allocation(scope.row)'>权限分配</el-button>
						<el-button type="text" size="mini" v-show="scope.row.applyStatus == 2" @click='cancelAllocation(scope.row)'>取消分配</el-button>
					</template>
				</el-table-column>
				<!-- <el-table-column align="center" label="状态" prop="fendCreditBalance" :resizable="false"></el-table-column> -->

			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '4')})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>
		</div>
		
		<el-dialog title="选择单位" :visible.sync="dialogVisible1" width="800px" :before-close="hideDialog1" id="dialog">
		
			<el-table :data="detail" style="width: 100%;" v-loading='loading' @selection-change="(val) => handleSelectionChange(val,index)"
			 ref='multipleTable'>
				<el-table-column align="center" type="selection" width="55"></el-table-column>
				<el-table-column align="center" label="公司名称" prop="customerName" :resizable="false" width="400px"></el-table-column>
				<!-- <el-table-column align="center" label="公司类型" prop='userPassword' :resizable="false"></el-table-column> -->
				<el-table-column align="center" label="档案数量" prop="remark2" :resizable="false"></el-table-column>
				<!-- <el-table-column align="center" label="单位注册时间" prop="remark2" :resizable="false"></el-table-column> -->
		
				<!-- <el-table-column align="center" label="操作" prop="fendDebitBalance" :resizable="false">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click='selectFile(scope.row.customerId)'>选择档案</el-button>
					</template>
				</el-table-column> -->
		
			</el-table>
		
			<el-pagination background style="margin-top:10px;text-align: center;" @current-change="((val)=>{handleCurrentChange1(val, '4')})"
			 :current-page="currentPage1" :page-size="pageSize1" layout="total, prev, pager, next" :total="total1">
			</el-pagination>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideClose1">取 消</el-button>
				<el-button type="primary" @click="selectFile">开始分配</el-button>
			</span>
			<!-- <div class='btn_contain clearfix'>
				<span class='commit' @click='commit1'>完成</span>
				<span class='close' @click="hideClose1">关闭</span>
			</div> -->
			<el-dialog width="1200px" title="选择档案" :visible.sync="innerVisible" append-to-body>
				<div class='clearfix' style="height: 550px;">
					<el-tree accordion :data="tree" :props="defaultProps" @node-click="handleNodeClick" style='width: 200px;float: left;margin-right: 10px;'></el-tree>
					<div style="width: calc(100% - 210px);float: right;">
						<el-table :data="result" stripe border @selection-change="((val)=>{handleSelectionChange2(val)})" v-loading="loading1"
						 :row-key="getRowKeys" height="500px">
							<el-table-column align="center" type="selection" width="55"></el-table-column>
							<el-table-column align="center" label="公司名称" prop="customerName" :resizable="false"></el-table-column>
							<el-table-column align="center" label="案卷号" prop='dossierNumber' :resizable="false"></el-table-column>
							<el-table-column align="center" label="案卷题名" prop='dossierName' :resizable="false"></el-table-column>
							<!-- <el-table-column align="center" label="案卷号" prop='dossierNumber' :resizable="false"></el-table-column> -->
							<el-table-column align="center" label="所属期" prop='belongDate' :resizable="false"></el-table-column>
							<!-- <el-table-column align="center" label="归档时间" prop="storageTime" :resizable="false">
							
							</el-table-column> -->
						</el-table>
						<el-pagination background style="margin-top:10px;text-align: center;" @current-change="((val)=>{handleCurrentChange2(val)})"
						 :current-page="currentPage2" :page-size="pageSize2" layout="total, prev, pager, next" :total="total2" v-show='total2 > 0'>
						</el-pagination>
					</div>
		
				</div>
				<span slot="footer" class="dialog-footer">
					<el-button @click="hideClose2">取 消</el-button>
					<el-button type="primary" @click="commitApply">确认分配</el-button>
				</span>
			</el-dialog>
		
		</el-dialog>
		<el-dialog title="取消分配" :visible.sync="dialogVisible5" width="800px" :before-close="hideDialog5">
		
			<el-table :data="detail5" style="width: 100%;" v-loading='loading5' @selection-change="(val) => handleSelectionChange5(val,index)"
			 ref='multipleTable'>
				<el-table-column align="center" type="selection" width="55"></el-table-column>
				<el-table-column align="center" label="公司名称" prop="customerName" :resizable="false"></el-table-column>
				<!-- <el-table-column align="center" label="公司类型" prop='userPassword' :resizable="false"></el-table-column> -->
				<!-- <el-table-column align="center" label="档案数量" prop="remark2" :resizable="false"></el-table-column> -->
				<!-- <el-table-column <ali></ali>gn="center" label="单位注册时间" prop="remark2" :resizable="false"></el-table-column> -->
		
				<!-- <el-table-column align="center" label="操作" prop="fendDebitBalance" :resizable="false">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click='selectFile(scope.row.customerId)'>选择档案</el-button>
					</template>
				</el-table-column> -->
		
			</el-table>
		
			<el-pagination background style="margin-top:10px;text-align: center;" @current-change="((val)=>{handleCurrentChange5(val, '4')})"
			 :current-page="currentPage5" :page-size="pageSize5" layout="total, prev, pager, next" :total="total5">
			</el-pagination>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideClose5">关  闭</el-button>
				<el-button type="primary" @click="commitCancel">取消分配</el-button>
			</span>
			<!-- <div class='btn_contain clearfix'>
				<span class='commit' @click='commit1'>完成</span>
				<span class='close' @click="hideClose1">关闭</span>
			</div> -->
			
		
		</el-dialog>
		
	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				allotUsername: '',
				tree: [],
				defaultProps: {
					children: 'archivesCategoryInfoList',
					label: 'categoryrName'
				},
				categoryrIdSelect: '',
				result: [],
				loading: false,
				loading1: false,
				loading5: false,
				loading10: false,
				dialogVisible: false,
				dialogVisible1: false,
				dialogVisible2: false,
				dialogVisible5: false,
				value6: '',
				selectNum: new Date().getMonth(),

				uploadData: {
					keyStatus: "1"
				},
				customerId: 0,
				tableData: [],
				userName: '',
				keyStatus: '',
				keyValidityStartTime: '',
				keyValidityEndTime: '',
				total: 0,
				pageSize: 10,
				currentPage: 1,
				currentPage2: 1,
				currentPage5: 1,
				total1: 0,
				total2: 0,
				total5: 0,
				pageSize1: 10,
				pageSize2: 10,
				pageSize5: 10,
				currentPage1: 1,
				info: {},
				detail: [],
				detail1: [],
				detail5: [],
				multipleSelection: [],
				multipleSelection5: [],
				archivesPermissionId: '',
				innerVisible: false,
				arr: [],
				multiSelection: [],
				multiSelection1: [],
				keyStatusList: [{
						label: '有效',
						value: 1
					},
					{
						label: '无效',
						value: 0
					}
				]
			}
		},
		components: {},
		methods: {
			hideDialog1() {
				this.dialogVisible1 = false;
			},
			hideClose1() {
				this.dialogVisible1 = false;
			
			},
			hideClose2() {
				this.innerVisible = false;
			
			},
			hideDialog5() {
				this.dialogVisible5 = false;
			},
			hideClose5() {
				this.dialogVisible5 = false;
			
			},
			handleCurrentChange1(val) {
				this.currentPage1 = val;
				this.getCustomerArchivesStorageInfoInfo('')
			},
			handleCurrentChange5(val) {
				this.currentPage5 = val;
				this.getCustomerArchivesStorageInfoInfo('Y')
			},
			handleCurrentChange2(val) {
				this.currentPage2 = val;
				this.queryDetail();
			},
			handleSelectionChange(val, index) {
				if (val.length > 1) {
					var newVal = val.pop();
					this.$refs.multipleTable.clearSelection()
					this.$refs.multipleTable.toggleRowSelection(newVal)
					this.multipleSelection = newVal;
				} else {
					this.multipleSelection = val;
				}
			
				// this.multipleSelection[index] = val;
				// console.log(this.multipleSelection);
				// this.arr = [];
				// for (let i = 0; i < this.multipleSelection.length; i++) {
				// 	this.multipleSelection[i].forEach(item => {
				// 		this.arr.push(item);
				// 	})
				// }
				// console.log(this.arr);
			},
			handleSelectionChange5(val, index) {
				this.multipleSelection5 = val;
			},
			getRowKeys(row) {
				return row.archivesStorageId
			},
			handleNodeClick(data) {
				this.categoryrIdSelect = data.categoryrId;
				this.currentPage2 = 1;
				this.queryDetail();
			
			},
			handleSelectionChange2(val, index) {
				this.multiSelection1 = val;
			},
			getTree() {
				let params = {
					categoryrName: ''
				}
				this.axios.post('/perTaxToolTwo/ArchivesCategoryInfo/getArchivesCategoryInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.tree = res.data.data;
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
			queryDetail() {
				this.loading1 = true;
				let params = {
					data: {
						"categoryrId": this.categoryrIdSelect,
						"customerId":this.multipleSelection[0].customerId
					},
					page: this.currentPage2,
					row: this.pageSize2
			
			
				}
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/getArchivesPage', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading1 = false;
						if (res.data.code == 200) {
							this.result = res.data.data;
							// this.all = res.data.data;
							// this.result = [];
							// for (let i = 0, len = this.all.length; i < len; i += this.pageSize1) {
							// 	this.result.push(this.all.slice(i, i + this.pageSize1));
							// }
							this.total2 = res.data.count;
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
						this.loading1 = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage();
			},
			agree(row) {

				this.$confirm('确认同意?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"archivesPermissionApplyId": row.archivesPermissionApplyId,
						"applyStatus": "2",
					};
					this.axios.post('/perTaxToolTwo/ArchivesPermissionApply/updateArchivesPermissionApply', params)
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							if (res.data.code == 200) {
								this.queryPage();
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
						message: '已取消'
					});
				});

			},

			noagree(row) {
				this.$prompt('请输入不通过原因', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({
					value
				}) => {
					let params = {
						"archivesPermissionApplyId": row.archivesPermissionApplyId,
						"applyStatus": "3",
						"approveReason":value
					};
					this.axios.post('/perTaxToolTwo/ArchivesPermissionApply/updateArchivesPermissionApply', params)
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							if (res.data.code == 200) {
								this.queryPage();
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
						message: '已取消'
					});
				});

				
			},

			search() {
				this.phone = this.uploadData.phone;
				this.queryPage()
			},

			queryPage() {
				this.loading10 = true;
				let params = {
					page: this.currentPage,
					row: this.pageSize,
					data: {
						"phone": this.phone,

					}

				};
				this.axios.post('/perTaxToolTwo/ArchivesPermissionApply/getArchivesPermissionApplyByPage', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading10 = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data;
							this.total = res.data.count;
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
						this.loading10 = false;
						this.tableData = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			cancelAllocation(row){
				this.canarchivesPermissionId = row.archivesPermissionId;
				this.canallotUsername = row.userName;
				
				this.getCustomerArchivesStorageInfoInfo('Y')
			},
			allocation(row) {
				var _this = this;
				this.archivesPermissionId = row.archivesPermissionId;
				this.allotUsername = row.userName;
				this.dialogVisible1 = true;
				this.getCustomerArchivesStorageInfoInfo('')
			},
			
			getCustomerArchivesStorageInfoInfo(tag) {
				if(tag == 'Y'){
					var remark3 = this.canarchivesPermissionId;
					var pageSize = 10;
				}else{
					var remark3 = this.archivesPermissionId;
					var pageSize = 10;
				}
				this.loading5 = true;
				let params = {
					pageNum: this.currentPage1,
					pageSize: pageSize,
			
					"status": 2,
					remark3: remark3,
					"ifAssign": tag,
					"customerName": "",
					"taxType": "",
			
				};
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/getCustomerArchivesStorageInfoInfo', params)
					.then(res => {
						this.loading5 = false;
						if (res.data.code == 200) {
							if(tag == ''){
								this.detail = res.data.data.list;
								
								this.total1 = res.data.count;
								this.$message({
									message: res.data.msg,
									type: 'success'
								});
							}else{
								this.detail5 = res.data.data.list;
								
								this.total5 = res.data.count;
								if(this.detail5.length > 0){
									this.dialogVisible5 = true;
									this.$message({
										message: res.data.msg,
										type: 'success'
									});
								}else{
									this.$message({
										message: '暂无已分配客户',
										type: 'warning'
									});
								}
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
						this.loading5 = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			commitCancel(){
				var _this = this;
				// this.innerVisible = true;
				let params = {
					"userName": this.canallotUsername,
					"archivesPermissionId": this.canarchivesPermissionId,
					"archivesInfoList": this.multipleSelection5
				};
				this.axios.post('/perTaxToolTwo/ArchivesPermissionInfo/disableAssignUserPermission', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible5 = false;
							this.queryPage();
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
			},
			
			selectFile() {
				var _this = this;
				this.innerVisible = true;
				let params = {
					data: {
						"categoryrId": '',
						"customerId":this.multipleSelection[0].customerId
					},
					page: this.currentPage2,
					row: this.pageSize2
				
				
				}
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/getArchivesPage', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading1 = false;
						if (res.data.code == 200) {
							this.result = res.data.data;
							// this.all = res.data.data;
							// this.result = [];
							// for (let i = 0, len = this.all.length; i < len; i += this.pageSize1) {
							// 	this.result.push(this.all.slice(i, i + this.pageSize1));
							// }
							this.total2 = res.data.count;
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
						this.loading1 = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			commitApply() {
				var _this = this;
				// this.innerVisible = true;
				let params = {
					"userName": this.allotUsername,
					"archivesPermissionId": this.archivesPermissionId,
					"archivesInfoList": this.multiSelection1
				};
				this.axios.post('/perTaxToolTwo/ArchivesPermissionInfo/assignUserPermission', params)
					.then(res => {
						if (res.data.code == 200) {
							this.innerVisible = false;
							this.dialogVisible1 = false;
							this.queryPage();
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
			},
		},
		computed: {},
		created() {
			this.queryPage();
			this.getTree();
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
			height: 40px;
			line-height: 39px;
			padding-left: 20px;
			/* background-color: #fff; */
			border-top: 1px solid #F2F6FC;
			box-sizing: border-box
		}

		/deep/ .el-table td,
		/deep/ .el-table th {
			padding: 6px 0;
		}

		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 30px;
			background-color: #f9f9f9;
		}

		/deep/ .el-table th {
			background-color: #f9f9f9;
		}

		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #f9f9f9;
		}

		/deep/ .el-table__body tr,
		.el-table__body td {
			padding: 0;
			height: 30px;
			background-color: #fff;
		}

		/deep/ .el-table__body tr.el-table__row--striped {
			background-color: #f9f9f9;
		}

		/deep/ .el-table thead {
			color: #8C8C8C;
		}

		/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
			background-color: #efe9e5;
		}

		/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
			border-bottom-color: #fff;
			background: #f9f9f9;
		}

		/deep/ .search_contain {
			background: #fff;
			/* height: 40px; */
			/* padding-left: 20px; */
			padding: 0.3rem 20px 0.08rem;
			margin: 0px 20px 10px;

			.info {
				height: 40px;
				line-height: 40px;
			}

			a {
				margin-left: 10px;
			}

			.el-input {
				width: 180px;
			}

			.el-form-item {
				margin-right: 30px;
			}

		}

		.main_contain {
			background: #fff;
			margin: 12px 20px 20px;
			padding: 12px 20px 20px;
			/* height: calc(100% - 190px); */

			h5 {
				height: 40px;
				line-height: 40px;
			}

			/deep/ .el-pagination {
				text-align: center;
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

	/deep/ #dialog.el-dialog {
		thead .el-table-column--selection .cell {
			display: none;
		}



		.mark {
			color: #ed878e;
		}

		/deep/ .el-dialog__body {
			padding-top: 0;
			padding-bottom: 0px;
		}

		/deep/ .el-tabs__content {
			height: 550px;
			overflow: auto;
		}

		/deep/ .el-select,
		/deep/ .el-input,
		/deep/ .el-date-editor {
			width: 260px;
		}

		/deep/ .el-range-editor {
			width: 240px;
		}

		/*/deep/ .el-input__inner {
			height: 18px;
			line-height: 18px;
		}*/
		/deep/ .el-input__icon {
			height: 100%;
			width: 25px;
			text-align: center;
			line-height: 18px;
		}

		/deep/ .longLabel .el-form-item__label {
			line-height: 16px;
		}

		/deep/ .textareaWidth .el-textarea {
			width: 830px
		}

		/*滚动条样式*/
		::-webkit-scrollbar {
			width: 0.04rem;
			height: 0.04rem;
		}

		::-webkit-scrollbar-thumb {
			border-radius: 0.10rem;
			-webkit-box-shadow: inset 0 0 0.05rem rgba(0, 0, 0, 0.2);
			background: rgba(0, 0, 0, 0.2);
		}

		::-webkit-scrollbar-track {
			-webkit-box-shadow: inset 0 0 0.05rem rgba(0, 0, 0, 0.2);
			border-radius: 0;
			background: rgba(0, 0, 0, 0.1);
		}
	}
</style>
