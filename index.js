import express from 'express';
import methodOverride from 'method-override';
import { readJsonToObject, writeObjectToJson } from './fileStorage.js';

const PORT = 3004;
const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/sighting', (req, res) => {
  res.render('sighting');
});

app.post('/sighting', (req, res) => {
  readJsonToObject('data.json', (jsonObj) => {
    const sightingArr = jsonObj.sightings;
    sightingArr.push(req.body);

    writeObjectToJson('data.json', jsonObj);
  });
  res.render('sighting');
});

app.get('/sighting/:index', (req, res) => {
  console.log(req.params);
  readJsonToObject('data.json', (jsonObj) => {
    const sightingArr = jsonObj.sightings;
    const ufoSight = sightingArr[req.params.index];
    console.log(ufoSight.posted);
    res.render('sighting-index', ufoSight);
  });
});

app.get('/', (req, res) => {
  readJsonToObject('data.json', (jsonObj) => {
    res.render('root', jsonObj);
  });
});

app.get('/sighting/:index/edit', (req, res) => {
  res.render('sighting-index-edit', req.params);
});

app.put('/sighting/:index/edit', (req, res) => {
  const { index } = req.params;
  readJsonToObject('data.json', (jsonObj) => {
    jsonObj.sightings[index] = req.body;
    writeObjectToJson('data.json', jsonObj);
    console.log(jsonObj);
  });
  res.render('sighting-index-edit', req.params);
});

app.delete('/sighting/:index/delete', (req, res) => {
  const { index } = req.params;
  readJsonToObject('data.json', (jsonObj) => {
    const sightingArr = jsonObj.sightings;
    sightingArr.splice(index, 1);
    writeObjectToJson('data.json', jsonObj);
    res.render('root', jsonObj);
  });
});

app.get('/shapes', (req, res) => {
  readJsonToObject('data.json', (jsonObj) => {
    const sightingArr = jsonObj.sightings;
    const shapeArr = [];
    sightingArr.forEach((sight) => {
      if (sight.shape) {
        shapeArr.push(sight.shape);
      }
    });
    const uniqueShapes = { shapes: [...new Set(shapeArr)] };
    console.log(uniqueShapes);
    res.render('shape', uniqueShapes);
  });
});

app.get('/shapes/:shape', (req, res) => {
  const { shape } = req.params;
  readJsonToObject('data.json', (jsonObj) => {
    const sightingArr = jsonObj.sightings;
    const sameShapes = [];
    sightingArr.forEach((sight) => {
      if (sight.shape && shape === sight.shape.toLowerCase()) {
        sight.index = sightingArr.indexOf(sight);
        sameShapes.push(sight);
      }
    });
    const sameShapeObj = { sameShape: sameShapes };
    const dataObj = { ...sameShapeObj, ...req.params };
    res.render('shapes-shape', dataObj);
  });
});

app.get('/sort', (req, res) => {
  // incomplete sort method
  console.log(req.query);
  readJsonToObject('data.json', (jsonObj) => {
    const copyObj = { ...jsonObj };
    const sightingArr = copyObj.sightings;
    sightingArr.sort((a, b) => a.date_time < b.date_time);
    res.render('root', copyObj);
  });
});

app.listen(PORT);
