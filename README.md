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
- **User profiles** - Create personalized profiles with editable descriptions

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
CREATE TABLE public.conlang (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  english_name character varying,
  native_name character varying,
  summary text,
  code text NOT NULL UNIQUE,
  created_by text,
  custom_links jsonb,
  ratings jsonb DEFAULT '{"likes": [], "comments": [], "dislikes": []}'::jsonb,
  CONSTRAINT conlang_pkey PRIMARY KEY (id)
);
CREATE TABLE public.conlang-articles (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  written_by text NOT NULL,
  conlang_code text NOT NULL,
  updated_at timestamp with time zone NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  CONSTRAINT conlang-articles_pkey PRIMARY KEY (id)
);
CREATE TABLE public.conlang-dictionary (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  conlang_code text NOT NULL,
  lexical_item text NOT NULL,
  owner text NOT NULL,
  definition text NOT NULL,
  notes character varying,
  transliteration text,
  pos text,
  CONSTRAINT conlang-dictionary_pkey PRIMARY KEY (id)
);
CREATE TABLE public.conlang-phonology (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  phonemes ARRAY,
  allophones jsonb,
  phonotactics text,
  conlang_id text NOT NULL UNIQUE,
  CONSTRAINT conlang-phonology_pkey PRIMARY KEY (id)
);
CREATE TABLE public.conlang-typology (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  conlang_code text NOT NULL,
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
  morphological_number text,
  inclusivity text,
  gender_system text,
  CONSTRAINT conlang-typology_pkey PRIMARY KEY (id)
);
CREATE TABLE public.literature (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  title text,
  author text,
  conlang text,
  genre text,
  synopsis text,
  content text,
  CONSTRAINT literature_pkey PRIMARY KEY (id)
);
CREATE TABLE public.pt-aru-dict (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  arusian character varying DEFAULT ''::character varying,
  semlek character varying DEFAULT ''::character varying,
  pt character varying DEFAULT ''::character varying,
  xsampa_aru character varying DEFAULT ''::character varying,
  xsampa_pt character varying DEFAULT ''::character varying,
  wordclass character varying DEFAULT ''::character varying,
  CONSTRAINT pt-aru-dict_pkey PRIMARY KEY (id)
);
CREATE TABLE public.user-profiles (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  description text,
  username text NOT NULL UNIQUE,
  user_alias text UNIQUE CHECK (length(user_alias) <= 12),
  CONSTRAINT user-profiles_pkey PRIMARY KEY (id, username)
);
CREATE TABLE public.usernames (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  timestamp timestamp with time zone NOT NULL DEFAULT now(),
  user_id text NOT NULL,
  user_alias text NOT NULL,
  CONSTRAINT usernames_pkey PRIMARY KEY (id)
);
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