#!/usr/bin/env node

import {program} from 'commander';
import {BedrockTranslate} from "./service/BedrockTranslate";
import * as path from "node:path";
import * as fs from "fs";
import { countryLanguageMapping } from "./service/CountryCodeMapping";

program
  .name('br-translate')
  .version("0.1.5");

program
  .command('init')
  .description('Setup fine-tuning configuration files')
  .option('-tlc, --targetLanguageCode <targetLanguageCode>', 'language code for file extension')
  .action(async (options) => {
    console.log('Initializing Bedrock Translate CLI');

    const configDir = path.join(process.cwd(), 'bedrock-translate-config');
    const languageDir = path.join(configDir, options.targetLanguageCode || 'zh');
    const referenceDir = path.join(languageDir, 'reference');

    // Create bedrock-translate-config directory
    fs.mkdirSync(configDir, { recursive: true });

    // Create language directory
    fs.mkdirSync(languageDir, { recursive: true });

    // Create reference directory
    fs.mkdirSync(referenceDir, { recursive: true });

    // Create extraPrompt.txt file
    const extraPromptFilePath = path.join(languageDir, 'extraPrompt.txt');
    const extraPromptContent = '- the word "SMS" should translate into "短訊"';
    fs.writeFileSync(extraPromptFilePath, extraPromptContent);

    console.log('Configuration files created successfully.');
  });

program
  .command('start')
  .description('Translate files in a directory using Amazon Bedrock!')
  .option('-d, --dir <directory>', 'Directory containing files to translate')
  .option('-f, --file <filePath>', 'single file translation')
  .option('-tlc, --targetLanguageCode <targetLanguageCode>', 'Target language you need')
  .option('-p, --promptFilePath <promptFilePath>', '[Optional] Extra prompt for translation')
  .option('-r, --referenceFilePath <referenceFilePath>', '[Optional] Sample translations you want the LLM to read before translation')
  .option('-slc, --sourceLanguageCode <sourceLanguageCode>', '[Optional] The language you choose to translate from')
  .action(async (options) => {
    if (!options.dir && !options.file) {
      console.error('Please provide a directory using the --dir option.');
      process.exit(1);
    }

    if (!options.targetLanguageCode) {
      console.error('Please provide a target language.');
      process.exit(1);
    }

    // Obtaining the country code based on the language name
    const normalizedTargetLanguageCode = options.targetLanguageCode.toLowerCase().replace(/\s+/g, '');
    const language = countryLanguageMapping[normalizedTargetLanguageCode];
    if (!language) {
      console.error('Invalid country code provided. Please provide a valid country code.');
      process.exit(1);
    }

    let translation = new BedrockTranslate(normalizedTargetLanguageCode, language);

    if (options.sourceLanguageCode) {
      const normalizedSourceLanguageCode = options.sourceLanguageCode.toLowerCase().replace(/\s+/g, '');
      translation.setLanguageSource(normalizedSourceLanguageCode);
    }

    if (options.promptFilePath) {
      translation.setExtraPromptPath(options.promptFilePath)
    }

    if (options.referenceFilePath) {
      translation.setReferencePath(options.referenceFilePath)
    }

    try {
      if (options.file) {
        // Single File Translate
        await translation.simplifiedTranslateFile(options.file);
      } else if (options.dir) {
        // Directory Translate
        await translation.translateDirectory(options.dir);
      }

      console.log(`Successfully translated ${translation.getTranslationCount()} files.`);
    } catch (error) {
      console.error('Error during translation:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);