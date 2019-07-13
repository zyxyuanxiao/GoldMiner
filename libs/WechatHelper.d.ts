declare module WechatHelper.third  {
    interface IManager {
        LoadZip(zipPath:string, zipName: string, onComplete: Function, onProgress: Function, onFail: Function, dontUzip?: boolean);
        Login(onsuccess:Function, oncancel:Function, onalready:Function);
    }
    class WXManager implements IManager {
        constructor();
        static GetInstance(): WXManager;
        public LoadZip(zipPath:string, zipName: string, onComplete: Function, onProgress: Function, onFail: Function, dontUzip?: boolean);
        public Login(onsuccess:Function, oncancel:Function, onalready:Function);
    }
}

declare module WechatHelper {
    class WXManager extends WechatHelper.third.WXManager {
    }
}