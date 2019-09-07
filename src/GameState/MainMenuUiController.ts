class MainMenuUiController extends ui.MainMenuUI {
    constructor()  {
        super();
        this.InitView();
        CommonFunc.RegisterUIScale(this.label_title, 1, 1.3, 500);
        this.btn_edit.on(Laya.Event.CLICK, this, this.OnEditLevel);
        if (!Const.LocalDebug)
            (this.btn_edit.getChildByName("txt") as Laya.Label).text = "重新开始";
        if (!PlayerData.login)  {
            WechatHelper.WXManager.GetInstance().Login(function (user: any) {
                // console.log(user);
                PlayerData.Instance.nickName = user.nickName;
                PlayerData.Instance.avatarUrl = user.avatarUrl;
                PlayerData.login = true;
                this.OnStart();
            }.bind(this), function ()  {
                this.OnStart();
            }.bind(this), function (user:any)  {
                // console.log(user);
                PlayerData.Instance.nickName = user.nickName;
                PlayerData.Instance.avatarUrl = user.avatarUrl;
                PlayerData.login = true;
                this.btn_start.on(Laya.Event.CLICK, this, this.OnStart);
            }.bind(this));
        }
        else  {
            this.btn_start.on(Laya.Event.CLICK, this, this.OnStart);
        }
    }

    InitView() {
        this.OnResize();
    }

    OnResize()  {
        this.height = Laya.stage.height;
        this.width = Laya.stage.width;
    }

    OnHelp()  {

    }

    OnStart()  {
        PlayerData.Instance.Load();
        Main.Instance.GameStateManager.FireAction(GameAction.Start);
    }

    OnEditLevel()  {
        if (Const.LocalDebug)
            Main.Instance.GameStateManager.FireAction(GameAction.EditLevel);
        else  {
            PlayerData.Instance.Reset();
            PlayerData.Instance.Save();
            Main.Instance.GameStateManager.FireAction(GameAction.Start);
        }
    }
}