import DataBase from "./DataBase";
import HttpTools from "../net/HttpTools";

export default class DataAccount extends DataBase{
    private _nickname:string="";
    public get Nickname():string{
        return this._nickname;
    }
    private _logo:string="";
    public get Logo():string{
        return this._logo;
    }
    private _diamond:number=0;
    public get Diamond():number{
        return this._diamond;
    }
    private _winNum:number=0;
    public get WinNum():number{
        return this._winNum;
    }
    private _allNum:number=0;
    public get AllNum():number{
        return this._allNum;
    }
    private _winRate:number=0;
    public get WinRate():number{
        return this._winRate;
    }

    public get UserId():number{
        return this._userId;
    }
    public set UserId(v){
        this._userId = v;
    }

    private _userId:number=0;

    private _session:string="";
    public get Session():string{
        return this._session;
    }
    public set Session(v){
        this._session=v;
    }

    private _skin:number=0;
    public set Skin(skin:number){
        this._skin = skin;
    }
    public get Skin(){
        return this._skin;
    }
    private _hammer:number=0;
    public get Hammer(){
        return this._hammer;
    }
    public set Hammer(v){
        this._hammer=v;
    }
    
    public constructor() {
        super();
    }


    public login(callback) {
        let code = Math.floor(Math.random()*1000);
        let self = this;
        HttpTools.httpRequestByBase("s=/Mj/Login/login&loginType=1&code="+code,function(resData){
            let statusCode = resData["statusCode"];
            let data = resData["data"];
            let sessionId = resData["sessionId"];
            let user = data["user"];
            let userId = user["userId"];
            let nickname = user["nickname"];
            let logo = user["logo"];
            let diamond = user["diamond"];
            let winNum = user["winNum"];
            let allNum = user["allNum"];
            let winRate = user["winRate"];
            let skinId = user["skinId"];
            let hammer = user["hammer"];
            self._userId = userId;
            self._nickname = nickname;
            self._logo = logo;
            self._diamond = diamond;
            self._winNum = winNum;
            self._allNum = allNum;
            self._winRate = winRate;
            self._session = sessionId;
            self._skin = skinId;
            self._hammer = hammer;

            if(callback){
                callback(statusCode);
            }
        });
    }
    
}
