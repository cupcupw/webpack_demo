<template>
  <as-view>
    <a :href="`app.autostreets.com://auto?random=${Math.random()}`" target="_blank">唤醒汽车街APP！</a>
  </as-view>
</template>

<script>
export default {
  name: "app",
  data() {
    return {}
  },
  methods: {},
}
</script>

<style scoped lang="scss">
@import "src/assets/scss/define";
.as-view{
  @extend %df;
  @extend %aic;
  @extend %jcc;
  margin-top: j(150);
  font-size: j(14);
}
</style>
