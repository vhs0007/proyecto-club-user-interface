export default function SyncBar({ progress }: { progress: number }, {dataName}: {dataName: string}) {
  return (
    <div className="sync-bar">
      <div className="sync-bar-inner">
        <span>{dataName}</span>
        <div className="sync-bar-inner-progress" style={{ width: `${progress}%` }}></div>
      </div>
    </div>
  )
}