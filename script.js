document.addEventListener('DOMContentLoaded', () => {
    const gallery = document.getElementById('photoGallery');
    let photos = JSON.parse(localStorage.getItem('photos')) || [];
    const MAX_PHOTOS = 20; // Limit the number of photos stored

    // Display photos on page load
    photos.forEach(photo => {
        addPhotoToGallery(photo);
    });

    document.getElementById('fileInput').addEventListener('change', function() {
        const fileInput = document.getElementById('fileInput');
        const nameInput = document.getElementById('nameInput').value;
        const addressInput = document.getElementById('addressInput').value;
        const descriptionInput = document.getElementById('descriptionInput').value;

        const files = fileInput.files;

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = function(e) {
                const photoData = {
                    src: e.target.result,
                    name: nameInput,
                    address: addressInput,
                    description: descriptionInput
                };

                addPhotoToGallery(photoData);

                // Add new photo to the array, removing the oldest if necessary
                if (photos.length >= MAX_PHOTOS) {
                    photos.shift(); // Remove the oldest photo
                }
                photos.push(photoData);

                try {
                    localStorage.setItem('photos', JSON.stringify(photos));
                } catch (error) {
                    if (error.name === 'QuotaExceededError') {
                        alert('Local storage quota exceeded. Some photos may not be saved.');
                    } else {
                        console.error('An error occurred while saving photos:', error);
                    }
                }
            };

            reader.readAsDataURL(file);
        }

        // Clear inputs after uploading
        fileInput.value = '';
        document.getElementById('nameInput').value = '';
        document.getElementById('addressInput').value = '';
        document.getElementById('descriptionInput').value = '';
    });

    document.getElementById('resetButton').addEventListener('click', function() {
        // Clear localStorage
        localStorage.removeItem('photos');
        
        // Clear gallery display
        gallery.innerHTML = '';
        
        // Optionally, clear the photos array
        photos = [];
    });

    function addPhotoToGallery(photoData) {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';

        const img = document.createElement('img');
        img.src = photoData.src;
        img.alt = 'Uploaded Photo';

        const infoDiv = document.createElement('div');
        const name = document.createElement('p');
        name.textContent = `Name: ${photoData.name}`;
        const address = document.createElement('p');
        address.textContent = `Address: ${photoData.address}`;
        const description = document.createElement('p');
        description.textContent = `Description: ${photoData.description}`;

        infoDiv.appendChild(name);
        infoDiv.appendChild(address);
        infoDiv.appendChild(description);

        photoItem.appendChild(img);
        photoItem.appendChild(infoDiv);
        gallery.appendChild(photoItem);
    }
});

