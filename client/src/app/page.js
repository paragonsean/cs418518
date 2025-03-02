import React from "react";
import Link from "next/link";

const Home = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto text-center px-6">
          <h1 className="text-4xl font-bold">
            Welcome to the College Course Portal
          </h1>
          <p className="mt-4 text-lg">
            Explore courses, track progress, and manage your academic journey
            efficiently.
          </p>
          <div className="mt-6 space-x-4">
            <Link href="/account/login">
              <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-gray-100">
                Login
              </button>
            </Link>
            <Link href="/account/register">
              <button className="px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg shadow-md hover:bg-yellow-600">
                Register
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6">
            Popular Course Categories
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Computer Science", icon: "💻" },
              { title: "Business & Management", icon: "📈" },
              { title: "Engineering", icon: "⚙️" },
              { title: "Arts & Humanities", icon: "🎭" },
              { title: "Sciences", icon: "🔬" },
              { title: "Health & Medicine", icon: "⚕️" },
            ].map((category, index) => (
              <div
                key={index}
                className="border p-6 rounded-lg shadow-md hover:shadow-lg"
              >
                <div className="text-4xl">{category.icon}</div>
                <h3 className="text-xl font-semibold mt-3">{category.title}</h3>
                <p className="text-gray-600 mt-2">
                  Explore top courses in {category.title}.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="bg-gray-100 py-20">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-semibold mb-6">
            Why Choose Our Course Portal?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Easy Course Enrollment",
                icon: "",
                desc: "Enroll in courses with a single click.",
              },
              {
                title: "Track Your Progress",
                icon: "📊",
                desc: "View grades, assignments, and schedules.",
              },
              {
                title: "24/7 Access",
                icon: "🌍",
                desc: "Learn anytime, anywhere.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="border p-6 rounded-lg shadow-md hover:shadow-lg"
              >
                <div className="text-3xl">{feature.icon}</div>
                <h3 className="text-xl font-semibold mt-3">{feature.title}</h3>
                <p className="text-gray-600 mt-2">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 text-center">
        <h2 className="text-3xl font-semibold">Ready to Start Learning?</h2>
        <p className="mt-2 text-lg">
          Sign up today and begin your academic journey!
        </p>
        <div className="mt-6">
          <Link href="/account/register">
            <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700">
              Register Now
            </button>
          </Link>
        </div>
      </section>
    </>
  );
};

export default Home;
