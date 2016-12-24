### dom查询
* `$ic()`  // 获取节点，库所有dom方法都是根据`$ic`获取到dom节点后进行的
* `find()`         // 根据查询子孙节点
* `offsetParent()` // 与当前元素最近的经过定位(position不等于static)的父级元素

### 管理类
* `addClass`  // 添加类
* `removeClass` // 移除类
* `replaceClass` // 替换类 （先移除后添加）
* `toggleClass` // 存在移除，不存在添加类
* `containsClass` // 判断是否包含类

### 获取属性（宽高..）
* `clientWidth` // 对象可见的宽度，不包滚动条等边线，会随窗口的显示大小改变
* `offsetWidth` // 对象的可见宽度，包滚动条等边线，会随窗口的显示大小改变
* `scrollWidth` // 对象实际内容的宽度
* `offsetLeft`  // 相对于版面或由 offsetParent 属性指定的父坐标的计算左侧位置，返回整型，单位像素
* `offsetTop`   // 只读,相对于版面或由 offsetParent 属性指定的父坐标的计算上侧位置，返回整型，单位像素

事件绑定：
* `on`：  绑定事件
* `one`： 绑定事件只执行一次
* `off`:  解除事件绑定