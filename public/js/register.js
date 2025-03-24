document.addEventListener('DOMContentLoaded', function() {
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    const registerButton = document.getElementById('register-btn');
    const errorMessage = document.getElementById('error-message');

    // Focus username input on load
    usernameInput.focus();

    // Registration function
    function attemptRegistration() {
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();
        const confirmPassword = confirmPasswordInput.value.trim();

        // Validate inputs
        if (!username || !email || !password || !confirmPassword) {
            errorMessage.textContent = 'Please fill in all fields';
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errorMessage.textContent = 'Please enter a valid email address';
            return;
        }

        // Check password length
        if (password.length < 6) {
            errorMessage.textContent = 'Password must be at least 6 characters long';
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            errorMessage.textContent = 'Passwords do not match';
            return;
        }

        // In a real app, you would send this data to your server
        // For this demo, we'll just simulate a successful registration
        alert('Registration successful! You can now log in.');
        window.location.href = 'login.html';
    }

    // Event listeners
    registerButton.addEventListener('click', attemptRegistration);

    // Allow registration with Enter key
    confirmPasswordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            attemptRegistration();
        }
    });
});
