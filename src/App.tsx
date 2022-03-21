import styled from "styled-components";
import "./App.css";
import Calculator from "./components/Calculator";

const CalculatorWrapper = styled.div`
	width: 300px;
	height: 500px;
`;

function App() {
	async function apiTest() {
		const response = await fetch("/test");
		const parsedResponse = await response.json();
	}

	return (
		<CalculatorWrapper>
			<Calculator />
		</CalculatorWrapper>
	);
}

export default App;
