/**
 For all the building and client side for  ActionRequests 
 */

var gsItemDesc;
var gsCurrentPage = "";
var gsExtra;

var ActionRequests = [];
var Operations = [];
var ActionCategories = [];
var CauseCodes = [];
var EquipmentCodes = [];
var gsActionRequestCodeCols = [];
var gsActionTypeCodeCols = [];
var gsOperationCols = [];
var gsActionCategoryCols = [];
var gsCauseCodeCols = [];
var gsEquipCodeCols = [];
var gsActionRequestCode = '';
var giAddNewActionRequest = 0;

var ctlwidth = [];
    ctlwidth[0]=150;
    ctlwidth[1]=225;
    ctlwidth[2]=100;

var ctlwidth2 = [];
    ctlwidth2[0]=150;
    ctlwidth2[1]=225;
    ctlwidth2[2]=100;

var ctlwidth3 = [];
    ctlwidth3[0]=475;

    var calobj2 = null; //For the calendar popup
var cal_format = '%d/%m/%Y %h:%i %a';
    
function GetActionRequestCodes()
{
    var url = GetWebServiceRoot() + "WbsReliability";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();

    var parameters = new SOAPClientParameters();
	openModal();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
    SOAPClient.invoke(url,"getExistingActionRequestCodes",parameters,true,ActionRequestCodesDropdown_Populate);
}

function ActionRequestCodesDropdown_Populate(result)
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
			    var sActionRequestCodes =  result[1].gridstring;
			    var iActionRequestCodeRows =  result[1].gridrows;
			    var iActionRequestCodeCols = result[1].gridcols;
			    ActionRequests = ExtractReverseGrid(iActionRequestCodeRows, sActionRequestCodes, gsActionRequestCodeCols,iActionRequestCodeCols);
			}
			
			if(result[2] != null)
			{
			    var sActionCategories =  result[2].gridstring;
			    var iActionCategoryRows =  result[2].gridrows;
			    var iActionCategoryCols = result[2].gridcols;
			    ActionCategories = ExtractReverseGrid(iActionCategoryRows, sActionCategories, gsActionCategoryCols,iActionCategoryCols);
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
    ActionRequest_Populate(false);	
	closeModal();
}
    
function ActionRequest_BlankPopulate()
{
	GetActionRequestCodes();
}

function ActionRequest_Populate(bNew)
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

    var ni2 = document.getElementById('ActionRequestGridDataContainer'); 
    ni2.className='grdDataDivBckGrdColor grdDataDivBorders';
    ni2.style.overflow='auto';


	//First of all create the table
    ActionRequesttable = document.createElement("table");
    ActionRequesttable.setAttribute('cellSpacing','0');
    ActionRequesttable.setAttribute('id', "ActionRequestTable");
    ActionRequesttablebody = document.createElement("tbody");
    ActionRequesttablebody.setAttribute('id', "ActionRequestTableBody");                        
    ActionRequesttable.className = "fixed"; 

    var iTotalWidth = 0; //Take off one lot of padding because between cells is one less than total number of cells
	for(var i=0;i<ctlwidth.length;i++)
	{
		coltag = document.createElement("col");
		SetObjectWidth(coltag, ctlwidth[i]);
		iTotalWidth += ctlwidth[i] + 5;
		ActionRequesttable.appendChild(coltag);
	}

	SetObjectWidth(ActionRequesttable, iTotalWidth);
    
    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft';
    var hiddenrowstatus = CreateFormHiddenField("hfActionRequestStatus",iStatus);
    cell.appendChild(hiddenrowstatus);
    var hiddenrowcodeid = CreateFormHiddenField("hfActionRequestCode",'-1');
    cell.appendChild(hiddenrowcodeid);
    var hiddenrowcode = CreateFormHiddenField("hfActionRequest",'');
    cell.appendChild(hiddenrowcode);
    var label = CreateFormLabelField("ActionRequestCodeLbl",'Action Request Code');
    SetObjectWidth(label, ctlwidth[0]);
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("ActionRequestCode", iReadOnly);
    SetObjectWidth(cmbbox, ctlwidth[1]-10);
    cmbbox.className='grdfont grdfont10';
    cmbbox.onchange = function(){CheckActionRequestLock();};
    
    
    if(ActionRequests.length == 0)
	{
    	CreateDropDownBoxOption(cmbbox,0,'No Action Requests','No Action Requests',-2);	
	}
    else
   	{
        CreateDropDownBoxOption(cmbbox,0,'[select]','[select]',-2);
	    for (var x = 0; x < ActionRequests[0].length; x++)
	    {
	        CreateDropDownBoxOption(cmbbox,x+1,ActionRequests[1][x],ActionRequests[1][x],ActionRequests[0][x]);
	    }
   	}
    
    cell.appendChild(cmbbox);
    rRow.appendChild(cell);

    cell = document.createElement("td");
    var btnAdd = CreateFormButtonField("btnAddNew","New Action Request", iReadOnly);
    SetObjectWidth(btnAdd, ctlwidth[2]-10);
    btnAdd.onclick = function(){AddNewActionRequest();};
    btnAdd.className='grdfont grdfont10 grdRowTextAligCenter';    
    cell.appendChild(btnAdd);
    cell.align = "center";  
    rRow.appendChild(cell);

    ActionRequesttablebody.appendChild(rRow);
    ActionRequesttable.appendChild(ActionRequesttablebody);
    ni2.appendChild(ActionRequesttable);
    
	//Now all of this should be hidden initially
    ActionRequesttable2 = document.createElement("table");
    ActionRequesttable2.setAttribute('cellSpacing','0');
    ActionRequesttable2.setAttribute('id', "ActionRequestTable2");
    ActionRequesttablebody2 = document.createElement("tbody");
    ActionRequesttablebody2.setAttribute('id', "ActionRequestTableBody2");                        
    ActionRequesttable2.className = "fixed"; 
//    ActionRequesttable2.border = 2;
    var iTotalWidth2 = 5; //Take off one lot of padding because between cells is one less than total number of cells
	for(var i=0;i<ctlwidth2.length;i++)
	{
		coltag2 = document.createElement("col");
		SetObjectWidth(coltag2, ctlwidth2[i]);
		iTotalWidth2 += ctlwidth2[i] + 5;
		ActionRequesttable2.appendChild(coltag2);
	}
    SetObjectWidth(ActionRequesttable2, iTotalWidth2);
    ActionRequesttable2.style.visibility = 'hidden';
    
    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft';
    var label = CreateFormLabelField("ActionRequestStatusLbl",'Action Request Status');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("ActionRequestStatus",'');
    cell.appendChild(label);
    rRow.appendChild(cell);

    ActionRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("ActionRequestActionCategoryLbl",'Action Category');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("ActionRequestActionCategory", iReadOnly);
    SetObjectWidth(cmbbox, ctlwidth2[1]-10);
    cmbbox.className='grdfont grdfont10';
    cmbbox.onchange = function(){SetActionRequestEditStatus(-1);};
    
    CreateDropDownBoxOption(cmbbox,0,'[select]','[select]',-2);
    for (var x = 0; x < ActionCategories[0].length; x++)
    {
        CreateDropDownBoxOption(cmbbox,x+1, ActionCategories[1][x],ActionCategories[1][x],ActionCategories[0][x]);
    }
    
    cmbbox.selectedIndex = 0;
    
    cell.appendChild(cmbbox);
    rRow.appendChild(cell);

    ActionRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft';
    var label = CreateFormLabelField("ActionRequestNameLbl",'Action Request Name');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft';
    var txtbox = CreateFormTextField("ActionRequestName",'', iReadOnly);
    SetObjectWidth(txtbox, ctlwidth2[1]-14);
    txtbox.onchange = function(){SetActionRequestEditStatus(-1);};
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

    ActionRequesttablebody2.appendChild(rRow);
    
    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("ActionRequestLongDescriptionLbl",'Long Description');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var txtbox = CreateFormTextAreaField("ActionRequestLongDescription",'', 1, 30, 4, iReadOnly, 1, 500);
    SetObjectWidth(txtbox, ctlwidth2[1]-16);
    txtbox.onchange = function(){SetActionRequestEditStatus(-1);};
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

    ActionRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("ActionRequestDateLbl",'Date and Time');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    var sNow = GetPIMSDateTimeStampMinsAMPM();
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("ActionRequestDate", sNow);
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

    ActionRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("ActionRequestOperationLbl",'Operation');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("ActionRequestOperation", iReadOnly);
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

    ActionRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("ActionRequestCodeFilterLbl",'Filter');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft';
    var txtbox = CreateFormTextField("ActionRequestCodeFilter",'', iReadOnly);
    SetObjectWidth(txtbox, ctlwidth2[1]-14);
//    txtbox.onchange = function(){SetActionRequestEditStatus(-1);};
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

    ActionRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("ActionRequestEquipmentCodeLbl",'Equipment');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("ActionRequestEquipmentCode", iReadOnly);
    SetObjectWidth(cmbbox, ctlwidth2[1]-10);
    cmbbox.className='grdfont grdfont10';
    cmbbox.onchange = function(){SetActionRequestEditStatus(-1);};        
    cell.appendChild(cmbbox);
    var hiddenequipvalue = CreateFormHiddenField("hfActionRequestEquipmentCode",'');
    cell.appendChild(hiddenequipvalue);
    rRow.appendChild(cell);

    ActionRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("ActionRequestCauseCodeLbl",'Cause');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("ActionRequestCauseCode", iReadOnly);
    SetObjectWidth(cmbbox, ctlwidth2[1]-10);
    cmbbox.className='grdfont grdfont10';
    cmbbox.onchange = function(){SetActionRequestEditStatus(-1);};
    
    CreateDropDownBoxOption(cmbbox,0,'[select]','[select]',-2);
    for (var x = 0; x < CauseCodes[0].length; x++)
    {
        CreateDropDownBoxOption(cmbbox,x+1,CauseCodes[0][x] + " " + CauseCodes[1][x],CauseCodes[0][x] + " " + CauseCodes[1][x],CauseCodes[0][x]);
    }
    
    cell.appendChild(cmbbox);
    rRow.appendChild(cell);

    ActionRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("ActionRequestCommentsLbl",'Comments');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var txtbox = CreateFormTextAreaField("ActionRequestComments",'', 1, 30, 4, iReadOnly, 1, 500);
    SetObjectWidth(txtbox, ctlwidth2[1]-16);
    txtbox.onchange = function(){SetActionRequestEditStatus(-1);};
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

    ActionRequesttablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("ActionRequestResponseLbl",'Response');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("ActionRequestResponse",'');
    cell.appendChild(label);
    rRow.appendChild(cell);

    ActionRequesttablebody2.appendChild(rRow);

    ActionRequesttable2.appendChild(ActionRequesttablebody2);
    ni2.appendChild(ActionRequesttable2);
    
	//Now all of this should be hidden initially
    ActionRequesttable3 = document.createElement("table");
    ActionRequesttable3.setAttribute('cellSpacing','0');
    ActionRequesttable3.setAttribute('id', "ActionRequestTable3");
    ActionRequesttablebody3 = document.createElement("tbody");
    ActionRequesttablebody3.setAttribute('id', "ActionRequestTableBody3");                        
    ActionRequesttable3.className = "fixed"; 
//    ActionRequesttable3.border = 2;
    var iTotalWidth3 = 5; //Take off one lot of padding because between cells is one less than total number of cells
	for(var i=0;i<ctlwidth3.length;i++)
	{
		coltag3 = document.createElement("col");
		SetObjectWidth(coltag3, ctlwidth3[i]);
		iTotalWidth3 += ctlwidth3[i] + 5;
		ActionRequesttable3.appendChild(coltag3);
	}
    SetObjectWidth(ActionRequesttable3, iTotalWidth2);
    ActionRequesttable3.style.visibility = 'hidden';
    
    var rRow = document.createElement("tr");
    
    cell = document.createElement("td");
    var btnSave = CreateFormButtonField("btnSave","Save", iReadOnly);
    SetObjectWidth(btnSave, 100);
    btnSave.onclick = function(){SaveActionRequest(false);};
    btnSave.className='grdfont grdfont10 grdRowTextAligCenter';    
    cell.appendChild(btnSave);
    cell.align = "center";  
    rRow.appendChild(cell);

    ActionRequesttablebody3.appendChild(rRow);
    
    ActionRequesttable3.appendChild(ActionRequesttablebody3);
    ni2.appendChild(ActionRequesttable3);
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
	var iOperationCode = GetObjectValue('ActionRequestOperation');
	if(iOperationCode == '[select]')
		return;
	var sFilter = GetObjectValue('ActionRequestCodeFilter');
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
	parameters.add("iOperationCode",iOperationCode);		        
	parameters.add("sFilterCode",sFilter);		        
	openModal();
//	var cmbbox = document.getElementById('ActionRequestEquipmentCode');
//	ComboboxClear(cmbbox);
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

function ChangeActionRequestType()
{
	var iEditStatus = GetEditStatus();
	if(iEditStatus == -1)
	{
		PIMS_confirm(2,'You have unsaved changes. Do you wish to save these changes?','ActionRequestSaveYesFromTypeChange','ActionRequestSaveNo','','ActionRequestSaveCancel');
	}
	else
	{
		SetObjectValue('ActionRequestCode', '[select]');
		RetreiveActionRequest();
	}
}

function PopulateEquipCodeDropdown()
{
	var cmbbox = document.getElementById('ActionRequestEquipmentCode');
	var hfEquip = document.getElementById('hfActionRequestEquipmentCode');
    var sExistingId = GetObjectValue(hfEquip);
	ComboboxClear(cmbbox);
	
	if(EquipmentCodes.length > 0)
	{
		for(var i=0;i<EquipmentCodes[0].length;i++)
		{
	        CreateDropDownBoxOption(cmbbox,i,EquipmentCodes[0][i] + ' - ' + EquipmentCodes[1][i]);
		}
		
		if(sExistingId != '')
			SetObjectValue(cmbbox, sExistingId);
		else
			cmbbox.selectedIndex = 0;
	}
}


function AddNewActionRequest()
{
	var iEditStatus = GetEditStatus();
	if(iEditStatus == -1)
	{
		PIMS_confirm(2,'You have unsaved changes. Do you wish to save these changes?','ActionRequestSaveYes','ActionRequestSaveNo','','ActionRequestSaveCancel');
	}
	else
	{		
	    var sUser = GetUserId();
	    var sSessionId = GetSessionId();
	    var iExistingId = GetObjectValue('hfActionRequestCode');
    	if(iExistingId == '')
    		iExistingId = -1;
	    var sARExistingCode = GetObjectValue('hfActionRequest');

    	var url = GetWebServiceRoot() + "WbsReliability";
		var parameters = new SOAPClientParameters();
		openModal();
		parameters.add("sSessionId",sSessionId);		        
		parameters.add("sUserId",sUser);		        
		parameters.add("iExistingId",iExistingId);		        
		parameters.add("sARExistingCode",sARExistingCode);		        
	    SOAPClient.invoke(url,"getNewActionRequestCode",parameters,true,AddNewActionRequestSucc);
	}
}

function AddNewActionRequestSucc(result)
{
	if(result != null)
	{
		if(result != "")
		{
			var cmbbox = document.getElementById('ActionRequestCode');
		    if(ActionRequests.length == 0)
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
	        cmbbox.selectedIndex = 1;
	        PopulateActionRequestBody(true, null);
	        SetActionRequestEditStatus(-1); 
		}
	}
	
	closeModal();
}

function PopulateActionRequestBody(bNew, arrPassed)
{
	if(arrPassed != null)
	{
		SetObjectValue('hfActionRequestCode', arrPassed.Id);
		SetObjectValue('hfActionRequest', arrPassed.ActionRequestCode);
		SetObjectValue('ActionRequestName', arrPassed.ActionRequestName);
		SetObjectValue('ActionRequestLongDescription', arrPassed.LongDesc);
		SetObjectValue('ActionRequestDate', arrPassed.Date);
		if(arrPassed.OperationCode == '')
			SetObjectValue('ActionRequestOperation', '[select]');
		else
			SetObjectValue('ActionRequestOperation', arrPassed.OperationCode);
		if(arrPassed.EquipmentCode == '')
		{
			SetObjectValue('ActionRequestEquipmentCode', '[select]');
			SetObjectValue('hfActionRequestEquipmentCode', '[select]');
		}
		else
		{
			SetObjectValue('ActionRequestEquipmentCode', arrPassed.EquipmentCode);
			SetObjectValue('hfActionRequestEquipmentCode', arrPassed.EquipmentCode);
		}
		if(arrPassed.ActionCategoryCode == '')
			SetObjectValue('ActionRequestActionCategory', '[select]');
		else
			SetObjectValue('ActionRequestActionCategory', arrPassed.ActionCategoryCode);
		if(arrPassed.CauseCode == '')
			SetObjectValue('ActionRequestCauseCode', '[select]');
		else
			SetObjectValue('ActionRequestCauseCode', arrPassed.CauseCode);
		SetObjectValue('ActionRequestComments', arrPassed.Comments);			
		SetObjectValue('ActionRequestResponse', arrPassed.Response);			
		SetObjectValue('ActionRequestStatus', arrPassed.Status);				
	}
	else
	{
	    var sNow = GetPIMSDateTimeStampMinsAMPM();
	    SetObjectValue('hfActionRequestCode', '');
	    SetObjectValue('hfActionRequest', '');
		SetObjectValue('ActionRequestName', '');
		SetObjectValue('ActionRequestLongDescription', '');
		SetObjectValue('ActionRequestDate', sNow);
		SetObjectValue('ActionRequestOperation', '[select]');
		SetObjectValue('ActionRequestEquipmentCode', -1);
		SetObjectValue('hfActionRequestEquipmentCode', '');
		SetObjectValue('ActionRequestActionCategory', '[select]');
		SetObjectValue('ActionRequestCauseCode', '[select]');
		SetObjectValue('ActionRequestComments', '');			
		SetObjectValue('ActionRequestResponse', '');				
		SetObjectValue('ActionRequestStatus', '');	
	}
	
	//Show the body
	SetObjectVisibility('ActionRequestTable2', 'visible');
	SetObjectVisibility('ActionRequestTable3', 'visible');
	GetEquipmentCodes();
}

function GetActionRequestEditStatus()
{	
    return GetObjectValue('hfActionRequestStatus');
}

function SetActionRequestEditStatus(iValue)
{
	SetEditStatus(iValue);
    return SetObjectValue('hfActionRequestStatus', iValue);
}

function ActionRequestSaveYesFromAddNew()
{
	giAddNewActionRequest = 1;
	gsActionRequestCode = GetObjectValue("ActionRequestCode");
	SaveActionRequest(false); //If set to true means to move to the selected menu item when the save is complete
}

function ActionRequestSaveYesFromTypeChange()
{
	giAddNewActionRequest = 0;
	gsActionRequestCode = GetObjectValue("ActionRequestCode");
	SaveActionRequest(false); //If set to true means to move to the selected menu item when the save is complete
}

function ActionRequestSaveNo()
{
	SetActionRequestEditStatus(0);
	AddNewActionRequest();
}

function ActionRequestSaveCancel()
{
}

function SaveActionRequest(bFromConfirm)
{
	//Get all the data
	var iActionRequestId = GetObjectValue('ActionRequestCode');
	var sActionRequestCode = GetObjectText('ActionRequestCode');
	var sActionRequestActionCategory = GetObjectValue('ActionRequestActionCategory');
	var sActionRequestName = GetObjectValue('ActionRequestName');
	var sActionRequestDesc = GetObjectValue('ActionRequestLongDescription');
	var sActionRequestDate = GetObjectValue('ActionRequestDate');
	var iActionRequestOperation = GetObjectValue('ActionRequestOperation');
	var sActionRequestEquipCode = GetObjectValue('ActionRequestEquipmentCode');
	var sActionRequestCauseCode = GetObjectValue('ActionRequestCauseCode');
	var sActionRequestComments = GetObjectValue('ActionRequestComments');
	var sActionRequestResponse = GetObjectValue('ActionRequestResponse');
		
	if(sActionRequestName == null)
	{
		alert('You must supply an action request name');
		return;
	}
	
	if(sActionRequestName == '')
	{
		alert('You must supply an action request name');
		return;
	}
	
	if(sActionRequestEquipCode == null)
	{
		alert('You must supply the equipment this request is against');
		return;
	}
	
	if(sActionRequestEquipCode == '')
	{
		alert('You must supply the equipment this request is against');
		return;
	}
	
	
	var sSaveString = 'ActionRequestId=' + iActionRequestId + '^ActionRequestCode=' + sActionRequestCode +'^ActionRequestName=' + sActionRequestName + '^ActionRequestLongDescription=' + sActionRequestDesc + 
					  '^ActionRequestDate=' + sActionRequestDate + '^ActionRequestOperation=' + iActionRequestOperation + '^ActionRequestEquipmentCode=' + sActionRequestEquipCode + 
					  '^ActionCategoryCode=' + sActionRequestActionCategory + '^ActionRequestCauseCode=' + sActionRequestCauseCode + '^ActionRequestComments=' + sActionRequestComments + 
					  '^ActionRequestResponse=' + sActionRequestResponse + "^";

    var sUser = GetUserId();
    var sSessionId = GetSessionId();
    var url = GetWebServiceRoot() + "WbsReliability";
	var parameters = new SOAPClientParameters();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
	parameters.add("bCallFromConfirm",bFromConfirm);		        
	parameters.add("sSaveString",sSaveString);		        
	openModal();
    SOAPClient.invoke(url,"setActionRequest",parameters,true,SaveActionRequestSucc);
}

function SaveActionRequestSucc(result)
{
	var sResult = ExtractNamedPairsClass(result);
	if(sResult.Success == "Failure")
	{
		alert(sResult.Message);
	}
	else
	{
		SetActionRequestEditStatus(0);
		var cmbbox = document.getElementById('ActionRequestCode');
		var opt = cmbbox.options[cmbbox.selectedIndex];
		SetObjectValue(opt, sResult.Id);		

		var sRequestStatus = GetObjectValue('ActionRequestStatus');
		if(sRequestStatus == '')
		{
			SetObjectValue('ActionRequestStatus', 'Created');
		}
		bCallFromConfirm = stringToBoolean(sResult.Success);
		
		

		if(bCallFromConfirm)
	    {
			OpenMenuItem(gsItemDesc, gsExtra);    
	    }		
	}
	closeModal();
}

function RetreiveActionRequest()
{
    var sUser = GetUserId();
    var sSessionId = GetSessionId();
	var iActionRequestId = GetObjectValue('ActionRequestCode');
	if(iActionRequestId > 0)
	{
		var sARCode = GetObjectText('ActionRequestCode');
	    var url = GetWebServiceRoot() + "WbsReliability";
		var parameters = new SOAPClientParameters();
		parameters.add("sSessionId",sSessionId);		        
		parameters.add("sUserId",sUser);		        
		parameters.add("sARCode",sARCode);		        
		openModal();
	    SOAPClient.invoke(url,"getActionRequest",parameters,true,RetreiveActionRequestSucc);
	}
	else
	{
		//Hide the body
		SetObjectVisibility('ActionRequestTable2', 'hidden');
		SetObjectVisibility('ActionRequestTable3', 'hidden');	
	}
}

function RetreiveActionRequestSucc(result)
{
	var sResult = ExtractNamedPairsClass(result);
	
	if(sResult.Success == "Success")
	{
		PopulateActionRequestBody(false, sResult);	
	}
	else
	{
		alert(sResult.Message);
	}
	
	closeModal();
}

function CheckActionRequestLock()
{
	var iEditStatus = GetEditStatus();
	if(iEditStatus == -1)
	{
		PIMS_confirm(2,'You have unsaved changes. Do you wish to save these changes?','ActionRequestSaveYesFromRequestCodeChange','ActionRequestSaveNoFromRequestCodeChange','','ActionRequestSaveCancel');
	}
	else
	{
		ActionRequestSaveNoFromRequestCodeChange();
	}

}

function ActionRequestSaveYesFromRequestCodeChange()
{
	SaveActionRequest(false);
}

function ActionRequestSaveNoFromRequestCodeChange()
{
	var iActionRequestId = GetObjectValue('ActionRequestCode');

	if(iActionRequestId > 0)
	{
	    var url = GetWebServiceRoot() + "WbsReliability";
	    var sUser = GetUserId();
	    var sSessionId = GetSessionId();
		var sARCode = GetObjectText('ActionRequestCode');
		var parameters = new SOAPClientParameters();
		parameters.add("sSessionId",sSessionId);		        
		parameters.add("sUsername",sUser);		        
		parameters.add("sARCode",sARCode);
		openModal();
	    SOAPClient.invoke(url,"getActionRequestLock",parameters,true,CheckActionRequestLockSucc);
	}
	else
	{
	    var iExistingId = -1;
	    if(document.getElementById('hfActionRequest') != null)
	    {
	    	sExistingId = GetObjectValue('hfActionRequest');  
/*	    	if(sExistingId == '')
	    		sExistingId = -1;
*/	    }
		//Hide the body
		SetObjectVisibility('ActionRequestTable2', 'hidden');
		SetObjectVisibility('ActionRequestTable3', 'hidden');	
		SetActionRequestLock(sExistingId,0, '', '');
	}
}

function CheckActionRequestLockSucc(result)
{
	var arrResults = ExtractNamedPairsClass(result);
	var iSuccess = arrResults.Success;
	
	if(iSuccess == 1)
	{
		if(arrResults.Locked == 1)
		{
			var sLockedMsg = ' ActionRequest ' + arrResults.ActionRequest + ' is currently locked by user ' + arrResults.UserId;
			alert(sLockedMsg);
		    var iExistingId = -1;
		    if(document.getElementById('hfActionRequestCode') != null)
		    {
		    	iExistingId = GetObjectValue('hfActionRequestCode');  
		    	if(iExistingId == '')
		    		iExistingId = -1;
		    }
			SetObjectValue('ActionRequestCode', iExistingId);
		}
		else
		{
			var iSelect = parseInt(GetObjectValue('ActionRequestCode'),10);
			RetreiveActionRequest();
		}
	}
	else
	{
		alert(arrResults.Message);
	    var iExistingId = -1;
	    if(document.getElementById('hfActionRequestCode') != null)
	    {
	    	iExistingCompanyId = GetObjectValue('hfActionRequestCode');    
	    	if(iExistingId == '')
	    		iExistingId = -1;
	    }
		SetObjectValue('ActionRequestCode', iExistingId);
	}
	
	closeModal();
}


function SetActionRequestLock(sARCode, iLocked, sMenu, sExtra)
{
		var sRedirect = GetMenuRedirect(sMenu, sExtra);
	    var url = GetWebServiceRoot() + "WbsReliability";
	    var sUser = GetUserId();
	    var sSessionId = GetSessionId();
		var parameters = new SOAPClientParameters();
		parameters.add("sSessionId",sSessionId);		        
		parameters.add("sUsername",sUser);		        
		parameters.add("sARCode",sARCode);
		parameters.add("iLocked",iLocked);
		parameters.add("sMenu",sMenu);
		parameters.add("sExtra",sExtra);
		openModal();
	    SOAPClient.invoke(url,"setActionRequestLock",parameters,true,SetActionRequestLockSucc);
}

function SetActionRequestLockSucc(result)
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

function UnlockAllActionRequests()
{
    var url = GetWebServiceRoot() + "WbsReliability";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();
	var parameters = new SOAPClientParameters();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUsername",sUser);		        
	parameters.add("sARCode","");
	parameters.add("iLocked",1); //Set to 1 so that all id's other than -1 are unlocked and -1 is locked (which cannot exist)
	parameters.add("sMenu",'');
	parameters.add("sExtra",'');
	openModal();
    SOAPClient.invoke(url,"setActionRequestLock",parameters,true,UnlockAllActionRequestsSucc);
	
}

function UnlockAllActionRequestsSucc(result)
{
	var arrResults = ExtractNamedPairsClass(result);
	var iSuccess = arrResults.Success;
	
	if(iSuccess == 1)
	{
		SetObjectVisibility('ActionRequestTable2', 'hidden');
		SetObjectVisibility('ActionRequestTable3', 'hidden');	
	    SetObjectValue('hfActionRequestCode', '');
		SetObjectValue('ActionRequestCode', '[select]');
	}
	else
	{
		alert(arrResults.Message);
	}
	
	closeModal();
}

function LogoutFieldUser()
{
	var doc = document.getElementById('ActionRequestCode');
	if(doc != null)
	{
		var sARCode = GetObjectText('ActionRequestCode');
		if(sARCode != "" && sARCode != '[select]')
			SetActionRequestLock(sARCode, 0,'', '');
	}
	OpenMenuItem('Logout','');
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
    var text_field = document.getElementById("ActionRequestDate");;

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
	    var datefield = document.getElementById("ActionRequestDate");
		SetObjectValue(datefield.id,cal.get_formatted_date(cal_format)); //datefield.value = cal.get_formatted_date(cal_format);
		cal.hide();
		cal_obj2 = null;
//		SaveTrackerDateDataJS(datefield);
	}
}

/****************************************************************************************/
/**			REPORT STUFF																*/
/****************************************************************************************/
function PopulateOperations()
{
    var url = GetWebServiceRoot() + "WbsReliability";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();

    var parameters = new SOAPClientParameters();
	openModal();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
    SOAPClient.invoke(url,"getOperationCodes",parameters,true,PopulateOperationsSucc);
}

function PopulateOperationsSucc(result)
{
	if(result != null)
	{
		if(result != "")
		{
		    var sOperations =  result.gridstring;
		    var iOperationRows =  result.gridrows;
		    var iOperationCols = result.gridcols;
		    Operations = ExtractReverseGrid(iOperationRows, sOperations, gsOperationCols,iOperationCols);
		    cmbbox = document.getElementById('cmbOperation');
		    for (var x = 0; x < Operations[0].length; x++)
		    {
		        CreateDropDownBoxOption(cmbbox,x,Operations[0][x] + " " + Operations[1][x],Operations[0][x] + " " + Operations[1][x],Operations[0][x]);
		    }

	
		}
	}
	closeModal();
}

function RunReportActionRequest()
{
    var url = GetWebServiceRoot() + "WbsReliability";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();
    var sStartDate = GetObjectValue('start_date');
    var sEndDate = GetObjectValue('end_date');
    var iOperationCode  = GetObjectValue('cmbOperation');
    var sOperationName  = GetObjectText('cmbOperation');
	var parameters = new SOAPClientParameters();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUsername",sUser);		        
	parameters.add("iOperationCode",iOperationCode);		        
	parameters.add("sStartDate",sStartDate);		        
	parameters.add("sEndDate",sEndDate);		        
	parameters.add("sOperationName",sOperationName);		        
	openModal();
    SOAPClient.invoke(url,"emailActionRequestReport",parameters,true,RunReportActionRequestSucc);
	
}

function RunReportActionRequestSucc(result)
{
	sResults = ExtractList(result);
	if(sResults[0] == "Success")
	{
		alert('Action Request Report emailed');
	}
	else
	{
		alert(sResults[1]);
	
	}
	closeModal();
}