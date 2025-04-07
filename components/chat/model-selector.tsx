import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ModelProvider } from "@/lib/ai/types";

interface ModelSelectorProps {
  value: ModelProvider;
  onChange: (value: ModelProvider) => void;
}

export function ModelSelector({ value, onChange }: ModelSelectorProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select AI Model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gemini">Google Gemini</SelectItem>
        <SelectItem value="ollama">Ollama (Local)</SelectItem>
      </SelectContent>
    </Select>
  );
} 