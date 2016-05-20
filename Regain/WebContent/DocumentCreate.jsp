<%@ page language="java" contentType="text/html; charset=ISO-8859-1"
    pageEncoding="ISO-8859-1"%>
<%@include file="regain_design_header.jsp"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1">
<title>Document Modify</title>
</head>
<script type="text/javascript" src="Shared/Document.js"></script>
<script src="jquery.ajaxfileupload.js"></script>

<body>
	<div id="divDocRetrieval"  style="width: 1000px;height: 270px">
	</div>
	</br>
	<div id="divDocDetails"  style="width: 1000px;height: 400px">
	</div>
	</br>
	<div id="divFuncLocs"  style="width: 1000px;">
	</div>
	</br>
	<div id="divDocAttachments" class="bgOffGold grdDataDivBorders" style="width: 677px;height:300px;display: none; z-index: 1000;">
		<table id="tableDocAttachmentOuterHdr" style="table-layout: fixed; width: 635px">
			<tr>
				<td style="width: 620px" align="center"><label
					class="grdfont grdfont18 grdfontBold grdRowTextAligCenter">DOCUMENT ATTACHMENTS</label></td>
			</tr>
		</table>
		<table id="tableDocAttachmentOuter" style="table-layout: fixed; width: 620px">
			<tr>
				<td style="width: 150px" align="center" class="grdfont grdfont10 grdfontBold grdRowTextAligLeft"><label>Add Attachment</label></td>
				
				<td align="left" style="width: 320px" >
					<input id="hfDocNumber" type="hidden"> 
					<input type="file" name="fleAttachment" id="fleAttachment" style="width: 318px"/>
				</td>
				<td  style="width: 100px" rowspan="3">
					<input id="uploaddocbutton" name="uploaddocbutton" type="submit" value="Upload" />
				</td>
			</tr>
			<tr>
				<td style="width: 150px" align="center" class="grdfont grdfont10 grdfontBold grdRowTextAligLeft"><label>Attachment Description</label></td>
				
				<td align="left" style="width: 320px" >
					<input id="txtAttachDesc" type="text" title="Add a description for the attachment to be uploaded" style="width: 318px"/>
				</td>
			</tr>
			<tr>
				<td style="width: 150px" align="center" class="grdfont grdfont10 grdfontBold grdRowTextAligLeft"><label>Attachment Comments</label></td>
				
				<td align="left" style="width: 320px" >
					<input id="txtAttachComments" type="text" title="Add some comments for the attachment to be uploaded" style="width: 318px"/>
				</td>
			</tr>
		</table>
		<div id="upload2" style="display: none;">Uploading..</div>
	</div>

	<div id="fade"></div>
	<div id="modal">
		<img id="loader" src="images/loading.gif" />
	</div>

</body>

<script>
var gsProjectId = "";

$(document).ready(GetUserRoles('PreparePage'));
gsCurrentPage = "Create or Update";	


function PreparePage()
{
	DisableDesignMenus();
	OpenDocCreatePage();
	AddAttachmentListener2();
	
	/* $('#txtDocPartSearch').keypress(function(e){
	      if(e.keyCode==13)
	      $('#btnDocsSearch').click();
	    }); */
}

function Get_ReadOnly_Flag()
{
	return 0;	
}
</script>
</html>