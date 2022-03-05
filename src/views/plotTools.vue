<template>
  <div style="width: 100%; height: 100%">
    <div ref="earthContainer" style="width: 100%; height: 100%"></div>
    <ent-select />
    <menu-nav v-if="false" @renderPin="renderPin" @renderArea="renderArea" />
    <geo-area-plot :areaName="areaName" v-if="isPlotArea" :areaType="areaType" :_earth="_earth" :key="sceneAreaKey" />
    <pin-plot v-if="isPlotPin" :_earth="_earth" :key="scenePinKey" ref="pinPlot" />
    <!-- 不能提前放置，否则区域、点弹窗无法拖动 -->
    <info-tree @renderPin="renderPin" @renderArea="renderArea" @unbindPin="unbindPin" />
  </div>
</template>
<script>
import { defineComponent } from 'vue'

import menuNav from '../components/nav.vue'
import geoAreaPlot from '../components/area/geoAreaPlot.vue'
import pinPlot from '../components/pin/pinPlot.vue'
import infoTree from '../components/infoTree.vue'
import entSelect from '@/components/entSelect.vue'
export default defineComponent({
  data() {
    return {
      _earth: undefined, // 注意：Earth和Cesium的相关变量放在vue中，必须使用下划线作为前缀！
      scenePinKey: 0,
      sceneAreaKey: 0,
      areaType: undefined,
      areaName: undefined,
      isPlotArea: false,
      isPlotPin: false
    }
  },
  components: {
    menuNav,
    geoAreaPlot,
    pinPlot,
    infoTree,
    entSelect
  },
  methods: {
    unbindPin() {
      this.$refs.pinPlot.unbind()
    },
    // 绘制多个点 就多次调用这个 通过更新key
    // 如果想要多个点的弹窗同时出现 就用v-for生成组件 而不是用更新key
    renderPin() {
      console.log('renderPin')
      this.scenePinKey = this.scenePinKey + 1
      this.isPlotPin = true
    },
    // 绘制多个区域图形 就多次调用这个 通过更新key
    // 如果想要多个区域图形的弹窗同时出现 就用v-for生成组件 而不是用更新key
    renderArea(type, name) {
      console.log('renderArea')
      this.sceneAreaKey = this.sceneAreaKey + 1
      this.areaType = type
      this.areaName = name
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
      const tileset = earth.sceneTree.$refs.tileset.czmObject
      // 飞入大雁塔
      tileset.flyTo()
      this._earth = earth

      // only for Debug
      window.earth = earth

      window.tileset = tileset
    }
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
