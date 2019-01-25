import GameLogicPure, { GameType } from "./gameLogicPure/GameLogicPure";
import SocketEventData from "./GameLogicPure/SocketEventData";
import FrameCommandCache from "./gameLogicPure/FrameCommandCache";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameView extends cc.Component {
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
