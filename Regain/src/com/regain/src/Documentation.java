package com.regain.src;
import java.sql.ResultSet;
import java.sql.SQLException;

import com.fronesis.servlets.Backend;
import com.fronesis.servlets.Backend.Database;

public class Documentation 
{
	public class ReturnCalcDetails
	{
		String sRtnString;
		int iRows;
		int iCols;
	}

	public class ResultReturnString
	{
		String sRtn;
		boolean bResult;
		String sMessage;
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

	public class WindchillDocInfo
	{
		int iNewFlag; 
		String sDocNo = ""; 
		String sDocName = ""; 
		String sDocLongDesc = ""; 
		String sDocOriginator = ""; 
		String sDocOrigId = ""; 
		String sCheckInComments = ""; 
	}

	public class JobAccessLevel
	{
		int iId; 
		int iJobId; 
		int iRoleId; 
		int iAccessLevel; 
	}

	public class DocTypeAccessLevel
	{
		int iId; 
		String sDocCode; 
		int iRoleId; 
		int iAccessLevel; 
	}

	public ReturnCalcDetails GetDocumentTypes(String sUser)
	{
		ResultSet rst = null;
		int iRecords = 0;
		String sSQL = null;
		Backend be = new Backend(2);
		Database DB = be.new Database();
		int i;
		String sDocTypes = "Success^";
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();

		sSQL =  "SELECT DT.Code, DT.Description " +
				"FROM tblDocTypes DT, tblDocTypeAccess DTA, tblUserRoles UR, tblUser U " +
				"where DT.Code = DTA.DocTypeCode " +
				"and DTA.RoleId = UR.RoleId " +
				"and U.UserId = UR.UserId " +
				"and U.Username = '" + sUser + "' " +
				"group by DT.Code, DT.Description " +
				"having Max(DTA.AccessLevel) >= 2 " +
				"ORDER BY 1";

		rst = DB.OpenRecordset(sSQL);

		try 
		{
			iRecords = DB.getRowCount(rst);
		} 
		catch (Exception e) 
		{
			sDocTypes = e.getMessage();
		}

		if (iRecords > 0)
		{
			try
			{
				for(i=0;i<iRecords;i++)
				{
					sDocTypes += rst.getString("Code") + "^" + rst.getString("Description") + "^";	
					if(rst.wasNull())
					{
						sDocTypes += "^";					
					}
					
					rst.next();
				}
			}
			catch(SQLException e) 
			{
				sDocTypes = "Failure^" + e.getMessage();
			}
		}
		else
		{
			sDocTypes += "";
		}

		try 
		{
			rst.close();
		} 
		catch (SQLException e) 
		{
			sDocTypes = "Failure^" + e.getMessage();
		}
		
		rtnSet.sRtnString = sDocTypes;
		rtnSet.iRows = iRecords;
		rtnSet.iCols = 2;
		return rtnSet;

	}

	public ReturnCalcDetails GetJobCodes(String sSearchString, String sUser)
	{
		Backend be = new Backend(2);
		Database DB = be.new Database();
		String[] sParamNames = new String[2];
		Object[] objParamValues = new Object[2];
		String sReturnDetails = "Success^||";
		int i;
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();
		

		sParamNames[0] = "@pvchSearchCriteria";
		sParamNames[1] = "@pvchUser";
		objParamValues[0] = sSearchString;
		objParamValues[1] = sUser;
		
		int iRecordCount = DB.CallStoredProcResultSet("SP_GetWindchillJobs", sParamNames, objParamValues);

		if (iRecordCount < 0)
		{
			return null;
		}
		else
		{
			try
			{
				ResultSet rs = DB.getResultSet();
				for(i=0;i<iRecordCount;i++)
				{
					String sJobNumber = rs.getString("JobNo");
					String sName = rs.getString("Name");
					String sProduct = rs.getString("Product");
					
					sReturnDetails += "JobNumber" + i + "=" + sJobNumber + "^" + "Name" + i + "=" + sName + "^" + "Product" + i + "=" + sProduct + "^||";
					rs.next();
				}
				
				rtnSet.iCols = 3;
				rtnSet.iRows = iRecordCount;
				rtnSet.sRtnString = sReturnDetails;
			} 
			catch (SQLException e)
			{
				sReturnDetails = "Failure||" + e.getMessage();
				rtnSet.iCols = 1;
				rtnSet.iRows = 1;
				rtnSet.sRtnString = sReturnDetails;
				return rtnSet;
			}
		}
						
		return rtnSet;

	}

	public ReturnCalcDetails GetFunctionalLocations(String sDocNo)
	{
		Backend be = new Backend(2);
		Database DB = be.new Database();
		String[] sParamNames = new String[1];
		Object[] objParamValues = new Object[1];
		String sReturnDetails = "Success^||";
		int i;
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();
		

		sParamNames[0] = "@pvchDocumentNumber";
		objParamValues[0] = sDocNo;
		
		int iRecordCount = DB.CallStoredProcResultSet("SP_GetWindchillDocumentFunctionalLocations", sParamNames, objParamValues);

		if (iRecordCount < 0)
		{
			return null;
		}
		else
		{
			try
			{
				ResultSet rs = DB.getResultSet();
				for(i=0;i<iRecordCount;i++)
				{
					int iPartNo = rs.getInt("PartId");
					String sName = rs.getString("name");
					String sPartNo = rs.getString("WTPartNumber");
					
					sReturnDetails += "PartId" + i + "=" + iPartNo + "^" + "Name" + i + "=" + sName + "^" + "PartNo" + i + "=" + sPartNo + "^||";
					rs.next();
				}
				
				rtnSet.iCols = 3;
				rtnSet.iRows = iRecordCount;
				rtnSet.sRtnString = sReturnDetails;
			} 
			catch (SQLException e)
			{
				sReturnDetails = "Failure||" + e.getMessage();
				rtnSet.iCols = 1;
				rtnSet.iRows = 1;
				rtnSet.sRtnString = sReturnDetails;
				return rtnSet;
			}
		}
						
		return rtnSet;

	}

	public ReturnCalcDetails GetAllFunctionalLocations(String sJobNo)
	{
		Backend be = new Backend(2);
		Database DB = be.new Database();
		String[] sParamNames = new String[1];
		Object[] objParamValues = new Object[1];
		String sReturnDetails = "Success^||";
		int i;
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();
		

		sParamNames[0] = "@pvchJobNumber";
		objParamValues[0] = sJobNo;
		
		int iRecordCount = DB.CallStoredProcResultSet("SP_GetWindchillAllFunctionalLocationsForJob", sParamNames, objParamValues);

		if (iRecordCount < 0)
		{
			return null;
		}
		else
		{
			try
			{
				ResultSet rs = DB.getResultSet();
				for(i=0;i<iRecordCount;i++)
				{
					String sName = rs.getString("name");
					String sPartNo = rs.getString("WTPartNumber");
					
					sReturnDetails += "Name" + i + "=" + sName + "^" + "PartNo" + i + "=" + sPartNo + "^||";
					rs.next();
				}
				
				rtnSet.iCols = 2;
				rtnSet.iRows = iRecordCount;
				rtnSet.sRtnString = sReturnDetails;
			} 
			catch (SQLException e)
			{
				sReturnDetails = "Failure||" + e.getMessage();
				rtnSet.iCols = 1;
				rtnSet.iRows = 1;
				rtnSet.sRtnString = sReturnDetails;
				return rtnSet;
			}
		}
						
		return rtnSet;

	}

	public ReturnCalcDetails GetWindchillDocAttachments(String sDocNo)
	{
		Backend be = new Backend(2);
		Database DB = be.new Database();
		String[] sParamNames = new String[1];
		Object[] objParamValues = new Object[1];
		String sReturnDetails = "Success^||";
		int i;
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();
		

		sParamNames[0] = "@pvchDocumentNumber";
		objParamValues[0] = sDocNo;
		
		int iRecordCount = DB.CallStoredProcResultSet("SP_GetWindchillDocumentAttachments", sParamNames, objParamValues);

		if (iRecordCount < 0)
		{
			return null;
		}
		else
		{
			try
			{
				ResultSet rs = DB.getResultSet();
				for(i=0;i<iRecordCount;i++)
				{
/*					String sQueryDocNo = rs.getString("DocNumber");
					String sName = rs.getString("name");
					String sStatus = rs.getString("Status");
*/					String sFilename = rs.getString("FileName");
					int iAttachmentId = rs.getInt("AttachmentId");
					String sFileDescription = rs.getString("FileDescription");
					
					sReturnDetails += "AttachmentId" + i + "=" + iAttachmentId + "^" + "Filename" + i + "=" + sFilename + "^" + "FileDescription" + i + "=" + sFileDescription + "^||";
					rs.next();
				}
				
				rtnSet.iCols = 3;
				rtnSet.iRows = iRecordCount;
				rtnSet.sRtnString = sReturnDetails;
			} 
			catch (SQLException e)
			{
				sReturnDetails = "Failure||" + e.getMessage();
				rtnSet.iCols = 1;
				rtnSet.iRows = 1;
				rtnSet.sRtnString = sReturnDetails;
				return rtnSet;
			}
		}
						
		return rtnSet;

	}
	
	public ReturnClassInt DeleteWindchillAttachment(String sDocNo, int iAttachmentId)
	{
		ReturnClassInt rtnCls = new ReturnClassInt();
		
		//Delete from Windchill here. 
		
		rtnCls.bValue = true;
		rtnCls.iValue = iAttachmentId;
		rtnCls.sRtnMsg = "";
		return rtnCls;
	
	}
	
	public ResultReturnString SaveWindchillDocInfo(WindchillDocInfo windchillDoc)
	{		 
		ResultReturnString rtn = new ResultReturnString();
		
		//Run all the stuff to create a WTDocument in Windchill with the attributes
		
		return rtn;
	}

	public ReturnCalcDetails GetJobAccessMatrixInfo()
	{
		Backend be = new Backend(2);
		Database DB = be.new Database();
		String sReturnDetails = "Success^||";
		int i;
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();
		

		
		int iRecordCount = DB.CallStoredProcResultSet("SP_GetWindchillJobAccess", null, null);

		if (iRecordCount < 0)
		{
			return null;
		}
		else
		{
			try
			{
				ResultSet rs = DB.getResultSet();
				for(i=0;i<iRecordCount;i++)
				{
					String sDocName = rs.getString("DocumentName");
					String sJobNo = rs.getString("WTDocumentNumber");
					int iAccessId = rs.getInt("JobAccessId");
					int iRoleId = rs.getInt("RoleId");
					String sRoleDesc = rs.getString("RoleDescription");
					String sRoleLongDesc = rs.getString("RoleLongDescription");
					int iAccessLevel = rs.getInt("AccessLevel");
					String sAccessDesc = rs.getString("AccessLevelDescription");
					
					sReturnDetails += "Name" + i + "=" + sDocName + "^" + "JobNo" + i + "=" + sJobNo + 
								      "^JobAccessId" + i + "=" + iAccessId + "^" + "RoleId" + i + "=" + iRoleId + 
								      "^RoleDescription" + i + "=" + sRoleDesc + "^" + "RoleLongDescription" + i + "=" + sRoleLongDesc +
								      "^AccessLevel" + i + "=" + iAccessLevel + "^AccessDesc"  + i + "=" + sAccessDesc + "^||";
					rs.next();
				}
				
				rtnSet.iCols = 8;
				rtnSet.iRows = iRecordCount;
				rtnSet.sRtnString = sReturnDetails;
			} 
			catch (SQLException e)
			{
				sReturnDetails = "Failure||" + e.getMessage();
				rtnSet.iCols = 1;
				rtnSet.iRows = 1;
				rtnSet.sRtnString = sReturnDetails;
				return rtnSet;
			}
		}
						
		return rtnSet;

	}
	
	public ReturnCalcDetails GetDocTypeAccessMatrixInfo()
	{
		Backend be = new Backend(2);
		Database DB = be.new Database();
		String sReturnDetails = "Success^||";
		int i;
		ReturnCalcDetails rtnSet = new ReturnCalcDetails();
		
		
		int iRecordCount = DB.CallStoredProcResultSet("SP_GetDocTypeAccess", null, null);

		if (iRecordCount < 0)
		{
			return null;
		}
		else
		{
			try
			{
				ResultSet rs = DB.getResultSet();
				for(i=0;i<iRecordCount;i++)
				{
					String sDocTypeDesc = rs.getString("Description");
					String sDocType = rs.getString("Code");
					int iAccessId = rs.getInt("DocTypeAccessId");
					int iRoleId = rs.getInt("RoleId");
					String sRoleDesc = rs.getString("RoleDescription");
					String sRoleLongDesc = rs.getString("RoleLongDescription");
					int iAccessLevel = rs.getInt("AccessLevel");
					String sAccessDesc = rs.getString("AccessLevelDescription");
					
					sReturnDetails += "Name" + i + "=" + sDocTypeDesc + "^" + "DocType" + i + "=" + sDocType + 
								      "^DocTypeAccessId" + i + "=" + iAccessId + "^" + "RoleId" + i + "=" + iRoleId + 
								      "^RoleDescription" + i + "=" + sRoleDesc + "^" + "RoleLongDescription" + i + "=" + sRoleLongDesc +
								      "^AccessLevel" + i + "=" + iAccessLevel + "^AccessDesc"  + i + "=" + sAccessDesc + "^||";
					rs.next();
				}
				
				rtnSet.iCols = 8;
				rtnSet.iRows = iRecordCount;
				rtnSet.sRtnString = sReturnDetails;
			} 
			catch (SQLException e)
			{
				sReturnDetails = "Failure||" + e.getMessage();
				rtnSet.iCols = 1;
				rtnSet.iRows = 1;
				rtnSet.sRtnString = sReturnDetails;
				return rtnSet;
			}
		}
						
		return rtnSet;

	}

	public ReturnClassInt SetJobAccessLevel(JobAccessLevel jobAccessLevel)
	{		 
		ReturnClassInt rtn = new ReturnClassInt();
		
		Backend be = new Backend(2);
		Database DB = be.new Database();
		String[] sParamNames = new String[4];
		Object[] objParamValues = new Object[4];

		sParamNames[0] = "@piId"; 
		sParamNames[1] = "@piJobId"; 
		sParamNames[2] = "@piRoleId"; 
		sParamNames[3] = "@piAccessLevel"; 

		objParamValues[0] = jobAccessLevel.iId; 
		objParamValues[1] = jobAccessLevel.iJobId; 
		objParamValues[2] = jobAccessLevel.iRoleId; 
		objParamValues[3] = jobAccessLevel.iAccessLevel; 

		int iReturn = DB.CallStoredProcReturnValue("SP_SetJobAccessLevel", sParamNames, objParamValues);
		
		if(iReturn < 0)
		{
			rtn.iValue = iReturn;
			rtn.sRtnMsg = "Cannot save job access level with underlying Id " + jobAccessLevel.iId; 
			rtn.bValue = false;
			return rtn;		
		}
		else
		{
			rtn.iValue = iReturn;
			rtn.sRtnMsg = ""; 
			rtn.bValue = true;
			return rtn;		
		}
		
	}

	public ReturnClassInt SetDocTypeAccessLevel(DocTypeAccessLevel DocTypeAccessLevel)
	{		 
		ReturnClassInt rtn = new ReturnClassInt();
		
		Backend be = new Backend(2);
		Database DB = be.new Database();
		String[] sParamNames = new String[4];
		Object[] objParamValues = new Object[4];

		sParamNames[0] = "@piId"; 
		sParamNames[1] = "@pvchDocCode"; 
		sParamNames[2] = "@piRoleId"; 
		sParamNames[3] = "@piAccessLevel"; 

		objParamValues[0] = DocTypeAccessLevel.iId; 
		objParamValues[1] = DocTypeAccessLevel.sDocCode; 
		objParamValues[2] = DocTypeAccessLevel.iRoleId; 
		objParamValues[3] = DocTypeAccessLevel.iAccessLevel; 

		int iReturn = DB.CallStoredProcReturnValue("SP_SetDocTypeAccessLevel", sParamNames, objParamValues);
		
		if(iReturn < 0)
		{
			rtn.iValue = iReturn;
			rtn.sRtnMsg = "Cannot save DocType access level with underlying Id " + DocTypeAccessLevel.iId; 
			rtn.bValue = false;
			return rtn;		
		}
		else
		{
			rtn.iValue = iReturn;
			rtn.sRtnMsg = ""; 
			rtn.bValue = true;
			return rtn;		
		}
		
	}
}
