# ListView-for-CocosCreator

该适配组件可自适配移动端屏幕，提供多种适配规则：

1. 吸附顶部、底部、左边、右边，可设置上下或左右扣除的值（为1以下小数时为当前屏幕宽度、高度乘于该值，为1以上的值时为当前屏幕宽度、高度减去该值）
   ![吸附顶部、底部、左边、右边的示例图片](https://img-blog.csdnimg.cn/20210305143844616.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2tlbnZz,size_16,color_FFFFFF,t_70)
2. 适配宽度、高度，即铺满当前屏幕的宽度、高度，可设置上下或左右扣除的值（为1以下小数时为当前屏幕宽度、高度乘于该值，为1以上的值时为当前屏幕宽度、高度减去该值）
   ![适配宽度高度的示例图片](https://img-blog.csdnimg.cn/20210305145340786.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2tlbnZz,size_16,color_FFFFFF,t_70)
3. 根据范围，自适应吸附顶部、底部、左边、右边。在屏幕尺寸大于等于最大范围下，吸附值为最小值，在屏幕尺寸小于等于最小范围下，吸附值为最大值。
   ![自适应根据范围吸附顶部、底部、左边、右边的示例图片](https://img-blog.csdnimg.cn/20210305145705495.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2tlbnZz,size_16,color_FFFFFF,t_70)
   如果还是不太清楚，给你们放一下示例的图片：
   ![自适应适配规则示例图片](https://img-blog.csdnimg.cn/20210305153400853.jpg?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L2tlbnZz,size_16,color_FFFFFF,t_70)
   我们来根据这张图片来分析一下，在最大尺寸1624下，取值为100，在小尺寸下，取值则在100-200之间浮动。
   这样在大屏幕下，不会出现主要元素都处于安全区，出现其他区域很空的状况。显示效果更好
   小屏幕下，也不会出现主要元素被裁剪的情况。
4. 根据范围显示或不显示滚动条，在屏幕尺寸小于范围下会显示滚动条，防止元素被截取不可操作。在屏幕尺寸大于范围的情况，则不会显示滚动条。
   添加这个规则，是防止出现极端尺寸下（列如：iframe嵌套），主要元素和按钮等被遮挡不可操作。

## 使用方法

1. 挂载到所需适配的节点上
2. 往规则列表添加适配规则
