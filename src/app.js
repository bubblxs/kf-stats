import helmet from "helmet";
import express from "express";
import compression from "compression";
import { resolve } from "node:path";
import { load } from "cheerio";
import { XMLParser } from "fast-xml-parser";

import { parseSteamId } from "./utils.js";

const fetchAvatar = async (steamid) => {
    const url = new URL("https://steamcommunity.com");
    url.pathname = steamid;

    return fetch(url).then(response => {
        return response.text();
    }).then(response => {
        const src = [];
        const $ = load(response);
        const personaName = $("span.actual_persona_name").text();

        $("div.playerAvatarAutoSizeInner").find("img").each((_, el) => src.push(el.attribs.src));

        return { personaName, src };
    });
};

const fetchStats = async (steamid) => {
    const url = new URL("https://steamcommunity.com");
    url.pathname = `${steamid}/statsfeed/1250`;

    return fetch(url)
        .then((response) => {
            if (!response.headers.get("content-type")?.startsWith("text/xml") || !response.clone().text()) {
                throw Error("profile not found");
            }

            return response.text()
        })
        .then((response) => {
            const xml = new XMLParser().parse(response);

            if (!xml.statsfeed || xml.statsfeed.error) {
                throw Error(xml.statsfeed.error ?? "profile not found");
            }

            const stats = new Map();
            const achievements = new Map();
            const { steamID64 } = xml.statsfeed;

            let numAchievementsCompleted = 0;
            for (let i = 0, l = xml.statsfeed.achievements.item.length; i < l; i++) {
                const { APIName, value } = xml.statsfeed.achievements.item[i];

                achievements.set(APIName, value);

                if (value !== 0) {
                    numAchievementsCompleted++;
                }
            }

            for (let i = 0, l = xml.statsfeed.stats.item.length; i < l; i++) {
                const { APIName, value } = xml.statsfeed.stats.item[i];

                stats.set(APIName, value);
            }

            const profile = {
                steamID64,
                kills: {
                    total: stats.get("kills"),
                    headshots: stats.get("headshotkills"),
                    stalker: stats.get("stalkerkills"),
                    bloat: stats.get("bloatkills"),
                    siren: stats.get("sirenkills"),
                },
                damageHealed: stats.get("damagehealed"),
                totalAchievements: achievements.size,
                numAchievementsCompleted,
                soleSurvivorWaves: achievements.get("solesurvivorwaves"),
                totalZedTime: stats.get("totalzedtime"),
                weldingPoints: stats.get("weldingpoints"),
                prestige: {
                    medic: stats.get("medicprestige"),
                    support: stats.get("supportprestige"),
                    sharpshooter: stats.get("sharpshooterprestige"),
                    commando: stats.get("commandoprestige"),
                    berserker: stats.get("berserkerprestige"),
                    firebug: stats.get("firebugprestige"),
                    demo: stats.get("demoprestige")
                }
            };

            return profile;
        });
};
const app = express();

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": [
                "'self'"
            ],
            "img-src": [
                "'self'",
                "https://*.steamstatic.com"
            ]
        }
    }
}));
app.use(compression());
app.use(express.json());
app.set("view engine", "ejs");
app.set("views", resolve("src", "views"));
app.use("/static", express.static(resolve("src", "public")));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/player/:sid", (req, res) => {
    const { sid } = req.params ?? null;
    const steamid = parseSteamId(encodeURIComponent(sid));

    if (!steamid) {
        return res.status(400).render("error", { error: "bad request" });
    }

    Promise.all([fetchStats(steamid), fetchAvatar(steamid)]).then((response) => {
        const [stats, avatar] = response;

        res.render("profile", { ...stats, ...avatar });
    }).catch((err) => {
        console.log(err.message);
        res.render("error", { error: err.message ?? "steam's fault" });
    });
});

app.all("*", (req, res) => {
    res.status(404).render("error", { error: "kinda lost, huh?" });
});

app.use((err, req, res, next) => {
    console.log(err.message);
    res.status(404).render("error", { error: "hey" });
});

app.listen(4242, () => console.log("running on ::4242"));