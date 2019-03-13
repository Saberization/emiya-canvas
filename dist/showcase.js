'use strict';

(function (global) {
    'use strict';

    var uploadEl = document.getElementById('upload');
    var previewEl = document.getElementById('preview');

    // 修复过后的 canvas 元素
    var correctedEl = document.getElementById('corrected');

    // 未经过修复的 canvas 元素
    var uncorrectedEl = document.getElementById('uncorrected'),
        uncorrectedCtx = uncorrectedEl.getContext('2d');

    var emiya = new global.EmiyaCanvas();

    document.getElementById('selectbtn').addEventListener('click', function () {
        uploadEl.click();
    });

    document.getElementById('reload').addEventListener('click', function () {
        window.location.reload();
    });

    uploadEl.addEventListener('change', function () {
        var file = this.files[0];

        // 未经过处理绘图
        unrepair(file);

        // 设置文件
        emiya.setFile(file);

        // 渲染画布
        emiya.render(correctedEl, {
            width: window.screen.width,
            quality: .8
        }, function (response) {
            console.log(response);
        });
    });

    /**
     * 未经过处理绘图
     * 与处理过后的图片做个对比看下效果
     * @param {Object} file 文件对象
     */
    function unrepair(file) {
        var fileReader = new FileReader();

        fileReader.readAsDataURL(file);
        fileReader.onload = function (e) {
            var img = new Image();

            img.src = e.target.result;
            previewEl.src = e.target.result;
            img.onload = function () {
                var imgWidth = img.width,
                    imgHeight = img.height;

                var canvasWidth = imgWidth,
                    canvasHeight = imgHeight;

                if (imgWidth > window.screen.width || imgHeight > window.screen.height) {
                    if (imgWidth > window.screen.width) {
                        canvasWidth = window.screen.width;
                        canvasHeight = canvasWidth * imgHeight / imgWidth;
                    } else if (imgHeight > window.screen.height) {
                        canvasHeight = window.screen.height;
                        canvasWidth = imgWidth * canvasHeight / imgHeight;
                    }
                }

                uncorrectedEl.width = canvasWidth;
                uncorrectedEl.height = canvasHeight;
                uncorrectedEl.style.cssText = 'width: ' + canvasWidth + 'px; height: ' + canvasHeight + 'px';

                uncorrectedCtx.drawImage(this, 0, 0, canvasWidth, canvasHeight);
            };
        };
    }
})(window);