import puppeteer from "puppeteer";

export const fetchTOIData = async requestObj => {
	let browser = null;

	try {
		browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});

		const page = await browser.newPage();

		page.setDefaultNavigationTimeout(0);

		await page.setUserAgent(
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
		);

		await page.goto(`https://timesofindia.indiatimes.com/topic/${requestObj.topic}`, {
			waitUntil: ["domcontentloaded", "networkidle2"],
		});

		const newsResultsDivs = await page.$$(".uwU81");

		const newsRaw = newsResultsDivs.map(async result => {
			const getJSONText = async (selectorStr, el) =>
				await (await (await el.$(selectorStr)).getProperty("textContent")).jsonValue();

			const headline = await getJSONText(".fHv_i.o58kM span", result);
			const metadata = await getJSONText(".ZxBIG", result);
			const summary = await getJSONText(".oxXSK.o58kM span", result);

			const articleLink = await result.$eval("a[href]", el => el.getAttribute("href"));

			const [publisher, publishedDate] = metadata.split(" / ");

			return {
				source: "TOI",
				headline: headline.trim(),
				publisher: publisher?.trim() ?? "",
				publishedDate: publishedDate?.trim() ?? "",
				summary: summary.trim(),
				articleLink,
			};
		});

		const news = await Promise.all(newsRaw);
		return news;
	} catch (error) {
		console.error(`Error: ${error.message}`);
		throw error;
	} finally {
		browser !== null && (await browser.close());
	}
};

export const fetchNDTVData = async requestObj => {
	let browser = null;

	try {
		browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});

		const page = await browser.newPage();

		page.setDefaultNavigationTimeout(0);

		await page.setUserAgent(
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
		);

		await page.goto(`https://www.ndtv.com/search?searchtext=${requestObj.topic}`, {
			waitUntil: ["domcontentloaded", "networkidle2"],
		});

		const newsResultsDivs = await page.$$(".src_lst-li");

		const newsRaw = newsResultsDivs.map(async result => {
			const getJSONText = async (selectorStr, el) =>
				await (await (await el.$(selectorStr)).getProperty("textContent")).jsonValue();

			const headline = await getJSONText(".src_itm-ttl a", result);
			const metadata = await getJSONText(".src_itm-stx", result);
			const summary = await getJSONText(".src_itm-txt", result);

			const articleLink = await result.$eval(".src_itm-ttl > a[href]", el =>
				el.getAttribute("href")
			);

			const [category, publisher, publishedDate] = metadata.split(" | ");

			return {
				source: "NDTV",
				category: category.trim() ?? "",
				headline: headline.trim(),
				summary: summary.trim(),
				publisher: publisher?.trim() ?? "",
				publishedDate: publishedDate?.trim() ?? "",
				articleLink,
			};
		});

		const news = await Promise.all(newsRaw);
		return news;
	} catch (error) {
		console.error(`Error: ${error.message}`);
		throw error;
	} finally {
		browser !== null && (await browser.close());
	}
};

export const fetchCNBCData = async requestObj => {
	let browser = null;

	try {
		browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});

		const page = await browser.newPage();

		page.setDefaultNavigationTimeout(0);

		await page.setUserAgent(
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
		);

		await page.goto(`https://www.cnbc.com/search/?query=${requestObj.topic}`, {
			waitUntil: ["domcontentloaded", "networkidle2"],
		});

		const newsResultsDivs = await page.$$(
			".SearchResult-searchResult.SearchResult-standardVariant"
		);

		const newsRaw = newsResultsDivs.map(async result => {
			const getJSONText = async (selectorStr, el) =>
				await (await (await el.$(selectorStr)).getProperty("textContent")).jsonValue();

			const category = await getJSONText(".SearchResult-searchResultEyebrow", result);
			const headline = await getJSONText(".Card-title", result);
			const summary = await getJSONText(".SearchResult-searchResultPreview", result);
			const metadata = await getJSONText(".SearchResult-byline", result);
			const publishedDate = await getJSONText(".SearchResult-publishedDate", result);
			const articleLink = await result.$eval("a[href]", el => el.getAttribute("href"));

			return {
				source: "CNBC",
				category: category.trim(),
				headline: headline.trim(),
				summary: summary.trim(),
				publisher: metadata.trim().split("  ")[0].trim(),
				publishedDate: publishedDate.trim(),
				articleLink,
			};
		});

		const news = await Promise.all(newsRaw);
		return news;
	} catch (error) {
		console.error(`Error: ${error.message}`);
		throw error;
	} finally {
		browser !== null && (await browser.close());
	}
};

export const fetchGNewsData = async requestObj => {
	let browser = null;

	try {
		browser = await puppeteer.launch({
			headless: true,
			args: ["--no-sandbox", "--disable-setuid-sandbox"],
		});

		const page = await browser.newPage();

		page.setDefaultNavigationTimeout(0);

		await page.setUserAgent(
			"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36"
		);

		await page.goto(`https://news.google.com/search?q=${requestObj.topic}`, {
			waitUntil: ["domcontentloaded", "networkidle2"],
		});

		const newsResultsDivs = await page.$$("c-wiz.PO9Zff.Ccj79.kUVvS");

		const newsRaw = newsResultsDivs.map(async result => {
			const getJSONText = async (selectorStr, el) =>
				await (await (await el.$(selectorStr)).getProperty("textContent")).jsonValue();

			const headline = await getJSONText("a.JtKRv", result);
			const articleLink = await result.$eval("a.JtKRv", el => el.getAttribute("href"));

			return {
				source: "GNews",
				headline: headline.trim(),
				articleLink,
			};
		});

		const news = await Promise.all(newsRaw);
		return news;
	} catch (error) {
		console.error(`Error: ${error.message}`);
		throw error;
	} finally {
		browser !== null && (await browser.close());
	}
};
