<template>
	<div class='search_contain'>
		<div class="row1">
			<span class="labelTitle">
					客户名称：
				</span>
			<el-select v-model="value" placeholder="请选择">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</div>
		<div class="row2">
			<span class="labelTitle">
					账期：
				</span>
			<el-date-picker v-model="value2" type="month" placeholder="选择月">
			</el-date-picker>
		</div>
		<div class="row3">
			<span class="labelTitle">
					发票类型：
				</span>
			<el-select v-model="value" placeholder="请选择">
				<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</div>
		<div class="searchButton">查询</div>
		<div class="importButton">发票导入</div>
		<div class="deleteButton">批量删除</div>
	</div>
</template>

<script>
	export default {
		name: 'searchModule',
		data() {
			return {
				form: {
					region: '',
				},
				options: [{
					value: '选项1',
					label: '黄金糕'
				}, {
					value: '选项2',
					label: '双皮奶'
				}, {
					value: '选项3',
					label: '蚵仔煎'
				}, {
					value: '选项4',
					label: '龙须面'
				}, {
					value: '选项5',
					label: '北京烤鸭'
				}],
				value: '',
				value2:''
			}
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			}
		}
	}
</script>

<style scoped>
	div.search_contain {
		width: 1180px;
		height: 78px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-top-left-radius: 5px;
		border-top-right-radius: 5px;
		background: #fff;
	}
	.labelTitle {
		color: #999;
		font-size: 14px;
	}
	.importButton {
		background: #43b3db;
		color: #fff;
		border-radius: 5px;
		cursor: pointer;
		padding: 7px 35px
	}
	.searchButton {
		background: #ffb980;
		color: #fff;
		border-radius: 5px;
		cursor: pointer;
		padding: 7px 35px
	}
	.deleteButton {
		background: #ed878e;
		color: #fff;
		border-radius: 5px;
		cursor: pointer;
		padding: 7px 35px
	}
</style>
