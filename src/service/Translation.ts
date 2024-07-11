import {FileManager} from "./FileManager";
import {ModelId} from "../enum/ModelId";
import {BedRock} from "./BedRock";
import * as fs from "fs";
import * as path from "path";

export class Translation {
  private bedrock: BedRock;
  private targetLanguage: string;
  constructor() {
    this.bedrock = new BedRock();
    this.targetLanguage = 'zh';
  }
  getPrompt(chunk: string, previousTranslation: string) {
    // console.log('prompt', chunk);
    // If add two \n in this code `${chunk}\nAssistant:`, all result will have one more line
    const prompt = `\n\nHuman: 
    Translate the following the text in a markdown file to simplified Chinese, Follow these requirements:
    - For any technical terms or proper nouns, please keep them in the original English. This includes but is not limited to names of technologies, protocols, software, APIs, and technical concepts.
    - Always reply like this: "Your translation is: </translation>"
    - Do not try to change/ fix the markdown symbol.
    - Ensuring a formal tone and using industry-specific terms
    - Do not add extra information, such as extra titles, only need to translate
    - Please keep the format of markdown, do not remove padding space or tabs
    - Do not translate the text inside \`\` symbol
    - "support case" should be translate to "支持工单"
    - "origination identity" should be translate to "来源身份"
    - should use "，" instead of ",", "：" instead of ","
    - if you know it is a bolded text, do not add space inside "**", please add a space after "**" in markdown
    Here is the text need to be translated:<text>${chunk}</text>\nAssistant:`;


    // - Here is the previous translation <previousTranslation>${previousTranslation}</previousTranslation>, if there is no information changed, try to keep the text same as previous translation

    return prompt;
  }

  getPromptForTitle(chunk: string, previousTranslation: string) {
    // console.log('prompt', chunk);
    // If add two \n in this code `${chunk}\nAssistant:`, all result will have one more line
    const prompt = `\n\nHuman: 
    Translate the following the text in a markdown file to simplified Chinese, Follow these requirements:
    - Only translate "title" and "weight" value, not "title" and "weight" itself
    - Only translate the text inside ""
    - the weight is a number, do not add "" to it
    - For any technical terms or proper nouns, please keep them in the original English. This includes but is not limited to names of technologies, protocols, software, APIs, and technical concepts.
    - Always reply like this: "Your translation is: </translation>"
    - Do not try to change/ fix the markdown symbol.
    - Ensuring a formal tone and using industry-specific terms
    - Do not add extra information, such as extra titles, only need to translate
    - Please keep the format of markdown, do not remove padding space or tabs
    Here is the text need to be translated:<text>${chunk}</text>\nAssistant:`;


    // - Here is the previous translation <previousTranslation>${previousTranslation}</previousTranslation>, if there is no information changed, try to keep the text same as previous translation

    return prompt;
  }

  async simplifiedTranslateFile(filePath: string) {
    console.log(`start translating ${filePath}`);
    let englishText = '';
    // englishText += getNote();
    englishText += fs.readFileSync(filePath, 'utf-8');

    // Split the englishText into an array of lines
    const lines = englishText.split('\n');

    // Remove the first four lines from the englishText
    const remainingText = lines.slice(4).join('\n');


    let promptForTitle = this.getPromptForTitle(lines.slice(0, 4).join('\n'), '');
    let translatedTitle = await this.bedrock.bedrockStreamingApi(promptForTitle, ModelId.claude3Haiku);
    let promptForContent = this.getPrompt(remainingText, '');
    let translatedText = await this.bedrock.bedrockStreamingApi(promptForContent, ModelId.claude3Sonnet);
    console.log(translatedTitle, translatedText);
    if (translatedText) {
      let nameArr = path.basename(filePath).split('.');
      const outputPath = path.join(path.dirname(filePath), nameArr[0] + '.' + this.targetLanguage + '.' + nameArr[2]);
      fs.writeFileSync(outputPath, translatedTitle + "\n" + translatedText);
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