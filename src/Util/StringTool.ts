class StringTool {
    /**
     * 字符串转换
     * @param value
     * @returns {string}
     */
    static toString(value: any): string {
        if (value == null || value == void 0) {
            return "";
        }
        if (typeof(value) != "string") {
            return value.toString();
        }
        return value;
    }

    /**
     * 替换字符串中的参数
     * @param {string} value
     * @param args
     * @returns {string}
     */
    static format(value: string, ...args: Array<any>): string {
        for (let i: number = 0; i < args.length; i++) {
            let key: string = "{" + i + "}";
            while (value.indexOf(key) > -1) {
                value = value.replace(key, args[i]);
            }
        }
        return value;
    }
}