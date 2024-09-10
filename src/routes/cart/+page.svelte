<svelte:head>
	<title>Cart</title>
	<meta name="description" content="View your cart" />
</svelte:head>

<script>
	import { cart, clearCart } from '../../stores/cartStore';
	import { onMount } from 'svelte';
	// import { Stripe } from 'stripe';
	import { loadStripe } from '@stripe/stripe-js';

	const ApiBaseUrl = 'https://hzlw7ocdo6owj22xn5vqnzjqs40waper.lambda-url.us-east-2.on.aws/api';
	// const ApiBaseUrl = 'http://localhost:3000/api';
	const S3BaseUrl = 'https://speeddomebucket.s3.us-east-2.amazonaws.com/';
  
	let stripe;
	let elements;
	let options;
	let message = '';
	let isProcessing = false;
	let isLoading = false;
	let userEmail = '';
	let userPhone = '';

	let cartItems = [];

	function handleClearCart() {
		clearCart();
	}

	onMount(async () => {
		// Load Stripe instance
		stripe = await loadStripe('pk_test_51OnpWBDDaS82tif1vkx6CfoMEN20PjVL1HkoGVKBjtBbNC9DNgegnyO5unw9pglPOwyeLLIl79NTd1gQqFVgNZ4q00R0hFFrAS');
		options = { mode: 'shipping' };

		// Subscribe to changes in the cart store
		const unsubscribe = cart.subscribe((items) => {
			cartItems = items;
			console.log('cartItems:', cartItems);
		});

		createPaymentIntent();

		return () => {
			if (elements) elements.destroy();
			unsubscribe();
		};
	});

	async function createPaymentIntent() {
		isLoading = true;
		try {
			const total = cartItems.reduce((acc, item) => acc + (item.Price * item.quantity), 0);
			console.log('Total:', total.toFixed(2));

			if (total <= 0) {
				console.log('Cart is empty or total is zero');
				return;
			}

			const response = await fetch(ApiBaseUrl + '/create-payment-intent', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ 
					amount: Math.round(total * 100),
					items: cartItems.map(item => ({
						id: item.id,
						quantity: item.quantity,
						price: item.Price
					})),
				})
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log('Response from server:', data);

			if (!data.clientSecret) {
				throw new Error('No client secret received from the server');
			}			

			elements = stripe.elements({ clientSecret: data.clientSecret });
			const paymentElement = elements.create('payment');
			paymentElement.mount('#payment-element');

			const addressElement = elements.create('address', options);
			addressElement.mount('#address-element');

		} catch (error) {
			console.error('Error setting up payment:', error);
			message = `Error: ${error.message}`;
		} finally {
			isLoading = false;
		}
    }


	// Handle the submission of the payment
	const handleSubmit = async () => {
		console.log('Submitting payment');

		if (isProcessing) return;

		const { error: addressError, value: addressValue } = await elements.getElement('address').getValue();
		if (addressError) {
			console.log('Address error:', addressError);
			message = `Address error: ${addressError.message}`;
			return;
		}

		console.log("Address value:", addressValue);

		isProcessing = true;

		try {
			const { error } = await stripe.confirmPayment({ // Only checks if the payment can be initiated
				elements,
				confirmParams: {
					payment_method_data: {
						billing_details: {
							address: {
								city: addressValue.city,
								country: addressValue.country,
								line1: addressValue.line1,
								line2: addressValue.line2,
								postal_code: addressValue.postal_code,
								state: addressValue.state
							}						
						}
					}
				},
				redirect: 'if_required'
			});

			if (error) {
				console.log('Payment failed');
				console.log('Error type:', error.type);
				console.log('Error message:', error.message);
				message = error.message;
			} else {
				console.log('Payment initiated successfully, waiting for confirmation...');
				const paymentIntentId = await getPaymentIntentId(); 
				checkPaymentStatus(paymentIntentId, addressValue);		
			}
		} catch (error) {
			console.log('Error confirming payment', error);
			message = 'Error confirming payment: ' + error.message;
		} finally {
			isProcessing = false;
		}
	}

	async function getPaymentIntentId() {
		const paymentIntent = await stripe.retrievePaymentIntent();
		return paymentIntent.id;
	}

	async function checkPaymentStatus(paymentIntentId, addressValue) {
		try {
			const response = await fetch(ApiBaseUrl + '/payment-status/' + `${paymentIntentId}`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ paymentIntentId })
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log('Payment status:', data.status);

			if (data.status === 'succeeded') {
				console.log("Sending these parameters to the server:", { paymentIntent: { id: paymentIntentId, amount: total * 100 }, cartItems, userEmail, addressValue });

				await updateDatabaseWithOrderDetails({
					paymentIntent: { id: paymentIntentId, amount: total * 100 }, // Assuming total is in dollars, convert to cents
					cartItems: cartItems,
					userEmail: userEmail,
					shippingAddress: addressValue,
					firstName: addressValue.name.split(' ')[0],
					lastName: addressValue.name.split(' ').slice(1).join(' '),
					phone: userPhone
				})

				message = 'Payment succeeded!';
				clearCart();
				setTimeout(() => {
					window.location.href = `${window.location.origin}/payment-success`;
				}, 2000); // Redirect after 2 seconds
				
			} else if (data.status === 'failed') {
				message = 'Payment failed';

			} else {
				// Poll every 3 seconds if payment is pending
				setTimeout(() => checkPaymentStatus(paymentIntentId), 3000); 			
			}

		} catch (error) {
			console.error('Error checking payment status:', error);
		}
	}

	async function updateDatabaseWithOrderDetails(orderData) {
		try {
			const response = await fetch(ApiBaseUrl + '/process-order', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(orderData)
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			console.log('Response from server:', data);

		} catch (error) {
			console.error('Error updating database with order details:', error);
		}
	}

</script>

{#if message}
	<div class="alert alert-info">{message}</div>
{/if}

<div class="row">
    <div class="col-12 col-sm-6">
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h2 class="card-title mb-4">Your Cart</h2>
                {#if cartItems.length === 0}
                    <p class="text-muted">Your cart is empty.</p>
                {:else}
                    <ul class="list-unstyled">
                        {#each cartItems as item (item.ID)}
                            <li class="cart-item mb-3 p-3 bg-light rounded">
                                <div class="d-flex align-items-center">
                                    <img 
                                        src={S3BaseUrl}{item.ImageFilename[0]} 
                                        alt={item.ProductName} 
                                        class="img-thumbnail me-3" 
                                        style="width: 80px; height: 80px; object-fit: cover;" 
                                    />
                                    <div>
                                        <h5 class="mb-1">{item.ProductName}</h5>
                                        <p class="mb-0 text-muted">Price: ${item.Price.toFixed(2)} | Quantity: {item.quantity}</p>
                                        <p class="mb-0 fw-bold">Subtotal: ${(item.Price * item.quantity).toFixed(2)}</p>
                                    </div>
                                </div>
                            </li>
                        {/each}
                    </ul>

                    <div class="d-flex justify-content-between align-items-center mt-4">
                        <h4 class="mb-0">Total: ${cartItems.reduce((acc, item) => acc + (item.Price * item.quantity), 0).toFixed(2)}</h4>
                        <button type="button" class="btn btn-outline-danger" on:click={handleClearCart}>Clear Cart</button>
                    </div>
                {/if}
            </div>
        </div>
    </div>

    <div class="col-12 col-sm-6">
        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h4 class="card-title mb-3">Shipping Address</h4>
                <div id="address-element"></div>
            </div>
        </div>

        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h4 class="card-title mb-3">Contact Info</h4>

				{#if isLoading}
					<div class="spinner-border text-primary" role="status">
						<span class="visually-hidden">Loading...</span>
					</div>

				{:else}
					<div id="contact-info-element">
						<label 
							for="email" 
							class="form-label"
						>
							Email (required)
						</label>
						<input 
							required
							type="email" 
							class="form-control" 
							placeholder="Email" 
							bind:value={userEmail}
						/>

						<label 
							for="phone" 
							class="form-label mt-3"
						>
							Phone
						</label>
						<input 
							type="text" 
							class="form-control" 
							placeholder="Phone number"
							bind:value={userPhone}
						/>
					</div>
				{/if}
            </div>
        </div>

        <div class="card shadow-sm mb-4">
            <div class="card-body">
                <h4 class="card-title mb-3">Payment</h4>
                <div id="payment-element"></div>
            </div>
        </div>

		{#if message}
			<div class="alert alert-info">{message}</div>
		{/if}

        <button 
			id="submit" 
			type="button" 
			class="btn btn-success btn-lg w-100" 
			on:click={handleSubmit}
			disabled={isProcessing}
		>
			{isProcessing ? 'Processing...' : 'Place your order'}
        </button>
    </div>
</div>

<style>
    .cart-item {
        transition: all 0.3s ease;
    }
    .cart-item:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .card {
        border: none;
        transition: all 0.3s ease;
    }
    .card:hover {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
    }
</style>