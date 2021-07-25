
function showerror(){

cc.newUserError()
  .setText("This is the debug error text.")
  .setDebugText("This text is only shown to admins.")
  .throwException();


}


// [START get_config]
function getConfig(request) {
  var configParams = request.configParams;
  var isFirstRequest = configParams === undefined;
  if(!configParams)configParams={};
  var config = cc.getConfig();

  var tmpcols_help='check field "cols input", please';
  var tmpcols=SGlist2JSON(configParams.DBQcol,tmpcols_help);
  var tmpparam_help='check field "params input", please';
  var tmpparam=SGlist2JSON(configParams.DBQparam,tmpparam_help);

 // console.error(request,isFirstRequest)

  config
    .newInfo()
    .setId('instructions')
    .setText(
      'Enter the project id not the name. Get it in the cloud shell by "gcloud projects list".'
    );

  config
    .newTextInput()
    .setId('DBQprojectid')
    .setName('Enter a single project id')
    .setHelpText('...')
    .setPlaceholder('your-project-id')


  config.newTextArea()
    .setId('DBQquery')
    .setName('Enter a query. Parameters start with @ and need a space after.')
    .setPlaceholder('insert `decent-stacker-214916.Test.out` VALUES (@num ,@str) ')

  config.newCheckbox()
    .setId('DBQqueryrun')
    .setName('Check to run Biq Query')
    .setAllowOverride(true);
    
  
  config.newTextArea()
    .setId('DBQcol')
    .setName('Enter all columns and defaults '+ (tmpcols.help===tmpcols_help ? 'NOT VALID !!!' : '' ))
    .setPlaceholder('num:1,str:"a" ')
    .setIsDynamic(true)
  
  if(tmpcols.help!=tmpcols_help){
  config.newTextArea()
    .setId('DBQparam')
    .setName('Enter all params and defaults (current: only strings allowed) '+ (tmpparam.help===tmpparam_help ? 'NOT VALID !!!' : '' ))
    .setPlaceholder('num:"1",str:"a" ')
    .setIsDynamic(true)
  

  if(tmpparam.help!==tmpparam_help){
  config
    .newTextInput()
    .setId('DBQok')
    .setName('Enter displayed message for ok')
    .setHelpText('...')
    .setPlaceholder('data is saved')
    .setAllowOverride(true);

  config
    .newTextInput()
    .setId('DBQnok')
    .setName('Enter displayed message for not ok')
    .setHelpText('...')
    .setPlaceholder('ERROR: nothing saved')
    .setAllowOverride(true);

  config
    .newTextArea()
    .setId('DBQif')
    .setName('If eval(true) start query, otherwise not.')
    .setHelpText('...')
    .setPlaceholder('true')
    .setAllowOverride(true);

  }
  }

  config.setDateRangeRequired(true);

    if (isFirstRequest || tmpcols.help===tmpcols_help || tmpparam.help===tmpparam_help) {
    config.setIsSteppedConfig(true);
  } else {

  
    for(x in tmpparam) {
      var data=null;
      switch(typeof(tmpparam[x])){
        case 'string':data=config.newTextInput().setPlaceholder(tmpparam[x]);break;
        case 'number':data=config.newTextInput().setPlaceholder(tmpparam[x]);break;
        case 'boolean':data=config.newCheckbox();break;
        default: data=config.newTextInput();
      }
    data
      .setId(x)
      .setName(x)
      .setHelpText('set the checkmark to be edited')
      .setAllowOverride(true);

    }

  }

  var out=config.build();

  return out;
}
// [END get_config]
