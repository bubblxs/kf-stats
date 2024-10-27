export const parseSteamId = (sid) => {
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
        return `profiles/${u64Match ? u64Match[1] : sid}`;
    }

    const vanityMatch = sid.match(steamVanityUrlRegex);
    if (vanityMatch) {
        return `id/${vanityMatch[1]}`;
    }

    if (regularCharsRegex.test(sid)) {
        return `id/${sid}`;
    }

    return null;
};

export const sayIt = () => "no";