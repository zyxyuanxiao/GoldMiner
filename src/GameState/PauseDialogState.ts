class PauseDialogState extends CommonDialogState<PauseUiController>
{
    Controller:PauseUiController;
    OnEnter(previousState: BaseDialogState, data: Object):void
    {
        super.OnEnter(previousState, data);
        this.InitUiController(["res/atlas/MainUI.atlas","res/atlas/style1.atlas"]);
    }

    InitUiController(uiAtlas:Array<string>)
    {
        Laya.loader.load(uiAtlas, Laya.Handler.create(this, function () {
        this.Controller = new PauseUiController();
        this.Controller.zOrder = 100;
        Laya.stage.addChild(this.Controller);
        }.bind(this)));
    }

    public OnUpdate():void {
        super.OnUpdate();
    }

    public OnExit(nextState:BaseDialogState, data:Object) {
        if (this.Controller != null)
        {
            this.Controller.destroy();
            Laya.stage.removeChild(this.Controller);
            delete this.Controller;
            this.Controller = null;
        }
        super.OnExit(nextState, data);
    }

    public OnAction(gameAction:DialogAction, data:Object):void{
        super.OnAction(gameAction, data);
    }
}

class PauseUiController extends ui.GamePauseUI
{
    constructor()
    {
        super();
        this.btn_home.on(Laya.Event.CLICK, this, this.Home);
        this.btn_resume.on(Laya.Event.CLICK, this, this.Resume);
        this.btn_restart.on(Laya.Event.CLICK, this, this.RestartLevel);
        this.btn_mute.on(Laya.Event.CLICK, this, this.OnMute);
        if (PlayerData.Instance.mute)
            this.Mute();
        this.OnResize();
    }

    OnResize() {
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }

    Home()
    {
        //返回主页必须把这一关的金钱消除掉
        Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.MenuState);
        Main.Instance.DialogStateManager.ChangeState(null);
    }

    Resume()
    {
        Main.Instance.DialogStateManager.ChangeState(null);
        if (BattleUiCtrl.Instance)
            BattleUiCtrl.Instance.OnPause();
    }

    RestartLevel()
    {
        Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.NullState);
        Util.start();
        if (BattleUiCtrl.Instance)
            BattleUiCtrl.Instance.OnPause();
    }

    OnMute()  {
        PlayerData.Instance.mute = !PlayerData.Instance.mute;
        this.btn_mute.skin = PlayerData.Instance.mute ? "MainUI/soundbutton-sheet1.png" : "MainUI/soundbutton-sheet0.png";
        Laya.SoundManager.soundMuted = PlayerData.Instance.mute;
        MainAudioPlayer.Instance.OnMuteChanged();
    }

    Mute()  {
        PlayerData.Instance.mute = true;
        this.btn_mute.skin = PlayerData.Instance.mute ? "MainUI/soundbutton-sheet1.png" : "MainUI/soundbutton-sheet0.png";
        Laya.SoundManager.soundMuted = PlayerData.Instance.mute;
        MainAudioPlayer.Instance.OnMuteChanged();
    }
}