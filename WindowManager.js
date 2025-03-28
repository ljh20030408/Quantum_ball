class WindowManager {
    #windows;
    #count;
    #id;
    #winData;
    #winShapeChangeCallback;
    #winChangeCallback;

    constructor() {
        let that = this;

        // 监听 localStorage 变化
        addEventListener("storage", (event) => {
            if (event.key === "windows") {
                let newWindows = JSON.parse(event.newValue);
                let winChange = that.#didWindowsChange(that.#windows, newWindows);

                that.#windows = newWindows;

                if (winChange) {
                    if (that.#winChangeCallback) that.#winChangeCallback();
                }
            }
        });

        // 监听窗口关闭事件
        window.addEventListener('beforeunload', function (e) {
            let index = that.getWindowIndexFromId(that.#id);
            that.#windows.splice(index, 1);
            that.updateWindowsLocalStorage();
        });
    }

    // 检查窗口列表是否有变化
    #didWindowsChange(pWins, nWins) {
        if (pWins.length!== nWins.length) {
            return true;
        } else {
            let c = false;
            for (let i = 0; i < pWins.length; i++) {
                if (pWins[i].id!== nWins[i].id) c = true;
            }
            return c;
        }
    }

    // 初始化当前窗口
    init(metaData) {
        this.#windows = JSON.parse(localStorage.getItem("windows")) || [];
        this.#count = localStorage.getItem("count") || 0;
        this.#count++;

        this.#id = this.#count;
        let shape = this.getWinShape();
        this.#winData = { id: this.#id, shape: shape, metaData: metaData };
        this.#windows.push(this.#winData);

        localStorage.setItem("count", this.#count);
        this.updateWindowsLocalStorage();
    }

    // 获取窗口形状
    getWinShape() {
        let shape = { x: window.screenLeft, y: window.screenTop, w: window.innerWidth, h: window.innerHeight };
        return shape;
    }

    // 根据 ID 获取窗口索引
    getWindowIndexFromId(id) {
        let index = -1;
        for (let i = 0; i < this.#windows.length; i++) {
            if (this.#windows[i].id === id) index = i;
        }
        return index;
    }

    // 更新 localStorage 中的窗口数据
    updateWindowsLocalStorage() {
        localStorage.setItem("windows", JSON.stringify(this.#windows));
    }

    // 更新窗口信息
    update() {
        let winShape = this.getWinShape();
        if (winShape.x!== this.#winData.shape.x ||
            winShape.y!== this.#winData.shape.y ||
            winShape.w!== this.#winData.shape.w ||
            winShape.h!== this.#winData.shape.h) {
            this.#winData.shape = winShape;
            let index = this.getWindowIndexFromId(this.#id);
            this.#windows[index].shape = winShape;
            if (this.#winShapeChangeCallback) this.#winShapeChangeCallback();
            this.updateWindowsLocalStorage();
        }
    }

    // 设置窗口形状变化回调函数
    setWinShapeChangeCallback(callback) {
        this.#winShapeChangeCallback = callback;
    }

    // 设置窗口变化回调函数
    setWinChangeCallback(callback) {
        this.#winChangeCallback = callback;
    }

    // 获取所有窗口数据
    getWindows() {
        return this.#windows;
    }

    // 获取当前窗口数据
    getThisWindowData() {
        return this.#winData;
    }

    // 获取当前窗口 ID
    getThisWindowID() {
        return this.#id;
    }
}

export default WindowManager;