abstract class CommonDialogState<T extends Dialog> extends BaseDialogState{

    protected Dialog: Object;
    protected DialogController: T;
    protected IsDialogPreloaded: boolean;
    public UnloadGuiOnExit: boolean;
    protected  DialogPrefaOverridebName: string = null;

    constructor(stateManager: MainDialogStateManager) {
        super(stateManager);
    }

    /**
     * override Function
     */
    public OnEnter(previousState: BaseDialogState, data: Object): void{
        
    }

    public OnUpdate():void {
        super.OnUpdate();
    }

    /**
     * override Function
     */
    public OnAction(dialogAction: DialogAction, data: Object): void{
        switch (dialogAction) {
            case DialogAction.Close:
            case DialogAction.BackButton:
                this.ChangeState(null);
                break;
        
            default:
                break;
        }
    }

    /**
     * override Function
     */
    public OnExit(nextState: BaseDialogState, data: Object): void{
        if (this.DialogController != null)
        {
            this.DialogController.destroy(true);
            this.DialogController = null;
        }
        if (this.UnloadGuiOnExit) {
            this.UnloadGuiOnExit = false;
        }
    }

    public OnEnable() {
            
    }
}