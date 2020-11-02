<template>
	<div class='main_contain'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>系统管理</el-breadcrumb-item>
			<el-breadcrumb-item>人资配置</el-breadcrumb-item>
		
			<el-breadcrumb-item>统一考勤维护</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="contain_body">
			<h3>打卡配置
				<el-button type="danger" size='mini' icon="el-icon-delete" :disabled="canEidt" @click='deleteMulti' style='top: 40px;position: absolute;right: 12px;z-index: 20;'>批量删除</el-button>
				<el-button type="primary" size='mini' icon="el-icon-circle-plus-outline" @click='add' style='top: 40px;position: absolute;right:120px;z-index: 20;'>新增</el-button>
			</h3>
			
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane name="first">
					<span slot="label">
			
						<span>按周计划
							
						</span>
			
					</span>
					<el-table :data="tableList" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange" ref='multipleTable'>
						<el-table-column align="center" type="selection" width="50"></el-table-column>
					
						<!-- <el-table-column align="center" label="日期" prop="checkDate" :resizable="false"></el-table-column> -->
						<el-table-column align="center" label="部门名称" prop="checkDepartment" :resizable="false"></el-table-column>
						<el-table-column align="center" label="上班时间" prop="checkMorningWorkTime" :resizable="false"></el-table-column>
						<el-table-column align="center" label="下班时间" prop="checkAfternoonWorkTime" :resizable="false"></el-table-column>
						<el-table-column align="center" label="打卡日" prop="remark2" :resizable="false"></el-table-column>
						<el-table-column align="center" label="迟到时间" prop="remark3" :resizable="false"></el-table-column>
						<el-table-column align="center" label="每月自动消除次数" prop="remark4" :resizable="false"></el-table-column>
						<el-table-column align="center" :resizable="false">
							<template slot="header" slot-scope="scope">
								<span>操作</span>
							</template>
							<template slot-scope="scope">
								<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
								<el-button size="mini" type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val)})"
					 :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next" :total="total">
					</el-pagination>
			
			
				</el-tab-pane>
				<el-tab-pane name="second">
					<span slot="label">
			
						<span>按月计划
							
						</span>
			
					</span>
					<el-table :data="tableList1" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange1" ref='multipleTable1'>
						<el-table-column align="center" type="selection" width="50"></el-table-column>
					
						<!-- <el-table-column align="center" label="日期" prop="checkDate" :resizable="false"></el-table-column> -->
						<el-table-column align="center" label="部门名称" prop="checkDepartment" :resizable="false"></el-table-column>
						<el-table-column align="center" label="上班时间" prop="checkMorningWorkTime" :resizable="false"></el-table-column>
						<el-table-column align="center" label="下班时间" prop="checkAfternoonWorkTime" :resizable="false"></el-table-column>
						<el-table-column align="center" label="打卡日" prop="remark2" :resizable="false"></el-table-column>
						<el-table-column align="center" label="迟到时间" prop="remark3" :resizable="false"></el-table-column>
						<el-table-column align="center" label="每月自动消除次数" prop="remark4" :resizable="false"></el-table-column>
						<el-table-column align="center" :resizable="false">
							<template slot="header" slot-scope="scope">
								<span>操作</span>
							</template>
							<template slot-scope="scope">
								<el-button size="mini" type="text" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
								<el-button size="mini" type="text" @click="handleDel(scope.$index, scope.row)">删除</el-button>
							</template>
						</el-table-column>
					</el-table>
					<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange1(val)})"
					 :current-page="currentPage1" :page-size="pageSize" layout="total, prev, pager, next" :total="total1">
					</el-pagination>
				</el-tab-pane>
				
			</el-tabs>
			
			<div style="position: relative;">
				<h3 style="height: 60px;line-height: 60px;">加班配置
					<el-button type="danger" size='mini' icon="el-icon-delete" :disabled="canEidt2" @click='deleteMulti2' style='top: 15px;position: absolute;right: 12px;z-index: 20;'>批量删除</el-button>
					<el-button type="primary" size='mini' icon="el-icon-circle-plus-outline" @click='add2' style='top: 15px;position: absolute;right:120px;z-index: 20;'>新增</el-button>
				</h3>
				<el-table :data="tableList2" style="width: 100%" v-loading='loading' @selection-change="handleSelectionChange2" ref='multipleTable2'>
					<el-table-column align="center" type="selection" width="50"></el-table-column>
				
					<!-- <el-table-column align="center" label="日期" prop="checkDate" :resizable="false"></el-table-column> -->
					<el-table-column align="center" label="部门名称" prop="departName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="加班日" prop="remark1" :resizable="false"></el-table-column>
					<el-table-column align="center" label="加班开始时间" prop="worktimeStart" :resizable="false"></el-table-column>
					<el-table-column align="center" label="加班结束时间" prop="worktimeEnd" :resizable="false"></el-table-column>
					
					<el-table-column align="center" :resizable="false">
						<template slot="header" slot-scope="scope">
							<span>操作</span>
						</template>
						<template slot-scope="scope">
							<el-button size="mini" type="text" @click="handleEdit1(scope.$index, scope.row)">编辑</el-button>
							<el-button size="mini" type="text" @click="handleDel1(scope.$index, scope.row)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange2(val)})"
				 :current-page="currentPage2" :page-size="pageSize" layout="total, prev, pager, next" :total="total2">
				</el-pagination>
			</div>
			
			
			
		</div>


		<el-dialog width="500px" title="考勤配置" :visible.sync="dialogVisible">
			<el-form ref="form" :model="form" label-width="120px" size="mini" label-position="left">
				<!-- <el-form-item label="考勤日期">
					<el-date-picker v-model="form.checkDate" type="date" placeholder="选择日期" :disabled="tag=='add'?false:true"
					 value-format='yyyy-MM-dd'>
					</el-date-picker>

				</el-form-item> -->
				<el-form-item label="部门名称" prop='checkDepart' :rules="[$rules.requiredSelect]">
					<!-- <el-input v-model="form.department" :disabled="tag=='add'?false:true"></el-input> -->
					<el-select v-model="form.checkDepart" placeholder="请选择" :disabled="tag=='add'?false:true" value-key="orgId">
						<el-option v-for="item in departList" :key="item.orgId" :label="item.orgName" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="类型" prop='remark1' :rules="[$rules.requiredSelect]">
					<el-radio-group v-model="form.remark1" size="mini" @change='resetRemark'>
						<el-radio-button label="1">按周计划</el-radio-button>
						<el-radio-button label="2">按月计划</el-radio-button>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="打卡日">
					<el-checkbox-group v-model="form.remark2" v-show='form.remark1 == "1"'>
						<el-checkbox label="周一" name="type"></el-checkbox>
						<el-checkbox label="周二" name="type"></el-checkbox>
						<el-checkbox label="周三" name="type"></el-checkbox>
						<el-checkbox label="周四" name="type"></el-checkbox>
						<el-checkbox label="周五" name="type"></el-checkbox>
						<el-checkbox label="周六" name="type"></el-checkbox>
						<el-checkbox label="周日" name="type"></el-checkbox>
					</el-checkbox-group>
					
					<el-checkbox-group v-model="form.remark2" v-show='form.remark1 == "2"'>
						<el-checkbox v-for='item in 31' :label="item" name="type"></el-checkbox>
					</el-checkbox-group>

				</el-form-item>
				<!-- <el-form-item label="上下班时间">
					<el-time-picker is-range v-model="form.checkTime" range-separator="至" start-placeholder="开始时间" end-placeholder="结束时间"
					 placeholder="选择时间范围" value-format="HH:mm" format='HH:mm'>
					</el-time-picker>

				</el-form-item> -->
				<el-form-item label="上班时间">
					<el-time-picker v-model="form.checkMorningWorkTime" :picker-options="{
					  selectableRange: '00:00:00 - 23:59:59'
					}"
					 placeholder="结束日期" value-format="HH:mm" format='HH:mm'>
					</el-time-picker>
				
				</el-form-item>
				<el-form-item label="下班时间">
					<el-time-picker v-model="form.checkAfternoonWorkTime" :picker-options="{
					  selectableRange: '00:00:00 - 23:59:59'
					}"
					 placeholder="结束日期" value-format="HH:mm" format='HH:mm'>
					</el-time-picker>
				
				</el-form-item>
				<el-form-item label="迟到时间">
					<el-time-picker v-model="form.remark3" :picker-options="{
					  selectableRange: '00:00:00 - 23:59:59'
					}"
					 placeholder="结束日期" value-format="HH:mm" format='HH:mm'>
					</el-time-picker>

				</el-form-item>
				<el-form-item label="每月自动消除次数">
					<el-input v-model='form.remark4' type='number'></el-input>

				</el-form-item>
				<!-- <el-checkbox name="type" v-model="form.isClockMorning" :true-label='selected' :false-label='unselected'>是否上午打卡</el-checkbox>
				<el-form-item label="打卡时间" style='margin-top: 16px;'>
					<el-time-picker v-model="form.checkMorningWorkTime" placeholder="任意时间点" value-format='HH:mm:ss' format='HH:mm'
					 :disabled="!form.isClockMorning">
					</el-time-picker>
				</el-form-item>
				<el-checkbox name="type" v-model="form.isClockAfternoon" :true-label='selected' :false-label='unselected'>是否下午打卡</el-checkbox>
				<el-form-item label="打卡时间" style='margin-top: 16px;'>
					<el-time-picker v-model="form.checkAfternoonWorkTime" placeholder="任意时间点" value-format='HH:mm:ss' format='HH:mm'
					 :disabled="!form.isClockAfternoon">
					</el-time-picker>
				</el-form-item> -->

			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
				<el-button type="primary" @click="commit">确 定</el-button>
			</span>
			<!-- <div class='btn_contain clearfix' style="text-align: center;margin-top: 0.36rem;">
				<span class='commit' @click="commit">保存提交</span>
				<span class='close' @click="cancel">取消</span>
			</div> -->
		</el-dialog>
		
		
		<el-dialog width="500px" title="加班配置" :visible.sync="dialogVisible1">
			<el-form ref="form" :model="form1" label-width="100px" size="mini" label-position="left">
				<!-- <el-form-item label="考勤日期">
					<el-date-picker v-model="form.checkDate" type="date" placeholder="选择日期" :disabled="tag=='add'?false:true"
					 value-format='yyyy-MM-dd'>
					</el-date-picker>
		
				</el-form-item> -->
				<el-form-item label="部门名称" prop='checkDepart' :rules="[$rules.requiredSelect]">
					<!-- <el-input v-model="form.department" :disabled="tag=='add'?false:true"></el-input> -->
					<el-select v-model="form1.checkDepart" placeholder="请选择" :disabled="tag=='add'?false:true" value-key="orgId">
						<el-option v-for="item in departList" :key="item.orgId" :label="item.orgName" :value="item">
						</el-option>
					</el-select>
				</el-form-item>
				
				<el-form-item label="加班日">
					<el-checkbox-group v-model="form1.remark1">
						
						<el-checkbox label="周六" name="type"></el-checkbox>
						<el-checkbox label="周日" name="type"></el-checkbox>
					</el-checkbox-group>
					
		
				</el-form-item>
				<div> </div>
				<el-form-item label="加班开始时间">
					<el-time-picker v-model="form1.worktimeStart" 
					 placeholder="选择时间" value-format="HH:mm" format='HH:mm'>
					</el-time-picker>
		
				</el-form-item>
				<el-form-item label="加班结束时间">
					<el-time-picker v-model="form1.worktimeEnd" 
					 placeholder="选择时间" value-format="HH:mm" format='HH:mm'>
					</el-time-picker>
					
		
				</el-form-item>
				
		
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancel1">取 消</el-button>
				<el-button type="primary" @click="commit1">确 定</el-button>
			</span>
			<!-- <div class='btn_contain clearfix' style="text-align: center;margin-top: 0.36rem;">
				<span class='commit' @click="commit">保存提交</span>
				<span class='close' @click="cancel">取消</span>
			</div> -->
		</el-dialog>
		
	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				range: '1',
				activeName: 'first',
				radio6:"2",
				remark2: ['周一', '周二', '周三', '周四', '周五'],
				value3: '',
				value4: '',
				selected: 1,
				unselected: 0,
				canEidt: true,
				canEidt2: true,
				tag: 'add',
				departList: [],
				loading: false,
				form: {
					checkDate: '',
					checkDepartId: '',
					isClockMorning: 1,
					isClockAfternoon: 1,
					checkMorningWorkTime: '',
					checkAfternoonWorkTime: '',
					remark2: [],
					remark3: '',
					remark4: '',
					checkTime: ['', ''],
					remark1:"1",
				},
				form1: {
					remark1:[],
				},
				currentPage: 1,
				pageSize: 10,
				total: 0,
				tableList: [],
				
				currentPage1: 1,
				total1: 0,
				tableList1: [],
				
				currentPage2: 1,
				total2: 0,
				tableList2: [],

				dialogVisible: false,
				dialogVisible1: false,
				multipleSelection: [],
				multipleSelection1: [],
				multipleSelection2: [],
			}
		},
		components: {},
		methods: {
			resetRemark(){
				this.form.remark2 = [];
			},
			getDepartment() {
				let param = {
					orgType:2
				};
				this.axios.post('/perTaxToolTwo/attendance/customLoginController/getDepartment').then(res => {
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
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			queryListByPage(val) {
				let param = {
					data: {
						remark1:val
					},
					page: this.currentPage,
					row: this.pageSize

				};
				this.axios.post('/perTaxToolTwo/attendanceapplyconfigController/getDatePageList', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
						if(val == "1"){
							this.total = res.data.count;
							this.tableList = res.data.data;
						}else{
							this.total1 = res.data.count;
							this.tableList1 = res.data.data;
						}
						
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
			
			queryJBListByPage(){
				let param = {
					data: {
					},
					page: this.currentPage2,
					row: this.pageSize
				
				};
				this.axios.post('/perTaxToolTwo/attendanceWorktimeConfigController/queryListByPage', param).then(res => {
					this.loading = false;
					if (res.data.code == 200) {
							this.total2 = res.data.count;
							this.tableList2 = res.data.data;
						
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
			
			handleClick(){
				this.multipleSelection = [];
				this.multipleSelection1 = [];
				this.$refs.multipleTable.clearSelection();
				this.$refs.multipleTable1.clearSelection();
			},

			add() {
				this.tag = 'add';
				this.dialogVisible = true;
			},
			
			add2() {
				this.tag1 = 'add';
				this.dialogVisible1 = true;
			},

			handleEdit(index, row) {
				this.form = row;
				this.tag = 'edit';
				this.dialogVisible = true;
			},
			handleEdit1(index, row) {
				this.form1 = row;
				this.tag = 'edit';
				this.dialogVisible1 = true;
			},
			handleDel(index, row) {
				this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = [{
						"checkdateId": row.checkdateId
					}];
					this.axios.post('/perTaxToolTwo/attendanceapplyconfigController/deleteDate', param).then(res => {
						if (res.data.code == 200) {
							this.queryListByPage('1');
							this.queryListByPage('2');
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
			
			handleDel1(index, row) {
				this.$confirm('确定删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = [{
						"id": row.id
					}];
					this.axios.post('/perTaxToolTwo/attendanceWorktimeConfigController/delete', param).then(res => {
						if (res.data.code == 200) {
							this.queryJBListByPage();
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

			commit() {
				this.form.checkDepartId = this.form.checkDepart.orgId;
				this.form.checkDepartment = this.form.checkDepart.orgName;
				this.form.remark2 = this.form.remark2.join(",");
				// this.form.checkMorningWorkTime = this.form.checkTime[0];
				// this.form.checkAfternoonWorkTime = this.form.checkTime[1];
				let param = this.form;
				this.axios.post('/perTaxToolTwo/attendanceapplyconfigController/insertDate', param).then(res => {
					if (res.data.code == 200) {
						this.resetForm();
						this.dialogVisible = false;
						this.queryListByPage('1');
						this.queryListByPage('2');
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
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			commit1() {
				this.form1.departId = this.form1.checkDepart.orgId;
				this.form1.departName = this.form1.checkDepart.orgName;
				this.form1.remark1 = this.form1.remark1.join(",");
				// this.form1.worktimeStart = this.form1.checkTime[0];
				// this.form1.worktimeEnd = this.form1.checkTime[1];
				let param = this.form1;
				this.axios.post('/perTaxToolTwo/attendanceWorktimeConfigController/insert', param).then(res => {
					if (res.data.code == 200) {
						this.resetForm();
						this.dialogVisible1 = false;
						this.queryJBListByPage();
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
						message: '获取列表失败',
						type: 'error'
					});
				})
			},
			cancel() {
				this.resetForm();
				this.dialogVisible = false;
			},
			cancel1() {
				this.resetForm();
				this.dialogVisible1 = false;
			},
			resetForm() {
				this.form = {
					checkDate: '',
					checkDepartId: '',
					isClockMorning: 1,
					isClockAfternoon: 1,
					checkMorningWorkTime: '',
					checkAfternoonWorkTime: '',
					remark2: [],
					remark3: '',
					remark4: '',
					checkTime: ['', ''],
					remark1:"1",
				};
				this.form1 = {
					remark1:[],
				}
			},
			deleteMulti() {
				console.log(this.multipleSelection);
				console.log(this.multipleSelection1);
				this.$confirm('确定批量删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = this.multipleSelection.length > 0?this.multipleSelection:this.multipleSelection1;
					this.axios.post('/perTaxToolTwo/attendanceapplyconfigController/deleteDate', param).then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.queryListByPage('1');
							this.queryListByPage('2');
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
							message: '批量删除失败',
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
			deleteMulti2() {
				this.$confirm('确定批量删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = this.multipleSelection2;
					this.axios.post('/perTaxToolTwo/attendanceWorktimeConfigController/delete', param).then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.queryJBListByPage();
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
							message: '批量删除失败',
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
			
			handleSelectionChange(val) {
				this.multipleSelection = val;
			},
			handleSelectionChange1(val) {
				this.multipleSelection1 = val;
			},
			handleSelectionChange2(val) {
				this.multipleSelection2 = val;
			},
		},
		watch: {
			multipleSelection(newName, oldName) { //newName是改变后的值，oldName是初始的值
				if (newName.length > 0) {
					this.canEidt = false;
				} else {
					this.canEidt = true;
				}
			},
			multipleSelection1(newName, oldName) { //newName是改变后的值，oldName是初始的值
				if (newName.length > 0) {
					this.canEidt = false;
				} else {
					this.canEidt = true;
				}
			},
			multipleSelection2(newName, oldName) { //newName是改变后的值，oldName是初始的值
				if (newName.length > 0) {
					this.canEidt2 = false;
				} else {
					this.canEidt2 = true;
				}
			}
		},
		created() {
			this.queryListByPage("1");
			this.queryListByPage("2");
			this.queryJBListByPage();
			this.getDepartment()
		}
	}
</script>

<style scoped lang='less'>
	.main_contain {
		width: 100%;
		height: 100%;
		/* padding: 20px; */
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

		.contain_body {
			position: relative;
			// padding:0px 20px;
			background: #fff;
			margin: 20px 20px;
			
			h3 {
				height: 40px;
				line-height: 40px;
				padding-left: 20px
			}
		}
		
		/deep/ .el-tabs__header {
			padding: 0px 20px 0px 40px;
			margin: 0px;
		}
		
		/deep/ .el-tabs__content {
			padding-top: 10px;
			background: rgb(243, 246, 249);
		}
		
		/deep/ .el-tabs__nav-wrap::after {
			content: "";
			position: absolute;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 0px;
			background-color: #E4E7ED;
			z-index: 1;
		}


	}

	/deep/ .el-pagination {
		text-align: right;
		margin-top: 0.10rem;
	}
	
	/deep/ .el-table table {
		background-color: rgb(243, 246, 249);
		border-collapse: separate;
		border-spacing: 0px 3px;
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
		/* width: 180px; */
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
		color: #343434;
	}

	/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #fff;
	}
</style>
