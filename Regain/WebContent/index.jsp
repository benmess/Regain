<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
	pageEncoding="ISO-8859-1"%>
<%@include file="regain_home_header.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Regain Home</title>
</head>
<script>

$(document).ready(GetUserRoles('PreparePage'));

function  PreparePage()
{
	DisableHomeMenus();
}

function HelloWorld_callBack(r, soapResp)
{
    alert(r);
}

function TestWBS()
{
	var url = GetWebServiceRoot() + "WbsFile";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();
	var parameters = new SOAPClientParameters();
	parameters.add("sSessionId",sSessionId);		        
 	parameters.add("sUserId",sUser);		        
 	parameters.add("iWebApp",GetWepAppId());		        
 	parameters.add("iId",535178);		        
 	parameters.add("sFilename",'120TD265 - REV 2.pdf');		        
	SOAPClient.invoke(url,"download_WindchillFile",parameters,true,TestWBSCallback);
}

function TestWBSCallback(sResult)
{
    if(sResult.length > 0)
    {
        window.open(sResult);
    }
    else
    {
        alert('Cannot retrieve file'); 
    }
// closeModal();   
}

function TestWBS2()
{
	var url = GetWebServiceRoot() + "WbsTesting";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();
	var parameters = new SOAPClientParameters();
/* 	parameters.add("sSessionId",sSessionId);		        
 	parameters.add("sUserId",sUser);		        
 	parameters.add("iWebApp",GetWepAppId());
*/
 	parameters.add("sDocNo","120TD101");		        
 	parameters.add("sAttachmentFile",'C:/WebRoot/Regain/temp/BenTest.pdf');		        
 	parameters.add("bSecondary",false);		        
 	SOAPClient.invoke(url,"testing2",parameters,true,TestWBSCallback2);
}

function TestWBSCallback2(sResult)
{
    alert(sResult); 
}


function TestRest()
{
	var sURL = GetWebServiceRestRoot() +  'hello2'; 

	/* $(document).ready
	(
		function() 
		{ */
		    $.ajax
		    (
		    	{
	        		url: sURL,
	        		contentType: "text/xml; charset=utf-8",
	        		success: function(response){RestResponse(response);}
	        	}
		    );
/* 		}
	);
 */
 }

function RestResponse(data)
{
	alert(data);
}

</script>
<body>
	<div style="width: 1000px">
		<table id="tableX" style="table-layout: fixed;">
<!--			<tr id="rowY">
				<td style="width: 100px;"><input type="button" id="btnTest"
					value="Test" onclick="TestWBS2();"></td>
			</tr>
 			<tr>
				<td class="hdrTextColor fronClrDark grdfont grdfont12 grdfontBold"
					style="width: 100px;"><label>Project Id</label></td>
				<td class="hdrTextColor fronClrDark grdfont grdfont12 grdfontBold"
					style="width: 200px;"><label>Description</label></td>
			</tr>
			<tr>
				<td><a id="linkProj" href="javascript:void(0)" target="_blank"
					class="PIMSFont PIMSFont8 PIMSFontBold"
					onclick="OpenProjectIndex(this);">ProjA</a></td>
				<td><label class="grdfont grdfont10">Test Project for
						Development</label></td>
			</tr>
 -->		</table>
	</div>
</body>
</html>