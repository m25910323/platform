<template>
	<div class="main clearfix">
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item>配置管理</el-breadcrumb-item>
			<el-breadcrumb-item :to="{ path: '/messagePush' }">
				消息推送
			</el-breadcrumb-item>
			<el-breadcrumb-item>创建推送</el-breadcrumb-item>
		</el-breadcrumb>
		<div class="search_contain clearfix">
			<div class="contain" style="float: left;width: calc(100% - 520px);">
				<el-form ref="formName" :model="uploadData" size="small" label-width="100px">

					<el-form-item label="推送内容" prop="content">
						<el-input v-model="uploadData.content" type="textarea" rows="7" placeholder="请输入" />
					</el-form-item>

					<el-form-item label="推送接收人" prop="userIdList">
						<el-tag v-for="tag in userIdList" :key="tag.contactName" :disable-transitions="false" closable @close="handleClose(tag)">
							{{ tag.contactName }}
						</el-tag>
						<el-link v-show="userIdList.length === 0" :underline="false" type="info">
							点击右侧列表选择推送接收人
						</el-link>
					</el-form-item>
				</el-form>
				<el-button style="float: right;margin:0 20px 20px;" type="primary" size="medium" @click="commit()">
					发送
				</el-button>
			</div>
			<div class="contain1" style="float: right;width: 500px;box-sizing: border-box;">
				<el-select v-model="uploadData.customer" placeholder="请选择" filterable value-key="customerId" @change="getPushContactByCustomerId" size="small">
					<!-- <el-option label="1" value="1">
					</el-option> -->
					<el-option v-for="item in $store.state.cust" :key="item.customerId" :label="item.customerName" :value="item">
					</el-option>
				</el-select>
				<div v-for="(items,indexs) in departList" :key="indexs" class="item" @click="setUser(items,indexs)">
					<span>{{ items.contactName }}</span>
					<i v-show="items.isShow" class="el-icon-check" style="float: right;margin-right: 30px;vertical-align: middle;" />
				</div>
			</div>
		</div>
	</div>
</template>
<script>
	export default {
		name: "IncomeTaxCalculate",
		components: {},
		data() {
			return {
				loading: false,
				uploadData: {
					content: ""
				},
				groupIdList1: [],
				isList: [],
				userIdList: [],
				groupIdList: [],
				inputVisible: false,
				inputValue: "",
				universityList: [],
				departList: [],
				groupList: [],
				activeNames: ["1"]
			};
		},
		computed: {},
		watch: {
			$route(to, from) {
				if (to.name === "messageCreate") {

				}
			}
		},
		created() {


		},
		methods: {
			resetForm() {
				this.uploadData = {};
			},
			handleClose(tag) {
				this.userIdList.splice(this.userIdList.indexOf(tag), 1);
				
			},
			setUser(item, indexs) {
				if(!item.openId){
					this.$message({
						message: '未绑定公众号无法推送',
						type: 'warning'
					});
				}else{
					let tag = 0;
					let result = this.userIdList.some((items, idx) => {
						if (items.contactId === item.contactId) {
							tag = idx;
							return true;
						}
					});
					if (result) {
						this.userIdList.splice(tag, 1);
						// this.$set(
						// 	this.departList[indexs],
						// 	"isShow",
						// 	0
						// );
					} else {
						this.userIdList.push(item);
						// this.$set(
						// 	this.departList[indexs],
						// 	"isShow",
						// 	1
						// );
					}
				}
				
			},
			async commit() {
				this.uploadData.contact = this.userIdList;
				let params = this.uploadData;
				await this.$post("/perTaxToolTwo/pushByGzh/pushMsg", params);
				this.$router.push({
					name: "messagePush"
				});
			},

			
			async getPushContactByCustomerId(val) {
				let params = {
					"customerId": val.customerId,
					"customerName": val.customerName,
					// "customerId":"jz3779",
					//     "customerName":"九洲app测试专用"
				};
				const {
					data
				} = await this.$post("/perTaxToolTwo/pushByGzh/getPushContactByCustomerId", params);
				this.departList = data;
			}
		}
	};
</script>
<style lang='less' scoped>
	.main {
		width: 100%;
		height: 100%;
		box-sizing: border-box;

		/deep/ .hided .el-upload--picture-card {
			display: none;
		}

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
			border-top: 1px solid #f2f6fc;
			box-sizing: border-box;
		}

		/deep/ .longSelect {
			width: 500px;

			.el-input {
				width: 500px;
			}
		}

		/deep/ .search_contain {
			padding: 0 20px;

			div.contain {
				background: #fff;
				padding-top: 20px;

				.el-input {
					width: 200px;
				}

				.longSelect .el-input {
					width: 500px;
				}
			}

			.el-form-item {
				margin-right: 30px;
			}
		}

		/deep/ .el-collapse-item__header {
			padding: 0 20px;
			background: rgba(0, 55, 255, 0.04);
		}

		.item {
			height: 30px;
			line-height: 30px;
			padding-left: 20px;
			color: #333333;
			cursor: pointer;
			background: rgba(0, 55, 255, 0.02);

			i {
				height: 30px;
				line-height: 30px;
			}
		}

		.item:hover {
			background: rgba(0, 55, 255, 0.04);
		}

		.item:nth-of-type(1) {
			margin-top: 10px;
		}
	}
</style>
