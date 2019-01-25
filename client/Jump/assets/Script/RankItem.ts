import Header from "./Header";
import HeaderUI from "./HeaderUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RankItem extends cc.Component {
    @property(HeaderUI)
    public headerUI:HeaderUI=null;

    @property(cc.Sprite)
    public spriteNoIcon:cc.Sprite=null;

    @property(cc.Label)
    public labelTime:cc.Label=null;


    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    start () {

    }

    public setName(name:string){
        this.headerUI.setName(name);
    }

    public setHeaderImg(imageUrl:string){
        this.headerUI.setHeaderIcon(imageUrl);
    }

    


    // update (dt) {}
}
