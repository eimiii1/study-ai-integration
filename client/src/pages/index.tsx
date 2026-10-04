import AppLayout from "../layout/AppLayout";
import AIPromptBox from "../components/AIPromptBox";
import DeckPreviewGrid from "../components/DeckPreviewGrid";

export default function MainPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-16">
        <AIPromptBox />
        <DeckPreviewGrid />
      </div>
    </AppLayout>
  );
}