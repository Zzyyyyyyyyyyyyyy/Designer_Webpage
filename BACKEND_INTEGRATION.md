# Supabase Backend Integration - Executable Prompts

> Designer Marketplace - Supabase MCP Integration Guide
>
> **Each section contains ready-to-execute prompts for Supabase setup**

---

## Phase 1: Database Schema Setup

### Prompt 1.1: Create Core Tables

Execute the following SQL in Supabase SQL Editor or via MCP:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  profession TEXT,
  bio TEXT,
  about TEXT,
  location TEXT,
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  likes_count INTEGER DEFAULT 0,
  skills TEXT[],
  certifications TEXT[],
  services TEXT,
  price_range TEXT,
  is_available BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  social_links JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_created_at ON users(created_at);

-- User settings table
CREATE TABLE user_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'followers', 'private')),
  show_email BOOLEAN DEFAULT false,
  show_stats BOOLEAN DEFAULT true,
  indexable BOOLEAN DEFAULT true,
  email_notifications JSONB DEFAULT '{"newFollower": true, "likes": true, "comments": true, "messages": true, "systemUpdates": true, "marketing": false}',
  push_notifications JSONB DEFAULT '{"enabled": false, "newFollower": true, "likes": true, "comments": true, "messages": true}',
  notification_frequency TEXT DEFAULT 'realtime' CHECK (notification_frequency IN ('realtime', 'daily', 'weekly')),
  language TEXT DEFAULT 'en',
  timezone TEXT DEFAULT 'UTC',
  currency TEXT DEFAULT 'USD',
  theme TEXT DEFAULT 'dark' CHECK (theme IN ('light', 'dark', 'auto')),
  view_mode TEXT DEFAULT 'grid' CHECK (view_mode IN ('grid', 'list')),
  two_factor_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Posts table
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  caption TEXT NOT NULL,
  description TEXT,
  details TEXT,
  images TEXT[] NOT NULL,
  video_url TEXT,
  is_product BOOLEAN DEFAULT false,
  price DECIMAL(10, 2),
  sizes TEXT[],
  tags TEXT[],
  category TEXT,
  likes_count INTEGER DEFAULT 0,
  saves_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  search_vector tsvector GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(caption, '') || ' ' || coalesce(description, ''))
  ) STORED
);

CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_is_product ON posts(is_product);
CREATE INDEX idx_posts_tags ON posts USING GIN(tags);
CREATE INDEX idx_posts_search_vector ON posts USING GIN(search_vector);

-- Follows table
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id),
  CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);

-- Likes table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_likes_post_id ON likes(post_id);

-- Saves table
CREATE TABLE saves (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, post_id)
);

CREATE INDEX idx_saves_user_id ON saves(user_id);
CREATE INDEX idx_saves_post_id ON saves(post_id);

-- Cart items table
CREATE TABLE cart_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id, size)
);

CREATE INDEX idx_cart_items_user_id ON cart_items(user_id);

-- Wishlist items table
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_wishlist_items_user_id ON wishlist_items(user_id);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  subtotal DECIMAL(10, 2) NOT NULL,
  tax DECIMAL(10, 2) DEFAULT 0,
  shipping_fee DECIMAL(10, 2) DEFAULT 0,
  total DECIMAL(10, 2) NOT NULL,
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  payment_method TEXT,
  payment_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Order items table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES posts(id) ON DELETE SET NULL,
  product_snapshot JSONB NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  participant_ids UUID[] NOT NULL,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_conversations_participants ON conversations USING GIN(participant_ids);
CREATE INDEX idx_conversations_last_message_at ON conversations(last_message_at DESC);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'file')),
  attachment_url TEXT,
  read_by JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Reviews table
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  content TEXT NOT NULL,
  verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(product_id, user_id)
);

CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Questions table
CREATE TABLE questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  upvotes_count INTEGER DEFAULT 0,
  answers_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_questions_product_id ON questions(product_id);
CREATE INDEX idx_questions_user_id ON questions(user_id);

-- Answers table
CREATE TABLE answers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id UUID REFERENCES questions(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  answer TEXT NOT NULL,
  upvotes_count INTEGER DEFAULT 0,
  is_seller BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_answers_question_id ON answers(question_id);
CREATE INDEX idx_answers_user_id ON answers(user_id);

-- Notifications table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'follow', 'message', 'order', 'system')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  link TEXT,
  read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
```

---

## Phase 2: Row Level Security (RLS) Setup

### Prompt 2.1: Enable RLS on All Tables

```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
```

### Prompt 2.2: Create RLS Policies

```sql
-- Users policies
CREATE POLICY "Public profiles viewable by everyone"
ON users FOR SELECT
USING (true);

CREATE POLICY "Users can update own profile"
ON users FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON users FOR INSERT
WITH CHECK (auth.uid() = id);

-- User settings policies
CREATE POLICY "Users can view own settings"
ON user_settings FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can modify own settings"
ON user_settings FOR ALL
USING (auth.uid() = user_id);

-- Posts policies
CREATE POLICY "Posts viewable by everyone"
ON posts FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can create posts"
ON posts FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts"
ON posts FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own posts"
ON posts FOR DELETE
USING (auth.uid() = user_id);

-- Follows policies
CREATE POLICY "Follows viewable by everyone"
ON follows FOR SELECT
USING (true);

CREATE POLICY "Users can follow others"
ON follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow"
ON follows FOR DELETE
USING (auth.uid() = follower_id);

-- Likes policies
CREATE POLICY "Likes viewable by everyone"
ON likes FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can like"
ON likes FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unlike"
ON likes FOR DELETE
USING (auth.uid() = user_id);

-- Saves policies
CREATE POLICY "Saves viewable by everyone"
ON saves FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can save"
ON saves FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can unsave"
ON saves FOR DELETE
USING (auth.uid() = user_id);

-- Cart policies
CREATE POLICY "Users view own cart"
ON cart_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users manage own cart"
ON cart_items FOR ALL
USING (auth.uid() = user_id);

-- Wishlist policies
CREATE POLICY "Users view own wishlist"
ON wishlist_items FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users manage own wishlist"
ON wishlist_items FOR ALL
USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users view own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users create own orders"
ON orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users view own order items"
ON order_items FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM orders
    WHERE orders.id = order_items.order_id
    AND orders.user_id = auth.uid()
  )
);

-- Conversations policies
CREATE POLICY "Users view own conversations"
ON conversations FOR SELECT
USING (auth.uid() = ANY(participant_ids));

CREATE POLICY "Users create conversations they participate in"
ON conversations FOR INSERT
WITH CHECK (auth.uid() = ANY(participant_ids));

-- Messages policies
CREATE POLICY "Users view messages in their conversations"
ON messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = messages.conversation_id
    AND auth.uid() = ANY(conversations.participant_ids)
  )
);

CREATE POLICY "Users send messages in their conversations"
ON messages FOR INSERT
WITH CHECK (
  auth.uid() = sender_id
  AND EXISTS (
    SELECT 1 FROM conversations
    WHERE conversations.id = conversation_id
    AND auth.uid() = ANY(participant_ids)
  )
);

-- Reviews policies
CREATE POLICY "Reviews viewable by everyone"
ON reviews FOR SELECT
USING (true);

CREATE POLICY "Users can create reviews"
ON reviews FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
ON reviews FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reviews"
ON reviews FOR DELETE
USING (auth.uid() = user_id);

-- Questions policies
CREATE POLICY "Questions viewable by everyone"
ON questions FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can ask questions"
ON questions FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own questions"
ON questions FOR UPDATE
USING (auth.uid() = user_id);

-- Answers policies
CREATE POLICY "Answers viewable by everyone"
ON answers FOR SELECT
USING (true);

CREATE POLICY "Authenticated users can answer"
ON answers FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own answers"
ON answers FOR UPDATE
USING (auth.uid() = user_id);

-- Notifications policies
CREATE POLICY "Users view own notifications"
ON notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
ON notifications FOR UPDATE
USING (auth.uid() = user_id);
```

---

## Phase 3: Database Triggers Setup

### Prompt 3.1: Create Auto-Update Triggers

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_settings_updated_at BEFORE UPDATE ON user_settings
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at BEFORE UPDATE ON questions
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_answers_updated_at BEFORE UPDATE ON answers
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### Prompt 3.2: Create Counter Update Triggers

```sql
-- Update post likes count
CREATE OR REPLACE FUNCTION update_post_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET likes_count = likes_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET likes_count = likes_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_likes_count
AFTER INSERT OR DELETE ON likes
FOR EACH ROW EXECUTE FUNCTION update_post_likes_count();

-- Update post saves count
CREATE OR REPLACE FUNCTION update_post_saves_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET saves_count = saves_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET saves_count = saves_count - 1 WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_saves_count
AFTER INSERT OR DELETE ON saves
FOR EACH ROW EXECUTE FUNCTION update_post_saves_count();

-- Update follow counts
CREATE OR REPLACE FUNCTION update_follow_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE users SET followers_count = followers_count + 1 WHERE id = NEW.following_id;
    UPDATE users SET following_count = following_count + 1 WHERE id = NEW.follower_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE users SET followers_count = followers_count - 1 WHERE id = OLD.following_id;
    UPDATE users SET following_count = following_count - 1 WHERE id = OLD.follower_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_follow_counts_trigger
AFTER INSERT OR DELETE ON follows
FOR EACH ROW EXECUTE FUNCTION update_follow_counts();

-- Update conversation last_message_at
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET last_message_at = NEW.created_at
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_conversation_on_message
AFTER INSERT ON messages
FOR EACH ROW EXECUTE FUNCTION update_conversation_timestamp();

-- Update question answers count
CREATE OR REPLACE FUNCTION update_question_answers_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE questions SET answers_count = answers_count + 1 WHERE id = NEW.question_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE questions SET answers_count = answers_count - 1 WHERE id = OLD.question_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_answers_count
AFTER INSERT OR DELETE ON answers
FOR EACH ROW EXECUTE FUNCTION update_question_answers_count();
```

---

## Phase 4: Database Functions Setup

### Prompt 4.1: Create Helper Functions

```sql
-- Get recommended posts from followed users
CREATE OR REPLACE FUNCTION get_recommended_posts(
  user_id_input UUID,
  limit_count INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  caption TEXT,
  description TEXT,
  images TEXT[],
  price DECIMAL,
  likes_count INT,
  saves_count INT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.user_id,
    p.caption,
    p.description,
    p.images,
    p.price,
    p.likes_count,
    p.saves_count,
    p.created_at
  FROM posts p
  WHERE p.user_id IN (
    SELECT following_id
    FROM follows
    WHERE follower_id = user_id_input
  )
  ORDER BY p.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Global search function
CREATE OR REPLACE FUNCTION search_all(search_term TEXT)
RETURNS TABLE (
  type TEXT,
  id UUID,
  title TEXT,
  description TEXT,
  image_url TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    'user' AS type,
    u.id,
    u.username AS title,
    u.bio AS description,
    u.avatar_url AS image_url
  FROM users u
  WHERE
    u.username ILIKE '%' || search_term || '%'
    OR u.full_name ILIKE '%' || search_term || '%'

  UNION ALL

  SELECT
    'post' AS type,
    p.id,
    p.caption AS title,
    p.description,
    p.images[1] AS image_url
  FROM posts p
  WHERE
    p.search_vector @@ plainto_tsquery('english', search_term)
    OR p.caption ILIKE '%' || search_term || '%'

  ORDER BY type, title
  LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get feed posts (mix of followed users and trending)
CREATE OR REPLACE FUNCTION get_feed_posts(
  user_id_input UUID,
  page_num INT DEFAULT 0,
  page_size INT DEFAULT 20
)
RETURNS TABLE (
  id UUID,
  user_id UUID,
  caption TEXT,
  images TEXT[],
  price DECIMAL,
  likes_count INT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    p.user_id,
    p.caption,
    p.images,
    p.price,
    p.likes_count,
    p.created_at
  FROM posts p
  WHERE
    p.user_id IN (
      SELECT following_id FROM follows WHERE follower_id = user_id_input
    )
    OR p.likes_count > 10
  ORDER BY p.created_at DESC
  LIMIT page_size
  OFFSET page_num * page_size;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Phase 5: Storage Buckets Setup

### Prompt 5.1: Create Storage Buckets via Supabase Dashboard

Go to Storage > Create Bucket and create:

1. **posts** (public)
2. **avatars** (public)
3. **attachments** (private)

### Prompt 5.2: Configure Storage Policies

```sql
-- Posts bucket policies
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'posts' );

CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'posts'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own files"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'posts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'posts'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Avatars bucket policies
CREATE POLICY "Avatars are publicly accessible"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Attachments bucket policies (private)
CREATE POLICY "Users can access own attachments"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can upload own attachments"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'attachments'
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

---

## Phase 6: Frontend Integration

### Prompt 6.1: Install and Configure Supabase Client

```bash
npm install @supabase/supabase-js
```

Create `.env.local`:
```env
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### Prompt 6.2: Migrate AuthContext

Replace `src/contexts/AuthContext.tsx` content with:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signup = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })
    if (error) throw error

    // Create user profile
    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
      })

      // Create user settings
      await supabase.from('user_settings').insert({
        user_id: data.user.id,
      })
    }
  }

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const logout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
```

### Prompt 6.3: Migrate PostsContext

Replace `src/contexts/PostsContext.tsx` content with:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./AuthContext"

export interface UserPost {
  id: string
  user_id: string
  imageUrl: string
  caption: string
  images: string[]
  price: string
  tags: string[]
  isProduct: boolean
  userName?: string
  sizes?: string[]
  description?: string
  details?: string
  createdAt: number
  likes_count: number
  saves_count: number
}

interface PostsContextType {
  posts: UserPost[]
  addPost: (post: Omit<UserPost, "id" | "createdAt" | "user_id" | "likes_count" | "saves_count">) => Promise<void>
  getPosts: () => UserPost[]
  clearPosts: () => void
  loading: boolean
  refetch: () => Promise<void>
}

const PostsContext = createContext<PostsContextType | undefined>(undefined)

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<UserPost[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchPosts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id,
        user_id,
        caption,
        description,
        details,
        images,
        price,
        sizes,
        tags,
        is_product,
        created_at,
        likes_count,
        saves_count,
        users (
          username,
          email
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching posts:', error)
    } else {
      const formattedPosts = data.map(post => ({
        id: post.id,
        user_id: post.user_id,
        imageUrl: post.images[0] || '',
        caption: post.caption,
        images: post.images,
        price: post.price ? `$${post.price}` : '$0',
        tags: post.tags || [],
        isProduct: post.is_product,
        userName: post.users?.username || post.users?.email,
        sizes: post.sizes,
        description: post.description || undefined,
        details: post.details || undefined,
        createdAt: new Date(post.created_at).getTime(),
        likes_count: post.likes_count,
        saves_count: post.saves_count,
      }))
      setPosts(formattedPosts)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const addPost = async (post: Omit<UserPost, "id" | "createdAt" | "user_id" | "likes_count" | "saves_count">) => {
    if (!user) throw new Error('Must be authenticated to create posts')

    const { data, error } = await supabase
      .from('posts')
      .insert({
        caption: post.caption,
        description: post.description,
        details: post.details,
        images: post.images,
        is_product: post.isProduct,
        price: parseFloat(post.price.replace('$', '')),
        sizes: post.sizes,
        tags: post.tags,
      })
      .select()

    if (error) {
      console.error('Error creating post:', error)
      throw error
    }

    await fetchPosts()
  }

  const getPosts = () => {
    return [...posts].sort((a, b) => b.createdAt - a.createdAt)
  }

  const clearPosts = async () => {
    if (!user) return

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      console.error('Error clearing posts:', error)
    } else {
      setPosts([])
    }
  }

  return (
    <PostsContext.Provider value={{ posts, addPost, getPosts, clearPosts, loading, refetch: fetchPosts }}>
      {children}
    </PostsContext.Provider>
  )
}

export function usePosts() {
  const context = useContext(PostsContext)
  if (context === undefined) {
    throw new Error("usePosts must be used within a PostsProvider")
  }
  return context
}
```

### Prompt 6.4: Migrate CartContext

Replace `src/contexts/CartContext.tsx` content with:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./AuthContext"

export interface CartItem {
  id: string
  productId: string
  title: string
  imageUrl: string
  price: string
  size: string
  quantity: number
  designerName?: string
  designerUsername?: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  cartCount: number
  getTotalPrice: () => number
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchCart = async () => {
    if (!user) {
      setCartItems([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        id,
        product_id,
        size,
        quantity,
        posts (
          id,
          caption,
          images,
          price,
          users (
            username
          )
        )
      `)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching cart:', error)
    } else {
      const formattedItems = data.map(item => ({
        id: item.id,
        productId: item.product_id,
        title: item.posts?.caption || '',
        imageUrl: item.posts?.images[0] || '',
        price: item.posts?.price ? `$${item.posts.price}` : '$0',
        size: item.size,
        quantity: item.quantity,
        designerName: item.posts?.users?.username,
      }))
      setCartItems(formattedItems)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchCart()
  }, [user])

  const addToCart = async (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => {
    if (!user) throw new Error('Must be authenticated')

    const { error } = await supabase
      .from('cart_items')
      .upsert({
        product_id: item.productId,
        size: item.size,
        quantity: item.quantity || 1,
      })

    if (error) {
      console.error('Error adding to cart:', error)
      throw error
    }

    await fetchCart()
  }

  const removeFromCart = async (itemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', itemId)

    if (error) {
      console.error('Error removing from cart:', error)
      throw error
    }

    await fetchCart()
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(itemId)
      return
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity })
      .eq('id', itemId)

    if (error) {
      console.error('Error updating quantity:', error)
      throw error
    }

    await fetchCart()
  }

  const clearCart = async () => {
    if (!user) return

    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('user_id', user.id)

    if (error) {
      console.error('Error clearing cart:', error)
    } else {
      setCartItems([])
    }
  }

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ""))
      return total + price * item.quantity
    }, 0)
  }

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      getTotalPrice,
      loading,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
```

### Prompt 6.5: Migrate WishlistContext

Replace `src/contexts/WishlistContext.tsx` content with:

```typescript
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./AuthContext"

export interface WishlistItem {
  productId: string
  title: string
  imageUrl: string
  price: number
  designer: string
  addedAt: string
}

interface WishlistContextType {
  wishlistItems: WishlistItem[]
  addToWishlist: (item: WishlistItem) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  isInWishlist: (productId: string) => boolean
  toggleWishlist: (item: WishlistItem) => Promise<void>
  wishlistCount: number
  loading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchWishlist = async () => {
    if (!user) {
      setWishlistItems([])
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('wishlist_items')
      .select(`
        product_id,
        created_at,
        posts (
          caption,
          images,
          price,
          users (
            username
          )
        )
      `)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error fetching wishlist:', error)
    } else {
      const formattedItems = data.map(item => ({
        productId: item.product_id,
        title: item.posts?.caption || '',
        imageUrl: item.posts?.images[0] || '',
        price: item.posts?.price || 0,
        designer: item.posts?.users?.username || 'Unknown',
        addedAt: item.created_at,
      }))
      setWishlistItems(formattedItems)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWishlist()
  }, [user])

  const addToWishlist = async (item: WishlistItem) => {
    if (!user) throw new Error('Must be authenticated')

    const { error } = await supabase
      .from('wishlist_items')
      .insert({
        product_id: item.productId,
      })

    if (error && error.code !== '23505') { // Ignore duplicate errors
      console.error('Error adding to wishlist:', error)
      throw error
    }

    await fetchWishlist()
  }

  const removeFromWishlist = async (productId: string) => {
    if (!user) return

    const { error } = await supabase
      .from('wishlist_items')
      .delete()
      .eq('product_id', productId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error removing from wishlist:', error)
      throw error
    }

    await fetchWishlist()
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.productId === productId)
  }

  const toggleWishlist = async (item: WishlistItem) => {
    if (isInWishlist(item.productId)) {
      await removeFromWishlist(item.productId)
    } else {
      await addToWishlist(item)
    }
  }

  return (
    <WishlistContext.Provider value={{
      wishlistItems,
      addToWishlist,
      removeFromWishlist,
      isInWishlist,
      toggleWishlist,
      wishlistCount: wishlistItems.length,
      loading,
    }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
```

### Prompt 6.6: Update UploadPage with Storage

Update `src/pages/UploadPage.tsx` - Replace the `handlePost` function:

```typescript
const handlePost = async () => {
  setUploadError("")
  setPriceError("")

  if (uploadedImages.length === 0) {
    setUploadError("Please upload at least one image")
    return
  }

  if (!validatePrice(price)) {
    return
  }

  if (!user) {
    setUploadError("You must be logged in to create posts")
    return
  }

  try {
    // Upload images to Supabase Storage
    const uploadedUrls: string[] = []

    for (let i = 0; i < uploadedImages.length; i++) {
      const base64Data = uploadedImages[i]

      // Convert base64 to blob
      const response = await fetch(base64Data)
      const blob = await response.blob()

      const fileExt = 'jpg'
      const fileName = `${user.id}/${Date.now()}_${i}.${fileExt}`

      const { data, error: uploadError } = await supabase.storage
        .from('posts')
        .upload(fileName, blob, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) {
        console.error('Upload error:', uploadError)
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from('posts')
        .getPublicUrl(fileName)

      uploadedUrls.push(publicUrl)
    }

    // Create post in database
    const { error: postError } = await supabase
      .from('posts')
      .insert({
        caption: title || "Untitled Post",
        description: description || null,
        images: uploadedUrls,
        is_product: true,
        price: parseFloat(price),
        sizes: sizes.length > 0 ? sizes : null,
        tags: categories,
      })

    if (postError) {
      console.error('Post creation error:', postError)
      throw postError
    }

    setShowSuccess(true)
    setTimeout(() => {
      navigate("/")
    }, 1500)
  } catch (error) {
    console.error('Error creating post:', error)
    setUploadError("Failed to create post. Please try again.")
  }
}
```

---

## Phase 7: Realtime Features

### Prompt 7.1: Migrate ChatContext with Realtime

Replace `src/contexts/ChatContext.optimized.tsx` content with:

```typescript
import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { useAuth } from "./AuthContext"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface User {
  id: string
  username: string
  avatarUrl?: string
  online?: boolean
}

export interface Message {
  id: string
  conversationId: string
  senderId: string
  content: string
  timestamp: string
  read: boolean
  type: 'text' | 'image' | 'file'
}

export interface Conversation {
  id: string
  participants: User[]
  lastMessage: Message | null
  unreadCount: number
  updatedAt: string
}

interface ChatContextType {
  conversations: Conversation[]
  selectedConversationId: string | null
  messages: Record<string, Message[]>
  currentUser: User | null
  isLoading: boolean
  selectConversation: (conversationId: string) => void
  sendMessage: (conversationId: string, content: string) => Promise<void>
  markAsRead: (conversationId: string) => Promise<void>
  loadMessages: (conversationId: string) => Promise<void>
  selectedConversation: Conversation | null
  selectedMessages: Message[]
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [messages, setMessages] = useState<Record<string, Message[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [channel, setChannel] = useState<RealtimeChannel | null>(null)
  const { user } = useAuth()

  const currentUser: User | null = useMemo(() => {
    if (!user) return null
    return {
      id: user.id,
      username: user.email?.split('@')[0] || 'User',
      avatarUrl: undefined,
      online: true,
    }
  }, [user])

  const fetchConversations = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .contains('participant_ids', [user.id])
      .order('last_message_at', { ascending: false })

    if (error) {
      console.error('Error fetching conversations:', error)
      return
    }

    // Fetch participants and last messages for each conversation
    const conversationsWithDetails = await Promise.all(
      data.map(async (conv) => {
        // Fetch participants
        const { data: participantsData } = await supabase
          .from('users')
          .select('id, username, email, avatar_url')
          .in('id', conv.participant_ids)

        const participants = participantsData?.map(p => ({
          id: p.id,
          username: p.username || p.email?.split('@')[0] || 'User',
          avatarUrl: p.avatar_url,
        })) || []

        // Fetch last message
        const { data: lastMessageData } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conv.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        const lastMessage = lastMessageData ? {
          id: lastMessageData.id,
          conversationId: lastMessageData.conversation_id,
          senderId: lastMessageData.sender_id,
          content: lastMessageData.content,
          timestamp: lastMessageData.created_at,
          read: true, // Simplified
          type: lastMessageData.message_type,
        } : null

        return {
          id: conv.id,
          participants,
          lastMessage,
          unreadCount: 0, // TODO: Calculate from read_by
          updatedAt: conv.last_message_at,
        }
      })
    )

    setConversations(conversationsWithDetails)
  }

  const loadMessages = async (conversationId: string) => {
    setIsLoading(true)

    const { data, error } = await supabase
      .from('messages')
      .select(`
        *,
        users (
          username,
          email
        )
      `)
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })

    if (error) {
      console.error('Error loading messages:', error)
    } else {
      const formattedMessages = data.map(msg => ({
        id: msg.id,
        conversationId: msg.conversation_id,
        senderId: msg.sender_id,
        content: msg.content,
        timestamp: msg.created_at,
        read: true,
        type: msg.message_type,
      }))

      setMessages(prev => ({
        ...prev,
        [conversationId]: formattedMessages,
      }))
    }

    setIsLoading(false)
  }

  const selectConversation = useCallback((conversationId: string) => {
    setSelectedConversationId(conversationId)
    loadMessages(conversationId)
  }, [])

  const sendMessage = async (conversationId: string, content: string) => {
    if (!user) return

    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        content,
        message_type: 'text',
      })
      .select()
      .single()

    if (error) {
      console.error('Error sending message:', error)
      throw error
    }

    // Optimistic update
    const newMessage: Message = {
      id: data.id,
      conversationId: data.conversation_id,
      senderId: data.sender_id,
      content: data.content,
      timestamp: data.created_at,
      read: true,
      type: data.message_type,
    }

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage],
    }))
  }

  const markAsRead = async (conversationId: string) => {
    // TODO: Implement read_by logic
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId ? { ...conv, unreadCount: 0 } : conv
      )
    )
  }

  // Subscribe to new messages
  useEffect(() => {
    if (!user) return

    const messageChannel = supabase
      .channel('messages')
      .on('postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as any

          setMessages(prev => ({
            ...prev,
            [newMessage.conversation_id]: [
              ...(prev[newMessage.conversation_id] || []),
              {
                id: newMessage.id,
                conversationId: newMessage.conversation_id,
                senderId: newMessage.sender_id,
                content: newMessage.content,
                timestamp: newMessage.created_at,
                read: false,
                type: newMessage.message_type,
              }
            ],
          }))

          // Refresh conversations to update last message
          fetchConversations()
        }
      )
      .subscribe()

    setChannel(messageChannel)

    return () => {
      messageChannel.unsubscribe()
    }
  }, [user])

  useEffect(() => {
    if (user) {
      fetchConversations()
    }
  }, [user])

  const selectedConversation = useMemo(
    () => conversations.find(c => c.id === selectedConversationId) || null,
    [conversations, selectedConversationId]
  )

  const selectedMessages = useMemo(
    () => selectedConversationId ? messages[selectedConversationId] || [] : [],
    [messages, selectedConversationId]
  )

  const contextValue = useMemo(
    () => ({
      conversations,
      selectedConversationId,
      messages,
      currentUser,
      isLoading,
      selectConversation,
      sendMessage,
      markAsRead,
      loadMessages,
      selectedConversation,
      selectedMessages,
    }),
    [
      conversations,
      selectedConversationId,
      messages,
      currentUser,
      isLoading,
      selectConversation,
      selectedConversation,
      selectedMessages,
    ]
  )

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
```

---

## Phase 8: Testing

### Prompt 8.1: Test Authentication

```typescript
// Test in browser console
import { supabase } from './lib/supabase'

// Test signup
await supabase.auth.signUp({
  email: 'test@example.com',
  password: 'password123'
})

// Test login
await supabase.auth.signInWithPassword({
  email: 'test@example.com',
  password: 'password123'
})

// Test get user
const { data: { user } } = await supabase.auth.getUser()
console.log(user)

// Test logout
await supabase.auth.signOut()
```

### Prompt 8.2: Test Posts CRUD

```typescript
// Create post
const { data, error } = await supabase
  .from('posts')
  .insert({
    caption: 'Test Post',
    images: ['https://example.com/image.jpg'],
    is_product: true,
    price: 99.99
  })
  .select()

// Fetch posts
const { data: posts } = await supabase
  .from('posts')
  .select('*')
  .order('created_at', { ascending: false })

console.log(posts)

// Update post
await supabase
  .from('posts')
  .update({ caption: 'Updated Caption' })
  .eq('id', 'post-id')

// Delete post
await supabase
  .from('posts')
  .delete()
  .eq('id', 'post-id')
```

### Prompt 8.3: Test Storage Upload

```typescript
// Test image upload
const file = document.querySelector('input[type="file"]').files[0]

const { data, error } = await supabase.storage
  .from('posts')
  .upload(`${user.id}/${Date.now()}.jpg`, file)

console.log('Upload result:', data, error)

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('posts')
  .getPublicUrl(data.path)

console.log('Public URL:', publicUrl)
```

### Prompt 8.4: Test Realtime Subscription

```typescript
// Subscribe to new posts
const channel = supabase
  .channel('posts')
  .on('postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'posts'
    },
    (payload) => {
      console.log('New post:', payload.new)
    }
  )
  .subscribe()

// Test: Create a post in another tab and watch the console
```

---

## Phase 9: Production Deployment

### Prompt 9.1: Generate TypeScript Types

```bash
npx supabase gen types typescript --project-id your-project-ref > src/types/database.ts
```

Use generated types:

```typescript
import type { Database } from '@/types/database'

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

// Now all queries are type-safe
const { data } = await supabase
  .from('posts') // Autocomplete available
  .select('*')
// data is properly typed
```

### Prompt 9.2: Environment Variables for Production

Create `.env.production`:

```env
VITE_SUPABASE_URL=your-production-url
VITE_SUPABASE_ANON_KEY=your-production-anon-key
```

### Prompt 9.3: Build and Deploy

```bash
# Build
npm run build

# Preview production build
npm run preview

# Deploy to Vercel/Netlify/etc
# Upload dist/ folder or connect Git repository
```

---

## Quick Reference: Common Supabase Queries

### Auth
```typescript
// Sign up
await supabase.auth.signUp({ email, password })

// Sign in
await supabase.auth.signInWithPassword({ email, password })

// Sign out
await supabase.auth.signOut()

// Get user
const { data: { user } } = await supabase.auth.getUser()
```

### Database
```typescript
// Select
const { data } = await supabase.from('table').select('*')

// Insert
await supabase.from('table').insert({ column: 'value' })

// Update
await supabase.from('table').update({ column: 'new' }).eq('id', 1)

// Delete
await supabase.from('table').delete().eq('id', 1)

// Join
await supabase.from('posts').select('*, users(*)')

// Filter
await supabase.from('posts').select('*').eq('user_id', userId)
```

### Storage
```typescript
// Upload
await supabase.storage.from('bucket').upload('path/file.jpg', file)

// Get URL
const { data } = supabase.storage.from('bucket').getPublicUrl('path')

// Delete
await supabase.storage.from('bucket').remove(['path/file.jpg'])
```

### Realtime
```typescript
// Subscribe
const channel = supabase
  .channel('channel-name')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, handleChange)
  .subscribe()

// Unsubscribe
channel.unsubscribe()
```

---

## Troubleshooting

### Issue: RLS blocking queries
```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';

-- Disable RLS temporarily (DEVELOPMENT ONLY)
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;
```

### Issue: Storage upload fails
```typescript
// Check bucket exists and is public
// Go to Storage > Buckets in Dashboard
// Verify RLS policies on storage.objects
```

### Issue: Realtime not working
```typescript
// Verify Realtime is enabled on table
// Dashboard > Database > Replication
// Enable replication for required tables
```

### Issue: Type errors
```bash
# Regenerate types
npx supabase gen types typescript --project-id ref > src/types/database.ts
```

---

## Complete Checklist

- [ ] Database schema created (16 tables)
- [ ] RLS enabled on all tables
- [ ] RLS policies configured
- [ ] Triggers created (timestamps, counters)
- [ ] Database functions created
- [ ] Storage buckets created (posts, avatars, attachments)
- [ ] Storage policies configured
- [ ] Supabase client installed
- [ ] Environment variables configured
- [ ] AuthContext migrated
- [ ] PostsContext migrated
- [ ] CartContext migrated
- [ ] WishlistContext migrated
- [ ] ChatContext migrated with Realtime
- [ ] UploadPage updated with Storage
- [ ] Authentication tested
- [ ] CRUD operations tested
- [ ] File upload tested
- [ ] Realtime tested
- [ ] TypeScript types generated
- [ ] Production build successful
- [ ] Deployed to production

---

**You're now ready to use Supabase as your backend!**
