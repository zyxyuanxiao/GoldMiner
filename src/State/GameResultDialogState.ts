class GameResult
{
    goal:number;
    gold:number;
    win:boolean;
}

class GameResultDialogState extends CommonDialogState<GameResultDialogController>
{
    public constructor(stateManager:MainDialogStateManager)  {
        super(stateManager);
    }

    public get DialogName():string { return "dlg_ResultDialog"; }
    public OnEnter(previousDialog:BaseDialogState, data:Object) {
        super.OnEnter(previousDialog, data);
        this.InitUiController(data as GameResult);
    }

    InitUiController(data:GameResult) {
        this.DialogController = new GameResultDialogController(data);
        Laya.stage.addChild(this.DialogController);
        this.DialogController.zOrder = 9999;
    }

    public OnAction(dialogAction:DialogAction, data:Object) {
        super.OnAction(dialogAction, data);
        switch (dialogAction) {
            case DialogAction.Close:
            case DialogAction.BackButton:
                this.ChangeState(null);
                break;
            default:
                super.OnAction(dialogAction, data);
                break;
        }
    }

    public OnUpdate():void {
        super.OnUpdate();
    }

    public OnExit(nextState:BaseDialogState, data:Object) {
        this.DialogController.destroy();
        Laya.stage.removeChild(this.DialogController);
        delete this.DialogController;
        this.DialogController = null;
        super.OnExit(nextState, data);
    }
}

class GameResultDialogController extends ui.GameResultUI
{
    win:boolean = false;
    constructor(data:GameResult)
    {
        super();
        this.win = data.win;
        this.label_result.text = data.win ? "胜利":"失败";
        if (data.win)
        {
            if (PlayerData.Instance.level >= PlayerData.MaxLevel)
                MainAudioPlayer.Instance.PlayGameWin();
            else
                MainAudioPlayer.Instance.PlayWin();
        }
        else
        {
            MainAudioPlayer.Instance.PlayGameOver();
        }
        this.label_goal.text = data.goal.toFixed(0);
        this.label_gold.text = data.gold.toFixed(0);
        this.btn_play.on(Laya.Event.CLICK, this, this.OnPlay);
        this.btn_play.skin = this.win ? "style1/button_next-sheet1.png":"style1/button_restart-sheet1.png";
        this.OnResize();
    }

    OnResize()
    {
        this.centerX = 0;
        this.centerY = 0;
    }

    OnPlay()
    {
        if (this.win)
        {
            PlayerData.Instance.level += 1;
            PlayerData.Instance.ResetStatus();
            if (PlayerData.Instance.level == PlayerData.MaxLevel)
            {
                FlutterManager.Instance.OpenFlutterManager("恭喜已通关");
                Main.Instance.DialogStateManager.ChangeState(Main.Instance.DialogStateManager.RankState);
            }
            else
            {
                //还能继续玩
                Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.ShopState);
                Main.Instance.DialogStateManager.ChangeState(null);
            }
        }
        else
        {
            //输了，重新开始
            PlayerData.Instance.Reset();
            Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.MenuState);
            Main.Instance.DialogStateManager.ChangeState(Main.Instance.DialogStateManager.RankState);
        }
    }
}