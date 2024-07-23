import * as fs from 'fs';
import * as path from 'path';
import {BedRock} from './BedRock';
import {ModelId} from '../enum/ModelId';

const languageMap: { [key: string]: string } = {
  "en": "en-US",
  "es": "es-US",
  "ja": "ja-JP",
  "fr": "fr-FR",
  "ko": "ko-KR",
  "pt": "pt-BR",
  "de": "de-DE",
  "it": "it-IT",
  "zh": "zh-CN",
  "zh-tw": "zh-TW",
  "uk": "uk-UA",
  "pl": "pl-PL",
  "id": "id-ID",
  "nl": "nl-NL",
  "ar": "ar-AE"
};

export class ContentSpecManager {
  private bedrock: BedRock;
  private languageCode: string;

  constructor(languageCode: string) {
    this.bedrock = new BedRock();
    this.languageCode = languageCode;
  }

  async checkAndProcessContentSpec(dirPath: string) {
    const contentspecPath = path.join(dirPath, 'contentspec.yaml');

    if (fs.existsSync(contentspecPath)) {
      console.log(`Found contentspec.yaml at: ${contentspecPath}`);
      const content = fs.readFileSync(contentspecPath, 'utf-8');
      const prompt = this.createPrompt(content);
      const response = await this.bedrock.bedrockStreamingApi(prompt, ModelId.claude3Haiku);

      if (response) { // Check if response is defined
        fs.writeFileSync(contentspecPath, response);
        const languageValue = languageMap[this.languageCode]
        console.log(`Added ${languageValue} locale to contentspec.yaml `);
      } else {
        console.error(`Failed to get response from Bedrock API`);
      }
    } else {
      console.log(`contentspec.yaml not found in: ${dirPath}`);
    }
  }

  createPrompt(content: string): string {
    const languageValue = languageMap[this.languageCode] || this.languageCode;
    return `Under the localeCodes: add the new locale ${languageValue}. Don't change anything else:
    ${content}
    `;
  }
}