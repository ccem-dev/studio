package br.org.studio.rest;

import javax.inject.Inject;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import br.org.studio.configuration.SystemConfigService;
import br.org.studio.exception.FillUserException;
import br.org.studio.messages.FillUserExceptionMessage;
import br.org.studio.registration.RegisterUserService;
import br.org.studio.rest.dtos.UserDto;

import com.google.gson.Gson;

@Path("/register")
public class UserResouce {

	@Inject
	private SystemConfigService systemConfigService;

	@Inject
	private RegisterUserService registerUserService;

	private Gson gson;

	@POST
	@Path("/adm")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String addAdm(String userJSon) {
		gson = new Gson();

		try {
			UserDto admDto = getDtoWithEncryptedPassword(userJSon, gson);

			systemConfigService.createAdmin(admDto);
			return gson.toJson(new Object());

		} catch (FillUserException e) {
			return gson.toJson(new FillUserExceptionMessage());
		}
	}

	@POST
	@Path("/user")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public String addUser(String userJSon) {
		gson = new Gson();

		try {
			UserDto userDto = getDtoWithEncryptedPassword(userJSon, gson);

			registerUserService.createUser(userDto);
			return gson.toJson(new FillUserExceptionMessage());

		} catch (FillUserException e) {
			return gson.toJson(new FillUserExceptionMessage());
		}
	}

	private UserDto getDtoWithEncryptedPassword(String userJSon, Gson gson) {
		UserDto admDto = gson.fromJson(userJSon, UserDto.class);
		admDto.encrypt();
		return admDto;
	}

}
