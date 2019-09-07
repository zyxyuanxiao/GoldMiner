class StartUpUiController extends ui.StartUpUI {
    constructor()
    {
        super();
        this.InitView();
    }
    /**
     * 初始化界面逻辑
     */
    InitView() {
        this.UpdateProgress(0.0);
        this.on(Laya.Event.RESIZE, this, this.OnResize);
    }
    /**
     * 更新进度
     * @param vaule 进度值
     */
    public UpdateProgress(vaule: number) {
        this.pro_main.value = vaule;
    }

    OnResize()
    {
        this.height = Laya.stage.height;
        this.width = Laya.stage.width;
        
        this.bg_img.scaleX = Laya.stage.height/this.bg_img.height;
        this.bg_img.scaleY = Laya.stage.height/this.bg_img.height;

        this.bg_img.pos(this.width/2,this.height/2);
    }
}