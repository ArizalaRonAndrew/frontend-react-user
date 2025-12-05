export default function Footer() {
    return (
        <footer className="bg-slate-900 text-white py-16 mt-10">
            <div className="max-w-7xl mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    
                    <div>
                        <h3 className="text-lg font-semibold">SnapHub</h3>
                        <p className="text-gray-400 text-sm mt-3">
                            Creating timeless memories through professional photography.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><a href="#services" className="hover:text-white">Services</a></li>
                            <li><a href="/" className="hover:text-white">Home</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Contact</h3>
                        <ul className="text-sm text-gray-400 space-y-2">
                            <li>+1 (555) 123-4567</li>
                            <li>hello@capturestudios.com</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-4">Follow Us</h3>
                        <div className="flex gap-3">
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg"></a>
                            <a href="#" className="w-10 h-10 bg-white/10 rounded-lg"></a>
                        </div>
                    </div>

                </div>

                <div className="border-t border-white/10 pt-8 mt-10 text-center text-gray-400 text-sm">
                    © 2025 Capture Studios. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
