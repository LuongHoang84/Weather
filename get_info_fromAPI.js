// Khai báo khóa API để truy cập dữ liệu thời tiết từ OpenWeatherMap
const API_KEY = "123ac11073f61f60b61d1236f5d82d33";

// Định nghĩa các ID của thành phố để lấy dữ liệu thời tiết
const cityIds = {
    hanoi: "1581130",
    tokyo: "1850147",
    hochiminh: "1580578",
    backinh: "1816670"
};

// Hàm để lấy dữ liệu thời tiết từ OpenWeatherMap dựa trên ID của thành phố
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

// Hàm dịch văn bản sang tiếng Việt
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

// Hàm hiển thị tất cả thông tin về thời tiết của một thành phố
async function displayAllInfoWeather(cityId, weatherDivId) {
    const weatherDiv = document.getElementById(weatherDivId);
    const weatherData = await getWeather(cityId);
    if (weatherData) {
        const { name, weather, main, wind, clouds, sys } = weatherData;
        const descriptionMain = weather[0].main;
        const trangthai = await translateText(descriptionMain);
        const mota = weather[0].description;
        const motaVN = await translateText(mota);
        const icon = weather[0].icon;
        const nhietdohientai = main.temp || 0;
        const camgiac = main.feels_like || 0;
        const nhietdocaonhat = main.temp_max || 0;
        const nhietdothapnhat = main.temp_min || 0;
        const doam = main.humidity || 0;
        const tamnhin = weatherData.visibility || 0;
        const tocdogio = wind.speed || 0;
        const huonggio = wind.deg || 0;
        const tocdogiogiat = wind.gust || 0;
        const tylemay = clouds.all || 0;
        const binhminh = new Date(sys.sunrise * 1000).toLocaleTimeString(); 
        const hoanghon = new Date(sys.sunset * 1000).toLocaleTimeString(); 

        weatherDiv.innerHTML =   `<p class="all-city">Thành Phố: ${name}</p>
                                    <p class="all-main">Trạng Thái: ${trangthai}</p>
                                    <p class="all-description">Mô Tả: ${motaVN}</p>
                                    <p class="all-icon">Icon: ${icon}</p>
                                    <p class="all-temp">Nhiệt Độ: ${nhietdohientai} °C</p>
                                    <p class="all-feelsLike">Cảm Giác Như: ${camgiac} °C</p>
                                    <p class="all-tempMin">Nhiệt Độ Thấp Nhất: ${nhietdothapnhat} °C</p>
                                    <p class="all-tempMax">Nhiệt Độ Cao Nhất: ${nhietdocaonhat} °C</p>
                                    <p class="all-humidity">Độ Ẩm: ${doam}%</p>
                                    <p class="all-visibility">Tầm Nhìn: ${tamnhin} Km</p>
                                    <p class="all-windSpeed">Tốc Độ Gió: ${tocdogio} m/s</p>
                                    <p class="all-windDeg">Hướng Gió: ${huonggio} m/s</p>
                                    <p class="all-windGust">Cấp Gió Giật: ${tocdogiogiat} m/s</p>
                                    <p class="all-clouds">Tỷ Lệ Mây: ${tylemay}%</p>
                                    <p class="all-sunrise">Bình Minh Vào Lúc: ${binhminh} AM</p>
                                    <p class="all-sunset">Hoàng Hôn Vào Lúc: ${hoanghon} PM</p> `;
    } else {
        weatherDiv.innerHTML = `<p>Thất bại trong việc lấy dữ liệu từ máy chủ!</p>`;
    }
}

// Hàm hiển thị thông tin cơ bản về thời tiết của một thành phố
async function displayWeather(cityId, weatherDivId) {
    const weatherDiv = document.getElementById(weatherDivId);
    const weatherData = await getWeather(cityId);
    if (weatherData) {
        const { name, main, weather, wind } = weatherData;
        const temperature = main.temp;
        const humidity = main.humidity;
        const windSpeed = wind.speed;
        const windDeg = wind.deg;
        let windGust = wind.gust;
        const description = weather[0].description;
        const translatedDescription = await translateText(description);
        
        // Kiểm tra giá trị của gió giật
        if (windGust === undefined || windGust === null) {
            windGust = 0;
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

// Hàm hiển thị thông tin thời tiết cho các thành phố được chỉ định khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    displayWeather(cityIds.hanoi, 'weather-info-hanoi');
    displayWeather(cityIds.tokyo, 'weather-info-tokyo');
    displayWeather(cityIds.hochiminh, 'weather-info-hochiminh');
    displayWeather(cityIds.backinh, 'weather-info-backinh');
});

// Hàm hiển thị thông báo
function showMessage(message) {
    const messageBox = document.getElementById("messageBox");
    messageBox.innerHTML = `${message}<br><button id='closeBtn'>OK</button>`;
    messageBox.classList.remove("hidden");
    document.getElementById("closeBtn").addEventListener("click", function() {
        messageBox.classList.add("hidden");
    });
}

// Hàm lấy ID của thành phố từ tên thành phố
async function getIdcity(cityName) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${cityName}&appid=${API_KEY}`);
        const data = await response.json();
        if (data.cod === '200' && data.count > 0) {
            const idCity = data.list[0].id;
            return idCity;
        } else {
            throw new Error('Không tìm thấy thông tin thành phố.');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Đã xảy ra lỗi khi lấy thông tin từ API.');
    }
}
var ID = "";
// Lắng nghe sự kiện click để tìm kiếm thông tin thời tiết của một thành phố
document.getElementById("search-city").addEventListener("click", async function() {
    const hourlyForecastDiv = []; 
    const dailyForecastDiv = []; 

    for (let i = 1; i <= 4; i++) {
        hourlyForecastDiv[i] = document.getElementById(`display-hourly-forecast-${i}`);
        dailyForecastDiv[i] = document.getElementById(`display-daily-forecast-${i}`);
    }
    cityName = document.getElementById("cityInput").value;
    if (cityName.trim() !== "") {
        try {
            const cityId = await getIdcity(cityName);
            if (cityId) {
                ID = cityId;
                displayAllInfoWeather(cityId, 'weather-info-search');
                for (let i = 1; i <= 4; i++) {
                    dailyForecastDiv[i].innerHTML = '';
                    hourlyForecastDiv[i].innerHTML = '';
                }
                forecastWeather();
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

// Hàm để lọc dữ liệu thời tiết cho 4 ngày từ một mảng dữ liệu JSON
function filterFourDaysData(data) {
    const result = [];
    const days = new Set(); 
    let count = 0; 

    data.forEach(item => {
        const date = new Date(item.dt_txt.split(' ')[0]);
        if (!days.has(date.toDateString())) {
            days.add(date.toDateString());
            result.push(item);
            count++;
            if (count === 4) {
                return result;
            }
        }
    });

    return result;
}

// Hàm để lấy dữ liệu thời tiết theo lựa chọn (theo giờ hoặc theo ngày)
async function forecastWeather() {
    // const ID = '1581130'; //HN
    const optionForecast = document.getElementById("weather-forecast-option").value;
    const hourlyForecastDiv = []; 
    const dailyForecastDiv = []; 

    for (let i = 1; i <= 4; i++) {
        hourlyForecastDiv[i] = document.getElementById(`display-hourly-forecast-${i}`);
        dailyForecastDiv[i] = document.getElementById(`display-daily-forecast-${i}`);
    }

    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/forecast?id=${ID}&appid=${API_KEY}`);
        const data = await response.json();

        if (optionForecast === "hourly") {
            if (data) {
                for (let i = 1; i <= 4; i++) {
                    dailyForecastDiv[i].innerHTML = '';
                }
        
                const firstFourHoursData = data.list.slice(0, 4);
        
                for (let index = 0; index < firstFourHoursData.length; index++) {
                    const item = firstFourHoursData[index];
                    const dateTime = item.dt_txt;
                    const temperature = (item.main.temp - 273.15).toFixed(2) || 0; 
                    const feelsLike = (item.main.feels_like - 273.15).toFixed(2) || 0; 
                    const cloud = item.clouds.all || 0;
                    const weatherDescription = item.weather[0].description;
            
                    // Dùng await để đợi cho hàm translateText trả về kết quả trước khi gán giá trị
                    const descriptionVN = await translateText(weatherDescription);
            
                    const hourlyForecastHTML = `
                        <div class="hourly-forecast-item">
                            <p class="datetime">Thời Gian: ${dateTime.split(' ')[1]}</p>
                            <p class="temperature">Nhiệt Độ: ${temperature} °C</p>
                            <p class="feelsLike">Cảm Giác: ${feelsLike} °C</p>
                            <p class="all-clouds">Tỷ Lệ Mây: ${cloud}%</p>
                            <p class="weatherDescription">Mô Tả: ${descriptionVN}</p>
                        </div>
                    `;
                    hourlyForecastDiv[index + 1].innerHTML += hourlyForecastHTML;
                }
            }
            dailyForecastDiv.innerHTML = '';
        } else if (optionForecast === "daily") {
            for (let i = 1; i <= 4; i++) {
                hourlyForecastDiv[i].innerHTML = '';
            }
        
            if (data) {
                const filteredData = filterFourDaysData(data.list);
                let displayedDays = 0;
        
                for (let index = 0; index < filteredData.length; index++) {
                    const item = filteredData[index];
                    const dateTime = item.dt_txt;
                    const temperature = (item.main.temp - 273.15).toFixed(2) || 0; 
                    const feelsLike = (item.main.feels_like - 273.15).toFixed(2) || 0;
                    const cloud = item.clouds.all || 0;
                    const weatherDescription = item.weather[0].description;
            
                    // Dùng await để đợi cho hàm translateText trả về kết quả trước khi gán giá trị
                    const descriptionVN = await translateText(weatherDescription);
            
                    const dailyForecastHTML = `
                        <div class="daily-forecast-item">
                            <p class="datetime">Ngày: ${dateTime.split(' ')[0]}</p>
                            <p class="temperature">Nhiệt Độ: ${temperature} °C</p>
                            <p class="feelsLike">Cảm Giác: ${feelsLike} °C</p>
                            <p class="all-clouds">Tỷ Lệ Mây: ${cloud}%</p>
                            <p class="weatherDescription">Mô Tả: ${descriptionVN}</p>
                        </div>
                    `;
                    if (displayedDays < 4) {
                        dailyForecastDiv[displayedDays + 1].innerHTML += dailyForecastHTML;
                        displayedDays++;
                    }
                }
            }
            hourlyForecastDiv.innerHTML = '';
        }
    } catch (error) {
        console.error('Lỗi trong quá trình lấy thông tin từ máy chủ.', error);
    }
}

window.onload = forecastWeather;

document.getElementById("weather-forecast-option").addEventListener("change", function() {
    forecastWeather();
});
