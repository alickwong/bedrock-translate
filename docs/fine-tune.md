# Fine Tune Translation
## Init

Using the following command:
```
// Simplified Chinese
br-translate init --targetLanguageCode zh
```

This would create a sample configuration folder called 'bedrock-translate-config'
```
➜ tree                            
.
└── zh // each translation should have their own translation
    ├── extraPrompt.txt  // This is for extra prompt
    └── reference // This is articles for LLM to reference before translation start
```

## Translate with extra prompt
You may edit the `extraPrompt.txt` file, these text will be added into the translation prompt. Here are some examples you may use:
```
    - "support case" should be translate to "支持工单"
    - "origination identity" should be translate to "来源身份"
```

Now you can translate with extra prompt using this command:
```
br-translate start --file ../content/sms-v2-components/all-together/index.en.md \
                            --targetLanguageCode es \
                            --promptFilePath bedrock-translate-config/zh/extraPrompt.txt
```

## Translate with reference article
```
br-translate start --file ../content/sms-v2-components/all-together/index.en.md \
                            --targetLanguageCode es \
                            --referenceFilePath bedrock-translate-config/zh/reference
```

## All Together
Reference file and extra prompt can be used together for improving the accuracy.

```
br-translate start --file ../content/sms-v2-components/all-together/index.en.md \
                            --targetLanguageCode es \
                            --promptFilePath bedrock-translate-config/zh/extraPrompt.txt \
                            --referenceFilePath bedrock-translate-config/zh/reference
```
