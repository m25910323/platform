<template>
	<div class="main_contain">
		<div class="left_contain">
			<div class="contain_header">
				<div class='title'>发票模板配置</div>
				<el-form :inline="true" :model="formInline" class="demo-form-inline" size="mini" label-width="86px">
					<el-form-item label="模板名称:">
						<el-select v-model='formInline.tmplName' clearable filterable>
							<el-option v-for='item in tableList' :label="item.tmplName" :value="item.tmplName"></el-option>
						</el-select>
						<!-- <el-input v-model='formInline.tmplName'></el-input> -->
					</el-form-item>
					<el-form-item label="纳税人类型:">
						<el-select v-model='formInline.tmplType' clearable>
							<el-option v-for='item in dicNameList' :label="item.dicName" :value="item.dicValue"></el-option>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button @click='search' size="mini">查询</el-button>
					</el-form-item>
				</el-form>
			</div>
			<div class="contain_body">
				<el-table :data="tableList" style="width: 100%;overflow:auto" stripe border @row-click='queryColumnList'>
					<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->
					<el-table-column align="center" label="显示名称" prop="tmplName" :resizable="false"></el-table-column>
					<el-table-column align="center" label="纳税人类型" :resizable="false">
						<template slot-scope="scope">
							<span v-show='scope.row.tmplType == 0'>通用</span>
							<span v-show='scope.row.tmplType == 233'>一般纳税人</span>
							<span v-show='scope.row.tmplType == 232'>小规模纳税人</span>
						</template>
					</el-table-column>
					<!-- <el-table-column align="center" label="显示名称" prop="tmplName" :resizable="false"></el-table-column> -->

				</el-table>
			</div>
		</div>
		<div class="right_contain" v-loading="loading" ref='rightContain'>
			<el-table :data="columnList" style="width: 100%;overflow:auto" stripe border :max-height="tableHeight">
				<!-- <el-table-column align="center" type="selection" width="50"></el-table-column> -->
				<el-table-column align="center" label="字段名" :resizable="false" fixed="left">
					<template slot-scope="scope">
						<div v-text='scope.row.columnTitle' @blur="setLine($event,scope.row,'columnTitle')">
						</div>
					</template>
				</el-table-column>
				<el-table-column align="center" label="列类型" prop="columnType" :resizable="false" width="100">
					<template slot-scope="scope">
						<el-select v-model='scope.row.columnType' size="mini">
							<el-option v-for='item in columnTypeList' :label="item.label" :value="item.value"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="计算优先级" :resizable="false">
					<template slot-scope="scope">
						<div v-text='scope.row.columnCalcIndex' @blur="setLine($event,scope.row,'columnCalcIndex')">
						</div>
					</template>
				</el-table-column>
				<el-table-column align="center" label="是否必填" prop="columnRequire" :resizable="false" width="100">
					<template slot-scope="scope">
						<el-select v-model='scope.row.columnRequire' size="mini">
							<el-option v-for='item in columnRequireList' :label="item.label" :value="item.value"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="是否参与计算" prop="columnCalc" :resizable="false" width="100">
					<template slot-scope="scope">
						<el-select v-model='scope.row.columnCalc' size="mini">
							<el-option v-for='item in columnCalcList' :label="item.label" :value="item.value"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="适用税务类型" prop="taxesTaxType" :resizable="false" width="160">
					<template slot-scope="scope">
						<el-select v-model='scope.row.taxesTaxType' size="mini">
							<el-option v-for='item in taxesTaxTypeList' :label="item.label" :value="item.value"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="是否显示" prop="columnShow" :resizable="false" width="100">
					<template slot-scope="scope">
						<el-select v-model='scope.row.columnShow' size="mini">
							<el-option v-for='item in columnShowList' :label="item.label" :value="item.value"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="是否可编辑" prop="columnEdit" :resizable="false" width="100">
					<template slot-scope="scope">
						<el-select v-model='scope.row.columnEdit' size="mini">
							<el-option v-for='item in columnEditList' :label="item.label" :value="item.value"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="可否为负数" prop="columnEditRule" :resizable="false" width="100">
					<template slot-scope="scope">
						<el-select v-model='scope.row.columnEditRule' size="mini">
							<el-option v-for='item in columnEditRuleList' :label="item.label" :value="item.value"></el-option>
						</el-select>
					</template>
				</el-table-column>
				<el-table-column align="center" label="默认值" :resizable="false">
					<template slot-scope="scope">
						<div contenteditable='true' v-text='scope.row.defaultValue' @blur="setLine($event,scope.row,'defaultValue')">
						</div>
					</template>
				</el-table-column>
				<el-table-column align="center" label="操作" :resizable="false" fixed="right">
					<template slot-scope="scope">
						<el-button size="mini" type="text" @click="save(scope.row)">
							保存</el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- <el-pagination background style="margin-top:10px;" @current-change="((val)=>{handleCurrentChange(val, '2')})"
			 :current-page="currentPage1" :page-size="pageSize1" layout="total, prev, pager, next" :total="total1">
			</el-pagination> -->
		</div>
	</div>
</template>

<script>
	export default {
		name: "router1",
		data() {
			return {
				tableHeight: '',
				formInline: {
					tmplName: '',
					tmplType: ''
				},
				// currentPage1: 1,
				// pageSize1: 10,
				// total1: 0,
				tableList: [],
				columnList: [],
				dicNameList: [],
				loading: false,
				columnRequireList: [{
						label: '是',
						value: 1
					},
					{
						label: '否',
						value: 0
					}
				],
				columnCalcList: [{
						label: '是',
						value: 1
					},
					{
						label: '否',
						value: 0
					}
				],
				columnShowList: [{
						label: '是',
						value: 1
					},
					{
						label: '否',
						value: 0
					}
				],
				columnEditList: [{
						label: '是',
						value: 1
					},
					{
						label: '否',
						value: 0
					}
				],
				columnEditRuleList: [{
						label: '是',
						value: "1"
					},
					{
						label: '否',
						value: "0"
					}
				],
				columnTypeList: [{
						label: '整数',
						value: "int"
					},
					{
						label: '小数',
						value: "decimal"
					},
					{
						label: '字符',
						value: "varchar"
					}
				],
				taxesTaxTypeList: [{
						label: '通用',
						value: "0"
					},
					{
						label: '小规模纳税人',
						value: "232"
					},
					{
						label: '一般纳税人',
						value: "233"
					}
				],
			}
		},
		components: {},
		methods: {
			/*
			 * 获取纳税人类型下拉列表
			 * {params}
			 * 无
			 * 一般纳税，小规模纳税
			 * */
			queryDicName() {
				this.axios.post('/perTaxToolTwo/e9z/configDictionary/findDictionayList?dicName=税务类型').then(res => {
						if (res.data.code == 200) {
							this.dicNameList = res.data.data;
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
			queryTemplateList() {
				let params = this.formInline;
				this.axios.post('/perTaxToolTwo/e9z/configTemplate/findTemplateListByTypeAndName', params)
					.then(res => {
						if (res.data.code == 200) {
							this.tableList = res.data.data;
							// this.total = 
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
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					})
			},
			queryColumnList(row) {
				this.loading = true;
				let params = {
					"tmplId": row.tmplId
				};
				this.axios.post('/perTaxToolTwo/e9z/configColumn/findColumnList', params)
					.then(res => {
						if (res.data.code == 200) {
							this.columnList = res.data.data;
							this.$nextTick(function() {
								this.loading = false;
							})
							// this.total = 
						} else {
							this.loading = false;
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
						this.loading = false;
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					})
			},
			save(row) {
				console.log('row', row);
				let params = [
					row
				];
				this.axios.post('/perTaxToolTwo/e9z/configColumn/insertAndUpdateColumnList', params)
					.then(res => {
						if (res.data.code == 200) {
							this.queryColumnList(row);
							this.$message({
								message: res.data.msg,
								type: 'success'
							});
							// this.total = 
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
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					})
			},
			setLine(event, row, name) {
				let text = event.target.innerText;
				row[name] = text;
			},
			search() {
				this.queryTemplateList();
				this.columnList = []
			}
		},
		watch: {},
		computed: {},
		created() {
			this.queryDicName();
			this.queryTemplateList()
		},
		mounted() {
			this.tableHeight = this.$refs.rightContain.$el.offsetHeight;
		}
	}
</script>

<style lang='less' scoped>
	@button: #4cb6dc;
	@button_orange: #ffbb84;
	@blue: #4bb6dc;
	@orange: #ffb980;
	@pcolor: #999;
	@scolor: #ed878e;

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

	.blue {
		color: @blue
	}

	.main_contain {
		padding: 0.2rem;
		width: calc(100% - 0.4rem);
		height: calc(100% - 0.4rem);

		/deep/ input::-webkit-input-placeholder {
			/* placeholder颜色  */
			color: #fff;
		}
	}

	.left_contain {
		width: calc(40% - 0.15rem);
		background: #fff;
		border-radius: 0.06rem;
		float: left;
		height: 100%;

		.contain_header {
			height: 2rem;
			padding: 0px 30px;
			background: url(../../../assets/img/list-bg1.png) no-repeat;
			background-size: cover;
			border-top-left-radius: 0.06rem;
			border-top-right-radius: 0.06rem;

			.title {
				font-size: 0.24rem;
				padding-top: 0.2rem;
				// height: 1rem;
				// line-height: 1.24rem;
				color: #fff;
			}

			/deep/ .el-form-item--mini .el-form-item__label {
				color: #fff;
			}

			/deep/ .el-form {
				margin-top: 0.1rem
			}
		}

		.contain_body {
			padding: 0.2rem 0.2rem 0rem;
			height: calc(100% - 2rem);
			box-sizing: border-box;
			overflow-y: auto;
		}

		/deep/ .el-form {
			/deep/ .el-form-item {
				margin-right: 0.1rem;

				label {
					// width: 1rem;
					font-size: 0.14rem;
					padding: 0 0.12rem 0 0;
				}

				.el-form-item__content {}
			}

			/deep/ .el-form-item.long {
				label {
					// width: 1.4rem;
				}
			}

			/deep/ .el-form-item.line {
				width: 100%;

				.el-form-item__content {
					width: calc(100% - 1rem);

					.el-input {
						width: calc(100% - 1.4rem);

						.el-input__inner {
							width: 100%;
						}
					}

					.el-button {
						width: 1.2rem;
						margin-left: 0.2rem;
						background-color: @orange;
						border-color: @orange;
					}
				}
			}
		}

		/deep/ .el-input__inner {
			width: 180px;
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

		/deep/ .el-select__caret {
			color: #fff;
		}

		p {
			color: @pcolor;
			font-size: 0.14rem;
			line-height: 0.30rem;

			span {
				color: @scolor;
			}
		}

		.el-button.confirm {
			display: block;
			margin: 0.4rem auto;
			width: 2.8rem;
			height: 0.7rem;
			font-size: 0.18rem;
		}
	}

	.right_contain {
		width: calc(60% - 0.15rem);
		height: 100%;
		float: right;
		background: #fff;
		border-radius: 0.06rem;
		box-sizing: border-box;
		padding: 20px;
		overflow: auto;

		.contain_header {
			height: 2rem;
			box-sizing: border-box;
			padding: 0.2rem 0.2rem;
			display: flex;
			flex-direction: row;
			background: url(../../../assets/img/list-bg2.png) no-repeat;
			background-size: cover;
			border-top-left-radius: 0.06rem;
			border-top-right-radius: 0.06rem;

			/deep/ .el-select__caret {
				color: #fff;
				line-height: 0.4rem;
			}

			/deep/ .el-input__inner {
				border: 0.01rem solid #fff;
				line-height: 0.4rem;
				height: 0.4rem;
			}

			/deep/ .el-button {
				background: #fff;
				color: @button_orange;
				width: 1.05rem;
				height: 1.20rem;
				margin-left: 0.30rem;
				border-color: #fff;
				font-size: 0.18rem;
				letter-spacing: 0.05rem;
				line-height: 2;
			}

			::-webkit-input-placeholder {
				/* WebKit browsers */
				color: #A9A9A9;
			}

			:-moz-placeholder {
				/* Mozilla Firefox 4 to 18 */
				color: #A9A9A9;
				opacity: 1;
			}

			::-moz-placeholder {
				/* Mozilla Firefox 19+ */
				color: #A9A9A9;
				opacity: 1;
			}

			:-ms-input-placeholder {
				/* Internet Explorer 10+ */
				color: #A9A9A9;
			}
		}

		/deep/ .el-table {
			/* height: 100%; */
		}

		/deep/ .el-form-item__label {
			color: #fff;
			font-size: 0.14rem
		}

		/deep/ .el-form {
			width: calc(100% - 1.35rem);
			display: flex;
			flex-direction: row;
			justify-content: space-between;
			flex-wrap: wrap; // align-content: space-between;

			.el-form-item {
				margin-right: 0rem
			}
		}

		/deep/.el-form-item {
			/* width: 25%; */
			margin-bottom: 0rem;
		}

		/deep/ .info {
			width: 100%;
			margin-top: 0.20rem;

			/deep/ .el-button {
				float: right;
				background: #fff;
				color: @button;
				width: 1.30rem;
				height: 0.40rem;
				border-color: #fff
			}

			.large {
				font-size: 0.30rem;
				color: #fff
			}

			.mini {
				font-size: 0.16rem;
				color: #fff;
				margin-left: 0.20rem;
			}
		}

		/deep/ .el-input__inner {
			border: 0.01rem solid #ddd;
			background: transparent;
			color: #666;
			width: 80px;
		}

		/deep/ input::-webkit-input-placeholder {
			/* placeholder颜色  */
			color: #666;
		}

		/deep/ .el-table__footer-wrapper,
		/deep/ .el-table__header-wrapper {
			/* overflow: initial; */
		}

		/deep/ .el-table--scrollable-x .el-table__body-wrapper {
			overflow-x: initial;
		}
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

	.el-dialog .el-form {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap
	}

	/deep/ .el-date-editor.el-input {
		width: 180px;
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
