import AppLayout from "../layout/AppLayout";
import AIPromptBox from "../components/AIPromptBox";
import DeckPreviewGrid from "../components/DeckPreviewGrid";

export default function MainPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-14">
        <AIPromptBox />
        <div className="h-px bg-line" />
        <DeckPreviewGrid />
      </div>
    </AppLayout>
  );
}