<h1 align="center">Bedrock Translate</h1>


<div align="center">
	<a href="https://github.com/alickwong/bedrock-translate/actions?workflow=CI">
		<img src="https://github.com/alickwong/bedrock-translate/workflows/CI/badge.svg">
	</a>

[//]: # (    <a href="https://codecov.io/github/alickwong/bedrock-translate?branch=master">)

[//]: # (		<img src="https://img.shields.io/codecov/c/github/alickwong/bedrock-translate.svg?maxAge=2592000">)

[//]: # (	</a>	)

	<a href="https://badge.fury.io/js/bedrock-translate">
	    <img src="https://badge.fury.io/js/bedrock-translate.svg" alt="npm version" height="18">
    </a>
    <a href="https://github.com/alickwong/bedrock-translate">
        <img src="https://david-dm.org/alickwong/bedrock-translate.svg" alt="npm version" height="18">
    </a>
    [![install size](https://packagephobia.com/badge?p=bedrock-translate)](https://packagephobia.com/result?p=bedrock-translate)
    <a href="./LICENSE">
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
