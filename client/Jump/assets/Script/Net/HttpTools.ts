// import DataAccount from "../data/DataAccount";
// import DataManager from "../data/DataManager";
import NetConfig from "./NetConfig";

export default class HttpTools {
    static httpRequest(url:string,callback:Function){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if(xhr.status >= 200 && xhr.status < 400){
                    var response = xhr.responseText;
                    console.log("http res suc:",response);
                    if(callback){
                        var dataObj = JSON.parse(response);
                        callback(dataObj);
                    }
                }else{
                    console.log("error status:",xhr.status);
                }
            }
        };
        xhr.open("GET", url, true);
        xhr.send();
        
        console.log("http req:"+url);
    }
    
    static httpRequestByBase(url:string,callback:Function){
        HttpTools.httpRequest(NetConfig.HttpUrlBase+url,callback);
    }
    
    /*
    static httpRequestByBaseSession(url:string,callback:Function){
        let dataAccount:DataAccount = DataManager.getInstance().getDataInstance("account") as DataAccount;
        let reqUrl = NetConfig.HttpUrlBase+ url + "&sessionId="+dataAccount.Session;
        HttpTools.httpRequest(reqUrl,callback);
    }
    */

}
