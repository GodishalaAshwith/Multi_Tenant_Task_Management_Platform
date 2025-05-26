import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const Home = () => {
  useEffect(() => {
    AOS.init({ duration: 1000, once: false, mirror: true });
  }, []);

  return (
    <div className="bg-gray-100 font-sans custom-scrollbar">
      <style>
        {`
          ::-webkit-scrollbar {
            width: 8px;
          }
          ::-webkit-scrollbar-thumb {
            background: linear-gradient(to bottom, #1f2937, #111827);
            border-radius: 10px;
          }
        `}
      </style>
      {/* Hero Section */}
      <section
        className="h-screen bg-gradient-to-r from-gray-900 to-gray-800 text-white text-center flex flex-col items-center justify-center px-6"
        data-aos="fade-up"
      >
        <h1 className="text-6xl font-extrabold leading-tight max-w-4xl">
          Task Management Platform
        </h1>
        <p className="text-xl max-w-3xl mx-auto mt-4 text-gray-200">
          A secure multi-tenant platform for organizing teams and managing tasks
        </p>
        <Link
          to="/register"
          className="mt-6 px-8 py-3 bg-gray-700 text-white font-semibold rounded-lg shadow-lg hover:bg-gray-600 transition-all text-lg"
        >
          Get Started
        </Link>
      </section>

      {/* Core Features */}
      <section className="h-screen flex flex-col justify-center items-center text-center px-6 bg-white">
        <h2
          className="text-5xl font-bold mb-12 text-gray-900"
          data-aos="fade-up"
        >
          Core Features
        </h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            {
              title: "Organization Management",
              desc: "Create and manage your organization with secure data isolation.",
            },
            {
              title: "Role-Based Access",
              desc: "Control access with Admin, Manager, and Member roles.",
            },
            {
              title: "Team Collaboration",
              desc: "Invite team members and manage permissions efficiently.",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-gray-50 p-10 rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-2 border border-gray-200"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay={`${index * 200}`}
            >
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">
                {item.title}
              </h3>
              <p className="text-gray-700 text-lg">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section
        className="h-screen flex flex-col justify-center items-center bg-gray-100 text-center px-6"
        data-aos="fade-up"
      >
        <h2 className="text-5xl font-bold mb-12 text-gray-900">
          Platform Features
        </h2>
        <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            {
              title: "Multi-Tenant Architecture",
              desc: "Secure data isolation for each organization"
            },
            {
              title: "Role-Based Access",
              desc: "Admin, Manager, and Member role hierarchies"
            },
            {
              title: "Team Management",
              desc: "Invite and manage team members efficiently"
            }
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-white p-10 rounded-lg shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1 border border-gray-200"
              data-aos="fade-up"
              data-aos-anchor-placement="top-bottom"
              data-aos-delay={`${index * 200}`}
            >
              <h3 className="text-2xl font-semibold text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-700 mt-3 text-lg">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer
        className="bg-gray-900 text-white text-center py-8 relative z-10"
        data-aos="fade-up"
        data-aos-anchor-placement="bottom-bottom"
      >
        <p className="text-lg text-gray-200">
          &copy; {new Date().getFullYear()} TaskHub
        </p>
      </footer>
    </div>
  );
};

export default Home;
