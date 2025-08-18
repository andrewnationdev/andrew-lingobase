# Lingobase

<p align="center">
  <strong>Construct Your Language. Build Your World.</strong>
</p>

<p align="center">
  A platform for creating, documenting, and sharing constructed languages (conlangs) with a community of fellow world-builders.
</p>

<p align="center">
  <a href="#features"><strong>Features</strong></a> ·
  <a href="#installation"><strong>Installation</strong></a> ·
  <a href="#supabase-setup"><strong>Supabase Setup</strong></a> ·
  <a href="#contributing"><strong>Contributing</strong></a> ·
  <a href="#development"><strong>Development</strong></a>
</p>

---

## What is Lingobase?

Lingobase is a comprehensive platform for constructed language (conlang) creators to:

- **Create and document languages** with detailed typological information
- **Build comprehensive dictionaries** with etymologies and grammatical notes
- **Design phonological systems** with custom sound inventories
- **Share your languages** with the community
- **Collaborate** on language development projects

Perfect for fantasy world-builders, game developers, writers, linguists, and language enthusiasts.

## Features

### Language Creation Tools
- **Typological documentation** - Define word order, morphology, alignment systems
- **Dictionary management** - Create entries with definitions, parts of speech, and notes
- **Phonology tools** - Document your language's sound system
- **Grammar articles** - Write detailed grammatical descriptions

### Technical Features
- Built with [Next.js 15](https://nextjs.org) App Router
- [Supabase](https://supabase.com) backend with real-time updates
- User authentication and authorization
- Beautiful UI with [shadcn/ui](https://ui.shadcn.com/) and [Tailwind CSS](https://tailwindcss.com)
- Responsive design for desktop and mobile
- Dark/light theme support

## Installation

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- A [Supabase](https://supabase.com) account

### 1. Clone the repository

```bash
git clone https://github.com/andrewnationdev/andrew-lingobase.git
cd andrew-lingobase
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment setup

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local  # if .env.example exists
# or create .env.local manually
```

Add your Supabase credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

You can find these values in your [Supabase project's API settings](https://supabase.com/dashboard/project/_/settings/api).

### 4. Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Supabase Setup

### 1. Create a new Supabase project

1. Go to [database.new](https://database.new)
2. Create a new project
3. Wait for the database to be provisioned

### 2. Set up authentication

Supabase Auth is already configured in this project. Users can sign up and sign in using email/password.

### 3. Create the database tables

Run the following SQL in your Supabase SQL Editor ([Dashboard > SQL Editor](https://supabase.com/dashboard/project/_/sql/new)):

```sql
-- Create conlang table for language metadata
CREATE TABLE public.conlang (
  id bigserial PRIMARY KEY,
  code text UNIQUE NOT NULL,
  english_name text NOT NULL,
  native_name text,
  summary text,
  created_by text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.conlang ENABLE ROW LEVEL SECURITY;

-- Create conlang-dictionary table for word entries
CREATE TABLE public."conlang-dictionary" (
  id bigserial PRIMARY KEY,
  lexical_item text NOT NULL,
  definition text NOT NULL,
  pos text, -- part of speech
  notes text,
  transliteration text,
  conlang_code text NOT NULL REFERENCES public.conlang(code) ON DELETE CASCADE,
  owner text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public."conlang-dictionary" ENABLE ROW LEVEL SECURITY;

-- Create conlang-typology table for linguistic typology
CREATE TABLE public."conlang-typology" (
  id bigserial PRIMARY KEY,
  conlang_code text UNIQUE NOT NULL REFERENCES public.conlang(code) ON DELETE CASCADE,
  word_order text,
  morphosyntactic_alignment text,
  language_family text,
  verbal_tenses text,
  type_morphology text,
  pro_drop text,
  formality_system text,
  vowel_inventory text,
  tonal text,
  syllable_structure text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public."conlang-typology" ENABLE ROW LEVEL SECURITY;

-- Create conlang-phonology table for sound systems
CREATE TABLE public."conlang-phonology" (
  id bigserial PRIMARY KEY,
  conlang_code text UNIQUE NOT NULL REFERENCES public.conlang(code) ON DELETE CASCADE,
  consonants jsonb,
  vowels jsonb,
  phonotactics text,
  stress_pattern text,
  notes text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public."conlang-phonology" ENABLE ROW LEVEL SECURITY;

-- Create conlang-articles table for grammar documentation
CREATE TABLE public."conlang-articles" (
  id bigserial PRIMARY KEY,
  conlang_code text NOT NULL REFERENCES public.conlang(code) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  author text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public."conlang-articles" ENABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX idx_conlang_dictionary_conlang_code ON public."conlang-dictionary"(conlang_code);
CREATE INDEX idx_conlang_dictionary_owner ON public."conlang-dictionary"(owner);
CREATE INDEX idx_conlang_articles_conlang_code ON public."conlang-articles"(conlang_code);
CREATE INDEX idx_conlang_created_by ON public.conlang(created_by);

-- Set up Row Level Security policies
-- Users can read all public conlangs
CREATE POLICY "Allow public read access" ON public.conlang
  FOR SELECT USING (true);

-- Users can insert/update/delete their own conlangs
CREATE POLICY "Allow users to manage their own conlangs" ON public.conlang
  FOR ALL USING (auth.jwt() ->> 'email' = created_by);

-- Similar policies for related tables
CREATE POLICY "Allow public read access to dictionary" ON public."conlang-dictionary"
  FOR SELECT USING (true);

CREATE POLICY "Allow users to manage their own dictionary entries" ON public."conlang-dictionary"
  FOR ALL USING (auth.jwt() ->> 'email' = owner);

-- Policies for other tables (adjust based on your needs)
CREATE POLICY "Allow public read access to typology" ON public."conlang-typology"
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to phonology" ON public."conlang-phonology"
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access to articles" ON public."conlang-articles"
  FOR SELECT USING (true);
```

### 4. Optional: Insert sample data

```sql
-- Insert a sample conlang
INSERT INTO public.conlang (code, english_name, native_name, summary, created_by)
VALUES ('EX', 'Example Language', 'Esempal', 'A demonstration constructed language', 'your-email@example.com');

-- Insert sample dictionary entries
INSERT INTO public."conlang-dictionary" (lexical_item, definition, pos, conlang_code, owner)
VALUES 
  ('salu', 'hello, greeting', 'interjection', 'EX', 'your-email@example.com'),
  ('domis', 'house, home', 'noun', 'EX', 'your-email@example.com'),
  ('amu', 'to love', 'verb', 'EX', 'your-email@example.com');
```

## Contributing

We welcome contributions from the community! Whether you're fixing bugs, adding features, improving documentation, or sharing ideas, your contributions help make Lingobase better for everyone.

### Ways to Contribute

- **Report bugs** by opening an issue
- **Suggest features** or improvements
- **Submit pull requests** with bug fixes or new features
- **Improve documentation** 
- **Share your constructed languages** created with Lingobase

### Development Workflow

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/andrew-lingobase.git
   ```

3. **Create a new branch** for your feature/fix:
   ```bash
   git checkout -b feature/your-feature-name
   ```

4. **Set up the development environment** (see [Installation](#installation))

5. **Make your changes** and test them locally

6. **Run the linter** to ensure code quality:
   ```bash
   npm run lint
   ```

7. **Build the project** to check for errors:
   ```bash
   npm run build
   ```

8. **Commit your changes** with a descriptive message:
   ```bash
   git commit -m "Add feature: description of what you added"
   ```

9. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

10. **Open a Pull Request** on GitHub with a clear description

### Code Guidelines

- Follow the existing code style and conventions
- Use TypeScript for type safety
- Write clear, descriptive commit messages
- Add comments for complex logic
- Ensure responsive design for UI changes
- Test your changes across different browsers

### Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Protected dashboard pages  
│   ├── auth/              # Authentication pages
│   └── page.tsx           # Landing page
├── components/            # Reusable React components
│   ├── ui/                # shadcn/ui components
│   └── tutorial/          # Tutorial/help components
├── lib/                   # Utility functions and configs
│   ├── supabase/          # Supabase client configuration
│   └── utils.ts           # General utilities
├── schema/                # Data schemas and constants
└── public/                # Static assets
```

## Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Key Technologies

- **Framework**: Next.js 15 with App Router
- **Database**: Supabase (PostgreSQL with real-time subscriptions)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React, FontAwesome
- **Language**: TypeScript

### Troubleshooting

#### Build fails with font loading error
If you encounter Google Fonts loading errors during build, this is likely due to network restrictions in the build environment. The app will still work fine in development and production.

#### Environment variables not loading
- Ensure `.env.local` exists in the root directory
- Check that variable names match exactly: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Restart the development server after adding environment variables

#### Database connection issues
- Verify your Supabase URL and key are correct
- Check that your Supabase project is active
- Ensure Row Level Security policies are set up correctly

#### Authentication not working
- Confirm Supabase Auth is enabled in your project settings
- Check that the site URL is configured in Supabase Auth settings for production deployments

## Deployment

### Deploy to Vercel

The easiest way to deploy Lingobase is using Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables in Vercel's dashboard
4. Deploy!

Vercel will automatically handle builds and deployments on every push to your main branch.

### Other Platforms

Lingobase can be deployed to any platform that supports Next.js applications:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify
- Self-hosted with Docker

## License

This project is open source and available under the [MIT License](LICENSE).
