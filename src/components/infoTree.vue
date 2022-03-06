<template>
  <modal class="tree-box" :open="true" :showCloseIcon="false" title="企业点位信息">
    <tree
      v-model:selectedKeys="selectedKeys"
      :blockNode="false"
      default-expand-all
      :checkable="false"
      :height="500"
      :tree-data="treeData"
      :fieldNames="{
        children: 'children',
        title: 'name',
        key: 'id'
      }"
      @select="renderPin"
    >
      <template #title="{ name, id }">
        <a-dropdown
          :trigger="['contextmenu']"
          :overlayClassName="`plot-type-menu plot-type-menu-${id}`"
          :getPopupContainer="node => getPopupContainer(node, id)"
        >
          <span>{{ name }}</span>
          <template #overlay>
            <a-menu @click="({ key: menuKey }) => onContextMenuClick(menuKey)">
              <a-menu-item v-for="{ name, type } in plotTypeData" :key="type">{{ name }}</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </template>
    </tree>
  </modal>
</template>
<script>
import { defineComponent, ref, watch } from 'vue'
import { Tree, Dropdown, Menu } from 'ant-design-vue'
import modal from './modal'
const data = [
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
const plotTypeData = [
  {
    name: '点',
    type: 'Pin'
  },
  {
    name: '圆',
    type: 'GeoCircle'
  },
  {
    name: '矩形',
    type: 'GeoRectangle'
  },
  {
    name: '多边形',
    type: 'GeoPolygon'
  },
  {
    name: '平滑多边形',
    type: 'GeoSmoothPolygon'
  }
]
export default defineComponent({
  setup(props, context) {
    const selectedKeys = ref([])
    const treeData = ref(data)
    watch(selectedKeys, () => {
      console.log('selectedKeys', selectedKeys)
    })
    const renderPin = (key, option) => {
      console.log(key, option)
      const {
        node: { children, id, content, name }
      } = option
      if (children && children.length) {
        // 不能这样判断 只有信息节点可以创建场景信息 应该判断是否为信息节点
        return
      }
      context.emit('renderPin', {
        id,
        content,
        name
      })
    }
    const deleteCurrNode = () => {
      console.log('deleteCurrNode')
      // 递归查找selectedKeys节点信息 然后删除
    }
    const onContextMenuClick = menuKey => {
      console.log(menuKey)
      context.emit('unbindPin') // 解决先点击节点，然后再右键创建标绘图形bug
      if (menuKey === 'Pin') {
        context.emit('renderPin')
      } else {
        context.emit('renderArea', menuKey, (plotTypeData.find(({ type }) => type === menuKey) || {}).name)
      }
    }
    const getPopupContainer = (triggerNode, id) => {
      // return triggerNode.parentNode
      console.log('----getPopupContainer-----', triggerNode, id)
      setTimeout(() => {
        try {
          const dropdown = document.getElementsByClassName(`plot-type-menu-${id}`)[0]
          const parent = dropdown.parentNode.parentNode // 父节点
          parent.style.zIndex = '999999'
        } catch (e) {
          console.log(e)
        }
      })
      return document.body
    }
    return {
      treeData,
      selectedKeys,
      plotTypeData,
      renderPin,
      onContextMenuClick,
      getPopupContainer,
      deleteCurrNode
    }
  },
  components: {
    Tree,
    modal,
    ADropdown: Dropdown,
    AMenu: Menu,
    AMenuItem: Menu.Item
  }
})
</script>
<style scoped lang="scss">
.tree-box {
  left: 18px;
  top: 300px;
  width: 294px;
  background-color: rgba(71, 71, 71, 0.8);
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
