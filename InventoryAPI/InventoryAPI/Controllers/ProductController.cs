using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using InventoryAPI.Models;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Microsoft.VisualBasic.FileIO;

namespace InventoryAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IWebHostEnvironment _env;
        public ProductController(IConfiguration configuration, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _env = env;
        }

        [HttpGet]
        public JsonResult Get()
        {
            string query = @"
                select ProductId, ProductName, PhotoFileName, Make, Model, Year, Stock from
                dbo.Product
            ";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult(table);

        }

        [HttpPost]
        public JsonResult Post(Product prod)
        {
            string query = @"
                insert into dbo.Product
                (ProductName, PhotoFileName, Make, Model, Year, Stock)
                values (@ProductName, @PhotoFileName, @Make, @Model, @Year, @Stock)
            ";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@ProductName", prod.ProductName);
                    myCommand.Parameters.AddWithValue("@PhotoFileName", prod.PhotoFileName);
                    myCommand.Parameters.AddWithValue("@Make", prod.Make);
                    myCommand.Parameters.AddWithValue("@Model", prod.Model);
                    myCommand.Parameters.AddWithValue("@Year", prod.Year);
                    myCommand.Parameters.AddWithValue("@Stock", prod.Stock);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult("Added Successfully");

        }


        [HttpPut]
        public JsonResult Put(Product prod)
        {
            string query = @"
                update dbo.Product
                set ProductName = @ProductName,
                PhotoFileName = @PhotoFileName,
                Make = @Make,
                Model = @Model,
                Year = @Year,
                Stock = @Stock
                where ProductId= @ProductId
            ";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@ProductId", prod.ProductId);
                    myCommand.Parameters.AddWithValue("@ProductName", prod.ProductName);
                    myCommand.Parameters.AddWithValue("@PhotoFileName", prod.PhotoFileName);
                    myCommand.Parameters.AddWithValue("@Make", prod.Make);
                    myCommand.Parameters.AddWithValue("@Model", prod.Model);
                    myCommand.Parameters.AddWithValue("@Year", prod.Year);
                    myCommand.Parameters.AddWithValue("@Stock", prod.Stock);
                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult("Updated Successfully");

        }

        [HttpDelete("{id}")] //delete via url with id
        public JsonResult Delete(int id)
        {
            string query = @"
                delete from dbo.Product
                where ProductId=@ProductId
            ";
            DataTable table = new DataTable();
            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");
            SqlDataReader myReader;
            using (SqlConnection myCon = new SqlConnection(sqlDataSource))
            {
                myCon.Open();
                using (SqlCommand myCommand = new SqlCommand(query, myCon))
                {
                    myCommand.Parameters.AddWithValue("@ProductId", id);

                    myReader = myCommand.ExecuteReader();
                    table.Load(myReader);
                    myReader.Close();
                    myCon.Close();
                }
            }
            return new JsonResult("Deleted Successfully");

        }

        [Route("SaveFile")]
        [HttpPost]
        public JsonResult SaveFile()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                string filename = postedFile.FileName;
                var physicalPath = _env.ContentRootPath + "/Photos/" + filename;
                using(var stream=new FileStream(physicalPath, FileMode.Create))
                {
                    postedFile.CopyTo(stream);
                }
                return new JsonResult(filename);
            }
            catch(Exception)
            {

                return new JsonResult("default.png");
            }
        }

        //Source: https://stackoverflow.com/questions/20759302/upload-csv-file-to-sql-server/51580615
        private static DataTable GetDataTabletFromCSVFile(string csv_file_path)
        {
            DataTable csvData = new DataTable();
            try
            {
                using (TextFieldParser csvReader = new TextFieldParser(csv_file_path))
                {
                    csvReader.SetDelimiters(new string[] { "," });
                    csvReader.HasFieldsEnclosedInQuotes = true;
                    string[] colFields = csvReader.ReadFields();
                    foreach (string column in colFields)
                    {
                        DataColumn datecolumn = new DataColumn(column);
                        datecolumn.AllowDBNull = true;
                        csvData.Columns.Add(datecolumn);
                    }
                    while (!csvReader.EndOfData)
                    {
                        string[] fieldData = csvReader.ReadFields();
                        //Making empty value as null
                        for (int i = 0; i < fieldData.Length; i++)
                        {
                            if (fieldData[i] == "")
                            {
                                fieldData[i] = null;
                            }
                        }
                        csvData.Rows.Add(fieldData);
                    }
                }
            }
            catch (Exception ex)
            {
                return null;
            }
            return csvData;
        }

        
        void InsertDataIntoSQLServerUsingSQLBulkCopy(DataTable csvFileData)
        {
            string sqlDataSource = _configuration.GetConnectionString("ProductAppCon");
            using (SqlConnection dbConnection = new SqlConnection(sqlDataSource))
            {
                dbConnection.Open();
                using (SqlBulkCopy s = new SqlBulkCopy(dbConnection))
                {
                    s.DestinationTableName = "dbo.Product";
                    foreach (var column in csvFileData.Columns)
                        s.ColumnMappings.Add(column.ToString(), column.ToString());
                    s.WriteToServer(csvFileData);
                }
            }
        }

        [Route("SaveCSV")]
        [HttpPost]
        public JsonResult SaveCSV()
        {
            try
            {
                var httpRequest = Request.Form;
                var postedFile = httpRequest.Files[0];
                string filename = postedFile.FileName;
                var physicalPath = _env.ContentRootPath + "/CSVs/" + filename;
                using (var stream = new FileStream(physicalPath, FileMode.Create))
                {
                    postedFile.CopyTo(stream);
                }
                DataTable productData = GetDataTabletFromCSVFile(physicalPath);
                InsertDataIntoSQLServerUsingSQLBulkCopy(productData);
                return new JsonResult(filename);
            }
            catch (Exception)
            {

                return new JsonResult("CSV Formatting Incorrect");
            }
        }

    }

}

