/*
 * @Author: guotq
 * @Date: 2018-04-25 16:59:49
 * @Last Modified by: guotq
 * @Last Modified time: 2018-06-05 16:38:11
 * @Description: canvas hdmi
 */

(function (global, factory) {

    typeof exports === 'object' && module !== undefined ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory()) : global.EmiyaCanvas = factory();
        
}(window, function () {
    
    const defaultSettings = {
        width: window.screen.width,
        height: window.screen.height,
        quality: .8
    };

    const EXIF = window.EXIF;

    class EmiyaCanvas {

        /**
         * 
         * @param {Object} options 配置项
         * width 图片高度
         * height 图片宽度
         * quality 压缩质量，默认 0.8
         */
        constructor() {
            this.el = {
                img: new Image()
            };

            this._data = {};

            // _data 不可枚举
            Object.defineProperty(this, '_data', {
                enumerable: false
            });
        }

        /**
         * 设置 blob 并且对其操作
         * @param {Blob} file 文件对象
         */
        setFile(file) {
            this._data.file = file;
        }

        /**
         * 渲染文件
         * @param {HTMLElement} canvasId 画布id
         * @param {Object} options 配置项
         * @param {Function} callback 回调函数
         */
        render(canvasId, options, callback) {
            const canvasEl = this.getHTMLElement(canvasId);
            const file = this._data.file;

            this.el.canvas = canvasEl;
            this.renderCallback = callback;

            if (!file) {
                throw new Error('请先调用 setFile api 设置文件对象');
            }

            // 合并对象
            this.extend(this._data, options, defaultSettings);
            // 处理文件
            this._handleFile(canvasEl, file);
        }

        /**
         * 处理文件
         * @param {HTMLElement} canvasEl canvas元素
         * @param {Object} file 文件对象
         */
        _handleFile(canvasEl, file) {
            const p = this.blobToBase64(file),
                imgEl = this.el.img,
                that = this;

            p.then(function (b64) {
                imgEl.src = b64;
                that._data.base64 = b64;

                imgEl.onload = function () {
                    EXIF.getData(file, function () {
                        EXIF.getAllTags(this);

                        // 绘制图片
                        that._drawImage(b64, EXIF.getTag(this, 'Orientation'));
                    });
                };
            });
        }

        /**
         * 绘制图片
         * @param {String} b64 未矫正图片的 base64
         * @param {Number} orientation 方位坐标
         */
        _drawImage(b64, orientation) {
            const options = this._data,
                canvasEl = this.el.canvas,
                ctx = canvasEl.getContext('2d'),
                mime = this.getImgMIME(b64),
                renderCallback = this.renderCallback;

            let pixelRatio = this.getPixelRatio(ctx);

            pixelRatio = pixelRatio ? pixelRatio + 2 : 0;

            let ret = this._getResize(options);
            let result = this._handleOrientation(ret, orientation);
            let canvasWidth = result.canvasWidth,
                canvasHeight = result.canvasHeight,
                drawWidth = result.drawWidth * pixelRatio,
                drawHeight = result.drawHeight * pixelRatio;
            
            const pixelRatioWidth = canvasWidth * pixelRatio,
                pixelRatioHeight = canvasHeight * pixelRatio,
                degree = result.degree;

            canvasEl.width = pixelRatioWidth;
            canvasEl.height = pixelRatioHeight;
            canvasEl.style.width = canvasWidth + 'px';
            canvasEl.style.height = canvasHeight + 'px';

            ctx.rotate(degree * Math.PI / 180);
            ctx.drawImage(this.el.img, 0, 0, drawWidth, drawHeight);

            if (renderCallback && typeof renderCallback === 'function') {
                renderCallback.call(this, {
                    base64: canvasEl.toDataURL(mime, this._data.quality),
                    width: canvasWidth,
                    height: canvasHeight
                });
            }
        }

        /**
         * 获取画布的参数
         * @param {Function} callback 回调函数
         */
        getCanvasOptions(callback) {
            this.getCanvasOptionsCallback = callback;
        }

        /**
         * 获取正确尺寸
         * @param {Object} options 配置项
         * @returns {Object} 复合条件的宽度与高度
         */
        _getResize(options) {
            const that = this,
                img = that.el.img,
                width = parseInt(options.width, 10),
                height = parseInt(options.height, 10),
                orientation = that.orientation,
                imgWidth = img.width,
                imgHeight = img.height;

            let ret = {
                width: imgWidth,
                height: imgHeight
            };

            if ('5678'.includes(orientation)) {
                ret.width = imgWidth;
                ret.height = imgHeight;
            }

            // 如果原图小于设定，采用原图
            if (ret.width < width || ret.height < height) {
                return ret;
            }

            var scale = ret.width / ret.height;

            if (width && height) {
                if (scale >= width / height) {
                    if (ret.width > width) {
                        ret.width = width;
                        ret.height = Math.ceil(width / scale);
                    }
                } else {
                    if (ret.height > height) {
                        ret.height = height;
                        ret.width = Math.ceil(height * scale);
                    }
                }
            } else if (width) {
                if (width < ret.width) {
                    ret.width = width;
                    ret.height = Math.ceil(width / scale);
                }
            } else if (height) {
                if (height < ret.height) {
                    ret.width = Math.ceil(height * scale);
                    ret.height = height;
                }
            }

            // 超过这个值base64无法生成，在IOS上
            while (ret.width >= 3264 || ret.height >= 2448) {
                ret.width *= 0.8;
                ret.height *= 0.8;
            }

            return ret;
        }

        /**
         * 处理方位 - 依赖 exif.js
         * https://github.com/exif-js/exif-js
         * @param {Number} ret 图片按照比例算后的宽高
         * @param {Object} orientation 方位坐标
         * @returns {Object} 返回最后处理结果
         */
        _handleOrientation(ret, orientation) {
            const retWidth = ret.width,
                retHeight = ret.height;

            let drawWidth = retWidth,
                drawHeight = retHeight,
                canvasWidth = retWidth,
                canvasHeight = retHeight,
                degree = 0;

            // 根据 orientation 调整方向
            switch (orientation) {

                case 3:
                    degree = 180;
                    drawWidth = -retWidth;
                    drawHeight = -retHeight;
                    break;

                case 6:
                    degree = 90;
                    canvasWidth = retHeight;
                    canvasHeight = retWidth;
                    drawHeight = -retHeight;
                    break;

                case 8:
                    degree = 270;
                    canvasWidth = retHeight;
                    canvasHeight = retWidth;
                    drawWidth = -retWidth;
                    drawHeight = retHeight;
                    break;

                default:
            }

            return {
                degree: degree,
                canvasWidth: canvasWidth,
                canvasHeight: canvasHeight,
                drawWidth: drawWidth,
                drawHeight: drawHeight
            };
        }

        /**
         * 获取 retina 屏幕下缩放比例
         * @param {CanvasRenderingContext2D} context CanvasRenderingContext2D
         * @returns {Number} 比例
         */
        getPixelRatio(context) {
            var backingStore = context.backingStorePixelRatio ||
                context.webkitBackingStorePixelRatio ||
                context.mozBackingStorePixelRatio ||
                context.msBackingStorePixelRatio ||
                context.oBackingStorePixelRatio ||
                context.backingStorePixelRatio || 1;

            return (window.devicePixelRatio || 1) / backingStore;
        }

        /**
         * 文件对象转base64
         * @param {Object} blob 文件对象
         * @returns {Promise} promise对象
         */
        blobToBase64(blob) {
            const fileReader = new FileReader();

            fileReader.readAsDataURL(blob);

            return new Promise(function (resolve, reject) {
                fileReader.onload = function (e) {
                    resolve(e.target.result);
                };
            });
        }

        /**
         * 获取 html 元素
         * @param {any} el 元素或者元素标识
         * @returns {HTMLElement} 获取的 dom 元素
         */
        getHTMLElement(el) {
            if (typeof el === 'string' && el.nodeType !== 1) {
                return document.querySelector(el);
            }

            return el;
        }

        /**
         * 获取图片的 MIME 类型
         * @param {String} base64 图片的base64值
         * @returns {String} mime类型
         * @memberof ImageClip
         */
        getImgMIME(base64) {
            return base64.match(/data:(.*);/)[1];
        }

        /**
         * 合并方法
         * 
         * @memberof ImageClip
         */
        extend(...rest) {
            let result = rest[0];

            for (let i = 1, len = rest.length; i < len; i++) {
                const item = rest[i];

                for (const k in item) {
                    if (result[k] === undefined) {
                        result[k] = item[k];
                    }
                }
            }
        }
    }

    return EmiyaCanvas;
}));