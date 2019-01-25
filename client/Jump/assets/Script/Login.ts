import SocketEventData from "./GameLogicPure/SocketEventData";
import WebSocketManager from "./Net/WebSocketManager";
import NetConfig from "./Net/NetConfig";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Login extends cc.Component {
    @property(cc.EditBox)
    public editBoxTableID:cc.EditBox=null;

    @property(cc.EditBox)
    public editBoxUserId:cc.EditBox=null;

    @property(cc.EditBox)
    public editBoxOhterUserId:cc.EditBox=null;
        
    onLoginButtonClick(){
        SocketEventData.getInstance().PlatfromUserId = Number(this.editBoxUserId.string);
        SocketEventData.getInstance().PlatfromOtherUserId = Number(this.editBoxOhterUserId.string);
        
        let tableId:string = this.editBoxTableID.string;
        SocketEventData.getInstance().createRoom(Number(tableId));
    
    }
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        WebSocketManager.getInstance().connect(NetConfig.WebSocketUrl);
    }
    
    onLoad(){

    }
    
    onEnable(){
        cc.game.on(SocketEventData.event_socket_createroom,this.onCreateRoomEvent,this);
    }
    
    onDisable(){
        cc.game.off(SocketEventData.event_socket_createroom,this.onCreateRoomEvent,this);
    }
    
    private onCreateRoomEvent(event:cc.Event.EventCustom){
        cc.director.loadScene("Game");
    }

    // update (dt) {}
}
