import blacklist from "./blacklist";
import level from "./level";
import requests from "./requests";
import stars from "./stars";
import leaderboard from "./leaderboard";
import np from "./np";

const commands: any = {
	requests: requests,
	stars: stars,
	level: level,
	blacklist: blacklist,
	leaderboard: leaderboard,
	lb: leaderboard,
	map: np,
	beatmap: np,
	np: np,
	song: np,
};

export default commands;
