<script>
    export let product;
    export let selectProduct;
</script>
  
<div class="product">
    <div class="py-3">
        <h3>{product.product_name}</h3>
    </div>

    <div class="pb-1">
        <p>${product.price.toFixed(2)}</p>
    </div>

    <div class="pb-5">
        <img src={`/${product.part_number}/${product.part_number}_0.jpg`} alt={product.product_name} class="product-image"/>
    </div>

    <div class="pb-4">
        <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#productDetailModal" on:click={() => selectProduct(product)}>
            Click to view
        </button>
    </div>
</div>


<style>

    .product {
        border: 1px solid #ccc;
        padding: 10px;
        margin: 10px;
        text-align: center;
    }

    .product-image {
        max-width: 100%; 
        max-height: 200px; 
        object-fit: cover;
    }

</style>