import HttpTools from "./Net/HttpTools";
import DataAccount from "./Data/DataAccount";
import DataManager from "./Data/DataManager";
import Loading from "./Loading";
import DialogController from "./DialogController";
import WindowsController from "./WindowsController";
import HeaderUI from "./HeaderUI";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Home extends cc.Component {
    @property(cc.Node) 
    public signWindowNode:cc.Node=null;

    @property(cc.Node)
    public itemBagWindowNode:cc.Node=null;

    @property(cc.Node)
    public hammerWindowNode:cc.Node=null;

    @property(cc.Node)
    public rankWinodwNode:cc.Node=null;

    @property(cc.Node)
    public mailWindowNode:cc.Node=null;

    @property(cc.Node)
    public skinWindowNode:cc.Node=null;

    @property(cc.Label)
    public lableCoin:cc.Label=null;

    @property(HeaderUI)
    public headerUI:HeaderUI=null;
 

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.login();

        let self=this;
        HttpTools.httpRequestByBaseSession("s=/Mj/User/signList", function (resData) {
            let statusCode = resData["statusCode"];
            let data = resData["data"];
            let signToday = data["sign"];
            if(signToday==0){
                WindowsController.showWindow(self.signWindowNode);
            }
        });
    }

    login(){
        let self=this;
        Loading.showLoading(true);
        let dataAccount:DataAccount = DataManager.getInstance().getDataInstance("account") as DataAccount;
        dataAccount.login(function(code){
            if(code==0){
                Loading.showLoading(false);

                self.lableCoin.string = dataAccount.Diamond.toString();
                self.headerUI.setName(dataAccount.Nickname);
                self.headerUI.setHeaderIcon(dataAccount.Logo);
            }
        });
    }

    public onTrainingStart(){
        cc.director.loadScene("Game");
    }

    public onMatchButtonClick(){
        cc.director.loadScene("Match");
    }

    public onSignButtonClick(){
        WindowsController.showWindow(this.signWindowNode);
    }

    public onItemBagButtonClick(){
        WindowsController.showWindow(this.itemBagWindowNode);
    }

    public onHammerButtonClick(){
        WindowsController.showWindow(this.hammerWindowNode);
    }

    public onRankButtonClick(){
        WindowsController.showWindow(this.rankWinodwNode);
    }

    public onMailButtonClick(){
        WindowsController.showWindow(this.mailWindowNode);
    }

    public onSkinBttonClick(){
        WindowsController.showWindow(this.skinWindowNode);
    }
 

    // update (dt) {}
}
