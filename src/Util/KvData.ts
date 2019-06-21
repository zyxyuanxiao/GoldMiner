class KVData {
    constructor(key: string, value: string) {
        this.key = key;
        this.value = value;
    }
    key: string;
    value: string;
}

class UserGameData {
    // 属性
    avatarUrl: string
    // 用户的微信头像 url

    nickname: string
    // 用户的微信昵称

    openid: string
    // 用户的 openid

    KVDataList: Array<KVData>
    // 用户的托管 KV 数据列表
}