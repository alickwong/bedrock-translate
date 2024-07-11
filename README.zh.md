
您应该探索此项目的内容。它演示了一个 CDK 应用程序,其中包含一个堆栈(`TranslateStack`)实例,该实例包含一个订阅了 Amazon SNS 主题的 Amazon SQS 队列。

`cdk.json` 文件告诉 CDK Toolkit 如何执行您的应用程序。

## 有用的命令

* `npm run build`   将 TypeScript 编译为 JavaScript
* `npm run watch`   监视更改并编译
* `npm run test`    执行 jest 单元测试
* `cdk deploy`      将此堆栈部署到您的默认 AWS 帐户/区域
* `cdk diff`        比较已部署的堆栈与当前状态
* `cdk synth`       发出合成的 CloudFormation 模板