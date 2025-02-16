import Link from 'next/link'; // Import the Link component for navigation

export default function Navigation() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between items-center"> {/* Use flexbox for layout */}
        <h1 className="text-xl font-bold">Audit Assist</h1>
        <div> {/* Container for the navigation links */}
          <Link href="/" className="mr-4 hover:underline">Home</Link>
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
        </div>
      </div>
    </nav>
  );
}