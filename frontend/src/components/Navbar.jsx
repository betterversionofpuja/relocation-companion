import { MapPin } from "lucide-react";

function Navbar() {
    return (
        <nav className="absolute top-5 left-6">
            <div className="flex items-center gap-1">
                <MapPin
                    size={25}
                    className="text-blue-500"
                />

                <span className="text-white text-[17px] font-medium">
                    Relocation Companion
                </span>
            </div>
        </nav>
    );
}

export default Navbar;