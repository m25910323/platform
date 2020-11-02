<template>
  <div class="invoice_oListModule">
    <div class="cardBox" v-if="invoicePanelList.length>0" v-loading="loadingCard">
      <div class="eachCard" v-for="(item,index) in invoicePanelList" :key="index">
        <!-- :class="{ 'class-a': isA, 'class-b': isB}" -->
        <div class="topContent color1" :class="{ 'color1': item.invoiceId, 'color2': item.tmplId==10, 'color3': item.tmplId==9, 'color4': item.tmplId==7, 'color5': item.tmplId==6, 'color6': item.tmplId==5, 'color7': item.tmplId==4, 'color8': item.tmplId==1}">
          <div class="line1">
            <p v-if="item.tmplId" class="bigTitle">{{item.tmplName}}</p>
            <!-- <p v-if="item.invoiceId" class="bigTitle">税金：80000元</p> -->
            <p class="smallTitle" @click="showDetail(item)">详情</p>
            <!-- <p class="smallTitle">删除</p> -->
          </div>
          <div v-if="!item.tmplId" class="line2">
            <!-- <p v-if="item.tmplId">{{item.tmplName}}</p> -->
            <p>{{item.invoiceCategory}}</p>
            <p style="margin-left:0.15rem;">{{item.invoiceType}}</p>
          </div>
        </div>
        <div class="dataContent">
          <div v-if="child.columnShow==1" class="lineData" v-for="(child,ind) in item.e9zConfigInvoiceColumnList" :key="ind">
            <p>{{child.columnTitle}}</p>
            <p v-if="child.columnTitle=='发票项目类型'&&(child.columnValue=='1'||child.columnValue=='一般')">一般</p>
            <p v-if="child.columnTitle=='发票项目类型'&&(child.columnValue=='2'||child.columnValue=='即征即退')">即征即退</p>
            <p v-if="child.columnTitle=='应税类型'&&(child.columnValue=='1'||child.columnValue=='应税货物')">应税货物</p>
            <p v-if="child.columnTitle=='应税类型'&&(child.columnValue=='2'||child.columnValue=='应税劳务')">应税劳务</p>
            <p v-if="child.columnTitle=='应税类型'&&(child.columnValue=='3'||child.columnValue=='应税服务')">应税服务</p>
            <p v-if="child.columnTitle!='发票项目类型'&&child.columnTitle!='应税类型'" @dblclick="editPanel(item,child)">{{child.columnValue?fomatFloat(child.columnValue,2):fomatFloat(child.defaultValue,2)}}</p>
          </div>
        </div>
        <div class="footerContent" @click="showDetail(item)">
          <img src="../../assets/img/btn-detail.png" alt="">
        </div>
      </div>
      <div class="eachCard addBtn" @click="addDialog()">
        <img src="../../assets/img/list-add.png" style="width:100%;height:100%" alt="">
      </div>
    </div>
    <div v-if="invoicePanelList.length==0" class="noData">暂无数据</div>
    <!-- 新增弹窗 -->
    <el-dialog class="smallDialog" :close-on-click-modal="false" :visible.sync="addDialogVisible">
      <el-form ref="form" :rules="rules" :model="form" label-width="1.1rem">
        <el-form-item label="票面张数：" prop="name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="票面金额：" prop="amount">
          <el-input v-model="form.amount"></el-input>
        </el-form-item>
        <el-form-item label="计税方法：" prop="taxCalcMethod">
          <el-select v-model="form.taxCalcMethod" placeholder="请选择" @change="changeTaxMethod">
            <el-option v-for="item in taxCalcMethodOptions" :key="item.dicValue" :label="item.dicName" :value="item.dicValue">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票类型：" prop="invoiceType">
          <el-select v-model="form.invoiceType" placeholder="请选择" @change="changeInvoiceType">
            <el-option v-for="item in invoiceTypeOptions" :key="item.typeString" :label="item.typeString" :value="item.typeString">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票名称：" prop="invoiceName">
          <el-select v-model="form.invoiceName" placeholder="请选择">
            <el-option v-for="item in invoiceNameOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="nextStep" @click="nextStep('form')">下一步</div>
      <div class="cancel" @click="addDialogVisible = false">取消</div>
    </el-dialog>
    <!-- 下一步弹窗 -->
    <el-dialog class="smallNextDialog" :close-on-click-modal="false" :visible.sync="nextStepDialogVisible">
      <div class="dialogTitle">
        <p class="dialogSmallTitle">{{form.invoiceType}}</p>
        <p class="dialogSmallTitle" style="margin-top:0.15rem">{{invoiceName}}</p>
      </div>
      <el-form ref="form2" :model="form2">
        <el-form-item v-if="item.columnShow == 1&&item.columnEdit==1" :label="item.columnTitle" v-for="(item,index) in nextStepList" :key="index">
          <el-input v-if="item.columnTitle=='发票张数'" v-model="form.name"></el-input>
          <el-input v-if="item.columnTitle=='票面金额'" v-model="form.amount"></el-input>
          <el-input v-if="item.columnTitle!='票面金额'&&item.columnTitle!='发票张数'" v-model="item.defaultValue"></el-input>
          <!-- <p style="float:right" v-if="item.columnEdit==0">{{item.defaultValue}}</p> -->
          <span class="error">{{item.errInfo}}</span>
        </el-form-item>
        <el-form-item class="rightSelect" v-if="item.e9zConfigInvoiceTaxesRateList.length>0" :label="item.taxesTitle" v-for="(item,indexs) in nextStepSelectList">
          <el-select v-model="item.taxesValue" placeholder="请选择">
            <el-option v-for="child in item.e9zConfigInvoiceTaxesRateList" :label="child.taxesRate" :value="child.taxesRate">
            </el-option>
          </el-select>
          <span class="error">{{item.errInfo}}</span>
        </el-form-item>
      </el-form>
      <div class="nextStep" @click="save()">保存</div>
      <div class="cancel" @click="nextStepDialogVisible = false">取消</div>
    </el-dialog>
    <!-- 详情弹窗 -->
    <el-dialog class="detailDialog" width="40%" :close-on-click-modal="false" :visible.sync="detailDialogVisible">
      <div class="detailHeader">
        <div class="costumer">
          <p class="label">客户名称：</p>
          <p class="value">南京公司</p>
          <p class="pages" v-if="detailData.pages">{{detailData.pages}}张</p>
        </div>
        <div class="invoice" v-if="detailData.invoiceCategory">
          <div class="left">
            <p class="label">发票类型：</p>
            <p class="value">{{detailData.invoiceCategory}}</p>
            <p class="pages">{{detailData.invoiceType}}</p>
          </div>
          <div class="right">
            <p class="label">发票名称：</p>
            <p class="value">{{detailData.invoiceName}}</p>
          </div>
        </div>
        <div class="date">
          <div class="left">
            <p class="label">账期：</p>
            <p class="value">{{searchList.nowDate}}</p>
          </div>
          <div class="right">
            <p class="label">申报纳税种类：</p>
            <p class="value">一般纳税人</p>
          </div>
        </div>
      </div>
      <div class="taxRate">
        <div class="valueBox" v-for="(item,index) in detailData.taxColumnList" :key="index">
          <p class="label">{{item.columnTitle}}：</p>
          <p class="value" v-if="item.columnTitle=='城建税税率'">{{item.columnValue}}</p>
          <el-select v-if="item.columnTitle=='增值税税率'" v-model="item.columnValue" placeholder="请选择">
            <el-option v-for="item in zengzhiTaxList" :key="item.taxesRate" :label="item.taxesRate" :value="item.taxesRate"></el-option>
          </el-select>
          <el-select v-if="item.columnTitle=='印花税税率'" v-model="item.columnValue" placeholder="请选择">
            <el-option v-for="item in yinhuaTaxList" :key="item.taxesRate" :label="item.taxesRate" :value="item.taxesRate"></el-option>
          </el-select>
        </div>
      </div>
      <div class="content">
        <div class="valueBox" v-for="(item,index) in detailData.invoiceColumnList" :key="index">
          <p class="label">{{item.columnTitle}}</p>
          <p class="value" v-show="!item.isEdit" @dblclick="changeValue(item)">{{item.columnValue}}</p>
          <el-input v-show="item.isEdit" v-model="item.columnValue" @blur="unfocused(item)"></el-input>
          <span class="error">{{item.errInfo}}</span>
        </div>
      </div>
      <div class="detailFooter">
        <div class="nextStep" @click="edit()">提交</div>
        <div class="cancel" @click="closeDetail()">关闭</div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "listModule",
  props: {
    taxesList:{
      type: Array,
      default: []
    },
    invoicePanelList: {
      type: Array,
      default: []
    },
    taxationId: {
      type: String,
      default: ""
    },
    taxInfoId: {
      type: String,
      default: ""
    },
    searchList: {
      type: Object,
      default: {}
    },
    loadingCard: {
      type: Boolean,
      default: false
    }
  },
  watch:{
    taxesList(val){
      console.log('taxesList111',val)
      val.forEach(item=>{
        if(item.taxesName=='增值税'){
          this.zengzhiTaxList=item.taxes;
        }else if(item.taxesName=='印花税'){
          this.yinhuaTaxList=item.taxes;
        }
      })
      console.log('this.zengzhiTaxList0',this.zengzhiTaxList)
    }
  },
  data() {
    var validatePass = (rule, value, callback) => {
      var reg = /^[1-9]\d*$/;
      if (value === "") {
        callback();
      } else if (!reg.test(value)) {
        callback(new Error("只可输入整数"));
      } else {
        callback();
      }
    };
    var validatePrice = (rule, value, callback) => {
      var reg = /^(-)?\d{1,14}(\.\d{1,4})?$/;
      if (value === "") {
        callback();
      } else if (!reg.test(value)) {
        callback(new Error("整数位最多14位，小数位最多4位"));
      } else {
        callback();
      }
    };
    return {
      form: {
        name: "",
        pages: "",
        amount: "",
        taxCalcMethod: "", //计税方法
        invoiceType: "", //发票类型
        invoiceName: "" //发票名称
      },
      invoiceName: "",
      rules: {
        name: [
          {
            validator: validatePass,
            trigger: "blur"
          }
        ],
        amount: [
          {
            validator: validatePrice,
            trigger: "blur"
          }
        ],
        taxCalcMethod: [
          {
            required: true,
            message: "请选择计税方法",
            trigger: "change"
          }
        ],
        invoiceType: [
          {
            required: true,
            message: "请选择发票类型",
            trigger: "change"
          }
        ],
        invoiceName: [
          {
            required: true,
            message: "请选择发票名称",
            trigger: "change"
          }
        ]
      },
      form2: {
        name: "",
        invoiceType: ""
      },
      rules2: {
        invoiceType: [
          {
            required: true,
            message: "请选择发票类型",
            trigger: "blur"
          }
        ]
      },
      addDialogVisible: false,
      nextStepDialogVisible: false,
      detailDialogVisible: false,
      taxCalcMethodOptions: [], //计税方法选择框
      invoiceTypeOptions: [], //发票类型选择框
      invoiceNameOptions: [], //发票名称选择框
      allSelectList: [],
      invoiceList: [],
      nextStepList: [],
      nextStepSelectList: [],
      nextStepRes: {},
      detailData: {},
      zengzhiTaxList:[],
      yinhuaTaxList:[]
    };
  },
  created() {
    // console.log('taxInfoId',this.taxInfoId)
    this.getTaxCalcMethod();
  },
  methods: {
    // 四舍五入
    fomatFloat(x, pos) {
      // console.log('xxx',x)
      if (x) {
        if (x.toString().indexOf(".") > -1) {
          var f = parseFloat(x);
          if (isNaN(f)) {
            return false;
          }
          f = Math.round(x * Math.pow(10, pos)) / Math.pow(10, pos); // pow 幂
          var s = f.toString();
          var rs = s.indexOf(".");
          if (rs < 0) {
            rs = s.length;
            s += ".";
          }
          while (s.length <= rs + pos) {
            s += "0";
          }
          return s;
        }else{
          return x;
        }
      } else {
        return x;
      }
    },
    //获取计税方法
    getTaxCalcMethod() {
      axios
        .post(
          "/perTaxToolTwo/e9z/configDictionary/findDictionayList?dicName=计税方法"
        )
        .then(res => {
          console.log("获取计税方法", res);
          if (res.data.code == 200) {
            this.taxCalcMethodOptions = res.data.data;
          }
        })
        .catch(err => {
          this.$message({
            message: "获取计税方法失败",
            type: "error"
          });
        });
    },
    // 更改计税方法时触发
    changeTaxMethod() {
      console.log(1111);
      this.invoiceTypeOptions = [];
      this.form.invoiceType = "";
      this.invoiceNameOptions = [];
      this.form.invoiceName = "";
      this.getInvoiceTypeAndName();
    },
    // 获取发票类型和发票名称
    getInvoiceTypeAndName() {
      let params = {
        taxCalcType: this.form.taxCalcMethod,
        taxesTaxType: 233,
        tmplShowType: 0
      };
      axios
        .post("/perTaxToolTwo/e9z/invoiceInfo/findInvoiceFormula", params)
        .then(res => {
          console.log("获取发票类型和发票名称", res);
          if (res.data.code == 200) {
            this.allSelectList = res.data.data;
            res.data.data.forEach((item, index) => {
              // type是发票
              if (item.type == "invoice") {
                this.invoiceTypeOptions = item.list;
              }
            });
          }
        })
        .catch(err => {
          this.$message({
            message: "获取发票类型和发票名称失败",
            type: "error"
          });
        });
    },
    // 更改发票类型时触发
    changeInvoiceType() {
      console.log("1110", this.allSelectList);
      this.invoiceNameOptions = [];
      this.form.invoiceName = "";
      this.invoiceList = [];
      this.allSelectList.forEach((item, index) => {
        // type是发票
        if (item.type == "invoice") {
          item.list.forEach((v, index) => {
            if (v.typeString == this.form.invoiceType) {
              v.invoiceList.forEach((i, index) => {
                var obj = {};
                obj.label = i.invoiceName;
                obj.value = i.invoiceId;
                this.invoiceNameOptions.push(obj);
                this.invoiceList.push(i);
              });
            }
          });
        }
      });
      console.log("this.invoiceNameOptions", this.invoiceNameOptions);
      console.log("invoiceList", this.invoiceList);
    },
    // 新增弹窗1
    addDialog() {
      this.form = {
        name: "",
        amount: "",
        taxCalcMethod: "", //计税方法
        invoiceType: "", //发票类型
        invoiceName: "" //发票名称
      };
      //  this.taxCalcMethodOptions= []; //计税方法选择框
      this.invoiceTypeOptions = []; //发票类型选择框
      this.invoiceNameOptions = []; //发票名称选择框
      this.$nextTick(() => {
        this.$refs["form"].resetFields();
      });
      this.addDialogVisible = true;
    },
    // 点击下一步,获取字段列
    nextStep(formName) {
      console.log("this.form.price", this.form);
      console.log("this.invoiceNameOptions", this.invoiceNameOptions);
      this.invoiceName = this.invoiceNameOptions
        .map(v => {
          if (v.value == this.form.invoiceName) {
            return v.label;
          }
        })
        .join("");
      this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {
            invoiceId: this.form.invoiceName
          };
          axios
            .post(
              "/perTaxToolTwo/e9z/invoiceInfo/findInvoiceProperty",
              params
            )
            .then(res => {
              console.log("获取下一步字段列", res);
              this.nextStepRes = res.data.data;
              this.nextStepList = [];
              this.nextStepSelectList = [];
              res.data.data.e9zConfigInvoiceColumnList.forEach(
                (item, index) => {
                  // if (item.columnShow == 1) {
                  this.$set(item, "errInfo", "");
                  // if (item.columnEdit == 1) {
                  this.nextStepList.push(item);
                  // }
                  // }
                }
              );
              // e9zConfigInvoiceTaxesList
              if (res.data.data.e9zConfigInvoiceTaxesList) {
                res.data.data.e9zConfigInvoiceTaxesList.forEach(
                  (item, index) => {
                    this.$set(item, "errInfo", "");
                    this.nextStepSelectList.push(item);
                  }
                );
              }
              this.addDialogVisible = false;
              this.nextStepDialogVisible = true;
            })
            .catch(err => {
              this.$message({
                message: "获取下一步字段列数据失败",
                type: "error"
              });
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 编辑
    edit() {
      console.log(11, this.detailData.e9zConfigInvoiceColumnList);
      // 校验
      var intreg = /^[1-9]\d*$/;
      var float5reg = /^(-)?\d{1,3}(\.\d{1,5})?$/;
      var float4reg = /^(-)?\d{1,14}(\.\d{1,4})?$/;
      this.detailData.invoiceColumnList.forEach((item, index) => {
        if (item.columnTitle == "核定征收率") {
          if (item.columnValue == "") {
            this.$set(item, "errInfo", "");
          } else if (!float5reg.test(item.columnValue)) {
            this.$set(item, "errInfo", "整数位最多3位，小数位最多5位");
          } else {
            this.$set(item, "errInfo", "");
          }
        } else {
          if (item.columnValue == "") {
            this.$set(item, "errInfo", "");
          } else if (!float4reg.test(item.columnValue)) {
            this.$set(item, "errInfo", "整数位最多14位，小数位最多4位");
          } else {
            this.$set(item, "errInfo", "");
          }
        }
      });
      let flag = false;
      this.detailData.invoiceColumnList.forEach((item, index) => {
        if (item.errInfo != "") {
          flag = true;
        }
      });
      console.log(flag);
      if (!flag) {
        let invoiceColumns = [];
        this.detailData.e9zConfigInvoiceColumnList.forEach((item, index) => {
          
          var obj = {};
          obj.columnId = item.columnId;
           if (item.columnName == "tax_info_id") {
            obj.columnValue = this.taxInfoId;
            invoiceColumns.push(obj);
          } else if (item.columnName == "taxation_id") {
            obj.columnValue = this.taxationId;
            invoiceColumns.push(obj);
          } else{
            obj.columnValue = item.columnValue?item.columnValue:item.defaultValue;
          }
          invoiceColumns.push(obj);
        });
        let params = {
          invoiceId: this.detailData.invoiceId, //发票Id (如果是发票配置表)
          invoiceTmplId:this.detailData.tmplId,//模板id （如果是模板配置表）
          invoiceTaxableType: this.detailData.invoiceTaxableType, //应税类型：1 - 应税货物；2 - 应税劳务；3 - 应税服务
          invoiceName: this.detailData.invoiceName, //发票名称 this.detailData.invoiceName
          invoiceListId: this.detailData.invoiceListId, //发票信息Id
          invoiceCategory: this.detailData.invoiceCategory, //发票分类：防伪税控；税务局代开；有票收入；无票收入
          invoiceType: this.detailData.invoiceType, //发票类型：（防伪税控/代开-）专票；（防伪税控/代开-）普票；（有票收入-）形式发票；（有票收入-）通用机打；（无票收入-）无票
          area: this.detailData.area, //适用区域代码：All-通用
          invoiceTaxManageType: this.detailData.invoiceTaxManageType, //税务管理类型
          taxCalcType: this.detailData.taxCalcType, //计税方法：1 - 一般计税；2 - 简易征收计税
          reducePriority: this.detailData.reducePriority, //抵扣优先级
          tmplShowType: this.detailData.tmplShowType, //下拉框（0-发票 1-其他模板）
          taxesTaxType: this.detailData.taxesTaxType, //税务类型：0：通用；232：小规模；233：一般纳税人
          type: this.detailData.type, //对应列/税费下拉框 1-列 2-税费
          declarationType:2,
          e9zConfigInvoiceColumnList: invoiceColumns
        };
        console.log("params", params);
        axios
          .post("/perTaxToolTwo/e9zCalculate/invoiceCalculate", params)
          .then(res => {
            console.log("修改数据", res);
            if (res.data.code == 200) {
              this.$message({
                message: "修改成功",
                type: "success"
              });
              this.detailDialogVisible = false;
              this.$emit("getInvoiceLeaveShowList", {
                taxationId: this.taxationId,
                taxInfoId: this.taxInfoId,
                searchList: this.searchList
              });
            }
          })
          .catch(err => {
            this.$message({
              message: "修改数据失败",
              type: "error"
            });
          });
      }
    },
    closeDetail() {
      this.detailDialogVisible = false;
      this.$emit("getInvoiceLeaveShowList", {
        taxationId: this.taxationId,
        taxInfoId: this.taxInfoId,
        searchList: this.searchList
      });
    },
    // 保存提交数据
    save() {
      console.log("nextStepList", this.nextStepList);
      // 校验
      var intreg = /^[1-9]\d*$/;
      var float5reg = /^(-)?\d{1,3}(\.\d{1,5})?$/;
      var float4reg = /^(-)?\d{1,14}(\.\d{1,4})?$/;
      this.nextStepList.forEach((item, index) => {
        if (item.columnTitle == "发票张数") {
          if (this.form.name == "") {
            this.$set(item, "errInfo", "");
          } else if (!intreg.test(this.form.name)) {
            this.$set(item, "errInfo", "只可输入整数");
          } else {
            this.$set(item, "errInfo", "");
          }
        } else if (item.columnTitle == "票面金额") {
          if (this.form.amount == "") {
            this.$set(item, "errInfo", "");
          } else if (!float4reg.test(this.form.amount)) {
            this.$set(item, "errInfo", "整数位最多14位，小数位最多4位");
          } else {
            this.$set(item, "errInfo", "");
          }
        } else {
          console.log(item.columnShow, item.columnEdit, item.columnRequire);
          if (item.columnEdit == 1) {
            if (item.columnRequire == 1) {
              if (item.defaultValue == null || item.defaultValue == "") {
                this.$set(item, "errInfo", "必填项不可为空");
              } else if (!float4reg.test(item.defaultValue)) {
                this.$set(item, "errInfo", "整数位最多13位，小数位最多4位");
              } else {
                this.$set(item, "errInfo", "");
              }
            } else {
              if (item.defaultValue != null) {
                if (!float4reg.test(item.defaultValue)) {
                  this.$set(item, "errInfo", "整数位最多14位，小数位最多4位");
                } else {
                  this.$set(item, "errInfo", "");
                }
              }
            }
          }
          if (item.columnTitle == "核定征收率") {
            if (item.defaultValue == null || item.defaultValue == "") {
              this.$set(item, "errInfo", "必填项不可为空");
            } else if (!float5reg.test(item.defaultValue)) {
              this.$set(item, "errInfo", "整数位最多3位，小数位最多5位");
            } else {
              this.$set(item, "errInfo", "");
            }
          }
        }
      });
      if (this.nextStepSelectList.length > 0) {
        this.nextStepSelectList.forEach((item, index) => {
          if (item.e9zConfigInvoiceTaxesRateList) {
            if (item.taxesTitle == "增值税") {
              console.log(item.taxesValue);
              if (item.taxesValue == undefined) {
                this.$set(item, "errInfo", "请选择增值税");
              } else {
                this.$set(item, "errInfo", "");
              }
            }
            if (item.taxesTitle == "印花税") {
              if (item.taxesValue == undefined) {
                this.$set(item, "errInfo", "请选择印花税");
              } else {
                this.$set(item, "errInfo", "");
              }
            }
          }
        });
      }
      let flag = false;
      this.nextStepList.forEach((item, index) => {
        if (item.errInfo != "") {
          flag = true;
        }
      });
      if (this.nextStepSelectList.length > 0) {
        this.nextStepSelectList.forEach((item, index) => {
          if (item.errInfo != "") {
            flag = true;
          }
        });
      }
      console.log("flag", flag);
      if (!flag) {
        let invoiceColumns = [];
        let zengzhiValue, yinhuaValue;
        this.nextStepSelectList.forEach((item, index) => {
          if (item.taxesTitle == "增值税") {
            if (item.taxesValue != undefined) {
              zengzhiValue = item.taxesValue;
            }
          }
          if (item.taxesTitle == "印花税") {
            if (item.taxesValue != undefined) {
              yinhuaValue = item.taxesValue;
            }
          }
        });
        console.log("增值税", zengzhiValue, yinhuaValue);
        this.nextStepList.forEach((item, index) => {
          var obj = {};
          obj.columnId = item.columnId;
          if (item.columnTitle == "发票张数") {
            obj.columnValue = this.form.name;
            invoiceColumns.push(obj);
          } else if (item.columnTitle == "票面金额") {
            obj.columnValue = this.form.amount;
            invoiceColumns.push(obj);
          } else if (item.columnTitle == "发票类型") {
            if (this.invoiceName == "即征即退") {
              obj.columnValue = "2";
              invoiceColumns.push(obj);
            }
          } else if (item.columnName == "tax_info_id") {
            obj.columnValue = this.taxInfoId;
            invoiceColumns.push(obj);
          } else if (item.columnName == "taxation_id") {
            obj.columnValue = this.taxationId;
            invoiceColumns.push(obj);
          } else if (item.columnTitle == "增值税税率") {
            obj.columnValue = zengzhiValue;
            invoiceColumns.push(obj);
          } else if (item.columnTitle == "印花税税率") {
            obj.columnValue = yinhuaValue;
            invoiceColumns.push(obj);
          } else {
            obj.columnValue = item.defaultValue;
            // if (item.columnShow == 1 && item.columnEdit == 1) {
              invoiceColumns.push(obj);
            // }
          }
        });
        let params = {
          invoiceId: this.nextStepRes.invoiceId, //发票Id (如果是发票配置表)
          invoiceTmplId:this.detailData.tmplId,//模板id （如果是模板配置表）
          invoiceTaxableType: this.nextStepRes.invoiceTaxableType, //应税类型：1 - 应税货物；2 - 应税劳务；3 - 应税服务
          invoiceName: this.nextStepRes.invoiceName, //发票名称
          invoiceListId: this.nextStepRes.invoiceListId, //发票信息Id
          invoiceCategory: this.nextStepRes.invoiceCategory, //发票分类：防伪税控；税务局代开；有票收入；无票收入
          invoiceType: this.nextStepRes.invoiceType, //发票类型：（防伪税控/代开-）专票；（防伪税控/代开-）普票；（有票收入-）形式发票；（有票收入-）通用机打；（无票收入-）无票
          area: this.nextStepRes.area, //适用区域代码：All-通用
          invoiceTaxManageType: this.nextStepRes.invoiceTaxManageType, //税务管理类型
          taxCalcType: this.nextStepRes.taxCalcType, //计税方法：1 - 一般计税；2 - 简易征收计税
          reducePriority: this.nextStepRes.reducePriority, //抵扣优先级
          tmplShowType: this.nextStepRes.tmplShowType, //下拉框（0-发票 1-其他模板）
          taxesTaxType: this.nextStepRes.taxesTaxType, //税务类型：0：通用；232：小规模；233：一般纳税人
          type: this.nextStepRes.type, //对应列/税费下拉框 1-列 2-税费
          declarationType:2,//申报类型 1：小规模，2一般纳税人
          e9zConfigInvoiceColumnList: invoiceColumns
        };
        console.log("params", params);
        axios
          .post("/perTaxToolTwo/e9zCalculate/invoiceCalculate", params)
          .then(res => {
            console.log("插入数据", res);
            if (res.data.code == 200) {
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.nextStepDialogVisible = false;
              this.$emit("getInvoiceLeaveShowList", {
                taxationId: this.taxationId,
                taxInfoId: this.taxInfoId,
                searchList: this.searchList
              });
            }
          })
          .catch(err => {
            this.$message({
              message: "添加数据失败",
              type: "error"
            });
          });
      }
    },
    // 打开详情弹窗
    showDetail(item) {
      this.detailDialogVisible = true;
      console.log("item,", item);
      item.invoiceColumnList = [];
      item.taxColumnList = [];
      item.e9zConfigInvoiceColumnList.forEach(v => {
        this.$set(v, "isEdit", false);
        this.$set(v, "errInfo", "");
        if (v.columnTitle == "发票张数") {
          item.pages = parseInt(v.columnValue);
        }
        if (v.columnTitle == "发票项目类型") {
          if(v.columnValue=='1'){
            v.columnValue='一般'
          }else if(v.columnValue=='2'){
            v.columnValue='即征即退'
          }
          
        }
        if (v.columnTitle == "应税类型") {
          if(v.columnValue=='1'){
            v.columnValue='应税货物'
          }else if(v.columnValue=='2'){
            v.columnValue=' 应税劳务'
          }else if(v.columnValue=='3'){
            v.columnValue=' 应税服务'
          }
        }
        if (v.columnTitle == "是否是辅导期") {
          if(v.columnValue=='1'){
            v.columnValue='是'
          }else if(v.columnValue=='2'){
            v.columnValue='否'
          }
        }
        if (v.columnShow == 1) {
          v.columnValue =v.columnValue? this.fomatFloat(v.columnValue, 2): this.fomatFloat(v.defaultValue, 2);
          item.invoiceColumnList.push(v);
        }
        if (v.columnTitle.indexOf("税率") > -1) {
          v.columnValue=parseFloat(v.columnValue)
          item.taxColumnList.push(v);
        }
      });
      this.detailData = item;
    },
    editPanel(item, child) {
      console.log("item,,,", item);

      item.e9zConfigInvoiceColumnList.forEach(v => {
        if (child.columnId == v.columnId) {
          if (v.columnEdit == 1) {
            console.log('可编辑')
            this.showDetail(item);
            this.$set(v, "isEdit", true);
            
            
          }
        } else {
          this.$set(v, "isEdit", false);
        }
      });
    },
    changeValue(item) {
      this.detailData.e9zConfigInvoiceColumnList.forEach(v => {
        if (item.columnId == v.columnId) {
          this.$set(v, "isEdit", true);
        } else {
          this.$set(v, "isEdit", false);
        }
      });
      //
    },
    unfocused(item) {
      this.detailData.e9zConfigInvoiceColumnList.forEach(v => {
        if (item.columnId == v.columnId) {
          this.$set(v, "isEdit", false);
        }
      });
    }
  }
};
</script>
<style>
.smallDialog .el-dialog,
.smallNextDialog .el-dialog {
  width: 3.6rem;
}
.detailDialog .el-dialog {
  width: 5.60rem;
}
.detailDialog .el-dialog__body {
  padding: 0.30rem 0.45rem;
}
.detailDialog .el-input {
  width: 0.9rem;
  float: right;
  font-size: 0.12rem;
}
.detailDialog .el-input__inner {
  padding: 0 0.05rem;
  height: 0.30rem;
  line-height: 0.30rem;
}
.detailDialog .el-input__icon{
  line-height: 0.3rem
}
.smallDialog .el-form-item__label{
      width: 1rem;
    font-size: 0.14rem;
    padding: 0 0.12rem 0 0;
}
.smallNextDialog .el-form-item__content {
  line-height: 0.30rem;
}
.smallNextDialog .el-input__icon {
  line-height: 0.30rem;
}
.smallNextDialog .el-dialog__body {
  padding: 0.50rem 0.15rem;
}
.smallNextDialog .el-input {
  width: 0.80rem;
  float: right;
  font-size: 0.12rem;
}
.smallNextDialog .el-form-item {
  margin-bottom: 0.11rem;
}
.smallNextDialog .el-form-item__label {
  font-size: 0.12rem;
  padding: 0 0.05rem 0 0;
  line-height: 0.30rem;
}
.smallNextDialog .el-input__inner {
  padding: 0 0.05rem;
  height: 0.25rem;
  line-height: 0.25rem;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  width: 1.2rem;
  min-width: 115px;
}
.rightSelect .el-select {
  float: right;
}
</style>

<style scoped>
.invoice_oListModule {
  /* width: 1180rem; */
}
.cardBox {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  justify-content: flex-start;
  margin-bottom: 0.2rem;
}
.eachCard {
  width: 24.25%;
  height: 2.53rem;
  border-radius: 0.05rem;
  margin-top: 0.2rem;
  background: #fff;
  margin-right: 1%;
  position: relative;
  overflow-y: hidden;
}
.eachCard:nth-child(4n) {
  margin-right: 0;
}
.topContent {
  height: 0.9rem;
}
.color1 {
  background: #43b3db;
}
.color2 {
  background: #7dc36d;
}
.color3 {
  background: #ffac69;
}
.color4 {
  background: #ed878e;
}
.color5 {
  background: #e6a08a;
}
.color6 {
  background: #d19ae9;
}
.color7 {
  background: #7baddc;
}
.color8 {
  background: #8fc879;
}
.color9 {
  background: #8e8ec5;
}
.line1 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.15rem 0.2rem;
}
.line1 p {
  color: #fff;
}
.bigTitle {
  font-size: 0.18rem;
  flex: 0.8;
}
.smallTitle {
  font-size: 0.12rem;
  cursor: pointer;
}
.line2 {
  display: flex;
  padding: 0rem 0.2rem;
  /* align-items: flex-end; */
  /* justify-content: space-between;*/
}
.line2 p {
  font-size: 0.14rem;
  color: #fff;
}
.dataContent {
  height: 1.30rem;
  overflow-y: hidden;
  padding: 0.15rem 0.2rem;
  padding-bottom: 0;
}
.lineData {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.05rem 0;
  color: #666;
  font-size: 0.12rem;
}
.footerContent {
  position: absolute;
  bottom: 0.03rem;
  left: 50%;
  cursor: pointer;
}
.addBtn {
  cursor: pointer;
}
.nextStep {
  color: #fff;
  background: #43b3db;
  text-align: center;
  border-radius: 0.05rem;
  padding: 0.12rem 0;
  cursor: pointer;
  margin-top: 0.25rem;
}
.cancel {
  margin-top: 0.3rem;
  color: #fff;
  background: #ed878e;
  text-align: center;
  border-radius: 0.05rem;
  padding: 0.12rem 0;
  cursor: pointer;
}
.dialogTitle {
  position: absolute;
  top: 0.2rem;
}
.dialogBigTitle {
  font-size: 0.18rem;
  color: #43b3db;
}
.dialogTitleLine2 {
  display: flex;
  align-items: center;
  margin-top: 0.08rem;
}
.dialogSmallTitle {
  color: #ed878e;
}
.error {
  position: absolute;
  bottom: -0.03rem;
  left: 0;
  line-height: 0rem;
}
.error1 {
  bottom: -0.08rem;
}
.costumer,
.invoice,
.left,
.right,
.date {
  display: flex;
  align-items: center;
}
.invoice,
.date {
  justify-content: space-between;
}
.costumer,
.invoice {
  margin-bottom: 0.15rem;
}
.costumer .label,
.costumer .pages,
.invoice .left .label,
.invoice .right .label,
.date .left .label,
.date .right .label,
.taxRate .valueBox .label {
  color: #999;
}
.costumer .value {
  color: black;
}
.costumer .pages {
  margin-left: 0.25rem;
}
.invoice .left .pages {
  color: #57bbdf;
  margin-left: 0.10rem;
}
.date {
  padding-bottom: 0.20rem;
  border-bottom: 0.02rem solid #e5e5e5;
}
.taxRate {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-top: 0.20rem;
}
.taxRate .valueBox {
  display: flex;
  align-items: center;
  width: 50%;
  padding: 0 0 0.15rem 0;
}
.content {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}
.content .valueBox {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 47%;
  margin-right: 6%;
  padding: 0.07rem 0;
  position: relative;
}
.content .valueBox:nth-child(2n) {
  margin-right: 0;
}
.content .valueBox .label,
.content .valueBox .value {
  font-size: 0.12rem;
}
.detailFooter {
  display: flex;
  align-items: center;
  justify-content: space-around;
}
.detailFooter .nextStep {
  width: 1.80rem;
  margin-top: 0.30rem;
}
.detailFooter .cancel {
  width: 1.80rem;
}
.noData {
  text-align: center;
  margin-top: 20%;
  color: #909399;
  font-size: 0.14rem;
}
</style>
