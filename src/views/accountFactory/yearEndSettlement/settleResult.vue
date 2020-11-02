<template>
	<div class="main_contain">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<!-- <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item> -->
			<el-breadcrumb-item>税务中心</el-breadcrumb-item>
			<el-breadcrumb-item>年终汇算</el-breadcrumb-item>
			<el-breadcrumb-item>汇算票据</el-breadcrumb-item>
		</el-breadcrumb>
		<div>
			<div class="contain_body">
				<el-tabs type="border-card" v-model="activeName">
					<el-tab-pane label="汇算票据" name='0'>
						<el-table :data="tableDetail" style="width: 100%;margin-top: 10px;" stripe border v-loading='loading' @row-click='showDetail'
						 ref='refTable' @expand-change="expandChange" :row-key='getRowKeys' :expand-row-keys="expands">
							<!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
							<el-table-column type="expand">
								<template slot-scope="props">
									<div class='clearfix'>
										<div style='float:left;width: calc(100% - 500px);box-sizing:border-box;padding-left:10px'>
											<h3>发票详情<el-button type="primary" size="mini" class='el-icon-refresh' @click="rotate1" style="font-size: 16px;margin-left: 12px;"></el-button></h3>
											<div style="margin-top: 12px;">
												
												<!-- <img :src="imageUrl10" alt="" style="width:100%;float: left;"> -->
												<img :src="imageUrl10" alt="" :style="{ transform: 'rotate(' + num1*90 + 'deg)', transformOrigin:'50% 50%'}" class="moimg">

											</div>


										</div>
										<div style='float:right;width: 500px;'>
											<div style='border:1px solid #efefef;box-sizing:border-box;margin:0px 10px;padding:10px 0px'>
												<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
													<el-form-item v-for='(item,index) in form' :label="item.fieldChName">
														<el-input v-model='item.fieldValue' size="mini" v-show='item.type != 3 && item.type != 4 && item.type != 5 && item.type != 6 && item.type != 14 && item.type != 15'></el-input>
														<el-select v-model="item.fieldValue" placeholder="请选择" clearable filterable
														 v-show='item.type == 3'>
															<el-option v-for="item in treeList" :label="item.ffullname" :value='item.ffullname'></el-option>
														</el-select>
														<el-select v-model="item.fieldValue" placeholder="请至少输入两个字符" clearable filterable remote reserve-keyword :remote-method="getTycNameMatchByName2do"
														 v-show='item.type == 5' @change="((val)=>{getTycByName(val, index)})">
															<el-option v-for="item in TycNameList" :label="item" :value='item' :key="item"></el-option>
														</el-select>
														<el-date-picker v-model="item.fieldValue" type="month" format="yyyy-MM" value-format="yyyy-MM" v-show='item.type == 4'>
														</el-date-picker>
														<el-input v-model='item.fieldValue' size="mini" v-show='item.type == 6' disabled></el-input>
														<el-input value='无票收入 无票' size="mini" v-show='item.type == 15' disabled></el-input>
														<el-select v-model="item.fieldValue" clearable v-show='item.type == 14'>
															<el-option label="一般计税" value='一般计税'></el-option>
															<el-option label="免税计税" value='免税计税'></el-option>
														</el-select>
													</el-form-item>

													<div></div>
													<el-button size="mini" type="primary" style='width:100px' @click='updateSchedule'>保存</el-button>
												</el-form>
											</div>
											<div style='border:1px solid #efefef;box-sizing:border-box;margin:10px 10px'>

												<div style="margin-top: 4px;">
													<img :src="modelUrl" alt="" style="width:100%;vertical-align: bottom;margin-right: 20px;">
													<!-- <el-button size="mini" type="primary">重新识别</el-button> -->
												</div>
												<div style='text-align: center;padding-bottom:12px'>
													<el-form :inline="true" class="demo-form-inline" size="mini" style='text-align: center;' label-width="150px">
														<el-form-item label="更换模板">
															<el-select v-model="detail.documentType000" placeholder="请选择模板" clearable filterable @change='handleCommand'
															 value-key='billId'>
																<el-option v-for="item in modelList" :label="item.fieldChName" :value='item'></el-option>
															</el-select>

														</el-form-item>

													</el-form>
													<el-button size="mini" type="primary" plain @click='revocation'>撤销</el-button>
												</div>
											</div>
										</div>
									</div>


								</template>
							</el-table-column>
							<el-table-column align="center" label="缩略图" prop='imageUrl'>
								<template slot-scope="scope">
									<img :src="scope.row.imageUrl" :alt="scope.row.imageUrl" style='width:100px;height: 100px;cursor:pointer'
									 @click='showDialog3(scope.row.imageUrl)'>
								</template>
							</el-table-column>
							<el-table-column align="center" label="票据类型" prop='typeName'></el-table-column>
							<el-table-column align="center" label="凭证类型" :filters="[{ text: '收入', value: 0 }, { text: '费用', value: 1 }, { text: '成本', value: 2 }, { text: '其他', value: 3 }, { text: '未分配', value: 4 }]"
							 :filter-method="filterTag1" filter-placement="bottom-end">
								<template slot-scope="scope">
									<span v-if='scope.row.documentType == 0'>收入</span>
									<span v-if='scope.row.documentType == 1'>费用</span>
									<span v-if='scope.row.documentType == 2'>成本</span>
									<span v-if='scope.row.documentType == 3'>其他</span>
									<span v-if='scope.row.documentType == 4'>未分配</span>
								</template>

							</el-table-column>
							<el-table-column align="center" label="置信度" prop='confidenceLevel'></el-table-column>
							<el-table-column align="center" label="创建时间" prop='createTime'></el-table-column>
							<!-- <el-table-column align="center" label="修改时间" prop='fFullName'></el-table-column> -->
							<el-table-column align="center" label="审核状态" :filters="[{ text: '未审核', value: 1 }, { text: '审核通过', value: 2 }, { text: '审核不通过', value: 3 }, { text: '问票中', value: 4 }]"
							 :filter-method="filterTag" filter-placement="bottom-end">
								<template slot-scope="scope">
									<span v-if='scope.row.state == 1'>未审核</span>
									<span v-if='scope.row.state == 2'>审核通过</span>
									<span v-if='scope.row.state == 3'>审核不通过</span>
									<span v-if='scope.row.state == 4'>问票中</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="状态">
								<template slot-scope="scope">
									<span v-if='scope.row.accountantState == 1'>凭证审核</span>
									<span v-if='scope.row.accountantState == 2'>发票审核</span>
									
									<span v-if='scope.row.accountantState == 0'>已上传</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="是否有效">
								<template slot-scope="scope">
									<span v-if='scope.row.isValid == 1'>是</span>
									<span v-else>否</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="来源">
								<template slot-scope="scope">
									<span v-show='scope.row.remark3 == 1'>后台</span>
									<span v-show='scope.row.remark3 == 2'>APP</span>
									<span v-show='scope.row.remark3 == 3'>代开票</span>
									<span v-show='scope.row.remark3 == 4'>自动开票</span>
									<span v-show='scope.row.remark3 == 5'>银行对账</span>
								</template>
							</el-table-column>
							<el-table-column align="center" label="上传人">
								<template slot-scope="scope">
									<span>{{scope.row.createPerson != null && !isNaN(scope.row.createPerson) && scope.row.createPerson.length == 11?scope.row.createPerson.slice(0,3) + '****' + scope.row.createPerson.slice(7,11):scope.row.createPerson}}</span>
								</template>
							</el-table-column>
							
							<el-table-column align="center" label="操作" prop="fYtdAmount">
								<template slot-scope="scope">
									<el-tooltip class="item" effect="dark" placement="top" v-show='scope.row.isHaveAmountMsg == 1'>
										<div slot="content" v-html='scope.row.amountMsg'></div>
										<i class="el-icon-warning" style='color: red;'></i>
									</el-tooltip>
									<el-tooltip class="item" effect="dark" :content="scope.row.repeatExplain" placement="top" v-show='scope.row.isRepeat == 1 || scope.row.isRepeat == 2'>
										<i class="el-icon-warning" style='color: red;'></i>
									</el-tooltip>
									<el-button type="text" size="mini" @click.stop='compare(scope.row)' v-show='scope.row.isRepeat == 1 || scope.row.isRepeat == 2'>比对</el-button>
									<el-button type="text" size="mini" @click.stop='showItemDetail(scope.row)' v-show='scope.row.fieldResults.length > 0'>清单</el-button>
									<el-button type="text" size="mini" @click.stop='delLine(scope.row)'>删除</el-button>
								</template>
							</el-table-column>

						</el-table>
					</el-tab-pane>
					
					
				</el-tabs>

			</div>
		</div>

		<el-dialog title="发票详情" :visible.sync="dialogVisible3" width="800px">
			<img :src="detailImg" :alt="detailImg" style='width:760px'>

		</el-dialog>

		

		


		<el-dialog title="对比" :visible.sync="dialogVisible10" width="1200px">
			<div class='clearfix'>
				<div>
					<el-button type="primary" @click="submitRepeat(1)" size='mini' v-show="isRepeat == 1">保留本张发票</el-button>
					<el-button type="primary" @click="submitRepeat(2)" size='mini'>保留重复的发票</el-button>
					<el-button type="primary" @click="submitRepeat(3)" size='mini'>同时保留</el-button>
				</div>
				<div style='float: left;width:560px'>
					<h3 style='height: 30px;line-height: 30px;'>本张发票</h3>
					<img :src="imageUrl1" :alt="imageUrl1" style='width:560px'>
				</div>
				<div style='float: right;width:560px'>
					<h3 style='height: 30px;line-height: 30px;'>重复的发票</h3>
					<img :src="imageUrl2" :alt="imageUrl1" style='width:560px'>
				</div>
			</div>
			
			
			
			
		</el-dialog>
		
		<el-dialog title="货物(劳务)比对" :visible.sync="dialogVisible5" width="100%" class='dialog'>
			<div class='clearfix'>
				<div style='float:left;width:700px'>
					<img :src='rowDetail.imageUrl' width='700px' />
				</div>
				<div style='float:right;width:calc(100% - 712px)'>
					<el-button type='primary' size='mini' @click='addLine'>新增</el-button>
					<el-table :data="rowDetail.itemResults" style='margin-top: 10px;'>
						<el-table-column align="center" v-for='(item,index) in rowDetail.fieldResults' :prop="item.fieldName" :label="item.fieldChName"
						 :width="index == 0?'250px':'' ">
							<template slot-scope="scope">
								<div v-show='item.type != 10' contenteditable="true" v-text="scope.row[item.fieldName]" @blur='handleInput(scope.$index, item.fieldName,$event)'></div>
								<el-select size="mini" v-model="scope.row[item.fieldName]" placeholder="请选择" clearable filterable  @change="((val,index)=>{handleSelect(val,scope.$index)})"
								 v-show='item.type == 10'>
									<el-option label="印花税" value='印花税'></el-option>
									<el-option label="增值税" value='增值税'></el-option>
									<el-option label="城市维护建设税" value='城市维护建设税'></el-option>
									<el-option label="教育费附加" value='教育费附加'></el-option>
									<el-option label="地方教育费附加" value='地方教育费附加'></el-option>
									<el-option label="个人所得税" value='个人所得税'></el-option>
									<el-option label="企业所得税" value='企业所得税'></el-option>
									<el-option label="其他税项" value='其他税项'></el-option>
									<el-option label="社保" value='社保'></el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column align="center" label="操作" width='120px'>
							<template slot-scope="scope">
		
								<el-button size="mini" type="text" v-show='!scope.row.resultIdList' @click.stop="handleAdd(scope.$index, scope.row)">确定新增</el-button>
								<el-button size="mini" type="text" v-show='scope.row.resultIdList' @click.stop="handleModify(scope.$index, scope.row)">确定修改</el-button>
								<el-button size="mini" type="text" @click.stop="handleDelete(scope.$index, scope.row)">删除</el-button>
		
							</template>
						</el-table-column>
		
		
					</el-table>
				</div>
			</div>
		
		
		
		</el-dialog>
		
		

	</div>
</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				TyList:[],
				TycNameList:[],
				treeList:[],
				isRepeat:'',
				activeName: '0',
				tableData: [],
				tag: 1,
				tableDetail: [],
				customerId: '',
				accountPeriod: '',
				customerName: '',
				ces: [{
					customerId: 1,
					customerName: "12"
				}],
				mainId: '',
				color: [
					"#ED878E", "#FFAC69", "#99CCFF", "#FFCCCC"
				],
				uploadData: {},
				list: [],
				fileList1: [],
				fileList2: [],
				fileList3: [],
				fileList4: [],
				fileList5: [],
				fileList11: [],
				loading: false,
				nameData: ['审核通过', '审核未通过', '未审核', '问票中'],
				formInline1: {
					bankname: '',
					typecode: ''
				},
				detail: {
					item: {
						customerId: 1,
						customerName: 2
					}

				},
				detail1: {
					scheduleId: '1',
					mainId: '1'
				},
				
				
				dialogVisible: false,
				dialogVisible1: false,
				dialogVisible3: false,
				dialogVisible5: false,
				dialogVisible6: false,
				dialogVisible10: false,
				total: 0,
				pageSize: 10,
				currentPage: 1,
				imageUrl1: '',
				imageUrl2: '',
				imageUrl10: '',
				ScheduleId: '',
				repeatScheduleId: '',
				expands: [],
				getRowKeys(row) {
					return row.scheduleId
				},
				
				modelUrl: '',
				form: [],
				scheduleId: "",
				scheduleType: '',
				picData: {
					scheduleType: 1,
					scheduleId: '',
					imageUrl: ''
				},
				images: [],
				hideUpload: false,
				modelList:[],
				rowDetail:{},
				num1:0,
				num2:0,
				num3:0,

			}
		},
		components: {},
		methods: {
			rotate1(){
				this.num1++;
			},
			rotate2(){
				this.num2++;
			},
			rotate3(){
				this.num3++;
			},
			

			submitRepeat(val) {
				let params = {
					"scheduleId1": this.ScheduleId,
					"scheduleId2": this.repeatScheduleId,
					"type": val
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/submitRepeatResult', params).then(res => {
					if (res.data.code == 200) {
						this.dialogVisible10 = false;
						this.queryListByPage();
						// this.tableList = res.data.data.contractServiceProjectList;
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
						message: '操作失败',
						type: 'error'
					});
				})
			},
			compare(row) {
				this.isRepeat = row.isRepeat;
				this.dialogVisible10 = true;
				this.repeatScheduleId = row.repeatScheduleId;
				this.ScheduleId = row.scheduleId;
				this.imageUrl1 = row.imageUrl;
				this.imageUrl2 = row.repeatUrl;
			},
			
			delLine(row) {
				this.$confirm('确认删除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let params = {
						"scheduleId": row.scheduleId,
						imageState : 0
					};
					// this.axios.post('/perTaxToolTwo/iocr/identify/deleteUploadSchedule', params).then(res => {
					this.axios.post('/perTaxToolTwo/iocr/main/updateByScheduleId', params).then(res => {
						if (res.data.code == 200) {
							this.queryListByPage();
							// this.tableList = res.data.data.contractServiceProjectList;
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
			filterTag(value, row) {
				return row.state == value;
			},
			filterTag1(value, row) {
				return row.documentType == value;
			},
			
			
			showItemDetail(row){
				this.dialogVisible5 = true;
				this.rowDetail = row;
			},
			
			addLine() {
				this.rowDetail.itemResults.push({})
			},
			handleInput(index, label, event) {
				this.rowDetail.itemResults[index][label] = event.currentTarget.innerText;
			
			},
			handleSelect(val, index) {
				this.rowDetail.itemResults[index]['TaxKind'] = val;
			},
			handleModify(index, row) {
				let param = row;
				this.axios.post('/perTaxToolTwo/iocr/main/updateInvoiceList', param).then(res => {
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
						message: '修改失败',
						type: 'error'
					});
				})
			},
			
			handleAdd(index, row) {
				let param = {
					"scheduleId": this.rowDetail.scheduleId,
					"listMap": row
				};
				this.axios.post('/perTaxToolTwo/iocr/main/insertInvoiceList', param).then(res => {
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
						message: '新增失败',
						type: 'error'
					});
				})
			},
			handleDelete(index, row) {
				if (!row.resultIdList) {
					this.rowDetail.itemResults.splice(index, 1)
				} else {
					this.$confirm('确定删除?', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let param = row.resultIdList;
						this.axios.post('/perTaxToolTwo/iocr/main/deleteInvoiceList', param).then(res => {
							if (res.data.code == 200) {
								this.queryListByPage();
								this.rowDetail.itemResults.splice(index, 1);
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
				}
			
			
			
			},
			
			
			
			queryListByPage() {
				let params = {
					"customerId":this.customerId,
					"settlementPeriod":this.settlementPeriod
				};
				this.axios.post('/perTaxToolTwo/iocr/identify/getUploadRecordDetail', params).then(res => {
					if (res.data.code == 200) {
						this.tableDetail = res.data.data;
						// this.tableList = res.data.data.contractServiceProjectList;
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
						message: '查看失败',
						type: 'error'
					});
				})
			},
			


			

			

			
			
			

			



			hideDialog() {
				this.dialogVisible1 = false;
			},

			showDialog3(imageUrl) {
				this.detailImg = imageUrl;
				this.dialogVisible3 = true;
			},
			
			showDetail(row, event, column) {
				this.num1 =0;
				this.num2 =0;
				this.$refs.refTable.toggleRowExpansion(row)
				this.row = JSON.parse(JSON.stringify(row));
				this.modelUrl = row.modelUrl;
				this.imageUrl10 = row.imageUrl;
				this.form = row.detailResults;
				this.scheduleId = row.scheduleId;
				this.scheduleType = row.type;
				this.picData.scheduleId = row.scheduleId;
				this.picData.imageUrl = row.imageUrl;
				this.picData.mainId = row.mainId;
				this.images = [{
					url: row.imageUrl
				}];
			},
			expandChange(row, expandedRows) {
				var that = this
				if (expandedRows.length) {
					that.expands = []
					if (row) {
						that.expands.push(row.scheduleId);
			
						// this.$refs.refTable.toggleRowExpansion(row)
						// this.row = JSON.parse(JSON.stringify(row));
						this.num1 =0;
						this.num2 =0;
						this.modelUrl = row.modelUrl;
						this.imageUrl10 = row.imageUrl;
						this.form = row.detailResults;
						this.scheduleId = row.scheduleId;
						this.scheduleType = row.type;
						this.picData.scheduleId = row.scheduleId;
						this.picData.imageUrl = row.imageUrl;
						this.picData.mainId = row.mainId;
						this.images = [{
							url: row.imageUrl
						}];
					}
				} else {
					that.expands = []
				}
			
			
			},
			
			updateSchedule() {
				let param = {
					scheduleType: 2,
					scheduleId: this.scheduleId,
					customerId:this.$route.query.customerId,
					// iocrUpdateStr:,
					type: this.scheduleType,
					iocrResultStr: JSON.stringify(this.form),
				};
				this.axios.post('/perTaxToolTwo/iocr/main/updateSchedule', this.qs.stringify(param), {
					headers: {
						"Content-Type": "application/x-www-form-urlencoded"
					}
				}).then(res => {
					if (res.data.code == 200) {
						this.queryListByPage(this.activeName);
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
						message: '保存失败',
						type: 'error'
					});
				})
			},
			getModelDetail() {
				let param = {};
				this.axios.post('/perTaxToolTwo/iocr/main/updateModel', param).then(res => {
					if (res.data.code == 200) {
						this.modelList = res.data.data;
			
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
			
				}).catch(function(err) {
					this.$message({
						message: '获取模板失败',
						type: 'error'
					});
				})
			},
			handleCommand(command) {
				let param = {
					billId: command.billId
				};
				this.axios.get('/perTaxToolTwo/iocr/main/getModelDetail?billId=' + command.billId).then(res => {
					if (res.data.code == 200) {
						this.form = res.data.data.child;
						this.modelUrl = res.data.data.parent.modelUrl;
						this.scheduleType = res.data.data.parent.billId;
						// this.$message({
						// 	message: res.data.msg,
						// 	type: 'success'
						// });
					} else {
						this.$message({
							message: res.data.msg,
							type: 'error'
						});
					}
				}).catch(function(err) {
					this.$message({
						message: '查看失败',
						type: 'error'
					});
				})
			},
			
			getProofTAccounts(index) {
				let params = {
					"id": '0',
					"fBrNo": this.customerName
				};
				this.axios.post('/perTaxToolTwo/e9/taccount/getProofTAccounts', params)
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							this.treeList = res.data.data;
							
							
			
							console.log(this.treeList)
			
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
			
			getTycNameMatchByName2do(query) {
				if(query !== ''){
					let params = {
						customerName:query
					};
					this.axios.post('perTaxToolTwo/api/user/register/getTycNameMatchByName2.do', this.qs.stringify(params))
						// this.axios.post('/miaoxing/queryPage', params)
						.then(res => {
							if (res.data.code == 200) {
								this.TycNameList = res.data.data;
								
								
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
				}else{
					 this.TycNameList = [];
				}
				
			},
			
			getTycByName(val,index){
				let params = {
					customerName:val
				};
				this.axios.post('perTaxToolTwo/api/user/register/getTycByName.do', this.qs.stringify(params))
					// this.axios.post('/miaoxing/queryPage', params)
					.then(res => {
						if (res.data.code == 200) {
							// this.form[index]['invoice_industry'] = res.data.data;
							this.$set(this.form[index + 1],'fieldValue',res.data.data.industry)
							
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
			
			revocation() {
				// this.form =  
				this.showDetail(this.row)
			},
		},
		watch: {
		
			'$route'(to, from) {
				// init data
				if (to.name == 'settleResult') {
					this.activeName = '0';
					// this.mainId = this.$route.query.mainId;
					this.settlementPeriod = this.$route.query.accountPeriod;
					this.customerId = this.$route.query.customerId;
					this.customerName = this.$route.query.customerName;
					this.queryListByPage('0');
					this.getModelDetail();
					this.getProofTAccounts();
				}

			}
		},
		created() {
			this.activeName = '0';
			// this.mainId = this.$route.query.mainId;
			this.settlementPeriod = this.$route.query.accountPeriod;
			this.customerId = this.$route.query.customerId;
			this.customerName = this.$route.query.customerName;
			this.queryListByPage('0');
			this.getModelDetail();
			this.getProofTAccounts();
			
			// this.getTycNameMatchByName2do();
		}
	}
</script>

<style scoped lang="less">
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
		.moimg{
			width: 100%;
			height: 600px;
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

	.contain_header {
		height: 0.5rem;
		margin: 10px 20px;
		padding: 10px 30px;
		// background: url(../../assets/img/list-bg1.png) no-repeat;
		background-size: cover;
		background: #fff;
		box-sizing: border-box;

		// 		/deep/ input::-webkit-input-placeholder {
		// 			/* placeholder颜色  */
		// 			color: #fff;
		// 		}
		// 
		// 		/deep/ .el-select__caret {
		// 			color: #fff
		// 		}



		/deep/ .el-input.is-active .el-input__inner,
		/deep/ .el-input__inner:focus {
			// border-color: #fff;
			outline: 0;
		}
	}

	.contain_body {
		padding: 10px 20px;
		margin: 10px 20px;
		background: #fff;

		.card {
			position: relative;
			background: #fff;
			width: calc(50% - 10px);
			height: 300px;
			margin-bottom: 20px;
			position: relative;

			.text_contain {
				position: absolute;
				// width: 100%;

				height: 40px;
				line-height: 40px;
				top: 50px;
				text-align: center;
				right: 0px;

				// color: rgb(61,157,255);
				.text1 {
					background: #fff;
					color: rgb(61, 157, 255);
					display: inline-block;
					width: 80px;
					height: 30px;
					line-height: 30px;
					border-radius: 15px;
					cursor: pointer;
					margin-right: 10px
				}
			}


			.card_first {
				height: 100px;
				background: rgb(61, 157, 255);
				background-size: auto 150px;
				color: #fff;
				box-sizing: border-box;
				border-top-right-radius: 4px;
				border-top-left-radius: 4px;
				padding: 0 12px;

				p {
					width: 50%;
					height: 24px;
					line-height: 24px;
					box-sizing: border-box;
					padding-left: 4px;
				}


				div.p_first {
					// float:none;
					width: 100%;
					font-size: 14px;
					height: 40px;
					line-height: 40px;
					padding-left: 4px;
					border-bottom: 1px solid #fff;
					margin-bottom: 6px;

					span {
						float: right;
						font-size: 12px;
					}
				}

			}

			.charts {
				height: 200px;
			}
		}
	}

	/deep/ .el-pagination {
		text-align: right;
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
		background-color: #fff;
	}

	/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
		background: #fff;
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
		background-color: #fff;
	}

	/deep/ .el-table thead {
		color: #343434;
	}

	/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
		background-color: #fff;
	}

	/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
		border-bottom-color: #fff;
		background: #fff;
	}

	/deep/ .el-dialog__body {
		padding: 0 20px 30px;
	}

	.dialog {
		div.line {
			width: 100%;
			height: 1px;
			background: #efefef
		}

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
			width: 100%;
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

	.btn_contain {
		text-align: center;
		margin-top: 0.36rem;
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
</style>
