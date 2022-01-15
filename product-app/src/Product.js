import React, {Component} from 'react';
import {variables} from './Variables.js';

export class Product extends Component{
    constructor(props) {
        super(props);

        this.state={
            products:[],
            modalTitle:"",

            ProductName:"",
            ProductId:0,
            Stock:0,
            Make:"",
            Model:"",
            Year:"",
            PhotoFileName:"default.png",
            PhotoPath:variables.PHOTO_URL,


            ProductIdFilter:"",
            ProductNameFilter:"",
            MakeFilter:"",
            ModelFilter:"",
            YearFilter:"",
            StockFilter:"",

            ProductsWithoutFilter:[]
        }
    }

    FilterFn(){
        var ProductIdFilter=this.state.ProductIdFilter;
        var ProductNameFilter = this.state.ProductNameFilter;
        var MakeFilter = this.state.MakeFilter;
        var ModelFilter = this.state.ModelFilter;
        var YearFilter = this.state.YearFilter;
        var StockFilter = this.state.StockFilter;
        var filteredData = this.state.ProductsWithoutFilter.filter(
            function(el){
                return el.ProductId.toString().toLowerCase().includes(
                    ProductIdFilter.toString().trim().toLowerCase()
                )&&
                el.ProductName.toString().toLowerCase().includes(
                    ProductNameFilter.toString().trim().toLowerCase()
                )&&
                el.Make.toString().toLowerCase().includes(
                    MakeFilter.toString().trim().toLowerCase()
                )&&
                el.Model.toString().toLowerCase().includes(
                    ModelFilter.toString().trim().toLowerCase()
                )&&
                el.Year.toString().toLowerCase().includes(
                    YearFilter.toString().trim().toLowerCase()
                )&&
                el.Stock.toString().toLowerCase().includes(
                    StockFilter.toString().trim().toLowerCase()
                )
            }
        );
        this.setState({products:filteredData});
    }
    
    //sort ascending and descending
    //Currently cannot sort and filter at same time, TBD
    sortResult(prop,asc){
        var sortedData=this.state.ProductsWithoutFilter.sort(function(a,b){
            if(asc){
                return (a[prop]>b[prop])?1:((a[prop]<b[prop])?-1:0);
            }
            else{
                return (b[prop]>a[prop])?1:((b[prop]<a[prop])?-1:0);
            }
        });

        this.setState({products:sortedData});
    }

    changeProductIdFilter = (e)=>{
        this.state.ProductIdFilter=e.target.value;
        this.FilterFn();
    }
    changeProductNameFilter = (e)=>{
        this.state.ProductNameFilter=e.target.value;
        this.FilterFn();
    }
    changeMakeFilter = (e)=>{
        this.state.MakeFilter=e.target.value;
        this.FilterFn();
    }
    changeModelFilter = (e)=>{
        this.state.ModelFilter=e.target.value;
        this.FilterFn();
    }
    changeYearFilter = (e)=>{
        this.state.YearFilter=e.target.value;
        this.FilterFn();
    }
    changeStockFilter = (e)=>{
        this.state.StockFilter=e.target.value;
        this.FilterFn();
    }


    refreshList(){
        fetch(variables.API_URL+'product')
        .then(response=>response.json())
        .then(data=>{
            this.setState({products:data, ProductsWithoutFilter:data});
        });
    }
    
    componentDidMount(){
        this.refreshList();
    }

    changeProductName =(e)=>{
        this.setState({ProductName:e.target.value});
    }
    changeProductPhoto =(e)=>{
        this.setState({PhotoFileName:e.target.value});
    }
    changeProductMake =(e)=>{
        this.setState({Make:e.target.value});
    }
    changeProductModel =(e)=>{
        this.setState({Model:e.target.value});
    }
    changeProductYear =(e)=>{
        this.setState({Year:e.target.value});
    }
    changeProductStock =(e)=>{
        this.setState({Stock:e.target.value});
    }

    addClick(){
        this.setState({
            modalTitle:"Add Product",
            ProductId:0,
            ProductName:"",
            Stock:0,
            Make:"",
            Model:"",
            Year:0,
            PhotoFileName:"default.png"

        });
    }
    editClick(prod){
        this.setState({
            modalTitle:"Edit Product",
            ProductId:prod.ProductId,
            ProductName:prod.ProductName,
            Stock:prod.Stock,
            Make:prod.Make,
            Model:prod.Model,
            Year:prod.Year,
            PhotoFileName:prod.PhotoFileName
        });
    
    }

    createClick(){
        fetch(variables.API_URL+'product',{
            method:'POST',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                ProductName:this.state.ProductName,
                PhotoFileName:this.state.PhotoFileName,
                Make:this.state.Make,
                Model:this.state.Model,
                Year:this.state.Year,
                Stock:this.state.Stock
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
            this.refreshList();
        },(error)=>{
            alert('Failed');
        })
    }

    updateClick(){
        fetch(variables.API_URL+'product',{
            method:'PUT',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                ProductId:this.state.ProductId,
                ProductName:this.state.ProductName,
                PhotoFileName:this.state.PhotoFileName,
                Make:this.state.Make,
                Model:this.state.Model,
                Year:this.state.Year,
                Stock:this.state.Stock
            })
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
            this.refreshList();
        },(error)=>{
            alert('Failed');
        })
    }

    deleteClick(id){
        if(window.confirm('Delete this product?')){
        fetch(variables.API_URL+'product/'+id,{
            method:'DELETE',
            headers:{
                'Accept':'application/json',
                'Content-Type':'application/json'
            }
        })
        .then(res=>res.json())
        .then((result)=>{
            alert(result);
            this.refreshList();
        },(error)=>{
            alert('Failed');
        })}
    }

    imageUpload=(e)=>{
        e.preventDefault();

        const formData=new FormData();
        formData.append("file",e.target.files[0],e.target.files[0].name);

        fetch(variables.API_URL+'product/savefile',{
            method:'POST',
            body:formData
        })
        .then(res=>res.json())
        .then(data=>{
            this.setState({PhotoFileName:data});
        })
    }

    csvUpload=(e)=>{
        e.preventDefault();

        const formData=new FormData();
        formData.append("file",e.target.files[0],e.target.files[0].name);

        fetch(variables.API_URL+'product/savecsv',{
            method:'POST',
            body:formData
        })
        .then(res=>res.json())
        .then()
        .then(data=>{
            this.refreshList();
        })
        formData.delete("file",e.target.files[0],e.target.files[0].name);
    }
    
    render() {
        const {
            products,
            modalTitle,
            ProductId,
            ProductName,
            PhotoFileName,
            PhotoPath,
            Make,
            Model,
            Year,
            Stock
        }=this.state;
        return(
<div>
    <div>
        <button type="button"
        className="btn btn-primary m-2 float-end"
        data-bs-toggle="modal"
        data-bs-target="#csvModal"
        >
            Upload CSV
        </button>

        <button type="button"
        className="btn btn-primary m-2 float-end"
        data-bs-toggle="modal"
        data-bs-target="#editmodal"
        onClick={()=>this.addClick()}>
            Add Product
        </button>
    </div>

    <table className="table table-striped">
        <thead>
            <tr>
                <th>
                <div className="d-flex flex-row">
                    <input className="form-control m-2"
                    onChange={this.changeProductIdFilter}
                    placeholder="Filter"/>
                    <button type="button" className="btn btn-light"
                    onClick={()=>this.sortResult('ProductId',true)}>
                        {/* TODO: figure out how to clean these icon references up */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                        </svg>
                    </button>

                    <button type="button" className="btn btn-light"
                    onClick={()=>this.sortResult('ProductId',false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                        </svg>
                    </button>

                    </div>
                    Product Id
                </th>
                <th>
                <div className="d-flex flex-row"> 
                    <input className="form-control m-2"
                    onChange={this.changeProductNameFilter}
                    placeholder="Filter"/>

                    <button type="button" className="btn btn-light"
                    onClick={()=>this.sortResult('ProductName',true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                        </svg>
                    </button>

                    <button type="button" className="btn btn-light"
                    onClick={()=>this.sortResult('ProductName',false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                        </svg>
                    </button>
                    </div>
                    Product Name
                </th>
                <th>
                <div className="d-flex flex-row">
                    <input className="form-control m-2"
                    onChange={this.changeMakeFilter}
                    placeholder="Filter"/>
                    <button type="button" className="btn btn-light"
                    onClick={()=>this.sortResult('Make',true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                        </svg>
                    </button>

                    <button type="button" className="btn btn-light"
                    onClick={()=>this.sortResult('Make',false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                        </svg>
                    </button>
                    </div>
                    Make
                </th>
                <th>
                <div className="d-flex flex-row">
                    <input className="form-control m-2"
                    onChange={this.changeModelFilter}
                    placeholder="Filter"/>
                    <button type="button" className="btn btn-light"
                    onClick={()=>this.sortResult('Model',true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                        </svg>
                    </button>

                    <button type="button" className="btn btn-light"
                    onClick={()=>this.sortResult('Model',false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                        </svg>
                    </button>
                    </div>
                    Model
                </th>
                <th>
                <div className="d-flex flex-row">
                    <input className="form-control m-2"
                    onChange={this.changeYearFilter}
                    placeholder="Filter"/>
                    <button type="button" className="btn btn-light"
                    onClick={()=>this.sortResult('Year',true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                        </svg>
                    </button>

                    <button type="button" className="btn btn-light"
                    onClick={()=>this.sortResult('Year',false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                        </svg>
                    </button>
                    </div>
                    Year
                </th>
                <th>
                <div className="d-flex flex-row">

                    <input className="form-control m-2"
                    onChange={this.changeStockFilter}
                    placeholder="Filter"/>
                    <button type="button" className="btn btn-light"
                    onClick={()=>this.sortResult('Stock',true)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-down-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 2.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V4.5z"/>
                        </svg>
                    </button>

                    <button type="button" className="btn btn-light"
                    onClick={()=>this.sortResult('Stock',false)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-up-square" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm8.5 9.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z"/>
                        </svg>
                    </button>
                </div>
                    Stock
                </th>
                <th>
                    Preview
                </th>
                <th>
                    Options
                </th>
            </tr>
        </thead>
        <tbody>
            {products.map(prod=>
                <tr key={prod.ProductId}>
                    <td>{prod.ProductId}</td>
                    <td>{prod.ProductName}</td>
                    <td>{prod.Make}</td>
                    <td>{prod.Model}</td>
                    <td>{prod.Year}</td>
                    <td>{prod.Stock}</td>
                    <td><img width="75px" height="75px"
                    src={PhotoPath+prod.PhotoFileName}/></td>
                    <td>
                        <button type="button"
                        className="btn btn-light mr-1"
                        data-bs-toggle="modal"
                        data-bs-target="#editmodal"
                        onClick={()=>this.editClick(prod)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
                            </svg>
                        </button>
                        <button type="button"
                        className="btn btn-light mr-1"
                        onClick={()=>this.deleteClick(prod.ProductId)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                            <path fillRule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </button>
                    </td>
                </tr>)}
        </tbody>
    </table>

    {/* editmodal contains prompt for update/addition of products */}
    <div class="modal fade" id="editmodal" tableIndex="-1" aria-hidden="true">
    <div className="modal-dialog modal-lg modal-dialog-centered">
    <div className="modal-content">
        <div className="modal-header">
            <h5 className="modal-title>">{modalTitle}</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
            </button>
        </div>

        <div className="modal-body">
            <div className="d-flex flex-row bd-highlight mb-3">
                <div className="p-2 w-50 bd-highlight">

                    <div className="input-group mb-3">
                        <span className="input-group-text">Product Name</span>
                        <input type="text" className="form-control"
                        value={ProductName}
                        onChange={this.changeProductName}/>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Make</span>
                        <input type="text" className="form-control"
                        value={Make}
                        onChange={this.changeProductMake}/>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Model</span>
                        <input type="text" className="form-control"
                        value={Model}
                        onChange={this.changeProductModel}/>
                    </div>
                    <div className="input-group mb-3">
                        <span className="input-group-text">Year</span>
                        <input type="text" className="form-control"
                        value={Year}
                        onChange={this.changeProductYear}/>
                    </div>

                    <div className="input-group mb-3">
                        <span className="input-group-text">Stock</span>
                        <input type="text" className="form-control"
                        value={Stock}
                        onChange={this.changeProductStock}/>
                    </div>


                </div>
                <div className="p-2 w-50 bd-highlight">
                    <img width="250px" height="250px"
                    src={PhotoPath+PhotoFileName}/>
                    <input className="m-2" type="file" onChange={this.imageUpload}/>
                </div>
            </div>

            {ProductId==0?
            <button type="button"
            className="btn btn-primary float-start"
            onClick={()=>this.createClick()}
            >Create</button>:null}

            {ProductId!=0?
            <button type="button"
            className="btn btn-primary float-start"
            onClick={()=>this.updateClick()}
            >Update</button>:null}
        
        </div>
        </div>

    </div>
    </div>

    {/* csvModal contains prompt for CSV upload */}
    <div class="modal fade" id="csvModal" tableIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title>">{'Upload CSV'}</h5>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                    </button>
                </div>

                <div className="modal-body">
                    <div className="d-flex flex-row bd-highlight mb-3">
                        <div className="p-2 w-50 bd-highlight">
                            <input className="m-2" type="file" onChange={this.csvUpload}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</div>

        )
    }
    
}
