<template>
  <div style="width: 100%; height: 100%">
    <div ref="earthContainer" style="width: 100%; height: 100%"></div>
    <div
      class="box"
      style="position: absolute; left: 18px; top: 18px; color: white; background: rgba(0, 0, 0, 0.6); padding: 20px; border-radius: 25px;min-width:200px; font-size:24px; font-family: 宋体;"
    >
      <div
        class="defultbtn"
        :class="{ btnon: creating }"
        @click="creating = !creating"
      >
        拾取
      </div>
      <div
        class="defultbtn"
        style="margin-left:20px;"
        :class="{ btnon: editing }"
        @click="editing = !editing"
      >
        编辑
      </div>
      <br />
      <span>经度：{{ numFilter2(position[0]) }}°</span>
      <span>纬度：{{ numFilter2(position[1]) }}°</span>
      <span>高度：{{ numFilter(position[2]) }}m</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      _earth: undefined, // 注意：Earth和Cesium的相关变量放在vue中，必须使用下划线作为前缀！
      creating: false,
      // 是否处于编辑状态
      // 设置为true以后，将进入重新创建的状态；此时可以使用鼠标左键在三维窗口中选取需要修改路径的关键点，当点击鼠标右键，则表示编辑完成。此时该属性会自动变成false。
      editing: false,
      position: [0, 0, 0],
    };
  },
  methods: {
    numFilter(value) {
      // 截取当前数据到小数点后两位
      let realVal = parseFloat(value).toFixed(2);
      return realVal;
    },
    numFilter2(value) {
      // 截取当前数据到小数点后五位
      let realVal = parseFloat(value).toFixed(5);
      return realVal;
    },
    init() {
      // 1.1.1 创建地球
      var earth = new XE.Earth(this.$refs.earthContainer);
      earth.interaction.picking.enabled = true;

      // 1.1.2 场景配置
      earth.sceneTree.root = {
        expand: true,
        title: "预览场景",
        children: [
          {
            ref: "tileset",
            czmObject: {
              name: "大雁塔",
              xbsjType: "Tileset",
              url: "http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json",
              xbsjUseOriginTransform: false,
              skipLevelOfDetail: false,
            },
          },
          {
            ref: "pin1",
            czmObject: {
              name: "Pin1",
              xbsjType: "Pin",
              near: 100,
            },
          },
          {
            czmObject: {
              name: "默认影像",
              xbsjType: "Imagery",
              xbsjImageryProvider: XE.Obj.Imagery.defaultImageryProviderConfig,
            },
          },
        ],
      };

      var tileset = earth.sceneTree.$refs.tileset.czmObject;
      var pin1 = earth.sceneTree.$refs.pin1.czmObject;
      // 飞入大雁塔
      tileset.flyTo();

      // 1.1.5 数据绑定
      this._creatingUnbind = XE.MVVM.bind(this, "creating", pin1, "creating");
      this._editingUnbind = XE.MVVM.bind(this, "editing", pin1, "editing");
      this._positionUnbind = XE.MVVM.bindPosition(
        this,
        "position",
        pin1,
        "position",
      );

      // 设置初始值
      pin1.position = [
        1.9016974701882112,
        0.5972325152147303,
        425.8641913624607,
      ];

      this._earth = earth;

      // only for Debug
      window.earth = earth;
      window.pin1 = pin1;
      window.tileset = tileset;
    },
    colorchange(event) {
      var color = event.target.value;
      this.circle.color = color.xeColor;
    },
    outlineColorchange(event) {
      var outlineColor = event.target.value;
      this.circle.outlineColor = outlineColor.xeColor;
    },
  },
  mounted() {
    XE.ready()
      .then(() => {
        // 加载标绘插件
        return XE.HTML.loadJS(
          "/XbsjEarth-Plugins/plottingSymbol/plottingSymbol.js",
        );
      })
      .then(() => {
        this.init();
      });
  },
  beforeUnmount() {
    // vue程序销毁时，需要清理相关资源
    this._creatingUnbind = this._creatingUnbind && this._creatingUnbind();
    this._editingUnbind = this._editingUnbind && this._editingUnbind();
    this._positionUnbind = this._positionUnbind && this._positionUnbind();
    this._earth = this._earth && this._earth.destroy();
  },
};
</script>
<style scoped>
.box span {
  display: block;
  margin-top: 10px;
}

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
}

.defultbtn:hover {
  background-color: #b3daf8;
}

.btnon {
  background-color: #1e9fff;
  color: #fff;
  border: 1px solid #1e9fff;
}
</style>
