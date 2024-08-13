//gotta fix this
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

export const sayIt = () => "no";