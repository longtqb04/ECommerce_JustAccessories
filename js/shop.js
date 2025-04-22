let currentFilters = {
    price: ['all'],
    category: ['all'],
    special: ['all']
};

document.addEventListener('DOMContentLoaded', () => {
    // Initialize filters
    setupFilterHandlers('price');
    setupFilterHandlers('color'); // This is for category filters
    
    // Initial product load
    fetchProducts();
});

function setupFilterHandlers(filterType) {
    const checkboxes = document.querySelectorAll(`input[id^="${filterType}-"]`);
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', async (e) => {
            const value = e.target.id.replace(`${filterType}-`, '');
            
            if (value === 'all') {
                if (e.target.checked) {
                    currentFilters[filterType] = ['all'];
                    // Uncheck other checkboxes
                    checkboxes.forEach(cb => {
                        if (cb.id !== `${filterType}-all`) {
                            cb.checked = false;
                        }
                    });
                } else {
                    currentFilters[filterType] = [];
                }
            } else {
                // Uncheck "all" option
                document.getElementById(`${filterType}-all`).checked = false;
                
                if (e.target.checked) {
                    // Remove 'all' if it exists
                    currentFilters[filterType] = currentFilters[filterType].filter(f => f !== 'all');
                    currentFilters[filterType].push(value);
                } else {
                    currentFilters[filterType] = currentFilters[filterType].filter(f => f !== value);
                }
            }

            await fetchProducts();
        });
    });
}

async function fetchProducts() {
    try {
        const priceRanges = {
            '1': { min: 0, max: 500000 },
            '2': { min: 500000, max: 1000000 },
            '3': { min: 1000000, max: Number.MAX_SAFE_INTEGER }
        };

        const params = new URLSearchParams();
        
        if (!currentFilters.price.includes('all')) {
            currentFilters.price.forEach(price => {
                if (priceRanges[price]) {
                    params.append('minPrice', priceRanges[price].min);
                    params.append('maxPrice', priceRanges[price].max);
                }
            });
        }

        if (!currentFilters.category.includes('all')) {
            currentFilters.category.forEach(category => {
                params.append('category', category);
            });
        }

        const response = await fetch(`http://localhost:5000/api/products/filter?${params}`);
        const products = await response.json();
        
        renderProducts(products);
        updateProductCounts(products);

    } catch (error) {
        console.error('Error fetching filtered products:', error);
    }
}

function renderProducts(products) {
    const container = document.getElementById('product-container');
    
    if (products.length === 0) {
        container.innerHTML = '<div class="col-12"><p class="text-center">Không tìm thấy sản phẩm phù hợp.</p></div>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="col-lg-4 col-md-6 col-sm-6 pb-1">
            <div class="product-item bg-light mb-4">
                <div class="product-img position-relative overflow-hidden">
                    <img class="img-fluid w-100" src="${product.imageurl}" alt="${product.name}">
                    <div class="product-action">
                        <a class="btn btn-outline-dark btn-square" onclick="addToCart('${product.code}')">
                            <i class="fa fa-shopping-cart"></i>
                        </a>
                        <a class="btn btn-outline-dark btn-square">
                            <i class="far fa-heart"></i>
                        </a>
                        <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                        <a class="btn btn-outline-dark btn-square" href="detail.html?code=${product.code}">
                            <i class="fa fa-search"></i>
                        </a>
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
    `).join('');
}

function updateProductCounts(products) {
    document.querySelectorAll('.productCount').forEach(badge => {
        badge.textContent = products.length;
    });
}