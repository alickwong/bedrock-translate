---
title : "Workshop summary & where to go next"
weight : 90
---

In this workshop you have been introduced to Amazon Pinpoint's SMS & Voice V2 API and learned the basics of SMS. Through a series of hands-on exercises using the AWS CLI and the V2 APIs, you set up Pinpoint SMS components, sent test SMS message, enabled and reviewed CloudWatch logs. You deployed an SMS retry mechanism and used CloudFormation to deploy a pre-built solution to stream, store and query SMS events.

To get started with SMS, you will need to know in advance in which countries you are planning to send SMS to and what is the estimated [throughput](https://docs.aws.amazon.com/sms-voice/latest/userguide/sms-limitations-mps.html). Use these data points to [idenitfy the originating identity](https://docs.aws.amazon.com/pinpoint/latest/userguide/channels-sms-countries.html) that meets your requirements and plan some time ahead especially if some countries require registration. Find below a list of recommended steps for setting up successfully your SMS program with Amazon Pinpoint:

1. Request [short codes](https://docs.aws.amazon.com/sms-voice/latest/userguide/phone-numbers-request-short-code.html), [long codes](https://docs.aws.amazon.com/sms-voice/latest/userguide/phone-numbers-long-code.html), [Sender IDs](https://docs.aws.amazon.com/sms-voice/latest/userguide/sender-id-request.html) and complete registration where applicable. To find more about registrations click [here](https://docs.aws.amazon.com/sms-voice/latest/userguide/registrations.html).
2. [Move Amazon Pinpoint SMS to production](https://docs.aws.amazon.com/sms-voice/latest/userguide/sandbox.html#sandbox-sms-move-to-production)
3. [Request SMS spend limit increase](https://docs.aws.amazon.com/sms-voice/latest/userguide/awssupport-spend-threshold.html). The monthly SMS spending quota determines how much money you can spend sending SMS messages through Amazon Pinpoint each month. When Amazon Pinpoint determines that sending an SMS message would incur a cost that exceeds your spending quota for the current month, it stops publishing SMS messages within minutes.
4. Setup the SMS components required for your use case as shown in [Lab 1](/lab1-sms-setup) including pools, opt-out lists, configuration sets and event destinations.
5. Use Amazon Pinpoint's [SMS simulator](https://docs.aws.amazon.com/sms-voice/latest/userguide/test-phone-numbers.html) to test your application's throughput and logic of handling SMS events.
6. Use Amazon Pinpoint's [Phone number validate](https://docs.aws.amazon.com/pinpoint/latest/developerguide/validate-phone-numbers.html) service to determine if a phone is valid, and to obtain additional information about the phone number itself. This can help you reduce cost by filtering out landlines or invalid numbers.
7. If you are expecting spikes in your SMS traffic, consider [queuing Amazon Pinpoint calls](https://aws.amazon.com/blogs/messaging-and-targeting/queueing-amazon-pinpoint-api-calls-to-distribute-sms-spikes/). Amazon Pinpoint SMS & Voice V2 API won't queue messages that exceed the allocated message parts per second for a country, thus your application should read Amazon Pinpoint's API responses and accordingly wait or queue the messages.
8. Follow [SMS best practices](https://docs.aws.amazon.com/sms-voice/latest/userguide/best-practices.html).



