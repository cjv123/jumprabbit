const {ccclass, property} = cc._decorator;

@ccclass
export default class Loading extends cc.Component {

    @property(cc.Node)
    public loadingNode:cc.Node=null;


    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.loadingNode.runAction(cc.repeatForever(cc.rotateBy(0.1,20)));
    }

    public static showLoading(show:boolean){
        let loadingNode = cc.find("loading"); 
        if(loadingNode){
            loadingNode.active=show;
        }
    }

    // update (dt) {}
}
