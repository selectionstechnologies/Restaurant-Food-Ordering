export type CategoryId = 'burgers' | 'pizza' | 'pasta' | 'salads' | 'asian' | 'desserts' | 'drinks';

export type DietaryTag = 'vegetarian' | 'vegan' | 'gluten-free' | 'spicy' | 'dairy-free';

export type Allergen = 'gluten' | 'dairy' | 'eggs' | 'nuts' | 'soy' | 'sesame' | 'fish' | 'shellfish';

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  image: string;
}

export interface SizeOption {
  id: string;
  label: string;
  /** Added to the base price. */
  priceDelta: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
}

export interface FoodItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  price: number;
  category: CategoryId;
  image: string;
  gallery: string[];
  ingredients: string[];
  dietaryTags: DietaryTag[];
  allergens: Allergen[];
  available: boolean;
  featured: boolean;
  chefSpecial?: boolean;
  bestseller?: boolean;
  rating: number;
  reviewCount: number;
  /** Relative popularity score used for sorting (sample data). */
  popularity: number;
  calories?: number;
  sizes?: SizeOption[];
  addOns?: AddOn[];
}

export interface CartLine {
  /** Unique per item + options combination. */
  lineId: string;
  itemId: string;
  quantity: number;
  sizeId?: string;
  addOnIds: string[];
  instructions?: string;
}

export interface PromoCode {
  code: string;
  description: string;
  type: 'percent' | 'fixed' | 'free-delivery';
  value: number;
  minSubtotal?: number;
}

export type FulfillmentMethod = 'delivery' | 'pickup';
export type PaymentMethod = 'cod' | 'online';

export interface CartTotals {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  tax: number;
  total: number;
  itemCount: number;
}

export interface OrderLine {
  itemId: string;
  name: string;
  image: string;
  quantity: number;
  unitPrice: number;
  options: string[];
  instructions?: string;
}

export interface CheckoutDetails {
  fullName: string;
  email: string;
  phone: string;
  fulfillment: FulfillmentMethod;
  address?: string;
  city?: string;
  postalCode?: string;
  deliveryInstructions?: string;
  paymentMethod: PaymentMethod;
}

export interface Order {
  orderNumber: string;
  createdAt: string;
  customer: CheckoutDetails;
  lines: OrderLine[];
  totals: CartTotals;
  promoCode?: string;
  estimatedMinutes: [number, number];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
}

export type SortOption = 'popular' | 'rating' | 'price-asc' | 'price-desc';

export interface MenuFilterState {
  query: string;
  category: CategoryId | 'all';
  vegetarianOnly: boolean;
  maxPrice: number;
  sort: SortOption;
}
