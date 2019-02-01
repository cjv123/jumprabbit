import Notifier from "./Notifier";
import NetConfig from "./NetConfig";

export default class WebSocketManager {
    public static event_reconnect:string="event_reconnect";

    private static _instance:WebSocketManager=null;
    private _webSocket:WebSocket=null;
    private _notifier:Notifier=null 
    private _connect:boolean=false;
    private _reConnectNum:number=0;
    
    public get Connect():boolean{
        return this._connect;
    }

    public static getInstance():WebSocketManager {
        if(this._instance==null){
            this._instance = new WebSocketManager();
        }
        return this._instance;
    }
    
    private constructor(){
        this._notifier = new Notifier(); 
    }
    
    public connect(url:string){
        this._webSocket = new WebSocket(url);
        this._webSocket.onopen =this.onOpen.bind(this);
        this._webSocket.onmessage = this.onMessage.bind(this);
        this._webSocket.onerror = this.onError.bind(this);
        this._webSocket.onclose = this.onClose.bind(this);
        this._connect=false;
       
        // setTimeout(function () {
        //     if (this._webSocket.readyState === WebSocket.OPEN) {
        //         this._webSocket.send("Hello WebSocket, I'm a text message.");
        //     }
        //     else {
        //         console.log("WebSocket instance wasn't ready...");
        //     }
        // }, 3);
    }
    
    public reConnect(){
        this.connect(NetConfig.WebSocketUrl);
        this._reConnectNum++;
    }
    
    private onOpen(event){
        console.log("Send Text WS was opened.");
        this._connect=true;
        this._notifier.init();
        
        if(this._reConnectNum>0){
            let reConnectEvent:cc.Event.EventCustom = new cc.Event.EventCustom(WebSocketManager.event_reconnect,true);
            cc.game.dispatchEvent(reConnectEvent);
        }
    }
    
    private onMessage(event){
        console.log("response text msg: " + event.data);
        this._notifier.pushNofifiMsg(event.data);
    }
    
    private onError(event){
        console.log("Send Text fired an error");
    }
    
    private onClose(event){
        console.log("WebSocket instance closed.");
        this._connect=false;
        this.reConnect();
    }
    
    public send(buf:string){
        console.log("websocket send:"+buf);
        try {
            this._webSocket.send(buf);
        } catch (error) {
            console.log(error);
            this.reConnect();
        }
    }
    
    public sendObj(obj){
        let buf:string = JSON.stringify(obj);
        this.send(buf);
    }

    public close(){
        if(this._webSocket){
            this._webSocket.close();
        }
    }
}
