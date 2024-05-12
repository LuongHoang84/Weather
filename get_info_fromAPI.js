


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


async function forecastWeather() {
    const ID = '1581130';
    const optionForecast = document.getElementById("weather-forecast-option").value;
    const hourlyForecastDiv = []; // Mảng lưu các phần hiển thị dự báo theo giờ
    const dailyForecastDiv = [];

    // Lấy ra các phần hiển thị của dự báo theo giờ
    for (let i = 1; i <= 4; i++) {
        hourlyForecastDiv[i] = document.getElementById(`display-hourly-forecast-${i}`);
    }

    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${ID}&appid=${API_KEY}`);
        const data = await response.json();

        if (optionForecast === "hourly") { // Nếu lựa chọn là dự báo theo giờ
            if (data) {
                // Xóa nội dung trước đó
                for (let i = 1; i <= 4; i++) {
                    hourlyForecastDiv[i].innerHTML = '';
                }

                // Lấy ngày hôm nay
                const today = new Date().toISOString().slice(0, 10);

                // Xử lý dữ liệu cho dự báo theo giờ
                data.list.forEach(function (item) {
                    const dateTime = item.dt_txt;
                    const date = dateTime.split(' ')[0];

                    // Kiểm tra nếu là ngày hôm nay
                    if (date === today) {
                        const hour = new Date(dateTime).getHours();
                        // Kiểm tra giờ có phải là 6am, 9am, 3pm, hoặc 9pm không
                        if (hour === 6 || hour === 9 || hour === 15 || hour === 21) {
                            const temperature = item.main.temp;
                            const feelsLike = item.main.feels_like;
                            weatherDescription = item.weather[0].description;
                            const mota = translateText(weatherDescription);
                            // Tạo nội dung HTML cho dự báo theo giờ
                            const hourlyForecastHTML = `
                                <div class="hourly-forecast-item">
                                    <p class="datetime">Thời Gian: ${dateTime}</p>
                                    <p class="temperature">Nhiệt Độ: ${temperature} °C</p>
                                    <p class="feelsLike">Cảm Giác: ${feelsLike} °C</p>
                                    <p class="weatherDescription">Mô Tả: ${weatherDescription}</p>
                                </div>
                            `;

                            // Thêm nội dung dự báo theo giờ vào phần hiển thị tương ứng
                            if (hour === 6) {
                                hourlyForecastDiv[1].innerHTML += hourlyForecastHTML;
                            } else if (hour === 9) {
                                hourlyForecastDiv[2].innerHTML += hourlyForecastHTML;
                            } else if (hour === 15) {
                                hourlyForecastDiv[3].innerHTML += hourlyForecastHTML;
                            } else if (hour === 21) {
                                hourlyForecastDiv[4].innerHTML += hourlyForecastHTML;
                            }
                        }
                    }
                });
            }
            // Xóa nội dung dự báo theo ngày
            dailyForecastDiv.innerHTML = '';
        } else if (optionForecast === "daily") {
            // Xóa nội dung dự báo theo giờ
            for (let i = 1; i <= 4; i++) {
              dailyForecastDiv[i] = document.getElementById(`daily-forecast-${i}`).innerHTML = '';
            }
          
            if (data) {
              // Xử lý dữ liệu cho dự báo theo ngày
              // Lấy thông tin dự báo cho 4 ngày kế tiếp
              for (let i = 0; i < 4; i++) {
                const date = data.list[i * 8].dt_txt.split(' ')[0]; // Lấy ngày cho mỗi ngày
                const temperature = data.list[i * 8].main.temp;
                const feelsLike = data.list[i * 8].main.feels_like;
                const weatherDescription = data.list[i * 8].weather[0].description;
          
                // Tạo nội dung HTML cho dự báo theo ngày
                const dailyForecastHTML = `
                  <div class="daily-forecast-item">
                    <p class="date">Ngày: ${date}</p>
                    <p class="temperature">Nhiệt Độ: ${temperature} °C</p>
                    <p class="feelsLike">Cảm Giác: ${feelsLike} °C</p>
                    <p class="weatherDescription">Mô Tả: ${weatherDescription}</p>
                  </div>
                `;
          
                // Thêm nội dung dự báo theo ngày vào phần hiển thị
                dailyForecastDiv[i] = document.getElementById(`daily-forecast-${i + 1}`);
                dailyForecastDiv[i].innerHTML += dailyForecastHTML;
              }
            }
          }
    } catch (error) {
        console.error('Lỗi trong quá trình lấy thông tin từ máy chủ.', error);
    }
}

// Gọi hàm forecastWeather() khi trang được tải
window.onload = forecastWeather;

// Gọi hàm forecastWeather() khi lựa chọn thay đổi
document.getElementById("weather-forecast-option").addEventListener("change", function() {
    forecastWeather();
});
