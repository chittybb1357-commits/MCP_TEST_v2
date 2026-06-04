const productGrid = document.querySelector(".product-grid");

//상품 조회
async function fetchProducts() {
  try {
    const res = await fetch("./data/products.json");
    const data = await res.json();
    const products = data.products.slice(0, 12);
    console.log(products);
    const productHTML = products.map();
  } catch {
  } finally {
  }
}

fetchProducts();
