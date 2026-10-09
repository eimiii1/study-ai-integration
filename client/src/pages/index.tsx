import AppLayout from "../layout/AppLayout";
import AIPromptBox from "../components/AIPromptBox";
import DeckPreviewGrid from "../components/DeckPreviewGrid";

export default function MainPage() {
  return (
    <AppLayout>
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted">Home</h2>
      <div className="flex flex-col gap-12">
        <AIPromptBox />
        <DeckPreviewGrid />
      </div>
    </AppLayout>
  );
}