<template>
	<div class="listModule">
		<div class="cardBox">
			<div class="eachCard">
				<!-- :class="{ 'class-a': isA, 'class-b': isB}" -->
				<div class="topContent color1" >
					<div class="line1">
						<p class="bigTitle">税金：800000元</p>
						<p class="smallTitle">详情</p>
						<p class="smallTitle">删除</p>
					</div>
					<div class="line2">
						<p>防伪税控专票</p>
						<p style="margin-left:15px;">广告服务</p>
					</div>
				</div>
				<div class="dataContent">
					<div class="lineData" v-for="n in 5">
						<p>票面金额</p>
						<p>50000.09元</p>
					</div>
				</div>
				<div class="footer">
					<img src="" alt="">
				</div>
			</div>
			<div class="eachCard">
				<img src="../../assets/img/list-add.png" alt="">
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		name: 'listModule',
		data() {
			return {
				form: {
					region: '',
				}
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
.listModule{
	width: 1180px;
	
}
.cardBox{
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	justify-content: flex-start;
}
.eachCard{
	width: 24.25%;
	height: 253px;
	border-radius: 5px;
	margin-top:20px;
	background: #fff;
	margin-right: 1%;
}
.eachCard:nth-child(4n){
	margin-right:0;
}
.topContent{
	height: 80px;
}
.color1{
	background: #43b3db;
}
.color2{
	background: #7dc36d;
}
.color3{
	background: #ffac69;
}
.color4{
	background: #ed878e;
}
.color5{
	background: #e6a08a;
}
.color6{
	background: #d19ae9;
}
.line1{
	display: flex;
	align-items: flex-end;
	justify-content: space-between;
	padding:15px 20px;
}
.line1 p{
	color: #fff;
	
}
.bigTitle{
	font-size:18px;
	flex:0.8;
}
.smallTitle{
font-size: 12px;
cursor: pointer;
}
.line2{
	display: flex;
	padding:0px 20px;
	/* align-items: flex-end; */
	/* justify-content: space-between;
	 */
}
.line2 p{
	font-size: 14px;
	color: #fff;
}
.dataContent{
	padding: 15px 20px;
}
.lineData{
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding:5px 0;
	color: #666;
	font-size: 12px;
}
</style>
