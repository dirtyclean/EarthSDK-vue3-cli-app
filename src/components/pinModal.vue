<template>
  <modal :title="title" :style="{ width: '600px' }" :open="open">
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
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="8">
          <a-form-item
            label="位置"
            name="position[0]"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 12 }"
            :rules="[{ required: true, message: '请输入位置信息!' }]"
          >
            <a-input v-model:value="formState.position[0]" placeholder="" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label=" "
            name="position[1]"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 12 }"
            :rules="[{ required: true, message: '请输入位置信息!' }]"
          >
            <a-input v-model:value="formState.position[1]" placeholder="" />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item
            label=" "
            name="position[2]"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 12 }"
            :rules="[{ required: true, message: '请输入位置信息!' }]"
          >
            <a-input v-model:value="formState.position[2]" placeholder="" />
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
import modal from './modal'
import { defineComponent, reactive } from 'vue'
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
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true
    },
    title: {
      type: String,
      default: '点',
    }
  },
  setup() {
    const formState = reactive({
      name: '',
      position: [],
      content: ''
    })

    const onFinish = (values) => {
      console.log('Success:', values)
    }

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo)
    }
    const closeModal = () =>{
      console.log('closeModal')
    }
    return {
      formState,
      onFinish,
      onFinishFailed,
      closeModal
    }
  }
})
</script>
<style scoped lang="scss">

</style>
