<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>调阅人查询</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="人员" prop="dossierName">
						<el-input v-model="uploadData.userName" placeholder="请输入人员" clearable filterable>
						</el-input>
					</el-form-item>
					<el-form-item label="是否有效" prop="dossierName">
						<el-switch v-model="uploadData.keyStatus" active-color="#13ce66" inactive-color="#ff4949" active-value="1"
						 inactive-value="0">
						</el-switch>
					</el-form-item>
					<el-form-item label="有效开始时间" prop="dossierName">
						<el-date-picker v-model="uploadData.keyValidityStartTime" type="date" placeholder="有效开始时间" value-format="yyyy-MM-dd"
						 format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="有效结束时间" prop="dossierName">
						<el-date-picker v-model="uploadData.keyValidityEndTime" type="date" placeholder="有效结束时间" value-format="yyyy-MM-dd"
						 format="yyyy-MM-dd">
						</el-date-picker>
					</el-form-item>
					<!-- <el-form-item label="操作人" prop="dossierName">
						<el-select v-model="uploadData.customerId" placeholder="请选择公司名称" clearable filterable>
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
						</el-select>
					</el-form-item> -->

					<el-button type="primary" @click='search()' size="mini">查询</el-button>
					<el-button type="primary" @click='add()' size="mini">新增</el-button>
				</el-form>
			</div>
		</div>
		<div class='main_contain'>

			<el-table :data="tableData" style="width: 100%;" stripe border v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
				<el-table-column align="center" label="用户名" prop="userName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="密码" prop='userPassword' :resizable="false"></el-table-column>
				<el-table-column align="center" label="Key" prop="keyValue" :resizable="false" width="400"></el-table-column>
				<el-table-column align="center" label="Key状态" :resizable="false">
					<template slot-scope="scope">
						<span v-if='scope.row.keyStatus == 0'>无效</span>
						<span v-if='scope.row.keyStatus == 1'>有效</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="有效开始时间" :resizable="false">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.keyValidityStartTime,'yyyy-MM-dd')}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="有效结束时间" :resizable="false">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.keyValidityEndTime,'yyyy-MM-dd')}}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column align="center" label="操作人" prop="fytddebit" :resizable="false"></el-table-column> -->
				<el-table-column align="center" label="操作时间" :resizable="false">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.createTime,'yyyy-MM-dd')}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" prop="fendDebitBalance" :resizable="false">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click='allocation(scope.row)'>分配权限</el-button>
					</template>
				</el-table-column>
				<!-- <el-table-column align="center" label="状态" prop="fendCreditBalance" :resizable="false"></el-table-column> -->

			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '4')})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>
		</div>


		<el-dialog title="新增调阅人" :visible.sync="dialogVisible" width="400px" :before-close="hideDialog">
			<el-form :inline="true" ref="ruleForm3" :model="info" class="demo-form-inline" label-width="120px" size="mini">
				<div>
					<el-form-item label="用户名" prop="userName">
						<el-input v-model="info.userName" disabled></el-input>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="用户密码" prop="userPassword">
						<el-input v-model="info.userPassword"></el-input>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="key" prop="keyValue">
						<el-input v-model="info.keyValue" disabled></el-input>
					</el-form-item>
				</div>

				<div>
					<el-form-item label="有效开始时间" prop="keyValidityStartTime" id='file4'>
						<el-date-picker v-model="info.keyValidityStartTime" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
						 placeholder="请选择有效开始时间"></el-date-picker>
					</el-form-item>
				</div>
				<div>
					<el-form-item label="有效结束时间" prop="keyValidityEndTime" id='file4'>
						<el-date-picker v-model="info.keyValidityEndTime" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
						 placeholder="请选择有效结束时间"></el-date-picker>
					</el-form-item>
				</div>
			</el-form>
			<div class='btn_contain clearfix'>
				<span class='commit' @click='commit'>完成</span>
				<span class='close' @click="hideClose">关闭</span>
			</div>
		</el-dialog>


		<el-dialog title="分配权限" :visible.sync="dialogVisible1" width="800px" :before-close="hideDialog1">
			<div v-for='(item,index) in detail'>
				<el-table :data="item" style="width: 100%;" stripe border v-loading='loading' @selection-change="(val) => handleSelectionChange(val,index)"
				 v-show='index+1 == currentPage1' ref='multipleTable'>
					<el-table-column align="center" type="selection" width="55"></el-table-column>
					<el-table-column align="center" label="公司名称" prop="customerName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="公司类型" prop='userPassword' :resizable="false"></el-table-column>
					<el-table-column align="center" label="档案数量" prop="remark2" :resizable="false"></el-table-column>
					<el-table-column align="center" label="操作人" prop="remark2" :resizable="false"></el-table-column>

					<!-- <el-table-column align="center" label="操作" prop="fendDebitBalance" :resizable="false">
						<template slot-scope="scope">
							<el-button type="text" size="mini" @click='selectFile(scope.row.customerId)'>选择档案</el-button>
						</template>
					</el-table-column> -->

				</el-table>

			</div>
			<el-pagination background style="margin-top:10px;text-align: right;" @current-change="((val)=>{handleCurrentChange1(val, '4')})"
			 :current-page="currentPage1" :page-size="pageSize1" layout="total, prev, pager, next" :total="total1">
			</el-pagination>
			<div class='btn_contain clearfix'>
				<span class='commit' @click='commit1'>完成</span>
				<span class='close' @click="hideClose1">关闭</span>
			</div>
			<el-dialog width="800px" title="选择档案" :visible.sync="innerVisible" append-to-body>
				<el-table :data="item" style="width: 100%;" stripe border v-loading='loading' @selection-change="handleSelectionChange1"
				 v-for='(item,index) in detail1' v-show='index+1 == currentPage2' ref='multipleTable1'>
					<el-table-column align="center" type="selection" width="55"></el-table-column>
					<el-table-column align="center" label="公司名称" prop="customerName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="案卷号" prop='dossierNumber' :resizable="false"></el-table-column>
					<el-table-column align="center" label="案卷题名" prop='dossierName' :resizable="false"></el-table-column>
					<el-table-column align="center" label="案卷号" prop='dossierNumber' :resizable="false"></el-table-column>
					<el-table-column align="center" label="所属期" prop='belongDate' :resizable="false"></el-table-column>
					<el-table-column align="center" label="归档时间" prop="storageTime" :resizable="false">

					</el-table-column>

				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange1(val, '4')})"
				 :current-page="currentPage2" :page-size="pageSize2" layout="total, prev, pager, next" :total="total2">
				</el-pagination>
			</el-dialog>

		</el-dialog>



	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				loading: false,
				dialogVisible: false,
				dialogVisible1: false,
				value6: '',
				selectNum: new Date().getMonth(),
				percentage: 0,
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
				total1: 0,
				total2: 0,
				pageSize1: 2,
				pageSize2: 2,
				currentPage1: 1,
				info: {},
				detail: [],
				detail1: [],
				multipleSelection: [],
				archivesPermissionId: '',
				innerVisible: false,
				arr:[]
			}
		},
		components: {},
		methods: {
			add() {
				this.dialogVisible = true;
				let params = {
					"userName": ''

				};
				this.axios.post('/perTaxToolTwo/ArchivesPermissionInfo/getUserAccountInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.info = res.data.data;

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
			hideDialog() {
				this.info = {};
				this.dialogVisible = false;
			},
			hideClose() {
				this.info = {};
				this.dialogVisible = false;

			},
			hideDialog1() {
				this.dialogVisible1 = false;
			},
			hideClose1() {
				this.dialogVisible1 = false;

			},
			commit() {


				let params = this.info;
				this.axios.post('/perTaxToolTwo/ArchivesPermissionInfo/GenerateUserIdentityInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.queryPage();
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
					})
					.catch(err => {
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			search() {
				this.userName = this.uploadData.userName;
				this.keyStatus = this.uploadData.keyStatus;
				this.keyValidityStartTime = this.uploadData.keyValidityStartTime;
				this.keyValidityEndTime = this.uploadData.keyValidityEndTime;
				this.queryPage()
			},


			allocation(row) {
				var _this = this;
				this.archivesPermissionId = row.archivesPermissionId;
				this.dialogVisible1 = true;
				let params = {
					"status": 2,
					remark3: this.archivesPermissionId
				};
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/getCustomerArchivesStorageInfoInfo', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.detail = [];
							for (let i = 0; i < res.data.data.length; i += 2) {
								this.detail.push(res.data.data.slice(i, i + 2));
							}
							this.total1 = res.data.count;
							this.$nextTick(() => {
								this.detail.forEach((row, index) => {
									row.forEach((item, inde) => {

										if (item.ifAssign == 'Y') {
											_this.$refs.multipleTable[index].toggleRowSelection(item)
										}
									})
								})
							});
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
			selectFile(customerId) {
				var _this = this;
				this.innerVisible = true;
				let params = {
					"customerId": customerId,
					remark3: this.archivesPermissionId
				};
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/getArchivesStorageInfoByCustomer', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.detail1 = [];
							for (let i = 0; i < res.data.data.length; i += 2) {
								this.detail1.push(res.data.data.slice(i, i + 2));
							}
							this.total2 = res.data.count;
							this.$nextTick(() => {
								this.detail1.forEach((row, index) => {
									row.forEach((item, inde) => {

										if (item.ifAssign == 'Y') {
											_this.$refs.multipleTable1[index].toggleRowSelection(item)
										}
									})
								})
							});
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
			commit1() {

				let params = {
					archivesPermissionId: this.archivesPermissionId,
					archivesInfoList: this.arr
				}
				this.axios.post('/perTaxToolTwo/ArchivesPermissionInfo/assignUserPermission', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
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
				this.queryPage()
			},
			handleCurrentChange1(val) {
				this.currentPage1 = val;
			},
			handleSelectionChange(val, index) {
				this.multipleSelection[index] = val;
				console.log(this.multipleSelection);
				this.arr = [];
				for(let i = 0;i < this.multipleSelection.length;i++){
					this.multipleSelection[i].forEach(item => {
						this.arr.push(item);
					})
				}
				console.log(this.arr);
			},
			queryPage() {
				let params = {
					page: 1,
					row: 10,
					data: {
						"userName": this.userName,
						"keyStatus": this.keyStatus,
						keyValidityStartTime: this.keyValidityStartTime,
						keyValidityEndTime: this.keyValidityEndTime,
					}

				};
				this.axios.post('/perTaxToolTwo/ArchivesPermissionInfo/getGenerateUserInfoPage', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
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
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			}
		},
		computed: {},
		created() {
			this.queryPage();
			this.percentage = this.selectNum * (100 / 12);
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
			margin: 0 20px;
			padding: 20px 20px;
			height: calc(100% - 190px);

			h5 {
				height: 40px;
				line-height: 40px;
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
	
	/deep/ .dialog {
	
	
		ul {
			background: #f8f8f8;
			padding-left: 0.24rem;
			padding-right: 0.24rem;
			padding-top: 0.2rem;
			height: 3.5rem;
			overflow-y: auto;
			margin-top: 0.1rem;
	
			li {
				height: 0.24rem;
				font-size: 0.12rem;
			}
		}
	
		.mark {
			color: #ed878e;
		}
	
		/deep/ .el-dialog__body {
			padding-top: 0;
		}
	
		/deep/ .el-tabs__content {
			height: 550px;
			overflow: auto;
		}
	
		/deep/ .el-select,
		/deep/ .el-input,
		/deep/ .el-date-editor {
			width: 190px;
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
