#!/usr/bin/env node

import {program} from 'commander';
import {Translation} from "./service/Translation";
import * as fs from "fs";
// import { translateDirectory } from './translate';

program
  .name('bedrock-translate')
  .version('1.0.0')
  .description('Translate files in a directory using Amazon Bedrock')
  .option('-d, --dir <directory>', 'Directory containing files to translate')
  .option('-f, --file <filePath>', 'single file translation')
  .option('-lc, --languageCode <languageCode>', 'language code for file extension')
  .option('-l, --language <language>', 'language for the prompt')
  .option('-p, --promptFilePath <promptFilePath>', 'Extra prompt for translation')
  .action(async (options) => {
    if (!options.dir && !options.file) {
      console.error('Please provide a directory using the --dir option.');
      process.exit(1);
    }

    if (!options.languageCode || !options.language) {
      console.error('Please provide a target language and languageCode');
      process.exit(1);
    }

    let prompt = '';
    if (options.promptFilePath) {
      prompt += fs.readFileSync(options.promptFilePath, 'utf-8');
    }

    try {
      if (options.file) {
        let translation = new Translation(options.languageCode, options.language, prompt)
        // Single File Translate
        const inputDir = options.file;
        await translation.simplifiedTranslateFile(inputDir);
        return;
      } else if (options.dir) {
        let translation = new Translation(options.languageCode, options.language, prompt)
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
