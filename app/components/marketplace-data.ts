export type Product = {
  name: string;
  category: string;
  price: number;
  condition: string;
  seller: string;
  location: string;
  image: string;
  color: string;
};

export const products: Product[] = [
  { name: "Sony WH-1000XM5", category: "Tech", price: 248, condition: "Like new", seller: "Maya R.", location: "Brooklyn, NY", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=900&q=85", color: "#e6eee9" },
  { name: "Levi's 501 '93 Straight", category: "Fashion", price: 72, condition: "Excellent", seller: "Jordan K.", location: "Austin, TX", image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=900&q=85", color: "#e7e9f2" },
  { name: "Fujifilm X-T30 II", category: "Tech", price: 685, condition: "Good", seller: "Chris P.", location: "Portland, OR", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85", color: "#e9e3d9" },
  { name: "Nike Air Max 1", category: "Fashion", price: 118, condition: "Like new", seller: "Sam T.", location: "Chicago, IL", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85", color: "#f2e2d8" },
  { name: "Herman Miller Sayl", category: "Home", price: 410, condition: "Good", seller: "Drew L.", location: "Denver, CO", image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85", color: "#e5e8eb" },
  { name: "Polaroid Now+ Gen 2", category: "Tech", price: 96, condition: "Excellent", seller: "Nina S.", location: "Seattle, WA", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=85", color: "#eee6d8" },
];

export const categories = ["All items", "Tech", "Fashion", "Home", "Outdoor"];

export const smartWatches: Product[] = [
  { name: "Apple Watch Series 9", category: "Smart watch", price: 279, condition: "Like new", seller: "Alex M.", location: "San Diego, CA", image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&w=900&q=85", color: "#172b49" },
  { name: "Garmin Venu 3", category: "Smart watch", price: 325, condition: "Excellent", seller: "Priya N.", location: "Boston, MA", image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=900&q=85", color: "#1d334e" },
  { name: "Samsung Galaxy Watch6", category: "Smart watch", price: 189, condition: "Good", seller: "Leo D.", location: "Miami, FL", image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&w=900&q=85", color: "#253b53" },
];
