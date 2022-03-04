<template>
  <modal :title="title" :style="{ width: '600px' }" @closeModal="closeModal" :open="open">
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
          <a-form-item label=" " class="update-btn">
            <div class="defultbtn" :class="{ btnon: creating }" @click="formState.creating = !formState.creating">
              创建
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
          <a-form-item label="填充颜色">
            <input class="colorbox" type="color" :value="defaultColor" @input="fillColorChange" />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="24">
          <a-form-item label="填充不透明度" :name="['color', 3]" class="form-progress">
            <input type="range" min="0" max="1" step="0.1" v-model.number="formState.color[3]" />
            <span>{{ formState.color[3] }}</span>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :gutter="10">
        <a-col :span="24">
          <a-form-item label="边框颜色">
            <input class="colorbox" type="color" :value="defaultOutlineColor" @input="outlineColorChange" />
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
    modal,
    ACheckbox: Checkbox
  },
  emits: [
    'update:creating',
    'update:editing',
    'update:outlineShow',
    'update:ground',
    'update:outlineWidth',
    'update:color',
    'update:outlineColor'
  ],
  props: {
    open: {
      type: Boolean,
      default: false,
      required: true
    },
    title: {
      type: String,
      default: '区域'
    },
    creating: {
      type: Boolean,
      default: false
    },
    editing: {
      type: Boolean,
      default: false
    },
    outlineShow: {
      type: Boolean,
      default: true
    },
    ground: {
      type: Boolean,
      default: true
    },
    outlineWidth: {
      type: Number,
      default: 5
    },
    outlineColor: {
      type: Array,
      default: () => [0, 0, 0, 0]
    },
    color: {
      type: Array,
      default: () => [0, 0, 0, 0]
    },
    defaultColor: {
      type: String,
      default: ''
    },
    defaultOutlineColor: {
      type: String,
      default: ''
    }
  },
  mounted() {
    console.log('areaModal')
  },
  methods: {
    fillColorChange(event) {
      const color = event.target.value
      this.$emit('update:color', color.xeColor)
    },
    outlineColorChange(event) {
      const outlineColor = event.target.value
      this.$emit('update:outlineColor', outlineColor.xeColor)
    }
  },
  setup(props, context) {
    const formState = reactive({
      creating: useVModel(props, 'creating'), // 创建
      editing: useVModel(props, 'editing'), // 编辑
      outlineShow: useVModel(props, 'outlineShow'), // 边框显示
      ground: useVModel(props, 'ground'), // 贴地
      outlineWidth: useVModel(props, 'outlineWidth'), // 宽度
      color: useVModel(props, 'color'),
      outlineColor: useVModel(props, 'outlineColor'),
      name: '',
      content: ''
    })
    const onFinish = values => {
      const { creating, editing, outlineShow, ground, outlineWidth, color, outlineColor, name, content } = formState
      console.log(
        'Success:',
        values,
        formState,
        creating,
        editing,
        outlineShow,
        ground,
        outlineWidth,
        color,
        outlineColor,
        name,
        content
      )
    }

    const onFinishFailed = errorInfo => {
      console.log('Failed:', errorInfo)
    }
    const closeModal = () => {
      context.emit('update:open', false)
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
</style>
