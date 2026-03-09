import SyncBar from "../../components/sync/SyncBar";

export default function Sync() {
  return (
    <div className="container">
      <h1>Sincronización de datos</h1>
      <p>Sincronizando datos...</p>
      <SyncBar progress={50} dataName="Usuarios" />
      <SyncBar progress={50} dataName="Actividades" />
      <SyncBar progress={50} dataName="Instalaciones" />
    </div>
  )
}