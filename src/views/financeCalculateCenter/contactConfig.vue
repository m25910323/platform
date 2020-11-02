<template>
	<div class='main clearfix'>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>账簿</el-breadcrumb-item>
			<el-breadcrumb-item>往来信息配置</el-breadcrumb-item>
		</el-breadcrumb>
		<div class='search_contain'>
			<div>
				<el-form :model="uploadData" size="small" ref='formName' inline label-width="100px">

					<el-form-item label="年份" prop="year">
						<el-date-picker v-model="uploadData.year" type="year" placeholder="请选择" format="yyyy" value-format="yyyy">
						</el-date-picker>
					</el-form-item>
					<el-button type="info" @click='resetForm()' size="small" style="float: right;"> 重 置 </el-button>
					<el-button type="primary" @click='search()' size="small" style="float: right;margin-right: 20px;"> 查 找 </el-button>
				</el-form>
			</div>
		</div>
		<div class='main_contain'>
			<el-button style='float: right;' size="mini" type="primary" @click='handlePQ'>工作排期</el-button>
			<el-button style='float: right;margin-bottom: 10px;margin-right: 20px;' size="mini" type="primary" @click='handleSet'>日承接量配置</el-button>
			<el-table :data="tableData" style="width: 100%;" border v-loading='loading'>
				<el-table-column align="center" label="序号" prop="accountPeriod" :resizable="false">
					<template slot-scope="scope">
						<span>{{scope.$index + 1}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="月份" prop='mon' :resizable="false"></el-table-column>
				<el-table-column align="center" label="处理开始时间" prop='startTime' :resizable="false">
					<template slot-scope="scope">
						<span>{{scope.row.startTime?formatTimeToStr(scope.row.startTime,'M月d日'):'--'}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="当前排队" prop='endTime' :resizable="false">
					<template slot-scope="scope">
						<span>{{scope.row.endTime?formatTimeToStr(scope.row.endTime,'yyyy-MM-dd'):'--'}}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="每日最大承接客户数" prop='maxUndertakeNumber' :resizable="false"></el-table-column>
				<el-table-column align="center" label="处理未结束客户数" prop='unfinishedNum' :resizable="false"></el-table-column>
				<el-table-column align="center" label="操作" :resizable="false">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click='handleDetail(scope.row)'>查看排队详情</el-button>
					</template>
				</el-table-column>
			</el-table>

		</div>
		<!-- 待审核 -->
		<el-dialog width="400px" title="详情" :visible.sync="dialogVisible1">
			<el-form :model="detailInfo" size="small" ref='formName' label-width="80px" inline>
				<el-form-item label="日承接量" prop="maxUndertakeNumber">
					<el-input v-model="detailInfo.maxUndertakeNumber" type="number">
					</el-input>
				</el-form-item>

			</el-form>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible1 = false">取消</el-button>
				<el-button type="primary" @click="commit()">提交</el-button>
			</span>


		</el-dialog>


		<el-dialog width="800px" title="工作排期" :visible.sync="dialogVisible">
			<el-date-picker size="small" style="margin-bottom: 20px;" v-model="yearMonth" type="month" placeholder="请选择" format="yyyy-MM" value-format="yyyy-MM">
			</el-date-picker>
			<ele-calendar :render-content="renderContent" :data="datedef" :prop="prop" :border='true' :disabledDate='setDisable' @pick='handlePick' value-format='yyyy-MM-dd' :defaultValue='yearMonth' :lunarcalendar="true"></ele-calendar>

			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" @click="commitPQ()">保存</el-button>
			</span>


		</el-dialog>

	</div>
</template>

<script>
	import eleCalendar from 'ele-calendar'
	import 'ele-calendar/dist/vue-calendar.css'
	export default {
		name: "ContactConfig",
		data() {
			return {
				detailInfo: {},
				loading: false,
				uploadData: {
					year: "" + new Date().getFullYear()
				},
				yearMonth:this.formatTimeToStr(new Date(),'yyyy-MM'),
				
				year: "" + new Date().getFullYear(),
				tableData: [],
				total: 0,
				pageSize: 10,
				currentPage: 1,
				dialogVisible: false,
				dialogVisible1: false,
				datedef: [{
						"date": "2020-09-30",
						"content": null,
						"cid": null
					},
					{
						"date": "2020-09-26",
						"content": null,
						"cid": null
					},
				],
				temDate:[],
				prop: 'date' //对应日期字段名
			}
		},
		components: {
			eleCalendar
		},
		methods: {
			setDisable(param){
				if(param < new Date().getTime()){
					return true;
				}else{
					return false;
				}
			},
			resetForm() {
				this.uploadData = {}
			},
			search() {
				this.year = this.uploadData.year;
				this.queryPage();
			},


			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage()
			},


			handleDetail(row) {
				this.$router.push({
					path: 'contactConfigDetail',
					query: {
						year: this.year,
						month: row.mon,
						maxUndertakeNumber: row.maxUndertakeNumber
					}
				})


			},

			queryPage() {
				this.loading = true;
				let params = {
					"year": this.year
				};
				this.axios.post('/perTaxToolTwo/import/e9z/getE9zBusinessDealTimeConfig', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.tableData = res.data.data;
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
						this.loading = false;
						this.tableData = [];
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					});
			},
			queryDate() {

				let params = {
					"yearMonth": this.yearMonth
				};
				this.axios.post('/perTaxToolTwo/import/e9z/getE9zBusinessDealTimeConfigDateCanHandle', params)
					.then(res => {
						if (res.data.code == 200) {
							this.temDate = res.data.data;
							this.datedef = [];
							res.data.data.forEach(item => {
								this.datedef.push({
									date: item
								});
							})

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
			handleSet() {
				this.dialogVisible1 = true;
				this.queryRate();
			},
			handlePQ() {
				this.queryDate();
				this.dialogVisible = true;

			},
			commit() {
				let params = {
					"param": this.detailInfo.maxUndertakeNumber
				};
				this.axios.post('/perTaxToolTwo/e9z/E9zBusinessDealTimeConfig/DayUndertakeConfig', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
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
			
			commitPQ(){
				let params = {
					"yearMonth": this.yearMonth,
					"listDate": this.temDate.join(','),
				};
				this.axios.post('/perTaxToolTwo/import/e9z/configE9zBusinessDealTimeConfigDate', params)
					.then(res => {
						this.loading = false;
						if (res.data.code == 200) {
							this.dialogVisible = false;
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

			queryRate() {
				this.axios.post('/perTaxToolTwo/e9z/configDictionary/findDictionayList?dicName=承接量')
					.then(res => {
						if (res.data.code == 200) {
							this.$set(this.detailInfo, 'maxUndertakeNumber', res.data.data[0].dicName);
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

					}).catch(function(err) {
						this.$message({
							message: '获取承接量失败',
							type: 'error'
						});
					})
			},
			handlePick(date,event,row,dome){
				let lastDate = this.formatTimeToStr(date,'yyyy-MM-dd');
				let index = this.temDate.indexOf(lastDate);
				if(index != -1){
					console.log(event);
					console.log(dome);
					this.temDate.splice(index,1);
					this.datedef.splice(index,1);
				}else{
					this.temDate.push(lastDate);
					this.datedef.push({
						date: lastDate
					});
				}
				
			},
			renderContent(h, parmas) {
				const loop = data => {
					return (
						data.defvalue.value ? ( < div class = "is-selected" > < div > {
								data.defvalue.text
							} < /div>  <
							div >{data.defvalue.Lunar.lDayChinese}&nbsp;< /div> < /
							div > ) : < div >< div > {
							data.defvalue.text
						} < /div ><
							div >{data.defvalue.Lunar.lDayChinese}< /div> < /
							div >
					)
				}
				return ( <
					div style = "min-height:60px;" > {
						loop(parmas)
					} <
					/div>
				);
			},


		},
		watch: {

			'$route'(to, from) {
				// init data
				if (to.name == 'contactConfig') {
					this.queryPage();
				}

			},
		},
		computed: {},
		created() {
			this.queryPage();

		}
	}
</script>

<style lang='less' scoped>
	.main {
		/* background: #fff; */
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		.el-tag+.el-tag {
			margin-left: 10px;
		}

		.button-new-tag {
			margin-left: 10px;
			height: 32px;
			line-height: 30px;
			padding-top: 0;
			padding-bottom: 0;
		}

		.input-new-tag {
			width: 90px;
			margin-left: 10px;
			vertical-align: bottom;
		}

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

	/deep/ .el-dialog {
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

	/deep/ .is-selected {
		background-color: #f2f8fe;
		color: #1989fa
	}
</style>
