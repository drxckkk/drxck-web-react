import React from "react";
import { CIcon } from '@coreui/icons-react';
import { cibDiscord, cibPaypal } from '@coreui/icons';
import "./Contact.css";

function Contact() {
    return (
        <section id="contact" className="contacts-container">
            <div className="contact-container">
                <h2>Contact</h2>
                <p className="email-text">
                    <i className="fas fa-envelope"></i>
                    <a>drxckpro123@gmail.com</a>
                    <CIcon icon={cibDiscord} />
                    <a>drxck</a>
                </p>
                <p className="payment-text">When contacting me for business, you agree with my <a href="https://docs.google.com/document/d/1lAAyg9JxJ-Uc4r9aaH-KvpafnYdOsE_U">Terms of Service</a> and agree on using <CIcon icon={cibPaypal} /> PayPal for transactions.</p>
            </div>
        </section>
    );
}

export default Contact;

