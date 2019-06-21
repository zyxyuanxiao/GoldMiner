abstract class DialogStateManager<S extends State<S,A>,A> extends StateManager<S,A> {
    protected get Tag() { return "DialogStateManager"; }

    private PendingDialogClose:State<S,A>;
    private PendingDialogCloseData:any;

    public GameStateManager:StateManager<S,A>;
    //override
    public OnUpdate():void {
        if (this.CurrentState == null)
            return;

        this.CurrentState.OnUpdate();
    }
    //override
    protected ToNullState():void {

    }

    public abstract OnBackPress():boolean;
    //override
    public FireAction(action:A, data?:any):boolean {

        if (!this.CurrentState) {
            return false;
        }

        return super.FireAction(action, data);
    }


    public CheckAndCloseCurrentDialogIfPresent(dialog:S):boolean {
        if (dialog != this.CurrentState)
            return false;

        return this.CloseCurrentDialogIfPresent();
    }

    public CloseCurrentDialogIfPresent():boolean {
        return this.CloseCurrentDialogIfPresentTwo(null);
    }
    /**
     * virtual Function
     * 关闭非跟状态的状态框
     * @param data 
     */
    public CloseCurrentDialogIfPresentTwo(data:any):boolean {
        if (this.CurrentState == null)
            return true;

        var closed:boolean = this.ChangeState(null, data);
        return closed;
    }

    /**
     * virtual Function
     */
    public OpenDialog(dialogState:S, data?:any):boolean {
        if (this.CurrentState != null && this.CurrentState.BlockOtherDialogs(dialogState))
            return false;

        if (!dialogState.CanOpen())
            return false;

        return this.ChangeState(dialogState, data);
    }

    public CloseDialogOnMainStateExit():void {
        this.CloseDialogOnMainStateExitTwo(null);
    }

    public CloseDialogOnMainStateExitTwo(data:any):void {
        this.PendingDialogCloseData = data;
        this.PendingDialogClose = this.CurrentState;
    }
    //override
    public OnGameStateExit(state:any, data:any):void {
        if (this.PendingDialogClose != null) {
            var closed:boolean = this.ChangeState(null, this.PendingDialogCloseData);
            this.PendingDialogClose = null;
        }
    }

}