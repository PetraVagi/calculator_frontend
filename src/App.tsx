import logo from "./logo.svg";
import "./App.css";

function App() {
	async function apiTest() {
		const response = await fetch("/test");
		const parsedResponse = await response.json();
		console.log(parsedResponse);
	}

	apiTest();

	return (
		<div className="App">
			<header className="App-header">
				<img src={logo} className="App-logo" alt="logo" />
				<p>
					Edit <code>src/App.tsx</code> and save to reload.
				</p>
				<a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
					Learn React
				</a>
			</header>
		</div>
	);
}

export default App;
