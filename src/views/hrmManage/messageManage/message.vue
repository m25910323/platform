<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>行政管理中心</el-breadcrumb-item>
			<el-breadcrumb-item>人资系统</el-breadcrumb-item>
			<el-breadcrumb-item>短信管理</el-breadcrumb-item>
		</el-breadcrumb>
		
		<div class="contain_body">
			<div style="background: #fff;height:45px;padding:15px 12px 0px;">
				<el-input placeholder="搜索" v-model="uploadData.keywords" prefix-icon="el-icon-search" style='width: 200px;' size="mini"
				 clearable>
			
			
			
				</el-input>
				<el-button size="mini" type="text" @click="search()" style='margin-left: 8px;margin-right: 20px;'>搜索</el-button>
				
				
				
			</div>
			<el-table :data="tableList" style="width: 100%" v-loading='loading'>
				<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->

				<el-table-column align="center" label="姓名" prop="username" :resizable="false"></el-table-column>
				<el-table-column align="center" label="工号" prop="usercode" :resizable="false"></el-table-column>
				<el-table-column align="center" label="部门" prop="departName" :resizable="false"></el-table-column>
				<el-table-column align="center" label="短信内容" prop="content" :resizable="false"></el-table-column>
				<el-table-column align="center" label="入职时间" prop="entryTime" :resizable="false">
					
				</el-table-column>
				<el-table-column align="center" label="发送时间" prop="sendTime" :resizable="false">
					
				</el-table-column>


			</el-table>
			<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
			 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
			</el-pagination>
		</div>
		

		
	</div>

</template>

<script>
	export default {

		name: "customer",
		data() {
			return {
				multipleSelection: [],
				starttime: '',
				endtime: '',
				keywords: '',
				departList: [],
				loading: false,
				formInline: {
					orgName: '',
				},
				orgName: '',
				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],

				dialogVisible: false,
				dialogVisible1: false,
				form1: {},
				form2: {},
				uploadData: {
					keyword:''
				},
				trueOrFalse: [{
						label: "否",
						value: 0
					},
					{
						label: "是",
						value: 1
					}
				]

			}
		},
		components: {},
		methods: {
			search(){
				this.keywords = this.uploadData.keywords;
				this.queryListByPage()
			},
			queryListByPage() {
				this.loading = true;
				let param = {
					row: this.pageSize,
					page: this.currentPage,
					data: {
						keyword: this.keywords,
						starttime: "",
						endtime: ""
					}

				};
				this.axios.post('/perTaxToolTwo/attendanceMessageRecordController/queryListByPage', param).then(res => {
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
					this.loading = false;
					this.$message({
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			

			

			
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryListByPage()
			},

			add() {
				this.dialogVisible = true;
			},
			
			
		},
		created() {
			// this.getDepartment();
			this.queryListByPage();
		}

	}
</script>

<style scoped lang='less'>
	.main_contain {
		width: 100%;
		height: 100%;
		padding: 0px;
		box-sizing: border-box;

		/deep/ .el-breadcrumb {
			height: 40px;
			line-height: 40px;
			background: rgb(234, 244, 255);
			padding-left: 20px;
		}

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

	.contain_body {
		/* padding: 10px 20px; */
		margin: 20px 20px;
		/* background: #fff; */
	}



	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
	}

	/deep/ .el-table table {
		background: rgb(243, 246, 249);
		border-collapse: separate;
		border-spacing: 0px 5px;
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

	/deep/ .el-table th,
	/deep/ .el-table tr {
		background-color: transparent;
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
		background-color: #fff;
	}

	/deep/ .el-table__body tr.el-table__row--striped {
		background-color: #ebf6fb;
	}

	/deep/ .el-table thead {
		color: #666;
	}

	/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #fff;
	}
</style>
