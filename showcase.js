const uploadEl = document.getElementById('upload');

// 修复过后的 canvas 元素
const correctedEl = document.getElementById('corrected');

// 未经过修复的 canvas 元素
const uncorrectedEl = document.getElementById('uncorrected'),
    uncorrectedCtx = uncorrectedEl.getContext('2d');

const emiya = new EmiyaCanvas();

document.getElementById('selectbtn').addEventListener('click', function () {
    uploadEl.click();
});

uploadEl.addEventListener('change', function () {
    const file = this.files[0];

    // 未经过处理绘图
    unrepair(file);

    // 设置文件
    emiya.setFile(file);

    // 渲染画布
    emiya.render(correctedEl, {
        width: 300,
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
    let fileReader = new FileReader();

    fileReader.readAsDataURL(file);
    fileReader.onload = function (e) {
        const img = new Image();

        img.src = e.target.result;
        img.onload = function () {
            const imgWidth = img.width,
                imgHeight = img.height;

            let canvasWidth = imgWidth,
                canvasHeight = imgHeight;

            if (imgWidth > 300 || imgHeight > window.screen.height) {
                if (imgWidth > 300) {
                    canvasWidth = 300;
                    canvasHeight = canvasWidth * imgHeight / imgWidth;
                } else if (imgHeight > window.screen.height) {
                    canvasHeight = window.screen.height;
                    canvasWidth = imgWidth * canvasHeight / imgHeight;
                }
            }

            uncorrectedEl.width = canvasWidth;
            uncorrectedEl.height = canvasHeight;
            uncorrectedEl.style.cssText = 'width: ' + canvasWidth + 'px; height: ' + canvasHeight +
                'px';

            uncorrectedCtx.drawImage(this, 0, 0, canvasWidth, canvasHeight);
        };
    };
}