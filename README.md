# Sentinel-2 Machine Learning with Google Earth Engine (GEE)

## Overview
This repository contains code and training data for a machine learning (ML) analysis on Sentinel-2 satellite imagery using Google Earth Engine (GEE). The project leverages Sentinel-2 data for classification/regression tasks and utilizes ML models trained within the GEE environment.

## Repository Structure
```
Sentinel2-ML-GEE/
│-- code/                 # Contains Google Earth Engine scripts (.js or .py)
│   │-- sentinel2_analysis.js  # Main GEE script for analysis
│   │-- utils.js               # Helper functions (if any)
│-- training_data/         # CSV files with training datasets
│   │-- training_data.csv  # Training data used for ML model
│-- README.md             # Project documentation
```

## Requirements
To run the scripts in this repository, you need:
- A Google Earth Engine account ([Sign up here](https://earthengine.google.com/))
- Basic knowledge of JavaScript
- A web browser with access to the GEE Code Editor ([GEE Code Editor](https://code.earthengine.google.com/))

## How to Use
### 1. Load the Code in GEE
1. Open the [Google Earth Engine Code Editor](https://code.earthengine.google.com/).
2. Copy the contents of `sentinel2_analysis.js` (or `.py`) from the `code/` folder.
3. Paste it into a new script in GEE.
4. Modify parameters (if needed) and run the script.

### 2. Upload Training Data
1. Navigate to the **Assets** tab in GEE.
2. Upload the CSV file (`training_data.csv`) from the `training_data/` folder.
3. Ensure the CSV contains properly formatted coordinates and features.
4. Update the script to reference the uploaded asset.

### 3. Train and Apply the Model
- The script will train an ML model using the provided training dataset.
- It will then classify or predict values over the selected region.
- Results can be visualized in the GEE map viewer or exported.

## Data Details
- **Sentinel-2 Imagery**: Optical satellite data from the Sentinel-2 mission.
- **Training Data (`training_data.csv`)**: Includes labeled data points for model training.
- **Features Used**: Spectral bands, vegetation indices, and additional calculated parameters.

## Citation
If you use this repository in your research, please cite it appropriately:
```
Author Name, "Sentinel-2 Machine Learning with Google Earth Engine", GitHub Repository, Year.
```

## License
This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contact
For any questions or contributions, feel free to open an issue or contact me at [your.email@example.com].

