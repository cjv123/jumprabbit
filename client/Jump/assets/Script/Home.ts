const {ccclass, property} = cc._decorator;

@ccclass
export default class Home extends cc.Component {
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    public onTrainingStart(){
        cc.director.loadScene("Game");
    }

    // update (dt) {}
}
