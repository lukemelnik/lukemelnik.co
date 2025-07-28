type ClearButtonProps = {
  onClick: () => void;
};

export default function ClearButton({ onClick }: ClearButtonProps) {
  return (
    <button
      type="button"
      className="bg-foreground text-background text-bold cursor-pointer rounded-lg p-2 px-2 text-sm font-bold"
      onClick={onClick}
    >
      Clear
    </button>
  );
}
