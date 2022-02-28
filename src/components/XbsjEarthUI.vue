<template>
  <div id="main"></div>
</template>
<script>
export default {
  data() {
    return {};
  },
  mounted() {
    XbsjEarthUI.create("main").then((earthUI) => {
      console.log("earthUI", earthUI);
      earthUI.earth.sceneTree.root = {
        expand: true,
        title: "影像",
        children: [
          {
            expand: true,
            title: "地图",
            children: [
              {
                czmObject: {
                  xbsjType: "Imagery",
                  name: "高德地图",
                  xbsjImageryProvider: {
                    XbsjImageryProvider: {
                      url:
                        "//webrd04.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=7&x={x}&y={y}&z={z}",
                    },
                  },
                },
                enabled: true,
              },
              {
                czmObject: {
                  xbsjType: "Imagery",
                  name: "高德影像",
                  xbsjImageryProvider: {
                    XbsjImageryProvider: {
                      url:
                        "//webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
                    },
                  },
                },
                enabled: true,
              },
              {
                czmObject: {
                  xbsjType: "Imagery",
                  name: "高德影像标注",
                  xbsjImageryProvider: {
                    XbsjImageryProvider: {
                      url:
                        "//webst02.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}",
                    },
                  },
                },
                enabled: true,
              },
            ],
          },
        ],
      };
      //隐藏主工具栏
      earthUI.controls.mainBar.show = true;

      //隐藏图层管理
      earthUI.tools.sceneTree.show = true;
      // 打开影像工具栏
      earthUI.controls.mainBar.page = "imagery";
      // only for Debug
      window.uia = earthUI;
    });
  },
};
</script>
