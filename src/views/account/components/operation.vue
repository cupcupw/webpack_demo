<template>
  <as-popup :visible.sync="visible" :title="`${type === 'add' ? '添加' : '编辑'}对公账户`" @update:visible="hide">
    <div class="popup">
      <component class="popup-content" v-for="(item, index) in objAccount" :is="item.is" :key="index" v-bind="item" v-model="item.value" />
      <div style="flex: 1" />
      <div class="bottom">
        <button class="add-btn" @click="handleSubmit">完成</button>
      </div>
    </div>
  </as-popup>
</template>

<script>
import {mapState} from "vuex";

export default {
  name: "operation",
  data() {
    const bankOptions = () => this.$api.getBankList(res => {return res})
    return {
      visible: false,
      type: '',
      disabled: true,
      objAccount: {
        accountName: {
          is: 'as-field',
          label: '账户名称',
          value: '固定为企业名称', //固定为企业名称
          placeholder: '',
          disabled: true,
          clearable: true
        },
        bankCode: {
          is: 'as-field',
          label: '银行账号',
          value: '',
          placeholder: '请填写银行账号',
          type: 'number',
          clearable: true,
          rules: [
            {required: true, message: '请填写银行账号'},
            {
              validator: (val) => {
                return /^[1-9]\d{9,29}$/.test(val)
              },
              message: '请输入正确的银行账号'
            }
          ],
        },
        bankName: {
          is: 'as-picker',
          label: '开户银行',
          value: '',
          placeholder: '请选择开户银行',
          clearable: false,
          filterable: true,
          labelKey: 'name',
          valueKey: 'name',
          options: bankOptions,
          rules: [
            {required: true, message: '请选择开户银行'}
          ],
        },
        subbranchBank: {
          is: 'as-field',
          label: '开户支行',
          value: '',
          placeholder: '请填写开户支行',
          clearable: true,
          rules: [
            {required: true, message: '请填写开户支行'}
          ],
        },
        companyId: {
          value: ''
        }
      },
    }
  },
  computed: {
    ...mapState([
      'memberSid',
      'cellphone'
    ]),
  },
  methods: {
    async show(action, val) {
      console.log('val =>', val)
      Object.keys(this.objAccount).forEach(v => {
        if (v !== 'accountName') this.objAccount[v].value = ''
      })
      if (action === 'edit') {
        this.$banana.assignment(val, this.objAccount)
        Object.assign(this.objAccount, { id: {value: val.id} })
      }
      else {
        const { authCompanyInfo } = await this.$api.loadMemberAuthInfo({memberSid: this.memberSid})
        this.objAccount.accountName.value = authCompanyInfo.companyName
        this.objAccount.companyId.value = authCompanyInfo.companyId
      }
      this.type = action
      this.visible = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    hide() {
      this.visible = false
    },
    async handleSubmit() {
      this.$banana.validate(this.objAccount)
      const obj = this.$banana.extract(this.objAccount)
      if (this.type === 'add') {
        await this.$api.addCompanyBank({memberSid: this.memberSid, ...obj})
        await this.$toast('登记成功')
        this.resolve('登记成功')
      }
      else if (this.type === 'edit') {
        await this.$api.editCompanyBank({memberSid: this.memberSid, ...obj})
        await this.$toast('修改成功')
        this.resolve('修改成功')
      }
      this.hide()
    }
  },
}
</script>

<style scoped lang="scss">
@import "src/assets/scss/define";

.popup {
  @extend %df;
  @extend %fdc;
  @extend %bsb;
  padding: j(12);
  background-color: #F5F5F5;
  height: calc( 100% - 46px);
  &-content {
    border-radius: j(4);
    background-color: #fff;
  }
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
