const {ccclass, property} = cc._decorator;

@ccclass
export default class WindowsController extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    public static hideWindow(windowNode:cc.Node){
        windowNode.runAction(cc.sequence(
            cc.scaleTo(0.2,0.1),
            cc.callFunc(function(){
                windowNode.active=false;
            })
        ));
    }


    public static showWindow(windowNode:cc.Node){
        windowNode.active = true;
        windowNode.setScale(0.3);
        windowNode.runAction(cc.sequence(
            cc.scaleTo(0.2,1.2),
            cc.scaleTo(0.1,1)
        ));

    }


    // update (dt) {}
}
