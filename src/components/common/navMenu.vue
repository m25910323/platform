<template>
	<div class="navMenu">

		<label v-for="navMenu in navMenus">
			<!-- <el-menu-item v-if="navMenu.childs == null &&navMenu.entity" :key="navMenu.entity.authorityId" -->
			
			<el-menu-item v-if="navMenu.childs.length == 0 &&navMenu.entity" :key="navMenu.entity.authorityId"
			 :data="navMenu" :index="navMenu.entity.authorityId" :route="navMenu.entity.authorityTypeContent" @click='show(navMenu.entity.authorityTypeContent)'>
				<img v-show="navMenu.entity.authorityLevel == 2" :src="navMenu.entity.authorityIcon" style="width: 0.2rem;height: 0.2rem;display: inline-block;margin-right: 4px;"></img>
				<span slot="title" class="item_title">{{navMenu.entity.authorityName}}</span>
			</el-menu-item>
			
			<!-- <el-submenu v-if="navMenu.childs&&navMenu.entity" :key="navMenu.entity.authorityId" :data="navMenu" -->
			
			<el-submenu v-if="navMenu.childs.length > 0&&navMenu.entity" :key="navMenu.entity.authorityId" :data="navMenu"
			
			 :index="navMenu.entity.authorityId">
				<template slot="title">
					<img v-show="navMenu.entity.authorityLevel == 2" :src="navMenu.entity.authorityIcon" style="width: 0.2rem;height: 0.2rem;display: inline-block;margin-right: 4px;">
					<span class="item_title"> {{navMenu.entity.authorityName}}</span>
				</template>
				<NavMenu :navMenus="navMenu.childs"></NavMenu>
			</el-submenu>
		</label>

	</div>
</template>

<script>
	export default {
		name: 'NavMenu',
		props: ['navMenus'],
		data() {
			return {}
		},
		mounted() {
			console.log(this.navMenus)
		},
		methods: {
			show(value){
				console.log(value)
			}
		}
	}
</script>

<style scoped lang="less">
	i{
		width:0.2rem;
		height:0.2rem;
		display:block;
		
	}
</style>
