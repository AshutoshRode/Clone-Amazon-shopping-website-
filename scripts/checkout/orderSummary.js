import {
    cart,
    removeFromCart,
    calculateCartQuantity,
    updateQuantity,
    updateDeliveryOption,
    
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";

import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from '../../data/deliveryOptions.js';
import { renderPaymentSummary } from "./paymentSummary.js";

import { renderCheckoutHeader } from "./checkoutHeader.js";

// const today = dayjs();
// const deliveryDate = today.add(7, 'days');
// console.log(deliveryDate.format('dddd, MMMM D'));

export function renderOrderSummary() {

    let cartSummaryHTML = '';

    cart.forEach((cartItem) => {
        const productId = cartItem.productId;

        const matchingProduct = getProduct(productId);

        const deliveryOptionId = cartItem.deliveryOptionId;

        const deliveryOption = getDeliveryOption(deliveryOptionId);
         
        const dataString = calculateDeliveryDate(deliveryOption);

        cartSummaryHTML += `       
       <div class="cart-item-container
        js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: ${dataString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                 ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}  
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                  <span class ="save-quantity-link link-primary js-save-link" data-product-id="${matchingProduct.id}">Save</span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionHTML(matchingProduct, cartItem)}
               
              </div>
            </div>
          </div>
    `;
    });


    function deliveryOptionHTML(matchingProduct, cartItem) {

        let html = '';

        deliveryOptions.forEach((deliveryOption) => {

              const dataString = calculateDeliveryDate(deliveryOption);

            const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;

            const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

            html +=
                `
    <div class="delivery-option js-delivery-option"
     data-product-id="${matchingProduct.id}"
     data-delivery-option-id="${deliveryOption.id}">
        <input type="radio" 
                ${isChecked ? 'checked' : ''}
               class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
         <div class="delivery-option-date">
                      ${dataString}
                    </div>
         <div class="delivery-option-price">
                      ${priceString} Shipping
                    </div>
                  </div>
                </div>
`
        });
        return html;

    }

    document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
    // console.log(cartSummaryHTML); 

    document.querySelectorAll('.js-delete-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;
                removeFromCart(productId);

                renderCheckoutHeader();
                renderOrderSummary();
                // updateCartQuantity();
                renderPaymentSummary();


            });
        }
        );

        function updateCartQuantity() {
            const cartQuantity = calculateCartQuantity();
            const returnLink = document.querySelector('.js-return-to-home-link');
            
            if (returnLink) {
              returnLink.innerHTML = `${cartQuantity} items`;
            }
          }
    updateCartQuantity();

    document.querySelectorAll('.js-update-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;

                const container =
                    document.querySelector(`.js-cart-item-container-${productId}`);
                container.classList.add('is-editing-quantity');
            });
        });
    document.querySelectorAll('.js-save-link')
        .forEach((link) => {
            link.addEventListener('click', () => {
                const productId = link.dataset.productId;

                // const container = document.querySelector(`.js-cart-item-container-${productId}`);
                // container.classList.remove('is-editing-quantity');

                const quantityInput = document.querySelector(
                    `.js-quantity-input-${productId}`
                );
                const newQuantity = Number(quantityInput.value);


                if (newQuantity < 0 || newQuantity >= 1000) {
                    alert('Quantity must be at least 0 and less than 1000');
                    return;
                }
                updateQuantity(productId, newQuantity);

                const container = document.querySelector(
                    `.js-cart-item-container-${productId}`

                );
                container.classList.remove('is-editing-quantity');

                const quantityLabel = document.querySelector(
                    `.js-quantity-label-${productId}`
                );
                quantityLabel.innerHTML = newQuantity;

                updateCartQuantity();
            });
        });

    document.querySelectorAll('.js-delivery-option')
        .forEach((element) => {
            element.addEventListener('click', () => {
                const { productId, deliveryOptionId } = element.dataset;
                updateDeliveryOption(productId, deliveryOptionId);
                renderOrderSummary();
                renderPaymentSummary();
            });


        });
         // This code was copied from the solutions of exercises 14f - 14n.
  document.querySelectorAll('.js-update-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.add('is-editing-quantity');
      });
    });

  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.remove('is-editing-quantity');

        const quantityInput = document.querySelector(
          `.js-quantity-input-${productId}`
        );
        const newQuantity = Number(quantityInput.value);
        updateQuantity(productId, newQuantity);

        renderCheckoutHeader();
        renderOrderSummary();
        renderPaymentSummary();

        // We can delete the code below (from the original solution)
        // because instead of using the DOM to update the page directly
        // we can use MVC and re-render everything. This will make sure
        // the page always matches the data.

        // const quantityLabel = document.querySelector(
        //   `.js-quantity-label-${productId}`
        // );
        // quantityLabel.innerHTML = newQuantity;

        // updateCartQuantity();
      });
    });
}
