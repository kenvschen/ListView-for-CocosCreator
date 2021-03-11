# ListView-for-CocosCreator

专用于**Cocos creator**的**TS**版 **滚动列表** 组件
该组件优化了节点性能，可定制化数据和功能，优化多节点列表显示性能。
该组件继承了**scroll-view**组件，需要类似**scroll-view**设置**mask**节点和**content**节点。
其他功能类似**scroll-view**组件，但只支持**竖排滚动或水平滚动**，暂不支持横竖滚动。

## 使用方法

1. 将**脚本**挂载到所需适配的节点上
2. 设置**mask**节点和**content**节点，设置**滚动方向**等属性
3. 设置**mask**节点中心点为(0, 1)，content节点中心点为(0, 1)
4. 制作子节点预制体，将**listViewItem脚本**或者将**继承listViewItem类的脚本**挂载到子节点预制体上
5. 设置子节点宽度和高度（暂不支持自适应获取宽高度），设置子节点预制体
6. 设置内部**Padding**属性
7. 设置子节点**间隔属性**
8. 在**onload**或之后回调 调用**listView.init()**函数，具体使用方法和传参请看下面的详情
9. 如页面已经处于激活状态，则自动渲染子节点，如页面目前处于非激活状态，则在激活时调用**scrollNow**函数
   如下图示例：
   ![listview组件示例](https://img-blog.csdnimg.cn/20210311170313370.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2tlbnZz,size_16,color_FFFFFF,t_70)

## 组件暴露函数和数据类

```typescript
/**
 * 子节点数据类
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
class initDataClass {
    // 子节点控制类名（如设置了这个则默认不使用list子数据里的子节点控制类名
    className?: string = '';
    // 子节点数据列表
    list: itemList[] = [];
}

/**
 * 组件设置子节点数据类
 */
class itemPropClass {
	// 子节点宽度
	itemWidth: number = 0;
	// 子节点高度
	itemHeight: number = 0;
	// 子节点预制体
	itemPrefab: cc.Prefab = null;
}

/**
 * 组件设置内边距数据类
 */
class paddingClass {
	// 顶部边距
	top: number = 0;
	// 左边距
	left: number = 0;
	// 右边距
	right: number = 0;
	// 底部边距
	bottom: number = 0;
}

/**
 * 组件设置子节点间距数据类
 */
class spacingClass {
	// 水平间距
	spacingX: number = 0;
	// 竖排间距
	spacingY: number = 0;
}

/**
 * 主组件
 */
class ListViewCompent extends cc.Component {
	// 内容节点
	content: cc.Node;
	// 遮罩节点
	mask: cc.Node;
	// 子节点数据
	itemData: itemPropClass;
	// 内容内边距
	padding: paddingClass;
	// 子节点间距
	spacing: spacingClass;
	// 开启水平滚动
	horizontal: boolean;
	// 开启竖排滚动
	vertical: boolean;
	// ...其他跟scrollView一致

	/**
     * 初始化数据列表，包括 计算相关信息、生成节点等操作
     * @param _dataList 节点数据
     */
    init(_dataList: initDataClass) {}

	/**
     * 立即滚动，此函数用于滚动一下生成对应的子节点
     */
    scrollNow () {}

	/**
	 * 水平滚动至最右边时会触发，竖排滚动至最底部时会触发
	 */
	scrollToEndCall () {}
}

/**
 * 子节点组件类
 */
class ListViewItem extends cc.Component {

    initData(_data: itemList) {
        // 自己创建的脚本继承这个类，在item使用时会调用此方法
        // 可以在自定义初始化或者做其他操作
		// _data 会传本身的 数据
    }
}
```

通过暴露的数据类和函数，我们可以很简单的操控这个组件，可随意添加新的功能，如：到底自动加载更多数据或下拉刷新等。
可通过设置节点数据列表中的 **onUse** 来控制是否渲染，如果 **onUse** 处于false状态，滚动到属于该子节点位置时就会自动渲染一个节点继承该子节点，否则则**不渲染**该子节点。

**init函数**中的 **className** 则是用于获取控制组件的名，设置 **className** 时默认使用全局的 **className** 而不使用 子节点的 **className** 去获取。

子节点组件类中的**initData**则是可以自由的覆盖，实现初始化子节点的显示效果等操作。

如有问题或者错误可私信我，谢谢大家观看！喜欢的话可以Like一下！
