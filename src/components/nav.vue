<template>
  <div class="top">
    <ul>
      <li>
        <span>标绘</span>
        <ul>
          <li><span>圆</span></li>
          <li><span>矩形</span></li>
          <li><span>多边形</span></li>
          <li><span>平滑多边形</span></li>
        </ul>
      </li>
      <li>
        <span>其他</span>
        <ul>
          <li><span>1</span></li>
          <li><span>2</span></li>
          <li><span>3</span></li>
          <li><span>4</span></li>
        </ul>
      </li>
    </ul>
  </div>
</template>
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
    >li:hover {
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
        // display: flex;
        li {
          height: 40px;
          line-height: 40px;
          > span {
            padding: 10px;
          }
          > span:hover {
            color: cyan;
          }
        }
      }
    }
  }
}
.top ul li:hover ul {
  /* 鼠标选中二级菜单内容时 */
  display: flex;
}
</style>
