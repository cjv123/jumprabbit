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
        cc.loader.load({url:imageUrl,type:"png"},function(err,tex){
            if(err){
                console.log(err.message);
                console.log("heaerui headerimg load header img error");
            }else{
                let spriteFrame = new cc.SpriteFrame(tex);
                self.spriteHeader.spriteFrame= spriteFrame; 
            }
        });
    }



    // update (dt) {}
}
