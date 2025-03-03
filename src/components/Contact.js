import React from "react";
import "./Contact.css";

function Contact() {
    return (
        <section id="contact" className="contacts-container">
            <div className="contact-container">
                <h2>Contact</h2>
                <p className="email-text">
                    <i className="fas fa-envelope"></i>
                    <span className="space"> </span> {}
                    <a>drxckpro123@gmail.com</a>
                    <span className="space"> </span> {}
                    <i className="fa-brands fa-discord"></i>
                    <span className="space"> </span> {}
                    <a>drxck</a>
                </p>
                <p>When contacting me for business, you agree with my <a href="https://docs.google.com/document/d/1lAAyg9JxJ-Uc4r9aaH-KvpafnYdOsE_U">Terms of Service</a> and agree on using <i class="fa-brands fa-paypal" aria-hidden="true"></i> PayPal for transactions.</p>
            </div>
        </section>
    );
}

export default Contact;
