<template>
  <areaModal
    v-model:open="open"
    v-model:creating="creating"
    v-model:editing="editing"
    v-model:outlineShow="outlineShow"
    v-model:ground="ground"
    v-model:outlineWidth="outlineWidth"
    v-model:colors="colors"
    @colorChange="colorChange"
  />
</template>

<script>
import areaModal from './areaModal.vue'
import { generator } from '@/utils/methods'
export default {
  data() {
    return {
      open: false,
      creating: false, // 创建
      editing: false, // 编辑
      outlineShow: true, // 边框显示
      ground: true, // 贴地
      outlineWidth: 5, // 宽度
      colors: [0, 0, 0, 0],
      _area: undefined
    }
  },
  props: {
    _earth: {
      required: true
    },
    areaType: {
      type: String,
      required: true
    }
  },
  components: {
    areaModal
  },
  mounted() {
    console.log('绘制区域', this._earth)
    this.renderArea()
  },
  methods: {
    colorChange(color, type) {
      this._area[type] = color
    },
    renderArea(id = generator.randomNum) {
      this.unbind()
      const czmObject = {
        ref: id,
        czmObject: {
          xbsjType: this.areaType,
          positions: []
        }
      }
      const earth = this._earth
      earth.sceneTree.root.children.push(czmObject)
      const area = earth.sceneTree.$refs[id].czmObject
      // 1.1.5 数据绑定
      this._creatingUnbind = XE.MVVM.bind(this, 'creating', area, 'creating')
      this._editingUnbind = XE.MVVM.bind(this, 'editing', area, 'editing')
      this._outlineShowUnbind = XE.MVVM.bind(this, 'outlineShow', area, 'outlineShow')
      this._groundUnbind = XE.MVVM.bind(this, 'ground', area, 'ground')
      this._outlineWidthUnbind = XE.MVVM.bind(this, 'outlineWidth', area, 'outlineWidth')
      this._colorsUnbind = XE.MVVM.bind(this, 'colors', area, 'color')
      XE.MVVM.watch(area, 'creating', () => {
        console.log('creating发生变化：' + this.creating)
        if (!this.creating) {
          this.open = true
          console.log('打开面板')
        }
      })
      area.onclick = () => {
        console.log('区域的点击事件！')
        this.open = true
      }
      this.creating = !this.creating
      this._area = area
      // only for Debug
      window.area = area
    },
    unbind() {
      this._creatingUnbind = this._creatingUnbind && this._creatingUnbind()
      this._editingUnbind = this._editingUnbind && this._editingUnbind()
      this._outlineShowUnbind = this._outlineShowUnbind && this._outlineShowUnbind()
      this._groundUnbind = this._groundUnbind && this._groundUnbind()
      this._outlineWidthUnbind = this._outlineWidthUnbind && this._outlineWidthUnbind()
      this._colorsUnbind = this._colorsUnbind && this._colorsUnbind()
    }
  },
  // 1.2 资源销毁
  beforeUnmount() {
    // vue程序销毁时，需要清理相关资源
    this.unbind()
  }
}
</script>
