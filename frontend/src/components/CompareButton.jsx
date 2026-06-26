import { ArrowRight } from "lucide-react";

function CompareButton({ onClick, loading }) {
    return (
        <div className="mt-4 flex justify-center">
            <button
                onClick={onClick}
                disabled={loading}
                className="group flex items-center gap-0.5 px-3 py-1 rounded-xl text-white font-medium text-sm bg-gradient-to-r from-blue-700 to-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.4)] hover:scale-105 transition-all duration-300">
                {loading ? "Comparing..." : "Compare Cities"}

                <ArrowRight
                    size={10}
                    className="group-hover:translate-x-1 transition-transform"
                />
            </button>
        </div>
    );
}

export default CompareButton;