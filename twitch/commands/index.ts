import blacklist from "./blacklist";
import level from "./level";
import requests from "./requests";
import stars from "./stars";

const commands: any = {
	requests: requests,
	stars: stars,
	level: level,
	blacklist: blacklist,
};

export default commands;
