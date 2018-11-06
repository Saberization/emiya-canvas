# emiya-canvas.js 解决ios下拍照倾斜与canvas高清屏下绘图模糊

## 场景

解决在移动端拍照，用 `canvas` 绘图出现图片逆时针旋转 `90` 度的问题。

`canvas` 在高清屏与retina屏下绘图模糊的问题。

__如下图：__

下图是拍照过后渲染在画布上的图片，很明显未经处理过的图片，逆时针旋转了 `90` 度，并且图片很模糊。

通过使用 `emiya-canvas.js` 处理过后的图片，修正了正确的图片方向，并且图片也变得清晰了。

![](https://ws1.sinaimg.cn/large/006d7zD3gy1fqsfa14xqsj30ku112hdu.jpg)

在来一张是从相册选择的图片来看一下：

![](https://ws1.sinaimg.cn/large/006d7zD3gy1fqsfl6t99jj30ku112u0x.jpg)

未修正的图片很模糊，修正过后的图片就清晰了许多。

## 示例

[点击在线预览demo](http://guotq.get.vip/emiya-canvas/showcase.html)

或者扫描二维码查看

![](https://ws1.sinaimg.cn/large/006d7zD3gy1fqrdnliltoj30eg0eg74h.jpg)

## 使用方法

```html
<!-- 直接引入源文件即可 -->
<script src="emiya-canvas.js"></script>
```

## 方法说明

通过 `new` 创建生成一个 `EmiyaCanvas` 的实例，创建过程当中做了一些初始化组件的操作。

```js
const emiyaInstacne = new EmiyaCanvas();
```

注：此组件下的 `API` 必须待组件初始完毕后使用。

### setFile(file)

设置图片文件对象

```js
emiyaInstacne.setFile(file);
```

__参数说明__

| 参数 | 参数类型 | 说明 |
| :------------- |:-------------:|:-------------|
| file | Object | `必选` 文件对象 |

### render(canvas, options, callback)

渲染 `canvas`

```js
emiyaInstacne.render(canvasEl, {
    width: 300,
    quality: .8
}, function(response) {
    console.log(response);
});
```

__response__ 返回格式如下：

```
{
    base64: '', // 修正过后图片的 base64 值
    width: 300, // 画布宽度
    height: 300 // 画布高度
}
```

__参数说明__

| 参数 | 参数类型 | 说明 |
| :------------- |:-------------:|:-------------|
| canvasEl | HTMLElement | `必选` 需要渲染的canvas元素 |
| options | Object | `必选` 设置画布的一些参数 `width` 画布宽度 `quality` 图片质量，范围在 `0 - 1` 之间，默认值为 `0.8` |
| callback | Function | `可选` 回调函数，返回了图片的 `base64` 值，与一些 `canvas` 的参数 |

**觉得还不错就给个 `star` 呗~**
