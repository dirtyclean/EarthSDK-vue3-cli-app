<template>
  <!-- <div v-if="open" class="modal-mask"> -->
  <div class="modal-box" :style="style" v-if="open">
    <CloseOutlined v-if="showCloseIcon" class="modal-close" @click="closeModal" />
    <div class="modal-title">{{ title }}</div>
    <div class="modal-content">
      <slot />
    </div>
  </div>
  <!-- </div> -->
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
    },
    showCloseIcon: {
      type: Boolean,
      default: true,
      required: false
    }
  },
  components: {
    CloseOutlined
  },
  setup() {},
  methods: {
    closeModal() {
      this.$emit('closeModal')
    }
  },
  watch: {
    open: {
      immediate: true,
      handler(open) {
        console.log('监听open---', open)
        if (open) {
          nextTick(() => {
            const draggabilly = new Draggabilly(document.querySelector('.modal-box'), {
              // 选项...
              handle: '.modal-title',
              containment: '#app'
            })
          })
        }
      }
    }
  },
  mounted() {
    console.log('Modal')
  }
})
</script>
<style scoped lang="scss">
.modal-mask {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 999;
}
.modal-box {
  position: absolute;
  right: 18px;
  top: 300px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  z-index: 9999;
  .modal-title {
    padding: 10px;
    color: #fff;
    font-weight: 600;
    border-bottom: 4px solid rgba(0, 0, 0, 0.4);
    margin-bottom: 10px;
    cursor: move;
    font-size: 18px;
  }
  .modal-content {
    margin: 0;
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
:deep(.ant-form-item-label > label) {
  color: #fff;
}
:deep(.ant-input) {
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: #fff;
  border-radius: 6px;
}
:deep(.ant-form-item-has-error :not(.ant-input-disabled):not(.ant-input-borderless).ant-input) {
  background-color: rgba(0, 0, 0, 0.5);
  border: none;
  color: #fff;
  border-radius: 6px;
}
:deep(.ant-form-item-explain.ant-form-item-explain-error) {
  text-align: left;
}
:deep(.ant-checkbox-wrapper) {
  color: #fff;
}
:deep(.ant-form-item-control-input-content) {
  display: flex;
  align-items: center;
}
:deep(.update-btn) {
  display: flex;
  justify-content: left;
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
    margin-bottom: 4px;
  }

  .defultbtn:hover {
    background-color: #b3daf8;
  }

  .btnon {
    background-color: #1e9fff;
    color: #fff;
    border: 1px solid #1e9fff;
  }
}
</style>
