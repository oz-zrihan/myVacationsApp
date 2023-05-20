class AppConfig {
  public registerUrl = "http://localhost:4000/api/auth/register";
  public loginUrl = "http://localhost:4000/api/auth/login";
  public followersUrl = "http://localhost:4000/api/followers/";

  public vacationsUrl = "http://localhost:4000/api/vacations/";
  public usersUrl = "http://localhost:4000/api/users/";
  public countriesUrl = "http://localhost:4000/api/countries/";
  public airlinesUrl = "http://localhost:4000/api/airlines/";
  public luggageUrl = "http://localhost:4000/api/luggage/";
  public boardsUrl = "http://localhost:4000/api/boards/";

  public imagesUrl = "http://localhost:4000/api/images/";
}

const appConfig = new AppConfig();

export default appConfig;
