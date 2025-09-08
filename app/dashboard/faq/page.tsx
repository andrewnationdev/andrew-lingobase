import Link from "next/link";

export default function FAQPage() {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">FAQ & Website Instructions</h1>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">What is this website for?</h2>
        <p>
          This website is a platform for creating, editing, and sharing constructed languages (conlangs). You can manage phonology, dictionary, typology, articles, and more for each language you create.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">How do I sign up and log in?</h2>
        <p>
          Use the <Link href="/auth/sign-up" className="text-blue-600 underline">Sign Up</Link> page to create an account. Once registered, log in via the <Link href="/auth/login" className="text-blue-600 underline">Login</Link> page.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">How do I create a new conlang?</h2>
        <p>
          After logging in, go to your dashboard and click on <strong>Create Conlang</strong>. Fill in the required details and submit the form to start managing your new language.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">How do I edit phonology?</h2>
        <p>
          {`Navigate to your conlang's dashboard and select <strong>Edit Phonology</strong>. Use the interactive IPA chart to select phonemes, add allophones, and describe phonotactics. Save your changes to update the database.`}
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">How do I add words to the dictionary?</h2>
        <p>
          Go to the <strong>Dictionary</strong> section of your conlang. Use the form to add new words, definitions, part of speech, notes, and transliterations. You can search and edit words as needed.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Can I edit my user profile?</h2>
        <p>
          Yes. Visit your user page to update your description and view your conlangs. Only you can edit your own profile.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">How do I view or share my conlang?</h2>
        <p>
          {`Each conlang has a public view page. Share the link with others to showcase your language's features, dictionary, and phonology.`}
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Who can edit my conlang?</h2>
        <p>
          Only the author (creator) of a conlang can edit its data. Other users can view but not modify your conlang.
        </p>
      </section>
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Where can I get help?</h2>
        <p>
          If you need assistance, check this FAQ or contact the site administrator for support.
        </p>
      </section>
    </div>
  );
}