function previewProfileImage(event) {
    const input = event.target;
    const previewImage = document.getElementById('previewImage');

    const file = input.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            previewImage.src = e.target.result;
        };

        reader.readAsDataURL(file);
    }
}