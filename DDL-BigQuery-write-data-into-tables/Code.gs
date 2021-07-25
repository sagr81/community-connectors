function getAuthType() { // no external auth. needed
  var response = {
    type: 'NONE'
  };
    return response; // Access to user BigQuery is given in the manifest
}

function isAdminUser() { // every one gets to see detailed error information
  return true;
}

// connect to Data Studio:
var cc = DataStudioApp.createCommunityConnector();


// the SG* functions are in other file

// [START get_schema]
function getFields(request) {
  var fields = cc.getFields();
  var types = cc.FieldType;
  var aggregations = cc.AggregationType;

  fields
    .newDimension()
    .setId('AA___done')
    .setName('!!!done')
    .setType(types.TEXT); // Field for display success massage to user
  
   fields
    .newDimension()
    .setId('AA___filters')
    .setName('!!!filters')
    .setType(types.TEXT); // field to show all fields to user (debug)

     fields
    .newDimension()
    .setId('AA___BQ_query')
    .setName('!!!BQ_query')
    .setType(types.TEXT);// field to show BigQuery query to user (debug)

    fields
    .newDimension()
    .setId('AA___errors')
    .setName('!!!errors')
    .setType(types.TEXT);// field to show field names with wrong syntax

    //console.error(request);

  // generate all columns, the user has created in the config:
  var tmpcols=SGlist2JSON(request.configParams.DBQcol,'col data is wrong, please reconfig data source!');
   for(i in tmpcols){
     if(typeof(tmpcols[i])=='number') {
       fields.newMetric().setId(i).setName(i).setType(types.NUMBER) // field is a text
     } 
     else {
      fields.newDimension().setId(i)
      .setName(i)
      .setType( tmpcols[i].split("-").length !=3 ? types.TEXT : ( tmpcols[i].includes(':') ? types.YEAR_MONTH_DAY_SECOND :types.YEAR_MONTH_DAY) ); // to set to numer or date or timestamp
    // //3
   types.n

     }
   }


  return fields;
}

function getSchema(request) {
  return {schema: getFields(request).build()};
}


// the SG* functions are in other file

// Function to return the data, but executed DDL in BigQuery:
function getData(request) {
  //console.error(JSON.stringify(request)); // for debug only!

  var params={};//request.configParams;

  var tmpparam=SGlist2JSON(request.configParams.DBQparam,'param data is wrong, please reconfig data source!');
    for(i in tmpparam){
      params[i]=tmpparam[i];
      if(i in request.configParams){
        params[i]=request.configParams[i];
      }
    }

  var tmpcols=SGlist2JSON(request.configParams.DBQcol,'col data is wrong, please reconfig data source!');
    for(i in tmpcols){
      params[i]=tmpcols[i];
      params[i+'.length']=0;
    }

  SGaddparams(request.dimensionsFilters,params);
  // add start & end date 
  if(request.dateRange && request.dateRange.endDate) {
    params['DS_END_DATE']=request.dateRange.endDate;
  }
  if(request.dateRange && request.dateRange.startDate) {
    params['DS_START_DATE']=request.dateRange.startDate;
  }


  params.AA___filters=JSON.stringify(params);

  var {txt:BQquery,errors}=SGtxt_fillparam(request.configParams.DBQquery,params,tmpparam);

  params.AA___BQ_query=BQquery;

  var {txt,errors:error2}=SGtxt_fillparam(request.configParams.DBQif,params,tmpparam);
  //console.error(txt)
  try {

  var tmp = eval(txt);
  //console.error('check if:',tmp,typeof(tmp),request.configParams.DBQqueryrun)
  if(typeof(tmp)==typeof('string')) {
    params.AA___done=tmp

  } else
  if(typeof(tmp)==typeof(1>2)){
    if(tmp && request.configParams.DBQqueryrun===true ){
      tmp=SGrunBQ(BQquery,request.configParams.DBQprojectid)
      
    }  
    
    params.AA___done=tmp? request.configParams.DBQok : request.configParams.DBQnok;


  }


  } catch(e) {
  errors.push('if_case');
  params.AA___done='if_case failed';
  }



  params.AA___errors= errors.length==0 ? '' :  JSON.stringify(errors);

  var schemaE = getFields(request).forIds(
    request.fields.map(function(field) {
      return field.name;
    })
  ).build();



  var out1=[];
  schemaE.forEach(a=>out1.push(a.name in params ? params[a.name] : 'nope:'+a.name ));
  var out2=[];
  schemaE.forEach(a=>out2.push(JSON.stringify(a)));

  var out= {
    schema: schemaE,
    rows: [{values:out1}] // ,{values:out2}
    //,  filtersApplied:true
  };


//console.error(out);
  return out;
}


function SGrunBQ(BQquery,projectId) {
  try {
    var request = {
        query: BQquery ,
        "useLegacySql":false
      }; 
    var queryResults = BigQuery.Jobs.query(request, projectId);
    var sleepTimeMs = 500;
    while (!queryResults.jobComplete) {
      Utilities.sleep(sleepTimeMs);
      sleepTimeMs *= 2;
      queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId);
    }
    //console.log('BQ:',queryResults)
    return queryResults;
    } catch(e) {
      console.error('BQ error:',e)
    return false;
  }
}


