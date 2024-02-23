import { Tldraw } from '@tldraw/tldraw'
import './index.css'

export default function TlDrawApp({ store }: { store: any }) {
  return (
    <div style={{ position: 'fixed', inset: 0 }}>
      <Tldraw store={store} />
    </div>
  )
}
