<template>
  <pinModal
    v-model:open="open"
    v-model:creating="creating"
    v-model:editing="editing"
    v-model:position="position"
    v-model:name="name"
    v-model:content="content"
    @operateEmit="operateEmit"
  />
</template>

<script>
import pinModal from './pinModal.vue'
import { generator } from '@/utils/methods'
const defaultConfig = {
  creating: false, // 创建
  editing: false, // 编辑
  position: [0, 0, 0]
}
export default {
  data() {
    const { name, content, id } = this.currNodeOption
    return {
      open: false,
      ...defaultConfig,
      name,
      content,
      id
    }
  },
  props: {
    _earth: {
      required: true
    },
    currNodeOption: {
      required: true,
      dafault: () => {
        return {}
      },
      type: Object
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
    operateEmit(type) {
      if (type === 'saveSuccess') {
        console.log('保存成功之后删除节点信息')
        this.$emit('deleteCurrNode')
      } else if (type === 'close') {
      }
    },
    renderPin(id = generator.randomNum) {
      console.log('renderPin')
      this.unbind()

      const czmObject = {
        ref: id,
        czmObject: {
          name: id,
          xbsjType: 'Pin',
          near: 100,
          ...defaultConfig
        }
      }
      const earth = this._earth
      // 利用浅拷贝 去添加场景
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
