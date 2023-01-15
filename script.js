function updateProgress(PART, checked, shouldRender) {
    if (shouldRender == undefined) { shouldRender = true; }
    let ls = getLocalStorage();
    ls["progress"][PART - 1] = checked;
    setLocalStorage(ls);
}

function updateLocalStorage(key, value, shouldRender) {
    if (shouldRender == undefined) { shouldRender = true; }

    let ls = getLocalStorage();
    ls[key] = value;
    setLocalStorage(ls);
    
    if (shouldRender) {
        render();
    }
}

function setLocalStorage(jsonValue, shouldRender) {
    if (shouldRender == undefined) { shouldRender = true; }
    
    window.localStorage.setItem('seventyfive', JSON.stringify(jsonValue));
    
    if (shouldRender) {
        render();
    }   
}

function getLocalStorage() {
    return JSON.parse(
        window.localStorage.getItem('seventyfive')
    );
}

function formatDate(d) {
    let ds = [];
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    ds.push(d.getDate());
    ds.push(months[d.getMonth()]);
    ds.push(d.getUTCFullYear());
    ds.push(`${p(d.getHours(), 2)}:${p(d.getMinutes(), 2)}:${p(d.getSeconds(), 2)}`);
    // 12 Jan 2023 10:12:35
    return ds.join(" "); 
}

function p(value, number) {
    let sv = value.toString();
    let res = [];
    if (sv.length < number) {
        let n = number - sv.length;
        for (let i=0; i < n; i++) {
            res.push("0");
        }
    }
    res.push(sv);
    return res.join("");
}

function getMaxUnlockedPart() {
    let ls = getLocalStorage();

    const startTimestamp = new Date(ls["timestamp"]);
    const startMs = startTimestamp.getTime();
    const nowMs = Date.now();

    let unlockTime = startMs;
    unlockTime += 24 * 60 * 60 * 1000;
    let part = 1;
    while (unlockTime < nowMs) {
        unlockTime += 24 * 60 * 60 * 1000; // one 24-day in miliseconds
        part += 1;
    }
    return part;
}

function updateNextUnlock() {
    let ls = getLocalStorage();

    const startTimestamp = new Date(ls["timestamp"]);
    const startMs = startTimestamp.getTime() - 1; // - 1 prevent equal times on reset
    const nowMs = Date.now();

    let unlockTime = startMs; 
    while (unlockTime < nowMs) {
        unlockTime += 24 * 60 * 60 * 1000; // one 24-day in miliseconds
    }

    let diff = unlockTime - nowMs;

    const dh = Math.floor(diff / (60 * 60 * 1000));
    diff -= dh * 60 * 60 * 1000;

    const dm = Math.floor(diff / (60 * 1000));
    diff -= dm * 60 * 1000;

    const ds = Math.floor(diff / 1000);

    return `${p(dh, 2)}:${p(dm, 2)}:${p(ds, 2)}`;
}

// Update view to reflect state
function render() {
    const elemTimestamp  = document.querySelector(".data.timestamp");
    const elemProgress   = document.querySelector(".data.progress");
    const elemNextUnlock = document.querySelector(".data.nextUnlock");
    const btnTimestamp      = document.querySelector(".btn.resetTimestamp");
    const btnProgress       = document.querySelector(".btn.resetProgress");
    const btnHighestSolved  = document.querySelector(".btn.highestSolved");

    let ls = getLocalStorage();

    if (ls !== null) {
        if (elemTimestamp !== null) {
            elemTimestamp.textContent = formatDate(new Date(ls["timestamp"]));
        }

        if (elemProgress !== null) {
            const partsComplete = ls["progress"].filter(p => p).length;
            elemProgress.textContent = partsComplete;
            if (partsComplete > 1) {
                btnHighestSolved.style.display = "inline-block";
            }
        }

        if (elemNextUnlock !== null) {
            elemNextUnlock.textContent = updateNextUnlock();
        }

        // Unhide elements if "ls" exists 
        const dataLabel = document.querySelectorAll(".data, .label");
        if (dataLabel.length > 0) {
            for (let d of dataLabel) {
                d.style.display = "inline-block";
            }
        }
        if (btnTimestamp !== null) {
            btnTimestamp.style.display = "inline-block";
        }
        if (btnProgress !== null) {
            btnProgress.style.display  = "inline-block";
        }
    }
}

function getInitParts() {
    let parts = [];
    for (let i=0; i < 75; i++) {
        parts.push(false);
    }
    return parts;
}

function main() {

    // Initial render
    render();

}
main();