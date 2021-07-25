function SGlist2JSON(lst,help='no help available') {
  // exepects an json with quotation around the variable names and returns a valid json list
  try{
    if(lst==null || !lst.includes(':')) return {};
    var jso='{"'+lst.replace(/'/g,'"').replace(/\,\s*/g,',"').replace(/\s*\:/g,'":') +'}';
    //console.log(jso)
    return JSON.parse(jso);

    } 
  catch(e) {
    return {'error':''+e,'help':help,'why':lst} 
    }
}


function SGaddparams(data,out){ 
  // This function searches for set values of fields in the data object
  // since we do not care for "and" / "or" combination of these, we scan the data object recursivly:  
  if(typeof(data)=='object') {
    for(i in data) SGaddparams(data[i],out);
  } 
  if(typeof(data)=='object') {
    if(data.operator=='IN_LIST' && data.type=='EXCLUDE') out[data.fieldName+'.length']=Infinity;
    if(data.operator=="EQUALS" || (data.operator=='IN_LIST' && data.type=='INCLUDE') && data.values.length>0){
      if(!(data.fieldName in out) || out[data.fieldName+'.length']===0 ) {
      out[data.fieldName]=data.values[0];
      out[data.fieldName+'.length']=0;
      }
      out[data.fieldName+'.length']+=data.values.length;
      }
    
  }
}


function SGtxt_fillparam(txt,params,tmpparam,quotes='"'){
  // given an text txt, with parameters named @parm1 @value
  // all parameters are in the object parms and type defintion is in tmpparam
  // this function replaces all parameters @.... with the values
  // for SQL, quotes """ can be used
  var out=txt;
  var errors=[];
  var params_keys=Object.keys(params)
  params_keys.sort(function(a, b){return b.length - a.length;})
  for(var i in params_keys){
    let re= RegExp('@'+params_keys[i], 'g');
    //console.error('REGexp:',params_keys[i],params[params_keys[i]]);
    var pout=params[params_keys[i]];
    // identify number or do for string:
    if(params_keys[i] in tmpparam && tmpparam[params_keys[i]]!='' &&  !isNaN(tmpparam[params_keys[i]]) && !(''+tmpparam[params_keys[i]]).includes(' ')) {
      pout=(''+pout).replace(',','.');
      if(!isNaN(pout)) {
        pout=1*pout;
      } else {
        pout=1*tmpparam[params_keys[i]];
        errors.push(params_keys[i]);
      }
    } 
    if(typeof(pout)==typeof(1) || typeof(pout)==typeof(1.0) ) {
      pout=1*pout;
    } else {
    pout=quotes+(''+pout).replace('"','').replace("'",'')+quotes;
    } 
    out=out.replace(re,pout)
    }

  return {txt:out,errors:errors};
}
