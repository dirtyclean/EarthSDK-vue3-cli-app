<template>
  <modal :title="title" :style="{ width: '600px' }" @closeModal="closeModal" :open="open">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 2 }"
      :wrapper-col="{ span: 22 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
      :colon="false"
    >
      <a-row :gutter="10">
        <a-col :span="24">
          <a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入名称!' }]">
            <a-input v-model:value="formState.name" placeholder="请输入名称" />
          </a-form-item>
          <a-form-item label=" " class="update-btn">
            <div class="defultbtn" :class="{ btnon: creating }" @click="formState.creating = !formState.creating">
              鼠标点选
            </div>
            <div
              class="defultbtn"
              style="margin-left: 20px"
              :class="{ btnon: editing }"
              @click="formState.editing = !formState.editing"
            >
              编辑
            </div>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="8">
          <a-form-item
            label="位置"
            :name="['position', 0]"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 14 }"
            :rules="[{ required: true, message: '经度!' }]"
          >
            <a-input placeholder="经度" v-model:value="formState.position[0]" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label=" "
            :name="['position', 1]"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 14 }"
            :rules="[{ required: true, message: '纬度!' }]"
          >
            <a-input placeholder="纬度" v-model:value="formState.position[1]" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label=" "
            :name="['position', 2]"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 14 }"
            :rules="[{ required: true, message: '高度!' }]"
          >
            <a-input placeholder="高度" v-model:value="formState.position[2]" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="24">
          <a-form-item label="内容" name="content" :rules="[{ required: true, message: '请输入内容!' }]">
            <a-text-area
              v-model:value="formState.content"
              placeholder="请输入内容"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <div style="float: right">
        <a-button @click="closeModal" style="margin-right: 20px">取消</a-button>
        <a-button type="primary" html-type="submit">确定</a-button>
      </div>
    </a-form>
  </modal>
</template>
<script>
import { Form, Input, Button, Row, Col } from 'ant-design-vue'
import modal from '../modal'
import { defineComponent, reactive } from 'vue'
import { useVModel } from '@/utils/useVModel.js'
const { TextArea } = Input
export default defineComponent({
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    AButton: Button,
    ATextArea: TextArea,
    ARow: Row,
    ACol: Col,
    modal
  },
  emits: ['update:creating', 'update:editing', 'update:position', 'operateEmit'],
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true
    },
    title: {
      type: String,
      default: '点'
    },
    creating: {
      type: Boolean,
      default: false
    },
    editing: {
      type: Boolean,
      default: false
    },
    position: {
      type: Array,
      default: () => [0, 0, 0]
    },
    name: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  setup(props, context) {
    const formState = reactive({
      creating: useVModel(props, 'creating'), // 创建
      editing: useVModel(props, 'editing'), // 编辑
      position: useVModel(props, 'position'),
      name: useVModel(props, 'name'),
      content: useVModel(props, 'content')
    })

    const onFinish = values => {
      console.log('Success:', values)
      context.emit('operateEmit', 'saveSuccess')
    }

    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo)
    }
    const closeModal = () => {
      context.emit('update:open', false)
    }
    const numFilter = value => {
      // 截取当前数据到小数点后两位
      const realVal = parseFloat(value).toFixed(2)
      return realVal
    }
    const numFilter2 = value => {
      // 截取当前数据到小数点后五位
      const realVal = parseFloat(value).toFixed(5)
      return realVal
    }
    return {
      formState,
      onFinish,
      onFinishFailed,
      closeModal,
      numFilter,
      numFilter2
    }
  }
})
</script>
<style scoped lang="scss"></style>
