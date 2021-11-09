import { readFile, writeFile } from 'fs';

export const readJsonToObject = (fileName, callback) => {
  readFile(fileName, 'utf-8', (err, data) => {
    if (err) throw err;
    const jsonObj = JSON.parse(data);
    callback(jsonObj);
  });
};

export const writeObjectToJson = (fileName, jsonObj) => {
  const jsonStr = JSON.stringify(jsonObj);
  writeFile(fileName, jsonStr, 'utf-8', (err) => {
    if (err) throw err;
    console.log('The file has been saved!');
  });
};