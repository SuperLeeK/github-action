class Counter {
  constructor({ uid, label, type, grade }) {
    this.id = uid;
    this.label = label;
    this.type = type;
    this.grade = grade;
    this.count = this.loadCount();
    this.lastModified = this.loadLastModified();
    this.element = this.createCounterElement();
    this.updateDisplay();
  }

  createCounterElement() {
    const container = document.createElement('div');
    container.className = 'counter';
    container.innerHTML = `
        <span class="counter-label">${this.label}</span>
        <button class="increase"></button>
        <span class="counter-value" id="${this.id}">0</span>
        <button class="decrease"></button>
    `;

    const decreaseButton = container.querySelector('.decrease');
    const increaseButton = container.querySelector('.increase');
    const counterValue = container.querySelector('.counter-value');

    decreaseButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.changeCount(-1);
    });

    increaseButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.changeCount(1);
    });

    counterValue.addEventListener('click', (e) => {
      e.stopPropagation();
      this.copyToClipboard();
    });

    container.addEventListener('mouseenter', () => this.showLastModified());
    container.addEventListener('mouseleave', () => this.hideLastModified());

    return container;
  }

  changeCount(delta) {
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
    this.element.appendChild(copyTooltip);

    // 툴팁 위치 조정
    const tooltipRect = copyTooltip.getBoundingClientRect();
    const parentRect = this.element.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    let topPosition = '0';
    if (parentRect.bottom + tooltipRect.height > viewportHeight) {
      topPosition = `-${tooltipRect.height}px`;
    }

    copyTooltip.style.top = topPosition;

    // 툴팁이 나타나는 애니메이션 효과
    setTimeout(() => {
      copyTooltip.style.opacity = '1';
      copyTooltip.style.transform = `translate(-50%, ${topPosition === '0' ? '0' : '-10px'})`;
    }, 10);

    setTimeout(() => {
      // 툴팁이 사라지는 애니메이션 효과
      copyTooltip.style.opacity = '0';
      copyTooltip.style.transform = `translate(-50%, ${topPosition === '0' ? '10px' : '-20px'})`;

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
      this.element.appendChild(tooltip);
    }
  }

  hideLastModified() {
    const tooltip = this.element.querySelector('.tooltip');
    if (tooltip) {
      tooltip.remove();
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