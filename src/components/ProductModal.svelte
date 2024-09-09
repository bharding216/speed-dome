<script>
    import { onMount } from 'svelte';
    export let selectedProduct;
    import { goto } from '$app/navigation';
    import { addToCart } from '../stores/cartStore';
    import emblaCarouselSvelte from 'embla-carousel-svelte';
    export let S3BaseUrl;
    
    function handleAddToCart() {
        if (selectedProduct) {
            addToCart(selectedProduct, selectedQuantity);
            goto('/cart');
        }
    }

    let emblaApi;
    let currentIndex = 0;
    let totalSlides;
    let canScrollPrev;
    let canScrollNext;

    let selectedQuantity = 1;

    const options = { loop: true };

    function onInit(event) {
        emblaApi = event.detail;
        totalSlides = emblaApi.slideNodes().length;
        updateButtonStates();
        console.log('Carousel initialized. Total slides:', totalSlides);
        emblaApi.on('select', onSelect);
        emblaApi.on('scroll', onScroll);
    }

    function onSelect(e) {
        if (e && e.detail && typeof e.detail.index !== 'undefined') {
            currentIndex = e.detail.index;
        } else if (emblaApi) {
            currentIndex = emblaApi.selectedScrollSnap();
        }        
        updateButtonStates();
        console.log('Slide selected. Current index:', currentIndex);
    }

    $: console.log('Current index updated:', currentIndex);

    function updateButtonStates() {
        canScrollPrev = emblaApi.canScrollPrev();
        canScrollNext = emblaApi.canScrollNext();
    }

    function scrollPrev() {
        emblaApi.scrollPrev();
        currentIndex = emblaApi.selectedScrollSnap();
        console.log('Scrolled to previous slide');
    }

    function scrollNext() {
        emblaApi.scrollNext();
        currentIndex = emblaApi.selectedScrollSnap();
        console.log('Scrolled to next slide');
    }

    function onScroll() {
        currentIndex = emblaApi.selectedScrollSnap();
        updateButtonStates();
    }

    function scrollTo(index) {
        emblaApi.scrollTo(index);
    }

    onMount(() => {
        return () => {
            if (emblaApi) emblaApi.destroy();
        };
    });

    $: if (selectedProduct) {
        totalSlides = selectedProduct.ImageFilename.length;
        console.log('Selected product changed. New total slides:', totalSlides);
    }

    $: if (selectedProduct && emblaApi) {
        emblaApi.reInit();
        currentIndex = 0;
        emblaApi.scrollTo(0);
        updateButtonStates();
        console.log('Carousel reinitialized due to product change');
    }

</script>

<div 
    class="modal fade" 
    id="productDetailModal" 
    tabindex="-1" 
    aria-labelledby="productDetailModalLabel" 
    aria-hidden="true"
>
    <div class="modal-dialog modal-dialog-centered modal-xl">
        <div class="modal-content">
            <div class="row">
                <div class="col-12 text-end">
                    <button 
                        type="button" 
                        class="btn-close" 
                        data-bs-dismiss="modal" 
                        aria-label="Close"
                    >
                    </button>
                </div>
            </div>

            <div class="row pb-4">
                <div class="col-md-6 left-column order-2 order-sm-1">
                    <div class="embla__viewport">
                        {#if selectedProduct}
                            <div 
                                class="embla" 
                                use:emblaCarouselSvelte={{ options }} 
                                on:emblaInit={onInit}
                                on:emblaSelect={onSelect}
                                on:emblaScroll={onScroll}
                            >
                                <div class="embla__container">
                                    {#each selectedProduct.ImageFilename as filename}
                                        <div class="embla__slide">
                                            <img 
                                                src={`${S3BaseUrl}${filename}`} 
                                                alt={selectedProduct?.ProductName} 
                                                class="product-image"
                                            />
                                        </div>
                                    {/each}
                                </div>
                            </div>
                        {:else}
                            <p>Loading...</p>
                        {/if}
                    </div>

                    <div class="embla__controls">
                        <div class="embla__buttons">
                            <button class="embla__button embla__button--prev" type="button" on:click={scrollPrev} disabled={!canScrollPrev}>
                                <svg class="embla__button__svg" viewBox="0 0 532 532">
                                  <path fill="currentColor" d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"/>
                                </svg>
                              </button>
                              <button class="embla__button embla__button--next" type="button" on:click={scrollNext} disabled={!canScrollNext}>
                                <svg class="embla__button__svg" viewBox="0 0 532 532">
                                  <path fill="currentColor" d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"/>
                                </svg>
                              </button>
                        </div>

                        <div class="embla__dots">
                            {#each Array(totalSlides) as _, index}
                                <button
                                    type="button"
                                    class="embla__dot"
                                    class:embla__dot--selected={index === currentIndex}
                                    on:click={() => scrollTo(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                ></button>
                            {/each}
                        </div>
                    </div>
                </div>
    
                <div class="col-md-6 product-details order-1 order-sm-2 d-flex flex-column">
                    <div class="product-info">
                        <h5>{selectedProduct?.ProductName}</h5>
                        <p class="mb-3 text-muted">Part #:{selectedProduct?.PartNumber}</p>
                        <h5 class="mb-3">${selectedProduct?.Price.toFixed(2)}</h5>
                    </div>

                    <div class="cart-controls mt-auto">
                        <div class="quantity-dropdown">
                            <label for="quantity">Quantity:</label>
                            <select 
                                class="form-select" 
                                id="quantity" 
                                name="quantity"
                                bind:value={selectedQuantity}
                            >
                                <option value={1}>1</option>
                                <option value={2}>2</option>
                                <option value={3}>3</option>
                                <option value={4}>4</option>
                                <option value={5}>5</option>
                            </select>
                        </div>  

                        <button 
                            type="button" 
                            class="btn btn-primary w-50" 
                            data-bs-dismiss="modal" 
                            on:click={handleAddToCart}
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
            </div>

            <div class="row">
                <div class="col-12">
                    <p class="product-description">{selectedProduct?.Description}</p>
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
        font-size: 1.2rem;
    }

    .product-details {
        height: 100%;
        padding-left: 30px;
        display: flex;
        flex-direction: column;
    }

    .product-details h5 {
        font-size: 2.5rem;
        margin: 0;
    }

    .cart-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 1rem;
        position: relative;
        bottom: 0;
    }

    .quantity-dropdown {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .quantity-dropdown label {
        margin-right: 10px;
        font-size: 1.2rem;
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
        margin-left: 20px;
        height: 38px; 
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .embla { position: relative; max-width: 670px; margin: auto; }
    .embla__viewport { overflow: hidden ;}
    .embla__container { display: flex; }
    .embla__slide {
        flex: 0 0 100%;
        min-width: 0;
        padding: 20px;
        position: relative;
    }
    .embla__controls {
        display: grid;
        grid-template-columns: auto 1fr;
        justify-content: space-between;
        gap: 1.2rem;
        margin-top: 1.8rem;
        padding-left: 20px;
        padding-right: 20px;
    }
    .embla__buttons {
        display: flex;
        grid-column: 1;
        justify-content: flex-start;
        gap: 0.6rem;
    }
    .embla__button {
        -webkit-appearance: none;
        appearance: none;
        background-color: #f0f0f0;
        touch-action: manipulation;
        display: inline-flex;
        text-decoration: none;
        cursor: pointer;
        border: 1px solid #ccc;
        border-radius: 50%;
        padding: 0;
        margin: 0;
        z-index: 1;
        color: #333;
        width: 3rem;
        height: 3rem;
        justify-content: center;
        align-items: center;
        transition: background-color 0.3s, color 0.3s, transform 0.1s;
    }

    .embla__button:hover:not(:disabled) {
        background-color: #e0e0e0;
        color: #000;
        transform: scale(1.05);
    }

    .embla__button:active:not(:disabled) {
        background-color: #d0d0d0;
        transform: scale(0.95);
}
    .embla__button:disabled {
        opacity: 0.3;
        cursor: not-allowed;
    }
    .embla__button__svg {
        width: 50%;
        height: 50%;
    }
    .embla__dots {
        display: flex;
        grid-column: 2;
        justify-content: flex-end;
        align-items: center;
        gap: 0.8rem;
    }
    .embla__dot {
        -webkit-appearance: none;
        appearance: none;
        background-color: transparent;
        touch-action: manipulation;
        display: inline-flex;
        text-decoration: none;
        cursor: pointer;
        border: 0;
        padding: 0;
        margin: 0;
        width: 0.9rem;
        height: 0.9rem;
        background-color: #efefef;
        border-radius: 50%;
        transition: background-color 0.2s;
    }

    .embla__dot:not(.embla__dot--selected):hover {
        background-color: #00bfff;
        transform: scale(1.2);
    }
    .embla__dot--selected {
        background-color: #3b14ff;
    }
  </style>