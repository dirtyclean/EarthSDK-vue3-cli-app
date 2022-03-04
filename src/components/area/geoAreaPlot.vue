<template>
  <areaModal
    v-model:open="open"
    v-model:creating="creating"
    v-model:editing="editing"
    v-model:outlineShow="outlineShow"
    v-model:ground="ground"
    v-model:outlineWidth="outlineWidth"
    v-model:color="color"
    v-model:outlineColor="outlineColor"
    @colorChange="colorChange"
    :title="areaName"
    :defaultColor="defaultColor"
    :defaultOutlineColor="defaultOutlineColor"
  />
</template>

<script>
import areaModal from './areaModal.vue'
import { generator } from '@/utils/methods'
// 必须6位的16进制 否则input-color会显示出错
const defaultColor = '#FFB6C1'
const defaultOutlineColor = '#00BFFF'
let defaultConfig
export default {
  data() {
    defaultConfig = {
      creating: false, // 创建
      editing: false, // 编辑
      outlineShow: true, // 边框显示
      ground: true, // 贴地
      outlineWidth: 2, // 宽度
      // xeColor 是把一个字符串#000，转成 [1, 1, 1, 1]这种形式的颜色供EarthSDK使用，扩展了String的属性
      color: defaultColor.xeColor, // xeColor
      outlineColor: defaultOutlineColor.xeColor // xeColor
    }
    return {
      open: false,
      ...defaultConfig,
      _area: undefined,
      defaultColor,
      defaultOutlineColor
    }
  },
  props: {
    _earth: {
      required: true
    },
    areaType: {
      type: String,
      required: true
    },
    areaName: {
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
    renderArea(id = generator.randomNum) {
      this.unbind()
      const czmObject = {
        ref: id,
        czmObject: {
          xbsjType: this.areaType,
          positions: [],
          ...Object.assign(defaultConfig, {})
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
      this._colorUnbind = XE.MVVM.bind(this, 'color', area, 'color')
      this._outlineColorUnbind = XE.MVVM.bind(this, 'outlineColor', area, 'outlineColor')
      console.log('默认边框颜色：', area.outlineColor)
      console.log('默认填充颜色：', area.color)
      XE.MVVM.watch(area, 'creating', () => {
        console.log('creating发生变化：' + this.creating)
        if (!this.creating) {
          this.open = true
          console.log('打开面板', this.outlineWidth)
        }
      })
      XE.MVVM.watch(area, 'color', () => {
        console.log('color发生变化：' + this.color)
        console.log('填充颜色：', area.color)
      })
      XE.MVVM.watch(area, 'outlineColor', () => {
        console.log('outlineColor发生变化：' + this.outlineColor)
        console.log('边框颜色：', area.outlineColor)
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
      this._colorUnbind = this._colorUnbind && this._colorUnbind()
      this._outlineColorUnbind = this._outlineColorUnbind && this._outlineColorUnbind()
    }
  },
  // 1.2 资源销毁
  beforeUnmount() {
    // vue程序销毁时，需要清理相关资源
    this.unbind()
  }
}
</script>
