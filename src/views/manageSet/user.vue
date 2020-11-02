<template>
	<div class='main clearfix'>
		<div class='search_contain'>
			<div>
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini">
					<el-form-item label="员工:">
						<el-input v-model='formInline.name' placeholder="请输入员工姓名" clearable></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click='search' type="primary" size="mini">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<el-button type="primary" size="mini" icon="el-icon-plus" class="addBtn" @click="addData">新增</el-button>
			<!--<my-table :data="tableData" :rowHeader="rowHeader"></my-table>-->
			<el-table :data="tableData" style="width: 100%" stripe border v-loading="loading">
				<el-table-column align="center" label="序号" type='index' width="80"></el-table-column>
				<el-table-column align="center" label="用户名" prop="usercode"></el-table-column>
				<el-table-column align="center" label="真实姓名" prop="name"></el-table-column>
				<el-table-column align="center" label="所在部门">
					<template slot-scope="scope">
						<span v-if="scope.row.org">{{scope.row.org.orgName}}</span>
						<span v-else>未分配</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="性别" prop="sex"></el-table-column>
				<el-table-column align="center" label="入职时间" sortable prop="getInDate"></el-table-column>
				<el-table-column align="center" label="状态" sortable>
					<template slot-scope="scope">
						<el-tag v-if="scope.row.state==1" type="success">有效</el-tag>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作">
					<template slot-scope="scope">
						<el-button size="mini" type='primary' icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background layout="total,prev, pager, next, jumper" :total="total" :page-size="pageSize" @current-change='handleCurrentChange' :current-page="currentPage">
			</el-pagination>
			<!--弹出框-->
			<el-dialog class="dialog" :title="addFlag?'添加员工':'编辑员工'" :close-on-click-modal="false" :visible.sync="dialogVisible" width="700px" style="min-width:250px" @close='hideDialog("ruleForm")'>
				<el-tag type="warning" effect="dark">标签四</el-tag>
				<el-form :model="form" :inline="true" size="mini" label-width="80px" ref="ruleForm">
					<el-form-item label="用户名" prop="usercode" :rules="[$rules.requiredInput]">
						<el-input v-model="form.usercode" placeholder="请输入11位手机号"></el-input>
					</el-form-item>
					<el-form-item label="真实姓名" prop="name" :rules="[$rules.requiredInput]">
						<el-input v-model="form.name" placeholder="请输入员工姓名"></el-input>
					</el-form-item>
					<br>
					<el-form-item label="入职时间" prop="getInDate" :rules="[$rules.requiredInput]">
						<el-date-picker v-model="form.getInDate" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择入职时间"></el-date-picker>
					</el-form-item>
					<el-form-item label="出生日期" prop="birth" :rules="[$rules.requiredInput]">
						<el-date-picker v-model="form.birth" type="date" format="yyyy-MM-dd " value-format="yyyy-MM-dd"
					 placeholder="请选择出生日期"></el-date-picker>
					</el-form-item>
					<br>
					<el-form-item label="联系方式" prop="phone" :rules="[$rules.requiredInput,$rules.mobilePhone]">
						<el-input v-model="form.phone" placeholder="请输入联系方式"></el-input>
					</el-form-item>
					<el-form-item label="邮箱" prop="email" :rules="[$rules.email]">
						<el-input v-model="form.email" placeholder="请输入邮箱"></el-input>
					</el-form-item>
					<br>
					<el-form-item label="所在部门" prop="orgId" :rules="[$rules.requiredSelect]">
						<el-select v-model="form.orgId" placeholder="请选择所在部门" filterable>
			              <el-option v-for="item in orgsList" :key="item.orgId" :label="item.orgName" :value="item.orgId">
			              </el-option>
			            </el-select>
					</el-form-item>
					<el-form-item label="性别" prop="sex">
						<el-radio-group v-model="form.sex">
					      <el-radio label="男"></el-radio>
					      <el-radio label="女"></el-radio>
					   </el-radio-group>
					</el-form-item>
					<br>
					<el-form-item label="联系地址" prop="address">
						<el-input type="textarea" v-model="form.address" maxlength="200" rows="4" placeholder="请输入具体联系地址，200字以内"></el-input>
					</el-form-item>
					<el-form-item label="状态" prop="state">
						<el-radio-group v-model="form.state">
					      <el-radio :label="1">有效</el-radio>
					      <el-radio :label="0">无效</el-radio>
					   </el-radio-group>
					</el-form-item>
				</el-form>
				<div class='btn_contain clearfix'>
					<span class='commit' @click='commitDialog("ruleForm")'>完成</span>
					<span class='close' @click='hideDialog("ruleForm")'>关闭</span>
				</div>
			</el-dialog>
		</div>

	</div>
</template>

<script>
	import myTable from "../../components/common/table.vue"
	export default {
		name: "dept",
		components: {
			myTable
		},
		data() {
			return {
				formInline: {
					name: ''
				},
				total: 0,
				currentPage: 1,
				tableData: [],
				pageSize: 10,
				dialogVisible: false,
				orgsList:[],
				form: {
					usercode: '',
					name: '',
					getInDate:'',
					birth:'',
					phone:'',
					email:'',
					orgId:'',
					sex:'男',
					address:'',
					state:1
				},
				row:{},
				addFlag:false,
				loading:false,
				tableData1: [],
				rowHeader: [
					{
						prop: 'index',
						label: '序号',
						width:'50'
					},
					// 未做任何格式化处理的数据
					{
						prop: 'usercode',
						label: '用户名'
					},
					{
						prop: 'name',
						label: '真实姓名'
					},
					// 格式化为字符串
					{
						prop: 'orgName',
						label: '所在部门',
						render: (h, params) => {
							return params.row.org ? params.row.org.orgName : '未分配'
						}
					},
					{
						prop: 'sex',
						label: '性别'
					},
					{
						prop: 'getInDate',
						label: '入职时间'
					},
					// 插入组件或标签内容（例：进度条组件）
					{
						prop: 'state',
						label: '状态',
						render: (h, params) => {
							return params.row.state==1?h('el-tag','有效', {
								props: {
									type: "success"
								}
							}):h('el-tag','无效', {
								props: {
									type: "error"
								}
							})
						}
					},
					// 添加操作按钮
					{
						prop: '',
						label: '操作',
						render: (h, params) => {
//							<el-button size="mini" type='primary' icon="el-icon-edit" @click="handleEdit(scope.row)">编辑</el-button>
							return h('el-button', '编辑', {
								props: {
									type: 'primary',
									size:'mini',
									icon:'el-icon-edit'
								},
								on: {
									click: () => {
										console.log('params',params,h)
									}
								}
							})
						}
					}
				]
			}
		},
		methods: {
			search() {
				this.getTableData();
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.getTableData();
			},
			getTableData() {
				this.loading=true;
				let params = {
					name: this.formInline.name,
					currentPage: this.currentPage,
					pageCount: this.pageSize,
				};
				this.axios.get('/test/user/list.do', {
						params: params
					})
					.then(res => {
						this.loading=false;
						if(res.data.code == 200) {
							this.tableData = res.data.data;
							this.tableData1=res.data.data;
							this.total = res.data.count;
							console.log(this.tableData)
						} else {
							let type;
							if(res.data.code == 0) {
								type = "warning";
							} else if(res.data.code == 500) {
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
			getorgsList(){
				this.axios.get('/test/orgs/getOrgs.do')
					.then(res => {
						if(res.data.code == 200) {
							this.orgsList = res.data.data;
						} else {
							let type;
							if(res.data.code == 0) {
								type = "warning";
							} else if(res.data.code == 500) {
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
			handleEdit(row) {
				this.getorgsList();
				this.addFlag = false;
				console.log(111,row)
				this.form.usercode=row.usercode;
				this.form.name=row.name;
				this.form.getInDate=row.getInDate;
				this.form.birth=row.birth;
				this.form.phone=row.phone;
				this.form.email=row.email;
				this.form.orgId=row.orgId;
				this.form.sex=row.sex;
				this.form.address=row.address;
				this.form.state=row.state;
				this.row=row;
				this.dialogVisible = true;
			},
			addData() {
				this.getorgsList();
				this.addFlag = true;
				this.dialogVisible = true;
				console.log(this.form)
			},
			commitDialog(formName) {
				this.$refs[formName].validate((valid) => {
					if(valid) {
						console.log('addFlag',this.addFlag);
						let params={
							orgId:'',
							orgName:this.form.orgName,
							remark:this.form.remark,
						}
						if(!this.addFlag){
							//编辑
							params.orgId=this.row.orgId;
						}
						this.commitData(params);
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			hideDialog(formName) {
				this.$refs[formName].resetFields();
				this.form = {
					usercode: '',
					name: '',
					getInDate:'',
					birth:'',
					phone:'',
					email:'',
					orgId:'',
					sex:'男',
					address:'',
					state:1
				};
				this.dialogVisible = false
			},
			commitData(params){
				this.axios.post('/test/org/saveOrg.do', params)
					.then(res => {
						if(res.data.code == 200) {
							this.$message({
				                message: res.data.msg,
				                type: "success"
				            });
				            this.hideDialog("ruleForm");
				            this.getTableData();
						} else {
							let type;
							if(res.data.code == 0) {
								type = "warning";
							} else if(res.data.code == 500) {
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
			this.getTableData();
		},
	}
</script>

<style lang='less' scoped>
	.main {
		/* background: #fff; */
		width: 100%;
		height: 100%;
		box-sizing: border-box;
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
			padding-left: 20px;
			padding-top: 20px;
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
			padding: 0px 20px;
			height: calc(100% - 190px);
			.addBtn {
				margin: 20px 0;
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
				cursor: pointer;
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
				cursor: pointer;
			}
			/deep/ .el-pagination {
				text-align: right;
				margin-top: 10px;
			}
			/deep/ .el-date-editor.el-input, .el-date-editor.el-input__inner,.el-input--mini,.el-select{
				width: 200px;
			}
			/deep/ .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item{
				width:48%
			}
		}
	}
</style>