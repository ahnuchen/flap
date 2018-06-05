class Bird extends egret.DisplayObjectContainer{


    constructor(){
        super();
        this.addEventListener(egret.Event.ENTER_FRAME,this.initBird,this)
    }

    private _status:number=1;

    private createBitmapByName(name: string): egret.Bitmap {
        let result = new egret.Bitmap();
        result.texture = RES.getRes(name);
        return result;
    }

    set status(status:number){
        this._status = status;
        if(status === 1){
            this.addEventListener(egret.Event.ENTER_FRAME,this.initBird,this)
        }
    }

    get status(): number {
        return this._status;
    }

    private birds:Array<egret.Bitmap> = [];
    private birdStatus:number = 0;
    private initBird(){
        if(this.birds.length ===0){
            let bird0:egret.Bitmap = this.createBitmapByName("flappybirdimages_json.bird0" );
            let bird1:egret.Bitmap = this.createBitmapByName("flappybirdimages_json.bird1" );
            let bird2:egret.Bitmap = this.createBitmapByName("flappybirdimages_json.bird2" );
            this.birds.push(bird0);
            this.birds.push(bird1);
            this.birds.push(bird2);
            this.addChild(bird0)
        }
        if(this.status===1){

            this.birdStatus +=0.2;
            if(this.birdStatus>3){
                this.birdStatus = 0
            }

            let currentBirdIndex = Math.floor(this.birdStatus);

            this.birds.forEach((bird,index)=>{
                if(index === currentBirdIndex){
                    this.addChild(bird)
                }else{
                    if(bird.parent){
                        this.removeChild(bird)
                    }
                }
            });
        }else{
            this.removeEventListener(egret.Event.ENTER_FRAME,this.initBird,this)
        }
    }
}