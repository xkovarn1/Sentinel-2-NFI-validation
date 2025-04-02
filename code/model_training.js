// Load administrative boundary layers
var layers = ee.FeatureCollection("FAO/GAUL/2015/level2");
var region = layers.filter(ee.Filter.eq('ADM2_NAME', 'Brno-mesto')).geometry();

Map.addLayer(region, {}, 'Region of Interest');

// Load Sentinel-2 imagery
var rawImage = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterBounds(region)
  .filterDate('2023-01-01', '2023-12-30')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
  .median();

// Apply scaling factor for reflectance conversion
var scaleFactor = 0.0001;
var scaledImage = rawImage.multiply(scaleFactor);

// Compute vegetation and water indices
var ndvi = scaledImage.normalizedDifference(['B8', 'B4']).rename('NDVI'); // (NIR - Red) / (NIR + Red)
var ndwi = scaledImage.normalizedDifference(['B3', 'B8']).rename('NDWI'); // (Green - NIR) / (Green + NIR)
var ndbi = scaledImage.normalizedDifference(['B11', 'B8']).rename('NDBI'); // (SWIR - NIR) / (SWIR + NIR)

// Add computed indices to the image
scaledImage = scaledImage.addBands(ndvi).addBands(ndwi).addBands(ndbi);

// Visualization parameters for true-color imagery
var visParamsTrue = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 0.3,
  gamma: 1.1
};

Map.addLayer(scaledImage.clip(region), visParamsTrue, 'Sentinel-2 True Color');
Map.centerObject(region, 8);

// Load training data (use training_data.csv or your own training data)
var training = crop.merge(forest).merge(urban).merge(water); // Merge all training points
var label = 'Class';
var bands = ['B2', 'B3', 'B4', 'B8', 'B11', 'B12', 'NDVI']; // Bands for classification
var input = scaledImage.select(bands);

// Sample training points from the image
var trainImage = input.sampleRegions({
  collection: training,
  properties: [label],
  scale: 10
});

// Split data into training and validation sets
var trainingData = trainImage.randomColumn();
var trainSet = trainingData.filter(ee.Filter.lessThan('random', 0.7));
var testSet = trainingData.filter(ee.Filter.greaterThanOrEquals('random', 0.7));

// Train a classifier (Random Forest)
var classifier = ee.Classifier.smileRandomForest({numberOfTrees: 100, seed: 0})
  .train(trainSet, label, bands);

// Classify the image
var classified = input.classify(classifier);

// Define land cover classification palette
var landcoverPalette = [
  'efff40', // Crop (0)
  '1c7618', // Forest (1)
  'cc0808', // Urban (2)
  '0d04ff', // Water (3)
];

Map.addLayer(classified.clip(region), {palette: landcoverPalette, min: 0, max: 3}, 'Land Cover Classification');

// Accuracy assessment using confusion matrix
var confusionMatrix = ee.ConfusionMatrix(testSet.classify(classifier)
  .errorMatrix({
    actual: 'Class',
    predicted: 'classification'
  }));

print('Confusion Matrix', confusionMatrix);
print('Overall Accuracy', confusionMatrix.accuracy());

// Compute class area in square kilometers
var all_class_area = ee.Image.pixelArea().addBands(classified).divide(1e6)
  .reduceRegion({
    reducer: ee.Reducer.sum().group(1),
    geometry: region,
    scale: 10,
    bestEffort: true
  });

print('Class Areas (km²)', all_class_area);

// Classification metrics
print('F-score', confusionMatrix.fscore());
print('Kappa Coefficient', confusionMatrix.kappa());
print('Consumer Accuracy', confusionMatrix.consumersAccuracy());
print('Producer Accuracy', confusionMatrix.producersAccuracy());

// Print classifier details
print('Classifier Details:', classifier.explain());

// Export the trained model to Assets
// Export.classifier.toAsset(classifier);
