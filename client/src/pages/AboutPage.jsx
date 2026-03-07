import React from 'react';

const AboutPage = () => {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:py-12 space-y-6">
      <section className="card p-6 md:p-8" data-anim>
        <p className="text-xs uppercase tracking-[0.25em] text-bakeryBrown/60">About</p>
        <h1 className="font-display text-4xl text-bakeryBrown mt-2">The Story Behind DELICIOUS BITES</h1>
        <p className="mt-4 text-sm md:text-base text-bakeryBrown/80 leading-relaxed">
          Delicious Bites was started by a passionate home baker who wanted families to enjoy
          celebration desserts made with clean ingredients and balanced sweetness. Every batch
          is handcrafted in a hygienic home kitchen with a focus on health-friendly indulgence.
        </p>
      </section>

      <section className="grid md:grid-cols-3 gap-4" data-anim>
        <article className="card p-4">
          <h2 className="font-semibold text-bakeryBrown">Owner Vision</h2>
          <p className="text-sm text-bakeryBrown/75 mt-2">
            Create joyful desserts without compromise on quality, freshness, or trust.
          </p>
        </article>
        <article className="card p-4">
          <h2 className="font-semibold text-bakeryBrown">Craft Promise</h2>
          <p className="text-sm text-bakeryBrown/75 mt-2">
            Small-batch baking, premium ingredients, and close attention to every order.
          </p>
        </article>
        <article className="card p-4">
          <h2 className="font-semibold text-bakeryBrown">Customer Promise</h2>
          <p className="text-sm text-bakeryBrown/75 mt-2">
            Transparent pricing, timely communication, and a memorable flavor experience.
          </p>
        </article>
      </section>
    </main>
  );
};

export default AboutPage;
