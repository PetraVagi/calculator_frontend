import styled from "styled-components";
import "./App.css";
import Calculator from "./components/Calculator";

const CalculatorWrapper = styled.div`
	width: 300px;
	height: 500px;
`;

function App() {
	return (
		<CalculatorWrapper>
			<Calculator />
		</CalculatorWrapper>
	);
}

export default App;
