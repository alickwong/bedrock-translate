<div align="center">
    
# Bedrock Translate

[![npm version](https://badge.fury.io/js/br-translate.svg)](https://badge.fury.io/js/br-translate)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://makeapullrequest.com)
[![install size](https://packagephobia.com/badge?p=br-translate)](https://packagephobia.com/result?p=br-translate)

</div>

This project is created for translating markdown files, I only tested for translating AWS workshops. More features will
be added soon. Feel free to send a feature request here.

## 🔥 Roadmap
- [ ] Support translating file name with different name pattern
- [ ] Support using different LLM models
- [x] Let llm read an article before translating for improving translation accuracy
- [x] Fine tune the translation using few shot learning prompt
- [x] Add support for 


## 👋 Getting Started

### Prerequisites

* **Node 20**: Install Node.js 20 [Download Node.js](https://nodejs.org/en/download/package-manager/current)
* **AWS credential**: [Install the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html), [set up the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-quickstart.html), enable the Anthropic Haiku & Sonnet models from the AWS console and attach an IAM policy to invoke these Amazon Bedrock models (bedrock:InvokeModelWithResponseStream).

### How to install
```
npm install -g br-translate
```

## 🧑‍💻 How to use

### Languages supported
```
"en": "english",
"es": "spanish",
"ja": "japanese",
"fr": "french",
"ko": "korean",
"pt": "portuguese",
"de": "german",
"it": "italian",
"zh": "chinese (simplified)",
"zh-TW": "chinese (traditional)",
"uk": "ukrainian",
"pl": "polish",
"id": "indonesian",
"nl": "dutch",
"ar": "arabic"
```

### Translate Single File

```
// Simplified Chinese
br-translate start --file content/sms-v2-components/all-together/index.en.md  \
                            --targetLanguageCode zh

// Spanish
br-translate start --file content/sms-v2-components/all-together/index.en.md \
                            --targetLanguageCode es
```

### Translate Entire Directory
```
// Spanish
br-translate start --dir ./content/clean-up --targetLanguageCode es
     
// Simplified Chinese
br-translate start --dir ./content --targetLanguageCode zh 
```

## 🔧 Fine Tuning
If you would like to improve the translation, this package also flexible to add extra prompt and few shot learning. You may follow [this guide](../docs/fine-tune.md) for more details.


## ⚙️ Options
```
Options:
  -d, --dir <directory>                            Directory containing files to translate
  -f, --file <filePath>                            single file translation
  -tlc, --targetLanguageCode <targetLanguageCode>  Target language you need
  -p, --promptFilePath <promptFilePath>            [Optional] Extra prompt for translation
  -r, --referenceFilePath <referenceFilePath>      [Optional] Sample translations you want the LLM to read before translation
  -slc, --sourceLanguageCode <sourceLanguageCode>  [Optional] The language you choose to translate from
  -h, --help   
```

## 🤝 Contributors
Alick Wong<br/>
Pavlos Ioannou Katidis<br/>
Rex Law



