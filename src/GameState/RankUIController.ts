class RankUIController extends ui.RankUI {
    public static instacne: RankUIController;
    midOffestY: number;
    openTexture: Laya.Texture;
    constructor() {
        super();
        RankUIController.instacne = this;
        CommonFunc.RegisterDialogClick(this.btn_close, DialogAction.Close);
        this.onReSize();
        Laya.stage.on(Laya.Event.RESIZE, this, this.onReSize);
        this.UploadScore(function () {
            Laya.timer.once(1000, this, function () {
                WXMgr.postMessage(PostType.pageFirst);

                this.btn_nextpage.on(Laya.Event.CLICK, this, function () {
                    WXMgr.postMessage(PostType.pageNext);
                });

                this.btn_prevpage.on(Laya.Event.CLICK, this, function () {
                    WXMgr.postMessage(PostType.pagePrev);
                });
                
                if (Laya.Browser.onMobile)
                {
                    Laya.timer.once(500, this, () => {
                        this.openTexture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
                    });
                }
            }.bind(this))
        }.bind(this));

        this.fightFrend.on(Laya.Event.CLICK, this, () => {
            WeChatManager.Instance.shareAppMessage();
        });
    }

    onReSize() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
        this.centerX = 0;
        this.centerY = 0;
    };

    OnUpdate() {
        if (Laya.Browser.onMobile && this.openTexture != null)
            this.openContainer.graphics.drawTexture(this.openTexture, 0, 0, this.openTexture.width, this.openTexture.height);
    }

    UploadScore(success: Function) {
        var wx = Laya.Browser.window.wx;
        if (wx != null)
        {
            wx.setUserCloudStorage({
                KVDataList: [{ key: 'score', value: PlayerData.Instance.gold.toFixed(0) }],
                success: res => {
                    console.log(res);
                    if (success)
                        success();
                    // let openDataContext = wx.getOpenDataContext();
                    // openDataContext.postMessage({
                    //     type: 'updateMaxScore',
                    // });
                },
                fail: res => {
                    console.log(res);
                }
            });
        }
        else
        {
            if (success)
                success();
        }
    }
}

enum PostType {
    pageFirst = 0,
    pageNext = 1,
    pagePrev = 2,
    SaveScore = 3,
}