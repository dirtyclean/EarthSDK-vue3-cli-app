<template>
  <div style="width: 100%; height: 100%">
    <div ref="earthContainer" style="width: 100%; height: 100%"></div>
    <menu-nav @renderArea="renderArea" />
    <geo-area-plot v-if="isPlotArea" :areaType="areaType" :_earth="_earth" :key="sceneKey" />
    <pin-plot v-if="isPlotPin" :_earth="_earth" :key="sceneKey" />

    <div class="tree-box">
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
    </div>
    <pinModal v-model:open="open" />
  </div>
</template>
<script>
import { Tree } from 'ant-design-vue'
import { defineComponent, ref, watch } from 'vue'
import pinModal from '../components/pin//pinModal'

import menuNav from '../components/nav.vue'
import geoAreaPlot from '../components/area/geoAreaPlot.vue'
import pinPlot from '../components/pin/pinPlot.vue'
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
  data() {
    return {
      _earth: undefined, // 注意：Earth和Cesium的相关变量放在vue中，必须使用下划线作为前缀！
      sceneKey: 0,
      areaType: undefined,
      isPlotArea: false,
      isPlotPin: false
    }
  },
  components: {
    Tree,
    pinModal,
    menuNav,
    geoAreaPlot,
    pinPlot
  },
  methods: {
    renderPin() {
      this.sceneKey = this.sceneKey + 1
      this.isPlotPin = true
    },
    renderArea(type) {
      this.sceneKey = this.sceneKey + 1
      this.areaType = type
      this.isPlotArea = true
    },
    init() {
      // 1.1.1 创建地球
      var earth = new XE.Earth(this.$refs.earthContainer)
      earth.interaction.picking.enabled = true

      // 1.1.2 场景配置
      earth.sceneTree.root = {
        expand: true,
        title: '预览场景',
        children: [
          {
            ref: 'tileset',
            czmObject: {
              name: '大雁塔',
              xbsjType: 'Tileset',
              url: 'http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json',
              xbsjUseOriginTransform: false,
              skipLevelOfDetail: false
            }
          },
          {
            czmObject: {
              name: '默认影像',
              xbsjType: 'Imagery',
              xbsjImageryProvider: XE.Obj.Imagery.defaultImageryProviderConfig
            }
          }
        ]
      }
      let tileset = earth.sceneTree.$refs.tileset.czmObject
      // 飞入大雁塔
      tileset.flyTo()
      this._earth = earth

      // only for Debug
      window.earth = earth

      window.tileset = tileset
    },
  },
  mounted() {
    this.init()
  },

  beforeUnmount() {
    // vue程序销毁时，需要清理相关资源
    this._earth = this._earth && this._earth.destroy()
  }
})
</script>
<style scoped lang="scss">
.tree-box {
  position: absolute;
  left: 18px;
  top: 300px;
  width: 294px;
  background: rgba(0, 0, 0, 0.6);
  padding: 20px;
  border-radius: 10px;
  /deep/.ant-tree {
    background: transparent;
    color: #fff;
  }
  /deep/.ant-tree .ant-tree-node-content-wrapper:hover {
    background-color: red;
  }
  /deep/ .ant-tree .ant-tree-node-content-wrapper.ant-tree-node-selected {
    background-color: green;
  }
}
.box span {
  display: block;
  margin-top: 10px;
}

.defultbtn {
  display: inline-block;
  text-align: center;
  min-width: 60px;
  height: 38px;
  padding: 0 10px;
  line-height: 38px;
  border-radius: 100px;
  border: 1px solid #c9c9c9;
  background-color: #fff;
  color: #555;
  cursor: pointer;
}

.defultbtn:hover {
  background-color: #b3daf8;
}

.btnon {
  background-color: #1e9fff;
  color: #fff;
  border: 1px solid #1e9fff;
}
</style>
