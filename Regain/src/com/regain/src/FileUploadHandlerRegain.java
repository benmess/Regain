package com.regain.src;


import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;


/**
 * Servlet implementation class FileUploadHandlerRegain
 */
@WebServlet(description = "File Upload Handler for Regain", urlPatterns = { "/FileUploadHandlerRegain" })
public class FileUploadHandlerRegain extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private final String UPLOAD_DIRECTORY = "C:/WebRoot/Regain/Uploads";
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public FileUploadHandlerRegain() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException 
	{
//		Backend be = new Backend();
/*		Database DB = be.new Database();
        int iDeleted = 0;
        String sDescription = "";
        String sActiveUser = "";
        String sDocNo= "";
*/
		 //process only if its multipart content
	        if(ServletFileUpload.isMultipartContent(request))
	        {
	            try 
	            {
	            	String sPathAndName = "";
	                List<FileItem> multiparts = new ServletFileUpload(
	                                         new DiskFileItemFactory()).parseRequest(request);
	               
	                for(FileItem item : multiparts)
	                {
	                    if(!item.isFormField())
	                    {
	                        String name = new File(item.getName()).getName();
	                        sPathAndName = UPLOAD_DIRECTORY + File.separator + name;
	                        item.write( new File(sPathAndName));
	                    }
	                    else
	                    {
//	                    	String sFieldName = item.getFieldName();
	                    	
/*	                    	switch(sFieldName)
	                    	{
		                    	case "DocNo":
		                    		sDocNo = item.getString();
					                break;
		                    	case "AttachDesc":
			                    	sDescription = item.getString();
					                break;
		                    	case "ActiveUser":
			                    	sActiveUser = item.getString();
					                break;
	                    	}
*/	                    	
	                    }
	                }	
	                //Now save to Windchill
//	                DB.InsertFile(sActiveUser, -1, iRelatedTableUniqueId, iAttachmentType, iCounter, sDescription, sComments, sPathAndName, iDeleted, 0);
	                
	               //File uploaded successfully
	               request.setAttribute("message", "File Uploaded Successfully");
	            } 
	            catch (java.lang.Exception ex) 
	            {
	               request.setAttribute("message", "File Upload Failed due to " + ex);
	            }         
	        }
	        else
	        {
	            request.setAttribute("message",
	                                 "This Servlet only handles file upload requests");
	        }

	        //request.getRequestDispatcher("/Company.jsp").forward(request, response);
	}

}
