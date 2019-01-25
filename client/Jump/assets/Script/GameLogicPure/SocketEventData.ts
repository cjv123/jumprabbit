import WebSocketManager from "../Net/WebSocketManager";
import GameLogicPure from "./GameLogicPure";
import FrameCommandCache from "./FrameCommandCache";

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
    
    private static instance:SocketEventData=null;
    
    constructor(){
        cc.game.on(SocketEventData.event_socket_createroom,this.onCreateRoomEvent,this);
        cc.game.on(SocketEventData.event_socket_jump,this.onJumpEvent,this);
        cc.game.on(SocketEventData.event_socket_ready,this.onReadyEvent,this);
    }
    
    public static getInstance():SocketEventData{
        if(SocketEventData.instance==null) {
            SocketEventData.instance = new SocketEventData();
        }
        
        return SocketEventData.instance;
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
        let resData = event.getUserData();
        let data = resData["data"];
        this.rooomId = data["roomId"];
        let member = data["member"];
        for (const key in member) {
            if(Number(key)==this.platfromUserId){
                this.userId = member[key];
            }else{
                this.otherUsedrId = member[key];
            }
        }
        let random = data["random"];
        GameLogicPure.getInstance().setRandom(random);
    }
    
    
    public createRoom(platformTableId:number=999,platfromParam:object=null,player2Robot:boolean=false){
        if(platfromParam==null){
            platfromParam ={
                code:0,        //int 返回码，0为成功，其他为错误    
                versionCode:"",//int 游戏大厅版本号（1002以下版本该字段可能为空，使用versionCode时需要判空）
                message:"",    //string 返回消息
                pkgName:"test",    //string 游戏包名
                tableId:platformTableId,    //string 分配的桌子id
                tableToken:"", //string 分配的桌子token
                players : [ //玩家列表
                    {
                        uid:this.platfromUserId,            //string 玩家uid 根据game权限，该id不一定为真是玩家uid
                        name:"name1",            //string 玩家昵称
                        headIcon:"",        //string  玩家头像url
                        sex:"M",            //string 玩家性别 ，M为男性，F为女性
                        micStatus:1,        //int  麦克风状态 0: 关闭，1：打开
                        speakerStatus:1,     //int  扬声器状态 0: 关闭，1 ：打开
                        tag:0,            //int  0:正常玩家, 1: ai机器人
                    },
                    {
                        uid:this.platfromOtherUserId,
                        name:"name2",
                        headIcon:"",
                        sex:"F",
                        micStatus:1,
                        speakerStatus:1,
                        tag:0,
                    },
                ]
            };
        }
    
        let webSocketManager = WebSocketManager.getInstance(); 
        webSocketManager.sendObj({
            // r:0,
            // u:this.platfromUserId,
            o:1,
            param:platfromParam
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
