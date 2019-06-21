class Const {
    public static readonly GameVersion: string = "1.1.1";
    public static readonly WechatAppId = "wx9cd567c0c030561b";
    public static readonly LocalDebug:boolean = false;//本地强制开启调试，用于微信开发者工具读取线上未开启调试时
    public static readonly ShareTitle:string = "";
    public static readonly ImgUrl:string = "";
}

class GlobalData {
    public static Instance: GlobalData = null;
    public static GAMEDATA_PATH: string = "gamedata.json";
    public static GameVersion: string = "GameVersion";//服务器线上版本号
    private data:JSON;
    
    constructor() {
        this.data = Laya.Loader.getRes(GlobalData.GAMEDATA_PATH);
        Laya.loader.clearRes(GlobalData.GAMEDATA_PATH);
    }

    //获取指定型号的广告高度.iphoneX:251 其他:215
    getBannerHeight(key: string, r: number) {
        if (this.data == null || this.data["BannerInfo"] == null)
            return r;
        var j: any = this.data["BannerInfo"];
        if (j == null || j[key] == null)
            return r;
        return j[key]["BannerHeight"];
    }

    //因为iphoneX广告，导致主UI向上移动的.
    getUIOffset(key: string, r: number) {
        if (this.data == null || this.data["BannerInfo"] == null)
            return r;
        var j: any = this.data["BannerInfo"];
        if (j == null || j[key] == null)
            return r;
        return j[key]["UIOffset"];
    }

    getDevice(key: string, r: number) {
        if (this.data == null || this.data["deviceInfos"] == null)
            return r;
        var j: any = this.data["deviceInfos"];
        if (j == null || j[key] == null)
            return r;
        return j[key];
    }

    //防止json不存在或项没有配置
    //默认值 r
    getJsonInt(key: string, r: number) {
        if (this.data != null && this.data[key] != null) {
            var v: number = <number>this.data[key];
            if (isNaN(v))
                return r;
            return v;
        }
        return r;
    }

    getJsonString(key: string, r: string) {
        if (this.data != null && this.data[key] != null) {
            var v: string = <string>this.data[key];
            if (v == null)
                return r;
            return v;
        }
        return r;
    }

    //默认值
    getJsonBoolean(key: string, r: boolean) {
        if (this.data != null && this.data[key] != null) {
            var v: boolean = <boolean>this.data[key];
            if (v == null)
                return r;
            return v;
        }
        return r;
    }



    get GameVersion(): string {
        return this.getJsonString("GameVersion", Const.GameVersion.toString());
    }

    get debug(): boolean {
        return this.versionValid ? this.getJsonBoolean("Debug", false) : false;
    }

    get FriendShareEnalbe(): boolean {
        return this.versionValid ? this.getJsonBoolean("FriendShareEnalbe", false) : false;
    }

    get SevenDaySignEnalbe(): boolean {
        return this.versionValid ? this.getJsonBoolean("SevenDaySignEnalbe", false) : false;
    }

    //开启广告/关闭广告
    get AdEnable(): boolean {
        return this.versionValid ? this.getJsonBoolean("AdEnable", false) : false;
    }

    _BannerHeight: number = 300;
    set BannerHeight(value: number) {
        this._BannerHeight = value;
    }

    get BannerHeight(): number {
        return this._BannerHeight;
    }

    /**
     * 得到更多钻石-每日观看视频上限
     */
    get MoreDiamond_WatchAdLimit():number
    {
        if (this.data != null && this.data["MoreDiamond"] != null)
        {
            if (Laya.Browser.onAndroid)
                return <number>this.data["MoreDiamond"]["ADLimitOnAndroid"];
            else if (Laya.Browser.onIOS)
                return <number>this.data["MoreDiamond"]["ADLimitOnIos"];
        }
        return 1;
    }

    /**
     * 得到更多钻石单次看视频广告成功后的钻石奖励值
     */
    get MoreDiamond_Reward():number
    {
        if (this.data != null && this.data["MoreDiamond"] != null)
            return <number>this.data["MoreDiamond"]["Reward"];
        return 1;
    }

    /**
     * 得到更多金币-每日观看视频上限
     */
    get MoreGold_WatchAdLimit():number
    {
        if (this.data != null && this.data["MoreGold"] != null)
        {
            if (Laya.Browser.onAndroid)
                return <number>this.data["MoreGold"]["ADLimitOnAndroid"];
            else if (Laya.Browser.onIOS)
                return <number>this.data["MoreGold"]["ADLimitOnIos"];
        }
        return 1;
    }

    /**
     * 得到更多钻石单次看视频广告成功后的钻石奖励值
     */
    get MoreGold_Reward():number
    {
        if (this.data != null && this.data["MoreGold"] != null)
            return <number>this.data["MoreGold"]["Reward"];
        return 1;
    }

    /**
     * 运行时客户端版本号<=线上配置版本号
     */
    public get versionValid(): boolean {
        let clientVer: string[] = Const.GameVersion.split(".");
        let tarVer: string[] = this.GameVersion.split(".");
        let len: number = Math.max(clientVer.length, tarVer.length);
        for (let i: number = 0; i < len; i++) {
            let a: number = clientVer[i] == null ? Number.MAX_VALUE : parseInt(clientVer[i]);
            let b: number = tarVer[i] == null ? Number.MAX_VALUE : parseInt(tarVer[i]);
            if (a != b) {
                return a <= b;
            }
        }
        return true;
    }
}

class GameDataLoad {
    constructor() {
    }
}