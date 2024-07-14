<h1 align="center">Bedrock Translate</h1>


<div align="center">
	<a href="https://github.com/alickwong/bedrock-translate/actions?workflow=CI" style="text-decoration:none">
		<img src="https://github.com/github/docs/actions/workflows/main.yml/badge.svg">
	</a>
	<a href="https://badge.fury.io/js/bedrock-translate" style="text-decoration:none">
	    <img src="https://badge.fury.io/js/bedrock-translate.svg" alt="npm version" height="18">
    </a>
     <a href="https://packagephobia.now.sh/result?p=bedrock-translate" style="text-decoration:none">
        <img src="https://packagephobia.now.sh/badge?p=bedrock-translate@latest" alt="npm version" height="18">
    </a>
    <a href="./LICENSE" style="text-decoration:none">
		<img src="https://img.shields.io/badge/license-MIT-blue.svg">
	</a>

  <br>
  <br>
</div>

This project is created for translating markdown files, I only tested for translating AWS workshops. More features will
be added soon. Feel free to send a feature request here.

## Pre-request

* Node 20
* AWS credential

## How to use

### Translate Single File

```
npx bedrock-translate --file ../content/sms-v2-components/all-together/index.en.md  -l 'simplified chinese' -lc zh -p ./test/prompt_zh.txt
npx bedrock-translate --file ../content/sms-v2-components/all-together/index.en.md -l spanish -lc es
```

### Translate with extra prompt

You may add like this, if helps you to translate special terms. Just save these prompt save a txt file and use `-p` to
use it

```
    - "support case" should be translate to "支持工单"
    - "origination identity" should be translate to "来源身份"
```

### Translate Entire Directory

```
npx bedrock-translate --dir ./content -l spanish -lc es
npx bedrock-translate --dir ./content -l spanish -l simplified chinese -lc zh
```

## Options

```
.option('-d, --dir <directory>', 'Directory containing files to translate')
.option('-f, --file <filePath>', 'single file translation')
.option('-lc, --languageCode <languageCode>', 'language code for file extension')
.option('-l, --language <language>', 'language for the prompt')
```

## Roadmap

- [ ] Support translating file name with different name pattern
- [x] Let llm read an article before translating for improving translation accuracy
