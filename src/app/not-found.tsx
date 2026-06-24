import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-4">
        <div className="text-6xl font-bold text-white/10">404</div>
        <h2 className="text-xl font-semibold text-white">Page Not Found</h2>
        <p className="text-sm text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-semibold rounded-xl hover:from-amber-400 hover:to-amber-500 transition-all text-sm"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
