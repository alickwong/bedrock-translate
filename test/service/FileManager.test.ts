import {FileManager} from "../../src/service/FileManager";

jest.setTimeout(1000000000);

test('Directory Translate Files', async () => {
  let fileManager = new FileManager()
  let result_1 = fileManager.addLanguageCode('test.md', 'en');
  // expect result_1 is equal to test.en.md
  expect(result_1).toEqual('test.en.md');

  // test case 2
  let result_2 = fileManager.addLanguageCode('test.middle.json', 'zh');
  expect(result_2).toEqual('test.middle.zh.json');
});

