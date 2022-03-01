<template>
  <modal title="点">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 16 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-row :gutter="10">
        <a-col :span="24" >
          <a-form-item label="名称" name="name" :rules="[{ required: true, message: '请输入名称!' }]">
            <a-input v-model:value="formState.name" placeholder="请输入名称" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="8" >
          <a-form-item
            label="位置"
            placeholder=""
            name="position[0]"
            :rules="[{ required: true, message: '请输入位置信息!' }]"
          >
            <a-input v-model:value="formState.position[0]" placeholder="请输入名称" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="8" >
          <a-form-item
            label=""
            placeholder=""
            name="position[1]"
            :rules="[{ required: true, message: '请输入位置信息!' }]"
          >
            <a-input v-model:value="formState.position[1]" placeholder="请输入名称" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="8" >
          <a-form-item
            label=""
            placeholder=""
            name="position[2]"
            :rules="[{ required: true, message: '请输入位置信息!' }]"
          >
            <a-input v-model:value="formState.position[2]" placeholder="请输入名称" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="24" >
          <a-form-item label="内容" name="content" :rules="[{ required: true, message: '请输入内容!' }]">
            <a-textarea
              v-model:value="formState.content"
              placeholder="请输入内容"
              :auto-size="{ minRows: 2, maxRows: 5 }"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item :wrapper-col="{ offset: 8, span: 16 }">
        <a-button type="primary" html-type="submit">保存</a-button>
      </a-form-item>
    </a-form>
  </modal>
</template>
<script>
import { Form, Input, Button } from 'ant-design-vue'
import modal from './modal'
import { defineComponent, reactive } from 'vue'
export default defineComponent({
  components: {
    AForm: Form,
    AFormItem: Form.Item,
    AInput: Input,
    AButton: Button,
    modal
  },
  setup() {
    const formState = reactive({
      name: '',
      position: [],
      content: ''
    })

    const onFinish = values => {
      console.log('Success:', values)
    }

    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo)
    }

    return {
      formState,
      onFinish,
      onFinishFailed
    }
  }
})
</script>
<style scoped lang="scss">
.ant-form-item-label > label {
  color: #fff;
}
</style>
