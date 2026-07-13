// References to DOM Elements
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");

const paper1 = document.querySelector("#p1");
const paper2 = document.querySelector("#p2");
const FLIP_DURATION = 600;
const MOBILE_BREAKPOINT = 768;

let currentBaseShift = "0%";
let panOffset = 0;
let touchStartX = 0;
let touchStartPan = 0;
let isDragging = false;

// Tạo đối tượng âm thanh
const flipSound = new Audio('page-flip-47177.mp3');

// Event Listener
prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);
book.addEventListener("touchstart", handleTouchStart, { passive: true });
book.addEventListener("touchmove", handleTouchMove, { passive: false });
book.addEventListener("touchend", handleTouchEnd);
book.addEventListener("touchcancel", handleTouchEnd);

let currentLocation = 1;
let numOfPapers = 2;
let maxLocation = numOfPapers + 1;

function setBookState(state) {
    book.classList.remove("is-open-spread", "is-closed-end");

    if (state === "open") {
        book.classList.add("is-open-spread");
    }

    if (state === "closed-end") {
        book.classList.add("is-closed-end");
    }
}

function setBookPosition(shift) {
    currentBaseShift = shift;
    const pan = panOffset === 0 ? "" : ` + ${panOffset}px`;
    book.style.transform = `translateX(calc(${shift}${pan}))`;
}

function resetPan() {
    panOffset = 0;
}

function isMobileView() {
    return window.innerWidth <= MOBILE_BREAKPOINT;
}

function canPanBook() {
    return isMobileView() && currentLocation === 2;
}

function getMaxPan() {
    const navInset = 40;
    const pageWidth = book.getBoundingClientRect().width;
    const spreadWidth = pageWidth * 2;
    const availableWidth = Math.max(0, window.innerWidth - navInset);
    return Math.max(0, (spreadWidth - availableWidth) / 2 + 12);
}

function openBook() {
    const styles = getComputedStyle(document.documentElement);
    const openShift = styles.getPropertyValue("--page-shift-open").trim();

    setBookState("open");
    setBookPosition(openShift);
}

function closeBook(isAtBegining) {
    const styles = getComputedStyle(document.documentElement);
    const closedEndShift = styles.getPropertyValue("--page-shift-closed-end").trim();

    resetPan();

    if (isAtBegining) {
        setBookState("closed-start");
        setBookPosition("0%");
    } else {
        setBookState("closed-end");
        setBookPosition(closedEndShift);
    }
}

function goNextPage() {
    if (currentLocation < maxLocation) {
        playFlipSound(); 
        switch (currentLocation) {
            case 1:
                openBook();
                paper1.style.zIndex = 2;
                paper1.classList.add("flipped");
                window.setTimeout(() => {
                    paper1.style.zIndex = 1;
                }, FLIP_DURATION);
                break;
            case 2:
                closeBook(false);
                paper2.style.zIndex = 2;
                paper2.classList.add("flipped");
                break;
            default:
                throw new Error("unknown state");
        }
        currentLocation++;
    }
}

function goPrevPage() {
    if (currentLocation > 1) {
        playFlipSound(); // Phát âm thanh khi chuyển trang
        switch (currentLocation) {
            case 2:
                closeBook(true);
                paper1.style.zIndex = 2;
                paper1.classList.remove("flipped");
                break;
            case 3:
                openBook();
                paper2.style.zIndex = 2;
                paper2.classList.remove("flipped");
                window.setTimeout(() => {
                    paper2.style.zIndex = 1;
                }, FLIP_DURATION);
                break;
            default:
                throw new Error("unknown state");
        }
        currentLocation--;
    }
}

// Hàm phát âm thanh
function playFlipSound() {
    flipSound.currentTime = 0; // Đặt lại thời gian phát âm thanh
    flipSound.volume = 0.5; 
    flipSound.play();
}

function handleTouchStart(event) {
    if (!canPanBook()) {
        return;
    }

    touchStartX = event.touches[0].clientX;
    touchStartPan = panOffset;
    isDragging = true;
    book.classList.add("is-dragging");
}

function handleTouchMove(event) {
    if (!isDragging || !canPanBook()) {
        return;
    }

    const deltaX = event.touches[0].clientX - touchStartX;
    const maxPan = getMaxPan();
    panOffset = Math.min(maxPan, Math.max(-maxPan, touchStartPan + deltaX));
    setBookPosition(currentBaseShift);
    event.preventDefault();
}

function handleTouchEnd() {
    if (!isDragging) {
        return;
    }

    isDragging = false;
    book.classList.remove("is-dragging");
}
