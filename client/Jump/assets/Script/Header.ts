const {ccclass, property} = cc._decorator;

@ccclass
export default class Header extends cc.Component {
    @property(cc.Label) 
    public labelTitle:cc.Label=null;

    @property(cc.ProgressBar)
    public progress:cc.ProgressBar=null;
    
    @property(cc.Sprite)
    public headerImgRed:cc.Sprite=null;
    
    @property(cc.Sprite)
    public headerImgBlue:cc.Sprite=null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    
    

    public setProgress(blueLength:number,redLength:number,totalLength:number){
        let offset = blueLength-redLength;
        this.progress.progress=(offset+0.5*totalLength)/totalLength;
        if(offset>=0){
            this.labelTitle.string="领先"+offset+"米";
        }else{
            this.labelTitle.string="落后"+Math.abs(offset)+"米";
        }
    }

    // update (dt) {}
}
