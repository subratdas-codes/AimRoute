function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">

        <h3 className="text-2xl font-bold mb-4 md:mb-0">
          AIMROUTE
        </h3>

        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} AIMROUTE. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;