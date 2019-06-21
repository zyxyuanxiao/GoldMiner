class MainMenuUiController extends ui.MainMenuUI {
    constructor()
    {
        super();
        this.InitView();
        CommonFunc.RegisterUIScale(this.label_title, 1, 1.3, 500);
        this.btn_start.on(Laya.Event.CLICK, this, this.OnStart);
    }

    InitView() {
        this.OnResize();
    }

    OnResize()
    {
        this.height = Laya.stage.height;
        this.width = Laya.stage.width;
    }

    OnHelp()
    {

    }

    OnStart()
    {
        Main.Instance.GameStateManager.FireAction(GameAction.Start);
    }
}