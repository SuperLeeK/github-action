function exportData() {
  const data = {
    counters: {},
    filters: JSON.parse(localStorage.getItem('filters') || '{}'),
    settings: JSON.parse(localStorage.getItem('settings') || '{}')
  };

  // 설정에서 닉네임 가져오기
  const settings = JSON.parse(localStorage.getItem('settings') || '{}');
  const nickname = settings.nickname || 'my_counter';

  const exportFileDefaultName = `${nickname}_settings.json`;

  // 카운터 데이터 수집
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key.startsWith('counter_') || key.startsWith('lastModified_')) {
      data.counters[key] = localStorage.getItem(key);
    }
  }

  const dataStr = JSON.stringify(data);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
}

function importData(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);

      // 로컬 스토리지 초기화
      localStorage.clear();

      // 카운터 데이터 복원
      for (const [key, value] of Object.entries(data.counters)) {
        localStorage.setItem(key, value);
      }

      // 필터 데이터 복원
      localStorage.setItem('filters', JSON.stringify(data.filters));

      // 설정 데이터 복원
      localStorage.setItem('settings', JSON.stringify(data.settings));

      location.reload(); // 페이지 자동 새로고침
    } catch (error) {
      console.error('데이터 불러오기 중 오류 발생:', error);
      alert('데이터 불러오기에 실패했습니다. 파일 형식을 확인해주세요.');
    }
  };
  reader.readAsText(file);
}