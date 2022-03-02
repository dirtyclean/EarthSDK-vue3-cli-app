<template>
  <div class="modal-box" :style="style" v-if="open">
    <CloseOutlined class="modal-close" @click="closeModal" />
    <div class="modal-title">{{ title }}</div>
    <div class="modal-content">
      <slot />
    </div>
  </div>
</template>
<script>
import { defineComponent, nextTick } from 'vue'
import Draggabilly from 'draggabilly'
import { CloseOutlined } from '@ant-design/icons-vue'
export default defineComponent({
  props: {
    title: {
      type: String,
      default: '标题'
    },
    style: {
      type: Object,
      default: () => ({
        width: '300px'
      })
    },
    open: {
      type: Boolean,
      default: false,
      required: true
    }
  },
  components: {
    CloseOutlined
  },
  setup() {},
  methods: {
    closeModal() {
      // open = false
      console.log('closeModal')
    }
  },
  watch: {
    open() {
      console.log('open')
      nextTick(() => {
        new Draggabilly(document.querySelector('.modal-box'), {
          // 选项...
          handle: '.modal-title',
          containment: '#app'
        })
      })
    }
  },
  mounted() {}
})
</script>
<style scoped lang="scss">
.modal-box {
  position: absolute;
  right: 18px;
  top: 300px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  .modal-title {
    padding: 10px;
    color: #fff;
    font-weight: 600;
    border-bottom: 5px solid #000;
    margin-bottom: 10px;
    cursor: move;
    font-size: 18px
  }
  .modal-content {
    padding: 20px;
  }
  .modal-close {
    position: absolute;
    top: 10px;
    right: 10px;
    color: #fff;
    font-size: 20px;
    cursor: pointer;
  }
}
/deep/.ant-form-item-label > label {
  color: #fff;
}
/deep/.ant-input {
  background-color: rgba(0,0,0,.5);
  border: none;
  color: #fff;
  border-radius: 6px
}
/deep/.ant-form-item-has-error :not(.ant-input-disabled):not(.ant-input-borderless).ant-input {
  background-color: rgba(0,0,0,.5);
  border: none;
  color: #fff;
  border-radius: 6px
}
/deep/.ant-form-item-explain.ant-form-item-explain-error {
  text-align: left;
}
/deep/ .ant-checkbox-wrapper {
  color: #fff
}
</style>
