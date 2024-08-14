function audio() {
    var audio2 = new Audio("알람음 1.mp3");
    var temp = localStorage.getItem("audio");
    console.log("알람음은"+temp);
    if(temp==1){
        console.log("1");
        audio2.src="알람음 1.mp3";
    }else if(temp==2){
        console.log("2");
        var audio2 = new Audio("알람음 2.mp3");
    }else if(temp==3){
        console.log("3");
        audio2.src="알람음 3.mp3";
    }else if(temp==4){
        console.log("4");
        audio2.src="알람음 4.mp3";
    }

    console.log(audio2);
    audio2.loop = false; // 반복재생하지 않음
    audio2.volume = 0.5; // 음량 설정

    audio2.play(); // sound2.mp3 재생
   
    // setTimeout(function () { // 1초 후 sound2.mp3 일시정지
    //     console.log("puase전")
    //     //audio2.pause();
    //     console.log("puase후")
    // }, 1000);
    audioComplete = true;
}

//검색버튼 클릭시
function RunProgram() {
    handleButton();
    searchNow();
    ShinHeeYoun();
}
// 기록부분으로 갈 것들
var totalTime = 0;
var totalRing = 0;
function plusTime(num) {
    totalTime += num;
}
function plusRing()  {
    totalRing++;
}


//export {totalRing, totalTime};

// 거리 계산 변수(시작점과 목적지 거리 검색)
var la1, lo1, la2, lo2, dist;
var count = 0;
var timer = 3000;
var target = document.getElementById("fruit");
//var goDist = target.options[target.selectedIndex].value;
//거리 계산 세부 부분
function ShinHeeYoun() {
    
    if (target.options[target.selectedIndex].value < 0) { 
        alert("알람 거리 설정 필요");
        return -1;
    } else {
        //alert(target.options[target.selectedIndex].value+"m로 알람 거리 설정됨");
    }
    
    /*
    if (la2 === undefined) {
        alert("목적지가 저장되지 않았습니다");
        return -1;
    }
    */
    searchNow();
    dist = getDistance(la1, lo1, la2, lo2);
    //alert("현재위치: " + la1 + "/" + lo1 + "와 목적지 위치: " + la2 + "/" + lo2 + "간의 거리 = " + dist + "m가 남았습니다");
    document.getElementById("place1").innerHTML = "위치 정보 받아오는 중";
    Alert = setInterval(function () {
        searchNow();
        audio();
        dist = getDistance(la1, lo1, la2, lo2);
        if (dist < target.options[target.selectedIndex].value && audioComplete==true) {
            clearInterval(Alert);
            alert("목적지까지 "+ dist +"m 남았습니다. 알람을 울립니다.(설정된 알람 범위:"+target.options[target.selectedIndex].value+"m)")
    
            localStorage.setItem("distance",dist);
            plusRing();
            plusTime(count);
            localStorage.setItem("ring",totalRing);
            return -1;
        }
        count=count+(timer/1000);
        document.getElementById("place1").innerHTML = dist + "m / " + count + "초";
        localStorage.setItem("distance",dist);
        //alert(count+"번째 - 현재위치: " + la1 + "/" + lo1 + "와 목적지 위치: " + la2 + "/" + lo2 + "간의 거리 = " + dist + "m입니다");
    }, timer);
}
function getDistance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2))
        return 0;

    var radLat1 = Math.PI * lat1 / 180;
    var radLat2 = Math.PI * lat2 / 180;
    var theta = lon1 - lon2;
    var radTheta = Math.PI * theta / 180;
    var dist = Math.sin(radLat1) * Math.sin(radLat2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta);
    if (dist > 1) dist = 1;

    dist = Math.acos(dist);
    dist = dist * 180 / Math.PI;
    dist = dist * 60 * 1.1515 * 1.609344 * 1000;
    if (dist < 100) dist = Math.round(dist / 10) * 10;
    else dist = Math.round(dist / 100) * 100;

    return dist;
}


//여기까지 내가 고침

function handleButton(){
    const input = document.querySelector(".End input");
    var inputvalue = document.getElementById("keyword").value;
    alert(inputvalue);
    searchAddress(inputvalue);
    return searchAddress(inputvalue);
}

function handleNow(){
    return searchNow();
}

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
mapOption = {
    center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
    level: 3 // 지도의 확대 레벨
};

// 지도를 생성합니다    
var map = new kakao.maps.Map(mapContainer, mapOption); 
function searchNow(){
    if (navigator.geolocation) {

    // GeoLocation을 이용해서 접속 위치를 얻어옵니다
    
    navigator.geolocation.getCurrentPosition(function(position) {
        var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도
        var locPosition = new kakao.maps.LatLng(lat, lon), // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
            message = '<div style="padding:5px;">여기에 계신가요?!</div>'; // 인포윈도우에 표시될 내용입니다
        
        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition, message);
        console.log(lat,lon);
        la1 = lat;
        lo1 = lon;
    });
    
  } else { // HTML5의 GeoLocation을 사용할 수 없을때 마커 표시 위치와 인포윈도우 내용을 설정합니다
    
    var locPosition = new kakao.maps.LatLng(33.450701, 126.570667),    
        message = 'geolocation을 사용할수 없어요..'
        
    displayMarker(locPosition, message);
}

// 지도에 마커와 인포윈도우를 표시하는 함수입니다
function displayMarker(locPosition, message) {

// 마커를 생성합니다
var marker = new kakao.maps.Marker({  
    map: map, 
    position: locPosition
}); 

var iwContent = message, // 인포윈도우에 표시할 내용
    iwRemoveable = true;

// 인포윈도우를 생성합니다
var infowindow = new kakao.maps.InfoWindow({
    content : iwContent,
    removable : iwRemoveable
});

// 인포윈도우를 마커위에 표시합니다 
infowindow.open(map, marker);

// 지도 중심좌표를 접속위치로 변경합니다
map.setCenter(locPosition);      
}
}
// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

function searchAddress(inputAddress){
    geocoder.addressSearch(`${inputAddress}`, function(result, status) {

// 정상적으로 검색이 완료됐으면 
if (status === kakao.maps.services.Status.OK) {

    var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        var message =  + result[0].y;
        message += result[0].x;
        la2 = result[0].y;
        lo2 = result[0].x;
        var resultDiv = document.getElementById('clickLatlng'); 
        console.log(message);

    // 결과값으로 받은 위치를 마커로 표시합니다
    var marker = new kakao.maps.Marker({
        map: map,
        position: coords
    });

    // 인포윈도우로 장소에 대한 설명을 표시합니다
    var infowindow = new kakao.maps.InfoWindow({
        content:''
    });
    infowindow.open(map);

    // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
    map.setCenter(coords);
} 
});    
}


    window.onload = function() {
 
    function onClick() {
        document.querySelector('.modal_wrap').style.display ='block';
        document.querySelector('.black_bg').style.display ='block';
    }   
    function offClick() {
        document.querySelector('.modal_wrap').style.display ='none';
        document.querySelector('.black_bg').style.display ='none';
    }
 
    document.getElementById('modal_btn').addEventListener('click', onClick);
    document.querySelector('.modal_close').addEventListener('click', offClick);
 
};








