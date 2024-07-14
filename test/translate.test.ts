//https://cloudnature.net/blog/amazon-bedrock-for-javascript-and-typescript-developers
// https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-messages.html#claude-messages-supported-models

import {BedrockTranslate} from "../src/service/BedrockTranslate";
import {BedRock} from "../src/service/BedRock";
import {ModelId} from "../src/enum/ModelId";

jest.setTimeout(1000000000);



test('Single File Translate Files', async () => {
  let translation = new BedrockTranslate()
  // Single File Translate
  const inputDir = '../content/sms-v2-components/all-together/index.en.md';
  await translation.simplifiedTranslateFile(inputDir);
});

test('Single File Translate Files with reference', async () => {
  let translation = new BedrockTranslate()
  translation.setReferencePath('test/static/referenceFiles/')
  let data = await translation.getAllReferenceData()
  expect(data).toContain("test1");
  expect(data).toContain("test2");
});

test('Test Extra Prompt Load', async () => {
  let translation = new BedrockTranslate()
  translation.setReferencePath('../bedrock-translate-config/zh/reference');
  translation.setExtraPromptPath('test/static/extraPrompt.txt');
  let data = translation.getExtraPrompt();
  expect(data).toContain('Do NOT change anything');
});

test('Directory Translate Files', async () => {
  let translation = new BedrockTranslate()
  translation.setReferencePath('../bedrock-translate-config/zh/reference');
  translation.setExtraPromptPath('../bedrock-translate-config/zh/extraPrompt.txt');
  const inputDir = '../content';
  await translation.translateDirectory(inputDir);
});

test('Single File Translate Files with reference all-together', async () => {
  let translation = new BedrockTranslate()
  translation.setReferencePath('../bedrock-translate-config/zh/reference');
  translation.setExtraPromptPath('../bedrock-translate-config/zh/extraPrompt.txt');
  // const inputDir = '../content/lab1-sms-setup/1.1-create-pool/index.en.md';
  const inputDir = '../content/lab2-retry-streaming/2.1-sms-retry/index.en.md';
  // const inputDir = '../content/intro-to-sms/2.2-event-streaming-query/index.en.md';
  // const inputDir = '../content/sms-v2-components/originating-identity/index.en.md';
  // const inputDir = '../content/sms-v2-components/opt-out-list/index.en.md';
  // const inputDir = '../content/sms-v2-components/pool/index.en.md';
  // const inputDir = '../content/lab1-sms-setup/1.1-create-pool/index.en.md';
  await translation.simplifiedTranslateFile(inputDir);
});

test('Streaming API Test', async () => {
  let bedrock = new BedRock();
  let result = await bedrock.bedrockStreamingApi('Known limits and service quotas', ModelId.claude3Haiku);
  console.log(result);
});

