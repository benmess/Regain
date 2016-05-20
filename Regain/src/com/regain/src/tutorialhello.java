package com.regain.src;



import java.util.Date;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
 
@Path("/")
public class tutorialhello 
{
	@GET
	@Path("/hello")
	@Produces("text/html")
	public Response getStartingPage()
	{
		String output = "<h1>Hello World!<h1>" +
				"<p>RESTful Service is running ... <br>Ping @ " + new Date().toString() + "</p<br>";
		return Response.status(200).entity(output).build();
	}

	@GET
	@Path("/hello2")
	@Produces("text/html")
	public Response getOtherResponse()
	{
		String output = "<itemtest>Some string hello 2</itemtest>";
		return Response.status(200).entity(output).build();
	}

}