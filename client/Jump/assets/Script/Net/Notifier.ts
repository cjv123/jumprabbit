export default class Notifier{

    private NotifiMsgList:string[]=null;    

    // onLoad () {}

    public init(){
        this.NotifiMsgList = [];
    
        var _this=this;
        setInterval(function(){
           _this.notifi(); 
        },20);
    }
    
    public pushNofifiMsg(msg:string){
        this.NotifiMsgList.push(msg);
    }
    
    
    private notifi(){
        let jsonObj:object=null;
        try {
            if(this.NotifiMsgList.length>0){
                var msg:string=this.NotifiMsgList.shift();
                jsonObj = JSON.parse(msg);
            }
        } catch (error) {
            console.log(error.name,error.message);
        }
        if(null!=jsonObj){
            this.dispatch(jsonObj);
        }
    }
    
    private dispatch(jsonObj:object){
        var op = jsonObj["o"];
        var event = new cc.Event.EventCustom('websocket_op_'+op,true);
        event.setUserData(jsonObj);
        cc.game.dispatchEvent(event);
    }
}
