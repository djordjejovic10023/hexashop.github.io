let currentPage = 1;
let productsPerPage = 3;

window.onload = function(){
    //makes nav, saves data needed for drop downs,filtering and cart
    ajaxCallBack("navigation.json",nav);

    ajaxCallBack("products.json",function(allProds){

        saveToLS("allProducts",allProds);
        cardCreation(allProds);
        cartTable();
    })
    
    ajaxCallBack("brands.json",function(allBrands){
        saveToLS("allBrands",allBrands);
        dropDown(allBrands,"ddlBrand","brandBlock");    
    })

    ajaxCallBack("category.json",function(allCats){
        saveToLS("allCategories",allCats);
        dropDown(allCats,"ddlCat","categoryBlock","");
    })

    ajaxCallBack("group.json",function(allGroups){
        saveToLS("allGrps",allGroups);
        dropDown(allGroups,"ddlGroup","groupBlock","");
    })

    ajaxCallBack("sorting.json",function(allSort){
        dropDown(allSort,"ddlSort","sortBlock")
    })

    ajaxCallBack("instagramIndexCards.json",function(allIgCards){
        saveToLS("allIgCards",allIgCards);
        socialMediaCardCreation(allIgCards);
    })

    ajaxCallBack("staff.json",function(allStaff){
        saveToLS("allStaff",allStaff);
        staffPresentation(allStaff);
    })

    ajaxCallBack("viewMoreCards.json",function(allViews){
        saveToLS("allViews",allViews);
        viewMore(allViews);
    })

    $(document).on("click",".add-to-cart-btn",function(){
        cartManipulation(parseInt($(this).data("id")));
    });

    $(document).on("click",".item-plus",function(){
        quantityManipulation(parseInt($(this).data("id")),1);
    })

    $(document).on("click",".item-minus",function(){
        quantityManipulation(parseInt($(this).data("id")),-1);
    })

    $(document).on("click",".item-delete",function(){
        itemDelete(parseInt($(this).data("id")));
    })

    $(document).on("click","#clear",clearCart);

    $(document).on("change","#ddlBrand",filteringSorting);
    $(document).on("change","#ddlCat",filteringSorting);
    $(document).on("change","#ddlGroup",filteringSorting);
    $(document).on("change","#ddlSort",filteringSorting);
    $(document).on("keyup","#tbSearch",filteringSorting);

    $(document).on("click", ".pagination-btn", function(){
        currentPage = parseInt($(this).data("page"));
        filteringSorting();
    });
}

//saves and gets from LS
function saveToLS(nameLS,valueLS){
    localStorage.setItem(nameLS,JSON.stringify(valueLS));
}

function getFromLS(nameLS){
    return JSON.parse(localStorage.getItem(nameLS));
}

//for data
function ajaxCallBack(file,success){
    $.ajax({
        url: "assets/data/" + file,
        method: "get",
        dataType: "json",
        success: success,
        error: function (code, textError, errorThrown) {
            let message = "";

            if (code.status === 0) {
                message = "Network error: Unable to connect to the server.";
            } 
            else if (code.status === 404) {
                message = "Error 404: Requested resource not found.";
            } 
            else if (code.status === 500) {
                message = "Error 500: Internal server error.";
            } 
            else if (textError === "parsererror") {
                message = "Parsing error: Invalid JSON response.";
            } 
            else if (textError === "timeout") {
                message = "Request timeout: The server took too long to respond.";
            } 
            else if (textError === "abort") {
                message = "Request aborted.";
            } 
            else {
                message = `Unexpected error: ${code.responseText || errorThrown}`;
            }

            console.log(message);
        }
    })
}

function nav(navigation){
    let html = ""
    for(let nav of navigation){
        if(nav.link === "cart.html"){
            html += `<li class="scroll-to-section"><a href="${nav.link}"><i class="fa-solid fa-cart-shopping"></i></a></li>`;
            break;
        }
        html += `<li class="scroll-to-section"><a href="${nav.link}">${nav.name}</a></li>`;

    }

    document.querySelector(".nav").innerHTML += html;
}

function dropDown(arr, ddlID, divID){
    let html = `
        <div class="form-group">
            <select class="form-control" id="${ddlID}">
                <option value="0">Choose</option>
    `;

    for(let obj of arr){
        html += `<option value="${obj.id}">${obj.name}</option>`;
    }

    html += `</select></div>`;

    document.querySelector(`#${divID}`).innerHTML = html;
}

function cardCreation(allCards){

    const page = document.body.dataset.page;

    if(page === "productsPage"){

        let start = (currentPage - 1) * productsPerPage;
        let end = start + productsPerPage;

        let paginatedProducts = allCards.slice(start, end);

        let html = "";

        for(let obj of paginatedProducts){
            html += createProductCard(obj);
        }

        document.querySelector("#product-row").innerHTML = `
            <div class="row g-4 justify-content-center">
                ${html}
            </div>
            <div class="row col-12">
                <div class="col-12">
                    <div class="pagination-container">
                        ${paginationButtons(allCards.length)}
                    </div>
                </div>
            </div>
        `;
    }

    if(page === "homePage"){

        let menCards = allCards.filter(obj => obj.group === 1);
        let womenCards = allCards.filter(obj => obj.group === 2);
        let kidsCards = allCards.filter(obj => obj.group === 3);

        renderCarousel("#menArea", menCards);
        renderCarousel("#womenArea", womenCards);
        renderCarousel("#kidArea", kidsCards);
    }
}

function paginationButtons(totalProducts){
    let totalPages = Math.ceil(totalProducts / productsPerPage);
    let html = "";

    for(let i = 1; i <= totalPages; i++){
        html += `
            <button 
                class="pagination-btn ${i === currentPage ? 'active-page' : ''}"
                data-page="${i}"
            >
                ${i}
            </button>
        `;
    }

    return html;
}

function createCard(obj){
    return `
        <div class="item">
            <div class="thumb">
                <img src="${obj.img}" alt="${obj.title}"/>
            </div>
            <div class="down-content">
                <h4>${obj.title} - ${gettingDataNeededForTheProduct(obj.brandID,"allBrands")}</h4>
                <h5>${gettingDataNeededForTheProduct(obj.catID,"allCategories")}</h5>
                <h5>${gettingDataNeededForTheProduct(obj.group,"allGrps")}</h5>
                <span>${gettingPrice(obj.price,obj.discount)}</span>
                <button class="add-to-cart-btn" data-id="${obj.id}">
                    Add to Cart
                </button>
            </div>
        </div>
    `;
}

function createProductCard(obj){
    return `
        <div class="col-lg-4 col-md-6 col-12">
            <div class="item product-card">
                <div class="thumb">
                    <img src="${obj.img}" alt="${obj.title}"/>
                </div>
                <div class="down-content">
                    <h4>${obj.title} - ${gettingDataNeededForTheProduct(obj.brandID,"allBrands")}</h4>
                    <h5>${gettingDataNeededForTheProduct(obj.catID,"allCategories")}</h5>
                    <h5>${gettingDataNeededForTheProduct(obj.group,"allGrps")}</h5>
                    <span>${gettingPrice(obj.price,obj.discount)}</span>
                    <button class="add-to-cart-btn" data-id="${obj.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

function renderCarousel(selector, data){
    let html = "";

    for(let obj of data){
        html += createCard(obj);
    }

    let $carousel = $(selector);

    if ($carousel.hasClass("owl-loaded")) {
        $carousel.trigger('destroy.owl.carousel');
        $carousel.removeClass('owl-loaded');
        $carousel.find('.owl-stage-outer').children().unwrap();
    }

    $carousel.html(html);
    $carousel.owlCarousel({
        loop: true,
        margin: 20,
        nav: true,
        dots: false,
        responsive: {
            0: { items: 1 },
            600: { items: 2 },
            1000: { items: 3 }
        }
    });
}

function gettingDataNeededForTheProduct(idData,localStorageName){
    let ls = getFromLS(localStorageName);
    let found = ls.find(function(obj){
        return obj.id === idData
    })
    return found ? found.name : "";
}

function gettingPrice(price,discount){
    if(discount === null){
        return `
            <div class="price-block">
                <p>$${price}</p>
            </div>
        `;
    }

    let calculatedPrice = price - (price * discount / 100);
    return `
        <div class="price-block">
            <p>Discount: ${discount}%</p>
            <p><del>$${price}</del> $${calculatedPrice}</p>
        </div>
    `;
}

function socialMediaCardCreation(allIgCards){
    let html = "";
    for(let obj of allIgCards){
        html+=`
            <div class="col-2">
                <div class="thumb">
                    <div class="icon">
                        <a href="${obj.href}" target="_blank">
                            <h6>${obj.name}</h6>
                            <i class="fa fa-instagram"></i>
                        </a>
                    </div>
                    <img src="${obj.img}" alt="${obj.name}"/>
                </div>
            </div>
        `
    }

    document.querySelector(".row.images").innerHTML = html;
}

function staffPresentation(allStaff){
    let socialIcons = ['facebook', 'twitter', 'linkedin', 'instagram'];
    let networks = [
        'https://www.facebook.com/',
        'https://x.com/',
        'https://www.linkedin.com/',
        'https://www.instagram.com'
    ];

    let html = "";

    for (let obj of allStaff) {
        let socialHtml = "";
        for (let i = 0; i < socialIcons.length; i++) {
            socialHtml += `
                <li>
                    <a href="${networks[i]}" target="_blank">
                        <i class="fa fa-${socialIcons[i]}"></i>
                    </a>
                </li>
            `;
        }
        html += `
            <div class="col-lg-4">
                <div class="team-item">
                    <div class="thumb">
                        <div class="hover-effect">
                            <div class="inner-content">
                                <ul>
                                    ${socialHtml}
                                </ul>
                            </div>
                        </div>
                        <img src="${obj.img}" alt="${obj.name}"/>
                    </div>
                    <div class="down-content">
                        <h4>${obj.name}</h4>
                        <span>${obj.role}</span>
                    </div>
                </div>
            </div>
        `;
    }

    document.querySelector(".our-team .row").innerHTML = html;
}

function viewMore(allViews) {
    let html = "";

    for (let obj of allViews) {
        html += `
            <div class="col-lg-4">
                <div class="service-item">
                    <h4>${obj.title}</h4>

                    <p id="serviceP${obj.id}" class="service-text">
                        ${obj.text}
                    </p>
                    <button 
                        type="button" 
                        class="view-more-btn toggle-btn"
                        data-id="${obj.id}"
                    >
                        View more
                    </button>
                    <img src="${obj.img}" alt="${obj.title}">
                </div>
            </div>
        `;
    }

    $(".our-services .row").html(html);

    $(".toggle-btn").on("click", function () {
        let id = $(this).data("id");
        let p = $("#serviceP" + id);

        p.stop(true, true).slideToggle(300);

        if ($(this).text().trim() === "View more") {
            $(this).text("View less");
        } else {
            $(this).text("View more");
        }
    });
}

function filteringSorting(){
    let products = getFromLS("allProducts");

    const categoryId = parseInt($("#ddlCat").val()) || 0;
    const brandIdOfDropDown = parseInt($("#ddlBrand").val()) || 0;
    const groupId = parseInt($("#ddlGroup").val()) || 0;
    const sortId = $("#ddlSort").val();
    const searchValue = ($("#tbSearch").val() || "").trim().toLowerCase();

    if(categoryId !== 0){
        products = products.filter(function(prod){
            return prod.catID === categoryId;
        })
    }

    if(brandIdOfDropDown !== 0){
        products = products.filter(function(prod){
            return prod.brandID === brandIdOfDropDown;
        })
    }

    if(groupId !== 0){
        products = products.filter(function(prod){
            return prod.group === groupId;
        })
    }

    if(searchValue.length){
        products = products.filter(function(prod){
            return prod.title.toLowerCase().includes(searchValue);
        })
    }

    if(sortId === "ascName"){
        products.sort(function(a,b){
            return a.title.localeCompare(b.title);
        })
    }
    else if(sortId === "descName"){
        products.sort(function(a,b){
            return b.title.localeCompare(a.title);
        })
    }
    else if(sortId === "ascPrice"){
        products.sort(function(a,b){
            return calculatingPriceForSort(a.price,a.discount) - calculatingPriceForSort(b.price,b.discount);
        });
    }
    else if(sortId === "descPrice"){
        products.sort(function(a,b){
            return calculatingPriceForSort(b.price,b.discount) - calculatingPriceForSort(a.price,a.discount);
        });
    }

    let totalPages = Math.ceil(products.length / productsPerPage);

    if(currentPage > totalPages){
        currentPage = 1;
    }
    cardCreation(products)
}

function calculatingPriceForSort(price, discount){
    if(discount === null) return price;
    return price - (price * discount / 100);
}

// cart part

function cartLocalStorage(){
    return getFromLS("cart") || [];
}

function calculateFinalPrice(price, discount){
    if(discount === null){
        return price;
    }

    return price - (price * discount / 100);
}

function cartManipulation(id){
    //pushes the product into cart array or adds to its quantity
    let products = getFromLS("allProducts");

    let found = products.find(function(p){
        return p.id === id;
    });

    if(!found){
        return;
    }

    let cartItem = cartLocalStorage();

    let itemAlreadyExists = cartItem.find(function(existingItem){
        return existingItem.itemId === id;
    });

    if(itemAlreadyExists){
        if(itemAlreadyExists.quantity >= 20){
            return;
        }
        itemAlreadyExists.quantity += 1;
    }
    else{
        cartItem.push({
            itemId: id,
            quantity: 1
        });
    }

    saveToLS("cart", cartItem);
    showCartMessage(`${found.title} added to cart 🛒`);
    cartTable();
}

function quantityManipulation(id, num){
    //quantity of the product goes up or down
    let items = cartLocalStorage();

    let found = items.find(function(i){
        return i.itemId === id;
    });

    if(!found){
        return;
    }

    if(num < 0 && found.quantity <= 1){
        return;
    }

    if(num > 0 && found.quantity >= 20){
        return;
    }

    found.quantity += num;
    saveToLS("cart", items);
    cartTable();
}

function itemDelete(id){
    let items = cartLocalStorage();
    let itemsWithoutDeletedOne = items.filter(function(i){
        return i.itemId !== id;
    });

    saveToLS("cart", itemsWithoutDeletedOne);
    cartTable();
}

function clearCart(){
    saveToLS("cart", []);
    cartTable();
}

function cartTable(){
    let total = 0;
    let eachRow = "";
    let cartDiv = document.querySelector("#cartDiv");
    let lsItems = cartLocalStorage();
    let products = getFromLS("allProducts");

    if(lsItems.length === 0){
        cartDiv.innerHTML = `
            <p>Cart is empty</p>
        `;
        return;
    }

    for(let oneItem of lsItems){
        let product = products.find(function(p){
            return p.id === oneItem.itemId;
        });

        if(!product){
            continue;
        }

        let price = calculateFinalPrice(
            product.price,
            product.discount
        );

        let rowTotal = price * oneItem.quantity;
        total += rowTotal;
        eachRow += `
            <tr>
                <td>${product.title}</td>
                <td class="text-end">
                    $${price.toFixed(2)}
                </td>
                <td class="text-center">
                    <button
                        class="btn btn-outline-secondary btn-sm item-minus"
                        data-id="${product.id}"
                    >
                        -
                    </button>
                    <span class="mx-2">
                        ${oneItem.quantity}
                    </span>
                    <button
                        class="btn btn-outline-secondary btn-sm item-plus"
                        data-id="${product.id}"
                    >
                        +
                    </button>
                </td>
                <td class="text-end">
                    $${rowTotal.toFixed(2)}
                </td>
                <td class="text-end">
                    <button
                        class="btn btn-outline-danger btn-sm item-delete"
                        data-id="${product.id}"
                    >
                        Delete
                    </button>
                </td>
            </tr>
        `;
    }

    cartDiv.innerHTML = `
        <div class="table-responsive">
            <table class="table table-sm align-middle">
                <thead>
                    <tr>
                        <th>Product</th>
                        <th class="text-end">Price</th>
                        <th class="text-center">Quantity</th>
                        <th class="text-end">Total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    ${eachRow}
                </tbody>
                <tfoot>
                    <tr>
                        <th colspan="3">
                            Your Total
                        </th>
                        <th class="text-end">
                            $${total.toFixed(2)}
                        </th>
                        <th></th>
                    </tr>
                </tfoot>
            </table>
        </div>
    `;
}


function showCartMessage(message = "Added to cart!") {
    //message
    let toast = $(`
        <div class="cart-toast">
            ${message}
        </div>
    `);

    $("body").append(toast);

    setTimeout(function () {
        toast.addClass("show");
    }, 10);

    setTimeout(function () {
        toast.removeClass("show");
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}