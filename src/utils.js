//gotta fix this
export const parseSteamId = (sid) => {
    if (typeof sid !== "string") {
        return null;
    }

    const steamUrlRegex = /((http|https):\/\/)?(steamcommunity.com\/)(id|profiles)(\/)(.*?)|(\/)(.*)/;
    const steamU64Regex = /\b7656\d{13}\b/g;
    const removeSpecialCharsRegex = /[^a-zA-Z0-9 ]/g;
    const steamid = sid.replace(steamUrlRegex, "").replace(removeSpecialCharsRegex, "");
    
    if (steamid.length < 3) {
        return null;
    }
    

    return steamU64Regex.test(steamid) ? `profiles/${steamid}` : `id/${steamid}`;
}

export const sayIt = () => "no";