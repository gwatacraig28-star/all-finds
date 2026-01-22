// Main functionality for All Finds
const listingsContainer = document.getElementById('listingsContainer');
const postModal = document.getElementById('postModal');
const postItemBtn = document.getElementById('postItemBtn');
const closeModal = document.getElementById('closeModal');
const submitItem = document.getElementById('submitItem');

postItemBtn.onclick = () => postModal.classList.remove('hidden');
closeModal.onclick = () => postModal.classList.add('hidden');

submitItem.onclick = async () => {
    const title = document.getElementById('itemTitle').value;
    const price = document.getElementById('itemPrice').value;
    const location = document.getElementById('itemLocation').value;
    const imageFile = document.getElementById('itemImage').files[0];

    if (!title || !price || !location || !imageFile) {
        alert("All fields are required!");
        return;
    }

    // Upload image to Firebase Storage
    const storageRef = storage.ref('images/' + imageFile.name);
    await storageRef.put(imageFile);
    const imageUrl = await storageRef.child(imageFile.name).getDownloadURL();

    // Save listing to Firestore
    await db.collection('listings').add({
        title,
        price,
        location,
        imageUrl,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        featured: false
    });

    alert("Item posted!");
    postModal.classList.add('hidden');
    displayListings();
};

// Display listings
async function displayListings() {
    const snapshot = await db.collection('listings').orderBy('createdAt', 'desc').get();
    listingsContainer.innerHTML = '';
    snapshot.forEach(doc => {
        const data = doc.data();
        const card = document.createElement('div');
        card.className = 'listing-card';
        card.innerHTML = `
            <img src="${data.imageUrl}" alt="${data.title}" />
            <h3>${data.title}</h3>
            <p>Price: ${data.price}</p>
            <p>Location: ${data.location}</p>
        `;
        listingsContainer.appendChild(card);
    });
}

// Load listings on page load

displayListings();