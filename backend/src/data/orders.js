export const orders = [
  {
    userEmail: "customer@example.com",
    items: [
      { productName: "Classic T-Shirt", quantity: 2 },
      { productName: "Ceramic Coffee Mug", quantity: 1 },
    ],
    shippingAddress: { address: "12 Rue de la Paix", city: "Dakar", postalCode: "10000", country: "Senegal" },
    status: "delivered",
    daysAgo: 21,
  },
  {
    userEmail: "customer@example.com",
    items: [{ productName: "Wireless Headphones", quantity: 1 }],
    shippingAddress: { address: "12 Rue de la Paix", city: "Dakar", postalCode: "10000", country: "Senegal" },
    status: "shipped",
    daysAgo: 5,
  },
  {
    userEmail: "customer@example.com",
    items: [
      { productName: "Desk Lamp", quantity: 1 },
      { productName: "Notebook Set", quantity: 3 },
    ],
    shippingAddress: { address: "12 Rue de la Paix", city: "Dakar", postalCode: "10000", country: "Senegal" },
    status: "pending",
    daysAgo: 0,
  },
  {
    userEmail: "john@example.com",
    items: [
      { productName: "Mechanical Keyboard", quantity: 1 },
      { productName: "Wireless Mouse", quantity: 1 },
    ],
    shippingAddress: { address: "45 Boulevard Lagunaire", city: "Abidjan", postalCode: "01", country: "Cote d'Ivoire" },
    status: "paid",
    daysAgo: 3,
  },
  {
    userEmail: "john@example.com",
    items: [
      { productName: "Chef's Knife", quantity: 1 },
      { productName: "Bamboo Cutting Board", quantity: 1 },
    ],
    shippingAddress: { address: "45 Boulevard Lagunaire", city: "Abidjan", postalCode: "01", country: "Cote d'Ivoire" },
    status: "delivered",
    daysAgo: 30,
  },
  {
    userEmail: "john@example.com",
    items: [{ productName: "Smart Watch", quantity: 1 }],
    shippingAddress: { address: "45 Boulevard Lagunaire", city: "Abidjan", postalCode: "01", country: "Cote d'Ivoire" },
    status: "cancelled",
    daysAgo: 10,
  },
  {
    userEmail: "amina@example.com",
    items: [
      { productName: "Scented Candle", quantity: 2 },
      { productName: "Throw Blanket", quantity: 1 },
    ],
    shippingAddress: { address: "8 Avenue Kwame Nkrumah", city: "Bamako", postalCode: "BP 1", country: "Mali" },
    status: "delivered",
    daysAgo: 18,
  },
  {
    userEmail: "amina@example.com",
    items: [
      { productName: "Fountain Pen", quantity: 1 },
      { productName: "Sticky Notes Pack", quantity: 2 },
    ],
    shippingAddress: { address: "8 Avenue Kwame Nkrumah", city: "Bamako", postalCode: "BP 1", country: "Mali" },
    status: "paid",
    daysAgo: 2,
  },
  {
    userEmail: "amina@example.com",
    items: [{ productName: "Bluetooth Speaker", quantity: 1 }],
    shippingAddress: { address: "8 Avenue Kwame Nkrumah", city: "Bamako", postalCode: "BP 1", country: "Mali" },
    status: "pending",
    daysAgo: 1,
  },
];
