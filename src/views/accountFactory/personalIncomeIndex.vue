<template>
    <div class="personalIncomeIndex">
        <div class="step1" style="cursor:pointer" @click="jumpPage('1')">
            <div class="line1">
                <img src="../assets/img/icon-1.png" alt="">
                <p>步骤1</p>
                <img src="../assets/img/line.png" alt="">
            </div>
            <p class="title">导入初始工资表</p>
            <p class="content">
                进入初始导入中，可以先下载初始工资表模板，编辑初始数据后上传。
            </p>
        </div>
        <div class="step2" style="cursor:pointer" @click="jumpPage('2')">
            <div class="line1">
                <img src="../assets/img/icon-2.png" alt="">
                <p>步骤2</p>
                <img src="../assets/img/line.png" alt="">
            </div>
            <p class="title">计算薪酬</p>
        </div>
        <div class="step3" style="cursor:pointer" @click="jumpPage('3')">
            <div class="line1">
                <img src="../assets/img/icon-3.png" alt="">
                <p>步骤3</p>
            </div>
            <p class="title">个税报表查看</p>
        </div>
    </div>
</template>
<script>
export default {
    methods:{
        jumpPage(type){
            if(type=='1'){
                this.$router.push({
					path: '/index/initialSheet',
				});
            }else if(type=='2'){
                this.$router.push({
					path: '/index/incomeTaxCalculate',
				});
            }else if(type=='3'){
                this.$router.push({
					path: '/index/reportForms',
				});
            }
        }
    }
};
</script>

<style lang="less" scoped>
.personalIncomeIndex {
  margin: 20px;
  background: #fff;
  display: flex;
  justify-content: center;
  padding-top: 60px;
  height: calc(100% - 100px);
}
.line1 {
  display: flex;
  align-items: center;
  margin-right: 30px;
}
.line1 p {
  font-size: 18px;
  color: #313131;
  margin: 0 30px 0 10px;
}
.title {
  color: #4c4c4c;
  font-size: 14px;
  margin-left: 60px;
}
.content {
  font-size: 14px;
  color: #808080;
  line-height: 30px;
  width: 150px;
  margin: 0 auto;
  margin-top: 35px;
}
.step3 .line1 {
  margin-right: 0;
}
</style>

