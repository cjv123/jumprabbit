const {ccclass, property} = cc._decorator;

@ccclass
export default class MailItem extends cc.Component {
    @property(cc.Label)
    public labelTitle:cc.Label=null;

    @property(cc.Label)
    public labelContent:cc.Label=null;

    @property(cc.Label)
    public lableTime:cc.Label=null;
    
    @property(cc.Node)
    public buttonInfo:cc.Node=null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    public setTitle(title:string){
        this.labelTitle.string = title;
    }

    public setContent(content:string){
        this.labelContent.string = content;
    }

    public setTime(time:string){
        this.lableTime.string =time;
    }

    

    // update (dt) {}
}
