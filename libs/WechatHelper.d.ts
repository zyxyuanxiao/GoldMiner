declare module WechatHelper.third  {
    interface IManager {
        Init(config: any);
        LoadZip(zipPath:string, zipName: string, onComplete: Function, onProgress: Function, onFail: Function, dontUzip?: boolean);
        Login(onComplete:Function);
    }
    class WXManager implements IManager {
        constructor();
        static GetInstance(): WXManager;
        public Init(config: any);
        public LoadZip(zipPath:string, zipName: string, onComplete: Function, onProgress: Function, onFail: Function, dontUzip?: boolean);
        public Login(onComplete:Function);
    }
}

declare module WechatHelper {
    class WXManager extends WechatHelper.third.WXManager {
    }
}