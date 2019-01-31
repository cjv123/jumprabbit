import HttpTools from "./Net/HttpTools";
import SignItem from "./SignItem";
import DialogController from "./DialogController";
import WindowsController from "./WindowsController";
import Loading from "./Loading";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SignWindow extends cc.Component {

    @property(cc.Prefab)
    public signItemPrefab:cc.Prefab=null;

    @property(cc.Node)
    public itemContent:cc.Node=null;

    @property(cc.Button)
    public buttonSign:cc.Button=null;



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let self=this;
        HttpTools.httpRequestByBaseSession("s=/Mj/User/signList",function(resData){
            let statusCode = resData["statusCode"];
            let data=resData["data"];
            let signToday = data["sign"];
            let info = data["info"];
            for (let i = 0; i < info.length; i++) {
                let itemInfo = info[i];
                let day=itemInfo["day"];
                let diamond = itemInfo["diamond"];
                let sign = itemInfo["sign"];
                let itemNode = cc.instantiate(self.signItemPrefab);      
                self.itemContent.addChild(itemNode);
                let signItem:SignItem = itemNode.getComponent(SignItem);
                signItem.setDay(day);
                signItem.setTitle("钻石x"+diamond);
                if(sign==1){
                    signItem.setSignFlag(true);
                }
            }
            if(signToday==1){
                self.buttonSign.interactable=false;
            }else{
                self.buttonSign.interactable=true;
            }
        });
    }

    public onSignButtonClick(){
        Loading.showLoading(true);
        let self = this; 
        HttpTools.httpRequestByBaseSession("s=Mj/User/sign", function (resData) {
            let statusCode = resData["statusCode"];
            let data = resData["data"];
            let day = data["day"];
            let diamond = data["diamond"];
            let msg = data["msg"];

            DialogController.show(msg);
            WindowsController.hideWindow(self.node);
            Loading.showLoading(false);
        });
    }

    public onCloseButtonClick() {
        WindowsController.hideWindow(this.node);
    }

    // update (dt) {}
}
