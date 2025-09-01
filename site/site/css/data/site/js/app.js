document.addEventListener('DOMContentLoaded', async () => {
  let vehicles = [];

  // Carregar veículos do JSON
  try {
    const res = await fetch('data/vehicles.json');
    vehicles = await res.json();
  } catch (err) {
    console.error('Erro ao carregar veículos:', err);
    vehicles = []; // fallback vazio
  }

  const carsGrid = document.getElementById('carsGrid');

  // Função para renderizar carros
  function renderCars(filteredVehicles) {
    carsGrid.innerHTML = '';

    filteredVehicles.forEach(car => {
      const whatsappMsg = encodeURIComponent(
        `Olá! Tenho interesse no ${car.brand} ${car.model} ${car.year}. Pode me passar mais detalhes?`
      );
      const whatsappLink = `https://wa.me/5511999998888?text=${whatsappMsg}`;

      const card = document.createElement('div');
      card.className = 'car-card';

      card.innerHTML = `
        <img src="${car.images[0]}" alt="${car.brand} ${car.model}" class="car-image" />
        <div class="car-info">
          <h3>${car.brand} ${car.model}</h3>
          <p>${car.version}</p>
          <p>${car.year} • ${car.km.toLocaleString()} km • ${car.fuel}</p>
          <p class="price">R$ ${car.price.toLocaleString('pt-BR')}</p>
          <a href="${whatsappLink}" target="_blank" class="btn-whatsapp">Comprar Agora</a>
        </div>
      `;

      carsGrid.appendChild(card);
    });
  }

  // Filtros
  const searchInput = document.getElementById('searchInput');
  const brandFilter = document.getElementById('brandFilter');
  const yearFilter = document.getElementById('yearFilter');
  const priceFilter = document.getElementById('priceFilter');

  function applyFilters() {
    let filtered = vehicles;

    // Busca textual
    const query = searchInput.value.toLowerCase();
    if (query) {
      filtered = filtered.filter(car =>
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.year.toString().includes(query) ||
        car.price.toString().includes(query)
      );
    }

    // Filtro marca
    if (brandFilter.value) {
      filtered = filtered.filter(car => car.brand === brandFilter.value);
    }

    // Filtro ano
    if (yearFilter.value) {
      filtered = filtered.filter(car => car.year == yearFilter.value);
    }

    // Filtro preço
    if (priceFilter.value) {
      const max = parseInt(priceFilter.value);
      filtered = filtered.filter(car => car.price <= max);
    }

    renderCars(filtered);
  }

  // Eventos
  searchInput.addEventListener('input', applyFilters);
  brandFilter.addEventListener('change', applyFilters);
  yearFilter.addEventListener('change', applyFilters);
  priceFilter.addEventListener('change', applyFilters);

  // Render inicial
  renderCars(vehicles);
});
