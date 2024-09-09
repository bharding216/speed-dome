<script>
    export let product;
    export let selectProduct;
    export let S3BaseUrl;
</script>
  
<div class="product">
    <div class="py-3">
        <h3>{product.ProductName}</h3>
    </div>

    <div class="pb-1">
        <p>${product.Price.toFixed(2)}</p>
    </div>

    <div class="pb-5">
        <img 
            src={`${S3BaseUrl}${product.ImageFilename[0]}`} 
            alt={product.ProductName} 
            class="product-image"
        />
    </div>

    <div class="pb-4">
        <button 
            class="btn btn-primary" 
            data-bs-toggle="modal" 
            data-bs-target="#productDetailModal" 
            on:click={() => selectProduct(product)}
        >
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
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        border-radius: 10px;
    }

    .product-image {
        max-width: 100%; 
        max-height: 200px; 
        object-fit: cover;
    }

</style>