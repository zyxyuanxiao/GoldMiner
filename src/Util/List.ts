class List<T>
{
    constructor(...v: T[]) {
        this.items = new Array<T>();
        if (v != null) {
            for (var i = 0; i < v.length; i++) {
                this.items.push(v[i]);
            }
        }
    }

    static constructor1<T>(v: T[]): List<T> {
        var tempList: List<T> = new List<T>();
        tempList.items = new Array<T>();
        if (v != null) {
            for (var i = 0; i < v.length; i++) {
                tempList.items.push(v[i]);
            }
        }
        return tempList;
    }

    items: Array<T>;
    Add(value: T) {
        this.items.push(value);
    }

    AddRange(value: List<T>) {
        for (var i = 0; i < value.Count; i++) {
            this.items.push(value.At(i));
        }
    }
    AddRange1(value: T[]) {
        for (var i = 0; i < value.length; i++) {
            this.items.push(value[i]);
        }
    }
    Remove(value: T) {
        var index = -1;
        for (var v in this.items) {
            if (this.items[v] == value) {
                index = parseInt(v);
                break;
            }
        }

        if (index != -1) {
            this.items.splice(index, 1);
        }
    }

    At(index: number): T | undefined {
        if (index < this.items.length && index >= 0)
            return this.items[index];
        return null;
    }

    Set(index: number, v: T) {
        this.items[index] = v;
    }

    RemoveAt(index: number): boolean {
        if (index < this.items.length && index >= 0) {
            this.Remove(this.items[index]);
            return true;
        }
        return true;
    }

    //还未测试，可能删除会破坏for
    Clear() {
        this.items.splice(0);
    }

    IndexOf(v: T) {
        return this.items.indexOf(v);
    }

    ToArray(): Array<T> {

        return this.items;
    }

    //在指定下标处插入一个
    Insert(i: number, v: T) {
        this.items.splice(i, 0, v);
    }

    get Count() {
        return this.items.length;
    }

    get length() {
        return this.items.length;
    }

    Sort(compareFn?: (a: T, b: T) => number) {

        this.items.sort(compareFn);

    }
}