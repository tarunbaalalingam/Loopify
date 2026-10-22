
const MATERIALS = {
  "Cardboard & packaging": "📦",
  "Used cooking oil": "🛢️",
  "Coffee grounds": "☕",
  "Other reusable material": "♻️"
};

// Fictional buyers for the ProtoSpark demonstration.
const buyers = [
  {
    name: "GreenCarton Recycling",
    materials: ["Cardboard & packaging"],
    minimum: 5,
    areas: ["Adyar", "Guindy", "Besant Nagar"]
  },
  {
    name: "City Paper Recovery",
    materials: ["Cardboard & packaging"],
    minimum: 10,
    areas: ["Adyar", "Mylapore", "T. Nagar"]
  },
  {
    name: "Circular Organics Demo",
    materials: ["Coffee grounds", "Other reusable material"],
    minimum: 1,
    areas: ["Adyar", "Mylapore", "Besant Nagar"]
  },
  {
    name: "Sample Oil Partner",
    materials: ["Used cooking oil"],
    minimum: 5,
    areas: ["Adyar", "Guindy", "T. Nagar"]
  },
  {
    name: "Neighbourhood Recovery Hub",
    materials: [
      "Cardboard & packaging",
      "Coffee grounds",
      "Other reusable material"
    ],
    minimum: 2,
    areas: ["Adyar", "Besant Nagar", "Mylapore", "T. Nagar"]
  }
];

const starterListings = [
  {
    id: "L1001",
    material: "Cardboard & packaging",
    quantity: 15,
    unit: "kg",
    condition: "Clean / sorted",
    area: "Adyar",
    seller: "Sample Cafe",
    notes: "Flattened cartons ready for collection.",
    status: "Available"
  },
  {
    id: "L1002",
    material: "Coffee grounds",
    quantity: 4,
    unit: "kg",
    condition: "Clean / sorted",
    area: "Mylapore",
    seller: "Demo Coffee House",
    notes: "Sample material in a clean container.",
    status: "Available"
  },
  {
    id: "L1003",
    material: "Used cooking oil",
    quantity: 8,
    unit: "litres",
    condition: "Sealed container",
    area: "Guindy",
    seller: "Example Kitchen",
    notes: "Illustrative listing only.",
    status: "Available"
  }
];

function loadListings() {
  try {
    const saved = localStorage.getItem("loopifyListings");
    return saved ? JSON.parse(saved) : [...starterListings];
  } catch {
    return [...starterListings];
  }
}

let listings = loadListings();

function saveListings() {
  localStorage.setItem("loopifyListings", JSON.stringify(listings));
}

function safe(value) {
  const chars = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };

  return String(value).replace(/[&<>"']/g, char => chars[char]);
}

function toast(message) {
  const element = document.getElementById("toast");
  element.textContent = message;
  element.classList.add("show");

  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => {
    element.classList.remove("show");
  }, 2500);
}

function findBuyers(listing) {
  return buyers.filter(buyer => {
    const acceptsMaterial = buyer.materials.includes(listing.material);
    const enoughQuantity = Number(listing.quantity) >= buyer.minimum;
    const servesArea = buyer.areas.some(
      area => area.toLowerCase() === listing.area.trim().toLowerCase()
    );

    return acceptsMaterial && enoughQuantity && servesArea;
  });
}

function statusClass(status) {
  if (status === "Accepted") return "accepted";
  if (status === "Completed") return "completed";
  return "";
}

function listingCard(item) {
  const emoji = MATERIALS[item.material] || "♻️";

  return `
    <article class="listing-card">
      <div class="listing-top">
        <div class="material-emoji">${emoji}</div>
        <span class="status ${statusClass(item.status)}">
          ${safe(item.status)}
        </span>
      </div>

      <div>
        <h3>${safe(item.material)}</h3>
        <p class="subline">
          ${safe(item.seller)} · ${safe(item.area)}
        </p>
      </div>

      <div class="listing-meta">
        <span>⚖ ${safe(item.quantity)} ${safe(item.unit)}</span>
        <span>✦ ${safe(item.condition)}</span>
      </div>

      <p class="subline">${safe(item.notes || "No additional notes.")}</p>

      <div class="card-actions">
        <button class="button secondary" data-match="${safe(item.id)}">
          Find buyers
        </button>

        ${
          item.status !== "Completed"
            ? `<button class="button primary" data-complete="${safe(item.id)}">
                 Complete demo
               </button>`
            : ""
        }
      </div>
    </article>
  `;
}

function emptyMessage(title, description) {
  return `
    <div class="empty-state">
      <strong>${safe(title)}</strong><br>
      ${safe(description)}
    </div>
  `;
}

function renderListings() {
  const sorted = [...listings].reverse();

  document.getElementById("recentListings").innerHTML =
    sorted.slice(0, 3).map(listingCard).join("") ||
    emptyMessage("No listings yet", "Add your first material listing.");

  const search = (
    document.getElementById("search")?.value || ""
  ).toLowerCase().trim();

  const category =
    document.getElementById("filter")?.value || "all";

  const filtered = sorted.filter(item => {
    const searchable =
      `${item.material} ${item.seller} ${item.area}`.toLowerCase();

    return searchable.includes(search) &&
      (category === "all" || item.material === category);
  });

  document.getElementById("allListings").innerHTML =
    filtered.map(listingCard).join("") ||
    emptyMessage("No matching listings", "Try another filter.");

  updateDashboard();
}

function updateDashboard() {
  const available = listings.filter(
    item => item.status !== "Completed"
  );

  const completed = listings.filter(
    item => item.status === "Completed"
  );

  const matchCount = available.reduce(
    (total, item) => total + findBuyers(item).length,
    0
  );

  // Only quantities explicitly measured in kilograms are totalled here.
  const kilograms = completed
    .filter(item => item.unit === "kg")
    .reduce((total, item) => total + Number(item.quantity), 0);

  document.getElementById("statListings").textContent =
    available.length;

  document.getElementById("statMatches").textContent =
    matchCount;

  document.getElementById("statCompleted").textContent =
    completed.length;

  document.getElementById("statKg").textContent =
    `${kilograms.toLocaleString()} kg`;

  document.getElementById("impactKg").textContent =
    kilograms.toLocaleString();
}

function showView(viewName) {
  document.querySelectorAll(".view").forEach(section => {
    section.classList.add("hidden");
  });

  const section = document.getElementById(viewName);

  if (section) {
    section.classList.remove("hidden");
  }

  document.querySelectorAll(".nav").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.view === viewName
    );
  });

  if (["dashboard", "listings", "impact"].includes(viewName)) {
    renderListings();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function showMatches(id) {
  const item = listings.find(listing => listing.id === id);
  if (!item) return;

  const matches = findBuyers(item);

  const results = matches.length
    ? matches.map(buyer => `
        <article class="listing-card">
          <div class="listing-top">
            <div class="material-emoji">🏢</div>
            <span class="status">Sample match</span>
          </div>

          <h3>${safe(buyer.name)}</h3>

          <p class="subline">
            Minimum quantity: ${buyer.minimum} ${safe(item.unit)}
          </p>

          <p class="subline">
            Serves: ${buyer.areas.map(safe).join(", ")}
          </p>

          <p class="subline">
            Match reason: accepts this material, meets the minimum
            quantity and serves ${safe(item.area)}.
          </p>

          <button class="button primary" data-accept="${safe(item.id)}">
            Simulate acceptance
          </button>
        </article>
      `).join("")
    : emptyMessage(
        "No suitable sample buyers found",
        "Try another area or quantity. Real buyer availability is not checked."
      );

  document.getElementById("matchContent").innerHTML = `
    <div class="match-header">
      <p class="eyebrow">MATCH RESULTS · DEMO</p>
      <h2>${safe(item.material)}</h2>
      <p class="muted">
        ${safe(item.quantity)} ${safe(item.unit)} ·
        ${safe(item.area)} · Listing ${safe(item.id)}
      </p>
      <p class="muted">
        These results use fictional buyer profiles and simple matching rules.
      </p>
    </div>

    <div class="listing-grid">${results}</div>
  `;

  showView("matches");
}

// Navigation and listing actions.
document.addEventListener("click", event => {
  const navigation = event.target.closest("[data-view]");

  if (navigation) {
    event.preventDefault();
    showView(navigation.dataset.view);
  }

  const matchButton = event.target.closest("[data-match]");

  if (matchButton) {
    showMatches(matchButton.dataset.match);
  }

  const completeButton = event.target.closest("[data-complete]");

  if (completeButton) {
    const item = listings.find(
      listing => listing.id === completeButton.dataset.complete
    );

    if (item) {
      item.status = "Completed";
      saveListings();
      renderListings();
      toast("Demo listing marked completed.");
    }
  }

  const acceptButton = event.target.closest("[data-accept]");

  if (acceptButton) {
    const item = listings.find(
      listing => listing.id === acceptButton.dataset.accept
    );

    if (item) {
      item.status = "Accepted";
      saveListings();
      renderListings();
      showView("listings");
      toast("Sample match accepted.");
    }
  }
});

// Create a new listing.
document.getElementById("listingForm").addEventListener(
  "submit",
  event => {
    event.preventDefault();

    const material = document.getElementById("material").value;
    const quantity = Number(
      document.getElementById("quantity").value
    );
    const area = document.getElementById("area").value.trim();
    const seller = document.getElementById("seller").value.trim();

    if (!material || !Number.isFinite(quantity) || quantity <= 0 ||
        !area || !seller) {
      toast("Please complete all required fields.");
      return;
    }

    const item = {
      id: "L" + Date.now().toString().slice(-8),
      material,
      quantity,
      unit: document.getElementById("unit").value,
      condition: document.getElementById("condition").value,
      area,
      seller,
      notes: document.getElementById("notes").value.trim(),
      status: "Available"
    };

    listings.push(item);
    saveListings();
    event.target.reset();
    renderListings();
    showView("listings");
    toast("Your sample listing has been created.");
  }
);

// Search and filters.
document.getElementById("search").addEventListener(
  "input", renderListings
);

document.getElementById("filter").addEventListener(
  "change", renderListings
);

// Restore the original sample data.
document.getElementById("resetDemo").addEventListener("click", () => {
  if (confirm("Reset all listings to the original demo data?")) {
    listings = [...starterListings];
    saveListings();
    renderListings();
    showView("dashboard");
    toast("Demo data has been reset.");
  }
});

// Initial page render.
renderListings();
showView("dashboard");

// Sign out of the demo session.
document.getElementById("logout").addEventListener("click", () => {
  sessionStorage.removeItem("loopify_demo_session");
  location.replace("/login.html");
});
