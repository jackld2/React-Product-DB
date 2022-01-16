## React-Product-DB 
A Demo project with the following parameters

1.  A store owner can upload their inventory data to the application
2.  A store owner can view their inventory data in a browser
3.  A store owner can search their inventory data
4.  (Bonus) A store owner can search their inventory data using multiple fields at the same time
5.  (Bonus) The application can support multiple store owners at the same time

All but the fifth parameters are met, and this application is designed to maintain a database of automotive parts in particular. The DB schema is an oversimplification of a true automotive part standard but still fulfills what I set out to do in terms of scalability and functionality.

### Backend
This application uses a Microsoft Azure SQL database courtesy of my student Azure account. The connection string is provided in appsettings but let me know if it doesn't work if you try to build this on your own. The main data table is as follows

    create table dbo.Product(
		ProductId int identity(1,1),
		ProductName nvarchar(500),
		PhotoFileName nvarchar(500),
		Make nvarchar(500),
		Model nvarchar(500),
		Year int,
		Stock int

The values are straight forward with the exception of PhotoFileName which should be `default.png` if the user does not have their own photos associated with their data. I have heard that it is not a great idea to store photos in an SQL database so I went this route. Photos can be uploaded singularly upon creation of a product or batch dropped into `/Photos/` as long as your table entries' `PhotoFileName` correspond with them.

The application uses a .NET Core Web API that supports your basic delete, put, post as well as image uploading to `/Photos/` and .csv uploading to `/CSVs/`. This was chosen with exporting  from Excel or Google Sheets as a .csv in mind. A .csv you wish to import should be in the following format, so 6 columns in order if exporting from excel.


    ProductName,PhotoFileName, Make, Model, Year, Stock
	Headlight,default.png, Mazda, Mazda 6, 2006, 5
	Transmission,default.png,Ford, Explorer, 2001, 1


### Frontend
The application uses React and bootstrap for some styling. The UI is rudimentary but straight forward, I thought I would focus on function over form for this exercise. Each entry value can be sorted and filtered. Currently you can filter any amount of columns concurrently, but sorting is exclusive to one column at a time and cannot be done with filtering. This could be improved but I deemed it low priority for now. The products page utilizes two modal panels for input. One for uploading CSVs and one for adding products. A client can also delete products with confirmation.

### Thoughts
It was about 2-3 days of normal work (spread out due to other obligations). Definitely a bit out of my comfort zone but enjoyable with relatively few hang-ups. I am not completely happy with the cleanliness of my javascript so that is something I need to work on. React and bootstrap are new to me as well but I am pleased with the ease and am interested in learning more. There were a few tricky bugs to sort out so I need to add some tests because that is the foundation of real software development (as in you should write your tests before your implementation). I might add some this weekend, but I wanted to get this posted by Friday the 14th so it is going up now. I am also going to try to host this on Azure alongside the database and I will add that link below if/when that is up.

Azure Hosting Update 01/16/2022: I am running into an issue trying to host my NETCORE web API with Azure, despite using microsoft's own documentation and methods it will not handle requests. The first issue was startup failing due to a `System.IO.DirectoryNotFoundException` error. This is strange because the directorly found indeed exists, I confirmed that it did in the Azure console. The error is arrising during startup where I am declaring static files. I then tried adding a existence check for the directory, and a creation of said directory if it is not found. That did not seem to work either. Finally I tried removing my static file code all together to see if the API would work without photo files. This seemed to clear up the errors but I am still getting a 500 error at `/api/product` so there must be another issue. I contacted azure support and checked a ton of boards online and am still investigating. Thought I would include this since it might give insight to my troubleshooting process. Will continue to troubleshoot because it might give me more insight to dev ops which is a useful skill. 


Hosted Application: TBD

###  Taskboard (If Continued Development)

 1. See if it is possible to abstract filtering, sorting, and options on the front end due to a lot of repeated code.
 2. Generate a very large test dataset, I would probably use python. I think a lot of automotive part test data is proprietary after looking around.
 3. Research and implement a real auto part data standard.
 4. Standard QOL UI updates
 5. Fix Modal window refresh bug: modal windows do not currently refresh after closing.
 6. Ability to Filter+Sort at the same time.
 7. Web scraping images/useful links for parts.
 8. Multi-store functionality, where stock could be searched across stores or checked on a per store basis.
 9. Data visualization of sale, stock, and price history using D3.js
 10. Used WebGL to provide a rotatable 3D model of part in question. Would be cool but probably not realistic in the order of a million rows and the models would be very large and hard to procure.

## Resources I used

https://icons.getbootstrap.com/

https://stackoverflow.com/questions/20759302/upload-csv-file-to-sql-server/51580615 

https://mdbootstrap.com/docs/react/utilities/float/ 

https://docs.microsoft.com/en-us/sql/ssms/quickstarts/ssms-connect-query-sql-server?view=sql-server-ver15

https://reactjs.org/tutorial/tutorial.htm

https://docs.microsoft.com/en-us/aspnet/core/tutorials/first-web-api?view=aspnetcore-6.0&tabs=visual-studio

https://www.w3schools.com/bootstrap4/

https://stackoverflow.com/questions/44535972/react-js-sort-by-ascending-and-descending

https://www.smashingmagazine.com/2020/03/sortable-tables-react/

https://stackoverflow.com/questions/43643877/filtering-a-list-with-react

https://rt-of-engineer.blogspot.com/2021/07/net-core-web-api-react-js-microsoft-sql.html 

https://upmostly.com/tutorials/react-filter-filtering-arrays-in-react-with-examples

https://www.youtube.com/watch?v=p7X8lH_XMtI

