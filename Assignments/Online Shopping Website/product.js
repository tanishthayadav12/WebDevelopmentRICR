async function getProducts() {
  try {
    const res = await fetch("https://fakestoreapi.com/products");

    const data = await res.json();

    const productList = document.getElementById("productRow");

    data.forEach((element) => {
      const d = document.createElement("div");
      d.classList.add("col-md-3", "p-2");

      d.innerHTML = `<div
              class="project-card position-relative overflow-hidden rounded-3 border bg-white p-3"
            >
              <div class="card border border-primary rounded">
                <img
                  src=${element.image}
                  class="w-100 h-50" 
                  alt=${element.title}
                />
              </div>
              <div class="px-3 py-4">
                <div class="fw-bold fs-4">${
                  element.title.length > 50
                    ? element.title.slice(0, 45) + "..."
                    : element.title
                }</div>
                <div class="fw-semibold">${element.rating.rate}/5 (${
        element.rating.count
      })</div>
                <div class="fs-5 fw-bold">${element.price}/div>
                <div>
                 ${element.description.slice(0, 80)}...
                </div>
                <div>
                  <a href="index3.html"
                    ><button class="btn btn-dark fw-bold w-100 py-2 mt-2">
                      Buy Now
                    </button></a
                  >
                  <button class="btn btn-dark fw-bold w-100 py-2 mt-2">
                    Add To Cart
                  </button>
                </div>
              </div>
            </div>`;
      productList.appendChild(d);
    });
  } catch (error) {
    console.log(error.message);
  }
}
getProducts();
