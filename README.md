
# Surat Tugas Application

A web application for creating and managing official assignment (Surat Tugas) and decision (Surat Keputusan) letters.

## Project Requirements

- Node.js (v16.0.0 or higher)
- npm (v7.0.0 or higher) or Yarn (v1.22.0 or higher) or Bun (v1.0.0 or higher)

## Installation

```sh
git clone <YOUR_REPOSITORY_URL>
cd surat-tugas-app
npm install
# OR
yarn install
# OR
bun install
```

## Running the Application

```sh
npm run dev
# OR
yarn dev
# OR
bun dev
```

The app will be available at http://localhost:8080

## Dependencies Used

- **React**: 18.3.1
- **React DOM**: 18.3.1
- **@tanstack/react-query**: 5.56.2
- **Zod**: 3.24.2
- **Tailwind CSS**: ^3.x
- **shadcn/ui**: CLI based custom component kit
- **Lucide React (icon set)**: 0.360.0
- **date-fns**: 3.3.1
- **react-hook-form**: 7.51.0
- **cmdk**: 0.2.0 (command palette & search)
- **class-variance-authority**, **clsx**, **uuid**, **typescript** and more

You can add missing dependencies at any time. To (re)install Tailwind:
```sh
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```
To add shadcn/ui components:
```sh
npx shadcn-ui@latest add [component-name]
```

## API Integration for Employee Data

- **Pegawai (Employee) search** fields auto-populate NIP, Nama, Pangkat, Jabatan, Unit Kerja.
- The data for these fields is fetched from an API at `src/services/employee-service.ts`.
- **Placeholder**: When using the app without connecting to a real API, mock data is provided. Update the API endpoint in `employee-service.ts` to connect to your real database or service.
- If no results found, a message such as "Tidak ada hasil" will be shown in the search.

## Data Placeholders

**Example response expected from employee API:**
```json
[
  {
    "nip": "198501052009011013",
    "nama": "Ahmad Fauzi",
    "jabatan": "Analis Kepegawaian Ahli Muda",
    "unitKerja": "Biro Kepegawaian",
    "pangkat": "Penata/III-c"
  }
]
```
> _You must return at least the above fields for autocomplete to work correctly._

## Folder Structure

```
src/
├── components/     # UI components
│   ├── ui/         # shadcn UI
│   └── surat-tugas/ / surat-keputusan/
├── hooks/          # Custom React hooks
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## Common Dev Commands

```sh
npm run dev          # Development mode
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Run TypeScript checks
```

## Browser Support

- Chrome, Firefox, Edge, Safari (latest 2 versions)

