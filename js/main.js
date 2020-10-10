/*****************************************************************************************************
* WEB422-Assignment2
* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: _Jihee Kim_____ Student ID: _141389189________ Date: _2020-10-09________
*  
*
******************************************************************************************************/

let saleData = [];
let page =1;
const perPage = 10;

let saleTableTemplate = _.template(`
    <% sales.forEach(function(sale){ %>
        <tr data-id='<%- sale._id %>'>
            <td> <%- sale.customer.email %></td>
            <td> <%- sale.storeLocaion %></td>
            <td> <%- sale.items.length %></td>
            <td> <%- moment.utc(sale.saleDate).local().format('LLLL') %></td>
        </tr>
    <% }); %>
`);

let saleModelBodyTemplate = _.template(`
    <h4>Customer</h4>
    <strong>email:</strong> <%- sale.customer.email %><br>
    <strong>age:</strong> <%- sale.customer.age %><br>
    <strong>satisfaction:</strong> <%- sale.customer.satisfaction %> / 5
    <br><br>
    <h4>Items: $<%- sale.total.toFixed(2) %></h4>
    <table class="table">
        <thead>
            <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
            </tr>
        </thead>
        <tbody>
            <% _.forEach(sale.items, function(item) { %>
                <tr>
                    <td> <%- item.name %></td>
                    <td> <%- item.quantity %></td>
                    <td> $<%- items.price %></td>
                </tr>
            <% }); %>
        </tbody>
    </table>
`);

function loadSaleData() {
    fetch(`https://web422-1.herokuapp.com/api/sales?page=${page}&perPage=${perPage}`)
    .then(response => response.json())
    .then(json =>{
        saleData = json;
        $("#sale-table tbody").html(saleTableTemplate({sales: data}));
        $("#current-page").html(page);
    });
}

$(function(){
    loadSaleData();

    $("#sale-table tbody").on("click", "tr", function(e){

        let clickedId = $(this).attr("data-id");
        let clickedSale = _.find(saleData, sale => sale._id == clickedId);

        clickedSale.total = 0;

        clickedSale.item.forEach(sale => {
            clickedSale.total += (sale.price * sale.quantity);
        });

        $("#sale-modal .modal-title").html(`Sale: ${clickedSale._id}`);
        $("#sale-modal .modal-body").html(saleModelBodyTemplate({sale: clickedSale}));
        $("#sale-modal").modal({
            backdrop: 'static',
            keyboard: false
        });

    });

    $(".pagination").on("click", "#previous-page", function(e){
        if(page > 1){
            page--;
        }
        loadSaleData();
    });

    $(".pagination").on("click", "#next-page", function(e){
        page++;
        loadSaleData();
    });

});

