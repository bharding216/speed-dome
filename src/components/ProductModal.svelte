<script>
    export let selectedProduct;
    import { goto } from '$app/navigation';
    import { addToCart } from '../stores/cartStore';
    
    function handleAddToCart() {
        if (selectedProduct) {
            addToCart(selectedProduct);
            goto('/cart');
        }
    }

</script>


<div class="modal fade" id="productDetailModal" tabindex="-1" aria-labelledby="productDetailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
            <div class="row">
                <div class="col-12 text-end">
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
            </div>


            <div class="row">
                <div class="col-md-6 left-column order-2 order-sm-1">
                    {#if selectedProduct}
                        <img src={`/${selectedProduct?.PartNumber}/${selectedProduct?.PartNumber}_0.jpg`} alt={selectedProduct?.ProductName} class="product-image"/>
                        <p class="product-description">{selectedProduct?.Description}</p>
                    {:else}
                        <p>Loading...</p>
                    {/if}
                </div>
    
                <div class="col-md-6 product-details order-1 order-sm-2">
                    <h5 class="mb-3">{selectedProduct?.ProductName}</h5>
                    <h5 class="mb-3">${selectedProduct?.Price.toFixed(2)}</h5>
                </div>

                <div class="add-to-cart-div order-3 pt-5">
                    <div class="quantity-dropdown mb-4">
                        <label for="quantity">Quantity:</label>
                        <select class="form-select" id="quantity" name="quantity">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>                    
                    <button type="button" class="btn btn-primary w-100" data-bs-dismiss="modal" on:click={handleAddToCart}>Add to cart</button>
                </div>
            </div>
        </div>
    </div>
</div>

<style>
    .modal-content {
        padding: 30px;
    }

    .left-column {
        padding-right: 30px;
    }

    .product-image {
        max-width: 100%;
        height: auto;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .product-description {
        margin-top: 20px;
        font-size: 24px;
    }

    .product-details {
        margin-top: 30px;
        margin-bottom: 30px;
        padding-left: 30px;
        display: flex;
        flex-direction: column;
    }

    .product-details h5 {
        font-size: 2.5rem;
        margin: 0;
    }

    .quantity-dropdown {
        display: flex;
        align-items: center;
    }

    .quantity-dropdown label {
        margin-right: 10px;
        font-size: 20px;
    }

    .form-select {
        width: 80px; 
    }

    .btn-close {
        padding-top: 20px;
        padding-right: 20px;
        top: 10px;
        right: 10px;
        color: #000;
        font-size: 24px;
    }

    .btn-primary {
        margin-top: 20px;
    }
</style>