
class FlutterManager{
    private zOrder = 11000;
    private static m_instance:FlutterManager;
    private constructor(){
       
    }

    public static get Instance():FlutterManager{
        if (!FlutterManager.m_instance) {
            FlutterManager.m_instance = new FlutterManager();
        }
        return this.m_instance;
    }

    public OpenFlutterManager(context?:string){
        Laya.loader.load(["res/atlas/MainUI.atlas"], Laya.Handler.create(this,function(){
            var ctrl =   new FlutterDialogController();
            ctrl.zOrder = this.zOrder;
            Laya.stage.addChildAt(ctrl, Laya.stage.numChildren - 1);
            ctrl.Start(context);
            this.zOrder ++;
        }.bind(this)));
    }


    public destory(){
    }
}
 


class FlutterDialogController extends ui.FlutterWindowUI{
    // 文案1：请分享到群
    // 文案2：网络异常，请重试
    listContext = ["请分享到群","网络异常，请重试"]
    /**
     *
     */
    constructor() {
        super();
        
        this.OnResize();
    }

    OnResize()
    {
        this.height = Laya.stage.height;
        this.width = Laya.stage.width;
                
        // this.pos(this.width/2,this.height/2);
        this.y =  this.height/2 - 200;      
    }

    Start(context?:string){               
        var text = ""
        if (context) {
            text = context;
        }else{
           
          var index = Math.round( Math.random() * this.listContext.length);
          index = Mathf.Clamp(index,0,this.listContext.length-1);
          text = this.listContext[index];
        }
        this.labContext.text = text;
        Laya.Tween.to(this.parentBox, {y:-400}, 3000, Laya.Ease.circOut, Laya.Handler.create(this, this.complete), null);
    }

    complete(){
        this.removeSelf();
        FlutterManager.Instance.destory();
    }
}