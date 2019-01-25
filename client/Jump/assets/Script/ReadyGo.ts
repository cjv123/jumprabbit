import GameLogicPure from "./gameLogicPure/GameLogicPure";
import TouchLayer from "./TouchLayer";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ReadyGo extends cc.Component {

    @property(cc.Node)
    readyNode:cc.Node=null;

    @property(cc.Node)
    goNode:cc.Node=null;
    
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        // this.play();
    }
    

    
    public playReady(){
        this.readyNode.active=true;
        let readySeq = cc.sequence(
            cc.moveTo(0.2,cc.v2(378,this.readyNode.getPosition().y)),
            cc.delayTime(1),
            cc.hide()
        );
    
        this.readyNode.runAction(readySeq);
    }
    

    public playGo(){
        this.goNode.active=true;
        let goSeq = cc.sequence(
            cc.moveTo(0.2,cc.v2(378,this.readyNode.getPosition().y)), 
            cc.delayTime(1),
            cc.hide()
        )
        this.goNode.runAction(goSeq);
        
    }

    // update (dt) {}
}
