<template>
  <pinModal v-model:open="open" v-model:creating="creating" v-model:editing="editing" v-model:position="position" />
</template>

<script>
import pinModal from './pinModal.vue'
import { generator } from '@/utils/methods'
export default {
  data() {
    return {
      open: false,
      creating: false, // 创建
      editing: false, // 编辑
      position: [0, 0, 0]
    }
  },
  props: {
    _earth: {
      required: true
    }
  },
  components: {
    pinModal
  },
  mounted() {
    console.log('renderPin', this._earth)
    this.renderPin()
  },
  methods: {
    renderPin(id = generator.randomNum) {
      console.log('renderPin')
      this.unbind()

      const czmObject = {
        ref: id,
        czmObject: {
          name: id,
          xbsjType: 'Pin',
          near: 100,
          position: []
        }
      }
      const earth = this._earth // 利用浅拷贝
      earth.sceneTree.root.children.push(czmObject)
      const pin = earth.sceneTree.$refs[id].czmObject
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
      pin.onclick = () => {
        console.log('点的点击事件！')
        this.open = true
      }
      this.creating = !this.creating

      window.pin = pin
    },
    unbind() {
      this._creatingUnbind = this._creatingUnbind && this._creatingUnbind()
      this._editingUnbind = this._editingUnbind && this._editingUnbind()
      this._positionUnbind = this._positionUnbind && this._positionUnbind()
    }
  },
  // 1.2 资源销毁
  beforeUnmount() {
    // vue程序销毁时，需要清理相关资源
    this.unbind()
  }
}
</script>
