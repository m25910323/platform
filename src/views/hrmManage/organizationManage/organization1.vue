<template>
	<div class='main_contain'>
		
	</div>

</template>

<script>
	export default {
		name: "customer",
		data() {
			return {
				total:13
			}
		},
		components: {},
		methods: {
			
		},
		created() {
			this.queryListByPage();
			this.queryEmploy();
		},
		watch: {
			screenWidth(val) {
				for(let i = 0;i < this.$refs.li_level1.length/5;i++){
					if(i < this.$refs.li_level1.length/5 - 1){
						var left = this.$refs.li_level1[i * 5].getBoundingClientRect().left;
						var right = this.$refs.li_level1[i * 5 + 4].getBoundingClientRect().left;
						this.$refs.line[i].style.width = right - left + 2 + 'px'
					}else{
						var left = this.$refs.li_level1[i * 5].getBoundingClientRect().left;
						var right = this.$refs.li_level1[i * 5 - 1  + this.$refs.li_level1.length%5].getBoundingClientRect().left;
						this.$refs.line[i].style.width = right - left + 2 + 'px'
					}
					
				}
				
				// alert(left);
				// alert(right);
				
			}
		},
		updated(){
			for(let i = 0;i < this.$refs.li_level1.length/5;i++){
				if(i < this.$refs.li_level1.length/5 - 1){
					var left = this.$refs.li_level1[i * 5].getBoundingClientRect().left;
					var right = this.$refs.li_level1[i * 5 + 4].getBoundingClientRect().left;
					this.$refs.line[i].style.width = right - left + 2 + 'px'
				}else{
					var left = this.$refs.li_level1[i * 5].getBoundingClientRect().left;
					var right = this.$refs.li_level1[i * 5 - 1 + this.$refs.li_level1.length%5].getBoundingClientRect().left;
					this.$refs.line[i].style.width = right - left + 2 + 'px'
				}
				
			}
		},
		mounted() {
			const that = this;
			this.$nextTick(function() {
				that.resize();
				window.onresize = () => {
					return (() => {
						window.screenWidth = document.body.clientWidth
						that.screenWidth = window.screenWidth
					})()
				}
				/////方法

			})



		}
	}
</script>

<style scoped lang="less">
	.main_contain {
		/* width: 100%; */
		height: calc(100% - 80px);
		padding-top: 40px;
		margin: 20px;
		background-color: #fff;
		position: relative;

		/deep/ .el-popover {
			min-width: 10px;
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

	.body_contain {
		width: 100%;
		height: calc(100% - 20px);
		background-color: #fff;
		position: absolute;
		top: 0px;
		left: 0px;
		box-sizing: border-box;
		padding-top: 20px;
	}

	ul.level1 {
		width: 100%;
		display: flex;
		flex-direction: row;
		justify-content: space-around;

		li {
			/* padding: 0 10px; */
			position: relative;
			box-shadow: 4px 4px 10px #ccc;

			div.level1 {
				height: 60px;
			}

			div.level11 {
				height: 60px;
				line-height: 60px;
				// text-align: center
			}

			div.level12 {
				.f {
					height: 30px;
					line-height: 40px;
					// text-align: center
					padding-left: 40px;
				}

				.s {
					height: 30px;
					line-height: 25px;
					padding-left: 40px;
				}

			}
		}
	}

	ul.level2 {
		top: 110px;
		position: absolute;
		width: 300px;
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		justify-content: space-between;
		// align-items: center;
		left: calc(-50% - 30px);

		li {
			width: 120px;
			margin-bottom: 20px;
		}

		li.line {
			width: 60px;
			height: 2px;
			background-color: #E6A23C;
			position: relative;
			margin: auto
		}

		li.level3 {
			// top: 20px
		}

		li.baseLine {
			height: calc(100% - 30px);
			width: 2px;
			background-color: #E6A23C;
			position: absolute;
			left: 50%;
			top: -20px;
		}
	}

	p {
		background-color: #7DC36D;
		height: 30px;
		line-height: 30px;
		color: #fff;
		// padding: 0 10px;
		text-align: center
	}

	i {
		position: absolute;
		width: 2px;
		height: 20px;
		background-color: #E6A23C;
		top: -20px;
		left: calc(50% - 1px);
	}

	i.first {
		position: absolute;
		width: 2px;
		height: 20px;
		background-color: #E6A23C;
		top: 100%;
		left: calc(50% - 1px);
	}

	div.line {
		// width: 12.47rem;
		width: 2px;
		height: 2px;
		background-color: #E6A23C;
		position: relative;
		top: 20px;
		margin: auto
	}

	div.lineline {
		position: absolute;
		width: 60px;
		height: 2px;
		background-color: #E6A23C;
		left: 100%;
		top: 50%;
	}

	.el-dialog .el-form {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		flex-wrap: wrap
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
