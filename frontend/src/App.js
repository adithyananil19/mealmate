import React from "react";

import { useEffect, useState } from "react";
import axios from "axios";

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:5000/api/orders") // Change to your backend API
            .then(response => setData(response.data))
            .catch(error => console.error("Error fetching:", error));
    }, []);

    return (
        <div>
            <h1>Orders</h1>
            {data ? <pre>{JSON.stringify(data, null, 2)}</pre> : <p>Loading...</p>}
        </div>
    );
}

export default App;
