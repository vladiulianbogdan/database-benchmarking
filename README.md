# Unveiling Database Performance: Selecting the Right Solution for Your Serverless Application

[![deployed with: genezio](https://img.shields.io/badge/deployed_with-genezio-6742c1.svg?labelColor=62C353&style=flat)](https://github.com/genez-io/genezio)

This is the code that was used to do the experiments from the article "Unveiling Database Performance: Selecting the Right Solution for Your Serverless Application".

## How can I reproduce the results?

First of all, you need the following accounts in order to deploy the databases:

* [A Firebase account](https://support.google.com/appsheet/answer/10104995?hl=en)
* [An Atlas MongoDB account](https://genez.io/blog/how-to-add-a-mongodb-to-your-genezio-project/)
* [An AWS Account](https://docs.aws.amazon.com/accounts/latest/reference/manage-acct-creating.html)

Once you have, these you need to do the following steps:

1. In Firebase Dashboard, create a Firestore database and get a `firestore.json` file. Place it in the `server/` folder.
2. In the Atlas MongoDB, create a Cluster and a Database and populate the field `MONGO_DB_URI` in the `.env` file from the `server/` folder. Moreover, activate the Atlas Data API and populate the fields `MONGO_DB_DATA_API_URI` and `MONGO_DB_DATA_API_KEY`.
3. After you generate an AWS account, generate a pair of `ACCESS_KEY_ID` and `SECRET_ACCESS_KEY` and login in the CLI with your AWS Account (check [this](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) for more information). In the end, you should have the key and secret in the `~/.aws/credentials` file. Also, populate the `MY_AWS_ACCESS_KEY_ID` and `MY_AWS_SECRET_ACCESS_KEY` variables from the `.env` file from the `server/` folder.
4. Now you are ready to run `genezio deploy` from the `server/` folder which will deploy the application.
5. Run `npm install` in the client/
6. Run `node build/index.js" and wait for the results.

If you encounter any problem, submit an issue and I am happy to help.
