import { id, init, tx } from '@instantdb/react'
import {
  TLAnyShapeUtilConstructor,
  TLStoreWithStatus,
  createTLStore,
  defaultShapeUtils,
} from '@tldraw/tldraw'
import { useEffect, useState } from 'react'

const APP_ID = 'REPLACE_ME_WITH'
export const db = init({ appId: APP_ID })

export function useInstandb({
  roomId = 'example-123',
  shapeUtils = [],
}: Partial<{
  hostUrl: string
  roomId: string
  version: number
  shapeUtils: TLAnyShapeUtilConstructor[]
}>) {
  const { isLoading, error, data } = db.useQuery({
    changes: {},
  })
  const [store] = useState(() => {
    const store = createTLStore({
      shapeUtils: [...defaultShapeUtils, ...shapeUtils],
    })

    return store
  })

  const [storeWithStatus, setStoreWithStatus] = useState<TLStoreWithStatus>({
    status: 'loading',
  })

  const cache = {}
  function myId(r) {
    cache[r.id] = cache[r.id] || id()
    return cache[r.id]
  }

  useEffect(() => {
    setStoreWithStatus({ status: 'loading' })

    if (isLoading) return
    const unsubs: (() => void)[] = []

    // 1.
    // Connect store to yjs store and vis versa, for both the document and awareness

    /* -------------------- Document -------------------- */
    unsubs.push(
      store.listen(
        function syncStoreChangesToYjsDoc({ changes }) {
          console.log('syncStoreChangesToYjsDoc', changes)
          db.transact(
            Object.values(changes.added).map((record) => {
              return tx.changes[myId(record)].update(record)
            })
          )

          db.transact(
            Object.values(changes.updated).map(([_, record]) => {
              return tx.changes[myId(record)].update(record)
            })
          )

          db.transact(
            Object.values(changes.removed).map((record) => {
              return tx.changes[myId(record)].delete()
            })
          )
        },
        { source: 'user', scope: 'document' } // only sync user's document changes
      )
    )

    setStoreWithStatus({
      store,
      status: 'synced-remote',
      connectionStatus: 'online',
    })

    let hasConnectedBefore = false

    return () => {
      unsubs.forEach((fn) => fn())
      unsubs.length = 0
    }
  }, [store, roomId, isLoading])

  return storeWithStatus
}
