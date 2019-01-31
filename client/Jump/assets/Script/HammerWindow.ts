import WindowsController from "./WindowsController";
import HttpTools from "./Net/HttpTools";

const {ccclass, property} = cc._decorator;

@ccclass
export default class HammerWindow extends cc.Component {
    @property(cc.Label)
    public lableHammerCount:cc.Label=null;


    // onLoad () {}

    start () {

    }

    public onCloseButtonClick(){
        WindowsController.hideWindow(this.node);
    }

    public onGetHammerButtonClick(){
        HttpTools.httpRequestByBaseSession("s=/Mj/User/getHammer&from=2",function(resData){

        });
    }

    // update (dt) {}
}
