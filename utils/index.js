import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

export function convertJsonToCsv(jsonObject, csvFilePath, fields) {
	const csvWriter = createObjectCsvWriter({
		path: csvFilePath,
		header: fields.map(field => ({ id: field, title: field })),
	});

	return csvWriter
		.writeRecords(jsonObject.news)
		.then(() => console.log("CSV file has been written successfully"))
		.catch(err => console.error("Error writing CSV file:", err));
}

export function saveJsonToFile(jsonObject, filePath) {
	const jsonData = JSON.stringify(jsonObject, null, 2);

	fs.writeFileSync(filePath, jsonData, "utf8");

	console.log(`JSON data has been saved to ${filePath}`);
}
