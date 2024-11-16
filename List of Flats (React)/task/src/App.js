// stage 1 - show all the items in the flats array of objects
import React from 'react';

function App() {
    const flats = [
        {
            id: 1,
            name: 'Cozy Apartment',
            location: 'Downtown',
            price: '$1500/month',
            available: true,
            image: 'https://example.com/cozy-apartment.jpg',
        },
        {
            id: 2,
            name: 'Modern Loft',
            location: 'Midtown',
            price: '$1800/month',
            available: false,
            image: 'https://example.com/modern-loft.jpg',
        },
        {
            id: 3,
            name: 'Charming Studio',
            location: 'Uptown',
            price: '$1200/month',
            available: true,
            image: 'https://example.com/charming-studio.jpg',
        },
    ];
    // make your code here
    return (
        <div className="App">
            <header>
                <h1>SuperFlats</h1>
            </header>
            <main>
                <h2>Flat List</h2>
                <ul>
                    {flats.map((flat, index) => (
                        <li key={flat.id}>
                            <h3>{flat.name}</h3>
                            <p>Location: {flat.location}</p>
                            <p>Price: {flat.price}</p>
                            <p>Availability: {flat.available ? 'Available' : 'Not Available'}</p>
                            <img src={flat.image} alt={flat.name}/>
                        </li>
                    ))}
                </ul>
            </main>
        </div>
    );
}

export default App;