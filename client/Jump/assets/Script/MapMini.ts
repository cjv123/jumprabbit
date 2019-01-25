const {ccclass, property} = cc._decorator;

@ccclass
export default class MapMini extends cc.Component {
    @property(cc.ProgressBar)
    public proBlue:cc.ProgressBar=null;
    @property(cc.ProgressBar)
    public proRed:cc.ProgressBar=null;
    
    @property(cc.Node)
    public flagBlue:cc.Node=null;
    @property(cc.Node)
    public falgRed:cc.Node=null;
    

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
    }
    
    public setProgress(pre:number,isblue:boolean){
        if(isblue==true){
            this.proBlue.progress = pre;
            this.flagBlue.setPosition(cc.v2(this.flagBlue.getPosition().x,337*pre));
        }else{
            this.proRed.progress = pre; 
            this.falgRed.setPosition(cc.v2(this.falgRed.getPosition().x,337*pre));
        }
        if(this.proBlue.progress>this.proRed.progress)        {
            this.proBlue.node.zIndex=90;
            this.proRed.node.zIndex=100;
        }else{
            this.proBlue.node.zIndex=100;
            this.proRed.node.zIndex=90;
        }
        

    }

    // update (dt) {}
}
