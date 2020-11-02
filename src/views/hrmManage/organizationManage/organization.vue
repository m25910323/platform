<template>
	<div class="impor" style="height:100%">
		<div class="container">
			
					<vue2-org-tree name="test" :data="data" :horizontal="horizontal" :collapsable="collapsable" :label-class-name="labelClassName"
					 :render-content="renderContent" @on-expand="onExpand" @on-node-click="onNodeClick" :props='props' />
				
		</div>
		<el-dialog title="新增部门" :visible.sync="dialogVisible1" width="4rem" :before-close="handleClose1">
			<el-form ref="form" :model="form1" label-width="100px" size="mini">
		
				<el-form-item label="部门名称">
					<el-input v-model="form1.orgName"></el-input>
				</el-form-item>
				<el-form-item label="部门领导">
					<el-select v-model='form1.orgLeaderId' clearable size="mini">
						<el-option v-for='item in empInfo' :label="item.userName" :value="item.userId" :key='item.userId'></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog1" size="mini">取 消</el-button>
				<el-button type="primary" @click="commitAdd" size="mini">确 定</el-button>
			</span>
			<!-- <div class='btn_contain clearfix'>
				<span class='commit' @click="commitAdd">确认</span>
				<span class='close' @click="hideDialog1">关闭</span>
		
			</div> -->
		
		</el-dialog>
		
		<el-dialog title="修改部门" :visible.sync="dialogVisible2" width="4rem" :before-close="handleClose2">
			<el-form ref="form" :model="form2" label-width="100px" size="mini">
		
				<el-form-item label="部门名称">
					<el-input v-model="form2.departmentName"></el-input>
				</el-form-item>
				<el-form-item label="部门领导">
					<el-select v-model='form2.orgLeaderId' clearable size="mini">
						<el-option v-for='item in empInfo' :label="item.userName" :value="item.userId" :key='item.userId'></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<!-- <span slot="footer" class="dialog-footer">
				<el-button @click="hideDialog2" size="mini">取 消</el-button>
				<el-button type="primary" @click="commitAdd2" size="mini">确 定</el-button>
			</span> -->
			<div class='btn_contain clearfix'>
				<span class='commit' @click="commitAdd2">确认</span>
				<span class='close' @click="hideDialog2">关闭</span>
		
			</div>
		
		</el-dialog>
		
	</div>
</template>
<script>
	export default {
  data() {
    return {
		props:{label: 'departmentName', children: 'listHrOrgStructure', expand: 'expand'},
		data:{},
      horizontal: false,
      collapsable: true,
      expandAll: true,
      labelClassName: "bg-white",
	  form1:{},
	  form2:{},
	  dialogVisible1:false,
	  dialogVisible2:false,
	  empInfo:[],
	  parentOrgId:''
    };
  },
  created() {
	this.queryEmploy()
  	this.queryListByPage();
  },
  methods: {
	  handleClose1() {
	  	this.dialogVisible1 = false;
	  	this.form1 = {};
	  },
	  hideDialog1() {
	  	this.dialogVisible1 = false;
	  	this.form1 = {};
	  },
	  handleClose2() {
	  	this.dialogVisible2 = false;
	  	this.form2 = {};
	  },
	  hideDialog2() {
	  	this.dialogVisible2 = false;
	  	this.form2 = {};
	  },
	  reset() {
	  	this.form1 = {};
	  	this.form2 = {};
	  },
	  commitAdd() {
		this.form1.parentOrgId = this.parentOrgId
	  	let param = this.form1;
	  	this.axios.post('/perTaxToolTwo/hr/org/saveOrg', param).then(res => {
	  		// this.axios.post('/sl/perTaxToolTwo/hr/org/saveOrg', param).then(res => {
	  		if (res.data.code == 200) {
	  			this.queryListByPage();
	  			this.dialogVisible1 = false;
	  			this.reset();
	  			this.$message({
	  				message: res.data.msg,
	  				type: 'success'
	  			});
	  		} else {
	  			this.$message({
	  				message: res.data.msg,
	  				type: 'error'
	  			});
	  		}
	  
	  	}).catch(function(err) {
	  		this.$message({
	  			message: '新增失败',
	  			type: 'error'
	  		});
	  	})
	  },
	  commitAdd2() {
		this.form2.orgName = this.form2.departmentName;
		this.form2.orgId = this.form2.departmentId;
		let param = this.form2;
		// this.axios.post('/sl/perTaxToolTwo/hr/org/saveOrg', param).then(res => {
		this.axios.post('/perTaxToolTwo/hr/org/saveOrg', param).then(res => {
			if (res.data.code == 200) {
				this.queryListByPage();
				this.dialogVisible2 = false;
				this.reset();
				this.$message({
					message: res.data.msg,
					type: 'success'
				});
			} else {
				this.$message({
					message: res.data.msg,
					type: 'error'
				});
			}
		
		}).catch(function(err) {
			this.$message({
				message: '修改失败',
				type: 'error'
			});
		})
	  },
	  queryListByPage() {
	  	var _this = this;
	  	
	  	this.result = [];
	  	this.resultDetail = [];
	  
	  
	  	let param = {
	  
	  		"parentOrgId": "0"
	  	};
	  	// this.axios.post('/sl/perTaxToolTwo/org/getOrgDate', param).then(res => {
	  	this.axios.post('/perTaxToolTwo/org/getOrgDate', param).then(res => {
	  		if (res.data.code == 200) {
	  			this.data = res.data.data;
	  			this.$nextTick(function() {
	  				this.expandChange()
	  				
	  			
	  			})
	  
	  		} else {
	  			this.$message({
	  				message: res.data.msg,
	  				type: 'error'
	  			});
	  		}
	  
	  	}).catch(function(err) {
	  		this.$message({
	  			message: '获取银行列表失败',
	  			type: 'error'
	  		});
	  	})
	  },
	  queryEmploy() {
	  	let params = {
	  		"type": 1
	  	}
	  	this.axios.post('/perTaxToolTwo/hrEmpInfo/findHrEmpInfo', params).then(res => {
	  		if (res.data.code == 200) {
	  
	  			this.empInfo = res.data.data;
	  		} else {
	  			this.$message({
	  				message: res.data.msg,
	  				type: 'error'
	  			});
	  		}
	  
	  	}).catch(function(err) {
	  		this.loading = false;
	  		this.$message({
	  			message: '获取角色列表失败',
	  			type: 'error'
	  		});
	  	})
	  },
	  treeAddShowDialog(data,tag){
		  if(tag == 'add'){
			  this.parentOrgId = data.departmentId;
			  this.dialogVisible1 = true;
			  
		  }else{
			  this.dialogVisible2 = true;
			  this.form2 = JSON.parse(JSON.stringify(data))
		  }
	  },
	  treeDelete(data){
		  this.$confirm('确认删除?', '提示', {
		  	confirmButtonText: '确定',
		  	cancelButtonText: '取消',
		  	type: 'warning'
		  }).then(() => {
		  	let param = {
		  		orgId: data.departmentId
		  	};
		  	this.axios.post('/perTaxToolTwo/hr/org/delOrg', param).then(res => {
		  		if (res.data.code == 200) {
		  			this.queryListByPage();
		  			this.$message({
		  				message: res.data.msg,
		  				type: 'success'
		  			});
		  		} else {
		  			this.$message({
		  				message: res.data.msg,
		  				type: 'error'
		  			});
		  		}
		  
		  	}).catch(function(err) {
		  		this.$message({
		  			message: '删除失败',
		  			type: 'error'
		  		});
		  	})
		  }).catch(() => {
		  	this.$message({
		  		type: 'info',
		  		message: '已取消删除'
		  	});
		  });
	  },
    renderContent(h, data) {
      // <el-dropdown class="MenueTreeDrop" trigger="click" size='mini' style='position:absolute;right:4px'>
      //     <span class="el-dropdown-link">
      //         <i class="el-icon-arrow-down"></i>
      //     </span>
      //     <el-dropdown-menu slot="dropdown">
      //         <el-dropdown-item nativeOnClick={ () => this.treeAddShowDialog(data,'add')}>新增部门</el-dropdown-item>
      //         <el-dropdown-item nativeOnClick={ () => this.treeAddShowDialog(data,'edite')}>修改部门</el-dropdown-item>
      //         <el-dropdown-item nativeOnClick={ () => this.treeDelete(data)}>删除部门</el-dropdown-item>
      //     </el-dropdown-menu>
      // </el-dropdown>
	  return ( <div class="custom-tree-node">
                <h1 class="iconfont icon-wenjianjia">{data.orgLeader?data.orgLeader:data.name}
				
				</h1>
                <h1 class="tree-node-name" v-show={data.orgName?true:false} ><span style='vertical-align:middle'>{data.orgName}<span v-show={data.orgName?true:false}></span>{data.position}</span></h1>
                
            </div>)
    },
    onExpand(e,data) {
      if ("expand" in data) {
        data.expand = !data.expand;
        if (!data.expand && data.children) {
          this.collapse(data.children);
        }
      } else {
        this.$set(data, "expand", true);
      }
    },
    onNodeClick(e, data) {
      // alert(data.name);
    },
    collapse(list) {
      var _this = this;
      list.forEach(function(child) {
        if (child.expand) {
          child.expand = false;
        }
        child.children && _this.collapse(child.children);
      });
    },
    expandChange() {
      this.toggleExpand(this.data, this.expandAll);
    },
    toggleExpand(data, val) {
      var _this = this;
      if (Array.isArray(data)) {
        data.forEach(function(item) {
          _this.$set(item, "expand", val);
          if (item.children) {
            _this.toggleExpand(item.children, val);
          }
        });
      } else {
        this.$set(data, "expand", val);
        if (data.children) {
          _this.toggleExpand(data.children, val);
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>
	.container{
		width: 100%;
		height: 100%;
		overflow: scroll;
		/deep/ ::-webkit-scrollbar {
			width: 0.5rem;
			height: 0.5rem;
		}
		
		/deep/ ::-webkit-scrollbar-thumb {
			// border-radius: 0.10rem;
			-webkit-box-shadow: inset 0 0 0.05rem rgba(0, 0, 0, 0.2);
			background: rgba(0, 0, 0, 0.2);
		}
		
		/deep/ ::-webkit-scrollbar-track {
			-webkit-box-shadow: inset 0 0 0.05rem rgba(0, 0, 0, 0.2);
			border-radius: 0;
			background: rgba(0, 0, 0, 0.1);
		}
	}
	/deep/ .org-tree-container{
		padding: 15px;
		margin: 15px;
	}
	/deep/ .org-tree-node-label {
		white-space: nowrap;
	}

	/deep/ .bg-white {
		background-color: white;
		position: relative;
	}
	
	/deep/ .org-tree-node:not(:first-child):before, 
	/deep/ .org-tree-node:not(:last-child):after {
	    border-top: 1px solid #409EFF;
	}
	
	/deep/ .org-tree-node:not(:first-child):before, 
	/deep/ .org-tree-node:not(:last-child):after {
	    border-top: 1px solid #409EFF;
	}
	/deep/ .org-tree-node:after {
	    left: 50%;
	    border-left: 1px solid #409EFF;
	}
	
	/deep/ .org-tree>.org-tree-node:after {
	    border-left: 0;
	}
	
	/deep/.org-tree-node-label{
		.org-tree-node-label-inner{
			padding: 10px 25px;
		}
	}
	
	/deep/ .el-dialog .el-form {
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
	/deep/ .tree-node-name{
		height: 30px;
		line-height: 30px;
	}
	
	
</style>
