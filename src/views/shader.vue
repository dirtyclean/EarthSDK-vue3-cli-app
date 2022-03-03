<template>
  <div style="width: 100%; height: 100%">
    <div ref="earthContainer" style="width: 100%; height: 100%"></div>
    <div
      class="box"
      style="position: absolute; left: 18px; top: 18px; color: white; background: rgba(0, 0, 0, 0.6); padding: 20px; border-radius: 25px; font-size:24px; font-family: 宋体;"
    >
      <div class="defultbtn" @click="flyTo">定位</div>
    </div>
    <div
      class="box"
      style="position: absolute; left: 18px; top: 108px; color: white; background: rgba(0, 0, 0, 0.6); padding: 20px; border-radius: 25px;min-width:150px; font-size:24px; font-family: 宋体;"
    >
      <div class="defultbtn" @click="measureMentType = 'POINT'">位置测量</div>
      <div class="defultbtn" @click="measureMentType = 'SPACE_DISTANCE'">
        距离测量
      </div>
      <div class="defultbtn" @click="measureMentType = 'TRIANGLE_DISTANCE'">
        三角测量
      </div>
      <div class="defultbtn" @click="measureMentType = 'SPACE_AREA'">
        面积测量
      </div>
      <div class="defultbtn" @click="clearResults">清空测量结果</div>
    </div>
    <div
      class="box"
      style="position: absolute; left: 18px; top: 198px; color: white; background: rgba(0, 0, 0, 0.6); padding: 20px; border-radius: 25px;min-width:200px; font-size:24px; font-family: 宋体;"
    >
      <div class="defultbtn" :class="{ btnon: playing }" @click="handlePlay">
        扫描线播放
      </div>
      <br />
      <span @click="show = !show" class="checkbox"
        ><input class="play" type="checkbox" v-model="show" />扫描线显隐</span
      ><br />
      <span @click="loopPlay = !loopPlay" class="checkbox"
        ><input class="play" type="checkbox" v-model="loopPlay" />循环播放</span
      ><br />
      <span>持续时间: {{ timeDuration }}s</span><br /><input
        type="range"
        min="0"
        step="0.1"
        max="5"
        v-model.number="timeDuration"
      /><br />
      <span>扫描线半径: {{ radius }}m</span><br /><input
        type="range"
        min="0"
        step="1"
        max="5000"
        v-model.number="radius"
      /><br />
      <span>当前时间:</span><br /><input
        type="range"
        min="0"
        step="0.01"
        max="1"
        v-model.number="currentTime"
      /><br />
      <span>扫描线颜色：</span
      ><input
        class="colorbox"
        type="color"
        value="#ffff00"
        @input="colorchange"
      /><br />
    </div>
    <div
      class="box"
      style="position: absolute; left: 18px; top: 548px; color: white; background: rgba(0, 0, 0, 0.6); padding: 20px; border-radius: 25px; font-size:24px; font-family: 宋体;"
    >
      <div class="defultbtn" @click="renderDiv">创建div</div>
    </div>
    <div
      class="box"
      style="position: absolute; left: 18px; top: 638px; color: white; background: rgba(0, 0, 0, 0.6); padding: 20px; border-radius: 25px; font-size:24px; font-family: 宋体;"
    >
      <div class="defultbtn" @click="renderPoint">打点</div>
    </div>
    <div
      v-show="dialogShow"
      ref="dialogModel"
      style="position:absolute;left:0;top:0;width:100px;height:40px;background:black;color:white;padding:5px;font-size:14px;"
    >
      {{ content }}
    </div>
    <div
      class="box"
      style="position: absolute; left: 18px; top: 728px; color: white; background: rgba(0, 0, 0, 0.6); padding: 20px; border-radius: 25px; font-size:24px; font-family: 宋体;"
    >
      <div class="defultbtn" @click="playVideo">视频模型展示</div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      _earth: undefined, // 注意：Earth和Cesium的相关变量放在vue中，必须使用下划线作为前缀！
      _tileset: undefined,
      // 分析-测量
      measureMentType: "NONE",
      // 扫描线-播放
      playing: false,
      show: true,
      loopPlay: true,
      timeDuration: 0,
      radius: 0,
      currentTime: 0,
      // 打点
      content: "",
      dialogShow: false,
    };
  },
  // 1.1 资源加载
  mounted() {
    // 1.2.1 创建地球
    var earth = new XE.Earth(this.$refs.earthContainer);

    // 1.2.2 添加默认地球影像
    earth.sceneTree.root = {
      title: "当前场景",
      isSelected: true,
      children: [
        {
          czmObject: {
            xbsjType: "Imagery",
            enabled: true,
            name: "谷歌影像",
            show: true,
            xbsjImageryProvider: {
              XbsjImageryProvider: {
                url:
                  "//server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                maximumLevel: 14,
              },
            },
          },
        },
        {
          czmObject: {
            xbsjType: "Tileset", // 必填项
            name: "三维瓦片1x", // 可以不填写
            url: "http://earthsdk.com/v/last/Apps/assets/dayanta/tileset.json", // 必填项
            xbsjClippingPlanes: {},
            xbsjUseOriginTransform: false, //是否启用原先的状态 可以不填写
            skipLevelOfDetail: false,
            xbsjPosition: [
              // 可以不填写
              1.9016974701882112, // 经度，单位是弧度，相当于 1.9016974701882112 * 180.0 / Math.PI = 108.95923度
              0.5972325152147303, // 纬度，单位是弧度，相当于 0.5972325152147303 * 180.0 / Math.PI = 34.21890度
              425.8641913624607, // 高度，单位为米
            ],
          },
          ref: "tileset",
        },
        {
          ref: "scanline1",
          czmObject: {
            xbsjType: "Scanline",
            position: [
              1.9016974701882112,
              0.5972325152147303,
              425.8641913624607,
            ],
            playing: true,
            radius: 5000,
          },
        },
      ],
    };
    var tileset = earth.sceneTree.$refs.tileset.czmObject;
    earth.sceneTree.$refs.tileset.czmObject.flyTo();

    const context = earth.czm.scene.context;
    var t = new Cesium.Texture({
      context,
      width: 80,
      height: 80,
      flipY: false,
    });

    var imageData = new Uint8Array(80 * 80 * 4);
    imageData.fill(255);
    for (let j = 0; j < 80; ++j) {
      for (let i = 0; i < 80; ++i) {
        imageData[4 * (j * 80 + i) + 0] = (255 * i) / 79;
        imageData[4 * (j * 80 + i) + 1] = (255 * j) / 79;
        imageData[4 * (j * 80 + i) + 2] = 0;
        imageData[4 * (j * 80 + i) + 3] = 255;
      }
    }
    t.copyFrom({ arrayBufferView: imageData, width: 80, height: 80 });

    tileset.xbsjCustomTexture = t;
    tileset.xbsjCustomShader.vsHeader = "varying vec2 v_cst_st; ";
    tileset.xbsjCustomShader.vsBody =
      "v_cst_st = a_position.xy * vec2(0.01, 0.01);";
    tileset.xbsjCustomShader.fsHeader = "varying vec2 v_cst_st; ";
    // tileset.xbsjCustomShader.fsBody = 'gl_FragColor.rgba *= vec4(v_cst_st, 0.0, 1.0);';
    tileset.xbsjCustomShader.fsBody = `
      vec4 color = texture2D(u_xbsjCustomTexture, floor(v_cst_st * vec2(7.0, 7.0))/vec2(8.0, 8.0) + vec2(0.5/8.0, 0.5/8.0));
      if (all(greaterThanEqual(v_cst_st, vec2(0.0, 0.0))) && all(lessThanEqual(v_cst_st, vec2(1.0, 1.0)))) {
        gl_FragColor.rgba *= vec4(color.xyz, 1.0);
      }
    `;

    this._earth = earth;
    this._tileset = tileset;
    var tileset1 = earth.sceneTree.root.children[0].czmObject;
    var tileset2 = earth.sceneTree.root.children[1].czmObject;
    var scanline1 = earth.sceneTree.$refs.scanline1.czmObject;
    // 1.1.5 数据绑定
    // disposers 用来收集资源销毁函数，并在析构时自动调用！
    {
      this._disposers = [];
      this._disposers.push(
        XE.MVVM.bind(
          this,
          "measureMentType",
          earth.analyzation.measurement,
          "type",
        ),
      );
      tileset1.flyTo();
    }
    this._playingUnbind = XE.MVVM.bind(this, "playing", scanline1, "playing");
    this._showUnbind = XE.MVVM.bind(this, "show", scanline1, "show");
    this._loopPlayUnbind = XE.MVVM.bind(
      this,
      "loopPlay",
      scanline1,
      "loopPlay",
    );
    this._timeDurationUnbind = XE.MVVM.bind(
      this,
      "timeDuration",
      scanline1,
      "timeDuration",
    );
    this._radiusUnbind = XE.MVVM.bind(this, "radius", scanline1, "radius");
    this._currentTimeUnbind = XE.MVVM.bind(
      this,
      "currentTime",
      scanline1,
      "currentTime",
    );
    this.scanline1 = scanline1;
    // only for Debug
    window.app = this;
    window.tileset = this._tileset;
    window.earth = earth;
    window.tileset1 = tileset1;
    window.tileset2 = tileset2;
  },
  methods: {
    handlePlay() {
      this.play = !this.play;
      if (this.play) {
        // 设置相机位置
        // earth.camera.position.toString()和earth.camera.toAllJSONStr()这两个方法可获取相机位置
        // this._earth.camera.position = [
        //   2.120534085472877,
        //   0.5445599473813671,
        //   3486.259508603404,
        // ];
        // this._earth.camera.rotation = [
        //   6.283185307179578,
        //   -0.7863374047795091,
        //   1.0658141036401503e-14,
        // ];
        this._earth.camera.position = [
          1.901700101080121,
          0.5971351061731751,
          1125.452554631433,
        ];
        this._earth.camera.rotation = [
          2.4868995751603507e-14,
          -0.7856778432623708,
          6.283185307179586,
        ];
        console.log(this._earth.camera.toAllJSONStr());
      }
    },
    flyTo() {
      this._earth.sceneTree.$refs.tileset.czmObject.flyTo();
    },
    clearResults() {
      this._earth && this._earth.analyzation.measurement.clearResults();
    },
    colorchange(event) {
      let color = event.target.value;
      console.log(event);
      this.scanline1.color = color.xeColor;
    },
    async createGroundCircle(earth) {
      var p = new XE.Obj.CustomGroundRectangle(earth);
      p.position = [2.02729390339372, 0.6980810742548738, 755.036813823199];
      p.width = 3000;
      p.height = 3000;
      p.canvasWidth = 512;
      p.canvasHeight = 512;

      // var htmlText = `
      //     <div style="width: 512px; height: 512px; background: green;">
      //         <p>Test DivImage!</p>
      //     </div>
      // `;

      var htmlText = `
                <style scoped>
                    .div span {
                      display: block
                    }
                </style>
                <div class="box div" style="color: white; background: rgba(0, 0, 0, 0.6); padding: 20px; border-radius: 5px; min-width:200px; font-size:24px; font-family: 宋体;">
                    <div class="defultbtn" >平移</div>
                    <div class="defultbtn" style="margin-left:20px;">旋转</div><br/>
                    <span>经度：136.39°</span>
                    <span>纬度：39.9°</span>
                    <span>高度：120m</span>
                    <span>偏航角：120°</span>
                    <span>俯仰角：90°</span>
                    <span>翻滚角：0°</span>
                </div>
            `;

      // 方式1，但是性能消耗较大
      // const canvas = await XE.HTML.div2Canvas(htmlText);
      // p.imageUrl = canvas.toDataURL();

      // 方式2，性能提升
      p.imageUrl = "";
      // const canvas = document.createElement("canvas");
      // const canvas2 = await XE.HTML.div2Canvas(htmlText, { canvas, width: 512, height: 512 });
      const canvas2 = await XE.HTML.div2Canvas(htmlText);
      p.drawCanvas((ctx) => {
        ctx.drawImage(canvas2, 0, 0);
      });

      return p;
    },
    renderDiv() {
      this.createGroundCircle(this._earth).then((p) => {
        console.log(p, "====p===");
        p.flyTo();
        window.p = p; // 方便调试
      });
    },
    renderPoint() {
      this._earth.camera.position = [
        1.9017263361090628,
        0.5970981493916543,
        1099.1695380684096,
      ];
      this._earth.camera.rotation = [
        6.270009474790001,
        -0.6822022214619832,
        6.283132222871597,
      ];
      var positions = [],
        entity,
        temp = true;
      for (var i = 0; i < 100; i++) {
        positions.push({
          longitude: 108.9567474 + (Math.random() * i) / 10000,
          latitude: 34.2182464 + (Math.random() * i) / 20000,
          height: 524.57 + Math.random() * i,
          value: 0,
        });
      }
      positions.forEach((element) => {
        entity = this.AddPoint(this._earth, element);
        element._entity = entity;
      });
      setInterval(() => {
        positions.forEach((element) => {
          if (temp) {
            element.value += 1;
          } else {
            element.value -= 1;
          }
          if (element.value > 100) {
            temp = false;
          }
          if (element.value < 0) {
            temp = true;
          }
          element._entity.label.text = element.value.toFixed() + "";
        });
      }, 1000);

      var canvasbox = this._earth.czm.viewer.canvas,
        pickPosition = {},
        dialogModel = this.$refs.dialogModel;
      canvasbox.onclick = (e) => {
        pickPosition.x = e.offsetX;
        pickPosition.y = e.offsetY;
        var picked = this._earth.czm.viewer.scene.pick(pickPosition);
        if (picked !== undefined && picked.id !== undefined) {
          positions.forEach((item) => {
            if (picked.id === item._entity) {
              this.dialogShow = true;
              dialogModel.style.left = pickPosition.x + "px";
              dialogModel.style.top = pickPosition.y + "px";
              this.content = item._entity.label.text._value;
            }
          });
        } else {
          this.dialogShow = false;
        }
      };
    },
    AddPoint(earth, e) {
      var pinBuilder = new Cesium.XbsjPinBuilder();
      const entity = earth.czm.viewer.entities.add({
        // name: e.Equipment_Name,
        position: Cesium.Cartesian3.fromDegrees(
          e.longitude,
          e.latitude,
          e.height,
        ),
        point: {
          pixelSize: 1,
          outlineWidth: 0,
        },
        polyline: {
          positions: [
            Cesium.Cartesian3.fromDegrees(
              e.longitude,
              e.latitude,
              e.height - 50,
            ),
            Cesium.Cartesian3.fromDegrees(e.longitude, e.latitude, e.height),
          ],
          width: 2.0,
          material: Cesium.Color.BLUE,
        },
        billboard: {
          image: pinBuilder.fromColor(
            new Cesium.Color(0.2, 0.2, 0.2, 1.0),
            50,
            Cesium.Color.WHITE,
          ),
          color: new Cesium.Color(1, 0, 0, 1),
          verticalOrigin: Cesium.VerticalOrigin.MIDDLE,
          scale: 1,
          show: true,
        },
        label: {
          text: e.value.toFixed() + "",
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          font: "20px 微软雅黑",
          fillColor: Cesium.Color.WHITE,
          outlineColor: Cesium.Color.BLACK,
          outlineWidth: 6,
          scale: 1,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
        },
      });
      return entity;
    },
    playVideo() {
      const videoModel = {
        title: "视频模型",
        children: [
          {
            czmObject: {
              xbsjType: "CustomPrimitive",
              xbsjGuid: "3e22614c-ff79-45d6-a948-03a441222c7f",
              name: "自定义图元3",
              position: [2.0313887163962, 0.6963863715457375, 1.0],
              renderState: {
                cull: {},
                polygonOffset: {},
                scissorTest: {
                  rectangle: {},
                },
                depthRange: {},
                depthTest: {
                  enabled: true,
                },
                colorMask: {},
                blending: {
                  color: {},
                },
                stencilTest: {
                  frontOperation: {},
                  backOperation: {},
                },
                sampleCoverage: {},
              },
              canvasWidth: 1920,
              canvasHeight: 1080,
              autoRegisterEditing: true,
              // "imageUrl": "//earthsdk.com/t/videoModels/qiangji/3/obj/32_result.jpg",
              imageUrl: "//earthsdk.com/t/videoModels/video/3.mp4",
              objUrl: "//earthsdk.com/t/videoModels/qiangji/3/obj/3.obj",
            },
          },
          {
            czmObject: {
              xbsjType: "CustomPrimitive",
              xbsjGuid: "fc1a0fef-594a-4bc8-afea-f701fe0ac580",
              name: "自定义图元2",
              position: [2.0313887163962, 0.6963863715457375, 1.0],
              renderState: {
                cull: {},
                polygonOffset: {},
                scissorTest: {
                  rectangle: {},
                },
                depthRange: {},
                depthTest: {
                  enabled: true,
                },
                colorMask: {},
                blending: {
                  color: {},
                },
                stencilTest: {
                  frontOperation: {},
                  backOperation: {},
                },
                sampleCoverage: {},
              },
              canvasWidth: 1920,
              canvasHeight: 1080,
              autoRegisterEditing: true,
              // "imageUrl": "//earthsdk.com/t/videoModels/qiangji/2/obj/31_result.jpg",
              imageUrl: "//earthsdk.com/t/videoModels/video/2.mp4",
              objUrl: "//earthsdk.com/t/videoModels/qiangji/2/obj/2.obj",
            },
          },
          {
            czmObject: {
              xbsjType: "CustomPrimitive",
              xbsjGuid: "ff9e84ac-e107-4829-93f5-e182a503b577",
              name: "自定义图元1",
              position: [2.0313887163962, 0.6963863715457375, 1.0],
              renderState: {
                cull: {},
                polygonOffset: {},
                scissorTest: {
                  rectangle: {},
                },
                depthRange: {},
                depthTest: {
                  enabled: true,
                },
                colorMask: {},
                blending: {
                  color: {},
                },
                stencilTest: {
                  frontOperation: {},
                  backOperation: {},
                },
                sampleCoverage: {},
              },
              canvasWidth: 1920,
              canvasHeight: 1080,
              autoRegisterEditing: true,
              // "imageUrl": "//earthsdk.com/t/videoModels/qiangji/1/obj/30_result.jpg",
              imageUrl: "//earthsdk.com/t/videoModels/video/1.mp4",
              objUrl: "//earthsdk.com/t/videoModels/qiangji/1/obj/1.obj",
            },
          },
        ],
      };
      // 判断this._earth.sceneTree.root.children里是否已经存在CustomPrimitive
      let isCreateVideo = this._earth.sceneTree.root.children.some((item) => {
        console.log(item, "===item");
        return item.czmObject.xbsjType === "CustomPrimitive";
      });
      console.log(isCreateVideo, "===isCreateVideo===");
      if (!isCreateVideo) {
        let model = JSON.parse(
          JSON.stringify(this._earth.sceneTree.root.children),
        );
        model = model.concat(videoModel.children);
        this._earth.sceneTree.root.children = model;
        console.log(
          model,
          this._earth.sceneTree.root.children,
          "===this._earth.sceneTree.root.children===",
        );
      }

      const camraPosition = [
        2.0312798026380365,
        0.6964231950889537,
        90.95567511623312,
      ];
      const cameraRotation = [
        6.000295371685467,
        -0.7479184035661341,
        6.281923805567388,
      ];
      this._earth.camera.flyTo(camraPosition, 0, cameraRotation);
    },
  },
  // 1.2 资源销毁
  beforeUnmount() {
    // vue程序销毁时，需要清理相关资源
    this._tileset = this._tileset && this._tileset.destroy();
    this._earth = this._earth && this._earth.destroy();
    this._disposers.forEach((d) => d());
    this._disposers.length = 0;
    this._playingUnbind = this._playingUnbind && this._playingUnbind();
    this._showUnbind = this._showUnbind && this._showUnbind();
    this._timeDurationUnbind =
      this._timeDurationUnbind && this._timeDurationUnbind();
    this._radiusUnbind = this._radiusUnbind && this._radiusUnbind();
    this._currentTimeUnbind =
      this._currentTimeUnbind && this._currentTimeUnbind();
  },
};
</script>
<style>
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
