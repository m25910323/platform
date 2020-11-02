<template>
	<div class="main clearfix">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>配置管理</el-breadcrumb-item>
			<el-breadcrumb-item>消息推送</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="search_contain">
			<div>
				<el-form ref="formName" :model="uploadData" size="small" inline label-width="100px">
					<el-form-item label="推送内容" prop="messagePushContent">
						<el-input v-model="uploadData.messagePushContent" placeholder="请输入" clearable filterable />
					</el-form-item>
					<el-button type="info" size="small" style="float: right;" @click="resetForm()">
						重 置
					</el-button>
					<el-button type="primary" size="small" style="float: right;margin-right: 20px;" @click="search()">
						查 找
					</el-button>
				</el-form>
			</div>
		</div>
		<div class="main_contain">
			<div style="text-align: center;" class="clearfix">
				<el-button class="el-icon-refresh" type="text" size="mini" style="float:right;margin-left: 10px;" @click="refresh()">
					刷新
				</el-button>
				<el-button class="el-icon-add" type="text" size="mini" style="float:right" @click="add()">
					创建推送
				</el-button>
			</div>
			<el-table v-loading="loading" :data="tableData" style="width: 100%;" border>
				<el-table-column align="center" label="推送事件" prop="pushEventName" :resizable="false" />
				<el-table-column align="center" label="推送内容" prop="pushContent" :resizable="false" width="700" />
				<el-table-column align="center" label="推送人" prop="sendUserName" :resizable="false" />
				<el-table-column align="center" label="推送方式" prop="pushSource" :resizable="false">
					<template slot-scope="scope">
						<span>{{ scope.row.pushSource == 1?"自动":"后台" }}</span>
					</template>
				</el-table-column>
				<el-table-column align="center" label="推送时间" prop="pushTime" :resizable="false">
					<template slot-scope="scope">
						<span>{{ formatTimeToStr(scope.row.pushTime,'yyyy-MM-dd hh:mm:ss') }}</span>
					</template>
				</el-table-column>

				<el-table-column align="center" label="操作" :resizable="false">
					<template slot-scope="scope">
						<el-button type="text" size="mini" @click="handleDetail(scope.row)">
							查看详情
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background style="margin-top:10px;" :current-page="currentPage" :page-size="pageSize" layout="total, prev, pager, next"
			 :total="total" @current-change="((val)=>{handleCurrentChange(val, '4')})" />
		</div>
		<el-dialog width="700px" title="详情" :visible.sync="dialogVisible">
			<el-table :data="detail" style="width: 100%;" border>
				<el-table-column align="center" label="公司名称" prop="customerName" :resizable="false" />
				<el-table-column align="center" label="接收人姓名" prop="receiveUserName" :resizable="false" />
				<el-table-column align="center" label="手机号" prop="receiveUserPhone" :resizable="false" />
				<el-table-column align="center" label="推送状态" prop="pushState" :resizable="false">
					<template slot-scope="scope">
						<span>{{ scope.row.pushState == 0?"成功":"失败" }}</span>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination background style="margin-top:10px;text-align: center;" :current-page="currentPage1" :page-size="pageSize1" layout="total, prev, pager, next"
			 :total="total1" @current-change="((val)=>{handleCurrentChange1(val, '4')})" />
		</el-dialog>
	</div>
</template>
<script>
	export default {
		name: "IncomeTaxCalculate",
		components: {},
		data() {
			return {
				isJzcollectAdmin: "",
				universityList: [],
				loading: false,
				uploadData: {},
				detail: {},
				tableData: [],
				total: 0,
				pageSize: 10,
				currentPage: 1,
				total1: 0,
				pageSize1: 10,
				currentPage1: 1,
				multiSelection: [],
				dialogVisible: false,
				dialogVisible1: false,
				form: {},
				form1: {},
				activeValue: 1,
				inactiveValue: 0,
			};
		},
		computed: {},
		watch: {
			"$route"(to, from) {
				if (to.name === "messagePush") {
					this.queryPage();
				}
			}
		},
		created() {
			this.queryPage();
		},
		methods: {
			resetForm() {
				this.uploadData = {};
			},
			search() {
				this.pushContent = this.uploadData.pushContent;
				this.queryPage();
			},
			refresh() {
				this.queryPage();
			},
			add() {
				this.$router.push({
					name: "messageCreate"
				});
			},
			handleCurrentChange(val) {
				this.currentPage = val;
				this.queryPage();
			},
			handleCurrentChange1(val) {
				this.currentPage1 = val;
				this.queryDetail(this.postData.uuid);
			},
			handleDetail(row) {
				this.postData = JSON.parse(JSON.stringify(row));
				this.dialogVisible = true;
				this.queryDetail(row.uuid);
			},
			async queryDetail(id){
				let params = {
					page: this.currentPage1,
					row: this.pageSize1,
					data: {
						uuid: id
					}
				};
				const {
					data,
					count
				} = await this.$post("/perTaxToolTwo/pushByGzh/getPushRecordDetailByPage", params);
				this.detail = data;
				this.total1 = count;
			},
			handleModify(row) {
				this.$router.push({
					name: "messageCreateC",
					query: {
						messagePushContent: row.messagePushContent,
						universityId: row.universityId,
						departmentInfoList: row.departmentInfoList,
						userGroupList: row.userGroupList,
						userInfoList: row.userInfoList,
					}
				});
			},
			async queryPage() {
				this.loading = true;
				let params = {
					page: this.currentPage,
					row: this.pageSize,
					data: {
						pushContent: this.pushContent
					}
				};
				const {
					data,
					count
				} = await this.$post("/perTaxToolTwo/pushByGzh/getPushRecordByPage", params);
				this.loading = false;
				this.tableData = data;
				this.total = count;
			},
		}
	};
</script>
<style lang='less' scoped>
	.main {
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		.el-breadcrumb {
			height: 40px;
			line-height: 39px;
			padding-left: 20px;
			border-top: 1px solid #f2f6fc;
			box-sizing: border-box;
		}

		/deep/ .search_contain {
			background: #fff;
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

		.el-tag+.el-tag {
			margin-left: 10px;
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
			color: #8c8c8c;
		}

		/deep/ .el-table--enable-row-hover .el-table__body tr:hover>td {
			background-color: #efe9e5;
		}

		/deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
			border-bottom-color: #fff;
			background: #f9f9f9;
		}

		.main_contain {
			background: #fff;
			margin: 0px 20px 20px;
			padding: 12px 20px 20px;

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
</style>
