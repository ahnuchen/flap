import Bitmap = egret.Bitmap;

class Main extends egret.DisplayObjectContainer {

    protected constructor() {
        super();

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
        });

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        };

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        };


        this.runGame().catch(e => {
            console.log(e);
        })
    }

    private deltaTime: number;
    private sky: egret.Bitmap;
    private groundH: number;
    private groundW: number;
    private groundTimes: number;
    private grounds: Array<egret.Bitmap> = [];
    private groundSpeed: number = 0.2;
    private timeOnEnterFrame: number = 0;
    private pipeWidth: number = 120;
    private pipeHeight: Array<number> = [];
    private pipeOnBox: Array<Array<number>> = [[0, 0], [0, 0], [0, 0]];
    private pipeInterval: number = this.pipeWidth + 210;
    private blankWidth: number = 140;
    private pipeNumber: number = 0;
    private gameState: number = 0;		//游戏状态：0--未开始，1--已开始，2--已结束
    private bird:Bird;
    private async runGame() {
        await this.loadResource();
        this.createGameScene();
        this.getInitialGround();
        this.initPipe();
        this.initStartPage();
        this.addEventListener(egret.Event.ENTER_FRAME, this.onEnterFrame, this);
        this.timeOnEnterFrame = egret.getTimer();
        this.bird = new Bird();
        this.bird.x = 100;
        this.bird.y = 100;
        this.addChild(this.bird)
    }

    private onEnterFrame(e: egret.Event) {
        let now = egret.getTimer();
        let time = this.timeOnEnterFrame;
        this.deltaTime = now - time;
        // console.log("onEnterFrame: ", (1000 / this.deltaTime).toFixed(5));
        this.timeOnEnterFrame = egret.getTimer();
        this.playGround();
        if (this.gameState === 1) {
            this.drawAllPipe();
        }
    }

    private async loadResource() {
        try {
            const loadingView = new LoadingUI();
            this.addChild(loadingView);
            await RES.loadConfig("resource/default.res.json", "resource/");
            // await this.loadTheme();
            await RES.loadGroup("preload", 0, loadingView);
            this.removeChild(loadingView);
        }
        catch (e) {
            console.error(e);
        }
    }


    protected createGameScene(): void {
        this.sky = this.createBitmapByName("background_png");
        let stageW = this.stage.stageWidth;
        let stageH = this.stage.stageHeight;
        this.sky.width = stageW;
        this.sky.height = stageH * 0.8;
        this.groundH = stageH - this.sky.height;
        this.addChild(this.sky)
    }



    private pipeUps: Array<egret.Bitmap> = [];
    private pipeDowns: Array<egret.Bitmap> = [];

    private initPipe(): void {
        for (let i = 0; i < 200; i++) {
            this.pipeHeight[i] = Math.ceil(Math.random() * 256) + 100;//高度范围从56~272
        }
        for (let i = 0; i < 3; i++) {
            this.pipeOnBox[i][0] = this.stage.stageWidth + i * this.pipeInterval;
            this.pipeOnBox[i][1] = this.pipeHeight[this.pipeNumber];
            this.pipeNumber++;
            let pipeUp: egret.Bitmap = this.createBitmapByName("pipeup_png");
            pipeUp.width = this.pipeWidth;
            pipeUp.x = this.pipeOnBox[i][0];
            pipeUp.height = this.pipeOnBox[i][1];
            pipeUp.y = this.sky.height - pipeUp.height;
            this.pipeUps.push(pipeUp);
            this.addChild(pipeUp);

            let pipeDown: egret.Bitmap = this.createBitmapByName("pipedown_png");
            pipeDown.width = this.pipeWidth;
            pipeDown.x = pipeUp.x;
            pipeDown.height = this.sky.height - this.blankWidth - pipeUp.height
            this.pipeDowns.push(pipeDown);
            this.addChild(pipeDown)
        }
    }

    private drawAllPipe(): void {
        for (let i = 0; i < 3; i++) {
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
        for (let i = 0; i < 3; i++) {
            this.pipeUps[i].x = this.pipeOnBox[i][0];
            this.pipeUps[i].height = this.pipeOnBox[i][1];
            this.pipeUps[i].y = this.sky.height - this.pipeUps[i].height;
            this.pipeDowns[i].x = this.pipeUps[i].x;
            this.pipeDowns[i].height = this.sky.height - this.blankWidth - this.pipeUps[i].height
        }
    }


    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        result.texture = RES.getRes(name);
        return result;
    }


    private getInitialGround(): void {
        let ground = this.createBitmapByName("ground_png");
        this.groundW = ground.width;
        this.groundTimes = Math.ceil(this.stage.width / this.groundW) + 2;
        ground.height = this.groundH;
        ground.y = this.sky.height;
        for (let i = 0; i < this.groundTimes; i++) {
            let bitmap = this.createBitmapByName("ground_png");
            bitmap.height = this.groundH;
            bitmap.y = this.sky.height;
            bitmap.x = this.groundW * i;
            this.addChild(bitmap);
            this.grounds.push(bitmap)
        }
    }

    private playGround(): void {
        this.grounds.forEach((ground, index) => {
            let groundDeltaX = this.groundSpeed * this.deltaTime;
            let groundOffsetX = ground.x - groundDeltaX;
            if (groundOffsetX < this.groundW * (index - 1)) {
                ground.x = this.groundW * index
            } else {
                ground.x = groundOffsetX
            }
        })
    }

    private startPage: egret.Bitmap;

    private initStartPage(): void {
        this.startPage = this.createBitmapByName("space_tip_png");
        this.startPage.x = (this.stage.stageWidth - this.startPage.width ) / 2;
        this.startPage.y = (this.sky.height - this.startPage.height) / 2;
        this.startPage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startGame, this);
        this.startPage.touchEnabled = true;
        this.addChild(this.startPage);
    }

    private startGame(): void {
        this.removeChild(this.startPage);
        this.gameState = 1;
        this.bird.status = 0;
    }
}
