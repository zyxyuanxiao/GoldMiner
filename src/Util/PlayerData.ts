//记录玩家相关的数据
class PlayerData{
    private static _Instance:PlayerData;
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
    ExtraTime:number = 0;
    avatarUrl:string;//角色url
    nickName:string;//角色昵称
    gold:number = 0;
    level:number = 0;//默认第一关
    static MaxLevel:number = 20;

    constructor()
    {
        this.Load();
    }

    public Save()
    {
        UserPrefs.SetBool("StoneBook", this.StoneBook);
        UserPrefs.SetBool("DiamondBook", this.DiamondBook);
        UserPrefs.SetInt("BombCount", this.BombCount);
        UserPrefs.SetInt("Lucky", this.Lucky);
        UserPrefs.SetBool("PowerOn", this.PowerOn);
        UserPrefs.SetDouble("ExtraTime", this.ExtraTime);
        UserPrefs.SetInt("gold", this.gold);
        UserPrefs.SetInt("level", this.level);
    }

    public ClearPrefs()
    {
        UserPrefs.Remove("gold");
        UserPrefs.Remove("level");
        UserPrefs.Remove("PowerOn");
        UserPrefs.Remove("StoneBook");
        UserPrefs.Remove("DiamondBook");
        UserPrefs.Remove("BombCount");
        UserPrefs.Remove("Lucky");
        UserPrefs.Remove("ExtraTime");
    }

    //重置关卡状态道具，书
    public ResetStatus()
    {
        this.PowerOn = false;
        this.StoneBook = false;
        this.DiamondBook = false;
        this.ExtraTime = 0;
    }
    
    public Load()
    {
        this.gold = UserPrefs.GetInt("gold", 0);
        this.level = UserPrefs.GetInt("level", 0);
        //状态清空，保存不保存关卡内状态.
        //this.PowerOn = UserPrefs.GetBool("PowerOn", false);
        //this.StoneBook = UserPrefs.GetBool("StoneBook", false);
        //this.DiamondBook = UserPrefs.GetBool("DiamondBook", false);
        this.BombCount = UserPrefs.GetInt("BombCount", 0);
        this.Lucky = UserPrefs.GetInt("Lucky", 0);
        //this.ExtraTime = UserPrefs.GetInt("ExtraTime", 0);
    }

    public Reset()
    {
        this.gold = 0;
        this.level = 0;
        this.PowerOn = false;
        this.StoneBook = false;
        this.DiamondBook = false;
        this.BombCount = 0;
        this.Lucky = 0;
        this.ExtraTime = 0;
        this.nickName = "";
    }

    public Init(hOnChanged:Laya.Handler)
    {
        this.OnChanged = hOnChanged;
    }

    public OnGetMine(i:Mine)
    {
        if (i instanceof Stone)
        {
            if (this.StoneBook)
                this.AddGold(i.value * (5 + Math.random() * 3));
            else
                this.AddGold(i.value);
        }
        else if (i instanceof Diamond || i instanceof RedDiamond || i instanceof GreenDiamond)
        {
            if (this.DiamondBook)
                this.AddGold(2 * i.value);
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
                FlutterManager.Instance.OpenFlutterManager("得到石头书");
                this.StoneBook = true;
            }
            else if (r > 17 && r <= 24)
            {
                FlutterManager.Instance.OpenFlutterManager("得到钻石书");
                this.DiamondBook = true;
            }
            else if (r > 24 && r <= 36)
            {
                FlutterManager.Instance.OpenFlutterManager("时间+10S");
                BattleUiCtrl.Instance.AddTime(10);
            }
            else if (r > 36 && r <= 42)
            {
                FlutterManager.Instance.OpenFlutterManager("时间+15S");
                BattleUiCtrl.Instance.AddTime(15);
            }
            else if (r > 42 && r <= 45)
            {
                FlutterManager.Instance.OpenFlutterManager("时间+20S");
                BattleUiCtrl.Instance.AddTime(20);
            }
            else if (r > 45 && r <= 60)
            {
                FlutterManager.Instance.OpenFlutterManager("得到力量药剂");
                this.PowerOn = true;
            }
            else if (r >= 60 && r <= 75)
            {
                FlutterManager.Instance.OpenFlutterManager("幸运+2");
                this.Lucky += 2;
            }
            else
            {
                FlutterManager.Instance.OpenFlutterManager("运气太差了,福袋里什么都没有");
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
