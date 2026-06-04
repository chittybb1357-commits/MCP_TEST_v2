const productGrid = document.querySelector(".product-grid");

//상품 조회
async function fetchProducts() {
  try {
    const res = await fetch("./data/products.json");
    const data = await res.json();
    const products = data.products.slice(0, 12);
    console.log(products);
    const productHTML = products.map(
      p =>
        `<article class="product-card">
            <img src="${p.thumbnail}" alt="${p.title}">
            <div class="product-info">
              <h3><a href="detail.html">${p.title}</a></h3>
              <p>${p.brand}</p>
              <div class="product-bottom">
                <strong>${p.price}</strong>
                <button type="button" class="cart-add" 
                aria-label="${p.title} 장바구니 담기"></button>
              </div>
            </div>
          </article>`,
    );

    console.log(productHTML);
    productGrid.innerHTML = productHTML.join("");
  } catch {
  } finally {
  }
}

fetchProducts();
