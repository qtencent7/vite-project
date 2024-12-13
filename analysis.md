如何判断拖动的div在静态div的上侧：
如果，draggableDiv.top + draggableDiv.height < staticDiv.top，则在静态div上方

如何判断拖动的div在静态div的左侧：
如果，draggableDiv.left + draggableDiv.width < staticDiv.left，则在静态div左侧

如何判断拖动的div在静态div的右侧：
如果，draggableDiv.left > staticDiv.left + staticDiv.width，则在静态div右侧

如何判断拖动的div在静态div的下方：
如果，draggableDiv.top > staticDiv.top + staticDiv.height，则在静态div下方


对于拖动div而言：

如果同时在静态div的左侧和上侧，则计算拖动div到静态div的左侧和上侧的距离；

如果同时在静态div的左侧和下侧，则计算拖动div到静态div的左侧和下侧的距离；

如果同时在静态div的右侧和上侧，则计算拖动div到静态div的右侧和上侧的距离；

如果同时在静态div的右侧和下侧，则计算拖动div到静态div的右侧和下侧的距离；