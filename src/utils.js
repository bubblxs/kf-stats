export const parseSteamId = (steamId) => {
        if (typeof steamId !== "string" || steamId.length < 3) {
                return null;
        }

        steamId = steamId.trim();

        const regularCharsRegex = /^[a-zA-Z0-9]+$/;
        const steamVanityUrlRegex = /^(?:https?:\/\/)?steamcommunity\.com\/id\/([^\/]+)(?:\/)?$/;
        const steamU64UrlRegex = /^(?:https?:\/\/)?steamcommunity\.com\/profiles\/(\d{17})(?:\/)?$/;
        const steamU64Regex = /^7656\d{13}$/;

        const u64Match = steamId.match(steamU64UrlRegex);
        if (u64Match || steamU64Regex.test(steamId)) {
                return `profiles/${u64Match ? u64Match[1] : steamId}`;
        }

        const vanityMatch = steamId.match(steamVanityUrlRegex);
        if (vanityMatch) {
                return `id/${vanityMatch[1]}`;
        }

        if (regularCharsRegex.test(steamId)) {
                return `id/${steamId}`;
        }

        return null;
};

export const sayIt = () => "no";