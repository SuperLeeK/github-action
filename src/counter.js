class Counter {
  constructor({ uid, label, type, grade, image }) {
    this.id = uid;
    this.label = label;
    this.type = type;
    this.grade = grade;
    this.image = image; // 새로운 image 속성 추가
    this.count = this.loadCount();
    this.lastModified = this.loadLastModified();
    this.element = this.createCounterElement();
    this.updateDisplay();
  }

  createCounterElement() {
    const element = document.createElement('div');
    element.className = 'counter';
    element.innerHTML = `
      <div class="counter-header">
        <img src="${this.image}" alt="${this.label}" class="counter-image">
        <span class="counter-label">${this.label}</span>
      </div>
      <div class="counter-controls">
        <button class="decrement">-</button>
        <span class="counter-value" id="${this.id}">${this.count}</span>
        <button class="increment">+</button>
      </div>
      <div class="last-modified">최근 수정: ${this.getFormattedLastModified()}</div>
    `;

    const decrementButton = element.querySelector('.decrement');
    const incrementButton = element.querySelector('.increment');

    decrementButton.addEventListener('click', () => this.changeCount(-1));
    incrementButton.addEventListener('click', () => this.changeCount(1));

    return element;
  }

  getFormattedLastModified() {
    if (!this.lastModified) return '없음';
    return new Date(this.lastModified).toLocaleString();
  }

  changeCount(delta) {
    const nickname = localStorage.getItem('userNickname');
    if (!nickname) {
      alert('닉네임을 먼저 설정해주세요.');
      return; // 실행 취소
    }

    if (delta < 0 && this.count === 0) return; // 음수 방지
    const oldCount = this.count;
    this.count += delta;
    this.updateDisplay();
    this.saveCount();
    if (this.count !== oldCount) {
      this.updateLastModified();
    }
    this.copyToClipboard();
  }

  copyToClipboard() {
    const nickname = localStorage.getItem('userNickname') || 'UNKNOWN';
    const date = new Date(this.lastModified);
    const formattedDate = date.toLocaleString('ko-KR', {
      // year: '2-digit',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).replace(/[. :]/g, '');

    const textToCopy = `${formattedDate}_${nickname.toUpperCase()} ${this.label} ${this.grade} ${this.count}클`;

    navigator.clipboard.writeText(textToCopy).then(() => {
      console.log('텍스트가 클립보드에 복사되었습니다: ' + textToCopy);
      this.showCopiedTooltip(textToCopy);
    }).catch(err => {
      console.error('클립보드 복사 중 오류 발생: ', err);
    });
  }

  showCopiedTooltip(copiedText) {
    const copyTooltip = document.createElement('div');
    copyTooltip.className = 'copy-tooltip';
    copyTooltip.innerHTML = `복사됨!<br><span class="copied-text">${copiedText}</span>`;
    
    // 툴팁을 body에 추가
    document.body.appendChild(copyTooltip);

    // 화면 중앙 위치 계산
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    
    // 툴팁 위치 설정
    copyTooltip.style.left = `${viewportWidth / 2}px`;
    copyTooltip.style.top = `20px`; // 화면 상단에서 20px 아래에 위치

    // 툴팁이 나타나는 애니메이션 효과
    setTimeout(() => {
      copyTooltip.style.opacity = '1';
      copyTooltip.style.transform = 'translate(-50%, 0) scale(1)';
    }, 10);

    setTimeout(() => {
      // 툴팁이 사라지는 애니메이션 효과
      copyTooltip.style.opacity = '0';
      copyTooltip.style.transform = 'translate(-50%, 0) scale(0.9)';

      // 애니메이션이 끝난 후 요소 제거
      setTimeout(() => {
        copyTooltip.remove();
      }, 300);
    }, 2000);
  }

  showLastModified() {
    if (this.lastModified) {
      const tooltip = document.createElement('div');
      tooltip.className = 'tooltip';
      tooltip.textContent = `최근 수정: ${new Date(this.lastModified).toLocaleString()}`;
      
      // 마우스 위치에 툴팁 표시
      document.addEventListener('mousemove', (e) => {
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
      });
      
      document.body.appendChild(tooltip);
      this.tooltipElement = tooltip;
    }
  }

  hideLastModified() {
    if (this.tooltipElement) {
      this.tooltipElement.remove();
      this.tooltipElement = null;
    }
  }

  increase() {
    this.count++;
    this.updateDisplay();
    this.saveCount();
    this.updateLastModified();
  }

  decrease() {
    if (this.count > 0) {
      this.count--;
      this.updateDisplay();
      this.saveCount();
      this.updateLastModified();
    }
  }

  saveCount() {
    localStorage.setItem(`counter_${this.id}`, this.count);
  }

  loadCount() {
    return parseInt(localStorage.getItem(`counter_${this.id}`)) || 0;
  }

  updateLastModified() {
    this.lastModified = Date.now();
    localStorage.setItem(`lastModified_${this.id}`, this.lastModified);
    const lastModifiedElement = this.element.querySelector('.last-modified');
    if (lastModifiedElement) {
      lastModifiedElement.textContent = `최근 수정: ${this.getFormattedLastModified()}`;
    }
  }

  loadLastModified() {
    const savedLastModified = localStorage.getItem(`lastModified_${this.id}`);
    return savedLastModified ? parseInt(savedLastModified) : null;
  }

  updateDisplay() {
    const element = this.element.querySelector(`#${this.id}`);
    if (element) {
      element.textContent = this.count;
    }
  }

  appendTo(parentElement) {
    parentElement.appendChild(this.element);
  }
}

// 전역 객체에 Counter 클래스 추가
window.Counter = Counter;