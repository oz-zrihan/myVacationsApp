class AppConfig {}

class DevelopmentConfig extends AppConfig {
  // Development or Production
  public isDevelopment = true;
  public isProduction = false;

  // Server Port:
  public port = 4000;

  // Database Host:
  public host = process.env.MYSQL_HOST || "localhost";

  // Database User
  public user = process.env.MYSQL_USER || "root";

  // Database Password:
  public password = process.env.MYSQL_PASSWORD || "";

  // Database Name:
  public database = process.env.MYSQL_DATABASE || "vacation-database";

  // Server url:
  public serverUrl = `http://${this.host}:${this.port}`;

  // Images url:
  public getImgUrl(imageFolder: string): string {
    const imagesUrl = `http://localhost:${this.port}/api/images/${imageFolder}`;
    return imagesUrl;
  }
}

class ProductionConfig extends AppConfig {
  // Development or Production
  public isDevelopment = false;
  public isProduction = true;

  // Server Port:
  public port = 4000;

  // Database Host:
  public host = process.env.MYSQL_HOST || "localhost";

  // Database User
  public user = process.env.MYSQL_USER || "root";

  // Database Password:
  public password = process.env.MYSQL_PASSWORD || "";

  // Database Name:
  public database = process.env.MYSQL_DATABASE || "vacation-database";

  // Server url:
  public serverUrl = `http://${this.host}:${this.port}`;

  // Images url:
  public getImgUrl(imageFolder: string): string {
    const imagesUrl = this.serverUrl + "/api/images/" + imageFolder;
    return imagesUrl;
  }
}

const appConfig =
  process.env.NODE_ENV === "production"
    ? new ProductionConfig()
    : new DevelopmentConfig();

export default appConfig;
