/**
 * 
 */

function LoginForgottenPass()
{
	var url = GetWebServiceRoot() + "WbsFile";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();
    var sSearchCriteria = GetObjectValue('DocSearchCriteria');
    var chkHistoric = GetObjectValue('chkHistoric');
    if(sSearchCriteria != '')
    {
		var parameters = new SOAPClientParameters();
		openModal();
		parameters.add("sSessionId",sSessionId);		        
	 	parameters.add("sUserId",sUser);		        
	 	parameters.add("iWebApp",GetWepAppId());		        
	 	parameters.add("sSearchCriteria",sSearchCriteria);		        
	 	parameters.add("bHistoric",chkHistoric);		        
		SOAPClient.invoke(url,"search_WindchillFiles",parameters,true,DocSearchSucc);
   	}
    else
	{
    	alert('You must provide at least something to search');
	}
}
