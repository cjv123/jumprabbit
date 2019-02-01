import FrameCommandCache from "./FrameCommandCache";

class PlayerData{
    public userId:number=0;
    public posMapIndex:number=0;
    public forzend:number=0;
    public fallWaterTime:number=0;
    public robot:boolean=false;
}

enum LeftOrRight{
    left=0,
    right=1
}

enum GameStatus{
    none=0,
    ready=1,
    start=2,
    end=3,
    pause=4
}

export enum GameType{
    match=1,
    training=2 
}


export default class GameLogicPure{
    public static readonly event_game_logic_dispatch_jumpleft:string="event_game_logic_dispatch_jumpleft";
    public static readonly event_game_logic_dispatch_jumpright:string="event_game_logic_dispatch_jumpright";
    // public static readonly event_game_logic_dispatch_start_game:string="event_game_logic_dispatch_start_game";
    public static readonly event_game_logic_dispatch_end_game:string="event_game_logic_dispatch_end_game";
    public static readonly event_game_logic_dispatch_forzen:string="event_game_logic_dispatch_forzen";
    public static readonly event_game_logic_dispatch_outforzen:string="event_game_logic_dispatch_outforzen";
    public static readonly event_game_logic_dispatch_fallwater:string="event_game_logic_dispatch_fallwater";
    public static readonly event_game_logic_dispatch_outwater:string="event_game_logic_dispatch_outwater";
    public static readonly event_game_logic_dispatch_pause:string="event_game_logic_dispatch_pause";
    public static readonly event_game_logic_dispatch_icebreaking:string="event_game_logic_dispatch_icebreaking";
    public static readonly event_game_logic_dispatch_ready:string="event_game_logic_dispatch_ready";
    public static readonly event_game_logic_dispatch_go:string="event_game_logic_dispatch_go";
    
    public static readonly event_game_logic_response_start_game:string="event_game_logic_response_start_game";
    
    //帧率
    private framePerSecond:number = 20;
    //帧数
    private frameIndex:number = 0;
    public get FrameIndex():number{
        return this.frameIndex;
    }
    public set FrameIndex(v:number){
        this.frameIndex=v;
    }

    public get CurTime(){
        return (this.frameIndex*(1/this.framePerSecond)).toFixed();
    }
    
    //地图数据，0左，1右
    private mapData:LeftOrRight[]=null;
    private mapLength:number = 70;
    private mapFrozenIndex:number[]=null;
    private mapFrozenInterval:number=5;
    
    //预存随机数
    private random:number[]=null;
    private curRandomIndex:number=0;
    
    //玩家
    private playersMap:{[key:number]:PlayerData}=null;
    private selfPlayerId:number=0;//自己的id
    public get SelfPlayerId():number{
        return this.selfPlayerId;
    }

    private _curGameType:GameType=GameType.training;
    public get CurGameType():GameType{
        return this._curGameType;
    }
    public set CurGameType(gameType:GameType){
        this._curGameType=gameType;
    }
    
    private curGameStatus:GameStatus=GameStatus.none;
    
    //落水时间
    private readonly fallWaterTime:number =0.8;
    //冰冻解救应敲击次数
    private readonly iceSaveTimes:number = 10;
    //冰冻概率
    private readonly forzenRate:number = 50;
    
    private readyTime:number=2;
    
    
    public static Instance:GameLogicPure=null;
    public static getInstance():GameLogicPure{
        if(GameLogicPure.Instance==null){
            GameLogicPure.Instance = new GameLogicPure();
        }
        return GameLogicPure.Instance;
    }

    
    private constructor(){
    
        this.registEvent();
    }
    

    public setRandom(randomArr){
        this.random = randomArr;
    }
    
    
    public ready(players:number[],player2Robot:boolean) {
        if(this._curGameType==GameType.training){
            this.readyTime=3;
        }

        this.frameIndex=0;
    
        this.playersMap={};
        for(let i=0;i<players.length;i++){
            let playerData = new PlayerData();
            playerData.userId = players[i];
            this.playersMap[playerData.userId]=playerData;
            if(i==0){
                this.selfPlayerId = playerData.userId;
            }
            if(i==1 && player2Robot==true){
                playerData.robot=true;
            }
        }
        
        this.curGameStatus=GameStatus.ready;
        
        this.initMapData();
        
        this.dispatchEvent(GameLogicPure.event_game_logic_dispatch_ready,
            {
                userId1:players[0],
                userId2:players[1],
                mapData:this.mapData,
                mapFrozenIndex:this.mapFrozenIndex
            }
        );
    }
    
    private go(){
        this.dispatchEvent(GameLogicPure.event_game_logic_dispatch_go);
    }
    
    private registEvent(){
        cc.game.on(GameLogicPure.event_game_logic_response_start_game,this.onStartGameEvent,this);
    }
    
    private unregistEvent(){
        cc.game.off(GameLogicPure.event_game_logic_response_start_game,this.onStartGameEvent,this);
    }
    
    private onStartGameEvent(event:cc.Event.EventCustom){
        this.ready([0,1],true);
    }
    
    
    public pauseGame() {
        this.curGameStatus=GameStatus.pause;
        
        this.dispatchEvent(GameLogicPure.event_game_logic_dispatch_pause);
    }
    
    public update(){
        let updataIntervalTime = 1/this.framePerSecond;
        
        if(this.curGameStatus==GameStatus.ready){
            this.updateReadyGo(updataIntervalTime);
        }
        
        if(this.curGameStatus==GameStatus.start){
            this.updateFallWater(updataIntervalTime); 
            this.updateAI(updataIntervalTime);
        }
        
        // this.frameIndex++;
    }
    
    
    public updateReadyGo(dt){
        this.readyTime-=dt;
        if(this.readyTime<=0){
            this.curGameStatus = GameStatus.start;
            this.readyTime=1;
            this.dispatchEvent(GameLogicPure.event_game_logic_dispatch_go);
        }
    }
    
    private updateFallWater(dt){
        for (const key in this.playersMap) {
            let playerData = this.playersMap[key];
            if(playerData.fallWaterTime>0){
                playerData.fallWaterTime-=dt;
                if(playerData.fallWaterTime<=0){
                    playerData.fallWaterTime=0;
                    this.dispatchEvent(GameLogicPure.event_game_logic_dispatch_outwater,{userId:playerData.userId});
                }
            }
        }
    }
    
    private AIJumpTime:number=2; 
    private AIJumpSucRate:number=85;
    
    private updateAI(dt){
        // return;
    
        let jumpIntervalTime:number=0.8;

        for (const key in this.playersMap) {
            let playerData = this.playersMap[key];
            if(playerData.robot==true && playerData.fallWaterTime<=0){
                if(this.AIJumpTime<=0) {
                    let nextPosLeftOrRight = this.mapData[playerData.posMapIndex+1];
                    let jumpDir = nextPosLeftOrRight; 
                    let random = this.getRandom();
                    if(random>this.AIJumpSucRate) {
                        if(jumpDir==LeftOrRight.left){
                            jumpDir = LeftOrRight.right;
                        }else{
                            jumpDir = LeftOrRight.left;
                        }
                    }
                    this.jump(playerData.userId,jumpDir);
                    if(this.AIJumpTime<=0){
                        this.AIJumpTime = jumpIntervalTime;
                    }
                }
                this.AIJumpTime-=dt; 
                break;
            }
        }
    }
    
    private initMapData(){
        this.mapData = [];
        this.mapFrozenIndex=[];
        for(let i=0;i<this.mapLength;i++){
            let random = this.getRandom();
            let leftOrRight = (random>50)?LeftOrRight.right:LeftOrRight.left;
            this.mapData.push(leftOrRight);
            
            if(i%this.mapFrozenInterval==0 && i!=0){
                this.mapFrozenIndex.push(i);
            }
        }
    }
    
    private getRandom():number{
        let random:number = 0;
        if(this.random==null || this.random.length==0){
            random = Math.random()*100;
        }else{
            random = this.random[this.curRandomIndex];
            this.curRandomIndex++;
            if(this.curRandomIndex>=this.random.length){
                this.curRandomIndex=0;
            }
        }
        
        return random;
    }


    public jump(userId:number,jumpDir:LeftOrRight){
        if(this.curGameStatus!=GameStatus.start){
            return;
        }
    
        let playerData = this.playersMap[userId];
        if(playerData.fallWaterTime>0){
            return;
        }
        
        if(playerData.forzend>0){
            this.iceBreaking(userId);
            return; 
        }
        
        let nextPosLeftOrRight = this.mapData[playerData.posMapIndex+1];
        if(nextPosLeftOrRight==jumpDir){
            if(playerData.posMapIndex<this.mapData.length-1){
                playerData.posMapIndex++; 
            }
            
            if(jumpDir==LeftOrRight.left){
                this.dispatchEvent(GameLogicPure.event_game_logic_dispatch_jumpleft,{userId:userId,posMapIndex:playerData.posMapIndex});
            }else{
                this.dispatchEvent(GameLogicPure.event_game_logic_dispatch_jumpright,{userId:userId,posMapIndex:playerData.posMapIndex});
            }
            
            if(this.winOrLose(userId)==false){
                this.forzend(userId);
            }
        }else{
            this.fallWater(userId)
        }
    
        
    }
    
    private winOrLose(userId:number):boolean{
        let playerData = this.playersMap[userId];
        if(playerData.posMapIndex>=this.mapData.length-1){
            this.endGame(userId);
            return true;
        }
        return false;
    }
    
    private endGame(winUserId:number){
        this.curGameStatus = GameStatus.end;
        this.dispatchEvent(GameLogicPure.event_game_logic_dispatch_end_game,{winUserId:winUserId});
        
        // this.unregistEvent();
    }
    
     
    
    private iceBreaking(userId:number){
        if(this.curGameStatus!=GameStatus.start){
            return;
        }
        
        let playerData = this.playersMap[userId];
        if(playerData.forzend>0){
            playerData.forzend--;
        }
        
        this.dispatchEvent(GameLogicPure.event_game_logic_dispatch_icebreaking,{userId:userId,forzend:playerData.forzend});
        if(playerData.forzend<=0){
            this.dispatchEvent(GameLogicPure.event_game_logic_dispatch_outforzen,{userId:userId});
        }
    }
    
    
    private forzend(userId:number){
        let playerData:PlayerData = this.playersMap[userId];
        let otherPlayData:PlayerData=null;
        for (const keyUserId in this.playersMap) {
            if(Number(keyUserId)!=userId) {
                otherPlayData=this.playersMap[keyUserId];
                break;
            }
        }
      

    
        for(let i=0;i<this.mapFrozenIndex.length;i++) {
            if(otherPlayData!=null && otherPlayData.posMapIndex == this.mapFrozenIndex[i] && otherPlayData.forzend>0){
                continue;
            }
        
            if(playerData.posMapIndex == this.mapFrozenIndex[i] ){
                let random = this.getRandom();
                if(random<this.forzenRate){
                    playerData.forzend=this.iceSaveTimes;
                    this.dispatchEvent(GameLogicPure.event_game_logic_dispatch_forzen,{userId:userId,forzeTimes:this.iceSaveTimes});
                    break;
                }
            }
        }
        
    }
    
    private fallWater(userId:number){
        let playerData = this.playersMap[userId];
        playerData.fallWaterTime = this.fallWaterTime;
        
        this.dispatchEvent(GameLogicPure.event_game_logic_dispatch_fallwater,{userId:userId});
    }
    
    public getSelfPlayerData():PlayerData{
        return this.playersMap[this.selfPlayerId];
    }
    
    public checkLastJump():boolean{
        if(this.mapData.length<=0){
            return false;
        }
    
        let mapLength = this.mapData.length;
        if((this.getSelfPlayerData().posMapIndex+1)>=mapLength){
            return true;    
        }
        return false;
    }
    

    private dispatchEvent(eventName:string,data:object=null){
        let event = new cc.Event.EventCustom(eventName,true);
        if(data!=null){
            event.setUserData(data);
        }
        cc.game.dispatchEvent(event);
    }
}
