<template> 
  <div id="main">
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {
    XbsjEarthUI.create("main").then((earthUI) => {
      console.log('earthUI', earthUI)
      //隐藏主工具栏
      earthUI.controls.mainBar.show = true;

      //隐藏图层管理
      earthUI.tools.sceneTree.show = false;
      // only for Debug
      window.uia = earthUI;
    });
  },
};
</script>
