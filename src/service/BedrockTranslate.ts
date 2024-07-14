import {FileManager} from "./FileManager";
import {ModelId} from "../enum/ModelId";
import {BedRock} from "./BedRock";
import * as fs from "fs";
import * as path from "path";

export class BedrockTranslate {
  private bedrock: BedRock;
  private languageCode: string;
  private targetLanguage: string;
  private extraPromptPath?: string;
  private referencePath?: string;
  private extraPrompt?: string;

  constructor(languageCode: string = 'zh', targetLanguage: string = 'simplified chinese') {
    this.bedrock = new BedRock();
    this.languageCode = languageCode;
    this.targetLanguage = targetLanguage;
  }

  public setExtraPromptPath(extraPromptPath: string) {
    this.extraPromptPath = extraPromptPath;
    this.loadExtraPrompt();
  }

  public getExtraPrompt() {
    return this.extraPrompt;
  }

  loadExtraPrompt() {
    if (!this.extraPromptPath) {
      return;
    }
    this.extraPrompt = fs.readFileSync(this.extraPromptPath, 'utf-8');
  }

  public setReferencePath(referencePath: string) {
    this.referencePath = referencePath;
  }

  getPrompt(textToBeTranslate: string, referenceData: string = '') {
    // If add two \n in this code `${chunk}\nAssistant:`, all result will have one more line
    let prompt = `\n\nHuman: 
    `;

    if (referenceData) {
      prompt += `<reference>${referenceData}</reference>`;
    }

    prompt += `Translate the following the text in a markdown file to ${this.targetLanguage}, Follow these requirements:
    - For any technical terms or proper nouns, please keep them in the original English. This includes but is not limited to names of technologies, protocols, software, APIs, and technical concepts.
    - Always reply like this: "Your translation is: \n"
    - Do not try to change/ fix the markdown symbol.
    - Ensuring a formal tone and using industry-specific terms
    - Do not add extra information, such as extra titles, only need to translate
    - Please keep the format of markdown, do not remove padding space or tabs
    - Do not translate the text inside \`\` symbol
    ${this.extraPrompt}
    - should use "，" instead of ",", "：" instead of ","
    - if you know it is a bolded text, do not add space inside "**", please add a space after "**" in markdown
    Here is the text need to be translated:<text>${textToBeTranslate}</text>\nAssistant:`;

    // - Here is the previous translation <previousTranslation>${previousTranslation}</previousTranslation>, if there is no information changed, try to keep the text same as previous translation

    return prompt;
  }

  getPromptForTitle(textToBeTranslate: string, referenceData: string = '') {
    // If add two \n in this code `${chunk}\nAssistant:`, all result will have one more line
    let prompt = `\n\nHuman: 
    `;

    // if (referenceData) {
    //   prompt += `<reference>${referenceData}</reference>`;
    // }

    prompt += `Translate the following the text in a markdown file to ${this.targetLanguage}, Follow these requirements:
    - Only translate "title" and "weight" value, not "title" and "weight" itself
    - Only translate the text inside ""
    - the weight is a number, do not add "" to it
    - For any technical terms or proper nouns, please keep them in the original English. This includes but is not limited to names of technologies, protocols, software, APIs, and technical concepts.
    - Always reply like this: "Your translation is: </translation>"
    - Do not try to change/ fix the markdown symbol.
    - Ensuring a formal tone and using industry-specific terms
    - Do not add extra information, such as extra titles, only need to translate
    - Please keep the format of markdown, do not remove padding space or tabs
    ${this.extraPrompt}
    Here is the text need to be translated:<text>${textToBeTranslate}</text>\nAssistant:`;


    // - Here is the previous translation <previousTranslation>${previousTranslation}</previousTranslation>, if there is no information changed, try to keep the text same as previous translation

    return prompt;
  }

  async getAllReferenceData() {
    if (!this.referencePath) {
      return '';
    }
    let fileManager = new FileManager();
    let files = await fileManager.getAllFiles(this.referencePath);

    let referenceData = '';
    for (let file of files) {
      referenceData += "<file>" + fs.readFileSync(file, 'utf-8') + "</file>\n";
    }

    return referenceData;
  }

  async simplifiedTranslateFile(filePath: string) {
    console.log(`start translating ${filePath}`);
    let textToBeTranslate = '';
    // englishText += getNote();
    textToBeTranslate += fs.readFileSync(filePath, 'utf-8');
    console.log('test', textToBeTranslate);

    // Split the englishText into an array of lines
    const lines = textToBeTranslate.split('\n');

    // Sample translated text for improving translation accuracy
    let referenceData = await this.getAllReferenceData();

    let translatedText = '';
    // if it start with markdown header
    if (lines[0].startsWith('---')) {
      // Translate the header separately
      let promptForTitle = this.getPromptForTitle(lines.slice(0, 4).join('\n') + "\n", referenceData);
      translatedText += await this.bedrock.bedrockStreamingApi(promptForTitle, ModelId.claude3Haiku);
      translatedText += "\n";

      // Translate the body
      const remainingText = lines.slice(4).join('\n');
      let promptForContent = this.getPrompt(remainingText, referenceData);
      translatedText += await this.bedrock.bedrockStreamingApi(promptForContent, ModelId.claude3Sonnet);
    }else {
      // Translate entire file directly
      let prompt= this.getPrompt(textToBeTranslate, referenceData);
      translatedText += await this.bedrock.bedrockStreamingApi(prompt, ModelId.claude3Sonnet);
    }

    // Save into a file
    if (translatedText) {
      let nameArr = path.basename(filePath).split('.');
      let fileName = '';
      if (nameArr.length <= 2) {
        // If the filename do not have a language code, than insert directly
        let fileManager = new FileManager();
        fileName = fileManager.addLanguageCode(path.basename(filePath), this.languageCode);
      }else {
        fileName = nameArr[0] + '.' + this.languageCode + '.' + nameArr[2];
      }
      const outputPath = path.join(path.dirname(filePath), fileName);
      fs.writeFileSync(outputPath, translatedText);
      console.log(`Translated ${filePath}`);
    } else {
      console.log(`Translate failed for ${filePath}`);
    }
  }

  async translateDirectory(inputDir: string): Promise<void> {
    let fileManager = new FileManager();
    let files = await fileManager.getAllFiles(inputDir);
    files = files.filter(x => {
      const fileName = path.basename(x);
      const extension = path.extname(fileName);
      const entensionArray = fileName.split('.');

      return extension === '.md' && entensionArray[1] === 'en';
    })

    const batchSize = 5;
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const promises = batch.map(async (file) => {
        await this.simplifiedTranslateFile(file);
      });

      await Promise.all(promises);
    }
  }
}