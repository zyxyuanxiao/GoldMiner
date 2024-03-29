//记录玩家相关的数据
class PlayerData{
    private static _Instance:PlayerData;
    public static login:boolean = false;
    public static get Instance():PlayerData
    {
        if (PlayerData._Instance == null)
            PlayerData._Instance = new PlayerData();
        return PlayerData._Instance;
    }
    
    StoneBook:boolean = false;//石头书状态，每过一关重置
    DiamondBook:boolean = false;//钻石书状态
    BombCount:number = 0;//炸弹数量
    Lucky:number = 0;//0-100,每次买草可叠加.
    PowerOn:boolean = false;//无视物体重量
    ExtraSpeed:number = 0;//出钩加速 (0-5),每一关重置
    MineBag:Array<number>;
    ExtraTime:number = 0;
    avatarUrl:string;//角色url
    nickName:string = "";//角色昵称
    gold:number = 0;
    level:number = 0;//默认第一关
    mute:boolean = false;
    public static get MaxLevel():number
    {
        return LevelData.Instance.LevelItems.length;
    }

    constructor()
    {

    }

    public Save()
    {
        UserPrefs.SetInt("BombCount", this.BombCount);
        UserPrefs.SetInt("Lucky", this.Lucky);
        UserPrefs.SetInt("gold", this.gold);
        UserPrefs.SetInt("level", this.level);
    }

    public ClearPrefs()
    {
        UserPrefs.Remove("gold");
        UserPrefs.Remove("level");
        UserPrefs.Remove("BombCount");
        UserPrefs.Remove("Lucky");
    }

    //重置关卡状态道具，书
    public ResetStatus()
    {
        this.PowerOn = false;
        this.StoneBook = false;
        this.DiamondBook = false;
        this.ExtraTime = 0;
        this.ExtraSpeed = 0;
    }
    
    public Load()
    {
        this.level = UserPrefs.GetInt("level", 0);
        if (this.level >= PlayerData.MaxLevel)
        {
            this.Reset();
            this.ResetStatus();
            return;
        }
        this.gold = UserPrefs.GetInt("gold", 0);
        
        //状态清空，保存不保存关卡内状态.
        //this.PowerOn = UserPrefs.GetBool("PowerOn", false);
        //this.StoneBook = UserPrefs.GetBool("StoneBook", false);
        //this.DiamondBook = UserPrefs.GetBool("DiamondBook", false);
        this.BombCount = UserPrefs.GetInt("BombCount", 1);
        this.Lucky = UserPrefs.GetInt("Lucky", 0);
        //this.ExtraTime = UserPrefs.GetInt("ExtraTime", 0);
        if (this.MineBag == null)
        {
            this.MineBag = new Array<number>();
            for (var i = MineType.Stone; i <= MineType.CrystalHeart; i++)
                this.MineBag.push(0);
        }
    }

    public Reset()
    {
        this.gold = 0;
        this.level = 0;
        this.PowerOn = false;
        this.StoneBook = false;
        this.DiamondBook = false;
        this.ExtraSpeed = 0;
        this.BombCount = 1;
        this.Lucky = 0;
        this.ExtraTime = 0;
        this.nickName = "";
        if (this.MineBag == null)
            this.MineBag = new Array<number>();
        this.MineBag.splice(0);
        for (var i = MineType.Stone; i <= MineType.CrystalHeart; i++)
            this.MineBag.push(0);
    }

    public Init(hOnChanged:Laya.Handler)
    {
        this.OnChanged = hOnChanged;
    }

    public AddMineOnBag(i:Mine)
    {
        this.MineBag[i.type] += 1;
    }

    public OnGetMine(i:Mine)
    {
        if (i instanceof Stone)
        {
            if (this.StoneBook)
                this.AddGold(i.value * 3);
            else
                this.AddGold(i.value);
        }
        else if (i instanceof Diamond || i instanceof RedDiamond || i instanceof GreenDiamond)
        {
            if (this.DiamondBook)
                this.AddGold(i.value * 2);
            else
                this.AddGold(i.value);
        }
        else
            this.AddGold(i.value);
    }

    public GetRandomReward():boolean
    {
        //50%得到金钱 50%得到道具
        //金钱50-300,幸运最大翻倍.
        //道具，随机力量，沙漏-1/2/3，炸弹，石头鉴定书，幸运草，宝石鉴定书
        var i:number = Math.random() * (100 + this.Lucky);
        if (i < (100 + this.Lucky) / 2)
        {
            var f:number = Math.random();
            f += (this.Lucky / 100.0);
            var g:number = 50 + Math.random() * (100 + this.Lucky) + (f * 250);//最小50，最大750
            this.gold += Math.ceil(g);
            return false;
        }
        else
        {
            //时间翻倍>时间+20>时间+10>力量>炸弹>钻石书>石头书>幸运值.
            //%73概率得到道具，其余不得到任何道具
            var r:number = Math.floor(Math.random() * 100);
            if (r >= 0 && r <= 10)
            {
                var count:number = Math.ceil(1 + (4  * this.Lucky / 100.0));
                this.AddBomb(count);
                FlutterManager.Instance.OpenFlutterManager(StringTool.format("得到{0}个炸弹", count));
                this.Lucky += 5;
            }
            else if (r > 10 && r <= 17)
            {
                
                if (this.StoneBook)
                {
                    this.Lucky += 1;
                    FlutterManager.Instance.OpenFlutterManager("幸运提升" + 1);
                    if (this.Lucky > 100)
                        this.Lucky = 100;
                }
                else
                {
                    FlutterManager.Instance.OpenFlutterManager("得到矿物收藏书");
                    this.StoneBook = true;
                }
            }
            else if (r > 17 && r <= 24)
            {
                if (this.DiamondBook)
                {
                    this.Lucky += 1;
                    FlutterManager.Instance.OpenFlutterManager("幸运提升" + 1);
                    if (this.Lucky > 100)
                        this.Lucky = 100;
                }
                else
                {
                    FlutterManager.Instance.OpenFlutterManager("得到宝石收藏书");
                    this.DiamondBook = true;
                }
            }
            else if (r > 24 && r <= 36)
            {
                FlutterManager.Instance.OpenFlutterManager("时间+10S");
                BattleUiCtrl.Instance.AddTime(15);
            }
            else if (r > 36 && r <= 42)
            {
                FlutterManager.Instance.OpenFlutterManager("时间+20S");
                BattleUiCtrl.Instance.AddTime(30);
            }
            else if (r > 42 && r <= 45)
            {
                FlutterManager.Instance.OpenFlutterManager("时间+30S");
                BattleUiCtrl.Instance.AddTime(45);
            }
            else if (r > 45 && r <= 60)
            {
                if (this.PowerOn)
                {
                    FlutterManager.Instance.OpenFlutterManager("速度加快");
                    this.ExtraSpeed += 1;
                    if (this.ExtraSpeed >= 5.0)
                        this.ExtraSpeed = 5.0;
                }
                else
                {
                    FlutterManager.Instance.OpenFlutterManager("得到力量药剂");
                    this.PowerOn = true;
                }
            }
            else if (r > 60 && r <= 75)
            {
                var m:number =  Math.ceil(5 + Math.random() * 5);
                FlutterManager.Instance.OpenFlutterManager("幸运提升" + m);
                this.Lucky += m;
                if (this.Lucky > 100)
                    this.Lucky = 100;
            }
            else
            {
                this.Lucky += 1;
                FlutterManager.Instance.OpenFlutterManager("幸运提升" + 1);
                if (this.Lucky > 100)
                    this.Lucky = 100;
            }
        }
        return true;
    }

    public OnChanged:Laya.Handler;
    public IsEnoughGold(g:number)
    {
        if (g < 0)
            return false;
        return this.gold >= g;
    }

    public AddGold(g:number)
    {
        this.gold += Math.ceil(g);
        console.log("current gold:", this.gold);
        if (this.OnChanged != null)
            this.OnChanged.runWith(this.gold);
    }

    public AddBomb(g:number)
    {
        this.BombCount += Math.ceil(g);
    }

    public SubGold(g:number)
    {
        if (this.IsEnoughGold(g))
        {
            this.gold -= Math.ceil(g);
            if (this.OnChanged != null)
                this.OnChanged.runWith(this.gold);
            return true;
        }
        else
        {
            return false;
        }
    }
}
