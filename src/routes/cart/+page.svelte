<svelte:head>
	<title>Cart</title>
	<meta name="description" content="View your cart" />
</svelte:head>

<script>
	import { cart, clearCart } from '../../stores/cartStore';
	import { onMount } from 'svelte';
	// import { Stripe } from 'stripe';
	import { loadStripe } from '@stripe/stripe-js';
  
	let stripe;
	let elements;
	let options;
	let message = '';

	let cartItems = [];

	function handleClearCart() {
		clearCart();
	}

	onMount(async () => {
		// Load Stripe instance
		stripe = await loadStripe('pk_test_51OnpWBDDaS82tif1vkx6CfoMEN20PjVL1HkoGVKBjtBbNC9DNgegnyO5unw9pglPOwyeLLIl79NTd1gQqFVgNZ4q00R0hFFrAS');
		options = { mode: 'shipping' };

		const { clientSecret, message } = await fetch('https://hzlw7ocdo6owj22xn5vqnzjqs40waper.lambda-url.us-east-2.on.aws/api/create-payment-intent').then((res) => res.json());

		console.log('clientSecret:', clientSecret);
		console.log('message:', message);

		elements = stripe.elements({ clientSecret });
		const paymentElement = elements.create('payment');
		paymentElement.mount('#payment-element');

		const addressElement = elements.create('address', options);
		addressElement.mount('#address-element');

		// Subscribe to changes in the cart store
		const unsubscribe = cart.subscribe((items) => {
			cartItems = items;
			console.log('cartItems:', cartItems);
		});

		return () => {
			// Clean up when the component is destroyed
			paymentElement.destroy();

			// Unsubscribe from the store
			unsubscribe();
		};
	});

	// Handle the submission of the payment
	const handleSubmit = async () => {
		try {
			const { error } = await stripe.confirmPayment({
				elements,
				confirmParams: {
					shipping: {
						address: {
							city: 'San Francisco',
							country: 'US',
							line1: '1234 Main St',
							postal_code: '94111',
							state: 'CA'
						},
						name: 'Jenny Rosen',
						phone: '4158675309'
					},
					return_url: `${window.location.origin}/payment-success`

				}
			});

			if (error) {
				console.log('Payment failed');
				console.log('Error type:', error.type);
				console.log('Error message:', error.message);
			} else {
				console.log('Payment successful');
			}
		} catch (error) {
			console.log('Error confirming payment', error);
		}
	}


</script>

<p>{message}</p>

<div class="row">
	<div class="col-12 col-sm-6">
		<div class="row pb-3 pt-5">
			<div class="col-12">
				<h2>The Cart Page</h2>
			</div>
		</div>

		<div class="row py-3">
			<div class="col-12">
				{#if cartItems.length === 0}
					<p>Your cart is empty.</p>
				{:else}
					<ul>
						{#each cartItems as item (item.ID)}
							<li>{item.ProductName} - ${item.Price.toFixed(2)}</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				{#if cartItems.length > 0}
					<p>Total: ${cartItems.reduce((acc, item) => acc + item.Price, 0).toFixed(2)}</p>
				{/if}
			</div>
		</div>

		<div class="row mb-5 mb-sm-0">
			<div class="col-12">
				{#if cartItems.length > 0}
					<button type="button" class="btn btn-danger" on:click={handleClearCart}>Clear Cart</button>
				{/if}
			</div>
		</div>
	</div>

	<div class="col-12 col-sm-6">
		<div class="pb-4 card">
			<h4 class="mb-3">Shipping Address</h4>
			<div id="address-element"></div>
		</div>

		<div class="card">
			<h4 class="mb-3">Payment</h4>
			<div id="payment-element"></div>
		</div>

		<button id="submit" type="button" class="btn btn-success" on:click={handleSubmit}>
			Place your order
		</button>
	</div>


</div>


<style>
    .card {
        border: 1px solid #ccc;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
        margin-bottom: 20px;
        border-radius: 4px;
    }

</style>