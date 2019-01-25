import GameLogicPure from "./GameLogicPure";

export default class FrameCommandCache  {
    public static readonly event_frame_response:string="event_frame_response";
    
    private frameCommandCacheList:Array<any>=null;
    private gameLogicPure:GameLogicPure=null;
    
    constructor(gameLogicPure:GameLogicPure){
        cc.game.on(FrameCommandCache.event_frame_response,this.onFrameEvent,this);
        this.gameLogicPure = gameLogicPure;
        this.frameCommandCacheList=[];
        
    }
    
    private onFrameEvent(event:cc.Event.EventCustom){
        let frameData = event.getUserData(); 
        this.frameCommandCacheList.push(frameData);
    }
    
    public update(dt){
        if(this.frameCommandCacheList.length>0){
            let frameData=this.frameCommandCacheList.shift();
            let curFrame = frameData["curFrame"];
            this.gameLogicPure.FrameIndex=curFrame;
            let commandDataList = frameData["command"];
            for(let j=0;j<commandDataList.length;j++){
                let command = commandDataList[j];
                let userId=command["userId"];
                let leftOrRight = command["key"];
                this.gameLogicPure.jump(userId,leftOrRight);
                
                console.log("decode command frame:"+curFrame+" userId:"+userId+" leftOrRight:"+leftOrRight);
            }
            this.gameLogicPure.update();
        }
    }

}
