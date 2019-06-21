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
        this.OnResize();
        //延迟再次执行
        if (Laya.timer && Laya.timer.once) {
            Laya.timer.once(1000,this,function(){
                this.OnResize();
            }.bind(this));
        }
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