const suggestions = ["Data structures", "Biology", "World history", "Spanish verbs"];

export default function AIPromptBox() {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="font-serif text-3xl md:text-4xl">What do you want to study today?</h1>

      <div className="rounded-sm bg-inkwell p-5">
        <textarea
          rows={3}
          placeholder="e.g. I want to study data structures"
          className="w-full resize-none bg-transparent text-base text-chalk outline-none placeholder:text-chalk/40"
        />
        <div className="mt-3 flex justify-end">
          <button
            type="button"
            className="bg-gilt px-5 py-2.5 text-sm font-medium text-chalk rounded-sm transition duration-200 hover:bg-bone"
          >
            Send
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            className="rounded-full border border-bone/15 px-4 py-1.5 text-sm text-bone/70 transition hover:border-gilt hover:text-gilt"
          >
            {s}
          </button>
        ))}
      </div>
    </section>
  );
}