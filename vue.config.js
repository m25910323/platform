const CompressionPlugin = require("compression-webpack-plugin");
module.exports = {
	productionSourceMap: true,
	configureWebpack: (config) => {
		if (process.env.NODE_ENV === 'production') {
			// 为生产环境修改配置...
			config.mode = 'production';
			// 将每个依赖包打包成单独的js文件
				config.plugins = [
					...config.plugins,
					new CompressionPlugin({
						test: /\.js$|\.html$|.\css/, //匹配文件名
						threshold: 10240, //对超过10k的数据压缩
						deleteOriginalAssets: false //不删除源文件
					})
				]
		} else {
			// 为开发环境修改配置...
			config.mode = 'development';
		}
	},
	devServer: {
		proxy: {
			'/perTaxToolTwo': {
				// target: 'http://192.168.1.172:8086', //李东东
				target: 'http://192.168.1.159:8086', //韦秀坤
				
				// target: 'http://192.168.1.137:8086', //朱旭
				// target: 'http://192.168.1.71:8086', //向
				// target: 'http://192.168.1.168:8086', //张
				// target: 'http://192.168.1.72:8086', //冯
				
				changeOrigin: true,
				ws: true,
				pathRewrite: {
					'^/perTaxToolTwo': '/perTaxToolTwo'
				}
			},
			
		}
	}
}
