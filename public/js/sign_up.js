document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById('passwordInput');
    const confirmPasswordInput = document.getElementById('confirmPasswordInput');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const createAccountBtn = document.getElementById('createAccountBtn');

    togglePassword.addEventListener('click', function () {
        passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
    });

    toggleConfirmPassword.addEventListener('click', function () {
        confirmPasswordInput.type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
    });


    createAccountBtn.addEventListener('click', function () {
        console.log("working");
    });
});

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