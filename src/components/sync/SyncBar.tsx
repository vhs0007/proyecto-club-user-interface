export default function SyncBar({ progress, dataName }: { progress: number; dataName: string }) {
  return (
    <div className="sync-bar">
      <span className="sync-bar-label">{dataName}</span>
      <div className="sync-bar-track">
        <div
          className="sync-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}