class RankDialogState extends CommonDialogState<RankUIController> {
    public DialogName: string;
    public OnEnter(nextState:BaseDialogState, data:Object) {
        super.OnEnter(nextState,data);
        this.DialogController = new RankUIController();
        Laya.stage.addChild(this.DialogController);
        this.DialogController.zOrder = 9999;
        //JK.console.log("enter RankDialogState");
        //Laya.Scene.open("Scenes/RankView.scene", false,null,Laya.Handler.create(this,this.SceneLoadedCallBack));
        //Main.Instance.SDKMgr.showBannerAd(ShareEventType.BeforeRunBanner); 
    }


    SceneLoadedCallBack(){
        //let wxOpenDataView :laya.ui.WXOpenDataViewer = new laya.ui.WXOpenDataViewer();
        //RankUIController.instacne.rankView.getChildAt(0).addChild(wxOpenDataView);
        // wxOpenDataView.y=0;
        // wxOpenDataView.x=0;
        // wxOpenDataView.width=960;
        // wxOpenDataView.height=1440;
        // wxOpenDataView.mouseThrough=true;
    }

    public OnUpdate()
    {
        if (this.DialogController != null)
            this.DialogController.OnUpdate();
    }

    public OnAction(dialogAction: DialogAction, data: any) {
        switch (dialogAction) {
            case DialogAction.Close:
                //关闭排行榜后，清空玩家数据.
                PlayerData.Instance.Reset();
                this.ChangeState(null);
                break;
        }
    }
   
    public OnExit(nextState: BaseDialogState, data: Object)  {
        super.OnExit(nextState, data);
    }
}