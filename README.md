<h1 align="center">Bedrock Translate</h1>

This project is created for translating markdown files, I only tested for translating AWS workshops. More features will be added soon. Feel free to send a feature request here.


# Pre-request
* Node 20

# How to use
### Translate Single File
```
npx bedrock-translate --file ./content/clean-up/index.en.md -l spanish -lc es
npx bedrock-translate --file ./content/clean-up/index.en.md -l simplified chinese -lc zh
```

### Translate Entire Directory
```
npx bedrock-translate --dir ./content -l spanish -lc es
npx bedrock-translate --dir ./content -l spanish -l simplified chinese -lc zh
```

# Options
```
.option('-d, --dir <directory>', 'Directory containing files to translate')
.option('-f, --file <filePath>', 'single file translation')
.option('-lc, --languageCode <languageCode>', 'language code for file extension')
.option('-l, --language <language>', 'language for the prompt')
```
