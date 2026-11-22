function Navbar() {
  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            LM
          </span>
          <h1 className="text-xl font-bold text-gray-900">Lead Manager</h1>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
