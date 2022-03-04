<template>
  <modal class="tree-box" :open="true" :showCloseIcon="false" title="企业点位信息">
    <tree
      v-model:selectedKeys="selectedKeys"
      v-model:checkedKeys="checkedKeys"
      default-expand-all
      checkable
      :height="500"
      :tree-data="treeData"
      :replace-fields="{
        children: 'children',
        title: 'name',
        key: 'id'
      }"
      @select="renderPin"
    >
      <template #title="{ name }">
        {{ name }}
      </template>
    </tree>
  </modal>
</template>
<script>
import { defineComponent, ref, watch } from 'vue'
import { Tree } from 'ant-design-vue'
import modal from '../modal'
const treeData = [
  {
    id: '0',
    name: '0',
    content: '0',
    children: [
      {
        id: '0-0',
        name: '0-0',
        content: '0-0',
        children: [
          {
            id: '0-0-0',
            name: '0-0-0',
            content: '0-0-0'
          }
        ]
      },
      {
        id: '0-1',
        name: '0-1',
        content: '0-1',
        children: [
          {
            id: '0-1-0',
            name: '0-1-0',
            content: '0-1-0'
          },
          {
            id: '0-1-1',
            name: '0-1-1',
            content: '0-1-1'
          }
        ]
      }
    ]
  },
  {
    id: '1',
    name: '1',
    content: '1',
    children: [
      {
        id: '1-0',
        name: '1-0',
        content: '1-0',
        children: [
          {
            id: '1-0-0',
            name: '1-0-0',
            content: '1-0-0'
          },
          {
            id: '1-0-1',
            name: '1-0-1',
            content: '1-0-1'
          },
          {
            id: '1-0-2',
            name: '1-0-2',
            content: '1-0-2'
          }
        ]
      }
    ]
  }
]
export default defineComponent({
  setup(props, context) {
    const selectedKeys = ref(['0-0-0', '0-0-1'])
    const checkedKeys = ref(['0-0-0', '0-0-1'])
    watch(selectedKeys, () => {
      console.log('selectedKeys', selectedKeys)
    })
    watch(checkedKeys, () => {
      console.log('checkedKeys', checkedKeys)
    })
    const renderPin = () => {
      context.emit('renderPin')
    }
    return {
      treeData,
      selectedKeys,
      checkedKeys,
      renderPin
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
