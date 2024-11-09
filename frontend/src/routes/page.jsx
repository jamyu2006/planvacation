import { useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Page() {
    const { index } = useParams();
    return (
        <div>
            Page {index}
            <div>
                <Link to="/" className="back-button">
                    <button>&larr;</button>
                </Link>
            </div>
            <button>
                click me!
            </button>
        </div>
    );
}