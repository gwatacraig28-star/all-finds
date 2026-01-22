// Admin dashboard logic
const adminEmail = "gwatacraig28@gmail.com"; // admin login

auth.onAuthStateChanged(user => {
    if (!user || user.email !== adminEmail) {
        console.log("You are not authorized as admin");
        return;
    }
    console.log("Admin logged in:", user.email);
    loadAdminListings();
});

async function loadAdminListings() {
    const snapshot = await db.collection('listings').orderBy('createdAt', 'desc').get();
    snapshot.forEach(doc => {
        const data = doc.data();
        console.log("Listing:", data.title, data.price, data.featured);
    });
}

// Example: feature an item
async function featureItem(listingId) {
    await db.collection('listings').doc(listingId).update({ featured: true });
    alert("Item marked as featured!");
}