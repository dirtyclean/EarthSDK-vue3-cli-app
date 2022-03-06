<template>
  <div class="ent-select-box">
    <a-cascader
      :options="areaData"
      placeholder="请选择所属区域"
      :showSearch="{ matchInputWidth: false }"
      :fieldNames="{ label: 'name', value: 'id', children: 'children' }"
      :allowClear="true"
      v-model:value="areaIds"
      change-on-select
      expand-trigger="hover"
      dropdownClassName="ant-select-dropdown-custom"
      @change="areaChange"
      style="margin-right: 20px"
    />
    <lazy-loading-select
      v-model:value="ent"
      :pageSize="10"
      :allowClear="true"
      dropdownClassName="ant-select-dropdown-custom"
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
import { getSelectedIds } from '@/utils/methods'
import lazyLoadingSelect from './lazyLoadingSelect/async.vue'
import self from '@/main.js'
const areaIds = ref([])
const ent = ref()
const areaData = ref([])
const entTotal = ref(0)
const getAreaTreeData = () => {
  self.$apiReq.getAreaTreeData().then(data => {
    areaData.value = data
    console.log(areaData, '....areaData....')
  })
}
getAreaTreeData()
const getAsyncEnterpriseData = requestParams => {
  const areaId = areaIds.value.slice(-1)[0]
  if (!areaId) {
    entTotal.value = 0
    return []
  }
  return self.$apiReq
    .getEnterpriseList({
      pageNum: requestParams.pageNum,
      pageSize: requestParams.pageSize,
      name: requestParams.searchName,
      areaId
    })
    .then(({ data: { list, rowCount } }) => {
      entTotal.value = rowCount
      return list
    })
}
const areaChange = () => {
  console.log('区域改变', ent)
  // ent.value = undefined
}
const entChange = () => {}
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
:deep(.ant-select-selection-item) {
  color: #fff;
}
</style>
