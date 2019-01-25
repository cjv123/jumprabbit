import WindowsController from "./WindowsController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ItemInfoWindow extends cc.Component {

    @property(cc.Label)
    public labelTitle: cc.Label = null;

    @property(cc.Label)
    public labelContent:cc.Label=null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    public onCloseButtonClick(){
        WindowsController.hideWindow(this.node);
    }

    public onUseButtonClick(){
        WindowsController.hideWindow(this.node);
    }

    // update (dt) {}
}
