### dom查询
* `$ic()`  // 获取节点，库所有dom方法都是根据`$ic`获取到dom节点后进行的
* `find(expr)`     //  根据查询子孙节点 内部使用`querySelectorAll`
* `findOne(expr)`  // 查询子孙中的第一个节点 内部使用`querySelector`
* `children()`     // 查询所有儿子节点(不包括孙子) 内部使用js children
* `parent(expr)`   // 获取直接父亲节点(亲生父亲),传递expr表示查找某种类型的直接父亲节点
* `parents(expr)`  // 获取所有祖先(父亲，爷爷..)，传递expr表示查找某种类型的祖先节点
* `offsetParent()` // 与当前元素最近的经过定位(position不等于static)的父级元素
* `siblings(expr)` // 查找节点的所有兄弟节点，不分前后

### 管理类
* `addClass(className)`  // 添加类
* `removeClass(className)` // 移除类
* `replaceClass(removeClass, addClass)` // 替换类 （先移除 后添加）
* `toggleClass(className)` // 存在移除，不存在添加类, 多各类单独判断
* `containsClass(className)` // 判断是否包含类

### 获取属性（宽高..）
* `clientWidth()` // 对象可见的宽度，不包滚动条等边线，会随窗口的显示大小改变 返回`整型`
* `offsetWidth()` // 对象的可见宽度，包滚动条等边线，会随窗口的显示大小改变 返回`整型`
* `scrollWidth()` // 对象实际内容的宽度 返回`整型`
* `scrollTop(val)`   // 读写，获取或设置元素滚动距离,返回整数，赋值`整数`， 单位px
* `offset()`         // 只读 元素 offsetLeft, offsetTop, 偏移到body标签的距离 return {left: num, top: num}
* `position()`      // 只读,相对于版面或由 offsetParent 属性指定的父坐标的计算上侧左侧位置，返回return {left: num, top: num}，单位px

### 事件绑定：
* `on`：  绑定事件
* `one`： 绑定事件只执行一次
* `off`:  解除事件绑定
