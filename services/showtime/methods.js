require("dotenv").config();
const puppeteer = require("puppeteer");

const AP = require("../ap");
const Word = AP.word;
const path = require("path");

const setup = async (url = null) => {
	try {
		const browser = await puppeteer.launch({
			headless: false, slowMo: 0, devtools: false, args: [
				"--no-sandbox",
				"--disable-setuid-sandbox",
				"--proxy-server='direct://",
				"--proxy-bypass-list=*",
				"--disable-dev-shm-usage",
				"--disable-accelerated-2d-canvas",
				"--disable-gl-drawing-for-tests",
				"--mute-audio",
			],
		});

		try {
			const page = await openPage(browser, url);
			return {
				page, browser,
			};
		} catch (error) {
			console.log("Open error");
		}

		return {
			browser,
		};
	} catch (error) {
		throw new Error(error);
	}
};

const openPage = async (browser, url = null) => {
	try {

		let page = await browser.newPage();

		await page.addStyleTag({ content: "{scroll-behavior: auto !important;}" });

		if (!url) {
			url = 'https://true.growsuite.truelab.live/showtime/guest';
		}
		let max_retry = 10;
		let remain_retry = max_retry;
		var start = (new Date()).getTime();
		while (--remain_retry){
			try{
				await page.goto(url);
				break;
			} catch (e){
				await closePage(page);
				await new Promise(resolve => setTimeout(resolve, 5000));
				page = await browser.newPage();
			}
		}
		var end = (new Date()).getTime();

		console.log("Retry---" + (max_retry - remain_retry) + " Duration: " + (end - start))

		return page;

	} catch (error) {
		throw new Error(error);
	}
};

const closePage = async (page, browser = null) => {
	try {
		await page.close();

		if (browser) {
			await browser.close();
		}
	} catch (e) {
		
	}
};

const testPage = async (behavior, url) => {

	var totalPage = behavior.totalPage;
	var waitingTime = behavior.waitingTime;
	var aliveTime = (behavior.aliveTime || 10) * 60000;

	try {

		var pages = [];
		var opening = [];
		for (var i = 0; i < totalPage; i++) {
			pages.push(url);
		}

		const promises = pages.map(async (page_url, index) => {

			try {
				console.log(`Load page ${index}`);
				const { page, browser } = await setup(page_url);
				await page.waitForSelector('.join-now');
				await page.$$eval(".exp-participant-layout", async (node) => {
					var input = await node[0].querySelectorAll('.exp-input-counter input')[0];
					var join = await node[0].querySelectorAll('.join-now')[0];
					var text = "";
					var possible = "abcdefghjklmnpqrstuvwxyz";

					for (var i = 0; i < 6; i++) {
						text += possible.charAt(Math.floor(Math.random() * possible.length));
					}

					input.value = text;
					join.click();

				});
				await page.waitForTimeout(aliveTime);

				opening.push({ page, browser });
			} catch (err) {
				throw new Error(err);
			}
		});

		await Promise.all(promises);

		const promises_close = opening.map(async (data, index) => {

			try {
				console.log(`Close page ${index}`);
				await closePage(data.page, data.browser);
			} catch (e) {

			}
		});
		// await Promise.all(promises_close);
		return {

		};

	} catch (error) {
		throw new Error(error);
	}

}

module.exports = {
	setup, openPage, testPage, closePage
};
