import blacklist from "./blacklist";
import level from "./level";
import requests from "./requests";
import stars from "./stars";
import leaderboard from "./leaderboard";

const commands: any = {
	requests: requests,
	stars: stars,
	level: level,
	blacklist: blacklist,
	leaderboard: leaderboard,
	lb: leaderboard,
};

export default commands;
