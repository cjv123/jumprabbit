import HttpTools from "./Net/HttpTools";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SignWindow extends cc.Component {

    @property(cc.Prefab)
    public signItemPrefab:cc.Prefab=null;

    @property(cc.Node)
    public itemContent:cc.Node=null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}
}
