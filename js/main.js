(function ($) {
    "use strict";
    
    // Dropdown on mouse hover
    $(document).ready(function () {
        function toggleNavbarMethod() {
            if ($(window).width() > 992) {
                $('.navbar .dropdown').on('mouseover', function () {
                    $('.dropdown-toggle', this).trigger('click');
                }).on('mouseout', function () {
                    $('.dropdown-toggle', this).trigger('click').blur();
                });
            } else {
                $('.navbar .dropdown').off('mouseover').off('mouseout');
            }
        }
        toggleNavbarMethod();
        $(window).resize(toggleNavbarMethod);
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Vendor carousel
    $('.vendor-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:2
            },
            576:{
                items:3
            },
            768:{
                items:4
            },
            992:{
                items:5
            },
            1200:{
                items:6
            }
        }
    });


    // Related carousel
    $('.related-carousel').owlCarousel({
        loop: true,
        margin: 29,
        nav: false,
        autoplay: true,
        smartSpeed: 1000,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:2
            },
            768:{
                items:3
            },
            992:{
                items:4
            }
        }
    });


    // Product Quantity
    $('.quantity button').on('click', function () {
        var button = $(this);
        var oldValue = button.parent().parent().find('input').val();
        if (button.hasClass('btn-plus')) {
            var newVal = parseFloat(oldValue) + 1;
        } else {
            if (oldValue > 0) {
                var newVal = parseFloat(oldValue) - 1;
            } else {
                newVal = 0;
            }
        }
        button.parent().parent().find('input').val(newVal);
    });
    
})(jQuery);

document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-container');

    // Fetch products from the backend
    fetch('http://localhost:5000/api/products')
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productHTML = `
                    <div class="col-lg-4 col-md-6 col-sm-6 pb-1">
                        <div class="product-item bg-light mb-4">
                            <div class="product-img position-relative overflow-hidden">
                                <img class="img-fluid w-100" src="${product.imageurl}" alt="${product.name}">
                                <div class="product-action">
                                    <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                                    <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
                                    <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                                    <a class="btn btn-outline-dark btn-square" href="detail.html?code=${product.code}"><i class="fa fa-search"></i></a>
                                </div>
                            </div>
                            <div class="text-center py-4">
                                <a class="h6 text-decoration-none text-truncate" href="detail.html?code=${product.code}">${product.name}</a>
                                <div class="d-flex align-items-center justify-content-center mt-2">
                                    <h5>${product.disprice > 0 ? product.disprice : product.price}đ</h5>
                                    ${product.disprice > 0 ? `<h6 class="text-muted ml-2"><del>${product.price}đ</del></h6>` : ''}
                                </div>
                                <div class="d-flex align-items-center justify-content-center mb-1">
                                    <small class="fa fa-star text-primary mr-1"></small>
                                    <small class="fa fa-star text-primary mr-1"></small>
                                    <small class="fa fa-star text-primary mr-1"></small>
                                    <small class="fa fa-star-half-alt text-primary mr-1"></small>
                                    <small class="far fa-star text-primary mr-1"></small>
                                    <small>(1)</small>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                productContainer.innerHTML += productHTML;
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});

document.addEventListener('DOMContentLoaded', () => {
    const productContainer = document.getElementById('product-search');

    const urlParams = new URLSearchParams(window.location.search);
    const searchinput = urlParams.get('q');

    fetch(`http://localhost:5000/api/products/search/${searchinput}`)
        .then(response => response.json())
        .then(products => {
            products.forEach(product => {
                const productHTML = `
                    <div class="col-lg-4 col-md-6 col-sm-6 pb-1">
                        <div class="product-item bg-light mb-4">
                            <div class="product-img position-relative overflow-hidden">
                                <img class="img-fluid w-100" src="${product.imageurl}" alt="${product.name}">
                                <div class="product-action">
                                    <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                                    <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
                                    <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                                    <a class="btn btn-outline-dark btn-square" href="detail.html?code=${product.code}"><i class="fa fa-search"></i></a>
                                </div>
                            </div>
                            <div class="text-center py-4">
                                <a class="h6 text-decoration-none text-truncate" href="detail.html?code=${product.code}">${product.name}</a>
                                <div class="d-flex align-items-center justify-content-center mt-2">
                                    <h5>${product.disprice > 0 ? product.disprice : product.price}đ</h5>
                                    ${product.disprice > 0 ? `<h6 class="text-muted ml-2"><del>${product.price}đ</del></h6>` : ''}
                                </div>
                                <div class="d-flex align-items-center justify-content-center mb-1">
                                    <small class="fa fa-star text-primary mr-1"></small>
                                    <small class="fa fa-star text-primary mr-1"></small>
                                    <small class="fa fa-star text-primary mr-1"></small>
                                    <small class="fa fa-star-half-alt text-primary mr-1"></small>
                                    <small class="far fa-star text-primary mr-1"></small>
                                    <small>(1)</small>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                productContainer.innerHTML += productHTML;
            });
        })
        .catch(error => console.error('Error fetching products:', error));
});

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productCode = urlParams.get('code');
    const recommendationsContainer = document.getElementById('recommendations');

    fetch(`http://localhost:5000/api/products/recommend/${productCode}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch recommendations');
            }
            return response.json();
        })
        .then(recommendedProducts => {
            let recommendationsHTML = '';

            recommendedProducts.forEach(product => {
                recommendationsHTML += `
                    <div class="product-item bg-light mb-4">
                        <div class="product-img position-relative overflow-hidden">
                            <img class="img-fluid w-100" src="${product.imageurl}" alt="${product.name}">
                            <div class="product-action">
                                <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                                <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
                                <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                                <a class="btn btn-outline-dark btn-square" href="detail.html?code=${product.code}"><i class="fa fa-search"></i></a>
                            </div>
                        </div>
                        <div class="text-center py-4">
                            <a class="h6 text-decoration-none text-truncate" href="detail.html?code=${product.code}">${product.name}</a>
                            <div class="d-flex align-items-center justify-content-center mt-2">
                                <h5>${product.price}đ</h5>
                                ${product.disprice > 0 ? `<h6 class="text-muted ml-2"><del>${product.price}đ</del></h6>` : ''}
                            </div>
                        </div>
                    </div>
                `;
            });

            recommendationsContainer.innerHTML = recommendationsHTML;
            $('.related-carousel').owlCarousel({
                loop: true,
                margin: 29,
                nav: false,
                autoplay: true,
                smartSpeed: 1000,
                responsive: {
                    0: {
                        items: 1
                    },
                    576: {
                        items: 2
                    },
                    768: {
                        items: 3
                    },
                    992: {
                        items: 4
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error fetching recommendations:', error);
        });
});