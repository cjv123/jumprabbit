import GameLogicPure, { GameType } from "./gameLogicPure/GameLogicPure";
import FrameCommandCache from "./gameLogicPure/FrameCommandCache";
import SocketEventData from "./GameLogicPure/SocketEventData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TouchLayer extends cc.Component {
    private _touchEnable:boolean=true;
    public get TouchEnable():boolean {
        return this._touchEnable;
    }
    public set TouchEnable(v:boolean){
        this._touchEnable=v;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStartEvent.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMoveEvent.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEndEvent.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancelEvent.bind(this));
    }
    
    private onTouchStartEvent(event:cc.Event.EventTouch){
        if(this.TouchEnable==false){
            return false;
        }
    
        let location:cc.Vec2 = event.getLocation();
        let winsize:cc.Size = cc.winSize;
        let halfWidth = winsize.width/2;
        // console.log("winsize width:"+winsize.width+" height:"+winsize.height);
        if(location.x<=halfWidth){
            this.jump(0);
        }else{
            this.jump(1);
        }
    }
    
    private onTouchMoveEvent(event:cc.Event.EventTouch){
       
    }
    
    private onTouchEndEvent(event:cc.Event.EventTouch){
       
    }
    
    private onTouchCancelEvent(event:cc.Event.EventTouch){

    }
    

    private jump(leftRoRight:number){
        let gameLogicPure:GameLogicPure = GameLogicPure.getInstance();
        
        let isEnd = (gameLogicPure.checkLastJump()==true)?1:0;

        if(gameLogicPure.CurGameType == GameType.match){
            SocketEventData.getInstance().jump(leftRoRight,isEnd);
        } else if(gameLogicPure.CurGameType == GameType.training){
            // let event = new cc.Event.EventCustom(FrameCommandCache.event_frame_response, true);
            // event.setUserData({
            //     curFrame: gameLogicPure.FrameIndex,
            //     command: [
            //         {
            //             userId: gameLogicPure.SelfPlayerId,
            //             key: leftRoRight
            //         }
            //     ]
            // });
            // cc.game.dispatchEvent(event);
            gameLogicPure.jump(0,leftRoRight);
        }

    }


    // update (dt) {}
}
