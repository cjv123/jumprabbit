import GameLogicPure from "./gameLogicPure/GameLogicPure";
import Player from "./Player";
import TouchLayer from "./TouchLayer";
import Bucket from "./Bucket";
import MapMini from "./MapMini";
import Header from "./Header";
import ReadyGo from "./ReadyGo";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MapRoad extends cc.Component {
    @property(cc.SpriteFrame)
    public mapTileSpriteFrame:cc.SpriteFrame=null;
    
    @property(cc.SpriteFrame)
    public mapEndSpriteFrame:cc.SpriteFrame=null; 
    
    @property(cc.Prefab)
    public playerPrefab:cc.Prefab=null;
    
    @property(TouchLayer)
    public touchLayer:TouchLayer=null;
    
    @property(cc.Prefab)
    public buckPrefab:cc.Prefab=null;
    
    @property(MapMini)
    public mapMiniCom:MapMini=null;
    
    @property(Header)
    public headerCom:Header=null;
    
    @property(ReadyGo)
    public readyGo:ReadyGo=null;
    
    private _tileLeftX = 200;
    private _tileRightX = 500;
    

    private _mapData=null;
    private _mapFrozenIndex=null;
    
    private _tileInterval=220;
   
    private _gameLogicPure:GameLogicPure=null;
    
    private _mapTileArr:cc.Node[]=null;
    
    private _playersArr:cc.Node[]=null;
    
    private _buketNodeMap:{[key:number]:cc.Node}=null;
    
    private _endNode:cc.Node=null;
    
    private _playerPosOffset:cc.Vec2=cc.v2(10,75);
    
    private _playerCurMapIndexMap:{[key:number]:number}=null;
    
    
    private readonly _jumpMoveToTag=1000;
    private readonly _scrollMoveByTag=1000;
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this._gameLogicPure = GameLogicPure.getInstance();
    }
    
    onLoad(){
        cc.game.on(GameLogicPure.event_game_logic_dispatch_ready,this.onReadyGameEvent,this);
        cc.game.on(GameLogicPure.event_game_logic_dispatch_go,this.onGoGameEvent,this);
        cc.game.on(GameLogicPure.event_game_logic_dispatch_jumpleft,this.onJumpLeftEvent,this);
        cc.game.on(GameLogicPure.event_game_logic_dispatch_jumpright,this.onJumpRightEvent,this);
        cc.game.on(GameLogicPure.event_game_logic_dispatch_end_game,this.onEndGameEvent,this);
        cc.game.on(GameLogicPure.event_game_logic_dispatch_fallwater,this.onFallWaterEvent,this);
        cc.game.on(GameLogicPure.event_game_logic_dispatch_outwater,this.onOutWaterEvent,this);
        cc.game.on(GameLogicPure.event_game_logic_dispatch_forzen,this.onForzenEvent,this);
        cc.game.on(GameLogicPure.event_game_logic_dispatch_outforzen,this.onOutForzenEvent,this);
        cc.game.on(GameLogicPure.event_game_logic_dispatch_icebreaking,this.onIceBreakingEvent,this);
    }
    
    onDisable(){
        cc.game.off(GameLogicPure.event_game_logic_dispatch_ready,this.onReadyGameEvent,this);
        cc.game.off(GameLogicPure.event_game_logic_dispatch_go,this.onGoGameEvent,this);
        cc.game.off(GameLogicPure.event_game_logic_dispatch_jumpleft,this.onJumpLeftEvent,this);
        cc.game.off(GameLogicPure.event_game_logic_dispatch_jumpright,this.onJumpRightEvent,this);
        cc.game.off(GameLogicPure.event_game_logic_dispatch_end_game,this.onEndGameEvent,this);
        cc.game.off(GameLogicPure.event_game_logic_dispatch_fallwater,this.onFallWaterEvent,this);
        cc.game.off(GameLogicPure.event_game_logic_dispatch_outwater,this.onOutWaterEvent,this);
        cc.game.off(GameLogicPure.event_game_logic_dispatch_forzen,this.onForzenEvent,this);
        cc.game.off(GameLogicPure.event_game_logic_dispatch_outforzen,this.onOutForzenEvent,this);
        cc.game.off(GameLogicPure.event_game_logic_dispatch_icebreaking,this.onIceBreakingEvent,this);
    }
    
    onReadyGameEvent(event:cc.Event.EventCustom){
        let resData = event.getUserData();
        let mapData = resData["mapData"];
        let mapFrozenIndex = resData["mapFrozenIndex"];
        this._mapData = mapData;
        this._mapFrozenIndex = mapFrozenIndex; 
        this.initMap();
        let userIdArr=[];
        if(resData.userId1!=undefined){
            userIdArr.push(resData.userId1);
        }
        if(resData.userId2!=undefined){
            userIdArr.push(resData.userId2);
        }
        this.initPlayer(userIdArr);
        this.readyGo.playReady();
        this.touchLayer.TouchEnable=false;
    }
    
    onGoGameEvent(event:cc.Event.EventCustom){
        this.readyGo.playGo();
        this.touchLayer.TouchEnable=true;
    }
    
    onEndGameEvent(event:cc.Event.EventCustom){
        let resData = event.getUserData();
        let winUserId = resData["winUserId"];
        let winPlayerNode:cc.Node = null;
    
        for(let i=0;i<this._playersArr.length;i++){
            let playerNode:cc.Node = this._playersArr[i];
            let player:Player = playerNode.getComponent(Player);
            if(player.UserId==winUserId){
                winPlayerNode = playerNode; 
                break;
            }
        }
        
        if(winPlayerNode!=null){
            let endPos = this._endNode.getPosition();
            let moveTo = cc.moveTo(0.4,endPos.add(cc.v2(-0,150)));
            let seq = cc.sequence(cc.delayTime(0.2),moveTo);
            winPlayerNode.runAction(seq);
        }
    }
    
    private initMap(){
        if(this._mapData!=null){
            this._mapTileArr=[];
            this._buketNodeMap={};
        
            for(let i=0;i<this._mapData.length;i++){
                let leftOrRight = this._mapData[i];
                let tileNode:cc.Node = new cc.Node();
                tileNode.addComponent(cc.Sprite);
                tileNode.getComponent(cc.Sprite).spriteFrame = this.mapTileSpriteFrame;
                tileNode.setAnchorPoint(cc.v2(0.5,0));
                this.node.addChild(tileNode);
                let x = (leftOrRight==0)?this._tileLeftX:this._tileRightX;
                let y = i*this._tileInterval;
                tileNode.setPosition(cc.v2(x,y));
                this._mapTileArr.push(tileNode);
                
                for(let j=0;j<this._mapFrozenIndex.length;j++){
                    if(this._mapFrozenIndex[j]==i)    {
                        let bruckNode:cc.Node = cc.instantiate(this.buckPrefab);
                        this.node.addChild(bruckNode);
                        bruckNode.setPosition(cc.v2(x,y)) ;
                        this._buketNodeMap[i]=bruckNode;
                        break;
                    }
                }
            }
            
            let endNode:cc.Node = new cc.Node(); 
            endNode.addComponent(cc.Sprite);
            endNode.getComponent(cc.Sprite).spriteFrame = this.mapEndSpriteFrame;
            endNode.setAnchorPoint(cc.v2(0.5,0));
            this.node.addChild(endNode);

            let lastTileNode = this._mapTileArr[this._mapTileArr.length-1];
            endNode.setPosition(cc.v2(cc.winSize.width/2,lastTileNode.getPosition().y + this._tileInterval));
            this._endNode=endNode;
        }
    }
    
    private initPlayer(playerInfo){
        this._playersArr=[];
        this._playerCurMapIndexMap={};
    
        let tileNodeStart:cc.Node = this._mapTileArr[0];
        for(let i=0;i<playerInfo.length;i++){
            let playerNode:cc.Node = cc.instantiate(this.playerPrefab);
            this._playersArr.push(playerNode);
            this.node.addChild(playerNode);
            playerNode.setPosition(cc.v2(tileNodeStart.getPosition().add(this._playerPosOffset)));
            
            let player:Player = playerNode.getComponent(Player);
            player.UserId = playerInfo[i];
            if(i==0){
                player.setColor(true);
            }
            
            this._playerCurMapIndexMap[player.UserId]=0;
        }
    }
    
    private scrollMap(scrollY:number){
        let moveBy = cc.moveBy(0.2,cc.v2(0,scrollY));
        moveBy.setTag(this._scrollMoveByTag);
        // this.node.stopActionByTag(this._scrollMoveByTag);
        this.node.runAction(moveBy);
    }
    

    private jump(userId:number,leftOrRight:number){
        let jumpPlayerNode:cc.Node = null;
        let blue:boolean=false;
    
        for(let i=0;i<this._playersArr.length;i++){
            let playerNode:cc.Node = this._playersArr[i];
            let player:Player = playerNode.getComponent(Player);
            if(player.UserId==userId){
                jumpPlayerNode = playerNode; 
                if(i==0){
                    blue=true;
                }
                break;
            }
        }

        if(jumpPlayerNode!=null){
            let curMapIndex = this._playerCurMapIndexMap[userId];
            if(curMapIndex<this._mapTileArr.length-1){
                let nextTileNode:cc.Node = this._mapTileArr[curMapIndex+1];
                let nextPos = cc.v2(nextTileNode.getPosition().add(this._playerPosOffset));
                let moveTo = cc.moveTo(0.1,nextPos);
                moveTo.setTag(this._jumpMoveToTag);
                jumpPlayerNode.stopActionByTag(this._jumpMoveToTag);
                jumpPlayerNode.runAction(moveTo);
                
                this._playerCurMapIndexMap[userId]=curMapIndex+1;
                
                let gamelogicPure:GameLogicPure = GameLogicPure.getInstance();
                if(userId==gamelogicPure.SelfPlayerId && curMapIndex>2){
                    this.scrollMap(-this._tileInterval);
                }
                
                this.mapMiniCom.setProgress(this._playerCurMapIndexMap[userId]/this._mapData.length,blue);
                
                let redLength=0;
                let blueLength=0;
                let totalLength=this._mapData.length;
                for(let i=0;i<this._playersArr.length;i++){
                    let playerNode:cc.Node = this._playersArr[i];
                    let player:Player = playerNode.getComponent(Player);
                    if(i==0){
                        blueLength = this._playerCurMapIndexMap[player.UserId]+1;
                    }else{
                        redLength = this._playerCurMapIndexMap[player.UserId]+1;
                    }
                }
                
                this.headerCom.setProgress(blueLength,redLength,totalLength);
           }
        }
    }
    
    
    private jumpToPos(userId:number,mapIndex:number){
        let jumpPlayerNode:cc.Node = null;
        let blue:boolean=false;
    
        for(let i=0;i<this._playersArr.length;i++){
            let playerNode:cc.Node = this._playersArr[i];
            let player:Player = playerNode.getComponent(Player);
            if(player.UserId==userId){
                jumpPlayerNode = playerNode; 
                if(i==0){
                    blue=true;
                }
                break;
            }
        }

        if(jumpPlayerNode!=null){
            let curMapIndex = this._playerCurMapIndexMap[userId];
            let nextTileNode:cc.Node = this._mapTileArr[mapIndex];
            if(mapIndex>curMapIndex && nextTileNode!=undefined){
                let nextPos = cc.v2(nextTileNode.getPosition().add(this._playerPosOffset));
                let moveTo = cc.moveTo(0.1,nextPos);
                moveTo.setTag(this._jumpMoveToTag);
                jumpPlayerNode.stopActionByTag(this._jumpMoveToTag);
                jumpPlayerNode.stopAllActions();
                jumpPlayerNode.runAction(moveTo);
                
                let gamelogicPure:GameLogicPure = GameLogicPure.getInstance();
                if(userId==gamelogicPure.SelfPlayerId && curMapIndex>1){
                    this.scrollMap(-this._tileInterval);
                }
                this._playerCurMapIndexMap[userId]=curMapIndex+1;                    
                
                this.mapMiniCom.setProgress((this._playerCurMapIndexMap[userId]+1)/this._mapData.length,blue);
                

                let redLength=0;
                let blueLength=0;
                let totalLength=this._mapData.length;
                for(let i=0;i<this._playersArr.length;i++){
                    let playerNode:cc.Node = this._playersArr[i];
                    let player:Player = playerNode.getComponent(Player);
                    if(i==0){
                        blueLength = this._playerCurMapIndexMap[player.UserId]+1;
                    }else{
                        redLength = this._playerCurMapIndexMap[player.UserId]+1;
                    }
                }
                
                this.headerCom.setProgress(blueLength,redLength,totalLength);
            }
        }
    }
    
    private fallWater(userId:number){
        let fallPlayerNode:cc.Node = null;
    
        for(let i=0;i<this._playersArr.length;i++){
            let playerNode:cc.Node = this._playersArr[i];
            let player:Player = playerNode.getComponent(Player);
            if(player.UserId==userId){
                fallPlayerNode = playerNode; 
                break;
            }
        }
        
        if(fallPlayerNode!=null){
            let fallPlayer:Player = fallPlayerNode.getComponent(Player);
            let curMapIndex = this._playerCurMapIndexMap[userId];
            let curTileNode:cc.Node = this._mapTileArr[curMapIndex];
            let nextTileNode:cc.Node = this._mapTileArr[curMapIndex+1];
            let nextLeftOrRight = this._mapData[curMapIndex+1];
            
            let fallPos = cc.v2((nextLeftOrRight==1)?this._tileLeftX:this._tileRightX,nextTileNode.getPosition().y).add(this._playerPosOffset);
            
            let shakeActions:cc.FiniteTimeAction[] =[];
            for(let i=0;i<5;i++){
                let v2 = cc.v2(0,5);
                if(i%2==0){
                    v2 = cc.v2(0,-5);
                }
                let moveto = cc.moveBy(0.1,v2);
                shakeActions.push(moveto);
            }
            let shakeSeq = cc.sequence(shakeActions);
            
            let seq = cc.sequence(
                cc.moveTo(0.1,fallPos),
                cc.callFunc(function(){
                    fallPlayer.setFallWater(true);
                }),
                shakeSeq
            );

            fallPlayerNode.stopAllActions();
            fallPlayerNode.runAction(seq);
            
            let gameLogicPure:GameLogicPure = GameLogicPure.getInstance();
            if(gameLogicPure.SelfPlayerId == userId){
                this.touchLayer.TouchEnable=false;
            }
        }
    }
    
    private outWater(userId:number){
        let fallPlayerNode:cc.Node = null;
    
        for(let i=0;i<this._playersArr.length;i++){
            let playerNode:cc.Node = this._playersArr[i];
            let player:Player = playerNode.getComponent(Player);
            if(player.UserId==userId){
                fallPlayerNode = playerNode; 
                break;
            }
        }
        
        if(fallPlayerNode!=null){
            let fallPlayer:Player = fallPlayerNode.getComponent(Player);
            let curMapIndex = this._playerCurMapIndexMap[userId];
            let curTileNode:cc.Node = this._mapTileArr[curMapIndex];
            
            let curPos = cc.v2(curTileNode.getPosition().add(this._playerPosOffset));
            let moveTo = cc.moveTo(0.1,curPos);
            fallPlayer.setFallWater(false);
            
            fallPlayerNode.stopAllActions();
            fallPlayerNode.runAction(moveTo);
        }
        
        this.touchLayer.TouchEnable=true;
    }
    
    private forzend(userId:number,forzenTimes:number){
        let forzendPlayerNode:cc.Node = null;
    
        for(let i=0;i<this._playersArr.length;i++){
            let playerNode:cc.Node = this._playersArr[i];
            let player:Player = playerNode.getComponent(Player);
            if(player.UserId==userId){
                forzendPlayerNode = playerNode; 
                break;
            }
        }
        
        if(forzendPlayerNode!=null){
            // forzendPlayerNode.active=false; 
            forzendPlayerNode.runAction(cc.sequence(cc.delayTime(0.2),cc.hide()));
            let curMapIndex = this._playerCurMapIndexMap[userId];
            let bucketNode:cc.Node = this._buketNodeMap[curMapIndex];
            if(bucketNode!=undefined){
                let bucketCom:Bucket = bucketNode.getComponent(Bucket);
                bucketCom.setForzen(true,forzenTimes);
            }
        }
        
    }
    
    private outForzend(userId:number){
        let forzendPlayerNode:cc.Node = null;
    
        for(let i=0;i<this._playersArr.length;i++){
            let playerNode:cc.Node = this._playersArr[i];
            let player:Player = playerNode.getComponent(Player);
            if(player.UserId==userId){
                forzendPlayerNode = playerNode; 
                break;
            }
        }
        
        if(forzendPlayerNode!=null){
            // forzendPlayerNode.active=true; 
            forzendPlayerNode.runAction(cc.show());
            let curMapIndex = this._playerCurMapIndexMap[userId];
            let bucketNode:cc.Node = this._buketNodeMap[curMapIndex];
            if(bucketNode!=undefined){
                let bucketCom:Bucket = bucketNode.getComponent(Bucket);
                bucketCom.setForzen(false,10);
            }
        }
    }
    
    private iceBreking(userId:number,forzenTimes:number){
        let forzendPlayerNode:cc.Node = null;
    
        for(let i=0;i<this._playersArr.length;i++){
            let playerNode:cc.Node = this._playersArr[i];
            let player:Player = playerNode.getComponent(Player);
            if(player.UserId==userId){
                forzendPlayerNode = playerNode; 
                break;
            }
        }
        
        if(forzendPlayerNode!=null){
            let curMapIndex = this._playerCurMapIndexMap[userId];
            let bucketNode:cc.Node = this._buketNodeMap[curMapIndex];
            if(bucketNode!=undefined){
                let bucketCom:Bucket = bucketNode.getComponent(Bucket);
                bucketCom.iceBreaking(forzenTimes);
            }
        }
    }
    
    private onOutWaterEvent(event:cc.Event.EventCustom){
        // console.log("onOutWaterEvent");
    
        let resData = event.getUserData();
        let userId = resData["userId"];
        this.outWater(userId);
    }
    
    private onFallWaterEvent(event:cc.Event.EventCustom){
        let resData = event.getUserData(); 
        let userId = resData["userId"];
        this.fallWater(userId);
    }
    
    private onJumpLeftEvent(event:cc.Event.EventCustom){
        // console.log("onJumpLeftEvent");
        let resData = event.getUserData();
        let userId = resData["userId"];
        let mapIndex = resData["posMapIndex"]
        this.jumpToPos(userId,mapIndex);
    }
    
    private onJumpRightEvent(event:cc.Event.EventCustom){
        // console.log("onJumpRightEvent");
        let resData = event.getUserData();
        let userId = resData["userId"];
        let mapIndex = resData["posMapIndex"]
        this.jumpToPos(userId,mapIndex);
    }
    
    private onForzenEvent(event:cc.Event.EventCustom){
        let resData = event.getUserData(); 
        let userId = resData["userId"];
        let forzeTimes = resData["forzeTimes"];
        this.forzend(userId,forzeTimes);
    }
    
    private onOutForzenEvent(event:cc.Event.EventCustom){
        let resData = event.getUserData();
        let userId = resData["userId"];
        this.outForzend(userId);
    }
    
    private onIceBreakingEvent(event:cc.Event.EventCustom){
        let resData = event.getUserData(); 
        let userId = resData["userId"];
        let forzend = resData["forzend"];
        this.iceBreking(userId,forzend);
    }
    
    
    update(dt){
        
    }

    // update (dt) {}
}
