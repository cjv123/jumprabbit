import HttpTools from "./Net/HttpTools";
import DataAccount from "./Data/DataAccount";
import DataManager from "./Data/DataManager";
import Loading from "./Loading";
import DialogController from "./DialogController";
import WindowsController from "./WindowsController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Home extends cc.Component {
    @property(cc.Node) 
    public signWindowNode:cc.Node=null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.login();
        WindowsController.showWindow(this.signWindowNode);
    }

    login(){
        Loading.showLoading(true);
        let dataAccount:DataAccount = DataManager.getInstance().getDataInstance("account") as DataAccount;
        dataAccount.login(function(code){
            if(code==0){
                Loading.showLoading(false);
            }
        });
    }

    public onTrainingStart(){
        cc.director.loadScene("Game");
    }

    // update (dt) {}
}
