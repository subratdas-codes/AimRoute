function HowItWorks() {
  return (
    <section className="py-20 bg-purple-50">
      <div className="max-w-6xl mx-auto px-6 text-center">

        <h2 className="text-4xl font-bold mb-12">
          How <span className="text-purple-600">AimRoute</span> Works
          </h2>

        <div className="grid md:grid-cols-4 gap-8">

          <div className="p-6">
            <div className="text-3xl font-bold text-purple-600 mb-3">01</div>
            <h3 className="font-semibold mb-2">Sign Up</h3>
            <p className="text-gray-600 text-sm">
              Create your account to access personalized career guidance.
            </p>
          </div>

          <div className="p-6">
            <div className="text-3xl font-bold text-purple-600 mb-3">02</div>
            <h3 className="font-semibold mb-2">Take Assessment</h3>
            <p className="text-gray-600 text-sm">
              Answer questions about your interests and strengths.
            </p>
          </div>

          <div className="p-6">
            <div className="text-3xl font-bold text-purple-600 mb-3">03</div>
            <h3 className="font-semibold mb-2">Get Results</h3>
            <p className="text-gray-600 text-sm">
              Receive recommended career paths based on analysis.
            </p>
          </div>

          <div className="p-6">
            <div className="text-3xl font-bold text-purple-600 mb-3">04</div>
            <h3 className="font-semibold mb-2">Explore Colleges</h3>
            <p className="text-gray-600 text-sm">
              Discover colleges aligned with your chosen career.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
}

export default HowItWorks;