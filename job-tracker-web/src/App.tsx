import './App.css'
import { useAuthStore } from './store/auth'

function App() {
  const { token, loginUser } = useAuthStore()

  return (
    <>
      <section id="center">
        <button type="button" className="counter" onClick={() => loginUser()}>
          Click Me 
        </button>
        <p>User Token is {token ? token : 'null'}</p>
      </section>

      <section id="spacer"></section>
    </>
  )
}

export default App
