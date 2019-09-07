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
    class Mp3Helper {
        static GetInstance(): Mp3Helper;
        public ConvertToPCM(buffer:ArrayBuffer):ArrayBuffer;
    }
    class PcmHelper {
        static GetInstance(): PcmHelper;
        public ConvertToMP3(buffer:ArrayBuffer):ArrayBuffer;
        public convert(ArrayBuffer, from:any, to:any):ArrayBuffer;
    }
}

declare module WechatHelper {
    class WXManager extends WechatHelper.third.WXManager {
    }

    class Mp3Helper extends WechatHelper.third.Mp3Helper
    {
        
    }

    class PcmHelper extends WechatHelper.third.PcmHelper
    {

    }
}

interface String{
    format(...valus: any[]): string;
}