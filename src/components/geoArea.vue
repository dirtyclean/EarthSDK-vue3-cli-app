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
      outlineShow: true, //边框显示
      ground: true, // 贴地
      outlineWidth: 5, // 宽度
      colors: [0, 0, 0, 0],
      _circle: undefined
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
      this._circle[type] = color
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
      let circle = earth.sceneTree.$refs[id].czmObject
      // 1.1.5 数据绑定
      this._creatingUnbind = XE.MVVM.bind(this, 'creating', circle, 'creating')
      this._editingUnbind = XE.MVVM.bind(this, 'editing', circle, 'editing')
      this._outlineShowUnbind = XE.MVVM.bind(this, 'outlineShow', circle, 'outlineShow')
      this._groundUnbind = XE.MVVM.bind(this, 'ground', circle, 'ground')
      this._outlineWidthUnbind = XE.MVVM.bind(this, 'outlineWidth', circle, 'outlineWidth')
      this._colorsUnbind = XE.MVVM.bind(this, 'colors', circle, 'color')
      XE.MVVM.watch(circle, 'creating', () => {
        console.log('creating发生变化：' + this.creating)
        if (!this.creating) {
          this.open = true
          console.log('打开面板')
        }
      })
      this.creating = !this.creating
      this._circle = circle
      // only for Debug
      window.circle = circle
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
