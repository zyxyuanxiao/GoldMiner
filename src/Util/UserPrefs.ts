class UserPrefs {
    public static GetBool(k: string, v: boolean) {
        var rv = localStorage.getItem(k);
        if (rv == null || rv == "")
            return v;
        return rv == "true" ? true : false;
    }

    public static SetBool(k: string, v: boolean) {
        localStorage.setItem(k, v ? "true" : "false");
    }

    public static Remove(k: string) {
        localStorage.removeItem(k);
    }

    public static GetInt(k: string, v: number): number {
        var rv: string = localStorage.getItem(k);
        // console.log("key:" + k + " return value:" + rv);
        // if (rv == "")
        //     console.log("rv is nullstring");
        // else
        //     console.log("rv is notnullstring");
        if (rv == null || rv == "") {
            if (isNaN(v))
                return 0;
            return v;
        }
        var r: number = parseInt(rv);
        // console.log("rv:" + rv);
        if (isNaN(r)) {
            // console.log("data wrong:" + k + "Get int is Nan");
            if (isNaN(v))
                return 0;
            return v;
        }
        return r;
    }

    public static SetDouble(k: string, v: number) {
        if (isNaN(v)) {
            // console.log("data wrong:" + k + "Set double is Nan");
            localStorage.setItem(k, "0");
            return;
        }
        localStorage.setItem(k, v.toString());
    }

    public static GetDouble(k: string, v: number): number {
        var rv = localStorage.getItem(k);
        if (rv == null || rv == "") {
            if (isNaN(v))
                return 0;
            return v;
        }

        var f: number = parseFloat(rv);
        if (isNaN(f)) {
            // console.log("data wrong:" + k + "Get double is NaN");
            if (isNaN(v))
                return 0;
            return v;
        }
        return f;
    }

    public static SetInt(k: string, v: number) {
        // if (isNaN(v))
        //     console.log("data wrong:" + k + "Set int is Nan");
        if (isNaN(v))
            localStorage.setItem(k, "0");
        else
            localStorage.setItem(k, v.toString());
    }

    static cache:Laya.Dictionary = new Laya.Dictionary();
    public static GetIntCache(k:string)
    {
        if (UserPrefs.cache[k] != null)
            return UserPrefs.cache[k];
    }

    public static SetIntCache(k:string, v:number)
    {
        // if (isNaN(v))
        //     console.log("data wrong:" + k + "Set int is Nan");
        if (isNaN(v))
            UserPrefs.cache.set(k,0);
        else
            UserPrefs.cache.set(k, v);
    }

    public static SaveDelayed()
    {
        Laya.timer.frameOnce(1, null, ()=>{UserPrefs.Save();});
    }

    public static Save()
    {
        for (var i:number = 0; i < UserPrefs.cache.keys.length; i++)
        {
            var k:string = UserPrefs.cache.keys[i];
            UserPrefs.SetInt(k, UserPrefs.cache.get(k));
        }
    }

    public static SetString(k: string, v: string) {
        if (!v)
        {
            //console.log("data wrong:" + k + "Set int is Nan");
        }
        else
            localStorage.setItem(k, v);
    }

    public static GetString(k: string, v: string): string {
        var rv = localStorage.getItem(k);
        if (rv == null) {
            return v;
        }
        return rv;
    }

    public static RemoveAll() {
        PlayerData.Instance.ClearPrefs();
    }



    // public static CheckHash(originalKey: string, value: string, hashSuffix: string): boolean {
    //     if (!Utility.HasText(value)) {
    //         // If value is empty or null, hash is null and irrelevant
    //         return true;
    //     }

    //     // Check hash
    //     let hash:string  = GetString(CreateHashKey(originalKey), null);
    //     let valueH:string  = CreateHashValue(value, hashSuffix);
    //     return (valueH == hash);
    // }
}