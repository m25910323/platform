<template>
	<div class='home' v-loading.fullscreen.lock="loading">
		<el-container>
			<el-header class='header' height='88px'>
				<h1 class='left'>财务系统</h1>
				<div class="topMenu">
					<el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect" router>
						<!-- <el-menu-item index="1">首页</el-menu-item>
						<el-menu-item index="2">会计工厂</el-menu-item>
						<el-menu-item index="3">系统管理中心</el-menu-item>
						<el-menu-item index="4">销售中心</el-menu-item>
						<el-menu-item index="5">人资系统</el-menu-item>
						<el-menu-item index="6">财务核算中心</el-menu-item>
						<el-menu-item index="7">行政管理中心</el-menu-item> -->
						<el-menu-item v-for='item in mainMenuList' :index="item.productId" :route="item.productRemark">{{item.productName}}</el-menu-item>
						
					</el-menu>
				</div>
				<div class='pr20 mt34 right'>

					<el-dropdown @command="handleCommand">
						<i class="el-icon-user"></i>
						<el-dropdown-menu slot="dropdown">
							<el-dropdown-item>{{userName}}</el-dropdown-item>
							<el-dropdown-item command='modifyPsw'>修改密码</el-dropdown-item>
							<el-dropdown-item command='logout'>退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</el-dropdown>
				</div>
			</el-header>
			<el-container>
				<el-aside width="2.2rem">
					<el-row class="tac">
						<el-col>

							<el-menu router :unique-opened="true" :default-active="$route.path" class="el-menu-vertical-demo" @open="handleOpen"
							 @close="handleClose">
								<NavMenu :navMenus="navMenus"></NavMenu>
							</el-menu>
							

							</el-menu>
							

						</el-col>
					</el-row>
				</el-aside>
				<el-container>
					<el-main style='height: 100%;'>
						<keep-alive>
							<router-view></router-view>
						</keep-alive>

					</el-main>
					<el-footer height='0.44rem'>
						技术支持：江苏百清科技有限公司
					</el-footer>
				</el-container>
			</el-container>
		</el-container>
		<el-dialog title="修改密码" :visible.sync="dialogVisible" width="30%">
			<el-form ref="form" :model="form" label-width="80px" :rules="rules">
				<el-form-item label="旧密码" prop="oldPwd">
					<el-input v-model="form.oldPwd"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="newPwd">
					<el-input v-model="form.newPwd"></el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="cancelPsw">取 消</el-button>
				<el-button type="primary" @click="modifyPsw">确 定</el-button>
			</span>
		</el-dialog>
	</div>
</template>

<style lang="less" scoped>
	@bgcolor: #354053;
	@hcolor: #fff;

	.home,
	.el-container {
		height: 100%;
	}

	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale; // text-align: center;
		color: #2c3e50;
		height: 100%;
	}

	
	

	.el-aside {
		background: #354053;
	}

	.tac{
		/deep/ .el-menu {
			border: none;
			background:none;
			.el-menu-item{
				color: #fff;
			}
			.el-submenu__title{
				color: #fff;
			}
			.el-menu-item:focus, 
			.el-menu-item:hover {
			    outline: 0;
			    background-color: #192133;
				color:#409EFF;
			}
			.el-submenu__title:focus, 
			.el-submenu__title:hover {
			    outline: 0;
			    background-color: #192133;
				color:#409EFF;
			}
		}
	}


	.tac.el-row,
	.el-col,
	.el-menu {
		// height: 100%;
	}

	.el-main {
		padding: 0rem;
	}

	.el-header {
		background-color: #fff;
		padding: 0rem;

		i {
			font-size: 0.20rem;
			margin-left: 0.10rem
		}
	}

	.el-footer {
		line-height: 0.44rem;
		background-color: #fff;
		text-align: center
	}

	h1 {
		height: 100%;
		line-height: 88px;
		width: 1.34rem;
		background: url("../assets/img/logo.png") @bgcolor no-repeat 0.24rem center;
		font-size: 0.26rem;
		color: @hcolor;
		padding-left: 0.86rem;
	}

	.topMenu {
		float: left;
		height: 100%;
		padding-left: 20px;

		/deep/ .el-menu {
			height: 100%;
			border: none;
		}

		/deep/ .el-menu--horizontal>.el-menu-item {
			height: 100%;
			/*line-height: 0.88rem;*/
			margin: 29px 0;
			height: 30px;
			line-height: 30px;
		}

		/deep/ .el-menu--horizontal>.el-menu-item.is-active {
			color: #fff;
			background: #409EFF;
			border-radius: 0.05rem;
			font-weight: bold;
			border-bottom: none;
		}
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

	//
</style>
<script>
	import axios from 'axios'
	import NavMenu from "../components/common/navMenu.vue"
	export default {
		data() {
			return {
				mainMenuList: [],
				userName: '15651965271',
				userId: "",
				menu: [],
				userTypeId: '',
				loading: false,
				dialogVisible: false,
				form: {
					oldPwd: '',
					newPwd: '',
				},
				rules: {
					oldPwd: [{
						required: true,
						message: '请输入旧密码',
						trigger: 'blur'
					}],
					newPwd: [{
							required: true,
							message: '请输入新密码',
							trigger: 'blur'
						},
						{
							min: 6,
							max: 16,
							message: '长度在 6 到 16 个字符',
							trigger: 'blur'
						}
					],
				},
				activeIndex: '1',
				navMenus: [],
				menuList2: [],
				menuList3: [],
				menuList4: [],
				menuList5: [],
				menuList6: [],
				menuList7: [],
			}
		},
		components: {
			NavMenu
		},
		methods: {
			handleSelect(key, keyPath) {
				console.log(key, keyPath);
				this.activeIndex = key;
				sessionStorage.setItem('key',key);
				/*点击的时候调取菜单接口，动态获取左侧菜单*/
				this.axios.get('/perTaxToolTwo/api/user/getSecondMenu.do?menuId=' + ("secondMenu" + this.userId + key))
					.then(res => {
						if (res.data.code == 200) {
							this.navMenus = res.data.data;
							sessionStorage.setItem('navMenus',JSON.stringify(this.navMenus));
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


				// switch (key) {
				// 	case "2":
				// 		this.navMenus = this.menuList2;
				// 		break;
				// 	case "3":
				// 		this.navMenus = this.menuList3;
				// 		break;
				// 	case "4":
				// 		this.navMenus = this.menuList4;
				// 		break;
				// 	case "5":
				// 		this.navMenus = this.menuList5;
				// 		break;
				// 	case "6":
				// 		this.navMenus = this.menuList6;
				// 		break;
				// 	case "7":
				// 		this.navMenus = this.menuList7;
				// 		break;
				// 	default:
				// 		break;
				// }
			},
			handleOpen(key, keyPath) {
				console.log(key, keyPath);
			},
			handleClose(key, keyPath) {
				console.log(key, keyPath);
			},
			queryUser() {
				this.loading = true;
				this.axios.get('/perTaxToolTwo/api/user/getLoginUserInfo.do')
					.then(res => {
						if (res.data.code == 200) {
							this.userName = res.data.user.phone;
							this.userId = res.data.user.operatorId;
							this.userTypeId = res.data.user.userTypeId;
							if(!sessionStorage.getItem('userId') || sessionStorage.getItem('userId') != this.userId){
								sessionStorage.setItem('userId', this.userId);
								sessionStorage.setItem('updateUser', JSON.stringify(res.data.user));
								this.$store.commit('updateUser', res.data.user);
								this.axios.get('/perTaxToolTwo/api/user/getCustList.do?userId=' + this.userId)
									.then(res => {
										if (res.data.code == 200) {
											sessionStorage.setItem('updateCust', JSON.stringify(res.data.data));
											this.$store.commit('updateCust', res.data.data);
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
								this.axios.get('/perTaxToolTwo/api/user/getMenu.do?userId=' + this.userId)
									.then(res => {
										if (res.data.code == 200) {
											this.mainMenuList = res.data.data;
											sessionStorage.setItem('mainMenuList',JSON.stringify(this.mainMenuList));
											this.handleSelect(this.mainMenuList[0].productId);
											
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
							}else if(sessionStorage.getItem('userId') == this.userId){
								this.mainMenuList = JSON.parse(sessionStorage.getItem('mainMenuList'));
								this.$store.commit('updateCust', JSON.parse(sessionStorage.getItem('updateCust')));
								this.$store.commit('updateUser', JSON.parse(sessionStorage.getItem('updateUser')));
								this.handleSelect(sessionStorage.getItem('key'));
							}
							
							
							
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
			handleCommand(command) {
				if (command == 'logout') {
					this.axios.post('/perTaxToolTwo/api/user/logout.do')
						.then(res => {
							// if (res.data == 1) {
							// 	
							this.clearCookie(res.data);
							// window.location = res.data;
							// console.log(document.cookie);
							// document.cookie = "JSESSIONID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
							// console.log(document.cookie);
							// window.location.reload()
							// }
						}).catch(function(err) {
							// this.$message({
							// 	message: '获取客户信息失败',
							// 	type: 'error'
							// });
						})
				} else if (command == 'modifyPsw') {
					this.dialogVisible = true;
				}
			},
			clearCookie(data) {
				var date = new Date();
				date.setTime(date.getTime() - 10000);
				var keys = document.cookie.match(/[^ =;]+(?=\=)/g);
				if (keys) {
					for (var i = keys.length; i--;)
						document.cookie = keys[i] + "=0; expire=" + date.toGMTString() + "; path=/";
				};
				window.location = data;
			},
			//删除cookie
			delCookie(name) {
				var exp = new Date();
				exp.setTime(exp.getTime() - 1);
				var cval = common.getCookie(name);
				if (cval != null)
					document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
			},
			modifyPsw() {
				let params = {
					userName: this.userName,
					oldPwd: this.form.oldPwd,
					newPwd: this.form.newPwd,
				};
				this.axios.post('/perTaxToolTwo/api/user/updatePwd.do', params)
					.then(res => {
						if (res.data.code == 200) {
							this.dialogVisible = false;
							this.reset();
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
					}).catch(function(err) {
						this.$message({
							message: "系统繁忙，请稍后重试",
							type: "error"
						});
					})
			},
			reset() {
				this.form.oldPwd = "";
				this.form.newPwd = "";
			},
			cancelPsw() {
				this.form.oldPwd = "";
				this.form.newPwd = "";
				this.dialogVisible = false;
			}
		},
		beforeCreate() {

		},
		created() {
			this.queryUser();
			// this.getMenu()
		},
		mounted() {
			this.loading = false;
		}
	}
</script>
