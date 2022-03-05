<template>
  <div class="ent-select-box">
    <a-cascader
      :options="areaData"
      placeholder="请选择所属区域"
      :showSearch="{ matchInputWidth: false }"
      :fieldNames="{ label: 'areaName', value: 'id', children: 'children' }"
      :allowClear="true"
      v-model:value="areaIds"
      change-on-select
      expand-trigger="hover"
      popupClassName="ant-select-dropdown-custom"
      @change="ent = undefined"
      style="margin-right: 20px"
    />
    <lazy-loading-select
      v-model:value="ent"
      :disabled="!!currRow"
      :pageSize="10"
      :allowClear="true"
      popupClassName="ant-select-dropdown-custom"
      :dropdownMatchSelectWidth="false"
      v-model:total="entTotal"
      placeholder="请选择企业"
      :fieldNames="{
        label: 'name',
        value: 'id'
      }"
      :getAsyncOptions="getAsyncEnterpriseData"
      :isAsyncPagination="true"
      :isMustSearchGetOptions="false"
      :showSearch="true"
      :labelInValue="true"
      @change="entChange"
    />
  </div>
</template>
<script setup>
import { reactive, ref } from 'vue'
import { Cascader as ACascader } from 'ant-design-vue'
import lazyLoadingSelect from './lazyLoadingSelect/async.vue'
const areaIds = reactive([])
const ent = reactive()
const areaData = reactive([])
const entTotal = ref(0)
</script>
<style scoped lang="scss">
.ent-select-box {
  position: absolute;
  left: 20px;
  top: 20px;
  z-index: 9999;
}
:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
  background-color: rgba(71, 71, 71, 0.8);
  border-radius: 6px;
  border-color: transparent;
}
:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector .ant-select-selection-search-input) {
  color: #fff;
}
:deep(.ant-select-selection-placeholder) {
  color: #fff;
}
:deep(.ant-select-arrow) {
  color: #fff;
}
</style>
