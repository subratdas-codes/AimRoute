function CareerSection() {
  const careers = [
    {
      title: "Software Engineer",
      icon: "💻",
      desc: "Build applications and software systems used by millions of users."
    },
    {
      title: "Data Scientist",
      icon: "📊",
      desc: "Analyze data and build machine learning models to solve problems."
    },
    {
      title: "UI/UX Designer",
      icon: "🎨",
      desc: "Design beautiful and user-friendly digital experiences."
    },
    {
      title: "Business Analyst",
      icon: "📈",
      desc: "Analyze business data and improve decision making."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-4xl font-bold mb-6">
          Explore <span className="text-purple-600">Popular Careers</span>
        </h2>

        <p className="text-gray-600 mb-16">
          Discover some of the most popular and high-demand career paths.
        </p>

        <div className="grid md:grid-cols-4 gap-8">

          {careers.map((career, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 cursor-pointer"
            >
              <div className="text-4xl mb-4">{career.icon}</div>

              <h3 className="text-lg font-semibold mb-2">
                {career.title}
              </h3>

              <p className="text-gray-600 text-sm">
                {career.desc}
              </p>

            </div>
          ))}

        </div>
      </div>
    </section>
  );
}

export default CareerSection;