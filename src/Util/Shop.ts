enum ToolType
{
    Bomb,//炸弹
    StoneTool,//购买后石头价值随机+50-200
    DiamondTool,//购买后钻石价值随机+50-200
    TimeTool,//购买后时间增加10S 时间沙漏
    TimeTool2,//购买后下一关关卡时间+30
    TimeTool3,//购买后下一关关卡时间翻倍
    PowerTool,//无视拉取时物品的重量.
    LuckyGrass,//幸运草 +10幸运值.
}

class Shop
{
    public static OnGetItem(tool:ToolType)
    {
        switch (tool)
        {

        }
    }
}