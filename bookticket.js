fetch('/api/book-ticket', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(ticketData),
})
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text(); // Read response as text
    })
    .then(text => {
        try {
            const data = JSON.parse(text); // Attempt to parse JSON
            console.log('Ticket booked successfully:', data);
        } catch (error) {
            console.error('Unexpected response format:', text);
        }
    })
    .catch(error => {
        console.error('Error booking ticket:', error);
    });