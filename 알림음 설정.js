function btn1() {
    var audio2 = new Audio("알람음 1.mp3");
    audio2.loop = true; // 반복재생하지 않음
    audio2.volume = 0.5; // 음량 설정
    audio2.play(); // sound2.mp3 재생
    alert("알람음이 변경 되었습니다.")
    setTimeout(function () { // 1초 후 sound2.mp3 일시정지
        audio2.pause();
    }, 1000);
}
document.querySelector(".btn1").addEventListener("click",btn1);

function btn2() {
    var audio2 = new Audio("알람음 2.mp3");
    audio2.loop = true; // 반복재생하지 않음
    audio2.volume = 0.5; // 음량 설정
    audio2.play(); // sound2.mp3 재생
    alert("알람음이 변경 되었습니다.")
    setTimeout(function () { // 1초 후 sound2.mp3 일시정지
        audio2.pause();
    }, 1000);
}
document.querySelector(".btn2").addEventListener("click",btn2);

function btn3() {
    var audio2 = new Audio("알람음 3.mp3");
    audio2.loop = true; // 반복재생하지 않음
    audio2.volume = 0.5; // 음량 설정
    audio2.play(); // sound2.mp3 재생
    alert("알람음이 변경 되었습니다.")
    setTimeout(function () { // 1초 후 sound2.mp3 일시정지
        audio2.pause();
    }, 1000);
}
document.querySelector(".btn3").addEventListener("click",btn3);

function btn4() {
    var audio2 = new Audio("알람음 4.mp3");
    audio2.loop = true; // 반복재생하지 않음
    audio2.volume = 0.5; // 음량 설정
    audio2.play(); // sound2.mp3 재생
    alert("알람음이 변경 되었습니다.")
    setTimeout(function () { // 1초 후 sound2.mp3 일시정지
        audio2.pause();
    }, 1000);
}
document.querySelector(".btn4").addEventListener("click",btn4);

function handleClick (num) {
    console.log(num);
    localStorage.setItem("audio", num);
}