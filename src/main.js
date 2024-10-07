document.addEventListener('DOMContentLoaded', function () {
  const countersContainer = document.getElementById('counters');
  const typeFilterCheckbox = document.getElementById('typeFilterCheckbox');
  const columnSelect = document.getElementById('columnSelect');
  const filterSelect = document.getElementById('filterSelect');
  let counters = [];

  const savedFilterValue = localStorage.getItem('filterValue') || 'alphabetical';
  const savedTypeFilter = localStorage.getItem('typeFilter') === 'true';
  const savedColumnCount = localStorage.getItem('columnCount') || '1';

  // 저장된 값으로 필터 설정
  filterSelect.value = savedFilterValue;
  typeFilterCheckbox.checked = savedTypeFilter;
  columnSelect.value = savedColumnCount;

  function saveFilterSettings() {
    localStorage.setItem('filterValue', filterSelect.value);
    localStorage.setItem('typeFilter', typeFilterCheckbox.checked);
    localStorage.setItem('columnCount', columnSelect.value);
  }

  function saveNickname() {
    const nickname = nicknameInput.value.trim();
    if (nickname) {
      localStorage.setItem('userNickname', nickname);
      alert('닉네임이 저장되었습니다.');
    } else {
      alert('닉네임을 입력해주세요.');
    }
  }

  function loadNickname() {
    const savedNickname = localStorage.getItem('userNickname');
    if (savedNickname) {
      nicknameInput.value = savedNickname;
    }
  }

  nicknameSaveButton.addEventListener('click', saveNickname);

  // Enter 키 입력 시 닉네임 저장
  nicknameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveNickname();
    }
  });

  // 페이지 로드 시 저장된 닉네임 불러오기
  loadNickname();

  if (!countersContainer || !filterSelect || !typeFilterCheckbox || !columnSelect) {
    console.error('필요한 HTML 요소를 찾을 수 없습니다.');
    return;
  }

  counterConfigs.forEach(config => {
    const counter = new Counter(config);
    counters.push(counter);
  });

  function applyFilter() {
    const filterValue = filterSelect.value;
    const showByType = typeFilterCheckbox.checked;

    // 필터 설정 저장
    saveFilterSettings();

    let sortedCounters = [...counters];
    sortedCounters.sort((a, b) => {
      switch (filterValue) {
        case 'alphabetical':
          return a.label.localeCompare(b.label, 'ko');
        case 'count':
          return b.count - a.count;
        case 'lastModified':
          return b.lastModified - a.lastModified;
        default:
          return 0;
      }
    });

    countersContainer.innerHTML = '';
    if (showByType) {
      const types = [...new Set(sortedCounters.map(counter => counter.type))];
      // 물딜을 먼저 정렬하도록 수정
      types.sort((a, b) => {
        if (a === '물딜') return -1;
        if (b === '물딜') return 1;
        return 0;
      });
      types.forEach(type => {
        const typeContainer = document.createElement('div');
        typeContainer.className = 'type-container';
        typeContainer.innerHTML = `<h2>${type}</h2>`;
        const typeCountersContainer = document.createElement('div');
        typeCountersContainer.className = 'counters-grid';
        const typeCounters = sortedCounters.filter(counter => counter.type === type);
        typeCounters.forEach(counter => counter.appendTo(typeCountersContainer));
        typeContainer.appendChild(typeCountersContainer);
        countersContainer.appendChild(typeContainer);
      });
    } else {
      const allCountersContainer = document.createElement('div');
      allCountersContainer.className = 'counters-grid';
      sortedCounters.forEach(counter => counter.appendTo(allCountersContainer));
      countersContainer.appendChild(allCountersContainer);
    }
    updateColumns();
  }

  function updateColumns() {
    const columns = columnSelect.value;
    const grids = document.querySelectorAll('.counters-grid');
    grids.forEach(grid => {
      grid.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
    });
    // 열 설정 저장
    saveFilterSettings();
  }

  filterSelect.addEventListener('change', applyFilter);
  typeFilterCheckbox.addEventListener('change', applyFilter);
  columnSelect.addEventListener('change', updateColumns);

  // 초기 적용
  applyFilter();
})

// 기존 코드 아래에 추가
const settingsButton = document.getElementById('settingsButton');
const bottomRightControls = document.getElementById('bottom-right-controls');

settingsButton.addEventListener('click', () => {
  bottomRightControls.classList.toggle('open');
});

// 패널 외부 클릭 시 닫기
document.addEventListener('click', (event) => {
  if (
    !bottomRightControls.contains(event.target) &&
    event.target !== settingsButton) {
    bottomRightControls.classList.remove('open');
  }
});

// 기존 코드 아래에 추가
const filterButton = document.getElementById('filterButton');
const filterOptions = document.getElementById('filterOptions');
const filterLabel = document.getElementById('filterLabel');

filterButton.addEventListener('click', () => {
  filterOptions.style.display = filterOptions.style.display === 'none' ? 'block' : 'none';
});

document.querySelectorAll('.filter-option').forEach(option => {
  option.addEventListener('click', function () {
    document.getElementById('filterLabel').textContent = this.textContent;
    document.getElementById('filterOptions').style.display = 'none';
    applyFilter();
  });
});
