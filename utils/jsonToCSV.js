import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

function convertJsonToCsv(jsonObject, csvFilePath, fields) {
	// Create CSV writer
	const csvWriter = createObjectCsvWriter({
		path: csvFilePath,
		header: fields.map(field => ({ id: field, title: field })),
	});

	// Write data to CSV
	return csvWriter
		.writeRecords(jsonObject.news)
		.then(() => console.log("CSV file has been written successfully"))
		.catch(err => console.error("Error writing CSV file:", err));
}

export default convertJsonToCsv;
