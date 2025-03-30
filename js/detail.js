document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    if (!productId) {
        document.getElementById('product-details').innerHTML = '<p>Product not found.</p>';
        return;
    }

    fetch(`http://localhost:5000/api/products/${productId}`)
        .then(response => response.json())
        .then(product => {
            const productDetailsHTML = `
                <div class="col-lg-6">
                    <img class="img-fluid" src="${product.imageurl}" alt="${product.name}">
                </div>
                <div class="col-lg-6">
                    <h1>${product.name}</h1>
                    <h4>${product.price}đ</h4>
                    ${product.disprice > 0 ? `<h6 class="text-muted"><del>${product.disprice} đ</del></h6>` : ''}
                    <p>${product.details}</p>
                    <ul>
                        <li>${product.spec}</li>
                    </ul>
                    <button class="btn btn-primary">Add to Cart</button>
                </div>
            `;
            document.getElementById('product-details').innerHTML = productDetailsHTML;
        })
        .catch(error => {
            console.error('Error fetching product details:', error);
            document.getElementById('product-details').innerHTML = '<p>Failed to load product details.</p>';
        });
});