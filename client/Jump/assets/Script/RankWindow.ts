import WindowsController from "./WindowsController";
import HttpTools from "./Net/HttpTools";
import RankItem from "./RankItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class RankWindow extends cc.Component {
    @property([cc.SpriteFrame])
    public spriteFrames:cc.SpriteFrame[]=[];

    @property([cc.Button])
    public buttonTabs:cc.Button[]=[];

    @property(cc.Prefab)
    public rankItemPref:cc.Prefab=null;

    @property(cc.Node)
    public contentNode:cc.Node=null;

    @property(cc.Node)
    public timeLogo:cc.Node=null;

    @property(cc.ScrollView)
    public scrollView:cc.ScrollView=null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.getData(1);
    }

    getData(rankType){
        let self=this;
        this.contentNode.removeAllChildren();
        HttpTools.httpRequestByBaseSession("s=/Mj/User/userRank&rankType="+rankType+"&page=1&perpage=10",function(resData){
            let data = resData["data"];
            let list = data["list"];
            for(let i=0;i<list.length;i++){
                let itemData = list[i];
                let useId = itemData["userId"];
                let nickname=itemData["nickname"];
                let logo = itemData["logo"];
                let sex = itemData["sex"];
                let value = itemData["value"];

                let itemNode:cc.Node = cc.instantiate(self.rankItemPref); 
                self.contentNode.addChild(itemNode);
                let rankItem:RankItem = itemNode.getComponent(RankItem);
                rankItem.setName(nickname);
                rankItem.setHeaderImg(logo);
                rankItem.setNo(i+1);
                rankItem.setValue(value,rankType);
            }

            self.scrollView.scrollToTop();
        });
    }

    public onCloseButtonClick(){
        WindowsController.hideWindow(this.node);
    }

    public onTabButtonClick(event:cc.Event.EventTouch,index:number){
        for(let i=0;i<this.buttonTabs.length;i++){
            if(index==(i+1)){
                this.buttonTabs[i].getComponent(cc.Sprite).spriteFrame=this.spriteFrames[i];
            }else{
                this.buttonTabs[i].getComponent(cc.Sprite).spriteFrame=null;
            }
        }

        this.getData(index);
    }


    // update (dt) {}
}
