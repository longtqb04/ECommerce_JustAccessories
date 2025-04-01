document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productCode = urlParams.get('code');
    console.log('Product Code:', productCode);

    fetch(`http://localhost:5000/api/products/code/${productCode}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch product details');
            }
            return response.json();
        })
        .then(product => {
            console.log('Fetched Product:', product);
            document.getElementById('product-image').src = product.imageurl;
            document.getElementById('product-name').textContent = product.name;
            document.getElementById('product-disprice').textContent = `${product.disprice > 0 ? product.disprice : product.price} đ`;
            document.getElementById('product-price').textContent = product.disprice > 0 ? `${product.price} đ` : '';
            document.getElementById('product-details').textContent = product.details;
            document.getElementById('product-spec').textContent = product.spec;

            const addToCartButton = document.querySelector('.btn-primary.px-3');
            addToCartButton.addEventListener('click', () => {
                addToCart(product);
            });
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            alert('Failed to load product details.');
        });
});