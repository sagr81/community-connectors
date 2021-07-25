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


## Explaination of the Inputs during setup
### Enter a single project id
Please enter here your project id for which the Big Query will be run
### Enter a query. Parameters start with @ and need a space after.
Here any DDL statement can be used. For the use case of making Data Studio to in input mask for Big Query Tables, following is a good start:
```insert `dataset.tablename` VALUES (@numer1 , @string1 )```
The @-sign indicates a parameter or column.  Besides the date in ```@DS_END_DATE``` and ```@DS_START_DATE```, each parameter or column has to be defined in the following. 
### Check to run Biq Query
It is recommended to not set that checkmark here, but to allow it to be modified in reports. With that setting, the writing to Big Query can be easily turned on and off in the visualization itself. 
### Enter all columns and defaults
The dataset does not connect to a table, thus there is the need to enter the column names manually. Each column name is followed by a colon and a default value. Numbers are entered directly, string need to be insides of ```"quotes"```.  A column can be used to write the E-Mail of the user into the table, for that the filter by email has to be activated. Columns come in handy when you drop-down list is wanted. First connect the input table with a normal BigQuery Data source and add a drop-down list to the dashboard. In this DDL BigQuery connector enter in this column input the exact name as in the table. Data Studio sends you the selection of the a drop-down list from data source to the other. With that trick, it is possible to gain access to the user selection of data studio filters and use that information as input and write it back to the input table.  
### Enter all params and defaults (current: only strings allowed)
Enter all needed parameters. As in the above, the parameter name is followed by a colon and a default value, which has to be as string in ```"quotes"```.  So the user can input any string, however quotes are removed from the input. Should the string parsed for whole numbers, enter them in qutotes “5”, with the default value, also if the parsing fails. For floats please enter a value with a decimal point in quotes. If defalut is an empty string or contains a space, the input will not be parsed as a number.
Be aware that after the click of the next button all parameters will be listed underneath and must be allowed to be modified in the reports.
### Enter displayed message for ok
Please enter here the output, which should be shown in the field ```!!!done```, if data is written successfull to BigQuery (DDL has no error) or would be if the checkmark to  run Big Query would be set. 
### Enter displayed message for nok 
The output, if there was an error or the following is not true.
### If eval(true) start query, otherwise not.
Only if this field is true and the checkmark “run Big Query” is set, the DDL query will be started.
With this input a validation of the input data can be done, please provide the statement as Java Script. A text output will be shown in the field ```!!!done``` and no DDL statement started. This can be used to give a more detailed error massage. Each field can be accessed by ```@name```, the amount of each parameter/column allocations is counted in @name.length . To assure that only one value is selected in a drop-down-list, use 
```@name.length==1```

For determine the length of string use ```(@comment).length```
A complete code may look like this:
```
@name.length==1  && (@comment).length> 4 || @name.length==1  ? “please enter a longer text for the comment”: “please select exactly on value in above name drop-down”
```

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
