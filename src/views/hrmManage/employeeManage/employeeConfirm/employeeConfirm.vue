<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>在职人员确认</div>
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
					<!-- <el-form-item label="入职日期:" id='range'>
						<el-date-picker value-format='yyyy-MM-dd' v-model="formInline.value" type="daterange" range-separator="至"
						 start-placeholder="开始日期" end-placeholder="结束日期">
						</el-date-picker>
					</el-form-item>
					<el-form-item label="姓名:">
						<el-input v-model='formInline.userName' clearable></el-input>
					</el-form-item> -->
					<el-form-item label="部门:">
						<el-select v-model='formInline.orgId' clearable>
							<el-option v-for='item in departList' :label="item.orgName" :value="item.orgId" :key='item.orgId'></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click='search' size="mini">查询</el-button>
					</el-form-item>
					
				</el-form>
			</div>
			<div class="contain_body">
				<el-button size="mini" type="primary" @click='submit'>本月提交</el-button>
				<el-button size="mini" type="primary" @click='confirm'>在职确认</el-button>
				<el-table :data="detail" style="width: 100%;margin-top: 12px;" stripe border v-loading='loading' @selection-change="handleSelectionChange">
					<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->

					<el-table-column align="center" label="姓名" prop="userName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="工号" prop="usercode" :resizable="false"></el-table-column>
					<el-table-column align="center" label="部门名称" prop="departName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="确认在职月份" prop="confirmMonth" :resizable="false"></el-table-column>
					<el-table-column align="center" label="是否确认" prop="isConfirm" width="120" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.isConfirm == 1">是</span>
							<span v-else>否</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="确认人" :resizable="false">
						<template slot-scope="scope">
							<span>{{scope.row.departConfirmName}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="确认时间" :resizable="false">
						<template slot-scope="scope">
							<span>{{scope.row.configDate?formatTimeToStr(new Date(scope.row.configDate),'yyyy-MM-dd'):''}}</span>
						</template>
					</el-table-column>
					<el-table-column align="center" label="是否提交" prop="isApproval" width="120" :resizable="false">
						<template slot-scope="scope">
							<span v-if="scope.row.isApproval == 1">是</span>
							<span v-else>否</span>
						</template>
					</el-table-column>
					<!-- <el-table-column align="center" width="200" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">提交</el-button>
						</template>
					</el-table-column> -->
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '4')})"
				 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
				</el-pagination>
			</div>
		</div>
		

	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				customerTaxInfo: {
					checkGroupId: "-1"
				},
				loading: false,
				uploadData1: {
					userId: "",
					entryStatus: "",
					entryUrl: 1
				},
				
				
				formInline: {
					userName: '',
					value: '',
					orgId: ''
				},
				
				
				form: {},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				detail: [],
				trueOrFalse: [{
						label: "否",
						value: 0
					},
					{
						label: "是",
						value: 1
					}
				],
				departList: [],
				multipleSelection:[]
			}
		},
		components: {},
		methods: {
			getDepart() {
				let params = {
					"orgType": 2
				}
				this.axios.post('/perTaxToolTwo/hr/org/findOrgList', params).then(res => {
				// this.axios.post('/sl/perTaxToolTwo/hr/org/findOrgList', params).then(res => {
					if (res.data.code == 200) {
						this.departList = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.$message({
						message: '获取公司列表失败',
						type: 'error'
					});
				})
			},
			queryList() {
				let params = {
					"page": this.currentPage,
					"row": this.pageSize,
					"data": {
						"departId":this.departId
					}
				}
				this.axios.post('/perTaxToolTwo/doInterface/getUserPageList', params).then(res => {
				// this.axios.post('/sl/perTaxToolTwo/hrEmpInfo/findHrEmpInfoPage', params).then(res => {
					this.loading = false;
					if (res.data.code == 200) {

						this.total = res.data.count;
						this.detail = res.data.data;
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}

				}).catch(function(err) {
					this.loading = false;
					this.$message({
						message: '获取角色列表失败',
						type: 'error'
					});
				})
			},
			
			confirm(){
				let params = {
					
				}
				this.axios.get('/perTaxToolTwo/doInterface/updateConfirmState').then(res => {
				// this.axios.post('/sl/perTaxToolTwo/hrEmpInfo/findHrEmpInfoPage', params).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.queryList();
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
					this.loading = false;
					this.$message({
						message: '确认失败',
						type: 'error'
					});
				})
			},
			submit(){
				let params = {
					
				}
				this.axios.get('/perTaxToolTwo/doInterface/makeSureUser').then(res => {
				// this.axios.post('/sl/perTaxToolTwo/hrEmpInfo/findHrEmpInfoPage', params).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						this.queryList();
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
					this.loading = false;
					this.$message({
						message: '提交失败',
						type: 'error'
					});
				})
			},
			
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			search() {
				// console.log(this.formInline.value)
				this.loading = true;
				this.queryList()
			},
			handleEdit(index, row) {
				this.dialogVisible = true;
				this.customerTaxInfo = row;
			},
			

			
			
			
			

			
			
			
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryList()
			},
			
			
			
			
		},
		watch: {
			"entryStatus": {
				handler(val, oldVal) {
					switch (val) {
						case "0":
							this.canUpload = false;
							break;
						case "1":
							this.canUpload = true;
							break;
					}
				},
				deep: true

			},

		},
		created() {
			this.getDepart();
			this.queryList();
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
		background: url(../../../../assets/img/list-bg1.png) no-repeat;
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

		/deep/ .el-date-editor.el-input__inner {
			width: 210px;
		}

		/deep/ #range .el-form-item__content {
			width: 210px
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

	/deep/ .el-dialog {

		.title {
			height: 0.4rem;
			line-height: 0.4rem;
			font-size: 0.16rem;
			color: #333;
		}

		.tabtitle {
			display: flex;
			align-items: center;
			height: 35px;
		}

		.lineicon {
			width: 5px;
			background: #409EFF;
			height: 16px;
			margin-right: 10px;
		}

		.line {
			display: flex;
			flex-wrap: nowrap;
			flex-direction: row;
			justify-content: space-between;
			height: 0.4rem;
			align-content: center;
			align-items: center;
			margin-bottom: 20px;
		}

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

		ul.el-upload-list {
			background: #fff;
			padding-left: 0.24rem;
			padding-right: 0.24rem;
			padding-top: 0rem;
			height: 0.24rem;
			overflow-y: auto;
			margin-top: 0rem;
			display: inline-block;
			vertical-align: middle;

			:first-child {
				margin-top: 0px
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

	/deep/ .el-form-item__content {
		width: 180px;
	}

	/deep/ #file1 .el-form-item__content,
	/deep/ #file2 .el-form-item__content,
	/deep/ #file3 .el-form-item__content,
	/deep/ #file4 .el-form-item__content {
		width: 400px;
	}

	/deep/ .el-date-editor.el-input {
		width: 190px;
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
