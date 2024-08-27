const parseSteamId = (sid) => {
    if (typeof sid !== "string" || sid.length < 3) {
        return null;
    }

    sid = sid.trim();

    const onlyRegularCharsRegex = new RegExp(/^[a-zA-Z0-9]*$/gim);
    const steamVanityUrlRegex = new RegExp(/^((http|https):\/\/)?(steamcommunity.com\/)(id)(\/)(.*?)(\/)?$/gim);
    const steamU64UrlRegex = new RegExp(/^((http|https):\/\/)?(steamcommunity.com\/)(profiles)(\/)\d{17}(\/)?$/gim);
    const steamUrlRegex = new RegExp(/^((http|https):\/\/)?(steamcommunity.com\/)(id|profiles)(\/)(.*?)|(\/)?$/gim);
    const steamU64Regex = new RegExp(/^7656\d{13}$/gim);

    if (steamU64UrlRegex.test(sid) || steamU64Regex.test(sid)) {
        return sid.replace(steamUrlRegex, "").split("/")[0];

    } else if (steamVanityUrlRegex.test(sid)) {
        return sid.replace(steamUrlRegex, "").split("/")[0];

    } else if (onlyRegularCharsRegex.test(sid)) {
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
            span.textContent = "invalid steamid";
            span.classList.add("error");

            table.after(span)

            setTimeout(() => {
                span.remove();
            }, 3000);

        } else {
            window.location.href = `player/${steamid}`;
        }
    });

});