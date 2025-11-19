document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------------------------------
    // 1. Funcionalidad de Contador de Pasaportes (en comprar.html)
    // -----------------------------------------------------------------

    const quantityButtons = document.querySelectorAll('.qty-btn');
    
    quantityButtons.forEach(button => {
        button.addEventListener('click', (event) => {
            // Encuentra el input de cantidad asociado al botón
            const button = event.target;
            // Usar closest() es crucial para la robustez
            const quantityContainer = button.closest('.quantity-buttons');
            const input = quantityContainer.querySelector('.qty-input');
            
            let currentValue = parseInt(input.value);

            if (button.classList.contains('plus')) {
                // Límite máximo de 10 pasaportes por tipo
                if (currentValue < 10) {
                    input.value = currentValue + 1;
                }
            } else if (button.classList.contains('minus')) {
                // Límite mínimo de 0
                if (currentValue > 0) {
                    input.value = currentValue - 1;
                }
            }
            
            // Llama a la función de actualización de resumen después de cada cambio
            updateSummary();
        });
    });

    // -----------------------------------------------------------------
    // 2. Función de Actualización de Resumen de Compra
    // -----------------------------------------------------------------
    
    // Usaremos los precios de referencia que ya habías puesto
    const prices = {
        'kids-qty': 65000,
        'silver-qty': 83000,
        'gold-qty': 99000
    };
    
    function updateSummary() {
        let total = 0;
        const summarySection = document.querySelector('.summary-section');
        if (!summarySection) return; // Salir si la sección no existe

        // Elementos a manipular
        const totalElement = summarySection.querySelector('.total-value');
        const nextButton = summarySection.querySelector('.next-button');
        
        let summaryHTML = '';

        for (const id in prices) {
            const input = document.getElementById(id);
            if (input) {
                const quantity = parseInt(input.value);
                const pricePerUnit = prices[id];
                const subtotal = quantity * pricePerUnit;
                total += subtotal;

                if (quantity > 0) {
                    const passportName = input.closest('.passport-card').querySelector('.passport-name').textContent.trim();
                    
                    // Crea la línea de resumen para cada producto
                    // toLocaleString('es-CO') formatea con puntos y comas (ej. 99.000)
                    summaryHTML += `
                        <div class="summary-item">
                            <span class="item-name">${passportName} x${quantity}</span>
                            <span class="item-price">$${subtotal.toLocaleString('es-CO')}</span>
                        </div>
                    `;
                }
            }
        }
        
        // ---- MANEJO DE LA INYECCIÓN DE PRODUCTOS ----
        // 1. Encontrar o crear el contenedor donde irán los productos
        let productsContainer = summarySection.querySelector('.summary-items-placeholder');
        if (!productsContainer) {
            // Si no existe, lo creamos debajo del título y antes del total
            productsContainer = document.createElement('div');
            productsContainer.className = 'summary-items-placeholder';
            const summaryTotal = summarySection.querySelector('.summary-total');
            summarySection.insertBefore(productsContainer, summaryTotal);
        }
        
        // 2. Insertar el HTML de los productos
        productsContainer.innerHTML = summaryHTML;
        
        // 3. Actualizar el total y el estado del botón
        totalElement.textContent = `$${total.toLocaleString('es-CO')}`;

        if (total === 0) {
            nextButton.setAttribute('disabled', true);
            nextButton.style.opacity = '0.5';
        } else {
            nextButton.removeAttribute('disabled');
            nextButton.style.opacity = '1';
        }
    }

    // Inicializar el resumen al cargar la página
    updateSummary();
});