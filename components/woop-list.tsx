import { Woop } from './woop';

interface WoopItem {
  text: string;
  encryptedValue: string;
  selfDestructing: boolean;
}

interface WoopListProps {
  woops: WoopItem[];
  removeWoop: (encryptedValue: string) => Promise<void>;
}

export function WoopList({ woops, removeWoop }: WoopListProps) {
  return (
    <div className="flex flex-col gap-2" role="list">
      {woops.map((woop) => (
        <Woop
          key={woop.encryptedValue}
          woop={woop.text}
          encryptedValue={woop.encryptedValue}
          selfDestructing={woop.selfDestructing}
          removeWoop={removeWoop}
        />
      ))}
    </div>
  );
}
