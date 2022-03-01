<template>
  <div class="modal-box">
    <div class="modal-title">{{title}}</div>
    <div class="modal-content">
      <slot />
    </div>
  </div>
</template>
<script>
import { defineComponent } from 'vue'
import Draggabilly from 'draggabilly'
export default defineComponent({
  props: {
    title: {
      type: String,
      default: '标题'
    }
  },
  setup() {
  },
  mounted() {
    new Draggabilly(document.querySelector('.modal-box'), {
      // 选项...
      handle: '.modal-title',
      containment: '#app'
    })
  }
})
</script>
<style scoped lang="scss">
.modal-box {
  position: absolute;
  right: 18px;
  top: 300px;
  width: 294px;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  .modal-title {
    padding: 10px;
    color: #fff;
    font-weight: 600;
    border-bottom: 5px solid #000;
    margin-bottom: 10px;
    cursor: move
  }
  .modal-content {
    padding: 20px
  }
}
</style>
