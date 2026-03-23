import { products } from "../data/products.js";
import { cartService } from "../services/cart.js";

export class ProductsUI {
  constructor() {
    this.products = products;
    this.filteredProducts = [...products];
    this.currentCategory = "all";

    this.productsGrid = document.querySelector(".products__grid");
    this.filterButtons = document.querySelectorAll(".filter__button");
    this.searchInput = document.querySelector(".nav__search-input");

    this.handleFilter = this.handleFilter.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleAddToCart = this.handleAddToCart.bind(this);

    this.setupEventListeners();
    this.renderProducts();
  }

  setupEventListeners() {
    this.filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        this.handleFilter(button.dataset.filter);
      });
    });

    this.searchInput.addEventListener("input", this.handleSearch);

    this.productsGrid.addEventListener("click", (e) => {
      const addButton = e.target.closest(".product__button");
      if (addButton) {
        const productId = parseInt(addButton.dataset.id);
        const product = this.products.find((p) => p.id === productId);
        if (product) {
          this.handleAddToCart(product);
        }
      }
    });
  }

  handleFilter(category) {
    this.currentCategory = category;
    this.filterButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.filter === category);
    });

    this.applyFilters();
  }

  handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    this.applyFilters(searchTerm);
  }

  applyFilters(searchTerm = "") {
    this.filteredProducts = this.products.filter((product) => {
      const matchesCategory =
        this.currentCategory === "all" ||
        product.category === this.currentCategory;
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm);
      return matchesCategory && matchesSearch;
    });

    this.renderProducts();
  }

  handleAddToCart(product) {
    cartService.addItem(product);

    const button = this.productsGrid.querySelector(`[data-id="${product.id}"]`);
    if (button) {
      button.textContent = "¡Añadido!";
      button.classList.add("added");
      setTimeout(() => {
        button.classList.remove("added");
        button.innerHTML = `<i class="fas fa-cart-plus"></i>`;
      }, 1500);
    }
  }

  renderProducts() {
    this.productsGrid.innerHTML = this.filteredProducts
      .map(
        (product) => `
            <article class="product__card">
                <a href="product.html?id=${
                  product.id
                }" class="product__img-link">
                    <img src="${product.image}" alt="${
          product.name
        }" class="product__img">
                </a>
                <div class="product__content">
                    <h3 class="product__title">
                        <a href="product.html?id=${product.id}">${
          product.name
        }</a>
                    </h3>
                    <p class="product__description">${product.description}</p>
                    <p class="product__price">$${product.price.toFixed(2)}</p>
                    <div class="product__buttons">
                        <a href="product.html?id=${
                          product.id
                        }" class="button button--secondary">Ver Detalles</a>
                        <button class="button product__button" data-id="${
                          product.id
                        }">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </article>
        `
      )
      .join("");

    if (!document.getElementById("productsStyles")) {
      const styles = document.createElement("style");
      styles.id = "productsStyles";
      styles.textContent = `
        .product__card {
            background: var(--bg-color);
            border-radius: 1rem;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,.1);
            transition: .3s;
        }

        .product__card:hover {
            transform: translateY(-5px);
        }

        .product__img {
            width: 100%;
            height: 200px;
            object-fit: cover;
        }

        .product__content {
            padding: 1.5rem;
        }

        .product__title {
            font-size: var(--h3-font-size);
            margin-bottom: var(--mb-1);
        }

        .product__description {
            color: var(--text-color-light);
            margin-bottom: var(--mb-2);
            font-size: var(--small-font-size);
        }

        .product__price {
            color: var(--primary-color);
            font-size: var(--h2-font-size);
            font-weight: 600;
            margin-bottom: var(--mb-2);
        }

        .product__button {
            width: 100%;
        }

        .product__button.added {
            background-color: var(--secondary-color);
        }
    `;
      document.head.appendChild(styles);
    }
  }
}

export const productsUI = new ProductsUI();
