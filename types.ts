export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url?: string;
  email: string;
  created_at: string;
  role?: 'admin' | 'user';
}

export interface Material {
  id: string;
  title: string;
  description: string;
  category: 'editing' | 'software' | 'ai' | 'others';
  section?: string;
  subcategory?: string;
  device?: 'mobile' | 'desktop';
  rating?: number;
  logo_url?: string;
  screenshots?: string[];
  thumbnail_icon?: string;
  thumbnail_url?: string;
  resource_url: string;
  gradient: string;
  is_free: boolean;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  text: string;
  stars: number;
  avatar_text: string;
  gradient: string;
}
