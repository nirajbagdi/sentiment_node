import express from "express";

import { fetchNDTVData, fetchTOIData, fetchCNBCData, fetchGNewsData } from "./utils/scraper.js";
import convertJsonToCsv from "./utils/jsonToCSV.js";

const PORT = process.env.PORT || 3000;
const app = express();

app.get("/api", (request, response) => {
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
	const fields = ["source", "headline", "publishedDate", "summary", "articleLink"];

	convertJsonToCsv(jsonData, csvFilePath, fields);
	response.json(jsonData);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
