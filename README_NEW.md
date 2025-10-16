# العراق ٢٠٢٥ - منصة الانتخابات البرلمانية | Iraq 2025 Parliamentary Elections

<div align="center">
  <img src="/public/logo.svg" alt="Iraq Elections 2025 Logo" width="200"/>
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
  [![GitHub stars](https://img.shields.io/github/stars/absulysuly/Election-2025-social-series-.svg?style=social)](https://github.com/absulysuly/Election-2025-social-series-/stargazers)

  <p>منصة رقمية شاملة للانتخابات البرلمانية العراقية ٢٠٢٥ | Comprehensive digital platform for Iraq 2025 Parliamentary Elections</p>
  
  [**View Demo**](#) • [**Report Bug**](https://github.com/absulysuly/Election-2025-social-series-/issues) • [**Request Feature**](https://github.com/absulysuly/Election-2025-social-series-/issues)
</div>

## 📌 المميزات الرئيسية | Key Features

- **Social Experience**: Engage with election content, discussions, and community
- **Serious Experience**: Civic tools for voters, candidates, and observers
- **Voter Hub**: Registration, polling locations, and candidate information
- **Integrity Center**: Report violations and monitor election integrity
- **Multi-language Support**: Arabic, Kurdish, and English interfaces
- **Mobile-Friendly**: Responsive design for all devices

## 🏗️ Project Structure

```
/
├── components/
│   ├── icons/              # SVG icons as React components
│   ├── serious/            # Civic/Serious experience components
│   │   ├── ElectionHubPage.tsx
│   │   ├── DigitalDashboardPage.tsx
│   │   └── ...
│   ├── views/              # Social experience views
│   │   ├── compose/        # Post/Event/Reel composers
│   │   ├── CandidatesView.tsx
│   │   └── ...
│   ├── BottomBar.tsx       # Mobile navigation
│   ├── Header.tsx          # Main application header
│   └── ...
├── public/                # Static assets
├── services/              # API and service layers
├── translations.ts        # Multi-language support
├── App.tsx                # Main application component
└── index.tsx              # Application entry point
```

## 🚀 Key Features & Components

### Social Experience
- **Posts & Discussions**: Share and engage with election-related content
- **Candidate Profiles**: Detailed information about all candidates
- **Event System**: Organize and discover election events
- **Real-time Updates**: Live feed of election news and updates

### Serious Experience (Civic Tools)
- **Voter Information**: Registration, polling locations, and requirements
- **Candidate Resources**: Campaign guidelines and reporting
- **Election Monitoring**: Tools for observers and officials
- **Results & Statistics**: Live election results and analytics

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Routing**: React Router
- **Testing**: Jest, React Testing Library
- **Internationalization**: Custom i18n solution

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+ or Yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/absulysuly/Election-2025-social-series-.git
   cd Election-2025-social-series-
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details on how to contribute to the project.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

## 📞 Contact

- Email: [contact@example.com](mailto:contact@example.com)
- Website: [https://elections.iq](https://elections.iq)

---

<div align="center">
  <p>تم التطوير بكل فخر لخدمة الشعب العراقي 🇮🇶</p>
  <p>Proudly developed to serve the people of Iraq</p>
</div>
