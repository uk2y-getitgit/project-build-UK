// 헤더 스크롤 색상 변경
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 모바일 메뉴 토글
function toggleMobileMenu() {
    const overlay = document.getElementById('mobileMenu');
    overlay.classList.toggle('active');

    // 메뉴 열릴 때 바디 스크롤 막기
    if (overlay.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// 스크롤 시 페이드인 애니메이션 관측 (Intersection Observer)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // 한번 보여지면 계속 보이게 감시 해제 원할 시 아래 주석 해제
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(element => {
    observer.observe(element);
});

// FAQ 아코디언 동작 
// (요구사항에 JS 로직 제외였지만, 아코디언 클릭 시 동작하는 기본적인 UX를 위해 추가)
document.querySelectorAll('.faq-question').forEach(button => {
    button.addEventListener('click', () => {
        const answer = button.nextElementSibling;
        const icon = button.querySelector('.faq-icon');

        if (answer && answer.classList.contains('faq-answer')) {
            const isOpen = answer.style.display === 'block';

            // 우선 모든 FAQ를 닫습니다.
            document.querySelectorAll('.faq-answer').forEach(el => el.style.display = 'none');
            document.querySelectorAll('.faq-icon').forEach(el => el.textContent = '+');

            // 누른 것이 닫혀있었다면 해당 컨텐츠만 오픈
            if (!isOpen) {
                answer.style.display = 'block';
                icon.textContent = '−';
            }
        }
    });
});