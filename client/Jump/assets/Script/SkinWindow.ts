import SkinPref from "./SkinPref";
import WindowsController from "./WindowsController";
import DataAccount from "./data/DataAccount";
import DataManager from "./data/DataManager";
import HttpTools from "./net/HttpTools";
import DialogController from "./DialogController";
import Loading from "./Loading";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SkinWindow extends cc.Component {

    @property(cc.Sprite)
    public spriteCurSkin:cc.Sprite=null;

    @property([SkinPref])
    public spriteSkins:SkinPref[]=[];

    

    private curIndex:number=0;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        let dataAccount:DataAccount = DataManager.getInstance().getDataInstance("account") as DataAccount;
        this.curIndex = dataAccount.Skin;
        this.setSkin();
    }

    setSkin(){
        for(let i=0;i<this.spriteSkins.length;i++){
            if(this.curIndex==i){
                this.spriteSkins[i].select(true);
                this.spriteCurSkin.spriteFrame = this.spriteSkins[i].spriteIcon.spriteFrame;
            }else{
                this.spriteSkins[i].select(false);
            }
        }
    }

    public leftButtonClick(){
        this.curIndex--;
        if (this.curIndex < 0) {
            this.curIndex = this.spriteSkins.length-1;
        }
        this.setSkin();
    }

    public rightButtonClick(){
        this.curIndex++;
        if (this.curIndex > this.spriteSkins.length - 1) {
            this.curIndex = 0;
        }
        this.setSkin();
    }

    public onCloseButtonClick(){
        WindowsController.hideWindow(this.node);
    }

    public onSkinUseButtonClick(){
        Loading.showLoading(true);
        HttpTools.httpRequestByBaseSession("s=/Mj/User/useSkin&skinId="+this.curIndex,function(resData){
            let ret = resData["statusCode"];
            if(ret==0){
                DialogController.show("皮肤设置成功");
            }
            Loading.showLoading(false);
        });
    }

    // update (dt) {}
}
