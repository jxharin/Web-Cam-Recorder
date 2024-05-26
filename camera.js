// dom
const recordButton = document.querySelector(".record-button")
const stopButton = document.querySelector(".stop-button")
const playButton = document.querySelector(".play-button")
const downloadButton = document.querySelector(".download-button")

const previewPlayer = document.querySelector("#preview")
const recordingPlayer = document.querySelector("#recording")


let recorder;
let recordedChunks; // 녹화물을 저장하는 배열
//functions
function videoStart(){
    navigator.mediaDevices.getUserMedia({video:true, audio:true})
        .then(stream => {
            previewPlayer.srcObject = stream;//보여주는 용도
            startRecording(previewPlayer.captureStream())
        })
    //console.log(navigator)
    //navigator에 있는 mediaDevices를 사용할 예정
    // Navigator.mediaDevices 속성은 카메라, 마이크, 화면 공유와 같이 현재 연결되 ㄴ미디어 입력 장치에 접근할 수 있는 MediaDevices를 반환

}

function startRecording(stream){
    recordedChunks = []; //녹화가 되어있는 상태에서 또 녹화 버튼을 누를 경우를 위해  녹화 시작 함수에 서 초기화를 한다 
    recorder = new MediaRecorder(stream);
    recorder.ondataavailable = (event) => {recordedChunks.push(event.data)}
    recorder.start()
}
function stopRecording(){
    previewPlayer.srcObject.getTracks().forEach(track => track.stop());
    recorder.stop()
    //console.log(recordedChunks)
    // Blob이 배열에 저장되어 있음 <- 미디어 객체라고 생각하면 됨
}

function playRecording(){
    const recordedBlob = new Blob(recordedChunks, {type: "video/webm" })
    recordingPlayer.src = URL.createObjectURL(recordedBlob);
    recordingPlayer.play()
    downloadButton.href=recordingPlayer.src;
    downloadButton.download = `recording_${new Date()}.webm`;
    console.log(recordingPlayer.src)
}
//event
recordButton.addEventListener("click", videoStart)
stopButton.addEventListener("click", stopRecording)
playButton.addEventListener("click", playRecording)