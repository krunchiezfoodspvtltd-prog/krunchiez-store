```javascript
// ================================
// KRUNCHIEZ WEBSITE - script.js
// ================================

document.addEventListener("DOMContentLoaded", function () {

    // --------------------------------
    // Mobile Menu
    // --------------------------------
    const menuBtn = document.querySelector(".menu-btn");
    const navMenu = document.querySelector(".nav-menu");

    if (menuBtn && navMenu) {
        menuBtn.addEventListener("click", function () {
            navMenu.classList.toggle("active");
        });
    }

    // Close mobile menu after clicking a link
    const navLinks = document.querySelectorAll(".nav-menu a");

    navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
            if (navMenu) {
                navMenu.classList.remove("active");
            }
        });
    });


    // --------------------------------
    // Smooth Scrolling
    // --------------------------------
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });

    });


    // --------------------------------
    // Product Cards
    // --------------------------------
    const productButtons = document.querySelectorAll(".product-btn");

    productButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const productName =
                this.getAttribute("data-product") || "Krunchiez";

            alert(
                productName +
                " selected! Contact us to place your order."
            );

        });

    });


    // --------------------------------
    // Contact / Order Buttons
    // --------------------------------
    const orderButtons = document.querySelectorAll(".order-btn");

    orderButtons.forEach(function (button) {

        button.addEventListener("click", function () {

            const phoneNumber = "919XXXXXXXXX";

            window.open(
                "https://wa.me/" + phoneNumber,
                "_blank"
            );

        });

    });


    // --------------------------------
    // Scroll Reveal Animation
    // --------------------------------
    const revealElements =
        document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.15
            }
        );

        revealElements.forEach(function (element) {
            observer.observe(element);
        });

    } else {

        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });

    }


    // --------------------------------
    // Current Year
    // --------------------------------
    const yearElement =
        document.querySelector("#current-year");

    if (yearElement) {
        yearElement.textContent =
            new Date().getFullYear();
    }

});
```
