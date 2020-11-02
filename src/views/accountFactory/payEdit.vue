<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>工资表变更</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div class='info'>
				<span>工资表上传 请上传多家公司</span>
			</div>
			<div>
				<el-button type="primary" @click='selectExcel' size="mini">选择Excel</el-button>
			</div>
		</div>
		<div class='main_contain'>
			<h5>月度工资表</h5>
			<el-button type="primary" size='mini' @click='calc'>计算筹划</el-button>
			<el-table class="table1" :data="tableData1" border stripe style="width: 100%;margin-top:20px" @selection-change="((val)=>{handleSelectionChange(val)})">
				<el-table-column align="center" type="selection" width="50"></el-table-column>
				<el-table-column align="center" label="序号" type='index' width="50" :resizable="false"></el-table-column>
				<el-table-column align="center" prop="customerName" label="公司" :resizable="false"></el-table-column>
				<el-table-column align="center" prop="taxPayerId" label="纳税人识别号" :resizable="false"></el-table-column>
				<el-table-column align="center" prop="accountPeriod" label="账期" :resizable="false"></el-table-column>
				<el-table-column align="center" fixed="right" label="操作" :resizable="false" width="160">
					<template slot-scope="scope">
							<el-button type="primary" size="small" @click='edit(scope.row,scope.$index)'>年终统筹方案选择</el-button>
</template>
				</el-table-column>
			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '1')})"
			 :current-page="currentPage1" :page-size="pageSize1" layout="total, prev, pager, next, jumper" :total="total1">
			</el-pagination>
		</div>

		<el-dialog title="易点个税年终奖筹划方案" class="dialogCalc" :visible.sync="dialogVisibleCalc" width="70%" @close="closeDilog">
			<div class="buttons">
				<!-- <el-button icon="el-icon-collection" size='mini' @click="saveCalc()">保存</el-button> -->
			</div>
			<el-table :data="tableTem[index]" style="width: 100%;margin-top:20px" stripe border>
				<!-- <el-table-column type="selection" width="50"></el-table-column> -->
				<el-table-column align="center" label="姓名" prop="employeeName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="收入额" prop="incomeAmount" :resizable="false"></el-table-column>
				<el-table-column align="center" label="年终奖" prop="yearAwards" :resizable="false"></el-table-column>
				<el-table-column align="center" label="分开核算个税" prop="sepTaxation" :resizable="false"></el-table-column>
				<el-table-column align="center" label="合并核算个税" prop="comTaxation" :resizable="false"></el-table-column>
				<el-table-column align="center" label="推荐方案" prop="suggestType" :resizable="false"></el-table-column>
				<el-table-column align="center" width="260" :resizable="false">
<template slot="header" slot-scope="scope">
	<el-dropdown @command="handleCommand" style='float: left;line-height: 28px;'>
		<span class="el-dropdown-link">
									操作<i class="el-icon-arrow-down el-icon--right"></i>
								</span>
		<el-dropdown-menu slot="dropdown">
			<el-dropdown-item command="分开核算">全部分开核算</el-dropdown-item>
			<el-dropdown-item command="合并核算">全部合并核算</el-dropdown-item>
			<el-dropdown-item command="推荐核算">全部推荐核算</el-dropdown-item>
		</el-dropdown-menu>
	</el-dropdown>
	<el-button size='mini' type='primary' @click="saveCalc()" style='float: right;'>保存年终筹划</el-button>
</template>
<template slot-scope="scope">
	<el-radio-group v-model="scope.row.radio1" size="small" @change="setChooseType(scope.row.radio1,scope.row)">
		<el-radio-button label="分开核算"></el-radio-button>
		<el-radio-button label="合并核算"></el-radio-button>
		<el-radio-button label="推荐核算"></el-radio-button>
	</el-radio-group>
</template>
					<!--<template slot-scope="scope">
	<el-radio-group v-model="scope.row.radio1" size="small" @change="setChooseType(scope.row.radio1,scope.row)">
		<el-radio-button label="分开核算"></el-radio-button>
		<el-radio-button label="合并核算"></el-radio-button>
		<el-radio-button label="推荐核算"></el-radio-button>
	</el-radio-group>
</template>-->
				</el-table-column>
			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '4')})"
			 :current-page="currentPage4" :page-size="pageSize4" layout="total, prev, pager, next" :total="total4">
			</el-pagination>
			<el-dialog width="30%" title="内层 Dialog" :visible.sync="innerVisible" append-to-body>
			</el-dialog>
		</el-dialog>

		<el-dialog title="选择Excel" :visible.sync="dialogVisible" width="30%">
			<el-upload class="upload-demo" :on-change="onChange" :on-preview="handlePreview" ref='upload' :on-remove="handleRemove"
			 :before-remove="beforeRemove" multiple :limit="10" :on-exceed="handleExceed" :file-list="fileList" :on-success="handleSuccess"
			 :on-error="handleError" :auto-upload="false" :data='uploadData' accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet">
				<el-button size="small" type="primary" slot="trigger">选择Excel</el-button>

			</el-upload>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancelUpload">取 消</el-button>
				<el-button type="primary" @click="submitUpload">上传</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		name: "payEdit",
		data() {
			return {
				dialogVisible: false,
				uploadData: {},
				accountPeriod: "",
				customerId: "",
				fileList: [],
				tableData1: [],
				currentPage1: 1,
				pageSize1: 10,
				pageNum1: 1,
				total1: 0,
				tableData4: [],
				currentPage4: 1,
				pageSize4: 10,
				pageNum4: 1,
				total4: 0,
				multipleSelection1: [], //多选
				multipleSelection2: [], //多选
				dialogVisibleCalc: false,
				operateId: "",
				customerList: [],
				pageoperateId: '',
				tableTem: [],
				index: 0,
				tindex: 0
			};
		},
		watch: {},
		components: {},
		methods: {
			// 操作表id接口
			getOperatorId() {
				let params = {
					row: this.pageSize1,
					page: this.pageNum1,
					data: {
						accountPeriod: this.accountPeriod,
						customerId: this.customerId,
						submitStatus: this.statusVaule
					}
				};
				this.axios
					.post("/perTaxToolTwo/initialMonCom/queryPage", params)
					.then(res => {
						if (res.data.code == 200) {
							this.operateId = res.data.data[0].operateId;
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
			// 1.3 搜索接口(导入员工信息展示)
			getTableData1() {
				let params = {
					row: this.pageSize1,
					page: this.pageNum1,
					data: {
						accountPeriod: this.accountPeriod,
						customerId: this.customerId,
						submitStatus: this.statusVaule
					}
				};
				this.axios
					.post("/test/tableData1", params)
					.then(res => {
						if (res.data.code == 200) {
							this.tableData1 = res.data.data;
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
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			// /perTaxToolTwo/monAcct/queryChoosePage
			getTableData4() {
				let params = {
					// row: this.pageSize4,
					row: 99999,
					page: this.pageNum4,
					data: {
						operateId: this.pageoperateId
					}
				};
				this.axios
					.post("/perTaxToolTwo/monAcct/queryChoosePage", params)
					.then(res => {
						if (res.data.code == 200) {
							this.tableData4 = res.data.data;
							this.total4 = res.data.count;
							this.tableData4.forEach((item, index) => {
								this.$set(item, "radio", "推荐核算");
								this.$set(item, "chooseType", "3");
								// item.radio='推荐核算'
							});
							for (let i = 0; i < this.tableData4.length; i += 10) {
								this.tableTem.push(this.tableData4.slice(i, i + 10));
							}
							console.log("11", this.tableData4);
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
			selectExcel() {
				this.dialogVisible = true;
			},
			onChange(file, fileList) { //这里做一些文件控制，注意：就算一次选取多个文件，这里依旧会执行多次
				let existFile = fileList.slice(0, fileList.length - 1).find(f => f.name === file.name)
				if (existFile) {
					this.$message.error('当前文件已经存在!');
					fileList.pop()
				}
				this.fileList = fileList
			},
			submitUpload() {
				var formData = new FormData(); //  用FormData存放上传文件
				this.fileList.forEach(file => {
					formData.append('file', file.raw, file.raw.name); //此处一定是append file.raw 上传文件只需维护fileList file.raw.name要加上 
				})
				this.axios
					.post("/perTaxToolTwo/api/excel/monthlyUpload.do", formData, {
						headers: {
							'Content-Type': 'application/x-www-form-urlencoded'
						}
					}).then(res => { //手动上传貌似无法触发成功或失败的钩子函数，因此这里手动调用 
						if (res.data.code == 200) {
							this.tableData1 = res.data.data.result;
							this.total1 = res.data.data.result.length;
							this.dialogVisible = false;
						} else {
							this.fileList = [];
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
						this.fileList = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					})
			},
			handleSuccess(response) {
				if (response.code == 200) {
					this.fileList = [];
					this.$message({
						message: response.msg,
						type: "success"
					});
					this.dialogVisible = false;
					this.pageNum1 = "1";
					this.getTableData1();
				} else {
					this.fileList = [];
					this.$message({
						message: response.msg || "上传文件失败！",
						type: "error"
					});
				}
			},
			handleError(err) {
				this.fileList = [];
				this.$message({
					message: "上传文件失败！",
					type: "error"
				});
			},
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},
			handlePreview(file) {
				console.log(file);
			},
			handleExceed(files, fileList) {
				//   this.$message.warning(
				//     `当前限制选择 3 个文件，本次选择了 ${
				//       files.length
				//     } 个文件，共选择了 ${files.length + fileList.length} 个文件`
				//   );
			},
			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${file.name}？`);
			},
			handleCurrentChange(val, type) {
				if (type == "1") {
					this.pageNum1 = val;
					this.getTableData1();
				} else if (type == "4") {
					// 在此保存计算年终奖
					// this.pageNum4 = val;
					// this.getTableData4();
					this.index = val - 1;
					// this.saveCalc("1");
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection1 = val;
				console.log(this.multipleSelection1);
			},
			cancelUpload() {
				this.fileList = [];
				this.dialogVisible = false;
			},
			edit(row, index) {
				// let params = {
				// 	row: this.pageSize4,
				// 	page: this.pageNum4,
				// 	data: {
				// 		operateId: row.operateId
				// 	}
				// };
				// this.axios
				// 	.post("/perTaxToolTwo/monAcct/queryChoosePage", params)
				// 	.then(res => { //手动上传貌似无法触发成功或失败的钩子函数，因此这里手动调用 
				// 		if (res.data.code == 200) {
				// 			this.tableData4 = res.data.data;
				// 		}
				// 	}).catch(err => {
				// 		this.$message({
				// 			message:！",
				// 			type: "error"
				// 		});
				// 	})
				// this.pageoperateId = row.operateId;
				this.tindex = index;
				this.index = 0;
				this.tableTem = [];
				this.tableData4 = row.dataList;
				console.log("22222", this.tableData1[0].dataList);
				console.log("33333", row.dataList);
				this.total4 = row.dataList.length;
				this.tableData4.forEach((item, index) => {
					this.$set(item, "radio1", item.radio);
					this.$set(item, "chooseType1", item.chooseType);
					// item.radio='推荐核算'
				});
				for (let i = 0; i < this.tableData4.length; i += 10) {
					this.tableTem.push(this.tableData4.slice(i, i + 10));
				}
				this.dialogVisibleCalc = true;
				// this.getTableData4(this.pageoperateId);
			},
			calc() {
				console.log(this.multipleSelection1);
				var arr = [];
				this.multipleSelection1.forEach((item, index) => {
					arr.push(item.dataList);
				})
				let params = arr;
				this.axios
					.post("/perTaxToolTwo/monAcct/chooseCalcTypeList.do", params)
					.then(res => {
						if (res.data.code == 200 && res.data.data.length == 0) {
							this.tableData1 = [];
							this.total1 = res.data.data.length;
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
			saveCalc() {
				this.dialogVisibleCalc = false;
				console.log(this.tableTem);
				var arr = Array.prototype.concat.apply([], this.tableTem);
				arr.forEach((item, index) => {
					item.chooseType = item.chooseType1;
					item.radio = item.radio1;
				})
				this.tableData1[this.tindex].dataList = arr;
				console.log("11111", this.tableData1[0].dataList);
			},
			closeDilog() {
				console.log(this.tableTem);
			},
			setChooseType(val, item) {
				if (val == '分开核算') {
					item.chooseType1 = 1
				} else if (val == '合并核算') {
					item.chooseType1 = 2
				} else {
					item.chooseType1 = 3
				}
			},
			handleCommand(command) {
				switch (command) {
					case '分开核算':
						this.tableData4.forEach((item, index) => {
							item.radio1 = command;
							item.chooseType1 = 1;
						})
						break;
					case '合并核算':
						this.tableData4.forEach((item, index) => {
							item.radio1 = command;
							item.chooseType1 = 2;
						})
						break;
					case '推荐核算':
						this.tableData4.forEach((item, index) => {
							item.radio1 = command;
							item.chooseType1 = 3;
						})
						break;
					default:
						break;
				}
				// for(let i = 0; i < this.tableTem.length;i++){
				// 	
				// }
				for (let i = 0; i < this.tableData4.length; i += 10) {
					this.tableTem.push(this.tableData4.slice(i, i + 10));
				}
			},
		},
		computed: {},
		created() {
			this.customerList = this.$store.state.cust;
			console.log(this.customerList);
		}
	};
</script>
<style>
	.table1 .demo-table-expand label {
		color: #99a9bf;
		padding-left: 120px;
	}
	.table1 .demo-table-expand .el-form-item {
		margin-right: 0;
		margin-bottom: 0;
		width: 50%;
	}
	.dialogAdd .el-input,
	.dialogAdd .el-select,
	.dialogAdd .el-date-editor {
		width: 200px;
	}
	.dialogCalc .el-dialog__body {
		padding-top: 0;
	}
</style>

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
			background-color: #fff;
			border-top: 1px solid #f2f6fc;
			box-sizing: border-box;
		}
		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 40px;
		}
		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #ebf6fb;
		}
		/deep/ .el-table th {
			background-color: #ebf6fb;
		}
		/deep/ .el-table td {
			padding: 6px 0;
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
			margin: 20px;
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
			padding: 0px 20px; // height: calc(100% - 190px);
			h5 {
				height: 40px;
				line-height: 40px;
			}
			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}
		}
		.title {
			font-weight: bold;
			line-height: 40px;
		}
		.reportFrom {
			color: red;
			cursor: pointer;
		}
		.bottomTable {
			margin-top: 20px;
		}
		.tips {
			color: #2e78ff;
			font-size: 14px;
			line-height: 40px;
			margin: 0 20px;
		}
	}
</style>
