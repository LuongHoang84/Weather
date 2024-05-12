


const API_KEY = "123ac11073f61f60b61d1236f5d82d33";
const cityIds = {
    hanoi: "1581130",
    tokyo: "1850147",
    hochiminh: "1580578",
    backinh: "1816670"
};

async function getWeather(cityId) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${API_KEY}&units=metric`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
    }
}

async function translateText(text) {
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=vi&dt=t&q=${encodeURIComponent(text)}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0][0][0];
        } else {
            return "Không thể dịch văn bản.";
        }
    } catch (error) {
        console.error('Lỗi khi dịch văn bản:', error);
        return "Đã xảy ra lỗi khi dịch văn bản.";
    }
}

async function displayAllInfoWeather(cityId, weatherDivId){
    const weatherDiv = document.getElementById(weatherDivId);
    const weatherData = await getWeather(cityId);
    if (weatherData){
        const { name, weather, main, wind, clouds, sys } = weatherData;
        descriptionmain = weather[0].main;
        const trangthai = await translateText(descriptionmain);
        mota = weather[0].description;
        const motaVN = await translateText(mota);
        const icon = weather[0].icon;
        const nhietdohientai = main.temp || 0;
        const camgiac = main.feels_like || 0;
        const nhietdocaonhat = main.temp_max || 0;
        const nhietdothapnhat = main.temp_min || 0;
        const doam = main.humidity || 0;
        const tamnhin = weatherData.visibility || 0; // Kiểm tra xem visibility có sẵn không
        const tocdogio = wind.speed || 0;
        const huonggio = wind.deg || 0;
        const tocdogiogiat = wind.gust || 0;
        const tylemay = clouds.all || 0; // Kiểm tra xem clouds.all có sẵn không
        const binhminh = new Date(sys.sunrise * 1000); // Chuyển đổi thời gian unix thành thời gian đọc được
        const hoanghon = new Date(sys.sunset * 1000); // Chuyển đổi thời gian unix thành thời gian đọc được

        weatherDiv.innerHTML =   `<p class="all-city">Thành Phố: ${name}</p>
                                    <p class="all-main">Trạng Thái: ${trangthai}</p>
                                    <p class="all-description">Mô Tả: ${motaVN}</p>
                                    <p class="all-icon">Icon: ${icon}</p>
                                    <p class="all-temp">Nhiệt Độ: ${nhietdohientai} °C</p>
                                    <p class="all-feels_like">Cảm Giác Như: ${camgiac} °C</p>
                                    <p class="all-temp_min">Nhiệt Độ Thấp Nhất: ${nhietdothapnhat} °C</p>
                                    <p class="all-temp_max">Nhiệt Độ Cao Nhất: ${nhietdocaonhat} °C</p>
                                    <p class="all-humidity">Độ Ẩm: ${doam}%</p>
                                    <p class="all-visibility">Tầm Nhìn: ${tamnhin} Km</p>
                                    <p class="all-wind_speed">Tốc Độ Gió: ${tocdogio} m/s</p>
                                    <p class="all-wind_deg">Hướng Gió: ${huonggio} m/s</p>
                                    <p class="all-wind_gust">Cấp Gió Giật: ${tocdogiogiat} m/s</p>
                                    <p class="all-clouds">Tỷ Lệ Mây: ${tylemay}%</p>
                                    <p class="all-sunrise">Bình Minh Vào Lúc: ${binhminh.toLocaleTimeString()} AM</p>
                                    <p class="all-sunset">Hoàng Hôn Vào Lúc: ${hoanghon.toLocaleTimeString()} PM</p> `;
    }else{
        weatherDiv.innerHTML = `<p>Thất bại trong việc lấy dữ liệu từ máy chủ!</p>`
    }
}


async function displayWeather(cityId, weatherDivId) {
    const weatherDiv = document.getElementById(weatherDivId);
    const weatherData = await getWeather(cityId);
    if (weatherData) {
        const { name, main, weather, wind } = weatherData;
        temperature = main.temp;
        humidity = main.humidity;
        windSpeed = wind.speed;
        windDeg = wind.deg;
        windGust = wind.gust;
        description = weather[0].description;
        const translatedDescription = await translateText(description);
        if (windGust == null){
            windGust = "0";
        }
        weatherDiv.innerHTML = `<p class="city">Thành Phố: ${name}</p>
                                <p class="temperature">Nhiệt Độ: ${temperature} °C</p>
                                <p class="humidity">Độ Ẩm: ${humidity}%</p>
                                <p class="windSpeed">Tốc Độ Gió: ${windSpeed} m/s</p>
                                <p class="windDeg">Góc Gió: ${windDeg} °</p>
                                <p class="windGust">Lực Gió: ${windGust} m/s</p>
                                <p class="description">Mô Tả: ${translatedDescription}</p>`;
    } else {
        weatherDiv.innerHTML = '<p>Failed to fetch weather data.</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    displayWeather(cityIds.hanoi, 'weather-info-hanoi');
    displayWeather(cityIds.tokyo, 'weather-info-tokyo');
    displayWeather(cityIds.hochiminh, 'weather-info-hochiminh');
    displayWeather(cityIds.backinh, 'weather-info-backinh');
});


function showMessage(message) {
    var messageBox = document.getElementById("messageBox");
    messageBox.innerHTML = message + "<br><button id='closeBtn'>OK</button>";
    messageBox.classList.remove("hidden");
    document.getElementById("closeBtn").addEventListener("click", function() {
      messageBox.classList.add("hidden");
    });
  }

  async function getIdcity(cityname) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${cityname}&appid=${API_KEY}`);
        const data = await response.json();
        if (data.cod == '200' && data.count > 0) {
            const idCity = data.list[0].id; // Lấy id thành phố từ phần tử đầu tiên trong mảng
            return idCity;
        } else {
            throw new Error('Không tìm thấy thông tin thành phố.');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Đã xảy ra lỗi khi lấy thông tin từ API.');
    }
}


document.getElementById("search-city").addEventListener("click", async function() {
    var cityName = document.getElementById("cityInput").value;
    if (cityName.trim() !== "") {
        try {
            const CityId = await getIdcity(cityName);
            if (CityId) {
                displayAllInfoWeather(CityId, 'weather-info-search');
            } else {
                throw new Error('Không tìm thấy ID của thành phố.');
            }
        } catch (error) {
            console.error(error);
            showMessage("Không tìm thấy thông tin thành phố.");
        }
    } else {
        showMessage("Vui lòng nhập tên thành phố trước khi tìm kiếm.");
    }
});


  