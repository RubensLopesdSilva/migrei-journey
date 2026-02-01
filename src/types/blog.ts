export type BlogPostStatus = 'draft' | 'scheduled' | 'published';

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string;
  created_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  content_format: 'markdown' | 'html';
  featured_image: string | null;
  author_id: string;
  category_id: string | null;
  category?: BlogCategory;
  tags: string[];
  status: BlogPostStatus;
  published_at: string | null;
  scheduled_at: string | null;
  meta_title: string | null;
  meta_description: string | null;
  reading_time_minutes: number;
  view_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBlogPostInput {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  content_format: 'markdown' | 'html';
  featured_image?: string;
  category_id?: string;
  tags?: string[];
  status: BlogPostStatus;
  scheduled_at?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface UpdateBlogPostInput extends Partial<CreateBlogPostInput> {
  id: string;
}
