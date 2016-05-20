package com.regain.src;

import java.util.ArrayList;
import java.util.regex.Pattern;

import com.fronesis.servlets.Backend;
import com.fronesis.servlets.UserBackend;
import com.fronesis.servlets.WBSReturn;
import com.fronesis.servlets.Backend.FileUtilities;
import com.fronesis.servlets.Backend.Utilities;

public class WbsDocument 
{
	public WBSReturn getDocTypes(String sUserId, String sSessionId)
	{
		UserBackend usr = new UserBackend();
		Documentation docs = new Documentation();
		WBSReturn result = new WBSReturn();

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			String sRtn = "Failure^You must be logged in to use this feature, get document types.";
			result.setGridstring(sRtn, 0, 0);
			return result;	
		}
		else
		{
			
			Documentation.ReturnCalcDetails rtnCalc = docs.new ReturnCalcDetails();
			
			rtnCalc = docs.GetDocumentTypes(sUserId);
			result.setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
			
			return result;	
		}
	}

	public WBSReturn getJobCodes(String sUserId, String sSessionId, String sSearchCriteria)
	{
		UserBackend usr = new UserBackend();
		Documentation docs = new Documentation();
		WBSReturn result = new WBSReturn();

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			String sRtn = "Failure^You must be logged in to use this feature, get job codes.";
			result.setGridstring(sRtn, 0, 0);
			return result;	
		}
		else
		{
			
			Documentation.ReturnCalcDetails rtnCalc = docs.new ReturnCalcDetails();
			
			rtnCalc = docs.GetJobCodes(sSearchCriteria, sUserId);
			result.setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
			
			return result;	
		}
	}

	public String getSearchDocs(String sUserId, String sSessionId, String sJobNo, String sDocType)
	{
		UserBackend usr = new UserBackend();
		Backend be = new Backend(2);
		FileUtilities FileUtil = be.new FileUtilities();
		String sPartSearch = "";
		
		if(sDocType.equals(""))
		{
			sPartSearch = sJobNo;
		}

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			return "Failure^You must be logged in to use this feature, search documents for modification.";
		}
		else
		{
			return FileUtil.GetWindchillFileSearchResults(2, sJobNo + sDocType, sPartSearch, false, 1, sUserId); //The last parameter means only search on document number
		}		
	}

	public String getDocDetails(String sUserId, String sSessionId, String sDocNo)
	{
		UserBackend usr = new UserBackend();
		Backend be = new Backend(2);
		FileUtilities FileUtil = be.new FileUtilities();


		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			return "Failure^You must be logged in to use this feature, get document details.";
		}
		else
		{
			return FileUtil.GetWindchillDocDetails(2, sDocNo); //The last parameter means only search on document number
		}		
	}

	public String getDocVerification(String sUserId, String sSessionId, String sDocNo)
	{
		UserBackend usr = new UserBackend();
		Backend be = new Backend(2);
		FileUtilities FileUtil = be.new FileUtilities();


		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			return "Failure^You must be logged in to use this feature, verify document exists.";
		}
		else
		{
			return FileUtil.GetWindchillDocExists(2, sDocNo).toString(); //The last parameter means only search on document number
		}		
	}

	public WBSReturn[] getFunctionalLocations(String sUserId, String sSessionId, String sJobNo, String sDocNo)
	{
		UserBackend usr = new UserBackend();
		Documentation docs = new Documentation();
		WBSReturn[] result = new WBSReturn[2];
		result[0] = new WBSReturn();
		result[1] = new WBSReturn();

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			String sRtn = "Failure^You must be logged in to use this feature, get plant functional locations.";
			result[0].setGridstring(sRtn, 0, 0);
			return result;	
		}
		else
		{						
			Documentation.ReturnCalcDetails rtnCalc = docs.new ReturnCalcDetails();
			rtnCalc = docs.GetFunctionalLocations(sDocNo);		
			result[0].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
			rtnCalc = docs.GetAllFunctionalLocations(sJobNo);		
			result[1].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
			
			return result;	
		}
	}

	public WBSReturn getDocAttachments(String sUserId, String sSessionId, String sDocNo)
	{
		UserBackend usr = new UserBackend();
		Documentation docs = new Documentation();
		WBSReturn result = new WBSReturn();

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			String sRtn = "Failure^You must be logged in to use this feature, get job codes.";
			result.setGridstring(sRtn, 0, 0);
			return result;	
		}
		else
		{
			
			Documentation.ReturnCalcDetails rtnCalc = docs.new ReturnCalcDetails();
			
			rtnCalc = docs.GetWindchillDocAttachments(sDocNo);
			result.setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
			
			return result;	
		}
	}

	public WBSReturn[] getJobAccessLevels(String sUserId, String sSessionId)
	{
		UserBackend usr = new UserBackend();
		Documentation docs = new Documentation();
		WBSReturn[] result = new WBSReturn[2];
		result[0] = new WBSReturn();
		result[1] = new WBSReturn();

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			String sRtn = "Failure^You must be logged in to use this feature, get job access levels.";
			result[0].setGridstring(sRtn, 0, 0);
			return result;	
		}
		else
		{
			
			Documentation.ReturnCalcDetails rtnCalc = docs.new ReturnCalcDetails();
			
			rtnCalc = docs.GetJobAccessMatrixInfo();
			result[0].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);
			
			rtnCalc = docs.GetDocTypeAccessMatrixInfo();
			result[1].setGridstring(rtnCalc.sRtnString, rtnCalc.iRows, rtnCalc.iCols);

			return result;	
		}
	}

	public String deleteWindchillAttachment(String sUserId, String sSessionId, String sDocNo, int iAttachmentId)
	{
		UserBackend usr = new UserBackend();
		Documentation docs = new Documentation();
		Documentation.ReturnClassInt rtnCalc = docs.new ReturnClassInt();
		String sRtn = "";
		
		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			sRtn = "Failure^You must be logged in to use this feature, get job codes.";
			return sRtn;	
		}
		else
		{			
			rtnCalc = docs.DeleteWindchillAttachment(sDocNo, iAttachmentId);
			if(rtnCalc.bValue)
			{
				sRtn = "Success^"+ iAttachmentId;
			}
			else
			{
				sRtn = "Failure^" + rtnCalc.sRtnMsg;
			}
			return sRtn;	
		}
	}
	
	public String[] setJobAccessLevels(String sSessionId, String sUserId, String sJobSaveString, String sDocTypeSaveString, boolean bCallFromConfirm)
	{
		Backend be = new Backend();
		Documentation docs = new Documentation();		
		Documentation.ReturnClassInt rtnClass = docs.new ReturnClassInt();
		Documentation.JobAccessLevel jobAccess = docs.new JobAccessLevel();
		Documentation.DocTypeAccessLevel doctypeAccess = docs.new DocTypeAccessLevel();
		String[] sReturn = new String[2];
		sReturn[0] = "";
		sReturn[1] = "";
		UserBackend usr = new UserBackend();
		Utilities util = be.new Utilities();
		ArrayList<ArrayList<String>> ItemArray = new ArrayList<ArrayList<String>>();
		String[] sJobSaveItems = sJobSaveString.split(Pattern.quote("||"));
		String[] sDocTypeSaveItems = sDocTypeSaveString.split(Pattern.quote("||"));
		int iRowId = -1;
		int iColId = -1;
		
		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			sReturn[0] = "Failure^You must be logged in to use this feature, save company compliancy and competency details.";
		}
		else
		{
			for(int j = 0; j< sJobSaveItems.length; j++)
			{
				ItemArray = util.Extract_Paired_Values(sJobSaveItems[j]);
				ArrayList<String> NamesArray = new ArrayList<String>();
				ArrayList<String> ValueArray = new ArrayList<String>();
	
				NamesArray = (ArrayList<String>)ItemArray.get(0);
				ValueArray = (ArrayList<String>)ItemArray.get(1);
				Boolean bProceed = false;
	
				if(NamesArray.size() > 0)
					bProceed = true;
				
				for (int i = 0; i < NamesArray.size(); i++)
				{
					if (NamesArray.get(i).toString().equals("RowId"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							iRowId = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							iRowId = -1;
						}
					}

					if (NamesArray.get(i).toString().equals("ColId"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							iColId = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							iColId = -1;
						}
					}

					if (NamesArray.get(i).toString().equals("JobAccessId"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							jobAccess.iId = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							jobAccess.iId = -1;
						}
					}

					if (NamesArray.get(i).toString().equals("JobId"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							jobAccess.iJobId = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							jobAccess.iJobId = -1;
						}
					}

					if (NamesArray.get(i).toString().equals("RoleId"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							jobAccess.iRoleId = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							jobAccess.iRoleId = -1;
						}
					}

					if (NamesArray.get(i).toString().equals("AccessLevel"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							jobAccess.iAccessLevel = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							jobAccess.iAccessLevel = -1;
						}
					}

					
				}
				
				if(bProceed)
				{
					rtnClass = docs.SetJobAccessLevel(jobAccess);

					if(rtnClass.bValue)
					{
						sReturn[0] += "Success=Success^Row=" + iRowId + "^Col="+ iColId + "^Id="+ rtnClass.iValue + "^bCallFromConfirm="+ bCallFromConfirm + "^||";
					}
					else
					{
						sReturn[0] += "Success=Failure^Row=" + iRowId + "^Col="+ iColId + "^Message="+ rtnClass.sRtnMsg + "^||";					
						//bOverallFail = true;
					}
				}
			}
			
			if(sReturn[0].length() > 2)
				sReturn[0] = sReturn[0].substring(0, sReturn[0].length() - 2);

			for(int j = 0; j< sDocTypeSaveItems.length; j++)
			{
				ItemArray = util.Extract_Paired_Values(sDocTypeSaveItems[j]);
				ArrayList<String> NamesArray = new ArrayList<String>();
				ArrayList<String> ValueArray = new ArrayList<String>();
	
				NamesArray = (ArrayList<String>)ItemArray.get(0);
				ValueArray = (ArrayList<String>)ItemArray.get(1);
				Boolean bProceed = false;
	
				if(NamesArray.size() > 0)
					bProceed = true;
				
				for (int i = 0; i < NamesArray.size(); i++)
				{
					if (NamesArray.get(i).toString().equals("RowId"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							iRowId = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							iRowId = -1;
						}
					}

					if (NamesArray.get(i).toString().equals("ColId"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							iColId = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							iColId = -1;
						}
					}

					if (NamesArray.get(i).toString().equals("DocTypeAccessId"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							doctypeAccess.iId = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							doctypeAccess.iId = -1;
						}
					}

					if (NamesArray.get(i).toString().equals("DocCode"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							doctypeAccess.sDocCode = ValueArray.get(i);
						}
						else
						{
							doctypeAccess.sDocCode = "";
						}
					}

					if (NamesArray.get(i).toString().equals("RoleId"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							doctypeAccess.iRoleId = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							doctypeAccess.iRoleId = -1;
						}
					}

					if (NamesArray.get(i).toString().equals("AccessLevel"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							doctypeAccess.iAccessLevel = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							doctypeAccess.iAccessLevel = -1;
						}
					}

					
				}
				
				if(bProceed)
				{
					rtnClass = docs.SetDocTypeAccessLevel(doctypeAccess);

					if(rtnClass.bValue)
					{
						sReturn[1] += "Success=Success^Row=" + iRowId + "^Col="+ iColId + "^Id="+ rtnClass.iValue + "^bCallFromConfirm="+ bCallFromConfirm + "^||";
					}
					else
					{
						sReturn[1] += "Success=Failure^Row=" + iRowId + "^Col="+ iColId + "^Message="+ rtnClass.sRtnMsg + "^||";					
					}
				}
			}
		}
		
		if(sReturn[1].length() > 2)
			sReturn[1] = sReturn[1].substring(0, sReturn[1].length() - 2);

		return sReturn;
	}

	public String setWindchillDocument(String sSessionId, String sUserId, boolean bCallFromConfirm, String sDocDetailsString)
	{
		Backend be = new Backend();
		UserBackend usr = new UserBackend();
		Utilities util = be.new Utilities();
		ArrayList<ArrayList<String>> ItemArray = new ArrayList<ArrayList<String>>();
		String sRtn = "";
		Documentation document = new Documentation();
		Documentation.WindchillDocInfo windchillDoc = document.new WindchillDocInfo();
		Documentation.ResultReturnString rtn = document.new ResultReturnString();

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			return "Failure^You must be logged in to use this feature, set document details.";
		}
		else
		{
				ItemArray = util.Extract_Paired_Values(sDocDetailsString);
				ArrayList<String> NamesArray = new ArrayList<String>();
				ArrayList<String> ValueArray = new ArrayList<String>();
	
				NamesArray = (ArrayList<String>)ItemArray.get(0);
				ValueArray = (ArrayList<String>)ItemArray.get(1);
				windchillDoc.sDocOriginator = sUserId;
	
				for (int i = 0; i < NamesArray.size(); i++)
				{
					if (NamesArray.get(i).toString().equals("NewDoc"))
					{
						if(!ValueArray.get(i).equals(""))
						{
							windchillDoc.iNewFlag = Integer.parseInt(ValueArray.get(i));
						}
						else
						{
							windchillDoc.iNewFlag = -1;
						}
					}
	
					if (NamesArray.get(i).toString().equals("DocNumber"))
					{
						windchillDoc.sDocNo = ValueArray.get(i);
					}
	
					if (NamesArray.get(i).toString().equals("DocName"))
					{
						windchillDoc.sDocName = ValueArray.get(i);
					}

					if (NamesArray.get(i).toString().equals("DocLongDesc"))
					{
						windchillDoc.sDocLongDesc = ValueArray.get(i);
					}

					if (NamesArray.get(i).toString().equals("DocOrigId"))
					{
						windchillDoc.sDocOrigId = ValueArray.get(i);
					}

					if (NamesArray.get(i).toString().equals("DocCheckInComments"))
					{
						windchillDoc.sCheckInComments = ValueArray.get(i);
					}
				}
				
				rtn = document.SaveWindchillDocInfo(windchillDoc);
				if(rtn.bResult)
				{
					sRtn = "Success=" + bCallFromConfirm + "^DocNo=" + rtn.sRtn + "^"; 
				}
				else
				{
					sRtn = "Success=Failure^Message=" + rtn.sMessage + "^DocNo=" + rtn.sRtn + "^"; 				
				}
			
			return sRtn;
		}
	}

}
