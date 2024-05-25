function searchEngineChange(dropdown = localStorage.getItem('dropdownMenu')) {
    
}

function timer(date = new Date()) {
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();

        const hoursEl = document.querySelector('.time div h2.hours');
        const minutesEl = document.querySelector('.time div h2.minutes');
        const secondsEl = document.querySelector('.time div h2.seconds');

        const hoursStr = hours.toString().padStart(2, '0');
        const minutesStr = minutes.toString().padStart(2, '0');
        const secondsStr = seconds.toString().padStart(2, '0');

        hoursEl.innerText = hoursStr;
        minutesEl.innerText = minutesStr;
        secondsEl.innerText = secondsStr;
};

timer();
setInterval(timer, 1000);