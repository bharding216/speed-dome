<script>
    export let products;
    export let selectProduct;
    import Product from './Product.svelte';
</script>
  


<div class="products-grid">
    {#each products as product (product.ID)}
        <Product {product} {selectProduct} />
    {/each}
</div>
  

<style>
    .products-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;
    }

    @media (min-width: 800px) {
        .products-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>