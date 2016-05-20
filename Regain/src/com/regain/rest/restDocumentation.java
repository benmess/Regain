package com.regain.rest;

import java.util.Date;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import javax.ws.rs.core.SecurityContext;
import javax.ws.rs.core.Context;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;
import java.util.regex.Pattern;


import com.fronesis.servlets.Backend;
import com.fronesis.servlets.UserBackend;
import com.fronesis.servlets.WindchillPart;
import com.fronesis.servlets.Backend.FileUtilities;

@Path("/")
public class restDocumentation 
{
	@GET
	@Path("/getfunlocdocs/{sSessionId}/{sUserId}/{iWebApp}/{sFuncLocCode}/{bHistoric}")
	@Produces(MediaType.APPLICATION_XML) //"text/html"
	public Response getFunLocDocs( @Context SecurityContext sc,
								   @PathParam("sSessionId") String sSessionId, @PathParam("sUserId") String sUserId, 
								   @PathParam("iWebApp") int iWebApp, @PathParam("sFuncLocCode") String sFuncLocCode,
								   @PathParam("bHistoric") Boolean bHistoric)
	{
		Backend be = new Backend(iWebApp);
		FileUtilities FileUtil = be.new FileUtilities();
		WindchillPart windchillPart = new WindchillPart();
		String sRtn;
		UserBackend usr = new UserBackend();

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			sRtn =  "Failure^You must be logged in to use this feature, get plant functional location documents.";
		}
		else
		{
			
			Boolean bSec = sc.isSecure();
			Boolean bFuncLocExists = windchillPart.PartExists(sFuncLocCode, iWebApp, sUserId);
			if(bFuncLocExists)
				sRtn = FileUtil.GetWindchillFilesFromFuncLocation(iWebApp, sFuncLocCode, bHistoric, sUserId, true); 
			else
			{
				sRtn = "Failure||Either plant function location " + sFuncLocCode + " does not exist or you do not have permissions to the job " + sFuncLocCode.substring(1, 4);
			}
		}

		return Response.status(200).entity(sRtn).build();
	}

	@GET
	@Path("/getwindchilldocfordownload/{sSessionId}/{sUserId}/{iStreamId}/{sFilename}")
	@Produces("text/html") //"text/html"
	public Response getWindchillDocForDownload( @PathParam("sSessionId") String sSessionId, @PathParam("sUserId") String sUserId, 
								   @PathParam("iStreamId") int iStreamId,  @PathParam("sFilename") String sFilename)
	{
		Backend be = new Backend(2);
		FileUtilities FileUtil = be.new FileUtilities();
		UserBackend usr = new UserBackend();
		String sReturnRawFileName = null;

		if(!usr.IsUserLoggedIn(sSessionId, sUserId, 2))
		{
			sReturnRawFileName =  "Failure^You must be logged in to use this feature, retrieve a plant functional location document.";
		}
		else
		{

			sReturnRawFileName = "webdavtemp\\" +sFilename;
			if (! (FileUtil.RetrieveWindchillAttachment(iStreamId, sReturnRawFileName)))
			{
				sReturnRawFileName =  "";
			}
		}

		return Response.status(200).entity(sReturnRawFileName).build();
	}
	
	@GET
	@Path("/cookielogin/{sUsername}/{sPassword}")
	@Produces("text/html")
	public Response cookieLogin(@PathParam("sUsername") String sUsername, @PathParam("sPassword") String sPassword)
    {
        String url = "http://localhost:8080/Regain/SecurityCheck2"; //You need to change this to the URL of your login servlet
        String sSessionId = "";
        try
        {
            URL url2 = new URL(url);
            URLConnection conn = url2.openConnection();
            conn.setDoOutput(true);
            conn.setUseCaches (false);
            conn.setDefaultUseCaches (false);
            conn.setReadTimeout(0);
             
            BufferedWriter out = new BufferedWriter( new OutputStreamWriter( conn.getOutputStream() ) );
            out.write("username=" + sUsername  + "&password=" + sPassword);
            out.flush();
            out.close();
            BufferedReader in = new BufferedReader( new InputStreamReader( conn.getInputStream() ) );
             
            String response;
            while ( (response = in.readLine()) != null ) 
            {
                System.out.println( response );
                sSessionId = response;
            }
            in.close();             
        } 
        catch (MalformedURLException e)
        {
            sSessionId = e.getMessage();
        } 
        catch (IOException e)
        {
            sSessionId = e.getMessage();
        }
        return Response.status(200).entity(sSessionId).build();
    }
}
