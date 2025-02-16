// pages/dashboard.js
import Navigation from '../components/Navigation'; // Import the Navigation component

export default function Dashboard() {
  return (
    <div>
      <Navigation /> {/* Include the navigation component */}

      <main className="container mx-auto p-8"> {/* Main content area */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Dashboard</h1> {/* Title */}
        <p className="text-lg text-gray-600">Dashboard is here</p> {/* Placeholder content */}
      </main>
    </div>
  );
}