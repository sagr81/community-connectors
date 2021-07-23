# DDL Access to BigQuery for Data Studio

*This is not an official Google product*

This [Data Studio] [Community Connector] lets users start DDL commands to BigQuery. With that an insert statement can be used to add data to BigQuery tables. Yes, you can use Data Studio as an input mask!


## Set up the Community Connector for personal use

To use this Community Connector in Data Studio there is a one-time setup to
deploy your own personal instance of the connector using Apps Script. The
connector also requires additional setup in Spotify to configure OAuth.

### 1. Deploy the connector

Follow the [deployment guide] to deploy the Community Connector.

Make a note of the Script ID for the connector, you'll need it for the next
step.

- To find your Script ID, Visit [Apps Script], then click on
  **File** -> **Project Properties**, and you'll see the id under the **Info**
  tab.



## Using the connector in Data Studio

Once you've set up and deployed the connector, follow the
[Use a Community Connector] guide to use the connector in Data Studio.

**Note**: After using the connector in Data Studio, it needs full access to BigQuery.

## Troubleshooting

### This app isn't verified

When authorizing the community connector, if you are presented with an
"unverified" warning screen see [This app isn't verified] for details on how to
proceed.

## Examples and use cases covered in the connector



[Data Studio]: https://datastudio.google.com
[Community Connector]: https://developers.google.com/datastudio/connector
[screenshot]: ./Spotify.png?raw=true
[deployment guide]: ../deploy.md

[deployment guide]: ../deploy.md
[Apps Script]: https://script.google.com
[Use a Community Connector]: https://developers.google.com/datastudio/connector/use
[revoke access]: https://support.google.com/datastudio/answer/9053467
[connector list]: https://datastudio.google.com/c/datasources/create
[creating a new data source]: https://support.google.com/datastudio/answer/6300774
[This app isn't verified]: ../verification.md
