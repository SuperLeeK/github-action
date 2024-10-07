const fs = require('fs');
const path = require('path');

// counterConfig.js 파일 경로
const configPath = path.join(__dirname, 'src', 'counterConfig.js');

// 이미지 디렉토리 경로
const imageDir = path.join(__dirname, 'images');

// counterConfig.js 파일 읽기
const configContent = fs.readFileSync(configPath, 'utf8');

// 정규 표현식을 사용하여 이미지 파일 이름 추출
const usedImages = configContent.match(/image: '\.\/images\/(.+?)'/g)
  .map(match => match.split('/').pop().replace("'", ""));

// 이미지 디렉토리의 모든 파일 읽기
fs.readdir(imageDir, (err, files) => {
  if (err) {
    console.error('이미지 디렉토리를 읽는 중 오류 발생:', err);
    return;
  }

  files.forEach(file => {
    if (!usedImages.includes(file)) {
      // 사용되지 않는 이미지 파일 삭제
      fs.unlink(path.join(imageDir, file), err => {
        if (err) {
          console.error(`${file} 삭제 중 오류 발생:`, err);
        } else {
          console.log(`${file} 삭제됨`);
        }
      });
    }
  });
});

console.log('이미지 정리 완료');