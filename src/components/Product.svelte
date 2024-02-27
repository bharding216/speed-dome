<script>
    export let product;
</script>
  
<div class="product">
    <h3>{product.product_name}</h3>
    <p>{product.price}</p>
    <!-- <img src={product.image} alt={product.product_name} /> -->
</div>
  
<style>

    .product {
        border: 1px solid #ccc;
        padding: 10px;
        margin: 10px;
        text-align: center;
    }

</style>