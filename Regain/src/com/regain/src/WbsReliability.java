package com.regain.src;
import java.text.*;
import java.util.*;
import java.util.regex.Pattern;

import com.fronesis.servlets.Backend;
import com.fronesis.servlets.Backend.*;
import com.fronesis.servlets.Backend.User.UserDetails;
import com.fronesis.servlets.UserBackend;
import com.fronesis.servlets.WBSReturn;
import com.fronesis.servlets.Backend.Utilities;


public class WbsReliability 
{	
	public WBSReturn[] get_Reliability_Equipment_Codes(String sUserId, String sSessionId, String sFilterCode, int iOperationCode)
	{
		UserBackend usr = new UserBackend();
		Reliability reliab = new Reliability();
		WBSReturn[] result = new WBSReturn[1];
		result[0] = new WBSReturn();
		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			String sRtn = "Failure^You must be logged in to use this feature, get filtered equipment codes.";
			result[0].setGridstring(sRtn, 0, 0);
		}
		else
		{   
			Reliability.ReturnCalcDetails rtnCalc = reliab.new ReturnCalcDetails();
			String sOperationPrefix = "P" + Integer.toString(iOperationCode);
			rtnCalc = reliab.GetEquipmentCodes(sOperationPrefix, sFilterCode);
			result[0].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
		}		
		return result;	
	}

	public String get_Plant_Sections(String sUserId, String sSessionId, String sOperation)
	{
		UserBackend usr = new UserBackend();
		Reliability reliab = new Reliability();
		WBSReturn[] result = new WBSReturn[1];
		result[0] = new WBSReturn();
		Reliability.ReturnCalcDetails rtnCalc = reliab.new ReturnCalcDetails();
		
		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			return "Failure^You must be logged in to use this feature, get plant sections.";
		}
		else
		{
			rtnCalc = reliab.GetPlantSections(sOperation);
			result[0].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
			return rtnCalc.sRtnString;
		}
	}

	public WBSReturn[]  getExistingEventCodes(String sUserId, String sSessionId)
	{
		UserBackend usr = new UserBackend();
		Reliability reliab = new Reliability();
		WBSReturn[] result = new WBSReturn[4];
		result[0] = new WBSReturn();
		result[1] = new WBSReturn();
		result[2] = new WBSReturn();
		result[3] = new WBSReturn();
		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			String sRtn = "Failure^You must be logged in to use this feature, get existing event codes.";
			result[0].setGridstring(sRtn, 0, 0);
			return result;	
		}
		else
		{
			Reliability.ReturnCalcDetails rtnCalc = reliab.new ReturnCalcDetails();
			
			rtnCalc = reliab.GetOperations();
			result[0].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
	
			rtnCalc = reliab.GetExistingEvents();
			result[1].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
	
			rtnCalc = reliab.GetActionCodes();
			result[2].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
	
			rtnCalc = reliab.GetCauseCodes();
			result[3].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
	
			return result;	
		}
	}

	public WBSReturn[]  getOperationCodes(String sUserId, String sSessionId)
	{
		UserBackend usr = new UserBackend();
		Reliability reliab = new Reliability();
		WBSReturn[] result = new WBSReturn[1];
		result[0] = new WBSReturn();
		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			String sRtn = "Failure^You must be logged in to use this feature, get existing event codes.";
			result[0].setGridstring(sRtn, 0, 0);
			return result;	
		}
		else
		{
			Reliability.ReturnCalcDetails rtnCalc = reliab.new ReturnCalcDetails();
			
			rtnCalc = reliab.GetOperations();
			result[0].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
		
			return result;	
		}
	}

	public WBSReturn[]  getExistingActionRequestCodes(String sUserId, String sSessionId)
	{
		UserBackend usr = new UserBackend();
		Reliability reliab = new Reliability();
		WBSReturn[] result = new WBSReturn[4];
		result[0] = new WBSReturn();
		result[1] = new WBSReturn();
		result[2] = new WBSReturn();
		result[3] = new WBSReturn();
		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			String sRtn = "Failure^You must be logged in to use this feature, get existing action request codes.";
			result[0].setGridstring(sRtn, 0, 0);
			return result;	
		}
		else
		{
			Reliability.ReturnCalcDetails rtnCalc = reliab.new ReturnCalcDetails();
			
			rtnCalc = reliab.GetOperations();
			result[0].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
	
			rtnCalc = reliab.GetExistingActionRequests();
			result[1].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
	
			rtnCalc = reliab.GetActionCategoryCodes();
			result[2].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
	
			rtnCalc = reliab.GetCauseCodes();
			result[3].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
	
			return result;	
		}
	}

	public String getNewEventCode(String sUserId, String sSessionId, int iExistingId)
	{
		UserBackend usr = new UserBackend();
		Reliability reliab = new Reliability();
		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			return "Failure^You must be logged in to use this feature, get new event code.";
		}
		else
		{
			if(iExistingId > 0)
				setReliabilityEventLock(sSessionId, sUserId, iExistingId, 0, "", "");
			
			String sNewEventCode = reliab.GetNextReliabilityEventCode();
			return sNewEventCode;
		}
	}

	public String getNewActionRequestCode(String sUserId, String sSessionId, int iExistingId, String sARExistingCode)
	{
		UserBackend usr = new UserBackend();
		Reliability reliab = new Reliability();
		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			return "Failure^You must be logged in to use this feature, get new action request code.";
		}
		else
		{
			if(iExistingId > 0)
				setActionRequestLock(sSessionId, sUserId, sARExistingCode, 0, "", "");
			
			String sNewActionRequestCode = reliab.GetNextActionRequestCode();
			return sNewActionRequestCode;
		}
	}


	public String getReliabilityEvent(String sSessionId, String sUserId, int iId)
	{
		UserBackend usr = new UserBackend();
		String sRtn = "";
		Reliability reliab = new Reliability();
		Reliability.ResultDetails rtn = reliab.new ResultDetails();

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			return "Failure^You must be logged in to use this feature, get reliability event details.";
		}
		else
		{
				
			rtn = reliab.GetEventInfo(iId);
			if(rtn.bResult)
			{
				setReliabilityEventLock(sSessionId, sUserId, iId, 1, "", "");
				sRtn = "Success=Success^" + rtn.sResult; 
			}
			else
			{
				sRtn = "Success=Failure^Message=" + rtn.sMessage + "^Id=" + rtn.iId + "^"; 				
			}
			
			return sRtn;
		}
	}

	public String getActionRequest(String sSessionId, String sUserId, String sARCode)
	{
		UserBackend usr = new UserBackend();
		String sRtn = "";
		Reliability reliab = new Reliability();
		Reliability.ResultDetails rtn = reliab.new ResultDetails();

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			return "Failure^You must be logged in to use this feature, get action request details.";
		}
		else
		{
				
			rtn = reliab.GetActionRequestInfo(sARCode);
			if(rtn.bResult)
			{
				setActionRequestLock(sSessionId, sUserId, sARCode, 1, "", "");
				sRtn = "Success=Success^" + rtn.sResult; 
			}
			else
			{
				sRtn = "Success=Failure^Message=" + rtn.sMessage + "^Id=" + rtn.iId + "^"; 				
			}
			
			return sRtn;
		}
	}

	public String getReliabilityEventLock(String sSessionId, String sUsername, int iId) 
	{
		Reliability reliab = new Reliability();
		Reliability.ReturnClassLock rtnClass = reliab.new ReturnClassLock();
		String sReturn = "";
		UserBackend usr = new UserBackend();

		if(!usr.IsUserLoggedIn(sSessionId, sUsername, 2))
		{
			sReturn = "Failure^You must be logged in to use this feature, get reliability event lock information.";
		}
		else
		{
			rtnClass = reliab.GetReliabilityEventLocked(iId, sUsername);
			
			if(rtnClass.bValue)
			{
				sReturn = "Success=1^Locked=" + rtnClass.iValue + "^EventCode=" + rtnClass.sCode + "^UserId=" + rtnClass.sActiveUser + "^";
			}
			else
			{
				sReturn = "Success=0^Message=" + rtnClass.sRtnMsg + "^";			
			}
		}
		return sReturn;
		
	}

	public String getActionRequestLock(String sSessionId, String sUsername, String sARCode) 
	{
		Reliability reliab = new Reliability();
		Reliability.ReturnClassLock rtnClass = reliab.new ReturnClassLock();
		String sReturn = "";
		UserBackend usr = new UserBackend();

		if(!usr.IsUserLoggedIn(sSessionId, sUsername, 2))
		{
			sReturn = "Failure^You must be logged in to use this feature, get action request lock information.";
		}
		else
		{
			rtnClass = reliab.GetActionRequestLocked(sARCode, sUsername);
			
			if(rtnClass.bValue)
			{
				sReturn = "Success=1^Locked=" + rtnClass.iValue + "^ActionRequestCode=" + rtnClass.sCode + "^UserId=" + rtnClass.sActiveUser + "^";
			}
			else
			{
				sReturn = "Success=0^Message=" + rtnClass.sRtnMsg + "^";			
			}
		}
		return sReturn;
		
	}

	public String setReliabilityEventLock(String sSessionId, String sUsername, int iId, int iLocked, String sMenu, String sExtra) 
	{
		Reliability reliab = new Reliability();
		Reliability.ReturnClassInt rtnClass = reliab.new ReturnClassInt();
		String sReturn = "";
		UserBackend usr = new UserBackend();

		if(!usr.IsUserLoggedIn(sSessionId, sUsername, 2))
		{
			sReturn = "Failure^You must be logged in to use this feature, set reliability event lock or unlock.";
		}
		else
		{
			rtnClass = reliab.SetReliabilityEventLocked(iId, iLocked, sUsername);
			
			if(rtnClass.bValue)
			{
				sReturn = "Success=1^sMenu=" + sMenu + "^sExtra=" + sExtra + "^";
			}
			else
			{
				sReturn = "Success=0^Message=" + rtnClass.sRtnMsg + "^";			
			}
		}
		return sReturn;
		
	}

	public String setActionRequestLock(String sSessionId, String sUsername, String sARCode, int iLocked, String sMenu, String sExtra) 
	{
		Reliability reliab = new Reliability();
		Reliability.ReturnClassInt rtnClass = reliab.new ReturnClassInt();
		String sReturn = "";
		UserBackend usr = new UserBackend();

		if(!usr.IsUserLoggedIn(sSessionId, sUsername, 2))
		{
			sReturn = "Failure^You must be logged in to use this feature, set action request lock or unlock.";
		}
		else
		{
			rtnClass = reliab.SetActionRequestLocked(sARCode, iLocked, sUsername);
			
			if(rtnClass.bValue)
			{
				sReturn = "Success=1^sMenu=" + sMenu + "^sExtra=" + sExtra + "^";
			}
			else
			{
				sReturn = "Success=0^Message=" + rtnClass.sRtnMsg + "^";			
			}
		}
		return sReturn;
		
	}

	public String setReliabilityEvent(String sSessionId, String sUserId, boolean bCallFromConfirm, String sSaveString)
	{
		Backend be = new Backend();
		UserBackend usr = new UserBackend();
		Utilities util = be.new Utilities();
		ArrayList<ArrayList<String>> ItemArray = new ArrayList<ArrayList<String>>();
		String sRtn = "";
		Reliability reliab = new Reliability();
		Reliability.EventDetailsInfo event = reliab.new EventDetailsInfo();
		Reliability.ResultReturnBool rtn = reliab.new ResultReturnBool();

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			return "Failure^You must be logged in to use this feature, set reliability event details.";
		}
		else
		{
			String[] sSaveItems = sSaveString.split(Pattern.quote("||"));
			
			for(int j = 0; j< sSaveItems.length; j++)
			{
				ItemArray = util.Extract_Paired_Values(sSaveItems[j]);
				ArrayList<String> NamesArray = new ArrayList<String>();
				ArrayList<String> ValueArray = new ArrayList<String>();
	
				NamesArray = (ArrayList<String>)ItemArray.get(0);
				ValueArray = (ArrayList<String>)ItemArray.get(1);
				event.sActiveUser = sUserId;
	
				for (int i = 0; i < NamesArray.size(); i++)
				{
					if (NamesArray.get(i).toString().equals("EventId"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							event.Id = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							event.Id = -1;
						}
					}
	
					if (NamesArray.get(i).toString().equals("EventCode"))
					{
						event.sEventCode = ValueArray.get(i);
					}
	
					if (NamesArray.get(i).toString().equals("EventName"))
					{
						event.sName = ValueArray.get(i);
					}
					
					if (NamesArray.get(i).toString().equals("EventLongDescription"))
					{
						event.sLongDescription = ValueArray.get(i);
					}
	
					if (NamesArray.get(i).toString().equals("EventCodeDate"))
					{
						event.sEventDate = ValueArray.get(i);
					}
	
					if (NamesArray.get(i).toString().equals("EventOperation"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							event.iOperationCode = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							event.iOperationCode = -1;
						}
					}
	
					if (NamesArray.get(i).toString().equals("EventEquipmentCode"))
					{
						event.sEquipCode = ValueArray.get(i);
					}
	
					if (NamesArray.get(i).toString().equals("EventDuration"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							event.dDuration = Double.parseDouble(ValueArray.get(i));
						}
						else
						{
							event.dDuration  = 0.0;
						}
					}
	
					if (NamesArray.get(i).toString().equals("EventActionCode"))
					{
						event.sActionCode = ValueArray.get(i);
					}
	
					if (NamesArray.get(i).toString().equals("EventCauseCode"))
					{
						event.sCauseCode = ValueArray.get(i);
					}
	
					if (NamesArray.get(i).toString().equals("EventComments"))
					{
						event.sComments = ValueArray.get(i);
					}
	
					
				}
				
				rtn = reliab.SaveEventInfo(event);
				if(rtn.bResult)
				{
					if(!bCallFromConfirm)
						setReliabilityEventLock(sSessionId, sUserId, rtn.iId, 1, "", "");

					sRtn = "Success=" + bCallFromConfirm + "^Id=" + rtn.iId + "^"; 
				}
				else
				{
					sRtn = "Success=Failure^Message=" + rtn.sMessage + "^Id=" + rtn.iId + "^"; 				
				}
			}
			
			return sRtn;
		}

	}
	
	public String setActionRequest(String sSessionId, String sUserId, boolean bCallFromConfirm, String sSaveString)
	{
		Backend be = new Backend();
		UserBackend usr = new UserBackend();
		Utilities util = be.new Utilities();
		ArrayList<ArrayList<String>> ItemArray = new ArrayList<ArrayList<String>>();
		String sRtn = "";
		Reliability reliab = new Reliability();
		Reliability.ActionRequestDetailsInfo ActionRequest = reliab.new ActionRequestDetailsInfo();
		Reliability.ResultReturnBool rtn = reliab.new ResultReturnBool();

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			return "Failure^You must be logged in to use this feature, set action request details.";
		}
		else
		{
			String[] sSaveItems = sSaveString.split(Pattern.quote("||"));
			
			for(int j = 0; j< sSaveItems.length; j++)
			{
				ItemArray = util.Extract_Paired_Values(sSaveItems[j]);
				ArrayList<String> NamesArray = new ArrayList<String>();
				ArrayList<String> ValueArray = new ArrayList<String>();
	
				NamesArray = (ArrayList<String>)ItemArray.get(0);
				ValueArray = (ArrayList<String>)ItemArray.get(1);
				ActionRequest.sActiveUser = sUserId;
	
				for (int i = 0; i < NamesArray.size(); i++)
				{
					if (NamesArray.get(i).toString().equals("ActionRequestId"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							ActionRequest.Id = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							ActionRequest.Id = -1;
						}
					}
	
					if (NamesArray.get(i).toString().equals("ActionRequestCode"))
					{
						ActionRequest.sARCode = ValueArray.get(i);
					}
	
					if (NamesArray.get(i).toString().equals("ActionCategoryCode"))
					{
						ActionRequest.sActionCategoryCode = ValueArray.get(i);
					}

					if (NamesArray.get(i).toString().equals("ActionRequestName"))
					{
						ActionRequest.sName = ValueArray.get(i);
					}
					
					if (NamesArray.get(i).toString().equals("ActionRequestLongDescription"))
					{
						ActionRequest.sLongDescription = ValueArray.get(i);
					}
	
					if (NamesArray.get(i).toString().equals("ActionRequestDate"))
					{
						ActionRequest.sARDate = ValueArray.get(i);
					}
	
					if (NamesArray.get(i).toString().equals("ActionRequestOperation"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							ActionRequest.iOperationCode = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							ActionRequest.iOperationCode = -1;
						}
					}
	
					if (NamesArray.get(i).toString().equals("ActionRequestEquipmentCode"))
					{
						ActionRequest.sEquipCode = ValueArray.get(i);
					}
	
					if (NamesArray.get(i).toString().equals("ActionRequestCauseCode"))
					{
						ActionRequest.sCauseCode = ValueArray.get(i);
					}
	
					if (NamesArray.get(i).toString().equals("ActionRequestComments"))
					{
						ActionRequest.sComments = ValueArray.get(i);
					}
	
					if (NamesArray.get(i).toString().equals("ActionRequestResponse"))
					{
						ActionRequest.sResponse = ValueArray.get(i);
					}
					
				}
				
				rtn = reliab.SaveActionRequestInfo(ActionRequest);
				if(rtn.bResult)
				{
					if(!bCallFromConfirm)
						setActionRequestLock(sSessionId, sUserId, ActionRequest.sARCode, 1, "", "");

					sRtn = "Success=" + bCallFromConfirm + "^Id=" + rtn.iId + "^"; 
				}
				else
				{
					sRtn = "Success=Failure^Message=" + rtn.sMessage + "^Id=" + rtn.iId + "^"; 				
				}
			}
			
			return sRtn;
		}
	}

	public String emailActionRequestReport(String sSessionId, String sUserId, int iOperationCode, String sStartDate, String sEndDate, String sOperationName)
	{
		try
		{
			Backend be = new Backend();
			UserBackend usr = new UserBackend();
			Excel xcl = be.new Excel();
			String sRtn = "";
			ReturnClassExcel rtn = be.new ReturnClassExcel();
			ReturnClassBool rtn2 = be.new ReturnClassBool();
			Email mail = be.new Email();
			DateClass dte = be.new DateClass();
			User usr2 = be.new User();
			UserDetails usrdetails = usr2.new UserDetails(); 
	
			if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
			{
				return "Failure^You must be logged in to use this feature, run Action Request report.";
			}
			else
			{
				String[] sParamNames = new String[3];
				sParamNames[0] = "@iOperation";
				sParamNames[1] = "@pdtStartDate";
				sParamNames[2] = "@pdtEndDate";
				String sBody =  "Attached is your requested Action Request Report\r\nOperatrion: " + sOperationName + "\r\nStart Date: " + sStartDate + "\r\nEnd Date: " + sEndDate + "\r\n";
				sStartDate = sStartDate + " 00:00:00";
				sEndDate = sEndDate + " 23:59:59";
				DateFormat format = new SimpleDateFormat("dd/MM/yyyy hh:mm:ss", Locale.ENGLISH);
				java.util.Date dtStartDate = format.parse(sStartDate);
				java.util.Date dtEndDate = format.parse(sEndDate);
				String sStartDate2 = dte.FormatDate(dtStartDate, "yyyyMMdd hh:mm:ss");
				String sEndDate2 = dte.FormatDate(dtEndDate, "yyyyMMdd hh:mm:ss");
				
				String[] sParamValues = new String[3];
				sParamValues[0] = Integer.toString(iOperationCode);
				sParamValues[1] = sStartDate2;
				sParamValues[2] = sEndDate2;

				//Use an existing template and start at row 7 column 1 (ie A7)
				String sReportName = "ActRqst_" + dte.GetDateTimeStamp("ddMMyyyy_hhmmss") + ".xlsx";
				rtn = xcl.WriteExcelFile(2, "SP_rptActionRequest", sParamNames, sParamValues, false, sReportName, "ActRqst_template.xlsx", 1, 7, 1);
				if(rtn.bValue)
				{
					String[] sAttachments = new String[1];
					sAttachments[0] = rtn.sFile;
					usrdetails = usr2.GetUser(sUserId, 2);
					rtn2 = mail.email_message("Action Request Report - " + sOperationName, sBody, sAttachments, usrdetails.sEmail, "", "");
					if(rtn2.bValue)
					{
						sRtn = "Success^";
					}
					else
					{
						sRtn =  "Failure^" + rtn2.sRtnMsg + "^";				
					}
				}
				else
				{
					sRtn =  "Failure^" + rtn.sRtnMsg + "^";				
				}
			}
				
			return sRtn;
		}
		catch(java.lang.Exception e)
		{
			return "Failure^" + e.getMessage() + "^";
		}
	}
}
