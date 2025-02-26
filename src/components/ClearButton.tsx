type ClearButtonProps = {
  onClick: () => void;
};

export default function ClearButton({ onClick }: ClearButtonProps) {
  return (
    <button
      type="button"
      className="bg-foreground text-background rounded-lg p-1 px-2 cursor-pointer font-normal text-base"
      onClick={onClick}
    >
      Clear
    </button>
  );
}
