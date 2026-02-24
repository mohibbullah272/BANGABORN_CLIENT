export interface IProduct {
    _id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice?: number;
    category: string;
    gender: 'Men' | 'Women' | 'Kids' | 'Unisex';
    material?: string;
    sizes: string[];
    colors: string[];
    images: string[];
    stock: number;
    sold: number;
    rating: number;
    numReviews: number;
    isFeatured: boolean;
    isActive: boolean;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  }
  
  export interface ProductsResponse {
    success: boolean;
    products: IProduct[];
    total: number;
    page: number;
    totalPages: number;
    limit: number;
  }
  
  export interface ProductQuery {
    category?: string;
    gender?: string;
    minPrice?: string;
    maxPrice?: string;
    size?: string;
    color?: string;
    search?: string;
    page?: string;
    limit?: string;
    sortBy?: 'createdAt' | 'price' | 'rating' | 'sold' | 'popularity';
    sortOrder?: 'asc' | 'desc';
  }
  
  export const CATEGORIES = ['Panjabi', 'Shirt', 'T-Shirt', 'Kurta', 'Dress', 'Salwar', 'Saree'] as const;
  export const GENDERS = ['Men', 'Women', 'Kids', 'Unisex'] as const;
  export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;
  export const SORT_OPTIONS = [
    { label: 'Newest', value: 'createdAt', order: 'desc' },
    { label: 'Price: Low to High', value: 'price', order: 'asc' },
    { label: 'Price: High to Low', value: 'price', order: 'desc' },
    { label: 'Top Rated', value: 'rating', order: 'desc' },
    { label: 'Best Selling', value: 'sold', order: 'desc' },
  ] as const;