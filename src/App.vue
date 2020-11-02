<template>
	<div id="app">
		<router-view />
	</div>
</template>

<style lang="less" scoped>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		// text-align: center;
		color: #2c3e50;
		height: 100%;
	}

	//
</style>
<script>
	export default {
		methods: {
			setFontSize(doc, win) {
				var docEl = doc.documentElement
				var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'
				var reCaculate = function() {
					var clientWidth = docEl.clientWidth
					if (!clientWidth) return
					docEl.style.fontSize = 100 * (clientWidth / 1920) + 'px';
					// alert(docEl.style.fontSize)
				}
				
				if (!doc.addEventListener) return
				win.addEventListener(resizeEvt, reCaculate, false)
				doc.addEventListener('DOMContentLoaded', reCaculate, false)
			},
		},
		created() {
			this.setFontSize(document, window)
		}
	}
</script>
