const {ccclass, property} = cc._decorator;

@ccclass
export default class SignItem extends cc.Component {
    @property(cc.Label)
    public labelDay:cc.Label=null;

    @property(cc.Sprite)
    public imageItem:cc.Sprite=null;

    @property(cc.Label)
    public labelTitle:cc.Label=null;

    @property(cc.Node)
    public signFlagNode:cc.Node=null;


    // onLoad () {}

    start () {

    }

    public setDay(day:string){
        this.labelDay.string = day;
    }

    public setItemImage(imageUrl:string){
        let self = this;
        cc.loader.loadRes(imageUrl,cc.SpriteFrame,function(err,spriteFrame:cc.SpriteFrame){
            if(err){
                console.log("item icon fail:"+err);
            }else{
                self.imageItem.spriteFrame=spriteFrame;
            }
        }); 
    }

    public setTitle(title:string){
        this.labelTitle.string = title;
    }

    // update (dt) {}
}
