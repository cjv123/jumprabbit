import DataAccount from "./data/DataAccount";
import DataManager from "./data/DataManager";
import SocketEventData from "./GameLogicPure/SocketEventData";
import GameLogicPure from "./gameLogicPure/GameLogicPure";
import WebSocketManager from "./Net/WebSocketManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class EndGameWindow extends cc.Component {

    @property(cc.Label)
    public labelTime:cc.Label=null;

    @property(cc.Node)
    public winNode:cc.Node=null;

    @property(cc.Node)
    public loseNode:cc.Node=null;
  

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let dataAccount:DataAccount=DataManager.getInstance().getDataInstance("account") as DataAccount;
        let winUserid = SocketEventData.getInstance().WinUserId;
        if(winUserid == dataAccount.UserId){
            this.winNode.active=true;
            this.loseNode.active=false
        }else{
            this.winNode.active=false;
            this.loseNode.active=true
        }

        let gameLogicPure:GameLogicPure = GameLogicPure.getInstance();
        this.labelTime.string = gameLogicPure.CurTime.toString();
    }

    public onExitButtonClick(){
        WebSocketManager.getInstance().close();
        cc.director.loadScene("Home");
    }

    public onReStartButtonClick(){

    }

    // update (dt) {}
}
