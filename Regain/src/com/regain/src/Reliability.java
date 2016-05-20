package com.regain.src;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.Locale;

import com.fronesis.servlets.Backend;
import com.fronesis.servlets.Backend.Database;
import com.fronesis.servlets.Backend.ReturnNextId;
import com.fronesis.servlets.Backend.Utilities;

public class Reliability 
{
	public class EventDetailsInfo
	{
		int Id; 
		String sEventCode; 
		String sName; 
		String sLongDescription; 
		int iOperationCode;
		String sEventDate; 
		String sEquipCode; 
		double dDuration; 
		String sActionCode; 
		String sCauseCode; 
		String sComments;
		String sActiveUser;
	}

	public class ActionRequestDetailsInfo
	{
		int Id; 
		String sARCode = ""; 
		String sActionCategoryCode = ""; 
		String sName = ""; 
		String sLongDescription = ""; 
		int iOperationCode = -1;
		String sARDate = ""; 
		String sEquipCode = ""; 
		String sCauseCode = ""; 
		String sComments = "";
		String sResponse = "";
		String sActiveUser = "";
	}


	public class ReturnCalcDetails
	{
		String sRtnString;
		int iRows;
		int iCols;
	}

	public class ResultReturnBool
	{
		int iId;
		boolean bResult;
		String sMessage;
	}

	public class ReturnClassInt
	{
		boolean bValue;
		int iValue;
		String sRtnMsg;
	}

	public class ResultDetails
	{
		int iId;
		boolean bResult;
		String sResult;
		String sMessage;
	}

	public class ReturnClassLock
	{
		boolean bValue;
		int iValue;
		String sCode;
		String sActiveUser;
		String sRtnMsg;
	}

	public ReturnCalcDetails GetEquipmentCodes(String sOperationPrefix, String sFilterInfo)
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(3);
		Database DB = be.new Database();
		int i;
		String sPartNumber = "";
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();

		sSQL =  "select  PM.WTPartNumber, PM.name " +
				"from [wcadmin].[WTPartMaster] PM, [wcadmin].[PDMLinkProduct] PD " +
				"where PM.idA3containerReference = PD.idA2A2 " +
				"and PM.WTPartNumber like '" + sFilterInfo + "%' " +
				"and Left(PM.WTPartNumber,1) = 'P' " +
				"and PD.namecontainerInfo like '%" + sOperationPrefix + "%'" +
				"order by 1";

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (java.lang.Exception e) 
		{
			sPartNumber = e.getMessage();
		}

		if (iRecords > 0)
		{
			try
			{
				for(i=0;i<iRecords;i++)
				{
					sPartNumber += rst.getString("WTPartNumber") + "^" + rst.getString("name") + "^";	
					if(rst.wasNull())
					{
						sPartNumber = "^";					
					}
					
					rst.next();
				}
			}
			catch (java.lang.Exception e) 
			{
				sPartNumber = e.getMessage();
			}
		}
		else
		{
			sPartNumber = "";
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sPartNumber = e.getMessage();
		}
		
		rtnSet.sRtnString = sPartNumber;
		rtnSet.iRows = iRecords;
		rtnSet.iCols = 2;
		return rtnSet;

	}
	
	public ReturnCalcDetails GetOperations()
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(2);
		Database DB = be.new Database();
		int i;
		String sOperationString = "";
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();

		sSQL = "select Job as Code, Ltrim(RTrim(Replace(JobName, Job, ''))) as Description from vwWindchillJobCodesParentChild where Job = Parent order by 1";

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (java.lang.Exception e) 
		{
			sOperationString = e.getMessage();
		}

		if (iRecords > 0)
		{
			try
			{
				for(i=0;i<iRecords;i++)
				{
					if(rst.wasNull())
					{
						sOperationString = "^";					
					}
					else
					{
						sOperationString += rst.getString("Code") + "^" +  rst.getString("Description") + "^";	
					}
					rst.next();
				}
			}
			catch (java.lang.Exception e) 
			{
				sOperationString = e.getMessage();
			}
		}
		else
		{
			sOperationString = "";
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sOperationString = e.getMessage();
		}
		
		rtnSet.sRtnString = sOperationString;
		rtnSet.iRows = iRecords;
		rtnSet.iCols = 2;
		return rtnSet;

	}

	public ReturnCalcDetails GetClientCodes()
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(2);
		Database DB = be.new Database();
		int i;
		String sClientString = "";
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();

		sSQL = "select * from tblClients Order By 1";

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (java.lang.Exception e) 
		{
			sClientString = e.getMessage();
		}

		if (iRecords > 0)
		{
			try
			{
				for(i=0;i<iRecords;i++)
				{
					if(rst.wasNull())
					{
						sClientString = "^";					
					}
					else
					{
						sClientString += rst.getString("Code") + "^" +  rst.getString("Description") + "^";	
					}
					rst.next();
				}
			}
			catch (java.lang.Exception e) 
			{
				sClientString = e.getMessage();
			}
		}
		else
		{
			sClientString = "";
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sClientString = e.getMessage();
		}
		
		rtnSet.sRtnString = sClientString;
		rtnSet.iRows = iRecords;
		rtnSet.iCols = 2;
		return rtnSet;

	}

	public ReturnCalcDetails GetMaterialCodes()
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(2);
		Database DB = be.new Database();
		int i;
		String sClientString = "";
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();

		sSQL = "select * from tblMaterialCodes Order By 1";

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (java.lang.Exception e) 
		{
			sClientString = e.getMessage();
		}

		if (iRecords > 0)
		{
			try
			{
				for(i=0;i<iRecords;i++)
				{
					if(rst.wasNull())
					{
						sClientString = "^";					
					}
					else
					{
						sClientString += rst.getString("MaterialCode") + "^" +  rst.getString("MaterialDescription") + "^";	
					}
					rst.next();
				}
			}
			catch (java.lang.Exception e) 
			{
				sClientString = e.getMessage();
			}
		}
		else
		{
			sClientString = "";
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sClientString = e.getMessage();
		}
		
		rtnSet.sRtnString = sClientString;
		rtnSet.iRows = iRecords;
		rtnSet.iCols = 2;
		return rtnSet;

	}
	
	public ReturnCalcDetails GetActionCodes()
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(3);
		Database DB = be.new Database();
		int i;
		String sActionCodeString = "";
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();

		sSQL =  "select  PM.WTPartNumber, PM.name " +
				"from [wcadmin].[WTPartMaster] PM " +
				"where WTPartNumber like 'SC%'";

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (java.lang.Exception e) 
		{
			sActionCodeString = e.getMessage();
		}

		if (iRecords > 0)
		{
			try
			{
				for(i=0;i<iRecords;i++)
				{
					if(rst.wasNull())
					{
						sActionCodeString = "^";					
					}
					else
					{
						sActionCodeString += rst.getString("WTPartNumber") + "^" +  rst.getString("name") + "^";	
					}
					rst.next();
				}
			}
			catch (java.lang.Exception e) 
			{
				sActionCodeString = e.getMessage();
			}
		}
		else
		{
			sActionCodeString = "";
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sActionCodeString = e.getMessage();
		}
		
		rtnSet.sRtnString = sActionCodeString;
		rtnSet.iRows = iRecords;
		rtnSet.iCols = 2;
		return rtnSet;

	}

	public ReturnCalcDetails GetActionCategoryCodes()
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(2);
		Database DB = be.new Database();
		int i;
		String sActionCategoryCodeString = "";
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();

		sSQL =  "select * from tblActionCategories";

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (java.lang.Exception e) 
		{
			sActionCategoryCodeString = e.getMessage();
		}

		if (iRecords > 0)
		{
			try
			{
				for(i=0;i<iRecords;i++)
				{
					if(rst.wasNull())
					{
						sActionCategoryCodeString = "^";					
					}
					else
					{
						sActionCategoryCodeString += rst.getString("Code") + "^" +  rst.getString("Description") + "^";	
					}
					rst.next();
				}
			}
			catch (java.lang.Exception e) 
			{
				sActionCategoryCodeString = e.getMessage();
			}
		}
		else
		{
			sActionCategoryCodeString = "";
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sActionCategoryCodeString = e.getMessage();
		}
		
		rtnSet.sRtnString = sActionCategoryCodeString;
		rtnSet.iRows = iRecords;
		rtnSet.iCols = 2;
		return rtnSet;

	}

	public ReturnCalcDetails GetCauseCodes()
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(3);
		Database DB = be.new Database();
		int i;
		String sCauseCodeString = "";
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();

		sSQL =  "select  PM.WTPartNumber, PM.name " +
				"from [wcadmin].[WTPartMaster] PM " +
				"where WTPartNumber like 'SB%'";

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (java.lang.Exception e) 
		{
			sCauseCodeString = e.getMessage();
		}

		if (iRecords > 0)
		{
			try
			{
				for(i=0;i<iRecords;i++)
				{
					if(rst.wasNull())
					{
						sCauseCodeString = "^";					
					}
					else
					{
						sCauseCodeString += rst.getString("WTPartNumber") + "^" +  rst.getString("name") + "^";	
					}
					rst.next();
				}
			}
			catch (java.lang.Exception e) 
			{
				sCauseCodeString = e.getMessage();
			}
		}
		else
		{
			sCauseCodeString = "";
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sCauseCodeString = e.getMessage();
		}
		
		rtnSet.sRtnString = sCauseCodeString;
		rtnSet.iRows = iRecords;
		rtnSet.iCols = 2;
		return rtnSet;

	}

	public ReturnCalcDetails GetActionTypes()
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(2);
		Database DB = be.new Database();
		int i;
		String sActionTypeCodeString = "";
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();

		sSQL =  "select * from tblActionRequestTypes";

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (java.lang.Exception e) 
		{
			sActionTypeCodeString = e.getMessage();
		}

		if (iRecords > 0)
		{
			try
			{
				for(i=0;i<iRecords;i++)
				{
					if(rst.wasNull())
					{
						sActionTypeCodeString = "^";					
					}
					else
					{
						sActionTypeCodeString += rst.getString("Id") + "^" +  rst.getString("Description") + "^";	
					}
					rst.next();
				}
			}
			catch (java.lang.Exception e) 
			{
				sActionTypeCodeString = e.getMessage();
			}
		}
		else
		{
			sActionTypeCodeString = "";
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sActionTypeCodeString = e.getMessage();
		}
		
		rtnSet.sRtnString = sActionTypeCodeString;
		rtnSet.iRows = iRecords;
		rtnSet.iCols = 2;
		return rtnSet;

	}

	public ReturnCalcDetails GetPlantSections(String sOperation)
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(3);
		Database DB = be.new Database();
		int i;
		String sPlantFolder = "";
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();

		sSQL = "select SF2.name " +
			   "From [wcadmin].[PDMLinkProduct] P, [wcadmin].[SubFolderLink] SFL, [wcadmin].[SubFolder] SF, " +
			   "[wcadmin].[SubFolderLink] SFL2, [wcadmin].[SubFolder] SF2 " +  
			   "where P.namecontainerInfo like '" + sOperation + "%' " +
			   "and P.idA3C2containerInfo = SFL.idA3A5 " +
			   "and SFL.idA3B5 = SF.idA2A2 " +
			   "and SF.name Like '%Process Plant%' " +
			   "and SF.idA2A2 = SFL2.idA3A5 " +
			   "and SFL2.idA3B5 = SF2.idA2A2 " +
			   "Order By 1";

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (java.lang.Exception e) 
		{
			sPlantFolder = e.getMessage();
		}

		if (iRecords > 0)
		{
			try
			{
				for(i=0;i<iRecords;i++)
				{
					sPlantFolder += rst.getString("name") + "^";	
					if(rst.wasNull())
					{
						sPlantFolder = "^";					
					}
					
					rst.next();
				}
			}
			catch (java.lang.Exception e) 
			{
				sPlantFolder = e.getMessage();
			}
		}
		else
		{
			sPlantFolder = "";
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sPlantFolder = e.getMessage();
		}
		
		rtnSet.sRtnString = sPlantFolder;
		rtnSet.iRows = iRecords;
		rtnSet.iCols = 1;
		return rtnSet;

	}

	public ReturnCalcDetails GetExistingEvents()
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(2);
		Database DB = be.new Database();
		int i;
		String sEventCode = "";
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();

		sSQL = "select Id, EventCode from tblReliabilityEvent Order by 1 desc";

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (java.lang.Exception e) 
		{
			sEventCode = e.getMessage();
		}

		if (iRecords > 0)
		{
			try
			{
				for(i=0;i<iRecords;i++)
				{
					sEventCode += rst.getString("Id") + "^" + rst.getString("EventCode") + "^";	
					if(rst.wasNull())
					{
						sEventCode = "^";					
					}
					
					rst.next();
				}
			}
			catch (java.lang.Exception e) 
			{
				sEventCode = e.getMessage();
			}
		}
		else
		{
			sEventCode = "";
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sEventCode = e.getMessage();
		}
		
		rtnSet.sRtnString = sEventCode;
		rtnSet.iRows = iRecords;
		rtnSet.iCols = 2;
		return rtnSet;

	}

	public ReturnCalcDetails GetExistingActionRequests()
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(2);
		Database DB = be.new Database();
		int i;
		String sActionRequestCode = "";
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();

		sSQL = "select PartId as Id, WTPartNumber as ActionRequestCode from vwWindchillPartTypes where PartType like '%RequestedAction' order by 2 desc";

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (java.lang.Exception e) 
		{
			sActionRequestCode = e.getMessage();
		}

		if (iRecords > 0)
		{
			try
			{
				for(i=0;i<iRecords;i++)
				{
					sActionRequestCode += rst.getString("Id") + "^" + rst.getString("ActionRequestCode") + "^";	
					if(rst.wasNull())
					{
						sActionRequestCode = "^";					
					}
					
					rst.next();
				}
			}
			catch (java.lang.Exception e) 
			{
				sActionRequestCode = e.getMessage();
			}
		}
		else
		{
			sActionRequestCode = "";
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sActionRequestCode = e.getMessage();
		}
		
		rtnSet.sRtnString = sActionRequestCode;
		rtnSet.iRows = iRecords;
		rtnSet.iCols = 2;
		return rtnSet;

	}

	public String GetNextReliabilityEventCode()
	{
		Backend be = new Backend(2);
		Utilities util = be.new Utilities();
		ReturnNextId rtnId = be.new ReturnNextId();
		long i = 0;

		rtnId = util.Get_Next_Id("ReliabilityEvent");
		int iSeqLength = rtnId.iSequenceLength;
		String sFormat = "%" + String.format("%02d", iSeqLength) + "d";
		i = rtnId.iNextId;
		String formatted = String.format(sFormat, i);
		return rtnId.sPrefix + formatted;

	}

	public String GetNextActionRequestCode()
	{
		Backend be = new Backend(2);
		Utilities util = be.new Utilities();
		ReturnNextId rtnId = be.new ReturnNextId();
		long i = 0;

		rtnId = util.Get_Next_Id("ActionRequest");
		int iSeqLength = rtnId.iSequenceLength;
		String sFormat = "%" + String.format("%02d", iSeqLength) + "d";
		i = rtnId.iNextId;
		String formatted = String.format(sFormat, i);
		return rtnId.sPrefix + formatted;

	}

	public ResultDetails GetEventInfo(int iId)
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(2);
		Database DB = be.new Database();
		int i;
		String sEventString = "";
		String sErrorMsg = "";
		ResultDetails rtnSet = new ResultDetails();
		boolean bResult;

		sSQL = "select * from tblReliabilityEvent where Id = " + iId;

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (java.lang.Exception e) 
		{
			sErrorMsg = e.getMessage();
			bResult = false;
		}

		if (iRecords > 0)
		{
			try
			{
				for(i=0;i<iRecords;i++)
				{
					if(rst.wasNull())
					{
						sEventString = "^";					
					}
					else
					{
						int iId2 = rst.getInt("Id");
						
						String sEventCode = rst.getString("EventCode");
						if(rst.wasNull())
							sEventCode = "";
						
						String sName = rst.getString("Name");
						if(rst.wasNull())
							sName = "";
						
						String sLongDescription = rst.getString("LongDescription");
						if(rst.wasNull())
							sLongDescription = "";
						
						Timestamp dtDate = rst.getTimestamp("EventDateTime");
						SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy hh:mm aa", Locale.UK);
						String sDateTime = formatter.format(dtDate);
						if(rst.wasNull())
							sDateTime = "";
						
						int iOperationCode = rst.getInt("OperationCode");
						String sOperationCode = "";
						if(!rst.wasNull())
							sOperationCode = Integer.toString(iOperationCode);

						String sEquipmentCode = rst.getString("EquipmentCode");
						if(rst.wasNull())
							sEquipmentCode = "";
						
						double dDuration = rst.getDouble("Duration");
						String 	sDuration = "";
						if(!rst.wasNull())
							sDuration = Double.toString(dDuration);
						
						String sActionCode = rst.getString("ActionCode");
						if(rst.wasNull())
							sActionCode = "";

						String sCauseCode = rst.getString("CauseCode");
						if(rst.wasNull())
							sCauseCode = "";

						String sComments = rst.getString("Comments");
						if(rst.wasNull())
							sComments = "";

						sEventString += "Id=" + iId2 + "^EventCode=" + sEventCode  + "^EventName=" + sName + "^LongDesc=" + sLongDescription + 
										"^Date=" + sDateTime + "^OperationCode=" +  sOperationCode + "^EquipmentCode=" + sEquipmentCode + "^Duration=" + sDuration +
									     "^ActionCode=" + sActionCode + "^CauseCode=" +  sCauseCode + "^Comments=" + sComments + "^";	
					}
					rst.next();
				}
				bResult = true;
				
			}
			catch (java.lang.Exception e) 
			{
				sErrorMsg = e.getMessage();
				bResult = false;
			}
		}
		else
		{
			sEventString = "";
			bResult = true;
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sErrorMsg = e.getMessage();
			bResult = false;
		}
		
		rtnSet.sResult = sEventString;
		rtnSet.sMessage = sErrorMsg;
		rtnSet.bResult = bResult;
		return rtnSet;

	}

	public ResultDetails GetActionRequestInfo(String sARCode)
	{
		ResultSet rst = null;
		int iRecords = 0;
		Backend be = new Backend(2);
		Database DB = be.new Database();
		String sActionRequestString = "";
		String sErrorMsg = "";
		ResultDetails rtnSet = new ResultDetails();
		ResultDetails rtnSet2 = new ResultDetails();
		boolean bResult;
		String[] sParamNames = new String[1];
		Object[] objParamValues = new Object[1];

		sParamNames[0] = "@pvchActionRequestCode";
		objParamValues[0] = sARCode;
		
		iRecords = DB.CallStoredProcResultSet("SP_GetActionRequestInfo", sParamNames, objParamValues);

		if (iRecords < 0)
		{
			return null;
		}
		else
		{
			rst = DB.getResultSet();
	
			if (iRecords > 0)
			{
				try
				{
					int iId2 = rst.getInt("Id");
					
					String sActionRequestCode = rst.getString("ActionRequestCode");
					if(rst.wasNull())
						sActionRequestCode = "";
					
					String sName = rst.getString("Name");
					if(rst.wasNull())
						sName = "";
					
					String sLongDescription = rst.getString("LongDescription");
					if(rst.wasNull())
						sLongDescription = "";
					
					Timestamp dtDate = rst.getTimestamp("ARDateTime");
					SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy hh:mm aa", Locale.UK);
					String sDateTime = formatter.format(dtDate);
					if(rst.wasNull())
						sDateTime = "";
					
					String sOperationCode = rst.getString("Operation");
					if(rst.wasNull())
						sOperationCode = "";
	
					String sEquipmentCode = rst.getString("EquipmentCode");
					if(rst.wasNull())
						sEquipmentCode = "";
					
					String sCauseCode = rst.getString("CauseCode");
					if(rst.wasNull())
						sCauseCode = "";
	
					String sComments = rst.getString("Comments");
					if(rst.wasNull())
						sComments = "";
	
					String sActionCategoryCode = rst.getString("ActionCategoryCode");
					if(rst.wasNull())
						sActionCategoryCode = "";
	
					String sResponse = rst.getString("Response");
					if(rst.wasNull())
						sResponse = "";

					String sStatus = rst.getString("Status");
					if(rst.wasNull())
						sStatus = "";

					//				String sActionCategory = rst.getString("ActionCategoryDesc");;
	//				if(rst.wasNull())
	//					sActionCategory = "";
	
					/*						String sResponse = rst.getString("Response");
							if(rst.wasNull())
								sResponse = "";
	*/
					sActionRequestString += "Id=" + iId2 + "^ActionRequestCode=" + sActionRequestCode  + 
										  "^ActionRequestName=" + sName + "^LongDesc=" + sLongDescription + 
										  "^Date=" + sDateTime + "^OperationCode=" +  sOperationCode + "^EquipmentCode=" + sEquipmentCode + 
										  "^CauseCode=" +  sCauseCode + "^Comments=" + sComments + "^ActionCategoryCode=" + sActionCategoryCode + 
										  "^Response=" + sResponse + "^Status=" + sStatus + "^";	
//					rtnSet2 = GetActionRequestWindchillAttributeInfo(sActionRequestCode, sActionCategoryCode);
					
					bResult = true;									
				}
				catch (java.lang.Exception e) 
				{
					sErrorMsg = e.getMessage();
					bResult = false;
				}
			}
			else
			{
				sActionRequestString = "";
				bResult = true;
			}
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sErrorMsg = e.getMessage();
			bResult = false;
		}
		
		rtnSet.sResult = sActionRequestString;
		rtnSet.sMessage = sErrorMsg;
		rtnSet.bResult = bResult;
		return rtnSet;

	}

	public ResultDetails GetActionRequestWindchillAttributeInfo(String sActionRequestId, String sActionCategoryCode)
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(4);
		Database DB = be.new Database();
		int i;
		String sActionRequestString = "";
		String sColumnName = "";
		String sErrorMsg = "";
		ResultDetails rtnSet = new ResultDetails();
		boolean bResult;
		String sStatus = "";

		sSQL = "select * from vwWindchillActionRequestStringAttributes where WTPartNumber = '" + sActionRequestId + "'";

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (java.lang.Exception e) 
		{
			sErrorMsg = e.getMessage();
			bResult = false;
		}

		if (iRecords > 0)
		{
			try
			{
				boolean bActionCatFound = false;
				for(i=0;i<iRecords;i++)
				{
					if(rst.wasNull())
					{
						sActionRequestString = "ActionCategoryCode=" + sActionCategoryCode + "^Response=Created^Status=^";					
					}
					else
					{
						String sName = rst.getString("name");
						if(rst.wasNull())							
							sColumnName = "";
						
						String sValue = "";
						switch(sName)
						{
							case "ActionCategory":
								sColumnName = "ActionCategoryCode=";
								sValue = rst.getString("value2") + "^";
								if(rst.wasNull())							
									sValue = "^";
								else
									bActionCatFound = true;
								break;
							case "Response":
								sColumnName = "Response=";
								sValue = rst.getString("value2") + "^";
								if(rst.wasNull())							
									sValue = "^";
								break;
							default:
								sColumnName="";
								sValue="";
								break;
						}
						

						sStatus = rst.getString("statestate");
						if(rst.wasNull())							
							sStatus = "";

						sActionRequestString += sColumnName + sValue; 
					}
					rst.next();
				}
				
				if(!bActionCatFound)
					sActionRequestString += "ActionCategoryCode=" + sActionCategoryCode + "^";
				sActionRequestString += "Status=" + sStatus + "^";
				bResult = true;
				
			}
			catch (java.lang.Exception e) 
			{
				sErrorMsg = e.getMessage();
				bResult = false;
			}
		}
		else
		{
			sActionRequestString = "ActionCategoryCode=" + sActionCategoryCode + "^Response=^Status=Created^";					
			bResult = true;
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sErrorMsg = e.getMessage();
			bResult = false;
		}
		
		rtnSet.sResult = sActionRequestString;
		rtnSet.sMessage = sErrorMsg;
		rtnSet.bResult = bResult;
		return rtnSet;


	}

	public ReturnClassLock GetReliabilityEventLocked(int iId, String sUserId)
	{
		Backend be = new Backend(2);
		Database DB = be.new Database();
		String[] sParamNames = new String[2];
		Object[] objParamValues = new Object[2];
		ReturnClassLock rtnClass = new ReturnClassLock();		

		sParamNames[0] = "@piId";
		sParamNames[1] = "@pvchUser";
		objParamValues[0] = iId;
		objParamValues[1] = sUserId;
		
		int iRecordCount = DB.CallStoredProcResultSet("SP_GetReliabilityEventLocked", sParamNames, objParamValues);

		if (iRecordCount < 0)
		{
			return null;
		}
		else
		{
			try
			{
				ResultSet rs = DB.getResultSet();
				String sEventCode = rs.getString("EventCode");
				int iLocked = rs.getInt("Locked");
				String sActiveUser = rs.getString("ActiveUser");
				
				rtnClass.sCode = sEventCode;
				rtnClass.iValue = iLocked;
				rtnClass.sActiveUser = sActiveUser;
				rtnClass.bValue = true;
				rtnClass.sRtnMsg = "";								
			} 
			catch (SQLException e)
			{
				rtnClass.bValue = false;
				rtnClass.sRtnMsg = e.getMessage();
				return rtnClass;
			}
		}
						
		return rtnClass;
	}

	public ReturnClassLock GetActionRequestLocked(String sARCode, String sUserId)
	{
		Backend be = new Backend(2);
		Database DB = be.new Database();
		String[] sParamNames = new String[2];
		Object[] objParamValues = new Object[2];
		ReturnClassLock rtnClass = new ReturnClassLock();		

		sParamNames[0] = "@pvchActionRequestCode";
		sParamNames[1] = "@pvchUser";
		objParamValues[0] = sARCode;
		objParamValues[1] = sUserId;
		
		int iRecordCount = DB.CallStoredProcResultSet("SP_GetActionRequestLocked", sParamNames, objParamValues);

		if (iRecordCount < 0)
		{
			return null;
		}
		else
		{
			try
			{
				ResultSet rs = DB.getResultSet();
				String sActionRequestCode = rs.getString("ActionRequestCode");
				int iLocked = rs.getInt("Locked");
				String sActiveUser = rs.getString("ActiveUser");
				
				rtnClass.sCode = sActionRequestCode;
				rtnClass.iValue = iLocked;
				rtnClass.sActiveUser = sActiveUser;
				rtnClass.bValue = true;
				rtnClass.sRtnMsg = "";								
			} 
			catch (SQLException e)
			{
				rtnClass.bValue = false;
				rtnClass.sRtnMsg = e.getMessage();
				return rtnClass;
			}
		}
						
		return rtnClass;
	}

	public ReturnClassInt SetReliabilityEventLocked(int iId, int iLocked, String sUser)
	{		 
			Backend be = new Backend(2);
			Database DB = be.new Database();
			String[] sParamNames = new String[3];
			Object[] objParamValues = new Object[3];
			ReturnClassInt rtn = new ReturnClassInt();

			
			sParamNames[0] = "@piId"; 
			sParamNames[1] = "@piLocked"; 
			sParamNames[2] = "@pvchUser"; 

			objParamValues[0] = iId; 
			objParamValues[1] = iLocked; 
			objParamValues[2] = sUser; 

			int iReturn = DB.CallStoredProc("SP_ReliabilityEventLock", sParamNames, objParamValues);
			
			if(iReturn < 0)
			{
				rtn.iValue = iReturn;
				rtn.sRtnMsg = "Cannot unlock event id " + iId + " for user " + sUser; 
				rtn.bValue = false;
				return rtn;		
			}

			//If we get to here the change has been successful
			rtn.iValue = 0;
			rtn.sRtnMsg = ""; 
			rtn.bValue = true;
			return rtn;		
			

			
	}

	public ReturnClassInt SetActionRequestLocked(String sARCode, int iLocked, String sUser)
	{		 
			Backend be = new Backend(2);
			Database DB = be.new Database();
			String[] sParamNames = new String[3];
			Object[] objParamValues = new Object[3];
			ReturnClassInt rtn = new ReturnClassInt();

			
			if(sARCode.equals(""))
				iLocked = 1;
			
			sParamNames[0] = "@pvchActionRequestCode"; 
			sParamNames[1] = "@piLocked"; 
			sParamNames[2] = "@pvchUser"; 

			objParamValues[0] = sARCode; 
			objParamValues[1] = iLocked; 
			objParamValues[2] = sUser; 

			int iReturn = DB.CallStoredProc("SP_ActionRequestLock", sParamNames, objParamValues);
			
			if(iReturn < 0)
			{
				rtn.iValue = iReturn;
				rtn.sRtnMsg = "Cannot unlock ActionRequest " + sARCode + " for user " + sUser; 
				rtn.bValue = false;
				return rtn;		
			}

			//If we get to here the change has been successful
			rtn.iValue = 0;
			rtn.sRtnMsg = ""; 
			rtn.bValue = true;
			return rtn;		
			

			
	}

	public ResultReturnBool SaveEventInfo(EventDetailsInfo eventInfo)
	 {		 
			Backend be = new Backend(2);
			Database DB = be.new Database();
			String[] sParamNames = new String[12];
			Object[] objParamValues = new Object[12];
			ResultReturnBool rtn = new ResultReturnBool();
			SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy hh:mm aa", Locale.UK);
			SimpleDateFormat formatter2 = new SimpleDateFormat("yyyyMMdd HH:mm");
			String sEventDate = "";
			java.util.Date dtEventDate;
			try
			{
				if(!eventInfo.sEventDate.equals(""))
				{
					dtEventDate = formatter.parse(eventInfo.sEventDate);
					sEventDate = formatter2.format(dtEventDate);
				}
	
				sParamNames[0] = "@piId"; 
				sParamNames[1] = "@pvchEventCode"; 
				sParamNames[2] = "@pvchName"; 
				sParamNames[3] = "@pvchLongDescription"; 
				sParamNames[4] = "@pvchEventDate"; 
				sParamNames[5] = "@piOperationCode"; 
				sParamNames[6] = "@pvchEquipCode"; 
				sParamNames[7] = "@pfDuration"; 
				sParamNames[8] = "@pvchActionCode"; 
				sParamNames[9] = "@pvchCauseCode"; 
				sParamNames[10] = "@pvchComments"; 
				sParamNames[11] = "@pvchActiveUser"; 
				
				objParamValues[0] = eventInfo.Id; 
				objParamValues[1] = eventInfo.sEventCode; 
				objParamValues[2] = eventInfo.sName; 
				objParamValues[3] = eventInfo.sLongDescription; 
				objParamValues[4] = sEventDate; 
				objParamValues[5] = eventInfo.iOperationCode; 
				objParamValues[6] = eventInfo.sEquipCode; 
				objParamValues[7] = eventInfo.dDuration; 
				objParamValues[8] = eventInfo.sActionCode; 
				objParamValues[9] = eventInfo.sCauseCode; 
				objParamValues[10] = eventInfo.sComments; 
				objParamValues[11] = eventInfo.sActiveUser;
	
				int iReturn = DB.CallStoredProcReturnValue("SP_SetEventDetails", sParamNames, objParamValues);
				
				if(iReturn < 0)
				{
					rtn.sMessage = "Cannot save details for event " + eventInfo.sEventCode; 
					rtn.bResult = false;
					rtn.iId = iReturn;
					return rtn;		
				}
				else
				{
					rtn.sMessage = ""; 
					rtn.bResult = true;
					rtn.iId = iReturn;
					return rtn;		
				}
			} 
			catch (java.lang.Exception e)
			{
				rtn.iId = -1;
				rtn.sMessage = "Cannot save details for event " + eventInfo.sEventCode; 
				rtn.bResult = false;
				return rtn;		
			}
	 }

	public ResultReturnBool SaveActionRequestInfo(ActionRequestDetailsInfo ActionRequestInfo)
	 {		 
			Backend be = new Backend(2);
			Database DB = be.new Database();
			String[] sParamNames = new String[12];
			Object[] objParamValues = new Object[12];
			ResultReturnBool rtn = new ResultReturnBool();
			SimpleDateFormat formatter = new SimpleDateFormat("dd/MM/yyyy hh:mm aa", Locale.UK);
			SimpleDateFormat formatter2 = new SimpleDateFormat("yyyyMMdd HH:mm");
			String sActionRequestDate = "";
			java.util.Date dtActionRequestDate;
			try
			{
				if(!ActionRequestInfo.sARDate.equals(""))
				{
					dtActionRequestDate = formatter.parse(ActionRequestInfo.sARDate);
					sActionRequestDate = formatter2.format(dtActionRequestDate);
				}
	
				sParamNames[0] = "@piId"; 
				sParamNames[1] = "@pvchARCode"; 
				sParamNames[2] = "@pvchActionCategoryCode"; 
				sParamNames[3] = "@pvchName"; 
				sParamNames[4] = "@pvchLongDescription"; 
				sParamNames[5] = "@pvchARDate"; 
				sParamNames[6] = "@piOperationCode"; 
				sParamNames[7] = "@pvchEquipCode"; 
				sParamNames[8] = "@pvchCauseCode"; 
				sParamNames[9] = "@pvchComments"; 
				sParamNames[10] = "@pvchResponse"; 
				sParamNames[11] = "@pvchActiveUser"; 
				
				objParamValues[0] = ActionRequestInfo.Id; 
				objParamValues[1] = ActionRequestInfo.sARCode; 
				objParamValues[2] = ActionRequestInfo.sActionCategoryCode; 
				objParamValues[3] = ActionRequestInfo.sName; 
				objParamValues[4] = ActionRequestInfo.sLongDescription; 
				objParamValues[5] = sActionRequestDate; 
				objParamValues[6] = ActionRequestInfo.iOperationCode; 
				objParamValues[7] = ActionRequestInfo.sEquipCode; 
				objParamValues[8] = ActionRequestInfo.sCauseCode; 
				objParamValues[9] = ActionRequestInfo.sComments; 
				objParamValues[10] = ActionRequestInfo.sResponse; 
				objParamValues[11] = ActionRequestInfo.sActiveUser;
	
				int iReturn = DB.CallStoredProcReturnValue("SP_SetActionRequestDetails", sParamNames, objParamValues);
				
				if(iReturn < 0)
				{
					rtn.sMessage = "Cannot save details for Action Request " + ActionRequestInfo.sARCode; 
					rtn.bResult = false;
					rtn.iId = iReturn;
					return rtn;		
				}
				else
				{
					rtn.sMessage = ""; 
					rtn.bResult = true;
					rtn.iId = iReturn;
					return rtn;		
				}
			} 
			catch (java.lang.Exception e)
			{
				rtn.iId = -1;
				rtn.sMessage = "Cannot save details for Action Request " + ActionRequestInfo.sARCode; 
				rtn.bResult = false;
				return rtn;		
			}
	 }
}
