import express from "express";

import { fetchNDTVData, fetchTOIData, fetchCNBCData, fetchGNewsData } from "./utils/scraper.js";
import { convertJsonToCsv, saveJsonToFile, backTranslateText } from "./utils/index.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.get("/api", async (request, response) => {
	response.send("Hello World");
});

app.get("/api/news/:topic", async (request, response) => {
	const requestObj = {
		topic: request.params.topic,
	};

	console.log("Fetching new News.............");
	const toiData = await fetchTOIData(requestObj);
	const ndtvData = await fetchNDTVData(requestObj);
	const cnbcData = await fetchCNBCData(requestObj);
	const gNewsData = await fetchGNewsData(requestObj);

	const mergedNews = [...toiData, ...ndtvData, ...cnbcData, ...gNewsData];

	const jsonData = {
		topic: requestObj.topic,
		length: mergedNews.length,
		news: mergedNews,
	};

	const csvFilePath = "data.csv";
	const jsonFilePath = "data.json";
	const fields = [
		"source",
		"headline",
		"augmentedHeadline",
		"publishedDate",
		"summary",
		"articleLink",
	];

	convertJsonToCsv(jsonData, csvFilePath, fields);
	saveJsonToFile(jsonData, jsonFilePath);

	response.json(jsonData);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
