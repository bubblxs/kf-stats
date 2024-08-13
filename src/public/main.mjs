export const parseSteamId = (sid) => {
    if (typeof sid !== "string") {
        return null;
    }

    let steamid = null;
    const steamU64UrlRegex = /^((http|https):\/\/)?(steamcommunity.com\/)(profiles)(\/)\d{17}(\/)?$/gim;
    const steamU64Regex = /^7656\d{13}$/gim;
    const steamUrlRegex = /((http|https):\/\/)?(steamcommunity.com\/)(id|profiles)(\/)(.*?)|(\/)?/gim;

    if (steamU64UrlRegex.test(sid) || steamU64Regex.test(sid)) {
        steamid = `profiles/${sid.replace(steamUrlRegex, "").split("/")[0]}`;

    } else {
        steamid = `id/${sid.replace(steamUrlRegex, "").split("/")[0]}`;
    }

    return steamid;
}


window.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementsByClassName("form")[0];

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const steamid = parseSteamId(document.getElementsByClassName("steamid")[0].value);

        if (!steamid || steamid.length < 3) {
            return alert("bruv");
        }
        
        window.location.href = steamid;
    })
});