import DataBase from "./DataBase";
import DataAccount from "./DataAccount";

export default class DataManager{
    private static _instance:DataManager=null;
    private _instanceMap:{[key:string]:DataBase}=null;
    
    private constructor(){
        this.registData();
    }
    
    private registData(){
        this._instanceMap = {};
        this._instanceMap["account"] = new DataAccount();
    }

    public static getInstance():DataManager{
        if(this._instance==null){
            this._instance=new DataManager();
        }
        return this._instance;
    }

    public getDataInstance(dataName:string):DataBase{
        let name = dataName.toLowerCase();
        if(this._instanceMap[name]){
            let dataInstance:DataBase = this._instanceMap[name];
            return dataInstance;
        }
        return null;
    }
}
