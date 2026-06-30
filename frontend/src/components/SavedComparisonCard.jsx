import { Trash2, ExternalLink, MapPin } from "lucide-react";

function SavedComparisonCard({
    comparison,
    onDelete,
    onRevisit,
}) {
    return (
        <div
            className="
        rounded-2xl
        border border-blue-500/15
        bg-[#050816]/70
        backdrop-blur-xl
        p-4
        transition-all
        hover:border-blue-500/40
        hover:-translate-y-1
      "
        >
            {/* Cities */}

            <div className="flex items-center justify-center gap-4">

                <div className="flex items-center gap-1">
                    <MapPin
                        size={16}
                        className="text-blue-500"
                    />

                    <h3 className="text-lg font-semibold text-white">
                        {comparison.cityOneName.split(",")[0]}
                    </h3>
                </div>

                <div
                    className="
            h-10 w-10
            rounded-full
            border border-blue-500/20
            bg-blue-500/10
            flex items-center justify-center
            text-blue-400
            text-sm
            font-bold
            shrink-0
          "
                >
                    VS
                </div>

                <div className="flex items-center gap-1">
                    <MapPin
                        size={16}
                        className="text-blue-500"
                    />

                    <h3 className="text-lg font-semibold text-white">
                        {comparison.cityTwoName.split(",")[0]}
                    </h3>
                </div>

            </div>

            {/* Actions */}

            {/* Divider */}

            <div className="mt-5 border-t border-white/10" />

            {/* Buttons */}

            <div className="mt-4 flex items-center justify-between">

                <button
                    onClick={() => onDelete(comparison._id)}
                    className="
            flex items-center gap-1
            text-red-400
            hover:text-red-300
            transition
            text-sm
          "
                >
                    <Trash2 size={16} />
                    Delete
                </button>

                <button
                    onClick={() => onRevisit(comparison)}
                    className="
            flex items-center gap-1
            text-blue-400
            hover:text-blue-300
            transition
            text-sm
          "
                >
                    <ExternalLink size={16} />
                    Revisit
                </button>

            </div>
        </div>
    );
}

export default SavedComparisonCard;