<template>
  <div class="top">
    <ul>
      <li v-for="({ name, children }, index) in navData" :key="index">
        <span>{{ name }}</span>
        <ul>
          <li @click="handleItem(type)" v-for="({ name, type }, index) in children" :key="index">
            <span :class="{'type-actived': type === currentType}">{{ name }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { nextTick, reactive, ref } from 'vue'
const emit = defineEmits(['renderArea'])
  nextTick(() => {
})
const currentType = ref()
const navData = reactive([
  {
    name: '标绘',
    children: [
      {
        name: '圆',
        type: 'GeoCircle'
      },
      {
        name: '矩形',
        type: 'GeoRectangle'
      },
      {
        name: '多边形',
        type: 'Polygon'
      },
      {
        name: '平滑多边形',
        type: 'GeoSmoothPolygon'
      }
    ]
  },
  {
    name: '其他',
    children: [
      {
        name: '其他1',
        type: 'circle'
      },
      {
        name: '其他2',
        type: 'circle'
      },
    ]
  }
])

const handleItem = (type) =>{
  console.log(type)
  currentType.value = type
  emit('renderArea', type)
}
</script>
<style scoped lang="scss">
ul,
li {
  margin: 0;
  cursor: pointer;
  list-style-type: none;
  padding: 0;
}
.top {
  width: 100%;
  margin-left: 0;
  background: #474747;
  position: fixed;
  top: 0;
  z-index: 9;
  span {
    color: white;
    text-align: left;
  }
  > ul {
    padding-left: 10px;
    > li:hover {
      background-color: #6b6b6b;
    }
    > li {
      float: left;
      position: relative;
      text-align: left;
      height: 40px;
      line-height: 40px;
      padding: 0 10px;
      ul {
        width: 100%;
        background: #6b6b6b;
        position: fixed;
        padding-left: 10px;
        left: 0;
        top: 40px;
        display: none;
        li {
          height: 40px;
          line-height: 40px;
          > span {
            padding: 10px;
          }
          > span:hover, .type-actived {
            color: cyan;
          }
        }
      }
    }
  }
}
.top ul li:first-child {
  background-color: #6b6b6b;
}
.top ul li:first-child ul {
  display: flex;
}
.top ul li:hover ul {
  /* 鼠标选中二级菜单内容时 */
  display: flex;
}
</style>
