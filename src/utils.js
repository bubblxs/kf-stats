export const parseSteamId = (sid) => {
    if (typeof sid !== "string") {
        return null;
    }

    sid = sid.trim();

    const onlyRegularCharsRegex = new RegExp(/^[a-zA-Z0-9]*$/gim);
    const steamVanityUrlRegex = new RegExp(/^((http|https):\/\/)?(steamcommunity.com\/)(id)(\/)(.*?)(\/)?$/gim);
    const steamU64UrlRegex = new RegExp(/^((http|https):\/\/)?(steamcommunity.com\/)(profiles)(\/)\d{17}(\/)?$/gim);
    const steamUrlRegex = new RegExp(/^((http|https):\/\/)?(steamcommunity.com\/)(id|profiles)(\/)(.*?)|(\/)?$/gim);
    const steamU64Regex = new RegExp(/^7656\d{13}$/gim);

    if (steamU64UrlRegex.test(sid) || steamU64Regex.test(sid)) {
        return `profiles/${sid.replace(steamUrlRegex, "").split("/")[0]}`;

    } else if (steamVanityUrlRegex.test(sid)) {
        return `id/${sid.replace(steamUrlRegex, "").split("/")[0]}`;

    } else if (onlyRegularCharsRegex.test(sid)) {
        return `id/${sid}`;

    } else {
        return null;
    }
}

export const sayIt = () => "no";