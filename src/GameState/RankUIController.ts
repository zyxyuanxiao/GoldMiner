class RankUIController extends ui.RankUI {
    public static instacne: RankUIController;
    midOffestY: number;
    openTexture:Laya.Texture;
    constructor() {
        super();
        RankUIController.instacne = this;
        console.log("初始化排行榜UI");
        
        CommonFunc.RegisterDialogClick(this.btn_close, DialogAction.Close);
        this.onReSize();
        Laya.stage.on(Laya.Event.RESIZE, this, this.onReSize);
        console.log("Init 执行");
        WXMgr.postMessage(PostType.pageFirst);
        this.btn_nextpage.on(Laya.Event.CLICK, this, function () {
            WXMgr.postMessage(PostType.pageNext);
        });
        this.btn_prevpage.on(Laya.Event.CLICK, this, function () {
            WXMgr.postMessage(PostType.pagePrev);
        });

        Laya.timer.once(5000, this, ()=>{
            this.openTexture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
        });
        // this.fightFrend.on(Laya.Event.CLICK,this,()=>{
        //     console.log("分享");
        //     Main.Instance.SDKMgr.share(ShareEventType.RankShowShare);
        // });
    }

    onReSize() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.centerX = 0;
        this.centerY = 0;
        //this.rankView.y=-85 + this.midOffestY;
    };

    OnUpdate()
    {
        if (Laya.Browser.onMobile && this.openTexture != null)
            this.openContainer.graphics.drawTexture(this.openTexture, 0, 0, this.openTexture.width, this.openTexture.height);
    }

    test() {
        console.log("调用微信");
        var wx = Laya.Browser.window.wx;
        var userCloudStorage: UserCloudStorage = new UserCloudStorage();
        var kvData: KVData = new KVData("zmy", "88");
        userCloudStorage.KVDataList.push(kvData);
        userCloudStorage.complete = function () {
            console.log("上传数据完成");
        }
        userCloudStorage.success = function () {
            console.log("上传数据成功");
        }
        userCloudStorage.fail = function () {
            console.log("上传数据失败");
        }
        wx.setUserCloudStorage(userCloudStorage);
    }
}

enum PostType {
    pageFirst = 0,
    pageNext = 1,
    pagePrev = 2,
    SaveScore = 3,
}