class ShopState extends BaseGameState {
    Controller: ShopUiController;
    OnEnter(previousState: BaseGameState, data: Object): void {
        this.InitUiController(["res/atlas/MainUI.atlas", "res/atlas/style1.atlas"]);
    }

    InitUiController(uiAtlas: Array<string>) {
        Laya.loader.load(uiAtlas, Laya.Handler.create(this, function () {
            this.Controller = new ShopUiController();
            this.Controller.zOrder = 100;
            Laya.stage.addChild(this.Controller);
        }.bind(this)));
    }

    OnExit(previousState: BaseGameState, data: Object) {
        super.OnExit(previousState, data);
    }
}

class ShopUiController extends ui.ShopUI {
    price: Array<number> = new Array<number>();
    count: Array<number> = new Array<number>(1, 1, 1, 1, 1);
    items: Array<{}>;
    constructor() {
        super();
        this.label_bomb.on(Laya.Event.CLICK, this, this.ShowDesc, [-2]);
        this.label_gold.on(Laya.Event.CLICK, this, this.ShowDesc, [-3]);
        this.label_lucky.on(Laya.Event.CLICK, this, this.ShowDesc, [-1]);
        this.btn_buy.on(Laya.Event.CLICK, this, this.OnBuyItem);
        this.btn_play.on(Laya.Event.CLICK, this, this.OnPlay);
        this.shopItems.scrollBar.visible = false;
        Laya.stage.on(Laya.Event.RESIZE, this, this.OnResize);
        this.label_des.text = "";
        for (var i: number = 0; i < 5; i++) {
            this.price.push(Math.ceil(Math.random() * (PlayerData.Instance.level + 1) * 300));
        }
        this.UpdateUI();
        this.OnResize();
    }

    RenderShopItem(cell: Laya.Box, index: number) {
        var item: ui.ShopItemUI = cell as ui.ShopItemUI;
        var id:ToolType = cell.dataSource["id"] as ToolType;
        if (id == ToolType.Bomb)
            item.img.skin = cell.dataSource["get"] == 0 ? "style1/shop_bomb-sheet0.png":"style1/shop_bomb-sheet1.png";
        else if (id == ToolType.DiamondTool)
            item.img.skin = cell.dataSource["get"] == 0 ? "style1/shop_jewel-sheet0.png":"style1/shop_jewel-sheet1.png";
        else if (id == ToolType.LuckyGrass)
            item.img.skin = cell.dataSource["get"] == 0 ? "style1/shop_bag-sheet0.png":"style1/shop_bag-sheet1.png";
        else if (id == ToolType.PowerTool)
            item.img.skin = cell.dataSource["get"] == 0 ? "style1/shop_power-sheet0.png":"style1/shop_power-sheet1.png";
        else if (id == ToolType.StoneTool)
            item.img.skin = cell.dataSource["get"] == 0 ? "style1/shop_silver-sheet0.png":"style1/shop_silver-sheet1.png";
        item.label_price.text = "$" + cell.dataSource["price"];
        item.label_name.text = cell.dataSource["name"];
        item.offAll();
        item.on(Laya.Event.CLICK, this, this.ShowDesc, [id]);
    }

    OnResize() {
        var scaleX: number = Laya.stage.width / this.image_back.width;
        this.image_back.width = Laya.stage.width;
        this.image_back.height = this.image_back.height * scaleX;
        this.width = Laya.stage.width;
        this.height = Laya.stage.height;
    }
    select: number = -1;
    ShowDesc(v: number) {
        this.select = v;
        switch (v) {
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
                this.label_des.text = "炸弹：用来炸毁重量大价值低的物品，以便节省时间！";
                break;
            case 1:
                this.label_des.text = "力量药剂:拉物品的速度提升，下一关内有效";
                break;
            case 2:
                this.label_des.text = "宝石收藏书:宝石的价值提升至200%";
                break;
            case 3:
                this.label_des.text = "福袋：增加2-5点幸运值，挖矿更幸运";
                break;
            case 4:
                this.label_des.text = "石头书:石头的价值提升至300%";
                break;
        }
        this.UpdateUI();
    }

    OnPlay() {
        var lev: LevelItem = LevelData.Instance.LevelItems[PlayerData.Instance.level];
        Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.GameBattleState, lev);
        Main.Instance.DialogStateManager.ChangeState(Main.Instance.DialogStateManager.GameGoalState);
    }

    OnBuyItem() {
        if (this.select != -1) {
            this.Buy(this.select);
        }
    }

    Buy(index: number) {
        this.BuyItem(index);
        this.UpdateUI();
    }

    UpdateUI() {
        this.label_bomb.text = PlayerData.Instance.BombCount.toFixed(0);
        this.label_lucky.text = PlayerData.Instance.Lucky.toFixed(0);
        this.label_gold.text = PlayerData.Instance.gold.toFixed(0);

        this.items = Array<{}>();

        var item = {
            id: ToolType.Bomb,
            name: "炸弹",
            price: this.price[0],
            get:this.count[0]
        }
        this.items.push(item);

        var item = {
            id: ToolType.PowerTool,
            name: "力量药水",
            price: this.price[1],
            get:this.count[1]
        }
        this.items.push(item);

        var item = {
            id: ToolType.DiamondTool,
            name: "宝石收藏书",
            price: this.price[2],
            get:this.count[2]
        }
        this.items.push(item);

        var item = {
            id: ToolType.LuckyGrass,
            name: "幸运袋",
            price: this.price[3],
            get:this.count[3]
        }
        this.items.push(item);

        var item = {
            id: ToolType.StoneTool,
            name: "石头收藏书",
            price: this.price[4],
            get:this.count[4]
        }
        this.items.push(item);
        this.shopItems.array = this.items;
        this.shopItems.renderHandler = new Laya.Handler(this, this.RenderShopItem, null, false);
    }

    //0-5 炸弹/力量/钻石书/福袋/石头书/随机时长.
    BuyItem(index: number) {
        //判定次数是否限制
        if (this.count.length > index) {
            if (this.count[index] == 0) {
                this.label_des.text = "货物已售罄，请下次再来";
                FlutterManager.Instance.OpenFlutterManager(this.label_des.text);
                return;
            }
        }
        if (this.price.length > index) {
            var cur = this.price[index];
            if (PlayerData.Instance.SubGold(cur)) {
                switch (index) {
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
                    case 3:
                        var luck: number = (2 + Math.ceil(Math.random() * 3));
                        PlayerData.Instance.Lucky += luck;
                        FlutterManager.Instance.OpenFlutterManager("幸运+" + luck);
                        break;
                }

                this.count[index] -= 1;
                MainAudioPlayer.Instance.PlayBuyItem();
            }
            else {
                this.label_des.text = "需要更多钱";
                FlutterManager.Instance.OpenFlutterManager(this.label_des.text);
            }
        }
    }
}