/*
CODE TO RUN ALL TASKS FROM CONSOLE
function runTaskList(){
    var tasklist = document.getElementsByClassName('task local type-EXPORT_IMAGE awaiting-user-config');
    for (var i = 0; i < tasklist.length; i++)
            tasklist[i].getElementsByClassName('run-button')[0].click();
}

function confirmAll() {
    var ok = document.getElementsByClassName('goog-buttonset-default goog-buttonset-action');
    for (var i = 0; i < ok.length; i++)
        ok[i].click();
}

runTaskList();
confirmAll();
*/
///////////////////////////////////////////////////
var countries = ee.FeatureCollection('USDOS/LSIB_SIMPLE/2017');
/*
var congo = ee.Feature(
  countries
    .filter(ee.Filter.eq('country_na', 'Rep of the Congo'))
    .first()
);
print(congo)
var protectedAreas = ee.FeatureCollection('WCMC/WDPA/current/polygons')
  .filter(ee.Filter.and(
    ee.Filter.bounds(congo.geometry()),
    ee.Filter.neq('IUCN_CAT', 'VI'),
    ee.Filter.neq('STATUS', 'proposed'),
    ee.Filter.lt('STATUS_YR', 2014
    )
    //ee.Filter.eq('ORIG_NAME','Virunga')
  ))
  .map(function(feat){
    return congo.intersection(feat);
  });
print(protectedAreas)
//area=protectedAreas
*/
var congo = countries.filter(ee.Filter.eq('country_na', 'Rwanda'));

var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_8DAY_NDVI')
                  .filterDate('2014-01-01', '2019-12-31')
                  .filterBounds(congo);

var colorized = dataset.select('NDVI');
var colorizedVis = {
  min: -0.0,
  max: 1.0,
  palette: [
    'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
    '66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
    '012E01', '011D01', '011301'
  ],
};
//print(colorized.size())
var meanDictionary = colorized.median().reduceRegion({
  reducer: ee.Reducer.count(),
  geometry: congo,
  scale: 30,
  maxPixels: 1e9
});


//print(meanDictionary);
Map.setCenter (29.565878,-1.421922, 9);
Map.addLayer(colorized.median(), colorizedVis, 'Colorized');
var months = ee.List.sequence(1, 12);

//var img = dataset.filter(ee.Filter.calendarRange(2013,2015,'year'))
//.filter(ee.Filter.calendarRange(1,2,'month'));
print(dataset.size())
/*
var collectYear = ee.ImageCollection(months
  .map(function(y) {
    var start = ee.Date.fromYMD(2014, 1, 1)
    var end = start.advance(12, 'month');
    return dataset.filterDate(start, end).reduce(ee.Reducer.median())

}))
print(collectYear)

https://www.linkedin.com/pulse/time-series-landsat-data-google-earth-engine-andrew-cutts/
Export.image.toDrive({
  image: colorized.median(),
  description: 'imageToDriveExample',
  folder: 'climate',
  scale: 1000,
  region: congo
});
*/

var batch = require('users/fitoprincipe/geetools:batch')
batch.Download.ImageCollection.toDrive(colorized, 'climate',
                {scale: 1000,
                 region: congo,
                 type: 'float'})
