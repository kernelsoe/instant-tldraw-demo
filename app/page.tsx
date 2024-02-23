'use client'

import { useState } from 'react'

import TlDrawApp from './TlDraw'
import { db, useInstandb } from './useInstantDb'

// Visit https://instantdb.com/dash to get your APP_ID :)

function App() {
  const [visible, setVisible] = useState('all')
  const { isLoading, error, data } = db.useQuery({ changes: {} })
  const { store } = useInstandb({})

  // Read Data

  if (isLoading) {
    return <div>Fetching data...</div>
  }
  if (error) {
    return <div>Error fetching data: {error.message}</div>
  }

  const visibleTodos = data.changes.filter((todo) => {
    if (visible === 'all') return true
    return visible === 'remaining' ? !todo.done : todo.done
  })

  return (
    <div style={styles.container}>
      <TlDrawApp store={store} />
    </div>
  )
}

// Styles
// ----------
const styles = {
  container: {
    boxSizing: 'border-box',
    backgroundColor: '#fafafa',
    fontFamily: 'code, monospace',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  header: {
    letterSpacing: '2px',
    fontSize: '50px',
    fontColor: 'lightgray',
    marginBottom: '10px',
  },
  form: {
    boxSizing: 'inherit',
    display: 'flex',
    aignItems: 'center',
    border: '1px solid lightgray',
    borderBottomWidth: '0px',
    width: '350px',
  },
  toggleAll: {
    fontSize: '30px',
    cursor: 'pointer',
    marginLeft: '11px',
    marginTop: '-6px',
    width: '15px',
    marginRight: '12px',
  },
  input: {
    backgroundColor: 'transparent',
    fontFamily: 'code, monospace',
    width: '287px',
    padding: '10px',
    fontStyle: 'italic',
  },
  todoList: {
    boxSizing: 'inherit',
    width: '350px',
  },
  checkbox: {
    fontSize: '30px',
    marginLeft: '5px',
    marginRight: '20px',
    cursor: 'pointer',
  },
  todo: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px',
    border: '1px solid lightgray',
    borderBottomWidth: '0px',
  },
  todoText: {
    flexGrow: '1',
    overflow: 'hidden',
  },
  delete: {
    width: '25px',
    cursor: 'pointer',
    color: 'lightgray',
  },
  actionBar: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '328px',
    padding: '10px',
    border: '1px solid lightgray',
    fontSize: '10px',
  },
  footer: {
    marginTop: '20px',
    fontSize: '10px',
  },
}

export default App
