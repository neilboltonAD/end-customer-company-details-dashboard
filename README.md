# End Customer - Company Details Dashboard

A modern React application for viewing and managing end customer company details, built with TypeScript and Tailwind CSS. This dashboard provides comprehensive insights from Adobe and Microsoft Partner Center.

## 🔗 Project Links

- **Jira Ticket**: [PRODUCT-2282](https://appdirect.jira.com/browse/PRODUCT-2282)
- **Product Requirements Document (PRD)**: See [PRD.md](./PRD.md) for detailed requirements and specifications
- **Partner Center Insights Summary**: See [PARTNER_CENTER_INSIGHTS_SUMMARY.md](./PARTNER_CENTER_INSIGHTS_SUMMARY.md) for the latest feature implementation

## Features

- **Modern UI Components**: Built with React 18 and TypeScript
- **Responsive Design**: Fully responsive layout using Tailwind CSS
- **Interactive Elements**: Toggles, radio buttons, search inputs, and more
- **Navigation System**: Multi-level navigation with sidebar and top navigation
- **Settings Interface**: Complete settings management interface

## Components

### Navigation
- `TopNavbar`: Main navigation bar with search, notifications, and user controls
- `SecondaryNavbar`: Secondary navigation highlighting current section
- `Sidebar`: Categorized settings navigation with active states

### Forms
- `Toggle`: Interactive toggle switches
- `RadioButton`: Radio button groups with labels and descriptions
- `Button`: Multiple button variants (primary, secondary, outline)
- `SearchInput`: Search input with icon

### Layout
- `Card`: Content containers with headers and content areas
- `Section`: Sectioned content with titles
- `SettingItem`: Individual setting items with descriptions
- `PageLayout`: Main page layout combining all navigation elements

### Typography
- `Heading`: Configurable heading levels
- `Text`: Text components with variants and colors

### Misc
- `Avatar`: User avatar with initials or images

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd end-customer-company-details-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm run build`: Builds the app for production
- `npm test`: Launches the test runner
- `npm run eject`: Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── form/          # Form components (Button, Toggle, RadioButton, SearchInput)
│   ├── layout/        # Layout components (Card, Section, SettingItem, PageLayout)
│   ├── navigation/    # Navigation components (TopNavbar, SecondaryNavbar, Sidebar)
│   ├── typography/    # Typography components (Heading, Text)
│   └── misc/          # Miscellaneous components (Avatar)
├── pages/             # Page components (ComponentLibrary)
├── App.tsx           # Main App component
├── index.tsx         # Application entry point
└── index.css         # Global styles and Tailwind imports
```

## Technology Stack

- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Type-safe JavaScript development
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **Create React App**: Zero-configuration build tool

## Customization

### Adding New Settings
1. Create new setting items in the appropriate section
2. Use the existing `SettingItem` component for consistency
3. Add new toggle or form components as needed

### Styling
- All styling is done with Tailwind CSS classes
- Custom styles can be added to `src/index.css`
- Component-specific styles are defined inline with Tailwind classes

### Navigation
- Add new sidebar items in `src/components/navigation/Sidebar.tsx`
- Update navigation categories as needed
- Modify the active state logic for highlighting current sections

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

## Acknowledgments

- Built with components from [Magic Patterns](https://magicpatterns.com)
- Icons from [Lucide React](https://lucide.dev)
- Styling with [Tailwind CSS](https://tailwindcss.com) 