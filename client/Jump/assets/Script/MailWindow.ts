import WindowsController from "./WindowsController";
import HttpTools from "./Net/HttpTools";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MailWindow extends cc.Component {
    @property(cc.Node)
    public listView: cc.Node = null;

    @property(cc.Prefab)
    public mailItemPrefab:cc.Prefab=null; 


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    getData(){
    }

    public onCloseButtonClick(){
        WindowsController.hideWindow(this.node);
    }

    // update (dt) {}
}
