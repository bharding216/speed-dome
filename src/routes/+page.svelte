<script context="module">
	const ApiBaseUrl = 'https://hzlw7ocdo6owj22xn5vqnzjqs40waper.lambda-url.us-east-2.on.aws/api';
</script>

<script>
	import { onMount } from 'svelte';
	import ProductsGrid from '../components/ProductsGrid.svelte';
	import ProductModal from '../components/ProductModal.svelte';

	let products = [];
	let selectedProduct = null;

	function selectProduct(product) {
		selectedProduct = product;
	}

	onMount(async () => {
		try {
            const response = await fetch(ApiBaseUrl + '/products');

			if (response.ok) {
				products = await response.json();
				console.log('Fetched products:', products);
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

	<div class="pt-5 pb-5 parallax">
		<div class="bg-image" style="background: url('/32.jpg') no-repeat center center; 
					background-size: cover; position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 0;"></div>
		
		<div style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; z-index: 1;
					background: black; opacity: 0.5;"></div>
		
		<div class="container pb-5" style="position: relative; z-index: 2; padding-top: 75px;">
			<div class="row mb-5 justify-content-center">   
				<div class="col-12">
					<div class="text-center">
						<h1 style="color: white; font-weight: bold; letter-spacing: 5px;" class="pb-4">Unleash Performance, Embrace Style</h1>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="compelling-quote">
		<h1 class="text-center mx-4">Your Vision, Our Expertise: Collaborating for Your Perfect Build</h1>
	</div>

	<div>
		<ProductsGrid {products} {selectProduct} />
	</div>

	<ProductModal {selectedProduct} />

</section>



<style>

	.compelling-quote {
		padding: 150px 0 150px 0;
	}

	.parallax {
		left: 50%;
		right: 50%;
		width: 100vw;
        margin-left: -50vw;
        margin-right: -50vw;
		min-height: 900px;
        position: relative;
    }

    @media (max-width: 1200px) {
        .parallax {
            min-height: 700px;
        }

		.bg-image {
			background-attachment: fixed;
		}
    }

    @media (max-width: 992px) {
        .parallax {
            min-height: 500px;
        }

		.bg-image {
			background-attachment: fixed;
		}
    }

    @media (max-width: 768px) {
        .parallax {
            min-height: 300px;
        }

		.bg-image {
			background-attachment: scroll;
		}
    }

</style>
