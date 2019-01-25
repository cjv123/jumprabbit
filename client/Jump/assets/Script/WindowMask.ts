const {ccclass, property} = cc._decorator;

@ccclass
export default class WindowMask extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,function(event:cc.Event.EventTouch){
            // event.stopPropagationImmediate();
            return false;
        });
    }

    // update (dt) {}
}
