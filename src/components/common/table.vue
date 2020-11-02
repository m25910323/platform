<template> 
	<div class="tableContent">
		<el-table :data="data" style="width: 100%" stripe border>
	      <el-table-column v-for="(col, index) in rowHeader" :key="index" :prop="col.prop" :label="col.label">
	          <template slot-scope="scope">
	              <ex-slot v-if="col.render" :render="col.render" :row="scope.row" :index="scope.$index" :column="col"></ex-slot>
	              <span v-else>
	                  {{scope.row[col.prop]}}
	              </span>
	          </template>
	        </el-table-column>
	    </el-table>
	</div>
   
</template> 

<script>
// 自定义内容的组件
var exSlot = {
functional: true,
props: {
    row: Object,
    render: Function,
    index: Number,
    column: {
        type: Object,
        default: null
    }
},

render: (h, data) => {
    const params = {
        row: data.props.row,
        index: data.props.index
    }

    if (data.props.column) params.column = data.props.column
      return data.props.render(h, params)
  }
}

export default {
components: {
    'ex-slot': exSlot
},
props: {
    // 表格数据
    data: {
        type: Array,
        default: () => {
            return []
        }
    },
    // 表头数据
    rowHeader: {
        type: Array,
        default: () => {
            return []
        }
    }
  }
}
</script>
<style scoped>
	.tableContent{
		/deep/ .el-table__header tr,
		.el-table__header th {
			padding: 0;
			height: 40px;
			background-color: #ebf6fb;
		}
		/deep/ .el-table th {
			background-color: #ebf6fb;
		}
		/deep/ .el-table--striped .el-table__body tr.el-table__row--striped td {
			background: #ebf6fb;
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
	}
</style>