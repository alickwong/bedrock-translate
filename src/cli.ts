#!/usr/bin/env node

import {program} from 'commander';
import {BedrockTranslate} from "./service/BedrockTranslate";

program
  .name('bedrock-translate')
  .version("0.1.4")
  .description('Translate files in a directory using Amazon Bedrock')
  .option('-d, --dir <directory>', 'Directory containing files to translate')
  .option('-f, --file <filePath>', 'single file translation')
  .option('-lc, --languageCode <languageCode>', 'language code for file extension')
  .option('-l, --language <language>', 'language for the prompt')
  .option('-p, --promptFilePath <promptFilePath>', 'Extra prompt for translation')
  .option('-r, --referenceFilePath <referenceFilePath>', 'Sample translations you want the LLM to read before translation')
  .action(async (options) => {
    if (!options.dir && !options.file) {
      console.error('Please provide a directory using the --dir option.');
      process.exit(1);
    }

    if (!options.languageCode || !options.language) {
      console.error('Please provide a target language and languageCode');
      process.exit(1);
    }

    try {
      if (options.file) {
        let translation = new BedrockTranslate(options.languageCode, options.language)
        if (options.promptFilePath) {
          translation.setExtraPromptPath(options.promptFilePath)
        }

        if (options.referenceFilePath) {
          translation.setReferencePath(options.referenceFilePath)
        }

        // Single File Translate
        const inputDir = options.file;
        await translation.simplifiedTranslateFile(inputDir);
        return;
      } else if (options.dir) {
        let translation = new BedrockTranslate(options.languageCode, options.language)
        const inputDir = options.dir;
        await translation.translateDirectory(inputDir);
      }

      // await translateDirectory(options.dir);
      console.log('Translation completed successfully.');
    } catch (error) {
      console.error('Error during translation:', error);
      process.exit(1);
    }
  });

program.parse(process.argv);
