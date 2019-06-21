abstract class BaseDialogState extends State<BaseDialogState,DialogAction> {
    public DialogStateManager: MainDialogStateManager;
    public get IsTomVisible() {  return false; }
    public BlockCloseOnGameStateExit:boolean = false;
    constructor(stateManager: MainDialogStateManager) {
        super(stateManager);
        this.DialogStateManager = stateManager;
        
    }
    /**
     * 是否可以打开
     */
    public CanOpen(): boolean {
        return true;
    }
    /**
     * 是否自动清理
     */
    public AutoClear(): boolean {
        return true;
    }
}