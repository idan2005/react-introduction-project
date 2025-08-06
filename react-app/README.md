# In order to activate the server:

cd react-app
npm run dev
# React Introduction Project

A simple React application built with TypeScript and Vite as part of learning React fundamentals.
## Features

- Simple ListGroup component displaying cities
- Built with React 18 and TypeScript
- Vite for fast development and building

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm 

### Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/react-introduction-project.git
cd react-introduction-project
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
cd react-app
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## Technologies Used

- React 18
- TypeScript
- Vite
- CSS

## Project Structure

```
src/
├── App.tsx          # Main application component
├── ListGroup.tsx    # List group component
├── Message.tsx      # Message component
├── main.tsx         # Application entry point
└── assets/          # Static assets
```

## Contributing

This is a learning project, but feel free to suggest improvements!

## License

This project is open source and available under the [MIT License](LICENSE).






add button that move to a new page having:
-a table with the tasks - for each task have a name, assigned user, list name
-add the owner name to the bottom of the new page
change the http request to use axios instead of fetch