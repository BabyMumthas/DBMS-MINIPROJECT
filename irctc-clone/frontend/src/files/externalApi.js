export const fetchExternalData = async () => {
    try {
        const response = await fetch("http://localhost:5000/api/external-data");
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching external data:", error);
        throw error;
    }
};
