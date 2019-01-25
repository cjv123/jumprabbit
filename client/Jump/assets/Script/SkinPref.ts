const {ccclass, property} = cc._decorator;

@ccclass
export default class SkinPref extends cc.Component {

    @property(cc.Sprite)
    public spriteBg:cc.Sprite=null;

    @property(cc.Sprite)
    public spriteIcon:cc.Sprite=null;

    @property([cc.SpriteFrame])
    public spriteFrameSkins:cc.Sprite=null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }



    // update (dt) {}
}
