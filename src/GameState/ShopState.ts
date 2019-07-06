class ShopState extends BaseGameState
{
    Controller:ShopUiController;
    OnEnter(previousState: BaseGameState, data: Object):void
    {
        this.InitUiController(["res/atlas/MainUI.atlas","res/atlas/style1.atlas"]);
    }

    InitUiController(uiAtlas:Array<string>)
    {
        Laya.loader.load(uiAtlas, Laya.Handler.create(this, function () {
        this.Controller = new ShopUiController();
        this.Controller.zOrder = 100;
        Laya.stage.addChild(this.Controller);
        }.bind(this)));
    }

    OnExit(previousState:BaseGameState, data:Object)
    {
        super.OnExit(previousState, data);
    }
} 

class ShopUiController extends ui.ShopUI
{
    price:Array<number> = new Array<number>(100, 500, 800, 150, 100, 300);
    count:Array<number> = new Array<number>(1, 1, 1, 1, 1, 1);
    constructor()
    {
        super();
        this.label_bomb.on(Laya.Event.CLICK, this, this.ShowDesc, [-2]);
        this.label_gold.on(Laya.Event.CLICK, this, this.ShowDesc, [-3]);
        this.label_lucky.on(Laya.Event.CLICK, this, this.ShowDesc, [-1]);
        this.buy_luck.on(Laya.Event.CLICK, this, this.ShowDesc, [3]);
        this.btn_buyBomb.on(Laya.Event.CLICK, this, this.ShowDesc, [0]);
        this.buy_stonebook.on(Laya.Event.CLICK, this, this.ShowDesc, [4]);
        this.btn_buydiamond.on(Laya.Event.CLICK, this, this.ShowDesc, [2]);
        this.btn_buypower.on(Laya.Event.CLICK, this, this.ShowDesc, [1]);
        this.btn_buytime.on(Laya.Event.CLICK, this, this.ShowDesc, [5]);
        
        this.btn_buy.on(Laya.Event.CLICK, this, this.OnBuyItem);

            //this.price.push(Math.ceil(Math.random() * 300));
        this.btn_play.on(Laya.Event.CLICK, this, this.OnPlay);
        this.label_des.text = "";
        this.UpdateUI();
    }

    select:number = -1;
    ShowDesc(v:number)
    {
        this.select = v;
        switch (v)
        {
            case -1:
            this.label_des.text = "幸运值，可购买福袋提高幸运值";
            break;
            case -2:
            this.label_des.text = "炸弹数量";
            break;
            case -3:
            this.label_des.text = "当前拥有金钱数额";
            break;
            case 0:
            this.label_des.text = "炸弹：当你挖到废品时，用来炸毁该物品，以便节省时间！";
            break;
            case 1:
            this.label_des.text = "力量药剂:挖到物品时，拉物品的速度提升，下一关内有效";
            break;
            case 2:
            this.label_des.text = "宝石收藏书:挖到宝石时，宝石的价值提升至200%";
            break;
            case 3:
            this.label_des.text = "福袋：增加2-5点幸运值，挖矿更幸运";
            break;
            case 4:
            this.label_des.text = "石头书:当你挖到时候时，石头的价值提升至100%-500%";
            break;
            case 5:
            this.label_des.text = "时间沙漏:随机增加关卡时间10-30秒时间，最长翻倍";
            break;
        }
        this.UpdateUI();
    }

    OnPlay()
    {
        var lev:LevelItem = LevelData.Instance.LevelItems[PlayerData.Instance.level];
        Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.GameBattleState, lev);
        Main.Instance.DialogStateManager.ChangeState(Main.Instance.DialogStateManager.GameGoalState);
    }

    OnBuyItem()
    {
        if (this.select != -1)
        {
            this.Buy(this.select);
        }
    }

    Buy(index:number)
    {
        this.BuyItem(index);
        this.UpdateUI();
    }

    UpdateUI()
    {
        this.label_bomb.text = PlayerData.Instance.BombCount.toFixed(0);
        this.label_lucky.text = PlayerData.Instance.Lucky.toFixed(0);
        this.label_gold.text = PlayerData.Instance.gold.toFixed(0);
        this.btn_buyBomb.skin = "style1/shop_bomb-sheet" + this.count[0] + ".png";
        this.btn_buypower.skin = "style1/shop_power-sheet" + this.count[1] + ".png";
        this.btn_buydiamond.skin = "style1/shop_jewel-sheet" + this.count[2] + ".png";
        this.buy_luck.skin = "style1/shop_bag-sheet" + this.count[3] + ".png";
        this.buy_stonebook.skin = "style1/shop_silver-sheet" + this.count[4] + ".png";
        this.icon_time.visible = this.count[5] == 1;
        if (this.select != -1)
        {
            this.label_price.text = StringTool.format("${0}", this.price[this.select].toFixed(0));
        }
    }

    //0-5 炸弹/力量/钻石书/福袋/石头书/随机时长.
    BuyItem(index:number)
    {
        //判定次数是否限制
        if (this.count.length > index)
        {
            if (this.count[index] == 0)
            {
                this.label_des.text = "货物已售罄，请下次再来";
                FlutterManager.Instance.OpenFlutterManager(this.label_des.text);
                return;
            }
        }
        if (this.price.length > index)
        {
            var cur = this.price[index];
            if (PlayerData.Instance.SubGold(cur))
            {
                switch (index)
                {
                    case 0:
                    PlayerData.Instance.AddBomb(1);
                    FlutterManager.Instance.OpenFlutterManager("得到炸弹");
                    break;
                    case 4:
                    PlayerData.Instance.StoneBook = true;
                    FlutterManager.Instance.OpenFlutterManager("得到石头书");
                    break;
                    case 2:
                    PlayerData.Instance.DiamondBook = true;
                    FlutterManager.Instance.OpenFlutterManager("得到宝石书");
                    break;
                    case 1:
                    PlayerData.Instance.PowerOn = true;
                    FlutterManager.Instance.OpenFlutterManager("得到力量药剂");
                    break;
                    case 5:
                    {
                        var idx:number = Math.ceil(Math.random() * 3);
                        switch (idx)
                        {
                            case 0:
                            PlayerData.Instance.ExtraTime = 10;
                            FlutterManager.Instance.OpenFlutterManager("关卡额外时间+10秒");
                            break;
                            case 1:
                            PlayerData.Instance.ExtraTime = 15;
                            FlutterManager.Instance.OpenFlutterManager("关卡额外时间+30秒");
                            break;
                            case 2:
                            PlayerData.Instance.ExtraTime = 20;
                            FlutterManager.Instance.OpenFlutterManager("关卡额外时间翻倍");
                            break;
                        }
                    }
                    break;
                    case 3:
                    var luck:number = (2 + Math.ceil(Math.random() * 3));
                    PlayerData.Instance.Lucky += luck;
                    FlutterManager.Instance.OpenFlutterManager("幸运+" + luck);
                    break;
                }

                this.count[index] -= 1;
                MainAudioPlayer.Instance.PlayBuyItem();
            }
            else
            {
                this.label_des.text = "需要更多钱";
                FlutterManager.Instance.OpenFlutterManager(this.label_des.text);
            }
        }
    }
}