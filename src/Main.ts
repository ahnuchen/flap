import Bitmap = egret.Bitmap;

class Main extends egret.DisplayObjectContainer {

    protected constructor() {
        super();
        this.runGame().catch(e => console.log(e))
    }

    private deltaTime: number;
    private sky: egret.Bitmap;
    private groundH: number;
    private groundW: number;
    private groundTimes: number;
    private grounds: Array<egret.Bitmap> = [];
    private groundSpeed: number = 0.2;
    private pipeSpeed: number = 0.2;
    private timeOnEnterFrame: number = 0;
    private pipeWidth: number = 120;
    private pipeHeight: Array<number> = [];
    private pipeOnBox: Array<Array<number>> = [[0, 0], [0, 0], [0, 0]];
    private pipeInterval: number = this.pipeWidth + 210;
    private blankWidth: number = 200;
    private pipeNumber: number = 0;
    private gameState: number = 0;		//游戏状态：0--未开始，1--已开始，2--已结束
    private bird: Bird;
    private birdGravityVy: number = 1 / 30;
    private birdVy: number = 0;
    private birdVup: number = 11;
    private birdHitPipe: boolean = false;
    private endPage: egret.Bitmap;
    private maxScore: egret.TextField = new egret.TextField();
    private scoreOfThisTime: egret.TextField = new egret.TextField();
    private startPage: egret.Bitmap;
    private pointText: egret.TextField = new egret.TextField();
    private voiceWings: egret.Sound;
    private voiceHit: egret.Sound;
    private voiceOver: egret.Sound;
    private voiceBonus: egret.Sound;

    private async runGame() {
        await this.loadResource();
        this.createGameScene();
        this.getInitialGround();
        this.initPipe();
        this.initStartPage();
        this.addEventListener(egret.Event.ENTER_FRAME, this.onTick, this);
        this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchState, this);
        this.timeOnEnterFrame = egret.getTimer();
        this.bird = new Bird();
        this.bird.x = 100;
        this.bird.y = 200;
        this.addChild(this.bird);
        this.pointText.text = "0";
        this.pointText.size = 50;
        this.pointText.textColor = 0xffffff;
        this.pointText.y = 100;
        this.pointText.x = this.stage.stageWidth / 2;
        this.addChild(this.pointText);
    }

    private onTick(e: egret.Event) {
        let now = egret.getTimer();
        let time = this.timeOnEnterFrame;
        this.deltaTime = now - time;
        this.timeOnEnterFrame = egret.getTimer();
        this.playGround();
        if (this.gameState === 1) {
            this.drawAllPipe();
            this.drawBird();
            if (!this.birdHitPipe) {
                this.checkHit();
            }
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
            this.voiceWings = RES.getRes("wing_mp3");
            this.voiceBonus = RES.getRes("point_mp3");
            this.voiceHit = RES.getRes("hit_mp3");
            this.voiceOver = RES.getRes("die_mp3");
            this.endPage = this.createBitmapByName("scoreboard_png");

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
        for (let i = 0; i < 300; i++) {
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
            this.addChildAt(pipeUp, 1);

            let pipeDown: egret.Bitmap = this.createBitmapByName("pipedown_png");
            pipeDown.width = this.pipeWidth;
            pipeDown.x = pipeUp.x;
            pipeDown.height = this.sky.height - this.blankWidth - pipeUp.height
            this.pipeDowns.push(pipeDown);
            this.addChildAt(pipeDown, 1)
        }
    }

    private drawAllPipe(): void {
        for (let i = 0; i < 3; i++) {
            this.pipeOnBox[i][0] = this.pipeOnBox[i][0] - this.pipeSpeed * this.deltaTime;
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


    private initStartPage(): void {
        this.startPage = this.createBitmapByName("space_tip_png");
        this.startPage.x = (this.stage.stageWidth - this.startPage.width) / 2;
        this.startPage.y = (this.sky.height - this.startPage.height) / 2;
        this.startPage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.startGame, this);
        this.startPage.touchEnabled = true;
        this.addChild(this.startPage);
    }

    private startGame(): void {
        this.removeChild(this.startPage);
        this.gameState = 1;
        this.touchEnabled = true;
    }

    private gameOver(): void {
        this.gameState = 2;
        this.touchEnabled = true;
        this.endPage.touchEnabled = true;
        this.endPage.addEventListener(egret.TouchEvent.TOUCH_TAP, this.gamePrepare, this);
        this.endPage.x = this.startPage.x;
        this.endPage.width = this.startPage.width;
        this.endPage.height = this.startPage.height;
        this.endPage.y = this.startPage.y;
        this.addChild(this.endPage);
    }

    private gamePrepare(): void {
        this.bird.status = 1;
        this.bird.x = 100;
        this.bird.y = 200;
        this.pipeSpeed = this.groundSpeed;
        this.pointText.text = '0';
        this.pointText.x = this.stage.stageWidth / 2
        this.pointText.y = 100;

        for (let obj of this.pipeDowns) {
            this.removeChild(obj)
        }
        for (let obj of this.pipeUps) {
            this.removeChild(obj)
        }
        this.pipeDowns = [];
        this.pipeUps = [];
        this.birdHitPipe = false;
        this.initPipe();
        this.bird.rotation = 0;
        this.removeChild(this.endPage);
        this.addChild(this.startPage);
        this.gameState = 0
    }

    private drawBird(): void {
        if (this.gameState !== 0) {
            this.bird.y += this.birdVy;
            this.birdVy += this.birdGravityVy * this.deltaTime;
        }
        if (this.birdVy <= 6) {
            this.bird.rotation = -30
        }
        else {
            this.bird.rotation = this.birdVy * 2;
            if (this.bird.rotation > 90) {
                this.bird.rotation = 90
            }
        }
        if (this.bird.y > this.sky.height - this.bird.height) {
            this.bird.y = this.sky.height - this.bird.height;
            this.bird.status = 0;
            if (!this.birdHitPipe) {
                this.voiceHit.play(0, 1);
            }
            this.voiceOver.play(0, 1);
            this.gameOver()
        }
    }

    private onTouchState() {
        this.birdVy = -this.birdVup;
        this.voiceWings.play(0, 1);
    }

    // 碰撞检测
    private checkHit() {
        const checkPoints: Array<Array<number>> = [
            [this.bird.x + this.bird.width, this.bird.y - this.bird.height / 2],//嘴
            [this.bird.x + this.bird.width / 2, this.bird.y],//背
            [this.bird.x + this.bird.width / 2, this.bird.y + this.bird.height],//胸
            [this.bird.x + this.bird.width, this.bird.y + this.bird.height],//下巴
            [this.bird.x + this.bird.width, this.bird.y + this.bird.height] //头
        ];
        for (let pipe of [...this.pipeDowns, ...this.pipeUps]) {
            for (let point of checkPoints) {
                let isHit: boolean = pipe.hitTestPoint(point[0], point[1]);
                if (isHit) {
                    this.bird.status = 0;
                    this.pipeSpeed = 0;
                    this.voiceHit.play(0, 1);
                    this.birdHitPipe = true;
                    this.touchEnabled = false;
                    return false
                }
            }
        }
        //检测得分

        if (this.bird.x > this.pipeOnBox[0][0] + this.pipeWidth && this.bird.x < this.pipeOnBox[0][0] + this.pipeWidth + this.deltaTime * this.pipeSpeed
            || this.bird.x > this.pipeOnBox[1][0] + this.pipeWidth && this.bird.x < this.pipeOnBox[1][0] + this.pipeWidth + this.deltaTime * this.pipeSpeed) {
            this.voiceBonus.play(0, 1);
            let score = parseInt(this.pointText.text) + 1;
            this.pointText.text = score.toString()
        }
    }
}
