/**
 * Image Processor Module
 * 
 * Processes and optimizes images from WordPress source directory
 * Requirements: 2.1, 2.2, 2.5, 4.3
 */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

/**
 * Process all images from source directory
 * @param {string} sourcePath - Source directory path (e.g., /Volumes/KINGSTON/sebanaservizi.it)
 * @param {string} targetPath - Target directory path for processed images
 * @returns {Promise<ProcessingResult>} Processing results
 */
async function processImages(sourcePath, targetPath) {
  const result = {
    processed: [],
    failed: [],
    warnings: []
  };

  // Validate source path exists
  if (!fs.existsSync(sourcePath)) {
    result.warnings.push(`Source path does not exist: ${sourcePath}`);
    return result;
  }

  // Create target directory structure
  const subdirs = ['team', 'services', 'icons'];
  for (const subdir of subdirs) {
    const subdirPath = path.join(targetPath, subdir);
    if (!fs.existsSync(subdirPath)) {
      fs.mkdirSync(subdirPath, { recursive: true });
    }
  }

  // Find all image files in source directory
  const imageFiles = await findImageFiles(sourcePath);

  // Process each image
  for (const imageFile of imageFiles) {
    try {
      // Validate image integrity before processing
      const isValid = await validateImageIntegrity(imageFile);
      if (!isValid) {
        result.failed.push(imageFile);
        result.warnings.push(`Image is corrupted or invalid: ${imageFile}`);
        console.warn(`[IMAGE PROCESSOR] Warning: Image is corrupted or invalid: ${imageFile}`);
        continue;
      }

      const processed = await processImage(imageFile, sourcePath, targetPath);
      result.processed.push(processed.originalPath);
      console.log(`[IMAGE PROCESSOR] Successfully processed: ${imageFile}`);
    } catch (error) {
      result.failed.push(imageFile);
      result.warnings.push(`Failed to process image ${imageFile}: ${error.message}`);
      console.warn(`[IMAGE PROCESSOR] Warning: Failed to process image ${imageFile}: ${error.message}`);
      // Continue processing remaining images
    }
  }

  // Log summary
  console.log(`[IMAGE PROCESSOR] Processing complete: ${result.processed.length} succeeded, ${result.failed.length} failed`);
  if (result.warnings.length > 0) {
    console.log(`[IMAGE PROCESSOR] Total warnings: ${result.warnings.length}`);
  }

  return result;
}

/**
 * Find all image files in directory (only main folder, excluding subdirectories)
 * @param {string} dirPath - Directory path to search
 * @returns {Promise<string[]>} Array of image file paths
 */
async function findImageFiles(dirPath) {
  const imageExtensions = ['.jpg', '.jpeg', '.png'];
  const imageFiles = [];
  const excludedSubdirs = ['firmati'];

  if (!fs.existsSync(dirPath)) {
    return imageFiles;
  }

  // Only scan the main directory, not subdirectories
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    // Skip excluded subdirectories
    if (entry.isDirectory() && excludedSubdirs.includes(entry.name.toLowerCase())) {
      console.log(`[IMAGE PROCESSOR] Skipping excluded directory: ${entry.name}`);
      continue;
    }

    // Only process files in the main directory (not subdirectories)
    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (imageExtensions.includes(ext)) {
        imageFiles.push(fullPath);
      }
    }
  }

  return imageFiles;
}

/**
 * Process a single image: optimize and generate WebP version
 * @param {string} imagePath - Path to source image
 * @param {string} sourcePath - Base source directory
 * @param {string} targetPath - Base target directory
 * @returns {Promise<OptimizedImage>} Processing result
 */
async function processImage(imagePath, sourcePath, targetPath) {
  // Check if image file exists
  if (!fs.existsSync(imagePath)) {
    throw new Error(`Image file not found: ${imagePath}`);
  }

  // Determine target subdirectory based on filename or path
  const relativePath = path.relative(sourcePath, imagePath);
  const filename = path.basename(imagePath);
  const ext = path.extname(filename);
  const basename = path.basename(filename, ext);

  // Categorize image into subdirectory
  let targetSubdir = '';
  if (filename.toLowerCase().includes('team') || relativePath.toLowerCase().includes('team')) {
    targetSubdir = 'team';
  } else if (filename.toLowerCase().includes('service') || relativePath.toLowerCase().includes('service')) {
    targetSubdir = 'services';
  } else if (filename.toLowerCase().includes('icon') || relativePath.toLowerCase().includes('icon')) {
    targetSubdir = 'icons';
  }

  const targetDir = targetSubdir ? path.join(targetPath, targetSubdir) : targetPath;
  const targetFile = path.join(targetDir, filename);
  const webpFile = path.join(targetDir, `${basename}.webp`);

  // Get original file size
  let originalStats;
  try {
    originalStats = fs.statSync(imagePath);
  } catch (error) {
    throw new Error(`Cannot read image file ${imagePath}: ${error.message}`);
  }
  const originalSize = originalStats.size;

  // Optimize image based on format
  let optimizedSize = originalSize;
  try {
    if (ext.toLowerCase() === '.jpg' || ext.toLowerCase() === '.jpeg') {
      await optimizeJPEG(imagePath, targetFile);
      optimizedSize = fs.statSync(targetFile).size;
    } else if (ext.toLowerCase() === '.png') {
      await optimizePNG(imagePath, targetFile);
      optimizedSize = fs.statSync(targetFile).size;
    } else {
      // For other formats, just copy
      fs.copyFileSync(imagePath, targetFile);
    }
  } catch (error) {
    throw new Error(`Failed to optimize image ${imagePath}: ${error.message}`);
  }

  // Generate WebP version for JPEG and PNG
  if (ext.toLowerCase() === '.jpg' || ext.toLowerCase() === '.jpeg' || ext.toLowerCase() === '.png') {
    try {
      await generateWebP(imagePath, webpFile);
    } catch (error) {
      console.warn(`[IMAGE PROCESSOR] Warning: Failed to generate WebP for ${imagePath}: ${error.message}`);
      // Continue without WebP version
    }
  }

  return {
    originalPath: imagePath,
    optimizedPath: targetFile,
    webpPath: webpFile,
    originalSize,
    optimizedSize
  };
}

/**
 * Optimize JPEG image
 * @param {string} inputPath - Input image path
 * @param {string} outputPath - Output image path
 * @returns {Promise<void>}
 */
async function optimizeJPEG(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .jpeg({
        quality: 85,
        progressive: true,
        mozjpeg: true
      })
      .toFile(outputPath);
  } catch (error) {
    throw new Error(`JPEG optimization failed for ${inputPath}: ${error.message}`);
  }
}

/**
 * Optimize PNG image
 * @param {string} inputPath - Input image path
 * @param {string} outputPath - Output image path
 * @returns {Promise<void>}
 */
async function optimizePNG(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .png({
        quality: 85,
        compressionLevel: 9,
        adaptiveFiltering: true
      })
      .toFile(outputPath);
  } catch (error) {
    throw new Error(`PNG optimization failed for ${inputPath}: ${error.message}`);
  }
}

/**
 * Generate WebP version of image
 * @param {string} inputPath - Input image path
 * @param {string} outputPath - Output WebP path
 * @returns {Promise<void>}
 */
async function generateWebP(inputPath, outputPath) {
  try {
    await sharp(inputPath)
      .webp({
        quality: 85,
        effort: 6
      })
      .toFile(outputPath);
  } catch (error) {
    throw new Error(`WebP generation failed for ${inputPath}: ${error.message}`);
  }
}

/**
 * Validate image integrity
 * @param {string} imagePath - Path to image file
 * @returns {Promise<boolean>} True if image is valid
 */
async function validateImageIntegrity(imagePath) {
  try {
    const metadata = await sharp(imagePath).metadata();
    return metadata.width > 0 && metadata.height > 0;
  } catch (error) {
    return false;
  }
}

module.exports = {
  processImages,
  processImage,
  optimizeJPEG,
  optimizePNG,
  generateWebP,
  validateImageIntegrity,
  findImageFiles
};
