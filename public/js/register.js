document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.querySelector(".password-container input[type='password']");
    const togglePasswordBtn = document.querySelector(".toggle-password");
    const passwordError = document.getElementById("password-error");
    const submitButton = document.getElementById("btn");

    // Functie om wachtwoord te tonen/verbergen
    function togglePassword() {
        if (passwordInput.type === "password") {
            passwordInput.type = "text";
            togglePasswordBtn.innerHTML = '<i class="fas fa-eye"></i>';
        } else {
            passwordInput.type = "password";
            togglePasswordBtn.innerHTML = '<i class="fas fa-eye-slash"></i>';
        }
    }

    // Event listener voor het wachtwoord toggle-icoon
    togglePasswordBtn.addEventListener("click", togglePassword);
});
