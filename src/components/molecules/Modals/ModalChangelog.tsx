import { MdCheckCircle, MdInfo, MdBuild } from "react-icons/md";
import { Button } from "../../atoms";
import ModalContainer from "./ModalContainer";
import { APP_CHANGELOG, ChangelogEntry, ChangelogRelease } from "../../../common/changelog";

interface ModalChangelogProps {
  isOpen: boolean;
  onDismiss: () => void;
}

const SECTION_CONFIG: {
  key: "added" | "changed" | "fixed";
  label: string;
  icon: React.ElementType;
  iconClass: string;
  bgClass: string;
}[] = [
  { key: "added", label: "Added", icon: MdCheckCircle, iconClass: "text-primary100", bgClass: "bg-primary10" },
  { key: "changed", label: "Changed", icon: MdInfo, iconClass: "text-primary90", bgClass: "bg-primary10" },
  { key: "fixed", label: "Fixed", icon: MdBuild, iconClass: "text-gold", bgClass: "bg-secondary10" },
];

const EntryBlock = ({ entry }: { entry: ChangelogEntry }) => (
  <div className="mb-3 last:mb-0">
    <p className="text-sm font-semibold text-blackBold">{entry.title}</p>
    {entry.details && entry.details.length > 0 && (
      <ul className="mt-1.5 pl-4 space-y-1 list-disc text-xs text-black70">
        {entry.details.map((d, i) => (
          <li key={i}>{d}</li>
        ))}
      </ul>
    )}
  </div>
);

const ReleaseBlock = ({ release }: { release: ChangelogRelease }) => (
  <div className="mb-6 last:mb-0">
    <div className="flex items-center gap-2 mb-3">
      <span className="text-base font-bold text-blackBold">{release.version}</span>
      {release.date && (
        <span className="text-xs text-black50">— {release.date}</span>
      )}
    </div>
    {SECTION_CONFIG.map(({ key, label, icon: Icon, iconClass, bgClass }) => {
      const items = release[key];
      if (!items || items.length === 0) return null;
      return (
        <div key={key} className="mb-4">
          <div className={`row gap-2 py-1.5 px-2 rounded-lg mb-2 ${bgClass}`}>
            <Icon size={16} className={iconClass} />
            <span className={`text-xs font-bold ${iconClass}`}>{label}</span>
          </div>
          <div className="pl-1">
            {items.map((entry, i) => (
              <EntryBlock key={i} entry={entry} />
            ))}
          </div>
        </div>
      );
    })}
  </div>
);

const ModalChangelog: React.FC<ModalChangelogProps> = ({ isOpen, onDismiss }) => {
  return (
    <ModalContainer isOpen={isOpen} onDismiss={onDismiss} scrollable>
      <div className="min-w-[320px] max-w-[400px]">
        <h3 className="text-lg font-bold text-blackBold mb-1">Changelog</h3>
        <p className="text-xs text-black70 mb-4">Perubahan dan pembaruan di aplikasi Casan.</p>
        <div className="divide-y divide-black10">
          {APP_CHANGELOG.map((release, i) => (
            <ReleaseBlock key={i} release={release} />
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-black10">
          <Button label="Tutup" onClick={onDismiss} />
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalChangelog;
