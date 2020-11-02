<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>档案管理</el-breadcrumb-item>
			<el-breadcrumb-item>档案借阅登记</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="uploadData" class="demo-form-inline" size="mini" ref='formName'>
					<el-form-item label="借阅时间" prop="borrowTime" :rules="[$rules.requiredSelect]">
						<el-date-picker v-model="uploadData.borrowTime" type="date" placeholder="请选择" clearable value-format='yyyy-MM-dd'>
						</el-date-picker>
					</el-form-item>
					<!-- <el-form-item label="借阅单位" prop="accountPeriod">
						<el-select v-model="uploadData.customerId" placeholder="请选择" clearable filterable>
							<el-option v-for="item in $store.state.cust" :label="item.customerName" :value='item.customerId'></el-option>
						</el-select>
					</el-form-item> -->
					<el-form-item label="借阅人" prop="borrowUserName">
						<el-input v-model="$store.state.user.phone" disabled>
						</el-input>
					</el-form-item>
					<!-- <el-form-item label="调阅档案时间">

						<el-date-picker v-model="uploadData.accountPeriod" type="date" placeholder="请选择" clearable value-format='yyyy-MM-dd'>
						</el-date-picker>
					</el-form-item> -->
					<!-- <el-form-item label="档案号" prop="accountPeriod">
						<el-input v-model="uploadData.dossierName" placeholder="请输入" clearable filterable>
						</el-input>
					</el-form-item> -->
					<!-- <el-form-item label="卷件数" prop="accountPeriod">
						<el-input v-model="uploadData.dossierName" placeholder="请输入" clearable filterable>
						</el-input>
					</el-form-item> -->
					<el-form-item label="利用目的" prop="borrowPourse" :rules="[$rules.requiredInput]">
						<el-input v-model="uploadData.borrowPourse" placeholder="请输入" clearable filterable>
						</el-input>
					</el-form-item>
					<el-form-item label="归还日期" prop="returnTime" :rules="[$rules.requiredSelect]">
						<el-date-picker v-model="uploadData.returnTime" type="date" placeholder="请选择" clearable value-format='yyyy-MM-dd'>
						</el-date-picker>
					</el-form-item>
					<el-form-item label="审批人" prop="approveUserid">
						<el-input v-model="uploadData.approveUserid" disabled>
						</el-input>
					</el-form-item>
					<el-button type="primary" @click='showFile' size="mini">选择档案</el-button>
					<el-button type="primary" @click='selectExcel' size="mini">保存</el-button>

				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<el-table :data="detail" style="width: 100%;margin-top: 12px;" stripe border>
				<!-- <el-table-column align="center" label="借阅人名称" prop="borrowUserName" :resizable="false"></el-table-column> -->
				<el-table-column align="center" label="借阅时间" :resizable="false">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.borrowTime,'yyyy-MM-dd')}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="借阅数量" prop="borrowCount" :resizable="false"></el-table-column>
				<el-table-column align="center" label="借阅目的" prop="borrowPourse" :resizable="false"></el-table-column>

				<el-table-column align="center" label="归还日期" :resizable="false">
					<template slot-scope="scope">
						<span>{{formatTimeToStr(scope.row.returnTime,'yyyy-MM-dd')}}</span>
					</template>
				</el-table-column>
				<!-- <el-table-column align="center" label="审批人姓名" prop="approveUserName" :resizable="false"></el-table-column> -->


			</el-table>
			<el-pagination background layout="total,prev, pager, next, jumper" :total="total" :page-size='pageSize'
			 @current-change='handleCurrentChange' :current-page="currentPage">
			</el-pagination>
		</div>

		<el-dialog title="选择档案" :visible.sync="dialogVisible" width="100%" :before-close="handleClose">
			<div class='clearfix'>
				<el-tree accordion :data="tree" :props="defaultProps" @node-click="handleNodeClick" style='width: 200px;float: left;margin-right: 10px;'></el-tree>
				<div style="width: calc(100% - 210px);float: right;">
					<!-- <el-table v-for='(item,index) in result.length' :data="result[index]" 
					 v-show='index == currentPage1 - 1' stripe border @selection-change="((val)=>{handleSelectionChange(val,index)})">
						<el-table-column align="center" type="selection" width="55"></el-table-column>
						<el-table-column align="center" label="全宗号" prop="fondsNumber"></el-table-column>
						<el-table-column align="center" label="目录号" prop="catalogNumber"></el-table-column>
						<el-table-column align="center" label="案卷号" prop="dossierNumber" width="80"></el-table-column>
						<el-table-column align="center" label="保管期限" prop="storageLimits"></el-table-column>
						<el-table-column align="center" label="案卷题名" prop="dossierName" width="200"></el-table-column>
						<el-table-column align="center" label="所属账期" prop="belongDate"></el-table-column>
						<el-table-column align="center" label="报表张数" prop="accountPeriod" width="80"></el-table-column>
						<el-table-column align="center" label="附件张数" prop="accountPeriod" width="80"></el-table-column>
					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange1(val)})"
					 :current-page="currentPage1" :page-size="pageSize1" layout="total, prev, pager, next" :total="total1" v-show='total1 > 0'>
					</el-pagination> -->
					
					<el-table :data="result" stripe border @selection-change="((val)=>{handleSelectionChange(val)})" v-loading="loading" :row-key="getRowKeys">
						<el-table-column align="center" type="selection" width="55" :reserve-selection="true"></el-table-column>
						<el-table-column align="center" label="全宗号" prop="fondsNumber"></el-table-column>
						<el-table-column align="center" label="目录号" prop="catalogNumber"></el-table-column>
						<el-table-column align="center" label="案卷号" prop="dossierNumber" width="80"></el-table-column>
						<el-table-column align="center" label="保管期限" prop="storageLimits"></el-table-column>
						<el-table-column align="center" label="案卷题名" prop="dossierName" width="200"></el-table-column>
						<el-table-column align="center" label="所属账期" prop="belongDate"></el-table-column>
						<el-table-column align="center" label="报表张数" prop="accountPeriod" width="80"></el-table-column>
						<el-table-column align="center" label="附件张数" prop="accountPeriod" width="80"></el-table-column>
					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange1(val)})"
					 :current-page="currentPage1" :page-size="pageSize1" layout="total, prev, pager, next" :total="total1" v-show='total1 > 0'>
					</el-pagination>
				</div>

			</div>


			<div class='btn_contain clearfix'>
				<span class='close' @click="handleCommit">确定</span>

			</div>

		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				all: [],
				categoryrIdSelect: '',
				tree: [],
				result: [],
				detail: [],
				dialogVisible: false,
				uploadData: {
					"accountPeriod": "",
					"customerId": "",
					"customerName": ''
				},
				total: 0,
				total1: 0,
				currentPage: 1,
				currentPage1: 1,
				cardList: [{}],
				pageSize: 10,
				pageSize1: 10,
				employeeList: [],
				customerList: [],
				multiSelection: [],
				archivesStorageIds: [],
				defaultProps: {
					children: 'archivesCategoryInfoList',
					label: 'categoryrName'
				},
				loading:false,
				

			}
		},
		components: {},
		methods: {
			getRowKeys(row) {
				return row.archivesStorageId
			},
			showFile() {
				this.$refs['formName'].validate((valid) => {
					if (valid) {
						this.dialogVisible = true;
						this.getTree();
					} else {
						console.log('error submit!!');
						return false;
					}
				})

			},
			handleClose() {
				this.dialogVisible = false;
				this.archivesStorageIds = [];
			},
			handleCommit() {
				this.dialogVisible = false;
				console.log(this.multiSelection)
			},
			flatten(arr) {
				var res = [];
				for (var i = 0; i < arr.length; i++) {
					if (Array.isArray(arr[i])) {
						res = res.concat(this.flatten(arr[i]));
					} else {
						res.push(arr[i]);
					}
				}
				return res;
			},
			selectExcel() {
				this.$refs['formName'].validate((valid) => {
					if (valid) {

						let params = {
							"borrowTime": this.uploadData.borrowTime,
							"archivesStorageIds": this.multiSelection,
							// "borrowCount": 4,
							"borrowPourse": this.uploadData.borrowPourse,
							"returnTime": this.uploadData.returnTime,
							"approveUserid": ''
						}
						this.axios.post('/perTaxToolTwo/ArchivesBorrowRecordInfo/SaveArchivesBorrowRecordInfo', params)
							// this.axios.post('/miaoxing/queryPage', params)
							.then(res => {
								this.multiSelection = [];
								if (res.data.code == 200) {
									this.queryPage()
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
								this.multiSelection = [];
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
			handleSelectionChange(val, index) {
				this.multiSelection = val;
				console.log(this.multiSelection);
			},
			queryDetail() {
				this.loading = true;
				let params = {
					data:{
						"categoryrId": this.categoryrIdSelect
					},
					page:this.currentPage1,
					row:this.pageSize1
					

				}
				this.axios.post('/perTaxToolTwo/ArchivesStorageInfo/getArchivesPage', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.result = res.data.data;
							// this.all = res.data.data;
							// this.result = [];
							// for (let i = 0, len = this.all.length; i < len; i += this.pageSize1) {
							// 	this.result.push(this.all.slice(i, i + this.pageSize1));
							// }
							this.total1 = res.data.count;
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
						this.loading = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			handleNodeClick(data) {
				this.categoryrIdSelect = data.categoryrId;
				this.currentPage1 = 1;
				this.queryDetail();

			},





			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage();
			},
			handleCurrentChange1(val) {
				// if (this.multiSelection.length > 0) {
				// 	this.archivesStorageIds.push(this.multiSelection);
				// }

				this.currentPage1 = val;
				this.queryDetail();
			},
			queryPage() {
				let params = {
					"page": 1,
					"row": 10,
					"data": {
						"borrwoStatus": 1
					}
				}
				this.axios.post('/perTaxToolTwo/ArchivesBorrowRecordInfo/findPageList', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.detail = res.data.data;
							this.total = res.data.count;
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
			handleEdit(row) {}
		},
		computed: {},
		created() {
			this.queryPage();
			console.log(this.$store.state);
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
			height: 100px;
			padding-left: 20px;
			padding-top: 12px;
			margin: 10px 20px;
			display: flex;
			flex-direction: row;
			align-items: center;

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
			padding: 10px 20px;
			height: calc(100% - 190px);

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
				justify-content: start;
				flex-wrap: wrap
			}

			.card {
				width: 250px;
				height: 260px;
				background-color: #fff;
				margin-right: 12px;
				margin-bottom: 12px;

				h4 {
					height: 40px;
					line-height: 40px;
					background-color: rgb(125, 195, 109);
					color: #fff;
					text-align: center
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
</style>
