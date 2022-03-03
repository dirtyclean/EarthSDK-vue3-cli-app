<template>
  <modal class="tree-box" :open="true" :showCloseIcon="false">
    <tree
      v-model:selectedKeys="selectedKeys"
      v-model:checkedKeys="checkedKeys"
      default-expand-all
      checkable
      :height="500"
      :tree-data="treeData"
      @select="renderPin"
    >
      <template #title="{ title, key }">
        <span v-if="key === '0-0-1-0'" style="color: #1890ff">{{ title }}</span>
        <template v-else>{{ title }}</template>
      </template>
    </tree>
  </modal>
</template>
<script>
import { defineComponent, ref, watch } from 'vue'
import { Tree } from 'ant-design-vue'
import modal from '../modal'
function dig(path = '0', level = 3) {
  const list = []

  for (let i = 0; i < 10; i += 1) {
    const key = `${path}-${i}`
    const treeNode = {
      title: key,
      key
    }

    if (level > 0) {
      treeNode.children = dig(key, level - 1)
    }

    list.push(treeNode)
  }

  return list
}
export default defineComponent({
  setup() {
    const selectedKeys = ref(['0-0-0', '0-0-1'])
    const checkedKeys = ref(['0-0-0', '0-0-1'])
    watch(selectedKeys, () => {
      console.log('selectedKeys', selectedKeys)
    })
    watch(checkedKeys, () => {
      console.log('checkedKeys', checkedKeys)
    })
    return {
      treeData: dig(),
      selectedKeys,
      checkedKeys
    }
  },
  components: {
    Tree,
    modal
  }
})
</script>
<style scoped lang="scss">
.tree-box {
  left: 18px;
  top: 300px;
  width: 294px;
  :deep(.ant-tree) {
    background-color: transparent;
    color: #fff;
  }
  :deep(.ant-tree .ant-tree-node-content-wrapper:hover) {
    background-color: red;
  }
  :deep(.ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected) {
    background-color: green;
  }
}
</style>
