import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getSavedComparisons,
    deleteSavedComparison,
} from "../api/savedComparisonApi";

import { fetchComparison } from "../api/cityApi";
import SavedComparisonCard from "../components/SavedComparisonCard";

function SavedComparisonsPage() {
    const [comparisons, setComparisons] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const loadComparisons = async () => {
            try {
                const data = await getSavedComparisons();
                setComparisons(data);
            } catch (error) {
                console.error(error);
            }
        };

        loadComparisons();
    }, []);

    const handleDelete = async (comparisonId) => {
        try {
            await deleteSavedComparison(comparisonId);

            setComparisons((prev) =>
                prev.filter(
                    (comparison) =>
                        comparison._id !== comparisonId
                )
            );
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to delete comparison."
            );
        }
    };

    const handleRevisit = async (comparison) => {
        try {
            const data = await fetchComparison(
                comparison.cityOneSlug,
                comparison.cityTwoSlug
            );

            navigate("/compare", {
                state: {
                    comparison: {
                        ...data,
                        cityOne: {
                            ...data.cityOne,
                            slug: comparison.cityOneSlug,
                        },
                        cityTwo: {
                            ...data.cityTwo,
                            slug: comparison.cityTwoSlug,
                        },
                    },
                },
            });
        } catch (error) {
            alert(
                error.response?.data?.message ||
                "Failed to load comparison."
            );
        }
    };

    return (
        <>
            <div className="h-16 bg-[#050816]" />

            <section className="max-w-7xl mx-auto px-6 py-10">

                <h1 className="text-3xl font-bold text-white">
                    Saved Comparisons
                </h1>

                <p className="mt-2 text-gray-400">
                    Quickly revisit or remove your saved city comparisons.
                </p>

                {comparisons.length === 0 ? (
                    <div className="mt-20 text-center text-gray-400">
                        No saved comparisons yet.
                    </div>
                ) : (
                    <div
                        className="
              mt-10
              grid
              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3
              xl:grid-cols-4
              gap-6
            "
                    >
                        {comparisons.map((comparison) => (
                            <SavedComparisonCard
                                key={comparison._id}
                                comparison={comparison}
                                onDelete={handleDelete}
                                onRevisit={handleRevisit}
                            />
                        ))}
                    </div>
                )}

            </section>
        </>
    );
}

export default SavedComparisonsPage;