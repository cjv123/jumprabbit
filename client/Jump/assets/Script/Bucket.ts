const {ccclass, property} = cc._decorator;

@ccclass
export default class Bucket extends cc.Component {
    @property(cc.Node)
    public bucketNormal:cc.Node=null;
    
    @property(cc.Node)
    public bucketForzen:cc.Node=null;
    
    @property(cc.Label)
    public labelForzen:cc.Label=null;
    
    @property(cc.Sprite)
    public spriteHeader:cc.Sprite=null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        this.setForzen(false,0);
    }
    
    public setForzen(forzen:boolean,frozenTimes:number){
        if(forzen==true){
            this.bucketNormal.active=false;
            this.bucketForzen.active=true;
            let shakeSeq = cc.sequence(cc.moveBy(0.1,cc.v2(5,0)),cc.moveBy(0.1,cc.v2(-5,0)));
            this.node.runAction(cc.repeatForever(shakeSeq));
        }else{
            this.bucketNormal.active=true;
            this.bucketForzen.active=false;
            this.node.stopAllActions();
        }
        this.labelForzen.string = frozenTimes+"";
    }
    
    public iceBreaking(frozenTimes:number){
        this.labelForzen.string = frozenTimes+"";
        if(frozenTimes<=0){
            this.setForzen(false,0);
            // this.node.active=false;
        }
    }

    // update (dt) {}
}
