import { Icon, type IconName } from "./Icon";

export interface MenuPanelProps { onSettings?: () => void; onRename?: () => void; onLogout?: () => void }

function Row({ icon, label, danger, onClick }: { icon: IconName; label: string; danger?: boolean; onClick?: () => void }) {
  return (
    <button type="button" role="menuitem" className={`td-menurow${danger ? " td-menurow--danger" : ""}`} onClick={onClick}>
      <span className="td-menurow__badge"><Icon name={icon} /></span>
      {label}
      <Icon name="chevron" className="td-menurow__chev" />
    </button>
  );
}

export function MenuPanel({ onSettings, onRename, onLogout }: MenuPanelProps) {
  return (
    <div className="td-menu" role="menu">
      <div className="td-menu__head">MENU</div>
      <Row icon="settings" label="Ustawienia" onClick={onSettings} />
      <Row icon="edit" label="Zmień imię" onClick={onRename} />
      <hr />
      <Row icon="logout" label="Wyloguj" danger onClick={onLogout} />
    </div>
  );
}
