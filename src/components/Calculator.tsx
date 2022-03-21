import { useState } from "react";
import styled from "styled-components";
import { deviceSizes } from "../utils";

const MainContainer = styled.div`
	background-color: black;
	color: white;
	display: flex;
	flex-direction: column;
	height: 100vh;
	width: 100vw;
	@media screen and (min-width: ${deviceSizes.mobileL}) {
		max-width: 100%;
		max-height: 100%;
	}
`;

const ResultDisplay = styled.div`
	height: 30%;
	display: flex;
	align-items: flex-end;
	justify-content: flex-end;
	padding: 20px;
	font-size: 1.6rem;
	font-weight: 550;
`;

const InputArea = styled.div`
	display: flex;
	flex: 1;
`;

const Numbers = styled.div`
	display: grid;
	flex: 3;
	grid-template-columns: auto auto auto;
	grid-template-rows: auto auto auto;
`;

const Operations = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	background-color: grey;
`;

const Input = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 2rem;
	font-weight: bold;
`;

const numbers = Array.from(Array(10).keys()).reverse();
const operations = ["+", "-", "x", "/"];

export default function Calculator() {
	const [valueToDisplay, setValueToDisplay] = useState<string>("");
	const [restart, setRestart] = useState<boolean>(false);

	function onInput(input: string) {
		if (restart) {
			setValueToDisplay(input);
			setRestart(false);
		} else {
			setValueToDisplay(`${valueToDisplay}${input}`);
		}
	}

	function onEval() {
		// TODO call backend function
		setRestart(true);
		setValueToDisplay(eval(valueToDisplay));
	}

	return (
		<MainContainer>
			<ResultDisplay>{valueToDisplay}</ResultDisplay>
			<InputArea>
				<Numbers>
					{numbers.map((num: number, i: number) => (
						<Input key={`number_${i}`} onClick={() => onInput(num.toString())}>
							{num}
						</Input>
					))}
					<Input onClick={() => onInput(".")}>.</Input>
					<Input onClick={onEval}>=</Input>
				</Numbers>
				<Operations>
					{operations.map((op: string, i: number) => (
						<Input key={`op_${i}`} onClick={() => onInput(` ${op} `)}>
							{op}
						</Input>
					))}
				</Operations>
			</InputArea>
		</MainContainer>
	);
}
