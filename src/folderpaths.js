let savePath = '';
let screenshotPath = '';

function setSavePath() {
  const input = document.createElement('input');
  input.type = 'file';
  input.webkitdirectory = true;
  input.addEventListener('change', (event) => {
    savePath = event.target.files[0].path;
    localStorage.setItem('savePath', savePath);
    alert('세이브 폴더가 설정되었습니다: ' + savePath);
  });
  input.click();
}

function setScreenshotPath() {
  const input = document.createElement('input');
  input.type = 'file';
  input.webkitdirectory = true;
  input.addEventListener('change', (event) => {
    screenshotPath = event.target.files[0].path;
    localStorage.setItem('screenshotPath', screenshotPath);
    alert('스크린샷 폴더가 설정되었습니다: ' + screenshotPath);
  });
  input.click();
}

function openSavePath() {
  if (savePath) {
    window.open('file://' + savePath);
  } else {
    alert('세이브 폴더가 설정되지 않았습니다.');
  }
}

function openScreenshotPath() {
  if (screenshotPath) {
    window.open('file://' + screenshotPath);
  } else {
    alert('스크린샷 폴더가 설정되지 않았습니다.');
  }
}

document.getElementById('setSavePathButton').addEventListener('click', setSavePath);
document.getElementById('setScreenshotPathButton').addEventListener('click', setScreenshotPath);
document.getElementById('openSavePathButton').addEventListener('click', openSavePath);
document.getElementById('openScreenshotPathButton').addEventListener('click', openScreenshotPath);

// 저장된 경로 불러오기
savePath = localStorage.getItem('savePath') || '';
screenshotPath = localStorage.getItem('screenshotPath') || '';