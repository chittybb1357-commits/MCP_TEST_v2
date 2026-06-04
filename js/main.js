const productGrid = document.querySelector(".product-grid");
const pager = document.querySelector(".pagination .pager");
const pagerPrevBtn = document.querySelector(".pagination .prev");
const pagerNextBtn = document.querySelector(".pagination .next");

//pagination
const countPerPage = 12;
let currentPage = 1;
let paginationCount = 0;

//상품 조회
async function fetchProducts() {
  try {
    const res = await fetch("./data/products.json");
    const data = await res.json();
    const pagedData = paginate(data.products, currentPage);
    const productHTML = pagedData.map(
      p =>
        `<article class="product-card">
            <img src="${p.thumbnail}" alt="${p.title}">
            <div class="product-info">
              <h3><a href="detail.html?id=${p.id}">${p.title}</a></h3>
              <p>${p.brand}</p>
              <div class="product-bottom">
                <strong>${p.price}</strong>
                <button type="button" class="cart-add" aria-label="${p.title} 장바구니 담기"></button>
              </div>
            </div>
          </article>`,
    );

    console.log(productHTML);

    productGrid.innerHTML = productHTML.join("");

    //pagination 생성
    makePagination(data.total);
  } catch {
  } finally {
  }
}

fetchProducts();

function makePagination(total) {
  paginationCount = Math.ceil(total / countPerPage); // 17
  let pagerHTML = "";

  for (let i = 1; i <= paginationCount; i++) {
    pagerHTML += `<a href="#" class="${i === currentPage ? "active" : ""}">${i}</a>`;
  }
  pager.innerHTML = pagerHTML;

  if (currentPage === 1) {
    pagerPrevBtn.classList.add("disabled");
  }

  if (currentPage === paginationCount) {
    pagerNextBtn.classList.add("disabled");
  }

  const pagerBtns = pager.querySelectorAll("a");
  pagerBtns.forEach(btn => {
    btn.addEventListener("click", () => {});
  });
}

function paginate(data, page) {
  const start = (page - 1) * countPerPage; //page 1 0, page 2 12
  const end = start + countPerPage;
  return data.slice(start, end);
}
