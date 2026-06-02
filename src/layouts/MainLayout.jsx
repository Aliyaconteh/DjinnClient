import Navbar from "../components/ui/Navbar";

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      {children}
    </div>
  );
}
