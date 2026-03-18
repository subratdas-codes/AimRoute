import { useNavigate } from "react-router-dom";

import hero from "../../assets/hero.svg";
import icon1 from "../../assets/icon1.svg";
import icon2 from "../../assets/icon2.svg";
import icon3 from "../../assets/icon3.svg";
import icon4 from "../../assets/icon4.svg";
import icon5 from "../../assets/icon5.svg";
import icon6 from "../../assets/icon6.svg";
import CareerSection from "../../components/CareerSection";

import Footer from "../../components/Footer";
import HowItWorks from "../../components/HowItWorks";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white -mt-24">

      <div className="container mx-auto px-8 py-20 flex flex-col md:flex-row items-center justify-between">

        {/* LEFT CONTENT */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-5xl font-bold text-gray-800 leading-tight">
            Discover Careers That <br />
            <span className="text-purple-600">Match Who You Are.</span>
          </h1>

          <p className="text-gray-600 text-lg max-w-lg">
            Take a structured assessment and explore career paths tailored to your interests, strengths, and goals.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300"
          >
            Start Career Assessment
          </button>
        </div>

        {/* RIGHT SIDE HERO SECTION */}
        <div className="relative md:w-1/2 flex justify-center mt-12 md:mt-0">

          <div className="absolute w-[450px] h-[450px] bg-amber-200 rounded-full blur-3xl opacity-40"></div>

          <img
            src={hero}
            alt="hero"
            className="relative z-10 w-[400px] h-[520px] object-contain drop-shadow-2xl"
          />

          <img
            src={icon1}
            alt="icon1"
            className="absolute top-5 left-10 w-20 bg-gray-200 rounded-full shadow-xl float"
          />

          <img
            src={icon5}
            alt="icon5"
            className="absolute bottom-35 left-10 w-20 bg-gray-200 rounded-full shadow-xl float"
          />

          <img
            src={icon6}
            alt="icon6"
            className="absolute bottom-2 left-8 w-20 bg-gray-200 rounded-full shadow-xl float"
          />

          <img
            src={icon2}
            alt="icon2"
            className="absolute top-10 right-5 w-20 bg-gray-200 rounded-full shadow-xl float"
          />

          <img
            src={icon3}
            alt="icon3"
            className="absolute bottom-35 right-6 w-20 bg-gray-200 rounded-full shadow-xl float"
          />

          <img
            src={icon4}
            alt="icon4"
            className="absolute bottom-5 right-6 w-20 bg-gray-200 rounded-full shadow-xl float"
          />

        </div>
      </div>

      {/* FEATURES SECTION */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-4xl font-bold mb-6">
            Why Choose <span className="text-purple-600">AimRoute?</span>
          </h2>

          <p className="text-gray-600 mb-16">
            We help students discover the right career path using smart guidance and structured assessments.
          </p>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:shadow-purple-200 transition duration-300">
              <h3 className="text-xl font-semibold mb-3">AI-Based Assessment</h3>
              <p className="text-gray-600">
                Get personalized career recommendations based on your interests and strengths.
              </p>
            </div>

            <div className="p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:shadow-purple-200 transition duration-300">
              <h3 className="text-xl font-semibold mb-3">College Suggestions</h3>
              <p className="text-gray-600">
                Discover top colleges aligned with your selected career path.
              </p>
            </div>

            <div className="p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:shadow-purple-200 transition duration-300">
              <h3 className="text-xl font-semibold mb-3">Growth Roadmap</h3>
              <p className="text-gray-600">
                View a step-by-step roadmap to achieve your career goals confidently.
              </p>
            </div>

          </div>
        </div>
      </section>

      <CareerSection />
      <HowItWorks />
      <Footer />

    </div>
  );
}

export default Home;