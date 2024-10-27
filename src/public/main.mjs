const parseSteamId = (sid) => {
    if (typeof sid !== "string" || sid.length < 3) {
        return null;
    }

    sid = sid.trim();

    const regularCharsRegex = /^[a-zA-Z0-9]+$/;
    const steamVanityUrlRegex = /^(?:https?:\/\/)?steamcommunity\.com\/id\/([^\/]+)(?:\/)?$/;
    const steamU64UrlRegex = /^(?:https?:\/\/)?steamcommunity\.com\/profiles\/(\d{17})(?:\/)?$/;
    const steamU64Regex = /^7656\d{13}$/;

    const u64Match = sid.match(steamU64UrlRegex);
    if (u64Match || steamU64Regex.test(sid)) {
        return u64Match ? u64Match[1] : sid;
    }

    const vanityMatch = sid.match(steamVanityUrlRegex);
    if (vanityMatch) {
        return vanityMatch[1];
    }

    if (regularCharsRegex.test(sid)) {
        return sid;
    }

    return null;
}

window.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const steamid = parseSteamId(document.querySelector(".steamid").value);

        if (!steamid) {
            const error = document.querySelector(".error");

            if (error) return;

            const table = document.querySelector("table");
            const span = document.createElement("span");
            span.className = "error";
            span.style.color = "#fff";
            span.style.border = "solid 1px #ff";
            span.style.padding = "5px";
            span.style.textAlign = "center";
            span.style.fontWeight = "bold";
            span.style.marginBlock = "5px";
            span.style.backgroundColor = "#ff5f5f6b";
            span.textContent = "invalid steamid";

            table.after(span)

            setTimeout(() => { span.remove(); }, 3000);

        } else {
            window.location.href = `player/${steamid}`;
        }
    });
});