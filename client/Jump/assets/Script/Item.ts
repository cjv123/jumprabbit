const {ccclass, property} = cc._decorator;

@ccclass
export default class Item extends cc.Component {

    @property(cc.Label)
    public labelName: cc.Label = null;

    @property(cc.Label)
    public labelCount:cc.Label=null;

    @property(cc.Sprite)
    public spriteItemImg:cc.Sprite=null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    public setName(name:string){
        if(this.labelName!=null){
            this.labelName.string = name;
        }
    }

    public setCount(count:number){
        if(this.labelCount!=null){
            this.labelCount.string = "x"+count;
        }
    }

    public setImage(imgUrl:string){
        let self = this;
        cc.loader.loadRes(imgUrl,cc.SpriteFrame,function(err,spriteFrame:cc.SpriteFrame){
            if(err){
                console.log("item icon fail:"+err);
            }else{
                self.spriteItemImg.spriteFrame=spriteFrame;
                // self.spriteItemImg.node.setContentSize(cc.size(spriteFrame.getRect().width,spriteFrame.getRect().height));
                // self.spriteItemImg.node.setScale(100/self.spriteItemImg.node.getContentSize().height);
            }
        }); 
    }

    // update (dt) {}
}
