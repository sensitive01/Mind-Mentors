import { useState } from "react";

const BlueButtonKid = () => {
    const [loading, setLoading] = useState(false);

    const handleJoinMeeting = async () => {
        setLoading(true);
        try {
            const response = await fetch("http://localhost:5000/api/bbb/join-kid");
            const data = await response.json();
            if (data.joinUrl) {
                window.open(data.joinUrl, "_blank"); // Open in new tab
            }
        } catch (error) {
            console.error("Error joining meeting", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button 
            onClick={handleJoinMeeting} 
            className="bg-blue-500 text-white px-4 py-2 rounded"
            disabled={loading}
        >
            {loading ? "Joining as Kid..." : "Join as Kid"}
        </button>
    );
};

export default BlueButtonKid;
