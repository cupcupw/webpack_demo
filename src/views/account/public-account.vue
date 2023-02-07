<template>
  <as-view title="对公账户管理" :useLeftEvent="false" @left="$app.backToApp()">
    <div class="account">
      <as-super-box
        v-if="!bankList || !bankList.length"
        :error.sync="superError"
        :loading="false"
        description="暂无对公账户"
      />
      <div class="account-card" v-for="item in bankList" :key="item.id">
        <div class="account-content">
          <div>账户名称：
            <span>{{ item.accountName }}</span>
            <span class="account-status" v-if="!item.accountStatus">已停用</span>
          </div>
          <div>银行账号：<span>{{ item.bankCode }}</span></div>
          <div>开户银行：<span>{{ item.bankName }}</span></div>
          <div>开户支行：<span>{{ item.subbranchBank }}</span></div>
        </div>
        <div class="btn-group" v-if="item.isOwnner">
          <button  class="btn-edit" @click="handleShow('edit', item)"><van-icon name="edit" size="16px" color="#1BB295"/>编辑</button>
          <button class="btn-remove" v-if="bankList.length > 1" @click="handleRemove(item.id)"><van-icon name="delete-o" size="16px" color="#666"/>删除</button>
        </div>
      </div>
    </div>
    <div class="bottom">
      <button class="add-btn" @click="handleShow('add')">添加对公账户</button>
    </div>
    <operation ref="operation" />
  </as-view>
</template>

<script>
import {Icon, Toast} from "vant";
import Operation from "./components/operation.vue";
import {mapState} from "vuex";
import {$app} from "../../plugins/app";
export default {
  name: "public-account",
  components: {
    VanIcon: Icon,
    Operation
  },
  data() {
    return {
      bankList: '',
    }
  },
  computed: {
    ...mapState([
      'memberSid',
      'cellphone'
    ]),
  },
  created() {
    this.reqBankList()
  },
  methods: {
     handleShow(action, val) {
      this.$refs.operation.show(action, val).then((res) => {
         this.reqBankList()
      }).toast()
    },
    reqBankList(cb) {
      this.$api.companyBankList({ memberSid: this.memberSid }).then( res => {
        this.bankList = res
      }).toast(this).finally(() => typeof cb === 'function' && cb())
    },
    handleRemove(id) {
      this.$dialog.confirm({
        title: '提示',
        message: '确定删除此公户?',
        cancelButtonText: '再考虑下',
        confirmButtonText: '删除',
        confirmButtonColor: '#1BB295'
      }).then(async () => {
        await this.$api.delCompanyBank({memberSid: this.memberSid, id})
        await this.$toast('删除成功')
        await this.reqBankList()
      }).toast()
    }
  },
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/define";

.account {
  @extend %df;
  @extend %fdc;
  @extend %bsb;
  min-height: calc(100vh - 106px);
  padding: j(0) j(12) j(72) j(12);
  background-color: #F5F5F5;
}
.account-card {
  @extend %bsb;
  margin-top: j(12);
  border-radius: j(4);
  background-color: #fff;
  box-shadow: 0 j(4) j(4) 0 rgba(184,190,187,0.25);
}
.account-content {
  @extend %df;
  @extend %fdc;
  @extend %bsb;
  div {
    @extend %df;
    @extend %df1;
    @extend %bsb;
    padding: j(8) j(16);
    font-size: j(14);
    color: #333;
    span {
      @extend %df1;
      width: 100%;
      word-break: break-all;
    }
    &:first-child {
      margin-top: j(8);
      span:first-child {
        flex: 4;
      }
      .account-status {
        @extend %df;
        @extend %aic;
        @extend %jcc;
        flex: 1;
        margin-left: j(14);
        width: j(48);
        height: j(24);
        border: 1px dashed #ababab;
        font-size: j(12);
        color: #ababab;
        background-color: #f5f5f5;
      }
    }

  }
}
.account-content .account-status {

}
.btn-group {
  @extend %df;
  @extend %jce;
  padding: j(14) j(16);
  background-color: #F5F5F5;
  button {
    @extend %df;
    @extend %aic;
    @extend %jcc;
    @extend %bn;
    @extend %ao8;
    margin-left: j(16);
    border-radius: j(4);
    padding: j(8) j(16);
    font-size: j(12);
    border: 1px solid rgba(107,119,133,0.3);
    background: #F5F5F5;
    i {
      margin-right: j(4);
    }
  }
  .btn-edit {
    color: #1BB295;
    border: 1px solid #1BB295;
  }
  .btn-remove {
    color: #666;
  }
}
.seat {
  height: j(60);
  width: 100%;
}
.bottom {
  @extend %pf;
  @extend %b0;
  @extend %l0;
  @extend %r0;
  @extend %df;
  @extend %aic;
  @extend %jcc;
  height: j(60);
  background-color: #fff;
}
.add-btn {
  @extend %cp;
  @extend %ao8;
  @extend %bn;
  border-radius: j(4);
  color: #fff;
  width: 100%;
  margin: 0 j(16);
  padding: j(12) j(0);
  background: #1BB295;
  font-size: j(15);
}
</style>
