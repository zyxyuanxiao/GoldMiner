class MainMenuUiController extends ui.MainMenuUI {
    constructor()
    {
        super();
        this.InitView();
        CommonFunc.RegisterUIScale(this.label_title, 1, 1.3, 500);
        this.btn_start.on(Laya.Event.CLICK, this, this.OnStart);
        this.btn_edit.on(Laya.Event.CLICK, this, this.OnEditLevel);
        if (!Const.LocalDebug)
            (this.btn_edit.getChildByName("txt") as Laya.Label).text = "重新开始";
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

    OnEditLevel()
    {
        if (Const.LocalDebug)
            Main.Instance.GameStateManager.FireAction(GameAction.EditLevel);
        else
        {
            PlayerData.Instance.Reset();
            PlayerData.Instance.Save();
            Main.Instance.GameStateManager.FireAction(GameAction.Start);
        }
    }
}