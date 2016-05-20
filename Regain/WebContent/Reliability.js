/**
 For all the building and client side for Reliability Events 
 */
var gsItemDesc;
var gsCurrentPage = "";
var gsExtra;

var ReliabilityEvents = [];
var Operations = [];
var ActionCodes = [];
var CauseCodes = [];
var EquipmentCodes = [];
var gsEventCodeCols = [];
var gsOperationCols = [];
var gsActionCodeCols = [];
var gsCauseCodeCols = [];
var gsEquipCodeCols = [];
var gsEventCode = '';
var giAddNewEvent = 0;

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
    
function GetEventCodes()
{
    var url = GetWebServiceRoot() + "WbsReliability";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();

    var parameters = new SOAPClientParameters();
	openModal();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
    SOAPClient.invoke(url,"getExistingEventCodes",parameters,true,EventCodesDropdown_Populate);
}

function EventCodesDropdown_Populate(result)
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
			    var sEventCodes =  result[1].gridstring;
			    var iEventCodeRows =  result[1].gridrows;
			    var iEventCodeCols = result[1].gridcols;
			    ReliabilityEvents = ExtractReverseGrid(iEventCodeRows, sEventCodes, gsEventCodeCols,iEventCodeCols);
			}
			
			if(result[2] != null)
			{
			    var sActionCodes =  result[2].gridstring;
			    var iActionCodeRows =  result[2].gridrows;
			    var iActionCodeCols = result[2].gridcols;
			    ActionCodes = ExtractReverseGrid(iActionCodeRows, sActionCodes, gsActionCodeCols,iActionCodeCols);
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
    ReliabilityEvent_Populate(false);	
	closeModal();
}
    
function ReliabilityEvent_BlankPopulate()
{
	GetEventCodes();
}

function ReliabilityEvent_Populate(bNew)
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

    var ni2 = document.getElementById('ReliabilityEventGridDataContainer'); 
    ni2.className='grdDataDivBckGrdColor grdDataDivBorders';
    ni2.style.overflow='auto';


	//First of all create the table
    eventtable = document.createElement("table");
    eventtable.setAttribute('cellSpacing','0');
    eventtable.setAttribute('id', "ReliabilityEventTable");
    eventtablebody = document.createElement("tbody");
    eventtablebody.setAttribute('id', "ReliabilityEventTableBody");                        
    eventtable.className = "fixed"; 

    var iTotalWidth = 0; //Take off one lot of padding because between cells is one less than total number of cells
	for(var i=0;i<ctlwidth.length;i++)
	{
		coltag = document.createElement("col");
		SetObjectWidth(coltag, ctlwidth[i]);
		iTotalWidth += ctlwidth[i] + 5;
		eventtable.appendChild(coltag);
	}

	SetObjectWidth(eventtable, iTotalWidth);
    
    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft';
    var hiddenrowstatus = CreateFormHiddenField("hfEventStatus",iStatus);
    cell.appendChild(hiddenrowstatus);
    var hiddenrowstatus = CreateFormHiddenField("hfEventCode",'-1');
    cell.appendChild(hiddenrowstatus);
    var label = CreateFormLabelField("EventCodeLbl",'Event Code');
    SetObjectWidth(label, ctlwidth[0]);
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("EventCode", iReadOnly);
    SetObjectWidth(cmbbox, ctlwidth[1]-10);
    cmbbox.className='grdfont grdfont10';
    cmbbox.onchange = function(){CheckEventLock();};
    
    
    if(ReliabilityEvents.length == 0)
	{
    	CreateDropDownBoxOption(cmbbox,0,'No Events','No Events',-2);	
	}
    else
   	{
        CreateDropDownBoxOption(cmbbox,0,'[select]','[select]',-2);
	    for (var x = 0; x < ReliabilityEvents[0].length; x++)
	    {
	        CreateDropDownBoxOption(cmbbox,x+1,ReliabilityEvents[1][x],ReliabilityEvents[1][x],ReliabilityEvents[0][x]);
	    }
   	}
    
    cell.appendChild(cmbbox);
    rRow.appendChild(cell);

    cell = document.createElement("td");
    var btnAdd = CreateFormButtonField("btnAddNew","New Event", iReadOnly);
    SetObjectWidth(btnAdd, ctlwidth[2]-10);
    btnAdd.onclick = function(){AddNewEvent();};
    btnAdd.className='grdfont grdfont10 grdRowTextAligCenter';    
    cell.appendChild(btnAdd);
    cell.align = "center";  
    rRow.appendChild(cell);

    eventtablebody.appendChild(rRow);
    eventtable.appendChild(eventtablebody);
    ni2.appendChild(eventtable);
    
	//Now all of this should be hidden initially
    eventtable2 = document.createElement("table");
    eventtable2.setAttribute('cellSpacing','0');
    eventtable2.setAttribute('id', "ReliabilityEventTable2");
    eventtablebody2 = document.createElement("tbody");
    eventtablebody2.setAttribute('id', "ReliabilityEventTableBody2");                        
    eventtable2.className = "fixed"; 
//    eventtable2.border = 2;
    var iTotalWidth2 = 5; //Take off one lot of padding because between cells is one less than total number of cells
	for(var i=0;i<ctlwidth2.length;i++)
	{
		coltag2 = document.createElement("col");
		SetObjectWidth(coltag2, ctlwidth2[i]);
		iTotalWidth2 += ctlwidth2[i] + 5;
		eventtable2.appendChild(coltag2);
	}
    SetObjectWidth(eventtable2, iTotalWidth2);
    eventtable2.style.visibility = 'hidden';
    
    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft';
    var label = CreateFormLabelField("EventNameLbl",'Event Name');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft';
    var txtbox = CreateFormTextField("EventName",'', iReadOnly);
    SetObjectWidth(txtbox, ctlwidth2[1]-14);
    txtbox.onchange = function(){SetEventEditStatus(-1);};
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

    eventtablebody2.appendChild(rRow);
    
    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("EventLongDescriptionLbl",'Long Description');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var txtbox = CreateFormTextAreaField("EventLongDescription",'', 1, 30, 4, iReadOnly, 1);
    SetObjectWidth(txtbox, ctlwidth2[1]-16);
    txtbox.onchange = function(){SetEventEditStatus(-1);};
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

    eventtablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("EventCodeDateLbl",'Date and Time');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    var sNow = GetPIMSDateTimeStampMinsAMPM();
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("EventCodeDate", sNow);
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

    eventtablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("EventOperationLbl",'Operation');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("EventOperation", iReadOnly);
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

    eventtablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("EventCodeFilterLbl",'Filter');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft';
    var txtbox = CreateFormTextField("EventCodeFilter",'', iReadOnly);
    SetObjectWidth(txtbox, ctlwidth2[1]-14);
//    txtbox.onchange = function(){SetEventEditStatus(-1);};
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

    eventtablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("EventEquipmentCodeLbl",'Equipment Code');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("EventEquipmentCode", iReadOnly);
    SetObjectWidth(cmbbox, ctlwidth2[1]-10);
    cmbbox.className='grdfont grdfont10';
    cmbbox.onchange = function(){SetEventEditStatus(-1);};        
    cell.appendChild(cmbbox);
    rRow.appendChild(cell);

    eventtablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft';
    var label = CreateFormLabelField("EventDurationLbl",'Duration');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdRowTextAligLeft';
    var txtbox = CreateFormTextField("EventDuration",'', iReadOnly);
    SetObjectWidth(txtbox, ctlwidth2[1]-14);
    txtbox.onchange = function(){SetEventEditStatus(-1);};
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

    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft';
    var label = CreateFormLabelField("EventDurationLbl2",'hrs');
    cell.appendChild(label);
    rRow.appendChild(cell);

    eventtablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("EventActionCodeLbl",'Action Code');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("EventActionCode", iReadOnly);
    SetObjectWidth(cmbbox, ctlwidth2[1]-10);
    cmbbox.className='grdfont grdfont10';
    cmbbox.onchange = function(){ApplyFilter();};
    
    CreateDropDownBoxOption(cmbbox,0,'[select]','[select]',-2);
    for (var x = 0; x < ActionCodes[0].length; x++)
    {
        CreateDropDownBoxOption(cmbbox,x+1,ActionCodes[0][x] + " " + ActionCodes[1][x],ActionCodes[0][x] + " " + ActionCodes[1][x],ActionCodes[0][x]);
    }
    
    cell.appendChild(cmbbox);
    rRow.appendChild(cell);

    eventtablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("EventCauseCodeLbl",'Cause Code');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var cmbbox = CreateFormDropDownBox("EventCauseCode", iReadOnly);
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

    eventtablebody2.appendChild(rRow);

    var rRow = document.createElement("tr");
    
    var cell = document.createElement("td");
    cell.className='grdfont grdfont10 grdfontBold grdRowTextAligLeft grdRowTextAligTop';
    var label = CreateFormLabelField("EventCommentsLbl",'Comments');
    cell.appendChild(label);
    rRow.appendChild(cell);
    
    cell = document.createElement("td");
    var txtbox = CreateFormTextAreaField("EventComments",'', 1, 30, 4, iReadOnly, 1);
    SetObjectWidth(txtbox, ctlwidth2[1]-16);
    txtbox.onchange = function(){SetEventEditStatus(-1);};
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

    eventtablebody2.appendChild(rRow);

    eventtable2.appendChild(eventtablebody2);
    ni2.appendChild(eventtable2);
    
	//Now all of this should be hidden initially
    eventtable3 = document.createElement("table");
    eventtable3.setAttribute('cellSpacing','0');
    eventtable3.setAttribute('id', "ReliabilityEventTable3");
    eventtablebody3 = document.createElement("tbody");
    eventtablebody3.setAttribute('id', "ReliabilityEventTableBody3");                        
    eventtable3.className = "fixed"; 
//    eventtable3.border = 2;
    var iTotalWidth3 = 5; //Take off one lot of padding because between cells is one less than total number of cells
	for(var i=0;i<ctlwidth3.length;i++)
	{
		coltag3 = document.createElement("col");
		SetObjectWidth(coltag3, ctlwidth3[i]);
		iTotalWidth3 += ctlwidth3[i] + 5;
		eventtable3.appendChild(coltag3);
	}
    SetObjectWidth(eventtable3, iTotalWidth2);
    eventtable3.style.visibility = 'hidden';
    
    var rRow = document.createElement("tr");
    
    cell = document.createElement("td");
    var btnSave = CreateFormButtonField("btnSave","Save", iReadOnly);
    SetObjectWidth(btnSave, 100);
    btnSave.onclick = function(){SaveEvent(false);};
    btnSave.className='grdfont grdfont10 grdRowTextAligCenter';    
    cell.appendChild(btnSave);
    cell.align = "center";  
    rRow.appendChild(cell);

    eventtablebody3.appendChild(rRow);
    
    eventtable3.appendChild(eventtablebody3);
    ni2.appendChild(eventtable3);
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
	var iOperationCode = GetObjectValue('EventOperation');
	if(iOperationCode == '[select]')
		return;
	var sFilter = GetObjectValue('EventCodeFilter');
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
	parameters.add("iOperationCode",iOperationCode);		        
	parameters.add("sFilterCode",sFilter);		        
	openModal();
	var cmbbox = document.getElementById('EventEquipmentCode');
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
	var cmbbox = document.getElementById('EventEquipmentCode');
	ComboboxClear(cmbbox);
	
	if(EquipmentCodes.length > 0)
	{
		for(var i=0;i<EquipmentCodes[0].length;i++)
		{
	        CreateDropDownBoxOption(cmbbox,i,EquipmentCodes[0][i] + ' - ' + EquipmentCodes[1][i]);
		}
	}
}


function AddNewEvent()
{
	var iEditStatus = GetEditStatus();
	if(iEditStatus == -1)
	{
		PIMS_confirm(2,'You have unsaved changes. Do you wish to save these changes?','EventSaveYes','EventSaveNo','','EventSaveCancel');
	}
	else
	{		
	    var sUser = GetUserId();
	    var sSessionId = GetSessionId();
	    var iExistingId = GetObjectValue('hfEventCode');
    	if(iExistingId == '')
    		iExistingId = -1;

    	var url = GetWebServiceRoot() + "WbsReliability";
		var parameters = new SOAPClientParameters();
		openModal();
		parameters.add("sSessionId",sSessionId);		        
		parameters.add("sUserId",sUser);		        
		parameters.add("iExistingId",iExistingId);		        
	    SOAPClient.invoke(url,"getNewEventCode",parameters,true,AddNewEventSucc);
	}
}

function AddNewEventSucc(result)
{
	if(result != null)
	{
		if(result != "")
		{
			var cmbbox = document.getElementById('EventCode');
		    if(ReliabilityEvents.length == 0)
			{
		    	var x = 0;
		    	ComboboxClear(cmbbox);
			}
		    else
	    	{
				var x = cmbbox.length;
		    	
	    	}
		    ComboBoxAddOptionInPosition(cmbbox, 1, result, -1 , false, result); //Allow for the [select]
	        //CreateDropDownBoxOption(cmbbox,x,result,result,-1);
	        cmbbox.selectedIndex = 1;
	        
	        PopulateEventBody(true, null);
		}
	}
	
	closeModal();
}

function PopulateEventBody(bNew, arrPassed)
{
	if(arrPassed != null)
	{
		SetObjectValue('hfEventCode', arrPassed.Id);
		SetObjectValue('EventName', arrPassed.EventName);
		SetObjectValue('EventLongDescription', arrPassed.LongDesc);
		SetObjectValue('EventCodeDate', arrPassed.Date);
		SetObjectValue('EventOperation', arrPassed.OperationCode);
		SetObjectValue('EventEquipmentCode', arrPassed.EquipmentCode);
		SetObjectValue('EventDuration', arrPassed.Duration);
		SetObjectValue('EventActionCode', arrPassed.ActionCode);
		SetObjectValue('EventCauseCode', arrPassed.CauseCode);
		SetObjectValue('EventComments', arrPassed.Comments);			
	}
	else
	{
	    var sNow = GetPIMSDateTimeStampMinsAMPM();
	    SetObjectValue('hfEventCode', '');
		SetObjectValue('EventName', '');
		SetObjectValue('EventLongDescription', '');
		SetObjectValue('EventCodeDate', sNow);
		SetObjectValue('EventOperation', '[select]');
		SetObjectValue('EventEquipmentCode', -1);
		SetObjectValue('EventDuration', '');
		SetObjectValue('EventActionCode', '[select]');
		SetObjectValue('EventCauseCode', '[select]');
		SetObjectValue('EventComments', '');			
	
	}
	
	//Show the body
	SetObjectVisibility('ReliabilityEventTable2', 'visible');
	SetObjectVisibility('ReliabilityEventTable3', 'visible');
	GetEquipmentCodes();
}

function GetEventEditStatus()
{	
    return GetObjectValue('hfEventStatus');
}

function SetEventEditStatus(iValue)
{
	SetEditStatus(iValue);
    return SetObjectValue('hfEventStatus', iValue);
}

function EventSaveYesFromAddNew()
{
	giAddNewEvent = 1;
	gsEventCode = GetObjectValue("EventCode");
	SaveEvent(false); //If set to true means to move to the selected menu item when the save is complete
}

function EventSaveNo()
{
	SetEventEditStatus(0);
	AddNewEvent();
}

function EventSaveCancel()
{
}

function SaveEvent(bFromConfirm)
{
	//Get all the data
	var iEventId = GetObjectValue('EventCode');
	var sEventCode = GetObjectText('EventCode');
	var sEventName = GetObjectValue('EventName');
	var sEventDesc = GetObjectValue('EventLongDescription');
	var sEventDate = GetObjectValue('EventCodeDate');
	var iEventOperation = GetObjectValue('EventOperation');
	var sEventEquipCode = GetObjectValue('EventEquipmentCode');
	var dEventDuration = GetObjectValue('EventDuration');
	var sEventActionCode = GetObjectValue('EventActionCode');
	var sEventCauseCode = GetObjectValue('EventCauseCode');
	var sEventComments = GetObjectValue('EventComments');
	
	var sSaveString = 'EventId=' + iEventId + '^EventCode=' + sEventCode +'^EventName=' + sEventName + '^EventLongDescription=' + sEventDesc + '^EventCodeDate=' + sEventDate + 
					  '^EventOperation=' + iEventOperation + '^EventEquipmentCode=' + sEventEquipCode + '^EventDuration=' + dEventDuration + '^EventActionCode=' + sEventActionCode + 
					  '^EventCauseCode=' + sEventCauseCode + '^EventComments=' + sEventComments;

    var sUser = GetUserId();
    var sSessionId = GetSessionId();
    var url = GetWebServiceRoot() + "WbsReliability";
	var parameters = new SOAPClientParameters();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
	parameters.add("bCallFromConfirm",bFromConfirm);		        
	parameters.add("sSaveString",sSaveString);		        
	openModal();
    SOAPClient.invoke(url,"setReliabilityEvent",parameters,true,SaveEventSucc);
}

function SaveEventSucc(result)
{
	var sResult = ExtractNamedPairsClass(result);
	if(sResult.Success == "Failure")
	{
		alert(sRsult.Message);
	}
	else
	{
		SetEventEditStatus(0);
		var cmbbox = document.getElementById('EventCode');
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

function RetreiveEvent()
{
    var sUser = GetUserId();
    var sSessionId = GetSessionId();
	var iEventId = GetObjectValue('EventCode');
    var url = GetWebServiceRoot() + "WbsReliability";
	var parameters = new SOAPClientParameters();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUserId",sUser);		        
	parameters.add("iId",iEventId);		        
	openModal();
    SOAPClient.invoke(url,"getReliabilityEvent",parameters,true,RetreiveEventSucc);
}

function RetreiveEventSucc(result)
{
	var sResult = ExtractNamedPairsClass(result);
	
	if(sResult.Success == "Success")
	{
		PopulateEventBody(false, sResult);	
	}
	else
	{
		alert(sResult.Message);
	}
	
	closeModal();
}

function CheckEventLock(iCompanyId)
{
    var url = GetWebServiceRoot() + "WbsReliability";
    var sUser = GetUserId();
    var sSessionId = GetSessionId();
	var iEventId = GetObjectValue('EventCode');
	var parameters = new SOAPClientParameters();
	parameters.add("sSessionId",sSessionId);		        
	parameters.add("sUsername",sUser);		        
	parameters.add("iId",iEventId);
	openModal();
    SOAPClient.invoke(url,"getReliabilityEventLock",parameters,true,CheckEventLockSucc);
}

function CheckEventLockSucc(result)
{
	var arrResults = ExtractNamedPairsClass(result);
	var iSuccess = arrResults.Success;
	
	if(iSuccess == 1)
	{
		if(arrResults.Locked == 1)
		{
			var sLockedMsg = 'Reliability Event ' + arrResults.Event + ' is currently locked by user ' + arrResults.UserId;
			alert(sLockedMsg);
		    var iExistingId = -1;
		    if(document.getElementById('hfEventCode') != null)
		    {
		    	iExistingId = GetObjectValue('hfEventCode');  
		    	if(iExistingId == '')
		    		iExistingId = -1;
		    }
			SetObjectValue('EventCode', iExistingId);
		}
		else
		{
			var iSelect = parseInt(GetObjectValue('EventCode'),10);
			RetreiveEvent();
		}
	}
	else
	{
		alert(arrResults.Message);
	    var iExistingId = -1;
	    if(document.getElementById('hfEventCode') != null)
	    {
	    	iExistingCompanyId = GetObjectValue('hfEventCode');    
	    	if(iExistingId == '')
	    		iExistingId = -1;
	    }
		SetObjectValue('EventCode', iExistingId);
	}
	
	closeModal();
}

function SetReliabilityEventLock(iId, iLocked, sMenu, sMenu)
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
		parameters.add("sExtra",sMenu);
		openModal();
	    SOAPClient.invoke(url,"setReliabilityEventLock",parameters,true,SetReliabilityEventLockSucc);
}

function SetReliabilityEventLockSucc(result)
{
	var arrResults = ExtractNamedPairsClass(result);
	var iSuccess = arrResults.Success;
	
	if(iSuccess == 1)
	{
		if(arrResults.sMenu!= '')
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
    var text_field = document.getElementById("EventCodeDate");;

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
	    var datefield = document.getElementById("EventCodeDate");
		SetObjectValue(datefield.id,cal.get_formatted_date(cal_format)); //datefield.value = cal.get_formatted_date(cal_format);
		cal.hide();
		cal_obj2 = null;
//		SaveTrackerDateDataJS(datefield);
	}
}