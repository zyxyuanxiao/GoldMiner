class WeChatManager
{
    static Instance: WeChatManager;
    protected channelHandler: any = null;
    private _bIsShare: any = false;
    private _bannerAd: any = null;
    private isBannerLoaded: boolean = false;//当前是否加载完成
    private isShowBanner: boolean = false;//当前是否显示
    // private _wxFuncMgr: WXFunctionManager;
    constructor() {
        WeChatManager.Instance = this;
        this.channelHandler = Laya.Browser.window.wx;
        let self = this;
    };

    public shareAppMessage()
    {
        //取得配置调用
        this.share(Const.ShareTitle, Const.ImgUrl, "");
    }
    /**
     * 分享
     * @param title 
     * @param imageUrl 
     * @param query 
     */
    private share(title:string, imageUrl:string, query:string = "") {
        if (!this.channelHandler) {
            return false;
        };

        this.channelHandler.shareAppMessage({
            title: title,
            imageUrl: imageUrl,
            query: query,
        });

        return true;
    };

    videoAd: any = null;
    /**
     * 拉起全屏视频
     * @param adid 
     * @param success 
     */
    lookvideo(adid:string, success:Function) {
        let self = this;
        let rewardedVideoAd = this.channelHandler.createRewardedVideoAd({
            adUnitId: adid
        });

        this.videoAd = rewardedVideoAd;
        if (this.videoAd == null)  {
            FlutterManager.Instance.OpenFlutterManager("已无广告可用");
            //this.share(self._eventType, query, comeBackCall);
            return;
        }

        function onVideoError(res: any)  {
            WeChatManager.Instance.videoAd.offError(onVideoError);
        }

        rewardedVideoAd.onError(onVideoError);

        function onVideoClose(res: any)  {
            console.log("关闭激励视频1");
            if (!self.videoAd) return;
            WeChatManager.Instance.videoAd.offClose(onVideoClose);
            console.log("关闭激励视频2");
            //用户点击了【关闭广告】按钮
            //小于 2.1.0 的基础库版本，res 是一个 undefined
            if (res && res.isEnded || res === undefined) {
                // 正常播放结束，可以下发游戏奖励
                console.log("关闭激励视频 发送奖励");
                if (success != null)
                    success();
            }
            else {
                // 播放中途退出，不下发游戏奖励
                console.log("关闭激励视频 不发送奖励");
            }
            MainAudioPlayer.Instance.PauseSound = false;
        }

        rewardedVideoAd.onClose(onVideoClose);
        rewardedVideoAd.load()
            .then(() => {
                rewardedVideoAd.show();
                //去调用分享接口
                MainAudioPlayer.Instance.PauseSound = true;
            })
            .catch(err => {

            });
    };

    /**
     * 显示banner
     * @param eventType 
     */
    showBannerAd(bannerId:string, success:Function = null) {
        if (this._bannerAd) {
            this._bannerAd.destroy();
            this._bannerAd = null;
            this.isBannerLoaded = false;
            this.isShowBanner = false;
        }

        //不存在
        let sysInfo = this.channelHandler.getSystemInfoSync();
        var rate = Laya.stage.height / sysInfo.screenHeight;
        // console.log("rate:", rate);
        // console.log("system:",sysInfo);
        // console.log("width:", Laya.stage.width, " height:", Laya.stage.height);
        //var bannerHight = GlobalData.Instance.BannerHeight / rate;
        //var bannerWidth = (16 / 9) * bannerHight;
        this._bannerAd = this.channelHandler.createBannerAd({
            adUnitId: bannerId,
            style: {
                left: (sysInfo.screenWidth - 300) / 2,
                top: sysInfo.screenHeight,
                width: sysInfo.screenWidth * 0.9
            }
        });

        // console.log("banner:", this._bannerAd);
        //errCode  errMsg
        this._bannerAd.onError((res) => {
            console.log(res.errCode + "====&banner OnError&===" + res.errMsg);
        });

        this._bannerAd.onResize((res) => {
            // console.log(res.width + "====&&&===" + res.height);
            if (this._bannerAd && this._bannerAd.style) {
                if (Laya.Browser.window.tt)  {
                    this._bannerAd.style.height = this._bannerAd.style.width / (16 / 9);
                    this._bannerAd.style.realHeight = rate * this._bannerAd.style.width / (16 / 9);
                    
                }
                this._bannerAd.style.left = (sysInfo.screenWidth - res.width) / 2;
                if (this._bannerAd.style.height == null)
                    this._bannerAd.style.height = this._bannerAd.style.realHeight;
                this._bannerAd.style.top = sysInfo.screenHeight - this._bannerAd.style.realHeight - 1;
                let off = 0;
                if (sysInfo == null)
                    sysInfo = Laya.Browser.window.wx.getSystemInfoSync();
                if (sysInfo.model.indexOf("iPhone X") != -1)
                    off = 33;
                GlobalData.Instance.BannerHeight = (this._bannerAd.style.height + 3 + off) * rate;

                if (success)
                    success();
            }
            else  {
                console.error("onResize  this._bannerAd null");
            }
        });


        this._bannerAd.onLoad(() => {
            this.isBannerLoaded = true;
            if (this._bannerAd) {
                this._bannerAd.show();
                this.isShowBanner = true;
                if (success) {
                    success();
                }
            }
        });
    }


    /**
     * 隐藏banner
     * @param eventType 
     */
    hideBannerAd() {
        this.isBannerLoaded = false;
        if (this._bannerAd) {
            this._bannerAd.hide();
            this.isShowBanner = false;
            this._bannerAd.destroy();
            this._bannerAd = null;
        }
    }

    IsBannerVisible() {
        return this.isBannerLoaded && this._bannerAd != null && this.isShowBanner;
    }

    IsBannerOnLoad()  {
        return this._bannerAd != null && !this.isBannerLoaded;//banner不为空，且还未成功加载，表明创建了banner但是还未显示
    }
}