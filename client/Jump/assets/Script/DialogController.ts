import WindowsController from "./WindowsController";

const {ccclass, property} = cc._decorator;

@ccclass
export default class DialogController extends cc.Component {
    @property(cc.Node)
    public dialogContent:cc.Node=null;

    @property(cc.Prefab)
    public dialogWindowPrefab:cc.Prefab=null;

    @property(cc.Prefab)
    public dialogOkCancelWinPrefab:cc.Prefab=null;

    @property(cc.Prefab)
    public dialogDiamondNoEnough:cc.Prefab=null;

    public static show(title:string){
        let windowsNode:cc.Node = cc.find("windows",cc.Canvas.instance.node);
        if(windowsNode){
            let dialogController:DialogController = windowsNode.getComponent(DialogController);
            if(dialogController){
                dialogController.showDialog(title);
            }
        }
    }


    public static showDiamondNoEnough(){
        let windowsNode:cc.Node = cc.find("windows",cc.Canvas.instance.node);
        if(windowsNode){
            let dialogController:DialogController = windowsNode.getComponent(DialogController);
            if(dialogController){
                dialogController.showDiamondNoEnough();
            }
        }
    }

    public showDiamondNoEnough(){
        let dialogWinNode:cc.Node = cc.instantiate(this.dialogDiamondNoEnough);
        this.dialogContent.addChild(dialogWinNode);
        dialogWinNode.active=false;
        WindowsController.showWindow(dialogWinNode);
    }


    public showDialog(title:string){
        let dialogNode:cc.Node = cc.instantiate(this.dialogWindowPrefab);
        this.dialogContent.addChild(dialogNode);
        let labelNode:cc.Node = cc.find("label",dialogNode);
        if(labelNode){
            let label:cc.Label = labelNode.getComponent(cc.Label);
            if(label){
                label.string = title;
            }
        }
        // dialogNode.setPosition(cc.v2(750/2,1334/2));

        let seq = cc.sequence(
            cc.delayTime(2),
            cc.removeSelf()
        );
        dialogNode.runAction(seq);
    }



    // update (dt) {}
}
