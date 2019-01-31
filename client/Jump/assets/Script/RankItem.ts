import Header from "./Header";
import HeaderUI from "./HeaderUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RankItem extends cc.Component {
    @property(HeaderUI)
    public headerUI:HeaderUI=null;

    @property(cc.Sprite)
    public spriteNoIcon:cc.Sprite=null;

    @property(cc.Node)
    public timeIconNode:cc.Node=null;

    @property(cc.Label)
    public labelTime:cc.Label=null;

    @property(cc.Label)
    public lableRankNo:cc.Label=null;

    @property([cc.SpriteFrame])
    public rankNoSpriteFrames:cc.SpriteFrame[]=[];


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

    public setNo(rankNo:number){
        if(rankNo<=3){
            this.lableRankNo.node.active=false;
            this.spriteNoIcon.spriteFrame = this.rankNoSpriteFrames[rankNo-1];
            this.spriteNoIcon.node.active=true;
        }else{
            this.spriteNoIcon.node.active=false;
            this.lableRankNo.node.active=true;
            this.lableRankNo.string = rankNo.toString();
        }
    }

    public setValue(v,type){
        let lablestr = "";
        if(type==1){
            lablestr = v+"秒";
            this.timeIconNode.active=true;
        }else if(type==2){
            lablestr = v;
            this.timeIconNode.active=false;
        }else{
            lablestr = v+"%";
            this.timeIconNode.active=false;
        }

        this.labelTime.string = lablestr;
    }


    // update (dt) {}
}
