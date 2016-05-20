/**
 For all the building and client side for  WorkRequests 
 */
var gsItemDesc;
var gsCurrentPage = "";
var gsExtra;

var WorkRequests = [];
var Operations = [];
var WorkCategories = [];
var CauseCodes = [];
var EquipmentCodes = [];
var gsWorkRequestCodeCols = [];
var gsOperationCols = [];
var gsWorkCategoryCols = [];
var gsCauseCodeCols = [];
var gsEquipCodeCols = [];
var gsWorkRequestCode = '';
var giAddNewWorkRequest = 0;

var ctlwidth = [];
    ctlwidth[0]=130;
    ctlwidth[1]=225;
    ctlwidth[2]=100;

var ctlwidth2 = [];
    ctlwidth2[0]=130;
    ctlwidth2[1]=225;
    ctlwidth2[2]=100;

var ctlwidth3 = [];
    ctlwidth3[0]=455;

    var calobj2 = null; //For the calendar popup
var cal_format = '%d/%m/%Y %h:%i %a';
    
function GetWorkRequestCodes()
{
    var url = GetWebServiceRoot() + "WbsReliability";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();

    var parameters = new SOAPClientParameters();
	openModal();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
    SOAPClient.invoke(url,"getExistingWorkRequestCodes",parameters,true,WorkRequestCodesDropdown_Populate);
}

function WorkRequestCodesDropdown_Populate(result)
{
	if(result != null)
	{
		if(result != "")
		{
			if(result[0] != null)
			{
			    var sOperations =  result[0].gridstring;
			    var iOperationRows =  result[0].gridrows;
			    var iOperationCols = result[0].gridcols;
			    Operations = ExtractReverseGrid(iOperationRows, sOperations, gsOperationCols,iOperationCols);
			}

			if(result[1] != null)
			{
			    var sWorkRequestCodes =  result[1].gridstring;
			    var iWorkRequestCodeRows =  result[1].gridrows;
			    var iWorkRequestCodeCols = result[1].gridcols;
			    WorkRequests = ExtractReverseGrid(iWorkRequestCodeRows, sWorkRequestCodes, gsWorkRequestCodeCols,iWorkRequestCodeCols);
			}
			
			if(result[2] != null)
			{
			    var sWorkCategories =  result[2].gridstring;
			    var iWorkCategoryRows =  result[2].gridrows;
			    var iWorkCategoryCols = result[2].gridcols;
			    WorkCategories = ExtractReverseGrid(iWorkCategoryRows, sWorkCategories, gsWorkCategoryCols,iWorkCategoryCols);
			}

			if(result[3] != null)
			{
			    var sCauseCodes =  result[3].gridstring;
			    var iCauseCodeRows =  result[3].gridrows;
			    var iCauseCodeCols = result[3].gridcols;
			    CauseCodes = ExtractReverseGrid(iCauseCodeRows, sCauseCodes, gsCauseCodeCols,iCauseCodeCols);
			}
		}
	}
    WorkRequest_Populate(false);	
	closeModal();
}
    
function WorkRequest_BlankPopulate()
{
	GetWorkRequestCodes();
}

function WorkRequest_Populate(bNew)
{
    var iReadOnly = Get_ReadOnly_Flag();

    if(bNew)
    {
        iStatus = 3;
    }
    else
    {
        iStatus = 0;
    }

    var ni2 = document.getElementById('WorkRequestGridDataContainer'); 
    ni2.className='grdDataDivBckGrdColor grdDataDivBorders';
    ni2.style.overflow='auto';


	//First of all create the table
    WorkRequesttable = document.createElement("table");
    WorkRequesttable.setAttribute('cellSpacing','0');
    WorkRequesttable.setAttribute('id', "WorkRequestTable");
    WorkRequesttablebody = document.createElement("tbody");
    WorkRequesttablebody.setAttribute('id', "WorkRequestTableBody");                        
    WorkRequesttable.className = "fixed"; 

    var iTotalWidth = 0; //Take off one lot of padding because between cells is one less than total number of cells
	for(var i=0;i<ctlwidth.length;i++)
	{
		coltag = document.createElement("col");
		SetObjectWidth(coltag, ctlwidth[i]);
		iTotalWidth += ctlwidth[i] + 5;
		WorkRequesttable.appendChild(coltag);
	}

	SetObjectWidth(WorkRequesttable, iTotalWidth);
    
    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft';
    var hiddenrowstatus = CreateFormHiddenField("hfWorkRequestStatus",iStatus);
    cell.appendChild(hiddenrowstatus);
    var hiddenrowstatus = CreateFormHiddenField("hfWorkRequestCode",'-1');
    cell.appendChild(hiddenrowstatus);
    var label = CreateFormLabelField("WorkRequestCodeLbl",'WorkRequest Code');
    SetObjectWidth(label, ctlwidth[0]);
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("WorkRequestCode", iReadOnly);
    SetObjectWidth(cmbbox, ctlwidth[1]-10);
    cmbbox.className='grdfont grdfont10';
    cmbbox.onchange = function(){CheckWorkRequestLock();};
    
    
    if(WorkRequests.length == 0)
	{
    	CreateDropDownBoxOption(cmbbox,0,'No Work Requests','No Work Requests',-2);	
	}
    else
   	{
        CreateDropDownBoxOption(cmbbox,0,'[select]','[select]',-2);
	    for (var x = 0; x < WorkRequests[0].length; x++)
	    {
	        CreateDropDownBoxOption(cmbbox,x+1,WorkRequests[1][x],WorkRequests[1][x],WorkRequests[0][x]);
	    }
   	}
    
    cell.appendChild(cmbbox);
    rRow.appendChild(cell);

    cell = document.createElement("td");
    var btnAdd = CreateFormButtonField("btnAddNew","New Work Request", iReadOnly);
    SetObjectWidth(btnAdd, ctlwidth[2]-10);
    btnAdd.onclick = function(){AddNewWorkRequest();};
    btnAdd.className='grdfont grdfont10 grdRowTextAligCenter';    
    cell.appendChild(btnAdd);
    cell.align = "center";  
    rRow.appendChild(cell);

    WorkRequesttablebody.appendChild(rRow);
    WorkRequesttable.appendChild(WorkRequesttablebody);
    ni2.appendChild(WorkRequesttable);
    
	//Now all of this should be hidden initially
    WorkRequesttable2 = document.createElement("table");
    WorkRequesttable2.setAttribute('cellSpacing','0');
    WorkRequesttable2.setAttribute('id', "WorkRequestTable2");
    WorkRequesttablebody2 = document.createElement("tbody");
    WorkRequesttablebody2.setAttribute('id', "WorkRequestTableBody2");                        
    WorkRequesttable2.className = "fixed"; 
//    WorkRequesttable2.border = 2;
    var iTotalWidth2 = 5; //Take off one lot of padding because between cells is one less than total number of cells
	for(var i=0;i<ctlwidth2.length;i++)
	{
		coltag2 = document.createElement("col");
		SetObjectWidth(coltag2, ctlwidth2[i]);
		iTotalWidth2 += ctlwidth2[i] + 5;
		WorkRequesttable2.appendChild(coltag2);
	}
    SetObjectWidth(WorkRequesttable2, iTotalWidth2);
    WorkRequesttable2.style.visibility = 'hidden';
    
    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft';
    var label = CreateFormLabelField("WorkRequestStatusLbl",'Work Request Status');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("WorkRequestStatus",'');
    cell.appendChild(label);
    rRow.appendChild(cell);

    WorkRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("WorkRequestWorkCategoryLbl",'Work Category');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("WorkRequestWorkCategory", iReadOnly);
    SetObjectWidth(cmbbox, ctlwidth2[1]-10);
    cmbbox.className='grdfont grdfont10';
    cmbbox.onchange = function(){ApplyFilter();};
    
    CreateDropDownBoxOption(cmbbox,0,'[select]','[select]',-2);
    for (var x = 0; x < WorkCategories[0].length; x++)
    {
        CreateDropDownBoxOption(cmbbox,x+1, WorkCategories[1][x],WorkCategories[1][x],WorkCategories[0][x]);
    }
    
    cmbbox.selectedIndex = 0;
    
    cell.appendChild(cmbbox);
    rRow.appendChild(cell);

    WorkRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft';
    var label = CreateFormLabelField("WorkRequestNameLbl",'Work Request Name');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft';
    var txtbox = CreateFormTextField("WorkRequestName",'', iReadOnly);
    SetObjectWidth(txtbox, ctlwidth2[1]-14);
    txtbox.onchange = function(){SetWorkRequestEditStatus(-1);};
    if(iReadOnly == -1)
    {
        txtbox.className ='txtReadonly grdfont grdfont10';    
    }
    else
    {
        txtbox.className ='grdfont grdfont10';    
    }
    cell.appendChild(txtbox);
    rRow.appendChild(cell);

    WorkRequesttablebody2.appendChild(rRow);
    
    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("WorkRequestLongDescriptionLbl",'Long Description');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var txtbox = CreateFormTextAreaField("WorkRequestLongDescription",'', 1, 30, 4, iReadOnly, 1);
    SetObjectWidth(txtbox, ctlwidth2[1]-16);
    txtbox.onchange = function(){SetWorkRequestEditStatus(-1);};
    if(iReadOnly == -1)
    {
        txtbox.className ='txtReadonly grdfont grdfont10';    
    }
    else
    {
        txtbox.className ='grdfont grdfont10';    
    }
    cell.appendChild(txtbox);
    rRow.appendChild(cell);

    WorkRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("WorkRequestDateLbl",'Date and Time');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    var sNow = GetPIMSDateTimeStampMinsAMPM();
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("WorkRequestDate", sNow);
    SetObjectWidth(label, ctlwidth2[1]-10);
    cell.appendChild(label);
    rRow.appendChild(cell);
    

    cell = document.createElement("td");
    var btnFilter = CreateFormButtonField("btnDate","...", iReadOnly);
    SetObjectWidth(btnFilter, ctlwidth2[2]-60);
    btnFilter.onclick = function(){CalendarShow();};
    btnFilter.className='grdfont grdfont10 grdRowTextAligCenter';    
    cell.appendChild(btnFilter);
    cell.align = "center";  
    rRow.appendChild(cell);

    WorkRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("WorkRequestOperationLbl",'Operation');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("WorkRequestOperation", iReadOnly);
    SetObjectWidth(cmbbox, ctlwidth2[1]-10);
    cmbbox.className='grdfont grdfont10';
    cmbbox.onchange = function(){ApplyFilter();};
    
    CreateDropDownBoxOption(cmbbox,0,'[select]','[select]',-2);
    for (var x = 0; x < Operations[0].length; x++)
    {
        CreateDropDownBoxOption(cmbbox,x+1,Operations[0][x] + " " + Operations[1][x],Operations[0][x] + " " + Operations[1][x],Operations[0][x]);
    }
    
    cell.appendChild(cmbbox);
    rRow.appendChild(cell);

    WorkRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("WorkRequestCodeFilterLbl",'Filter');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft';
    var txtbox = CreateFormTextField("WorkRequestCodeFilter",'', iReadOnly);
    SetObjectWidth(txtbox, ctlwidth2[1]-14);
//    txtbox.onchange = function(){SetWorkRequestEditStatus(-1);};
    if(iReadOnly == -1)
    {
        txtbox.className ='txtReadonly grdfont grdfont10';    
    }
    else
    {
        txtbox.className ='grdfont grdfont10';    
    }
    cell.appendChild(txtbox);
    rRow.appendChild(cell);

    cell = document.createElement("td");
    var btnFilter = CreateFormButtonField("btnFilter","...", iReadOnly);
    SetObjectWidth(btnFilter, ctlwidth2[2]-60);
    btnFilter.onclick = function(){ApplyFilter();};
    btnFilter.className='grdfont grdfont10 grdRowTextAligCenter';    
    cell.appendChild(btnFilter);
    cell.align = "center";  
    rRow.appendChild(cell);

    WorkRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("WorkRequestEquipmentCodeLbl",'Equipment');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("WorkRequestEquipmentCode", iReadOnly);
    SetObjectWidth(cmbbox, ctlwidth2[1]-10);
    cmbbox.className='grdfont grdfont10';
    cmbbox.onchange = function(){SetWorkRequestEditStatus(-1);};        
    cell.appendChild(cmbbox);
    rRow.appendChild(cell);

    WorkRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("WorkRequestCauseCodeLbl",'Cause Code');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("WorkRequestCauseCode", iReadOnly);
    SetObjectWidth(cmbbox, ctlwidth2[1]-10);
    cmbbox.className='grdfont grdfont10';
    cmbbox.onchange = function(){ApplyFilter();};
    
    CreateDropDownBoxOption(cmbbox,0,'[select]','[select]',-2);
    for (var x = 0; x < CauseCodes[0].length; x++)
    {
        CreateDropDownBoxOption(cmbbox,x+1,CauseCodes[0][x] + " " + CauseCodes[1][x],CauseCodes[0][x] + " " + CauseCodes[1][x],CauseCodes[0][x]);
    }
    
    cell.appendChild(cmbbox);
    rRow.appendChild(cell);

    WorkRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("WorkRequestCommentsLbl",'Comments');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var txtbox = CreateFormTextAreaField("WorkRequestComments",'', 1, 30, 4, iReadOnly, 1);
    SetObjectWidth(txtbox, ctlwidth2[1]-16);
    txtbox.onchange = function(){SetWorkRequestEditStatus(-1);};
    if(iReadOnly == -1)
    {
        txtbox.className ='txtReadonly grdfont grdfont10';    
    }
    else
    {
        txtbox.className ='grdfont grdfont10';    
    }
    cell.appendChild(txtbox);
    rRow.appendChild(cell);

    WorkRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("WorkRequestResponseLbl",'Response');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("WorkRequestResponse",'');
    cell.appendChild(label);
    rRow.appendChild(cell);

    WorkRequesttablebody2.appendChild(rRow);

    WorkRequesttable2.appendChild(WorkRequesttablebody2);
    ni2.appendChild(WorkRequesttable2);
    
	//Now all of this should be hidden initially
    WorkRequesttable3 = document.createElement("table");
    WorkRequesttable3.setAttribute('cellSpacing','0');
    WorkRequesttable3.setAttribute('id', "WorkRequestTable3");
    WorkRequesttablebody3 = document.createElement("tbody");
    WorkRequesttablebody3.setAttribute('id', "WorkRequestTableBody3");                        
    WorkRequesttable3.className = "fixed"; 
//    WorkRequesttable3.border = 2;
    var iTotalWidth3 = 5; //Take off one lot of padding because between cells is one less than total number of cells
	for(var i=0;i<ctlwidth3.length;i++)
	{
		coltag3 = document.createElement("col");
		SetObjectWidth(coltag3, ctlwidth3[i]);
		iTotalWidth3 += ctlwidth3[i] + 5;
		WorkRequesttable3.appendChild(coltag3);
	}
    SetObjectWidth(WorkRequesttable3, iTotalWidth2);
    WorkRequesttable3.style.visibility = 'hidden';
    
    var rRow = document.createElement("tr");
    
    cell = document.createElement("td");
    var btnSave = CreateFormButtonField("btnSave","Save", iReadOnly);
    SetObjectWidth(btnSave, 100);
    btnSave.onclick = function(){SaveWorkRequest(false);};
    btnSave.className='grdfont grdfont10 grdRowTextAligCenter';    
    cell.appendChild(btnSave);
    cell.align = "center";  
    rRow.appendChild(cell);

    WorkRequesttablebody3.appendChild(rRow);
    
    WorkRequesttable3.appendChild(WorkRequesttablebody3);
    ni2.appendChild(WorkRequesttable3);
}

function ApplyFilter()
{
	GetEquipmentCodes();
}

function GetEquipmentCodes()
{
    var url = GetWebServiceRoot() + "WbsReliability";
	var parameters = new SOAPClientParameters();
    var sUser = GetUserId();
    var sSessionId = GetSessionId();
	var iOperationCode = GetObjectValue('WorkRequestOperation');
	if(iOperationCode == '[select]')
		return;
	var sFilter = GetObjectValue('WorkRequestCodeFilter');
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
	parameters.add("iOperationCode",iOperationCode);		        
	parameters.add("sFilterCode",sFilter);		        
	openModal();
	var cmbbox = document.getElementById('WorkRequestEquipmentCode');
	ComboboxClear(cmbbox);
    SOAPClient.invoke(url,"get_Reliability_Equipment_Codes",parameters,true,EquipmentCodeDropdown_Populate);
}

function EquipmentCodeDropdown_Populate(result)
{
	
	if(result != null)
	{
		if(result != "")
		{
			if(result.gridstring != null)
			{
				if(result.gridstring.substring(0,6) == 'Failure')
				{
					alert(result.gridstring.substring(6,result.length));
				}
				else
				{
					var sEquipCodes =  result.gridstring;
				    var iEquipCodeRows =  result.gridrows;
				    var iEquipCodeCols = result.gridcols;
				    EquipmentCodes = ExtractReverseGrid(iEquipCodeRows, sEquipCodes, gsEquipCodeCols,iEquipCodeCols);
				    
				    if(EquipmentCodes != null)
			    	{
				    	PopulateEquipCodeDropdown();
			    	}			
				}
			}
		}
	}
	
	closeModal();
}

function PopulateEquipCodeDropdown()
{
	var cmbbox = document.getElementById('WorkRequestEquipmentCode');
	ComboboxClear(cmbbox);
	
	if(EquipmentCodes.length > 0)
	{
		for(var i=0;i<EquipmentCodes[0].length;i++)
		{
	        CreateDropDownBoxOption(cmbbox,i,EquipmentCodes[0][i] + ' - ' + EquipmentCodes[1][i]);
		}
	}
}


function AddNewWorkRequest()
{
	var iEditStatus = GetEditStatus();
	if(iEditStatus == -1)
	{
		PIMS_confirm(2,'You have unsaved changes. Do you wish to save these changes?','WorkRequestSaveYes','WorkRequestSaveNo','','WorkRequestSaveCancel');
	}
	else
	{		
	    var sUser = GetUserId();
	    var sSessionId = GetSessionId();
	    var iExistingId = GetObjectValue('hfWorkRequestCode');
    	if(iExistingId == '')
    		iExistingId = -1;

    	var url = GetWebServiceRoot() + "WbsReliability";
		var parameters = new SOAPClientParameters();
		openModal();
		parameters.add("sSessionId",sSessionId);		        
		parameters.add("sUserId",sUser);		        
		parameters.add("iExistingId",iExistingId);		        
	    SOAPClient.invoke(url,"getNewWorkRequestCode",parameters,true,AddNewWorkRequestSucc);
	}
}

function AddNewWorkRequestSucc(result)
{
	if(result != null)
	{
		if(result != "")
		{
			var cmbbox = document.getElementById('WorkRequestCode');
		    if(WorkRequests.length == 0)
			{
		    	var x = 0;
		    	ComboboxClear(cmbbox);
		        CreateDropDownBoxOption(cmbbox,0,'[select]','[select]',-2);
			}
		    else
	    	{
				var x = cmbbox.length;
		    	
	    	}
		    ComboBoxAddOptionInPosition(cmbbox, 1, result, -1 , false, result); //Allow for the [select]
	        //CreateDropDownBoxOption(cmbbox,x,result,result,-1);
	        cmbbox.selectedIndex = 1;
	        
	        PopulateWorkRequestBody(true, null);
		}
	}
	
	closeModal();
}

function PopulateWorkRequestBody(bNew, arrPassed)
{
	if(arrPassed != null)
	{
		SetObjectValue('hfWorkRequestCode', arrPassed.Id);
		SetObjectValue('WorkRequestName', arrPassed.WorkRequestName);
		SetObjectValue('WorkRequestLongDescription', arrPassed.LongDesc);
		SetObjectValue('WorkRequestDate', arrPassed.Date);
		if(arrPassed.OperationCode == '')
			SetObjectValue('WorkRequestOperation', '[select]');
		else
			SetObjectValue('WorkRequestOperation', arrPassed.OperationCode);
		if(arrPassed.EquipmentCode == '')
			SetObjectValue('WorkRequestEquipmentCode', '[select]');
		else
			SetObjectValue('WorkRequestEquipmentCode', arrPassed.EquipmentCode);
		if(arrPassed.WorkCategoryCode == '')
			SetObjectValue('WorkRequestWorkCategory', '[select]');
		else
			SetObjectValue('WorkRequestWorkCategory', arrPassed.WorkCategoryCode);
		if(arrPassed.CauseCode == '')
			SetObjectValue('WorkRequestCauseCode', '[select]');
		else
			SetObjectValue('WorkRequestCauseCode', arrPassed.CauseCode);
		SetObjectValue('WorkRequestComments', arrPassed.Comments);			
		SetObjectValue('WorkRequestResponse', arrPassed.Response);			
		SetObjectValue('WorkRequestStatus', arrPassed.Status);				
	}
	else
	{
	    var sNow = GetPIMSDateTimeStampMinsAMPM();
	    SetObjectValue('hfWorkRequestCode', '');
		SetObjectValue('WorkRequestName', '');
		SetObjectValue('WorkRequestLongDescription', '');
		SetObjectValue('WorkRequestDate', sNow);
		SetObjectValue('WorkRequestOperation', '[select]');
		SetObjectValue('WorkRequestEquipmentCode', -1);
		SetObjectValue('WorkRequestWorkCategory', '[select]');
		SetObjectValue('WorkRequestCauseCode', '[select]');
		SetObjectValue('WorkRequestComments', '');			
		SetObjectValue('WorkRequestResponse', '');				
		SetObjectValue('WorkRequestStatus', '');				
	}
	
	//Show the body
	SetObjectVisibility('WorkRequestTable2', 'visible');
	SetObjectVisibility('WorkRequestTable3', 'visible');
	GetEquipmentCodes();
}

function GetWorkRequestEditStatus()
{	
    return GetObjectValue('hfWorkRequestStatus');
}

function SetWorkRequestEditStatus(iValue)
{
	SetEditStatus(iValue);
    return SetObjectValue('hfWorkRequestStatus', iValue);
}

function WorkRequestSaveYesFromAddNew()
{
	giAddNewWorkRequest = 1;
	gsWorkRequestCode = GetObjectValue("WorkRequestCode");
	SaveWorkRequest(false); //If set to true means to move to the selected menu item when the save is complete
}

function WorkRequestSaveNo()
{
	SetWorkRequestEditStatus(0);
	AddNewWorkRequest();
}

function WorkRequestSaveCancel()
{
}

function SaveWorkRequest(bFromConfirm)
{
	//Get all the data
	var iWorkRequestId = GetObjectValue('WorkRequestCode');
	var sWorkRequestCode = GetObjectText('WorkRequestCode');
	var sWorkRequestWorkCategory = GetObjectValue('WorkRequestWorkCategory');
	var sWorkRequestName = GetObjectValue('WorkRequestName');
	var sWorkRequestDesc = GetObjectValue('WorkRequestLongDescription');
	var sWorkRequestDate = GetObjectValue('WorkRequestDate');
	var iWorkRequestOperation = GetObjectValue('WorkRequestOperation');
	var sWorkRequestEquipCode = GetObjectValue('WorkRequestEquipmentCode');
	var sWorkRequestCauseCode = GetObjectValue('WorkRequestCauseCode');
	var sWorkRequestComments = GetObjectValue('WorkRequestComments');
	var sWorkRequestResponse = GetObjectValue('WorkRequestResponse');
	
	var sSaveString = 'WorkRequestId=' + iWorkRequestId + '^WorkRequestCode=' + sWorkRequestCode +'^WorkRequestName=' + sWorkRequestName + '^WorkRequestLongDescription=' + sWorkRequestDesc + 
					  '^WorkRequestDate=' + sWorkRequestDate + '^WorkRequestOperation=' + iWorkRequestOperation + '^WorkRequestEquipmentCode=' + sWorkRequestEquipCode + 
					  '^WorkCategoryCode=' + sWorkRequestWorkCategory + '^WorkRequestCauseCode=' + sWorkRequestCauseCode + '^WorkRequestComments=' + sWorkRequestComments + 
					  '^WorkRequestResponse=' + sWorkRequestResponse;

    var sUser = GetUserId();
    var sSessionId = GetSessionId();
    var url = GetWebServiceRoot() + "WbsReliability";
	var parameters = new SOAPClientParameters();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
	parameters.add("bCallFromConfirm",bFromConfirm);		        
	parameters.add("sSaveString",sSaveString);		        
	openModal();
    SOAPClient.invoke(url,"setWorkRequest",parameters,true,SaveWorkRequestSucc);
}

function SaveWorkRequestSucc(result)
{
	var sResult = ExtractNamedPairsClass(result);
	if(sResult.Success == "Failure")
	{
		alert(sResult.Message);
	}
	else
	{
		SetWorkRequestEditStatus(0);
		var cmbbox = document.getElementById('WorkRequestCode');
		var opt = cmbbox.options[cmbbox.selectedIndex];
		SetObjectValue(opt, sResult.Id);		

		bCallFromConfirm = stringToBoolean(sResult.Success);

		if(bCallFromConfirm)
	    {
			OpenMenuItem(gsItemDesc, gsExtra);    
	    }		
}
	closeModal();
}

function RetreiveWorkRequest()
{
    var sUser = GetUserId();
    var sSessionId = GetSessionId();
	var iWorkRequestId = GetObjectValue('WorkRequestCode');
	if(iWorkRequestId > 0)
	{
	    var url = GetWebServiceRoot() + "WbsReliability";
		var parameters = new SOAPClientParameters();
		parameters.add("sSessionId",sSessionId);		        
		parameters.add("sUserId",sUser);		        
		parameters.add("iId",iWorkRequestId);		        
		openModal();
	    SOAPClient.invoke(url,"getWorkRequest",parameters,true,RetreiveWorkRequestSucc);
	}
	else
	{
		//Hide the body
		SetObjectVisibility('WorkRequestTable2', 'hidden');
		SetObjectVisibility('WorkRequestTable3', 'hidden');	
	}
}

function RetreiveWorkRequestSucc(result)
{
	var sResult = ExtractNamedPairsClass(result);
	
	if(sResult.Success == "Success")
	{
		PopulateWorkRequestBody(false, sResult);	
	}
	else
	{
		alert(sResult.Message);
	}
	
	closeModal();
}

function CheckWorkRequestLock()
{
	var iWorkRequestId = GetObjectValue('WorkRequestCode');

	if(iWorkRequestId > 0)
	{
	    var url = GetWebServiceRoot() + "WbsReliability";
	    var sUser = GetUserId();
	    var sSessionId = GetSessionId();
		var parameters = new SOAPClientParameters();
		parameters.add("sSessionId",sSessionId);		        
		parameters.add("sUsername",sUser);		        
		parameters.add("iId",iWorkRequestId);
		openModal();
	    SOAPClient.invoke(url,"getWorkRequestLock",parameters,true,CheckWorkRequestLockSucc);
	}
	else
	{
	    var iExistingId = -1;
	    if(document.getElementById('hfWorkRequestCode') != null)
	    {
	    	iExistingId = GetObjectValue('hfWorkRequestCode');  
	    	if(iExistingId == '')
	    		iExistingId = -1;
	    }
		//Hide the body
		SetObjectVisibility('WorkRequestTable2', 'hidden');
		SetObjectVisibility('WorkRequestTable3', 'hidden');	
		SetWorkRequestLock(iExistingId,0, '', '');
	}
}

function CheckWorkRequestLockSucc(result)
{
	var arrResults = ExtractNamedPairsClass(result);
	var iSuccess = arrResults.Success;
	
	if(iSuccess == 1)
	{
		if(arrResults.Locked == 1)
		{
			var sLockedMsg = ' WorkRequest ' + arrResults.WorkRequest + ' is currently locked by user ' + arrResults.UserId;
			alert(sLockedMsg);
		    var iExistingId = -1;
		    if(document.getElementById('hfWorkRequestCode') != null)
		    {
		    	iExistingId = GetObjectValue('hfWorkRequestCode');  
		    	if(iExistingId == '')
		    		iExistingId = -1;
		    }
			SetObjectValue('WorkRequestCode', iExistingId);
		}
		else
		{
			var iSelect = parseInt(GetObjectValue('WorkRequestCode'),10);
			RetreiveWorkRequest();
		}
	}
	else
	{
		alert(arrResults.Message);
	    var iExistingId = -1;
	    if(document.getElementById('hfWorkRequestCode') != null)
	    {
	    	iExistingCompanyId = GetObjectValue('hfWorkRequestCode');    
	    	if(iExistingId == '')
	    		iExistingId = -1;
	    }
		SetObjectValue('WorkRequestCode', iExistingId);
	}
	
	closeModal();
}


function SetWorkRequestLock(iId, iLocked, sMenu, sExtra)
{
		var sRedirect = GetMenuRedirect(sMenu, sExtra);
	    var url = GetWebServiceRoot() + "WbsReliability";
	    var sUser = GetUserId();
	    var sSessionId = GetSessionId();
		var parameters = new SOAPClientParameters();
		parameters.add("sSessionId",sSessionId);		        
		parameters.add("sUsername",sUser);		        
		parameters.add("iId",iId);
		parameters.add("iLocked",iLocked);
		parameters.add("sMenu",sMenu);
		parameters.add("sExtra",sExtra);
		openModal();
	    SOAPClient.invoke(url,"setWorkRequestLock",parameters,true,SetWorkRequestLockSucc);
}

function SetWorkRequestLockSucc(result)
{
	var arrResults = ExtractNamedPairsClass(result);
	var iSuccess = arrResults.Success;
	
	if(iSuccess == 1)
	{
		if(arrResults.sMenu != '')
			OpenMenuItem(arrResults.sMenu, arrResults.sExtra);				
	}
	else
	{
		alert(arrResults.Message);
	}
	
	closeModal();
}

/****************************************************************************************/
/**			CALENDAR STUFF																*/
/****************************************************************************************/
//show calendar
function CalendarShow(sender) 
{
	if (calobj2) return;
/*    var sFieldName = sender.id;
    var iColNo = parseInt(Get_RowNo_From_ControlName(sFieldName));
    var iStart = sFieldName.indexOf("DataRowDateBtn_")+15;
    var iEnd = sFieldName.indexOf("_Col_");
    var iRowLocal = sFieldName.substring(iStart, iEnd);
    iRowLocal = parseInt(iRowLocal);
*/    
    var text_field = document.getElementById("WorkRequestDate");;

	cal_obj2 = new RichCalendar();
	cal_obj2.start_week_day = 0;
	cal_obj2.show_time = true;
	cal_obj2.user_onchange_handler = CalendarChange;
	cal_obj2.user_onautoclose_handler = CalendarAutoClose;
	cal_obj2.parse_date(text_field.value, cal_format);
	cal_obj2.show_at_element(text_field, "right-bottom");
/*	cal_obj2.rowid = iRowLocal;
	cal_obj2.colid = iColNo;
*/
}

function CalendarAutoClose()
{
    calobj2 = null;
}


function CalendarChange(cal, object_code) 
{
	if (object_code == 'day') 
	{
	    var iRow = cal.rowid;
	    var iCol = cal.colid;
	    var datefield = document.getElementById("WorkRequestDate");
		SetObjectValue(datefield.id,cal.get_formatted_date(cal_format)); //datefield.value = cal.get_formatted_date(cal_format);
		cal.hide();
		cal_obj2 = null;
//		SaveTrackerDateDataJS(datefield);
	}
}