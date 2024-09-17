const parseSteamId = (sid) => {
    if (typeof sid !== "string" || sid.length < 3) {
        return null;
    }

    sid = sid.trim();

    const regularCharsRegex = new RegExp(/^[a-zA-Z0-9]*$/gim);
    const steamVanityUrlRegex = new RegExp(/^((http|https):\/\/)?(steamcommunity.com\/)(id)(\/)(.*?)(\/)?$/gim);
    const steamU64UrlRegex = new RegExp(/^((http|https):\/\/)?(steamcommunity.com\/)(profiles)(\/)\d{17}(\/)?$/gim);
    const steamUrlRegex = new RegExp(/^((http|https):\/\/)?(steamcommunity.com\/)(id|profiles)(\/)(.*?)|(\/)?$/gim);
    const steamU64Regex = new RegExp(/^7656\d{13}$/gim);

    if (steamU64UrlRegex.test(sid) || steamU64Regex.test(sid)) {
        return sid.replace(steamUrlRegex, "").split("/")[0];

    } else if (steamVanityUrlRegex.test(sid)) {
        return sid.replace(steamUrlRegex, "").split("/")[0];

    } else if (regularCharsRegex.test(sid)) {
        return sid;

    } else {
        return null;
    }
}

window.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementsByClassName("form")[0];

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const steamid = parseSteamId(document.getElementsByClassName("steamid")[0].value);

        if (!steamid) {
            const error = document.getElementsByClassName("error")[0];

            if (error) {
                return;
            }

            const table = document.getElementsByTagName("table")[0];
            const span = document.createElement("span");
            span.className = "error";
            span.textContent = "invalid steamid";
            span.style.padding = "5px";
            span.style.backgroundColor = "#ff5f5f6b";
            span.style.border = "solid 1px red";
            span.style.textAlign = "center";
            span.style.marginBlock = "5px";
            span.style.color = "#fff";
            span.style.fontWeight = "bold";

            table.after(span)

            setTimeout(() => {
                span.remove();
            }, 3000);
        } else {
            window.location.href = `player/${steamid}`;
        }
    });
});