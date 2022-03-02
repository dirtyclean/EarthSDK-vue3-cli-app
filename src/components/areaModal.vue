<template>
  <modal :title="title" :style="{ width: '600px' }" :open="open">
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
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
          <a-form-item  label=" " class="update-btn">
            <div class="defultbtn" :class="{ btnon: creating }" @click="creating = !creating">创建</div>
            <div class="defultbtn" style="margin-left: 20px" :class="{ btnon: editing }" @click="editing = !editing">
              编辑
            </div>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="12">
          <a-form-item label=" " name="outlineShow" :label-col="{ span: 8 }" :wrapper-col="{ span: 10 }">
            <a-checkbox v-model:checked="formState.outlineShow">圆边框显隐</a-checkbox>
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label=" " name="ground" :label-col="{ span: 8 }" :wrapper-col="{ span: 10 }">
            <a-checkbox v-model:checked="formState.ground">是否贴地</a-checkbox>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="24">
          <a-form-item label="边框宽度" name="outlineWidth" class="form-progress">
            <input type="range" min="0" max="100" step="1" v-model.number="formState.outlineWidth" />
            <span>{{ formState.outlineWidth }}像素</span>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="24">
          <a-form-item label="填充颜色" name="content">
            <input class="colorbox" type="color" value="#00ff40" @input="colorchange(event)" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="24">
          <a-form-item label="填充不透明度" name="colors[3]" class="form-progress">
            <input type="range" min="0" max="1" step="0.1" v-model.number="formState.colors[3]" />
            <span>{{ formState.colors[3] }}</span>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="24">
          <a-form-item label="边框颜色" name="colors[3]">
            <input class="colorbox" type="color" value="#00ff40" @input="outlineColorchange(event)" />
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
import { Form, Input, Button, Row, Col, Checkbox } from 'ant-design-vue'
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
    modal,
    ACheckbox: Checkbox
  },
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true
    },
    title: {
      type: String,
      default: '区域'
    }
  },
  methods: {
    colorchange(event) {
      var color = event.target.value
      // circle.color = color.xeColor
    },
    outlineColorchange(event) {
      var outlineColor = event.target.value
      // circle.outlineColor = outlineColor.xeColor
    }
  },
  setup() {
    const formState = reactive({
      outlineShow: true, //边框显示
      ground: true, // 贴地
      outlineWidth: 5, // 宽度
      colors: [0, 0, 0, 0]
    })

    const onFinish = (values) => {
      console.log('Success:', values)
    }

    const onFinishFailed = (errorInfo) => {
      console.log('Failed:', errorInfo)
    }
    const closeModal = () => {
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
.form-progress {
  input {
    width: 80%;
    margin-right: 20px;
  }
  span {
    color: #fff;
  }
}
/deep/ .ant-form-item-control-input-content {
  display: flex;
  align-items: center;
}
.update-btn {
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
