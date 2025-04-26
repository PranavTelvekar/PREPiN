// src/components/InterviewBook.js
import { Navigate, useParams } from 'react-router';
import './InterviewBook.css';
import React, { useEffect } from "react";
import { useNavigate } from 'react-router';

const amount = 100; // in INR

import server from '../../../environment';


function InterviewBook() {

  const {email,slot}=useParams();
  const navigate = useNavigate()

  //console.log("email :",email, "Slot : ",slot);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    const isScriptLoaded = await loadRazorpayScript();

    if (!isScriptLoaded) {
      alert("Razorpay SDK failed to load. Check your internet connection.");
      return;
    }

    const options = {
      key: "rzp_test_cHyq9CDlHoq8Ki",
      amount: amount * 100,
      currency: "INR",
      name: "MyService",
      description: "Test Transaction",
      image: "https://yourlogo.com/logo.png",
      handler: async function (response) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);

        // Send the data to backend
        try {
          const res = await fetch(`${server}/api/payment/${email}/${slot}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              paymentId: response.razorpay_payment_id,
              amount: amount,
              name: "Pranav Telvekar",
              email: "pranav@example.com",
              contact: "9999999999"
            })
          });
          navigate(`/student/${email}/my-interview`);

          const data = await res.json();
          if (res.ok) {
            console.log("Payment info saved:", data);
          } else {
            console.error("Error saving payment info:", data);
          }
          
        } catch (err) {
          console.error("Network or server error:", err);
        }
      },
      prefill: {
        name: "Pranav Telvekar",
        email: "pranav@example.com",
        contact: "9999999999"
      },
      notes: {
        address: "Kolhapur, Maharashtra"
      },
      theme: {
        color: "#0b72b9"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Pay ₹100</h2>
      <button onClick={handlePayment} style={{ padding: "10px 20px", fontSize: "16px" }}>
        Pay Now
      </button>
    </div>
  );
}

export default InterviewBook;
