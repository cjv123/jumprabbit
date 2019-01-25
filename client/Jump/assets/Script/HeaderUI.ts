const {ccclass, property} = cc._decorator;

@ccclass
export default class HeaderUI extends cc.Component {

    @property(cc.Sprite)
    public spriteHeader:cc.Sprite=null;

    @property(cc.Label)
    public labelName:cc.Label=null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    public setName(name:string){
        this.labelName.string =name;
    }

    public setHeaderIcon(imageUrl:string){
        let self = this;
        cc.loader.loadRes(imageUrl,cc.SpriteFrame,function(err,spriteFrame:cc.SpriteFrame){
            if(err){
                console.log("headerUI icon fail:"+err);
            }else{
                self.spriteHeader.spriteFrame=spriteFrame;
            }
        }); 
    }

    // update (dt) {}
}
