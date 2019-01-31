import WindowsController from "./WindowsController";
import Item from "./Item";
import HttpTools from "./Net/HttpTools";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemBagWindow extends cc.Component {
    @property(cc.Prefab)
    public itemPrefab:cc.Prefab=null;

    @property(cc.Node)
    public itemContent:cc.Node=null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    }

    onCloseButtonClick(){
        WindowsController.hideWindow(this.node);
    }

    // update (dt) {}
}
