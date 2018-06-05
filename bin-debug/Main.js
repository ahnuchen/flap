var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Bitmap = egret.Bitmap;
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.grounds = [];
        _this.groundSpeed = 0.2;
        _this.timeOnEnterFrame = 0;
        _this.pipeWidth = 120;
        _this.pipeHeight = [];
        _this.pipeOnBox = [[0, 0], [0, 0], [0, 0]];
        _this.pipeInterval = _this.pipeWidth + 210;
        _this.blankWidth = 140;
        _this.pipeNumber = 0;
        _this.gameState = 0; //游戏状态：0--未开始，1--已开始，2--已结束
        _this.pipeUps = [];
        _this.pipeDowns = [];
        return _this;
    }
    Main.prototype.createChildren = function () {
        _super.prototype.createChildren.call(this);
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
        //inject the custom material parser
        //注入自定义的素材解析器
        var assetAdapter = new AssetAdapter();
        egret.registerImplementation("eui.IAssetAdapter", assetAdapter);
        egret.registerImplementation("eui.IThemeAdapter", new ThemeAdapter());
        this.runGame().catch(function (e) {
            console.log(e);
        });
    };
    Main.prototype.runGame = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.loadResource()];
                    case 1:
                        _a.sent();
                        this.createGameScene();
                        this.getInitialGround();
                        this.initPipe();
                        this.initStartPage();
                        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
                        this.timeOnEnterFrame = egret.getTimer();
                        this.bird = new Bird();
                        this.bird.x = 100;
                        this.bird.y = 100;
                        this.addChild(this.bird);
                        return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.onEnterFrame = function (e) {
        var now = egret.getTimer();
        var time = this.timeOnEnterFrame;
        this.deltaTime = now - time;
        // console.log("onEnterFrame: ", (1000 / this.deltaTime).toFixed(5));
        this.timeOnEnterFrame = egret.getTimer();
        this.playGround();
        if (this.gameState === 1) {
            this.drawAllPipe();
        }
    };
    Main.prototype.loadResource = function () {
        return __awaiter(this, void 0, void 0, function () {
            var loadingView, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        loadingView = new LoadingUI();
                        this.stage.addChild(loadingView);
                        return [4 /*yield*/, RES.loadConfig("resource/default.res.json", "resource/")];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.loadTheme()];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, RES.loadGroup("preload", 0, loadingView)];
                    case 3:
                        _a.sent();
                        this.stage.removeChild(loadingView);
                        return [3 /*break*/, 5];
                    case 4:
                        e_1 = _a.sent();
                        console.error(e_1);
                        return [3 /*break*/, 5];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    Main.prototype.loadTheme = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // load skin theme configuration file, you can manually modify the file. And replace the default skin.
            //加载皮肤主题配置文件,可以手动修改这个文件。替换默认皮肤。
            var theme = new eui.Theme("resource/default.thm.json", _this.stage);
            theme.addEventListener(eui.UIEvent.COMPLETE, function () {
                resolve();
            }, _this);
        });
    };
    Main.prototype.createGameScene = function () {
        this.sky = this.createBitmapByName("background_png");
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        this.sky.width = stageW;
        this.sky.height = stageH * 0.8;
        this.groundH = stageH - this.sky.height;
        this.addChild(this.sky);
    };
    Main.prototype.initPipe = function () {
        for (var i = 0; i < 200; i++) {
            this.pipeHeight[i] = Math.ceil(Math.random() * 256) + 100; //高度范围从56~272
        }
        for (var i = 0; i < 3; i++) {
            this.pipeOnBox[i][0] = this.stage.width + i * this.pipeInterval;
            this.pipeOnBox[i][1] = this.pipeHeight[this.pipeNumber];
            this.pipeNumber++;
            var pipeUp = this.createBitmapByName("pipeup_png");
            pipeUp.width = this.pipeWidth;
            pipeUp.x = this.pipeOnBox[i][0];
            pipeUp.height = this.pipeOnBox[i][1];
            pipeUp.y = this.sky.height - pipeUp.height;
            this.pipeUps.push(pipeUp);
            this.addChild(pipeUp);
            var pipeDown = this.createBitmapByName("pipedown_png");
            pipeDown.width = this.pipeWidth;
            pipeDown.x = pipeUp.x;
            pipeDown.height = this.sky.height - this.blankWidth - pipeUp.height;
            this.pipeDowns.push(pipeDown);
            this.addChild(pipeDown);
        }
    };
    Main.prototype.drawAllPipe = function () {
        for (var i = 0; i < 3; i++) {
            this.pipeOnBox[i][0] = this.pipeOnBox[i][0] - this.groundSpeed * this.deltaTime;
        }
        if (this.pipeOnBox[0][0] <= -this.pipeWidth) {
            this.pipeOnBox[0][0] = this.pipeOnBox[1][0];
            this.pipeOnBox[0][1] = this.pipeOnBox[1][1];
            this.pipeOnBox[1][0] = this.pipeOnBox[2][0];
            this.pipeOnBox[1][1] = this.pipeOnBox[2][1];
            this.pipeOnBox[2][0] = this.pipeOnBox[2][0] + this.pipeInterval;
            this.pipeOnBox[2][1] = this.pipeHeight[this.pipeNumber];
            this.pipeNumber++;
        }
        for (var i = 0; i < 3; i++) {
            this.pipeUps[i].x = this.pipeOnBox[i][0];
            this.pipeUps[i].height = this.pipeOnBox[i][1];
            this.pipeUps[i].y = this.sky.height - this.pipeUps[i].height;
            this.pipeDowns[i].x = this.pipeUps[i].x;
            this.pipeDowns[i].height = this.sky.height - this.blankWidth - this.pipeUps[i].height;
        }
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        result.texture = RES.getRes(name);
        return result;
    };
    Main.prototype.getInitialGround = function () {
        var ground = this.createBitmapByName("ground_png");
        this.groundW = ground.width;
        this.groundTimes = Math.ceil(this.stage.width / this.groundW) + 2;
        ground.height = this.groundH;
        ground.y = this.sky.height;
        for (var i = 0; i < this.groundTimes; i++) {
            var bitmap = this.createBitmapByName("ground_png");
            bitmap.height = this.groundH;
            bitmap.y = this.sky.height;
            bitmap.x = this.groundW * i;
            this.addChild(bitmap);
            this.grounds.push(bitmap);
        }
    };
    Main.prototype.playGround = function () {
        var _this = this;
        this.grounds.forEach(function (ground, index) {
            var groundDeltaX = _this.groundSpeed * _this.deltaTime;
            var groundOffsetX = ground.x - groundDeltaX;
            if (groundOffsetX < _this.groundW * (index - 1)) {
                ground.x = _this.groundW * index;
            }
            else {
                ground.x = groundOffsetX;
            }
        });
    };
    Main.prototype.initStartPage = function () {
        this.startPage = this.createBitmapByName("space_tip_png");
        this.startPage.x = (this.stage.stageWidth - this.startPage.width) / 2;
        this.startPage.y = (this.sky.height - this.startPage.height) / 2;
        this.startPage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startGame, this);
        this.startPage.touchEnabled = true;
        this.addChild(this.startPage);
    };
    Main.prototype.startGame = function () {
        this.removeChild(this.startPage);
        this.gameState = 1;
        this.bird.status = 0;
    };
    return Main;
}(eui.UILayer));
__reflect(Main.prototype, "Main");
//# sourceMappingURL=Main.js.map