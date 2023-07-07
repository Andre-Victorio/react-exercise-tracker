
import "./Header.css"
export default function Header(){
  return(
    <div className="headerDiv">
      <h1>Practice With Routes</h1>
      <div>
        <form action="/tracker">
          <button>Tracker</button>
        </form>
      </div>
    </div>
  )
}
