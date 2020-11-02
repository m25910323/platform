<template>
  <div class='search_contain'>
    <div class="row1">
      <span class="labelTitle">
      					客户名称：
      				</span>
      <el-select v-model="searchList.value" placeholder="请选择">
        <el-option v-for="item in $store.state.cust" :key="item.customerId" :label="item.customerName" :value="item.customerId">
				</el-option>
      </el-select>
    </div>
    <div class="row2" style="margin-left:0.2rem">
      <span class="labelTitle">
      					账期：
      				</span>
      <el-date-picker v-model="searchList.nowDate" type="month" placeholder="选择月">
      </el-date-picker>
    </div>
    <!-- <div class="row3" style="margin-left:0.2rem">
      <span class="labelTitle">
      					发票类型：
      				</span>
      <el-select v-model="searchList.value" placeholder="请选择">
        <el-option v-for="item in searchList.options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
    </div> -->
    <div class="searchButton" @click="search()">查询</div>
    <!-- <div class="importButton">发票导入</div> -->
    <!-- <div class="deleteButton">批量删除</div> -->
  </div>
</template>

<script>
  import axios from "axios";
  export default {
    name: "searchModule",
    data() {
      return {
        searchList: {
          options: [{
              value: "选项1",
              label: "黄金糕"
            },
            {
              value: "选项2",
              label: "双皮奶"
            }
          ],
          value: "",
          nowDate: ""
        },
        customerId:'',
        accountPeriod:'',
      };
    },
    created() {
      this.searchList.options = this.$store.state.cust;
			console.log('this.searchList.options', this.searchList.options)
			this.getNowMonth();
    },
    methods: {
      getNowMonth() {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        month = month < 10 ? "0" + month : month;
        this.searchList.nowDate = year.toString() + "-" + month.toString();
        this.accountPeriod = year.toString() + "-" + month.toString();
      },
      search() {
        this.accountPeriod = this.searchList.nowDate;
				this.customerId = this.searchList.value;
				this.statusVaule = this.searchList.statusVaule;
        let params = {
          accountPeriod:this.accountPeriod, //账期
          customerId: this.customerId, //客户Id
          stepName: "发票录入" //步骤名称
        };
        // let params = {
        //   accountPeriod:'2019-05', //账期
        //   customerId: 'jz3779', //客户Id
        //   stepName: "发票录入" //步骤名称
        // };
        let taxation_id, tax_info_id;
        axios
          .post("/perTaxToolTwo/e9zCalculate/getTaxInfo", params)
          .then(res => {
            console.log("获取收账信息Id和税款信息id", res);
            if (res.data.code == 200) {
              // 在这里获取收账税款id
              taxation_id = res.data.data.taxation_id;
              tax_info_id = res.data.data.tax_info_id;
              // taxation_id = '1';
              // tax_info_id = '1';
              // 真正接口需要传参：收账税款id
              // this.$emit("getInvoiceLeaveShowList", taxation_id, tax_info_id,this.searchList);
              this.$emit("getInvoiceLeaveShowList", {
                taxationId: taxation_id,
                taxInfoId: tax_info_id,
                searchList: this.searchList
              })
              this.$emit("getShowSumIncome", taxation_id);
              this.$emit("getShowSumDeduct", taxation_id);
              this.$emit("getShowSumTaxPayable", taxation_id);
            }
          }).catch((err) => {
            this.$message({
              message: '获取收账信息Id和税款信息id数据失败',
              type: 'error'
            });
          });


        
      }
    }
  };
</script>
<style>
.search_contain .el-date-editor.el-input, .el-date-editor.el-input__inner{
      width: 1.6rem;
      min-width: 115px;
}
</style>

<style scoped>
  div.search_contain {
    /* width: 1180rem; */
    /* height: 78rem; */
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    /* justify-content: space-between; */
    border-top-left-radius: 0.05rem;
    border-top-right-radius: 0.05rem;
    background: #fff;
    padding: 0.20rem 0.20rem;
  }
  .labelTitle {
    color: #999;
    font-size: 0.14rem;
  }
  .importButton {
    background: #43b3db;
    color: #fff;
    border-radius: 0.05rem;
    cursor: pointer;
    padding: 0.07rem 0.35rem;
  }
  .searchButton {
    background: #ffb980;
    color: #fff;
    border-radius: 0.05rem;
    cursor: pointer;
    padding: 0.07rem 0.35rem;
    margin-left:0.2rem
  }
  .deleteButton {
    background: #ed878e;
    color: #fff;
    border-radius: 0.05rem;
    cursor: pointer;
    padding: 0.07rem 0.35rem;
  }
</style>
