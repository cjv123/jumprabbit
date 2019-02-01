import WebSocketManager from "../Net/WebSocketManager";
import GameLogicPure from "./GameLogicPure";
import FrameCommandCache from "./FrameCommandCache";
import DataAccount from "../data/DataAccount";
import DataManager from "../data/DataManager";

export default class SocketEventData{
    public static readonly event_socket_createroom:string="websocket_op_1";
    public static readonly event_socket_exitroom:string="websocket_op_3";
    public static readonly event_socket_jump:string="websocket_op_11";
    public static readonly event_socket_ready:string="websocket_op_8";
    public static readonly event_socket_endgame:string="websocket_op_103";
    
    private rooomId:number=0;
    private userId:number=0;
    private otherUsedrId:number=0;
    private platfromTableId:number=0;
    private platfromUserId:number=0;
    private platfromOtherUserId:number=0;
    private player2Robot:boolean=false;
    private winUserId:number=0;

    private memberInfoMap={};
    
    public set PlatfromUserId(v:number){
        this.platfromUserId=v;
    }
    public get PlatfromUserId():number{
        return this.platfromUserId;
    }
    public set PlatfromOtherUserId(v:number){
        this.platfromOtherUserId = v;
    }
    public get PlatfromOtherUserId(){
        return this.platfromOtherUserId;
    }
    public get OtherUserId(){
        return this.otherUsedrId;
    }
    public get WinUserId(){
        return this.winUserId;
    }


    
    private static instance:SocketEventData=null;
    
    constructor(){
        cc.game.on(SocketEventData.event_socket_createroom,this.onCreateRoomEvent,this);
        cc.game.on(SocketEventData.event_socket_jump,this.onJumpEvent,this);
        cc.game.on(SocketEventData.event_socket_ready,this.onReadyEvent,this);
        cc.game.on(SocketEventData.event_socket_endgame,this.onEndGameEvent,this);
    }
    
    public static getInstance():SocketEventData{
        if(SocketEventData.instance==null) {
            SocketEventData.instance = new SocketEventData();
        }
        
        return SocketEventData.instance;
    }

    private onEndGameEvent(event:cc.Event.EventCustom){
        let resData = event.getUserData();
        let data = resData["data"];
        let win = data["win"];
        this.winUserId = win;
    }
    
    private onJumpEvent(event:cc.Event.EventCustom){
        let resData = event.getUserData();
        let data = resData["data"] ;
        let frame=data["f"];
        let commandData = data["c"];
        let commandList=[];
        if(commandData[this.userId]!=undefined && commandData[this.userId].length>0){
            for(let i=0;i<commandData[this.userId].length;i++){
                commandList.push({
                    userId:this.userId,
                    curFrame:commandData[this.userId][i]["k"],
                    key:commandData[this.userId][i]["j"]
                });
            }
        }
        
        if(commandData[this.otherUsedrId]!=undefined && commandData[this.otherUsedrId].length>0){
            for(let i=0;i<commandData[this.otherUsedrId].length;i++){
                commandList.push({
                    userId:this.otherUsedrId,
                    curFrame:commandData[this.otherUsedrId][i]["k"],
                    key:commandData[this.otherUsedrId][i]["j"]
                });
            }
        }
        
        let eventFrameCommandCacae = new cc.Event.EventCustom(FrameCommandCache.event_frame_response,true);
        eventFrameCommandCacae.setUserData({
            curFrame:frame,
            command:commandList
        });
        cc.game.dispatchEvent(eventFrameCommandCacae);
    }
    
    private onCreateRoomEvent(event:cc.Event.EventCustom){
        let dataAccount:DataAccount= DataManager.getInstance().getDataInstance("account") as DataAccount;
        let resData = event.getUserData();
        let data = resData["data"];
        this.rooomId = data["roomId"];
        let member = data["member"];
        this.memberInfoMap=member;
        for (const key in member) {
            if(Number(key)==dataAccount.UserId){
                this.userId=dataAccount.UserId;
            }else{
                this.otherUsedrId=Number(key);
            }
        }
        let random = data["random"];
        GameLogicPure.getInstance().setRandom(random);
    }
    
    
    public createRoom(userid:number){
        let webSocketManager = WebSocketManager.getInstance(); 
        webSocketManager.sendObj({
            // r:0,
            // u:this.platfromUserId,
            o:1,
            u:userid
        });
        

        this.player2Robot = false;

        this.platfromTableId = this.platfromTableId;
    }
    

    private onReadyEvent(event:cc.Event.EventCustom){
        let resData = event.getUserData(); 
        let s=resData["s"];
        if(s==0){
            GameLogicPure.getInstance().ready([this.userId,this.otherUsedrId],false);
        }
    }
    
    
    public ready(){
        let webSocketManager = WebSocketManager.getInstance(); 
        webSocketManager.sendObj({
            r:this.rooomId,
            u:this.userId,
            o:8
        });
    }
    
    public exitRoom(){
        let webSocketManager = WebSocketManager.getInstance(); 
        webSocketManager.sendObj({
            r:this.rooomId,
            u:this.userId,
            o:3,
        });
    }
    
    public jump(leftOrRight:number,isEnd:number){
        let webSocketManager = WebSocketManager.getInstance(); 
        webSocketManager.sendObj({
            r:this.rooomId,
            u:this.userId,
            o:11,
            j:leftOrRight,
            k:GameLogicPure.getInstance().FrameIndex,
            c:isEnd
        });
    }


}
