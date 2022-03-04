<template>
  <div class="top">
    <ul>
      <li
        :class="{ 'menu-actived': name === currentMenu }"
        v-for="({ name, children }, index) in navData"
        :key="index"
        @click="handleMenu(name, $event)"
      >
        <span>{{ name }}</span>
        <ul :class="{ flex: name === currentMenu }">
          <li @click="handleType(type, name)" v-for="({ name, type }, index) in children" :key="index">
            <span :class="{ 'type-actived': type === currentType }">{{ name }}</span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
<script setup>
import { nextTick, reactive, ref } from 'vue'
const emit = defineEmits(['renderArea'])
nextTick(() => {})
const currentMenu = ref('标绘')
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
        type: 'GeoPolygon'
      },
      {
        name: '平滑多边形',
        type: 'GeoSmoothPolygon'
      }
    ]
  },
])
const handleMenu = name => {
  console.log('name', name)
  currentMenu.value = name
}
const handleType = (type, name) => {
  currentType.value = type
  emit('renderArea', type, name)
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
    padding-left: 20px;
    > li:hover {
      background-color: #6b6b6b;
    }
    > li {
      float: left;
      position: relative;
      text-align: left;
      height: 50px;
      line-height: 50px;
      padding: 0 15px;

      ul {
        width: 100%;
        background: #6b6b6b;
        position: fixed;
        padding-left: 20px;
        left: 0;
        top: 50px;
        display: none;
        li {
          height: 50px;
          line-height: 50px;
          > span {
            padding: 10px 15px;
          }
          > span:hover,
          .type-actived {
            color: cyan;
          }
        }
      }
    }
  }
}
.flex {
  display: flex !important;
}
.menu-actived {
  background-color: #6b6b6b;
}
</style>
