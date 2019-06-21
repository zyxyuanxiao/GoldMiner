class WXMgr {
    public wx: any;
    private static _Instance:WXMgr;
    static get Instance():WXMgr
    {
        if (WXMgr._Instance == null)
            WXMgr._Instance = new WXMgr();
        return WXMgr._Instance;
    }
    
    constructor() {
        this.wx = Laya.Browser.window.wx;
    }
    /**
     *对用户托管数据进行写数据操作。允许同时写多组 KV 数据。
     */
    public SetUserCloudStorage(userCloudStorage: UserCloudStorage) {
        this.wx.setUserCloudStorage(userCloudStorage);
    }

    /** 
    *拉取当前用户所有同玩好友的托管数据。该接口只可在开放数据域下使用  返回值--同玩好友的托管数据
    */
    public GetFriendCloudStorage(object: GetCloudStorage): Array<UserGameData> {
        return this.wx.getFriendCloudStorage(object);
    }
    /** 
     *获取群同玩成员的游戏数据。小游戏通过群分享卡片打开的情况下才可以调用。该接口只可在开放数据域下使用。返回值--群同玩成员的托管数据
    */
    public GetGroupCloudStorage(object: GetGroupCloudStorage): Array<UserGameData> {
        return this.wx.getGroupCloudStorage(object);
    }
    /**
     * 获取当前用户托管数据当中对应 key 的数据。该接口只可在开放数据域下使用  返回值--用户托管的 KV 数据列表
     */
    public GetUserCloudStorage(object: GetCloudStorage): Array<KVData> {
        return this.wx.getUserCloudStorage(object);
    }
    /**
     *  删除用户托管数据当中对应 key 的数据
     */
    public RemoveUserCloudStorage(object: GetCloudStorage) {
        return this.wx.removeUserCloudStorage(object);
    }

    public static postMessage(param:number) {
        if (Laya.Browser.onPC)
            return;
        console.log("向数据域发送消息");
        var msg = {message:param};
        var OpenDataContext = WXMgr.Instance.GetOpenDataContext();
        OpenDataContext.postMessage(msg);
    }

    /**
     * 获取开放数据域
     */
    public GetOpenDataContext() :any {
       return  this.wx.getOpenDataContext();
    }

    /**
     * 监听主域发送的消息  参数--监听事件的回调函数
     */
    public OnMessage(callback: Function) {
        this.wx.onMessage(callback);
    }

}