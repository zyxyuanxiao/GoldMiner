abstract class BaseGameState extends State<BaseGameState,GameAction> {
    public BannerEnabled: boolean;
    abstract Controller:any;

    public LevelName: string;

    public GameStateManager: MainGameStateManager;

    constructor(stateManager: MainGameStateManager) {
        super(stateManager);
        this.GameStateManager = stateManager;
    }
    /**
        * override Function
        */
    public OnEnter(previousState: BaseGameState, data: Object): void{
        if (Main.Instance.GameStateManager.PreviousState) {
            Main.Instance.GameStateManager.PreviousState.OnPostExit();
        }
    }

    public OnAction(gameAction:GameAction, data:Object):void{
    }

    /**
        * override Function
        */
    public OnExit(nextState: BaseGameState, data: Object): void{
        if (this.Controller != null)
        {
            this.Controller.destroy(true);
            this.Controller = null;
        }
    }

    public OnUpdate():void {
        super.OnUpdate();
    }
}