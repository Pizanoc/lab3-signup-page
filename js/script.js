// Event listeners
document.querySelector("#zip").addEventListener("change", displayCity);
document.querySelector("#state").addEventListener("change", displayCounties);
document.querySelector("#username").addEventListener("input", checkUsername);
document.querySelector("#password").addEventListener("click", displaySuggestedPassword);
document.querySelector("#signupForm").addEventListener("submit", function (event) {
    validateForm(event);
});

// Load all states when page loads
displayStates();


// Functions

// Display city, latitude, and longitude from ZIP code
async function displayCity() {
    let zipCode = document.querySelector("#zip").value;
    let url = `https://csumb.space/api/cityInfoAPI.php?zip=${zipCode}`;
    let response = await fetch(url);
    let data = await response.json();

    if (!data || data.city === undefined) {
        document.querySelector("#zipError").innerHTML = "Zip code not found";
        document.querySelector("#zipError").style.color = "red";
        document.querySelector("#city").innerHTML = "";
        document.querySelector("#latitude").innerHTML = "";
        document.querySelector("#longitude").innerHTML = "";
        return;
    }

    document.querySelector("#zipError").innerHTML = "";
    document.querySelector("#city").innerHTML = data.city;
    document.querySelector("#latitude").innerHTML = data.latitude;
    document.querySelector("#longitude").innerHTML = data.longitude;
}

// Display all US states when page loads
async function displayStates() {
    let url = "https://csumb.space/api/allStatesAPI.php";
    let response = await fetch(url);
    let data = await response.json();

    let stateList = document.querySelector("#state");
    stateList.innerHTML = "<option value=''>Select One</option>";

    for (let i = 0; i < data.length; i++) {
        stateList.innerHTML += `<option value="${data[i].usps}">${data[i].state}</option>`;
    }
}

// Display counties based on selected state
async function displayCounties() {
    let state = document.querySelector("#state").value;

    if (state === "") {
        document.querySelector("#county").innerHTML = "<option>Select County</option>";
        return;
    }

    let url = `https://csumb.space/api/countyListAPI.php?state=${state}`;
    let response = await fetch(url);
    let data = await response.json();

    let countyList = document.querySelector("#county");
    countyList.innerHTML = "<option>Select County</option>";

    for (let i = 0; i < data.length; i++) {
        countyList.innerHTML += `<option>${data[i].county}</option>`;
    }
}

// Check whether username is available
async function checkUsername() {
    let username = document.querySelector("#username").value;
    let usernameError = document.querySelector("#usernameError");

    if (username.length === 0) {
        usernameError.innerHTML = "Username required!";
        usernameError.style.color = "red";
        return;
    }

    let url = `https://csumb.space/api/usernamesAPI.php?username=${username}`;
    let response = await fetch(url);
    let data = await response.json();

    if (data.available) {
        usernameError.innerHTML = "Username available!";
        usernameError.style.color = "green";
    } else {
        usernameError.innerHTML = "Username taken";
        usernameError.style.color = "red";
    }
}

// Display suggested password when clicking password box
function displaySuggestedPassword() {
    document.querySelector("#suggestedPwd").innerHTML = "Suggested password: csumb123";
    document.querySelector("#suggestedPwd").style.color = "blue";
}

// Validate form before submit
function validateForm(e) {
    let isValid = true;

    let username = document.querySelector("#username").value;
    let password = document.querySelector("#password").value;
    let passwordAgain = document.querySelector("#passwordAgain").value;

    let usernameError = document.querySelector("#usernameError");
    let passwordError = document.querySelector("#passwordError");

    // Clear old errors
    usernameError.innerHTML = "";
    passwordError.innerHTML = "";

    // Username cannot be blank
    if (username.length === 0) {
        usernameError.innerHTML = "Username required!";
        usernameError.style.color = "red";
        isValid = false;
    }

    // Username cannot be taken
    if (usernameError.innerHTML === "Username taken") {
        isValid = false;
    }

    // Password must be at least 6 characters
    if (password.length < 6) {
        passwordError.innerHTML = "Password must be at least 6 characters";
        passwordError.style.color = "red";
        isValid = false;
    }

    // Passwords must match
    if (password !== passwordAgain) {
        passwordError.innerHTML = "Passwords do not match";
        passwordError.style.color = "red";
        isValid = false;
    }

    // Stop form submission if invalid
    if (!isValid) {
        e.preventDefault();
    }
}