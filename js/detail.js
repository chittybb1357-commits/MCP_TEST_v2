import { addToCart, updateCartCount } from "./utils/common.js";

const detailSection = document.querySelector(".detail-section");
const params = new URLSearchParams(window.location.search);
const productId = Number(params.get("id")) || 1;

let currentProduct = null;

async function fetchProduct() {
  try {
    const res = await fetch("./data/products.json");
    const data = await res.json();
    currentProduct = data.products.find(product => product.id === productId);

    if (!currentProduct) {
      renderEmpty();
      return;
    }

    renderProduct(currentProduct);
    bindDetailEvents();
  } catch (error) {
    console.error("상품 정보를 불러오지 못했습니다.", error);
    renderEmpty();
  }
}

function renderProduct(product) {
  const images = product.images?.length ? product.images : [product.thumbnail];
  const reviews = product.reviews || [];

  detailSection.innerHTML = `
    <article class="detail-product">
      <div class="detail-gallery">
        <img class="detail-image" src="${images[0]}" alt="${product.title}" />
        <ul class="thumb-list" aria-label="상품 이미지 목록">
          ${images
            .map(
              (image, index) => `
                <li>
                  <button class="thumb-button ${index === 0 ? "active" : ""}" type="button" data-image="${image}">
                    <img src="${image}" alt="${product.title} 이미지 ${index + 1}" />
                  </button>
                </li>
              `,
            )
            .join("")}
        </ul>
      </div>

      <div class="detail-info">
        <p class="detail-breadcrumb">
          <a href="./index.html">Home</a>
          <span>/</span>
          <span>${product.category}</span>
        </p>

        <div class="detail-title-group">
          <p class="detail-brand">${product.brand || "ShopMall"}</p>
          <h1 class="detail-title">${product.title}</h1>
          <div class="detail-rating">
            <span class="rating-stars" aria-hidden="true">${makeStars(product.rating)}</span>
            <span>${product.rating.toFixed(2)} / 리뷰 ${reviews.length}개</span>
          </div>
        </div>

        <div class="detail-price">
          <strong>$${product.price.toLocaleString()}</strong>
          <span class="discount-badge">${product.discountPercentage}% 할인</span>
          <span class="stock-badge">${product.availabilityStatus}</span>
        </div>

        <p class="detail-description">${product.description}</p>

        <dl class="detail-meta">
          <div>
            <dt>배송</dt>
            <dd>${product.shippingInformation}</dd>
          </div>
          <div>
            <dt>반품</dt>
            <dd>${product.returnPolicy}</dd>
          </div>
          <div>
            <dt>보증</dt>
            <dd>${product.warrantyInformation}</dd>
          </div>
          <div>
            <dt>상품 코드</dt>
            <dd>${product.sku}</dd>
          </div>
        </dl>

        <div class="purchase-box">
          <div class="quantity-control">
            <span>수량</span>
            <div class="quantity-stepper">
              <button type="button" class="qty-minus" aria-label="수량 감소">-</button>
              <input class="qty-input" type="number" value="1" min="1" max="${product.stock}" />
              <button type="button" class="qty-plus" aria-label="수량 증가">+</button>
            </div>
          </div>
          <div class="detail-actions">
            <button type="button" class="btn btn-primary detail-cart">장바구니 담기</button>
            <a class="btn btn-muted" href="./index.html">목록으로</a>
          </div>
        </div>
      </div>
    </article>

    <section class="review-section" aria-labelledby="review-title">
      <h2 id="review-title">상품 리뷰</h2>
      <ul class="review-list">
        ${reviews
          .map(
            review => `
              <li class="review-card">
                <strong>${review.reviewerName}</strong>
                <span class="rating-stars" aria-hidden="true">${makeStars(review.rating)}</span>
                <p>${review.comment}</p>
              </li>
            `,
          )
          .join("")}
      </ul>
    </section>
  `;
}

function renderEmpty() {
  detailSection.innerHTML = `
    <p class="detail-empty">
      상품 정보를 찾을 수 없습니다.
      <a href="./index.html">목록으로 돌아가기</a>
    </p>
  `;
}

function bindDetailEvents() {
  const mainImage = detailSection.querySelector(".detail-image");
  const thumbButtons = detailSection.querySelectorAll(".thumb-button");
  const qtyInput = detailSection.querySelector(".qty-input");
  const minusButton = detailSection.querySelector(".qty-minus");
  const plusButton = detailSection.querySelector(".qty-plus");
  const cartButton = detailSection.querySelector(".detail-cart");

  thumbButtons.forEach(button => {
    button.addEventListener("click", () => {
      mainImage.src = button.dataset.image;
      thumbButtons.forEach(item => item.classList.remove("active"));
      button.classList.add("active");
    });
  });

  minusButton.addEventListener("click", () => {
    qtyInput.value = Math.max(1, Number(qtyInput.value) - 1);
  });

  plusButton.addEventListener("click", () => {
    qtyInput.value = Math.min(currentProduct.stock, Number(qtyInput.value) + 1);
  });

  qtyInput.addEventListener("change", () => {
    qtyInput.value = Math.min(currentProduct.stock, Math.max(1, Number(qtyInput.value) || 1));
  });

  cartButton.addEventListener("click", () => {
    addToCart(currentProduct, Number(qtyInput.value));
  });
}

function makeStars(rating) {
  const rounded = Math.round(rating);
  return "★★★★★".slice(0, rounded) + "☆☆☆☆☆".slice(0, 5 - rounded);
}

fetchProduct();
updateCartCount();
