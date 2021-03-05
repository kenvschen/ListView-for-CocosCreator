// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

const config = {
    gameWidth: 0,
    gameHeight: 0
};

const adaptationType = cc.Enum({
    // 吸附顶部，距离为 value，判断基准固定为高度
    吸附顶部: 0,
    // 吸附底部，距离为 value，判断基准固定为高度
    吸附底部: 1,
    // 吸附左边，距离为 value，判断基准固定为宽度
    吸附左边: 2,
    // 吸附右边，距离为 value，判断基准固定为宽度
    吸附右边: 3,    
    // 适配高度,可设置上下扣除高度或扣除百分比高度
    适配高度: 4,
    // 适配宽度，可设置左右扣除宽度或扣除百分比宽度
    适配宽度: 5,
    // 根据最大范围和最小范围来自适应吸附顶部，数值必须是固定值
    根据范围自适应吸附顶部: 6,
    // 根据最大范围和最小范围来自适应吸附底部，数值必须是固定值
    根据范围自适应吸附底部: 7,
    // 根据最大范围和最小范围来自适应吸附左边，数值必须是固定值
    根据范围自适应吸附左边: 8,
    // 根据最大范围和最小范围来自适应吸附右边，数值必须是固定值
    根据范围自适应吸附右边: 9,
    // 适配是否在范围内，如果小于范围则显示滚动条，适配极端尺寸
    自适应显示滚动条: 10,
});

const szieType = cc.Enum({
    /**
     * 根据宽度适配
     */
    adaptationWidth: 0,
    /**
     * 根据高度适配
     */
    adaptationHeight: 1
});

@ccclass('adaptationListClass')
class adaptationListClass {
    // 类型
    @property({
        type: adaptationType,
        displayName: 'adaptationType',
        tooltip: '适配规则类型'
    })
    type = adaptationType.吸附顶部;

    @property({
        type: szieType,
        displayName: 'adaptationFromType',
        tooltip: '适配规则判断标准'
    })
    szieType = szieType.adaptationWidth;

    // 数值
    @property({
        visible() {
            return (this.type != adaptationType.适配宽度 && this.type != adaptationType.适配高度 && this.type != adaptationType.根据范围自适应吸附顶部 && this.type != adaptationType.根据范围自适应吸附底部 && this.type != adaptationType.根据范围自适应吸附左边 && this.type != adaptationType.根据范围自适应吸附右边 && this.type != adaptationType.自适应显示滚动条);
        },
        displayName: 'value',
        tooltip: '根据规则扣除的数值，1以下小数为百分比，其他为固定扣除'
    })
    value: number = 0;

    // 固定顶部数值
    @property({
        visible() {
            return (this.type == adaptationType.适配高度);
        },
        displayName: 'costTopValue',
        tooltip: '距离顶边扣除数值, 1以下小数为百分比，其他为固定扣除'
    })
    costTopValue: number = 0;

    // 固定底部数值
    @property({
        visible() {
            return (this.type == adaptationType.适配高度);
        },
        displayName: 'costBottomValue',
        tooltip: '距离底边扣除数值, 1以下小数为百分比，其他为固定扣除'
    })
    costBottomValue: number = 0;

    // 固定左边数值
    @property({
        visible() {
            return (this.type == adaptationType.适配宽度);
        },
        displayName: 'costLeftValue',
        tooltip: '距离左边扣除数值, 1以下小数为百分比，其他为固定扣除'
    })
    costLeftValue: number = 0;

    // 右边数值(1以下小数为百分比，其他为固定扣除)
    @property({
        visible() {
            return (this.type == adaptationType.适配宽度);
        },
        displayName: 'costRightValue',
        tooltip: '距离右边扣除数值, 1以下小数为百分比，其他为固定扣除'
    })
    costRightValue: number = 0;

    // 最大范围的情况下，适配的数值
    @property({
        visible() {
            return (this.type == adaptationType.根据范围自适应吸附顶部 || this.type == adaptationType.根据范围自适应吸附底部 || this.type == adaptationType.根据范围自适应吸附左边 || this.type == adaptationType.根据范围自适应吸附右边);
        },
        displayName: 'minValue',
        tooltip: '最大范围下的数值，如正常尺寸下的适配数值'
    })
    minValue: number = 0;

    // 高度最小范围的情况下，距离顶部的数值
    @property({
        visible() {
            return (this.type == adaptationType.根据范围自适应吸附顶部 || this.type == adaptationType.根据范围自适应吸附底部 || this.type == adaptationType.根据范围自适应吸附左边 || this.type == adaptationType.根据范围自适应吸附右边);
        },
        displayName: 'maxValue',
        tooltip: '最小范围下的数值，如安全区下的适配数值'
    })
    maxValue: number = 0;

    // 最小范围
    @property({
        visible() {
            return (this.type == adaptationType.根据范围自适应吸附顶部 || this.type == adaptationType.根据范围自适应吸附底部 || this.type == adaptationType.根据范围自适应吸附左边 || this.type == adaptationType.根据范围自适应吸附右边 || this.type == adaptationType.自适应显示滚动条);
        },
        displayName: 'minRange',
        tooltip: '最小范围数值，如设计稿最小安全区尺寸'
    })
    minRange: number = 0;

    // 最大范围
    @property({
        visible() {
            return (this.type == adaptationType.根据范围自适应吸附顶部 || this.type == adaptationType.根据范围自适应吸附底部 || this.type == adaptationType.根据范围自适应吸附左边 || this.type == adaptationType.根据范围自适应吸附右边);
        },
        displayName: 'maxRange',
        tooltip: '最大范围数值，如设计稿最大尺寸'
    })
    maxRange: number = 0;
}

@ccclass
export default class adaptation extends cc.Component {

    // 设计稿尺寸
    @property({
        displayName: 'configSize',
        tooltip: '设计稿尺寸'
    })
    configSize: cc.Size = cc.size(0, 0);
    
    @property({
        type: [adaptationListClass],
        displayName: 'adaptationList',
        tooltip: '适配规则列表，从头到底一条条执行'
    })
    adaptationList: adaptationListClass[] = [];

    // LIFE-CYCLE CALLBACKS:
    private nowSize: cc.Size = null;
    private firstAdaptation: boolean = true;

    onLoad() {
        this.nowSize = cc.size(cc.winSize.width, cc.winSize.height);
        // cc.log(cc.winSize);
        this.setWidget();

        this.firstAdaptation = false;
    }

    /**
     * 开始适配规则
     */
    setWidget() {
        // 系统尺寸
        let winSize = cc.size(cc.winSize.width, cc.winSize.height);
        // 设计尺寸
        let configSize = this.returnConfigSize();
        // 对齐组件
        let widget: cc.Widget = null;

        let _top: number, _bottom: number, _left: number, _right: number;
        let _height: number, _width: number;

        cc.log('winSize', winSize);
        cc.log('configSize', configSize);

        if (this.adaptationList.length > 0) {
            widget = this.node.getComponent(cc.Widget) ? this.node.getComponent(cc.Widget) : this.node.addComponent(cc.Widget);
        } else {
            // this.node.removeComponent(cc.Widget);
            this.node.getComponent(cc.Widget) ? this.node.getComponent(cc.Widget).enabled = false : void(0);
        }

        this.adaptationList.map(value => {
            value.value = Math.abs(value.value);
            value.costBottomValue = Math.abs(value.costBottomValue);
            value.costTopValue = Math.abs(value.costTopValue);
            value.costLeftValue = Math.abs(value.costLeftValue);
            value.costRightValue = Math.abs(value.costRightValue);
            switch (value.type) {
                // 吸附顶部
                case adaptationType.吸附顶部:
                    _top = (configSize.height - winSize.height) / 2;
                    cc.log('吸附顶部', _top);
                    widget.enabled = true;
                    widget.top = (value.value < 1 && value.value != 0) ? _top + winSize.height * value.value : _top + value.value;
                    widget.isAlignTop = true;
                    widget.updateAlignment();
                    break;
                // 吸附底部
                case adaptationType.吸附底部:
                    let _bottom = (configSize.height - winSize.height) / 2;
                    cc.log('吸附底部', _bottom);
                    widget.enabled = true;
                    widget.bottom = (value.value < 1 && value.value != 0) ? _bottom + winSize.height * value.value : _bottom + value.value;
                    widget.isAlignBottom = true;
                    widget.updateAlignment();
                    break;
                // 吸附左边
                case adaptationType.吸附左边:
                    _left = (configSize.width - winSize.width) / 2;
                    cc.log('吸附左边', _left);
                    widget.enabled = true;
                    widget.left = (value.value < 1 && value.value != 0) ? _left + winSize.width * value.value : _left + value.value;
                    widget.isAlignLeft = true;
                    widget.updateAlignment();
                    break;
                // 吸附右边
                case adaptationType.吸附右边:
                    _right = (configSize.width - winSize.width) / 2;
                    cc.log('吸附右边', _right);
                    widget.enabled = true;
                    widget.right = (value.value < 1 && value.value != 0) ? _right + winSize.width * value.value : _right + value.value;
                    widget.isAlignRight = true;
                    widget.updateAlignment();
                    break;
                // 适配高度
                case adaptationType.适配高度:
                    _top = value.costTopValue < 1 && value.costTopValue != 0 ? value.costTopValue * winSize.height : value.costTopValue;
                    _bottom = value.costBottomValue < 1 && value.costBottomValue != 0 ? value.costBottomValue * winSize.height : value.costBottomValue;
                    if (_top + _bottom > winSize.height) {
                        _top = winSize.height / 2;
                        _bottom = winSize.height / 2;
                    }
                    _height = winSize.height - _top - _bottom;
                    cc.log('适配高度', _height);
                    this.node.height = _height;
                    break;
                // 适配宽度
                case adaptationType.适配宽度:
                    _left = value.costLeftValue < 1 && value.costLeftValue != 0 ? value.costLeftValue * winSize.width : value.costLeftValue;
                    _right = value.costRightValue < 1 && value.costRightValue != 0 ? value.costRightValue * winSize.width : value.costRightValue;
                    if (_left + _right > winSize.width) {
                        _left = winSize.width / 2;
                        _right = winSize.width / 2;
                    }
                    _width = winSize.width - _left - _right;
                    cc.log('适配宽度', _width);
                    this.node.width = _width;
                    break;
                // 根据范围自适应吸附顶部，在最大范围时，适配取值为最小值，最小范围下，适配取值为最大值
                case adaptationType.根据范围自适应吸附顶部:
                    if (value.minRange > (value.szieType == szieType.adaptationWidth ? winSize.width : winSize.height)) {
                        _top = value.maxValue;
                    } else if (value.maxRange < (value.szieType == szieType.adaptationWidth ? winSize.width : winSize.height)) {
                        _top = value.minValue;
                    } else {
                        _top = ((1 - ((value.szieType == szieType.adaptationWidth ? winSize.width : winSize.height) - value.minRange) / (value.maxRange - value.minRange)) * (value.maxValue - value.minValue)) + value.minValue;
                    }
                    cc.log('根据范围自适应吸附顶部', _top);

                    widget.enabled = true;
                    widget.top = _top;
                    widget.isAlignTop = true;
                    widget.updateAlignment();
                    break;
                // 根据范围自适应吸附底部，在最大范围时，适配取值为最小值，最小范围下，适配取值为最大值
                case adaptationType.根据范围自适应吸附底部:
                    // cc.log('minRange: ' + value.minRange + ' winSize.width:' + winSize.width);
                    if (value.minRange > (value.szieType == szieType.adaptationWidth ? winSize.width : winSize.height)) {
                        _bottom = value.maxValue;
                        // cc.log('高度小于最小值', _bottom);
                    } else if (value.maxRange < (value.szieType == szieType.adaptationWidth ? winSize.width : winSize.height)) {
                        _bottom = value.minValue;
                        // cc.log('高度大于最大值', _bottom);
                    } else {
                        _bottom = ((1 - ((value.szieType == szieType.adaptationWidth ? winSize.width : winSize.height) - value.minRange) / (value.maxRange - value.minRange)) * (value.maxValue - value.minValue)) + value.minValue;
                        // cc.log('范围', _bottom);
                    }
                    
                    widget.enabled = true;
                    widget.bottom = _bottom;
                    widget.isAlignBottom = true;
                    widget.updateAlignment();
                    break;
                // 根据范围自适应吸附左边，在最大范围时，适配取值为最小值，最小范围下，适配取值为最大值
                case adaptationType.根据范围自适应吸附左边:
                    // let _left = null;
                    if (value.minRange > (value.szieType == szieType.adaptationWidth ? winSize.width : winSize.height)) {
                        _left = value.maxValue;
                    } else if (value.maxRange < (value.szieType == szieType.adaptationWidth ? winSize.width : winSize.height)) {
                        _left = value.minValue;
                    } else {
                        _left = ((1 - ((value.szieType == szieType.adaptationWidth ? winSize.width : winSize.height) - value.minRange) / (value.maxRange - value.minRange)) * (value.maxValue - value.minValue)) + value.minValue;
                    }
                    
                    widget.enabled = true;
                    widget.left = _left;
                    widget.isAlignLeft = true;
                    widget.updateAlignment();
                    break;
                // 根据范围自适应吸附右边，在最大范围时，适配取值为最小值，最小范围下，适配取值为最大值
                case adaptationType.根据范围自适应吸附右边:
                    // let _right = null;
                    if (value.minRange > (value.szieType == szieType.adaptationWidth ? winSize.width : winSize.height)) {
                        _right = value.maxValue;
                    } else if (value.maxRange < (value.szieType == szieType.adaptationWidth ? winSize.width : winSize.height)) {
                        _right = value.minValue;
                    } else {
                        _right = ((1 - ((value.szieType == szieType.adaptationWidth ? winSize.width : winSize.height) - value.minRange) / (value.maxRange - value.minRange)) * (value.maxValue - value.minValue)) + value.minValue;
                    }
                    
                    widget.enabled = true;
                    widget.right = _right;
                    widget.isAlignRight = true;
                    widget.updateAlignment();
                    break;
                // 适配是否在范围内，如果小于范围则显示滚动条
                case adaptationType.自适应显示滚动条:
                    let scrollView = this.node.getComponent(cc.ScrollView);
                    if (!scrollView) {
                        scrollView = this.node.addComponent(cc.ScrollView);
                        scrollView.vertical = false;
                        scrollView.horizontal = false;
                        // 生成遮罩节点
                        let viewNode = new cc.Node('view');
                        viewNode.setContentSize(winSize);
                        // 添加mask组件
                        let mask = viewNode.addComponent(cc.Mask);
                        mask.type = cc.Mask.Type.RECT;
                        mask.enabled = true;
                        // 生成content节点
                        let contentNode = new cc.Node('content');
                        contentNode.setContentSize(this.node.getContentSize());

                        let childrens = this.node.children.concat([]);
                        this.node.removeAllChildren(false);
                        childrens.map(item => {
                            // cc.log('item', item, item.getComponent(cc.Camera));
                            if (!item.getComponent(cc.Camera)) {
                                // item.removeFromParent(false);
                                contentNode.addChild(item, item.zIndex);
                            }
                        });

                        contentNode.parent = viewNode;
                        viewNode.parent = this.node;
                        scrollView.content = contentNode;
                    } else {
                        // 设置遮罩节点尺寸
                        scrollView.content.parent.setContentSize(winSize);
                        // 设置content尺寸
                        scrollView.content.setContentSize(this.node.getContentSize());
                    }
                    if (value.minRange > (value.szieType == szieType.adaptationWidth ? winSize.width : winSize.height)) {
                        cc.log('屏幕尺寸不足开启滚动, 滚动至居中');
                        scrollView.enabled = true;
                        if (value.szieType == szieType.adaptationWidth) {
                            scrollView.horizontal = true;
                            scrollView.horizontalScrollBar ? scrollView.horizontalScrollBar.node.active = true : void (0);
                        } else {
                            scrollView.vertical = true;
                            scrollView.verticalScrollBar ? scrollView.verticalScrollBar.node.active = true : void (0);
                        }

                        cc.director.once(cc.Director.EVENT_AFTER_DRAW, () => {
                            scrollView.scrollToOffset(cc.v2(value.szieType == szieType.adaptationWidth ? (configSize.width - winSize.width) / 2 : 0, value.szieType == szieType.adaptationWidth ? 0 : (configSize.height - winSize.height) / 2));
                        });
                    } else {
                        cc.log('屏幕尺寸足够不开启滚动');
                        scrollView.enabled = false;
                        scrollView.verticalScrollBar ? scrollView.verticalScrollBar.node.active = false : void (0);
                        scrollView.horizontalScrollBar ? scrollView.horizontalScrollBar.node.active = false : void (0);
                    }
                    break;
            }
        });
    }

    /**
     * 返回屏幕尺寸
     * 如设置了config里的宽高不为0，则使用config里的数据作为基准
     * 否则使用configSize里的数据为基准
     */
    returnConfigSize (): cc.Size {
        if (config.gameWidth !== 0 && config.gameHeight !== 0) {
            return cc.size(config.gameWidth, config.gameHeight);
        } else {
            return this.configSize;
        }
    }

    // start () {}

    update (dt: number) {
        if (!this.firstAdaptation && (cc.winSize.width != this.nowSize.width || cc.winSize.height != this.nowSize.height)) {
            this.nowSize = cc.size(cc.winSize.width, cc.winSize.height);

            this.setWidget();
        }
    }
}