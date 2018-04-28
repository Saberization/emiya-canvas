# emiya-canvas.js 解决ios下拍照倾斜与canvas高清屏下绘图模糊

## 场景

解决在移动端拍照，用 `canvas` 绘图出现图片逆时针旋转 `90` 度的问题。

`canvas` 在高清屏与retina屏下绘图模糊的问题。

## 示例

[在线预览](http://guotq.get.vip/emiya-canvas/showcase.html)

或者扫描二维码查看

![](https://ws1.sinaimg.cn/large/006d7zD3gy1fqrdnliltoj30eg0eg74h.jpg)

## 处理与未处理对比



## 使用方法

```html
<!-- 直接引入源文件即可 -->
<script src="emiya-canvas.js"></script>
```

## 方法说明

通过 `new` 创建一个 `EmiyaCanvas` 的实例，创建过程当中做了一些初始化组件的操作。

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

__参数说明__

| 参数 | 参数类型 | 说明 |
| :------------- |:-------------:|:-------------|
| canvasEl | HTMLElement | `必选` 需要渲染的canvas元素 |
| options | Object | `必选` 设置画布的一些参数 `width` 画布宽度 `quality` 图片质量，范围在 `0 - 1` 之间，默认值为 `0.8` |
| callback | Function | `可选` 回调函数，返回了图片的 `base64` 值，与一些 `canvas` 的参数 |

