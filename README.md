# Sentinel-2 Machine Learning with Google Earth Engine (GEE)

## Overview
This repository contains code and training data for a machine learning (ML) analysis on Sentinel-2 satellite imagery using Google Earth Engine (GEE). The project leverages Sentinel-2 data for classification/regression tasks and utilizes ML models trained within the GEE environment.

## Repository Structure
```
Sentinel2-ML-GEE/
│-- code/                 # Contains Google Earth Engine scripts
│   │-- sentinel2_analysis.js  # Script to train ML models
│   │-- sentinel2_analysis2.js # Script to calculate forest areas
│-- training_data/         # CSV files with training datasets used in the study
│   │-- training_data.csv  # Training data used for ML model
│-- README.md
```

## Requirements
To run the scripts in this repository, you need:
- A Google Earth Engine account
- Basic knowledge of JavaScript
- A web browser with access to the GEE Code Editor

## How to Use
### 1. Load the Code in GEE
1. Open the Google Earth Engine Code Editor
2. Copy the script from this repository.
3. Paste it into a new script in GEE.
4. Modify parameters for your task and run the script.

### 2. Upload Training Data
1. Navigate to the **Assets** tab in GEE.
2. Upload your training data.
3. Update the script to reference the uploaded asset.

### 3. Train and Apply the Model
- The script will train an ML model using the provided training dataset.
- It will then classify or predict values over the selected region.
- Results can be visualized in the GEE map viewer or exported.

## Citation
If you use this repository in your research, please cite it appropriately:
```
Author Name, "Sentinel-2 Machine Learning with Google Earth Engine", GitHub Repository, Year.
```
