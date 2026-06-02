// 상품 조회
async function fetchProducts() {
  try {
    const res = await fetch("./data/products.json");
    const data = await res.json();
    console.log(data.products);

    const products = data.products.slice(0, 12);
    const fragment = document.createDocumentFragment();

    products.forEach(product => {
      const article = document.createElement("article");
      article.className = "product-card";

      article.innerHTML = `
        <img
          src="${product.image && product.image.trim() !== "" ? product.image : "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"}"
          alt="${escapeHTML(product.name)}"
          loading="lazy"
        />
        <div class="product-info">
          <h3>${escapeHTML(product.name)}</h3>
          <p>${escapeHTML(product.brand || "")}</p>
          <div class="product-bottom">
            <strong>${Math.round(product.price * 1300).toLocaleString()}원</strong>
            <button
              type="button"
              class="cart-add"
              aria-label="${escapeHTML(product.name)} 장바구니 담기"
            ></button>
          </div>
        </div>
      `;
      fragment.appendChild(article);
    });

    /*
      fragment의 마다 할일
      빈 products를 생성
        빈 요소에 12개의 article를 생성하고,

      product-grid에 fragment의 내용을 html 태그로 생성
    */

    const productGrid = document.querySelector(".product-grid");

    if (productGrid) {
      productGrid.innerHTML = "";
      productGrid.appendChild(fragment);
    }
  } catch (error) {
    console.error("상품 정보를 불러오지 못했습니다:", error);
  } finally {
  }
}

function escapeHTML(str) {
  if (!str) return "";
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

fetchProducts();
