// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html
import ListViewItem from "./listViewItem";
const {ccclass, property} = cc._decorator;

/**
 * 子节点数据
 */
class itemList {
    id: number;
    // 是否被使用
    onUse?: boolean = false;
    // 子节点
    target?: cc.Node = null;
    // 子节点控制类
    targetComponent?: ListViewItem = null;
    // 子节点控制类名
    targetComponentClass?: string;
    // 自定义数据
    data?: any;
}

/**
 * init函数所用的列表数据类
 */
@ccclass('initDataClass')
class initDataClass {
    // 子节点控制类名（如设置了这个则默认不使用list子数据里的子节点控制类名
    className?: string = '';
    // 子节点数据列表
    list: itemList[] = [];
}

/**
 * 面板设置子节点类
 */
@ccclass('itemPropClass')
class itemPropClass {
    // 子节点宽度
    @property({
        tooltip: '容器内item的宽度(暂时统一)',
        step: 1
    })
    itemWidth: number = 0;

    // 子节点高度
    @property({
        tooltip: '容器内item的高度(暂时统一)',
        step: 1
    })
    itemHeight: number = 0;

    // 子节点预制体
    @property({
        type: cc.Prefab,
        tooltip: '容器内item的预制体'
    })
    itemPrefab: cc.Prefab = null;

    /**
     * 列表数据
     */
    public dataList: initDataClass = null;
}

/**
 * 内边距类
 */
@ccclass('paddingClass')
class paddingClass {
    private _top: number;
    @property({
        visible: false
    })
    get top(): number {
        return this._top;
    }
    set top(num: number) {
        this._top = num;

        if (ListViewCompent.prototype.isReady)
            ListViewCompent.prototype.initSize();
    }
    @property({
        tooltip: '内边距上',
        displayName: 'top'
    })
    topNum: number = 0;


    private _left: number;
    @property({
        visible: false
    })
    get left(): number {
        return this._left;
    }
    set left(num: number) {
        this._left = num;
        
        if (ListViewCompent.prototype.isReady)
            ListViewCompent.prototype.initSize();
    }
    @property({
        tooltip: '内边距左',
        displayName: 'left'
    })
    leftNum: number = 0;


    private _right: number;
    @property({
        visible: false
    })
    get right(): number {
        return this._right;
    }
    set right(num: number) {
        this._right = num;

        if (ListViewCompent.prototype.isReady)
            ListViewCompent.prototype.initSize();
    }
    @property({
        tooltip: '内边距右',
        displayName: 'right'
    })
    rightNum: number = 0;


    private _bottom: number;
    @property({
        visible: false
    })
    get bottom(): number {
        return this._bottom;
    }
    set bottom(num: number) {
        this._bottom = num;

        if (ListViewCompent.prototype.isReady)
            ListViewCompent.prototype.initSize();
    }
    @property({
        tooltip: '内边距上',
        displayName: 'bottom'
    })
    bottomNum: number = 0;
}

/**
 * 子节点间距类
 */
@ccclass('spacingClass')
class spacingClass {
    private _spacingX: number;
    @property({
        visible: false
    })
    get spacingX(): number {
        return this._spacingX;
    }
    set spacingX(num: number) {
        this._spacingX = num;

        if (ListViewCompent.prototype.isReady)
            ListViewCompent.prototype.initSize();
    }
    @property({
        tooltip: '水平滚动下子节点间隔',
        displayName: 'spacingX',
        type: cc.Integer
    })
    spacingXNum = 0;


    private _spacingY: number;
    @property({
        visible: false
    })
    get spacingY(): number {
        return this._spacingY;
    }
    set spacingY(num: number) {
        this._spacingY = num;

        if (ListViewCompent.prototype.isReady)
            ListViewCompent.prototype.initSize();
    }
    @property({
        tooltip: '垂直滚动下子节点间隔',
        displayName: 'spacingY',
        type: cc.Integer
    })
    spacingYNum = 0;
}

@ccclass
export default class ListViewCompent extends cc.Component {
    private _content: cc.Node;
    @property({
        type: cc.Node,
        visible: false
    })
    get content(): cc.Node {
        return this._content;
    };
    set content(_node: cc.Node) {
        this._content = _node;
        this._content.setAnchorPoint(0, 1);

        if (this.scrollView)
            this.scrollView.content = _node;
    }
    @property({
        tooltip: '包含可滚动内容的节点引用',
        displayName: 'content',
        type: cc.Node
    })
    contentNode: cc.Node = null;


    @property({
        type: cc.Node,
        tooltip: '滚动内容上层遮罩'
    })
    mask: cc.Node = null;


    @property({
        type: itemPropClass,
        tooltip: '容器内item的数据'
    })
    itemData: itemPropClass = new itemPropClass();


    @property({
        tooltip: '内边距(距离mask的距离)',
        type: paddingClass
    })
    padding: paddingClass = new paddingClass();


    @property({
        tooltip: '子节点间隔',
        type: spacingClass
    })
    spacing: spacingClass = new spacingClass();


    private _horizontal: boolean;
    @property({
        visible: false
    })
    get horizontal(): boolean {
        return this._horizontal;
    };
    set horizontal(check: boolean) {
        if (!this._vertical && !check) {
            this._horizontal = check;
        } else {
            this._horizontal = check;
            this._vertical = !check;
        }

        if (this.scrollView) {
            if (!this._vertical && !check) {
                this.scrollView.horizontal = check;
            } else {
                this.scrollView.horizontal = check;
                this.scrollView.vertical = !check;
            }
        }
    }
    @property({
        tooltip: '是否开启水平滚动',
        displayName: 'horizontal',
        visible() {
            return (!this.verticalNum && !this.horizontalNum) || !this.verticalNum;
        }
    })
    horizontalNum: boolean = false;


    private _vertical: boolean;
    @property({
        visible: false
    })
    get vertical(): boolean {
        return this._vertical;
    }
    set vertical(check: boolean) {
        if (!this._horizontal && !check) {
            this._vertical = check;
        } else {
            this._horizontal = !check;
            this._vertical = check;
        }

        if (this.scrollView) {
            if (!this._horizontal && !check) {
                this.scrollView.vertical = check;
            } else {
                this.scrollView.horizontal = !check;
                this.scrollView.vertical = check;
            }
        }
    }
    @property({
        tooltip: '是否开启垂直滚动',
        displayName: 'vertical',
        visible() {
            return (!this.verticalNum && !this.horizontalNum) || !this.horizontalNum;
        }
    })
    verticalNum: boolean = true;


    private _inertia: boolean;
    @property({
        visible: false
    })
    get inertia(): boolean {
        return this._inertia;
    }
    set inertia(check: boolean) {
        this._inertia = check;

        if (this.scrollView)
            this.scrollView.inertia = check;
    }
    @property({
        tooltip: '是否开启滚动惯性',
        displayName: 'inertia'
    })
    inertiaNum: boolean = true;


    private _brake: number;
    @property({
        visible: false
    })
    get brake(): number {
        return this._brake;
    }
    set brake(num: number) {
        this._brake = num;
        
        if (this.scrollView)
            this.scrollView.brake = num;
    }
    @property({
        tooltip: '开启惯性后，在用户停止触摸后多滚动多快停止，0表示永不停止，1表示立刻停止',
        displayName: 'brake'
    })
    brakeNum: number = 0.75;


    private _elastic: boolean;
    @property({
        visible: false
    })
    get elastic(): boolean {
        return this._elastic;
    }
    set elastic(check: boolean) {
        this._elastic = check;
        
        if (this.scrollView)
            this.scrollView.elastic = check;
    }
    @property({
        tooltip: '是否允许滚动内容超过边界，并在停止触摸后回弹',
        displayName: 'elastic'
    })
    elasticNum: boolean = true;


    private _bounceDuration: number;
    @property({
        visible: false
    })
    get bounceDuration(): number {
        return this._bounceDuration;
    }
    set bounceDuration(num: number) {
        this._bounceDuration = num;

        if (this.scrollView)
            this.scrollView.bounceDuration = num;
    }
    @property({
        tooltip: '回弹持续时间，0 表示将立即反弹',
        displayName: 'bounceDuration'
    })
    bounceDurationNum: number = 0.23;


    private _horizontalScrollBar: cc.Scrollbar;
    @property({
        visible: false
    })
    get horizontalScrollBar(): cc.Scrollbar {
        return this._horizontalScrollBar;
    }
    set horizontalScrollBar(bar: cc.Scrollbar) {
        this._horizontalScrollBar = bar;

        if (this.scrollView)
            this.scrollView.horizontalScrollBar = bar;
    }
    @property({
        tooltip: '水平滚动的ScrollBar',
        type: cc.Scrollbar,
        visible() {
            return !this.verticalNum;
        },
        displayName: 'horizontalScrollBar'
    })
    horizontalScrollBarNode: cc.Scrollbar = null;


    private _verticalScrollBar: cc.Scrollbar = null;
    @property({
        visible: false
    })
    get verticalScrollBar(): cc.Scrollbar {
        return this._verticalScrollBar;
    }
    set verticalScrollBar(bar: cc.Scrollbar) {
        this._verticalScrollBar = bar;

        if (this.scrollView)
            this.scrollView.verticalScrollBar = bar;
    }
    @property({
        tooltip: '垂直滚动的ScrollBar',
        type: cc.Scrollbar,
        visible() {
            return this.verticalNum;
        },
        displayName: 'verticalScrollBar'
    })
    verticalScrollBarNode: cc.Scrollbar = null;


    private _cancelInnerEvents: boolean;
    @property({
        visible: false
    })
    get cancelInnerEvents(): boolean {
        return this._cancelInnerEvents;
    }
    set cancelInnerEvents(check: boolean) {
        this._cancelInnerEvents = check;

        if (this.scrollView)
            this.scrollView.cancelInnerEvents = check;
    }
    @property({
        tooltip: '滚动行为是否会取消子节点上注册的触摸事件',
        displayName: 'cancelInnerEvents'
    })
    cancelInnerEventsNum: boolean = true;

    private viewHeight: number = 0;
    private viewWidth: number = 0;
    public scrollView: cc.ScrollView = null;

    private contentHeight: number = 0;
    private contentWidth: number = 0;

    private itemPoolList: cc.NodePool = null;
    private itemNumber: number = 0;
    private maxItemNum: number = 3;

    nowTargetComponentList: Array<any> = [];

    private startIndex: number = 0;
    private endIndex: number = 0;

    private inRender: boolean = false;

    private col: number = 2;
    private row: number = 2;

    public onLoadEnd: boolean = false;
    public isAddListener: boolean = false;
    public isReady: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    /**
     * 将面板设置的数值赋给内部变量
     */
    beforeLoad() {
        // cc.log('horizontalNum', this.horizontalNum, this.verticalNum);
        this.content = this.contentNode;
        delete this.contentNode;
        this.horizontal = this.horizontalNum;
        delete this.horizontalNum;
        this.vertical = this.verticalNum;
        delete this.verticalNum;
        this.inertia = this.inertiaNum;
        delete this.inertiaNum;
        this.brake = this.brakeNum;
        delete this.brakeNum;
        this.elastic = this.elasticNum;
        delete this.elasticNum;
        this.bounceDuration = this.bounceDurationNum;
        delete this.bounceDurationNum;
        this.horizontalScrollBar = this.horizontalScrollBarNode;
        delete this.horizontalScrollBarNode
        this.verticalScrollBar = this.verticalScrollBarNode;
        delete this.verticalScrollBarNode;
        this.cancelInnerEvents = this.cancelInnerEventsNum;
        delete this.cancelInnerEventsNum;

        this.padding.top = this.padding.topNum;
        delete this.padding.topNum;
        this.padding.bottom = this.padding.bottomNum;
        delete this.padding.bottomNum;
        this.padding.left = this.padding.leftNum;
        delete this.padding.leftNum;
        this.padding.right = this.padding.rightNum;
        delete this.padding.rightNum;

        this.spacing.spacingX = this.spacing.spacingXNum;
        delete this.spacing.spacingXNum;
        this.spacing.spacingY = this.spacing.spacingYNum;
        delete this.spacing.spacingYNum;

        // cc.log('sv', this.scrollView);
    }

    onLoad () {
        // 检查是否已经注册事件等
        this.checkInitEventListener();
    }

    /**
     * 初始化数据列表，包括 计算相关信息、生成节点等操作
     * @param _dataList 节点数据
     */
    init(_dataList: initDataClass) {
        if (!_dataList || !_dataList.list || !_dataList.list.length || _dataList.list.length == 0) {
            console.error('dataList is undefined or dataList not have list or dataList.list.length == 0');
            return false;
        }
        this.checkDataList(_dataList);
        this.isReady = false;
        console.log('list-view init start!');
        
        // 检查是否已经注册事件等
        this.checkInitEventListener();

        if (this.itemPoolList) {
            let self = this;
            this.itemData.dataList.list.map((value, key) => {
                // console.log(`key:${key},value.target`, value.target);
                // value.target != null && value.target.removeFromParent();
                // 回收节点
                if (value.target) {
                    self.itemPoolList.put(value.target);
                }
            });
            // this.content.removeAllChildren();
        }

        this.itemData.dataList = _dataList;
        // 计算相关属性
        this.initSize();

        this.startIndex = 0;
        this.endIndex = 0;

        // this.render();

        console.log('list-view init end!');
        console.log('list length: ', _dataList.list.length);

        if (this.node.active) {
            this.scrollNow();
        }
    }

    /**
     * 检测节点数据是否合格
     * @param _dataList 节点数据
     */
    checkDataList (_dataList: initDataClass) {
        _dataList.list.map((value, index) => {
            typeof value.onUse == 'undefined' ? value.onUse = false : void(0);
        });
    }

    /**
     * 检测是否注册监听事件等操作
     */
    checkInitEventListener () {
        if (!this.onLoadEnd) {
            this.onLoadEnd = true;
            this.scrollView = this.node.getComponent(cc.ScrollView) ? this.node.getComponent(cc.ScrollView) : this.node.addComponent(cc.ScrollView);
            // 初始化
            this.scrollView.vertical = true;
            this.scrollView.horizontal = false;
            // 设置初始数据
            this.beforeLoad();

            this.addEventListener();
        }
    }

    /**
     * 添加监听事件等
     */
    addEventListener () {
        // 是否已经注册
        if (this.isAddListener) {
            return;
        }
        this.node.on(cc.Node.EventType.TOUCH_START, this.touchStartCall, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.touchEndCall, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.touchCancelCall, this);

        this.node.on("scrolling", this.scrollingCall, this);
        if (this.vertical) {
            this.node.on("scroll-to-bottom", this.scrollToEndCall, this);
            this.node.on("scroll-to-top", this.scrollToTopCall, this);
        } else {
            this.node.on("scroll-to-right", this.scrollToEndCall, this);
            this.node.on("scroll-to-left", this.scrollToTopCall, this);
        }

        this.isAddListener = true;
    }

    /**
     * 注销监听事件等
     */
    cancelEventListener () {
        // 是否已经注册
        if (!this.isAddListener) {
            return;
        }
        // this.node.off(cc.Node.EventType.TOUCH_START, this.touchStartCall, this);
        // this.node.off(cc.Node.EventType.TOUCH_END, this.touchEndCall, this);
        // this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.touchCancelCall, this);

        this.node.off("scrolling", this.scrollingCall, this);
        this.node.off("scroll-to-bottom", this.scrollToEndCall, this);
        this.node.off("scroll-to-right", this.scrollToEndCall, this);
        this.node.off("scroll-to-top", this.scrollToTopCall, this);
        this.node.off("scroll-to-left", this.scrollToTopCall, this);

        this.isAddListener = false;
    }

    /**
     * 立即滚动，此函数用于滚动一下生成对应的子节点
     */
    scrollNow () {
        this.scheduleOnce(() => {
            if (this.itemData.dataList.list.length > this.maxItemNum) {
                // console.log('scrollNow', this.itemData.dataList.list.length);
                // this.itemPoolList && this.render();

                if (this.vertical) {
                    this.scrollView.scrollToBottom(0.01);
                } else {
                    this.scrollView.scrollToRight(0.01);
                }
                this.scheduleOnce(() => {
                    if (this.vertical) {
                        this.scrollView.scrollToTop(0.01);
                    } else {
                        this.scrollView.scrollToLeft(0.01);
                    }
                }, 0.01);
            } else {
                this.startIndex = 0;
                this.endIndex = this.itemData.dataList.list.length - 1;
                this.itemPoolList && this.renderItem();

                if (this.vertical) {
                    this.scrollView.scrollToTop(0.01);
                } else {
                    this.scrollView.scrollToLeft(0.01);
                }
            }
            this.isReady = true;
        }, 0.1);
    }
    
    /**
     * 计算属性
     */
    initSize() {
        this.viewWidth = this.node.width;
        this.viewHeight = this.node.height;

        this.content.setAnchorPoint(0, 1);

        // console.log('viewWidth: ' + this.viewWidth + ' viewHeight: ' + this.viewHeight);
        this.mask.setAnchorPoint(0, 1);
        this.mask.setContentSize(this.viewWidth, this.viewHeight);
        this.mask.setPosition(-this.viewWidth / 2, this.viewHeight / 2);

        let spacingX = this.vertical ? 0 : this.spacing.spacingX;
        let spacingY = this.vertical ? this.spacing.spacingY : 0;

        this.contentHeight = (this.itemData.dataList.list.length * (this.itemData.itemHeight + spacingY)) - spacingY;
        this.contentWidth = (this.itemData.dataList.list.length * (this.itemData.itemWidth + spacingX)) - spacingX;

        // console.log('contentHeight:' + this.contentHeight + ',contentWidth:' + this.contentWidth);
        if (this.vertical) {
            // this.col = Math.ceil((this.contentHeight - this.viewHeight) / (this.itemData.itemHeight + spacingY));
            this.content.setContentSize(this.viewWidth, this.contentHeight + this.padding.top + this.padding.bottom);
            this.content.setPosition(0, 0);
            this.itemNumber = Math.floor(this.viewHeight / (this.itemData.itemHeight + this.spacing.spacingY));
        } else {
            // this.row = Math.ceil((this.contentWidth - this.viewWidth) / (this.itemData.itemWidth + spacingX));
            this.content.setContentSize(this.contentWidth + this.padding.left + this.padding.right, this.viewHeight);
            this.content.setPosition(0, 0);
            this.itemNumber = Math.floor(this.viewWidth / (this.itemData.itemWidth + this.spacing.spacingX));
        }
        console.log('view can show node max length: ', this.itemNumber);
        this.maxItemNum = this.itemNumber;

        if (this.itemNumber % 2 != 0) {
            this.itemNumber += 5;
        } else {
            this.itemNumber += 4;
        }

        console.log('create node poolList length: ', this.itemNumber);
        if (!this.itemPoolList) {
            this.itemPoolList = new cc.NodePool();
        }
        let nowPoolListSize = this.itemPoolList.size();
        for (let i = 0; i < this.itemNumber - nowPoolListSize; i++) {
            let item = cc.instantiate(this.itemData.itemPrefab);
            this.itemPoolList.put(item);
        }
    }

    private _touchBeganPos: cc.Vec2;
    private _touchEndPos: cc.Vec2;
    touchStartCall(e: cc.Event.EventTouch) {
        if (!this.isReady) {
            return;
        }
        this._touchBeganPos = e.touch.getLocation();
    }

    touchEndCall(e: cc.Event.EventTouch) {
        if (!this.isReady) {
            return;
        }
        this._touchEndPos = e.touch.getLocation();
        // this.handle_release_logic();
    }

    touchCancelCall(e: cc.Event.EventTouch) {
        if (!this.isReady) {
            return;
        }
        this._touchEndPos = e.touch.getLocation();
    }

    private lastPos: number;
    scrollingCall() {
        if (!this.isReady) {
            return;
        }

        let nowPos: number;
        let itemWidthOrHeight: number;
        if (this.vertical) {
            nowPos = this.content.y;
            itemWidthOrHeight = this.itemData.itemHeight + this.spacing.spacingY;
        } else {
            nowPos = this.content.x;
            itemWidthOrHeight = this.itemData.itemWidth + this.spacing.spacingX;
        }
        if (this.lastPos != null && Math.abs(nowPos - this.lastPos) < itemWidthOrHeight) {
            return;
        }
        this.lastPos = nowPos;

        // console.log('render');
        this.render();
    }

    render() {
        if (this.vertical) {
            let posy = this.content.y;
            // console.log("onscrolling, content posy=", posy);
            if (posy < 0) {
                posy = 0;
            } else if (posy > this.contentHeight - this.viewHeight) {
                posy = this.contentHeight - this.viewHeight;
            }
            let viewport_start = -posy;
            let viewport_stop = viewport_start - this.viewHeight;

            let start = this.indexFromOffset(viewport_start);
            let stop = this.indexFromOffset(viewport_stop);

            // console.log('start: ' + start + ' end: ' + stop);
            //expand viewport for better experience
            start = Math.max(start - this.col, 0);
            stop = Math.min(this.itemData.dataList.list.length - 1, stop + this.col);
            if (start != this.startIndex) {
                this.startIndex = start;
                this.inRender = true;
            }
            if (stop != this.endIndex) {
                this.endIndex = stop;
                this.inRender = true;
            }
        } else {
            let posx = this.content.x;
            // console.log("onscrolling, content posx=", posx);
            if (posx > 0) {
                posx = 0;
            } else if (posx < this.viewWidth - this.contentWidth) {
                posx = this.viewWidth - this.contentWidth;
            }
            let viewport_start = -posx;
            let viewport_stop = viewport_start + this.viewWidth;
            
            let start = this.indexFromOffset(viewport_start);
            let stop = this.indexFromOffset(viewport_stop);

            //expand viewport for better experience
            start = Math.max(start - this.row, 0);
            stop = Math.min(this.itemData.dataList.list.length - 1, stop + this.row);
            if (start != this.startIndex) {
                this.startIndex = start;
                this.inRender = true;
            }
            if (stop != this.endIndex) {
                this.endIndex = stop;
                this.inRender = true;
            }
        }
    }

    private indexFromOffset(offset: number): number {
        let low = 0;
        let high = 0;
        let max_idx = 0;
        high = max_idx = this.itemData.dataList.list.length - 1;
        if (this.vertical) {
            while (high >= low) {
                const index = low + Math.floor((high - low) / 2);
                const itemStart = ((index - 1 < 0 ? 0 : index - 1) * -(this.itemData.itemHeight + this.spacing.spacingY)) - this.padding.top;
                const itemStop = index < max_idx ? (index * -(this.itemData.itemHeight + this.spacing.spacingY)) - this.padding.top : -this.contentHeight;
                if (offset <= itemStart && offset >= itemStop) {
                    return index;
                } else if (offset > itemStart) {
                    high = index - 1;
                } else {
                    low = index + 1;
                }
            }
        } else {
            while (high >= low) {
                const index = low + Math.floor((high - low) / 2);
                const itemStart = ((index - 1 < 0 ? 0 : index - 1) * (this.itemData.itemWidth + this.spacing.spacingX)) + this.padding.left;
                const itemStop = index < max_idx ? (index * (this.itemData.itemWidth + this.spacing.spacingX)) + this.padding.left : this.contentWidth;
                if (offset >= itemStart && offset <= itemStop) {
                    return index;
                } else if (offset > itemStart) {
                    low = index + 1;
                } else {
                    high = index - 1;
                }
            }
        }
        return -1;
    }

    // start () {}

    update (dt) {
        // 需要渲染时，立马渲染所需的子节点
        if (this.inRender && cc.isValid(this.node)) {
            this.renderItem();
            this.inRender = false;
        }
    }

    private renderItem() {
        // console.log('startIndex:' + this.startIndex + ',endIndex:' + this.endIndex);
        for (let i = 0; i < this.startIndex; i++) {
            if (this.itemData.dataList.list[i].onUse) {
                // console.log("recycle_item", i);
                this.itemData.dataList.list[i].onUse = false;
                this.itemPoolList.put(this.itemData.dataList.list[i].target);
            }
        }
        for (let j = this.itemData.dataList.list.length - 1; j > this.endIndex; j--) {
            if (this.itemData.dataList.list[j].onUse) {
                // console.log("recycle_item", j);
                this.itemData.dataList.list[j].onUse = false;
                this.itemPoolList.put(this.itemData.dataList.list[j].target);
            }
        }
        for (let k = this.startIndex; k <= this.endIndex; k++) {
            if (!this.itemData.dataList.list[k].onUse) {
                this.itemData.dataList.list[k].onUse = true;
                // console.log("render_item", k);
                let _target: cc.Node;
                if (this.itemPoolList.size() > 0) {
                    _target = this.itemPoolList.get();
                } else {
                    _target = cc.instantiate(this.itemData.itemPrefab);
                }
                this.itemData.dataList.list[k].target = _target;
                this.itemData.dataList.list[k].target.parent = this.content;
                let targetComponent = null;
                if (this.itemData.dataList.className) {
                    targetComponent = this.itemData.dataList.list[k].target.getComponent(this.itemData.dataList.className);
                } else {
                    targetComponent = this.itemData.dataList.list[k].target.getComponent(this.itemData.dataList.list[k].targetComponentClass);
                }
                targetComponent.initData(this.itemData.dataList.list[k]);

                // if (typeof this.nowTargetComponentList[k] == 'undefined') {
                //     this.nowTargetComponentList[k] = targetComponent;
                // }
                this.itemData.dataList.list[k].targetComponent = targetComponent;
            }
            
            //列表添加与删除时item位置会变化，因此每次render_items都要执行
            // packItem.item.node.setPosition(packItem.x, packItem.y);
            this.setItemPosition(k);
        }
    }

    private setItemPosition(index: number) {
        let posX: number;
        let posY: number;

        if (this.vertical) {
            posX = (this.itemData.dataList.list[index].target.anchorX * this.itemData.itemWidth) + ((this.viewWidth - this.itemData.itemWidth) / 2) + this.padding.left - this.padding.right;
            posY = (index * (this.itemData.itemHeight + this.spacing.spacingY)) + ((1 - this.itemData.dataList.list[index].target.anchorY) * this.itemData.itemHeight) + this.padding.top;
        } else {
            posX = (index * (this.itemData.itemWidth + this.spacing.spacingX)) + (this.itemData.dataList.list[index].target.anchorX * this.itemData.itemWidth) + this.padding.left - this.padding.right;
            posY = ((1 - this.itemData.dataList.list[index].target.anchorY) * this.itemData.itemHeight) + ((this.viewHeight - this.itemData.itemHeight) / 2) + this.padding.top;
        }

        // console.log('目标位置x: ' + posX + ' y: ' + posY);
        if (this.itemData.dataList.list[index].target.x != posX || this.itemData.dataList.list[index].target.y != -posY) {
            this.itemData.dataList.list[index].target.x = posX;
            this.itemData.dataList.list[index].target.y = -posY;
        }
    }

    scrollToEndCall() {
        // cc.log('滚动到底部了');
        console.log('scroll to bottom or right');
    }

    scrollToTopCall() {
        console.log('scroll to top or left');
    }

    onDisable () {
        this.cancelEventListener();
    }

    onEnable () {
        if (this.onLoadEnd) {
            this.addEventListener();
        }
    }
}

export {
    itemList
}