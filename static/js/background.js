$(function() {
    setInterval(chage_background_image, 1000 * 60 * 2);
    //chage_background_image();
});

function chage_background_image() {
    var bgImgs = [
        "1.jpeg","2.jpeg",'3.jpeg',
        "4.jpeg","5.jpeg",'6.jpeg',
        "7.jpeg","8.jpeg",'9.jpeg',
        "10.jpeg","11.jpeg",'12.jpeg',
        "13.jpeg","14.jpeg",'15.jpeg',
    ];
    var bgImgIndex = Math.floor(Math.random() * bgImgs.length);
    var bgImg = bgImgs[bgImgIndex];
    // 获取元素
    var body = $('body');

    // 随机获取新的背景图片
    var oldUrl = body.css('background-image');
    var newUrl = oldUrl.replace(/\/(\d+)\.jpeg/, '/' + bgImg);

    // 更新CSS样式中的属性值
    body.css('background-image', newUrl); 
}