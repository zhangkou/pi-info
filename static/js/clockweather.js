var city='121.60,31.20'
var key='bc67c52318fa452cac8240b46f8aed81'

$(function() {
    // clock
    let clock = setInterval(setTime, 1000);
    //let data = setInterval(setData, 1000 * 60 * 10);
    setInterval(setAQI, 1000 * 60 * 10);
    setInterval(setNow, 1000 * 60 * 10);
    let $time = $('#time');
    let $date = $('#date');
    let $cnDate = $('#cnDate');

    function setTime() {
        moment.locale('zh-cn');
        var cn_date = calendar.solar2lunar();
        $time.html(moment().format('H:mm:ss'));
        $date.html(moment().format('LL dddd'));
        cnDateText = cn_date.IMonthCn + cn_date.IDayCn
        // 判断是否节气
        if (cn_date.isTerm) {
            cnDateText = cnDateText + cn_date.Term;
        }
        $cnDate.html("农历 " + cnDateText)
    }
    jg = new JustGage({
        id: "jg1",
        value: 72,
        label: '湿度',
        labelFontColor: "white",
        min: 0,
        max: 100,
        pointer: true,
        pointerOptions: {
            toplength: 8,
            bottomlength: -20,
            bottomwidth: 6,
            color: '#8e8e93'
        },
        gaugeWidthScale: 0.5,
        hideMinMax: true,
        valueFontColor: "white",
        valueMinFontSize: 24,
        customSectors: [{
            color: "#00ff00",
            lo: 0,
            hi: 30
        }, {
            color: "#ffcc00",
            lo: 30,
            hi: 60
        }, {
            color: "#ff8a00",
            lo: 60,
            hi: 90
        }, {
            color: "#f70000",
            lo: 90,
            hi: 100
        }],
        counter: false
    });

    //setData();
    setNow();
    setAQI();
});

function setData() {
    var url = "https://devapi.qweather.com/v7/weather/3d?location=" + city + "&key=" + key;
    $.getJSON(url, function(data) {
        console.log(data);
        // 天气动画
        var result = data.HeWeather6[0];

        // city: "苏州",
        $("#city").text(result.basic.city);

        // 天气动画
        var code = result.now.cond_code;
        var myDate = new Date();
        var currentHour = myDate.getHours();
        var daylight = true;
        if (currentHour > 17 || currentHour < 6) {
            daylight = false;
        } else {
            daylight = true;
        }
        var animation = "sunny"
        if (code == 100) {
            if (daylight) {
                animation = "sunny";
            } else {
                animation = "starry";
            }
        } else if (code >= 101 && code <= 104) {
            animation = "cloudy"
        } else if (code >= 300 && code <= 313) {
            if (code >= 310 && code <= 312) {
                animation = "stormy"
            } else {
                animation = "rainy"
            }
        } else if (code >= 400 && code <= 407) {
            animation = "snowy"
        }
        $("#weather_icon").attr("class", animation);

        // 当前
        var now = result.now;
        $("#temperature-now").text(now.tmp);
        $("#temperature-now").append("<sup><small>°C</small> </sup>");

        var icon_link_head = '<img src="./static/img/';
        var icon_link_tail = '.png" height="70" width="70"</img>';
        var forecast = result.daily_forecast;
        for (var i = 0; i < 3; ++i) {
            if (forecast[i].cond_txt_d != forecast[i].cond_txt_n) {
                txt = forecast[i].cond_txt_d + "转" + forecast[i].cond_txt_n;
                icon = icon_link_head + forecast[i].cond_code_d + icon_link_tail;
                var icon_code_night = forecast[i].cond_code_n;
                if (icon_code_night == 100 || icon_code_night == 103) {
                    icon_code_night = icon_code_night + "_night";
                }
                icon += icon_link_head + icon_code_night + icon_link_tail;
            } else {
                txt = forecast[i].cond_txt_d;
                icon = icon_link_head + forecast[i].cond_code_d + icon_link_tail;
            }
            $(".weather" + i).text(txt);
            $(".temp" + i).text(forecast[i].tmp_min + "℃ / " + forecast[i].tmp_max + "℃");
            //"wind": "东风3-4级", TODO 也可能是“东北风微风”，不应该加“级”
            $(".wind" + i).text(forecast[i].wind_dir + forecast[i].wind_sc + "级");
            $("#icon" + i).html(icon);
        }
    });

}

function setNow(){
    var url = "https://devapi.qweather.com/v7/weather/now?location=" + city + "&key=" + key;
    $.getJSON(url, function(data) {
        // 天气动画
        var code = data.now.icon;
        var myDate = new Date();
        var currentHour = myDate.getHours();
        var daylight = true;
        if (currentHour > 17 || currentHour < 6) {
            daylight = false;
        } else {
            daylight = true;
        }
        var animation = "sunny"
        if (code == 100) {
            if (daylight) {
                animation = "sunny";
            } else {
                animation = "starry";
            }
        } else if (code >= 101 && code <= 104) {
            animation = "cloudy"
        } else if (code >= 300 && code <= 313) {
            if (code >= 310 && code <= 312) {
                animation = "stormy"
            } else {
                animation = "rainy"
            }
        } else if (code >= 400 && code <= 407) {
            animation = "snowy"
        }
        $("#weather_icon").attr("class", animation);

        // 当前
        var now = data.now;
        $("#temperature-now").text(now.temp);
        $("#temperature-now").append("<sup><small>°C</small> </sup> ");

        // 湿度
        jg.refresh(now.humidity);

        // 天气描述
        //$('#weather-text').text(now.text)
    });
}

function setAQI() {
    var url = "https://devapi.qweather.com/v7/air/now?location=" + city + "&key=" + key;
    $.getJSON(url, function(data) {
        console.log(data);
        var now = data.now;
        if(now) {
            var aqiColor = 'green';
            var nAQI = Number(now.aqi);
            if(nAQI < 50) {
                aqiColor = 'green';
            }else if(nAQI >= 50 && nAQI < 100) {
                aqiColor = 'yellow';
            }else if(nAQI >= 100 && nAQI < 200) {
                aqiColor = 'orange';
            }else if(nAQI >= 200 && nAQI < 300) {
                aqiColor = 'purple';
            }else if(nAQI >= 300){
                aqiColor = 'black';
            }

            $("#category").text("空气质量 ")
            $("#category").append('<strong style="color: ' + aqiColor+ ';">' + now.category + '</strong>');

            $("#aqi").text(now.aqi).css('color', aqiColor);

            $("#pm25").text(now.pm2p5);

            $("#pm10").text(now.pm10);

            $("#no2").text(now.no2);

            $("#so2").text(now.so2);

            $("#co").text(now.co);

            $("#o3").text(now.o3);
        }
    });
}
