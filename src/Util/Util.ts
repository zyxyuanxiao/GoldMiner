class Util
{
    public static start()
    {
        PlayerData.Instance.Load();
        Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.RecordState);
        // if (PlayerData.Instance.gold == 0)
        // {
        //     //跳入主菜单-告知剧情，让用户决定是否开始玩.
        //     //Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.MenuState);

        //     //直接进入游戏转换和新增较好
        //     var lev:LevelItem = LevelData.Instance.LevelItems[PlayerData.Instance.level];
        //     Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.GameBattleState, lev);
        //     Main.Instance.DialogStateManager.ChangeState(Main.Instance.DialogStateManager.GameGoalState);
        // }
        // else
        // {
        //     //进商店.
        //     Main.Instance.GameStateManager.ChangeState(Main.Instance.GameStateManager.ShopState);
        //     Main.Instance.DialogStateManager.ChangeState(null);
        // }
    }

    public static CalcGoal(n:number)
    {
        return 105 + 545 * n + 135 * (n-1)*(n-2);
    }
}