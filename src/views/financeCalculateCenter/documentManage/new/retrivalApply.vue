<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>系统管理</el-breadcrumb-item>
			<el-breadcrumb-item>档案权限申请</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :model="uploadData" size="small" ref='formName' label-width="100px">
					<el-form-item label="用户名" prop="phone">
						<el-input :value="phone" disabled>
						</el-input>
					</el-form-item>

					<el-form-item label="联系人" prop="contactName" :rules="[$rules.requiredInput]">
						<el-input v-model="uploadData.contactName" placeholder="请输入" clearable filterable>
						</el-input>
					</el-form-item>

					<el-form-item label="申请原因" prop="applyReason" :rules="[$rules.requiredInput]">
						<el-input type="textarea" v-model="uploadData.applyReason" placeholder="请输入" clearable filterable :rows="4">
						</el-input>

					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click='search()' size="small"> 申 请 </el-button>
					</el-form-item>
					<!-- <el-button type="info" @click='resetForm()' size="small" style="float: right;"> 重 置 </el-button> -->


					<!-- <el-button type="primary" @click='add()' size="mini">新增</el-button> -->
				</el-form>
			</div>
		</div>














	</div>
</template>

<script>
	export default {
		name: "incomeTaxCalculate",
		data() {
			return {
				phone:'',
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


			search() {
				this.$refs['formName'].validate((valid) => {
					if (valid) {
						this.commitApply()
					} else {
						console.log('error submit!!');
						return false;
					}
				});


			},


			commitApply() {
				var _this = this;
				// this.innerVisible = true;
				let params = {
					"phone": this.phone,
					"contactName": this.uploadData.contactName,
					"applyReason": this.uploadData.applyReason
				};
				this.axios.post('/perTaxToolTwo/ArchivesPermissionApply/SaveArchivesPermissionApply', params)
					.then(res => {
						if (res.data.code == 200) {
							this.$message({
								message: '申请成功，请等待管理员审批！',
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
			this.phone = JSON.parse(sessionStorage.getItem('updateUser')).phone;
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
