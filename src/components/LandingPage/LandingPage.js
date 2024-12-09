import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase";
import { setUserLogin } from "../../store/UserSlice";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOtpStage, setIsOtpStage] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [isResendAllowed, setIsResendAllowed] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    let timer;
    if (isOtpStage && countdown > 0) {
      timer = setInterval(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setIsResendAllowed(true);
    }
    return () => clearInterval(timer);
  }, [isOtpStage, countdown]);

  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = "hidden";
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setIsOtpStage(false);
    setPhoneNumber("");
    setOtp("");
    document.body.style.overflow = "";
  };

  const handlePhoneNumberChange = (event) => {
    const inputValue = event.target.value;
    const isValidPhoneNumber = /^\d{0,10}$/.test(inputValue);

    if (isValidPhoneNumber) {
      setPhoneNumber(inputValue);
    }
  };

  const configureRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        {
          size: "invisible",
        }
      );
    }
  };

  const handlePhoneNumberSubmit = async () => {
    if (phoneNumber) {
      configureRecaptcha();
      try {
        const authResult = await signInWithPhoneNumber(
          auth,
          `+91${phoneNumber}`,
          window.recaptchaVerifier
        );
        console.log(phoneNumber);
        setConfirmationResult(authResult);
        setIsOtpStage(true);
        setCountdown(60);
        setIsResendAllowed(false);
      } catch (error) {
        alert("Please Enter valid Mobile Number");
        console.error(error);
      }
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  const handleOtpSubmit = async () => {
    if (otp && confirmationResult) {
      try {
        const authResult = await confirmationResult.confirm(otp);
        const authUser = authResult.user;
        const token = await authUser.getIdToken();

        const userDocRef = doc(db, "users", authUser.uid);
        const userDoc = await getDoc(userDocRef);
        const user = userDoc.data();

        const companiesRef = collection(db, "companies");
        const q = query(
          companiesRef,
          where("createdBy.userRef", "==", userDocRef)
        );

        const company = await getDocs(q);
        const companiesData = company.docs.map((doc) => {
          const { createdBy, ...rest } = doc.data();
          return {
            companyId: doc.id,
            ...rest,
          };
        });

        const payload = {
          userId: user.uid,
          name: user.name || "",
          email: user.email || "",
          phone: user.phone_number || "",
          companies: companiesData || [],
          isLogin: true,
          selectedCompanyIndex: 0,
          token,
        };

        dispatch(setUserLogin(payload));
        alert("OTP verified successfully!");
        navigate("/invoiceList")
        closeModal();
      } catch (error) {
        alert("Invalid OTP. Please try again.");
        setOtp("");
      }
    } else {
      alert("Please enter the OTP.");
    }
  };

  const handleResendOtp = async () => {
    if (isResendAllowed) {
      configureRecaptcha();
      try {
        const authResult = await signInWithPhoneNumber(
          auth,
          `+91${phoneNumber}`,
          window.recaptchaVerifier
        );
        setConfirmationResult(authResult);
        setCountdown(60);
        setIsResendAllowed(false);
      } catch (error) {
        alert("Failed to resend OTP.");
      }
    }
  };
  return (
    <div className="text-gray-800 min-h-screen">
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 bg-white shadow-md z-10">
        <div className="text-2xl font-bold text-blue-500">Sunya</div>
        <div className="space-x-4">
          
          {/* <button
            className="bg-blue-500 text-white rounded-full px-4 py-1"
            onClick={openModal}
          >
            Log In
          </button> */}
        </div>
      </header>

      {/* <main className="flex flex-col items-center text-center space-y-4 mt-24">
        <h1 className="text-4xl font-bold">Business hua easy with SunyaApp</h1>
        <p className="text-xl">Manage your business effortlessly on desktop</p>
        <div className="flex space-x-2 items-center mt-4">
          <input
            type="tel"
            placeholder="+91 Enter your phone number"
            maxLength="10"
            onInput={(e) => {
              const input = e.target;
              input.value = input.value.replace(/[^0-9]/g, "").slice(0, 10);
            }}
            className="px-4 py-2 border rounded-md w-72"
            required
          />

          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Get Started
          </button>
        </div>

        <div className="flex space-x-6 mt-8">
          <div>
            <h3 className="text-lg font-semibold">
              Sales and purchase accounting
            </h3>
          </div>
          <div>
            <h3 className="text-lg font-semibold">GST/Non-GST bill creation</h3>
          </div>
          <div>
            <h3 className="text-lg font-semibold">
              Stock management with profit tracking
            </h3>
          </div>
        </div>
      </main> */}
      <div className="flex justify-center items-center h-screen">
        <div className="bg-white p-10 rounded-lg  bor w-full max-w-lg h-auto">
          <div className="flex items-center justify-center text-3xl font-bold text-blue-500">
            Sunya
          </div>
          <div className="flex items-center justify-center text-2xl font-bold my-6">
            Welcome to Sunya
          </div>

          <h2 className="text-1xl text-grey-500 mb-2">Enter phone number</h2>
          <div className="flex items-center mb-4">
            <span className="px-3 py-2 bg-gray-200 border border-r-0 rounded-l-md text-gray-700">
              +91
            </span>
            <input
              type="text"
              maxLength="10"
              placeholder="Enter your mobile number"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              className="px-4 py-2 border w-full focus:outline-none"
              required
            />
            {isOtpStage ? (
              <>
                <button
                  type="button"
                  className="px-3 py-2 border border-l-0 rounded-r-md text-gray-700"
                  onClick={() => setIsOtpStage(false)}
                >
                  Edit
                </button>
              </>
            ) : (
              ""
            )}
          </div>
          {!isOtpStage ? (
            <>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md w-full mt-4"
                onClick={handlePhoneNumberSubmit}
              >
                Submit
              </button>
            </>
          ) : (
            ""
          )}

          {isOtpStage ? (
            <>
              <h2 className="text-1xl text-grey-500 mb-2">Enter OTP</h2>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="px-4 py-2 border rounded-md w-full mb-4"
              />
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
                onClick={handleOtpSubmit}
              >
                Verify OTP
              </button>

              <div className="text-sm text-gray-500 mt-3">
                {countdown > 0
                  ? `You can request another OTP in ${countdown} seconds`
                  : ""}
              </div>
              {countdown === 0 && (
                <button
                  className="mt-2 text-blue-500 underline"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>
              )}
            </>
          ) : (
            " "
          )}

          <button
            onClick={closeModal}
            className="mt-4 text-blue-500 hover:underline w-full"
          >
            Close
          </button>
          <div className="flex flex-col items-center justify-center text-1xl text-gray-600 mt-7 mb-5 text-center">
            <span className="mr-1">
              By proceeding, you agree to our
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 ml-1"
              >
                Terms of Use
              </Link>
            </span>
            <span className="ml-1">
              {" and "}
              <Link
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800"
              >
                Privacy Policy
              </Link>
            </span>
          </div>
        </div>
      </div>
      {/* {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20"
          onClick={closeModal}
        >
          <div
            className="bg-white p-10 rounded-lg shadow-lg w-full max-w-lg h-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center text-3xl font-bold text-blue-500">
              Sunya
            </div>
            <div className="flex items-center justify-center text-2xl font-bold my-6">
              Welcome to Sunya
            </div>

            <h2 className="text-1xl text-grey-500 mb-2">Enter phone number</h2>
            <div className="flex items-center mb-4">
              <span className="px-3 py-2 bg-gray-200 border border-r-0 rounded-l-md text-gray-700">
                +91
              </span>
              <input
                type="text"
                maxLength="10"
                placeholder="Enter your mobile number"
                value={phoneNumber}
                onChange={handlePhoneNumberChange}
                className="px-4 py-2 border w-full focus:outline-none"
                required
              />
              {isOtpStage ? (
                <>
                  <button
                    type="button"
                    className="px-3 py-2 border border-l-0 rounded-r-md text-gray-700"
                    onClick={() => setIsOtpStage(false)}
                  >
                    Edit
                  </button>
                </>
              ) : (
                ""
              )}
            </div>
            {!isOtpStage ? (
              <>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md w-full mt-4"
                  onClick={handlePhoneNumberSubmit}
                >
                  Submit
                </button>
              </>
            ) : (
              ""
            )}

            {isOtpStage ? (
              <>
                <h2 className="text-1xl text-grey-500 mb-2">Enter OTP</h2>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="px-4 py-2 border rounded-md w-full mb-4"
                />
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
                  onClick={handleOtpSubmit}
                >
                  Verify OTP
                </button>

                <div className="text-sm text-gray-500 mt-3">
                  {countdown > 0
                    ? `You can request another OTP in ${countdown} seconds`
                    : ""}
                </div>
                {countdown === 0 && (
                  <button
                    className="mt-2 text-blue-500 underline"
                    onClick={handleResendOtp}
                  >
                    Resend OTP
                  </button>
                )}
              </>
            ) : (
              " "
            )}

            <button
              onClick={closeModal}
              className="mt-4 text-blue-500 hover:underline w-full"
            >
              Close
            </button>
            <div className="flex flex-col items-center justify-center text-1xl text-gray-600 mt-7 mb-5 text-center">
              <span className="mr-1">
                By proceeding, you agree to our
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800 ml-1"
                >
                  Terms of Use
                </Link>
              </span>
              <span className="ml-1">
                {" and "}
                <Link
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  Privacy Policy
                </Link>
              </span>
            </div>
          </div>
        </div>
      )} */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default LandingPage;
