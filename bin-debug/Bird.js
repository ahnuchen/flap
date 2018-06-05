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
var Bird = (function (_super) {
    __extends(Bird, _super);
    function Bird() {
        var _this = _super.call(this) || this;
        _this._status = 1;
        _this.birds = [];
        _this.birdStatus = 0;
        _this.addEventListener(egret.Event.ENTER_FRAME, _this.initBird, _this);
        return _this;
    }
    Bird.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        result.texture = RES.getRes(name);
        return result;
    };
    Object.defineProperty(Bird.prototype, "status", {
        get: function () {
            return this._status;
        },
        set: function (status) {
            this._status = status;
            if (status === 1) {
                this.addEventListener(egret.Event.ENTER_FRAME, this.initBird, this);
            }
        },
        enumerable: true,
        configurable: true
    });
    Bird.prototype.initBird = function () {
        var _this = this;
        if (this.birds.length === 0) {
            var bird0 = this.createBitmapByName("flappybirdimages_json.bird0");
            var bird1 = this.createBitmapByName("flappybirdimages_json.bird1");
            var bird2 = this.createBitmapByName("flappybirdimages_json.bird2");
            this.birds.push(bird0);
            this.birds.push(bird1);
            this.birds.push(bird2);
            this.addChild(bird0);
        }
        if (this.status === 1) {
            this.birdStatus += 0.2;
            if (this.birdStatus > 3) {
                this.birdStatus = 0;
            }
            var currentBirdIndex_1 = Math.floor(this.birdStatus);
            this.birds.forEach(function (bird, index) {
                if (index === currentBirdIndex_1) {
                    _this.addChild(bird);
                }
                else {
                    if (bird.parent) {
                        _this.removeChild(bird);
                    }
                }
            });
        }
        else {
            this.removeEventListener(egret.Event.ENTER_FRAME, this.initBird, this);
        }
    };
    return Bird;
}(egret.DisplayObjectContainer));
__reflect(Bird.prototype, "Bird");
//# sourceMappingURL=Bird.js.map