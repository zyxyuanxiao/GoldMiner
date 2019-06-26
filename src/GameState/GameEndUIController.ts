class GameEndUIController extends ui.GameEndUI {
    public static instacne: RankUIController;
    midOffestY: number;
    openTexture: Laya.Texture;

    constructor() {
        super();
        this.label_content.text = "";
        var goal:string = "经过你的不懈努力,在挖到\n";
        var line:number = 1;
        for (var i:number = MineType.Stone; i < MineType.CrystalHeart; i++)
        {
            if (PlayerData.Instance.MineBag[i] != 0)
            {
                var m:Mine = MineFactory.CreateMine(i, 1, 1, 1);
                goal += m.name + " x " + PlayerData.Instance.MineBag[i] + "\n";
                line += 1;
            }
        }
        goal += "之后\n";
        goal += StringTool.format("你终于找到了{0}颗生命之心\n", PlayerData.Instance.MineBag[MineType.CrystalHeart]);
        goal += "这已足以救活爱丽丝\n";
        goal += "回家!";
        line += 4;
        this.label_content.text = goal;
        this.btn_win.visible = false;
        
        this.onReSize();
        Laya.stage.on(Laya.Event.RESIZE, this, this.onReSize);
        Laya.Tween.to(this.pnl_content, {y:-line * 35}, line * 1000, Laya.Ease.linearIn, Laya.Handler.create(this, this.OnWin));
    }

    onReSize() {
        this.centerX = 0;
        this.centerY = 0;
    };
    
    OnWin()
    {
        this.btn_win.visible = true;
        this.btn_win.on(Laya.Event.CLICK, this, this.Close);
    }

    Close()
    {
        Main.Instance.DialogStateManager.FireAction(DialogAction.Close);
    }
}