<script context="module">
	const ApiBaseUrl = 'https://hzlw7ocdo6owj22xn5vqnzjqs40waper.lambda-url.us-east-2.on.aws/api';
</script>

<script>
	import { onMount } from 'svelte';
	import ProductsGrid from '../components/ProductsGrid.svelte';

	let products = [];

	onMount(async () => {
		try {
            const response = await fetch(ApiBaseUrl + '/products');

			if (response.ok) {
				products = await response.json();
			} else {
				console.error('Failed to fetch products:', response.statusText);
			}
		} catch (error) {
			console.error('Error fetching products:', error);
		}
	});

</script>

<svelte:head>
	<title>Custom 32 Ford Equipment - Speed Dome Engineering</title>
	<meta name="description" content="32 Ford Custom Car Parts" />
</svelte:head>

<section>

		<div class="pt-5 pb-5 parallax" style="min-height: 900px; position: relative;">
			<div style="background: url('/32.jpg') no-repeat center center fixed; 
						background-size: cover; position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0;"></div>
			
			<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 1;
						background: black; opacity: 0.5;"></div>
			
			<div class="container pb-5" style="position: relative; z-index: 2; padding-top: 75px;">
				<div class="row mb-5 justify-content-center">   
					<div class="col-12">
						<div class="text-center">
							<h1 style="color: white; font-size: 80px; font-weight: bold; letter-spacing: 5px;" class="pb-4">Unleash Performance, Embrace Style</h1>
						</div>
					</div>
				</div>
			</div>
		</div>


	<div class="py-5 mb-5">
		<h1 class="text-center">A really compelling quote here</h1>
	</div>

	<div>
		<ProductsGrid {products} />
	</div>

</section>



<style>


	.parallax {
		left: 50%;
		right: 50%;
		width: 100vw;
        margin-left: -50vw;
        margin-right: -50vw;
    }

</style>
