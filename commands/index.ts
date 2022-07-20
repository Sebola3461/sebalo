import acc from "./acc";
import help from "./help";
import recent from "./recent";
import requests from "./requests";
import twitch from "./twitch";
import _with from "./with";

const commands: any = {
	with: _with,
	help: help,
	twitch: twitch,
	requests: requests,
	acc: acc,
	rs: recent,
	recent: recent,
};

export default commands;
