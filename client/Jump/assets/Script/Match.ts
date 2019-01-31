import SocketEventData from "./GameLogicPure/SocketEventData";
import DataAccount from "./data/DataAccount";
import DataManager from "./data/DataManager";
import WebSocketManager from "./Net/WebSocketManager";
import NetConfig from "./Net/NetConfig";
import HeaderUI from "./HeaderUI";
import GameLogicPure, { GameType } from "./gameLogicPure/GameLogicPure";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Match extends cc.Component {
    @property(cc.Node)
    public searchNode:cc.Node=null;

    @property(cc.Node)
    public matchNode:cc.Node=null;

    @property(HeaderUI)
    public headerLeft:HeaderUI=null;

    @property(HeaderUI)
    public headerRight:HeaderUI=null;


    private _match:boolean=false;
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}


    start () {
        WebSocketManager.getInstance().connect(NetConfig.WebSocketUrl);
    }

    match(){
        let dataAccount:DataAccount=DataManager.getInstance().getDataInstance("account") as DataAccount;
        SocketEventData.getInstance().createRoom(dataAccount.UserId);
    }


    onEnable(){
        SocketEventData.getInstance();
        cc.game.on(SocketEventData.event_socket_createroom,this.onCreateRoomEvent,this);
    }

    onDisable(){
        cc.game.off(SocketEventData.event_socket_createroom,this.onCreateRoomEvent,this);
    }

    private onCreateRoomEvent(event: cc.Event.EventCustom) {
        let dataAccount:DataAccount= DataManager.getInstance().getDataInstance("account") as DataAccount;
        let resData = event.getUserData();
        this.matchNode.active=true;       
        this.searchNode.active=false;
        let socketEventData:SocketEventData = SocketEventData.getInstance();

        let data=resData["data"];
        let member=data["member"];
        let selfMemberInfo = member[dataAccount.UserId];
        let otherMemberInfo = member[socketEventData.OtherUserId];


        this.headerLeft.setName(selfMemberInfo["nickname"]);
        this.headerLeft.setHeaderIcon(selfMemberInfo["logo"]);

        this.headerRight.setName(otherMemberInfo["nickname"]);
        this.headerLeft.setHeaderIcon(otherMemberInfo["logo"]);

        let self=this;
        this.node.runAction(cc.sequence(cc.delayTime(3),
            cc.callFunc(function(){
                GameLogicPure.getInstance().CurGameType = GameType.match;
                cc.director.loadScene("Game");
            })
        ));
    }
    

    update (dt) {
        if(WebSocketManager.getInstance().Connect==true && this._match==false){
            this.match();
            this._match=true;
        }
    }
}
