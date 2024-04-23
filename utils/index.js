import fs from "fs";
import translate from "@iamtraction/google-translate";
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

export async function backTranslateText(text) {
	const translatedText = await translate(text, { from: "en", to: "hi" });
	const backTranslatedText = await translate(translatedText.text, { from: "hi", to: "en" });
	return backTranslatedText.text;
}
