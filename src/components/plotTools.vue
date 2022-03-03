<template>
  <div style="width: 100%; height: 100%">
    <menu-nav @renderArea="renderArea" />
    <GeoArea v-if="isPlotArea" :areaType="areaType" :_earth="_earth" :key="areaKey" />
    <div ref="earthContainer" style="width: 100%; height: 100%"></div>
    <div
      class="box"
      style="
        position: absolute;
        right: 18px;
        bottom: 18px;
        color: white;
        background: rgba(0, 0, 0, 0.6);
        padding: 20px;
        border-radius: 25px;
        min-width: 200px;
        font-size: 24px;
        font-family: 宋体;
      "
    >
      <div class="defultbtn" :class="{ btnon: creating }" @click="renderPoint('pin1')">拾取1</div>
      <div class="defultbtn" :class="{ btnon: creating }" @click="renderPoint('pin2')">拾取2</div>
      <div class="defultbtn" style="margin-left: 20px" :class="{ btnon: editing }" @click="editing = !editing">
        编辑
      </div>
      <br />
      <span>经度：{{ numFilter2(position[0]) }}°</span>
      <span>纬度：{{ numFilter2(position[1]) }}°</span>
      <span>高度：{{ numFilter(position[2]) }}m</span>
    </div>
    <div class="tree-box">
      <tree
        v-model:selectedKeys="selectedKeys"
        v-model:checkedKeys="checkedKeys"
        default-expand-all
        checkable
        :height="500"
        :tree-data="treeData"
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
import pinModal from './pinModal'

import menuNav from './nav.vue'
import GeoArea from './geoArea.vue'
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
      creating: false,
      // 是否处于编辑状态
      // 设置为true以后，将进入重新创建的状态；此时可以使用鼠标左键在三维窗口中选取需要修改路径的关键点，当点击鼠标右键，则表示编辑完成。此时该属性会自动变成false。
      editing: false,
      position: [0, 0, 0],
      open: false,
      areaKey: 0,
      areaType: undefined,
      isPlotArea: false
    }
  },
  components: {
    Tree,
    pinModal,
    menuNav,
    GeoArea
  },
  methods: {
    renderArea(type) {
      console.log(type, '==renderArea')
      this.areaKey = this.areaKey + 1
      this.areaType = type
      this.isPlotArea = true
    },
    numFilter(value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2)
      return realVal
    },
    numFilter2(value) {
      // 截取当前数据到小数点后五位
      let realVal = parseFloat(value).toFixed(5)
      return realVal
    },
    unbind() {
      this._creatingUnbind = this._creatingUnbind && this._creatingUnbind()
      this._editingUnbind = this._editingUnbind && this._editingUnbind()
      this._positionUnbind = this._positionUnbind && this._positionUnbind()
    },
    renderPoint(id) {
      this.unbind()

      const czmObject = {
        ref: id,
        czmObject: {
          name: id,
          xbsjType: 'Pin',
          near: 100
          // position: [1.9016974701882112, 0.5972325152147303, 425.8641913624607],
        }
      }
      this._earth.sceneTree.root.children.push(czmObject)
      console.log(this._earth.sceneTree.root.children, '===this._earth.sceneTree.root.children===')
      let pin = this._earth.sceneTree.$refs[id].czmObject
      // 1.1.5 数据绑定
      this._creatingUnbind = XE.MVVM.bind(this, 'creating', pin, 'creating')
      this._editingUnbind = XE.MVVM.bind(this, 'editing', pin, 'editing')
      this._positionUnbind = XE.MVVM.bindPosition(this, 'position', pin, 'position')
      XE.MVVM.watch(pin.position, () => {
        console.log('positions发生变化！')
      })
      XE.MVVM.watch(pin, 'creating', () => {
        console.log('creating发生变化：' + this.creating, pin.position, pin)
        if (!this.creating) {
          this.open = true
        }
      })
      this.creating = !this.creating

      // 设置初始值
      // pin.position = [
      //   1.9016974701882112,
      //   0.5972325152147303,
      //   425.8641913624607,
      // ];
      // window.pin = pin;
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

      var tileset = earth.sceneTree.$refs.tileset.czmObject

      // 飞入大雁塔
      tileset.flyTo()

      this._earth = earth

      // only for Debug
      window.earth = earth

      window.tileset = tileset
    },
    colorchange(event) {
      var color = event.target.value
      this.circle.color = color.xeColor
    },
    outlineColorchange(event) {
      var outlineColor = event.target.value
      this.circle.outlineColor = outlineColor.xeColor
    }
  },
  mounted() {
    this.init()
  },

  beforeUnmount() {
    // vue程序销毁时，需要清理相关资源
    this.unbind()
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
