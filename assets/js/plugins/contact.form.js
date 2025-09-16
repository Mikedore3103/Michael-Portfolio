/**
 *
 * -----------------------------------------------------------------------------
 *
 * Template : Reeni Personal Portfolio HTML Template
 * Author : themes-park
 * Author URI : https://themes-park.com/ 
 *
 * -----------------------------------------------------------------------------
 *
 **/


// Initialize EmailJS with your user ID


function sendMail(event) {
    event.preventDefault(); // Prevent form reload

    let parms = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value, // Correct ID
    };

    emailjs.send("service_79ukbca", "template_kk0omni", parms)
        .then(function() {
            alert("Request sent successfully. I will get back to you shortly.");
        }, function(error) {
            alert("Failed to send request. Please try again.");
        });
}

// Attach event listener to the form
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('.tmp-dynamic-form').addEventListener('submit', sendMail);
});
