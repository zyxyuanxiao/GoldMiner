class GameEndDialogState extends CommonDialogState<GameEndUIController> {
    public DialogName: string;
    public OnEnter(nextState:BaseDialogState, data:Object) {
        super.OnEnter(nextState,data);
        this.DialogController = new GameEndUIController();
        Laya.stage.addChild(this.DialogController);
        this.DialogController.zOrder = 9999;
    }

    public OnAction(dialogAction: DialogAction, data: any) {
        switch (dialogAction) {
            case DialogAction.Close:
                //关闭过场后，进入排行榜界面.
                this.ChangeState(Main.Instance.DialogStateManager.RankState);
                break;
        }
    }
   
    public OnExit(nextState: BaseDialogState, data: Object)  {
        super.OnExit(nextState, data);
    }
}