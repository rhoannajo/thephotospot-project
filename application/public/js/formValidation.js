var valid = true;

function usernameValidation() {
    let username = document.getElementById('username').value;

    if (username.length < 3 && !isNaN(username.charAt(0)) || username == "") {
        document.getElementById("error-user").innerHTML = "<label class='error-text'> Must begin with a character</br> Must be 3 or more characters</label>";
        valid = false;
    } else {
        document.getElementById("error-user").innerHTML = "";
        valid = true;
    }

    if (username.length < 4) {
        document.getElementById("error-user").innerHTML = "<label class='error-text'> Must be 3 or more characters</label>"
        valid = false;
    } else {
        document.getElementById("error-user").innerHTML = "";
        valid = true;
    }

    if (!isNaN(username.charAt(0))) {
        document.getElementById("error-user").innerHTML = "<label class='error-text'> Must begin with a character</label>";
        valid = false;
    } else {
        document.getElementById("error-user").innerHTML = "";
        valid = true;
    }

    if (!valid) {
        document.getElementById("username").setAttribute("class", "error-box");
        valid = false;
    } else {
        document.getElementById("username").setAttribute("class", "");
    }
}

function emailValidation() {
    let email = document.getElementById('email').value;
    if (email.search(/(@)/) < 1 || email == "") {
        document.getElementById("error-email").setAttribute = "<label class='error-text'> Must be a valid email address</label>";
        valid = false;
    }
}

function passValidation() {
    let password = document.getElementById('password').value;

    if (password.length < 8 || password == "") {
        document.getElementById("error-password").innerHTML = "<label class='error-text'> Must be 8 or more characters</label><br/>";   
        valid = false;
    } else {
        document.getElementById("error-password").innerHTML = "";
        valid = true;
    }
    if (password.search(/[A-Z]/) < 0) {
        document.getElementById("error-password").innerHTML = "<label class='error-text'> Must have at least 1 uppercase letter</label><br/>";  
        valid = false; 
    } else {
        document.getElementById("error-password").innerHTML = "";
        valid = true;
    }
    if (password.search(/[!@#$%^&*]/) < 0) {
        document.getElementById("error-password").innerHTML = "<label class='error-text'> Must have at least 1 special character (/ * - + ! @ # $ ^ &)</label><br/>";
        valid = false;
    } else {
        document.getElementById("error-password").innerHTML = "";
        valid = true;
    }

    if (password.search(/[0-9]/) < 1) {
        document.getElementById("error-password").innerHTML = "<label class='error-text'> Must have at least 1 number</label>";   
        valid = false;
    }else {
        document.getElementById("error-password").innerHTML = "";
        valid = true;
    }
    if (!valid) {
        document.getElementById("password").setAttribute("class", "error-box");
        valid = false;
    }
}

function confirmPassValid() {
    var pass = document.getElementById("password").value;
    var confirmPass = document.getElementById("confirmpass").value;
    if (pass != confirmPass || pass == "") {
        document.getElementById("error-confirmpass").innerHTML = "<label class='error-text'> Passwords do not match</label>";   
        valid = false;
    } else {
        document.getElementById("error-confirmpass").innerHTML = "";
        valid = true;
    }
    if (!valid) {
        document.getElementById("confirmpass").setAttribute("class", "error-box");
        valid = false;
    }
}

function checksValidation() {
    var checkage = document.getElementById("check-age").checked;
    var checkterms = document.getElementById("check-terms").checked;

    if (checkage == false) {
        valid = false;
        document.getElementById("check-age").setAttribute("class", "error-box");
        //valid = true;
    } 
    if (checkterms == false) {
        valid = false;
        document.getElementById("check-terms").setAttribute("class", "error-box");
        //valid = true;
    }

}

function validateButton() {
    if (valid) {
        document.getElementById("error-button").innerHTML = "<label class='submit-text'> Submitted!</label>";
        //document.location.reload(true);
    } 
    if (!valid) {
        document.getElementById("error-button").innerHTML = "<label class='error-text'> Cannot submit. Check errors.</label>";
    }
}