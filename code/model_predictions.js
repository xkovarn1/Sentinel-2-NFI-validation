// Load shapefile of regions (replace with a publicly accessible asset if needed)
var regions = ee.FeatureCollection('users/your_username/regions');

// Load Sentinel-2 data
var rawImage = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
  .filterDate('2018-06-01', '2018-10-31')
  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 5))
  .median();

// Apply scaling factor to convert digital numbers to TOA reflectance
var scaleFactor = 0.0001;
var scaledImage = rawImage.multiply(scaleFactor);

// Compute vegetation and water indices
var ndvi = scaledImage.normalizedDifference(['B8', 'B4']).rename('NDVI');
var ndwi = scaledImage.normalizedDifference(['B3', 'B8']).rename('NDWI');
var ndbi = scaledImage.normalizedDifference(['B11', 'B8']).rename('NDBI');

// Add indices to the image
scaledImage = scaledImage.addBands([ndvi, ndwi, ndbi]);

// Select relevant bands for classification
var bands = ['B2', 'B3', 'B4', 'B8', 'B11', 'B12', 'NDVI'];
var input = scaledImage.select(bands);

// Load the pre-trained classification model
var classifierAssetId = 'users/your_username/trained_classifier'; // Adjust path (Use the trained model from MODEL_TRAINING)
var classifier = ee.Classifier.load(classifierAssetId);

// Classify the image
var classified = input.classify(classifier);

// Define a land cover classification palette
var landcoverPalette = [
  'efff40', // Crop (0)
  '1c7618', // Forest (1)
  'cc0808', // Urban (2)
  '0d04ff', // Water (3)
];

// Function to calculate class proportions for each region
var calculateClassProportion = function(region) {
  var regionGeometry = region.geometry();
  var classifiedClip = classified.clip(regionGeometry);
  var classAreas = ee.Image.pixelArea().addBands(classifiedClip).divide(1e6) // Convert to km²
    .reduceRegion({
      reducer: ee.Reducer.sum().group(1),
      geometry: regionGeometry,
      scale: 10,
      bestEffort: true
    });
  return region.set('class_areas', classAreas);
};

// Apply class proportion calculation to all regions
var regionsWithClassProportions = regions.map(calculateClassProportion);
print(regionsWithClassProportions);

// Visualization
Map.addLayer(classified.clip(regions), {palette: landcoverPalette, min: 0, max: 3}, 'Classified Regions');
var boundaryStyle = {color: '000000', fillColor: '00000000', width: 2};
Map.addLayer(regions.style(boundaryStyle), {}, 'Region Boundaries');

// Sentinel-2 True Color Visualization
var sentinelVisParams = {
  bands: ['B4', 'B3', 'B2'],
  min: 0,
  max: 0.3,
  gamma: [1.1, 1.1, 1.1]
};
Map.addLayer(scaledImage.clip(regions), sentinelVisParams, 'Sentinel-2 Image');
Map.centerObject(regions, 7);
