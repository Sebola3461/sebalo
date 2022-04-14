import { PrivateMessage } from "bancho.js";
import parseNP from "./parseNP";

export default (pm: PrivateMessage) => {
	if (pm.content.includes("https://osu.ppy.sh/beatmapsets/")) parseNP(pm);
};
