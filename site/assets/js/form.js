document.addEventListener('DOMContentLoaded', function () {

    // regex
    let nameLnameReg = /^[A-ZČĆŽŠĐ][a-zčćžšđ]+(?:[-\s][A-ZČĆŽŠĐ][a-zčćžšđ]+)*$|^[А-ЯЧЋЖШЂ][а-ячћжшђ]+(?:[-\s][А-ЯЧЋЖШЂ][а-ячћжшђ]+)*$/;
    let emailReg = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com)$/;
    let passwordReg = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=<>?{}[\]~]).{7,}$/;
    let phoneReg = /^(?:\+?\d{1,3}[-.\s]?)?\d{6,10}$/;

    let name = document.getElementById("name");
    let lastName = document.getElementById("lastName");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let phoneNumber = document.getElementById("phoneNumber");
    let gender = document.getElementsByName('gender');
    let checkAll = document.getElementById("conditions");
    let passwordInfo = document.getElementById('passwordInfo');
    let resultOfRegistration = document.getElementById("registrationResult");
    let register = document.getElementById('registration');

    name.classList.add("wrongInput");
    lastName.classList.add("wrongInput");
    email.classList.add("wrongInput");
    password.classList.add("wrongInput");
    phoneNumber.classList.add("wrongInput");

    passwordInfo.style.display = "none";

    //form validation
    function validation() {

        // name
        name.addEventListener('blur', function () {
            if (nameLnameReg.test(name.value)) {
                name.classList.remove('wrongInput');
                name.classList.add('goodInput');
            }
            else {
                name.classList.remove('goodInput');
                name.classList.add('wrongInput');
            }
        });

        //last name
        lastName.addEventListener('blur', function () {
            if (nameLnameReg.test(lastName.value)) {
                lastName.classList.remove('wrongInput');
                lastName.classList.add('goodInput');
            }
            else {
                lastName.classList.remove('goodInput');
                lastName.classList.add('wrongInput');
            }
        });

        //emaill
        email.addEventListener('blur', function () {
            if (emailReg.test(email.value)) {
                email.classList.remove('wrongInput');
                email.classList.add('goodInput');
            }
            else {
                email.classList.remove('goodInput');
                email.classList.add('wrongInput');
            }
        });

        //pass
        password.addEventListener('focus', function () {
            passwordInfo.style.display = "block";
        });
        password.addEventListener('blur', function () {
            if (passwordReg.test(password.value)) {
                password.classList.remove('wrongInput');
                password.classList.add('goodInput');
            }
            else {
                password.classList.remove('goodInput');
                password.classList.add('wrongInput');
            }

            passwordInfo.style.display = "none";
        });

        //number
        phoneNumber.addEventListener('blur', function () {
            if (phoneReg.test(phoneNumber.value)) {
                phoneNumber.classList.remove('wrongInput');
                phoneNumber.classList.add('goodInput');
            }
            else {
                phoneNumber.classList.remove('goodInput');
                phoneNumber.classList.add('wrongInput');
            }
        });
    }

    function technicalValidation() {

        let valid = true;

        //name
        if (!nameLnameReg.test(name.value)) {
            name.classList.add('wrongInput');
            valid = false;
        }
        //last name
        if (!nameLnameReg.test(lastName.value)) {
            lastName.classList.add('wrongInput');
            valid = false;
        }
        // email
        if (!emailReg.test(email.value)) {
            email.classList.add('wrongInput');
            valid = false;
        }
        // password
        if (!passwordReg.test(password.value)) {
            password.classList.add('wrongInput');
            valid = false;
        }
        //phone
        if (!phoneReg.test(phoneNumber.value)) {
            phoneNumber.classList.add('wrongInput');
            valid = false;
        }
        // gender
        let genderSelected = false;
        for (let i = 0; i < gender.length; i++) {
            if (gender[i].checked) {
                genderSelected = true;
                break;
            }
        }
        if (!genderSelected) {
            valid = false;
        }
        //conditions
        if (!checkAll.checked) {
            valid = false;
        }
        return valid;
    }

    validation();

    register.addEventListener('click', function (e) {
        e.preventDefault();
        if (technicalValidation()) {
            const now = new Date();
            const day = now.getDay();

            resultOfRegistration.classList.remove('ptag');
            resultOfRegistration.classList.remove('badP');

            resultOfRegistration.classList.add('goodP');

            if (day >= 1 && day <= 5) {
                resultOfRegistration.textContent =
                    "Successful registration";
            }
            else {
                resultOfRegistration.textContent =
                    "Successful registration, but the form will be processed from Monday";
            }
        }
        else {
            resultOfRegistration.classList.remove('ptag');
            resultOfRegistration.classList.remove('goodP');

            resultOfRegistration.classList.add('badP');

            resultOfRegistration.textContent =
                "Registration failed";
        }
    });

});