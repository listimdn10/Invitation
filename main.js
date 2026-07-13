// References to DOM Elements
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");

const paper1 = document.querySelector("#p1");
const paper2 = document.querySelector("#p2");
const FLIP_DURATION = 600;

// Tạo đối tượng âm thanh
const flipSound = new Audio('page-flip-47177.mp3');

// Event Listener
prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);

let currentLocation = 1;
let numOfPapers = 2;
let maxLocation = numOfPapers + 1;

function openBook() {
    const styles = getComputedStyle(document.documentElement);
    const openShift = styles.getPropertyValue("--page-shift-open").trim();

    book.style.transform = `translateX(${openShift})`;
}

function closeBook(isAtBegining) {
    const styles = getComputedStyle(document.documentElement);
    const closedEndShift = styles.getPropertyValue("--page-shift-closed-end").trim();

    if (isAtBegining) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = `translateX(${closedEndShift})`;
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
