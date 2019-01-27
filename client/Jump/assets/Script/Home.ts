import HttpTools from "./Net/HttpTools";
import DataAccount from "./Data/DataAccount";
import DataManager from "./Data/DataManager";
import Loading from "./Loading";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Home extends cc.Component {
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.login();
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
