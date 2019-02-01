const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    @property(cc.SpriteFrame)
    public redFrameSpf:cc.SpriteFrame=null;
    @property(cc.SpriteFrame)
    public blueFrameSpf:cc.SpriteFrame=null;
    @property(cc.Sprite)
    public frameSp:cc.Sprite=null;
    @property(cc.Sprite)
    public headerImg:cc.Sprite=null;
    @property(cc.Animation)
    public waterAnimation:cc.Animation=null;
    @property(cc.Node)
    public waterNode:cc.Node=null;
    @property(cc.SpriteFrame)
    public fallWaterPlayerSpriteFrame:cc.SpriteFrame=null;
    @property(cc.SpriteFrame)
    public playerSpriteFrame:cc.SpriteFrame=null;

    @property([cc.SpriteFrame])
    public skinSpriteFrame:cc.SpriteFrame[]=[];
    
    private _userId:number=0;
    public set UserId(v:number){
        this._userId =v; 
    }
    public get UserId():number{
        return this._userId;
    }


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }
    
    public setColor(isBlue:boolean){
        if(isBlue==true){
            this.frameSp.spriteFrame=this.blueFrameSpf;
        }else{
            this.frameSp.spriteFrame=this.redFrameSpf;
        }
    }
    
    public setHeaderImg(url:string){
        let _self=this;
        cc.loader.load({url:url,type:"png"},function(err,tex){
            if(err){
                console.log(err.message);
                console.log("player headerimg load header img error");
            }else{
                let spriteFrame = new cc.SpriteFrame(tex);
                _self.headerImg.spriteFrame= spriteFrame; 
            }
        });
    }
    
    public setFallWater(fall:boolean){
        this.waterNode.active=fall;
        if(fall==true){
            this.waterAnimation.play("player_water");
            this.getComponent(cc.Sprite).spriteFrame=this.fallWaterPlayerSpriteFrame;
        }else{
            this.waterAnimation.stop();
            this.getComponent(cc.Sprite).spriteFrame=this.playerSpriteFrame;
        }
    }

    public setSkin(skin:number){
        // this.getComponent(cc.Sprite).spriteFrame = this.skinSpriteFrame[skin-1];
    }

    // update (dt) {}
}
