<svelte:head>
	<title>Cart</title>
	<meta name="description" content="View your cart" />
</svelte:head>

<script>
	import { cart, clearCart } from '../../stores/cartStore';
	import { onMount } from 'svelte';
  
	let cartItems = [];

	function handleClearCart() {
		clearCart();
	}

	onMount(() => {
		// Subscribe to changes in the cart store
		const unsubscribe = cart.subscribe((items) => {
			cartItems = items;
			console.log('cartItems:', cartItems);
		});

		// Unsubscribe when the component is destroyed
		return unsubscribe;
	});
</script>

<div class="row text-center">
	<div class="col-12 col-sm-6 mb-5 mb-sm-0 d-flex flex-column justify-content-center">
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
						{#each cartItems as item (item.id)}
							<li>{item.product_name} - ${item.price.toFixed(2)}</li>
						{/each}
					</ul>
				{/if}
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<p>Total: ${cartItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</p>
			</div>
		</div>

		<div class="row">
			<div class="col-12">
				<button type="button" class="btn btn-danger" on:click={handleClearCart}>Clear Cart</button>
			</div>
		</div>
	</div>


</div>


<style>


</style>