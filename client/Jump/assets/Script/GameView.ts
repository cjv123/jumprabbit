import GameLogicPure, { GameType } from "./gameLogicPure/GameLogicPure";
import SocketEventData from "./GameLogicPure/SocketEventData";
import FrameCommandCache from "./gameLogicPure/FrameCommandCache";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameView extends cc.Component {
    @property(cc.Node)
    public endGameWindowNode:cc.Node=null;

    private _gameLogicPure:GameLogicPure=null;
    
    private _frameCommandCache:FrameCommandCache=null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    start () {
        this._gameLogicPure = GameLogicPure.getInstance();
        this._frameCommandCache=new FrameCommandCache(this._gameLogicPure);
        // cc.game.setFrameRate(30);
        
        if(this._gameLogicPure.CurGameType == GameType.match){
            SocketEventData.getInstance().ready();
        }else if(this._gameLogicPure.CurGameType == GameType.training) {
            GameLogicPure.getInstance().ready([0],false);   
        }
        // cc.game.dispatchEvent(new cc.Event.EventCustom(GameLogicPure.event_game_logic_response_start_game,true));
    }

    onEnable(){
        cc.game.on(SocketEventData.event_socket_endgame,this.onEndGameEvent,this);
        cc.game.on(GameLogicPure.event_game_logic_dispatch_go,this.onGoGameEvent,this);
        cc.game.on(GameLogicPure.event_game_logic_dispatch_end_game,this.onLogicEndGameEvent,this);
    }

    private onEndGameEvent(event:cc.Event.EventCustom){
        this.endGameWindowNode.active=true;             
    }

    private onLogicEndGameEvent(){
        let self=this;
        this.node.runAction(
            cc.sequence(
                cc.delayTime(2),
                cc.callFunc(function(){
                    self.endGameWindowNode.active=true;             
                })
            )
        );
    }

    onDisable(){
        cc.game.off(SocketEventData.event_socket_endgame,this.onEndGameEvent,this);
        cc.game.off(GameLogicPure.event_game_logic_dispatch_go,this.onGoGameEvent,this);
        cc.game.off(GameLogicPure.event_game_logic_dispatch_end_game,this.onLogicEndGameEvent,this);
    }


    onGoGameEvent(event:cc.Event.EventCustom){

    }

    update (dt) {
        if(this._gameLogicPure.CurGameType == GameType.match){
            if (this._frameCommandCache != null) {
                this._frameCommandCache.update(dt);
            }
        } 
        
        if (this._gameLogicPure.CurGameType == GameType.training) {
            this._gameLogicPure.update();
        }
    }
}
