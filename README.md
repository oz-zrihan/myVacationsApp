# myVacationsApp

My Vacations App

This app where built with:

Backend: NodeJs, Express, TypeScript.
security: express-rate-limit, prevent-xss, helmet, hashing password with crypto ,and prevent Sql-injections.

Database: SQL.

Frontend: React, Express, Redux, SASS, TypeScript.

-- Docker: Docker files and Docker compose are ready inside.

================================================================

The application is made from user interface and admin interface.
Both need to login first...

![Login Screen](/screenshots/login.png)

... or register

![Register Screen](/screenshots/register.png)

====== User Interface =====

The user then redirects to "vacations" page.
the page is composed from filter menu...

![Filter Menu](/screenshots/userFilter.png)

... and vacations cards.
By clicking the "like" button the user will add the vacation to is "following" list
![Vacation Card](/screenshots/userVacationCard.png)
![Vacation Card](/screenshots/userVacationCardOpen.png)

====== Admin Interface =====

The admin will redirect to "admin-vacations" page.
the page is composed from filter menu, add vacation button and reports button, also he's able to edit the header slider images

![Filter Menu](/screenshots/adminFilter.png)
![Vacation Card](/screenshots/adminAddVacation.png)

On the top of the "vacation card" the admin can see how many followers, this vacation have.
also he can delete the vacation or edit it.

![Edit Vacation](/screenshots/adminVacationEdit.png)

By clicking the "add vacation" button the admin will redirect to "add-vacation" page.

![Add Vacation](/screenshots/adminAddVacation.png)

By clicking the "Reports" button the admin will redirect to "admin-reports" page.
there his got followers reports for each vacation, and filter menu to filter only "following vacation".
also he's able to download the report as CSV file, the downloaded reports will correspond to the filters that were used.

![Followers report](/screenshots/adminVacationFollowers.png)

Also he will see "vacations by country",
where the admin can see the followers of each country and there email.

![Followers report](/screenshots/AdminCountryFollowers.png)

================================================================

logging info:

User:
username: bryceGuestUser@gmail.com
password: 0000

Admin:
username: brycevaction@gmail.com
password: brycevaction1234
