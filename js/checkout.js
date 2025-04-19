document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.querySelector('.container-fluid .row.px-xl-5');
    const orderBtn = document.querySelector('.btn.btn-block.btn-primary');

    orderBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        const billingDetails = {
            fullName: document.querySelector('input[placeholder="Nguyễn Văn A"]').value,
            email: document.querySelector('input[placeholder="vidu@email.com"]').value,
            phone: document.querySelector('input[placeholder="+(84) 123 456 789"]').value,
            address: {
                street: document.querySelector('input[placeholder="123 ABC"]').value,
                ward: document.querySelector('input[placeholder="Phường 1"]').value,
                district: document.querySelector('input[placeholder="Quận 1"]').value,
                city: document.querySelector('input[placeholder="ABC"]').value
            }
        };

        const shipToDifferent = document.getElementById('shipto').checked;
        let shippingDetails = null;

        if (shipToDifferent) {
            const shippingAddress = document.getElementById('shipping-address');
            shippingDetails = {
                fullName: shippingAddress.querySelector('input[placeholder="Nguyễn Văn A"]').value,
                email: shippingAddress.querySelector('input[placeholder="vidu@email.com"]').value,
                phone: shippingAddress.querySelector('input[placeholder="+(84) 123 456 789"]').value,
                address: {
                    street: shippingAddress.querySelector('input[placeholder="123 ABC"]').value,
                    ward: shippingAddress.querySelector('input[placeholder="Phường 1"]').value,
                    district: shippingAddress.querySelector('input[placeholder="Quận 1"]').value,
                    city: shippingAddress.querySelector('input[placeholder="ABC"]').value
                }
            };
        }

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = Math.round(subtotal * 0.1);
        const total = subtotal + shippingCost;

        const paymentMethod = document.querySelector('input[name="payment"]:checked').id;

        const order = {
            billingDetails,
            shippingDetails: shipToDifferent ? shippingDetails : billingDetails,
            orderItems: cart.map(item => ({
                productId: item.id,
                productCode: item.code,
                productName: item.name,
                quantity: item.quantity,
                price: item.price,
                subtotal: item.price * item.quantity
            })),
            paymentDetails: {
                method: paymentMethod,
                subtotal,
                shippingCost,
                total
            },
            orderDate: new Date().toISOString(),
            status: 'pending'
        };

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(order)
            });

            if (!response.ok) {
                throw new Error('Failed to submit order');
            }

            $('#successModal').modal('show');

        } catch (error) {
            console.error('Error submitting order:', error);
            alert('Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
        }
    });
});