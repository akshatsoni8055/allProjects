/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Shayari Script
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

const reg = ['crimson', 'red', 'blue', 'deeppink', 'pink', 'brown', 'green', 'yellow', 'orange', 'cornsilk', 'blueviolet', 'gold', 'goldenrod', 'hotpink'];
const arr = [
  "Ke bayan nhi tu lafzo me Pare he tu mere alfazo se Ki kya mayne he tere is zindagi me Kese batau tujhe meri bato se 🥰",
  "Tujhse juda hone vale har lamhe ka malal ho rha he 🙁 Tu Mera bewaqt pr behad khubsurat Khyal ho rha he 😘",
  "Meri ek muqummal talash Ka phla muqam bn rha he 😘 Teri mojudgi se har koi mere Liye aam bn ra he 💕",
  "Sehar he vo khyal ki Lahar he vo saval ki Waqt ko bhul jau jiske sath Ek lamhe me vjh he vo is nadan dil me uthe bawal ki 🥰",
  "Safr ko mil gyi ho jese manzil aisi lgti he tumhari mulaqat 😍😍.. Zuban pr nhi to kya Hua khyal to tumhare hi hote he chahe din ho ya Rat 💫",
  "Teri har bat ❤️ Tera vo sath 💞 Tere sath vo muskurana😘 Mere har gam ko bhulkr tujhme kho jana Us ehsas me he tu 🤗 Meri pareshaniyo me kuch waqt ke sukoon me 😉 Meri har taklif se lekr uske get will soon me he tu.. 😜",
  "दो पल आकर मेरे संग बिताना तुम हो सके तो  ठहर जाना तुम💓",
  "Tum ek suhani subha Or ek hasi sham ho 🌇 Tumhare bina sochu to lgta he Jese ye zindagi bilkul aam ho 😐",
  "Agr mumkin ho to byan krna chahungi me apne vo sare khwab jo tumse jude he Ki na jane kitni bar tere nzr aane se Mere Apne kitne raste teri trf mode he 💞",
  "Rahat he tu MERI pareshaniyo me Muqmmal dastan he tu MERI khaniyo me Tere rang me aise ghuli hu me Jesse tu he isliye to khud se Mili hu me Is kadar tera suroor Savar he Ki ab Dil ke har kone me tere ishq ki bahar he  ♥️",
  "Ho tum ek adhuri 💌 khwahish Jiski har waqt hoti hai is nadan se dil❤️ko farmaish😄 Ek ankahi dasta ho jo hoti nahi baya 😅 In nadaniyo ki ked se nahi hona chahta koi riha😘😘",
  "Dil na smbhle jise dekh kr ek esa anokha fasana he Ha vohi he jiska dil brso se deewana he Mere har aarzoo ka muqummal Tarana he Ruth jau agr duniya se to meri muskurahat ka man psand thikana he vo 💖"
];


$("#next").click(function () {
  $("#bg").slideToggle("slow", function () {
    document.getElementById("shayri").innerHTML = arr[Math.floor((Math.random() * 11) + 1)];
    document.getElementById("bg").style.backgroundColor = reg[Math.floor((Math.random() * 12) + 1)];
  });
  $("#bg").slideToggle("slow", function () {
  });
});

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Roman Script
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/

$('#decimal').keyup(() => {
  let num = document.getElementById('decimal').value.trim()
  let R = document.getElementById('roman')

  if (num == "") {
    R.value = ""
    return
  }
  if (num > 3999 || num < 1) {
    R.value = "Range Error"
  }
  let roman = '';
  let dec = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
  let rom = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
  if (num < 1 || num > 3999) {
    return "Enter a number between 1 & 3999";
  }
  for (let i = 0; i < dec.length; i++) {
    while (num >= dec[i]) {
      num -= dec[i];
      roman += rom[i];
    }
  }
  R.value = roman
})


$('#roman').keyup(() => {
  let s = document.getElementById('roman').value.trim().toUpperCase()
  let D = document.getElementById('decimal')

  if (s == "") {
    D.value = ""
    return
  }

  const legend = "IVXLCDM";
  const l = [1, 5, 10, 50, 100, 500, 1000];
  let sum = 0;
  while (s) {
    if (!!s[1] && legend.indexOf(s[0]) < legend.indexOf(s[1])) {
      sum += (l[legend.indexOf(s[1])] - l[legend.indexOf(s[0])]);
      s = s.substring(2, s.length);
    } else {
      sum += l[legend.indexOf(s[0])];
      s = s.substring(1, s.length);
    }
  }

  if (sum > 0 && sum < 4000) {
    D.value = sum
    return
  }
  D.value = "Range Error"
})

/*@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
Weather Script
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@*/
$(document).ready(()=> {
  widget(1267031, getWidId())
})

function getWidId() {
  if (window.outerWidth > 480) {
    return 11
  } else {
    return 15
  }
}

function widget(id, wid) {
  document.getElementById('widget').innerHTML = `<div id="openweathermap-widget-${wid}" style="position : absolute; left : 50%; bottom:50%; transform: translate(-50%, 50%); "> </div>`
  window.myWidgetParam = [];
  window.myWidgetParam.push({
    id: wid,
    cityid: `${id}`,
    appid: 'f3745668dccd1ede7b219e4260a7e6bc',
    units: 'metric',
    containerid: `openweathermap-widget-${wid}`
  });
  (function () {
    var script = document.createElement('script');
    script.async = true;
    script.charset = "utf-8";
    script.src = "https://openweathermap.org/themes/openweathermap/assets/vendor/owm/js/weather-widget-generator.js";
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(script, s);
  })();
}
function city() {
  let city = document.getElementById('city').value
  city = city.trim()

  if (city == "") return

  fetch(`/weather?city=${city}`).then(res => res.json()).then(data => {
    display(data)
    widget(data.id, getWidId())
  })
}
function zip() {
  let zip = document.getElementById('zip').value

  zip = zip.trim()

  if (zip == "") return

  fetch(`/weather?zip=${zip}`).then(res => res.json()).then(data => {
    display(data)
    widget(data.id, getWidId())
  })
}


function locate() {

  navigator.geolocation.getCurrentPosition((position) => {
    let lat = position.coords.latitude
    let lon = position.coords.longitude

    fetch(`/weather?lat=${lat}&lon=${lon}`).then(res => res.json()).then(data => {
      display(data)
      widget(data.id, getWidId())
    })
  })

}

function display(data) {
  if (data.cod == 404) {
    document.getElementById('data').innerHTML = '<h1 style="text-align:center;">Error 404, City Not Found</h1>'
    return
  }
  let html = `<img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
  <h4>Weather : <span>${data.weather[0].description.toUpperCase()}</span></h4>
  <h5>Location : <span>${data.name}, ${data.sys.country.toUpperCase()}</span></h5>
  <h6>Now : <span>${timeManipulator(data.dt)}</span></h6>
  <h6>Sunrise : <span>${timeManipulator(data.sys.sunrise)}</span></h6>
  <h6>Sunset : <span>${timeManipulator(data.sys.sunset)}</span></h6>
  <h6>Temperature : <span>${(data.main.temp - 273.15).toFixed(2)} &#8451;</span></h6>
  <h6>Real-Feels : <span>${(data.main.feels_like - 273.15).toFixed(2)} &#8451;</span></h6>
  <h6>Air Pressure : <span>${data.main.pressure} hPa</span></h6>
  <h6>Wind Speed : <span>${data.wind.speed}Km/h</span></h6>
  <h6>Wind Direction : <span>${windDir(data.wind.deg)}, ${data.wind.deg}&#176;</span></h6>
  <h6>Humidity : <span>${data.main.humidity}</span></h6>
  <h6>Clouds : <span>${data.clouds.all}</span></h6>
  <h6>Visibility : <span>${data.visibility} m</span></h6>`
  document.getElementById('data').innerHTML = html
}

function timeManipulator(dt) {
  let now = new Date()
  now.setTime(dt * 1000)
  return now
}
function windDir(deg) {

  if ((deg >= 0 && deg <= 22) || (deg <= 360 && deg >= 338))
    return "N"
  if (deg >= 293 && deg <= 337)
    return "NW"
  if (deg >= 248 && deg <= 292)
    return "W"
  if (deg >= 203 && deg <= 247)
    return "SW"
  if (deg >= 158 && deg <= 202)
    return "S"
  if (deg >= 113 && deg <= 157)
    return "SE"
  if (deg >= 68 && deg <= 112)
    return "E"
  if (deg >= 23 && deg <= 67)
    return "NE"
}

function insert(val) {
  document.getElementById('tf').value = document.getElementById('tf').value + val;
}
function cut() {
  var str = document.getElementById('tf').value;
  document.getElementById('tf').value = str.substring(0, str.length - 1);
}
function send() {
  let num = document.getElementById('whatsapp').value;
  let href = "https://api.whatsapp.com/send?phone=+91" + num;
  document.getElementById('send').href = href;
}